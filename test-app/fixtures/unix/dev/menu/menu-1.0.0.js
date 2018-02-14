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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDNkZmNjMWU0ZDRlYjI2MWY3YzMiLCJ3ZWJwYWNrOi8vL0Rlc3Ryb3lhYmxlLnRzIiwid2VicGFjazovLy9FdmVudGVkLnRzIiwid2VicGFjazovLy9hc3BlY3QudHMiLCJ3ZWJwYWNrOi8vL2xhbmcudHMiLCJ3ZWJwYWNrOi8vL2hhcy50cyIsIndlYnBhY2s6Ly8vTWFwLnRzIiwid2VicGFjazovLy9Qcm9taXNlLnRzIiwid2VicGFjazovLy9TeW1ib2wudHMiLCJ3ZWJwYWNrOi8vL1dlYWtNYXAudHMiLCJ3ZWJwYWNrOi8vL2FycmF5LnRzIiwid2VicGFjazovLy9nbG9iYWwudHMiLCJ3ZWJwYWNrOi8vL2l0ZXJhdG9yLnRzIiwid2VicGFjazovLy9udW1iZXIudHMiLCJ3ZWJwYWNrOi8vL29iamVjdC50cyIsIndlYnBhY2s6Ly8vc3RyaW5nLnRzIiwid2VicGFjazovLy9xdWV1ZS50cyIsIndlYnBhY2s6Ly8vdXRpbC50cyIsIndlYnBhY2s6Ly8vSW5qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL05vZGVIYW5kbGVyLnRzIiwid2VicGFjazovLy9SZWdpc3RyeS50cyIsIndlYnBhY2s6Ly8vUmVnaXN0cnlIYW5kbGVyLnRzIiwid2VicGFjazovLy9XaWRnZXRCYXNlLnRzIiwid2VicGFjazovLy9jc3NUcmFuc2l0aW9ucy50cyIsIndlYnBhY2s6Ly8vY3VzdG9tRWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vL2QudHMiLCJ3ZWJwYWNrOi8vL2FmdGVyUmVuZGVyLnRzIiwid2VicGFjazovLy9iZWZvcmVQcm9wZXJ0aWVzLnRzIiwid2VicGFjazovLy9jdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9kaWZmUHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vL2hhbmRsZURlY29yYXRvci50cyIsIndlYnBhY2s6Ly8vaW5qZWN0LnRzIiwid2VicGFjazovLy9kaWZmLnRzIiwid2VicGFjazovLy9Qcm9qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL1RoZW1lZC50cyIsIndlYnBhY2s6Ly8vcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9Eb21XcmFwcGVyLnRzIiwid2VicGFjazovLy92ZG9tLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/NWQ0MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7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QU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckIsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsd0JBQXdCO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLHlCQUF5QixFQUFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsdUJBQXVCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0NBQXdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUNBQXlDLHdCQUF3QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDLEc7Ozs7Ozs7QUNoOENEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FB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RCxHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVcsSUFBSyxTQUFTLEVBQUU7b0JBQ25DLFVBQVUsQ0FBQyxTQUFRLEVBQUcsTUFBSyxJQUFLLEtBQUksQ0FBQyxXQUFXO2dCQUNqRDtnQkFDQSxLQUFLLENBQUMsV0FBVSx1QkFBUSxLQUFLLENBQUMsVUFBVSxFQUFLLFVBQVUsQ0FBRTtZQUMxRDtZQUNBLE9BQU8sS0FBSztRQUNiLENBQUMsQ0FBQztRQUVGLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2xELEtBQUMsQ0FDQSxJQUFJLEVBQ0o7Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWE7YUFDckMsRUFDRCxLQUFLO1NBRU4sQ0FBQztJQUNILENBQUM7SUFsQ1csS0FBSTtRQUxoQiw2QkFBYSxDQUFpQjtZQUM5QixHQUFHLEVBQUUsV0FBVztZQUNoQixNQUFNLEVBQUUsQ0FBQyxZQUFZO1NBQ3JCLENBQUM7UUFDRCxjQUFLLENBQUMsR0FBRztPQUNHLElBQUksQ0FtQ2hCO0lBQUQsV0FBQztDQW5DRCxDQUEwQixvQkFBVyxDQUFDLHVCQUFVLENBQUM7QUFBcEM7QUFxQ2Isa0JBQWUsSUFBSTs7Ozs7Ozs7QUN2RG5CO0FBQ0Esa0JBQWtCLCtEIiwiZmlsZSI6Im1lbnUtMS4wLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkM2RmY2MxZTRkNGViMjYxZjdjMyIsImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdAZG9qby9zaGltL1Byb21pc2UnO1xuXG4vKipcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBub29wKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbn07XG5cbi8qKlxuICogTm8gb3AgZnVuY3Rpb24gdXNlZCB0byByZXBsYWNlIG93biwgb25jZSBpbnN0YW5jZSBoYXMgYmVlbiBkZXN0b3J5ZWRcbiAqL1xuZnVuY3Rpb24gZGVzdHJveWVkKCk6IG5ldmVyIHtcblx0dGhyb3cgbmV3IEVycm9yKCdDYWxsIG1hZGUgdG8gZGVzdHJveWVkIG1ldGhvZCcpO1xufTtcblxuZXhwb3J0IGNsYXNzIERlc3Ryb3lhYmxlIHtcblx0LyoqXG5cdCAqIHJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cHJpdmF0ZSBoYW5kbGVzOiBIYW5kbGVbXTtcblxuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmhhbmRsZXMgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2UgdGhhdCB3aWxsIGJlIGRlc3Ryb3llZCB3aGVuIGB0aGlzLmRlc3Ryb3lgIGlzIGNhbGxlZFxuXHQgKlxuXHQgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2Vcblx0ICogQHJldHVybnMge0hhbmRsZX0gYSBoYW5kbGUgZm9yIHRoZSBoYW5kbGUsIHJlbW92ZXMgdGhlIGhhbmRsZSBmb3IgdGhlIGluc3RhbmNlIGFuZCBjYWxscyBkZXN0cm95XG5cdCAqL1xuXHRvd24oaGFuZGxlOiBIYW5kbGUpOiBIYW5kbGUge1xuXHRcdGNvbnN0IHsgaGFuZGxlcyB9ID0gdGhpcztcblx0XHRoYW5kbGVzLnB1c2goaGFuZGxlKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGVzdHJveSgpIHtcblx0XHRcdFx0aGFuZGxlcy5zcGxpY2UoaGFuZGxlcy5pbmRleE9mKGhhbmRsZSkpO1xuXHRcdFx0XHRoYW5kbGUuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJweXMgYWxsIGhhbmRlcnMgcmVnaXN0ZXJlZCBmb3IgdGhlIGluc3RhbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPGFueX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgaGFuZGxlcyBoYXZlIGJlZW4gZGVzdHJveWVkXG5cdCAqL1xuXHRkZXN0cm95KCk6IFByb21pc2U8YW55PiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHR0aGlzLmhhbmRsZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiB7XG5cdFx0XHRcdGhhbmRsZSAmJiBoYW5kbGUuZGVzdHJveSAmJiBoYW5kbGUuZGVzdHJveSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBub29wO1xuXHRcdFx0dGhpcy5vd24gPSBkZXN0cm95ZWQ7XG5cdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlc3Ryb3lhYmxlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIERlc3Ryb3lhYmxlLnRzIiwiaW1wb3J0IHsgQWN0aW9uYWJsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvYWJpbGl0aWVzJztcbmltcG9ydCB7IEV2ZW50ZWRMaXN0ZW5lciwgRXZlbnRlZExpc3RlbmVyT3JBcnJheSwgRXZlbnRlZExpc3RlbmVyc01hcCB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvYmFzZXMnO1xuaW1wb3J0IHsgRXZlbnRUYXJnZXR0ZWRPYmplY3QsIEV2ZW50RXJyb3JPYmplY3QsIEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IG9uIGFzIGFzcGVjdE9uIH0gZnJvbSAnLi9hc3BlY3QnO1xuaW1wb3J0IHsgRGVzdHJveWFibGUgfSBmcm9tICcuL0Rlc3Ryb3lhYmxlJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSB2YWx1ZSBpcyBBY3Rpb25hYmxlIChoYXMgYSBgLmRvYCBmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaXMgdGhlIHZhbHVlIGlzIEFjdGlvbmFibGVcbiAqL1xuZnVuY3Rpb24gaXNBY3Rpb25hYmxlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBBY3Rpb25hYmxlPGFueSwgYW55PiB7XG5cdHJldHVybiBCb29sZWFuKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5kbyA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBsaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVMaXN0ZW5lcjxULCBFIGV4dGVuZHMgRXZlbnRUYXJnZXR0ZWRPYmplY3Q8VD4+KGxpc3RlbmVyOiBFdmVudGVkTGlzdGVuZXI8VCwgRT4pOiBFdmVudGVkQ2FsbGJhY2s8RT4ge1xuXHRyZXR1cm4gaXNBY3Rpb25hYmxlKGxpc3RlbmVyKSA/IChldmVudDogRSkgPT4gbGlzdGVuZXIuZG8oeyBldmVudCB9KSA6IGxpc3RlbmVyO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgYW4gYXJyYXkgb2YgaGFuZGxlc1xuICpcbiAqIEBwYXJhbSBoYW5kbGVzIGFuIGFycmF5IG9mIGhhbmRsZXNcbiAqIEByZXR1cm5zIGEgc2luZ2xlIEhhbmRsZSBmb3IgaGFuZGxlcyBwYXNzZWRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlczogSGFuZGxlW10pOiBIYW5kbGUge1xuXHRyZXR1cm4ge1xuXHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRoYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlLmRlc3Ryb3koKSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGV2ZW50IG9iamVjdCwgd2hpY2ggcHJvdmlkZXMgYSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudE9iamVjdCB7XG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZXZlbnRcblx0ICovXG5cdHJlYWRvbmx5IHR5cGU6IHN0cmluZyB8IHN5bWJvbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkQ2FsbGJhY2s8RSBleHRlbmRzIEV2ZW50T2JqZWN0PiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgYW4gYGV2ZW50YCBhcmd1bWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IG9iamVjdFxuXHQgKi9cblx0KGV2ZW50OiBFKTogYm9vbGVhbiB8IHZvaWQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBFdmVudGVkIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBPcHRpb25hbCBsaXN0ZW5lcnMgdG8gYWRkXG5cdCAqL1xuXHRsaXN0ZW5lcnM/OiBFdmVudGVkTGlzdGVuZXJzTWFwPGFueT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZUV2ZW50ZWRFdmVudHMge1xuXHQvKipcblx0ICogUmVnc2lzdGVyIGEgY2FsbGJhY2sgZm9yIGEgc3BlY2lmaWMgZXZlbnQgdHlwZVxuXHQgKlxuXHQgKiBAcGFyYW0gbGlzdGVuZXJzIG1hcCBvZiBsaXN0ZW5lcnNcblx0ICovXG5cdChsaXN0ZW5lcnM6IEV2ZW50ZWRMaXN0ZW5lcnNNYXA8RXZlbnRlZD4pOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBldmVudFxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGF0dGFjaFxuXHQgKi9cblx0KHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXk8RXZlbnRlZCwgRXZlbnRUYXJnZXR0ZWRPYmplY3Q8RXZlbnRlZD4+KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBmb3IgYGVycm9yYFxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGF0dGFjaFxuXHQgKi9cblx0KHR5cGU6ICdlcnJvcicsIGxpc3RlbmVyOiBFdmVudGVkTGlzdGVuZXJPckFycmF5PEV2ZW50ZWQsIEV2ZW50RXJyb3JPYmplY3Q8RXZlbnRlZD4+KTogSGFuZGxlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50ZWQge1xuXHRvbjogQmFzZUV2ZW50ZWRFdmVudHM7XG59XG5cbi8qKlxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xuICovXG5jb25zdCByZWdleE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBSZWdFeHA+KCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpcyB0aGUgZXZlbnQgdHlwZSBnbG9iIGhhcyBiZWVuIG1hdGNoZWRcbiAqXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmc6IHN0cmluZyB8IHN5bWJvbCwgdGFyZ2V0U3RyaW5nOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcblx0aWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcblx0XHRsZXQgcmVnZXg6IFJlZ0V4cDtcblx0XHRpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XG5cdFx0XHRyZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKSE7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKGBeJHsgZ2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJykgfSRgKTtcblx0XHRcdHJlZ2V4TWFwLnNldChnbG9iU3RyaW5nLCByZWdleCk7XG5cdFx0fVxuXHRcdHJldHVybiByZWdleC50ZXN0KHRhcmdldFN0cmluZyk7XG5cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZ2xvYlN0cmluZyA9PT0gdGFyZ2V0U3RyaW5nO1xuXHR9XG59XG5cbi8qKlxuICogRXZlbnQgQ2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50ZWQgZXh0ZW5kcyBEZXN0cm95YWJsZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xuXG5cdC8qKlxuXHQgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcblx0ICovXG5cdHByb3RlY3RlZCBsaXN0ZW5lcnNNYXA6IE1hcDxzdHJpbmcsIEV2ZW50ZWRDYWxsYmFjazxFdmVudE9iamVjdD4+ID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50ZWRDYWxsYmFjazxFdmVudE9iamVjdD4+KCk7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0gb3B0aW9ucyBUaGUgY29uc3RydWN0b3IgYXJndXJtZW50c1xuXHQgKi9cblx0Y29uc3RydWN0b3Iob3B0aW9uczogRXZlbnRlZE9wdGlvbnMgPSB7fSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0Y29uc3QgeyBsaXN0ZW5lcnMgfSA9IG9wdGlvbnM7XG5cdFx0aWYgKGxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5vd24odGhpcy5vbihsaXN0ZW5lcnMpKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRW1pdHMgdGhlIGV2ZW50IG9iamV0IGZvciB0aGUgc3BlY2lmaWVkIHR5cGVcblx0ICpcblx0ICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBlbWl0XG5cdCAqL1xuXHRlbWl0PEUgZXh0ZW5kcyBFdmVudE9iamVjdD4oZXZlbnQ6IEUpOiB2b2lkIHtcblx0XHR0aGlzLmxpc3RlbmVyc01hcC5mb3JFYWNoKChtZXRob2QsIHR5cGUpID0+IHtcblx0XHRcdGlmIChpc0dsb2JNYXRjaCh0eXBlLCBldmVudC50eXBlKSkge1xuXHRcdFx0XHRtZXRob2QuY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2F0Y2ggYWxsIGhhbmRsZXIgZm9yIHZhcmlvdXMgY2FsbCBzaWduYXR1cmVzLiBUaGUgc2lnbmF0dXJlcyBhcmUgZGVmaW5lZCBpblxuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgWW91IGNhbiBhZGQgeW91ciBvd24gZXZlbnQgdHlwZSAtPiBoYW5kbGVyIHR5cGVzIGJ5IGV4dGVuZGluZ1xuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgU2VlIGV4YW1wbGUgZm9yIGRldGFpbHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhcmdzXG5cdCAqXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIGludGVyZmFjZSBXaWRnZXRCYXNlRXZlbnRzIGV4dGVuZHMgQmFzZUV2ZW50ZWRFdmVudHMge1xuXHQgKiAgICAgKHR5cGU6ICdwcm9wZXJ0aWVzOmNoYW5nZWQnLCBoYW5kbGVyOiBQcm9wZXJ0aWVzQ2hhbmdlZEhhbmRsZXIpOiBIYW5kbGU7XG5cdCAqIH1cblx0ICogY2xhc3MgV2lkZ2V0QmFzZSBleHRlbmRzIEV2ZW50ZWQge1xuXHQgKiAgICBvbjogV2lkZ2V0QmFzZUV2ZW50cztcblx0ICogfVxuXHQgKlxuXHQgKiBAcmV0dXJuIHthbnl9XG5cdCAqL1xuXHRvbjogQmFzZUV2ZW50ZWRFdmVudHMgPSBmdW5jdGlvbiAodGhpczogRXZlbnRlZCwgLi4uYXJnczogYW55W10pIHtcblx0XHRpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcblx0XHRcdGNvbnN0IFsgdHlwZSwgbGlzdGVuZXJzIF0gPSA8WyBzdHJpbmcsIEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXk8YW55LCBFdmVudFRhcmdldHRlZE9iamVjdDxhbnk+Pl0+IGFyZ3M7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZXMgPSBsaXN0ZW5lcnMubWFwKChsaXN0ZW5lcikgPT4gYXNwZWN0T24odGhpcy5saXN0ZW5lcnNNYXAsIHR5cGUsIHJlc29sdmVMaXN0ZW5lcihsaXN0ZW5lcikpKTtcblx0XHRcdFx0cmV0dXJuIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBhc3BlY3RPbih0aGlzLmxpc3RlbmVyc01hcCwgdHlwZSwgcmVzb2x2ZUxpc3RlbmVyKGxpc3RlbmVycykpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0Y29uc3QgWyBsaXN0ZW5lck1hcEFyZyBdID0gPFtFdmVudGVkTGlzdGVuZXJzTWFwPGFueT5dPiBhcmdzO1xuXHRcdFx0Y29uc3QgaGFuZGxlcyA9IE9iamVjdC5rZXlzKGxpc3RlbmVyTWFwQXJnKS5tYXAoKHR5cGUpID0+IHRoaXMub24odHlwZSwgbGlzdGVuZXJNYXBBcmdbdHlwZV0pKTtcblx0XHRcdHJldHVybiBoYW5kbGVzQXJyYXl0b0hhbmRsZShoYW5kbGVzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cycpO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRlZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBFdmVudGVkLnRzIiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9jb3JlJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyBjcmVhdGVIYW5kbGUgfSBmcm9tICcuL2xhbmcnO1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IHByb3ZpZGVzIHRoZSBuZWNlc3NhcnkgQVBJcyB0byBiZSBNYXBMaWtlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFwTGlrZTxLLCBWPiB7XG5cdGdldChrZXk6IEspOiBWO1xuXHRzZXQoa2V5OiBLLCB2YWx1ZT86IFYpOiB0aGlzO1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIHR5cGUgZ3VhcmQgdGhhdCBkZXRlcm1pbmVzIGlmIGFuIHZhbHVlIGlzIE1hcExpa2Ugb3Igbm90XG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBndWFyZCBhZ2FpbnN0XG4gKi9cbmZ1bmN0aW9uIGlzTWFwTGlrZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgTWFwTGlrZTxhbnksIGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUuc2V0ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGV4YWJsZSB7XG5cdFttZXRob2Q6IHN0cmluZ106IGFueTtcbn1cblxuLyoqXG4gKiBUaGUgdHlwZXMgb2Ygb2JqZWN0cyBvciBtYXBzIHdoZXJlIGFkdmljZSBjYW4gYmUgYXBwbGllZFxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRhYmxlID0gTWFwTGlrZTxzdHJpbmcsIGFueT4gfCBJbmRleGFibGU7XG5cbnR5cGUgQWR2aWNlVHlwZSA9ICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhcm91bmQnO1xuXG4vKipcbiAqIEEgbWV0YSBkYXRhIHN0cnVjdHVyZSB3aGVuIGFwcGx5aW5nIGFkdmljZVxuICovXG5pbnRlcmZhY2UgQWR2aXNlZCB7XG5cdHJlYWRvbmx5IGlkPzogbnVtYmVyO1xuXHRhZHZpY2U/OiBGdW5jdGlvbjtcblx0cHJldmlvdXM/OiBBZHZpc2VkO1xuXHRuZXh0PzogQWR2aXNlZDtcblx0cmVhZG9ubHkgcmVjZWl2ZUFyZ3VtZW50cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgYWR2aWNlIHdoaWNoIGlzIGRlY29yYXRlZCB3aXRoIGFkZGl0aW9uYWxcbiAqIG1ldGEgZGF0YSBhYm91dCB0aGUgYWR2aWNlIHRvIGFwcGx5XG4gKi9cbmludGVyZmFjZSBEaXNwYXRjaGVyIHtcblx0WyB0eXBlOiBzdHJpbmcgXTogQWR2aXNlZCB8IHVuZGVmaW5lZDtcblx0KCk6IGFueTtcblx0dGFyZ2V0OiBhbnk7XG5cdGJlZm9yZT86IEFkdmlzZWQ7XG5cdGFyb3VuZD86IEFkdmlzZWQ7XG5cdGFmdGVyPzogQWR2aXNlZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnREaXNwYXRjaEFkdmljZTxUPiB7XG5cdGJlZm9yZT86IEpvaW5Qb2ludEJlZm9yZUFkdmljZVtdO1xuXHRhZnRlcj86IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+W107XG5cdHJlYWRvbmx5IGpvaW5Qb2ludDogRnVuY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4ge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmFmdGVyKiwgcmVjZWl2aW5nIHRoZSByZXN1bHQgYW5kIGFyZ3VtZW50cyBmcm9tIHRoZSBqb2luIHBvaW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzdWx0IFRoZSByZXN1bHQgZnJvbSB0aGUgZnVuY3Rpb24gYmVpbmcgYWR2aXNlZFxuXHQgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRoYXQgd2VyZSBzdXBwbGllZCB0byB0aGUgYWR2aXNlZCBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyBUaGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgYWR2aWNlIGlzIHRoZW4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBtZXRob2Rcblx0ICovXG5cdChyZXN1bHQ6IFQsIC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4ge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmFyb3VuZCouICBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIGFuZFxuXHQgKiBuZWVkcyB0byByZXR1cm4gYSBuZXcgZnVuY3Rpb24gd2hpY2ggd2lsbCB0aGVuIGludm9rZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBvcmlnRm4gVGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHdpbGwgaW52b2tlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cblx0ICovXG5cdChvcmlnRm46IEdlbmVyaWNGdW5jdGlvbjxUPik6ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnRCZWZvcmVBZHZpY2Uge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmJlZm9yZSosIHJlY2VpdmluZyB0aGUgb3JpZ2luYWwgYXJndW1lbnRzLCBpZiB0aGUgYWR2aXNpbmdcblx0ICogZnVuY3Rpb24gcmV0dXJucyBhIHZhbHVlLCBpdCBpcyBwYXNzZWQgZnVydGhlciBhbG9uZyB0YWtpbmcgdGhlIHBsYWNlIG9mIHRoZSBvcmlnaW5hbFxuXHQgKiBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdGhlIG1ldGhvZCB3YXMgY2FsbGVkIHdpdGhcblx0ICovXG5cdCguLi5hcmdzOiBhbnlbXSk6IGFueVtdIHwgdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljRnVuY3Rpb248VD4ge1xuXHQoLi4uYXJnczogYW55W10pOiBUO1xufVxuXG4vKipcbiAqIEEgd2VhayBtYXAgb2YgZGlzcGF0Y2hlcnMgdXNlZCB0byBhcHBseSB0aGUgYWR2aWNlXG4gKi9cbmNvbnN0IGRpc3BhdGNoQWR2aWNlTWFwID0gbmV3IFdlYWtNYXA8RnVuY3Rpb24sIEpvaW5Qb2ludERpc3BhdGNoQWR2aWNlPGFueT4+KCk7XG5cbi8qKlxuICogQSBVSUQgZm9yIHRyYWNraW5nIGFkdmljZSBvcmRlcmluZ1xuICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGFkdmlzZXMgYSBqb2luIHBvaW50XG4gKlxuICogQHBhcmFtIGRpc3BhdGNoZXIgVGhlIGN1cnJlbnQgYWR2aWNlIGRpc3BhdGNoZXJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGJlZm9yZSBvciBhZnRlciBhZHZpY2UgdG8gYXBwbHlcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFkdmljZSB0byBhcHBseVxuICogQHBhcmFtIHJlY2VpdmVBcmd1bWVudHMgSWYgdHJ1ZSwgdGhlIGFkdmljZSB3aWxsIHJlY2VpdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGpvaW4gcG9pbnRcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBhZHZpY2VcbiAqL1xuZnVuY3Rpb24gYWR2aXNlT2JqZWN0KFxuXHRkaXNwYXRjaGVyOiBEaXNwYXRjaGVyIHwgdW5kZWZpbmVkLFxuXHR0eXBlOiBBZHZpY2VUeXBlLFxuXHRhZHZpY2U6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRyZWNlaXZlQXJndW1lbnRzPzogYm9vbGVhblxuKTogSGFuZGxlIHtcblx0bGV0IHByZXZpb3VzID0gZGlzcGF0Y2hlciAmJiBkaXNwYXRjaGVyW3R5cGVdO1xuXHRsZXQgYWR2aXNlZDogQWR2aXNlZCB8IHVuZGVmaW5lZCA9IHtcblx0XHRpZDogbmV4dElkKyssXG5cdFx0YWR2aWNlOiBhZHZpY2UsXG5cdFx0cmVjZWl2ZUFyZ3VtZW50czogcmVjZWl2ZUFyZ3VtZW50c1xuXHR9O1xuXG5cdGlmIChwcmV2aW91cykge1xuXHRcdGlmICh0eXBlID09PSAnYWZ0ZXInKSB7XG5cdFx0XHQvLyBhZGQgdGhlIGxpc3RlbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Rcblx0XHRcdC8vIG5vdGUgdGhhdCB3ZSBoYWQgdG8gY2hhbmdlIHRoaXMgbG9vcCBhIGxpdHRsZSBiaXQgdG8gd29ya2Fyb3VuZCBhIGJpemFycmUgSUUxMCBKSVQgYnVnXG5cdFx0XHR3aGlsZSAocHJldmlvdXMubmV4dCAmJiAocHJldmlvdXMgPSBwcmV2aW91cy5uZXh0KSkge31cblx0XHRcdHByZXZpb3VzLm5leHQgPSBhZHZpc2VkO1xuXHRcdFx0YWR2aXNlZC5wcmV2aW91cyA9IHByZXZpb3VzO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIGFkZCB0byB0aGUgYmVnaW5uaW5nXG5cdFx0XHRpZiAoZGlzcGF0Y2hlcikge1xuXHRcdFx0XHRkaXNwYXRjaGVyLmJlZm9yZSA9IGFkdmlzZWQ7XG5cdFx0XHR9XG5cdFx0XHRhZHZpc2VkLm5leHQgPSBwcmV2aW91cztcblx0XHRcdHByZXZpb3VzLnByZXZpb3VzID0gYWR2aXNlZDtcblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IGFkdmlzZWQpO1xuXHR9XG5cblx0YWR2aWNlID0gcHJldmlvdXMgPSB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHsgcHJldmlvdXMgPSB1bmRlZmluZWQsIG5leHQgPSB1bmRlZmluZWQgfSA9IChhZHZpc2VkIHx8IHt9KTtcblxuXHRcdGlmIChkaXNwYXRjaGVyICYmICFwcmV2aW91cyAmJiAhbmV4dCkge1xuXHRcdFx0ZGlzcGF0Y2hlclt0eXBlXSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAocHJldmlvdXMpIHtcblx0XHRcdFx0cHJldmlvdXMubmV4dCA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IG5leHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChhZHZpc2VkKSB7XG5cdFx0XHRkZWxldGUgYWR2aXNlZC5hZHZpY2U7XG5cdFx0fVxuXHRcdGRpc3BhdGNoZXIgPSBhZHZpc2VkID0gdW5kZWZpbmVkO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBBZHZpc2UgYSBqb2luIHBvaW50IChmdW5jdGlvbikgd2l0aCBzdXBwbGllZCBhZHZpY2VcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IFRoZSBmdW5jdGlvbiB0byBiZSBhZHZpc2VkXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBhZHZpY2UgdG8gYmUgYXBwbGllZFxuICogQHBhcmFtIGFkdmljZSBUaGUgYWR2aWNlIHRvIGFwcGx5XG4gKi9cbmZ1bmN0aW9uIGFkdmlzZUpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPih0aGlzOiBhbnksIGpvaW5Qb2ludDogRiwgdHlwZTogQWR2aWNlVHlwZSwgYWR2aWNlOiBKb2luUG9pbnRCZWZvcmVBZHZpY2UgfCBKb2luUG9pbnRBZnRlckFkdmljZTxUPiB8IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPik6IEYge1xuXHRsZXQgZGlzcGF0Y2hlcjogRjtcblx0aWYgKHR5cGUgPT09ICdhcm91bmQnKSB7XG5cdFx0ZGlzcGF0Y2hlciA9IGdldEpvaW5Qb2ludERpc3BhdGNoZXIoYWR2aWNlLmFwcGx5KHRoaXMsIFsgam9pblBvaW50IF0pKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkaXNwYXRjaGVyID0gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcihqb2luUG9pbnQpO1xuXHRcdC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcblx0XHRjb25zdCBhZHZpY2VNYXAgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoZGlzcGF0Y2hlcikhO1xuXHRcdGlmICh0eXBlID09PSAnYmVmb3JlJykge1xuXHRcdFx0KGFkdmljZU1hcC5iZWZvcmUgfHwgKGFkdmljZU1hcC5iZWZvcmUgPSBbXSkpLnVuc2hpZnQoPEpvaW5Qb2ludEJlZm9yZUFkdmljZT4gYWR2aWNlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQoYWR2aWNlTWFwLmFmdGVyIHx8IChhZHZpY2VNYXAuYWZ0ZXIgPSBbXSkpLnB1c2goYWR2aWNlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyBvciBjcmVhdGVzIHRoZSBkaXNwYXRjaGVyIGZvciBhIGdpdmVuIGpvaW4gcG9pbnRcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9yIG1hcFxuICogQHBhcmFtIG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0aGF0IHRoZSBkaXNwYXRjaGVyIHNob3VsZCBiZSByZXNvbHZlZCBmb3JcbiAqIEByZXR1cm4gVGhlIGRpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZyk6IERpc3BhdGNoZXIge1xuXHRjb25zdCBleGlzdGluZyA9IGlzTWFwTGlrZSh0YXJnZXQpID8gdGFyZ2V0LmdldChtZXRob2ROYW1lKSA6IHRhcmdldCAmJiB0YXJnZXRbbWV0aG9kTmFtZV07XG5cdGxldCBkaXNwYXRjaGVyOiBEaXNwYXRjaGVyO1xuXG5cdGlmICghZXhpc3RpbmcgfHwgZXhpc3RpbmcudGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHQvKiBUaGVyZSBpcyBubyBleGlzdGluZyBkaXNwYXRjaGVyLCB0aGVyZWZvcmUgd2Ugd2lsbCBjcmVhdGUgb25lICovXG5cdFx0ZGlzcGF0Y2hlciA9IDxEaXNwYXRjaGVyPiBmdW5jdGlvbiAodGhpczogRGlzcGF0Y2hlcik6IGFueSB7XG5cdFx0XHRsZXQgZXhlY3V0aW9uSWQgPSBuZXh0SWQ7XG5cdFx0XHRsZXQgYXJncyA9IGFyZ3VtZW50cztcblx0XHRcdGxldCByZXN1bHRzOiBhbnk7XG5cdFx0XHRsZXQgYmVmb3JlID0gZGlzcGF0Y2hlci5iZWZvcmU7XG5cblx0XHRcdHdoaWxlIChiZWZvcmUpIHtcblx0XHRcdFx0aWYgKGJlZm9yZS5hZHZpY2UpIHtcblx0XHRcdFx0XHRhcmdzID0gYmVmb3JlLmFkdmljZS5hcHBseSh0aGlzLCBhcmdzKSB8fCBhcmdzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJlZm9yZSA9IGJlZm9yZS5uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlzcGF0Y2hlci5hcm91bmQgJiYgZGlzcGF0Y2hlci5hcm91bmQuYWR2aWNlKSB7XG5cdFx0XHRcdHJlc3VsdHMgPSBkaXNwYXRjaGVyLmFyb3VuZC5hZHZpY2UodGhpcywgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZnRlciA9IGRpc3BhdGNoZXIuYWZ0ZXI7XG5cdFx0XHR3aGlsZSAoYWZ0ZXIgJiYgYWZ0ZXIuaWQgIT09IHVuZGVmaW5lZCAmJiBhZnRlci5pZCA8IGV4ZWN1dGlvbklkKSB7XG5cdFx0XHRcdGlmIChhZnRlci5hZHZpY2UpIHtcblx0XHRcdFx0XHRpZiAoYWZ0ZXIucmVjZWl2ZUFyZ3VtZW50cykge1xuXHRcdFx0XHRcdFx0bGV0IG5ld1Jlc3VsdHMgPSBhZnRlci5hZHZpY2UuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gbmV3UmVzdWx0cyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0cyA6IG5ld1Jlc3VsdHM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IGFmdGVyLmFkdmljZS5jYWxsKHRoaXMsIHJlc3VsdHMsIGFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhZnRlciA9IGFmdGVyLm5leHQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0XHRpZiAoaXNNYXBMaWtlKHRhcmdldCkpIHtcblx0XHRcdHRhcmdldC5zZXQobWV0aG9kTmFtZSwgZGlzcGF0Y2hlcik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGFyZ2V0ICYmICh0YXJnZXRbbWV0aG9kTmFtZV0gPSBkaXNwYXRjaGVyKTtcblx0XHR9XG5cblx0XHRpZiAoZXhpc3RpbmcpIHtcblx0XHRcdGRpc3BhdGNoZXIuYXJvdW5kID0ge1xuXHRcdFx0XHRhZHZpY2U6IGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgYXJnczogYW55W10pOiBhbnkge1xuXHRcdFx0XHRcdHJldHVybiBleGlzdGluZy5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGRpc3BhdGNoZXIudGFyZ2V0ID0gdGFyZ2V0O1xuXHR9XG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoZXIgPSBleGlzdGluZztcblx0fVxuXG5cdHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpc3BhdGNoZXIgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gam9pblBvaW50IChtZXRob2QvZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBUaGUgZnVuY3Rpb24gdGhhdCBpcyB0byBiZSBhZHZpc2VkXG4gKi9cbmZ1bmN0aW9uIGdldEpvaW5Qb2ludERpc3BhdGNoZXI8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGKTogRiB7XG5cblx0ZnVuY3Rpb24gZGlzcGF0Y2hlcih0aGlzOiBGdW5jdGlvbiwgLi4uYXJnczogYW55W10pOiBUIHtcblx0XHQvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXG5cdFx0Y29uc3QgeyBiZWZvcmUsIGFmdGVyLCBqb2luUG9pbnQgfSA9IGRpc3BhdGNoQWR2aWNlTWFwLmdldChkaXNwYXRjaGVyKSE7XG5cdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0YXJncyA9IGJlZm9yZS5yZWR1Y2UoKHByZXZpb3VzQXJncywgYWR2aWNlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRBcmdzID0gYWR2aWNlLmFwcGx5KHRoaXMsIHByZXZpb3VzQXJncyk7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50QXJncyB8fCBwcmV2aW91c0FyZ3M7XG5cdFx0XHR9LCBhcmdzKTtcblx0XHR9XG5cdFx0bGV0IHJlc3VsdCA9IGpvaW5Qb2ludC5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdHJlc3VsdCA9IGFmdGVyLnJlZHVjZSgocHJldmlvdXNSZXN1bHQsIGFkdmljZSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWR2aWNlLmFwcGx5KHRoaXMsIFsgcHJldmlvdXNSZXN1bHQgXS5jb25jYXQoYXJncykpO1xuXHRcdFx0fSwgcmVzdWx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qIFdlIHdhbnQgdG8gXCJjbG9uZVwiIHRoZSBhZHZpY2UgdGhhdCBoYXMgYmVlbiBhcHBsaWVkIGFscmVhZHksIGlmIHRoaXNcblx0ICogam9pblBvaW50IGlzIGFscmVhZHkgYWR2aXNlZCAqL1xuXHRpZiAoZGlzcGF0Y2hBZHZpY2VNYXAuaGFzKGpvaW5Qb2ludCkpIHtcblx0XHQvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXG5cdFx0Y29uc3QgYWR2aWNlTWFwID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGpvaW5Qb2ludCkhO1xuXHRcdGxldCB7IGJlZm9yZSwgYWZ0ZXIgfSA9IGFkdmljZU1hcDtcblx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRiZWZvcmUgPSBiZWZvcmUuc2xpY2UoMCk7XG5cdFx0fVxuXHRcdGlmIChhZnRlcikge1xuXHRcdFx0YWZ0ZXIgPSBhZnRlci5zbGljZSgwKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hBZHZpY2VNYXAuc2V0KGRpc3BhdGNoZXIsIHtcblx0XHRcdGpvaW5Qb2ludDogYWR2aWNlTWFwLmpvaW5Qb2ludCxcblx0XHRcdGJlZm9yZSxcblx0XHRcdGFmdGVyXG5cdFx0fSk7XG5cdH1cblx0LyogT3RoZXJ3aXNlLCB0aGlzIGlzIGEgbmV3IGpvaW5Qb2ludCwgc28gd2Ugd2lsbCBjcmVhdGUgdGhlIGFkdmljZSBtYXAgYWZyZXNoICovXG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoQWR2aWNlTWFwLnNldChkaXNwYXRjaGVyLCB7IGpvaW5Qb2ludCB9KTtcblx0fVxuXG5cdHJldHVybiBkaXNwYXRjaGVyIGFzIEY7XG59XG5cbi8qKlxuICogQXBwbHkgYWR2aWNlICphZnRlciogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFmdGVyIGFkdmljZVxuICovXG5mdW5jdGlvbiBhZnRlckpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4pOiBGIHtcblx0cmV0dXJuIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsICdhZnRlcicsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJhZnRlclwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0LlxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKGV2ZW4gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQpLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3RcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmZ1bmN0aW9uIGFmdGVyT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6IChvcmlnaW5hbFJldHVybjogYW55LCBvcmlnaW5hbEFyZ3M6IElBcmd1bWVudHMpID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYWZ0ZXJcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdC5cbiAqIFRoZSB2YWx1ZSBpdCByZXR1cm5zIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGUgbWV0aG9kIHdoZW4gaXQgaXMgY2FsbGVkIChldmVuIGlmIHRoZSByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0XG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXIodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKG9yaWdpbmFsUmV0dXJuOiBhbnksIG9yaWdpbmFsQXJnczogSUFyZ3VtZW50cykgPT4gYW55KTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFmdGVyKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYWZ0ZXIgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcjxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4pOiBGO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludE9yVGFyZ2V0OiBGIHwgVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZU9yQWR2aWNlOiBzdHJpbmcgfCBKb2luUG9pbnRBZnRlckFkdmljZTxUPiwgb2JqZWN0QWR2aWNlPzogKG9yaWdpbmFsUmV0dXJuOiBhbnksIG9yaWdpbmFsQXJnczogSUFyZ3VtZW50cykgPT4gYW55KTogSGFuZGxlIHwgRiB7XG5cdGlmICh0eXBlb2Ygam9pblBvaW50T3JUYXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYWZ0ZXJKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIDxKb2luUG9pbnRBZnRlckFkdmljZTxUPj4gbWV0aG9kTmFtZU9yQWR2aWNlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gYWZ0ZXJPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIDxzdHJpbmc+IG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlISk7XG5cdH1cbn1cblxuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFyb3VuZCogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFyb3VuZCBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZEpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+KTogRiB7XG5cdHJldHVybiBhZHZpc2VKb2luUG9pbnQ8RiwgVD4oam9pblBvaW50LCAnYXJvdW5kJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFyb3VuZFwiIGFkdmljZSBhcm91bmQgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb25cbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcm91bmRPYmplY3QodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKSk6IEhhbmRsZSB7XG5cdGxldCBkaXNwYXRjaGVyOiBEaXNwYXRjaGVyIHwgdW5kZWZpbmVkID0gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpO1xuXHRsZXQgcHJldmlvdXMgPSBkaXNwYXRjaGVyLmFyb3VuZDtcblx0bGV0IGFkdmlzZWQ6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xuXHRpZiAoYWR2aWNlKSB7XG5cdFx0YWR2aXNlZCA9IGFkdmljZShmdW5jdGlvbiAodGhpczogRGlzcGF0Y2hlcik6IGFueSB7XG5cdFx0XHRpZiAocHJldmlvdXMgJiYgcHJldmlvdXMuYWR2aWNlKSB7XG5cdFx0XHRcdHJldHVybiBwcmV2aW91cy5hZHZpY2UodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGRpc3BhdGNoZXIuYXJvdW5kID0ge1xuXHRcdGFkdmljZTogZnVuY3Rpb24gKHRhcmdldDogYW55LCBhcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gYWR2aXNlZCA/IGFkdmlzZWQuYXBwbHkodGFyZ2V0LCBhcmdzKSA6IHByZXZpb3VzICYmIHByZXZpb3VzLmFkdmljZSAmJiBwcmV2aW91cy5hZHZpY2UodGFyZ2V0LCBhcmdzKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG5cdFx0YWR2aXNlZCA9IGRpc3BhdGNoZXIgPSB1bmRlZmluZWQ7XG5cdH0pO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYXJvdW5kXCIgYWR2aWNlIGFyb3VuZCB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoKHByZXZpb3VzOiBGdW5jdGlvbikgPT4gRnVuY3Rpb24pKTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFyb3VuZCogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFyb3VuZCBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+KTogRjtcbmV4cG9ydCBmdW5jdGlvbiBhcm91bmQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50T3JUYXJnZXQ6IEYgfCBUYXJnZXRhYmxlLCBtZXRob2ROYW1lT3JBZHZpY2U6IHN0cmluZyB8IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPiwgb2JqZWN0QWR2aWNlPzogKChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKSk6IEhhbmRsZSB8IEYge1xuXHRpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGFyb3VuZEpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgPEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPj4gbWV0aG9kTmFtZU9yQWR2aWNlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gYXJvdW5kT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCA8c3RyaW5nPiBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSEpO1xuXHR9XG59XG5cbi8qKlxuICogQXBwbHkgYWR2aWNlICpiZWZvcmUqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBiZWZvcmUgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVKb2luUG9pbnQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxhbnk+Pihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QmVmb3JlQWR2aWNlKTogRiB7XG5cdHJldHVybiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCAnYmVmb3JlJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImJlZm9yZVwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgbWF5IHJldHVybiBuZXcgYXJndW1lbnRzXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICguLi5vcmlnaW5hbEFyZ3M6IGFueVtdKSA9PiBhbnlbXSB8IHZvaWQpOiBIYW5kbGUge1xuXHRyZXR1cm4gYWR2aXNlT2JqZWN0KGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKSwgJ2JlZm9yZScsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJiZWZvcmVcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCwgYW5kIG1heSByZXR1cm4gbmV3IGFyZ3VtZW50c1xuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZSh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55W10gfCB2b2lkKTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmJlZm9yZSogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGJlZm9yZSBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZTxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPGFueT4+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRCZWZvcmVBZHZpY2UpOiBGO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZTxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnRPclRhcmdldDogRiB8IFRhcmdldGFibGUsIG1ldGhvZE5hbWVPckFkdmljZTogc3RyaW5nIHwgSm9pblBvaW50QmVmb3JlQWR2aWNlLCBvYmplY3RBZHZpY2U/OiAoKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueVtdIHwgdm9pZCkpOiBIYW5kbGUgfCBGIHtcblx0aWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBiZWZvcmVKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIDxKb2luUG9pbnRCZWZvcmVBZHZpY2U+IG1ldGhvZE5hbWVPckFkdmljZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGJlZm9yZU9iamVjdChqb2luUG9pbnRPclRhcmdldCwgPHN0cmluZz4gbWV0aG9kTmFtZU9yQWR2aWNlLCBvYmplY3RBZHZpY2UhKTtcblx0fVxufVxuXG4vKipcbiAqIEF0dGFjaGVzIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSB2YWx1ZSBpdCByZXR1cm5zIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGUgbWV0aG9kIHdoZW4gaXQgaXMgY2FsbGVkICp1bmxlc3MqIGl0cyByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gb24odGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UsIHRydWUpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGFzcGVjdC50cyIsImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5cbmV4cG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcblxuY29uc3Qgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcbiAqL1xuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWU6IGFueSk6IHZhbHVlIGlzIE9iamVjdCB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gY29weUFycmF5PFQ+KGFycmF5OiBUW10sIGluaGVyaXRlZDogYm9vbGVhbik6IFRbXSB7XG5cdHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW06IFQpOiBUIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuXHRcdFx0cmV0dXJuIDxhbnk+IGNvcHlBcnJheSg8YW55PiBpdGVtLCBpbmhlcml0ZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSkgP1xuXHRcdFx0aXRlbSA6XG5cdFx0XHRfbWl4aW4oe1xuXHRcdFx0XHRkZWVwOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0ZWQ6IGluaGVyaXRlZCxcblx0XHRcdFx0c291cmNlczogPEFycmF5PFQ+PiBbIGl0ZW0gXSxcblx0XHRcdFx0dGFyZ2V0OiA8VD4ge31cblx0XHRcdH0pO1xuXHR9KTtcbn1cblxuaW50ZXJmYWNlIE1peGluQXJnczxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4ge1xuXHRkZWVwOiBib29sZWFuO1xuXHRpbmhlcml0ZWQ6IGJvb2xlYW47XG5cdHNvdXJjZXM6IChVIHwgbnVsbCB8IHVuZGVmaW5lZClbXTtcblx0dGFyZ2V0OiBUO1xuXHRjb3BpZWQ/OiBhbnlbXTtcbn1cblxuZnVuY3Rpb24gX21peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pihrd0FyZ3M6IE1peGluQXJnczxULCBVPik6IFQmVSB7XG5cdGNvbnN0IGRlZXAgPSBrd0FyZ3MuZGVlcDtcblx0Y29uc3QgaW5oZXJpdGVkID0ga3dBcmdzLmluaGVyaXRlZDtcblx0Y29uc3QgdGFyZ2V0OiBhbnkgPSBrd0FyZ3MudGFyZ2V0O1xuXHRjb25zdCBjb3BpZWQgPSBrd0FyZ3MuY29waWVkIHx8IFtdO1xuXHRjb25zdCBjb3BpZWRDbG9uZSA9IFsgLi4uY29waWVkIF07XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrd0FyZ3Muc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xuXG5cdFx0aWYgKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcblx0XHRcdGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcblx0XHRcdFx0bGV0IHZhbHVlOiBhbnkgPSBzb3VyY2Vba2V5XTtcblxuXHRcdFx0XHRpZiAoY29waWVkQ2xvbmUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGVlcCkge1xuXHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBjb3B5QXJyYXkodmFsdWUsIGluaGVyaXRlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0VmFsdWU6IGFueSA9IHRhcmdldFtrZXldIHx8IHt9O1xuXHRcdFx0XHRcdFx0Y29waWVkLnB1c2goc291cmNlKTtcblx0XHRcdFx0XHRcdHZhbHVlID0gX21peGluKHtcblx0XHRcdFx0XHRcdFx0ZGVlcDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aW5oZXJpdGVkOiBpbmhlcml0ZWQsXG5cdFx0XHRcdFx0XHRcdHNvdXJjZXM6IFsgdmFsdWUgXSxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0OiB0YXJnZXRWYWx1ZSxcblx0XHRcdFx0XHRcdFx0Y29waWVkXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGFyZ2V0W2tleV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gPFQmVT4gdGFyZ2V0O1xufVxuXG5pbnRlcmZhY2UgT2JqZWN0QXNzaWduQ29uc3RydWN0b3IgZXh0ZW5kcyBPYmplY3RDb25zdHJ1Y3RvciB7XG5cdGFzc2lnbjxULCBVPih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuXHRhc3NpZ248VCwgVTEsIFUyPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUxLCBzb3VyY2UyOiBVMik6IFQgJiBVMSAmIFUyO1xuXHRhc3NpZ248VCwgVTEsIFUyLCBVMz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVMSwgc291cmNlMjogVTIsIHNvdXJjZTM6IFUzKTogVCAmIFUxICYgVTIgJiBVMztcblx0YXNzaWduKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUsIGFuZCBjb3BpZXMgYWxsIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmVcbiAqIHNvdXJjZSBvYmplY3RzIHRvIHRoZSBuZXdseSBjcmVhdGVkIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHByb3RvdHlwZSBUaGUgcHJvdG90eXBlIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgZnJvbVxuICogQHBhcmFtIG1peGlucyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgY3JlYXRlZCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVywgbWl4aW40OiBYLCBtaXhpbjU6IFksIG1peGluNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVywgbWl4aW40OiBYLCBtaXhpbjU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcsIG1peGluNDogWCk6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVyk6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBUKTogVDtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlOiBhbnksIC4uLm1peGluczogYW55W10pOiBhbnkge1xuXHRpZiAoIW1peGlucy5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcblx0fVxuXG5cdGNvbnN0IGFyZ3MgPSBtaXhpbnMuc2xpY2UoKTtcblx0YXJncy51bnNoaWZ0KE9iamVjdC5jcmVhdGUocHJvdG90eXBlKSk7XG5cblx0cmV0dXJuIGFzc2lnbi5hcHBseShudWxsLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGUgdGFyZ2V0IG9iamVjdCxcbiAqIHJlY3Vyc2l2ZWx5IGNvcHlpbmcgYWxsIG5lc3RlZCBvYmplY3RzIGFuZCBhcnJheXMgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIHJlY2VpdmUgdmFsdWVzIGZyb20gc291cmNlIG9iamVjdHNcbiAqIEBwYXJhbSBzb3VyY2VzIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30sIFogZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZLCBzb3VyY2U2OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ24odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0cmV0dXJuIF9taXhpbih7XG5cdFx0ZGVlcDogdHJ1ZSxcblx0XHRpbmhlcml0ZWQ6IGZhbHNlLFxuXHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0dGFyZ2V0OiB0YXJnZXRcblx0fSk7XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYWxsIGVudW1lcmFibGUgKG93biBvciBpbmhlcml0ZWQpIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiB0YXJnZXQgb2JqZWN0LCByZWN1cnNpdmVseSBjb3B5aW5nIGFsbCBuZXN0ZWQgb2JqZWN0cyBhbmQgYXJyYXlzIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byByZWNlaXZlIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RzXG4gKiBAcGFyYW0gc291cmNlcyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiB0cnVlLFxuXHRcdGluaGVyaXRlZDogdHJ1ZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBzb3VyY2UncyBwcm90b3R5cGUgYXMgdGhlIHByb3RvdHlwZSBmb3IgdGhlIG5ldyBvYmplY3QsIGFuZCB0aGVuXG4gKiBkZWVwIGNvcGllcyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgdmFsdWVzIGludG8gdGhlIG5ldyB0YXJnZXQuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgb2JqZWN0IHRvIGR1cGxpY2F0ZVxuICogQHJldHVybiBUaGUgbmV3IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZHVwbGljYXRlPFQgZXh0ZW5kcyB7fT4oc291cmNlOiBUKTogVCB7XG5cdGNvbnN0IHRhcmdldCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHNvdXJjZSkpO1xuXG5cdHJldHVybiBkZWVwTWl4aW4odGFyZ2V0LCBzb3VyY2UpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lOyBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSWRlbnRpY2FsKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiBhID09PSBiIHx8XG5cdFx0LyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xuXHRcdChhICE9PSBhICYmIGIgIT09IGIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xuICogYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGluc3RlYWQgb2YgYSBmdW5jdGlvbiBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIG1ldGhvZCBvbiBhbiBvYmplY3QuXG4gKiBBcyBhIHJlc3VsdCwgdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IGBsYXRlQmluZGAgd2lsbCBhbHdheXMgY2FsbCB0aGUgZnVuY3Rpb24gY3VycmVudGx5IGFzc2lnbmVkIHRvXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXG4gKlxuICogQHBhcmFtIGluc3RhbmNlIFRoZSBjb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcHJlcGVuZCB0byB0aGUgYGluc3RhbmNlW21ldGhvZF1gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF0ZUJpbmQoaW5zdGFuY2U6IHt9LCBtZXRob2Q6IHN0cmluZywgLi4uc3VwcGxpZWRBcmdzOiBhbnlbXSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGggP1xuXHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnN0IGFyZ3M6IGFueVtdID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcblxuXHRcdFx0Ly8gVFM3MDE3XG5cdFx0XHRyZXR1cm4gKDxhbnk+IGluc3RhbmNlKVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblx0XHR9IDpcblx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyBUUzcwMTdcblx0XHRcdHJldHVybiAoPGFueT4gaW5zdGFuY2UpW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSAob3duIG9yIGluaGVyaXRlZCkgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiBmYWxzZSxcblx0XHRpbmhlcml0ZWQ6IHRydWUsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIHByZXBlbmRlZCB0byBpdHMgYXJndW1lbnQgbGlzdC5cbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXRGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBib3VuZFxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpYWwodGFyZ2V0RnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCAuLi5zdXBwbGllZEFyZ3M6IGFueVtdKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSkge1xuXHRcdGNvbnN0IGFyZ3M6IGFueVtdID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcblxuXHRcdHJldHVybiB0YXJnZXRGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgZGVzdHJveSBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIGNhbGxzIHRoZSBwYXNzZWQtaW4gZGVzdHJ1Y3Rvci5cbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIHVuaWZpZWQgaW50ZXJmYWNlIGZvciBjcmVhdGluZyBcInJlbW92ZVwiIC8gXCJkZXN0cm95XCIgaGFuZGxlcnMgZm9yXG4gKiBldmVudCBsaXN0ZW5lcnMsIHRpbWVycywgZXRjLlxuICpcbiAqIEBwYXJhbSBkZXN0cnVjdG9yIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBoYW5kbGUncyBgZGVzdHJveWAgbWV0aG9kIGlzIGludm9rZWRcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhhbmRsZShkZXN0cnVjdG9yOiAoKSA9PiB2b2lkKTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95OiBmdW5jdGlvbiAodGhpczogSGFuZGxlKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdGRlc3RydWN0b3IuY2FsbCh0aGlzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXN0cm95IG11bHRpcGxlIGhhbmRsZXMgc2ltdWx0YW5lb3VzbHkuXG4gKlxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlczogSGFuZGxlW10pOiBIYW5kbGUge1xuXHRyZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGhhbmRsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGhhbmRsZXNbaV0uZGVzdHJveSgpO1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGFuZy50cyIsImltcG9ydCBoYXMsIHsgYWRkIH0gZnJvbSAnQGRvam8vaGFzL2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGhhcztcbmV4cG9ydCAqIGZyb20gJ0Bkb2pvL2hhcy9oYXMnO1xuXG4vKiBFQ01BU2NyaXB0IDYgYW5kIDcgRmVhdHVyZXMgKi9cblxuLyogQXJyYXkgKi9cbmFkZChcblx0J2VzNi1hcnJheScsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0Wydmcm9tJywgJ29mJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheSkgJiZcblx0XHRcdFsnZmluZEluZGV4JywgJ2ZpbmQnLCAnY29weVdpdGhpbiddLmV2ZXJ5KChrZXkpID0+IGtleSBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlKVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1hcnJheS1maWxsJyxcblx0KCkgPT4ge1xuXHRcdGlmICgnZmlsbCcgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSkge1xuXHRcdFx0LyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXG5cdFx0XHRyZXR1cm4gKDxhbnk+WzFdKS5maWxsKDksIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSlbMF0gPT09IDE7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKCdlczctYXJyYXknLCAoKSA9PiAnaW5jbHVkZXMnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUsIHRydWUpO1xuXG4vKiBNYXAgKi9cbmFkZChcblx0J2VzNi1tYXAnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuTWFwID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHQvKlxuXHRcdElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcblx0XHRXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxuXHRcdHRha2UgYXJndW1lbnRzIChpT1MgOC40KVxuXHRcdCAqL1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgbWFwID0gbmV3IGdsb2JhbC5NYXAoW1swLCAxXV0pO1xuXG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0bWFwLmhhcygwKSAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdGhhcygnZXM2LXN5bWJvbCcpICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLmVudHJpZXMgPT09ICdmdW5jdGlvbidcblx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCB0ZXN0aW5nIG9uIGlPUyBhdCB0aGUgbW9tZW50ICovXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBNYXRoICovXG5hZGQoXG5cdCdlczYtbWF0aCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0J2NsejMyJyxcblx0XHRcdCdzaWduJyxcblx0XHRcdCdsb2cxMCcsXG5cdFx0XHQnbG9nMicsXG5cdFx0XHQnbG9nMXAnLFxuXHRcdFx0J2V4cG0xJyxcblx0XHRcdCdjb3NoJyxcblx0XHRcdCdzaW5oJyxcblx0XHRcdCd0YW5oJyxcblx0XHRcdCdhY29zaCcsXG5cdFx0XHQnYXNpbmgnLFxuXHRcdFx0J2F0YW5oJyxcblx0XHRcdCd0cnVuYycsXG5cdFx0XHQnZnJvdW5kJyxcblx0XHRcdCdjYnJ0Jyxcblx0XHRcdCdoeXBvdCdcblx0XHRdLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk1hdGhbbmFtZV0gPT09ICdmdW5jdGlvbicpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtbWF0aC1pbXVsJyxcblx0KCkgPT4ge1xuXHRcdGlmICgnaW11bCcgaW4gZ2xvYmFsLk1hdGgpIHtcblx0XHRcdC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cblx0XHRcdHJldHVybiAoPGFueT5NYXRoKS5pbXVsKDB4ZmZmZmZmZmYsIDUpID09PSAtNTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBPYmplY3QgKi9cbmFkZChcblx0J2VzNi1vYmplY3QnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdGhhcygnZXM2LXN5bWJvbCcpICYmXG5cdFx0XHRbJ2Fzc2lnbicsICdpcycsICdnZXRPd25Qcm9wZXJ0eVN5bWJvbHMnLCAnc2V0UHJvdG90eXBlT2YnXS5ldmVyeShcblx0XHRcdFx0KG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXMyMDE3LW9iamVjdCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gWyd2YWx1ZXMnLCAnZW50cmllcycsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzJ10uZXZlcnkoXG5cdFx0XHQobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbidcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBPYnNlcnZhYmxlICovXG5hZGQoJ2VzLW9ic2VydmFibGUnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLk9ic2VydmFibGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcblxuLyogUHJvbWlzZSAqL1xuYWRkKCdlczYtcHJvbWlzZScsICgpID0+IHR5cGVvZiBnbG9iYWwuUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzKCdlczYtc3ltYm9sJyksIHRydWUpO1xuXG4vKiBTZXQgKi9cbmFkZChcblx0J2VzNi1zZXQnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuU2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHQvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IFNldCBmdW5jdGlvbmFsaXR5ICovXG5cdFx0XHRjb25zdCBzZXQgPSBuZXcgZ2xvYmFsLlNldChbMV0pO1xuXHRcdFx0cmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgaGFzKCdlczYtc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogU3RyaW5nICovXG5hZGQoXG5cdCdlczYtc3RyaW5nJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRbXG5cdFx0XHRcdC8qIHN0YXRpYyBtZXRob2RzICovXG5cdFx0XHRcdCdmcm9tQ29kZVBvaW50J1xuXHRcdFx0XS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nKSAmJlxuXHRcdFx0W1xuXHRcdFx0XHQvKiBpbnN0YW5jZSBtZXRob2RzICovXG5cdFx0XHRcdCdjb2RlUG9pbnRBdCcsXG5cdFx0XHRcdCdub3JtYWxpemUnLFxuXHRcdFx0XHQncmVwZWF0Jyxcblx0XHRcdFx0J3N0YXJ0c1dpdGgnLFxuXHRcdFx0XHQnZW5kc1dpdGgnLFxuXHRcdFx0XHQnaW5jbHVkZXMnXG5cdFx0XHRdLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nKVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1zdHJpbmctcmF3Jyxcblx0KCkgPT4ge1xuXHRcdGZ1bmN0aW9uIGdldENhbGxTaXRlKGNhbGxTaXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IFsuLi5jYWxsU2l0ZV07XG5cdFx0XHQocmVzdWx0IGFzIGFueSkucmF3ID0gY2FsbFNpdGUucmF3O1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRpZiAoJ3JhdycgaW4gZ2xvYmFsLlN0cmluZykge1xuXHRcdFx0bGV0IGIgPSAxO1xuXHRcdFx0bGV0IGNhbGxTaXRlID0gZ2V0Q2FsbFNpdGVgYVxcbiR7Yn1gO1xuXG5cdFx0XHQoY2FsbFNpdGUgYXMgYW55KS5yYXcgPSBbJ2FcXFxcbiddO1xuXHRcdFx0Y29uc3Qgc3VwcG9ydHNUcnVuYyA9IGdsb2JhbC5TdHJpbmcucmF3KGNhbGxTaXRlLCA0MikgPT09ICdhOlxcXFxuJztcblxuXHRcdFx0cmV0dXJuIHN1cHBvcnRzVHJ1bmM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczIwMTctc3RyaW5nJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbJ3BhZFN0YXJ0JywgJ3BhZEVuZCddLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nKTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogU3ltYm9sICovXG5hZGQoJ2VzNi1zeW1ib2wnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJywgdHJ1ZSk7XG5cbi8qIFdlYWtNYXAgKi9cbmFkZChcblx0J2VzNi13ZWFrbWFwJyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLldlYWtNYXAgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHQvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5ICovXG5cdFx0XHRjb25zdCBrZXkxID0ge307XG5cdFx0XHRjb25zdCBrZXkyID0ge307XG5cdFx0XHRjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLldlYWtNYXAoW1trZXkxLCAxXV0pO1xuXHRcdFx0T2JqZWN0LmZyZWV6ZShrZXkxKTtcblx0XHRcdHJldHVybiBtYXAuZ2V0KGtleTEpID09PSAxICYmIG1hcC5zZXQoa2V5MiwgMikgPT09IG1hcCAmJiBoYXMoJ2VzNi1zeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBNaXNjZWxsYW5lb3VzIGZlYXR1cmVzICovXG5hZGQoJ21pY3JvdGFza3MnLCAoKSA9PiBoYXMoJ2VzNi1wcm9taXNlJykgfHwgaGFzKCdob3N0LW5vZGUnKSB8fCBoYXMoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJyksIHRydWUpO1xuYWRkKFxuXHQncG9zdG1lc3NhZ2UnLFxuXHQoKSA9PiB7XG5cdFx0Ly8gSWYgd2luZG93IGlzIHVuZGVmaW5lZCwgYW5kIHdlIGhhdmUgcG9zdE1lc3NhZ2UsIGl0IHByb2JhYmx5IG1lYW5zIHdlJ3JlIGluIGEgd2ViIHdvcmtlci4gV2ViIHdvcmtlcnMgaGF2ZVxuXHRcdC8vIHBvc3QgbWVzc2FnZSBidXQgaXQgZG9lc24ndCB3b3JrIGhvdyB3ZSBleHBlY3QgaXQgdG8sIHNvIGl0J3MgYmVzdCBqdXN0IHRvIHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cblx0XHRyZXR1cm4gdHlwZW9mIGdsb2JhbC53aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBnbG9iYWwucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbic7XG5cdH0sXG5cdHRydWVcbik7XG5hZGQoJ3JhZicsICgpID0+IHR5cGVvZiBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nLCB0cnVlKTtcbmFkZCgnc2V0aW1tZWRpYXRlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5zZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcblxuLyogRE9NIEZlYXR1cmVzICovXG5cbmFkZChcblx0J2RvbS1tdXRhdGlvbm9ic2VydmVyJyxcblx0KCkgPT4ge1xuXHRcdGlmIChoYXMoJ2hvc3QtYnJvd3NlcicpICYmIEJvb2xlYW4oZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXIpKSB7XG5cdFx0XHQvLyBJRTExIGhhcyBhbiB1bnJlbGlhYmxlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gd2hlcmUgc2V0UHJvcGVydHkoKSBkb2VzIG5vdFxuXHRcdFx0Ly8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxuXHRcdFx0Ly8gcmVsaWFibHkuIFRoZSBmb2xsb3dpbmcgZmVhdHVyZSB0ZXN0IHdhcyBhZGFwdGVkIGZyb21cblx0XHRcdC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3QxMGtvLzRhY2ViOGM3MTY4MWZkYjI3NWUzM2VmZTVlNTc2YjE0XG5cdFx0XHRjb25zdCBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHQvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xuXHRcdFx0Y29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKCkge30pO1xuXHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShleGFtcGxlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cblx0XHRcdGV4YW1wbGUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIEJvb2xlYW4ob2JzZXJ2ZXIudGFrZVJlY29yZHMoKS5sZW5ndGgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaGFzLnRzIiwiaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlLCBJdGVyYWJsZUl0ZXJhdG9yLCBTaGltSXRlcmF0b3IgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXMgYXMgb2JqZWN0SXMgfSBmcm9tICcuL29iamVjdCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwPEssIFY+IHtcblx0LyoqXG5cdCAqIERlbGV0ZXMgYWxsIGtleXMgYW5kIHRoZWlyIGFzc29jaWF0ZWQgdmFsdWVzLlxuXHQgKi9cblx0Y2xlYXIoKTogdm9pZDtcblxuXHQvKipcblx0ICogRGVsZXRlcyBhIGdpdmVuIGtleSBhbmQgaXRzIGFzc29jaWF0ZWQgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWxldGVcblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBrZXkgZXhpc3RzLCBmYWxzZSBpZiBpdCBkb2VzIG5vdFxuXHQgKi9cblx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkvdmFsdWUgcGFpciBhcyBhbiBhcnJheS5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBmb3IgZWFjaCBrZXkvdmFsdWUgcGFpciBpbiB0aGUgaW5zdGFuY2UuXG5cdCAqL1xuXHRlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPjtcblxuXHQvKipcblx0ICogRXhlY3V0ZXMgYSBnaXZlbiBmdW5jdGlvbiBmb3IgZWFjaCBtYXAgZW50cnkuIFRoZSBmdW5jdGlvblxuXHQgKiBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgZWxlbWVudCB2YWx1ZSwgdGhlXG5cdCAqIGVsZW1lbnQga2V5LCBhbmQgdGhlIGFzc29jaWF0ZWQgTWFwIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gY2FsbGJhY2tmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBmb3IgZWFjaCBtYXAgZW50cnksXG5cdCAqIEBwYXJhbSB0aGlzQXJnIFRoZSB2YWx1ZSB0byB1c2UgZm9yIGB0aGlzYCBmb3IgZWFjaCBleGVjdXRpb24gb2YgdGhlIGNhbGJhY2tcblx0ICovXG5cdGZvckVhY2goY2FsbGJhY2tmbjogKHZhbHVlOiBWLCBrZXk6IEssIG1hcDogTWFwPEssIFY+KSA9PiB2b2lkLCB0aGlzQXJnPzogYW55KTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gbG9vayB1cFxuXHQgKiBAcmV0dXJuIFRoZSB2YWx1ZSBpZiBvbmUgZXhpc3RzIG9yIHVuZGVmaW5lZFxuXHQgKi9cblx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkgaW4gdGhlIG1hcC5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBjb250YWluaW5nIHRoZSBpbnN0YW5jZSdzIGtleXMuXG5cdCAqL1xuXHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz47XG5cblx0LyoqXG5cdCAqIENoZWNrcyBmb3IgdGhlIHByZXNlbmNlIG9mIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gY2hlY2sgZm9yXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUga2V5IGV4aXN0cywgZmFsc2UgaWYgaXQgZG9lcyBub3Rcblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWZpbmUgYSB2YWx1ZSB0b1xuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnblxuXHQgKiBAcmV0dXJuIFRoZSBNYXAgaW5zdGFuY2Vcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleSAvIHZhbHVlIHBhaXJzIGluIHRoZSBNYXAuXG5cdCAqL1xuXHRyZWFkb25seSBzaXplOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCB2YWx1ZSBpbiB0aGUgbWFwLlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdGhlIGluc3RhbmNlJ3MgdmFsdWVzLlxuXHQgKi9cblx0dmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj47XG5cblx0LyoqIFJldHVybnMgYW4gaXRlcmFibGUgb2YgZW50cmllcyBpbiB0aGUgbWFwLiAqL1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT47XG5cblx0cmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdG5ldyAoKTogTWFwPGFueSwgYW55PjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYXRvclxuXHQgKiBBcnJheSBvciBpdGVyYXRvciBjb250YWluaW5nIHR3by1pdGVtIHR1cGxlcyB1c2VkIHRvIGluaXRpYWxseSBwb3B1bGF0ZSB0aGUgbWFwLlxuXHQgKiBUaGUgZmlyc3QgaXRlbSBpbiBlYWNoIHR1cGxlIGNvcnJlc3BvbmRzIHRvIHRoZSBrZXkgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICogVGhlIHNlY29uZCBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKi9cblx0bmV3IDxLLCBWPihpdGVyYXRvcj86IFtLLCBWXVtdKTogTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhdG9yXG5cdCAqIEFycmF5IG9yIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdHdvLWl0ZW0gdHVwbGVzIHVzZWQgdG8gaW5pdGlhbGx5IHBvcHVsYXRlIHRoZSBtYXAuXG5cdCAqIFRoZSBmaXJzdCBpdGVtIGluIGVhY2ggdHVwbGUgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKiBUaGUgc2Vjb25kIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqL1xuXHRuZXcgPEssIFY+KGl0ZXJhdG9yOiBJdGVyYWJsZTxbSywgVl0+KTogTWFwPEssIFY+O1xuXG5cdHJlYWRvbmx5IHByb3RvdHlwZTogTWFwPGFueSwgYW55PjtcblxuXHRyZWFkb25seSBbU3ltYm9sLnNwZWNpZXNdOiBNYXBDb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGxldCBNYXA6IE1hcENvbnN0cnVjdG9yID0gZ2xvYmFsLk1hcDtcblxuaWYgKCFoYXMoJ2VzNi1tYXAnKSkge1xuXHRNYXAgPSBjbGFzcyBNYXA8SywgVj4ge1xuXHRcdHByb3RlY3RlZCByZWFkb25seSBfa2V5czogS1tdID0gW107XG5cdFx0cHJvdGVjdGVkIHJlYWRvbmx5IF92YWx1ZXM6IFZbXSA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXG5cdFx0ICogdG8gY2hlY2sgZm9yIGVxdWFsaXR5LiBTZWUgaHR0cDovL216bC5sYS8xenVLTzJWXG5cdFx0ICovXG5cdFx0cHJvdGVjdGVkIF9pbmRleE9mS2V5KGtleXM6IEtbXSwga2V5OiBLKTogbnVtYmVyIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChvYmplY3RJcyhrZXlzW2ldLCBrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXSA9IE1hcDtcblxuXHRcdGNvbnN0cnVjdG9yKGl0ZXJhYmxlPzogQXJyYXlMaWtlPFtLLCBWXT4gfCBJdGVyYWJsZTxbSywgVl0+KSB7XG5cdFx0XHRpZiAoaXRlcmFibGUpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdldCBzaXplKCk6IG51bWJlciB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0Y2xlYXIoKTogdm9pZCB7XG5cdFx0XHR0aGlzLl9rZXlzLmxlbmd0aCA9IHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9rZXlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR0aGlzLl92YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX2tleXMubWFwKChrZXk6IEssIGk6IG51bWJlcik6IFtLLCBWXSA9PiB7XG5cdFx0XHRcdHJldHVybiBba2V5LCB0aGlzLl92YWx1ZXNbaV1dO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XG5cdFx0fVxuXG5cdFx0Zm9yRWFjaChjYWxsYmFjazogKHZhbHVlOiBWLCBrZXk6IEssIG1hcEluc3RhbmNlOiBNYXA8SywgVj4pID0+IGFueSwgY29udGV4dD86IHt9KSB7XG5cdFx0XHRjb25zdCBrZXlzID0gdGhpcy5fa2V5cztcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZCB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiB0aGlzLl92YWx1ZXNbaW5kZXhdO1xuXHRcdH1cblxuXHRcdGhhcyhrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSkgPiAtMTtcblx0XHR9XG5cblx0XHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fa2V5cyk7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogSywgdmFsdWU6IFYpOiBNYXA8SywgVj4ge1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aW5kZXggPSBpbmRleCA8IDAgPyB0aGlzLl9rZXlzLmxlbmd0aCA6IGluZGV4O1xuXHRcdFx0dGhpcy5fa2V5c1tpbmRleF0gPSBrZXk7XG5cdFx0XHR0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHR2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxWPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzKCk7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdNYXAnID0gJ01hcCc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBNYXAudHMiLCJpbXBvcnQgeyBUaGVuYWJsZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IHF1ZXVlTWljcm9UYXNrIH0gZnJvbSAnLi9zdXBwb3J0L3F1ZXVlJztcbmltcG9ydCB7IEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5cbi8qKlxuICogRXhlY3V0b3IgaXMgdGhlIGludGVyZmFjZSBmb3IgZnVuY3Rpb25zIHVzZWQgdG8gaW5pdGlhbGl6ZSBhIFByb21pc2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0b3I8VD4ge1xuXHQvKipcblx0ICogVGhlIGV4ZWN1dG9yIGZvciB0aGUgcHJvbWlzZVxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzb2x2ZSBUaGUgcmVzb2x2ZXIgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICogQHBhcmFtIHJlamVjdCBUaGUgcmVqZWN0b3IgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICovXG5cdChyZXNvbHZlOiAodmFsdWU/OiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQsIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBsZXQgU2hpbVByb21pc2U6IHR5cGVvZiBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbmV4cG9ydCBjb25zdCBpc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZTxUPih2YWx1ZTogYW55KTogdmFsdWUgaXMgUHJvbWlzZUxpa2U8VD4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59O1xuXG5pZiAoIWhhcygnZXM2LXByb21pc2UnKSkge1xuXHRjb25zdCBlbnVtIFN0YXRlIHtcblx0XHRGdWxmaWxsZWQsXG5cdFx0UGVuZGluZyxcblx0XHRSZWplY3RlZFxuXHR9XG5cblx0Z2xvYmFsLlByb21pc2UgPSBTaGltUHJvbWlzZSA9IGNsYXNzIFByb21pc2U8VD4gaW1wbGVtZW50cyBUaGVuYWJsZTxUPiB7XG5cdFx0c3RhdGljIGFsbChpdGVyYWJsZTogSXRlcmFibGU8YW55IHwgUHJvbWlzZUxpa2U8YW55Pj4gfCAoYW55IHwgUHJvbWlzZUxpa2U8YW55PilbXSk6IFByb21pc2U8YW55PiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcblx0XHRcdFx0bGV0IGNvbXBsZXRlID0gMDtcblx0XHRcdFx0bGV0IHRvdGFsID0gMDtcblx0XHRcdFx0bGV0IHBvcHVsYXRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXg6IG51bWJlciwgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdFx0XHRcdHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHQrK2NvbXBsZXRlO1xuXHRcdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmluaXNoKCk6IHZvaWQge1xuXHRcdFx0XHRcdGlmIChwb3B1bGF0aW5nIHx8IGNvbXBsZXRlIDwgdG90YWwpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZSh2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KTogdm9pZCB7XG5cdFx0XHRcdFx0Kyt0b3RhbDtcblx0XHRcdFx0XHRpZiAoaXNUaGVuYWJsZShpdGVtKSkge1xuXHRcdFx0XHRcdFx0Ly8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpID0gMDtcblx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdHByb2Nlc3NJdGVtKGksIHZhbHVlKTtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG9wdWxhdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJhY2U8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQgfCBQcm9taXNlTGlrZTxUPj4gfCAoVCB8IFByb21pc2VMaWtlPFQ+KVtdKTogUHJvbWlzZTxUW10+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlOiAodmFsdWU/OiBhbnkpID0+IHZvaWQsIHJlamVjdCkge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdFx0XHRcdC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlamVjdChyZWFzb24/OiBhbnkpOiBQcm9taXNlPG5ldmVyPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdHJlamVjdChyZWFzb24pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlc29sdmUoKTogUHJvbWlzZTx2b2lkPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZT86IGFueSk6IFByb21pc2U8VD4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUpIHtcblx0XHRcdFx0cmVzb2x2ZSg8VD52YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXTogUHJvbWlzZUNvbnN0cnVjdG9yID0gU2hpbVByb21pc2UgYXMgUHJvbWlzZUNvbnN0cnVjdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBhIG5ldyBQcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZXhlY3V0b3Jcblx0XHQgKiBUaGUgZXhlY3V0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIFByb21pc2UgaXMgaW5zdGFudGlhdGVkLiBJdCBpcyByZXNwb25zaWJsZSBmb3Jcblx0XHQgKiBzdGFydGluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGVuIGl0IGlzIGludm9rZWQuXG5cdFx0ICpcblx0XHQgKiBUaGUgZXhlY3V0b3IgbXVzdCBjYWxsIGVpdGhlciB0aGUgcGFzc2VkIGByZXNvbHZlYCBmdW5jdGlvbiB3aGVuIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWRcblx0XHQgKiBzdWNjZXNzZnVsbHksIG9yIHRoZSBgcmVqZWN0YCBmdW5jdGlvbiB3aGVuIHRoZSBvcGVyYXRpb24gZmFpbHMuXG5cdFx0ICovXG5cdFx0Y29uc3RydWN0b3IoZXhlY3V0b3I6IEV4ZWN1dG9yPFQ+KSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIElmIHRydWUsIHRoZSByZXNvbHV0aW9uIG9mIHRoaXMgcHJvbWlzZSBpcyBjaGFpbmVkIChcImxvY2tlZCBpblwiKSB0byBhbm90aGVyIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBpc0NoYWluZWQgPSBmYWxzZTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgaXNSZXNvbHZlZCA9ICgpOiBib29sZWFuID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcgfHwgaXNDaGFpbmVkO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDYWxsYmFja3MgdGhhdCBzaG91bGQgYmUgaW52b2tlZCBvbmNlIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWQuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBjYWxsYmFja3M6IG51bGwgfCAoQXJyYXk8KCkgPT4gdm9pZD4pID0gW107XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW5pdGlhbGx5IHB1c2hlcyBjYWxsYmFja3Mgb250byBhIHF1ZXVlIGZvciBleGVjdXRpb24gb25jZSB0aGlzIHByb21pc2Ugc2V0dGxlcy4gQWZ0ZXIgdGhlIHByb21pc2Ugc2V0dGxlcyxcblx0XHRcdCAqIGVucXVldWVzIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3AgdHVybi5cblx0XHRcdCAqL1xuXHRcdFx0bGV0IHdoZW5GaW5pc2hlZCA9IGZ1bmN0aW9uKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG5cdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogU2V0dGxlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHNldHRsZSA9IChuZXdTdGF0ZTogU3RhdGUsIHZhbHVlOiBhbnkpOiB2b2lkID0+IHtcblx0XHRcdFx0Ly8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZWRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR3aGVuRmluaXNoZWQgPSBxdWV1ZU1pY3JvVGFzaztcblxuXHRcdFx0XHQvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xuXHRcdFx0XHQvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXG5cdFx0XHRcdGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRxdWV1ZU1pY3JvVGFzayhmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGNvdW50ID0gY2FsbGJhY2tzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNvbHZlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHJlc29sdmUgPSAobmV3U3RhdGU6IFN0YXRlLCB2YWx1ZTogYW55KTogdm9pZCA9PiB7XG5cdFx0XHRcdGlmIChpc1Jlc29sdmVkKCkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHtcblx0XHRcdFx0XHR2YWx1ZS50aGVuKHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLkZ1bGZpbGxlZCksIHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHRcdFx0aXNDaGFpbmVkID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZXR0bGUobmV3U3RhdGUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy50aGVuID0gPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRcdG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pIHwgdW5kZWZpbmVkIHwgbnVsbCxcblx0XHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHRcdCk6IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4gPT4ge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIHdoZW5GaW5pc2hlZCBpbml0aWFsbHkgcXVldWVzIHVwIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIGFmdGVyIHRoZSBwcm9taXNlIGhhcyBzZXR0bGVkLiBPbmNlIHRoZVxuXHRcdFx0XHRcdC8vIHByb21pc2UgaGFzIHNldHRsZWQsIHdoZW5GaW5pc2hlZCB3aWxsIHNjaGVkdWxlIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IHR1cm4gdGhyb3VnaCB0aGVcblx0XHRcdFx0XHQvLyBldmVudCBsb29wLlxuXHRcdFx0XHRcdHdoZW5GaW5pc2hlZCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBjYWxsYmFjazogKCh2YWx1ZT86IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCB8IG51bGwgPVxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoY2FsbGJhY2sodGhpcy5yZXNvbHZlZFZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgU3RhdGUuRnVsZmlsbGVkKSwgcmVzb2x2ZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRzZXR0bGUoU3RhdGUuUmVqZWN0ZWQsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjYXRjaDxUUmVzdWx0ID0gbmV2ZXI+KFxuXHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0KTogUHJvbWlzZTxUIHwgVFJlc3VsdD4ge1xuXHRcdFx0cmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cblx0XHQgKi9cblx0XHRwcml2YXRlIHN0YXRlID0gU3RhdGUuUGVuZGluZztcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUge1R8YW55fVxuXHRcdCAqL1xuXHRcdHByaXZhdGUgcmVzb2x2ZWRWYWx1ZTogYW55O1xuXG5cdFx0dGhlbjogPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRvbmZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdFx0XHRvbnJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdCkgPT4gUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnUHJvbWlzZScgPSAnUHJvbWlzZSc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaW1Qcm9taXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFByb21pc2UudHMiLCJpbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBnZXRWYWx1ZURlc2NyaXB0b3IgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcblx0aW50ZXJmYWNlIFN5bWJvbENvbnN0cnVjdG9yIHtcblx0XHRvYnNlcnZhYmxlOiBzeW1ib2w7XG5cdH1cbn1cblxuZXhwb3J0IGxldCBTeW1ib2w6IFN5bWJvbENvbnN0cnVjdG9yID0gZ2xvYmFsLlN5bWJvbDtcblxuaWYgKCFoYXMoJ2VzNi1zeW1ib2wnKSkge1xuXHQvKipcblx0ICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cblx0ICogQHBhcmFtICB7YW55fSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcblx0ICogQHJldHVybiB7c3ltYm9sfSAgICAgICBSZXR1cm5zIHRoZSBzeW1ib2wgb3IgdGhyb3dzXG5cdCAqL1xuXHRjb25zdCB2YWxpZGF0ZVN5bWJvbCA9IGZ1bmN0aW9uIHZhbGlkYXRlU3ltYm9sKHZhbHVlOiBhbnkpOiBzeW1ib2wge1xuXHRcdGlmICghaXNTeW1ib2wodmFsdWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXG5cdGNvbnN0IGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblx0Y29uc3QgZGVmaW5lUHJvcGVydHk6IChcblx0XHRvOiBhbnksXG5cdFx0cDogc3RyaW5nIHwgc3ltYm9sLFxuXHRcdGF0dHJpYnV0ZXM6IFByb3BlcnR5RGVzY3JpcHRvciAmIFRoaXNUeXBlPGFueT5cblx0KSA9PiBhbnkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgYXMgYW55O1xuXHRjb25zdCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG5cdGNvbnN0IG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5cblx0Y29uc3QgZ2xvYmFsU3ltYm9sczogeyBba2V5OiBzdHJpbmddOiBzeW1ib2wgfSA9IHt9O1xuXG5cdGNvbnN0IGdldFN5bWJvbE5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgY3JlYXRlZCA9IGNyZWF0ZShudWxsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZGVzYzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcblx0XHRcdGxldCBwb3N0Zml4ID0gMDtcblx0XHRcdGxldCBuYW1lOiBzdHJpbmc7XG5cdFx0XHR3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XG5cdFx0XHRcdCsrcG9zdGZpeDtcblx0XHRcdH1cblx0XHRcdGRlc2MgKz0gU3RyaW5nKHBvc3RmaXggfHwgJycpO1xuXHRcdFx0Y3JlYXRlZFtkZXNjXSA9IHRydWU7XG5cdFx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cblx0XHRcdC8vIEZJWE1FOiBUZW1wb3JhcnkgZ3VhcmQgdW50aWwgdGhlIGR1cGxpY2F0ZSBleGVjdXRpb24gd2hlbiB0ZXN0aW5nIGNhbiBiZVxuXHRcdFx0Ly8gcGlubmVkIGRvd24uXG5cdFx0XHRpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlLCBuYW1lKSkge1xuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eShvYmpQcm90b3R5cGUsIG5hbWUsIHtcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCwgdmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdFx0ZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fTtcblx0fSkoKTtcblxuXHRjb25zdCBJbnRlcm5hbFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCh0aGlzOiBhbnksIGRlc2NyaXB0aW9uPzogc3RyaW5nIHwgbnVtYmVyKTogc3ltYm9sIHtcblx0XHRpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRyZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcblx0fTtcblxuXHRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKHRoaXM6IFN5bWJvbCwgZGVzY3JpcHRpb24/OiBzdHJpbmcgfCBudW1iZXIpOiBzeW1ib2wge1xuXHRcdGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRjb25zdCBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSk7XG5cdFx0ZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pO1xuXHRcdHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bSwge1xuXHRcdFx0X19kZXNjcmlwdGlvbl9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxuXHRcdFx0X19uYW1lX186IGdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lKGRlc2NyaXB0aW9uKSlcblx0XHR9KTtcblx0fSBhcyBTeW1ib2xDb25zdHJ1Y3RvcjtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0U3ltYm9sLFxuXHRcdCdmb3InLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbihrZXk6IHN0cmluZyk6IHN5bWJvbCB7XG5cdFx0XHRpZiAoZ2xvYmFsU3ltYm9sc1trZXldKSB7XG5cdFx0XHRcdHJldHVybiBnbG9iYWxTeW1ib2xzW2tleV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbChTdHJpbmcoa2V5KSkpO1xuXHRcdH0pXG5cdCk7XG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLCB7XG5cdFx0a2V5Rm9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24oc3ltOiBzeW1ib2wpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRcdFx0bGV0IGtleTogc3RyaW5nO1xuXHRcdFx0dmFsaWRhdGVTeW1ib2woc3ltKTtcblx0XHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcblx0XHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLFxuXHRcdGhhc0luc3RhbmNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpc0NvbmNhdFNwcmVhZGFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpdGVyYXRvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0bWF0Y2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdG9ic2VydmFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0cmVwbGFjZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzZWFyY2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzcGVjaWVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwbGl0OiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR0b1ByaW1pdGl2ZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dG9TdHJpbmdUYWc6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHVuc2NvcGFibGVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXG5cdGRlZmluZVByb3BlcnRpZXMoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLCB7XG5cdFx0Y29uc3RydWN0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wpLFxuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoXG5cdFx0XHRmdW5jdGlvbih0aGlzOiB7IF9fbmFtZV9fOiBzdHJpbmcgfSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX25hbWVfXztcblx0XHRcdH0sXG5cdFx0XHRmYWxzZSxcblx0XHRcdGZhbHNlXG5cdFx0KVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sLnByb3RvdHlwZSAqL1xuXHRkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHR0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuICdTeW1ib2wgKCcgKyAoPGFueT52YWxpZGF0ZVN5bWJvbCh0aGlzKSkuX19kZXNjcmlwdGlvbl9fICsgJyknO1xuXHRcdH0pLFxuXHRcdHZhbHVlT2Y6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTtcblx0XHR9KVxuXHR9KTtcblxuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdFx0fSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoJ1N5bWJvbCcsIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xuXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdEludGVybmFsU3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKCg8YW55PlN5bWJvbCkucHJvdG90eXBlW1N5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0SW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoKDxhbnk+U3ltYm9sKS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKVxuXHQpO1xufVxuXG4vKipcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcGFyYW0gIHthbnl9ICAgICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjayB0byBzZWUgaWYgaXQgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcmV0dXJuIHtpcyBzeW1ib2x9ICAgICAgIFJldHVybnMgdHJ1ZSBpZiBhIHN5bWJvbCBvciBub3QgKGFuZCBuYXJyb3dzIHRoZSB0eXBlIGd1YXJkKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTeW1ib2wodmFsdWU6IGFueSk6IHZhbHVlIGlzIHN5bWJvbCB7XG5cdHJldHVybiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgfHwgdmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpKSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cbiAqL1xuW1xuXHQnaGFzSW5zdGFuY2UnLFxuXHQnaXNDb25jYXRTcHJlYWRhYmxlJyxcblx0J2l0ZXJhdG9yJyxcblx0J3NwZWNpZXMnLFxuXHQncmVwbGFjZScsXG5cdCdzZWFyY2gnLFxuXHQnc3BsaXQnLFxuXHQnbWF0Y2gnLFxuXHQndG9QcmltaXRpdmUnLFxuXHQndG9TdHJpbmdUYWcnLFxuXHQndW5zY29wYWJsZXMnLFxuXHQnb2JzZXJ2YWJsZSdcbl0uZm9yRWFjaCgod2VsbEtub3duKSA9PiB7XG5cdGlmICghKFN5bWJvbCBhcyBhbnkpW3dlbGxLbm93bl0pIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sLCB3ZWxsS25vd24sIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFN5bWJvbC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Vha01hcDxLIGV4dGVuZHMgb2JqZWN0LCBWPiB7XG5cdC8qKlxuXHQgKiBSZW1vdmUgYSBga2V5YCBmcm9tIHRoZSBtYXBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJlbW92ZVxuXHQgKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUgdmFsdWUgd2FzIHJlbW92ZWQsIG90aGVyd2lzZSBgZmFsc2VgXG5cdCAqL1xuXHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHZhbHVlLCBiYXNlZCBvbiB0aGUgc3VwcGxpZWQgYGtleWBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJldHJpZXZlIHRoZSBgdmFsdWVgIGZvclxuXHQgKiBAcmV0dXJuIHRoZSBgdmFsdWVgIGJhc2VkIG9uIHRoZSBga2V5YCBpZiBmb3VuZCwgb3RoZXJ3aXNlIGBmYWxzZWBcblx0ICovXG5cdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIGEgYGtleWAgaXMgcHJlc2VudCBpbiB0aGUgbWFwXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBrZXkgaXMgcGFydCBvZiB0aGUgbWFwLCBvdGhlcndpc2UgYGZhbHNlYC5cblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXQgYSBgdmFsdWVgIGZvciBhIHBhcnRpY3VsYXIgYGtleWAuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIHNldCB0aGUgYHZhbHVlYCBmb3Jcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBgdmFsdWVgIHRvIHNldFxuXHQgKiBAcmV0dXJuIHRoZSBpbnN0YW5jZXNcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHRyZWFkb25seSBbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1dlYWtNYXAnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdlYWtNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRuZXcgKCk6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlPzogW0ssIFZdW10pOiBXZWFrTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlOiBJdGVyYWJsZTxbSywgVl0+KTogV2Vha01hcDxLLCBWPjtcblxuXHRyZWFkb25seSBwcm90b3R5cGU6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xufVxuXG5leHBvcnQgbGV0IFdlYWtNYXA6IFdlYWtNYXBDb25zdHJ1Y3RvciA9IGdsb2JhbC5XZWFrTWFwO1xuXG5pbnRlcmZhY2UgRW50cnk8SywgVj4ge1xuXHRrZXk6IEs7XG5cdHZhbHVlOiBWO1xufVxuXG5pZiAoIWhhcygnZXM2LXdlYWttYXAnKSkge1xuXHRjb25zdCBERUxFVEVEOiBhbnkgPSB7fTtcblxuXHRjb25zdCBnZXRVSUQgPSBmdW5jdGlvbiBnZXRVSUQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKTtcblx0fTtcblxuXHRjb25zdCBnZW5lcmF0ZU5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHN0YXJ0SWQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgJSAxMDAwMDAwMDApO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuICdfX3dtJyArIGdldFVJRCgpICsgKHN0YXJ0SWQrKyArICdfXycpO1xuXHRcdH07XG5cdH0pKCk7XG5cblx0V2Vha01hcCA9IGNsYXNzIFdlYWtNYXA8SywgVj4ge1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZztcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9mcm96ZW5FbnRyaWVzOiBFbnRyeTxLLCBWPltdO1xuXG5cdFx0Y29uc3RydWN0b3IoaXRlcmFibGU/OiBBcnJheUxpa2U8W0ssIFZdPiB8IEl0ZXJhYmxlPFtLLCBWXT4pIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX25hbWUnLCB7XG5cdFx0XHRcdHZhbHVlOiBnZW5lcmF0ZU5hbWUoKVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMgPSBbXTtcblxuXHRcdFx0aWYgKGl0ZXJhYmxlKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpdGVtID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5OiBhbnkpOiBudW1iZXIge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mcm96ZW5FbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xuXHRcdFx0XHRlbnRyeS52YWx1ZSA9IERFTEVURUQ7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRnZXQoa2V5OiBhbnkpOiBWIHwgdW5kZWZpbmVkIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG5cdFx0XHRcdHJldHVybiBlbnRyeS52YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnJvemVuRW50cmllc1tmcm96ZW5JbmRleF0udmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFzKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKEJvb2xlYW4oZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogYW55LCB2YWx1ZT86IGFueSk6IHRoaXMge1xuXHRcdFx0aWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcblx0XHRcdH1cblx0XHRcdGxldCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XG5cdFx0XHRcdGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG5cdFx0XHRcdFx0a2V5OiB7IHZhbHVlOiBrZXkgfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcblx0XHRcdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiBlbnRyeVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbnRyeS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdXZWFrTWFwJyA9ICdXZWFrTWFwJztcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2Vha01hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBXZWFrTWFwLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSwgaXNJdGVyYWJsZSwgSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCB7IE1BWF9TQUZFX0lOVEVHRVIgfSBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXBDYWxsYmFjazxULCBVPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gbWFwcGluZ1xuXHQgKlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBtYXBwZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50XG5cdCAqL1xuXHQoZWxlbWVudDogVCwgaW5kZXg6IG51bWJlcik6IFU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZENhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB1c2luZyBmaW5kXG5cdCAqXG5cdCAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgaXMgY3VycmVudHkgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGFycmF5IFRoZSBzb3VyY2UgYXJyYXlcblx0ICovXG5cdChlbGVtZW50OiBULCBpbmRleDogbnVtYmVyLCBhcnJheTogQXJyYXlMaWtlPFQ+KTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFdyaXRhYmxlQXJyYXlMaWtlPFQ+IHtcblx0cmVhZG9ubHkgbGVuZ3RoOiBudW1iZXI7XG5cdFtuOiBudW1iZXJdOiBUO1xufVxuXG4vKiBFUzYgQXJyYXkgc3RhdGljIG1ldGhvZHMgKi9cblxuZXhwb3J0IGludGVyZmFjZSBGcm9tIHtcblx0LyoqXG5cdCAqIFRoZSBBcnJheS5mcm9tKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgQXJyYXkgaW5zdGFuY2UgZnJvbSBhbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZSBBbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdCAqIEBwYXJhbSBtYXBGdW5jdGlvbiBBIG1hcCBmdW5jdGlvbiB0byBjYWxsIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXlcblx0ICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgbWFwIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm4gVGhlIG5ldyBBcnJheVxuXHQgKi9cblx0PFQsIFU+KHNvdXJjZTogQXJyYXlMaWtlPFQ+IHwgSXRlcmFibGU8VD4sIG1hcEZ1bmN0aW9uOiBNYXBDYWxsYmFjazxULCBVPiwgdGhpc0FyZz86IGFueSk6IEFycmF5PFU+O1xuXG5cdC8qKlxuXHQgKiBUaGUgQXJyYXkuZnJvbSgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IEFycmF5IGluc3RhbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgQW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheVxuXHQgKiBAcmV0dXJuIFRoZSBuZXcgQXJyYXlcblx0ICovXG5cdDxUPihzb3VyY2U6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KTogQXJyYXk8VD47XG59XG5cbmV4cG9ydCBsZXQgZnJvbTogRnJvbTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGFycmF5IGZyb20gdGhlIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIGFyZ3VtZW50cyBBbnkgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgdGhlIGFycmF5XG4gKiBAcmV0dXJuIEFuIGFycmF5IGZyb20gdGhlIGdpdmVuIGFyZ3VtZW50c1xuICovXG5leHBvcnQgbGV0IG9mOiA8VD4oLi4uaXRlbXM6IFRbXSkgPT4gQXJyYXk8VD47XG5cbi8qIEVTNiBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogQ29waWVzIGRhdGEgaW50ZXJuYWxseSB3aXRoaW4gYW4gYXJyYXkgb3IgYXJyYXktbGlrZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gb2Zmc2V0IFRoZSBpbmRleCB0byBzdGFydCBjb3B5aW5nIHZhbHVlcyB0bzsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgKGluY2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBlbmQgVGhlIGxhc3QgKGV4Y2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEByZXR1cm4gVGhlIHRhcmdldFxuICovXG5leHBvcnQgbGV0IGNvcHlXaXRoaW46IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgb2Zmc2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbGxzIGVsZW1lbnRzIG9mIGFuIGFycmF5LWxpa2Ugb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gZmlsbFxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBmaWxsIGVhY2ggZWxlbWVudCBvZiB0aGUgdGFyZ2V0IHdpdGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgaW5kZXggdG8gZmlsbFxuICogQHBhcmFtIGVuZCBUaGUgKGV4Y2x1c2l2ZSkgaW5kZXggYXQgd2hpY2ggdG8gc3RvcCBmaWxsaW5nXG4gKiBAcmV0dXJuIFRoZSBmaWxsZWQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBsZXQgZmlsbDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbmRzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbnN0YW5jZSBtYXRjaGluZyB0aGUgY2FsbGJhY2sgb3IgdW5kZWZpbmVkIGlmIG9uZSBpcyBub3QgZm91bmQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGlmIHRoZSBjdXJyZW50IHZhbHVlIG1hdGNoZXMgYSBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyB0aGUgY2FsbGJhY2ssIG9yIHVuZGVmaW5lZCBpZiBvbmUgZG9lcyBub3QgZXhpc3RcbiAqL1xuZXhwb3J0IGxldCBmaW5kOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gVCB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBzZWFyY2ggYW5kIHJldHVybnMgdGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLFxuICogb3IgLTEgaWYgbm8gdmFsdWVzIHNhdGlzZnkgaXQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRydWUgaWYgdGhlIGN1cnJlbnQgdmFsdWUgc2F0aXNmaWVzIGl0cyBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0XG4gKi9cbmV4cG9ydCBsZXQgZmluZEluZGV4OiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gbnVtYmVyO1xuXG4vKiBFUzcgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBhcnJheSBpbmNsdWRlcyBhIGdpdmVuIHZhbHVlXG4gKlxuICogQHBhcmFtIHRhcmdldCB0aGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gc2VhcmNoRWxlbWVudCB0aGUgaXRlbSB0byBzZWFyY2ggZm9yXG4gKiBAcGFyYW0gZnJvbUluZGV4IHRoZSBzdGFydGluZyBpbmRleCB0byBzZWFyY2ggZnJvbVxuICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGFycmF5IGluY2x1ZGVzIHRoZSBlbGVtZW50LCBvdGhlcndpc2UgYGZhbHNlYFxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHNlYXJjaEVsZW1lbnQ6IFQsIGZyb21JbmRleD86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuaWYgKGhhcygnZXM2LWFycmF5JykgJiYgaGFzKCdlczYtYXJyYXktZmlsbCcpKSB7XG5cdGZyb20gPSBnbG9iYWwuQXJyYXkuZnJvbTtcblx0b2YgPSBnbG9iYWwuQXJyYXkub2Y7XG5cdGNvcHlXaXRoaW4gPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuY29weVdpdGhpbik7XG5cdGZpbGwgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XG5cdGZpbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZCk7XG5cdGZpbmRJbmRleCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpO1xufSBlbHNlIHtcblx0Ly8gSXQgaXMgb25seSBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkvaU9TIHRoYXQgaGF2ZSBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uIGFuZCBzbyBhcmVuJ3QgaW4gdGhlIHdpbGRcblx0Ly8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxuXG5cdC8qKlxuXHQgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cblx0ICpcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG5cdCAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXG5cdCAqL1xuXHRjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAoaXNOYU4obGVuZ3RoKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0bGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcblx0ICogQHJldHVybiBBbiBpbnRlZ2VyXG5cdCAqL1xuXHRjb25zdCB0b0ludGVnZXIgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWU6IGFueSk6IG51bWJlciB7XG5cdFx0dmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXHRcdGlmIChpc05hTih2YWx1ZSkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcblx0fTtcblxuXHQvKipcblx0ICogTm9ybWFsaXplcyBhbiBvZmZzZXQgYWdhaW5zdCBhIGdpdmVuIGxlbmd0aCwgd3JhcHBpbmcgaXQgaWYgbmVnYXRpdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIHRvdGFsIGxlbmd0aCB0byBub3JtYWxpemUgYWdhaW5zdFxuXHQgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxuXHQgKi9cblx0Y29uc3Qgbm9ybWFsaXplT2Zmc2V0ID0gZnVuY3Rpb24gbm9ybWFsaXplT2Zmc2V0KHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5tYXgobGVuZ3RoICsgdmFsdWUsIDApIDogTWF0aC5taW4odmFsdWUsIGxlbmd0aCk7XG5cdH07XG5cblx0ZnJvbSA9IGZ1bmN0aW9uIGZyb20oXG5cdFx0dGhpczogQXJyYXlDb25zdHJ1Y3Rvcixcblx0XHRhcnJheUxpa2U6IEl0ZXJhYmxlPGFueT4gfCBBcnJheUxpa2U8YW55Pixcblx0XHRtYXBGdW5jdGlvbj86IE1hcENhbGxiYWNrPGFueSwgYW55Pixcblx0XHR0aGlzQXJnPzogYW55XG5cdCk6IEFycmF5PGFueT4ge1xuXHRcdGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRpZiAobWFwRnVuY3Rpb24gJiYgdGhpc0FyZykge1xuXHRcdFx0bWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xuXHRcdH1cblxuXHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0Y29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXHRcdGNvbnN0IGxlbmd0aDogbnVtYmVyID0gdG9MZW5ndGgoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGgpO1xuXG5cdFx0Ly8gU3VwcG9ydCBleHRlbnNpb25cblx0XHRjb25zdCBhcnJheTogYW55W10gPVxuXHRcdFx0dHlwZW9mIENvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gPGFueVtdPk9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcblxuXHRcdGlmICghaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxuXHRcdC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cblx0XHRpZiAoaXNBcnJheUxpa2UoYXJyYXlMaWtlKSkge1xuXHRcdFx0aWYgKGxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbihhcnJheUxpa2VbaV0sIGkpIDogYXJyYXlMaWtlW2ldO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGFycmF5TGlrZSkge1xuXHRcdFx0XHRhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnJheTtcblx0fTtcblxuXHRvZiA9IGZ1bmN0aW9uIG9mPFQ+KC4uLml0ZW1zOiBUW10pOiBBcnJheTxUPiB7XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcblx0fTtcblxuXHRjb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbjxUPihcblx0XHR0YXJnZXQ6IEFycmF5TGlrZTxUPixcblx0XHRvZmZzZXQ6IG51bWJlcixcblx0XHRzdGFydDogbnVtYmVyLFxuXHRcdGVuZD86IG51bWJlclxuXHQpOiBBcnJheUxpa2U8VD4ge1xuXHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignY29weVdpdGhpbjogdGFyZ2V0IG11c3QgYmUgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRvZmZzZXQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKG9mZnNldCksIGxlbmd0aCk7XG5cdFx0c3RhcnQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcblx0XHRlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcblx0XHRsZXQgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcblxuXHRcdGxldCBkaXJlY3Rpb24gPSAxO1xuXHRcdGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XG5cdFx0XHRkaXJlY3Rpb24gPSAtMTtcblx0XHRcdHN0YXJ0ICs9IGNvdW50IC0gMTtcblx0XHRcdG9mZnNldCArPSBjb3VudCAtIDE7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKGNvdW50ID4gMCkge1xuXHRcdFx0aWYgKHN0YXJ0IGluIHRhcmdldCkge1xuXHRcdFx0XHQodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSAodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdO1xuXHRcdFx0fVxuXG5cdFx0XHRvZmZzZXQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0c3RhcnQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0Y291bnQtLTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbGwgPSBmdW5jdGlvbiBmaWxsPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogYW55LCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKTogQXJyYXlMaWtlPFQ+IHtcblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRsZXQgaSA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xuXHRcdGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xuXG5cdFx0d2hpbGUgKGkgPCBlbmQpIHtcblx0XHRcdCh0YXJnZXQgYXMgV3JpdGFibGVBcnJheUxpa2U8VD4pW2krK10gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbmQgPSBmdW5jdGlvbiBmaW5kPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pOiBUIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBpbmRleCA9IGZpbmRJbmRleDxUPih0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0XHRyZXR1cm4gaW5kZXggIT09IC0xID8gdGFyZ2V0W2luZGV4XSA6IHVuZGVmaW5lZDtcblx0fTtcblxuXHRmaW5kSW5kZXggPSBmdW5jdGlvbiBmaW5kSW5kZXg8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSk6IG51bWJlciB7XG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cblx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNBcmcpIHtcblx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fTtcbn1cblxuaWYgKGhhcygnZXM3LWFycmF5JykpIHtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcblx0ICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcblx0ICovXG5cdGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuXHRcdGlmIChpc05hTihsZW5ndGgpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0aW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlczxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgc2VhcmNoRWxlbWVudDogVCwgZnJvbUluZGV4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0bGV0IGxlbiA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IGZyb21JbmRleDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcblx0XHRcdGlmIChcblx0XHRcdFx0c2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcblx0XHRcdFx0KHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcnJheS50cyIsImNvbnN0IGdsb2JhbE9iamVjdDogYW55ID0gKGZ1bmN0aW9uKCk6IGFueSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG5cdFx0Ly8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xuXHRcdHJldHVybiBnbG9iYWw7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyB3aW5kb3cgaXMgZGVmaW5lZCBpbiBicm93c2Vyc1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gc2VsZiBpcyBkZWZpbmVkIGluIFdlYldvcmtlcnNcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2xvYmFsT2JqZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGdsb2JhbC50cyIsImltcG9ydCAnLi9TeW1ib2wnO1xuaW1wb3J0IHsgSElHSF9TVVJST0dBVEVfTUFYLCBISUdIX1NVUlJPR0FURV9NSU4gfSBmcm9tICcuL3N0cmluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3JSZXN1bHQ8VD4ge1xuXHRyZWFkb25seSBkb25lOiBib29sZWFuO1xuXHRyZWFkb25seSB2YWx1ZTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYXRvcjxUPiB7XG5cdG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcblxuXHRyZXR1cm4/KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cblx0dGhyb3c/KGU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZTxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlSXRlcmF0b3I8VD4gZXh0ZW5kcyBJdGVyYXRvcjxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VD47XG59XG5cbmNvbnN0IHN0YXRpY0RvbmU6IEl0ZXJhdG9yUmVzdWx0PGFueT4gPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcblxuLyoqXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgU2hpbUl0ZXJhdG9yPFQ+IHtcblx0cHJpdmF0ZSBfbGlzdDogQXJyYXlMaWtlPFQ+O1xuXHRwcml2YXRlIF9uZXh0SW5kZXggPSAtMTtcblx0cHJpdmF0ZSBfbmF0aXZlSXRlcmF0b3I6IEl0ZXJhdG9yPFQ+O1xuXG5cdGNvbnN0cnVjdG9yKGxpc3Q6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KSB7XG5cdFx0aWYgKGlzSXRlcmFibGUobGlzdCkpIHtcblx0XHRcdHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2xpc3QgPSBsaXN0O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXG5cdCAqL1xuXHRuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0XHRpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5fbGlzdCkge1xuXHRcdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdFx0fVxuXHRcdGlmICgrK3RoaXMuX25leHRJbmRleCA8IHRoaXMuX2xpc3QubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkb25lOiBmYWxzZSxcblx0XHRcdFx0dmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgSXRlcmFibGU8YW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWU6IGFueSk6IHZhbHVlIGlzIEFycmF5TGlrZTxhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0PFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPik6IEl0ZXJhdG9yPFQ+IHwgdW5kZWZpbmVkIHtcblx0aWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XG5cdFx0cmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcblx0fSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb3JPZkNhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGEgZm9yT2YoKSBpdGVyYXRpb25cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBjdXJyZW50IHZhbHVlXG5cdCAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyXG5cdCAqIEBwYXJhbSBkb0JyZWFrIEEgZnVuY3Rpb24sIGlmIGNhbGxlZCwgd2lsbCBzdG9wIHRoZSBpdGVyYXRpb25cblx0ICovXG5cdCh2YWx1ZTogVCwgb2JqZWN0OiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZywgZG9CcmVhazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKlxuICogU2hpbXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYGZvciAuLi4gb2ZgIGJsb2Nrc1xuICpcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgb2JqZWN0IHRoZSBwcm92aWRlcyBhbiBpbnRlcmF0b3IgaW50ZXJmYWNlXG4gKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gb2YgdGhlIGl0ZXJhYmxlXG4gKiBAcGFyYW0gdGhpc0FyZyBPcHRpb25hbCBzY29wZSB0byBwYXNzIHRoZSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yT2Y8VD4oXG5cdGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZyxcblx0Y2FsbGJhY2s6IEZvck9mQ2FsbGJhY2s8VD4sXG5cdHRoaXNBcmc/OiBhbnlcbik6IHZvaWQge1xuXHRsZXQgYnJva2VuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gZG9CcmVhaygpIHtcblx0XHRicm9rZW4gPSB0cnVlO1xuXHR9XG5cblx0LyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cblx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0Y29uc3QgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7ICsraSkge1xuXHRcdFx0bGV0IGNoYXIgPSBpdGVyYWJsZVtpXTtcblx0XHRcdGlmIChpICsgMSA8IGwpIHtcblx0XHRcdFx0Y29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcblx0XHRcdFx0aWYgKGNvZGUgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGNvZGUgPD0gSElHSF9TVVJST0dBVEVfTUFYKSB7XG5cdFx0XHRcdFx0Y2hhciArPSBpdGVyYWJsZVsrK2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNoYXIsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcblx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdCBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XG5cdFx0aWYgKGl0ZXJhdG9yKSB7XG5cdFx0XHRsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG5cdFx0XHR3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGl0ZXJhdG9yLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKlxuICogVGhlIHNtYWxsZXN0IGludGVydmFsIGJldHdlZW4gdHdvIHJlcHJlc2VudGFibGUgbnVtYmVycy5cbiAqL1xuZXhwb3J0IGNvbnN0IEVQU0lMT04gPSAxO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUlOX1NBRkVfSU5URUdFUiA9IC1NQVhfU0FGRV9JTlRFR0VSO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIE5hTiB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBOYU4sIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYU4odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNOYU4odmFsdWUpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc0Zpbml0ZSh2YWx1ZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIgdGhhdCBpcyAnc2FmZSwnIG1lYW5pbmc6XG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXG4gKiAgICAgIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uIGNhbm5vdCBiZSB0aGUgcmVzdWx0IG9mIHJvdW5kaW5nIGFueSBvdGhlclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiBNYXRoLmFicyh2YWx1ZSkgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBudW1iZXIudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgeyBpc1N5bWJvbCB9IGZyb20gJy4vU3ltYm9sJztcblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RBc3NpZ24ge1xuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFU+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVLCBWPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICogQHBhcmFtIHNvdXJjZTMgVGhlIHRoaXJkIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVSwgViwgVz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcblxuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlcyBPbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllc1xuXHQgKi9cblx0KHRhcmdldDogb2JqZWN0LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RFbnRlcmllcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleS92YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQ8VCBleHRlbmRzIHsgW2tleTogc3RyaW5nXTogYW55IH0sIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBUKTogW2tleW9mIFQsIFRbS11dW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5L3ZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdChvOiBvYmplY3QpOiBbc3RyaW5nLCBhbnldW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB7XG5cdDxUPihvOiBUKTogeyBbSyBpbiBrZXlvZiBUXTogUHJvcGVydHlEZXNjcmlwdG9yIH07XG5cdChvOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdFZhbHVlcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdDxUPihvOiB7IFtzOiBzdHJpbmddOiBUIH0pOiBUW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0KG86IG9iamVjdCk6IGFueVtdO1xufVxuXG5leHBvcnQgbGV0IGFzc2lnbjogT2JqZWN0QXNzaWduO1xuXG4vKipcbiAqIEdldHMgdGhlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICogQW4gb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb25lIHRoYXQgaXMgZGVmaW5lZCBkaXJlY3RseSBvbiB0aGUgb2JqZWN0IGFuZCBpcyBub3RcbiAqIGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gcCBOYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IDxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcHJvcGVydHlLZXk6IEspID0+IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LiBUaGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFyZSB0aG9zZSB0aGF0IGFyZSBkZWZpbmVkIGRpcmVjdGx5XG4gKiBvbiB0aGF0IG9iamVjdCwgYW5kIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS4gVGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGluY2x1ZGUgYm90aCBmaWVsZHMgKG9iamVjdHMpIGFuZCBmdW5jdGlvbnMuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgb3duIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlOYW1lczogKG86IGFueSkgPT4gc3RyaW5nW107XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3ltYm9sIHByb3BlcnRpZXMgZm91bmQgZGlyZWN0bHkgb24gb2JqZWN0IG8uXG4gKiBAcGFyYW0gbyBPYmplY3QgdG8gcmV0cmlldmUgdGhlIHN5bWJvbHMgZnJvbS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IChvOiBhbnkpID0+IHN5bWJvbFtdO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHBhcmFtIHZhbHVlMSBUaGUgZmlyc3QgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUyIFRoZSBzZWNvbmQgdmFsdWUuXG4gKi9cbmV4cG9ydCBsZXQgaXM6ICh2YWx1ZTE6IGFueSwgdmFsdWUyOiBhbnkpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvZiBhbiBvYmplY3QuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cbiAqL1xuZXhwb3J0IGxldCBrZXlzOiAobzogb2JqZWN0KSA9PiBzdHJpbmdbXTtcblxuLyogRVM3IE9iamVjdCBzdGF0aWMgbWV0aG9kcyAqL1xuXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cbmV4cG9ydCBsZXQgZW50cmllczogT2JqZWN0RW50ZXJpZXM7XG5cbmV4cG9ydCBsZXQgdmFsdWVzOiBPYmplY3RWYWx1ZXM7XG5cbmlmIChoYXMoJ2VzNi1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRhc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG5cdGdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cdGlzID0gZ2xvYmFsT2JqZWN0LmlzO1xuXHRrZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XG59IGVsc2Uge1xuXHRrZXlzID0gZnVuY3Rpb24gc3ltYm9sQXdhcmVLZXlzKG86IG9iamVjdCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xuXHR9O1xuXG5cdGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pIHtcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcblx0XHRzb3VyY2VzLmZvckVhY2goKG5leHRTb3VyY2UpID0+IHtcblx0XHRcdGlmIChuZXh0U291cmNlKSB7XG5cdFx0XHRcdC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0XHRrZXlzKG5leHRTb3VyY2UpLmZvckVhY2goKG5leHRLZXkpID0+IHtcblx0XHRcdFx0XHR0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRvO1xuXHR9O1xuXG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihcblx0XHRvOiBhbnksXG5cdFx0cHJvcDogc3RyaW5nIHwgc3ltYm9sXG5cdCk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKGlzU3ltYm9sKHByb3ApKSB7XG5cdFx0XHRyZXR1cm4gKDxhbnk+T2JqZWN0KS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuXHRcdH1cblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvOiBhbnkpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobzogYW55KTogc3ltYm9sW10ge1xuXHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxuXHRcdFx0LmZpbHRlcigoa2V5KSA9PiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpXG5cdFx0XHQubWFwKChrZXkpID0+IFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSkpO1xuXHR9O1xuXG5cdGlzID0gZnVuY3Rpb24gaXModmFsdWUxOiBhbnksIHZhbHVlMjogYW55KTogYm9vbGVhbiB7XG5cdFx0aWYgKHZhbHVlMSA9PT0gdmFsdWUyKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUxICE9PSAwIHx8IDEgLyB2YWx1ZTEgPT09IDEgLyB2YWx1ZTI7IC8vIC0wXG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMSAmJiB2YWx1ZTIgIT09IHZhbHVlMjsgLy8gTmFOXG5cdH07XG59XG5cbmlmIChoYXMoJ2VzMjAxNy1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cdGVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcblx0dmFsdWVzID0gZ2xvYmFsT2JqZWN0LnZhbHVlcztcbn0gZWxzZSB7XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG86IGFueSkge1xuXHRcdHJldHVybiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLnJlZHVjZShcblx0XHRcdChwcmV2aW91cywga2V5KSA9PiB7XG5cdFx0XHRcdHByZXZpb3VzW2tleV0gPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KSE7XG5cdFx0XHRcdHJldHVybiBwcmV2aW91cztcblx0XHRcdH0sXG5cdFx0XHR7fSBhcyB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9XG5cdFx0KTtcblx0fTtcblxuXHRlbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvOiBhbnkpOiBbc3RyaW5nLCBhbnldW10ge1xuXHRcdHJldHVybiBrZXlzKG8pLm1hcCgoa2V5KSA9PiBba2V5LCBvW2tleV1dIGFzIFtzdHJpbmcsIGFueV0pO1xuXHR9O1xuXG5cdHZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyhvOiBhbnkpOiBhbnlbXSB7XG5cdFx0cmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IG9ba2V5XSk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gb2JqZWN0LnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdOb3JtYWxpemUge1xuXHQvKipcblx0ICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuXHQgKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG5cdCAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuXHQgKiBpcyBcIk5GQ1wiXG5cdCAqL1xuXHQodGFyZ2V0OiBzdHJpbmcsIGZvcm06ICdORkMnIHwgJ05GRCcgfCAnTkZLQycgfCAnTkZLRCcpOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cblx0ICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuXHQgKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcblx0ICogaXMgXCJORkNcIlxuXHQgKi9cblx0KHRhcmdldDogc3RyaW5nLCBmb3JtPzogc3RyaW5nKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUFYID0gMHhkYmZmO1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBMT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XG5cbi8qIEVTNiBzdGF0aWMgbWV0aG9kcyAqL1xuXG4vKipcbiAqIFJldHVybiB0aGUgU3RyaW5nIHZhbHVlIHdob3NlIGVsZW1lbnRzIGFyZSwgaW4gb3JkZXIsIHRoZSBlbGVtZW50cyBpbiB0aGUgTGlzdCBlbGVtZW50cy5cbiAqIElmIGxlbmd0aCBpcyAwLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICogQHBhcmFtIGNvZGVQb2ludHMgVGhlIGNvZGUgcG9pbnRzIHRvIGdlbmVyYXRlIHRoZSBzdHJpbmdcbiAqL1xuZXhwb3J0IGxldCBmcm9tQ29kZVBvaW50OiAoLi4uY29kZVBvaW50czogbnVtYmVyW10pID0+IHN0cmluZztcblxuLyoqXG4gKiBgcmF3YCBpcyBpbnRlbmRlZCBmb3IgdXNlIGFzIGEgdGFnIGZ1bmN0aW9uIG9mIGEgVGFnZ2VkIFRlbXBsYXRlIFN0cmluZy4gV2hlbiBjYWxsZWRcbiAqIGFzIHN1Y2ggdGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgYmUgYSB3ZWxsIGZvcm1lZCB0ZW1wbGF0ZSBjYWxsIHNpdGUgb2JqZWN0IGFuZCB0aGUgcmVzdFxuICogcGFyYW1ldGVyIHdpbGwgY29udGFpbiB0aGUgc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAqIEBwYXJhbSB0ZW1wbGF0ZSBBIHdlbGwtZm9ybWVkIHRlbXBsYXRlIHN0cmluZyBjYWxsIHNpdGUgcmVwcmVzZW50YXRpb24uXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBBIHNldCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICovXG5leHBvcnQgbGV0IHJhdzogKHRlbXBsYXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pID0+IHN0cmluZztcblxuLyogRVM2IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgbm9ubmVnYXRpdmUgaW50ZWdlciBOdW1iZXIgbGVzcyB0aGFuIDExMTQxMTIgKDB4MTEwMDAwKSB0aGF0IGlzIHRoZSBjb2RlIHBvaW50XG4gKiB2YWx1ZSBvZiB0aGUgVVRGLTE2IGVuY29kZWQgY29kZSBwb2ludCBzdGFydGluZyBhdCB0aGUgc3RyaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gcG9zIGluXG4gKiB0aGUgU3RyaW5nIHJlc3VsdGluZyBmcm9tIGNvbnZlcnRpbmcgdGhpcyBvYmplY3QgdG8gYSBTdHJpbmcuXG4gKiBJZiB0aGVyZSBpcyBubyBlbGVtZW50IGF0IHRoYXQgcG9zaXRpb24sIHRoZSByZXN1bHQgaXMgdW5kZWZpbmVkLlxuICogSWYgYSB2YWxpZCBVVEYtMTYgc3Vycm9nYXRlIHBhaXIgZG9lcyBub3QgYmVnaW4gYXQgcG9zLCB0aGUgcmVzdWx0IGlzIHRoZSBjb2RlIHVuaXQgYXQgcG9zLlxuICovXG5leHBvcnQgbGV0IGNvZGVQb2ludEF0OiAodGFyZ2V0OiBzdHJpbmcsIHBvcz86IG51bWJlcikgPT4gbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIGVuZFBvc2l0aW9uIOKAkyBsZW5ndGgodGhpcykuIE90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICovXG5leHBvcnQgbGV0IGVuZHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgc2VhcmNoU3RyaW5nIGFwcGVhcnMgYXMgYSBzdWJzdHJpbmcgb2YgdGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIHRoaXNcbiAqIG9iamVjdCB0byBhIFN0cmluZywgYXQgb25lIG9yIG1vcmUgcG9zaXRpb25zIHRoYXQgYXJlXG4gKiBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gcG9zaXRpb247IG90aGVyd2lzZSwgcmV0dXJucyBmYWxzZS5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBzZWFyY2hTdHJpbmcgc2VhcmNoIHN0cmluZ1xuICogQHBhcmFtIHBvc2l0aW9uIElmIHBvc2l0aW9uIGlzIHVuZGVmaW5lZCwgMCBpcyBhc3N1bWVkLCBzbyBhcyB0byBzZWFyY2ggYWxsIG9mIHRoZSBTdHJpbmcuXG4gKi9cbmV4cG9ydCBsZXQgaW5jbHVkZXM6ICh0YXJnZXQ6IHN0cmluZywgc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cbiAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcbiAqIGlzIFwiTkZDXCJcbiAqL1xuZXhwb3J0IGxldCBub3JtYWxpemU6IFN0cmluZ05vcm1hbGl6ZTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbWFkZSBmcm9tIGNvdW50IGNvcGllcyBhcHBlbmRlZCB0b2dldGhlci4gSWYgY291bnQgaXMgMCxcbiAqIFQgaXMgdGhlIGVtcHR5IFN0cmluZyBpcyByZXR1cm5lZC5cbiAqIEBwYXJhbSBjb3VudCBudW1iZXIgb2YgY29waWVzIHRvIGFwcGVuZFxuICovXG5leHBvcnQgbGV0IHJlcGVhdDogKHRhcmdldDogc3RyaW5nLCBjb3VudD86IG51bWJlcikgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIHBvc2l0aW9uLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBzdGFydHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyogRVM3IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxuICogVGhlIHBhZGRpbmcgaXMgYXBwbGllZCBmcm9tIHRoZSBlbmQgKHJpZ2h0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZEVuZDogKHRhcmdldDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIHN0YXJ0IChsZWZ0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZFN0YXJ0OiAodGFyZ2V0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbmlmIChoYXMoJ2VzNi1zdHJpbmcnKSAmJiBoYXMoJ2VzNi1zdHJpbmctcmF3JykpIHtcblx0ZnJvbUNvZGVQb2ludCA9IGdsb2JhbC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcblx0cmF3ID0gZ2xvYmFsLlN0cmluZy5yYXc7XG5cblx0Y29kZVBvaW50QXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcblx0ZW5kc1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKTtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcblx0bm9ybWFsaXplID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xuXHRyZXBlYXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnJlcGVhdCk7XG5cdHN0YXJ0c1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxuXHQgKiBVc2VkIGJ5IHN0YXJ0c1dpdGgsIGluY2x1ZGVzLCBhbmQgZW5kc1dpdGguXG5cdCAqXG5cdCAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cblx0ICovXG5cdGNvbnN0IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MgPSBmdW5jdGlvbihcblx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0dGV4dDogc3RyaW5nLFxuXHRcdHNlYXJjaDogc3RyaW5nLFxuXHRcdHBvc2l0aW9uOiBudW1iZXIsXG5cdFx0aXNFbmQ6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBbc3RyaW5nLCBzdHJpbmcsIG51bWJlcl0ge1xuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy4nICsgbmFtZSArICcgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcgdG8gc2VhcmNoIGFnYWluc3QuJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xuXHRcdHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XG5cdH07XG5cblx0ZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50czogbnVtYmVyW10pOiBzdHJpbmcge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcuZnJvbUNvZGVQb2ludFxuXHRcdGNvbnN0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0aWYgKCFsZW5ndGgpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRjb25zdCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXHRcdGNvbnN0IE1BWF9TSVpFID0gMHg0MDAwO1xuXHRcdGxldCBjb2RlVW5pdHM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IGluZGV4ID0gLTE7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXG5cdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdGxldCBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG5cblx0XHRcdC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2Vcblx0XHRcdGxldCBpc1ZhbGlkID1cblx0XHRcdFx0aXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XG5cdFx0XHRpZiAoIWlzVmFsaWQpIHtcblx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcblx0XHRcdFx0Ly8gQk1QIGNvZGUgcG9pbnRcblx0XHRcdFx0Y29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0bGV0IGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIEhJR0hfU1VSUk9HQVRFX01JTjtcblx0XHRcdFx0bGV0IGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgTE9XX1NVUlJPR0FURV9NSU47XG5cdFx0XHRcdGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcblx0XHRcdFx0cmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuXHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRyYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSk6IHN0cmluZyB7XG5cdFx0bGV0IHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGxldCBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XG5cblx0XHRpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGggLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dDogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuY29kZVBvaW50QXQgcmVxdXJpZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xuXHRcdFx0cG9zaXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxuXHRcdGNvbnN0IGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcblx0XHRpZiAoZmlyc3QgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IEhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcblx0XHRcdC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcblx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0Y29uc3Qgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG5cdFx0XHRpZiAoc2Vjb25kID49IExPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBMT1dfU1VSUk9HQVRFX01BWCkge1xuXHRcdFx0XHRyZXR1cm4gKGZpcnN0IC0gSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gTE9XX1NVUlJPR0FURV9NSU4gKyAweDEwMDAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlyc3Q7XG5cdH07XG5cblx0ZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcik6IGJvb2xlYW4ge1xuXHRcdGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xuXHRcdH1cblxuXHRcdFt0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSk7XG5cblx0XHRjb25zdCBzdGFydCA9IGVuZFBvc2l0aW9uIC0gc2VhcmNoLmxlbmd0aDtcblx0XHRpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xuXHR9O1xuXG5cdGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuXHRcdHJldHVybiB0ZXh0LmluZGV4T2Yoc2VhcmNoLCBwb3NpdGlvbikgIT09IC0xO1xuXHR9O1xuXG5cdHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0OiBzdHJpbmcsIGNvdW50OiBudW1iZXIgPSAwKTogc3RyaW5nIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5yZXBlYXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblx0XHRpZiAoY291bnQgIT09IGNvdW50KSB7XG5cdFx0XHRjb3VudCA9IDA7XG5cdFx0fVxuXHRcdGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdHdoaWxlIChjb3VudCkge1xuXHRcdFx0aWYgKGNvdW50ICUgMikge1xuXHRcdFx0XHRyZXN1bHQgKz0gdGV4dDtcblx0XHRcdH1cblx0XHRcdGlmIChjb3VudCA+IDEpIHtcblx0XHRcdFx0dGV4dCArPSB0ZXh0O1xuXHRcdFx0fVxuXHRcdFx0Y291bnQgPj49IDE7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0c3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRzZWFyY2ggPSBTdHJpbmcoc2VhcmNoKTtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XG5cblx0XHRjb25zdCBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XG5cdFx0aWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcblx0fTtcbn1cblxuaWYgKGhhcygnZXMyMDE3LXN0cmluZycpKSB7XG5cdHBhZEVuZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcblx0cGFkU3RhcnQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZFN0YXJ0KTtcbn0gZWxzZSB7XG5cdHBhZEVuZCA9IGZ1bmN0aW9uIHBhZEVuZCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRFbmQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuXHRcdFx0bWF4TGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcblx0XHRjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocGFkZGluZyA+IDApIHtcblx0XHRcdHN0clRleHQgKz1cblx0XHRcdFx0cmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xuXHRcdFx0XHRmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0clRleHQ7XG5cdH07XG5cblx0cGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XG5cdFx0XHRtYXhMZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGxldCBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xuXHRcdGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwYWRkaW5nID4gMCkge1xuXHRcdFx0c3RyVGV4dCA9XG5cdFx0XHRcdHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcblx0XHRcdFx0ZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcblx0XHRcdFx0c3RyVGV4dDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyVGV4dDtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzdHJpbmcudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcbmltcG9ydCB7IEhhbmRsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5mdW5jdGlvbiBleGVjdXRlVGFzayhpdGVtOiBRdWV1ZUl0ZW0gfCB1bmRlZmluZWQpOiB2b2lkIHtcblx0aWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XG5cdFx0aXRlbS5jYWxsYmFjaygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW06IFF1ZXVlSXRlbSwgZGVzdHJ1Y3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95OiBmdW5jdGlvbih0aGlzOiBIYW5kbGUpIHtcblx0XHRcdHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge307XG5cdFx0XHRpdGVtLmlzQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRpdGVtLmNhbGxiYWNrID0gbnVsbDtcblxuXHRcdFx0aWYgKGRlc3RydWN0b3IpIHtcblx0XHRcdFx0ZGVzdHJ1Y3RvcigpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuaW50ZXJmYWNlIFBvc3RNZXNzYWdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHNvdXJjZTogYW55O1xuXHRkYXRhOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJdGVtIHtcblx0aXNBY3RpdmU6IGJvb2xlYW47XG5cdGNhbGxiYWNrOiBudWxsIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbn1cblxubGV0IGNoZWNrTWljcm9UYXNrUXVldWU6ICgpID0+IHZvaWQ7XG5sZXQgbWljcm9UYXNrczogUXVldWVJdGVtW107XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVUYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRsZXQgZGVzdHJ1Y3RvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdC8vIFNpbmNlIHRoZSBJRSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0SW1tZWRpYXRlYCBpcyBub3QgZmxhd2xlc3MsIHdlIHdpbGwgdGVzdCBmb3IgYHBvc3RNZXNzYWdlYCBmaXJzdC5cblx0aWYgKGhhcygncG9zdG1lc3NhZ2UnKSkge1xuXHRcdGNvbnN0IHF1ZXVlOiBRdWV1ZUl0ZW1bXSA9IFtdO1xuXG5cdFx0Z2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudDogUG9zdE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuXHRcdFx0Ly8gQ29uZmlybSB0aGF0IHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgYnkgdGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uLlxuXHRcdFx0aWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09ICdkb2pvLXF1ZXVlLW1lc3NhZ2UnKSB7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdGlmIChxdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRleGVjdXRlVGFzayhxdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdGdsb2JhbC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnc2V0aW1tZWRpYXRlJykpIHtcblx0XHRkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJUaW1lb3V0O1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSwgMCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCBpZDogYW55ID0gZW5xdWV1ZShpdGVtKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShcblx0XHRcdGl0ZW0sXG5cdFx0XHRkZXN0cnVjdG9yICYmXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRlc3RydWN0b3IoaWQpO1xuXHRcdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuXHRyZXR1cm4gaGFzKCdtaWNyb3Rhc2tzJylcblx0XHQ/IHF1ZXVlVGFza1xuXHRcdDogZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gcXVldWVUYXNrKGNhbGxiYWNrKTtcblx0XHRcdH07XG59KSgpO1xuXG4vLyBXaGVuIG5vIG1lY2hhbmlzbSBmb3IgcmVnaXN0ZXJpbmcgbWljcm90YXNrcyBpcyBleHBvc2VkIGJ5IHRoZSBlbnZpcm9ubWVudCwgbWljcm90YXNrcyB3aWxsXG4vLyBiZSBxdWV1ZWQgYW5kIHRoZW4gZXhlY3V0ZWQgaW4gYSBzaW5nbGUgbWFjcm90YXNrIGJlZm9yZSB0aGUgb3RoZXIgbWFjcm90YXNrcyBhcmUgZXhlY3V0ZWQuXG5pZiAoIWhhcygnbWljcm90YXNrcycpKSB7XG5cdGxldCBpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xuXG5cdG1pY3JvVGFza3MgPSBbXTtcblx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdGlmICghaXNNaWNyb1Rhc2tRdWV1ZWQpIHtcblx0XHRcdGlzTWljcm9UYXNrUXVldWVkID0gdHJ1ZTtcblx0XHRcdHF1ZXVlVGFzayhmdW5jdGlvbigpIHtcblx0XHRcdFx0aXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRsZXQgaXRlbTogUXVldWVJdGVtIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHdoaWxlICgoaXRlbSA9IG1pY3JvVGFza3Muc2hpZnQoKSkpIHtcblx0XHRcdFx0XHRcdGV4ZWN1dGVUYXNrKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyBhbiBhbmltYXRpb24gdGFzayB3aXRoIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBpdCBleGlzdHMsIG9yIHdpdGggYHF1ZXVlVGFza2Agb3RoZXJ3aXNlLlxuICpcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXG4gKiBIb3dldmVyLCBhdCB0aW1lcyBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIGRlbGVnYXRlIHRvIHJlcXVlc3RBbmltYXRpb25GcmFtZTsgaGVuY2UgdGhlIGZvbGxvd2luZyBtZXRob2QuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXVlQW5pbWF0aW9uVGFzayA9IChmdW5jdGlvbigpIHtcblx0aWYgKCFoYXMoJ3JhZicpKSB7XG5cdFx0cmV0dXJuIHF1ZXVlVGFzaztcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCByYWZJZDogbnVtYmVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG5cdHJldHVybiBoYXMoJ21pY3JvdGFza3MnKVxuXHRcdD8gcXVldWVBbmltYXRpb25UYXNrXG5cdFx0OiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRcdHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xuXHRcdFx0fTtcbn0pKCk7XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXG4gKiBtZWNoYW5pc20gZm9yIHNjaGVkdWxpbmcgbWFjcm90YXNrcyBpcyBleHBvc2VkLCB0aGVuIGFueSBjYWxsYmFja3Mgd2lsbCBiZSBmaXJlZCBiZWZvcmUgYW55IG1hY3JvdGFza1xuICogcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZVRhc2tgIG9yIGBxdWV1ZUFuaW1hdGlvblRhc2tgLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBsZXQgcXVldWVNaWNyb1Rhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdGlmIChoYXMoJ2hvc3Qtbm9kZScpKSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Z2xvYmFsLnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ2VzNi1wcm9taXNlJykpIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRnbG9iYWwuUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZXhlY3V0ZVRhc2spO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdkb20tbXV0YXRpb25vYnNlcnZlcicpKSB7XG5cdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXHRcdGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjb25zdCBxdWV1ZTogUXVldWVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcblx0XHRcdFx0XHRpdGVtLmNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRtaWNyb1Rhc2tzLnB1c2goaXRlbSk7XG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblxuXHRcdGVucXVldWUoaXRlbSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSk7XG5cdH07XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHF1ZXVlLnRzIiwiLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSB2YWx1ZSBwcm9wZXJ0eSBkZXNjcmlwdG9yXG4gKlxuICogQHBhcmFtIHZhbHVlICAgICAgICBUaGUgdmFsdWUgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIHNldCB0b1xuICogQHBhcmFtIGVudW1lcmFibGUgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGVudW1iZXJhYmxlLCBkZWZhdWx0cyB0byBmYWxzZVxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcGFyYW0gY29uZmlndXJhYmxlIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgY29uZmlndXJhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcmV0dXJuICAgICAgICAgICAgIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVEZXNjcmlwdG9yPFQ+KFxuXHR2YWx1ZTogVCxcblx0ZW51bWVyYWJsZTogYm9vbGVhbiA9IGZhbHNlLFxuXHR3cml0YWJsZTogYm9vbGVhbiA9IHRydWUsXG5cdGNvbmZpZ3VyYWJsZTogYm9vbGVhbiA9IHRydWVcbik6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPFQ+IHtcblx0cmV0dXJuIHtcblx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0ZW51bWVyYWJsZTogZW51bWVyYWJsZSxcblx0XHR3cml0YWJsZTogd3JpdGFibGUsXG5cdFx0Y29uZmlndXJhYmxlOiBjb25maWd1cmFibGVcblx0fTtcbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB3aGljaCB3cmFwcyBhIGZ1bmN0aW9uIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCBiZWNvbWVzIHRoZSBzY29wZVxuICogb2YgdGhlIGNhbGxcbiAqXG4gKiBAcGFyYW0gbmF0aXZlRnVuY3Rpb24gVGhlIHNvdXJjZSBmdW5jdGlvbiB0byBiZSB3cmFwcGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFI+KG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSkgPT4gUik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBSPihuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYpID0+IFIpOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFgsIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBYLCBZLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmUobmF0aXZlRnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXRpbC50cyIsImltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdG9yRXZlbnRNYXAge1xuXHRpbnZhbGlkYXRlOiBFdmVudE9iamVjdDwnaW52YWxpZGF0ZSc+O1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0b3I8VCA9IGFueT4gZXh0ZW5kcyBFdmVudGVkPEluamVjdG9yRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcGF5bG9hZDogVDtcblxuXHRjb25zdHJ1Y3RvcihwYXlsb2FkOiBUKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0fVxuXG5cdHB1YmxpYyBnZXQoKTogVCB7XG5cdFx0cmV0dXJuIHRoaXMuX3BheWxvYWQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0KHBheWxvYWQ6IFQpOiB2b2lkIHtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0b3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gSW5qZWN0b3IudHMiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgTm9kZUhhbmRsZXJJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXG4gKiBMaXN0ZW5pbmcgdG8gJ1Byb2plY3Rvcicgd2lsbCBub3RpZnkgd2hlbiBwcm9qZWN0b3IgaXMgY3JlYXRlZCBvciB1cGRhdGVkXG4gKiBMaXN0ZW5pbmcgdG8gJ1dpZGdldCcgd2lsbCBub3RpZnkgd2hlbiB3aWRnZXQgcm9vdCBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcbiAqL1xuZXhwb3J0IGVudW0gTm9kZUV2ZW50VHlwZSB7XG5cdFByb2plY3RvciA9ICdQcm9qZWN0b3InLFxuXHRXaWRnZXQgPSAnV2lkZ2V0J1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVIYW5kbGVyRXZlbnRNYXAge1xuXHRQcm9qZWN0b3I6IEV2ZW50T2JqZWN0PE5vZGVFdmVudFR5cGUuUHJvamVjdG9yPjtcblx0V2lkZ2V0OiBFdmVudE9iamVjdDxOb2RlRXZlbnRUeXBlLldpZGdldD47XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlSGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8Tm9kZUhhbmRsZXJFdmVudE1hcD4gaW1wbGVtZW50cyBOb2RlSGFuZGxlckludGVyZmFjZSB7XG5cdHByaXZhdGUgX25vZGVNYXAgPSBuZXcgTWFwPHN0cmluZywgRWxlbWVudD4oKTtcblxuXHRwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogRWxlbWVudCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkKGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5zZXQoa2V5LCBlbGVtZW50KTtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBrZXkgfSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkUm9vdCgpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRQcm9qZWN0b3IoKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XG5cdH1cblxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5jbGVhcigpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVIYW5kbGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIE5vZGVIYW5kbGVyLnRzIiwiaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBSZWdpc3RyeUxhYmVsLCBXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdpZGdldEJhc2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuL0luamVjdG9yJztcblxuZXhwb3J0IHR5cGUgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj47XG5cbmV4cG9ydCB0eXBlIEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPEVTTURlZmF1bHRXaWRnZXRCYXNlPFdpZGdldEJhc2VJbnRlcmZhY2U+PjtcblxuZXhwb3J0IHR5cGUgUmVnaXN0cnlJdGVtID1cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3Jcblx0fCBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj5cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvblxuXHR8IEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb247XG5cbi8qKlxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdJREdFVF9CQVNFX1RZUEUgPSBTeW1ib2woJ1dpZGdldCBCYXNlJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlFdmVudE9iamVjdCBleHRlbmRzIEV2ZW50T2JqZWN0PFJlZ2lzdHJ5TGFiZWw+IHtcblx0YWN0aW9uOiBzdHJpbmc7XG5cdGl0ZW06IFdpZGdldEJhc2VDb25zdHJ1Y3RvciB8IEluamVjdG9yO1xufVxuXG4vKipcbiAqIFdpZGdldCBSZWdpc3RyeSBJbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBEZWZpbmUgYSBXaWRnZXRSZWdpc3RyeUl0ZW0gYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHdpZGdldCB0byByZWdpc3RlclxuXHQgKiBAcGFyYW0gcmVnaXN0cnlJdGVtIFRoZSByZWdpc3RyeSBpdGVtIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCByZWdpc3RyeUl0ZW06IFJlZ2lzdHJ5SXRlbSk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCBvZiB0aGUgd2lkZ2V0IHRvIHJldHVyblxuXHQgKiBAcmV0dXJucyBUaGUgUmVnaXN0cnlJdGVtIGZvciB0aGUgd2lkZ2V0TGFiZWwsIGBudWxsYCBpZiBubyBlbnRyeSBleGlzdHNcblx0ICovXG5cdGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogQ29uc3RydWN0b3I8VD4gfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBlbnRyeSBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgd2lkZ2V0IHJlZ2lzdHJ5IGl0ZW0gZXhpc3RzXG5cdCAqL1xuXHRoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmUgYW4gSW5qZWN0b3IgYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIGluamVjdG9yIHRvIHJlZ2lzdGVyXG5cdCAqIEBwYXJhbSByZWdpc3RyeUl0ZW0gVGhlIGluamVjdG9yIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHJlZ2lzdHJ5SXRlbTogSW5qZWN0b3IpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYW4gSW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgaW5qZWN0b3IgdG8gcmV0dXJuXG5cdCAqIEByZXR1cm5zIFRoZSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSB3aWRnZXRMYWJlbCwgYG51bGxgIGlmIG5vIGVudHJ5IGV4aXN0c1xuXHQgKi9cblx0Z2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IFQgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBpbmplY3RvciBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgaW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBleGlzdHNcblx0ICovXG5cdGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXG4gKlxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2U+KGl0ZW06IGFueSk6IGl0ZW0gaXMgQ29uc3RydWN0b3I8VD4ge1xuXHRyZXR1cm4gQm9vbGVhbihpdGVtICYmIGl0ZW0uX3R5cGUgPT09IFdJREdFVF9CQVNFX1RZUEUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0ZGVmYXVsdDogQ29uc3RydWN0b3I8VD47XG5cdF9fZXNNb2R1bGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDxUPihpdGVtOiBhbnkpOiBpdGVtIGlzIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0cmV0dXJuIEJvb2xlYW4oXG5cdFx0aXRlbSAmJlxuXHRcdFx0aXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXG5cdFx0XHRpdGVtLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykgJiZcblx0XHRcdGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdClcblx0KTtcbn1cblxuLyoqXG4gKiBUaGUgUmVnaXN0cnkgaW1wbGVtZW50YXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IGV4dGVuZHMgRXZlbnRlZDx7fSwgUmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlFdmVudE9iamVjdD4gaW1wbGVtZW50cyBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBpbnRlcm5hbCBtYXAgb2YgbGFiZWxzIGFuZCBSZWdpc3RyeUl0ZW1cblx0ICovXG5cdHByaXZhdGUgX3dpZGdldFJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlJdGVtPjtcblxuXHRwcml2YXRlIF9pbmplY3RvclJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgSW5qZWN0b3I+O1xuXG5cdC8qKlxuXHQgKiBFbWl0IGxvYWRlZCBldmVudCBmb3IgcmVnaXN0cnkgbGFiZWxcblx0ICovXG5cdHByaXZhdGUgZW1pdExvYWRlZEV2ZW50KHdpZGdldExhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBXaWRnZXRCYXNlQ29uc3RydWN0b3IgfCBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7XG5cdFx0XHR0eXBlOiB3aWRnZXRMYWJlbCxcblx0XHRcdGFjdGlvbjogJ2xvYWRlZCcsXG5cdFx0XHRpdGVtXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgd2lkZ2V0IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJyR7bGFiZWwudG9TdHJpbmcoKX0nYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblxuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0aXRlbS50aGVuKFxuXHRcdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRcdHJldHVybiB3aWRnZXRDdG9yO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XG5cdFx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbmplY3RvciBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuXHRcdH1cblxuXHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gV2lkZ2V0QmFzZUludGVyZmFjZT4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdGlmICghdGhpcy5oYXMobGFiZWwpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpdGVtID0gdGhpcy5fd2lkZ2V0UmVnaXN0cnkuZ2V0KGxhYmVsKTtcblxuXHRcdGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxUPihpdGVtKSkge1xuXHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0fVxuXG5cdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9taXNlID0gKDxXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvbj5pdGVtKSgpO1xuXHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgcHJvbWlzZSk7XG5cblx0XHRwcm9taXNlLnRoZW4oXG5cdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQ8VD4od2lkZ2V0Q3RvcikpIHtcblx0XHRcdFx0XHR3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRyZXR1cm4gd2lkZ2V0Q3Rvcjtcblx0XHRcdH0sXG5cdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKSBhcyBUO1xuXHR9XG5cblx0cHVibGljIGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX3dpZGdldFJlZ2lzdHJ5ICYmIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFJlZ2lzdHJ5LnRzIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgUmVnaXN0cnlMYWJlbCwgV2lkZ2V0QmFzZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZWdpc3RyeSwgUmVnaXN0cnlFdmVudE9iamVjdCwgUmVnaXN0cnlJdGVtIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vSW5qZWN0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5SGFuZGxlckV2ZW50TWFwIHtcblx0aW52YWxpZGF0ZTogRXZlbnRPYmplY3Q8J2ludmFsaWRhdGUnPjtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5SGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8UmVnaXN0cnlIYW5kbGVyRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcblx0cHJpdmF0ZSBfcmVnaXN0cnlXaWRnZXRMYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+ID0gbmV3IE1hcCgpO1xuXHRwcml2YXRlIF9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPiA9IG5ldyBNYXAoKTtcblx0cHJvdGVjdGVkIGJhc2VSZWdpc3RyeT86IFJlZ2lzdHJ5O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xuXHRcdGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdFx0dGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLm93bih7IGRlc3Ryb3kgfSk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJhc2UoYmFzZVJlZ2lzdHJ5OiBSZWdpc3RyeSkge1xuXHRcdGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0fVxuXHRcdHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xuXHR9XG5cblx0cHVibGljIGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgd2lkZ2V0OiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHR0aGlzLl9yZWdpc3RyeS5kZWZpbmUobGFiZWwsIHdpZGdldCk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGluamVjdG9yOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuX3JlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGxhYmVsLCBpbmplY3Rvcik7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmhhcyhsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHRcdGxhYmVsOiBSZWdpc3RyeUxhYmVsLFxuXHRcdGdsb2JhbFByZWNlZGVuY2U6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXQnLCB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2UpOiBUIHwgbnVsbCB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcblx0fVxuXG5cdHByaXZhdGUgX2dldChcblx0XHRsYWJlbDogUmVnaXN0cnlMYWJlbCxcblx0XHRnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuLFxuXHRcdGdldEZ1bmN0aW9uTmFtZTogJ2dldEluamVjdG9yJyB8ICdnZXQnLFxuXHRcdGxhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT5cblx0KTogYW55IHtcblx0XHRjb25zdCByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCByZWdpc3RyeTogYW55ID0gcmVnaXN0cmllc1tpXTtcblx0XHRcdGlmICghcmVnaXN0cnkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XG5cdFx0XHRjb25zdCByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcblx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fSBlbHNlIGlmIChyZWdpc3RlcmVkTGFiZWxzLmluZGV4T2YobGFiZWwpID09PSAtMSkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGUgPSByZWdpc3RyeS5vbihsYWJlbCwgKGV2ZW50OiBSZWdpc3RyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxuXHRcdFx0XHRcdFx0KHRoaXMgYXMgYW55KVtnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMub3duKGhhbmRsZSk7XG5cdFx0XHRcdGxhYmVsTWFwLnNldChyZWdpc3RyeSwgWy4uLnJlZ2lzdGVyZWRMYWJlbHMsIGxhYmVsXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5SGFuZGxlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBSZWdpc3RyeUhhbmRsZXIudHMiLCJpbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGF1dG8gfSBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IHtcblx0QWZ0ZXJSZW5kZXIsXG5cdEJlZm9yZVByb3BlcnRpZXMsXG5cdEJlZm9yZVJlbmRlcixcblx0Q29yZVByb3BlcnRpZXMsXG5cdERpZmZQcm9wZXJ0eVJlYWN0aW9uLFxuXHRETm9kZSxcblx0UmVuZGVyLFxuXHRXaWRnZXRNZXRhQmFzZSxcblx0V2lkZ2V0TWV0YUNvbnN0cnVjdG9yLFxuXHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRXaWRnZXRQcm9wZXJ0aWVzXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgUmVnaXN0cnlIYW5kbGVyIGZyb20gJy4vUmVnaXN0cnlIYW5kbGVyJztcbmltcG9ydCBOb2RlSGFuZGxlciBmcm9tICcuL05vZGVIYW5kbGVyJztcbmltcG9ydCB7IHdpZGdldEluc3RhbmNlTWFwIH0gZnJvbSAnLi92ZG9tJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yLCBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5cbmludGVyZmFjZSBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzIHtcblx0cHJldmlvdXNQcm9wZXJ0aWVzOiBhbnk7XG5cdG5ld1Byb3BlcnRpZXM6IGFueTtcblx0Y2hhbmdlZDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlYWN0aW9uRnVuY3Rpb25Db25maWcge1xuXHRwcm9wZXJ0eU5hbWU6IHN0cmluZztcblx0cmVhY3Rpb246IERpZmZQcm9wZXJ0eVJlYWN0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBCb3VuZEZ1bmN0aW9uRGF0YSA9IHsgYm91bmRGdW5jOiAoLi4uYXJnczogYW55W10pID0+IGFueTsgc2NvcGU6IGFueSB9O1xuXG5jb25zdCBkZWNvcmF0b3JNYXAgPSBuZXcgTWFwPEZ1bmN0aW9uLCBNYXA8c3RyaW5nLCBhbnlbXT4+KCk7XG5jb25zdCBib3VuZEF1dG8gPSBhdXRvLmJpbmQobnVsbCk7XG5cbi8qKlxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXG4gKi9cbmV4cG9ydCBjbGFzcyBXaWRnZXRCYXNlPFAgPSBXaWRnZXRQcm9wZXJ0aWVzLCBDIGV4dGVuZHMgRE5vZGUgPSBETm9kZT4gaW1wbGVtZW50cyBXaWRnZXRCYXNlSW50ZXJmYWNlPFAsIEM+IHtcblx0LyoqXG5cdCAqIHN0YXRpYyBpZGVudGlmaWVyXG5cdCAqL1xuXHRzdGF0aWMgX3R5cGU6IHN5bWJvbCA9IFdJREdFVF9CQVNFX1RZUEU7XG5cblx0LyoqXG5cdCAqIGNoaWxkcmVuIGFycmF5XG5cdCAqL1xuXHRwcml2YXRlIF9jaGlsZHJlbjogKEMgfCBudWxsKVtdO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgaWYgaXQgaXMgdGhlIGluaXRpYWwgc2V0IHByb3BlcnRpZXMgY3ljbGVcblx0ICovXG5cdHByaXZhdGUgX2luaXRpYWxQcm9wZXJ0aWVzID0gdHJ1ZTtcblxuXHQvKipcblx0ICogaW50ZXJuYWwgd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX3Byb3BlcnRpZXM6IFAgJiBXaWRnZXRQcm9wZXJ0aWVzICYgeyBbaW5kZXg6IHN0cmluZ106IGFueSB9O1xuXG5cdC8qKlxuXHQgKiBBcnJheSBvZiBwcm9wZXJ0eSBrZXlzIGNvbnNpZGVyZWQgY2hhbmdlZCBmcm9tIHRoZSBwcmV2aW91cyBzZXQgcHJvcGVydGllc1xuXHQgKi9cblx0cHJpdmF0ZSBfY2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW10gPSBbXTtcblxuXHQvKipcblx0ICogbWFwIG9mIGRlY29yYXRvcnMgdGhhdCBhcmUgYXBwbGllZCB0byB0aGlzIHdpZGdldFxuXHQgKi9cblx0cHJpdmF0ZSBfZGVjb3JhdG9yQ2FjaGU6IE1hcDxzdHJpbmcsIGFueVtdPjtcblxuXHRwcml2YXRlIF9yZWdpc3RyeTogUmVnaXN0cnlIYW5kbGVyO1xuXG5cdC8qKlxuXHQgKiBNYXAgb2YgZnVuY3Rpb25zIHByb3BlcnRpZXMgZm9yIHRoZSBib3VuZCBmdW5jdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBfYmluZEZ1bmN0aW9uUHJvcGVydHlNYXA6IFdlYWtNYXA8KC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIEJvdW5kRnVuY3Rpb25EYXRhPjtcblxuXHRwcml2YXRlIF9tZXRhTWFwOiBNYXA8V2lkZ2V0TWV0YUNvbnN0cnVjdG9yPGFueT4sIFdpZGdldE1ldGFCYXNlPjtcblxuXHRwcml2YXRlIF9ib3VuZFJlbmRlckZ1bmM6IFJlbmRlcjtcblxuXHRwcml2YXRlIF9ib3VuZEludmFsaWRhdGU6ICgpID0+IHZvaWQ7XG5cblx0cHJpdmF0ZSBfbm9kZUhhbmRsZXI6IE5vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyKCk7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fY2hpbGRyZW4gPSBbXTtcblx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gPFA+e307XG5cdFx0dGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcblxuXHRcdHdpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XG5cdFx0XHRkaXJ0eTogdHJ1ZSxcblx0XHRcdG9uQXR0YWNoOiAoKTogdm9pZCA9PiB7XG5cdFx0XHRcdHRoaXMub25BdHRhY2goKTtcblx0XHRcdH0sXG5cdFx0XHRvbkRldGFjaDogKCk6IHZvaWQgPT4ge1xuXHRcdFx0XHR0aGlzLm9uRGV0YWNoKCk7XG5cdFx0XHRcdHRoaXMuX2Rlc3Ryb3koKTtcblx0XHRcdH0sXG5cdFx0XHRub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG5cdFx0XHRyZWdpc3RyeTogKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZWdpc3RyeTtcblx0XHRcdH0sXG5cdFx0XHRjb3JlUHJvcGVydGllczoge30gYXMgQ29yZVByb3BlcnRpZXMsXG5cdFx0XHRyZW5kZXJpbmc6IGZhbHNlLFxuXHRcdFx0aW5wdXRQcm9wZXJ0aWVzOiB7fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBtZXRhPFQgZXh0ZW5kcyBXaWRnZXRNZXRhQmFzZT4oTWV0YVR5cGU6IFdpZGdldE1ldGFDb25zdHJ1Y3RvcjxUPik6IFQge1xuXHRcdGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAgPSBuZXcgTWFwPFdpZGdldE1ldGFDb25zdHJ1Y3Rvcjxhbnk+LCBXaWRnZXRNZXRhQmFzZT4oKTtcblx0XHR9XG5cdFx0bGV0IGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcblx0XHRpZiAoIWNhY2hlZCkge1xuXHRcdFx0Y2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcblx0XHRcdFx0aW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxuXHRcdFx0XHRub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG5cdFx0XHRcdGJpbmQ6IHRoaXNcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlZCBhcyBUO1xuXHR9XG5cblx0cHJvdGVjdGVkIG9uQXR0YWNoKCk6IHZvaWQge1xuXHRcdC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cblx0fVxuXG5cdHByb3RlY3RlZCBvbkRldGFjaCgpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHRwdWJsaWMgZ2V0IHByb3BlcnRpZXMoKTogUmVhZG9ubHk8UD4gJiBSZWFkb25seTxXaWRnZXRQcm9wZXJ0aWVzPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNoYW5nZWRQcm9wZXJ0eUtleXMoKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBbLi4udGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5c107XG5cdH1cblxuXHRwdWJsaWMgX19zZXRDb3JlUHJvcGVydGllc19fKGNvcmVQcm9wZXJ0aWVzOiBDb3JlUHJvcGVydGllcyk6IHZvaWQge1xuXHRcdGNvbnN0IHsgYmFzZVJlZ2lzdHJ5IH0gPSBjb3JlUHJvcGVydGllcztcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXG5cdFx0aWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xuXHRcdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LmJhc2UgPSBiYXNlUmVnaXN0cnk7XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgX19zZXRQcm9wZXJ0aWVzX18ob3JpZ2luYWxQcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMgPSBvcmlnaW5hbFByb3BlcnRpZXM7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcblx0XHRjb25zdCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xuXHRcdGNvbnN0IGNoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdID0gW107XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXG5cdFx0aWYgKHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID09PSBmYWxzZSB8fCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRjb25zdCBhbGxQcm9wZXJ0aWVzID0gWy4uLnByb3BlcnR5TmFtZXMsIC4uLk9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpXTtcblx0XHRcdGNvbnN0IGNoZWNrZWRQcm9wZXJ0aWVzOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gW107XG5cdFx0XHRjb25zdCBkaWZmUHJvcGVydHlSZXN1bHRzOiBhbnkgPSB7fTtcblx0XHRcdGxldCBydW5SZWFjdGlvbnMgPSBmYWxzZTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IGFsbFByb3BlcnRpZXNbaV07XG5cdFx0XHRcdGlmIChjaGVja2VkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hlY2tlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRjb25zdCBwcmV2aW91c1Byb3BlcnR5ID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRjb25zdCBuZXdQcm9wZXJ0eSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KFxuXHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSxcblx0XHRcdFx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRydW5SZWFjdGlvbnMgPSB0cnVlO1xuXHRcdFx0XHRcdGNvbnN0IGRpZmZGdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWApO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZkZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gZGlmZkZ1bmN0aW9uc1tpXShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRcdGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYm91bmRBdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHRcdFx0XHRpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChydW5SZWFjdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKHByb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpLmZvckVhY2goKGFyZ3MsIHJlYWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFyZ3MuY2hhbmdlZCkge1xuXHRcdFx0XHRcdFx0cmVhY3Rpb24uY2FsbCh0aGlzLCBhcmdzLnByZXZpb3VzUHJvcGVydGllcywgYXJncy5uZXdQcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XG5cdFx0XHR0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSBmYWxzZTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydHlOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xuXHRcdFx0XHRpZiAodHlwZW9mIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KFxuXHRcdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLFxuXHRcdFx0XHRcdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcblx0XHRcdHRoaXMuX3Byb3BlcnRpZXMgPSB7IC4uLnByb3BlcnRpZXMgfTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cy5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNoaWxkcmVuKCk6IChDIHwgbnVsbClbXSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuXHR9XG5cblx0cHVibGljIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbjogKEMgfCBudWxsKVtdKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgfHwgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfX3JlbmRlcl9fKCk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcblx0XHRjb25zdCByZW5kZXIgPSB0aGlzLl9ydW5CZWZvcmVSZW5kZXJzKCk7XG5cdFx0bGV0IGROb2RlID0gcmVuZGVyKCk7XG5cdFx0ZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XG5cdFx0dGhpcy5fbm9kZUhhbmRsZXIuY2xlYXIoKTtcblx0XHRyZXR1cm4gZE5vZGU7XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZSgpOiB2b2lkIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGlmIChpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSkge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0cmV0dXJuIHYoJ2RpdicsIHt9LCB0aGlzLmNoaWxkcmVuKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxuXHQgKi9cblx0cHJvdGVjdGVkIGFkZERlY29yYXRvcihkZWNvcmF0b3JLZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG5cdFx0aWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcblx0XHRcdGxldCBkZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTWFwLmdldCh0aGlzLmNvbnN0cnVjdG9yKTtcblx0XHRcdGlmICghZGVjb3JhdG9yTGlzdCkge1xuXHRcdFx0XHRkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcDxzdHJpbmcsIGFueVtdPigpO1xuXHRcdFx0XHRkZWNvcmF0b3JNYXAuc2V0KHRoaXMuY29uc3RydWN0b3IsIGRlY29yYXRvckxpc3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcblx0XHRcdGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XG5cdFx0XHRcdHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IFtdO1xuXHRcdFx0XHRkZWNvcmF0b3JMaXN0LnNldChkZWNvcmF0b3JLZXksIHNwZWNpZmljRGVjb3JhdG9yTGlzdCk7XG5cdFx0XHR9XG5cdFx0XHRzcGVjaWZpY0RlY29yYXRvckxpc3QucHVzaCguLi52YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGRlY29yYXRvcnMgPSB0aGlzLmdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpO1xuXHRcdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgWy4uLmRlY29yYXRvcnMsIC4uLnZhbHVlXSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGJ1aWxkIHRoZSBsaXN0IG9mIGRlY29yYXRvcnMgZnJvbSB0aGUgZ2xvYmFsIGRlY29yYXRvciBtYXAuXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgIFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcmV0dXJuIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXk6IHN0cmluZyk6IGFueVtdIHtcblx0XHRjb25zdCBhbGxEZWNvcmF0b3JzID0gW107XG5cblx0XHRsZXQgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG5cdFx0d2hpbGUgKGNvbnN0cnVjdG9yKSB7XG5cdFx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGRlY29yYXRvck1hcC5nZXQoY29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKGluc3RhbmNlTWFwKSB7XG5cdFx0XHRcdGNvbnN0IGRlY29yYXRvcnMgPSBpbnN0YW5jZU1hcC5nZXQoZGVjb3JhdG9yS2V5KTtcblxuXHRcdFx0XHRpZiAoZGVjb3JhdG9ycykge1xuXHRcdFx0XHRcdGFsbERlY29yYXRvcnMudW5zaGlmdCguLi5kZWNvcmF0b3JzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdHJ1Y3RvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb25zdHJ1Y3Rvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveXMgcHJpdmF0ZSByZXNvdXJjZXMgZm9yIFdpZGdldEJhc2Vcblx0ICovXG5cdHByaXZhdGUgX2Rlc3Ryb3koKSB7XG5cdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5KSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5kZXN0cm95KCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAuZm9yRWFjaCgobWV0YSkgPT4ge1xuXHRcdFx0XHRtZXRhLmRlc3Ryb3koKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byByZXRyaWV2ZSBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcblx0ICovXG5cdHByb3RlY3RlZCBnZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5OiBzdHJpbmcpOiBhbnlbXSB7XG5cdFx0bGV0IGFsbERlY29yYXRvcnMgPSB0aGlzLl9kZWNvcmF0b3JDYWNoZS5nZXQoZGVjb3JhdG9yS2V5KTtcblxuXHRcdGlmIChhbGxEZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHRcdH1cblxuXHRcdGFsbERlY29yYXRvcnMgPSB0aGlzLl9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5KTtcblxuXHRcdHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIGFsbERlY29yYXRvcnMpO1xuXHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHR9XG5cblx0cHJpdmF0ZSBfbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKFxuXHRcdG5ld1Byb3BlcnRpZXM6IGFueSxcblx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzOiBzdHJpbmdbXVxuXHQpOiBNYXA8RnVuY3Rpb24sIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHM+IHtcblx0XHRjb25zdCByZWFjdGlvbkZ1bmN0aW9uczogUmVhY3Rpb25GdW5jdGlvbkNvbmZpZ1tdID0gdGhpcy5nZXREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicpO1xuXG5cdFx0cmV0dXJuIHJlYWN0aW9uRnVuY3Rpb25zLnJlZHVjZSgocmVhY3Rpb25Qcm9wZXJ0eU1hcCwgeyByZWFjdGlvbiwgcHJvcGVydHlOYW1lIH0pID0+IHtcblx0XHRcdGxldCByZWFjdGlvbkFyZ3VtZW50cyA9IHJlYWN0aW9uUHJvcGVydHlNYXAuZ2V0KHJlYWN0aW9uKTtcblx0XHRcdGlmIChyZWFjdGlvbkFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJlYWN0aW9uQXJndW1lbnRzID0ge1xuXHRcdFx0XHRcdHByZXZpb3VzUHJvcGVydGllczoge30sXG5cdFx0XHRcdFx0bmV3UHJvcGVydGllczoge30sXG5cdFx0XHRcdFx0Y2hhbmdlZDogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLnByZXZpb3VzUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMubmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gbmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0aWYgKGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5jaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJlYWN0aW9uUHJvcGVydHlNYXAuc2V0KHJlYWN0aW9uLCByZWFjdGlvbkFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gcmVhY3Rpb25Qcm9wZXJ0eU1hcDtcblx0XHR9LCBuZXcgTWFwPEZ1bmN0aW9uLCBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzPigpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvcGVydGllcyBwcm9wZXJ0aWVzIHRvIGNoZWNrIGZvciBmdW5jdGlvbnNcblx0ICovXG5cdHByaXZhdGUgX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnR5OiBhbnksIGJpbmQ6IGFueSk6IGFueSB7XG5cdFx0aWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcihwcm9wZXJ0eSkgPT09IGZhbHNlKSB7XG5cdFx0XHRpZiAodGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwPFxuXHRcdFx0XHRcdCguLi5hcmdzOiBhbnlbXSkgPT4gYW55LFxuXHRcdFx0XHRcdHsgYm91bmRGdW5jOiAoLi4uYXJnczogYW55W10pID0+IGFueTsgc2NvcGU6IGFueSB9XG5cdFx0XHRcdD4oKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGJpbmRJbmZvOiBQYXJ0aWFsPEJvdW5kRnVuY3Rpb25EYXRhPiA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XG5cdFx0XHRsZXQgeyBib3VuZEZ1bmMsIHNjb3BlIH0gPSBiaW5kSW5mbztcblxuXHRcdFx0aWYgKGJvdW5kRnVuYyA9PT0gdW5kZWZpbmVkIHx8IHNjb3BlICE9PSBiaW5kKSB7XG5cdFx0XHRcdGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCkgYXMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cdFx0XHRcdHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLnNldChwcm9wZXJ0eSwgeyBib3VuZEZ1bmMsIHNjb3BlOiBiaW5kIH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJvdW5kRnVuYztcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BlcnR5O1xuXHR9XG5cblx0cHVibGljIGdldCByZWdpc3RyeSgpOiBSZWdpc3RyeUhhbmRsZXIge1xuXHRcdGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5O1xuXHR9XG5cblx0cHJpdmF0ZSBfcnVuQmVmb3JlUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRjb25zdCBiZWZvcmVQcm9wZXJ0aWVzOiBCZWZvcmVQcm9wZXJ0aWVzW10gPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycpO1xuXHRcdGlmIChiZWZvcmVQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBiZWZvcmVQcm9wZXJ0aWVzLnJlZHVjZShcblx0XHRcdFx0KHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbikgPT4ge1xuXHRcdFx0XHRcdHJldHVybiB7IC4uLnByb3BlcnRpZXMsIC4uLmJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbi5jYWxsKHRoaXMsIHByb3BlcnRpZXMpIH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHsgLi4ucHJvcGVydGllcyB9XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXG5cdCAqL1xuXHRwcml2YXRlIF9ydW5CZWZvcmVSZW5kZXJzKCk6IFJlbmRlciB7XG5cdFx0Y29uc3QgYmVmb3JlUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVSZW5kZXInKTtcblxuXHRcdGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZSgocmVuZGVyOiBSZW5kZXIsIGJlZm9yZVJlbmRlckZ1bmN0aW9uOiBCZWZvcmVSZW5kZXIpID0+IHtcblx0XHRcdFx0Y29uc3QgdXBkYXRlZFJlbmRlciA9IGJlZm9yZVJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgcmVuZGVyLCB0aGlzLl9wcm9wZXJ0aWVzLCB0aGlzLl9jaGlsZHJlbik7XG5cdFx0XHRcdGlmICghdXBkYXRlZFJlbmRlcikge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybignUmVuZGVyIGZ1bmN0aW9uIG5vdCByZXR1cm5lZCBmcm9tIGJlZm9yZVJlbmRlciwgdXNpbmcgcHJldmlvdXMgcmVuZGVyJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlbmRlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdXBkYXRlZFJlbmRlcjtcblx0XHRcdH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZFJlbmRlckZ1bmM7XG5cdH1cblxuXHQvKipcblx0ICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xuXHQgKlxuXHQgKiBAcGFyYW0gZE5vZGUgVGhlIEROb2RlcyB0byBydW4gdGhyb3VnaCB0aGUgYWZ0ZXIgcmVuZGVyc1xuXHQgKi9cblx0cHJvdGVjdGVkIHJ1bkFmdGVyUmVuZGVycyhkTm9kZTogRE5vZGUgfCBETm9kZVtdKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHRjb25zdCBhZnRlclJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJSZW5kZXInKTtcblxuXHRcdGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGFmdGVyUmVuZGVycy5yZWR1Y2UoKGROb2RlOiBETm9kZSB8IEROb2RlW10sIGFmdGVyUmVuZGVyRnVuY3Rpb246IEFmdGVyUmVuZGVyKSA9PiB7XG5cdFx0XHRcdHJldHVybiBhZnRlclJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgZE5vZGUpO1xuXHRcdFx0fSwgZE5vZGUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAuZm9yRWFjaCgobWV0YSkgPT4ge1xuXHRcdFx0XHRtZXRhLmFmdGVyUmVuZGVyKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZE5vZGU7XG5cdH1cblxuXHRwcml2YXRlIF9ydW5BZnRlckNvbnN0cnVjdG9ycygpOiB2b2lkIHtcblx0XHRjb25zdCBhZnRlckNvbnN0cnVjdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlckNvbnN0cnVjdG9yJyk7XG5cblx0XHRpZiAoYWZ0ZXJDb25zdHJ1Y3RvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0YWZ0ZXJDb25zdHJ1Y3RvcnMuZm9yRWFjaCgoYWZ0ZXJDb25zdHJ1Y3RvcikgPT4gYWZ0ZXJDb25zdHJ1Y3Rvci5jYWxsKHRoaXMpKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2lkZ2V0QmFzZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBXaWRnZXRCYXNlLnRzIiwiaW1wb3J0IHsgVk5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxubGV0IGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnJztcbmxldCBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnJztcblxuZnVuY3Rpb24gZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0aWYgKCdXZWJraXRUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG5cdFx0YnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcblx0XHRicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcblx0fSBlbHNlIGlmICgndHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSB8fCAnTW96VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xuXHRcdGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XG5cdFx0YnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ2FuaW1hdGlvbmVuZCc7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdZb3VyIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCcpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0aWYgKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9PT0gJycpIHtcblx0XHRkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KTtcblx0fVxufVxuXG5mdW5jdGlvbiBydW5BbmRDbGVhblVwKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdGFydEFuaW1hdGlvbjogKCkgPT4gdm9pZCwgZmluaXNoQW5pbWF0aW9uOiAoKSA9PiB2b2lkKSB7XG5cdGluaXRpYWxpemUoZWxlbWVudCk7XG5cblx0bGV0IGZpbmlzaGVkID0gZmFsc2U7XG5cblx0bGV0IHRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIWZpbmlzaGVkKSB7XG5cdFx0XHRmaW5pc2hlZCA9IHRydWU7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblxuXHRcdFx0ZmluaXNoQW5pbWF0aW9uKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHN0YXJ0QW5pbWF0aW9uKCk7XG5cblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbn1cblxuZnVuY3Rpb24gZXhpdChub2RlOiBIVE1MRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uOiBzdHJpbmcsIHJlbW92ZU5vZGU6ICgpID0+IHZvaWQpIHtcblx0Y29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb25BY3RpdmUgfHwgYCR7ZXhpdEFuaW1hdGlvbn0tYWN0aXZlYDtcblxuXHRydW5BbmRDbGVhblVwKFxuXHRcdG5vZGUsXG5cdFx0KCkgPT4ge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGV4aXRBbmltYXRpb24pO1xuXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdCgpID0+IHtcblx0XHRcdHJlbW92ZU5vZGUoKTtcblx0XHR9XG5cdCk7XG59XG5cbmZ1bmN0aW9uIGVudGVyKG5vZGU6IEhUTUxFbGVtZW50LCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uOiBzdHJpbmcpIHtcblx0Y29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uQWN0aXZlIHx8IGAke2VudGVyQW5pbWF0aW9ufS1hY3RpdmVgO1xuXG5cdHJ1bkFuZENsZWFuVXAoXG5cdFx0bm9kZSxcblx0XHQoKSA9PiB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoZW50ZXJBbmltYXRpb24pO1xuXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdCgpID0+IHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZShlbnRlckFuaW1hdGlvbik7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuXHRcdH1cblx0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRlbnRlcixcblx0ZXhpdFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjc3NUcmFuc2l0aW9ucy50cyIsImltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL2NvcmUvbGFuZyc7XG5pbXBvcnQgeyBmcm9tIGFzIGFycmF5RnJvbSB9IGZyb20gJ0Bkb2pvL3NoaW0vYXJyYXknO1xuaW1wb3J0IGdsb2JhbCBmcm9tICdAZG9qby9zaGltL2dsb2JhbCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgRE5vZGUsIFZOb2RlLCBWTm9kZVByb3BlcnRpZXMsIFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyB2LCB3IH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IERvbVdyYXBwZXIgfSBmcm9tICcuL3V0aWwvRG9tV3JhcHBlcic7XG5pbXBvcnQgeyBQcm9qZWN0b3JNaXhpbiB9IGZyb20gJy4vbWl4aW5zL1Byb2plY3Rvcic7XG5pbXBvcnQgeyBJbnRlcm5hbFZOb2RlIH0gZnJvbSAnLi92ZG9tJztcblxuLyoqXG4gKiBAdHlwZSBDdXN0b21FbGVtZW50QXR0cmlidXRlRGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIGN1c3RvbSBlbGVtZW50IGF0dHJpYnV0ZVxuICpcbiAqIEBwcm9wZXJ0eSBhdHRyaWJ1dGVOYW1lICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSBvbiB0aGUgRE9NIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSBwcm9wZXJ0eU5hbWUgICAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSB3aWRnZXRcbiAqIEBwcm9wZXJ0eSB2YWx1ZSAgICAgICAgICAgQSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nIG9yIG51bGwgdmFsdWUsIGFuZCByZXR1cm5zIGEgbmV3IHZhbHVlLiBUaGUgd2lkZ2V0J3MgcHJvcGVydHkgd2lsbCBiZSBzZXQgdG8gdGhlIG5ldyB2YWx1ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50QXR0cmlidXRlRGVzY3JpcHRvciB7XG5cdGF0dHJpYnV0ZU5hbWU6IHN0cmluZztcblx0cHJvcGVydHlOYW1lPzogc3RyaW5nO1xuXHR2YWx1ZT86ICh2YWx1ZTogc3RyaW5nIHwgbnVsbCkgPT4gYW55O1xufVxuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnRQcm9wZXJ0eURlc2NyaXB0b3JcbiAqXG4gKiBEZXNjcmliZXMgYSB3aWRnZXQgcHJvcGVydHkgZXhwb3NlZCB2aWEgYSBjdXN0b20gZWxlbWVudFxuICpcbiAqIEBwcm9wZXJ0eSBwcm9wZXJ0eU5hbWUgICAgICAgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvbiB0aGUgRE9NIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSB3aWRnZXRQcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvbiB0aGUgd2lkZ2V0XG4gKiBAcHJvcGVydHkgZ2V0VmFsdWUgICAgICAgICAgICBBIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIG9uIHRoZSB3aWRnZXQncyBwcm9wZXJ0eSB2YWx1ZVxuICogQHByb3BlcnR5IHNldFZhbHVlICAgICAgICAgICAgQSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbiBvbiB0aGUgRE9NIGVsZW1lbnRzIHByb3BlcnR5IHZhbHVlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudFByb3BlcnR5RGVzY3JpcHRvciB7XG5cdHByb3BlcnR5TmFtZTogc3RyaW5nO1xuXHR3aWRnZXRQcm9wZXJ0eU5hbWU/OiBzdHJpbmc7XG5cdGdldFZhbHVlPzogKHZhbHVlOiBhbnkpID0+IGFueTtcblx0c2V0VmFsdWU/OiAodmFsdWU6IGFueSkgPT4gYW55O1xufVxuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnRFdmVudERlc2NyaXB0b3JcbiAqXG4gKiBEZXNjcmliZXMgYSBjdXN0b20gZWxlbWVudCBldmVudFxuICpcbiAqIEBwcm9wZXJ0eSBwcm9wZXJ0eU5hbWUgICAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSB3aWRnZXQgdGhhdCB0YWtlcyBhIGZ1bmN0aW9uXG4gKiBAcHJvcGVydHkgZXZlbnROYW1lICAgICAgIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBlbWl0IChpdCB3aWxsIGJlIGEgQ3VzdG9tRXZlbnQgb2JqZWN0IG9mIHRoaXMgdHlwZSlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50RXZlbnREZXNjcmlwdG9yIHtcblx0cHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cdGV2ZW50TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBjdXN0b20gZWxlbWVudCBpbml0aWFsaXppbmcgZnVuY3Rpb24uIFBhc3NlcyBpbiBpbml0aWFsIHByb3BlcnRpZXMgc28gdGhleSBjYW4gYmUgZXh0ZW5kZWRcbiAqIGJ5IHRoZSBpbml0aWFsaXplci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXIge1xuXHQocHJvcGVydGllczogV2lkZ2V0UHJvcGVydGllcyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBlbnVtIENoaWxkcmVuVHlwZSB7XG5cdERPSk8gPSAnRE9KTycsXG5cdEVMRU1FTlQgPSAnRUxFTUVOVCdcbn1cblxuLyoqXG4gKiBAdHlwZSBDdXN0b21FbGVtZW50RGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIGN1c3RvbSBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB0YWdOYW1lICAgICAgICAgICAgIFRoZSB0YWcgbmFtZSB0byByZWdpc3RlciB0aGlzIHdpZGdldCB1bmRlci4gVGFnIG5hbWVzIG11c3QgY29udGFpbiBhIFwiLVwiXG4gKiBAcHJvcGVydHkgd2lkZ2V0Q29uc3RydWN0b3IgICB3aWRnZXQgQ29uc3RydWN0b3IgdGhhdCB3aWxsIHJldHVybiB0aGUgd2lkZ2V0IHRvIGJlIHdyYXBwZWQgaW4gYSBjdXN0b20gZWxlbWVudFxuICogQHByb3BlcnR5IGF0dHJpYnV0ZXMgICAgICAgICAgQSBsaXN0IG9mIGF0dHJpYnV0ZXMgdG8gZGVmaW5lIG9uIHRoaXMgZWxlbWVudFxuICogQHByb3BlcnR5IHByb3BlcnRpZXMgICAgICAgICAgQSBsaXN0IG9mIHByb3BlcnRpZXMgdG8gZGVmaW5lIG9uIHRoaXMgZWxlbWVudFxuICogQHByb3BlcnR5IGV2ZW50cyAgICAgICAgICAgICAgQSBsaXN0IG9mIGV2ZW50cyB0byBleHBvc2Ugb24gdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgaW5pdGlhbGl6YXRpb24gICAgICBBIG1ldGhvZCB0byBydW4gdG8gc2V0IGN1c3RvbSBwcm9wZXJ0aWVzIG9uIHRoZSB3cmFwcGVkIHdpZGdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yIHtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBjdXN0b20gZWxlbWVudCB0YWdcblx0ICovXG5cdHRhZ05hbWU6IHN0cmluZztcblxuXHQvKipcblx0ICogV2lkZ2V0IGNvbnN0cnVjdG9yIHRoYXQgd2lsbCBjcmVhdGUgdGhlIHdpZGdldFxuXHQgKi9cblx0d2lkZ2V0Q29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFdpZGdldEJhc2U8V2lkZ2V0UHJvcGVydGllcz4+O1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGF0dHJpYnV0ZXMgb24gdGhlIGN1c3RvbSBlbGVtZW50IHRvIG1hcCB0byB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0YXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yW107XG5cblx0LyoqXG5cdCAqIExpc3Qgb2Ygd2lkZ2V0IHByb3BlcnRpZXMgdG8gZXhwb3NlIGFzIHByb3BlcnRpZXMgb24gdGhlIGN1c3RvbSBlbGVtZW50XG5cdCAqL1xuXHRwcm9wZXJ0aWVzPzogQ3VzdG9tRWxlbWVudFByb3BlcnR5RGVzY3JpcHRvcltdO1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGV2ZW50cyB0byBleHBvc2Vcblx0ICovXG5cdGV2ZW50cz86IEN1c3RvbUVsZW1lbnRFdmVudERlc2NyaXB0b3JbXTtcblxuXHQvKipcblx0ICogSW5pdGlhbGl6YXRpb24gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGNyZWF0ZWQgKGZvciBjdXN0b20gcHJvcGVydHkgc2V0dGluZylcblx0ICovXG5cdGluaXRpYWxpemF0aW9uPzogQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiBjaGlsZHJlbiB0aGF0IHRoZSBjdXN0b20gZWxlbWVudCBhY2NlcHRzXG5cdCAqL1xuXHRjaGlsZHJlblR5cGU/OiBDaGlsZHJlblR5cGU7XG59XG5cbi8qKlxuICogQHR5cGUgQ3VzdG9tRWxlbWVudFxuICpcbiAqIEEgY3VzdG9tIGVsZW1lbnQgZXh0ZW5kcyB1cG9uIGEgcmVndWxhciBIVE1MRWxlbWVudCBidXQgYWRkcyBmaWVsZHMgZm9yIGRlc2NyaWJpbmcgYW5kIHdyYXBwaW5nIGEgd2lkZ2V0IGNvbnN0cnVjdG9yLlxuICpcbiAqIEBwcm9wZXJ0eSBnZXRXaWRnZXRDb25zdHJ1Y3RvciBSZXR1cm4gdGhlIHdpZGdldCBjb25zdHJ1Y3RvciBmb3IgdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgZ2V0RGVzY3JpcHRvciAgICAgICAgUmV0dXJuIHRoZSBlbGVtZW50IGRlc2NyaXB0b3IgZm9yIHRoaXMgZWxlbWVudFxuICogQHByb3BlcnR5IGdldFdpZGdldEluc3RhbmNlICAgIFJldHVybiB0aGUgd2lkZ2V0IGluc3RhbmNlIHRoYXQgdGhpcyBlbGVtZW50IHdyYXBzXG4gKiBAcHJvcGVydHkgc2V0V2lkZ2V0SW5zdGFuY2UgICAgU2V0IHRoZSB3aWRnZXQgaW5zdGFuY2UgZm9yIHRoaXMgZWxlbWVudFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdGdldFdpZGdldENvbnN0cnVjdG9yKCk6IENvbnN0cnVjdG9yPFdpZGdldEJhc2U8V2lkZ2V0UHJvcGVydGllcz4+O1xuXHRnZXREZXNjcmlwdG9yKCk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xuXHRnZXRXaWRnZXRJbnN0YW5jZSgpOiBQcm9qZWN0b3JNaXhpbjxhbnk+O1xuXHRzZXRXaWRnZXRJbnN0YW5jZShpbnN0YW5jZTogUHJvamVjdG9yTWl4aW48YW55Pik6IHZvaWQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgRG9tVG9XaWRnZXRXcmFwcGVyXG4gKi9cbmV4cG9ydCB0eXBlIERvbVRvV2lkZ2V0V3JhcHBlclByb3BlcnRpZXMgPSBWTm9kZVByb3BlcnRpZXMgJiBXaWRnZXRQcm9wZXJ0aWVzO1xuXG4vKipcbiAqIERvbVRvV2lkZ2V0V3JhcHBlciB0eXBlXG4gKi9cbmV4cG9ydCB0eXBlIERvbVRvV2lkZ2V0V3JhcHBlciA9IENvbnN0cnVjdG9yPFdpZGdldEJhc2U8RG9tVG9XaWRnZXRXcmFwcGVyUHJvcGVydGllcz4+O1xuXG4vKipcbiAqIERvbVRvV2lkZ2V0V3JhcHBlciBIT0NcbiAqXG4gKiBAcGFyYW0gZG9tTm9kZSBUaGUgZG9tIG5vZGUgdG8gd3JhcFxuICovXG5leHBvcnQgZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGU6IEN1c3RvbUVsZW1lbnQpOiBEb21Ub1dpZGdldFdyYXBwZXIge1xuXHRyZXR1cm4gY2xhc3MgRG9tVG9XaWRnZXRXcmFwcGVyIGV4dGVuZHMgV2lkZ2V0QmFzZTxEb21Ub1dpZGdldFdyYXBwZXJQcm9wZXJ0aWVzPiB7XG5cdFx0cHJpdmF0ZSBfd2lkZ2V0SW5zdGFuY2U6IFByb2plY3Rvck1peGluPGFueT47XG5cblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0XHR0aGlzLl93aWRnZXRJbnN0YW5jZSA9IGRvbU5vZGUuZ2V0V2lkZ2V0SW5zdGFuY2UgJiYgZG9tTm9kZS5nZXRXaWRnZXRJbnN0YW5jZSgpO1xuXHRcdFx0aWYgKCF0aGlzLl93aWRnZXRJbnN0YW5jZSkge1xuXHRcdFx0XHRkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3RlZCcsICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl93aWRnZXRJbnN0YW5jZSA9IGRvbU5vZGUuZ2V0V2lkZ2V0SW5zdGFuY2UoKTtcblx0XHRcdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fcmVuZGVyX18oKTogVk5vZGUge1xuXHRcdFx0Y29uc3Qgdk5vZGUgPSBzdXBlci5fX3JlbmRlcl9fKCkgYXMgSW50ZXJuYWxWTm9kZTtcblx0XHRcdHZOb2RlLmRvbU5vZGUgPSBkb21Ob2RlO1xuXHRcdFx0cmV0dXJuIHZOb2RlO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCByZW5kZXIoKTogRE5vZGUge1xuXHRcdFx0aWYgKHRoaXMuX3dpZGdldEluc3RhbmNlKSB7XG5cdFx0XHRcdHRoaXMuX3dpZGdldEluc3RhbmNlLnNldFByb3BlcnRpZXMoe1xuXHRcdFx0XHRcdGtleTogJ3Jvb3QnLFxuXHRcdFx0XHRcdC4uLnRoaXMuX3dpZGdldEluc3RhbmNlLnByb3BlcnRpZXMsXG5cdFx0XHRcdFx0Li4udGhpcy5wcm9wZXJ0aWVzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHYoZG9tTm9kZS50YWdOYW1lLCB7fSk7XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoXG5cdGF0dHJpYnV0ZU5hbWU6IHN0cmluZyxcblx0YXR0cmlidXRlVmFsdWU6IHN0cmluZyB8IG51bGwsXG5cdGRlc2NyaXB0b3I6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yXG4pOiBbc3RyaW5nLCBhbnldIHtcblx0bGV0IHsgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZSwgdmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZSB9ID0gZGVzY3JpcHRvcjtcblxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZShhdHRyaWJ1dGVWYWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gW3Byb3BlcnR5TmFtZSwgdmFsdWVdO1xufVxuXG5leHBvcnQgbGV0IGN1c3RvbUV2ZW50Q2xhc3MgPSBnbG9iYWwuQ3VzdG9tRXZlbnQ7XG5cbmlmICh0eXBlb2YgY3VzdG9tRXZlbnRDbGFzcyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRjb25zdCBjdXN0b21FdmVudCA9IGZ1bmN0aW9uKGV2ZW50OiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG5cdFx0cGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuXHRcdGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuXHRcdGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG5cdFx0cmV0dXJuIGV2dDtcblx0fTtcblxuXHRpZiAoZ2xvYmFsLkV2ZW50KSB7XG5cdFx0Y3VzdG9tRXZlbnQucHJvdG90eXBlID0gZ2xvYmFsLkV2ZW50LnByb3RvdHlwZTtcblx0fVxuXG5cdGN1c3RvbUV2ZW50Q2xhc3MgPSBjdXN0b21FdmVudDtcbn1cblxuLyoqXG4gKiBDYWxsZWQgYnkgSFRNTEVsZW1lbnQgc3ViY2xhc3MgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgd2l0aCB0aGUgYXBwcm9wcmlhdGUgYXR0cmlidXRlcy9wcm9wZXJ0aWVzL2V2ZW50cy5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBpbml0aWFsaXplLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUVsZW1lbnQoZWxlbWVudDogQ3VzdG9tRWxlbWVudCkge1xuXHRsZXQgaW5pdGlhbFByb3BlcnRpZXM6IGFueSA9IHt9O1xuXG5cdGNvbnN0IHtcblx0XHRjaGlsZHJlblR5cGUgPSBDaGlsZHJlblR5cGUuRE9KTyxcblx0XHRhdHRyaWJ1dGVzID0gW10sXG5cdFx0ZXZlbnRzID0gW10sXG5cdFx0cHJvcGVydGllcyA9IFtdLFxuXHRcdGluaXRpYWxpemF0aW9uXG5cdH0gPSBlbGVtZW50LmdldERlc2NyaXB0b3IoKTtcblxuXHRhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuXHRcdGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZTtcblxuXHRcdGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdID0gZ2V0V2lkZ2V0UHJvcGVydHlGcm9tQXR0cmlidXRlKFxuXHRcdFx0YXR0cmlidXRlTmFtZSxcblx0XHRcdGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKSksXG5cdFx0XHRhdHRyaWJ1dGVcblx0XHQpO1xuXHRcdGluaXRpYWxQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuXHR9KTtcblxuXHRwcm9wZXJ0aWVzLmZvckVhY2goKHsgcHJvcGVydHlOYW1lLCB3aWRnZXRQcm9wZXJ0eU5hbWUgfSkgPT4ge1xuXHRcdGluaXRpYWxQcm9wZXJ0aWVzW3dpZGdldFByb3BlcnR5TmFtZSB8fCBwcm9wZXJ0eU5hbWVdID0gKGVsZW1lbnQgYXMgYW55KVtwcm9wZXJ0eU5hbWVdO1xuXHR9KTtcblxuXHRsZXQgY3VzdG9tUHJvcGVydGllczogUHJvcGVydHlEZXNjcmlwdG9yTWFwID0ge307XG5cblx0YXR0cmlidXRlcy5yZWR1Y2UoKHByb3BlcnRpZXMsIGF0dHJpYnV0ZSkgPT4ge1xuXHRcdGNvbnN0IHsgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlLmF0dHJpYnV0ZU5hbWUgfSA9IGF0dHJpYnV0ZTtcblxuXHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHtcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9LFxuXHRcdFx0c2V0KHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0Y29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gPSBnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoXG5cdFx0XHRcdFx0YXR0cmlidXRlLmF0dHJpYnV0ZU5hbWUsXG5cdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5zZXRQcm9wZXJ0aWVzKFxuXHRcdFx0XHRcdGFzc2lnbih7fSwgZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnByb3BlcnRpZXMsIHtcblx0XHRcdFx0XHRcdFtwcm9wZXJ0eU5hbWVdOiBwcm9wZXJ0eVZhbHVlXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdH0sIGN1c3RvbVByb3BlcnRpZXMpO1xuXG5cdHByb3BlcnRpZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBwcm9wZXJ0eSkgPT4ge1xuXHRcdGNvbnN0IHsgcHJvcGVydHlOYW1lLCBnZXRWYWx1ZSwgc2V0VmFsdWUgfSA9IHByb3BlcnR5O1xuXHRcdGNvbnN0IHsgd2lkZ2V0UHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lIH0gPSBwcm9wZXJ0eTtcblxuXHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHtcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllc1t3aWRnZXRQcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRyZXR1cm4gZ2V0VmFsdWUgPyBnZXRWYWx1ZSh2YWx1ZSkgOiB2YWx1ZTtcblx0XHRcdH0sXG5cblx0XHRcdHNldCh2YWx1ZTogYW55KSB7XG5cdFx0XHRcdGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5zZXRQcm9wZXJ0aWVzKFxuXHRcdFx0XHRcdGFzc2lnbih7fSwgZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnByb3BlcnRpZXMsIHtcblx0XHRcdFx0XHRcdFt3aWRnZXRQcm9wZXJ0eU5hbWVdOiBzZXRWYWx1ZSA/IHNldFZhbHVlKHZhbHVlKSA6IHZhbHVlXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdH0sIGN1c3RvbVByb3BlcnRpZXMpO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGVsZW1lbnQsIGN1c3RvbVByb3BlcnRpZXMpO1xuXG5cdC8vIGRlZmluZSBldmVudHNcblx0ZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG5cdFx0Y29uc3QgeyBwcm9wZXJ0eU5hbWUsIGV2ZW50TmFtZSB9ID0gZXZlbnQ7XG5cblx0XHRpbml0aWFsUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gKGV2ZW50OiBhbnkpID0+IHtcblx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChcblx0XHRcdFx0bmV3IGN1c3RvbUV2ZW50Q2xhc3MoZXZlbnROYW1lLCB7XG5cdFx0XHRcdFx0YnViYmxlczogZmFsc2UsXG5cdFx0XHRcdFx0ZGV0YWlsOiBldmVudFxuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHR9O1xuXHR9KTtcblxuXHRpZiAoaW5pdGlhbGl6YXRpb24pIHtcblx0XHRpbml0aWFsaXphdGlvbi5jYWxsKGVsZW1lbnQsIGluaXRpYWxQcm9wZXJ0aWVzKTtcblx0fVxuXG5cdGNvbnN0IHByb2plY3RvciA9IFByb2plY3Rvck1peGluKGVsZW1lbnQuZ2V0V2lkZ2V0Q29uc3RydWN0b3IoKSk7XG5cdGNvbnN0IHdpZGdldEluc3RhbmNlID0gbmV3IHByb2plY3RvcigpO1xuXG5cdHdpZGdldEluc3RhbmNlLnNldFByb3BlcnRpZXMoaW5pdGlhbFByb3BlcnRpZXMpO1xuXHRlbGVtZW50LnNldFdpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0bGV0IGNoaWxkcmVuOiBETm9kZVtdID0gW107XG5cdFx0bGV0IGVsZW1lbnRDaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGROb2RlcyA/IChhcnJheUZyb20oZWxlbWVudC5jaGlsZE5vZGVzKSBhcyBDdXN0b21FbGVtZW50W10pIDogW107XG5cblx0XHRlbGVtZW50Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgcHJvcGVydGllcyA9IHsga2V5OiBgY2hpbGQtJHtpbmRleH1gIH07XG5cdFx0XHRpZiAoY2hpbGRyZW5UeXBlID09PSBDaGlsZHJlblR5cGUuRE9KTykge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKHcoRG9tVG9XaWRnZXRXcmFwcGVyKGNoaWxkTm9kZSksIHByb3BlcnRpZXMpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2godyhEb21XcmFwcGVyKGNoaWxkTm9kZSksIHByb3BlcnRpZXMpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRlbGVtZW50Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlKSA9PiB7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZSk7XG5cdFx0fSk7XG5cblx0XHR3aWRnZXRJbnN0YW5jZS5zZXRDaGlsZHJlbihjaGlsZHJlbik7XG5cdFx0d2lkZ2V0SW5zdGFuY2UuYXBwZW5kKGVsZW1lbnQpO1xuXHR9O1xufVxuXG4vKipcbiAqIENhbGxlZCBieSBIVE1MRWxlbWVudCBzdWJjbGFzcyB3aGVuIGFuIEhUTUwgYXR0cmlidXRlIGhhcyBjaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50ICAgICBUaGUgZWxlbWVudCB3aG9zZSBhdHRyaWJ1dGVzIGFyZSBiZWluZyB3YXRjaGVkXG4gKiBAcGFyYW0gbmFtZSAgICAgICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICogQHBhcmFtIG5ld1ZhbHVlICAgIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZVxuICogQHBhcmFtIG9sZFZhbHVlICAgIFRoZSBvbGQgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQXR0cmlidXRlQ2hhbmdlZChcblx0ZWxlbWVudDogQ3VzdG9tRWxlbWVudCxcblx0bmFtZTogc3RyaW5nLFxuXHRuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCxcblx0b2xkVmFsdWU6IHN0cmluZyB8IG51bGxcbikge1xuXHRjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5nZXREZXNjcmlwdG9yKCkuYXR0cmlidXRlcyB8fCBbXTtcblxuXHRhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuXHRcdGNvbnN0IHsgYXR0cmlidXRlTmFtZSB9ID0gYXR0cmlidXRlO1xuXG5cdFx0aWYgKGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSA9IGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBuZXdWYWx1ZSwgYXR0cmlidXRlKTtcblx0XHRcdGVsZW1lbnRcblx0XHRcdFx0LmdldFdpZGdldEluc3RhbmNlKClcblx0XHRcdFx0LnNldFByb3BlcnRpZXMoYXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywgeyBbcHJvcGVydHlOYW1lXTogcHJvcGVydHlWYWx1ZSB9KSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjdXN0b21FbGVtZW50cy50cyIsImltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHtcblx0Q29uc3RydWN0b3IsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHREZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFJlZ2lzdHJ5TGFiZWwsXG5cdFZOb2RlUHJvcGVydGllcyxcblx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0V05vZGVcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgV05vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgV05PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgV05vZGUuJyk7XG5cbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFZOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFZOb2RlLicpO1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXTm9kZTxXIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPihcblx0Y2hpbGQ6IEROb2RlPFc+XG4pOiBjaGlsZCBpcyBXTm9kZTxXPiB7XG5cdHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gV05PREUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBWTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWTm9kZShjaGlsZDogRE5vZGUpOiBjaGlsZCBpcyBWTm9kZSB7XG5cdHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gVk5PREUpO1xufVxuXG4vKipcbiAqIEdlbmVyaWMgZGVjb3JhdGUgZnVuY3Rpb24gZm9yIEROb2Rlcy4gVGhlIG5vZGVzIGFyZSBtb2RpZmllZCBpbiBwbGFjZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcHJlZGljYXRlXG4gKiBhbmQgbW9kaWZpZXIgZnVuY3Rpb25zLlxuICpcbiAqIFRoZSBjaGlsZHJlbiBvZiBlYWNoIG5vZGUgYXJlIGZsYXR0ZW5lZCBhbmQgYWRkZWQgdG8gdGhlIGFycmF5IGZvciBkZWNvcmF0aW9uLlxuICpcbiAqIElmIG5vIHByZWRpY2F0ZSBpcyBzdXBwbGllZCB0aGVuIHRoZSBtb2RpZmllciB3aWxsIGJlIGV4ZWN1dGVkIG9uIGFsbCBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oXG5cdGROb2RlczogRE5vZGUsXG5cdG1vZGlmaWVyOiAoZE5vZGU6IFQpID0+IHZvaWQsXG5cdHByZWRpY2F0ZTogKGROb2RlOiBETm9kZSkgPT4gZE5vZGUgaXMgVFxuKTogRE5vZGU7XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihcblx0ZE5vZGVzOiBETm9kZVtdLFxuXHRtb2RpZmllcjogKGROb2RlOiBUKSA9PiB2b2lkLFxuXHRwcmVkaWNhdGU6IChkTm9kZTogRE5vZGUpID0+IGROb2RlIGlzIFRcbik6IEROb2RlW107XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGUoZE5vZGVzOiBETm9kZSwgbW9kaWZpZXI6IChkTm9kZTogRE5vZGUpID0+IHZvaWQpOiBETm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IEROb2RlW10sIG1vZGlmaWVyOiAoZE5vZGU6IEROb2RlKSA9PiB2b2lkKTogRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShcblx0ZE5vZGVzOiBETm9kZSB8IEROb2RlW10sXG5cdG1vZGlmaWVyOiAoZE5vZGU6IEROb2RlKSA9PiB2b2lkLFxuXHRwcmVkaWNhdGU/OiAoZE5vZGU6IEROb2RlKSA9PiBib29sZWFuXG4pOiBETm9kZSB8IEROb2RlW10ge1xuXHRsZXQgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBbLi4uZE5vZGVzXSA6IFtkTm9kZXNdO1xuXHR3aGlsZSAobm9kZXMubGVuZ3RoKSB7XG5cdFx0Y29uc3Qgbm9kZSA9IG5vZGVzLnBvcCgpO1xuXHRcdGlmIChub2RlKSB7XG5cdFx0XHRpZiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUobm9kZSkpIHtcblx0XHRcdFx0bW9kaWZpZXIobm9kZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoKGlzV05vZGUobm9kZSkgfHwgaXNWTm9kZShub2RlKSkgJiYgbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRub2RlcyA9IFsuLi5ub2RlcywgLi4ubm9kZS5jaGlsZHJlbl07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkTm9kZXM7XG59XG5cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIGEgd2lkZ2V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdzxXIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdHdpZGdldENvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxXPiB8IFJlZ2lzdHJ5TGFiZWwsXG5cdHByb3BlcnRpZXM6IFdbJ3Byb3BlcnRpZXMnXSxcblx0Y2hpbGRyZW46IFdbJ2NoaWxkcmVuJ10gPSBbXVxuKTogV05vZGU8Vz4ge1xuXHRyZXR1cm4ge1xuXHRcdGNoaWxkcmVuLFxuXHRcdHdpZGdldENvbnN0cnVjdG9yLFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dHlwZTogV05PREVcblx0fTtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgVk5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcywgY2hpbGRyZW4/OiBETm9kZVtdKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgY2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlW10pOiBWTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiB2KHRhZzogc3RyaW5nKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdihcblx0dGFnOiBzdHJpbmcsXG5cdHByb3BlcnRpZXNPckNoaWxkcmVuOiBWTm9kZVByb3BlcnRpZXMgfCBEZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzIHwgRE5vZGVbXSA9IHt9LFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGVbXSA9IHVuZGVmaW5lZFxuKTogVk5vZGUge1xuXHRsZXQgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuXHRsZXQgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s7XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllc09yQ2hpbGRyZW4pKSB7XG5cdFx0Y2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcblx0XHRwcm9wZXJ0aWVzID0ge307XG5cdH1cblxuXHRpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XG5cdFx0cHJvcGVydGllcyA9IHt9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0YWcsXG5cdFx0ZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXG5cdFx0Y2hpbGRyZW4sXG5cdFx0cHJvcGVydGllcyxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGQudHMiLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5cbi8qKlxuICogRGVjb3JhdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBydW4gYXMgYW4gYXNwZWN0IHRvIGByZW5kZXJgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcihtZXRob2Q6IEZ1bmN0aW9uKTogKHRhcmdldDogYW55KSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKCk6ICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcihtZXRob2Q/OiBGdW5jdGlvbikge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWZ0ZXJSZW5kZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYWZ0ZXJSZW5kZXIudHMiLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBCZWZvcmVQcm9wZXJ0aWVzIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBhZGRzIHRoZSBmdW5jdGlvbiBwYXNzZWQgb2YgdGFyZ2V0IG1ldGhvZCB0byBiZSBydW5cbiAqIGluIHRoZSBgYmVmb3JlUHJvcGVydGllc2AgbGlmZWN5Y2xlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2Q6IEJlZm9yZVByb3BlcnRpZXMpOiAodGFyZ2V0OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcygpOiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2Q/OiBCZWZvcmVQcm9wZXJ0aWVzKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJlZm9yZVByb3BlcnRpZXM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYmVmb3JlUHJvcGVydGllcy50cyIsImltcG9ydCB7IEN1c3RvbUVsZW1lbnRJbml0aWFsaXplciB9IGZyb20gJy4uL2N1c3RvbUVsZW1lbnRzJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY3VzdG9tIGVsZW1lbnQgY29uZmlndXJhdGlvbiB1c2VkIGJ5IHRoZSBjdXN0b21FbGVtZW50IGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRDb25maWc8UCBleHRlbmRzIFdpZGdldFByb3BlcnRpZXM+IHtcblx0LyoqXG5cdCAqIFRoZSB0YWcgb2YgdGhlIGN1c3RvbSBlbGVtZW50XG5cdCAqL1xuXHR0YWc6IHN0cmluZztcblxuXHQvKipcblx0ICogTGlzdCBvZiB3aWRnZXQgcHJvcGVydGllcyB0byBleHBvc2UgYXMgcHJvcGVydGllcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHByb3BlcnRpZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBhdHRyaWJ1dGVzIG9uIHRoZSBjdXN0b20gZWxlbWVudCB0byBtYXAgdG8gd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdGF0dHJpYnV0ZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBldmVudHMgdG8gZXhwb3NlXG5cdCAqL1xuXHRldmVudHM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogSW5pdGlhbGl6YXRpb24gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGNyZWF0ZWQgKGZvciBjdXN0b20gcHJvcGVydHkgc2V0dGluZylcblx0ICovXG5cdGluaXRpYWxpemF0aW9uPzogQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyO1xufVxuXG4vKipcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21FbGVtZW50PFAgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzID0gV2lkZ2V0UHJvcGVydGllcz4oe1xuXHR0YWcsXG5cdHByb3BlcnRpZXMsXG5cdGF0dHJpYnV0ZXMsXG5cdGV2ZW50cyxcblx0aW5pdGlhbGl6YXRpb25cbn06IEN1c3RvbUVsZW1lbnRDb25maWc8UD4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uPFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjxhbnk+Pih0YXJnZXQ6IFQpIHtcblx0XHR0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XG5cdFx0XHR0YWdOYW1lOiB0YWcsXG5cdFx0XHR3aWRnZXRDb25zdHJ1Y3RvcjogdGFyZ2V0LFxuXHRcdFx0YXR0cmlidXRlczogKGF0dHJpYnV0ZXMgfHwgW10pLm1hcCgoYXR0cmlidXRlTmFtZSkgPT4gKHsgYXR0cmlidXRlTmFtZSB9KSksXG5cdFx0XHRwcm9wZXJ0aWVzOiAocHJvcGVydGllcyB8fCBbXSkubWFwKChwcm9wZXJ0eU5hbWUpID0+ICh7IHByb3BlcnR5TmFtZSB9KSksXG5cdFx0XHRldmVudHM6IChldmVudHMgfHwgW10pLm1hcCgocHJvcGVydHlOYW1lKSA9PiAoe1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdGV2ZW50TmFtZTogcHJvcGVydHlOYW1lLnJlcGxhY2UoJ29uJywgJycpLnRvTG93ZXJDYXNlKClcblx0XHRcdH0pKSxcblx0XHRcdGluaXRpYWxpemF0aW9uXG5cdFx0fTtcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3VzdG9tRWxlbWVudDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjdXN0b21FbGVtZW50LnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgRGlmZlByb3BlcnR5RnVuY3Rpb24gfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIGEgZnVuY3Rpb24gYXMgYSBzcGVjaWZpYyBwcm9wZXJ0eSBkaWZmXG4gKlxuICogQHBhcmFtIHByb3BlcnR5TmFtZSAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9mIHdoaWNoIHRoZSBkaWZmIGZ1bmN0aW9uIGlzIGFwcGxpZWRcbiAqIEBwYXJhbSBkaWZmVHlwZSAgICAgIFRoZSBkaWZmIHR5cGUsIGRlZmF1bHQgaXMgRGlmZlR5cGUuQVVUTy5cbiAqIEBwYXJhbSBkaWZmRnVuY3Rpb24gIEEgZGlmZiBmdW5jdGlvbiB0byBydW4gaWYgZGlmZlR5cGUgaWYgRGlmZlR5cGUuQ1VTVE9NXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWZmUHJvcGVydHkocHJvcGVydHlOYW1lOiBzdHJpbmcsIGRpZmZGdW5jdGlvbjogRGlmZlByb3BlcnR5RnVuY3Rpb24sIHJlYWN0aW9uRnVuY3Rpb24/OiBGdW5jdGlvbikge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWAsIGRpZmZGdW5jdGlvbi5iaW5kKG51bGwpKTtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5JywgcHJvcGVydHlOYW1lKTtcblx0XHRpZiAocmVhY3Rpb25GdW5jdGlvbiB8fCBwcm9wZXJ0eUtleSkge1xuXHRcdFx0dGFyZ2V0LmFkZERlY29yYXRvcignZGlmZlJlYWN0aW9uJywge1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdHJlYWN0aW9uOiBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiByZWFjdGlvbkZ1bmN0aW9uXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmUHJvcGVydHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZGlmZlByb3BlcnR5LnRzIiwiZXhwb3J0IHR5cGUgRGVjb3JhdG9ySGFuZGxlciA9ICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcpID0+IHZvaWQ7XG5cbi8qKlxuICogR2VuZXJpYyBkZWNvcmF0b3IgaGFuZGxlciB0byB0YWtlIGNhcmUgb2Ygd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgY2FsbGVkIGF0IHRoZSBjbGFzcyBsZXZlbFxuICogb3IgdGhlIG1ldGhvZCBsZXZlbC5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRGVjb3JhdG9yKGhhbmRsZXI6IERlY29yYXRvckhhbmRsZXIpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZywgZGVzY3JpcHRvcj86IFByb3BlcnR5RGVzY3JpcHRvcikge1xuXHRcdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRoYW5kbGVyKHRhcmdldC5wcm90b3R5cGUsIHVuZGVmaW5lZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhhbmRsZXIodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVEZWNvcmF0b3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaGFuZGxlRGVjb3JhdG9yLnRzIiwiaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuL2JlZm9yZVByb3BlcnRpZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnlMYWJlbCB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogTWFwIG9mIGluc3RhbmNlcyBhZ2FpbnN0IHJlZ2lzdGVyZWQgaW5qZWN0b3JzLlxuICovXG5jb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzTWFwOiBXZWFrTWFwPFdpZGdldEJhc2UsIEluamVjdG9yW10+ID0gbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjb250cmFjdCByZXF1aXJlcyBmb3IgdGhlIGdldCBwcm9wZXJ0aWVzIGZ1bmN0aW9uXG4gKiB1c2VkIHRvIG1hcCB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRQcm9wZXJ0aWVzPFQgPSBhbnk+IHtcblx0KHBheWxvYWQ6IGFueSwgcHJvcGVydGllczogVCk6IFQ7XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb24gcmVxdWlyZWQgZm9yIHVzZSBvZiB0aGUgYGluamVjdGAgZGVjb3JhdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0Q29uZmlnIHtcblx0LyoqXG5cdCAqIFRoZSBsYWJlbCBvZiB0aGUgcmVnaXN0cnkgaW5qZWN0b3Jcblx0ICovXG5cdG5hbWU6IFJlZ2lzdHJ5TGFiZWw7XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBwcm9wZXJ0dWVzIHRvIGluamVjdCB1c2luZyB0aGUgcGFzc2VkIHByb3BlcnRpZXNcblx0ICogYW5kIHRoZSBpbmplY3RlZCBwYXlsb2FkLlxuXHQgKi9cblx0Z2V0UHJvcGVydGllczogR2V0UHJvcGVydGllcztcbn1cblxuLyoqXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXG4gKiBhbmQgY3VycmVudCBwcm9wZXJ0aWVzIHdpdGggdGhlIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoeyBuYW1lLCBnZXRQcm9wZXJ0aWVzIH06IEluamVjdENvbmZpZykge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0YmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbih0aGlzOiBXaWRnZXRCYXNlLCBwcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRcdGNvbnN0IGluamVjdG9yID0gdGhpcy5yZWdpc3RyeS5nZXRJbmplY3RvcihuYW1lKTtcblx0XHRcdGlmIChpbmplY3Rvcikge1xuXHRcdFx0XHRjb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzID0gcmVnaXN0ZXJlZEluamVjdG9yc01hcC5nZXQodGhpcykgfHwgW107XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuc2V0KHRoaXMsIHJlZ2lzdGVyZWRJbmplY3RvcnMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmluZGV4T2YoaW5qZWN0b3IpID09PSAtMSkge1xuXHRcdFx0XHRcdGluamVjdG9yLm9uKCdpbnZhbGlkYXRlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZ2V0UHJvcGVydGllcyhpbmplY3Rvci5nZXQoKSwgcHJvcGVydGllcyk7XG5cdFx0XHR9XG5cdFx0fSkodGFyZ2V0KTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluamVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBpbmplY3QudHMiLCJpbXBvcnQgeyBQcm9wZXJ0eUNoYW5nZVJlY29yZCB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0T3JBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsd2F5cyhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogdHJ1ZSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogZmFsc2UsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IHByZXZpb3VzUHJvcGVydHkgIT09IG5ld1Byb3BlcnR5LFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cblx0Y29uc3QgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xuXHRjb25zdCB2YWxpZE5ld1Byb3BlcnR5ID0gbmV3UHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KTtcblxuXHRpZiAoIXZhbGlkT2xkUHJvcGVydHkgfHwgIXZhbGlkTmV3UHJvcGVydHkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hhbmdlZDogdHJ1ZSxcblx0XHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHRcdH07XG5cdH1cblxuXHRjb25zdCBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcblx0Y29uc3QgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld1Byb3BlcnR5KTtcblxuXHRpZiAocHJldmlvdXNLZXlzLmxlbmd0aCAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcblx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0fSBlbHNlIHtcblx0XHRjaGFuZ2VkID0gbmV3S2V5cy5zb21lKChrZXkpID0+IHtcblx0XHRcdHJldHVybiBuZXdQcm9wZXJ0eVtrZXldICE9PSBwcmV2aW91c1Byb3BlcnR5W2tleV07XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdGxldCByZXN1bHQ7XG5cdGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFdJREdFVF9CQVNFX1RZUEUpIHtcblx0XHRcdHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSkpIHtcblx0XHRyZXN1bHQgPSBzaGFsbG93KHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZGlmZi50cyIsImltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL2NvcmUvbGFuZyc7XG5pbXBvcnQgeyBjcmVhdGVIYW5kbGUgfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCBjc3NUcmFuc2l0aW9ucyBmcm9tICcuLi9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBETm9kZSwgUHJvamVjdGlvbiwgUHJvamVjdGlvbk9wdGlvbnMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBhZnRlclJlbmRlciB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9hZnRlclJlbmRlcic7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi8uLi9kJztcbmltcG9ydCB7IFJlZ2lzdHJ5IH0gZnJvbSAnLi8uLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLy4uL3Zkb20nO1xuaW1wb3J0ICdwZXBqcyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYXR0YWNoIHN0YXRlIG9mIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gUHJvamVjdG9yQXR0YWNoU3RhdGUge1xuXHRBdHRhY2hlZCA9IDEsXG5cdERldGFjaGVkXG59XG5cbi8qKlxuICogQXR0YWNoIHR5cGUgZm9yIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gQXR0YWNoVHlwZSB7XG5cdEFwcGVuZCA9IDEsXG5cdE1lcmdlID0gMlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF0dGFjaE9wdGlvbnMge1xuXHQvKipcblx0ICogSWYgYCdhcHBlbmQnYCBpdCB3aWxsIGFwcGVuZGVkIHRvIHRoZSByb290LiBJZiBgJ21lcmdlJ2AgaXQgd2lsbCBtZXJnZWQgd2l0aCB0aGUgcm9vdC4gSWYgYCdyZXBsYWNlJ2AgaXQgd2lsbFxuXHQgKiByZXBsYWNlIHRoZSByb290LlxuXHQgKi9cblx0dHlwZTogQXR0YWNoVHlwZTtcblxuXHQvKipcblx0ICogRWxlbWVudCB0byBhdHRhY2ggdGhlIHByb2plY3Rvci5cblx0ICovXG5cdHJvb3Q/OiBFbGVtZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3RvclByb3BlcnRpZXMge1xuXHRyZWdpc3RyeT86IFJlZ2lzdHJ5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3Rvck1peGluPFA+IHtcblx0cmVhZG9ubHkgcHJvcGVydGllczogUmVhZG9ubHk8UD4gJiBSZWFkb25seTxQcm9qZWN0b3JQcm9wZXJ0aWVzPjtcblxuXHQvKipcblx0ICogQXBwZW5kIHRoZSBwcm9qZWN0b3IgdG8gdGhlIHJvb3QuXG5cdCAqL1xuXHRhcHBlbmQocm9vdD86IEVsZW1lbnQpOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIE1lcmdlIHRoZSBwcm9qZWN0b3Igb250byB0aGUgcm9vdC5cblx0ICpcblx0ICogVGhlIGByb290YCBhbmQgYW55IG9mIGl0cyBgY2hpbGRyZW5gIHdpbGwgYmUgcmUtdXNlZC4gIEFueSBleGNlc3MgRE9NIG5vZGVzIHdpbGwgYmUgaWdub3JlZCBhbmQgYW55IG1pc3NpbmcgRE9NIG5vZGVzXG5cdCAqIHdpbGwgYmUgY3JlYXRlZC5cblx0ICogQHBhcmFtIHJvb3QgVGhlIHJvb3QgZWxlbWVudCB0aGF0IHRoZSByb290IHZpcnR1YWwgRE9NIG5vZGUgd2lsbCBiZSBtZXJnZWQgd2l0aC4gIERlZmF1bHRzIHRvIGBkb2N1bWVudC5ib2R5YC5cblx0ICovXG5cdG1lcmdlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBBdHRhY2ggdGhlIHByb2plY3QgdG8gYSBfc2FuZGJveGVkXyBkb2N1bWVudCBmcmFnbWVudCB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBET00uXG5cdCAqXG5cdCAqIFdoZW4gc2FuZGJveGVkLCB0aGUgYFByb2plY3RvcmAgd2lsbCBydW4gaW4gYSBzeW5jIG1hbm5lciwgd2hlcmUgcmVuZGVycyBhcmUgY29tcGxldGVkIHdpdGhpbiB0aGUgc2FtZSB0dXJuLlxuXHQgKiBUaGUgYFByb2plY3RvcmAgY3JlYXRlcyBhIGBEb2N1bWVudEZyYWdtZW50YCB3aGljaCByZXBsYWNlcyBhbnkgb3RoZXIgYHJvb3RgIHRoYXQgaGFzIGJlZW4gc2V0LlxuXHQgKiBAcGFyYW0gZG9jIFRoZSBgRG9jdW1lbnRgIHRvIHVzZSwgd2hpY2ggZGVmYXVsdHMgdG8gdGhlIGdsb2JhbCBgZG9jdW1lbnRgLlxuXHQgKi9cblx0c2FuZGJveChkb2M/OiBEb2N1bWVudCk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHByb3BlcnRpZXMgZm9yIHRoZSB3aWRnZXQuIFJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIHRoZSBkaWZmaW5nIGZ1bmN0aW9ucyBmb3IgdGhlIHByb3BlcnRpZXMgYWdhaW5zdCB0aGVcblx0ICogcHJldmlvdXMgcHJvcGVydGllcy4gUnVucyB0aG91Z2ggYW55IHJlZ2lzdGVyZWQgc3BlY2lmaWMgcHJvcGVydHkgZGlmZiBmdW5jdGlvbnMgY29sbGVjdGluZyB0aGUgcmVzdWx0cyBhbmQgdGhlblxuXHQgKiBydW5zIHRoZSByZW1haW5kZXIgdGhyb3VnaCB0aGUgY2F0Y2ggYWxsIGRpZmYgZnVuY3Rpb24uIFRoZSBhZ2dyZWdhdGUgb2YgdGhlIHR3byBzZXRzIG9mIHRoZSByZXN1bHRzIGlzIHRoZW5cblx0ICogc2V0IGFzIHRoZSB3aWRnZXQncyBwcm9wZXJ0aWVzXG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBuZXcgd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHNldFByb3BlcnRpZXMocHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZDtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgd2lkZ2V0J3MgY2hpbGRyZW5cblx0ICovXG5cdHNldENoaWxkcmVuKGNoaWxkcmVuOiBETm9kZVtdKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGEgYHN0cmluZ2AgdGhhdCByZXByZXNlbnRzIHRoZSBIVE1MIG9mIHRoZSBjdXJyZW50IHByb2plY3Rpb24uICBUaGUgcHJvamVjdG9yIG5lZWRzIHRvIGJlIGF0dGFjaGVkLlxuXHQgKi9cblx0dG9IdG1sKCk6IHN0cmluZztcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIHRoZSBwcm9qZWN0b3JzIGlzIGluIGFzeW5jIG1vZGUsIGNvbmZpZ3VyZWQgdG8gYHRydWVgIGJ5IGRlZmF1bHRzLlxuXHQgKi9cblx0YXN5bmM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJvb3QgZWxlbWVudCB0byBhdHRhY2ggdGhlIHByb2plY3RvclxuXHQgKi9cblx0cm9vdDogRWxlbWVudDtcblxuXHQvKipcblx0ICogVGhlIHN0YXR1cyBvZiB0aGUgcHJvamVjdG9yXG5cdCAqL1xuXHRyZWFkb25seSBwcm9qZWN0b3JTdGF0ZTogUHJvamVjdG9yQXR0YWNoU3RhdGU7XG5cblx0LyoqXG5cdCAqIFJ1bnMgcmVnaXN0ZXJlZCBkZXN0cm95IGhhbmRsZXNcblx0ICovXG5cdGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3Rvck1peGluPFAsIFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxXaWRnZXRCYXNlPFA+Pj4oQmFzZTogVCk6IFQgJiBDb25zdHJ1Y3RvcjxQcm9qZWN0b3JNaXhpbjxQPj4ge1xuXHRjbGFzcyBQcm9qZWN0b3IgZXh0ZW5kcyBCYXNlIHtcblx0XHRwdWJsaWMgcHJvamVjdG9yU3RhdGU6IFByb2plY3RvckF0dGFjaFN0YXRlO1xuXHRcdHB1YmxpYyBwcm9wZXJ0aWVzOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFByb2plY3RvclByb3BlcnRpZXM+O1xuXG5cdFx0cHJpdmF0ZSBfcm9vdDogRWxlbWVudDtcblx0XHRwcml2YXRlIF9hc3luYyA9IHRydWU7XG5cdFx0cHJpdmF0ZSBfYXR0YWNoSGFuZGxlOiBIYW5kbGU7XG5cdFx0cHJpdmF0ZSBfcHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+O1xuXHRcdHByaXZhdGUgX3Byb2plY3Rpb246IFByb2plY3Rpb24gfCB1bmRlZmluZWQ7XG5cdFx0cHJpdmF0ZSBfcHJvamVjdG9yUHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddID0ge30gYXMgdGhpc1sncHJvcGVydGllcyddO1xuXHRcdHByaXZhdGUgX2hhbmRsZXM6IEZ1bmN0aW9uW10gPSBbXTtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0dGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5yb290ID0gZG9jdW1lbnQuYm9keTtcblx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcblx0XHR9XG5cblx0XHRwdWJsaWMgYXBwZW5kKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBtZXJnZShyb290PzogRWxlbWVudCk6IEhhbmRsZSB7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHR0eXBlOiBBdHRhY2hUeXBlLk1lcmdlLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXQgcm9vdChyb290OiBFbGVtZW50KSB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSByb290IGVsZW1lbnQnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3Jvb3QgPSByb290O1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgcm9vdCgpOiBFbGVtZW50IHtcblx0XHRcdHJldHVybiB0aGlzLl9yb290O1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgYXN5bmMoKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYXN5bmM7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNldCBhc3luYyhhc3luYzogYm9vbGVhbikge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjaGFuZ2UgYXN5bmMgbW9kZScpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYXN5bmMgPSBhc3luYztcblx0XHR9XG5cblx0XHRwdWJsaWMgc2FuZGJveChkb2M6IERvY3VtZW50ID0gZG9jdW1lbnQpOiB2b2lkIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY3JlYXRlIHNhbmRib3gnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2FzeW5jID0gZmFsc2U7XG5cdFx0XHRjb25zdCBwcmV2aW91c1Jvb3QgPSB0aGlzLnJvb3Q7XG5cblx0XHRcdC8qIGZyZWUgdXAgdGhlIGRvY3VtZW50IGZyYWdtZW50IGZvciBHQyAqL1xuXHRcdFx0dGhpcy5vd24oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2F0dGFjaCh7XG5cdFx0XHRcdC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cblx0XHRcdFx0cm9vdDogZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSBhcyBhbnksXG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEROb2RlW10pOiB2b2lkIHtcblx0XHRcdHRoaXMuX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHRcdHRoaXMuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdFx0aWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgJiYgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSAhPT0gcHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0gYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcblx0XHRcdHN1cGVyLl9fc2V0Q29yZVByb3BlcnRpZXNfXyh7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcblx0XHRcdHN1cGVyLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0h0bWwoKTogc3RyaW5nIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBpcyBub3QgYXR0YWNoZWQsIGNhbm5vdCByZXR1cm4gYW4gSFRNTCBzdHJpbmcgb2YgcHJvamVjdGlvbi4nKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodGhpcy5fcHJvamVjdGlvbi5kb21Ob2RlLmNoaWxkTm9kZXNbMF0gYXMgRWxlbWVudCkub3V0ZXJIVE1MO1xuXHRcdH1cblxuXHRcdEBhZnRlclJlbmRlcigpXG5cdFx0cHVibGljIGFmdGVyUmVuZGVyKHJlc3VsdDogRE5vZGUpIHtcblx0XHRcdGxldCBub2RlID0gcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnIHx8IHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRub2RlID0gdignc3BhbicsIHt9LCBbcmVzdWx0XSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgb3duKGhhbmRsZTogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRcdHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBkZXN0cm95KCkge1xuXHRcdFx0d2hpbGUgKHRoaXMuX2hhbmRsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzLnBvcCgpO1xuXHRcdFx0XHRpZiAoaGFuZGxlKSB7XG5cdFx0XHRcdFx0aGFuZGxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIF9hdHRhY2goeyB0eXBlLCByb290IH06IEF0dGFjaE9wdGlvbnMpOiBIYW5kbGUge1xuXHRcdFx0aWYgKHJvb3QpIHtcblx0XHRcdFx0dGhpcy5yb290ID0gcm9vdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2hIYW5kbGU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZDtcblxuXHRcdFx0Y29uc3QgaGFuZGxlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5vd24oaGFuZGxlKTtcblx0XHRcdHRoaXMuX2F0dGFjaEhhbmRsZSA9IGNyZWF0ZUhhbmRsZShoYW5kbGUpO1xuXG5cdFx0XHR0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4udGhpcy5fcHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgc3luYzogIXRoaXMuX2FzeW5jIH0gfTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgQXR0YWNoVHlwZS5BcHBlbmQ6XG5cdFx0XHRcdFx0dGhpcy5fcHJvamVjdGlvbiA9IGRvbS5hcHBlbmQodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gZG9tLm1lcmdlKHRoaXMucm9vdCwgdGhpcywgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBQcm9qZWN0b3I7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rvck1peGluO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFByb2plY3Rvci50cyIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzLCBTdXBwb3J0ZWRDbGFzc05hbWUgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi8uLi9JbmplY3Rvcic7XG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaW5qZWN0JztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBkaWZmUHJvcGVydHkgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5JztcbmltcG9ydCB7IHNoYWxsb3cgfSBmcm9tICcuLy4uL2RpZmYnO1xuXG4vKipcbiAqIEEgbG9va3VwIG9iamVjdCBmb3IgYXZhaWxhYmxlIGNsYXNzIG5hbWVzXG4gKi9cbmV4cG9ydCB0eXBlIENsYXNzTmFtZXMgPSB7XG5cdFtrZXk6IHN0cmluZ106IHN0cmluZztcbn07XG5cbi8qKlxuICogQSBsb29rdXAgb2JqZWN0IGZvciBhdmFpbGFibGUgd2lkZ2V0IGNsYXNzZXMgbmFtZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZSB7XG5cdFtrZXk6IHN0cmluZ106IG9iamVjdDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHJlcXVpcmVkIGZvciB0aGUgVGhlbWVkIG1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkUHJvcGVydGllczxUID0gQ2xhc3NOYW1lcz4gZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0aW5qZWN0ZWRUaGVtZT86IGFueTtcblx0dGhlbWU/OiBUaGVtZTtcblx0ZXh0cmFDbGFzc2VzPzogeyBbUCBpbiBrZXlvZiBUXT86IHN0cmluZyB9O1xufVxuXG5jb25zdCBUSEVNRV9LRVkgPSAnIF9rZXknO1xuXG5leHBvcnQgY29uc3QgSU5KRUNURURfVEhFTUVfS0VZID0gU3ltYm9sKCd0aGVtZScpO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIFRoZW1lZE1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkTWl4aW48VCA9IENsYXNzTmFtZXM+IHtcblx0dGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKTogU3VwcG9ydGVkQ2xhc3NOYW1lO1xuXHR0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWVbXSk6IFN1cHBvcnRlZENsYXNzTmFtZVtdO1xuXHRwcm9wZXJ0aWVzOiBUaGVtZWRQcm9wZXJ0aWVzPFQ+O1xufVxuXG4vKipcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodGhlbWU6IHt9KSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnLCB0aGVtZSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZXZlcnNlIGxvb2t1cCBmb3IgdGhlIGNsYXNzZXMgcGFzc2VkIGluIHZpYSB0aGUgYHRoZW1lYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XG4gKiBAcmVxdWlyZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXM6IENsYXNzTmFtZXNbXSk6IENsYXNzTmFtZXMge1xuXHRyZXR1cm4gY2xhc3Nlcy5yZWR1Y2UoXG5cdFx0KGN1cnJlbnRDbGFzc05hbWVzLCBiYXNlQ2xhc3MpID0+IHtcblx0XHRcdE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Y3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XG5cdFx0fSxcblx0XHQ8Q2xhc3NOYW1lcz57fVxuXHQpO1xufVxuXG4vKipcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxuICogaW5qZWN0b3IgaXMgZGVmaW5lZCBhZ2FpbnN0IHRoZSByZWdpc3RyeSwgcmV0dXJuaW5nIHRoZSB0aGVtZS5cbiAqXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxuICogQHBhcmFtIHRoZW1lUmVnaXN0cnkgcmVnaXN0cnkgdG8gZGVmaW5lIHRoZSB0aGVtZSBpbmplY3RvciBhZ2FpbnN0LiBEZWZhdWx0c1xuICogdG8gdGhlIGdsb2JhbCByZWdpc3RyeVxuICpcbiAqIEByZXR1cm5zIHRoZSB0aGVtZSBpbmplY3RvciB1c2VkIHRvIHNldCB0aGUgdGhlbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGVtZTogYW55LCB0aGVtZVJlZ2lzdHJ5OiBSZWdpc3RyeSk6IEluamVjdG9yIHtcblx0Y29uc3QgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGVtZSk7XG5cdHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoSU5KRUNURURfVEhFTUVfS0VZLCB0aGVtZUluamVjdG9yKTtcblx0cmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY2xhc3MgZGVjb3JhdGVkIHdpdGggd2l0aCBUaGVtZWQgZnVuY3Rpb25hbGl0eVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBUaGVtZWRNaXhpbjxFLCBUIGV4dGVuZHMgQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxUaGVtZWRQcm9wZXJ0aWVzPEU+Pj4+KFxuXHRCYXNlOiBUXG4pOiBDb25zdHJ1Y3RvcjxUaGVtZWRNaXhpbjxFPj4gJiBUIHtcblx0QGluamVjdCh7XG5cdFx0bmFtZTogSU5KRUNURURfVEhFTUVfS0VZLFxuXHRcdGdldFByb3BlcnRpZXM6ICh0aGVtZTogVGhlbWUsIHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXMpOiBUaGVtZWRQcm9wZXJ0aWVzID0+IHtcblx0XHRcdGlmICghcHJvcGVydGllcy50aGVtZSkge1xuXHRcdFx0XHRyZXR1cm4geyB0aGVtZSB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHt9O1xuXHRcdH1cblx0fSlcblx0Y2xhc3MgVGhlbWVkIGV4dGVuZHMgQmFzZSB7XG5cdFx0cHVibGljIHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXM8RT47XG5cblx0XHQvKipcblx0XHQgKiBUaGUgVGhlbWVkIGJhc2VDbGFzc2VzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfcmVnaXN0ZXJlZEJhc2VUaGVtZTogQ2xhc3NOYW1lcztcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVyZWQgYmFzZSB0aGVtZSBrZXlzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXM6IHN0cmluZ1tdID0gW107XG5cblx0XHQvKipcblx0XHQgKiBSZXZlcnNlIGxvb2t1cCBvZiB0aGUgdGhlbWUgY2xhc3Nlc1xuXHRcdCAqL1xuXHRcdHByaXZhdGUgX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwOiBDbGFzc05hbWVzO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuXG5cdFx0LyoqXG5cdFx0ICogTG9hZGVkIHRoZW1lXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfdGhlbWU6IENsYXNzTmFtZXMgPSB7fTtcblxuXHRcdHB1YmxpYyB0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWU7XG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lW107XG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSB8IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lIHwgU3VwcG9ydGVkQ2xhc3NOYW1lW10ge1xuXHRcdFx0aWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xuXHRcdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcblx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWFwKChjbGFzc05hbWUpID0+IHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3NOYW1lKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc2VzKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBGdW5jdGlvbiBmaXJlZCB3aGVuIGB0aGVtZWAgb3IgYGV4dHJhQ2xhc3Nlc2AgYXJlIGNoYW5nZWQuXG5cdFx0ICovXG5cdFx0QGRpZmZQcm9wZXJ0eSgndGhlbWUnLCBzaGFsbG93KVxuXHRcdEBkaWZmUHJvcGVydHkoJ2V4dHJhQ2xhc3NlcycsIHNoYWxsb3cpXG5cdFx0cHJvdGVjdGVkIG9uUHJvcGVydGllc0NoYW5nZWQoKSB7XG5cdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldFRoZW1lQ2xhc3MoY2xhc3NOYW1lOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWUge1xuXHRcdFx0aWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gY2xhc3NOYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8ICh7fSBhcyBhbnkpO1xuXHRcdFx0Y29uc3QgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xuXHRcdFx0bGV0IHJlc3VsdENsYXNzTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdFx0XHRpZiAoIXRoZW1lQ2xhc3NOYW1lKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgQ2xhc3MgbmFtZTogJyR7Y2xhc3NOYW1lfScgbm90IGZvdW5kIGluIHRoZW1lYCk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSkge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pIHtcblx0XHRcdFx0cmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCkge1xuXHRcdFx0Y29uc3QgeyB0aGVtZSA9IHt9IH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cdFx0XHRjb25zdCBiYXNlVGhlbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnKTtcblx0XHRcdGlmICghdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSkge1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpID0+IHtcblx0XHRcdFx0XHRjb25zdCB7IFtUSEVNRV9LRVldOiBrZXksIC4uLmNsYXNzZXMgfSA9IGJhc2VUaGVtZTtcblx0XHRcdFx0XHR0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0cmV0dXJuIHsgLi4uZmluYWxCYXNlVGhlbWUsIC4uLmNsYXNzZXMgfTtcblx0XHRcdFx0fSwge30pO1xuXHRcdFx0XHR0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cCA9IGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChiYXNlVGhlbWVzKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoKGJhc2VUaGVtZSwgdGhlbWVLZXkpID0+IHtcblx0XHRcdFx0cmV0dXJuIHsgLi4uYmFzZVRoZW1lLCAuLi50aGVtZVt0aGVtZUtleV0gfTtcblx0XHRcdH0sIHt9KTtcblxuXHRcdFx0dGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFRoZW1lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGhlbWVkTWl4aW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gVGhlbWVkLnRzIiwiaW1wb3J0IHsgY3VzdG9tRXZlbnRDbGFzcywgQ3VzdG9tRWxlbWVudERlc2NyaXB0b3IsIGhhbmRsZUF0dHJpYnV0ZUNoYW5nZWQsIGluaXRpYWxpemVFbGVtZW50IH0gZnJvbSAnLi9jdXN0b21FbGVtZW50cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IFByb2plY3Rvck1peGluIH0gZnJvbSAnLi9taXhpbnMvUHJvamVjdG9yJztcblxuZGVjbGFyZSBuYW1lc3BhY2UgY3VzdG9tRWxlbWVudHMge1xuXHRmdW5jdGlvbiBkZWZpbmUobmFtZTogc3RyaW5nLCBjb25zdHJ1Y3RvcjogYW55KTogdm9pZDtcbn1cblxuLyoqXG4gKiBEZXNjcmliZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBDdXN0b21FbGVtZW50RGVzY3JpcHRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yRmFjdG9yeSB7XG5cdCgpOiBDdXN0b21FbGVtZW50RGVzY3JpcHRvcjtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBhIGN1c3RvbSBlbGVtZW50IHVzaW5nIHRoZSB2MSBzcGVjIG9mIGN1c3RvbSBlbGVtZW50cy4gTm90ZSB0aGF0XG4gKiB0aGlzIGlzIHRoZSBkZWZhdWx0IGV4cG9ydCwgYW5kLCBleHBlY3RzIHRoZSBwcm9wb3NhbCB0byB3b3JrIGluIHRoZSBicm93c2VyLlxuICogVGhpcyB3aWxsIGxpa2VseSByZXF1aXJlIHRoZSBwb2x5ZmlsbCBhbmQgbmF0aXZlIHNoaW0uXG4gKlxuICogQHBhcmFtIGRlc2NyaXB0b3JGYWN0b3J5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVzY3JpcHRvckZhY3Rvcnk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yRmFjdG9yeSkge1xuXHRjb25zdCBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckZhY3RvcnkoKTtcblxuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXG5cdFx0ZGVzY3JpcHRvci50YWdOYW1lLFxuXHRcdGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRcdFx0cHJpdmF0ZSBfaXNBcHBlbmRlZCA9IGZhbHNlO1xuXHRcdFx0cHJpdmF0ZSBfYXBwZW5kZXI6IEZ1bmN0aW9uO1xuXHRcdFx0cHJpdmF0ZSBfd2lkZ2V0SW5zdGFuY2U6IFByb2plY3Rvck1peGluPGFueT47XG5cblx0XHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0XHRzdXBlcigpO1xuXG5cdFx0XHRcdHRoaXMuX2FwcGVuZGVyID0gaW5pdGlhbGl6ZUVsZW1lbnQodGhpcyk7XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdFx0aWYgKCF0aGlzLl9pc0FwcGVuZGVkKSB7XG5cdFx0XHRcdFx0dGhpcy5fYXBwZW5kZXIoKTtcblx0XHRcdFx0XHR0aGlzLl9pc0FwcGVuZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoXG5cdFx0XHRcdFx0XHRuZXcgY3VzdG9tRXZlbnRDbGFzcygnY29ubmVjdGVkJywge1xuXHRcdFx0XHRcdFx0XHRidWJibGVzOiBmYWxzZVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nIHwgbnVsbCwgbmV3VmFsdWU6IHN0cmluZyB8IG51bGwpIHtcblx0XHRcdFx0aGFuZGxlQXR0cmlidXRlQ2hhbmdlZCh0aGlzLCBuYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgZ2V0V2lkZ2V0SW5zdGFuY2UoKTogUHJvamVjdG9yTWl4aW48YW55PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl93aWRnZXRJbnN0YW5jZTtcblx0XHRcdH1cblxuXHRcdFx0cHVibGljIHNldFdpZGdldEluc3RhbmNlKHdpZGdldDogUHJvamVjdG9yTWl4aW48YW55Pik6IHZvaWQge1xuXHRcdFx0XHR0aGlzLl93aWRnZXRJbnN0YW5jZSA9IHdpZGdldDtcblx0XHRcdH1cblxuXHRcdFx0cHVibGljIGdldFdpZGdldENvbnN0cnVjdG9yKCk6IENvbnN0cnVjdG9yPFdpZGdldEJhc2U8V2lkZ2V0UHJvcGVydGllcz4+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0RGVzY3JpcHRvcigpLndpZGdldENvbnN0cnVjdG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgZ2V0RGVzY3JpcHRvcigpOiBDdXN0b21FbGVtZW50RGVzY3JpcHRvciB7XG5cdFx0XHRcdHJldHVybiBkZXNjcmlwdG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpOiBzdHJpbmdbXSB7XG5cdFx0XHRcdHJldHVybiAoZGVzY3JpcHRvci5hdHRyaWJ1dGVzIHx8IFtdKS5tYXAoKGF0dHJpYnV0ZSkgPT4gYXR0cmlidXRlLmF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCByZWdpc3RlckN1c3RvbUVsZW1lbnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgRE5vZGUsIFZOb2RlLCBWTm9kZVByb3BlcnRpZXMsIFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vLi4vZCc7XG5pbXBvcnQgeyBJbnRlcm5hbFZOb2RlIH0gZnJvbSAnLi8uLi92ZG9tJztcblxuZXhwb3J0IGludGVyZmFjZSBEb21XcmFwcGVyT3B0aW9ucyB7XG5cdG9uQXR0YWNoZWQ/KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIERvbVdyYXBwZXJQcm9wZXJ0aWVzID0gVk5vZGVQcm9wZXJ0aWVzICYgV2lkZ2V0UHJvcGVydGllcztcblxuZXhwb3J0IHR5cGUgRG9tV3JhcHBlciA9IENvbnN0cnVjdG9yPFdpZGdldEJhc2U8RG9tV3JhcHBlclByb3BlcnRpZXM+PjtcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBFbGVtZW50IHtcblx0cmV0dXJuIHZhbHVlLnRhZ05hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEb21XcmFwcGVyKGRvbU5vZGU6IEVsZW1lbnQgfCBUZXh0LCBvcHRpb25zOiBEb21XcmFwcGVyT3B0aW9ucyA9IHt9KTogRG9tV3JhcHBlciB7XG5cdHJldHVybiBjbGFzcyBEb21XcmFwcGVyIGV4dGVuZHMgV2lkZ2V0QmFzZTxEb21XcmFwcGVyUHJvcGVydGllcz4ge1xuXHRcdHB1YmxpYyBfX3JlbmRlcl9fKCk6IFZOb2RlIHtcblx0XHRcdGNvbnN0IHZOb2RlID0gc3VwZXIuX19yZW5kZXJfXygpIGFzIEludGVybmFsVk5vZGU7XG5cdFx0XHR2Tm9kZS5kb21Ob2RlID0gZG9tTm9kZTtcblx0XHRcdHJldHVybiB2Tm9kZTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgb25BdHRhY2goKSB7XG5cdFx0XHRvcHRpb25zLm9uQXR0YWNoZWQgJiYgb3B0aW9ucy5vbkF0dGFjaGVkKCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHJlbmRlcigpOiBETm9kZSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0geyAuLi50aGlzLnByb3BlcnRpZXMsIGtleTogJ3Jvb3QnIH07XG5cdFx0XHRjb25zdCB0YWcgPSBpc0VsZW1lbnQoZG9tTm9kZSkgPyBkb21Ob2RlLnRhZ05hbWUgOiAnJztcblx0XHRcdHJldHVybiB2KHRhZywgcHJvcGVydGllcyk7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBEb21XcmFwcGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIERvbVdyYXBwZXIudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJ0Bkb2pvL3NoaW0vZ2xvYmFsJztcbmltcG9ydCB7XG5cdENvcmVQcm9wZXJ0aWVzLFxuXHREZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0RE5vZGUsXG5cdFZOb2RlLFxuXHRXTm9kZSxcblx0UHJvamVjdGlvbk9wdGlvbnMsXG5cdFByb2plY3Rpb24sXG5cdFN1cHBvcnRlZENsYXNzTmFtZSxcblx0VHJhbnNpdGlvblN0cmF0ZWd5LFxuXHRWTm9kZVByb3BlcnRpZXNcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGZyb20gYXMgYXJyYXlGcm9tIH0gZnJvbSAnQGRvam8vc2hpbS9hcnJheSc7XG5pbXBvcnQgeyBpc1dOb2RlLCBpc1ZOb2RlLCBWTk9ERSwgV05PREUgfSBmcm9tICcuL2QnO1xuaW1wb3J0IHsgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgTm9kZUhhbmRsZXIgZnJvbSAnLi9Ob2RlSGFuZGxlcic7XG5pbXBvcnQgUmVnaXN0cnlIYW5kbGVyIGZyb20gJy4vUmVnaXN0cnlIYW5kbGVyJztcblxuY29uc3QgTkFNRVNQQUNFX1czID0gJ2h0dHA6Ly93d3cudzMub3JnLyc7XG5jb25zdCBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcbmNvbnN0IE5BTUVTUEFDRV9YTElOSyA9IE5BTUVTUEFDRV9XMyArICcxOTk5L3hsaW5rJztcblxuY29uc3QgZW1wdHlBcnJheTogKEludGVybmFsV05vZGUgfCBJbnRlcm5hbFZOb2RlKVtdID0gW107XG5cbmV4cG9ydCB0eXBlIFJlbmRlclJlc3VsdCA9IEROb2RlPGFueT4gfCBETm9kZTxhbnk+W107XG5cbmludGVyZmFjZSBJbnN0YW5jZU1hcERhdGEge1xuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZTtcblx0ZG5vZGU6IEludGVybmFsV05vZGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxXTm9kZSBleHRlbmRzIFdOb2RlPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPiB7XG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIHdpZGdldFxuXHQgKi9cblx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVuZGVyZWQgRE5vZGVzIGZyb20gdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRyZW5kZXJlZDogSW50ZXJuYWxETm9kZVtdO1xuXG5cdC8qKlxuXHQgKiBDb3JlIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBieSB0aGUgd2lkZ2V0IGNvcmUgc3lzdGVtXG5cdCAqL1xuXHRjb3JlUHJvcGVydGllczogQ29yZVByb3BlcnRpZXM7XG5cblx0LyoqXG5cdCAqIENoaWxkcmVuIGZvciB0aGUgV05vZGVcblx0ICovXG5cdGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxWTm9kZSBleHRlbmRzIFZOb2RlIHtcblx0LyoqXG5cdCAqIENoaWxkcmVuIGZvciB0aGUgVk5vZGVcblx0ICovXG5cdGNoaWxkcmVuPzogSW50ZXJuYWxETm9kZVtdO1xuXG5cdGluc2VydGVkPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQmFnIHVzZWQgdG8gc3RpbGwgZGVjb3JhdGUgcHJvcGVydGllcyBvbiBhIGRlZmVycmVkIHByb3BlcnRpZXMgY2FsbGJhY2tcblx0ICovXG5cdGRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcz86IFZOb2RlUHJvcGVydGllcztcblxuXHQvKipcblx0ICogRE9NIGVsZW1lbnRcblx0ICovXG5cdGRvbU5vZGU/OiBFbGVtZW50IHwgVGV4dDtcbn1cblxuZXhwb3J0IHR5cGUgSW50ZXJuYWxETm9kZSA9IEludGVybmFsVk5vZGUgfCBJbnRlcm5hbFdOb2RlO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclF1ZXVlIHtcblx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlO1xuXHRkZXB0aDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdpZGdldERhdGEge1xuXHRvbkRldGFjaDogKCkgPT4gdm9pZDtcblx0b25BdHRhY2g6ICgpID0+IHZvaWQ7XG5cdGRpcnR5OiBib29sZWFuO1xuXHRyZWdpc3RyeTogKCkgPT4gUmVnaXN0cnlIYW5kbGVyO1xuXHRub2RlSGFuZGxlcjogTm9kZUhhbmRsZXI7XG5cdGNvcmVQcm9wZXJ0aWVzOiBDb3JlUHJvcGVydGllcztcblx0aW52YWxpZGF0ZT86IEZ1bmN0aW9uO1xuXHRyZW5kZXJpbmc6IGJvb2xlYW47XG5cdGlucHV0UHJvcGVydGllczogYW55O1xufVxuXG5leHBvcnQgY29uc3Qgd2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcDxhbnksIFdpZGdldERhdGE+KCk7XG5cbmNvbnN0IGluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXA8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIEluc3RhbmNlTWFwRGF0YT4oKTtcbmNvbnN0IHJlbmRlclF1ZXVlTWFwID0gbmV3IFdlYWtNYXA8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIFJlbmRlclF1ZXVlW10+KCk7XG5cbmZ1bmN0aW9uIHNhbWUoZG5vZGUxOiBJbnRlcm5hbEROb2RlLCBkbm9kZTI6IEludGVybmFsRE5vZGUpIHtcblx0aWYgKGlzVk5vZGUoZG5vZGUxKSAmJiBpc1ZOb2RlKGRub2RlMikpIHtcblx0XHRpZiAoZG5vZGUxLnRhZyAhPT0gZG5vZGUyLnRhZykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZSBpZiAoaXNXTm9kZShkbm9kZTEpICYmIGlzV05vZGUoZG5vZGUyKSkge1xuXHRcdGlmIChkbm9kZTEud2lkZ2V0Q29uc3RydWN0b3IgIT09IGRub2RlMi53aWRnZXRDb25zdHJ1Y3Rvcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBtaXNzaW5nVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGUgYSB0cmFuc2l0aW9ucyBvYmplY3QgdG8gdGhlIHByb2plY3Rpb25PcHRpb25zIHRvIGRvIGFuaW1hdGlvbnMnKTtcbn07XG5cbmZ1bmN0aW9uIGdldFByb2plY3Rpb25PcHRpb25zKFxuXHRwcm9qZWN0b3JPcHRpb25zOiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPixcblx0cHJvamVjdG9ySW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pOiBQcm9qZWN0aW9uT3B0aW9ucyB7XG5cdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuXHRcdHN0eWxlQXBwbHllcjogZnVuY3Rpb24oZG9tTm9kZTogSFRNTEVsZW1lbnQsIHN0eWxlTmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0XHQoZG9tTm9kZS5zdHlsZSBhcyBhbnkpW3N0eWxlTmFtZV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdHRyYW5zaXRpb25zOiB7XG5cdFx0XHRlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXG5cdFx0XHRleGl0OiBtaXNzaW5nVHJhbnNpdGlvblxuXHRcdH0sXG5cdFx0ZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxuXHRcdGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcblx0XHRub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxuXHRcdGRlcHRoOiAwLFxuXHRcdG1lcmdlOiBmYWxzZSxcblx0XHRyZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcblx0XHRyZW5kZXJRdWV1ZTogW10sXG5cdFx0cHJvamVjdG9ySW5zdGFuY2Vcblx0fTtcblx0cmV0dXJuIHsgLi4uZGVmYXVsdHMsIC4uLnByb2plY3Rvck9wdGlvbnMgfSBhcyBQcm9qZWN0aW9uT3B0aW9ucztcbn1cblxuZnVuY3Rpb24gY2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWU6IE9iamVjdCkge1xuXHRpZiAodHlwZW9mIHN0eWxlVmFsdWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlRXZlbnRzKFxuXHRkb21Ob2RlOiBOb2RlLFxuXHRwcm9wTmFtZTogc3RyaW5nLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0cHJldmlvdXNQcm9wZXJ0aWVzPzogVk5vZGVQcm9wZXJ0aWVzXG4pIHtcblx0Y29uc3QgcHJldmlvdXMgPSBwcmV2aW91c1Byb3BlcnRpZXMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0Y29uc3QgY3VycmVudFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG5cdGNvbnN0IHByZXZpb3VzVmFsdWUgPSBwcmV2aW91c1twcm9wTmFtZV07XG5cblx0Y29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc3Vic3RyKDIpO1xuXHRjb25zdCBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpIHx8IG5ldyBXZWFrTWFwKCk7XG5cblx0aWYgKHByZXZpb3VzVmFsdWUpIHtcblx0XHRjb25zdCBwcmV2aW91c0V2ZW50ID0gZXZlbnRNYXAuZ2V0KHByZXZpb3VzVmFsdWUpO1xuXHRcdGRvbU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByZXZpb3VzRXZlbnQpO1xuXHR9XG5cblx0bGV0IGNhbGxiYWNrID0gY3VycmVudFZhbHVlLmJpbmQocHJvcGVydGllcy5iaW5kKTtcblxuXHRpZiAoZXZlbnROYW1lID09PSAnaW5wdXQnKSB7XG5cdFx0Y2FsbGJhY2sgPSBmdW5jdGlvbih0aGlzOiBhbnksIGV2dDogRXZlbnQpIHtcblx0XHRcdGN1cnJlbnRWYWx1ZS5jYWxsKHRoaXMsIGV2dCk7XG5cdFx0XHQoZXZ0LnRhcmdldCBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ10gPSAoZXZ0LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcblx0XHR9LmJpbmQocHJvcGVydGllcy5iaW5kKTtcblx0fVxuXG5cdGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0ZXZlbnRNYXAuc2V0KGN1cnJlbnRWYWx1ZSwgY2FsbGJhY2spO1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XG59XG5cbmZ1bmN0aW9uIGFkZENsYXNzZXMoZG9tTm9kZTogRWxlbWVudCwgY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKSB7XG5cdGlmIChjbGFzc2VzKSB7XG5cdFx0Y29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRvbU5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzW2ldKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlOiBFbGVtZW50LCBjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpIHtcblx0aWYgKGNsYXNzZXMpIHtcblx0XHRjb25zdCBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBmb2N1c05vZGUocHJvcFZhbHVlOiBhbnksIHByZXZpb3VzVmFsdWU6IGFueSwgZG9tTm9kZTogRWxlbWVudCwgcHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKTogdm9pZCB7XG5cdGxldCByZXN1bHQ7XG5cdGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmVzdWx0ID0gcHJvcFZhbHVlKCk7XG5cdH0gZWxzZSB7XG5cdFx0cmVzdWx0ID0gcHJvcFZhbHVlICYmICFwcmV2aW91c1ZhbHVlO1xuXHR9XG5cdGlmIChyZXN1bHQgPT09IHRydWUpIHtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdChkb21Ob2RlIGFzIEhUTUxFbGVtZW50KS5mb2N1cygpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMoZG9tTm9kZTogRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcblx0XHRjb25zdCBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcblx0XHRsZXQgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpID8gcHJvcFZhbHVlIDogW3Byb3BWYWx1ZV07XG5cdFx0XHRpZiAoIWRvbU5vZGUuY2xhc3NOYW1lKSB7XG5cdFx0XHRcdGRvbU5vZGUuY2xhc3NOYW1lID0gY3VycmVudENsYXNzZXMuam9pbignICcpLnRyaW0oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcblx0XHRcdGZvY3VzTm9kZShwcm9wVmFsdWUsIGZhbHNlLCBkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcblx0XHRcdGNvbnN0IHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xuXHRcdFx0Y29uc3Qgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcblx0XHRcdFx0Y29uc3Qgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcblx0XHRcdFx0Y29uc3Qgc3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xuXHRcdFx0XHRpZiAoc3R5bGVWYWx1ZSkge1xuXHRcdFx0XHRcdGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKTtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIhKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IG51bGwgJiYgcHJvcFZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuXHRcdFx0aWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDApIHtcblx0XHRcdFx0dXBkYXRlRXZlbnRzKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAndmFsdWUnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJykge1xuXHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIHByb3BOYW1lID09PSAnaHJlZicpIHtcblx0XHRcdFx0XHQoZG9tTm9kZSBhcyBFbGVtZW50KS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIEVsZW1lbnQpLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU9ycGhhbmVkRXZlbnRzKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRwcmV2aW91c1Byb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRjb25zdCBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpO1xuXHRpZiAoZXZlbnRNYXApIHtcblx0XHRPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnRpZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRpZiAocHJvcE5hbWUuc3Vic3RyKDAsIDIpID09PSAnb24nICYmICFwcm9wZXJ0aWVzW3Byb3BOYW1lXSkge1xuXHRcdFx0XHRjb25zdCBldmVudENhbGxiYWNrID0gZXZlbnRNYXAuZ2V0KHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV0pO1xuXHRcdFx0XHRpZiAoZXZlbnRDYWxsYmFjaykge1xuXHRcdFx0XHRcdGRvbU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihwcm9wTmFtZS5zdWJzdHIoMiksIGV2ZW50Q2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0cHJldmlvdXNQcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0bGV0IHByb3BlcnRpZXNVcGRhdGVkID0gZmFsc2U7XG5cdGNvbnN0IHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRjb25zdCBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xuXHRpZiAocHJvcE5hbWVzLmluZGV4T2YoJ2NsYXNzZXMnKSA9PT0gLTEgJiYgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3NlcykpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlc1tpXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpO1xuXHRcdH1cblx0fVxuXG5cdHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcblx0XHRjb25zdCBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcblx0XHRsZXQgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG5cdFx0Y29uc3QgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzUHJvcGVydGllcyFbcHJvcE5hbWVdO1xuXHRcdGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzZXMnKSB7XG5cdFx0XHRjb25zdCBwcmV2aW91c0NsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByZXZpb3VzVmFsdWUpID8gcHJldmlvdXNWYWx1ZSA6IFtwcmV2aW91c1ZhbHVlXTtcblx0XHRcdGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpID8gcHJvcFZhbHVlIDogW3Byb3BWYWx1ZV07XG5cdFx0XHRpZiAocHJldmlvdXNDbGFzc2VzICYmIHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmICghcHJvcFZhbHVlIHx8IHByb3BWYWx1ZS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzZXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBuZXdDbGFzc2VzOiAobnVsbCB8IHVuZGVmaW5lZCB8IHN0cmluZylbXSA9IFsuLi5jdXJyZW50Q2xhc3Nlc107XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHByZXZpb3VzQ2xhc3NOYW1lID0gcHJldmlvdXNDbGFzc2VzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKHByZXZpb3VzQ2xhc3NOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNsYXNzSW5kZXggPSBuZXdDbGFzc2VzLmluZGV4T2YocHJldmlvdXNDbGFzc05hbWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoY2xhc3NJbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3NOYW1lKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRuZXdDbGFzc2VzLnNwbGljZShjbGFzc0luZGV4LCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5ld0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGFkZENsYXNzZXMoZG9tTm9kZSwgbmV3Q2xhc3Nlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0YWRkQ2xhc3Nlcyhkb21Ob2RlLCBjdXJyZW50Q2xhc3Nlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnZm9jdXMnKSB7XG5cdFx0XHRmb2N1c05vZGUocHJvcFZhbHVlLCBwcmV2aW91c1ZhbHVlLCBkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcblx0XHRcdGNvbnN0IHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xuXHRcdFx0Y29uc3Qgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcblx0XHRcdFx0Y29uc3Qgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcblx0XHRcdFx0Y29uc3QgbmV3U3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xuXHRcdFx0XHRjb25zdCBvbGRTdHlsZVZhbHVlID0gcHJldmlvdXNWYWx1ZVtzdHlsZU5hbWVdO1xuXHRcdFx0XHRpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKG5ld1N0eWxlVmFsdWUpIHtcblx0XHRcdFx0XHRjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyIShkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBzdHlsZU5hbWUsIG5ld1N0eWxlVmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFwcm9wVmFsdWUgJiYgdHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHByb3BWYWx1ZSA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XG5cdFx0XHRcdGNvbnN0IGRvbVZhbHVlID0gKGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV07XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXG5cdFx0XHRcdFx0KChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXVxuXHRcdFx0XHRcdFx0PyBkb21WYWx1ZSA9PT0gKGRvbU5vZGUgYXMgYW55KVsnb25pbnB1dC12YWx1ZSddXG5cdFx0XHRcdFx0XHQ6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xuXHRcdFx0XHRcdHVwZGF0ZUV2ZW50cyhkb21Ob2RlLCBwcm9wTmFtZSwgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIHByZXZpb3VzUHJvcGVydGllcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XG5cdFx0XHRcdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRyAmJiBwcm9wTmFtZSA9PT0gJ2hyZWYnKSB7XG5cdFx0XHRcdFx0XHRkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3JvbGUnICYmIHByb3BWYWx1ZSA9PT0gJycpIHtcblx0XHRcdFx0XHRcdGRvbU5vZGUucmVtb3ZlQXR0cmlidXRlKHByb3BOYW1lKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZG9tTm9kZS5zZXRBdHRyaWJ1dGUocHJvcE5hbWUsIHByb3BWYWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICgoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSAhPT0gcHJvcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHQvLyBDb21wYXJpc29uIGlzIGhlcmUgZm9yIHNpZGUtZWZmZWN0cyBpbiBFZGdlIHdpdGggc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wXG5cdFx0XHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcHJvcGVydGllc1VwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mQ2hpbGQoY2hpbGRyZW46IEludGVybmFsRE5vZGVbXSwgc2FtZUFzOiBJbnRlcm5hbEROb2RlLCBzdGFydDogbnVtYmVyKSB7XG5cdGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHNhbWUoY2hpbGRyZW5baV0sIHNhbWVBcykpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1BhcmVudFZOb2RlKGRvbU5vZGU6IEVsZW1lbnQpOiBJbnRlcm5hbFZOb2RlIHtcblx0cmV0dXJuIHtcblx0XHR0YWc6ICcnLFxuXHRcdHByb3BlcnRpZXM6IHt9LFxuXHRcdGNoaWxkcmVuOiB1bmRlZmluZWQsXG5cdFx0ZG9tTm9kZSxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9UZXh0Vk5vZGUoZGF0YTogYW55KTogSW50ZXJuYWxWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRjaGlsZHJlbjogdW5kZWZpbmVkLFxuXHRcdHRleHQ6IGAke2RhdGF9YCxcblx0XHRkb21Ob2RlOiB1bmRlZmluZWQsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuZnVuY3Rpb24gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSwgaW5zdGFuY2VEYXRhOiBXaWRnZXREYXRhKTogSW50ZXJuYWxXTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0aW5zdGFuY2UsXG5cdFx0cmVuZGVyZWQ6IFtdLFxuXHRcdGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXG5cdFx0Y2hpbGRyZW46IGluc3RhbmNlLmNoaWxkcmVuIGFzIGFueSxcblx0XHR3aWRnZXRDb25zdHJ1Y3RvcjogaW5zdGFuY2UuY29uc3RydWN0b3IgYXMgYW55LFxuXHRcdHByb3BlcnRpZXM6IGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMsXG5cdFx0dHlwZTogV05PREVcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oXG5cdGNoaWxkcmVuOiB1bmRlZmluZWQgfCBETm9kZSB8IEROb2RlW10sXG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZVxuKTogSW50ZXJuYWxETm9kZVtdIHtcblx0aWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gZW1wdHlBcnJheTtcblx0fVxuXHRjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyApIHtcblx0XHRjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldIGFzIEludGVybmFsRE5vZGU7XG5cdFx0aWYgKGNoaWxkID09PSB1bmRlZmluZWQgfHwgY2hpbGQgPT09IG51bGwpIHtcblx0XHRcdGNoaWxkcmVuLnNwbGljZShpLCAxKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xuXHRcdFx0Y2hpbGRyZW5baV0gPSB0b1RleHRWTm9kZShjaGlsZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRpZiAoY2hpbGQucHJvcGVydGllcy5iaW5kID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQoY2hpbGQucHJvcGVydGllcyBhcyBhbnkpLmJpbmQgPSBpbnN0YW5jZTtcblx0XHRcdFx0XHRpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFjaGlsZC5jb3JlUHJvcGVydGllcykge1xuXHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0XHRcdGNoaWxkLmNvcmVQcm9wZXJ0aWVzID0ge1xuXHRcdFx0XHRcdFx0YmluZDogaW5zdGFuY2UsXG5cdFx0XHRcdFx0XHRiYXNlUmVnaXN0cnk6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGkrKztcblx0fVxuXHRyZXR1cm4gY2hpbGRyZW4gYXMgSW50ZXJuYWxETm9kZVtdO1xufVxuXG5mdW5jdGlvbiBub2RlQWRkZWQoZG5vZGU6IEludGVybmFsRE5vZGUsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uU3RyYXRlZ3kpIHtcblx0aWYgKGlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcblx0XHRjb25zdCBlbnRlckFuaW1hdGlvbiA9IGRub2RlLnByb3BlcnRpZXMuZW50ZXJBbmltYXRpb247XG5cdFx0aWYgKGVudGVyQW5pbWF0aW9uKSB7XG5cdFx0XHRpZiAodHlwZW9mIGVudGVyQW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGVudGVyQW5pbWF0aW9uKGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgZG5vZGUucHJvcGVydGllcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmFuc2l0aW9ucy5lbnRlcihkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uIGFzIHN0cmluZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGNhbGxPbkRldGFjaChkTm9kZXM6IEludGVybmFsRE5vZGUgfCBJbnRlcm5hbEROb2RlW10sIHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSk6IHZvaWQge1xuXHRkTm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBkTm9kZXMgOiBbZE5vZGVzXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBkTm9kZSA9IGROb2Rlc1tpXTtcblx0XHRpZiAoaXNXTm9kZShkTm9kZSkpIHtcblx0XHRcdGlmIChkTm9kZS5yZW5kZXJlZCkge1xuXHRcdFx0XHRjYWxsT25EZXRhY2goZE5vZGUucmVuZGVyZWQsIGROb2RlLmluc3RhbmNlKTtcblx0XHRcdH1cblx0XHRcdGlmIChkTm9kZS5pbnN0YW5jZSkge1xuXHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpITtcblx0XHRcdFx0aW5zdGFuY2VEYXRhLm9uRGV0YWNoKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkTm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRjYWxsT25EZXRhY2goZE5vZGUuY2hpbGRyZW4gYXMgSW50ZXJuYWxETm9kZVtdLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG5vZGVUb1JlbW92ZShkbm9kZTogSW50ZXJuYWxETm9kZSwgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25TdHJhdGVneSwgcHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChpc1dOb2RlKGRub2RlKSkge1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gZG5vZGUucmVuZGVyZWQgfHwgZW1wdHlBcnJheTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjaGlsZCA9IHJlbmRlcmVkW2ldO1xuXHRcdFx0aWYgKGlzVk5vZGUoY2hpbGQpKSB7XG5cdFx0XHRcdGNoaWxkLmRvbU5vZGUhLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKGNoaWxkLmRvbU5vZGUhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVUb1JlbW92ZShjaGlsZCwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGU7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IGRub2RlLnByb3BlcnRpZXM7XG5cdFx0Y29uc3QgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcblx0XHRpZiAocHJvcGVydGllcyAmJiBleGl0QW5pbWF0aW9uKSB7XG5cdFx0XHQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCkuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblx0XHRcdGNvbnN0IHJlbW92ZURvbU5vZGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0eXBlb2YgZXhpdEFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRleGl0QW5pbWF0aW9uKGRvbU5vZGUgYXMgRWxlbWVudCwgcmVtb3ZlRG9tTm9kZSwgcHJvcGVydGllcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zLmV4aXQoZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uIGFzIHN0cmluZywgcmVtb3ZlRG9tTm9kZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKFxuXHRjaGlsZE5vZGVzOiBJbnRlcm5hbEROb2RlW10sXG5cdGluZGV4VG9DaGVjazogbnVtYmVyLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRjb25zdCBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XG5cdGlmIChpc1ZOb2RlKGNoaWxkTm9kZSkgJiYgIWNoaWxkTm9kZS50YWcpIHtcblx0XHRyZXR1cm47IC8vIFRleHQgbm9kZXMgbmVlZCBub3QgYmUgZGlzdGluZ3Vpc2hhYmxlXG5cdH1cblx0Y29uc3QgeyBrZXkgfSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xuXG5cdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcblx0XHRcdFx0Y29uc3Qgbm9kZSA9IGNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdGlmIChzYW1lKG5vZGUsIGNoaWxkTm9kZSkpIHtcblx0XHRcdFx0XHRsZXQgbm9kZUlkZW50aWZpZXI6IHN0cmluZztcblx0XHRcdFx0XHRjb25zdCBwYXJlbnROYW1lID0gKHBhcmVudEluc3RhbmNlIGFzIGFueSkuY29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XG5cdFx0XHRcdFx0aWYgKGlzV05vZGUoY2hpbGROb2RlKSkge1xuXHRcdFx0XHRcdFx0bm9kZUlkZW50aWZpZXIgPSAoY2hpbGROb2RlLndpZGdldENvbnN0cnVjdG9yIGFzIGFueSkubmFtZSB8fCAndW5rbm93bic7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLnRhZztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XHRgQSB3aWRnZXQgKCR7cGFyZW50TmFtZX0pIGhhcyBoYWQgYSBjaGlsZCBhZGRkZWQgb3IgcmVtb3ZlZCwgYnV0IHRoZXkgd2VyZSBub3QgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmaWVkLiBJdCBpcyByZWNvbW1lbmRlZCB0byBwcm92aWRlIGEgdW5pcXVlICdrZXknIHByb3BlcnR5IHdoZW4gdXNpbmcgdGhlIHNhbWUgd2lkZ2V0IG9yIGVsZW1lbnQgKCR7bm9kZUlkZW50aWZpZXJ9KSBtdWx0aXBsZSB0aW1lcyBhcyBzaWJsaW5nc2Bcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0b2xkQ2hpbGRyZW46IEludGVybmFsRE5vZGVbXSxcblx0bmV3Q2hpbGRyZW46IEludGVybmFsRE5vZGVbXSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRvbGRDaGlsZHJlbiA9IG9sZENoaWxkcmVuIHx8IGVtcHR5QXJyYXk7XG5cdG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG5cdGNvbnN0IG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xuXHRjb25zdCBuZXdDaGlsZHJlbkxlbmd0aCA9IG5ld0NoaWxkcmVuLmxlbmd0aDtcblx0Y29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucyE7XG5cdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9O1xuXHRsZXQgb2xkSW5kZXggPSAwO1xuXHRsZXQgbmV3SW5kZXggPSAwO1xuXHRsZXQgaTogbnVtYmVyO1xuXHRsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcblx0d2hpbGUgKG5ld0luZGV4IDwgbmV3Q2hpbGRyZW5MZW5ndGgpIHtcblx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltuZXdJbmRleF07XG5cdFx0aWYgKGlzVk5vZGUobmV3Q2hpbGQpICYmIHR5cGVvZiBuZXdDaGlsZC5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0bmV3Q2hpbGQuaW5zZXJ0ZWQgPSBpc1ZOb2RlKG9sZENoaWxkKSAmJiBvbGRDaGlsZC5pbnNlcnRlZDtcblx0XHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH1cblx0XHRpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcblx0XHRcdHRleHRVcGRhdGVkID0gdXBkYXRlRG9tKG9sZENoaWxkLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHwgdGV4dFVwZGF0ZWQ7XG5cdFx0XHRvbGRJbmRleCsrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmaW5kT2xkSW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG9sZENoaWxkcmVuLCBuZXdDaGlsZCwgb2xkSW5kZXggKyAxKTtcblx0XHRcdGlmIChmaW5kT2xkSW5kZXggPj0gMCkge1xuXHRcdFx0XHRmb3IgKGkgPSBvbGRJbmRleDsgaSA8IGZpbmRPbGRJbmRleDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkQ2hpbGQgPSBvbGRDaGlsZHJlbltpXTtcblx0XHRcdFx0XHRjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdFx0XHRjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHRVcGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVEb20ob2xkQ2hpbGRyZW5bZmluZE9sZEluZGV4XSwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8XG5cdFx0XHRcdFx0dGV4dFVwZGF0ZWQ7XG5cdFx0XHRcdG9sZEluZGV4ID0gZmluZE9sZEluZGV4ICsgMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpbnNlcnRCZWZvcmU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRsZXQgY2hpbGQ6IEludGVybmFsRE5vZGUgPSBvbGRDaGlsZHJlbltvbGRJbmRleF07XG5cdFx0XHRcdGlmIChjaGlsZCkge1xuXHRcdFx0XHRcdGxldCBuZXh0SW5kZXggPSBvbGRJbmRleCArIDE7XG5cdFx0XHRcdFx0d2hpbGUgKGluc2VydEJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXNXTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNoaWxkLnJlbmRlcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5yZW5kZXJlZFswXTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGQgPSBvbGRDaGlsZHJlbltuZXh0SW5kZXhdO1xuXHRcdFx0XHRcdFx0XHRcdG5leHRJbmRleCsrO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbnNlcnRCZWZvcmUgPSBjaGlsZC5kb21Ob2RlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNyZWF0ZURvbShuZXdDaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0bm9kZUFkZGVkKG5ld0NoaWxkLCB0cmFuc2l0aW9ucyk7XG5cdFx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IG5ld0luZGV4O1xuXHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdFx0XHRjaGVja0Rpc3Rpbmd1aXNoYWJsZShuZXdDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRuZXdJbmRleCsrO1xuXHR9XG5cdGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XG5cdFx0Ly8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xuXHRcdGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qgb2xkQ2hpbGQgPSBvbGRDaGlsZHJlbltpXTtcblx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IGk7XG5cdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdH0pO1xuXHRcdFx0bm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIGFkZENoaWxkcmVuKFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0Y2hpbGRyZW46IEludGVybmFsRE5vZGVbXSB8IHVuZGVmaW5lZCxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG5cdGNoaWxkTm9kZXM/OiAoRWxlbWVudCB8IFRleHQpW11cbikge1xuXHRpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzID09PSB1bmRlZmluZWQpIHtcblx0XHRjaGlsZE5vZGVzID0gYXJyYXlGcm9tKHBhcmVudFZOb2RlLmRvbU5vZGUhLmNoaWxkTm9kZXMpIGFzIChFbGVtZW50IHwgVGV4dClbXTtcblx0fVxuXG5cdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9O1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG5cdFx0aWYgKGlzVk5vZGUoY2hpbGQpKSB7XG5cdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgY2hpbGROb2Rlcykge1xuXHRcdFx0XHRsZXQgZG9tRWxlbWVudDogRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0d2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkb21FbGVtZW50ID0gY2hpbGROb2Rlcy5zaGlmdCgpIGFzIEVsZW1lbnQ7XG5cdFx0XHRcdFx0aWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xuXHRcdFx0XHRcdFx0Y2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0ZG5vZGU6IEludGVybmFsVk5vZGUsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0YWRkQ2hpbGRyZW4oZG5vZGUsIGRub2RlLmNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIHVuZGVmaW5lZCk7XG5cdGlmICh0eXBlb2YgZG5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgZG5vZGUuaW5zZXJ0ZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG5cdHNldFByb3BlcnRpZXMoZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdH1cblx0ZG5vZGUuaW5zZXJ0ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEb20oXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0aW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdGNoaWxkTm9kZXM/OiAoRWxlbWVudCB8IFRleHQpW11cbikge1xuXHRsZXQgZG9tTm9kZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQ7XG5cdGlmIChpc1dOb2RlKGRub2RlKSkge1xuXHRcdGxldCB7IHdpZGdldENvbnN0cnVjdG9yIH0gPSBkbm9kZTtcblx0XHRjb25zdCBwYXJlbnRJbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRpZiAoIWlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPih3aWRnZXRDb25zdHJ1Y3RvcikpIHtcblx0XHRcdGNvbnN0IGl0ZW0gPSBwYXJlbnRJbnN0YW5jZURhdGEucmVnaXN0cnkoKS5nZXQ8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KHdpZGdldENvbnN0cnVjdG9yKTtcblx0XHRcdGlmIChpdGVtID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHdpZGdldENvbnN0cnVjdG9yID0gaXRlbTtcblx0XHR9XG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBuZXcgd2lkZ2V0Q29uc3RydWN0b3IoKTtcblx0XHRkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xuXHRcdFx0XHRjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSkhO1xuXHRcdFx0XHRyZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCB9KTtcblx0XHRcdFx0c2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XG5cdFx0aW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcblx0XHRpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xuXHRcdGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcblx0XHRjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcblx0XHRpZiAocmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG5cdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XG5cdFx0XHRhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0XHRpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGUsIHBhcmVudFZOb2RlIH0pO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25BdHRhY2goKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50O1xuXHRcdFx0cHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gdW5kZWZpbmVkO1xuXHRcdFx0aW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlISwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGRvYyA9IHBhcmVudFZOb2RlLmRvbU5vZGUhLm93bmVyRG9jdW1lbnQ7XG5cdFx0aWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkICYmIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRjb25zdCBuZXdEb21Ob2RlID0gZG5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQhKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlIS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG5vZGUuZG9tTm9kZSk7XG5cdFx0XHRcdGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlIS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlIS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZG5vZGUuZG9tTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmIChkbm9kZS50YWcgPT09ICdzdmcnKSB7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMgPSB7IC4uLnByb2plY3Rpb25PcHRpb25zLCAuLi57IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9IH07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlRWxlbWVudE5TKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSwgZG5vZGUudGFnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgfHwgZG9jLmNyZWF0ZUVsZW1lbnQoZG5vZGUudGFnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGU7XG5cdFx0XHR9XG5cdFx0XHRpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUhIGFzIEVsZW1lbnQsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0aWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuXHRcdFx0fSBlbHNlIGlmIChkb21Ob2RlIS5wYXJlbnROb2RlICE9PSBwYXJlbnRWTm9kZS5kb21Ob2RlISkge1xuXHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlIS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlRG9tKFxuXHRwcmV2aW91czogYW55LFxuXHRkbm9kZTogSW50ZXJuYWxETm9kZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pIHtcblx0aWYgKGlzV05vZGUoZG5vZGUpKSB7XG5cdFx0Y29uc3QgeyBpbnN0YW5jZSB9ID0gcHJldmlvdXM7XG5cdFx0aWYgKGluc3RhbmNlKSB7XG5cdFx0XHRjb25zdCB7IHBhcmVudFZOb2RlLCBkbm9kZTogbm9kZSB9ID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0XHRjb25zdCBwcmV2aW91c1JlbmRlcmVkID0gbm9kZSA/IG5vZGUucmVuZGVyZWQgOiBwcmV2aW91cy5yZW5kZXJlZDtcblx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XG5cdFx0XHRpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcblx0XHRcdGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xuXHRcdFx0ZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcblx0XHRcdGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG5cdFx0XHRpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xuXHRcdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcblx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xuXHRcdFx0fVxuXHRcdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAocHJldmlvdXMgPT09IGRub2RlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnN0IGRvbU5vZGUgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xuXHRcdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHRcdGxldCB1cGRhdGVkID0gZmFsc2U7XG5cdFx0aWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRpZiAoZG5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xuXHRcdFx0XHRjb25zdCBuZXdEb21Ob2RlID0gZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQhKTtcblx0XHRcdFx0ZG9tTm9kZS5wYXJlbnROb2RlIS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG9tTm9kZSk7XG5cdFx0XHRcdGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xuXHRcdFx0XHR0ZXh0VXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybiB0ZXh0VXBkYXRlZDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSB9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZpb3VzLmNoaWxkcmVuICE9PSBkbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0ZG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdFx0dXBkYXRlZCA9XG5cdFx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVkID0gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcblxuXHRcdFx0aWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh1cGRhdGVkICYmIGRub2RlLnByb3BlcnRpZXMgJiYgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24pIHtcblx0XHRcdGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKGRvbU5vZGUgYXMgRWxlbWVudCwgZG5vZGUucHJvcGVydGllcywgcHJldmlvdXMucHJvcGVydGllcyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZERlZmVycmVkUHJvcGVydGllcyh2bm9kZTogSW50ZXJuYWxWTm9kZSwgcHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdC8vIHRyYW5zZmVyIGFueSBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBiZWVuIHBhc3NlZCAtIGFzIHRoZXNlIG11c3QgYmUgZGVjb3JhdGVkIHByb3BlcnRpZXNcblx0dm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzID0gdm5vZGUucHJvcGVydGllcztcblx0Y29uc3QgcHJvcGVydGllcyA9IHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrISghIXZub2RlLmluc2VydGVkKTtcblx0dm5vZGUucHJvcGVydGllcyA9IHsgLi4ucHJvcGVydGllcywgLi4udm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzIH07XG5cdHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSB7XG5cdFx0XHQuLi52bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayEoISF2bm9kZS5pbnNlcnRlZCksXG5cdFx0XHQuLi52bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXNcblx0XHR9O1xuXHRcdHVwZGF0ZVByb3BlcnRpZXModm5vZGUuZG9tTm9kZSEgYXMgRWxlbWVudCwgdm5vZGUucHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdHZub2RlLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcblx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAoZ2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2spIHtcblx0XHRcdGdsb2JhbC5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdH0gZWxzZSBpZiAocHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID09PSB1bmRlZmluZWQpIHtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPSBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG5cdGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKSE7XG5cdGNvbnN0IHJlbmRlcnMgPSBbLi4ucmVuZGVyUXVldWVdO1xuXHRyZW5kZXJRdWV1ZU1hcC5zZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UsIFtdKTtcblx0cmVuZGVycy5zb3J0KChhLCBiKSA9PiBhLmRlcHRoIC0gYi5kZXB0aCk7XG5cblx0d2hpbGUgKHJlbmRlcnMubGVuZ3RoKSB7XG5cdFx0Y29uc3QgeyBpbnN0YW5jZSB9ID0gcmVuZGVycy5zaGlmdCgpITtcblx0XHRjb25zdCB7IHBhcmVudFZOb2RlLCBkbm9kZSB9ID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0dXBkYXRlRG9tKGRub2RlLCB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSksIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xuXHR9XG5cdHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcblx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xufVxuXG5leHBvcnQgY29uc3QgZG9tID0ge1xuXHRhcHBlbmQ6IGZ1bmN0aW9uKFxuXHRcdHBhcmVudE5vZGU6IEVsZW1lbnQsXG5cdFx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRcdHByb2plY3Rpb25PcHRpb25zOiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPiA9IHt9XG5cdCk6IFByb2plY3Rpb24ge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZSk7XG5cblx0XHRmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xuXHRcdGNvbnN0IHBhcmVudFZOb2RlID0gdG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpO1xuXHRcdGNvbnN0IG5vZGUgPSB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSk7XG5cdFx0Y29uc3QgcmVuZGVyUXVldWU6IFJlbmRlclF1ZXVlW10gPSBbXTtcblx0XHRpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGU6IG5vZGUsIHBhcmVudFZOb2RlIH0pO1xuXHRcdHJlbmRlclF1ZXVlTWFwLnNldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UsIHJlbmRlclF1ZXVlKTtcblx0XHRpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9ICgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XG5cdFx0XHRpZiAoaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcblx0XHRcdFx0Y29uc3QgcmVuZGVyUXVldWUgPSByZW5kZXJRdWV1ZU1hcC5nZXQoZmluYWxQcm9qZWN0b3JPcHRpb25zLnByb2plY3Rvckluc3RhbmNlKSE7XG5cdFx0XHRcdHJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZSwgZGVwdGg6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5kZXB0aCB9KTtcblx0XHRcdFx0c2NoZWR1bGVSZW5kZXIoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHVwZGF0ZURvbShub2RlLCBub2RlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkb21Ob2RlOiBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGVcblx0XHR9O1xuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSwgcHJvamVjdGlvbk9wdGlvbnM/OiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPik6IFByb2plY3Rpb24ge1xuXHRcdHJldHVybiB0aGlzLmFwcGVuZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0fSxcblx0bWVyZ2U6IGZ1bmN0aW9uKFxuXHRcdGVsZW1lbnQ6IEVsZW1lbnQsXG5cdFx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRcdHByb2plY3Rpb25PcHRpb25zOiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPiA9IHt9XG5cdCk6IFByb2plY3Rpb24ge1xuXHRcdHByb2plY3Rpb25PcHRpb25zLm1lcmdlID0gdHJ1ZTtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdHJldHVybiB0aGlzLmFwcGVuZChlbGVtZW50LnBhcmVudE5vZGUgYXMgRWxlbWVudCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0fVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB2ZG9tLnRzIiwiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xudmFyIHdpZGdldEZhY3RvcnkgPSByZXF1aXJlKFwic3JjL21lbnUvTWVudVwiKTtcblxudmFyIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudCA9IHJlcXVpcmUoJ0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudCcpLmRlZmF1bHQ7XG5cbnZhciBkZWZhdWx0RXhwb3J0ID0gd2lkZ2V0RmFjdG9yeS5kZWZhdWx0O1xuZGVmYXVsdEV4cG9ydCAmJiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVmYXVsdEV4cG9ydCk7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51L01lbnUhLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvKiFcbiAqIFBFUCB2MC40LjMgfCBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L1BFUFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgfCBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLlBvaW50ZXJFdmVudHNQb2x5ZmlsbCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBjb25zdHJ1Y3RvciBmb3IgbmV3IFBvaW50ZXJFdmVudHMuXG4gICAqXG4gICAqIE5ldyBQb2ludGVyIEV2ZW50cyBtdXN0IGJlIGdpdmVuIGEgdHlwZSwgYW5kIGFuIG9wdGlvbmFsIGRpY3Rpb25hcnkgb2ZcbiAgICogaW5pdGlhbGl6YXRpb24gcHJvcGVydGllcy5cbiAgICpcbiAgICogRHVlIHRvIGNlcnRhaW4gcGxhdGZvcm0gcmVxdWlyZW1lbnRzLCBldmVudHMgcmV0dXJuZWQgZnJvbSB0aGUgY29uc3RydWN0b3JcbiAgICogaWRlbnRpZnkgYXMgTW91c2VFdmVudHMuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5UeXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbaW5EaWN0XSBBbiBvcHRpb25hbCBkaWN0aW9uYXJ5IG9mIGluaXRpYWwgZXZlbnQgcHJvcGVydGllcy5cbiAgICogQHJldHVybiB7RXZlbnR9IEEgbmV3IFBvaW50ZXJFdmVudCBvZiB0eXBlIGBpblR5cGVgLCBpbml0aWFsaXplZCB3aXRoIHByb3BlcnRpZXMgZnJvbSBgaW5EaWN0YC5cbiAgICovXG4gIHZhciBNT1VTRV9QUk9QUyA9IFtcbiAgICAnYnViYmxlcycsXG4gICAgJ2NhbmNlbGFibGUnLFxuICAgICd2aWV3JyxcbiAgICAnZGV0YWlsJyxcbiAgICAnc2NyZWVuWCcsXG4gICAgJ3NjcmVlblknLFxuICAgICdjbGllbnRYJyxcbiAgICAnY2xpZW50WScsXG4gICAgJ2N0cmxLZXknLFxuICAgICdhbHRLZXknLFxuICAgICdzaGlmdEtleScsXG4gICAgJ21ldGFLZXknLFxuICAgICdidXR0b24nLFxuICAgICdyZWxhdGVkVGFyZ2V0JyxcbiAgICAncGFnZVgnLFxuICAgICdwYWdlWSdcbiAgXTtcblxuICB2YXIgTU9VU0VfREVGQVVMVFMgPSBbXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgbnVsbCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgMCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMFxuICBdO1xuXG4gIGZ1bmN0aW9uIFBvaW50ZXJFdmVudChpblR5cGUsIGluRGljdCkge1xuICAgIGluRGljdCA9IGluRGljdCB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBlLmluaXRFdmVudChpblR5cGUsIGluRGljdC5idWJibGVzIHx8IGZhbHNlLCBpbkRpY3QuY2FuY2VsYWJsZSB8fCBmYWxzZSk7XG5cbiAgICAvLyBkZWZpbmUgaW5oZXJpdGVkIE1vdXNlRXZlbnQgcHJvcGVydGllc1xuICAgIC8vIHNraXAgYnViYmxlcyBhbmQgY2FuY2VsYWJsZSBzaW5jZSB0aGV5J3JlIHNldCBhYm92ZSBpbiBpbml0RXZlbnQoKVxuICAgIGZvciAodmFyIGkgPSAyLCBwOyBpIDwgTU9VU0VfUFJPUFMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHAgPSBNT1VTRV9QUk9QU1tpXTtcbiAgICAgIGVbcF0gPSBpbkRpY3RbcF0gfHwgTU9VU0VfREVGQVVMVFNbaV07XG4gICAgfVxuICAgIGUuYnV0dG9ucyA9IGluRGljdC5idXR0b25zIHx8IDA7XG5cbiAgICAvLyBTcGVjIHJlcXVpcmVzIHRoYXQgcG9pbnRlcnMgd2l0aG91dCBwcmVzc3VyZSBzcGVjaWZpZWQgdXNlIDAuNSBmb3IgZG93blxuICAgIC8vIHN0YXRlIGFuZCAwIGZvciB1cCBzdGF0ZS5cbiAgICB2YXIgcHJlc3N1cmUgPSAwO1xuXG4gICAgaWYgKGluRGljdC5wcmVzc3VyZSAmJiBlLmJ1dHRvbnMpIHtcbiAgICAgIHByZXNzdXJlID0gaW5EaWN0LnByZXNzdXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVzc3VyZSA9IGUuYnV0dG9ucyA/IDAuNSA6IDA7XG4gICAgfVxuXG4gICAgLy8gYWRkIHgveSBwcm9wZXJ0aWVzIGFsaWFzZWQgdG8gY2xpZW50WC9ZXG4gICAgZS54ID0gZS5jbGllbnRYO1xuICAgIGUueSA9IGUuY2xpZW50WTtcblxuICAgIC8vIGRlZmluZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgUG9pbnRlckV2ZW50IGludGVyZmFjZVxuICAgIGUucG9pbnRlcklkID0gaW5EaWN0LnBvaW50ZXJJZCB8fCAwO1xuICAgIGUud2lkdGggPSBpbkRpY3Qud2lkdGggfHwgMDtcbiAgICBlLmhlaWdodCA9IGluRGljdC5oZWlnaHQgfHwgMDtcbiAgICBlLnByZXNzdXJlID0gcHJlc3N1cmU7XG4gICAgZS50aWx0WCA9IGluRGljdC50aWx0WCB8fCAwO1xuICAgIGUudGlsdFkgPSBpbkRpY3QudGlsdFkgfHwgMDtcbiAgICBlLnR3aXN0ID0gaW5EaWN0LnR3aXN0IHx8IDA7XG4gICAgZS50YW5nZW50aWFsUHJlc3N1cmUgPSBpbkRpY3QudGFuZ2VudGlhbFByZXNzdXJlIHx8IDA7XG4gICAgZS5wb2ludGVyVHlwZSA9IGluRGljdC5wb2ludGVyVHlwZSB8fCAnJztcbiAgICBlLmh3VGltZXN0YW1wID0gaW5EaWN0Lmh3VGltZXN0YW1wIHx8IDA7XG4gICAgZS5pc1ByaW1hcnkgPSBpbkRpY3QuaXNQcmltYXJ5IHx8IGZhbHNlO1xuICAgIHJldHVybiBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGltcGxlbWVudHMgYSBtYXAgb2YgcG9pbnRlciBzdGF0ZXNcbiAgICovXG4gIHZhciBVU0VfTUFQID0gd2luZG93Lk1hcCAmJiB3aW5kb3cuTWFwLnByb3RvdHlwZS5mb3JFYWNoO1xuICB2YXIgUG9pbnRlck1hcCA9IFVTRV9NQVAgPyBNYXAgOiBTcGFyc2VBcnJheU1hcDtcblxuICBmdW5jdGlvbiBTcGFyc2VBcnJheU1hcCgpIHtcbiAgICB0aGlzLmFycmF5ID0gW107XG4gICAgdGhpcy5zaXplID0gMDtcbiAgfVxuXG4gIFNwYXJzZUFycmF5TWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsZXRlKGspO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgIH1cbiAgICAgIHRoaXMuYXJyYXlba10gPSB2O1xuICAgIH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheVtrXSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrKSB7XG4gICAgICBpZiAodGhpcy5oYXMoaykpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuYXJyYXlba107XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheVtrXTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgfSxcblxuICAgIC8vIHJldHVybiB2YWx1ZSwga2V5LCBtYXBcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdiwgaywgdGhpcyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIENMT05FX1BST1BTID0gW1xuXG4gICAgLy8gTW91c2VFdmVudFxuICAgICdidWJibGVzJyxcbiAgICAnY2FuY2VsYWJsZScsXG4gICAgJ3ZpZXcnLFxuICAgICdkZXRhaWwnLFxuICAgICdzY3JlZW5YJyxcbiAgICAnc2NyZWVuWScsXG4gICAgJ2NsaWVudFgnLFxuICAgICdjbGllbnRZJyxcbiAgICAnY3RybEtleScsXG4gICAgJ2FsdEtleScsXG4gICAgJ3NoaWZ0S2V5JyxcbiAgICAnbWV0YUtleScsXG4gICAgJ2J1dHRvbicsXG4gICAgJ3JlbGF0ZWRUYXJnZXQnLFxuXG4gICAgLy8gRE9NIExldmVsIDNcbiAgICAnYnV0dG9ucycsXG5cbiAgICAvLyBQb2ludGVyRXZlbnRcbiAgICAncG9pbnRlcklkJyxcbiAgICAnd2lkdGgnLFxuICAgICdoZWlnaHQnLFxuICAgICdwcmVzc3VyZScsXG4gICAgJ3RpbHRYJyxcbiAgICAndGlsdFknLFxuICAgICdwb2ludGVyVHlwZScsXG4gICAgJ2h3VGltZXN0YW1wJyxcbiAgICAnaXNQcmltYXJ5JyxcblxuICAgIC8vIGV2ZW50IGluc3RhbmNlXG4gICAgJ3R5cGUnLFxuICAgICd0YXJnZXQnLFxuICAgICdjdXJyZW50VGFyZ2V0JyxcbiAgICAnd2hpY2gnLFxuICAgICdwYWdlWCcsXG4gICAgJ3BhZ2VZJyxcbiAgICAndGltZVN0YW1wJ1xuICBdO1xuXG4gIHZhciBDTE9ORV9ERUZBVUxUUyA9IFtcblxuICAgIC8vIE1vdXNlRXZlbnRcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICAwLFxuICAgIG51bGwsXG5cbiAgICAvLyBET00gTGV2ZWwgM1xuICAgIDAsXG5cbiAgICAvLyBQb2ludGVyRXZlbnRcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAnJyxcbiAgICAwLFxuICAgIGZhbHNlLFxuXG4gICAgLy8gZXZlbnQgaW5zdGFuY2VcbiAgICAnJyxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMFxuICBdO1xuXG4gIHZhciBCT1VOREFSWV9FVkVOVFMgPSB7XG4gICAgJ3BvaW50ZXJvdmVyJzogMSxcbiAgICAncG9pbnRlcm91dCc6IDEsXG4gICAgJ3BvaW50ZXJlbnRlcic6IDEsXG4gICAgJ3BvaW50ZXJsZWF2ZSc6IDFcbiAgfTtcblxuICB2YXIgSEFTX1NWR19JTlNUQU5DRSA9ICh0eXBlb2YgU1ZHRWxlbWVudEluc3RhbmNlICE9PSAndW5kZWZpbmVkJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGlzIGZvciBub3JtYWxpemluZyBldmVudHMuIE1vdXNlIGFuZCBUb3VjaCBldmVudHMgd2lsbCBiZVxuICAgKiBjb2xsZWN0ZWQgaGVyZSwgYW5kIGZpcmUgUG9pbnRlckV2ZW50cyB0aGF0IGhhdmUgdGhlIHNhbWUgc2VtYW50aWNzLCBub1xuICAgKiBtYXR0ZXIgdGhlIHNvdXJjZS5cbiAgICogRXZlbnRzIGZpcmVkOlxuICAgKiAgIC0gcG9pbnRlcmRvd246IGEgcG9pbnRpbmcgaXMgYWRkZWRcbiAgICogICAtIHBvaW50ZXJ1cDogYSBwb2ludGVyIGlzIHJlbW92ZWRcbiAgICogICAtIHBvaW50ZXJtb3ZlOiBhIHBvaW50ZXIgaXMgbW92ZWRcbiAgICogICAtIHBvaW50ZXJvdmVyOiBhIHBvaW50ZXIgY3Jvc3NlcyBpbnRvIGFuIGVsZW1lbnRcbiAgICogICAtIHBvaW50ZXJvdXQ6IGEgcG9pbnRlciBsZWF2ZXMgYW4gZWxlbWVudFxuICAgKiAgIC0gcG9pbnRlcmNhbmNlbDogYSBwb2ludGVyIHdpbGwgbm8gbG9uZ2VyIGdlbmVyYXRlIGV2ZW50c1xuICAgKi9cbiAgdmFyIGRpc3BhdGNoZXIgPSB7XG4gICAgcG9pbnRlcm1hcDogbmV3IFBvaW50ZXJNYXAoKSxcbiAgICBldmVudE1hcDogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICBjYXB0dXJlSW5mbzogT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAgIC8vIFNjb3BlIG9iamVjdHMgZm9yIG5hdGl2ZSBldmVudHMuXG4gICAgLy8gVGhpcyBleGlzdHMgZm9yIGVhc2Ugb2YgdGVzdGluZy5cbiAgICBldmVudFNvdXJjZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgZXZlbnRTb3VyY2VMaXN0OiBbXSxcbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgZXZlbnQgc291cmNlIHRoYXQgd2lsbCBnZW5lcmF0ZSBwb2ludGVyIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIGBpblNvdXJjZWAgbXVzdCBjb250YWluIGFuIGFycmF5IG9mIGV2ZW50IG5hbWVzIG5hbWVkIGBldmVudHNgLCBhbmRcbiAgICAgKiBmdW5jdGlvbnMgd2l0aCB0aGUgbmFtZXMgc3BlY2lmaWVkIGluIHRoZSBgZXZlbnRzYCBhcnJheS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgZm9yIHRoZSBldmVudCBzb3VyY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIEEgbmV3IHNvdXJjZSBvZiBwbGF0Zm9ybSBldmVudHMuXG4gICAgICovXG4gICAgcmVnaXN0ZXJTb3VyY2U6IGZ1bmN0aW9uKG5hbWUsIHNvdXJjZSkge1xuICAgICAgdmFyIHMgPSBzb3VyY2U7XG4gICAgICB2YXIgbmV3RXZlbnRzID0gcy5ldmVudHM7XG4gICAgICBpZiAobmV3RXZlbnRzKSB7XG4gICAgICAgIG5ld0V2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoc1tlXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudE1hcFtlXSA9IHNbZV0uYmluZChzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLmV2ZW50U291cmNlc1tuYW1lXSA9IHM7XG4gICAgICAgIHRoaXMuZXZlbnRTb3VyY2VMaXN0LnB1c2gocyk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGwgPSB0aGlzLmV2ZW50U291cmNlTGlzdC5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMCwgZXM7IChpIDwgbCkgJiYgKGVzID0gdGhpcy5ldmVudFNvdXJjZUxpc3RbaV0pOyBpKyspIHtcblxuICAgICAgICAvLyBjYWxsIGV2ZW50c291cmNlIHJlZ2lzdGVyXG4gICAgICAgIGVzLnJlZ2lzdGVyLmNhbGwoZXMsIGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGwgPSB0aGlzLmV2ZW50U291cmNlTGlzdC5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMCwgZXM7IChpIDwgbCkgJiYgKGVzID0gdGhpcy5ldmVudFNvdXJjZUxpc3RbaV0pOyBpKyspIHtcblxuICAgICAgICAvLyBjYWxsIGV2ZW50c291cmNlIHJlZ2lzdGVyXG4gICAgICAgIGVzLnVucmVnaXN0ZXIuY2FsbChlcywgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb250YWluczogLypzY29wZS5leHRlcm5hbC5jb250YWlucyB8fCAqL2Z1bmN0aW9uKGNvbnRhaW5lciwgY29udGFpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLmNvbnRhaW5zKGNvbnRhaW5lZCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuXG4gICAgICAgIC8vIG1vc3QgbGlrZWx5OiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0yMDg0MjdcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBFVkVOVFNcbiAgICBkb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJkb3duJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJtb3ZlJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICB1cDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVydXAnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGVudGVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyZW50ZXInLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGxlYXZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVybGVhdmUnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG92ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcm92ZXInLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG91dDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyb3V0JywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmNhbmNlbCcsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgbGVhdmVPdXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm91dChldmVudCk7XG4gICAgICB0aGlzLnByb3BhZ2F0ZShldmVudCwgdGhpcy5sZWF2ZSwgZmFsc2UpO1xuICAgIH0sXG4gICAgZW50ZXJPdmVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5vdmVyKGV2ZW50KTtcbiAgICAgIHRoaXMucHJvcGFnYXRlKGV2ZW50LCB0aGlzLmVudGVyLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLy8gTElTVEVORVIgTE9HSUNcbiAgICBldmVudEhhbmRsZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcblxuICAgICAgLy8gVGhpcyBpcyB1c2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgZGlzcGF0Y2ggb2YgcG9pbnRlcmV2ZW50cyBmcm9tXG4gICAgICAvLyBwbGF0Zm9ybSBldmVudHMuIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHR3byBlbGVtZW50cyBpbiBkaWZmZXJlbnQgc2NvcGVzXG4gICAgICAvLyBhcmUgc2V0IHVwIHRvIGNyZWF0ZSBwb2ludGVyIGV2ZW50cywgd2hpY2ggaXMgcmVsZXZhbnQgdG8gU2hhZG93IERPTS5cbiAgICAgIGlmIChpbkV2ZW50Ll9oYW5kbGVkQnlQRSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdHlwZSA9IGluRXZlbnQudHlwZTtcbiAgICAgIHZhciBmbiA9IHRoaXMuZXZlbnRNYXAgJiYgdGhpcy5ldmVudE1hcFt0eXBlXTtcbiAgICAgIGlmIChmbikge1xuICAgICAgICBmbihpbkV2ZW50KTtcbiAgICAgIH1cbiAgICAgIGluRXZlbnQuX2hhbmRsZWRCeVBFID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gc2V0IHVwIGV2ZW50IGxpc3RlbmVyc1xuICAgIGxpc3RlbjogZnVuY3Rpb24odGFyZ2V0LCBldmVudHMpIHtcbiAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudCh0YXJnZXQsIGUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcbiAgICB1bmxpc3RlbjogZnVuY3Rpb24odGFyZ2V0LCBldmVudHMpIHtcbiAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudCh0YXJnZXQsIGUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBhZGRFdmVudDogLypzY29wZS5leHRlcm5hbC5hZGRFdmVudCB8fCAqL2Z1bmN0aW9uKHRhcmdldCwgZXZlbnROYW1lKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuYm91bmRIYW5kbGVyKTtcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLnJlbW92ZUV2ZW50IHx8ICovZnVuY3Rpb24odGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5ib3VuZEhhbmRsZXIpO1xuICAgIH0sXG5cbiAgICAvLyBFVkVOVCBDUkVBVElPTiBBTkQgVFJBQ0tJTkdcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IEV2ZW50IG9mIHR5cGUgYGluVHlwZWAsIGJhc2VkIG9uIHRoZSBpbmZvcm1hdGlvbiBpblxuICAgICAqIGBpbkV2ZW50YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpblR5cGUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0eXBlIG9mIGV2ZW50IHRvIGNyZWF0ZVxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgQSBwbGF0Zm9ybSBldmVudCB3aXRoIGEgdGFyZ2V0XG4gICAgICogQHJldHVybiB7RXZlbnR9IEEgUG9pbnRlckV2ZW50IG9mIHR5cGUgYGluVHlwZWBcbiAgICAgKi9cbiAgICBtYWtlRXZlbnQ6IGZ1bmN0aW9uKGluVHlwZSwgaW5FdmVudCkge1xuXG4gICAgICAvLyByZWxhdGVkVGFyZ2V0IG11c3QgYmUgbnVsbCBpZiBwb2ludGVyIGlzIGNhcHR1cmVkXG4gICAgICBpZiAodGhpcy5jYXB0dXJlSW5mb1tpbkV2ZW50LnBvaW50ZXJJZF0pIHtcbiAgICAgICAgaW5FdmVudC5yZWxhdGVkVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBlID0gbmV3IFBvaW50ZXJFdmVudChpblR5cGUsIGluRXZlbnQpO1xuICAgICAgaWYgKGluRXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA9IGluRXZlbnQucHJldmVudERlZmF1bHQ7XG4gICAgICB9XG4gICAgICBlLl90YXJnZXQgPSBlLl90YXJnZXQgfHwgaW5FdmVudC50YXJnZXQ7XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuXG4gICAgLy8gbWFrZSBhbmQgZGlzcGF0Y2ggYW4gZXZlbnQgaW4gb25lIGNhbGxcbiAgICBmaXJlRXZlbnQ6IGZ1bmN0aW9uKGluVHlwZSwgaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLm1ha2VFdmVudChpblR5cGUsIGluRXZlbnQpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzbmFwc2hvdCBvZiBpbkV2ZW50LCB3aXRoIHdyaXRhYmxlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBpbkV2ZW50IEFuIGV2ZW50IHRoYXQgY29udGFpbnMgcHJvcGVydGllcyB0byBjb3B5LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgc2hhbGxvdyBjb3BpZXMgb2YgYGluRXZlbnRgJ3NcbiAgICAgKiAgICBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIGNsb25lRXZlbnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBldmVudENvcHkgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgdmFyIHA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENMT05FX1BST1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHAgPSBDTE9ORV9QUk9QU1tpXTtcbiAgICAgICAgZXZlbnRDb3B5W3BdID0gaW5FdmVudFtwXSB8fCBDTE9ORV9ERUZBVUxUU1tpXTtcblxuICAgICAgICAvLyBXb3JrIGFyb3VuZCBTVkdJbnN0YW5jZUVsZW1lbnQgc2hhZG93IHRyZWVcbiAgICAgICAgLy8gUmV0dXJuIHRoZSA8dXNlPiBlbGVtZW50IHRoYXQgaXMgcmVwcmVzZW50ZWQgYnkgdGhlIGluc3RhbmNlIGZvciBTYWZhcmksIENocm9tZSwgSUUuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGJlaGF2aW9yIGltcGxlbWVudGVkIGJ5IEZpcmVmb3guXG4gICAgICAgIGlmIChIQVNfU1ZHX0lOU1RBTkNFICYmIChwID09PSAndGFyZ2V0JyB8fCBwID09PSAncmVsYXRlZFRhcmdldCcpKSB7XG4gICAgICAgICAgaWYgKGV2ZW50Q29weVtwXSBpbnN0YW5jZW9mIFNWR0VsZW1lbnRJbnN0YW5jZSkge1xuICAgICAgICAgICAgZXZlbnRDb3B5W3BdID0gZXZlbnRDb3B5W3BdLmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBrZWVwIHRoZSBzZW1hbnRpY3Mgb2YgcHJldmVudERlZmF1bHRcbiAgICAgIGlmIChpbkV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgIGV2ZW50Q29weS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGluRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudENvcHk7XG4gICAgfSxcbiAgICBnZXRUYXJnZXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBjYXB0dXJlID0gdGhpcy5jYXB0dXJlSW5mb1tpbkV2ZW50LnBvaW50ZXJJZF07XG4gICAgICBpZiAoIWNhcHR1cmUpIHtcbiAgICAgICAgcmV0dXJuIGluRXZlbnQuX3RhcmdldDtcbiAgICAgIH1cbiAgICAgIGlmIChpbkV2ZW50Ll90YXJnZXQgPT09IGNhcHR1cmUgfHwgIShpbkV2ZW50LnR5cGUgaW4gQk9VTkRBUllfRVZFTlRTKSkge1xuICAgICAgICByZXR1cm4gY2FwdHVyZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHByb3BhZ2F0ZTogZnVuY3Rpb24oZXZlbnQsIGZuLCBwcm9wYWdhdGVEb3duKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgdmFyIHRhcmdldHMgPSBbXTtcblxuICAgICAgLy8gT3JkZXIgb2YgY29uZGl0aW9ucyBkdWUgdG8gZG9jdW1lbnQuY29udGFpbnMoKSBtaXNzaW5nIGluIElFLlxuICAgICAgd2hpbGUgKHRhcmdldCAhPT0gZG9jdW1lbnQgJiYgIXRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cbiAgICAgICAgLy8gVG91Y2g6IERvIG5vdCBwcm9wYWdhdGUgaWYgbm9kZSBpcyBkZXRhY2hlZC5cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wYWdhdGVEb3duKSB7XG4gICAgICAgIHRhcmdldHMucmV2ZXJzZSgpO1xuICAgICAgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICBldmVudC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZXRDYXB0dXJlOiBmdW5jdGlvbihpblBvaW50ZXJJZCwgaW5UYXJnZXQsIHNraXBEaXNwYXRjaCkge1xuICAgICAgaWYgKHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNhcHR1cmUoaW5Qb2ludGVySWQsIHNraXBEaXNwYXRjaCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdID0gaW5UYXJnZXQ7XG4gICAgICB0aGlzLmltcGxpY2l0UmVsZWFzZSA9IHRoaXMucmVsZWFzZUNhcHR1cmUuYmluZCh0aGlzLCBpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG5cbiAgICAgIHZhciBlID0gbmV3IFBvaW50ZXJFdmVudCgnZ290cG9pbnRlcmNhcHR1cmUnKTtcbiAgICAgIGUucG9pbnRlcklkID0gaW5Qb2ludGVySWQ7XG4gICAgICBlLl90YXJnZXQgPSBpblRhcmdldDtcblxuICAgICAgaWYgKCFza2lwRGlzcGF0Y2gpIHtcbiAgICAgICAgdGhpcy5hc3luY0Rpc3BhdGNoRXZlbnQoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWxlYXNlQ2FwdHVyZTogZnVuY3Rpb24oaW5Qb2ludGVySWQsIHNraXBEaXNwYXRjaCkge1xuICAgICAgdmFyIHQgPSB0aGlzLmNhcHR1cmVJbmZvW2luUG9pbnRlcklkXTtcbiAgICAgIGlmICghdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdID0gdW5kZWZpbmVkO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcblxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KCdsb3N0cG9pbnRlcmNhcHR1cmUnKTtcbiAgICAgIGUucG9pbnRlcklkID0gaW5Qb2ludGVySWQ7XG4gICAgICBlLl90YXJnZXQgPSB0O1xuXG4gICAgICBpZiAoIXNraXBEaXNwYXRjaCkge1xuICAgICAgICB0aGlzLmFzeW5jRGlzcGF0Y2hFdmVudChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXMgdGhlIGV2ZW50IHRvIGl0cyB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBpbkV2ZW50IFRoZSBldmVudCB0byBiZSBkaXNwYXRjaGVkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYW4gZXZlbnQgaGFuZGxlciByZXR1cm5zIHRydWUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBkaXNwYXRjaEV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLmRpc3BhdGNoRXZlbnQgfHwgKi9mdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgdCA9IHRoaXMuZ2V0VGFyZ2V0KGluRXZlbnQpO1xuICAgICAgaWYgKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuZGlzcGF0Y2hFdmVudChpbkV2ZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jRGlzcGF0Y2hFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZGlzcGF0Y2hFdmVudC5iaW5kKHRoaXMsIGluRXZlbnQpKTtcbiAgICB9XG4gIH07XG4gIGRpc3BhdGNoZXIuYm91bmRIYW5kbGVyID0gZGlzcGF0Y2hlci5ldmVudEhhbmRsZXIuYmluZChkaXNwYXRjaGVyKTtcblxuICB2YXIgdGFyZ2V0aW5nID0ge1xuICAgIHNoYWRvdzogZnVuY3Rpb24oaW5FbCkge1xuICAgICAgaWYgKGluRWwpIHtcbiAgICAgICAgcmV0dXJuIGluRWwuc2hhZG93Um9vdCB8fCBpbkVsLndlYmtpdFNoYWRvd1Jvb3Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYW5UYXJnZXQ6IGZ1bmN0aW9uKHNoYWRvdykge1xuICAgICAgcmV0dXJuIHNoYWRvdyAmJiBCb29sZWFuKHNoYWRvdy5lbGVtZW50RnJvbVBvaW50KTtcbiAgICB9LFxuICAgIHRhcmdldGluZ1NoYWRvdzogZnVuY3Rpb24oaW5FbCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnNoYWRvdyhpbkVsKTtcbiAgICAgIGlmICh0aGlzLmNhblRhcmdldChzKSkge1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH1cbiAgICB9LFxuICAgIG9sZGVyU2hhZG93OiBmdW5jdGlvbihzaGFkb3cpIHtcbiAgICAgIHZhciBvcyA9IHNoYWRvdy5vbGRlclNoYWRvd1Jvb3Q7XG4gICAgICBpZiAoIW9zKSB7XG4gICAgICAgIHZhciBzZSA9IHNoYWRvdy5xdWVyeVNlbGVjdG9yKCdzaGFkb3cnKTtcbiAgICAgICAgaWYgKHNlKSB7XG4gICAgICAgICAgb3MgPSBzZS5vbGRlclNoYWRvd1Jvb3Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvcztcbiAgICB9LFxuICAgIGFsbFNoYWRvd3M6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBzaGFkb3dzID0gW107XG4gICAgICB2YXIgcyA9IHRoaXMuc2hhZG93KGVsZW1lbnQpO1xuICAgICAgd2hpbGUgKHMpIHtcbiAgICAgICAgc2hhZG93cy5wdXNoKHMpO1xuICAgICAgICBzID0gdGhpcy5vbGRlclNoYWRvdyhzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaGFkb3dzO1xuICAgIH0sXG4gICAgc2VhcmNoUm9vdDogZnVuY3Rpb24oaW5Sb290LCB4LCB5KSB7XG4gICAgICBpZiAoaW5Sb290KSB7XG4gICAgICAgIHZhciB0ID0gaW5Sb290LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgIHZhciBzdCwgc3I7XG5cbiAgICAgICAgLy8gaXMgZWxlbWVudCBhIHNoYWRvdyBob3N0P1xuICAgICAgICBzciA9IHRoaXMudGFyZ2V0aW5nU2hhZG93KHQpO1xuICAgICAgICB3aGlsZSAoc3IpIHtcblxuICAgICAgICAgIC8vIGZpbmQgdGhlIHRoZSBlbGVtZW50IGluc2lkZSB0aGUgc2hhZG93IHJvb3RcbiAgICAgICAgICBzdCA9IHNyLmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgICAgaWYgKCFzdCkge1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3Igb2xkZXIgc2hhZG93c1xuICAgICAgICAgICAgc3IgPSB0aGlzLm9sZGVyU2hhZG93KHNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBzaGFkb3dlZCBlbGVtZW50IG1heSBjb250YWluIGEgc2hhZG93IHJvb3RcbiAgICAgICAgICAgIHZhciBzc3IgPSB0aGlzLnRhcmdldGluZ1NoYWRvdyhzdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hSb290KHNzciwgeCwgeSkgfHwgc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGlnaHQgZG9tIGVsZW1lbnQgaXMgdGhlIHRhcmdldFxuICAgICAgICByZXR1cm4gdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIG93bmVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgcyA9IGVsZW1lbnQ7XG5cbiAgICAgIC8vIHdhbGsgdXAgdW50aWwgeW91IGhpdCB0aGUgc2hhZG93IHJvb3Qgb3IgZG9jdW1lbnRcbiAgICAgIHdoaWxlIChzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcyA9IHMucGFyZW50Tm9kZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGhlIG93bmVyIGVsZW1lbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYSBEb2N1bWVudCBvciBTaGFkb3dSb290XG4gICAgICBpZiAocy5ub2RlVHlwZSAhPT0gTm9kZS5ET0NVTUVOVF9OT0RFICYmIHMubm9kZVR5cGUgIT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgICBzID0gZG9jdW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgICB9LFxuICAgIGZpbmRUYXJnZXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciB4ID0gaW5FdmVudC5jbGllbnRYO1xuICAgICAgdmFyIHkgPSBpbkV2ZW50LmNsaWVudFk7XG5cbiAgICAgIC8vIGlmIHRoZSBsaXN0ZW5lciBpcyBpbiB0aGUgc2hhZG93IHJvb3QsIGl0IGlzIG11Y2ggZmFzdGVyIHRvIHN0YXJ0IHRoZXJlXG4gICAgICB2YXIgcyA9IHRoaXMub3duZXIoaW5FdmVudC50YXJnZXQpO1xuXG4gICAgICAvLyBpZiB4LCB5IGlzIG5vdCBpbiB0aGlzIHJvb3QsIGZhbGwgYmFjayB0byBkb2N1bWVudCBzZWFyY2hcbiAgICAgIGlmICghcy5lbGVtZW50RnJvbVBvaW50KHgsIHkpKSB7XG4gICAgICAgIHMgPSBkb2N1bWVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaFJvb3QocywgeCwgeSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKTtcbiAgdmFyIG1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5tYXApO1xuICB2YXIgdG9BcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLnNsaWNlKTtcbiAgdmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5maWx0ZXIpO1xuICB2YXIgTU8gPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgdmFyIFNFTEVDVE9SID0gJ1t0b3VjaC1hY3Rpb25dJztcbiAgdmFyIE9CU0VSVkVSX0lOSVQgPSB7XG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsndG91Y2gtYWN0aW9uJ11cbiAgfTtcblxuICBmdW5jdGlvbiBJbnN0YWxsZXIoYWRkLCByZW1vdmUsIGNoYW5nZWQsIGJpbmRlcikge1xuICAgIHRoaXMuYWRkQ2FsbGJhY2sgPSBhZGQuYmluZChiaW5kZXIpO1xuICAgIHRoaXMucmVtb3ZlQ2FsbGJhY2sgPSByZW1vdmUuYmluZChiaW5kZXIpO1xuICAgIHRoaXMuY2hhbmdlZENhbGxiYWNrID0gY2hhbmdlZC5iaW5kKGJpbmRlcik7XG4gICAgaWYgKE1PKSB7XG4gICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE1PKHRoaXMubXV0YXRpb25XYXRjaGVyLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIEluc3RhbGxlci5wcm90b3R5cGUgPSB7XG4gICAgd2F0Y2hTdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcblxuICAgICAgLy8gT25seSB3YXRjaCBzY29wZXMgdGhhdCBjYW4gdGFyZ2V0IGZpbmQsIGFzIHRoZXNlIGFyZSB0b3AtbGV2ZWwuXG4gICAgICAvLyBPdGhlcndpc2Ugd2UgY2FuIHNlZSBkdXBsaWNhdGUgYWRkaXRpb25zIGFuZCByZW1vdmFscyB0aGF0IGFkZCBub2lzZS5cbiAgICAgIC8vXG4gICAgICAvLyBUT0RPKGRmcmVlZG1hbik6IEZvciBzb21lIGluc3RhbmNlcyB3aXRoIFNoYWRvd0RPTVBvbHlmaWxsLCB3ZSBjYW4gc2VlXG4gICAgICAvLyBhIHJlbW92YWwgd2l0aG91dCBhbiBpbnNlcnRpb24gd2hlbiBhIG5vZGUgaXMgcmVkaXN0cmlidXRlZCBhbW9uZ1xuICAgICAgLy8gc2hhZG93cy4gU2luY2UgaXQgYWxsIGVuZHMgdXAgY29ycmVjdCBpbiB0aGUgZG9jdW1lbnQsIHdhdGNoaW5nIG9ubHlcbiAgICAgIC8vIHRoZSBkb2N1bWVudCB3aWxsIHlpZWxkIHRoZSBjb3JyZWN0IG11dGF0aW9ucyB0byB3YXRjaC5cbiAgICAgIGlmICh0aGlzLm9ic2VydmVyICYmIHRhcmdldGluZy5jYW5UYXJnZXQodGFyZ2V0KSkge1xuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBPQlNFUlZFUl9JTklUKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuYWJsZU9uU3VidHJlZTogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICB0aGlzLndhdGNoU3VidHJlZSh0YXJnZXQpO1xuICAgICAgaWYgKHRhcmdldCA9PT0gZG9jdW1lbnQgJiYgZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICB0aGlzLmluc3RhbGxPbkxvYWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5zdGFsbE5ld1N1YnRyZWUodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluc3RhbGxOZXdTdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGZvckVhY2godGhpcy5maW5kRWxlbWVudHModGFyZ2V0KSwgdGhpcy5hZGRFbGVtZW50LCB0aGlzKTtcbiAgICB9LFxuICAgIGZpbmRFbGVtZW50czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBpZiAodGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB0aGlzLnJlbW92ZUNhbGxiYWNrKGVsKTtcbiAgICB9LFxuICAgIGFkZEVsZW1lbnQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB0aGlzLmFkZENhbGxiYWNrKGVsKTtcbiAgICB9LFxuICAgIGVsZW1lbnRDaGFuZ2VkOiBmdW5jdGlvbihlbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuY2hhbmdlZENhbGxiYWNrKGVsLCBvbGRWYWx1ZSk7XG4gICAgfSxcbiAgICBjb25jYXRMaXN0czogZnVuY3Rpb24oYWNjdW0sIGxpc3QpIHtcbiAgICAgIHJldHVybiBhY2N1bS5jb25jYXQodG9BcnJheShsaXN0KSk7XG4gICAgfSxcblxuICAgIC8vIHJlZ2lzdGVyIGFsbCB0b3VjaC1hY3Rpb24gPSBub25lIG5vZGVzIG9uIGRvY3VtZW50IGxvYWRcbiAgICBpbnN0YWxsT25Mb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbGxOZXdTdWJ0cmVlKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuICAgIGlzRWxlbWVudDogZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFO1xuICAgIH0sXG4gICAgZmxhdHRlbk11dGF0aW9uVHJlZTogZnVuY3Rpb24oaW5Ob2Rlcykge1xuXG4gICAgICAvLyBmaW5kIGNoaWxkcmVuIHdpdGggdG91Y2gtYWN0aW9uXG4gICAgICB2YXIgdHJlZSA9IG1hcChpbk5vZGVzLCB0aGlzLmZpbmRFbGVtZW50cywgdGhpcyk7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgYWRkZWQgbm9kZXMgYXJlIGFjY291bnRlZCBmb3JcbiAgICAgIHRyZWUucHVzaChmaWx0ZXIoaW5Ob2RlcywgdGhpcy5pc0VsZW1lbnQpKTtcblxuICAgICAgLy8gZmxhdHRlbiB0aGUgbGlzdFxuICAgICAgcmV0dXJuIHRyZWUucmVkdWNlKHRoaXMuY29uY2F0TGlzdHMsIFtdKTtcbiAgICB9LFxuICAgIG11dGF0aW9uV2F0Y2hlcjogZnVuY3Rpb24obXV0YXRpb25zKSB7XG4gICAgICBtdXRhdGlvbnMuZm9yRWFjaCh0aGlzLm11dGF0aW9uSGFuZGxlciwgdGhpcyk7XG4gICAgfSxcbiAgICBtdXRhdGlvbkhhbmRsZXI6IGZ1bmN0aW9uKG0pIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIHZhciBhZGRlZCA9IHRoaXMuZmxhdHRlbk11dGF0aW9uVHJlZShtLmFkZGVkTm9kZXMpO1xuICAgICAgICBhZGRlZC5mb3JFYWNoKHRoaXMuYWRkRWxlbWVudCwgdGhpcyk7XG4gICAgICAgIHZhciByZW1vdmVkID0gdGhpcy5mbGF0dGVuTXV0YXRpb25UcmVlKG0ucmVtb3ZlZE5vZGVzKTtcbiAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKHRoaXMucmVtb3ZlRWxlbWVudCwgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudENoYW5nZWQobS50YXJnZXQsIG0ub2xkVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzaGFkb3dTZWxlY3Rvcih2KSB7XG4gICAgcmV0dXJuICdib2R5IC9zaGFkb3ctZGVlcC8gJyArIHNlbGVjdG9yKHYpO1xuICB9XG4gIGZ1bmN0aW9uIHNlbGVjdG9yKHYpIHtcbiAgICByZXR1cm4gJ1t0b3VjaC1hY3Rpb249XCInICsgdiArICdcIl0nO1xuICB9XG4gIGZ1bmN0aW9uIHJ1bGUodikge1xuICAgIHJldHVybiAneyAtbXMtdG91Y2gtYWN0aW9uOiAnICsgdiArICc7IHRvdWNoLWFjdGlvbjogJyArIHYgKyAnOyB9JztcbiAgfVxuICB2YXIgYXR0cmliMmNzcyA9IFtcbiAgICAnbm9uZScsXG4gICAgJ2F1dG8nLFxuICAgICdwYW4teCcsXG4gICAgJ3Bhbi15JyxcbiAgICB7XG4gICAgICBydWxlOiAncGFuLXggcGFuLXknLFxuICAgICAgc2VsZWN0b3JzOiBbXG4gICAgICAgICdwYW4teCBwYW4teScsXG4gICAgICAgICdwYW4teSBwYW4teCdcbiAgICAgIF1cbiAgICB9XG4gIF07XG4gIHZhciBzdHlsZXMgPSAnJztcblxuICAvLyBvbmx5IGluc3RhbGwgc3R5bGVzaGVldCBpZiB0aGUgYnJvd3NlciBoYXMgdG91Y2ggYWN0aW9uIHN1cHBvcnRcbiAgdmFyIGhhc05hdGl2ZVBFID0gd2luZG93LlBvaW50ZXJFdmVudCB8fCB3aW5kb3cuTVNQb2ludGVyRXZlbnQ7XG5cbiAgLy8gb25seSBhZGQgc2hhZG93IHNlbGVjdG9ycyBpZiBzaGFkb3dkb20gaXMgc3VwcG9ydGVkXG4gIHZhciBoYXNTaGFkb3dSb290ID0gIXdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCAmJiBkb2N1bWVudC5oZWFkLmNyZWF0ZVNoYWRvd1Jvb3Q7XG5cbiAgZnVuY3Rpb24gYXBwbHlBdHRyaWJ1dGVTdHlsZXMoKSB7XG4gICAgaWYgKGhhc05hdGl2ZVBFKSB7XG4gICAgICBhdHRyaWIyY3NzLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICBpZiAoU3RyaW5nKHIpID09PSByKSB7XG4gICAgICAgICAgc3R5bGVzICs9IHNlbGVjdG9yKHIpICsgcnVsZShyKSArICdcXG4nO1xuICAgICAgICAgIGlmIChoYXNTaGFkb3dSb290KSB7XG4gICAgICAgICAgICBzdHlsZXMgKz0gc2hhZG93U2VsZWN0b3IocikgKyBydWxlKHIpICsgJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlcyArPSByLnNlbGVjdG9ycy5tYXAoc2VsZWN0b3IpICsgcnVsZShyLnJ1bGUpICsgJ1xcbic7XG4gICAgICAgICAgaWYgKGhhc1NoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSByLnNlbGVjdG9ycy5tYXAoc2hhZG93U2VsZWN0b3IpICsgcnVsZShyLnJ1bGUpICsgJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gc3R5bGVzO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHBvaW50ZXJtYXAgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG5cbiAgLy8gcmFkaXVzIGFyb3VuZCB0b3VjaGVuZCB0aGF0IHN3YWxsb3dzIG1vdXNlIGV2ZW50c1xuICB2YXIgREVEVVBfRElTVCA9IDI1O1xuXG4gIC8vIGxlZnQsIG1pZGRsZSwgcmlnaHQsIGJhY2ssIGZvcndhcmRcbiAgdmFyIEJVVFRPTl9UT19CVVRUT05TID0gWzEsIDQsIDIsIDgsIDE2XTtcblxuICB2YXIgSEFTX0JVVFRPTlMgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBIQVNfQlVUVE9OUyA9IG5ldyBNb3VzZUV2ZW50KCd0ZXN0JywgeyBidXR0b25zOiAxIH0pLmJ1dHRvbnMgPT09IDE7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgLy8gaGFuZGxlciBibG9jayBmb3IgbmF0aXZlIG1vdXNlIGV2ZW50c1xuICB2YXIgbW91c2VFdmVudHMgPSB7XG4gICAgUE9JTlRFUl9JRDogMSxcbiAgICBQT0lOVEVSX1RZUEU6ICdtb3VzZScsXG4gICAgZXZlbnRzOiBbXG4gICAgICAnbW91c2Vkb3duJyxcbiAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgJ21vdXNldXAnLFxuICAgICAgJ21vdXNlb3ZlcicsXG4gICAgICAnbW91c2VvdXQnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIGxhc3RUb3VjaGVzOiBbXSxcblxuICAgIC8vIGNvbGxpZGUgd2l0aCB0aGUgZ2xvYmFsIG1vdXNlIGxpc3RlbmVyXG4gICAgaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGx0cyA9IHRoaXMubGFzdFRvdWNoZXM7XG4gICAgICB2YXIgeCA9IGluRXZlbnQuY2xpZW50WDtcbiAgICAgIHZhciB5ID0gaW5FdmVudC5jbGllbnRZO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsdHMubGVuZ3RoLCB0OyBpIDwgbCAmJiAodCA9IGx0c1tpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIHNpbXVsYXRlZCBtb3VzZSBldmVudHMgd2lsbCBiZSBzd2FsbG93ZWQgbmVhciBhIHByaW1hcnkgdG91Y2hlbmRcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoeCAtIHQueCk7XG4gICAgICAgIHZhciBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVCAmJiBkeSA8PSBERURVUF9ESVNUKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXBhcmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLmNsb25lRXZlbnQoaW5FdmVudCk7XG5cbiAgICAgIC8vIGZvcndhcmQgbW91c2UgcHJldmVudERlZmF1bHRcbiAgICAgIHZhciBwZCA9IGUucHJldmVudERlZmF1bHQ7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGluRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcGQoKTtcbiAgICAgIH07XG4gICAgICBlLnBvaW50ZXJJZCA9IHRoaXMuUE9JTlRFUl9JRDtcbiAgICAgIGUuaXNQcmltYXJ5ID0gdHJ1ZTtcbiAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgcHJlcGFyZUJ1dHRvbnNGb3JNb3ZlOiBmdW5jdGlvbihlLCBpbkV2ZW50KSB7XG4gICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG5cbiAgICAgIC8vIFVwZGF0ZSBidXR0b25zIHN0YXRlIGFmdGVyIHBvc3NpYmxlIG91dC1vZi1kb2N1bWVudCBtb3VzZXVwLlxuICAgICAgaWYgKGluRXZlbnQud2hpY2ggPT09IDAgfHwgIXApIHtcbiAgICAgICAgZS5idXR0b25zID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGUuYnV0dG9ucyA9IHAuYnV0dG9ucztcbiAgICAgIH1cbiAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICB9LFxuICAgIG1vdXNlZG93bjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIHAgPSBwb2ludGVybWFwLmdldCh0aGlzLlBPSU5URVJfSUQpO1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7XG4gICAgICAgICAgZS5idXR0b25zID0gQlVUVE9OX1RPX0JVVFRPTlNbZS5idXR0b25dO1xuICAgICAgICAgIGlmIChwKSB7IGUuYnV0dG9ucyB8PSBwLmJ1dHRvbnM7IH1cbiAgICAgICAgICBpbkV2ZW50LmJ1dHRvbnMgPSBlLmJ1dHRvbnM7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFwIHx8IHAuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIuZG93bihlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlbW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykgeyB0aGlzLnByZXBhcmVCdXR0b25zRm9yTW92ZShlLCBpbkV2ZW50KTsgfVxuICAgICAgICBlLmJ1dHRvbiA9IC0xO1xuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZXVwOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHtcbiAgICAgICAgICB2YXIgdXAgPSBCVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG5cbiAgICAgICAgICAvLyBQcm9kdWNlcyB3cm9uZyBzdGF0ZSBvZiBidXR0b25zIGluIEJyb3dzZXJzIHdpdGhvdXQgYGJ1dHRvbnNgIHN1cHBvcnRcbiAgICAgICAgICAvLyB3aGVuIGEgbW91c2UgYnV0dG9uIHRoYXQgd2FzIHByZXNzZWQgb3V0c2lkZSB0aGUgZG9jdW1lbnQgaXMgcmVsZWFzZWRcbiAgICAgICAgICAvLyBpbnNpZGUgYW5kIG90aGVyIGJ1dHRvbnMgYXJlIHN0aWxsIHByZXNzZWQgZG93bi5cbiAgICAgICAgICBlLmJ1dHRvbnMgPSBwID8gcC5idXR0b25zICYgfnVwIDogMDtcbiAgICAgICAgICBpbkV2ZW50LmJ1dHRvbnMgPSBlLmJ1dHRvbnM7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcblxuICAgICAgICAvLyBTdXBwb3J0OiBGaXJlZm94IDw9NDQgb25seVxuICAgICAgICAvLyBGRiBVYnVudHUgaW5jbHVkZXMgdGhlIGxpZnRlZCBidXR0b24gaW4gdGhlIGBidXR0b25zYCBwcm9wZXJ0eSBvblxuICAgICAgICAvLyBtb3VzZXVwLlxuICAgICAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMjIzMzY2XG4gICAgICAgIGUuYnV0dG9ucyAmPSB+QlVUVE9OX1RPX0JVVFRPTlNbZS5idXR0b25dO1xuICAgICAgICBpZiAoZS5idXR0b25zID09PSAwKSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci51cChlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlb3ZlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykgeyB0aGlzLnByZXBhcmVCdXR0b25zRm9yTW92ZShlLCBpbkV2ZW50KTsgfVxuICAgICAgICBlLmJ1dHRvbiA9IC0xO1xuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlb3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChlKTtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZU1vdXNlKCk7XG4gICAgfSxcbiAgICBkZWFjdGl2YXRlTW91c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcG9pbnRlcm1hcC5kZWxldGUodGhpcy5QT0lOVEVSX0lEKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNhcHR1cmVJbmZvID0gZGlzcGF0Y2hlci5jYXB0dXJlSW5mbztcbiAgdmFyIGZpbmRUYXJnZXQgPSB0YXJnZXRpbmcuZmluZFRhcmdldC5iaW5kKHRhcmdldGluZyk7XG4gIHZhciBhbGxTaGFkb3dzID0gdGFyZ2V0aW5nLmFsbFNoYWRvd3MuYmluZCh0YXJnZXRpbmcpO1xuICB2YXIgcG9pbnRlcm1hcCQxID0gZGlzcGF0Y2hlci5wb2ludGVybWFwO1xuXG4gIC8vIFRoaXMgc2hvdWxkIGJlIGxvbmcgZW5vdWdoIHRvIGlnbm9yZSBjb21wYXQgbW91c2UgZXZlbnRzIG1hZGUgYnkgdG91Y2hcbiAgdmFyIERFRFVQX1RJTUVPVVQgPSAyNTAwO1xuICB2YXIgQ0xJQ0tfQ09VTlRfVElNRU9VVCA9IDIwMDtcbiAgdmFyIEFUVFJJQiA9ICd0b3VjaC1hY3Rpb24nO1xuICB2YXIgSU5TVEFMTEVSO1xuXG4gIC8vIGhhbmRsZXIgYmxvY2sgZm9yIG5hdGl2ZSB0b3VjaCBldmVudHNcbiAgdmFyIHRvdWNoRXZlbnRzID0ge1xuICAgIGV2ZW50czogW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hlbmQnLFxuICAgICAgJ3RvdWNoY2FuY2VsJ1xuICAgIF0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgSU5TVEFMTEVSLmVuYWJsZU9uU3VidHJlZSh0YXJnZXQpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgIC8vIFRPRE8oZGZyZWVkbWFuKTogaXMgaXQgd29ydGggaXQgdG8gZGlzY29ubmVjdCB0aGUgTU8/XG4gICAgfSxcbiAgICBlbGVtZW50QWRkZWQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYSA9IGVsLmdldEF0dHJpYnV0ZShBVFRSSUIpO1xuICAgICAgdmFyIHN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShhKTtcbiAgICAgIGlmIChzdCkge1xuICAgICAgICBlbC5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICBkaXNwYXRjaGVyLmxpc3RlbihlbCwgdGhpcy5ldmVudHMpO1xuXG4gICAgICAgIC8vIHNldCB0b3VjaC1hY3Rpb24gb24gc2hhZG93cyBhcyB3ZWxsXG4gICAgICAgIGFsbFNoYWRvd3MoZWwpLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHMuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgICBkaXNwYXRjaGVyLmxpc3RlbihzLCB0aGlzLmV2ZW50cyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWxlbWVudFJlbW92ZWQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5fc2Nyb2xsVHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4oZWwsIHRoaXMuZXZlbnRzKTtcblxuICAgICAgLy8gcmVtb3ZlIHRvdWNoLWFjdGlvbiBmcm9tIHNoYWRvd1xuICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgIHMuX3Njcm9sbFR5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4ocywgdGhpcy5ldmVudHMpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBlbGVtZW50Q2hhbmdlZDogZnVuY3Rpb24oZWwsIG9sZFZhbHVlKSB7XG4gICAgICB2YXIgYSA9IGVsLmdldEF0dHJpYnV0ZShBVFRSSUIpO1xuICAgICAgdmFyIHN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShhKTtcbiAgICAgIHZhciBvbGRTdCA9IHRoaXMudG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGUob2xkVmFsdWUpO1xuXG4gICAgICAvLyBzaW1wbHkgdXBkYXRlIHNjcm9sbFR5cGUgaWYgbGlzdGVuZXJzIGFyZSBhbHJlYWR5IGVzdGFibGlzaGVkXG4gICAgICBpZiAoc3QgJiYgb2xkU3QpIHtcbiAgICAgICAgZWwuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAob2xkU3QpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVtb3ZlZChlbCk7XG4gICAgICB9IGVsc2UgaWYgKHN0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudEFkZGVkKGVsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNjcm9sbFR5cGVzOiB7XG4gICAgICBFTUlUVEVSOiAnbm9uZScsXG4gICAgICBYU0NST0xMRVI6ICdwYW4teCcsXG4gICAgICBZU0NST0xMRVI6ICdwYW4teScsXG4gICAgICBTQ1JPTExFUjogL14oPzpwYW4teCBwYW4teSl8KD86cGFuLXkgcGFuLXgpfGF1dG8kL1xuICAgIH0sXG4gICAgdG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGU6IGZ1bmN0aW9uKHRvdWNoQWN0aW9uKSB7XG4gICAgICB2YXIgdCA9IHRvdWNoQWN0aW9uO1xuICAgICAgdmFyIHN0ID0gdGhpcy5zY3JvbGxUeXBlcztcbiAgICAgIGlmICh0ID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICAgIH0gZWxzZSBpZiAodCA9PT0gc3QuWFNDUk9MTEVSKSB7XG4gICAgICAgIHJldHVybiAnWCc7XG4gICAgICB9IGVsc2UgaWYgKHQgPT09IHN0LllTQ1JPTExFUikge1xuICAgICAgICByZXR1cm4gJ1knO1xuICAgICAgfSBlbHNlIGlmIChzdC5TQ1JPTExFUi5leGVjKHQpKSB7XG4gICAgICAgIHJldHVybiAnWFknO1xuICAgICAgfVxuICAgIH0sXG4gICAgUE9JTlRFUl9UWVBFOiAndG91Y2gnLFxuICAgIGZpcnN0VG91Y2g6IG51bGwsXG4gICAgaXNQcmltYXJ5VG91Y2g6IGZ1bmN0aW9uKGluVG91Y2gpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpcnN0VG91Y2ggPT09IGluVG91Y2guaWRlbnRpZmllcjtcbiAgICB9LFxuICAgIHNldFByaW1hcnlUb3VjaDogZnVuY3Rpb24oaW5Ub3VjaCkge1xuXG4gICAgICAvLyBzZXQgcHJpbWFyeSB0b3VjaCBpZiB0aGVyZSBubyBwb2ludGVycywgb3IgdGhlIG9ubHkgcG9pbnRlciBpcyB0aGUgbW91c2VcbiAgICAgIGlmIChwb2ludGVybWFwJDEuc2l6ZSA9PT0gMCB8fCAocG9pbnRlcm1hcCQxLnNpemUgPT09IDEgJiYgcG9pbnRlcm1hcCQxLmhhcygxKSkpIHtcbiAgICAgICAgdGhpcy5maXJzdFRvdWNoID0gaW5Ub3VjaC5pZGVudGlmaWVyO1xuICAgICAgICB0aGlzLmZpcnN0WFkgPSB7IFg6IGluVG91Y2guY2xpZW50WCwgWTogaW5Ub3VjaC5jbGllbnRZIH07XG4gICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FuY2VsUmVzZXRDbGlja0NvdW50KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVQcmltYXJ5UG9pbnRlcjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBpZiAoaW5Qb2ludGVyLmlzUHJpbWFyeSkge1xuICAgICAgICB0aGlzLmZpcnN0VG91Y2ggPSBudWxsO1xuICAgICAgICB0aGlzLmZpcnN0WFkgPSBudWxsO1xuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tDb3VudCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xpY2tDb3VudDogMCxcbiAgICByZXNldElkOiBudWxsLFxuICAgIHJlc2V0Q2xpY2tDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jbGlja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5yZXNldElkID0gbnVsbDtcbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucmVzZXRJZCA9IHNldFRpbWVvdXQoZm4sIENMSUNLX0NPVU5UX1RJTUVPVVQpO1xuICAgIH0sXG4gICAgY2FuY2VsUmVzZXRDbGlja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnJlc2V0SWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzZXRJZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0eXBlVG9CdXR0b25zOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICB2YXIgcmV0ID0gMDtcbiAgICAgIGlmICh0eXBlID09PSAndG91Y2hzdGFydCcgfHwgdHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcbiAgICAgICAgcmV0ID0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICB0b3VjaFRvUG9pbnRlcjogZnVuY3Rpb24oaW5Ub3VjaCkge1xuICAgICAgdmFyIGN0ZSA9IHRoaXMuY3VycmVudFRvdWNoRXZlbnQ7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIuY2xvbmVFdmVudChpblRvdWNoKTtcblxuICAgICAgLy8gV2UgcmVzZXJ2ZSBwb2ludGVySWQgMSBmb3IgTW91c2UuXG4gICAgICAvLyBUb3VjaCBpZGVudGlmaWVycyBjYW4gc3RhcnQgYXQgMC5cbiAgICAgIC8vIEFkZCAyIHRvIHRoZSB0b3VjaCBpZGVudGlmaWVyIGZvciBjb21wYXRpYmlsaXR5LlxuICAgICAgdmFyIGlkID0gZS5wb2ludGVySWQgPSBpblRvdWNoLmlkZW50aWZpZXIgKyAyO1xuICAgICAgZS50YXJnZXQgPSBjYXB0dXJlSW5mb1tpZF0gfHwgZmluZFRhcmdldChlKTtcbiAgICAgIGUuYnViYmxlcyA9IHRydWU7XG4gICAgICBlLmNhbmNlbGFibGUgPSB0cnVlO1xuICAgICAgZS5kZXRhaWwgPSB0aGlzLmNsaWNrQ291bnQ7XG4gICAgICBlLmJ1dHRvbiA9IDA7XG4gICAgICBlLmJ1dHRvbnMgPSB0aGlzLnR5cGVUb0J1dHRvbnMoY3RlLnR5cGUpO1xuICAgICAgZS53aWR0aCA9IChpblRvdWNoLnJhZGl1c1ggfHwgaW5Ub3VjaC53ZWJraXRSYWRpdXNYIHx8IDApICogMjtcbiAgICAgIGUuaGVpZ2h0ID0gKGluVG91Y2gucmFkaXVzWSB8fCBpblRvdWNoLndlYmtpdFJhZGl1c1kgfHwgMCkgKiAyO1xuICAgICAgZS5wcmVzc3VyZSA9IGluVG91Y2guZm9yY2UgfHwgaW5Ub3VjaC53ZWJraXRGb3JjZSB8fCAwLjU7XG4gICAgICBlLmlzUHJpbWFyeSA9IHRoaXMuaXNQcmltYXJ5VG91Y2goaW5Ub3VjaCk7XG4gICAgICBlLnBvaW50ZXJUeXBlID0gdGhpcy5QT0lOVEVSX1RZUEU7XG5cbiAgICAgIC8vIGZvcndhcmQgbW9kaWZpZXIga2V5c1xuICAgICAgZS5hbHRLZXkgPSBjdGUuYWx0S2V5O1xuICAgICAgZS5jdHJsS2V5ID0gY3RlLmN0cmxLZXk7XG4gICAgICBlLm1ldGFLZXkgPSBjdGUubWV0YUtleTtcbiAgICAgIGUuc2hpZnRLZXkgPSBjdGUuc2hpZnRLZXk7XG5cbiAgICAgIC8vIGZvcndhcmQgdG91Y2ggcHJldmVudERlZmF1bHRzXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgIHNlbGYuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIGN0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgcHJvY2Vzc1RvdWNoZXM6IGZ1bmN0aW9uKGluRXZlbnQsIGluRnVuY3Rpb24pIHtcbiAgICAgIHZhciB0bCA9IGluRXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgICB0aGlzLmN1cnJlbnRUb3VjaEV2ZW50ID0gaW5FdmVudDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCB0OyBpIDwgdGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdCA9IHRsW2ldO1xuICAgICAgICBpbkZ1bmN0aW9uLmNhbGwodGhpcywgdGhpcy50b3VjaFRvUG9pbnRlcih0KSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEZvciBzaW5nbGUgYXhpcyBzY3JvbGxlcnMsIGRldGVybWluZXMgd2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgZW1pdFxuICAgIC8vIHBvaW50ZXIgZXZlbnRzIG9yIGJlaGF2ZSBhcyBhIHNjcm9sbGVyXG4gICAgc2hvdWxkU2Nyb2xsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5maXJzdFhZKSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIHZhciBzY3JvbGxBeGlzID0gaW5FdmVudC5jdXJyZW50VGFyZ2V0Ll9zY3JvbGxUeXBlO1xuICAgICAgICBpZiAoc2Nyb2xsQXhpcyA9PT0gJ25vbmUnKSB7XG5cbiAgICAgICAgICAvLyB0aGlzIGVsZW1lbnQgaXMgYSB0b3VjaC1hY3Rpb246IG5vbmUsIHNob3VsZCBuZXZlciBzY3JvbGxcbiAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxBeGlzID09PSAnWFknKSB7XG5cbiAgICAgICAgICAvLyB0aGlzIGVsZW1lbnQgc2hvdWxkIGFsd2F5cyBzY3JvbGxcbiAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0ID0gaW5FdmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgICAgICAgIC8vIGNoZWNrIHRoZSBpbnRlbmRlZCBzY3JvbGwgYXhpcywgYW5kIG90aGVyIGF4aXNcbiAgICAgICAgICB2YXIgYSA9IHNjcm9sbEF4aXM7XG4gICAgICAgICAgdmFyIG9hID0gc2Nyb2xsQXhpcyA9PT0gJ1knID8gJ1gnIDogJ1knO1xuICAgICAgICAgIHZhciBkYSA9IE1hdGguYWJzKHRbJ2NsaWVudCcgKyBhXSAtIHRoaXMuZmlyc3RYWVthXSk7XG4gICAgICAgICAgdmFyIGRvYSA9IE1hdGguYWJzKHRbJ2NsaWVudCcgKyBvYV0gLSB0aGlzLmZpcnN0WFlbb2FdKTtcblxuICAgICAgICAgIC8vIGlmIGRlbHRhIGluIHRoZSBzY3JvbGwgYXhpcyA+IGRlbHRhIG90aGVyIGF4aXMsIHNjcm9sbCBpbnN0ZWFkIG9mXG4gICAgICAgICAgLy8gbWFraW5nIGV2ZW50c1xuICAgICAgICAgIHJldCA9IGRhID49IGRvYTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcnN0WFkgPSBudWxsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuICAgIH0sXG4gICAgZmluZFRvdWNoOiBmdW5jdGlvbihpblRMLCBpbklkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGluVEwubGVuZ3RoLCB0OyBpIDwgbCAmJiAodCA9IGluVExbaV0pOyBpKyspIHtcbiAgICAgICAgaWYgKHQuaWRlbnRpZmllciA9PT0gaW5JZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEluIHNvbWUgaW5zdGFuY2VzLCBhIHRvdWNoc3RhcnQgY2FuIGhhcHBlbiB3aXRob3V0IGEgdG91Y2hlbmQuIFRoaXNcbiAgICAvLyBsZWF2ZXMgdGhlIHBvaW50ZXJtYXAgaW4gYSBicm9rZW4gc3RhdGUuXG4gICAgLy8gVGhlcmVmb3JlLCBvbiBldmVyeSB0b3VjaHN0YXJ0LCB3ZSByZW1vdmUgdGhlIHRvdWNoZXMgdGhhdCBkaWQgbm90IGZpcmUgYVxuICAgIC8vIHRvdWNoZW5kIGV2ZW50LlxuICAgIC8vIFRvIGtlZXAgc3RhdGUgZ2xvYmFsbHkgY29uc2lzdGVudCwgd2UgZmlyZSBhXG4gICAgLy8gcG9pbnRlcmNhbmNlbCBmb3IgdGhpcyBcImFiYW5kb25lZFwiIHRvdWNoXG4gICAgdmFjdXVtVG91Y2hlczogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIHRsID0gaW5FdmVudC50b3VjaGVzO1xuXG4gICAgICAvLyBwb2ludGVybWFwLnNpemUgc2hvdWxkIGJlIDwgdGwubGVuZ3RoIGhlcmUsIGFzIHRoZSB0b3VjaHN0YXJ0IGhhcyBub3RcbiAgICAgIC8vIGJlZW4gcHJvY2Vzc2VkIHlldC5cbiAgICAgIGlmIChwb2ludGVybWFwJDEuc2l6ZSA+PSB0bC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGQgPSBbXTtcbiAgICAgICAgcG9pbnRlcm1hcCQxLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuXG4gICAgICAgICAgLy8gTmV2ZXIgcmVtb3ZlIHBvaW50ZXJJZCA9PSAxLCB3aGljaCBpcyBtb3VzZS5cbiAgICAgICAgICAvLyBUb3VjaCBpZGVudGlmaWVycyBhcmUgMiBzbWFsbGVyIHRoYW4gdGhlaXIgcG9pbnRlcklkLCB3aGljaCBpcyB0aGVcbiAgICAgICAgICAvLyBpbmRleCBpbiBwb2ludGVybWFwLlxuICAgICAgICAgIGlmIChrZXkgIT09IDEgJiYgIXRoaXMuZmluZFRvdWNoKHRsLCBrZXkgLSAyKSkge1xuICAgICAgICAgICAgdmFyIHAgPSB2YWx1ZS5vdXQ7XG4gICAgICAgICAgICBkLnB1c2gocCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgZC5mb3JFYWNoKHRoaXMuY2FuY2VsT3V0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRvdWNoc3RhcnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHRoaXMudmFjdXVtVG91Y2hlcyhpbkV2ZW50KTtcbiAgICAgIHRoaXMuc2V0UHJpbWFyeVRvdWNoKGluRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgdGhpcy5kZWR1cFN5bnRoTW91c2UoaW5FdmVudCk7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpY2tDb3VudCsrO1xuICAgICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMub3ZlckRvd24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgb3ZlckRvd246IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgcG9pbnRlcm1hcCQxLnNldChpblBvaW50ZXIucG9pbnRlcklkLCB7XG4gICAgICAgIHRhcmdldDogaW5Qb2ludGVyLnRhcmdldCxcbiAgICAgICAgb3V0OiBpblBvaW50ZXIsXG4gICAgICAgIG91dFRhcmdldDogaW5Qb2ludGVyLnRhcmdldFxuICAgICAgfSk7XG4gICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihpblBvaW50ZXIpO1xuICAgICAgZGlzcGF0Y2hlci5kb3duKGluUG9pbnRlcik7XG4gICAgfSxcbiAgICB0b3VjaG1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkU2Nyb2xsKGluRXZlbnQpKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudG91Y2hjYW5jZWwoaW5FdmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5tb3ZlT3Zlck91dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdmVPdmVyT3V0OiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIHZhciBldmVudCA9IGluUG9pbnRlcjtcbiAgICAgIHZhciBwb2ludGVyID0gcG9pbnRlcm1hcCQxLmdldChldmVudC5wb2ludGVySWQpO1xuXG4gICAgICAvLyBhIGZpbmdlciBkcmlmdGVkIG9mZiB0aGUgc2NyZWVuLCBpZ25vcmUgaXRcbiAgICAgIGlmICghcG9pbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgb3V0RXZlbnQgPSBwb2ludGVyLm91dDtcbiAgICAgIHZhciBvdXRUYXJnZXQgPSBwb2ludGVyLm91dFRhcmdldDtcbiAgICAgIGRpc3BhdGNoZXIubW92ZShldmVudCk7XG4gICAgICBpZiAob3V0RXZlbnQgJiYgb3V0VGFyZ2V0ICE9PSBldmVudC50YXJnZXQpIHtcbiAgICAgICAgb3V0RXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgZXZlbnQucmVsYXRlZFRhcmdldCA9IG91dFRhcmdldDtcblxuICAgICAgICAvLyByZWNvdmVyIGZyb20gcmV0YXJnZXRpbmcgYnkgc2hhZG93XG4gICAgICAgIG91dEV2ZW50LnRhcmdldCA9IG91dFRhcmdldDtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQob3V0RXZlbnQpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIGNsZWFuIHVwIGNhc2Ugd2hlbiBmaW5nZXIgbGVhdmVzIHRoZSBzY3JlZW5cbiAgICAgICAgICBldmVudC50YXJnZXQgPSBvdXRUYXJnZXQ7XG4gICAgICAgICAgZXZlbnQucmVsYXRlZFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5jYW5jZWxPdXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludGVyLm91dCA9IGV2ZW50O1xuICAgICAgcG9pbnRlci5vdXRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgfSxcbiAgICB0b3VjaGVuZDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdGhpcy5kZWR1cFN5bnRoTW91c2UoaW5FdmVudCk7XG4gICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMudXBPdXQpO1xuICAgIH0sXG4gICAgdXBPdXQ6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgICBkaXNwYXRjaGVyLnVwKGluUG9pbnRlcik7XG4gICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoaW5Qb2ludGVyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYW5VcFBvaW50ZXIoaW5Qb2ludGVyKTtcbiAgICB9LFxuICAgIHRvdWNoY2FuY2VsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMuY2FuY2VsT3V0KTtcbiAgICB9LFxuICAgIGNhbmNlbE91dDogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChpblBvaW50ZXIpO1xuICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChpblBvaW50ZXIpO1xuICAgICAgdGhpcy5jbGVhblVwUG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG4gICAgY2xlYW5VcFBvaW50ZXI6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgcG9pbnRlcm1hcCQxLmRlbGV0ZShpblBvaW50ZXIucG9pbnRlcklkKTtcbiAgICAgIHRoaXMucmVtb3ZlUHJpbWFyeVBvaW50ZXIoaW5Qb2ludGVyKTtcbiAgICB9LFxuXG4gICAgLy8gcHJldmVudCBzeW50aCBtb3VzZSBldmVudHMgZnJvbSBjcmVhdGluZyBwb2ludGVyIGV2ZW50c1xuICAgIGRlZHVwU3ludGhNb3VzZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGx0cyA9IG1vdXNlRXZlbnRzLmxhc3RUb3VjaGVzO1xuICAgICAgdmFyIHQgPSBpbkV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAvLyBvbmx5IHRoZSBwcmltYXJ5IGZpbmdlciB3aWxsIHN5bnRoIG1vdXNlIGV2ZW50c1xuICAgICAgaWYgKHRoaXMuaXNQcmltYXJ5VG91Y2godCkpIHtcblxuICAgICAgICAvLyByZW1lbWJlciB4L3kgb2YgbGFzdCB0b3VjaFxuICAgICAgICB2YXIgbHQgPSB7IHg6IHQuY2xpZW50WCwgeTogdC5jbGllbnRZIH07XG4gICAgICAgIGx0cy5wdXNoKGx0KTtcbiAgICAgICAgdmFyIGZuID0gKGZ1bmN0aW9uKGx0cywgbHQpIHtcbiAgICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGx0KTtcbiAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICBsdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuYmluZChudWxsLCBsdHMsIGx0KTtcbiAgICAgICAgc2V0VGltZW91dChmbiwgREVEVVBfVElNRU9VVCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIElOU1RBTExFUiA9IG5ldyBJbnN0YWxsZXIodG91Y2hFdmVudHMuZWxlbWVudEFkZGVkLCB0b3VjaEV2ZW50cy5lbGVtZW50UmVtb3ZlZCxcbiAgICB0b3VjaEV2ZW50cy5lbGVtZW50Q2hhbmdlZCwgdG91Y2hFdmVudHMpO1xuXG4gIHZhciBwb2ludGVybWFwJDIgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG4gIHZhciBIQVNfQklUTUFQX1RZUEUgPSB3aW5kb3cuTVNQb2ludGVyRXZlbnQgJiZcbiAgICB0eXBlb2Ygd2luZG93Lk1TUG9pbnRlckV2ZW50Lk1TUE9JTlRFUl9UWVBFX01PVVNFID09PSAnbnVtYmVyJztcbiAgdmFyIG1zRXZlbnRzID0ge1xuICAgIGV2ZW50czogW1xuICAgICAgJ01TUG9pbnRlckRvd24nLFxuICAgICAgJ01TUG9pbnRlck1vdmUnLFxuICAgICAgJ01TUG9pbnRlclVwJyxcbiAgICAgICdNU1BvaW50ZXJPdXQnLFxuICAgICAgJ01TUG9pbnRlck92ZXInLFxuICAgICAgJ01TUG9pbnRlckNhbmNlbCcsXG4gICAgICAnTVNHb3RQb2ludGVyQ2FwdHVyZScsXG4gICAgICAnTVNMb3N0UG9pbnRlckNhcHR1cmUnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIFBPSU5URVJfVFlQRVM6IFtcbiAgICAgICcnLFxuICAgICAgJ3VuYXZhaWxhYmxlJyxcbiAgICAgICd0b3VjaCcsXG4gICAgICAncGVuJyxcbiAgICAgICdtb3VzZSdcbiAgICBdLFxuICAgIHByZXBhcmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBpbkV2ZW50O1xuICAgICAgaWYgKEhBU19CSVRNQVBfVFlQRSkge1xuICAgICAgICBlID0gZGlzcGF0Y2hlci5jbG9uZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBlLnBvaW50ZXJUeXBlID0gdGhpcy5QT0lOVEVSX1RZUEVTW2luRXZlbnQucG9pbnRlclR5cGVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBjbGVhbnVwOiBmdW5jdGlvbihpZCkge1xuICAgICAgcG9pbnRlcm1hcCQyLmRlbGV0ZShpZCk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJEb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBwb2ludGVybWFwJDIuc2V0KGluRXZlbnQucG9pbnRlcklkLCBpbkV2ZW50KTtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRvd24oZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJNb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5tb3ZlKGUpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyVXA6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLnVwKGUpO1xuICAgICAgdGhpcy5jbGVhbnVwKGluRXZlbnQucG9pbnRlcklkKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck91dDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJPdmVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJDYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChlKTtcbiAgICAgIHRoaXMuY2xlYW51cChpbkV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfSxcbiAgICBNU0xvc3RQb2ludGVyQ2FwdHVyZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLm1ha2VFdmVudCgnbG9zdHBvaW50ZXJjYXB0dXJlJywgaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfSxcbiAgICBNU0dvdFBvaW50ZXJDYXB0dXJlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIubWFrZUV2ZW50KCdnb3Rwb2ludGVyY2FwdHVyZScsIGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBhcHBseVBvbHlmaWxsKCkge1xuXG4gICAgLy8gb25seSBhY3RpdmF0ZSBpZiB0aGlzIHBsYXRmb3JtIGRvZXMgbm90IGhhdmUgcG9pbnRlciBldmVudHNcbiAgICBpZiAoIXdpbmRvdy5Qb2ludGVyRXZlbnQpIHtcbiAgICAgIHdpbmRvdy5Qb2ludGVyRXZlbnQgPSBQb2ludGVyRXZlbnQ7XG5cbiAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgdmFyIHRwID0gd2luZG93Lm5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93Lm5hdmlnYXRvciwgJ21heFRvdWNoUG9pbnRzJywge1xuICAgICAgICAgIHZhbHVlOiB0cCxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCdtcycsIG1zRXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cubmF2aWdhdG9yLCAnbWF4VG91Y2hQb2ludHMnLCB7XG4gICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgZGlzcGF0Y2hlci5yZWdpc3RlclNvdXJjZSgnbW91c2UnLCBtb3VzZUV2ZW50cyk7XG4gICAgICAgIGlmICh3aW5kb3cub250b3VjaHN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCd0b3VjaCcsIHRvdWNoRXZlbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyKGRvY3VtZW50KTtcbiAgICB9XG4gIH1cblxuICB2YXIgbiA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gIHZhciBzO1xuICB2YXIgcjtcbiAgdmFyIGg7XG4gIGZ1bmN0aW9uIGFzc2VydEFjdGl2ZShpZCkge1xuICAgIGlmICghZGlzcGF0Y2hlci5wb2ludGVybWFwLmhhcyhpZCkpIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignSW52YWxpZFBvaW50ZXJJZCcpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhbGlkUG9pbnRlcklkJztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBhc3NlcnRDb25uZWN0ZWQoZWxlbSkge1xuICAgIHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG4gICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IGVsZW0ub3duZXJEb2N1bWVudCkge1xuICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGlmICghcGFyZW50KSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ0ludmFsaWRTdGF0ZUVycm9yJyk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFsaWRTdGF0ZUVycm9yJztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbkFjdGl2ZUJ1dHRvblN0YXRlKGlkKSB7XG4gICAgdmFyIHAgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXAuZ2V0KGlkKTtcbiAgICByZXR1cm4gcC5idXR0b25zICE9PSAwO1xuICB9XG4gIGlmIChuLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICBzID0gZnVuY3Rpb24ocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGFzc2VydENvbm5lY3RlZCh0aGlzKTtcbiAgICAgIGlmIChpbkFjdGl2ZUJ1dHRvblN0YXRlKHBvaW50ZXJJZCkpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5zZXRDYXB0dXJlKHBvaW50ZXJJZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubXNTZXRQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpO1xuICAgICAgfVxuICAgIH07XG4gICAgciA9IGZ1bmN0aW9uKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBkaXNwYXRjaGVyLnJlbGVhc2VDYXB0dXJlKHBvaW50ZXJJZCwgdHJ1ZSk7XG4gICAgICB0aGlzLm1zUmVsZWFzZVBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzID0gZnVuY3Rpb24gc2V0UG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGFzc2VydENvbm5lY3RlZCh0aGlzKTtcbiAgICAgIGlmIChpbkFjdGl2ZUJ1dHRvblN0YXRlKHBvaW50ZXJJZCkpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5zZXRDYXB0dXJlKHBvaW50ZXJJZCwgdGhpcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICByID0gZnVuY3Rpb24gcmVsZWFzZVBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBkaXNwYXRjaGVyLnJlbGVhc2VDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgfTtcbiAgfVxuICBoID0gZnVuY3Rpb24gaGFzUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgcmV0dXJuICEhZGlzcGF0Y2hlci5jYXB0dXJlSW5mb1twb2ludGVySWRdO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGFwcGx5UG9seWZpbGwkMSgpIHtcbiAgICBpZiAod2luZG93LkVsZW1lbnQgJiYgIUVsZW1lbnQucHJvdG90eXBlLnNldFBvaW50ZXJDYXB0dXJlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhFbGVtZW50LnByb3RvdHlwZSwge1xuICAgICAgICAnc2V0UG9pbnRlckNhcHR1cmUnOiB7XG4gICAgICAgICAgdmFsdWU6IHNcbiAgICAgICAgfSxcbiAgICAgICAgJ3JlbGVhc2VQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogclxuICAgICAgICB9LFxuICAgICAgICAnaGFzUG9pbnRlckNhcHR1cmUnOiB7XG4gICAgICAgICAgdmFsdWU6IGhcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlBdHRyaWJ1dGVTdHlsZXMoKTtcbiAgYXBwbHlQb2x5ZmlsbCgpO1xuICBhcHBseVBvbHlmaWxsJDEoKTtcblxuICB2YXIgcG9pbnRlcmV2ZW50cyA9IHtcbiAgICBkaXNwYXRjaGVyOiBkaXNwYXRjaGVyLFxuICAgIEluc3RhbGxlcjogSW5zdGFsbGVyLFxuICAgIFBvaW50ZXJFdmVudDogUG9pbnRlckV2ZW50LFxuICAgIFBvaW50ZXJNYXA6IFBvaW50ZXJNYXAsXG4gICAgdGFyZ2V0RmluZGluZzogdGFyZ2V0aW5nXG4gIH07XG5cbiAgcmV0dXJuIHBvaW50ZXJldmVudHM7XG5cbn0pKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvcGVwanMvZGlzdC9wZXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVpZGF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcywgV05vZGUgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHRoZW1lLCBUaGVtZWRNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgTWVudUl0ZW0sIE1lbnVJdGVtUHJvcGVydGllcyB9IGZyb20gJy4uL21lbnUtaXRlbS9NZW51SXRlbSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnUubS5jc3MnO1xuXG5pbnRlcmZhY2UgTWVudVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0b25TZWxlY3RlZDogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudVByb3BlcnRpZXM+KHtcblx0dGFnOiAnZGVtby1tZW51Jyxcblx0ZXZlbnRzOiBbJ29uU2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVQcm9wZXJ0aWVzLCBXTm9kZTxNZW51SXRlbT4+IHtcblx0cHJpdmF0ZSBfc2VsZWN0ZWRJZDogbnVtYmVyO1xuXG5cdHByaXZhdGUgX29uU2VsZWN0ZWQoaWQ6IG51bWJlciwgZGF0YTogYW55KSB7XG5cdFx0dGhpcy5fc2VsZWN0ZWRJZCA9IGlkO1xuXHRcdHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkKGRhdGEpO1xuXHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpIHtcblx0XHRjb25zdCBpdGVtcyA9IHRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChjaGlsZCkge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0aWVzOiBQYXJ0aWFsPE1lbnVJdGVtUHJvcGVydGllcz4gPSB7XG5cdFx0XHRcdFx0b25TZWxlY3RlZDogKGRhdGE6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5fb25TZWxlY3RlZChpbmRleCwgZGF0YSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZiAodGhpcy5fc2VsZWN0ZWRJZCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllcy5zZWxlY3RlZCA9IGluZGV4ID09PSB0aGlzLl9zZWxlY3RlZElkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNoaWxkLnByb3BlcnRpZXMgPSB7IC4uLmNoaWxkLnByb3BlcnRpZXMsIC4uLnByb3BlcnRpZXMgfTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGlsZDtcblx0XHR9KTtcblxuXHRcdHJldHVybiB2KCduYXYnLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcblx0XHRcdHYoXG5cdFx0XHRcdCdvbCcsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5tZW51Q29udGFpbmVyKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpdGVtc1xuXHRcdFx0KVxuXHRcdF0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX21lbnUhLi9zcmMvbWVudS9NZW51LnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcIm1lbnVcIixcInJvb3RcIjpcIl8zYkE2amRTblwiLFwibWVudUNvbnRhaW5lclwiOlwiXzFlb0dmcWt1XCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSJdLCJzb3VyY2VSb290IjoiIn0=