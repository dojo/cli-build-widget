import BundleAnalyzerPlugin from '@dojo/webpack-contrib/webpack-bundle-analyzer/BundleAnalyzerPlugin';
import baseConfigFactory from './base.config';
import webpack = require('webpack');
import * as path from 'path';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as WebpackChunkHash from 'webpack-chunk-hash';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function webpackConfig(args: any): webpack.Configuration {
	const config = baseConfigFactory(args);
	const { plugins, output } = config;
	const location = path.join('dist', args.element.name);
	const outputPath = output!.path as string;

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

	config.plugins = [
		...plugins!,
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			generateStatsFile: true,
			reportFilename: '../info/report.html',
			statsFilename: '../info/stats.json'
		}),
		new WebpackChunkHash(),
		new CleanWebpackPlugin([location], { root: outputPath, verbose: false })
	];

	config.output = {
		...output,
		path: path.join(outputPath, location)
	};

	return config;
}

export default webpackConfig;
