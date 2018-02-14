/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@dojo/core/Destroyable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __webpack_require__("./node_modules/@dojo/shim/Promise.js");
/**
 * No operation function to replace own once instance is destoryed
 */
function noop() {
    return Promise_1.default.resolve(false);
}
/**
 * No op function used to replace own, once instance has been destoryed
 */
function destroyed() {
    throw new Error('Call made to destroyed method');
}
var Destroyable = (function () {
    /**
     * @constructor
     */
    function Destroyable() {
        this.handles = [];
    }
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} a handle for the handle, removes the handle for the instance and calls destroy
     */
    Destroyable.prototype.own = function (handle) {
        var handles = this.handles;
        handles.push(handle);
        return {
            destroy: function () {
                handles.splice(handles.indexOf(handle));
                handle.destroy();
            }
        };
    };
    /**
     * Destrpys all handers registered for the instance
     *
     * @returns {Promise<any} a promise that resolves once all handles have been destroyed
     */
    Destroyable.prototype.destroy = function () {
        var _this = this;
        return new Promise_1.default(function (resolve) {
            _this.handles.forEach(function (handle) {
                handle && handle.destroy && handle.destroy();
            });
            _this.destroy = noop;
            _this.own = destroyed;
            resolve(true);
        });
    };
    return Destroyable;
}());
exports.Destroyable = Destroyable;
exports.default = Destroyable;

/***/ }),

/***/ "./node_modules/@dojo/core/Evented.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var aspect_1 = __webpack_require__("./node_modules/@dojo/core/aspect.js");
var Destroyable_1 = __webpack_require__("./node_modules/@dojo/core/Destroyable.js");
/**
 * Determines is the value is Actionable (has a `.do` function)
 *
 * @param value the value to check
 * @returns boolean indicating is the value is Actionable
 */
function isActionable(value) {
    return Boolean(value && typeof value.do === 'function');
}
/**
 * Resolve listeners.
 */
function resolveListener(listener) {
    return isActionable(listener) ? function (event) { return listener.do({ event: event }); } : listener;
}
/**
 * Handles an array of handles
 *
 * @param handles an array of handles
 * @returns a single Handle for handles passed
 */
function handlesArraytoHandle(handles) {
    return {
        destroy: function () {
            handles.forEach(function (handle) { return handle.destroy(); });
        }
    };
}
/**
 * Map of computed regular expressions, keyed by string
 */
var regexMap = new Map_1.default();
/**
 * Determines is the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
function isGlobMatch(globString, targetString) {
    if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
        var regex = void 0;
        if (regexMap.has(globString)) {
            regex = regexMap.get(globString);
        }
        else {
            regex = new RegExp("^" + globString.replace(/\*/g, '.*') + "$");
            regexMap.set(globString, regex);
        }
        return regex.test(targetString);
    }
    else {
        return globString === targetString;
    }
}
exports.isGlobMatch = isGlobMatch;
/**
 * Event Class
 */
var Evented = (function (_super) {
    tslib_1.__extends(Evented, _super);
    /**
     * @constructor
     * @param options The constructor argurments
     */
    function Evented(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        /**
         * map of listeners keyed by event type
         */
        _this.listenersMap = new Map_1.default();
        /**
         * Catch all handler for various call signatures. The signatures are defined in
         * `BaseEventedEvents`.  You can add your own event type -> handler types by extending
         * `BaseEventedEvents`.  See example for details.
         *
         * @param args
         *
         * @example
         *
         * interface WidgetBaseEvents extends BaseEventedEvents {
         *     (type: 'properties:changed', handler: PropertiesChangedHandler): Handle;
         * }
         * class WidgetBase extends Evented {
         *    on: WidgetBaseEvents;
         * }
         *
         * @return {any}
         */
        _this.on = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length === 2) {
                var _a = tslib_1.__read(args, 2), type_1 = _a[0], listeners = _a[1];
                if (Array.isArray(listeners)) {
                    var handles = listeners.map(function (listener) { return aspect_1.on(_this.listenersMap, type_1, resolveListener(listener)); });
                    return handlesArraytoHandle(handles);
                }
                else {
                    return aspect_1.on(this.listenersMap, type_1, resolveListener(listeners));
                }
            }
            else if (args.length === 1) {
                var _b = tslib_1.__read(args, 1), listenerMapArg_1 = _b[0];
                var handles = Object.keys(listenerMapArg_1).map(function (type) { return _this.on(type, listenerMapArg_1[type]); });
                return handlesArraytoHandle(handles);
            }
            else {
                throw new TypeError('Invalid arguments');
            }
        };
        var listeners = options.listeners;
        if (listeners) {
            _this.own(_this.on(listeners));
        }
        return _this;
    }
    /**
     * Emits the event objet for the specified type
     *
     * @param event the event to emit
     */
    Evented.prototype.emit = function (event) {
        var _this = this;
        this.listenersMap.forEach(function (method, type) {
            if (isGlobMatch(type, event.type)) {
                method.call(_this, event);
            }
        });
    };
    return Evented;
}(Destroyable_1.Destroyable));
exports.Evented = Evented;
exports.default = Evented;

/***/ }),

/***/ "./node_modules/@dojo/core/aspect.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
/**
 * An internal type guard that determines if an value is MapLike or not
 *
 * @param value The value to guard against
 */
function isMapLike(value) {
    return value && typeof value.get === 'function' && typeof value.set === 'function';
}
/**
 * A weak map of dispatchers used to apply the advice
 */
var dispatchAdviceMap = new WeakMap_1.default();
/**
 * A UID for tracking advice ordering
 */
var nextId = 0;
/**
 * Internal function that advises a join point
 *
 * @param dispatcher The current advice dispatcher
 * @param type The type of before or after advice to apply
 * @param advice The advice to apply
 * @param receiveArguments If true, the advice will receive the arguments passed to the join point
 * @return The handle that will remove the advice
 */
function adviseObject(dispatcher, type, advice, receiveArguments) {
    var previous = dispatcher && dispatcher[type];
    var advised = {
        id: nextId++,
        advice: advice,
        receiveArguments: receiveArguments
    };
    if (previous) {
        if (type === 'after') {
            // add the listener to the end of the list
            // note that we had to change this loop a little bit to workaround a bizarre IE10 JIT bug
            while (previous.next && (previous = previous.next)) { }
            previous.next = advised;
            advised.previous = previous;
        }
        else {
            // add to the beginning
            if (dispatcher) {
                dispatcher.before = advised;
            }
            advised.next = previous;
            previous.previous = advised;
        }
    }
    else {
        dispatcher && (dispatcher[type] = advised);
    }
    advice = previous = undefined;
    return lang_1.createHandle(function () {
        var _a = (advised || {}), _b = _a.previous, previous = _b === void 0 ? undefined : _b, _c = _a.next, next = _c === void 0 ? undefined : _c;
        if (dispatcher && !previous && !next) {
            dispatcher[type] = undefined;
        }
        else {
            if (previous) {
                previous.next = next;
            }
            else {
                dispatcher && (dispatcher[type] = next);
            }
            if (next) {
                next.previous = previous;
            }
        }
        if (advised) {
            delete advised.advice;
        }
        dispatcher = advised = undefined;
    });
}
/**
 * Advise a join point (function) with supplied advice
 *
 * @param joinPoint The function to be advised
 * @param type The type of advice to be applied
 * @param advice The advice to apply
 */
function adviseJoinPoint(joinPoint, type, advice) {
    var dispatcher;
    if (type === 'around') {
        dispatcher = getJoinPointDispatcher(advice.apply(this, [joinPoint]));
    }
    else {
        dispatcher = getJoinPointDispatcher(joinPoint);
        // cannot have undefined in map due to code logic, using !
        var adviceMap = dispatchAdviceMap.get(dispatcher);
        if (type === 'before') {
            (adviceMap.before || (adviceMap.before = [])).unshift(advice);
        }
        else {
            (adviceMap.after || (adviceMap.after = [])).push(advice);
        }
    }
    return dispatcher;
}
/**
 * An internal function that resolves or creates the dispatcher for a given join point
 *
 * @param target The target object or map
 * @param methodName The name of the method that the dispatcher should be resolved for
 * @return The dispatcher
 */
function getDispatcherObject(target, methodName) {
    var existing = isMapLike(target) ? target.get(methodName) : target && target[methodName];
    var dispatcher;
    if (!existing || existing.target !== target) {
        /* There is no existing dispatcher, therefore we will create one */
        dispatcher = function () {
            var executionId = nextId;
            var args = arguments;
            var results;
            var before = dispatcher.before;
            while (before) {
                if (before.advice) {
                    args = before.advice.apply(this, args) || args;
                }
                before = before.next;
            }
            if (dispatcher.around && dispatcher.around.advice) {
                results = dispatcher.around.advice(this, args);
            }
            var after = dispatcher.after;
            while (after && after.id !== undefined && after.id < executionId) {
                if (after.advice) {
                    if (after.receiveArguments) {
                        var newResults = after.advice.apply(this, args);
                        results = newResults === undefined ? results : newResults;
                    }
                    else {
                        results = after.advice.call(this, results, args);
                    }
                }
                after = after.next;
            }
            return results;
        };
        if (isMapLike(target)) {
            target.set(methodName, dispatcher);
        }
        else {
            target && (target[methodName] = dispatcher);
        }
        if (existing) {
            dispatcher.around = {
                advice: function (target, args) {
                    return existing.apply(target, args);
                }
            };
        }
        dispatcher.target = target;
    }
    else {
        dispatcher = existing;
    }
    return dispatcher;
}
/**
 * Returns the dispatcher function for a given joinPoint (method/function)
 *
 * @param joinPoint The function that is to be advised
 */
function getJoinPointDispatcher(joinPoint) {
    function dispatcher() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // cannot have undefined in map due to code logic, using !
        var _a = dispatchAdviceMap.get(dispatcher), before = _a.before, after = _a.after, joinPoint = _a.joinPoint;
        if (before) {
            args = before.reduce(function (previousArgs, advice) {
                var currentArgs = advice.apply(_this, previousArgs);
                return currentArgs || previousArgs;
            }, args);
        }
        var result = joinPoint.apply(this, args);
        if (after) {
            result = after.reduce(function (previousResult, advice) {
                return advice.apply(_this, [previousResult].concat(args));
            }, result);
        }
        return result;
    }
    /* We want to "clone" the advice that has been applied already, if this
     * joinPoint is already advised */
    if (dispatchAdviceMap.has(joinPoint)) {
        // cannot have undefined in map due to code logic, using !
        var adviceMap = dispatchAdviceMap.get(joinPoint);
        var before_1 = adviceMap.before, after_1 = adviceMap.after;
        if (before_1) {
            before_1 = before_1.slice(0);
        }
        if (after_1) {
            after_1 = after_1.slice(0);
        }
        dispatchAdviceMap.set(dispatcher, {
            joinPoint: adviceMap.joinPoint,
            before: before_1,
            after: after_1
        });
    }
    else {
        dispatchAdviceMap.set(dispatcher, { joinPoint: joinPoint });
    }
    return dispatcher;
}
/**
 * Apply advice *after* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The after advice
 */
function afterJoinPoint(joinPoint, advice) {
    return adviseJoinPoint(joinPoint, 'after', advice);
}
/**
 * Attaches "after" advice to be executed after the original method.
 * The advising function will receive the original method's return value and arguments object.
 * The value it returns will be returned from the method when it is called (even if the return value is undefined).
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the original method's return value and arguments object
 * @return A handle which will remove the aspect when destroy is called
 */
function afterObject(target, methodName, advice) {
    return adviseObject(getDispatcherObject(target, methodName), 'after', advice);
}
function after(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
    if (typeof joinPointOrTarget === 'function') {
        return afterJoinPoint(joinPointOrTarget, methodNameOrAdvice);
    }
    else {
        return afterObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
    }
}
exports.after = after;
/**
 * Apply advice *around* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The around advice
 */
function aroundJoinPoint(joinPoint, advice) {
    return adviseJoinPoint(joinPoint, 'around', advice);
}
exports.aroundJoinPoint = aroundJoinPoint;
/**
 * Attaches "around" advice around the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the original function
 * @return A handle which will remove the aspect when destroy is called
 */
function aroundObject(target, methodName, advice) {
    var dispatcher = getDispatcherObject(target, methodName);
    var previous = dispatcher.around;
    var advised;
    if (advice) {
        advised = advice(function () {
            if (previous && previous.advice) {
                return previous.advice(this, arguments);
            }
        });
    }
    dispatcher.around = {
        advice: function (target, args) {
            return advised ? advised.apply(target, args) : previous && previous.advice && previous.advice(target, args);
        }
    };
    return lang_1.createHandle(function () {
        advised = dispatcher = undefined;
    });
}
exports.aroundObject = aroundObject;
function around(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
    if (typeof joinPointOrTarget === 'function') {
        return aroundJoinPoint(joinPointOrTarget, methodNameOrAdvice);
    }
    else {
        return aroundObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
    }
}
exports.around = around;
/**
 * Apply advice *before* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The before advice
 */
function beforeJoinPoint(joinPoint, advice) {
    return adviseJoinPoint(joinPoint, 'before', advice);
}
exports.beforeJoinPoint = beforeJoinPoint;
/**
 * Attaches "before" advice to be executed before the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the same arguments as the original, and may return new arguments
 * @return A handle which will remove the aspect when destroy is called
 */
function beforeObject(target, methodName, advice) {
    return adviseObject(getDispatcherObject(target, methodName), 'before', advice);
}
exports.beforeObject = beforeObject;
function before(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
    if (typeof joinPointOrTarget === 'function') {
        return beforeJoinPoint(joinPointOrTarget, methodNameOrAdvice);
    }
    else {
        return beforeObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
    }
}
exports.before = before;
/**
 * Attaches advice to be executed after the original method.
 * The advising function will receive the same arguments as the original method.
 * The value it returns will be returned from the method when it is called *unless* its return value is undefined.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the same arguments as the original method
 * @return A handle which will remove the aspect when destroy is called
 */
function on(target, methodName, advice) {
    return adviseObject(getDispatcherObject(target, methodName), 'after', advice, true);
}
exports.on = on;

/***/ }),

/***/ "./node_modules/@dojo/core/has.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
tslib_1.__exportStar(__webpack_require__("./node_modules/@dojo/shim/support/has.js"), exports);
exports.default = has_1.default;
has_1.add('object-assign', typeof global_1.default.Object.assign === 'function', true);
has_1.add('arraybuffer', typeof global_1.default.ArrayBuffer !== 'undefined', true);
has_1.add('formdata', typeof global_1.default.FormData !== 'undefined', true);
has_1.add('filereader', typeof global_1.default.FileReader !== 'undefined', true);
has_1.add('xhr', typeof global_1.default.XMLHttpRequest !== 'undefined', true);
has_1.add('xhr2', has_1.default('xhr') && 'responseType' in global_1.default.XMLHttpRequest.prototype, true);
has_1.add('blob', function () {
    if (!has_1.default('xhr2')) {
        return false;
    }
    var request = new global_1.default.XMLHttpRequest();
    request.open('GET', 'http://www.google.com', true);
    request.responseType = 'blob';
    request.abort();
    return request.responseType === 'blob';
}, true);
has_1.add('node-buffer', 'Buffer' in global_1.default && typeof global_1.default.Buffer === 'function', true);
has_1.add('fetch', 'fetch' in global_1.default && typeof global_1.default.fetch === 'function', true);
has_1.add('web-worker-xhr-upload', new Promise(function (resolve) {
    try {
        if (global_1.default.Worker !== undefined && global_1.default.URL && global_1.default.URL.createObjectURL) {
            var blob = new Blob(["(function () {\nself.addEventListener('message', function () {\n\tvar xhr = new XMLHttpRequest();\n\ttry {\n\t\txhr.upload;\n\t\tpostMessage('true');\n\t} catch (e) {\n\t\tpostMessage('false');\n\t}\n});\n\t\t})()"], { type: 'application/javascript' });
            var worker = new Worker(URL.createObjectURL(blob));
            worker.addEventListener('message', function (_a) {
                var result = _a.data;
                resolve(result === 'true');
            });
            worker.postMessage({});
        }
        else {
            resolve(false);
        }
    }
    catch (e) {
        // IE11 on Winodws 8.1 encounters a security error.
        resolve(false);
    }
}), true);

/***/ }),

/***/ "./node_modules/@dojo/core/lang.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var object_2 = __webpack_require__("./node_modules/@dojo/shim/object.js");
exports.assign = object_2.assign;
var slice = Array.prototype.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Type guard that ensures that the value can be coerced to Object
 * to weed out host objects that do not derive from Object.
 * This function is used to check if we want to deep copy an object or not.
 * Note: In ES6 it is possible to modify an object's Symbol.toStringTag property, which will
 * change the value returned by `toString`. This is a rare edge case that is difficult to handle,
 * so it is not handled here.
 * @param  value The value to check
 * @return       If the value is coercible into an Object
 */
function shouldDeepCopyObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
function copyArray(array, inherited) {
    return array.map(function (item) {
        if (Array.isArray(item)) {
            return copyArray(item, inherited);
        }
        return !shouldDeepCopyObject(item) ?
            item :
            _mixin({
                deep: true,
                inherited: inherited,
                sources: [item],
                target: {}
            });
    });
}
function _mixin(kwArgs) {
    var deep = kwArgs.deep;
    var inherited = kwArgs.inherited;
    var target = kwArgs.target;
    var copied = kwArgs.copied || [];
    var copiedClone = tslib_1.__spread(copied);
    for (var i = 0; i < kwArgs.sources.length; i++) {
        var source = kwArgs.sources[i];
        if (source === null || source === undefined) {
            continue;
        }
        for (var key in source) {
            if (inherited || hasOwnProperty.call(source, key)) {
                var value = source[key];
                if (copiedClone.indexOf(value) !== -1) {
                    continue;
                }
                if (deep) {
                    if (Array.isArray(value)) {
                        value = copyArray(value, inherited);
                    }
                    else if (shouldDeepCopyObject(value)) {
                        var targetValue = target[key] || {};
                        copied.push(source);
                        value = _mixin({
                            deep: true,
                            inherited: inherited,
                            sources: [value],
                            target: targetValue,
                            copied: copied
                        });
                    }
                }
                target[key] = value;
            }
        }
    }
    return target;
}
function create(prototype) {
    var mixins = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        mixins[_i - 1] = arguments[_i];
    }
    if (!mixins.length) {
        throw new RangeError('lang.create requires at least one mixin object.');
    }
    var args = mixins.slice();
    args.unshift(Object.create(prototype));
    return object_1.assign.apply(null, args);
}
exports.create = create;
function deepAssign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: true,
        inherited: false,
        sources: sources,
        target: target
    });
}
exports.deepAssign = deepAssign;
function deepMixin(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: true,
        inherited: true,
        sources: sources,
        target: target
    });
}
exports.deepMixin = deepMixin;
/**
 * Creates a new object using the provided source's prototype as the prototype for the new object, and then
 * deep copies the provided source's values into the new target.
 *
 * @param source The object to duplicate
 * @return The new object
 */
function duplicate(source) {
    var target = Object.create(Object.getPrototypeOf(source));
    return deepMixin(target, source);
}
exports.duplicate = duplicate;
/**
 * Determines whether two values are the same value.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @return true if the values are the same; false otherwise
 */
function isIdentical(a, b) {
    return a === b ||
        /* both values are NaN */
        (a !== a && b !== b);
}
exports.isIdentical = isIdentical;
/**
 * Returns a function that binds a method to the specified object at runtime. This is similar to
 * `Function.prototype.bind`, but instead of a function it takes the name of a method on an object.
 * As a result, the function returned by `lateBind` will always call the function currently assigned to
 * the specified property on the object as of the moment the function it returns is called.
 *
 * @param instance The context object
 * @param method The name of the method on the context object to bind to itself
 * @param suppliedArgs An optional array of values to prepend to the `instance[method]` arguments list
 * @return The bound function
 */
function lateBind(instance, method) {
    var suppliedArgs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        suppliedArgs[_i - 2] = arguments[_i];
    }
    return suppliedArgs.length ?
        function () {
            var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
            // TS7017
            return instance[method].apply(instance, args);
        } :
        function () {
            // TS7017
            return instance[method].apply(instance, arguments);
        };
}
exports.lateBind = lateBind;
function mixin(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: false,
        inherited: true,
        sources: sources,
        target: target
    });
}
exports.mixin = mixin;
/**
 * Returns a function which invokes the given function with the given arguments prepended to its argument list.
 * Like `Function.prototype.bind`, but does not alter execution context.
 *
 * @param targetFunction The function that needs to be bound
 * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
 * @return The bound function
 */
function partial(targetFunction) {
    var suppliedArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        suppliedArgs[_i - 1] = arguments[_i];
    }
    return function () {
        var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
        return targetFunction.apply(this, args);
    };
}
exports.partial = partial;
/**
 * Returns an object with a destroy method that, when called, calls the passed-in destructor.
 * This is intended to provide a unified interface for creating "remove" / "destroy" handlers for
 * event listeners, timers, etc.
 *
 * @param destructor A function that will be called when the handle's `destroy` method is invoked
 * @return The handle object
 */
function createHandle(destructor) {
    return {
        destroy: function () {
            this.destroy = function () { };
            destructor.call(this);
        }
    };
}
exports.createHandle = createHandle;
/**
 * Returns a single handle that can be used to destroy multiple handles simultaneously.
 *
 * @param handles An array of handles with `destroy` methods
 * @return The handle object
 */
function createCompositeHandle() {
    var handles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handles[_i] = arguments[_i];
    }
    return createHandle(function () {
        for (var i = 0; i < handles.length; i++) {
            handles[i].destroy();
        }
    });
}
exports.createCompositeHandle = createCompositeHandle;

/***/ }),

/***/ "./node_modules/@dojo/has/has.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
function isFeatureTestThenable(value) {
    return value && value.then;
}
/**
 * A cache of results of feature tests
 */
exports.testCache = {};
/**
 * A cache of the un-resolved feature tests
 */
exports.testFunctions = {};
/**
 * A cache of unresolved thenables (probably promises)
 * @type {{}}
 */
var testThenables = {};
/**
 * A reference to the global scope (`window` in a browser, `global` in NodeJS)
 */
var globalScope = (function () {
    /* istanbul ignore else */
    if (typeof window !== 'undefined') {
        // Browsers
        return window;
    }
    else if (typeof global !== 'undefined') {
        // Node
        return global;
    }
    else if (typeof self !== 'undefined') {
        // Web workers
        return self;
    }
    /* istanbul ignore next */
    return {};
})();
/* Grab the staticFeatures if there are available */
var staticFeatures = (globalScope.DojoHasEnvironment || {}).staticFeatures;
/* Cleaning up the DojoHasEnviornment */
if ('DojoHasEnvironment' in globalScope) {
    delete globalScope.DojoHasEnvironment;
}
/**
 * Custom type guard to narrow the `staticFeatures` to either a map or a function that
 * returns a map.
 *
 * @param value The value to guard for
 */
function isStaticFeatureFunction(value) {
    return typeof value === 'function';
}
/**
 * The cache of asserted features that were available in the global scope when the
 * module loaded
 */
var staticCache = staticFeatures
    ? isStaticFeatureFunction(staticFeatures) ? staticFeatures.apply(globalScope) : staticFeatures
    : {};/* Providing an empty cache, if none was in the environment

/**
* AMD plugin function.
*
* Conditional loads modules based on a has feature test value.
*
* @param resourceId Gives the resolved module id to load.
* @param require The loader require function with respect to the module that contained the plugin resource in its
*                dependency list.
* @param load Callback to loader that consumes result of plugin demand.
*/
function load(resourceId, require, load, config) {
    resourceId ? require([resourceId], load) : load();
}
exports.load = load;
/**
 * AMD plugin function.
 *
 * Resolves resourceId into a module id based on possibly-nested tenary expression that branches on has feature test
 * value(s).
 *
 * @param resourceId The id of the module
 * @param normalize Resolves a relative module id into an absolute module id
 */
function normalize(resourceId, normalize) {
    var tokens = resourceId.match(/[\?:]|[^:\?]*/g) || [];
    var i = 0;
    function get(skip) {
        var term = tokens[i++];
        if (term === ':') {
            // empty string module name, resolves to null
            return null;
        }
        else {
            // postfixed with a ? means it is a feature to branch on, the term is the name of the feature
            if (tokens[i++] === '?') {
                if (!skip && has(term)) {
                    // matched the feature, get the first value from the options
                    return get();
                }
                else {
                    // did not match, get the second value, passing over the first
                    get(true);
                    return get(skip);
                }
            }
            // a module
            return term;
        }
    }
    var id = get();
    return id && normalize(id);
}
exports.normalize = normalize;
/**
 * Check if a feature has already been registered
 *
 * @param feature the name of the feature
 */
function exists(feature) {
    var normalizedFeature = feature.toLowerCase();
    return Boolean(normalizedFeature in staticCache || normalizedFeature in exports.testCache || exports.testFunctions[normalizedFeature]);
}
exports.exists = exists;
/**
 * Register a new test for a named feature.
 *
 * @example
 * has.add('dom-addeventlistener', !!document.addEventListener);
 *
 * @example
 * has.add('touch-events', function () {
 *    return 'ontouchstart' in document
 * });
 *
 * @param feature the name of the feature
 * @param value the value reported of the feature, or a function that will be executed once on first test
 * @param overwrite if an existing value should be overwritten. Defaults to false.
 */
function add(feature, value, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    var normalizedFeature = feature.toLowerCase();
    if (exists(normalizedFeature) && !overwrite && !(normalizedFeature in staticCache)) {
        throw new TypeError("Feature \"" + feature + "\" exists and overwrite not true.");
    }
    if (typeof value === 'function') {
        exports.testFunctions[normalizedFeature] = value;
    }
    else if (isFeatureTestThenable(value)) {
        testThenables[feature] = value.then(function (resolvedValue) {
            exports.testCache[feature] = resolvedValue;
            delete testThenables[feature];
        }, function () {
            delete testThenables[feature];
        });
    }
    else {
        exports.testCache[normalizedFeature] = value;
        delete exports.testFunctions[normalizedFeature];
    }
}
exports.add = add;
/**
 * Return the current value of a named feature.
 *
 * @param feature The name (if a string) or identifier (if an integer) of the feature to test.
 */
function has(feature) {
    var result;
    var normalizedFeature = feature.toLowerCase();
    if (normalizedFeature in staticCache) {
        result = staticCache[normalizedFeature];
    }
    else if (exports.testFunctions[normalizedFeature]) {
        result = exports.testCache[normalizedFeature] = exports.testFunctions[normalizedFeature].call(null);
        delete exports.testFunctions[normalizedFeature];
    }
    else if (normalizedFeature in exports.testCache) {
        result = exports.testCache[normalizedFeature];
    }
    else if (feature in testThenables) {
        return false;
    }
    else {
        throw new TypeError("Attempt to detect unregistered has feature \"" + feature + "\"");
    }
    return result;
}
exports.default = has;
/*
 * Out of the box feature tests
 */
/* Environments */
/* Used as a value to provide a debug only code path */
add('debug', true);
/* Detects if the environment is "browser like" */
add('host-browser', typeof document !== 'undefined' && typeof location !== 'undefined');
/* Detects if the environment appears to be NodeJS */
add('host-node', function () {
    if (typeof process === 'object' && process.versions && process.versions.node) {
        return process.versions.node;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/Map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.Map = global_1.default.Map;
if (!has_1.default('es6-map')) {
    exports.Map = (_a = /** @class */ (function () {
            function Map(iterable) {
                this._keys = [];
                this._values = [];
                this[Symbol.toStringTag] = 'Map';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            var value = iterable[i];
                            this.set(value[0], value[1]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.set(value[0], value[1]);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                var e_1, _a;
            }
            /**
             * An alternative to Array.prototype.indexOf using Object.is
             * to check for equality. See http://mzl.la/1zuKO2V
             */
            Map.prototype._indexOfKey = function (keys, key) {
                for (var i = 0, length_1 = keys.length; i < length_1; i++) {
                    if (object_1.is(keys[i], key)) {
                        return i;
                    }
                }
                return -1;
            };
            Object.defineProperty(Map.prototype, "size", {
                get: function () {
                    return this._keys.length;
                },
                enumerable: true,
                configurable: true
            });
            Map.prototype.clear = function () {
                this._keys.length = this._values.length = 0;
            };
            Map.prototype.delete = function (key) {
                var index = this._indexOfKey(this._keys, key);
                if (index < 0) {
                    return false;
                }
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            };
            Map.prototype.entries = function () {
                var _this = this;
                var values = this._keys.map(function (key, i) {
                    return [key, _this._values[i]];
                });
                return new iterator_1.ShimIterator(values);
            };
            Map.prototype.forEach = function (callback, context) {
                var keys = this._keys;
                var values = this._values;
                for (var i = 0, length_2 = keys.length; i < length_2; i++) {
                    callback.call(context, values[i], keys[i], this);
                }
            };
            Map.prototype.get = function (key) {
                var index = this._indexOfKey(this._keys, key);
                return index < 0 ? undefined : this._values[index];
            };
            Map.prototype.has = function (key) {
                return this._indexOfKey(this._keys, key) > -1;
            };
            Map.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._keys);
            };
            Map.prototype.set = function (key, value) {
                var index = this._indexOfKey(this._keys, key);
                index = index < 0 ? this._keys.length : index;
                this._keys[index] = key;
                this._values[index] = value;
                return this;
            };
            Map.prototype.values = function () {
                return new iterator_1.ShimIterator(this._values);
            };
            Map.prototype[Symbol.iterator] = function () {
                return this.entries();
            };
            return Map;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Map;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Promise.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var queue_1 = __webpack_require__("./node_modules/@dojo/shim/support/queue.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
exports.ShimPromise = global_1.default.Promise;
exports.isThenable = function isThenable(value) {
    return value && typeof value.then === 'function';
};
if (!has_1.default('es6-promise')) {
    global_1.default.Promise = exports.ShimPromise = (_a = /** @class */ (function () {
            /**
             * Creates a new Promise.
             *
             * @constructor
             *
             * @param executor
             * The executor function is called immediately when the Promise is instantiated. It is responsible for
             * starting the asynchronous operation when it is invoked.
             *
             * The executor must call either the passed `resolve` function when the asynchronous operation has completed
             * successfully, or the `reject` function when the operation fails.
             */
            function Promise(executor) {
                var _this = this;
                /**
                 * The current state of this promise.
                 */
                this.state = 1 /* Pending */;
                this[Symbol.toStringTag] = 'Promise';
                /**
                 * If true, the resolution of this promise is chained ("locked in") to another promise.
                 */
                var isChained = false;
                /**
                 * Whether or not this promise is in a resolved state.
                 */
                var isResolved = function () {
                    return _this.state !== 1 /* Pending */ || isChained;
                };
                /**
                 * Callbacks that should be invoked once the asynchronous operation has completed.
                 */
                var callbacks = [];
                /**
                 * Initially pushes callbacks onto a queue for execution once this promise settles. After the promise settles,
                 * enqueues callbacks for execution on the next event loop turn.
                 */
                var whenFinished = function (callback) {
                    if (callbacks) {
                        callbacks.push(callback);
                    }
                };
                /**
                 * Settles this promise.
                 *
                 * @param newState The resolved state for this promise.
                 * @param {T|any} value The resolved value for this promise.
                 */
                var settle = function (newState, value) {
                    // A promise can only be settled once.
                    if (_this.state !== 1 /* Pending */) {
                        return;
                    }
                    _this.state = newState;
                    _this.resolvedValue = value;
                    whenFinished = queue_1.queueMicroTask;
                    // Only enqueue a callback runner if there are callbacks so that initially fulfilled Promises don't have to
                    // wait an extra turn.
                    if (callbacks && callbacks.length > 0) {
                        queue_1.queueMicroTask(function () {
                            if (callbacks) {
                                var count = callbacks.length;
                                for (var i = 0; i < count; ++i) {
                                    callbacks[i].call(null);
                                }
                                callbacks = null;
                            }
                        });
                    }
                };
                /**
                 * Resolves this promise.
                 *
                 * @param newState The resolved state for this promise.
                 * @param {T|any} value The resolved value for this promise.
                 */
                var resolve = function (newState, value) {
                    if (isResolved()) {
                        return;
                    }
                    if (exports.isThenable(value)) {
                        value.then(settle.bind(null, 0 /* Fulfilled */), settle.bind(null, 2 /* Rejected */));
                        isChained = true;
                    }
                    else {
                        settle(newState, value);
                    }
                };
                this.then = function (onFulfilled, onRejected) {
                    return new Promise(function (resolve, reject) {
                        // whenFinished initially queues up callbacks for execution after the promise has settled. Once the
                        // promise has settled, whenFinished will schedule callbacks for execution on the next turn through the
                        // event loop.
                        whenFinished(function () {
                            var callback = _this.state === 2 /* Rejected */ ? onRejected : onFulfilled;
                            if (typeof callback === 'function') {
                                try {
                                    resolve(callback(_this.resolvedValue));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }
                            else if (_this.state === 2 /* Rejected */) {
                                reject(_this.resolvedValue);
                            }
                            else {
                                resolve(_this.resolvedValue);
                            }
                        });
                    });
                };
                try {
                    executor(resolve.bind(null, 0 /* Fulfilled */), resolve.bind(null, 2 /* Rejected */));
                }
                catch (error) {
                    settle(2 /* Rejected */, error);
                }
            }
            Promise.all = function (iterable) {
                return new this(function (resolve, reject) {
                    var values = [];
                    var complete = 0;
                    var total = 0;
                    var populating = true;
                    function fulfill(index, value) {
                        values[index] = value;
                        ++complete;
                        finish();
                    }
                    function finish() {
                        if (populating || complete < total) {
                            return;
                        }
                        resolve(values);
                    }
                    function processItem(index, item) {
                        ++total;
                        if (exports.isThenable(item)) {
                            // If an item Promise rejects, this Promise is immediately rejected with the item
                            // Promise's rejection error.
                            item.then(fulfill.bind(null, index), reject);
                        }
                        else {
                            Promise.resolve(item).then(fulfill.bind(null, index));
                        }
                    }
                    var i = 0;
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var value = iterable_1_1.value;
                            processItem(i, value);
                            i++;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    populating = false;
                    finish();
                    var e_1, _a;
                });
            };
            Promise.race = function (iterable) {
                return new this(function (resolve, reject) {
                    try {
                        for (var iterable_2 = tslib_1.__values(iterable), iterable_2_1 = iterable_2.next(); !iterable_2_1.done; iterable_2_1 = iterable_2.next()) {
                            var item = iterable_2_1.value;
                            if (item instanceof Promise) {
                                // If a Promise item rejects, this Promise is immediately rejected with the item
                                // Promise's rejection error.
                                item.then(resolve, reject);
                            }
                            else {
                                Promise.resolve(item).then(resolve);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (iterable_2_1 && !iterable_2_1.done && (_a = iterable_2.return)) _a.call(iterable_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    var e_2, _a;
                });
            };
            Promise.reject = function (reason) {
                return new this(function (resolve, reject) {
                    reject(reason);
                });
            };
            Promise.resolve = function (value) {
                return new this(function (resolve) {
                    resolve(value);
                });
            };
            Promise.prototype.catch = function (onRejected) {
                return this.then(undefined, onRejected);
            };
            return Promise;
        }()),
        _a[Symbol.species] = exports.ShimPromise,
        _a);
}
exports.default = exports.ShimPromise;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Set.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.Set = global_1.default.Set;
if (!has_1.default('es6-set')) {
    exports.Set = (_a = /** @class */ (function () {
            function Set(iterable) {
                this._setData = [];
                this[Symbol.toStringTag] = 'Set';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            this.add(iterable[i]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.add(value);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                var e_1, _a;
            }
            Set.prototype.add = function (value) {
                if (this.has(value)) {
                    return this;
                }
                this._setData.push(value);
                return this;
            };
            Set.prototype.clear = function () {
                this._setData.length = 0;
            };
            Set.prototype.delete = function (value) {
                var idx = this._setData.indexOf(value);
                if (idx === -1) {
                    return false;
                }
                this._setData.splice(idx, 1);
                return true;
            };
            Set.prototype.entries = function () {
                return new iterator_1.ShimIterator(this._setData.map(function (value) { return [value, value]; }));
            };
            Set.prototype.forEach = function (callbackfn, thisArg) {
                var iterator = this.values();
                var result = iterator.next();
                while (!result.done) {
                    callbackfn.call(thisArg, result.value, result.value, this);
                    result = iterator.next();
                }
            };
            Set.prototype.has = function (value) {
                return this._setData.indexOf(value) > -1;
            };
            Set.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Object.defineProperty(Set.prototype, "size", {
                get: function () {
                    return this._setData.length;
                },
                enumerable: true,
                configurable: true
            });
            Set.prototype.values = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Set.prototype[Symbol.iterator] = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            return Set;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Set;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
exports.Symbol = global_1.default.Symbol;
if (!has_1.default('es6-symbol')) {
    /**
     * Throws if the value is not a symbol, used internally within the Shim
     * @param  {any}    value The value to check
     * @return {symbol}       Returns the symbol or throws
     */
    var validateSymbol_1 = function validateSymbol(value) {
        if (!isSymbol(value)) {
            throw new TypeError(value + ' is not a symbol');
        }
        return value;
    };
    var defineProperties_1 = Object.defineProperties;
    var defineProperty_1 = Object.defineProperty;
    var create_1 = Object.create;
    var objPrototype_1 = Object.prototype;
    var globalSymbols_1 = {};
    var getSymbolName_1 = (function () {
        var created = create_1(null);
        return function (desc) {
            var postfix = 0;
            var name;
            while (created[String(desc) + (postfix || '')]) {
                ++postfix;
            }
            desc += String(postfix || '');
            created[desc] = true;
            name = '@@' + desc;
            // FIXME: Temporary guard until the duplicate execution when testing can be
            // pinned down.
            if (!Object.getOwnPropertyDescriptor(objPrototype_1, name)) {
                defineProperty_1(objPrototype_1, name, {
                    set: function (value) {
                        defineProperty_1(this, name, util_1.getValueDescriptor(value));
                    }
                });
            }
            return name;
        };
    })();
    var InternalSymbol_1 = function Symbol(description) {
        if (this instanceof InternalSymbol_1) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        return Symbol(description);
    };
    exports.Symbol = global_1.default.Symbol = function Symbol(description) {
        if (this instanceof Symbol) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        var sym = Object.create(InternalSymbol_1.prototype);
        description = description === undefined ? '' : String(description);
        return defineProperties_1(sym, {
            __description__: util_1.getValueDescriptor(description),
            __name__: util_1.getValueDescriptor(getSymbolName_1(description))
        });
    };
    /* Decorate the Symbol function with the appropriate properties */
    defineProperty_1(exports.Symbol, 'for', util_1.getValueDescriptor(function (key) {
        if (globalSymbols_1[key]) {
            return globalSymbols_1[key];
        }
        return (globalSymbols_1[key] = exports.Symbol(String(key)));
    }));
    defineProperties_1(exports.Symbol, {
        keyFor: util_1.getValueDescriptor(function (sym) {
            var key;
            validateSymbol_1(sym);
            for (key in globalSymbols_1) {
                if (globalSymbols_1[key] === sym) {
                    return key;
                }
            }
        }),
        hasInstance: util_1.getValueDescriptor(exports.Symbol.for('hasInstance'), false, false),
        isConcatSpreadable: util_1.getValueDescriptor(exports.Symbol.for('isConcatSpreadable'), false, false),
        iterator: util_1.getValueDescriptor(exports.Symbol.for('iterator'), false, false),
        match: util_1.getValueDescriptor(exports.Symbol.for('match'), false, false),
        observable: util_1.getValueDescriptor(exports.Symbol.for('observable'), false, false),
        replace: util_1.getValueDescriptor(exports.Symbol.for('replace'), false, false),
        search: util_1.getValueDescriptor(exports.Symbol.for('search'), false, false),
        species: util_1.getValueDescriptor(exports.Symbol.for('species'), false, false),
        split: util_1.getValueDescriptor(exports.Symbol.for('split'), false, false),
        toPrimitive: util_1.getValueDescriptor(exports.Symbol.for('toPrimitive'), false, false),
        toStringTag: util_1.getValueDescriptor(exports.Symbol.for('toStringTag'), false, false),
        unscopables: util_1.getValueDescriptor(exports.Symbol.for('unscopables'), false, false)
    });
    /* Decorate the InternalSymbol object */
    defineProperties_1(InternalSymbol_1.prototype, {
        constructor: util_1.getValueDescriptor(exports.Symbol),
        toString: util_1.getValueDescriptor(function () {
            return this.__name__;
        }, false, false)
    });
    /* Decorate the Symbol.prototype */
    defineProperties_1(exports.Symbol.prototype, {
        toString: util_1.getValueDescriptor(function () {
            return 'Symbol (' + validateSymbol_1(this).__description__ + ')';
        }),
        valueOf: util_1.getValueDescriptor(function () {
            return validateSymbol_1(this);
        })
    });
    defineProperty_1(exports.Symbol.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(function () {
        return validateSymbol_1(this);
    }));
    defineProperty_1(exports.Symbol.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor('Symbol', false, false, true));
    defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toPrimitive], false, false, true));
    defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toStringTag], false, false, true));
}
/**
 * A custom guard function that determines if an object is a symbol or not
 * @param  {any}       value The value to check to see if it is a symbol or not
 * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
 */
function isSymbol(value) {
    return (value && (typeof value === 'symbol' || value['@@toStringTag'] === 'Symbol')) || false;
}
exports.isSymbol = isSymbol;
/**
 * Fill any missing well known symbols if the native Symbol is missing them
 */
[
    'hasInstance',
    'isConcatSpreadable',
    'iterator',
    'species',
    'replace',
    'search',
    'split',
    'match',
    'toPrimitive',
    'toStringTag',
    'unscopables',
    'observable'
].forEach(function (wellKnown) {
    if (!exports.Symbol[wellKnown]) {
        Object.defineProperty(exports.Symbol, wellKnown, util_1.getValueDescriptor(exports.Symbol.for(wellKnown), false, false));
    }
});
exports.default = exports.Symbol;

/***/ }),

/***/ "./node_modules/@dojo/shim/WeakMap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.WeakMap = global_1.default.WeakMap;
if (!has_1.default('es6-weakmap')) {
    var DELETED_1 = {};
    var getUID_1 = function getUID() {
        return Math.floor(Math.random() * 100000000);
    };
    var generateName_1 = (function () {
        var startId = Math.floor(Date.now() % 100000000);
        return function generateName() {
            return '__wm' + getUID_1() + (startId++ + '__');
        };
    })();
    exports.WeakMap = /** @class */ (function () {
        function WeakMap(iterable) {
            this[Symbol.toStringTag] = 'WeakMap';
            Object.defineProperty(this, '_name', {
                value: generateName_1()
            });
            this._frozenEntries = [];
            if (iterable) {
                if (iterator_1.isArrayLike(iterable)) {
                    for (var i = 0; i < iterable.length; i++) {
                        var item = iterable[i];
                        this.set(item[0], item[1]);
                    }
                }
                else {
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var _a = tslib_1.__read(iterable_1_1.value, 2), key = _a[0], value = _a[1];
                            this.set(key, value);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_b = iterable_1.return)) _b.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            var e_1, _b;
        }
        WeakMap.prototype._getFrozenEntryIndex = function (key) {
            for (var i = 0; i < this._frozenEntries.length; i++) {
                if (this._frozenEntries[i].key === key) {
                    return i;
                }
            }
            return -1;
        };
        WeakMap.prototype.delete = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                entry.value = DELETED_1;
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                this._frozenEntries.splice(frozenIndex, 1);
                return true;
            }
            return false;
        };
        WeakMap.prototype.get = function (key) {
            if (key === undefined || key === null) {
                return undefined;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                return entry.value;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return this._frozenEntries[frozenIndex].value;
            }
        };
        WeakMap.prototype.has = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (Boolean(entry && entry.key === key && entry.value !== DELETED_1)) {
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return true;
            }
            return false;
        };
        WeakMap.prototype.set = function (key, value) {
            if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
                throw new TypeError('Invalid value used as weak map key');
            }
            var entry = key[this._name];
            if (!entry || entry.key !== key) {
                entry = Object.create(null, {
                    key: { value: key }
                });
                if (Object.isFrozen(key)) {
                    this._frozenEntries.push(entry);
                }
                else {
                    Object.defineProperty(key, this._name, {
                        value: entry
                    });
                }
            }
            entry.value = value;
            return this;
        };
        return WeakMap;
    }());
}
exports.default = exports.WeakMap;

/***/ }),

/***/ "./node_modules/@dojo/shim/array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var number_1 = __webpack_require__("./node_modules/@dojo/shim/number.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
if (has_1.default('es6-array') && has_1.default('es6-array-fill')) {
    exports.from = global_1.default.Array.from;
    exports.of = global_1.default.Array.of;
    exports.copyWithin = util_1.wrapNative(global_1.default.Array.prototype.copyWithin);
    exports.fill = util_1.wrapNative(global_1.default.Array.prototype.fill);
    exports.find = util_1.wrapNative(global_1.default.Array.prototype.find);
    exports.findIndex = util_1.wrapNative(global_1.default.Array.prototype.findIndex);
}
else {
    // It is only older versions of Safari/iOS that have a bad fill implementation and so aren't in the wild
    // To make things easier, if there is a bad fill implementation, the whole set of functions will be filled
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    var toLength_1 = function toLength(length) {
        if (isNaN(length)) {
            return 0;
        }
        length = Number(length);
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
    };
    /**
     * From ES6 7.1.4 ToInteger()
     *
     * @param value A value to convert
     * @return An integer
     */
    var toInteger_1 = function toInteger(value) {
        value = Number(value);
        if (isNaN(value)) {
            return 0;
        }
        if (value === 0 || !isFinite(value)) {
            return value;
        }
        return (value > 0 ? 1 : -1) * Math.floor(Math.abs(value));
    };
    /**
     * Normalizes an offset against a given length, wrapping it if negative.
     *
     * @param value The original offset
     * @param length The total length to normalize against
     * @return If negative, provide a distance from the end (length); otherwise provide a distance from 0
     */
    var normalizeOffset_1 = function normalizeOffset(value, length) {
        return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
    };
    exports.from = function from(arrayLike, mapFunction, thisArg) {
        if (arrayLike == null) {
            throw new TypeError('from: requires an array-like object');
        }
        if (mapFunction && thisArg) {
            mapFunction = mapFunction.bind(thisArg);
        }
        /* tslint:disable-next-line:variable-name */
        var Constructor = this;
        var length = toLength_1(arrayLike.length);
        // Support extension
        var array = typeof Constructor === 'function' ? Object(new Constructor(length)) : new Array(length);
        if (!iterator_1.isArrayLike(arrayLike) && !iterator_1.isIterable(arrayLike)) {
            return array;
        }
        // if this is an array and the normalized length is 0, just return an empty array. this prevents a problem
        // with the iteration on IE when using a NaN array length.
        if (iterator_1.isArrayLike(arrayLike)) {
            if (length === 0) {
                return [];
            }
            for (var i = 0; i < arrayLike.length; i++) {
                array[i] = mapFunction ? mapFunction(arrayLike[i], i) : arrayLike[i];
            }
        }
        else {
            var i = 0;
            try {
                for (var arrayLike_1 = tslib_1.__values(arrayLike), arrayLike_1_1 = arrayLike_1.next(); !arrayLike_1_1.done; arrayLike_1_1 = arrayLike_1.next()) {
                    var value = arrayLike_1_1.value;
                    array[i] = mapFunction ? mapFunction(value, i) : value;
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (arrayLike_1_1 && !arrayLike_1_1.done && (_a = arrayLike_1.return)) _a.call(arrayLike_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (arrayLike.length !== undefined) {
            array.length = length;
        }
        return array;
        var e_1, _a;
    };
    exports.of = function of() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Array.prototype.slice.call(items);
    };
    exports.copyWithin = function copyWithin(target, offset, start, end) {
        if (target == null) {
            throw new TypeError('copyWithin: target must be an array-like object');
        }
        var length = toLength_1(target.length);
        offset = normalizeOffset_1(toInteger_1(offset), length);
        start = normalizeOffset_1(toInteger_1(start), length);
        end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
        var count = Math.min(end - start, length - offset);
        var direction = 1;
        if (offset > start && offset < start + count) {
            direction = -1;
            start += count - 1;
            offset += count - 1;
        }
        while (count > 0) {
            if (start in target) {
                target[offset] = target[start];
            }
            else {
                delete target[offset];
            }
            offset += direction;
            start += direction;
            count--;
        }
        return target;
    };
    exports.fill = function fill(target, value, start, end) {
        var length = toLength_1(target.length);
        var i = normalizeOffset_1(toInteger_1(start), length);
        end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
        while (i < end) {
            target[i++] = value;
        }
        return target;
    };
    exports.find = function find(target, callback, thisArg) {
        var index = exports.findIndex(target, callback, thisArg);
        return index !== -1 ? target[index] : undefined;
    };
    exports.findIndex = function findIndex(target, callback, thisArg) {
        var length = toLength_1(target.length);
        if (!callback) {
            throw new TypeError('find: second argument must be a function');
        }
        if (thisArg) {
            callback = callback.bind(thisArg);
        }
        for (var i = 0; i < length; i++) {
            if (callback(target[i], i, target)) {
                return i;
            }
        }
        return -1;
    };
}
if (has_1.default('es7-array')) {
    exports.includes = util_1.wrapNative(global_1.default.Array.prototype.includes);
}
else {
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    var toLength_2 = function toLength(length) {
        length = Number(length);
        if (isNaN(length)) {
            return 0;
        }
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
    };
    exports.includes = function includes(target, searchElement, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var len = toLength_2(target.length);
        for (var i = fromIndex; i < len; ++i) {
            var currentElement = target[i];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
        }
        return false;
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/global.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var globalObject = (function () {
    if (typeof global !== 'undefined') {
        // global spec defines a reference to the global object called 'global'
        // https://github.com/tc39/proposal-global
        // `global` is also defined in NodeJS
        return global;
    }
    else if (typeof window !== 'undefined') {
        // window is defined in browsers
        return window;
    }
    else if (typeof self !== 'undefined') {
        // self is defined in WebWorkers
        return self;
    }
})();
exports.default = globalObject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var string_1 = __webpack_require__("./node_modules/@dojo/shim/string.js");
var staticDone = { done: true, value: undefined };
/**
 * A class that _shims_ an iterator interface on array like objects.
 */
var ShimIterator = /** @class */ (function () {
    function ShimIterator(list) {
        this._nextIndex = -1;
        if (isIterable(list)) {
            this._nativeIterator = list[Symbol.iterator]();
        }
        else {
            this._list = list;
        }
    }
    /**
     * Return the next iteration result for the Iterator
     */
    ShimIterator.prototype.next = function () {
        if (this._nativeIterator) {
            return this._nativeIterator.next();
        }
        if (!this._list) {
            return staticDone;
        }
        if (++this._nextIndex < this._list.length) {
            return {
                done: false,
                value: this._list[this._nextIndex]
            };
        }
        return staticDone;
    };
    ShimIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ShimIterator;
}());
exports.ShimIterator = ShimIterator;
/**
 * A type guard for checking if something has an Iterable interface
 *
 * @param value The value to type guard against
 */
function isIterable(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
exports.isIterable = isIterable;
/**
 * A type guard for checking if something is ArrayLike
 *
 * @param value The value to type guard against
 */
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
exports.isArrayLike = isArrayLike;
/**
 * Returns the iterator for an object
 *
 * @param iterable The iterable object to return the iterator for
 */
function get(iterable) {
    if (isIterable(iterable)) {
        return iterable[Symbol.iterator]();
    }
    else if (isArrayLike(iterable)) {
        return new ShimIterator(iterable);
    }
}
exports.get = get;
/**
 * Shims the functionality of `for ... of` blocks
 *
 * @param iterable The object the provides an interator interface
 * @param callback The callback which will be called for each item of the iterable
 * @param thisArg Optional scope to pass the callback
 */
function forOf(iterable, callback, thisArg) {
    var broken = false;
    function doBreak() {
        broken = true;
    }
    /* We need to handle iteration of double byte strings properly */
    if (isArrayLike(iterable) && typeof iterable === 'string') {
        var l = iterable.length;
        for (var i = 0; i < l; ++i) {
            var char = iterable[i];
            if (i + 1 < l) {
                var code = char.charCodeAt(0);
                if (code >= string_1.HIGH_SURROGATE_MIN && code <= string_1.HIGH_SURROGATE_MAX) {
                    char += iterable[++i];
                }
            }
            callback.call(thisArg, char, iterable, doBreak);
            if (broken) {
                return;
            }
        }
    }
    else {
        var iterator = get(iterable);
        if (iterator) {
            var result = iterator.next();
            while (!result.done) {
                callback.call(thisArg, result.value, iterable, doBreak);
                if (broken) {
                    return;
                }
                result = iterator.next();
            }
        }
    }
}
exports.forOf = forOf;

/***/ }),

/***/ "./node_modules/@dojo/shim/number.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
/**
 * The smallest interval between two representable numbers.
 */
exports.EPSILON = 1;
/**
 * The maximum safe integer in JavaScript
 */
exports.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
/**
 * The minimum safe integer in JavaScript
 */
exports.MIN_SAFE_INTEGER = -exports.MAX_SAFE_INTEGER;
/**
 * Determines whether the passed value is NaN without coersion.
 *
 * @param value The value to test
 * @return true if the value is NaN, false if it is not
 */
function isNaN(value) {
    return typeof value === 'number' && global_1.default.isNaN(value);
}
exports.isNaN = isNaN;
/**
 * Determines whether the passed value is a finite number without coersion.
 *
 * @param value The value to test
 * @return true if the value is finite, false if it is not
 */
function isFinite(value) {
    return typeof value === 'number' && global_1.default.isFinite(value);
}
exports.isFinite = isFinite;
/**
 * Determines whether the passed value is an integer.
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
function isInteger(value) {
    return isFinite(value) && Math.floor(value) === value;
}
exports.isInteger = isInteger;
/**
 * Determines whether the passed value is an integer that is 'safe,' meaning:
 *   1. it can be expressed as an IEEE-754 double precision number
 *   2. it has a one-to-one mapping to a mathematical integer, meaning its
 *      IEEE-754 representation cannot be the result of rounding any other
 *      integer to fit the IEEE-754 representation
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
function isSafeInteger(value) {
    return isInteger(value) && Math.abs(value) <= exports.MAX_SAFE_INTEGER;
}
exports.isSafeInteger = isSafeInteger;

/***/ }),

/***/ "./node_modules/@dojo/shim/object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
if (has_1.default('es6-object')) {
    var globalObject = global_1.default.Object;
    exports.assign = globalObject.assign;
    exports.getOwnPropertyDescriptor = globalObject.getOwnPropertyDescriptor;
    exports.getOwnPropertyNames = globalObject.getOwnPropertyNames;
    exports.getOwnPropertySymbols = globalObject.getOwnPropertySymbols;
    exports.is = globalObject.is;
    exports.keys = globalObject.keys;
}
else {
    exports.keys = function symbolAwareKeys(o) {
        return Object.keys(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    exports.assign = function assign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        sources.forEach(function (nextSource) {
            if (nextSource) {
                // Skip over if undefined or null
                exports.keys(nextSource).forEach(function (nextKey) {
                    to[nextKey] = nextSource[nextKey];
                });
            }
        });
        return to;
    };
    exports.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(o, prop) {
        if (Symbol_1.isSymbol(prop)) {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
        else {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
    };
    exports.getOwnPropertyNames = function getOwnPropertyNames(o) {
        return Object.getOwnPropertyNames(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    exports.getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return Object.getOwnPropertyNames(o)
            .filter(function (key) { return Boolean(key.match(/^@@.+/)); })
            .map(function (key) { return Symbol.for(key.substring(2)); });
    };
    exports.is = function is(value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2; // -0
        }
        return value1 !== value1 && value2 !== value2; // NaN
    };
}
if (has_1.default('es2017-object')) {
    var globalObject = global_1.default.Object;
    exports.getOwnPropertyDescriptors = globalObject.getOwnPropertyDescriptors;
    exports.entries = globalObject.entries;
    exports.values = globalObject.values;
}
else {
    exports.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(o) {
        return exports.getOwnPropertyNames(o).reduce(function (previous, key) {
            previous[key] = exports.getOwnPropertyDescriptor(o, key);
            return previous;
        }, {});
    };
    exports.entries = function entries(o) {
        return exports.keys(o).map(function (key) { return [key, o[key]]; });
    };
    exports.values = function values(o) {
        return exports.keys(o).map(function (key) { return o[key]; });
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
/**
 * The minimum location of high surrogates
 */
exports.HIGH_SURROGATE_MIN = 0xd800;
/**
 * The maximum location of high surrogates
 */
exports.HIGH_SURROGATE_MAX = 0xdbff;
/**
 * The minimum location of low surrogates
 */
exports.LOW_SURROGATE_MIN = 0xdc00;
/**
 * The maximum location of low surrogates
 */
exports.LOW_SURROGATE_MAX = 0xdfff;
if (has_1.default('es6-string') && has_1.default('es6-string-raw')) {
    exports.fromCodePoint = global_1.default.String.fromCodePoint;
    exports.raw = global_1.default.String.raw;
    exports.codePointAt = util_1.wrapNative(global_1.default.String.prototype.codePointAt);
    exports.endsWith = util_1.wrapNative(global_1.default.String.prototype.endsWith);
    exports.includes = util_1.wrapNative(global_1.default.String.prototype.includes);
    exports.normalize = util_1.wrapNative(global_1.default.String.prototype.normalize);
    exports.repeat = util_1.wrapNative(global_1.default.String.prototype.repeat);
    exports.startsWith = util_1.wrapNative(global_1.default.String.prototype.startsWith);
}
else {
    /**
     * Validates that text is defined, and normalizes position (based on the given default if the input is NaN).
     * Used by startsWith, includes, and endsWith.
     *
     * @return Normalized position.
     */
    var normalizeSubstringArgs_1 = function (name, text, search, position, isEnd) {
        if (isEnd === void 0) { isEnd = false; }
        if (text == null) {
            throw new TypeError('string.' + name + ' requires a valid string to search against.');
        }
        var length = text.length;
        position = position !== position ? (isEnd ? length : 0) : position;
        return [text, String(search), Math.min(Math.max(position, 0), length)];
    };
    exports.fromCodePoint = function fromCodePoint() {
        var codePoints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            codePoints[_i] = arguments[_i];
        }
        // Adapted from https://github.com/mathiasbynens/String.fromCodePoint
        var length = arguments.length;
        if (!length) {
            return '';
        }
        var fromCharCode = String.fromCharCode;
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var index = -1;
        var result = '';
        while (++index < length) {
            var codePoint = Number(arguments[index]);
            // Code points must be finite integers within the valid range
            var isValid = isFinite(codePoint) && Math.floor(codePoint) === codePoint && codePoint >= 0 && codePoint <= 0x10ffff;
            if (!isValid) {
                throw RangeError('string.fromCodePoint: Invalid code point ' + codePoint);
            }
            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            }
            else {
                // Astral code point; split in surrogate halves
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                var highSurrogate = (codePoint >> 10) + exports.HIGH_SURROGATE_MIN;
                var lowSurrogate = codePoint % 0x400 + exports.LOW_SURROGATE_MIN;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += fromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
    exports.raw = function raw(callSite) {
        var substitutions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            substitutions[_i - 1] = arguments[_i];
        }
        var rawStrings = callSite.raw;
        var result = '';
        var numSubstitutions = substitutions.length;
        if (callSite == null || callSite.raw == null) {
            throw new TypeError('string.raw requires a valid callSite object with a raw value');
        }
        for (var i = 0, length_1 = rawStrings.length; i < length_1; i++) {
            result += rawStrings[i] + (i < numSubstitutions && i < length_1 - 1 ? substitutions[i] : '');
        }
        return result;
    };
    exports.codePointAt = function codePointAt(text, position) {
        if (position === void 0) { position = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.codePointAt
        if (text == null) {
            throw new TypeError('string.codePointAt requries a valid string.');
        }
        var length = text.length;
        if (position !== position) {
            position = 0;
        }
        if (position < 0 || position >= length) {
            return undefined;
        }
        // Get the first code unit
        var first = text.charCodeAt(position);
        if (first >= exports.HIGH_SURROGATE_MIN && first <= exports.HIGH_SURROGATE_MAX && length > position + 1) {
            // Start of a surrogate pair (high surrogate and there is a next code unit); check for low surrogate
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            var second = text.charCodeAt(position + 1);
            if (second >= exports.LOW_SURROGATE_MIN && second <= exports.LOW_SURROGATE_MAX) {
                return (first - exports.HIGH_SURROGATE_MIN) * 0x400 + second - exports.LOW_SURROGATE_MIN + 0x10000;
            }
        }
        return first;
    };
    exports.endsWith = function endsWith(text, search, endPosition) {
        if (endPosition == null) {
            endPosition = text.length;
        }
        _a = tslib_1.__read(normalizeSubstringArgs_1('endsWith', text, search, endPosition, true), 3), text = _a[0], search = _a[1], endPosition = _a[2];
        var start = endPosition - search.length;
        if (start < 0) {
            return false;
        }
        return text.slice(start, endPosition) === search;
        var _a;
    };
    exports.includes = function includes(text, search, position) {
        if (position === void 0) { position = 0; }
        _a = tslib_1.__read(normalizeSubstringArgs_1('includes', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        return text.indexOf(search, position) !== -1;
        var _a;
    };
    exports.repeat = function repeat(text, count) {
        if (count === void 0) { count = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.repeat
        if (text == null) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (count !== count) {
            count = 0;
        }
        if (count < 0 || count === Infinity) {
            throw new RangeError('string.repeat requires a non-negative finite count.');
        }
        var result = '';
        while (count) {
            if (count % 2) {
                result += text;
            }
            if (count > 1) {
                text += text;
            }
            count >>= 1;
        }
        return result;
    };
    exports.startsWith = function startsWith(text, search, position) {
        if (position === void 0) { position = 0; }
        search = String(search);
        _a = tslib_1.__read(normalizeSubstringArgs_1('startsWith', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        var end = position + search.length;
        if (end > text.length) {
            return false;
        }
        return text.slice(position, end) === search;
        var _a;
    };
}
if (has_1.default('es2017-string')) {
    exports.padEnd = util_1.wrapNative(global_1.default.String.prototype.padEnd);
    exports.padStart = util_1.wrapNative(global_1.default.String.prototype.padStart);
}
else {
    exports.padEnd = function padEnd(text, maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padEnd requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(text);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText +=
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length);
        }
        return strText;
    };
    exports.padStart = function padStart(text, maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padStart requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(text);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText =
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length) +
                    strText;
        }
        return strText;
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/support/has.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var has_1 = __webpack_require__("./node_modules/@dojo/has/has.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
exports.default = has_1.default;
tslib_1.__exportStar(__webpack_require__("./node_modules/@dojo/has/has.js"), exports);
/* ECMAScript 6 and 7 Features */
/* Array */
has_1.add('es6-array', function () {
    return (['from', 'of'].every(function (key) { return key in global_1.default.Array; }) &&
        ['findIndex', 'find', 'copyWithin'].every(function (key) { return key in global_1.default.Array.prototype; }));
}, true);
has_1.add('es6-array-fill', function () {
    if ('fill' in global_1.default.Array.prototype) {
        /* Some versions of Safari do not properly implement this */
        return [1].fill(9, Number.POSITIVE_INFINITY)[0] === 1;
    }
    return false;
}, true);
has_1.add('es7-array', function () { return 'includes' in global_1.default.Array.prototype; }, true);
/* Map */
has_1.add('es6-map', function () {
    if (typeof global_1.default.Map === 'function') {
        /*
    IE11 and older versions of Safari are missing critical ES6 Map functionality
    We wrap this in a try/catch because sometimes the Map constructor exists, but does not
    take arguments (iOS 8.4)
     */
        try {
            var map = new global_1.default.Map([[0, 1]]);
            return (map.has(0) &&
                typeof map.keys === 'function' &&
                has_1.default('es6-symbol') &&
                typeof map.values === 'function' &&
                typeof map.entries === 'function');
        }
        catch (e) {
            /* istanbul ignore next: not testing on iOS at the moment */
            return false;
        }
    }
    return false;
}, true);
/* Math */
has_1.add('es6-math', function () {
    return [
        'clz32',
        'sign',
        'log10',
        'log2',
        'log1p',
        'expm1',
        'cosh',
        'sinh',
        'tanh',
        'acosh',
        'asinh',
        'atanh',
        'trunc',
        'fround',
        'cbrt',
        'hypot'
    ].every(function (name) { return typeof global_1.default.Math[name] === 'function'; });
}, true);
has_1.add('es6-math-imul', function () {
    if ('imul' in global_1.default.Math) {
        /* Some versions of Safari on ios do not properly implement this */
        return Math.imul(0xffffffff, 5) === -5;
    }
    return false;
}, true);
/* Object */
has_1.add('es6-object', function () {
    return (has_1.default('es6-symbol') &&
        ['assign', 'is', 'getOwnPropertySymbols', 'setPrototypeOf'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; }));
}, true);
has_1.add('es2017-object', function () {
    return ['values', 'entries', 'getOwnPropertyDescriptors'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; });
}, true);
/* Observable */
has_1.add('es-observable', function () { return typeof global_1.default.Observable !== 'undefined'; }, true);
/* Promise */
has_1.add('es6-promise', function () { return typeof global_1.default.Promise !== 'undefined' && has_1.default('es6-symbol'); }, true);
/* Set */
has_1.add('es6-set', function () {
    if (typeof global_1.default.Set === 'function') {
        /* IE11 and older versions of Safari are missing critical ES6 Set functionality */
        var set = new global_1.default.Set([1]);
        return set.has(1) && 'keys' in set && typeof set.keys === 'function' && has_1.default('es6-symbol');
    }
    return false;
}, true);
/* String */
has_1.add('es6-string', function () {
    return ([
        /* static methods */
        'fromCodePoint'
    ].every(function (key) { return typeof global_1.default.String[key] === 'function'; }) &&
        [
            /* instance methods */
            'codePointAt',
            'normalize',
            'repeat',
            'startsWith',
            'endsWith',
            'includes'
        ].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; }));
}, true);
has_1.add('es6-string-raw', function () {
    function getCallSite(callSite) {
        var substitutions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            substitutions[_i - 1] = arguments[_i];
        }
        var result = tslib_1.__spread(callSite);
        result.raw = callSite.raw;
        return result;
    }
    if ('raw' in global_1.default.String) {
        var b = 1;
        var callSite = getCallSite(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["a\n", ""], ["a\\n", ""])), b);
        callSite.raw = ['a\\n'];
        var supportsTrunc = global_1.default.String.raw(callSite, 42) === 'a:\\n';
        return supportsTrunc;
    }
    return false;
}, true);
has_1.add('es2017-string', function () {
    return ['padStart', 'padEnd'].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; });
}, true);
/* Symbol */
has_1.add('es6-symbol', function () { return typeof global_1.default.Symbol !== 'undefined' && typeof Symbol() === 'symbol'; }, true);
/* WeakMap */
has_1.add('es6-weakmap', function () {
    if (typeof global_1.default.WeakMap !== 'undefined') {
        /* IE11 and older versions of Safari are missing critical ES6 Map functionality */
        var key1 = {};
        var key2 = {};
        var map = new global_1.default.WeakMap([[key1, 1]]);
        Object.freeze(key1);
        return map.get(key1) === 1 && map.set(key2, 2) === map && has_1.default('es6-symbol');
    }
    return false;
}, true);
/* Miscellaneous features */
has_1.add('microtasks', function () { return has_1.default('es6-promise') || has_1.default('host-node') || has_1.default('dom-mutationobserver'); }, true);
has_1.add('postmessage', function () {
    // If window is undefined, and we have postMessage, it probably means we're in a web worker. Web workers have
    // post message but it doesn't work how we expect it to, so it's best just to pretend it doesn't exist.
    return typeof global_1.default.window !== 'undefined' && typeof global_1.default.postMessage === 'function';
}, true);
has_1.add('raf', function () { return typeof global_1.default.requestAnimationFrame === 'function'; }, true);
has_1.add('setimmediate', function () { return typeof global_1.default.setImmediate !== 'undefined'; }, true);
/* DOM Features */
has_1.add('dom-mutationobserver', function () {
    if (has_1.default('host-browser') && Boolean(global_1.default.MutationObserver || global_1.default.WebKitMutationObserver)) {
        // IE11 has an unreliable MutationObserver implementation where setProperty() does not
        // generate a mutation event, observers can crash, and the queue does not drain
        // reliably. The following feature test was adapted from
        // https://gist.github.com/t10ko/4aceb8c71681fdb275e33efe5e576b14
        var example = document.createElement('div');
        /* tslint:disable-next-line:variable-name */
        var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
        var observer = new HostMutationObserver(function () { });
        observer.observe(example, { attributes: true });
        example.style.setProperty('display', 'block');
        return Boolean(observer.takeRecords().length);
    }
    return false;
}, true);
var templateObject_1;

/***/ }),

/***/ "./node_modules/@dojo/shim/support/queue.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
function executeTask(item) {
    if (item && item.isActive && item.callback) {
        item.callback();
    }
}
function getQueueHandle(item, destructor) {
    return {
        destroy: function () {
            this.destroy = function () { };
            item.isActive = false;
            item.callback = null;
            if (destructor) {
                destructor();
            }
        }
    };
}
var checkMicroTaskQueue;
var microTasks;
/**
 * Schedules a callback to the macrotask queue.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueTask = (function () {
    var destructor;
    var enqueue;
    // Since the IE implementation of `setImmediate` is not flawless, we will test for `postMessage` first.
    if (has_1.default('postmessage')) {
        var queue_1 = [];
        global_1.default.addEventListener('message', function (event) {
            // Confirm that the event was triggered by the current window and by this particular implementation.
            if (event.source === global_1.default && event.data === 'dojo-queue-message') {
                event.stopPropagation();
                if (queue_1.length) {
                    executeTask(queue_1.shift());
                }
            }
        });
        enqueue = function (item) {
            queue_1.push(item);
            global_1.default.postMessage('dojo-queue-message', '*');
        };
    }
    else if (has_1.default('setimmediate')) {
        destructor = global_1.default.clearImmediate;
        enqueue = function (item) {
            return setImmediate(executeTask.bind(null, item));
        };
    }
    else {
        destructor = global_1.default.clearTimeout;
        enqueue = function (item) {
            return setTimeout(executeTask.bind(null, item), 0);
        };
    }
    function queueTask(callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        var id = enqueue(item);
        return getQueueHandle(item, destructor &&
            function () {
                destructor(id);
            });
    }
    // TODO: Use aspect.before when it is available.
    return has_1.default('microtasks')
        ? queueTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueTask(callback);
        };
})();
// When no mechanism for registering microtasks is exposed by the environment, microtasks will
// be queued and then executed in a single macrotask before the other macrotasks are executed.
if (!has_1.default('microtasks')) {
    var isMicroTaskQueued_1 = false;
    microTasks = [];
    checkMicroTaskQueue = function () {
        if (!isMicroTaskQueued_1) {
            isMicroTaskQueued_1 = true;
            exports.queueTask(function () {
                isMicroTaskQueued_1 = false;
                if (microTasks.length) {
                    var item = void 0;
                    while ((item = microTasks.shift())) {
                        executeTask(item);
                    }
                }
            });
        }
    };
}
/**
 * Schedules an animation task with `window.requestAnimationFrame` if it exists, or with `queueTask` otherwise.
 *
 * Since requestAnimationFrame's behavior does not match that expected from `queueTask`, it is not used there.
 * However, at times it makes more sense to delegate to requestAnimationFrame; hence the following method.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueAnimationTask = (function () {
    if (!has_1.default('raf')) {
        return exports.queueTask;
    }
    function queueAnimationTask(callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        var rafId = requestAnimationFrame(executeTask.bind(null, item));
        return getQueueHandle(item, function () {
            cancelAnimationFrame(rafId);
        });
    }
    // TODO: Use aspect.before when it is available.
    return has_1.default('microtasks')
        ? queueAnimationTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueAnimationTask(callback);
        };
})();
/**
 * Schedules a callback to the microtask queue.
 *
 * Any callbacks registered with `queueMicroTask` will be executed before the next macrotask. If no native
 * mechanism for scheduling macrotasks is exposed, then any callbacks will be fired before any macrotask
 * registered with `queueTask` or `queueAnimationTask`.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueMicroTask = (function () {
    var enqueue;
    if (has_1.default('host-node')) {
        enqueue = function (item) {
            global_1.default.process.nextTick(executeTask.bind(null, item));
        };
    }
    else if (has_1.default('es6-promise')) {
        enqueue = function (item) {
            global_1.default.Promise.resolve(item).then(executeTask);
        };
    }
    else if (has_1.default('dom-mutationobserver')) {
        /* tslint:disable-next-line:variable-name */
        var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
        var node_1 = document.createElement('div');
        var queue_2 = [];
        var observer = new HostMutationObserver(function () {
            while (queue_2.length > 0) {
                var item = queue_2.shift();
                if (item && item.isActive && item.callback) {
                    item.callback();
                }
            }
        });
        observer.observe(node_1, { attributes: true });
        enqueue = function (item) {
            queue_2.push(item);
            node_1.setAttribute('queueStatus', '1');
        };
    }
    else {
        enqueue = function (item) {
            checkMicroTaskQueue();
            microTasks.push(item);
        };
    }
    return function (callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        enqueue(item);
        return getQueueHandle(item);
    };
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/@dojo/shim/support/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper function to generate a value property descriptor
 *
 * @param value        The value the property descriptor should be set to
 * @param enumerable   If the property should be enumberable, defaults to false
 * @param writable     If the property should be writable, defaults to true
 * @param configurable If the property should be configurable, defaults to true
 * @return             The property descriptor object
 */
function getValueDescriptor(value, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    return {
        value: value,
        enumerable: enumerable,
        writable: writable,
        configurable: configurable
    };
}
exports.getValueDescriptor = getValueDescriptor;
function wrapNative(nativeFunction) {
    return function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return nativeFunction.apply(target, args);
    };
}
exports.wrapNative = wrapNative;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/harness.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
__webpack_require__("./node_modules/pepjs/dist/pep.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var afterRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/afterRender.js");
var Projector_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.js");
var assertRender_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/assertRender.js");
var callListener_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/callListener.js");
var sendEvent_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/sendEvent.js");
/* tslint:disable:variable-name */
var ROOT_CUSTOM_ELEMENT_NAME = 'test--harness';
var WIDGET_STUB_CUSTOM_ELEMENT = 'test--widget-stub';
var WIDGET_STUB_NAME_PROPERTY = 'data--widget-name';
var harnessId = 0;
/**
 * An internal function which finds a DNode base on a `key`
 * @param target the root DNode to search
 * @param key the key to match
 */
function findDNodeByKey(target, key) {
    if (!target) {
        return;
    }
    if (Array.isArray(target)) {
        var found_1;
        target.forEach(function (node) {
            if (found_1) {
                if (findDNodeByKey(node, key)) {
                    console.warn("Duplicate key of \"" + key + "\" found.");
                }
            }
            else {
                found_1 = findDNodeByKey(node, key);
            }
        });
        return found_1;
    }
    else {
        if (target && typeof target === 'object') {
            if (target.properties && target.properties.key === key) {
                return target;
            }
            return findDNodeByKey(target.children, key);
        }
    }
}
exports.findDNodeByKey = findDNodeByKey;
/**
 * Decorate a `DNode` where any `WNode`s are replaced with stubbed widgets
 * @param target The `DNode` to decorate with stubbed widgets
 */
function stubRender(target) {
    if (target) {
        if (Array.isArray(target)) {
            target.forEach(function (node) {
                decorateTarget(node);
            });
        }
        else {
            decorateTarget(target);
        }
    }
    return target;
}
function decorateTarget(target) {
    d_1.decorate(target, function (dNode) {
        var widgetConstructor = dNode.widgetConstructor, properties = dNode.properties;
        dNode.widgetConstructor = StubWidget;
        properties._stubTag = WIDGET_STUB_CUSTOM_ELEMENT;
        properties._widgetName =
            typeof widgetConstructor === 'string'
                ? widgetConstructor
                : widgetConstructor.name || '<Anonymous>';
    }, d_1.isWNode);
}
var StubWidget = /** @class */ (function (_super) {
    tslib_1.__extends(StubWidget, _super);
    function StubWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StubWidget.prototype.render = function () {
        var _a = this.properties, tag = _a._stubTag, widgetName = _a._widgetName;
        return d_1.v(tag, (_b = {}, _b[WIDGET_STUB_NAME_PROPERTY] = widgetName, _b), this.children);
        var _b;
    };
    return StubWidget;
}(WidgetBase_1.default));
/**
 * A mixin that adds a spy to a widget
 * @param base The base class to add the render spy to
 * @param target An object with a property named `lastRender` which will be set to the result of the `render()` method
 */
function SpyWidgetMixin(base, target) {
    var SpyRender = /** @class */ (function (_super) {
        tslib_1.__extends(SpyRender, _super);
        function SpyRender() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpyRender.prototype.spyRender = function (result) {
            target.actualRender(result);
            return stubRender(result);
        };
        SpyRender.prototype.meta = function (provider) {
            return target.decorateMeta(_super.prototype.meta.call(this, provider));
        };
        tslib_1.__decorate([
            afterRender_1.afterRender()
        ], SpyRender.prototype, "spyRender", null);
        return SpyRender;
    }(base));
    return SpyRender;
}
/**
 * A private class that is used to actually render the widget and keep track of the last render by
 * the harnessed widget.
 */
var WidgetHarness = /** @class */ (function (_super) {
    tslib_1.__extends(WidgetHarness, _super);
    function WidgetHarness(widgetConstructor, metaData) {
        var _this = _super.call(this) || this;
        _this._id = ROOT_CUSTOM_ELEMENT_NAME + '-' + ++harnessId;
        _this.didRender = false;
        _this.renderCount = 0;
        _this._widgetConstructor = SpyWidgetMixin(widgetConstructor, _this);
        _this._metaData = metaData;
        return _this;
    }
    /**
     * Called by a harnessed widget's render spy, allowing potential assertion of the render
     * @param actual The render, just after `afterRender`
     */
    WidgetHarness.prototype.actualRender = function (actual) {
        this.lastRender = actual;
        this.didRender = true;
        this.renderCount++;
        var _a = this, message = _a.assertionMessage, expected = _a.expectedRender;
        if (expected) {
            this.expectedRender = undefined;
            this.assertionMessage = undefined;
            assertRender_1.default(actual, expected, message);
        }
    };
    /**
     * _Mixin_ the methods that are provided as part of the mock.
     * @param provider The instance of the meta provider associated with the harnessed widget
     */
    WidgetHarness.prototype.decorateMeta = function (provider) {
        var data = this._metaData.get(provider.constructor);
        return data ? object_1.assign(provider, data.mocks) : provider;
    };
    WidgetHarness.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
    };
    /**
     * Wrap the widget in a custom element
     */
    WidgetHarness.prototype.render = function () {
        var _a = this, id = _a._id, _widgetConstructor = _a._widgetConstructor, children = _a.children, properties = _a.properties;
        return d_1.v(ROOT_CUSTOM_ELEMENT_NAME, { id: id }, [d_1.w(_widgetConstructor, properties, children)]);
    };
    return WidgetHarness;
}(WidgetBase_1.default));
var ProjectorWidgetHarness = Projector_1.ProjectorMixin(WidgetHarness);
/**
 * Harness a widget constructor, providing an API to interact with the widget for testing purposes.
 */
var Harness = /** @class */ (function (_super) {
    tslib_1.__extends(Harness, _super);
    function Harness(widgetConstructor, root) {
        var _this = _super.call(this) || this;
        _this._metaMap = new WeakMap_1.default();
        /**
         * Provides a reference to a function that can be used when creating an expected render value
         */
        _this.listener = function () { return true; };
        var widgetHarness = (_this._widgetHarness = new ProjectorWidgetHarness(widgetConstructor, _this._metaMap));
        // we want to control when the render gets scheduled, so we will hijack the projects one
        _this._scheduleRender = widgetHarness.scheduleRender.bind(widgetHarness);
        widgetHarness.scheduleRender = function () { };
        _this.own(widgetHarness);
        _this._root = root;
        return _this;
    }
    Harness.prototype._invalidate = function () {
        if (this._properties) {
            this._widgetHarness.setProperties(this._properties);
            this._properties = undefined;
        }
        if (this._children) {
            this._widgetHarness.setChildren(this._children);
            this._children = undefined;
        }
        if (!this._projectorHandle) {
            this._widgetHarness.async = false;
            this._projectorHandle = this._widgetHarness.append(this._root);
        }
        this._scheduleRender();
    };
    /**
     * Call a listener on a target node of the virtual DOM.
     * @param method The method to call on the target node
     * @param options A map of options that effect the behavior of `callListener`
     */
    Harness.prototype.callListener = function (method, options) {
        var render = this.getRender();
        if (render == null || typeof render !== 'object') {
            throw new TypeError('Widget is not rendering an HNode or WNode');
        }
        callListener_1.default(render, method, options);
    };
    /**
     * Assert an expected virtual DOM (`DNode`) against what is actually being rendered.  Will throw if the expected does
     * not match the actual.
     * @param expected The expected render (`DNode`)
     * @param message Any message to be part of an error that gets thrown if the actual and expected do not match
     */
    Harness.prototype.expectRender = function (expected, message) {
        this._widgetHarness.expectedRender = expected;
        this._widgetHarness.assertionMessage = message;
        this._widgetHarness.didRender = false;
        this._invalidate();
        if (!this._widgetHarness.didRender) {
            throw new Error('An expected render did not occur.');
        }
        return this;
    };
    /**
     * Get the root element of the harnessed widget.  This will refresh the render.
     */
    Harness.prototype.getDom = function () {
        if (!this._projectorHandle) {
            this._invalidate();
        }
        if (!this._widgetHarness.lastRender || !this._widgetHarness.lastRender.domNode) {
            throw new Error('No root node has been rendered');
        }
        return this._widgetHarness.lastRender.domNode;
    };
    /**
     * Provide a mock for a meta provider that will be used instead of source provider
     * @param provider The meta provider to mock
     * @param mocks A set of methods/properties to mock on the provider
     */
    Harness.prototype.mockMeta = function (provider, mocks) {
        var _metaMap = this._metaMap;
        if (!_metaMap.has(provider)) {
            _metaMap.set(provider, {
                handle: lang_1.createHandle(function () {
                    _metaMap.delete(provider);
                }),
                // TODO: no need to coerce in 2.5.2
                mocks: mocks
            });
        }
        else {
            // TODO: no need to coerce in 2.5.2
            _metaMap.get(provider).mocks = mocks;
        }
        return _metaMap.get(provider).handle;
    };
    /**
     * Refresh the render and return the last render's root `DNode`.
     */
    Harness.prototype.getRender = function () {
        this._invalidate();
        return this._widgetHarness.lastRender;
    };
    /**
     * Dispatch an event to the root DOM element of the rendered harnessed widget.  You can use the options to change the
     * event class, provide additional event properties, or select a different `target`.
     *
     * By default, the event class is `CustomEvent` and `bubbles` and `cancelable` are both `true` on events dispatched by
     * the harness.
     * @param type The type of event (e.g. `click` or `mousedown`)
     * @param options Options which can modify the event sent, like using a different EventClass or selecting a different
     *                        node to target, or provide the event initialisation properties
     */
    Harness.prototype.sendEvent = function (type, options) {
        if (options === void 0) { options = {}; }
        var _a = options.target, target = _a === void 0 ? this.getDom() : _a, key = options.key, sendOptions = tslib_1.__rest(options, ["target", "key"]);
        if (key) {
            var dnode = findDNodeByKey(this._widgetHarness.lastRender, key);
            if (d_1.isVNode(dnode)) {
                target = dnode.domNode;
            }
            else {
                throw new Error("Could not find key of \"" + key + "\" to sendEvent");
            }
        }
        sendEvent_1.default(target, type, sendOptions);
        return this;
    };
    /**
     * Set the children that will be used when rendering the harnessed widget
     * @param children The children to be set on the harnessed widget
     */
    Harness.prototype.setChildren = function (children) {
        this._children = children;
        return this;
    };
    /**
     * Set the properties that will be passed to the harnessed widget on the next render
     * @param properties The properties to set
     */
    Harness.prototype.setProperties = function (properties) {
        this._properties = properties;
        return this;
    };
    return Harness;
}(Evented_1.default));
exports.Harness = Harness;
/**
 * Harness a widget class for testing purposes, returning an API to interact with the harness widget class.
 * @param widgetConstructor The constructor function/class of widget that should be harnessed.
 * @param root The root where the harness should append itself to the DOM.  Defaults to `document.body`
 */
function harness(widgetConstructor, root) {
    return new Harness(widgetConstructor, root);
}
exports.default = harness;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/AssertionError.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This module is adapated from [assertion-error](https://github.com/chaijs/assertion-error)
 * from JavaScript to TypeScript
 */
/**
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param excluds excluded properties
 */
function exclude() {
    var excludes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        excludes[_i] = arguments[_i];
    }
    function excludeProps(res, obj) {
        Object.keys(obj).forEach(function (key) {
            if (!~excludes.indexOf(key)) {
                res[key] = obj[key];
            }
        });
    }
    return function extendExclude() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var res = {};
        for (var i = 0; i < args.length; i++) {
            excludeProps(res, args[i]);
        }
        return res;
    };
}
/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param message (optional)
 * @param _props properties to include (optional)
 * @param ssf start stack function (optional)
 */
function AssertionError(message, _props, ssf) {
    var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON');
    var props = extend(_props || {});
    // default values
    this.message = message || 'Unspecified AssertionError';
    this.showDiff = false;
    // copy from properties
    for (var key in props) {
        this[key] = props[key];
    }
    // capture stack trace
    if (ssf && Error.captureStackTrace) {
        Error.captureStackTrace(this, ssf);
    }
    else {
        try {
            throw new Error();
        }
        catch (e) {
            this.stack = e.stack;
        }
    }
}
/*!
 * Inherit from Error.prototype
 */
AssertionError.prototype = Object.create(Error.prototype);
/*!
 * Statically set name
 */
AssertionError.prototype.name = 'AssertionError';
/*!
 * Ensure correct constructor
 */
AssertionError.prototype.constructor = AssertionError;
/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param stack include stack (default: `true`)
 */
AssertionError.prototype.toJSON = function (stack) {
    var extend = exclude('constructor', 'toJSON', 'stack');
    var props = extend({ name: this.name }, this);
    // include stack if exists and not turned off
    if (false !== stack && this.stack) {
        props.stack = this.stack;
    }
    return props;
};
/* tslint:disable:variable-name */
var AssertionErrorConstructor = AssertionError;
exports.default = AssertionErrorConstructor;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/assertRender.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var Set_1 = __webpack_require__("./node_modules/@dojo/shim/Set.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var AssertionError_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/AssertionError.js");
var compare_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/compare.js");
var d_2 = __webpack_require__("./node_modules/@dojo/test-extras/support/d.js");
var RENDER_FAIL_MESSAGE = 'Render unexpected';
/**
 * Return a string that provides diagnostic information when comparing DNodes where one should be an array
 * @param actual The actual DNode
 * @param expected The expected DNode
 */
function getArrayPreamble(actual, expected) {
    return Array.isArray(actual)
        ? "Expected \"" + getTypeOf(expected) + "\" but got an array"
        : "Expected an array but got \"" + getTypeOf(actual) + "\"";
}
/**
 * An internal function that returns a string that contains an array of child indexes which related to the message
 * @param childIndex The index of the child to add to the message
 * @param message The message, if any to prepend the child to
 */
function getChildMessage(childIndex, message) {
    if (message === void 0) { message = ''; }
    var lastIndex = message.lastIndexOf(']');
    if (lastIndex === -1) {
        return "[" + childIndex + "] " + message;
    }
    else {
        return message.slice(0, lastIndex + 1) + ("[" + childIndex + "]") + message.slice(lastIndex + 1);
    }
}
/**
 * Return a string that provides diagnostic information when two DNodes being compared are mismatched
 * @param actual The actual DNode
 * @param expected The expected DNode
 */
function getMismatchPreamble(actual, expected) {
    return "DNode type mismatch, expected \"" + getTypeOf(expected) + "\" actual \"" + getTypeOf(actual) + "\"";
}
/**
 * Return a string that represents the type of the value, including null as a seperate type.
 * @param value The value to get the type of
 */
function getTypeOf(value) {
    return value === null ? 'null' : typeof value;
}
/**
 * Internal function that throws an AssertionError
 * @param actual actual value
 * @param expected expected value
 * @param prolog a message that provides the specific assertion issue
 * @param message any message to be part of the error
 */
function throwAssertionError(actual, expected, prolog, message) {
    throw new AssertionError_1.default(RENDER_FAIL_MESSAGE + ": " + prolog + (message ? ": " + message : ''), {
        actual: actual,
        expected: expected,
        showDiff: true
    }, assertRender);
}
/**
 * Options used to configure diff to correctly compare `DNode`s
 */
var defaultDiffOptions = {
    allowFunctionValues: true,
    ignoreProperties: ['bind']
};
function assertRender(actual, expected, options, message) {
    if (typeof options === 'string') {
        message = options;
        options = undefined;
    }
    var _a = (options ||
        {}), _b = _a.isVNode, localIsVNode = _b === void 0 ? d_1.isVNode : _b, _c = _a.isWNode, localIsWNode = _c === void 0 ? d_1.isWNode : _c, passedDiffOptions = tslib_1.__rest(_a, ["isVNode", "isWNode"]);
    var diffOptions = lang_1.assign({}, defaultDiffOptions, passedDiffOptions);
    function assertChildren(actual, expected) {
        if (actual && expected) {
            if (actual.length !== expected.length) {
                throwAssertionError(actual, expected, "Children's length mismatch", message);
            }
            actual.forEach(function (actualChild, index) {
                assertRender(actualChild, expected[index], (options || {}), getChildMessage(index, message));
            });
        }
        else {
            if (actual || expected) {
                throwAssertionError(actual, expected, actual ? 'Unxpected children' : 'Expected children', message);
            }
        }
    }
    if (Array.isArray(actual) && Array.isArray(expected)) {
        assertChildren(actual, expected);
    }
    else if (Array.isArray(actual) || Array.isArray(expected)) {
        throwAssertionError(actual, expected, getArrayPreamble(actual, expected), message);
    }
    else if ((localIsVNode(actual) && localIsVNode(expected)) || (localIsWNode(actual) && localIsWNode(expected))) {
        if (localIsVNode(actual) && localIsVNode(expected)) {
            if (actual.tag !== expected.tag) {
                /* The tags do not match */
                throwAssertionError(actual.tag, expected.tag, "Tags do not match", message);
            }
        }
        else if (localIsWNode(actual) && localIsWNode(expected)) {
            /* istanbul ignore else: not being tracked by TypeScript properly */
            if (actual.widgetConstructor !== expected.widgetConstructor) {
                /* The WNode does not share the same constructor */
                throwAssertionError(actual.widgetConstructor, expected.widgetConstructor, "WNodes do not share constructor", message);
            }
        }
        /* Inject a custom comparator for class names */
        var expectedClasses_1 = expected.properties && expected.properties.classes;
        if (expectedClasses_1 && !compare_1.isCustomDiff(expectedClasses_1)) {
            expected.properties.classes = d_2.compareProperty(function (value) {
                var expectedValue = typeof expectedClasses_1 === 'string' ? [expectedClasses_1] : expectedClasses_1;
                value = (typeof value === 'string' ? [value] : value) || [];
                var expectedSet = new Set_1.default(expectedValue.filter(function (expectedClass) { return Boolean(expectedClass); }));
                var actualSet = new Set_1.default(value.filter(function (actualClass) { return Boolean(actualClass); }));
                if (expectedSet.size !== actualSet.size) {
                    return false;
                }
                var allMatch = true;
                actualSet.forEach(function (actualClass) {
                    allMatch = allMatch && expectedSet.has(actualClass);
                });
                return allMatch;
            });
        }
        var delta = compare_1.diff(actual.properties, expected.properties, diffOptions);
        if (delta.length) {
            /* The properties do not match */
            var _d = compare_1.getComparableObjects(actual.properties, expected.properties, diffOptions), comparableA = _d.comparableA, comparableB = _d.comparableB;
            throwAssertionError(comparableA, comparableB, "Properties do not match", message);
        }
        /* We need to assert the children match */
        assertChildren(actual.children, expected.children);
    }
    else if (typeof actual === 'string' && typeof expected === 'string') {
        /* Both DNodes are strings */
        if (actual !== expected) {
            /* The strings do not match */
            throwAssertionError(actual, expected, "Unexpected string values", message);
        }
    }
    else if (d_1.isVNode(actual) && typeof expected === 'string') {
        // when doing an expected render on already rendered nodes, strings are converted to _shell_ VNodes
        // so we want to compare to those instead
        if (actual.text !== expected) {
            throwAssertionError(actual.text, expected, "Expected text differs from rendered text", message);
        }
    }
    else if (!(actual === null && expected === null)) {
        /* There is a mismatch between the types of DNodes */
        throwAssertionError(actual, expected, getMismatchPreamble(actual, expected), message);
    }
}
exports.default = assertRender;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/callListener.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var d_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/d.js");
/**
 * Call a listener on a virtual DOM node or one of its children.
 * @param node The node to resolve the listener and call
 * @param method The listener name in the `node.properties` to call
 * @param options Options that effect how the listener is called
 */
function callListener(node, method, options) {
    if (options === void 0) { options = {}; }
    var args = options.args, thisArg = options.thisArg;
    var resolvedTargets = resolveTarget(node, options);
    if (resolvedTargets == null || !resolvedTargets.length) {
        throw new TypeError("Cannot resolve target");
    }
    resolvedTargets.forEach(function (target) {
        var listener = target.properties[method];
        if (!listener) {
            throw new TypeError("Cannot resolve listener: \"" + method + "\"");
        }
        var bind = target.coreProperties ? target.coreProperties.bind : target.properties.bind;
        listener.apply(thisArg || bind, args);
    });
}
exports.default = callListener;
function resolveTarget(node, options) {
    if (Array.isArray(node)) {
        var resolvedTargets_1 = [];
        for (var i = 0, len = node.length; i < len; i++) {
            var item = node[i];
            var found = resolveTarget(item, options);
            if (found != null) {
                found.forEach(function (node) {
                    resolvedTargets_1.push(node);
                });
            }
        }
        return resolvedTargets_1;
    }
    else {
        var resolvedTarget = void 0;
        var index = options.index, key = options.key, target = options.target;
        if (target) {
            resolvedTarget = target;
        }
        else if (node != null && typeof node !== 'string') {
            if (key) {
                resolvedTarget = d_1.findKey(node, key);
            }
            else if (typeof index !== 'undefined') {
                var byIndex = d_1.findIndex(node, index);
                if (typeof byIndex === 'object' && byIndex !== null && 'properties' in byIndex) {
                    resolvedTarget = byIndex;
                }
            }
            else {
                resolvedTarget = node;
            }
        }
        return resolvedTarget && [resolvedTarget];
    }
}

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/compare.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var Set_1 = __webpack_require__("./node_modules/@dojo/shim/Set.js");
/* Assigning to local variables to improve minification and readability */
var objectCreate = Object.create;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var defineProperty = Object.defineProperty;
var isArray = Array.isArray;
var isFrozen = Object.isFrozen;
var isSealed = Object.isSealed;
/**
 * A record that describes how to instantiate a new object via a constructor function
 * @param Ctor The constructor function
 * @param args Any arguments to be passed to the constructor function
 */
/* tslint:disable:variable-name */
function createConstructRecord(Ctor, args, descriptor) {
    var record = lang_1.assign(objectCreate(null), { Ctor: Ctor });
    if (args) {
        record.args = args;
    }
    if (descriptor) {
        record.descriptor = descriptor;
    }
    return record;
}
exports.createConstructRecord = createConstructRecord;
/* tslint:enable:variable-name */
/**
 * An internal function that returns a new patch record
 *
 * @param type The type of patch record
 * @param name The property name the record refers to
 * @param descriptor The property descriptor to be installed on the object
 * @param valueRecords Any subsequenet patch recrds to be applied to the value of the descriptor
 */
function createPatchRecord(type, name, descriptor, valueRecords) {
    var patchRecord = lang_1.assign(objectCreate(null), {
        type: type,
        name: name
    });
    if (descriptor) {
        patchRecord.descriptor = descriptor;
    }
    if (valueRecords) {
        patchRecord.valueRecords = valueRecords;
    }
    return patchRecord;
}
/**
 * An internal function that returns a new splice record
 *
 * @param start Where in the array to start the splice
 * @param deleteCount The number of elements to delete from the array
 * @param add Elements to be added to the target
 */
function createSpliceRecord(start, deleteCount, add) {
    var spliceRecord = lang_1.assign(objectCreate(null), {
        type: 'splice',
        start: start,
        deleteCount: deleteCount
    });
    if (add && add.length) {
        spliceRecord.add = add;
    }
    return spliceRecord;
}
/**
 * A function that produces a value property descriptor, which assumes that properties are enumerable, writable and configurable
 * unless specified
 *
 * @param value The value for the descriptor
 * @param writable Defaults to `true` if not specified
 * @param enumerable Defaults to `true` if not specified
 * @param configurable Defaults to `true` if not specified
 */
function createValuePropertyDescriptor(value, writable, enumerable, configurable) {
    if (writable === void 0) { writable = true; }
    if (enumerable === void 0) { enumerable = true; }
    if (configurable === void 0) { configurable = true; }
    return lang_1.assign(objectCreate(null), {
        value: value,
        writable: writable,
        enumerable: enumerable,
        configurable: configurable
    });
}
/**
 * A class which is used when making a custom comparison of a non-plain object or array
 */
var CustomDiff = /** @class */ (function () {
    function CustomDiff(diff) {
        this._differ = diff;
    }
    /**
     * Get the difference of the `value`
     * @param value The value to diff
     * @param nameOrIndex A `string` if comparing a property or a `number` if comparing an array element
     * @param parent The outer parent that this value is part of
     */
    CustomDiff.prototype.diff = function (value, nameOrIndex, parent) {
        var record = this._differ(value, nameOrIndex, parent);
        if (record && typeof nameOrIndex === 'string') {
            return lang_1.assign(record, { name: nameOrIndex });
        }
    };
    return CustomDiff;
}());
exports.CustomDiff = CustomDiff;
/**
 * Internal function that detects the differences between an array and another value and returns a set of splice records that
 * describe the differences
 *
 * @param a The first array to compare to
 * @param b The second value to compare to
 * @param options An options bag that allows configuration of the behaviour of `diffArray()`
 */
function diffArray(a, b, options) {
    /* This function takes an overly simplistic approach to calculating splice records.  There are many situations where
     * in complicated array mutations, the splice records can be more optimised.
     *
     * TODO: Raise an issue for this when it is finally merged and put into core
     */
    var _a = options.allowFunctionValues, allowFunctionValues = _a === void 0 ? false : _a;
    var arrayA = a;
    var lengthA = arrayA.length;
    var arrayB = isArray(b) ? b : [];
    var lengthB = arrayB.length;
    var patchRecords = [];
    if (!lengthA && lengthB) {
        /* empty array */
        patchRecords.push(createSpliceRecord(0, lengthB));
        return patchRecords;
    }
    var add = [];
    var start = 0;
    var deleteCount = 0;
    var last = -1;
    function flushSpliceRecord() {
        if (deleteCount || add.length) {
            patchRecords.push(createSpliceRecord(start, start + deleteCount > lengthB ? lengthB - start : deleteCount, add));
        }
    }
    function addDifference(index, adding, value) {
        if (index > last + 1) {
            /* flush the splice */
            flushSpliceRecord();
            start = index;
            deleteCount = 0;
            if (add.length) {
                add = [];
            }
        }
        if (adding) {
            add.push(value);
        }
        deleteCount++;
        last = index;
    }
    arrayA.forEach(function (valueA, index) {
        var valueB = arrayB[index];
        if (index in arrayB &&
            (valueA === valueB || (allowFunctionValues && typeof valueA === 'function' && typeof valueB === 'function'))) {
            return; /* not different */
        }
        var isValueAArray = isArray(valueA);
        var isValueAPlainObject = isPlainObject(valueA);
        if (isValueAArray || isValueAPlainObject) {
            var value = isValueAArray
                ? isArray(valueB) ? valueB : []
                : isPlainObject(valueB) ? valueB : Object.create(null);
            var valueRecords = diff(valueA, value, options);
            if (valueRecords.length) {
                /* only add if there are changes */
                addDifference(index, true, diff(valueA, value, options));
            }
        }
        else if (isPrimitive(valueA)) {
            addDifference(index, true, valueA);
        }
        else if (allowFunctionValues && typeof valueA === 'function') {
            addDifference(index, true, valueA);
        }
        else {
            throw new TypeError("Value of array element \"" + index + "\" from first argument is not a primative, plain Object, or Array.");
        }
    });
    if (lengthB > lengthA) {
        for (var index = lengthA; index < lengthB; index++) {
            addDifference(index, false);
        }
    }
    /* flush any deletes */
    flushSpliceRecord();
    return patchRecords;
}
/**
 * Internal function that detects the differences between plain objects and returns a set of patch records that
 * describe the differences
 *
 * @param a The first plain object to compare to
 * @param b The second plain object to compare to
 * @param options An options bag that allows configuration of the behaviour of `diffPlainObject()`
 */
function diffPlainObject(a, b, options) {
    var _a = options.allowFunctionValues, allowFunctionValues = _a === void 0 ? false : _a, _b = options.ignorePropertyValues, ignorePropertyValues = _b === void 0 ? [] : _b;
    var patchRecords = [];
    var _c = getComparableObjects(a, b, options), comparableA = _c.comparableA, comparableB = _c.comparableB;
    /* look for keys in a that are different from b */
    object_1.keys(comparableA).reduce(function (patchRecords, name) {
        var valueA = a[name];
        var valueB = b[name];
        var bHasOwnProperty = hasOwnProperty.call(comparableB, name);
        if (bHasOwnProperty &&
            (valueA === valueB || (allowFunctionValues && typeof valueA === 'function' && typeof valueB === 'function'))) {
            /* not different */
            /* when `allowFunctionValues` is true, functions are simply considered to be equal by `typeof` */
            return patchRecords;
        }
        var type = bHasOwnProperty ? 'update' : 'add';
        var isValueAArray = isArray(valueA);
        var isValueAPlainObject = isPlainObject(valueA);
        if (isCustomDiff(valueA) && !isCustomDiff(valueB)) {
            /* complex diff left hand */
            var result = valueA.diff(valueB, name, b);
            if (result) {
                patchRecords.push(result);
            }
        }
        else if (isCustomDiff(valueB)) {
            /* complex diff right hand */
            var result = valueB.diff(valueA, name, a);
            if (result) {
                patchRecords.push(result);
            }
        }
        else if (isValueAArray || isValueAPlainObject) {
            /* non-primitive values we can diff */
            /* this is a bit complicated, but essentially if valueA and valueB are both arrays or plain objects, then
            * we can diff those two values, if not, then we need to use an empty array or an empty object and diff
            * the valueA with that */
            var value = (isValueAArray && isArray(valueB)) || (isValueAPlainObject && isPlainObject(valueB))
                ? valueB
                : isValueAArray ? [] : objectCreate(null);
            var valueRecords = diff(valueA, value, options);
            if (valueRecords.length) {
                /* only add if there are changes */
                patchRecords.push(createPatchRecord(type, name, createValuePropertyDescriptor(value), diff(valueA, value, options)));
            }
        }
        else if (isPrimitive(valueA) ||
            (allowFunctionValues && typeof valueA === 'function') ||
            isIgnoredPropertyValue(name, a, b, ignorePropertyValues)) {
            /* primitive values, functions values if allowed, or ignored property values can just be copied */
            patchRecords.push(createPatchRecord(type, name, createValuePropertyDescriptor(valueA)));
        }
        else {
            throw new TypeError("Value of property named \"" + name + "\" from first argument is not a primative, plain Object, or Array.");
        }
        return patchRecords;
    }, patchRecords);
    /* look for keys in b that are not in a */
    object_1.keys(comparableB).reduce(function (patchRecords, name) {
        if (!hasOwnProperty.call(comparableA, name)) {
            patchRecords.push(createPatchRecord('delete', name));
        }
        return patchRecords;
    }, patchRecords);
    return patchRecords;
}
/**
 * Takes two plain objects to be compared, as well as options customizing the behavior of the comparison, and returns
 * two new objects that contain only those properties that should be compared. If a property is ignored
 * it will not be included in either returned object. If a property's value should be ignored it will be excluded
 * if it is present in both objects.
 * @param a The first object to compare
 * @param b The second object to compare
 * @param options An options bag indicating which properties should be ignored or have their values ignored, if any.
 */
function getComparableObjects(a, b, options) {
    var _a = options.ignoreProperties, ignoreProperties = _a === void 0 ? [] : _a, _b = options.ignorePropertyValues, ignorePropertyValues = _b === void 0 ? [] : _b;
    var ignore = new Set_1.default();
    var keep = new Set_1.default();
    var isIgnoredProperty = Array.isArray(ignoreProperties)
        ? function (name) {
            return ignoreProperties.some(function (value) { return (typeof value === 'string' ? name === value : value.test(name)); });
        }
        : function (name) { return ignoreProperties(name, a, b); };
    var comparableA = object_1.keys(a).reduce(function (obj, name) {
        if (isIgnoredProperty(name) ||
            (hasOwnProperty.call(b, name) && isIgnoredPropertyValue(name, a, b, ignorePropertyValues))) {
            ignore.add(name);
            return obj;
        }
        keep.add(name);
        obj[name] = a[name];
        return obj;
    }, {});
    var comparableB = object_1.keys(b).reduce(function (obj, name) {
        if (ignore.has(name) || (!keep.has(name) && isIgnoredProperty(name))) {
            return obj;
        }
        obj[name] = b[name];
        return obj;
    }, {});
    return { comparableA: comparableA, comparableB: comparableB, ignore: ignore };
}
exports.getComparableObjects = getComparableObjects;
/**
 * A guard that determines if the value is a `CustomDiff`
 * @param value The value to check
 */
function isCustomDiff(value) {
    return typeof value === 'object' && value instanceof CustomDiff;
}
exports.isCustomDiff = isCustomDiff;
/**
 * A guard that determines if the value is a `ConstructRecord`
 * @param value The value to check
 */
function isConstructRecord(value) {
    return Boolean(value && typeof value === 'object' && value !== null && value.Ctor && value.name);
}
function isIgnoredPropertyValue(name, a, b, ignoredPropertyValues) {
    return Array.isArray(ignoredPropertyValues)
        ? ignoredPropertyValues.some(function (value) {
            return typeof value === 'string' ? name === value : value.test(name);
        })
        : ignoredPropertyValues(name, a, b);
}
/**
 * A guard that determines if the value is a `PatchRecord`
 *
 * @param value The value to check
 */
function isPatchRecord(value) {
    return Boolean(value && value.type && value.name);
}
/**
 * A guard that determines if the value is an array of `PatchRecord`s
 *
 * @param value The value to check
 */
function isPatchRecordArray(value) {
    return Boolean(isArray(value) && value.length && isPatchRecord(value[0]));
}
/**
 * A guard that determines if the value is a plain object.  A plain object is an object that has
 * either no constructor (e.g. `Object.create(null)`) or has Object as its constructor.
 *
 * @param value The value to check
 */
function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && (value.constructor === Object || value.constructor === undefined));
}
/**
 * A guard that determines if the value is a primitive (including `null`), as these values are
 * fine to just copy.
 *
 * @param value The value to check
 */
function isPrimitive(value) {
    var typeofValue = typeof value;
    return (value === null ||
        typeofValue === 'undefined' ||
        typeofValue === 'string' ||
        typeofValue === 'number' ||
        typeofValue === 'boolean');
}
/**
 * A guard that determines if the value is a `SpliceRecord`
 *
 * @param value The value to check
 */
function isSpliceRecord(value) {
    return value && value.type === 'splice' && 'start' in value && 'deleteCount' in value;
}
/**
 * A guard that determines if the value is an array of `SpliceRecord`s
 *
 * @param value The value to check
 */
function isSpliceRecordArray(value) {
    return Boolean(isArray(value) && value.length && isSpliceRecord(value[0]));
}
/**
 * An internal function that patches a target with a `SpliceRecord`
 */
function patchSplice(target, _a) {
    var add = _a.add, deleteCount = _a.deleteCount, start = _a.start;
    if (add && add.length) {
        var deletedItems_1 = deleteCount ? target.slice(start, start + deleteCount) : [];
        add = add.map(function (value, index) { return resolveTargetValue(value, deletedItems_1[index]); });
        target.splice.apply(target, tslib_1.__spread([start, deleteCount], add));
    }
    else {
        target.splice(start, deleteCount);
    }
    return target;
}
/**
 * An internal function that patches a target with a `PatchRecord`
 */
function patchPatch(target, record) {
    var name = record.name;
    if (record.type === 'delete') {
        delete target[name];
        return target;
    }
    var descriptor = record.descriptor, valueRecords = record.valueRecords;
    if (valueRecords && valueRecords.length) {
        descriptor.value = patch(descriptor.value, valueRecords);
    }
    defineProperty(target, name, descriptor);
    return target;
}
var defaultConstructDescriptor = {
    configurable: true,
    enumerable: true,
    writable: true
};
function patchConstruct(target, record) {
    var args = record.args, _a = record.descriptor, descriptor = _a === void 0 ? defaultConstructDescriptor : _a, Ctor = record.Ctor, name = record.name, propertyRecords = record.propertyRecords;
    var value = new (Ctor.bind.apply(Ctor, tslib_1.__spread([void 0], (args || []))))();
    if (propertyRecords) {
        propertyRecords.forEach(function (record) { return (isConstructRecord(record) ? patchConstruct(value, record) : patchPatch(value, record)); });
    }
    defineProperty(target, name, lang_1.assign({ value: value }, descriptor));
    return target;
}
/**
 * An internal function that take a value from array being patched and the target value from the same
 * index and determines the value that should actually be patched into the target array
 */
function resolveTargetValue(patchValue, targetValue) {
    var patchIsSpliceRecordArray = isSpliceRecordArray(patchValue);
    return patchIsSpliceRecordArray || isPatchRecordArray(patchValue)
        ? patch(patchIsSpliceRecordArray
            ? isArray(targetValue) ? targetValue : []
            : isPlainObject(targetValue) ? targetValue : objectCreate(null), patchValue)
        : patchValue;
}
/**
 * Compares to plain objects or arrays and return a set of records which describe the differences between the two
 *
 * The records describe what would need to be applied to the second argument to make it look like the first argument
 *
 * @param a The plain object or array to compare with
 * @param b The plain object or array to compare to
 * @param options An options bag that allows configuration of the behaviour of `diff()`
 */
function diff(a, b, options) {
    if (options === void 0) { options = {}; }
    if (typeof a !== 'object' || typeof b !== 'object') {
        throw new TypeError('Arguments are not of type object.');
    }
    if (isArray(a)) {
        return diffArray(a, b, options);
    }
    if (isArray(b)) {
        b = objectCreate(null);
    }
    if (!isPlainObject(a) || !isPlainObject(b)) {
        throw new TypeError('Arguments are not plain Objects or Arrays.');
    }
    return diffPlainObject(a, b, options);
}
exports.diff = diff;
/**
 * Apply a set of patch records to a target.
 *
 * @param target The plain object or array that the patch records should be applied to
 * @param records A set of patch records to be applied to the target
 */
function patch(target, records) {
    if (!isArray(target) && !isPlainObject(target)) {
        throw new TypeError('A target for a patch must be either an array or a plain object.');
    }
    if (isFrozen(target) || isSealed(target)) {
        throw new TypeError('Cannot patch sealed or frozen objects.');
    }
    records.forEach(function (record) {
        target = isSpliceRecord(record)
            ? patchSplice(isArray(target) ? target : [], record) /* patch arrays */
            : isConstructRecord(record)
                ? patchConstruct(target, record) /* patch complex object */
                : patchPatch(isPlainObject(target) ? target : {}, record); /* patch plain object */
    });
    return target;
}
exports.patch = patch;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/d.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var AssertionError_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/AssertionError.js");
var compare_1 = __webpack_require__("./node_modules/@dojo/test-extras/support/compare.js");
function assignChildPropertiesByKeyOrIndex(target, keyOrIndex, properties, byKey) {
    var node = findByKeyOrIndex(target, keyOrIndex, byKey).found;
    if (!node || !(d_1.isWNode(node) || d_1.isVNode(node))) {
        var keyOrIndexString = typeof keyOrIndex === 'object' ? JSON.stringify(keyOrIndex) : keyOrIndex;
        throw new TypeError((byKey || typeof keyOrIndex === 'object' ? 'Key' : 'Index') + " of \"" + keyOrIndexString + "\" is not resolving to a valid target");
    }
    assignProperties(node, properties);
    return target;
}
function assignChildProperties(target, index, properties) {
    return assignChildPropertiesByKeyOrIndex(target, index, properties);
}
exports.assignChildProperties = assignChildProperties;
function assignChildPropertiesByKey(target, key, properties) {
    return assignChildPropertiesByKeyOrIndex(target, key, properties, true);
}
exports.assignChildPropertiesByKey = assignChildPropertiesByKey;
function assignProperties(target, properties) {
    lang_1.assign(target.properties, properties);
    return target;
}
exports.assignProperties = assignProperties;
/**
 * Creates a function which, when placed in an expected render, will call the `callback`.  If the `callback` returns `true`, the value
 * of the property is considered equal, otherwise it is considered not equal and the expected render will fail.
 * @param callback A function that is invoked when comparing the property value
 */
function compareProperty(callback) {
    function differ(value, name, parent) {
        if (!callback(value, name, parent)) {
            throw new AssertionError_1.default("The value of property \"" + name + "\" is unexpected.", {}, differ);
        }
    }
    return new compare_1.CustomDiff(differ);
}
exports.compareProperty = compareProperty;
function replaceChildByKeyOrIndex(target, indexOrKey, replacement, byKey) {
    if (byKey === void 0) { byKey = false; }
    if (!target.children) {
        throw new TypeError('Target does not have children.');
    }
    var _a = findByKeyOrIndex(target, indexOrKey, byKey), parent = _a.parent, index = _a.index;
    if (!parent || typeof index === 'undefined' || !parent.children) {
        if (byKey || typeof indexOrKey === 'object') {
            throw new TypeError("Key of \"" + (typeof indexOrKey === 'object' ? JSON.stringify(indexOrKey) : indexOrKey) + "\" is not resolving to a valid target");
        }
        else {
            throw new TypeError("Index of \"" + indexOrKey + "\" is not resolving to a valid target");
        }
    }
    else {
        parent.children[index] = replacement;
    }
    return target;
}
/**
 * Finds the child of the target that has the provided key, and replaces it with the provided node.
 *
 * *NOTE:* The replacement modifies the passed `target` and does not return a new instance of the `DNode`.
 * @param target The DNode to replace a child element on
 * @param key The key of the node to replace
 * @param replacement The DNode that replaces the found node
 * @returns {WNode | VNode}
 */
function replaceChildByKey(target, key, replacement) {
    return replaceChildByKeyOrIndex(target, key, replacement, true);
}
exports.replaceChildByKey = replaceChildByKey;
/**
 * Replace a child of DNode.
 *
 * *NOTE:* The replacement modifies the passed `target` and does not return a new instance of the `DNode`.
 * @param target The DNode to replace a child element on
 * @param index A number of the index of a child, or a string with comma separated indexes that would navigate
 * @param replacement The DNode to be replaced
 */
function replaceChild(target, index, replacement) {
    return replaceChildByKeyOrIndex(target, index, replacement);
}
exports.replaceChild = replaceChild;
function isNode(value) {
    return value && typeof value === 'object' && value !== null;
}
function findByKeyOrIndex(target, keyOrIndex, byKey) {
    if (byKey === void 0) { byKey = false; }
    if (byKey || typeof keyOrIndex === 'object') {
        return findByKey(target, keyOrIndex);
    }
    else {
        return findByIndex(target, keyOrIndex);
    }
}
function findByKey(target, key, parent, index) {
    if (target.properties.key === key) {
        return { parent: parent, found: target, index: index };
    }
    if (!target.children) {
        return {};
    }
    var nodeInfo;
    target.children.forEach(function (child, index) {
        if (isNode(child)) {
            if (nodeInfo && nodeInfo.found) {
                if (findByKey(child, key, target, index).found) {
                    console.warn("Duplicate key of \"" + (typeof key === 'object' ? JSON.stringify(key) : key) + "\" found.");
                }
            }
            else {
                nodeInfo = findByKey(child, key, target, index);
            }
        }
    });
    return nodeInfo || {};
}
function findByIndex(target, index) {
    if (typeof index === 'number') {
        return target.children ? { parent: target, found: target.children[index], index: index } : {};
    }
    var indexes = index.split(',').map(Number);
    var lastIndex = indexes.pop();
    var resolvedTarget = indexes.reduce(function (target, idx) {
        if (!(d_1.isWNode(target) || d_1.isVNode(target)) || !target.children) {
            return target;
        }
        return target.children[idx];
    }, target);
    if (!(d_1.isWNode(resolvedTarget) || d_1.isVNode(resolvedTarget)) || !resolvedTarget.children) {
        return {};
    }
    return { parent: resolvedTarget, found: resolvedTarget.children[lastIndex], index: lastIndex };
}
/**
 * Find a virtual DOM node (`WNode` or `VNode`) based on it having a matching `key` property.
 *
 * The function returns `undefined` if no node was found, otherwise it returns the node.  *NOTE* it will return the first node
 * matching the supplied `key`, but will `console.warn` if more than one node was found.
 */
function findKey(target, key) {
    var found = findByKey(target, key).found;
    return found;
}
exports.findKey = findKey;
/**
 * Return a `DNode` that is identified by supplied index
 * @param target The target `WNode` or `VNode` to resolve the index for
 * @param index A number or a string indicating the child index
 */
function findIndex(target, index) {
    var found = findByIndex(target, index).found;
    return found;
}
exports.findIndex = findIndex;
function replaceChildPropertiesByKeyOrIndex(target, indexOrKey, properties, byKey) {
    if (byKey === void 0) { byKey = false; }
    var found = findByKeyOrIndex(target, indexOrKey, byKey).found;
    if (!found || !(d_1.isWNode(found) || d_1.isVNode(found))) {
        if (byKey || typeof indexOrKey === 'object') {
            throw new TypeError("Key of \"" + (typeof indexOrKey === 'object' ? JSON.stringify(indexOrKey) : indexOrKey) + "\" is not resolving to a valid target");
        }
        else {
            throw new TypeError("Index of \"" + indexOrKey + "\" is not resolving to a valid target");
        }
    }
    replaceProperties(found, properties);
    return target;
}
function replaceChildProperties(target, index, properties) {
    return replaceChildPropertiesByKeyOrIndex(target, index, properties);
}
exports.replaceChildProperties = replaceChildProperties;
function replaceChildPropertiesByKey(target, key, properties) {
    return replaceChildPropertiesByKeyOrIndex(target, key, properties, true);
}
exports.replaceChildPropertiesByKey = replaceChildPropertiesByKey;
function replaceProperties(target, properties) {
    target.properties = properties;
    return target;
}
exports.replaceProperties = replaceProperties;

/***/ }),

/***/ "./node_modules/@dojo/test-extras/support/sendEvent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var has_1 = __webpack_require__("./node_modules/@dojo/core/has.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
has_1.add('customevent-constructor', function () {
    try {
        new window.CustomEvent('foo');
        return true;
    }
    catch (e) {
        return false;
    }
});
/**
 * Create and dispatch an event to an element
 * @param type The event type to dispatch
 * @param options A map of options to configure the event
 */
function sendEvent(target, type, options) {
    function dispatchEvent(target, event) {
        var error;
        function catcher(e) {
            e.preventDefault();
            error = e.error;
            return true;
        }
        window.addEventListener('error', catcher);
        target.dispatchEvent(event);
        window.removeEventListener('error', catcher);
        if (error) {
            throw error;
        }
    }
    var _a = options || {}, _b = _a.eventClass, eventClass = _b === void 0 ? 'CustomEvent' : _b, _c = _a.eventInit, eventInit = _c === void 0 ? {} : _c, _d = _a.selector, selector = _d === void 0 ? '' : _d;
    var dispatchTarget;
    if (selector) {
        var selectorTarget = target.querySelector(selector);
        if (selectorTarget) {
            dispatchTarget = selectorTarget;
        }
        else {
            throw new Error("Cannot resolve to an element with selector \"" + selector + "\"");
        }
    }
    else {
        dispatchTarget = target;
    }
    if (dispatchTarget) {
        var event_1;
        lang_1.assign(eventInit, {
            bubbles: 'bubbles' in eventInit ? eventInit.bubbles : true,
            cancelable: 'cancelable' in eventInit ? eventInit.cancelable : true
        });
        var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, initProps = tslib_1.__rest(eventInit, ["bubbles", "cancelable"]);
        if (has_1.default('customevent-constructor')) {
            var ctorName = eventClass in window ? eventClass : 'CustomEvent';
            event_1 = new window[ctorName](type, eventInit);
        }
        else {
            /* because the arity varies too greatly to be able to properly call all the event types, we will
            * only support CustomEvent for those platforms that don't support event constructors, which is
            * essentially IE11 */
            event_1 = dispatchTarget.ownerDocument.createEvent('CustomEvent');
            event_1.initCustomEvent(type, bubbles, cancelable, {});
        }
        try {
            lang_1.deepAssign(event_1, initProps);
        }
        catch (e) {
            /* swallowing assignment errors when trying to overwrite native event properties */
        }
        dispatchEvent(dispatchTarget, event_1);
    }
}
exports.default = sendEvent;

/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!./node_modules/css-loader/index.js?{\"modules\":true,\"sourceMap\":true,\"importLoaders\":1,\"localIdentName\":\"[hash:base64:8]\"}!./node_modules/postcss-loader/lib/index.js?{\"ident\":\"postcss\",\"plugins\":[null,{\"version\":\"6.0.17\",\"plugins\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"postcssPlugin\":\"postcss-cssnext\",\"postcssVersion\":\"6.0.17\"}]}!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./src/menu-item/menuItem.m.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, ".sUmUi4Sh {\n\theight: 100%;\n\tdisplay: inline-block;\n}\n\n._2Mk6Rdqa {\n\tcolor: #fff;\n\ttext-decoration: none;\n\tmargin: 0 6.4px;\n\tposition: relative;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-pack: center;\n\t    -ms-flex-pack: center;\n\t        justify-content: center;\n\theight: 48px;\n\tcursor: pointer;\n}\n\n._2Mk6Rdqa::after {\n\tdisplay: block;\n\tcontent: \"\";\n\tbackground: #fff;\n\theight: 2px;\n\tposition: absolute;\n\twidth: 100%;\n\tbottom: 0;\n\t-webkit-transition: -webkit-transform .3s ease-out;\n\ttransition: -webkit-transform .3s ease-out;\n\ttransition: transform .3s ease-out;\n\ttransition: transform .3s ease-out, -webkit-transform .3s ease-out;\n\t-webkit-transform: translateY(3px);\n\t        transform: translateY(3px);\n}\n\n._1-f3ItOh::after {\n\t-webkit-transform: translateY(0);\n\t        transform: translateY(0);\n}\n", "", {"version":3,"sources":["C:/Users/IEUser/cli-build-widget/test-app/src/menu-item/menuItem.m.css"],"names":[],"mappings":"AAAA;CACC,aAAa;CACb,sBAAsB;CACtB;;AAED;CACC,YAAY;CACZ,sBAAsB;CACtB,gBAAgB;CAChB,mBAAmB;CACnB,qBAAqB;CACrB,qBAAqB;CACrB,cAAc;CACd,6BAA6B;CAC7B,8BAA8B;KAC1B,2BAA2B;SACvB,uBAAuB;CAC/B,yBAAyB;KACrB,sBAAsB;SAClB,wBAAwB;CAChC,aAAa;CACb,gBAAgB;CAChB;;AAED;CACC,eAAe;CACf,YAAY;CACZ,iBAAiB;CACjB,YAAY;CACZ,mBAAmB;CACnB,YAAY;CACZ,UAAU;CACV,mDAAmD;CACnD,2CAA2C;CAC3C,mCAAmC;CACnC,mEAAmE;CACnE,mCAAmC;SAC3B,2BAA2B;CACnC;;AAED;CACC,iCAAiC;SACzB,yBAAyB;CACjC","file":"menuItem.m.css","sourcesContent":[".root {\n\theight: 100%;\n\tdisplay: inline-block;\n}\n\n.item {\n\tcolor: #fff;\n\ttext-decoration: none;\n\tmargin: 0 6.4px;\n\tposition: relative;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-orient: vertical;\n\t-webkit-box-direction: normal;\n\t    -ms-flex-direction: column;\n\t        flex-direction: column;\n\t-webkit-box-pack: center;\n\t    -ms-flex-pack: center;\n\t        justify-content: center;\n\theight: 48px;\n\tcursor: pointer;\n}\n\n.item::after {\n\tdisplay: block;\n\tcontent: \"\";\n\tbackground: #fff;\n\theight: 2px;\n\tposition: absolute;\n\twidth: 100%;\n\tbottom: 0;\n\t-webkit-transition: -webkit-transform .3s ease-out;\n\ttransition: -webkit-transform .3s ease-out;\n\ttransition: transform .3s ease-out;\n\ttransition: transform .3s ease-out, -webkit-transform .3s ease-out;\n\t-webkit-transform: translateY(3px);\n\t        transform: translateY(3px);\n}\n\n.selected::after {\n\t-webkit-transform: translateY(0);\n\t        transform: translateY(0);\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {" _key": "menuItem",
	"root": "sUmUi4Sh",
	"item": "_2Mk6Rdqa",
	"selected": "_1-f3ItOh"
};

/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!./node_modules/css-loader/index.js?{\"modules\":true,\"sourceMap\":true,\"importLoaders\":1,\"localIdentName\":\"[hash:base64:8]\"}!./node_modules/postcss-loader/lib/index.js?{\"ident\":\"postcss\",\"plugins\":[null,{\"version\":\"6.0.17\",\"plugins\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"postcssPlugin\":\"postcss-cssnext\",\"postcssVersion\":\"6.0.17\"}]}!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./src/menu/menu.m.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "._3bA6jdSn {\n\twidth: 100%;\n\ttop: 0;\n\theight: 48px;\n\tz-index: 100;\n\tbackground-color: #1d1f20;\n}\n\n._1eoGfqku {\n\theight: 100%;\n\tmargin: 0 auto;\n}\n", "", {"version":3,"sources":["C:/Users/IEUser/cli-build-widget/test-app/src/menu/menu.m.css"],"names":[],"mappings":"AAAA;CACC,YAAY;CACZ,OAAO;CACP,aAAa;CACb,aAAa;CACb,0BAA0B;CAC1B;;AAED;CACC,aAAa;CACb,eAAe;CACf","file":"menu.m.css","sourcesContent":[".root {\n\twidth: 100%;\n\ttop: 0;\n\theight: 48px;\n\tz-index: 100;\n\tbackground-color: #1d1f20;\n}\n\n.menuContainer {\n\theight: 100%;\n\tmargin: 0 auto;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {" _key": "menu",
	"root": "_3bA6jdSn",
	"menuContainer": "_1eoGfqku"
};

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Injector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Injector = /** @class */ (function (_super) {
    tslib_1.__extends(Injector, _super);
    function Injector(payload) {
        var _this = _super.call(this) || this;
        _this._payload = payload;
        return _this;
    }
    Injector.prototype.get = function () {
        return this._payload;
    };
    Injector.prototype.set = function (payload) {
        this._payload = payload;
        this.emit({ type: 'invalidate' });
    };
    return Injector;
}(Evented_1.Evented));
exports.Injector = Injector;
exports.default = Injector;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/NodeHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
/**
 * Enum to identify the type of event.
 * Listening to 'Projector' will notify when projector is created or updated
 * Listening to 'Widget' will notify when widget root is created or updated
 */
var NodeEventType;
(function (NodeEventType) {
    NodeEventType["Projector"] = "Projector";
    NodeEventType["Widget"] = "Widget";
})(NodeEventType = exports.NodeEventType || (exports.NodeEventType = {}));
var NodeHandler = /** @class */ (function (_super) {
    tslib_1.__extends(NodeHandler, _super);
    function NodeHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._nodeMap = new Map_1.default();
        return _this;
    }
    NodeHandler.prototype.get = function (key) {
        return this._nodeMap.get(key);
    };
    NodeHandler.prototype.has = function (key) {
        return this._nodeMap.has(key);
    };
    NodeHandler.prototype.add = function (element, key) {
        this._nodeMap.set(key, element);
        this.emit({ type: key });
    };
    NodeHandler.prototype.addRoot = function () {
        this.emit({ type: NodeEventType.Widget });
    };
    NodeHandler.prototype.addProjector = function () {
        this.emit({ type: NodeEventType.Projector });
    };
    NodeHandler.prototype.clear = function () {
        this._nodeMap.clear();
    };
    return NodeHandler;
}(Evented_1.Evented));
exports.NodeHandler = NodeHandler;
exports.default = NodeHandler;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Registry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Promise_1 = __webpack_require__("./node_modules/@dojo/shim/Promise.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
/**
 * Widget base symbol type
 */
exports.WIDGET_BASE_TYPE = Symbol_1.default('Widget Base');
/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
function isWidgetBaseConstructor(item) {
    return Boolean(item && item._type === exports.WIDGET_BASE_TYPE);
}
exports.isWidgetBaseConstructor = isWidgetBaseConstructor;
function isWidgetConstructorDefaultExport(item) {
    return Boolean(item &&
        item.hasOwnProperty('__esModule') &&
        item.hasOwnProperty('default') &&
        isWidgetBaseConstructor(item.default));
}
exports.isWidgetConstructorDefaultExport = isWidgetConstructorDefaultExport;
/**
 * The Registry implementation
 */
var Registry = /** @class */ (function (_super) {
    tslib_1.__extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Emit loaded event for registry label
     */
    Registry.prototype.emitLoadedEvent = function (widgetLabel, item) {
        this.emit({
            type: widgetLabel,
            action: 'loaded',
            item: item
        });
    };
    Registry.prototype.define = function (label, item) {
        var _this = this;
        if (this._widgetRegistry === undefined) {
            this._widgetRegistry = new Map_1.default();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error("widget has already been registered for '" + label.toString() + "'");
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof Promise_1.default) {
            item.then(function (widgetCtor) {
                _this._widgetRegistry.set(label, widgetCtor);
                _this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, function (error) {
                throw error;
            });
        }
        else if (isWidgetBaseConstructor(item)) {
            this.emitLoadedEvent(label, item);
        }
    };
    Registry.prototype.defineInjector = function (label, item) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new Map_1.default();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error("injector has already been registered for '" + label.toString() + "'");
        }
        this._injectorRegistry.set(label, item);
        this.emitLoadedEvent(label, item);
    };
    Registry.prototype.get = function (label) {
        var _this = this;
        if (!this.has(label)) {
            return null;
        }
        var item = this._widgetRegistry.get(label);
        if (isWidgetBaseConstructor(item)) {
            return item;
        }
        if (item instanceof Promise_1.default) {
            return null;
        }
        var promise = item();
        this._widgetRegistry.set(label, promise);
        promise.then(function (widgetCtor) {
            if (isWidgetConstructorDefaultExport(widgetCtor)) {
                widgetCtor = widgetCtor.default;
            }
            _this._widgetRegistry.set(label, widgetCtor);
            _this.emitLoadedEvent(label, widgetCtor);
            return widgetCtor;
        }, function (error) {
            throw error;
        });
        return null;
    };
    Registry.prototype.getInjector = function (label) {
        if (!this.hasInjector(label)) {
            return null;
        }
        return this._injectorRegistry.get(label);
    };
    Registry.prototype.has = function (label) {
        return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
    };
    Registry.prototype.hasInjector = function (label) {
        return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
    };
    return Registry;
}(Evented_1.Evented));
exports.Registry = Registry;
exports.default = Registry;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/RegistryHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var RegistryHandler = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryHandler, _super);
    function RegistryHandler() {
        var _this = _super.call(this) || this;
        _this._registry = new Registry_1.Registry();
        _this._registryWidgetLabelMap = new Map_1.Map();
        _this._registryInjectorLabelMap = new Map_1.Map();
        _this.own(_this._registry);
        var destroy = function () {
            if (_this.baseRegistry) {
                _this._registryWidgetLabelMap.delete(_this.baseRegistry);
                _this._registryInjectorLabelMap.delete(_this.baseRegistry);
                _this.baseRegistry = undefined;
            }
        };
        _this.own({ destroy: destroy });
        return _this;
    }
    Object.defineProperty(RegistryHandler.prototype, "base", {
        set: function (baseRegistry) {
            if (this.baseRegistry) {
                this._registryWidgetLabelMap.delete(this.baseRegistry);
                this._registryInjectorLabelMap.delete(this.baseRegistry);
            }
            this.baseRegistry = baseRegistry;
        },
        enumerable: true,
        configurable: true
    });
    RegistryHandler.prototype.define = function (label, widget) {
        this._registry.define(label, widget);
    };
    RegistryHandler.prototype.defineInjector = function (label, injector) {
        this._registry.defineInjector(label, injector);
    };
    RegistryHandler.prototype.has = function (label) {
        return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
    };
    RegistryHandler.prototype.hasInjector = function (label) {
        return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
    };
    RegistryHandler.prototype.get = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
    };
    RegistryHandler.prototype.getInjector = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
    };
    RegistryHandler.prototype._get = function (label, globalPrecedence, getFunctionName, labelMap) {
        var _this = this;
        var registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            if (!registry) {
                continue;
            }
            var item = registry[getFunctionName](label);
            var registeredLabels = labelMap.get(registry) || [];
            if (item) {
                return item;
            }
            else if (registeredLabels.indexOf(label) === -1) {
                var handle = registry.on(label, function (event) {
                    if (event.action === 'loaded' &&
                        _this[getFunctionName](label, globalPrecedence) === event.item) {
                        _this.emit({ type: 'invalidate' });
                    }
                });
                this.own(handle);
                labelMap.set(registry, tslib_1.__spread(registeredLabels, [label]));
            }
        }
        return null;
    };
    return RegistryHandler;
}(Evented_1.Evented));
exports.RegistryHandler = RegistryHandler;
exports.default = RegistryHandler;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/WidgetBase.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var diff_1 = __webpack_require__("./node_modules/@dojo/widget-core/diff.js");
var RegistryHandler_1 = __webpack_require__("./node_modules/@dojo/widget-core/RegistryHandler.js");
var NodeHandler_1 = __webpack_require__("./node_modules/@dojo/widget-core/NodeHandler.js");
var vdom_1 = __webpack_require__("./node_modules/@dojo/widget-core/vdom.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var decoratorMap = new Map_1.default();
var boundAuto = diff_1.auto.bind(null);
/**
 * Main widget base for all widgets to extend
 */
var WidgetBase = /** @class */ (function () {
    /**
     * @constructor
     */
    function WidgetBase() {
        var _this = this;
        /**
         * Indicates if it is the initial set properties cycle
         */
        this._initialProperties = true;
        /**
         * Array of property keys considered changed from the previous set properties
         */
        this._changedPropertyKeys = [];
        this._nodeHandler = new NodeHandler_1.default();
        this._children = [];
        this._decoratorCache = new Map_1.default();
        this._properties = {};
        this._boundRenderFunc = this.render.bind(this);
        this._boundInvalidate = this.invalidate.bind(this);
        vdom_1.widgetInstanceMap.set(this, {
            dirty: true,
            onAttach: function () {
                _this.onAttach();
            },
            onDetach: function () {
                _this.onDetach();
                _this._destroy();
            },
            nodeHandler: this._nodeHandler,
            registry: function () {
                return _this.registry;
            },
            coreProperties: {},
            rendering: false,
            inputProperties: {}
        });
        this._runAfterConstructors();
    }
    WidgetBase.prototype.meta = function (MetaType) {
        if (this._metaMap === undefined) {
            this._metaMap = new Map_1.default();
        }
        var cached = this._metaMap.get(MetaType);
        if (!cached) {
            cached = new MetaType({
                invalidate: this._boundInvalidate,
                nodeHandler: this._nodeHandler,
                bind: this
            });
            this._metaMap.set(MetaType, cached);
        }
        return cached;
    };
    WidgetBase.prototype.onAttach = function () {
        // Do nothing by default.
    };
    WidgetBase.prototype.onDetach = function () {
        // Do nothing by default.
    };
    Object.defineProperty(WidgetBase.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetBase.prototype, "changedPropertyKeys", {
        get: function () {
            return tslib_1.__spread(this._changedPropertyKeys);
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype.__setCoreProperties__ = function (coreProperties) {
        var baseRegistry = coreProperties.baseRegistry;
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        if (instanceData.coreProperties.baseRegistry !== baseRegistry) {
            if (this._registry === undefined) {
                this._registry = new RegistryHandler_1.default();
                this._registry.on('invalidate', this._boundInvalidate);
            }
            this._registry.base = baseRegistry;
            this.invalidate();
        }
        instanceData.coreProperties = coreProperties;
    };
    WidgetBase.prototype.__setProperties__ = function (originalProperties) {
        var _this = this;
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        instanceData.inputProperties = originalProperties;
        var properties = this._runBeforeProperties(originalProperties);
        var registeredDiffPropertyNames = this.getDecorator('registeredDiffProperty');
        var changedPropertyKeys = [];
        var propertyNames = Object.keys(properties);
        if (this._initialProperties === false || registeredDiffPropertyNames.length !== 0) {
            var allProperties = tslib_1.__spread(propertyNames, Object.keys(this._properties));
            var checkedProperties = [];
            var diffPropertyResults = {};
            var runReactions = false;
            for (var i = 0; i < allProperties.length; i++) {
                var propertyName = allProperties[i];
                if (checkedProperties.indexOf(propertyName) !== -1) {
                    continue;
                }
                checkedProperties.push(propertyName);
                var previousProperty = this._properties[propertyName];
                var newProperty = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                if (registeredDiffPropertyNames.indexOf(propertyName) !== -1) {
                    runReactions = true;
                    var diffFunctions = this.getDecorator("diffProperty:" + propertyName);
                    for (var i_1 = 0; i_1 < diffFunctions.length; i_1++) {
                        var result = diffFunctions[i_1](previousProperty, newProperty);
                        if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                            changedPropertyKeys.push(propertyName);
                        }
                        if (propertyName in properties) {
                            diffPropertyResults[propertyName] = result.value;
                        }
                    }
                }
                else {
                    var result = boundAuto(previousProperty, newProperty);
                    if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                        changedPropertyKeys.push(propertyName);
                    }
                    if (propertyName in properties) {
                        diffPropertyResults[propertyName] = result.value;
                    }
                }
            }
            if (runReactions) {
                this._mapDiffPropertyReactions(properties, changedPropertyKeys).forEach(function (args, reaction) {
                    if (args.changed) {
                        reaction.call(_this, args.previousProperties, args.newProperties);
                    }
                });
            }
            this._properties = diffPropertyResults;
            this._changedPropertyKeys = changedPropertyKeys;
        }
        else {
            this._initialProperties = false;
            for (var i = 0; i < propertyNames.length; i++) {
                var propertyName = propertyNames[i];
                if (typeof properties[propertyName] === 'function') {
                    properties[propertyName] = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                }
                else {
                    changedPropertyKeys.push(propertyName);
                }
            }
            this._changedPropertyKeys = changedPropertyKeys;
            this._properties = tslib_1.__assign({}, properties);
        }
        if (this._changedPropertyKeys.length > 0) {
            this.invalidate();
        }
    };
    Object.defineProperty(WidgetBase.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype.__setChildren__ = function (children) {
        if (this._children.length > 0 || children.length > 0) {
            this._children = children;
            this.invalidate();
        }
    };
    WidgetBase.prototype.__render__ = function () {
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        instanceData.dirty = false;
        var render = this._runBeforeRenders();
        var dNode = render();
        dNode = this.runAfterRenders(dNode);
        this._nodeHandler.clear();
        return dNode;
    };
    WidgetBase.prototype.invalidate = function () {
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        if (instanceData.invalidate) {
            instanceData.invalidate();
        }
    };
    WidgetBase.prototype.render = function () {
        return d_1.v('div', {}, this.children);
    };
    /**
     * Function to add decorators to WidgetBase
     *
     * @param decoratorKey The key of the decorator
     * @param value The value of the decorator
     */
    WidgetBase.prototype.addDecorator = function (decoratorKey, value) {
        value = Array.isArray(value) ? value : [value];
        if (this.hasOwnProperty('constructor')) {
            var decoratorList = decoratorMap.get(this.constructor);
            if (!decoratorList) {
                decoratorList = new Map_1.default();
                decoratorMap.set(this.constructor, decoratorList);
            }
            var specificDecoratorList = decoratorList.get(decoratorKey);
            if (!specificDecoratorList) {
                specificDecoratorList = [];
                decoratorList.set(decoratorKey, specificDecoratorList);
            }
            specificDecoratorList.push.apply(specificDecoratorList, tslib_1.__spread(value));
        }
        else {
            var decorators = this.getDecorator(decoratorKey);
            this._decoratorCache.set(decoratorKey, tslib_1.__spread(decorators, value));
        }
    };
    /**
     * Function to build the list of decorators from the global decorator map.
     *
     * @param decoratorKey  The key of the decorator
     * @return An array of decorator values
     * @private
     */
    WidgetBase.prototype._buildDecoratorList = function (decoratorKey) {
        var allDecorators = [];
        var constructor = this.constructor;
        while (constructor) {
            var instanceMap = decoratorMap.get(constructor);
            if (instanceMap) {
                var decorators = instanceMap.get(decoratorKey);
                if (decorators) {
                    allDecorators.unshift.apply(allDecorators, tslib_1.__spread(decorators));
                }
            }
            constructor = Object.getPrototypeOf(constructor);
        }
        return allDecorators;
    };
    /**
     * Destroys private resources for WidgetBase
     */
    WidgetBase.prototype._destroy = function () {
        if (this._registry) {
            this._registry.destroy();
        }
        if (this._metaMap !== undefined) {
            this._metaMap.forEach(function (meta) {
                meta.destroy();
            });
        }
    };
    /**
     * Function to retrieve decorator values
     *
     * @param decoratorKey The key of the decorator
     * @returns An array of decorator values
     */
    WidgetBase.prototype.getDecorator = function (decoratorKey) {
        var allDecorators = this._decoratorCache.get(decoratorKey);
        if (allDecorators !== undefined) {
            return allDecorators;
        }
        allDecorators = this._buildDecoratorList(decoratorKey);
        this._decoratorCache.set(decoratorKey, allDecorators);
        return allDecorators;
    };
    WidgetBase.prototype._mapDiffPropertyReactions = function (newProperties, changedPropertyKeys) {
        var _this = this;
        var reactionFunctions = this.getDecorator('diffReaction');
        return reactionFunctions.reduce(function (reactionPropertyMap, _a) {
            var reaction = _a.reaction, propertyName = _a.propertyName;
            var reactionArguments = reactionPropertyMap.get(reaction);
            if (reactionArguments === undefined) {
                reactionArguments = {
                    previousProperties: {},
                    newProperties: {},
                    changed: false
                };
            }
            reactionArguments.previousProperties[propertyName] = _this._properties[propertyName];
            reactionArguments.newProperties[propertyName] = newProperties[propertyName];
            if (changedPropertyKeys.indexOf(propertyName) !== -1) {
                reactionArguments.changed = true;
            }
            reactionPropertyMap.set(reaction, reactionArguments);
            return reactionPropertyMap;
        }, new Map_1.default());
    };
    /**
     * Binds unbound property functions to the specified `bind` property
     *
     * @param properties properties to check for functions
     */
    WidgetBase.prototype._bindFunctionProperty = function (property, bind) {
        if (typeof property === 'function' && Registry_1.isWidgetBaseConstructor(property) === false) {
            if (this._bindFunctionPropertyMap === undefined) {
                this._bindFunctionPropertyMap = new WeakMap_1.default();
            }
            var bindInfo = this._bindFunctionPropertyMap.get(property) || {};
            var boundFunc = bindInfo.boundFunc, scope = bindInfo.scope;
            if (boundFunc === undefined || scope !== bind) {
                boundFunc = property.bind(bind);
                this._bindFunctionPropertyMap.set(property, { boundFunc: boundFunc, scope: bind });
            }
            return boundFunc;
        }
        return property;
    };
    Object.defineProperty(WidgetBase.prototype, "registry", {
        get: function () {
            if (this._registry === undefined) {
                this._registry = new RegistryHandler_1.default();
                this._registry.on('invalidate', this._boundInvalidate);
            }
            return this._registry;
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype._runBeforeProperties = function (properties) {
        var _this = this;
        var beforeProperties = this.getDecorator('beforeProperties');
        if (beforeProperties.length > 0) {
            return beforeProperties.reduce(function (properties, beforePropertiesFunction) {
                return tslib_1.__assign({}, properties, beforePropertiesFunction.call(_this, properties));
            }, tslib_1.__assign({}, properties));
        }
        return properties;
    };
    /**
     * Run all registered before renders and return the updated render method
     */
    WidgetBase.prototype._runBeforeRenders = function () {
        var _this = this;
        var beforeRenders = this.getDecorator('beforeRender');
        if (beforeRenders.length > 0) {
            return beforeRenders.reduce(function (render, beforeRenderFunction) {
                var updatedRender = beforeRenderFunction.call(_this, render, _this._properties, _this._children);
                if (!updatedRender) {
                    console.warn('Render function not returned from beforeRender, using previous render');
                    return render;
                }
                return updatedRender;
            }, this._boundRenderFunc);
        }
        return this._boundRenderFunc;
    };
    /**
     * Run all registered after renders and return the decorated DNodes
     *
     * @param dNode The DNodes to run through the after renders
     */
    WidgetBase.prototype.runAfterRenders = function (dNode) {
        var _this = this;
        var afterRenders = this.getDecorator('afterRender');
        if (afterRenders.length > 0) {
            return afterRenders.reduce(function (dNode, afterRenderFunction) {
                return afterRenderFunction.call(_this, dNode);
            }, dNode);
        }
        if (this._metaMap !== undefined) {
            this._metaMap.forEach(function (meta) {
                meta.afterRender();
            });
        }
        return dNode;
    };
    WidgetBase.prototype._runAfterConstructors = function () {
        var _this = this;
        var afterConstructors = this.getDecorator('afterConstructor');
        if (afterConstructors.length > 0) {
            afterConstructors.forEach(function (afterConstructor) { return afterConstructor.call(_this); });
        }
    };
    /**
     * static identifier
     */
    WidgetBase._type = Registry_1.WIDGET_BASE_TYPE;
    return WidgetBase;
}());
exports.WidgetBase = WidgetBase;
exports.default = WidgetBase;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/animations/cssTransitions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var browserSpecificTransitionEndEventName = '';
var browserSpecificAnimationEndEventName = '';
function determineBrowserStyleNames(element) {
    if ('WebkitTransition' in element.style) {
        browserSpecificTransitionEndEventName = 'webkitTransitionEnd';
        browserSpecificAnimationEndEventName = 'webkitAnimationEnd';
    }
    else if ('transition' in element.style || 'MozTransition' in element.style) {
        browserSpecificTransitionEndEventName = 'transitionend';
        browserSpecificAnimationEndEventName = 'animationend';
    }
    else {
        throw new Error('Your browser is not supported');
    }
}
function initialize(element) {
    if (browserSpecificAnimationEndEventName === '') {
        determineBrowserStyleNames(element);
    }
}
function runAndCleanUp(element, startAnimation, finishAnimation) {
    initialize(element);
    var finished = false;
    var transitionEnd = function () {
        if (!finished) {
            finished = true;
            element.removeEventListener(browserSpecificTransitionEndEventName, transitionEnd);
            element.removeEventListener(browserSpecificAnimationEndEventName, transitionEnd);
            finishAnimation();
        }
    };
    startAnimation();
    element.addEventListener(browserSpecificAnimationEndEventName, transitionEnd);
    element.addEventListener(browserSpecificTransitionEndEventName, transitionEnd);
}
function exit(node, properties, exitAnimation, removeNode) {
    var activeClass = properties.exitAnimationActive || exitAnimation + "-active";
    runAndCleanUp(node, function () {
        node.classList.add(exitAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, function () {
        removeNode();
    });
}
function enter(node, properties, enterAnimation) {
    var activeClass = properties.enterAnimationActive || enterAnimation + "-active";
    runAndCleanUp(node, function () {
        node.classList.add(enterAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, function () {
        node.classList.remove(enterAnimation);
        node.classList.remove(activeClass);
    });
}
exports.default = {
    enter: enter,
    exit: exit
};

/***/ }),

/***/ "./node_modules/@dojo/widget-core/d.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
/**
 * The symbol identifier for a WNode type
 */
exports.WNODE = Symbol_1.default('Identifier for a WNode.');
/**
 * The symbol identifier for a VNode type
 */
exports.VNODE = Symbol_1.default('Identifier for a VNode.');
/**
 * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
 */
function isWNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === exports.WNODE);
}
exports.isWNode = isWNode;
/**
 * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
 */
function isVNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === exports.VNODE);
}
exports.isVNode = isVNode;
function decorate(dNodes, modifier, predicate) {
    var nodes = Array.isArray(dNodes) ? tslib_1.__spread(dNodes) : [dNodes];
    while (nodes.length) {
        var node = nodes.pop();
        if (node) {
            if (!predicate || predicate(node)) {
                modifier(node);
            }
            if ((isWNode(node) || isVNode(node)) && node.children) {
                nodes = tslib_1.__spread(nodes, node.children);
            }
        }
    }
    return dNodes;
}
exports.decorate = decorate;
/**
 * Wrapper function for calls to create a widget.
 */
function w(widgetConstructor, properties, children) {
    if (children === void 0) { children = []; }
    return {
        children: children,
        widgetConstructor: widgetConstructor,
        properties: properties,
        type: exports.WNODE
    };
}
exports.w = w;
function v(tag, propertiesOrChildren, children) {
    if (propertiesOrChildren === void 0) { propertiesOrChildren = {}; }
    if (children === void 0) { children = undefined; }
    var properties = propertiesOrChildren;
    var deferredPropertiesCallback;
    if (Array.isArray(propertiesOrChildren)) {
        children = propertiesOrChildren;
        properties = {};
    }
    if (typeof properties === 'function') {
        deferredPropertiesCallback = properties;
        properties = {};
    }
    return {
        tag: tag,
        deferredPropertiesCallback: deferredPropertiesCallback,
        children: children,
        properties: properties,
        type: exports.VNODE
    };
}
exports.v = v;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/afterRender.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
function afterRender(method) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
exports.afterRender = afterRender;
exports.default = afterRender;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/beforeProperties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
function beforeProperties(method) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
exports.beforeProperties = beforeProperties;
exports.default = beforeProperties;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/customElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
function customElement(_a) {
    var tag = _a.tag, properties = _a.properties, attributes = _a.attributes, events = _a.events, initialization = _a.initialization;
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            widgetConstructor: target,
            attributes: (attributes || []).map(function (attributeName) { return ({ attributeName: attributeName }); }),
            properties: (properties || []).map(function (propertyName) { return ({ propertyName: propertyName }); }),
            events: (events || []).map(function (propertyName) { return ({
                propertyName: propertyName,
                eventName: propertyName.replace('on', '').toLowerCase()
            }); }),
            initialization: initialization
        };
    };
}
exports.customElement = customElement;
exports.default = customElement;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/diffProperty.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
function diffProperty(propertyName, diffFunction, reactionFunction) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator("diffProperty:" + propertyName, diffFunction.bind(null));
        target.addDecorator('registeredDiffProperty', propertyName);
        if (reactionFunction || propertyKey) {
            target.addDecorator('diffReaction', {
                propertyName: propertyName,
                reaction: propertyKey ? target[propertyKey] : reactionFunction
            });
        }
    });
}
exports.diffProperty = diffProperty;
exports.default = diffProperty;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/handleDecorator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic decorator handler to take care of whether or not the decorator was called at the class level
 * or the method level.
 *
 * @param handler
 */
function handleDecorator(handler) {
    return function (target, propertyKey, descriptor) {
        if (typeof target === 'function') {
            handler(target.prototype, undefined);
        }
        else {
            handler(target, propertyKey);
        }
    };
}
exports.handleDecorator = handleDecorator;
exports.default = handleDecorator;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/inject.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
var beforeProperties_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/beforeProperties.js");
/**
 * Map of instances against registered injectors.
 */
var registeredInjectorsMap = new WeakMap_1.default();
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
function inject(_a) {
    var name = _a.name, getProperties = _a.getProperties;
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        beforeProperties_1.beforeProperties(function (properties) {
            var _this = this;
            var injector = this.registry.getInjector(name);
            if (injector) {
                var registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injector) === -1) {
                    injector.on('invalidate', function () {
                        _this.invalidate();
                    });
                    registeredInjectors.push(injector);
                }
                return getProperties(injector.get(), properties);
            }
        })(target);
    });
}
exports.inject = inject;
exports.default = inject;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/diff.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}
function always(previousProperty, newProperty) {
    return {
        changed: true,
        value: newProperty
    };
}
exports.always = always;
function ignore(previousProperty, newProperty) {
    return {
        changed: false,
        value: newProperty
    };
}
exports.ignore = ignore;
function reference(previousProperty, newProperty) {
    return {
        changed: previousProperty !== newProperty,
        value: newProperty
    };
}
exports.reference = reference;
function shallow(previousProperty, newProperty) {
    var changed = false;
    var validOldProperty = previousProperty && isObjectOrArray(previousProperty);
    var validNewProperty = newProperty && isObjectOrArray(newProperty);
    if (!validOldProperty || !validNewProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    var previousKeys = Object.keys(previousProperty);
    var newKeys = Object.keys(newProperty);
    if (previousKeys.length !== newKeys.length) {
        changed = true;
    }
    else {
        changed = newKeys.some(function (key) {
            return newProperty[key] !== previousProperty[key];
        });
    }
    return {
        changed: changed,
        value: newProperty
    };
}
exports.shallow = shallow;
function auto(previousProperty, newProperty) {
    var result;
    if (typeof newProperty === 'function') {
        if (newProperty._type === Registry_1.WIDGET_BASE_TYPE) {
            result = reference(previousProperty, newProperty);
        }
        else {
            result = ignore(previousProperty, newProperty);
        }
    }
    else if (isObjectOrArray(newProperty)) {
        result = shallow(previousProperty, newProperty);
    }
    else {
        result = reference(previousProperty, newProperty);
    }
    return result;
}
exports.auto = auto;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Projector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var lang_2 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var cssTransitions_1 = __webpack_require__("./node_modules/@dojo/widget-core/animations/cssTransitions.js");
var afterRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/afterRender.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var vdom_1 = __webpack_require__("./node_modules/@dojo/widget-core/vdom.js");
__webpack_require__("./node_modules/pepjs/dist/pep.js");
/**
 * Represents the attach state of the projector
 */
var ProjectorAttachState;
(function (ProjectorAttachState) {
    ProjectorAttachState[ProjectorAttachState["Attached"] = 1] = "Attached";
    ProjectorAttachState[ProjectorAttachState["Detached"] = 2] = "Detached";
})(ProjectorAttachState = exports.ProjectorAttachState || (exports.ProjectorAttachState = {}));
/**
 * Attach type for the projector
 */
var AttachType;
(function (AttachType) {
    AttachType[AttachType["Append"] = 1] = "Append";
    AttachType[AttachType["Merge"] = 2] = "Merge";
})(AttachType = exports.AttachType || (exports.AttachType = {}));
function ProjectorMixin(Base) {
    var Projector = /** @class */ (function (_super) {
        tslib_1.__extends(Projector, _super);
        function Projector() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, tslib_1.__spread(args)) || this;
            _this._async = true;
            _this._projectorProperties = {};
            _this._handles = [];
            _this._projectionOptions = {
                transitions: cssTransitions_1.default
            };
            _this.root = document.body;
            _this.projectorState = ProjectorAttachState.Detached;
            return _this;
        }
        Projector.prototype.append = function (root) {
            var options = {
                type: AttachType.Append,
                root: root
            };
            return this._attach(options);
        };
        Projector.prototype.merge = function (root) {
            var options = {
                type: AttachType.Merge,
                root: root
            };
            return this._attach(options);
        };
        Object.defineProperty(Projector.prototype, "root", {
            get: function () {
                return this._root;
            },
            set: function (root) {
                if (this.projectorState === ProjectorAttachState.Attached) {
                    throw new Error('Projector already attached, cannot change root element');
                }
                this._root = root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projector.prototype, "async", {
            get: function () {
                return this._async;
            },
            set: function (async) {
                if (this.projectorState === ProjectorAttachState.Attached) {
                    throw new Error('Projector already attached, cannot change async mode');
                }
                this._async = async;
            },
            enumerable: true,
            configurable: true
        });
        Projector.prototype.sandbox = function (doc) {
            var _this = this;
            if (doc === void 0) { doc = document; }
            if (this.projectorState === ProjectorAttachState.Attached) {
                throw new Error('Projector already attached, cannot create sandbox');
            }
            this._async = false;
            var previousRoot = this.root;
            /* free up the document fragment for GC */
            this.own(function () {
                _this._root = previousRoot;
            });
            this._attach({
                /* DocumentFragment is not assignable to Element, but provides everything needed to work */
                root: doc.createDocumentFragment(),
                type: AttachType.Append
            });
        };
        Projector.prototype.setChildren = function (children) {
            this.__setChildren__(children);
        };
        Projector.prototype.setProperties = function (properties) {
            this.__setProperties__(properties);
        };
        Projector.prototype.__setProperties__ = function (properties) {
            if (this._projectorProperties && this._projectorProperties.registry !== properties.registry) {
                if (this._projectorProperties.registry) {
                    this._projectorProperties.registry.destroy();
                }
            }
            this._projectorProperties = lang_1.assign({}, properties);
            _super.prototype.__setCoreProperties__.call(this, { bind: this, baseRegistry: properties.registry });
            _super.prototype.__setProperties__.call(this, properties);
        };
        Projector.prototype.toHtml = function () {
            if (this.projectorState !== ProjectorAttachState.Attached || !this._projection) {
                throw new Error('Projector is not attached, cannot return an HTML string of projection.');
            }
            return this._projection.domNode.childNodes[0].outerHTML;
        };
        Projector.prototype.afterRender = function (result) {
            var node = result;
            if (typeof result === 'string' || result === null || result === undefined) {
                node = d_1.v('span', {}, [result]);
            }
            return node;
        };
        Projector.prototype.own = function (handle) {
            this._handles.push(handle);
        };
        Projector.prototype.destroy = function () {
            while (this._handles.length > 0) {
                var handle = this._handles.pop();
                if (handle) {
                    handle();
                }
            }
        };
        Projector.prototype._attach = function (_a) {
            var _this = this;
            var type = _a.type, root = _a.root;
            if (root) {
                this.root = root;
            }
            if (this.projectorState === ProjectorAttachState.Attached) {
                return this._attachHandle;
            }
            this.projectorState = ProjectorAttachState.Attached;
            var handle = function () {
                if (_this.projectorState === ProjectorAttachState.Attached) {
                    _this._projection = undefined;
                    _this.projectorState = ProjectorAttachState.Detached;
                }
            };
            this.own(handle);
            this._attachHandle = lang_2.createHandle(handle);
            this._projectionOptions = tslib_1.__assign({}, this._projectionOptions, { sync: !this._async });
            switch (type) {
                case AttachType.Append:
                    this._projection = vdom_1.dom.append(this.root, this, this._projectionOptions);
                    break;
                case AttachType.Merge:
                    this._projection = vdom_1.dom.merge(this.root, this, this._projectionOptions);
                    break;
            }
            return this._attachHandle;
        };
        tslib_1.__decorate([
            afterRender_1.afterRender(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], Projector.prototype, "afterRender", null);
        return Projector;
    }(Base));
    return Projector;
}
exports.ProjectorMixin = ProjectorMixin;
exports.default = ProjectorMixin;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Themed.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Injector_1 = __webpack_require__("./node_modules/@dojo/widget-core/Injector.js");
var inject_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/inject.js");
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
var diffProperty_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/diffProperty.js");
var diff_1 = __webpack_require__("./node_modules/@dojo/widget-core/diff.js");
var THEME_KEY = ' _key';
exports.INJECTED_THEME_KEY = Symbol('theme');
/**
 * Decorator for base css classes
 */
function theme(theme) {
    return handleDecorator_1.handleDecorator(function (target) {
        target.addDecorator('baseThemeClasses', theme);
    });
}
exports.theme = theme;
/**
 * Creates a reverse lookup for the classes passed in via the `theme` function.
 *
 * @param classes The baseClasses object
 * @requires
 */
function createThemeClassesLookup(classes) {
    return classes.reduce(function (currentClassNames, baseClass) {
        Object.keys(baseClass).forEach(function (key) {
            currentClassNames[baseClass[key]] = key;
        });
        return currentClassNames;
    }, {});
}
/**
 * Convenience function that is given a theme and an optional registry, the theme
 * injector is defined against the registry, returning the theme.
 *
 * @param theme the theme to set
 * @param themeRegistry registry to define the theme injector against. Defaults
 * to the global registry
 *
 * @returns the theme injector used to set the theme
 */
function registerThemeInjector(theme, themeRegistry) {
    var themeInjector = new Injector_1.Injector(theme);
    themeRegistry.defineInjector(exports.INJECTED_THEME_KEY, themeInjector);
    return themeInjector;
}
exports.registerThemeInjector = registerThemeInjector;
/**
 * Function that returns a class decorated with with Themed functionality
 */
function ThemedMixin(Base) {
    var Themed = /** @class */ (function (_super) {
        tslib_1.__extends(Themed, _super);
        function Themed() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * Registered base theme keys
             */
            _this._registeredBaseThemeKeys = [];
            /**
             * Indicates if classes meta data need to be calculated.
             */
            _this._recalculateClasses = true;
            /**
             * Loaded theme
             */
            _this._theme = {};
            return _this;
        }
        Themed.prototype.theme = function (classes) {
            var _this = this;
            if (this._recalculateClasses) {
                this._recalculateThemeClasses();
            }
            if (Array.isArray(classes)) {
                return classes.map(function (className) { return _this._getThemeClass(className); });
            }
            return this._getThemeClass(classes);
        };
        /**
         * Function fired when `theme` or `extraClasses` are changed.
         */
        Themed.prototype.onPropertiesChanged = function () {
            this._recalculateClasses = true;
        };
        Themed.prototype._getThemeClass = function (className) {
            if (className === undefined || className === null) {
                return className;
            }
            var extraClasses = this.properties.extraClasses || {};
            var themeClassName = this._baseThemeClassesReverseLookup[className];
            var resultClassNames = [];
            if (!themeClassName) {
                console.warn("Class name: '" + className + "' not found in theme");
                return null;
            }
            if (extraClasses[themeClassName]) {
                resultClassNames.push(extraClasses[themeClassName]);
            }
            if (this._theme[themeClassName]) {
                resultClassNames.push(this._theme[themeClassName]);
            }
            else {
                resultClassNames.push(this._registeredBaseTheme[themeClassName]);
            }
            return resultClassNames.join(' ');
        };
        Themed.prototype._recalculateThemeClasses = function () {
            var _this = this;
            var _a = this.properties.theme, theme = _a === void 0 ? {} : _a;
            var baseThemes = this.getDecorator('baseThemeClasses');
            if (!this._registeredBaseTheme) {
                this._registeredBaseTheme = baseThemes.reduce(function (finalBaseTheme, baseTheme) {
                    var _a = THEME_KEY, key = baseTheme[_a], classes = tslib_1.__rest(baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
                    _this._registeredBaseThemeKeys.push(key);
                    return tslib_1.__assign({}, finalBaseTheme, classes);
                }, {});
                this._baseThemeClassesReverseLookup = createThemeClassesLookup(baseThemes);
            }
            this._theme = this._registeredBaseThemeKeys.reduce(function (baseTheme, themeKey) {
                return tslib_1.__assign({}, baseTheme, theme[themeKey]);
            }, {});
            this._recalculateClasses = false;
        };
        tslib_1.__decorate([
            diffProperty_1.diffProperty('theme', diff_1.shallow),
            diffProperty_1.diffProperty('extraClasses', diff_1.shallow),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Themed.prototype, "onPropertiesChanged", null);
        Themed = tslib_1.__decorate([
            inject_1.inject({
                name: exports.INJECTED_THEME_KEY,
                getProperties: function (theme, properties) {
                    if (!properties.theme) {
                        return { theme: theme };
                    }
                    return {};
                }
            })
        ], Themed);
        return Themed;
    }(Base));
    return Themed;
}
exports.ThemedMixin = ThemedMixin;
exports.default = ThemedMixin;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/vdom.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var array_1 = __webpack_require__("./node_modules/@dojo/shim/array.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var NAMESPACE_W3 = 'http://www.w3.org/';
var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
var emptyArray = [];
exports.widgetInstanceMap = new WeakMap_1.default();
var instanceMap = new WeakMap_1.default();
var renderQueueMap = new WeakMap_1.default();
function same(dnode1, dnode2) {
    if (d_1.isVNode(dnode1) && d_1.isVNode(dnode2)) {
        if (dnode1.tag !== dnode2.tag) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    else if (d_1.isWNode(dnode1) && d_1.isWNode(dnode2)) {
        if (dnode1.widgetConstructor !== dnode2.widgetConstructor) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    return false;
}
var missingTransition = function () {
    throw new Error('Provide a transitions object to the projectionOptions to do animations');
};
function getProjectionOptions(projectorOptions, projectorInstance) {
    var defaults = {
        namespace: undefined,
        styleApplyer: function (domNode, styleName, value) {
            domNode.style[styleName] = value;
        },
        transitions: {
            enter: missingTransition,
            exit: missingTransition
        },
        deferredRenderCallbacks: [],
        afterRenderCallbacks: [],
        nodeMap: new WeakMap_1.default(),
        depth: 0,
        merge: false,
        renderScheduled: undefined,
        renderQueue: [],
        projectorInstance: projectorInstance
    };
    return tslib_1.__assign({}, defaults, projectorOptions);
}
function checkStyleValue(styleValue) {
    if (typeof styleValue !== 'string') {
        throw new Error('Style values must be strings');
    }
}
function updateEvents(domNode, propName, properties, projectionOptions, previousProperties) {
    var previous = previousProperties || Object.create(null);
    var currentValue = properties[propName];
    var previousValue = previous[propName];
    var eventName = propName.substr(2);
    var eventMap = projectionOptions.nodeMap.get(domNode) || new WeakMap_1.default();
    if (previousValue) {
        var previousEvent = eventMap.get(previousValue);
        domNode.removeEventListener(eventName, previousEvent);
    }
    var callback = currentValue.bind(properties.bind);
    if (eventName === 'input') {
        callback = function (evt) {
            currentValue.call(this, evt);
            evt.target['oninput-value'] = evt.target.value;
        }.bind(properties.bind);
    }
    domNode.addEventListener(eventName, callback);
    eventMap.set(currentValue, callback);
    projectionOptions.nodeMap.set(domNode, eventMap);
}
function addClasses(domNode, classes) {
    if (classes) {
        var classNames = classes.split(' ');
        for (var i = 0; i < classNames.length; i++) {
            domNode.classList.add(classNames[i]);
        }
    }
}
function removeClasses(domNode, classes) {
    if (classes) {
        var classNames = classes.split(' ');
        for (var i = 0; i < classNames.length; i++) {
            domNode.classList.remove(classNames[i]);
        }
    }
}
function focusNode(propValue, previousValue, domNode, projectionOptions) {
    var result;
    if (typeof propValue === 'function') {
        result = propValue();
    }
    else {
        result = propValue && !previousValue;
    }
    if (result === true) {
        projectionOptions.deferredRenderCallbacks.push(function () {
            domNode.focus();
        });
    }
}
function setProperties(domNode, properties, projectionOptions) {
    var propNames = Object.keys(properties);
    var propCount = propNames.length;
    for (var i = 0; i < propCount; i++) {
        var propName = propNames[i];
        var propValue = properties[propName];
        if (propName === 'classes') {
            var currentClasses = Array.isArray(propValue) ? propValue : [propValue];
            if (!domNode.className) {
                domNode.className = currentClasses.join(' ').trim();
            }
            else {
                for (var i_1 = 0; i_1 < currentClasses.length; i_1++) {
                    addClasses(domNode, currentClasses[i_1]);
                }
            }
        }
        else if (propName === 'focus') {
            focusNode(propValue, false, domNode, projectionOptions);
        }
        else if (propName === 'styles') {
            var styleNames = Object.keys(propValue);
            var styleCount = styleNames.length;
            for (var j = 0; j < styleCount; j++) {
                var styleName = styleNames[j];
                var styleValue = propValue[styleName];
                if (styleValue) {
                    checkStyleValue(styleValue);
                    projectionOptions.styleApplyer(domNode, styleName, styleValue);
                }
            }
        }
        else if (propName !== 'key' && propValue !== null && propValue !== undefined) {
            var type = typeof propValue;
            if (type === 'function' && propName.lastIndexOf('on', 0) === 0) {
                updateEvents(domNode, propName, properties, projectionOptions);
            }
            else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
                if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                    domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                }
                else {
                    domNode.setAttribute(propName, propValue);
                }
            }
            else {
                domNode[propName] = propValue;
            }
        }
    }
}
function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions) {
    var eventMap = projectionOptions.nodeMap.get(domNode);
    if (eventMap) {
        Object.keys(previousProperties).forEach(function (propName) {
            if (propName.substr(0, 2) === 'on' && !properties[propName]) {
                var eventCallback = eventMap.get(previousProperties[propName]);
                if (eventCallback) {
                    domNode.removeEventListener(propName.substr(2), eventCallback);
                }
            }
        });
    }
}
function updateProperties(domNode, previousProperties, properties, projectionOptions) {
    var propertiesUpdated = false;
    var propNames = Object.keys(properties);
    var propCount = propNames.length;
    if (propNames.indexOf('classes') === -1 && previousProperties.classes) {
        if (Array.isArray(previousProperties.classes)) {
            for (var i = 0; i < previousProperties.classes.length; i++) {
                removeClasses(domNode, previousProperties.classes[i]);
            }
        }
        else {
            removeClasses(domNode, previousProperties.classes);
        }
    }
    removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions);
    for (var i = 0; i < propCount; i++) {
        var propName = propNames[i];
        var propValue = properties[propName];
        var previousValue = previousProperties[propName];
        if (propName === 'classes') {
            var previousClasses = Array.isArray(previousValue) ? previousValue : [previousValue];
            var currentClasses = Array.isArray(propValue) ? propValue : [propValue];
            if (previousClasses && previousClasses.length > 0) {
                if (!propValue || propValue.length === 0) {
                    for (var i_2 = 0; i_2 < previousClasses.length; i_2++) {
                        removeClasses(domNode, previousClasses[i_2]);
                    }
                }
                else {
                    var newClasses = tslib_1.__spread(currentClasses);
                    for (var i_3 = 0; i_3 < previousClasses.length; i_3++) {
                        var previousClassName = previousClasses[i_3];
                        if (previousClassName) {
                            var classIndex = newClasses.indexOf(previousClassName);
                            if (classIndex === -1) {
                                removeClasses(domNode, previousClassName);
                            }
                            else {
                                newClasses.splice(classIndex, 1);
                            }
                        }
                    }
                    for (var i_4 = 0; i_4 < newClasses.length; i_4++) {
                        addClasses(domNode, newClasses[i_4]);
                    }
                }
            }
            else {
                for (var i_5 = 0; i_5 < currentClasses.length; i_5++) {
                    addClasses(domNode, currentClasses[i_5]);
                }
            }
        }
        else if (propName === 'focus') {
            focusNode(propValue, previousValue, domNode, projectionOptions);
        }
        else if (propName === 'styles') {
            var styleNames = Object.keys(propValue);
            var styleCount = styleNames.length;
            for (var j = 0; j < styleCount; j++) {
                var styleName = styleNames[j];
                var newStyleValue = propValue[styleName];
                var oldStyleValue = previousValue[styleName];
                if (newStyleValue === oldStyleValue) {
                    continue;
                }
                propertiesUpdated = true;
                if (newStyleValue) {
                    checkStyleValue(newStyleValue);
                    projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                }
                else {
                    projectionOptions.styleApplyer(domNode, styleName, '');
                }
            }
        }
        else {
            if (!propValue && typeof previousValue === 'string') {
                propValue = '';
            }
            if (propName === 'value') {
                var domValue = domNode[propName];
                if (domValue !== propValue &&
                    (domNode['oninput-value']
                        ? domValue === domNode['oninput-value']
                        : propValue !== previousValue)) {
                    domNode[propName] = propValue;
                    domNode['oninput-value'] = undefined;
                }
                if (propValue !== previousValue) {
                    propertiesUpdated = true;
                }
            }
            else if (propValue !== previousValue) {
                var type = typeof propValue;
                if (type === 'function' && propName.lastIndexOf('on', 0) === 0) {
                    updateEvents(domNode, propName, properties, projectionOptions, previousProperties);
                }
                else if (type === 'string' && propName !== 'innerHTML') {
                    if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                        domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                    }
                    else if (propName === 'role' && propValue === '') {
                        domNode.removeAttribute(propName);
                    }
                    else {
                        domNode.setAttribute(propName, propValue);
                    }
                }
                else {
                    if (domNode[propName] !== propValue) {
                        // Comparison is here for side-effects in Edge with scrollLeft and scrollTop
                        domNode[propName] = propValue;
                    }
                }
                propertiesUpdated = true;
            }
        }
    }
    return propertiesUpdated;
}
function findIndexOfChild(children, sameAs, start) {
    for (var i = start; i < children.length; i++) {
        if (same(children[i], sameAs)) {
            return i;
        }
    }
    return -1;
}
function toParentVNode(domNode) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        domNode: domNode,
        type: d_1.VNODE
    };
}
exports.toParentVNode = toParentVNode;
function toTextVNode(data) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        text: "" + data,
        domNode: undefined,
        type: d_1.VNODE
    };
}
exports.toTextVNode = toTextVNode;
function toInternalWNode(instance, instanceData) {
    return {
        instance: instance,
        rendered: [],
        coreProperties: instanceData.coreProperties,
        children: instance.children,
        widgetConstructor: instance.constructor,
        properties: instanceData.inputProperties,
        type: d_1.WNODE
    };
}
function filterAndDecorateChildren(children, instance) {
    if (children === undefined) {
        return emptyArray;
    }
    children = Array.isArray(children) ? children : [children];
    for (var i = 0; i < children.length;) {
        var child = children[i];
        if (child === undefined || child === null) {
            children.splice(i, 1);
            continue;
        }
        else if (typeof child === 'string') {
            children[i] = toTextVNode(child);
        }
        else {
            if (d_1.isVNode(child)) {
                if (child.properties.bind === undefined) {
                    child.properties.bind = instance;
                    if (child.children && child.children.length > 0) {
                        filterAndDecorateChildren(child.children, instance);
                    }
                }
            }
            else {
                if (!child.coreProperties) {
                    var instanceData = exports.widgetInstanceMap.get(instance);
                    child.coreProperties = {
                        bind: instance,
                        baseRegistry: instanceData.coreProperties.baseRegistry
                    };
                }
                if (child.children && child.children.length > 0) {
                    filterAndDecorateChildren(child.children, instance);
                }
            }
        }
        i++;
    }
    return children;
}
exports.filterAndDecorateChildren = filterAndDecorateChildren;
function nodeAdded(dnode, transitions) {
    if (d_1.isVNode(dnode) && dnode.properties) {
        var enterAnimation = dnode.properties.enterAnimation;
        if (enterAnimation) {
            if (typeof enterAnimation === 'function') {
                enterAnimation(dnode.domNode, dnode.properties);
            }
            else {
                transitions.enter(dnode.domNode, dnode.properties, enterAnimation);
            }
        }
    }
}
function callOnDetach(dNodes, parentInstance) {
    dNodes = Array.isArray(dNodes) ? dNodes : [dNodes];
    for (var i = 0; i < dNodes.length; i++) {
        var dNode = dNodes[i];
        if (d_1.isWNode(dNode)) {
            if (dNode.rendered) {
                callOnDetach(dNode.rendered, dNode.instance);
            }
            if (dNode.instance) {
                var instanceData = exports.widgetInstanceMap.get(dNode.instance);
                instanceData.onDetach();
            }
        }
        else {
            if (dNode.children) {
                callOnDetach(dNode.children, parentInstance);
            }
        }
    }
}
function nodeToRemove(dnode, transitions, projectionOptions) {
    if (d_1.isWNode(dnode)) {
        var rendered = dnode.rendered || emptyArray;
        for (var i = 0; i < rendered.length; i++) {
            var child = rendered[i];
            if (d_1.isVNode(child)) {
                child.domNode.parentNode.removeChild(child.domNode);
            }
            else {
                nodeToRemove(child, transitions, projectionOptions);
            }
        }
    }
    else {
        var domNode_1 = dnode.domNode;
        var properties = dnode.properties;
        var exitAnimation = properties.exitAnimation;
        if (properties && exitAnimation) {
            domNode_1.style.pointerEvents = 'none';
            var removeDomNode = function () {
                domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
            };
            if (typeof exitAnimation === 'function') {
                exitAnimation(domNode_1, removeDomNode, properties);
                return;
            }
            else {
                transitions.exit(dnode.domNode, properties, exitAnimation, removeDomNode);
                return;
            }
        }
        domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
    }
}
function checkDistinguishable(childNodes, indexToCheck, parentInstance) {
    var childNode = childNodes[indexToCheck];
    if (d_1.isVNode(childNode) && !childNode.tag) {
        return; // Text nodes need not be distinguishable
    }
    var key = childNode.properties.key;
    if (key === undefined || key === null) {
        for (var i = 0; i < childNodes.length; i++) {
            if (i !== indexToCheck) {
                var node = childNodes[i];
                if (same(node, childNode)) {
                    var nodeIdentifier = void 0;
                    var parentName = parentInstance.constructor.name || 'unknown';
                    if (d_1.isWNode(childNode)) {
                        nodeIdentifier = childNode.widgetConstructor.name || 'unknown';
                    }
                    else {
                        nodeIdentifier = childNode.tag;
                    }
                    console.warn("A widget (" + parentName + ") has had a child addded or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (" + nodeIdentifier + ") multiple times as siblings");
                    break;
                }
            }
        }
    }
}
function updateChildren(parentVNode, oldChildren, newChildren, parentInstance, projectionOptions) {
    oldChildren = oldChildren || emptyArray;
    newChildren = newChildren;
    var oldChildrenLength = oldChildren.length;
    var newChildrenLength = newChildren.length;
    var transitions = projectionOptions.transitions;
    projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    var oldIndex = 0;
    var newIndex = 0;
    var i;
    var textUpdated = false;
    var _loop_1 = function () {
        var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
        var newChild = newChildren[newIndex];
        if (d_1.isVNode(newChild) && typeof newChild.deferredPropertiesCallback === 'function') {
            newChild.inserted = d_1.isVNode(oldChild) && oldChild.inserted;
            addDeferredProperties(newChild, projectionOptions);
        }
        if (oldChild !== undefined && same(oldChild, newChild)) {
            textUpdated = updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance) || textUpdated;
            oldIndex++;
        }
        else {
            var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
            if (findOldIndex >= 0) {
                var _loop_2 = function () {
                    var oldChild_1 = oldChildren[i];
                    var indexToCheck = i;
                    projectionOptions.afterRenderCallbacks.push(function () {
                        callOnDetach(oldChild_1, parentInstance);
                        checkDistinguishable(oldChildren, indexToCheck, parentInstance);
                    });
                    nodeToRemove(oldChildren[i], transitions, projectionOptions);
                };
                for (i = oldIndex; i < findOldIndex; i++) {
                    _loop_2();
                }
                textUpdated =
                    updateDom(oldChildren[findOldIndex], newChild, projectionOptions, parentVNode, parentInstance) ||
                        textUpdated;
                oldIndex = findOldIndex + 1;
            }
            else {
                var insertBefore = undefined;
                var child = oldChildren[oldIndex];
                if (child) {
                    var nextIndex = oldIndex + 1;
                    while (insertBefore === undefined) {
                        if (d_1.isWNode(child)) {
                            if (child.rendered) {
                                child = child.rendered[0];
                            }
                            else if (oldChildren[nextIndex]) {
                                child = oldChildren[nextIndex];
                                nextIndex++;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            insertBefore = child.domNode;
                        }
                    }
                }
                createDom(newChild, parentVNode, insertBefore, projectionOptions, parentInstance);
                nodeAdded(newChild, transitions);
                var indexToCheck_1 = newIndex;
                projectionOptions.afterRenderCallbacks.push(function () {
                    checkDistinguishable(newChildren, indexToCheck_1, parentInstance);
                });
            }
        }
        newIndex++;
    };
    while (newIndex < newChildrenLength) {
        _loop_1();
    }
    if (oldChildrenLength > oldIndex) {
        var _loop_3 = function () {
            var oldChild = oldChildren[i];
            var indexToCheck = i;
            projectionOptions.afterRenderCallbacks.push(function () {
                callOnDetach(oldChild, parentInstance);
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            nodeToRemove(oldChildren[i], transitions, projectionOptions);
        };
        // Remove child fragments
        for (i = oldIndex; i < oldChildrenLength; i++) {
            _loop_3();
        }
    }
    return textUpdated;
}
function addChildren(parentVNode, children, projectionOptions, parentInstance, insertBefore, childNodes) {
    if (insertBefore === void 0) { insertBefore = undefined; }
    if (children === undefined) {
        return;
    }
    if (projectionOptions.merge && childNodes === undefined) {
        childNodes = array_1.from(parentVNode.domNode.childNodes);
    }
    projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (d_1.isVNode(child)) {
            if (projectionOptions.merge && childNodes) {
                var domElement = undefined;
                while (child.domNode === undefined && childNodes.length > 0) {
                    domElement = childNodes.shift();
                    if (domElement && domElement.tagName === (child.tag.toUpperCase() || undefined)) {
                        child.domNode = domElement;
                    }
                }
            }
            createDom(child, parentVNode, insertBefore, projectionOptions, parentInstance);
        }
        else {
            createDom(child, parentVNode, insertBefore, projectionOptions, parentInstance, childNodes);
        }
    }
}
function initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions) {
    addChildren(dnode, dnode.children, projectionOptions, parentInstance, undefined);
    if (typeof dnode.deferredPropertiesCallback === 'function' && dnode.inserted === undefined) {
        addDeferredProperties(dnode, projectionOptions);
    }
    setProperties(domNode, dnode.properties, projectionOptions);
    if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
        var instanceData = exports.widgetInstanceMap.get(parentInstance);
        instanceData.nodeHandler.add(domNode, "" + dnode.properties.key);
    }
    dnode.inserted = true;
}
function createDom(dnode, parentVNode, insertBefore, projectionOptions, parentInstance, childNodes) {
    var domNode;
    if (d_1.isWNode(dnode)) {
        var widgetConstructor = dnode.widgetConstructor;
        var parentInstanceData = exports.widgetInstanceMap.get(parentInstance);
        if (!Registry_1.isWidgetBaseConstructor(widgetConstructor)) {
            var item = parentInstanceData.registry().get(widgetConstructor);
            if (item === null) {
                return;
            }
            widgetConstructor = item;
        }
        var instance_1 = new widgetConstructor();
        dnode.instance = instance_1;
        var instanceData_1 = exports.widgetInstanceMap.get(instance_1);
        instanceData_1.invalidate = function () {
            instanceData_1.dirty = true;
            if (instanceData_1.rendering === false) {
                var renderQueue = renderQueueMap.get(projectionOptions.projectorInstance);
                renderQueue.push({ instance: instance_1, depth: projectionOptions.depth });
                scheduleRender(projectionOptions);
            }
        };
        instanceData_1.rendering = true;
        instance_1.__setCoreProperties__(dnode.coreProperties);
        instance_1.__setChildren__(dnode.children);
        instance_1.__setProperties__(dnode.properties);
        instanceData_1.rendering = false;
        var rendered = instance_1.__render__();
        if (rendered) {
            var filteredRendered = filterAndDecorateChildren(rendered, instance_1);
            dnode.rendered = filteredRendered;
            addChildren(parentVNode, filteredRendered, projectionOptions, instance_1, insertBefore, childNodes);
        }
        instanceMap.set(instance_1, { dnode: dnode, parentVNode: parentVNode });
        instanceData_1.nodeHandler.addRoot();
        projectionOptions.afterRenderCallbacks.push(function () {
            instanceData_1.onAttach();
        });
    }
    else {
        if (projectionOptions.merge && projectionOptions.mergeElement !== undefined) {
            domNode = dnode.domNode = projectionOptions.mergeElement;
            projectionOptions.mergeElement = undefined;
            initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
            return;
        }
        var doc = parentVNode.domNode.ownerDocument;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.domNode !== undefined && dnode.domNode.parentNode) {
                var newDomNode = dnode.domNode.ownerDocument.createTextNode(dnode.text);
                dnode.domNode.parentNode.replaceChild(newDomNode, dnode.domNode);
                dnode.domNode = newDomNode;
            }
            else {
                domNode = dnode.domNode = doc.createTextNode(dnode.text);
                if (insertBefore !== undefined) {
                    parentVNode.domNode.insertBefore(domNode, insertBefore);
                }
                else {
                    parentVNode.domNode.appendChild(domNode);
                }
            }
        }
        else {
            if (dnode.domNode === undefined) {
                if (dnode.tag === 'svg') {
                    projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
                }
                if (projectionOptions.namespace !== undefined) {
                    domNode = dnode.domNode = doc.createElementNS(projectionOptions.namespace, dnode.tag);
                }
                else {
                    domNode = dnode.domNode = dnode.domNode || doc.createElement(dnode.tag);
                }
            }
            else {
                domNode = dnode.domNode;
            }
            initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
            if (insertBefore !== undefined) {
                parentVNode.domNode.insertBefore(domNode, insertBefore);
            }
            else if (domNode.parentNode !== parentVNode.domNode) {
                parentVNode.domNode.appendChild(domNode);
            }
        }
    }
}
function updateDom(previous, dnode, projectionOptions, parentVNode, parentInstance) {
    if (d_1.isWNode(dnode)) {
        var instance = previous.instance;
        if (instance) {
            var _a = instanceMap.get(instance), parentVNode_1 = _a.parentVNode, node = _a.dnode;
            var previousRendered = node ? node.rendered : previous.rendered;
            var instanceData = exports.widgetInstanceMap.get(instance);
            instanceData.rendering = true;
            instance.__setCoreProperties__(dnode.coreProperties);
            instance.__setChildren__(dnode.children);
            instance.__setProperties__(dnode.properties);
            instanceData.rendering = false;
            dnode.instance = instance;
            instanceMap.set(instance, { dnode: dnode, parentVNode: parentVNode_1 });
            if (instanceData.dirty === true) {
                var rendered = instance.__render__();
                dnode.rendered = filterAndDecorateChildren(rendered, instance);
                updateChildren(parentVNode_1, previousRendered, dnode.rendered, instance, projectionOptions);
            }
            else {
                dnode.rendered = previousRendered;
            }
            instanceData.nodeHandler.addRoot();
        }
        else {
            createDom(dnode, parentVNode, undefined, projectionOptions, parentInstance);
        }
    }
    else {
        if (previous === dnode) {
            return false;
        }
        var domNode = (dnode.domNode = previous.domNode);
        var textUpdated = false;
        var updated = false;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.text !== previous.text) {
                var newDomNode = domNode.ownerDocument.createTextNode(dnode.text);
                domNode.parentNode.replaceChild(newDomNode, domNode);
                dnode.domNode = newDomNode;
                textUpdated = true;
                return textUpdated;
            }
        }
        else {
            if (dnode.tag && dnode.tag.lastIndexOf('svg', 0) === 0) {
                projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.children !== dnode.children) {
                var children = filterAndDecorateChildren(dnode.children, parentInstance);
                dnode.children = children;
                updated =
                    updateChildren(dnode, previous.children, children, parentInstance, projectionOptions) || updated;
            }
            updated = updateProperties(domNode, previous.properties, dnode.properties, projectionOptions) || updated;
            if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                var instanceData = exports.widgetInstanceMap.get(parentInstance);
                instanceData.nodeHandler.add(domNode, "" + dnode.properties.key);
            }
        }
        if (updated && dnode.properties && dnode.properties.updateAnimation) {
            dnode.properties.updateAnimation(domNode, dnode.properties, previous.properties);
        }
    }
}
function addDeferredProperties(vnode, projectionOptions) {
    // transfer any properties that have been passed - as these must be decorated properties
    vnode.decoratedDeferredProperties = vnode.properties;
    var properties = vnode.deferredPropertiesCallback(!!vnode.inserted);
    vnode.properties = tslib_1.__assign({}, properties, vnode.decoratedDeferredProperties);
    projectionOptions.deferredRenderCallbacks.push(function () {
        var properties = tslib_1.__assign({}, vnode.deferredPropertiesCallback(!!vnode.inserted), vnode.decoratedDeferredProperties);
        updateProperties(vnode.domNode, vnode.properties, properties, projectionOptions);
        vnode.properties = properties;
    });
}
function runDeferredRenderCallbacks(projectionOptions) {
    if (projectionOptions.deferredRenderCallbacks.length) {
        if (projectionOptions.sync) {
            while (projectionOptions.deferredRenderCallbacks.length) {
                var callback = projectionOptions.deferredRenderCallbacks.shift();
                callback && callback();
            }
        }
        else {
            global_1.default.requestAnimationFrame(function () {
                while (projectionOptions.deferredRenderCallbacks.length) {
                    var callback = projectionOptions.deferredRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function runAfterRenderCallbacks(projectionOptions) {
    if (projectionOptions.sync) {
        while (projectionOptions.afterRenderCallbacks.length) {
            var callback = projectionOptions.afterRenderCallbacks.shift();
            callback && callback();
        }
    }
    else {
        if (global_1.default.requestIdleCallback) {
            global_1.default.requestIdleCallback(function () {
                while (projectionOptions.afterRenderCallbacks.length) {
                    var callback = projectionOptions.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
        else {
            setTimeout(function () {
                while (projectionOptions.afterRenderCallbacks.length) {
                    var callback = projectionOptions.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function scheduleRender(projectionOptions) {
    if (projectionOptions.sync) {
        render(projectionOptions);
    }
    else if (projectionOptions.renderScheduled === undefined) {
        projectionOptions.renderScheduled = global_1.default.requestAnimationFrame(function () {
            render(projectionOptions);
        });
    }
}
function render(projectionOptions) {
    projectionOptions.renderScheduled = undefined;
    var renderQueue = renderQueueMap.get(projectionOptions.projectorInstance);
    var renders = tslib_1.__spread(renderQueue);
    renderQueueMap.set(projectionOptions.projectorInstance, []);
    renders.sort(function (a, b) { return a.depth - b.depth; });
    while (renders.length) {
        var instance = renders.shift().instance;
        var _a = instanceMap.get(instance), parentVNode = _a.parentVNode, dnode = _a.dnode;
        var instanceData = exports.widgetInstanceMap.get(instance);
        updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance);
    }
    runAfterRenderCallbacks(projectionOptions);
    runDeferredRenderCallbacks(projectionOptions);
}
exports.dom = {
    append: function (parentNode, instance, projectionOptions) {
        if (projectionOptions === void 0) { projectionOptions = {}; }
        var instanceData = exports.widgetInstanceMap.get(instance);
        var finalProjectorOptions = getProjectionOptions(projectionOptions, instance);
        finalProjectorOptions.rootNode = parentNode;
        var parentVNode = toParentVNode(finalProjectorOptions.rootNode);
        var node = toInternalWNode(instance, instanceData);
        var renderQueue = [];
        instanceMap.set(instance, { dnode: node, parentVNode: parentVNode });
        renderQueueMap.set(finalProjectorOptions.projectorInstance, renderQueue);
        instanceData.invalidate = function () {
            instanceData.dirty = true;
            if (instanceData.rendering === false) {
                var renderQueue_1 = renderQueueMap.get(finalProjectorOptions.projectorInstance);
                renderQueue_1.push({ instance: instance, depth: finalProjectorOptions.depth });
                scheduleRender(finalProjectorOptions);
            }
        };
        updateDom(node, node, finalProjectorOptions, parentVNode, instance);
        finalProjectorOptions.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        return {
            domNode: finalProjectorOptions.rootNode
        };
    },
    create: function (instance, projectionOptions) {
        return this.append(document.createElement('div'), instance, projectionOptions);
    },
    merge: function (element, instance, projectionOptions) {
        if (projectionOptions === void 0) { projectionOptions = {}; }
        projectionOptions.merge = true;
        projectionOptions.mergeElement = element;
        return this.append(element.parentNode, instance, projectionOptions);
    }
};

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/pepjs/dist/pep.js":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * PEP v0.4.3 | https://github.com/jquery/PEP
 * Copyright jQuery Foundation and other contributors | http://jquery.org/license
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.PointerEventsPolyfill = factory());
}(this, function () { 'use strict';

  /**
   * This is the constructor for new PointerEvents.
   *
   * New Pointer Events must be given a type, and an optional dictionary of
   * initialization properties.
   *
   * Due to certain platform requirements, events returned from the constructor
   * identify as MouseEvents.
   *
   * @constructor
   * @param {String} inType The type of the event to create.
   * @param {Object} [inDict] An optional dictionary of initial event properties.
   * @return {Event} A new PointerEvent of type `inType`, initialized with properties from `inDict`.
   */
  var MOUSE_PROPS = [
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
    'pageX',
    'pageY'
  ];

  var MOUSE_DEFAULTS = [
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
    0,
    0
  ];

  function PointerEvent(inType, inDict) {
    inDict = inDict || Object.create(null);

    var e = document.createEvent('Event');
    e.initEvent(inType, inDict.bubbles || false, inDict.cancelable || false);

    // define inherited MouseEvent properties
    // skip bubbles and cancelable since they're set above in initEvent()
    for (var i = 2, p; i < MOUSE_PROPS.length; i++) {
      p = MOUSE_PROPS[i];
      e[p] = inDict[p] || MOUSE_DEFAULTS[i];
    }
    e.buttons = inDict.buttons || 0;

    // Spec requires that pointers without pressure specified use 0.5 for down
    // state and 0 for up state.
    var pressure = 0;

    if (inDict.pressure && e.buttons) {
      pressure = inDict.pressure;
    } else {
      pressure = e.buttons ? 0.5 : 0;
    }

    // add x/y properties aliased to clientX/Y
    e.x = e.clientX;
    e.y = e.clientY;

    // define the properties of the PointerEvent interface
    e.pointerId = inDict.pointerId || 0;
    e.width = inDict.width || 0;
    e.height = inDict.height || 0;
    e.pressure = pressure;
    e.tiltX = inDict.tiltX || 0;
    e.tiltY = inDict.tiltY || 0;
    e.twist = inDict.twist || 0;
    e.tangentialPressure = inDict.tangentialPressure || 0;
    e.pointerType = inDict.pointerType || '';
    e.hwTimestamp = inDict.hwTimestamp || 0;
    e.isPrimary = inDict.isPrimary || false;
    return e;
  }

  /**
   * This module implements a map of pointer states
   */
  var USE_MAP = window.Map && window.Map.prototype.forEach;
  var PointerMap = USE_MAP ? Map : SparseArrayMap;

  function SparseArrayMap() {
    this.array = [];
    this.size = 0;
  }

  SparseArrayMap.prototype = {
    set: function(k, v) {
      if (v === undefined) {
        return this.delete(k);
      }
      if (!this.has(k)) {
        this.size++;
      }
      this.array[k] = v;
    },
    has: function(k) {
      return this.array[k] !== undefined;
    },
    delete: function(k) {
      if (this.has(k)) {
        delete this.array[k];
        this.size--;
      }
    },
    get: function(k) {
      return this.array[k];
    },
    clear: function() {
      this.array.length = 0;
      this.size = 0;
    },

    // return value, key, map
    forEach: function(callback, thisArg) {
      return this.array.forEach(function(v, k) {
        callback.call(thisArg, v, k, this);
      }, this);
    }
  };

  var CLONE_PROPS = [

    // MouseEvent
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',

    // DOM Level 3
    'buttons',

    // PointerEvent
    'pointerId',
    'width',
    'height',
    'pressure',
    'tiltX',
    'tiltY',
    'pointerType',
    'hwTimestamp',
    'isPrimary',

    // event instance
    'type',
    'target',
    'currentTarget',
    'which',
    'pageX',
    'pageY',
    'timeStamp'
  ];

  var CLONE_DEFAULTS = [

    // MouseEvent
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,

    // DOM Level 3
    0,

    // PointerEvent
    0,
    0,
    0,
    0,
    0,
    0,
    '',
    0,
    false,

    // event instance
    '',
    null,
    null,
    0,
    0,
    0,
    0
  ];

  var BOUNDARY_EVENTS = {
    'pointerover': 1,
    'pointerout': 1,
    'pointerenter': 1,
    'pointerleave': 1
  };

  var HAS_SVG_INSTANCE = (typeof SVGElementInstance !== 'undefined');

  /**
   * This module is for normalizing events. Mouse and Touch events will be
   * collected here, and fire PointerEvents that have the same semantics, no
   * matter the source.
   * Events fired:
   *   - pointerdown: a pointing is added
   *   - pointerup: a pointer is removed
   *   - pointermove: a pointer is moved
   *   - pointerover: a pointer crosses into an element
   *   - pointerout: a pointer leaves an element
   *   - pointercancel: a pointer will no longer generate events
   */
  var dispatcher = {
    pointermap: new PointerMap(),
    eventMap: Object.create(null),
    captureInfo: Object.create(null),

    // Scope objects for native events.
    // This exists for ease of testing.
    eventSources: Object.create(null),
    eventSourceList: [],
    /**
     * Add a new event source that will generate pointer events.
     *
     * `inSource` must contain an array of event names named `events`, and
     * functions with the names specified in the `events` array.
     * @param {string} name A name for the event source
     * @param {Object} source A new source of platform events.
     */
    registerSource: function(name, source) {
      var s = source;
      var newEvents = s.events;
      if (newEvents) {
        newEvents.forEach(function(e) {
          if (s[e]) {
            this.eventMap[e] = s[e].bind(s);
          }
        }, this);
        this.eventSources[name] = s;
        this.eventSourceList.push(s);
      }
    },
    register: function(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {

        // call eventsource register
        es.register.call(es, element);
      }
    },
    unregister: function(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {

        // call eventsource register
        es.unregister.call(es, element);
      }
    },
    contains: /*scope.external.contains || */function(container, contained) {
      try {
        return container.contains(contained);
      } catch (ex) {

        // most likely: https://bugzilla.mozilla.org/show_bug.cgi?id=208427
        return false;
      }
    },

    // EVENTS
    down: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerdown', inEvent);
    },
    move: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointermove', inEvent);
    },
    up: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerup', inEvent);
    },
    enter: function(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerenter', inEvent);
    },
    leave: function(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerleave', inEvent);
    },
    over: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerover', inEvent);
    },
    out: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerout', inEvent);
    },
    cancel: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointercancel', inEvent);
    },
    leaveOut: function(event) {
      this.out(event);
      this.propagate(event, this.leave, false);
    },
    enterOver: function(event) {
      this.over(event);
      this.propagate(event, this.enter, true);
    },

    // LISTENER LOGIC
    eventHandler: function(inEvent) {

      // This is used to prevent multiple dispatch of pointerevents from
      // platform events. This can happen when two elements in different scopes
      // are set up to create pointer events, which is relevant to Shadow DOM.
      if (inEvent._handledByPE) {
        return;
      }
      var type = inEvent.type;
      var fn = this.eventMap && this.eventMap[type];
      if (fn) {
        fn(inEvent);
      }
      inEvent._handledByPE = true;
    },

    // set up event listeners
    listen: function(target, events) {
      events.forEach(function(e) {
        this.addEvent(target, e);
      }, this);
    },

    // remove event listeners
    unlisten: function(target, events) {
      events.forEach(function(e) {
        this.removeEvent(target, e);
      }, this);
    },
    addEvent: /*scope.external.addEvent || */function(target, eventName) {
      target.addEventListener(eventName, this.boundHandler);
    },
    removeEvent: /*scope.external.removeEvent || */function(target, eventName) {
      target.removeEventListener(eventName, this.boundHandler);
    },

    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `inEvent`.
     *
     * @param {string} inType A string representing the type of event to create
     * @param {Event} inEvent A platform event with a target
     * @return {Event} A PointerEvent of type `inType`
     */
    makeEvent: function(inType, inEvent) {

      // relatedTarget must be null if pointer is captured
      if (this.captureInfo[inEvent.pointerId]) {
        inEvent.relatedTarget = null;
      }
      var e = new PointerEvent(inType, inEvent);
      if (inEvent.preventDefault) {
        e.preventDefault = inEvent.preventDefault;
      }
      e._target = e._target || inEvent.target;
      return e;
    },

    // make and dispatch an event in one call
    fireEvent: function(inType, inEvent) {
      var e = this.makeEvent(inType, inEvent);
      return this.dispatchEvent(e);
    },
    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} inEvent An event that contains properties to copy.
     * @return {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    cloneEvent: function(inEvent) {
      var eventCopy = Object.create(null);
      var p;
      for (var i = 0; i < CLONE_PROPS.length; i++) {
        p = CLONE_PROPS[i];
        eventCopy[p] = inEvent[p] || CLONE_DEFAULTS[i];

        // Work around SVGInstanceElement shadow tree
        // Return the <use> element that is represented by the instance for Safari, Chrome, IE.
        // This is the behavior implemented by Firefox.
        if (HAS_SVG_INSTANCE && (p === 'target' || p === 'relatedTarget')) {
          if (eventCopy[p] instanceof SVGElementInstance) {
            eventCopy[p] = eventCopy[p].correspondingUseElement;
          }
        }
      }

      // keep the semantics of preventDefault
      if (inEvent.preventDefault) {
        eventCopy.preventDefault = function() {
          inEvent.preventDefault();
        };
      }
      return eventCopy;
    },
    getTarget: function(inEvent) {
      var capture = this.captureInfo[inEvent.pointerId];
      if (!capture) {
        return inEvent._target;
      }
      if (inEvent._target === capture || !(inEvent.type in BOUNDARY_EVENTS)) {
        return capture;
      }
    },
    propagate: function(event, fn, propagateDown) {
      var target = event.target;
      var targets = [];

      // Order of conditions due to document.contains() missing in IE.
      while (target !== document && !target.contains(event.relatedTarget)) {
        targets.push(target);
        target = target.parentNode;

        // Touch: Do not propagate if node is detached.
        if (!target) {
          return;
        }
      }
      if (propagateDown) {
        targets.reverse();
      }
      targets.forEach(function(target) {
        event.target = target;
        fn.call(this, event);
      }, this);
    },
    setCapture: function(inPointerId, inTarget, skipDispatch) {
      if (this.captureInfo[inPointerId]) {
        this.releaseCapture(inPointerId, skipDispatch);
      }

      this.captureInfo[inPointerId] = inTarget;
      this.implicitRelease = this.releaseCapture.bind(this, inPointerId, skipDispatch);
      document.addEventListener('pointerup', this.implicitRelease);
      document.addEventListener('pointercancel', this.implicitRelease);

      var e = new PointerEvent('gotpointercapture');
      e.pointerId = inPointerId;
      e._target = inTarget;

      if (!skipDispatch) {
        this.asyncDispatchEvent(e);
      }
    },
    releaseCapture: function(inPointerId, skipDispatch) {
      var t = this.captureInfo[inPointerId];
      if (!t) {
        return;
      }

      this.captureInfo[inPointerId] = undefined;
      document.removeEventListener('pointerup', this.implicitRelease);
      document.removeEventListener('pointercancel', this.implicitRelease);

      var e = new PointerEvent('lostpointercapture');
      e.pointerId = inPointerId;
      e._target = t;

      if (!skipDispatch) {
        this.asyncDispatchEvent(e);
      }
    },
    /**
     * Dispatches the event to its target.
     *
     * @param {Event} inEvent The event to be dispatched.
     * @return {Boolean} True if an event handler returns true, false otherwise.
     */
    dispatchEvent: /*scope.external.dispatchEvent || */function(inEvent) {
      var t = this.getTarget(inEvent);
      if (t) {
        return t.dispatchEvent(inEvent);
      }
    },
    asyncDispatchEvent: function(inEvent) {
      requestAnimationFrame(this.dispatchEvent.bind(this, inEvent));
    }
  };
  dispatcher.boundHandler = dispatcher.eventHandler.bind(dispatcher);

  var targeting = {
    shadow: function(inEl) {
      if (inEl) {
        return inEl.shadowRoot || inEl.webkitShadowRoot;
      }
    },
    canTarget: function(shadow) {
      return shadow && Boolean(shadow.elementFromPoint);
    },
    targetingShadow: function(inEl) {
      var s = this.shadow(inEl);
      if (this.canTarget(s)) {
        return s;
      }
    },
    olderShadow: function(shadow) {
      var os = shadow.olderShadowRoot;
      if (!os) {
        var se = shadow.querySelector('shadow');
        if (se) {
          os = se.olderShadowRoot;
        }
      }
      return os;
    },
    allShadows: function(element) {
      var shadows = [];
      var s = this.shadow(element);
      while (s) {
        shadows.push(s);
        s = this.olderShadow(s);
      }
      return shadows;
    },
    searchRoot: function(inRoot, x, y) {
      if (inRoot) {
        var t = inRoot.elementFromPoint(x, y);
        var st, sr;

        // is element a shadow host?
        sr = this.targetingShadow(t);
        while (sr) {

          // find the the element inside the shadow root
          st = sr.elementFromPoint(x, y);
          if (!st) {

            // check for older shadows
            sr = this.olderShadow(sr);
          } else {

            // shadowed element may contain a shadow root
            var ssr = this.targetingShadow(st);
            return this.searchRoot(ssr, x, y) || st;
          }
        }

        // light dom element is the target
        return t;
      }
    },
    owner: function(element) {
      var s = element;

      // walk up until you hit the shadow root or document
      while (s.parentNode) {
        s = s.parentNode;
      }

      // the owner element is expected to be a Document or ShadowRoot
      if (s.nodeType !== Node.DOCUMENT_NODE && s.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        s = document;
      }
      return s;
    },
    findTarget: function(inEvent) {
      var x = inEvent.clientX;
      var y = inEvent.clientY;

      // if the listener is in the shadow root, it is much faster to start there
      var s = this.owner(inEvent.target);

      // if x, y is not in this root, fall back to document search
      if (!s.elementFromPoint(x, y)) {
        s = document;
      }
      return this.searchRoot(s, x, y);
    }
  };

  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  var map = Array.prototype.map.call.bind(Array.prototype.map);
  var toArray = Array.prototype.slice.call.bind(Array.prototype.slice);
  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);
  var MO = window.MutationObserver || window.WebKitMutationObserver;
  var SELECTOR = '[touch-action]';
  var OBSERVER_INIT = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['touch-action']
  };

  function Installer(add, remove, changed, binder) {
    this.addCallback = add.bind(binder);
    this.removeCallback = remove.bind(binder);
    this.changedCallback = changed.bind(binder);
    if (MO) {
      this.observer = new MO(this.mutationWatcher.bind(this));
    }
  }

  Installer.prototype = {
    watchSubtree: function(target) {

      // Only watch scopes that can target find, as these are top-level.
      // Otherwise we can see duplicate additions and removals that add noise.
      //
      // TODO(dfreedman): For some instances with ShadowDOMPolyfill, we can see
      // a removal without an insertion when a node is redistributed among
      // shadows. Since it all ends up correct in the document, watching only
      // the document will yield the correct mutations to watch.
      if (this.observer && targeting.canTarget(target)) {
        this.observer.observe(target, OBSERVER_INIT);
      }
    },
    enableOnSubtree: function(target) {
      this.watchSubtree(target);
      if (target === document && document.readyState !== 'complete') {
        this.installOnLoad();
      } else {
        this.installNewSubtree(target);
      }
    },
    installNewSubtree: function(target) {
      forEach(this.findElements(target), this.addElement, this);
    },
    findElements: function(target) {
      if (target.querySelectorAll) {
        return target.querySelectorAll(SELECTOR);
      }
      return [];
    },
    removeElement: function(el) {
      this.removeCallback(el);
    },
    addElement: function(el) {
      this.addCallback(el);
    },
    elementChanged: function(el, oldValue) {
      this.changedCallback(el, oldValue);
    },
    concatLists: function(accum, list) {
      return accum.concat(toArray(list));
    },

    // register all touch-action = none nodes on document load
    installOnLoad: function() {
      document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
          this.installNewSubtree(document);
        }
      }.bind(this));
    },
    isElement: function(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    },
    flattenMutationTree: function(inNodes) {

      // find children with touch-action
      var tree = map(inNodes, this.findElements, this);

      // make sure the added nodes are accounted for
      tree.push(filter(inNodes, this.isElement));

      // flatten the list
      return tree.reduce(this.concatLists, []);
    },
    mutationWatcher: function(mutations) {
      mutations.forEach(this.mutationHandler, this);
    },
    mutationHandler: function(m) {
      if (m.type === 'childList') {
        var added = this.flattenMutationTree(m.addedNodes);
        added.forEach(this.addElement, this);
        var removed = this.flattenMutationTree(m.removedNodes);
        removed.forEach(this.removeElement, this);
      } else if (m.type === 'attributes') {
        this.elementChanged(m.target, m.oldValue);
      }
    }
  };

  function shadowSelector(v) {
    return 'body /shadow-deep/ ' + selector(v);
  }
  function selector(v) {
    return '[touch-action="' + v + '"]';
  }
  function rule(v) {
    return '{ -ms-touch-action: ' + v + '; touch-action: ' + v + '; }';
  }
  var attrib2css = [
    'none',
    'auto',
    'pan-x',
    'pan-y',
    {
      rule: 'pan-x pan-y',
      selectors: [
        'pan-x pan-y',
        'pan-y pan-x'
      ]
    }
  ];
  var styles = '';

  // only install stylesheet if the browser has touch action support
  var hasNativePE = window.PointerEvent || window.MSPointerEvent;

  // only add shadow selectors if shadowdom is supported
  var hasShadowRoot = !window.ShadowDOMPolyfill && document.head.createShadowRoot;

  function applyAttributeStyles() {
    if (hasNativePE) {
      attrib2css.forEach(function(r) {
        if (String(r) === r) {
          styles += selector(r) + rule(r) + '\n';
          if (hasShadowRoot) {
            styles += shadowSelector(r) + rule(r) + '\n';
          }
        } else {
          styles += r.selectors.map(selector) + rule(r.rule) + '\n';
          if (hasShadowRoot) {
            styles += r.selectors.map(shadowSelector) + rule(r.rule) + '\n';
          }
        }
      });

      var el = document.createElement('style');
      el.textContent = styles;
      document.head.appendChild(el);
    }
  }

  var pointermap = dispatcher.pointermap;

  // radius around touchend that swallows mouse events
  var DEDUP_DIST = 25;

  // left, middle, right, back, forward
  var BUTTON_TO_BUTTONS = [1, 4, 2, 8, 16];

  var HAS_BUTTONS = false;
  try {
    HAS_BUTTONS = new MouseEvent('test', { buttons: 1 }).buttons === 1;
  } catch (e) {}

  // handler block for native mouse events
  var mouseEvents = {
    POINTER_ID: 1,
    POINTER_TYPE: 'mouse',
    events: [
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseover',
      'mouseout'
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      dispatcher.unlisten(target, this.events);
    },
    lastTouches: [],

    // collide with the global mouse listener
    isEventSimulatedFromTouch: function(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX;
      var y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {

        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t.x);
        var dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
    },
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);

      // forward mouse preventDefault
      var pd = e.preventDefault;
      e.preventDefault = function() {
        inEvent.preventDefault();
        pd();
      };
      e.pointerId = this.POINTER_ID;
      e.isPrimary = true;
      e.pointerType = this.POINTER_TYPE;
      return e;
    },
    prepareButtonsForMove: function(e, inEvent) {
      var p = pointermap.get(this.POINTER_ID);

      // Update buttons state after possible out-of-document mouseup.
      if (inEvent.which === 0 || !p) {
        e.buttons = 0;
      } else {
        e.buttons = p.buttons;
      }
      inEvent.buttons = e.buttons;
    },
    mousedown: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.get(this.POINTER_ID);
        var e = this.prepareEvent(inEvent);
        if (!HAS_BUTTONS) {
          e.buttons = BUTTON_TO_BUTTONS[e.button];
          if (p) { e.buttons |= p.buttons; }
          inEvent.buttons = e.buttons;
        }
        pointermap.set(this.POINTER_ID, inEvent);
        if (!p || p.buttons === 0) {
          dispatcher.down(e);
        } else {
          dispatcher.move(e);
        }
      }
    },
    mousemove: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        if (!HAS_BUTTONS) { this.prepareButtonsForMove(e, inEvent); }
        e.button = -1;
        pointermap.set(this.POINTER_ID, inEvent);
        dispatcher.move(e);
      }
    },
    mouseup: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.get(this.POINTER_ID);
        var e = this.prepareEvent(inEvent);
        if (!HAS_BUTTONS) {
          var up = BUTTON_TO_BUTTONS[e.button];

          // Produces wrong state of buttons in Browsers without `buttons` support
          // when a mouse button that was pressed outside the document is released
          // inside and other buttons are still pressed down.
          e.buttons = p ? p.buttons & ~up : 0;
          inEvent.buttons = e.buttons;
        }
        pointermap.set(this.POINTER_ID, inEvent);

        // Support: Firefox <=44 only
        // FF Ubuntu includes the lifted button in the `buttons` property on
        // mouseup.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1223366
        e.buttons &= ~BUTTON_TO_BUTTONS[e.button];
        if (e.buttons === 0) {
          dispatcher.up(e);
        } else {
          dispatcher.move(e);
        }
      }
    },
    mouseover: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        if (!HAS_BUTTONS) { this.prepareButtonsForMove(e, inEvent); }
        e.button = -1;
        pointermap.set(this.POINTER_ID, inEvent);
        dispatcher.enterOver(e);
      }
    },
    mouseout: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        if (!HAS_BUTTONS) { this.prepareButtonsForMove(e, inEvent); }
        e.button = -1;
        dispatcher.leaveOut(e);
      }
    },
    cancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.cancel(e);
      this.deactivateMouse();
    },
    deactivateMouse: function() {
      pointermap.delete(this.POINTER_ID);
    }
  };

  var captureInfo = dispatcher.captureInfo;
  var findTarget = targeting.findTarget.bind(targeting);
  var allShadows = targeting.allShadows.bind(targeting);
  var pointermap$1 = dispatcher.pointermap;

  // This should be long enough to ignore compat mouse events made by touch
  var DEDUP_TIMEOUT = 2500;
  var CLICK_COUNT_TIMEOUT = 200;
  var ATTRIB = 'touch-action';
  var INSTALLER;

  // handler block for native touch events
  var touchEvents = {
    events: [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel'
    ],
    register: function(target) {
      INSTALLER.enableOnSubtree(target);
    },
    unregister: function() {

      // TODO(dfreedman): is it worth it to disconnect the MO?
    },
    elementAdded: function(el) {
      var a = el.getAttribute(ATTRIB);
      var st = this.touchActionToScrollType(a);
      if (st) {
        el._scrollType = st;
        dispatcher.listen(el, this.events);

        // set touch-action on shadows as well
        allShadows(el).forEach(function(s) {
          s._scrollType = st;
          dispatcher.listen(s, this.events);
        }, this);
      }
    },
    elementRemoved: function(el) {
      el._scrollType = undefined;
      dispatcher.unlisten(el, this.events);

      // remove touch-action from shadow
      allShadows(el).forEach(function(s) {
        s._scrollType = undefined;
        dispatcher.unlisten(s, this.events);
      }, this);
    },
    elementChanged: function(el, oldValue) {
      var a = el.getAttribute(ATTRIB);
      var st = this.touchActionToScrollType(a);
      var oldSt = this.touchActionToScrollType(oldValue);

      // simply update scrollType if listeners are already established
      if (st && oldSt) {
        el._scrollType = st;
        allShadows(el).forEach(function(s) {
          s._scrollType = st;
        }, this);
      } else if (oldSt) {
        this.elementRemoved(el);
      } else if (st) {
        this.elementAdded(el);
      }
    },
    scrollTypes: {
      EMITTER: 'none',
      XSCROLLER: 'pan-x',
      YSCROLLER: 'pan-y',
      SCROLLER: /^(?:pan-x pan-y)|(?:pan-y pan-x)|auto$/
    },
    touchActionToScrollType: function(touchAction) {
      var t = touchAction;
      var st = this.scrollTypes;
      if (t === 'none') {
        return 'none';
      } else if (t === st.XSCROLLER) {
        return 'X';
      } else if (t === st.YSCROLLER) {
        return 'Y';
      } else if (st.SCROLLER.exec(t)) {
        return 'XY';
      }
    },
    POINTER_TYPE: 'touch',
    firstTouch: null,
    isPrimaryTouch: function(inTouch) {
      return this.firstTouch === inTouch.identifier;
    },
    setPrimaryTouch: function(inTouch) {

      // set primary touch if there no pointers, or the only pointer is the mouse
      if (pointermap$1.size === 0 || (pointermap$1.size === 1 && pointermap$1.has(1))) {
        this.firstTouch = inTouch.identifier;
        this.firstXY = { X: inTouch.clientX, Y: inTouch.clientY };
        this.scrolling = false;
        this.cancelResetClickCount();
      }
    },
    removePrimaryPointer: function(inPointer) {
      if (inPointer.isPrimary) {
        this.firstTouch = null;
        this.firstXY = null;
        this.resetClickCount();
      }
    },
    clickCount: 0,
    resetId: null,
    resetClickCount: function() {
      var fn = function() {
        this.clickCount = 0;
        this.resetId = null;
      }.bind(this);
      this.resetId = setTimeout(fn, CLICK_COUNT_TIMEOUT);
    },
    cancelResetClickCount: function() {
      if (this.resetId) {
        clearTimeout(this.resetId);
      }
    },
    typeToButtons: function(type) {
      var ret = 0;
      if (type === 'touchstart' || type === 'touchmove') {
        ret = 1;
      }
      return ret;
    },
    touchToPointer: function(inTouch) {
      var cte = this.currentTouchEvent;
      var e = dispatcher.cloneEvent(inTouch);

      // We reserve pointerId 1 for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      var id = e.pointerId = inTouch.identifier + 2;
      e.target = captureInfo[id] || findTarget(e);
      e.bubbles = true;
      e.cancelable = true;
      e.detail = this.clickCount;
      e.button = 0;
      e.buttons = this.typeToButtons(cte.type);
      e.width = (inTouch.radiusX || inTouch.webkitRadiusX || 0) * 2;
      e.height = (inTouch.radiusY || inTouch.webkitRadiusY || 0) * 2;
      e.pressure = inTouch.force || inTouch.webkitForce || 0.5;
      e.isPrimary = this.isPrimaryTouch(inTouch);
      e.pointerType = this.POINTER_TYPE;

      // forward modifier keys
      e.altKey = cte.altKey;
      e.ctrlKey = cte.ctrlKey;
      e.metaKey = cte.metaKey;
      e.shiftKey = cte.shiftKey;

      // forward touch preventDefaults
      var self = this;
      e.preventDefault = function() {
        self.scrolling = false;
        self.firstXY = null;
        cte.preventDefault();
      };
      return e;
    },
    processTouches: function(inEvent, inFunction) {
      var tl = inEvent.changedTouches;
      this.currentTouchEvent = inEvent;
      for (var i = 0, t; i < tl.length; i++) {
        t = tl[i];
        inFunction.call(this, this.touchToPointer(t));
      }
    },

    // For single axis scrollers, determines whether the element should emit
    // pointer events or behave as a scroller
    shouldScroll: function(inEvent) {
      if (this.firstXY) {
        var ret;
        var scrollAxis = inEvent.currentTarget._scrollType;
        if (scrollAxis === 'none') {

          // this element is a touch-action: none, should never scroll
          ret = false;
        } else if (scrollAxis === 'XY') {

          // this element should always scroll
          ret = true;
        } else {
          var t = inEvent.changedTouches[0];

          // check the intended scroll axis, and other axis
          var a = scrollAxis;
          var oa = scrollAxis === 'Y' ? 'X' : 'Y';
          var da = Math.abs(t['client' + a] - this.firstXY[a]);
          var doa = Math.abs(t['client' + oa] - this.firstXY[oa]);

          // if delta in the scroll axis > delta other axis, scroll instead of
          // making events
          ret = da >= doa;
        }
        this.firstXY = null;
        return ret;
      }
    },
    findTouch: function(inTL, inId) {
      for (var i = 0, l = inTL.length, t; i < l && (t = inTL[i]); i++) {
        if (t.identifier === inId) {
          return true;
        }
      }
    },

    // In some instances, a touchstart can happen without a touchend. This
    // leaves the pointermap in a broken state.
    // Therefore, on every touchstart, we remove the touches that did not fire a
    // touchend event.
    // To keep state globally consistent, we fire a
    // pointercancel for this "abandoned" touch
    vacuumTouches: function(inEvent) {
      var tl = inEvent.touches;

      // pointermap.size should be < tl.length here, as the touchstart has not
      // been processed yet.
      if (pointermap$1.size >= tl.length) {
        var d = [];
        pointermap$1.forEach(function(value, key) {

          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (key !== 1 && !this.findTouch(tl, key - 2)) {
            var p = value.out;
            d.push(p);
          }
        }, this);
        d.forEach(this.cancelOut, this);
      }
    },
    touchstart: function(inEvent) {
      this.vacuumTouches(inEvent);
      this.setPrimaryTouch(inEvent.changedTouches[0]);
      this.dedupSynthMouse(inEvent);
      if (!this.scrolling) {
        this.clickCount++;
        this.processTouches(inEvent, this.overDown);
      }
    },
    overDown: function(inPointer) {
      pointermap$1.set(inPointer.pointerId, {
        target: inPointer.target,
        out: inPointer,
        outTarget: inPointer.target
      });
      dispatcher.enterOver(inPointer);
      dispatcher.down(inPointer);
    },
    touchmove: function(inEvent) {
      if (!this.scrolling) {
        if (this.shouldScroll(inEvent)) {
          this.scrolling = true;
          this.touchcancel(inEvent);
        } else {
          inEvent.preventDefault();
          this.processTouches(inEvent, this.moveOverOut);
        }
      }
    },
    moveOverOut: function(inPointer) {
      var event = inPointer;
      var pointer = pointermap$1.get(event.pointerId);

      // a finger drifted off the screen, ignore it
      if (!pointer) {
        return;
      }
      var outEvent = pointer.out;
      var outTarget = pointer.outTarget;
      dispatcher.move(event);
      if (outEvent && outTarget !== event.target) {
        outEvent.relatedTarget = event.target;
        event.relatedTarget = outTarget;

        // recover from retargeting by shadow
        outEvent.target = outTarget;
        if (event.target) {
          dispatcher.leaveOut(outEvent);
          dispatcher.enterOver(event);
        } else {

          // clean up case when finger leaves the screen
          event.target = outTarget;
          event.relatedTarget = null;
          this.cancelOut(event);
        }
      }
      pointer.out = event;
      pointer.outTarget = event.target;
    },
    touchend: function(inEvent) {
      this.dedupSynthMouse(inEvent);
      this.processTouches(inEvent, this.upOut);
    },
    upOut: function(inPointer) {
      if (!this.scrolling) {
        dispatcher.up(inPointer);
        dispatcher.leaveOut(inPointer);
      }
      this.cleanUpPointer(inPointer);
    },
    touchcancel: function(inEvent) {
      this.processTouches(inEvent, this.cancelOut);
    },
    cancelOut: function(inPointer) {
      dispatcher.cancel(inPointer);
      dispatcher.leaveOut(inPointer);
      this.cleanUpPointer(inPointer);
    },
    cleanUpPointer: function(inPointer) {
      pointermap$1.delete(inPointer.pointerId);
      this.removePrimaryPointer(inPointer);
    },

    // prevent synth mouse events from creating pointer events
    dedupSynthMouse: function(inEvent) {
      var lts = mouseEvents.lastTouches;
      var t = inEvent.changedTouches[0];

      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch(t)) {

        // remember x/y of last touch
        var lt = { x: t.clientX, y: t.clientY };
        lts.push(lt);
        var fn = (function(lts, lt) {
          var i = lts.indexOf(lt);
          if (i > -1) {
            lts.splice(i, 1);
          }
        }).bind(null, lts, lt);
        setTimeout(fn, DEDUP_TIMEOUT);
      }
    }
  };

  INSTALLER = new Installer(touchEvents.elementAdded, touchEvents.elementRemoved,
    touchEvents.elementChanged, touchEvents);

  var pointermap$2 = dispatcher.pointermap;
  var HAS_BITMAP_TYPE = window.MSPointerEvent &&
    typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE === 'number';
  var msEvents = {
    events: [
      'MSPointerDown',
      'MSPointerMove',
      'MSPointerUp',
      'MSPointerOut',
      'MSPointerOver',
      'MSPointerCancel',
      'MSGotPointerCapture',
      'MSLostPointerCapture'
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      dispatcher.unlisten(target, this.events);
    },
    POINTER_TYPES: [
      '',
      'unavailable',
      'touch',
      'pen',
      'mouse'
    ],
    prepareEvent: function(inEvent) {
      var e = inEvent;
      if (HAS_BITMAP_TYPE) {
        e = dispatcher.cloneEvent(inEvent);
        e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
      }
      return e;
    },
    cleanup: function(id) {
      pointermap$2.delete(id);
    },
    MSPointerDown: function(inEvent) {
      pointermap$2.set(inEvent.pointerId, inEvent);
      var e = this.prepareEvent(inEvent);
      dispatcher.down(e);
    },
    MSPointerMove: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.move(e);
    },
    MSPointerUp: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    MSPointerOut: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.leaveOut(e);
    },
    MSPointerOver: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.enterOver(e);
    },
    MSPointerCancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    },
    MSLostPointerCapture: function(inEvent) {
      var e = dispatcher.makeEvent('lostpointercapture', inEvent);
      dispatcher.dispatchEvent(e);
    },
    MSGotPointerCapture: function(inEvent) {
      var e = dispatcher.makeEvent('gotpointercapture', inEvent);
      dispatcher.dispatchEvent(e);
    }
  };

  function applyPolyfill() {

    // only activate if this platform does not have pointer events
    if (!window.PointerEvent) {
      window.PointerEvent = PointerEvent;

      if (window.navigator.msPointerEnabled) {
        var tp = window.navigator.msMaxTouchPoints;
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
          value: tp,
          enumerable: true
        });
        dispatcher.registerSource('ms', msEvents);
      } else {
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
          value: 0,
          enumerable: true
        });
        dispatcher.registerSource('mouse', mouseEvents);
        if (window.ontouchstart !== undefined) {
          dispatcher.registerSource('touch', touchEvents);
        }
      }

      dispatcher.register(document);
    }
  }

  var n = window.navigator;
  var s;
  var r;
  var h;
  function assertActive(id) {
    if (!dispatcher.pointermap.has(id)) {
      var error = new Error('InvalidPointerId');
      error.name = 'InvalidPointerId';
      throw error;
    }
  }
  function assertConnected(elem) {
    var parent = elem.parentNode;
    while (parent && parent !== elem.ownerDocument) {
      parent = parent.parentNode;
    }
    if (!parent) {
      var error = new Error('InvalidStateError');
      error.name = 'InvalidStateError';
      throw error;
    }
  }
  function inActiveButtonState(id) {
    var p = dispatcher.pointermap.get(id);
    return p.buttons !== 0;
  }
  if (n.msPointerEnabled) {
    s = function(pointerId) {
      assertActive(pointerId);
      assertConnected(this);
      if (inActiveButtonState(pointerId)) {
        dispatcher.setCapture(pointerId, this, true);
        this.msSetPointerCapture(pointerId);
      }
    };
    r = function(pointerId) {
      assertActive(pointerId);
      dispatcher.releaseCapture(pointerId, true);
      this.msReleasePointerCapture(pointerId);
    };
  } else {
    s = function setPointerCapture(pointerId) {
      assertActive(pointerId);
      assertConnected(this);
      if (inActiveButtonState(pointerId)) {
        dispatcher.setCapture(pointerId, this);
      }
    };
    r = function releasePointerCapture(pointerId) {
      assertActive(pointerId);
      dispatcher.releaseCapture(pointerId);
    };
  }
  h = function hasPointerCapture(pointerId) {
    return !!dispatcher.captureInfo[pointerId];
  };

  function applyPolyfill$1() {
    if (window.Element && !Element.prototype.setPointerCapture) {
      Object.defineProperties(Element.prototype, {
        'setPointerCapture': {
          value: s
        },
        'releasePointerCapture': {
          value: r
        },
        'hasPointerCapture': {
          value: h
        }
      });
    }
  }

  applyAttributeStyles();
  applyPolyfill();
  applyPolyfill$1();

  var pointerevents = {
    dispatcher: dispatcher,
    Installer: Installer,
    PointerEvent: PointerEvent,
    PointerMap: PointerMap,
    targetFinding: targeting
  };

  return pointerevents;

}));

/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__("./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__("./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


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
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!./node_modules/css-loader/index.js?{\"modules\":true,\"sourceMap\":true,\"importLoaders\":1,\"localIdentName\":\"[hash:base64:8]\"}!./node_modules/postcss-loader/lib/index.js?{\"ident\":\"postcss\",\"plugins\":[null,{\"version\":\"6.0.17\",\"plugins\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"postcssPlugin\":\"postcss-cssnext\",\"postcssVersion\":\"6.0.17\"}]}!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./src/menu-item/menuItem.m.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!../../node_modules/css-loader/index.js??ref--9-3!../../node_modules/postcss-loader/lib/index.js??postcss!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./menuItem.m.css", function() {
			var newContent = require("!!../../node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!../../node_modules/css-loader/index.js??ref--9-3!../../node_modules/postcss-loader/lib/index.js??postcss!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./menuItem.m.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

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
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!./node_modules/css-loader/index.js?{\"modules\":true,\"sourceMap\":true,\"importLoaders\":1,\"localIdentName\":\"[hash:base64:8]\"}!./node_modules/postcss-loader/lib/index.js?{\"ident\":\"postcss\",\"plugins\":[null,{\"version\":\"6.0.17\",\"plugins\":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],\"postcssPlugin\":\"postcss-cssnext\",\"postcssVersion\":\"6.0.17\"}]}!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./src/menu/menu.m.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!../../node_modules/css-loader/index.js??ref--9-3!../../node_modules/postcss-loader/lib/index.js??postcss!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./menu.m.css", function() {
			var newContent = require("!!../../node_modules/@dojo/webpack-contrib/css-module-decorator-loader/index.js!../../node_modules/css-loader/index.js??ref--9-3!../../node_modules/postcss-loader/lib/index.js??postcss!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=css!./menu.m.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./tests/unit/all.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./tests/unit/menu-item/MenuItem.ts");
__webpack_require__("./tests/unit/menu/Menu.ts");


/***/ }),

/***/ "./tests/unit/menu-item/MenuItem.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a = intern.getInterface('bdd'), describe = _a.describe, it = _a.it;
var harness_1 = __webpack_require__("./node_modules/@dojo/test-extras/harness.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var MenuItem_1 = __webpack_require__("./src/menu-item/MenuItem.ts");
var css = __webpack_require__("./src/menu-item/menuItem.m.css");
describe('MenuItem', function () {
    it('should render widget', function () {
        var testMenuItem = harness_1.default(MenuItem_1.MenuItem);
        var selected = true;
        var title = 'Menu Item';
        testMenuItem.setProperties({ selected: selected, title: title });
        testMenuItem.expectRender(d_1.v('li', { classes: css.root }, [
            d_1.v('span', {
                classes: [css.item, css.selected],
                onclick: testMenuItem.listener
            }, [title])
        ]));
    });
});


/***/ }),

/***/ "./tests/unit/menu/Menu.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a = intern.getInterface('bdd'), describe = _a.describe, it = _a.it;
var harness_1 = __webpack_require__("./node_modules/@dojo/test-extras/harness.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Menu_1 = __webpack_require__("./src/menu/Menu.ts");
var css = __webpack_require__("./src/menu/menu.m.css");
describe('Menu', function () {
    it('should render widget', function () {
        var testMenu = harness_1.default(Menu_1.Menu);
        testMenu.expectRender(d_1.v('nav', { classes: css.root }, [d_1.v('ol', { classes: css.menuContainer })]));
    });
});


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./tests/unit/all.ts");
__webpack_require__("./tests/unit/menu-item/MenuItem.ts");
module.exports = __webpack_require__("./tests/unit/menu/Menu.ts");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2VmMmMwNGFhZTg3MDIxMmRmMDEiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9hc3BlY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvaGFzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2hhcy9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vTWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU2V0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2FycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvaGFybmVzcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9Bc3NlcnRpb25FcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9hc3NlcnRSZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvY2FsbExpc3RlbmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby90ZXN0LWV4dHJhcy9zdXBwb3J0L2NvbXBhcmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9zZW5kRXZlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcz9jYTM4Iiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/MzA5ZCIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGlmZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlcGpzL2Rpc3QvcGVwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3MiLCJ3ZWJwYWNrOi8vLy4vdGVzdHMvdW5pdC9hbGwudHMiLCJ3ZWJwYWNrOi8vLy4vdGVzdHMvdW5pdC9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vdGVzdHMvdW5pdC9tZW51L01lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDJDQUEyQyx1QkFBdUI7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCOzs7Ozs7OztBQ25WQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxnREFBZ0QsbUNBQW1DLFNBQVMsaUJBQWlCLDBCQUEwQixLQUFLLFlBQVksMkJBQTJCLEtBQUssR0FBRyxFQUFFLE9BQU8sUUFBUSxpQ0FBaUM7QUFDN1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsUzs7Ozs7Ozs7QUM1Q0Q7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHNEOzs7Ozs7Ozt1REN6T0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEU7Ozs7Ozs7OztBQzFNRDtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0dBQStHLG9CQUFvQjtBQUNuSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxRQUFRLGdCQUFnQjtBQUMvRDtBQUNB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QUFDQSxpQ0FBaUMsMEJBQTBCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQ0FBZ0M7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGtDOzs7Ozs7OztBQzlIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBdUcscUJBQXFCO0FBQzVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsUUFBUSxnQkFBZ0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMEJBQTBCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxlQUFlO0FBQ2xEO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OzhDQy9NQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwrQjs7Ozs7Ozs7O0FDbEJBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCOzs7Ozs7OztBQ3JIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUNBQWlDLGlCQUFpQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHdFQUF3RSxFQUFFO0FBQ3JJO0FBQ0EsMkJBQTJCLHFDQUFxQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVCxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLHlEQUF5RCxFQUFFO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsZ0dBQWdHLEVBQUU7QUFDcko7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsY0FBYztBQUMzQztBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxvQ0FBb0M7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUscUNBQXFDLEVBQUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw2Qjs7Ozs7Ozs7QUM3WUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7O0FDL0RBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsc0JBQXNCLHFDQUFxQztBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtDQUFrQyxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBCQUEwQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsc0JBQXNCLHFDQUFxQztBQUN0RyxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHVEQUF1RDtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHlDQUF5QztBQUM5RTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsc0JBQXNCLDJCQUEyQjtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QywyQ0FBMkM7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxzQkFBc0IsMkJBQTJCO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckIsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsd0JBQXdCO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLHlCQUF5QixFQUFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsdUJBQXVCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0NBQXdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUNBQXlDLHdCQUF3QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDLEc7Ozs7Ozs7QUNoOENEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFD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QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RSxVQUFFO0FBQ3BCO0FBRUE7QUFFQTtBQUNBO0FBRUEsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNoQixFQUFFLENBQUMsc0JBQXNCLEVBQUU7UUFDMUIsSUFBTSxTQUFRLEVBQUcsaUJBQU8sQ0FBQyxXQUFJLENBQUM7UUFDOUIsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFJLENBQUUsRUFBRSxDQUFDLEtBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLGNBQWEsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQztBQUNILENBQUMsQ0FBQyIsImZpbGUiOiJ1bml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2VmMmMwNGFhZTg3MDIxMmRmMDEiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUHJvbWlzZV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vUHJvbWlzZVwiKTtcclxuLyoqXHJcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxyXG4gKi9cclxuZnVuY3Rpb24gbm9vcCgpIHtcclxuICAgIHJldHVybiBQcm9taXNlXzEuZGVmYXVsdC5yZXNvbHZlKGZhbHNlKTtcclxufVxyXG4vKipcclxuICogTm8gb3AgZnVuY3Rpb24gdXNlZCB0byByZXBsYWNlIG93biwgb25jZSBpbnN0YW5jZSBoYXMgYmVlbiBkZXN0b3J5ZWRcclxuICovXHJcbmZ1bmN0aW9uIGRlc3Ryb3llZCgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignQ2FsbCBtYWRlIHRvIGRlc3Ryb3llZCBtZXRob2QnKTtcclxufVxyXG52YXIgRGVzdHJveWFibGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGVzdHJveWFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVzID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gYHRoaXMuZGVzdHJveWAgaXMgY2FsbGVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIYW5kbGV9IGhhbmRsZSBUaGUgaGFuZGxlIHRvIGFkZCBmb3IgdGhlIGluc3RhbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7SGFuZGxlfSBhIGhhbmRsZSBmb3IgdGhlIGhhbmRsZSwgcmVtb3ZlcyB0aGUgaGFuZGxlIGZvciB0aGUgaW5zdGFuY2UgYW5kIGNhbGxzIGRlc3Ryb3lcclxuICAgICAqL1xyXG4gICAgRGVzdHJveWFibGUucHJvdG90eXBlLm93biA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcclxuICAgICAgICB2YXIgaGFuZGxlcyA9IHRoaXMuaGFuZGxlcztcclxuICAgICAgICBoYW5kbGVzLnB1c2goaGFuZGxlKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVzLnNwbGljZShoYW5kbGVzLmluZGV4T2YoaGFuZGxlKSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgaGFuZGxlcyBoYXZlIGJlZW4gZGVzdHJveWVkXHJcbiAgICAgKi9cclxuICAgIERlc3Ryb3lhYmxlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlXzEuZGVmYXVsdChmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5oYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlICYmIGhhbmRsZS5kZXN0cm95ICYmIGhhbmRsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBfdGhpcy5kZXN0cm95ID0gbm9vcDtcclxuICAgICAgICAgICAgX3RoaXMub3duID0gZGVzdHJveWVkO1xyXG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEZXN0cm95YWJsZTtcclxufSgpKTtcclxuZXhwb3J0cy5EZXN0cm95YWJsZSA9IERlc3Ryb3lhYmxlO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEZXN0cm95YWJsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBhc3BlY3RfMSA9IHJlcXVpcmUoXCIuL2FzcGVjdFwiKTtcclxudmFyIERlc3Ryb3lhYmxlXzEgPSByZXF1aXJlKFwiLi9EZXN0cm95YWJsZVwiKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgaXMgdGhlIHZhbHVlIGlzIEFjdGlvbmFibGUgKGhhcyBhIGAuZG9gIGZ1bmN0aW9uKVxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpcyB0aGUgdmFsdWUgaXMgQWN0aW9uYWJsZVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBY3Rpb25hYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbih2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuZG8gPT09ICdmdW5jdGlvbicpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXNvbHZlIGxpc3RlbmVycy5cclxuICovXHJcbmZ1bmN0aW9uIHJlc29sdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgcmV0dXJuIGlzQWN0aW9uYWJsZShsaXN0ZW5lcikgPyBmdW5jdGlvbiAoZXZlbnQpIHsgcmV0dXJuIGxpc3RlbmVyLmRvKHsgZXZlbnQ6IGV2ZW50IH0pOyB9IDogbGlzdGVuZXI7XHJcbn1cclxuLyoqXHJcbiAqIEhhbmRsZXMgYW4gYXJyYXkgb2YgaGFuZGxlc1xyXG4gKlxyXG4gKiBAcGFyYW0gaGFuZGxlcyBhbiBhcnJheSBvZiBoYW5kbGVzXHJcbiAqIEByZXR1cm5zIGEgc2luZ2xlIEhhbmRsZSBmb3IgaGFuZGxlcyBwYXNzZWRcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkgeyByZXR1cm4gaGFuZGxlLmRlc3Ryb3koKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xyXG4gKi9cclxudmFyIHJlZ2V4TWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgaXMgdGhlIGV2ZW50IHR5cGUgZ2xvYiBoYXMgYmVlbiBtYXRjaGVkXHJcbiAqXHJcbiAqIEByZXR1cm5zIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGdsb2IgaXMgbWF0Y2hlZFxyXG4gKi9cclxuZnVuY3Rpb24gaXNHbG9iTWF0Y2goZ2xvYlN0cmluZywgdGFyZ2V0U3RyaW5nKSB7XHJcbiAgICBpZiAodHlwZW9mIHRhcmdldFN0cmluZyA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGdsb2JTdHJpbmcgPT09ICdzdHJpbmcnICYmIGdsb2JTdHJpbmcuaW5kZXhPZignKicpICE9PSAtMSkge1xyXG4gICAgICAgIHZhciByZWdleCA9IHZvaWQgMDtcclxuICAgICAgICBpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJlZ2V4ID0gcmVnZXhNYXAuZ2V0KGdsb2JTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKFwiXlwiICsgZ2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJykgKyBcIiRcIik7XHJcbiAgICAgICAgICAgIHJlZ2V4TWFwLnNldChnbG9iU3RyaW5nLCByZWdleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHRhcmdldFN0cmluZyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZ2xvYlN0cmluZyA9PT0gdGFyZ2V0U3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaXNHbG9iTWF0Y2ggPSBpc0dsb2JNYXRjaDtcclxuLyoqXHJcbiAqIEV2ZW50IENsYXNzXHJcbiAqL1xyXG52YXIgRXZlbnRlZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhFdmVudGVkLCBfc3VwZXIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBjb25zdHJ1Y3RvciBhcmd1cm1lbnRzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEV2ZW50ZWQob3B0aW9ucykge1xyXG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBfdGhpcy5saXN0ZW5lcnNNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhdGNoIGFsbCBoYW5kbGVyIGZvciB2YXJpb3VzIGNhbGwgc2lnbmF0dXJlcy4gVGhlIHNpZ25hdHVyZXMgYXJlIGRlZmluZWQgaW5cclxuICAgICAgICAgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgWW91IGNhbiBhZGQgeW91ciBvd24gZXZlbnQgdHlwZSAtPiBoYW5kbGVyIHR5cGVzIGJ5IGV4dGVuZGluZ1xyXG4gICAgICAgICAqIGBCYXNlRXZlbnRlZEV2ZW50c2AuICBTZWUgZXhhbXBsZSBmb3IgZGV0YWlscy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBhcmdzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogaW50ZXJmYWNlIFdpZGdldEJhc2VFdmVudHMgZXh0ZW5kcyBCYXNlRXZlbnRlZEV2ZW50cyB7XHJcbiAgICAgICAgICogICAgICh0eXBlOiAncHJvcGVydGllczpjaGFuZ2VkJywgaGFuZGxlcjogUHJvcGVydGllc0NoYW5nZWRIYW5kbGVyKTogSGFuZGxlO1xyXG4gICAgICAgICAqIH1cclxuICAgICAgICAgKiBjbGFzcyBXaWRnZXRCYXNlIGV4dGVuZHMgRXZlbnRlZCB7XHJcbiAgICAgICAgICogICAgb246IFdpZGdldEJhc2VFdmVudHM7XHJcbiAgICAgICAgICogfVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLm9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hID0gdHNsaWJfMS5fX3JlYWQoYXJncywgMiksIHR5cGVfMSA9IF9hWzBdLCBsaXN0ZW5lcnMgPSBfYVsxXTtcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlcyA9IGxpc3RlbmVycy5tYXAoZnVuY3Rpb24gKGxpc3RlbmVyKSB7IHJldHVybiBhc3BlY3RfMS5vbihfdGhpcy5saXN0ZW5lcnNNYXAsIHR5cGVfMSwgcmVzb2x2ZUxpc3RlbmVyKGxpc3RlbmVyKSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVzQXJyYXl0b0hhbmRsZShoYW5kbGVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RfMS5vbih0aGlzLmxpc3RlbmVyc01hcCwgdHlwZV8xLCByZXNvbHZlTGlzdGVuZXIobGlzdGVuZXJzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfYiA9IHRzbGliXzEuX19yZWFkKGFyZ3MsIDEpLCBsaXN0ZW5lck1hcEFyZ18xID0gX2JbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlcyA9IE9iamVjdC5rZXlzKGxpc3RlbmVyTWFwQXJnXzEpLm1hcChmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gX3RoaXMub24odHlwZSwgbGlzdGVuZXJNYXBBcmdfMVt0eXBlXSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudHMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IG9wdGlvbnMubGlzdGVuZXJzO1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgX3RoaXMub3duKF90aGlzLm9uKGxpc3RlbmVycykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEVtaXRzIHRoZSBldmVudCBvYmpldCBmb3IgdGhlIHNwZWNpZmllZCB0eXBlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBlbWl0XHJcbiAgICAgKi9cclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzTWFwLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCwgdHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoaXNHbG9iTWF0Y2godHlwZSwgZXZlbnQudHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKF90aGlzLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRXZlbnRlZDtcclxufShEZXN0cm95YWJsZV8xLkRlc3Ryb3lhYmxlKSk7XHJcbmV4cG9ydHMuRXZlbnRlZCA9IEV2ZW50ZWQ7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEV2ZW50ZWQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9FdmVudGVkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiLi9sYW5nXCIpO1xyXG4vKipcclxuICogQW4gaW50ZXJuYWwgdHlwZSBndWFyZCB0aGF0IGRldGVybWluZXMgaWYgYW4gdmFsdWUgaXMgTWFwTGlrZSBvciBub3RcclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBndWFyZCBhZ2FpbnN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc01hcExpa2UodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZS5zZXQgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuLyoqXHJcbiAqIEEgd2VhayBtYXAgb2YgZGlzcGF0Y2hlcnMgdXNlZCB0byBhcHBseSB0aGUgYWR2aWNlXHJcbiAqL1xyXG52YXIgZGlzcGF0Y2hBZHZpY2VNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuLyoqXHJcbiAqIEEgVUlEIGZvciB0cmFja2luZyBhZHZpY2Ugb3JkZXJpbmdcclxuICovXHJcbnZhciBuZXh0SWQgPSAwO1xyXG4vKipcclxuICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBhZHZpc2VzIGEgam9pbiBwb2ludFxyXG4gKlxyXG4gKiBAcGFyYW0gZGlzcGF0Y2hlciBUaGUgY3VycmVudCBhZHZpY2UgZGlzcGF0Y2hlclxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBiZWZvcmUgb3IgYWZ0ZXIgYWR2aWNlIHRvIGFwcGx5XHJcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFkdmljZSB0byBhcHBseVxyXG4gKiBAcGFyYW0gcmVjZWl2ZUFyZ3VtZW50cyBJZiB0cnVlLCB0aGUgYWR2aWNlIHdpbGwgcmVjZWl2ZSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgam9pbiBwb2ludFxyXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgdGhhdCB3aWxsIHJlbW92ZSB0aGUgYWR2aWNlXHJcbiAqL1xyXG5mdW5jdGlvbiBhZHZpc2VPYmplY3QoZGlzcGF0Y2hlciwgdHlwZSwgYWR2aWNlLCByZWNlaXZlQXJndW1lbnRzKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBkaXNwYXRjaGVyICYmIGRpc3BhdGNoZXJbdHlwZV07XHJcbiAgICB2YXIgYWR2aXNlZCA9IHtcclxuICAgICAgICBpZDogbmV4dElkKyssXHJcbiAgICAgICAgYWR2aWNlOiBhZHZpY2UsXHJcbiAgICAgICAgcmVjZWl2ZUFyZ3VtZW50czogcmVjZWl2ZUFyZ3VtZW50c1xyXG4gICAgfTtcclxuICAgIGlmIChwcmV2aW91cykge1xyXG4gICAgICAgIGlmICh0eXBlID09PSAnYWZ0ZXInKSB7XHJcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgbGlzdGVuZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxyXG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgd2UgaGFkIHRvIGNoYW5nZSB0aGlzIGxvb3AgYSBsaXR0bGUgYml0IHRvIHdvcmthcm91bmQgYSBiaXphcnJlIElFMTAgSklUIGJ1Z1xyXG4gICAgICAgICAgICB3aGlsZSAocHJldmlvdXMubmV4dCAmJiAocHJldmlvdXMgPSBwcmV2aW91cy5uZXh0KSkgeyB9XHJcbiAgICAgICAgICAgIHByZXZpb3VzLm5leHQgPSBhZHZpc2VkO1xyXG4gICAgICAgICAgICBhZHZpc2VkLnByZXZpb3VzID0gcHJldmlvdXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhZGQgdG8gdGhlIGJlZ2lubmluZ1xyXG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hlcikge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5iZWZvcmUgPSBhZHZpc2VkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFkdmlzZWQubmV4dCA9IHByZXZpb3VzO1xyXG4gICAgICAgICAgICBwcmV2aW91cy5wcmV2aW91cyA9IGFkdmlzZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IGFkdmlzZWQpO1xyXG4gICAgfVxyXG4gICAgYWR2aWNlID0gcHJldmlvdXMgPSB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gbGFuZ18xLmNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gKGFkdmlzZWQgfHwge30pLCBfYiA9IF9hLnByZXZpb3VzLCBwcmV2aW91cyA9IF9iID09PSB2b2lkIDAgPyB1bmRlZmluZWQgOiBfYiwgX2MgPSBfYS5uZXh0LCBuZXh0ID0gX2MgPT09IHZvaWQgMCA/IHVuZGVmaW5lZCA6IF9jO1xyXG4gICAgICAgIGlmIChkaXNwYXRjaGVyICYmICFwcmV2aW91cyAmJiAhbmV4dCkge1xyXG4gICAgICAgICAgICBkaXNwYXRjaGVyW3R5cGVdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91cy5uZXh0ID0gbmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIgJiYgKGRpc3BhdGNoZXJbdHlwZV0gPSBuZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgbmV4dC5wcmV2aW91cyA9IHByZXZpb3VzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhZHZpc2VkKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBhZHZpc2VkLmFkdmljZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGF0Y2hlciA9IGFkdmlzZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogQWR2aXNlIGEgam9pbiBwb2ludCAoZnVuY3Rpb24pIHdpdGggc3VwcGxpZWQgYWR2aWNlXHJcbiAqXHJcbiAqIEBwYXJhbSBqb2luUG9pbnQgVGhlIGZ1bmN0aW9uIHRvIGJlIGFkdmlzZWRcclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgYWR2aWNlIHRvIGJlIGFwcGxpZWRcclxuICogQHBhcmFtIGFkdmljZSBUaGUgYWR2aWNlIHRvIGFwcGx5XHJcbiAqL1xyXG5mdW5jdGlvbiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCB0eXBlLCBhZHZpY2UpIHtcclxuICAgIHZhciBkaXNwYXRjaGVyO1xyXG4gICAgaWYgKHR5cGUgPT09ICdhcm91bmQnKSB7XHJcbiAgICAgICAgZGlzcGF0Y2hlciA9IGdldEpvaW5Qb2ludERpc3BhdGNoZXIoYWR2aWNlLmFwcGx5KHRoaXMsIFtqb2luUG9pbnRdKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaGVyID0gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcihqb2luUG9pbnQpO1xyXG4gICAgICAgIC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcclxuICAgICAgICB2YXIgYWR2aWNlTWFwID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGRpc3BhdGNoZXIpO1xyXG4gICAgICAgIGlmICh0eXBlID09PSAnYmVmb3JlJykge1xyXG4gICAgICAgICAgICAoYWR2aWNlTWFwLmJlZm9yZSB8fCAoYWR2aWNlTWFwLmJlZm9yZSA9IFtdKSkudW5zaGlmdChhZHZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgKGFkdmljZU1hcC5hZnRlciB8fCAoYWR2aWNlTWFwLmFmdGVyID0gW10pKS5wdXNoKGFkdmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpc3BhdGNoZXI7XHJcbn1cclxuLyoqXHJcbiAqIEFuIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgb3IgY3JlYXRlcyB0aGUgZGlzcGF0Y2hlciBmb3IgYSBnaXZlbiBqb2luIHBvaW50XHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb3IgbWFwXHJcbiAqIEBwYXJhbSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdGhhdCB0aGUgZGlzcGF0Y2hlciBzaG91bGQgYmUgcmVzb2x2ZWQgZm9yXHJcbiAqIEByZXR1cm4gVGhlIGRpc3BhdGNoZXJcclxuICovXHJcbmZ1bmN0aW9uIGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKSB7XHJcbiAgICB2YXIgZXhpc3RpbmcgPSBpc01hcExpa2UodGFyZ2V0KSA/IHRhcmdldC5nZXQobWV0aG9kTmFtZSkgOiB0YXJnZXQgJiYgdGFyZ2V0W21ldGhvZE5hbWVdO1xyXG4gICAgdmFyIGRpc3BhdGNoZXI7XHJcbiAgICBpZiAoIWV4aXN0aW5nIHx8IGV4aXN0aW5nLnRhcmdldCAhPT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgLyogVGhlcmUgaXMgbm8gZXhpc3RpbmcgZGlzcGF0Y2hlciwgdGhlcmVmb3JlIHdlIHdpbGwgY3JlYXRlIG9uZSAqL1xyXG4gICAgICAgIGRpc3BhdGNoZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBleGVjdXRpb25JZCA9IG5leHRJZDtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzO1xyXG4gICAgICAgICAgICB2YXIgYmVmb3JlID0gZGlzcGF0Y2hlci5iZWZvcmU7XHJcbiAgICAgICAgICAgIHdoaWxlIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUuYWR2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGJlZm9yZS5hZHZpY2UuYXBwbHkodGhpcywgYXJncykgfHwgYXJncztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IGJlZm9yZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaGVyLmFyb3VuZCAmJiBkaXNwYXRjaGVyLmFyb3VuZC5hZHZpY2UpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBkaXNwYXRjaGVyLmFyb3VuZC5hZHZpY2UodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFmdGVyID0gZGlzcGF0Y2hlci5hZnRlcjtcclxuICAgICAgICAgICAgd2hpbGUgKGFmdGVyICYmIGFmdGVyLmlkICE9PSB1bmRlZmluZWQgJiYgYWZ0ZXIuaWQgPCBleGVjdXRpb25JZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFmdGVyLmFkdmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZnRlci5yZWNlaXZlQXJndW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdSZXN1bHRzID0gYWZ0ZXIuYWR2aWNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gbmV3UmVzdWx0cyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0cyA6IG5ld1Jlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gYWZ0ZXIuYWR2aWNlLmNhbGwodGhpcywgcmVzdWx0cywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWZ0ZXIgPSBhZnRlci5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGlzTWFwTGlrZSh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQobWV0aG9kTmFtZSwgZGlzcGF0Y2hlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJnZXQgJiYgKHRhcmdldFttZXRob2ROYW1lXSA9IGRpc3BhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgZGlzcGF0Y2hlci5hcm91bmQgPSB7XHJcbiAgICAgICAgICAgICAgICBhZHZpY2U6IGZ1bmN0aW9uICh0YXJnZXQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmcuYXBwbHkodGFyZ2V0LCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGF0Y2hlci50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaGVyID0gZXhpc3Rpbmc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzcGF0Y2hlcjtcclxufVxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZGlzcGF0Y2hlciBmdW5jdGlvbiBmb3IgYSBnaXZlbiBqb2luUG9pbnQgKG1ldGhvZC9mdW5jdGlvbilcclxuICpcclxuICogQHBhcmFtIGpvaW5Qb2ludCBUaGUgZnVuY3Rpb24gdGhhdCBpcyB0byBiZSBhZHZpc2VkXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRKb2luUG9pbnREaXNwYXRjaGVyKGpvaW5Qb2ludCkge1xyXG4gICAgZnVuY3Rpb24gZGlzcGF0Y2hlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXHJcbiAgICAgICAgdmFyIF9hID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGRpc3BhdGNoZXIpLCBiZWZvcmUgPSBfYS5iZWZvcmUsIGFmdGVyID0gX2EuYWZ0ZXIsIGpvaW5Qb2ludCA9IF9hLmpvaW5Qb2ludDtcclxuICAgICAgICBpZiAoYmVmb3JlKSB7XHJcbiAgICAgICAgICAgIGFyZ3MgPSBiZWZvcmUucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91c0FyZ3MsIGFkdmljZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRBcmdzID0gYWR2aWNlLmFwcGx5KF90aGlzLCBwcmV2aW91c0FyZ3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRBcmdzIHx8IHByZXZpb3VzQXJncztcclxuICAgICAgICAgICAgfSwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSBqb2luUG9pbnQuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgaWYgKGFmdGVyKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGFmdGVyLnJlZHVjZShmdW5jdGlvbiAocHJldmlvdXNSZXN1bHQsIGFkdmljZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkdmljZS5hcHBseShfdGhpcywgW3ByZXZpb3VzUmVzdWx0XS5jb25jYXQoYXJncykpO1xyXG4gICAgICAgICAgICB9LCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgLyogV2Ugd2FudCB0byBcImNsb25lXCIgdGhlIGFkdmljZSB0aGF0IGhhcyBiZWVuIGFwcGxpZWQgYWxyZWFkeSwgaWYgdGhpc1xyXG4gICAgICogam9pblBvaW50IGlzIGFscmVhZHkgYWR2aXNlZCAqL1xyXG4gICAgaWYgKGRpc3BhdGNoQWR2aWNlTWFwLmhhcyhqb2luUG9pbnQpKSB7XHJcbiAgICAgICAgLy8gY2Fubm90IGhhdmUgdW5kZWZpbmVkIGluIG1hcCBkdWUgdG8gY29kZSBsb2dpYywgdXNpbmcgIVxyXG4gICAgICAgIHZhciBhZHZpY2VNYXAgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoam9pblBvaW50KTtcclxuICAgICAgICB2YXIgYmVmb3JlXzEgPSBhZHZpY2VNYXAuYmVmb3JlLCBhZnRlcl8xID0gYWR2aWNlTWFwLmFmdGVyO1xyXG4gICAgICAgIGlmIChiZWZvcmVfMSkge1xyXG4gICAgICAgICAgICBiZWZvcmVfMSA9IGJlZm9yZV8xLnNsaWNlKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYWZ0ZXJfMSkge1xyXG4gICAgICAgICAgICBhZnRlcl8xID0gYWZ0ZXJfMS5zbGljZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGF0Y2hBZHZpY2VNYXAuc2V0KGRpc3BhdGNoZXIsIHtcclxuICAgICAgICAgICAgam9pblBvaW50OiBhZHZpY2VNYXAuam9pblBvaW50LFxyXG4gICAgICAgICAgICBiZWZvcmU6IGJlZm9yZV8xLFxyXG4gICAgICAgICAgICBhZnRlcjogYWZ0ZXJfMVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGlzcGF0Y2hBZHZpY2VNYXAuc2V0KGRpc3BhdGNoZXIsIHsgam9pblBvaW50OiBqb2luUG9pbnQgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzcGF0Y2hlcjtcclxufVxyXG4vKipcclxuICogQXBwbHkgYWR2aWNlICphZnRlciogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXHJcbiAqXHJcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXHJcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFmdGVyIGFkdmljZVxyXG4gKi9cclxuZnVuY3Rpb24gYWZ0ZXJKb2luUG9pbnQoam9pblBvaW50LCBhZHZpY2UpIHtcclxuICAgIHJldHVybiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCAnYWZ0ZXInLCBhZHZpY2UpO1xyXG59XHJcbi8qKlxyXG4gKiBBdHRhY2hlcyBcImFmdGVyXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXHJcbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdC5cclxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKGV2ZW4gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQpLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxyXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcclxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdFxyXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxyXG4gKi9cclxuZnVuY3Rpb24gYWZ0ZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lLCBhZHZpY2UpIHtcclxuICAgIHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UpO1xyXG59XHJcbmZ1bmN0aW9uIGFmdGVyKGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSkge1xyXG4gICAgaWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiBhZnRlckpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgbWV0aG9kTmFtZU9yQWR2aWNlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhZnRlck9iamVjdChqb2luUG9pbnRPclRhcmdldCwgbWV0aG9kTmFtZU9yQWR2aWNlLCBvYmplY3RBZHZpY2UpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuYWZ0ZXIgPSBhZnRlcjtcclxuLyoqXHJcbiAqIEFwcGx5IGFkdmljZSAqYXJvdW5kKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcclxuICpcclxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cclxuICogQHBhcmFtIGFkdmljZSBUaGUgYXJvdW5kIGFkdmljZVxyXG4gKi9cclxuZnVuY3Rpb24gYXJvdW5kSm9pblBvaW50KGpvaW5Qb2ludCwgYWR2aWNlKSB7XHJcbiAgICByZXR1cm4gYWR2aXNlSm9pblBvaW50KGpvaW5Qb2ludCwgJ2Fyb3VuZCcsIGFkdmljZSk7XHJcbn1cclxuZXhwb3J0cy5hcm91bmRKb2luUG9pbnQgPSBhcm91bmRKb2luUG9pbnQ7XHJcbi8qKlxyXG4gKiBBdHRhY2hlcyBcImFyb3VuZFwiIGFkdmljZSBhcm91bmQgdGhlIG9yaWdpbmFsIG1ldGhvZC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcclxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XHJcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxyXG4gKi9cclxuZnVuY3Rpb24gYXJvdW5kT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSwgYWR2aWNlKSB7XHJcbiAgICB2YXIgZGlzcGF0Y2hlciA9IGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKTtcclxuICAgIHZhciBwcmV2aW91cyA9IGRpc3BhdGNoZXIuYXJvdW5kO1xyXG4gICAgdmFyIGFkdmlzZWQ7XHJcbiAgICBpZiAoYWR2aWNlKSB7XHJcbiAgICAgICAgYWR2aXNlZCA9IGFkdmljZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy5hZHZpY2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2aW91cy5hZHZpY2UodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZGlzcGF0Y2hlci5hcm91bmQgPSB7XHJcbiAgICAgICAgYWR2aWNlOiBmdW5jdGlvbiAodGFyZ2V0LCBhcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhZHZpc2VkID8gYWR2aXNlZC5hcHBseSh0YXJnZXQsIGFyZ3MpIDogcHJldmlvdXMgJiYgcHJldmlvdXMuYWR2aWNlICYmIHByZXZpb3VzLmFkdmljZSh0YXJnZXQsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gbGFuZ18xLmNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWR2aXNlZCA9IGRpc3BhdGNoZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmFyb3VuZE9iamVjdCA9IGFyb3VuZE9iamVjdDtcclxuZnVuY3Rpb24gYXJvdW5kKGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSkge1xyXG4gICAgaWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiBhcm91bmRKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXJvdW5kT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hcm91bmQgPSBhcm91bmQ7XHJcbi8qKlxyXG4gKiBBcHBseSBhZHZpY2UgKmJlZm9yZSogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXHJcbiAqXHJcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXHJcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGJlZm9yZSBhZHZpY2VcclxuICovXHJcbmZ1bmN0aW9uIGJlZm9yZUpvaW5Qb2ludChqb2luUG9pbnQsIGFkdmljZSkge1xyXG4gICAgcmV0dXJuIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsICdiZWZvcmUnLCBhZHZpY2UpO1xyXG59XHJcbmV4cG9ydHMuYmVmb3JlSm9pblBvaW50ID0gYmVmb3JlSm9pblBvaW50O1xyXG4vKipcclxuICogQXR0YWNoZXMgXCJiZWZvcmVcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXHJcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxyXG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgbWF5IHJldHVybiBuZXcgYXJndW1lbnRzXHJcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBiZWZvcmVPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lLCBhZHZpY2UpIHtcclxuICAgIHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYmVmb3JlJywgYWR2aWNlKTtcclxufVxyXG5leHBvcnRzLmJlZm9yZU9iamVjdCA9IGJlZm9yZU9iamVjdDtcclxuZnVuY3Rpb24gYmVmb3JlKGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSkge1xyXG4gICAgaWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiBiZWZvcmVKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYmVmb3JlT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5iZWZvcmUgPSBiZWZvcmU7XHJcbi8qKlxyXG4gKiBBdHRhY2hlcyBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cclxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIG1ldGhvZC5cclxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKnVubGVzcyogaXRzIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXHJcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxyXG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIG1ldGhvZFxyXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxyXG4gKi9cclxuZnVuY3Rpb24gb24odGFyZ2V0LCBtZXRob2ROYW1lLCBhZHZpY2UpIHtcclxuICAgIHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UsIHRydWUpO1xyXG59XHJcbmV4cG9ydHMub24gPSBvbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2FzcGVjdC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9hc3BlY3QuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vc3VwcG9ydC9oYXNcIik7XHJcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCJAZG9qby9zaGltL3N1cHBvcnQvaGFzXCIpLCBleHBvcnRzKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzXzEuZGVmYXVsdDtcclxuaGFzXzEuYWRkKCdvYmplY3QtYXNzaWduJywgdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJywgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnYXJyYXlidWZmZXInLCB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5BcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2Zvcm1kYXRhJywgdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuRm9ybURhdGEgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcclxuaGFzXzEuYWRkKCdmaWxlcmVhZGVyJywgdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xyXG5oYXNfMS5hZGQoJ3hocicsIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XHJcbmhhc18xLmFkZCgneGhyMicsIGhhc18xLmRlZmF1bHQoJ3hocicpICYmICdyZXNwb25zZVR5cGUnIGluIGdsb2JhbF8xLmRlZmF1bHQuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLCB0cnVlKTtcclxuaGFzXzEuYWRkKCdibG9iJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFoYXNfMS5kZWZhdWx0KCd4aHIyJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBnbG9iYWxfMS5kZWZhdWx0LlhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsICdodHRwOi8vd3d3Lmdvb2dsZS5jb20nLCB0cnVlKTtcclxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xyXG4gICAgcmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VUeXBlID09PSAnYmxvYic7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ25vZGUtYnVmZmVyJywgJ0J1ZmZlcicgaW4gZ2xvYmFsXzEuZGVmYXVsdCAmJiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5CdWZmZXIgPT09ICdmdW5jdGlvbicsIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2ZldGNoJywgJ2ZldGNoJyBpbiBnbG9iYWxfMS5kZWZhdWx0ICYmIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LmZldGNoID09PSAnZnVuY3Rpb24nLCB0cnVlKTtcclxuaGFzXzEuYWRkKCd3ZWItd29ya2VyLXhoci11cGxvYWQnLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdC5Xb3JrZXIgIT09IHVuZGVmaW5lZCAmJiBnbG9iYWxfMS5kZWZhdWx0LlVSTCAmJiBnbG9iYWxfMS5kZWZhdWx0LlVSTC5jcmVhdGVPYmplY3RVUkwpIHtcclxuICAgICAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbXCIoZnVuY3Rpb24gKCkge1xcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcXG5cXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XFxuXFx0dHJ5IHtcXG5cXHRcXHR4aHIudXBsb2FkO1xcblxcdFxcdHBvc3RNZXNzYWdlKCd0cnVlJyk7XFxuXFx0fSBjYXRjaCAoZSkge1xcblxcdFxcdHBvc3RNZXNzYWdlKCdmYWxzZScpO1xcblxcdH1cXG59KTtcXG5cXHRcXHR9KSgpXCJdLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KTtcclxuICAgICAgICAgICAgdmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XHJcbiAgICAgICAgICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2EuZGF0YTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0ID09PSAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gSUUxMSBvbiBXaW5vZHdzIDguMSBlbmNvdW50ZXJzIGEgc2VjdXJpdHkgZXJyb3IuXHJcbiAgICAgICAgcmVzb2x2ZShmYWxzZSk7XHJcbiAgICB9XHJcbn0pLCB0cnVlKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2hhcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9oYXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL29iamVjdFwiKTtcclxudmFyIG9iamVjdF8yID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vb2JqZWN0XCIpO1xyXG5leHBvcnRzLmFzc2lnbiA9IG9iamVjdF8yLmFzc2lnbjtcclxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG4vKipcclxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XHJcbiAqIHRvIHdlZWQgb3V0IGhvc3Qgb2JqZWN0cyB0aGF0IGRvIG5vdCBkZXJpdmUgZnJvbSBPYmplY3QuXHJcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjaGVjayBpZiB3ZSB3YW50IHRvIGRlZXAgY29weSBhbiBvYmplY3Qgb3Igbm90LlxyXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxyXG4gKiBjaGFuZ2UgdGhlIHZhbHVlIHJldHVybmVkIGJ5IGB0b1N0cmluZ2AuIFRoaXMgaXMgYSByYXJlIGVkZ2UgY2FzZSB0aGF0IGlzIGRpZmZpY3VsdCB0byBoYW5kbGUsXHJcbiAqIHNvIGl0IGlzIG5vdCBoYW5kbGVkIGhlcmUuXHJcbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqIEByZXR1cm4gICAgICAgSWYgdGhlIHZhbHVlIGlzIGNvZXJjaWJsZSBpbnRvIGFuIE9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcclxufVxyXG5mdW5jdGlvbiBjb3B5QXJyYXkoYXJyYXksIGluaGVyaXRlZCkge1xyXG4gICAgcmV0dXJuIGFycmF5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb3B5QXJyYXkoaXRlbSwgaW5oZXJpdGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICFzaG91bGREZWVwQ29weU9iamVjdChpdGVtKSA/XHJcbiAgICAgICAgICAgIGl0ZW0gOlxyXG4gICAgICAgICAgICBfbWl4aW4oe1xyXG4gICAgICAgICAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluaGVyaXRlZDogaW5oZXJpdGVkLFxyXG4gICAgICAgICAgICAgICAgc291cmNlczogW2l0ZW1dLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB7fVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIF9taXhpbihrd0FyZ3MpIHtcclxuICAgIHZhciBkZWVwID0ga3dBcmdzLmRlZXA7XHJcbiAgICB2YXIgaW5oZXJpdGVkID0ga3dBcmdzLmluaGVyaXRlZDtcclxuICAgIHZhciB0YXJnZXQgPSBrd0FyZ3MudGFyZ2V0O1xyXG4gICAgdmFyIGNvcGllZCA9IGt3QXJncy5jb3BpZWQgfHwgW107XHJcbiAgICB2YXIgY29waWVkQ2xvbmUgPSB0c2xpYl8xLl9fc3ByZWFkKGNvcGllZCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGt3QXJncy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xyXG4gICAgICAgIGlmIChzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29waWVkQ2xvbmUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVlcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvcHlBcnJheSh2YWx1ZSwgaW5oZXJpdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3BpZWQucHVzaChzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IF9taXhpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VzOiBbdmFsdWVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZDogY29waWVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUpIHtcclxuICAgIHZhciBtaXhpbnMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgbWl4aW5zW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgaWYgKCFtaXhpbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xhbmcuY3JlYXRlIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBtaXhpbiBvYmplY3QuJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgYXJncyA9IG1peGlucy5zbGljZSgpO1xyXG4gICAgYXJncy51bnNoaWZ0KE9iamVjdC5jcmVhdGUocHJvdG90eXBlKSk7XHJcbiAgICByZXR1cm4gb2JqZWN0XzEuYXNzaWduLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG59XHJcbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xyXG5mdW5jdGlvbiBkZWVwQXNzaWduKHRhcmdldCkge1xyXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc291cmNlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBfbWl4aW4oe1xyXG4gICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgaW5oZXJpdGVkOiBmYWxzZSxcclxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZXBBc3NpZ24gPSBkZWVwQXNzaWduO1xyXG5mdW5jdGlvbiBkZWVwTWl4aW4odGFyZ2V0KSB7XHJcbiAgICB2YXIgc291cmNlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9taXhpbih7XHJcbiAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IHRydWUsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kZWVwTWl4aW4gPSBkZWVwTWl4aW47XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgcHJvdG90eXBlIGFzIHRoZSBwcm90b3R5cGUgZm9yIHRoZSBuZXcgb2JqZWN0LCBhbmQgdGhlblxyXG4gKiBkZWVwIGNvcGllcyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgdmFsdWVzIGludG8gdGhlIG5ldyB0YXJnZXQuXHJcbiAqXHJcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIG9iamVjdCB0byBkdXBsaWNhdGVcclxuICogQHJldHVybiBUaGUgbmV3IG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gZHVwbGljYXRlKHNvdXJjZSkge1xyXG4gICAgdmFyIHRhcmdldCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHNvdXJjZSkpO1xyXG4gICAgcmV0dXJuIGRlZXBNaXhpbih0YXJnZXQsIHNvdXJjZSk7XHJcbn1cclxuZXhwb3J0cy5kdXBsaWNhdGUgPSBkdXBsaWNhdGU7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBhIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIGIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmVcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lOyBmYWxzZSBvdGhlcndpc2VcclxuICovXHJcbmZ1bmN0aW9uIGlzSWRlbnRpY2FsKGEsIGIpIHtcclxuICAgIHJldHVybiBhID09PSBiIHx8XHJcbiAgICAgICAgLyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xyXG4gICAgICAgIChhICE9PSBhICYmIGIgIT09IGIpO1xyXG59XHJcbmV4cG9ydHMuaXNJZGVudGljYWwgPSBpc0lkZW50aWNhbDtcclxuLyoqXHJcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xyXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cclxuICogQXMgYSByZXN1bHQsIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBgbGF0ZUJpbmRgIHdpbGwgYWx3YXlzIGNhbGwgdGhlIGZ1bmN0aW9uIGN1cnJlbnRseSBhc3NpZ25lZCB0b1xyXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgY29udGV4dCBvYmplY3RcclxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxyXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcclxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGxhdGVCaW5kKGluc3RhbmNlLCBtZXRob2QpIHtcclxuICAgIHZhciBzdXBwbGllZEFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc3VwcGxpZWRBcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGggP1xyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xyXG4gICAgICAgICAgICAvLyBUUzcwMTdcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH0gOlxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gVFM3MDE3XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbn1cclxuZXhwb3J0cy5sYXRlQmluZCA9IGxhdGVCaW5kO1xyXG5mdW5jdGlvbiBtaXhpbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiBmYWxzZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IHRydWUsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5taXhpbiA9IG1peGluO1xyXG4vKipcclxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXHJcbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcclxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxyXG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcGFydGlhbCh0YXJnZXRGdW5jdGlvbikge1xyXG4gICAgdmFyIHN1cHBsaWVkQXJncyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzdXBwbGllZEFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcclxuICAgICAgICByZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMucGFydGlhbCA9IHBhcnRpYWw7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgZGVzdHJveSBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIGNhbGxzIHRoZSBwYXNzZWQtaW4gZGVzdHJ1Y3Rvci5cclxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cclxuICpcclxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxyXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICAgICAgZGVzdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVIYW5kbGUgPSBjcmVhdGVIYW5kbGU7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cclxuICpcclxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXHJcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSgpIHtcclxuICAgIHZhciBoYW5kbGVzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIGhhbmRsZXNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoYW5kbGVzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSA9IGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5mdW5jdGlvbiBpc0ZlYXR1cmVUZXN0VGhlbmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS50aGVuO1xyXG59XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHJlc3VsdHMgb2YgZmVhdHVyZSB0ZXN0c1xyXG4gKi9cclxuZXhwb3J0cy50ZXN0Q2FjaGUgPSB7fTtcclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgdGhlIHVuLXJlc29sdmVkIGZlYXR1cmUgdGVzdHNcclxuICovXHJcbmV4cG9ydHMudGVzdEZ1bmN0aW9ucyA9IHt9O1xyXG4vKipcclxuICogQSBjYWNoZSBvZiB1bnJlc29sdmVkIHRoZW5hYmxlcyAocHJvYmFibHkgcHJvbWlzZXMpXHJcbiAqIEB0eXBlIHt7fX1cclxuICovXHJcbnZhciB0ZXN0VGhlbmFibGVzID0ge307XHJcbi8qKlxyXG4gKiBBIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIHNjb3BlIChgd2luZG93YCBpbiBhIGJyb3dzZXIsIGBnbG9iYWxgIGluIE5vZGVKUylcclxuICovXHJcbnZhciBnbG9iYWxTY29wZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gQnJvd3NlcnNcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBOb2RlXHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIFdlYiB3b3JrZXJzXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHt9O1xyXG59KSgpO1xyXG4vKiBHcmFiIHRoZSBzdGF0aWNGZWF0dXJlcyBpZiB0aGVyZSBhcmUgYXZhaWxhYmxlICovXHJcbnZhciBzdGF0aWNGZWF0dXJlcyA9IChnbG9iYWxTY29wZS5Eb2pvSGFzRW52aXJvbm1lbnQgfHwge30pLnN0YXRpY0ZlYXR1cmVzO1xyXG4vKiBDbGVhbmluZyB1cCB0aGUgRG9qb0hhc0Vudmlvcm5tZW50ICovXHJcbmlmICgnRG9qb0hhc0Vudmlyb25tZW50JyBpbiBnbG9iYWxTY29wZSkge1xyXG4gICAgZGVsZXRlIGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudDtcclxufVxyXG4vKipcclxuICogQ3VzdG9tIHR5cGUgZ3VhcmQgdG8gbmFycm93IHRoZSBgc3RhdGljRmVhdHVyZXNgIHRvIGVpdGhlciBhIG1hcCBvciBhIGZ1bmN0aW9uIHRoYXRcclxuICogcmV0dXJucyBhIG1hcC5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBndWFyZCBmb3JcclxuICovXHJcbmZ1bmN0aW9uIGlzU3RhdGljRmVhdHVyZUZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xyXG59XHJcbi8qKlxyXG4gKiBUaGUgY2FjaGUgb2YgYXNzZXJ0ZWQgZmVhdHVyZXMgdGhhdCB3ZXJlIGF2YWlsYWJsZSBpbiB0aGUgZ2xvYmFsIHNjb3BlIHdoZW4gdGhlXHJcbiAqIG1vZHVsZSBsb2FkZWRcclxuICovXHJcbnZhciBzdGF0aWNDYWNoZSA9IHN0YXRpY0ZlYXR1cmVzXHJcbiAgICA/IGlzU3RhdGljRmVhdHVyZUZ1bmN0aW9uKHN0YXRpY0ZlYXR1cmVzKSA/IHN0YXRpY0ZlYXR1cmVzLmFwcGx5KGdsb2JhbFNjb3BlKSA6IHN0YXRpY0ZlYXR1cmVzXHJcbiAgICA6IHt9Oy8qIFByb3ZpZGluZyBhbiBlbXB0eSBjYWNoZSwgaWYgbm9uZSB3YXMgaW4gdGhlIGVudmlyb25tZW50XHJcblxyXG4vKipcclxuKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxyXG4qXHJcbiogQ29uZGl0aW9uYWwgbG9hZHMgbW9kdWxlcyBiYXNlZCBvbiBhIGhhcyBmZWF0dXJlIHRlc3QgdmFsdWUuXHJcbipcclxuKiBAcGFyYW0gcmVzb3VyY2VJZCBHaXZlcyB0aGUgcmVzb2x2ZWQgbW9kdWxlIGlkIHRvIGxvYWQuXHJcbiogQHBhcmFtIHJlcXVpcmUgVGhlIGxvYWRlciByZXF1aXJlIGZ1bmN0aW9uIHdpdGggcmVzcGVjdCB0byB0aGUgbW9kdWxlIHRoYXQgY29udGFpbmVkIHRoZSBwbHVnaW4gcmVzb3VyY2UgaW4gaXRzXHJcbiogICAgICAgICAgICAgICAgZGVwZW5kZW5jeSBsaXN0LlxyXG4qIEBwYXJhbSBsb2FkIENhbGxiYWNrIHRvIGxvYWRlciB0aGF0IGNvbnN1bWVzIHJlc3VsdCBvZiBwbHVnaW4gZGVtYW5kLlxyXG4qL1xyXG5mdW5jdGlvbiBsb2FkKHJlc291cmNlSWQsIHJlcXVpcmUsIGxvYWQsIGNvbmZpZykge1xyXG4gICAgcmVzb3VyY2VJZCA/IHJlcXVpcmUoW3Jlc291cmNlSWRdLCBsb2FkKSA6IGxvYWQoKTtcclxufVxyXG5leHBvcnRzLmxvYWQgPSBsb2FkO1xyXG4vKipcclxuICogQU1EIHBsdWdpbiBmdW5jdGlvbi5cclxuICpcclxuICogUmVzb2x2ZXMgcmVzb3VyY2VJZCBpbnRvIGEgbW9kdWxlIGlkIGJhc2VkIG9uIHBvc3NpYmx5LW5lc3RlZCB0ZW5hcnkgZXhwcmVzc2lvbiB0aGF0IGJyYW5jaGVzIG9uIGhhcyBmZWF0dXJlIHRlc3RcclxuICogdmFsdWUocykuXHJcbiAqXHJcbiAqIEBwYXJhbSByZXNvdXJjZUlkIFRoZSBpZCBvZiB0aGUgbW9kdWxlXHJcbiAqIEBwYXJhbSBub3JtYWxpemUgUmVzb2x2ZXMgYSByZWxhdGl2ZSBtb2R1bGUgaWQgaW50byBhbiBhYnNvbHV0ZSBtb2R1bGUgaWRcclxuICovXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZShyZXNvdXJjZUlkLCBub3JtYWxpemUpIHtcclxuICAgIHZhciB0b2tlbnMgPSByZXNvdXJjZUlkLm1hdGNoKC9bXFw/Ol18W146XFw/XSovZykgfHwgW107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBmdW5jdGlvbiBnZXQoc2tpcCkge1xyXG4gICAgICAgIHZhciB0ZXJtID0gdG9rZW5zW2krK107XHJcbiAgICAgICAgaWYgKHRlcm0gPT09ICc6Jykge1xyXG4gICAgICAgICAgICAvLyBlbXB0eSBzdHJpbmcgbW9kdWxlIG5hbWUsIHJlc29sdmVzIHRvIG51bGxcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwb3N0Zml4ZWQgd2l0aCBhID8gbWVhbnMgaXQgaXMgYSBmZWF0dXJlIHRvIGJyYW5jaCBvbiwgdGhlIHRlcm0gaXMgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICAgICAgICAgICAgaWYgKHRva2Vuc1tpKytdID09PSAnPycpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc2tpcCAmJiBoYXModGVybSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaGVkIHRoZSBmZWF0dXJlLCBnZXQgdGhlIGZpcnN0IHZhbHVlIGZyb20gdGhlIG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBkaWQgbm90IG1hdGNoLCBnZXQgdGhlIHNlY29uZCB2YWx1ZSwgcGFzc2luZyBvdmVyIHRoZSBmaXJzdFxyXG4gICAgICAgICAgICAgICAgICAgIGdldCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KHNraXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGEgbW9kdWxlXHJcbiAgICAgICAgICAgIHJldHVybiB0ZXJtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBpZCA9IGdldCgpO1xyXG4gICAgcmV0dXJuIGlkICYmIG5vcm1hbGl6ZShpZCk7XHJcbn1cclxuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhIGZlYXR1cmUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkXHJcbiAqXHJcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAqL1xyXG5mdW5jdGlvbiBleGlzdHMoZmVhdHVyZSkge1xyXG4gICAgdmFyIG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIEJvb2xlYW4obm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUgfHwgbm9ybWFsaXplZEZlYXR1cmUgaW4gZXhwb3J0cy50ZXN0Q2FjaGUgfHwgZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXSk7XHJcbn1cclxuZXhwb3J0cy5leGlzdHMgPSBleGlzdHM7XHJcbi8qKlxyXG4gKiBSZWdpc3RlciBhIG5ldyB0ZXN0IGZvciBhIG5hbWVkIGZlYXR1cmUuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGhhcy5hZGQoJ2RvbS1hZGRldmVudGxpc3RlbmVyJywgISFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKTtcclxuICpcclxuICogQGV4YW1wbGVcclxuICogaGFzLmFkZCgndG91Y2gtZXZlbnRzJywgZnVuY3Rpb24gKCkge1xyXG4gKiAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnRcclxuICogfSk7XHJcbiAqXHJcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgcmVwb3J0ZWQgb2YgdGhlIGZlYXR1cmUsIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIG9uY2Ugb24gZmlyc3QgdGVzdFxyXG4gKiBAcGFyYW0gb3ZlcndyaXRlIGlmIGFuIGV4aXN0aW5nIHZhbHVlIHNob3VsZCBiZSBvdmVyd3JpdHRlbi4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGQoZmVhdHVyZSwgdmFsdWUsIG92ZXJ3cml0ZSkge1xyXG4gICAgaWYgKG92ZXJ3cml0ZSA9PT0gdm9pZCAwKSB7IG92ZXJ3cml0ZSA9IGZhbHNlOyB9XHJcbiAgICB2YXIgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoZXhpc3RzKG5vcm1hbGl6ZWRGZWF0dXJlKSAmJiAhb3ZlcndyaXRlICYmICEobm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZlYXR1cmUgXFxcIlwiICsgZmVhdHVyZSArIFwiXFxcIiBleGlzdHMgYW5kIG92ZXJ3cml0ZSBub3QgdHJ1ZS5cIik7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNGZWF0dXJlVGVzdFRoZW5hYmxlKHZhbHVlKSkge1xyXG4gICAgICAgIHRlc3RUaGVuYWJsZXNbZmVhdHVyZV0gPSB2YWx1ZS50aGVuKGZ1bmN0aW9uIChyZXNvbHZlZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMudGVzdENhY2hlW2ZlYXR1cmVdID0gcmVzb2x2ZWRWYWx1ZTtcclxuICAgICAgICAgICAgZGVsZXRlIHRlc3RUaGVuYWJsZXNbZmVhdHVyZV07XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGV4cG9ydHMudGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuYWRkID0gYWRkO1xyXG4vKipcclxuICogUmV0dXJuIHRoZSBjdXJyZW50IHZhbHVlIG9mIGEgbmFtZWQgZmVhdHVyZS5cclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgVGhlIG5hbWUgKGlmIGEgc3RyaW5nKSBvciBpZGVudGlmaWVyIChpZiBhbiBpbnRlZ2VyKSBvZiB0aGUgZmVhdHVyZSB0byB0ZXN0LlxyXG4gKi9cclxuZnVuY3Rpb24gaGFzKGZlYXR1cmUpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICB2YXIgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAobm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUpIHtcclxuICAgICAgICByZXN1bHQgPSBzdGF0aWNDYWNoZVtub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZXhwb3J0cy50ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXS5jYWxsKG51bGwpO1xyXG4gICAgICAgIGRlbGV0ZSBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobm9ybWFsaXplZEZlYXR1cmUgaW4gZXhwb3J0cy50ZXN0Q2FjaGUpIHtcclxuICAgICAgICByZXN1bHQgPSBleHBvcnRzLnRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChmZWF0dXJlIGluIHRlc3RUaGVuYWJsZXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXR0ZW1wdCB0byBkZXRlY3QgdW5yZWdpc3RlcmVkIGhhcyBmZWF0dXJlIFxcXCJcIiArIGZlYXR1cmUgKyBcIlxcXCJcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGhhcztcclxuLypcclxuICogT3V0IG9mIHRoZSBib3ggZmVhdHVyZSB0ZXN0c1xyXG4gKi9cclxuLyogRW52aXJvbm1lbnRzICovXHJcbi8qIFVzZWQgYXMgYSB2YWx1ZSB0byBwcm92aWRlIGEgZGVidWcgb25seSBjb2RlIHBhdGggKi9cclxuYWRkKCdkZWJ1ZycsIHRydWUpO1xyXG4vKiBEZXRlY3RzIGlmIHRoZSBlbnZpcm9ubWVudCBpcyBcImJyb3dzZXIgbGlrZVwiICovXHJcbmFkZCgnaG9zdC1icm93c2VyJywgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbG9jYXRpb24gIT09ICd1bmRlZmluZWQnKTtcclxuLyogRGV0ZWN0cyBpZiB0aGUgZW52aXJvbm1lbnQgYXBwZWFycyB0byBiZSBOb2RlSlMgKi9cclxuYWRkKCdob3N0LW5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcclxuICAgIH1cclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vaGFzL2hhcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vaGFzL2hhcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgb2JqZWN0XzEgPSByZXF1aXJlKFwiLi9vYmplY3RcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbmV4cG9ydHMuTWFwID0gZ2xvYmFsXzEuZGVmYXVsdC5NYXA7XHJcbmlmICghaGFzXzEuZGVmYXVsdCgnZXM2LW1hcCcpKSB7XHJcbiAgICBleHBvcnRzLk1hcCA9IChfYSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTWFwKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdNYXAnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZV8xXzEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFuIGFsdGVybmF0aXZlIHRvIEFycmF5LnByb3RvdHlwZS5pbmRleE9mIHVzaW5nIE9iamVjdC5pc1xyXG4gICAgICAgICAgICAgKiB0byBjaGVjayBmb3IgZXF1YWxpdHkuIFNlZSBodHRwOi8vbXpsLmxhLzF6dUtPMlZcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuX2luZGV4T2ZLZXkgPSBmdW5jdGlvbiAoa2V5cywga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoXzEgPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aF8xOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0XzEuaXMoa2V5c1tpXSwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcInNpemVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLmxlbmd0aCA9IHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuX2tleXMubWFwKGZ1bmN0aW9uIChrZXksIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgX3RoaXMuX3ZhbHVlc1tpXV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodmFsdWVzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5fdmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8yID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGhfMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZXNbaV0sIGtleXNbaV0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiB0aGlzLl92YWx1ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSkgPiAtMTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl9rZXlzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyB0aGlzLl9rZXlzLmxlbmd0aCA6IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tpbmRleF0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX3ZhbHVlcyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVudHJpZXMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hcDtcclxuICAgICAgICB9KCkpLFxyXG4gICAgICAgIF9hW1N5bWJvbC5zcGVjaWVzXSA9IF9hLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLk1hcDtcclxudmFyIF9hO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vTWFwLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvcXVldWVcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbmV4cG9ydHMuU2hpbVByb21pc2UgPSBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2U7XHJcbmV4cG9ydHMuaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcclxufTtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtcHJvbWlzZScpKSB7XHJcbiAgICBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2UgPSBleHBvcnRzLlNoaW1Qcm9taXNlID0gKF9hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBQcm9taXNlLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHBhcmFtIGV4ZWN1dG9yXHJcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgd2hlbiB0aGUgUHJvbWlzZSBpcyBpbnN0YW50aWF0ZWQuIEl0IGlzIHJlc3BvbnNpYmxlIGZvclxyXG4gICAgICAgICAgICAgKiBzdGFydGluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGVuIGl0IGlzIGludm9rZWQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBtdXN0IGNhbGwgZWl0aGVyIHRoZSBwYXNzZWQgYHJlc29sdmVgIGZ1bmN0aW9uIHdoZW4gdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZFxyXG4gICAgICAgICAgICAgKiBzdWNjZXNzZnVsbHksIG9yIHRoZSBgcmVqZWN0YCBmdW5jdGlvbiB3aGVuIHRoZSBvcGVyYXRpb24gZmFpbHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAxIC8qIFBlbmRpbmcgKi87XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnUHJvbWlzZSc7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHRydWUsIHRoZSByZXNvbHV0aW9uIG9mIHRoaXMgcHJvbWlzZSBpcyBjaGFpbmVkIChcImxvY2tlZCBpblwiKSB0byBhbm90aGVyIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBpc0NoYWluZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogV2hldGhlciBvciBub3QgdGhpcyBwcm9taXNlIGlzIGluIGEgcmVzb2x2ZWQgc3RhdGUuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBpc1Jlc29sdmVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovIHx8IGlzQ2hhaW5lZDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkIG9uY2UgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJbml0aWFsbHkgcHVzaGVzIGNhbGxiYWNrcyBvbnRvIGEgcXVldWUgZm9yIGV4ZWN1dGlvbiBvbmNlIHRoaXMgcHJvbWlzZSBzZXR0bGVzLiBBZnRlciB0aGUgcHJvbWlzZSBzZXR0bGVzLFxyXG4gICAgICAgICAgICAgICAgICogZW5xdWV1ZXMgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgZXZlbnQgbG9vcCB0dXJuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgd2hlbkZpbmlzaGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2V0dGxlcyB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBzZXR0bGUgPSBmdW5jdGlvbiAobmV3U3RhdGUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuc3RhdGUgIT09IDEgLyogUGVuZGluZyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnN0YXRlID0gbmV3U3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzb2x2ZWRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoZW5GaW5pc2hlZCA9IHF1ZXVlXzEucXVldWVNaWNyb1Rhc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBlbnF1ZXVlIGEgY2FsbGJhY2sgcnVubmVyIGlmIHRoZXJlIGFyZSBjYWxsYmFja3Mgc28gdGhhdCBpbml0aWFsbHkgZnVsZmlsbGVkIFByb21pc2VzIGRvbid0IGhhdmUgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZV8xLnF1ZXVlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY291bnQgPSBjYWxsYmFja3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3NbaV0uY2FsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIChuZXdTdGF0ZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXNvbHZlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNUaGVuYWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbihzZXR0bGUuYmluZChudWxsLCAwIC8qIEZ1bGZpbGxlZCAqLyksIHNldHRsZS5iaW5kKG51bGwsIDIgLyogUmVqZWN0ZWQgKi8pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGFpbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRsZShuZXdTdGF0ZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuRmluaXNoZWQgaW5pdGlhbGx5IHF1ZXVlcyB1cCBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBhZnRlciB0aGUgcHJvbWlzZSBoYXMgc2V0dGxlZC4gT25jZSB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvbWlzZSBoYXMgc2V0dGxlZCwgd2hlbkZpbmlzaGVkIHdpbGwgc2NoZWR1bGUgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgdHVybiB0aHJvdWdoIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVudCBsb29wLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuRmluaXNoZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gX3RoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8gPyBvblJlamVjdGVkIDogb25GdWxmaWxsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxsYmFjayhfdGhpcy5yZXNvbHZlZFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLnN0YXRlID09PSAyIC8qIFJlamVjdGVkICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KF90aGlzLnJlc29sdmVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShfdGhpcy5yZXNvbHZlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCByZXNvbHZlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlKDIgLyogUmVqZWN0ZWQgKi8sIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBQcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3B1bGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrY29tcGxldGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5pc2goKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3B1bGF0aW5nIHx8IGNvbXBsZXRlIDwgdG90YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NJdGVtKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHBvcnRzLmlzVGhlbmFibGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGFuIGl0ZW0gUHJvbWlzZSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NJdGVtKGksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8yID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzJfMSA9IGl0ZXJhYmxlXzIubmV4dCgpOyAhaXRlcmFibGVfMl8xLmRvbmU7IGl0ZXJhYmxlXzJfMSA9IGl0ZXJhYmxlXzIubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZXJhYmxlXzJfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMl8xICYmICFpdGVyYWJsZV8yXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8yLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZV8yLCBfYTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlO1xyXG4gICAgICAgIH0oKSksXHJcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gZXhwb3J0cy5TaGltUHJvbWlzZSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TaGltUHJvbWlzZTtcclxudmFyIF9hO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vUHJvbWlzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbmV4cG9ydHMuU2V0ID0gZ2xvYmFsXzEuZGVmYXVsdC5TZXQ7XHJcbmlmICghaGFzXzEuZGVmYXVsdCgnZXM2LXNldCcpKSB7XHJcbiAgICBleHBvcnRzLlNldCA9IChfYSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU2V0KGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnU2V0JztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChpdGVyYWJsZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhcyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGEucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGEubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLl9zZXREYXRhLmluZGV4T2YodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fc2V0RGF0YS5tYXAoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBbdmFsdWUsIHZhbHVlXTsgfSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2tmbiwgdGhpc0FyZykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy52YWx1ZXMoKTtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tmbi5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgcmVzdWx0LnZhbHVlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0RGF0YS5pbmRleE9mKHZhbHVlKSA+IC0xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX3NldERhdGEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2V0LnByb3RvdHlwZSwgXCJzaXplXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXREYXRhLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fc2V0RGF0YSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fc2V0RGF0YSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTZXQ7XHJcbiAgICAgICAgfSgpKSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBfYSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TZXQ7XHJcbnZhciBfYTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1NldC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TZXQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvdXRpbFwiKTtcclxuZXhwb3J0cy5TeW1ib2wgPSBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJykpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cclxuICAgICAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAgICAgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3NcclxuICAgICAqL1xyXG4gICAgdmFyIHZhbGlkYXRlU3ltYm9sXzEgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnRpZXNfMSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnR5XzEgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICB2YXIgY3JlYXRlXzEgPSBPYmplY3QuY3JlYXRlO1xyXG4gICAgdmFyIG9ialByb3RvdHlwZV8xID0gT2JqZWN0LnByb3RvdHlwZTtcclxuICAgIHZhciBnbG9iYWxTeW1ib2xzXzEgPSB7fTtcclxuICAgIHZhciBnZXRTeW1ib2xOYW1lXzEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjcmVhdGVkID0gY3JlYXRlXzEobnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXNjKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3N0Zml4ID0gMDtcclxuICAgICAgICAgICAgdmFyIG5hbWU7XHJcbiAgICAgICAgICAgIHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcclxuICAgICAgICAgICAgICAgICsrcG9zdGZpeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcclxuICAgICAgICAgICAgY3JlYXRlZFtkZXNjXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG5hbWUgPSAnQEAnICsgZGVzYztcclxuICAgICAgICAgICAgLy8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXHJcbiAgICAgICAgICAgIC8vIHBpbm5lZCBkb3duLlxyXG4gICAgICAgICAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlXzEsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eV8xKG9ialByb3RvdHlwZV8xLCBuYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHlfMSh0aGlzLCBuYW1lLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICB2YXIgSW50ZXJuYWxTeW1ib2xfMSA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgSW50ZXJuYWxTeW1ib2xfMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLlN5bWJvbCA9IGdsb2JhbF8xLmRlZmF1bHQuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUpO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydGllc18xKHN5bSwge1xyXG4gICAgICAgICAgICBfX2Rlc2NyaXB0aW9uX186IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICBfX25hbWVfXzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lXzEoZGVzY3JpcHRpb24pKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wgZnVuY3Rpb24gd2l0aCB0aGUgYXBwcm9wcmlhdGUgcHJvcGVydGllcyAqL1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbCwgJ2ZvcicsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsU3ltYm9sc18xW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoZ2xvYmFsU3ltYm9sc18xW2tleV0gPSBleHBvcnRzLlN5bWJvbChTdHJpbmcoa2V5KSkpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydGllc18xKGV4cG9ydHMuU3ltYm9sLCB7XHJcbiAgICAgICAga2V5Rm9yOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uIChzeW0pIHtcclxuICAgICAgICAgICAgdmFyIGtleTtcclxuICAgICAgICAgICAgdmFsaWRhdGVTeW1ib2xfMShzeW0pO1xyXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzXzEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSA9PT0gc3ltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGhhc0luc3RhbmNlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpc0NvbmNhdFNwcmVhZGFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpdGVyYXRvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgbWF0Y2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIG9ic2VydmFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgcmVwbGFjZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzZWFyY2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzcGVjaWVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNwbGl0OiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB0b1ByaW1pdGl2ZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdG9TdHJpbmdUYWc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHVuc2NvcGFibGVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgfSk7XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbCksXHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX25hbWVfXztcclxuICAgICAgICB9LCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlLCB7XHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sXzEodGhpcykuX19kZXNjcmlwdGlvbl9fICsgJyknO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHZhbHVlT2Y6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2xfMSh0aGlzKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9QcmltaXRpdmUsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVN5bWJvbF8xKHRoaXMpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbC5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvUHJpbWl0aXZlLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZVtleHBvcnRzLlN5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9TdHJpbmdUYWcsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlW2V4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbn1cclxuLyoqXHJcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XHJcbiAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcclxuICovXHJcbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XHJcbn1cclxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xyXG4vKipcclxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGVtXHJcbiAqL1xyXG5bXHJcbiAgICAnaGFzSW5zdGFuY2UnLFxyXG4gICAgJ2lzQ29uY2F0U3ByZWFkYWJsZScsXHJcbiAgICAnaXRlcmF0b3InLFxyXG4gICAgJ3NwZWNpZXMnLFxyXG4gICAgJ3JlcGxhY2UnLFxyXG4gICAgJ3NlYXJjaCcsXHJcbiAgICAnc3BsaXQnLFxyXG4gICAgJ21hdGNoJyxcclxuICAgICd0b1ByaW1pdGl2ZScsXHJcbiAgICAndG9TdHJpbmdUYWcnLFxyXG4gICAgJ3Vuc2NvcGFibGVzJyxcclxuICAgICdvYnNlcnZhYmxlJ1xyXG5dLmZvckVhY2goZnVuY3Rpb24gKHdlbGxLbm93bikge1xyXG4gICAgaWYgKCFleHBvcnRzLlN5bWJvbFt3ZWxsS25vd25dKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMuU3ltYm9sLCB3ZWxsS25vd24sIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TeW1ib2w7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbmV4cG9ydHMuV2Vha01hcCA9IGdsb2JhbF8xLmRlZmF1bHQuV2Vha01hcDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtd2Vha21hcCcpKSB7XHJcbiAgICB2YXIgREVMRVRFRF8xID0ge307XHJcbiAgICB2YXIgZ2V0VUlEXzEgPSBmdW5jdGlvbiBnZXRVSUQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XHJcbiAgICB9O1xyXG4gICAgdmFyIGdlbmVyYXRlTmFtZV8xID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3RhcnRJZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAlIDEwMDAwMDAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdfX3dtJyArIGdldFVJRF8xKCkgKyAoc3RhcnRJZCsrICsgJ19fJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICBleHBvcnRzLldlYWtNYXAgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gV2Vha01hcChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnV2Vha01hcCc7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX25hbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZ2VuZXJhdGVOYW1lXzEoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoaXRlbVswXSwgaXRlbVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gdHNsaWJfMS5fX3JlYWQoaXRlcmFibGVfMV8xLnZhbHVlLCAyKSwga2V5ID0gX2FbMF0sIHZhbHVlID0gX2FbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9iID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYi5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVfMSwgX2I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLl9nZXRGcm96ZW5FbnRyeUluZGV4ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2Zyb3plbkVudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURURfMSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkudmFsdWUgPSBERUxFVEVEXzE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzLnNwbGljZShmcm96ZW5JbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURURfMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm96ZW5FbnRyaWVzW2Zyb3plbkluZGV4XS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoQm9vbGVhbihlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIHVzZWQgYXMgd2VhayBtYXAga2V5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeSA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogeyB2YWx1ZToga2V5IH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbihrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gV2Vha01hcDtcclxuICAgIH0oKSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5XZWFrTWFwO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBudW1iZXJfMSA9IHJlcXVpcmUoXCIuL251bWJlclwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3V0aWxcIik7XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczYtYXJyYXknKSAmJiBoYXNfMS5kZWZhdWx0KCdlczYtYXJyYXktZmlsbCcpKSB7XHJcbiAgICBleHBvcnRzLmZyb20gPSBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LmZyb207XHJcbiAgICBleHBvcnRzLm9mID0gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5vZjtcclxuICAgIGV4cG9ydHMuY29weVdpdGhpbiA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xyXG4gICAgZXhwb3J0cy5maWxsID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XHJcbiAgICBleHBvcnRzLmZpbmQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5maW5kKTtcclxuICAgIGV4cG9ydHMuZmluZEluZGV4ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXHJcbiAgICAvLyBUbyBtYWtlIHRoaW5ncyBlYXNpZXIsIGlmIHRoZXJlIGlzIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24sIHRoZSB3aG9sZSBzZXQgb2YgZnVuY3Rpb25zIHdpbGwgYmUgZmlsbGVkXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgdmFyIHRvTGVuZ3RoXzEgPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBudW1iZXJfMS5NQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgdG8gY29udmVydFxyXG4gICAgICogQHJldHVybiBBbiBpbnRlZ2VyXHJcbiAgICAgKi9cclxuICAgIHZhciB0b0ludGVnZXJfMSA9IGZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3RcclxuICAgICAqIEByZXR1cm4gSWYgbmVnYXRpdmUsIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIHRoZSBlbmQgKGxlbmd0aCk7IG90aGVyd2lzZSBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSAwXHJcbiAgICAgKi9cclxuICAgIHZhciBub3JtYWxpemVPZmZzZXRfMSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGgubWF4KGxlbmd0aCArIHZhbHVlLCAwKSA6IE1hdGgubWluKHZhbHVlLCBsZW5ndGgpO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZnJvbSA9IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLCBtYXBGdW5jdGlvbiwgdGhpc0FyZykge1xyXG4gICAgICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmcm9tOiByZXF1aXJlcyBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWFwRnVuY3Rpb24gJiYgdGhpc0FyZykge1xyXG4gICAgICAgICAgICBtYXBGdW5jdGlvbiA9IG1hcEZ1bmN0aW9uLmJpbmQodGhpc0FyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMShhcnJheUxpa2UubGVuZ3RoKTtcclxuICAgICAgICAvLyBTdXBwb3J0IGV4dGVuc2lvblxyXG4gICAgICAgIHZhciBhcnJheSA9IHR5cGVvZiBDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcclxuICAgICAgICBpZiAoIWl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXRlcmF0b3JfMS5pc0l0ZXJhYmxlKGFycmF5TGlrZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGFycmF5IGFuZCB0aGUgbm9ybWFsaXplZCBsZW5ndGggaXMgMCwganVzdCByZXR1cm4gYW4gZW1wdHkgYXJyYXkuIHRoaXMgcHJldmVudHMgYSBwcm9ibGVtXHJcbiAgICAgICAgLy8gd2l0aCB0aGUgaXRlcmF0aW9uIG9uIElFIHdoZW4gdXNpbmcgYSBOYU4gYXJyYXkgbGVuZ3RoLlxyXG4gICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGFycmF5TGlrZSkpIHtcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYXJyYXlMaWtlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGFycmF5TGlrZSksIGFycmF5TGlrZV8xXzEgPSBhcnJheUxpa2VfMS5uZXh0KCk7ICFhcnJheUxpa2VfMV8xLmRvbmU7IGFycmF5TGlrZV8xXzEgPSBhcnJheUxpa2VfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJheUxpa2VfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbih2YWx1ZSwgaSkgOiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheUxpa2VfMV8xICYmICFhcnJheUxpa2VfMV8xLmRvbmUgJiYgKF9hID0gYXJyYXlMaWtlXzEucmV0dXJuKSkgX2EuY2FsbChhcnJheUxpa2VfMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFycmF5TGlrZS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhcnJheS5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLm9mID0gZnVuY3Rpb24gb2YoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgaXRlbXNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmNvcHlXaXRoaW4gPSBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldCwgb2Zmc2V0LCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvcHlXaXRoaW46IHRhcmdldCBtdXN0IGJlIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIG9mZnNldCA9IG5vcm1hbGl6ZU9mZnNldF8xKHRvSW50ZWdlcl8xKG9mZnNldCksIGxlbmd0aCk7XHJcbiAgICAgICAgc3RhcnQgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0XzEoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXJfMShlbmQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHZhciBjb3VudCA9IE1hdGgubWluKGVuZCAtIHN0YXJ0LCBsZW5ndGggLSBvZmZzZXQpO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgIGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICBzdGFydCArPSBjb3VudCAtIDE7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBjb3VudCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0W29mZnNldF0gPSB0YXJnZXRbc3RhcnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRhcmdldFtvZmZzZXRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgIHN0YXJ0ICs9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgY291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbGwgPSBmdW5jdGlvbiBmaWxsKHRhcmdldCwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9mZnNldF8xKHRvSW50ZWdlcl8xKHN0YXJ0KSwgbGVuZ3RoKTtcclxuICAgICAgICBlbmQgPSBub3JtYWxpemVPZmZzZXRfMShlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcl8xKGVuZCksIGxlbmd0aCk7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBlbmQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2krK10gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBleHBvcnRzLmZpbmRJbmRleCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKTtcclxuICAgICAgICByZXR1cm4gaW5kZXggIT09IC0xID8gdGFyZ2V0W2luZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbmRJbmRleCA9IGZ1bmN0aW9uIGZpbmRJbmRleCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9O1xyXG59XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczctYXJyYXknKSkge1xyXG4gICAgZXhwb3J0cy5pbmNsdWRlcyA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXHJcbiAgICAgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxyXG4gICAgICovXHJcbiAgICB2YXIgdG9MZW5ndGhfMiA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIG51bWJlcl8xLk1BWF9TQUZFX0lOVEVHRVIpO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0YXJnZXQsIHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xyXG4gICAgICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSAwOyB9XHJcbiAgICAgICAgdmFyIGxlbiA9IHRvTGVuZ3RoXzIodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGZyb21JbmRleDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXHJcbiAgICAgICAgLy8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHdpbmRvdyBpcyBkZWZpbmVkIGluIGJyb3dzZXJzXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbn0pKCk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdsb2JhbE9iamVjdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG52YXIgc3RyaW5nXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdcIik7XHJcbnZhciBzdGF0aWNEb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XHJcbi8qKlxyXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxyXG4gKi9cclxudmFyIFNoaW1JdGVyYXRvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNoaW1JdGVyYXRvcihsaXN0KSB7XHJcbiAgICAgICAgdGhpcy5fbmV4dEluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYgKGlzSXRlcmFibGUobGlzdCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbmF0aXZlSXRlcmF0b3IgPSBsaXN0W1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBuZXh0IGl0ZXJhdGlvbiByZXN1bHQgZm9yIHRoZSBJdGVyYXRvclxyXG4gICAgICovXHJcbiAgICBTaGltSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fbGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcclxuICAgIH07XHJcbiAgICBTaGltSXRlcmF0b3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNoaW1JdGVyYXRvcjtcclxufSgpKTtcclxuZXhwb3J0cy5TaGltSXRlcmF0b3IgPSBTaGltSXRlcmF0b3I7XHJcbi8qKlxyXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBoYXMgYW4gSXRlcmFibGUgaW50ZXJmYWNlXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XHJcbn1cclxuZXhwb3J0cy5pc0l0ZXJhYmxlID0gaXNJdGVyYWJsZTtcclxuLyoqXHJcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGlzIEFycmF5TGlrZVxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcclxufVxyXG5leHBvcnRzLmlzQXJyYXlMaWtlID0gaXNBcnJheUxpa2U7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBmb3IgYW4gb2JqZWN0XHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgaXRlcmFibGUgb2JqZWN0IHRvIHJldHVybiB0aGUgaXRlcmF0b3IgZm9yXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXQoaXRlcmFibGUpIHtcclxuICAgIGlmIChpc0l0ZXJhYmxlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgIHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5nZXQgPSBnZXQ7XHJcbi8qKlxyXG4gKiBTaGltcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiBgZm9yIC4uLiBvZmAgYmxvY2tzXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgb2JqZWN0IHRoZSBwcm92aWRlcyBhbiBpbnRlcmF0b3IgaW50ZXJmYWNlXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSBvZiB0aGUgaXRlcmFibGVcclxuICogQHBhcmFtIHRoaXNBcmcgT3B0aW9uYWwgc2NvcGUgdG8gcGFzcyB0aGUgY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIGZvck9mKGl0ZXJhYmxlLCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgdmFyIGJyb2tlbiA9IGZhbHNlO1xyXG4gICAgZnVuY3Rpb24gZG9CcmVhaygpIHtcclxuICAgICAgICBicm9rZW4gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cclxuICAgIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHZhciBsID0gaXRlcmFibGUubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGFyID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICAgIGlmIChpICsgMSA8IGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPj0gc3RyaW5nXzEuSElHSF9TVVJST0dBVEVfTUlOICYmIGNvZGUgPD0gc3RyaW5nXzEuSElHSF9TVVJST0dBVEVfTUFYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhciArPSBpdGVyYWJsZVsrK2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY2hhciwgaXRlcmFibGUsIGRvQnJlYWspO1xyXG4gICAgICAgICAgICBpZiAoYnJva2VuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xyXG4gICAgICAgIGlmIChpdGVyYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJyb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLmZvck9mID0gZm9yT2Y7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbi8qKlxyXG4gKiBUaGUgc21hbGxlc3QgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcmVwcmVzZW50YWJsZSBudW1iZXJzLlxyXG4gKi9cclxuZXhwb3J0cy5FUFNJTE9OID0gMTtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XHJcbiAqL1xyXG5leHBvcnRzLk1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcclxuICovXHJcbmV4cG9ydHMuTUlOX1NBRkVfSU5URUdFUiA9IC1leHBvcnRzLk1BWF9TQUZFX0lOVEVHRVI7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBOYU4gd2l0aG91dCBjb2Vyc2lvbi5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgTmFOLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWxfMS5kZWZhdWx0LmlzTmFOKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzTmFOID0gaXNOYU47XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXIgd2l0aG91dCBjb2Vyc2lvbi5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgZmluaXRlLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWxfMS5kZWZhdWx0LmlzRmluaXRlKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzRmluaXRlID0gaXNGaW5pdGU7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XHJcbn1cclxuZXhwb3J0cy5pc0ludGVnZXIgPSBpc0ludGVnZXI7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxyXG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcclxuICogICAyLiBpdCBoYXMgYSBvbmUtdG8tb25lIG1hcHBpbmcgdG8gYSBtYXRoZW1hdGljYWwgaW50ZWdlciwgbWVhbmluZyBpdHNcclxuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiBNYXRoLmFicyh2YWx1ZSkgPD0gZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSO1xyXG59XHJcbmV4cG9ydHMuaXNTYWZlSW50ZWdlciA9IGlzU2FmZUludGVnZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1vYmplY3QnKSkge1xyXG4gICAgdmFyIGdsb2JhbE9iamVjdCA9IGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbiAgICBleHBvcnRzLmlzID0gZ2xvYmFsT2JqZWN0LmlzO1xyXG4gICAgZXhwb3J0cy5rZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuICAgICAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5rZXlzKG5leHRTb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKG5leHRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0bztcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKSB7XHJcbiAgICAgICAgaWYgKFN5bWJvbF8xLmlzU3ltYm9sKHByb3ApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIEJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBTeW1ib2wuZm9yKGtleS5zdWJzdHJpbmcoMikpOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmlzID0gZnVuY3Rpb24gaXModmFsdWUxLCB2YWx1ZTIpIHtcclxuICAgICAgICBpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXMyMDE3LW9iamVjdCcpKSB7XHJcbiAgICB2YXIgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3Q7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcclxuICAgIGV4cG9ydHMuZW50cmllcyA9IGdsb2JhbE9iamVjdC5lbnRyaWVzO1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBnbG9iYWxPYmplY3QudmFsdWVzO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZpb3VzLCBrZXkpIHtcclxuICAgICAgICAgICAgcHJldmlvdXNba2V5XSA9IGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIGtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmV2aW91cztcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5lbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMua2V5cyhvKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gW2tleSwgb1trZXldXTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobykge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLmtleXMobykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG9ba2V5XTsgfSk7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC91dGlsXCIpO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTiA9IDB4ZDgwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NQVggPSAweGRiZmY7XHJcbi8qKlxyXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkxPV19TVVJST0dBVEVfTUFYID0gMHhkZmZmO1xyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM2LXN0cmluZycpICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zdHJpbmctcmF3JykpIHtcclxuICAgIGV4cG9ydHMuZnJvbUNvZGVQb2ludCA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XHJcbiAgICBleHBvcnRzLnJhdyA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnJhdztcclxuICAgIGV4cG9ydHMuY29kZVBvaW50QXQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQpO1xyXG4gICAgZXhwb3J0cy5lbmRzV2l0aCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCk7XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcclxuICAgIGV4cG9ydHMubm9ybWFsaXplID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLm5vcm1hbGl6ZSk7XHJcbiAgICBleHBvcnRzLnJlcGVhdCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpO1xyXG4gICAgZXhwb3J0cy5zdGFydHNXaXRoID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBWYWxpZGF0ZXMgdGhhdCB0ZXh0IGlzIGRlZmluZWQsIGFuZCBub3JtYWxpemVzIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgZ2l2ZW4gZGVmYXVsdCBpZiB0aGUgaW5wdXQgaXMgTmFOKS5cclxuICAgICAqIFVzZWQgYnkgc3RhcnRzV2l0aCwgaW5jbHVkZXMsIGFuZCBlbmRzV2l0aC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIE5vcm1hbGl6ZWQgcG9zaXRpb24uXHJcbiAgICAgKi9cclxuICAgIHZhciBub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEgPSBmdW5jdGlvbiAobmFtZSwgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiwgaXNFbmQpIHtcclxuICAgICAgICBpZiAoaXNFbmQgPT09IHZvaWQgMCkgeyBpc0VuZCA9IGZhbHNlOyB9XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuJyArIG5hbWUgKyAnIHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nIHRvIHNlYXJjaCBhZ2FpbnN0LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xyXG4gICAgICAgIHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5mcm9tQ29kZVBvaW50ID0gZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcclxuICAgICAgICB2YXIgY29kZVBvaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGNvZGVQb2ludHNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5mcm9tQ29kZVBvaW50XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcclxuICAgICAgICB2YXIgTUFYX1NJWkUgPSAweDQwMDA7XHJcbiAgICAgICAgdmFyIGNvZGVVbml0cyA9IFtdO1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAvLyBDb2RlIHBvaW50cyBtdXN0IGJlIGZpbml0ZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHZhbGlkIHJhbmdlXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gaXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29kZVBvaW50IDw9IDB4ZmZmZikge1xyXG4gICAgICAgICAgICAgICAgLy8gQk1QIGNvZGUgcG9pbnRcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXHJcbiAgICAgICAgICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcclxuICAgICAgICAgICAgICAgIHZhciBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBleHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTjtcclxuICAgICAgICAgICAgICAgIHZhciBsb3dTdXJyb2dhdGUgPSBjb2RlUG9pbnQgJSAweDQwMCArIGV4cG9ydHMuTE9XX1NVUlJPR0FURV9NSU47XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5yYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGUpIHtcclxuICAgICAgICB2YXIgc3Vic3RpdHV0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYXdTdHJpbmdzID0gY2FsbFNpdGUucmF3O1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB2YXIgbnVtU3Vic3RpdHV0aW9ucyA9IHN1YnN0aXR1dGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIGlmIChjYWxsU2l0ZSA9PSBudWxsIHx8IGNhbGxTaXRlLnJhdyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yYXcgcmVxdWlyZXMgYSB2YWxpZCBjYWxsU2l0ZSBvYmplY3Qgd2l0aCBhIHJhdyB2YWx1ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoXzEgPSByYXdTdHJpbmdzLmxlbmd0aDsgaSA8IGxlbmd0aF8xOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHJhd1N0cmluZ3NbaV0gKyAoaSA8IG51bVN1YnN0aXR1dGlvbnMgJiYgaSA8IGxlbmd0aF8xIC0gMSA/IHN1YnN0aXR1dGlvbnNbaV0gOiAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5jb2RlUG9pbnRBdCA9IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHRleHQsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5jb2RlUG9pbnRBdCByZXF1cmllcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiAhPT0gcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxyXG4gICAgICAgIHZhciBmaXJzdCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbik7XHJcbiAgICAgICAgaWYgKGZpcnN0ID49IGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUFYICYmIGxlbmd0aCA+IHBvc2l0aW9uICsgMSkge1xyXG4gICAgICAgICAgICAvLyBTdGFydCBvZiBhIHN1cnJvZ2F0ZSBwYWlyIChoaWdoIHN1cnJvZ2F0ZSBhbmQgdGhlcmUgaXMgYSBuZXh0IGNvZGUgdW5pdCk7IGNoZWNrIGZvciBsb3cgc3Vycm9nYXRlXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxyXG4gICAgICAgICAgICB2YXIgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XHJcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiAmJiBzZWNvbmQgPD0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01BWCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChmaXJzdCAtIGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiArIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKGVuZFBvc2l0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgZW5kUG9zaXRpb24gPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBlbmRQb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHZhciBzdGFydCA9IGVuZFBvc2l0aW9uIC0gc2VhcmNoLmxlbmd0aDtcclxuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGV4dCwgc2VhcmNoLCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gMDsgfVxyXG4gICAgICAgIF9hID0gdHNsaWJfMS5fX3JlYWQobm9ybWFsaXplU3Vic3RyaW5nQXJnc18xKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pLCAzKSwgdGV4dCA9IF9hWzBdLCBzZWFyY2ggPSBfYVsxXSwgcG9zaXRpb24gPSBfYVsyXTtcclxuICAgICAgICByZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodGV4dCwgY291bnQpIHtcclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IDA7IH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5yZXBlYXRcclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3VudCAhPT0gY291bnQpIHtcclxuICAgICAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY291bnQgPCAwIHx8IGNvdW50ID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAoY291bnQpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ICUgMikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvdW50ID4+PSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dCwgc2VhcmNoLCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gMDsgfVxyXG4gICAgICAgIHNlYXJjaCA9IFN0cmluZyhzZWFyY2gpO1xyXG4gICAgICAgIF9hID0gdHNsaWJfMS5fX3JlYWQobm9ybWFsaXplU3Vic3RyaW5nQXJnc18xKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBwb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHZhciBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICB9O1xyXG59XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczIwMTctc3RyaW5nJykpIHtcclxuICAgIGV4cG9ydHMucGFkRW5kID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnBhZEVuZCk7XHJcbiAgICBleHBvcnRzLnBhZFN0YXJ0ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnBhZFN0YXJ0KTtcclxufVxyXG5lbHNlIHtcclxuICAgIGV4cG9ydHMucGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZykge1xyXG4gICAgICAgIGlmIChmaWxsU3RyaW5nID09PSB2b2lkIDApIHsgZmlsbFN0cmluZyA9ICcgJzsgfVxyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZEVuZCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWRkaW5nID4gMCkge1xyXG4gICAgICAgICAgICBzdHJUZXh0ICs9XHJcbiAgICAgICAgICAgICAgICBleHBvcnRzLnJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJUZXh0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMucGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcpIHtcclxuICAgICAgICBpZiAoZmlsbFN0cmluZyA9PT0gdm9pZCAwKSB7IGZpbGxTdHJpbmcgPSAnICc7IH1cclxuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWRkaW5nID4gMCkge1xyXG4gICAgICAgICAgICBzdHJUZXh0ID1cclxuICAgICAgICAgICAgICAgIGV4cG9ydHMucmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyVGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3RyaW5nLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiQGRvam8vaGFzL2hhc1wiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4uL2dsb2JhbFwiKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzXzEuZGVmYXVsdDtcclxudHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZShcIkBkb2pvL2hhcy9oYXNcIiksIGV4cG9ydHMpO1xyXG4vKiBFQ01BU2NyaXB0IDYgYW5kIDcgRmVhdHVyZXMgKi9cclxuLyogQXJyYXkgKi9cclxuaGFzXzEuYWRkKCdlczYtYXJyYXknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFsnZnJvbScsICdvZiddLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGtleSBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5OyB9KSAmJlxyXG4gICAgICAgIFsnZmluZEluZGV4JywgJ2ZpbmQnLCAnY29weVdpdGhpbiddLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGtleSBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZTsgfSkpO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczYtYXJyYXktZmlsbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgnZmlsbCcgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUpIHtcclxuICAgICAgICAvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gWzFdLmZpbGwoOSwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKVswXSA9PT0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM3LWFycmF5JywgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2luY2x1ZGVzJyBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZTsgfSwgdHJ1ZSk7XHJcbi8qIE1hcCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuTWFwID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLypcclxuICAgIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcclxuICAgIFdlIHdyYXAgdGhpcyBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIHNvbWV0aW1lcyB0aGUgTWFwIGNvbnN0cnVjdG9yIGV4aXN0cywgYnV0IGRvZXMgbm90XHJcbiAgICB0YWtlIGFyZ3VtZW50cyAoaU9TIDguNClcclxuICAgICAqL1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5NYXAoW1swLCAxXV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gKG1hcC5oYXMoMCkgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC5lbnRyaWVzID09PSAnZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCB0ZXN0aW5nIG9uIGlPUyBhdCB0aGUgbW9tZW50ICovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBNYXRoICovXHJcbmhhc18xLmFkZCgnZXM2LW1hdGgnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgICdjbHozMicsXHJcbiAgICAgICAgJ3NpZ24nLFxyXG4gICAgICAgICdsb2cxMCcsXHJcbiAgICAgICAgJ2xvZzInLFxyXG4gICAgICAgICdsb2cxcCcsXHJcbiAgICAgICAgJ2V4cG0xJyxcclxuICAgICAgICAnY29zaCcsXHJcbiAgICAgICAgJ3NpbmgnLFxyXG4gICAgICAgICd0YW5oJyxcclxuICAgICAgICAnYWNvc2gnLFxyXG4gICAgICAgICdhc2luaCcsXHJcbiAgICAgICAgJ2F0YW5oJyxcclxuICAgICAgICAndHJ1bmMnLFxyXG4gICAgICAgICdmcm91bmQnLFxyXG4gICAgICAgICdjYnJ0JyxcclxuICAgICAgICAnaHlwb3QnXHJcbiAgICBdLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5NYXRoW25hbWVdID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LW1hdGgtaW11bCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgnaW11bCcgaW4gZ2xvYmFsXzEuZGVmYXVsdC5NYXRoKSB7XHJcbiAgICAgICAgLyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgb24gaW9zIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xyXG4gICAgICAgIHJldHVybiBNYXRoLmltdWwoMHhmZmZmZmZmZiwgNSkgPT09IC01O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogT2JqZWN0ICovXHJcbmhhc18xLmFkZCgnZXM2LW9iamVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpICYmXHJcbiAgICAgICAgWydhc3NpZ24nLCAnaXMnLCAnZ2V0T3duUHJvcGVydHlTeW1ib2xzJywgJ3NldFByb3RvdHlwZU9mJ10uZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJzsgfSkpO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczIwMTctb2JqZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFsndmFsdWVzJywgJ2VudHJpZXMnLCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyddLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbic7IH0pO1xyXG59LCB0cnVlKTtcclxuLyogT2JzZXJ2YWJsZSAqL1xyXG5oYXNfMS5hZGQoJ2VzLW9ic2VydmFibGUnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYnNlcnZhYmxlICE9PSAndW5kZWZpbmVkJzsgfSwgdHJ1ZSk7XHJcbi8qIFByb21pc2UgKi9cclxuaGFzXzEuYWRkKCdlczYtcHJvbWlzZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKTsgfSwgdHJ1ZSk7XHJcbi8qIFNldCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1zZXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBTZXQgZnVuY3Rpb25hbGl0eSAqL1xyXG4gICAgICAgIHZhciBzZXQgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5TZXQoWzFdKTtcclxuICAgICAgICByZXR1cm4gc2V0LmhhcygxKSAmJiAna2V5cycgaW4gc2V0ICYmIHR5cGVvZiBzZXQua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBTdHJpbmcgKi9cclxuaGFzXzEuYWRkKCdlczYtc3RyaW5nJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChbXHJcbiAgICAgICAgLyogc3RhdGljIG1ldGhvZHMgKi9cclxuICAgICAgICAnZnJvbUNvZGVQb2ludCdcclxuICAgIF0uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nW2tleV0gPT09ICdmdW5jdGlvbic7IH0pICYmXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAvKiBpbnN0YW5jZSBtZXRob2RzICovXHJcbiAgICAgICAgICAgICdjb2RlUG9pbnRBdCcsXHJcbiAgICAgICAgICAgICdub3JtYWxpemUnLFxyXG4gICAgICAgICAgICAncmVwZWF0JyxcclxuICAgICAgICAgICAgJ3N0YXJ0c1dpdGgnLFxyXG4gICAgICAgICAgICAnZW5kc1dpdGgnLFxyXG4gICAgICAgICAgICAnaW5jbHVkZXMnXHJcbiAgICAgICAgXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbic7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LXN0cmluZy1yYXcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZSkge1xyXG4gICAgICAgIHZhciBzdWJzdGl0dXRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRzbGliXzEuX19zcHJlYWQoY2FsbFNpdGUpO1xyXG4gICAgICAgIHJlc3VsdC5yYXcgPSBjYWxsU2l0ZS5yYXc7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGlmICgncmF3JyBpbiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZykge1xyXG4gICAgICAgIHZhciBiID0gMTtcclxuICAgICAgICB2YXIgY2FsbFNpdGUgPSBnZXRDYWxsU2l0ZSh0ZW1wbGF0ZU9iamVjdF8xIHx8ICh0ZW1wbGF0ZU9iamVjdF8xID0gdHNsaWJfMS5fX21ha2VUZW1wbGF0ZU9iamVjdChbXCJhXFxuXCIsIFwiXCJdLCBbXCJhXFxcXG5cIiwgXCJcIl0pKSwgYik7XHJcbiAgICAgICAgY2FsbFNpdGUucmF3ID0gWydhXFxcXG4nXTtcclxuICAgICAgICB2YXIgc3VwcG9ydHNUcnVuYyA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzVHJ1bmM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzMjAxNy1zdHJpbmcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbic7IH0pO1xyXG59LCB0cnVlKTtcclxuLyogU3ltYm9sICovXHJcbmhhc18xLmFkZCgnZXM2LXN5bWJvbCcsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJzsgfSwgdHJ1ZSk7XHJcbi8qIFdlYWtNYXAgKi9cclxuaGFzXzEuYWRkKCdlczYtd2Vha21hcCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHkgKi9cclxuICAgICAgICB2YXIga2V5MSA9IHt9O1xyXG4gICAgICAgIHZhciBrZXkyID0ge307XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBnbG9iYWxfMS5kZWZhdWx0LldlYWtNYXAoW1trZXkxLCAxXV0pO1xyXG4gICAgICAgIE9iamVjdC5mcmVlemUoa2V5MSk7XHJcbiAgICAgICAgcmV0dXJuIG1hcC5nZXQoa2V5MSkgPT09IDEgJiYgbWFwLnNldChrZXkyLCAyKSA9PT0gbWFwICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE1pc2NlbGxhbmVvdXMgZmVhdHVyZXMgKi9cclxuaGFzXzEuYWRkKCdtaWNyb3Rhc2tzJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gaGFzXzEuZGVmYXVsdCgnZXM2LXByb21pc2UnKSB8fCBoYXNfMS5kZWZhdWx0KCdob3N0LW5vZGUnKSB8fCBoYXNfMS5kZWZhdWx0KCdkb20tbXV0YXRpb25vYnNlcnZlcicpOyB9LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdwb3N0bWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIElmIHdpbmRvdyBpcyB1bmRlZmluZWQsIGFuZCB3ZSBoYXZlIHBvc3RNZXNzYWdlLCBpdCBwcm9iYWJseSBtZWFucyB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIuIFdlYiB3b3JrZXJzIGhhdmVcclxuICAgIC8vIHBvc3QgbWVzc2FnZSBidXQgaXQgZG9lc24ndCB3b3JrIGhvdyB3ZSBleHBlY3QgaXQgdG8sIHNvIGl0J3MgYmVzdCBqdXN0IHRvIHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cclxuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC53aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdyYWYnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbic7IH0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ3NldGltbWVkaWF0ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LnNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCc7IH0sIHRydWUpO1xyXG4vKiBET00gRmVhdHVyZXMgKi9cclxuaGFzXzEuYWRkKCdkb20tbXV0YXRpb25vYnNlcnZlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdob3N0LWJyb3dzZXInKSAmJiBCb29sZWFuKGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIpKSB7XHJcbiAgICAgICAgLy8gSUUxMSBoYXMgYW4gdW5yZWxpYWJsZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIHdoZXJlIHNldFByb3BlcnR5KCkgZG9lcyBub3RcclxuICAgICAgICAvLyBnZW5lcmF0ZSBhIG11dGF0aW9uIGV2ZW50LCBvYnNlcnZlcnMgY2FuIGNyYXNoLCBhbmQgdGhlIHF1ZXVlIGRvZXMgbm90IGRyYWluXHJcbiAgICAgICAgLy8gcmVsaWFibHkuIFRoZSBmb2xsb3dpbmcgZmVhdHVyZSB0ZXN0IHdhcyBhZGFwdGVkIGZyb21cclxuICAgICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90MTBrby80YWNlYjhjNzE2ODFmZGIyNzVlMzNlZmU1ZTU3NmIxNFxyXG4gICAgICAgIHZhciBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICB2YXIgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxfMS5kZWZhdWx0Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsXzEuZGVmYXVsdC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGV4YW1wbGUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbihvYnNlcnZlci50YWtlUmVjb3JkcygpLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG52YXIgdGVtcGxhdGVPYmplY3RfMTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL2hhc1wiKTtcclxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbSkge1xyXG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaXRlbS5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChkZXN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbnZhciBjaGVja01pY3JvVGFza1F1ZXVlO1xyXG52YXIgbWljcm9UYXNrcztcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydHMucXVldWVUYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkZXN0cnVjdG9yO1xyXG4gICAgdmFyIGVucXVldWU7XHJcbiAgICAvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgncG9zdG1lc3NhZ2UnKSkge1xyXG4gICAgICAgIHZhciBxdWV1ZV8xID0gW107XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsXzEuZGVmYXVsdCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVldWVfMS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhxdWV1ZV8xLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlXzEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGFzXzEuZGVmYXVsdCgnc2V0aW1tZWRpYXRlJykpIHtcclxuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsXzEuZGVmYXVsdC5jbGVhckltbWVkaWF0ZTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbF8xLmRlZmF1bHQuY2xlYXJUaW1lb3V0O1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpZCA9IGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IgJiZcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcihpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZVRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZVRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8vIFdoZW4gbm8gbWVjaGFuaXNtIGZvciByZWdpc3RlcmluZyBtaWNyb3Rhc2tzIGlzIGV4cG9zZWQgYnkgdGhlIGVudmlyb25tZW50LCBtaWNyb3Rhc2tzIHdpbGxcclxuLy8gYmUgcXVldWVkIGFuZCB0aGVuIGV4ZWN1dGVkIGluIGEgc2luZ2xlIG1hY3JvdGFzayBiZWZvcmUgdGhlIG90aGVyIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkLlxyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ21pY3JvdGFza3MnKSkge1xyXG4gICAgdmFyIGlzTWljcm9UYXNrUXVldWVkXzEgPSBmYWxzZTtcclxuICAgIG1pY3JvVGFza3MgPSBbXTtcclxuICAgIGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFpc01pY3JvVGFza1F1ZXVlZF8xKSB7XHJcbiAgICAgICAgICAgIGlzTWljcm9UYXNrUXVldWVkXzEgPSB0cnVlO1xyXG4gICAgICAgICAgICBleHBvcnRzLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZF8xID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogU2NoZWR1bGVzIGFuIGFuaW1hdGlvbiB0YXNrIHdpdGggYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGl0IGV4aXN0cywgb3Igd2l0aCBgcXVldWVUYXNrYCBvdGhlcndpc2UuXHJcbiAqXHJcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXHJcbiAqIEhvd2V2ZXIsIGF0IHRpbWVzIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gZGVsZWdhdGUgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lOyBoZW5jZSB0aGUgZm9sbG93aW5nIG1ldGhvZC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFoYXNfMS5kZWZhdWx0KCdyYWYnKSkge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLnF1ZXVlVGFzaztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZUFuaW1hdGlvblRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxyXG4gKlxyXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXHJcbiAqIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtYWNyb3Rhc2tzIGlzIGV4cG9zZWQsIHRoZW4gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGZpcmVkIGJlZm9yZSBhbnkgbWFjcm90YXNrXHJcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZU1pY3JvVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZW5xdWV1ZTtcclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdob3N0LW5vZGUnKSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykpIHtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJykpIHtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICAgICAgdmFyIG5vZGVfMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZhciBxdWV1ZV8yID0gW107XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHF1ZXVlXzIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBxdWV1ZV8yLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGVfMSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBxdWV1ZV8yLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIG5vZGVfMS5zZXRBdHRyaWJ1dGUoJ3F1ZXVlU3RhdHVzJywgJzEnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgbWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xyXG4gICAgfTtcclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvcXVldWUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXHJcbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcclxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXHJcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcclxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSwgZW51bWVyYWJsZSwgd3JpdGFibGUsIGNvbmZpZ3VyYWJsZSkge1xyXG4gICAgaWYgKGVudW1lcmFibGUgPT09IHZvaWQgMCkgeyBlbnVtZXJhYmxlID0gZmFsc2U7IH1cclxuICAgIGlmICh3cml0YWJsZSA9PT0gdm9pZCAwKSB7IHdyaXRhYmxlID0gdHJ1ZTsgfVxyXG4gICAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYWJsZSA9IHRydWU7IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGVudW1lcmFibGUsXHJcbiAgICAgICAgd3JpdGFibGU6IHdyaXRhYmxlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZ2V0VmFsdWVEZXNjcmlwdG9yID0gZ2V0VmFsdWVEZXNjcmlwdG9yO1xyXG5mdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMud3JhcE5hdGl2ZSA9IHdyYXBOYXRpdmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG5yZXF1aXJlKFwicGVwanNcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG52YXIgbGFuZ18xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvbGFuZ1wiKTtcclxudmFyIG9iamVjdF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vb2JqZWN0XCIpO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2VcIik7XHJcbnZhciBhZnRlclJlbmRlcl8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXJcIik7XHJcbnZhciBQcm9qZWN0b3JfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yXCIpO1xyXG52YXIgYXNzZXJ0UmVuZGVyXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2Fzc2VydFJlbmRlclwiKTtcclxudmFyIGNhbGxMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9jYWxsTGlzdGVuZXJcIik7XHJcbnZhciBzZW5kRXZlbnRfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvc2VuZEV2ZW50XCIpO1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTp2YXJpYWJsZS1uYW1lICovXHJcbnZhciBST09UX0NVU1RPTV9FTEVNRU5UX05BTUUgPSAndGVzdC0taGFybmVzcyc7XHJcbnZhciBXSURHRVRfU1RVQl9DVVNUT01fRUxFTUVOVCA9ICd0ZXN0LS13aWRnZXQtc3R1Yic7XHJcbnZhciBXSURHRVRfU1RVQl9OQU1FX1BST1BFUlRZID0gJ2RhdGEtLXdpZGdldC1uYW1lJztcclxudmFyIGhhcm5lc3NJZCA9IDA7XHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBmdW5jdGlvbiB3aGljaCBmaW5kcyBhIEROb2RlIGJhc2Ugb24gYSBga2V5YFxyXG4gKiBAcGFyYW0gdGFyZ2V0IHRoZSByb290IEROb2RlIHRvIHNlYXJjaFxyXG4gKiBAcGFyYW0ga2V5IHRoZSBrZXkgdG8gbWF0Y2hcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRETm9kZUJ5S2V5KHRhcmdldCwga2V5KSB7XHJcbiAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcclxuICAgICAgICB2YXIgZm91bmRfMTtcclxuICAgICAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoZm91bmRfMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbmRETm9kZUJ5S2V5KG5vZGUsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEdXBsaWNhdGUga2V5IG9mIFxcXCJcIiArIGtleSArIFwiXFxcIiBmb3VuZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZF8xID0gZmluZEROb2RlQnlLZXkobm9kZSwga2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmb3VuZF8xO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0LnByb3BlcnRpZXMgJiYgdGFyZ2V0LnByb3BlcnRpZXMua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZpbmRETm9kZUJ5S2V5KHRhcmdldC5jaGlsZHJlbiwga2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5maW5kRE5vZGVCeUtleSA9IGZpbmRETm9kZUJ5S2V5O1xyXG4vKipcclxuICogRGVjb3JhdGUgYSBgRE5vZGVgIHdoZXJlIGFueSBgV05vZGVgcyBhcmUgcmVwbGFjZWQgd2l0aCBzdHViYmVkIHdpZGdldHNcclxuICogQHBhcmFtIHRhcmdldCBUaGUgYEROb2RlYCB0byBkZWNvcmF0ZSB3aXRoIHN0dWJiZWQgd2lkZ2V0c1xyXG4gKi9cclxuZnVuY3Rpb24gc3R1YlJlbmRlcih0YXJnZXQpIHtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvcmF0ZVRhcmdldChub2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkZWNvcmF0ZVRhcmdldCh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZnVuY3Rpb24gZGVjb3JhdGVUYXJnZXQodGFyZ2V0KSB7XHJcbiAgICBkXzEuZGVjb3JhdGUodGFyZ2V0LCBmdW5jdGlvbiAoZE5vZGUpIHtcclxuICAgICAgICB2YXIgd2lkZ2V0Q29uc3RydWN0b3IgPSBkTm9kZS53aWRnZXRDb25zdHJ1Y3RvciwgcHJvcGVydGllcyA9IGROb2RlLnByb3BlcnRpZXM7XHJcbiAgICAgICAgZE5vZGUud2lkZ2V0Q29uc3RydWN0b3IgPSBTdHViV2lkZ2V0O1xyXG4gICAgICAgIHByb3BlcnRpZXMuX3N0dWJUYWcgPSBXSURHRVRfU1RVQl9DVVNUT01fRUxFTUVOVDtcclxuICAgICAgICBwcm9wZXJ0aWVzLl93aWRnZXROYW1lID1cclxuICAgICAgICAgICAgdHlwZW9mIHdpZGdldENvbnN0cnVjdG9yID09PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgPyB3aWRnZXRDb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgOiB3aWRnZXRDb25zdHJ1Y3Rvci5uYW1lIHx8ICc8QW5vbnltb3VzPic7XHJcbiAgICB9LCBkXzEuaXNXTm9kZSk7XHJcbn1cclxudmFyIFN0dWJXaWRnZXQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTdHViV2lkZ2V0LCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU3R1YldpZGdldCgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICBTdHViV2lkZ2V0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLCB0YWcgPSBfYS5fc3R1YlRhZywgd2lkZ2V0TmFtZSA9IF9hLl93aWRnZXROYW1lO1xyXG4gICAgICAgIHJldHVybiBkXzEudih0YWcsIChfYiA9IHt9LCBfYltXSURHRVRfU1RVQl9OQU1FX1BST1BFUlRZXSA9IHdpZGdldE5hbWUsIF9iKSwgdGhpcy5jaGlsZHJlbik7XHJcbiAgICAgICAgdmFyIF9iO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdHViV2lkZ2V0O1xyXG59KFdpZGdldEJhc2VfMS5kZWZhdWx0KSk7XHJcbi8qKlxyXG4gKiBBIG1peGluIHRoYXQgYWRkcyBhIHNweSB0byBhIHdpZGdldFxyXG4gKiBAcGFyYW0gYmFzZSBUaGUgYmFzZSBjbGFzcyB0byBhZGQgdGhlIHJlbmRlciBzcHkgdG9cclxuICogQHBhcmFtIHRhcmdldCBBbiBvYmplY3Qgd2l0aCBhIHByb3BlcnR5IG5hbWVkIGBsYXN0UmVuZGVyYCB3aGljaCB3aWxsIGJlIHNldCB0byB0aGUgcmVzdWx0IG9mIHRoZSBgcmVuZGVyKClgIG1ldGhvZFxyXG4gKi9cclxuZnVuY3Rpb24gU3B5V2lkZ2V0TWl4aW4oYmFzZSwgdGFyZ2V0KSB7XHJcbiAgICB2YXIgU3B5UmVuZGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFNweVJlbmRlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHlSZW5kZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3B5UmVuZGVyLnByb3RvdHlwZS5zcHlSZW5kZXIgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5hY3R1YWxSZW5kZXIocmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0dWJSZW5kZXIocmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNweVJlbmRlci5wcm90b3R5cGUubWV0YSA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmRlY29yYXRlTWV0YShfc3VwZXIucHJvdG90eXBlLm1ldGEuY2FsbCh0aGlzLCBwcm92aWRlcikpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJfMS5hZnRlclJlbmRlcigpXHJcbiAgICAgICAgXSwgU3B5UmVuZGVyLnByb3RvdHlwZSwgXCJzcHlSZW5kZXJcIiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFNweVJlbmRlcjtcclxuICAgIH0oYmFzZSkpO1xyXG4gICAgcmV0dXJuIFNweVJlbmRlcjtcclxufVxyXG4vKipcclxuICogQSBwcml2YXRlIGNsYXNzIHRoYXQgaXMgdXNlZCB0byBhY3R1YWxseSByZW5kZXIgdGhlIHdpZGdldCBhbmQga2VlcCB0cmFjayBvZiB0aGUgbGFzdCByZW5kZXIgYnlcclxuICogdGhlIGhhcm5lc3NlZCB3aWRnZXQuXHJcbiAqL1xyXG52YXIgV2lkZ2V0SGFybmVzcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKFdpZGdldEhhcm5lc3MsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBXaWRnZXRIYXJuZXNzKHdpZGdldENvbnN0cnVjdG9yLCBtZXRhRGF0YSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX2lkID0gUk9PVF9DVVNUT01fRUxFTUVOVF9OQU1FICsgJy0nICsgKytoYXJuZXNzSWQ7XHJcbiAgICAgICAgX3RoaXMuZGlkUmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgX3RoaXMucmVuZGVyQ291bnQgPSAwO1xyXG4gICAgICAgIF90aGlzLl93aWRnZXRDb25zdHJ1Y3RvciA9IFNweVdpZGdldE1peGluKHdpZGdldENvbnN0cnVjdG9yLCBfdGhpcyk7XHJcbiAgICAgICAgX3RoaXMuX21ldGFEYXRhID0gbWV0YURhdGE7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgYnkgYSBoYXJuZXNzZWQgd2lkZ2V0J3MgcmVuZGVyIHNweSwgYWxsb3dpbmcgcG90ZW50aWFsIGFzc2VydGlvbiBvZiB0aGUgcmVuZGVyXHJcbiAgICAgKiBAcGFyYW0gYWN0dWFsIFRoZSByZW5kZXIsIGp1c3QgYWZ0ZXIgYGFmdGVyUmVuZGVyYFxyXG4gICAgICovXHJcbiAgICBXaWRnZXRIYXJuZXNzLnByb3RvdHlwZS5hY3R1YWxSZW5kZXIgPSBmdW5jdGlvbiAoYWN0dWFsKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0UmVuZGVyID0gYWN0dWFsO1xyXG4gICAgICAgIHRoaXMuZGlkUmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlckNvdW50Kys7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcywgbWVzc2FnZSA9IF9hLmFzc2VydGlvbk1lc3NhZ2UsIGV4cGVjdGVkID0gX2EuZXhwZWN0ZWRSZW5kZXI7XHJcbiAgICAgICAgaWYgKGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0ZWRSZW5kZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzZXJ0aW9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgYXNzZXJ0UmVuZGVyXzEuZGVmYXVsdChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBfTWl4aW5fIHRoZSBtZXRob2RzIHRoYXQgYXJlIHByb3ZpZGVkIGFzIHBhcnQgb2YgdGhlIG1vY2suXHJcbiAgICAgKiBAcGFyYW0gcHJvdmlkZXIgVGhlIGluc3RhbmNlIG9mIHRoZSBtZXRhIHByb3ZpZGVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaGFybmVzc2VkIHdpZGdldFxyXG4gICAgICovXHJcbiAgICBXaWRnZXRIYXJuZXNzLnByb3RvdHlwZS5kZWNvcmF0ZU1ldGEgPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX21ldGFEYXRhLmdldChwcm92aWRlci5jb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEgPyBvYmplY3RfMS5hc3NpZ24ocHJvdmlkZXIsIGRhdGEubW9ja3MpIDogcHJvdmlkZXI7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0SGFybmVzcy5wcm90b3R5cGUuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFdyYXAgdGhlIHdpZGdldCBpbiBhIGN1c3RvbSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIFdpZGdldEhhcm5lc3MucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLCBpZCA9IF9hLl9pZCwgX3dpZGdldENvbnN0cnVjdG9yID0gX2EuX3dpZGdldENvbnN0cnVjdG9yLCBjaGlsZHJlbiA9IF9hLmNoaWxkcmVuLCBwcm9wZXJ0aWVzID0gX2EucHJvcGVydGllcztcclxuICAgICAgICByZXR1cm4gZF8xLnYoUk9PVF9DVVNUT01fRUxFTUVOVF9OQU1FLCB7IGlkOiBpZCB9LCBbZF8xLncoX3dpZGdldENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzLCBjaGlsZHJlbildKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gV2lkZ2V0SGFybmVzcztcclxufShXaWRnZXRCYXNlXzEuZGVmYXVsdCkpO1xyXG52YXIgUHJvamVjdG9yV2lkZ2V0SGFybmVzcyA9IFByb2plY3Rvcl8xLlByb2plY3Rvck1peGluKFdpZGdldEhhcm5lc3MpO1xyXG4vKipcclxuICogSGFybmVzcyBhIHdpZGdldCBjb25zdHJ1Y3RvciwgcHJvdmlkaW5nIGFuIEFQSSB0byBpbnRlcmFjdCB3aXRoIHRoZSB3aWRnZXQgZm9yIHRlc3RpbmcgcHVycG9zZXMuXHJcbiAqL1xyXG52YXIgSGFybmVzcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEhhcm5lc3MsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBIYXJuZXNzKHdpZGdldENvbnN0cnVjdG9yLCByb290KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fbWV0YU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3ZpZGVzIGEgcmVmZXJlbmNlIHRvIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB3aGVuIGNyZWF0aW5nIGFuIGV4cGVjdGVkIHJlbmRlciB2YWx1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfTtcclxuICAgICAgICB2YXIgd2lkZ2V0SGFybmVzcyA9IChfdGhpcy5fd2lkZ2V0SGFybmVzcyA9IG5ldyBQcm9qZWN0b3JXaWRnZXRIYXJuZXNzKHdpZGdldENvbnN0cnVjdG9yLCBfdGhpcy5fbWV0YU1hcCkpO1xyXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gY29udHJvbCB3aGVuIHRoZSByZW5kZXIgZ2V0cyBzY2hlZHVsZWQsIHNvIHdlIHdpbGwgaGlqYWNrIHRoZSBwcm9qZWN0cyBvbmVcclxuICAgICAgICBfdGhpcy5fc2NoZWR1bGVSZW5kZXIgPSB3aWRnZXRIYXJuZXNzLnNjaGVkdWxlUmVuZGVyLmJpbmQod2lkZ2V0SGFybmVzcyk7XHJcbiAgICAgICAgd2lkZ2V0SGFybmVzcy5zY2hlZHVsZVJlbmRlciA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICBfdGhpcy5vd24od2lkZ2V0SGFybmVzcyk7XHJcbiAgICAgICAgX3RoaXMuX3Jvb3QgPSByb290O1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEhhcm5lc3MucHJvdG90eXBlLl9pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldEhhcm5lc3Muc2V0UHJvcGVydGllcyh0aGlzLl9wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldEhhcm5lc3Muc2V0Q2hpbGRyZW4odGhpcy5fY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wcm9qZWN0b3JIYW5kbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fd2lkZ2V0SGFybmVzcy5hc3luYyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JIYW5kbGUgPSB0aGlzLl93aWRnZXRIYXJuZXNzLmFwcGVuZCh0aGlzLl9yb290KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVSZW5kZXIoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgYSBsaXN0ZW5lciBvbiBhIHRhcmdldCBub2RlIG9mIHRoZSB2aXJ0dWFsIERPTS5cclxuICAgICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBjYWxsIG9uIHRoZSB0YXJnZXQgbm9kZVxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQSBtYXAgb2Ygb3B0aW9ucyB0aGF0IGVmZmVjdCB0aGUgYmVoYXZpb3Igb2YgYGNhbGxMaXN0ZW5lcmBcclxuICAgICAqL1xyXG4gICAgSGFybmVzcy5wcm90b3R5cGUuY2FsbExpc3RlbmVyID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciByZW5kZXIgPSB0aGlzLmdldFJlbmRlcigpO1xyXG4gICAgICAgIGlmIChyZW5kZXIgPT0gbnVsbCB8fCB0eXBlb2YgcmVuZGVyICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdXaWRnZXQgaXMgbm90IHJlbmRlcmluZyBhbiBITm9kZSBvciBXTm9kZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsTGlzdGVuZXJfMS5kZWZhdWx0KHJlbmRlciwgbWV0aG9kLCBvcHRpb25zKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFzc2VydCBhbiBleHBlY3RlZCB2aXJ0dWFsIERPTSAoYEROb2RlYCkgYWdhaW5zdCB3aGF0IGlzIGFjdHVhbGx5IGJlaW5nIHJlbmRlcmVkLiAgV2lsbCB0aHJvdyBpZiB0aGUgZXhwZWN0ZWQgZG9lc1xyXG4gICAgICogbm90IG1hdGNoIHRoZSBhY3R1YWwuXHJcbiAgICAgKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIGV4cGVjdGVkIHJlbmRlciAoYEROb2RlYClcclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIEFueSBtZXNzYWdlIHRvIGJlIHBhcnQgb2YgYW4gZXJyb3IgdGhhdCBnZXRzIHRocm93biBpZiB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCBkbyBub3QgbWF0Y2hcclxuICAgICAqL1xyXG4gICAgSGFybmVzcy5wcm90b3R5cGUuZXhwZWN0UmVuZGVyID0gZnVuY3Rpb24gKGV4cGVjdGVkLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0SGFybmVzcy5leHBlY3RlZFJlbmRlciA9IGV4cGVjdGVkO1xyXG4gICAgICAgIHRoaXMuX3dpZGdldEhhcm5lc3MuYXNzZXJ0aW9uTWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0SGFybmVzcy5kaWRSZW5kZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl93aWRnZXRIYXJuZXNzLmRpZFJlbmRlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGV4cGVjdGVkIHJlbmRlciBkaWQgbm90IG9jY3VyLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBoYXJuZXNzZWQgd2lkZ2V0LiAgVGhpcyB3aWxsIHJlZnJlc2ggdGhlIHJlbmRlci5cclxuICAgICAqL1xyXG4gICAgSGFybmVzcy5wcm90b3R5cGUuZ2V0RG9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcHJvamVjdG9ySGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl93aWRnZXRIYXJuZXNzLmxhc3RSZW5kZXIgfHwgIXRoaXMuX3dpZGdldEhhcm5lc3MubGFzdFJlbmRlci5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcm9vdCBub2RlIGhhcyBiZWVuIHJlbmRlcmVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWRnZXRIYXJuZXNzLmxhc3RSZW5kZXIuZG9tTm9kZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFByb3ZpZGUgYSBtb2NrIGZvciBhIG1ldGEgcHJvdmlkZXIgdGhhdCB3aWxsIGJlIHVzZWQgaW5zdGVhZCBvZiBzb3VyY2UgcHJvdmlkZXJcclxuICAgICAqIEBwYXJhbSBwcm92aWRlciBUaGUgbWV0YSBwcm92aWRlciB0byBtb2NrXHJcbiAgICAgKiBAcGFyYW0gbW9ja3MgQSBzZXQgb2YgbWV0aG9kcy9wcm9wZXJ0aWVzIHRvIG1vY2sgb24gdGhlIHByb3ZpZGVyXHJcbiAgICAgKi9cclxuICAgIEhhcm5lc3MucHJvdG90eXBlLm1vY2tNZXRhID0gZnVuY3Rpb24gKHByb3ZpZGVyLCBtb2Nrcykge1xyXG4gICAgICAgIHZhciBfbWV0YU1hcCA9IHRoaXMuX21ldGFNYXA7XHJcbiAgICAgICAgaWYgKCFfbWV0YU1hcC5oYXMocHJvdmlkZXIpKSB7XHJcbiAgICAgICAgICAgIF9tZXRhTWFwLnNldChwcm92aWRlciwge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlOiBsYW5nXzEuY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbWV0YU1hcC5kZWxldGUocHJvdmlkZXIpO1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBubyBuZWVkIHRvIGNvZXJjZSBpbiAyLjUuMlxyXG4gICAgICAgICAgICAgICAgbW9ja3M6IG1vY2tzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogbm8gbmVlZCB0byBjb2VyY2UgaW4gMi41LjJcclxuICAgICAgICAgICAgX21ldGFNYXAuZ2V0KHByb3ZpZGVyKS5tb2NrcyA9IG1vY2tzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX21ldGFNYXAuZ2V0KHByb3ZpZGVyKS5oYW5kbGU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIHRoZSByZW5kZXIgYW5kIHJldHVybiB0aGUgbGFzdCByZW5kZXIncyByb290IGBETm9kZWAuXHJcbiAgICAgKi9cclxuICAgIEhhcm5lc3MucHJvdG90eXBlLmdldFJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZGdldEhhcm5lc3MubGFzdFJlbmRlcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoIGFuIGV2ZW50IHRvIHRoZSByb290IERPTSBlbGVtZW50IG9mIHRoZSByZW5kZXJlZCBoYXJuZXNzZWQgd2lkZ2V0LiAgWW91IGNhbiB1c2UgdGhlIG9wdGlvbnMgdG8gY2hhbmdlIHRoZVxyXG4gICAgICogZXZlbnQgY2xhc3MsIHByb3ZpZGUgYWRkaXRpb25hbCBldmVudCBwcm9wZXJ0aWVzLCBvciBzZWxlY3QgYSBkaWZmZXJlbnQgYHRhcmdldGAuXHJcbiAgICAgKlxyXG4gICAgICogQnkgZGVmYXVsdCwgdGhlIGV2ZW50IGNsYXNzIGlzIGBDdXN0b21FdmVudGAgYW5kIGBidWJibGVzYCBhbmQgYGNhbmNlbGFibGVgIGFyZSBib3RoIGB0cnVlYCBvbiBldmVudHMgZGlzcGF0Y2hlZCBieVxyXG4gICAgICogdGhlIGhhcm5lc3MuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBldmVudCAoZS5nLiBgY2xpY2tgIG9yIGBtb3VzZWRvd25gKVxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB3aGljaCBjYW4gbW9kaWZ5IHRoZSBldmVudCBzZW50LCBsaWtlIHVzaW5nIGEgZGlmZmVyZW50IEV2ZW50Q2xhc3Mgb3Igc2VsZWN0aW5nIGEgZGlmZmVyZW50XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgdG8gdGFyZ2V0LCBvciBwcm92aWRlIHRoZSBldmVudCBpbml0aWFsaXNhdGlvbiBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIEhhcm5lc3MucHJvdG90eXBlLnNlbmRFdmVudCA9IGZ1bmN0aW9uICh0eXBlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cclxuICAgICAgICB2YXIgX2EgPSBvcHRpb25zLnRhcmdldCwgdGFyZ2V0ID0gX2EgPT09IHZvaWQgMCA/IHRoaXMuZ2V0RG9tKCkgOiBfYSwga2V5ID0gb3B0aW9ucy5rZXksIHNlbmRPcHRpb25zID0gdHNsaWJfMS5fX3Jlc3Qob3B0aW9ucywgW1widGFyZ2V0XCIsIFwia2V5XCJdKTtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciBkbm9kZSA9IGZpbmRETm9kZUJ5S2V5KHRoaXMuX3dpZGdldEhhcm5lc3MubGFzdFJlbmRlciwga2V5KTtcclxuICAgICAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGRub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGtleSBvZiBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgdG8gc2VuZEV2ZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbmRFdmVudF8xLmRlZmF1bHQodGFyZ2V0LCB0eXBlLCBzZW5kT3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIGNoaWxkcmVuIHRoYXQgd2lsbCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBoYXJuZXNzZWQgd2lkZ2V0XHJcbiAgICAgKiBAcGFyYW0gY2hpbGRyZW4gVGhlIGNoaWxkcmVuIHRvIGJlIHNldCBvbiB0aGUgaGFybmVzc2VkIHdpZGdldFxyXG4gICAgICovXHJcbiAgICBIYXJuZXNzLnByb3RvdHlwZS5zZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgaGFybmVzc2VkIHdpZGdldCBvbiB0aGUgbmV4dCByZW5kZXJcclxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIHRvIHNldFxyXG4gICAgICovXHJcbiAgICBIYXJuZXNzLnByb3RvdHlwZS5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gSGFybmVzcztcclxufShFdmVudGVkXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLkhhcm5lc3MgPSBIYXJuZXNzO1xyXG4vKipcclxuICogSGFybmVzcyBhIHdpZGdldCBjbGFzcyBmb3IgdGVzdGluZyBwdXJwb3NlcywgcmV0dXJuaW5nIGFuIEFQSSB0byBpbnRlcmFjdCB3aXRoIHRoZSBoYXJuZXNzIHdpZGdldCBjbGFzcy5cclxuICogQHBhcmFtIHdpZGdldENvbnN0cnVjdG9yIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbi9jbGFzcyBvZiB3aWRnZXQgdGhhdCBzaG91bGQgYmUgaGFybmVzc2VkLlxyXG4gKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCB3aGVyZSB0aGUgaGFybmVzcyBzaG91bGQgYXBwZW5kIGl0c2VsZiB0byB0aGUgRE9NLiAgRGVmYXVsdHMgdG8gYGRvY3VtZW50LmJvZHlgXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXJuZXNzKHdpZGdldENvbnN0cnVjdG9yLCByb290KSB7XHJcbiAgICByZXR1cm4gbmV3IEhhcm5lc3Mod2lkZ2V0Q29uc3RydWN0b3IsIHJvb3QpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGhhcm5lc3M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvaGFybmVzcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvaGFybmVzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKlxyXG4gKiBUaGlzIG1vZHVsZSBpcyBhZGFwYXRlZCBmcm9tIFthc3NlcnRpb24tZXJyb3JdKGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFpanMvYXNzZXJ0aW9uLWVycm9yKVxyXG4gKiBmcm9tIEphdmFTY3JpcHQgdG8gVHlwZVNjcmlwdFxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBjb3B5IHByb3BlcnRpZXMgZnJvbVxyXG4gKiBvbmUgb2JqZWN0IHRvIGFub3RoZXIgZXhjbHVkaW5nIGFueSBvcmlnaW5hbGx5XHJcbiAqIGxpc3RlZC4gUmV0dXJuZWQgZnVuY3Rpb24gd2lsbCBjcmVhdGUgYSBuZXcgYHt9YC5cclxuICpcclxuICogQHBhcmFtIGV4Y2x1ZHMgZXhjbHVkZWQgcHJvcGVydGllc1xyXG4gKi9cclxuZnVuY3Rpb24gZXhjbHVkZSgpIHtcclxuICAgIHZhciBleGNsdWRlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBleGNsdWRlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZXhjbHVkZVByb3BzKHJlcywgb2JqKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKCF+ZXhjbHVkZXMuaW5kZXhPZihrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZXh0ZW5kRXhjbHVkZSgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcyA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBleGNsdWRlUHJvcHMocmVzLCBhcmdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqICMjIyBBc3NlcnRpb25FcnJvclxyXG4gKlxyXG4gKiBBbiBleHRlbnNpb24gb2YgdGhlIEphdmFTY3JpcHQgYEVycm9yYCBjb25zdHJ1Y3RvciBmb3JcclxuICogYXNzZXJ0aW9uIGFuZCB2YWxpZGF0aW9uIHNjZW5hcmlvcy5cclxuICpcclxuICogQHBhcmFtIG1lc3NhZ2UgKG9wdGlvbmFsKVxyXG4gKiBAcGFyYW0gX3Byb3BzIHByb3BlcnRpZXMgdG8gaW5jbHVkZSAob3B0aW9uYWwpXHJcbiAqIEBwYXJhbSBzc2Ygc3RhcnQgc3RhY2sgZnVuY3Rpb24gKG9wdGlvbmFsKVxyXG4gKi9cclxuZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3IobWVzc2FnZSwgX3Byb3BzLCBzc2YpIHtcclxuICAgIHZhciBleHRlbmQgPSBleGNsdWRlKCduYW1lJywgJ21lc3NhZ2UnLCAnc3RhY2snLCAnY29uc3RydWN0b3InLCAndG9KU09OJyk7XHJcbiAgICB2YXIgcHJvcHMgPSBleHRlbmQoX3Byb3BzIHx8IHt9KTtcclxuICAgIC8vIGRlZmF1bHQgdmFsdWVzXHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdVbnNwZWNpZmllZCBBc3NlcnRpb25FcnJvcic7XHJcbiAgICB0aGlzLnNob3dEaWZmID0gZmFsc2U7XHJcbiAgICAvLyBjb3B5IGZyb20gcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XHJcbiAgICAgICAgdGhpc1trZXldID0gcHJvcHNba2V5XTtcclxuICAgIH1cclxuICAgIC8vIGNhcHR1cmUgc3RhY2sgdHJhY2VcclxuICAgIGlmIChzc2YgJiYgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcclxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzc2YpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSBlLnN0YWNrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKiFcclxuICogSW5oZXJpdCBmcm9tIEVycm9yLnByb3RvdHlwZVxyXG4gKi9cclxuQXNzZXJ0aW9uRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG4vKiFcclxuICogU3RhdGljYWxseSBzZXQgbmFtZVxyXG4gKi9cclxuQXNzZXJ0aW9uRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xyXG4vKiFcclxuICogRW5zdXJlIGNvcnJlY3QgY29uc3RydWN0b3JcclxuICovXHJcbkFzc2VydGlvbkVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFzc2VydGlvbkVycm9yO1xyXG4vKipcclxuICogQWxsb3cgZXJyb3JzIHRvIGJlIGNvbnZlcnRlZCB0byBKU09OIGZvciBzdGF0aWMgdHJhbnNmZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSBzdGFjayBpbmNsdWRlIHN0YWNrIChkZWZhdWx0OiBgdHJ1ZWApXHJcbiAqL1xyXG5Bc3NlcnRpb25FcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKHN0YWNrKSB7XHJcbiAgICB2YXIgZXh0ZW5kID0gZXhjbHVkZSgnY29uc3RydWN0b3InLCAndG9KU09OJywgJ3N0YWNrJyk7XHJcbiAgICB2YXIgcHJvcHMgPSBleHRlbmQoeyBuYW1lOiB0aGlzLm5hbWUgfSwgdGhpcyk7XHJcbiAgICAvLyBpbmNsdWRlIHN0YWNrIGlmIGV4aXN0cyBhbmQgbm90IHR1cm5lZCBvZmZcclxuICAgIGlmIChmYWxzZSAhPT0gc3RhY2sgJiYgdGhpcy5zdGFjaykge1xyXG4gICAgICAgIHByb3BzLnN0YWNrID0gdGhpcy5zdGFjaztcclxuICAgIH1cclxuICAgIHJldHVybiBwcm9wcztcclxufTtcclxuLyogdHNsaW50OmRpc2FibGU6dmFyaWFibGUtbmFtZSAqL1xyXG52YXIgQXNzZXJ0aW9uRXJyb3JDb25zdHJ1Y3RvciA9IEFzc2VydGlvbkVycm9yO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBBc3NlcnRpb25FcnJvckNvbnN0cnVjdG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvQXNzZXJ0aW9uRXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvQXNzZXJ0aW9uRXJyb3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgU2V0XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9TZXRcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvZFwiKTtcclxudmFyIEFzc2VydGlvbkVycm9yXzEgPSByZXF1aXJlKFwiLi9Bc3NlcnRpb25FcnJvclwiKTtcclxudmFyIGNvbXBhcmVfMSA9IHJlcXVpcmUoXCIuL2NvbXBhcmVcIik7XHJcbnZhciBkXzIgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgUkVOREVSX0ZBSUxfTUVTU0FHRSA9ICdSZW5kZXIgdW5leHBlY3RlZCc7XHJcbi8qKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgdGhhdCBwcm92aWRlcyBkaWFnbm9zdGljIGluZm9ybWF0aW9uIHdoZW4gY29tcGFyaW5nIEROb2RlcyB3aGVyZSBvbmUgc2hvdWxkIGJlIGFuIGFycmF5XHJcbiAqIEBwYXJhbSBhY3R1YWwgVGhlIGFjdHVhbCBETm9kZVxyXG4gKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIGV4cGVjdGVkIEROb2RlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBcnJheVByZWFtYmxlKGFjdHVhbCwgZXhwZWN0ZWQpIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFjdHVhbClcclxuICAgICAgICA/IFwiRXhwZWN0ZWQgXFxcIlwiICsgZ2V0VHlwZU9mKGV4cGVjdGVkKSArIFwiXFxcIiBidXQgZ290IGFuIGFycmF5XCJcclxuICAgICAgICA6IFwiRXhwZWN0ZWQgYW4gYXJyYXkgYnV0IGdvdCBcXFwiXCIgKyBnZXRUeXBlT2YoYWN0dWFsKSArIFwiXFxcIlwiO1xyXG59XHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcgdGhhdCBjb250YWlucyBhbiBhcnJheSBvZiBjaGlsZCBpbmRleGVzIHdoaWNoIHJlbGF0ZWQgdG8gdGhlIG1lc3NhZ2VcclxuICogQHBhcmFtIGNoaWxkSW5kZXggVGhlIGluZGV4IG9mIHRoZSBjaGlsZCB0byBhZGQgdG8gdGhlIG1lc3NhZ2VcclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UsIGlmIGFueSB0byBwcmVwZW5kIHRoZSBjaGlsZCB0b1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q2hpbGRNZXNzYWdlKGNoaWxkSW5kZXgsIG1lc3NhZ2UpIHtcclxuICAgIGlmIChtZXNzYWdlID09PSB2b2lkIDApIHsgbWVzc2FnZSA9ICcnOyB9XHJcbiAgICB2YXIgbGFzdEluZGV4ID0gbWVzc2FnZS5sYXN0SW5kZXhPZignXScpO1xyXG4gICAgaWYgKGxhc3RJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyBjaGlsZEluZGV4ICsgXCJdIFwiICsgbWVzc2FnZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBtZXNzYWdlLnNsaWNlKDAsIGxhc3RJbmRleCArIDEpICsgKFwiW1wiICsgY2hpbGRJbmRleCArIFwiXVwiKSArIG1lc3NhZ2Uuc2xpY2UobGFzdEluZGV4ICsgMSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB0aGF0IHByb3ZpZGVzIGRpYWdub3N0aWMgaW5mb3JtYXRpb24gd2hlbiB0d28gRE5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBtaXNtYXRjaGVkXHJcbiAqIEBwYXJhbSBhY3R1YWwgVGhlIGFjdHVhbCBETm9kZVxyXG4gKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIGV4cGVjdGVkIEROb2RlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRNaXNtYXRjaFByZWFtYmxlKGFjdHVhbCwgZXhwZWN0ZWQpIHtcclxuICAgIHJldHVybiBcIkROb2RlIHR5cGUgbWlzbWF0Y2gsIGV4cGVjdGVkIFxcXCJcIiArIGdldFR5cGVPZihleHBlY3RlZCkgKyBcIlxcXCIgYWN0dWFsIFxcXCJcIiArIGdldFR5cGVPZihhY3R1YWwpICsgXCJcXFwiXCI7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhlIHR5cGUgb2YgdGhlIHZhbHVlLCBpbmNsdWRpbmcgbnVsbCBhcyBhIHNlcGVyYXRlIHR5cGUuXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ2V0IHRoZSB0eXBlIG9mXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUeXBlT2YodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB2YWx1ZTtcclxufVxyXG4vKipcclxuICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gQXNzZXJ0aW9uRXJyb3JcclxuICogQHBhcmFtIGFjdHVhbCBhY3R1YWwgdmFsdWVcclxuICogQHBhcmFtIGV4cGVjdGVkIGV4cGVjdGVkIHZhbHVlXHJcbiAqIEBwYXJhbSBwcm9sb2cgYSBtZXNzYWdlIHRoYXQgcHJvdmlkZXMgdGhlIHNwZWNpZmljIGFzc2VydGlvbiBpc3N1ZVxyXG4gKiBAcGFyYW0gbWVzc2FnZSBhbnkgbWVzc2FnZSB0byBiZSBwYXJ0IG9mIHRoZSBlcnJvclxyXG4gKi9cclxuZnVuY3Rpb24gdGhyb3dBc3NlcnRpb25FcnJvcihhY3R1YWwsIGV4cGVjdGVkLCBwcm9sb2csIG1lc3NhZ2UpIHtcclxuICAgIHRocm93IG5ldyBBc3NlcnRpb25FcnJvcl8xLmRlZmF1bHQoUkVOREVSX0ZBSUxfTUVTU0FHRSArIFwiOiBcIiArIHByb2xvZyArIChtZXNzYWdlID8gXCI6IFwiICsgbWVzc2FnZSA6ICcnKSwge1xyXG4gICAgICAgIGFjdHVhbDogYWN0dWFsLFxyXG4gICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcclxuICAgICAgICBzaG93RGlmZjogdHJ1ZVxyXG4gICAgfSwgYXNzZXJ0UmVuZGVyKTtcclxufVxyXG4vKipcclxuICogT3B0aW9ucyB1c2VkIHRvIGNvbmZpZ3VyZSBkaWZmIHRvIGNvcnJlY3RseSBjb21wYXJlIGBETm9kZWBzXHJcbiAqL1xyXG52YXIgZGVmYXVsdERpZmZPcHRpb25zID0ge1xyXG4gICAgYWxsb3dGdW5jdGlvblZhbHVlczogdHJ1ZSxcclxuICAgIGlnbm9yZVByb3BlcnRpZXM6IFsnYmluZCddXHJcbn07XHJcbmZ1bmN0aW9uIGFzc2VydFJlbmRlcihhY3R1YWwsIGV4cGVjdGVkLCBvcHRpb25zLCBtZXNzYWdlKSB7XHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbWVzc2FnZSA9IG9wdGlvbnM7XHJcbiAgICAgICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHZhciBfYSA9IChvcHRpb25zIHx8XHJcbiAgICAgICAge30pLCBfYiA9IF9hLmlzVk5vZGUsIGxvY2FsSXNWTm9kZSA9IF9iID09PSB2b2lkIDAgPyBkXzEuaXNWTm9kZSA6IF9iLCBfYyA9IF9hLmlzV05vZGUsIGxvY2FsSXNXTm9kZSA9IF9jID09PSB2b2lkIDAgPyBkXzEuaXNXTm9kZSA6IF9jLCBwYXNzZWREaWZmT3B0aW9ucyA9IHRzbGliXzEuX19yZXN0KF9hLCBbXCJpc1ZOb2RlXCIsIFwiaXNXTm9kZVwiXSk7XHJcbiAgICB2YXIgZGlmZk9wdGlvbnMgPSBsYW5nXzEuYXNzaWduKHt9LCBkZWZhdWx0RGlmZk9wdGlvbnMsIHBhc3NlZERpZmZPcHRpb25zKTtcclxuICAgIGZ1bmN0aW9uIGFzc2VydENoaWxkcmVuKGFjdHVhbCwgZXhwZWN0ZWQpIHtcclxuICAgICAgICBpZiAoYWN0dWFsICYmIGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3R1YWwubGVuZ3RoICE9PSBleHBlY3RlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93QXNzZXJ0aW9uRXJyb3IoYWN0dWFsLCBleHBlY3RlZCwgXCJDaGlsZHJlbidzIGxlbmd0aCBtaXNtYXRjaFwiLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhY3R1YWwuZm9yRWFjaChmdW5jdGlvbiAoYWN0dWFsQ2hpbGQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnRSZW5kZXIoYWN0dWFsQ2hpbGQsIGV4cGVjdGVkW2luZGV4XSwgKG9wdGlvbnMgfHwge30pLCBnZXRDaGlsZE1lc3NhZ2UoaW5kZXgsIG1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoYWN0dWFsIHx8IGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvd0Fzc2VydGlvbkVycm9yKGFjdHVhbCwgZXhwZWN0ZWQsIGFjdHVhbCA/ICdVbnhwZWN0ZWQgY2hpbGRyZW4nIDogJ0V4cGVjdGVkIGNoaWxkcmVuJywgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhY3R1YWwpICYmIEFycmF5LmlzQXJyYXkoZXhwZWN0ZWQpKSB7XHJcbiAgICAgICAgYXNzZXJ0Q2hpbGRyZW4oYWN0dWFsLCBleHBlY3RlZCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFjdHVhbCkgfHwgQXJyYXkuaXNBcnJheShleHBlY3RlZCkpIHtcclxuICAgICAgICB0aHJvd0Fzc2VydGlvbkVycm9yKGFjdHVhbCwgZXhwZWN0ZWQsIGdldEFycmF5UHJlYW1ibGUoYWN0dWFsLCBleHBlY3RlZCksIG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoKGxvY2FsSXNWTm9kZShhY3R1YWwpICYmIGxvY2FsSXNWTm9kZShleHBlY3RlZCkpIHx8IChsb2NhbElzV05vZGUoYWN0dWFsKSAmJiBsb2NhbElzV05vZGUoZXhwZWN0ZWQpKSkge1xyXG4gICAgICAgIGlmIChsb2NhbElzVk5vZGUoYWN0dWFsKSAmJiBsb2NhbElzVk5vZGUoZXhwZWN0ZWQpKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3R1YWwudGFnICE9PSBleHBlY3RlZC50YWcpIHtcclxuICAgICAgICAgICAgICAgIC8qIFRoZSB0YWdzIGRvIG5vdCBtYXRjaCAqL1xyXG4gICAgICAgICAgICAgICAgdGhyb3dBc3NlcnRpb25FcnJvcihhY3R1YWwudGFnLCBleHBlY3RlZC50YWcsIFwiVGFncyBkbyBub3QgbWF0Y2hcIiwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobG9jYWxJc1dOb2RlKGFjdHVhbCkgJiYgbG9jYWxJc1dOb2RlKGV4cGVjdGVkKSkge1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZTogbm90IGJlaW5nIHRyYWNrZWQgYnkgVHlwZVNjcmlwdCBwcm9wZXJseSAqL1xyXG4gICAgICAgICAgICBpZiAoYWN0dWFsLndpZGdldENvbnN0cnVjdG9yICE9PSBleHBlY3RlZC53aWRnZXRDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgLyogVGhlIFdOb2RlIGRvZXMgbm90IHNoYXJlIHRoZSBzYW1lIGNvbnN0cnVjdG9yICovXHJcbiAgICAgICAgICAgICAgICB0aHJvd0Fzc2VydGlvbkVycm9yKGFjdHVhbC53aWRnZXRDb25zdHJ1Y3RvciwgZXhwZWN0ZWQud2lkZ2V0Q29uc3RydWN0b3IsIFwiV05vZGVzIGRvIG5vdCBzaGFyZSBjb25zdHJ1Y3RvclwiLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBJbmplY3QgYSBjdXN0b20gY29tcGFyYXRvciBmb3IgY2xhc3MgbmFtZXMgKi9cclxuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc2VzXzEgPSBleHBlY3RlZC5wcm9wZXJ0aWVzICYmIGV4cGVjdGVkLnByb3BlcnRpZXMuY2xhc3NlcztcclxuICAgICAgICBpZiAoZXhwZWN0ZWRDbGFzc2VzXzEgJiYgIWNvbXBhcmVfMS5pc0N1c3RvbURpZmYoZXhwZWN0ZWRDbGFzc2VzXzEpKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdGVkLnByb3BlcnRpZXMuY2xhc3NlcyA9IGRfMi5jb21wYXJlUHJvcGVydHkoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhwZWN0ZWRWYWx1ZSA9IHR5cGVvZiBleHBlY3RlZENsYXNzZXNfMSA9PT0gJ3N0cmluZycgPyBbZXhwZWN0ZWRDbGFzc2VzXzFdIDogZXhwZWN0ZWRDbGFzc2VzXzE7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gW3ZhbHVlXSA6IHZhbHVlKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIHZhciBleHBlY3RlZFNldCA9IG5ldyBTZXRfMS5kZWZhdWx0KGV4cGVjdGVkVmFsdWUuZmlsdGVyKGZ1bmN0aW9uIChleHBlY3RlZENsYXNzKSB7IHJldHVybiBCb29sZWFuKGV4cGVjdGVkQ2xhc3MpOyB9KSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0dWFsU2V0ID0gbmV3IFNldF8xLmRlZmF1bHQodmFsdWUuZmlsdGVyKGZ1bmN0aW9uIChhY3R1YWxDbGFzcykgeyByZXR1cm4gQm9vbGVhbihhY3R1YWxDbGFzcyk7IH0pKTtcclxuICAgICAgICAgICAgICAgIGlmIChleHBlY3RlZFNldC5zaXplICE9PSBhY3R1YWxTZXQuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBhbGxNYXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxTZXQuZm9yRWFjaChmdW5jdGlvbiAoYWN0dWFsQ2xhc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxNYXRjaCA9IGFsbE1hdGNoICYmIGV4cGVjdGVkU2V0LmhhcyhhY3R1YWxDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxNYXRjaDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkZWx0YSA9IGNvbXBhcmVfMS5kaWZmKGFjdHVhbC5wcm9wZXJ0aWVzLCBleHBlY3RlZC5wcm9wZXJ0aWVzLCBkaWZmT3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKGRlbHRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvKiBUaGUgcHJvcGVydGllcyBkbyBub3QgbWF0Y2ggKi9cclxuICAgICAgICAgICAgdmFyIF9kID0gY29tcGFyZV8xLmdldENvbXBhcmFibGVPYmplY3RzKGFjdHVhbC5wcm9wZXJ0aWVzLCBleHBlY3RlZC5wcm9wZXJ0aWVzLCBkaWZmT3B0aW9ucyksIGNvbXBhcmFibGVBID0gX2QuY29tcGFyYWJsZUEsIGNvbXBhcmFibGVCID0gX2QuY29tcGFyYWJsZUI7XHJcbiAgICAgICAgICAgIHRocm93QXNzZXJ0aW9uRXJyb3IoY29tcGFyYWJsZUEsIGNvbXBhcmFibGVCLCBcIlByb3BlcnRpZXMgZG8gbm90IG1hdGNoXCIsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBXZSBuZWVkIHRvIGFzc2VydCB0aGUgY2hpbGRyZW4gbWF0Y2ggKi9cclxuICAgICAgICBhc3NlcnRDaGlsZHJlbihhY3R1YWwuY2hpbGRyZW4sIGV4cGVjdGVkLmNoaWxkcmVuKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBhY3R1YWwgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvKiBCb3RoIEROb2RlcyBhcmUgc3RyaW5ncyAqL1xyXG4gICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgIC8qIFRoZSBzdHJpbmdzIGRvIG5vdCBtYXRjaCAqL1xyXG4gICAgICAgICAgICB0aHJvd0Fzc2VydGlvbkVycm9yKGFjdHVhbCwgZXhwZWN0ZWQsIFwiVW5leHBlY3RlZCBzdHJpbmcgdmFsdWVzXCIsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRfMS5pc1ZOb2RlKGFjdHVhbCkgJiYgdHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIC8vIHdoZW4gZG9pbmcgYW4gZXhwZWN0ZWQgcmVuZGVyIG9uIGFscmVhZHkgcmVuZGVyZWQgbm9kZXMsIHN0cmluZ3MgYXJlIGNvbnZlcnRlZCB0byBfc2hlbGxfIFZOb2Rlc1xyXG4gICAgICAgIC8vIHNvIHdlIHdhbnQgdG8gY29tcGFyZSB0byB0aG9zZSBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKGFjdHVhbC50ZXh0ICE9PSBleHBlY3RlZCkge1xyXG4gICAgICAgICAgICB0aHJvd0Fzc2VydGlvbkVycm9yKGFjdHVhbC50ZXh0LCBleHBlY3RlZCwgXCJFeHBlY3RlZCB0ZXh0IGRpZmZlcnMgZnJvbSByZW5kZXJlZCB0ZXh0XCIsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCEoYWN0dWFsID09PSBudWxsICYmIGV4cGVjdGVkID09PSBudWxsKSkge1xyXG4gICAgICAgIC8qIFRoZXJlIGlzIGEgbWlzbWF0Y2ggYmV0d2VlbiB0aGUgdHlwZXMgb2YgRE5vZGVzICovXHJcbiAgICAgICAgdGhyb3dBc3NlcnRpb25FcnJvcihhY3R1YWwsIGV4cGVjdGVkLCBnZXRNaXNtYXRjaFByZWFtYmxlKGFjdHVhbCwgZXhwZWN0ZWQpLCBtZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBhc3NlcnRSZW5kZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9hc3NlcnRSZW5kZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvYXNzZXJ0UmVuZGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG4vKipcclxuICogQ2FsbCBhIGxpc3RlbmVyIG9uIGEgdmlydHVhbCBET00gbm9kZSBvciBvbmUgb2YgaXRzIGNoaWxkcmVuLlxyXG4gKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB0byByZXNvbHZlIHRoZSBsaXN0ZW5lciBhbmQgY2FsbFxyXG4gKiBAcGFyYW0gbWV0aG9kIFRoZSBsaXN0ZW5lciBuYW1lIGluIHRoZSBgbm9kZS5wcm9wZXJ0aWVzYCB0byBjYWxsXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdGhhdCBlZmZlY3QgaG93IHRoZSBsaXN0ZW5lciBpcyBjYWxsZWRcclxuICovXHJcbmZ1bmN0aW9uIGNhbGxMaXN0ZW5lcihub2RlLCBtZXRob2QsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XHJcbiAgICB2YXIgYXJncyA9IG9wdGlvbnMuYXJncywgdGhpc0FyZyA9IG9wdGlvbnMudGhpc0FyZztcclxuICAgIHZhciByZXNvbHZlZFRhcmdldHMgPSByZXNvbHZlVGFyZ2V0KG5vZGUsIG9wdGlvbnMpO1xyXG4gICAgaWYgKHJlc29sdmVkVGFyZ2V0cyA9PSBudWxsIHx8ICFyZXNvbHZlZFRhcmdldHMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZXNvbHZlIHRhcmdldFwiKTtcclxuICAgIH1cclxuICAgIHJlc29sdmVkVGFyZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB2YXIgbGlzdGVuZXIgPSB0YXJnZXQucHJvcGVydGllc1ttZXRob2RdO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZXNvbHZlIGxpc3RlbmVyOiBcXFwiXCIgKyBtZXRob2QgKyBcIlxcXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBiaW5kID0gdGFyZ2V0LmNvcmVQcm9wZXJ0aWVzID8gdGFyZ2V0LmNvcmVQcm9wZXJ0aWVzLmJpbmQgOiB0YXJnZXQucHJvcGVydGllcy5iaW5kO1xyXG4gICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXNBcmcgfHwgYmluZCwgYXJncyk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBjYWxsTGlzdGVuZXI7XHJcbmZ1bmN0aW9uIHJlc29sdmVUYXJnZXQobm9kZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcclxuICAgICAgICB2YXIgcmVzb2x2ZWRUYXJnZXRzXzEgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbm9kZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5vZGVbaV07XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHJlc29sdmVUYXJnZXQoaXRlbSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZC5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRUYXJnZXRzXzEucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNvbHZlZFRhcmdldHNfMTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciByZXNvbHZlZFRhcmdldCA9IHZvaWQgMDtcclxuICAgICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4LCBrZXkgPSBvcHRpb25zLmtleSwgdGFyZ2V0ID0gb3B0aW9ucy50YXJnZXQ7XHJcbiAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICByZXNvbHZlZFRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobm9kZSAhPSBudWxsICYmIHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZFRhcmdldCA9IGRfMS5maW5kS2V5KG5vZGUsIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGluZGV4ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ5SW5kZXggPSBkXzEuZmluZEluZGV4KG5vZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYnlJbmRleCA9PT0gJ29iamVjdCcgJiYgYnlJbmRleCAhPT0gbnVsbCAmJiAncHJvcGVydGllcycgaW4gYnlJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkVGFyZ2V0ID0gYnlJbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkVGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzb2x2ZWRUYXJnZXQgJiYgW3Jlc29sdmVkVGFyZ2V0XTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvY2FsbExpc3RlbmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby90ZXN0LWV4dHJhcy9zdXBwb3J0L2NhbGxMaXN0ZW5lci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2xhbmdcIik7XHJcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL29iamVjdFwiKTtcclxudmFyIFNldF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vU2V0XCIpO1xyXG4vKiBBc3NpZ25pbmcgdG8gbG9jYWwgdmFyaWFibGVzIHRvIGltcHJvdmUgbWluaWZpY2F0aW9uIGFuZCByZWFkYWJpbGl0eSAqL1xyXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcclxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcclxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xyXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XHJcbnZhciBpc0Zyb3plbiA9IE9iamVjdC5pc0Zyb3plbjtcclxudmFyIGlzU2VhbGVkID0gT2JqZWN0LmlzU2VhbGVkO1xyXG4vKipcclxuICogQSByZWNvcmQgdGhhdCBkZXNjcmliZXMgaG93IHRvIGluc3RhbnRpYXRlIGEgbmV3IG9iamVjdCB2aWEgYSBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG4gKiBAcGFyYW0gQ3RvciBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb25cclxuICogQHBhcmFtIGFyZ3MgQW55IGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTp2YXJpYWJsZS1uYW1lICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbnN0cnVjdFJlY29yZChDdG9yLCBhcmdzLCBkZXNjcmlwdG9yKSB7XHJcbiAgICB2YXIgcmVjb3JkID0gbGFuZ18xLmFzc2lnbihvYmplY3RDcmVhdGUobnVsbCksIHsgQ3RvcjogQ3RvciB9KTtcclxuICAgIGlmIChhcmdzKSB7XHJcbiAgICAgICAgcmVjb3JkLmFyZ3MgPSBhcmdzO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcclxuICAgICAgICByZWNvcmQuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVjb3JkO1xyXG59XHJcbmV4cG9ydHMuY3JlYXRlQ29uc3RydWN0UmVjb3JkID0gY3JlYXRlQ29uc3RydWN0UmVjb3JkO1xyXG4vKiB0c2xpbnQ6ZW5hYmxlOnZhcmlhYmxlLW5hbWUgKi9cclxuLyoqXHJcbiAqIEFuIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIG5ldyBwYXRjaCByZWNvcmRcclxuICpcclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgcGF0Y2ggcmVjb3JkXHJcbiAqIEBwYXJhbSBuYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIHRoZSByZWNvcmQgcmVmZXJzIHRvXHJcbiAqIEBwYXJhbSBkZXNjcmlwdG9yIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHRvIGJlIGluc3RhbGxlZCBvbiB0aGUgb2JqZWN0XHJcbiAqIEBwYXJhbSB2YWx1ZVJlY29yZHMgQW55IHN1YnNlcXVlbmV0IHBhdGNoIHJlY3JkcyB0byBiZSBhcHBsaWVkIHRvIHRoZSB2YWx1ZSBvZiB0aGUgZGVzY3JpcHRvclxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlUGF0Y2hSZWNvcmQodHlwZSwgbmFtZSwgZGVzY3JpcHRvciwgdmFsdWVSZWNvcmRzKSB7XHJcbiAgICB2YXIgcGF0Y2hSZWNvcmQgPSBsYW5nXzEuYXNzaWduKG9iamVjdENyZWF0ZShudWxsKSwge1xyXG4gICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgfSk7XHJcbiAgICBpZiAoZGVzY3JpcHRvcikge1xyXG4gICAgICAgIHBhdGNoUmVjb3JkLmRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlUmVjb3Jkcykge1xyXG4gICAgICAgIHBhdGNoUmVjb3JkLnZhbHVlUmVjb3JkcyA9IHZhbHVlUmVjb3JkcztcclxuICAgIH1cclxuICAgIHJldHVybiBwYXRjaFJlY29yZDtcclxufVxyXG4vKipcclxuICogQW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgbmV3IHNwbGljZSByZWNvcmRcclxuICpcclxuICogQHBhcmFtIHN0YXJ0IFdoZXJlIGluIHRoZSBhcnJheSB0byBzdGFydCB0aGUgc3BsaWNlXHJcbiAqIEBwYXJhbSBkZWxldGVDb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIGRlbGV0ZSBmcm9tIHRoZSBhcnJheVxyXG4gKiBAcGFyYW0gYWRkIEVsZW1lbnRzIHRvIGJlIGFkZGVkIHRvIHRoZSB0YXJnZXRcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVNwbGljZVJlY29yZChzdGFydCwgZGVsZXRlQ291bnQsIGFkZCkge1xyXG4gICAgdmFyIHNwbGljZVJlY29yZCA9IGxhbmdfMS5hc3NpZ24ob2JqZWN0Q3JlYXRlKG51bGwpLCB7XHJcbiAgICAgICAgdHlwZTogJ3NwbGljZScsXHJcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG4gICAgICAgIGRlbGV0ZUNvdW50OiBkZWxldGVDb3VudFxyXG4gICAgfSk7XHJcbiAgICBpZiAoYWRkICYmIGFkZC5sZW5ndGgpIHtcclxuICAgICAgICBzcGxpY2VSZWNvcmQuYWRkID0gYWRkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNwbGljZVJlY29yZDtcclxufVxyXG4vKipcclxuICogQSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvciwgd2hpY2ggYXNzdW1lcyB0aGF0IHByb3BlcnRpZXMgYXJlIGVudW1lcmFibGUsIHdyaXRhYmxlIGFuZCBjb25maWd1cmFibGVcclxuICogdW5sZXNzIHNwZWNpZmllZFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgZGVzY3JpcHRvclxyXG4gKiBAcGFyYW0gd3JpdGFibGUgRGVmYXVsdHMgdG8gYHRydWVgIGlmIG5vdCBzcGVjaWZpZWRcclxuICogQHBhcmFtIGVudW1lcmFibGUgRGVmYXVsdHMgdG8gYHRydWVgIGlmIG5vdCBzcGVjaWZpZWRcclxuICogQHBhcmFtIGNvbmZpZ3VyYWJsZSBEZWZhdWx0cyB0byBgdHJ1ZWAgaWYgbm90IHNwZWNpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVmFsdWVQcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIHdyaXRhYmxlLCBlbnVtZXJhYmxlLCBjb25maWd1cmFibGUpIHtcclxuICAgIGlmICh3cml0YWJsZSA9PT0gdm9pZCAwKSB7IHdyaXRhYmxlID0gdHJ1ZTsgfVxyXG4gICAgaWYgKGVudW1lcmFibGUgPT09IHZvaWQgMCkgeyBlbnVtZXJhYmxlID0gdHJ1ZTsgfVxyXG4gICAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYWJsZSA9IHRydWU7IH1cclxuICAgIHJldHVybiBsYW5nXzEuYXNzaWduKG9iamVjdENyZWF0ZShudWxsKSwge1xyXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICB3cml0YWJsZTogd3JpdGFibGUsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZW51bWVyYWJsZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZVxyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqIEEgY2xhc3Mgd2hpY2ggaXMgdXNlZCB3aGVuIG1ha2luZyBhIGN1c3RvbSBjb21wYXJpc29uIG9mIGEgbm9uLXBsYWluIG9iamVjdCBvciBhcnJheVxyXG4gKi9cclxudmFyIEN1c3RvbURpZmYgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDdXN0b21EaWZmKGRpZmYpIHtcclxuICAgICAgICB0aGlzLl9kaWZmZXIgPSBkaWZmO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGRpZmZlcmVuY2Ugb2YgdGhlIGB2YWx1ZWBcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZGlmZlxyXG4gICAgICogQHBhcmFtIG5hbWVPckluZGV4IEEgYHN0cmluZ2AgaWYgY29tcGFyaW5nIGEgcHJvcGVydHkgb3IgYSBgbnVtYmVyYCBpZiBjb21wYXJpbmcgYW4gYXJyYXkgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHBhcmVudCBUaGUgb3V0ZXIgcGFyZW50IHRoYXQgdGhpcyB2YWx1ZSBpcyBwYXJ0IG9mXHJcbiAgICAgKi9cclxuICAgIEN1c3RvbURpZmYucHJvdG90eXBlLmRpZmYgPSBmdW5jdGlvbiAodmFsdWUsIG5hbWVPckluZGV4LCBwYXJlbnQpIHtcclxuICAgICAgICB2YXIgcmVjb3JkID0gdGhpcy5fZGlmZmVyKHZhbHVlLCBuYW1lT3JJbmRleCwgcGFyZW50KTtcclxuICAgICAgICBpZiAocmVjb3JkICYmIHR5cGVvZiBuYW1lT3JJbmRleCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxhbmdfMS5hc3NpZ24ocmVjb3JkLCB7IG5hbWU6IG5hbWVPckluZGV4IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gQ3VzdG9tRGlmZjtcclxufSgpKTtcclxuZXhwb3J0cy5DdXN0b21EaWZmID0gQ3VzdG9tRGlmZjtcclxuLyoqXHJcbiAqIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgZGV0ZWN0cyB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBhbiBhcnJheSBhbmQgYW5vdGhlciB2YWx1ZSBhbmQgcmV0dXJucyBhIHNldCBvZiBzcGxpY2UgcmVjb3JkcyB0aGF0XHJcbiAqIGRlc2NyaWJlIHRoZSBkaWZmZXJlbmNlc1xyXG4gKlxyXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgYXJyYXkgdG8gY29tcGFyZSB0b1xyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIHZhbHVlIHRvIGNvbXBhcmUgdG9cclxuICogQHBhcmFtIG9wdGlvbnMgQW4gb3B0aW9ucyBiYWcgdGhhdCBhbGxvd3MgY29uZmlndXJhdGlvbiBvZiB0aGUgYmVoYXZpb3VyIG9mIGBkaWZmQXJyYXkoKWBcclxuICovXHJcbmZ1bmN0aW9uIGRpZmZBcnJheShhLCBiLCBvcHRpb25zKSB7XHJcbiAgICAvKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGFuIG92ZXJseSBzaW1wbGlzdGljIGFwcHJvYWNoIHRvIGNhbGN1bGF0aW5nIHNwbGljZSByZWNvcmRzLiAgVGhlcmUgYXJlIG1hbnkgc2l0dWF0aW9ucyB3aGVyZVxyXG4gICAgICogaW4gY29tcGxpY2F0ZWQgYXJyYXkgbXV0YXRpb25zLCB0aGUgc3BsaWNlIHJlY29yZHMgY2FuIGJlIG1vcmUgb3B0aW1pc2VkLlxyXG4gICAgICpcclxuICAgICAqIFRPRE86IFJhaXNlIGFuIGlzc3VlIGZvciB0aGlzIHdoZW4gaXQgaXMgZmluYWxseSBtZXJnZWQgYW5kIHB1dCBpbnRvIGNvcmVcclxuICAgICAqL1xyXG4gICAgdmFyIF9hID0gb3B0aW9ucy5hbGxvd0Z1bmN0aW9uVmFsdWVzLCBhbGxvd0Z1bmN0aW9uVmFsdWVzID0gX2EgPT09IHZvaWQgMCA/IGZhbHNlIDogX2E7XHJcbiAgICB2YXIgYXJyYXlBID0gYTtcclxuICAgIHZhciBsZW5ndGhBID0gYXJyYXlBLmxlbmd0aDtcclxuICAgIHZhciBhcnJheUIgPSBpc0FycmF5KGIpID8gYiA6IFtdO1xyXG4gICAgdmFyIGxlbmd0aEIgPSBhcnJheUIubGVuZ3RoO1xyXG4gICAgdmFyIHBhdGNoUmVjb3JkcyA9IFtdO1xyXG4gICAgaWYgKCFsZW5ndGhBICYmIGxlbmd0aEIpIHtcclxuICAgICAgICAvKiBlbXB0eSBhcnJheSAqL1xyXG4gICAgICAgIHBhdGNoUmVjb3Jkcy5wdXNoKGNyZWF0ZVNwbGljZVJlY29yZCgwLCBsZW5ndGhCKSk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGNoUmVjb3JkcztcclxuICAgIH1cclxuICAgIHZhciBhZGQgPSBbXTtcclxuICAgIHZhciBzdGFydCA9IDA7XHJcbiAgICB2YXIgZGVsZXRlQ291bnQgPSAwO1xyXG4gICAgdmFyIGxhc3QgPSAtMTtcclxuICAgIGZ1bmN0aW9uIGZsdXNoU3BsaWNlUmVjb3JkKCkge1xyXG4gICAgICAgIGlmIChkZWxldGVDb3VudCB8fCBhZGQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHBhdGNoUmVjb3Jkcy5wdXNoKGNyZWF0ZVNwbGljZVJlY29yZChzdGFydCwgc3RhcnQgKyBkZWxldGVDb3VudCA+IGxlbmd0aEIgPyBsZW5ndGhCIC0gc3RhcnQgOiBkZWxldGVDb3VudCwgYWRkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYWRkRGlmZmVyZW5jZShpbmRleCwgYWRkaW5nLCB2YWx1ZSkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IGxhc3QgKyAxKSB7XHJcbiAgICAgICAgICAgIC8qIGZsdXNoIHRoZSBzcGxpY2UgKi9cclxuICAgICAgICAgICAgZmx1c2hTcGxpY2VSZWNvcmQoKTtcclxuICAgICAgICAgICAgc3RhcnQgPSBpbmRleDtcclxuICAgICAgICAgICAgZGVsZXRlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBpZiAoYWRkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYWRkID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFkZGluZykge1xyXG4gICAgICAgICAgICBhZGQucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZUNvdW50Kys7XHJcbiAgICAgICAgbGFzdCA9IGluZGV4O1xyXG4gICAgfVxyXG4gICAgYXJyYXlBLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlQSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgdmFsdWVCID0gYXJyYXlCW2luZGV4XTtcclxuICAgICAgICBpZiAoaW5kZXggaW4gYXJyYXlCICYmXHJcbiAgICAgICAgICAgICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAoYWxsb3dGdW5jdGlvblZhbHVlcyAmJiB0eXBlb2YgdmFsdWVBID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZUIgPT09ICdmdW5jdGlvbicpKSkge1xyXG4gICAgICAgICAgICByZXR1cm47IC8qIG5vdCBkaWZmZXJlbnQgKi9cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlzVmFsdWVBQXJyYXkgPSBpc0FycmF5KHZhbHVlQSk7XHJcbiAgICAgICAgdmFyIGlzVmFsdWVBUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0KHZhbHVlQSk7XHJcbiAgICAgICAgaWYgKGlzVmFsdWVBQXJyYXkgfHwgaXNWYWx1ZUFQbGFpbk9iamVjdCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBpc1ZhbHVlQUFycmF5XHJcbiAgICAgICAgICAgICAgICA/IGlzQXJyYXkodmFsdWVCKSA/IHZhbHVlQiA6IFtdXHJcbiAgICAgICAgICAgICAgICA6IGlzUGxhaW5PYmplY3QodmFsdWVCKSA/IHZhbHVlQiA6IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZVJlY29yZHMgPSBkaWZmKHZhbHVlQSwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgLyogb25seSBhZGQgaWYgdGhlcmUgYXJlIGNoYW5nZXMgKi9cclxuICAgICAgICAgICAgICAgIGFkZERpZmZlcmVuY2UoaW5kZXgsIHRydWUsIGRpZmYodmFsdWVBLCB2YWx1ZSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzUHJpbWl0aXZlKHZhbHVlQSkpIHtcclxuICAgICAgICAgICAgYWRkRGlmZmVyZW5jZShpbmRleCwgdHJ1ZSwgdmFsdWVBKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYWxsb3dGdW5jdGlvblZhbHVlcyAmJiB0eXBlb2YgdmFsdWVBID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGFkZERpZmZlcmVuY2UoaW5kZXgsIHRydWUsIHZhbHVlQSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVmFsdWUgb2YgYXJyYXkgZWxlbWVudCBcXFwiXCIgKyBpbmRleCArIFwiXFxcIiBmcm9tIGZpcnN0IGFyZ3VtZW50IGlzIG5vdCBhIHByaW1hdGl2ZSwgcGxhaW4gT2JqZWN0LCBvciBBcnJheS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAobGVuZ3RoQiA+IGxlbmd0aEEpIHtcclxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IGxlbmd0aEE7IGluZGV4IDwgbGVuZ3RoQjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBhZGREaWZmZXJlbmNlKGluZGV4LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyogZmx1c2ggYW55IGRlbGV0ZXMgKi9cclxuICAgIGZsdXNoU3BsaWNlUmVjb3JkKCk7XHJcbiAgICByZXR1cm4gcGF0Y2hSZWNvcmRzO1xyXG59XHJcbi8qKlxyXG4gKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGRldGVjdHMgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gcGxhaW4gb2JqZWN0cyBhbmQgcmV0dXJucyBhIHNldCBvZiBwYXRjaCByZWNvcmRzIHRoYXRcclxuICogZGVzY3JpYmUgdGhlIGRpZmZlcmVuY2VzXHJcbiAqXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBwbGFpbiBvYmplY3QgdG8gY29tcGFyZSB0b1xyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIHBsYWluIG9iamVjdCB0byBjb21wYXJlIHRvXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgYmFnIHRoYXQgYWxsb3dzIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGJlaGF2aW91ciBvZiBgZGlmZlBsYWluT2JqZWN0KClgXHJcbiAqL1xyXG5mdW5jdGlvbiBkaWZmUGxhaW5PYmplY3QoYSwgYiwgb3B0aW9ucykge1xyXG4gICAgdmFyIF9hID0gb3B0aW9ucy5hbGxvd0Z1bmN0aW9uVmFsdWVzLCBhbGxvd0Z1bmN0aW9uVmFsdWVzID0gX2EgPT09IHZvaWQgMCA/IGZhbHNlIDogX2EsIF9iID0gb3B0aW9ucy5pZ25vcmVQcm9wZXJ0eVZhbHVlcywgaWdub3JlUHJvcGVydHlWYWx1ZXMgPSBfYiA9PT0gdm9pZCAwID8gW10gOiBfYjtcclxuICAgIHZhciBwYXRjaFJlY29yZHMgPSBbXTtcclxuICAgIHZhciBfYyA9IGdldENvbXBhcmFibGVPYmplY3RzKGEsIGIsIG9wdGlvbnMpLCBjb21wYXJhYmxlQSA9IF9jLmNvbXBhcmFibGVBLCBjb21wYXJhYmxlQiA9IF9jLmNvbXBhcmFibGVCO1xyXG4gICAgLyogbG9vayBmb3Iga2V5cyBpbiBhIHRoYXQgYXJlIGRpZmZlcmVudCBmcm9tIGIgKi9cclxuICAgIG9iamVjdF8xLmtleXMoY29tcGFyYWJsZUEpLnJlZHVjZShmdW5jdGlvbiAocGF0Y2hSZWNvcmRzLCBuYW1lKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlQSA9IGFbbmFtZV07XHJcbiAgICAgICAgdmFyIHZhbHVlQiA9IGJbbmFtZV07XHJcbiAgICAgICAgdmFyIGJIYXNPd25Qcm9wZXJ0eSA9IGhhc093blByb3BlcnR5LmNhbGwoY29tcGFyYWJsZUIsIG5hbWUpO1xyXG4gICAgICAgIGlmIChiSGFzT3duUHJvcGVydHkgJiZcclxuICAgICAgICAgICAgKHZhbHVlQSA9PT0gdmFsdWVCIHx8IChhbGxvd0Z1bmN0aW9uVmFsdWVzICYmIHR5cGVvZiB2YWx1ZUEgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlQiA9PT0gJ2Z1bmN0aW9uJykpKSB7XHJcbiAgICAgICAgICAgIC8qIG5vdCBkaWZmZXJlbnQgKi9cclxuICAgICAgICAgICAgLyogd2hlbiBgYWxsb3dGdW5jdGlvblZhbHVlc2AgaXMgdHJ1ZSwgZnVuY3Rpb25zIGFyZSBzaW1wbHkgY29uc2lkZXJlZCB0byBiZSBlcXVhbCBieSBgdHlwZW9mYCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0Y2hSZWNvcmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZSA9IGJIYXNPd25Qcm9wZXJ0eSA/ICd1cGRhdGUnIDogJ2FkZCc7XHJcbiAgICAgICAgdmFyIGlzVmFsdWVBQXJyYXkgPSBpc0FycmF5KHZhbHVlQSk7XHJcbiAgICAgICAgdmFyIGlzVmFsdWVBUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0KHZhbHVlQSk7XHJcbiAgICAgICAgaWYgKGlzQ3VzdG9tRGlmZih2YWx1ZUEpICYmICFpc0N1c3RvbURpZmYodmFsdWVCKSkge1xyXG4gICAgICAgICAgICAvKiBjb21wbGV4IGRpZmYgbGVmdCBoYW5kICovXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZUEuZGlmZih2YWx1ZUIsIG5hbWUsIGIpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaFJlY29yZHMucHVzaChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzQ3VzdG9tRGlmZih2YWx1ZUIpKSB7XHJcbiAgICAgICAgICAgIC8qIGNvbXBsZXggZGlmZiByaWdodCBoYW5kICovXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZUIuZGlmZih2YWx1ZUEsIG5hbWUsIGEpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaFJlY29yZHMucHVzaChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzVmFsdWVBQXJyYXkgfHwgaXNWYWx1ZUFQbGFpbk9iamVjdCkge1xyXG4gICAgICAgICAgICAvKiBub24tcHJpbWl0aXZlIHZhbHVlcyB3ZSBjYW4gZGlmZiAqL1xyXG4gICAgICAgICAgICAvKiB0aGlzIGlzIGEgYml0IGNvbXBsaWNhdGVkLCBidXQgZXNzZW50aWFsbHkgaWYgdmFsdWVBIGFuZCB2YWx1ZUIgYXJlIGJvdGggYXJyYXlzIG9yIHBsYWluIG9iamVjdHMsIHRoZW5cclxuICAgICAgICAgICAgKiB3ZSBjYW4gZGlmZiB0aG9zZSB0d28gdmFsdWVzLCBpZiBub3QsIHRoZW4gd2UgbmVlZCB0byB1c2UgYW4gZW1wdHkgYXJyYXkgb3IgYW4gZW1wdHkgb2JqZWN0IGFuZCBkaWZmXHJcbiAgICAgICAgICAgICogdGhlIHZhbHVlQSB3aXRoIHRoYXQgKi9cclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gKGlzVmFsdWVBQXJyYXkgJiYgaXNBcnJheSh2YWx1ZUIpKSB8fCAoaXNWYWx1ZUFQbGFpbk9iamVjdCAmJiBpc1BsYWluT2JqZWN0KHZhbHVlQikpXHJcbiAgICAgICAgICAgICAgICA/IHZhbHVlQlxyXG4gICAgICAgICAgICAgICAgOiBpc1ZhbHVlQUFycmF5ID8gW10gOiBvYmplY3RDcmVhdGUobnVsbCk7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZVJlY29yZHMgPSBkaWZmKHZhbHVlQSwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgLyogb25seSBhZGQgaWYgdGhlcmUgYXJlIGNoYW5nZXMgKi9cclxuICAgICAgICAgICAgICAgIHBhdGNoUmVjb3Jkcy5wdXNoKGNyZWF0ZVBhdGNoUmVjb3JkKHR5cGUsIG5hbWUsIGNyZWF0ZVZhbHVlUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlKSwgZGlmZih2YWx1ZUEsIHZhbHVlLCBvcHRpb25zKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzUHJpbWl0aXZlKHZhbHVlQSkgfHxcclxuICAgICAgICAgICAgKGFsbG93RnVuY3Rpb25WYWx1ZXMgJiYgdHlwZW9mIHZhbHVlQSA9PT0gJ2Z1bmN0aW9uJykgfHxcclxuICAgICAgICAgICAgaXNJZ25vcmVkUHJvcGVydHlWYWx1ZShuYW1lLCBhLCBiLCBpZ25vcmVQcm9wZXJ0eVZhbHVlcykpIHtcclxuICAgICAgICAgICAgLyogcHJpbWl0aXZlIHZhbHVlcywgZnVuY3Rpb25zIHZhbHVlcyBpZiBhbGxvd2VkLCBvciBpZ25vcmVkIHByb3BlcnR5IHZhbHVlcyBjYW4ganVzdCBiZSBjb3BpZWQgKi9cclxuICAgICAgICAgICAgcGF0Y2hSZWNvcmRzLnB1c2goY3JlYXRlUGF0Y2hSZWNvcmQodHlwZSwgbmFtZSwgY3JlYXRlVmFsdWVQcm9wZXJ0eURlc2NyaXB0b3IodmFsdWVBKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlZhbHVlIG9mIHByb3BlcnR5IG5hbWVkIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIgZnJvbSBmaXJzdCBhcmd1bWVudCBpcyBub3QgYSBwcmltYXRpdmUsIHBsYWluIE9iamVjdCwgb3IgQXJyYXkuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0Y2hSZWNvcmRzO1xyXG4gICAgfSwgcGF0Y2hSZWNvcmRzKTtcclxuICAgIC8qIGxvb2sgZm9yIGtleXMgaW4gYiB0aGF0IGFyZSBub3QgaW4gYSAqL1xyXG4gICAgb2JqZWN0XzEua2V5cyhjb21wYXJhYmxlQikucmVkdWNlKGZ1bmN0aW9uIChwYXRjaFJlY29yZHMsIG5hbWUpIHtcclxuICAgICAgICBpZiAoIWhhc093blByb3BlcnR5LmNhbGwoY29tcGFyYWJsZUEsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHBhdGNoUmVjb3Jkcy5wdXNoKGNyZWF0ZVBhdGNoUmVjb3JkKCdkZWxldGUnLCBuYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRjaFJlY29yZHM7XHJcbiAgICB9LCBwYXRjaFJlY29yZHMpO1xyXG4gICAgcmV0dXJuIHBhdGNoUmVjb3JkcztcclxufVxyXG4vKipcclxuICogVGFrZXMgdHdvIHBsYWluIG9iamVjdHMgdG8gYmUgY29tcGFyZWQsIGFzIHdlbGwgYXMgb3B0aW9ucyBjdXN0b21pemluZyB0aGUgYmVoYXZpb3Igb2YgdGhlIGNvbXBhcmlzb24sIGFuZCByZXR1cm5zXHJcbiAqIHR3byBuZXcgb2JqZWN0cyB0aGF0IGNvbnRhaW4gb25seSB0aG9zZSBwcm9wZXJ0aWVzIHRoYXQgc2hvdWxkIGJlIGNvbXBhcmVkLiBJZiBhIHByb3BlcnR5IGlzIGlnbm9yZWRcclxuICogaXQgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gZWl0aGVyIHJldHVybmVkIG9iamVjdC4gSWYgYSBwcm9wZXJ0eSdzIHZhbHVlIHNob3VsZCBiZSBpZ25vcmVkIGl0IHdpbGwgYmUgZXhjbHVkZWRcclxuICogaWYgaXQgaXMgcHJlc2VudCBpbiBib3RoIG9iamVjdHMuXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBvYmplY3QgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIG9iamVjdCB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgYmFnIGluZGljYXRpbmcgd2hpY2ggcHJvcGVydGllcyBzaG91bGQgYmUgaWdub3JlZCBvciBoYXZlIHRoZWlyIHZhbHVlcyBpZ25vcmVkLCBpZiBhbnkuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb21wYXJhYmxlT2JqZWN0cyhhLCBiLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgX2EgPSBvcHRpb25zLmlnbm9yZVByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMgPSBfYSA9PT0gdm9pZCAwID8gW10gOiBfYSwgX2IgPSBvcHRpb25zLmlnbm9yZVByb3BlcnR5VmFsdWVzLCBpZ25vcmVQcm9wZXJ0eVZhbHVlcyA9IF9iID09PSB2b2lkIDAgPyBbXSA6IF9iO1xyXG4gICAgdmFyIGlnbm9yZSA9IG5ldyBTZXRfMS5kZWZhdWx0KCk7XHJcbiAgICB2YXIga2VlcCA9IG5ldyBTZXRfMS5kZWZhdWx0KCk7XHJcbiAgICB2YXIgaXNJZ25vcmVkUHJvcGVydHkgPSBBcnJheS5pc0FycmF5KGlnbm9yZVByb3BlcnRpZXMpXHJcbiAgICAgICAgPyBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaWdub3JlUHJvcGVydGllcy5zb21lKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBuYW1lID09PSB2YWx1ZSA6IHZhbHVlLnRlc3QobmFtZSkpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgOiBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gaWdub3JlUHJvcGVydGllcyhuYW1lLCBhLCBiKTsgfTtcclxuICAgIHZhciBjb21wYXJhYmxlQSA9IG9iamVjdF8xLmtleXMoYSkucmVkdWNlKGZ1bmN0aW9uIChvYmosIG5hbWUpIHtcclxuICAgICAgICBpZiAoaXNJZ25vcmVkUHJvcGVydHkobmFtZSkgfHxcclxuICAgICAgICAgICAgKGhhc093blByb3BlcnR5LmNhbGwoYiwgbmFtZSkgJiYgaXNJZ25vcmVkUHJvcGVydHlWYWx1ZShuYW1lLCBhLCBiLCBpZ25vcmVQcm9wZXJ0eVZhbHVlcykpKSB7XHJcbiAgICAgICAgICAgIGlnbm9yZS5hZGQobmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGtlZXAuYWRkKG5hbWUpO1xyXG4gICAgICAgIG9ialtuYW1lXSA9IGFbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sIHt9KTtcclxuICAgIHZhciBjb21wYXJhYmxlQiA9IG9iamVjdF8xLmtleXMoYikucmVkdWNlKGZ1bmN0aW9uIChvYmosIG5hbWUpIHtcclxuICAgICAgICBpZiAoaWdub3JlLmhhcyhuYW1lKSB8fCAoIWtlZXAuaGFzKG5hbWUpICYmIGlzSWdub3JlZFByb3BlcnR5KG5hbWUpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmpbbmFtZV0gPSBiW25hbWVdO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LCB7fSk7XHJcbiAgICByZXR1cm4geyBjb21wYXJhYmxlQTogY29tcGFyYWJsZUEsIGNvbXBhcmFibGVCOiBjb21wYXJhYmxlQiwgaWdub3JlOiBpZ25vcmUgfTtcclxufVxyXG5leHBvcnRzLmdldENvbXBhcmFibGVPYmplY3RzID0gZ2V0Q29tcGFyYWJsZU9iamVjdHM7XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYSBgQ3VzdG9tRGlmZmBcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gKi9cclxuZnVuY3Rpb24gaXNDdXN0b21EaWZmKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEN1c3RvbURpZmY7XHJcbn1cclxuZXhwb3J0cy5pc0N1c3RvbURpZmYgPSBpc0N1c3RvbURpZmY7XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYSBgQ29uc3RydWN0UmVjb3JkYFxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0NvbnN0cnVjdFJlY29yZCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4odmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5DdG9yICYmIHZhbHVlLm5hbWUpO1xyXG59XHJcbmZ1bmN0aW9uIGlzSWdub3JlZFByb3BlcnR5VmFsdWUobmFtZSwgYSwgYiwgaWdub3JlZFByb3BlcnR5VmFsdWVzKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpZ25vcmVkUHJvcGVydHlWYWx1ZXMpXHJcbiAgICAgICAgPyBpZ25vcmVkUHJvcGVydHlWYWx1ZXMuc29tZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBuYW1lID09PSB2YWx1ZSA6IHZhbHVlLnRlc3QobmFtZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICA6IGlnbm9yZWRQcm9wZXJ0eVZhbHVlcyhuYW1lLCBhLCBiKTtcclxufVxyXG4vKipcclxuICogQSBndWFyZCB0aGF0IGRldGVybWluZXMgaWYgdGhlIHZhbHVlIGlzIGEgYFBhdGNoUmVjb3JkYFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1BhdGNoUmVjb3JkKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbih2YWx1ZSAmJiB2YWx1ZS50eXBlICYmIHZhbHVlLm5hbWUpO1xyXG59XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXkgb2YgYFBhdGNoUmVjb3JkYHNcclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gKi9cclxuZnVuY3Rpb24gaXNQYXRjaFJlY29yZEFycmF5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggJiYgaXNQYXRjaFJlY29yZCh2YWx1ZVswXSkpO1xyXG59XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYSBwbGFpbiBvYmplY3QuICBBIHBsYWluIG9iamVjdCBpcyBhbiBvYmplY3QgdGhhdCBoYXNcclxuICogZWl0aGVyIG5vIGNvbnN0cnVjdG9yIChlLmcuIGBPYmplY3QuY3JlYXRlKG51bGwpYCkgb3IgaGFzIE9iamVjdCBhcyBpdHMgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcclxuICovXHJcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcclxuICAgIHJldHVybiBCb29sZWFuKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkpO1xyXG59XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYSBwcmltaXRpdmUgKGluY2x1ZGluZyBgbnVsbGApLCBhcyB0aGVzZSB2YWx1ZXMgYXJlXHJcbiAqIGZpbmUgdG8ganVzdCBjb3B5LlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xyXG4gICAgdmFyIHR5cGVvZlZhbHVlID0gdHlwZW9mIHZhbHVlO1xyXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gbnVsbCB8fFxyXG4gICAgICAgIHR5cGVvZlZhbHVlID09PSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgIHR5cGVvZlZhbHVlID09PSAnc3RyaW5nJyB8fFxyXG4gICAgICAgIHR5cGVvZlZhbHVlID09PSAnbnVtYmVyJyB8fFxyXG4gICAgICAgIHR5cGVvZlZhbHVlID09PSAnYm9vbGVhbicpO1xyXG59XHJcbi8qKlxyXG4gKiBBIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgYSBgU3BsaWNlUmVjb3JkYFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NwbGljZVJlY29yZCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnR5cGUgPT09ICdzcGxpY2UnICYmICdzdGFydCcgaW4gdmFsdWUgJiYgJ2RlbGV0ZUNvdW50JyBpbiB2YWx1ZTtcclxufVxyXG4vKipcclxuICogQSBndWFyZCB0aGF0IGRldGVybWluZXMgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5IG9mIGBTcGxpY2VSZWNvcmRgc1xyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NwbGljZVJlY29yZEFycmF5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggJiYgaXNTcGxpY2VSZWNvcmQodmFsdWVbMF0pKTtcclxufVxyXG4vKipcclxuICogQW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBwYXRjaGVzIGEgdGFyZ2V0IHdpdGggYSBgU3BsaWNlUmVjb3JkYFxyXG4gKi9cclxuZnVuY3Rpb24gcGF0Y2hTcGxpY2UodGFyZ2V0LCBfYSkge1xyXG4gICAgdmFyIGFkZCA9IF9hLmFkZCwgZGVsZXRlQ291bnQgPSBfYS5kZWxldGVDb3VudCwgc3RhcnQgPSBfYS5zdGFydDtcclxuICAgIGlmIChhZGQgJiYgYWRkLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBkZWxldGVkSXRlbXNfMSA9IGRlbGV0ZUNvdW50ID8gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBzdGFydCArIGRlbGV0ZUNvdW50KSA6IFtdO1xyXG4gICAgICAgIGFkZCA9IGFkZC5tYXAoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkgeyByZXR1cm4gcmVzb2x2ZVRhcmdldFZhbHVlKHZhbHVlLCBkZWxldGVkSXRlbXNfMVtpbmRleF0pOyB9KTtcclxuICAgICAgICB0YXJnZXQuc3BsaWNlLmFwcGx5KHRhcmdldCwgdHNsaWJfMS5fX3NwcmVhZChbc3RhcnQsIGRlbGV0ZUNvdW50XSwgYWRkKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0YXJnZXQuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHBhdGNoZXMgYSB0YXJnZXQgd2l0aCBhIGBQYXRjaFJlY29yZGBcclxuICovXHJcbmZ1bmN0aW9uIHBhdGNoUGF0Y2godGFyZ2V0LCByZWNvcmQpIHtcclxuICAgIHZhciBuYW1lID0gcmVjb3JkLm5hbWU7XHJcbiAgICBpZiAocmVjb3JkLnR5cGUgPT09ICdkZWxldGUnKSB7XHJcbiAgICAgICAgZGVsZXRlIHRhcmdldFtuYW1lXTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgdmFyIGRlc2NyaXB0b3IgPSByZWNvcmQuZGVzY3JpcHRvciwgdmFsdWVSZWNvcmRzID0gcmVjb3JkLnZhbHVlUmVjb3JkcztcclxuICAgIGlmICh2YWx1ZVJlY29yZHMgJiYgdmFsdWVSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBwYXRjaChkZXNjcmlwdG9yLnZhbHVlLCB2YWx1ZVJlY29yZHMpO1xyXG4gICAgfVxyXG4gICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxudmFyIGRlZmF1bHRDb25zdHJ1Y3REZXNjcmlwdG9yID0ge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlXHJcbn07XHJcbmZ1bmN0aW9uIHBhdGNoQ29uc3RydWN0KHRhcmdldCwgcmVjb3JkKSB7XHJcbiAgICB2YXIgYXJncyA9IHJlY29yZC5hcmdzLCBfYSA9IHJlY29yZC5kZXNjcmlwdG9yLCBkZXNjcmlwdG9yID0gX2EgPT09IHZvaWQgMCA/IGRlZmF1bHRDb25zdHJ1Y3REZXNjcmlwdG9yIDogX2EsIEN0b3IgPSByZWNvcmQuQ3RvciwgbmFtZSA9IHJlY29yZC5uYW1lLCBwcm9wZXJ0eVJlY29yZHMgPSByZWNvcmQucHJvcGVydHlSZWNvcmRzO1xyXG4gICAgdmFyIHZhbHVlID0gbmV3IChDdG9yLmJpbmQuYXBwbHkoQ3RvciwgdHNsaWJfMS5fX3NwcmVhZChbdm9pZCAwXSwgKGFyZ3MgfHwgW10pKSkpKCk7XHJcbiAgICBpZiAocHJvcGVydHlSZWNvcmRzKSB7XHJcbiAgICAgICAgcHJvcGVydHlSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkgeyByZXR1cm4gKGlzQ29uc3RydWN0UmVjb3JkKHJlY29yZCkgPyBwYXRjaENvbnN0cnVjdCh2YWx1ZSwgcmVjb3JkKSA6IHBhdGNoUGF0Y2godmFsdWUsIHJlY29yZCkpOyB9KTtcclxuICAgIH1cclxuICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgbGFuZ18xLmFzc2lnbih7IHZhbHVlOiB2YWx1ZSB9LCBkZXNjcmlwdG9yKSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHRha2UgYSB2YWx1ZSBmcm9tIGFycmF5IGJlaW5nIHBhdGNoZWQgYW5kIHRoZSB0YXJnZXQgdmFsdWUgZnJvbSB0aGUgc2FtZVxyXG4gKiBpbmRleCBhbmQgZGV0ZXJtaW5lcyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYWN0dWFsbHkgYmUgcGF0Y2hlZCBpbnRvIHRoZSB0YXJnZXQgYXJyYXlcclxuICovXHJcbmZ1bmN0aW9uIHJlc29sdmVUYXJnZXRWYWx1ZShwYXRjaFZhbHVlLCB0YXJnZXRWYWx1ZSkge1xyXG4gICAgdmFyIHBhdGNoSXNTcGxpY2VSZWNvcmRBcnJheSA9IGlzU3BsaWNlUmVjb3JkQXJyYXkocGF0Y2hWYWx1ZSk7XHJcbiAgICByZXR1cm4gcGF0Y2hJc1NwbGljZVJlY29yZEFycmF5IHx8IGlzUGF0Y2hSZWNvcmRBcnJheShwYXRjaFZhbHVlKVxyXG4gICAgICAgID8gcGF0Y2gocGF0Y2hJc1NwbGljZVJlY29yZEFycmF5XHJcbiAgICAgICAgICAgID8gaXNBcnJheSh0YXJnZXRWYWx1ZSkgPyB0YXJnZXRWYWx1ZSA6IFtdXHJcbiAgICAgICAgICAgIDogaXNQbGFpbk9iamVjdCh0YXJnZXRWYWx1ZSkgPyB0YXJnZXRWYWx1ZSA6IG9iamVjdENyZWF0ZShudWxsKSwgcGF0Y2hWYWx1ZSlcclxuICAgICAgICA6IHBhdGNoVmFsdWU7XHJcbn1cclxuLyoqXHJcbiAqIENvbXBhcmVzIHRvIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzIGFuZCByZXR1cm4gYSBzZXQgb2YgcmVjb3JkcyB3aGljaCBkZXNjcmliZSB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGUgdHdvXHJcbiAqXHJcbiAqIFRoZSByZWNvcmRzIGRlc2NyaWJlIHdoYXQgd291bGQgbmVlZCB0byBiZSBhcHBsaWVkIHRvIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gbWFrZSBpdCBsb29rIGxpa2UgdGhlIGZpcnN0IGFyZ3VtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSBhIFRoZSBwbGFpbiBvYmplY3Qgb3IgYXJyYXkgdG8gY29tcGFyZSB3aXRoXHJcbiAqIEBwYXJhbSBiIFRoZSBwbGFpbiBvYmplY3Qgb3IgYXJyYXkgdG8gY29tcGFyZSB0b1xyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvcHRpb25zIGJhZyB0aGF0IGFsbG93cyBjb25maWd1cmF0aW9uIG9mIHRoZSBiZWhhdmlvdXIgb2YgYGRpZmYoKWBcclxuICovXHJcbmZ1bmN0aW9uIGRpZmYoYSwgYiwgb3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cclxuICAgIGlmICh0eXBlb2YgYSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIGFyZSBub3Qgb2YgdHlwZSBvYmplY3QuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNBcnJheShhKSkge1xyXG4gICAgICAgIHJldHVybiBkaWZmQXJyYXkoYSwgYiwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNBcnJheShiKSkge1xyXG4gICAgICAgIGIgPSBvYmplY3RDcmVhdGUobnVsbCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoYSkgfHwgIWlzUGxhaW5PYmplY3QoYikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgYXJlIG5vdCBwbGFpbiBPYmplY3RzIG9yIEFycmF5cy4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaWZmUGxhaW5PYmplY3QoYSwgYiwgb3B0aW9ucyk7XHJcbn1cclxuZXhwb3J0cy5kaWZmID0gZGlmZjtcclxuLyoqXHJcbiAqIEFwcGx5IGEgc2V0IG9mIHBhdGNoIHJlY29yZHMgdG8gYSB0YXJnZXQuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHBsYWluIG9iamVjdCBvciBhcnJheSB0aGF0IHRoZSBwYXRjaCByZWNvcmRzIHNob3VsZCBiZSBhcHBsaWVkIHRvXHJcbiAqIEBwYXJhbSByZWNvcmRzIEEgc2V0IG9mIHBhdGNoIHJlY29yZHMgdG8gYmUgYXBwbGllZCB0byB0aGUgdGFyZ2V0XHJcbiAqL1xyXG5mdW5jdGlvbiBwYXRjaCh0YXJnZXQsIHJlY29yZHMpIHtcclxuICAgIGlmICghaXNBcnJheSh0YXJnZXQpICYmICFpc1BsYWluT2JqZWN0KHRhcmdldCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHRhcmdldCBmb3IgYSBwYXRjaCBtdXN0IGJlIGVpdGhlciBhbiBhcnJheSBvciBhIHBsYWluIG9iamVjdC4nKTtcclxuICAgIH1cclxuICAgIGlmIChpc0Zyb3plbih0YXJnZXQpIHx8IGlzU2VhbGVkKHRhcmdldCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgcGF0Y2ggc2VhbGVkIG9yIGZyb3plbiBvYmplY3RzLicpO1xyXG4gICAgfVxyXG4gICAgcmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcclxuICAgICAgICB0YXJnZXQgPSBpc1NwbGljZVJlY29yZChyZWNvcmQpXHJcbiAgICAgICAgICAgID8gcGF0Y2hTcGxpY2UoaXNBcnJheSh0YXJnZXQpID8gdGFyZ2V0IDogW10sIHJlY29yZCkgLyogcGF0Y2ggYXJyYXlzICovXHJcbiAgICAgICAgICAgIDogaXNDb25zdHJ1Y3RSZWNvcmQocmVjb3JkKVxyXG4gICAgICAgICAgICAgICAgPyBwYXRjaENvbnN0cnVjdCh0YXJnZXQsIHJlY29yZCkgLyogcGF0Y2ggY29tcGxleCBvYmplY3QgKi9cclxuICAgICAgICAgICAgICAgIDogcGF0Y2hQYXRjaChpc1BsYWluT2JqZWN0KHRhcmdldCkgPyB0YXJnZXQgOiB7fSwgcmVjb3JkKTsgLyogcGF0Y2ggcGxhaW4gb2JqZWN0ICovXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZXhwb3J0cy5wYXRjaCA9IHBhdGNoO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvY29tcGFyZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9jb21wYXJlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RcIik7XHJcbnZhciBBc3NlcnRpb25FcnJvcl8xID0gcmVxdWlyZShcIi4vQXNzZXJ0aW9uRXJyb3JcIik7XHJcbnZhciBjb21wYXJlXzEgPSByZXF1aXJlKFwiLi9jb21wYXJlXCIpO1xyXG5mdW5jdGlvbiBhc3NpZ25DaGlsZFByb3BlcnRpZXNCeUtleU9ySW5kZXgodGFyZ2V0LCBrZXlPckluZGV4LCBwcm9wZXJ0aWVzLCBieUtleSkge1xyXG4gICAgdmFyIG5vZGUgPSBmaW5kQnlLZXlPckluZGV4KHRhcmdldCwga2V5T3JJbmRleCwgYnlLZXkpLmZvdW5kO1xyXG4gICAgaWYgKCFub2RlIHx8ICEoZF8xLmlzV05vZGUobm9kZSkgfHwgZF8xLmlzVk5vZGUobm9kZSkpKSB7XHJcbiAgICAgICAgdmFyIGtleU9ySW5kZXhTdHJpbmcgPSB0eXBlb2Yga2V5T3JJbmRleCA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShrZXlPckluZGV4KSA6IGtleU9ySW5kZXg7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigoYnlLZXkgfHwgdHlwZW9mIGtleU9ySW5kZXggPT09ICdvYmplY3QnID8gJ0tleScgOiAnSW5kZXgnKSArIFwiIG9mIFxcXCJcIiArIGtleU9ySW5kZXhTdHJpbmcgKyBcIlxcXCIgaXMgbm90IHJlc29sdmluZyB0byBhIHZhbGlkIHRhcmdldFwiKTtcclxuICAgIH1cclxuICAgIGFzc2lnblByb3BlcnRpZXMobm9kZSwgcHJvcGVydGllcyk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbmZ1bmN0aW9uIGFzc2lnbkNoaWxkUHJvcGVydGllcyh0YXJnZXQsIGluZGV4LCBwcm9wZXJ0aWVzKSB7XHJcbiAgICByZXR1cm4gYXNzaWduQ2hpbGRQcm9wZXJ0aWVzQnlLZXlPckluZGV4KHRhcmdldCwgaW5kZXgsIHByb3BlcnRpZXMpO1xyXG59XHJcbmV4cG9ydHMuYXNzaWduQ2hpbGRQcm9wZXJ0aWVzID0gYXNzaWduQ2hpbGRQcm9wZXJ0aWVzO1xyXG5mdW5jdGlvbiBhc3NpZ25DaGlsZFByb3BlcnRpZXNCeUtleSh0YXJnZXQsIGtleSwgcHJvcGVydGllcykge1xyXG4gICAgcmV0dXJuIGFzc2lnbkNoaWxkUHJvcGVydGllc0J5S2V5T3JJbmRleCh0YXJnZXQsIGtleSwgcHJvcGVydGllcywgdHJ1ZSk7XHJcbn1cclxuZXhwb3J0cy5hc3NpZ25DaGlsZFByb3BlcnRpZXNCeUtleSA9IGFzc2lnbkNoaWxkUHJvcGVydGllc0J5S2V5O1xyXG5mdW5jdGlvbiBhc3NpZ25Qcm9wZXJ0aWVzKHRhcmdldCwgcHJvcGVydGllcykge1xyXG4gICAgbGFuZ18xLmFzc2lnbih0YXJnZXQucHJvcGVydGllcywgcHJvcGVydGllcyk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbmV4cG9ydHMuYXNzaWduUHJvcGVydGllcyA9IGFzc2lnblByb3BlcnRpZXM7XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gd2hpY2gsIHdoZW4gcGxhY2VkIGluIGFuIGV4cGVjdGVkIHJlbmRlciwgd2lsbCBjYWxsIHRoZSBgY2FsbGJhY2tgLiAgSWYgdGhlIGBjYWxsYmFja2AgcmV0dXJucyBgdHJ1ZWAsIHRoZSB2YWx1ZVxyXG4gKiBvZiB0aGUgcHJvcGVydHkgaXMgY29uc2lkZXJlZCBlcXVhbCwgb3RoZXJ3aXNlIGl0IGlzIGNvbnNpZGVyZWQgbm90IGVxdWFsIGFuZCB0aGUgZXhwZWN0ZWQgcmVuZGVyIHdpbGwgZmFpbC5cclxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIHdoZW4gY29tcGFyaW5nIHRoZSBwcm9wZXJ0eSB2YWx1ZVxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGFyZVByb3BlcnR5KGNhbGxiYWNrKSB7XHJcbiAgICBmdW5jdGlvbiBkaWZmZXIodmFsdWUsIG5hbWUsIHBhcmVudCkge1xyXG4gICAgICAgIGlmICghY2FsbGJhY2sodmFsdWUsIG5hbWUsIHBhcmVudCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yXzEuZGVmYXVsdChcIlRoZSB2YWx1ZSBvZiBwcm9wZXJ0eSBcXFwiXCIgKyBuYW1lICsgXCJcXFwiIGlzIHVuZXhwZWN0ZWQuXCIsIHt9LCBkaWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgY29tcGFyZV8xLkN1c3RvbURpZmYoZGlmZmVyKTtcclxufVxyXG5leHBvcnRzLmNvbXBhcmVQcm9wZXJ0eSA9IGNvbXBhcmVQcm9wZXJ0eTtcclxuZnVuY3Rpb24gcmVwbGFjZUNoaWxkQnlLZXlPckluZGV4KHRhcmdldCwgaW5kZXhPcktleSwgcmVwbGFjZW1lbnQsIGJ5S2V5KSB7XHJcbiAgICBpZiAoYnlLZXkgPT09IHZvaWQgMCkgeyBieUtleSA9IGZhbHNlOyB9XHJcbiAgICBpZiAoIXRhcmdldC5jaGlsZHJlbikge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBoYXZlIGNoaWxkcmVuLicpO1xyXG4gICAgfVxyXG4gICAgdmFyIF9hID0gZmluZEJ5S2V5T3JJbmRleCh0YXJnZXQsIGluZGV4T3JLZXksIGJ5S2V5KSwgcGFyZW50ID0gX2EucGFyZW50LCBpbmRleCA9IF9hLmluZGV4O1xyXG4gICAgaWYgKCFwYXJlbnQgfHwgdHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJyB8fCAhcGFyZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgaWYgKGJ5S2V5IHx8IHR5cGVvZiBpbmRleE9yS2V5ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiS2V5IG9mIFxcXCJcIiArICh0eXBlb2YgaW5kZXhPcktleSA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShpbmRleE9yS2V5KSA6IGluZGV4T3JLZXkpICsgXCJcXFwiIGlzIG5vdCByZXNvbHZpbmcgdG8gYSB2YWxpZCB0YXJnZXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW5kZXggb2YgXFxcIlwiICsgaW5kZXhPcktleSArIFwiXFxcIiBpcyBub3QgcmVzb2x2aW5nIHRvIGEgdmFsaWQgdGFyZ2V0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHBhcmVudC5jaGlsZHJlbltpbmRleF0gPSByZXBsYWNlbWVudDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSBjaGlsZCBvZiB0aGUgdGFyZ2V0IHRoYXQgaGFzIHRoZSBwcm92aWRlZCBrZXksIGFuZCByZXBsYWNlcyBpdCB3aXRoIHRoZSBwcm92aWRlZCBub2RlLlxyXG4gKlxyXG4gKiAqTk9URToqIFRoZSByZXBsYWNlbWVudCBtb2RpZmllcyB0aGUgcGFzc2VkIGB0YXJnZXRgIGFuZCBkb2VzIG5vdCByZXR1cm4gYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGBETm9kZWAuXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIEROb2RlIHRvIHJlcGxhY2UgYSBjaGlsZCBlbGVtZW50IG9uXHJcbiAqIEBwYXJhbSBrZXkgVGhlIGtleSBvZiB0aGUgbm9kZSB0byByZXBsYWNlXHJcbiAqIEBwYXJhbSByZXBsYWNlbWVudCBUaGUgRE5vZGUgdGhhdCByZXBsYWNlcyB0aGUgZm91bmQgbm9kZVxyXG4gKiBAcmV0dXJucyB7V05vZGUgfCBWTm9kZX1cclxuICovXHJcbmZ1bmN0aW9uIHJlcGxhY2VDaGlsZEJ5S2V5KHRhcmdldCwga2V5LCByZXBsYWNlbWVudCkge1xyXG4gICAgcmV0dXJuIHJlcGxhY2VDaGlsZEJ5S2V5T3JJbmRleCh0YXJnZXQsIGtleSwgcmVwbGFjZW1lbnQsIHRydWUpO1xyXG59XHJcbmV4cG9ydHMucmVwbGFjZUNoaWxkQnlLZXkgPSByZXBsYWNlQ2hpbGRCeUtleTtcclxuLyoqXHJcbiAqIFJlcGxhY2UgYSBjaGlsZCBvZiBETm9kZS5cclxuICpcclxuICogKk5PVEU6KiBUaGUgcmVwbGFjZW1lbnQgbW9kaWZpZXMgdGhlIHBhc3NlZCBgdGFyZ2V0YCBhbmQgZG9lcyBub3QgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBgRE5vZGVgLlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSBETm9kZSB0byByZXBsYWNlIGEgY2hpbGQgZWxlbWVudCBvblxyXG4gKiBAcGFyYW0gaW5kZXggQSBudW1iZXIgb2YgdGhlIGluZGV4IG9mIGEgY2hpbGQsIG9yIGEgc3RyaW5nIHdpdGggY29tbWEgc2VwYXJhdGVkIGluZGV4ZXMgdGhhdCB3b3VsZCBuYXZpZ2F0ZVxyXG4gKiBAcGFyYW0gcmVwbGFjZW1lbnQgVGhlIEROb2RlIHRvIGJlIHJlcGxhY2VkXHJcbiAqL1xyXG5mdW5jdGlvbiByZXBsYWNlQ2hpbGQodGFyZ2V0LCBpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHJldHVybiByZXBsYWNlQ2hpbGRCeUtleU9ySW5kZXgodGFyZ2V0LCBpbmRleCwgcmVwbGFjZW1lbnQpO1xyXG59XHJcbmV4cG9ydHMucmVwbGFjZUNoaWxkID0gcmVwbGFjZUNoaWxkO1xyXG5mdW5jdGlvbiBpc05vZGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsO1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRCeUtleU9ySW5kZXgodGFyZ2V0LCBrZXlPckluZGV4LCBieUtleSkge1xyXG4gICAgaWYgKGJ5S2V5ID09PSB2b2lkIDApIHsgYnlLZXkgPSBmYWxzZTsgfVxyXG4gICAgaWYgKGJ5S2V5IHx8IHR5cGVvZiBrZXlPckluZGV4ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHJldHVybiBmaW5kQnlLZXkodGFyZ2V0LCBrZXlPckluZGV4KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmaW5kQnlJbmRleCh0YXJnZXQsIGtleU9ySW5kZXgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGZpbmRCeUtleSh0YXJnZXQsIGtleSwgcGFyZW50LCBpbmRleCkge1xyXG4gICAgaWYgKHRhcmdldC5wcm9wZXJ0aWVzLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcGFyZW50OiBwYXJlbnQsIGZvdW5kOiB0YXJnZXQsIGluZGV4OiBpbmRleCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKCF0YXJnZXQuY2hpbGRyZW4pIHtcclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbiAgICB2YXIgbm9kZUluZm87XHJcbiAgICB0YXJnZXQuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGlzTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVJbmZvICYmIG5vZGVJbmZvLmZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmluZEJ5S2V5KGNoaWxkLCBrZXksIHRhcmdldCwgaW5kZXgpLmZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRHVwbGljYXRlIGtleSBvZiBcXFwiXCIgKyAodHlwZW9mIGtleSA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShrZXkpIDoga2V5KSArIFwiXFxcIiBmb3VuZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSW5mbyA9IGZpbmRCeUtleShjaGlsZCwga2V5LCB0YXJnZXQsIGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5vZGVJbmZvIHx8IHt9O1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRCeUluZGV4KHRhcmdldCwgaW5kZXgpIHtcclxuICAgIGlmICh0eXBlb2YgaW5kZXggPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldC5jaGlsZHJlbiA/IHsgcGFyZW50OiB0YXJnZXQsIGZvdW5kOiB0YXJnZXQuY2hpbGRyZW5baW5kZXhdLCBpbmRleDogaW5kZXggfSA6IHt9O1xyXG4gICAgfVxyXG4gICAgdmFyIGluZGV4ZXMgPSBpbmRleC5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xyXG4gICAgdmFyIGxhc3RJbmRleCA9IGluZGV4ZXMucG9wKCk7XHJcbiAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpbmRleGVzLnJlZHVjZShmdW5jdGlvbiAodGFyZ2V0LCBpZHgpIHtcclxuICAgICAgICBpZiAoIShkXzEuaXNXTm9kZSh0YXJnZXQpIHx8IGRfMS5pc1ZOb2RlKHRhcmdldCkpIHx8ICF0YXJnZXQuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldC5jaGlsZHJlbltpZHhdO1xyXG4gICAgfSwgdGFyZ2V0KTtcclxuICAgIGlmICghKGRfMS5pc1dOb2RlKHJlc29sdmVkVGFyZ2V0KSB8fCBkXzEuaXNWTm9kZShyZXNvbHZlZFRhcmdldCkpIHx8ICFyZXNvbHZlZFRhcmdldC5jaGlsZHJlbikge1xyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IHBhcmVudDogcmVzb2x2ZWRUYXJnZXQsIGZvdW5kOiByZXNvbHZlZFRhcmdldC5jaGlsZHJlbltsYXN0SW5kZXhdLCBpbmRleDogbGFzdEluZGV4IH07XHJcbn1cclxuLyoqXHJcbiAqIEZpbmQgYSB2aXJ0dWFsIERPTSBub2RlIChgV05vZGVgIG9yIGBWTm9kZWApIGJhc2VkIG9uIGl0IGhhdmluZyBhIG1hdGNoaW5nIGBrZXlgIHByb3BlcnR5LlxyXG4gKlxyXG4gKiBUaGUgZnVuY3Rpb24gcmV0dXJucyBgdW5kZWZpbmVkYCBpZiBubyBub2RlIHdhcyBmb3VuZCwgb3RoZXJ3aXNlIGl0IHJldHVybnMgdGhlIG5vZGUuICAqTk9URSogaXQgd2lsbCByZXR1cm4gdGhlIGZpcnN0IG5vZGVcclxuICogbWF0Y2hpbmcgdGhlIHN1cHBsaWVkIGBrZXlgLCBidXQgd2lsbCBgY29uc29sZS53YXJuYCBpZiBtb3JlIHRoYW4gb25lIG5vZGUgd2FzIGZvdW5kLlxyXG4gKi9cclxuZnVuY3Rpb24gZmluZEtleSh0YXJnZXQsIGtleSkge1xyXG4gICAgdmFyIGZvdW5kID0gZmluZEJ5S2V5KHRhcmdldCwga2V5KS5mb3VuZDtcclxuICAgIHJldHVybiBmb3VuZDtcclxufVxyXG5leHBvcnRzLmZpbmRLZXkgPSBmaW5kS2V5O1xyXG4vKipcclxuICogUmV0dXJuIGEgYEROb2RlYCB0aGF0IGlzIGlkZW50aWZpZWQgYnkgc3VwcGxpZWQgaW5kZXhcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGBXTm9kZWAgb3IgYFZOb2RlYCB0byByZXNvbHZlIHRoZSBpbmRleCBmb3JcclxuICogQHBhcmFtIGluZGV4IEEgbnVtYmVyIG9yIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIGNoaWxkIGluZGV4XHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kSW5kZXgodGFyZ2V0LCBpbmRleCkge1xyXG4gICAgdmFyIGZvdW5kID0gZmluZEJ5SW5kZXgodGFyZ2V0LCBpbmRleCkuZm91bmQ7XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbn1cclxuZXhwb3J0cy5maW5kSW5kZXggPSBmaW5kSW5kZXg7XHJcbmZ1bmN0aW9uIHJlcGxhY2VDaGlsZFByb3BlcnRpZXNCeUtleU9ySW5kZXgodGFyZ2V0LCBpbmRleE9yS2V5LCBwcm9wZXJ0aWVzLCBieUtleSkge1xyXG4gICAgaWYgKGJ5S2V5ID09PSB2b2lkIDApIHsgYnlLZXkgPSBmYWxzZTsgfVxyXG4gICAgdmFyIGZvdW5kID0gZmluZEJ5S2V5T3JJbmRleCh0YXJnZXQsIGluZGV4T3JLZXksIGJ5S2V5KS5mb3VuZDtcclxuICAgIGlmICghZm91bmQgfHwgIShkXzEuaXNXTm9kZShmb3VuZCkgfHwgZF8xLmlzVk5vZGUoZm91bmQpKSkge1xyXG4gICAgICAgIGlmIChieUtleSB8fCB0eXBlb2YgaW5kZXhPcktleSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIktleSBvZiBcXFwiXCIgKyAodHlwZW9mIGluZGV4T3JLZXkgPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoaW5kZXhPcktleSkgOiBpbmRleE9yS2V5KSArIFwiXFxcIiBpcyBub3QgcmVzb2x2aW5nIHRvIGEgdmFsaWQgdGFyZ2V0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkluZGV4IG9mIFxcXCJcIiArIGluZGV4T3JLZXkgKyBcIlxcXCIgaXMgbm90IHJlc29sdmluZyB0byBhIHZhbGlkIHRhcmdldFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXBsYWNlUHJvcGVydGllcyhmb3VuZCwgcHJvcGVydGllcyk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VDaGlsZFByb3BlcnRpZXModGFyZ2V0LCBpbmRleCwgcHJvcGVydGllcykge1xyXG4gICAgcmV0dXJuIHJlcGxhY2VDaGlsZFByb3BlcnRpZXNCeUtleU9ySW5kZXgodGFyZ2V0LCBpbmRleCwgcHJvcGVydGllcyk7XHJcbn1cclxuZXhwb3J0cy5yZXBsYWNlQ2hpbGRQcm9wZXJ0aWVzID0gcmVwbGFjZUNoaWxkUHJvcGVydGllcztcclxuZnVuY3Rpb24gcmVwbGFjZUNoaWxkUHJvcGVydGllc0J5S2V5KHRhcmdldCwga2V5LCBwcm9wZXJ0aWVzKSB7XHJcbiAgICByZXR1cm4gcmVwbGFjZUNoaWxkUHJvcGVydGllc0J5S2V5T3JJbmRleCh0YXJnZXQsIGtleSwgcHJvcGVydGllcywgdHJ1ZSk7XHJcbn1cclxuZXhwb3J0cy5yZXBsYWNlQ2hpbGRQcm9wZXJ0aWVzQnlLZXkgPSByZXBsYWNlQ2hpbGRQcm9wZXJ0aWVzQnlLZXk7XHJcbmZ1bmN0aW9uIHJlcGxhY2VQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcGVydGllcykge1xyXG4gICAgdGFyZ2V0LnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5leHBvcnRzLnJlcGxhY2VQcm9wZXJ0aWVzID0gcmVwbGFjZVByb3BlcnRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vdGVzdC1leHRyYXMvc3VwcG9ydC9kLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby90ZXN0LWV4dHJhcy9zdXBwb3J0L2QuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2hhc1wiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2xhbmdcIik7XHJcbmhhc18xLmFkZCgnY3VzdG9tZXZlbnQtY29uc3RydWN0b3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ2ZvbycpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG4vKipcclxuICogQ3JlYXRlIGFuZCBkaXNwYXRjaCBhbiBldmVudCB0byBhbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB0eXBlIFRoZSBldmVudCB0eXBlIHRvIGRpc3BhdGNoXHJcbiAqIEBwYXJhbSBvcHRpb25zIEEgbWFwIG9mIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBldmVudFxyXG4gKi9cclxuZnVuY3Rpb24gc2VuZEV2ZW50KHRhcmdldCwgdHlwZSwgb3B0aW9ucykge1xyXG4gICAgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCh0YXJnZXQsIGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGVycm9yO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNhdGNoZXIoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGVycm9yID0gZS5lcnJvcjtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGNhdGNoZXIpO1xyXG4gICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjYXRjaGVyKTtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIF9hID0gb3B0aW9ucyB8fCB7fSwgX2IgPSBfYS5ldmVudENsYXNzLCBldmVudENsYXNzID0gX2IgPT09IHZvaWQgMCA/ICdDdXN0b21FdmVudCcgOiBfYiwgX2MgPSBfYS5ldmVudEluaXQsIGV2ZW50SW5pdCA9IF9jID09PSB2b2lkIDAgPyB7fSA6IF9jLCBfZCA9IF9hLnNlbGVjdG9yLCBzZWxlY3RvciA9IF9kID09PSB2b2lkIDAgPyAnJyA6IF9kO1xyXG4gICAgdmFyIGRpc3BhdGNoVGFyZ2V0O1xyXG4gICAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yVGFyZ2V0ID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgICAgIGlmIChzZWxlY3RvclRhcmdldCkge1xyXG4gICAgICAgICAgICBkaXNwYXRjaFRhcmdldCA9IHNlbGVjdG9yVGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlc29sdmUgdG8gYW4gZWxlbWVudCB3aXRoIHNlbGVjdG9yIFxcXCJcIiArIHNlbGVjdG9yICsgXCJcXFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRpc3BhdGNoVGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYgKGRpc3BhdGNoVGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50XzE7XHJcbiAgICAgICAgbGFuZ18xLmFzc2lnbihldmVudEluaXQsIHtcclxuICAgICAgICAgICAgYnViYmxlczogJ2J1YmJsZXMnIGluIGV2ZW50SW5pdCA/IGV2ZW50SW5pdC5idWJibGVzIDogdHJ1ZSxcclxuICAgICAgICAgICAgY2FuY2VsYWJsZTogJ2NhbmNlbGFibGUnIGluIGV2ZW50SW5pdCA/IGV2ZW50SW5pdC5jYW5jZWxhYmxlIDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBidWJibGVzID0gZXZlbnRJbml0LmJ1YmJsZXMsIGNhbmNlbGFibGUgPSBldmVudEluaXQuY2FuY2VsYWJsZSwgaW5pdFByb3BzID0gdHNsaWJfMS5fX3Jlc3QoZXZlbnRJbml0LCBbXCJidWJibGVzXCIsIFwiY2FuY2VsYWJsZVwiXSk7XHJcbiAgICAgICAgaWYgKGhhc18xLmRlZmF1bHQoJ2N1c3RvbWV2ZW50LWNvbnN0cnVjdG9yJykpIHtcclxuICAgICAgICAgICAgdmFyIGN0b3JOYW1lID0gZXZlbnRDbGFzcyBpbiB3aW5kb3cgPyBldmVudENsYXNzIDogJ0N1c3RvbUV2ZW50JztcclxuICAgICAgICAgICAgZXZlbnRfMSA9IG5ldyB3aW5kb3dbY3Rvck5hbWVdKHR5cGUsIGV2ZW50SW5pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvKiBiZWNhdXNlIHRoZSBhcml0eSB2YXJpZXMgdG9vIGdyZWF0bHkgdG8gYmUgYWJsZSB0byBwcm9wZXJseSBjYWxsIGFsbCB0aGUgZXZlbnQgdHlwZXMsIHdlIHdpbGxcclxuICAgICAgICAgICAgKiBvbmx5IHN1cHBvcnQgQ3VzdG9tRXZlbnQgZm9yIHRob3NlIHBsYXRmb3JtcyB0aGF0IGRvbid0IHN1cHBvcnQgZXZlbnQgY29uc3RydWN0b3JzLCB3aGljaCBpc1xyXG4gICAgICAgICAgICAqIGVzc2VudGlhbGx5IElFMTEgKi9cclxuICAgICAgICAgICAgZXZlbnRfMSA9IGRpc3BhdGNoVGFyZ2V0Lm93bmVyRG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XHJcbiAgICAgICAgICAgIGV2ZW50XzEuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGJ1YmJsZXMsIGNhbmNlbGFibGUsIHt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGFuZ18xLmRlZXBBc3NpZ24oZXZlbnRfMSwgaW5pdFByb3BzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLyogc3dhbGxvd2luZyBhc3NpZ25tZW50IGVycm9ycyB3aGVuIHRyeWluZyB0byBvdmVyd3JpdGUgbmF0aXZlIGV2ZW50IHByb3BlcnRpZXMgKi9cclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGF0Y2hFdmVudChkaXNwYXRjaFRhcmdldCwgZXZlbnRfMSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gc2VuZEV2ZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3Rlc3QtZXh0cmFzL3N1cHBvcnQvc2VuZEV2ZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby90ZXN0LWV4dHJhcy9zdXBwb3J0L3NlbmRFdmVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnNVbVVpNFNoIHtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG5cXG4uXzJNazZSZHFhIHtcXG5cXHRjb2xvcjogI2ZmZjtcXG5cXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXFx0bWFyZ2luOiAwIDYuNHB4O1xcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXHRkaXNwbGF5OiAtd2Via2l0LWJveDtcXG5cXHRkaXNwbGF5OiAtbXMtZmxleGJveDtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxuXFx0LXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XFxuXFx0ICAgIC1tcy1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdCAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHQtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuXFx0ICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG5cXHQgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGhlaWdodDogNDhweDtcXG5cXHRjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5fMk1rNlJkcWE6OmFmdGVyIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG5cXHRjb250ZW50OiBcXFwiXFxcIjtcXG5cXHRiYWNrZ3JvdW5kOiAjZmZmO1xcblxcdGhlaWdodDogMnB4O1xcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXHR3aWR0aDogMTAwJTtcXG5cXHRib3R0b206IDA7XFxuXFx0LXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuM3MgZWFzZS1vdXQ7XFxuXFx0dHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjNzIGVhc2Utb3V0O1xcblxcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgZWFzZS1vdXQ7XFxuXFx0dHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zcyBlYXNlLW91dCwgLXdlYmtpdC10cmFuc2Zvcm0gLjNzIGVhc2Utb3V0O1xcblxcdC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDNweCk7XFxuXFx0ICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoM3B4KTtcXG59XFxuXFxuLl8xLWYzSXRPaDo6YWZ0ZXIge1xcblxcdC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcblxcdCAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvSUVVc2VyL2NsaS1idWlsZC13aWRnZXQvdGVzdC1hcHAvc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtDQUNDLGFBQWE7Q0FDYixzQkFBc0I7Q0FDdEI7O0FBRUQ7Q0FDQyxZQUFZO0NBQ1osc0JBQXNCO0NBQ3RCLGdCQUFnQjtDQUNoQixtQkFBbUI7Q0FDbkIscUJBQXFCO0NBQ3JCLHFCQUFxQjtDQUNyQixjQUFjO0NBQ2QsNkJBQTZCO0NBQzdCLDhCQUE4QjtLQUMxQiwyQkFBMkI7U0FDdkIsdUJBQXVCO0NBQy9CLHlCQUF5QjtLQUNyQixzQkFBc0I7U0FDbEIsd0JBQXdCO0NBQ2hDLGFBQWE7Q0FDYixnQkFBZ0I7Q0FDaEI7O0FBRUQ7Q0FDQyxlQUFlO0NBQ2YsWUFBWTtDQUNaLGlCQUFpQjtDQUNqQixZQUFZO0NBQ1osbUJBQW1CO0NBQ25CLFlBQVk7Q0FDWixVQUFVO0NBQ1YsbURBQW1EO0NBQ25ELDJDQUEyQztDQUMzQyxtQ0FBbUM7Q0FDbkMsbUVBQW1FO0NBQ25FLG1DQUFtQztTQUMzQiwyQkFBMkI7Q0FDbkM7O0FBRUQ7Q0FDQyxpQ0FBaUM7U0FDekIseUJBQXlCO0NBQ2pDXCIsXCJmaWxlXCI6XCJtZW51SXRlbS5tLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIucm9vdCB7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLml0ZW0ge1xcblxcdGNvbG9yOiAjZmZmO1xcblxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cXHRtYXJnaW46IDAgNi40cHg7XFxuXFx0cG9zaXRpb246IHJlbGF0aXZlO1xcblxcdGRpc3BsYXk6IC13ZWJraXQtYm94O1xcblxcdGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0LXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG5cXHQtd2Via2l0LWJveC1kaXJlY3Rpb246IG5vcm1hbDtcXG5cXHQgICAgLW1zLWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0ICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcXG5cXHQgICAgLW1zLWZsZXgtcGFjazogY2VudGVyO1xcblxcdCAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0aGVpZ2h0OiA0OHB4O1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLml0ZW06OmFmdGVyIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG5cXHRjb250ZW50OiBcXFwiXFxcIjtcXG5cXHRiYWNrZ3JvdW5kOiAjZmZmO1xcblxcdGhlaWdodDogMnB4O1xcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXHR3aWR0aDogMTAwJTtcXG5cXHRib3R0b206IDA7XFxuXFx0LXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAuM3MgZWFzZS1vdXQ7XFxuXFx0dHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gLjNzIGVhc2Utb3V0O1xcblxcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAuM3MgZWFzZS1vdXQ7XFxuXFx0dHJhbnNpdGlvbjogdHJhbnNmb3JtIC4zcyBlYXNlLW91dCwgLXdlYmtpdC10cmFuc2Zvcm0gLjNzIGVhc2Utb3V0O1xcblxcdC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDNweCk7XFxuXFx0ICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoM3B4KTtcXG59XFxuXFxuLnNlbGVjdGVkOjphZnRlciB7XFxuXFx0LXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuXFx0ICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcIiBfa2V5XCI6IFwibWVudUl0ZW1cIixcblx0XCJyb290XCI6IFwic1VtVWk0U2hcIixcblx0XCJpdGVtXCI6IFwiXzJNazZSZHFhXCIsXG5cdFwic2VsZWN0ZWRcIjogXCJfMS1mM0l0T2hcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kZWNvcmF0b3ItbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOnRydWUsXCJzb3VyY2VNYXBcIjp0cnVlLFwiaW1wb3J0TG9hZGVyc1wiOjEsXCJsb2NhbElkZW50TmFtZVwiOlwiW2hhc2g6YmFzZTY0OjhdXCJ9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJpZGVudFwiOlwicG9zdGNzc1wiLFwicGx1Z2luc1wiOltudWxsLHtcInZlcnNpb25cIjpcIjYuMC4xN1wiLFwicGx1Z2luc1wiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSxcInBvc3Rjc3NQbHVnaW5cIjpcInBvc3Rjc3MtY3NzbmV4dFwiLFwicG9zdGNzc1ZlcnNpb25cIjpcIjYuMC4xN1wifV19IS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT1jc3MhLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kZWNvcmF0b3ItbG9hZGVyL2luZGV4LmpzIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/e1wibW9kdWxlc1wiOnRydWUsXCJzb3VyY2VNYXBcIjp0cnVlLFwiaW1wb3J0TG9hZGVyc1wiOjEsXCJsb2NhbElkZW50TmFtZVwiOlwiW2hhc2g6YmFzZTY0OjhdXCJ9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz97XCJpZGVudFwiOlwicG9zdGNzc1wiLFwicGx1Z2luc1wiOltudWxsLHtcInZlcnNpb25cIjpcIjYuMC4xN1wiLFwicGx1Z2luc1wiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSxcInBvc3Rjc3NQbHVnaW5cIjpcInBvc3Rjc3MtY3NzbmV4dFwiLFwicG9zdGNzc1ZlcnNpb25cIjpcIjYuMC4xN1wifV19IS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXIvaW5kZXguanM/dHlwZT1jc3MhLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuXzNiQTZqZFNuIHtcXG5cXHR3aWR0aDogMTAwJTtcXG5cXHR0b3A6IDA7XFxuXFx0aGVpZ2h0OiA0OHB4O1xcblxcdHotaW5kZXg6IDEwMDtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWQxZjIwO1xcbn1cXG5cXG4uXzFlb0dmcWt1IHtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0bWFyZ2luOiAwIGF1dG87XFxufVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9JRVVzZXIvY2xpLWJ1aWxkLXdpZGdldC90ZXN0LWFwcC9zcmMvbWVudS9tZW51Lm0uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0NBQ0MsWUFBWTtDQUNaLE9BQU87Q0FDUCxhQUFhO0NBQ2IsYUFBYTtDQUNiLDBCQUEwQjtDQUMxQjs7QUFFRDtDQUNDLGFBQWE7Q0FDYixlQUFlO0NBQ2ZcIixcImZpbGVcIjpcIm1lbnUubS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnJvb3Qge1xcblxcdHdpZHRoOiAxMDAlO1xcblxcdHRvcDogMDtcXG5cXHRoZWlnaHQ6IDQ4cHg7XFxuXFx0ei1pbmRleDogMTAwO1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxZDFmMjA7XFxufVxcblxcbi5tZW51Q29udGFpbmVyIHtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0bWFyZ2luOiAwIGF1dG87XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcIiBfa2V5XCI6IFwibWVudVwiLFxuXHRcInJvb3RcIjogXCJfM2JBNmpkU25cIixcblx0XCJtZW51Q29udGFpbmVyXCI6IFwiXzFlb0dmcWt1XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlciEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjp0cnVlLFwic291cmNlTWFwXCI6dHJ1ZSxcImltcG9ydExvYWRlcnNcIjoxLFwibG9jYWxJZGVudE5hbWVcIjpcIltoYXNoOmJhc2U2NDo4XVwifSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wiaWRlbnRcIjpcInBvc3Rjc3NcIixcInBsdWdpbnNcIjpbbnVsbCx7XCJ2ZXJzaW9uXCI6XCI2LjAuMTdcIixcInBsdWdpbnNcIjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sXCJwb3N0Y3NzUGx1Z2luXCI6XCJwb3N0Y3NzLWNzc25leHRcIixcInBvc3Rjc3NWZXJzaW9uXCI6XCI2LjAuMTdcIn1dfSEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9Y3NzIS4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlci9pbmRleC5qcyEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3tcIm1vZHVsZXNcIjp0cnVlLFwic291cmNlTWFwXCI6dHJ1ZSxcImltcG9ydExvYWRlcnNcIjoxLFwibG9jYWxJZGVudE5hbWVcIjpcIltoYXNoOmJhc2U2NDo4XVwifSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/e1wiaWRlbnRcIjpcInBvc3Rjc3NcIixcInBsdWdpbnNcIjpbbnVsbCx7XCJ2ZXJzaW9uXCI6XCI2LjAuMTdcIixcInBsdWdpbnNcIjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sXCJwb3N0Y3NzUGx1Z2luXCI6XCJwb3N0Y3NzLWNzc25leHRcIixcInBvc3Rjc3NWZXJzaW9uXCI6XCI2LjAuMTdcIn1dfSEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyL2luZGV4LmpzP3R5cGU9Y3NzIS4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbnZhciBJbmplY3RvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEluamVjdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSW5qZWN0b3IocGF5bG9hZCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEluamVjdG9yLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BheWxvYWQ7XHJcbiAgICB9O1xyXG4gICAgSW5qZWN0b3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XHJcbiAgICAgICAgdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBJbmplY3RvcjtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLkluamVjdG9yID0gSW5qZWN0b3I7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEluamVjdG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9JbmplY3Rvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxuLyoqXHJcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXHJcbiAqIExpc3RlbmluZyB0byAnUHJvamVjdG9yJyB3aWxsIG5vdGlmeSB3aGVuIHByb2plY3RvciBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcclxuICogTGlzdGVuaW5nIHRvICdXaWRnZXQnIHdpbGwgbm90aWZ5IHdoZW4gd2lkZ2V0IHJvb3QgaXMgY3JlYXRlZCBvciB1cGRhdGVkXHJcbiAqL1xyXG52YXIgTm9kZUV2ZW50VHlwZTtcclxuKGZ1bmN0aW9uIChOb2RlRXZlbnRUeXBlKSB7XHJcbiAgICBOb2RlRXZlbnRUeXBlW1wiUHJvamVjdG9yXCJdID0gXCJQcm9qZWN0b3JcIjtcclxuICAgIE5vZGVFdmVudFR5cGVbXCJXaWRnZXRcIl0gPSBcIldpZGdldFwiO1xyXG59KShOb2RlRXZlbnRUeXBlID0gZXhwb3J0cy5Ob2RlRXZlbnRUeXBlIHx8IChleHBvcnRzLk5vZGVFdmVudFR5cGUgPSB7fSkpO1xyXG52YXIgTm9kZUhhbmRsZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhOb2RlSGFuZGxlciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vZGVIYW5kbGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl9ub2RlTWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlTWFwLmdldChrZXkpO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLnNldChrZXksIGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IGtleSB9KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkUm9vdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkUHJvamVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuUHJvamVjdG9yIH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vZGVIYW5kbGVyO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuTm9kZUhhbmRsZXIgPSBOb2RlSGFuZGxlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTm9kZUhhbmRsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgUHJvbWlzZV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vUHJvbWlzZVwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgU3ltYm9sXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9TeW1ib2xcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG4vKipcclxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcclxuICovXHJcbmV4cG9ydHMuV0lER0VUX0JBU0VfVFlQRSA9IFN5bWJvbF8xLmRlZmF1bHQoJ1dpZGdldCBCYXNlJyk7XHJcbi8qKlxyXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBleHBvcnRzLldJREdFVF9CQVNFX1RZUEUpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IgPSBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjtcclxuZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxyXG4gICAgICAgIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdCkpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQgPSBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDtcclxuLyoqXHJcbiAqIFRoZSBSZWdpc3RyeSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxudmFyIFJlZ2lzdHJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnksIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBSZWdpc3RyeSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEVtaXQgbG9hZGVkIGV2ZW50IGZvciByZWdpc3RyeSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZW1pdExvYWRlZEV2ZW50ID0gZnVuY3Rpb24gKHdpZGdldExhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHtcclxuICAgICAgICAgICAgdHlwZTogd2lkZ2V0TGFiZWwsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvYWRlZCcsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGxhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIndpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICdcIiArIGxhYmVsLnRvU3RyaW5nKCkgKyBcIidcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICBpdGVtLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluamVjdG9yIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJ1wiICsgbGFiZWwudG9TdHJpbmcoKSArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl93aWRnZXRSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgICAgIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBpdGVtKCk7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0KHdpZGdldEN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICBfdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0Q3RvcjtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmdldEluamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5fd2lkZ2V0UmVnaXN0cnkgJiYgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmhhc0luamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSZWdpc3RyeTtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLlJlZ2lzdHJ5ID0gUmVnaXN0cnk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lzdHJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIFJlZ2lzdHJ5SGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKFJlZ2lzdHJ5SGFuZGxlciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJlZ2lzdHJ5SGFuZGxlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeV8xLlJlZ2lzdHJ5KCk7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAgPSBuZXcgTWFwXzEuTWFwKCk7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCA9IG5ldyBNYXBfMS5NYXAoKTtcclxuICAgICAgICBfdGhpcy5vd24oX3RoaXMuX3JlZ2lzdHJ5KTtcclxuICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKF90aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZShfdGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYmFzZVJlZ2lzdHJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy5vd24oeyBkZXN0cm95OiBkZXN0cm95IH0pO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLCBcImJhc2VcIiwge1xyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAobGFiZWwsIHdpZGdldCkge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlZmluZShsYWJlbCwgd2lkZ2V0KTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmRlZmluZUluamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsLCBpbmplY3Rvcikge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGxhYmVsLCBpbmplY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzKGxhYmVsKSB8fCBCb29sZWFuKHRoaXMuYmFzZVJlZ2lzdHJ5ICYmIHRoaXMuYmFzZVJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuaGFzSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxQcmVjZWRlbmNlID09PSB2b2lkIDApIHsgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldCcsIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXApO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZ2V0SW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpIHtcclxuICAgICAgICBpZiAoZ2xvYmFsUHJlY2VkZW5jZSA9PT0gdm9pZCAwKSB7IGdsb2JhbFByZWNlZGVuY2UgPSBmYWxzZTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXRJbmplY3RvcicsIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5fZ2V0ID0gZnVuY3Rpb24gKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCBnZXRGdW5jdGlvbk5hbWUsIGxhYmVsTWFwKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVnaXN0cmllcyA9IGdsb2JhbFByZWNlZGVuY2UgPyBbdGhpcy5iYXNlUmVnaXN0cnksIHRoaXMuX3JlZ2lzdHJ5XSA6IFt0aGlzLl9yZWdpc3RyeSwgdGhpcy5iYXNlUmVnaXN0cnldO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVnaXN0cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0cnkgPSByZWdpc3RyaWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0ZXJlZExhYmVscyA9IGxhYmVsTWFwLmdldChyZWdpc3RyeSkgfHwgW107XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyZWdpc3RlcmVkTGFiZWxzLmluZGV4T2YobGFiZWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9IHJlZ2lzdHJ5Lm9uKGxhYmVsLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpc1tnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIGxhYmVsTWFwLnNldChyZWdpc3RyeSwgdHNsaWJfMS5fX3NwcmVhZChyZWdpc3RlcmVkTGFiZWxzLCBbbGFiZWxdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJlZ2lzdHJ5SGFuZGxlcjtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLlJlZ2lzdHJ5SGFuZGxlciA9IFJlZ2lzdHJ5SGFuZGxlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUmVnaXN0cnlIYW5kbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5SGFuZGxlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBXZWFrTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9XZWFrTWFwXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vZFwiKTtcclxudmFyIGRpZmZfMSA9IHJlcXVpcmUoXCIuL2RpZmZcIik7XHJcbnZhciBSZWdpc3RyeUhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5SGFuZGxlclwiKTtcclxudmFyIE5vZGVIYW5kbGVyXzEgPSByZXF1aXJlKFwiLi9Ob2RlSGFuZGxlclwiKTtcclxudmFyIHZkb21fMSA9IHJlcXVpcmUoXCIuL3Zkb21cIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBkZWNvcmF0b3JNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG52YXIgYm91bmRBdXRvID0gZGlmZl8xLmF1dG8uYmluZChudWxsKTtcclxuLyoqXHJcbiAqIE1haW4gd2lkZ2V0IGJhc2UgZm9yIGFsbCB3aWRnZXRzIHRvIGV4dGVuZFxyXG4gKi9cclxudmFyIFdpZGdldEJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBXaWRnZXRCYXNlKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5kaWNhdGVzIGlmIGl0IGlzIHRoZSBpbml0aWFsIHNldCBwcm9wZXJ0aWVzIGN5Y2xlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5IG9mIHByb3BlcnR5IGtleXMgY29uc2lkZXJlZCBjaGFuZ2VkIGZyb20gdGhlIHByZXZpb3VzIHNldCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICB0aGlzLl9ib3VuZFJlbmRlckZ1bmMgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSA9IHRoaXMuaW52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5zZXQodGhpcywge1xyXG4gICAgICAgICAgICBkaXJ0eTogdHJ1ZSxcclxuICAgICAgICAgICAgb25BdHRhY2g6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRGV0YWNoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkRldGFjaCgpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxyXG4gICAgICAgICAgICByZWdpc3RyeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3JlUHJvcGVydGllczoge30sXHJcbiAgICAgICAgICAgIHJlbmRlcmluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIGlucHV0UHJvcGVydGllczoge31cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9ydW5BZnRlckNvbnN0cnVjdG9ycygpO1xyXG4gICAgfVxyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUubWV0YSA9IGZ1bmN0aW9uIChNZXRhVHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjYWNoZWQgPSB0aGlzLl9tZXRhTWFwLmdldChNZXRhVHlwZSk7XHJcbiAgICAgICAgaWYgKCFjYWNoZWQpIHtcclxuICAgICAgICAgICAgY2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcclxuICAgICAgICAgICAgICAgIGludmFsaWRhdGU6IHRoaXMuX2JvdW5kSW52YWxpZGF0ZSxcclxuICAgICAgICAgICAgICAgIG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcclxuICAgICAgICAgICAgICAgIGJpbmQ6IHRoaXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuc2V0KE1ldGFUeXBlLCBjYWNoZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGVkO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm9uQXR0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5vbkRldGFjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcInByb3BlcnRpZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJjaGFuZ2VkUHJvcGVydHlLZXlzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19zcHJlYWQodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3NldENvcmVQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAoY29yZVByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgYmFzZVJlZ2lzdHJ5ID0gY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5ICE9PSBiYXNlUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcl8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5iYXNlID0gYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAob3JpZ2luYWxQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzID0gb3JpZ2luYWxQcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5fcnVuQmVmb3JlUHJvcGVydGllcyhvcmlnaW5hbFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHZhciByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xyXG4gICAgICAgIHZhciBjaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XHJcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICBpZiAodGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPT09IGZhbHNlIHx8IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGFsbFByb3BlcnRpZXMgPSB0c2xpYl8xLl9fc3ByZWFkKHByb3BlcnR5TmFtZXMsIE9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrZWRQcm9wZXJ0aWVzID0gW107XHJcbiAgICAgICAgICAgIHZhciBkaWZmUHJvcGVydHlSZXN1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciBydW5SZWFjdGlvbnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gYWxsUHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGVja2VkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjaGVja2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNQcm9wZXJ0eSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdQcm9wZXJ0eSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnVuUmVhY3Rpb25zID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKFwiZGlmZlByb3BlcnR5OlwiICsgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzEgPSAwOyBpXzEgPCBkaWZmRnVuY3Rpb25zLmxlbmd0aDsgaV8xKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRpZmZGdW5jdGlvbnNbaV8xXShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGJvdW5kQXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJ1blJlYWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKHByb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpLmZvckVhY2goZnVuY3Rpb24gKGFyZ3MsIHJlYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MuY2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdGlvbi5jYWxsKF90aGlzLCBhcmdzLnByZXZpb3VzUHJvcGVydGllcywgYXJncy5uZXdQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gZGlmZlByb3BlcnR5UmVzdWx0cztcclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJjaGlsZHJlblwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0Q2hpbGRyZW5fXyA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPiAwIHx8IGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fcmVuZGVyX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlbmRlciA9IHRoaXMuX3J1bkJlZm9yZVJlbmRlcnMoKTtcclxuICAgICAgICB2YXIgZE5vZGUgPSByZW5kZXIoKTtcclxuICAgICAgICBkTm9kZSA9IHRoaXMucnVuQWZ0ZXJSZW5kZXJzKGROb2RlKTtcclxuICAgICAgICB0aGlzLl9ub2RlSGFuZGxlci5jbGVhcigpO1xyXG4gICAgICAgIHJldHVybiBkTm9kZTtcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdkaXYnLCB7fSwgdGhpcy5jaGlsZHJlbik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5hZGREZWNvcmF0b3IgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcclxuICAgICAgICAgICAgdmFyIGRlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JNYXAuZ2V0KHRoaXMuY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIWRlY29yYXRvckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvckxpc3QgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTWFwLnNldCh0aGlzLmNvbnN0cnVjdG9yLCBkZWNvcmF0b3JMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICAgICAgaWYgKCFzcGVjaWZpY0RlY29yYXRvckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdC5wdXNoLmFwcGx5KHNwZWNpZmljRGVjb3JhdG9yTGlzdCwgdHNsaWJfMS5fX3NwcmVhZCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGRlY29yYXRvcnMgPSB0aGlzLmdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCB0c2xpYl8xLl9fc3ByZWFkKGRlY29yYXRvcnMsIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gYnVpbGQgdGhlIGxpc3Qgb2YgZGVjb3JhdG9ycyBmcm9tIHRoZSBnbG9iYWwgZGVjb3JhdG9yIG1hcC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5ICBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqIEByZXR1cm4gQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX2J1aWxkRGVjb3JhdG9yTGlzdCA9IGZ1bmN0aW9uIChkZWNvcmF0b3JLZXkpIHtcclxuICAgICAgICB2YXIgYWxsRGVjb3JhdG9ycyA9IFtdO1xyXG4gICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgd2hpbGUgKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZU1hcCA9IGRlY29yYXRvck1hcC5nZXQoY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VNYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0b3JzID0gaW5zdGFuY2VNYXAuZ2V0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbERlY29yYXRvcnMudW5zaGlmdC5hcHBseShhbGxEZWNvcmF0b3JzLCB0c2xpYl8xLl9fc3ByZWFkKGRlY29yYXRvcnMpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJveXMgcHJpdmF0ZSByZXNvdXJjZXMgZm9yIFdpZGdldEJhc2VcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX2Rlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwLmZvckVhY2goZnVuY3Rpb24gKG1ldGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGEuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byByZXRyaWV2ZSBkZWNvcmF0b3IgdmFsdWVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuZ2V0RGVjb3JhdG9yID0gZnVuY3Rpb24gKGRlY29yYXRvcktleSkge1xyXG4gICAgICAgIHZhciBhbGxEZWNvcmF0b3JzID0gdGhpcy5fZGVjb3JhdG9yQ2FjaGUuZ2V0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgaWYgKGFsbERlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcclxuICAgICAgICB9XHJcbiAgICAgICAgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgIHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIGFsbERlY29yYXRvcnMpO1xyXG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMgPSBmdW5jdGlvbiAobmV3UHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlYWN0aW9uRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicpO1xyXG4gICAgICAgIHJldHVybiByZWFjdGlvbkZ1bmN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKHJlYWN0aW9uUHJvcGVydHlNYXAsIF9hKSB7XHJcbiAgICAgICAgICAgIHZhciByZWFjdGlvbiA9IF9hLnJlYWN0aW9uLCBwcm9wZXJ0eU5hbWUgPSBfYS5wcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgICAgIHZhciByZWFjdGlvbkFyZ3VtZW50cyA9IHJlYWN0aW9uUHJvcGVydHlNYXAuZ2V0KHJlYWN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKHJlYWN0aW9uQXJndW1lbnRzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzUHJvcGVydGllczoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UHJvcGVydGllczoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMucHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBfdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5uZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBuZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIGlmIChjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLmNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWN0aW9uUHJvcGVydHlNYXAuc2V0KHJlYWN0aW9uLCByZWFjdGlvbkFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiByZWFjdGlvblByb3BlcnR5TWFwO1xyXG4gICAgICAgIH0sIG5ldyBNYXBfMS5kZWZhdWx0KCkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdW5ib3VuZCBwcm9wZXJ0eSBmdW5jdGlvbnMgdG8gdGhlIHNwZWNpZmllZCBgYmluZGAgcHJvcGVydHlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvcGVydGllcyBwcm9wZXJ0aWVzIHRvIGNoZWNrIGZvciBmdW5jdGlvbnNcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX2JpbmRGdW5jdGlvblByb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5LCBiaW5kKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJyAmJiBSZWdpc3RyeV8xLmlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKHByb3BlcnR5KSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJpbmRJbmZvID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuZ2V0KHByb3BlcnR5KSB8fCB7fTtcclxuICAgICAgICAgICAgdmFyIGJvdW5kRnVuYyA9IGJpbmRJbmZvLmJvdW5kRnVuYywgc2NvcGUgPSBiaW5kSW5mby5zY29wZTtcclxuICAgICAgICAgICAgaWYgKGJvdW5kRnVuYyA9PT0gdW5kZWZpbmVkIHx8IHNjb3BlICE9PSBiaW5kKSB7XHJcbiAgICAgICAgICAgICAgICBib3VuZEZ1bmMgPSBwcm9wZXJ0eS5iaW5kKGJpbmQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuc2V0KHByb3BlcnR5LCB7IGJvdW5kRnVuYzogYm91bmRGdW5jLCBzY29wZTogYmluZCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRGdW5jO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydHk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcInJlZ2lzdHJ5XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcl8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fcnVuQmVmb3JlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYmVmb3JlUHJvcGVydGllcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgaWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbi5jYWxsKF90aGlzLCBwcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIH0sIHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5CZWZvcmVSZW5kZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XHJcbiAgICAgICAgaWYgKGJlZm9yZVJlbmRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlUmVuZGVycy5yZWR1Y2UoZnVuY3Rpb24gKHJlbmRlciwgYmVmb3JlUmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVkUmVuZGVyID0gYmVmb3JlUmVuZGVyRnVuY3Rpb24uY2FsbChfdGhpcywgcmVuZGVyLCBfdGhpcy5fcHJvcGVydGllcywgX3RoaXMuX2NoaWxkcmVuKTtcclxuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlZFJlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVuZGVyIGZ1bmN0aW9uIG5vdCByZXR1cm5lZCBmcm9tIGJlZm9yZVJlbmRlciwgdXNpbmcgcHJldmlvdXMgcmVuZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVkUmVuZGVyO1xyXG4gICAgICAgICAgICB9LCB0aGlzLl9ib3VuZFJlbmRlckZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRSZW5kZXJGdW5jO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkTm9kZSBUaGUgRE5vZGVzIHRvIHJ1biB0aHJvdWdoIHRoZSBhZnRlciByZW5kZXJzXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLnJ1bkFmdGVyUmVuZGVycyA9IGZ1bmN0aW9uIChkTm9kZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFmdGVyUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlclJlbmRlcicpO1xyXG4gICAgICAgIGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZW5kZXJzLnJlZHVjZShmdW5jdGlvbiAoZE5vZGUsIGFmdGVyUmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJlbmRlckZ1bmN0aW9uLmNhbGwoX3RoaXMsIGROb2RlKTtcclxuICAgICAgICAgICAgfSwgZE5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuZm9yRWFjaChmdW5jdGlvbiAobWV0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YS5hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGROb2RlO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5BZnRlckNvbnN0cnVjdG9ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhZnRlckNvbnN0cnVjdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlckNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgaWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYWZ0ZXJDb25zdHJ1Y3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWZ0ZXJDb25zdHJ1Y3RvcikgeyByZXR1cm4gYWZ0ZXJDb25zdHJ1Y3Rvci5jYWxsKF90aGlzKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogc3RhdGljIGlkZW50aWZpZXJcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5fdHlwZSA9IFJlZ2lzdHJ5XzEuV0lER0VUX0JBU0VfVFlQRTtcclxuICAgIHJldHVybiBXaWRnZXRCYXNlO1xyXG59KCkpO1xyXG5leHBvcnRzLldpZGdldEJhc2UgPSBXaWRnZXRCYXNlO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBXaWRnZXRCYXNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnJztcclxudmFyIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xyXG5mdW5jdGlvbiBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KSB7XHJcbiAgICBpZiAoJ1dlYmtpdFRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRBbmltYXRpb25FbmQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoJ3RyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUgfHwgJ01velRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3RyYW5zaXRpb25lbmQnO1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICdhbmltYXRpb25lbmQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCcpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXRpYWxpemUoZWxlbWVudCkge1xyXG4gICAgaWYgKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9PT0gJycpIHtcclxuICAgICAgICBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBydW5BbmRDbGVhblVwKGVsZW1lbnQsIHN0YXJ0QW5pbWF0aW9uLCBmaW5pc2hBbmltYXRpb24pIHtcclxuICAgIGluaXRpYWxpemUoZWxlbWVudCk7XHJcbiAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcclxuICAgIHZhciB0cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghZmluaXNoZWQpIHtcclxuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICBmaW5pc2hBbmltYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgc3RhcnRBbmltYXRpb24oKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG59XHJcbmZ1bmN0aW9uIGV4aXQobm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlTm9kZSkge1xyXG4gICAgdmFyIGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uQWN0aXZlIHx8IGV4aXRBbmltYXRpb24gKyBcIi1hY3RpdmVcIjtcclxuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChleGl0QW5pbWF0aW9uKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlbW92ZU5vZGUoKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGVudGVyKG5vZGUsIHByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKSB7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uQWN0aXZlIHx8IGVudGVyQW5pbWF0aW9uICsgXCItYWN0aXZlXCI7XHJcbiAgICBydW5BbmRDbGVhblVwKG5vZGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0ge1xyXG4gICAgZW50ZXI6IGVudGVyLFxyXG4gICAgZXhpdDogZXhpdFxyXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1N5bWJvbFwiKTtcclxuLyoqXHJcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBXTm9kZSB0eXBlXHJcbiAqL1xyXG5leHBvcnRzLldOT0RFID0gU3ltYm9sXzEuZGVmYXVsdCgnSWRlbnRpZmllciBmb3IgYSBXTm9kZS4nKTtcclxuLyoqXHJcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBWTm9kZSB0eXBlXHJcbiAqL1xyXG5leHBvcnRzLlZOT0RFID0gU3ltYm9sXzEuZGVmYXVsdCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZS4nKTtcclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gaXNXTm9kZShjaGlsZCkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBleHBvcnRzLldOT0RFKTtcclxufVxyXG5leHBvcnRzLmlzV05vZGUgPSBpc1dOb2RlO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFZOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1ZOb2RlKGNoaWxkKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IGV4cG9ydHMuVk5PREUpO1xyXG59XHJcbmV4cG9ydHMuaXNWTm9kZSA9IGlzVk5vZGU7XHJcbmZ1bmN0aW9uIGRlY29yYXRlKGROb2RlcywgbW9kaWZpZXIsIHByZWRpY2F0ZSkge1xyXG4gICAgdmFyIG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gdHNsaWJfMS5fX3NwcmVhZChkTm9kZXMpIDogW2ROb2Rlc107XHJcbiAgICB3aGlsZSAobm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlcy5wb3AoKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUobm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG1vZGlmaWVyKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlcyA9IHRzbGliXzEuX19zcHJlYWQobm9kZXMsIG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGROb2RlcztcclxufVxyXG5leHBvcnRzLmRlY29yYXRlID0gZGVjb3JhdGU7XHJcbi8qKlxyXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgYSB3aWRnZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiB3KHdpZGdldENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzLCBjaGlsZHJlbikge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB2b2lkIDApIHsgY2hpbGRyZW4gPSBbXTsgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IHdpZGdldENvbnN0cnVjdG9yLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgdHlwZTogZXhwb3J0cy5XTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLncgPSB3O1xyXG5mdW5jdGlvbiB2KHRhZywgcHJvcGVydGllc09yQ2hpbGRyZW4sIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAocHJvcGVydGllc09yQ2hpbGRyZW4gPT09IHZvaWQgMCkgeyBwcm9wZXJ0aWVzT3JDaGlsZHJlbiA9IHt9OyB9XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHZvaWQgMCkgeyBjaGlsZHJlbiA9IHVuZGVmaW5lZDsgfVxyXG4gICAgdmFyIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcclxuICAgIHZhciBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjaztcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnRpZXNPckNoaWxkcmVuKSkge1xyXG4gICAgICAgIGNoaWxkcmVuID0gcHJvcGVydGllc09yQ2hpbGRyZW47XHJcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiB0YWcsXHJcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s6IGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IGV4cG9ydHMuVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy52ID0gdjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5hZnRlclJlbmRlciA9IGFmdGVyUmVuZGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBhZnRlclJlbmRlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2QpIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuYmVmb3JlUHJvcGVydGllcyA9IGJlZm9yZVByb3BlcnRpZXM7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGJlZm9yZVByb3BlcnRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxyXG4gKiByZWdpc3RlcnMgdGhhdCBjdXN0b20gZWxlbWVudC5cclxuICovXHJcbmZ1bmN0aW9uIGN1c3RvbUVsZW1lbnQoX2EpIHtcclxuICAgIHZhciB0YWcgPSBfYS50YWcsIHByb3BlcnRpZXMgPSBfYS5wcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzID0gX2EuYXR0cmlidXRlcywgZXZlbnRzID0gX2EuZXZlbnRzLCBpbml0aWFsaXphdGlvbiA9IF9hLmluaXRpYWxpemF0aW9uO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XHJcbiAgICAgICAgICAgIHRhZ05hbWU6IHRhZyxcclxuICAgICAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IHRhcmdldCxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogKGF0dHJpYnV0ZXMgfHwgW10pLm1hcChmdW5jdGlvbiAoYXR0cmlidXRlTmFtZSkgeyByZXR1cm4gKHsgYXR0cmlidXRlTmFtZTogYXR0cmlidXRlTmFtZSB9KTsgfSksXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IChwcm9wZXJ0aWVzIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkgeyByZXR1cm4gKHsgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUgfSk7IH0pLFxyXG4gICAgICAgICAgICBldmVudHM6IChldmVudHMgfHwgW10pLm1hcChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7IHJldHVybiAoe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6IHByb3BlcnR5TmFtZS5yZXBsYWNlKCdvbicsICcnKS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIH0pOyB9KSxcclxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb246IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jdXN0b21FbGVtZW50ID0gY3VzdG9tRWxlbWVudDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gY3VzdG9tRWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb2Ygd2hpY2ggdGhlIGRpZmYgZnVuY3Rpb24gaXMgYXBwbGllZFxyXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXHJcbiAqIEBwYXJhbSBkaWZmRnVuY3Rpb24gIEEgZGlmZiBmdW5jdGlvbiB0byBydW4gaWYgZGlmZlR5cGUgaWYgRGlmZlR5cGUuQ1VTVE9NXHJcbiAqL1xyXG5mdW5jdGlvbiBkaWZmUHJvcGVydHkocHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24sIHJlYWN0aW9uRnVuY3Rpb24pIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKFwiZGlmZlByb3BlcnR5OlwiICsgcHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24uYmluZChudWxsKSk7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignZGlmZlJlYWN0aW9uJywge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbjogcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogcmVhY3Rpb25GdW5jdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRpZmZQcm9wZXJ0eSA9IGRpZmZQcm9wZXJ0eTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZGlmZlByb3BlcnR5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogR2VuZXJpYyBkZWNvcmF0b3IgaGFuZGxlciB0byB0YWtlIGNhcmUgb2Ygd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgY2FsbGVkIGF0IHRoZSBjbGFzcyBsZXZlbFxyXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxyXG4gKlxyXG4gKiBAcGFyYW0gaGFuZGxlclxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRGVjb3JhdG9yKGhhbmRsZXIpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LnByb3RvdHlwZSwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZURlY29yYXRvciA9IGhhbmRsZURlY29yYXRvcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFuZGxlRGVjb3JhdG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG52YXIgYmVmb3JlUHJvcGVydGllc18xID0gcmVxdWlyZShcIi4vYmVmb3JlUHJvcGVydGllc1wiKTtcclxuLyoqXHJcbiAqIE1hcCBvZiBpbnN0YW5jZXMgYWdhaW5zdCByZWdpc3RlcmVkIGluamVjdG9ycy5cclxuICovXHJcbnZhciByZWdpc3RlcmVkSW5qZWN0b3JzTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxyXG4gKiBjYWxscyB0aGUgYGdldFByb3BlcnRpZXNgIGZ1bmN0aW9uIHdpdGggdGhlIHBheWxvYWQgZnJvbSB0aGUgaW5qZWN0b3JcclxuICogYW5kIGN1cnJlbnQgcHJvcGVydGllcyB3aXRoIHRoZSB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcyByZXR1cm5lZC5cclxuICpcclxuICogQHBhcmFtIEluamVjdENvbmZpZyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIGluamVjdChfYSkge1xyXG4gICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBnZXRQcm9wZXJ0aWVzID0gX2EuZ2V0UHJvcGVydGllcztcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICBiZWZvcmVQcm9wZXJ0aWVzXzEuYmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgaW5qZWN0b3IgPSB0aGlzLnJlZ2lzdHJ5LmdldEluamVjdG9yKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW5qZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZWdpc3RlcmVkSW5qZWN0b3JzID0gcmVnaXN0ZXJlZEluamVjdG9yc01hcC5nZXQodGhpcykgfHwgW107XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLnNldCh0aGlzLCByZWdpc3RlcmVkSW5qZWN0b3JzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmluZGV4T2YoaW5qZWN0b3IpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluamVjdG9yLm9uKCdpbnZhbGlkYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yLmdldCgpLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKHRhcmdldCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmluamVjdCA9IGluamVjdDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5qZWN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5hbHdheXMgPSBhbHdheXM7XHJcbmZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5pZ25vcmUgPSBpZ25vcmU7XHJcbmZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcbmZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgICB2YXIgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xyXG4gICAgdmFyIHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcclxuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogY2hhbmdlZCxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5zaGFsbG93ID0gc2hhbGxvdztcclxuZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFJlZ2lzdHJ5XzEuV0lER0VUX0JBU0VfVFlQRSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmF1dG8gPSBhdXRvO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgbGFuZ18yID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvbGFuZ1wiKTtcclxudmFyIGNzc1RyYW5zaXRpb25zXzEgPSByZXF1aXJlKFwiLi4vYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9uc1wiKTtcclxudmFyIGFmdGVyUmVuZGVyXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vLi4vZFwiKTtcclxudmFyIHZkb21fMSA9IHJlcXVpcmUoXCIuLy4uL3Zkb21cIik7XHJcbnJlcXVpcmUoXCJwZXBqc1wiKTtcclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIGF0dGFjaCBzdGF0ZSBvZiB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgUHJvamVjdG9yQXR0YWNoU3RhdGU7XHJcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiQXR0YWNoZWRcIl0gPSAxXSA9IFwiQXR0YWNoZWRcIjtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiRGV0YWNoZWRcIl0gPSAyXSA9IFwiRGV0YWNoZWRcIjtcclxufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgPSBleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlIHx8IChleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEF0dGFjaCB0eXBlIGZvciB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgQXR0YWNoVHlwZTtcclxuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJBcHBlbmRcIl0gPSAxXSA9IFwiQXBwZW5kXCI7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJNZXJnZVwiXSA9IDJdID0gXCJNZXJnZVwiO1xyXG59KShBdHRhY2hUeXBlID0gZXhwb3J0cy5BdHRhY2hUeXBlIHx8IChleHBvcnRzLkF0dGFjaFR5cGUgPSB7fSkpO1xyXG5mdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgUHJvamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFByb2plY3RvciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliXzEuX19zcHJlYWQoYXJncykpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9oYW5kbGVzID0gW107XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc18xLmRlZmF1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgX3RoaXMucm9vdCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxyXG4gICAgICAgICAgICAgICAgcm9vdDogcm9vdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5NZXJnZSxcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcImFzeW5jXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGFzeW5jKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2FuZGJveCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGRvYyA9PT0gdm9pZCAwKSB7IGRvYyA9IGRvY3VtZW50OyB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgLyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXHJcbiAgICAgICAgICAgIHRoaXMub3duKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKHtcclxuICAgICAgICAgICAgICAgIC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cclxuICAgICAgICAgICAgICAgIHJvb3Q6IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2V0Q2hpbGRyZW4gPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBsYW5nXzEuYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldENvcmVQcm9wZXJ0aWVzX18uY2FsbCh0aGlzLCB7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldFByb3BlcnRpZXNfXy5jYWxsKHRoaXMsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS50b0h0bWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgaXMgbm90IGF0dGFjaGVkLCBjYW5ub3QgcmV0dXJuIGFuIEhUTUwgc3RyaW5nIG9mIHByb2plY3Rpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb24uZG9tTm9kZS5jaGlsZE5vZGVzWzBdLm91dGVySFRNTDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuYWZ0ZXJSZW5kZXIgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gZF8xLnYoJ3NwYW4nLCB7fSwgW3Jlc3VsdF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5vd24gPSBmdW5jdGlvbiAoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5fYXR0YWNoID0gZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gX2EudHlwZSwgcm9vdCA9IF9hLnJvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQ7XHJcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoSGFuZGxlID0gbGFuZ18yLmNyZWF0ZUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zLCB7IHN5bmM6ICF0aGlzLl9hc3luYyB9KTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuQXBwZW5kOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSB2ZG9tXzEuZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdmRvbV8xLmRvbS5tZXJnZSh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJfMS5hZnRlclJlbmRlcigpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3RvcjtcclxuICAgIH0oQmFzZSkpO1xyXG4gICAgcmV0dXJuIFByb2plY3RvcjtcclxufVxyXG5leHBvcnRzLlByb2plY3Rvck1peGluID0gUHJvamVjdG9yTWl4aW47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByb2plY3Rvck1peGluO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBJbmplY3Rvcl8xID0gcmVxdWlyZShcIi4vLi4vSW5qZWN0b3JcIik7XHJcbnZhciBpbmplY3RfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvaW5qZWN0XCIpO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGRpZmZQcm9wZXJ0eV8xID0gcmVxdWlyZShcIi4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHlcIik7XHJcbnZhciBkaWZmXzEgPSByZXF1aXJlKFwiLi8uLi9kaWZmXCIpO1xyXG52YXIgVEhFTUVfS0VZID0gJyBfa2V5JztcclxuZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgZm9yIGJhc2UgY3NzIGNsYXNzZXNcclxuICovXHJcbmZ1bmN0aW9uIHRoZW1lKHRoZW1lKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJywgdGhlbWUpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy50aGVtZSA9IHRoZW1lO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XHJcbiAqIEByZXF1aXJlc1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXMpIHtcclxuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZShmdW5jdGlvbiAoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzc05hbWVzW2Jhc2VDbGFzc1trZXldXSA9IGtleTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XHJcbiAgICB9LCB7fSk7XHJcbn1cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxyXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxyXG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXHJcbiAqIHRvIHRoZSBnbG9iYWwgcmVnaXN0cnlcclxuICpcclxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lLCB0aGVtZVJlZ2lzdHJ5KSB7XHJcbiAgICB2YXIgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcl8xLkluamVjdG9yKHRoZW1lKTtcclxuICAgIHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksIHRoZW1lSW5qZWN0b3IpO1xyXG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XHJcbn1cclxuZXhwb3J0cy5yZWdpc3RlclRoZW1lSW5qZWN0b3IgPSByZWdpc3RlclRoZW1lSW5qZWN0b3I7XHJcbi8qKlxyXG4gKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjbGFzcyBkZWNvcmF0ZWQgd2l0aCB3aXRoIFRoZW1lZCBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5mdW5jdGlvbiBUaGVtZWRNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgVGhlbWVkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFRoZW1lZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUaGVtZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBfdGhpcy5fdGhlbWUgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLnRoZW1lID0gZnVuY3Rpb24gKGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMubWFwKGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRnVuY3Rpb24gZmlyZWQgd2hlbiBgdGhlbWVgIG9yIGBleHRyYUNsYXNzZXNgIGFyZSBjaGFuZ2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUub25Qcm9wZXJ0aWVzQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUuX2dldFRoZW1lQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCB8fCBjbGFzc05hbWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwge307XHJcbiAgICAgICAgICAgIHZhciB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRDbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNsYXNzIG5hbWU6ICdcIiArIGNsYXNzTmFtZSArIFwiJyBub3QgZm91bmQgaW4gdGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLnRoZW1lLCB0aGVtZSA9IF9hID09PSB2b2lkIDAgPyB7fSA6IF9hO1xyXG4gICAgICAgICAgICB2YXIgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSA9IGJhc2VUaGVtZXMucmVkdWNlKGZ1bmN0aW9uIChmaW5hbEJhc2VUaGVtZSwgYmFzZVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gVEhFTUVfS0VZLCBrZXkgPSBiYXNlVGhlbWVbX2FdLCBjbGFzc2VzID0gdHNsaWJfMS5fX3Jlc3QoYmFzZVRoZW1lLCBbdHlwZW9mIF9hID09PSBcInN5bWJvbFwiID8gX2EgOiBfYSArIFwiXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cCA9IGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChiYXNlVGhlbWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZShmdW5jdGlvbiAoYmFzZVRoZW1lLCB0aGVtZUtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGJhc2VUaGVtZSwgdGhlbWVbdGhlbWVLZXldKTtcclxuICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgndGhlbWUnLCBkaWZmXzEuc2hhbGxvdyksXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgZGlmZl8xLnNoYWxsb3cpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFRoZW1lZC5wcm90b3R5cGUsIFwib25Qcm9wZXJ0aWVzQ2hhbmdlZFwiLCBudWxsKTtcclxuICAgICAgICBUaGVtZWQgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBpbmplY3RfMS5pbmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksXHJcbiAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0aWVzOiBmdW5jdGlvbiAodGhlbWUsIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMudGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdGhlbWU6IHRoZW1lIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdLCBUaGVtZWQpO1xyXG4gICAgICAgIHJldHVybiBUaGVtZWQ7XHJcbiAgICB9KEJhc2UpKTtcclxuICAgIHJldHVybiBUaGVtZWQ7XHJcbn1cclxuZXhwb3J0cy5UaGVtZWRNaXhpbiA9IFRoZW1lZE1peGluO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUaGVtZWRNaXhpbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9nbG9iYWxcIik7XHJcbnZhciBhcnJheV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vYXJyYXlcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xyXG52YXIgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XHJcbnZhciBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XHJcbnZhciBlbXB0eUFycmF5ID0gW107XHJcbmV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxudmFyIGluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbnZhciByZW5kZXJRdWV1ZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG5mdW5jdGlvbiBzYW1lKGRub2RlMSwgZG5vZGUyKSB7XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoZG5vZGUxKSAmJiBkXzEuaXNWTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRfMS5pc1dOb2RlKGRub2RlMSkgJiYgZF8xLmlzV05vZGUoZG5vZGUyKSkge1xyXG4gICAgICAgIGlmIChkbm9kZTEud2lkZ2V0Q29uc3RydWN0b3IgIT09IGRub2RlMi53aWRnZXRDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbnZhciBtaXNzaW5nVHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xyXG59O1xyXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0b3JPcHRpb25zLCBwcm9qZWN0b3JJbnN0YW5jZSkge1xyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHN0eWxlQXBwbHllcjogZnVuY3Rpb24gKGRvbU5vZGUsIHN0eWxlTmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZVtzdHlsZU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2l0aW9uczoge1xyXG4gICAgICAgICAgICBlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXHJcbiAgICAgICAgICAgIGV4aXQ6IG1pc3NpbmdUcmFuc2l0aW9uXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWZlcnJlZFJlbmRlckNhbGxiYWNrczogW10sXHJcbiAgICAgICAgYWZ0ZXJSZW5kZXJDYWxsYmFja3M6IFtdLFxyXG4gICAgICAgIG5vZGVNYXA6IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpLFxyXG4gICAgICAgIGRlcHRoOiAwLFxyXG4gICAgICAgIG1lcmdlOiBmYWxzZSxcclxuICAgICAgICByZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICByZW5kZXJRdWV1ZTogW10sXHJcbiAgICAgICAgcHJvamVjdG9ySW5zdGFuY2U6IHByb2plY3Rvckluc3RhbmNlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGRlZmF1bHRzLCBwcm9qZWN0b3JPcHRpb25zKTtcclxufVxyXG5mdW5jdGlvbiBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3R5bGUgdmFsdWVzIG11c3QgYmUgc3RyaW5ncycpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUV2ZW50cyhkb21Ob2RlLCBwcm9wTmFtZSwgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIHByZXZpb3VzUHJvcGVydGllcykge1xyXG4gICAgdmFyIHByZXZpb3VzID0gcHJldmlvdXNQcm9wZXJ0aWVzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XHJcbiAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzW3Byb3BOYW1lXTtcclxuICAgIHZhciBldmVudE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMik7XHJcbiAgICB2YXIgZXZlbnRNYXAgPSBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLmdldChkb21Ob2RlKSB8fCBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XHJcbiAgICB9XHJcbiAgICB2YXIgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2lucHV0Jykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBjdXJyZW50VmFsdWUuY2FsbCh0aGlzLCBldnQpO1xyXG4gICAgICAgICAgICBldnQudGFyZ2V0WydvbmlucHV0LXZhbHVlJ10gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIH0uYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgfVxyXG4gICAgZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gICAgZXZlbnRNYXAuc2V0KGN1cnJlbnRWYWx1ZSwgY2FsbGJhY2spO1xyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5zZXQoZG9tTm9kZSwgZXZlbnRNYXApO1xyXG59XHJcbmZ1bmN0aW9uIGFkZENsYXNzZXMoZG9tTm9kZSwgY2xhc3Nlcykge1xyXG4gICAgaWYgKGNsYXNzZXMpIHtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIGNsYXNzZXMpIHtcclxuICAgIGlmIChjbGFzc2VzKSB7XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcHJvcFZhbHVlICYmICFwcmV2aW91c1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmZvY3VzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc2V0UHJvcGVydGllcyhkb21Ob2RlLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG4gICAgdmFyIHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xyXG4gICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKCFkb21Ob2RlLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZS5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKCcgJykudHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gMDsgaV8xIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpXzErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV8xXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcclxuICAgICAgICAgICAgZm9jdXNOb2RlKHByb3BWYWx1ZSwgZmFsc2UsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsIHN0eWxlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IG51bGwgJiYgcHJvcFZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRXZlbnRzKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICd2YWx1ZScgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIHByb3BOYW1lID09PSAnaHJlZicpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpO1xyXG4gICAgaWYgKGV2ZW50TWFwKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3Vic3RyKDAsIDIpID09PSAnb24nICYmICFwcm9wZXJ0aWVzW3Byb3BOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihwcm9wTmFtZS5zdWJzdHIoMiksIGV2ZW50Q2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgIHZhciBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xyXG4gICAgaWYgKHByb3BOYW1lcy5pbmRleE9mKCdjbGFzc2VzJykgPT09IC0xICYmIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcclxuICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XHJcbiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcmV2aW91c1ZhbHVlKSA/IHByZXZpb3VzVmFsdWUgOiBbcHJldmlvdXNWYWx1ZV07XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSA/IHByb3BWYWx1ZSA6IFtwcm9wVmFsdWVdO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc2VzICYmIHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BWYWx1ZSB8fCBwcm9wVmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8yID0gMDsgaV8yIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaV8yKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzZXNbaV8yXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NsYXNzZXMgPSB0c2xpYl8xLl9fc3ByZWFkKGN1cnJlbnRDbGFzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzMgPSAwOyBpXzMgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpXzMrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV8zXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfNCA9IDA7IGlfNCA8IG5ld0NsYXNzZXMubGVuZ3RoOyBpXzQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIG5ld0NsYXNzZXNbaV80XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaV81ID0gMDsgaV81IDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpXzUrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV81XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcclxuICAgICAgICAgICAgZm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcclxuICAgICAgICAgICAgdmFyIHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3U3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgbmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tVmFsdWUgPSBkb21Ob2RlW3Byb3BOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlRXZlbnRzKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJldmlvdXNQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAncm9sZScgJiYgcHJvcFZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tTm9kZVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wYXJpc29uIGlzIGhlcmUgZm9yIHNpZGUtZWZmZWN0cyBpbiBFZGdlIHdpdGggc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcm9wZXJ0aWVzVXBkYXRlZDtcclxufVxyXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuLCBzYW1lQXMsIHN0YXJ0KSB7XHJcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG5mdW5jdGlvbiB0b1BhcmVudFZOb2RlKGRvbU5vZGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRvbU5vZGU6IGRvbU5vZGUsXHJcbiAgICAgICAgdHlwZTogZF8xLlZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudG9QYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGU7XHJcbmZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIHRleHQ6IFwiXCIgKyBkYXRhLFxyXG4gICAgICAgIGRvbU5vZGU6IHVuZGVmaW5lZCxcclxuICAgICAgICB0eXBlOiBkXzEuVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy50b1RleHRWTm9kZSA9IHRvVGV4dFZOb2RlO1xyXG5mdW5jdGlvbiB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXHJcbiAgICAgICAgcmVuZGVyZWQ6IFtdLFxyXG4gICAgICAgIGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXHJcbiAgICAgICAgY2hpbGRyZW46IGluc3RhbmNlLmNoaWxkcmVuLFxyXG4gICAgICAgIHdpZGdldENvbnN0cnVjdG9yOiBpbnN0YW5jZS5jb25zdHJ1Y3RvcixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IGRfMS5XTk9ERVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkcmVuLCBpbnN0YW5jZSkge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZW1wdHlBcnJheTtcclxuICAgIH1cclxuICAgIGNoaWxkcmVuID0gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IFtjaGlsZHJlbl07XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQucHJvcGVydGllcy5iaW5kID0gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGQuY29yZVByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvcmVQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiBpbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkrKztcclxuICAgIH1cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxufVxyXG5leHBvcnRzLmZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuO1xyXG5mdW5jdGlvbiBub2RlQWRkZWQoZG5vZGUsIHRyYW5zaXRpb25zKSB7XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChlbnRlckFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVudGVyQW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmVudGVyKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjYWxsT25EZXRhY2goZE5vZGVzLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBkTm9kZSA9IGROb2Rlc1tpXTtcclxuICAgICAgICBpZiAoZF8xLmlzV05vZGUoZE5vZGUpKSB7XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5yZW5kZXJlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGROb2RlLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uRGV0YWNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbm9kZVRvUmVtb3ZlKGRub2RlLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgcmVuZGVyZWQgPSBkbm9kZS5yZW5kZXJlZCB8fCBlbXB0eUFycmF5O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVuZGVyZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gcmVuZGVyZWRbaV07XHJcbiAgICAgICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGlsZC5kb21Ob2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZShjaGlsZCwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBkb21Ob2RlXzEgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gZG5vZGUucHJvcGVydGllcztcclxuICAgICAgICB2YXIgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcclxuICAgICAgICBpZiAocHJvcGVydGllcyAmJiBleGl0QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGVfMS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGVfMSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlXzEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGV4aXRBbmltYXRpb24oZG9tTm9kZV8xLCByZW1vdmVEb21Ob2RlLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmV4aXQoZG5vZGUuZG9tTm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlRG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tTm9kZV8xICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGVfMSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tEaXN0aW5ndWlzaGFibGUoY2hpbGROb2RlcywgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgdmFyIGNoaWxkTm9kZSA9IGNoaWxkTm9kZXNbaW5kZXhUb0NoZWNrXTtcclxuICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZE5vZGUpICYmICFjaGlsZE5vZGUudGFnKSB7XHJcbiAgICAgICAgcmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxyXG4gICAgfVxyXG4gICAgdmFyIGtleSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzLmtleTtcclxuICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4VG9DaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNhbWUobm9kZSwgY2hpbGROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlSWRlbnRpZmllciA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50TmFtZSA9IHBhcmVudEluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkXzEuaXNXTm9kZShjaGlsZE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLndpZGdldENvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUudGFnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBIHdpZGdldCAoXCIgKyBwYXJlbnROYW1lICsgXCIpIGhhcyBoYWQgYSBjaGlsZCBhZGRkZWQgb3IgcmVtb3ZlZCwgYnV0IHRoZXkgd2VyZSBub3QgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmaWVkLiBJdCBpcyByZWNvbW1lbmRlZCB0byBwcm92aWRlIGEgdW5pcXVlICdrZXknIHByb3BlcnR5IHdoZW4gdXNpbmcgdGhlIHNhbWUgd2lkZ2V0IG9yIGVsZW1lbnQgKFwiICsgbm9kZUlkZW50aWZpZXIgKyBcIikgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIG9sZENoaWxkcmVuLCBuZXdDaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBvbGRDaGlsZHJlbiA9IG9sZENoaWxkcmVuIHx8IGVtcHR5QXJyYXk7XHJcbiAgICBuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xyXG4gICAgdmFyIG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnM7XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfSk7XHJcbiAgICB2YXIgb2xkSW5kZXggPSAwO1xyXG4gICAgdmFyIG5ld0luZGV4ID0gMDtcclxuICAgIHZhciBpO1xyXG4gICAgdmFyIHRleHRVcGRhdGVkID0gZmFsc2U7XHJcbiAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgb2xkQ2hpbGQgPSBvbGRJbmRleCA8IG9sZENoaWxkcmVuTGVuZ3RoID8gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcclxuICAgICAgICBpZiAoZF8xLmlzVk5vZGUobmV3Q2hpbGQpICYmIHR5cGVvZiBuZXdDaGlsZC5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBuZXdDaGlsZC5pbnNlcnRlZCA9IGRfMS5pc1ZOb2RlKG9sZENoaWxkKSAmJiBvbGRDaGlsZC5pbnNlcnRlZDtcclxuICAgICAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbGRDaGlsZCAhPT0gdW5kZWZpbmVkICYmIHNhbWUob2xkQ2hpbGQsIG5ld0NoaWxkKSkge1xyXG4gICAgICAgICAgICB0ZXh0VXBkYXRlZCA9IHVwZGF0ZURvbShvbGRDaGlsZCwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8IHRleHRVcGRhdGVkO1xyXG4gICAgICAgICAgICBvbGRJbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xyXG4gICAgICAgICAgICBpZiAoZmluZE9sZEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRDaGlsZF8xID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4VG9DaGVjayA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChvbGRDaGlsZF8xLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBmaW5kT2xkSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9sb29wXzIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVEb20ob2xkQ2hpbGRyZW5bZmluZE9sZEluZGV4XSwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkO1xyXG4gICAgICAgICAgICAgICAgb2xkSW5kZXggPSBmaW5kT2xkSW5kZXggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc2VydEJlZm9yZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IG9sZENoaWxkcmVuW29sZEluZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSBvbGRJbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGluc2VydEJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkXzEuaXNXTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5yZW5kZXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQucmVuZGVyZWRbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBvbGRDaGlsZHJlbltuZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUgPSBjaGlsZC5kb21Ob2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3JlYXRlRG9tKG5ld0NoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgbm9kZUFkZGVkKG5ld0NoaWxkLCB0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrXzEgPSBuZXdJbmRleDtcclxuICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG5ld0NoaWxkcmVuLCBpbmRleFRvQ2hlY2tfMSwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3SW5kZXgrKztcclxuICAgIH07XHJcbiAgICB3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xyXG4gICAgICAgIF9sb29wXzEoKTtcclxuICAgIH1cclxuICAgIGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XHJcbiAgICAgICAgdmFyIF9sb29wXzMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrID0gaTtcclxuICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFJlbW92ZSBjaGlsZCBmcmFnbWVudHNcclxuICAgICAgICBmb3IgKGkgPSBvbGRJbmRleDsgaSA8IG9sZENoaWxkcmVuTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgX2xvb3BfMygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxufVxyXG5mdW5jdGlvbiBhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgaW5zZXJ0QmVmb3JlLCBjaGlsZE5vZGVzKSB7XHJcbiAgICBpZiAoaW5zZXJ0QmVmb3JlID09PSB2b2lkIDApIHsgaW5zZXJ0QmVmb3JlID0gdW5kZWZpbmVkOyB9XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjaGlsZE5vZGVzID0gYXJyYXlfMS5mcm9tKHBhcmVudFZOb2RlLmRvbU5vZGUuY2hpbGROb2Rlcyk7XHJcbiAgICB9XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfSk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgY2hpbGROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGFkZENoaWxkcmVuKGRub2RlLCBkbm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCB1bmRlZmluZWQpO1xyXG4gICAgaWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiBkbm9kZS5pbnNlcnRlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBzZXRQcm9wZXJ0aWVzKGRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkKGRvbU5vZGUsIFwiXCIgKyBkbm9kZS5wcm9wZXJ0aWVzLmtleSk7XHJcbiAgICB9XHJcbiAgICBkbm9kZS5pbnNlcnRlZCA9IHRydWU7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpIHtcclxuICAgIHZhciBkb21Ob2RlO1xyXG4gICAgaWYgKGRfMS5pc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIHZhciB3aWRnZXRDb25zdHJ1Y3RvciA9IGRub2RlLndpZGdldENvbnN0cnVjdG9yO1xyXG4gICAgICAgIHZhciBwYXJlbnRJbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgaWYgKCFSZWdpc3RyeV8xLmlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKHdpZGdldENvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHBhcmVudEluc3RhbmNlRGF0YS5yZWdpc3RyeSgpLmdldCh3aWRnZXRDb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3IgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5zdGFuY2VfMSA9IG5ldyB3aWRnZXRDb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgIGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2VfMTtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhXzEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZV8xKTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGFfMS5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZURhdGFfMS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyUXVldWUgPSByZW5kZXJRdWV1ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUXVldWUucHVzaCh7IGluc3RhbmNlOiBpbnN0YW5jZV8xLCBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggfSk7XHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgaW5zdGFuY2VfMS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xyXG4gICAgICAgIGluc3RhbmNlXzEuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICBpbnN0YW5jZV8xLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZW5kZXJlZCA9IGluc3RhbmNlXzEuX19yZW5kZXJfXygpO1xyXG4gICAgICAgIGlmIChyZW5kZXJlZCkge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWRSZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlXzEpO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XHJcbiAgICAgICAgICAgIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBmaWx0ZXJlZFJlbmRlcmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2VfMSwgaW5zZXJ0QmVmb3JlLCBjaGlsZE5vZGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlXzEsIHsgZG5vZGU6IGRub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGFfMS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50O1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRvYyA9IHBhcmVudFZOb2RlLmRvbU5vZGUub3duZXJEb2N1bWVudDtcclxuICAgICAgICBpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmRvbU5vZGUgIT09IHVuZGVmaW5lZCAmJiBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdEb21Ob2RlID0gZG5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmRvbU5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UsIGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgfHwgZG9jLmNyZWF0ZUVsZW1lbnQoZG5vZGUudGFnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkb21Ob2RlLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRG9tKHByZXZpb3VzLCBkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgaWYgKGRfMS5pc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHByZXZpb3VzLmluc3RhbmNlO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB2YXIgX2EgPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpLCBwYXJlbnRWTm9kZV8xID0gX2EucGFyZW50Vk5vZGUsIG5vZGUgPSBfYS5kbm9kZTtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzUmVuZGVyZWQgPSBub2RlID8gbm9kZS5yZW5kZXJlZCA6IHByZXZpb3VzLnJlbmRlcmVkO1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBkbm9kZSwgcGFyZW50Vk5vZGU6IHBhcmVudFZOb2RlXzEgfSk7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZURhdGEuZGlydHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLnJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGVfMSwgcHJldmlvdXNSZW5kZXJlZCwgZG5vZGUucmVuZGVyZWQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IHByZXZpb3VzUmVuZGVyZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShkbm9kZSwgcGFyZW50Vk5vZGUsIHVuZGVmaW5lZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAocHJldmlvdXMgPT09IGRub2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRvbU5vZGUgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xyXG4gICAgICAgIHZhciB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB1cGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS50ZXh0ICE9PSBwcmV2aW91cy50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGRub2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVwZGF0ZWQgPSB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgXCJcIiArIGRub2RlLnByb3BlcnRpZXMua2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKGRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhZGREZWZlcnJlZFByb3BlcnRpZXModm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAvLyB0cmFuc2ZlciBhbnkgcHJvcGVydGllcyB0aGF0IGhhdmUgYmVlbiBwYXNzZWQgLSBhcyB0aGVzZSBtdXN0IGJlIGRlY29yYXRlZCBwcm9wZXJ0aWVzXHJcbiAgICB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgdmFyIHByb3BlcnRpZXMgPSB2bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayghIXZub2RlLmluc2VydGVkKTtcclxuICAgIHZub2RlLnByb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9wZXJ0aWVzLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCB2bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayghIXZub2RlLmluc2VydGVkKSwgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKHZub2RlLmRvbU5vZGUsIHZub2RlLnByb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICB3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdElkbGVDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RJZGxlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPSBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgcmVuZGVyUXVldWUgPSByZW5kZXJRdWV1ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgdmFyIHJlbmRlcnMgPSB0c2xpYl8xLl9fc3ByZWFkKHJlbmRlclF1ZXVlKTtcclxuICAgIHJlbmRlclF1ZXVlTWFwLnNldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgW10pO1xyXG4gICAgcmVuZGVycy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmRlcHRoIC0gYi5kZXB0aDsgfSk7XHJcbiAgICB3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSByZW5kZXJzLnNoaWZ0KCkuaW5zdGFuY2U7XHJcbiAgICAgICAgdmFyIF9hID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSwgcGFyZW50Vk5vZGUgPSBfYS5wYXJlbnRWTm9kZSwgZG5vZGUgPSBfYS5kbm9kZTtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHVwZGF0ZURvbShkbm9kZSwgdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcclxuICAgIH1cclxuICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxufVxyXG5leHBvcnRzLmRvbSA9IHtcclxuICAgIGFwcGVuZDogZnVuY3Rpb24gKHBhcmVudE5vZGUsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucyA9PT0gdm9pZCAwKSB7IHByb2plY3Rpb25PcHRpb25zID0ge307IH1cclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHZhciBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UpO1xyXG4gICAgICAgIGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IHBhcmVudE5vZGU7XHJcbiAgICAgICAgdmFyIHBhcmVudFZOb2RlID0gdG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpO1xyXG4gICAgICAgIHZhciBub2RlID0gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpO1xyXG4gICAgICAgIHZhciByZW5kZXJRdWV1ZSA9IFtdO1xyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZTogbm9kZSwgcGFyZW50Vk5vZGU6IHBhcmVudFZOb2RlIH0pO1xyXG4gICAgICAgIHJlbmRlclF1ZXVlTWFwLnNldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UsIHJlbmRlclF1ZXVlKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyUXVldWVfMSA9IHJlbmRlclF1ZXVlTWFwLmdldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUXVldWVfMS5wdXNoKHsgaW5zdGFuY2U6IGluc3RhbmNlLCBkZXB0aDogZmluYWxQcm9qZWN0b3JPcHRpb25zLmRlcHRoIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZW5kZXIoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdXBkYXRlRG9tKG5vZGUsIG5vZGUsIGZpbmFsUHJvamVjdG9yT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcclxuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkb21Ob2RlOiBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGVcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcGVuZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH0sXHJcbiAgICBtZXJnZTogZnVuY3Rpb24gKGVsZW1lbnQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucyA9PT0gdm9pZCAwKSB7IHByb2plY3Rpb25PcHRpb25zID0ge307IH1cclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSA9IHRydWU7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBlbmQoZWxlbWVudC5wYXJlbnROb2RlLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3Zkb20uanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3Zkb20uanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIi8qIVxuICogUEVQIHYwLjQuMyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvUEVQXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyB8IGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuUG9pbnRlckV2ZW50c1BvbHlmaWxsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIGNvbnN0cnVjdG9yIGZvciBuZXcgUG9pbnRlckV2ZW50cy5cbiAgICpcbiAgICogTmV3IFBvaW50ZXIgRXZlbnRzIG11c3QgYmUgZ2l2ZW4gYSB0eXBlLCBhbmQgYW4gb3B0aW9uYWwgZGljdGlvbmFyeSBvZlxuICAgKiBpbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBEdWUgdG8gY2VydGFpbiBwbGF0Zm9ybSByZXF1aXJlbWVudHMsIGV2ZW50cyByZXR1cm5lZCBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuICAgKiBpZGVudGlmeSBhcyBNb3VzZUV2ZW50cy5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpblR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtpbkRpY3RdIEFuIG9wdGlvbmFsIGRpY3Rpb25hcnkgb2YgaW5pdGlhbCBldmVudCBwcm9wZXJ0aWVzLlxuICAgKiBAcmV0dXJuIHtFdmVudH0gQSBuZXcgUG9pbnRlckV2ZW50IG9mIHR5cGUgYGluVHlwZWAsIGluaXRpYWxpemVkIHdpdGggcHJvcGVydGllcyBmcm9tIGBpbkRpY3RgLlxuICAgKi9cbiAgdmFyIE1PVVNFX1BST1BTID0gW1xuICAgICdidWJibGVzJyxcbiAgICAnY2FuY2VsYWJsZScsXG4gICAgJ3ZpZXcnLFxuICAgICdkZXRhaWwnLFxuICAgICdzY3JlZW5YJyxcbiAgICAnc2NyZWVuWScsXG4gICAgJ2NsaWVudFgnLFxuICAgICdjbGllbnRZJyxcbiAgICAnY3RybEtleScsXG4gICAgJ2FsdEtleScsXG4gICAgJ3NoaWZ0S2V5JyxcbiAgICAnbWV0YUtleScsXG4gICAgJ2J1dHRvbicsXG4gICAgJ3JlbGF0ZWRUYXJnZXQnLFxuICAgICdwYWdlWCcsXG4gICAgJ3BhZ2VZJ1xuICBdO1xuXG4gIHZhciBNT1VTRV9ERUZBVUxUUyA9IFtcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICAwLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwXG4gIF07XG5cbiAgZnVuY3Rpb24gUG9pbnRlckV2ZW50KGluVHlwZSwgaW5EaWN0KSB7XG4gICAgaW5EaWN0ID0gaW5EaWN0IHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGUuaW5pdEV2ZW50KGluVHlwZSwgaW5EaWN0LmJ1YmJsZXMgfHwgZmFsc2UsIGluRGljdC5jYW5jZWxhYmxlIHx8IGZhbHNlKTtcblxuICAgIC8vIGRlZmluZSBpbmhlcml0ZWQgTW91c2VFdmVudCBwcm9wZXJ0aWVzXG4gICAgLy8gc2tpcCBidWJibGVzIGFuZCBjYW5jZWxhYmxlIHNpbmNlIHRoZXkncmUgc2V0IGFib3ZlIGluIGluaXRFdmVudCgpXG4gICAgZm9yICh2YXIgaSA9IDIsIHA7IGkgPCBNT1VTRV9QUk9QUy5sZW5ndGg7IGkrKykge1xuICAgICAgcCA9IE1PVVNFX1BST1BTW2ldO1xuICAgICAgZVtwXSA9IGluRGljdFtwXSB8fCBNT1VTRV9ERUZBVUxUU1tpXTtcbiAgICB9XG4gICAgZS5idXR0b25zID0gaW5EaWN0LmJ1dHRvbnMgfHwgMDtcblxuICAgIC8vIFNwZWMgcmVxdWlyZXMgdGhhdCBwb2ludGVycyB3aXRob3V0IHByZXNzdXJlIHNwZWNpZmllZCB1c2UgMC41IGZvciBkb3duXG4gICAgLy8gc3RhdGUgYW5kIDAgZm9yIHVwIHN0YXRlLlxuICAgIHZhciBwcmVzc3VyZSA9IDA7XG5cbiAgICBpZiAoaW5EaWN0LnByZXNzdXJlICYmIGUuYnV0dG9ucykge1xuICAgICAgcHJlc3N1cmUgPSBpbkRpY3QucHJlc3N1cmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXNzdXJlID0gZS5idXR0b25zID8gMC41IDogMDtcbiAgICB9XG5cbiAgICAvLyBhZGQgeC95IHByb3BlcnRpZXMgYWxpYXNlZCB0byBjbGllbnRYL1lcbiAgICBlLnggPSBlLmNsaWVudFg7XG4gICAgZS55ID0gZS5jbGllbnRZO1xuXG4gICAgLy8gZGVmaW5lIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBQb2ludGVyRXZlbnQgaW50ZXJmYWNlXG4gICAgZS5wb2ludGVySWQgPSBpbkRpY3QucG9pbnRlcklkIHx8IDA7XG4gICAgZS53aWR0aCA9IGluRGljdC53aWR0aCB8fCAwO1xuICAgIGUuaGVpZ2h0ID0gaW5EaWN0LmhlaWdodCB8fCAwO1xuICAgIGUucHJlc3N1cmUgPSBwcmVzc3VyZTtcbiAgICBlLnRpbHRYID0gaW5EaWN0LnRpbHRYIHx8IDA7XG4gICAgZS50aWx0WSA9IGluRGljdC50aWx0WSB8fCAwO1xuICAgIGUudHdpc3QgPSBpbkRpY3QudHdpc3QgfHwgMDtcbiAgICBlLnRhbmdlbnRpYWxQcmVzc3VyZSA9IGluRGljdC50YW5nZW50aWFsUHJlc3N1cmUgfHwgMDtcbiAgICBlLnBvaW50ZXJUeXBlID0gaW5EaWN0LnBvaW50ZXJUeXBlIHx8ICcnO1xuICAgIGUuaHdUaW1lc3RhbXAgPSBpbkRpY3QuaHdUaW1lc3RhbXAgfHwgMDtcbiAgICBlLmlzUHJpbWFyeSA9IGluRGljdC5pc1ByaW1hcnkgfHwgZmFsc2U7XG4gICAgcmV0dXJuIGU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgaW1wbGVtZW50cyBhIG1hcCBvZiBwb2ludGVyIHN0YXRlc1xuICAgKi9cbiAgdmFyIFVTRV9NQVAgPSB3aW5kb3cuTWFwICYmIHdpbmRvdy5NYXAucHJvdG90eXBlLmZvckVhY2g7XG4gIHZhciBQb2ludGVyTWFwID0gVVNFX01BUCA/IE1hcCA6IFNwYXJzZUFycmF5TWFwO1xuXG4gIGZ1bmN0aW9uIFNwYXJzZUFycmF5TWFwKCkge1xuICAgIHRoaXMuYXJyYXkgPSBbXTtcbiAgICB0aGlzLnNpemUgPSAwO1xuICB9XG5cbiAgU3BhcnNlQXJyYXlNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoayk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgfVxuICAgICAgdGhpcy5hcnJheVtrXSA9IHY7XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmFycmF5W2tdICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmICh0aGlzLmhhcyhrKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5hcnJheVtrXTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmFycmF5W2tdO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5hcnJheS5sZW5ndGggPSAwO1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICB9LFxuXG4gICAgLy8gcmV0dXJuIHZhbHVlLCBrZXksIG1hcFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBrLCB0aGlzKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgQ0xPTkVfUFJPUFMgPSBbXG5cbiAgICAvLyBNb3VzZUV2ZW50XG4gICAgJ2J1YmJsZXMnLFxuICAgICdjYW5jZWxhYmxlJyxcbiAgICAndmlldycsXG4gICAgJ2RldGFpbCcsXG4gICAgJ3NjcmVlblgnLFxuICAgICdzY3JlZW5ZJyxcbiAgICAnY2xpZW50WCcsXG4gICAgJ2NsaWVudFknLFxuICAgICdjdHJsS2V5JyxcbiAgICAnYWx0S2V5JyxcbiAgICAnc2hpZnRLZXknLFxuICAgICdtZXRhS2V5JyxcbiAgICAnYnV0dG9uJyxcbiAgICAncmVsYXRlZFRhcmdldCcsXG5cbiAgICAvLyBET00gTGV2ZWwgM1xuICAgICdidXR0b25zJyxcblxuICAgIC8vIFBvaW50ZXJFdmVudFxuICAgICdwb2ludGVySWQnLFxuICAgICd3aWR0aCcsXG4gICAgJ2hlaWdodCcsXG4gICAgJ3ByZXNzdXJlJyxcbiAgICAndGlsdFgnLFxuICAgICd0aWx0WScsXG4gICAgJ3BvaW50ZXJUeXBlJyxcbiAgICAnaHdUaW1lc3RhbXAnLFxuICAgICdpc1ByaW1hcnknLFxuXG4gICAgLy8gZXZlbnQgaW5zdGFuY2VcbiAgICAndHlwZScsXG4gICAgJ3RhcmdldCcsXG4gICAgJ2N1cnJlbnRUYXJnZXQnLFxuICAgICd3aGljaCcsXG4gICAgJ3BhZ2VYJyxcbiAgICAncGFnZVknLFxuICAgICd0aW1lU3RhbXAnXG4gIF07XG5cbiAgdmFyIENMT05FX0RFRkFVTFRTID0gW1xuXG4gICAgLy8gTW91c2VFdmVudFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIG51bGwsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIDAsXG4gICAgbnVsbCxcblxuICAgIC8vIERPTSBMZXZlbCAzXG4gICAgMCxcblxuICAgIC8vIFBvaW50ZXJFdmVudFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgICcnLFxuICAgIDAsXG4gICAgZmFsc2UsXG5cbiAgICAvLyBldmVudCBpbnN0YW5jZVxuICAgICcnLFxuICAgIG51bGwsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwXG4gIF07XG5cbiAgdmFyIEJPVU5EQVJZX0VWRU5UUyA9IHtcbiAgICAncG9pbnRlcm92ZXInOiAxLFxuICAgICdwb2ludGVyb3V0JzogMSxcbiAgICAncG9pbnRlcmVudGVyJzogMSxcbiAgICAncG9pbnRlcmxlYXZlJzogMVxuICB9O1xuXG4gIHZhciBIQVNfU1ZHX0lOU1RBTkNFID0gKHR5cGVvZiBTVkdFbGVtZW50SW5zdGFuY2UgIT09ICd1bmRlZmluZWQnKTtcblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgaXMgZm9yIG5vcm1hbGl6aW5nIGV2ZW50cy4gTW91c2UgYW5kIFRvdWNoIGV2ZW50cyB3aWxsIGJlXG4gICAqIGNvbGxlY3RlZCBoZXJlLCBhbmQgZmlyZSBQb2ludGVyRXZlbnRzIHRoYXQgaGF2ZSB0aGUgc2FtZSBzZW1hbnRpY3MsIG5vXG4gICAqIG1hdHRlciB0aGUgc291cmNlLlxuICAgKiBFdmVudHMgZmlyZWQ6XG4gICAqICAgLSBwb2ludGVyZG93bjogYSBwb2ludGluZyBpcyBhZGRlZFxuICAgKiAgIC0gcG9pbnRlcnVwOiBhIHBvaW50ZXIgaXMgcmVtb3ZlZFxuICAgKiAgIC0gcG9pbnRlcm1vdmU6IGEgcG9pbnRlciBpcyBtb3ZlZFxuICAgKiAgIC0gcG9pbnRlcm92ZXI6IGEgcG9pbnRlciBjcm9zc2VzIGludG8gYW4gZWxlbWVudFxuICAgKiAgIC0gcG9pbnRlcm91dDogYSBwb2ludGVyIGxlYXZlcyBhbiBlbGVtZW50XG4gICAqICAgLSBwb2ludGVyY2FuY2VsOiBhIHBvaW50ZXIgd2lsbCBubyBsb25nZXIgZ2VuZXJhdGUgZXZlbnRzXG4gICAqL1xuICB2YXIgZGlzcGF0Y2hlciA9IHtcbiAgICBwb2ludGVybWFwOiBuZXcgUG9pbnRlck1hcCgpLFxuICAgIGV2ZW50TWFwOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIGNhcHR1cmVJbmZvOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXG4gICAgLy8gU2NvcGUgb2JqZWN0cyBmb3IgbmF0aXZlIGV2ZW50cy5cbiAgICAvLyBUaGlzIGV4aXN0cyBmb3IgZWFzZSBvZiB0ZXN0aW5nLlxuICAgIGV2ZW50U291cmNlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICBldmVudFNvdXJjZUxpc3Q6IFtdLFxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBldmVudCBzb3VyY2UgdGhhdCB3aWxsIGdlbmVyYXRlIHBvaW50ZXIgZXZlbnRzLlxuICAgICAqXG4gICAgICogYGluU291cmNlYCBtdXN0IGNvbnRhaW4gYW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgbmFtZWQgYGV2ZW50c2AsIGFuZFxuICAgICAqIGZ1bmN0aW9ucyB3aXRoIHRoZSBuYW1lcyBzcGVjaWZpZWQgaW4gdGhlIGBldmVudHNgIGFycmF5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgbmFtZSBmb3IgdGhlIGV2ZW50IHNvdXJjZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgQSBuZXcgc291cmNlIG9mIHBsYXRmb3JtIGV2ZW50cy5cbiAgICAgKi9cbiAgICByZWdpc3RlclNvdXJjZTogZnVuY3Rpb24obmFtZSwgc291cmNlKSB7XG4gICAgICB2YXIgcyA9IHNvdXJjZTtcbiAgICAgIHZhciBuZXdFdmVudHMgPSBzLmV2ZW50cztcbiAgICAgIGlmIChuZXdFdmVudHMpIHtcbiAgICAgICAgbmV3RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChzW2VdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TWFwW2VdID0gc1tlXS5iaW5kKHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMuZXZlbnRTb3VyY2VzW25hbWVdID0gcztcbiAgICAgICAgdGhpcy5ldmVudFNvdXJjZUxpc3QucHVzaChzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgbCA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0Lmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlczsgKGkgPCBsKSAmJiAoZXMgPSB0aGlzLmV2ZW50U291cmNlTGlzdFtpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIGNhbGwgZXZlbnRzb3VyY2UgcmVnaXN0ZXJcbiAgICAgICAgZXMucmVnaXN0ZXIuY2FsbChlcywgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgbCA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0Lmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlczsgKGkgPCBsKSAmJiAoZXMgPSB0aGlzLmV2ZW50U291cmNlTGlzdFtpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIGNhbGwgZXZlbnRzb3VyY2UgcmVnaXN0ZXJcbiAgICAgICAgZXMudW5yZWdpc3Rlci5jYWxsKGVzLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbnRhaW5zOiAvKnNjb3BlLmV4dGVybmFsLmNvbnRhaW5zIHx8ICovZnVuY3Rpb24oY29udGFpbmVyLCBjb250YWluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb250YWluZXIuY29udGFpbnMoY29udGFpbmVkKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG5cbiAgICAgICAgLy8gbW9zdCBsaWtlbHk6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTIwODQyN1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEVWRU5UU1xuICAgIGRvd246IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmRvd24nLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcm1vdmUnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIHVwOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJ1cCcsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgZW50ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IGZhbHNlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJlbnRlcicsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IGZhbHNlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJsZWF2ZScsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgb3ZlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyb3ZlcicsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgb3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJvdXQnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyY2FuY2VsJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBsZWF2ZU91dDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHRoaXMub3V0KGV2ZW50KTtcbiAgICAgIHRoaXMucHJvcGFnYXRlKGV2ZW50LCB0aGlzLmxlYXZlLCBmYWxzZSk7XG4gICAgfSxcbiAgICBlbnRlck92ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm92ZXIoZXZlbnQpO1xuICAgICAgdGhpcy5wcm9wYWdhdGUoZXZlbnQsIHRoaXMuZW50ZXIsIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyBMSVNURU5FUiBMT0dJQ1xuICAgIGV2ZW50SGFuZGxlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuXG4gICAgICAvLyBUaGlzIGlzIHVzZWQgdG8gcHJldmVudCBtdWx0aXBsZSBkaXNwYXRjaCBvZiBwb2ludGVyZXZlbnRzIGZyb21cbiAgICAgIC8vIHBsYXRmb3JtIGV2ZW50cy4gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdHdvIGVsZW1lbnRzIGluIGRpZmZlcmVudCBzY29wZXNcbiAgICAgIC8vIGFyZSBzZXQgdXAgdG8gY3JlYXRlIHBvaW50ZXIgZXZlbnRzLCB3aGljaCBpcyByZWxldmFudCB0byBTaGFkb3cgRE9NLlxuICAgICAgaWYgKGluRXZlbnQuX2hhbmRsZWRCeVBFKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gaW5FdmVudC50eXBlO1xuICAgICAgdmFyIGZuID0gdGhpcy5ldmVudE1hcCAmJiB0aGlzLmV2ZW50TWFwW3R5cGVdO1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuKGluRXZlbnQpO1xuICAgICAgfVxuICAgICAgaW5FdmVudC5faGFuZGxlZEJ5UEUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBzZXQgdXAgZXZlbnQgbGlzdGVuZXJzXG4gICAgbGlzdGVuOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50cykge1xuICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KHRhcmdldCwgZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuICAgIHVubGlzdGVuOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50cykge1xuICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50KHRhcmdldCwgZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGFkZEV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLmFkZEV2ZW50IHx8ICovZnVuY3Rpb24odGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5ib3VuZEhhbmRsZXIpO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnQ6IC8qc2NvcGUuZXh0ZXJuYWwucmVtb3ZlRXZlbnQgfHwgKi9mdW5jdGlvbih0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmJvdW5kSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8vIEVWRU5UIENSRUFUSU9OIEFORCBUUkFDS0lOR1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgRXZlbnQgb2YgdHlwZSBgaW5UeXBlYCwgYmFzZWQgb24gdGhlIGluZm9ybWF0aW9uIGluXG4gICAgICogYGluRXZlbnRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluVHlwZSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgZXZlbnQgdG8gY3JlYXRlXG4gICAgICogQHBhcmFtIHtFdmVudH0gaW5FdmVudCBBIHBsYXRmb3JtIGV2ZW50IHdpdGggYSB0YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtFdmVudH0gQSBQb2ludGVyRXZlbnQgb2YgdHlwZSBgaW5UeXBlYFxuICAgICAqL1xuICAgIG1ha2VFdmVudDogZnVuY3Rpb24oaW5UeXBlLCBpbkV2ZW50KSB7XG5cbiAgICAgIC8vIHJlbGF0ZWRUYXJnZXQgbXVzdCBiZSBudWxsIGlmIHBvaW50ZXIgaXMgY2FwdHVyZWRcbiAgICAgIGlmICh0aGlzLmNhcHR1cmVJbmZvW2luRXZlbnQucG9pbnRlcklkXSkge1xuICAgICAgICBpbkV2ZW50LnJlbGF0ZWRUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KGluVHlwZSwgaW5FdmVudCk7XG4gICAgICBpZiAoaW5FdmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID0gaW5FdmVudC5wcmV2ZW50RGVmYXVsdDtcbiAgICAgIH1cbiAgICAgIGUuX3RhcmdldCA9IGUuX3RhcmdldCB8fCBpbkV2ZW50LnRhcmdldDtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG5cbiAgICAvLyBtYWtlIGFuZCBkaXNwYXRjaCBhbiBldmVudCBpbiBvbmUgY2FsbFxuICAgIGZpcmVFdmVudDogZnVuY3Rpb24oaW5UeXBlLCBpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMubWFrZUV2ZW50KGluVHlwZSwgaW5FdmVudCk7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHNuYXBzaG90IG9mIGluRXZlbnQsIHdpdGggd3JpdGFibGUgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgQW4gZXZlbnQgdGhhdCBjb250YWlucyBwcm9wZXJ0aWVzIHRvIGNvcHkuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyBzaGFsbG93IGNvcGllcyBvZiBgaW5FdmVudGAnc1xuICAgICAqICAgIHByb3BlcnRpZXMuXG4gICAgICovXG4gICAgY2xvbmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGV2ZW50Q29weSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB2YXIgcDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQ0xPTkVfUFJPUFMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcCA9IENMT05FX1BST1BTW2ldO1xuICAgICAgICBldmVudENvcHlbcF0gPSBpbkV2ZW50W3BdIHx8IENMT05FX0RFRkFVTFRTW2ldO1xuXG4gICAgICAgIC8vIFdvcmsgYXJvdW5kIFNWR0luc3RhbmNlRWxlbWVudCBzaGFkb3cgdHJlZVxuICAgICAgICAvLyBSZXR1cm4gdGhlIDx1c2U+IGVsZW1lbnQgdGhhdCBpcyByZXByZXNlbnRlZCBieSB0aGUgaW5zdGFuY2UgZm9yIFNhZmFyaSwgQ2hyb21lLCBJRS5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgYmVoYXZpb3IgaW1wbGVtZW50ZWQgYnkgRmlyZWZveC5cbiAgICAgICAgaWYgKEhBU19TVkdfSU5TVEFOQ0UgJiYgKHAgPT09ICd0YXJnZXQnIHx8IHAgPT09ICdyZWxhdGVkVGFyZ2V0JykpIHtcbiAgICAgICAgICBpZiAoZXZlbnRDb3B5W3BdIGluc3RhbmNlb2YgU1ZHRWxlbWVudEluc3RhbmNlKSB7XG4gICAgICAgICAgICBldmVudENvcHlbcF0gPSBldmVudENvcHlbcF0uY29ycmVzcG9uZGluZ1VzZUVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGtlZXAgdGhlIHNlbWFudGljcyBvZiBwcmV2ZW50RGVmYXVsdFxuICAgICAgaWYgKGluRXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZXZlbnRDb3B5LnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50Q29weTtcbiAgICB9LFxuICAgIGdldFRhcmdldDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGNhcHR1cmUgPSB0aGlzLmNhcHR1cmVJbmZvW2luRXZlbnQucG9pbnRlcklkXTtcbiAgICAgIGlmICghY2FwdHVyZSkge1xuICAgICAgICByZXR1cm4gaW5FdmVudC5fdGFyZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKGluRXZlbnQuX3RhcmdldCA9PT0gY2FwdHVyZSB8fCAhKGluRXZlbnQudHlwZSBpbiBCT1VOREFSWV9FVkVOVFMpKSB7XG4gICAgICAgIHJldHVybiBjYXB0dXJlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcHJvcGFnYXRlOiBmdW5jdGlvbihldmVudCwgZm4sIHByb3BhZ2F0ZURvd24pIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICB2YXIgdGFyZ2V0cyA9IFtdO1xuXG4gICAgICAvLyBPcmRlciBvZiBjb25kaXRpb25zIGR1ZSB0byBkb2N1bWVudC5jb250YWlucygpIG1pc3NpbmcgaW4gSUUuXG4gICAgICB3aGlsZSAodGFyZ2V0ICE9PSBkb2N1bWVudCAmJiAhdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgIHRhcmdldHMucHVzaCh0YXJnZXQpO1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICAvLyBUb3VjaDogRG8gbm90IHByb3BhZ2F0ZSBpZiBub2RlIGlzIGRldGFjaGVkLlxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BhZ2F0ZURvd24pIHtcbiAgICAgICAgdGFyZ2V0cy5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICB0YXJnZXRzLmZvckVhY2goZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHNldENhcHR1cmU6IGZ1bmN0aW9uKGluUG9pbnRlcklkLCBpblRhcmdldCwgc2tpcERpc3BhdGNoKSB7XG4gICAgICBpZiAodGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0pIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ2FwdHVyZShpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0gPSBpblRhcmdldDtcbiAgICAgIHRoaXMuaW1wbGljaXRSZWxlYXNlID0gdGhpcy5yZWxlYXNlQ2FwdHVyZS5iaW5kKHRoaXMsIGluUG9pbnRlcklkLCBza2lwRGlzcGF0Y2gpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcblxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KCdnb3Rwb2ludGVyY2FwdHVyZScpO1xuICAgICAgZS5wb2ludGVySWQgPSBpblBvaW50ZXJJZDtcbiAgICAgIGUuX3RhcmdldCA9IGluVGFyZ2V0O1xuXG4gICAgICBpZiAoIXNraXBEaXNwYXRjaCkge1xuICAgICAgICB0aGlzLmFzeW5jRGlzcGF0Y2hFdmVudChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbGVhc2VDYXB0dXJlOiBmdW5jdGlvbihpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKSB7XG4gICAgICB2YXIgdCA9IHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdO1xuICAgICAgaWYgKCF0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0gPSB1bmRlZmluZWQ7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuXG4gICAgICB2YXIgZSA9IG5ldyBQb2ludGVyRXZlbnQoJ2xvc3Rwb2ludGVyY2FwdHVyZScpO1xuICAgICAgZS5wb2ludGVySWQgPSBpblBvaW50ZXJJZDtcbiAgICAgIGUuX3RhcmdldCA9IHQ7XG5cbiAgICAgIGlmICghc2tpcERpc3BhdGNoKSB7XG4gICAgICAgIHRoaXMuYXN5bmNEaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgZXZlbnQgdG8gaXRzIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgVGhlIGV2ZW50IHRvIGJlIGRpc3BhdGNoZWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBhbiBldmVudCBoYW5kbGVyIHJldHVybnMgdHJ1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGRpc3BhdGNoRXZlbnQ6IC8qc2NvcGUuZXh0ZXJuYWwuZGlzcGF0Y2hFdmVudCB8fCAqL2Z1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciB0ID0gdGhpcy5nZXRUYXJnZXQoaW5FdmVudCk7XG4gICAgICBpZiAodCkge1xuICAgICAgICByZXR1cm4gdC5kaXNwYXRjaEV2ZW50KGluRXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmNEaXNwYXRjaEV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kaXNwYXRjaEV2ZW50LmJpbmQodGhpcywgaW5FdmVudCkpO1xuICAgIH1cbiAgfTtcbiAgZGlzcGF0Y2hlci5ib3VuZEhhbmRsZXIgPSBkaXNwYXRjaGVyLmV2ZW50SGFuZGxlci5iaW5kKGRpc3BhdGNoZXIpO1xuXG4gIHZhciB0YXJnZXRpbmcgPSB7XG4gICAgc2hhZG93OiBmdW5jdGlvbihpbkVsKSB7XG4gICAgICBpZiAoaW5FbCkge1xuICAgICAgICByZXR1cm4gaW5FbC5zaGFkb3dSb290IHx8IGluRWwud2Via2l0U2hhZG93Um9vdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhblRhcmdldDogZnVuY3Rpb24oc2hhZG93KSB7XG4gICAgICByZXR1cm4gc2hhZG93ICYmIEJvb2xlYW4oc2hhZG93LmVsZW1lbnRGcm9tUG9pbnQpO1xuICAgIH0sXG4gICAgdGFyZ2V0aW5nU2hhZG93OiBmdW5jdGlvbihpbkVsKSB7XG4gICAgICB2YXIgcyA9IHRoaXMuc2hhZG93KGluRWwpO1xuICAgICAgaWYgKHRoaXMuY2FuVGFyZ2V0KHMpKSB7XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfVxuICAgIH0sXG4gICAgb2xkZXJTaGFkb3c6IGZ1bmN0aW9uKHNoYWRvdykge1xuICAgICAgdmFyIG9zID0gc2hhZG93Lm9sZGVyU2hhZG93Um9vdDtcbiAgICAgIGlmICghb3MpIHtcbiAgICAgICAgdmFyIHNlID0gc2hhZG93LnF1ZXJ5U2VsZWN0b3IoJ3NoYWRvdycpO1xuICAgICAgICBpZiAoc2UpIHtcbiAgICAgICAgICBvcyA9IHNlLm9sZGVyU2hhZG93Um9vdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9zO1xuICAgIH0sXG4gICAgYWxsU2hhZG93czogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIHNoYWRvd3MgPSBbXTtcbiAgICAgIHZhciBzID0gdGhpcy5zaGFkb3coZWxlbWVudCk7XG4gICAgICB3aGlsZSAocykge1xuICAgICAgICBzaGFkb3dzLnB1c2gocyk7XG4gICAgICAgIHMgPSB0aGlzLm9sZGVyU2hhZG93KHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNoYWRvd3M7XG4gICAgfSxcbiAgICBzZWFyY2hSb290OiBmdW5jdGlvbihpblJvb3QsIHgsIHkpIHtcbiAgICAgIGlmIChpblJvb3QpIHtcbiAgICAgICAgdmFyIHQgPSBpblJvb3QuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgICAgdmFyIHN0LCBzcjtcblxuICAgICAgICAvLyBpcyBlbGVtZW50IGEgc2hhZG93IGhvc3Q/XG4gICAgICAgIHNyID0gdGhpcy50YXJnZXRpbmdTaGFkb3codCk7XG4gICAgICAgIHdoaWxlIChzcikge1xuXG4gICAgICAgICAgLy8gZmluZCB0aGUgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBzaGFkb3cgcm9vdFxuICAgICAgICAgIHN0ID0gc3IuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgICAgICBpZiAoIXN0KSB7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBvbGRlciBzaGFkb3dzXG4gICAgICAgICAgICBzciA9IHRoaXMub2xkZXJTaGFkb3coc3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIHNoYWRvd2VkIGVsZW1lbnQgbWF5IGNvbnRhaW4gYSBzaGFkb3cgcm9vdFxuICAgICAgICAgICAgdmFyIHNzciA9IHRoaXMudGFyZ2V0aW5nU2hhZG93KHN0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFJvb3Qoc3NyLCB4LCB5KSB8fCBzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsaWdodCBkb20gZWxlbWVudCBpcyB0aGUgdGFyZ2V0XG4gICAgICAgIHJldHVybiB0O1xuICAgICAgfVxuICAgIH0sXG4gICAgb3duZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBzID0gZWxlbWVudDtcblxuICAgICAgLy8gd2FsayB1cCB1bnRpbCB5b3UgaGl0IHRoZSBzaGFkb3cgcm9vdCBvciBkb2N1bWVudFxuICAgICAgd2hpbGUgKHMucGFyZW50Tm9kZSkge1xuICAgICAgICBzID0gcy5wYXJlbnROb2RlO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGUgb3duZXIgZWxlbWVudCBpcyBleHBlY3RlZCB0byBiZSBhIERvY3VtZW50IG9yIFNoYWRvd1Jvb3RcbiAgICAgIGlmIChzLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX05PREUgJiYgcy5ub2RlVHlwZSAhPT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG4gICAgICAgIHMgPSBkb2N1bWVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzO1xuICAgIH0sXG4gICAgZmluZFRhcmdldDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIHggPSBpbkV2ZW50LmNsaWVudFg7XG4gICAgICB2YXIgeSA9IGluRXZlbnQuY2xpZW50WTtcblxuICAgICAgLy8gaWYgdGhlIGxpc3RlbmVyIGlzIGluIHRoZSBzaGFkb3cgcm9vdCwgaXQgaXMgbXVjaCBmYXN0ZXIgdG8gc3RhcnQgdGhlcmVcbiAgICAgIHZhciBzID0gdGhpcy5vd25lcihpbkV2ZW50LnRhcmdldCk7XG5cbiAgICAgIC8vIGlmIHgsIHkgaXMgbm90IGluIHRoaXMgcm9vdCwgZmFsbCBiYWNrIHRvIGRvY3VtZW50IHNlYXJjaFxuICAgICAgaWYgKCFzLmVsZW1lbnRGcm9tUG9pbnQoeCwgeSkpIHtcbiAgICAgICAgcyA9IGRvY3VtZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUm9vdChzLCB4LCB5KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmZvckVhY2gpO1xuICB2YXIgbWFwID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLm1hcCk7XG4gIHZhciB0b0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuc2xpY2UpO1xuICB2YXIgZmlsdGVyID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmZpbHRlcik7XG4gIHZhciBNTyA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICB2YXIgU0VMRUNUT1IgPSAnW3RvdWNoLWFjdGlvbl0nO1xuICB2YXIgT0JTRVJWRVJfSU5JVCA9IHtcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZUZpbHRlcjogWyd0b3VjaC1hY3Rpb24nXVxuICB9O1xuXG4gIGZ1bmN0aW9uIEluc3RhbGxlcihhZGQsIHJlbW92ZSwgY2hhbmdlZCwgYmluZGVyKSB7XG4gICAgdGhpcy5hZGRDYWxsYmFjayA9IGFkZC5iaW5kKGJpbmRlcik7XG4gICAgdGhpcy5yZW1vdmVDYWxsYmFjayA9IHJlbW92ZS5iaW5kKGJpbmRlcik7XG4gICAgdGhpcy5jaGFuZ2VkQ2FsbGJhY2sgPSBjaGFuZ2VkLmJpbmQoYmluZGVyKTtcbiAgICBpZiAoTU8pIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTU8odGhpcy5tdXRhdGlvbldhdGNoZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgSW5zdGFsbGVyLnByb3RvdHlwZSA9IHtcbiAgICB3YXRjaFN1YnRyZWU6IGZ1bmN0aW9uKHRhcmdldCkge1xuXG4gICAgICAvLyBPbmx5IHdhdGNoIHNjb3BlcyB0aGF0IGNhbiB0YXJnZXQgZmluZCwgYXMgdGhlc2UgYXJlIHRvcC1sZXZlbC5cbiAgICAgIC8vIE90aGVyd2lzZSB3ZSBjYW4gc2VlIGR1cGxpY2F0ZSBhZGRpdGlvbnMgYW5kIHJlbW92YWxzIHRoYXQgYWRkIG5vaXNlLlxuICAgICAgLy9cbiAgICAgIC8vIFRPRE8oZGZyZWVkbWFuKTogRm9yIHNvbWUgaW5zdGFuY2VzIHdpdGggU2hhZG93RE9NUG9seWZpbGwsIHdlIGNhbiBzZWVcbiAgICAgIC8vIGEgcmVtb3ZhbCB3aXRob3V0IGFuIGluc2VydGlvbiB3aGVuIGEgbm9kZSBpcyByZWRpc3RyaWJ1dGVkIGFtb25nXG4gICAgICAvLyBzaGFkb3dzLiBTaW5jZSBpdCBhbGwgZW5kcyB1cCBjb3JyZWN0IGluIHRoZSBkb2N1bWVudCwgd2F0Y2hpbmcgb25seVxuICAgICAgLy8gdGhlIGRvY3VtZW50IHdpbGwgeWllbGQgdGhlIGNvcnJlY3QgbXV0YXRpb25zIHRvIHdhdGNoLlxuICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIgJiYgdGFyZ2V0aW5nLmNhblRhcmdldCh0YXJnZXQpKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIE9CU0VSVkVSX0lOSVQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5hYmxlT25TdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIHRoaXMud2F0Y2hTdWJ0cmVlKHRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0ID09PSBkb2N1bWVudCAmJiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHRoaXMuaW5zdGFsbE9uTG9hZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnN0YWxsTmV3U3VidHJlZSh0YXJnZXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5zdGFsbE5ld1N1YnRyZWU6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZm9yRWFjaCh0aGlzLmZpbmRFbGVtZW50cyh0YXJnZXQpLCB0aGlzLmFkZEVsZW1lbnQsIHRoaXMpO1xuICAgIH0sXG4gICAgZmluZEVsZW1lbnRzOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGlmICh0YXJnZXQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgcmVtb3ZlRWxlbWVudDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2FsbGJhY2soZWwpO1xuICAgIH0sXG4gICAgYWRkRWxlbWVudDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHRoaXMuYWRkQ2FsbGJhY2soZWwpO1xuICAgIH0sXG4gICAgZWxlbWVudENoYW5nZWQ6IGZ1bmN0aW9uKGVsLCBvbGRWYWx1ZSkge1xuICAgICAgdGhpcy5jaGFuZ2VkQ2FsbGJhY2soZWwsIG9sZFZhbHVlKTtcbiAgICB9LFxuICAgIGNvbmNhdExpc3RzOiBmdW5jdGlvbihhY2N1bSwgbGlzdCkge1xuICAgICAgcmV0dXJuIGFjY3VtLmNvbmNhdCh0b0FycmF5KGxpc3QpKTtcbiAgICB9LFxuXG4gICAgLy8gcmVnaXN0ZXIgYWxsIHRvdWNoLWFjdGlvbiA9IG5vbmUgbm9kZXMgb24gZG9jdW1lbnQgbG9hZFxuICAgIGluc3RhbGxPbkxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgIHRoaXMuaW5zdGFsbE5ld1N1YnRyZWUoZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgaXNFbGVtZW50OiBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREU7XG4gICAgfSxcbiAgICBmbGF0dGVuTXV0YXRpb25UcmVlOiBmdW5jdGlvbihpbk5vZGVzKSB7XG5cbiAgICAgIC8vIGZpbmQgY2hpbGRyZW4gd2l0aCB0b3VjaC1hY3Rpb25cbiAgICAgIHZhciB0cmVlID0gbWFwKGluTm9kZXMsIHRoaXMuZmluZEVsZW1lbnRzLCB0aGlzKTtcblxuICAgICAgLy8gbWFrZSBzdXJlIHRoZSBhZGRlZCBub2RlcyBhcmUgYWNjb3VudGVkIGZvclxuICAgICAgdHJlZS5wdXNoKGZpbHRlcihpbk5vZGVzLCB0aGlzLmlzRWxlbWVudCkpO1xuXG4gICAgICAvLyBmbGF0dGVuIHRoZSBsaXN0XG4gICAgICByZXR1cm4gdHJlZS5yZWR1Y2UodGhpcy5jb25jYXRMaXN0cywgW10pO1xuICAgIH0sXG4gICAgbXV0YXRpb25XYXRjaGVyOiBmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgIG11dGF0aW9ucy5mb3JFYWNoKHRoaXMubXV0YXRpb25IYW5kbGVyLCB0aGlzKTtcbiAgICB9LFxuICAgIG11dGF0aW9uSGFuZGxlcjogZnVuY3Rpb24obSkge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgdmFyIGFkZGVkID0gdGhpcy5mbGF0dGVuTXV0YXRpb25UcmVlKG0uYWRkZWROb2Rlcyk7XG4gICAgICAgIGFkZGVkLmZvckVhY2godGhpcy5hZGRFbGVtZW50LCB0aGlzKTtcbiAgICAgICAgdmFyIHJlbW92ZWQgPSB0aGlzLmZsYXR0ZW5NdXRhdGlvblRyZWUobS5yZW1vdmVkTm9kZXMpO1xuICAgICAgICByZW1vdmVkLmZvckVhY2godGhpcy5yZW1vdmVFbGVtZW50LCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Q2hhbmdlZChtLnRhcmdldCwgbS5vbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNoYWRvd1NlbGVjdG9yKHYpIHtcbiAgICByZXR1cm4gJ2JvZHkgL3NoYWRvdy1kZWVwLyAnICsgc2VsZWN0b3Iodik7XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0b3Iodikge1xuICAgIHJldHVybiAnW3RvdWNoLWFjdGlvbj1cIicgKyB2ICsgJ1wiXSc7XG4gIH1cbiAgZnVuY3Rpb24gcnVsZSh2KSB7XG4gICAgcmV0dXJuICd7IC1tcy10b3VjaC1hY3Rpb246ICcgKyB2ICsgJzsgdG91Y2gtYWN0aW9uOiAnICsgdiArICc7IH0nO1xuICB9XG4gIHZhciBhdHRyaWIyY3NzID0gW1xuICAgICdub25lJyxcbiAgICAnYXV0bycsXG4gICAgJ3Bhbi14JyxcbiAgICAncGFuLXknLFxuICAgIHtcbiAgICAgIHJ1bGU6ICdwYW4teCBwYW4teScsXG4gICAgICBzZWxlY3RvcnM6IFtcbiAgICAgICAgJ3Bhbi14IHBhbi15JyxcbiAgICAgICAgJ3Bhbi15IHBhbi14J1xuICAgICAgXVxuICAgIH1cbiAgXTtcbiAgdmFyIHN0eWxlcyA9ICcnO1xuXG4gIC8vIG9ubHkgaW5zdGFsbCBzdHlsZXNoZWV0IGlmIHRoZSBicm93c2VyIGhhcyB0b3VjaCBhY3Rpb24gc3VwcG9ydFxuICB2YXIgaGFzTmF0aXZlUEUgPSB3aW5kb3cuUG9pbnRlckV2ZW50IHx8IHdpbmRvdy5NU1BvaW50ZXJFdmVudDtcblxuICAvLyBvbmx5IGFkZCBzaGFkb3cgc2VsZWN0b3JzIGlmIHNoYWRvd2RvbSBpcyBzdXBwb3J0ZWRcbiAgdmFyIGhhc1NoYWRvd1Jvb3QgPSAhd2luZG93LlNoYWRvd0RPTVBvbHlmaWxsICYmIGRvY3VtZW50LmhlYWQuY3JlYXRlU2hhZG93Um9vdDtcblxuICBmdW5jdGlvbiBhcHBseUF0dHJpYnV0ZVN0eWxlcygpIHtcbiAgICBpZiAoaGFzTmF0aXZlUEUpIHtcbiAgICAgIGF0dHJpYjJjc3MuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAgIGlmIChTdHJpbmcocikgPT09IHIpIHtcbiAgICAgICAgICBzdHlsZXMgKz0gc2VsZWN0b3IocikgKyBydWxlKHIpICsgJ1xcbic7XG4gICAgICAgICAgaWYgKGhhc1NoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSBzaGFkb3dTZWxlY3RvcihyKSArIHJ1bGUocikgKyAnXFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGVzICs9IHIuc2VsZWN0b3JzLm1hcChzZWxlY3RvcikgKyBydWxlKHIucnVsZSkgKyAnXFxuJztcbiAgICAgICAgICBpZiAoaGFzU2hhZG93Um9vdCkge1xuICAgICAgICAgICAgc3R5bGVzICs9IHIuc2VsZWN0b3JzLm1hcChzaGFkb3dTZWxlY3RvcikgKyBydWxlKHIucnVsZSkgKyAnXFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgZWwudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcG9pbnRlcm1hcCA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcDtcblxuICAvLyByYWRpdXMgYXJvdW5kIHRvdWNoZW5kIHRoYXQgc3dhbGxvd3MgbW91c2UgZXZlbnRzXG4gIHZhciBERURVUF9ESVNUID0gMjU7XG5cbiAgLy8gbGVmdCwgbWlkZGxlLCByaWdodCwgYmFjaywgZm9yd2FyZFxuICB2YXIgQlVUVE9OX1RPX0JVVFRPTlMgPSBbMSwgNCwgMiwgOCwgMTZdO1xuXG4gIHZhciBIQVNfQlVUVE9OUyA9IGZhbHNlO1xuICB0cnkge1xuICAgIEhBU19CVVRUT05TID0gbmV3IE1vdXNlRXZlbnQoJ3Rlc3QnLCB7IGJ1dHRvbnM6IDEgfSkuYnV0dG9ucyA9PT0gMTtcbiAgfSBjYXRjaCAoZSkge31cblxuICAvLyBoYW5kbGVyIGJsb2NrIGZvciBuYXRpdmUgbW91c2UgZXZlbnRzXG4gIHZhciBtb3VzZUV2ZW50cyA9IHtcbiAgICBQT0lOVEVSX0lEOiAxLFxuICAgIFBPSU5URVJfVFlQRTogJ21vdXNlJyxcbiAgICBldmVudHM6IFtcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAnbW91c2V1cCcsXG4gICAgICAnbW91c2VvdmVyJyxcbiAgICAgICdtb3VzZW91dCdcbiAgICBdLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgbGFzdFRvdWNoZXM6IFtdLFxuXG4gICAgLy8gY29sbGlkZSB3aXRoIHRoZSBnbG9iYWwgbW91c2UgbGlzdGVuZXJcbiAgICBpc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgIHZhciB4ID0gaW5FdmVudC5jbGllbnRYO1xuICAgICAgdmFyIHkgPSBpbkV2ZW50LmNsaWVudFk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGx0cy5sZW5ndGgsIHQ7IGkgPCBsICYmICh0ID0gbHRzW2ldKTsgaSsrKSB7XG5cbiAgICAgICAgLy8gc2ltdWxhdGVkIG1vdXNlIGV2ZW50cyB3aWxsIGJlIHN3YWxsb3dlZCBuZWFyIGEgcHJpbWFyeSB0b3VjaGVuZFxuICAgICAgICB2YXIgZHggPSBNYXRoLmFicyh4IC0gdC54KTtcbiAgICAgICAgdmFyIGR5ID0gTWF0aC5hYnMoeSAtIHQueSk7XG4gICAgICAgIGlmIChkeCA8PSBERURVUF9ESVNUICYmIGR5IDw9IERFRFVQX0RJU1QpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcHJlcGFyZUV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIuY2xvbmVFdmVudChpbkV2ZW50KTtcblxuICAgICAgLy8gZm9yd2FyZCBtb3VzZSBwcmV2ZW50RGVmYXVsdFxuICAgICAgdmFyIHBkID0gZS5wcmV2ZW50RGVmYXVsdDtcbiAgICAgIGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBwZCgpO1xuICAgICAgfTtcbiAgICAgIGUucG9pbnRlcklkID0gdGhpcy5QT0lOVEVSX0lEO1xuICAgICAgZS5pc1ByaW1hcnkgPSB0cnVlO1xuICAgICAgZS5wb2ludGVyVHlwZSA9IHRoaXMuUE9JTlRFUl9UWVBFO1xuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBwcmVwYXJlQnV0dG9uc0Zvck1vdmU6IGZ1bmN0aW9uKGUsIGluRXZlbnQpIHtcbiAgICAgIHZhciBwID0gcG9pbnRlcm1hcC5nZXQodGhpcy5QT0lOVEVSX0lEKTtcblxuICAgICAgLy8gVXBkYXRlIGJ1dHRvbnMgc3RhdGUgYWZ0ZXIgcG9zc2libGUgb3V0LW9mLWRvY3VtZW50IG1vdXNldXAuXG4gICAgICBpZiAoaW5FdmVudC53aGljaCA9PT0gMCB8fCAhcCkge1xuICAgICAgICBlLmJ1dHRvbnMgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZS5idXR0b25zID0gcC5idXR0b25zO1xuICAgICAgfVxuICAgICAgaW5FdmVudC5idXR0b25zID0gZS5idXR0b25zO1xuICAgIH0sXG4gICAgbW91c2Vkb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHtcbiAgICAgICAgICBlLmJ1dHRvbnMgPSBCVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG4gICAgICAgICAgaWYgKHApIHsgZS5idXR0b25zIHw9IHAuYnV0dG9uczsgfVxuICAgICAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBpZiAoIXAgfHwgcC5idXR0b25zID09PSAwKSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5kb3duKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2Vtb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG4gICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNldXA6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBwID0gcG9pbnRlcm1hcC5nZXQodGhpcy5QT0lOVEVSX0lEKTtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykge1xuICAgICAgICAgIHZhciB1cCA9IEJVVFRPTl9UT19CVVRUT05TW2UuYnV0dG9uXTtcblxuICAgICAgICAgIC8vIFByb2R1Y2VzIHdyb25nIHN0YXRlIG9mIGJ1dHRvbnMgaW4gQnJvd3NlcnMgd2l0aG91dCBgYnV0dG9uc2Agc3VwcG9ydFxuICAgICAgICAgIC8vIHdoZW4gYSBtb3VzZSBidXR0b24gdGhhdCB3YXMgcHJlc3NlZCBvdXRzaWRlIHRoZSBkb2N1bWVudCBpcyByZWxlYXNlZFxuICAgICAgICAgIC8vIGluc2lkZSBhbmQgb3RoZXIgYnV0dG9ucyBhcmUgc3RpbGwgcHJlc3NlZCBkb3duLlxuICAgICAgICAgIGUuYnV0dG9ucyA9IHAgPyBwLmJ1dHRvbnMgJiB+dXAgOiAwO1xuICAgICAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuXG4gICAgICAgIC8vIFN1cHBvcnQ6IEZpcmVmb3ggPD00NCBvbmx5XG4gICAgICAgIC8vIEZGIFVidW50dSBpbmNsdWRlcyB0aGUgbGlmdGVkIGJ1dHRvbiBpbiB0aGUgYGJ1dHRvbnNgIHByb3BlcnR5IG9uXG4gICAgICAgIC8vIG1vdXNldXAuXG4gICAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEyMjMzNjZcbiAgICAgICAgZS5idXR0b25zICY9IH5CVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG4gICAgICAgIGlmIChlLmJ1dHRvbnMgPT09IDApIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLnVwKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VvdmVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG4gICAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VvdXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHsgdGhpcy5wcmVwYXJlQnV0dG9uc0Zvck1vdmUoZSwgaW5FdmVudCk7IH1cbiAgICAgICAgZS5idXR0b24gPSAtMTtcbiAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGUpO1xuICAgICAgdGhpcy5kZWFjdGl2YXRlTW91c2UoKTtcbiAgICB9LFxuICAgIGRlYWN0aXZhdGVNb3VzZTogZnVuY3Rpb24oKSB7XG4gICAgICBwb2ludGVybWFwLmRlbGV0ZSh0aGlzLlBPSU5URVJfSUQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2FwdHVyZUluZm8gPSBkaXNwYXRjaGVyLmNhcHR1cmVJbmZvO1xuICB2YXIgZmluZFRhcmdldCA9IHRhcmdldGluZy5maW5kVGFyZ2V0LmJpbmQodGFyZ2V0aW5nKTtcbiAgdmFyIGFsbFNoYWRvd3MgPSB0YXJnZXRpbmcuYWxsU2hhZG93cy5iaW5kKHRhcmdldGluZyk7XG4gIHZhciBwb2ludGVybWFwJDEgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG5cbiAgLy8gVGhpcyBzaG91bGQgYmUgbG9uZyBlbm91Z2ggdG8gaWdub3JlIGNvbXBhdCBtb3VzZSBldmVudHMgbWFkZSBieSB0b3VjaFxuICB2YXIgREVEVVBfVElNRU9VVCA9IDI1MDA7XG4gIHZhciBDTElDS19DT1VOVF9USU1FT1VUID0gMjAwO1xuICB2YXIgQVRUUklCID0gJ3RvdWNoLWFjdGlvbic7XG4gIHZhciBJTlNUQUxMRVI7XG5cbiAgLy8gaGFuZGxlciBibG9jayBmb3IgbmF0aXZlIHRvdWNoIGV2ZW50c1xuICB2YXIgdG91Y2hFdmVudHMgPSB7XG4gICAgZXZlbnRzOiBbXG4gICAgICAndG91Y2hzdGFydCcsXG4gICAgICAndG91Y2htb3ZlJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAndG91Y2hjYW5jZWwnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBJTlNUQUxMRVIuZW5hYmxlT25TdWJ0cmVlKHRhcmdldCk7XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgLy8gVE9ETyhkZnJlZWRtYW4pOiBpcyBpdCB3b3J0aCBpdCB0byBkaXNjb25uZWN0IHRoZSBNTz9cbiAgICB9LFxuICAgIGVsZW1lbnRBZGRlZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBhID0gZWwuZ2V0QXR0cmlidXRlKEFUVFJJQik7XG4gICAgICB2YXIgc3QgPSB0aGlzLnRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlKGEpO1xuICAgICAgaWYgKHN0KSB7XG4gICAgICAgIGVsLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgIGRpc3BhdGNoZXIubGlzdGVuKGVsLCB0aGlzLmV2ZW50cyk7XG5cbiAgICAgICAgLy8gc2V0IHRvdWNoLWFjdGlvbiBvbiBzaGFkb3dzIGFzIHdlbGxcbiAgICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHMsIHRoaXMuZXZlbnRzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbGVtZW50UmVtb3ZlZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGVsLl9zY3JvbGxUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3RlbihlbCwgdGhpcy5ldmVudHMpO1xuXG4gICAgICAvLyByZW1vdmUgdG91Y2gtYWN0aW9uIGZyb20gc2hhZG93XG4gICAgICBhbGxTaGFkb3dzKGVsKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGlzcGF0Y2hlci51bmxpc3RlbihzLCB0aGlzLmV2ZW50cyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGVsZW1lbnRDaGFuZ2VkOiBmdW5jdGlvbihlbCwgb2xkVmFsdWUpIHtcbiAgICAgIHZhciBhID0gZWwuZ2V0QXR0cmlidXRlKEFUVFJJQik7XG4gICAgICB2YXIgc3QgPSB0aGlzLnRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlKGEpO1xuICAgICAgdmFyIG9sZFN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShvbGRWYWx1ZSk7XG5cbiAgICAgIC8vIHNpbXBseSB1cGRhdGUgc2Nyb2xsVHlwZSBpZiBsaXN0ZW5lcnMgYXJlIGFscmVhZHkgZXN0YWJsaXNoZWRcbiAgICAgIGlmIChzdCAmJiBvbGRTdCkge1xuICAgICAgICBlbC5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICBhbGxTaGFkb3dzKGVsKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIGlmIChvbGRTdCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZW1vdmVkKGVsKTtcbiAgICAgIH0gZWxzZSBpZiAoc3QpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50QWRkZWQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2Nyb2xsVHlwZXM6IHtcbiAgICAgIEVNSVRURVI6ICdub25lJyxcbiAgICAgIFhTQ1JPTExFUjogJ3Bhbi14JyxcbiAgICAgIFlTQ1JPTExFUjogJ3Bhbi15JyxcbiAgICAgIFNDUk9MTEVSOiAvXig/OnBhbi14IHBhbi15KXwoPzpwYW4teSBwYW4teCl8YXV0byQvXG4gICAgfSxcbiAgICB0b3VjaEFjdGlvblRvU2Nyb2xsVHlwZTogZnVuY3Rpb24odG91Y2hBY3Rpb24pIHtcbiAgICAgIHZhciB0ID0gdG91Y2hBY3Rpb247XG4gICAgICB2YXIgc3QgPSB0aGlzLnNjcm9sbFR5cGVzO1xuICAgICAgaWYgKHQgPT09ICdub25lJykge1xuICAgICAgICByZXR1cm4gJ25vbmUnO1xuICAgICAgfSBlbHNlIGlmICh0ID09PSBzdC5YU0NST0xMRVIpIHtcbiAgICAgICAgcmV0dXJuICdYJztcbiAgICAgIH0gZWxzZSBpZiAodCA9PT0gc3QuWVNDUk9MTEVSKSB7XG4gICAgICAgIHJldHVybiAnWSc7XG4gICAgICB9IGVsc2UgaWYgKHN0LlNDUk9MTEVSLmV4ZWModCkpIHtcbiAgICAgICAgcmV0dXJuICdYWSc7XG4gICAgICB9XG4gICAgfSxcbiAgICBQT0lOVEVSX1RZUEU6ICd0b3VjaCcsXG4gICAgZmlyc3RUb3VjaDogbnVsbCxcbiAgICBpc1ByaW1hcnlUb3VjaDogZnVuY3Rpb24oaW5Ub3VjaCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RUb3VjaCA9PT0gaW5Ub3VjaC5pZGVudGlmaWVyO1xuICAgIH0sXG4gICAgc2V0UHJpbWFyeVRvdWNoOiBmdW5jdGlvbihpblRvdWNoKSB7XG5cbiAgICAgIC8vIHNldCBwcmltYXJ5IHRvdWNoIGlmIHRoZXJlIG5vIHBvaW50ZXJzLCBvciB0aGUgb25seSBwb2ludGVyIGlzIHRoZSBtb3VzZVxuICAgICAgaWYgKHBvaW50ZXJtYXAkMS5zaXplID09PSAwIHx8IChwb2ludGVybWFwJDEuc2l6ZSA9PT0gMSAmJiBwb2ludGVybWFwJDEuaGFzKDEpKSkge1xuICAgICAgICB0aGlzLmZpcnN0VG91Y2ggPSBpblRvdWNoLmlkZW50aWZpZXI7XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IHsgWDogaW5Ub3VjaC5jbGllbnRYLCBZOiBpblRvdWNoLmNsaWVudFkgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW5jZWxSZXNldENsaWNrQ291bnQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZVByaW1hcnlQb2ludGVyOiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIGlmIChpblBvaW50ZXIuaXNQcmltYXJ5KSB7XG4gICAgICAgIHRoaXMuZmlyc3RUb3VjaCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzZXRDbGlja0NvdW50KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGlja0NvdW50OiAwLFxuICAgIHJlc2V0SWQ6IG51bGwsXG4gICAgcmVzZXRDbGlja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNsaWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0SWQgPSBudWxsO1xuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5yZXNldElkID0gc2V0VGltZW91dChmbiwgQ0xJQ0tfQ09VTlRfVElNRU9VVCk7XG4gICAgfSxcbiAgICBjYW5jZWxSZXNldENsaWNrQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMucmVzZXRJZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXNldElkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHR5cGVUb0J1dHRvbnM6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHZhciByZXQgPSAwO1xuICAgICAgaWYgKHR5cGUgPT09ICd0b3VjaHN0YXJ0JyB8fCB0eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICByZXQgPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHRvdWNoVG9Qb2ludGVyOiBmdW5jdGlvbihpblRvdWNoKSB7XG4gICAgICB2YXIgY3RlID0gdGhpcy5jdXJyZW50VG91Y2hFdmVudDtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5jbG9uZUV2ZW50KGluVG91Y2gpO1xuXG4gICAgICAvLyBXZSByZXNlcnZlIHBvaW50ZXJJZCAxIGZvciBNb3VzZS5cbiAgICAgIC8vIFRvdWNoIGlkZW50aWZpZXJzIGNhbiBzdGFydCBhdCAwLlxuICAgICAgLy8gQWRkIDIgdG8gdGhlIHRvdWNoIGlkZW50aWZpZXIgZm9yIGNvbXBhdGliaWxpdHkuXG4gICAgICB2YXIgaWQgPSBlLnBvaW50ZXJJZCA9IGluVG91Y2guaWRlbnRpZmllciArIDI7XG4gICAgICBlLnRhcmdldCA9IGNhcHR1cmVJbmZvW2lkXSB8fCBmaW5kVGFyZ2V0KGUpO1xuICAgICAgZS5idWJibGVzID0gdHJ1ZTtcbiAgICAgIGUuY2FuY2VsYWJsZSA9IHRydWU7XG4gICAgICBlLmRldGFpbCA9IHRoaXMuY2xpY2tDb3VudDtcbiAgICAgIGUuYnV0dG9uID0gMDtcbiAgICAgIGUuYnV0dG9ucyA9IHRoaXMudHlwZVRvQnV0dG9ucyhjdGUudHlwZSk7XG4gICAgICBlLndpZHRoID0gKGluVG91Y2gucmFkaXVzWCB8fCBpblRvdWNoLndlYmtpdFJhZGl1c1ggfHwgMCkgKiAyO1xuICAgICAgZS5oZWlnaHQgPSAoaW5Ub3VjaC5yYWRpdXNZIHx8IGluVG91Y2gud2Via2l0UmFkaXVzWSB8fCAwKSAqIDI7XG4gICAgICBlLnByZXNzdXJlID0gaW5Ub3VjaC5mb3JjZSB8fCBpblRvdWNoLndlYmtpdEZvcmNlIHx8IDAuNTtcbiAgICAgIGUuaXNQcmltYXJ5ID0gdGhpcy5pc1ByaW1hcnlUb3VjaChpblRvdWNoKTtcbiAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRTtcblxuICAgICAgLy8gZm9yd2FyZCBtb2RpZmllciBrZXlzXG4gICAgICBlLmFsdEtleSA9IGN0ZS5hbHRLZXk7XG4gICAgICBlLmN0cmxLZXkgPSBjdGUuY3RybEtleTtcbiAgICAgIGUubWV0YUtleSA9IGN0ZS5tZXRhS2V5O1xuICAgICAgZS5zaGlmdEtleSA9IGN0ZS5zaGlmdEtleTtcblxuICAgICAgLy8gZm9yd2FyZCB0b3VjaCBwcmV2ZW50RGVmYXVsdHNcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5maXJzdFhZID0gbnVsbDtcbiAgICAgICAgY3RlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBwcm9jZXNzVG91Y2hlczogZnVuY3Rpb24oaW5FdmVudCwgaW5GdW5jdGlvbikge1xuICAgICAgdmFyIHRsID0gaW5FdmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgICAgIHRoaXMuY3VycmVudFRvdWNoRXZlbnQgPSBpbkV2ZW50O1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHQ7IGkgPCB0bC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0ID0gdGxbaV07XG4gICAgICAgIGluRnVuY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnRvdWNoVG9Qb2ludGVyKHQpKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRm9yIHNpbmdsZSBheGlzIHNjcm9sbGVycywgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBlbWl0XG4gICAgLy8gcG9pbnRlciBldmVudHMgb3IgYmVoYXZlIGFzIGEgc2Nyb2xsZXJcbiAgICBzaG91bGRTY3JvbGw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmZpcnN0WFkpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgdmFyIHNjcm9sbEF4aXMgPSBpbkV2ZW50LmN1cnJlbnRUYXJnZXQuX3Njcm9sbFR5cGU7XG4gICAgICAgIGlmIChzY3JvbGxBeGlzID09PSAnbm9uZScpIHtcblxuICAgICAgICAgIC8vIHRoaXMgZWxlbWVudCBpcyBhIHRvdWNoLWFjdGlvbjogbm9uZSwgc2hvdWxkIG5ldmVyIHNjcm9sbFxuICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbEF4aXMgPT09ICdYWScpIHtcblxuICAgICAgICAgIC8vIHRoaXMgZWxlbWVudCBzaG91bGQgYWx3YXlzIHNjcm9sbFxuICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHQgPSBpbkV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAgICAgLy8gY2hlY2sgdGhlIGludGVuZGVkIHNjcm9sbCBheGlzLCBhbmQgb3RoZXIgYXhpc1xuICAgICAgICAgIHZhciBhID0gc2Nyb2xsQXhpcztcbiAgICAgICAgICB2YXIgb2EgPSBzY3JvbGxBeGlzID09PSAnWScgPyAnWCcgOiAnWSc7XG4gICAgICAgICAgdmFyIGRhID0gTWF0aC5hYnModFsnY2xpZW50JyArIGFdIC0gdGhpcy5maXJzdFhZW2FdKTtcbiAgICAgICAgICB2YXIgZG9hID0gTWF0aC5hYnModFsnY2xpZW50JyArIG9hXSAtIHRoaXMuZmlyc3RYWVtvYV0pO1xuXG4gICAgICAgICAgLy8gaWYgZGVsdGEgaW4gdGhlIHNjcm9sbCBheGlzID4gZGVsdGEgb3RoZXIgYXhpcywgc2Nyb2xsIGluc3RlYWQgb2ZcbiAgICAgICAgICAvLyBtYWtpbmcgZXZlbnRzXG4gICAgICAgICAgcmV0ID0gZGEgPj0gZG9hO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBmaW5kVG91Y2g6IGZ1bmN0aW9uKGluVEwsIGluSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaW5UTC5sZW5ndGgsIHQ7IGkgPCBsICYmICh0ID0gaW5UTFtpXSk7IGkrKykge1xuICAgICAgICBpZiAodC5pZGVudGlmaWVyID09PSBpbklkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gSW4gc29tZSBpbnN0YW5jZXMsIGEgdG91Y2hzdGFydCBjYW4gaGFwcGVuIHdpdGhvdXQgYSB0b3VjaGVuZC4gVGhpc1xuICAgIC8vIGxlYXZlcyB0aGUgcG9pbnRlcm1hcCBpbiBhIGJyb2tlbiBzdGF0ZS5cbiAgICAvLyBUaGVyZWZvcmUsIG9uIGV2ZXJ5IHRvdWNoc3RhcnQsIHdlIHJlbW92ZSB0aGUgdG91Y2hlcyB0aGF0IGRpZCBub3QgZmlyZSBhXG4gICAgLy8gdG91Y2hlbmQgZXZlbnQuXG4gICAgLy8gVG8ga2VlcCBzdGF0ZSBnbG9iYWxseSBjb25zaXN0ZW50LCB3ZSBmaXJlIGFcbiAgICAvLyBwb2ludGVyY2FuY2VsIGZvciB0aGlzIFwiYWJhbmRvbmVkXCIgdG91Y2hcbiAgICB2YWN1dW1Ub3VjaGVzOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgdGwgPSBpbkV2ZW50LnRvdWNoZXM7XG5cbiAgICAgIC8vIHBvaW50ZXJtYXAuc2l6ZSBzaG91bGQgYmUgPCB0bC5sZW5ndGggaGVyZSwgYXMgdGhlIHRvdWNoc3RhcnQgaGFzIG5vdFxuICAgICAgLy8gYmVlbiBwcm9jZXNzZWQgeWV0LlxuICAgICAgaWYgKHBvaW50ZXJtYXAkMS5zaXplID49IHRsLmxlbmd0aCkge1xuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBwb2ludGVybWFwJDEuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG5cbiAgICAgICAgICAvLyBOZXZlciByZW1vdmUgcG9pbnRlcklkID09IDEsIHdoaWNoIGlzIG1vdXNlLlxuICAgICAgICAgIC8vIFRvdWNoIGlkZW50aWZpZXJzIGFyZSAyIHNtYWxsZXIgdGhhbiB0aGVpciBwb2ludGVySWQsIHdoaWNoIGlzIHRoZVxuICAgICAgICAgIC8vIGluZGV4IGluIHBvaW50ZXJtYXAuXG4gICAgICAgICAgaWYgKGtleSAhPT0gMSAmJiAhdGhpcy5maW5kVG91Y2godGwsIGtleSAtIDIpKSB7XG4gICAgICAgICAgICB2YXIgcCA9IHZhbHVlLm91dDtcbiAgICAgICAgICAgIGQucHVzaChwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICBkLmZvckVhY2godGhpcy5jYW5jZWxPdXQsIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdG91Y2hzdGFydDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdGhpcy52YWN1dW1Ub3VjaGVzKGluRXZlbnQpO1xuICAgICAgdGhpcy5zZXRQcmltYXJ5VG91Y2goaW5FdmVudC5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB0aGlzLmRlZHVwU3ludGhNb3VzZShpbkV2ZW50KTtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgICAgdGhpcy5jbGlja0NvdW50Kys7XG4gICAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5vdmVyRG93bik7XG4gICAgICB9XG4gICAgfSxcbiAgICBvdmVyRG93bjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBwb2ludGVybWFwJDEuc2V0KGluUG9pbnRlci5wb2ludGVySWQsIHtcbiAgICAgICAgdGFyZ2V0OiBpblBvaW50ZXIudGFyZ2V0LFxuICAgICAgICBvdXQ6IGluUG9pbnRlcixcbiAgICAgICAgb3V0VGFyZ2V0OiBpblBvaW50ZXIudGFyZ2V0XG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGluUG9pbnRlcik7XG4gICAgICBkaXNwYXRjaGVyLmRvd24oaW5Qb2ludGVyKTtcbiAgICB9LFxuICAgIHRvdWNobW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRTY3JvbGwoaW5FdmVudCkpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy50b3VjaGNhbmNlbChpbkV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzVG91Y2hlcyhpbkV2ZW50LCB0aGlzLm1vdmVPdmVyT3V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW92ZU92ZXJPdXQ6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgdmFyIGV2ZW50ID0gaW5Qb2ludGVyO1xuICAgICAgdmFyIHBvaW50ZXIgPSBwb2ludGVybWFwJDEuZ2V0KGV2ZW50LnBvaW50ZXJJZCk7XG5cbiAgICAgIC8vIGEgZmluZ2VyIGRyaWZ0ZWQgb2ZmIHRoZSBzY3JlZW4sIGlnbm9yZSBpdFxuICAgICAgaWYgKCFwb2ludGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBvdXRFdmVudCA9IHBvaW50ZXIub3V0O1xuICAgICAgdmFyIG91dFRhcmdldCA9IHBvaW50ZXIub3V0VGFyZ2V0O1xuICAgICAgZGlzcGF0Y2hlci5tb3ZlKGV2ZW50KTtcbiAgICAgIGlmIChvdXRFdmVudCAmJiBvdXRUYXJnZXQgIT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICBvdXRFdmVudC5yZWxhdGVkVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ID0gb3V0VGFyZ2V0O1xuXG4gICAgICAgIC8vIHJlY292ZXIgZnJvbSByZXRhcmdldGluZyBieSBzaGFkb3dcbiAgICAgICAgb3V0RXZlbnQudGFyZ2V0ID0gb3V0VGFyZ2V0O1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChvdXRFdmVudCk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gY2xlYW4gdXAgY2FzZSB3aGVuIGZpbmdlciBsZWF2ZXMgdGhlIHNjcmVlblxuICAgICAgICAgIGV2ZW50LnRhcmdldCA9IG91dFRhcmdldDtcbiAgICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmNhbmNlbE91dChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBvaW50ZXIub3V0ID0gZXZlbnQ7XG4gICAgICBwb2ludGVyLm91dFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICB9LFxuICAgIHRvdWNoZW5kOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB0aGlzLmRlZHVwU3ludGhNb3VzZShpbkV2ZW50KTtcbiAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy51cE91dCk7XG4gICAgfSxcbiAgICB1cE91dDogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsaW5nKSB7XG4gICAgICAgIGRpc3BhdGNoZXIudXAoaW5Qb2ludGVyKTtcbiAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChpblBvaW50ZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGVhblVwUG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG4gICAgdG91Y2hjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5jYW5jZWxPdXQpO1xuICAgIH0sXG4gICAgY2FuY2VsT3V0OiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGluUG9pbnRlcik7XG4gICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KGluUG9pbnRlcik7XG4gICAgICB0aGlzLmNsZWFuVXBQb2ludGVyKGluUG9pbnRlcik7XG4gICAgfSxcbiAgICBjbGVhblVwUG9pbnRlcjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBwb2ludGVybWFwJDEuZGVsZXRlKGluUG9pbnRlci5wb2ludGVySWQpO1xuICAgICAgdGhpcy5yZW1vdmVQcmltYXJ5UG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG5cbiAgICAvLyBwcmV2ZW50IHN5bnRoIG1vdXNlIGV2ZW50cyBmcm9tIGNyZWF0aW5nIHBvaW50ZXIgZXZlbnRzXG4gICAgZGVkdXBTeW50aE1vdXNlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgbHRzID0gbW91c2VFdmVudHMubGFzdFRvdWNoZXM7XG4gICAgICB2YXIgdCA9IGluRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgIC8vIG9ubHkgdGhlIHByaW1hcnkgZmluZ2VyIHdpbGwgc3ludGggbW91c2UgZXZlbnRzXG4gICAgICBpZiAodGhpcy5pc1ByaW1hcnlUb3VjaCh0KSkge1xuXG4gICAgICAgIC8vIHJlbWVtYmVyIHgveSBvZiBsYXN0IHRvdWNoXG4gICAgICAgIHZhciBsdCA9IHsgeDogdC5jbGllbnRYLCB5OiB0LmNsaWVudFkgfTtcbiAgICAgICAgbHRzLnB1c2gobHQpO1xuICAgICAgICB2YXIgZm4gPSAoZnVuY3Rpb24obHRzLCBsdCkge1xuICAgICAgICAgIHZhciBpID0gbHRzLmluZGV4T2YobHQpO1xuICAgICAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKG51bGwsIGx0cywgbHQpO1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCBERURVUF9USU1FT1VUKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSU5TVEFMTEVSID0gbmV3IEluc3RhbGxlcih0b3VjaEV2ZW50cy5lbGVtZW50QWRkZWQsIHRvdWNoRXZlbnRzLmVsZW1lbnRSZW1vdmVkLFxuICAgIHRvdWNoRXZlbnRzLmVsZW1lbnRDaGFuZ2VkLCB0b3VjaEV2ZW50cyk7XG5cbiAgdmFyIHBvaW50ZXJtYXAkMiA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcDtcbiAgdmFyIEhBU19CSVRNQVBfVFlQRSA9IHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJlxuICAgIHR5cGVvZiB3aW5kb3cuTVNQb2ludGVyRXZlbnQuTVNQT0lOVEVSX1RZUEVfTU9VU0UgPT09ICdudW1iZXInO1xuICB2YXIgbXNFdmVudHMgPSB7XG4gICAgZXZlbnRzOiBbXG4gICAgICAnTVNQb2ludGVyRG93bicsXG4gICAgICAnTVNQb2ludGVyTW92ZScsXG4gICAgICAnTVNQb2ludGVyVXAnLFxuICAgICAgJ01TUG9pbnRlck91dCcsXG4gICAgICAnTVNQb2ludGVyT3ZlcicsXG4gICAgICAnTVNQb2ludGVyQ2FuY2VsJyxcbiAgICAgICdNU0dvdFBvaW50ZXJDYXB0dXJlJyxcbiAgICAgICdNU0xvc3RQb2ludGVyQ2FwdHVyZSdcbiAgICBdLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgUE9JTlRFUl9UWVBFUzogW1xuICAgICAgJycsXG4gICAgICAndW5hdmFpbGFibGUnLFxuICAgICAgJ3RvdWNoJyxcbiAgICAgICdwZW4nLFxuICAgICAgJ21vdXNlJ1xuICAgIF0sXG4gICAgcHJlcGFyZUV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGluRXZlbnQ7XG4gICAgICBpZiAoSEFTX0JJVE1BUF9UWVBFKSB7XG4gICAgICAgIGUgPSBkaXNwYXRjaGVyLmNsb25lRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRVNbaW5FdmVudC5wb2ludGVyVHlwZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuICAgIGNsZWFudXA6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBwb2ludGVybWFwJDIuZGVsZXRlKGlkKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlckRvd246IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHBvaW50ZXJtYXAkMi5zZXQoaW5FdmVudC5wb2ludGVySWQsIGluRXZlbnQpO1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZG93bihlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJVcDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIudXAoZSk7XG4gICAgICB0aGlzLmNsZWFudXAoaW5FdmVudC5wb2ludGVySWQpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyT3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck92ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlckNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGUpO1xuICAgICAgdGhpcy5jbGVhbnVwKGluRXZlbnQucG9pbnRlcklkKTtcbiAgICB9LFxuICAgIE1TTG9zdFBvaW50ZXJDYXB0dXJlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIubWFrZUV2ZW50KCdsb3N0cG9pbnRlcmNhcHR1cmUnLCBpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9LFxuICAgIE1TR290UG9pbnRlckNhcHR1cmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5tYWtlRXZlbnQoJ2dvdHBvaW50ZXJjYXB0dXJlJywgaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGFwcGx5UG9seWZpbGwoKSB7XG5cbiAgICAvLyBvbmx5IGFjdGl2YXRlIGlmIHRoaXMgcGxhdGZvcm0gZG9lcyBub3QgaGF2ZSBwb2ludGVyIGV2ZW50c1xuICAgIGlmICghd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgICAgd2luZG93LlBvaW50ZXJFdmVudCA9IFBvaW50ZXJFdmVudDtcblxuICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgICAgICB2YXIgdHAgPSB3aW5kb3cubmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHM7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cubmF2aWdhdG9yLCAnbWF4VG91Y2hQb2ludHMnLCB7XG4gICAgICAgICAgdmFsdWU6IHRwLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXJTb3VyY2UoJ21zJywgbXNFdmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5uYXZpZ2F0b3IsICdtYXhUb3VjaFBvaW50cycsIHtcbiAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCdtb3VzZScsIG1vdXNlRXZlbnRzKTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbnRvdWNoc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXJTb3VyY2UoJ3RvdWNoJywgdG91Y2hFdmVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXIoZG9jdW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBuID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgdmFyIHM7XG4gIHZhciByO1xuICB2YXIgaDtcbiAgZnVuY3Rpb24gYXNzZXJ0QWN0aXZlKGlkKSB7XG4gICAgaWYgKCFkaXNwYXRjaGVyLnBvaW50ZXJtYXAuaGFzKGlkKSkge1xuICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdJbnZhbGlkUG9pbnRlcklkJyk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFsaWRQb2ludGVySWQnO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFzc2VydENvbm5lY3RlZChlbGVtKSB7XG4gICAgdmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZWxlbS5vd25lckRvY3VtZW50KSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignSW52YWxpZFN0YXRlRXJyb3InKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YWxpZFN0YXRlRXJyb3InO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGluQWN0aXZlQnV0dG9uU3RhdGUoaWQpIHtcbiAgICB2YXIgcCA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcC5nZXQoaWQpO1xuICAgIHJldHVybiBwLmJ1dHRvbnMgIT09IDA7XG4gIH1cbiAgaWYgKG4ubXNQb2ludGVyRW5hYmxlZCkge1xuICAgIHMgPSBmdW5jdGlvbihwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgYXNzZXJ0Q29ubmVjdGVkKHRoaXMpO1xuICAgICAgaWYgKGluQWN0aXZlQnV0dG9uU3RhdGUocG9pbnRlcklkKSkge1xuICAgICAgICBkaXNwYXRjaGVyLnNldENhcHR1cmUocG9pbnRlcklkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tc1NldFBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByID0gZnVuY3Rpb24ocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGRpc3BhdGNoZXIucmVsZWFzZUNhcHR1cmUocG9pbnRlcklkLCB0cnVlKTtcbiAgICAgIHRoaXMubXNSZWxlYXNlUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHMgPSBmdW5jdGlvbiBzZXRQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgYXNzZXJ0Q29ubmVjdGVkKHRoaXMpO1xuICAgICAgaWYgKGluQWN0aXZlQnV0dG9uU3RhdGUocG9pbnRlcklkKSkge1xuICAgICAgICBkaXNwYXRjaGVyLnNldENhcHR1cmUocG9pbnRlcklkLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHIgPSBmdW5jdGlvbiByZWxlYXNlUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGRpc3BhdGNoZXIucmVsZWFzZUNhcHR1cmUocG9pbnRlcklkKTtcbiAgICB9O1xuICB9XG4gIGggPSBmdW5jdGlvbiBoYXNQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpIHtcbiAgICByZXR1cm4gISFkaXNwYXRjaGVyLmNhcHR1cmVJbmZvW3BvaW50ZXJJZF07XG4gIH07XG5cbiAgZnVuY3Rpb24gYXBwbHlQb2x5ZmlsbCQxKCkge1xuICAgIGlmICh3aW5kb3cuRWxlbWVudCAmJiAhRWxlbWVudC5wcm90b3R5cGUuc2V0UG9pbnRlckNhcHR1cmUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICAgICdzZXRQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogc1xuICAgICAgICB9LFxuICAgICAgICAncmVsZWFzZVBvaW50ZXJDYXB0dXJlJzoge1xuICAgICAgICAgIHZhbHVlOiByXG4gICAgICAgIH0sXG4gICAgICAgICdoYXNQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogaFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhcHBseUF0dHJpYnV0ZVN0eWxlcygpO1xuICBhcHBseVBvbHlmaWxsKCk7XG4gIGFwcGx5UG9seWZpbGwkMSgpO1xuXG4gIHZhciBwb2ludGVyZXZlbnRzID0ge1xuICAgIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXIsXG4gICAgSW5zdGFsbGVyOiBJbnN0YWxsZXIsXG4gICAgUG9pbnRlckV2ZW50OiBQb2ludGVyRXZlbnQsXG4gICAgUG9pbnRlck1hcDogUG9pbnRlck1hcCxcbiAgICB0YXJnZXRGaW5kaW5nOiB0YXJnZXRpbmdcbiAgfTtcblxuICByZXR1cm4gcG9pbnRlcmV2ZW50cztcblxufSkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3BlcGpzL2Rpc3QvcGVwLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAoc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVpZGF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB1bml0IiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnVJdGVtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0dGl0bGU6IHN0cmluZztcblx0c2VsZWN0ZWQ/OiBib29sZWFuO1xuXHRkYXRhPzogYW55O1xuXHRvblNlbGVjdGVkPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudUl0ZW1Qcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudS1pdGVtJyxcblx0YXR0cmlidXRlczogWyd0aXRsZScsICdzZWxlY3RlZCddLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddLFxuXHRwcm9wZXJ0aWVzOiBbJ2RhdGEnLCAnc2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudUl0ZW0gZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51SXRlbVByb3BlcnRpZXM+IHtcblx0cHJpdmF0ZSBfb25DbGljaygpIHtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCAmJiB0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCh0aGlzLnByb3BlcnRpZXMuZGF0YSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgdGl0bGUsIHNlbGVjdGVkIH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignbGknLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcblx0XHRcdHYoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoW2Nzcy5pdGVtLCBzZWxlY3RlZCA/IGNzcy5zZWxlY3RlZCA6IG51bGxdKSxcblx0XHRcdFx0XHRvbmNsaWNrOiB0aGlzLl9vbkNsaWNrXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFt0aXRsZV1cblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51SXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfY3VzdG9tLWVsZW1lbnRzIS4vc3JjL21lbnUtaXRlbS9NZW51SXRlbS50cyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS05LTMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlci9pbmRleC5qcz90eXBlPWNzcyEuL21lbnVJdGVtLm0uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS05LTMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlci9pbmRleC5qcz90eXBlPWNzcyEuL21lbnVJdGVtLm0uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS05LTMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlci9pbmRleC5qcz90eXBlPWNzcyEuL21lbnVJdGVtLm0uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IHVuaXQiLCJpbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgeyBjdXN0b21FbGVtZW50IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50JztcbmltcG9ydCB7IFdpZGdldFByb3BlcnRpZXMsIFdOb2RlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcbmltcG9ydCB7IE1lbnVJdGVtLCBNZW51SXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9tZW51LWl0ZW0vTWVudUl0ZW0nO1xuXG5pbXBvcnQgKiBhcyBjc3MgZnJvbSAnLi9tZW51Lm0uY3NzJztcblxuaW50ZXJmYWNlIE1lbnVQcm9wZXJ0aWVzIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XG5cdG9uU2VsZWN0ZWQ6IChkYXRhOiBhbnkpID0+IHZvaWQ7XG59XG5cbkBjdXN0b21FbGVtZW50PE1lbnVQcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudScsXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ11cbn0pXG5AdGhlbWUoY3NzKVxuZXhwb3J0IGNsYXNzIE1lbnUgZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51UHJvcGVydGllcywgV05vZGU8TWVudUl0ZW0+PiB7XG5cdHByaXZhdGUgX3NlbGVjdGVkSWQ6IG51bWJlcjtcblxuXHRwcml2YXRlIF9vblNlbGVjdGVkKGlkOiBudW1iZXIsIGRhdGE6IGFueSkge1xuXHRcdHRoaXMuX3NlbGVjdGVkSWQgPSBpZDtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZChkYXRhKTtcblx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQsIGluZGV4KSA9PiB7XG5cdFx0XHRpZiAoY2hpbGQpIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydGllczogUGFydGlhbDxNZW51SXRlbVByb3BlcnRpZXM+ID0ge1xuXHRcdFx0XHRcdG9uU2VsZWN0ZWQ6IChkYXRhOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuX29uU2VsZWN0ZWQoaW5kZXgsIGRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKHRoaXMuX3NlbGVjdGVkSWQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHByb3BlcnRpZXMuc2VsZWN0ZWQgPSBpbmRleCA9PT0gdGhpcy5fc2VsZWN0ZWRJZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZC5wcm9wZXJ0aWVzID0geyAuLi5jaGlsZC5wcm9wZXJ0aWVzLCAuLi5wcm9wZXJ0aWVzIH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdignbmF2JywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5yb290KSB9LCBbXG5cdFx0XHR2KFxuXHRcdFx0XHQnb2wnLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MubWVudUNvbnRhaW5lcilcblx0XHRcdFx0fSxcblx0XHRcdFx0aXRlbXNcblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9jdXN0b20tZWxlbWVudHMhLi9zcmMvbWVudS9NZW51LnRzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kZWNvcmF0b3ItbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTktMyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9wb3N0Y3NzIS4uLy4uL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyL2luZGV4LmpzP3R5cGU9Y3NzIS4vbWVudS5tLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWRlY29yYXRvci1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tOS0zIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3Bvc3Rjc3MhLi4vLi4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXIvaW5kZXguanM/dHlwZT1jc3MhLi9tZW51Lm0uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZGVjb3JhdG9yLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS05LTMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cG9zdGNzcyEuLi8uLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlci9pbmRleC5qcz90eXBlPWNzcyEuL21lbnUubS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gdW5pdCIsImltcG9ydCAnLi9tZW51LWl0ZW0vTWVudUl0ZW0nO1xuaW1wb3J0ICcuL21lbnUvTWVudSc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2N1c3RvbS1lbGVtZW50cyEuL3Rlc3RzL3VuaXQvYWxsLnRzIiwiY29uc3QgeyBkZXNjcmliZSwgaXQgfSA9IGludGVybi5nZXRJbnRlcmZhY2UoJ2JkZCcpO1xuaW1wb3J0IGhhcm5lc3MgZnJvbSAnQGRvam8vdGVzdC1leHRyYXMvaGFybmVzcyc7XG5cbmltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcblxuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICcuLi8uLi8uLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtJztcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuLi8uLi8uLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzJztcblxuZGVzY3JpYmUoJ01lbnVJdGVtJywgKCkgPT4ge1xuXHRpdCgnc2hvdWxkIHJlbmRlciB3aWRnZXQnLCAoKSA9PiB7XG5cdFx0Y29uc3QgdGVzdE1lbnVJdGVtID0gaGFybmVzcyhNZW51SXRlbSk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdGNvbnN0IHRpdGxlID0gJ01lbnUgSXRlbSc7XG5cdFx0dGVzdE1lbnVJdGVtLnNldFByb3BlcnRpZXMoeyBzZWxlY3RlZCwgdGl0bGUgfSk7XG5cdFx0dGVzdE1lbnVJdGVtLmV4cGVjdFJlbmRlcihcblx0XHRcdHYoJ2xpJywgeyBjbGFzc2VzOiBjc3Mucm9vdCB9LCBbXG5cdFx0XHRcdHYoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNsYXNzZXM6IFtjc3MuaXRlbSwgY3NzLnNlbGVjdGVkXSxcblx0XHRcdFx0XHRcdG9uY2xpY2s6IHRlc3RNZW51SXRlbS5saXN0ZW5lclxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0W3RpdGxlXVxuXHRcdFx0XHQpXG5cdFx0XHRdKVxuXHRcdCk7XG5cdH0pO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2N1c3RvbS1lbGVtZW50cyEuL3Rlc3RzL3VuaXQvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwiY29uc3QgeyBkZXNjcmliZSwgaXQgfSA9IGludGVybi5nZXRJbnRlcmZhY2UoJ2JkZCcpO1xuaW1wb3J0IGhhcm5lc3MgZnJvbSAnQGRvam8vdGVzdC1leHRyYXMvaGFybmVzcyc7XG5cbmltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcblxuaW1wb3J0IHsgTWVudSB9IGZyb20gJy4uLy4uLy4uL3NyYy9tZW51L01lbnUnO1xuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4uLy4uLy4uL3NyYy9tZW51L21lbnUubS5jc3MnO1xuXG5kZXNjcmliZSgnTWVudScsICgpID0+IHtcblx0aXQoJ3Nob3VsZCByZW5kZXIgd2lkZ2V0JywgKCkgPT4ge1xuXHRcdGNvbnN0IHRlc3RNZW51ID0gaGFybmVzcyhNZW51KTtcblx0XHR0ZXN0TWVudS5leHBlY3RSZW5kZXIodignbmF2JywgeyBjbGFzc2VzOiBjc3Mucm9vdCB9LCBbdignb2wnLCB7IGNsYXNzZXM6IGNzcy5tZW51Q29udGFpbmVyIH0pXSkpO1xuXHR9KTtcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9jdXN0b20tZWxlbWVudHMhLi90ZXN0cy91bml0L21lbnUvTWVudS50cyJdLCJzb3VyY2VSb290IjoiIn0=