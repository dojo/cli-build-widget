/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
dojoWebpackJsonptest_app_custom_elements(["src/menu/Menu"],{"./src/menu/Menu.ts":function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o("./node_modules/tslib/tslib.es6.js"),s=o("./node_modules/@dojo/widget-core/d.js"),d=o("./node_modules/@dojo/widget-core/decorators/customElement.js"),i=o("./node_modules/@dojo/widget-core/mixins/Themed.js"),r=o("./node_modules/@dojo/widget-core/WidgetBase.js"),u=o("./src/menu/menu.m.css"),c=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n.__extends(t,e),t.prototype._onSelected=function(e,t){this._selectedId=e,this.properties.onSelected(t),this.invalidate()},t.prototype.render=function(){var e=this,t=this.children.map(function(t,o){if(t){var s={onSelected:function(t){e._onSelected(o,t)}};void 0!==e._selectedId&&(s.selected=o===e._selectedId),t.properties=n.__assign({},t.properties,s)}return t});return s.v("nav",{classes:this.theme(u.root)},[s.v("ol",{classes:this.theme(u.menuContainer)},t)])},t=n.__decorate([d.customElement({tag:"demo-menu",events:["onSelected"]}),i.theme(u)],t)}(i.ThemedMixin(r.WidgetBase));t.Menu=c,t.default=c},"./src/menu/menu.m.css":function(e,t){e.exports={" _key":"menu",root:"_3bA6jdSn",menuContainer:"_1eoGfqku"}}},["./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js"]);
//# sourceMappingURL=Menu-1.0.0.bundle.js.map