/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
dojoWebpackJsonptest_app(["runtime"],{

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
var WidgetRenderState;
(function (WidgetRenderState) {
    WidgetRenderState[WidgetRenderState["IDLE"] = 1] = "IDLE";
    WidgetRenderState[WidgetRenderState["PROPERTIES"] = 2] = "PROPERTIES";
    WidgetRenderState[WidgetRenderState["CHILDREN"] = 3] = "CHILDREN";
    WidgetRenderState[WidgetRenderState["RENDER"] = 4] = "RENDER";
})(WidgetRenderState || (WidgetRenderState = {}));
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
        this._renderState = WidgetRenderState.IDLE;
        this._nodeHandler = new NodeHandler_1.default();
        this._children = [];
        this._decoratorCache = new Map_1.default();
        this._properties = {};
        this._boundRenderFunc = this.render.bind(this);
        this._boundInvalidate = this.invalidate.bind(this);
        vdom_1.widgetInstanceMap.set(this, {
            dirty: true,
            onElementCreated: function (element, key) {
                _this.onElementCreated(element, key);
            },
            onElementUpdated: function (element, key) {
                _this.onElementUpdated(element, key);
            },
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
            invalidate: this._boundInvalidate
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
    /**
     * Widget lifecycle method that is called whenever a dom node is created for a VNode.
     * Override this method to access the dom nodes that were inserted into the dom.
     * @param element The dom node represented by the vdom node.
     * @param key The vdom node's key.
     */
    WidgetBase.prototype.onElementCreated = function (element, key) {
        // Do nothing by default.
    };
    /**
     * Widget lifecycle method that is called whenever a dom node that is associated with a VNode is updated.
     * Override this method to access the dom node.
     * @param element The dom node represented by the vdom node.
     * @param key The vdom node's key.
     */
    WidgetBase.prototype.onElementUpdated = function (element, key) {
        // Do nothing by default.
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
        this._renderState = WidgetRenderState.PROPERTIES;
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
        this._renderState = WidgetRenderState.PROPERTIES;
        var properties = this._runBeforeProperties(originalProperties);
        var registeredDiffPropertyNames = this.getDecorator('registeredDiffProperty');
        var changedPropertyKeys = [];
        var propertyNames = Object.keys(properties);
        var instanceData = vdom_1.widgetInstanceMap.get(this);
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
        else {
            this._renderState = WidgetRenderState.IDLE;
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
        this._renderState = WidgetRenderState.CHILDREN;
        if (this._children.length > 0 || children.length > 0) {
            this._children = children;
            this.invalidate();
        }
    };
    WidgetBase.prototype.__render__ = function () {
        this._renderState = WidgetRenderState.RENDER;
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        instanceData.dirty = false;
        var render = this._runBeforeRenders();
        var dNode = render();
        dNode = this.runAfterRenders(dNode);
        this._nodeHandler.clear();
        this._renderState = WidgetRenderState.IDLE;
        return dNode;
    };
    WidgetBase.prototype.invalidate = function () {
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        if (this._renderState === WidgetRenderState.IDLE) {
            instanceData.dirty = true;
            if (instanceData.parentInvalidate) {
                instanceData.parentInvalidate();
            }
        }
        else if (this._renderState === WidgetRenderState.PROPERTIES) {
            instanceData.dirty = true;
        }
        else if (this._renderState === WidgetRenderState.CHILDREN) {
            instanceData.dirty = true;
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
function getProjectionOptions(projectorOptions) {
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
        merge: false
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
            var instanceData = exports.widgetInstanceMap.get(dNode.instance);
            instanceData.onDetach();
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
    if (d_1.isVNode(childNode) && childNode.tag === '') {
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
    var oldIndex = 0;
    var newIndex = 0;
    var i;
    var textUpdated = false;
    var _loop_1 = function () {
        var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
        var newChild = newChildren[newIndex];
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
    if (typeof dnode.deferredPropertiesCallback === 'function') {
        addDeferredProperties(dnode, projectionOptions);
    }
    setProperties(domNode, dnode.properties, projectionOptions);
    if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
        var instanceData_1 = exports.widgetInstanceMap.get(parentInstance);
        instanceData_1.nodeHandler.add(domNode, "" + dnode.properties.key);
        projectionOptions.afterRenderCallbacks.push(function () {
            instanceData_1.onElementCreated(domNode, dnode.properties.key);
        });
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
        var instance = new widgetConstructor();
        dnode.instance = instance;
        var instanceData_2 = exports.widgetInstanceMap.get(instance);
        instanceData_2.parentInvalidate = parentInstanceData.invalidate;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        var rendered = instance.__render__();
        if (rendered) {
            var filteredRendered = filterAndDecorateChildren(rendered, instance);
            dnode.rendered = filteredRendered;
            addChildren(parentVNode, filteredRendered, projectionOptions, instance, insertBefore, childNodes);
        }
        instanceData_2.nodeHandler.addRoot();
        projectionOptions.afterRenderCallbacks.push(function () {
            instanceData_2.onAttach();
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
        if (dnode.tag === '') {
            if (dnode.domNode !== undefined) {
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
        var instance = previous.instance, previousRendered = previous.rendered;
        if (instance && previousRendered) {
            var instanceData = exports.widgetInstanceMap.get(instance);
            instance.__setCoreProperties__(dnode.coreProperties);
            instance.__setChildren__(dnode.children);
            instance.__setProperties__(dnode.properties);
            dnode.instance = instance;
            if (instanceData.dirty === true) {
                var rendered = instance.__render__();
                dnode.rendered = filterAndDecorateChildren(rendered, instance);
                updateChildren(parentVNode, previousRendered, dnode.rendered, instance, projectionOptions);
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
        var domNode_2 = (dnode.domNode = previous.domNode);
        var textUpdated = false;
        var updated = false;
        dnode.inserted = previous.inserted;
        if (dnode.tag === '') {
            if (dnode.text !== previous.text) {
                var newDomNode = domNode_2.ownerDocument.createTextNode(dnode.text);
                domNode_2.parentNode.replaceChild(newDomNode, domNode_2);
                dnode.domNode = newDomNode;
                textUpdated = true;
                return textUpdated;
            }
        }
        else {
            if (dnode.tag.lastIndexOf('svg', 0) === 0) {
                projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.children !== dnode.children) {
                var children = filterAndDecorateChildren(dnode.children, parentInstance);
                dnode.children = children;
                updated =
                    updateChildren(dnode, previous.children, children, parentInstance, projectionOptions) || updated;
            }
            if (typeof dnode.deferredPropertiesCallback === 'function') {
                addDeferredProperties(dnode, projectionOptions);
            }
            updated = updateProperties(domNode_2, previous.properties, dnode.properties, projectionOptions) || updated;
            if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                var instanceData_3 = exports.widgetInstanceMap.get(parentInstance);
                instanceData_3.nodeHandler.add(domNode_2, "" + dnode.properties.key);
                projectionOptions.afterRenderCallbacks.push(function () {
                    instanceData_3.onElementUpdated(domNode_2, dnode.properties.key);
                });
            }
        }
        if (updated && dnode.properties && dnode.properties.updateAnimation) {
            dnode.properties.updateAnimation(domNode_2, dnode.properties, previous.properties);
        }
        return textUpdated;
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
function createProjection(dnode, parentInstance, projectionOptions) {
    var projectionDNode = Array.isArray(dnode) ? dnode : [dnode];
    projectionOptions.merge = false;
    return {
        update: function (updatedDNode) {
            var domNode = projectionOptions.rootNode;
            updatedDNode = filterAndDecorateChildren(updatedDNode, parentInstance);
            updateChildren(toParentVNode(domNode), projectionDNode, updatedDNode, parentInstance, projectionOptions);
            var instanceData = exports.widgetInstanceMap.get(parentInstance);
            instanceData.nodeHandler.addRoot();
            runDeferredRenderCallbacks(projectionOptions);
            runAfterRenderCallbacks(projectionOptions);
            projectionDNode = updatedDNode;
        },
        domNode: projectionOptions.rootNode
    };
}
exports.dom = {
    create: function (dNode, instance, projectionOptions) {
        var finalProjectorOptions = getProjectionOptions(projectionOptions);
        var rootNode = document.createElement('div');
        finalProjectorOptions.rootNode = rootNode;
        var decoratedNode = filterAndDecorateChildren(dNode, instance);
        addChildren(toParentVNode(finalProjectorOptions.rootNode), decoratedNode, finalProjectorOptions, instance, undefined);
        var instanceData = exports.widgetInstanceMap.get(instance);
        instanceData.nodeHandler.addRoot();
        finalProjectorOptions.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        return createProjection(decoratedNode, instance, finalProjectorOptions);
    },
    append: function (parentNode, dNode, instance, projectionOptions) {
        var finalProjectorOptions = getProjectionOptions(projectionOptions);
        finalProjectorOptions.rootNode = parentNode;
        var decoratedNode = filterAndDecorateChildren(dNode, instance);
        addChildren(toParentVNode(finalProjectorOptions.rootNode), decoratedNode, finalProjectorOptions, instance, undefined);
        var instanceData = exports.widgetInstanceMap.get(instance);
        instanceData.nodeHandler.addRoot();
        finalProjectorOptions.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        return createProjection(decoratedNode, instance, finalProjectorOptions);
    },
    merge: function (element, dNode, instance, projectionOptions) {
        if (Array.isArray(dNode)) {
            throw new Error('Unable to merge an array of nodes. (consider adding one extra level to the virtual DOM)');
        }
        var finalProjectorOptions = getProjectionOptions(projectionOptions);
        finalProjectorOptions.merge = true;
        finalProjectorOptions.mergeElement = element;
        finalProjectorOptions.rootNode = element.parentNode;
        var decoratedNode = filterAndDecorateChildren(dNode, instance)[0];
        createDom(decoratedNode, toParentVNode(finalProjectorOptions.rootNode), undefined, finalProjectorOptions, instance);
        var instanceData = exports.widgetInstanceMap.get(instance);
        instanceData.nodeHandler.addRoot();
        finalProjectorOptions.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        return createProjection(decoratedNode, instance, finalProjectorOptions);
    },
    replace: function (element, dNode, instance, projectionOptions) {
        if (Array.isArray(dNode)) {
            throw new Error('Unable to replace a node with an array of nodes. (consider adding one extra level to the virtual DOM)');
        }
        var finalProjectorOptions = getProjectionOptions(projectionOptions);
        var decoratedNode = filterAndDecorateChildren(dNode, instance)[0];
        finalProjectorOptions.rootNode = element.parentNode;
        createDom(decoratedNode, toParentVNode(finalProjectorOptions.rootNode), element, finalProjectorOptions, instance);
        var instanceData = exports.widgetInstanceMap.get(instance);
        instanceData.nodeHandler.addRoot();
        finalProjectorOptions.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        element.parentNode.removeChild(element);
        return createProjection(decoratedNode, instance, finalProjectorOptions);
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


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRGVzdHJveWFibGUudHMiLCJ3ZWJwYWNrOi8vL0V2ZW50ZWQudHMiLCJ3ZWJwYWNrOi8vL2FzcGVjdC50cyIsIndlYnBhY2s6Ly8vbGFuZy50cyIsIndlYnBhY2s6Ly8vaGFzLnRzIiwid2VicGFjazovLy9NYXAudHMiLCJ3ZWJwYWNrOi8vL1Byb21pc2UudHMiLCJ3ZWJwYWNrOi8vL1N5bWJvbC50cyIsIndlYnBhY2s6Ly8vV2Vha01hcC50cyIsIndlYnBhY2s6Ly8vYXJyYXkudHMiLCJ3ZWJwYWNrOi8vL2dsb2JhbC50cyIsIndlYnBhY2s6Ly8vaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL251bWJlci50cyIsIndlYnBhY2s6Ly8vb2JqZWN0LnRzIiwid2VicGFjazovLy9zdHJpbmcudHMiLCJ3ZWJwYWNrOi8vL3F1ZXVlLnRzIiwid2VicGFjazovLy91dGlsLnRzIiwid2VicGFjazovLy9JbmplY3Rvci50cyIsIndlYnBhY2s6Ly8vTm9kZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vL1JlZ2lzdHJ5LnRzIiwid2VicGFjazovLy9SZWdpc3RyeUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vL1dpZGdldEJhc2UudHMiLCJ3ZWJwYWNrOi8vL2QudHMiLCJ3ZWJwYWNrOi8vL2JlZm9yZVByb3BlcnRpZXMudHMiLCJ3ZWJwYWNrOi8vL2N1c3RvbUVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vL2RpZmZQcm9wZXJ0eS50cyIsIndlYnBhY2s6Ly8vaGFuZGxlRGVjb3JhdG9yLnRzIiwid2VicGFjazovLy9pbmplY3QudHMiLCJ3ZWJwYWNrOi8vL2RpZmYudHMiLCJ3ZWJwYWNrOi8vL1RoZW1lZC50cyIsIndlYnBhY2s6Ly8vdmRvbS50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBRUE7OztBQUdBO0lBQ0MsT0FBTyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDOUI7QUFFQTs7O0FBR0E7SUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDO0FBQ2pEO0FBRUE7SUFNQzs7O0lBR0E7UUFDQyxJQUFJLENBQUMsUUFBTyxFQUFHLEVBQUU7SUFDbEI7SUFFQTs7Ozs7O0lBTUEsMEJBQUcsRUFBSCxVQUFJLE1BQWM7UUFDVCwwQkFBTztRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU87WUFDTixPQUFPO2dCQUNOLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUNqQjtTQUNBO0lBQ0YsQ0FBQztJQUVEOzs7OztJQUtBLDhCQUFPLEVBQVA7UUFBQTtRQUNDLE9BQU8sSUFBSSxpQkFBTyxDQUFDLFVBQUMsT0FBTztZQUMxQixLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07Z0JBQzNCLE9BQU0sR0FBSSxNQUFNLENBQUMsUUFBTyxHQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDN0MsQ0FBQyxDQUFDO1lBQ0YsS0FBSSxDQUFDLFFBQU8sRUFBRyxJQUFJO1lBQ25CLEtBQUksQ0FBQyxJQUFHLEVBQUcsU0FBUztZQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQUNGLGtCQUFDO0FBQUQsQ0E3Q0E7QUFBYTtBQStDYixrQkFBZSxXQUFXOzs7Ozs7Ozs7Ozs7QUM3RDFCO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7QUFNQSxzQkFBc0IsS0FBVTtJQUMvQixPQUFPLE9BQU8sQ0FBQyxNQUFLLEdBQUksT0FBTyxLQUFLLENBQUMsR0FBRSxJQUFLLFVBQVUsQ0FBQztBQUN4RDtBQUVBOzs7QUFHQSx5QkFBK0QsUUFBK0I7SUFDN0YsT0FBTyxZQUFZLENBQUMsUUFBUSxFQUFDLEVBQUcsVUFBQyxLQUFRLElBQUssZUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssU0FBRSxDQUFDLEVBQXRCLEVBQXNCLEVBQUcsUUFBUTtBQUNoRjtBQUVBOzs7Ozs7QUFNQSw4QkFBOEIsT0FBaUI7SUFDOUMsT0FBTztRQUNOLE9BQU87WUFDTixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxJQUFLLGFBQU0sQ0FBQyxPQUFPLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQztRQUM5QztLQUNBO0FBQ0Y7QUF3REE7OztBQUdBLElBQU0sU0FBUSxFQUFHLElBQUksYUFBRyxFQUFrQjtBQUUxQzs7Ozs7QUFLQSxxQkFBNEIsVUFBMkIsRUFBRSxZQUE2QjtJQUNyRixHQUFHLENBQUMsT0FBTyxhQUFZLElBQUssU0FBUSxHQUFJLE9BQU8sV0FBVSxJQUFLLFNBQVEsR0FBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3pHLElBQUksTUFBSyxRQUFRO1FBQ2pCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdCLE1BQUssRUFBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRTtRQUNsQztRQUNBLEtBQUs7WUFDSixNQUFLLEVBQUcsSUFBSSxNQUFNLENBQUMsTUFBSyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsS0FBSSxDQUFDO1lBQzVELFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUNoQztRQUNBLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFFaEM7SUFBRSxLQUFLO1FBQ04sT0FBTyxXQUFVLElBQUssWUFBWTtJQUNuQztBQUNEO0FBZkE7QUFpQkE7OztBQUdBO0lBQTZCO0lBTzVCOzs7O0lBSUEsaUJBQVksT0FBNEI7UUFBNUIsc0NBQTRCO1FBQXhDLFlBQ0Msa0JBQU87UUFWUjs7O1FBR1UsbUJBQVksRUFBOEMsSUFBSSxhQUFHLEVBQXdDO1FBMkJuSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0JBLFNBQUUsRUFBc0I7WUFBQTtZQUF5QjtpQkFBQSxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkOztZQUNoRCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU0sSUFBSyxDQUFDLEVBQUU7Z0JBQ2hCLGdDQUE4RixFQUE1RixjQUFJLEVBQUUsaUJBQVM7Z0JBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUM3QixJQUFNLFFBQU8sRUFBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUMsUUFBUSxJQUFLLGtCQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxNQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTVELENBQTRELENBQUM7b0JBQ3pHLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxDQUFDO2dCQUNyQztnQkFDQSxLQUFLO29CQUNKLE9BQU8sV0FBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBSSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDckU7WUFDRDtZQUNBLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFNLElBQUssQ0FBQyxFQUFFO2dCQUNyQixnQ0FBc0QsRUFBcEQsd0JBQWM7Z0JBQ3RCLElBQU0sUUFBTyxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxZQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxnQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQW5DLENBQW1DLENBQUM7Z0JBQzlGLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxDQUFDO1lBQ3JDO1lBQ0EsS0FBSztnQkFDSixNQUFNLElBQUksU0FBUyxDQUFDLG1CQUFtQixDQUFDO1lBQ3pDO1FBQ0QsQ0FBQztRQXhEUSxpQ0FBUztRQUNqQixHQUFHLENBQUMsU0FBUyxFQUFFO1lBQ2QsS0FBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCOztJQUNEO0lBRUE7Ozs7O0lBS0EsdUJBQUksRUFBSixVQUE0QixLQUFRO1FBQXBDO1FBQ0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSTtZQUN0QyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLEtBQUssQ0FBQztZQUN6QjtRQUNELENBQUMsQ0FBQztJQUNILENBQUM7SUF3Q0YsY0FBQztBQUFELENBdEVBLENBQTZCLHlCQUFXO0FBQTNCO0FBd0ViLGtCQUFlLE9BQU87Ozs7Ozs7Ozs7O0FDak10QjtBQUNBO0FBVUE7Ozs7O0FBS0EsbUJBQW1CLEtBQVU7SUFDNUIsT0FBTyxNQUFLLEdBQUksT0FBTyxLQUFLLENBQUMsSUFBRyxJQUFLLFdBQVUsR0FBSSxPQUFPLEtBQUssQ0FBQyxJQUFHLElBQUssVUFBVTtBQUNuRjtBQWdGQTs7O0FBR0EsSUFBTSxrQkFBaUIsRUFBRyxJQUFJLGlCQUFPLEVBQTBDO0FBRS9FOzs7QUFHQSxJQUFJLE9BQU0sRUFBRyxDQUFDO0FBRWQ7Ozs7Ozs7OztBQVNBLHNCQUNDLFVBQWtDLEVBQ2xDLElBQWdCLEVBQ2hCLE1BQTRCLEVBQzVCLGdCQUEwQjtJQUUxQixJQUFJLFNBQVEsRUFBRyxXQUFVLEdBQUksVUFBVSxDQUFDLElBQUksQ0FBQztJQUM3QyxJQUFJLFFBQU8sRUFBd0I7UUFDbEMsRUFBRSxFQUFFLE1BQU0sRUFBRTtRQUNaLE1BQU0sRUFBRSxNQUFNO1FBQ2QsZ0JBQWdCLEVBQUU7S0FDbEI7SUFFRCxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2IsR0FBRyxDQUFDLEtBQUksSUFBSyxPQUFPLEVBQUU7WUFDckI7WUFDQTtZQUNBLE9BQU8sUUFBUSxDQUFDLEtBQUksR0FBSSxDQUFDLFNBQVEsRUFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQztZQUNyRCxRQUFRLENBQUMsS0FBSSxFQUFHLE9BQU87WUFDdkIsT0FBTyxDQUFDLFNBQVEsRUFBRyxRQUFRO1FBQzVCO1FBQ0EsS0FBSztZQUNKO1lBQ0EsR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDZixVQUFVLENBQUMsT0FBTSxFQUFHLE9BQU87WUFDNUI7WUFDQSxPQUFPLENBQUMsS0FBSSxFQUFHLFFBQVE7WUFDdkIsUUFBUSxDQUFDLFNBQVEsRUFBRyxPQUFPO1FBQzVCO0lBQ0Q7SUFDQSxLQUFLO1FBQ0osV0FBVSxHQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxFQUFHLE9BQU8sQ0FBQztJQUMzQztJQUVBLE9BQU0sRUFBRyxTQUFRLEVBQUcsU0FBUztJQUU3QixPQUFPLG1CQUFZLENBQUM7UUFDZix3QkFBNEQsRUFBMUQsZ0JBQW9CLEVBQXBCLHlDQUFvQixFQUFFLFlBQWdCLEVBQWhCLHFDQUFnQjtRQUU1QyxHQUFHLENBQUMsV0FBVSxHQUFJLENBQUMsU0FBUSxHQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3JDLFVBQVUsQ0FBQyxJQUFJLEVBQUMsRUFBRyxTQUFTO1FBQzdCO1FBQ0EsS0FBSztZQUNKLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsUUFBUSxDQUFDLEtBQUksRUFBRyxJQUFJO1lBQ3JCO1lBQ0EsS0FBSztnQkFDSixXQUFVLEdBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEVBQUcsSUFBSSxDQUFDO1lBQ3hDO1lBRUEsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDVCxJQUFJLENBQUMsU0FBUSxFQUFHLFFBQVE7WUFDekI7UUFDRDtRQUNBLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCO1FBQ0EsV0FBVSxFQUFHLFFBQU8sRUFBRyxTQUFTO0lBQ2pDLENBQUMsQ0FBQztBQUNIO0FBRUE7Ozs7Ozs7QUFPQSx5QkFBcUUsU0FBWSxFQUFFLElBQWdCLEVBQUUsTUFBa0Y7SUFDdEwsSUFBSSxVQUFhO0lBQ2pCLEdBQUcsQ0FBQyxLQUFJLElBQUssUUFBUSxFQUFFO1FBQ3RCLFdBQVUsRUFBRyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFFLFNBQVMsQ0FBRSxDQUFDLENBQUM7SUFDdkU7SUFDQSxLQUFLO1FBQ0osV0FBVSxFQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQztRQUM5QztRQUNBLElBQU0sVUFBUyxFQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUU7UUFDcEQsR0FBRyxDQUFDLEtBQUksSUFBSyxRQUFRLEVBQUU7WUFDdEIsQ0FBQyxTQUFTLENBQUMsT0FBTSxHQUFJLENBQUMsU0FBUyxDQUFDLE9BQU0sRUFBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBeUIsTUFBTSxDQUFDO1FBQ3RGO1FBQ0EsS0FBSztZQUNKLENBQUMsU0FBUyxDQUFDLE1BQUssR0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFLLEVBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pEO0lBQ0Q7SUFDQSxPQUFPLFVBQVU7QUFDbEI7QUFFQTs7Ozs7OztBQU9BLDZCQUE2QixNQUFrQixFQUFFLFVBQWtCO0lBQ2xFLElBQU0sU0FBUSxFQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUMsRUFBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBQyxFQUFHLE9BQU0sR0FBSSxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQzFGLElBQUksVUFBc0I7SUFFMUIsR0FBRyxDQUFDLENBQUMsU0FBUSxHQUFJLFFBQVEsQ0FBQyxPQUFNLElBQUssTUFBTSxFQUFFO1FBQzVDO1FBQ0EsV0FBVSxFQUFnQjtZQUN6QixJQUFJLFlBQVcsRUFBRyxNQUFNO1lBQ3hCLElBQUksS0FBSSxFQUFHLFNBQVM7WUFDcEIsSUFBSSxPQUFZO1lBQ2hCLElBQUksT0FBTSxFQUFHLFVBQVUsQ0FBQyxNQUFNO1lBRTlCLE9BQU8sTUFBTSxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO29CQUNsQixLQUFJLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxHQUFJLElBQUk7Z0JBQy9DO2dCQUNBLE9BQU0sRUFBRyxNQUFNLENBQUMsSUFBSTtZQUNyQjtZQUVBLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTSxHQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsRCxRQUFPLEVBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUMvQztZQUVBLElBQUksTUFBSyxFQUFHLFVBQVUsQ0FBQyxLQUFLO1lBQzVCLE9BQU8sTUFBSyxHQUFJLEtBQUssQ0FBQyxHQUFFLElBQUssVUFBUyxHQUFJLEtBQUssQ0FBQyxHQUFFLEVBQUcsV0FBVyxFQUFFO2dCQUNqRSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtvQkFDakIsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDM0IsSUFBSSxXQUFVLEVBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzt3QkFDL0MsUUFBTyxFQUFHLFdBQVUsSUFBSyxVQUFTLEVBQUcsUUFBTyxFQUFHLFVBQVU7b0JBQzFEO29CQUNBLEtBQUs7d0JBQ0osUUFBTyxFQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDO29CQUNqRDtnQkFDRDtnQkFDQSxNQUFLLEVBQUcsS0FBSyxDQUFDLElBQUk7WUFDbkI7WUFFQSxPQUFPLE9BQU87UUFDZixDQUFDO1FBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7UUFDbkM7UUFDQSxLQUFLO1lBQ0osT0FBTSxHQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBQyxFQUFHLFVBQVUsQ0FBQztRQUM1QztRQUVBLEdBQUcsQ0FBQyxRQUFRLEVBQUU7WUFDYixVQUFVLENBQUMsT0FBTSxFQUFHO2dCQUNuQixNQUFNLEVBQUUsVUFBVSxNQUFXLEVBQUUsSUFBVztvQkFDekMsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7Z0JBQ3BDO2FBQ0E7UUFDRjtRQUVBLFVBQVUsQ0FBQyxPQUFNLEVBQUcsTUFBTTtJQUMzQjtJQUNBLEtBQUs7UUFDSixXQUFVLEVBQUcsUUFBUTtJQUN0QjtJQUVBLE9BQU8sVUFBVTtBQUNsQjtBQUVBOzs7OztBQUtBLGdDQUFpRSxTQUFZO0lBRTVFO1FBQUE7UUFBb0M7YUFBQSxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQ7O1FBQ25DO1FBQ00sMENBQWlFLEVBQS9ELGtCQUFNLEVBQUUsZ0JBQUssRUFBRSx3QkFBUztRQUNoQyxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ1gsS0FBSSxFQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxZQUFZLEVBQUUsTUFBTTtnQkFDekMsSUFBTSxZQUFXLEVBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsWUFBWSxDQUFDO2dCQUNwRCxPQUFPLFlBQVcsR0FBSSxZQUFZO1lBQ25DLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDVDtRQUNBLElBQUksT0FBTSxFQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUN4QyxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTSxFQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxjQUFjLEVBQUUsTUFBTTtnQkFDNUMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxDQUFFLGNBQWMsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQ1g7UUFDQSxPQUFPLE1BQU07SUFDZDtJQUVBOztJQUVBLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDckM7UUFDQSxJQUFNLFVBQVMsRUFBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFFO1FBQzdDLCtCQUFNLEVBQUUseUJBQUs7UUFDbkIsR0FBRyxDQUFDLFFBQU0sRUFBRTtZQUNYLFNBQU0sRUFBRyxRQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QjtRQUNBLEdBQUcsQ0FBQyxPQUFLLEVBQUU7WUFDVixRQUFLLEVBQUcsT0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdkI7UUFDQSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2pDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztZQUM5QixNQUFNO1lBQ04sS0FBSztTQUNMLENBQUM7SUFDSDtJQUVBLEtBQUs7UUFDSixpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxhQUFFLENBQUM7SUFDakQ7SUFFQSxPQUFPLFVBQWU7QUFDdkI7QUFFQTs7Ozs7O0FBTUEsd0JBQXlELFNBQVksRUFBRSxNQUErQjtJQUNyRyxPQUFPLGVBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUNuRDtBQUVBOzs7Ozs7Ozs7O0FBVUEscUJBQXFCLE1BQWtCLEVBQUUsVUFBa0IsRUFBRSxNQUE4RDtJQUMxSCxPQUFPLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUM5RTtBQW9CQSxlQUF1RCxpQkFBaUMsRUFBRSxrQkFBb0QsRUFBRSxZQUFxRTtJQUNwTixHQUFHLENBQUMsT0FBTyxrQkFBaUIsSUFBSyxVQUFVLEVBQUU7UUFDNUMsT0FBTyxjQUFjLENBQUMsaUJBQWlCLEVBQTRCLGtCQUFrQixDQUFDO0lBQ3ZGO0lBQ0EsS0FBSztRQUNKLE9BQU8sV0FBVyxDQUFDLGlCQUFpQixFQUFXLGtCQUFrQixFQUFFLFlBQWEsQ0FBQztJQUNsRjtBQUNEO0FBUEE7QUFTQTs7Ozs7O0FBTUEseUJBQWlFLFNBQVksRUFBRSxNQUFnQztJQUM5RyxPQUFPLGVBQWUsQ0FBTyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUMxRDtBQUZBO0FBSUE7Ozs7Ozs7O0FBUUEsc0JBQTZCLE1BQWtCLEVBQUUsVUFBa0IsRUFBRSxNQUEwQztJQUM5RyxJQUFJLFdBQVUsRUFBMkIsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztJQUNoRixJQUFJLFNBQVEsRUFBRyxVQUFVLENBQUMsTUFBTTtJQUNoQyxJQUFJLE9BQTZCO0lBQ2pDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDWCxRQUFPLEVBQUcsTUFBTSxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxTQUFRLEdBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUM7WUFDeEM7UUFDRCxDQUFDLENBQUM7SUFDSDtJQUVBLFVBQVUsQ0FBQyxPQUFNLEVBQUc7UUFDbkIsTUFBTSxFQUFFLFVBQVUsTUFBVyxFQUFFLElBQVc7WUFDekMsT0FBTyxRQUFPLEVBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUcsU0FBUSxHQUFJLFFBQVEsQ0FBQyxPQUFNLEdBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO1FBQzVHO0tBQ0E7SUFFRCxPQUFPLG1CQUFZLENBQUM7UUFDbkIsUUFBTyxFQUFHLFdBQVUsRUFBRyxTQUFTO0lBQ2pDLENBQUMsQ0FBQztBQUNIO0FBckJBO0FBdUNBLGdCQUF3RCxpQkFBaUMsRUFBRSxrQkFBcUQsRUFBRSxZQUFpRDtJQUNsTSxHQUFHLENBQUMsT0FBTyxrQkFBaUIsSUFBSyxVQUFVLEVBQUU7UUFDNUMsT0FBTyxlQUFlLENBQUMsaUJBQWlCLEVBQTZCLGtCQUFrQixDQUFDO0lBQ3pGO0lBQ0EsS0FBSztRQUNKLE9BQU8sWUFBWSxDQUFDLGlCQUFpQixFQUFXLGtCQUFrQixFQUFFLFlBQWEsQ0FBQztJQUNuRjtBQUNEO0FBUEE7QUFTQTs7Ozs7O0FBTUEseUJBQWdFLFNBQVksRUFBRSxNQUE2QjtJQUMxRyxPQUFPLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUNwRDtBQUZBO0FBSUE7Ozs7Ozs7O0FBUUEsc0JBQTZCLE1BQWtCLEVBQUUsVUFBa0IsRUFBRSxNQUFnRDtJQUNwSCxPQUFPLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUMvRTtBQUZBO0FBb0JBLGdCQUF3RCxpQkFBaUMsRUFBRSxrQkFBa0QsRUFBRSxZQUF5RDtJQUN2TSxHQUFHLENBQUMsT0FBTyxrQkFBaUIsSUFBSyxVQUFVLEVBQUU7UUFDNUMsT0FBTyxlQUFlLENBQUMsaUJBQWlCLEVBQTBCLGtCQUFrQixDQUFDO0lBQ3RGO0lBQ0EsS0FBSztRQUNKLE9BQU8sWUFBWSxDQUFDLGlCQUFpQixFQUFXLGtCQUFrQixFQUFFLFlBQWEsQ0FBQztJQUNuRjtBQUNEO0FBUEE7QUFTQTs7Ozs7Ozs7OztBQVVBLFlBQW1CLE1BQWtCLEVBQUUsVUFBa0IsRUFBRSxNQUF1QztJQUNqRyxPQUFPLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7QUFDcEY7QUFGQTs7Ozs7Ozs7Ozs7O0FDcGZBO0FBRUE7QUFBUyxnQ0FBTTtBQUVmLElBQU0sTUFBSyxFQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSztBQUNuQyxJQUFNLGVBQWMsRUFBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWM7QUFFdEQ7Ozs7Ozs7Ozs7QUFVQSw4QkFBOEIsS0FBVTtJQUN2QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsSUFBSyxpQkFBaUI7QUFDbkU7QUFFQSxtQkFBc0IsS0FBVSxFQUFFLFNBQWtCO0lBQ25ELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQU87UUFDakMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBYSxTQUFTLENBQU8sSUFBSSxFQUFFLFNBQVMsQ0FBQztRQUM5QztRQUVBLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUM7WUFDakMsS0FBSTtZQUNKLE1BQU0sQ0FBQztnQkFDTixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsU0FBUztnQkFDcEIsT0FBTyxFQUFhLENBQUUsSUFBSSxDQUFFO2dCQUM1QixNQUFNLEVBQU07YUFDWixDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0g7QUFVQSxnQkFBNEMsTUFBdUI7SUFDbEUsSUFBTSxLQUFJLEVBQUcsTUFBTSxDQUFDLElBQUk7SUFDeEIsSUFBTSxVQUFTLEVBQUcsTUFBTSxDQUFDLFNBQVM7SUFDbEMsSUFBTSxPQUFNLEVBQVEsTUFBTSxDQUFDLE1BQU07SUFDakMsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE9BQU0sR0FBSSxFQUFFO0lBQ2xDLElBQU0sWUFBVyxtQkFBUSxNQUFNLENBQUU7SUFFakMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFaEMsR0FBRyxDQUFDLE9BQU0sSUFBSyxLQUFJLEdBQUksT0FBTSxJQUFLLFNBQVMsRUFBRTtZQUM1QyxRQUFRO1FBQ1Q7UUFDQSxJQUFJLENBQUMsSUFBSSxJQUFHLEdBQUksTUFBTSxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxVQUFTLEdBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xELElBQUksTUFBSyxFQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBRTVCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO29CQUN0QyxRQUFRO2dCQUNUO2dCQUVBLEdBQUcsQ0FBQyxJQUFJLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3pCLE1BQUssRUFBRyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztvQkFDcEM7b0JBQ0EsS0FBSyxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3JDLElBQU0sWUFBVyxFQUFRLE1BQU0sQ0FBQyxHQUFHLEVBQUMsR0FBSSxFQUFFO3dCQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzt3QkFDbkIsTUFBSyxFQUFHLE1BQU0sQ0FBQzs0QkFDZCxJQUFJLEVBQUUsSUFBSTs0QkFDVixTQUFTLEVBQUUsU0FBUzs0QkFDcEIsT0FBTyxFQUFFLENBQUUsS0FBSyxDQUFFOzRCQUNsQixNQUFNLEVBQUUsV0FBVzs0QkFDbkIsTUFBTTt5QkFDTixDQUFDO29CQUNIO2dCQUNEO2dCQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUMsRUFBRyxLQUFLO1lBQ3BCO1FBQ0Q7SUFDRDtJQUVBLE9BQWEsTUFBTTtBQUNwQjtBQXdCQSxnQkFBdUIsU0FBYztJQUFFO1NBQUEsVUFBZ0IsRUFBaEIscUJBQWdCLEVBQWhCLElBQWdCO1FBQWhCOztJQUN0QyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ25CLE1BQU0sSUFBSSxVQUFVLENBQUMsaURBQWlELENBQUM7SUFDeEU7SUFFQSxJQUFNLEtBQUksRUFBRyxNQUFNLENBQUMsS0FBSyxFQUFFO0lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV0QyxPQUFPLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUNoQztBQVRBO0FBeUJBLG9CQUEyQixNQUFXO0lBQUU7U0FBQSxVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7UUFBakI7O0lBQ3ZDLE9BQU8sTUFBTSxDQUFDO1FBQ2IsSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsS0FBSztRQUNoQixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUU7S0FDUixDQUFDO0FBQ0g7QUFQQTtBQXVCQSxtQkFBMEIsTUFBVztJQUFFO1NBQUEsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1FBQWpCOztJQUN0QyxPQUFPLE1BQU0sQ0FBQztRQUNiLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLElBQUk7UUFDZixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUU7S0FDUixDQUFDO0FBQ0g7QUFQQTtBQVNBOzs7Ozs7O0FBT0EsbUJBQXdDLE1BQVM7SUFDaEQsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTNELE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDakM7QUFKQTtBQU1BOzs7Ozs7O0FBT0EscUJBQTRCLENBQU0sRUFBRSxDQUFNO0lBQ3pDLE9BQU8sRUFBQyxJQUFLLEVBQUM7UUFDYjtRQUNBLENBQUMsRUFBQyxJQUFLLEVBQUMsR0FBSSxFQUFDLElBQUssQ0FBQyxDQUFDO0FBQ3RCO0FBSkE7QUFNQTs7Ozs7Ozs7Ozs7QUFXQSxrQkFBeUIsUUFBWSxFQUFFLE1BQWM7SUFBRTtTQUFBLFVBQXNCLEVBQXRCLHFCQUFzQixFQUF0QixJQUFzQjtRQUF0Qjs7SUFDdEQsT0FBTyxZQUFZLENBQUMsT0FBTTtRQUN6QjtZQUNDLElBQU0sS0FBSSxFQUFVLFNBQVMsQ0FBQyxPQUFNLEVBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEVBQUcsWUFBWTtZQUVoRztZQUNBLE9BQWMsUUFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO1FBQ3RELEVBQUM7UUFDRDtZQUNDO1lBQ0EsT0FBYyxRQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7UUFDM0QsQ0FBQztBQUNIO0FBWkE7QUEwQkEsZUFBc0IsTUFBVztJQUFFO1NBQUEsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1FBQWpCOztJQUNsQyxPQUFPLE1BQU0sQ0FBQztRQUNiLElBQUksRUFBRSxLQUFLO1FBQ1gsU0FBUyxFQUFFLElBQUk7UUFDZixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUU7S0FDUixDQUFDO0FBQ0g7QUFQQTtBQVNBOzs7Ozs7OztBQVFBLGlCQUF3QixjQUF1QztJQUFFO1NBQUEsVUFBc0IsRUFBdEIscUJBQXNCLEVBQXRCLElBQXNCO1FBQXRCOztJQUNoRSxPQUFPO1FBQ04sSUFBTSxLQUFJLEVBQVUsU0FBUyxDQUFDLE9BQU0sRUFBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsRUFBRyxZQUFZO1FBRWhHLE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQ3hDLENBQUM7QUFDRjtBQU5BO0FBUUE7Ozs7Ozs7O0FBUUEsc0JBQTZCLFVBQXNCO0lBQ2xELE9BQU87UUFDTixPQUFPLEVBQUU7WUFDUixJQUFJLENBQUMsUUFBTyxFQUFHLGNBQWEsQ0FBQztZQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QjtLQUNBO0FBQ0Y7QUFQQTtBQVNBOzs7Ozs7QUFNQTtJQUFzQztTQUFBLFVBQW9CLEVBQXBCLHFCQUFvQixFQUFwQixJQUFvQjtRQUFwQjs7SUFDckMsT0FBTyxZQUFZLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO1FBQ3JCO0lBQ0QsQ0FBQyxDQUFDO0FBQ0g7QUFOQTs7Ozs7Ozs7Ozs7QUM1UUEsK0JBQStCLEtBQVU7SUFDeEMsT0FBTyxNQUFLLEdBQUksS0FBSyxDQUFDLElBQUk7QUFDM0I7QUFFQTs7O0FBR2Esa0JBQVMsRUFBNkMsRUFBRTtBQUVyRTs7O0FBR2Esc0JBQWEsRUFBdUMsRUFBRTtBQUVuRTs7OztBQUlBLElBQU0sY0FBYSxFQUErQyxFQUFFO0FBd0JwRTs7O0FBR0EsSUFBTSxZQUFXLEVBQUcsQ0FBQztJQUNwQjtJQUNBLEdBQUcsQ0FBQyxPQUFPLE9BQU0sSUFBSyxXQUFXLEVBQUU7UUFDbEM7UUFDQSxPQUFPLE1BQU07SUFDZDtJQUFFLEtBQUssR0FBRyxDQUFDLE9BQU8sT0FBTSxJQUFLLFdBQVcsRUFBRTtRQUN6QztRQUNBLE9BQU8sTUFBTTtJQUNkO0lBQUUsS0FBSyxHQUFHLENBQUMsT0FBTyxLQUFJLElBQUssV0FBVyxFQUFFO1FBQ3ZDO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7SUFDQTtJQUNBLE9BQU8sRUFBRTtBQUNWLENBQUMsQ0FBQyxFQUFFO0FBRUo7QUFDUSwwRUFBYztBQUV0QjtBQUNBLEdBQUcsQ0FBQyxxQkFBb0IsR0FBSSxXQUFXLEVBQUU7SUFDeEMsT0FBTyxXQUFXLENBQUMsa0JBQWtCO0FBQ3RDO0FBRUE7Ozs7OztBQU1BLGlDQUFpQyxLQUFVO0lBQzFDLE9BQU8sT0FBTyxNQUFLLElBQUssVUFBVTtBQUNuQztBQUVBOzs7O0FBSUEsSUFBTSxZQUFXLEVBQXNCO0lBQ3RDLEVBQUUsdUJBQXVCLENBQUMsY0FBYyxFQUFFLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtJQUNoRixFQUFFLEVBQUUsQ0FBRTs7Ozs7Ozs7Ozs7O0FBWVAsY0FBcUIsVUFBa0IsRUFBRSxPQUFnQixFQUFFLElBQTJCLEVBQUUsTUFBZTtJQUN0RyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ2xEO0FBRkE7QUFJQTs7Ozs7Ozs7O0FBU0EsbUJBQTBCLFVBQWtCLEVBQUUsU0FBdUM7SUFDcEYsSUFBTSxPQUFNLEVBQXFCLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUMsR0FBSSxFQUFFO0lBQ3pFLElBQUksRUFBQyxFQUFHLENBQUM7SUFFVCxhQUFhLElBQWM7UUFDMUIsSUFBTSxLQUFJLEVBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxLQUFJLElBQUssR0FBRyxFQUFFO1lBQ2pCO1lBQ0EsT0FBTyxJQUFJO1FBQ1o7UUFBRSxLQUFLO1lBQ047WUFDQSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDLElBQUssR0FBRyxFQUFFO2dCQUN4QixHQUFHLENBQUMsQ0FBQyxLQUFJLEdBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN2QjtvQkFDQSxPQUFPLEdBQUcsRUFBRTtnQkFDYjtnQkFBRSxLQUFLO29CQUNOO29CQUNBLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1QsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNqQjtZQUNEO1lBQ0E7WUFDQSxPQUFPLElBQUk7UUFDWjtJQUNEO0lBRUEsSUFBTSxHQUFFLEVBQUcsR0FBRyxFQUFFO0lBRWhCLE9BQU8sR0FBRSxHQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUM7QUFDM0I7QUE3QkE7QUErQkE7Ozs7O0FBS0EsZ0JBQXVCLE9BQWU7SUFDckMsSUFBTSxrQkFBaUIsRUFBRyxPQUFPLENBQUMsV0FBVyxFQUFFO0lBRS9DLE9BQU8sT0FBTyxDQUNiLGtCQUFpQixHQUFJLFlBQVcsR0FBSSxrQkFBaUIsR0FBSSxrQkFBUyxHQUFJLHFCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FDdEc7QUFDRjtBQU5BO0FBUUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBLGFBQ0MsT0FBZSxFQUNmLEtBQTRELEVBQzVELFNBQTBCO0lBQTFCLDZDQUEwQjtJQUUxQixJQUFNLGtCQUFpQixFQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUU7SUFFL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBQyxHQUFJLENBQUMsVUFBUyxHQUFJLENBQUMsQ0FBQyxrQkFBaUIsR0FBSSxXQUFXLENBQUMsRUFBRTtRQUNuRixNQUFNLElBQUksU0FBUyxDQUFDLGVBQVksUUFBTyxxQ0FBa0MsQ0FBQztJQUMzRTtJQUVBLEdBQUcsQ0FBQyxPQUFPLE1BQUssSUFBSyxVQUFVLEVBQUU7UUFDaEMscUJBQWEsQ0FBQyxpQkFBaUIsRUFBQyxFQUFHLEtBQUs7SUFDekM7SUFBRSxLQUFLLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QyxhQUFhLENBQUMsT0FBTyxFQUFDLEVBQUcsS0FBSyxDQUFDLElBQUksQ0FDbEMsVUFBQyxhQUFnQztZQUNoQyxpQkFBUyxDQUFDLE9BQU8sRUFBQyxFQUFHLGFBQWE7WUFDbEMsT0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzlCLENBQUMsRUFDRDtZQUNDLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUM5QixDQUFDLENBQ0Q7SUFDRjtJQUFFLEtBQUs7UUFDTixpQkFBUyxDQUFDLGlCQUFpQixFQUFDLEVBQUcsS0FBSztRQUNwQyxPQUFPLHFCQUFhLENBQUMsaUJBQWlCLENBQUM7SUFDeEM7QUFDRDtBQTNCQTtBQTZCQTs7Ozs7QUFLQSxhQUE0QixPQUFlO0lBQzFDLElBQUksTUFBeUI7SUFFN0IsSUFBTSxrQkFBaUIsRUFBRyxPQUFPLENBQUMsV0FBVyxFQUFFO0lBRS9DLEdBQUcsQ0FBQyxrQkFBaUIsR0FBSSxXQUFXLEVBQUU7UUFDckMsT0FBTSxFQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztJQUN4QztJQUFFLEtBQUssR0FBRyxDQUFDLHFCQUFhLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUM1QyxPQUFNLEVBQUcsaUJBQVMsQ0FBQyxpQkFBaUIsRUFBQyxFQUFHLHFCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25GLE9BQU8scUJBQWEsQ0FBQyxpQkFBaUIsQ0FBQztJQUN4QztJQUFFLEtBQUssR0FBRyxDQUFDLGtCQUFpQixHQUFJLGlCQUFTLEVBQUU7UUFDMUMsT0FBTSxFQUFHLGlCQUFTLENBQUMsaUJBQWlCLENBQUM7SUFDdEM7SUFBRSxLQUFLLEdBQUcsQ0FBQyxRQUFPLEdBQUksYUFBYSxFQUFFO1FBQ3BDLE9BQU8sS0FBSztJQUNiO0lBQUUsS0FBSztRQUNOLE1BQU0sSUFBSSxTQUFTLENBQUMsa0RBQStDLFFBQU8sTUFBRyxDQUFDO0lBQy9FO0lBRUEsT0FBTyxNQUFNO0FBQ2Q7QUFuQkE7QUFxQkE7OztBQUlBO0FBRUE7QUFDQSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztBQUVsQjtBQUNBLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxTQUFRLElBQUssWUFBVyxHQUFJLE9BQU8sU0FBUSxJQUFLLFdBQVcsQ0FBQztBQUV2RjtBQUNBLEdBQUcsQ0FBQyxXQUFXLEVBQUU7SUFDaEIsR0FBRyxDQUFDLE9BQU8sUUFBTyxJQUFLLFNBQVEsR0FBSSxPQUFPLENBQUMsU0FBUSxHQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQzdFLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJO0lBQzdCO0FBQ0QsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FDL1BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF3SFcsWUFBRyxFQUFtQixnQkFBTSxDQUFDLEdBQUc7QUFFM0MsR0FBRyxDQUFDLENBQUMsYUFBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQ3BCLFlBQUc7WUFtQkYsYUFBWSxRQUErQztnQkFsQnhDLFdBQUssRUFBUSxFQUFFO2dCQUNmLGFBQU8sRUFBUSxFQUFFO2dCQStGcEMsS0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDLEVBQVUsS0FBSztnQkE3RWxDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7b0JBQ2IsR0FBRyxDQUFDLHNCQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0I7b0JBQ0Q7b0JBQUUsS0FBSzs7NEJBQ04sSUFBSSxDQUFnQiwwQ0FBUTtnQ0FBdkIsSUFBTSxNQUFLO2dDQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7OztvQkFFOUI7Z0JBQ0Q7O1lBQ0Q7WUE1QkE7Ozs7WUFJVSwwQkFBVyxFQUFyQixVQUFzQixJQUFTLEVBQUUsR0FBTTtnQkFDdEMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxTQUFNLEVBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLEVBQUcsUUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0RCxHQUFHLENBQUMsV0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDM0IsT0FBTyxDQUFDO29CQUNUO2dCQUNEO2dCQUNBLE9BQU8sQ0FBQyxDQUFDO1lBQ1YsQ0FBQztZQW1CRCxzQkFBSSxxQkFBSTtxQkFBUjtvQkFDQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDekIsQ0FBQzs7OztZQUVELG9CQUFLLEVBQUw7Z0JBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFNLEVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFNLEVBQUcsQ0FBQztZQUM1QyxDQUFDO1lBRUQscUJBQU0sRUFBTixVQUFPLEdBQU07Z0JBQ1osSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztnQkFDL0MsR0FBRyxDQUFDLE1BQUssRUFBRyxDQUFDLEVBQUU7b0JBQ2QsT0FBTyxLQUFLO2dCQUNiO2dCQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sSUFBSTtZQUNaLENBQUM7WUFFRCxzQkFBTyxFQUFQO2dCQUFBO2dCQUNDLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBTSxFQUFFLENBQVM7b0JBQy9DLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsQ0FBQyxDQUFDO2dCQUVGLE9BQU8sSUFBSSx1QkFBWSxDQUFDLE1BQU0sQ0FBQztZQUNoQyxDQUFDO1lBRUQsc0JBQU8sRUFBUCxVQUFRLFFBQTJELEVBQUUsT0FBWTtnQkFDaEYsSUFBTSxLQUFJLEVBQUcsSUFBSSxDQUFDLEtBQUs7Z0JBQ3ZCLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxPQUFPO2dCQUMzQixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLFNBQU0sRUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRyxRQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3RELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO2dCQUNqRDtZQUNELENBQUM7WUFFRCxrQkFBRyxFQUFILFVBQUksR0FBTTtnQkFDVCxJQUFNLE1BQUssRUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO2dCQUMvQyxPQUFPLE1BQUssRUFBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ25ELENBQUM7WUFFRCxrQkFBRyxFQUFILFVBQUksR0FBTTtnQkFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFBRyxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELG1CQUFJLEVBQUo7Z0JBQ0MsT0FBTyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNwQyxDQUFDO1lBRUQsa0JBQUcsRUFBSCxVQUFJLEdBQU0sRUFBRSxLQUFRO2dCQUNuQixJQUFJLE1BQUssRUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO2dCQUM3QyxNQUFLLEVBQUcsTUFBSyxFQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLO2dCQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxFQUFHLEdBQUc7Z0JBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLEVBQUcsS0FBSztnQkFDM0IsT0FBTyxJQUFJO1lBQ1osQ0FBQztZQUVELHFCQUFNLEVBQU47Z0JBQ0MsT0FBTyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUN0QyxDQUFDO1lBRUQsY0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDLEVBQWpCO2dCQUNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN0QixDQUFDO1lBR0YsVUFBQztRQUFELENBbEdNO1FBaUJFLEdBQUMsTUFBTSxDQUFDLE9BQU8sRUFBQyxFQUFHLEVBQUk7V0FpRjlCO0FBQ0Y7QUFFQSxrQkFBZSxXQUFHOzs7Ozs7Ozs7Ozs7O0FDbk9sQjtBQUNBO0FBRUE7QUFDQTtBQWVXLG9CQUFXLEVBQW1CLGdCQUFNLENBQUMsT0FBTztBQUUxQyxtQkFBVSxFQUFHLG9CQUF1QixLQUFVO0lBQzFELE9BQU8sTUFBSyxHQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUksSUFBSyxVQUFVO0FBQ2pELENBQUM7QUFFRCxHQUFHLENBQUMsQ0FBQyxhQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7SUFPeEIsZ0JBQU0sQ0FBQyxRQUFPLEVBQUcsb0JBQVc7WUF5RTNCOzs7Ozs7Ozs7Ozs7WUFZQSxpQkFBWSxRQUFxQjtnQkFBakM7Z0JBc0hBOzs7Z0JBR1EsV0FBSztnQkFjYixLQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUMsRUFBYyxTQUFTO2dCQXRJMUM7OztnQkFHQSxJQUFJLFVBQVMsRUFBRyxLQUFLO2dCQUVyQjs7O2dCQUdBLElBQU0sV0FBVSxFQUFHO29CQUNsQixPQUFPLEtBQUksQ0FBQyxNQUFLLG9CQUFrQixHQUFJLFNBQVM7Z0JBQ2pELENBQUM7Z0JBRUQ7OztnQkFHQSxJQUFJLFVBQVMsRUFBK0IsRUFBRTtnQkFFOUM7Ozs7Z0JBSUEsSUFBSSxhQUFZLEVBQUcsVUFBUyxRQUFvQjtvQkFDL0MsR0FBRyxDQUFDLFNBQVMsRUFBRTt3QkFDZCxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDekI7Z0JBQ0QsQ0FBQztnQkFFRDs7Ozs7O2dCQU1BLElBQU0sT0FBTSxFQUFHLFVBQUMsUUFBZSxFQUFFLEtBQVU7b0JBQzFDO29CQUNBLEdBQUcsQ0FBQyxLQUFJLENBQUMsTUFBSyxtQkFBa0IsRUFBRTt3QkFDakMsTUFBTTtvQkFDUDtvQkFFQSxLQUFJLENBQUMsTUFBSyxFQUFHLFFBQVE7b0JBQ3JCLEtBQUksQ0FBQyxjQUFhLEVBQUcsS0FBSztvQkFDMUIsYUFBWSxFQUFHLHNCQUFjO29CQUU3QjtvQkFDQTtvQkFDQSxHQUFHLENBQUMsVUFBUyxHQUFJLFNBQVMsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO3dCQUN0QyxzQkFBYyxDQUFDOzRCQUNkLEdBQUcsQ0FBQyxTQUFTLEVBQUU7Z0NBQ2QsSUFBSSxNQUFLLEVBQUcsU0FBUyxDQUFDLE1BQU07Z0NBQzVCLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtvQ0FDL0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ3hCO2dDQUNBLFVBQVMsRUFBRyxJQUFJOzRCQUNqQjt3QkFDRCxDQUFDLENBQUM7b0JBQ0g7Z0JBQ0QsQ0FBQztnQkFFRDs7Ozs7O2dCQU1BLElBQU0sUUFBTyxFQUFHLFVBQUMsUUFBZSxFQUFFLEtBQVU7b0JBQzNDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTt3QkFDakIsTUFBTTtvQkFDUDtvQkFFQSxHQUFHLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQWtCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFpQixDQUFDO3dCQUNqRixVQUFTLEVBQUcsSUFBSTtvQkFDakI7b0JBQUUsS0FBSzt3QkFDTixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztvQkFDeEI7Z0JBQ0QsQ0FBQztnQkFFRCxJQUFJLENBQUMsS0FBSSxFQUFHLFVBQ1gsV0FBaUYsRUFDakYsVUFBbUY7b0JBRW5GLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTt3QkFDbEM7d0JBQ0E7d0JBQ0E7d0JBQ0EsWUFBWSxDQUFDOzRCQUNaLElBQU0sU0FBUSxFQUNiLEtBQUksQ0FBQyxNQUFLLHFCQUFvQixFQUFFLFdBQVcsRUFBRSxXQUFXOzRCQUV6RCxHQUFHLENBQUMsT0FBTyxTQUFRLElBQUssVUFBVSxFQUFFO2dDQUNuQyxJQUFJO29DQUNILE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dDQUN0QztnQ0FBRSxNQUFNLENBQUMsS0FBSyxFQUFFO29DQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0NBQ2Q7NEJBQ0Q7NEJBQUUsS0FBSyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQUssb0JBQW1CLEVBQUU7Z0NBQ3pDLE1BQU0sQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDOzRCQUMzQjs0QkFBRSxLQUFLO2dDQUNOLE9BQU8sQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDOzRCQUM1Qjt3QkFDRCxDQUFDLENBQUM7b0JBQ0gsQ0FBQyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsSUFBSTtvQkFDSCxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFrQixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBaUIsQ0FBQztnQkFDbEY7Z0JBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtvQkFDZixNQUFNLG1CQUFpQixLQUFLLENBQUM7Z0JBQzlCO1lBQ0Q7WUFsTU8sWUFBRyxFQUFWLFVBQVcsUUFBdUU7Z0JBQ2pGLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTTtvQkFDdkMsSUFBTSxPQUFNLEVBQVUsRUFBRTtvQkFDeEIsSUFBSSxTQUFRLEVBQUcsQ0FBQztvQkFDaEIsSUFBSSxNQUFLLEVBQUcsQ0FBQztvQkFDYixJQUFJLFdBQVUsRUFBRyxJQUFJO29CQUVyQixpQkFBaUIsS0FBYSxFQUFFLEtBQVU7d0JBQ3pDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsRUFBRyxLQUFLO3dCQUNyQixFQUFFLFFBQVE7d0JBQ1YsTUFBTSxFQUFFO29CQUNUO29CQUVBO3dCQUNDLEdBQUcsQ0FBQyxXQUFVLEdBQUksU0FBUSxFQUFHLEtBQUssRUFBRTs0QkFDbkMsTUFBTTt3QkFDUDt3QkFDQSxPQUFPLENBQUMsTUFBTSxDQUFDO29CQUNoQjtvQkFFQSxxQkFBcUIsS0FBYSxFQUFFLElBQVM7d0JBQzVDLEVBQUUsS0FBSzt3QkFDUCxHQUFHLENBQUMsa0JBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDckI7NEJBQ0E7NEJBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUM7d0JBQzdDO3dCQUFFLEtBQUs7NEJBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3REO29CQUNEO29CQUVBLElBQUksRUFBQyxFQUFHLENBQUM7O3dCQUNULElBQUksQ0FBZ0IsMENBQVE7NEJBQXZCLElBQU0sTUFBSzs0QkFDZixXQUFXLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQzs0QkFDckIsQ0FBQyxFQUFFOzs7Ozs7Ozs7O29CQUVKLFdBQVUsRUFBRyxLQUFLO29CQUVsQixNQUFNLEVBQUU7O2dCQUNULENBQUMsQ0FBQztZQUNILENBQUM7WUFFTSxhQUFJLEVBQVgsVUFBZSxRQUErRDtnQkFDN0UsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFTLE9BQThCLEVBQUUsTUFBTTs7d0JBQzlELElBQUksQ0FBZSwwQ0FBUTs0QkFBdEIsSUFBTSxLQUFJOzRCQUNkLEdBQUcsQ0FBQyxLQUFJLFdBQVksT0FBTyxFQUFFO2dDQUM1QjtnQ0FDQTtnQ0FDQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7NEJBQzNCOzRCQUFFLEtBQUs7Z0NBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNwQzs7Ozs7Ozs7Ozs7Z0JBRUYsQ0FBQyxDQUFDO1lBQ0gsQ0FBQztZQUVNLGVBQU0sRUFBYixVQUFjLE1BQVk7Z0JBQ3pCLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTTtvQkFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDZixDQUFDLENBQUM7WUFDSCxDQUFDO1lBSU0sZ0JBQU8sRUFBZCxVQUFrQixLQUFXO2dCQUM1QixPQUFPLElBQUksSUFBSSxDQUFDLFVBQVMsT0FBTztvQkFDL0IsT0FBTyxDQUFJLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxDQUFDO1lBQ0gsQ0FBQztZQWdJRCx3QkFBSyxFQUFMLFVBQ0MsVUFBaUY7Z0JBRWpGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO1lBQ3hDLENBQUM7WUFvQkYsY0FBQztRQUFELENBN04rQjtRQXVFdkIsR0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDLEVBQXVCLG1CQUFrQztXQXNKaEY7QUFDRjtBQUVBLGtCQUFlLG1CQUFXOzs7Ozs7Ozs7Ozs7QUNqUTFCO0FBQ0E7QUFDQTtBQVFXLGVBQU0sRUFBc0IsZ0JBQU0sQ0FBQyxNQUFNO0FBRXBELEdBQUcsQ0FBQyxDQUFDLGFBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUN2Qjs7Ozs7SUFLQSxJQUFNLGlCQUFjLEVBQUcsd0JBQXdCLEtBQVU7UUFDeEQsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBSyxFQUFHLGtCQUFrQixDQUFDO1FBQ2hEO1FBQ0EsT0FBTyxLQUFLO0lBQ2IsQ0FBQztJQUVELElBQU0sbUJBQWdCLEVBQUcsTUFBTSxDQUFDLGdCQUFnQjtJQUNoRCxJQUFNLGlCQUFjLEVBSVQsTUFBTSxDQUFDLGNBQXFCO0lBQ3ZDLElBQU0sU0FBTSxFQUFHLE1BQU0sQ0FBQyxNQUFNO0lBRTVCLElBQU0sZUFBWSxFQUFHLE1BQU0sQ0FBQyxTQUFTO0lBRXJDLElBQU0sZ0JBQWEsRUFBOEIsRUFBRTtJQUVuRCxJQUFNLGdCQUFhLEVBQUcsQ0FBQztRQUN0QixJQUFNLFFBQU8sRUFBRyxRQUFNLENBQUMsSUFBSSxDQUFDO1FBQzVCLE9BQU8sVUFBUyxJQUFxQjtZQUNwQyxJQUFJLFFBQU8sRUFBRyxDQUFDO1lBQ2YsSUFBSSxJQUFZO1lBQ2hCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLFFBQU8sR0FBSSxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUMvQyxFQUFFLE9BQU87WUFDVjtZQUNBLEtBQUksR0FBSSxNQUFNLENBQUMsUUFBTyxHQUFJLEVBQUUsQ0FBQztZQUM3QixPQUFPLENBQUMsSUFBSSxFQUFDLEVBQUcsSUFBSTtZQUNwQixLQUFJLEVBQUcsS0FBSSxFQUFHLElBQUk7WUFFbEI7WUFDQTtZQUNBLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxjQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pELGdCQUFjLENBQUMsY0FBWSxFQUFFLElBQUksRUFBRTtvQkFDbEMsR0FBRyxFQUFFLFVBQXVCLEtBQVU7d0JBQ3JDLGdCQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSx5QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEQ7aUJBQ0EsQ0FBQztZQUNIO1lBRUEsT0FBTyxJQUFJO1FBQ1osQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFO0lBRUosSUFBTSxpQkFBYyxFQUFHLGdCQUEyQixXQUE2QjtRQUM5RSxHQUFHLENBQUMsS0FBSSxXQUFZLGdCQUFjLEVBQUU7WUFDbkMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztRQUM5RDtRQUNBLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUMzQixDQUFDO0lBRUQsZUFBTSxFQUFHLGdCQUFNLENBQUMsT0FBTSxFQUFHLGdCQUE4QixXQUE2QjtRQUNuRixHQUFHLENBQUMsS0FBSSxXQUFZLE1BQU0sRUFBRTtZQUMzQixNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO1FBQzlEO1FBQ0EsSUFBTSxJQUFHLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBYyxDQUFDLFNBQVMsQ0FBQztRQUNuRCxZQUFXLEVBQUcsWUFBVyxJQUFLLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNsRSxPQUFPLGtCQUFnQixDQUFDLEdBQUcsRUFBRTtZQUM1QixlQUFlLEVBQUUseUJBQWtCLENBQUMsV0FBVyxDQUFDO1lBQ2hELFFBQVEsRUFBRSx5QkFBa0IsQ0FBQyxlQUFhLENBQUMsV0FBVyxDQUFDO1NBQ3ZELENBQUM7SUFDSCxDQUFzQjtJQUV0QjtJQUNBLGdCQUFjLENBQ2IsY0FBTSxFQUNOLEtBQUssRUFDTCx5QkFBa0IsQ0FBQyxVQUFTLEdBQVc7UUFDdEMsR0FBRyxDQUFDLGVBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLGVBQWEsQ0FBQyxHQUFHLENBQUM7UUFDMUI7UUFDQSxPQUFPLENBQUMsZUFBYSxDQUFDLEdBQUcsRUFBQyxFQUFHLGNBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FDRjtJQUNELGtCQUFnQixDQUFDLGNBQU0sRUFBRTtRQUN4QixNQUFNLEVBQUUseUJBQWtCLENBQUMsVUFBUyxHQUFXO1lBQzlDLElBQUksR0FBVztZQUNmLGdCQUFjLENBQUMsR0FBRyxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFHLEdBQUksZUFBYSxFQUFFO2dCQUMxQixHQUFHLENBQUMsZUFBYSxDQUFDLEdBQUcsRUFBQyxJQUFLLEdBQUcsRUFBRTtvQkFDL0IsT0FBTyxHQUFHO2dCQUNYO1lBQ0Q7UUFDRCxDQUFDLENBQUM7UUFDRixXQUFXLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3hFLGtCQUFrQixFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3RGLFFBQVEsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDbEUsS0FBSyxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUM1RCxVQUFVLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3RFLE9BQU8sRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDaEUsTUFBTSxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUM5RCxPQUFPLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ2hFLEtBQUssRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDNUQsV0FBVyxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN4RSxXQUFXLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3hFLFdBQVcsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLO0tBQ3ZFLENBQUM7SUFFRjtJQUNBLGtCQUFnQixDQUFDLGdCQUFjLENBQUMsU0FBUyxFQUFFO1FBQzFDLFdBQVcsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUM7UUFDdkMsUUFBUSxFQUFFLHlCQUFrQixDQUMzQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFFBQVE7UUFDckIsQ0FBQyxFQUNELEtBQUssRUFDTCxLQUFLO0tBRU4sQ0FBQztJQUVGO0lBQ0Esa0JBQWdCLENBQUMsY0FBTSxDQUFDLFNBQVMsRUFBRTtRQUNsQyxRQUFRLEVBQUUseUJBQWtCLENBQUM7WUFDNUIsT0FBTyxXQUFVLEVBQVMsZ0JBQWMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxnQkFBZSxFQUFHLEdBQUc7UUFDdEUsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxFQUFFLHlCQUFrQixDQUFDO1lBQzNCLE9BQU8sZ0JBQWMsQ0FBQyxJQUFJLENBQUM7UUFDNUIsQ0FBQztLQUNELENBQUM7SUFFRixnQkFBYyxDQUNiLGNBQU0sQ0FBQyxTQUFTLEVBQ2hCLGNBQU0sQ0FBQyxXQUFXLEVBQ2xCLHlCQUFrQixDQUFDO1FBQ2xCLE9BQU8sZ0JBQWMsQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQyxDQUFDLENBQ0Y7SUFDRCxnQkFBYyxDQUFDLGNBQU0sQ0FBQyxTQUFTLEVBQUUsY0FBTSxDQUFDLFdBQVcsRUFBRSx5QkFBa0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0RyxnQkFBYyxDQUNiLGdCQUFjLENBQUMsU0FBUyxFQUN4QixjQUFNLENBQUMsV0FBVyxFQUNsQix5QkFBa0IsQ0FBTyxjQUFPLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUNuRjtJQUNELGdCQUFjLENBQ2IsZ0JBQWMsQ0FBQyxTQUFTLEVBQ3hCLGNBQU0sQ0FBQyxXQUFXLEVBQ2xCLHlCQUFrQixDQUFPLGNBQU8sQ0FBQyxTQUFTLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQ25GO0FBQ0Y7QUFFQTs7Ozs7QUFLQSxrQkFBeUIsS0FBVTtJQUNsQyxPQUFPLENBQUMsTUFBSyxHQUFJLENBQUMsT0FBTyxNQUFLLElBQUssU0FBUSxHQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUMsSUFBSyxRQUFRLENBQUMsRUFBQyxHQUFJLEtBQUs7QUFDOUY7QUFGQTtBQUlBOzs7QUFHQTtJQUNDLGFBQWE7SUFDYixvQkFBb0I7SUFDcEIsVUFBVTtJQUNWLFNBQVM7SUFDVCxTQUFTO0lBQ1QsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0lBQ2I7Q0FDQSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7SUFDbkIsR0FBRyxDQUFDLENBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBTSxFQUFFLFNBQVMsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRztBQUNELENBQUMsQ0FBQztBQUVGLGtCQUFlLGNBQU07Ozs7Ozs7Ozs7OztBQy9MckI7QUFDQTtBQUNBO0FBQ0E7QUFvRVcsZ0JBQU8sRUFBdUIsZ0JBQU0sQ0FBQyxPQUFPO0FBT3ZELEdBQUcsQ0FBQyxDQUFDLGFBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUN4QixJQUFNLFVBQU8sRUFBUSxFQUFFO0lBRXZCLElBQU0sU0FBTSxFQUFHO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUUsRUFBRyxTQUFTLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQU0sZUFBWSxFQUFHLENBQUM7UUFDckIsSUFBSSxRQUFPLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFFLEVBQUcsU0FBUyxDQUFDO1FBRWhELE9BQU87WUFDTixPQUFPLE9BQU0sRUFBRyxRQUFNLEdBQUUsRUFBRyxDQUFDLE9BQU8sR0FBRSxFQUFHLElBQUksQ0FBQztRQUM5QyxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUU7SUFFSixnQkFBTztRQUlOLGlCQUFZLFFBQStDO1lBMkczRCxLQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUMsRUFBYyxTQUFTO1lBMUcxQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7Z0JBQ3BDLEtBQUssRUFBRSxjQUFZO2FBQ25CLENBQUM7WUFFRixJQUFJLENBQUMsZUFBYyxFQUFHLEVBQUU7WUFFeEIsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQkFDYixHQUFHLENBQUMsc0JBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDekMsSUFBTSxLQUFJLEVBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQjtnQkFDRDtnQkFBRSxLQUFLOzt3QkFDTixJQUFJLENBQXVCLDBDQUFROzRCQUF4Qiw4Q0FBWSxFQUFYLFdBQUcsRUFBRSxhQUFLOzRCQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7Ozs7Ozs7Ozs7Z0JBRXRCO1lBQ0Q7O1FBQ0Q7UUFFUSx1Q0FBb0IsRUFBNUIsVUFBNkIsR0FBUTtZQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRyxJQUFLLEdBQUcsRUFBRTtvQkFDdkMsT0FBTyxDQUFDO2dCQUNUO1lBQ0Q7WUFFQSxPQUFPLENBQUMsQ0FBQztRQUNWLENBQUM7UUFFRCx5QkFBTSxFQUFOLFVBQU8sR0FBUTtZQUNkLEdBQUcsQ0FBQyxJQUFHLElBQUssVUFBUyxHQUFJLElBQUcsSUFBSyxJQUFJLEVBQUU7Z0JBQ3RDLE9BQU8sS0FBSztZQUNiO1lBRUEsSUFBTSxNQUFLLEVBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxNQUFLLEdBQUksS0FBSyxDQUFDLElBQUcsSUFBSyxJQUFHLEdBQUksS0FBSyxDQUFDLE1BQUssSUFBSyxTQUFPLEVBQUU7Z0JBQzFELEtBQUssQ0FBQyxNQUFLLEVBQUcsU0FBTztnQkFDckIsT0FBTyxJQUFJO1lBQ1o7WUFFQSxJQUFNLFlBQVcsRUFBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDO1lBQ2xELEdBQUcsQ0FBQyxZQUFXLEdBQUksQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLElBQUk7WUFDWjtZQUVBLE9BQU8sS0FBSztRQUNiLENBQUM7UUFFRCxzQkFBRyxFQUFILFVBQUksR0FBUTtZQUNYLEdBQUcsQ0FBQyxJQUFHLElBQUssVUFBUyxHQUFJLElBQUcsSUFBSyxJQUFJLEVBQUU7Z0JBQ3RDLE9BQU8sU0FBUztZQUNqQjtZQUVBLElBQU0sTUFBSyxFQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMxQyxHQUFHLENBQUMsTUFBSyxHQUFJLEtBQUssQ0FBQyxJQUFHLElBQUssSUFBRyxHQUFJLEtBQUssQ0FBQyxNQUFLLElBQUssU0FBTyxFQUFFO2dCQUMxRCxPQUFPLEtBQUssQ0FBQyxLQUFLO1lBQ25CO1lBRUEsSUFBTSxZQUFXLEVBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztZQUNsRCxHQUFHLENBQUMsWUFBVyxHQUFJLENBQUMsRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUs7WUFDOUM7UUFDRCxDQUFDO1FBRUQsc0JBQUcsRUFBSCxVQUFJLEdBQVE7WUFDWCxHQUFHLENBQUMsSUFBRyxJQUFLLFVBQVMsR0FBSSxJQUFHLElBQUssSUFBSSxFQUFFO2dCQUN0QyxPQUFPLEtBQUs7WUFDYjtZQUVBLElBQU0sTUFBSyxFQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMxQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQUssR0FBSSxLQUFLLENBQUMsSUFBRyxJQUFLLElBQUcsR0FBSSxLQUFLLENBQUMsTUFBSyxJQUFLLFNBQU8sQ0FBQyxFQUFFO2dCQUNuRSxPQUFPLElBQUk7WUFDWjtZQUVBLElBQU0sWUFBVyxFQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7WUFDbEQsR0FBRyxDQUFDLFlBQVcsR0FBSSxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSTtZQUNaO1lBRUEsT0FBTyxLQUFLO1FBQ2IsQ0FBQztRQUVELHNCQUFHLEVBQUgsVUFBSSxHQUFRLEVBQUUsS0FBVztZQUN4QixHQUFHLENBQUMsQ0FBQyxJQUFHLEdBQUksQ0FBQyxPQUFPLElBQUcsSUFBSyxTQUFRLEdBQUksT0FBTyxJQUFHLElBQUssVUFBVSxDQUFDLEVBQUU7Z0JBQ25FLE1BQU0sSUFBSSxTQUFTLENBQUMsb0NBQW9DLENBQUM7WUFDMUQ7WUFDQSxJQUFJLE1BQUssRUFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDeEMsR0FBRyxDQUFDLENBQUMsTUFBSyxHQUFJLEtBQUssQ0FBQyxJQUFHLElBQUssR0FBRyxFQUFFO2dCQUNoQyxNQUFLLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7b0JBQzNCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFHO2lCQUNqQixDQUFDO2dCQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2hDO2dCQUFFLEtBQUs7b0JBQ04sTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDdEMsS0FBSyxFQUFFO3FCQUNQLENBQUM7Z0JBQ0g7WUFDRDtZQUNBLEtBQUssQ0FBQyxNQUFLLEVBQUcsS0FBSztZQUNuQixPQUFPLElBQUk7UUFDWixDQUFDO1FBR0YsY0FBQztJQUFELENBaEhVLEdBZ0hUO0FBQ0Y7QUFFQSxrQkFBZSxlQUFPOzs7Ozs7Ozs7Ozs7QUNoTnRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFxSEEsR0FBRyxDQUFDLGFBQUcsQ0FBQyxXQUFXLEVBQUMsR0FBSSxhQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtJQUM5QyxhQUFJLEVBQUcsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtJQUN4QixXQUFFLEVBQUcsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNwQixtQkFBVSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztJQUMxRCxhQUFJLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQzlDLGFBQUksRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDOUMsa0JBQVMsRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDekQ7QUFBRSxLQUFLO0lBQ047SUFDQTtJQUVBOzs7Ozs7SUFNQSxJQUFNLFdBQVEsRUFBRyxrQkFBa0IsTUFBYztRQUNoRCxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQztRQUNUO1FBRUEsT0FBTSxFQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQixPQUFNLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDNUI7UUFDQTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSx5QkFBZ0IsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7OztJQU1BLElBQU0sWUFBUyxFQUFHLG1CQUFtQixLQUFVO1FBQzlDLE1BQUssRUFBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakIsT0FBTyxDQUFDO1FBQ1Q7UUFDQSxHQUFHLENBQUMsTUFBSyxJQUFLLEVBQUMsR0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQyxPQUFPLEtBQUs7UUFDYjtRQUVBLE9BQU8sQ0FBQyxNQUFLLEVBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7Ozs7Ozs7SUFPQSxJQUFNLGtCQUFlLEVBQUcseUJBQXlCLEtBQWEsRUFBRSxNQUFjO1FBQzdFLE9BQU8sTUFBSyxFQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU0sRUFBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO0lBQ3pFLENBQUM7SUFFRCxhQUFJLEVBQUcsY0FFTixTQUF5QyxFQUN6QyxXQUFtQyxFQUNuQyxPQUFhO1FBRWIsR0FBRyxDQUFDLFVBQVMsR0FBSSxJQUFJLEVBQUU7WUFDdEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQztRQUMzRDtRQUVBLEdBQUcsQ0FBQyxZQUFXLEdBQUksT0FBTyxFQUFFO1lBQzNCLFlBQVcsRUFBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QztRQUVBO1FBQ0EsSUFBTSxZQUFXLEVBQUcsSUFBSTtRQUN4QixJQUFNLE9BQU0sRUFBVyxVQUFRLENBQU8sU0FBVSxDQUFDLE1BQU0sQ0FBQztRQUV4RDtRQUNBLElBQU0sTUFBSyxFQUNWLE9BQU8sWUFBVyxJQUFLLFdBQVcsRUFBUyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFL0YsR0FBRyxDQUFDLENBQUMsc0JBQVcsQ0FBQyxTQUFTLEVBQUMsR0FBSSxDQUFDLHFCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEQsT0FBTyxLQUFLO1FBQ2I7UUFFQTtRQUNBO1FBQ0EsR0FBRyxDQUFDLHNCQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0IsR0FBRyxDQUFDLE9BQU0sSUFBSyxDQUFDLEVBQUU7Z0JBQ2pCLE9BQU8sRUFBRTtZQUNWO1lBRUEsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsS0FBSyxDQUFDLENBQUMsRUFBQyxFQUFHLFlBQVksRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDckU7UUFDRDtRQUFFLEtBQUs7WUFDTixJQUFJLEVBQUMsRUFBRyxDQUFDOztnQkFDVCxJQUFJLENBQWdCLDRDQUFTO29CQUF4QixJQUFNLE1BQUs7b0JBQ2YsS0FBSyxDQUFDLENBQUMsRUFBQyxFQUFHLFlBQVksRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUs7b0JBQ3RELENBQUMsRUFBRTs7Ozs7Ozs7OztRQUVMO1FBRUEsR0FBRyxDQUFPLFNBQVUsQ0FBQyxPQUFNLElBQUssU0FBUyxFQUFFO1lBQzFDLEtBQUssQ0FBQyxPQUFNLEVBQUcsTUFBTTtRQUN0QjtRQUVBLE9BQU8sS0FBSzs7SUFDYixDQUFDO0lBRUQsV0FBRSxFQUFHO1FBQWU7YUFBQSxVQUFhLEVBQWIscUJBQWEsRUFBYixJQUFhO1lBQWI7O1FBQ25CLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QyxDQUFDO0lBRUQsbUJBQVUsRUFBRyxvQkFDWixNQUFvQixFQUNwQixNQUFjLEVBQ2QsS0FBYSxFQUNiLEdBQVk7UUFFWixHQUFHLENBQUMsT0FBTSxHQUFJLElBQUksRUFBRTtZQUNuQixNQUFNLElBQUksU0FBUyxDQUFDLGlEQUFpRCxDQUFDO1FBQ3ZFO1FBRUEsSUFBTSxPQUFNLEVBQUcsVUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdEMsT0FBTSxFQUFHLGlCQUFlLENBQUMsV0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUNuRCxNQUFLLEVBQUcsaUJBQWUsQ0FBQyxXQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQ2pELElBQUcsRUFBRyxpQkFBZSxDQUFDLElBQUcsSUFBSyxVQUFVLEVBQUUsT0FBTyxFQUFFLFdBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDMUUsSUFBSSxNQUFLLEVBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFHLEVBQUcsS0FBSyxFQUFFLE9BQU0sRUFBRyxNQUFNLENBQUM7UUFFbEQsSUFBSSxVQUFTLEVBQUcsQ0FBQztRQUNqQixHQUFHLENBQUMsT0FBTSxFQUFHLE1BQUssR0FBSSxPQUFNLEVBQUcsTUFBSyxFQUFHLEtBQUssRUFBRTtZQUM3QyxVQUFTLEVBQUcsQ0FBQyxDQUFDO1lBQ2QsTUFBSyxHQUFJLE1BQUssRUFBRyxDQUFDO1lBQ2xCLE9BQU0sR0FBSSxNQUFLLEVBQUcsQ0FBQztRQUNwQjtRQUVBLE9BQU8sTUFBSyxFQUFHLENBQUMsRUFBRTtZQUNqQixHQUFHLENBQUMsTUFBSyxHQUFJLE1BQU0sRUFBRTtnQkFDbkIsTUFBK0IsQ0FBQyxNQUFNLEVBQUMsRUFBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3pEO1lBQUUsS0FBSztnQkFDTixPQUFRLE1BQStCLENBQUMsTUFBTSxDQUFDO1lBQ2hEO1lBRUEsT0FBTSxHQUFJLFNBQVM7WUFDbkIsTUFBSyxHQUFJLFNBQVM7WUFDbEIsS0FBSyxFQUFFO1FBQ1I7UUFFQSxPQUFPLE1BQU07SUFDZCxDQUFDO0lBRUQsYUFBSSxFQUFHLGNBQWlCLE1BQW9CLEVBQUUsS0FBVSxFQUFFLEtBQWMsRUFBRSxHQUFZO1FBQ3JGLElBQU0sT0FBTSxFQUFHLFVBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RDLElBQUksRUFBQyxFQUFHLGlCQUFlLENBQUMsV0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUNqRCxJQUFHLEVBQUcsaUJBQWUsQ0FBQyxJQUFHLElBQUssVUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBRTFFLE9BQU8sRUFBQyxFQUFHLEdBQUcsRUFBRTtZQUNkLE1BQStCLENBQUMsQ0FBQyxFQUFFLEVBQUMsRUFBRyxLQUFLO1FBQzlDO1FBRUEsT0FBTyxNQUFNO0lBQ2QsQ0FBQztJQUVELGFBQUksRUFBRyxjQUFpQixNQUFvQixFQUFFLFFBQXlCLEVBQUUsT0FBWTtRQUNwRixJQUFNLE1BQUssRUFBRyxpQkFBUyxDQUFJLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO1FBQ3JELE9BQU8sTUFBSyxJQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxTQUFTO0lBQ2hELENBQUM7SUFFRCxrQkFBUyxFQUFHLG1CQUFzQixNQUFvQixFQUFFLFFBQXlCLEVBQUUsT0FBWTtRQUM5RixJQUFNLE9BQU0sRUFBRyxVQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDZCxNQUFNLElBQUksU0FBUyxDQUFDLDBDQUEwQyxDQUFDO1FBQ2hFO1FBRUEsR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUNaLFNBQVEsRUFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQztRQUVBLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ25DLE9BQU8sQ0FBQztZQUNUO1FBQ0Q7UUFFQSxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUM7QUFDRjtBQUVBLEdBQUcsQ0FBQyxhQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFDckIsaUJBQVEsRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDdkQ7QUFBRSxLQUFLO0lBQ047Ozs7OztJQU1BLElBQU0sV0FBUSxFQUFHLGtCQUFrQixNQUFjO1FBQ2hELE9BQU0sRUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEIsT0FBTyxDQUFDO1FBQ1Q7UUFDQSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JCLE9BQU0sRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QjtRQUNBO1FBQ0EsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLHlCQUFnQixDQUFDO0lBQ3ZELENBQUM7SUFFRCxpQkFBUSxFQUFHLGtCQUFxQixNQUFvQixFQUFFLGFBQWdCLEVBQUUsU0FBcUI7UUFBckIseUNBQXFCO1FBQzVGLElBQUksSUFBRyxFQUFHLFVBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRWpDLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxTQUFTLEVBQUUsRUFBQyxFQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNyQyxJQUFNLGVBQWMsRUFBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEdBQUcsQ0FDRixjQUFhLElBQUssZUFBYztnQkFDaEMsQ0FBQyxjQUFhLElBQUssY0FBYSxHQUFJLGVBQWMsSUFBSyxjQUFjLENBQ3RFLEVBQUU7Z0JBQ0QsT0FBTyxJQUFJO1lBQ1o7UUFDRDtRQUVBLE9BQU8sS0FBSztJQUNiLENBQUM7QUFDRjs7Ozs7Ozs7Ozs7QUMzVkEsSUFBTSxhQUFZLEVBQVEsQ0FBQztJQUMxQixHQUFHLENBQUMsT0FBTyxPQUFNLElBQUssV0FBVyxFQUFFO1FBQ2xDO1FBQ0E7UUFDQTtRQUNBLE9BQU8sTUFBTTtJQUNkO0lBQUUsS0FBSyxHQUFHLENBQUMsT0FBTyxPQUFNLElBQUssV0FBVyxFQUFFO1FBQ3pDO1FBQ0EsT0FBTyxNQUFNO0lBQ2Q7SUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEtBQUksSUFBSyxXQUFXLEVBQUU7UUFDdkM7UUFDQSxPQUFPLElBQUk7SUFDWjtBQUNELENBQUMsQ0FBQyxFQUFFO0FBRUosa0JBQWUsWUFBWTs7Ozs7Ozs7Ozs7O0FDZjNCO0FBQ0E7QUF1QkEsSUFBTSxXQUFVLEVBQXdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBUyxDQUFFO0FBRXhFOzs7QUFHQTtJQUtDLHNCQUFZLElBQWdDO1FBSHBDLGdCQUFVLEVBQUcsQ0FBQyxDQUFDO1FBSXRCLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLGdCQUFlLEVBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMvQztRQUFFLEtBQUs7WUFDTixJQUFJLENBQUMsTUFBSyxFQUFHLElBQUk7UUFDbEI7SUFDRDtJQUVBOzs7SUFHQSw0QkFBSSxFQUFKO1FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRTtRQUNuQztRQUNBLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEIsT0FBTyxVQUFVO1FBQ2xCO1FBQ0EsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVUsRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUMxQyxPQUFPO2dCQUNOLElBQUksRUFBRSxLQUFLO2dCQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVO2FBQ2pDO1FBQ0Y7UUFDQSxPQUFPLFVBQVU7SUFDbEIsQ0FBQztJQUVELHVCQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUMsRUFBakI7UUFDQyxPQUFPLElBQUk7SUFDWixDQUFDO0lBQ0YsbUJBQUM7QUFBRCxDQW5DQTtBQUFhO0FBcUNiOzs7OztBQUtBLG9CQUEyQixLQUFVO0lBQ3BDLE9BQU8sTUFBSyxHQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUMsSUFBSyxVQUFVO0FBQzdEO0FBRkE7QUFJQTs7Ozs7QUFLQSxxQkFBNEIsS0FBVTtJQUNyQyxPQUFPLE1BQUssR0FBSSxPQUFPLEtBQUssQ0FBQyxPQUFNLElBQUssUUFBUTtBQUNqRDtBQUZBO0FBSUE7Ozs7O0FBS0EsYUFBdUIsUUFBb0M7SUFDMUQsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN6QixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDbkM7SUFBRSxLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDakMsT0FBTyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDbEM7QUFDRDtBQU5BO0FBbUJBOzs7Ozs7O0FBT0EsZUFDQyxRQUE2QyxFQUM3QyxRQUEwQixFQUMxQixPQUFhO0lBRWIsSUFBSSxPQUFNLEVBQUcsS0FBSztJQUVsQjtRQUNDLE9BQU0sRUFBRyxJQUFJO0lBQ2Q7SUFFQTtJQUNBLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFDLEdBQUksT0FBTyxTQUFRLElBQUssUUFBUSxFQUFFO1FBQzFELElBQU0sRUFBQyxFQUFHLFFBQVEsQ0FBQyxNQUFNO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMzQixJQUFJLEtBQUksRUFBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxFQUFDLEVBQUcsRUFBQyxFQUFHLENBQUMsRUFBRTtnQkFDZCxJQUFNLEtBQUksRUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsR0FBRyxDQUFDLEtBQUksR0FBSSw0QkFBa0IsR0FBSSxLQUFJLEdBQUksMkJBQWtCLEVBQUU7b0JBQzdELEtBQUksR0FBSSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3RCO1lBQ0Q7WUFDQSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztZQUMvQyxHQUFHLENBQUMsTUFBTSxFQUFFO2dCQUNYLE1BQU07WUFDUDtRQUNEO0lBQ0Q7SUFBRSxLQUFLO1FBQ04sSUFBTSxTQUFRLEVBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ2IsSUFBSSxPQUFNLEVBQUcsUUFBUSxDQUFDLElBQUksRUFBRTtZQUU1QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO2dCQUN2RCxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUNYLE1BQU07Z0JBQ1A7Z0JBQ0EsT0FBTSxFQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDekI7UUFDRDtJQUNEO0FBQ0Q7QUF6Q0E7Ozs7Ozs7Ozs7O0FDbkhBO0FBRUE7OztBQUdhLGdCQUFPLEVBQUcsQ0FBQztBQUV4Qjs7O0FBR2EseUJBQWdCLEVBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLEVBQUcsQ0FBQztBQUVuRDs7O0FBR2EseUJBQWdCLEVBQUcsQ0FBQyx3QkFBZ0I7QUFFakQ7Ozs7OztBQU1BLGVBQXNCLEtBQVU7SUFDL0IsT0FBTyxPQUFPLE1BQUssSUFBSyxTQUFRLEdBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3hEO0FBRkE7QUFJQTs7Ozs7O0FBTUEsa0JBQXlCLEtBQVU7SUFDbEMsT0FBTyxPQUFPLE1BQUssSUFBSyxTQUFRLEdBQUksZ0JBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNEO0FBRkE7QUFJQTs7Ozs7O0FBTUEsbUJBQTBCLEtBQVU7SUFDbkMsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFDLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSyxLQUFLO0FBQ3REO0FBRkE7QUFJQTs7Ozs7Ozs7OztBQVVBLHVCQUE4QixLQUFVO0lBQ3ZDLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBQyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEdBQUksd0JBQWdCO0FBQy9EO0FBRkE7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQXFIQSxHQUFHLENBQUMsYUFBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0lBQ3RCLElBQU0sYUFBWSxFQUFHLGdCQUFNLENBQUMsTUFBTTtJQUNsQyxlQUFNLEVBQUcsWUFBWSxDQUFDLE1BQU07SUFDNUIsaUNBQXdCLEVBQUcsWUFBWSxDQUFDLHdCQUF3QjtJQUNoRSw0QkFBbUIsRUFBRyxZQUFZLENBQUMsbUJBQW1CO0lBQ3RELDhCQUFxQixFQUFHLFlBQVksQ0FBQyxxQkFBcUI7SUFDMUQsV0FBRSxFQUFHLFlBQVksQ0FBQyxFQUFFO0lBQ3BCLGFBQUksRUFBRyxZQUFZLENBQUMsSUFBSTtBQUN6QjtBQUFFLEtBQUs7SUFDTixhQUFJLEVBQUcseUJBQXlCLENBQVM7UUFDeEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsSUFBSyxRQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTVCLENBQTRCLENBQUM7SUFDcEUsQ0FBQztJQUVELGVBQU0sRUFBRyxnQkFBZ0IsTUFBVztRQUFFO2FBQUEsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1lBQWpCOztRQUNyQyxHQUFHLENBQUMsT0FBTSxHQUFJLElBQUksRUFBRTtZQUNuQjtZQUNBLE1BQU0sSUFBSSxTQUFTLENBQUMsNENBQTRDLENBQUM7UUFDbEU7UUFFQSxJQUFNLEdBQUUsRUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVO1lBQzFCLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ2Y7Z0JBQ0EsWUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87b0JBQ2hDLEVBQUUsQ0FBQyxPQUFPLEVBQUMsRUFBRyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUNsQyxDQUFDLENBQUM7WUFDSDtRQUNELENBQUMsQ0FBQztRQUVGLE9BQU8sRUFBRTtJQUNWLENBQUM7SUFFRCxpQ0FBd0IsRUFBRyxrQ0FDMUIsQ0FBTSxFQUNOLElBQXFCO1FBRXJCLEdBQUcsQ0FBQyxpQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLE9BQWEsTUFBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDdkQ7UUFBRSxLQUFLO1lBQ04sT0FBTyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUNoRDtJQUNELENBQUM7SUFFRCw0QkFBbUIsRUFBRyw2QkFBNkIsQ0FBTTtRQUN4RCxPQUFPLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssUUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE1QixDQUE0QixDQUFDO0lBQ25GLENBQUM7SUFFRCw4QkFBcUIsRUFBRywrQkFBK0IsQ0FBTTtRQUM1RCxPQUFPLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQ2pDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsSUFBSyxjQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUEzQixDQUEyQjthQUMzQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssYUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTVCLENBQTRCLENBQUM7SUFDN0MsQ0FBQztJQUVELFdBQUUsRUFBRyxZQUFZLE1BQVcsRUFBRSxNQUFXO1FBQ3hDLEdBQUcsQ0FBQyxPQUFNLElBQUssTUFBTSxFQUFFO1lBQ3RCLE9BQU8sT0FBTSxJQUFLLEVBQUMsR0FBSSxFQUFDLEVBQUcsT0FBTSxJQUFLLEVBQUMsRUFBRyxNQUFNLEVBQUU7UUFDbkQ7UUFDQSxPQUFPLE9BQU0sSUFBSyxPQUFNLEdBQUksT0FBTSxJQUFLLE1BQU0sRUFBRTtJQUNoRCxDQUFDO0FBQ0Y7QUFFQSxHQUFHLENBQUMsYUFBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0lBQ3pCLElBQU0sYUFBWSxFQUFHLGdCQUFNLENBQUMsTUFBTTtJQUNsQyxrQ0FBeUIsRUFBRyxZQUFZLENBQUMseUJBQXlCO0lBQ2xFLGdCQUFPLEVBQUcsWUFBWSxDQUFDLE9BQU87SUFDOUIsZUFBTSxFQUFHLFlBQVksQ0FBQyxNQUFNO0FBQzdCO0FBQUUsS0FBSztJQUNOLGtDQUF5QixFQUFHLG1DQUFtQyxDQUFNO1FBQ3BFLE9BQU8sMkJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUNuQyxVQUFDLFFBQVEsRUFBRSxHQUFHO1lBQ2IsUUFBUSxDQUFDLEdBQUcsRUFBQyxFQUFHLGdDQUF3QixDQUFDLENBQUMsRUFBRSxHQUFHLENBQUU7WUFDakQsT0FBTyxRQUFRO1FBQ2hCLENBQUMsRUFDRCxFQUEyQyxDQUMzQztJQUNGLENBQUM7SUFFRCxnQkFBTyxFQUFHLGlCQUFpQixDQUFNO1FBQ2hDLE9BQU8sWUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsSUFBSyxRQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQWtCLEVBQTlCLENBQThCLENBQUM7SUFDNUQsQ0FBQztJQUVELGVBQU0sRUFBRyxnQkFBZ0IsQ0FBTTtRQUM5QixPQUFPLFlBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssUUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFOLENBQU0sQ0FBQztJQUNwQyxDQUFDO0FBQ0Y7Ozs7Ozs7Ozs7OztBQzNNQTtBQUNBO0FBQ0E7QUFzQkE7OztBQUdhLDJCQUFrQixFQUFHLE1BQU07QUFFeEM7OztBQUdhLDJCQUFrQixFQUFHLE1BQU07QUFFeEM7OztBQUdhLDBCQUFpQixFQUFHLE1BQU07QUFFdkM7OztBQUdhLDBCQUFpQixFQUFHLE1BQU07QUFxR3ZDLEdBQUcsQ0FBQyxhQUFHLENBQUMsWUFBWSxFQUFDLEdBQUksYUFBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7SUFDL0Msc0JBQWEsRUFBRyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhO0lBQzNDLFlBQUcsRUFBRyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHO0lBRXZCLG9CQUFXLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0lBQzdELGlCQUFRLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQ3ZELGlCQUFRLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQ3ZELGtCQUFTLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQ3pELGVBQU0sRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDbkQsbUJBQVUsRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7QUFDNUQ7QUFBRSxLQUFLO0lBQ047Ozs7OztJQU1BLElBQU0seUJBQXNCLEVBQUcsVUFDOUIsSUFBWSxFQUNaLElBQVksRUFDWixNQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsS0FBc0I7UUFBdEIscUNBQXNCO1FBRXRCLEdBQUcsQ0FBQyxLQUFJLEdBQUksSUFBSSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxTQUFTLENBQUMsVUFBUyxFQUFHLEtBQUksRUFBRyw2Q0FBNkMsQ0FBQztRQUN0RjtRQUVBLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxNQUFNO1FBQzFCLFNBQVEsRUFBRyxTQUFRLElBQUssU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRO1FBQ2xFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELHNCQUFhLEVBQUc7UUFBdUI7YUFBQSxVQUF1QixFQUF2QixxQkFBdUIsRUFBdkIsSUFBdUI7WUFBdkI7O1FBQ3RDO1FBQ0EsSUFBTSxPQUFNLEVBQUcsU0FBUyxDQUFDLE1BQU07UUFDL0IsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ1osT0FBTyxFQUFFO1FBQ1Y7UUFFQSxJQUFNLGFBQVksRUFBRyxNQUFNLENBQUMsWUFBWTtRQUN4QyxJQUFNLFNBQVEsRUFBRyxNQUFNO1FBQ3ZCLElBQUksVUFBUyxFQUFhLEVBQUU7UUFDNUIsSUFBSSxNQUFLLEVBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxPQUFNLEVBQUcsRUFBRTtRQUVmLE9BQU8sRUFBRSxNQUFLLEVBQUcsTUFBTSxFQUFFO1lBQ3hCLElBQUksVUFBUyxFQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEM7WUFDQSxJQUFJLFFBQU8sRUFDVixRQUFRLENBQUMsU0FBUyxFQUFDLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUMsSUFBSyxVQUFTLEdBQUksVUFBUyxHQUFJLEVBQUMsR0FBSSxVQUFTLEdBQUksUUFBUTtZQUN0RyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsTUFBTSxVQUFVLENBQUMsNENBQTJDLEVBQUcsU0FBUyxDQUFDO1lBQzFFO1lBRUEsR0FBRyxDQUFDLFVBQVMsR0FBSSxNQUFNLEVBQUU7Z0JBQ3hCO2dCQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFCO1lBQUUsS0FBSztnQkFDTjtnQkFDQTtnQkFDQSxVQUFTLEdBQUksT0FBTztnQkFDcEIsSUFBSSxjQUFhLEVBQUcsQ0FBQyxVQUFTLEdBQUksRUFBRSxFQUFDLEVBQUcsMEJBQWtCO2dCQUMxRCxJQUFJLGFBQVksRUFBRyxVQUFTLEVBQUcsTUFBSyxFQUFHLHlCQUFpQjtnQkFDeEQsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO1lBQzVDO1lBRUEsR0FBRyxDQUFDLE1BQUssRUFBRyxFQUFDLElBQUssT0FBTSxHQUFJLFNBQVMsQ0FBQyxPQUFNLEVBQUcsUUFBUSxFQUFFO2dCQUN4RCxPQUFNLEdBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO2dCQUM3QyxTQUFTLENBQUMsT0FBTSxFQUFHLENBQUM7WUFDckI7UUFDRDtRQUNBLE9BQU8sTUFBTTtJQUNkLENBQUM7SUFFRCxZQUFHLEVBQUcsYUFBYSxRQUE4QjtRQUFFO2FBQUEsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO1lBQXZCOztRQUNsRCxJQUFJLFdBQVUsRUFBRyxRQUFRLENBQUMsR0FBRztRQUM3QixJQUFJLE9BQU0sRUFBRyxFQUFFO1FBQ2YsSUFBSSxpQkFBZ0IsRUFBRyxhQUFhLENBQUMsTUFBTTtRQUUzQyxHQUFHLENBQUMsU0FBUSxHQUFJLEtBQUksR0FBSSxRQUFRLENBQUMsSUFBRyxHQUFJLElBQUksRUFBRTtZQUM3QyxNQUFNLElBQUksU0FBUyxDQUFDLDhEQUE4RCxDQUFDO1FBQ3BGO1FBRUEsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxTQUFNLEVBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFDLEVBQUcsUUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVELE9BQU0sR0FBSSxVQUFVLENBQUMsQ0FBQyxFQUFDLEVBQUcsQ0FBQyxFQUFDLEVBQUcsaUJBQWdCLEdBQUksRUFBQyxFQUFHLFNBQU0sRUFBRyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUMzRjtRQUVBLE9BQU8sTUFBTTtJQUNkLENBQUM7SUFFRCxvQkFBVyxFQUFHLHFCQUFxQixJQUFZLEVBQUUsUUFBb0I7UUFBcEIsdUNBQW9CO1FBQ3BFO1FBQ0EsR0FBRyxDQUFDLEtBQUksR0FBSSxJQUFJLEVBQUU7WUFDakIsTUFBTSxJQUFJLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQztRQUNuRTtRQUNBLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxNQUFNO1FBRTFCLEdBQUcsQ0FBQyxTQUFRLElBQUssUUFBUSxFQUFFO1lBQzFCLFNBQVEsRUFBRyxDQUFDO1FBQ2I7UUFDQSxHQUFHLENBQUMsU0FBUSxFQUFHLEVBQUMsR0FBSSxTQUFRLEdBQUksTUFBTSxFQUFFO1lBQ3ZDLE9BQU8sU0FBUztRQUNqQjtRQUVBO1FBQ0EsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQUssR0FBSSwyQkFBa0IsR0FBSSxNQUFLLEdBQUksMkJBQWtCLEdBQUksT0FBTSxFQUFHLFNBQVEsRUFBRyxDQUFDLEVBQUU7WUFDeEY7WUFDQTtZQUNBLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUSxFQUFHLENBQUMsQ0FBQztZQUM1QyxHQUFHLENBQUMsT0FBTSxHQUFJLDBCQUFpQixHQUFJLE9BQU0sR0FBSSx5QkFBaUIsRUFBRTtnQkFDL0QsT0FBTyxDQUFDLE1BQUssRUFBRywwQkFBa0IsRUFBQyxFQUFHLE1BQUssRUFBRyxPQUFNLEVBQUcsMEJBQWlCLEVBQUcsT0FBTztZQUNuRjtRQUNEO1FBQ0EsT0FBTyxLQUFLO0lBQ2IsQ0FBQztJQUVELGlCQUFRLEVBQUcsa0JBQWtCLElBQVksRUFBRSxNQUFjLEVBQUUsV0FBb0I7UUFDOUUsR0FBRyxDQUFDLFlBQVcsR0FBSSxJQUFJLEVBQUU7WUFDeEIsWUFBVyxFQUFHLElBQUksQ0FBQyxNQUFNO1FBQzFCO1FBRUEsNkZBQWlHLEVBQWhHLFlBQUksRUFBRSxjQUFNLEVBQUUsbUJBQVc7UUFFMUIsSUFBTSxNQUFLLEVBQUcsWUFBVyxFQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ3pDLEdBQUcsQ0FBQyxNQUFLLEVBQUcsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxLQUFLO1FBQ2I7UUFFQSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBQyxJQUFLLE1BQU07O0lBQ2pELENBQUM7SUFFRCxpQkFBUSxFQUFHLGtCQUFrQixJQUFZLEVBQUUsTUFBYyxFQUFFLFFBQW9CO1FBQXBCLHVDQUFvQjtRQUM5RSxvRkFBcUYsRUFBcEYsWUFBSSxFQUFFLGNBQU0sRUFBRSxnQkFBUTtRQUN2QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxJQUFLLENBQUMsQ0FBQzs7SUFDN0MsQ0FBQztJQUVELGVBQU0sRUFBRyxnQkFBZ0IsSUFBWSxFQUFFLEtBQWlCO1FBQWpCLGlDQUFpQjtRQUN2RDtRQUNBLEdBQUcsQ0FBQyxLQUFJLEdBQUksSUFBSSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLENBQUM7UUFDOUQ7UUFDQSxHQUFHLENBQUMsTUFBSyxJQUFLLEtBQUssRUFBRTtZQUNwQixNQUFLLEVBQUcsQ0FBQztRQUNWO1FBQ0EsR0FBRyxDQUFDLE1BQUssRUFBRyxFQUFDLEdBQUksTUFBSyxJQUFLLFFBQVEsRUFBRTtZQUNwQyxNQUFNLElBQUksVUFBVSxDQUFDLHFEQUFxRCxDQUFDO1FBQzVFO1FBRUEsSUFBSSxPQUFNLEVBQUcsRUFBRTtRQUNmLE9BQU8sS0FBSyxFQUFFO1lBQ2IsR0FBRyxDQUFDLE1BQUssRUFBRyxDQUFDLEVBQUU7Z0JBQ2QsT0FBTSxHQUFJLElBQUk7WUFDZjtZQUNBLEdBQUcsQ0FBQyxNQUFLLEVBQUcsQ0FBQyxFQUFFO2dCQUNkLEtBQUksR0FBSSxJQUFJO1lBQ2I7WUFDQSxNQUFLLElBQUssQ0FBQztRQUNaO1FBQ0EsT0FBTyxNQUFNO0lBQ2QsQ0FBQztJQUVELG1CQUFVLEVBQUcsb0JBQW9CLElBQVksRUFBRSxNQUFjLEVBQUUsUUFBb0I7UUFBcEIsdUNBQW9CO1FBQ2xGLE9BQU0sRUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLHNGQUF1RixFQUF0RixZQUFJLEVBQUUsY0FBTSxFQUFFLGdCQUFRO1FBRXZCLElBQU0sSUFBRyxFQUFHLFNBQVEsRUFBRyxNQUFNLENBQUMsTUFBTTtRQUNwQyxHQUFHLENBQUMsSUFBRyxFQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEIsT0FBTyxLQUFLO1FBQ2I7UUFFQSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBQyxJQUFLLE1BQU07O0lBQzVDLENBQUM7QUFDRjtBQUVBLEdBQUcsQ0FBQyxhQUFHLENBQUMsZUFBZSxDQUFDLEVBQUU7SUFDekIsZUFBTSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUNuRCxpQkFBUSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUN4RDtBQUFFLEtBQUs7SUFDTixlQUFNLEVBQUcsZ0JBQWdCLElBQVksRUFBRSxTQUFpQixFQUFFLFVBQXdCO1FBQXhCLDZDQUF3QjtRQUNqRixHQUFHLENBQUMsS0FBSSxJQUFLLEtBQUksR0FBSSxLQUFJLElBQUssU0FBUyxFQUFFO1lBQ3hDLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLENBQUM7UUFDOUQ7UUFFQSxHQUFHLENBQUMsVUFBUyxJQUFLLFFBQVEsRUFBRTtZQUMzQixNQUFNLElBQUksVUFBVSxDQUFDLHFEQUFxRCxDQUFDO1FBQzVFO1FBRUEsR0FBRyxDQUFDLFVBQVMsSUFBSyxLQUFJLEdBQUksVUFBUyxJQUFLLFVBQVMsR0FBSSxVQUFTLEVBQUcsQ0FBQyxFQUFFO1lBQ25FLFVBQVMsRUFBRyxDQUFDO1FBQ2Q7UUFFQSxJQUFJLFFBQU8sRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sUUFBTyxFQUFHLFVBQVMsRUFBRyxPQUFPLENBQUMsTUFBTTtRQUUxQyxHQUFHLENBQUMsUUFBTyxFQUFHLENBQUMsRUFBRTtZQUNoQixRQUFPO2dCQUNOLGNBQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFPLEVBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFDO29CQUMzRCxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFPLEVBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNsRDtRQUVBLE9BQU8sT0FBTztJQUNmLENBQUM7SUFFRCxpQkFBUSxFQUFHLGtCQUFrQixJQUFZLEVBQUUsU0FBaUIsRUFBRSxVQUF3QjtRQUF4Qiw2Q0FBd0I7UUFDckYsR0FBRyxDQUFDLEtBQUksSUFBSyxLQUFJLEdBQUksS0FBSSxJQUFLLFNBQVMsRUFBRTtZQUN4QyxNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO1FBQzlEO1FBRUEsR0FBRyxDQUFDLFVBQVMsSUFBSyxRQUFRLEVBQUU7WUFDM0IsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1REFBdUQsQ0FBQztRQUM5RTtRQUVBLEdBQUcsQ0FBQyxVQUFTLElBQUssS0FBSSxHQUFJLFVBQVMsSUFBSyxVQUFTLEdBQUksVUFBUyxFQUFHLENBQUMsRUFBRTtZQUNuRSxVQUFTLEVBQUcsQ0FBQztRQUNkO1FBRUEsSUFBSSxRQUFPLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFFBQU8sRUFBRyxVQUFTLEVBQUcsT0FBTyxDQUFDLE1BQU07UUFFMUMsR0FBRyxDQUFDLFFBQU8sRUFBRyxDQUFDLEVBQUU7WUFDaEIsUUFBTztnQkFDTixjQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQztvQkFDM0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBTyxFQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUM7b0JBQ2hELE9BQU87UUFDVDtRQUVBLE9BQU8sT0FBTztJQUNmLENBQUM7QUFDRjs7Ozs7Ozs7Ozs7O0FWdFhBO0FBQ0E7QUFFQSxrQkFBZSxhQUFHO0FBQ2xCO0FBRUE7QUFFQTtBQUNBLFNBQUcsQ0FDRixXQUFXLEVBQ1g7SUFDQyxPQUFPLENBQ04sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxJQUFLLFdBQUcsR0FBSSxnQkFBTSxDQUFDLEtBQUssRUFBbkIsQ0FBbUIsRUFBQztRQUNsRCxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxJQUFLLFdBQUcsR0FBSSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQTdCLENBQTZCLENBQUMsQ0FDakY7QUFDRixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUNGLGdCQUFnQixFQUNoQjtJQUNDLEdBQUcsQ0FBQyxPQUFNLEdBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ3JDO1FBQ0EsT0FBYSxDQUFDLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUssQ0FBQztJQUM3RDtJQUNBLE9BQU8sS0FBSztBQUNiLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRCxTQUFHLENBQUMsV0FBVyxFQUFFLGNBQU0sa0JBQVUsR0FBSSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQXBDLENBQW9DLEVBQUUsSUFBSSxDQUFDO0FBRWxFO0FBQ0EsU0FBRyxDQUNGLFNBQVMsRUFDVDtJQUNDLEdBQUcsQ0FBQyxPQUFPLGdCQUFNLENBQUMsSUFBRyxJQUFLLFVBQVUsRUFBRTtRQUNyQzs7Ozs7UUFLQSxJQUFJO1lBQ0gsSUFBTSxJQUFHLEVBQUcsSUFBSSxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEMsT0FBTyxDQUNOLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDO2dCQUNWLE9BQU8sR0FBRyxDQUFDLEtBQUksSUFBSyxXQUFVO2dCQUM5QixhQUFHLENBQUMsWUFBWSxFQUFDO2dCQUNqQixPQUFPLEdBQUcsQ0FBQyxPQUFNLElBQUssV0FBVTtnQkFDaEMsT0FBTyxHQUFHLENBQUMsUUFBTyxJQUFLLFVBQVUsQ0FDakM7UUFDRjtRQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDWDtZQUNBLE9BQU8sS0FBSztRQUNiO0lBQ0Q7SUFDQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQ7QUFDQSxTQUFHLENBQ0YsVUFBVSxFQUNWO0lBQ0MsT0FBTztRQUNOLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxRQUFRO1FBQ1IsTUFBTTtRQUNOO0tBQ0EsQ0FBQyxLQUFLLENBQUMsVUFBQyxJQUFJLElBQUssY0FBTyxnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsSUFBSyxVQUFVLEVBQXZDLENBQXVDLENBQUM7QUFDM0QsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVELFNBQUcsQ0FDRixlQUFlLEVBQ2Y7SUFDQyxHQUFHLENBQUMsT0FBTSxHQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFO1FBQzFCO1FBQ0EsT0FBYSxJQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUMsSUFBSyxDQUFDLENBQUM7SUFDOUM7SUFDQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQ7QUFDQSxTQUFHLENBQ0YsWUFBWSxFQUNaO0lBQ0MsT0FBTyxDQUNOLGFBQUcsQ0FBQyxZQUFZLEVBQUM7UUFDakIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUNoRSxVQUFDLElBQUksSUFBSyxjQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFLLFVBQVUsRUFBekMsQ0FBeUMsQ0FDbkQsQ0FDRDtBQUNGLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRCxTQUFHLENBQ0YsZUFBZSxFQUNmO0lBQ0MsT0FBTyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLENBQzlELFVBQUMsSUFBSSxJQUFLLGNBQU8sZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUssVUFBVSxFQUF6QyxDQUF5QyxDQUNuRDtBQUNGLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRDtBQUNBLFNBQUcsQ0FBQyxlQUFlLEVBQUUsY0FBTSxjQUFPLGdCQUFNLENBQUMsV0FBVSxJQUFLLFdBQVcsRUFBeEMsQ0FBd0MsRUFBRSxJQUFJLENBQUM7QUFFMUU7QUFDQSxTQUFHLENBQUMsYUFBYSxFQUFFLGNBQU0sY0FBTyxnQkFBTSxDQUFDLFFBQU8sSUFBSyxZQUFXLEdBQUksYUFBRyxDQUFDLFlBQVksQ0FBQyxFQUExRCxDQUEwRCxFQUFFLElBQUksQ0FBQztBQUUxRjtBQUNBLFNBQUcsQ0FDRixTQUFTLEVBQ1Q7SUFDQyxHQUFHLENBQUMsT0FBTyxnQkFBTSxDQUFDLElBQUcsSUFBSyxVQUFVLEVBQUU7UUFDckM7UUFDQSxJQUFNLElBQUcsRUFBRyxJQUFJLGdCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxHQUFJLE9BQU0sR0FBSSxJQUFHLEdBQUksT0FBTyxHQUFHLENBQUMsS0FBSSxJQUFLLFdBQVUsR0FBSSxhQUFHLENBQUMsWUFBWSxDQUFDO0lBQzFGO0lBQ0EsT0FBTyxLQUFLO0FBQ2IsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVEO0FBQ0EsU0FBRyxDQUNGLFlBQVksRUFDWjtJQUNDLE9BQU8sQ0FDTjtRQUNDO1FBQ0E7S0FDQSxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxjQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQyxJQUFLLFVBQVUsRUFBeEMsQ0FBd0MsRUFBQztRQUMxRDtZQUNDO1lBQ0EsYUFBYTtZQUNiLFdBQVc7WUFDWCxRQUFRO1lBQ1IsWUFBWTtZQUNaLFVBQVU7WUFDVjtTQUNBLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxJQUFLLGNBQU8sZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBQyxJQUFLLFVBQVUsRUFBbEQsQ0FBa0QsQ0FBQyxDQUNwRTtBQUNGLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRCxTQUFHLENBQ0YsZ0JBQWdCLEVBQ2hCO0lBQ0MscUJBQXFCLFFBQThCO1FBQUU7YUFBQSxVQUF1QixFQUF2QixxQkFBdUIsRUFBdkIsSUFBdUI7WUFBdkI7O1FBQ3BELElBQU0sT0FBTSxtQkFBTyxRQUFRLENBQUM7UUFDM0IsTUFBYyxDQUFDLElBQUcsRUFBRyxRQUFRLENBQUMsR0FBRztRQUNsQyxPQUFPLE1BQU07SUFDZDtJQUVBLEdBQUcsQ0FBQyxNQUFLLEdBQUksZ0JBQU0sQ0FBQyxNQUFNLEVBQUU7UUFDM0IsSUFBSSxFQUFDLEVBQUcsQ0FBQztRQUNULElBQUksU0FBUSxFQUFHLFdBQVcsMEZBQU0sRUFBQyxFQUFFLEtBQUgsQ0FBQyxDQUFFO1FBRWxDLFFBQWdCLENBQUMsSUFBRyxFQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQU0sY0FBYSxFQUFHLGdCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLElBQUssT0FBTztRQUVqRSxPQUFPLGFBQWE7SUFDckI7SUFFQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUNGLGVBQWUsRUFDZjtJQUNDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxJQUFLLGNBQU8sZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBQyxJQUFLLFVBQVUsRUFBbEQsQ0FBa0QsQ0FBQztBQUNqRyxDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQ7QUFDQSxTQUFHLENBQUMsWUFBWSxFQUFFLGNBQU0sY0FBTyxnQkFBTSxDQUFDLE9BQU0sSUFBSyxZQUFXLEdBQUksT0FBTyxNQUFNLEdBQUUsSUFBSyxRQUFRLEVBQXBFLENBQW9FLEVBQUUsSUFBSSxDQUFDO0FBRW5HO0FBQ0EsU0FBRyxDQUNGLGFBQWEsRUFDYjtJQUNDLEdBQUcsQ0FBQyxPQUFPLGdCQUFNLENBQUMsUUFBTyxJQUFLLFdBQVcsRUFBRTtRQUMxQztRQUNBLElBQU0sS0FBSSxFQUFHLEVBQUU7UUFDZixJQUFNLEtBQUksRUFBRyxFQUFFO1FBQ2YsSUFBTSxJQUFHLEVBQUcsSUFBSSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbkIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFLLEVBQUMsR0FBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUMsSUFBSyxJQUFHLEdBQUksYUFBRyxDQUFDLFlBQVksQ0FBQztJQUM1RTtJQUNBLE9BQU8sS0FBSztBQUNiLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRDtBQUNBLFNBQUcsQ0FBQyxZQUFZLEVBQUUsY0FBTSxvQkFBRyxDQUFDLGFBQWEsRUFBQyxHQUFJLGFBQUcsQ0FBQyxXQUFXLEVBQUMsR0FBSSxhQUFHLENBQUMsc0JBQXNCLENBQUMsRUFBckUsQ0FBcUUsRUFBRSxJQUFJLENBQUM7QUFDcEcsU0FBRyxDQUNGLGFBQWEsRUFDYjtJQUNDO0lBQ0E7SUFDQSxPQUFPLE9BQU8sZ0JBQU0sQ0FBQyxPQUFNLElBQUssWUFBVyxHQUFJLE9BQU8sZ0JBQU0sQ0FBQyxZQUFXLElBQUssVUFBVTtBQUN4RixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBQ0QsU0FBRyxDQUFDLEtBQUssRUFBRSxjQUFNLGNBQU8sZ0JBQU0sQ0FBQyxzQkFBcUIsSUFBSyxVQUFVLEVBQWxELENBQWtELEVBQUUsSUFBSSxDQUFDO0FBQzFFLFNBQUcsQ0FBQyxjQUFjLEVBQUUsY0FBTSxjQUFPLGdCQUFNLENBQUMsYUFBWSxJQUFLLFdBQVcsRUFBMUMsQ0FBMEMsRUFBRSxJQUFJLENBQUM7QUFFM0U7QUFFQSxTQUFHLENBQ0Ysc0JBQXNCLEVBQ3RCO0lBQ0MsR0FBRyxDQUFDLGFBQUcsQ0FBQyxjQUFjLEVBQUMsR0FBSSxPQUFPLENBQUMsZ0JBQU0sQ0FBQyxpQkFBZ0IsR0FBSSxnQkFBTSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7UUFDN0Y7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFNLFFBQU8sRUFBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUM3QztRQUNBLElBQU0scUJBQW9CLEVBQUcsZ0JBQU0sQ0FBQyxpQkFBZ0IsR0FBSSxnQkFBTSxDQUFDLHNCQUFzQjtRQUNyRixJQUFNLFNBQVEsRUFBRyxJQUFJLG9CQUFvQixDQUFDLGNBQVksQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUksQ0FBRSxDQUFDO1FBRS9DLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7UUFFN0MsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUM5QztJQUNBLE9BQU8sS0FBSztBQUNiLENBQUMsRUFDRCxJQUFJLENBQ0o7Ozs7Ozs7Ozs7OztBV2xRRDtBQUNBO0FBR0EscUJBQXFCLElBQTJCO0lBQy9DLEdBQUcsQ0FBQyxLQUFJLEdBQUksSUFBSSxDQUFDLFNBQVEsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzNDLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDaEI7QUFDRDtBQUVBLHdCQUF3QixJQUFlLEVBQUUsVUFBb0M7SUFDNUUsT0FBTztRQUNOLE9BQU8sRUFBRTtZQUNSLElBQUksQ0FBQyxRQUFPLEVBQUcsY0FBWSxDQUFDO1lBQzVCLElBQUksQ0FBQyxTQUFRLEVBQUcsS0FBSztZQUNyQixJQUFJLENBQUMsU0FBUSxFQUFHLElBQUk7WUFFcEIsR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDZixVQUFVLEVBQUU7WUFDYjtRQUNEO0tBQ0E7QUFDRjtBQVlBLElBQUksbUJBQStCO0FBQ25DLElBQUksVUFBdUI7QUFFM0I7Ozs7OztBQU1hLGtCQUFTLEVBQUcsQ0FBQztJQUN6QixJQUFJLFVBQW1DO0lBQ3ZDLElBQUksT0FBa0M7SUFFdEM7SUFDQSxHQUFHLENBQUMsYUFBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ3ZCLElBQU0sUUFBSyxFQUFnQixFQUFFO1FBRTdCLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVMsS0FBdUI7WUFDbEU7WUFDQSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU0sSUFBSyxpQkFBTSxHQUFJLEtBQUssQ0FBQyxLQUFJLElBQUssb0JBQW9CLEVBQUU7Z0JBQ25FLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBRXZCLEdBQUcsQ0FBQyxPQUFLLENBQUMsTUFBTSxFQUFFO29CQUNqQixXQUFXLENBQUMsT0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMzQjtZQUNEO1FBQ0QsQ0FBQyxDQUFDO1FBRUYsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoQixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUM7UUFDOUMsQ0FBQztJQUNGO0lBQUUsS0FBSyxHQUFHLENBQUMsYUFBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1FBQy9CLFdBQVUsRUFBRyxnQkFBTSxDQUFDLGNBQWM7UUFDbEMsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxPQUFPLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0Y7SUFBRSxLQUFLO1FBQ04sV0FBVSxFQUFHLGdCQUFNLENBQUMsWUFBWTtRQUNoQyxRQUFPLEVBQUcsVUFBUyxJQUFlO1lBQ2pDLE9BQU8sVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0Y7SUFFQSxtQkFBbUIsUUFBaUM7UUFDbkQsSUFBTSxLQUFJLEVBQWM7WUFDdkIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUU7U0FDVjtRQUNELElBQU0sR0FBRSxFQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFN0IsT0FBTyxjQUFjLENBQ3BCLElBQUksRUFDSixXQUFVO1lBQ1Q7Z0JBQ0MsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FDRjtJQUNGO0lBRUE7SUFDQSxPQUFPLGFBQUcsQ0FBQyxZQUFZO1FBQ3RCLEVBQUU7UUFDRixFQUFFLFVBQVMsUUFBaUM7WUFDMUMsbUJBQW1CLEVBQUU7WUFDckIsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQzNCLENBQUM7QUFDSixDQUFDLENBQUMsRUFBRTtBQUVKO0FBQ0E7QUFDQSxHQUFHLENBQUMsQ0FBQyxhQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7SUFDdkIsSUFBSSxvQkFBaUIsRUFBRyxLQUFLO0lBRTdCLFdBQVUsRUFBRyxFQUFFO0lBQ2Ysb0JBQW1CLEVBQUc7UUFDckIsR0FBRyxDQUFDLENBQUMsbUJBQWlCLEVBQUU7WUFDdkIsb0JBQWlCLEVBQUcsSUFBSTtZQUN4QixpQkFBUyxDQUFDO2dCQUNULG9CQUFpQixFQUFHLEtBQUs7Z0JBRXpCLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUN0QixJQUFJLEtBQUksUUFBdUI7b0JBQy9CLE9BQU8sQ0FBQyxLQUFJLEVBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7d0JBQ25DLFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ2xCO2dCQUNEO1lBQ0QsQ0FBQyxDQUFDO1FBQ0g7SUFDRCxDQUFDO0FBQ0Y7QUFFQTs7Ozs7Ozs7O0FBU2EsMkJBQWtCLEVBQUcsQ0FBQztJQUNsQyxHQUFHLENBQUMsQ0FBQyxhQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEIsT0FBTyxpQkFBUztJQUNqQjtJQUVBLDRCQUE0QixRQUFpQztRQUM1RCxJQUFNLEtBQUksRUFBYztZQUN2QixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRTtTQUNWO1FBQ0QsSUFBTSxNQUFLLEVBQVcscUJBQXFCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekUsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFO1lBQzNCLG9CQUFvQixDQUFDLEtBQUssQ0FBQztRQUM1QixDQUFDLENBQUM7SUFDSDtJQUVBO0lBQ0EsT0FBTyxhQUFHLENBQUMsWUFBWTtRQUN0QixFQUFFO1FBQ0YsRUFBRSxVQUFTLFFBQWlDO1lBQzFDLG1CQUFtQixFQUFFO1lBQ3JCLE9BQU8sa0JBQWtCLENBQUMsUUFBUSxDQUFDO1FBQ3BDLENBQUM7QUFDSixDQUFDLENBQUMsRUFBRTtBQUVKOzs7Ozs7Ozs7O0FBVVcsdUJBQWMsRUFBRyxDQUFDO0lBQzVCLElBQUksT0FBa0M7SUFFdEMsR0FBRyxDQUFDLGFBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUNyQixRQUFPLEVBQUcsVUFBUyxJQUFlO1lBQ2pDLGdCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxDQUFDO0lBQ0Y7SUFBRSxLQUFLLEdBQUcsQ0FBQyxhQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFDOUIsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMvQyxDQUFDO0lBQ0Y7SUFBRSxLQUFLLEdBQUcsQ0FBQyxhQUFHLENBQUMsc0JBQXNCLENBQUMsRUFBRTtRQUN2QztRQUNBLElBQU0scUJBQW9CLEVBQUcsZ0JBQU0sQ0FBQyxpQkFBZ0IsR0FBSSxnQkFBTSxDQUFDLHNCQUFzQjtRQUNyRixJQUFNLE9BQUksRUFBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUMxQyxJQUFNLFFBQUssRUFBZ0IsRUFBRTtRQUM3QixJQUFNLFNBQVEsRUFBRyxJQUFJLG9CQUFvQixDQUFDO1lBQ3pDLE9BQU8sT0FBSyxDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7Z0JBQ3hCLElBQU0sS0FBSSxFQUFHLE9BQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQzFCLEdBQUcsQ0FBQyxLQUFJLEdBQUksSUFBSSxDQUFDLFNBQVEsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNoQjtZQUNEO1FBQ0QsQ0FBQyxDQUFDO1FBRUYsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSSxDQUFFLENBQUM7UUFFNUMsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoQixNQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7UUFDdEMsQ0FBQztJQUNGO0lBQUUsS0FBSztRQUNOLFFBQU8sRUFBRyxVQUFTLElBQWU7WUFDakMsbUJBQW1CLEVBQUU7WUFDckIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsQ0FBQztJQUNGO0lBRUEsT0FBTyxVQUFTLFFBQWlDO1FBQ2hELElBQU0sS0FBSSxFQUFjO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFO1NBQ1Y7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRWIsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7QUFDRixDQUFDLENBQUMsRUFBRTs7Ozs7Ozs7Ozs7O0FDM05KOzs7Ozs7Ozs7QUFTQSw0QkFDQyxLQUFRLEVBQ1IsVUFBMkIsRUFDM0IsUUFBd0IsRUFDeEIsWUFBNEI7SUFGNUIsK0NBQTJCO0lBQzNCLDBDQUF3QjtJQUN4QixrREFBNEI7SUFFNUIsT0FBTztRQUNOLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLFVBQVU7UUFDdEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsWUFBWSxFQUFFO0tBQ2Q7QUFDRjtBQVpBO0FBK0JBLG9CQUEyQixjQUF1QztJQUNqRSxPQUFPLFVBQVMsTUFBVztRQUFFO2FBQUEsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkOztRQUM1QixPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztJQUMxQyxDQUFDO0FBQ0Y7QUFKQTs7Ozs7Ozs7Ozs7O0FDeENBO0FBT0E7SUFBdUM7SUFHdEMsa0JBQVksT0FBVTtRQUF0QixZQUNDLGtCQUFPO1FBQ1AsS0FBSSxDQUFDLFNBQVEsRUFBRyxPQUFPOztJQUN4QjtJQUVPLHVCQUFHLEVBQVY7UUFDQyxPQUFPLElBQUksQ0FBQyxRQUFRO0lBQ3JCLENBQUM7SUFFTSx1QkFBRyxFQUFWLFVBQVcsT0FBVTtRQUNwQixJQUFJLENBQUMsU0FBUSxFQUFHLE9BQU87UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFZLENBQUUsQ0FBQztJQUNsQyxDQUFDO0lBQ0YsZUFBQztBQUFELENBaEJBLENBQXVDLGlCQUFPO0FBQWpDO0FBa0JiLGtCQUFlLFFBQVE7Ozs7Ozs7Ozs7OztBQ3pCdkI7QUFFQTtBQUdBOzs7OztBQUtBLElBQVksYUFHWDtBQUhELFdBQVksYUFBYTtJQUN4Qix3Q0FBdUI7SUFDdkIsa0NBQWlCO0FBQ2xCLENBQUMsRUFIVyxjQUFhLEVBQWIsc0JBQWEsSUFBYixzQkFBYTtBQVV6QjtJQUFpQztJQUFqQztRQUFBO1FBQ1MsZUFBUSxFQUFHLElBQUksYUFBRyxFQUFtQjs7SUEwQjlDO0lBeEJRLDBCQUFHLEVBQVYsVUFBVyxHQUFXO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzlCLENBQUM7SUFFTSwwQkFBRyxFQUFWLFVBQVcsR0FBVztRQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM5QixDQUFDO0lBRU0sMEJBQUcsRUFBVixVQUFXLE9BQWdCLEVBQUUsR0FBVztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBRyxDQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLDhCQUFPLEVBQWQ7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxPQUFNLENBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRU0sbUNBQVksRUFBbkI7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxVQUFTLENBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRU0sNEJBQUssRUFBWjtRQUNDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0lBQ3RCLENBQUM7SUFDRixrQkFBQztBQUFELENBM0JBLENBQWlDLGlCQUFPO0FBQTNCO0FBNkJiLGtCQUFlLFdBQVc7Ozs7Ozs7Ozs7OztBQ2pEMUI7QUFDQTtBQUNBO0FBRUE7QUFjQTs7O0FBR2EseUJBQWdCLEVBQUcsZ0JBQU0sQ0FBQyxhQUFhLENBQUM7QUE0RHJEOzs7Ozs7QUFNQSxpQ0FBdUUsSUFBUztJQUMvRSxPQUFPLE9BQU8sQ0FBQyxLQUFJLEdBQUksSUFBSSxDQUFDLE1BQUssSUFBSyx3QkFBZ0IsQ0FBQztBQUN4RDtBQUZBO0FBU0EsMENBQW9ELElBQVM7SUFDNUQsT0FBTyxPQUFPLENBQ2IsS0FBSTtRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFDO1FBQzlCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDdEM7QUFDRjtBQVBBO0FBU0E7OztBQUdBO0lBQThCO0lBQTlCOztJQThHQTtJQXRHQzs7O0lBR1EsbUNBQWUsRUFBdkIsVUFBd0IsV0FBMEIsRUFBRSxJQUFzQztRQUN6RixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1QsSUFBSSxFQUFFLFdBQVc7WUFDakIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsSUFBSTtTQUNKLENBQUM7SUFDSCxDQUFDO0lBRU0sMEJBQU0sRUFBYixVQUFjLEtBQW9CLEVBQUUsSUFBa0I7UUFBdEQ7UUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFlLElBQUssU0FBUyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxnQkFBZSxFQUFHLElBQUksYUFBRyxFQUFFO1FBQ2pDO1FBRUEsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTJDLEtBQUssQ0FBQyxRQUFRLEdBQUUsS0FBRyxDQUFDO1FBQ2hGO1FBRUEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUVyQyxHQUFHLENBQUMsS0FBSSxXQUFZLGlCQUFPLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FDUixVQUFDLFVBQVU7Z0JBQ1YsS0FBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQztnQkFDM0MsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO2dCQUN2QyxPQUFPLFVBQVU7WUFDbEIsQ0FBQyxFQUNELFVBQUMsS0FBSztnQkFDTCxNQUFNLEtBQUs7WUFDWixDQUFDLENBQ0Q7UUFDRjtRQUFFLEtBQUssR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUNsQztJQUNELENBQUM7SUFFTSxrQ0FBYyxFQUFyQixVQUFzQixLQUFvQixFQUFFLElBQWM7UUFDekQsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBaUIsSUFBSyxTQUFTLEVBQUU7WUFDekMsSUFBSSxDQUFDLGtCQUFpQixFQUFHLElBQUksYUFBRyxFQUFFO1FBQ25DO1FBRUEsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBNkMsS0FBSyxDQUFDLFFBQVEsR0FBRSxLQUFHLENBQUM7UUFDbEY7UUFFQSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFDdkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0lBQ2xDLENBQUM7SUFFTSx1QkFBRyxFQUFWLFVBQWdFLEtBQW9CO1FBQXBGO1FBQ0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixPQUFPLElBQUk7UUFDWjtRQUVBLElBQU0sS0FBSSxFQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUU1QyxHQUFHLENBQUMsdUJBQXVCLENBQUksSUFBSSxDQUFDLEVBQUU7WUFDckMsT0FBTyxJQUFJO1FBQ1o7UUFFQSxHQUFHLENBQUMsS0FBSSxXQUFZLGlCQUFPLEVBQUU7WUFDNUIsT0FBTyxJQUFJO1FBQ1o7UUFFQSxJQUFNLFFBQU8sRUFBbUMsSUFBSyxFQUFFO1FBQ3ZELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7UUFFeEMsT0FBTyxDQUFDLElBQUksQ0FDWCxVQUFDLFVBQVU7WUFDVixHQUFHLENBQUMsZ0NBQWdDLENBQUksVUFBVSxDQUFDLEVBQUU7Z0JBQ3BELFdBQVUsRUFBRyxVQUFVLENBQUMsT0FBTztZQUNoQztZQUVBLEtBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7WUFDM0MsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1lBQ3ZDLE9BQU8sVUFBVTtRQUNsQixDQUFDLEVBQ0QsVUFBQyxLQUFLO1lBQ0wsTUFBTSxLQUFLO1FBQ1osQ0FBQyxDQUNEO1FBRUQsT0FBTyxJQUFJO0lBQ1osQ0FBQztJQUVNLCtCQUFXLEVBQWxCLFVBQXVDLEtBQW9CO1FBQzFELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxJQUFJO1FBQ1o7UUFFQSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFNO0lBQzlDLENBQUM7SUFFTSx1QkFBRyxFQUFWLFVBQVcsS0FBb0I7UUFDOUIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFlLEdBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVNLCtCQUFXLEVBQWxCLFVBQW1CLEtBQW9CO1FBQ3RDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBaUIsR0FBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFDRixlQUFDO0FBQUQsQ0E5R0EsQ0FBOEIsaUJBQU87QUFBeEI7QUFnSGIsa0JBQWUsUUFBUTs7Ozs7Ozs7Ozs7O0FDNU52QjtBQUNBO0FBR0E7QUFPQTtJQUFxQztJQU1wQztRQUFBLFlBQ0Msa0JBQU87UUFOQSxnQkFBUyxFQUFHLElBQUksbUJBQVEsRUFBRTtRQUMxQiw4QkFBdUIsRUFBbUMsSUFBSSxTQUFHLEVBQUU7UUFDbkUsZ0NBQXlCLEVBQW1DLElBQUksU0FBRyxFQUFFO1FBSzVFLEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixJQUFNLFFBQU8sRUFBRztZQUNmLEdBQUcsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixLQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3RELEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQztnQkFDeEQsS0FBSSxDQUFDLGFBQVksRUFBRyxTQUFTO1lBQzlCO1FBQ0QsQ0FBQztRQUNELEtBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLFdBQUUsQ0FBQzs7SUFDdEI7SUFFQSxzQkFBVyxpQ0FBSTthQUFmLFVBQWdCLFlBQXNCO1lBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3RELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUN6RDtZQUNBLElBQUksQ0FBQyxhQUFZLEVBQUcsWUFBWTtRQUNqQyxDQUFDOzs7O0lBRU0saUNBQU0sRUFBYixVQUFjLEtBQW9CLEVBQUUsTUFBb0I7UUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztJQUNyQyxDQUFDO0lBRU0seUNBQWMsRUFBckIsVUFBc0IsS0FBb0IsRUFBRSxRQUFrQjtRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0lBQy9DLENBQUM7SUFFTSw4QkFBRyxFQUFWLFVBQVcsS0FBb0I7UUFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsR0FBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQVksR0FBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRU0sc0NBQVcsRUFBbEIsVUFBbUIsS0FBb0I7UUFDdEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUMsR0FBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQVksR0FBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvRyxDQUFDO0lBRU0sOEJBQUcsRUFBVixVQUNDLEtBQW9CLEVBQ3BCLGdCQUFpQztRQUFqQywyREFBaUM7UUFFakMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDO0lBQy9FLENBQUM7SUFFTSxzQ0FBVyxFQUFsQixVQUF1QyxLQUFvQixFQUFFLGdCQUFpQztRQUFqQywyREFBaUM7UUFDN0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixDQUFDO0lBQ3pGLENBQUM7SUFFTywrQkFBSSxFQUFaLFVBQ0MsS0FBb0IsRUFDcEIsZ0JBQXlCLEVBQ3pCLGVBQXNDLEVBQ3RDLFFBQXdDO1FBSnpDO1FBTUMsSUFBTSxXQUFVLEVBQUcsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMvRyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQU0sU0FBUSxFQUFRLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNkLFFBQVE7WUFDVDtZQUNBLElBQU0sS0FBSSxFQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDN0MsSUFBTSxpQkFBZ0IsRUFBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBQyxHQUFJLEVBQUU7WUFDckQsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUk7WUFDWjtZQUFFLEtBQUssR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTtnQkFDbEQsSUFBTSxPQUFNLEVBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUEwQjtvQkFDNUQsR0FBRyxDQUNGLEtBQUssQ0FBQyxPQUFNLElBQUssU0FBUTt3QkFDeEIsS0FBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBQyxJQUFLLEtBQUssQ0FBQyxJQUNuRSxFQUFFO3dCQUNELEtBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBWSxDQUFFLENBQUM7b0JBQ2xDO2dCQUNELENBQUMsQ0FBQztnQkFDRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLG1CQUFNLGdCQUFnQixHQUFFLEtBQUssR0FBRTtZQUNyRDtRQUNEO1FBQ0EsT0FBTyxJQUFJO0lBQ1osQ0FBQztJQUNGLHNCQUFDO0FBQUQsQ0FyRkEsQ0FBcUMsaUJBQU87QUFBL0I7QUF1RmIsa0JBQWUsZUFBZTs7Ozs7Ozs7Ozs7O0FDbEc5QjtBQUNBO0FBQ0E7QUFDQTtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSyxpQkFLSjtBQUxELFdBQUssaUJBQWlCO0lBQ3JCLHlEQUFRO0lBQ1IscUVBQVU7SUFDVixpRUFBUTtJQUNSLDZEQUFNO0FBQ1AsQ0FBQyxFQUxJLGtCQUFpQixJQUFqQixrQkFBaUI7QUFvQnRCLElBQU0sYUFBWSxFQUFHLElBQUksYUFBRyxFQUFnQztBQUM1RCxJQUFNLFVBQVMsRUFBRyxXQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUVqQzs7O0FBR0E7SUFnREM7OztJQUdBO1FBQUE7UUF4Q0E7OztRQUdRLHdCQUFrQixFQUFHLElBQUk7UUFPakM7OztRQUdRLDBCQUFvQixFQUFhLEVBQUU7UUFjbkMsa0JBQVksRUFBc0IsaUJBQWlCLENBQUMsSUFBSTtRQVF4RCxrQkFBWSxFQUFnQixJQUFJLHFCQUFXLEVBQUU7UUFNcEQsSUFBSSxDQUFDLFVBQVMsRUFBRyxFQUFFO1FBQ25CLElBQUksQ0FBQyxnQkFBZSxFQUFHLElBQUksYUFBRyxFQUFpQjtRQUMvQyxJQUFJLENBQUMsWUFBVyxFQUFNLEVBQUU7UUFDeEIsSUFBSSxDQUFDLGlCQUFnQixFQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM5QyxJQUFJLENBQUMsaUJBQWdCLEVBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRWxELHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDM0IsS0FBSyxFQUFFLElBQUk7WUFDWCxnQkFBZ0IsRUFBRSxVQUFDLE9BQW9CLEVBQUUsR0FBVztnQkFDbkQsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7WUFDcEMsQ0FBQztZQUNELGdCQUFnQixFQUFFLFVBQUMsT0FBb0IsRUFBRSxHQUFXO2dCQUNuRCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsUUFBUSxFQUFFO2dCQUNULEtBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsQ0FBQztZQUNELFFBQVEsRUFBRTtnQkFDVCxLQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLEtBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsQ0FBQztZQUNELFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUM5QixRQUFRLEVBQUU7Z0JBQ1QsT0FBTyxLQUFJLENBQUMsUUFBUTtZQUNyQixDQUFDO1lBQ0QsY0FBYyxFQUFFLEVBQW9CO1lBQ3BDLFVBQVUsRUFBRSxJQUFJLENBQUM7U0FDakIsQ0FBQztRQUVGLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtJQUM3QjtJQUVVLDBCQUFJLEVBQWQsVUFBeUMsUUFBa0M7UUFDMUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxTQUFRLEVBQUcsSUFBSSxhQUFHLEVBQThDO1FBQ3RFO1FBQ0EsSUFBSSxPQUFNLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNaLE9BQU0sRUFBRyxJQUFJLFFBQVEsQ0FBQztnQkFDckIsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ2pDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDOUIsSUFBSSxFQUFFO2FBQ04sQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7UUFDcEM7UUFFQSxPQUFPLE1BQVc7SUFDbkIsQ0FBQztJQUVEOzs7Ozs7SUFNVSxzQ0FBZ0IsRUFBMUIsVUFBMkIsT0FBZ0IsRUFBRSxHQUFvQjtRQUNoRTtJQUNELENBQUM7SUFFRDs7Ozs7O0lBTVUsc0NBQWdCLEVBQTFCLFVBQTJCLE9BQWdCLEVBQUUsR0FBb0I7UUFDaEU7SUFDRCxDQUFDO0lBRVMsOEJBQVEsRUFBbEI7UUFDQztJQUNELENBQUM7SUFFUyw4QkFBUSxFQUFsQjtRQUNDO0lBQ0QsQ0FBQztJQUVELHNCQUFXLGtDQUFVO2FBQXJCO1lBQ0MsT0FBTyxJQUFJLENBQUMsV0FBVztRQUN4QixDQUFDOzs7O0lBRUQsc0JBQVcsMkNBQW1CO2FBQTlCO1lBQ0MsT0FBTSxpQkFBSyxJQUFJLENBQUMsb0JBQW9CO1FBQ3JDLENBQUM7Ozs7SUFFTSwyQ0FBcUIsRUFBNUIsVUFBNkIsY0FBOEI7UUFDMUQsSUFBSSxDQUFDLGFBQVksRUFBRyxpQkFBaUIsQ0FBQyxVQUFVO1FBQ3hDLDhDQUFZO1FBQ3BCLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFFakQsR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsYUFBWSxJQUFLLFlBQVksRUFBRTtZQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSyxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxVQUFTLEVBQUcsSUFBSSx5QkFBZSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ3ZEO1lBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFJLEVBQUcsWUFBWTtZQUNsQyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2xCO1FBQ0EsWUFBWSxDQUFDLGVBQWMsRUFBRyxjQUFjO0lBQzdDLENBQUM7SUFFTSx1Q0FBaUIsRUFBeEIsVUFBeUIsa0JBQXNDO1FBQS9EO1FBQ0MsSUFBSSxDQUFDLGFBQVksRUFBRyxpQkFBaUIsQ0FBQyxVQUFVO1FBQ2hELElBQU0sV0FBVSxFQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQztRQUNoRSxJQUFNLDRCQUEyQixFQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUM7UUFDL0UsSUFBTSxvQkFBbUIsRUFBYSxFQUFFO1FBQ3hDLElBQU0sY0FBYSxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzdDLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFFakQsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBa0IsSUFBSyxNQUFLLEdBQUksMkJBQTJCLENBQUMsT0FBTSxJQUFLLENBQUMsRUFBRTtZQUNsRixJQUFNLGNBQWEsbUJBQU8sYUFBYSxFQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFFLElBQU0sa0JBQWlCLEVBQXdCLEVBQUU7WUFDakQsSUFBTSxvQkFBbUIsRUFBUSxFQUFFO1lBQ25DLElBQUksYUFBWSxFQUFHLEtBQUs7WUFFeEIsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsSUFBTSxhQUFZLEVBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTtvQkFDbkQsUUFBUTtnQkFDVDtnQkFDQSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNwQyxJQUFNLGlCQUFnQixFQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO2dCQUN2RCxJQUFNLFlBQVcsRUFBRyxJQUFJLENBQUMscUJBQXFCLENBQzdDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDeEIsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ2hDO2dCQUNELEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFDLElBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzdELGFBQVksRUFBRyxJQUFJO29CQUNuQixJQUFNLGNBQWEsRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFnQixZQUFjLENBQUM7b0JBQ3ZFLElBQUksQ0FBQyxJQUFJLElBQUMsRUFBRyxDQUFDLEVBQUUsSUFBQyxFQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQU0sT0FBTSxFQUFHLGFBQWEsQ0FBQyxHQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7d0JBQzlELEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBTyxHQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTs0QkFDdkUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzt3QkFDdkM7d0JBQ0EsR0FBRyxDQUFDLGFBQVksR0FBSSxVQUFVLEVBQUU7NEJBQy9CLG1CQUFtQixDQUFDLFlBQVksRUFBQyxFQUFHLE1BQU0sQ0FBQyxLQUFLO3dCQUNqRDtvQkFDRDtnQkFDRDtnQkFBRSxLQUFLO29CQUNOLElBQU0sT0FBTSxFQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBTyxHQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTt3QkFDdkUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDdkM7b0JBQ0EsR0FBRyxDQUFDLGFBQVksR0FBSSxVQUFVLEVBQUU7d0JBQy9CLG1CQUFtQixDQUFDLFlBQVksRUFBQyxFQUFHLE1BQU0sQ0FBQyxLQUFLO29CQUNqRDtnQkFDRDtZQUNEO1lBRUEsR0FBRyxDQUFDLFlBQVksRUFBRTtnQkFDakIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxRQUFRO29CQUN0RixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2pFO2dCQUNELENBQUMsQ0FBQztZQUNIO1lBQ0EsSUFBSSxDQUFDLFlBQVcsRUFBRyxtQkFBbUI7WUFDdEMsSUFBSSxDQUFDLHFCQUFvQixFQUFHLG1CQUFtQjtRQUNoRDtRQUFFLEtBQUs7WUFDTixJQUFJLENBQUMsbUJBQWtCLEVBQUcsS0FBSztZQUMvQixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QyxJQUFNLGFBQVksRUFBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxHQUFHLENBQUMsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFDLElBQUssVUFBVSxFQUFFO29CQUNuRCxVQUFVLENBQUMsWUFBWSxFQUFDLEVBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUNwRCxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQ3hCLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUNoQztnQkFDRjtnQkFBRSxLQUFLO29CQUNOLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZDO1lBQ0Q7WUFDQSxJQUFJLENBQUMscUJBQW9CLEVBQUcsbUJBQW1CO1lBQy9DLElBQUksQ0FBQyxZQUFXLHVCQUFRLFVBQVUsQ0FBRTtRQUNyQztRQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2xCO1FBQUUsS0FBSztZQUNOLElBQUksQ0FBQyxhQUFZLEVBQUcsaUJBQWlCLENBQUMsSUFBSTtRQUMzQztJQUNELENBQUM7SUFFRCxzQkFBVyxnQ0FBUTthQUFuQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFNBQVM7UUFDdEIsQ0FBQzs7OztJQUVNLHFDQUFlLEVBQXRCLFVBQXVCLFFBQXNCO1FBQzVDLElBQUksQ0FBQyxhQUFZLEVBQUcsaUJBQWlCLENBQUMsUUFBUTtRQUM5QyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFNLEVBQUcsRUFBQyxHQUFJLFFBQVEsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO1lBQ3JELElBQUksQ0FBQyxVQUFTLEVBQUcsUUFBUTtZQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2xCO0lBQ0QsQ0FBQztJQUVNLGdDQUFVLEVBQWpCO1FBQ0MsSUFBSSxDQUFDLGFBQVksRUFBRyxpQkFBaUIsQ0FBQyxNQUFNO1FBQzVDLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFDakQsWUFBWSxDQUFDLE1BQUssRUFBRyxLQUFLO1FBQzFCLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUN2QyxJQUFJLE1BQUssRUFBRyxNQUFNLEVBQUU7UUFDcEIsTUFBSyxFQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1FBQ3pCLElBQUksQ0FBQyxhQUFZLEVBQUcsaUJBQWlCLENBQUMsSUFBSTtRQUMxQyxPQUFPLEtBQUs7SUFDYixDQUFDO0lBRU0sZ0NBQVUsRUFBakI7UUFDQyxJQUFNLGFBQVksRUFBRyx3QkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBWSxJQUFLLGlCQUFpQixDQUFDLElBQUksRUFBRTtZQUNqRCxZQUFZLENBQUMsTUFBSyxFQUFHLElBQUk7WUFDekIsR0FBRyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbEMsWUFBWSxDQUFDLGdCQUFnQixFQUFFO1lBQ2hDO1FBQ0Q7UUFBRSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBWSxJQUFLLGlCQUFpQixDQUFDLFVBQVUsRUFBRTtZQUM5RCxZQUFZLENBQUMsTUFBSyxFQUFHLElBQUk7UUFDMUI7UUFBRSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBWSxJQUFLLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUM1RCxZQUFZLENBQUMsTUFBSyxFQUFHLElBQUk7UUFDMUI7SUFDRCxDQUFDO0lBRVMsNEJBQU0sRUFBaEI7UUFDQyxPQUFPLEtBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7SUFNVSxrQ0FBWSxFQUF0QixVQUF1QixZQUFvQixFQUFFLEtBQVU7UUFDdEQsTUFBSyxFQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZDLElBQUksY0FBYSxFQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN0RCxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUU7Z0JBQ25CLGNBQWEsRUFBRyxJQUFJLGFBQUcsRUFBaUI7Z0JBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUM7WUFDbEQ7WUFFQSxJQUFJLHNCQUFxQixFQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO1lBQzNELEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFO2dCQUMzQixzQkFBcUIsRUFBRyxFQUFFO2dCQUMxQixhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQztZQUN2RDtZQUNBLHFCQUFxQixDQUFDLElBQUksT0FBMUIscUJBQXFCLG1CQUFTLEtBQUs7UUFDcEM7UUFBRSxLQUFLO1lBQ04sSUFBTSxXQUFVLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7WUFDbEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxtQkFBTSxVQUFVLEVBQUssS0FBSyxFQUFFO1FBQ2xFO0lBQ0QsQ0FBQztJQUVEOzs7Ozs7O0lBT1EseUNBQW1CLEVBQTNCLFVBQTRCLFlBQW9CO1FBQy9DLElBQU0sY0FBYSxFQUFHLEVBQUU7UUFFeEIsSUFBSSxZQUFXLEVBQUcsSUFBSSxDQUFDLFdBQVc7UUFFbEMsT0FBTyxXQUFXLEVBQUU7WUFDbkIsSUFBTSxZQUFXLEVBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDakQsR0FBRyxDQUFDLFdBQVcsRUFBRTtnQkFDaEIsSUFBTSxXQUFVLEVBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7Z0JBRWhELEdBQUcsQ0FBQyxVQUFVLEVBQUU7b0JBQ2YsYUFBYSxDQUFDLE9BQU8sT0FBckIsYUFBYSxtQkFBWSxVQUFVO2dCQUNwQztZQUNEO1lBRUEsWUFBVyxFQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO1FBQ2pEO1FBRUEsT0FBTyxhQUFhO0lBQ3JCLENBQUM7SUFFRDs7O0lBR1EsOEJBQVEsRUFBaEI7UUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtRQUN6QjtRQUNBLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUSxJQUFLLFNBQVMsRUFBRTtZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7Z0JBQzFCLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZixDQUFDLENBQUM7UUFDSDtJQUNELENBQUM7SUFFRDs7Ozs7O0lBTVUsa0NBQVksRUFBdEIsVUFBdUIsWUFBb0I7UUFDMUMsSUFBSSxjQUFhLEVBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBRTFELEdBQUcsQ0FBQyxjQUFhLElBQUssU0FBUyxFQUFFO1lBQ2hDLE9BQU8sYUFBYTtRQUNyQjtRQUVBLGNBQWEsRUFBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDO1FBRXRELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7UUFDckQsT0FBTyxhQUFhO0lBQ3JCLENBQUM7SUFFTywrQ0FBeUIsRUFBakMsVUFDQyxhQUFrQixFQUNsQixtQkFBNkI7UUFGOUI7UUFJQyxJQUFNLGtCQUFpQixFQUE2QixJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztRQUVyRixPQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxVQUFDLG1CQUFtQixFQUFFLEVBQTBCO2dCQUF4QixzQkFBUSxFQUFFLDhCQUFZO1lBQzdFLElBQUksa0JBQWlCLEVBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUN6RCxHQUFHLENBQUMsa0JBQWlCLElBQUssU0FBUyxFQUFFO2dCQUNwQyxrQkFBaUIsRUFBRztvQkFDbkIsa0JBQWtCLEVBQUUsRUFBRTtvQkFDdEIsYUFBYSxFQUFFLEVBQUU7b0JBQ2pCLE9BQU8sRUFBRTtpQkFDVDtZQUNGO1lBQ0EsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFDLEVBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7WUFDbkYsaUJBQWlCLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBQyxFQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUM7WUFDM0UsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTtnQkFDckQsaUJBQWlCLENBQUMsUUFBTyxFQUFHLElBQUk7WUFDakM7WUFDQSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDO1lBQ3BELE9BQU8sbUJBQW1CO1FBQzNCLENBQUMsRUFBRSxJQUFJLGFBQUcsRUFBdUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7O0lBS1EsMkNBQXFCLEVBQTdCLFVBQThCLFFBQWEsRUFBRSxJQUFTO1FBQ3JELEdBQUcsQ0FBQyxPQUFPLFNBQVEsSUFBSyxXQUFVLEdBQUksa0NBQXVCLENBQUMsUUFBUSxFQUFDLElBQUssS0FBSyxFQUFFO1lBQ2xGLEdBQUcsQ0FBQyxJQUFJLENBQUMseUJBQXdCLElBQUssU0FBUyxFQUFFO2dCQUNoRCxJQUFJLENBQUMseUJBQXdCLEVBQUcsSUFBSSxpQkFBTyxFQUd4QztZQUNKO1lBQ0EsSUFBTSxTQUFRLEVBQStCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLEdBQUksRUFBRTtZQUN4RixrQ0FBUyxFQUFFLHNCQUFLO1lBRXRCLEdBQUcsQ0FBQyxVQUFTLElBQUssVUFBUyxHQUFJLE1BQUssSUFBSyxJQUFJLEVBQUU7Z0JBQzlDLFVBQVMsRUFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBNEI7Z0JBQzFELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxhQUFFLEtBQUssRUFBRSxLQUFJLENBQUUsQ0FBQztZQUN4RTtZQUNBLE9BQU8sU0FBUztRQUNqQjtRQUNBLE9BQU8sUUFBUTtJQUNoQixDQUFDO0lBRUQsc0JBQVcsZ0NBQVE7YUFBbkI7WUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSyxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxVQUFTLEVBQUcsSUFBSSx5QkFBZSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ3ZEO1lBQ0EsT0FBTyxJQUFJLENBQUMsU0FBUztRQUN0QixDQUFDOzs7O0lBRU8sMENBQW9CLEVBQTVCLFVBQTZCLFVBQWU7UUFBNUM7UUFDQyxJQUFNLGlCQUFnQixFQUF1QixJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1FBQ2xGLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUM3QixVQUFDLFVBQVUsRUFBRSx3QkFBd0I7Z0JBQ3BDLE9BQU0scUJBQU0sVUFBVSxFQUFLLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsVUFBVSxDQUFDO1lBQzNFLENBQUMsdUJBQ0ksVUFBVSxFQUNmO1FBQ0Y7UUFDQSxPQUFPLFVBQVU7SUFDbEIsQ0FBQztJQUVEOzs7SUFHUSx1Q0FBaUIsRUFBekI7UUFBQTtRQUNDLElBQU0sY0FBYSxFQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO1FBRXZELEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtZQUM3QixPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFjLEVBQUUsb0JBQWtDO2dCQUM5RSxJQUFNLGNBQWEsRUFBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLE1BQU0sRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQy9GLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRTtvQkFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyx1RUFBdUUsQ0FBQztvQkFDckYsT0FBTyxNQUFNO2dCQUNkO2dCQUNBLE9BQU8sYUFBYTtZQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQzFCO1FBQ0EsT0FBTyxJQUFJLENBQUMsZ0JBQWdCO0lBQzdCLENBQUM7SUFFRDs7Ozs7SUFLVSxxQ0FBZSxFQUF6QixVQUEwQixLQUFzQjtRQUFoRDtRQUNDLElBQU0sYUFBWSxFQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1FBRXJELEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtZQUM1QixPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFzQixFQUFFLG1CQUFnQztnQkFDbkYsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLEtBQUssQ0FBQztZQUM3QyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ1Y7UUFFQSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVEsSUFBSyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2dCQUMxQixJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLENBQUMsQ0FBQztRQUNIO1FBRUEsT0FBTyxLQUFLO0lBQ2IsQ0FBQztJQUVPLDJDQUFxQixFQUE3QjtRQUFBO1FBQ0MsSUFBTSxrQkFBaUIsRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1FBRS9ELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO1lBQ2pDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLGdCQUFnQixJQUFLLHVCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztRQUM3RTtJQUNELENBQUM7SUFsZUQ7OztJQUdPLGlCQUFLLEVBQVcsMkJBQWdCO0lBZ2V4QyxpQkFBQztDQXBlRDtBQUFhO0FBc2ViLGtCQUFlLFVBQVU7Ozs7Ozs7Ozs7OztBQ3RoQnpCO0FBYUE7OztBQUdhLGNBQUssRUFBRyxnQkFBTSxDQUFDLHlCQUF5QixDQUFDO0FBRXREOzs7QUFHYSxjQUFLLEVBQUcsZ0JBQU0sQ0FBQyx5QkFBeUIsQ0FBQztBQUV0RDs7O0FBR0EsaUJBQ0MsS0FBZTtJQUVmLE9BQU8sT0FBTyxDQUFDLE1BQUssR0FBSSxPQUFPLE1BQUssSUFBSyxTQUFRLEdBQUksS0FBSyxDQUFDLEtBQUksSUFBSyxhQUFLLENBQUM7QUFDM0U7QUFKQTtBQU1BOzs7QUFHQSxpQkFBd0IsS0FBWTtJQUNuQyxPQUFPLE9BQU8sQ0FBQyxNQUFLLEdBQUksT0FBTyxNQUFLLElBQUssU0FBUSxHQUFJLEtBQUssQ0FBQyxLQUFJLElBQUssYUFBSyxDQUFDO0FBQzNFO0FBRkE7QUF3QkEsa0JBQ0MsTUFBdUIsRUFDdkIsUUFBZ0MsRUFDaEMsU0FBcUM7SUFFckMsSUFBSSxNQUFLLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBQyxpQkFBSyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUMxRCxPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDcEIsSUFBTSxLQUFJLEVBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFO1lBQ1QsR0FBRyxDQUFDLENBQUMsVUFBUyxHQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUNmO1lBQ0EsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxHQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RELE1BQUssbUJBQU8sS0FBSyxFQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDckM7UUFDRDtJQUNEO0lBQ0EsT0FBTyxNQUFNO0FBQ2Q7QUFsQkE7QUFvQkE7OztBQUdBLFdBQ0MsaUJBQWlELEVBQ2pELFVBQTJCLEVBQzNCLFFBQTRCO0lBQTVCLHdDQUE0QjtJQUU1QixPQUFPO1FBQ04sUUFBUTtRQUNSLGlCQUFpQjtRQUNqQixVQUFVO1FBQ1YsSUFBSSxFQUFFO0tBQ047QUFDRjtBQVhBO0FBbUJBLFdBQ0MsR0FBVyxFQUNYLG9CQUFnRixFQUNoRixRQUF5QztJQUR6QyxnRUFBZ0Y7SUFDaEYsK0NBQXlDO0lBRXpDLElBQUksV0FBVSxFQUFnRCxvQkFBb0I7SUFDbEYsSUFBSSwwQkFBMEI7SUFFOUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsRUFBRTtRQUN4QyxTQUFRLEVBQUcsb0JBQW9CO1FBQy9CLFdBQVUsRUFBRyxFQUFFO0lBQ2hCO0lBRUEsR0FBRyxDQUFDLE9BQU8sV0FBVSxJQUFLLFVBQVUsRUFBRTtRQUNyQywyQkFBMEIsRUFBRyxVQUFVO1FBQ3ZDLFdBQVUsRUFBRyxFQUFFO0lBQ2hCO0lBRUEsT0FBTztRQUNOLEdBQUc7UUFDSCwwQkFBMEI7UUFDMUIsUUFBUTtRQUNSLFVBQVU7UUFDVixJQUFJLEVBQUU7S0FDTjtBQUNGO0FBekJBOzs7Ozs7Ozs7OztBQ3JHQTtBQVNBLDBCQUFpQyxNQUF5QjtJQUN6RCxPQUFPLGlDQUFlLENBQUMsVUFBQyxNQUFNLEVBQUUsV0FBVztRQUMxQyxNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDO0lBQ3BGLENBQUMsQ0FBQztBQUNIO0FBSkE7QUFNQSxrQkFBZSxnQkFBZ0I7Ozs7Ozs7Ozs7O0FDa0IvQjs7OztBQUlBLHVCQUE2RSxFQU1wRDtRQUx4QixZQUFHLEVBQ0gsMEJBQVUsRUFDViwwQkFBVSxFQUNWLGtCQUFNLEVBQ04sa0NBQWM7SUFFZCxPQUFPLFVBQXFDLE1BQVM7UUFDcEQsTUFBTSxDQUFDLFNBQVMsQ0FBQywwQkFBeUIsRUFBRztZQUM1QyxPQUFPLEVBQUUsR0FBRztZQUNaLGlCQUFpQixFQUFFLE1BQU07WUFDekIsVUFBVSxFQUFFLENBQUMsV0FBVSxHQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLGFBQWEsSUFBSyxRQUFDLEVBQUUsYUFBYSxpQkFBRSxDQUFDLEVBQW5CLENBQW1CLENBQUM7WUFDMUUsVUFBVSxFQUFFLENBQUMsV0FBVSxHQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFlBQVksSUFBSyxRQUFDLEVBQUUsWUFBWSxnQkFBRSxDQUFDLEVBQWxCLENBQWtCLENBQUM7WUFDeEUsTUFBTSxFQUFFLENBQUMsT0FBTSxHQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFlBQVksSUFBSyxRQUFDO2dCQUM3QyxZQUFZO2dCQUNaLFNBQVMsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXO2FBQ3JELENBQUMsRUFIMkMsQ0FHM0MsQ0FBQztZQUNILGNBQWM7U0FDZDtJQUNGLENBQUM7QUFDRjtBQXBCQTtBQXNCQSxrQkFBZSxhQUFhOzs7Ozs7Ozs7OztBQzNENUI7QUFHQTs7Ozs7OztBQU9BLHNCQUE2QixZQUFvQixFQUFFLFlBQWtDLEVBQUUsZ0JBQTJCO0lBQ2pILE9BQU8saUNBQWUsQ0FBQyxVQUFDLE1BQU0sRUFBRSxXQUFXO1FBQzFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWdCLFlBQWMsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxZQUFZLENBQUMsd0JBQXdCLEVBQUUsWUFBWSxDQUFDO1FBQzNELEdBQUcsQ0FBQyxpQkFBZ0IsR0FBSSxXQUFXLEVBQUU7WUFDcEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25DLFlBQVk7Z0JBQ1osUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7YUFDOUMsQ0FBQztRQUNIO0lBQ0QsQ0FBQyxDQUFDO0FBQ0g7QUFYQTtBQWFBLGtCQUFlLFlBQVk7Ozs7Ozs7Ozs7O0FDckIzQjs7Ozs7O0FBTUEseUJBQWdDLE9BQXlCO0lBQ3hELE9BQU8sVUFBUyxNQUFXLEVBQUUsV0FBb0IsRUFBRSxVQUErQjtRQUNqRixHQUFHLENBQUMsT0FBTyxPQUFNLElBQUssVUFBVSxFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztRQUNyQztRQUFFLEtBQUs7WUFDTixPQUFPLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQztRQUM3QjtJQUNELENBQUM7QUFDRjtBQVJBO0FBVUEsa0JBQWUsZUFBZTs7Ozs7Ozs7Ozs7QUNsQjlCO0FBRUE7QUFFQTtBQUdBOzs7QUFHQSxJQUFNLHVCQUFzQixFQUFvQyxJQUFJLGlCQUFPLEVBQUU7QUEwQjdFOzs7Ozs7O0FBT0EsZ0JBQXVCLEVBQXFDO1FBQW5DLGNBQUksRUFBRSxnQ0FBYTtJQUMzQyxPQUFPLGlDQUFlLENBQUMsVUFBQyxNQUFNLEVBQUUsV0FBVztRQUMxQyxtQ0FBZ0IsQ0FBQyxVQUEyQixVQUFlO1lBQTFDO1lBQ2hCLElBQU0sU0FBUSxFQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNoRCxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNiLElBQU0sb0JBQW1CLEVBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxHQUFJLEVBQUU7Z0JBQ2xFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFNLElBQUssQ0FBQyxFQUFFO29CQUNyQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDO2dCQUN0RDtnQkFDQSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNqRCxRQUFRLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRTt3QkFDekIsS0FBSSxDQUFDLFVBQVUsRUFBRTtvQkFDbEIsQ0FBQyxDQUFDO29CQUNGLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ25DO2dCQUNBLE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLENBQUM7WUFDakQ7UUFDRCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDWCxDQUFDLENBQUM7QUFDSDtBQW5CQTtBQXFCQSxrQkFBZSxNQUFNOzs7Ozs7Ozs7OztBQy9EckI7QUFFQSx5QkFBeUIsS0FBVTtJQUNsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsSUFBSyxrQkFBaUIsR0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUMzRjtBQUVBLGdCQUF1QixnQkFBcUIsRUFBRSxXQUFnQjtJQUM3RCxPQUFPO1FBQ04sT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUU7S0FDUDtBQUNGO0FBTEE7QUFPQSxnQkFBdUIsZ0JBQXFCLEVBQUUsV0FBZ0I7SUFDN0QsT0FBTztRQUNOLE9BQU8sRUFBRSxLQUFLO1FBQ2QsS0FBSyxFQUFFO0tBQ1A7QUFDRjtBQUxBO0FBT0EsbUJBQTBCLGdCQUFxQixFQUFFLFdBQWdCO0lBQ2hFLE9BQU87UUFDTixPQUFPLEVBQUUsaUJBQWdCLElBQUssV0FBVztRQUN6QyxLQUFLLEVBQUU7S0FDUDtBQUNGO0FBTEE7QUFPQSxpQkFBd0IsZ0JBQXFCLEVBQUUsV0FBZ0I7SUFDOUQsSUFBSSxRQUFPLEVBQUcsS0FBSztJQUVuQixJQUFNLGlCQUFnQixFQUFHLGlCQUFnQixHQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUM5RSxJQUFNLGlCQUFnQixFQUFHLFlBQVcsR0FBSSxlQUFlLENBQUMsV0FBVyxDQUFDO0lBRXBFLEdBQUcsQ0FBQyxDQUFDLGlCQUFnQixHQUFJLENBQUMsZ0JBQWdCLEVBQUU7UUFDM0MsT0FBTztZQUNOLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFO1NBQ1A7SUFDRjtJQUVBLElBQU0sYUFBWSxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDbEQsSUFBTSxRQUFPLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFFeEMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFNLElBQUssT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUMzQyxRQUFPLEVBQUcsSUFBSTtJQUNmO0lBQUUsS0FBSztRQUNOLFFBQU8sRUFBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztZQUMxQixPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUMsSUFBSyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7UUFDbEQsQ0FBQyxDQUFDO0lBQ0g7SUFDQSxPQUFPO1FBQ04sT0FBTztRQUNQLEtBQUssRUFBRTtLQUNQO0FBQ0Y7QUEzQkE7QUE2QkEsY0FBcUIsZ0JBQXFCLEVBQUUsV0FBZ0I7SUFDM0QsSUFBSSxNQUFNO0lBQ1YsR0FBRyxDQUFDLE9BQU8sWUFBVyxJQUFLLFVBQVUsRUFBRTtRQUN0QyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQUssSUFBSywyQkFBZ0IsRUFBRTtZQUMzQyxPQUFNLEVBQUcsU0FBUyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztRQUNsRDtRQUFFLEtBQUs7WUFDTixPQUFNLEVBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztRQUMvQztJQUNEO0lBQUUsS0FBSyxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3hDLE9BQU0sRUFBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0lBQ2hEO0lBQUUsS0FBSztRQUNOLE9BQU0sRUFBRyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO0lBQ2xEO0lBQ0EsT0FBTyxNQUFNO0FBQ2Q7QUFkQTs7Ozs7Ozs7Ozs7O0FDdkRBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUF5QkEsSUFBTSxVQUFTLEVBQUcsT0FBTztBQUVaLDJCQUFrQixFQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFXakQ7OztBQUdBLGVBQXNCLEtBQVM7SUFDOUIsT0FBTyxpQ0FBZSxDQUFDLFVBQUMsTUFBTTtRQUM3QixNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQztJQUMvQyxDQUFDLENBQUM7QUFDSDtBQUpBO0FBTUE7Ozs7OztBQU1BLGtDQUFrQyxPQUFxQjtJQUN0RCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQ3BCLFVBQUMsaUJBQWlCLEVBQUUsU0FBUztRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQVc7WUFDMUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUcsR0FBRztRQUN4QyxDQUFDLENBQUM7UUFDRixPQUFPLGlCQUFpQjtJQUN6QixDQUFDLEVBQ1csRUFBRSxDQUNkO0FBQ0Y7QUFFQTs7Ozs7Ozs7OztBQVVBLCtCQUFzQyxLQUFVLEVBQUUsYUFBdUI7SUFDeEUsSUFBTSxjQUFhLEVBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssQ0FBQztJQUN6QyxhQUFhLENBQUMsY0FBYyxDQUFDLDBCQUFrQixFQUFFLGFBQWEsQ0FBQztJQUMvRCxPQUFPLGFBQWE7QUFDckI7QUFKQTtBQU1BOzs7QUFHQSxxQkFDQyxJQUFPO0lBV1A7UUFBcUI7UUFUckI7WUFBQTtZQWlCQzs7O1lBR1EsK0JBQXdCLEVBQWEsRUFBRTtZQU8vQzs7O1lBR1EsMEJBQW1CLEVBQUcsSUFBSTtZQUVsQzs7O1lBR1EsYUFBTSxFQUFlLEVBQUU7O1FBa0VoQztRQTlEUSx1QkFBSyxFQUFaLFVBQWEsT0FBa0Q7WUFBL0Q7WUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUM3QixJQUFJLENBQUMsd0JBQXdCLEVBQUU7WUFDaEM7WUFDQSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsU0FBUyxJQUFLLFlBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQTlCLENBQThCLENBQUM7WUFDbEU7WUFDQSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQ3BDLENBQUM7UUFFRDs7O1FBS1UscUNBQW1CLEVBQTdCO1lBQ0MsSUFBSSxDQUFDLG9CQUFtQixFQUFHLElBQUk7UUFDaEMsQ0FBQztRQUVPLGdDQUFjLEVBQXRCLFVBQXVCLFNBQTZCO1lBQ25ELEdBQUcsQ0FBQyxVQUFTLElBQUssVUFBUyxHQUFJLFVBQVMsSUFBSyxJQUFJLEVBQUU7Z0JBQ2xELE9BQU8sU0FBUztZQUNqQjtZQUVBLElBQU0sYUFBWSxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBWSxHQUFLLEVBQVU7WUFDaEUsSUFBTSxlQUFjLEVBQUcsSUFBSSxDQUFDLDhCQUE4QixDQUFDLFNBQVMsQ0FBQztZQUNyRSxJQUFJLGlCQUFnQixFQUFhLEVBQUU7WUFDbkMsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFO2dCQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFnQixVQUFTLHdCQUFzQixDQUFDO2dCQUM3RCxPQUFPLElBQUk7WUFDWjtZQUVBLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ2pDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDcEQ7WUFFQSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDaEMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbkQ7WUFBRSxLQUFLO2dCQUNOLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDakU7WUFDQSxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbEMsQ0FBQztRQUVPLDBDQUF3QixFQUFoQztZQUFBO1lBQ1MsOEJBQVUsRUFBViwrQkFBVTtZQUNsQixJQUFNLFdBQVUsRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1lBQ3hELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHFCQUFvQixFQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxjQUFjLEVBQUUsU0FBUztvQkFDdkUsSUFBUSxjQUFXLEVBQVgsbUJBQWdCLEVBQUUsNEVBQXdCO29CQUNsRCxLQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDdkMsT0FBTSxxQkFBTSxjQUFjLEVBQUssT0FBTztnQkFDdkMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDTixJQUFJLENBQUMsK0JBQThCLEVBQUcsd0JBQXdCLENBQUMsVUFBVSxDQUFDO1lBQzNFO1lBRUEsSUFBSSxDQUFDLE9BQU0sRUFBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLFVBQUMsU0FBUyxFQUFFLFFBQVE7Z0JBQ3RFLE9BQU0scUJBQU0sU0FBUyxFQUFLLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDMUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUVOLElBQUksQ0FBQyxvQkFBbUIsRUFBRyxLQUFLO1FBQ2pDLENBQUM7UUE5Q0Q7WUFGQywyQkFBWSxDQUFDLE9BQU8sRUFBRSxjQUFPLENBQUM7WUFDOUIsMkJBQVksQ0FBQyxjQUFjLEVBQUUsY0FBTyxDQUFDOzs7O3lEQUdyQztRQS9DSSxPQUFNO1lBVFgsZUFBTSxDQUFDO2dCQUNQLElBQUksRUFBRSwwQkFBa0I7Z0JBQ3hCLGFBQWEsRUFBRSxVQUFDLEtBQVksRUFBRSxVQUE0QjtvQkFDekQsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTt3QkFDdEIsT0FBTyxFQUFFLEtBQUssU0FBRTtvQkFDakI7b0JBQ0EsT0FBTyxFQUFFO2dCQUNWO2FBQ0E7V0FDSyxNQUFNLENBNEZYO1FBQUQsYUFBQztLQTVGRCxDQUFxQixJQUFJO0lBOEZ6QixPQUFPLE1BQU07QUFDZDtBQTNHQTtBQTZHQSxrQkFBZSxXQUFXOzs7Ozs7Ozs7Ozs7QUN4TTFCO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFJQSxJQUFNLGFBQVksRUFBRyxvQkFBb0I7QUFDekMsSUFBTSxjQUFhLEVBQUcsYUFBWSxFQUFHLFVBQVU7QUFDL0MsSUFBTSxnQkFBZSxFQUFHLGFBQVksRUFBRyxZQUFZO0FBRW5ELElBQU0sV0FBVSxFQUFzQyxFQUFFO0FBNEQzQywwQkFBaUIsRUFBRyxJQUFJLGlCQUFPLEVBQW1CO0FBRS9ELGNBQWMsTUFBcUIsRUFBRSxNQUFxQjtJQUN6RCxHQUFHLENBQUMsV0FBTyxDQUFDLE1BQU0sRUFBQyxHQUFJLFdBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUcsSUFBSyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQzlCLE9BQU8sS0FBSztRQUNiO1FBQ0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sS0FBSztRQUNiO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7SUFBRSxLQUFLLEdBQUcsQ0FBQyxXQUFPLENBQUMsTUFBTSxFQUFDLEdBQUksV0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzlDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWlCLElBQUssTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzFELE9BQU8sS0FBSztRQUNiO1FBQ0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sS0FBSztRQUNiO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7SUFDQSxPQUFPLEtBQUs7QUFDYjtBQUVBLElBQU0sa0JBQWlCLEVBQUc7SUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQztBQUMxRixDQUFDO0FBRUQsOEJBQThCLGdCQUE2QztJQUMxRSxJQUFNLFNBQVEsRUFBRztRQUNoQixTQUFTLEVBQUUsU0FBUztRQUNwQixZQUFZLEVBQUUsVUFBUyxPQUFvQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtZQUMzRSxPQUFPLENBQUMsS0FBYSxDQUFDLFNBQVMsRUFBQyxFQUFHLEtBQUs7UUFDMUMsQ0FBQztRQUNELFdBQVcsRUFBRTtZQUNaLEtBQUssRUFBRSxpQkFBaUI7WUFDeEIsSUFBSSxFQUFFO1NBQ047UUFDRCx1QkFBdUIsRUFBRSxFQUFFO1FBQzNCLG9CQUFvQixFQUFFLEVBQUU7UUFDeEIsT0FBTyxFQUFFLElBQUksaUJBQU8sRUFBRTtRQUN0QixLQUFLLEVBQUU7S0FDUDtJQUNELE9BQU8scUJBQUssUUFBUSxFQUFLLGdCQUFnQixDQUF1QjtBQUNqRTtBQUVBLHlCQUF5QixVQUFrQjtJQUMxQyxHQUFHLENBQUMsT0FBTyxXQUFVLElBQUssUUFBUSxFQUFFO1FBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUM7SUFDaEQ7QUFDRDtBQUVBLHNCQUNDLE9BQWEsRUFDYixRQUFnQixFQUNoQixVQUEyQixFQUMzQixpQkFBb0MsRUFDcEMsa0JBQW9DO0lBRXBDLElBQU0sU0FBUSxFQUFHLG1CQUFrQixHQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzFELElBQU0sYUFBWSxFQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDekMsSUFBTSxjQUFhLEVBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUV4QyxJQUFNLFVBQVMsRUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwQyxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxHQUFJLElBQUksaUJBQU8sRUFBRTtJQUV4RSxHQUFHLENBQUMsYUFBYSxFQUFFO1FBQ2xCLElBQU0sY0FBYSxFQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO0lBQ3REO0lBRUEsSUFBSSxTQUFRLEVBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBRWpELEdBQUcsQ0FBQyxVQUFTLElBQUssT0FBTyxFQUFFO1FBQzFCLFNBQVEsRUFBRyxVQUFvQixHQUFVO1lBQ3hDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztZQUMzQixHQUFHLENBQUMsTUFBYyxDQUFDLGVBQWUsRUFBQyxFQUFJLEdBQUcsQ0FBQyxNQUEyQixDQUFDLEtBQUs7UUFDOUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3hCO0lBRUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7SUFDN0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDO0lBQ3BDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztBQUNqRDtBQUVBLG9CQUFvQixPQUFnQixFQUFFLE9BQTJCO0lBQ2hFLEdBQUcsQ0FBQyxPQUFPLEVBQUU7UUFDWixJQUFNLFdBQVUsRUFBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQztJQUNEO0FBQ0Q7QUFFQSx1QkFBdUIsT0FBZ0IsRUFBRSxPQUEyQjtJQUNuRSxHQUFHLENBQUMsT0FBTyxFQUFFO1FBQ1osSUFBTSxXQUFVLEVBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEM7SUFDRDtBQUNEO0FBRUEsdUJBQXVCLE9BQWdCLEVBQUUsVUFBMkIsRUFBRSxpQkFBb0M7SUFDekcsSUFBTSxVQUFTLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekMsSUFBTSxVQUFTLEVBQUcsU0FBUyxDQUFDLE1BQU07SUFDbEMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sU0FBUSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxVQUFTLEVBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxHQUFHLENBQUMsU0FBUSxJQUFLLFNBQVMsRUFBRTtZQUMzQixJQUFNLGVBQWMsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUN6RSxHQUFHLENBQUMsQ0FBRSxPQUFtQixDQUFDLFNBQVMsRUFBRTtnQkFDbkMsT0FBbUIsQ0FBQyxVQUFTLEVBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDakU7WUFBRSxLQUFLO2dCQUNOLElBQUksQ0FBQyxJQUFJLElBQUMsRUFBRyxDQUFDLEVBQUUsSUFBQyxFQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUU7b0JBQy9DLFVBQVUsQ0FBQyxPQUFrQixFQUFFLGNBQWMsQ0FBQyxHQUFDLENBQUMsQ0FBQztnQkFDbEQ7WUFDRDtRQUNEO1FBQUUsS0FBSyxHQUFHLENBQUMsU0FBUSxJQUFLLFFBQVEsRUFBRTtZQUNqQyxJQUFNLFdBQVUsRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QyxJQUFNLFdBQVUsRUFBRyxVQUFVLENBQUMsTUFBTTtZQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQU0sVUFBUyxFQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQU0sV0FBVSxFQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7b0JBQ2YsZUFBZSxDQUFDLFVBQVUsQ0FBQztvQkFDM0IsaUJBQWlCLENBQUMsWUFBYSxDQUFDLE9BQXNCLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQztnQkFDL0U7WUFDRDtRQUNEO1FBQUUsS0FBSyxHQUFHLENBQUMsU0FBUSxJQUFLLE1BQUssR0FBSSxVQUFTLElBQUssS0FBSSxHQUFJLFVBQVMsSUFBSyxTQUFTLEVBQUU7WUFDL0UsSUFBTSxLQUFJLEVBQUcsT0FBTyxTQUFTO1lBQzdCLEdBQUcsQ0FBQyxLQUFJLElBQUssV0FBVSxHQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxJQUFLLENBQUMsRUFBRTtnQkFDL0QsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1lBQy9EO1lBQUUsS0FBSyxHQUFHLENBQUMsS0FBSSxJQUFLLFNBQVEsR0FBSSxTQUFRLElBQUssUUFBTyxHQUFJLFNBQVEsSUFBSyxXQUFXLEVBQUU7Z0JBQ2pGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFTLElBQUssY0FBYSxHQUFJLFNBQVEsSUFBSyxNQUFNLEVBQUU7b0JBQ3hFLE9BQW1CLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUMxRTtnQkFBRSxLQUFLO29CQUNMLE9BQW1CLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7Z0JBQ3ZEO1lBQ0Q7WUFBRSxLQUFLO2dCQUNMLE9BQWUsQ0FBQyxRQUFRLEVBQUMsRUFBRyxTQUFTO1lBQ3ZDO1FBQ0Q7SUFDRDtBQUNEO0FBRUEsOEJBQ0MsT0FBZ0IsRUFDaEIsa0JBQW1DLEVBQ25DLFVBQTJCLEVBQzNCLGlCQUFvQztJQUVwQyxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUN2RCxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDaEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFLLEtBQUksR0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDNUQsSUFBTSxjQUFhLEVBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEUsR0FBRyxDQUFDLGFBQWEsRUFBRTtvQkFDbEIsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDO2dCQUMvRDtZQUNEO1FBQ0QsQ0FBQyxDQUFDO0lBQ0g7QUFDRDtBQUVBLDBCQUNDLE9BQWdCLEVBQ2hCLGtCQUFtQyxFQUNuQyxVQUEyQixFQUMzQixpQkFBb0M7SUFFcEMsSUFBSSxrQkFBaUIsRUFBRyxLQUFLO0lBQzdCLElBQU0sVUFBUyxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pDLElBQU0sVUFBUyxFQUFHLFNBQVMsQ0FBQyxNQUFNO0lBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBQyxJQUFLLENBQUMsRUFBQyxHQUFJLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtRQUN0RSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzRCxhQUFhLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RDtRQUNEO1FBQUUsS0FBSztZQUNOLGFBQWEsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxDQUFDO1FBQ25EO0lBQ0Q7SUFFQSxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDO0lBRWhGLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLFNBQVEsRUFBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksVUFBUyxFQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDcEMsSUFBTSxjQUFhLEVBQUcsa0JBQW1CLENBQUMsUUFBUSxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1lBQzNCLElBQU0sZ0JBQWUsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUN0RixJQUFNLGVBQWMsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUN6RSxHQUFHLENBQUMsZ0JBQWUsR0FBSSxlQUFlLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtnQkFDbEQsR0FBRyxDQUFDLENBQUMsVUFBUyxHQUFJLFNBQVMsQ0FBQyxPQUFNLElBQUssQ0FBQyxFQUFFO29CQUN6QyxJQUFJLENBQUMsSUFBSSxJQUFDLEVBQUcsQ0FBQyxFQUFFLElBQUMsRUFBRyxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFFO3dCQUNoRCxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxHQUFDLENBQUMsQ0FBQztvQkFDM0M7Z0JBQ0Q7Z0JBQUUsS0FBSztvQkFDTixJQUFNLFdBQVUsbUJBQXNDLGNBQWMsQ0FBQztvQkFDckUsSUFBSSxDQUFDLElBQUksSUFBQyxFQUFHLENBQUMsRUFBRSxJQUFDLEVBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsRUFBRTt3QkFDaEQsSUFBTSxrQkFBaUIsRUFBRyxlQUFlLENBQUMsR0FBQyxDQUFDO3dCQUM1QyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7NEJBQ3RCLElBQU0sV0FBVSxFQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7NEJBQ3hELEdBQUcsQ0FBQyxXQUFVLElBQUssQ0FBQyxDQUFDLEVBQUU7Z0NBQ3RCLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUM7NEJBQzFDOzRCQUFFLEtBQUs7Z0NBQ04sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDOzRCQUNqQzt3QkFDRDtvQkFDRDtvQkFDQSxJQUFJLENBQUMsSUFBSSxJQUFDLEVBQUcsQ0FBQyxFQUFFLElBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFFO3dCQUMzQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFDLENBQUMsQ0FBQztvQkFDbkM7Z0JBQ0Q7WUFDRDtZQUFFLEtBQUs7Z0JBQ04sSUFBSSxDQUFDLElBQUksSUFBQyxFQUFHLENBQUMsRUFBRSxJQUFDLEVBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsRUFBRTtvQkFDL0MsVUFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsR0FBQyxDQUFDLENBQUM7Z0JBQ3ZDO1lBQ0Q7UUFDRDtRQUFFLEtBQUssR0FBRyxDQUFDLFNBQVEsSUFBSyxRQUFRLEVBQUU7WUFDakMsSUFBTSxXQUFVLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekMsSUFBTSxXQUFVLEVBQUcsVUFBVSxDQUFDLE1BQU07WUFDcEMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxJQUFNLFVBQVMsRUFBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFNLGNBQWEsRUFBRyxTQUFTLENBQUMsU0FBUyxDQUFDO2dCQUMxQyxJQUFNLGNBQWEsRUFBRyxhQUFhLENBQUMsU0FBUyxDQUFDO2dCQUM5QyxHQUFHLENBQUMsY0FBYSxJQUFLLGFBQWEsRUFBRTtvQkFDcEMsUUFBUTtnQkFDVDtnQkFDQSxrQkFBaUIsRUFBRyxJQUFJO2dCQUN4QixHQUFHLENBQUMsYUFBYSxFQUFFO29CQUNsQixlQUFlLENBQUMsYUFBYSxDQUFDO29CQUM5QixpQkFBaUIsQ0FBQyxZQUFhLENBQUMsT0FBc0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxDQUFDO2dCQUNsRjtnQkFBRSxLQUFLO29CQUNOLGlCQUFpQixDQUFDLFlBQWEsQ0FBQyxPQUFzQixFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZFO1lBQ0Q7UUFDRDtRQUFFLEtBQUs7WUFDTixHQUFHLENBQUMsQ0FBQyxVQUFTLEdBQUksT0FBTyxjQUFhLElBQUssUUFBUSxFQUFFO2dCQUNwRCxVQUFTLEVBQUcsRUFBRTtZQUNmO1lBQ0EsR0FBRyxDQUFDLFNBQVEsSUFBSyxPQUFPLEVBQUU7Z0JBQ3pCLElBQU0sU0FBUSxFQUFJLE9BQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzNDLEdBQUcsQ0FDRixTQUFRLElBQUssVUFBUztvQkFDdEIsQ0FBRSxPQUFlLENBQUMsZUFBZTt3QkFDaEMsRUFBRSxTQUFRLElBQU0sT0FBZSxDQUFDLGVBQWU7d0JBQy9DLEVBQUUsVUFBUyxJQUFLLGFBQWEsQ0FDL0IsRUFBRTtvQkFDQSxPQUFlLENBQUMsUUFBUSxFQUFDLEVBQUcsU0FBUztvQkFDckMsT0FBZSxDQUFDLGVBQWUsRUFBQyxFQUFHLFNBQVM7Z0JBQzlDO2dCQUNBLEdBQUcsQ0FBQyxVQUFTLElBQUssYUFBYSxFQUFFO29CQUNoQyxrQkFBaUIsRUFBRyxJQUFJO2dCQUN6QjtZQUNEO1lBQUUsS0FBSyxHQUFHLENBQUMsVUFBUyxJQUFLLGFBQWEsRUFBRTtnQkFDdkMsSUFBTSxLQUFJLEVBQUcsT0FBTyxTQUFTO2dCQUM3QixHQUFHLENBQUMsS0FBSSxJQUFLLFdBQVUsR0FBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUMsSUFBSyxDQUFDLEVBQUU7b0JBQy9ELFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsQ0FBQztnQkFDbkY7Z0JBQUUsS0FBSyxHQUFHLENBQUMsS0FBSSxJQUFLLFNBQVEsR0FBSSxTQUFRLElBQUssV0FBVyxFQUFFO29CQUN6RCxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBUyxJQUFLLGNBQWEsR0FBSSxTQUFRLElBQUssTUFBTSxFQUFFO3dCQUN6RSxPQUFPLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDO29CQUM3RDtvQkFBRSxLQUFLLEdBQUcsQ0FBQyxTQUFRLElBQUssT0FBTSxHQUFJLFVBQVMsSUFBSyxFQUFFLEVBQUU7d0JBQ25ELE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO29CQUNsQztvQkFBRSxLQUFLO3dCQUNOLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztvQkFDMUM7Z0JBQ0Q7Z0JBQUUsS0FBSztvQkFDTixHQUFHLENBQUUsT0FBZSxDQUFDLFFBQVEsRUFBQyxJQUFLLFNBQVMsRUFBRTt3QkFDN0M7d0JBQ0MsT0FBZSxDQUFDLFFBQVEsRUFBQyxFQUFHLFNBQVM7b0JBQ3ZDO2dCQUNEO2dCQUNBLGtCQUFpQixFQUFHLElBQUk7WUFDekI7UUFDRDtJQUNEO0lBQ0EsT0FBTyxpQkFBaUI7QUFDekI7QUFFQSwwQkFBMEIsUUFBeUIsRUFBRSxNQUFxQixFQUFFLEtBQWE7SUFDeEYsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLEtBQUssRUFBRSxFQUFDLEVBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUM5QixPQUFPLENBQUM7UUFDVDtJQUNEO0lBQ0EsT0FBTyxDQUFDLENBQUM7QUFDVjtBQUVBLHVCQUE4QixPQUFnQjtJQUM3QyxPQUFPO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxVQUFVLEVBQUUsRUFBRTtRQUNkLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE9BQU87UUFDUCxJQUFJLEVBQUU7S0FDTjtBQUNGO0FBUkE7QUFVQSxxQkFBNEIsSUFBUztJQUNwQyxPQUFPO1FBQ04sR0FBRyxFQUFFLEVBQUU7UUFDUCxVQUFVLEVBQUUsRUFBRTtRQUNkLFFBQVEsRUFBRSxTQUFTO1FBQ25CLElBQUksRUFBRSxLQUFHLElBQU07UUFDZixPQUFPLEVBQUUsU0FBUztRQUNsQixJQUFJLEVBQUU7S0FDTjtBQUNGO0FBVEE7QUFXQSxtQ0FDQyxRQUFxQyxFQUNyQyxRQUFvQztJQUVwQyxHQUFHLENBQUMsU0FBUSxJQUFLLFNBQVMsRUFBRTtRQUMzQixPQUFPLFVBQVU7SUFDbEI7SUFDQSxTQUFRLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFFMUQsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsUUFBUSxDQUFDLE1BQU0sR0FBSTtRQUN0QyxJQUFNLE1BQUssRUFBRyxRQUFRLENBQUMsQ0FBQyxDQUFrQjtRQUMxQyxHQUFHLENBQUMsTUFBSyxJQUFLLFVBQVMsR0FBSSxNQUFLLElBQUssSUFBSSxFQUFFO1lBQzFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQixRQUFRO1FBQ1Q7UUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLE1BQUssSUFBSyxRQUFRLEVBQUU7WUFDckMsUUFBUSxDQUFDLENBQUMsRUFBQyxFQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFDakM7UUFBRSxLQUFLO1lBQ04sR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSSxJQUFLLFNBQVMsRUFBRTtvQkFDdkMsS0FBSyxDQUFDLFVBQWtCLENBQUMsS0FBSSxFQUFHLFFBQVE7b0JBQ3pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUSxHQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTt3QkFDaEQseUJBQXlCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7b0JBQ3BEO2dCQUNEO1lBQ0Q7WUFBRSxLQUFLO2dCQUNOLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7b0JBQzFCLElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUU7b0JBQ3JELEtBQUssQ0FBQyxlQUFjLEVBQUc7d0JBQ3RCLElBQUksRUFBRSxRQUFRO3dCQUNkLFlBQVksRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDO3FCQUMxQztnQkFDRjtnQkFDQSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVEsR0FBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7b0JBQ2hELHlCQUF5QixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2dCQUNwRDtZQUNEO1FBQ0Q7UUFDQSxDQUFDLEVBQUU7SUFDSjtJQUNBLE9BQU8sUUFBMkI7QUFDbkM7QUF4Q0E7QUEwQ0EsbUJBQW1CLEtBQW9CLEVBQUUsV0FBK0I7SUFDdkUsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLEVBQUMsR0FBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ3ZDLElBQU0sZUFBYyxFQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYztRQUN0RCxHQUFHLENBQUMsY0FBYyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxPQUFPLGVBQWMsSUFBSyxVQUFVLEVBQUU7Z0JBQ3pDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBa0IsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQzNEO1lBQUUsS0FBSztnQkFDTixXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFrQixFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsY0FBd0IsQ0FBQztZQUN4RjtRQUNEO0lBQ0Q7QUFDRDtBQUVBLHNCQUFzQixNQUF1QyxFQUFFLGNBQTBDO0lBQ3hHLE9BQU0sRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNsRCxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLElBQU0sTUFBSyxFQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUM3QztZQUNBLElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFFO1lBQzNELFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDeEI7UUFBRSxLQUFLO1lBQ04sR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBMkIsRUFBRSxjQUFjLENBQUM7WUFDaEU7UUFDRDtJQUNEO0FBQ0Q7QUFFQSxzQkFBc0IsS0FBb0IsRUFBRSxXQUErQixFQUFFLGlCQUFvQztJQUNoSCxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQU0sU0FBUSxFQUFHLEtBQUssQ0FBQyxTQUFRLEdBQUksVUFBVTtRQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkIsS0FBSyxDQUFDLE9BQVEsQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUM7WUFDdkQ7WUFBRSxLQUFLO2dCQUNOLFlBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDO1lBQ3BEO1FBQ0Q7SUFDRDtJQUFFLEtBQUs7UUFDTixJQUFNLFVBQU8sRUFBRyxLQUFLLENBQUMsT0FBTztRQUM3QixJQUFNLFdBQVUsRUFBRyxLQUFLLENBQUMsVUFBVTtRQUNuQyxJQUFNLGNBQWEsRUFBRyxVQUFVLENBQUMsYUFBYTtRQUM5QyxHQUFHLENBQUMsV0FBVSxHQUFJLGFBQWEsRUFBRTtZQUMvQixTQUF1QixDQUFDLEtBQUssQ0FBQyxjQUFhLEVBQUcsTUFBTTtZQUNyRCxJQUFNLGNBQWEsRUFBRztnQkFDckIsVUFBTyxHQUFJLFNBQU8sQ0FBQyxXQUFVLEdBQUksU0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBTyxDQUFDO1lBQ3pFLENBQUM7WUFDRCxHQUFHLENBQUMsT0FBTyxjQUFhLElBQUssVUFBVSxFQUFFO2dCQUN4QyxhQUFhLENBQUMsU0FBa0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDO2dCQUM1RCxNQUFNO1lBQ1A7WUFBRSxLQUFLO2dCQUNOLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQWtCLEVBQUUsVUFBVSxFQUFFLGFBQXVCLEVBQUUsYUFBYSxDQUFDO2dCQUM5RixNQUFNO1lBQ1A7UUFDRDtRQUNBLFVBQU8sR0FBSSxTQUFPLENBQUMsV0FBVSxHQUFJLFNBQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQU8sQ0FBQztJQUN6RTtBQUNEO0FBRUEsOEJBQ0MsVUFBMkIsRUFDM0IsWUFBb0IsRUFDcEIsY0FBMEM7SUFFMUMsSUFBTSxVQUFTLEVBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztJQUMxQyxHQUFHLENBQUMsV0FBTyxDQUFDLFNBQVMsRUFBQyxHQUFJLFNBQVMsQ0FBQyxJQUFHLElBQUssRUFBRSxFQUFFO1FBQy9DLE1BQU0sRUFBRTtJQUNUO0lBQ1Esa0NBQUc7SUFFWCxHQUFHLENBQUMsSUFBRyxJQUFLLFVBQVMsR0FBSSxJQUFHLElBQUssSUFBSSxFQUFFO1FBQ3RDLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsR0FBRyxDQUFDLEVBQUMsSUFBSyxZQUFZLEVBQUU7Z0JBQ3ZCLElBQU0sS0FBSSxFQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO29CQUMxQixJQUFJLGVBQWMsUUFBUTtvQkFDMUIsSUFBTSxXQUFVLEVBQUksY0FBc0IsQ0FBQyxXQUFXLENBQUMsS0FBSSxHQUFJLFNBQVM7b0JBQ3hFLEdBQUcsQ0FBQyxXQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQ3ZCLGVBQWMsRUFBSSxTQUFTLENBQUMsaUJBQXlCLENBQUMsS0FBSSxHQUFJLFNBQVM7b0JBQ3hFO29CQUFFLEtBQUs7d0JBQ04sZUFBYyxFQUFHLFNBQVMsQ0FBQyxHQUFHO29CQUMvQjtvQkFFQSxPQUFPLENBQUMsSUFBSSxDQUNYLGVBQWEsV0FBVSx1TEFBbUwsZUFBYyxnQ0FBOEIsQ0FDdFA7b0JBQ0QsS0FBSztnQkFDTjtZQUNEO1FBQ0Q7SUFDRDtBQUNEO0FBRUEsd0JBQ0MsV0FBMEIsRUFDMUIsV0FBNEIsRUFDNUIsV0FBNEIsRUFDNUIsY0FBMEMsRUFDMUMsaUJBQW9DO0lBRXBDLFlBQVcsRUFBRyxZQUFXLEdBQUksVUFBVTtJQUN2QyxZQUFXLEVBQUcsV0FBVztJQUN6QixJQUFNLGtCQUFpQixFQUFHLFdBQVcsQ0FBQyxNQUFNO0lBQzVDLElBQU0sa0JBQWlCLEVBQUcsV0FBVyxDQUFDLE1BQU07SUFDNUMsSUFBTSxZQUFXLEVBQUcsaUJBQWlCLENBQUMsV0FBWTtJQUVsRCxJQUFJLFNBQVEsRUFBRyxDQUFDO0lBQ2hCLElBQUksU0FBUSxFQUFHLENBQUM7SUFDaEIsSUFBSSxDQUFTO0lBQ2IsSUFBSSxZQUFXLEVBQUcsS0FBSzs7UUFFdEIsSUFBTSxTQUFRLEVBQUcsU0FBUSxFQUFHLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTO1FBQ2pGLElBQU0sU0FBUSxFQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7UUFFdEMsR0FBRyxDQUFDLFNBQVEsSUFBSyxVQUFTLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUN2RCxZQUFXLEVBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQyxHQUFJLFdBQVc7WUFDMUcsUUFBUSxFQUFFO1FBQ1g7UUFBRSxLQUFLO1lBQ04sSUFBTSxhQUFZLEVBQUcsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxTQUFRLEVBQUcsQ0FBQyxDQUFDO1lBQzFFLEdBQUcsQ0FBQyxhQUFZLEdBQUksQ0FBQyxFQUFFOztvQkFFckIsSUFBTSxXQUFRLEVBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsSUFBTSxhQUFZLEVBQUcsQ0FBQztvQkFDdEIsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO3dCQUMzQyxZQUFZLENBQUMsVUFBUSxFQUFFLGNBQWMsQ0FBQzt3QkFDdEMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUM7b0JBQ2hFLENBQUMsQ0FBQztvQkFDRixZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQztnQkFDN0QsQ0FBQztnQkFSRCxJQUFJLENBQUMsRUFBQyxFQUFHLFFBQVEsRUFBRSxFQUFDLEVBQUcsWUFBWSxFQUFFLENBQUMsRUFBRTs7O2dCQVN4QyxZQUFXO29CQUNWLFNBQVMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUM7d0JBQzlGLFdBQVc7Z0JBQ1osU0FBUSxFQUFHLGFBQVksRUFBRyxDQUFDO1lBQzVCO1lBQUUsS0FBSztnQkFDTixJQUFJLGFBQVksRUFBK0IsU0FBUztnQkFDeEQsSUFBSSxNQUFLLEVBQWtCLFdBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hELEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ1YsSUFBSSxVQUFTLEVBQUcsU0FBUSxFQUFHLENBQUM7b0JBQzVCLE9BQU8sYUFBWSxJQUFLLFNBQVMsRUFBRTt3QkFDbEMsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0NBQ25CLE1BQUssRUFBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDMUI7NEJBQUUsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dDQUNsQyxNQUFLLEVBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQ0FDOUIsU0FBUyxFQUFFOzRCQUNaOzRCQUFFLEtBQUs7Z0NBQ04sS0FBSzs0QkFDTjt3QkFDRDt3QkFBRSxLQUFLOzRCQUNOLGFBQVksRUFBRyxLQUFLLENBQUMsT0FBTzt3QkFDN0I7b0JBQ0Q7Z0JBQ0Q7Z0JBRUEsU0FBUyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztnQkFDakYsU0FBUyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7Z0JBQ2hDLElBQU0sZUFBWSxFQUFHLFFBQVE7Z0JBQzdCLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztvQkFDM0Msb0JBQW9CLENBQUMsV0FBVyxFQUFFLGNBQVksRUFBRSxjQUFjLENBQUM7Z0JBQ2hFLENBQUMsQ0FBQztZQUNIO1FBQ0Q7UUFDQSxRQUFRLEVBQUU7SUFDWCxDQUFDO0lBckRELE9BQU8sU0FBUSxFQUFHLGlCQUFpQjs7O0lBc0RuQyxHQUFHLENBQUMsa0JBQWlCLEVBQUcsUUFBUSxFQUFFOztZQUdoQyxJQUFNLFNBQVEsRUFBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQU0sYUFBWSxFQUFHLENBQUM7WUFDdEIsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO2dCQUMzQyxZQUFZLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQztnQkFDdEMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUM7WUFDaEUsQ0FBQyxDQUFDO1lBQ0YsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUM7UUFDN0QsQ0FBQztRQVREO1FBQ0EsSUFBSSxDQUFDLEVBQUMsRUFBRyxRQUFRLEVBQUUsRUFBQyxFQUFHLGlCQUFpQixFQUFFLENBQUMsRUFBRTs7O0lBUzlDO0lBQ0EsT0FBTyxXQUFXO0FBQ25CO0FBRUEscUJBQ0MsV0FBMEIsRUFDMUIsUUFBcUMsRUFDckMsaUJBQW9DLEVBQ3BDLGNBQTBDLEVBQzFDLFlBQW9ELEVBQ3BELFVBQStCO0lBRC9CLHVEQUFvRDtJQUdwRCxHQUFHLENBQUMsU0FBUSxJQUFLLFNBQVMsRUFBRTtRQUMzQixNQUFNO0lBQ1A7SUFFQSxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBSyxHQUFJLFdBQVUsSUFBSyxTQUFTLEVBQUU7UUFDeEQsV0FBVSxFQUFHLFlBQVMsQ0FBQyxXQUFXLENBQUMsT0FBUSxDQUFDLFVBQVUsQ0FBdUI7SUFDOUU7SUFFQSxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFekIsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQixHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBSyxHQUFJLFVBQVUsRUFBRTtnQkFDMUMsSUFBSSxXQUFVLEVBQXdCLFNBQVM7Z0JBQy9DLE9BQU8sS0FBSyxDQUFDLFFBQU8sSUFBSyxVQUFTLEdBQUksVUFBVSxDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7b0JBQzVELFdBQVUsRUFBRyxVQUFVLENBQUMsS0FBSyxFQUFhO29CQUMxQyxHQUFHLENBQUMsV0FBVSxHQUFJLFVBQVUsQ0FBQyxRQUFPLElBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRSxHQUFJLFNBQVMsQ0FBQyxFQUFFO3dCQUNoRixLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVU7b0JBQzNCO2dCQUNEO1lBQ0Q7WUFDQSxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO1FBQy9FO1FBQUUsS0FBSztZQUNOLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO1FBQzNGO0lBQ0Q7QUFDRDtBQUVBLG1DQUNDLE9BQWdCLEVBQ2hCLEtBQW9CLEVBQ3BCLGNBQTBDLEVBQzFDLGlCQUFvQztJQUVwQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQztJQUNoRixHQUFHLENBQUMsT0FBTyxLQUFLLENBQUMsMkJBQTBCLElBQUssVUFBVSxFQUFFO1FBQzNELHFCQUFxQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQztJQUNoRDtJQUNBLGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQztJQUMzRCxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFHLElBQUssS0FBSSxHQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLFNBQVMsRUFBRTtRQUN4RSxJQUFNLGVBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFFO1FBQzNELGNBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQXNCLEVBQUUsS0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUssQ0FBQztRQUMvRSxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7WUFDM0MsY0FBWSxDQUFDLGdCQUFnQixDQUFDLE9BQXNCLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFJLENBQUM7UUFDN0UsQ0FBQyxDQUFDO0lBQ0g7SUFDQSxLQUFLLENBQUMsU0FBUSxFQUFHLElBQUk7QUFDdEI7QUFFQSxtQkFDQyxLQUFvQixFQUNwQixXQUEwQixFQUMxQixZQUF3QyxFQUN4QyxpQkFBb0MsRUFDcEMsY0FBMEMsRUFDMUMsVUFBK0I7SUFFL0IsSUFBSSxPQUFtQztJQUN2QyxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2IsK0NBQWlCO1FBQ3ZCLElBQU0sbUJBQWtCLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBRTtRQUNqRSxHQUFHLENBQUMsQ0FBQyxrQ0FBdUIsQ0FBNkIsaUJBQWlCLENBQUMsRUFBRTtZQUM1RSxJQUFNLEtBQUksRUFBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQTZCLGlCQUFpQixDQUFDO1lBQzdGLEdBQUcsQ0FBQyxLQUFJLElBQUssSUFBSSxFQUFFO2dCQUNsQixNQUFNO1lBQ1A7WUFDQSxrQkFBaUIsRUFBRyxJQUFJO1FBQ3pCO1FBQ0EsSUFBTSxTQUFRLEVBQUcsSUFBSSxpQkFBaUIsRUFBRTtRQUN4QyxLQUFLLENBQUMsU0FBUSxFQUFHLFFBQVE7UUFDekIsSUFBTSxlQUFZLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBRTtRQUNyRCxjQUFZLENBQUMsaUJBQWdCLEVBQUcsa0JBQWtCLENBQUMsVUFBVTtRQUM3RCxRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUNwRCxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDeEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDNUMsSUFBTSxTQUFRLEVBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUN0QyxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ2IsSUFBTSxpQkFBZ0IsRUFBRyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQ3RFLEtBQUssQ0FBQyxTQUFRLEVBQUcsZ0JBQWdCO1lBQ2pDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUM7UUFDbEc7UUFDQSxjQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtRQUNsQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7WUFDM0MsY0FBWSxDQUFDLFFBQVEsRUFBRTtRQUN4QixDQUFDLENBQUM7SUFDSDtJQUFFLEtBQUs7UUFDTixHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBSyxHQUFJLGlCQUFpQixDQUFDLGFBQVksSUFBSyxTQUFTLEVBQUU7WUFDNUUsUUFBTyxFQUFHLEtBQUssQ0FBQyxRQUFPLEVBQUcsaUJBQWlCLENBQUMsWUFBWTtZQUN4RCxpQkFBaUIsQ0FBQyxhQUFZLEVBQUcsU0FBUztZQUMxQyx5QkFBeUIsQ0FBQyxPQUFRLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQztZQUM3RSxNQUFNO1FBQ1A7UUFDQSxJQUFNLElBQUcsRUFBRyxXQUFXLENBQUMsT0FBUSxDQUFDLGFBQWE7UUFDOUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFHLElBQUssRUFBRSxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBTyxJQUFLLFNBQVMsRUFBRTtnQkFDaEMsSUFBTSxXQUFVLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUM7Z0JBQzFFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDakUsS0FBSyxDQUFDLFFBQU8sRUFBRyxVQUFVO1lBQzNCO1lBQUUsS0FBSztnQkFDTixRQUFPLEVBQUcsS0FBSyxDQUFDLFFBQU8sRUFBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUM7Z0JBQ3pELEdBQUcsQ0FBQyxhQUFZLElBQUssU0FBUyxFQUFFO29CQUMvQixXQUFXLENBQUMsT0FBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO2dCQUN6RDtnQkFBRSxLQUFLO29CQUNOLFdBQVcsQ0FBQyxPQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDMUM7WUFDRDtRQUNEO1FBQUUsS0FBSztZQUNOLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBTyxJQUFLLFNBQVMsRUFBRTtnQkFDaEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFHLElBQUssS0FBSyxFQUFFO29CQUN4QixrQkFBaUIsdUJBQVEsaUJBQWlCLEVBQUssRUFBRSxTQUFTLEVBQUUsY0FBYSxDQUFFLENBQUU7Z0JBQzlFO2dCQUNBLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFTLElBQUssU0FBUyxFQUFFO29CQUM5QyxRQUFPLEVBQUcsS0FBSyxDQUFDLFFBQU8sRUFBRyxHQUFHLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN0RjtnQkFBRSxLQUFLO29CQUNOLFFBQU8sRUFBRyxLQUFLLENBQUMsUUFBTyxFQUFHLEtBQUssQ0FBQyxRQUFPLEdBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN4RTtZQUNEO1lBQUUsS0FBSztnQkFDTixRQUFPLEVBQUcsS0FBSyxDQUFDLE9BQU87WUFDeEI7WUFDQSx5QkFBeUIsQ0FBQyxPQUFtQixFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7WUFDeEYsR0FBRyxDQUFDLGFBQVksSUFBSyxTQUFTLEVBQUU7Z0JBQy9CLFdBQVcsQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7WUFDekQ7WUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFRLENBQUMsV0FBVSxJQUFLLFdBQVcsQ0FBQyxPQUFRLEVBQUU7Z0JBQ3hELFdBQVcsQ0FBQyxPQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUMxQztRQUNEO0lBQ0Q7QUFDRDtBQUVBLG1CQUNDLFFBQWEsRUFDYixLQUFvQixFQUNwQixpQkFBb0MsRUFDcEMsV0FBMEIsRUFDMUIsY0FBMEM7SUFFMUMsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNYLGdDQUFRLEVBQUUsb0NBQTBCO1FBQzVDLEdBQUcsQ0FBQyxTQUFRLEdBQUksZ0JBQWdCLEVBQUU7WUFDakMsSUFBTSxhQUFZLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBRTtZQUNyRCxRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUNwRCxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDeEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDNUMsS0FBSyxDQUFDLFNBQVEsRUFBRyxRQUFRO1lBQ3pCLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBSyxJQUFLLElBQUksRUFBRTtnQkFDaEMsSUFBTSxTQUFRLEVBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRTtnQkFDdEMsS0FBSyxDQUFDLFNBQVEsRUFBRyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2dCQUM5RCxjQUFjLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDO1lBQzNGO1lBQUUsS0FBSztnQkFDTixLQUFLLENBQUMsU0FBUSxFQUFHLGdCQUFnQjtZQUNsQztZQUNBLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ25DO1FBQUUsS0FBSztZQUNOLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLENBQUM7UUFDNUU7SUFDRDtJQUFFLEtBQUs7UUFDTixHQUFHLENBQUMsU0FBUSxJQUFLLEtBQUssRUFBRTtZQUN2QixPQUFPLEtBQUs7UUFDYjtRQUNBLElBQU0sVUFBTyxFQUFHLENBQUMsS0FBSyxDQUFDLFFBQU8sRUFBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2xELElBQUksWUFBVyxFQUFHLEtBQUs7UUFDdkIsSUFBSSxRQUFPLEVBQUcsS0FBSztRQUNuQixLQUFLLENBQUMsU0FBUSxFQUFHLFFBQVEsQ0FBQyxRQUFRO1FBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBRyxJQUFLLEVBQUUsRUFBRTtZQUNyQixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUksSUFBSyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNqQyxJQUFNLFdBQVUsRUFBRyxTQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFDO2dCQUNwRSxTQUFPLENBQUMsVUFBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBTyxDQUFDO2dCQUNyRCxLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVU7Z0JBQzFCLFlBQVcsRUFBRyxJQUFJO2dCQUNsQixPQUFPLFdBQVc7WUFDbkI7UUFDRDtRQUFFLEtBQUs7WUFDTixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxJQUFLLENBQUMsRUFBRTtnQkFDMUMsa0JBQWlCLHVCQUFRLGlCQUFpQixFQUFLLEVBQUUsU0FBUyxFQUFFLGNBQWEsQ0FBRSxDQUFFO1lBQzlFO1lBQ0EsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFRLElBQUssS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDekMsSUFBTSxTQUFRLEVBQUcseUJBQXlCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUM7Z0JBQzFFLEtBQUssQ0FBQyxTQUFRLEVBQUcsUUFBUTtnQkFDekIsUUFBTztvQkFDTixjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBQyxHQUFJLE9BQU87WUFDbEc7WUFFQSxHQUFHLENBQUMsT0FBTyxLQUFLLENBQUMsMkJBQTBCLElBQUssVUFBVSxFQUFFO2dCQUMzRCxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUM7WUFDaEQ7WUFFQSxRQUFPLEVBQUcsZ0JBQWdCLENBQUMsU0FBTyxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBQyxHQUFJLE9BQU87WUFFeEcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLEtBQUksR0FBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUcsSUFBSyxTQUFTLEVBQUU7Z0JBQ3hFLElBQU0sZUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUU7Z0JBQzNELGNBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQU8sRUFBRSxLQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBSyxDQUFDO2dCQUNoRSxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7b0JBQzNDLGNBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFzQixFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBSSxDQUFDO2dCQUM3RSxDQUFDLENBQUM7WUFDSDtRQUNEO1FBQ0EsR0FBRyxDQUFDLFFBQU8sR0FBSSxLQUFLLENBQUMsV0FBVSxHQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFO1lBQ3BFLEtBQUssQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFNBQWtCLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQzVGO1FBQ0EsT0FBTyxXQUFXO0lBQ25CO0FBQ0Q7QUFFQSwrQkFBK0IsS0FBb0IsRUFBRSxpQkFBb0M7SUFDeEY7SUFDQSxLQUFLLENBQUMsNEJBQTJCLEVBQUcsS0FBSyxDQUFDLFVBQVU7SUFDcEQsSUFBTSxXQUFVLEVBQUcsS0FBSyxDQUFDLDBCQUEyQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQ3RFLEtBQUssQ0FBQyxXQUFVLHVCQUFRLFVBQVUsRUFBSyxLQUFLLENBQUMsMkJBQTJCLENBQUU7SUFDMUUsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDO1FBQzlDLElBQU0sV0FBVSx1QkFDWixLQUFLLENBQUMsMEJBQTJCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFDbkQsS0FBSyxDQUFDLDJCQUEyQixDQUNwQztRQUNELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFtQixFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1FBQzVGLEtBQUssQ0FBQyxXQUFVLEVBQUcsVUFBVTtJQUM5QixDQUFDLENBQUM7QUFDSDtBQUVBLG9DQUFvQyxpQkFBb0M7SUFDdkUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRTtRQUNyRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO1lBQzNCLE9BQU8saUJBQWlCLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFO2dCQUN4RCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xFLFNBQVEsR0FBSSxRQUFRLEVBQUU7WUFDdkI7UUFDRDtRQUFFLEtBQUs7WUFDTixnQkFBTSxDQUFDLHFCQUFxQixDQUFDO2dCQUM1QixPQUFPLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRTtvQkFDeEQsSUFBTSxTQUFRLEVBQUcsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFO29CQUNsRSxTQUFRLEdBQUksUUFBUSxFQUFFO2dCQUN2QjtZQUNELENBQUMsQ0FBQztRQUNIO0lBQ0Q7QUFDRDtBQUVBLGlDQUFpQyxpQkFBb0M7SUFDcEUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRTtRQUMzQixPQUFPLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtZQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7WUFDL0QsU0FBUSxHQUFJLFFBQVEsRUFBRTtRQUN2QjtJQUNEO0lBQUUsS0FBSztRQUNOLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLG1CQUFtQixFQUFFO1lBQy9CLGdCQUFNLENBQUMsbUJBQW1CLENBQUM7Z0JBQzFCLE9BQU8saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO29CQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7b0JBQy9ELFNBQVEsR0FBSSxRQUFRLEVBQUU7Z0JBQ3ZCO1lBQ0QsQ0FBQyxDQUFDO1FBQ0g7UUFBRSxLQUFLO1lBQ04sVUFBVSxDQUFDO2dCQUNWLE9BQU8saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO29CQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7b0JBQy9ELFNBQVEsR0FBSSxRQUFRLEVBQUU7Z0JBQ3ZCO1lBQ0QsQ0FBQyxDQUFDO1FBQ0g7SUFDRDtBQUNEO0FBRUEsMEJBQ0MsS0FBc0MsRUFDdEMsY0FBMEMsRUFDMUMsaUJBQW9DO0lBRXBDLElBQUksZ0JBQWUsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztJQUM1RCxpQkFBaUIsQ0FBQyxNQUFLLEVBQUcsS0FBSztJQUMvQixPQUFPO1FBQ04sTUFBTSxFQUFFLFVBQVMsWUFBMEI7WUFDMUMsSUFBSSxRQUFPLEVBQUcsaUJBQWlCLENBQUMsUUFBUTtZQUV4QyxhQUFZLEVBQUcseUJBQXlCLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQztZQUN0RSxjQUFjLENBQ2IsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUN0QixlQUFlLEVBQ2YsWUFBK0IsRUFDL0IsY0FBYyxFQUNkLGlCQUFpQixDQUNqQjtZQUNELElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUU7WUFDM0QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7WUFDbEMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUM7WUFDN0MsdUJBQXVCLENBQUMsaUJBQWlCLENBQUM7WUFDMUMsZ0JBQWUsRUFBRyxZQUErQjtRQUNsRCxDQUFDO1FBQ0QsT0FBTyxFQUFFLGlCQUFpQixDQUFDO0tBQzNCO0FBQ0Y7QUFFYSxZQUFHLEVBQUc7SUFDbEIsTUFBTSxFQUFFLFVBQ1AsS0FBbUIsRUFDbkIsUUFBb0MsRUFDcEMsaUJBQThDO1FBRTlDLElBQU0sc0JBQXFCLEVBQUcsb0JBQW9CLENBQUMsaUJBQWlCLENBQUM7UUFDckUsSUFBTSxTQUFRLEVBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDOUMscUJBQXFCLENBQUMsU0FBUSxFQUFHLFFBQVE7UUFDekMsSUFBTSxjQUFhLEVBQUcseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztRQUNoRSxXQUFXLENBQ1YsYUFBYSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxFQUM3QyxhQUFhLEVBQ2IscUJBQXFCLEVBQ3JCLFFBQVEsRUFDUixTQUFTLENBQ1Q7UUFDRCxJQUFNLGFBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFO1FBQ3JELFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2xDLHFCQUFxQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztZQUMvQyxZQUFZLENBQUMsUUFBUSxFQUFFO1FBQ3hCLENBQUMsQ0FBQztRQUNGLDBCQUEwQixDQUFDLHFCQUFxQixDQUFDO1FBQ2pELHVCQUF1QixDQUFDLHFCQUFxQixDQUFDO1FBQzlDLE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQztJQUN4RSxDQUFDO0lBQ0QsTUFBTSxFQUFFLFVBQ1AsVUFBbUIsRUFDbkIsS0FBbUIsRUFDbkIsUUFBb0MsRUFDcEMsaUJBQThDO1FBRTlDLElBQU0sc0JBQXFCLEVBQUcsb0JBQW9CLENBQUMsaUJBQWlCLENBQUM7UUFDckUscUJBQXFCLENBQUMsU0FBUSxFQUFHLFVBQVU7UUFDM0MsSUFBTSxjQUFhLEVBQUcseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztRQUNoRSxXQUFXLENBQ1YsYUFBYSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxFQUM3QyxhQUFhLEVBQ2IscUJBQXFCLEVBQ3JCLFFBQVEsRUFDUixTQUFTLENBQ1Q7UUFDRCxJQUFNLGFBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFO1FBQ3JELFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2xDLHFCQUFxQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztZQUMvQyxZQUFZLENBQUMsUUFBUSxFQUFFO1FBQ3hCLENBQUMsQ0FBQztRQUNGLDBCQUEwQixDQUFDLHFCQUFxQixDQUFDO1FBQ2pELHVCQUF1QixDQUFDLHFCQUFxQixDQUFDO1FBQzlDLE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQztJQUN4RSxDQUFDO0lBQ0QsS0FBSyxFQUFFLFVBQ04sT0FBZ0IsRUFDaEIsS0FBbUIsRUFDbkIsUUFBb0MsRUFDcEMsaUJBQThDO1FBRTlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMseUZBQXlGLENBQUM7UUFDM0c7UUFDQSxJQUFNLHNCQUFxQixFQUFHLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDO1FBQ3JFLHFCQUFxQixDQUFDLE1BQUssRUFBRyxJQUFJO1FBQ2xDLHFCQUFxQixDQUFDLGFBQVksRUFBRyxPQUFPO1FBQzVDLHFCQUFxQixDQUFDLFNBQVEsRUFBRyxPQUFPLENBQUMsVUFBcUI7UUFDOUQsSUFBTSxjQUFhLEVBQUcseUJBQXlCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBa0I7UUFDcEYsU0FBUyxDQUNSLGFBQWEsRUFDYixhQUFhLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEVBQzdDLFNBQVMsRUFDVCxxQkFBcUIsRUFDckIsUUFBUSxDQUNSO1FBQ0QsSUFBTSxhQUFZLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBRTtRQUNyRCxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtRQUNsQyxxQkFBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7WUFDL0MsWUFBWSxDQUFDLFFBQVEsRUFBRTtRQUN4QixDQUFDLENBQUM7UUFDRiwwQkFBMEIsQ0FBQyxxQkFBcUIsQ0FBQztRQUNqRCx1QkFBdUIsQ0FBQyxxQkFBcUIsQ0FBQztRQUM5QyxPQUFPLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUM7SUFDeEUsQ0FBQztJQUNELE9BQU8sRUFBRSxVQUNSLE9BQWdCLEVBQ2hCLEtBQW1CLEVBQ25CLFFBQW9DLEVBQ3BDLGlCQUE4QztRQUU5QyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUNkLHVHQUF1RyxDQUN2RztRQUNGO1FBQ0EsSUFBTSxzQkFBcUIsRUFBRyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQztRQUNyRSxJQUFNLGNBQWEsRUFBRyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFrQjtRQUNwRixxQkFBcUIsQ0FBQyxTQUFRLEVBQUcsT0FBTyxDQUFDLFVBQXNCO1FBQy9ELFNBQVMsQ0FDUixhQUFhLEVBQ2IsYUFBYSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxFQUM3QyxPQUFPLEVBQ1AscUJBQXFCLEVBQ3JCLFFBQVEsQ0FDUjtRQUNELElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUU7UUFDckQsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDbEMscUJBQXFCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQy9DLFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsMEJBQTBCLENBQUMscUJBQXFCLENBQUM7UUFDakQsdUJBQXVCLENBQUMscUJBQXFCLENBQUM7UUFDOUMsT0FBTyxDQUFDLFVBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3hDLE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQztJQUN4RTtDQUNBOzs7Ozs7OztBQ3JnQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQTs7Ozs7Ozs7QUMzRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkLGtEQUFrRCxzQkFBc0I7QUFDeEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMiLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdAZG9qby9zaGltL1Byb21pc2UnO1xuXG4vKipcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBub29wKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbn07XG5cbi8qKlxuICogTm8gb3AgZnVuY3Rpb24gdXNlZCB0byByZXBsYWNlIG93biwgb25jZSBpbnN0YW5jZSBoYXMgYmVlbiBkZXN0b3J5ZWRcbiAqL1xuZnVuY3Rpb24gZGVzdHJveWVkKCk6IG5ldmVyIHtcblx0dGhyb3cgbmV3IEVycm9yKCdDYWxsIG1hZGUgdG8gZGVzdHJveWVkIG1ldGhvZCcpO1xufTtcblxuZXhwb3J0IGNsYXNzIERlc3Ryb3lhYmxlIHtcblx0LyoqXG5cdCAqIHJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cHJpdmF0ZSBoYW5kbGVzOiBIYW5kbGVbXTtcblxuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmhhbmRsZXMgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2UgdGhhdCB3aWxsIGJlIGRlc3Ryb3llZCB3aGVuIGB0aGlzLmRlc3Ryb3lgIGlzIGNhbGxlZFxuXHQgKlxuXHQgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2Vcblx0ICogQHJldHVybnMge0hhbmRsZX0gYSBoYW5kbGUgZm9yIHRoZSBoYW5kbGUsIHJlbW92ZXMgdGhlIGhhbmRsZSBmb3IgdGhlIGluc3RhbmNlIGFuZCBjYWxscyBkZXN0cm95XG5cdCAqL1xuXHRvd24oaGFuZGxlOiBIYW5kbGUpOiBIYW5kbGUge1xuXHRcdGNvbnN0IHsgaGFuZGxlcyB9ID0gdGhpcztcblx0XHRoYW5kbGVzLnB1c2goaGFuZGxlKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGVzdHJveSgpIHtcblx0XHRcdFx0aGFuZGxlcy5zcGxpY2UoaGFuZGxlcy5pbmRleE9mKGhhbmRsZSkpO1xuXHRcdFx0XHRoYW5kbGUuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJweXMgYWxsIGhhbmRlcnMgcmVnaXN0ZXJlZCBmb3IgdGhlIGluc3RhbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlPGFueX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgaGFuZGxlcyBoYXZlIGJlZW4gZGVzdHJveWVkXG5cdCAqL1xuXHRkZXN0cm95KCk6IFByb21pc2U8YW55PiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHR0aGlzLmhhbmRsZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiB7XG5cdFx0XHRcdGhhbmRsZSAmJiBoYW5kbGUuZGVzdHJveSAmJiBoYW5kbGUuZGVzdHJveSgpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBub29wO1xuXHRcdFx0dGhpcy5vd24gPSBkZXN0cm95ZWQ7XG5cdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlc3Ryb3lhYmxlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIERlc3Ryb3lhYmxlLnRzIiwiaW1wb3J0IHsgQWN0aW9uYWJsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvYWJpbGl0aWVzJztcbmltcG9ydCB7IEV2ZW50ZWRMaXN0ZW5lciwgRXZlbnRlZExpc3RlbmVyT3JBcnJheSwgRXZlbnRlZExpc3RlbmVyc01hcCB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvYmFzZXMnO1xuaW1wb3J0IHsgRXZlbnRUYXJnZXR0ZWRPYmplY3QsIEV2ZW50RXJyb3JPYmplY3QsIEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IG9uIGFzIGFzcGVjdE9uIH0gZnJvbSAnLi9hc3BlY3QnO1xuaW1wb3J0IHsgRGVzdHJveWFibGUgfSBmcm9tICcuL0Rlc3Ryb3lhYmxlJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSB2YWx1ZSBpcyBBY3Rpb25hYmxlIChoYXMgYSBgLmRvYCBmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaXMgdGhlIHZhbHVlIGlzIEFjdGlvbmFibGVcbiAqL1xuZnVuY3Rpb24gaXNBY3Rpb25hYmxlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBBY3Rpb25hYmxlPGFueSwgYW55PiB7XG5cdHJldHVybiBCb29sZWFuKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5kbyA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBsaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVMaXN0ZW5lcjxULCBFIGV4dGVuZHMgRXZlbnRUYXJnZXR0ZWRPYmplY3Q8VD4+KGxpc3RlbmVyOiBFdmVudGVkTGlzdGVuZXI8VCwgRT4pOiBFdmVudGVkQ2FsbGJhY2s8RT4ge1xuXHRyZXR1cm4gaXNBY3Rpb25hYmxlKGxpc3RlbmVyKSA/IChldmVudDogRSkgPT4gbGlzdGVuZXIuZG8oeyBldmVudCB9KSA6IGxpc3RlbmVyO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgYW4gYXJyYXkgb2YgaGFuZGxlc1xuICpcbiAqIEBwYXJhbSBoYW5kbGVzIGFuIGFycmF5IG9mIGhhbmRsZXNcbiAqIEByZXR1cm5zIGEgc2luZ2xlIEhhbmRsZSBmb3IgaGFuZGxlcyBwYXNzZWRcbiAqL1xuZnVuY3Rpb24gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlczogSGFuZGxlW10pOiBIYW5kbGUge1xuXHRyZXR1cm4ge1xuXHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRoYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlLmRlc3Ryb3koKSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGV2ZW50IG9iamVjdCwgd2hpY2ggcHJvdmlkZXMgYSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudE9iamVjdCB7XG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZXZlbnRcblx0ICovXG5cdHJlYWRvbmx5IHR5cGU6IHN0cmluZyB8IHN5bWJvbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkQ2FsbGJhY2s8RSBleHRlbmRzIEV2ZW50T2JqZWN0PiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgYW4gYGV2ZW50YCBhcmd1bWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IG9iamVjdFxuXHQgKi9cblx0KGV2ZW50OiBFKTogYm9vbGVhbiB8IHZvaWQ7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBFdmVudGVkIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBPcHRpb25hbCBsaXN0ZW5lcnMgdG8gYWRkXG5cdCAqL1xuXHRsaXN0ZW5lcnM/OiBFdmVudGVkTGlzdGVuZXJzTWFwPGFueT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZUV2ZW50ZWRFdmVudHMge1xuXHQvKipcblx0ICogUmVnc2lzdGVyIGEgY2FsbGJhY2sgZm9yIGEgc3BlY2lmaWMgZXZlbnQgdHlwZVxuXHQgKlxuXHQgKiBAcGFyYW0gbGlzdGVuZXJzIG1hcCBvZiBsaXN0ZW5lcnNcblx0ICovXG5cdChsaXN0ZW5lcnM6IEV2ZW50ZWRMaXN0ZW5lcnNNYXA8RXZlbnRlZD4pOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIG9mIHRoZSBldmVudFxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGF0dGFjaFxuXHQgKi9cblx0KHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXk8RXZlbnRlZCwgRXZlbnRUYXJnZXR0ZWRPYmplY3Q8RXZlbnRlZD4+KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBmb3IgYGVycm9yYFxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGF0dGFjaFxuXHQgKi9cblx0KHR5cGU6ICdlcnJvcicsIGxpc3RlbmVyOiBFdmVudGVkTGlzdGVuZXJPckFycmF5PEV2ZW50ZWQsIEV2ZW50RXJyb3JPYmplY3Q8RXZlbnRlZD4+KTogSGFuZGxlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50ZWQge1xuXHRvbjogQmFzZUV2ZW50ZWRFdmVudHM7XG59XG5cbi8qKlxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xuICovXG5jb25zdCByZWdleE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBSZWdFeHA+KCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpcyB0aGUgZXZlbnQgdHlwZSBnbG9iIGhhcyBiZWVuIG1hdGNoZWRcbiAqXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmc6IHN0cmluZyB8IHN5bWJvbCwgdGFyZ2V0U3RyaW5nOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcblx0aWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcblx0XHRsZXQgcmVnZXg6IFJlZ0V4cDtcblx0XHRpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XG5cdFx0XHRyZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKSE7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKGBeJHsgZ2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJykgfSRgKTtcblx0XHRcdHJlZ2V4TWFwLnNldChnbG9iU3RyaW5nLCByZWdleCk7XG5cdFx0fVxuXHRcdHJldHVybiByZWdleC50ZXN0KHRhcmdldFN0cmluZyk7XG5cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZ2xvYlN0cmluZyA9PT0gdGFyZ2V0U3RyaW5nO1xuXHR9XG59XG5cbi8qKlxuICogRXZlbnQgQ2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50ZWQgZXh0ZW5kcyBEZXN0cm95YWJsZSBpbXBsZW1lbnRzIEV2ZW50ZWQge1xuXG5cdC8qKlxuXHQgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcblx0ICovXG5cdHByb3RlY3RlZCBsaXN0ZW5lcnNNYXA6IE1hcDxzdHJpbmcsIEV2ZW50ZWRDYWxsYmFjazxFdmVudE9iamVjdD4+ID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50ZWRDYWxsYmFjazxFdmVudE9iamVjdD4+KCk7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0gb3B0aW9ucyBUaGUgY29uc3RydWN0b3IgYXJndXJtZW50c1xuXHQgKi9cblx0Y29uc3RydWN0b3Iob3B0aW9uczogRXZlbnRlZE9wdGlvbnMgPSB7fSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0Y29uc3QgeyBsaXN0ZW5lcnMgfSA9IG9wdGlvbnM7XG5cdFx0aWYgKGxpc3RlbmVycykge1xuXHRcdFx0dGhpcy5vd24odGhpcy5vbihsaXN0ZW5lcnMpKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRW1pdHMgdGhlIGV2ZW50IG9iamV0IGZvciB0aGUgc3BlY2lmaWVkIHR5cGVcblx0ICpcblx0ICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBlbWl0XG5cdCAqL1xuXHRlbWl0PEUgZXh0ZW5kcyBFdmVudE9iamVjdD4oZXZlbnQ6IEUpOiB2b2lkIHtcblx0XHR0aGlzLmxpc3RlbmVyc01hcC5mb3JFYWNoKChtZXRob2QsIHR5cGUpID0+IHtcblx0XHRcdGlmIChpc0dsb2JNYXRjaCh0eXBlLCBldmVudC50eXBlKSkge1xuXHRcdFx0XHRtZXRob2QuY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2F0Y2ggYWxsIGhhbmRsZXIgZm9yIHZhcmlvdXMgY2FsbCBzaWduYXR1cmVzLiBUaGUgc2lnbmF0dXJlcyBhcmUgZGVmaW5lZCBpblxuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgWW91IGNhbiBhZGQgeW91ciBvd24gZXZlbnQgdHlwZSAtPiBoYW5kbGVyIHR5cGVzIGJ5IGV4dGVuZGluZ1xuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgU2VlIGV4YW1wbGUgZm9yIGRldGFpbHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhcmdzXG5cdCAqXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIGludGVyZmFjZSBXaWRnZXRCYXNlRXZlbnRzIGV4dGVuZHMgQmFzZUV2ZW50ZWRFdmVudHMge1xuXHQgKiAgICAgKHR5cGU6ICdwcm9wZXJ0aWVzOmNoYW5nZWQnLCBoYW5kbGVyOiBQcm9wZXJ0aWVzQ2hhbmdlZEhhbmRsZXIpOiBIYW5kbGU7XG5cdCAqIH1cblx0ICogY2xhc3MgV2lkZ2V0QmFzZSBleHRlbmRzIEV2ZW50ZWQge1xuXHQgKiAgICBvbjogV2lkZ2V0QmFzZUV2ZW50cztcblx0ICogfVxuXHQgKlxuXHQgKiBAcmV0dXJuIHthbnl9XG5cdCAqL1xuXHRvbjogQmFzZUV2ZW50ZWRFdmVudHMgPSBmdW5jdGlvbiAodGhpczogRXZlbnRlZCwgLi4uYXJnczogYW55W10pIHtcblx0XHRpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcblx0XHRcdGNvbnN0IFsgdHlwZSwgbGlzdGVuZXJzIF0gPSA8WyBzdHJpbmcsIEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXk8YW55LCBFdmVudFRhcmdldHRlZE9iamVjdDxhbnk+Pl0+IGFyZ3M7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZXMgPSBsaXN0ZW5lcnMubWFwKChsaXN0ZW5lcikgPT4gYXNwZWN0T24odGhpcy5saXN0ZW5lcnNNYXAsIHR5cGUsIHJlc29sdmVMaXN0ZW5lcihsaXN0ZW5lcikpKTtcblx0XHRcdFx0cmV0dXJuIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBhc3BlY3RPbih0aGlzLmxpc3RlbmVyc01hcCwgdHlwZSwgcmVzb2x2ZUxpc3RlbmVyKGxpc3RlbmVycykpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0Y29uc3QgWyBsaXN0ZW5lck1hcEFyZyBdID0gPFtFdmVudGVkTGlzdGVuZXJzTWFwPGFueT5dPiBhcmdzO1xuXHRcdFx0Y29uc3QgaGFuZGxlcyA9IE9iamVjdC5rZXlzKGxpc3RlbmVyTWFwQXJnKS5tYXAoKHR5cGUpID0+IHRoaXMub24odHlwZSwgbGlzdGVuZXJNYXBBcmdbdHlwZV0pKTtcblx0XHRcdHJldHVybiBoYW5kbGVzQXJyYXl0b0hhbmRsZShoYW5kbGVzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cycpO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRlZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBFdmVudGVkLnRzIiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9jb3JlJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyBjcmVhdGVIYW5kbGUgfSBmcm9tICcuL2xhbmcnO1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IHByb3ZpZGVzIHRoZSBuZWNlc3NhcnkgQVBJcyB0byBiZSBNYXBMaWtlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFwTGlrZTxLLCBWPiB7XG5cdGdldChrZXk6IEspOiBWO1xuXHRzZXQoa2V5OiBLLCB2YWx1ZT86IFYpOiB0aGlzO1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIHR5cGUgZ3VhcmQgdGhhdCBkZXRlcm1pbmVzIGlmIGFuIHZhbHVlIGlzIE1hcExpa2Ugb3Igbm90XG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBndWFyZCBhZ2FpbnN0XG4gKi9cbmZ1bmN0aW9uIGlzTWFwTGlrZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgTWFwTGlrZTxhbnksIGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUuc2V0ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEluZGV4YWJsZSB7XG5cdFttZXRob2Q6IHN0cmluZ106IGFueTtcbn1cblxuLyoqXG4gKiBUaGUgdHlwZXMgb2Ygb2JqZWN0cyBvciBtYXBzIHdoZXJlIGFkdmljZSBjYW4gYmUgYXBwbGllZFxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRhYmxlID0gTWFwTGlrZTxzdHJpbmcsIGFueT4gfCBJbmRleGFibGU7XG5cbnR5cGUgQWR2aWNlVHlwZSA9ICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhcm91bmQnO1xuXG4vKipcbiAqIEEgbWV0YSBkYXRhIHN0cnVjdHVyZSB3aGVuIGFwcGx5aW5nIGFkdmljZVxuICovXG5pbnRlcmZhY2UgQWR2aXNlZCB7XG5cdHJlYWRvbmx5IGlkPzogbnVtYmVyO1xuXHRhZHZpY2U/OiBGdW5jdGlvbjtcblx0cHJldmlvdXM/OiBBZHZpc2VkO1xuXHRuZXh0PzogQWR2aXNlZDtcblx0cmVhZG9ubHkgcmVjZWl2ZUFyZ3VtZW50cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgYWR2aWNlIHdoaWNoIGlzIGRlY29yYXRlZCB3aXRoIGFkZGl0aW9uYWxcbiAqIG1ldGEgZGF0YSBhYm91dCB0aGUgYWR2aWNlIHRvIGFwcGx5XG4gKi9cbmludGVyZmFjZSBEaXNwYXRjaGVyIHtcblx0WyB0eXBlOiBzdHJpbmcgXTogQWR2aXNlZCB8IHVuZGVmaW5lZDtcblx0KCk6IGFueTtcblx0dGFyZ2V0OiBhbnk7XG5cdGJlZm9yZT86IEFkdmlzZWQ7XG5cdGFyb3VuZD86IEFkdmlzZWQ7XG5cdGFmdGVyPzogQWR2aXNlZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnREaXNwYXRjaEFkdmljZTxUPiB7XG5cdGJlZm9yZT86IEpvaW5Qb2ludEJlZm9yZUFkdmljZVtdO1xuXHRhZnRlcj86IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+W107XG5cdHJlYWRvbmx5IGpvaW5Qb2ludDogRnVuY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4ge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmFmdGVyKiwgcmVjZWl2aW5nIHRoZSByZXN1bHQgYW5kIGFyZ3VtZW50cyBmcm9tIHRoZSBqb2luIHBvaW50LlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzdWx0IFRoZSByZXN1bHQgZnJvbSB0aGUgZnVuY3Rpb24gYmVpbmcgYWR2aXNlZFxuXHQgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRoYXQgd2VyZSBzdXBwbGllZCB0byB0aGUgYWR2aXNlZCBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyBUaGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgYWR2aWNlIGlzIHRoZW4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBtZXRob2Rcblx0ICovXG5cdChyZXN1bHQ6IFQsIC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4ge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmFyb3VuZCouICBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIGFuZFxuXHQgKiBuZWVkcyB0byByZXR1cm4gYSBuZXcgZnVuY3Rpb24gd2hpY2ggd2lsbCB0aGVuIGludm9rZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBvcmlnRm4gVGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHdpbGwgaW52b2tlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cblx0ICovXG5cdChvcmlnRm46IEdlbmVyaWNGdW5jdGlvbjxUPik6ICguLi5hcmdzOiBhbnlbXSkgPT4gVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnRCZWZvcmVBZHZpY2Uge1xuXHQvKipcblx0ICogQWR2aWNlIHdoaWNoIGlzIGFwcGxpZWQgKmJlZm9yZSosIHJlY2VpdmluZyB0aGUgb3JpZ2luYWwgYXJndW1lbnRzLCBpZiB0aGUgYWR2aXNpbmdcblx0ICogZnVuY3Rpb24gcmV0dXJucyBhIHZhbHVlLCBpdCBpcyBwYXNzZWQgZnVydGhlciBhbG9uZyB0YWtpbmcgdGhlIHBsYWNlIG9mIHRoZSBvcmlnaW5hbFxuXHQgKiBhcmd1bWVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdGhlIG1ldGhvZCB3YXMgY2FsbGVkIHdpdGhcblx0ICovXG5cdCguLi5hcmdzOiBhbnlbXSk6IGFueVtdIHwgdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljRnVuY3Rpb248VD4ge1xuXHQoLi4uYXJnczogYW55W10pOiBUO1xufVxuXG4vKipcbiAqIEEgd2VhayBtYXAgb2YgZGlzcGF0Y2hlcnMgdXNlZCB0byBhcHBseSB0aGUgYWR2aWNlXG4gKi9cbmNvbnN0IGRpc3BhdGNoQWR2aWNlTWFwID0gbmV3IFdlYWtNYXA8RnVuY3Rpb24sIEpvaW5Qb2ludERpc3BhdGNoQWR2aWNlPGFueT4+KCk7XG5cbi8qKlxuICogQSBVSUQgZm9yIHRyYWNraW5nIGFkdmljZSBvcmRlcmluZ1xuICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGFkdmlzZXMgYSBqb2luIHBvaW50XG4gKlxuICogQHBhcmFtIGRpc3BhdGNoZXIgVGhlIGN1cnJlbnQgYWR2aWNlIGRpc3BhdGNoZXJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGJlZm9yZSBvciBhZnRlciBhZHZpY2UgdG8gYXBwbHlcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFkdmljZSB0byBhcHBseVxuICogQHBhcmFtIHJlY2VpdmVBcmd1bWVudHMgSWYgdHJ1ZSwgdGhlIGFkdmljZSB3aWxsIHJlY2VpdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGpvaW4gcG9pbnRcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBhZHZpY2VcbiAqL1xuZnVuY3Rpb24gYWR2aXNlT2JqZWN0KFxuXHRkaXNwYXRjaGVyOiBEaXNwYXRjaGVyIHwgdW5kZWZpbmVkLFxuXHR0eXBlOiBBZHZpY2VUeXBlLFxuXHRhZHZpY2U6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRyZWNlaXZlQXJndW1lbnRzPzogYm9vbGVhblxuKTogSGFuZGxlIHtcblx0bGV0IHByZXZpb3VzID0gZGlzcGF0Y2hlciAmJiBkaXNwYXRjaGVyW3R5cGVdO1xuXHRsZXQgYWR2aXNlZDogQWR2aXNlZCB8IHVuZGVmaW5lZCA9IHtcblx0XHRpZDogbmV4dElkKyssXG5cdFx0YWR2aWNlOiBhZHZpY2UsXG5cdFx0cmVjZWl2ZUFyZ3VtZW50czogcmVjZWl2ZUFyZ3VtZW50c1xuXHR9O1xuXG5cdGlmIChwcmV2aW91cykge1xuXHRcdGlmICh0eXBlID09PSAnYWZ0ZXInKSB7XG5cdFx0XHQvLyBhZGQgdGhlIGxpc3RlbmVyIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Rcblx0XHRcdC8vIG5vdGUgdGhhdCB3ZSBoYWQgdG8gY2hhbmdlIHRoaXMgbG9vcCBhIGxpdHRsZSBiaXQgdG8gd29ya2Fyb3VuZCBhIGJpemFycmUgSUUxMCBKSVQgYnVnXG5cdFx0XHR3aGlsZSAocHJldmlvdXMubmV4dCAmJiAocHJldmlvdXMgPSBwcmV2aW91cy5uZXh0KSkge31cblx0XHRcdHByZXZpb3VzLm5leHQgPSBhZHZpc2VkO1xuXHRcdFx0YWR2aXNlZC5wcmV2aW91cyA9IHByZXZpb3VzO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIGFkZCB0byB0aGUgYmVnaW5uaW5nXG5cdFx0XHRpZiAoZGlzcGF0Y2hlcikge1xuXHRcdFx0XHRkaXNwYXRjaGVyLmJlZm9yZSA9IGFkdmlzZWQ7XG5cdFx0XHR9XG5cdFx0XHRhZHZpc2VkLm5leHQgPSBwcmV2aW91cztcblx0XHRcdHByZXZpb3VzLnByZXZpb3VzID0gYWR2aXNlZDtcblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IGFkdmlzZWQpO1xuXHR9XG5cblx0YWR2aWNlID0gcHJldmlvdXMgPSB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHsgcHJldmlvdXMgPSB1bmRlZmluZWQsIG5leHQgPSB1bmRlZmluZWQgfSA9IChhZHZpc2VkIHx8IHt9KTtcblxuXHRcdGlmIChkaXNwYXRjaGVyICYmICFwcmV2aW91cyAmJiAhbmV4dCkge1xuXHRcdFx0ZGlzcGF0Y2hlclt0eXBlXSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAocHJldmlvdXMpIHtcblx0XHRcdFx0cHJldmlvdXMubmV4dCA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGlzcGF0Y2hlciAmJiAoZGlzcGF0Y2hlclt0eXBlXSA9IG5leHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChhZHZpc2VkKSB7XG5cdFx0XHRkZWxldGUgYWR2aXNlZC5hZHZpY2U7XG5cdFx0fVxuXHRcdGRpc3BhdGNoZXIgPSBhZHZpc2VkID0gdW5kZWZpbmVkO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBBZHZpc2UgYSBqb2luIHBvaW50IChmdW5jdGlvbikgd2l0aCBzdXBwbGllZCBhZHZpY2VcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IFRoZSBmdW5jdGlvbiB0byBiZSBhZHZpc2VkXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBhZHZpY2UgdG8gYmUgYXBwbGllZFxuICogQHBhcmFtIGFkdmljZSBUaGUgYWR2aWNlIHRvIGFwcGx5XG4gKi9cbmZ1bmN0aW9uIGFkdmlzZUpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPih0aGlzOiBhbnksIGpvaW5Qb2ludDogRiwgdHlwZTogQWR2aWNlVHlwZSwgYWR2aWNlOiBKb2luUG9pbnRCZWZvcmVBZHZpY2UgfCBKb2luUG9pbnRBZnRlckFkdmljZTxUPiB8IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPik6IEYge1xuXHRsZXQgZGlzcGF0Y2hlcjogRjtcblx0aWYgKHR5cGUgPT09ICdhcm91bmQnKSB7XG5cdFx0ZGlzcGF0Y2hlciA9IGdldEpvaW5Qb2ludERpc3BhdGNoZXIoYWR2aWNlLmFwcGx5KHRoaXMsIFsgam9pblBvaW50IF0pKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkaXNwYXRjaGVyID0gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcihqb2luUG9pbnQpO1xuXHRcdC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcblx0XHRjb25zdCBhZHZpY2VNYXAgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoZGlzcGF0Y2hlcikhO1xuXHRcdGlmICh0eXBlID09PSAnYmVmb3JlJykge1xuXHRcdFx0KGFkdmljZU1hcC5iZWZvcmUgfHwgKGFkdmljZU1hcC5iZWZvcmUgPSBbXSkpLnVuc2hpZnQoPEpvaW5Qb2ludEJlZm9yZUFkdmljZT4gYWR2aWNlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQoYWR2aWNlTWFwLmFmdGVyIHx8IChhZHZpY2VNYXAuYWZ0ZXIgPSBbXSkpLnB1c2goYWR2aWNlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyBvciBjcmVhdGVzIHRoZSBkaXNwYXRjaGVyIGZvciBhIGdpdmVuIGpvaW4gcG9pbnRcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9yIG1hcFxuICogQHBhcmFtIG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0aGF0IHRoZSBkaXNwYXRjaGVyIHNob3VsZCBiZSByZXNvbHZlZCBmb3JcbiAqIEByZXR1cm4gVGhlIGRpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZyk6IERpc3BhdGNoZXIge1xuXHRjb25zdCBleGlzdGluZyA9IGlzTWFwTGlrZSh0YXJnZXQpID8gdGFyZ2V0LmdldChtZXRob2ROYW1lKSA6IHRhcmdldCAmJiB0YXJnZXRbbWV0aG9kTmFtZV07XG5cdGxldCBkaXNwYXRjaGVyOiBEaXNwYXRjaGVyO1xuXG5cdGlmICghZXhpc3RpbmcgfHwgZXhpc3RpbmcudGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHQvKiBUaGVyZSBpcyBubyBleGlzdGluZyBkaXNwYXRjaGVyLCB0aGVyZWZvcmUgd2Ugd2lsbCBjcmVhdGUgb25lICovXG5cdFx0ZGlzcGF0Y2hlciA9IDxEaXNwYXRjaGVyPiBmdW5jdGlvbiAodGhpczogRGlzcGF0Y2hlcik6IGFueSB7XG5cdFx0XHRsZXQgZXhlY3V0aW9uSWQgPSBuZXh0SWQ7XG5cdFx0XHRsZXQgYXJncyA9IGFyZ3VtZW50cztcblx0XHRcdGxldCByZXN1bHRzOiBhbnk7XG5cdFx0XHRsZXQgYmVmb3JlID0gZGlzcGF0Y2hlci5iZWZvcmU7XG5cblx0XHRcdHdoaWxlIChiZWZvcmUpIHtcblx0XHRcdFx0aWYgKGJlZm9yZS5hZHZpY2UpIHtcblx0XHRcdFx0XHRhcmdzID0gYmVmb3JlLmFkdmljZS5hcHBseSh0aGlzLCBhcmdzKSB8fCBhcmdzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJlZm9yZSA9IGJlZm9yZS5uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlzcGF0Y2hlci5hcm91bmQgJiYgZGlzcGF0Y2hlci5hcm91bmQuYWR2aWNlKSB7XG5cdFx0XHRcdHJlc3VsdHMgPSBkaXNwYXRjaGVyLmFyb3VuZC5hZHZpY2UodGhpcywgYXJncyk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZnRlciA9IGRpc3BhdGNoZXIuYWZ0ZXI7XG5cdFx0XHR3aGlsZSAoYWZ0ZXIgJiYgYWZ0ZXIuaWQgIT09IHVuZGVmaW5lZCAmJiBhZnRlci5pZCA8IGV4ZWN1dGlvbklkKSB7XG5cdFx0XHRcdGlmIChhZnRlci5hZHZpY2UpIHtcblx0XHRcdFx0XHRpZiAoYWZ0ZXIucmVjZWl2ZUFyZ3VtZW50cykge1xuXHRcdFx0XHRcdFx0bGV0IG5ld1Jlc3VsdHMgPSBhZnRlci5hZHZpY2UuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gbmV3UmVzdWx0cyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0cyA6IG5ld1Jlc3VsdHM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IGFmdGVyLmFkdmljZS5jYWxsKHRoaXMsIHJlc3VsdHMsIGFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhZnRlciA9IGFmdGVyLm5leHQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0XHRpZiAoaXNNYXBMaWtlKHRhcmdldCkpIHtcblx0XHRcdHRhcmdldC5zZXQobWV0aG9kTmFtZSwgZGlzcGF0Y2hlcik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGFyZ2V0ICYmICh0YXJnZXRbbWV0aG9kTmFtZV0gPSBkaXNwYXRjaGVyKTtcblx0XHR9XG5cblx0XHRpZiAoZXhpc3RpbmcpIHtcblx0XHRcdGRpc3BhdGNoZXIuYXJvdW5kID0ge1xuXHRcdFx0XHRhZHZpY2U6IGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgYXJnczogYW55W10pOiBhbnkge1xuXHRcdFx0XHRcdHJldHVybiBleGlzdGluZy5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGRpc3BhdGNoZXIudGFyZ2V0ID0gdGFyZ2V0O1xuXHR9XG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoZXIgPSBleGlzdGluZztcblx0fVxuXG5cdHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpc3BhdGNoZXIgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gam9pblBvaW50IChtZXRob2QvZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBUaGUgZnVuY3Rpb24gdGhhdCBpcyB0byBiZSBhZHZpc2VkXG4gKi9cbmZ1bmN0aW9uIGdldEpvaW5Qb2ludERpc3BhdGNoZXI8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGKTogRiB7XG5cblx0ZnVuY3Rpb24gZGlzcGF0Y2hlcih0aGlzOiBGdW5jdGlvbiwgLi4uYXJnczogYW55W10pOiBUIHtcblx0XHQvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXG5cdFx0Y29uc3QgeyBiZWZvcmUsIGFmdGVyLCBqb2luUG9pbnQgfSA9IGRpc3BhdGNoQWR2aWNlTWFwLmdldChkaXNwYXRjaGVyKSE7XG5cdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0YXJncyA9IGJlZm9yZS5yZWR1Y2UoKHByZXZpb3VzQXJncywgYWR2aWNlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRBcmdzID0gYWR2aWNlLmFwcGx5KHRoaXMsIHByZXZpb3VzQXJncyk7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50QXJncyB8fCBwcmV2aW91c0FyZ3M7XG5cdFx0XHR9LCBhcmdzKTtcblx0XHR9XG5cdFx0bGV0IHJlc3VsdCA9IGpvaW5Qb2ludC5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdHJlc3VsdCA9IGFmdGVyLnJlZHVjZSgocHJldmlvdXNSZXN1bHQsIGFkdmljZSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWR2aWNlLmFwcGx5KHRoaXMsIFsgcHJldmlvdXNSZXN1bHQgXS5jb25jYXQoYXJncykpO1xuXHRcdFx0fSwgcmVzdWx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qIFdlIHdhbnQgdG8gXCJjbG9uZVwiIHRoZSBhZHZpY2UgdGhhdCBoYXMgYmVlbiBhcHBsaWVkIGFscmVhZHksIGlmIHRoaXNcblx0ICogam9pblBvaW50IGlzIGFscmVhZHkgYWR2aXNlZCAqL1xuXHRpZiAoZGlzcGF0Y2hBZHZpY2VNYXAuaGFzKGpvaW5Qb2ludCkpIHtcblx0XHQvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXG5cdFx0Y29uc3QgYWR2aWNlTWFwID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGpvaW5Qb2ludCkhO1xuXHRcdGxldCB7IGJlZm9yZSwgYWZ0ZXIgfSA9IGFkdmljZU1hcDtcblx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRiZWZvcmUgPSBiZWZvcmUuc2xpY2UoMCk7XG5cdFx0fVxuXHRcdGlmIChhZnRlcikge1xuXHRcdFx0YWZ0ZXIgPSBhZnRlci5zbGljZSgwKTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hBZHZpY2VNYXAuc2V0KGRpc3BhdGNoZXIsIHtcblx0XHRcdGpvaW5Qb2ludDogYWR2aWNlTWFwLmpvaW5Qb2ludCxcblx0XHRcdGJlZm9yZSxcblx0XHRcdGFmdGVyXG5cdFx0fSk7XG5cdH1cblx0LyogT3RoZXJ3aXNlLCB0aGlzIGlzIGEgbmV3IGpvaW5Qb2ludCwgc28gd2Ugd2lsbCBjcmVhdGUgdGhlIGFkdmljZSBtYXAgYWZyZXNoICovXG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoQWR2aWNlTWFwLnNldChkaXNwYXRjaGVyLCB7IGpvaW5Qb2ludCB9KTtcblx0fVxuXG5cdHJldHVybiBkaXNwYXRjaGVyIGFzIEY7XG59XG5cbi8qKlxuICogQXBwbHkgYWR2aWNlICphZnRlciogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFmdGVyIGFkdmljZVxuICovXG5mdW5jdGlvbiBhZnRlckpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4pOiBGIHtcblx0cmV0dXJuIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsICdhZnRlcicsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJhZnRlclwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0LlxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKGV2ZW4gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQpLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3RcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmZ1bmN0aW9uIGFmdGVyT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6IChvcmlnaW5hbFJldHVybjogYW55LCBvcmlnaW5hbEFyZ3M6IElBcmd1bWVudHMpID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYWZ0ZXJcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdC5cbiAqIFRoZSB2YWx1ZSBpdCByZXR1cm5zIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGUgbWV0aG9kIHdoZW4gaXQgaXMgY2FsbGVkIChldmVuIGlmIHRoZSByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0XG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXIodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKG9yaWdpbmFsUmV0dXJuOiBhbnksIG9yaWdpbmFsQXJnczogSUFyZ3VtZW50cykgPT4gYW55KTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFmdGVyKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYWZ0ZXIgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcjxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4pOiBGO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludE9yVGFyZ2V0OiBGIHwgVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZU9yQWR2aWNlOiBzdHJpbmcgfCBKb2luUG9pbnRBZnRlckFkdmljZTxUPiwgb2JqZWN0QWR2aWNlPzogKG9yaWdpbmFsUmV0dXJuOiBhbnksIG9yaWdpbmFsQXJnczogSUFyZ3VtZW50cykgPT4gYW55KTogSGFuZGxlIHwgRiB7XG5cdGlmICh0eXBlb2Ygam9pblBvaW50T3JUYXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYWZ0ZXJKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIDxKb2luUG9pbnRBZnRlckFkdmljZTxUPj4gbWV0aG9kTmFtZU9yQWR2aWNlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gYWZ0ZXJPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIDxzdHJpbmc+IG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlISk7XG5cdH1cbn1cblxuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFyb3VuZCogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFyb3VuZCBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZEpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+KTogRiB7XG5cdHJldHVybiBhZHZpc2VKb2luUG9pbnQ8RiwgVD4oam9pblBvaW50LCAnYXJvdW5kJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFyb3VuZFwiIGFkdmljZSBhcm91bmQgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb25cbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcm91bmRPYmplY3QodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKSk6IEhhbmRsZSB7XG5cdGxldCBkaXNwYXRjaGVyOiBEaXNwYXRjaGVyIHwgdW5kZWZpbmVkID0gZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpO1xuXHRsZXQgcHJldmlvdXMgPSBkaXNwYXRjaGVyLmFyb3VuZDtcblx0bGV0IGFkdmlzZWQ6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xuXHRpZiAoYWR2aWNlKSB7XG5cdFx0YWR2aXNlZCA9IGFkdmljZShmdW5jdGlvbiAodGhpczogRGlzcGF0Y2hlcik6IGFueSB7XG5cdFx0XHRpZiAocHJldmlvdXMgJiYgcHJldmlvdXMuYWR2aWNlKSB7XG5cdFx0XHRcdHJldHVybiBwcmV2aW91cy5hZHZpY2UodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGRpc3BhdGNoZXIuYXJvdW5kID0ge1xuXHRcdGFkdmljZTogZnVuY3Rpb24gKHRhcmdldDogYW55LCBhcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gYWR2aXNlZCA/IGFkdmlzZWQuYXBwbHkodGFyZ2V0LCBhcmdzKSA6IHByZXZpb3VzICYmIHByZXZpb3VzLmFkdmljZSAmJiBwcmV2aW91cy5hZHZpY2UodGFyZ2V0LCBhcmdzKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG5cdFx0YWR2aXNlZCA9IGRpc3BhdGNoZXIgPSB1bmRlZmluZWQ7XG5cdH0pO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYXJvdW5kXCIgYWR2aWNlIGFyb3VuZCB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoKHByZXZpb3VzOiBGdW5jdGlvbikgPT4gRnVuY3Rpb24pKTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFyb3VuZCogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFyb3VuZCBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+KTogRjtcbmV4cG9ydCBmdW5jdGlvbiBhcm91bmQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50T3JUYXJnZXQ6IEYgfCBUYXJnZXRhYmxlLCBtZXRob2ROYW1lT3JBZHZpY2U6IHN0cmluZyB8IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPiwgb2JqZWN0QWR2aWNlPzogKChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKSk6IEhhbmRsZSB8IEYge1xuXHRpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGFyb3VuZEpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgPEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPj4gbWV0aG9kTmFtZU9yQWR2aWNlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gYXJvdW5kT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCA8c3RyaW5nPiBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSEpO1xuXHR9XG59XG5cbi8qKlxuICogQXBwbHkgYWR2aWNlICpiZWZvcmUqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBiZWZvcmUgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVKb2luUG9pbnQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxhbnk+Pihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QmVmb3JlQWR2aWNlKTogRiB7XG5cdHJldHVybiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCAnYmVmb3JlJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImJlZm9yZVwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgbWF5IHJldHVybiBuZXcgYXJndW1lbnRzXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICguLi5vcmlnaW5hbEFyZ3M6IGFueVtdKSA9PiBhbnlbXSB8IHZvaWQpOiBIYW5kbGUge1xuXHRyZXR1cm4gYWR2aXNlT2JqZWN0KGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKSwgJ2JlZm9yZScsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJiZWZvcmVcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCwgYW5kIG1heSByZXR1cm4gbmV3IGFyZ3VtZW50c1xuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZSh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55W10gfCB2b2lkKTogSGFuZGxlO1xuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmJlZm9yZSogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGJlZm9yZSBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZTxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPGFueT4+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRCZWZvcmVBZHZpY2UpOiBGO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZTxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnRPclRhcmdldDogRiB8IFRhcmdldGFibGUsIG1ldGhvZE5hbWVPckFkdmljZTogc3RyaW5nIHwgSm9pblBvaW50QmVmb3JlQWR2aWNlLCBvYmplY3RBZHZpY2U/OiAoKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueVtdIHwgdm9pZCkpOiBIYW5kbGUgfCBGIHtcblx0aWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBiZWZvcmVKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIDxKb2luUG9pbnRCZWZvcmVBZHZpY2U+IG1ldGhvZE5hbWVPckFkdmljZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGJlZm9yZU9iamVjdChqb2luUG9pbnRPclRhcmdldCwgPHN0cmluZz4gbWV0aG9kTmFtZU9yQWR2aWNlLCBvYmplY3RBZHZpY2UhKTtcblx0fVxufVxuXG4vKipcbiAqIEF0dGFjaGVzIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSB2YWx1ZSBpdCByZXR1cm5zIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGUgbWV0aG9kIHdoZW4gaXQgaXMgY2FsbGVkICp1bmxlc3MqIGl0cyByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gb24odGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYWZ0ZXInLCBhZHZpY2UsIHRydWUpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGFzcGVjdC50cyIsImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5cbmV4cG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcblxuY29uc3Qgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcbiAqL1xuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWU6IGFueSk6IHZhbHVlIGlzIE9iamVjdCB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gY29weUFycmF5PFQ+KGFycmF5OiBUW10sIGluaGVyaXRlZDogYm9vbGVhbik6IFRbXSB7XG5cdHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW06IFQpOiBUIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuXHRcdFx0cmV0dXJuIDxhbnk+IGNvcHlBcnJheSg8YW55PiBpdGVtLCBpbmhlcml0ZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSkgP1xuXHRcdFx0aXRlbSA6XG5cdFx0XHRfbWl4aW4oe1xuXHRcdFx0XHRkZWVwOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0ZWQ6IGluaGVyaXRlZCxcblx0XHRcdFx0c291cmNlczogPEFycmF5PFQ+PiBbIGl0ZW0gXSxcblx0XHRcdFx0dGFyZ2V0OiA8VD4ge31cblx0XHRcdH0pO1xuXHR9KTtcbn1cblxuaW50ZXJmYWNlIE1peGluQXJnczxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4ge1xuXHRkZWVwOiBib29sZWFuO1xuXHRpbmhlcml0ZWQ6IGJvb2xlYW47XG5cdHNvdXJjZXM6IChVIHwgbnVsbCB8IHVuZGVmaW5lZClbXTtcblx0dGFyZ2V0OiBUO1xuXHRjb3BpZWQ/OiBhbnlbXTtcbn1cblxuZnVuY3Rpb24gX21peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pihrd0FyZ3M6IE1peGluQXJnczxULCBVPik6IFQmVSB7XG5cdGNvbnN0IGRlZXAgPSBrd0FyZ3MuZGVlcDtcblx0Y29uc3QgaW5oZXJpdGVkID0ga3dBcmdzLmluaGVyaXRlZDtcblx0Y29uc3QgdGFyZ2V0OiBhbnkgPSBrd0FyZ3MudGFyZ2V0O1xuXHRjb25zdCBjb3BpZWQgPSBrd0FyZ3MuY29waWVkIHx8IFtdO1xuXHRjb25zdCBjb3BpZWRDbG9uZSA9IFsgLi4uY29waWVkIF07XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrd0FyZ3Muc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xuXG5cdFx0aWYgKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcblx0XHRcdGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcblx0XHRcdFx0bGV0IHZhbHVlOiBhbnkgPSBzb3VyY2Vba2V5XTtcblxuXHRcdFx0XHRpZiAoY29waWVkQ2xvbmUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGVlcCkge1xuXHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBjb3B5QXJyYXkodmFsdWUsIGluaGVyaXRlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0VmFsdWU6IGFueSA9IHRhcmdldFtrZXldIHx8IHt9O1xuXHRcdFx0XHRcdFx0Y29waWVkLnB1c2goc291cmNlKTtcblx0XHRcdFx0XHRcdHZhbHVlID0gX21peGluKHtcblx0XHRcdFx0XHRcdFx0ZGVlcDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aW5oZXJpdGVkOiBpbmhlcml0ZWQsXG5cdFx0XHRcdFx0XHRcdHNvdXJjZXM6IFsgdmFsdWUgXSxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0OiB0YXJnZXRWYWx1ZSxcblx0XHRcdFx0XHRcdFx0Y29waWVkXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGFyZ2V0W2tleV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gPFQmVT4gdGFyZ2V0O1xufVxuXG5pbnRlcmZhY2UgT2JqZWN0QXNzaWduQ29uc3RydWN0b3IgZXh0ZW5kcyBPYmplY3RDb25zdHJ1Y3RvciB7XG5cdGFzc2lnbjxULCBVPih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuXHRhc3NpZ248VCwgVTEsIFUyPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUxLCBzb3VyY2UyOiBVMik6IFQgJiBVMSAmIFUyO1xuXHRhc3NpZ248VCwgVTEsIFUyLCBVMz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVMSwgc291cmNlMjogVTIsIHNvdXJjZTM6IFUzKTogVCAmIFUxICYgVTIgJiBVMztcblx0YXNzaWduKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUsIGFuZCBjb3BpZXMgYWxsIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmVcbiAqIHNvdXJjZSBvYmplY3RzIHRvIHRoZSBuZXdseSBjcmVhdGVkIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHByb3RvdHlwZSBUaGUgcHJvdG90eXBlIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgZnJvbVxuICogQHBhcmFtIG1peGlucyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgY3JlYXRlZCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVywgbWl4aW40OiBYLCBtaXhpbjU6IFksIG1peGluNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVywgbWl4aW40OiBYLCBtaXhpbjU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcsIG1peGluNDogWCk6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVyk6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBUKTogVDtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlOiBhbnksIC4uLm1peGluczogYW55W10pOiBhbnkge1xuXHRpZiAoIW1peGlucy5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcblx0fVxuXG5cdGNvbnN0IGFyZ3MgPSBtaXhpbnMuc2xpY2UoKTtcblx0YXJncy51bnNoaWZ0KE9iamVjdC5jcmVhdGUocHJvdG90eXBlKSk7XG5cblx0cmV0dXJuIGFzc2lnbi5hcHBseShudWxsLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGUgdGFyZ2V0IG9iamVjdCxcbiAqIHJlY3Vyc2l2ZWx5IGNvcHlpbmcgYWxsIG5lc3RlZCBvYmplY3RzIGFuZCBhcnJheXMgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIHJlY2VpdmUgdmFsdWVzIGZyb20gc291cmNlIG9iamVjdHNcbiAqIEBwYXJhbSBzb3VyY2VzIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30sIFogZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZLCBzb3VyY2U2OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ24odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0cmV0dXJuIF9taXhpbih7XG5cdFx0ZGVlcDogdHJ1ZSxcblx0XHRpbmhlcml0ZWQ6IGZhbHNlLFxuXHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0dGFyZ2V0OiB0YXJnZXRcblx0fSk7XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYWxsIGVudW1lcmFibGUgKG93biBvciBpbmhlcml0ZWQpIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiB0YXJnZXQgb2JqZWN0LCByZWN1cnNpdmVseSBjb3B5aW5nIGFsbCBuZXN0ZWQgb2JqZWN0cyBhbmQgYXJyYXlzIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byByZWNlaXZlIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RzXG4gKiBAcGFyYW0gc291cmNlcyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiB0cnVlLFxuXHRcdGluaGVyaXRlZDogdHJ1ZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBzb3VyY2UncyBwcm90b3R5cGUgYXMgdGhlIHByb3RvdHlwZSBmb3IgdGhlIG5ldyBvYmplY3QsIGFuZCB0aGVuXG4gKiBkZWVwIGNvcGllcyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgdmFsdWVzIGludG8gdGhlIG5ldyB0YXJnZXQuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgb2JqZWN0IHRvIGR1cGxpY2F0ZVxuICogQHJldHVybiBUaGUgbmV3IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZHVwbGljYXRlPFQgZXh0ZW5kcyB7fT4oc291cmNlOiBUKTogVCB7XG5cdGNvbnN0IHRhcmdldCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHNvdXJjZSkpO1xuXG5cdHJldHVybiBkZWVwTWl4aW4odGFyZ2V0LCBzb3VyY2UpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lOyBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSWRlbnRpY2FsKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiBhID09PSBiIHx8XG5cdFx0LyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xuXHRcdChhICE9PSBhICYmIGIgIT09IGIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xuICogYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGluc3RlYWQgb2YgYSBmdW5jdGlvbiBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIG1ldGhvZCBvbiBhbiBvYmplY3QuXG4gKiBBcyBhIHJlc3VsdCwgdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IGBsYXRlQmluZGAgd2lsbCBhbHdheXMgY2FsbCB0aGUgZnVuY3Rpb24gY3VycmVudGx5IGFzc2lnbmVkIHRvXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXG4gKlxuICogQHBhcmFtIGluc3RhbmNlIFRoZSBjb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcHJlcGVuZCB0byB0aGUgYGluc3RhbmNlW21ldGhvZF1gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF0ZUJpbmQoaW5zdGFuY2U6IHt9LCBtZXRob2Q6IHN0cmluZywgLi4uc3VwcGxpZWRBcmdzOiBhbnlbXSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGggP1xuXHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnN0IGFyZ3M6IGFueVtdID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcblxuXHRcdFx0Ly8gVFM3MDE3XG5cdFx0XHRyZXR1cm4gKDxhbnk+IGluc3RhbmNlKVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblx0XHR9IDpcblx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyBUUzcwMTdcblx0XHRcdHJldHVybiAoPGFueT4gaW5zdGFuY2UpW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSAob3duIG9yIGluaGVyaXRlZCkgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiBmYWxzZSxcblx0XHRpbmhlcml0ZWQ6IHRydWUsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIHByZXBlbmRlZCB0byBpdHMgYXJndW1lbnQgbGlzdC5cbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXRGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBib3VuZFxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpYWwodGFyZ2V0RnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCAuLi5zdXBwbGllZEFyZ3M6IGFueVtdKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSkge1xuXHRcdGNvbnN0IGFyZ3M6IGFueVtdID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcblxuXHRcdHJldHVybiB0YXJnZXRGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgZGVzdHJveSBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIGNhbGxzIHRoZSBwYXNzZWQtaW4gZGVzdHJ1Y3Rvci5cbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIHVuaWZpZWQgaW50ZXJmYWNlIGZvciBjcmVhdGluZyBcInJlbW92ZVwiIC8gXCJkZXN0cm95XCIgaGFuZGxlcnMgZm9yXG4gKiBldmVudCBsaXN0ZW5lcnMsIHRpbWVycywgZXRjLlxuICpcbiAqIEBwYXJhbSBkZXN0cnVjdG9yIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBoYW5kbGUncyBgZGVzdHJveWAgbWV0aG9kIGlzIGludm9rZWRcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhhbmRsZShkZXN0cnVjdG9yOiAoKSA9PiB2b2lkKTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95OiBmdW5jdGlvbiAodGhpczogSGFuZGxlKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdGRlc3RydWN0b3IuY2FsbCh0aGlzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXN0cm95IG11bHRpcGxlIGhhbmRsZXMgc2ltdWx0YW5lb3VzbHkuXG4gKlxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlczogSGFuZGxlW10pOiBIYW5kbGUge1xuXHRyZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGhhbmRsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGhhbmRsZXNbaV0uZGVzdHJveSgpO1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGFuZy50cyIsImltcG9ydCBoYXMsIHsgYWRkIH0gZnJvbSAnQGRvam8vaGFzL2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGhhcztcbmV4cG9ydCAqIGZyb20gJ0Bkb2pvL2hhcy9oYXMnO1xuXG4vKiBFQ01BU2NyaXB0IDYgYW5kIDcgRmVhdHVyZXMgKi9cblxuLyogQXJyYXkgKi9cbmFkZChcblx0J2VzNi1hcnJheScsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0Wydmcm9tJywgJ29mJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheSkgJiZcblx0XHRcdFsnZmluZEluZGV4JywgJ2ZpbmQnLCAnY29weVdpdGhpbiddLmV2ZXJ5KChrZXkpID0+IGtleSBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlKVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1hcnJheS1maWxsJyxcblx0KCkgPT4ge1xuXHRcdGlmICgnZmlsbCcgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSkge1xuXHRcdFx0LyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXG5cdFx0XHRyZXR1cm4gKDxhbnk+WzFdKS5maWxsKDksIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSlbMF0gPT09IDE7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKCdlczctYXJyYXknLCAoKSA9PiAnaW5jbHVkZXMnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUsIHRydWUpO1xuXG4vKiBNYXAgKi9cbmFkZChcblx0J2VzNi1tYXAnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuTWFwID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHQvKlxuXHRcdElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcblx0XHRXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxuXHRcdHRha2UgYXJndW1lbnRzIChpT1MgOC40KVxuXHRcdCAqL1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgbWFwID0gbmV3IGdsb2JhbC5NYXAoW1swLCAxXV0pO1xuXG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0bWFwLmhhcygwKSAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdGhhcygnZXM2LXN5bWJvbCcpICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLmVudHJpZXMgPT09ICdmdW5jdGlvbidcblx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCB0ZXN0aW5nIG9uIGlPUyBhdCB0aGUgbW9tZW50ICovXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBNYXRoICovXG5hZGQoXG5cdCdlczYtbWF0aCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0J2NsejMyJyxcblx0XHRcdCdzaWduJyxcblx0XHRcdCdsb2cxMCcsXG5cdFx0XHQnbG9nMicsXG5cdFx0XHQnbG9nMXAnLFxuXHRcdFx0J2V4cG0xJyxcblx0XHRcdCdjb3NoJyxcblx0XHRcdCdzaW5oJyxcblx0XHRcdCd0YW5oJyxcblx0XHRcdCdhY29zaCcsXG5cdFx0XHQnYXNpbmgnLFxuXHRcdFx0J2F0YW5oJyxcblx0XHRcdCd0cnVuYycsXG5cdFx0XHQnZnJvdW5kJyxcblx0XHRcdCdjYnJ0Jyxcblx0XHRcdCdoeXBvdCdcblx0XHRdLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk1hdGhbbmFtZV0gPT09ICdmdW5jdGlvbicpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtbWF0aC1pbXVsJyxcblx0KCkgPT4ge1xuXHRcdGlmICgnaW11bCcgaW4gZ2xvYmFsLk1hdGgpIHtcblx0XHRcdC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cblx0XHRcdHJldHVybiAoPGFueT5NYXRoKS5pbXVsKDB4ZmZmZmZmZmYsIDUpID09PSAtNTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBPYmplY3QgKi9cbmFkZChcblx0J2VzNi1vYmplY3QnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdGhhcygnZXM2LXN5bWJvbCcpICYmXG5cdFx0XHRbJ2Fzc2lnbicsICdpcycsICdnZXRPd25Qcm9wZXJ0eVN5bWJvbHMnLCAnc2V0UHJvdG90eXBlT2YnXS5ldmVyeShcblx0XHRcdFx0KG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXMyMDE3LW9iamVjdCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gWyd2YWx1ZXMnLCAnZW50cmllcycsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzJ10uZXZlcnkoXG5cdFx0XHQobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbidcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBPYnNlcnZhYmxlICovXG5hZGQoJ2VzLW9ic2VydmFibGUnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLk9ic2VydmFibGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcblxuLyogUHJvbWlzZSAqL1xuYWRkKCdlczYtcHJvbWlzZScsICgpID0+IHR5cGVvZiBnbG9iYWwuUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzKCdlczYtc3ltYm9sJyksIHRydWUpO1xuXG4vKiBTZXQgKi9cbmFkZChcblx0J2VzNi1zZXQnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuU2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHQvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IFNldCBmdW5jdGlvbmFsaXR5ICovXG5cdFx0XHRjb25zdCBzZXQgPSBuZXcgZ2xvYmFsLlNldChbMV0pO1xuXHRcdFx0cmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgaGFzKCdlczYtc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogU3RyaW5nICovXG5hZGQoXG5cdCdlczYtc3RyaW5nJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRbXG5cdFx0XHRcdC8qIHN0YXRpYyBtZXRob2RzICovXG5cdFx0XHRcdCdmcm9tQ29kZVBvaW50J1xuXHRcdFx0XS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nKSAmJlxuXHRcdFx0W1xuXHRcdFx0XHQvKiBpbnN0YW5jZSBtZXRob2RzICovXG5cdFx0XHRcdCdjb2RlUG9pbnRBdCcsXG5cdFx0XHRcdCdub3JtYWxpemUnLFxuXHRcdFx0XHQncmVwZWF0Jyxcblx0XHRcdFx0J3N0YXJ0c1dpdGgnLFxuXHRcdFx0XHQnZW5kc1dpdGgnLFxuXHRcdFx0XHQnaW5jbHVkZXMnXG5cdFx0XHRdLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nKVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1zdHJpbmctcmF3Jyxcblx0KCkgPT4ge1xuXHRcdGZ1bmN0aW9uIGdldENhbGxTaXRlKGNhbGxTaXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IFsuLi5jYWxsU2l0ZV07XG5cdFx0XHQocmVzdWx0IGFzIGFueSkucmF3ID0gY2FsbFNpdGUucmF3O1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRpZiAoJ3JhdycgaW4gZ2xvYmFsLlN0cmluZykge1xuXHRcdFx0bGV0IGIgPSAxO1xuXHRcdFx0bGV0IGNhbGxTaXRlID0gZ2V0Q2FsbFNpdGVgYVxcbiR7Yn1gO1xuXG5cdFx0XHQoY2FsbFNpdGUgYXMgYW55KS5yYXcgPSBbJ2FcXFxcbiddO1xuXHRcdFx0Y29uc3Qgc3VwcG9ydHNUcnVuYyA9IGdsb2JhbC5TdHJpbmcucmF3KGNhbGxTaXRlLCA0MikgPT09ICdhOlxcXFxuJztcblxuXHRcdFx0cmV0dXJuIHN1cHBvcnRzVHJ1bmM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczIwMTctc3RyaW5nJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbJ3BhZFN0YXJ0JywgJ3BhZEVuZCddLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nKTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogU3ltYm9sICovXG5hZGQoJ2VzNi1zeW1ib2wnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJywgdHJ1ZSk7XG5cbi8qIFdlYWtNYXAgKi9cbmFkZChcblx0J2VzNi13ZWFrbWFwJyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLldlYWtNYXAgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHQvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5ICovXG5cdFx0XHRjb25zdCBrZXkxID0ge307XG5cdFx0XHRjb25zdCBrZXkyID0ge307XG5cdFx0XHRjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLldlYWtNYXAoW1trZXkxLCAxXV0pO1xuXHRcdFx0T2JqZWN0LmZyZWV6ZShrZXkxKTtcblx0XHRcdHJldHVybiBtYXAuZ2V0KGtleTEpID09PSAxICYmIG1hcC5zZXQoa2V5MiwgMikgPT09IG1hcCAmJiBoYXMoJ2VzNi1zeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBNaXNjZWxsYW5lb3VzIGZlYXR1cmVzICovXG5hZGQoJ21pY3JvdGFza3MnLCAoKSA9PiBoYXMoJ2VzNi1wcm9taXNlJykgfHwgaGFzKCdob3N0LW5vZGUnKSB8fCBoYXMoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJyksIHRydWUpO1xuYWRkKFxuXHQncG9zdG1lc3NhZ2UnLFxuXHQoKSA9PiB7XG5cdFx0Ly8gSWYgd2luZG93IGlzIHVuZGVmaW5lZCwgYW5kIHdlIGhhdmUgcG9zdE1lc3NhZ2UsIGl0IHByb2JhYmx5IG1lYW5zIHdlJ3JlIGluIGEgd2ViIHdvcmtlci4gV2ViIHdvcmtlcnMgaGF2ZVxuXHRcdC8vIHBvc3QgbWVzc2FnZSBidXQgaXQgZG9lc24ndCB3b3JrIGhvdyB3ZSBleHBlY3QgaXQgdG8sIHNvIGl0J3MgYmVzdCBqdXN0IHRvIHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cblx0XHRyZXR1cm4gdHlwZW9mIGdsb2JhbC53aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBnbG9iYWwucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbic7XG5cdH0sXG5cdHRydWVcbik7XG5hZGQoJ3JhZicsICgpID0+IHR5cGVvZiBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nLCB0cnVlKTtcbmFkZCgnc2V0aW1tZWRpYXRlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5zZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcblxuLyogRE9NIEZlYXR1cmVzICovXG5cbmFkZChcblx0J2RvbS1tdXRhdGlvbm9ic2VydmVyJyxcblx0KCkgPT4ge1xuXHRcdGlmIChoYXMoJ2hvc3QtYnJvd3NlcicpICYmIEJvb2xlYW4oZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXIpKSB7XG5cdFx0XHQvLyBJRTExIGhhcyBhbiB1bnJlbGlhYmxlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gd2hlcmUgc2V0UHJvcGVydHkoKSBkb2VzIG5vdFxuXHRcdFx0Ly8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxuXHRcdFx0Ly8gcmVsaWFibHkuIFRoZSBmb2xsb3dpbmcgZmVhdHVyZSB0ZXN0IHdhcyBhZGFwdGVkIGZyb21cblx0XHRcdC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3QxMGtvLzRhY2ViOGM3MTY4MWZkYjI3NWUzM2VmZTVlNTc2YjE0XG5cdFx0XHRjb25zdCBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHQvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xuXHRcdFx0Y29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKCkge30pO1xuXHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShleGFtcGxlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cblx0XHRcdGV4YW1wbGUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0cmV0dXJuIEJvb2xlYW4ob2JzZXJ2ZXIudGFrZVJlY29yZHMoKS5sZW5ndGgpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaGFzLnRzIiwiaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlLCBJdGVyYWJsZUl0ZXJhdG9yLCBTaGltSXRlcmF0b3IgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXMgYXMgb2JqZWN0SXMgfSBmcm9tICcuL29iamVjdCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwPEssIFY+IHtcblx0LyoqXG5cdCAqIERlbGV0ZXMgYWxsIGtleXMgYW5kIHRoZWlyIGFzc29jaWF0ZWQgdmFsdWVzLlxuXHQgKi9cblx0Y2xlYXIoKTogdm9pZDtcblxuXHQvKipcblx0ICogRGVsZXRlcyBhIGdpdmVuIGtleSBhbmQgaXRzIGFzc29jaWF0ZWQgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWxldGVcblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBrZXkgZXhpc3RzLCBmYWxzZSBpZiBpdCBkb2VzIG5vdFxuXHQgKi9cblx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkvdmFsdWUgcGFpciBhcyBhbiBhcnJheS5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBmb3IgZWFjaCBrZXkvdmFsdWUgcGFpciBpbiB0aGUgaW5zdGFuY2UuXG5cdCAqL1xuXHRlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPjtcblxuXHQvKipcblx0ICogRXhlY3V0ZXMgYSBnaXZlbiBmdW5jdGlvbiBmb3IgZWFjaCBtYXAgZW50cnkuIFRoZSBmdW5jdGlvblxuXHQgKiBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgZWxlbWVudCB2YWx1ZSwgdGhlXG5cdCAqIGVsZW1lbnQga2V5LCBhbmQgdGhlIGFzc29jaWF0ZWQgTWFwIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gY2FsbGJhY2tmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBmb3IgZWFjaCBtYXAgZW50cnksXG5cdCAqIEBwYXJhbSB0aGlzQXJnIFRoZSB2YWx1ZSB0byB1c2UgZm9yIGB0aGlzYCBmb3IgZWFjaCBleGVjdXRpb24gb2YgdGhlIGNhbGJhY2tcblx0ICovXG5cdGZvckVhY2goY2FsbGJhY2tmbjogKHZhbHVlOiBWLCBrZXk6IEssIG1hcDogTWFwPEssIFY+KSA9PiB2b2lkLCB0aGlzQXJnPzogYW55KTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gbG9vayB1cFxuXHQgKiBAcmV0dXJuIFRoZSB2YWx1ZSBpZiBvbmUgZXhpc3RzIG9yIHVuZGVmaW5lZFxuXHQgKi9cblx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkgaW4gdGhlIG1hcC5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBjb250YWluaW5nIHRoZSBpbnN0YW5jZSdzIGtleXMuXG5cdCAqL1xuXHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz47XG5cblx0LyoqXG5cdCAqIENoZWNrcyBmb3IgdGhlIHByZXNlbmNlIG9mIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gY2hlY2sgZm9yXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUga2V5IGV4aXN0cywgZmFsc2UgaWYgaXQgZG9lcyBub3Rcblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWZpbmUgYSB2YWx1ZSB0b1xuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnblxuXHQgKiBAcmV0dXJuIFRoZSBNYXAgaW5zdGFuY2Vcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleSAvIHZhbHVlIHBhaXJzIGluIHRoZSBNYXAuXG5cdCAqL1xuXHRyZWFkb25seSBzaXplOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCB2YWx1ZSBpbiB0aGUgbWFwLlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdGhlIGluc3RhbmNlJ3MgdmFsdWVzLlxuXHQgKi9cblx0dmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj47XG5cblx0LyoqIFJldHVybnMgYW4gaXRlcmFibGUgb2YgZW50cmllcyBpbiB0aGUgbWFwLiAqL1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT47XG5cblx0cmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdG5ldyAoKTogTWFwPGFueSwgYW55PjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYXRvclxuXHQgKiBBcnJheSBvciBpdGVyYXRvciBjb250YWluaW5nIHR3by1pdGVtIHR1cGxlcyB1c2VkIHRvIGluaXRpYWxseSBwb3B1bGF0ZSB0aGUgbWFwLlxuXHQgKiBUaGUgZmlyc3QgaXRlbSBpbiBlYWNoIHR1cGxlIGNvcnJlc3BvbmRzIHRvIHRoZSBrZXkgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICogVGhlIHNlY29uZCBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKi9cblx0bmV3IDxLLCBWPihpdGVyYXRvcj86IFtLLCBWXVtdKTogTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhdG9yXG5cdCAqIEFycmF5IG9yIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdHdvLWl0ZW0gdHVwbGVzIHVzZWQgdG8gaW5pdGlhbGx5IHBvcHVsYXRlIHRoZSBtYXAuXG5cdCAqIFRoZSBmaXJzdCBpdGVtIGluIGVhY2ggdHVwbGUgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKiBUaGUgc2Vjb25kIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqL1xuXHRuZXcgPEssIFY+KGl0ZXJhdG9yOiBJdGVyYWJsZTxbSywgVl0+KTogTWFwPEssIFY+O1xuXG5cdHJlYWRvbmx5IHByb3RvdHlwZTogTWFwPGFueSwgYW55PjtcblxuXHRyZWFkb25seSBbU3ltYm9sLnNwZWNpZXNdOiBNYXBDb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGxldCBNYXA6IE1hcENvbnN0cnVjdG9yID0gZ2xvYmFsLk1hcDtcblxuaWYgKCFoYXMoJ2VzNi1tYXAnKSkge1xuXHRNYXAgPSBjbGFzcyBNYXA8SywgVj4ge1xuXHRcdHByb3RlY3RlZCByZWFkb25seSBfa2V5czogS1tdID0gW107XG5cdFx0cHJvdGVjdGVkIHJlYWRvbmx5IF92YWx1ZXM6IFZbXSA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXG5cdFx0ICogdG8gY2hlY2sgZm9yIGVxdWFsaXR5LiBTZWUgaHR0cDovL216bC5sYS8xenVLTzJWXG5cdFx0ICovXG5cdFx0cHJvdGVjdGVkIF9pbmRleE9mS2V5KGtleXM6IEtbXSwga2V5OiBLKTogbnVtYmVyIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChvYmplY3RJcyhrZXlzW2ldLCBrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXSA9IE1hcDtcblxuXHRcdGNvbnN0cnVjdG9yKGl0ZXJhYmxlPzogQXJyYXlMaWtlPFtLLCBWXT4gfCBJdGVyYWJsZTxbSywgVl0+KSB7XG5cdFx0XHRpZiAoaXRlcmFibGUpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdldCBzaXplKCk6IG51bWJlciB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0Y2xlYXIoKTogdm9pZCB7XG5cdFx0XHR0aGlzLl9rZXlzLmxlbmd0aCA9IHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9rZXlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR0aGlzLl92YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX2tleXMubWFwKChrZXk6IEssIGk6IG51bWJlcik6IFtLLCBWXSA9PiB7XG5cdFx0XHRcdHJldHVybiBba2V5LCB0aGlzLl92YWx1ZXNbaV1dO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XG5cdFx0fVxuXG5cdFx0Zm9yRWFjaChjYWxsYmFjazogKHZhbHVlOiBWLCBrZXk6IEssIG1hcEluc3RhbmNlOiBNYXA8SywgVj4pID0+IGFueSwgY29udGV4dD86IHt9KSB7XG5cdFx0XHRjb25zdCBrZXlzID0gdGhpcy5fa2V5cztcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZCB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiB0aGlzLl92YWx1ZXNbaW5kZXhdO1xuXHRcdH1cblxuXHRcdGhhcyhrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSkgPiAtMTtcblx0XHR9XG5cblx0XHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fa2V5cyk7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogSywgdmFsdWU6IFYpOiBNYXA8SywgVj4ge1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aW5kZXggPSBpbmRleCA8IDAgPyB0aGlzLl9rZXlzLmxlbmd0aCA6IGluZGV4O1xuXHRcdFx0dGhpcy5fa2V5c1tpbmRleF0gPSBrZXk7XG5cdFx0XHR0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHR2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxWPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzKCk7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdNYXAnID0gJ01hcCc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBNYXAudHMiLCJpbXBvcnQgeyBUaGVuYWJsZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IHF1ZXVlTWljcm9UYXNrIH0gZnJvbSAnLi9zdXBwb3J0L3F1ZXVlJztcbmltcG9ydCB7IEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5cbi8qKlxuICogRXhlY3V0b3IgaXMgdGhlIGludGVyZmFjZSBmb3IgZnVuY3Rpb25zIHVzZWQgdG8gaW5pdGlhbGl6ZSBhIFByb21pc2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0b3I8VD4ge1xuXHQvKipcblx0ICogVGhlIGV4ZWN1dG9yIGZvciB0aGUgcHJvbWlzZVxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzb2x2ZSBUaGUgcmVzb2x2ZXIgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICogQHBhcmFtIHJlamVjdCBUaGUgcmVqZWN0b3IgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICovXG5cdChyZXNvbHZlOiAodmFsdWU/OiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQsIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBsZXQgU2hpbVByb21pc2U6IHR5cGVvZiBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbmV4cG9ydCBjb25zdCBpc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZTxUPih2YWx1ZTogYW55KTogdmFsdWUgaXMgUHJvbWlzZUxpa2U8VD4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59O1xuXG5pZiAoIWhhcygnZXM2LXByb21pc2UnKSkge1xuXHRjb25zdCBlbnVtIFN0YXRlIHtcblx0XHRGdWxmaWxsZWQsXG5cdFx0UGVuZGluZyxcblx0XHRSZWplY3RlZFxuXHR9XG5cblx0Z2xvYmFsLlByb21pc2UgPSBTaGltUHJvbWlzZSA9IGNsYXNzIFByb21pc2U8VD4gaW1wbGVtZW50cyBUaGVuYWJsZTxUPiB7XG5cdFx0c3RhdGljIGFsbChpdGVyYWJsZTogSXRlcmFibGU8YW55IHwgUHJvbWlzZUxpa2U8YW55Pj4gfCAoYW55IHwgUHJvbWlzZUxpa2U8YW55PilbXSk6IFByb21pc2U8YW55PiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcblx0XHRcdFx0bGV0IGNvbXBsZXRlID0gMDtcblx0XHRcdFx0bGV0IHRvdGFsID0gMDtcblx0XHRcdFx0bGV0IHBvcHVsYXRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXg6IG51bWJlciwgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdFx0XHRcdHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHQrK2NvbXBsZXRlO1xuXHRcdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmluaXNoKCk6IHZvaWQge1xuXHRcdFx0XHRcdGlmIChwb3B1bGF0aW5nIHx8IGNvbXBsZXRlIDwgdG90YWwpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZSh2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KTogdm9pZCB7XG5cdFx0XHRcdFx0Kyt0b3RhbDtcblx0XHRcdFx0XHRpZiAoaXNUaGVuYWJsZShpdGVtKSkge1xuXHRcdFx0XHRcdFx0Ly8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpID0gMDtcblx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdHByb2Nlc3NJdGVtKGksIHZhbHVlKTtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG9wdWxhdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJhY2U8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQgfCBQcm9taXNlTGlrZTxUPj4gfCAoVCB8IFByb21pc2VMaWtlPFQ+KVtdKTogUHJvbWlzZTxUW10+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlOiAodmFsdWU/OiBhbnkpID0+IHZvaWQsIHJlamVjdCkge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdFx0XHRcdC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlamVjdChyZWFzb24/OiBhbnkpOiBQcm9taXNlPG5ldmVyPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdHJlamVjdChyZWFzb24pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlc29sdmUoKTogUHJvbWlzZTx2b2lkPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZT86IGFueSk6IFByb21pc2U8VD4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUpIHtcblx0XHRcdFx0cmVzb2x2ZSg8VD52YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXTogUHJvbWlzZUNvbnN0cnVjdG9yID0gU2hpbVByb21pc2UgYXMgUHJvbWlzZUNvbnN0cnVjdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBhIG5ldyBQcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZXhlY3V0b3Jcblx0XHQgKiBUaGUgZXhlY3V0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIFByb21pc2UgaXMgaW5zdGFudGlhdGVkLiBJdCBpcyByZXNwb25zaWJsZSBmb3Jcblx0XHQgKiBzdGFydGluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGVuIGl0IGlzIGludm9rZWQuXG5cdFx0ICpcblx0XHQgKiBUaGUgZXhlY3V0b3IgbXVzdCBjYWxsIGVpdGhlciB0aGUgcGFzc2VkIGByZXNvbHZlYCBmdW5jdGlvbiB3aGVuIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWRcblx0XHQgKiBzdWNjZXNzZnVsbHksIG9yIHRoZSBgcmVqZWN0YCBmdW5jdGlvbiB3aGVuIHRoZSBvcGVyYXRpb24gZmFpbHMuXG5cdFx0ICovXG5cdFx0Y29uc3RydWN0b3IoZXhlY3V0b3I6IEV4ZWN1dG9yPFQ+KSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIElmIHRydWUsIHRoZSByZXNvbHV0aW9uIG9mIHRoaXMgcHJvbWlzZSBpcyBjaGFpbmVkIChcImxvY2tlZCBpblwiKSB0byBhbm90aGVyIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBpc0NoYWluZWQgPSBmYWxzZTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgaXNSZXNvbHZlZCA9ICgpOiBib29sZWFuID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcgfHwgaXNDaGFpbmVkO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDYWxsYmFja3MgdGhhdCBzaG91bGQgYmUgaW52b2tlZCBvbmNlIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWQuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBjYWxsYmFja3M6IG51bGwgfCAoQXJyYXk8KCkgPT4gdm9pZD4pID0gW107XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW5pdGlhbGx5IHB1c2hlcyBjYWxsYmFja3Mgb250byBhIHF1ZXVlIGZvciBleGVjdXRpb24gb25jZSB0aGlzIHByb21pc2Ugc2V0dGxlcy4gQWZ0ZXIgdGhlIHByb21pc2Ugc2V0dGxlcyxcblx0XHRcdCAqIGVucXVldWVzIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3AgdHVybi5cblx0XHRcdCAqL1xuXHRcdFx0bGV0IHdoZW5GaW5pc2hlZCA9IGZ1bmN0aW9uKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG5cdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogU2V0dGxlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHNldHRsZSA9IChuZXdTdGF0ZTogU3RhdGUsIHZhbHVlOiBhbnkpOiB2b2lkID0+IHtcblx0XHRcdFx0Ly8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZWRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR3aGVuRmluaXNoZWQgPSBxdWV1ZU1pY3JvVGFzaztcblxuXHRcdFx0XHQvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xuXHRcdFx0XHQvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXG5cdFx0XHRcdGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRxdWV1ZU1pY3JvVGFzayhmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGNvdW50ID0gY2FsbGJhY2tzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNvbHZlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHJlc29sdmUgPSAobmV3U3RhdGU6IFN0YXRlLCB2YWx1ZTogYW55KTogdm9pZCA9PiB7XG5cdFx0XHRcdGlmIChpc1Jlc29sdmVkKCkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHtcblx0XHRcdFx0XHR2YWx1ZS50aGVuKHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLkZ1bGZpbGxlZCksIHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHRcdFx0aXNDaGFpbmVkID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZXR0bGUobmV3U3RhdGUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy50aGVuID0gPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRcdG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pIHwgdW5kZWZpbmVkIHwgbnVsbCxcblx0XHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHRcdCk6IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4gPT4ge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIHdoZW5GaW5pc2hlZCBpbml0aWFsbHkgcXVldWVzIHVwIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIGFmdGVyIHRoZSBwcm9taXNlIGhhcyBzZXR0bGVkLiBPbmNlIHRoZVxuXHRcdFx0XHRcdC8vIHByb21pc2UgaGFzIHNldHRsZWQsIHdoZW5GaW5pc2hlZCB3aWxsIHNjaGVkdWxlIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IHR1cm4gdGhyb3VnaCB0aGVcblx0XHRcdFx0XHQvLyBldmVudCBsb29wLlxuXHRcdFx0XHRcdHdoZW5GaW5pc2hlZCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBjYWxsYmFjazogKCh2YWx1ZT86IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCB8IG51bGwgPVxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoY2FsbGJhY2sodGhpcy5yZXNvbHZlZFZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgU3RhdGUuRnVsZmlsbGVkKSwgcmVzb2x2ZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRzZXR0bGUoU3RhdGUuUmVqZWN0ZWQsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjYXRjaDxUUmVzdWx0ID0gbmV2ZXI+KFxuXHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0KTogUHJvbWlzZTxUIHwgVFJlc3VsdD4ge1xuXHRcdFx0cmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cblx0XHQgKi9cblx0XHRwcml2YXRlIHN0YXRlID0gU3RhdGUuUGVuZGluZztcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUge1R8YW55fVxuXHRcdCAqL1xuXHRcdHByaXZhdGUgcmVzb2x2ZWRWYWx1ZTogYW55O1xuXG5cdFx0dGhlbjogPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRvbmZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdFx0XHRvbnJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdCkgPT4gUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnUHJvbWlzZScgPSAnUHJvbWlzZSc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaW1Qcm9taXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFByb21pc2UudHMiLCJpbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBnZXRWYWx1ZURlc2NyaXB0b3IgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcblx0aW50ZXJmYWNlIFN5bWJvbENvbnN0cnVjdG9yIHtcblx0XHRvYnNlcnZhYmxlOiBzeW1ib2w7XG5cdH1cbn1cblxuZXhwb3J0IGxldCBTeW1ib2w6IFN5bWJvbENvbnN0cnVjdG9yID0gZ2xvYmFsLlN5bWJvbDtcblxuaWYgKCFoYXMoJ2VzNi1zeW1ib2wnKSkge1xuXHQvKipcblx0ICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cblx0ICogQHBhcmFtICB7YW55fSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcblx0ICogQHJldHVybiB7c3ltYm9sfSAgICAgICBSZXR1cm5zIHRoZSBzeW1ib2wgb3IgdGhyb3dzXG5cdCAqL1xuXHRjb25zdCB2YWxpZGF0ZVN5bWJvbCA9IGZ1bmN0aW9uIHZhbGlkYXRlU3ltYm9sKHZhbHVlOiBhbnkpOiBzeW1ib2wge1xuXHRcdGlmICghaXNTeW1ib2wodmFsdWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXG5cdGNvbnN0IGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblx0Y29uc3QgZGVmaW5lUHJvcGVydHk6IChcblx0XHRvOiBhbnksXG5cdFx0cDogc3RyaW5nIHwgc3ltYm9sLFxuXHRcdGF0dHJpYnV0ZXM6IFByb3BlcnR5RGVzY3JpcHRvciAmIFRoaXNUeXBlPGFueT5cblx0KSA9PiBhbnkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgYXMgYW55O1xuXHRjb25zdCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG5cdGNvbnN0IG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5cblx0Y29uc3QgZ2xvYmFsU3ltYm9sczogeyBba2V5OiBzdHJpbmddOiBzeW1ib2wgfSA9IHt9O1xuXG5cdGNvbnN0IGdldFN5bWJvbE5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgY3JlYXRlZCA9IGNyZWF0ZShudWxsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZGVzYzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcblx0XHRcdGxldCBwb3N0Zml4ID0gMDtcblx0XHRcdGxldCBuYW1lOiBzdHJpbmc7XG5cdFx0XHR3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XG5cdFx0XHRcdCsrcG9zdGZpeDtcblx0XHRcdH1cblx0XHRcdGRlc2MgKz0gU3RyaW5nKHBvc3RmaXggfHwgJycpO1xuXHRcdFx0Y3JlYXRlZFtkZXNjXSA9IHRydWU7XG5cdFx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cblx0XHRcdC8vIEZJWE1FOiBUZW1wb3JhcnkgZ3VhcmQgdW50aWwgdGhlIGR1cGxpY2F0ZSBleGVjdXRpb24gd2hlbiB0ZXN0aW5nIGNhbiBiZVxuXHRcdFx0Ly8gcGlubmVkIGRvd24uXG5cdFx0XHRpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlLCBuYW1lKSkge1xuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eShvYmpQcm90b3R5cGUsIG5hbWUsIHtcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCwgdmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdFx0ZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fTtcblx0fSkoKTtcblxuXHRjb25zdCBJbnRlcm5hbFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCh0aGlzOiBhbnksIGRlc2NyaXB0aW9uPzogc3RyaW5nIHwgbnVtYmVyKTogc3ltYm9sIHtcblx0XHRpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRyZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcblx0fTtcblxuXHRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKHRoaXM6IFN5bWJvbCwgZGVzY3JpcHRpb24/OiBzdHJpbmcgfCBudW1iZXIpOiBzeW1ib2wge1xuXHRcdGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRjb25zdCBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSk7XG5cdFx0ZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pO1xuXHRcdHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bSwge1xuXHRcdFx0X19kZXNjcmlwdGlvbl9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxuXHRcdFx0X19uYW1lX186IGdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lKGRlc2NyaXB0aW9uKSlcblx0XHR9KTtcblx0fSBhcyBTeW1ib2xDb25zdHJ1Y3RvcjtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0U3ltYm9sLFxuXHRcdCdmb3InLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbihrZXk6IHN0cmluZyk6IHN5bWJvbCB7XG5cdFx0XHRpZiAoZ2xvYmFsU3ltYm9sc1trZXldKSB7XG5cdFx0XHRcdHJldHVybiBnbG9iYWxTeW1ib2xzW2tleV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbChTdHJpbmcoa2V5KSkpO1xuXHRcdH0pXG5cdCk7XG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLCB7XG5cdFx0a2V5Rm9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24oc3ltOiBzeW1ib2wpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRcdFx0bGV0IGtleTogc3RyaW5nO1xuXHRcdFx0dmFsaWRhdGVTeW1ib2woc3ltKTtcblx0XHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcblx0XHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLFxuXHRcdGhhc0luc3RhbmNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpc0NvbmNhdFNwcmVhZGFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpdGVyYXRvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0bWF0Y2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdG9ic2VydmFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0cmVwbGFjZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzZWFyY2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzcGVjaWVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwbGl0OiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR0b1ByaW1pdGl2ZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dG9TdHJpbmdUYWc6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHVuc2NvcGFibGVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXG5cdGRlZmluZVByb3BlcnRpZXMoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLCB7XG5cdFx0Y29uc3RydWN0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wpLFxuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoXG5cdFx0XHRmdW5jdGlvbih0aGlzOiB7IF9fbmFtZV9fOiBzdHJpbmcgfSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX25hbWVfXztcblx0XHRcdH0sXG5cdFx0XHRmYWxzZSxcblx0XHRcdGZhbHNlXG5cdFx0KVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sLnByb3RvdHlwZSAqL1xuXHRkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHR0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuICdTeW1ib2wgKCcgKyAoPGFueT52YWxpZGF0ZVN5bWJvbCh0aGlzKSkuX19kZXNjcmlwdGlvbl9fICsgJyknO1xuXHRcdH0pLFxuXHRcdHZhbHVlT2Y6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTtcblx0XHR9KVxuXHR9KTtcblxuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdFx0fSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoJ1N5bWJvbCcsIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xuXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdEludGVybmFsU3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKCg8YW55PlN5bWJvbCkucHJvdG90eXBlW1N5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0SW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoKDxhbnk+U3ltYm9sKS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKVxuXHQpO1xufVxuXG4vKipcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcGFyYW0gIHthbnl9ICAgICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjayB0byBzZWUgaWYgaXQgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcmV0dXJuIHtpcyBzeW1ib2x9ICAgICAgIFJldHVybnMgdHJ1ZSBpZiBhIHN5bWJvbCBvciBub3QgKGFuZCBuYXJyb3dzIHRoZSB0eXBlIGd1YXJkKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTeW1ib2wodmFsdWU6IGFueSk6IHZhbHVlIGlzIHN5bWJvbCB7XG5cdHJldHVybiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgfHwgdmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpKSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cbiAqL1xuW1xuXHQnaGFzSW5zdGFuY2UnLFxuXHQnaXNDb25jYXRTcHJlYWRhYmxlJyxcblx0J2l0ZXJhdG9yJyxcblx0J3NwZWNpZXMnLFxuXHQncmVwbGFjZScsXG5cdCdzZWFyY2gnLFxuXHQnc3BsaXQnLFxuXHQnbWF0Y2gnLFxuXHQndG9QcmltaXRpdmUnLFxuXHQndG9TdHJpbmdUYWcnLFxuXHQndW5zY29wYWJsZXMnLFxuXHQnb2JzZXJ2YWJsZSdcbl0uZm9yRWFjaCgod2VsbEtub3duKSA9PiB7XG5cdGlmICghKFN5bWJvbCBhcyBhbnkpW3dlbGxLbm93bl0pIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sLCB3ZWxsS25vd24sIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFN5bWJvbC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Vha01hcDxLIGV4dGVuZHMgb2JqZWN0LCBWPiB7XG5cdC8qKlxuXHQgKiBSZW1vdmUgYSBga2V5YCBmcm9tIHRoZSBtYXBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJlbW92ZVxuXHQgKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUgdmFsdWUgd2FzIHJlbW92ZWQsIG90aGVyd2lzZSBgZmFsc2VgXG5cdCAqL1xuXHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHZhbHVlLCBiYXNlZCBvbiB0aGUgc3VwcGxpZWQgYGtleWBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJldHJpZXZlIHRoZSBgdmFsdWVgIGZvclxuXHQgKiBAcmV0dXJuIHRoZSBgdmFsdWVgIGJhc2VkIG9uIHRoZSBga2V5YCBpZiBmb3VuZCwgb3RoZXJ3aXNlIGBmYWxzZWBcblx0ICovXG5cdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIGEgYGtleWAgaXMgcHJlc2VudCBpbiB0aGUgbWFwXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBrZXkgaXMgcGFydCBvZiB0aGUgbWFwLCBvdGhlcndpc2UgYGZhbHNlYC5cblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXQgYSBgdmFsdWVgIGZvciBhIHBhcnRpY3VsYXIgYGtleWAuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIHNldCB0aGUgYHZhbHVlYCBmb3Jcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBgdmFsdWVgIHRvIHNldFxuXHQgKiBAcmV0dXJuIHRoZSBpbnN0YW5jZXNcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHRyZWFkb25seSBbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1dlYWtNYXAnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdlYWtNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRuZXcgKCk6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlPzogW0ssIFZdW10pOiBXZWFrTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlOiBJdGVyYWJsZTxbSywgVl0+KTogV2Vha01hcDxLLCBWPjtcblxuXHRyZWFkb25seSBwcm90b3R5cGU6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xufVxuXG5leHBvcnQgbGV0IFdlYWtNYXA6IFdlYWtNYXBDb25zdHJ1Y3RvciA9IGdsb2JhbC5XZWFrTWFwO1xuXG5pbnRlcmZhY2UgRW50cnk8SywgVj4ge1xuXHRrZXk6IEs7XG5cdHZhbHVlOiBWO1xufVxuXG5pZiAoIWhhcygnZXM2LXdlYWttYXAnKSkge1xuXHRjb25zdCBERUxFVEVEOiBhbnkgPSB7fTtcblxuXHRjb25zdCBnZXRVSUQgPSBmdW5jdGlvbiBnZXRVSUQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKTtcblx0fTtcblxuXHRjb25zdCBnZW5lcmF0ZU5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHN0YXJ0SWQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgJSAxMDAwMDAwMDApO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuICdfX3dtJyArIGdldFVJRCgpICsgKHN0YXJ0SWQrKyArICdfXycpO1xuXHRcdH07XG5cdH0pKCk7XG5cblx0V2Vha01hcCA9IGNsYXNzIFdlYWtNYXA8SywgVj4ge1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZztcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9mcm96ZW5FbnRyaWVzOiBFbnRyeTxLLCBWPltdO1xuXG5cdFx0Y29uc3RydWN0b3IoaXRlcmFibGU/OiBBcnJheUxpa2U8W0ssIFZdPiB8IEl0ZXJhYmxlPFtLLCBWXT4pIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX25hbWUnLCB7XG5cdFx0XHRcdHZhbHVlOiBnZW5lcmF0ZU5hbWUoKVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMgPSBbXTtcblxuXHRcdFx0aWYgKGl0ZXJhYmxlKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpdGVtID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5OiBhbnkpOiBudW1iZXIge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mcm96ZW5FbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xuXHRcdFx0XHRlbnRyeS52YWx1ZSA9IERFTEVURUQ7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRnZXQoa2V5OiBhbnkpOiBWIHwgdW5kZWZpbmVkIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG5cdFx0XHRcdHJldHVybiBlbnRyeS52YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnJvemVuRW50cmllc1tmcm96ZW5JbmRleF0udmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFzKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKEJvb2xlYW4oZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogYW55LCB2YWx1ZT86IGFueSk6IHRoaXMge1xuXHRcdFx0aWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcblx0XHRcdH1cblx0XHRcdGxldCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XG5cdFx0XHRcdGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG5cdFx0XHRcdFx0a2V5OiB7IHZhbHVlOiBrZXkgfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcblx0XHRcdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiBlbnRyeVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbnRyeS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdXZWFrTWFwJyA9ICdXZWFrTWFwJztcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2Vha01hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBXZWFrTWFwLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSwgaXNJdGVyYWJsZSwgSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCB7IE1BWF9TQUZFX0lOVEVHRVIgfSBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXBDYWxsYmFjazxULCBVPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gbWFwcGluZ1xuXHQgKlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBtYXBwZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50XG5cdCAqL1xuXHQoZWxlbWVudDogVCwgaW5kZXg6IG51bWJlcik6IFU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZENhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB1c2luZyBmaW5kXG5cdCAqXG5cdCAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgaXMgY3VycmVudHkgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGFycmF5IFRoZSBzb3VyY2UgYXJyYXlcblx0ICovXG5cdChlbGVtZW50OiBULCBpbmRleDogbnVtYmVyLCBhcnJheTogQXJyYXlMaWtlPFQ+KTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFdyaXRhYmxlQXJyYXlMaWtlPFQ+IHtcblx0cmVhZG9ubHkgbGVuZ3RoOiBudW1iZXI7XG5cdFtuOiBudW1iZXJdOiBUO1xufVxuXG4vKiBFUzYgQXJyYXkgc3RhdGljIG1ldGhvZHMgKi9cblxuZXhwb3J0IGludGVyZmFjZSBGcm9tIHtcblx0LyoqXG5cdCAqIFRoZSBBcnJheS5mcm9tKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgQXJyYXkgaW5zdGFuY2UgZnJvbSBhbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZSBBbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdCAqIEBwYXJhbSBtYXBGdW5jdGlvbiBBIG1hcCBmdW5jdGlvbiB0byBjYWxsIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXlcblx0ICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgbWFwIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm4gVGhlIG5ldyBBcnJheVxuXHQgKi9cblx0PFQsIFU+KHNvdXJjZTogQXJyYXlMaWtlPFQ+IHwgSXRlcmFibGU8VD4sIG1hcEZ1bmN0aW9uOiBNYXBDYWxsYmFjazxULCBVPiwgdGhpc0FyZz86IGFueSk6IEFycmF5PFU+O1xuXG5cdC8qKlxuXHQgKiBUaGUgQXJyYXkuZnJvbSgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IEFycmF5IGluc3RhbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgQW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheVxuXHQgKiBAcmV0dXJuIFRoZSBuZXcgQXJyYXlcblx0ICovXG5cdDxUPihzb3VyY2U6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KTogQXJyYXk8VD47XG59XG5cbmV4cG9ydCBsZXQgZnJvbTogRnJvbTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGFycmF5IGZyb20gdGhlIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIGFyZ3VtZW50cyBBbnkgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgdGhlIGFycmF5XG4gKiBAcmV0dXJuIEFuIGFycmF5IGZyb20gdGhlIGdpdmVuIGFyZ3VtZW50c1xuICovXG5leHBvcnQgbGV0IG9mOiA8VD4oLi4uaXRlbXM6IFRbXSkgPT4gQXJyYXk8VD47XG5cbi8qIEVTNiBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogQ29waWVzIGRhdGEgaW50ZXJuYWxseSB3aXRoaW4gYW4gYXJyYXkgb3IgYXJyYXktbGlrZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gb2Zmc2V0IFRoZSBpbmRleCB0byBzdGFydCBjb3B5aW5nIHZhbHVlcyB0bzsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgKGluY2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBlbmQgVGhlIGxhc3QgKGV4Y2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEByZXR1cm4gVGhlIHRhcmdldFxuICovXG5leHBvcnQgbGV0IGNvcHlXaXRoaW46IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgb2Zmc2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbGxzIGVsZW1lbnRzIG9mIGFuIGFycmF5LWxpa2Ugb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gZmlsbFxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBmaWxsIGVhY2ggZWxlbWVudCBvZiB0aGUgdGFyZ2V0IHdpdGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgaW5kZXggdG8gZmlsbFxuICogQHBhcmFtIGVuZCBUaGUgKGV4Y2x1c2l2ZSkgaW5kZXggYXQgd2hpY2ggdG8gc3RvcCBmaWxsaW5nXG4gKiBAcmV0dXJuIFRoZSBmaWxsZWQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBsZXQgZmlsbDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbmRzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbnN0YW5jZSBtYXRjaGluZyB0aGUgY2FsbGJhY2sgb3IgdW5kZWZpbmVkIGlmIG9uZSBpcyBub3QgZm91bmQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGlmIHRoZSBjdXJyZW50IHZhbHVlIG1hdGNoZXMgYSBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyB0aGUgY2FsbGJhY2ssIG9yIHVuZGVmaW5lZCBpZiBvbmUgZG9lcyBub3QgZXhpc3RcbiAqL1xuZXhwb3J0IGxldCBmaW5kOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gVCB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBzZWFyY2ggYW5kIHJldHVybnMgdGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLFxuICogb3IgLTEgaWYgbm8gdmFsdWVzIHNhdGlzZnkgaXQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRydWUgaWYgdGhlIGN1cnJlbnQgdmFsdWUgc2F0aXNmaWVzIGl0cyBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0XG4gKi9cbmV4cG9ydCBsZXQgZmluZEluZGV4OiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gbnVtYmVyO1xuXG4vKiBFUzcgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBhcnJheSBpbmNsdWRlcyBhIGdpdmVuIHZhbHVlXG4gKlxuICogQHBhcmFtIHRhcmdldCB0aGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gc2VhcmNoRWxlbWVudCB0aGUgaXRlbSB0byBzZWFyY2ggZm9yXG4gKiBAcGFyYW0gZnJvbUluZGV4IHRoZSBzdGFydGluZyBpbmRleCB0byBzZWFyY2ggZnJvbVxuICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGFycmF5IGluY2x1ZGVzIHRoZSBlbGVtZW50LCBvdGhlcndpc2UgYGZhbHNlYFxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHNlYXJjaEVsZW1lbnQ6IFQsIGZyb21JbmRleD86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuaWYgKGhhcygnZXM2LWFycmF5JykgJiYgaGFzKCdlczYtYXJyYXktZmlsbCcpKSB7XG5cdGZyb20gPSBnbG9iYWwuQXJyYXkuZnJvbTtcblx0b2YgPSBnbG9iYWwuQXJyYXkub2Y7XG5cdGNvcHlXaXRoaW4gPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuY29weVdpdGhpbik7XG5cdGZpbGwgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XG5cdGZpbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZCk7XG5cdGZpbmRJbmRleCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpO1xufSBlbHNlIHtcblx0Ly8gSXQgaXMgb25seSBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkvaU9TIHRoYXQgaGF2ZSBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uIGFuZCBzbyBhcmVuJ3QgaW4gdGhlIHdpbGRcblx0Ly8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxuXG5cdC8qKlxuXHQgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cblx0ICpcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG5cdCAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXG5cdCAqL1xuXHRjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAoaXNOYU4obGVuZ3RoKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0bGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcblx0ICogQHJldHVybiBBbiBpbnRlZ2VyXG5cdCAqL1xuXHRjb25zdCB0b0ludGVnZXIgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWU6IGFueSk6IG51bWJlciB7XG5cdFx0dmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXHRcdGlmIChpc05hTih2YWx1ZSkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcblx0fTtcblxuXHQvKipcblx0ICogTm9ybWFsaXplcyBhbiBvZmZzZXQgYWdhaW5zdCBhIGdpdmVuIGxlbmd0aCwgd3JhcHBpbmcgaXQgaWYgbmVnYXRpdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIHRvdGFsIGxlbmd0aCB0byBub3JtYWxpemUgYWdhaW5zdFxuXHQgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxuXHQgKi9cblx0Y29uc3Qgbm9ybWFsaXplT2Zmc2V0ID0gZnVuY3Rpb24gbm9ybWFsaXplT2Zmc2V0KHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5tYXgobGVuZ3RoICsgdmFsdWUsIDApIDogTWF0aC5taW4odmFsdWUsIGxlbmd0aCk7XG5cdH07XG5cblx0ZnJvbSA9IGZ1bmN0aW9uIGZyb20oXG5cdFx0dGhpczogQXJyYXlDb25zdHJ1Y3Rvcixcblx0XHRhcnJheUxpa2U6IEl0ZXJhYmxlPGFueT4gfCBBcnJheUxpa2U8YW55Pixcblx0XHRtYXBGdW5jdGlvbj86IE1hcENhbGxiYWNrPGFueSwgYW55Pixcblx0XHR0aGlzQXJnPzogYW55XG5cdCk6IEFycmF5PGFueT4ge1xuXHRcdGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRpZiAobWFwRnVuY3Rpb24gJiYgdGhpc0FyZykge1xuXHRcdFx0bWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xuXHRcdH1cblxuXHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0Y29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXHRcdGNvbnN0IGxlbmd0aDogbnVtYmVyID0gdG9MZW5ndGgoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGgpO1xuXG5cdFx0Ly8gU3VwcG9ydCBleHRlbnNpb25cblx0XHRjb25zdCBhcnJheTogYW55W10gPVxuXHRcdFx0dHlwZW9mIENvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gPGFueVtdPk9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcblxuXHRcdGlmICghaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxuXHRcdC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cblx0XHRpZiAoaXNBcnJheUxpa2UoYXJyYXlMaWtlKSkge1xuXHRcdFx0aWYgKGxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbihhcnJheUxpa2VbaV0sIGkpIDogYXJyYXlMaWtlW2ldO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGFycmF5TGlrZSkge1xuXHRcdFx0XHRhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnJheTtcblx0fTtcblxuXHRvZiA9IGZ1bmN0aW9uIG9mPFQ+KC4uLml0ZW1zOiBUW10pOiBBcnJheTxUPiB7XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcblx0fTtcblxuXHRjb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbjxUPihcblx0XHR0YXJnZXQ6IEFycmF5TGlrZTxUPixcblx0XHRvZmZzZXQ6IG51bWJlcixcblx0XHRzdGFydDogbnVtYmVyLFxuXHRcdGVuZD86IG51bWJlclxuXHQpOiBBcnJheUxpa2U8VD4ge1xuXHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignY29weVdpdGhpbjogdGFyZ2V0IG11c3QgYmUgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRvZmZzZXQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKG9mZnNldCksIGxlbmd0aCk7XG5cdFx0c3RhcnQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcblx0XHRlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcblx0XHRsZXQgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcblxuXHRcdGxldCBkaXJlY3Rpb24gPSAxO1xuXHRcdGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XG5cdFx0XHRkaXJlY3Rpb24gPSAtMTtcblx0XHRcdHN0YXJ0ICs9IGNvdW50IC0gMTtcblx0XHRcdG9mZnNldCArPSBjb3VudCAtIDE7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKGNvdW50ID4gMCkge1xuXHRcdFx0aWYgKHN0YXJ0IGluIHRhcmdldCkge1xuXHRcdFx0XHQodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSAodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdO1xuXHRcdFx0fVxuXG5cdFx0XHRvZmZzZXQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0c3RhcnQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0Y291bnQtLTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbGwgPSBmdW5jdGlvbiBmaWxsPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogYW55LCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKTogQXJyYXlMaWtlPFQ+IHtcblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRsZXQgaSA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xuXHRcdGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xuXG5cdFx0d2hpbGUgKGkgPCBlbmQpIHtcblx0XHRcdCh0YXJnZXQgYXMgV3JpdGFibGVBcnJheUxpa2U8VD4pW2krK10gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbmQgPSBmdW5jdGlvbiBmaW5kPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pOiBUIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBpbmRleCA9IGZpbmRJbmRleDxUPih0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0XHRyZXR1cm4gaW5kZXggIT09IC0xID8gdGFyZ2V0W2luZGV4XSA6IHVuZGVmaW5lZDtcblx0fTtcblxuXHRmaW5kSW5kZXggPSBmdW5jdGlvbiBmaW5kSW5kZXg8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSk6IG51bWJlciB7XG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cblx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNBcmcpIHtcblx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fTtcbn1cblxuaWYgKGhhcygnZXM3LWFycmF5JykpIHtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcblx0ICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcblx0ICovXG5cdGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuXHRcdGlmIChpc05hTihsZW5ndGgpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0aW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlczxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgc2VhcmNoRWxlbWVudDogVCwgZnJvbUluZGV4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0bGV0IGxlbiA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IGZyb21JbmRleDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcblx0XHRcdGlmIChcblx0XHRcdFx0c2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcblx0XHRcdFx0KHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcnJheS50cyIsImNvbnN0IGdsb2JhbE9iamVjdDogYW55ID0gKGZ1bmN0aW9uKCk6IGFueSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG5cdFx0Ly8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xuXHRcdHJldHVybiBnbG9iYWw7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyB3aW5kb3cgaXMgZGVmaW5lZCBpbiBicm93c2Vyc1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gc2VsZiBpcyBkZWZpbmVkIGluIFdlYldvcmtlcnNcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2xvYmFsT2JqZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGdsb2JhbC50cyIsImltcG9ydCAnLi9TeW1ib2wnO1xuaW1wb3J0IHsgSElHSF9TVVJST0dBVEVfTUFYLCBISUdIX1NVUlJPR0FURV9NSU4gfSBmcm9tICcuL3N0cmluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3JSZXN1bHQ8VD4ge1xuXHRyZWFkb25seSBkb25lOiBib29sZWFuO1xuXHRyZWFkb25seSB2YWx1ZTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYXRvcjxUPiB7XG5cdG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcblxuXHRyZXR1cm4/KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cblx0dGhyb3c/KGU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZTxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlSXRlcmF0b3I8VD4gZXh0ZW5kcyBJdGVyYXRvcjxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VD47XG59XG5cbmNvbnN0IHN0YXRpY0RvbmU6IEl0ZXJhdG9yUmVzdWx0PGFueT4gPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcblxuLyoqXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgU2hpbUl0ZXJhdG9yPFQ+IHtcblx0cHJpdmF0ZSBfbGlzdDogQXJyYXlMaWtlPFQ+O1xuXHRwcml2YXRlIF9uZXh0SW5kZXggPSAtMTtcblx0cHJpdmF0ZSBfbmF0aXZlSXRlcmF0b3I6IEl0ZXJhdG9yPFQ+O1xuXG5cdGNvbnN0cnVjdG9yKGxpc3Q6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KSB7XG5cdFx0aWYgKGlzSXRlcmFibGUobGlzdCkpIHtcblx0XHRcdHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2xpc3QgPSBsaXN0O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXG5cdCAqL1xuXHRuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0XHRpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5fbGlzdCkge1xuXHRcdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdFx0fVxuXHRcdGlmICgrK3RoaXMuX25leHRJbmRleCA8IHRoaXMuX2xpc3QubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkb25lOiBmYWxzZSxcblx0XHRcdFx0dmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgSXRlcmFibGU8YW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWU6IGFueSk6IHZhbHVlIGlzIEFycmF5TGlrZTxhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0PFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPik6IEl0ZXJhdG9yPFQ+IHwgdW5kZWZpbmVkIHtcblx0aWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XG5cdFx0cmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcblx0fSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb3JPZkNhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGEgZm9yT2YoKSBpdGVyYXRpb25cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBjdXJyZW50IHZhbHVlXG5cdCAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyXG5cdCAqIEBwYXJhbSBkb0JyZWFrIEEgZnVuY3Rpb24sIGlmIGNhbGxlZCwgd2lsbCBzdG9wIHRoZSBpdGVyYXRpb25cblx0ICovXG5cdCh2YWx1ZTogVCwgb2JqZWN0OiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZywgZG9CcmVhazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKlxuICogU2hpbXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYGZvciAuLi4gb2ZgIGJsb2Nrc1xuICpcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgb2JqZWN0IHRoZSBwcm92aWRlcyBhbiBpbnRlcmF0b3IgaW50ZXJmYWNlXG4gKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gb2YgdGhlIGl0ZXJhYmxlXG4gKiBAcGFyYW0gdGhpc0FyZyBPcHRpb25hbCBzY29wZSB0byBwYXNzIHRoZSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yT2Y8VD4oXG5cdGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZyxcblx0Y2FsbGJhY2s6IEZvck9mQ2FsbGJhY2s8VD4sXG5cdHRoaXNBcmc/OiBhbnlcbik6IHZvaWQge1xuXHRsZXQgYnJva2VuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gZG9CcmVhaygpIHtcblx0XHRicm9rZW4gPSB0cnVlO1xuXHR9XG5cblx0LyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cblx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0Y29uc3QgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7ICsraSkge1xuXHRcdFx0bGV0IGNoYXIgPSBpdGVyYWJsZVtpXTtcblx0XHRcdGlmIChpICsgMSA8IGwpIHtcblx0XHRcdFx0Y29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcblx0XHRcdFx0aWYgKGNvZGUgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGNvZGUgPD0gSElHSF9TVVJST0dBVEVfTUFYKSB7XG5cdFx0XHRcdFx0Y2hhciArPSBpdGVyYWJsZVsrK2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNoYXIsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcblx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdCBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XG5cdFx0aWYgKGl0ZXJhdG9yKSB7XG5cdFx0XHRsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG5cdFx0XHR3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGl0ZXJhdG9yLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKlxuICogVGhlIHNtYWxsZXN0IGludGVydmFsIGJldHdlZW4gdHdvIHJlcHJlc2VudGFibGUgbnVtYmVycy5cbiAqL1xuZXhwb3J0IGNvbnN0IEVQU0lMT04gPSAxO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUlOX1NBRkVfSU5URUdFUiA9IC1NQVhfU0FGRV9JTlRFR0VSO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIE5hTiB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBOYU4sIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYU4odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNOYU4odmFsdWUpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc0Zpbml0ZSh2YWx1ZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIgdGhhdCBpcyAnc2FmZSwnIG1lYW5pbmc6XG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXG4gKiAgICAgIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uIGNhbm5vdCBiZSB0aGUgcmVzdWx0IG9mIHJvdW5kaW5nIGFueSBvdGhlclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiBNYXRoLmFicyh2YWx1ZSkgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBudW1iZXIudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgeyBpc1N5bWJvbCB9IGZyb20gJy4vU3ltYm9sJztcblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RBc3NpZ24ge1xuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFU+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVLCBWPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICogQHBhcmFtIHNvdXJjZTMgVGhlIHRoaXJkIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVSwgViwgVz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcblxuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlcyBPbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllc1xuXHQgKi9cblx0KHRhcmdldDogb2JqZWN0LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RFbnRlcmllcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleS92YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQ8VCBleHRlbmRzIHsgW2tleTogc3RyaW5nXTogYW55IH0sIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBUKTogW2tleW9mIFQsIFRbS11dW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5L3ZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdChvOiBvYmplY3QpOiBbc3RyaW5nLCBhbnldW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB7XG5cdDxUPihvOiBUKTogeyBbSyBpbiBrZXlvZiBUXTogUHJvcGVydHlEZXNjcmlwdG9yIH07XG5cdChvOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdFZhbHVlcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdDxUPihvOiB7IFtzOiBzdHJpbmddOiBUIH0pOiBUW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0KG86IG9iamVjdCk6IGFueVtdO1xufVxuXG5leHBvcnQgbGV0IGFzc2lnbjogT2JqZWN0QXNzaWduO1xuXG4vKipcbiAqIEdldHMgdGhlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICogQW4gb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb25lIHRoYXQgaXMgZGVmaW5lZCBkaXJlY3RseSBvbiB0aGUgb2JqZWN0IGFuZCBpcyBub3RcbiAqIGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gcCBOYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IDxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcHJvcGVydHlLZXk6IEspID0+IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LiBUaGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFyZSB0aG9zZSB0aGF0IGFyZSBkZWZpbmVkIGRpcmVjdGx5XG4gKiBvbiB0aGF0IG9iamVjdCwgYW5kIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS4gVGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGluY2x1ZGUgYm90aCBmaWVsZHMgKG9iamVjdHMpIGFuZCBmdW5jdGlvbnMuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgb3duIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlOYW1lczogKG86IGFueSkgPT4gc3RyaW5nW107XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3ltYm9sIHByb3BlcnRpZXMgZm91bmQgZGlyZWN0bHkgb24gb2JqZWN0IG8uXG4gKiBAcGFyYW0gbyBPYmplY3QgdG8gcmV0cmlldmUgdGhlIHN5bWJvbHMgZnJvbS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IChvOiBhbnkpID0+IHN5bWJvbFtdO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHBhcmFtIHZhbHVlMSBUaGUgZmlyc3QgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUyIFRoZSBzZWNvbmQgdmFsdWUuXG4gKi9cbmV4cG9ydCBsZXQgaXM6ICh2YWx1ZTE6IGFueSwgdmFsdWUyOiBhbnkpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvZiBhbiBvYmplY3QuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cbiAqL1xuZXhwb3J0IGxldCBrZXlzOiAobzogb2JqZWN0KSA9PiBzdHJpbmdbXTtcblxuLyogRVM3IE9iamVjdCBzdGF0aWMgbWV0aG9kcyAqL1xuXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cbmV4cG9ydCBsZXQgZW50cmllczogT2JqZWN0RW50ZXJpZXM7XG5cbmV4cG9ydCBsZXQgdmFsdWVzOiBPYmplY3RWYWx1ZXM7XG5cbmlmIChoYXMoJ2VzNi1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRhc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG5cdGdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cdGlzID0gZ2xvYmFsT2JqZWN0LmlzO1xuXHRrZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XG59IGVsc2Uge1xuXHRrZXlzID0gZnVuY3Rpb24gc3ltYm9sQXdhcmVLZXlzKG86IG9iamVjdCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xuXHR9O1xuXG5cdGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pIHtcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcblx0XHRzb3VyY2VzLmZvckVhY2goKG5leHRTb3VyY2UpID0+IHtcblx0XHRcdGlmIChuZXh0U291cmNlKSB7XG5cdFx0XHRcdC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0XHRrZXlzKG5leHRTb3VyY2UpLmZvckVhY2goKG5leHRLZXkpID0+IHtcblx0XHRcdFx0XHR0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRvO1xuXHR9O1xuXG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihcblx0XHRvOiBhbnksXG5cdFx0cHJvcDogc3RyaW5nIHwgc3ltYm9sXG5cdCk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKGlzU3ltYm9sKHByb3ApKSB7XG5cdFx0XHRyZXR1cm4gKDxhbnk+T2JqZWN0KS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuXHRcdH1cblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvOiBhbnkpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobzogYW55KTogc3ltYm9sW10ge1xuXHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxuXHRcdFx0LmZpbHRlcigoa2V5KSA9PiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpXG5cdFx0XHQubWFwKChrZXkpID0+IFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSkpO1xuXHR9O1xuXG5cdGlzID0gZnVuY3Rpb24gaXModmFsdWUxOiBhbnksIHZhbHVlMjogYW55KTogYm9vbGVhbiB7XG5cdFx0aWYgKHZhbHVlMSA9PT0gdmFsdWUyKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUxICE9PSAwIHx8IDEgLyB2YWx1ZTEgPT09IDEgLyB2YWx1ZTI7IC8vIC0wXG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMSAmJiB2YWx1ZTIgIT09IHZhbHVlMjsgLy8gTmFOXG5cdH07XG59XG5cbmlmIChoYXMoJ2VzMjAxNy1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cdGVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcblx0dmFsdWVzID0gZ2xvYmFsT2JqZWN0LnZhbHVlcztcbn0gZWxzZSB7XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG86IGFueSkge1xuXHRcdHJldHVybiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLnJlZHVjZShcblx0XHRcdChwcmV2aW91cywga2V5KSA9PiB7XG5cdFx0XHRcdHByZXZpb3VzW2tleV0gPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KSE7XG5cdFx0XHRcdHJldHVybiBwcmV2aW91cztcblx0XHRcdH0sXG5cdFx0XHR7fSBhcyB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9XG5cdFx0KTtcblx0fTtcblxuXHRlbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvOiBhbnkpOiBbc3RyaW5nLCBhbnldW10ge1xuXHRcdHJldHVybiBrZXlzKG8pLm1hcCgoa2V5KSA9PiBba2V5LCBvW2tleV1dIGFzIFtzdHJpbmcsIGFueV0pO1xuXHR9O1xuXG5cdHZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyhvOiBhbnkpOiBhbnlbXSB7XG5cdFx0cmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IG9ba2V5XSk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gb2JqZWN0LnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdOb3JtYWxpemUge1xuXHQvKipcblx0ICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuXHQgKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG5cdCAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuXHQgKiBpcyBcIk5GQ1wiXG5cdCAqL1xuXHQodGFyZ2V0OiBzdHJpbmcsIGZvcm06ICdORkMnIHwgJ05GRCcgfCAnTkZLQycgfCAnTkZLRCcpOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cblx0ICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuXHQgKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcblx0ICogaXMgXCJORkNcIlxuXHQgKi9cblx0KHRhcmdldDogc3RyaW5nLCBmb3JtPzogc3RyaW5nKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUFYID0gMHhkYmZmO1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBMT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XG5cbi8qIEVTNiBzdGF0aWMgbWV0aG9kcyAqL1xuXG4vKipcbiAqIFJldHVybiB0aGUgU3RyaW5nIHZhbHVlIHdob3NlIGVsZW1lbnRzIGFyZSwgaW4gb3JkZXIsIHRoZSBlbGVtZW50cyBpbiB0aGUgTGlzdCBlbGVtZW50cy5cbiAqIElmIGxlbmd0aCBpcyAwLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICogQHBhcmFtIGNvZGVQb2ludHMgVGhlIGNvZGUgcG9pbnRzIHRvIGdlbmVyYXRlIHRoZSBzdHJpbmdcbiAqL1xuZXhwb3J0IGxldCBmcm9tQ29kZVBvaW50OiAoLi4uY29kZVBvaW50czogbnVtYmVyW10pID0+IHN0cmluZztcblxuLyoqXG4gKiBgcmF3YCBpcyBpbnRlbmRlZCBmb3IgdXNlIGFzIGEgdGFnIGZ1bmN0aW9uIG9mIGEgVGFnZ2VkIFRlbXBsYXRlIFN0cmluZy4gV2hlbiBjYWxsZWRcbiAqIGFzIHN1Y2ggdGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgYmUgYSB3ZWxsIGZvcm1lZCB0ZW1wbGF0ZSBjYWxsIHNpdGUgb2JqZWN0IGFuZCB0aGUgcmVzdFxuICogcGFyYW1ldGVyIHdpbGwgY29udGFpbiB0aGUgc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAqIEBwYXJhbSB0ZW1wbGF0ZSBBIHdlbGwtZm9ybWVkIHRlbXBsYXRlIHN0cmluZyBjYWxsIHNpdGUgcmVwcmVzZW50YXRpb24uXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBBIHNldCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICovXG5leHBvcnQgbGV0IHJhdzogKHRlbXBsYXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pID0+IHN0cmluZztcblxuLyogRVM2IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgbm9ubmVnYXRpdmUgaW50ZWdlciBOdW1iZXIgbGVzcyB0aGFuIDExMTQxMTIgKDB4MTEwMDAwKSB0aGF0IGlzIHRoZSBjb2RlIHBvaW50XG4gKiB2YWx1ZSBvZiB0aGUgVVRGLTE2IGVuY29kZWQgY29kZSBwb2ludCBzdGFydGluZyBhdCB0aGUgc3RyaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gcG9zIGluXG4gKiB0aGUgU3RyaW5nIHJlc3VsdGluZyBmcm9tIGNvbnZlcnRpbmcgdGhpcyBvYmplY3QgdG8gYSBTdHJpbmcuXG4gKiBJZiB0aGVyZSBpcyBubyBlbGVtZW50IGF0IHRoYXQgcG9zaXRpb24sIHRoZSByZXN1bHQgaXMgdW5kZWZpbmVkLlxuICogSWYgYSB2YWxpZCBVVEYtMTYgc3Vycm9nYXRlIHBhaXIgZG9lcyBub3QgYmVnaW4gYXQgcG9zLCB0aGUgcmVzdWx0IGlzIHRoZSBjb2RlIHVuaXQgYXQgcG9zLlxuICovXG5leHBvcnQgbGV0IGNvZGVQb2ludEF0OiAodGFyZ2V0OiBzdHJpbmcsIHBvcz86IG51bWJlcikgPT4gbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIGVuZFBvc2l0aW9uIOKAkyBsZW5ndGgodGhpcykuIE90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICovXG5leHBvcnQgbGV0IGVuZHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgc2VhcmNoU3RyaW5nIGFwcGVhcnMgYXMgYSBzdWJzdHJpbmcgb2YgdGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIHRoaXNcbiAqIG9iamVjdCB0byBhIFN0cmluZywgYXQgb25lIG9yIG1vcmUgcG9zaXRpb25zIHRoYXQgYXJlXG4gKiBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gcG9zaXRpb247IG90aGVyd2lzZSwgcmV0dXJucyBmYWxzZS5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBzZWFyY2hTdHJpbmcgc2VhcmNoIHN0cmluZ1xuICogQHBhcmFtIHBvc2l0aW9uIElmIHBvc2l0aW9uIGlzIHVuZGVmaW5lZCwgMCBpcyBhc3N1bWVkLCBzbyBhcyB0byBzZWFyY2ggYWxsIG9mIHRoZSBTdHJpbmcuXG4gKi9cbmV4cG9ydCBsZXQgaW5jbHVkZXM6ICh0YXJnZXQ6IHN0cmluZywgc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cbiAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcbiAqIGlzIFwiTkZDXCJcbiAqL1xuZXhwb3J0IGxldCBub3JtYWxpemU6IFN0cmluZ05vcm1hbGl6ZTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbWFkZSBmcm9tIGNvdW50IGNvcGllcyBhcHBlbmRlZCB0b2dldGhlci4gSWYgY291bnQgaXMgMCxcbiAqIFQgaXMgdGhlIGVtcHR5IFN0cmluZyBpcyByZXR1cm5lZC5cbiAqIEBwYXJhbSBjb3VudCBudW1iZXIgb2YgY29waWVzIHRvIGFwcGVuZFxuICovXG5leHBvcnQgbGV0IHJlcGVhdDogKHRhcmdldDogc3RyaW5nLCBjb3VudD86IG51bWJlcikgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIHBvc2l0aW9uLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBzdGFydHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyogRVM3IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxuICogVGhlIHBhZGRpbmcgaXMgYXBwbGllZCBmcm9tIHRoZSBlbmQgKHJpZ2h0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZEVuZDogKHRhcmdldDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIHN0YXJ0IChsZWZ0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZFN0YXJ0OiAodGFyZ2V0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbmlmIChoYXMoJ2VzNi1zdHJpbmcnKSAmJiBoYXMoJ2VzNi1zdHJpbmctcmF3JykpIHtcblx0ZnJvbUNvZGVQb2ludCA9IGdsb2JhbC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcblx0cmF3ID0gZ2xvYmFsLlN0cmluZy5yYXc7XG5cblx0Y29kZVBvaW50QXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcblx0ZW5kc1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKTtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcblx0bm9ybWFsaXplID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xuXHRyZXBlYXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnJlcGVhdCk7XG5cdHN0YXJ0c1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxuXHQgKiBVc2VkIGJ5IHN0YXJ0c1dpdGgsIGluY2x1ZGVzLCBhbmQgZW5kc1dpdGguXG5cdCAqXG5cdCAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cblx0ICovXG5cdGNvbnN0IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MgPSBmdW5jdGlvbihcblx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0dGV4dDogc3RyaW5nLFxuXHRcdHNlYXJjaDogc3RyaW5nLFxuXHRcdHBvc2l0aW9uOiBudW1iZXIsXG5cdFx0aXNFbmQ6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBbc3RyaW5nLCBzdHJpbmcsIG51bWJlcl0ge1xuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy4nICsgbmFtZSArICcgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcgdG8gc2VhcmNoIGFnYWluc3QuJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xuXHRcdHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XG5cdH07XG5cblx0ZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50czogbnVtYmVyW10pOiBzdHJpbmcge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcuZnJvbUNvZGVQb2ludFxuXHRcdGNvbnN0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0aWYgKCFsZW5ndGgpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRjb25zdCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXHRcdGNvbnN0IE1BWF9TSVpFID0gMHg0MDAwO1xuXHRcdGxldCBjb2RlVW5pdHM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IGluZGV4ID0gLTE7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXG5cdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdGxldCBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG5cblx0XHRcdC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2Vcblx0XHRcdGxldCBpc1ZhbGlkID1cblx0XHRcdFx0aXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XG5cdFx0XHRpZiAoIWlzVmFsaWQpIHtcblx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcblx0XHRcdFx0Ly8gQk1QIGNvZGUgcG9pbnRcblx0XHRcdFx0Y29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0bGV0IGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIEhJR0hfU1VSUk9HQVRFX01JTjtcblx0XHRcdFx0bGV0IGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgTE9XX1NVUlJPR0FURV9NSU47XG5cdFx0XHRcdGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcblx0XHRcdFx0cmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuXHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRyYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSk6IHN0cmluZyB7XG5cdFx0bGV0IHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGxldCBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XG5cblx0XHRpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGggLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dDogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuY29kZVBvaW50QXQgcmVxdXJpZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xuXHRcdFx0cG9zaXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxuXHRcdGNvbnN0IGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcblx0XHRpZiAoZmlyc3QgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IEhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcblx0XHRcdC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcblx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0Y29uc3Qgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG5cdFx0XHRpZiAoc2Vjb25kID49IExPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBMT1dfU1VSUk9HQVRFX01BWCkge1xuXHRcdFx0XHRyZXR1cm4gKGZpcnN0IC0gSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gTE9XX1NVUlJPR0FURV9NSU4gKyAweDEwMDAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlyc3Q7XG5cdH07XG5cblx0ZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcik6IGJvb2xlYW4ge1xuXHRcdGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xuXHRcdH1cblxuXHRcdFt0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSk7XG5cblx0XHRjb25zdCBzdGFydCA9IGVuZFBvc2l0aW9uIC0gc2VhcmNoLmxlbmd0aDtcblx0XHRpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xuXHR9O1xuXG5cdGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuXHRcdHJldHVybiB0ZXh0LmluZGV4T2Yoc2VhcmNoLCBwb3NpdGlvbikgIT09IC0xO1xuXHR9O1xuXG5cdHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0OiBzdHJpbmcsIGNvdW50OiBudW1iZXIgPSAwKTogc3RyaW5nIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5yZXBlYXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblx0XHRpZiAoY291bnQgIT09IGNvdW50KSB7XG5cdFx0XHRjb3VudCA9IDA7XG5cdFx0fVxuXHRcdGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdHdoaWxlIChjb3VudCkge1xuXHRcdFx0aWYgKGNvdW50ICUgMikge1xuXHRcdFx0XHRyZXN1bHQgKz0gdGV4dDtcblx0XHRcdH1cblx0XHRcdGlmIChjb3VudCA+IDEpIHtcblx0XHRcdFx0dGV4dCArPSB0ZXh0O1xuXHRcdFx0fVxuXHRcdFx0Y291bnQgPj49IDE7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0c3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRzZWFyY2ggPSBTdHJpbmcoc2VhcmNoKTtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XG5cblx0XHRjb25zdCBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XG5cdFx0aWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcblx0fTtcbn1cblxuaWYgKGhhcygnZXMyMDE3LXN0cmluZycpKSB7XG5cdHBhZEVuZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcblx0cGFkU3RhcnQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZFN0YXJ0KTtcbn0gZWxzZSB7XG5cdHBhZEVuZCA9IGZ1bmN0aW9uIHBhZEVuZCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRFbmQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuXHRcdFx0bWF4TGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcblx0XHRjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocGFkZGluZyA+IDApIHtcblx0XHRcdHN0clRleHQgKz1cblx0XHRcdFx0cmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xuXHRcdFx0XHRmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0clRleHQ7XG5cdH07XG5cblx0cGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XG5cdFx0XHRtYXhMZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGxldCBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xuXHRcdGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwYWRkaW5nID4gMCkge1xuXHRcdFx0c3RyVGV4dCA9XG5cdFx0XHRcdHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcblx0XHRcdFx0ZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcblx0XHRcdFx0c3RyVGV4dDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyVGV4dDtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzdHJpbmcudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcbmltcG9ydCB7IEhhbmRsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5mdW5jdGlvbiBleGVjdXRlVGFzayhpdGVtOiBRdWV1ZUl0ZW0gfCB1bmRlZmluZWQpOiB2b2lkIHtcblx0aWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XG5cdFx0aXRlbS5jYWxsYmFjaygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW06IFF1ZXVlSXRlbSwgZGVzdHJ1Y3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95OiBmdW5jdGlvbih0aGlzOiBIYW5kbGUpIHtcblx0XHRcdHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge307XG5cdFx0XHRpdGVtLmlzQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRpdGVtLmNhbGxiYWNrID0gbnVsbDtcblxuXHRcdFx0aWYgKGRlc3RydWN0b3IpIHtcblx0XHRcdFx0ZGVzdHJ1Y3RvcigpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuaW50ZXJmYWNlIFBvc3RNZXNzYWdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHNvdXJjZTogYW55O1xuXHRkYXRhOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJdGVtIHtcblx0aXNBY3RpdmU6IGJvb2xlYW47XG5cdGNhbGxiYWNrOiBudWxsIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbn1cblxubGV0IGNoZWNrTWljcm9UYXNrUXVldWU6ICgpID0+IHZvaWQ7XG5sZXQgbWljcm9UYXNrczogUXVldWVJdGVtW107XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVUYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRsZXQgZGVzdHJ1Y3RvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdC8vIFNpbmNlIHRoZSBJRSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0SW1tZWRpYXRlYCBpcyBub3QgZmxhd2xlc3MsIHdlIHdpbGwgdGVzdCBmb3IgYHBvc3RNZXNzYWdlYCBmaXJzdC5cblx0aWYgKGhhcygncG9zdG1lc3NhZ2UnKSkge1xuXHRcdGNvbnN0IHF1ZXVlOiBRdWV1ZUl0ZW1bXSA9IFtdO1xuXG5cdFx0Z2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudDogUG9zdE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuXHRcdFx0Ly8gQ29uZmlybSB0aGF0IHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgYnkgdGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uLlxuXHRcdFx0aWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09ICdkb2pvLXF1ZXVlLW1lc3NhZ2UnKSB7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdGlmIChxdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRleGVjdXRlVGFzayhxdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdGdsb2JhbC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnc2V0aW1tZWRpYXRlJykpIHtcblx0XHRkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJUaW1lb3V0O1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSwgMCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCBpZDogYW55ID0gZW5xdWV1ZShpdGVtKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShcblx0XHRcdGl0ZW0sXG5cdFx0XHRkZXN0cnVjdG9yICYmXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRlc3RydWN0b3IoaWQpO1xuXHRcdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuXHRyZXR1cm4gaGFzKCdtaWNyb3Rhc2tzJylcblx0XHQ/IHF1ZXVlVGFza1xuXHRcdDogZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gcXVldWVUYXNrKGNhbGxiYWNrKTtcblx0XHRcdH07XG59KSgpO1xuXG4vLyBXaGVuIG5vIG1lY2hhbmlzbSBmb3IgcmVnaXN0ZXJpbmcgbWljcm90YXNrcyBpcyBleHBvc2VkIGJ5IHRoZSBlbnZpcm9ubWVudCwgbWljcm90YXNrcyB3aWxsXG4vLyBiZSBxdWV1ZWQgYW5kIHRoZW4gZXhlY3V0ZWQgaW4gYSBzaW5nbGUgbWFjcm90YXNrIGJlZm9yZSB0aGUgb3RoZXIgbWFjcm90YXNrcyBhcmUgZXhlY3V0ZWQuXG5pZiAoIWhhcygnbWljcm90YXNrcycpKSB7XG5cdGxldCBpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xuXG5cdG1pY3JvVGFza3MgPSBbXTtcblx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdGlmICghaXNNaWNyb1Rhc2tRdWV1ZWQpIHtcblx0XHRcdGlzTWljcm9UYXNrUXVldWVkID0gdHJ1ZTtcblx0XHRcdHF1ZXVlVGFzayhmdW5jdGlvbigpIHtcblx0XHRcdFx0aXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRsZXQgaXRlbTogUXVldWVJdGVtIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHdoaWxlICgoaXRlbSA9IG1pY3JvVGFza3Muc2hpZnQoKSkpIHtcblx0XHRcdFx0XHRcdGV4ZWN1dGVUYXNrKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyBhbiBhbmltYXRpb24gdGFzayB3aXRoIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBpdCBleGlzdHMsIG9yIHdpdGggYHF1ZXVlVGFza2Agb3RoZXJ3aXNlLlxuICpcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXG4gKiBIb3dldmVyLCBhdCB0aW1lcyBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIGRlbGVnYXRlIHRvIHJlcXVlc3RBbmltYXRpb25GcmFtZTsgaGVuY2UgdGhlIGZvbGxvd2luZyBtZXRob2QuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXVlQW5pbWF0aW9uVGFzayA9IChmdW5jdGlvbigpIHtcblx0aWYgKCFoYXMoJ3JhZicpKSB7XG5cdFx0cmV0dXJuIHF1ZXVlVGFzaztcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCByYWZJZDogbnVtYmVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG5cdHJldHVybiBoYXMoJ21pY3JvdGFza3MnKVxuXHRcdD8gcXVldWVBbmltYXRpb25UYXNrXG5cdFx0OiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRcdHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xuXHRcdFx0fTtcbn0pKCk7XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXG4gKiBtZWNoYW5pc20gZm9yIHNjaGVkdWxpbmcgbWFjcm90YXNrcyBpcyBleHBvc2VkLCB0aGVuIGFueSBjYWxsYmFja3Mgd2lsbCBiZSBmaXJlZCBiZWZvcmUgYW55IG1hY3JvdGFza1xuICogcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZVRhc2tgIG9yIGBxdWV1ZUFuaW1hdGlvblRhc2tgLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBsZXQgcXVldWVNaWNyb1Rhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdGlmIChoYXMoJ2hvc3Qtbm9kZScpKSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Z2xvYmFsLnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ2VzNi1wcm9taXNlJykpIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRnbG9iYWwuUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZXhlY3V0ZVRhc2spO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdkb20tbXV0YXRpb25vYnNlcnZlcicpKSB7XG5cdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXHRcdGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjb25zdCBxdWV1ZTogUXVldWVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcblx0XHRcdFx0XHRpdGVtLmNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRtaWNyb1Rhc2tzLnB1c2goaXRlbSk7XG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblxuXHRcdGVucXVldWUoaXRlbSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSk7XG5cdH07XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHF1ZXVlLnRzIiwiLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSB2YWx1ZSBwcm9wZXJ0eSBkZXNjcmlwdG9yXG4gKlxuICogQHBhcmFtIHZhbHVlICAgICAgICBUaGUgdmFsdWUgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIHNldCB0b1xuICogQHBhcmFtIGVudW1lcmFibGUgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGVudW1iZXJhYmxlLCBkZWZhdWx0cyB0byBmYWxzZVxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcGFyYW0gY29uZmlndXJhYmxlIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgY29uZmlndXJhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcmV0dXJuICAgICAgICAgICAgIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVEZXNjcmlwdG9yPFQ+KFxuXHR2YWx1ZTogVCxcblx0ZW51bWVyYWJsZTogYm9vbGVhbiA9IGZhbHNlLFxuXHR3cml0YWJsZTogYm9vbGVhbiA9IHRydWUsXG5cdGNvbmZpZ3VyYWJsZTogYm9vbGVhbiA9IHRydWVcbik6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPFQ+IHtcblx0cmV0dXJuIHtcblx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0ZW51bWVyYWJsZTogZW51bWVyYWJsZSxcblx0XHR3cml0YWJsZTogd3JpdGFibGUsXG5cdFx0Y29uZmlndXJhYmxlOiBjb25maWd1cmFibGVcblx0fTtcbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB3aGljaCB3cmFwcyBhIGZ1bmN0aW9uIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCBiZWNvbWVzIHRoZSBzY29wZVxuICogb2YgdGhlIGNhbGxcbiAqXG4gKiBAcGFyYW0gbmF0aXZlRnVuY3Rpb24gVGhlIHNvdXJjZSBmdW5jdGlvbiB0byBiZSB3cmFwcGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFI+KG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSkgPT4gUik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBSPihuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYpID0+IFIpOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFgsIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBYLCBZLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmUobmF0aXZlRnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXRpbC50cyIsImltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdG9yRXZlbnRNYXAge1xuXHRpbnZhbGlkYXRlOiBFdmVudE9iamVjdDwnaW52YWxpZGF0ZSc+O1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0b3I8VCA9IGFueT4gZXh0ZW5kcyBFdmVudGVkPEluamVjdG9yRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcGF5bG9hZDogVDtcblxuXHRjb25zdHJ1Y3RvcihwYXlsb2FkOiBUKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0fVxuXG5cdHB1YmxpYyBnZXQoKTogVCB7XG5cdFx0cmV0dXJuIHRoaXMuX3BheWxvYWQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0KHBheWxvYWQ6IFQpOiB2b2lkIHtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0b3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gSW5qZWN0b3IudHMiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgTm9kZUhhbmRsZXJJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXG4gKiBMaXN0ZW5pbmcgdG8gJ1Byb2plY3Rvcicgd2lsbCBub3RpZnkgd2hlbiBwcm9qZWN0b3IgaXMgY3JlYXRlZCBvciB1cGRhdGVkXG4gKiBMaXN0ZW5pbmcgdG8gJ1dpZGdldCcgd2lsbCBub3RpZnkgd2hlbiB3aWRnZXQgcm9vdCBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcbiAqL1xuZXhwb3J0IGVudW0gTm9kZUV2ZW50VHlwZSB7XG5cdFByb2plY3RvciA9ICdQcm9qZWN0b3InLFxuXHRXaWRnZXQgPSAnV2lkZ2V0J1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVIYW5kbGVyRXZlbnRNYXAge1xuXHRQcm9qZWN0b3I6IEV2ZW50T2JqZWN0PE5vZGVFdmVudFR5cGUuUHJvamVjdG9yPjtcblx0V2lkZ2V0OiBFdmVudE9iamVjdDxOb2RlRXZlbnRUeXBlLldpZGdldD47XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlSGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8Tm9kZUhhbmRsZXJFdmVudE1hcD4gaW1wbGVtZW50cyBOb2RlSGFuZGxlckludGVyZmFjZSB7XG5cdHByaXZhdGUgX25vZGVNYXAgPSBuZXcgTWFwPHN0cmluZywgRWxlbWVudD4oKTtcblxuXHRwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogRWxlbWVudCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkKGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5zZXQoa2V5LCBlbGVtZW50KTtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBrZXkgfSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkUm9vdCgpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRQcm9qZWN0b3IoKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XG5cdH1cblxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5jbGVhcigpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVIYW5kbGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIE5vZGVIYW5kbGVyLnRzIiwiaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBSZWdpc3RyeUxhYmVsLCBXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdpZGdldEJhc2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuL0luamVjdG9yJztcblxuZXhwb3J0IHR5cGUgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj47XG5cbmV4cG9ydCB0eXBlIEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPEVTTURlZmF1bHRXaWRnZXRCYXNlPFdpZGdldEJhc2VJbnRlcmZhY2U+PjtcblxuZXhwb3J0IHR5cGUgUmVnaXN0cnlJdGVtID1cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3Jcblx0fCBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj5cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvblxuXHR8IEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb247XG5cbi8qKlxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdJREdFVF9CQVNFX1RZUEUgPSBTeW1ib2woJ1dpZGdldCBCYXNlJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlFdmVudE9iamVjdCBleHRlbmRzIEV2ZW50T2JqZWN0PFJlZ2lzdHJ5TGFiZWw+IHtcblx0YWN0aW9uOiBzdHJpbmc7XG5cdGl0ZW06IFdpZGdldEJhc2VDb25zdHJ1Y3RvciB8IEluamVjdG9yO1xufVxuXG4vKipcbiAqIFdpZGdldCBSZWdpc3RyeSBJbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBEZWZpbmUgYSBXaWRnZXRSZWdpc3RyeUl0ZW0gYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHdpZGdldCB0byByZWdpc3RlclxuXHQgKiBAcGFyYW0gcmVnaXN0cnlJdGVtIFRoZSByZWdpc3RyeSBpdGVtIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCByZWdpc3RyeUl0ZW06IFJlZ2lzdHJ5SXRlbSk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCBvZiB0aGUgd2lkZ2V0IHRvIHJldHVyblxuXHQgKiBAcmV0dXJucyBUaGUgUmVnaXN0cnlJdGVtIGZvciB0aGUgd2lkZ2V0TGFiZWwsIGBudWxsYCBpZiBubyBlbnRyeSBleGlzdHNcblx0ICovXG5cdGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogQ29uc3RydWN0b3I8VD4gfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBlbnRyeSBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgd2lkZ2V0IHJlZ2lzdHJ5IGl0ZW0gZXhpc3RzXG5cdCAqL1xuXHRoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmUgYW4gSW5qZWN0b3IgYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIGluamVjdG9yIHRvIHJlZ2lzdGVyXG5cdCAqIEBwYXJhbSByZWdpc3RyeUl0ZW0gVGhlIGluamVjdG9yIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHJlZ2lzdHJ5SXRlbTogSW5qZWN0b3IpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYW4gSW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgaW5qZWN0b3IgdG8gcmV0dXJuXG5cdCAqIEByZXR1cm5zIFRoZSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSB3aWRnZXRMYWJlbCwgYG51bGxgIGlmIG5vIGVudHJ5IGV4aXN0c1xuXHQgKi9cblx0Z2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IFQgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBpbmplY3RvciBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgaW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBleGlzdHNcblx0ICovXG5cdGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXG4gKlxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2U+KGl0ZW06IGFueSk6IGl0ZW0gaXMgQ29uc3RydWN0b3I8VD4ge1xuXHRyZXR1cm4gQm9vbGVhbihpdGVtICYmIGl0ZW0uX3R5cGUgPT09IFdJREdFVF9CQVNFX1RZUEUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0ZGVmYXVsdDogQ29uc3RydWN0b3I8VD47XG5cdF9fZXNNb2R1bGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDxUPihpdGVtOiBhbnkpOiBpdGVtIGlzIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0cmV0dXJuIEJvb2xlYW4oXG5cdFx0aXRlbSAmJlxuXHRcdFx0aXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXG5cdFx0XHRpdGVtLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykgJiZcblx0XHRcdGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdClcblx0KTtcbn1cblxuLyoqXG4gKiBUaGUgUmVnaXN0cnkgaW1wbGVtZW50YXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IGV4dGVuZHMgRXZlbnRlZDx7fSwgUmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlFdmVudE9iamVjdD4gaW1wbGVtZW50cyBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBpbnRlcm5hbCBtYXAgb2YgbGFiZWxzIGFuZCBSZWdpc3RyeUl0ZW1cblx0ICovXG5cdHByaXZhdGUgX3dpZGdldFJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlJdGVtPjtcblxuXHRwcml2YXRlIF9pbmplY3RvclJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgSW5qZWN0b3I+O1xuXG5cdC8qKlxuXHQgKiBFbWl0IGxvYWRlZCBldmVudCBmb3IgcmVnaXN0cnkgbGFiZWxcblx0ICovXG5cdHByaXZhdGUgZW1pdExvYWRlZEV2ZW50KHdpZGdldExhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBXaWRnZXRCYXNlQ29uc3RydWN0b3IgfCBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7XG5cdFx0XHR0eXBlOiB3aWRnZXRMYWJlbCxcblx0XHRcdGFjdGlvbjogJ2xvYWRlZCcsXG5cdFx0XHRpdGVtXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgd2lkZ2V0IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJyR7bGFiZWwudG9TdHJpbmcoKX0nYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblxuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0aXRlbS50aGVuKFxuXHRcdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRcdHJldHVybiB3aWRnZXRDdG9yO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XG5cdFx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbmplY3RvciBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuXHRcdH1cblxuXHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gV2lkZ2V0QmFzZUludGVyZmFjZT4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdGlmICghdGhpcy5oYXMobGFiZWwpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpdGVtID0gdGhpcy5fd2lkZ2V0UmVnaXN0cnkuZ2V0KGxhYmVsKTtcblxuXHRcdGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxUPihpdGVtKSkge1xuXHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0fVxuXG5cdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9taXNlID0gKDxXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvbj5pdGVtKSgpO1xuXHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgcHJvbWlzZSk7XG5cblx0XHRwcm9taXNlLnRoZW4oXG5cdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQ8VD4od2lkZ2V0Q3RvcikpIHtcblx0XHRcdFx0XHR3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRyZXR1cm4gd2lkZ2V0Q3Rvcjtcblx0XHRcdH0sXG5cdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKSBhcyBUO1xuXHR9XG5cblx0cHVibGljIGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX3dpZGdldFJlZ2lzdHJ5ICYmIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFJlZ2lzdHJ5LnRzIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgUmVnaXN0cnlMYWJlbCwgV2lkZ2V0QmFzZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZWdpc3RyeSwgUmVnaXN0cnlFdmVudE9iamVjdCwgUmVnaXN0cnlJdGVtIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vSW5qZWN0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5SGFuZGxlckV2ZW50TWFwIHtcblx0aW52YWxpZGF0ZTogRXZlbnRPYmplY3Q8J2ludmFsaWRhdGUnPjtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5SGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8UmVnaXN0cnlIYW5kbGVyRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcblx0cHJpdmF0ZSBfcmVnaXN0cnlXaWRnZXRMYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+ID0gbmV3IE1hcCgpO1xuXHRwcml2YXRlIF9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPiA9IG5ldyBNYXAoKTtcblx0cHJvdGVjdGVkIGJhc2VSZWdpc3RyeT86IFJlZ2lzdHJ5O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xuXHRcdGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdFx0dGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLm93bih7IGRlc3Ryb3kgfSk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJhc2UoYmFzZVJlZ2lzdHJ5OiBSZWdpc3RyeSkge1xuXHRcdGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0fVxuXHRcdHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xuXHR9XG5cblx0cHVibGljIGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgd2lkZ2V0OiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHR0aGlzLl9yZWdpc3RyeS5kZWZpbmUobGFiZWwsIHdpZGdldCk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGluamVjdG9yOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuX3JlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGxhYmVsLCBpbmplY3Rvcik7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmhhcyhsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHRcdGxhYmVsOiBSZWdpc3RyeUxhYmVsLFxuXHRcdGdsb2JhbFByZWNlZGVuY2U6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXQnLCB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2UpOiBUIHwgbnVsbCB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcblx0fVxuXG5cdHByaXZhdGUgX2dldChcblx0XHRsYWJlbDogUmVnaXN0cnlMYWJlbCxcblx0XHRnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuLFxuXHRcdGdldEZ1bmN0aW9uTmFtZTogJ2dldEluamVjdG9yJyB8ICdnZXQnLFxuXHRcdGxhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT5cblx0KTogYW55IHtcblx0XHRjb25zdCByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCByZWdpc3RyeTogYW55ID0gcmVnaXN0cmllc1tpXTtcblx0XHRcdGlmICghcmVnaXN0cnkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XG5cdFx0XHRjb25zdCByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcblx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fSBlbHNlIGlmIChyZWdpc3RlcmVkTGFiZWxzLmluZGV4T2YobGFiZWwpID09PSAtMSkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGUgPSByZWdpc3RyeS5vbihsYWJlbCwgKGV2ZW50OiBSZWdpc3RyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxuXHRcdFx0XHRcdFx0KHRoaXMgYXMgYW55KVtnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMub3duKGhhbmRsZSk7XG5cdFx0XHRcdGxhYmVsTWFwLnNldChyZWdpc3RyeSwgWy4uLnJlZ2lzdGVyZWRMYWJlbHMsIGxhYmVsXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5SGFuZGxlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBSZWdpc3RyeUhhbmRsZXIudHMiLCJpbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGF1dG8gfSBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IHtcblx0QWZ0ZXJSZW5kZXIsXG5cdEJlZm9yZVByb3BlcnRpZXMsXG5cdEJlZm9yZVJlbmRlcixcblx0Q29yZVByb3BlcnRpZXMsXG5cdERpZmZQcm9wZXJ0eVJlYWN0aW9uLFxuXHRETm9kZSxcblx0UmVuZGVyLFxuXHRXaWRnZXRNZXRhQmFzZSxcblx0V2lkZ2V0TWV0YUNvbnN0cnVjdG9yLFxuXHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRXaWRnZXRQcm9wZXJ0aWVzXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgUmVnaXN0cnlIYW5kbGVyIGZyb20gJy4vUmVnaXN0cnlIYW5kbGVyJztcbmltcG9ydCBOb2RlSGFuZGxlciBmcm9tICcuL05vZGVIYW5kbGVyJztcbmltcG9ydCB7IHdpZGdldEluc3RhbmNlTWFwIH0gZnJvbSAnLi92ZG9tJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yLCBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5cbmVudW0gV2lkZ2V0UmVuZGVyU3RhdGUge1xuXHRJRExFID0gMSxcblx0UFJPUEVSVElFUyxcblx0Q0hJTERSRU4sXG5cdFJFTkRFUlxufVxuXG5pbnRlcmZhY2UgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cyB7XG5cdHByZXZpb3VzUHJvcGVydGllczogYW55O1xuXHRuZXdQcm9wZXJ0aWVzOiBhbnk7XG5cdGNoYW5nZWQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZWFjdGlvbkZ1bmN0aW9uQ29uZmlnIHtcblx0cHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cdHJlYWN0aW9uOiBEaWZmUHJvcGVydHlSZWFjdGlvbjtcbn1cblxuZXhwb3J0IHR5cGUgQm91bmRGdW5jdGlvbkRhdGEgPSB7IGJvdW5kRnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7IHNjb3BlOiBhbnkgfTtcblxuY29uc3QgZGVjb3JhdG9yTWFwID0gbmV3IE1hcDxGdW5jdGlvbiwgTWFwPHN0cmluZywgYW55W10+PigpO1xuY29uc3QgYm91bmRBdXRvID0gYXV0by5iaW5kKG51bGwpO1xuXG4vKipcbiAqIE1haW4gd2lkZ2V0IGJhc2UgZm9yIGFsbCB3aWRnZXRzIHRvIGV4dGVuZFxuICovXG5leHBvcnQgY2xhc3MgV2lkZ2V0QmFzZTxQID0gV2lkZ2V0UHJvcGVydGllcywgQyBleHRlbmRzIEROb2RlID0gRE5vZGU+IGltcGxlbWVudHMgV2lkZ2V0QmFzZUludGVyZmFjZTxQLCBDPiB7XG5cdC8qKlxuXHQgKiBzdGF0aWMgaWRlbnRpZmllclxuXHQgKi9cblx0c3RhdGljIF90eXBlOiBzeW1ib2wgPSBXSURHRVRfQkFTRV9UWVBFO1xuXG5cdC8qKlxuXHQgKiBjaGlsZHJlbiBhcnJheVxuXHQgKi9cblx0cHJpdmF0ZSBfY2hpbGRyZW46IChDIHwgbnVsbClbXTtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIGl0IGlzIHRoZSBpbml0aWFsIHNldCBwcm9wZXJ0aWVzIGN5Y2xlXG5cdCAqL1xuXHRwcml2YXRlIF9pbml0aWFsUHJvcGVydGllcyA9IHRydWU7XG5cblx0LyoqXG5cdCAqIGludGVybmFsIHdpZGdldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwcml2YXRlIF9wcm9wZXJ0aWVzOiBQICYgV2lkZ2V0UHJvcGVydGllcyAmIHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfTtcblxuXHQvKipcblx0ICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX2NoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdID0gW107XG5cblx0LyoqXG5cdCAqIG1hcCBvZiBkZWNvcmF0b3JzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhpcyB3aWRnZXRcblx0ICovXG5cdHByaXZhdGUgX2RlY29yYXRvckNhY2hlOiBNYXA8c3RyaW5nLCBhbnlbXT47XG5cblx0cHJpdmF0ZSBfcmVnaXN0cnk6IFJlZ2lzdHJ5SGFuZGxlcjtcblxuXHQvKipcblx0ICogTWFwIG9mIGZ1bmN0aW9ucyBwcm9wZXJ0aWVzIGZvciB0aGUgYm91bmQgZnVuY3Rpb25cblx0ICovXG5cdHByaXZhdGUgX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwOiBXZWFrTWFwPCguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCBCb3VuZEZ1bmN0aW9uRGF0YT47XG5cblx0cHJpdmF0ZSBfcmVuZGVyU3RhdGU6IFdpZGdldFJlbmRlclN0YXRlID0gV2lkZ2V0UmVuZGVyU3RhdGUuSURMRTtcblxuXHRwcml2YXRlIF9tZXRhTWFwOiBNYXA8V2lkZ2V0TWV0YUNvbnN0cnVjdG9yPGFueT4sIFdpZGdldE1ldGFCYXNlPjtcblxuXHRwcml2YXRlIF9ib3VuZFJlbmRlckZ1bmM6IFJlbmRlcjtcblxuXHRwcml2YXRlIF9ib3VuZEludmFsaWRhdGU6ICgpID0+IHZvaWQ7XG5cblx0cHJpdmF0ZSBfbm9kZUhhbmRsZXI6IE5vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyKCk7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fY2hpbGRyZW4gPSBbXTtcblx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gPFA+e307XG5cdFx0dGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcblxuXHRcdHdpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XG5cdFx0XHRkaXJ0eTogdHJ1ZSxcblx0XHRcdG9uRWxlbWVudENyZWF0ZWQ6IChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0dGhpcy5vbkVsZW1lbnRDcmVhdGVkKGVsZW1lbnQsIGtleSk7XG5cdFx0XHR9LFxuXHRcdFx0b25FbGVtZW50VXBkYXRlZDogKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHR0aGlzLm9uRWxlbWVudFVwZGF0ZWQoZWxlbWVudCwga2V5KTtcblx0XHRcdH0sXG5cdFx0XHRvbkF0dGFjaDogKCk6IHZvaWQgPT4ge1xuXHRcdFx0XHR0aGlzLm9uQXR0YWNoKCk7XG5cdFx0XHR9LFxuXHRcdFx0b25EZXRhY2g6ICgpOiB2b2lkID0+IHtcblx0XHRcdFx0dGhpcy5vbkRldGFjaCgpO1xuXHRcdFx0XHR0aGlzLl9kZXN0cm95KCk7XG5cdFx0XHR9LFxuXHRcdFx0bm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxuXHRcdFx0cmVnaXN0cnk6ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0cnk7XG5cdFx0XHR9LFxuXHRcdFx0Y29yZVByb3BlcnRpZXM6IHt9IGFzIENvcmVQcm9wZXJ0aWVzLFxuXHRcdFx0aW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlXG5cdFx0fSk7XG5cblx0XHR0aGlzLl9ydW5BZnRlckNvbnN0cnVjdG9ycygpO1xuXHR9XG5cblx0cHJvdGVjdGVkIG1ldGE8VCBleHRlbmRzIFdpZGdldE1ldGFCYXNlPihNZXRhVHlwZTogV2lkZ2V0TWV0YUNvbnN0cnVjdG9yPFQ+KTogVCB7XG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcCA9IG5ldyBNYXA8V2lkZ2V0TWV0YUNvbnN0cnVjdG9yPGFueT4sIFdpZGdldE1ldGFCYXNlPigpO1xuXHRcdH1cblx0XHRsZXQgY2FjaGVkID0gdGhpcy5fbWV0YU1hcC5nZXQoTWV0YVR5cGUpO1xuXHRcdGlmICghY2FjaGVkKSB7XG5cdFx0XHRjYWNoZWQgPSBuZXcgTWV0YVR5cGUoe1xuXHRcdFx0XHRpbnZhbGlkYXRlOiB0aGlzLl9ib3VuZEludmFsaWRhdGUsXG5cdFx0XHRcdG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcblx0XHRcdFx0YmluZDogdGhpc1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLnNldChNZXRhVHlwZSwgY2FjaGVkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGVkIGFzIFQ7XG5cdH1cblxuXHQvKipcblx0ICogV2lkZ2V0IGxpZmVjeWNsZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgYSBkb20gbm9kZSBpcyBjcmVhdGVkIGZvciBhIFZOb2RlLlxuXHQgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBhY2Nlc3MgdGhlIGRvbSBub2RlcyB0aGF0IHdlcmUgaW5zZXJ0ZWQgaW50byB0aGUgZG9tLlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZG9tIG5vZGUgcmVwcmVzZW50ZWQgYnkgdGhlIHZkb20gbm9kZS5cblx0ICogQHBhcmFtIGtleSBUaGUgdmRvbSBub2RlJ3Mga2V5LlxuXHQgKi9cblx0cHJvdGVjdGVkIG9uRWxlbWVudENyZWF0ZWQoZWxlbWVudDogRWxlbWVudCwga2V5OiBzdHJpbmcgfCBudW1iZXIpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHQvKipcblx0ICogV2lkZ2V0IGxpZmVjeWNsZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgYSBkb20gbm9kZSB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCBhIFZOb2RlIGlzIHVwZGF0ZWQuXG5cdCAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFjY2VzcyB0aGUgZG9tIG5vZGUuXG5cdCAqIEBwYXJhbSBlbGVtZW50IFRoZSBkb20gbm9kZSByZXByZXNlbnRlZCBieSB0aGUgdmRvbSBub2RlLlxuXHQgKiBAcGFyYW0ga2V5IFRoZSB2ZG9tIG5vZGUncyBrZXkuXG5cdCAqL1xuXHRwcm90ZWN0ZWQgb25FbGVtZW50VXBkYXRlZChlbGVtZW50OiBFbGVtZW50LCBrZXk6IHN0cmluZyB8IG51bWJlcik6IHZvaWQge1xuXHRcdC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cblx0fVxuXG5cdHByb3RlY3RlZCBvbkF0dGFjaCgpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHRwcm90ZWN0ZWQgb25EZXRhY2goKTogdm9pZCB7XG5cdFx0Ly8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxuXHR9XG5cblx0cHVibGljIGdldCBwcm9wZXJ0aWVzKCk6IFJlYWRvbmx5PFA+ICYgUmVhZG9ubHk8V2lkZ2V0UHJvcGVydGllcz4ge1xuXHRcdHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuXHR9XG5cblx0cHVibGljIGdldCBjaGFuZ2VkUHJvcGVydHlLZXlzKCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gWy4uLnRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXNdO1xuXHR9XG5cblx0cHVibGljIF9fc2V0Q29yZVByb3BlcnRpZXNfXyhjb3JlUHJvcGVydGllczogQ29yZVByb3BlcnRpZXMpOiB2b2lkIHtcblx0XHR0aGlzLl9yZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLlBST1BFUlRJRVM7XG5cdFx0Y29uc3QgeyBiYXNlUmVnaXN0cnkgfSA9IGNvcmVQcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cblx0XHRpZiAoaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeSAhPT0gYmFzZVJlZ2lzdHJ5KSB7XG5cdFx0XHRpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVnaXN0cnkuYmFzZSA9IGJhc2VSZWdpc3RyeTtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMgPSBjb3JlUHJvcGVydGllcztcblx0fVxuXG5cdHB1YmxpYyBfX3NldFByb3BlcnRpZXNfXyhvcmlnaW5hbFByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdHRoaXMuX3JlbmRlclN0YXRlID0gV2lkZ2V0UmVuZGVyU3RhdGUuUFJPUEVSVElFUztcblx0XHRjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5fcnVuQmVmb3JlUHJvcGVydGllcyhvcmlnaW5hbFByb3BlcnRpZXMpO1xuXHRcdGNvbnN0IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5Jyk7XG5cdFx0Y29uc3QgY2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW10gPSBbXTtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblxuXHRcdGlmICh0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9PT0gZmFsc2UgfHwgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0Y29uc3QgYWxsUHJvcGVydGllcyA9IFsuLi5wcm9wZXJ0eU5hbWVzLCAuLi5PYmplY3Qua2V5cyh0aGlzLl9wcm9wZXJ0aWVzKV07XG5cdFx0XHRjb25zdCBjaGVja2VkUHJvcGVydGllczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuXHRcdFx0Y29uc3QgZGlmZlByb3BlcnR5UmVzdWx0czogYW55ID0ge307XG5cdFx0XHRsZXQgcnVuUmVhY3Rpb25zID0gZmFsc2U7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBhbGxQcm9wZXJ0aWVzW2ldO1xuXHRcdFx0XHRpZiAoY2hlY2tlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNoZWNrZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0Y29uc3QgcHJldmlvdXNQcm9wZXJ0eSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0Y29uc3QgbmV3UHJvcGVydHkgPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShcblx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sXG5cdFx0XHRcdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmRcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0cnVuUmVhY3Rpb25zID0gdHJ1ZTtcblx0XHRcdFx0XHRjb25zdCBkaWZmRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoYGRpZmZQcm9wZXJ0eToke3Byb3BlcnR5TmFtZX1gKTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGRpZmZGdW5jdGlvbnNbaV0ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0XHRkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGJvdW5kQXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0ZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAocnVuUmVhY3Rpb25zKSB7XG5cdFx0XHRcdHRoaXMuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhwcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKS5mb3JFYWNoKChhcmdzLCByZWFjdGlvbikgPT4ge1xuXHRcdFx0XHRcdGlmIChhcmdzLmNoYW5nZWQpIHtcblx0XHRcdFx0XHRcdHJlYWN0aW9uLmNhbGwodGhpcywgYXJncy5wcmV2aW91c1Byb3BlcnRpZXMsIGFyZ3MubmV3UHJvcGVydGllcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3Byb3BlcnRpZXMgPSBkaWZmUHJvcGVydHlSZXN1bHRzO1xuXHRcdFx0dGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gZmFsc2U7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lc1tpXTtcblx0XHRcdFx0aWYgKHR5cGVvZiBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSxcblx0XHRcdFx0XHRcdGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzIH07XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3JlbmRlclN0YXRlID0gV2lkZ2V0UmVuZGVyU3RhdGUuSURMRTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNoaWxkcmVuKCk6IChDIHwgbnVsbClbXSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuXHR9XG5cblx0cHVibGljIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbjogKEMgfCBudWxsKVtdKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVuZGVyU3RhdGUgPSBXaWRnZXRSZW5kZXJTdGF0ZS5DSElMRFJFTjtcblx0XHRpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9fcmVuZGVyX18oKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHR0aGlzLl9yZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLlJFTkRFUjtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IGZhbHNlO1xuXHRcdGNvbnN0IHJlbmRlciA9IHRoaXMuX3J1bkJlZm9yZVJlbmRlcnMoKTtcblx0XHRsZXQgZE5vZGUgPSByZW5kZXIoKTtcblx0XHRkTm9kZSA9IHRoaXMucnVuQWZ0ZXJSZW5kZXJzKGROb2RlKTtcblx0XHR0aGlzLl9ub2RlSGFuZGxlci5jbGVhcigpO1xuXHRcdHRoaXMuX3JlbmRlclN0YXRlID0gV2lkZ2V0UmVuZGVyU3RhdGUuSURMRTtcblx0XHRyZXR1cm4gZE5vZGU7XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZSgpOiB2b2lkIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGlmICh0aGlzLl9yZW5kZXJTdGF0ZSA9PT0gV2lkZ2V0UmVuZGVyU3RhdGUuSURMRSkge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEucGFyZW50SW52YWxpZGF0ZSkge1xuXHRcdFx0XHRpbnN0YW5jZURhdGEucGFyZW50SW52YWxpZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5fcmVuZGVyU3RhdGUgPT09IFdpZGdldFJlbmRlclN0YXRlLlBST1BFUlRJRVMpIHtcblx0XHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9yZW5kZXJTdGF0ZSA9PT0gV2lkZ2V0UmVuZGVyU3RhdGUuQ0hJTERSRU4pIHtcblx0XHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpOiBETm9kZSB8IEROb2RlW10ge1xuXHRcdHJldHVybiB2KCdkaXYnLCB7fSwgdGhpcy5jaGlsZHJlbik7XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gYWRkIGRlY29yYXRvcnMgdG8gV2lkZ2V0QmFzZVxuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBkZWNvcmF0b3Jcblx0ICovXG5cdHByb3RlY3RlZCBhZGREZWNvcmF0b3IoZGVjb3JhdG9yS2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcblx0XHR2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuXHRcdGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG5cdFx0XHRsZXQgZGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvck1hcC5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoIWRlY29yYXRvckxpc3QpIHtcblx0XHRcdFx0ZGVjb3JhdG9yTGlzdCA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblx0XHRcdFx0ZGVjb3JhdG9yTWFwLnNldCh0aGlzLmNvbnN0cnVjdG9yLCBkZWNvcmF0b3JMaXN0KTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvckxpc3QuZ2V0KGRlY29yYXRvcktleSk7XG5cdFx0XHRpZiAoIXNwZWNpZmljRGVjb3JhdG9yTGlzdCkge1xuXHRcdFx0XHRzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBbXTtcblx0XHRcdFx0ZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xuXHRcdFx0fVxuXHRcdFx0c3BlY2lmaWNEZWNvcmF0b3JMaXN0LnB1c2goLi4udmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBkZWNvcmF0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5KTtcblx0XHRcdHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIFsuLi5kZWNvcmF0b3JzLCAuLi52YWx1ZV0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBidWlsZCB0aGUgbGlzdCBvZiBkZWNvcmF0b3JzIGZyb20gdGhlIGdsb2JhbCBkZWNvcmF0b3IgbWFwLlxuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5ICBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHJldHVybiBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5OiBzdHJpbmcpOiBhbnlbXSB7XG5cdFx0Y29uc3QgYWxsRGVjb3JhdG9ycyA9IFtdO1xuXG5cdFx0bGV0IGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuXHRcdHdoaWxlIChjb25zdHJ1Y3Rvcikge1xuXHRcdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcblx0XHRcdGlmIChpbnN0YW5jZU1hcCkge1xuXHRcdFx0XHRjb25zdCBkZWNvcmF0b3JzID0gaW5zdGFuY2VNYXAuZ2V0KGRlY29yYXRvcktleSk7XG5cblx0XHRcdFx0aWYgKGRlY29yYXRvcnMpIHtcblx0XHRcdFx0XHRhbGxEZWNvcmF0b3JzLnVuc2hpZnQoLi4uZGVjb3JhdG9ycyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3Ryb3lzIHByaXZhdGUgcmVzb3VyY2VzIGZvciBXaWRnZXRCYXNlXG5cdCAqL1xuXHRwcml2YXRlIF9kZXN0cm95KCkge1xuXHRcdGlmICh0aGlzLl9yZWdpc3RyeSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkuZGVzdHJveSgpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLmZvckVhY2goKG1ldGEpID0+IHtcblx0XHRcdFx0bWV0YS5kZXN0cm95KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gcmV0cmlldmUgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqL1xuXHRwcm90ZWN0ZWQgZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleTogc3RyaW5nKTogYW55W10ge1xuXHRcdGxldCBhbGxEZWNvcmF0b3JzID0gdGhpcy5fZGVjb3JhdG9yQ2FjaGUuZ2V0KGRlY29yYXRvcktleSk7XG5cblx0XHRpZiAoYWxsRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0XHR9XG5cblx0XHRhbGxEZWNvcmF0b3JzID0gdGhpcy5fYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSk7XG5cblx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBhbGxEZWNvcmF0b3JzKTtcblx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0fVxuXG5cdHByaXZhdGUgX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhcblx0XHRuZXdQcm9wZXJ0aWVzOiBhbnksXG5cdFx0Y2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW11cblx0KTogTWFwPEZ1bmN0aW9uLCBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzPiB7XG5cdFx0Y29uc3QgcmVhY3Rpb25GdW5jdGlvbnM6IFJlYWN0aW9uRnVuY3Rpb25Db25maWdbXSA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nKTtcblxuXHRcdHJldHVybiByZWFjdGlvbkZ1bmN0aW9ucy5yZWR1Y2UoKHJlYWN0aW9uUHJvcGVydHlNYXAsIHsgcmVhY3Rpb24sIHByb3BlcnR5TmFtZSB9KSA9PiB7XG5cdFx0XHRsZXQgcmVhY3Rpb25Bcmd1bWVudHMgPSByZWFjdGlvblByb3BlcnR5TWFwLmdldChyZWFjdGlvbik7XG5cdFx0XHRpZiAocmVhY3Rpb25Bcmd1bWVudHMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZWFjdGlvbkFyZ3VtZW50cyA9IHtcblx0XHRcdFx0XHRwcmV2aW91c1Byb3BlcnRpZXM6IHt9LFxuXHRcdFx0XHRcdG5ld1Byb3BlcnRpZXM6IHt9LFxuXHRcdFx0XHRcdGNoYW5nZWQ6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5wcmV2aW91c1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLm5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IG5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdGlmIChjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMuY2hhbmdlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZWFjdGlvblByb3BlcnR5TWFwLnNldChyZWFjdGlvbiwgcmVhY3Rpb25Bcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIHJlYWN0aW9uUHJvcGVydHlNYXA7XG5cdFx0fSwgbmV3IE1hcDxGdW5jdGlvbiwgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cz4oKSk7XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdW5ib3VuZCBwcm9wZXJ0eSBmdW5jdGlvbnMgdG8gdGhlIHNwZWNpZmllZCBgYmluZGAgcHJvcGVydHlcblx0ICpcblx0ICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXG5cdCAqL1xuXHRwcml2YXRlIF9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0eTogYW55LCBiaW5kOiBhbnkpOiBhbnkge1xuXHRcdGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xuXHRcdFx0aWYgKHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPSBuZXcgV2Vha01hcDxcblx0XHRcdFx0XHQoLi4uYXJnczogYW55W10pID0+IGFueSxcblx0XHRcdFx0XHR7IGJvdW5kRnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7IHNjb3BlOiBhbnkgfVxuXHRcdFx0XHQ+KCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBiaW5kSW5mbzogUGFydGlhbDxCb3VuZEZ1bmN0aW9uRGF0YT4gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocHJvcGVydHkpIHx8IHt9O1xuXHRcdFx0bGV0IHsgYm91bmRGdW5jLCBzY29wZSB9ID0gYmluZEluZm87XG5cblx0XHRcdGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xuXHRcdFx0XHRib3VuZEZ1bmMgPSBwcm9wZXJ0eS5iaW5kKGJpbmQpIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuXHRcdFx0XHR0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocHJvcGVydHksIHsgYm91bmRGdW5jLCBzY29wZTogYmluZCB9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBib3VuZEZ1bmM7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9wZXJ0eTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgcmVnaXN0cnkoKTogUmVnaXN0cnlIYW5kbGVyIHtcblx0XHRpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeTtcblx0fVxuXG5cdHByaXZhdGUgX3J1bkJlZm9yZVByb3BlcnRpZXMocHJvcGVydGllczogYW55KSB7XG5cdFx0Y29uc3QgYmVmb3JlUHJvcGVydGllczogQmVmb3JlUHJvcGVydGllc1tdID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcblx0XHRpZiAoYmVmb3JlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYmVmb3JlUHJvcGVydGllcy5yZWR1Y2UoXG5cdFx0XHRcdChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pID0+IHtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5wcm9wZXJ0aWVzLCAuLi5iZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24uY2FsbCh0aGlzLCBwcm9wZXJ0aWVzKSB9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7IC4uLnByb3BlcnRpZXMgfVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdH1cblxuXHQvKipcblx0ICogUnVuIGFsbCByZWdpc3RlcmVkIGJlZm9yZSByZW5kZXJzIGFuZCByZXR1cm4gdGhlIHVwZGF0ZWQgcmVuZGVyIG1ldGhvZFxuXHQgKi9cblx0cHJpdmF0ZSBfcnVuQmVmb3JlUmVuZGVycygpOiBSZW5kZXIge1xuXHRcdGNvbnN0IGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XG5cblx0XHRpZiAoYmVmb3JlUmVuZGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYmVmb3JlUmVuZGVycy5yZWR1Y2UoKHJlbmRlcjogUmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbjogQmVmb3JlUmVuZGVyKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHJlbmRlciwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fY2hpbGRyZW4pO1xuXHRcdFx0XHRpZiAoIXVwZGF0ZWRSZW5kZXIpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xuXHRcdFx0XHRcdHJldHVybiByZW5kZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRSZW5kZXI7XG5cdFx0XHR9LCB0aGlzLl9ib3VuZFJlbmRlckZ1bmMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYm91bmRSZW5kZXJGdW5jO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBhZnRlciByZW5kZXJzIGFuZCByZXR1cm4gdGhlIGRlY29yYXRlZCBETm9kZXNcblx0ICpcblx0ICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcblx0ICovXG5cdHByb3RlY3RlZCBydW5BZnRlclJlbmRlcnMoZE5vZGU6IEROb2RlIHwgRE5vZGVbXSk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0Y29uc3QgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XG5cblx0XHRpZiAoYWZ0ZXJSZW5kZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBhZnRlclJlbmRlcnMucmVkdWNlKChkTm9kZTogRE5vZGUgfCBETm9kZVtdLCBhZnRlclJlbmRlckZ1bmN0aW9uOiBBZnRlclJlbmRlcikgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWZ0ZXJSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIGROb2RlKTtcblx0XHRcdH0sIGROb2RlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLmZvckVhY2goKG1ldGEpID0+IHtcblx0XHRcdFx0bWV0YS5hZnRlclJlbmRlcigpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGROb2RlO1xuXHR9XG5cblx0cHJpdmF0ZSBfcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTogdm9pZCB7XG5cdFx0Y29uc3QgYWZ0ZXJDb25zdHJ1Y3RvcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJDb25zdHJ1Y3RvcicpO1xuXG5cdFx0aWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdGFmdGVyQ29uc3RydWN0b3JzLmZvckVhY2goKGFmdGVyQ29uc3RydWN0b3IpID0+IGFmdGVyQ29uc3RydWN0b3IuY2FsbCh0aGlzKSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdpZGdldEJhc2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gV2lkZ2V0QmFzZS50cyIsImltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHtcblx0Q29uc3RydWN0b3IsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHREZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFJlZ2lzdHJ5TGFiZWwsXG5cdFZOb2RlUHJvcGVydGllcyxcblx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0V05vZGVcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgV05vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgV05PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgV05vZGUuJyk7XG5cbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFZOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFZOb2RlLicpO1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXTm9kZTxXIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPihcblx0Y2hpbGQ6IEROb2RlPFc+XG4pOiBjaGlsZCBpcyBXTm9kZTxXPiB7XG5cdHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gV05PREUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBWTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWTm9kZShjaGlsZDogRE5vZGUpOiBjaGlsZCBpcyBWTm9kZSB7XG5cdHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gVk5PREUpO1xufVxuXG4vKipcbiAqIEdlbmVyaWMgZGVjb3JhdGUgZnVuY3Rpb24gZm9yIEROb2Rlcy4gVGhlIG5vZGVzIGFyZSBtb2RpZmllZCBpbiBwbGFjZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcHJlZGljYXRlXG4gKiBhbmQgbW9kaWZpZXIgZnVuY3Rpb25zLlxuICpcbiAqIFRoZSBjaGlsZHJlbiBvZiBlYWNoIG5vZGUgYXJlIGZsYXR0ZW5lZCBhbmQgYWRkZWQgdG8gdGhlIGFycmF5IGZvciBkZWNvcmF0aW9uLlxuICpcbiAqIElmIG5vIHByZWRpY2F0ZSBpcyBzdXBwbGllZCB0aGVuIHRoZSBtb2RpZmllciB3aWxsIGJlIGV4ZWN1dGVkIG9uIGFsbCBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oXG5cdGROb2RlczogRE5vZGUsXG5cdG1vZGlmaWVyOiAoZE5vZGU6IFQpID0+IHZvaWQsXG5cdHByZWRpY2F0ZTogKGROb2RlOiBETm9kZSkgPT4gZE5vZGUgaXMgVFxuKTogRE5vZGU7XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihcblx0ZE5vZGVzOiBETm9kZVtdLFxuXHRtb2RpZmllcjogKGROb2RlOiBUKSA9PiB2b2lkLFxuXHRwcmVkaWNhdGU6IChkTm9kZTogRE5vZGUpID0+IGROb2RlIGlzIFRcbik6IEROb2RlW107XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGUoZE5vZGVzOiBETm9kZSwgbW9kaWZpZXI6IChkTm9kZTogRE5vZGUpID0+IHZvaWQpOiBETm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IEROb2RlW10sIG1vZGlmaWVyOiAoZE5vZGU6IEROb2RlKSA9PiB2b2lkKTogRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShcblx0ZE5vZGVzOiBETm9kZSB8IEROb2RlW10sXG5cdG1vZGlmaWVyOiAoZE5vZGU6IEROb2RlKSA9PiB2b2lkLFxuXHRwcmVkaWNhdGU/OiAoZE5vZGU6IEROb2RlKSA9PiBib29sZWFuXG4pOiBETm9kZSB8IEROb2RlW10ge1xuXHRsZXQgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBbLi4uZE5vZGVzXSA6IFtkTm9kZXNdO1xuXHR3aGlsZSAobm9kZXMubGVuZ3RoKSB7XG5cdFx0Y29uc3Qgbm9kZSA9IG5vZGVzLnBvcCgpO1xuXHRcdGlmIChub2RlKSB7XG5cdFx0XHRpZiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUobm9kZSkpIHtcblx0XHRcdFx0bW9kaWZpZXIobm9kZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoKGlzV05vZGUobm9kZSkgfHwgaXNWTm9kZShub2RlKSkgJiYgbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRub2RlcyA9IFsuLi5ub2RlcywgLi4ubm9kZS5jaGlsZHJlbl07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkTm9kZXM7XG59XG5cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIGEgd2lkZ2V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdzxXIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdHdpZGdldENvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxXPiB8IFJlZ2lzdHJ5TGFiZWwsXG5cdHByb3BlcnRpZXM6IFdbJ3Byb3BlcnRpZXMnXSxcblx0Y2hpbGRyZW46IFdbJ2NoaWxkcmVuJ10gPSBbXVxuKTogV05vZGU8Vz4ge1xuXHRyZXR1cm4ge1xuXHRcdGNoaWxkcmVuLFxuXHRcdHdpZGdldENvbnN0cnVjdG9yLFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dHlwZTogV05PREVcblx0fTtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgVk5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcywgY2hpbGRyZW4/OiBETm9kZVtdKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgY2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlW10pOiBWTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiB2KHRhZzogc3RyaW5nKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdihcblx0dGFnOiBzdHJpbmcsXG5cdHByb3BlcnRpZXNPckNoaWxkcmVuOiBWTm9kZVByb3BlcnRpZXMgfCBEZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzIHwgRE5vZGVbXSA9IHt9LFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGVbXSA9IHVuZGVmaW5lZFxuKTogVk5vZGUge1xuXHRsZXQgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuXHRsZXQgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s7XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllc09yQ2hpbGRyZW4pKSB7XG5cdFx0Y2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcblx0XHRwcm9wZXJ0aWVzID0ge307XG5cdH1cblxuXHRpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XG5cdFx0cHJvcGVydGllcyA9IHt9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0YWcsXG5cdFx0ZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXG5cdFx0Y2hpbGRyZW4sXG5cdFx0cHJvcGVydGllcyxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGQudHMiLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBCZWZvcmVQcm9wZXJ0aWVzIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBhZGRzIHRoZSBmdW5jdGlvbiBwYXNzZWQgb2YgdGFyZ2V0IG1ldGhvZCB0byBiZSBydW5cbiAqIGluIHRoZSBgYmVmb3JlUHJvcGVydGllc2AgbGlmZWN5Y2xlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2Q6IEJlZm9yZVByb3BlcnRpZXMpOiAodGFyZ2V0OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcygpOiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2Q/OiBCZWZvcmVQcm9wZXJ0aWVzKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJlZm9yZVByb3BlcnRpZXM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYmVmb3JlUHJvcGVydGllcy50cyIsImltcG9ydCB7IEN1c3RvbUVsZW1lbnRJbml0aWFsaXplciB9IGZyb20gJy4uL2N1c3RvbUVsZW1lbnRzJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY3VzdG9tIGVsZW1lbnQgY29uZmlndXJhdGlvbiB1c2VkIGJ5IHRoZSBjdXN0b21FbGVtZW50IGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRDb25maWc8UCBleHRlbmRzIFdpZGdldFByb3BlcnRpZXM+IHtcblx0LyoqXG5cdCAqIFRoZSB0YWcgb2YgdGhlIGN1c3RvbSBlbGVtZW50XG5cdCAqL1xuXHR0YWc6IHN0cmluZztcblxuXHQvKipcblx0ICogTGlzdCBvZiB3aWRnZXQgcHJvcGVydGllcyB0byBleHBvc2UgYXMgcHJvcGVydGllcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHByb3BlcnRpZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBhdHRyaWJ1dGVzIG9uIHRoZSBjdXN0b20gZWxlbWVudCB0byBtYXAgdG8gd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdGF0dHJpYnV0ZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBldmVudHMgdG8gZXhwb3NlXG5cdCAqL1xuXHRldmVudHM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogSW5pdGlhbGl6YXRpb24gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGNyZWF0ZWQgKGZvciBjdXN0b20gcHJvcGVydHkgc2V0dGluZylcblx0ICovXG5cdGluaXRpYWxpemF0aW9uPzogQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyO1xufVxuXG4vKipcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21FbGVtZW50PFAgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzID0gV2lkZ2V0UHJvcGVydGllcz4oe1xuXHR0YWcsXG5cdHByb3BlcnRpZXMsXG5cdGF0dHJpYnV0ZXMsXG5cdGV2ZW50cyxcblx0aW5pdGlhbGl6YXRpb25cbn06IEN1c3RvbUVsZW1lbnRDb25maWc8UD4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uPFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjxhbnk+Pih0YXJnZXQ6IFQpIHtcblx0XHR0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XG5cdFx0XHR0YWdOYW1lOiB0YWcsXG5cdFx0XHR3aWRnZXRDb25zdHJ1Y3RvcjogdGFyZ2V0LFxuXHRcdFx0YXR0cmlidXRlczogKGF0dHJpYnV0ZXMgfHwgW10pLm1hcCgoYXR0cmlidXRlTmFtZSkgPT4gKHsgYXR0cmlidXRlTmFtZSB9KSksXG5cdFx0XHRwcm9wZXJ0aWVzOiAocHJvcGVydGllcyB8fCBbXSkubWFwKChwcm9wZXJ0eU5hbWUpID0+ICh7IHByb3BlcnR5TmFtZSB9KSksXG5cdFx0XHRldmVudHM6IChldmVudHMgfHwgW10pLm1hcCgocHJvcGVydHlOYW1lKSA9PiAoe1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdGV2ZW50TmFtZTogcHJvcGVydHlOYW1lLnJlcGxhY2UoJ29uJywgJycpLnRvTG93ZXJDYXNlKClcblx0XHRcdH0pKSxcblx0XHRcdGluaXRpYWxpemF0aW9uXG5cdFx0fTtcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3VzdG9tRWxlbWVudDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjdXN0b21FbGVtZW50LnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgRGlmZlByb3BlcnR5RnVuY3Rpb24gfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIGEgZnVuY3Rpb24gYXMgYSBzcGVjaWZpYyBwcm9wZXJ0eSBkaWZmXG4gKlxuICogQHBhcmFtIHByb3BlcnR5TmFtZSAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9mIHdoaWNoIHRoZSBkaWZmIGZ1bmN0aW9uIGlzIGFwcGxpZWRcbiAqIEBwYXJhbSBkaWZmVHlwZSAgICAgIFRoZSBkaWZmIHR5cGUsIGRlZmF1bHQgaXMgRGlmZlR5cGUuQVVUTy5cbiAqIEBwYXJhbSBkaWZmRnVuY3Rpb24gIEEgZGlmZiBmdW5jdGlvbiB0byBydW4gaWYgZGlmZlR5cGUgaWYgRGlmZlR5cGUuQ1VTVE9NXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWZmUHJvcGVydHkocHJvcGVydHlOYW1lOiBzdHJpbmcsIGRpZmZGdW5jdGlvbjogRGlmZlByb3BlcnR5RnVuY3Rpb24sIHJlYWN0aW9uRnVuY3Rpb24/OiBGdW5jdGlvbikge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWAsIGRpZmZGdW5jdGlvbi5iaW5kKG51bGwpKTtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5JywgcHJvcGVydHlOYW1lKTtcblx0XHRpZiAocmVhY3Rpb25GdW5jdGlvbiB8fCBwcm9wZXJ0eUtleSkge1xuXHRcdFx0dGFyZ2V0LmFkZERlY29yYXRvcignZGlmZlJlYWN0aW9uJywge1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdHJlYWN0aW9uOiBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiByZWFjdGlvbkZ1bmN0aW9uXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmUHJvcGVydHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZGlmZlByb3BlcnR5LnRzIiwiZXhwb3J0IHR5cGUgRGVjb3JhdG9ySGFuZGxlciA9ICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcpID0+IHZvaWQ7XG5cbi8qKlxuICogR2VuZXJpYyBkZWNvcmF0b3IgaGFuZGxlciB0byB0YWtlIGNhcmUgb2Ygd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgY2FsbGVkIGF0IHRoZSBjbGFzcyBsZXZlbFxuICogb3IgdGhlIG1ldGhvZCBsZXZlbC5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRGVjb3JhdG9yKGhhbmRsZXI6IERlY29yYXRvckhhbmRsZXIpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZywgZGVzY3JpcHRvcj86IFByb3BlcnR5RGVzY3JpcHRvcikge1xuXHRcdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRoYW5kbGVyKHRhcmdldC5wcm90b3R5cGUsIHVuZGVmaW5lZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhhbmRsZXIodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVEZWNvcmF0b3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaGFuZGxlRGVjb3JhdG9yLnRzIiwiaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuL2JlZm9yZVByb3BlcnRpZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnlMYWJlbCB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogTWFwIG9mIGluc3RhbmNlcyBhZ2FpbnN0IHJlZ2lzdGVyZWQgaW5qZWN0b3JzLlxuICovXG5jb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzTWFwOiBXZWFrTWFwPFdpZGdldEJhc2UsIEluamVjdG9yW10+ID0gbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjb250cmFjdCByZXF1aXJlcyBmb3IgdGhlIGdldCBwcm9wZXJ0aWVzIGZ1bmN0aW9uXG4gKiB1c2VkIHRvIG1hcCB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRQcm9wZXJ0aWVzPFQgPSBhbnk+IHtcblx0KHBheWxvYWQ6IGFueSwgcHJvcGVydGllczogVCk6IFQ7XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb24gcmVxdWlyZWQgZm9yIHVzZSBvZiB0aGUgYGluamVjdGAgZGVjb3JhdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0Q29uZmlnIHtcblx0LyoqXG5cdCAqIFRoZSBsYWJlbCBvZiB0aGUgcmVnaXN0cnkgaW5qZWN0b3Jcblx0ICovXG5cdG5hbWU6IFJlZ2lzdHJ5TGFiZWw7XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBwcm9wZXJ0dWVzIHRvIGluamVjdCB1c2luZyB0aGUgcGFzc2VkIHByb3BlcnRpZXNcblx0ICogYW5kIHRoZSBpbmplY3RlZCBwYXlsb2FkLlxuXHQgKi9cblx0Z2V0UHJvcGVydGllczogR2V0UHJvcGVydGllcztcbn1cblxuLyoqXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXG4gKiBhbmQgY3VycmVudCBwcm9wZXJ0aWVzIHdpdGggdGhlIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoeyBuYW1lLCBnZXRQcm9wZXJ0aWVzIH06IEluamVjdENvbmZpZykge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0YmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbih0aGlzOiBXaWRnZXRCYXNlLCBwcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRcdGNvbnN0IGluamVjdG9yID0gdGhpcy5yZWdpc3RyeS5nZXRJbmplY3RvcihuYW1lKTtcblx0XHRcdGlmIChpbmplY3Rvcikge1xuXHRcdFx0XHRjb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzID0gcmVnaXN0ZXJlZEluamVjdG9yc01hcC5nZXQodGhpcykgfHwgW107XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuc2V0KHRoaXMsIHJlZ2lzdGVyZWRJbmplY3RvcnMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmluZGV4T2YoaW5qZWN0b3IpID09PSAtMSkge1xuXHRcdFx0XHRcdGluamVjdG9yLm9uKCdpbnZhbGlkYXRlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZ2V0UHJvcGVydGllcyhpbmplY3Rvci5nZXQoKSwgcHJvcGVydGllcyk7XG5cdFx0XHR9XG5cdFx0fSkodGFyZ2V0KTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluamVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBpbmplY3QudHMiLCJpbXBvcnQgeyBQcm9wZXJ0eUNoYW5nZVJlY29yZCB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0T3JBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsd2F5cyhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogdHJ1ZSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogZmFsc2UsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IHByZXZpb3VzUHJvcGVydHkgIT09IG5ld1Byb3BlcnR5LFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cblx0Y29uc3QgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xuXHRjb25zdCB2YWxpZE5ld1Byb3BlcnR5ID0gbmV3UHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KTtcblxuXHRpZiAoIXZhbGlkT2xkUHJvcGVydHkgfHwgIXZhbGlkTmV3UHJvcGVydHkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hhbmdlZDogdHJ1ZSxcblx0XHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHRcdH07XG5cdH1cblxuXHRjb25zdCBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcblx0Y29uc3QgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld1Byb3BlcnR5KTtcblxuXHRpZiAocHJldmlvdXNLZXlzLmxlbmd0aCAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcblx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0fSBlbHNlIHtcblx0XHRjaGFuZ2VkID0gbmV3S2V5cy5zb21lKChrZXkpID0+IHtcblx0XHRcdHJldHVybiBuZXdQcm9wZXJ0eVtrZXldICE9PSBwcmV2aW91c1Byb3BlcnR5W2tleV07XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdGxldCByZXN1bHQ7XG5cdGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFdJREdFVF9CQVNFX1RZUEUpIHtcblx0XHRcdHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSkpIHtcblx0XHRyZXN1bHQgPSBzaGFsbG93KHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZGlmZi50cyIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzLCBTdXBwb3J0ZWRDbGFzc05hbWUgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi8uLi9JbmplY3Rvcic7XG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaW5qZWN0JztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBkaWZmUHJvcGVydHkgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5JztcbmltcG9ydCB7IHNoYWxsb3cgfSBmcm9tICcuLy4uL2RpZmYnO1xuXG4vKipcbiAqIEEgbG9va3VwIG9iamVjdCBmb3IgYXZhaWxhYmxlIGNsYXNzIG5hbWVzXG4gKi9cbmV4cG9ydCB0eXBlIENsYXNzTmFtZXMgPSB7XG5cdFtrZXk6IHN0cmluZ106IHN0cmluZztcbn07XG5cbi8qKlxuICogQSBsb29rdXAgb2JqZWN0IGZvciBhdmFpbGFibGUgd2lkZ2V0IGNsYXNzZXMgbmFtZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZSB7XG5cdFtrZXk6IHN0cmluZ106IG9iamVjdDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHJlcXVpcmVkIGZvciB0aGUgVGhlbWVkIG1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkUHJvcGVydGllczxUID0gQ2xhc3NOYW1lcz4gZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0aW5qZWN0ZWRUaGVtZT86IGFueTtcblx0dGhlbWU/OiBUaGVtZTtcblx0ZXh0cmFDbGFzc2VzPzogeyBbUCBpbiBrZXlvZiBUXT86IHN0cmluZyB9O1xufVxuXG5jb25zdCBUSEVNRV9LRVkgPSAnIF9rZXknO1xuXG5leHBvcnQgY29uc3QgSU5KRUNURURfVEhFTUVfS0VZID0gU3ltYm9sKCd0aGVtZScpO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIFRoZW1lZE1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkTWl4aW48VCA9IENsYXNzTmFtZXM+IHtcblx0dGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKTogU3VwcG9ydGVkQ2xhc3NOYW1lO1xuXHR0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWVbXSk6IFN1cHBvcnRlZENsYXNzTmFtZVtdO1xuXHRwcm9wZXJ0aWVzOiBUaGVtZWRQcm9wZXJ0aWVzPFQ+O1xufVxuXG4vKipcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodGhlbWU6IHt9KSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnLCB0aGVtZSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZXZlcnNlIGxvb2t1cCBmb3IgdGhlIGNsYXNzZXMgcGFzc2VkIGluIHZpYSB0aGUgYHRoZW1lYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XG4gKiBAcmVxdWlyZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXM6IENsYXNzTmFtZXNbXSk6IENsYXNzTmFtZXMge1xuXHRyZXR1cm4gY2xhc3Nlcy5yZWR1Y2UoXG5cdFx0KGN1cnJlbnRDbGFzc05hbWVzLCBiYXNlQ2xhc3MpID0+IHtcblx0XHRcdE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Y3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XG5cdFx0fSxcblx0XHQ8Q2xhc3NOYW1lcz57fVxuXHQpO1xufVxuXG4vKipcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxuICogaW5qZWN0b3IgaXMgZGVmaW5lZCBhZ2FpbnN0IHRoZSByZWdpc3RyeSwgcmV0dXJuaW5nIHRoZSB0aGVtZS5cbiAqXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxuICogQHBhcmFtIHRoZW1lUmVnaXN0cnkgcmVnaXN0cnkgdG8gZGVmaW5lIHRoZSB0aGVtZSBpbmplY3RvciBhZ2FpbnN0LiBEZWZhdWx0c1xuICogdG8gdGhlIGdsb2JhbCByZWdpc3RyeVxuICpcbiAqIEByZXR1cm5zIHRoZSB0aGVtZSBpbmplY3RvciB1c2VkIHRvIHNldCB0aGUgdGhlbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGVtZTogYW55LCB0aGVtZVJlZ2lzdHJ5OiBSZWdpc3RyeSk6IEluamVjdG9yIHtcblx0Y29uc3QgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGVtZSk7XG5cdHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoSU5KRUNURURfVEhFTUVfS0VZLCB0aGVtZUluamVjdG9yKTtcblx0cmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY2xhc3MgZGVjb3JhdGVkIHdpdGggd2l0aCBUaGVtZWQgZnVuY3Rpb25hbGl0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVkTWl4aW48RSwgVCBleHRlbmRzIENvbnN0cnVjdG9yPFdpZGdldEJhc2U8VGhlbWVkUHJvcGVydGllczxFPj4+Pihcblx0QmFzZTogVFxuKTogQ29uc3RydWN0b3I8VGhlbWVkTWl4aW48RT4+ICYgVCB7XG5cdEBpbmplY3Qoe1xuXHRcdG5hbWU6IElOSkVDVEVEX1RIRU1FX0tFWSxcblx0XHRnZXRQcm9wZXJ0aWVzOiAodGhlbWU6IFRoZW1lLCBwcm9wZXJ0aWVzOiBUaGVtZWRQcm9wZXJ0aWVzKTogVGhlbWVkUHJvcGVydGllcyA9PiB7XG5cdFx0XHRpZiAoIXByb3BlcnRpZXMudGhlbWUpIHtcblx0XHRcdFx0cmV0dXJuIHsgdGhlbWUgfTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7fTtcblx0XHR9XG5cdH0pXG5cdGNsYXNzIFRoZW1lZCBleHRlbmRzIEJhc2Uge1xuXHRcdHB1YmxpYyBwcm9wZXJ0aWVzOiBUaGVtZWRQcm9wZXJ0aWVzPEU+O1xuXG5cdFx0LyoqXG5cdFx0ICogVGhlIFRoZW1lZCBiYXNlQ2xhc3Nlc1xuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3JlZ2lzdGVyZWRCYXNlVGhlbWU6IENsYXNzTmFtZXM7XG5cblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcmVkIGJhc2UgdGhlbWUga2V5c1xuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogUmV2ZXJzZSBsb29rdXAgb2YgdGhlIHRoZW1lIGNsYXNzZXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cDogQ2xhc3NOYW1lcztcblxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiBjbGFzc2VzIG1ldGEgZGF0YSBuZWVkIHRvIGJlIGNhbGN1bGF0ZWQuXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcblxuXHRcdC8qKlxuXHRcdCAqIExvYWRlZCB0aGVtZVxuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3RoZW1lOiBDbGFzc05hbWVzID0ge307XG5cblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKTogU3VwcG9ydGVkQ2xhc3NOYW1lO1xuXHRcdHB1YmxpYyB0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWVbXSk6IFN1cHBvcnRlZENsYXNzTmFtZVtdO1xuXHRcdHB1YmxpYyB0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUgfCBTdXBwb3J0ZWRDbGFzc05hbWVbXSk6IFN1cHBvcnRlZENsYXNzTmFtZSB8IFN1cHBvcnRlZENsYXNzTmFtZVtdIHtcblx0XHRcdGlmICh0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMpIHtcblx0XHRcdFx0dGhpcy5fcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKTtcblx0XHRcdH1cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XG5cdFx0XHRcdHJldHVybiBjbGFzc2VzLm1hcCgoY2xhc3NOYW1lKSA9PiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3Nlcyk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogRnVuY3Rpb24gZmlyZWQgd2hlbiBgdGhlbWVgIG9yIGBleHRyYUNsYXNzZXNgIGFyZSBjaGFuZ2VkLlxuXHRcdCAqL1xuXHRcdEBkaWZmUHJvcGVydHkoJ3RoZW1lJywgc2hhbGxvdylcblx0XHRAZGlmZlByb3BlcnR5KCdleHRyYUNsYXNzZXMnLCBzaGFsbG93KVxuXHRcdHByb3RlY3RlZCBvblByb3BlcnRpZXNDaGFuZ2VkKCkge1xuXHRcdFx0dGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRwcml2YXRlIF9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZTogU3VwcG9ydGVkQ2xhc3NOYW1lKTogU3VwcG9ydGVkQ2xhc3NOYW1lIHtcblx0XHRcdGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCB8fCBjbGFzc05hbWUgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGNsYXNzTmFtZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZXh0cmFDbGFzc2VzID0gdGhpcy5wcm9wZXJ0aWVzLmV4dHJhQ2xhc3NlcyB8fCAoe30gYXMgYW55KTtcblx0XHRcdGNvbnN0IHRoZW1lQ2xhc3NOYW1lID0gdGhpcy5fYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXBbY2xhc3NOYW1lXTtcblx0XHRcdGxldCByZXN1bHRDbGFzc05hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdFx0aWYgKCF0aGVtZUNsYXNzTmFtZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYENsYXNzIG5hbWU6ICcke2NsYXNzTmFtZX0nIG5vdCBmb3VuZCBpbiB0aGVtZWApO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pIHtcblx0XHRcdFx0cmVzdWx0Q2xhc3NOYW1lcy5wdXNoKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRDbGFzc05hbWVzLmpvaW4oJyAnKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIF9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpIHtcblx0XHRcdGNvbnN0IHsgdGhlbWUgPSB7fSB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuXHRcdFx0Y29uc3QgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XG5cdFx0XHRpZiAoIXRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSA9IGJhc2VUaGVtZXMucmVkdWNlKChmaW5hbEJhc2VUaGVtZSwgYmFzZVRoZW1lKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgeyBbVEhFTUVfS0VZXToga2V5LCAuLi5jbGFzc2VzIH0gPSBiYXNlVGhlbWU7XG5cdFx0XHRcdFx0dGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdHJldHVybiB7IC4uLmZpbmFsQmFzZVRoZW1lLCAuLi5jbGFzc2VzIH07XG5cdFx0XHRcdH0sIHt9KTtcblx0XHRcdFx0dGhpcy5fYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXAgPSBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoYmFzZVRoZW1lcyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3RoZW1lID0gdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucmVkdWNlKChiYXNlVGhlbWUsIHRoZW1lS2V5KSA9PiB7XG5cdFx0XHRcdHJldHVybiB7IC4uLmJhc2VUaGVtZSwgLi4udGhlbWVbdGhlbWVLZXldIH07XG5cdFx0XHR9LCB7fSk7XG5cblx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBUaGVtZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRoZW1lZE1peGluO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFRoZW1lZC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IHtcblx0Q29yZVByb3BlcnRpZXMsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFdOb2RlLFxuXHRQcm9qZWN0aW9uT3B0aW9ucyxcblx0UHJvamVjdGlvbixcblx0U3VwcG9ydGVkQ2xhc3NOYW1lLFxuXHRUcmFuc2l0aW9uU3RyYXRlZ3ksXG5cdFZOb2RlUHJvcGVydGllc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgZnJvbSBhcyBhcnJheUZyb20gfSBmcm9tICdAZG9qby9zaGltL2FycmF5JztcbmltcG9ydCB7IGlzV05vZGUsIGlzVk5vZGUsIFZOT0RFIH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5cbmNvbnN0IE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xuY29uc3QgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XG5jb25zdCBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XG5cbmNvbnN0IGVtcHR5QXJyYXk6IChJbnRlcm5hbFdOb2RlIHwgSW50ZXJuYWxWTm9kZSlbXSA9IFtdO1xuXG5leHBvcnQgdHlwZSBSZW5kZXJSZXN1bHQgPSBETm9kZTxhbnk+IHwgRE5vZGU8YW55PltdO1xuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsV05vZGUgZXh0ZW5kcyBXTm9kZTxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4ge1xuXHQvKipcblx0ICogVGhlIGluc3RhbmNlIG9mIHRoZSB3aWRnZXRcblx0ICovXG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZTtcblxuXHQvKipcblx0ICogVGhlIHJlbmRlcmVkIEROb2RlcyBmcm9tIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cmVuZGVyZWQ6IEludGVybmFsRE5vZGVbXTtcblxuXHQvKipcblx0ICogQ29yZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgYnkgdGhlIHdpZGdldCBjb3JlIHN5c3RlbVxuXHQgKi9cblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFdOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsVk5vZGUgZXh0ZW5kcyBWTm9kZSB7XG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFZOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbj86IEludGVybmFsRE5vZGVbXTtcblxuXHRpbnNlcnRlZD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEJhZyB1c2VkIHRvIHN0aWxsIGRlY29yYXRlIHByb3BlcnRpZXMgb24gYSBkZWZlcnJlZCBwcm9wZXJ0aWVzIGNhbGxiYWNrXG5cdCAqL1xuXHRkZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXM7XG5cblx0LyoqXG5cdCAqIERPTSBlbGVtZW50XG5cdCAqL1xuXHRkb21Ob2RlPzogRWxlbWVudCB8IFRleHQ7XG59XG5cbmV4cG9ydCB0eXBlIEludGVybmFsRE5vZGUgPSBJbnRlcm5hbFZOb2RlIHwgSW50ZXJuYWxXTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBXaWRnZXREYXRhIHtcblx0b25FbGVtZW50Q3JlYXRlZDogRnVuY3Rpb247XG5cdG9uRWxlbWVudFVwZGF0ZWQ6IEZ1bmN0aW9uO1xuXHRvbkRldGFjaDogKCkgPT4gdm9pZDtcblx0b25BdHRhY2g6ICgpID0+IHZvaWQ7XG5cdHBhcmVudEludmFsaWRhdGU/OiBGdW5jdGlvbjtcblx0ZGlydHk6IGJvb2xlYW47XG5cdHJlZ2lzdHJ5OiAoKSA9PiBSZWdpc3RyeUhhbmRsZXI7XG5cdG5vZGVIYW5kbGVyOiBOb2RlSGFuZGxlcjtcblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXHRpbnZhbGlkYXRlOiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IHdpZGdldEluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBXaWRnZXREYXRhPigpO1xuXG5mdW5jdGlvbiBzYW1lKGRub2RlMTogSW50ZXJuYWxETm9kZSwgZG5vZGUyOiBJbnRlcm5hbEROb2RlKSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlMSkgJiYgaXNWTm9kZShkbm9kZTIpKSB7XG5cdFx0aWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2UgaWYgKGlzV05vZGUoZG5vZGUxKSAmJiBpc1dOb2RlKGRub2RlMikpIHtcblx0XHRpZiAoZG5vZGUxLndpZGdldENvbnN0cnVjdG9yICE9PSBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGEgdHJhbnNpdGlvbnMgb2JqZWN0IHRvIHRoZSBwcm9qZWN0aW9uT3B0aW9ucyB0byBkbyBhbmltYXRpb25zJyk7XG59O1xuXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0b3JPcHRpb25zPzogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4pOiBQcm9qZWN0aW9uT3B0aW9ucyB7XG5cdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuXHRcdHN0eWxlQXBwbHllcjogZnVuY3Rpb24oZG9tTm9kZTogSFRNTEVsZW1lbnQsIHN0eWxlTmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0XHQoZG9tTm9kZS5zdHlsZSBhcyBhbnkpW3N0eWxlTmFtZV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdHRyYW5zaXRpb25zOiB7XG5cdFx0XHRlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXG5cdFx0XHRleGl0OiBtaXNzaW5nVHJhbnNpdGlvblxuXHRcdH0sXG5cdFx0ZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxuXHRcdGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcblx0XHRub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxuXHRcdG1lcmdlOiBmYWxzZVxuXHR9O1xuXHRyZXR1cm4geyAuLi5kZWZhdWx0cywgLi4ucHJvamVjdG9yT3B0aW9ucyB9IGFzIFByb2plY3Rpb25PcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZTogT2JqZWN0KSB7XG5cdGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVFdmVudHMoXG5cdGRvbU5vZGU6IE5vZGUsXG5cdHByb3BOYW1lOiBzdHJpbmcsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwcmV2aW91c1Byb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXNcbikge1xuXHRjb25zdCBwcmV2aW91cyA9IHByZXZpb3VzUHJvcGVydGllcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRjb25zdCBjdXJyZW50VmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0Y29uc3QgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzW3Byb3BOYW1lXTtcblxuXHRjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMik7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSkgfHwgbmV3IFdlYWtNYXAoKTtcblxuXHRpZiAocHJldmlvdXNWYWx1ZSkge1xuXHRcdGNvbnN0IHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XG5cdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XG5cdH1cblxuXHRsZXQgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXG5cdGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcblx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKHRoaXM6IGFueSwgZXZ0OiBFdmVudCkge1xuXHRcdFx0Y3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcblx0XHRcdChldnQudGFyZ2V0IGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IChldnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXHRcdH0uYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXHR9XG5cblx0ZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHRldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XG5cdHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcbn1cblxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlOiBFbGVtZW50LCBjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpIHtcblx0aWYgKGNsYXNzZXMpIHtcblx0XHRjb25zdCBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzc2VzKGRvbU5vZGU6IEVsZW1lbnQsIGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSkge1xuXHRpZiAoY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRkb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lc1tpXSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMoZG9tTm9kZTogRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcblx0XHRjb25zdCBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcblx0XHRsZXQgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpID8gcHJvcFZhbHVlIDogW3Byb3BWYWx1ZV07XG5cdFx0XHRpZiAoIShkb21Ob2RlIGFzIEVsZW1lbnQpLmNsYXNzTmFtZSkge1xuXHRcdFx0XHQoZG9tTm9kZSBhcyBFbGVtZW50KS5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKCcgJykudHJpbSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGFkZENsYXNzZXMoZG9tTm9kZSBhcyBFbGVtZW50LCBjdXJyZW50Q2xhc3Nlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xuXHRcdFx0Y29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG5cdFx0XHRjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuXHRcdFx0XHRjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuXHRcdFx0XHRjb25zdCBzdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGlmIChzdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBzdHlsZVZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgIT09ICdrZXknICYmIHByb3BWYWx1ZSAhPT0gbnVsbCAmJiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xuXHRcdFx0XHR1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICd2YWx1ZScgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XG5cdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgRWxlbWVudCkuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdHByZXZpb3VzUHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9uc1xuKSB7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSk7XG5cdGlmIChldmVudE1hcCkge1xuXHRcdE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcblx0XHRcdGlmIChwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XG5cdFx0XHRcdGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XG5cdFx0XHRcdGlmIChldmVudENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHByb3BOYW1lLnN1YnN0cigyKSwgZXZlbnRDYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRwcmV2aW91c1Byb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRsZXQgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGlmIChwcm9wTmFtZXMuaW5kZXhPZignY2xhc3NlcycpID09PSAtMSAmJiBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzW2ldKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcyk7XG5cdFx0fVxuXHR9XG5cblx0cmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuXHRcdGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0XHRjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzIVtwcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xuXHRcdFx0Y29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcblx0XHRcdGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IG5ld0NsYXNzZXM6IChudWxsIHwgdW5kZWZpbmVkIHwgc3RyaW5nKVtdID0gWy4uLmN1cnJlbnRDbGFzc2VzXTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV07XG5cdFx0XHRcdFx0XHRpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0YWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XG5cdFx0XHRjb25zdCBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcblx0XHRcdGNvbnN0IHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVDb3VudDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XG5cdFx0XHRcdGNvbnN0IG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0Y29uc3Qgb2xkU3R5bGVWYWx1ZSA9IHByZXZpb3VzVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0aWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdGlmIChuZXdTdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKG5ld1N0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIhKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIHN0eWxlTmFtZSwgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRwcm9wVmFsdWUgPSAnJztcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3ZhbHVlJykge1xuXHRcdFx0XHRjb25zdCBkb21WYWx1ZSA9IChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZG9tVmFsdWUgIT09IHByb3BWYWx1ZSAmJlxuXHRcdFx0XHRcdCgoZG9tTm9kZSBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ11cblx0XHRcdFx0XHRcdD8gZG9tVmFsdWUgPT09IChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXVxuXHRcdFx0XHRcdFx0OiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xuXHRcdFx0XHRjb25zdCB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDApIHtcblx0XHRcdFx0XHR1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBwcmV2aW91c1Byb3BlcnRpZXMpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJykge1xuXHRcdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdFx0ZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdyb2xlJyAmJiBwcm9wVmFsdWUgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShwcm9wTmFtZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRvbU5vZGUuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoKGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gQ29tcGFyaXNvbiBpcyBoZXJlIGZvciBzaWRlLWVmZmVjdHMgaW4gRWRnZSB3aXRoIHNjcm9sbExlZnQgYW5kIHNjcm9sbFRvcFxuXHRcdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sIHNhbWVBczogSW50ZXJuYWxETm9kZSwgc3RhcnQ6IG51bWJlcikge1xuXHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlOiBFbGVtZW50KTogSW50ZXJuYWxWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRjaGlsZHJlbjogdW5kZWZpbmVkLFxuXHRcdGRvbU5vZGUsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGE6IGFueSk6IEludGVybmFsVk5vZGUge1xuXHRyZXR1cm4ge1xuXHRcdHRhZzogJycsXG5cdFx0cHJvcGVydGllczoge30sXG5cdFx0Y2hpbGRyZW46IHVuZGVmaW5lZCxcblx0XHR0ZXh0OiBgJHtkYXRhfWAsXG5cdFx0ZG9tTm9kZTogdW5kZWZpbmVkLFxuXHRcdHR5cGU6IFZOT0RFXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGUgfCBETm9kZVtdLFxuXHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbik6IEludGVybmFsRE5vZGVbXSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGVtcHR5QXJyYXk7XG5cdH1cblx0Y2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKSB7XG5cdFx0Y29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXSBhcyBJbnRlcm5hbEROb2RlO1xuXHRcdGlmIChjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBudWxsKSB7XG5cdFx0XHRjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0aWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0KGNoaWxkLnByb3BlcnRpZXMgYXMgYW55KS5iaW5kID0gaW5zdGFuY2U7XG5cdFx0XHRcdFx0aWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghY2hpbGQuY29yZVByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdFx0XHRjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcblx0XHRcdFx0XHRcdGJpbmQ6IGluc3RhbmNlLFxuXHRcdFx0XHRcdFx0YmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpKys7XG5cdH1cblx0cmV0dXJuIGNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXTtcbn1cblxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlOiBJbnRlcm5hbEROb2RlLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvblN0cmF0ZWd5KSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XG5cdFx0Y29uc3QgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xuXHRcdGlmIChlbnRlckFuaW1hdGlvbikge1xuXHRcdFx0aWYgKHR5cGVvZiBlbnRlckFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJhbnNpdGlvbnMuZW50ZXIoZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbiBhcyBzdHJpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjYWxsT25EZXRhY2goZE5vZGVzOiBJbnRlcm5hbEROb2RlIHwgSW50ZXJuYWxETm9kZVtdLCBwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UpOiB2b2lkIHtcblx0ZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgZE5vZGUgPSBkTm9kZXNbaV07XG5cdFx0aWYgKGlzV05vZGUoZE5vZGUpKSB7XG5cdFx0XHRpZiAoZE5vZGUucmVuZGVyZWQpIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpITtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZE5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXSwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGU6IEludGVybmFsRE5vZGUsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uU3RyYXRlZ3ksIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJlZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgY2hpbGQgPSByZW5kZXJlZFtpXTtcblx0XHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRjaGlsZC5kb21Ob2RlIS5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChjaGlsZC5kb21Ob2RlISk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSBkbm9kZS5wcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IGV4aXRBbmltYXRpb24gPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XG5cdFx0aWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xuXHRcdFx0KGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cdFx0XHRjb25zdCByZW1vdmVEb21Ob2RlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0XHRcdH07XG5cdFx0XHRpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0ZXhpdEFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIHJlbW92ZURvbU5vZGUsIHByb3BlcnRpZXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiBhcyBzdHJpbmcsIHJlbW92ZURvbU5vZGUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja0Rpc3Rpbmd1aXNoYWJsZShcblx0Y2hpbGROb2RlczogSW50ZXJuYWxETm9kZVtdLFxuXHRpbmRleFRvQ2hlY2s6IG51bWJlcixcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pIHtcblx0Y29uc3QgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xuXHRpZiAoaXNWTm9kZShjaGlsZE5vZGUpICYmIGNoaWxkTm9kZS50YWcgPT09ICcnKSB7XG5cdFx0cmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxuXHR9XG5cdGNvbnN0IHsga2V5IH0gPSBjaGlsZE5vZGUucHJvcGVydGllcztcblxuXHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XG5cdFx0XHRcdGNvbnN0IG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XG5cdFx0XHRcdFx0bGV0IG5vZGVJZGVudGlmaWVyOiBzdHJpbmc7XG5cdFx0XHRcdFx0Y29uc3QgcGFyZW50TmFtZSA9IChwYXJlbnRJbnN0YW5jZSBhcyBhbnkpLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkTm9kZSkpIHtcblx0XHRcdFx0XHRcdG5vZGVJZGVudGlmaWVyID0gKGNoaWxkTm9kZS53aWRnZXRDb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdFx0YEEgd2lkZ2V0ICgke3BhcmVudE5hbWV9KSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50ICgke25vZGVJZGVudGlmaWVyfSkgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdG9sZENoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdG5ld0NoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0b2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xuXHRuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuXHRjb25zdCBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcblx0Y29uc3QgbmV3Q2hpbGRyZW5MZW5ndGggPSBuZXdDaGlsZHJlbi5sZW5ndGg7XG5cdGNvbnN0IHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnMhO1xuXG5cdGxldCBvbGRJbmRleCA9IDA7XG5cdGxldCBuZXdJbmRleCA9IDA7XG5cdGxldCBpOiBudW1iZXI7XG5cdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHR3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xuXHRcdGNvbnN0IG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcblxuXHRcdGlmIChvbGRDaGlsZCAhPT0gdW5kZWZpbmVkICYmIHNhbWUob2xkQ2hpbGQsIG5ld0NoaWxkKSkge1xuXHRcdFx0dGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcblx0XHRcdG9sZEluZGV4Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xuXHRcdFx0aWYgKGZpbmRPbGRJbmRleCA+PSAwKSB7XG5cdFx0XHRcdGZvciAoaSA9IG9sZEluZGV4OyBpIDwgZmluZE9sZEluZGV4OyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IGk7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGV4dFVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZURvbShvbGRDaGlsZHJlbltmaW5kT2xkSW5kZXhdLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHxcblx0XHRcdFx0XHR0ZXh0VXBkYXRlZDtcblx0XHRcdFx0b2xkSW5kZXggPSBmaW5kT2xkSW5kZXggKyAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdGxldCBjaGlsZDogSW50ZXJuYWxETm9kZSA9IG9sZENoaWxkcmVuW29sZEluZGV4XTtcblx0XHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdFx0bGV0IG5leHRJbmRleCA9IG9sZEluZGV4ICsgMTtcblx0XHRcdFx0XHR3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY2hpbGQucmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IGNoaWxkLnJlbmRlcmVkWzBdO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG9sZENoaWxkcmVuW25leHRJbmRleF0pIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IG9sZENoaWxkcmVuW25leHRJbmRleF07XG5cdFx0XHRcdFx0XHRcdFx0bmV4dEluZGV4Kys7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluc2VydEJlZm9yZSA9IGNoaWxkLmRvbU5vZGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3JlYXRlRG9tKG5ld0NoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcblx0XHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG5ld0NoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5ld0luZGV4Kys7XG5cdH1cblx0aWYgKG9sZENoaWxkcmVuTGVuZ3RoID4gb2xkSW5kZXgpIHtcblx0XHQvLyBSZW1vdmUgY2hpbGQgZnJhZ21lbnRzXG5cdFx0Zm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gaTtcblx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0Y2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fSk7XG5cdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0ZXh0VXBkYXRlZDtcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4oXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdIHwgdW5kZWZpbmVkLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0aW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcblx0Y2hpbGROb2Rlcz86IChFbGVtZW50IHwgVGV4dClbXVxuKSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdGNoaWxkTm9kZXMgPSBhcnJheUZyb20ocGFyZW50Vk5vZGUuZG9tTm9kZSEuY2hpbGROb2RlcykgYXMgKEVsZW1lbnQgfCBUZXh0KVtdO1xuXHR9XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cblx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzKSB7XG5cdFx0XHRcdGxldCBkb21FbGVtZW50OiBFbGVtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCkgYXMgRWxlbWVudDtcblx0XHRcdFx0XHRpZiAoZG9tRWxlbWVudCAmJiBkb21FbGVtZW50LnRhZ05hbWUgPT09IChjaGlsZC50YWcudG9VcHBlckNhc2UoKSB8fCB1bmRlZmluZWQpKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRkbm9kZTogSW50ZXJuYWxWTm9kZSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcblx0aWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG5cdHNldFByb3BlcnRpZXMoZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25FbGVtZW50Q3JlYXRlZChkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLmtleSEpO1xuXHRcdH0pO1xuXHR9XG5cdGRub2RlLmluc2VydGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRG9tKFxuXHRkbm9kZTogSW50ZXJuYWxETm9kZSxcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRjaGlsZE5vZGVzPzogKEVsZW1lbnQgfCBUZXh0KVtdXG4pIHtcblx0bGV0IGRvbU5vZGU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkO1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRsZXQgeyB3aWRnZXRDb25zdHJ1Y3RvciB9ID0gZG5vZGU7XG5cdFx0Y29uc3QgcGFyZW50SW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0aWYgKCFpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4od2lkZ2V0Q29uc3RydWN0b3IpKSB7XG5cdFx0XHRjb25zdCBpdGVtID0gcGFyZW50SW5zdGFuY2VEYXRhLnJlZ2lzdHJ5KCkuZ2V0PERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPih3aWRnZXRDb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoaXRlbSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR3aWRnZXRDb25zdHJ1Y3RvciA9IGl0ZW07XG5cdFx0fVxuXHRcdGNvbnN0IGluc3RhbmNlID0gbmV3IHdpZGdldENvbnN0cnVjdG9yKCk7XG5cdFx0ZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRpbnN0YW5jZURhdGEucGFyZW50SW52YWxpZGF0ZSA9IHBhcmVudEluc3RhbmNlRGF0YS5pbnZhbGlkYXRlO1xuXHRcdGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XG5cdFx0aW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcblx0XHRpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcblx0XHRpZiAocmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG5cdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XG5cdFx0XHRhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudDtcblx0XHRcdHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IHVuZGVmaW5lZDtcblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBkb2MgPSBwYXJlbnRWTm9kZS5kb21Ob2RlIS5vd25lckRvY3VtZW50O1xuXHRcdGlmIChkbm9kZS50YWcgPT09ICcnKSB7XG5cdFx0XHRpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnN0IG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUhLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0gfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChkbm9kZS50YWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcblx0XHRcdH1cblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEgYXMgRWxlbWVudCwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGRvbU5vZGUhLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUhKSB7XG5cdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVEb20oXG5cdHByZXZpb3VzOiBhbnksXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlLCByZW5kZXJlZDogcHJldmlvdXNSZW5kZXJlZCB9ID0gcHJldmlvdXM7XG5cdFx0aWYgKGluc3RhbmNlICYmIHByZXZpb3VzUmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcblx0XHRcdGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XG5cdFx0XHRpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRcdGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cdFx0XHRpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xuXHRcdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcblx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xuXHRcdFx0fVxuXHRcdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAocHJldmlvdXMgPT09IGRub2RlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnN0IGRvbU5vZGUgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xuXHRcdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHRcdGxldCB1cGRhdGVkID0gZmFsc2U7XG5cdFx0ZG5vZGUuaW5zZXJ0ZWQgPSBwcmV2aW91cy5pbnNlcnRlZDtcblx0XHRpZiAoZG5vZGUudGFnID09PSAnJykge1xuXHRcdFx0aWYgKGRub2RlLnRleHQgIT09IHByZXZpb3VzLnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGRvbU5vZGUucGFyZW50Tm9kZSEucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRvbU5vZGUpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcblx0XHRcdFx0dGV4dFVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSB9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZpb3VzLmNoaWxkcmVuICE9PSBkbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0ZG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdFx0dXBkYXRlZCA9XG5cdFx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVkID0gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcblxuXHRcdFx0aWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlRGF0YS5vbkVsZW1lbnRVcGRhdGVkKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMua2V5ISk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XG5cdFx0XHRkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlOiBJbnRlcm5hbFZOb2RlLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Ly8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xuXHR2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2shKCEhdm5vZGUuaW5zZXJ0ZWQpO1xuXHR2bm9kZS5wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzLCAuLi52bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgfTtcblx0cHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHtcblx0XHRcdC4uLnZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrISghIXZub2RlLmluc2VydGVkKSxcblx0XHRcdC4uLnZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllc1xuXHRcdH07XG5cdFx0dXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlISBhcyBFbGVtZW50LCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0dm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdGlvbihcblx0ZG5vZGU6IEludGVybmFsRE5vZGUgfCBJbnRlcm5hbEROb2RlW10sXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pOiBQcm9qZWN0aW9uIHtcblx0bGV0IHByb2plY3Rpb25ETm9kZSA9IEFycmF5LmlzQXJyYXkoZG5vZGUpID8gZG5vZGUgOiBbZG5vZGVdO1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSA9IGZhbHNlO1xuXHRyZXR1cm4ge1xuXHRcdHVwZGF0ZTogZnVuY3Rpb24odXBkYXRlZEROb2RlOiBSZW5kZXJSZXN1bHQpIHtcblx0XHRcdGxldCBkb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMucm9vdE5vZGU7XG5cblx0XHRcdHVwZGF0ZWRETm9kZSA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4odXBkYXRlZEROb2RlLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHR1cGRhdGVDaGlsZHJlbihcblx0XHRcdFx0dG9QYXJlbnRWTm9kZShkb21Ob2RlKSxcblx0XHRcdFx0cHJvamVjdGlvbkROb2RlLFxuXHRcdFx0XHR1cGRhdGVkRE5vZGUgYXMgSW50ZXJuYWxETm9kZVtdLFxuXHRcdFx0XHRwYXJlbnRJbnN0YW5jZSxcblx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnNcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0XHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRwcm9qZWN0aW9uRE5vZGUgPSB1cGRhdGVkRE5vZGUgYXMgSW50ZXJuYWxETm9kZVtdO1xuXHRcdH0sXG5cdFx0ZG9tTm9kZTogcHJvamVjdGlvbk9wdGlvbnMucm9vdE5vZGVcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGRvbSA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbihcblx0XHRkTm9kZTogUmVuZGVyUmVzdWx0LFxuXHRcdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0XHRwcm9qZWN0aW9uT3B0aW9ucz86IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+XG5cdCk6IFByb2plY3Rpb24ge1xuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRjb25zdCByb290Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuXHRcdGNvbnN0IGRlY29yYXRlZE5vZGUgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGROb2RlLCBpbnN0YW5jZSk7XG5cdFx0YWRkQ2hpbGRyZW4oXG5cdFx0XHR0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSksXG5cdFx0XHRkZWNvcmF0ZWROb2RlLFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2UsXG5cdFx0XHR1bmRlZmluZWRcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKGRlY29yYXRlZE5vZGUsIGluc3RhbmNlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHR9LFxuXHRhcHBlbmQ6IGZ1bmN0aW9uKFxuXHRcdHBhcmVudE5vZGU6IEVsZW1lbnQsXG5cdFx0ZE5vZGU6IFJlbmRlclJlc3VsdCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM/OiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPlxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRjb25zdCBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gcGFyZW50Tm9kZTtcblx0XHRjb25zdCBkZWNvcmF0ZWROb2RlID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkTm9kZSwgaW5zdGFuY2UpO1xuXHRcdGFkZENoaWxkcmVuKFxuXHRcdFx0dG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpLFxuXHRcdFx0ZGVjb3JhdGVkTm9kZSxcblx0XHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucyxcblx0XHRcdGluc3RhbmNlLFxuXHRcdFx0dW5kZWZpbmVkXG5cdFx0KTtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuXHRcdH0pO1xuXHRcdHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0cnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRyZXR1cm4gY3JlYXRlUHJvamVjdGlvbihkZWNvcmF0ZWROb2RlLCBpbnN0YW5jZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0fSxcblx0bWVyZ2U6IGZ1bmN0aW9uKFxuXHRcdGVsZW1lbnQ6IEVsZW1lbnQsXG5cdFx0ZE5vZGU6IFJlbmRlclJlc3VsdCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM/OiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPlxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShkTm9kZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIG1lcmdlIGFuIGFycmF5IG9mIG5vZGVzLiAoY29uc2lkZXIgYWRkaW5nIG9uZSBleHRyYSBsZXZlbCB0byB0aGUgdmlydHVhbCBET00pJyk7XG5cdFx0fVxuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRmaW5hbFByb2plY3Rvck9wdGlvbnMubWVyZ2UgPSB0cnVlO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZSBhcyBFbGVtZW50O1xuXHRcdGNvbnN0IGRlY29yYXRlZE5vZGUgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGROb2RlLCBpbnN0YW5jZSlbMF0gYXMgSW50ZXJuYWxWTm9kZTtcblx0XHRjcmVhdGVEb20oXG5cdFx0XHRkZWNvcmF0ZWROb2RlLFxuXHRcdFx0dG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2Vcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKGRlY29yYXRlZE5vZGUsIGluc3RhbmNlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHR9LFxuXHRyZXBsYWNlOiBmdW5jdGlvbihcblx0XHRlbGVtZW50OiBFbGVtZW50LFxuXHRcdGROb2RlOiBSZW5kZXJSZXN1bHQsXG5cdFx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRcdHByb2plY3Rpb25PcHRpb25zPzogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz5cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZE5vZGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdVbmFibGUgdG8gcmVwbGFjZSBhIG5vZGUgd2l0aCBhbiBhcnJheSBvZiBub2Rlcy4gKGNvbnNpZGVyIGFkZGluZyBvbmUgZXh0cmEgbGV2ZWwgdG8gdGhlIHZpcnR1YWwgRE9NKSdcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRjb25zdCBkZWNvcmF0ZWROb2RlID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkTm9kZSwgaW5zdGFuY2UpWzBdIGFzIEludGVybmFsVk5vZGU7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlISBhcyBFbGVtZW50O1xuXHRcdGNyZWF0ZURvbShcblx0XHRcdGRlY29yYXRlZE5vZGUsXG5cdFx0XHR0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSksXG5cdFx0XHRlbGVtZW50LFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2Vcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdGVsZW1lbnQucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdFx0cmV0dXJuIGNyZWF0ZVByb2plY3Rpb24oZGVjb3JhdGVkTm9kZSwgaW5zdGFuY2UsIGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdmRvbS50cyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAoc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gcnVudGltZSIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVpZGF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gcnVudGltZSJdLCJzb3VyY2VSb290IjoiIn0=