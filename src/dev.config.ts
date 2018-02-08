import baseConfigFactory from './base.config';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import webpack = require('webpack');
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ManifestPlugin from 'webpack-manifest-plugin';
import { existsSync } from 'fs';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;

	config.plugins = [
		...plugins,
		new ManifestPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: 'src/index.html'
		}),
		new CleanWebpackPlugin(['dev'], { root: output.path, verbose: false }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: `${packageJson.name}-vendor-${packageJson.version}.js`,
			minChunks: function(module: any) {
				return module.context && module.context.includes('node_modules');
			}
		})
	];

	config.output = {
		...output,
		path: path.join(output.path!, 'dev')
	};

	config.devtool = 'inline-source-map';
	return config;
}

export default webpackConfig;
