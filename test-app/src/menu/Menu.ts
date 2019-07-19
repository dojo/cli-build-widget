import { v, create, isWNode, isVNode } from '@dojo/framework/core/vdom';
import { WidgetProperties } from '@dojo/framework/core/interfaces';
import { MenuItemProperties } from '../menu-item/MenuItem';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from './menu.m.css';
import has from '@dojo/framework/core/has';

export interface MenuProperties extends WidgetProperties {
	onSelected: (data: any) => void;
}

const render = create({ icache, theme }).properties<MenuProperties>();

export const Menu = render(({ properties, children, middleware: { icache, theme } }) => {
	const { onSelected } = properties();
	const themedCss = theme.classes(css);
	const items = children().map((child, index) => {
		if (isWNode(child) || isVNode(child)) {
			const properties: Partial<MenuItemProperties> = {
				onSelected: (data: any) => {
					onSelected(data);
					icache.set('selectedId', index);
				}
			};
			const selectedId = icache.get<number>('selectedId');
			if (typeof selectedId !== 'undefined') {
				properties.selected = index === selectedId;
			}
			child.properties = { ...child.properties, ...properties };
		}

		return child;
	});

	const navAttributes: any = { classes: themedCss.root };

	if (has('foo')) {
		navAttributes['data-foo'] = 'true';
	}
	if (has('bar')) {
		navAttributes['data-bar'] = 'true';
	}

	return v('nav', navAttributes, [
		v(
			'ol',
			{
				classes: themedCss.menuContainer
			},
			items
		)
	]);
});

export default Menu;
