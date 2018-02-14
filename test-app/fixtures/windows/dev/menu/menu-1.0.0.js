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

/***/ "./node_modules/@dojo/widget-core/customElements.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var array_1 = __webpack_require__("./node_modules/@dojo/shim/array.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var DomWrapper_1 = __webpack_require__("./node_modules/@dojo/widget-core/util/DomWrapper.js");
var Projector_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.js");
var ChildrenType;
(function (ChildrenType) {
    ChildrenType["DOJO"] = "DOJO";
    ChildrenType["ELEMENT"] = "ELEMENT";
})(ChildrenType = exports.ChildrenType || (exports.ChildrenType = {}));
/**
 * DomToWidgetWrapper HOC
 *
 * @param domNode The dom node to wrap
 */
function DomToWidgetWrapper(domNode) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(DomToWidgetWrapper, _super);
        function DomToWidgetWrapper() {
            var _this = _super.call(this) || this;
            _this._widgetInstance = domNode.getWidgetInstance && domNode.getWidgetInstance();
            if (!_this._widgetInstance) {
                domNode.addEventListener('connected', function () {
                    _this._widgetInstance = domNode.getWidgetInstance();
                    _this.invalidate();
                });
            }
            return _this;
        }
        DomToWidgetWrapper.prototype.__render__ = function () {
            var vNode = _super.prototype.__render__.call(this);
            vNode.domNode = domNode;
            return vNode;
        };
        DomToWidgetWrapper.prototype.render = function () {
            if (this._widgetInstance) {
                this._widgetInstance.setProperties(tslib_1.__assign({ key: 'root' }, this._widgetInstance.properties, this.properties));
            }
            return d_1.v(domNode.tagName, {});
        };
        return DomToWidgetWrapper;
    }(WidgetBase_1.WidgetBase));
}
exports.DomToWidgetWrapper = DomToWidgetWrapper;
function getWidgetPropertyFromAttribute(attributeName, attributeValue, descriptor) {
    var _a = descriptor.propertyName, propertyName = _a === void 0 ? attributeName : _a, _b = descriptor.value, value = _b === void 0 ? attributeValue : _b;
    if (typeof value === 'function') {
        value = value(attributeValue);
    }
    return [propertyName, value];
}
exports.customEventClass = global_1.default.CustomEvent;
if (typeof exports.customEventClass !== 'function') {
    var customEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    if (global_1.default.Event) {
        customEvent.prototype = global_1.default.Event.prototype;
    }
    exports.customEventClass = customEvent;
}
/**
 * Called by HTMLElement subclass to initialize itself with the appropriate attributes/properties/events.
 *
 * @param element The element to initialize.
 */
function initializeElement(element) {
    var initialProperties = {};
    var _a = element.getDescriptor(), _b = _a.childrenType, childrenType = _b === void 0 ? ChildrenType.DOJO : _b, _c = _a.attributes, attributes = _c === void 0 ? [] : _c, _d = _a.events, events = _d === void 0 ? [] : _d, _e = _a.properties, properties = _e === void 0 ? [] : _e, initialization = _a.initialization;
    attributes.forEach(function (attribute) {
        var attributeName = attribute.attributeName;
        var _a = tslib_1.__read(getWidgetPropertyFromAttribute(attributeName, element.getAttribute(attributeName.toLowerCase()), attribute), 2), propertyName = _a[0], propertyValue = _a[1];
        initialProperties[propertyName] = propertyValue;
    });
    properties.forEach(function (_a) {
        var propertyName = _a.propertyName, widgetPropertyName = _a.widgetPropertyName;
        initialProperties[widgetPropertyName || propertyName] = element[propertyName];
    });
    var customProperties = {};
    attributes.reduce(function (properties, attribute) {
        var _a = attribute.propertyName, propertyName = _a === void 0 ? attribute.attributeName : _a;
        properties[propertyName] = {
            get: function () {
                return element.getWidgetInstance().properties[propertyName];
            },
            set: function (value) {
                var _a = tslib_1.__read(getWidgetPropertyFromAttribute(attribute.attributeName, value, attribute), 2), propertyName = _a[0], propertyValue = _a[1];
                element.getWidgetInstance().setProperties(lang_1.assign({}, element.getWidgetInstance().properties, (_b = {},
                    _b[propertyName] = propertyValue,
                    _b)));
                var _b;
            }
        };
        return properties;
    }, customProperties);
    properties.reduce(function (properties, property) {
        var propertyName = property.propertyName, getValue = property.getValue, setValue = property.setValue;
        var _a = property.widgetPropertyName, widgetPropertyName = _a === void 0 ? propertyName : _a;
        properties[propertyName] = {
            get: function () {
                var value = element.getWidgetInstance().properties[widgetPropertyName];
                return getValue ? getValue(value) : value;
            },
            set: function (value) {
                element.getWidgetInstance().setProperties(lang_1.assign({}, element.getWidgetInstance().properties, (_a = {},
                    _a[widgetPropertyName] = setValue ? setValue(value) : value,
                    _a)));
                var _a;
            }
        };
        return properties;
    }, customProperties);
    Object.defineProperties(element, customProperties);
    // define events
    events.forEach(function (event) {
        var propertyName = event.propertyName, eventName = event.eventName;
        initialProperties[propertyName] = function (event) {
            element.dispatchEvent(new exports.customEventClass(eventName, {
                bubbles: false,
                detail: event
            }));
        };
    });
    if (initialization) {
        initialization.call(element, initialProperties);
    }
    var projector = Projector_1.ProjectorMixin(element.getWidgetConstructor());
    var widgetInstance = new projector();
    widgetInstance.setProperties(initialProperties);
    element.setWidgetInstance(widgetInstance);
    return function () {
        var children = [];
        var elementChildren = element.childNodes ? array_1.from(element.childNodes) : [];
        elementChildren.forEach(function (childNode, index) {
            var properties = { key: "child-" + index };
            if (childrenType === ChildrenType.DOJO) {
                children.push(d_1.w(DomToWidgetWrapper(childNode), properties));
            }
            else {
                children.push(d_1.w(DomWrapper_1.DomWrapper(childNode), properties));
            }
        });
        elementChildren.forEach(function (childNode) {
            element.removeChild(childNode);
        });
        widgetInstance.setChildren(children);
        widgetInstance.append(element);
    };
}
exports.initializeElement = initializeElement;
/**
 * Called by HTMLElement subclass when an HTML attribute has changed.
 *
 * @param element     The element whose attributes are being watched
 * @param name        The name of the attribute
 * @param newValue    The new value of the attribute
 * @param oldValue    The old value of the attribute
 */
function handleAttributeChanged(element, name, newValue, oldValue) {
    var attributes = element.getDescriptor().attributes || [];
    attributes.forEach(function (attribute) {
        var attributeName = attribute.attributeName;
        if (attributeName.toLowerCase() === name.toLowerCase()) {
            var _a = tslib_1.__read(getWidgetPropertyFromAttribute(attributeName, newValue, attribute), 2), propertyName = _a[0], propertyValue = _a[1];
            element
                .getWidgetInstance()
                .setProperties(lang_1.assign({}, element.getWidgetInstance().properties, (_b = {}, _b[propertyName] = propertyValue, _b)));
        }
        var _b;
    });
}
exports.handleAttributeChanged = handleAttributeChanged;

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

/***/ "./node_modules/@dojo/widget-core/registerCustomElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var customElements_1 = __webpack_require__("./node_modules/@dojo/widget-core/customElements.js");
/**
 * Register a custom element using the v1 spec of custom elements. Note that
 * this is the default export, and, expects the proposal to work in the browser.
 * This will likely require the polyfill and native shim.
 *
 * @param descriptorFactory
 */
function registerCustomElement(descriptorFactory) {
    var descriptor = descriptorFactory();
    customElements.define(descriptor.tagName, /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            _this._isAppended = false;
            _this._appender = customElements_1.initializeElement(_this);
            return _this;
        }
        class_1.prototype.connectedCallback = function () {
            if (!this._isAppended) {
                this._appender();
                this._isAppended = true;
                this.dispatchEvent(new customElements_1.customEventClass('connected', {
                    bubbles: false
                }));
            }
        };
        class_1.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            customElements_1.handleAttributeChanged(this, name, newValue, oldValue);
        };
        class_1.prototype.getWidgetInstance = function () {
            return this._widgetInstance;
        };
        class_1.prototype.setWidgetInstance = function (widget) {
            this._widgetInstance = widget;
        };
        class_1.prototype.getWidgetConstructor = function () {
            return this.getDescriptor().widgetConstructor;
        };
        class_1.prototype.getDescriptor = function () {
            return descriptor;
        };
        Object.defineProperty(class_1, "observedAttributes", {
            get: function () {
                return (descriptor.attributes || []).map(function (attribute) { return attribute.attributeName.toLowerCase(); });
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(HTMLElement)));
}
exports.registerCustomElement = registerCustomElement;
exports.default = registerCustomElement;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/util/DomWrapper.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
function isElement(value) {
    return value.tagName;
}
function DomWrapper(domNode, options) {
    if (options === void 0) { options = {}; }
    return /** @class */ (function (_super) {
        tslib_1.__extends(DomWrapper, _super);
        function DomWrapper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DomWrapper.prototype.__render__ = function () {
            var vNode = _super.prototype.__render__.call(this);
            vNode.domNode = domNode;
            return vNode;
        };
        DomWrapper.prototype.onAttach = function () {
            options.onAttached && options.onAttached();
        };
        DomWrapper.prototype.render = function () {
            var properties = tslib_1.__assign({}, this.properties, { key: 'root' });
            var tag = isElement(domNode) ? domNode.tagName : '';
            return d_1.v(tag, properties);
        };
        return DomWrapper;
    }(WidgetBase_1.WidgetBase));
}
exports.DomWrapper = DomWrapper;
exports.default = DomWrapper;

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

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu/Menu.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js").default;

