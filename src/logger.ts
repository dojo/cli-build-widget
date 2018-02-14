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
	const assets = stats.children
		.map((child: any) => {
			chunks.push(
				child.chunks.map(function(chunk: any) {
					return `${chunk.names[0]}`;
				})
			);

			return child.assets.map((asset: any) => {
				const size = (asset.size / 1000).toFixed(2);
				return `${asset.name} ${chalk.yellow(`(${size}kb)`)}`;
			});
		})
		.filter((output: string) => output);

	let errors = '';
	let warnings = '';
	let signOff = chalk.green('The build completed successfully.');

	if (stats.warnings.length) {
		signOff = chalk.yellow('The build completed with warnings.');
		warnings = `
${chalk.yellow('warnings:')}
${chalk.gray(stats.warnings.map((warning: string) => stripAnsi(warning)))}
`;
	}

	if (stats.errors.length) {
		signOff = chalk.red('The build completed with errors.');
		errors = `
${chalk.yellow('errors:')}
${chalk.red(stats.errors.map((error: string) => stripAnsi(error)))}
`;
	}

	if (runningMessage) {
		signOff += `\n\n${runningMessage}`;
	}

	logUpdate(`
${logSymbols.info} cli-build-widget: ${version}
${logSymbols.info} typescript: ${typescript.version}
${logSymbols.success} hash: ${stats.hash}
${logSymbols.error} errors: ${stats.errors.length}
${logSymbols.warning} warnings: ${stats.warnings.length}
${errors}${warnings}
${chalk.yellow('chunks:')}
${columns(chunks)}
${chalk.yellow('assets:')}
${columns(assets)}
${chalk.yellow(`output at: ${chalk.cyan(chalk.underline(`file:///${configs[0].output.path}`))}`)}

${signOff}
	`);
}
