import * as webpack from 'webpack';

import devConfigFactory from './dev.config';
import distConfigFactory from './dist.config';
import testConfigFactory from './test.config';
import { getElementName } from './util';

export interface EnvOptions {
	mode?: 'dev' | 'dist' | 'test';
}

function webpackConfig(env: EnvOptions = {}): webpack.Configuration[] {
	const { mode = 'dist' } = env;
	let { elements = [], ...rc } = require('./build-options.json');
	let configs: webpack.Configuration[];
	elements = elements.map((element: any) => {
		return {
			name: getElementName(element),
			path: element
		};
	});

	if (mode === 'dev') {
		configs = elements.map((element: any) => devConfigFactory({ ...rc, element }));
	} else if (mode === 'test') {
		configs = [testConfigFactory({ ...rc, elements })];
	} else {
		configs = elements.map((element: any) => distConfigFactory({ ...rc, element }));
	}
	return configs;
}

module.exports = webpackConfig;
