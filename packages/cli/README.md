# `@react-navigation/cli`
CLI tool for package installation with automatic installation of peer dependencies.

Installation instructions and documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/cli).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/cli
```

## Usage

```sh
Commands:
  add|a [options] <package>  install your required package
  help [command]             display help for command

Options:
  -V, --version              output the version number
  -h, --help                 display help for command
```

### Add a package

We do that using the **add** command.

It allow us to install a package with all it's peer dependencies automatically. Peer dependencies doesn't get installed by default. And are up for the users to install them and choose the versions they want.

```ts
rnav add stack --verbose --installer=npm
```

Force npm installer option example.

```sh
Options:

  -i, --installer <installer>  Choose the installer to use manually
  -V, --verbose                output in verbose mode
  -d, --debug                  output extra debugging
  -h, --help                   display help for command
```

```ts
rnav add stack -d -i npm
```

An example with shorthands.
