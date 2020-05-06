import CssModulePlugin from '@dojo/webpack-contrib/css-module-plugin/CssModulePlugin';
import { emitAllFactory } from '@dojo/webpack-contrib/emit-all-plugin/EmitAllPlugin';
import getFeatures from '@dojo/webpack-contrib/static-build-loader/getFeatures';
import { classesMap } from '@dojo/webpack-contrib/css-module-class-map-loader/loader';
import { existsSync } from 'fs';
import * as loaderUtils from 'loader-utils';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const postcssModules = require('postcss-modules');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
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
	const isLib = args.target === 'lib';
	let features = args.legacy ? args.features : { ...(args.features || {}), ...getFeatures('modern') };
	features = { ...features, 'cldr-elide': true };

	const emitAll =
		isLib &&
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
			'custom-properties': isLib ? { preserve: false } : undefined
		},
		autoprefixer: {
			grid: args.legacy
		}
	};

	const tsLoaderOptions: any = {
		instance: jsonpIdent,
		// ts-loader will, by default, use the `include`, `files`, and `exclude` options from `tsconfig`. Since
		// library builds should include only the modules in the webpack build path.
		onlyCompileBundledFiles: isLib,
		compilerOptions: isLib
			? {
					...compilerOptions,
					declaration: true,
					rootDir: path.resolve('./src'),
					outDir: path.resolve(`./output/${args.mode || 'dist'}`)
				}
			: compilerOptions,
		getCustomTransformers(program: any) {
			return {
				before: removeEmpty([emitAll && emitAll.transformer])
			};
		}
	};

	const config: webpack.Configuration = {
		mode: isLib ? 'none' : 'development',
		entry: isLib
			? widgets.reduce((entry: any, widget: any) => {
					entry[widget.tag || widget.name] = [widget.path];
					return entry;
				}, {})
			: {
					bootstrap: path.resolve(__dirname, 'template', 'custom-element.js')
				},
		optimization: {
			splitChunks: {
				cacheGroups: {
					default: false,
					vendors: false,

					common: {
						name: 'common',
						minChunks: 2,
						chunks: 'all',
						priority: 10,
						reuseExistingChunk: true,
						enforce: true,
						test: ({ resource }) => /node_modules/.test(resource)
					}
				}
			}
		},
		node: { dgram: 'empty', net: 'empty', tls: 'empty', fs: 'empty' },
		output: {
			chunkFilename: isLib ? '[name].js' : `[name]-${packageJson.version}.js`,
			filename: isLib ? '[name].js' : `[name]-${packageJson.version}.js`,
			jsonpFunction: getJsonpFunctionName(`-${packageName}-${jsonpIdent}`),
			libraryTarget: 'jsonp',
			path: path.resolve('./output'),
			pathinfo: false
		},
		resolveLoader: {
			modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
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
		externals: [
			function(context, request, callback) {
				const externals = (args.externals && args.externals.dependencies) || [];
				function resolveExternal(externals: (string | { name?: string; type?: string })[]): string | void {
					for (let external of externals) {
						const name = external && (typeof external === 'string' ? external : external.name);
						if (name && new RegExp(`^${name}[!(\/|\\)]?`).test(request)) {
							return typeof external === 'string'
								? request
								: external.type
									? `${external.type} ${request}`
									: {
											amd: request,
											commonjs: request,
											commonjs2: request,
											root: request
										};
						}
					}
				}

				callback(null, resolveExternal(externals));
			}
		],
		module: {
			noParse: /\.block/,
			rules: removeEmpty([
				{
					test: path.resolve(__dirname, 'template', 'custom-element.js'),
					loader: path.resolve(__dirname, '../webpack-contrib/element-loader/ElementLoader.js'),
					options: {
						widgets: widgets,
						elementPrefix
					}
				},
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
				{
					exclude: allPaths,
					test: /.*\.(gif|png|jpe?g|svg|eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
					options: {
						emitFile: !isLib
					}
				},
				{
					include: allPaths,
					test: /.*\.(gif|png|jpe?g|svg|eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
					options: isLib
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
					test: /\.css$/,
					exclude: /\.m\.css$/,
					use: removeEmpty([
						isLib
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
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								import: false
							}
						},
						isLib && {
							loader: 'postcss-loader?sourceMap',
							options: {
								ident: 'postcss',
								plugins: removeEmpty([
									postcssImport({
										filter: (path: string) => {
											return !/^https?:\/\//.test(path);
										},
										resolve: (id: string, basedir: string, importOptions: any = {}) => {
											if (importOptions.filter) {
												const result = importOptions.filter(id);
												if (!result) {
													return null;
												}
											}
											if (id[0] === '~') {
												return id.substr(1);
											}
											return id;
										}
									})
								])
							}
						}
					])
				},
				{
					include: allPaths,
					test: /\.m\.css$/,
					use: removeEmpty([
						isLib
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
						isLib && '@dojo/webpack-contrib/css-module-class-map-loader/loader',
						{
							loader: 'css-loader',
							options: {
								getLocalIdent,
								importLoaders: 1,
								localIdentName: isLib ? '[local]' : '[name]__[local]__[hash:base64:5]',
								modules: true,
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader?sourceMap',
							options: {
								ident: 'postcss',
								plugins: removeEmpty([
									postcssImport(),
									isLib &&
										postcssModules({
											getJSON: (filename: string, json: any) => {
												classesMap.set(filename, json);
											},
											generateScopedName: '[name]__[local]__[hash:base64:5]'
										}),
									postcssPresetEnv(postcssPresetConfig)
								])
							}
						}
					])
				}
			])
		}
	};

	return config;
}
