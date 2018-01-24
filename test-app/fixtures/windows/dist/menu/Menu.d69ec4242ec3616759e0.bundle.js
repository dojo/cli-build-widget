/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
dojoWebpackJsonptest_app(["menu/Menu"],{"./src/menu/Menu.ts":function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o("./node_modules/tslib/tslib.es6.js"),s=o("./node_modules/@dojo/widget-core/d.js"),d=o("./node_modules/@dojo/widget-core/decorators/customElement.js"),i=o("./node_modules/@dojo/widget-core/mixins/Themed.js"),r=o("./node_modules/@dojo/widget-core/WidgetBase.js"),c=o("./src/menu/menu.m.css"),u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n.__extends(t,e),t.prototype._onSelected=function(e,t){console.log(t,!!this.properties.onSelected),this._selectedId=e,this.properties.onSelected(t),this.invalidate()},t.prototype.render=function(){var e=this,t=this.children.map(function(t,o){if(t){var s={onSelected:function(t){e._onSelected(o,t)}};void 0!==e._selectedId&&(s.selected=o===e._selectedId),t.properties=n.__assign({},t.properties,s)}return t});return s.v("nav",{classes:this.theme(c.root)},[s.v("ol",{classes:this.theme(c.menuContainer)},t)])},t=n.__decorate([d.customElement({tag:"demo-menu",events:["onSelected"]}),i.theme(c)],t)}(i.ThemedMixin(r.WidgetBase));t.Menu=u},"./src/menu/menu.m.css":function(e,t){e.exports={" _key":"menu",root:"_3bA6jdSn",menuContainer:"_1eoGfqku"}},1:function(e,t,o){e.exports=o("./src/menu/Menu.ts")}},[1]);
//# sourceMappingURL=Menu.d69ec4242ec3616759e0.bundle.js.map