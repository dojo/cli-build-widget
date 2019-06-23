import * as webpack from 'webpack';

import devConfigFactory from './dev.config';
import distConfigFactory from './dist.config';
import testConfigFactory from './test.config';
import { getElementName } from './util';

export interface EnvOptions {
	mode?: 'dev' | 'dist' | 'test';
	target?: 'custom element' | 'lib';
}

function webpackConfig(env: EnvOptions = {}): webpack.Configuration[] {
	const { mode = 'dist', target = 'custom element' } = env;
	let { elements = [], ...rc } = require('./build-options.json');
	let configs: webpack.Configuration[];
	elements = elements.map((element: any) => {
		return {
			name: getElementName(element),
			path: element
		};
	});

	if (mode === 'dev') {
		configs = [devConfigFactory({ ...rc, elements, target })];
	} else if (mode === 'test') {
		configs = [testConfigFactory({ ...rc, elements, target })];
	} else {
		configs = [distConfigFactory({ ...rc, elements, target })];
	}
	return configs;
}

module.exports = webpackConfig;
