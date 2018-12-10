#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const _exit = process.exit;
const cliPkg = require('../package.json');

const version = cliPkg.version;

process.exit = exit;

/**
 * Graceful exit for async STDIO
 */

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

function exit (code) {
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done () {
        if (!(draining--)) _exit(code);
    }

    let draining = 0;
    const streams = [process.stdout, process.stderr];

    exit.exited = true;

    streams.forEach(function (stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}

/**
 * Install a before function; AOP.
 */

function before (obj, method, fn) {
    const old = obj[method];

    obj[method] = function () {
        fn.call(this);
        old.apply(this, arguments);
    };
}

/**
 * Determine if launched from cmd.exe
 */
function launchedFromCmd () {
    return process.platform === 'win32'
        && process.env._ === undefined;
}

function handleInvoke (pkg, key) {
    key = key.trim();
    if (pkg.hasOwnProperty(key)) {
        const item = pkg[key];
        console.log(`\n${key}：`.error);
        if (typeof item === 'string') {
            console.log(`${pkg[key]}`.info);
        } else if (item instanceof Array) {
            console.log(`${item.join(',')}`.info);
        } else if (typeof item === 'object') {
            const str = Object.keys(item).map(v => {
                return `${v}：${item[v]}`;
            }).join('\n');
            console.log(`${str}`.info);
        }
    } else {
        console.log(`\n${key}：`.error);
        console.log(`no exist key name is ${key}`.error);
    }
}

function excuteCommand (path, key = 'scripts') {
    const content = fs.readFileSync(path, 'utf8');
    const pkg = JSON.parse(content);
    if (typeof key === 'string') {
        handleInvoke(pkg, key);
    } else if (key instanceof Array) {
        key.forEach(k => {
            handleInvoke(pkg, k);
        });
    } else {
        console.log(`\nThe args is invalidate`.error);
    }
    console.log();
}

/**
 * Main program.
 */

function main () {
    // Path
    const PKG_NAME = 'package.json';
    const destinationPath = program.pkg || '.';

    let _name = null;
    if (destinationPath.includes(PKG_NAME)) {
        _name = destinationPath;
    } else {
        _name = path.join(destinationPath, PKG_NAME);
    }
    const isExist = fs.existsSync(_name);
    if (isExist) {
        excuteCommand(_name, program.key);
    } else {
        console.log(`\nthe package.json is not exist in target directory\n`.error);
        exit(1);
    }

}

before(program, 'outputHelp', function () {
    this.allowUnknownOption();
});

program
    .version(version)
    .usage('[options] [dir]')
    .option('-K --key <items>', 'the key which you want to check in package.json', (val) => {
        return val.split(',');
    })
    .option('-T --target [value]', 'the target package.json')
    .parse(process.argv);

if (!exit.exited) {
    main();
}
