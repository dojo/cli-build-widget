import CssModulePlugin from '@dojo/webpack-contrib/css-module-plugin/CssModulePlugin';
import elementTransformer from '@dojo/webpack-contrib/element-transformer/ElementTransformer';
import { emitAllFactory } from '@dojo/webpack-contrib/emit-all-plugin/EmitAllPlugin';
import getFeatures from '@dojo/webpack-contrib/static-build-loader/getFeatures';
import { existsSync } from 'fs';
import * as loaderUtils from 'loader-utils';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const postcssPresetEnv = require('postcss-preset-env');
const slash = require('slash');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');

const basePath = process.cwd();
const srcPath = path.join(basePath, 'src');
const testPath = path.join(basePath, 'tests');
const allPaths = [srcPath, testPath];
const packageJsonPath = path.join(basePath, 'package.json');
const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
const packageName = packageJson.name || '';
const tsLintPath = path.join(basePath, 'tslint.json');
const tsLint = existsSync(tsLintPath) ? require(tsLintPath) : false;

function getJsonpFunctionName(name: string) {
	name = name
		.replace(/[^a-z0-9_]/g, ' ')
		.trim()
		.replace(/\s+/g, '_');
	return `dojoWebpackJsonp${name}`;
}

function getUMDCompatLoader(options: { bundles?: { [key: string]: string[] } }) {
	const { bundles = {} } = options;
	return {
		loader: 'umd-compat-loader',
		options: {
			imports(module: string, context: string) {
				const filePath = path.relative(basePath, path.join(context, module));
				let chunkName = slash(filePath);
				Object.keys(bundles).some(name => {
					if (bundles[name].indexOf(slash(filePath)) > -1) {
						chunkName = name;
						return true;
					}
					return false;
				});
				return `@dojo/webpack-contrib/promise-loader?global,${chunkName}!${module}`;
			}
		}
	};
}

function getLocalIdent(
	loaderContext: webpack.loader.LoaderContext,
	localIdentName: string,
	localName: string,
	options: any
) {
	if (!options.context) {
		const { context, rootContext } = loaderContext;
		options.context = typeof rootContext === 'string' ? rootContext : context;
	}
	const request = slash(path.relative(options.context, loaderContext.resourcePath));
	options.content = `${options.hashPrefix}${request}+${localName}`;
	localIdentName = localIdentName.replace(/\[local\]/gi, localName);
	const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
	return hash.replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-').replace(/^((-?[0-9])|--)/, '_$1');
}

const removeEmpty = (items: any[]) => items.filter(item => item);

const banner = `
[Dojo](https://dojo.io/)
Copyright [JS Foundation](https://js.foundation/) & contributors
[New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
All rights reserved
`;

interface CssStyle {
	walkDecls(processor: (decl: { value: string }) => void): void;
}

function colorToColorMod(style: CssStyle) {
	style.walkDecls(decl => {
		decl.value = decl.value.replace('color(', 'color-mod(');
	});
}

