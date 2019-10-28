import baseConfigFactory from './base.config';
import * as path from 'path';
import * as webpack from 'webpack';
import * as globby from 'globby';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';

const basePath = process.cwd();

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output, module } = config;
	const instrumenterOptions = args.legacy ? {} : { esModules: true };
	const outputPath = output!.path as string;
	config.entry = () => {
		const functional = globby
			.sync([`${basePath}/tests/functional/**/*.{ts,tsx}`])
			.map((filename: string) => filename.replace(/\.ts$/, ''));

		const tests: any = {};

		if (functional.length) {
			tests.all = functional;
		}

		return tests;
	};
	const externals: any[] = (config.externals as any[]) || [];

	config.plugins = [...plugins!, new CleanWebpackPlugin(['test'], { root: outputPath, verbose: false })];

	if (module) {
		module.rules = module.rules.map(rule => {
			if (Array.isArray(rule.use)) {
				rule.use = rule.use.map(loader => {
					if (typeof loader === 'string') {
						return loader;
					}
					const { loader: loaderName } = loader as webpack.RuleSetLoader;
					if (loaderName === 'umd-compat-loader') {
						return {
							loader: loaderName,
							options: {}
						};
					}
					return loader;
				});
			}
			return rule;
		});
		module.rules.push({
			test: /src[\\\/].*\.ts(x)?$/,
			use: {
				loader: 'istanbul-instrumenter-loader',
				options: instrumenterOptions
			},
			enforce: 'post'
		});
	}

	externals.push(/^intern/);
	config.externals = externals;
	config.devtool = 'inline-source-map';
	config.output = {
		...output,
		chunkFilename: '[name].js',
		filename: '[name].js',
		path: path.join(outputPath, 'test', 'functional')
	};
	return config;
}

export default webpackConfig;
