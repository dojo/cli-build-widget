import { v } from '@dojo/framework/widget-core/d';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { WidgetProperties, WNode } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { MenuItem, MenuItemProperties } from '../menu-item/MenuItem';

import * as css from './menu.m.css';

interface MenuProperties extends WidgetProperties {
	onSelected: (data: any) => void;
}

@customElement<MenuProperties>({
	tag: 'demo-menu',
	events: ['onSelected']
})
@theme(css)
export class Menu extends ThemedMixin(WidgetBase)<MenuProperties, WNode<MenuItem>> {
	private _selectedId: number;

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

		return v('nav', { classes: this.theme(css.root) }, [
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
