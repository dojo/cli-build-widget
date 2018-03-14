import { Command, EjectOutput, Helper, OptionsHelper } from '@dojo/cli/interfaces';
import * as express from 'express';
import * as logUpdate from 'log-update';
import * as ora from 'ora';
import * as path from 'path';
import * as webpack from 'webpack';
import chalk from 'chalk';

const pkgDir = require('pkg-dir');
import devConfigFactory from './dev.config';
import testConfigFactory from './test.config';
import distConfigFactory from './dist.config';
import logger from './logger';
import { moveBuildOptions, getElementName } from './util';

const fixMultipleWatchTrigger = require('webpack-mild-compile');
const hotMiddleware = require('webpack-hot-middleware');
const webpackMiddleware = require('webpack-dev-middleware');

function createCompiler(config: webpack.Configuration[]) {
	const compiler = webpack(config);
	fixMultipleWatchTrigger(compiler);
	return compiler;
}

function createWatchCompiler(config: webpack.Configuration[]) {
	const compiler = createCompiler(config);
	const spinner = ora('building').start();
	compiler.plugin('invalid', () => {
		logUpdate('');
		spinner.start();
	});
	compiler.plugin('done', () => {
		spinner.stop();
	});
	return compiler;
}

function build(config: webpack.Configuration[], args: any) {
	const compiler = createCompiler(config);
	const spinner = ora('building').start();
	return new Promise<void>((resolve, reject) => {
		compiler.run((err, stats) => {
			spinner.stop();
			if (err) {
				reject(err);
			}
			if (stats) {
				const runningMessage = args.serve ? `Listening on port ${args.port}...` : '';
				logger(stats.toJson(), config, runningMessage);
			}
			resolve();
		});
	});
}

function buildNpmDependencies(): any {
	try {
		const packagePath = pkgDir.sync(__dirname);
		const packageJsonFilePath = path.join(packagePath, 'package.json');
		const packageJson = require(packageJsonFilePath);

		return {
			[packageJson.name]: packageJson.version,
			...packageJson.dependencies
		};
	} catch (e) {
		throw new Error(`Failed reading dependencies from package.json - ${e.message}`);
	}
}

function fileWatch(configs: webpack.Configuration[], args: any): Promise<void> {
	const compiler = createWatchCompiler(configs);

	return new Promise<void>((resolve, reject) => {
		const watchOptions = configs[0].watchOptions as webpack.Compiler.WatchOptions;
		compiler.watch(watchOptions, (err, stats) => {
			if (err) {
				reject(err);
			}
			if (stats) {
				const runningMessage = args.serve ? `Listening on port ${args.port}` : 'watching...';
				logger(stats.toJson(), configs, runningMessage);
			}
			resolve();
		});
	});
}

function memoryWatch(configs: webpack.Configuration[], args: any, app: express.Application): Promise<void> {
	const timeout = 20 * 1000;

	configs.forEach(config => {
		config.plugins!.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin());
	});

	configs.forEach((config: any) => {
		Object.keys(config.entry).forEach(name => {
			config.entry[name].unshift(`webpack-hot-middleware/client?timeout=${timeout}&reload=true`);
		});
	});

	const watchOptions = configs[0].watchOptions as webpack.Compiler.WatchOptions;
	const compiler = createWatchCompiler(configs);

	compiler.plugin('done', stats => {
		logger(stats.toJson(), configs, `Listening on port ${args.port}...`);
	});

	app.use(
		webpackMiddleware(compiler, {
			logLevel: 'silent',
			noInfo: true,
			publicPath: '/',
			watchOptions
		}),
		hotMiddleware(compiler, {
			heartbeat: timeout / 2
		})
	);

	return Promise.resolve();
}

