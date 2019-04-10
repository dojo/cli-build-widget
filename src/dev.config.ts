import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import baseConfigFactory from './base.config';

const removeEmpty = (items: any[]) => items.filter(item => item);

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const outputPath = output!.path as string;
	const location = path.join(outputPath, 'dev');

	config.plugins = removeEmpty([
		...plugins!,
		(args.target !== 'lib' || args.clean) && new CleanWebpackPlugin([location], { root: outputPath, verbose: false })
	]);

	config.output = {
		...output,
		path: location
	};

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
