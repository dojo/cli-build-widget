import has from '@dojo/framework/core/has';
import { v } from '@dojo/framework/core/vdom';
import { WidgetProperties, WNode } from '@dojo/framework/core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { MenuItem, MenuItemProperties } from '../menu-item/MenuItem';

import * as css from './menu.m.css';

interface MenuProperties extends WidgetProperties {
	onSelected: (data: any) => void;
}

@theme(css)
export class Menu extends ThemedMixin(WidgetBase)<MenuProperties, WNode<MenuItem>> {
	private _selectedId: number | undefined;

	private _onSelected(id: number, data: any) {
		this._selectedId = id;
		this.properties.onSelected(data);
		this.invalidate();
	}

	protected render() {
		const items = this.children.map((child, index) => {
			if (child) {
				const properties: Partial<MenuItemProperties> = {
					onSelected: (data: any) => {
						this._onSelected(index, data);
					}
				};
				if (this._selectedId !== undefined) {
					properties.selected = index === this._selectedId;
				}
				child.properties = { ...child.properties, ...properties };
			}
			return child;
		});

		const navAttributes: any = { classes: this.theme(css.root) };

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
					classes: this.theme(css.menuContainer)
				},
				items
			)
		]);
	}
}

export default Menu;
