const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import * as fs from 'fs';
import * as path from 'path';
import * as logSymbols from 'log-symbols';
import chalk from 'chalk';
import * as sinon from 'sinon';
import MockModule from '../support/MockModule';
import { SinonStub } from 'sinon';

const stripAnsi = require('strip-ansi');
const columns = require('cli-columns');

let mockModule: MockModule;

function assertOutput(isServing = false, isLibrary = false) {
	const logger = mockModule.getModuleUnderTest().default;
	const runningMessage = isServing ? 'running...' : undefined;
	const stats = {
		hash: 'hash',
		children: [
			{
				entrypoints: {
					entry: {}
				},
				assets: [
					{
						name: 'assetOne.js',
						size: 1000
					}
				],
				chunks: [
					{
						names: ['chunkOne']
					}
				],
				errors: [],
				warnings: []
			}
		]
	};
	logger(
		stats,
		[
			{
				output: {
					path: path.join(__dirname, '..', 'fixtures')
				}
			}
		],
		isLibrary,
		runningMessage
	);

	let assetOneName = isLibrary ? 'assetOne.js' : 'entry/assetOne.js';
	let assetOne = `${assetOneName} ${chalk.yellow('(1.00kb)')}`;
	let signOff = chalk.green('The build completed successfully.');
	if (runningMessage) {
		signOff += `\n\n${runningMessage}`;
	}

	const expectedLog = `
${logSymbols.info} cli-build-widget: 9.9.9
${logSymbols.info} typescript: 1.1.1
${logSymbols.success} hash: hash
${logSymbols.error} errors: 0
${logSymbols.warning} warnings: 0
${''}${''}
${chalk.yellow('chunks:')}
${columns(['chunkOne'])}
${chalk.yellow('assets:')}
${columns([assetOne])}
${chalk.yellow(`output at: ${chalk.cyan(chalk.underline(`file:///${path.join(__dirname, '..', 'fixtures')}`))}`)}

${signOff}
	`;
	const mockedLogUpdate: SinonStub = mockModule.getMock('log-update').ctor;
	assert.strictEqual(mockedLogUpdate.firstCall.args[0], expectedLog);
}

describe('logger', () => {
	beforeEach(() => {
		mockModule = new MockModule('../../src/logger', require);
		mockModule.dependencies(['typescript', 'jsonfile', 'log-update']);
		mockModule.getMock('jsonfile').readFileSync = sinon.stub().returns({ version: '9.9.9' });
		mockModule.getMock('typescript').version = '1.1.1';
	});

	afterEach(() => {
		mockModule.destroy();

		const existsSync = fs.existsSync as any;
		if (typeof existsSync.restore === 'function') {
			existsSync.restore();
		}
	});

	it('logging output with no errors', () => {
		assertOutput();
	});

	it('logging output while serving', () => {
		sinon.stub(fs, 'existsSync').returns(false);
		assertOutput(true);
	});

	it('logging output with errors', () => {
		const errors: any = ['error'];
		const warnings: any = ['warning'];
		const logger = mockModule.getModuleUnderTest().default;
		const stats = {
			hash: 'hash',
			children: [
				{
					entrypoints: {
						entry: {}
					},
					assets: [
						{
							name: 'assetOne.js',
							size: 1000
						}
					],
					chunks: [
						{
							names: ['chunkOne']
						}
					],
					errors,
					warnings
				}
			]
		};
		logger(stats, [
			{
				output: {
					path: path.join(__dirname, '..', 'fixtures')
				}
			}
		]);

		const expectedErrors = `
${chalk.yellow('errors:')}
${chalk.red(errors.map((error: string) => stripAnsi(error)))}
`;

		const expectedWarnings = `
${chalk.yellow('warnings:')}
${chalk.gray(warnings.map((warning: string) => stripAnsi(warning)))}
`;

		const expectedLog = `
${logSymbols.info} cli-build-widget: 9.9.9
${logSymbols.info} typescript: 1.1.1
${logSymbols.success} hash: hash
${logSymbols.error} errors: 1
${logSymbols.warning} warnings: 1
${expectedErrors}${expectedWarnings}
${chalk.yellow('chunks:')}
${columns(['chunkOne'])}
${chalk.yellow('assets:')}
${columns([`entry/assetOne.js ${chalk.yellow('(1.00kb)')}`])}
${chalk.yellow(`output at: ${chalk.cyan(chalk.underline(`file:///${path.join(__dirname, '..', 'fixtures')}`))}`)}

${chalk.red('The build completed with errors.')}
	`;
		const mockedLogUpdate = mockModule.getMock('log-update').ctor;
		assert.isTrue(mockedLogUpdate.calledWith(expectedLog));
	});

	it('does not include the entry name for library builds', () => {
		assertOutput(false, true);
	});
});
