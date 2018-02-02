/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app(["src/menu-item/MenuItem"],{

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu-item/MenuItem.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js").default;

var defaultExport = widgetFactory.default;
var descriptor;

if (defaultExport) {
	if (defaultExport.prototype && defaultExport.prototype.__customElementDescriptor) {
		descriptor = function() { return defaultExport.prototype.__customElementDescriptor };
	}
}

descriptor && registerCustomElement(descriptor);



/***/ }),

/***/ "./src/menu-item/MenuItem.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var css = __webpack_require__("./src/menu-item/menuItem.m.css");
var MenuItem = /** @class */ (function (_super) {
    tslib_1.__extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem.prototype._onClick = function () {
        this.properties.onSelected && this.properties.onSelected(this.properties.data);
    };
    MenuItem.prototype.render = function () {
        var _a = this.properties, title = _a.title, selected = _a.selected;
        return d_1.v('li', { classes: this.theme(css.root) }, [
            d_1.v('span', {
                classes: this.theme([css.item, selected ? css.selected : null]),
                onclick: this._onClick
            }, [title])
        ]);
    };
    MenuItem = tslib_1.__decorate([
        customElement_1.customElement({
            tag: 'demo-menu-item',
            attributes: ['title', 'selected'],
            events: ['onSelected'],
            properties: ['data', 'selected']
        }),
        Themed_1.theme(css)
    ], MenuItem);
    return MenuItem;
}(Themed_1.ThemedMixin(WidgetBase_1.WidgetBase)));
exports.MenuItem = MenuItem;
exports.default = MenuItem;


/***/ }),

/***/ "./src/menu-item/menuItem.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"menuItem","root":"sUmUi4Sh","item":"_2Mk6Rdqa","selected":"_1-f3ItOh"};

/***/ })

},["./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js"]));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcz80ZTAwIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcz9hNTA3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQWdCQTtJQUE4QjtJQUE5Qjs7SUFtQkE7SUFsQlMsNEJBQVEsRUFBaEI7UUFDQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVUsR0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUMvRSxDQUFDO0lBRVMsMEJBQU0sRUFBaEI7UUFDTyx3QkFBcUMsRUFBbkMsZ0JBQUssRUFBRSxzQkFBUTtRQUV2QixPQUFPLEtBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUUsRUFBRTtZQUNqRCxLQUFDLENBQ0EsTUFBTSxFQUNOO2dCQUNDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0QsT0FBTyxFQUFFLElBQUksQ0FBQzthQUNkLEVBQ0QsQ0FBQyxLQUFLLENBQUM7U0FFUixDQUFDO0lBQ0gsQ0FBQztJQWxCVyxTQUFRO1FBUHBCLDZCQUFhLENBQXFCO1lBQ2xDLEdBQUcsRUFBRSxnQkFBZ0I7WUFDckIsVUFBVSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztZQUNqQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdEIsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVU7U0FDL0IsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csUUFBUSxDQW1CcEI7SUFBRCxlQUFDO0NBbkJELENBQThCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUF4QztBQXFCYixrQkFBZSxRQUFROzs7Ozs7OztBQzNDdkI7QUFDQSxrQkFBa0IsZ0YiLCJmaWxlIjoic3JjL21lbnUtaXRlbS9NZW51SXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciB3aWRnZXRGYWN0b3J5ID0gcmVxdWlyZShcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIik7XG5cbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnQgPSByZXF1aXJlKCdAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xyXG5cclxudmFyIGRlZmF1bHRFeHBvcnQgPSB3aWRnZXRGYWN0b3J5LmRlZmF1bHQ7XHJcbnZhciBkZXNjcmlwdG9yO1xyXG5cclxuaWYgKGRlZmF1bHRFeHBvcnQpIHtcclxuXHRpZiAoZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUgJiYgZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcikge1xyXG5cdFx0ZGVzY3JpcHRvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvciB9O1xyXG5cdH1cclxufVxyXG5cclxuZGVzY3JpcHRvciAmJiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVzY3JpcHRvcik7XHJcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS1pdGVtL01lbnVJdGVtIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUtaXRlbS9NZW51SXRlbSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gc3JjL21lbnUtaXRlbS9NZW51SXRlbSIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcclxuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XHJcbmltcG9ydCB7IFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XHJcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcclxuXHJcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnVJdGVtLm0uY3NzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVudUl0ZW1Qcm9wZXJ0aWVzIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XHJcblx0dGl0bGU6IHN0cmluZztcclxuXHRzZWxlY3RlZD86IGJvb2xlYW47XHJcblx0ZGF0YT86IGFueTtcclxuXHRvblNlbGVjdGVkPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxufVxyXG5cclxuQGN1c3RvbUVsZW1lbnQ8TWVudUl0ZW1Qcm9wZXJ0aWVzPih7XHJcblx0dGFnOiAnZGVtby1tZW51LWl0ZW0nLFxyXG5cdGF0dHJpYnV0ZXM6IFsndGl0bGUnLCAnc2VsZWN0ZWQnXSxcclxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddLFxyXG5cdHByb3BlcnRpZXM6IFsnZGF0YScsICdzZWxlY3RlZCddXHJcbn0pXHJcbkB0aGVtZShjc3MpXHJcbmV4cG9ydCBjbGFzcyBNZW51SXRlbSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVJdGVtUHJvcGVydGllcz4ge1xyXG5cdHByaXZhdGUgX29uQ2xpY2soKSB7XHJcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCAmJiB0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCh0aGlzLnByb3BlcnRpZXMuZGF0YSk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xyXG5cdFx0Y29uc3QgeyB0aXRsZSwgc2VsZWN0ZWQgfSA9IHRoaXMucHJvcGVydGllcztcclxuXHJcblx0XHRyZXR1cm4gdignbGknLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcclxuXHRcdFx0dihcclxuXHRcdFx0XHQnc3BhbicsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShbY3NzLml0ZW0sIHNlbGVjdGVkID8gY3NzLnNlbGVjdGVkIDogbnVsbF0pLFxyXG5cdFx0XHRcdFx0b25jbGljazogdGhpcy5fb25DbGlja1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0W3RpdGxlXVxyXG5cdFx0XHQpXHJcblx0XHRdKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1lbnVJdGVtO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcIm1lbnVJdGVtXCIsXCJyb290XCI6XCJzVW1VaTRTaFwiLFwiaXRlbVwiOlwiXzJNazZSZHFhXCIsXCJzZWxlY3RlZFwiOlwiXzEtZjNJdE9oXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gc3JjL21lbnUtaXRlbS9NZW51SXRlbSJdLCJzb3VyY2VSb290IjoiIn0=