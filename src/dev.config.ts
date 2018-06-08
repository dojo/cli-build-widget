import baseConfigFactory from './base.config';
import * as path from 'path';
import webpack = require('webpack');
import * as CleanWebpackPlugin from 'clean-webpack-plugin';

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output, module } = config;
	const location = path.join('dev', args.element.name);

	config.plugins = [...plugins, new CleanWebpackPlugin([location], { root: output.path, verbose: false })];

	module.rules = module.rules.map(rule => {
		if (Array.isArray(rule.use)) {
			rule.use.forEach((loader: any) => {
				if (typeof loader === 'string') {
					return;
				}
				if (loader.loader === 'css-loader') {
					loader.options.localIdentName = '[name]__[local]__[hash:base64:5]';
				}
			});
		}
		return rule;
	});

	config.output = {
		...output,
		path: path.join(output.path!, location)
	};

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
