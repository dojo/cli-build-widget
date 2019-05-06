import baseConfigFactory from './base.config';
import * as webpack from 'webpack';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const outputPath = output!.path as string;

	config.plugins = [...plugins!, new CleanWebpackPlugin([outputPath], { root: outputPath, verbose: false })];

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
