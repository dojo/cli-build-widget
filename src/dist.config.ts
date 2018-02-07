import baseConfigFactory from './base.config';
import { getChunkPriorities } from './util';
import webpack = require('webpack');
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ManifestPlugin from 'webpack-manifest-plugin';
import * as WebpackChunkHash from 'webpack-chunk-hash';
import { existsSync } from 'fs';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer-sunburst').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const chunkPriorities = getChunkPriorities(args.elements);

	config.plugins = [
		...plugins,
		new ManifestPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			reportType: 'sunburst',
			generateStatsFile: true,
			reportFilename: '../info/report.html',
			statsFilename: '../info/stats.json'
		}),
		new HtmlWebpackPlugin({
			inject: true,
			chunks: Object.keys(chunkPriorities),
			template: 'src/index.html',
			chunksSortMode: function(left: any, right: any) {
				return chunkPriorities[left.id] - chunkPriorities[right.id];
			}
		}),
		new UglifyJsPlugin({ sourceMap: true, cache: true }),
		new WebpackChunkHash(),
		new CleanWebpackPlugin(['dist'], { root: output.path, verbose: false }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'widget-core',
			filename: `${packageJson.name}-vendor-${packageJson.version}.js`
		})
	];

	config.plugins = config.plugins.map(plugin => {
		if (plugin instanceof ExtractTextPlugin) {
			return new ExtractTextPlugin({
				filename: `[name]-${packageJson.version}.bundle.css`,
				allChunks: true
			});
		}
		return plugin;
	});

	config.output = {
		...output,
		path: path.join(output.path!, 'dist')
	};

	return config;
}

export default webpackConfig;
