const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import { join } from 'path';
import { SinonStub, stub } from 'sinon';
import chalk from 'chalk';
import MockModule from '../support/MockModule';
import { existsSync, readFileSync } from 'fs';
import { Helper } from '@dojo/cli/interfaces';
import Ajv = require('ajv');

let mockModule: MockModule;
let mockLogger: SinonStub;
let mockSpinner: any;
let mockDevConfig: any;
let mockDistConfig: any;
let mockUnitTestConfig: any;
let mockFunctionalTestConfig: any;
let compiler: any;
let isError: boolean;
let stats: any;
let consoleStub: any;
let consoleWarnStub: any;
let doneHookStub: SinonStub;
let invalidHookStub: SinonStub;
let runStub: SinonStub;
let watchStub: SinonStub;

function getMockHelper(config: any = {}): Partial<Helper> {
	return {
		configuration: {
			get() {
				return { ...config, widgets: ['widget'] };
			},
			set() {
				return {};
			}
		},
		validation: {
			validate: () => Promise.resolve(true)
		}
	};
}

describe('command', () => {
	beforeEach(() => {
		isError = false;
		stats = {
			toJson() {
				return 'stats';
			}
		};
		mockModule = new MockModule('../../src/main', require);
		mockModule.dependencies([
			'./dev.config',
			'./dist.config',
			'./unit.config',
			'./functional.config',
			'./logger',
			'express',
			'log-update',
			'ora',
			'webpack',
			'postcss-import',
			'webpack-mild-compile',
			'webpack-dev-middleware',
			'webpack-hot-middleware'
		]);
		doneHookStub = stub().callsFake((name: string, callback: Function) => callback(stats));
		invalidHookStub = stub().callsFake((name: string, callback: Function) => callback());
		runStub = stub().callsFake((callback: Function) => {
			callback(isError, stats);
		});
		watchStub = stub().callsFake((options: any, callback: Function) => {
			callback(isError, stats);
		});
		mockSpinner = {
			start: stub().returnsThis(),
			stop: stub().returnsThis()
		};
		mockModule.getMock('ora').ctor.returns(mockSpinner);
		compiler = {
			compilers: [],
			hooks: {
				done: { tap: doneHookStub },
				invalid: { tap: invalidHookStub }
			},
			run: runStub,
			watch: watchStub
		};
		mockModule.getMock('webpack').ctor.returns(compiler);
		mockDevConfig = mockModule.getMock('./dev.config').default;
		mockDistConfig = mockModule.getMock('./dist.config').default;
		mockUnitTestConfig = mockModule.getMock('./unit.config').default;
		mockFunctionalTestConfig = mockModule.getMock('./functional.config').default;
		mockDevConfig.returns('dev config');
		mockDistConfig.returns('dist config');
		mockUnitTestConfig.returns('unit config');
		mockFunctionalTestConfig.returns('functional config');
		mockLogger = mockModule.getMock('./logger').default;

		consoleWarnStub = stub(console, 'warn');
		consoleStub = stub(console, 'log');
	});

	afterEach(() => {
		mockModule.destroy();
		consoleStub.restore();
		consoleWarnStub.restore();
	});

	it('registers the command options', () => {
		const main = mockModule.getModuleUnderTest().default;
		const optionsStub = stub();
		main.register(optionsStub);
		assert.isTrue(
			optionsStub.calledWith('mode', {
				describe: 'the output mode',
				alias: 'm',
				default: 'dist',
				choices: ['dist', 'dev', 'test', 'unit', 'functional']
			})
		);
	});

	it('can run dev mode', () => {
		const main = mockModule.getModuleUnderTest().default;
		main.run(getMockHelper(), { mode: 'dev' }).then(() => {
			assert.isTrue(mockDevConfig.called);
			assert.isTrue(mockLogger.calledWith('stats', ['dev config'], false));
		});
	});

	it('can run dist mode', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'dist' }).then(() => {
			assert.isTrue(mockDistConfig.called);
			assert.isTrue(mockLogger.calledWith('stats', ['dist config'], false));
		});
	});

	it('can run unit mode', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'unit' }).then(() => {
			assert.isTrue(mockUnitTestConfig.called);
			assert.isTrue(mockLogger.calledWith('stats', ['unit config'], false));
		});
	});

	it('can run functional mode', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'functional' }).then(() => {
			assert.isTrue(mockFunctionalTestConfig.called);
			assert.isTrue(mockLogger.calledWith('stats', ['functional config'], false));
		});
	});

	it('falls back to unit mode and logs a warning when depracated test mode is used', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'test' }).then(() => {
			assert.isTrue(mockUnitTestConfig.called);
			assert.isTrue(mockLogger.calledWith('stats', ['unit config'], false));
			assert.isTrue(
				consoleWarnStub.calledWith(
					'Using `--mode=test` is deprecated and has only built the unit test bundle. This mode will be removed in the next major release, please use `unit` or `functional` explicitly instead.'
				)
			);
		});
	});

	it('logger not called if stats are not returned', () => {
		stats = null;
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'unit' }).then(() => {
			assert.isTrue(mockUnitTestConfig.called);
			assert.isTrue(mockLogger.notCalled);
		});
	});

	it('rejects if an error occurs', () => {
		isError = true;
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), { mode: 'unit' }).then(
			() => {
				throw new Error();
			},
			(e: Error) => {
				assert.isTrue(e);
			}
		);
	});

	it('console.log is silenced during run', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), {}).then(() => {
			console.log('called');
			assert.isTrue(consoleStub.notCalled);
		});
	});

	it('shows a building spinner on start', () => {
		const main = mockModule.getModuleUnderTest().default;
		return main.run(getMockHelper(), {}).then(() => {
			assert.isTrue(mockModule.getMock('ora').ctor.calledWith('building'));
			assert.isTrue(mockSpinner.start.called);
			assert.isTrue(mockSpinner.stop.called);
		});
	});

	describe('watch option', () => {
		it('automatically rebuilds after file changes', () => {
			const main = mockModule.getModuleUnderTest().default;
			return main.run(getMockHelper(), { watch: true }).then(() => {
				assert.isFalse(runStub.called);
				assert.isTrue(watchStub.calledOnce);
			});
		});

		it('rejects if an error occurs', () => {
			isError = true;
			const main = mockModule.getModuleUnderTest().default;
			return main.run(getMockHelper(), { watch: true }).then(
				() => {
					throw new Error();
				},
				(e: Error) => {
					assert.isTrue(e);
				}
			);
		});

		it('shows a building spinner', () => {
			const main = mockModule.getModuleUnderTest().default;
			return main.run(getMockHelper(), { watch: true }).then(() => {
				assert.isTrue(mockModule.getMock('ora').ctor.calledWith('building'));
				assert.isTrue(mockSpinner.start.called);
				assert.isTrue(mockSpinner.stop.called);
			});
		});

		it('provides custom logging', () => {
			const main = mockModule.getModuleUnderTest().default;
			const filename = '/changed/file.ts';

			doneHookStub.callsFake((name: string, callback: Function) => callback(stats));
			invalidHookStub.callsFake((name: string, callback: Function) => callback(filename));

			return main.run(getMockHelper(), { watch: true }).then(() => {
				assert.isTrue(mockLogger.calledWith('stats', ['dist config'], false, 'watching...'));
			});
		});

		it('warns when attempting memory watch without the dev server', () => {
			const main = mockModule.getModuleUnderTest().default;
			return main.run(getMockHelper(), { watch: 'memory' }).then(() => {
				assert.isTrue(consoleWarnStub.calledWith('Memory watch requires the dev server. Using file watch instead...'));
			});
		});
	});

	describe('serve option', () => {
		const entry = { main: [] };
		const watchOptions = {};
		let listenStub: SinonStub;
		let output: any;
		let plugins: any[];
		let useStub: SinonStub;
		let webpack: any;

		beforeEach(() => {
			webpack = mockModule.getMock('webpack').ctor;
			entry.main.length = 0;
			output = { publicPath: '/' };
			plugins = [];
			mockDevConfig.returns({ entry, output, plugins, watchOptions });
			mockDistConfig.returns({ entry, output, plugins, watchOptions });

			webpack.HotModuleReplacementPlugin = stub();
			webpack.NoEmitOnErrorsPlugin = stub();

			useStub = stub();
			listenStub = stub().callsFake((port: string, callback: Function) => {
				callback(false);
			});

			const expressMock = mockModule.getMock('express').ctor;
			expressMock.static = stub();
			expressMock.returns({
				listen: listenStub,
				use: useStub
			});
		});

		it('starts a webserver on the specified port', () => {
			const main = mockModule.getModuleUnderTest().default;
			const port = 3000;
			return main.run(getMockHelper(), { serve: true, port }).then(() => {
				assert.isTrue(listenStub.calledWith(port));
			});
		});

		it('serves from the output directory', () => {
			const main = mockModule.getModuleUnderTest().default;
			const express = mockModule.getMock('express').ctor;
			const outputDir = '/output/dist';
			output.path = outputDir;
			return main.run(getMockHelper(), { serve: true, watch: true }).then(() => {
				assert.isTrue(express.static.calledWith(outputDir));
				assert.isTrue(watchStub.called);
			});
		});

		it('fails on error', () => {
			const main = mockModule.getModuleUnderTest().default;
			listenStub.callsFake((port: string, callback: Function) => {
				return {
					on(_: any, callback: any) {
						callback(new Error());
					}
				};
			});
			return main.run(getMockHelper(), { serve: true }).then(
				() => {
					throw new Error();
				},
				(e: Error) => {
					assert.isDefined(e);
				}
			);
		});

		it('limits --watch=memory to --mode=dev', () => {
			const main = mockModule.getModuleUnderTest().default;
			return main.run(getMockHelper(), { serve: true, watch: 'memory' }).then(() => {
				assert.isTrue(consoleWarnStub.calledWith('Memory watch requires `--mode=dev`. Using file watch instead...'));
			});
		});

		it('registers middleware with --watch=memory', () => {
			const main = mockModule.getModuleUnderTest().default;
			const webpackMiddleware = mockModule.getMock('webpack-dev-middleware').ctor;
			const hotMiddleware = mockModule.getMock('webpack-hot-middleware').ctor;
			return main
				.run(getMockHelper(), {
					mode: 'dev',
					serve: true,
					watch: 'memory'
				})
				.then(() => {
					assert.strictEqual(useStub.callCount, 1);
					assert.isTrue(
						webpackMiddleware.calledWith(compiler, {
							logLevel: 'silent',
							noInfo: true,
							publicPath: '/',
							watchOptions
						})
					);
					assert.isTrue(
						hotMiddleware.calledWith(compiler, {
							heartbeat: 10000
						})
					);
				});
		});

		it('enables hot module replacement with --watch=memory', () => {
			const main = mockModule.getModuleUnderTest().default;
			return main
				.run(getMockHelper(), {
					mode: 'dev',
					serve: true,
					watch: 'memory'
				})
				.then(() => {
					assert.lengthOf(plugins, 2);
					assert.isTrue(webpack.HotModuleReplacementPlugin.calledWithNew());
					assert.isTrue(webpack.NoEmitOnErrorsPlugin.calledWithNew());
					assert.sameMembers(entry.main, ['webpack-hot-middleware/client?timeout=20000&reload=true']);
				});
		});

		it('provides custom logging with --watch=memory', () => {
			const main = mockModule.getModuleUnderTest().default;

			doneHookStub.callsFake((name: string, callback: Function) => {
				callback(stats);
			});

			return main
				.run(getMockHelper(), {
					mode: 'dev',
					port: 3000,
					serve: true,
					watch: 'memory'
				})
				.then(() => {
					assert.isTrue(
						mockLogger.calledWith(
							'stats',
							[{ entry, output, plugins, watchOptions }],
							false,
							'Listening on port 3000...'
						)
					);
				});
		});
	});

	describe('eject', () => {
		const basePath = process.cwd();

		beforeEach(() => {
			mockModule.dependencies(['pkg-dir']);
			mockModule.getMock('pkg-dir').ctor.sync = stub().returns(basePath);
		});

		it('outputs the ejected config and updates package dev dependencies', () => {
			const main = mockModule.getModuleUnderTest().default;
			const packageJson = require(join(basePath, 'package.json'));
			const ejectOptions = main.eject(getMockHelper());
			const rcPattern = /build-options\.json$/;

			assert.lengthOf(ejectOptions.copy.files.filter((file: string) => rcPattern.test(file)), 1);

			ejectOptions.copy.files = ejectOptions.copy.files.filter((file: string) => !rcPattern.test(file));
			assert.deepEqual(ejectOptions, {
				copy: {
					path: join(basePath, 'dist/dev/src'),
					files: [
						'./base.config.js',
						'./dev.config.js',
						'./dist.config.js',
						'./ejected.config.js',
						'./template/custom-element.js',
						'./unit.config.js',
						'./functional.config.js',
						'./util.js'
					]
				},
				hints: [
					`to build run ${chalk.underline(
						'./node_modules/.bin/webpack --config ./config/build-widget/ejected.config.js --env.mode={dev|dist|unit|functional} --env.target={"custom element"|lib}'
					)}`
				],
				npm: {
					devDependencies: {
						[packageJson.name]: packageJson.version,
						...packageJson.dependencies
					}
				}
			});
		});

		it('throws an error when ejecting when deps cannot be read', () => {
			const message = 'Keyboard not found. Press F1 to resume.';
			mockModule.getMock('pkg-dir').ctor.sync.throws(() => new Error(message));
			assert.throws(
				() => {
					const main = mockModule.getModuleUnderTest().default;
					main.eject(getMockHelper());
				},
				Error,
				`Failed reading dependencies from package.json - ${message}`
			);
		});
	});

	describe('validate', () => {
		beforeEach(() => {
			mockModule.dependencies(['fs', 'path']);
			mockModule.getMock('fs').readFileSync = stub().returns('{}');
			mockModule.getMock('path').join = stub().returns('schema.json');
		});

		it('validate is called and reads the schema file', async () => {
			const readFileSyncStub = mockModule.getMock('fs').readFileSync;
			const main = mockModule.getModuleUnderTest().default;
			const result = main.validate(getMockHelper());
			result
				.then((valid: boolean) => {
					assert.isTrue(valid);
					assert.equal(readFileSyncStub.callCount, 1, 'readFileSync should only be called once');
					assert.equal(
						readFileSyncStub.getCall(0).args[0],
						'schema.json',
						'validate should be called with schema.json as schema'
					);
				})
				.catch((error: Error) => {
					throw new Error('validation should not throw an error');
				});
		});

		it('throw an error if schema.json is not found', async () => {
			const main = mockModule.getModuleUnderTest().default;
			const readFileError = "ENOENT: no such file or directory, open 'schema.json'";
			mockModule.getMock('fs').readFileSync = stub().throws(readFileError);
			main
				.validate(getMockHelper())
				.then(() => {
					throw new Error('should not resolve');
				})
				.catch((error: Error) => {
					assert.strictEqual(
						error.message,
						`The dojorc schema for cli-build-widget could not be read: ${readFileError}`
					);
				});
		});
	});

	describe('schema', () => {
		let path: string;

		beforeEach(() => {
			path = join(__dirname, '../../src/schema.json');
		});

		it('is well formed json', () => {
			const exists = existsSync(path);
			assert.isTrue(exists, 'schema file should exist');
			assert.doesNotThrow(() => {
				const schema = readFileSync(path).toString();
				JSON.parse(schema);
			}, 'schema.json should be readable and valid JSON');
		});

		it('is a valid JSON Schema', () => {
			const schema = JSON.parse(readFileSync(path).toString());

			const ajv = new Ajv({ allErrors: true, verbose: true });
			const validate = ajv.compile(schema);
			validate({});

			assert.equal(validate.errors, null, `schema should have no errors`);
		});
	});
});
