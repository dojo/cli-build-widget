/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(dojoWebpackJsonptest_app(["menu/Menu"],{

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
        console.log(data, !!this.properties.onSelected);
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


/***/ }),

/***/ "./src/menu/menu.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"menu","root":"_3bA6jdSn","menuContainer":"_1eoGfqku"};

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/menu/Menu.ts");


/***/ })

},[1]));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/NWQ0MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFXQTtJQUEwQjtJQUExQjs7SUFvQ0E7SUFqQ1MsMkJBQVcsRUFBbkIsVUFBb0IsRUFBVSxFQUFFLElBQVM7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1FBQy9DLElBQUksQ0FBQyxZQUFXLEVBQUcsRUFBRTtRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsRUFBRTtJQUNsQixDQUFDO0lBRUQsc0JBQU0sRUFBTjtRQUFBO1FBQ0MsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztZQUM1QyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQU0sV0FBVSxFQUFnQztvQkFDL0MsVUFBVSxFQUFFLFVBQUMsSUFBUzt3QkFDckIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO29CQUM5QjtpQkFDQTtnQkFDRCxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVcsSUFBSyxTQUFTLEVBQUU7b0JBQ25DLFVBQVUsQ0FBQyxTQUFRLEVBQUcsTUFBSyxJQUFLLEtBQUksQ0FBQyxXQUFXO2dCQUNqRDtnQkFDQSxLQUFLLENBQUMsV0FBVSx1QkFBUSxLQUFLLENBQUMsVUFBVSxFQUFLLFVBQVUsQ0FBRTtZQUMxRDtZQUNBLE9BQU8sS0FBSztRQUNiLENBQUMsQ0FBQztRQUVGLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2xELEtBQUMsQ0FDQSxJQUFJLEVBQ0o7Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDckMsRUFDRCxLQUFLO1NBRU4sQ0FBQztJQUNILENBQUM7SUFuQ1csS0FBSTtRQUxoQiw2QkFBYSxDQUFpQjtZQUM5QixHQUFHLEVBQUUsV0FBVztZQUNoQixNQUFNLEVBQUUsQ0FBQyxZQUFZO1NBQ3JCLENBQUM7UUFDRCxjQUFLLENBQUMsR0FBRztPQUNHLElBQUksQ0FvQ2hCO0lBQUQsV0FBQztDQXBDRCxDQUEwQixvQkFBVyxDQUFDLHVCQUFVLENBQUM7QUFBcEM7Ozs7Ozs7O0FDbEJiO0FBQ0Esa0JBQWtCLCtEIiwiZmlsZSI6Im1lbnUvTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcywgV05vZGUgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHRoZW1lLCBUaGVtZWRNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgTWVudUl0ZW0sIE1lbnVJdGVtUHJvcGVydGllcyB9IGZyb20gJy4uL21lbnUtaXRlbS9NZW51SXRlbSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnUubS5jc3MnO1xuXG5pbnRlcmZhY2UgTWVudVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0b25TZWxlY3RlZDogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudVByb3BlcnRpZXM+KHtcblx0dGFnOiAnZGVtby1tZW51Jyxcblx0ZXZlbnRzOiBbJ29uU2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVQcm9wZXJ0aWVzLCBXTm9kZTxNZW51SXRlbT4+IHtcblx0cHJpdmF0ZSBfc2VsZWN0ZWRJZDogbnVtYmVyO1xuXG5cdHByaXZhdGUgX29uU2VsZWN0ZWQoaWQ6IG51bWJlciwgZGF0YTogYW55KSB7XG5cdFx0Y29uc29sZS5sb2coZGF0YSwgISF0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCk7XG5cdFx0dGhpcy5fc2VsZWN0ZWRJZCA9IGlkO1xuXHRcdHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkKGRhdGEpO1xuXHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnRpZXM6IFBhcnRpYWw8TWVudUl0ZW1Qcm9wZXJ0aWVzPiA9IHtcblx0XHRcdFx0XHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9vblNlbGVjdGVkKGluZGV4LCBkYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmICh0aGlzLl9zZWxlY3RlZElkICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzLnNlbGVjdGVkID0gaW5kZXggPT09IHRoaXMuX3NlbGVjdGVkSWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGQucHJvcGVydGllcyA9IHsgLi4uY2hpbGQucHJvcGVydGllcywgLi4ucHJvcGVydGllcyB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHYoJ25hdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xuXHRcdFx0dihcblx0XHRcdFx0J29sJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm1lbnVDb250YWluZXIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1zXG5cdFx0XHQpXG5cdFx0XSk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9tZW51L01lbnUudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwibWVudVwiLFwicm9vdFwiOlwiXzNiQTZqZFNuXCIsXCJtZW51Q29udGFpbmVyXCI6XCJfMWVvR2Zxa3VcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tZW51L21lbnUubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51L01lbnUiXSwic291cmNlUm9vdCI6IiJ9