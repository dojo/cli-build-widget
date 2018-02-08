/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app_custom_elements(["src/menu/Menu"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/NWQ0MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFXQTtJQUEwQjtJQUExQjs7SUFtQ0E7SUFoQ1MsMkJBQVcsRUFBbkIsVUFBb0IsRUFBVSxFQUFFLElBQVM7UUFDeEMsSUFBSSxDQUFDLFlBQVcsRUFBRyxFQUFFO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxFQUFFO0lBQ2xCLENBQUM7SUFFUyxzQkFBTSxFQUFoQjtRQUFBO1FBQ0MsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztZQUM1QyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQU0sV0FBVSxFQUFnQztvQkFDL0MsVUFBVSxFQUFFLFVBQUMsSUFBUzt3QkFDckIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO29CQUM5QjtpQkFDQTtnQkFDRCxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVcsSUFBSyxTQUFTLEVBQUU7b0JBQ25DLFVBQVUsQ0FBQyxTQUFRLEVBQUcsTUFBSyxJQUFLLEtBQUksQ0FBQyxXQUFXO2dCQUNqRDtnQkFDQSxLQUFLLENBQUMsV0FBVSx1QkFBUSxLQUFLLENBQUMsVUFBVSxFQUFLLFVBQVUsQ0FBRTtZQUMxRDtZQUNBLE9BQU8sS0FBSztRQUNiLENBQUMsQ0FBQztRQUVGLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2xELEtBQUMsQ0FDQSxJQUFJLEVBQ0o7Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDckMsRUFDRCxLQUFLO1NBRU4sQ0FBQztJQUNILENBQUM7SUFsQ1csS0FBSTtRQUxoQiw2QkFBYSxDQUFpQjtZQUM5QixHQUFHLEVBQUUsV0FBVztZQUNoQixNQUFNLEVBQUUsQ0FBQyxZQUFZO1NBQ3JCLENBQUM7UUFDRCxjQUFLLENBQUMsR0FBRztPQUNHLElBQUksQ0FtQ2hCO0lBQUQsV0FBQztDQW5DRCxDQUEwQixvQkFBVyxDQUFDLHVCQUFVLENBQUM7QUFBcEM7QUFxQ2Isa0JBQWUsSUFBSTs7Ozs7Ozs7QUN2RG5CO0FBQ0Esa0JBQWtCLCtEIiwiZmlsZSI6InNyYy9tZW51L01lbnUtMS4wLjAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XG5pbXBvcnQgeyBXaWRnZXRQcm9wZXJ0aWVzLCBXTm9kZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBNZW51SXRlbSwgTWVudUl0ZW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vbWVudS1pdGVtL01lbnVJdGVtJztcblxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudS5tLmNzcyc7XG5cbmludGVyZmFjZSBNZW51UHJvcGVydGllcyBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB2b2lkO1xufVxuXG5AY3VzdG9tRWxlbWVudDxNZW51UHJvcGVydGllcz4oe1xuXHR0YWc6ICdkZW1vLW1lbnUnLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddXG59KVxuQHRoZW1lKGNzcylcbmV4cG9ydCBjbGFzcyBNZW51IGV4dGVuZHMgVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk8TWVudVByb3BlcnRpZXMsIFdOb2RlPE1lbnVJdGVtPj4ge1xuXHRwcml2YXRlIF9zZWxlY3RlZElkOiBudW1iZXI7XG5cblx0cHJpdmF0ZSBfb25TZWxlY3RlZChpZDogbnVtYmVyLCBkYXRhOiBhbnkpIHtcblx0XHR0aGlzLl9zZWxlY3RlZElkID0gaWQ7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uU2VsZWN0ZWQoZGF0YSk7XG5cdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnRpZXM6IFBhcnRpYWw8TWVudUl0ZW1Qcm9wZXJ0aWVzPiA9IHtcblx0XHRcdFx0XHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9vblNlbGVjdGVkKGluZGV4LCBkYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmICh0aGlzLl9zZWxlY3RlZElkICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzLnNlbGVjdGVkID0gaW5kZXggPT09IHRoaXMuX3NlbGVjdGVkSWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGQucHJvcGVydGllcyA9IHsgLi4uY2hpbGQucHJvcGVydGllcywgLi4ucHJvcGVydGllcyB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHYoJ25hdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xuXHRcdFx0dihcblx0XHRcdFx0J29sJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm1lbnVDb250YWluZXIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1zXG5cdFx0XHQpXG5cdFx0XSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVudTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9tZW51L01lbnUudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwibWVudVwiLFwicm9vdFwiOlwiXzNiQTZqZFNuXCIsXCJtZW51Q29udGFpbmVyXCI6XCJfMWVvR2Zxa3VcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tZW51L21lbnUubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBzcmMvbWVudS9NZW51Il0sInNvdXJjZVJvb3QiOiIifQ==