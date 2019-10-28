import * as webpack from 'webpack';

import devConfigFactory from './dev.config';
import distConfigFactory from './dist.config';
import unitTestConfigFactory from './unit.config';
import functionalTestConfigFactory from './functional.config';
import { getWidgetName } from './util';

export interface EnvOptions {
	mode?: 'dev' | 'dist' | 'test' | 'unit' | 'functional';
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
	} else if (mode === 'unit' || mode === 'test') {
		configs = [unitTestConfigFactory({ ...rc, widgets, target })];
	} else if (mode === 'functional') {
		configs = [functionalTestConfigFactory({ ...rc, widgets, target })];
	} else {
		configs = [distConfigFactory({ ...rc, widgets, target })];
	}
	return configs;
}

module.exports = webpackConfig;
