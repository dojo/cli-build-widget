import * as webpack from 'webpack';

import devConfigFactory from './dev.config';
import distConfigFactory from './dist.config';
import testConfigFactory from './test.config';
import { getWidgetName } from './util';

export interface EnvOptions {
	mode?: 'dev' | 'dist' | 'test';
	target?: 'custom element' | 'lib';
}

function webpackConfig(env: EnvOptions = {}): webpack.Configuration[] {
	const { mode = 'dist', target = 'custom element' } = env;
	let { widgets = [], ...rc } = require('./build-options.json');
	let configs: webpack.Configuration[];
	widgets = widgets.map((widget: any) => {
		return {
			name: getWidgetName(widget),
			path: widget
		};
	});

	if (mode === 'dev') {
		configs = [devConfigFactory({ ...rc, widgets, target })];
	} else if (mode === 'test') {
		configs = [testConfigFactory({ ...rc, widgets, target })];
	} else {
		configs = [distConfigFactory({ ...rc, widgets, target })];
	}
	return configs;
}

module.exports = webpackConfig;
