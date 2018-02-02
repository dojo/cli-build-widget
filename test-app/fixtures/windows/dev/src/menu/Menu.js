/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app(["src/menu/Menu"],{

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu/Menu.ts");

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

/***/ "./src/menu/Menu.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var css = __webpack_require__("./src/menu/menu.m.css");
var Menu = /** @class */ (function (_super) {
    tslib_1.__extends(Menu, _super);
    function Menu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Menu.prototype._onSelected = function (id, data) {
        this._selectedId = id;
        this.properties.onSelected(data);
        this.invalidate();
    };
    Menu.prototype.render = function () {
        var _this = this;
        var items = this.children.map(function (child, index) {
            if (child) {
                var properties = {
                    onSelected: function (data) {
                        _this._onSelected(index, data);
                    }
                };
                if (_this._selectedId !== undefined) {
                    properties.selected = index === _this._selectedId;
                }
                child.properties = tslib_1.__assign({}, child.properties, properties);
            }
            return child;
        });
        return d_1.v('nav', { classes: this.theme(css.root) }, [
            d_1.v('ol', {
                classes: this.theme(css.menuContainer)
            }, items)
        ]);
    };
    Menu = tslib_1.__decorate([
        customElement_1.customElement({
            tag: 'demo-menu',
            events: ['onSelected']
        }),
        Themed_1.theme(css)
    ], Menu);
    return Menu;
}(Themed_1.ThemedMixin(WidgetBase_1.WidgetBase)));
exports.Menu = Menu;
exports.default = Menu;


/***/ }),

/***/ "./src/menu/menu.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"menu","root":"_3bA6jdSn","menuContainer":"_1eoGfqku"};