function serve(configs: webpack.Configuration[], args: any): Promise<void> {
	const app = express();

	if (args.watch !== 'memory') {
		configs.forEach(config => {
			const outputDir = (config.output && config.output.path) || process.cwd();
			app.use(express.static(outputDir));
		});
	}

	return Promise.resolve()
		.then(() => {
			if (args.watch === 'memory' && args.mode === 'dev') {
				return memoryWatch(configs, args, app);
			}

			if (args.watch) {
				if (args.watch === 'memory') {
					console.warn('Memory watch requires `--mode=dev`. Using file watch instead...');
				}
				return fileWatch(configs, args);
			}

			return build(configs, args);
		})
		.then(() => {
			return new Promise<void>((resolve, reject) => {
				app.listen(args.port, (error: Error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
			});
		});
}

const CONFIG_DEFAULTS = {
	legacy: false,
	port: 9999,
	mode: 'dist'
};

function filterCommandLineArgs(commandLineArgs: any) {
	return Object.keys(commandLineArgs).reduce(
		(result, key) => {
			if (commandLineArgs[key] !== undefined) {
				result[key] = commandLineArgs[key];
			}
			return result;
		},
		{} as any
	);
}

function createElementsConfig(elements: any[]): any[] {
	return elements.map((element: any) => {
		return {
			name: getElementName(element),
			path: element
		};
	});
}

const command: Command = {
	group: 'build',
	name: 'widget',
	description: 'create a build of your custom element',
	register(options: OptionsHelper) {
		options('mode', {
			describe: 'the output mode',
			alias: 'm',
			choices: ['dist', 'dev', 'test'],
			default: undefined
		});

		options('watch', {
			describe: 'watch for file changes: "memory" (dev mode only) or "file" (all modes; default)',
			alias: 'w'
		});

		options('serve', {
			describe: 'start a webserver',
			alias: 's',
			type: 'boolean'
		});

		options('elements', {
			describe: 'custom elements to build',
			alias: 'e',
			type: 'array'
		});

		options('legacy', {
			describe: 'Build custom elements with legacy support',
			alias: 'l',
			type: 'boolean',
			default: undefined
		});

		options('port', {
			describe: 'used in conjunction with the serve option to specify the webserver port',
			alias: 'p',
			type: 'number',
			default: undefined
		});
	},
	run(helper: Helper, args: any) {
		console.log = () => {};
		let { elements = [], ...rc } = (helper.configuration.get() || {}) as any;
		let { elements: commandLineElements, ...commandLineArgs } = args;

		elements = createElementsConfig(commandLineElements || elements);
		commandLineArgs = filterCommandLineArgs(commandLineArgs);

		let webpackConfigs: webpack.Configuration[];
		let buildConfig: any = { ...CONFIG_DEFAULTS, ...rc, ...commandLineArgs };

		if (buildConfig.mode === 'dev') {
			webpackConfigs = elements.map((element: any) => devConfigFactory({ ...buildConfig, element }));
		} else if (buildConfig.mode === 'test') {
			webpackConfigs = [testConfigFactory({ ...buildConfig, elements, legacy: true })];
		} else {
			webpackConfigs = elements.map((element: any) => distConfigFactory({ ...buildConfig, element }));
		}

		if (webpackConfigs.length === 0) {
			console.warn('No elements specified in the .dojorc');
			return Promise.resolve();
		}

		if (args.serve) {
			return serve(webpackConfigs, args);
		}

		if (args.watch) {
			if (args.watch === 'memory') {
				console.warn('Memory watch requires the dev server. Using file watch instead...');
			}
			return fileWatch(webpackConfigs, args);
		}

		return build(webpackConfigs, args);
	},
	eject(helper: Helper): EjectOutput {
		return {
			copy: {
				path: __dirname,
				files: [
					moveBuildOptions(`${this.group}-${this.name}`),
					'./base.config.js',
					'./dev.config.js',
					'./dist.config.js',
					'./ejected.config.js',
					'./test.config.js',
					'./util.js'
				]
			},
			hints: [
				`to build run ${chalk.underline(
					'./node_modules/.bin/webpack --config ./config/build-widget/ejected.config.js --env.mode={dev|dist|test}'
				)}`
			],
			npm: {
				devDependencies: { ...buildNpmDependencies() }
			}
		};
	}
};
export default command;
