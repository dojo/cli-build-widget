/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
dojoWebpackJsonptest_app(["menu-item/MenuItem"],{"./src/menu-item/MenuItem.ts":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s("./node_modules/tslib/tslib.es6.js"),n=s("./node_modules/@dojo/widget-core/d.js"),i=s("./node_modules/@dojo/widget-core/decorators/customElement.js"),m=s("./node_modules/@dojo/widget-core/mixins/Themed.js"),d=s("./node_modules/@dojo/widget-core/WidgetBase.js"),r=s("./src/menu-item/menuItem.m.css"),c=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o.__extends(t,e),t.prototype._onClick=function(){this.properties.onSelected&&this.properties.onSelected(this.properties.data)},t.prototype.render=function(){var e=this.properties,t=e.title,s=e.selected;return n.v("li",{classes:this.theme(r.root)},[n.v("span",{classes:this.theme([r.item,s?r.selected:null]),onclick:this._onClick},[t])])},t=o.__decorate([i.customElement({tag:"demo-menu-item",attributes:["title","selected"],events:["onSelected"],properties:["data"]}),m.theme(r)],t)}(m.ThemedMixin(d.WidgetBase));t.MenuItem=c},"./src/menu-item/menuItem.m.css":function(e,t){e.exports={" _key":"menuItem",root:"sUmUi4Sh",item:"_2Mk6Rdqa",selected:"_1-f3ItOh"}},0:function(e,t,s){e.exports=s("./src/menu-item/MenuItem.ts")}},[0]);
//# sourceMappingURL=MenuItem.471f32cc3957c3157821.bundle.js.map