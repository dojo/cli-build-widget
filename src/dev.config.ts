import baseConfigFactory from './base.config';
import * as path from 'path';
import * as webpack from 'webpack';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const outputPath = output!.path as string;
	const location = path.join(outputPath, 'dev');

	config.plugins = [...plugins!, new CleanWebpackPlugin([location], { root: outputPath, verbose: false })];

	config.output = {
		...output,
		path: location
	};

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
