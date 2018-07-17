const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/framework/testing/harness';

import { v } from '@dojo/framework/widget-core/d';

import { MenuItem } from '../../../src/menu-item/MenuItem';
import * as css from '../../../src/menu-item/menuItem.m.css';

describe('MenuItem', () => {
	it('should render widget', () => {
		const testMenuItem = harness(MenuItem);
		const selected = true;
		const title = 'Menu Item';
		testMenuItem.setProperties({ selected, title });
		testMenuItem.expectRender(
			v('li', { classes: css.root }, [
				v(
					'span',
					{
						classes: [css.item, css.selected],
						onclick: testMenuItem.listener
					},
					[title]
				)
			])
		);
	});
});
