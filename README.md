# @dojo/cli-build-widget

[![Build Status](https://travis-ci.org/dojo/cli-build.svg?branch=master)](https://travis-ci.org/dojo/cli-build-widget)
[![Build status](https://ci.appveyor.com/api/projects/status/31du0respjt6p98i/branch/master?svg=true)](https://ci.appveyor.com/project/Dojo/cli-build-widget/branch/master)
[![codecov](https://codecov.io/gh/dojo/cli-build-widget/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/cli-build-widget)
[![npm version](https://badge.fury.io/js/%40dojo%2Fcli-build-widget.svg)](https://badge.fury.io/js/%40dojo%2Fcli-build-widget)

The official CLI command for building Dojo 2 custom elements.

*WARNING* This is currently _alpha_ software. This is not yet production ready, so you should use at your own risk.

- [Usage](#usage)
- [Features](#features)
  - [Project Structure](#project-structure)
  - [Building](#building)
  - [Serving](#serving-an-example-page)
  - [Watching](#watching)
  - [Eject](#eject)
  - [Configuration](#configuration)
- [How do I contribute?](#how-do-i-contribute)
  - [Installation](#installation)
  - [Testing](#testing)
- [Licensing information](#licensing-information)

## Usage

To use `@dojo/cli-build-widget` in a single project, install the package:

```bash
npm install @dojo/cli-build-widget
```

## Features

`@dojo/cli-build-widget` is an optional command for the [`@dojo/cli`](https://github.com/dojo/cli).

By default widgets are built using an evergreen configuration, meaning that the build process:

* Preferring `.mjs` modules over `.js` modules
* Using `{ target: 'es6', module: 'esnext' }` Typescript compiler options
* Elides features based on the `chrome` flag from [`dojo/webpack-contrib`](https://github.com/dojo/webpack-contrib#available-features)

### Project Structure

A custom elements project is expected to have the following directory and file structure:

```
src/
	custom-element-parent/
		customElementParent.m.css
		CustomElementParent.ts
	custom-element-child/
		customElementChild.m.css
		CustomElementChild.ts
tests/
	unit/
	functional/
.dojorc
```

### Building

There are three modes available to build Dojo 2 custom elements: `dist`, `dev` and `test`. The mode required can be passed using the `--mode` flag:

```bash
dojo build widget --mode dist
```

The built custom element files are written to the `output/{mode selected}` directory. The output mirrors the `src` directory, so if a custom element is located at `src/custom-element/CustomElement.s`, the built element will be output to `output/{mode}/custom-element/CustomElement.js`.

Note: `dist` is the default mode and so can be run without any arguments, `dojo build widget`.

#### Dist Mode

The `dist` mode creates a production ready build.

#### Dev mode

The `dev` mode creates a build that has been optimized for debugging and development.

#### Test mode

The `test` mode creates bundles that can be used to run the unit and functional tests for the custom element(s).

### Serving An Example Page

A web server can be started with the `--serve` flag. By default, the build is served on port 9999, but this can be changed with the `--port` (`-p`) flag:

```bash
# build once and then serve on port 3000
dojo build -s -p 3000
```

### Watching

Building with the `--watch` option observes the file system for changes, and recompiles to the appropriate `output/{dist|dev|test}` directory, depending on the current `--mode`. When used in the conjunction with the `--serve` option and `--mode=dev`, `--watch=memory` can be specified to enable automatic browser updates and hot module replacement (HMR).

```bash
dojo build -w # start a file-based watch
dojo build -s -w=memory -m=dev # build to an in-memory file system with HMR
```

### Elements

The path for elements to build can be provided using the repeating options `--elements` or `-e`:

```bash
dojo build -e src/custom-element-child/CustomElementChild -e src/custom-element-parent/CustomElementParent
```

### Legacy

To build custom elements for legacy environments use the `--legacy` or `-l` flag. For custom elements built with the legacy flag will need to include the polyfill for the [native shim](https://github.com/webcomponents/custom-elements/blob/master/src/native-shim.js).

### Eject

Ejecting `@dojo/cli-build-widget` will produce the following files under the `config/build-widget` directory:

- `build-options.json`: the build-specific config options removed from the `.dojorc`
- `ejected.config.js`: the root webpack config that passes the build options to the appropriate mode-specific config based on the `--env.mode` flag's value.
- `base.config.js`: a common configuration used by the mode-specific configs.
- `dev.config.js`: the configuration used during development.
- `dist.config.js`: the production configuration.
- `test.config.js`: the configuration used when running tests.

As already noted, the dojorc's `build-widget` options are moved to `config/build-widget/build-options.json` after ejecting. Further, the modes are specified using webpack's `env` flag (e.g., `--env.mode=dev`), defaulting to `dist`. You can run a build using webpack with:

```bash
node_modules/.bin/webpack --config=config/build-widget/ejected.config.js --env.mode={dev|dist|test}
```

### Configuration

Custom element projects use a `.dojorc` file at the project root to control various aspects of development such as testing and building. This file is required to build custom elements, it MUST be valid JSON, and it MUST provide at least an `elements` array with the custom element paths. All other values are options. The following options can be used beneath the `"build-widget"` key:

#### `elements`: string[]

Contains paths _relative to the project root_ to the custom elements that should be built.

```json
{
	"build-widget": {
		"elements": [
			"src/menu-item/MenuItem",
			"src/menu/Menu"
		]
	}
}
```

#### `bundles`: object

Useful for breaking a build into smaller bundles, the `bundles` option is a map of webpack bundle names to arrays of modules that should be bundled together. For example, with the following configuration both `src/Foo` and `src/Bar` will be grouped in the `foo.[hash].js` bundle:

```
{
	"build-widget": {
		"bundles": {
			"foo": [
				"src/Foo",
				"src/Bar"
			]
		}
	}
}
```

#### `features`: object

A map of [`has`](https://github.com/dojo/has/) features to boolean flags that can be used when building in `dist` mode to remove unneeded imports or conditional branches. See the [`static-build-loader`](https://github.com/dojo/webpack-contrib/#static-build-loader) documentation for more information.

## How do I contribute?

We appreciate your interest! Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the Contributing Guidelines. This repository uses [prettier](https://prettier.io/) for code style and is configured with a pre-commit hook to automatically fix formatting issues on staged `.ts` files before performing the commit.

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `grunt dev` or `grunt dist`.

### Scripts

#### test

Builds a new test artifact from the repository source code and re-installs the `test-app` dependencies before running all unit and functional tests.

#### build-test-artifact

Builds and packages `cli-build-widget` as `dojo-cli-build-widget.tgz` in the `dist` directory.

#### generate-fixtures

Re-generates the test fixtures in `test-app`. Assumes that the dependencies have been installed for the test project.

#### prettier

Runs [prettier](https://prettier.io/) on all `.ts` files in the `src` and `tests` directories, this will fix any detected code style violations.

#### test-release

Generates a test release tarball that can be used as a drop-in dependency for testing changes with a custom elements project. **WARNING** This modifies `package-lock.json`, so be careful to undo the changes (`git checkout -- package-lock.json`) after running this script. See [_Workflow for custom package releases_](https://github.com/dojo/meta/wiki/Workflow-for-custom-package-releases) for more information.

### Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the BDD test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

The command is tested by running via the Dojo CLI and asserting the build output against known fixtures. To do this, a test artifact needs to be built and installed into the `test-app`:

```
npm test
```

Once the test artifact has been installed, if there have been no changes to the command code `grunt test` can be used to repeat the tests.
## Licensing information

© 2018 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