/***/ })

},["./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js"]));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/NWQ0MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFXQTtJQUEwQjtJQUExQjs7SUFtQ0E7SUFoQ1MsMkJBQVcsRUFBbkIsVUFBb0IsRUFBVSxFQUFFLElBQVM7UUFDeEMsSUFBSSxDQUFDLFlBQVcsRUFBRyxFQUFFO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxFQUFFO0lBQ2xCLENBQUM7SUFFUyxzQkFBTSxFQUFoQjtRQUFBO1FBQ0MsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztZQUM1QyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQU0sV0FBVSxFQUFnQztvQkFDL0MsVUFBVSxFQUFFLFVBQUMsSUFBUzt3QkFDckIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO29CQUM5QjtpQkFDQTtnQkFDRCxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVcsSUFBSyxTQUFTLEVBQUU7b0JBQ25DLFVBQVUsQ0FBQyxTQUFRLEVBQUcsTUFBSyxJQUFLLEtBQUksQ0FBQyxXQUFXO2dCQUNqRDtnQkFDQSxLQUFLLENBQUMsV0FBVSx1QkFBUSxLQUFLLENBQUMsVUFBVSxFQUFLLFVBQVUsQ0FBRTtZQUMxRDtZQUNBLE9BQU8sS0FBSztRQUNiLENBQUMsQ0FBQztRQUVGLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2xELEtBQUMsQ0FDQSxJQUFJLEVBQ0o7Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDckMsRUFDRCxLQUFLO1NBRU4sQ0FBQztJQUNILENBQUM7SUFsQ1csS0FBSTtRQUxoQiw2QkFBYSxDQUFpQjtZQUM5QixHQUFHLEVBQUUsV0FBVztZQUNoQixNQUFNLEVBQUUsQ0FBQyxZQUFZO1NBQ3JCLENBQUM7UUFDRCxjQUFLLENBQUMsR0FBRztPQUNHLElBQUksQ0FtQ2hCO0lBQUQsV0FBQztDQW5DRCxDQUEwQixvQkFBVyxDQUFDLHVCQUFVLENBQUM7QUFBcEM7QUFxQ2Isa0JBQWUsSUFBSTs7Ozs7Ozs7QUN2RG5CO0FBQ0Esa0JBQWtCLCtEIiwiZmlsZSI6InNyYy9tZW51L01lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgd2lkZ2V0RmFjdG9yeSA9IHJlcXVpcmUoXCJzcmMvbWVudS9NZW51XCIpO1xuXG52YXIgcmVnaXN0ZXJDdXN0b21FbGVtZW50ID0gcmVxdWlyZSgnQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50JykuZGVmYXVsdDtcclxuXHJcbnZhciBkZWZhdWx0RXhwb3J0ID0gd2lkZ2V0RmFjdG9yeS5kZWZhdWx0O1xyXG52YXIgZGVzY3JpcHRvcjtcclxuXHJcbmlmIChkZWZhdWx0RXhwb3J0KSB7XHJcblx0aWYgKGRlZmF1bHRFeHBvcnQucHJvdG90eXBlICYmIGRlZmF1bHRFeHBvcnQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IpIHtcclxuXHRcdGRlc2NyaXB0b3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGRlZmF1bHRFeHBvcnQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgfTtcclxuXHR9XHJcbn1cclxuXHJcbmRlc2NyaXB0b3IgJiYgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGRlc2NyaXB0b3IpO1xyXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51L01lbnUhLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHNyYy9tZW51L01lbnUiLCJpbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XHJcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xyXG5pbXBvcnQgeyBXaWRnZXRQcm9wZXJ0aWVzLCBXTm9kZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcclxuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgeyBNZW51SXRlbSwgTWVudUl0ZW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vbWVudS1pdGVtL01lbnVJdGVtJztcclxuXHJcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnUubS5jc3MnO1xyXG5cclxuaW50ZXJmYWNlIE1lbnVQcm9wZXJ0aWVzIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XHJcblx0b25TZWxlY3RlZDogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxufVxyXG5cclxuQGN1c3RvbUVsZW1lbnQ8TWVudVByb3BlcnRpZXM+KHtcclxuXHR0YWc6ICdkZW1vLW1lbnUnLFxyXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ11cclxufSlcclxuQHRoZW1lKGNzcylcclxuZXhwb3J0IGNsYXNzIE1lbnUgZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51UHJvcGVydGllcywgV05vZGU8TWVudUl0ZW0+PiB7XHJcblx0cHJpdmF0ZSBfc2VsZWN0ZWRJZDogbnVtYmVyO1xyXG5cclxuXHRwcml2YXRlIF9vblNlbGVjdGVkKGlkOiBudW1iZXIsIGRhdGE6IGFueSkge1xyXG5cdFx0dGhpcy5fc2VsZWN0ZWRJZCA9IGlkO1xyXG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uU2VsZWN0ZWQoZGF0YSk7XHJcblx0XHR0aGlzLmludmFsaWRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XHJcblx0XHRjb25zdCBpdGVtcyA9IHRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aWYgKGNoaWxkKSB7XHJcblx0XHRcdFx0Y29uc3QgcHJvcGVydGllczogUGFydGlhbDxNZW51SXRlbVByb3BlcnRpZXM+ID0ge1xyXG5cdFx0XHRcdFx0b25TZWxlY3RlZDogKGRhdGE6IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9vblNlbGVjdGVkKGluZGV4LCBkYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmICh0aGlzLl9zZWxlY3RlZElkICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHByb3BlcnRpZXMuc2VsZWN0ZWQgPSBpbmRleCA9PT0gdGhpcy5fc2VsZWN0ZWRJZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hpbGQucHJvcGVydGllcyA9IHsgLi4uY2hpbGQucHJvcGVydGllcywgLi4ucHJvcGVydGllcyB9O1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjaGlsZDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiB2KCduYXYnLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcclxuXHRcdFx0dihcclxuXHRcdFx0XHQnb2wnLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm1lbnVDb250YWluZXIpXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRpdGVtc1xyXG5cdFx0XHQpXHJcblx0XHRdKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1lbnU7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9tZW51L01lbnUudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwibWVudVwiLFwicm9vdFwiOlwiXzNiQTZqZFNuXCIsXCJtZW51Q29udGFpbmVyXCI6XCJfMWVvR2Zxa3VcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tZW51L21lbnUubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBzcmMvbWVudS9NZW51Il0sInNvdXJjZVJvb3QiOiIifQ==