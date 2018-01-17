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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3M/YTUwNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFnQkE7SUFBOEI7SUFBOUI7O0lBbUJBO0lBbEJTLDRCQUFRLEVBQWhCO1FBQ0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFVLEdBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDL0UsQ0FBQztJQUVTLDBCQUFNLEVBQWhCO1FBQ08sd0JBQXFDLEVBQW5DLGdCQUFLLEVBQUUsc0JBQVE7UUFFdkIsT0FBTyxLQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxDQUFFLEVBQUU7WUFDakQsS0FBQyxDQUNBLE1BQU0sRUFDTjtnQkFDQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sRUFBRSxJQUFJLENBQUM7YUFDZCxFQUNELENBQUMsS0FBSyxDQUFDO1NBRVIsQ0FBQztJQUNILENBQUM7SUFsQlcsU0FBUTtRQVBwQiw2QkFBYSxDQUFxQjtZQUNsQyxHQUFHLEVBQUUsZ0JBQWdCO1lBQ3JCLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7WUFDakMsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3RCLFVBQVUsRUFBRSxDQUFDLE1BQU07U0FDbkIsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csUUFBUSxDQW1CcEI7SUFBRCxlQUFDO0NBbkJELENBQThCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUF4Qzs7Ozs7Ozs7QUN0QmI7QUFDQSxrQkFBa0IsZ0YiLCJmaWxlIjoibWVudS1pdGVtL01lbnVJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xyXG5pbXBvcnQgeyBjdXN0b21FbGVtZW50IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50JztcclxuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcclxuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xyXG5cclxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudUl0ZW0ubS5jc3MnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcclxuXHR0aXRsZTogc3RyaW5nO1xyXG5cdHNlbGVjdGVkPzogYm9vbGVhbjtcclxuXHRkYXRhPzogYW55O1xyXG5cdG9uU2VsZWN0ZWQ/OiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG59XHJcblxyXG5AY3VzdG9tRWxlbWVudDxNZW51SXRlbVByb3BlcnRpZXM+KHtcclxuXHR0YWc6ICdkZW1vLW1lbnUtaXRlbScsXHJcblx0YXR0cmlidXRlczogWyd0aXRsZScsICdzZWxlY3RlZCddLFxyXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ10sXHJcblx0cHJvcGVydGllczogWydkYXRhJ11cclxufSlcclxuQHRoZW1lKGNzcylcclxuZXhwb3J0IGNsYXNzIE1lbnVJdGVtIGV4dGVuZHMgVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk8TWVudUl0ZW1Qcm9wZXJ0aWVzPiB7XHJcblx0cHJpdmF0ZSBfb25DbGljaygpIHtcclxuXHRcdHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkICYmIHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkKHRoaXMucHJvcGVydGllcy5kYXRhKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XHJcblx0XHRjb25zdCB7IHRpdGxlLCBzZWxlY3RlZCB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xyXG5cclxuXHRcdHJldHVybiB2KCdsaScsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xyXG5cdFx0XHR2KFxyXG5cdFx0XHRcdCdzcGFuJyxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKFtjc3MuaXRlbSwgc2VsZWN0ZWQgPyBjc3Muc2VsZWN0ZWQgOiBudWxsXSksXHJcblx0XHRcdFx0XHRvbmNsaWNrOiB0aGlzLl9vbkNsaWNrXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRbdGl0bGVdXHJcblx0XHRcdClcclxuXHRcdF0pO1xyXG5cdH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcIm1lbnVJdGVtXCIsXCJyb290XCI6XCJzVW1VaTRTaFwiLFwiaXRlbVwiOlwiXzJNazZSZHFhXCIsXCJzZWxlY3RlZFwiOlwiXzEtZjNJdE9oXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtL01lbnVJdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==