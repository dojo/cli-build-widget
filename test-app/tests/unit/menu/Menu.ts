const { describe, it } = intern.getInterface('bdd');
import harness from '@dojo/framework/testing/harness';

import { v } from '@dojo/framework/widget-core/d';

import { Menu } from '../../../src/menu/Menu';
import * as css from '../../../src/menu/menu.m.css';

describe('Menu', () => {
	it('should render widget', () => {
		const testMenu = harness(Menu);
		testMenu.expectRender(v('nav', { classes: css.root }, [v('ol', { classes: css.menuContainer })]));
	});
});
