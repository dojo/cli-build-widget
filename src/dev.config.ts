import baseConfigFactory from './base.config';
import * as path from 'path';
import webpack = require('webpack');
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ManifestPlugin from 'webpack-manifest-plugin';

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const location = path.join('dev', args.element.name);

	config.plugins = [
		...plugins,
		new ManifestPlugin(),
		new CleanWebpackPlugin([location], { root: output.path, verbose: false })
	];

	config.output = {
		...output,
		path: path.join(output.path!, location)
	};

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
