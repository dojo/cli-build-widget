import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';

import Menu from './widget-lib/menu/Menu';
import MenuItem from './widget-lib/menu-item/MenuItem';

export default class App extends WidgetBase {
	private data: string = '';

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
					w(MenuItem, { title: 'Menu Item A', data: 'bar' }),
					w(MenuItem, { title: 'Menu Item B', data: 'baz' }),
					w(MenuItem, { title: 'Menu Item C', data: 'bat' })
				]
			)
		]);
	}
}
