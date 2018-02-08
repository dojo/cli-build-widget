/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
dojoWebpackJsonptest_app_custom_elements(["src/menu-item/MenuItem"],{"./src/menu-item/MenuItem.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s("./node_modules/tslib/tslib.es6.js"),i=s("./node_modules/@dojo/widget-core/d.js"),n=s("./node_modules/@dojo/widget-core/decorators/customElement.js"),d=s("./node_modules/@dojo/widget-core/mixins/Themed.js"),m=s("./node_modules/@dojo/widget-core/WidgetBase.js"),r=s("./src/menu-item/menuItem.m.css"),c=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o.__extends(t,e),t.prototype._onClick=function(){this.properties.onSelected&&this.properties.onSelected(this.properties.data)},t.prototype.render=function(){var e=this.properties,t=e.title,s=e.selected;return i.v("li",{classes:this.theme(r.root)},[i.v("span",{classes:this.theme([r.item,s?r.selected:null]),onclick:this._onClick},[t])])},t=o.__decorate([n.customElement({tag:"demo-menu-item",attributes:["title","selected"],events:["onSelected"],properties:["data","selected"]}),d.theme(r)],t)}(d.ThemedMixin(m.WidgetBase));t.MenuItem=c,t.default=c},"./src/menu-item/menuItem.m.css":function(e,t){e.exports={" _key":"menuItem",root:"sUmUi4Sh",item:"_2Mk6Rdqa",selected:"_1-f3ItOh"}}},["./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js"]);
//# sourceMappingURL=MenuItem-1.0.0.bundle.js.map