import { v } from '@dojo/widget-core/d';
import { customElement } from '@dojo/widget-core/decorators/customElement';
import { WidgetProperties, WNode } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
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
		console.log(data, !!this.properties.onSelected);
		this._selectedId = id;
		this.properties.onSelected(data);
		this.invalidate();
	}

	render() {
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
