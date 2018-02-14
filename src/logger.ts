import * as path from 'path';
import * as logUpdate from 'log-update';
import * as logSymbols from 'log-symbols';
import * as typescript from 'typescript';
import * as jsonFile from 'jsonfile';
import chalk from 'chalk';

const pkgDir = require('pkg-dir');
const columns = require('cli-columns');
const stripAnsi = require('strip-ansi');
const version = jsonFile.readFileSync(path.join(pkgDir.sync(), 'package.json')).version;

export default function logger(stats: any, configs: any[], runningMessage: string = '') {
	const chunks: any[] = [];
	let errorMsg = '';
	let warningMsg = '';
	let errors: string[] = [];
	let warnings: string[] = [];
	let warningCount = 0;
	let errorCount = 0;
	let signOff = chalk.green('The build completed successfully.');
	const assets = stats.children
		.map((child: any) => {
			const entry = Object.keys(child.entrypoints)[0];
			chunks.push(
				child.chunks.map((chunk: any) => {
					return `${chunk.names[0]}`;
				})
			);

			if (child.warnings.length) {
				warnings = [...warnings, ...child.warnings];
				warningCount = warningCount + child.warnings.length;
			}

			if (child.errors.length) {
				errors = [...errors, ...child.errors];
				errorCount = errorCount + child.errors.length;
			}

			return child.assets.map((asset: any) => {
				const size = (asset.size / 1000).toFixed(2);
				return `${entry}/${asset.name} ${chalk.yellow(`(${size}kb)`)}`;
			});
		})
		.filter((output: string) => output);

	if (warningCount) {
		signOff = chalk.yellow('The build completed with warnings.');
		warningMsg = `
${chalk.yellow('warnings:')}
${chalk.gray(warnings.map((warning: string) => stripAnsi(warning)) as any)}
`;
	}

	if (errorCount) {
		signOff = chalk.red('The build completed with errors.');
		errorMsg = `
${chalk.yellow('errors:')}
${chalk.red(errors.map((error: string) => stripAnsi(error)) as any)}
`;
	}

	if (runningMessage) {
		signOff += `\n\n${runningMessage}`;
	}

	logUpdate(`
${logSymbols.info} cli-build-widget: ${version}
${logSymbols.info} typescript: ${typescript.version}
${logSymbols.success} hash: ${stats.hash}
${logSymbols.error} errors: ${errorCount}
${logSymbols.warning} warnings: ${warningCount}
${errorMsg}${warningMsg}
${chalk.yellow('chunks:')}
${columns(chunks)}
${chalk.yellow('assets:')}
${columns(assets)}
${chalk.yellow(`output at: ${chalk.cyan(chalk.underline(`file:///${configs[0].output.path}`))}`)}

${signOff}
	`);
}
