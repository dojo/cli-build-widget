import { v } from '@dojo/widget-core/d';
import { customElement } from '@dojo/widget-core/decorators/customElement';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

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
	properties: ['data']
})
@theme(css)
export class MenuItem extends ThemedMixin(WidgetBase)<MenuItemProperties> {
	private _onClick() {
		this.properties.onSelected && this.properties.onSelected(this.properties.data);
	}

	protected render() {
		const { title, selected } = this.properties;
		// TODO selected is a string when passed as an attribute
		const isSelected = typeof selected === 'string' || selected === true;

		return v('li', { classes: this.theme(css.root) }, [
			v(
				'span',
				{
					classes: this.theme([css.item, isSelected ? css.selected : null]),
					onclick: this._onClick
				},
				[title]
			)
		]);
	}
}

export default MenuItem;