var defaultExport = widgetFactory.default;
defaultExport && registerCustomElement(defaultExport);



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

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzlkY2IzYzE1OWVlODUzYTQyYmUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9hc3BlY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vaGFzL2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vUHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5SGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvY3VzdG9tRWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kaWZmLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3V0aWwvRG9tV3JhcHBlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVwanMvZGlzdC9wZXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUvTWVudS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9tZW51Lm0uY3NzPzVkNDAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQzdEQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDhCOzs7Ozs7OztBQ3pEQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QscUJBQXFCLGVBQWUsRUFBRSxFQUFFO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLHlCQUF5QixFQUFFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxjQUFjO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix1QkFBdUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSwyRUFBMkUsRUFBRTtBQUNsSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGLCtDQUErQyxFQUFFO0FBQ2xJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDBCOzs7Ozs7OztBQzdJQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDJDQUEyQyx1QkFBdUI7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCOzs7Ozs7OztBQ25WQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esc0Q7Ozs7Ozs7O3VEQ3pPQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsbUJBQW1CO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRTs7Ozs7Ozs7O0FDMU1EO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFCQUFxQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrR0FBK0csb0JBQW9CO0FBQ25JO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFFBQVEsZ0JBQWdCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDBCQUEwQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsY0FBYztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPOzs7Ozs7OztBQ2xIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixNQUFNO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxXQUFXO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixNQUFNO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkdBQTJHLG9CQUFvQjtBQUMvSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFFBQVEsZ0JBQWdCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDBCQUEwQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJHQUEyRyxvQkFBb0I7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBMEI7QUFDM0Q7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTzs7Ozs7Ozs7QUNoT0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixJQUFJO0FBQ3BCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLElBQUk7QUFDaEIsWUFBWSxVQUFVO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGlDOzs7Ozs7OztBQ2xKQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHFCQUFxQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyR0FBMkcsb0JBQW9CO0FBQy9IO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFFBQVEsZ0JBQWdCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDBCQUEwQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZ0NBQWdDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxrQzs7Ozs7Ozs7QUM5SEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixzQkFBc0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUdBQXVHLHFCQUFxQjtBQUM1SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVEsZ0JBQWdCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDBCQUEwQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsZUFBZTtBQUNsRDtBQUNBLCtCQUErQixTQUFTO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs4Q0MvTUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsK0I7Ozs7Ozs7OztBQ2xCQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQjs7Ozs7Ozs7QUNySEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0M7Ozs7Ozs7O0FDMURBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxxQ0FBcUMsRUFBRTtBQUM1RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLHFDQUFxQyxFQUFFO0FBQzNHO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvQ0FBb0MsRUFBRTtBQUMxRSxpQ0FBaUMscUNBQXFDLEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxJQUFJO0FBQ2I7QUFDQTtBQUNBLG1EQUFtRCxzQkFBc0IsRUFBRTtBQUMzRTtBQUNBO0FBQ0EsbURBQW1ELGVBQWUsRUFBRTtBQUNwRTtBQUNBLEM7Ozs7Ozs7O0FDaEZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxjQUFjO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsY0FBYztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxjQUFjO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGNBQWM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msa0JBQWtCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGtCQUFrQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7O0FDdE9BO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxzQ0FBc0MsRUFBRTtBQUN6RixrRUFBa0UsZ0RBQWdELEVBQUU7QUFDcEgsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxvQ0FBb0MsdURBQXVELEVBQUU7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsMERBQTBELEVBQUU7QUFDekYsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSwyRkFBMkYsNERBQTRELEVBQUU7QUFDekosQ0FBQztBQUNEO0FBQ0EscUZBQXFGLDREQUE0RCxFQUFFO0FBQ25KLENBQUM7QUFDRDtBQUNBLHdDQUF3QywyREFBMkQsRUFBRTtBQUNyRztBQUNBLHNDQUFzQyx1RkFBdUYsRUFBRTtBQUMvSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsMkRBQTJELEVBQUU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxxRUFBcUUsRUFBRTtBQUN2RyxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0Esd0RBQXdELHFFQUFxRSxFQUFFO0FBQy9ILENBQUM7QUFDRDtBQUNBLHFDQUFxQyx1RkFBdUYsRUFBRTtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EscUNBQXFDLDRHQUE0RyxFQUFFO0FBQ25KO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELDhCQUE4QixxRUFBcUUsRUFBRTtBQUNyRyx1Q0FBdUMsNkRBQTZELEVBQUU7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsRUFBRTtBQUMvRCxtQ0FBbUMsbUJBQW1CO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELHFCOzs7Ozs7OztvREMzS0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsa0NBQWtDLG1CQUFtQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsSTs7Ozs7Ozs7O0FDMUxEO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msb0JBQW9CO0FBQ3BELDhCQUE4QixpQkFBaUI7QUFDL0Msa0NBQWtDLHFCQUFxQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7O0FDaENBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDJCOzs7Ozs7OztBQ3JCQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0VBQXNFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQSxtQkFBbUIsNkJBQTZCO0FBQ2hEO0FBQ0E7QUFDQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw4Qjs7Ozs7Ozs7QUM1Q0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQjs7Ozs7Ozs7QUN2SEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUJBQXFCO0FBQ3pEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0Esa0M7Ozs7Ozs7O0FDcEZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDRCQUE0QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxvQ0FBb0M7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUscUNBQXFDLEVBQUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw2Qjs7Ozs7Ozs7QUM3WUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7O0FDL0RBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxtRUFBbUU7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLGNBQWM7QUFDbkY7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLDBFQUEwRSxrREFBa0Q7QUFDNUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMEVBQTBFLGtEQUFrRDtBQUM1SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxrREFBa0Q7QUFDakc7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHdEOzs7Ozs7OztBQ25MQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsMkJBQTJCO0FBQ3JFLDhCQUE4QixzQkFBc0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYzs7Ozs7Ozs7QUM1RUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOEI7Ozs7Ozs7O0FDVEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUM7Ozs7Ozs7O0FDVEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxVQUFVLCtCQUErQixFQUFFLEVBQUU7QUFDdEgsd0VBQXdFLFVBQVUsNkJBQTZCLEVBQUUsRUFBRTtBQUNuSCxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBLGFBQWEsRUFBRSxFQUFFO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQzs7Ozs7Ozs7QUN2QkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsK0I7Ozs7Ozs7O0FDdkJBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDOzs7Ozs7OztBQ25CQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EseUI7Ozs7Ozs7O0FDdkNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQjs7Ozs7Ozs7QUN2RUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDJGQUEyRjtBQUM1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsNkRBQTZEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdUJBQXVCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hELCtEQUErRCxnREFBZ0Q7QUFDL0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELDRCQUE0QixxQkFBcUI7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7QUN2TEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUssSUFBSTtBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCx3Q0FBd0MsRUFBRTtBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxpQkFBaUIsSUFBSTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsYUFBYSxJQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsOEI7Ozs7Ozs7O0FDckpBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0UsOENBQThDLEVBQUU7QUFDL0gsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdDOzs7Ozs7OztBQ3hEQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGNBQWM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxvQkFBb0IsY0FBYztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkI7Ozs7Ozs7O0FDaENBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsNkJBQTZCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVDQUF1QztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyw4QkFBOEI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyw4QkFBOEI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5QkFBeUI7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyw2QkFBNkI7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHNCQUFzQixxQ0FBcUM7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQ0FBa0Msa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywwQkFBMEI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHNCQUFzQixxQ0FBcUM7QUFDdEcsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx1REFBdUQ7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5Q0FBeUM7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHNCQUFzQiwyQkFBMkI7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsMkNBQTJDO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsc0JBQXNCLDJCQUEyQjtBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBCQUEwQixFQUFFO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsd0JBQXdCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyx3Q0FBd0M7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx5REFBeUQ7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7O0FDbDNCQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxvQkFBb0I7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLHdCQUF3QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlCQUF5QiwyQ0FBMkM7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseUJBQXlCLDJDQUEyQzs7QUFFcEU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckIsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsd0JBQXdCO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLHlCQUF5QixFQUFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsdUJBQXVCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0NBQXdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUNBQXlDLHdCQUF3QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDLEc7Ozs7Ozs7QUNoOENEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7O0FDdkx0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7OztBQ3pMRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTtBQUFBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUMvRSxxQkFBcUIsdURBQXVEOztBQUU1RTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBOztBQUVBO0FBQ0EsNENBQTRDLE9BQU87QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELGNBQWM7QUFDMUU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsb0NBQW9DO0FBQ3ZFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLGlFQUFpRSx1QkFBdUIsRUFBRSw0QkFBNEI7QUFDcko7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLDZCQUE2QiwwQkFBMEIsYUFBYSxFQUFFLHFCQUFxQjtBQUN4RyxnQkFBZ0IscURBQXFELG9FQUFvRSxhQUFhLEVBQUU7QUFDeEosc0JBQXNCLHNCQUFzQixxQkFBcUIsR0FBRztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsa0NBQWtDLFNBQVM7QUFDM0Msa0NBQWtDLFdBQVcsVUFBVTtBQUN2RCx5Q0FBeUMsY0FBYztBQUN2RDtBQUNBLDZHQUE2RyxPQUFPLFVBQVU7QUFDOUgsZ0ZBQWdGLGlCQUFpQixPQUFPO0FBQ3hHLHdEQUF3RCxnQkFBZ0IsUUFBUSxPQUFPO0FBQ3ZGLDhDQUE4QyxnQkFBZ0IsZ0JBQWdCLE9BQU87QUFDckY7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLFNBQVMsWUFBWSxhQUFhLE9BQU8sRUFBRSxVQUFVLFdBQVc7QUFDaEUsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixNQUFNLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLHNCQUFzQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzRkFBc0YsYUFBYSxFQUFFO0FBQ3RILHNCQUFzQixnQ0FBZ0MscUNBQXFDLDBDQUEwQyxFQUFFLEVBQUUsR0FBRztBQUM1SSwyQkFBMkIsTUFBTSxlQUFlLEVBQUUsWUFBWSxvQkFBb0IsRUFBRTtBQUNwRixzQkFBc0Isb0dBQW9HO0FBQzFILDZCQUE2Qix1QkFBdUI7QUFDcEQsNEJBQTRCLHdCQUF3QjtBQUNwRCwyQkFBMkIseURBQXlEO0FBQ3BGOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsNENBQTRDLFNBQVMsRUFBRSxxREFBcUQsYUFBYSxFQUFFO0FBQzVJLHlCQUF5QixnQ0FBZ0Msb0JBQW9CLGdEQUFnRCxnQkFBZ0IsR0FBRztBQUNoSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLHVDQUF1QyxhQUFhLEVBQUUsRUFBRSxPQUFPLGtCQUFrQjtBQUNqSDtBQUNBOzs7Ozs7OztBQ3JLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFXQTtJQUEwQjtJQUExQjs7SUFtQ0E7SUFoQ1MsMkJBQVcsRUFBbkIsVUFBb0IsRUFBVSxFQUFFLElBQVM7UUFDeEMsSUFBSSxDQUFDLFlBQVcsRUFBRyxFQUFFO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxFQUFFO0lBQ2xCLENBQUM7SUFFUyxzQkFBTSxFQUFoQjtRQUFBO1FBQ0MsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztZQUM1QyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQU0sV0FBVSxFQUFnQztvQkFDL0MsVUFBVSxFQUFFLFVBQUMsSUFBUzt3QkFDckIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO29CQUM5QjtpQkFDQTtnQkFDRCxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVcsSUFBSyxTQUFTLEVBQUU7b0JBQ25DLFVBQVUsQ0FBQyxTQUFRLEVBQUcsTUFBSyxJQUFLLEtBQUksQ0FBQyxXQUFXO2dCQUNqRDtnQkFDQSxLQUFLLENBQUMsV0FBVSx1QkFBUSxLQUFLLENBQUMsVUFBVSxFQUFLLFVBQVUsQ0FBRTtZQUMxRDtZQUNBLE9BQU8sS0FBSztRQUNiLENBQUMsQ0FBQztRQUVGLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2xELEtBQUMsQ0FDQSxJQUFJLEVBQ0o7Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDckMsRUFDRCxLQUFLO1NBRU4sQ0FBQztJQUNILENBQUM7SUFsQ1csS0FBSTtRQUxoQiw2QkFBYSxDQUFpQjtZQUM5QixHQUFHLEVBQUUsV0FBVztZQUNoQixNQUFNLEVBQUUsQ0FBQyxZQUFZO1NBQ3JCLENBQUM7UUFDRCxjQUFLLENBQUMsR0FBRztPQUNHLElBQUksQ0FtQ2hCO0lBQUQsV0FBQztDQW5DRCxDQUEwQixvQkFBVyxDQUFDLHVCQUFVLENBQUM7QUFBcEM7QUFxQ2Isa0JBQWUsSUFBSTs7Ozs7Ozs7QUN2RG5CO0FBQ0Esa0JBQWtCLCtEIiwiZmlsZSI6Im1lbnUtMS4wLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjOWRjYjNjMTU5ZWU4NTNhNDJiZSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBQcm9taXNlXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9Qcm9taXNlXCIpO1xyXG4vKipcclxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBub29wKCkge1xyXG4gICAgcmV0dXJuIFByb21pc2VfMS5kZWZhdWx0LnJlc29sdmUoZmFsc2UpO1xyXG59XHJcbi8qKlxyXG4gKiBObyBvcCBmdW5jdGlvbiB1c2VkIHRvIHJlcGxhY2Ugb3duLCBvbmNlIGluc3RhbmNlIGhhcyBiZWVuIGRlc3RvcnllZFxyXG4gKi9cclxuZnVuY3Rpb24gZGVzdHJveWVkKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsIG1hZGUgdG8gZGVzdHJveWVkIG1ldGhvZCcpO1xyXG59XHJcbnZhciBEZXN0cm95YWJsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBEZXN0cm95YWJsZSgpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXMgPSBbXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2VcclxuICAgICAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxyXG4gICAgICovXHJcbiAgICBEZXN0cm95YWJsZS5wcm90b3R5cGUub3duID0gZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgIHZhciBoYW5kbGVzID0gdGhpcy5oYW5kbGVzO1xyXG4gICAgICAgIGhhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXMuc3BsaWNlKGhhbmRsZXMuaW5kZXhPZihoYW5kbGUpKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJweXMgYWxsIGhhbmRlcnMgcmVnaXN0ZXJlZCBmb3IgdGhlIGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcclxuICAgICAqL1xyXG4gICAgRGVzdHJveWFibGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VfMS5kZWZhdWx0KGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIF90aGlzLmRlc3Ryb3kgPSBub29wO1xyXG4gICAgICAgICAgICBfdGhpcy5vd24gPSBkZXN0cm95ZWQ7XHJcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERlc3Ryb3lhYmxlO1xyXG59KCkpO1xyXG5leHBvcnRzLkRlc3Ryb3lhYmxlID0gRGVzdHJveWFibGU7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERlc3Ryb3lhYmxlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxudmFyIGFzcGVjdF8xID0gcmVxdWlyZShcIi4vYXNwZWN0XCIpO1xyXG52YXIgRGVzdHJveWFibGVfMSA9IHJlcXVpcmUoXCIuL0Rlc3Ryb3lhYmxlXCIpO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpcyB0aGUgdmFsdWUgaXMgQWN0aW9uYWJsZSAoaGFzIGEgYC5kb2AgZnVuY3Rpb24pXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gY2hlY2tcclxuICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlzIHRoZSB2YWx1ZSBpcyBBY3Rpb25hYmxlXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FjdGlvbmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiBCb29sZWFuKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5kbyA9PT0gJ2Z1bmN0aW9uJyk7XHJcbn1cclxuLyoqXHJcbiAqIFJlc29sdmUgbGlzdGVuZXJzLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVzb2x2ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XHJcbiAgICByZXR1cm4gaXNBY3Rpb25hYmxlKGxpc3RlbmVyKSA/IGZ1bmN0aW9uIChldmVudCkgeyByZXR1cm4gbGlzdGVuZXIuZG8oeyBldmVudDogZXZlbnQgfSk7IH0gOiBsaXN0ZW5lcjtcclxufVxyXG4vKipcclxuICogSGFuZGxlcyBhbiBhcnJheSBvZiBoYW5kbGVzXHJcbiAqXHJcbiAqIEBwYXJhbSBoYW5kbGVzIGFuIGFycmF5IG9mIGhhbmRsZXNcclxuICogQHJldHVybnMgYSBzaW5nbGUgSGFuZGxlIGZvciBoYW5kbGVzIHBhc3NlZFxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7IHJldHVybiBoYW5kbGUuZGVzdHJveSgpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBNYXAgb2YgY29tcHV0ZWQgcmVndWxhciBleHByZXNzaW9ucywga2V5ZWQgYnkgc3RyaW5nXHJcbiAqL1xyXG52YXIgcmVnZXhNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpcyB0aGUgZXZlbnQgdHlwZSBnbG9iIGhhcyBiZWVuIG1hdGNoZWRcclxuICpcclxuICogQHJldHVybnMgYm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgZ2xvYiBpcyBtYXRjaGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0dsb2JNYXRjaChnbG9iU3RyaW5nLCB0YXJnZXRTdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgdGFyZ2V0U3RyaW5nID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgZ2xvYlN0cmluZyA9PT0gJ3N0cmluZycgJiYgZ2xvYlN0cmluZy5pbmRleE9mKCcqJykgIT09IC0xKSB7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gdm9pZCAwO1xyXG4gICAgICAgIGlmIChyZWdleE1hcC5oYXMoZ2xvYlN0cmluZykpIHtcclxuICAgICAgICAgICAgcmVnZXggPSByZWdleE1hcC5nZXQoZ2xvYlN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoXCJeXCIgKyBnbG9iU3RyaW5nLnJlcGxhY2UoL1xcKi9nLCAnLionKSArIFwiJFwiKTtcclxuICAgICAgICAgICAgcmVnZXhNYXAuc2V0KGdsb2JTdHJpbmcsIHJlZ2V4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodGFyZ2V0U3RyaW5nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBnbG9iU3RyaW5nID09PSB0YXJnZXRTdHJpbmc7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5pc0dsb2JNYXRjaCA9IGlzR2xvYk1hdGNoO1xyXG4vKipcclxuICogRXZlbnQgQ2xhc3NcclxuICovXHJcbnZhciBFdmVudGVkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEV2ZW50ZWQsIF9zdXBlcik7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIGNvbnN0cnVjdG9yIGFyZ3VybWVudHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRXZlbnRlZChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIG1hcCBvZiBsaXN0ZW5lcnMga2V5ZWQgYnkgZXZlbnQgdHlwZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLmxpc3RlbmVyc01hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2F0Y2ggYWxsIGhhbmRsZXIgZm9yIHZhcmlvdXMgY2FsbCBzaWduYXR1cmVzLiBUaGUgc2lnbmF0dXJlcyBhcmUgZGVmaW5lZCBpblxyXG4gICAgICAgICAqIGBCYXNlRXZlbnRlZEV2ZW50c2AuICBZb3UgY2FuIGFkZCB5b3VyIG93biBldmVudCB0eXBlIC0+IGhhbmRsZXIgdHlwZXMgYnkgZXh0ZW5kaW5nXHJcbiAgICAgICAgICogYEJhc2VFdmVudGVkRXZlbnRzYC4gIFNlZSBleGFtcGxlIGZvciBkZXRhaWxzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3NcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBpbnRlcmZhY2UgV2lkZ2V0QmFzZUV2ZW50cyBleHRlbmRzIEJhc2VFdmVudGVkRXZlbnRzIHtcclxuICAgICAgICAgKiAgICAgKHR5cGU6ICdwcm9wZXJ0aWVzOmNoYW5nZWQnLCBoYW5kbGVyOiBQcm9wZXJ0aWVzQ2hhbmdlZEhhbmRsZXIpOiBIYW5kbGU7XHJcbiAgICAgICAgICogfVxyXG4gICAgICAgICAqIGNsYXNzIFdpZGdldEJhc2UgZXh0ZW5kcyBFdmVudGVkIHtcclxuICAgICAgICAgKiAgICBvbjogV2lkZ2V0QmFzZUV2ZW50cztcclxuICAgICAgICAgKiB9XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHthbnl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX3RoaXMub24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2EgPSB0c2xpYl8xLl9fcmVhZChhcmdzLCAyKSwgdHlwZV8xID0gX2FbMF0sIGxpc3RlbmVycyA9IF9hWzFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVzID0gbGlzdGVuZXJzLm1hcChmdW5jdGlvbiAobGlzdGVuZXIpIHsgcmV0dXJuIGFzcGVjdF8xLm9uKF90aGlzLmxpc3RlbmVyc01hcCwgdHlwZV8xLCByZXNvbHZlTGlzdGVuZXIobGlzdGVuZXIpKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdF8xLm9uKHRoaXMubGlzdGVuZXJzTWFwLCB0eXBlXzEsIHJlc29sdmVMaXN0ZW5lcihsaXN0ZW5lcnMpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9iID0gdHNsaWJfMS5fX3JlYWQoYXJncywgMSksIGxpc3RlbmVyTWFwQXJnXzEgPSBfYlswXTtcclxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVzID0gT2JqZWN0LmtleXMobGlzdGVuZXJNYXBBcmdfMSkubWFwKGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiBfdGhpcy5vbih0eXBlLCBsaXN0ZW5lck1hcEFyZ18xW3R5cGVdKTsgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gb3B0aW9ucy5saXN0ZW5lcnM7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBfdGhpcy5vd24oX3RoaXMub24obGlzdGVuZXJzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRW1pdHMgdGhlIGV2ZW50IG9iamV0IGZvciB0aGUgc3BlY2lmaWVkIHR5cGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGVtaXRcclxuICAgICAqL1xyXG4gICAgRXZlbnRlZC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kLCB0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0dsb2JNYXRjaCh0eXBlLCBldmVudC50eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwoX3RoaXMsIGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFdmVudGVkO1xyXG59KERlc3Ryb3lhYmxlXzEuRGVzdHJveWFibGUpKTtcclxuZXhwb3J0cy5FdmVudGVkID0gRXZlbnRlZDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRXZlbnRlZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCIuL2xhbmdcIik7XHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCB0eXBlIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiB2YWx1ZSBpcyBNYXBMaWtlIG9yIG5vdFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGFnYWluc3RcclxuICovXHJcbmZ1bmN0aW9uIGlzTWFwTGlrZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5nZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlLnNldCA9PT0gJ2Z1bmN0aW9uJztcclxufVxyXG4vKipcclxuICogQSB3ZWFrIG1hcCBvZiBkaXNwYXRjaGVycyB1c2VkIHRvIGFwcGx5IHRoZSBhZHZpY2VcclxuICovXHJcbnZhciBkaXNwYXRjaEFkdmljZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4vKipcclxuICogQSBVSUQgZm9yIHRyYWNraW5nIGFkdmljZSBvcmRlcmluZ1xyXG4gKi9cclxudmFyIG5leHRJZCA9IDA7XHJcbi8qKlxyXG4gKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGFkdmlzZXMgYSBqb2luIHBvaW50XHJcbiAqXHJcbiAqIEBwYXJhbSBkaXNwYXRjaGVyIFRoZSBjdXJyZW50IGFkdmljZSBkaXNwYXRjaGVyXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGJlZm9yZSBvciBhZnRlciBhZHZpY2UgdG8gYXBwbHlcclxuICogQHBhcmFtIGFkdmljZSBUaGUgYWR2aWNlIHRvIGFwcGx5XHJcbiAqIEBwYXJhbSByZWNlaXZlQXJndW1lbnRzIElmIHRydWUsIHRoZSBhZHZpY2Ugd2lsbCByZWNlaXZlIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBqb2luIHBvaW50XHJcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBhZHZpY2VcclxuICovXHJcbmZ1bmN0aW9uIGFkdmlzZU9iamVjdChkaXNwYXRjaGVyLCB0eXBlLCBhZHZpY2UsIHJlY2VpdmVBcmd1bWVudHMpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IGRpc3BhdGNoZXIgJiYgZGlzcGF0Y2hlclt0eXBlXTtcclxuICAgIHZhciBhZHZpc2VkID0ge1xyXG4gICAgICAgIGlkOiBuZXh0SWQrKyxcclxuICAgICAgICBhZHZpY2U6IGFkdmljZSxcclxuICAgICAgICByZWNlaXZlQXJndW1lbnRzOiByZWNlaXZlQXJndW1lbnRzXHJcbiAgICB9O1xyXG4gICAgaWYgKHByZXZpb3VzKSB7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdhZnRlcicpIHtcclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBsaXN0ZW5lciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIC8vIG5vdGUgdGhhdCB3ZSBoYWQgdG8gY2hhbmdlIHRoaXMgbG9vcCBhIGxpdHRsZSBiaXQgdG8gd29ya2Fyb3VuZCBhIGJpemFycmUgSUUxMCBKSVQgYnVnXHJcbiAgICAgICAgICAgIHdoaWxlIChwcmV2aW91cy5uZXh0ICYmIChwcmV2aW91cyA9IHByZXZpb3VzLm5leHQpKSB7IH1cclxuICAgICAgICAgICAgcHJldmlvdXMubmV4dCA9IGFkdmlzZWQ7XHJcbiAgICAgICAgICAgIGFkdmlzZWQucHJldmlvdXMgPSBwcmV2aW91cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGFkZCB0byB0aGUgYmVnaW5uaW5nXHJcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaGVyKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmJlZm9yZSA9IGFkdmlzZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWR2aXNlZC5uZXh0ID0gcHJldmlvdXM7XHJcbiAgICAgICAgICAgIHByZXZpb3VzLnByZXZpb3VzID0gYWR2aXNlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaGVyICYmIChkaXNwYXRjaGVyW3R5cGVdID0gYWR2aXNlZCk7XHJcbiAgICB9XHJcbiAgICBhZHZpY2UgPSBwcmV2aW91cyA9IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBsYW5nXzEuY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSAoYWR2aXNlZCB8fCB7fSksIF9iID0gX2EucHJldmlvdXMsIHByZXZpb3VzID0gX2IgPT09IHZvaWQgMCA/IHVuZGVmaW5lZCA6IF9iLCBfYyA9IF9hLm5leHQsIG5leHQgPSBfYyA9PT0gdm9pZCAwID8gdW5kZWZpbmVkIDogX2M7XHJcbiAgICAgICAgaWYgKGRpc3BhdGNoZXIgJiYgIXByZXZpb3VzICYmICFuZXh0KSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoZXJbdHlwZV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMpIHtcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzLm5leHQgPSBuZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IG5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFkdmlzZWQpIHtcclxuICAgICAgICAgICAgZGVsZXRlIGFkdmlzZWQuYWR2aWNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaGVyID0gYWR2aXNlZCA9IHVuZGVmaW5lZDtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBBZHZpc2UgYSBqb2luIHBvaW50IChmdW5jdGlvbikgd2l0aCBzdXBwbGllZCBhZHZpY2VcclxuICpcclxuICogQHBhcmFtIGpvaW5Qb2ludCBUaGUgZnVuY3Rpb24gdG8gYmUgYWR2aXNlZFxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBhZHZpY2UgdG8gYmUgYXBwbGllZFxyXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhZHZpY2UgdG8gYXBwbHlcclxuICovXHJcbmZ1bmN0aW9uIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsIHR5cGUsIGFkdmljZSkge1xyXG4gICAgdmFyIGRpc3BhdGNoZXI7XHJcbiAgICBpZiAodHlwZSA9PT0gJ2Fyb3VuZCcpIHtcclxuICAgICAgICBkaXNwYXRjaGVyID0gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcihhZHZpY2UuYXBwbHkodGhpcywgW2pvaW5Qb2ludF0pKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRpc3BhdGNoZXIgPSBnZXRKb2luUG9pbnREaXNwYXRjaGVyKGpvaW5Qb2ludCk7XHJcbiAgICAgICAgLy8gY2Fubm90IGhhdmUgdW5kZWZpbmVkIGluIG1hcCBkdWUgdG8gY29kZSBsb2dpYywgdXNpbmcgIVxyXG4gICAgICAgIHZhciBhZHZpY2VNYXAgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoZGlzcGF0Y2hlcik7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdiZWZvcmUnKSB7XHJcbiAgICAgICAgICAgIChhZHZpY2VNYXAuYmVmb3JlIHx8IChhZHZpY2VNYXAuYmVmb3JlID0gW10pKS51bnNoaWZ0KGFkdmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAoYWR2aWNlTWFwLmFmdGVyIHx8IChhZHZpY2VNYXAuYWZ0ZXIgPSBbXSkpLnB1c2goYWR2aWNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzcGF0Y2hlcjtcclxufVxyXG4vKipcclxuICogQW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyBvciBjcmVhdGVzIHRoZSBkaXNwYXRjaGVyIGZvciBhIGdpdmVuIGpvaW4gcG9pbnRcclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvciBtYXBcclxuICogQHBhcmFtIG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0aGF0IHRoZSBkaXNwYXRjaGVyIHNob3VsZCBiZSByZXNvbHZlZCBmb3JcclxuICogQHJldHVybiBUaGUgZGlzcGF0Y2hlclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpIHtcclxuICAgIHZhciBleGlzdGluZyA9IGlzTWFwTGlrZSh0YXJnZXQpID8gdGFyZ2V0LmdldChtZXRob2ROYW1lKSA6IHRhcmdldCAmJiB0YXJnZXRbbWV0aG9kTmFtZV07XHJcbiAgICB2YXIgZGlzcGF0Y2hlcjtcclxuICAgIGlmICghZXhpc3RpbmcgfHwgZXhpc3RpbmcudGFyZ2V0ICE9PSB0YXJnZXQpIHtcclxuICAgICAgICAvKiBUaGVyZSBpcyBubyBleGlzdGluZyBkaXNwYXRjaGVyLCB0aGVyZWZvcmUgd2Ugd2lsbCBjcmVhdGUgb25lICovXHJcbiAgICAgICAgZGlzcGF0Y2hlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGV4ZWN1dGlvbklkID0gbmV4dElkO1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHM7XHJcbiAgICAgICAgICAgIHZhciBiZWZvcmUgPSBkaXNwYXRjaGVyLmJlZm9yZTtcclxuICAgICAgICAgICAgd2hpbGUgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZS5hZHZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYmVmb3JlLmFkdmljZS5hcHBseSh0aGlzLCBhcmdzKSB8fCBhcmdzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYmVmb3JlID0gYmVmb3JlLm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpc3BhdGNoZXIuYXJvdW5kICYmIGRpc3BhdGNoZXIuYXJvdW5kLmFkdmljZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IGRpc3BhdGNoZXIuYXJvdW5kLmFkdmljZSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYWZ0ZXIgPSBkaXNwYXRjaGVyLmFmdGVyO1xyXG4gICAgICAgICAgICB3aGlsZSAoYWZ0ZXIgJiYgYWZ0ZXIuaWQgIT09IHVuZGVmaW5lZCAmJiBhZnRlci5pZCA8IGV4ZWN1dGlvbklkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWZ0ZXIuYWR2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFmdGVyLnJlY2VpdmVBcmd1bWVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1Jlc3VsdHMgPSBhZnRlci5hZHZpY2UuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBuZXdSZXN1bHRzID09PSB1bmRlZmluZWQgPyByZXN1bHRzIDogbmV3UmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBhZnRlci5hZHZpY2UuY2FsbCh0aGlzLCByZXN1bHRzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhZnRlciA9IGFmdGVyLm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoaXNNYXBMaWtlKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LnNldChtZXRob2ROYW1lLCBkaXNwYXRjaGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRhcmdldCAmJiAodGFyZ2V0W21ldGhvZE5hbWVdID0gZGlzcGF0Y2hlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChleGlzdGluZykge1xyXG4gICAgICAgICAgICBkaXNwYXRjaGVyLmFyb3VuZCA9IHtcclxuICAgICAgICAgICAgICAgIGFkdmljZTogZnVuY3Rpb24gKHRhcmdldCwgYXJncykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZy5hcHBseSh0YXJnZXQsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaGVyLnRhcmdldCA9IHRhcmdldDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRpc3BhdGNoZXIgPSBleGlzdGluZztcclxuICAgIH1cclxuICAgIHJldHVybiBkaXNwYXRjaGVyO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBkaXNwYXRjaGVyIGZ1bmN0aW9uIGZvciBhIGdpdmVuIGpvaW5Qb2ludCAobWV0aG9kL2Z1bmN0aW9uKVxyXG4gKlxyXG4gKiBAcGFyYW0gam9pblBvaW50IFRoZSBmdW5jdGlvbiB0aGF0IGlzIHRvIGJlIGFkdmlzZWRcclxuICovXHJcbmZ1bmN0aW9uIGdldEpvaW5Qb2ludERpc3BhdGNoZXIoam9pblBvaW50KSB7XHJcbiAgICBmdW5jdGlvbiBkaXNwYXRjaGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcclxuICAgICAgICB2YXIgX2EgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoZGlzcGF0Y2hlciksIGJlZm9yZSA9IF9hLmJlZm9yZSwgYWZ0ZXIgPSBfYS5hZnRlciwgam9pblBvaW50ID0gX2Euam9pblBvaW50O1xyXG4gICAgICAgIGlmIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgYXJncyA9IGJlZm9yZS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZpb3VzQXJncywgYWR2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEFyZ3MgPSBhZHZpY2UuYXBwbHkoX3RoaXMsIHByZXZpb3VzQXJncyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEFyZ3MgfHwgcHJldmlvdXNBcmdzO1xyXG4gICAgICAgICAgICB9LCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGpvaW5Qb2ludC5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICBpZiAoYWZ0ZXIpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYWZ0ZXIucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91c1Jlc3VsdCwgYWR2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWR2aWNlLmFwcGx5KF90aGlzLCBbcHJldmlvdXNSZXN1bHRdLmNvbmNhdChhcmdzKSk7XHJcbiAgICAgICAgICAgIH0sIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvKiBXZSB3YW50IHRvIFwiY2xvbmVcIiB0aGUgYWR2aWNlIHRoYXQgaGFzIGJlZW4gYXBwbGllZCBhbHJlYWR5LCBpZiB0aGlzXHJcbiAgICAgKiBqb2luUG9pbnQgaXMgYWxyZWFkeSBhZHZpc2VkICovXHJcbiAgICBpZiAoZGlzcGF0Y2hBZHZpY2VNYXAuaGFzKGpvaW5Qb2ludCkpIHtcclxuICAgICAgICAvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXHJcbiAgICAgICAgdmFyIGFkdmljZU1hcCA9IGRpc3BhdGNoQWR2aWNlTWFwLmdldChqb2luUG9pbnQpO1xyXG4gICAgICAgIHZhciBiZWZvcmVfMSA9IGFkdmljZU1hcC5iZWZvcmUsIGFmdGVyXzEgPSBhZHZpY2VNYXAuYWZ0ZXI7XHJcbiAgICAgICAgaWYgKGJlZm9yZV8xKSB7XHJcbiAgICAgICAgICAgIGJlZm9yZV8xID0gYmVmb3JlXzEuc2xpY2UoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhZnRlcl8xKSB7XHJcbiAgICAgICAgICAgIGFmdGVyXzEgPSBhZnRlcl8xLnNsaWNlKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaEFkdmljZU1hcC5zZXQoZGlzcGF0Y2hlciwge1xyXG4gICAgICAgICAgICBqb2luUG9pbnQ6IGFkdmljZU1hcC5qb2luUG9pbnQsXHJcbiAgICAgICAgICAgIGJlZm9yZTogYmVmb3JlXzEsXHJcbiAgICAgICAgICAgIGFmdGVyOiBhZnRlcl8xXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaEFkdmljZU1hcC5zZXQoZGlzcGF0Y2hlciwgeyBqb2luUG9pbnQ6IGpvaW5Qb2ludCB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaXNwYXRjaGVyO1xyXG59XHJcbi8qKlxyXG4gKiBBcHBseSBhZHZpY2UgKmFmdGVyKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcclxuICpcclxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cclxuICogQHBhcmFtIGFkdmljZSBUaGUgYWZ0ZXIgYWR2aWNlXHJcbiAqL1xyXG5mdW5jdGlvbiBhZnRlckpvaW5Qb2ludChqb2luUG9pbnQsIGFkdmljZSkge1xyXG4gICAgcmV0dXJuIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsICdhZnRlcicsIGFkdmljZSk7XHJcbn1cclxuLyoqXHJcbiAqIEF0dGFjaGVzIFwiYWZ0ZXJcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cclxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0LlxyXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAoZXZlbiBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZCkuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXHJcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxyXG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0XHJcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBhZnRlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUsIGFkdmljZSkge1xyXG4gICAgcmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdhZnRlcicsIGFkdmljZSk7XHJcbn1cclxuZnVuY3Rpb24gYWZ0ZXIoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlKSB7XHJcbiAgICBpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIGFmdGVySm9pblBvaW50KGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGFmdGVyT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hZnRlciA9IGFmdGVyO1xyXG4vKipcclxuICogQXBwbHkgYWR2aWNlICphcm91bmQqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxyXG4gKlxyXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xyXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhcm91bmQgYWR2aWNlXHJcbiAqL1xyXG5mdW5jdGlvbiBhcm91bmRKb2luUG9pbnQoam9pblBvaW50LCBhZHZpY2UpIHtcclxuICAgIHJldHVybiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCAnYXJvdW5kJywgYWR2aWNlKTtcclxufVxyXG5leHBvcnRzLmFyb3VuZEpvaW5Qb2ludCA9IGFyb3VuZEpvaW5Qb2ludDtcclxuLyoqXHJcbiAqIEF0dGFjaGVzIFwiYXJvdW5kXCIgYWR2aWNlIGFyb3VuZCB0aGUgb3JpZ2luYWwgbWV0aG9kLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxyXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcclxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBhcm91bmRPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lLCBhZHZpY2UpIHtcclxuICAgIHZhciBkaXNwYXRjaGVyID0gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpO1xyXG4gICAgdmFyIHByZXZpb3VzID0gZGlzcGF0Y2hlci5hcm91bmQ7XHJcbiAgICB2YXIgYWR2aXNlZDtcclxuICAgIGlmIChhZHZpY2UpIHtcclxuICAgICAgICBhZHZpc2VkID0gYWR2aWNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzICYmIHByZXZpb3VzLmFkdmljZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzLmFkdmljZSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkaXNwYXRjaGVyLmFyb3VuZCA9IHtcclxuICAgICAgICBhZHZpY2U6IGZ1bmN0aW9uICh0YXJnZXQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFkdmlzZWQgPyBhZHZpc2VkLmFwcGx5KHRhcmdldCwgYXJncykgOiBwcmV2aW91cyAmJiBwcmV2aW91cy5hZHZpY2UgJiYgcHJldmlvdXMuYWR2aWNlKHRhcmdldCwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBsYW5nXzEuY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhZHZpc2VkID0gZGlzcGF0Y2hlciA9IHVuZGVmaW5lZDtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuYXJvdW5kT2JqZWN0ID0gYXJvdW5kT2JqZWN0O1xyXG5mdW5jdGlvbiBhcm91bmQoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlKSB7XHJcbiAgICBpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyb3VuZEpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgbWV0aG9kTmFtZU9yQWR2aWNlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhcm91bmRPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmFyb3VuZCA9IGFyb3VuZDtcclxuLyoqXHJcbiAqIEFwcGx5IGFkdmljZSAqYmVmb3JlKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcclxuICpcclxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cclxuICogQHBhcmFtIGFkdmljZSBUaGUgYmVmb3JlIGFkdmljZVxyXG4gKi9cclxuZnVuY3Rpb24gYmVmb3JlSm9pblBvaW50KGpvaW5Qb2ludCwgYWR2aWNlKSB7XHJcbiAgICByZXR1cm4gYWR2aXNlSm9pblBvaW50KGpvaW5Qb2ludCwgJ2JlZm9yZScsIGFkdmljZSk7XHJcbn1cclxuZXhwb3J0cy5iZWZvcmVKb2luUG9pbnQgPSBiZWZvcmVKb2luUG9pbnQ7XHJcbi8qKlxyXG4gKiBBdHRhY2hlcyBcImJlZm9yZVwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcclxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XHJcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwsIGFuZCBtYXkgcmV0dXJuIG5ldyBhcmd1bWVudHNcclxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcclxuICovXHJcbmZ1bmN0aW9uIGJlZm9yZU9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUsIGFkdmljZSkge1xyXG4gICAgcmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdiZWZvcmUnLCBhZHZpY2UpO1xyXG59XHJcbmV4cG9ydHMuYmVmb3JlT2JqZWN0ID0gYmVmb3JlT2JqZWN0O1xyXG5mdW5jdGlvbiBiZWZvcmUoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlKSB7XHJcbiAgICBpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIGJlZm9yZUpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgbWV0aG9kTmFtZU9yQWR2aWNlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBiZWZvcmVPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmJlZm9yZSA9IGJlZm9yZTtcclxuLyoqXHJcbiAqIEF0dGFjaGVzIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxyXG4gKiBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kLlxyXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAqdW5sZXNzKiBpdHMgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcclxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XHJcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kXHJcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBvbih0YXJnZXQsIG1ldGhvZE5hbWUsIGFkdmljZSkge1xyXG4gICAgcmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdhZnRlcicsIGFkdmljZSwgdHJ1ZSk7XHJcbn1cclxuZXhwb3J0cy5vbiA9IG9uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvYXNwZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2FzcGVjdC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIG9iamVjdF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vb2JqZWN0XCIpO1xyXG52YXIgb2JqZWN0XzIgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9vYmplY3RcIik7XHJcbmV4cG9ydHMuYXNzaWduID0gb2JqZWN0XzIuYXNzaWduO1xyXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XHJcbi8qKlxyXG4gKiBUeXBlIGd1YXJkIHRoYXQgZW5zdXJlcyB0aGF0IHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCB0byBPYmplY3RcclxuICogdG8gd2VlZCBvdXQgaG9zdCBvYmplY3RzIHRoYXQgZG8gbm90IGRlcml2ZSBmcm9tIE9iamVjdC5cclxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXHJcbiAqIE5vdGU6IEluIEVTNiBpdCBpcyBwb3NzaWJsZSB0byBtb2RpZnkgYW4gb2JqZWN0J3MgU3ltYm9sLnRvU3RyaW5nVGFnIHByb3BlcnR5LCB3aGljaCB3aWxsXHJcbiAqIGNoYW5nZSB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYHRvU3RyaW5nYC4gVGhpcyBpcyBhIHJhcmUgZWRnZSBjYXNlIHRoYXQgaXMgZGlmZmljdWx0IHRvIGhhbmRsZSxcclxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cclxuICogQHBhcmFtICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcclxuICogQHJldHVybiAgICAgICBJZiB0aGUgdmFsdWUgaXMgY29lcmNpYmxlIGludG8gYW4gT2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcbmZ1bmN0aW9uIGNvcHlBcnJheShhcnJheSwgaW5oZXJpdGVkKSB7XHJcbiAgICByZXR1cm4gYXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvcHlBcnJheShpdGVtLCBpbmhlcml0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gIXNob3VsZERlZXBDb3B5T2JqZWN0KGl0ZW0pID9cclxuICAgICAgICAgICAgaXRlbSA6XHJcbiAgICAgICAgICAgIF9taXhpbih7XHJcbiAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VzOiBbaXRlbV0sXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHt9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gX21peGluKGt3QXJncykge1xyXG4gICAgdmFyIGRlZXAgPSBrd0FyZ3MuZGVlcDtcclxuICAgIHZhciBpbmhlcml0ZWQgPSBrd0FyZ3MuaW5oZXJpdGVkO1xyXG4gICAgdmFyIHRhcmdldCA9IGt3QXJncy50YXJnZXQ7XHJcbiAgICB2YXIgY29waWVkID0ga3dBcmdzLmNvcGllZCB8fCBbXTtcclxuICAgIHZhciBjb3BpZWRDbG9uZSA9IHRzbGliXzEuX19zcHJlYWQoY29waWVkKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga3dBcmdzLnNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgc291cmNlID0ga3dBcmdzLnNvdXJjZXNbaV07XHJcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChjb3BpZWRDbG9uZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkZWVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29weUFycmF5KHZhbHVlLCBpbmhlcml0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV0gfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZC5wdXNoKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gX21peGluKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQ6IGluaGVyaXRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZXM6IFt2YWx1ZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29waWVkOiBjb3BpZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSkge1xyXG4gICAgdmFyIG1peGlucyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBtaXhpbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICBpZiAoIW1peGlucy5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcclxuICAgIH1cclxuICAgIHZhciBhcmdzID0gbWl4aW5zLnNsaWNlKCk7XHJcbiAgICBhcmdzLnVuc2hpZnQoT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpKTtcclxuICAgIHJldHVybiBvYmplY3RfMS5hc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XHJcbn1cclxuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XHJcbmZ1bmN0aW9uIGRlZXBBc3NpZ24odGFyZ2V0KSB7XHJcbiAgICB2YXIgc291cmNlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9taXhpbih7XHJcbiAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHNvdXJjZXM6IHNvdXJjZXMsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVlcEFzc2lnbiA9IGRlZXBBc3NpZ247XHJcbmZ1bmN0aW9uIGRlZXBNaXhpbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcclxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZXBNaXhpbiA9IGRlZXBNaXhpbjtcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBzb3VyY2UncyBwcm90b3R5cGUgYXMgdGhlIHByb3RvdHlwZSBmb3IgdGhlIG5ldyBvYmplY3QsIGFuZCB0aGVuXHJcbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cclxuICpcclxuICogQHBhcmFtIHNvdXJjZSBUaGUgb2JqZWN0IHRvIGR1cGxpY2F0ZVxyXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBkdXBsaWNhdGUoc291cmNlKSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XHJcbiAgICByZXR1cm4gZGVlcE1peGluKHRhcmdldCwgc291cmNlKTtcclxufVxyXG5leHBvcnRzLmR1cGxpY2F0ZSA9IGR1cGxpY2F0ZTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIGEgRmlyc3QgdmFsdWUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWU7IGZhbHNlIG90aGVyd2lzZVxyXG4gKi9cclxuZnVuY3Rpb24gaXNJZGVudGljYWwoYSwgYikge1xyXG4gICAgcmV0dXJuIGEgPT09IGIgfHxcclxuICAgICAgICAvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXHJcbiAgICAgICAgKGEgIT09IGEgJiYgYiAhPT0gYik7XHJcbn1cclxuZXhwb3J0cy5pc0lkZW50aWNhbCA9IGlzSWRlbnRpY2FsO1xyXG4vKipcclxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYmluZHMgYSBtZXRob2QgdG8gdGhlIHNwZWNpZmllZCBvYmplY3QgYXQgcnVudGltZS4gVGhpcyBpcyBzaW1pbGFyIHRvXHJcbiAqIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24gaXQgdGFrZXMgdGhlIG5hbWUgb2YgYSBtZXRob2Qgb24gYW4gb2JqZWN0LlxyXG4gKiBBcyBhIHJlc3VsdCwgdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IGBsYXRlQmluZGAgd2lsbCBhbHdheXMgY2FsbCB0aGUgZnVuY3Rpb24gY3VycmVudGx5IGFzc2lnbmVkIHRvXHJcbiAqIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgb24gdGhlIG9iamVjdCBhcyBvZiB0aGUgbW9tZW50IHRoZSBmdW5jdGlvbiBpdCByZXR1cm5zIGlzIGNhbGxlZC5cclxuICpcclxuICogQHBhcmFtIGluc3RhbmNlIFRoZSBjb250ZXh0IG9iamVjdFxyXG4gKiBAcGFyYW0gbWV0aG9kIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgb24gdGhlIGNvbnRleHQgb2JqZWN0IHRvIGJpbmQgdG8gaXRzZWxmXHJcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgdmFsdWVzIHRvIHByZXBlbmQgdG8gdGhlIGBpbnN0YW5jZVttZXRob2RdYCBhcmd1bWVudHMgbGlzdFxyXG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gbGF0ZUJpbmQoaW5zdGFuY2UsIG1ldGhvZCkge1xyXG4gICAgdmFyIHN1cHBsaWVkQXJncyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzdXBwbGllZEFyZ3NbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwcGxpZWRBcmdzLmxlbmd0aCA/XHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPyBzdXBwbGllZEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBzdXBwbGllZEFyZ3M7XHJcbiAgICAgICAgICAgIC8vIFRTNzAxN1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgfSA6XHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBUUzcwMTdcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxufVxyXG5leHBvcnRzLmxhdGVCaW5kID0gbGF0ZUJpbmQ7XHJcbmZ1bmN0aW9uIG1peGluKHRhcmdldCkge1xyXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc291cmNlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBfbWl4aW4oe1xyXG4gICAgICAgIGRlZXA6IGZhbHNlLFxyXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcclxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLm1peGluID0gbWl4aW47XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIHByZXBlbmRlZCB0byBpdHMgYXJndW1lbnQgbGlzdC5cclxuICogTGlrZSBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgZG9lcyBub3QgYWx0ZXIgZXhlY3V0aW9uIGNvbnRleHQuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXRGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBib3VuZFxyXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRoZSBgdGFyZ2V0RnVuY3Rpb25gIGFyZ3VtZW50cyBsaXN0XHJcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJ0aWFsKHRhcmdldEZ1bmN0aW9uKSB7XHJcbiAgICB2YXIgc3VwcGxpZWRBcmdzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHN1cHBsaWVkQXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXRGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5wYXJ0aWFsID0gcGFydGlhbDtcclxuLyoqXHJcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBkZXN0cm95IG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgY2FsbHMgdGhlIHBhc3NlZC1pbiBkZXN0cnVjdG9yLlxyXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZSBmb3IgY3JlYXRpbmcgXCJyZW1vdmVcIiAvIFwiZGVzdHJveVwiIGhhbmRsZXJzIGZvclxyXG4gKiBldmVudCBsaXN0ZW5lcnMsIHRpbWVycywgZXRjLlxyXG4gKlxyXG4gKiBAcGFyYW0gZGVzdHJ1Y3RvciBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaGFuZGxlJ3MgYGRlc3Ryb3lgIG1ldGhvZCBpcyBpbnZva2VkXHJcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUhhbmRsZShkZXN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgICAgICAgICBkZXN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZUhhbmRsZSA9IGNyZWF0ZUhhbmRsZTtcclxuLyoqXHJcbiAqIFJldHVybnMgYSBzaW5nbGUgaGFuZGxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGVzdHJveSBtdWx0aXBsZSBoYW5kbGVzIHNpbXVsdGFuZW91c2x5LlxyXG4gKlxyXG4gKiBAcGFyYW0gaGFuZGxlcyBBbiBhcnJheSBvZiBoYW5kbGVzIHdpdGggYGRlc3Ryb3lgIG1ldGhvZHNcclxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlQ29tcG9zaXRlSGFuZGxlKCkge1xyXG4gICAgdmFyIGhhbmRsZXMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgaGFuZGxlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuY3JlYXRlQ29tcG9zaXRlSGFuZGxlID0gY3JlYXRlQ29tcG9zaXRlSGFuZGxlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9sYW5nLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XHJcbn1cclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgcmVzdWx0cyBvZiBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnRzLnRlc3RDYWNoZSA9IHt9O1xyXG4vKipcclxuICogQSBjYWNoZSBvZiB0aGUgdW4tcmVzb2x2ZWQgZmVhdHVyZSB0ZXN0c1xyXG4gKi9cclxuZXhwb3J0cy50ZXN0RnVuY3Rpb25zID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHVucmVzb2x2ZWQgdGhlbmFibGVzIChwcm9iYWJseSBwcm9taXNlcylcclxuICogQHR5cGUge3t9fVxyXG4gKi9cclxudmFyIHRlc3RUaGVuYWJsZXMgPSB7fTtcclxuLyoqXHJcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUgKGB3aW5kb3dgIGluIGEgYnJvd3NlciwgYGdsb2JhbGAgaW4gTm9kZUpTKVxyXG4gKi9cclxudmFyIGdsb2JhbFNjb3BlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBCcm93c2Vyc1xyXG4gICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIE5vZGVcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gV2ViIHdvcmtlcnNcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4ge307XHJcbn0pKCk7XHJcbi8qIEdyYWIgdGhlIHN0YXRpY0ZlYXR1cmVzIGlmIHRoZXJlIGFyZSBhdmFpbGFibGUgKi9cclxudmFyIHN0YXRpY0ZlYXR1cmVzID0gKGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudCB8fCB7fSkuc3RhdGljRmVhdHVyZXM7XHJcbi8qIENsZWFuaW5nIHVwIHRoZSBEb2pvSGFzRW52aW9ybm1lbnQgKi9cclxuaWYgKCdEb2pvSGFzRW52aXJvbm1lbnQnIGluIGdsb2JhbFNjb3BlKSB7XHJcbiAgICBkZWxldGUgZ2xvYmFsU2NvcGUuRG9qb0hhc0Vudmlyb25tZW50O1xyXG59XHJcbi8qKlxyXG4gKiBDdXN0b20gdHlwZSBndWFyZCB0byBuYXJyb3cgdGhlIGBzdGF0aWNGZWF0dXJlc2AgdG8gZWl0aGVyIGEgbWFwIG9yIGEgZnVuY3Rpb24gdGhhdFxyXG4gKiByZXR1cm5zIGEgbWFwLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGZvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuLyoqXHJcbiAqIFRoZSBjYWNoZSBvZiBhc3NlcnRlZCBmZWF0dXJlcyB0aGF0IHdlcmUgYXZhaWxhYmxlIGluIHRoZSBnbG9iYWwgc2NvcGUgd2hlbiB0aGVcclxuICogbW9kdWxlIGxvYWRlZFxyXG4gKi9cclxudmFyIHN0YXRpY0NhY2hlID0gc3RhdGljRmVhdHVyZXNcclxuICAgID8gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24oc3RhdGljRmVhdHVyZXMpID8gc3RhdGljRmVhdHVyZXMuYXBwbHkoZ2xvYmFsU2NvcGUpIDogc3RhdGljRmVhdHVyZXNcclxuICAgIDoge307LyogUHJvdmlkaW5nIGFuIGVtcHR5IGNhY2hlLCBpZiBub25lIHdhcyBpbiB0aGUgZW52aXJvbm1lbnRcclxuXHJcbi8qKlxyXG4qIEFNRCBwbHVnaW4gZnVuY3Rpb24uXHJcbipcclxuKiBDb25kaXRpb25hbCBsb2FkcyBtb2R1bGVzIGJhc2VkIG9uIGEgaGFzIGZlYXR1cmUgdGVzdCB2YWx1ZS5cclxuKlxyXG4qIEBwYXJhbSByZXNvdXJjZUlkIEdpdmVzIHRoZSByZXNvbHZlZCBtb2R1bGUgaWQgdG8gbG9hZC5cclxuKiBAcGFyYW0gcmVxdWlyZSBUaGUgbG9hZGVyIHJlcXVpcmUgZnVuY3Rpb24gd2l0aCByZXNwZWN0IHRvIHRoZSBtb2R1bGUgdGhhdCBjb250YWluZWQgdGhlIHBsdWdpbiByZXNvdXJjZSBpbiBpdHNcclxuKiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5IGxpc3QuXHJcbiogQHBhcmFtIGxvYWQgQ2FsbGJhY2sgdG8gbG9hZGVyIHRoYXQgY29uc3VtZXMgcmVzdWx0IG9mIHBsdWdpbiBkZW1hbmQuXHJcbiovXHJcbmZ1bmN0aW9uIGxvYWQocmVzb3VyY2VJZCwgcmVxdWlyZSwgbG9hZCwgY29uZmlnKSB7XHJcbiAgICByZXNvdXJjZUlkID8gcmVxdWlyZShbcmVzb3VyY2VJZF0sIGxvYWQpIDogbG9hZCgpO1xyXG59XHJcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XHJcbi8qKlxyXG4gKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBSZXNvbHZlcyByZXNvdXJjZUlkIGludG8gYSBtb2R1bGUgaWQgYmFzZWQgb24gcG9zc2libHktbmVzdGVkIHRlbmFyeSBleHByZXNzaW9uIHRoYXQgYnJhbmNoZXMgb24gaGFzIGZlYXR1cmUgdGVzdFxyXG4gKiB2YWx1ZShzKS5cclxuICpcclxuICogQHBhcmFtIHJlc291cmNlSWQgVGhlIGlkIG9mIHRoZSBtb2R1bGVcclxuICogQHBhcmFtIG5vcm1hbGl6ZSBSZXNvbHZlcyBhIHJlbGF0aXZlIG1vZHVsZSBpZCBpbnRvIGFuIGFic29sdXRlIG1vZHVsZSBpZFxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplKHJlc291cmNlSWQsIG5vcm1hbGl6ZSkge1xyXG4gICAgdmFyIHRva2VucyA9IHJlc291cmNlSWQubWF0Y2goL1tcXD86XXxbXjpcXD9dKi9nKSB8fCBbXTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZ1bmN0aW9uIGdldChza2lwKSB7XHJcbiAgICAgICAgdmFyIHRlcm0gPSB0b2tlbnNbaSsrXTtcclxuICAgICAgICBpZiAodGVybSA9PT0gJzonKSB7XHJcbiAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZyBtb2R1bGUgbmFtZSwgcmVzb2x2ZXMgdG8gbnVsbFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHBvc3RmaXhlZCB3aXRoIGEgPyBtZWFucyBpdCBpcyBhIGZlYXR1cmUgdG8gYnJhbmNoIG9uLCB0aGUgdGVybSBpcyB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gICAgICAgICAgICBpZiAodG9rZW5zW2krK10gPT09ICc/Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFza2lwICYmIGhhcyh0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoZWQgdGhlIGZlYXR1cmUsIGdldCB0aGUgZmlyc3QgdmFsdWUgZnJvbSB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpZCBub3QgbWF0Y2gsIGdldCB0aGUgc2Vjb25kIHZhbHVlLCBwYXNzaW5nIG92ZXIgdGhlIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoc2tpcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYSBtb2R1bGVcclxuICAgICAgICAgICAgcmV0dXJuIHRlcm07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGlkID0gZ2V0KCk7XHJcbiAgICByZXR1cm4gaWQgJiYgbm9ybWFsaXplKGlkKTtcclxufVxyXG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcclxuLyoqXHJcbiAqIENoZWNrIGlmIGEgZmVhdHVyZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICovXHJcbmZ1bmN0aW9uIGV4aXN0cyhmZWF0dXJlKSB7XHJcbiAgICB2YXIgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICByZXR1cm4gQm9vbGVhbihub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSB8fCBub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSB8fCBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKTtcclxufVxyXG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcclxuLyoqXHJcbiAqIFJlZ2lzdGVyIGEgbmV3IHRlc3QgZm9yIGEgbmFtZWQgZmVhdHVyZS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogaGFzLmFkZCgnZG9tLWFkZGV2ZW50bGlzdGVuZXInLCAhIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpO1xyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBoYXMuYWRkKCd0b3VjaC1ldmVudHMnLCBmdW5jdGlvbiAoKSB7XHJcbiAqICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudFxyXG4gKiB9KTtcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSByZXBvcnRlZCBvZiB0aGUgZmVhdHVyZSwgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgb25jZSBvbiBmaXJzdCB0ZXN0XHJcbiAqIEBwYXJhbSBvdmVyd3JpdGUgaWYgYW4gZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGJlIG92ZXJ3cml0dGVuLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICovXHJcbmZ1bmN0aW9uIGFkZChmZWF0dXJlLCB2YWx1ZSwgb3ZlcndyaXRlKSB7XHJcbiAgICBpZiAob3ZlcndyaXRlID09PSB2b2lkIDApIHsgb3ZlcndyaXRlID0gZmFsc2U7IH1cclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChleGlzdHMobm9ybWFsaXplZEZlYXR1cmUpICYmICFvdmVyd3JpdGUgJiYgIShub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmVhdHVyZSBcXFwiXCIgKyBmZWF0dXJlICsgXCJcXFwiIGV4aXN0cyBhbmQgb3ZlcndyaXRlIG5vdCB0cnVlLlwiKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0ZlYXR1cmVUZXN0VGhlbmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXSA9IHZhbHVlLnRoZW4oZnVuY3Rpb24gKHJlc29sdmVkVmFsdWUpIHtcclxuICAgICAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbZmVhdHVyZV0gPSByZXNvbHZlZFZhbHVlO1xyXG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hZGQgPSBhZGQ7XHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgbmFtZSAoaWYgYSBzdHJpbmcpIG9yIGlkZW50aWZpZXIgKGlmIGFuIGludGVnZXIpIG9mIHRoZSBmZWF0dXJlIHRvIHRlc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXMoZmVhdHVyZSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXRpY0NhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBleHBvcnRzLnRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV0gPSBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdLmNhbGwobnVsbCk7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGV4cG9ydHMudGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZlYXR1cmUgaW4gdGVzdFRoZW5hYmxlcykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBdHRlbXB0IHRvIGRldGVjdCB1bnJlZ2lzdGVyZWQgaGFzIGZlYXR1cmUgXFxcIlwiICsgZmVhdHVyZSArIFwiXFxcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzO1xyXG4vKlxyXG4gKiBPdXQgb2YgdGhlIGJveCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG4vKiBFbnZpcm9ubWVudHMgKi9cclxuLyogVXNlZCBhcyBhIHZhbHVlIHRvIHByb3ZpZGUgYSBkZWJ1ZyBvbmx5IGNvZGUgcGF0aCAqL1xyXG5hZGQoJ2RlYnVnJywgdHJ1ZSk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGlzIFwiYnJvd3NlciBsaWtlXCIgKi9cclxuYWRkKCdob3N0LWJyb3dzZXInLCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpO1xyXG4vKiBEZXRlY3RzIGlmIHRoZSBlbnZpcm9ubWVudCBhcHBlYXJzIHRvIGJlIE5vZGVKUyAqL1xyXG5hZGQoJ2hvc3Qtbm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCIuL29iamVjdFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuZXhwb3J0cy5NYXAgPSBnbG9iYWxfMS5kZWZhdWx0Lk1hcDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtbWFwJykpIHtcclxuICAgIGV4cG9ydHMuTWFwID0gKF9hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBNYXAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ01hcCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8xLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXHJcbiAgICAgICAgICAgICAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5faW5kZXhPZktleSA9IGZ1bmN0aW9uIChrZXlzLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMSA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoXzE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfMS5pcyhrZXlzW2ldLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoID0gdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5fa2V5cy5tYXAoZnVuY3Rpb24gKGtleSwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCBfdGhpcy5fdmFsdWVzW2ldXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih2YWx1ZXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLl92YWx1ZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoXzIgPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aF8yOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlc1tpXSwga2V5c1tpXSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IHRoaXMuX3ZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KSA+IC0xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX2tleXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4IDwgMCA/IHRoaXMuX2tleXMubGVuZ3RoIDogaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2luZGV4XSA9IGtleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fdmFsdWVzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTWFwO1xyXG4gICAgICAgIH0oKSksXHJcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gX2EsXHJcbiAgICAgICAgX2EpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuTWFwO1xyXG52YXIgX2E7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vTWFwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9xdWV1ZVwiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxuZXhwb3J0cy5TaGltUHJvbWlzZSA9IGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZTtcclxuZXhwb3J0cy5pc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xyXG59O1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykpIHtcclxuICAgIGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZSA9IGV4cG9ydHMuU2hpbVByb21pc2UgPSAoX2EgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IFByb21pc2UuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gZXhlY3V0b3JcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBpbW1lZGlhdGVseSB3aGVuIHRoZSBQcm9taXNlIGlzIGluc3RhbnRpYXRlZC4gSXQgaXMgcmVzcG9uc2libGUgZm9yXHJcbiAgICAgICAgICAgICAqIHN0YXJ0aW5nIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoZW4gaXQgaXMgaW52b2tlZC5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIG11c3QgY2FsbCBlaXRoZXIgdGhlIHBhc3NlZCBgcmVzb2x2ZWAgZnVuY3Rpb24gd2hlbiB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkXHJcbiAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxseSwgb3IgdGhlIGByZWplY3RgIGZ1bmN0aW9uIHdoZW4gdGhlIG9wZXJhdGlvbiBmYWlscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IDEgLyogUGVuZGluZyAqLztcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdQcm9taXNlJztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgdHJ1ZSwgdGhlIHJlc29sdXRpb24gb2YgdGhpcyBwcm9taXNlIGlzIGNoYWluZWQgKFwibG9ja2VkIGluXCIpIHRvIGFub3RoZXIgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzQ2hhaW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzUmVzb2x2ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlICE9PSAxIC8qIFBlbmRpbmcgKi8gfHwgaXNDaGFpbmVkO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2FsbGJhY2tzIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgb25jZSB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEluaXRpYWxseSBwdXNoZXMgY2FsbGJhY2tzIG9udG8gYSBxdWV1ZSBmb3IgZXhlY3V0aW9uIG9uY2UgdGhpcyBwcm9taXNlIHNldHRsZXMuIEFmdGVyIHRoZSBwcm9taXNlIHNldHRsZXMsXHJcbiAgICAgICAgICAgICAgICAgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciB3aGVuRmluaXNoZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXR0bGVzIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHNldHRsZSA9IGZ1bmN0aW9uIChuZXdTdGF0ZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBIHByb21pc2UgY2FuIG9ubHkgYmUgc2V0dGxlZCBvbmNlLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNvbHZlZFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkID0gcXVldWVfMS5xdWV1ZU1pY3JvVGFzaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgYW4gZXh0cmEgdHVybi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlXzEucXVldWVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IGNhbGxiYWNrcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrc1tpXS5jYWxsKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZXNvbHZlcyB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gKG5ld1N0YXRlLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc29sdmVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwb3J0cy5pc1RoZW5hYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKHNldHRsZS5iaW5kKG51bGwsIDAgLyogRnVsZmlsbGVkICovKSwgc2V0dGxlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NoYWluZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGxlKG5ld1N0YXRlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZW5GaW5pc2hlZCBpbml0aWFsbHkgcXVldWVzIHVwIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIGFmdGVyIHRoZSBwcm9taXNlIGhhcyBzZXR0bGVkLiBPbmNlIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9taXNlIGhhcyBzZXR0bGVkLCB3aGVuRmluaXNoZWQgd2lsbCBzY2hlZHVsZSBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCB0dXJuIHRocm91Z2ggdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50IGxvb3AuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW5GaW5pc2hlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfdGhpcy5zdGF0ZSA9PT0gMiAvKiBSZWplY3RlZCAqLyA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKF90aGlzLnJlc29sdmVkVmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoX3RoaXMucmVzb2x2ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKF90aGlzLnJlc29sdmVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKHJlc29sdmUuYmluZChudWxsLCAwIC8qIEZ1bGZpbGxlZCAqLyksIHJlc29sdmUuYmluZChudWxsLCAyIC8qIFJlamVjdGVkICovKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0bGUoMiAvKiBSZWplY3RlZCAqLywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGxldGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcHVsYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKytjb21wbGV0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcHVsYXRpbmcgfHwgY29tcGxldGUgPCB0b3RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNUaGVuYWJsZShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0l0ZW0oaSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8xLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwb3B1bGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzIgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMl8xID0gaXRlcmFibGVfMi5uZXh0KCk7ICFpdGVyYWJsZV8yXzEuZG9uZTsgaXRlcmFibGVfMl8xID0gaXRlcmFibGVfMi5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlcmFibGVfMl8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBQcm9taXNlIGl0ZW0gcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4ocmVzb2x2ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8yXzEgJiYgIWl0ZXJhYmxlXzJfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzIucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlXzIsIF9hO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2U7XHJcbiAgICAgICAgfSgpKSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBleHBvcnRzLlNoaW1Qcm9taXNlLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLlNoaW1Qcm9taXNlO1xyXG52YXIgX2E7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvdXRpbFwiKTtcclxuZXhwb3J0cy5TeW1ib2wgPSBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJykpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cclxuICAgICAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAgICAgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3NcclxuICAgICAqL1xyXG4gICAgdmFyIHZhbGlkYXRlU3ltYm9sXzEgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnRpZXNfMSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnR5XzEgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICB2YXIgY3JlYXRlXzEgPSBPYmplY3QuY3JlYXRlO1xyXG4gICAgdmFyIG9ialByb3RvdHlwZV8xID0gT2JqZWN0LnByb3RvdHlwZTtcclxuICAgIHZhciBnbG9iYWxTeW1ib2xzXzEgPSB7fTtcclxuICAgIHZhciBnZXRTeW1ib2xOYW1lXzEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjcmVhdGVkID0gY3JlYXRlXzEobnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXNjKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3N0Zml4ID0gMDtcclxuICAgICAgICAgICAgdmFyIG5hbWU7XHJcbiAgICAgICAgICAgIHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcclxuICAgICAgICAgICAgICAgICsrcG9zdGZpeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcclxuICAgICAgICAgICAgY3JlYXRlZFtkZXNjXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG5hbWUgPSAnQEAnICsgZGVzYztcclxuICAgICAgICAgICAgLy8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXHJcbiAgICAgICAgICAgIC8vIHBpbm5lZCBkb3duLlxyXG4gICAgICAgICAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlXzEsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eV8xKG9ialByb3RvdHlwZV8xLCBuYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHlfMSh0aGlzLCBuYW1lLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICB2YXIgSW50ZXJuYWxTeW1ib2xfMSA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgSW50ZXJuYWxTeW1ib2xfMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLlN5bWJvbCA9IGdsb2JhbF8xLmRlZmF1bHQuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUpO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydGllc18xKHN5bSwge1xyXG4gICAgICAgICAgICBfX2Rlc2NyaXB0aW9uX186IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICBfX25hbWVfXzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lXzEoZGVzY3JpcHRpb24pKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wgZnVuY3Rpb24gd2l0aCB0aGUgYXBwcm9wcmlhdGUgcHJvcGVydGllcyAqL1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbCwgJ2ZvcicsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsU3ltYm9sc18xW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoZ2xvYmFsU3ltYm9sc18xW2tleV0gPSBleHBvcnRzLlN5bWJvbChTdHJpbmcoa2V5KSkpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydGllc18xKGV4cG9ydHMuU3ltYm9sLCB7XHJcbiAgICAgICAga2V5Rm9yOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uIChzeW0pIHtcclxuICAgICAgICAgICAgdmFyIGtleTtcclxuICAgICAgICAgICAgdmFsaWRhdGVTeW1ib2xfMShzeW0pO1xyXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzXzEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSA9PT0gc3ltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGhhc0luc3RhbmNlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpc0NvbmNhdFNwcmVhZGFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpdGVyYXRvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgbWF0Y2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIG9ic2VydmFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgcmVwbGFjZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzZWFyY2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzcGVjaWVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNwbGl0OiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB0b1ByaW1pdGl2ZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdG9TdHJpbmdUYWc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHVuc2NvcGFibGVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgfSk7XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbCksXHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX25hbWVfXztcclxuICAgICAgICB9LCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlLCB7XHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sXzEodGhpcykuX19kZXNjcmlwdGlvbl9fICsgJyknO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHZhbHVlT2Y6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2xfMSh0aGlzKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9QcmltaXRpdmUsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVN5bWJvbF8xKHRoaXMpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbC5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvUHJpbWl0aXZlLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZVtleHBvcnRzLlN5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9TdHJpbmdUYWcsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlW2V4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbn1cclxuLyoqXHJcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XHJcbiAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcclxuICovXHJcbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XHJcbn1cclxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xyXG4vKipcclxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGVtXHJcbiAqL1xyXG5bXHJcbiAgICAnaGFzSW5zdGFuY2UnLFxyXG4gICAgJ2lzQ29uY2F0U3ByZWFkYWJsZScsXHJcbiAgICAnaXRlcmF0b3InLFxyXG4gICAgJ3NwZWNpZXMnLFxyXG4gICAgJ3JlcGxhY2UnLFxyXG4gICAgJ3NlYXJjaCcsXHJcbiAgICAnc3BsaXQnLFxyXG4gICAgJ21hdGNoJyxcclxuICAgICd0b1ByaW1pdGl2ZScsXHJcbiAgICAndG9TdHJpbmdUYWcnLFxyXG4gICAgJ3Vuc2NvcGFibGVzJyxcclxuICAgICdvYnNlcnZhYmxlJ1xyXG5dLmZvckVhY2goZnVuY3Rpb24gKHdlbGxLbm93bikge1xyXG4gICAgaWYgKCFleHBvcnRzLlN5bWJvbFt3ZWxsS25vd25dKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMuU3ltYm9sLCB3ZWxsS25vd24sIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TeW1ib2w7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbmV4cG9ydHMuV2Vha01hcCA9IGdsb2JhbF8xLmRlZmF1bHQuV2Vha01hcDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtd2Vha21hcCcpKSB7XHJcbiAgICB2YXIgREVMRVRFRF8xID0ge307XHJcbiAgICB2YXIgZ2V0VUlEXzEgPSBmdW5jdGlvbiBnZXRVSUQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XHJcbiAgICB9O1xyXG4gICAgdmFyIGdlbmVyYXRlTmFtZV8xID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3RhcnRJZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAlIDEwMDAwMDAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdfX3dtJyArIGdldFVJRF8xKCkgKyAoc3RhcnRJZCsrICsgJ19fJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICBleHBvcnRzLldlYWtNYXAgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gV2Vha01hcChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnV2Vha01hcCc7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX25hbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZ2VuZXJhdGVOYW1lXzEoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoaXRlbVswXSwgaXRlbVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gdHNsaWJfMS5fX3JlYWQoaXRlcmFibGVfMV8xLnZhbHVlLCAyKSwga2V5ID0gX2FbMF0sIHZhbHVlID0gX2FbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9iID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYi5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVfMSwgX2I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLl9nZXRGcm96ZW5FbnRyeUluZGV4ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2Zyb3plbkVudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURURfMSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkudmFsdWUgPSBERUxFVEVEXzE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzLnNwbGljZShmcm96ZW5JbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURURfMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm96ZW5FbnRyaWVzW2Zyb3plbkluZGV4XS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoQm9vbGVhbihlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIHVzZWQgYXMgd2VhayBtYXAga2V5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeSA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogeyB2YWx1ZToga2V5IH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbihrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gV2Vha01hcDtcclxuICAgIH0oKSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5XZWFrTWFwO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBudW1iZXJfMSA9IHJlcXVpcmUoXCIuL251bWJlclwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3V0aWxcIik7XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczYtYXJyYXknKSAmJiBoYXNfMS5kZWZhdWx0KCdlczYtYXJyYXktZmlsbCcpKSB7XHJcbiAgICBleHBvcnRzLmZyb20gPSBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LmZyb207XHJcbiAgICBleHBvcnRzLm9mID0gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5vZjtcclxuICAgIGV4cG9ydHMuY29weVdpdGhpbiA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xyXG4gICAgZXhwb3J0cy5maWxsID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XHJcbiAgICBleHBvcnRzLmZpbmQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5maW5kKTtcclxuICAgIGV4cG9ydHMuZmluZEluZGV4ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXHJcbiAgICAvLyBUbyBtYWtlIHRoaW5ncyBlYXNpZXIsIGlmIHRoZXJlIGlzIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24sIHRoZSB3aG9sZSBzZXQgb2YgZnVuY3Rpb25zIHdpbGwgYmUgZmlsbGVkXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgdmFyIHRvTGVuZ3RoXzEgPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBudW1iZXJfMS5NQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgdG8gY29udmVydFxyXG4gICAgICogQHJldHVybiBBbiBpbnRlZ2VyXHJcbiAgICAgKi9cclxuICAgIHZhciB0b0ludGVnZXJfMSA9IGZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3RcclxuICAgICAqIEByZXR1cm4gSWYgbmVnYXRpdmUsIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIHRoZSBlbmQgKGxlbmd0aCk7IG90aGVyd2lzZSBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSAwXHJcbiAgICAgKi9cclxuICAgIHZhciBub3JtYWxpemVPZmZzZXRfMSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGgubWF4KGxlbmd0aCArIHZhbHVlLCAwKSA6IE1hdGgubWluKHZhbHVlLCBsZW5ndGgpO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZnJvbSA9IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLCBtYXBGdW5jdGlvbiwgdGhpc0FyZykge1xyXG4gICAgICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmcm9tOiByZXF1aXJlcyBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWFwRnVuY3Rpb24gJiYgdGhpc0FyZykge1xyXG4gICAgICAgICAgICBtYXBGdW5jdGlvbiA9IG1hcEZ1bmN0aW9uLmJpbmQodGhpc0FyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMShhcnJheUxpa2UubGVuZ3RoKTtcclxuICAgICAgICAvLyBTdXBwb3J0IGV4dGVuc2lvblxyXG4gICAgICAgIHZhciBhcnJheSA9IHR5cGVvZiBDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcclxuICAgICAgICBpZiAoIWl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXRlcmF0b3JfMS5pc0l0ZXJhYmxlKGFycmF5TGlrZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGFycmF5IGFuZCB0aGUgbm9ybWFsaXplZCBsZW5ndGggaXMgMCwganVzdCByZXR1cm4gYW4gZW1wdHkgYXJyYXkuIHRoaXMgcHJldmVudHMgYSBwcm9ibGVtXHJcbiAgICAgICAgLy8gd2l0aCB0aGUgaXRlcmF0aW9uIG9uIElFIHdoZW4gdXNpbmcgYSBOYU4gYXJyYXkgbGVuZ3RoLlxyXG4gICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGFycmF5TGlrZSkpIHtcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYXJyYXlMaWtlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGFycmF5TGlrZSksIGFycmF5TGlrZV8xXzEgPSBhcnJheUxpa2VfMS5uZXh0KCk7ICFhcnJheUxpa2VfMV8xLmRvbmU7IGFycmF5TGlrZV8xXzEgPSBhcnJheUxpa2VfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJheUxpa2VfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbih2YWx1ZSwgaSkgOiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheUxpa2VfMV8xICYmICFhcnJheUxpa2VfMV8xLmRvbmUgJiYgKF9hID0gYXJyYXlMaWtlXzEucmV0dXJuKSkgX2EuY2FsbChhcnJheUxpa2VfMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFycmF5TGlrZS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhcnJheS5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLm9mID0gZnVuY3Rpb24gb2YoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgaXRlbXNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmNvcHlXaXRoaW4gPSBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldCwgb2Zmc2V0LCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvcHlXaXRoaW46IHRhcmdldCBtdXN0IGJlIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIG9mZnNldCA9IG5vcm1hbGl6ZU9mZnNldF8xKHRvSW50ZWdlcl8xKG9mZnNldCksIGxlbmd0aCk7XHJcbiAgICAgICAgc3RhcnQgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0XzEoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXJfMShlbmQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHZhciBjb3VudCA9IE1hdGgubWluKGVuZCAtIHN0YXJ0LCBsZW5ndGggLSBvZmZzZXQpO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgIGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICBzdGFydCArPSBjb3VudCAtIDE7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBjb3VudCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0IGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0W29mZnNldF0gPSB0YXJnZXRbc3RhcnRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRhcmdldFtvZmZzZXRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgIHN0YXJ0ICs9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgY291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbGwgPSBmdW5jdGlvbiBmaWxsKHRhcmdldCwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICB2YXIgaSA9IG5vcm1hbGl6ZU9mZnNldF8xKHRvSW50ZWdlcl8xKHN0YXJ0KSwgbGVuZ3RoKTtcclxuICAgICAgICBlbmQgPSBub3JtYWxpemVPZmZzZXRfMShlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcl8xKGVuZCksIGxlbmd0aCk7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBlbmQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2krK10gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBleHBvcnRzLmZpbmRJbmRleCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKTtcclxuICAgICAgICByZXR1cm4gaW5kZXggIT09IC0xID8gdGFyZ2V0W2luZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZpbmRJbmRleCA9IGZ1bmN0aW9uIGZpbmRJbmRleCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9O1xyXG59XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczctYXJyYXknKSkge1xyXG4gICAgZXhwb3J0cy5pbmNsdWRlcyA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXHJcbiAgICAgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxyXG4gICAgICovXHJcbiAgICB2YXIgdG9MZW5ndGhfMiA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIG51bWJlcl8xLk1BWF9TQUZFX0lOVEVHRVIpO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0YXJnZXQsIHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xyXG4gICAgICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSAwOyB9XHJcbiAgICAgICAgdmFyIGxlbiA9IHRvTGVuZ3RoXzIodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGZyb21JbmRleDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXHJcbiAgICAgICAgLy8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHdpbmRvdyBpcyBkZWZpbmVkIGluIGJyb3dzZXJzXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbn0pKCk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdsb2JhbE9iamVjdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG52YXIgc3RyaW5nXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdcIik7XHJcbnZhciBzdGF0aWNEb25lID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XHJcbi8qKlxyXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxyXG4gKi9cclxudmFyIFNoaW1JdGVyYXRvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNoaW1JdGVyYXRvcihsaXN0KSB7XHJcbiAgICAgICAgdGhpcy5fbmV4dEluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYgKGlzSXRlcmFibGUobGlzdCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbmF0aXZlSXRlcmF0b3IgPSBsaXN0W1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBuZXh0IGl0ZXJhdGlvbiByZXN1bHQgZm9yIHRoZSBJdGVyYXRvclxyXG4gICAgICovXHJcbiAgICBTaGltSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fbGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcclxuICAgIH07XHJcbiAgICBTaGltSXRlcmF0b3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNoaW1JdGVyYXRvcjtcclxufSgpKTtcclxuZXhwb3J0cy5TaGltSXRlcmF0b3IgPSBTaGltSXRlcmF0b3I7XHJcbi8qKlxyXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBoYXMgYW4gSXRlcmFibGUgaW50ZXJmYWNlXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XHJcbn1cclxuZXhwb3J0cy5pc0l0ZXJhYmxlID0gaXNJdGVyYWJsZTtcclxuLyoqXHJcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGlzIEFycmF5TGlrZVxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcclxufVxyXG5leHBvcnRzLmlzQXJyYXlMaWtlID0gaXNBcnJheUxpa2U7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBmb3IgYW4gb2JqZWN0XHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgaXRlcmFibGUgb2JqZWN0IHRvIHJldHVybiB0aGUgaXRlcmF0b3IgZm9yXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXQoaXRlcmFibGUpIHtcclxuICAgIGlmIChpc0l0ZXJhYmxlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgIHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5nZXQgPSBnZXQ7XHJcbi8qKlxyXG4gKiBTaGltcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiBgZm9yIC4uLiBvZmAgYmxvY2tzXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgb2JqZWN0IHRoZSBwcm92aWRlcyBhbiBpbnRlcmF0b3IgaW50ZXJmYWNlXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSBvZiB0aGUgaXRlcmFibGVcclxuICogQHBhcmFtIHRoaXNBcmcgT3B0aW9uYWwgc2NvcGUgdG8gcGFzcyB0aGUgY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIGZvck9mKGl0ZXJhYmxlLCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgdmFyIGJyb2tlbiA9IGZhbHNlO1xyXG4gICAgZnVuY3Rpb24gZG9CcmVhaygpIHtcclxuICAgICAgICBicm9rZW4gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cclxuICAgIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHZhciBsID0gaXRlcmFibGUubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGFyID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICAgIGlmIChpICsgMSA8IGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPj0gc3RyaW5nXzEuSElHSF9TVVJST0dBVEVfTUlOICYmIGNvZGUgPD0gc3RyaW5nXzEuSElHSF9TVVJST0dBVEVfTUFYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhciArPSBpdGVyYWJsZVsrK2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY2hhciwgaXRlcmFibGUsIGRvQnJlYWspO1xyXG4gICAgICAgICAgICBpZiAoYnJva2VuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xyXG4gICAgICAgIGlmIChpdGVyYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJyb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLmZvck9mID0gZm9yT2Y7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbi8qKlxyXG4gKiBUaGUgc21hbGxlc3QgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcmVwcmVzZW50YWJsZSBudW1iZXJzLlxyXG4gKi9cclxuZXhwb3J0cy5FUFNJTE9OID0gMTtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XHJcbiAqL1xyXG5leHBvcnRzLk1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcclxuICovXHJcbmV4cG9ydHMuTUlOX1NBRkVfSU5URUdFUiA9IC1leHBvcnRzLk1BWF9TQUZFX0lOVEVHRVI7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBOYU4gd2l0aG91dCBjb2Vyc2lvbi5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgTmFOLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWxfMS5kZWZhdWx0LmlzTmFOKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzTmFOID0gaXNOYU47XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXIgd2l0aG91dCBjb2Vyc2lvbi5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgZmluaXRlLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWxfMS5kZWZhdWx0LmlzRmluaXRlKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzRmluaXRlID0gaXNGaW5pdGU7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XHJcbn1cclxuZXhwb3J0cy5pc0ludGVnZXIgPSBpc0ludGVnZXI7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxyXG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcclxuICogICAyLiBpdCBoYXMgYSBvbmUtdG8tb25lIG1hcHBpbmcgdG8gYSBtYXRoZW1hdGljYWwgaW50ZWdlciwgbWVhbmluZyBpdHNcclxuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiBNYXRoLmFicyh2YWx1ZSkgPD0gZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSO1xyXG59XHJcbmV4cG9ydHMuaXNTYWZlSW50ZWdlciA9IGlzU2FmZUludGVnZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1vYmplY3QnKSkge1xyXG4gICAgdmFyIGdsb2JhbE9iamVjdCA9IGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbiAgICBleHBvcnRzLmlzID0gZ2xvYmFsT2JqZWN0LmlzO1xyXG4gICAgZXhwb3J0cy5rZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuICAgICAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5rZXlzKG5leHRTb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKG5leHRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0bztcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKSB7XHJcbiAgICAgICAgaWYgKFN5bWJvbF8xLmlzU3ltYm9sKHByb3ApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIEJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBTeW1ib2wuZm9yKGtleS5zdWJzdHJpbmcoMikpOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmlzID0gZnVuY3Rpb24gaXModmFsdWUxLCB2YWx1ZTIpIHtcclxuICAgICAgICBpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXMyMDE3LW9iamVjdCcpKSB7XHJcbiAgICB2YXIgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3Q7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcclxuICAgIGV4cG9ydHMuZW50cmllcyA9IGdsb2JhbE9iamVjdC5lbnRyaWVzO1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBnbG9iYWxPYmplY3QudmFsdWVzO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZpb3VzLCBrZXkpIHtcclxuICAgICAgICAgICAgcHJldmlvdXNba2V5XSA9IGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIGtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmV2aW91cztcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5lbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMua2V5cyhvKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gW2tleSwgb1trZXldXTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobykge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLmtleXMobykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG9ba2V5XTsgfSk7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC91dGlsXCIpO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTiA9IDB4ZDgwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NQVggPSAweGRiZmY7XHJcbi8qKlxyXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkxPV19TVVJST0dBVEVfTUFYID0gMHhkZmZmO1xyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM2LXN0cmluZycpICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zdHJpbmctcmF3JykpIHtcclxuICAgIGV4cG9ydHMuZnJvbUNvZGVQb2ludCA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XHJcbiAgICBleHBvcnRzLnJhdyA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnJhdztcclxuICAgIGV4cG9ydHMuY29kZVBvaW50QXQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQpO1xyXG4gICAgZXhwb3J0cy5lbmRzV2l0aCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCk7XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcclxuICAgIGV4cG9ydHMubm9ybWFsaXplID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLm5vcm1hbGl6ZSk7XHJcbiAgICBleHBvcnRzLnJlcGVhdCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpO1xyXG4gICAgZXhwb3J0cy5zdGFydHNXaXRoID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBWYWxpZGF0ZXMgdGhhdCB0ZXh0IGlzIGRlZmluZWQsIGFuZCBub3JtYWxpemVzIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgZ2l2ZW4gZGVmYXVsdCBpZiB0aGUgaW5wdXQgaXMgTmFOKS5cclxuICAgICAqIFVzZWQgYnkgc3RhcnRzV2l0aCwgaW5jbHVkZXMsIGFuZCBlbmRzV2l0aC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIE5vcm1hbGl6ZWQgcG9zaXRpb24uXHJcbiAgICAgKi9cclxuICAgIHZhciBub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEgPSBmdW5jdGlvbiAobmFtZSwgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiwgaXNFbmQpIHtcclxuICAgICAgICBpZiAoaXNFbmQgPT09IHZvaWQgMCkgeyBpc0VuZCA9IGZhbHNlOyB9XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuJyArIG5hbWUgKyAnIHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nIHRvIHNlYXJjaCBhZ2FpbnN0LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xyXG4gICAgICAgIHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5mcm9tQ29kZVBvaW50ID0gZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcclxuICAgICAgICB2YXIgY29kZVBvaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGNvZGVQb2ludHNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5mcm9tQ29kZVBvaW50XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcclxuICAgICAgICB2YXIgTUFYX1NJWkUgPSAweDQwMDA7XHJcbiAgICAgICAgdmFyIGNvZGVVbml0cyA9IFtdO1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAvLyBDb2RlIHBvaW50cyBtdXN0IGJlIGZpbml0ZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHZhbGlkIHJhbmdlXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gaXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29kZVBvaW50IDw9IDB4ZmZmZikge1xyXG4gICAgICAgICAgICAgICAgLy8gQk1QIGNvZGUgcG9pbnRcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXHJcbiAgICAgICAgICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcclxuICAgICAgICAgICAgICAgIHZhciBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBleHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTjtcclxuICAgICAgICAgICAgICAgIHZhciBsb3dTdXJyb2dhdGUgPSBjb2RlUG9pbnQgJSAweDQwMCArIGV4cG9ydHMuTE9XX1NVUlJPR0FURV9NSU47XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5yYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGUpIHtcclxuICAgICAgICB2YXIgc3Vic3RpdHV0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYXdTdHJpbmdzID0gY2FsbFNpdGUucmF3O1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB2YXIgbnVtU3Vic3RpdHV0aW9ucyA9IHN1YnN0aXR1dGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIGlmIChjYWxsU2l0ZSA9PSBudWxsIHx8IGNhbGxTaXRlLnJhdyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yYXcgcmVxdWlyZXMgYSB2YWxpZCBjYWxsU2l0ZSBvYmplY3Qgd2l0aCBhIHJhdyB2YWx1ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoXzEgPSByYXdTdHJpbmdzLmxlbmd0aDsgaSA8IGxlbmd0aF8xOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHJhd1N0cmluZ3NbaV0gKyAoaSA8IG51bVN1YnN0aXR1dGlvbnMgJiYgaSA8IGxlbmd0aF8xIC0gMSA/IHN1YnN0aXR1dGlvbnNbaV0gOiAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5jb2RlUG9pbnRBdCA9IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHRleHQsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5jb2RlUG9pbnRBdCByZXF1cmllcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiAhPT0gcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxyXG4gICAgICAgIHZhciBmaXJzdCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbik7XHJcbiAgICAgICAgaWYgKGZpcnN0ID49IGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUFYICYmIGxlbmd0aCA+IHBvc2l0aW9uICsgMSkge1xyXG4gICAgICAgICAgICAvLyBTdGFydCBvZiBhIHN1cnJvZ2F0ZSBwYWlyIChoaWdoIHN1cnJvZ2F0ZSBhbmQgdGhlcmUgaXMgYSBuZXh0IGNvZGUgdW5pdCk7IGNoZWNrIGZvciBsb3cgc3Vycm9nYXRlXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxyXG4gICAgICAgICAgICB2YXIgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XHJcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiAmJiBzZWNvbmQgPD0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01BWCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChmaXJzdCAtIGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTiArIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKGVuZFBvc2l0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgZW5kUG9zaXRpb24gPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBlbmRQb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHZhciBzdGFydCA9IGVuZFBvc2l0aW9uIC0gc2VhcmNoLmxlbmd0aDtcclxuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGV4dCwgc2VhcmNoLCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gMDsgfVxyXG4gICAgICAgIF9hID0gdHNsaWJfMS5fX3JlYWQobm9ybWFsaXplU3Vic3RyaW5nQXJnc18xKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pLCAzKSwgdGV4dCA9IF9hWzBdLCBzZWFyY2ggPSBfYVsxXSwgcG9zaXRpb24gPSBfYVsyXTtcclxuICAgICAgICByZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodGV4dCwgY291bnQpIHtcclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IDA7IH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5yZXBlYXRcclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3VudCAhPT0gY291bnQpIHtcclxuICAgICAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY291bnQgPCAwIHx8IGNvdW50ID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAoY291bnQpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ICUgMikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvdW50ID4+PSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dCwgc2VhcmNoLCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gMDsgfVxyXG4gICAgICAgIHNlYXJjaCA9IFN0cmluZyhzZWFyY2gpO1xyXG4gICAgICAgIF9hID0gdHNsaWJfMS5fX3JlYWQobm9ybWFsaXplU3Vic3RyaW5nQXJnc18xKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBwb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHZhciBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICB9O1xyXG59XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczIwMTctc3RyaW5nJykpIHtcclxuICAgIGV4cG9ydHMucGFkRW5kID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnBhZEVuZCk7XHJcbiAgICBleHBvcnRzLnBhZFN0YXJ0ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnBhZFN0YXJ0KTtcclxufVxyXG5lbHNlIHtcclxuICAgIGV4cG9ydHMucGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZykge1xyXG4gICAgICAgIGlmIChmaWxsU3RyaW5nID09PSB2b2lkIDApIHsgZmlsbFN0cmluZyA9ICcgJzsgfVxyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZEVuZCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWRkaW5nID4gMCkge1xyXG4gICAgICAgICAgICBzdHJUZXh0ICs9XHJcbiAgICAgICAgICAgICAgICBleHBvcnRzLnJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJUZXh0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMucGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcpIHtcclxuICAgICAgICBpZiAoZmlsbFN0cmluZyA9PT0gdm9pZCAwKSB7IGZpbGxTdHJpbmcgPSAnICc7IH1cclxuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICB2YXIgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWRkaW5nID4gMCkge1xyXG4gICAgICAgICAgICBzdHJUZXh0ID1cclxuICAgICAgICAgICAgICAgIGV4cG9ydHMucmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyVGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3RyaW5nLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiQGRvam8vaGFzL2hhc1wiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4uL2dsb2JhbFwiKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzXzEuZGVmYXVsdDtcclxudHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZShcIkBkb2pvL2hhcy9oYXNcIiksIGV4cG9ydHMpO1xyXG4vKiBFQ01BU2NyaXB0IDYgYW5kIDcgRmVhdHVyZXMgKi9cclxuLyogQXJyYXkgKi9cclxuaGFzXzEuYWRkKCdlczYtYXJyYXknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFsnZnJvbScsICdvZiddLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGtleSBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5OyB9KSAmJlxyXG4gICAgICAgIFsnZmluZEluZGV4JywgJ2ZpbmQnLCAnY29weVdpdGhpbiddLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGtleSBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZTsgfSkpO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczYtYXJyYXktZmlsbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgnZmlsbCcgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUpIHtcclxuICAgICAgICAvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gWzFdLmZpbGwoOSwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKVswXSA9PT0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM3LWFycmF5JywgZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2luY2x1ZGVzJyBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZTsgfSwgdHJ1ZSk7XHJcbi8qIE1hcCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuTWFwID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLypcclxuICAgIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcclxuICAgIFdlIHdyYXAgdGhpcyBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIHNvbWV0aW1lcyB0aGUgTWFwIGNvbnN0cnVjdG9yIGV4aXN0cywgYnV0IGRvZXMgbm90XHJcbiAgICB0YWtlIGFyZ3VtZW50cyAoaU9TIDguNClcclxuICAgICAqL1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5NYXAoW1swLCAxXV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gKG1hcC5oYXMoMCkgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC5lbnRyaWVzID09PSAnZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCB0ZXN0aW5nIG9uIGlPUyBhdCB0aGUgbW9tZW50ICovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBNYXRoICovXHJcbmhhc18xLmFkZCgnZXM2LW1hdGgnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgICdjbHozMicsXHJcbiAgICAgICAgJ3NpZ24nLFxyXG4gICAgICAgICdsb2cxMCcsXHJcbiAgICAgICAgJ2xvZzInLFxyXG4gICAgICAgICdsb2cxcCcsXHJcbiAgICAgICAgJ2V4cG0xJyxcclxuICAgICAgICAnY29zaCcsXHJcbiAgICAgICAgJ3NpbmgnLFxyXG4gICAgICAgICd0YW5oJyxcclxuICAgICAgICAnYWNvc2gnLFxyXG4gICAgICAgICdhc2luaCcsXHJcbiAgICAgICAgJ2F0YW5oJyxcclxuICAgICAgICAndHJ1bmMnLFxyXG4gICAgICAgICdmcm91bmQnLFxyXG4gICAgICAgICdjYnJ0JyxcclxuICAgICAgICAnaHlwb3QnXHJcbiAgICBdLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5NYXRoW25hbWVdID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LW1hdGgtaW11bCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgnaW11bCcgaW4gZ2xvYmFsXzEuZGVmYXVsdC5NYXRoKSB7XHJcbiAgICAgICAgLyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgb24gaW9zIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xyXG4gICAgICAgIHJldHVybiBNYXRoLmltdWwoMHhmZmZmZmZmZiwgNSkgPT09IC01O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogT2JqZWN0ICovXHJcbmhhc18xLmFkZCgnZXM2LW9iamVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpICYmXHJcbiAgICAgICAgWydhc3NpZ24nLCAnaXMnLCAnZ2V0T3duUHJvcGVydHlTeW1ib2xzJywgJ3NldFByb3RvdHlwZU9mJ10uZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJzsgfSkpO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczIwMTctb2JqZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFsndmFsdWVzJywgJ2VudHJpZXMnLCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyddLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbic7IH0pO1xyXG59LCB0cnVlKTtcclxuLyogT2JzZXJ2YWJsZSAqL1xyXG5oYXNfMS5hZGQoJ2VzLW9ic2VydmFibGUnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYnNlcnZhYmxlICE9PSAndW5kZWZpbmVkJzsgfSwgdHJ1ZSk7XHJcbi8qIFByb21pc2UgKi9cclxuaGFzXzEuYWRkKCdlczYtcHJvbWlzZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKTsgfSwgdHJ1ZSk7XHJcbi8qIFNldCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1zZXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBTZXQgZnVuY3Rpb25hbGl0eSAqL1xyXG4gICAgICAgIHZhciBzZXQgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5TZXQoWzFdKTtcclxuICAgICAgICByZXR1cm4gc2V0LmhhcygxKSAmJiAna2V5cycgaW4gc2V0ICYmIHR5cGVvZiBzZXQua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBTdHJpbmcgKi9cclxuaGFzXzEuYWRkKCdlczYtc3RyaW5nJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChbXHJcbiAgICAgICAgLyogc3RhdGljIG1ldGhvZHMgKi9cclxuICAgICAgICAnZnJvbUNvZGVQb2ludCdcclxuICAgIF0uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nW2tleV0gPT09ICdmdW5jdGlvbic7IH0pICYmXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAvKiBpbnN0YW5jZSBtZXRob2RzICovXHJcbiAgICAgICAgICAgICdjb2RlUG9pbnRBdCcsXHJcbiAgICAgICAgICAgICdub3JtYWxpemUnLFxyXG4gICAgICAgICAgICAncmVwZWF0JyxcclxuICAgICAgICAgICAgJ3N0YXJ0c1dpdGgnLFxyXG4gICAgICAgICAgICAnZW5kc1dpdGgnLFxyXG4gICAgICAgICAgICAnaW5jbHVkZXMnXHJcbiAgICAgICAgXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbic7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LXN0cmluZy1yYXcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZSkge1xyXG4gICAgICAgIHZhciBzdWJzdGl0dXRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRzbGliXzEuX19zcHJlYWQoY2FsbFNpdGUpO1xyXG4gICAgICAgIHJlc3VsdC5yYXcgPSBjYWxsU2l0ZS5yYXc7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGlmICgncmF3JyBpbiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZykge1xyXG4gICAgICAgIHZhciBiID0gMTtcclxuICAgICAgICB2YXIgY2FsbFNpdGUgPSBnZXRDYWxsU2l0ZSh0ZW1wbGF0ZU9iamVjdF8xIHx8ICh0ZW1wbGF0ZU9iamVjdF8xID0gdHNsaWJfMS5fX21ha2VUZW1wbGF0ZU9iamVjdChbXCJhXFxuXCIsIFwiXCJdLCBbXCJhXFxcXG5cIiwgXCJcIl0pKSwgYik7XHJcbiAgICAgICAgY2FsbFNpdGUucmF3ID0gWydhXFxcXG4nXTtcclxuICAgICAgICB2YXIgc3VwcG9ydHNUcnVuYyA9IGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzVHJ1bmM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzMjAxNy1zdHJpbmcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbic7IH0pO1xyXG59LCB0cnVlKTtcclxuLyogU3ltYm9sICovXHJcbmhhc18xLmFkZCgnZXM2LXN5bWJvbCcsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJzsgfSwgdHJ1ZSk7XHJcbi8qIFdlYWtNYXAgKi9cclxuaGFzXzEuYWRkKCdlczYtd2Vha21hcCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHkgKi9cclxuICAgICAgICB2YXIga2V5MSA9IHt9O1xyXG4gICAgICAgIHZhciBrZXkyID0ge307XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBnbG9iYWxfMS5kZWZhdWx0LldlYWtNYXAoW1trZXkxLCAxXV0pO1xyXG4gICAgICAgIE9iamVjdC5mcmVlemUoa2V5MSk7XHJcbiAgICAgICAgcmV0dXJuIG1hcC5nZXQoa2V5MSkgPT09IDEgJiYgbWFwLnNldChrZXkyLCAyKSA9PT0gbWFwICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE1pc2NlbGxhbmVvdXMgZmVhdHVyZXMgKi9cclxuaGFzXzEuYWRkKCdtaWNyb3Rhc2tzJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gaGFzXzEuZGVmYXVsdCgnZXM2LXByb21pc2UnKSB8fCBoYXNfMS5kZWZhdWx0KCdob3N0LW5vZGUnKSB8fCBoYXNfMS5kZWZhdWx0KCdkb20tbXV0YXRpb25vYnNlcnZlcicpOyB9LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdwb3N0bWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIElmIHdpbmRvdyBpcyB1bmRlZmluZWQsIGFuZCB3ZSBoYXZlIHBvc3RNZXNzYWdlLCBpdCBwcm9iYWJseSBtZWFucyB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIuIFdlYiB3b3JrZXJzIGhhdmVcclxuICAgIC8vIHBvc3QgbWVzc2FnZSBidXQgaXQgZG9lc24ndCB3b3JrIGhvdyB3ZSBleHBlY3QgaXQgdG8sIHNvIGl0J3MgYmVzdCBqdXN0IHRvIHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cclxuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC53aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdyYWYnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbic7IH0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ3NldGltbWVkaWF0ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LnNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCc7IH0sIHRydWUpO1xyXG4vKiBET00gRmVhdHVyZXMgKi9cclxuaGFzXzEuYWRkKCdkb20tbXV0YXRpb25vYnNlcnZlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdob3N0LWJyb3dzZXInKSAmJiBCb29sZWFuKGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIpKSB7XHJcbiAgICAgICAgLy8gSUUxMSBoYXMgYW4gdW5yZWxpYWJsZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIHdoZXJlIHNldFByb3BlcnR5KCkgZG9lcyBub3RcclxuICAgICAgICAvLyBnZW5lcmF0ZSBhIG11dGF0aW9uIGV2ZW50LCBvYnNlcnZlcnMgY2FuIGNyYXNoLCBhbmQgdGhlIHF1ZXVlIGRvZXMgbm90IGRyYWluXHJcbiAgICAgICAgLy8gcmVsaWFibHkuIFRoZSBmb2xsb3dpbmcgZmVhdHVyZSB0ZXN0IHdhcyBhZGFwdGVkIGZyb21cclxuICAgICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90MTBrby80YWNlYjhjNzE2ODFmZGIyNzVlMzNlZmU1ZTU3NmIxNFxyXG4gICAgICAgIHZhciBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICB2YXIgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxfMS5kZWZhdWx0Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsXzEuZGVmYXVsdC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGV4YW1wbGUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbihvYnNlcnZlci50YWtlUmVjb3JkcygpLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG52YXIgdGVtcGxhdGVPYmplY3RfMTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL2hhc1wiKTtcclxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbSkge1xyXG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaXRlbS5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChkZXN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbnZhciBjaGVja01pY3JvVGFza1F1ZXVlO1xyXG52YXIgbWljcm9UYXNrcztcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydHMucXVldWVUYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkZXN0cnVjdG9yO1xyXG4gICAgdmFyIGVucXVldWU7XHJcbiAgICAvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgncG9zdG1lc3NhZ2UnKSkge1xyXG4gICAgICAgIHZhciBxdWV1ZV8xID0gW107XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsXzEuZGVmYXVsdCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVldWVfMS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhxdWV1ZV8xLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlXzEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGFzXzEuZGVmYXVsdCgnc2V0aW1tZWRpYXRlJykpIHtcclxuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsXzEuZGVmYXVsdC5jbGVhckltbWVkaWF0ZTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbF8xLmRlZmF1bHQuY2xlYXJUaW1lb3V0O1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpZCA9IGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IgJiZcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcihpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZVRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZVRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8vIFdoZW4gbm8gbWVjaGFuaXNtIGZvciByZWdpc3RlcmluZyBtaWNyb3Rhc2tzIGlzIGV4cG9zZWQgYnkgdGhlIGVudmlyb25tZW50LCBtaWNyb3Rhc2tzIHdpbGxcclxuLy8gYmUgcXVldWVkIGFuZCB0aGVuIGV4ZWN1dGVkIGluIGEgc2luZ2xlIG1hY3JvdGFzayBiZWZvcmUgdGhlIG90aGVyIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkLlxyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ21pY3JvdGFza3MnKSkge1xyXG4gICAgdmFyIGlzTWljcm9UYXNrUXVldWVkXzEgPSBmYWxzZTtcclxuICAgIG1pY3JvVGFza3MgPSBbXTtcclxuICAgIGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFpc01pY3JvVGFza1F1ZXVlZF8xKSB7XHJcbiAgICAgICAgICAgIGlzTWljcm9UYXNrUXVldWVkXzEgPSB0cnVlO1xyXG4gICAgICAgICAgICBleHBvcnRzLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZF8xID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogU2NoZWR1bGVzIGFuIGFuaW1hdGlvbiB0YXNrIHdpdGggYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGl0IGV4aXN0cywgb3Igd2l0aCBgcXVldWVUYXNrYCBvdGhlcndpc2UuXHJcbiAqXHJcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXHJcbiAqIEhvd2V2ZXIsIGF0IHRpbWVzIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gZGVsZWdhdGUgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lOyBoZW5jZSB0aGUgZm9sbG93aW5nIG1ldGhvZC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFoYXNfMS5kZWZhdWx0KCdyYWYnKSkge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLnF1ZXVlVGFzaztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZUFuaW1hdGlvblRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxyXG4gKlxyXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXHJcbiAqIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtYWNyb3Rhc2tzIGlzIGV4cG9zZWQsIHRoZW4gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGZpcmVkIGJlZm9yZSBhbnkgbWFjcm90YXNrXHJcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZU1pY3JvVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZW5xdWV1ZTtcclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdob3N0LW5vZGUnKSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykpIHtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJykpIHtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICAgICAgdmFyIG5vZGVfMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZhciBxdWV1ZV8yID0gW107XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHF1ZXVlXzIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBxdWV1ZV8yLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGVfMSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBxdWV1ZV8yLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIG5vZGVfMS5zZXRBdHRyaWJ1dGUoJ3F1ZXVlU3RhdHVzJywgJzEnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgbWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xyXG4gICAgfTtcclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvcXVldWUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXHJcbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcclxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXHJcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcclxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSwgZW51bWVyYWJsZSwgd3JpdGFibGUsIGNvbmZpZ3VyYWJsZSkge1xyXG4gICAgaWYgKGVudW1lcmFibGUgPT09IHZvaWQgMCkgeyBlbnVtZXJhYmxlID0gZmFsc2U7IH1cclxuICAgIGlmICh3cml0YWJsZSA9PT0gdm9pZCAwKSB7IHdyaXRhYmxlID0gdHJ1ZTsgfVxyXG4gICAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYWJsZSA9IHRydWU7IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGVudW1lcmFibGUsXHJcbiAgICAgICAgd3JpdGFibGU6IHdyaXRhYmxlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZ2V0VmFsdWVEZXNjcmlwdG9yID0gZ2V0VmFsdWVEZXNjcmlwdG9yO1xyXG5mdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMud3JhcE5hdGl2ZSA9IHdyYXBOYXRpdmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIEluamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoSW5qZWN0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJbmplY3RvcihwYXlsb2FkKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgSW5qZWN0b3IucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH07XHJcbiAgICBJbmplY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcclxuICAgICAgICB0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEluamVjdG9yO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuSW5qZWN0b3IgPSBJbmplY3RvcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSW5qZWN0b3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG4vKipcclxuICogRW51bSB0byBpZGVudGlmeSB0aGUgdHlwZSBvZiBldmVudC5cclxuICogTGlzdGVuaW5nIHRvICdQcm9qZWN0b3InIHdpbGwgbm90aWZ5IHdoZW4gcHJvamVjdG9yIGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxyXG4gKiBMaXN0ZW5pbmcgdG8gJ1dpZGdldCcgd2lsbCBub3RpZnkgd2hlbiB3aWRnZXQgcm9vdCBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcclxuICovXHJcbnZhciBOb2RlRXZlbnRUeXBlO1xyXG4oZnVuY3Rpb24gKE5vZGVFdmVudFR5cGUpIHtcclxuICAgIE5vZGVFdmVudFR5cGVbXCJQcm9qZWN0b3JcIl0gPSBcIlByb2plY3RvclwiO1xyXG4gICAgTm9kZUV2ZW50VHlwZVtcIldpZGdldFwiXSA9IFwiV2lkZ2V0XCI7XHJcbn0pKE5vZGVFdmVudFR5cGUgPSBleHBvcnRzLk5vZGVFdmVudFR5cGUgfHwgKGV4cG9ydHMuTm9kZUV2ZW50VHlwZSA9IHt9KSk7XHJcbnZhciBOb2RlSGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKE5vZGVIYW5kbGVyLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTm9kZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX25vZGVNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU1hcC5oYXMoa2V5KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuc2V0KGtleSwgZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5hZGRSb290ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuV2lkZ2V0IH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5hZGRQcm9qZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTm9kZUhhbmRsZXI7XHJcbn0oRXZlbnRlZF8xLkV2ZW50ZWQpKTtcclxuZXhwb3J0cy5Ob2RlSGFuZGxlciA9IE5vZGVIYW5kbGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBOb2RlSGFuZGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBQcm9taXNlXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9Qcm9taXNlXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1N5bWJvbFwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbi8qKlxyXG4gKiBXaWRnZXQgYmFzZSBzeW1ib2wgdHlwZVxyXG4gKi9cclxuZXhwb3J0cy5XSURHRVRfQkFTRV9UWVBFID0gU3ltYm9sXzEuZGVmYXVsdCgnV2lkZ2V0IEJhc2UnKTtcclxuLyoqXHJcbiAqIENoZWNrcyBpcyB0aGUgaXRlbSBpcyBhIHN1YmNsYXNzIG9mIFdpZGdldEJhc2UgKG9yIGEgV2lkZ2V0QmFzZSlcclxuICpcclxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcclxuICogQHJldHVybnMgdHJ1ZS9mYWxzZSBpbmRpY2F0aW5nIGlmIHRoZSBpdGVtIGlzIGEgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpdGVtICYmIGl0ZW0uX3R5cGUgPT09IGV4cG9ydHMuV0lER0VUX0JBU0VfVFlQRSk7XHJcbn1cclxuZXhwb3J0cy5pc1dpZGdldEJhc2VDb25zdHJ1Y3RvciA9IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yO1xyXG5mdW5jdGlvbiBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydChpdGVtKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpdGVtICYmXHJcbiAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXHJcbiAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpICYmXHJcbiAgICAgICAgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbS5kZWZhdWx0KSk7XHJcbn1cclxuZXhwb3J0cy5pc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydCA9IGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0O1xyXG4vKipcclxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG52YXIgUmVnaXN0cnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhSZWdpc3RyeSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJlZ2lzdHJ5KCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRW1pdCBsb2FkZWQgZXZlbnQgZm9yIHJlZ2lzdHJ5IGxhYmVsXHJcbiAgICAgKi9cclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5lbWl0TG9hZGVkRXZlbnQgPSBmdW5jdGlvbiAod2lkZ2V0TGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICB0aGlzLmVtaXQoe1xyXG4gICAgICAgICAgICB0eXBlOiB3aWRnZXRMYWJlbCxcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9hZGVkJyxcclxuICAgICAgICAgICAgaXRlbTogaXRlbVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwid2lkZ2V0IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJ1wiICsgbGFiZWwudG9TdHJpbmcoKSArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2VfMS5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGl0ZW0udGhlbihmdW5jdGlvbiAod2lkZ2V0Q3Rvcikge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldEN0b3I7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5kZWZpbmVJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCwgaXRlbSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5qZWN0b3IgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnXCIgKyBsYWJlbC50b1N0cmluZygpICsgXCInXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmdldChsYWJlbCk7XHJcbiAgICAgICAgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2VfMS5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IGl0ZW0oKTtcclxuICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHByb21pc2UpO1xyXG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAod2lkZ2V0Q3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQod2lkZ2V0Q3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHdpZGdldEN0b3IgPSB3aWRnZXRDdG9yLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgIF90aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZ2V0SW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW5qZWN0b3IobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuaGFzSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ICYmIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJlZ2lzdHJ5O1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuUmVnaXN0cnkgPSBSZWdpc3RyeTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUmVnaXN0cnk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgUmVnaXN0cnlIYW5kbGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnlIYW5kbGVyLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gUmVnaXN0cnlIYW5kbGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5XzEuUmVnaXN0cnkoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCA9IG5ldyBNYXBfMS5NYXAoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwID0gbmV3IE1hcF8xLk1hcCgpO1xyXG4gICAgICAgIF90aGlzLm93bihfdGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgIHZhciBkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMuYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUoX3RoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKF90aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm93bih7IGRlc3Ryb3k6IGRlc3Ryb3kgfSk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUsIFwiYmFzZVwiLCB7XHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5iYXNlUmVnaXN0cnkgPSBiYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uIChsYWJlbCwgd2lkZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGluamVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5oYXNJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbFByZWNlZGVuY2UgPT09IHZvaWQgMCkgeyBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5nZXRJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxQcmVjZWRlbmNlID09PSB2b2lkIDApIHsgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLl9nZXQgPSBmdW5jdGlvbiAobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsIGdldEZ1bmN0aW9uTmFtZSwgbGFiZWxNYXApIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RyeSA9IHJlZ2lzdHJpZXNbaV07XHJcbiAgICAgICAgICAgIGlmICghcmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZ2lzdGVyZWRMYWJlbHMuaW5kZXhPZihsYWJlbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gcmVnaXN0cnkub24obGFiZWwsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdsb2FkZWQnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgbGFiZWxNYXAuc2V0KHJlZ2lzdHJ5LCB0c2xpYl8xLl9fc3ByZWFkKHJlZ2lzdGVyZWRMYWJlbHMsIFtsYWJlbF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmVnaXN0cnlIYW5kbGVyO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuUmVnaXN0cnlIYW5kbGVyID0gUmVnaXN0cnlIYW5kbGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWdpc3RyeUhhbmRsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgZGlmZl8xID0gcmVxdWlyZShcIi4vZGlmZlwiKTtcclxudmFyIFJlZ2lzdHJ5SGFuZGxlcl8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlIYW5kbGVyXCIpO1xyXG52YXIgTm9kZUhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL05vZGVIYW5kbGVyXCIpO1xyXG52YXIgdmRvbV8xID0gcmVxdWlyZShcIi4vdmRvbVwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIGRlY29yYXRvck1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbnZhciBib3VuZEF1dG8gPSBkaWZmXzEuYXV0by5iaW5kKG51bGwpO1xyXG4vKipcclxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXHJcbiAqL1xyXG52YXIgV2lkZ2V0QmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFdpZGdldEJhc2UoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgaXQgaXMgdGhlIGluaXRpYWwgc2V0IHByb3BlcnRpZXMgY3ljbGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IHRydWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XHJcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIgPSBuZXcgTm9kZUhhbmRsZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fYm91bmRJbnZhbGlkYXRlID0gdGhpcy5pbnZhbGlkYXRlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XHJcbiAgICAgICAgICAgIGRpcnR5OiB0cnVlLFxyXG4gICAgICAgICAgICBvbkF0dGFjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMub25BdHRhY2goKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EZXRhY2g6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLm9uRGV0YWNoKCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJ5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvcmVQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgcmVuZGVyaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5wdXRQcm9wZXJ0aWVzOiB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk7XHJcbiAgICB9XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5tZXRhID0gZnVuY3Rpb24gKE1ldGFUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcclxuICAgICAgICBpZiAoIWNhY2hlZCkge1xyXG4gICAgICAgICAgICBjYWNoZWQgPSBuZXcgTWV0YVR5cGUoe1xyXG4gICAgICAgICAgICAgICAgaW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgYmluZDogdGhpc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZWQ7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUub25BdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm9uRGV0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwicHJvcGVydGllc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcImNoYW5nZWRQcm9wZXJ0eUtleXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX3NwcmVhZCh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyA9IGZ1bmN0aW9uIChjb3JlUHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBiYXNlUmVnaXN0cnkgPSBjb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmJhc2UgPSBiYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMgPSBjb3JlUHJvcGVydGllcztcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3NldFByb3BlcnRpZXNfXyA9IGZ1bmN0aW9uIChvcmlnaW5hbFByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMgPSBvcmlnaW5hbFByb3BlcnRpZXM7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLl9ydW5CZWZvcmVQcm9wZXJ0aWVzKG9yaWdpbmFsUHJvcGVydGllcyk7XHJcbiAgICAgICAgdmFyIHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5Jyk7XHJcbiAgICAgICAgdmFyIGNoYW5nZWRQcm9wZXJ0eUtleXMgPSBbXTtcclxuICAgICAgICB2YXIgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9PT0gZmFsc2UgfHwgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgYWxsUHJvcGVydGllcyA9IHRzbGliXzEuX19zcHJlYWQocHJvcGVydHlOYW1lcywgT2JqZWN0LmtleXModGhpcy5fcHJvcGVydGllcykpO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tlZFByb3BlcnRpZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGRpZmZQcm9wZXJ0eVJlc3VsdHMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHJ1blJlYWN0aW9ucyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBhbGxQcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoZWNrZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1Byb3BlcnR5ID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1Byb3BlcnR5ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLCBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBydW5SZWFjdGlvbnMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWZmRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoXCJkaWZmUHJvcGVydHk6XCIgKyBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMSA9IDA7IGlfMSA8IGRpZmZGdW5jdGlvbnMubGVuZ3RoOyBpXzErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGlmZkZ1bmN0aW9uc1tpXzFdKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYm91bmRBdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocnVuUmVhY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMocHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykuZm9yRWFjaChmdW5jdGlvbiAoYXJncywgcmVhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5jaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0aW9uLmNhbGwoX3RoaXMsIGFyZ3MucHJldmlvdXNQcm9wZXJ0aWVzLCBhcmdzLm5ld1Byb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBkaWZmUHJvcGVydHlSZXN1bHRzO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydHlOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcImNoaWxkcmVuXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX19zZXRDaGlsZHJlbl9fID0gZnVuY3Rpb24gKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgfHwgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX19yZW5kZXJfXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB2YXIgcmVuZGVyID0gdGhpcy5fcnVuQmVmb3JlUmVuZGVycygpO1xyXG4gICAgICAgIHZhciBkTm9kZSA9IHJlbmRlcigpO1xyXG4gICAgICAgIGROb2RlID0gdGhpcy5ydW5BZnRlclJlbmRlcnMoZE5vZGUpO1xyXG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyLmNsZWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIGROb2RlO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZF8xLnYoJ2RpdicsIHt9LCB0aGlzLmNoaWxkcmVuKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGFkZCBkZWNvcmF0b3JzIHRvIFdpZGdldEJhc2VcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLmFkZERlY29yYXRvciA9IGZ1bmN0aW9uIChkZWNvcmF0b3JLZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcclxuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xyXG4gICAgICAgICAgICB2YXIgZGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvck1hcC5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIGlmICghZGVjb3JhdG9yTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JNYXAuc2V0KHRoaXMuY29uc3RydWN0b3IsIGRlY29yYXRvckxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JMaXN0LmdldChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgICAgICBpZiAoIXNwZWNpZmljRGVjb3JhdG9yTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JMaXN0LnNldChkZWNvcmF0b3JLZXksIHNwZWNpZmljRGVjb3JhdG9yTGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0LnB1c2guYXBwbHkoc3BlY2lmaWNEZWNvcmF0b3JMaXN0LCB0c2xpYl8xLl9fc3ByZWFkKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZGVjb3JhdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIHRzbGliXzEuX19zcHJlYWQoZGVjb3JhdG9ycywgdmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBidWlsZCB0aGUgbGlzdCBvZiBkZWNvcmF0b3JzIGZyb20gdGhlIGdsb2JhbCBkZWNvcmF0b3IgbWFwLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgIFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICogQHJldHVybiBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fYnVpbGREZWNvcmF0b3JMaXN0ID0gZnVuY3Rpb24gKGRlY29yYXRvcktleSkge1xyXG4gICAgICAgIHZhciBhbGxEZWNvcmF0b3JzID0gW107XHJcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICB3aGlsZSAoY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlTWFwID0gZGVjb3JhdG9yTWFwLmdldChjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZU1hcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlY29yYXRvcnMgPSBpbnN0YW5jZU1hcC5nZXQoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWNvcmF0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsRGVjb3JhdG9ycy51bnNoaWZ0LmFwcGx5KGFsbERlY29yYXRvcnMsIHRzbGliXzEuX19zcHJlYWQoZGVjb3JhdG9ycykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBEZXN0cm95cyBwcml2YXRlIHJlc291cmNlcyBmb3IgV2lkZ2V0QmFzZVxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuZm9yRWFjaChmdW5jdGlvbiAobWV0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIGRlY29yYXRvciB2YWx1ZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5nZXREZWNvcmF0b3IgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5KSB7XHJcbiAgICAgICAgdmFyIGFsbERlY29yYXRvcnMgPSB0aGlzLl9kZWNvcmF0b3JDYWNoZS5nZXQoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICBpZiAoYWxsRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbGxEZWNvcmF0b3JzID0gdGhpcy5fYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgYWxsRGVjb3JhdG9ycyk7XHJcbiAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyA9IGZ1bmN0aW9uIChuZXdQcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVhY3Rpb25GdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcignZGlmZlJlYWN0aW9uJyk7XHJcbiAgICAgICAgcmV0dXJuIHJlYWN0aW9uRnVuY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAocmVhY3Rpb25Qcm9wZXJ0eU1hcCwgX2EpIHtcclxuICAgICAgICAgICAgdmFyIHJlYWN0aW9uID0gX2EucmVhY3Rpb24sIHByb3BlcnR5TmFtZSA9IF9hLnByb3BlcnR5TmFtZTtcclxuICAgICAgICAgICAgdmFyIHJlYWN0aW9uQXJndW1lbnRzID0gcmVhY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocmVhY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAocmVhY3Rpb25Bcmd1bWVudHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBuZXdQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5wcmV2aW91c1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IF90aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLm5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IG5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMuY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocmVhY3Rpb24sIHJlYWN0aW9uQXJndW1lbnRzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlYWN0aW9uUHJvcGVydHlNYXA7XHJcbiAgICAgICAgfSwgbmV3IE1hcF8xLmRlZmF1bHQoKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yIGZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fYmluZEZ1bmN0aW9uUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIGJpbmQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnZnVuY3Rpb24nICYmIFJlZ2lzdHJ5XzEuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYmluZEluZm8gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocHJvcGVydHkpIHx8IHt9O1xyXG4gICAgICAgICAgICB2YXIgYm91bmRGdW5jID0gYmluZEluZm8uYm91bmRGdW5jLCBzY29wZSA9IGJpbmRJbmZvLnNjb3BlO1xyXG4gICAgICAgICAgICBpZiAoYm91bmRGdW5jID09PSB1bmRlZmluZWQgfHwgc2NvcGUgIT09IGJpbmQpIHtcclxuICAgICAgICAgICAgICAgIGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocHJvcGVydHksIHsgYm91bmRGdW5jOiBib3VuZEZ1bmMsIHNjb3BlOiBiaW5kIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZEZ1bmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwicmVnaXN0cnlcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5CZWZvcmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBiZWZvcmVQcm9wZXJ0aWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcclxuICAgICAgICBpZiAoYmVmb3JlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAocHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwoX3RoaXMsIHByb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgfSwgdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBiZWZvcmUgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSB1cGRhdGVkIHJlbmRlciBtZXRob2RcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX3J1bkJlZm9yZVJlbmRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYmVmb3JlUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVSZW5kZXInKTtcclxuICAgICAgICBpZiAoYmVmb3JlUmVuZGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZShmdW5jdGlvbiAocmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKF90aGlzLCByZW5kZXIsIF90aGlzLl9wcm9wZXJ0aWVzLCBfdGhpcy5fY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVkUmVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZW5kZXIgZnVuY3Rpb24gbm90IHJldHVybmVkIGZyb20gYmVmb3JlUmVuZGVyLCB1c2luZyBwcmV2aW91cyByZW5kZXInKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWRSZW5kZXI7XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZFJlbmRlckZ1bmM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYWZ0ZXIgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSBkZWNvcmF0ZWQgRE5vZGVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUucnVuQWZ0ZXJSZW5kZXJzID0gZnVuY3Rpb24gKGROb2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XHJcbiAgICAgICAgaWYgKGFmdGVyUmVuZGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJlbmRlcnMucmVkdWNlKGZ1bmN0aW9uIChkTm9kZSwgYWZ0ZXJSZW5kZXJGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbChfdGhpcywgZE5vZGUpO1xyXG4gICAgICAgICAgICB9LCBkTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5mb3JFYWNoKGZ1bmN0aW9uIChtZXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhLmFmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZE5vZGU7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX3J1bkFmdGVyQ29uc3RydWN0b3JzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcclxuICAgICAgICBpZiAoYWZ0ZXJDb25zdHJ1Y3RvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBhZnRlckNvbnN0cnVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChhZnRlckNvbnN0cnVjdG9yKSB7IHJldHVybiBhZnRlckNvbnN0cnVjdG9yLmNhbGwoX3RoaXMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdGF0aWMgaWRlbnRpZmllclxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLl90eXBlID0gUmVnaXN0cnlfMS5XSURHRVRfQkFTRV9UWVBFO1xyXG4gICAgcmV0dXJuIFdpZGdldEJhc2U7XHJcbn0oKSk7XHJcbmV4cG9ydHMuV2lkZ2V0QmFzZSA9IFdpZGdldEJhc2U7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdpZGdldEJhc2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xyXG52YXIgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJyc7XHJcbmZ1bmN0aW9uIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpIHtcclxuICAgIGlmICgnV2Via2l0VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgndHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSB8fCAnTW96VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ2FuaW1hdGlvbmVuZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZShlbGVtZW50KSB7XHJcbiAgICBpZiAoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID09PSAnJykge1xyXG4gICAgICAgIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJ1bkFuZENsZWFuVXAoZWxlbWVudCwgc3RhcnRBbmltYXRpb24sIGZpbmlzaEFuaW1hdGlvbikge1xyXG4gICAgaW5pdGlhbGl6ZShlbGVtZW50KTtcclxuICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFmaW5pc2hlZCkge1xyXG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGZpbmlzaEFuaW1hdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBzdGFydEFuaW1hdGlvbigpO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbn1cclxuZnVuY3Rpb24gZXhpdChub2RlLCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uLCByZW1vdmVOb2RlKSB7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb25BY3RpdmUgfHwgZXhpdEFuaW1hdGlvbiArIFwiLWFjdGl2ZVwiO1xyXG4gICAgcnVuQW5kQ2xlYW5VcChub2RlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGV4aXRBbmltYXRpb24pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmVtb3ZlTm9kZSgpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZW50ZXIobm9kZSwgcHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pIHtcclxuICAgIHZhciBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZW50ZXJBbmltYXRpb25BY3RpdmUgfHwgZW50ZXJBbmltYXRpb24gKyBcIi1hY3RpdmVcIjtcclxuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChlbnRlckFuaW1hdGlvbik7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSB7XHJcbiAgICBlbnRlcjogZW50ZXIsXHJcbiAgICBleGl0OiBleGl0XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2xhbmdcIik7XHJcbnZhciBhcnJheV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vYXJyYXlcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCIuL1dpZGdldEJhc2VcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgRG9tV3JhcHBlcl8xID0gcmVxdWlyZShcIi4vdXRpbC9Eb21XcmFwcGVyXCIpO1xyXG52YXIgUHJvamVjdG9yXzEgPSByZXF1aXJlKFwiLi9taXhpbnMvUHJvamVjdG9yXCIpO1xyXG52YXIgQ2hpbGRyZW5UeXBlO1xyXG4oZnVuY3Rpb24gKENoaWxkcmVuVHlwZSkge1xyXG4gICAgQ2hpbGRyZW5UeXBlW1wiRE9KT1wiXSA9IFwiRE9KT1wiO1xyXG4gICAgQ2hpbGRyZW5UeXBlW1wiRUxFTUVOVFwiXSA9IFwiRUxFTUVOVFwiO1xyXG59KShDaGlsZHJlblR5cGUgPSBleHBvcnRzLkNoaWxkcmVuVHlwZSB8fCAoZXhwb3J0cy5DaGlsZHJlblR5cGUgPSB7fSkpO1xyXG4vKipcclxuICogRG9tVG9XaWRnZXRXcmFwcGVyIEhPQ1xyXG4gKlxyXG4gKiBAcGFyYW0gZG9tTm9kZSBUaGUgZG9tIG5vZGUgdG8gd3JhcFxyXG4gKi9cclxuZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGUpIHtcclxuICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoRG9tVG9XaWRnZXRXcmFwcGVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIERvbVRvV2lkZ2V0V3JhcHBlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuX3dpZGdldEluc3RhbmNlID0gZG9tTm9kZS5nZXRXaWRnZXRJbnN0YW5jZSAmJiBkb21Ob2RlLmdldFdpZGdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIGlmICghX3RoaXMuX3dpZGdldEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fd2lkZ2V0SW5zdGFuY2UgPSBkb21Ob2RlLmdldFdpZGdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBEb21Ub1dpZGdldFdyYXBwZXIucHJvdG90eXBlLl9fcmVuZGVyX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2Tm9kZSA9IF9zdXBlci5wcm90b3R5cGUuX19yZW5kZXJfXy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICB2Tm9kZS5kb21Ob2RlID0gZG9tTm9kZTtcclxuICAgICAgICAgICAgcmV0dXJuIHZOb2RlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgRG9tVG9XaWRnZXRXcmFwcGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl93aWRnZXRJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyh0c2xpYl8xLl9fYXNzaWduKHsga2V5OiAncm9vdCcgfSwgdGhpcy5fd2lkZ2V0SW5zdGFuY2UucHJvcGVydGllcywgdGhpcy5wcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRfMS52KGRvbU5vZGUudGFnTmFtZSwge30pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIERvbVRvV2lkZ2V0V3JhcHBlcjtcclxuICAgIH0oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpKTtcclxufVxyXG5leHBvcnRzLkRvbVRvV2lkZ2V0V3JhcHBlciA9IERvbVRvV2lkZ2V0V3JhcHBlcjtcclxuZnVuY3Rpb24gZ2V0V2lkZ2V0UHJvcGVydHlGcm9tQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBkZXNjcmlwdG9yKSB7XHJcbiAgICB2YXIgX2EgPSBkZXNjcmlwdG9yLnByb3BlcnR5TmFtZSwgcHJvcGVydHlOYW1lID0gX2EgPT09IHZvaWQgMCA/IGF0dHJpYnV0ZU5hbWUgOiBfYSwgX2IgPSBkZXNjcmlwdG9yLnZhbHVlLCB2YWx1ZSA9IF9iID09PSB2b2lkIDAgPyBhdHRyaWJ1dGVWYWx1ZSA6IF9iO1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUoYXR0cmlidXRlVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtwcm9wZXJ0eU5hbWUsIHZhbHVlXTtcclxufVxyXG5leHBvcnRzLmN1c3RvbUV2ZW50Q2xhc3MgPSBnbG9iYWxfMS5kZWZhdWx0LkN1c3RvbUV2ZW50O1xyXG5pZiAodHlwZW9mIGV4cG9ydHMuY3VzdG9tRXZlbnRDbGFzcyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgdmFyIGN1c3RvbUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XHJcbiAgICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xyXG4gICAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XHJcbiAgICAgICAgcmV0dXJuIGV2dDtcclxuICAgIH07XHJcbiAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdC5FdmVudCkge1xyXG4gICAgICAgIGN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IGdsb2JhbF8xLmRlZmF1bHQuRXZlbnQucHJvdG90eXBlO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0cy5jdXN0b21FdmVudENsYXNzID0gY3VzdG9tRXZlbnQ7XHJcbn1cclxuLyoqXHJcbiAqIENhbGxlZCBieSBIVE1MRWxlbWVudCBzdWJjbGFzcyB0byBpbml0aWFsaXplIGl0c2VsZiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBhdHRyaWJ1dGVzL3Byb3BlcnRpZXMvZXZlbnRzLlxyXG4gKlxyXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbml0aWFsaXplLlxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgdmFyIGluaXRpYWxQcm9wZXJ0aWVzID0ge307XHJcbiAgICB2YXIgX2EgPSBlbGVtZW50LmdldERlc2NyaXB0b3IoKSwgX2IgPSBfYS5jaGlsZHJlblR5cGUsIGNoaWxkcmVuVHlwZSA9IF9iID09PSB2b2lkIDAgPyBDaGlsZHJlblR5cGUuRE9KTyA6IF9iLCBfYyA9IF9hLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMgPSBfYyA9PT0gdm9pZCAwID8gW10gOiBfYywgX2QgPSBfYS5ldmVudHMsIGV2ZW50cyA9IF9kID09PSB2b2lkIDAgPyBbXSA6IF9kLCBfZSA9IF9hLnByb3BlcnRpZXMsIHByb3BlcnRpZXMgPSBfZSA9PT0gdm9pZCAwID8gW10gOiBfZSwgaW5pdGlhbGl6YXRpb24gPSBfYS5pbml0aWFsaXphdGlvbjtcclxuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZTtcclxuICAgICAgICB2YXIgX2EgPSB0c2xpYl8xLl9fcmVhZChnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpKSwgYXR0cmlidXRlKSwgMiksIHByb3BlcnR5TmFtZSA9IF9hWzBdLCBwcm9wZXJ0eVZhbHVlID0gX2FbMV07XHJcbiAgICAgICAgaW5pdGlhbFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XHJcbiAgICB9KTtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gX2EucHJvcGVydHlOYW1lLCB3aWRnZXRQcm9wZXJ0eU5hbWUgPSBfYS53aWRnZXRQcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgaW5pdGlhbFByb3BlcnRpZXNbd2lkZ2V0UHJvcGVydHlOYW1lIHx8IHByb3BlcnR5TmFtZV0gPSBlbGVtZW50W3Byb3BlcnR5TmFtZV07XHJcbiAgICB9KTtcclxuICAgIHZhciBjdXN0b21Qcm9wZXJ0aWVzID0ge307XHJcbiAgICBhdHRyaWJ1dGVzLnJlZHVjZShmdW5jdGlvbiAocHJvcGVydGllcywgYXR0cmlidXRlKSB7XHJcbiAgICAgICAgdmFyIF9hID0gYXR0cmlidXRlLnByb3BlcnR5TmFtZSwgcHJvcGVydHlOYW1lID0gX2EgPT09IHZvaWQgMCA/IGF0dHJpYnV0ZS5hdHRyaWJ1dGVOYW1lIDogX2E7XHJcbiAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hID0gdHNsaWJfMS5fX3JlYWQoZ2V0V2lkZ2V0UHJvcGVydHlGcm9tQXR0cmlidXRlKGF0dHJpYnV0ZS5hdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgYXR0cmlidXRlKSwgMiksIHByb3BlcnR5TmFtZSA9IF9hWzBdLCBwcm9wZXJ0eVZhbHVlID0gX2FbMV07XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkuc2V0UHJvcGVydGllcyhsYW5nXzEuYXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywgKF9iID0ge30sXHJcbiAgICAgICAgICAgICAgICAgICAgX2JbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgX2IpKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfSwgY3VzdG9tUHJvcGVydGllcyk7XHJcbiAgICBwcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAocHJvcGVydGllcywgcHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHkucHJvcGVydHlOYW1lLCBnZXRWYWx1ZSA9IHByb3BlcnR5LmdldFZhbHVlLCBzZXRWYWx1ZSA9IHByb3BlcnR5LnNldFZhbHVlO1xyXG4gICAgICAgIHZhciBfYSA9IHByb3BlcnR5LndpZGdldFByb3BlcnR5TmFtZSwgd2lkZ2V0UHJvcGVydHlOYW1lID0gX2EgPT09IHZvaWQgMCA/IHByb3BlcnR5TmFtZSA6IF9hO1xyXG4gICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllc1t3aWRnZXRQcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlID8gZ2V0VmFsdWUodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkuc2V0UHJvcGVydGllcyhsYW5nXzEuYXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywgKF9hID0ge30sXHJcbiAgICAgICAgICAgICAgICAgICAgX2Fbd2lkZ2V0UHJvcGVydHlOYW1lXSA9IHNldFZhbHVlID8gc2V0VmFsdWUodmFsdWUpIDogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgX2EpKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfSwgY3VzdG9tUHJvcGVydGllcyk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlbGVtZW50LCBjdXN0b21Qcm9wZXJ0aWVzKTtcclxuICAgIC8vIGRlZmluZSBldmVudHNcclxuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBldmVudC5wcm9wZXJ0eU5hbWUsIGV2ZW50TmFtZSA9IGV2ZW50LmV2ZW50TmFtZTtcclxuICAgICAgICBpbml0aWFsUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgZXhwb3J0cy5jdXN0b21FdmVudENsYXNzKGV2ZW50TmFtZSwge1xyXG4gICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWw6IGV2ZW50XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaW5pdGlhbGl6YXRpb24pIHtcclxuICAgICAgICBpbml0aWFsaXphdGlvbi5jYWxsKGVsZW1lbnQsIGluaXRpYWxQcm9wZXJ0aWVzKTtcclxuICAgIH1cclxuICAgIHZhciBwcm9qZWN0b3IgPSBQcm9qZWN0b3JfMS5Qcm9qZWN0b3JNaXhpbihlbGVtZW50LmdldFdpZGdldENvbnN0cnVjdG9yKCkpO1xyXG4gICAgdmFyIHdpZGdldEluc3RhbmNlID0gbmV3IHByb2plY3RvcigpO1xyXG4gICAgd2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyhpbml0aWFsUHJvcGVydGllcyk7XHJcbiAgICBlbGVtZW50LnNldFdpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdmFyIGVsZW1lbnRDaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGROb2RlcyA/IGFycmF5XzEuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpIDogW107XHJcbiAgICAgICAgZWxlbWVudENoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkTm9kZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7IGtleTogXCJjaGlsZC1cIiArIGluZGV4IH07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlblR5cGUgPT09IENoaWxkcmVuVHlwZS5ET0pPKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGRfMS53KERvbVRvV2lkZ2V0V3JhcHBlcihjaGlsZE5vZGUpLCBwcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGRfMS53KERvbVdyYXBwZXJfMS5Eb21XcmFwcGVyKGNoaWxkTm9kZSksIHByb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVsZW1lbnRDaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZE5vZGUpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdpZGdldEluc3RhbmNlLnNldENoaWxkcmVuKGNoaWxkcmVuKTtcclxuICAgICAgICB3aWRnZXRJbnN0YW5jZS5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuaW5pdGlhbGl6ZUVsZW1lbnQgPSBpbml0aWFsaXplRWxlbWVudDtcclxuLyoqXHJcbiAqIENhbGxlZCBieSBIVE1MRWxlbWVudCBzdWJjbGFzcyB3aGVuIGFuIEhUTUwgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLlxyXG4gKlxyXG4gKiBAcGFyYW0gZWxlbWVudCAgICAgVGhlIGVsZW1lbnQgd2hvc2UgYXR0cmlidXRlcyBhcmUgYmVpbmcgd2F0Y2hlZFxyXG4gKiBAcGFyYW0gbmFtZSAgICAgICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0gbmV3VmFsdWUgICAgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlXHJcbiAqIEBwYXJhbSBvbGRWYWx1ZSAgICBUaGUgb2xkIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUF0dHJpYnV0ZUNoYW5nZWQoZWxlbWVudCwgbmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICB2YXIgYXR0cmlidXRlcyA9IGVsZW1lbnQuZ2V0RGVzY3JpcHRvcigpLmF0dHJpYnV0ZXMgfHwgW107XHJcbiAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLmF0dHJpYnV0ZU5hbWU7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBfYSA9IHRzbGliXzEuX19yZWFkKGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBuZXdWYWx1ZSwgYXR0cmlidXRlKSwgMiksIHByb3BlcnR5TmFtZSA9IF9hWzBdLCBwcm9wZXJ0eVZhbHVlID0gX2FbMV07XHJcbiAgICAgICAgICAgIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIC5nZXRXaWRnZXRJbnN0YW5jZSgpXHJcbiAgICAgICAgICAgICAgICAuc2V0UHJvcGVydGllcyhsYW5nXzEuYXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywgKF9iID0ge30sIF9iW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlLCBfYikpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9iO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVBdHRyaWJ1dGVDaGFuZ2VkID0gaGFuZGxlQXR0cmlidXRlQ2hhbmdlZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9jdXN0b21FbGVtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvY3VzdG9tRWxlbWVudHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1N5bWJvbFwiKTtcclxuLyoqXHJcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBXTm9kZSB0eXBlXHJcbiAqL1xyXG5leHBvcnRzLldOT0RFID0gU3ltYm9sXzEuZGVmYXVsdCgnSWRlbnRpZmllciBmb3IgYSBXTm9kZS4nKTtcclxuLyoqXHJcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBWTm9kZSB0eXBlXHJcbiAqL1xyXG5leHBvcnRzLlZOT0RFID0gU3ltYm9sXzEuZGVmYXVsdCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZS4nKTtcclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gaXNXTm9kZShjaGlsZCkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBleHBvcnRzLldOT0RFKTtcclxufVxyXG5leHBvcnRzLmlzV05vZGUgPSBpc1dOb2RlO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFZOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1ZOb2RlKGNoaWxkKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IGV4cG9ydHMuVk5PREUpO1xyXG59XHJcbmV4cG9ydHMuaXNWTm9kZSA9IGlzVk5vZGU7XHJcbmZ1bmN0aW9uIGRlY29yYXRlKGROb2RlcywgbW9kaWZpZXIsIHByZWRpY2F0ZSkge1xyXG4gICAgdmFyIG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gdHNsaWJfMS5fX3NwcmVhZChkTm9kZXMpIDogW2ROb2Rlc107XHJcbiAgICB3aGlsZSAobm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlcy5wb3AoKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUobm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG1vZGlmaWVyKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlcyA9IHRzbGliXzEuX19zcHJlYWQobm9kZXMsIG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGROb2RlcztcclxufVxyXG5leHBvcnRzLmRlY29yYXRlID0gZGVjb3JhdGU7XHJcbi8qKlxyXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgYSB3aWRnZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiB3KHdpZGdldENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzLCBjaGlsZHJlbikge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB2b2lkIDApIHsgY2hpbGRyZW4gPSBbXTsgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IHdpZGdldENvbnN0cnVjdG9yLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgdHlwZTogZXhwb3J0cy5XTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLncgPSB3O1xyXG5mdW5jdGlvbiB2KHRhZywgcHJvcGVydGllc09yQ2hpbGRyZW4sIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAocHJvcGVydGllc09yQ2hpbGRyZW4gPT09IHZvaWQgMCkgeyBwcm9wZXJ0aWVzT3JDaGlsZHJlbiA9IHt9OyB9XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHZvaWQgMCkgeyBjaGlsZHJlbiA9IHVuZGVmaW5lZDsgfVxyXG4gICAgdmFyIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcclxuICAgIHZhciBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjaztcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnRpZXNPckNoaWxkcmVuKSkge1xyXG4gICAgICAgIGNoaWxkcmVuID0gcHJvcGVydGllc09yQ2hpbGRyZW47XHJcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiB0YWcsXHJcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s6IGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IGV4cG9ydHMuVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy52ID0gdjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5hZnRlclJlbmRlciA9IGFmdGVyUmVuZGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBhZnRlclJlbmRlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2QpIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuYmVmb3JlUHJvcGVydGllcyA9IGJlZm9yZVByb3BlcnRpZXM7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGJlZm9yZVByb3BlcnRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxyXG4gKiByZWdpc3RlcnMgdGhhdCBjdXN0b20gZWxlbWVudC5cclxuICovXHJcbmZ1bmN0aW9uIGN1c3RvbUVsZW1lbnQoX2EpIHtcclxuICAgIHZhciB0YWcgPSBfYS50YWcsIHByb3BlcnRpZXMgPSBfYS5wcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzID0gX2EuYXR0cmlidXRlcywgZXZlbnRzID0gX2EuZXZlbnRzLCBpbml0aWFsaXphdGlvbiA9IF9hLmluaXRpYWxpemF0aW9uO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XHJcbiAgICAgICAgICAgIHRhZ05hbWU6IHRhZyxcclxuICAgICAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IHRhcmdldCxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogKGF0dHJpYnV0ZXMgfHwgW10pLm1hcChmdW5jdGlvbiAoYXR0cmlidXRlTmFtZSkgeyByZXR1cm4gKHsgYXR0cmlidXRlTmFtZTogYXR0cmlidXRlTmFtZSB9KTsgfSksXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IChwcm9wZXJ0aWVzIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkgeyByZXR1cm4gKHsgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUgfSk7IH0pLFxyXG4gICAgICAgICAgICBldmVudHM6IChldmVudHMgfHwgW10pLm1hcChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7IHJldHVybiAoe1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6IHByb3BlcnR5TmFtZS5yZXBsYWNlKCdvbicsICcnKS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIH0pOyB9KSxcclxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb246IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jdXN0b21FbGVtZW50ID0gY3VzdG9tRWxlbWVudDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gY3VzdG9tRWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb2Ygd2hpY2ggdGhlIGRpZmYgZnVuY3Rpb24gaXMgYXBwbGllZFxyXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXHJcbiAqIEBwYXJhbSBkaWZmRnVuY3Rpb24gIEEgZGlmZiBmdW5jdGlvbiB0byBydW4gaWYgZGlmZlR5cGUgaWYgRGlmZlR5cGUuQ1VTVE9NXHJcbiAqL1xyXG5mdW5jdGlvbiBkaWZmUHJvcGVydHkocHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24sIHJlYWN0aW9uRnVuY3Rpb24pIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKFwiZGlmZlByb3BlcnR5OlwiICsgcHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24uYmluZChudWxsKSk7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignZGlmZlJlYWN0aW9uJywge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbjogcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogcmVhY3Rpb25GdW5jdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRpZmZQcm9wZXJ0eSA9IGRpZmZQcm9wZXJ0eTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZGlmZlByb3BlcnR5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogR2VuZXJpYyBkZWNvcmF0b3IgaGFuZGxlciB0byB0YWtlIGNhcmUgb2Ygd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgY2FsbGVkIGF0IHRoZSBjbGFzcyBsZXZlbFxyXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxyXG4gKlxyXG4gKiBAcGFyYW0gaGFuZGxlclxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlRGVjb3JhdG9yKGhhbmRsZXIpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LnByb3RvdHlwZSwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmhhbmRsZURlY29yYXRvciA9IGhhbmRsZURlY29yYXRvcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFuZGxlRGVjb3JhdG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG52YXIgYmVmb3JlUHJvcGVydGllc18xID0gcmVxdWlyZShcIi4vYmVmb3JlUHJvcGVydGllc1wiKTtcclxuLyoqXHJcbiAqIE1hcCBvZiBpbnN0YW5jZXMgYWdhaW5zdCByZWdpc3RlcmVkIGluamVjdG9ycy5cclxuICovXHJcbnZhciByZWdpc3RlcmVkSW5qZWN0b3JzTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxyXG4gKiBjYWxscyB0aGUgYGdldFByb3BlcnRpZXNgIGZ1bmN0aW9uIHdpdGggdGhlIHBheWxvYWQgZnJvbSB0aGUgaW5qZWN0b3JcclxuICogYW5kIGN1cnJlbnQgcHJvcGVydGllcyB3aXRoIHRoZSB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcyByZXR1cm5lZC5cclxuICpcclxuICogQHBhcmFtIEluamVjdENvbmZpZyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIGluamVjdChfYSkge1xyXG4gICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBnZXRQcm9wZXJ0aWVzID0gX2EuZ2V0UHJvcGVydGllcztcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICBiZWZvcmVQcm9wZXJ0aWVzXzEuYmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgaW5qZWN0b3IgPSB0aGlzLnJlZ2lzdHJ5LmdldEluamVjdG9yKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW5qZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZWdpc3RlcmVkSW5qZWN0b3JzID0gcmVnaXN0ZXJlZEluamVjdG9yc01hcC5nZXQodGhpcykgfHwgW107XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLnNldCh0aGlzLCByZWdpc3RlcmVkSW5qZWN0b3JzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmluZGV4T2YoaW5qZWN0b3IpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluamVjdG9yLm9uKCdpbnZhbGlkYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yLmdldCgpLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKHRhcmdldCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmluamVjdCA9IGluamVjdDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5qZWN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5hbHdheXMgPSBhbHdheXM7XHJcbmZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5pZ25vcmUgPSBpZ25vcmU7XHJcbmZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcbmZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgICB2YXIgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xyXG4gICAgdmFyIHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcclxuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogY2hhbmdlZCxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5zaGFsbG93ID0gc2hhbGxvdztcclxuZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFJlZ2lzdHJ5XzEuV0lER0VUX0JBU0VfVFlQRSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmF1dG8gPSBhdXRvO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgbGFuZ18yID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvbGFuZ1wiKTtcclxudmFyIGNzc1RyYW5zaXRpb25zXzEgPSByZXF1aXJlKFwiLi4vYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9uc1wiKTtcclxudmFyIGFmdGVyUmVuZGVyXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vLi4vZFwiKTtcclxudmFyIHZkb21fMSA9IHJlcXVpcmUoXCIuLy4uL3Zkb21cIik7XHJcbnJlcXVpcmUoXCJwZXBqc1wiKTtcclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIGF0dGFjaCBzdGF0ZSBvZiB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgUHJvamVjdG9yQXR0YWNoU3RhdGU7XHJcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiQXR0YWNoZWRcIl0gPSAxXSA9IFwiQXR0YWNoZWRcIjtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiRGV0YWNoZWRcIl0gPSAyXSA9IFwiRGV0YWNoZWRcIjtcclxufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgPSBleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlIHx8IChleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEF0dGFjaCB0eXBlIGZvciB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgQXR0YWNoVHlwZTtcclxuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJBcHBlbmRcIl0gPSAxXSA9IFwiQXBwZW5kXCI7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJNZXJnZVwiXSA9IDJdID0gXCJNZXJnZVwiO1xyXG59KShBdHRhY2hUeXBlID0gZXhwb3J0cy5BdHRhY2hUeXBlIHx8IChleHBvcnRzLkF0dGFjaFR5cGUgPSB7fSkpO1xyXG5mdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgUHJvamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFByb2plY3RvciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliXzEuX19zcHJlYWQoYXJncykpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9oYW5kbGVzID0gW107XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc18xLmRlZmF1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgX3RoaXMucm9vdCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxyXG4gICAgICAgICAgICAgICAgcm9vdDogcm9vdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5NZXJnZSxcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcImFzeW5jXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGFzeW5jKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2FuZGJveCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGRvYyA9PT0gdm9pZCAwKSB7IGRvYyA9IGRvY3VtZW50OyB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgLyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXHJcbiAgICAgICAgICAgIHRoaXMub3duKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKHtcclxuICAgICAgICAgICAgICAgIC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cclxuICAgICAgICAgICAgICAgIHJvb3Q6IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2V0Q2hpbGRyZW4gPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBsYW5nXzEuYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldENvcmVQcm9wZXJ0aWVzX18uY2FsbCh0aGlzLCB7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldFByb3BlcnRpZXNfXy5jYWxsKHRoaXMsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS50b0h0bWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgaXMgbm90IGF0dGFjaGVkLCBjYW5ub3QgcmV0dXJuIGFuIEhUTUwgc3RyaW5nIG9mIHByb2plY3Rpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb24uZG9tTm9kZS5jaGlsZE5vZGVzWzBdLm91dGVySFRNTDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuYWZ0ZXJSZW5kZXIgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gZF8xLnYoJ3NwYW4nLCB7fSwgW3Jlc3VsdF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5vd24gPSBmdW5jdGlvbiAoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5fYXR0YWNoID0gZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gX2EudHlwZSwgcm9vdCA9IF9hLnJvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQ7XHJcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoSGFuZGxlID0gbGFuZ18yLmNyZWF0ZUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zLCB7IHN5bmM6ICF0aGlzLl9hc3luYyB9KTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuQXBwZW5kOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSB2ZG9tXzEuZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdmRvbV8xLmRvbS5tZXJnZSh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJfMS5hZnRlclJlbmRlcigpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3RvcjtcclxuICAgIH0oQmFzZSkpO1xyXG4gICAgcmV0dXJuIFByb2plY3RvcjtcclxufVxyXG5leHBvcnRzLlByb2plY3Rvck1peGluID0gUHJvamVjdG9yTWl4aW47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByb2plY3Rvck1peGluO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBJbmplY3Rvcl8xID0gcmVxdWlyZShcIi4vLi4vSW5qZWN0b3JcIik7XHJcbnZhciBpbmplY3RfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvaW5qZWN0XCIpO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGRpZmZQcm9wZXJ0eV8xID0gcmVxdWlyZShcIi4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHlcIik7XHJcbnZhciBkaWZmXzEgPSByZXF1aXJlKFwiLi8uLi9kaWZmXCIpO1xyXG52YXIgVEhFTUVfS0VZID0gJyBfa2V5JztcclxuZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgZm9yIGJhc2UgY3NzIGNsYXNzZXNcclxuICovXHJcbmZ1bmN0aW9uIHRoZW1lKHRoZW1lKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJywgdGhlbWUpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy50aGVtZSA9IHRoZW1lO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XHJcbiAqIEByZXF1aXJlc1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXMpIHtcclxuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZShmdW5jdGlvbiAoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzc05hbWVzW2Jhc2VDbGFzc1trZXldXSA9IGtleTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XHJcbiAgICB9LCB7fSk7XHJcbn1cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxyXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxyXG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXHJcbiAqIHRvIHRoZSBnbG9iYWwgcmVnaXN0cnlcclxuICpcclxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lLCB0aGVtZVJlZ2lzdHJ5KSB7XHJcbiAgICB2YXIgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcl8xLkluamVjdG9yKHRoZW1lKTtcclxuICAgIHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksIHRoZW1lSW5qZWN0b3IpO1xyXG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XHJcbn1cclxuZXhwb3J0cy5yZWdpc3RlclRoZW1lSW5qZWN0b3IgPSByZWdpc3RlclRoZW1lSW5qZWN0b3I7XHJcbi8qKlxyXG4gKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjbGFzcyBkZWNvcmF0ZWQgd2l0aCB3aXRoIFRoZW1lZCBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5mdW5jdGlvbiBUaGVtZWRNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgVGhlbWVkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFRoZW1lZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUaGVtZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBfdGhpcy5fdGhlbWUgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLnRoZW1lID0gZnVuY3Rpb24gKGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMubWFwKGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRnVuY3Rpb24gZmlyZWQgd2hlbiBgdGhlbWVgIG9yIGBleHRyYUNsYXNzZXNgIGFyZSBjaGFuZ2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUub25Qcm9wZXJ0aWVzQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUuX2dldFRoZW1lQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCB8fCBjbGFzc05hbWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwge307XHJcbiAgICAgICAgICAgIHZhciB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRDbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNsYXNzIG5hbWU6ICdcIiArIGNsYXNzTmFtZSArIFwiJyBub3QgZm91bmQgaW4gdGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLnRoZW1lLCB0aGVtZSA9IF9hID09PSB2b2lkIDAgPyB7fSA6IF9hO1xyXG4gICAgICAgICAgICB2YXIgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSA9IGJhc2VUaGVtZXMucmVkdWNlKGZ1bmN0aW9uIChmaW5hbEJhc2VUaGVtZSwgYmFzZVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gVEhFTUVfS0VZLCBrZXkgPSBiYXNlVGhlbWVbX2FdLCBjbGFzc2VzID0gdHNsaWJfMS5fX3Jlc3QoYmFzZVRoZW1lLCBbdHlwZW9mIF9hID09PSBcInN5bWJvbFwiID8gX2EgOiBfYSArIFwiXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cCA9IGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChiYXNlVGhlbWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZShmdW5jdGlvbiAoYmFzZVRoZW1lLCB0aGVtZUtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGJhc2VUaGVtZSwgdGhlbWVbdGhlbWVLZXldKTtcclxuICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgndGhlbWUnLCBkaWZmXzEuc2hhbGxvdyksXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgZGlmZl8xLnNoYWxsb3cpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFRoZW1lZC5wcm90b3R5cGUsIFwib25Qcm9wZXJ0aWVzQ2hhbmdlZFwiLCBudWxsKTtcclxuICAgICAgICBUaGVtZWQgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBpbmplY3RfMS5pbmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksXHJcbiAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0aWVzOiBmdW5jdGlvbiAodGhlbWUsIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMudGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdGhlbWU6IHRoZW1lIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdLCBUaGVtZWQpO1xyXG4gICAgICAgIHJldHVybiBUaGVtZWQ7XHJcbiAgICB9KEJhc2UpKTtcclxuICAgIHJldHVybiBUaGVtZWQ7XHJcbn1cclxuZXhwb3J0cy5UaGVtZWRNaXhpbiA9IFRoZW1lZE1peGluO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUaGVtZWRNaXhpbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgY3VzdG9tRWxlbWVudHNfMSA9IHJlcXVpcmUoXCIuL2N1c3RvbUVsZW1lbnRzXCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgYSBjdXN0b20gZWxlbWVudCB1c2luZyB0aGUgdjEgc3BlYyBvZiBjdXN0b20gZWxlbWVudHMuIE5vdGUgdGhhdFxyXG4gKiB0aGlzIGlzIHRoZSBkZWZhdWx0IGV4cG9ydCwgYW5kLCBleHBlY3RzIHRoZSBwcm9wb3NhbCB0byB3b3JrIGluIHRoZSBicm93c2VyLlxyXG4gKiBUaGlzIHdpbGwgbGlrZWx5IHJlcXVpcmUgdGhlIHBvbHlmaWxsIGFuZCBuYXRpdmUgc2hpbS5cclxuICpcclxuICogQHBhcmFtIGRlc2NyaXB0b3JGYWN0b3J5XHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVzY3JpcHRvckZhY3RvcnkpIHtcclxuICAgIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckZhY3RvcnkoKTtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShkZXNjcmlwdG9yLnRhZ05hbWUsIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhjbGFzc18xLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNsYXNzXzEoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9pc0FwcGVuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF90aGlzLl9hcHBlbmRlciA9IGN1c3RvbUVsZW1lbnRzXzEuaW5pdGlhbGl6ZUVsZW1lbnQoX3RoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLmNvbm5lY3RlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzQXBwZW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0FwcGVuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgY3VzdG9tRWxlbWVudHNfMS5jdXN0b21FdmVudENsYXNzKCdjb25uZWN0ZWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBjdXN0b21FbGVtZW50c18xLmhhbmRsZUF0dHJpYnV0ZUNoYW5nZWQodGhpcywgbmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLmdldFdpZGdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkZ2V0SW5zdGFuY2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5zZXRXaWRnZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICh3aWRnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fd2lkZ2V0SW5zdGFuY2UgPSB3aWRnZXQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5nZXRXaWRnZXRDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVzY3JpcHRvcigpLndpZGdldENvbnN0cnVjdG9yO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuZ2V0RGVzY3JpcHRvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xhc3NfMSwgXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZGVzY3JpcHRvci5hdHRyaWJ1dGVzIHx8IFtdKS5tYXAoZnVuY3Rpb24gKGF0dHJpYnV0ZSkgeyByZXR1cm4gYXR0cmlidXRlLmF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTsgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjbGFzc18xO1xyXG4gICAgfShIVE1MRWxlbWVudCkpKTtcclxufVxyXG5leHBvcnRzLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudCA9IHJlZ2lzdGVyQ3VzdG9tRWxlbWVudDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gcmVnaXN0ZXJDdXN0b21FbGVtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIi4vLi4vV2lkZ2V0QmFzZVwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCIuLy4uL2RcIik7XHJcbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlLnRhZ05hbWU7XHJcbn1cclxuZnVuY3Rpb24gRG9tV3JhcHBlcihkb21Ob2RlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxyXG4gICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhEb21XcmFwcGVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIERvbVdyYXBwZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgRG9tV3JhcHBlci5wcm90b3R5cGUuX19yZW5kZXJfXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZOb2RlID0gX3N1cGVyLnByb3RvdHlwZS5fX3JlbmRlcl9fLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIHZOb2RlLmRvbU5vZGUgPSBkb21Ob2RlO1xyXG4gICAgICAgICAgICByZXR1cm4gdk5vZGU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBEb21XcmFwcGVyLnByb3RvdHlwZS5vbkF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5vbkF0dGFjaGVkICYmIG9wdGlvbnMub25BdHRhY2hlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgRG9tV3JhcHBlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMucHJvcGVydGllcywgeyBrZXk6ICdyb290JyB9KTtcclxuICAgICAgICAgICAgdmFyIHRhZyA9IGlzRWxlbWVudChkb21Ob2RlKSA/IGRvbU5vZGUudGFnTmFtZSA6ICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZF8xLnYodGFnLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBEb21XcmFwcGVyO1xyXG4gICAgfShXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSkpO1xyXG59XHJcbmV4cG9ydHMuRG9tV3JhcHBlciA9IERvbVdyYXBwZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERvbVdyYXBwZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdXRpbC9Eb21XcmFwcGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS91dGlsL0RvbVdyYXBwZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIGFycmF5XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9hcnJheVwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCIuL2RcIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBXZWFrTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9XZWFrTWFwXCIpO1xyXG52YXIgTkFNRVNQQUNFX1czID0gJ2h0dHA6Ly93d3cudzMub3JnLyc7XHJcbnZhciBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcclxudmFyIE5BTUVTUEFDRV9YTElOSyA9IE5BTUVTUEFDRV9XMyArICcxOTk5L3hsaW5rJztcclxudmFyIGVtcHR5QXJyYXkgPSBbXTtcclxuZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG52YXIgaW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxudmFyIHJlbmRlclF1ZXVlTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbmZ1bmN0aW9uIHNhbWUoZG5vZGUxLCBkbm9kZTIpIHtcclxuICAgIGlmIChkXzEuaXNWTm9kZShkbm9kZTEpICYmIGRfMS5pc1ZOb2RlKGRub2RlMikpIHtcclxuICAgICAgICBpZiAoZG5vZGUxLnRhZyAhPT0gZG5vZGUyLnRhZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZF8xLmlzV05vZGUoZG5vZGUxKSAmJiBkXzEuaXNXTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGRub2RlMS53aWRnZXRDb25zdHJ1Y3RvciAhPT0gZG5vZGUyLndpZGdldENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxudmFyIG1pc3NpbmdUcmFuc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGEgdHJhbnNpdGlvbnMgb2JqZWN0IHRvIHRoZSBwcm9qZWN0aW9uT3B0aW9ucyB0byBkbyBhbmltYXRpb25zJyk7XHJcbn07XHJcbmZ1bmN0aW9uIGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rvck9wdGlvbnMsIHByb2plY3Rvckluc3RhbmNlKSB7XHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc3R5bGVBcHBseWVyOiBmdW5jdGlvbiAoZG9tTm9kZSwgc3R5bGVOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLnN0eWxlW3N0eWxlTmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zaXRpb25zOiB7XHJcbiAgICAgICAgICAgIGVudGVyOiBtaXNzaW5nVHJhbnNpdGlvbixcclxuICAgICAgICAgICAgZXhpdDogbWlzc2luZ1RyYW5zaXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzOiBbXSxcclxuICAgICAgICBhZnRlclJlbmRlckNhbGxiYWNrczogW10sXHJcbiAgICAgICAgbm9kZU1hcDogbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCksXHJcbiAgICAgICAgZGVwdGg6IDAsXHJcbiAgICAgICAgbWVyZ2U6IGZhbHNlLFxyXG4gICAgICAgIHJlbmRlclNjaGVkdWxlZDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHJlbmRlclF1ZXVlOiBbXSxcclxuICAgICAgICBwcm9qZWN0b3JJbnN0YW5jZTogcHJvamVjdG9ySW5zdGFuY2VcclxuICAgIH07XHJcbiAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgZGVmYXVsdHMsIHByb2plY3Rvck9wdGlvbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRXZlbnRzKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJldmlvdXNQcm9wZXJ0aWVzKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBwcmV2aW91c1Byb3BlcnRpZXMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNbcHJvcE5hbWVdO1xyXG4gICAgdmFyIGV2ZW50TmFtZSA9IHByb3BOYW1lLnN1YnN0cigyKTtcclxuICAgIHZhciBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpIHx8IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICB2YXIgcHJldmlvdXNFdmVudCA9IGV2ZW50TWFwLmdldChwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICBkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcmV2aW91c0V2ZW50KTtcclxuICAgIH1cclxuICAgIHZhciBjYWxsYmFjayA9IGN1cnJlbnRWYWx1ZS5iaW5kKHByb3BlcnRpZXMuYmluZCk7XHJcbiAgICBpZiAoZXZlbnROYW1lID09PSAnaW5wdXQnKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZS5jYWxsKHRoaXMsIGV2dCk7XHJcbiAgICAgICAgICAgIGV2dC50YXJnZXRbJ29uaW5wdXQtdmFsdWUnXSA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgfS5iaW5kKHByb3BlcnRpZXMuYmluZCk7XHJcbiAgICB9XHJcbiAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XHJcbiAgICBldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIHZhciBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgY2xhc3Nlcykge1xyXG4gICAgaWYgKGNsYXNzZXMpIHtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBmb2N1c05vZGUocHJvcFZhbHVlLCBwcmV2aW91c1ZhbHVlLCBkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcHJvcFZhbHVlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUgJiYgIXByZXZpb3VzVmFsdWU7XHJcbiAgICB9XHJcbiAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuZm9jdXMoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzKGRvbU5vZGUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICB2YXIgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcclxuICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XHJcbiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzZXMnKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSA/IHByb3BWYWx1ZSA6IFtwcm9wVmFsdWVdO1xyXG4gICAgICAgICAgICBpZiAoIWRvbU5vZGUuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTmFtZSA9IGN1cnJlbnRDbGFzc2VzLmpvaW4oJyAnKS50cmltKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzEgPSAwOyBpXzEgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGlfMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjdXJyZW50Q2xhc3Nlc1tpXzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2ZvY3VzJykge1xyXG4gICAgICAgICAgICBmb2N1c05vZGUocHJvcFZhbHVlLCBmYWxzZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcclxuICAgICAgICAgICAgdmFyIHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgIT09ICdrZXknICYmIHByb3BWYWx1ZSAhPT0gbnVsbCAmJiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ3ZhbHVlJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgdmFyIGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSk7XHJcbiAgICBpZiAoZXZlbnRNYXApIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGV2ZW50TWFwLmdldChwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHByb3BOYW1lLnN1YnN0cigyKSwgZXZlbnRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBwcm9wZXJ0aWVzVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG4gICAgdmFyIHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XHJcbiAgICBpZiAocHJvcE5hbWVzLmluZGV4T2YoJ2NsYXNzZXMnKSA9PT0gLTEgJiYgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3NlcykpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xyXG4gICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcclxuICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XHJcbiAgICAgICAgdmFyIHByZXZpb3VzVmFsdWUgPSBwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzZXMnKSB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c0NsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByZXZpb3VzVmFsdWUpID8gcHJldmlvdXNWYWx1ZSA6IFtwcmV2aW91c1ZhbHVlXTtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpID8gcHJvcFZhbHVlIDogW3Byb3BWYWx1ZV07XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcFZhbHVlIHx8IHByb3BWYWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzIgPSAwOyBpXzIgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpXzIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXzJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Q2xhc3NlcyA9IHRzbGliXzEuX19zcHJlYWQoY3VycmVudENsYXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMyA9IDA7IGlfMyA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGlfMysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c0NsYXNzTmFtZSA9IHByZXZpb3VzQ2xhc3Nlc1tpXzNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc0luZGV4ID0gbmV3Q2xhc3Nlcy5pbmRleE9mKHByZXZpb3VzQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2xhc3Nlcy5zcGxpY2UoY2xhc3NJbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV80ID0gMDsgaV80IDwgbmV3Q2xhc3Nlcy5sZW5ndGg7IGlfNCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgbmV3Q2xhc3Nlc1tpXzRdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzUgPSAwOyBpXzUgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGlfNSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjdXJyZW50Q2xhc3Nlc1tpXzVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2ZvY3VzJykge1xyXG4gICAgICAgICAgICBmb2N1c05vZGUocHJvcFZhbHVlLCBwcmV2aW91c1ZhbHVlLCBkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xyXG4gICAgICAgICAgICB2YXIgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3R5bGVDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdTdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkU3R5bGVWYWx1ZSA9IHByZXZpb3VzVmFsdWVbc3R5bGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdTdHlsZVZhbHVlID09PSBvbGRTdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3R5bGVWYWx1ZShuZXdTdHlsZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgJiYgdHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wVmFsdWUgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICd2YWx1ZScpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb21WYWx1ZSA9IGRvbU5vZGVbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbVZhbHVlICE9PSBwcm9wVmFsdWUgJiZcclxuICAgICAgICAgICAgICAgICAgICAoZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZG9tVmFsdWUgPT09IGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ10gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBwcmV2aW91c1Byb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRyAmJiBwcm9wTmFtZSA9PT0gJ2hyZWYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdyb2xlJyAmJiBwcm9wVmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUucmVtb3ZlQXR0cmlidXRlKHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21Ob2RlW3Byb3BOYW1lXSAhPT0gcHJvcFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXBhcmlzb24gaXMgaGVyZSBmb3Igc2lkZS1lZmZlY3RzIGluIEVkZ2Ugd2l0aCBzY3JvbGxMZWZ0IGFuZCBzY3JvbGxUb3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRJbmRleE9mQ2hpbGQoY2hpbGRyZW4sIHNhbWVBcywgc3RhcnQpIHtcclxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHNhbWUoY2hpbGRyZW5baV0sIHNhbWVBcykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59XHJcbmZ1bmN0aW9uIHRvUGFyZW50Vk5vZGUoZG9tTm9kZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6ICcnLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZG9tTm9kZTogZG9tTm9kZSxcclxuICAgICAgICB0eXBlOiBkXzEuVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy50b1BhcmVudFZOb2RlID0gdG9QYXJlbnRWTm9kZTtcclxuZnVuY3Rpb24gdG9UZXh0Vk5vZGUoZGF0YSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6ICcnLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdGV4dDogXCJcIiArIGRhdGEsXHJcbiAgICAgICAgZG9tTm9kZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHR5cGU6IGRfMS5WTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnRvVGV4dFZOb2RlID0gdG9UZXh0Vk5vZGU7XHJcbmZ1bmN0aW9uIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcclxuICAgICAgICByZW5kZXJlZDogW10sXHJcbiAgICAgICAgY29yZVByb3BlcnRpZXM6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyxcclxuICAgICAgICBjaGlsZHJlbjogaW5zdGFuY2UuY2hpbGRyZW4sXHJcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IGluc3RhbmNlLmNvbnN0cnVjdG9yLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMsXHJcbiAgICAgICAgdHlwZTogZF8xLldOT0RFXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGRyZW4sIGluc3RhbmNlKSB7XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiBlbXB0eUFycmF5O1xyXG4gICAgfVxyXG4gICAgY2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5baV0gPSB0b1RleHRWTm9kZShjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQucHJvcGVydGllcy5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZC5jb3JlUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuY29yZVByb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IGluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUmVnaXN0cnk6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG59XHJcbmV4cG9ydHMuZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW47XHJcbmZ1bmN0aW9uIG5vZGVBZGRlZChkbm9kZSwgdHJhbnNpdGlvbnMpIHtcclxuICAgIGlmIChkXzEuaXNWTm9kZShkbm9kZSkgJiYgZG5vZGUucHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBlbnRlckFuaW1hdGlvbiA9IGRub2RlLnByb3BlcnRpZXMuZW50ZXJBbmltYXRpb247XHJcbiAgICAgICAgaWYgKGVudGVyQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW50ZXJBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGVudGVyQW5pbWF0aW9uKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMuZW50ZXIoZG5vZGUuZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNhbGxPbkRldGFjaChkTm9kZXMsIHBhcmVudEluc3RhbmNlKSB7XHJcbiAgICBkTm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBkTm9kZXMgOiBbZE5vZGVzXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGROb2RlID0gZE5vZGVzW2ldO1xyXG4gICAgICAgIGlmIChkXzEuaXNXTm9kZShkTm9kZSkpIHtcclxuICAgICAgICAgICAgaWYgKGROb2RlLnJlbmRlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2goZE5vZGUucmVuZGVyZWQsIGROb2RlLmluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZE5vZGUuaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChkTm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURhdGEub25EZXRhY2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGROb2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2goZE5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGUsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKGRfMS5pc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIHZhciByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZW5kZXJlZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSByZW5kZXJlZFtpXTtcclxuICAgICAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNoaWxkLmRvbU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKGNoaWxkLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGRvbU5vZGVfMSA9IGRub2RlLmRvbU5vZGU7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBkbm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciBleGl0QW5pbWF0aW9uID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICYmIGV4aXRBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgZG9tTm9kZV8xLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIHZhciByZW1vdmVEb21Ob2RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZV8xICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGVfMSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhpdEFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZXhpdEFuaW1hdGlvbihkb21Ob2RlXzEsIHJlbW92ZURvbU5vZGUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMuZXhpdChkbm9kZS5kb21Ob2RlLCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uLCByZW1vdmVEb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkb21Ob2RlXzEgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZV8xKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjaGVja0Rpc3Rpbmd1aXNoYWJsZShjaGlsZE5vZGVzLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKSB7XHJcbiAgICB2YXIgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xyXG4gICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkTm9kZSkgJiYgIWNoaWxkTm9kZS50YWcpIHtcclxuICAgICAgICByZXR1cm47IC8vIFRleHQgbm9kZXMgbmVlZCBub3QgYmUgZGlzdGluZ3Vpc2hhYmxlXHJcbiAgICB9XHJcbiAgICB2YXIga2V5ID0gY2hpbGROb2RlLnByb3BlcnRpZXMua2V5O1xyXG4gICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVJZGVudGlmaWVyID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50SW5zdGFuY2UuY29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRfMS5pc1dOb2RlKGNoaWxkTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUud2lkZ2V0Q29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkEgd2lkZ2V0IChcIiArIHBhcmVudE5hbWUgKyBcIikgaGFzIGhhZCBhIGNoaWxkIGFkZGRlZCBvciByZW1vdmVkLCBidXQgdGhleSB3ZXJlIG5vdCBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZpZWQuIEl0IGlzIHJlY29tbWVuZGVkIHRvIHByb3ZpZGUgYSB1bmlxdWUgJ2tleScgcHJvcGVydHkgd2hlbiB1c2luZyB0aGUgc2FtZSB3aWRnZXQgb3IgZWxlbWVudCAoXCIgKyBub2RlSWRlbnRpZmllciArIFwiKSBtdWx0aXBsZSB0aW1lcyBhcyBzaWJsaW5nc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZSwgb2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIG9sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcclxuICAgIG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XHJcbiAgICB2YXIgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRDaGlsZHJlbi5sZW5ndGg7XHJcbiAgICB2YXIgbmV3Q2hpbGRyZW5MZW5ndGggPSBuZXdDaGlsZHJlbi5sZW5ndGg7XHJcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucztcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIHZhciBvbGRJbmRleCA9IDA7XHJcbiAgICB2YXIgbmV3SW5kZXggPSAwO1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5bbmV3SW5kZXhdO1xyXG4gICAgICAgIGlmIChkXzEuaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkLmluc2VydGVkID0gZF8xLmlzVk5vZGUob2xkQ2hpbGQpICYmIG9sZENoaWxkLmluc2VydGVkO1xyXG4gICAgICAgICAgICBhZGREZWZlcnJlZFByb3BlcnRpZXMobmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdXBkYXRlRG9tKG9sZENoaWxkLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHwgdGV4dFVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZmluZE9sZEluZGV4ID0gZmluZEluZGV4T2ZDaGlsZChvbGRDaGlsZHJlbiwgbmV3Q2hpbGQsIG9sZEluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgIGlmIChmaW5kT2xkSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9sb29wXzIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZENoaWxkXzEgPSBvbGRDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKG9sZENoaWxkXzEsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBvbGRJbmRleDsgaSA8IGZpbmRPbGRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xvb3BfMigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZURvbShvbGRDaGlsZHJlbltmaW5kT2xkSW5kZXhdLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQ7XHJcbiAgICAgICAgICAgICAgICBvbGRJbmRleCA9IGZpbmRPbGRJbmRleCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0QmVmb3JlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRJbmRleCA9IG9sZEluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRfMS5pc1dOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLnJlbmRlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5yZW5kZXJlZFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9sZENoaWxkcmVuW25leHRJbmRleF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IG9sZENoaWxkcmVuW25leHRJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZSA9IGNoaWxkLmRvbU5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleFRvQ2hlY2tfMSA9IG5ld0luZGV4O1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVja18xLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgfTtcclxuICAgIHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XHJcbiAgICAgICAgX2xvb3BfMSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9sZENoaWxkcmVuTGVuZ3RoID4gb2xkSW5kZXgpIHtcclxuICAgICAgICB2YXIgX2xvb3BfMyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG9sZENoaWxkID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvQ2hlY2sgPSBpO1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xyXG4gICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBfbG9vcF8zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHRVcGRhdGVkO1xyXG59XHJcbmZ1bmN0aW9uIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBjaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpIHtcclxuICAgIGlmIChpbnNlcnRCZWZvcmUgPT09IHZvaWQgMCkgeyBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQ7IH1cclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNoaWxkTm9kZXMgPSBhcnJheV8xLmZyb20ocGFyZW50Vk5vZGUuZG9tTm9kZS5jaGlsZE5vZGVzKTtcclxuICAgIH1cclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjaGlsZC5kb21Ob2RlID09PSB1bmRlZmluZWQgJiYgY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tRWxlbWVudCA9IGNoaWxkTm9kZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tRWxlbWVudCAmJiBkb21FbGVtZW50LnRhZ05hbWUgPT09IChjaGlsZC50YWcudG9VcHBlckNhc2UoKSB8fCB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmRvbU5vZGUgPSBkb21FbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgYWRkQ2hpbGRyZW4oZG5vZGUsIGRub2RlLmNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIHVuZGVmaW5lZCk7XHJcbiAgICBpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nICYmIGRub2RlLmluc2VydGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhZGREZWZlcnJlZFByb3BlcnRpZXMoZG5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIHNldFByb3BlcnRpZXMoZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgaWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgXCJcIiArIGRub2RlLnByb3BlcnRpZXMua2V5KTtcclxuICAgIH1cclxuICAgIGRub2RlLmluc2VydGVkID0gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcykge1xyXG4gICAgdmFyIGRvbU5vZGU7XHJcbiAgICBpZiAoZF8xLmlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgdmFyIHdpZGdldENvbnN0cnVjdG9yID0gZG5vZGUud2lkZ2V0Q29uc3RydWN0b3I7XHJcbiAgICAgICAgdmFyIHBhcmVudEluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICBpZiAoIVJlZ2lzdHJ5XzEuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3Iod2lkZ2V0Q29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcGFyZW50SW5zdGFuY2VEYXRhLnJlZ2lzdHJ5KCkuZ2V0KHdpZGdldENvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvciA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbnN0YW5jZV8xID0gbmV3IHdpZGdldENvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZV8xO1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGFfMSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlXzEpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YV8xLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2U6IGluc3RhbmNlXzEsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCB9KTtcclxuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICBpbnN0YW5jZV8xLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XHJcbiAgICAgICAgaW5zdGFuY2VfMS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGluc3RhbmNlXzEuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gaW5zdGFuY2VfMS5fX3JlbmRlcl9fKCk7XHJcbiAgICAgICAgaWYgKHJlbmRlcmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZFJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2VfMSk7XHJcbiAgICAgICAgICAgIGRub2RlLnJlbmRlcmVkID0gZmlsdGVyZWRSZW5kZXJlZDtcclxuICAgICAgICAgICAgYWRkQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIGZpbHRlcmVkUmVuZGVyZWQsIHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZV8xLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2VfMSwgeyBkbm9kZTogZG5vZGUsIHBhcmVudFZOb2RlOiBwYXJlbnRWTm9kZSB9KTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5ub2RlSGFuZGxlci5hZGRSb290KCk7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YV8xLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZG9jID0gcGFyZW50Vk5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50O1xyXG4gICAgICAgIGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkICYmIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRub2RlLmRvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUuZG9tTm9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG5vZGUudGFnID09PSAnc3ZnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlRWxlbWVudE5TKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSwgZG5vZGUudGFnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChkbm9kZS50YWcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSAhPT0gcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVEb20ocHJldmlvdXMsIGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB7XHJcbiAgICBpZiAoZF8xLmlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gcHJldmlvdXMuaW5zdGFuY2U7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHZhciBfYSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSksIHBhcmVudFZOb2RlXzEgPSBfYS5wYXJlbnRWTm9kZSwgbm9kZSA9IF9hLmRub2RlO1xyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNSZW5kZXJlZCA9IG5vZGUgPyBub2RlLnJlbmRlcmVkIDogcHJldmlvdXMucmVuZGVyZWQ7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGU6IGRub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGVfMSB9KTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5kaXJ0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZV8xLCBwcmV2aW91c1JlbmRlcmVkLCBkbm9kZS5yZW5kZXJlZCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRub2RlLnJlbmRlcmVkID0gcHJldmlvdXNSZW5kZXJlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZG9tTm9kZSA9IChkbm9kZS5kb21Ob2RlID0gcHJldmlvdXMuZG9tTm9kZSk7XHJcbiAgICAgICAgdmFyIHRleHRVcGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRleHQgIT09IHByZXZpb3VzLnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdEb21Ob2RlID0gZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xyXG4gICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHRVcGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUudGFnICYmIGRub2RlLnRhZy5sYXN0SW5kZXhPZignc3ZnJywgMCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW91cy5jaGlsZHJlbiAhPT0gZG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVDaGlsZHJlbihkbm9kZSwgcHJldmlvdXMuY2hpbGRyZW4sIGNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXBkYXRlZCA9IHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXMucHJvcGVydGllcywgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBcIlwiICsgZG5vZGUucHJvcGVydGllcy5rZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1cGRhdGVkICYmIGRub2RlLnByb3BlcnRpZXMgJiYgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJldmlvdXMucHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGFkZERlZmVycmVkUHJvcGVydGllcyh2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIC8vIHRyYW5zZmVyIGFueSBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBiZWVuIHBhc3NlZCAtIGFzIHRoZXNlIG11c3QgYmUgZGVjb3JhdGVkIHByb3BlcnRpZXNcclxuICAgIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyA9IHZub2RlLnByb3BlcnRpZXM7XHJcbiAgICB2YXIgcHJvcGVydGllcyA9IHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpO1xyXG4gICAgdm5vZGUucHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMsIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXModm5vZGUuZG9tTm9kZSwgdm5vZGUucHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHZub2RlLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgICAgICB3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0SWRsZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcclxuICAgIHZhciByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICB2YXIgcmVuZGVycyA9IHRzbGliXzEuX19zcHJlYWQocmVuZGVyUXVldWUpO1xyXG4gICAgcmVuZGVyUXVldWVNYXAuc2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlLCBbXSk7XHJcbiAgICByZW5kZXJzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuZGVwdGggLSBiLmRlcHRoOyB9KTtcclxuICAgIHdoaWxlIChyZW5kZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHJlbmRlcnMuc2hpZnQoKS5pbnN0YW5jZTtcclxuICAgICAgICB2YXIgX2EgPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpLCBwYXJlbnRWTm9kZSA9IF9hLnBhcmVudFZOb2RlLCBkbm9kZSA9IF9hLmRub2RlO1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgdXBkYXRlRG9tKGRub2RlLCB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSksIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xyXG4gICAgfVxyXG4gICAgcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xyXG59XHJcbmV4cG9ydHMuZG9tID0ge1xyXG4gICAgYXBwZW5kOiBmdW5jdGlvbiAocGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zID09PSB2b2lkIDApIHsgcHJvamVjdGlvbk9wdGlvbnMgPSB7fTsgfVxyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgdmFyIGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gcGFyZW50Tm9kZTtcclxuICAgICAgICB2YXIgcGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSk7XHJcbiAgICAgICAgdmFyIHJlbmRlclF1ZXVlID0gW107XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgcmVuZGVyUXVldWVNYXAuc2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgcmVuZGVyUXVldWUpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJRdWV1ZV8xID0gcmVuZGVyUXVldWVNYXAuZ2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJRdWV1ZV8xLnB1c2goeyBpbnN0YW5jZTogaW5zdGFuY2UsIGRlcHRoOiBmaW5hbFByb2plY3Rvck9wdGlvbnMuZGVwdGggfSk7XHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGVEb20obm9kZSwgbm9kZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xyXG4gICAgICAgIGZpbmFsUHJvamVjdG9yT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRvbU5vZGU6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIG1lcmdlOiBmdW5jdGlvbiAoZWxlbWVudCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zID09PSB2b2lkIDApIHsgcHJvamVjdGlvbk9wdGlvbnMgPSB7fTsgfVxyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlID0gdHJ1ZTtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcGVuZChlbGVtZW50LnBhcmVudE5vZGUsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgd2lkZ2V0RmFjdG9yeSA9IHJlcXVpcmUoXCJzcmMvbWVudS9NZW51XCIpO1xuXG52YXIgcmVnaXN0ZXJDdXN0b21FbGVtZW50ID0gcmVxdWlyZSgnQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50JykuZGVmYXVsdDtcblxudmFyIGRlZmF1bHRFeHBvcnQgPSB3aWRnZXRGYWN0b3J5LmRlZmF1bHQ7XG5kZWZhdWx0RXhwb3J0ICYmIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZWZhdWx0RXhwb3J0KTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS9NZW51IS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIi8qIVxuICogUEVQIHYwLjQuMyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvUEVQXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyB8IGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuUG9pbnRlckV2ZW50c1BvbHlmaWxsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIGNvbnN0cnVjdG9yIGZvciBuZXcgUG9pbnRlckV2ZW50cy5cbiAgICpcbiAgICogTmV3IFBvaW50ZXIgRXZlbnRzIG11c3QgYmUgZ2l2ZW4gYSB0eXBlLCBhbmQgYW4gb3B0aW9uYWwgZGljdGlvbmFyeSBvZlxuICAgKiBpbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBEdWUgdG8gY2VydGFpbiBwbGF0Zm9ybSByZXF1aXJlbWVudHMsIGV2ZW50cyByZXR1cm5lZCBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuICAgKiBpZGVudGlmeSBhcyBNb3VzZUV2ZW50cy5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpblR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtpbkRpY3RdIEFuIG9wdGlvbmFsIGRpY3Rpb25hcnkgb2YgaW5pdGlhbCBldmVudCBwcm9wZXJ0aWVzLlxuICAgKiBAcmV0dXJuIHtFdmVudH0gQSBuZXcgUG9pbnRlckV2ZW50IG9mIHR5cGUgYGluVHlwZWAsIGluaXRpYWxpemVkIHdpdGggcHJvcGVydGllcyBmcm9tIGBpbkRpY3RgLlxuICAgKi9cbiAgdmFyIE1PVVNFX1BST1BTID0gW1xuICAgICdidWJibGVzJyxcbiAgICAnY2FuY2VsYWJsZScsXG4gICAgJ3ZpZXcnLFxuICAgICdkZXRhaWwnLFxuICAgICdzY3JlZW5YJyxcbiAgICAnc2NyZWVuWScsXG4gICAgJ2NsaWVudFgnLFxuICAgICdjbGllbnRZJyxcbiAgICAnY3RybEtleScsXG4gICAgJ2FsdEtleScsXG4gICAgJ3NoaWZ0S2V5JyxcbiAgICAnbWV0YUtleScsXG4gICAgJ2J1dHRvbicsXG4gICAgJ3JlbGF0ZWRUYXJnZXQnLFxuICAgICdwYWdlWCcsXG4gICAgJ3BhZ2VZJ1xuICBdO1xuXG4gIHZhciBNT1VTRV9ERUZBVUxUUyA9IFtcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICAwLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwXG4gIF07XG5cbiAgZnVuY3Rpb24gUG9pbnRlckV2ZW50KGluVHlwZSwgaW5EaWN0KSB7XG4gICAgaW5EaWN0ID0gaW5EaWN0IHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGUuaW5pdEV2ZW50KGluVHlwZSwgaW5EaWN0LmJ1YmJsZXMgfHwgZmFsc2UsIGluRGljdC5jYW5jZWxhYmxlIHx8IGZhbHNlKTtcblxuICAgIC8vIGRlZmluZSBpbmhlcml0ZWQgTW91c2VFdmVudCBwcm9wZXJ0aWVzXG4gICAgLy8gc2tpcCBidWJibGVzIGFuZCBjYW5jZWxhYmxlIHNpbmNlIHRoZXkncmUgc2V0IGFib3ZlIGluIGluaXRFdmVudCgpXG4gICAgZm9yICh2YXIgaSA9IDIsIHA7IGkgPCBNT1VTRV9QUk9QUy5sZW5ndGg7IGkrKykge1xuICAgICAgcCA9IE1PVVNFX1BST1BTW2ldO1xuICAgICAgZVtwXSA9IGluRGljdFtwXSB8fCBNT1VTRV9ERUZBVUxUU1tpXTtcbiAgICB9XG4gICAgZS5idXR0b25zID0gaW5EaWN0LmJ1dHRvbnMgfHwgMDtcblxuICAgIC8vIFNwZWMgcmVxdWlyZXMgdGhhdCBwb2ludGVycyB3aXRob3V0IHByZXNzdXJlIHNwZWNpZmllZCB1c2UgMC41IGZvciBkb3duXG4gICAgLy8gc3RhdGUgYW5kIDAgZm9yIHVwIHN0YXRlLlxuICAgIHZhciBwcmVzc3VyZSA9IDA7XG5cbiAgICBpZiAoaW5EaWN0LnByZXNzdXJlICYmIGUuYnV0dG9ucykge1xuICAgICAgcHJlc3N1cmUgPSBpbkRpY3QucHJlc3N1cmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXNzdXJlID0gZS5idXR0b25zID8gMC41IDogMDtcbiAgICB9XG5cbiAgICAvLyBhZGQgeC95IHByb3BlcnRpZXMgYWxpYXNlZCB0byBjbGllbnRYL1lcbiAgICBlLnggPSBlLmNsaWVudFg7XG4gICAgZS55ID0gZS5jbGllbnRZO1xuXG4gICAgLy8gZGVmaW5lIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBQb2ludGVyRXZlbnQgaW50ZXJmYWNlXG4gICAgZS5wb2ludGVySWQgPSBpbkRpY3QucG9pbnRlcklkIHx8IDA7XG4gICAgZS53aWR0aCA9IGluRGljdC53aWR0aCB8fCAwO1xuICAgIGUuaGVpZ2h0ID0gaW5EaWN0LmhlaWdodCB8fCAwO1xuICAgIGUucHJlc3N1cmUgPSBwcmVzc3VyZTtcbiAgICBlLnRpbHRYID0gaW5EaWN0LnRpbHRYIHx8IDA7XG4gICAgZS50aWx0WSA9IGluRGljdC50aWx0WSB8fCAwO1xuICAgIGUudHdpc3QgPSBpbkRpY3QudHdpc3QgfHwgMDtcbiAgICBlLnRhbmdlbnRpYWxQcmVzc3VyZSA9IGluRGljdC50YW5nZW50aWFsUHJlc3N1cmUgfHwgMDtcbiAgICBlLnBvaW50ZXJUeXBlID0gaW5EaWN0LnBvaW50ZXJUeXBlIHx8ICcnO1xuICAgIGUuaHdUaW1lc3RhbXAgPSBpbkRpY3QuaHdUaW1lc3RhbXAgfHwgMDtcbiAgICBlLmlzUHJpbWFyeSA9IGluRGljdC5pc1ByaW1hcnkgfHwgZmFsc2U7XG4gICAgcmV0dXJuIGU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgaW1wbGVtZW50cyBhIG1hcCBvZiBwb2ludGVyIHN0YXRlc1xuICAgKi9cbiAgdmFyIFVTRV9NQVAgPSB3aW5kb3cuTWFwICYmIHdpbmRvdy5NYXAucHJvdG90eXBlLmZvckVhY2g7XG4gIHZhciBQb2ludGVyTWFwID0gVVNFX01BUCA/IE1hcCA6IFNwYXJzZUFycmF5TWFwO1xuXG4gIGZ1bmN0aW9uIFNwYXJzZUFycmF5TWFwKCkge1xuICAgIHRoaXMuYXJyYXkgPSBbXTtcbiAgICB0aGlzLnNpemUgPSAwO1xuICB9XG5cbiAgU3BhcnNlQXJyYXlNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoayk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgfVxuICAgICAgdGhpcy5hcnJheVtrXSA9IHY7XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmFycmF5W2tdICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmICh0aGlzLmhhcyhrKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5hcnJheVtrXTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmFycmF5W2tdO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5hcnJheS5sZW5ndGggPSAwO1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICB9LFxuXG4gICAgLy8gcmV0dXJuIHZhbHVlLCBrZXksIG1hcFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBrLCB0aGlzKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgQ0xPTkVfUFJPUFMgPSBbXG5cbiAgICAvLyBNb3VzZUV2ZW50XG4gICAgJ2J1YmJsZXMnLFxuICAgICdjYW5jZWxhYmxlJyxcbiAgICAndmlldycsXG4gICAgJ2RldGFpbCcsXG4gICAgJ3NjcmVlblgnLFxuICAgICdzY3JlZW5ZJyxcbiAgICAnY2xpZW50WCcsXG4gICAgJ2NsaWVudFknLFxuICAgICdjdHJsS2V5JyxcbiAgICAnYWx0S2V5JyxcbiAgICAnc2hpZnRLZXknLFxuICAgICdtZXRhS2V5JyxcbiAgICAnYnV0dG9uJyxcbiAgICAncmVsYXRlZFRhcmdldCcsXG5cbiAgICAvLyBET00gTGV2ZWwgM1xuICAgICdidXR0b25zJyxcblxuICAgIC8vIFBvaW50ZXJFdmVudFxuICAgICdwb2ludGVySWQnLFxuICAgICd3aWR0aCcsXG4gICAgJ2hlaWdodCcsXG4gICAgJ3ByZXNzdXJlJyxcbiAgICAndGlsdFgnLFxuICAgICd0aWx0WScsXG4gICAgJ3BvaW50ZXJUeXBlJyxcbiAgICAnaHdUaW1lc3RhbXAnLFxuICAgICdpc1ByaW1hcnknLFxuXG4gICAgLy8gZXZlbnQgaW5zdGFuY2VcbiAgICAndHlwZScsXG4gICAgJ3RhcmdldCcsXG4gICAgJ2N1cnJlbnRUYXJnZXQnLFxuICAgICd3aGljaCcsXG4gICAgJ3BhZ2VYJyxcbiAgICAncGFnZVknLFxuICAgICd0aW1lU3RhbXAnXG4gIF07XG5cbiAgdmFyIENMT05FX0RFRkFVTFRTID0gW1xuXG4gICAgLy8gTW91c2VFdmVudFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIG51bGwsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIDAsXG4gICAgbnVsbCxcblxuICAgIC8vIERPTSBMZXZlbCAzXG4gICAgMCxcblxuICAgIC8vIFBvaW50ZXJFdmVudFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgICcnLFxuICAgIDAsXG4gICAgZmFsc2UsXG5cbiAgICAvLyBldmVudCBpbnN0YW5jZVxuICAgICcnLFxuICAgIG51bGwsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwXG4gIF07XG5cbiAgdmFyIEJPVU5EQVJZX0VWRU5UUyA9IHtcbiAgICAncG9pbnRlcm92ZXInOiAxLFxuICAgICdwb2ludGVyb3V0JzogMSxcbiAgICAncG9pbnRlcmVudGVyJzogMSxcbiAgICAncG9pbnRlcmxlYXZlJzogMVxuICB9O1xuXG4gIHZhciBIQVNfU1ZHX0lOU1RBTkNFID0gKHR5cGVvZiBTVkdFbGVtZW50SW5zdGFuY2UgIT09ICd1bmRlZmluZWQnKTtcblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgaXMgZm9yIG5vcm1hbGl6aW5nIGV2ZW50cy4gTW91c2UgYW5kIFRvdWNoIGV2ZW50cyB3aWxsIGJlXG4gICAqIGNvbGxlY3RlZCBoZXJlLCBhbmQgZmlyZSBQb2ludGVyRXZlbnRzIHRoYXQgaGF2ZSB0aGUgc2FtZSBzZW1hbnRpY3MsIG5vXG4gICAqIG1hdHRlciB0aGUgc291cmNlLlxuICAgKiBFdmVudHMgZmlyZWQ6XG4gICAqICAgLSBwb2ludGVyZG93bjogYSBwb2ludGluZyBpcyBhZGRlZFxuICAgKiAgIC0gcG9pbnRlcnVwOiBhIHBvaW50ZXIgaXMgcmVtb3ZlZFxuICAgKiAgIC0gcG9pbnRlcm1vdmU6IGEgcG9pbnRlciBpcyBtb3ZlZFxuICAgKiAgIC0gcG9pbnRlcm92ZXI6IGEgcG9pbnRlciBjcm9zc2VzIGludG8gYW4gZWxlbWVudFxuICAgKiAgIC0gcG9pbnRlcm91dDogYSBwb2ludGVyIGxlYXZlcyBhbiBlbGVtZW50XG4gICAqICAgLSBwb2ludGVyY2FuY2VsOiBhIHBvaW50ZXIgd2lsbCBubyBsb25nZXIgZ2VuZXJhdGUgZXZlbnRzXG4gICAqL1xuICB2YXIgZGlzcGF0Y2hlciA9IHtcbiAgICBwb2ludGVybWFwOiBuZXcgUG9pbnRlck1hcCgpLFxuICAgIGV2ZW50TWFwOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIGNhcHR1cmVJbmZvOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXG4gICAgLy8gU2NvcGUgb2JqZWN0cyBmb3IgbmF0aXZlIGV2ZW50cy5cbiAgICAvLyBUaGlzIGV4aXN0cyBmb3IgZWFzZSBvZiB0ZXN0aW5nLlxuICAgIGV2ZW50U291cmNlczogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICBldmVudFNvdXJjZUxpc3Q6IFtdLFxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBldmVudCBzb3VyY2UgdGhhdCB3aWxsIGdlbmVyYXRlIHBvaW50ZXIgZXZlbnRzLlxuICAgICAqXG4gICAgICogYGluU291cmNlYCBtdXN0IGNvbnRhaW4gYW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgbmFtZWQgYGV2ZW50c2AsIGFuZFxuICAgICAqIGZ1bmN0aW9ucyB3aXRoIHRoZSBuYW1lcyBzcGVjaWZpZWQgaW4gdGhlIGBldmVudHNgIGFycmF5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgbmFtZSBmb3IgdGhlIGV2ZW50IHNvdXJjZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgQSBuZXcgc291cmNlIG9mIHBsYXRmb3JtIGV2ZW50cy5cbiAgICAgKi9cbiAgICByZWdpc3RlclNvdXJjZTogZnVuY3Rpb24obmFtZSwgc291cmNlKSB7XG4gICAgICB2YXIgcyA9IHNvdXJjZTtcbiAgICAgIHZhciBuZXdFdmVudHMgPSBzLmV2ZW50cztcbiAgICAgIGlmIChuZXdFdmVudHMpIHtcbiAgICAgICAgbmV3RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChzW2VdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TWFwW2VdID0gc1tlXS5iaW5kKHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMuZXZlbnRTb3VyY2VzW25hbWVdID0gcztcbiAgICAgICAgdGhpcy5ldmVudFNvdXJjZUxpc3QucHVzaChzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgbCA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0Lmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlczsgKGkgPCBsKSAmJiAoZXMgPSB0aGlzLmV2ZW50U291cmNlTGlzdFtpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIGNhbGwgZXZlbnRzb3VyY2UgcmVnaXN0ZXJcbiAgICAgICAgZXMucmVnaXN0ZXIuY2FsbChlcywgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgbCA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0Lmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlczsgKGkgPCBsKSAmJiAoZXMgPSB0aGlzLmV2ZW50U291cmNlTGlzdFtpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIGNhbGwgZXZlbnRzb3VyY2UgcmVnaXN0ZXJcbiAgICAgICAgZXMudW5yZWdpc3Rlci5jYWxsKGVzLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbnRhaW5zOiAvKnNjb3BlLmV4dGVybmFsLmNvbnRhaW5zIHx8ICovZnVuY3Rpb24oY29udGFpbmVyLCBjb250YWluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb250YWluZXIuY29udGFpbnMoY29udGFpbmVkKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG5cbiAgICAgICAgLy8gbW9zdCBsaWtlbHk6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTIwODQyN1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEVWRU5UU1xuICAgIGRvd246IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmRvd24nLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcm1vdmUnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIHVwOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJ1cCcsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgZW50ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IGZhbHNlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJlbnRlcicsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IGZhbHNlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJsZWF2ZScsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgb3ZlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyb3ZlcicsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgb3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJvdXQnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyY2FuY2VsJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBsZWF2ZU91dDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHRoaXMub3V0KGV2ZW50KTtcbiAgICAgIHRoaXMucHJvcGFnYXRlKGV2ZW50LCB0aGlzLmxlYXZlLCBmYWxzZSk7XG4gICAgfSxcbiAgICBlbnRlck92ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm92ZXIoZXZlbnQpO1xuICAgICAgdGhpcy5wcm9wYWdhdGUoZXZlbnQsIHRoaXMuZW50ZXIsIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyBMSVNURU5FUiBMT0dJQ1xuICAgIGV2ZW50SGFuZGxlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuXG4gICAgICAvLyBUaGlzIGlzIHVzZWQgdG8gcHJldmVudCBtdWx0aXBsZSBkaXNwYXRjaCBvZiBwb2ludGVyZXZlbnRzIGZyb21cbiAgICAgIC8vIHBsYXRmb3JtIGV2ZW50cy4gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdHdvIGVsZW1lbnRzIGluIGRpZmZlcmVudCBzY29wZXNcbiAgICAgIC8vIGFyZSBzZXQgdXAgdG8gY3JlYXRlIHBvaW50ZXIgZXZlbnRzLCB3aGljaCBpcyByZWxldmFudCB0byBTaGFkb3cgRE9NLlxuICAgICAgaWYgKGluRXZlbnQuX2hhbmRsZWRCeVBFKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gaW5FdmVudC50eXBlO1xuICAgICAgdmFyIGZuID0gdGhpcy5ldmVudE1hcCAmJiB0aGlzLmV2ZW50TWFwW3R5cGVdO1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuKGluRXZlbnQpO1xuICAgICAgfVxuICAgICAgaW5FdmVudC5faGFuZGxlZEJ5UEUgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBzZXQgdXAgZXZlbnQgbGlzdGVuZXJzXG4gICAgbGlzdGVuOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50cykge1xuICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KHRhcmdldCwgZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuICAgIHVubGlzdGVuOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50cykge1xuICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50KHRhcmdldCwgZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGFkZEV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLmFkZEV2ZW50IHx8ICovZnVuY3Rpb24odGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5ib3VuZEhhbmRsZXIpO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnQ6IC8qc2NvcGUuZXh0ZXJuYWwucmVtb3ZlRXZlbnQgfHwgKi9mdW5jdGlvbih0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmJvdW5kSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8vIEVWRU5UIENSRUFUSU9OIEFORCBUUkFDS0lOR1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgRXZlbnQgb2YgdHlwZSBgaW5UeXBlYCwgYmFzZWQgb24gdGhlIGluZm9ybWF0aW9uIGluXG4gICAgICogYGluRXZlbnRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluVHlwZSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgZXZlbnQgdG8gY3JlYXRlXG4gICAgICogQHBhcmFtIHtFdmVudH0gaW5FdmVudCBBIHBsYXRmb3JtIGV2ZW50IHdpdGggYSB0YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtFdmVudH0gQSBQb2ludGVyRXZlbnQgb2YgdHlwZSBgaW5UeXBlYFxuICAgICAqL1xuICAgIG1ha2VFdmVudDogZnVuY3Rpb24oaW5UeXBlLCBpbkV2ZW50KSB7XG5cbiAgICAgIC8vIHJlbGF0ZWRUYXJnZXQgbXVzdCBiZSBudWxsIGlmIHBvaW50ZXIgaXMgY2FwdHVyZWRcbiAgICAgIGlmICh0aGlzLmNhcHR1cmVJbmZvW2luRXZlbnQucG9pbnRlcklkXSkge1xuICAgICAgICBpbkV2ZW50LnJlbGF0ZWRUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KGluVHlwZSwgaW5FdmVudCk7XG4gICAgICBpZiAoaW5FdmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID0gaW5FdmVudC5wcmV2ZW50RGVmYXVsdDtcbiAgICAgIH1cbiAgICAgIGUuX3RhcmdldCA9IGUuX3RhcmdldCB8fCBpbkV2ZW50LnRhcmdldDtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG5cbiAgICAvLyBtYWtlIGFuZCBkaXNwYXRjaCBhbiBldmVudCBpbiBvbmUgY2FsbFxuICAgIGZpcmVFdmVudDogZnVuY3Rpb24oaW5UeXBlLCBpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMubWFrZUV2ZW50KGluVHlwZSwgaW5FdmVudCk7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHNuYXBzaG90IG9mIGluRXZlbnQsIHdpdGggd3JpdGFibGUgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgQW4gZXZlbnQgdGhhdCBjb250YWlucyBwcm9wZXJ0aWVzIHRvIGNvcHkuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyBzaGFsbG93IGNvcGllcyBvZiBgaW5FdmVudGAnc1xuICAgICAqICAgIHByb3BlcnRpZXMuXG4gICAgICovXG4gICAgY2xvbmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGV2ZW50Q29weSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB2YXIgcDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQ0xPTkVfUFJPUFMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcCA9IENMT05FX1BST1BTW2ldO1xuICAgICAgICBldmVudENvcHlbcF0gPSBpbkV2ZW50W3BdIHx8IENMT05FX0RFRkFVTFRTW2ldO1xuXG4gICAgICAgIC8vIFdvcmsgYXJvdW5kIFNWR0luc3RhbmNlRWxlbWVudCBzaGFkb3cgdHJlZVxuICAgICAgICAvLyBSZXR1cm4gdGhlIDx1c2U+IGVsZW1lbnQgdGhhdCBpcyByZXByZXNlbnRlZCBieSB0aGUgaW5zdGFuY2UgZm9yIFNhZmFyaSwgQ2hyb21lLCBJRS5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgYmVoYXZpb3IgaW1wbGVtZW50ZWQgYnkgRmlyZWZveC5cbiAgICAgICAgaWYgKEhBU19TVkdfSU5TVEFOQ0UgJiYgKHAgPT09ICd0YXJnZXQnIHx8IHAgPT09ICdyZWxhdGVkVGFyZ2V0JykpIHtcbiAgICAgICAgICBpZiAoZXZlbnRDb3B5W3BdIGluc3RhbmNlb2YgU1ZHRWxlbWVudEluc3RhbmNlKSB7XG4gICAgICAgICAgICBldmVudENvcHlbcF0gPSBldmVudENvcHlbcF0uY29ycmVzcG9uZGluZ1VzZUVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGtlZXAgdGhlIHNlbWFudGljcyBvZiBwcmV2ZW50RGVmYXVsdFxuICAgICAgaWYgKGluRXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZXZlbnRDb3B5LnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50Q29weTtcbiAgICB9LFxuICAgIGdldFRhcmdldDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGNhcHR1cmUgPSB0aGlzLmNhcHR1cmVJbmZvW2luRXZlbnQucG9pbnRlcklkXTtcbiAgICAgIGlmICghY2FwdHVyZSkge1xuICAgICAgICByZXR1cm4gaW5FdmVudC5fdGFyZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKGluRXZlbnQuX3RhcmdldCA9PT0gY2FwdHVyZSB8fCAhKGluRXZlbnQudHlwZSBpbiBCT1VOREFSWV9FVkVOVFMpKSB7XG4gICAgICAgIHJldHVybiBjYXB0dXJlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcHJvcGFnYXRlOiBmdW5jdGlvbihldmVudCwgZm4sIHByb3BhZ2F0ZURvd24pIHtcbiAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICB2YXIgdGFyZ2V0cyA9IFtdO1xuXG4gICAgICAvLyBPcmRlciBvZiBjb25kaXRpb25zIGR1ZSB0byBkb2N1bWVudC5jb250YWlucygpIG1pc3NpbmcgaW4gSUUuXG4gICAgICB3aGlsZSAodGFyZ2V0ICE9PSBkb2N1bWVudCAmJiAhdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgIHRhcmdldHMucHVzaCh0YXJnZXQpO1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICAvLyBUb3VjaDogRG8gbm90IHByb3BhZ2F0ZSBpZiBub2RlIGlzIGRldGFjaGVkLlxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BhZ2F0ZURvd24pIHtcbiAgICAgICAgdGFyZ2V0cy5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICB0YXJnZXRzLmZvckVhY2goZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHNldENhcHR1cmU6IGZ1bmN0aW9uKGluUG9pbnRlcklkLCBpblRhcmdldCwgc2tpcERpc3BhdGNoKSB7XG4gICAgICBpZiAodGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0pIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ2FwdHVyZShpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0gPSBpblRhcmdldDtcbiAgICAgIHRoaXMuaW1wbGljaXRSZWxlYXNlID0gdGhpcy5yZWxlYXNlQ2FwdHVyZS5iaW5kKHRoaXMsIGluUG9pbnRlcklkLCBza2lwRGlzcGF0Y2gpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcblxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KCdnb3Rwb2ludGVyY2FwdHVyZScpO1xuICAgICAgZS5wb2ludGVySWQgPSBpblBvaW50ZXJJZDtcbiAgICAgIGUuX3RhcmdldCA9IGluVGFyZ2V0O1xuXG4gICAgICBpZiAoIXNraXBEaXNwYXRjaCkge1xuICAgICAgICB0aGlzLmFzeW5jRGlzcGF0Y2hFdmVudChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbGVhc2VDYXB0dXJlOiBmdW5jdGlvbihpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKSB7XG4gICAgICB2YXIgdCA9IHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdO1xuICAgICAgaWYgKCF0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF0gPSB1bmRlZmluZWQ7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuXG4gICAgICB2YXIgZSA9IG5ldyBQb2ludGVyRXZlbnQoJ2xvc3Rwb2ludGVyY2FwdHVyZScpO1xuICAgICAgZS5wb2ludGVySWQgPSBpblBvaW50ZXJJZDtcbiAgICAgIGUuX3RhcmdldCA9IHQ7XG5cbiAgICAgIGlmICghc2tpcERpc3BhdGNoKSB7XG4gICAgICAgIHRoaXMuYXN5bmNEaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgZXZlbnQgdG8gaXRzIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgVGhlIGV2ZW50IHRvIGJlIGRpc3BhdGNoZWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBhbiBldmVudCBoYW5kbGVyIHJldHVybnMgdHJ1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGRpc3BhdGNoRXZlbnQ6IC8qc2NvcGUuZXh0ZXJuYWwuZGlzcGF0Y2hFdmVudCB8fCAqL2Z1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciB0ID0gdGhpcy5nZXRUYXJnZXQoaW5FdmVudCk7XG4gICAgICBpZiAodCkge1xuICAgICAgICByZXR1cm4gdC5kaXNwYXRjaEV2ZW50KGluRXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmNEaXNwYXRjaEV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kaXNwYXRjaEV2ZW50LmJpbmQodGhpcywgaW5FdmVudCkpO1xuICAgIH1cbiAgfTtcbiAgZGlzcGF0Y2hlci5ib3VuZEhhbmRsZXIgPSBkaXNwYXRjaGVyLmV2ZW50SGFuZGxlci5iaW5kKGRpc3BhdGNoZXIpO1xuXG4gIHZhciB0YXJnZXRpbmcgPSB7XG4gICAgc2hhZG93OiBmdW5jdGlvbihpbkVsKSB7XG4gICAgICBpZiAoaW5FbCkge1xuICAgICAgICByZXR1cm4gaW5FbC5zaGFkb3dSb290IHx8IGluRWwud2Via2l0U2hhZG93Um9vdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhblRhcmdldDogZnVuY3Rpb24oc2hhZG93KSB7XG4gICAgICByZXR1cm4gc2hhZG93ICYmIEJvb2xlYW4oc2hhZG93LmVsZW1lbnRGcm9tUG9pbnQpO1xuICAgIH0sXG4gICAgdGFyZ2V0aW5nU2hhZG93OiBmdW5jdGlvbihpbkVsKSB7XG4gICAgICB2YXIgcyA9IHRoaXMuc2hhZG93KGluRWwpO1xuICAgICAgaWYgKHRoaXMuY2FuVGFyZ2V0KHMpKSB7XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfVxuICAgIH0sXG4gICAgb2xkZXJTaGFkb3c6IGZ1bmN0aW9uKHNoYWRvdykge1xuICAgICAgdmFyIG9zID0gc2hhZG93Lm9sZGVyU2hhZG93Um9vdDtcbiAgICAgIGlmICghb3MpIHtcbiAgICAgICAgdmFyIHNlID0gc2hhZG93LnF1ZXJ5U2VsZWN0b3IoJ3NoYWRvdycpO1xuICAgICAgICBpZiAoc2UpIHtcbiAgICAgICAgICBvcyA9IHNlLm9sZGVyU2hhZG93Um9vdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9zO1xuICAgIH0sXG4gICAgYWxsU2hhZG93czogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIHNoYWRvd3MgPSBbXTtcbiAgICAgIHZhciBzID0gdGhpcy5zaGFkb3coZWxlbWVudCk7XG4gICAgICB3aGlsZSAocykge1xuICAgICAgICBzaGFkb3dzLnB1c2gocyk7XG4gICAgICAgIHMgPSB0aGlzLm9sZGVyU2hhZG93KHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNoYWRvd3M7XG4gICAgfSxcbiAgICBzZWFyY2hSb290OiBmdW5jdGlvbihpblJvb3QsIHgsIHkpIHtcbiAgICAgIGlmIChpblJvb3QpIHtcbiAgICAgICAgdmFyIHQgPSBpblJvb3QuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgICAgdmFyIHN0LCBzcjtcblxuICAgICAgICAvLyBpcyBlbGVtZW50IGEgc2hhZG93IGhvc3Q/XG4gICAgICAgIHNyID0gdGhpcy50YXJnZXRpbmdTaGFkb3codCk7XG4gICAgICAgIHdoaWxlIChzcikge1xuXG4gICAgICAgICAgLy8gZmluZCB0aGUgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBzaGFkb3cgcm9vdFxuICAgICAgICAgIHN0ID0gc3IuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICAgICAgICBpZiAoIXN0KSB7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBvbGRlciBzaGFkb3dzXG4gICAgICAgICAgICBzciA9IHRoaXMub2xkZXJTaGFkb3coc3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIHNoYWRvd2VkIGVsZW1lbnQgbWF5IGNvbnRhaW4gYSBzaGFkb3cgcm9vdFxuICAgICAgICAgICAgdmFyIHNzciA9IHRoaXMudGFyZ2V0aW5nU2hhZG93KHN0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFJvb3Qoc3NyLCB4LCB5KSB8fCBzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsaWdodCBkb20gZWxlbWVudCBpcyB0aGUgdGFyZ2V0XG4gICAgICAgIHJldHVybiB0O1xuICAgICAgfVxuICAgIH0sXG4gICAgb3duZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBzID0gZWxlbWVudDtcblxuICAgICAgLy8gd2FsayB1cCB1bnRpbCB5b3UgaGl0IHRoZSBzaGFkb3cgcm9vdCBvciBkb2N1bWVudFxuICAgICAgd2hpbGUgKHMucGFyZW50Tm9kZSkge1xuICAgICAgICBzID0gcy5wYXJlbnROb2RlO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGUgb3duZXIgZWxlbWVudCBpcyBleHBlY3RlZCB0byBiZSBhIERvY3VtZW50IG9yIFNoYWRvd1Jvb3RcbiAgICAgIGlmIChzLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX05PREUgJiYgcy5ub2RlVHlwZSAhPT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG4gICAgICAgIHMgPSBkb2N1bWVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzO1xuICAgIH0sXG4gICAgZmluZFRhcmdldDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIHggPSBpbkV2ZW50LmNsaWVudFg7XG4gICAgICB2YXIgeSA9IGluRXZlbnQuY2xpZW50WTtcblxuICAgICAgLy8gaWYgdGhlIGxpc3RlbmVyIGlzIGluIHRoZSBzaGFkb3cgcm9vdCwgaXQgaXMgbXVjaCBmYXN0ZXIgdG8gc3RhcnQgdGhlcmVcbiAgICAgIHZhciBzID0gdGhpcy5vd25lcihpbkV2ZW50LnRhcmdldCk7XG5cbiAgICAgIC8vIGlmIHgsIHkgaXMgbm90IGluIHRoaXMgcm9vdCwgZmFsbCBiYWNrIHRvIGRvY3VtZW50IHNlYXJjaFxuICAgICAgaWYgKCFzLmVsZW1lbnRGcm9tUG9pbnQoeCwgeSkpIHtcbiAgICAgICAgcyA9IGRvY3VtZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUm9vdChzLCB4LCB5KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmZvckVhY2gpO1xuICB2YXIgbWFwID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLm1hcCk7XG4gIHZhciB0b0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuc2xpY2UpO1xuICB2YXIgZmlsdGVyID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmZpbHRlcik7XG4gIHZhciBNTyA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICB2YXIgU0VMRUNUT1IgPSAnW3RvdWNoLWFjdGlvbl0nO1xuICB2YXIgT0JTRVJWRVJfSU5JVCA9IHtcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZUZpbHRlcjogWyd0b3VjaC1hY3Rpb24nXVxuICB9O1xuXG4gIGZ1bmN0aW9uIEluc3RhbGxlcihhZGQsIHJlbW92ZSwgY2hhbmdlZCwgYmluZGVyKSB7XG4gICAgdGhpcy5hZGRDYWxsYmFjayA9IGFkZC5iaW5kKGJpbmRlcik7XG4gICAgdGhpcy5yZW1vdmVDYWxsYmFjayA9IHJlbW92ZS5iaW5kKGJpbmRlcik7XG4gICAgdGhpcy5jaGFuZ2VkQ2FsbGJhY2sgPSBjaGFuZ2VkLmJpbmQoYmluZGVyKTtcbiAgICBpZiAoTU8pIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTU8odGhpcy5tdXRhdGlvbldhdGNoZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgSW5zdGFsbGVyLnByb3RvdHlwZSA9IHtcbiAgICB3YXRjaFN1YnRyZWU6IGZ1bmN0aW9uKHRhcmdldCkge1xuXG4gICAgICAvLyBPbmx5IHdhdGNoIHNjb3BlcyB0aGF0IGNhbiB0YXJnZXQgZmluZCwgYXMgdGhlc2UgYXJlIHRvcC1sZXZlbC5cbiAgICAgIC8vIE90aGVyd2lzZSB3ZSBjYW4gc2VlIGR1cGxpY2F0ZSBhZGRpdGlvbnMgYW5kIHJlbW92YWxzIHRoYXQgYWRkIG5vaXNlLlxuICAgICAgLy9cbiAgICAgIC8vIFRPRE8oZGZyZWVkbWFuKTogRm9yIHNvbWUgaW5zdGFuY2VzIHdpdGggU2hhZG93RE9NUG9seWZpbGwsIHdlIGNhbiBzZWVcbiAgICAgIC8vIGEgcmVtb3ZhbCB3aXRob3V0IGFuIGluc2VydGlvbiB3aGVuIGEgbm9kZSBpcyByZWRpc3RyaWJ1dGVkIGFtb25nXG4gICAgICAvLyBzaGFkb3dzLiBTaW5jZSBpdCBhbGwgZW5kcyB1cCBjb3JyZWN0IGluIHRoZSBkb2N1bWVudCwgd2F0Y2hpbmcgb25seVxuICAgICAgLy8gdGhlIGRvY3VtZW50IHdpbGwgeWllbGQgdGhlIGNvcnJlY3QgbXV0YXRpb25zIHRvIHdhdGNoLlxuICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIgJiYgdGFyZ2V0aW5nLmNhblRhcmdldCh0YXJnZXQpKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIE9CU0VSVkVSX0lOSVQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5hYmxlT25TdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIHRoaXMud2F0Y2hTdWJ0cmVlKHRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0ID09PSBkb2N1bWVudCAmJiBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHRoaXMuaW5zdGFsbE9uTG9hZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnN0YWxsTmV3U3VidHJlZSh0YXJnZXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5zdGFsbE5ld1N1YnRyZWU6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZm9yRWFjaCh0aGlzLmZpbmRFbGVtZW50cyh0YXJnZXQpLCB0aGlzLmFkZEVsZW1lbnQsIHRoaXMpO1xuICAgIH0sXG4gICAgZmluZEVsZW1lbnRzOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGlmICh0YXJnZXQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG4gICAgcmVtb3ZlRWxlbWVudDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2FsbGJhY2soZWwpO1xuICAgIH0sXG4gICAgYWRkRWxlbWVudDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHRoaXMuYWRkQ2FsbGJhY2soZWwpO1xuICAgIH0sXG4gICAgZWxlbWVudENoYW5nZWQ6IGZ1bmN0aW9uKGVsLCBvbGRWYWx1ZSkge1xuICAgICAgdGhpcy5jaGFuZ2VkQ2FsbGJhY2soZWwsIG9sZFZhbHVlKTtcbiAgICB9LFxuICAgIGNvbmNhdExpc3RzOiBmdW5jdGlvbihhY2N1bSwgbGlzdCkge1xuICAgICAgcmV0dXJuIGFjY3VtLmNvbmNhdCh0b0FycmF5KGxpc3QpKTtcbiAgICB9LFxuXG4gICAgLy8gcmVnaXN0ZXIgYWxsIHRvdWNoLWFjdGlvbiA9IG5vbmUgbm9kZXMgb24gZG9jdW1lbnQgbG9hZFxuICAgIGluc3RhbGxPbkxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgIHRoaXMuaW5zdGFsbE5ld1N1YnRyZWUoZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgaXNFbGVtZW50OiBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREU7XG4gICAgfSxcbiAgICBmbGF0dGVuTXV0YXRpb25UcmVlOiBmdW5jdGlvbihpbk5vZGVzKSB7XG5cbiAgICAgIC8vIGZpbmQgY2hpbGRyZW4gd2l0aCB0b3VjaC1hY3Rpb25cbiAgICAgIHZhciB0cmVlID0gbWFwKGluTm9kZXMsIHRoaXMuZmluZEVsZW1lbnRzLCB0aGlzKTtcblxuICAgICAgLy8gbWFrZSBzdXJlIHRoZSBhZGRlZCBub2RlcyBhcmUgYWNjb3VudGVkIGZvclxuICAgICAgdHJlZS5wdXNoKGZpbHRlcihpbk5vZGVzLCB0aGlzLmlzRWxlbWVudCkpO1xuXG4gICAgICAvLyBmbGF0dGVuIHRoZSBsaXN0XG4gICAgICByZXR1cm4gdHJlZS5yZWR1Y2UodGhpcy5jb25jYXRMaXN0cywgW10pO1xuICAgIH0sXG4gICAgbXV0YXRpb25XYXRjaGVyOiBmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgIG11dGF0aW9ucy5mb3JFYWNoKHRoaXMubXV0YXRpb25IYW5kbGVyLCB0aGlzKTtcbiAgICB9LFxuICAgIG11dGF0aW9uSGFuZGxlcjogZnVuY3Rpb24obSkge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgdmFyIGFkZGVkID0gdGhpcy5mbGF0dGVuTXV0YXRpb25UcmVlKG0uYWRkZWROb2Rlcyk7XG4gICAgICAgIGFkZGVkLmZvckVhY2godGhpcy5hZGRFbGVtZW50LCB0aGlzKTtcbiAgICAgICAgdmFyIHJlbW92ZWQgPSB0aGlzLmZsYXR0ZW5NdXRhdGlvblRyZWUobS5yZW1vdmVkTm9kZXMpO1xuICAgICAgICByZW1vdmVkLmZvckVhY2godGhpcy5yZW1vdmVFbGVtZW50LCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Q2hhbmdlZChtLnRhcmdldCwgbS5vbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNoYWRvd1NlbGVjdG9yKHYpIHtcbiAgICByZXR1cm4gJ2JvZHkgL3NoYWRvdy1kZWVwLyAnICsgc2VsZWN0b3Iodik7XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0b3Iodikge1xuICAgIHJldHVybiAnW3RvdWNoLWFjdGlvbj1cIicgKyB2ICsgJ1wiXSc7XG4gIH1cbiAgZnVuY3Rpb24gcnVsZSh2KSB7XG4gICAgcmV0dXJuICd7IC1tcy10b3VjaC1hY3Rpb246ICcgKyB2ICsgJzsgdG91Y2gtYWN0aW9uOiAnICsgdiArICc7IH0nO1xuICB9XG4gIHZhciBhdHRyaWIyY3NzID0gW1xuICAgICdub25lJyxcbiAgICAnYXV0bycsXG4gICAgJ3Bhbi14JyxcbiAgICAncGFuLXknLFxuICAgIHtcbiAgICAgIHJ1bGU6ICdwYW4teCBwYW4teScsXG4gICAgICBzZWxlY3RvcnM6IFtcbiAgICAgICAgJ3Bhbi14IHBhbi15JyxcbiAgICAgICAgJ3Bhbi15IHBhbi14J1xuICAgICAgXVxuICAgIH1cbiAgXTtcbiAgdmFyIHN0eWxlcyA9ICcnO1xuXG4gIC8vIG9ubHkgaW5zdGFsbCBzdHlsZXNoZWV0IGlmIHRoZSBicm93c2VyIGhhcyB0b3VjaCBhY3Rpb24gc3VwcG9ydFxuICB2YXIgaGFzTmF0aXZlUEUgPSB3aW5kb3cuUG9pbnRlckV2ZW50IHx8IHdpbmRvdy5NU1BvaW50ZXJFdmVudDtcblxuICAvLyBvbmx5IGFkZCBzaGFkb3cgc2VsZWN0b3JzIGlmIHNoYWRvd2RvbSBpcyBzdXBwb3J0ZWRcbiAgdmFyIGhhc1NoYWRvd1Jvb3QgPSAhd2luZG93LlNoYWRvd0RPTVBvbHlmaWxsICYmIGRvY3VtZW50LmhlYWQuY3JlYXRlU2hhZG93Um9vdDtcblxuICBmdW5jdGlvbiBhcHBseUF0dHJpYnV0ZVN0eWxlcygpIHtcbiAgICBpZiAoaGFzTmF0aXZlUEUpIHtcbiAgICAgIGF0dHJpYjJjc3MuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAgIGlmIChTdHJpbmcocikgPT09IHIpIHtcbiAgICAgICAgICBzdHlsZXMgKz0gc2VsZWN0b3IocikgKyBydWxlKHIpICsgJ1xcbic7XG4gICAgICAgICAgaWYgKGhhc1NoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSBzaGFkb3dTZWxlY3RvcihyKSArIHJ1bGUocikgKyAnXFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGVzICs9IHIuc2VsZWN0b3JzLm1hcChzZWxlY3RvcikgKyBydWxlKHIucnVsZSkgKyAnXFxuJztcbiAgICAgICAgICBpZiAoaGFzU2hhZG93Um9vdCkge1xuICAgICAgICAgICAgc3R5bGVzICs9IHIuc2VsZWN0b3JzLm1hcChzaGFkb3dTZWxlY3RvcikgKyBydWxlKHIucnVsZSkgKyAnXFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgZWwudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcG9pbnRlcm1hcCA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcDtcblxuICAvLyByYWRpdXMgYXJvdW5kIHRvdWNoZW5kIHRoYXQgc3dhbGxvd3MgbW91c2UgZXZlbnRzXG4gIHZhciBERURVUF9ESVNUID0gMjU7XG5cbiAgLy8gbGVmdCwgbWlkZGxlLCByaWdodCwgYmFjaywgZm9yd2FyZFxuICB2YXIgQlVUVE9OX1RPX0JVVFRPTlMgPSBbMSwgNCwgMiwgOCwgMTZdO1xuXG4gIHZhciBIQVNfQlVUVE9OUyA9IGZhbHNlO1xuICB0cnkge1xuICAgIEhBU19CVVRUT05TID0gbmV3IE1vdXNlRXZlbnQoJ3Rlc3QnLCB7IGJ1dHRvbnM6IDEgfSkuYnV0dG9ucyA9PT0gMTtcbiAgfSBjYXRjaCAoZSkge31cblxuICAvLyBoYW5kbGVyIGJsb2NrIGZvciBuYXRpdmUgbW91c2UgZXZlbnRzXG4gIHZhciBtb3VzZUV2ZW50cyA9IHtcbiAgICBQT0lOVEVSX0lEOiAxLFxuICAgIFBPSU5URVJfVFlQRTogJ21vdXNlJyxcbiAgICBldmVudHM6IFtcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAnbW91c2V1cCcsXG4gICAgICAnbW91c2VvdmVyJyxcbiAgICAgICdtb3VzZW91dCdcbiAgICBdLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgbGFzdFRvdWNoZXM6IFtdLFxuXG4gICAgLy8gY29sbGlkZSB3aXRoIHRoZSBnbG9iYWwgbW91c2UgbGlzdGVuZXJcbiAgICBpc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgIHZhciB4ID0gaW5FdmVudC5jbGllbnRYO1xuICAgICAgdmFyIHkgPSBpbkV2ZW50LmNsaWVudFk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGx0cy5sZW5ndGgsIHQ7IGkgPCBsICYmICh0ID0gbHRzW2ldKTsgaSsrKSB7XG5cbiAgICAgICAgLy8gc2ltdWxhdGVkIG1vdXNlIGV2ZW50cyB3aWxsIGJlIHN3YWxsb3dlZCBuZWFyIGEgcHJpbWFyeSB0b3VjaGVuZFxuICAgICAgICB2YXIgZHggPSBNYXRoLmFicyh4IC0gdC54KTtcbiAgICAgICAgdmFyIGR5ID0gTWF0aC5hYnMoeSAtIHQueSk7XG4gICAgICAgIGlmIChkeCA8PSBERURVUF9ESVNUICYmIGR5IDw9IERFRFVQX0RJU1QpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcHJlcGFyZUV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIuY2xvbmVFdmVudChpbkV2ZW50KTtcblxuICAgICAgLy8gZm9yd2FyZCBtb3VzZSBwcmV2ZW50RGVmYXVsdFxuICAgICAgdmFyIHBkID0gZS5wcmV2ZW50RGVmYXVsdDtcbiAgICAgIGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBwZCgpO1xuICAgICAgfTtcbiAgICAgIGUucG9pbnRlcklkID0gdGhpcy5QT0lOVEVSX0lEO1xuICAgICAgZS5pc1ByaW1hcnkgPSB0cnVlO1xuICAgICAgZS5wb2ludGVyVHlwZSA9IHRoaXMuUE9JTlRFUl9UWVBFO1xuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBwcmVwYXJlQnV0dG9uc0Zvck1vdmU6IGZ1bmN0aW9uKGUsIGluRXZlbnQpIHtcbiAgICAgIHZhciBwID0gcG9pbnRlcm1hcC5nZXQodGhpcy5QT0lOVEVSX0lEKTtcblxuICAgICAgLy8gVXBkYXRlIGJ1dHRvbnMgc3RhdGUgYWZ0ZXIgcG9zc2libGUgb3V0LW9mLWRvY3VtZW50IG1vdXNldXAuXG4gICAgICBpZiAoaW5FdmVudC53aGljaCA9PT0gMCB8fCAhcCkge1xuICAgICAgICBlLmJ1dHRvbnMgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZS5idXR0b25zID0gcC5idXR0b25zO1xuICAgICAgfVxuICAgICAgaW5FdmVudC5idXR0b25zID0gZS5idXR0b25zO1xuICAgIH0sXG4gICAgbW91c2Vkb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHtcbiAgICAgICAgICBlLmJ1dHRvbnMgPSBCVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG4gICAgICAgICAgaWYgKHApIHsgZS5idXR0b25zIHw9IHAuYnV0dG9uczsgfVxuICAgICAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBpZiAoIXAgfHwgcC5idXR0b25zID09PSAwKSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5kb3duKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2Vtb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG4gICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNldXA6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBwID0gcG9pbnRlcm1hcC5nZXQodGhpcy5QT0lOVEVSX0lEKTtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykge1xuICAgICAgICAgIHZhciB1cCA9IEJVVFRPTl9UT19CVVRUT05TW2UuYnV0dG9uXTtcblxuICAgICAgICAgIC8vIFByb2R1Y2VzIHdyb25nIHN0YXRlIG9mIGJ1dHRvbnMgaW4gQnJvd3NlcnMgd2l0aG91dCBgYnV0dG9uc2Agc3VwcG9ydFxuICAgICAgICAgIC8vIHdoZW4gYSBtb3VzZSBidXR0b24gdGhhdCB3YXMgcHJlc3NlZCBvdXRzaWRlIHRoZSBkb2N1bWVudCBpcyByZWxlYXNlZFxuICAgICAgICAgIC8vIGluc2lkZSBhbmQgb3RoZXIgYnV0dG9ucyBhcmUgc3RpbGwgcHJlc3NlZCBkb3duLlxuICAgICAgICAgIGUuYnV0dG9ucyA9IHAgPyBwLmJ1dHRvbnMgJiB+dXAgOiAwO1xuICAgICAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuXG4gICAgICAgIC8vIFN1cHBvcnQ6IEZpcmVmb3ggPD00NCBvbmx5XG4gICAgICAgIC8vIEZGIFVidW50dSBpbmNsdWRlcyB0aGUgbGlmdGVkIGJ1dHRvbiBpbiB0aGUgYGJ1dHRvbnNgIHByb3BlcnR5IG9uXG4gICAgICAgIC8vIG1vdXNldXAuXG4gICAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEyMjMzNjZcbiAgICAgICAgZS5idXR0b25zICY9IH5CVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG4gICAgICAgIGlmIChlLmJ1dHRvbnMgPT09IDApIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLnVwKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VvdmVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG4gICAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2VvdXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHsgdGhpcy5wcmVwYXJlQnV0dG9uc0Zvck1vdmUoZSwgaW5FdmVudCk7IH1cbiAgICAgICAgZS5idXR0b24gPSAtMTtcbiAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGUpO1xuICAgICAgdGhpcy5kZWFjdGl2YXRlTW91c2UoKTtcbiAgICB9LFxuICAgIGRlYWN0aXZhdGVNb3VzZTogZnVuY3Rpb24oKSB7XG4gICAgICBwb2ludGVybWFwLmRlbGV0ZSh0aGlzLlBPSU5URVJfSUQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2FwdHVyZUluZm8gPSBkaXNwYXRjaGVyLmNhcHR1cmVJbmZvO1xuICB2YXIgZmluZFRhcmdldCA9IHRhcmdldGluZy5maW5kVGFyZ2V0LmJpbmQodGFyZ2V0aW5nKTtcbiAgdmFyIGFsbFNoYWRvd3MgPSB0YXJnZXRpbmcuYWxsU2hhZG93cy5iaW5kKHRhcmdldGluZyk7XG4gIHZhciBwb2ludGVybWFwJDEgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG5cbiAgLy8gVGhpcyBzaG91bGQgYmUgbG9uZyBlbm91Z2ggdG8gaWdub3JlIGNvbXBhdCBtb3VzZSBldmVudHMgbWFkZSBieSB0b3VjaFxuICB2YXIgREVEVVBfVElNRU9VVCA9IDI1MDA7XG4gIHZhciBDTElDS19DT1VOVF9USU1FT1VUID0gMjAwO1xuICB2YXIgQVRUUklCID0gJ3RvdWNoLWFjdGlvbic7XG4gIHZhciBJTlNUQUxMRVI7XG5cbiAgLy8gaGFuZGxlciBibG9jayBmb3IgbmF0aXZlIHRvdWNoIGV2ZW50c1xuICB2YXIgdG91Y2hFdmVudHMgPSB7XG4gICAgZXZlbnRzOiBbXG4gICAgICAndG91Y2hzdGFydCcsXG4gICAgICAndG91Y2htb3ZlJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAndG91Y2hjYW5jZWwnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBJTlNUQUxMRVIuZW5hYmxlT25TdWJ0cmVlKHRhcmdldCk7XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgLy8gVE9ETyhkZnJlZWRtYW4pOiBpcyBpdCB3b3J0aCBpdCB0byBkaXNjb25uZWN0IHRoZSBNTz9cbiAgICB9LFxuICAgIGVsZW1lbnRBZGRlZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBhID0gZWwuZ2V0QXR0cmlidXRlKEFUVFJJQik7XG4gICAgICB2YXIgc3QgPSB0aGlzLnRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlKGEpO1xuICAgICAgaWYgKHN0KSB7XG4gICAgICAgIGVsLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgIGRpc3BhdGNoZXIubGlzdGVuKGVsLCB0aGlzLmV2ZW50cyk7XG5cbiAgICAgICAgLy8gc2V0IHRvdWNoLWFjdGlvbiBvbiBzaGFkb3dzIGFzIHdlbGxcbiAgICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHMsIHRoaXMuZXZlbnRzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbGVtZW50UmVtb3ZlZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGVsLl9zY3JvbGxUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3RlbihlbCwgdGhpcy5ldmVudHMpO1xuXG4gICAgICAvLyByZW1vdmUgdG91Y2gtYWN0aW9uIGZyb20gc2hhZG93XG4gICAgICBhbGxTaGFkb3dzKGVsKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGlzcGF0Y2hlci51bmxpc3RlbihzLCB0aGlzLmV2ZW50cyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGVsZW1lbnRDaGFuZ2VkOiBmdW5jdGlvbihlbCwgb2xkVmFsdWUpIHtcbiAgICAgIHZhciBhID0gZWwuZ2V0QXR0cmlidXRlKEFUVFJJQik7XG4gICAgICB2YXIgc3QgPSB0aGlzLnRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlKGEpO1xuICAgICAgdmFyIG9sZFN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShvbGRWYWx1ZSk7XG5cbiAgICAgIC8vIHNpbXBseSB1cGRhdGUgc2Nyb2xsVHlwZSBpZiBsaXN0ZW5lcnMgYXJlIGFscmVhZHkgZXN0YWJsaXNoZWRcbiAgICAgIGlmIChzdCAmJiBvbGRTdCkge1xuICAgICAgICBlbC5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICBhbGxTaGFkb3dzKGVsKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIGlmIChvbGRTdCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZW1vdmVkKGVsKTtcbiAgICAgIH0gZWxzZSBpZiAoc3QpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50QWRkZWQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2Nyb2xsVHlwZXM6IHtcbiAgICAgIEVNSVRURVI6ICdub25lJyxcbiAgICAgIFhTQ1JPTExFUjogJ3Bhbi14JyxcbiAgICAgIFlTQ1JPTExFUjogJ3Bhbi15JyxcbiAgICAgIFNDUk9MTEVSOiAvXig/OnBhbi14IHBhbi15KXwoPzpwYW4teSBwYW4teCl8YXV0byQvXG4gICAgfSxcbiAgICB0b3VjaEFjdGlvblRvU2Nyb2xsVHlwZTogZnVuY3Rpb24odG91Y2hBY3Rpb24pIHtcbiAgICAgIHZhciB0ID0gdG91Y2hBY3Rpb247XG4gICAgICB2YXIgc3QgPSB0aGlzLnNjcm9sbFR5cGVzO1xuICAgICAgaWYgKHQgPT09ICdub25lJykge1xuICAgICAgICByZXR1cm4gJ25vbmUnO1xuICAgICAgfSBlbHNlIGlmICh0ID09PSBzdC5YU0NST0xMRVIpIHtcbiAgICAgICAgcmV0dXJuICdYJztcbiAgICAgIH0gZWxzZSBpZiAodCA9PT0gc3QuWVNDUk9MTEVSKSB7XG4gICAgICAgIHJldHVybiAnWSc7XG4gICAgICB9IGVsc2UgaWYgKHN0LlNDUk9MTEVSLmV4ZWModCkpIHtcbiAgICAgICAgcmV0dXJuICdYWSc7XG4gICAgICB9XG4gICAgfSxcbiAgICBQT0lOVEVSX1RZUEU6ICd0b3VjaCcsXG4gICAgZmlyc3RUb3VjaDogbnVsbCxcbiAgICBpc1ByaW1hcnlUb3VjaDogZnVuY3Rpb24oaW5Ub3VjaCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RUb3VjaCA9PT0gaW5Ub3VjaC5pZGVudGlmaWVyO1xuICAgIH0sXG4gICAgc2V0UHJpbWFyeVRvdWNoOiBmdW5jdGlvbihpblRvdWNoKSB7XG5cbiAgICAgIC8vIHNldCBwcmltYXJ5IHRvdWNoIGlmIHRoZXJlIG5vIHBvaW50ZXJzLCBvciB0aGUgb25seSBwb2ludGVyIGlzIHRoZSBtb3VzZVxuICAgICAgaWYgKHBvaW50ZXJtYXAkMS5zaXplID09PSAwIHx8IChwb2ludGVybWFwJDEuc2l6ZSA9PT0gMSAmJiBwb2ludGVybWFwJDEuaGFzKDEpKSkge1xuICAgICAgICB0aGlzLmZpcnN0VG91Y2ggPSBpblRvdWNoLmlkZW50aWZpZXI7XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IHsgWDogaW5Ub3VjaC5jbGllbnRYLCBZOiBpblRvdWNoLmNsaWVudFkgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW5jZWxSZXNldENsaWNrQ291bnQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZVByaW1hcnlQb2ludGVyOiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIGlmIChpblBvaW50ZXIuaXNQcmltYXJ5KSB7XG4gICAgICAgIHRoaXMuZmlyc3RUb3VjaCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzZXRDbGlja0NvdW50KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGlja0NvdW50OiAwLFxuICAgIHJlc2V0SWQ6IG51bGwsXG4gICAgcmVzZXRDbGlja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNsaWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0SWQgPSBudWxsO1xuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5yZXNldElkID0gc2V0VGltZW91dChmbiwgQ0xJQ0tfQ09VTlRfVElNRU9VVCk7XG4gICAgfSxcbiAgICBjYW5jZWxSZXNldENsaWNrQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMucmVzZXRJZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXNldElkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHR5cGVUb0J1dHRvbnM6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHZhciByZXQgPSAwO1xuICAgICAgaWYgKHR5cGUgPT09ICd0b3VjaHN0YXJ0JyB8fCB0eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICByZXQgPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHRvdWNoVG9Qb2ludGVyOiBmdW5jdGlvbihpblRvdWNoKSB7XG4gICAgICB2YXIgY3RlID0gdGhpcy5jdXJyZW50VG91Y2hFdmVudDtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5jbG9uZUV2ZW50KGluVG91Y2gpO1xuXG4gICAgICAvLyBXZSByZXNlcnZlIHBvaW50ZXJJZCAxIGZvciBNb3VzZS5cbiAgICAgIC8vIFRvdWNoIGlkZW50aWZpZXJzIGNhbiBzdGFydCBhdCAwLlxuICAgICAgLy8gQWRkIDIgdG8gdGhlIHRvdWNoIGlkZW50aWZpZXIgZm9yIGNvbXBhdGliaWxpdHkuXG4gICAgICB2YXIgaWQgPSBlLnBvaW50ZXJJZCA9IGluVG91Y2guaWRlbnRpZmllciArIDI7XG4gICAgICBlLnRhcmdldCA9IGNhcHR1cmVJbmZvW2lkXSB8fCBmaW5kVGFyZ2V0KGUpO1xuICAgICAgZS5idWJibGVzID0gdHJ1ZTtcbiAgICAgIGUuY2FuY2VsYWJsZSA9IHRydWU7XG4gICAgICBlLmRldGFpbCA9IHRoaXMuY2xpY2tDb3VudDtcbiAgICAgIGUuYnV0dG9uID0gMDtcbiAgICAgIGUuYnV0dG9ucyA9IHRoaXMudHlwZVRvQnV0dG9ucyhjdGUudHlwZSk7XG4gICAgICBlLndpZHRoID0gKGluVG91Y2gucmFkaXVzWCB8fCBpblRvdWNoLndlYmtpdFJhZGl1c1ggfHwgMCkgKiAyO1xuICAgICAgZS5oZWlnaHQgPSAoaW5Ub3VjaC5yYWRpdXNZIHx8IGluVG91Y2gud2Via2l0UmFkaXVzWSB8fCAwKSAqIDI7XG4gICAgICBlLnByZXNzdXJlID0gaW5Ub3VjaC5mb3JjZSB8fCBpblRvdWNoLndlYmtpdEZvcmNlIHx8IDAuNTtcbiAgICAgIGUuaXNQcmltYXJ5ID0gdGhpcy5pc1ByaW1hcnlUb3VjaChpblRvdWNoKTtcbiAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRTtcblxuICAgICAgLy8gZm9yd2FyZCBtb2RpZmllciBrZXlzXG4gICAgICBlLmFsdEtleSA9IGN0ZS5hbHRLZXk7XG4gICAgICBlLmN0cmxLZXkgPSBjdGUuY3RybEtleTtcbiAgICAgIGUubWV0YUtleSA9IGN0ZS5tZXRhS2V5O1xuICAgICAgZS5zaGlmdEtleSA9IGN0ZS5zaGlmdEtleTtcblxuICAgICAgLy8gZm9yd2FyZCB0b3VjaCBwcmV2ZW50RGVmYXVsdHNcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5maXJzdFhZID0gbnVsbDtcbiAgICAgICAgY3RlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBwcm9jZXNzVG91Y2hlczogZnVuY3Rpb24oaW5FdmVudCwgaW5GdW5jdGlvbikge1xuICAgICAgdmFyIHRsID0gaW5FdmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgICAgIHRoaXMuY3VycmVudFRvdWNoRXZlbnQgPSBpbkV2ZW50O1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHQ7IGkgPCB0bC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0ID0gdGxbaV07XG4gICAgICAgIGluRnVuY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnRvdWNoVG9Qb2ludGVyKHQpKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRm9yIHNpbmdsZSBheGlzIHNjcm9sbGVycywgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBlbWl0XG4gICAgLy8gcG9pbnRlciBldmVudHMgb3IgYmVoYXZlIGFzIGEgc2Nyb2xsZXJcbiAgICBzaG91bGRTY3JvbGw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmZpcnN0WFkpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgdmFyIHNjcm9sbEF4aXMgPSBpbkV2ZW50LmN1cnJlbnRUYXJnZXQuX3Njcm9sbFR5cGU7XG4gICAgICAgIGlmIChzY3JvbGxBeGlzID09PSAnbm9uZScpIHtcblxuICAgICAgICAgIC8vIHRoaXMgZWxlbWVudCBpcyBhIHRvdWNoLWFjdGlvbjogbm9uZSwgc2hvdWxkIG5ldmVyIHNjcm9sbFxuICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbEF4aXMgPT09ICdYWScpIHtcblxuICAgICAgICAgIC8vIHRoaXMgZWxlbWVudCBzaG91bGQgYWx3YXlzIHNjcm9sbFxuICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHQgPSBpbkV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAgICAgLy8gY2hlY2sgdGhlIGludGVuZGVkIHNjcm9sbCBheGlzLCBhbmQgb3RoZXIgYXhpc1xuICAgICAgICAgIHZhciBhID0gc2Nyb2xsQXhpcztcbiAgICAgICAgICB2YXIgb2EgPSBzY3JvbGxBeGlzID09PSAnWScgPyAnWCcgOiAnWSc7XG4gICAgICAgICAgdmFyIGRhID0gTWF0aC5hYnModFsnY2xpZW50JyArIGFdIC0gdGhpcy5maXJzdFhZW2FdKTtcbiAgICAgICAgICB2YXIgZG9hID0gTWF0aC5hYnModFsnY2xpZW50JyArIG9hXSAtIHRoaXMuZmlyc3RYWVtvYV0pO1xuXG4gICAgICAgICAgLy8gaWYgZGVsdGEgaW4gdGhlIHNjcm9sbCBheGlzID4gZGVsdGEgb3RoZXIgYXhpcywgc2Nyb2xsIGluc3RlYWQgb2ZcbiAgICAgICAgICAvLyBtYWtpbmcgZXZlbnRzXG4gICAgICAgICAgcmV0ID0gZGEgPj0gZG9hO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBmaW5kVG91Y2g6IGZ1bmN0aW9uKGluVEwsIGluSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaW5UTC5sZW5ndGgsIHQ7IGkgPCBsICYmICh0ID0gaW5UTFtpXSk7IGkrKykge1xuICAgICAgICBpZiAodC5pZGVudGlmaWVyID09PSBpbklkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gSW4gc29tZSBpbnN0YW5jZXMsIGEgdG91Y2hzdGFydCBjYW4gaGFwcGVuIHdpdGhvdXQgYSB0b3VjaGVuZC4gVGhpc1xuICAgIC8vIGxlYXZlcyB0aGUgcG9pbnRlcm1hcCBpbiBhIGJyb2tlbiBzdGF0ZS5cbiAgICAvLyBUaGVyZWZvcmUsIG9uIGV2ZXJ5IHRvdWNoc3RhcnQsIHdlIHJlbW92ZSB0aGUgdG91Y2hlcyB0aGF0IGRpZCBub3QgZmlyZSBhXG4gICAgLy8gdG91Y2hlbmQgZXZlbnQuXG4gICAgLy8gVG8ga2VlcCBzdGF0ZSBnbG9iYWxseSBjb25zaXN0ZW50LCB3ZSBmaXJlIGFcbiAgICAvLyBwb2ludGVyY2FuY2VsIGZvciB0aGlzIFwiYWJhbmRvbmVkXCIgdG91Y2hcbiAgICB2YWN1dW1Ub3VjaGVzOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgdGwgPSBpbkV2ZW50LnRvdWNoZXM7XG5cbiAgICAgIC8vIHBvaW50ZXJtYXAuc2l6ZSBzaG91bGQgYmUgPCB0bC5sZW5ndGggaGVyZSwgYXMgdGhlIHRvdWNoc3RhcnQgaGFzIG5vdFxuICAgICAgLy8gYmVlbiBwcm9jZXNzZWQgeWV0LlxuICAgICAgaWYgKHBvaW50ZXJtYXAkMS5zaXplID49IHRsLmxlbmd0aCkge1xuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBwb2ludGVybWFwJDEuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG5cbiAgICAgICAgICAvLyBOZXZlciByZW1vdmUgcG9pbnRlcklkID09IDEsIHdoaWNoIGlzIG1vdXNlLlxuICAgICAgICAgIC8vIFRvdWNoIGlkZW50aWZpZXJzIGFyZSAyIHNtYWxsZXIgdGhhbiB0aGVpciBwb2ludGVySWQsIHdoaWNoIGlzIHRoZVxuICAgICAgICAgIC8vIGluZGV4IGluIHBvaW50ZXJtYXAuXG4gICAgICAgICAgaWYgKGtleSAhPT0gMSAmJiAhdGhpcy5maW5kVG91Y2godGwsIGtleSAtIDIpKSB7XG4gICAgICAgICAgICB2YXIgcCA9IHZhbHVlLm91dDtcbiAgICAgICAgICAgIGQucHVzaChwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICBkLmZvckVhY2godGhpcy5jYW5jZWxPdXQsIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdG91Y2hzdGFydDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdGhpcy52YWN1dW1Ub3VjaGVzKGluRXZlbnQpO1xuICAgICAgdGhpcy5zZXRQcmltYXJ5VG91Y2goaW5FdmVudC5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB0aGlzLmRlZHVwU3ludGhNb3VzZShpbkV2ZW50KTtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgICAgdGhpcy5jbGlja0NvdW50Kys7XG4gICAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5vdmVyRG93bik7XG4gICAgICB9XG4gICAgfSxcbiAgICBvdmVyRG93bjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBwb2ludGVybWFwJDEuc2V0KGluUG9pbnRlci5wb2ludGVySWQsIHtcbiAgICAgICAgdGFyZ2V0OiBpblBvaW50ZXIudGFyZ2V0LFxuICAgICAgICBvdXQ6IGluUG9pbnRlcixcbiAgICAgICAgb3V0VGFyZ2V0OiBpblBvaW50ZXIudGFyZ2V0XG4gICAgICB9KTtcbiAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGluUG9pbnRlcik7XG4gICAgICBkaXNwYXRjaGVyLmRvd24oaW5Qb2ludGVyKTtcbiAgICB9LFxuICAgIHRvdWNobW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRTY3JvbGwoaW5FdmVudCkpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy50b3VjaGNhbmNlbChpbkV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzVG91Y2hlcyhpbkV2ZW50LCB0aGlzLm1vdmVPdmVyT3V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW92ZU92ZXJPdXQ6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgdmFyIGV2ZW50ID0gaW5Qb2ludGVyO1xuICAgICAgdmFyIHBvaW50ZXIgPSBwb2ludGVybWFwJDEuZ2V0KGV2ZW50LnBvaW50ZXJJZCk7XG5cbiAgICAgIC8vIGEgZmluZ2VyIGRyaWZ0ZWQgb2ZmIHRoZSBzY3JlZW4sIGlnbm9yZSBpdFxuICAgICAgaWYgKCFwb2ludGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBvdXRFdmVudCA9IHBvaW50ZXIub3V0O1xuICAgICAgdmFyIG91dFRhcmdldCA9IHBvaW50ZXIub3V0VGFyZ2V0O1xuICAgICAgZGlzcGF0Y2hlci5tb3ZlKGV2ZW50KTtcbiAgICAgIGlmIChvdXRFdmVudCAmJiBvdXRUYXJnZXQgIT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICBvdXRFdmVudC5yZWxhdGVkVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ID0gb3V0VGFyZ2V0O1xuXG4gICAgICAgIC8vIHJlY292ZXIgZnJvbSByZXRhcmdldGluZyBieSBzaGFkb3dcbiAgICAgICAgb3V0RXZlbnQudGFyZ2V0ID0gb3V0VGFyZ2V0O1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChvdXRFdmVudCk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gY2xlYW4gdXAgY2FzZSB3aGVuIGZpbmdlciBsZWF2ZXMgdGhlIHNjcmVlblxuICAgICAgICAgIGV2ZW50LnRhcmdldCA9IG91dFRhcmdldDtcbiAgICAgICAgICBldmVudC5yZWxhdGVkVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmNhbmNlbE91dChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBvaW50ZXIub3V0ID0gZXZlbnQ7XG4gICAgICBwb2ludGVyLm91dFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICB9LFxuICAgIHRvdWNoZW5kOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB0aGlzLmRlZHVwU3ludGhNb3VzZShpbkV2ZW50KTtcbiAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy51cE91dCk7XG4gICAgfSxcbiAgICB1cE91dDogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsaW5nKSB7XG4gICAgICAgIGRpc3BhdGNoZXIudXAoaW5Qb2ludGVyKTtcbiAgICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChpblBvaW50ZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGVhblVwUG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG4gICAgdG91Y2hjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5jYW5jZWxPdXQpO1xuICAgIH0sXG4gICAgY2FuY2VsT3V0OiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGluUG9pbnRlcik7XG4gICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KGluUG9pbnRlcik7XG4gICAgICB0aGlzLmNsZWFuVXBQb2ludGVyKGluUG9pbnRlcik7XG4gICAgfSxcbiAgICBjbGVhblVwUG9pbnRlcjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBwb2ludGVybWFwJDEuZGVsZXRlKGluUG9pbnRlci5wb2ludGVySWQpO1xuICAgICAgdGhpcy5yZW1vdmVQcmltYXJ5UG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG5cbiAgICAvLyBwcmV2ZW50IHN5bnRoIG1vdXNlIGV2ZW50cyBmcm9tIGNyZWF0aW5nIHBvaW50ZXIgZXZlbnRzXG4gICAgZGVkdXBTeW50aE1vdXNlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgbHRzID0gbW91c2VFdmVudHMubGFzdFRvdWNoZXM7XG4gICAgICB2YXIgdCA9IGluRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgIC8vIG9ubHkgdGhlIHByaW1hcnkgZmluZ2VyIHdpbGwgc3ludGggbW91c2UgZXZlbnRzXG4gICAgICBpZiAodGhpcy5pc1ByaW1hcnlUb3VjaCh0KSkge1xuXG4gICAgICAgIC8vIHJlbWVtYmVyIHgveSBvZiBsYXN0IHRvdWNoXG4gICAgICAgIHZhciBsdCA9IHsgeDogdC5jbGllbnRYLCB5OiB0LmNsaWVudFkgfTtcbiAgICAgICAgbHRzLnB1c2gobHQpO1xuICAgICAgICB2YXIgZm4gPSAoZnVuY3Rpb24obHRzLCBsdCkge1xuICAgICAgICAgIHZhciBpID0gbHRzLmluZGV4T2YobHQpO1xuICAgICAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKG51bGwsIGx0cywgbHQpO1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCBERURVUF9USU1FT1VUKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSU5TVEFMTEVSID0gbmV3IEluc3RhbGxlcih0b3VjaEV2ZW50cy5lbGVtZW50QWRkZWQsIHRvdWNoRXZlbnRzLmVsZW1lbnRSZW1vdmVkLFxuICAgIHRvdWNoRXZlbnRzLmVsZW1lbnRDaGFuZ2VkLCB0b3VjaEV2ZW50cyk7XG5cbiAgdmFyIHBvaW50ZXJtYXAkMiA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcDtcbiAgdmFyIEhBU19CSVRNQVBfVFlQRSA9IHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJlxuICAgIHR5cGVvZiB3aW5kb3cuTVNQb2ludGVyRXZlbnQuTVNQT0lOVEVSX1RZUEVfTU9VU0UgPT09ICdudW1iZXInO1xuICB2YXIgbXNFdmVudHMgPSB7XG4gICAgZXZlbnRzOiBbXG4gICAgICAnTVNQb2ludGVyRG93bicsXG4gICAgICAnTVNQb2ludGVyTW92ZScsXG4gICAgICAnTVNQb2ludGVyVXAnLFxuICAgICAgJ01TUG9pbnRlck91dCcsXG4gICAgICAnTVNQb2ludGVyT3ZlcicsXG4gICAgICAnTVNQb2ludGVyQ2FuY2VsJyxcbiAgICAgICdNU0dvdFBvaW50ZXJDYXB0dXJlJyxcbiAgICAgICdNU0xvc3RQb2ludGVyQ2FwdHVyZSdcbiAgICBdLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKHRhcmdldCwgdGhpcy5ldmVudHMpO1xuICAgIH0sXG4gICAgUE9JTlRFUl9UWVBFUzogW1xuICAgICAgJycsXG4gICAgICAndW5hdmFpbGFibGUnLFxuICAgICAgJ3RvdWNoJyxcbiAgICAgICdwZW4nLFxuICAgICAgJ21vdXNlJ1xuICAgIF0sXG4gICAgcHJlcGFyZUV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGluRXZlbnQ7XG4gICAgICBpZiAoSEFTX0JJVE1BUF9UWVBFKSB7XG4gICAgICAgIGUgPSBkaXNwYXRjaGVyLmNsb25lRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRVNbaW5FdmVudC5wb2ludGVyVHlwZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuICAgIGNsZWFudXA6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBwb2ludGVybWFwJDIuZGVsZXRlKGlkKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlckRvd246IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHBvaW50ZXJtYXAkMi5zZXQoaW5FdmVudC5wb2ludGVySWQsIGluRXZlbnQpO1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZG93bihlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJVcDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIudXAoZSk7XG4gICAgICB0aGlzLmNsZWFudXAoaW5FdmVudC5wb2ludGVySWQpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyT3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck92ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlckNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuY2FuY2VsKGUpO1xuICAgICAgdGhpcy5jbGVhbnVwKGluRXZlbnQucG9pbnRlcklkKTtcbiAgICB9LFxuICAgIE1TTG9zdFBvaW50ZXJDYXB0dXJlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIubWFrZUV2ZW50KCdsb3N0cG9pbnRlcmNhcHR1cmUnLCBpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9LFxuICAgIE1TR290UG9pbnRlckNhcHR1cmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5tYWtlRXZlbnQoJ2dvdHBvaW50ZXJjYXB0dXJlJywgaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGFwcGx5UG9seWZpbGwoKSB7XG5cbiAgICAvLyBvbmx5IGFjdGl2YXRlIGlmIHRoaXMgcGxhdGZvcm0gZG9lcyBub3QgaGF2ZSBwb2ludGVyIGV2ZW50c1xuICAgIGlmICghd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgICAgd2luZG93LlBvaW50ZXJFdmVudCA9IFBvaW50ZXJFdmVudDtcblxuICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgICAgICB2YXIgdHAgPSB3aW5kb3cubmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHM7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cubmF2aWdhdG9yLCAnbWF4VG91Y2hQb2ludHMnLCB7XG4gICAgICAgICAgdmFsdWU6IHRwLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXJTb3VyY2UoJ21zJywgbXNFdmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5uYXZpZ2F0b3IsICdtYXhUb3VjaFBvaW50cycsIHtcbiAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCdtb3VzZScsIG1vdXNlRXZlbnRzKTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbnRvdWNoc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXJTb3VyY2UoJ3RvdWNoJywgdG91Y2hFdmVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXIoZG9jdW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBuID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgdmFyIHM7XG4gIHZhciByO1xuICB2YXIgaDtcbiAgZnVuY3Rpb24gYXNzZXJ0QWN0aXZlKGlkKSB7XG4gICAgaWYgKCFkaXNwYXRjaGVyLnBvaW50ZXJtYXAuaGFzKGlkKSkge1xuICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdJbnZhbGlkUG9pbnRlcklkJyk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFsaWRQb2ludGVySWQnO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFzc2VydENvbm5lY3RlZChlbGVtKSB7XG4gICAgdmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZWxlbS5vd25lckRvY3VtZW50KSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignSW52YWxpZFN0YXRlRXJyb3InKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YWxpZFN0YXRlRXJyb3InO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGluQWN0aXZlQnV0dG9uU3RhdGUoaWQpIHtcbiAgICB2YXIgcCA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcC5nZXQoaWQpO1xuICAgIHJldHVybiBwLmJ1dHRvbnMgIT09IDA7XG4gIH1cbiAgaWYgKG4ubXNQb2ludGVyRW5hYmxlZCkge1xuICAgIHMgPSBmdW5jdGlvbihwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgYXNzZXJ0Q29ubmVjdGVkKHRoaXMpO1xuICAgICAgaWYgKGluQWN0aXZlQnV0dG9uU3RhdGUocG9pbnRlcklkKSkge1xuICAgICAgICBkaXNwYXRjaGVyLnNldENhcHR1cmUocG9pbnRlcklkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tc1NldFBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByID0gZnVuY3Rpb24ocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGRpc3BhdGNoZXIucmVsZWFzZUNhcHR1cmUocG9pbnRlcklkLCB0cnVlKTtcbiAgICAgIHRoaXMubXNSZWxlYXNlUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHMgPSBmdW5jdGlvbiBzZXRQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgYXNzZXJ0Q29ubmVjdGVkKHRoaXMpO1xuICAgICAgaWYgKGluQWN0aXZlQnV0dG9uU3RhdGUocG9pbnRlcklkKSkge1xuICAgICAgICBkaXNwYXRjaGVyLnNldENhcHR1cmUocG9pbnRlcklkLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHIgPSBmdW5jdGlvbiByZWxlYXNlUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGRpc3BhdGNoZXIucmVsZWFzZUNhcHR1cmUocG9pbnRlcklkKTtcbiAgICB9O1xuICB9XG4gIGggPSBmdW5jdGlvbiBoYXNQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpIHtcbiAgICByZXR1cm4gISFkaXNwYXRjaGVyLmNhcHR1cmVJbmZvW3BvaW50ZXJJZF07XG4gIH07XG5cbiAgZnVuY3Rpb24gYXBwbHlQb2x5ZmlsbCQxKCkge1xuICAgIGlmICh3aW5kb3cuRWxlbWVudCAmJiAhRWxlbWVudC5wcm90b3R5cGUuc2V0UG9pbnRlckNhcHR1cmUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICAgICdzZXRQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogc1xuICAgICAgICB9LFxuICAgICAgICAncmVsZWFzZVBvaW50ZXJDYXB0dXJlJzoge1xuICAgICAgICAgIHZhbHVlOiByXG4gICAgICAgIH0sXG4gICAgICAgICdoYXNQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogaFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhcHBseUF0dHJpYnV0ZVN0eWxlcygpO1xuICBhcHBseVBvbHlmaWxsKCk7XG4gIGFwcGx5UG9seWZpbGwkMSgpO1xuXG4gIHZhciBwb2ludGVyZXZlbnRzID0ge1xuICAgIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXIsXG4gICAgSW5zdGFsbGVyOiBJbnN0YWxsZXIsXG4gICAgUG9pbnRlckV2ZW50OiBQb2ludGVyRXZlbnQsXG4gICAgUG9pbnRlck1hcDogUG9pbnRlck1hcCxcbiAgICB0YXJnZXRGaW5kaW5nOiB0YXJnZXRpbmdcbiAgfTtcblxuICByZXR1cm4gcG9pbnRlcmV2ZW50cztcblxufSkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3BlcGpzL2Rpc3QvcGVwLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG4vLyBPbiBzb21lIGV4b3RpYyBlbnZpcm9ubWVudHMsIGl0J3Mgbm90IGNsZWFyIHdoaWNoIG9iamVjdCBgc2V0aW1tZWlkYXRlYCB3YXNcbi8vIGFibGUgdG8gaW5zdGFsbCBvbnRvLiAgU2VhcmNoIGVhY2ggcG9zc2liaWxpdHkgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlXG4vLyBgc2V0aW1tZWRpYXRlYCBsaWJyYXJ5LlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuc2V0SW1tZWRpYXRlKTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5jbGVhckltbWVkaWF0ZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XG59IGNhdGNoKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcblx0XHRnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XG5pbXBvcnQgeyBXaWRnZXRQcm9wZXJ0aWVzLCBXTm9kZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBNZW51SXRlbSwgTWVudUl0ZW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vbWVudS1pdGVtL01lbnVJdGVtJztcblxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudS5tLmNzcyc7XG5cbmludGVyZmFjZSBNZW51UHJvcGVydGllcyBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB2b2lkO1xufVxuXG5AY3VzdG9tRWxlbWVudDxNZW51UHJvcGVydGllcz4oe1xuXHR0YWc6ICdkZW1vLW1lbnUnLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddXG59KVxuQHRoZW1lKGNzcylcbmV4cG9ydCBjbGFzcyBNZW51IGV4dGVuZHMgVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk8TWVudVByb3BlcnRpZXMsIFdOb2RlPE1lbnVJdGVtPj4ge1xuXHRwcml2YXRlIF9zZWxlY3RlZElkOiBudW1iZXI7XG5cblx0cHJpdmF0ZSBfb25TZWxlY3RlZChpZDogbnVtYmVyLCBkYXRhOiBhbnkpIHtcblx0XHR0aGlzLl9zZWxlY3RlZElkID0gaWQ7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uU2VsZWN0ZWQoZGF0YSk7XG5cdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnRpZXM6IFBhcnRpYWw8TWVudUl0ZW1Qcm9wZXJ0aWVzPiA9IHtcblx0XHRcdFx0XHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9vblNlbGVjdGVkKGluZGV4LCBkYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmICh0aGlzLl9zZWxlY3RlZElkICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzLnNlbGVjdGVkID0gaW5kZXggPT09IHRoaXMuX3NlbGVjdGVkSWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGQucHJvcGVydGllcyA9IHsgLi4uY2hpbGQucHJvcGVydGllcywgLi4ucHJvcGVydGllcyB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoaWxkO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHYoJ25hdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xuXHRcdFx0dihcblx0XHRcdFx0J29sJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm1lbnVDb250YWluZXIpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGl0ZW1zXG5cdFx0XHQpXG5cdFx0XSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVudTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfbWVudSEuL3NyYy9tZW51L01lbnUudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwibWVudVwiLFwicm9vdFwiOlwiXzNiQTZqZFNuXCIsXCJtZW51Q29udGFpbmVyXCI6XCJfMWVvR2Zxa3VcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tZW51L21lbnUubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51Il0sInNvdXJjZVJvb3QiOiIifQ==