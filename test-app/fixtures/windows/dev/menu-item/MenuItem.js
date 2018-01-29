/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app(["menu-item/MenuItem"],{

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
            properties: ['data']
        }),
        Themed_1.theme(css)
    ], MenuItem);
    return MenuItem;
}(Themed_1.ThemedMixin(WidgetBase_1.WidgetBase)));
exports.MenuItem = MenuItem;


/***/ }),

/***/ "./src/menu-item/menuItem.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"menuItem","root":"sUmUi4Sh","item":"_2Mk6Rdqa","selected":"_1-f3ItOh"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/menu-item/MenuItem.ts");


/***/ })

},[0]));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3M/YTUwNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFnQkE7SUFBOEI7SUFBOUI7O0lBbUJBO0lBbEJTLDRCQUFRLEVBQWhCO1FBQ0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFVLEdBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDL0UsQ0FBQztJQUVTLDBCQUFNLEVBQWhCO1FBQ08sd0JBQXFDLEVBQW5DLGdCQUFLLEVBQUUsc0JBQVE7UUFFdkIsT0FBTyxLQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxDQUFFLEVBQUU7WUFDakQsS0FBQyxDQUNBLE1BQU0sRUFDTjtnQkFDQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sRUFBRSxJQUFJLENBQUM7YUFDZCxFQUNELENBQUMsS0FBSyxDQUFDO1NBRVIsQ0FBQztJQUNILENBQUM7SUFsQlcsU0FBUTtRQVBwQiw2QkFBYSxDQUFxQjtZQUNsQyxHQUFHLEVBQUUsZ0JBQWdCO1lBQ3JCLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7WUFDakMsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3RCLFVBQVUsRUFBRSxDQUFDLE1BQU07U0FDbkIsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csUUFBUSxDQW1CcEI7SUFBRCxlQUFDO0NBbkJELENBQThCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUF4Qzs7Ozs7Ozs7QUN0QmI7QUFDQSxrQkFBa0IsZ0YiLCJmaWxlIjoibWVudS1pdGVtL01lbnVJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XG5pbXBvcnQgeyBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcblxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudUl0ZW0ubS5jc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtUHJvcGVydGllcyBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHR0aXRsZTogc3RyaW5nO1xuXHRzZWxlY3RlZD86IGJvb2xlYW47XG5cdGRhdGE/OiBhbnk7XG5cdG9uU2VsZWN0ZWQ/OiAoZGF0YTogYW55KSA9PiB2b2lkO1xufVxuXG5AY3VzdG9tRWxlbWVudDxNZW51SXRlbVByb3BlcnRpZXM+KHtcblx0dGFnOiAnZGVtby1tZW51LWl0ZW0nLFxuXHRhdHRyaWJ1dGVzOiBbJ3RpdGxlJywgJ3NlbGVjdGVkJ10sXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ10sXG5cdHByb3BlcnRpZXM6IFsnZGF0YSddXG59KVxuQHRoZW1lKGNzcylcbmV4cG9ydCBjbGFzcyBNZW51SXRlbSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVJdGVtUHJvcGVydGllcz4ge1xuXHRwcml2YXRlIF9vbkNsaWNrKCkge1xuXHRcdHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkICYmIHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkKHRoaXMucHJvcGVydGllcy5kYXRhKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0Y29uc3QgeyB0aXRsZSwgc2VsZWN0ZWQgfSA9IHRoaXMucHJvcGVydGllcztcblxuXHRcdHJldHVybiB2KCdsaScsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xuXHRcdFx0dihcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShbY3NzLml0ZW0sIHNlbGVjdGVkID8gY3NzLnNlbGVjdGVkIDogbnVsbF0pLFxuXHRcdFx0XHRcdG9uY2xpY2s6IHRoaXMuX29uQ2xpY2tcblx0XHRcdFx0fSxcblx0XHRcdFx0W3RpdGxlXVxuXHRcdFx0KVxuXHRcdF0pO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcIm1lbnVJdGVtXCIsXCJyb290XCI6XCJzVW1VaTRTaFwiLFwiaXRlbVwiOlwiXzJNazZSZHFhXCIsXCJzZWxlY3RlZFwiOlwiXzEtZjNJdE9oXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtL01lbnVJdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==