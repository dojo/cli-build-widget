import baseConfigFactory from './base.config';
import { getChunkPriorities } from './util';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import webpack = require('webpack');
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ManifestPlugin from 'webpack-manifest-plugin';

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const chunkPriorities = getChunkPriorities(args.elements);

	config.plugins = [
		...plugins,
		new ManifestPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			chunks: Object.keys(chunkPriorities),
			template: 'src/index.html',
			chunksSortMode: function(left: any, right: any) {
				return chunkPriorities[left.id] - chunkPriorities[right.id];
			}
		}),
		new CleanWebpackPlugin(['dev'], { root: output.path, verbose: false }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'widget-core',
			filename: 'widget-core.js'
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
