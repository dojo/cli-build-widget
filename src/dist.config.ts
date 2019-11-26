import BundleAnalyzerPlugin from '@dojo/webpack-contrib/webpack-bundle-analyzer/BundleAnalyzerPlugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as path from 'path';
import webpack = require('webpack');
import * as WebpackChunkHash from 'webpack-chunk-hash';
import ExternalLoaderPlugin from '@dojo/webpack-contrib/external-loader-plugin/ExternalLoaderPlugin';
import baseConfigFactory from './base.config';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const removeEmpty = (items: any[]) => items.filter(item => item);

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const outputPath = output!.path as string;
	const location = path.join(outputPath, 'dist');

	if (args.target !== 'lib') {
		config.mode = 'production';
		config.optimization = {
			...config.optimization,
			minimizer: [
				new TerserPlugin({ sourceMap: true, cache: true }),
				new OptimizeCssAssetsPlugin({
					cssProcessor: require('cssnano'),
					cssProcessorPluginOptions: {
						preset: ['default', { calc: false }]
					}
				})
			]
		};
	}

	config.plugins = removeEmpty([
		...plugins!,
		args.externals &&
			args.externals.dependencies &&
			new ExternalLoaderPlugin({
				dependencies: args.externals.dependencies,
				hash: true,
				outputPath: args.externals.outputPath
			}),
		args.target !== 'lib' &&
			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				openAnalyzer: false,
				generateStatsFile: true,
				reportFilename: '../info/report.html',
				statsFilename: '../info/stats.json'
			}),
		args.target !== 'lib' && new WebpackChunkHash(),
		new CleanWebpackPlugin([location], { root: outputPath, verbose: false })
	]);

	config.devtool = 'source-map';
	config.output = {
		...output,
		path: location
	};

	return config;
}

export default webpackConfig;
