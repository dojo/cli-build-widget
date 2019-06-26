import { v } from '@dojo/framework/core/vdom';
import { WidgetProperties } from '@dojo/framework/core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import * as css from './menuItem.m.css';

export interface MenuItemProperties extends WidgetProperties {
	title: string;
	selected?: boolean;
	data?: any;
	onSelected?: (data: any) => void;
}

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
					classes: this.theme([css.item, selected ? css.selected : null])
				},
				[
					v(
						'button',
						{
							classes: this.theme([css.button]),
							onclick: this._onClick
						},
						[title]
					)
				]
			)
		]);
	}
}

export default MenuItem;
