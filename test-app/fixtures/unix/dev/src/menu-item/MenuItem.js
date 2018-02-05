/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app_widget(["src/menu-item/MenuItem"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcz81OWNjIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcz9hNTA3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQWdCQTtJQUE4QjtJQUE5Qjs7SUFtQkE7SUFsQlMsNEJBQVEsRUFBaEI7UUFDQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVUsR0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUMvRSxDQUFDO0lBRVMsMEJBQU0sRUFBaEI7UUFDTyx3QkFBcUMsRUFBbkMsZ0JBQUssRUFBRSxzQkFBUTtRQUV2QixPQUFPLEtBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUUsRUFBRTtZQUNqRCxLQUFDLENBQ0EsTUFBTSxFQUNOO2dCQUNDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0QsT0FBTyxFQUFFLElBQUksQ0FBQzthQUNkLEVBQ0QsQ0FBQyxLQUFLLENBQUM7U0FFUixDQUFDO0lBQ0gsQ0FBQztJQWxCVyxTQUFRO1FBUHBCLDZCQUFhLENBQXFCO1lBQ2xDLEdBQUcsRUFBRSxnQkFBZ0I7WUFDckIsVUFBVSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztZQUNqQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdEIsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVU7U0FDL0IsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csUUFBUSxDQW1CcEI7SUFBRCxlQUFDO0NBbkJELENBQThCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUF4QztBQXFCYixrQkFBZSxRQUFROzs7Ozs7OztBQzNDdkI7QUFDQSxrQkFBa0IsZ0YiLCJmaWxlIjoic3JjL21lbnUtaXRlbS9NZW51SXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciB3aWRnZXRGYWN0b3J5ID0gcmVxdWlyZShcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIik7XG5cbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnQgPSByZXF1aXJlKCdAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xuXG52YXIgZGVmYXVsdEV4cG9ydCA9IHdpZGdldEZhY3RvcnkuZGVmYXVsdDtcbnZhciBkZXNjcmlwdG9yO1xuXG5pZiAoZGVmYXVsdEV4cG9ydCkge1xuXHRpZiAoZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUgJiYgZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcikge1xuXHRcdGRlc2NyaXB0b3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGRlZmF1bHRFeHBvcnQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgfTtcblx0fVxufVxuXG5kZXNjcmlwdG9yICYmIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZXNjcmlwdG9yKTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS1pdGVtL01lbnVJdGVtIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUtaXRlbS9NZW51SXRlbSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gc3JjL21lbnUtaXRlbS9NZW51SXRlbSIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnVJdGVtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0dGl0bGU6IHN0cmluZztcblx0c2VsZWN0ZWQ/OiBib29sZWFuO1xuXHRkYXRhPzogYW55O1xuXHRvblNlbGVjdGVkPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudUl0ZW1Qcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudS1pdGVtJyxcblx0YXR0cmlidXRlczogWyd0aXRsZScsICdzZWxlY3RlZCddLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddLFxuXHRwcm9wZXJ0aWVzOiBbJ2RhdGEnLCAnc2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudUl0ZW0gZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51SXRlbVByb3BlcnRpZXM+IHtcblx0cHJpdmF0ZSBfb25DbGljaygpIHtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCAmJiB0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCh0aGlzLnByb3BlcnRpZXMuZGF0YSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgdGl0bGUsIHNlbGVjdGVkIH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignbGknLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcblx0XHRcdHYoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoW2Nzcy5pdGVtLCBzZWxlY3RlZCA/IGNzcy5zZWxlY3RlZCA6IG51bGxdKSxcblx0XHRcdFx0XHRvbmNsaWNrOiB0aGlzLl9vbkNsaWNrXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFt0aXRsZV1cblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51SXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwibWVudUl0ZW1cIixcInJvb3RcIjpcInNVbVVpNFNoXCIsXCJpdGVtXCI6XCJfMk1rNlJkcWFcIixcInNlbGVjdGVkXCI6XCJfMS1mM0l0T2hcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBzcmMvbWVudS1pdGVtL01lbnVJdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==