import { v } from '@dojo/framework/widget-core/d';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { WidgetProperties } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';

import * as css from './menuItem.m.css';

export interface MenuItemProperties extends WidgetProperties {
	title: string;
	selected?: boolean;
	data?: any;
	onSelected?: (data: any) => void;
}

@customElement<MenuItemProperties>({
	tag: 'demo-menu-item',
	attributes: ['title', 'selected'],
	events: ['onSelected'],
	properties: ['data', 'selected']
})
@theme(css)
export class MenuItem extends ThemedMixin(WidgetBase)<MenuItemProperties> {
	private _onClick() {
		this.properties.onSelected && this.properties.onSelected(this.properties.data);
	}

	protected render() {
		const { title, selected } = this.properties;

		return v('li', { classes: this.theme(css.root) }, [
			v(
				'span',
				{
					classes: this.theme([css.item, selected ? css.selected : null]),
					onclick: this._onClick
				},
				[title]
			)
		]);
	}
}

export default MenuItem;
