# check-pkg-cli

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Features

- use command to check package.json object key.

## Installation

```sh
$ npm install -g check-pkg-cli

or

$ yarn global add check-pkg-cli
```

with 1 commands

- check-pck


## Quick Start

The quickest way to get started with chceck-pkg is to utilize the executable `check-pck` to check some key for package.json, as shown below:

Default

```bash
$ check-pkg

will return:

scripts：
start：npm publish .
```

Check Other key in package.jsonn

```bash
$ check-pck -K dependencies

or

$ check-pck --key dependencies
```

If you want to check more, you should do like this:

```bash
$ check-pck -K dependencies,name,bugs,scripts

or

check-pck -key dependencies,name,bugs,scripts
```

Check other directory package.json:

```bash
$ check-pck -T ../tmp

or

$ check-pck -target ../tmp
```


## Command Line Options

```bash
Usage: check-pkg [options] [dir]

Options:
  -V, --version        output the version number
  -K --key <items>     the key which you want to check in package.json
  -T --target [value]  the target package.json
  -h, --help           output usage information
```



## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/check-pkg-cli.svg
[npm-url]: https://npmjs.org/package/check-pkg-cli
[downloads-image]: https://img.shields.io/npm/dm/check-pkg-cli.svg
[downloads-url]: https://npmjs.org/package/check-pkg-cli