export default function webpackConfigFactory(args: any): webpack.Configuration {
	const { widgets } = args;
	const elementPrefix = args.prefix ? args.prefix : packageName || 'widget';
	const jsonpIdent = 'custom-elements';
	const extensions = args.legacy ? ['.ts', '.tsx', '.js'] : ['.ts', '.tsx', '.mjs', '.js'];
	const compilerOptions = args.legacy ? {} : { target: 'es6', module: 'esnext' };
	const features = args.legacy ? args.features : { ...(args.features || {}), ...getFeatures('modern') };

	const emitAll =
		args.target === 'lib' &&
		emitAllFactory({
			legacy: args.legacy,
			inlineSourceMaps: false,
			assetFilter: (() => {
				const widgetNames = widgets.map((widget: any) => widget.name);
				const getWidgetNameFromKey = (key: string) =>
					key.replace(`-${packageJson.version}`, '').replace(/\.(js|css)\.map$/, '');
				return (key: string) => {
					if (key.endsWith('.map')) {
						// Exclude sourcemaps that are generated for the entry paths, as those sourcemaps will be
						// added separately to the widget directories.
						return !widgetNames.includes(getWidgetNameFromKey(key));
					}
					return key.endsWith('.d.ts') || !/\.(css|js)$/.test(key);
				};
			})()
		});

	const postcssPresetConfig = {
		browsers: args.legacy ? ['last 2 versions', 'ie >= 10'] : ['last 2 versions'],
		insertBefore: {
			'color-mod-function': colorToColorMod
		},
		features: {
			'color-mod-function': true,
			'nesting-rules': true,
			'custom-properties': args.target === 'lib' ? { preserve: false } : undefined
		},
		autoprefixer: {
			grid: args.legacy
		}
	};

	const tsLoaderOptions: any = {
		instance: jsonpIdent,
		// ts-loader will, by default, use the `include`, `files`, and `exclude` options from `tsconfig`. Since
		// library builds should include only the modules in the webpack build path.
		onlyCompileBundledFiles: args.target === 'lib',
		compilerOptions:
			args.target === 'lib'
				? {
						...compilerOptions,
						declaration: true,
						rootDir: './src',
						outDir: path.resolve(`./output/${args.mode || 'dist'}`)
					}
				: compilerOptions,
		getCustomTransformers(program: any) {
			return {
				before: removeEmpty([
					args.target !== 'lib' &&
						elementTransformer(program, {
							elementPrefix,
							customElementFiles: widgets.map((widget: any) => ({
								file: path.resolve(widget.path),
								tag: widget.tag
							}))
						}),
					emitAll && emitAll.transformer
				])
			};
		}
	};

	const config: webpack.Configuration = {
		mode: args.target === 'lib' ? 'none' : 'development',
		entry: widgets.reduce((entry: any, widget: any) => {
			entry[widget.tag || widget.name] = [
				args.target === 'lib'
					? widget.path
					: `imports-loader?widgetFactory=${widget.path}!${path.join(__dirname, 'template', 'custom-element.js')}`
			];
			return entry;
		}, {}),
		node: { dgram: 'empty', net: 'empty', tls: 'empty', fs: 'empty' },
		output: {
			chunkFilename: args.target === 'lib' ? '[name].js' : `[name]-${packageJson.version}.js`,
			filename: args.target === 'lib' ? '[name].js' : `[name]-${packageJson.version}.js`,
			jsonpFunction: getJsonpFunctionName(`-${packageName}-${jsonpIdent}`),
			libraryTarget: 'jsonp',
			path: path.resolve('./output'),
			pathinfo: false
		},
		resolve: {
			modules: [basePath, path.join(basePath, 'node_modules')],
			extensions
		},
		watchOptions: { ignored: /node_modules/ },
		plugins: removeEmpty([
			new CssModulePlugin(basePath),
			new webpack.BannerPlugin(banner),
			new IgnorePlugin(/request\/providers\/node/),
			new MiniCssExtractPlugin({
				filename: `[name]-${packageJson.version}.css`,
				sourceMap: true
			} as any),
			emitAll && emitAll.plugin
		]),
		module: {
			rules: removeEmpty([
				tsLint && {
					test: /\.ts$/,
					enforce: 'pre',
					loader: 'tslint-loader',
					options: { configuration: tsLint, emitErrors: true, failOnHint: true }
				},
				{
					test: /@dojo\/.*\.js$/,
					enforce: 'pre',
					loader: 'source-map-loader-cli',
					options: { includeModulePaths: true }
				},
				{
					include: allPaths,
					test: /.*\.ts?$/,
					enforce: 'pre',
					loader: `@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_${jsonpIdent}`
				},
				{
					include: allPaths,
					test: /.*\.m\.css?$/,
					enforce: 'pre',
					loader: '@dojo/webpack-contrib/css-module-dts-loader?type=css'
				},
				{
					include: allPaths,
					test: /.*\.ts(x)?$/,
					use: removeEmpty([
						features && {
							loader: '@dojo/webpack-contrib/static-build-loader',
							options: { features }
						},
						getUMDCompatLoader({ bundles: args.bundles }),
						{
							loader: 'ts-loader',
							options: tsLoaderOptions
						}
					])
				},
				{
					// We cannot trust that all `mjs` modules use the correct import format for all dependencies
					// (e.g., do not use `import from` for cjs modules). Setting the type to `javascript/auto` allows
					// incorrect imports to continue working.
					type: 'javascript/auto',
					test: /\.mjs$/,
					use: removeEmpty([
						{
							loader: '@dojo/webpack-contrib/static-build-loader',
							options: {
								features
							}
						}
					])
				},
				{
					test: /\.js?$/,
					use: removeEmpty([
						features && {
							loader: '@dojo/webpack-contrib/static-build-loader',
							options: { features }
						},
						'umd-compat-loader'
					])
				},
				{
					test: new RegExp(`globalize(\\${path.sep}|$)`),
					loader: 'imports-loader?define=>false'
				},
				args.target === 'lib' && {
					exclude: allPaths,
					test: /.*\.(gif|png|jpe?g|svg|eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
					options: {
						emitFile: false
					}
				},
				{
					include: allPaths,
					test: /.*\.(gif|png|jpe?g|svg|eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
					options:
						args.target === 'lib'
							? {
									name: (file: string) => {
										const fileDir = path.dirname(file.replace(srcPath, '')).replace(/^(\/|\\)/, '');
										return `${fileDir}/[name].[ext]`;
									}
								}
							: {
									hash: 'sha512',
									digest: 'hex',
									name: '[hash:base64:8].[ext]'
								}
				},
				{
					test: /\.css$/,
					exclude: allPaths,
					use: [MiniCssExtractPlugin.loader, 'css-loader?sourceMap']
				},
				{
					test: /\.m\.css.js$/,
					exclude: allPaths,
					use: ['json-css-module-loader']
				},
				{
					include: allPaths,
					test: /.*\.css?$/,
					use: [
						args.target === 'lib'
							? {
									loader: MiniCssExtractPlugin.loader,
									options: {
										publicPath: (resourcePath: string) => {
											const outputPath = path.resolve(`./output/${args.mode || 'dist'}`);
											return path.relative(path.dirname(resourcePath.replace(srcPath, outputPath)), outputPath) + '/';
										}
									}
								}
							: MiniCssExtractPlugin.loader,
						'@dojo/webpack-contrib/css-module-decorator-loader',
						{
							loader: 'css-loader',
							options: {
								getLocalIdent,
								importLoaders: 1,
								localIdentName: '[name]__[local]__[hash:base64:5]',
								modules: true,
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader?sourceMap',
							options: {
								ident: 'postcss',
								plugins: [require('postcss-import')(), postcssPresetEnv(postcssPresetConfig)]
							}
						}
					]
				}
			])
		}
	};

	return config;
}
