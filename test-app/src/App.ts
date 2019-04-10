import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';

import Menu from './widget-lib/menu/Menu';
import MenuItem from './widget-lib/menu-item/MenuItem';

export default class App extends WidgetBase {
	private data: string;

	protected render() {
		return v('div', {}, [
			v('p', { id: 'result' }, [this.data]),
			w(
				Menu,
				{
					onSelected: (data: string) => {
						this.data = data;
						this.invalidate();
					}
				},
				[
					w(MenuItem, { id: 'menu-item-a', title: 'Menu Item A', data: 'bar' }),
					w(MenuItem, { id: 'menu-item-b', title: 'Menu Item B', data: 'baz' }),
					w(MenuItem, { id: 'menu-item-c', title: 'Menu Item C', data: 'bat' })
				]
			)
		]);
	}
}
