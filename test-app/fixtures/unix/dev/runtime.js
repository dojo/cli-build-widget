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
    ? isStaticFeatureFunction(staticFeatures)
        ? staticFeatures.apply(globalScope)
        : staticFeatures
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
                if (checkedProperties.indexOf(propertyName) > 0) {
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
            domNode.addEventListener('connected', function () {
                _this._widgetInstance = domNode.getWidgetInstance();
                _this.invalidate();
            });
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
        var elementChildren = array_1.from(element.children);
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
var registerCustomElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js");
/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
function customElement(_a) {
    var tag = _a.tag, properties = _a.properties, attributes = _a.attributes, events = _a.events, initialization = _a.initialization;
    return function (target) {
        if (true) {
            registerCustomElement_1.default(function () { return ({
                tagName: tag,
                widgetConstructor: target,
                attributes: (attributes || []).map(function (attributeName) { return ({ attributeName: attributeName }); }),
                properties: (properties || []).map(function (propertyName) { return ({ propertyName: propertyName }); }),
                events: (events || []).map(function (propertyName) { return ({
                    propertyName: propertyName,
                    eventName: propertyName.replace('on', '').toLowerCase()
                }); }),
                initialization: initialization
            }); });
        }
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
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var lang_2 = __webpack_require__("./node_modules/@dojo/core/lang.js");
__webpack_require__("./node_modules/pepjs/dist/pep.js");
var cssTransitions_1 = __webpack_require__("./node_modules/@dojo/widget-core/animations/cssTransitions.js");
var afterRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/afterRender.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var vdom_1 = __webpack_require__("./node_modules/@dojo/widget-core/vdom.js");
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
    AttachType[AttachType["Replace"] = 3] = "Replace";
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
            _this._projectorChildren = [];
            _this._projectorProperties = {};
            _this._handles = [];
            var instanceData = vdom_1.widgetInstanceMap.get(_this);
            instanceData.parentInvalidate = function () {
                _this.scheduleRender();
            };
            _this._projectionOptions = {
                transitions: cssTransitions_1.default
            };
            _this._boundDoRender = _this._doRender.bind(_this);
            _this._boundRender = _this.__render__.bind(_this);
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
        Projector.prototype.replace = function (root) {
            var options = {
                type: AttachType.Replace,
                root: root
            };
            return this._attach(options);
        };
        Projector.prototype.pause = function () {
            if (this._scheduled) {
                global_1.default.cancelAnimationFrame(this._scheduled);
                this._scheduled = undefined;
            }
            this._paused = true;
        };
        Projector.prototype.resume = function () {
            this._paused = false;
            this.scheduleRender();
        };
        Projector.prototype.scheduleRender = function () {
            if (this.projectorState === ProjectorAttachState.Attached) {
                this.__setProperties__(this._projectorProperties);
                this.__setChildren__(this._projectorChildren);
                this._renderState = 1;
                if (!this._scheduled && !this._paused) {
                    if (this._async) {
                        this._scheduled = global_1.default.requestAnimationFrame(this._boundDoRender);
                    }
                    else {
                        this._boundDoRender();
                    }
                }
            }
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
            this.scheduleRender();
        };
        Projector.prototype.__setChildren__ = function (children) {
            this._projectorChildren = tslib_1.__spread(children);
            _super.prototype.__setChildren__.call(this, children);
        };
        Projector.prototype.setProperties = function (properties) {
            this.__setProperties__(properties);
            this.scheduleRender();
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
        Projector.prototype._doRender = function () {
            this._scheduled = undefined;
            if (this._projection) {
                this._projection.update(this._boundRender());
            }
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
                    _this.pause();
                    _this._projection = undefined;
                    _this.projectorState = ProjectorAttachState.Detached;
                }
            };
            this.own(handle);
            this._attachHandle = lang_2.createHandle(handle);
            this._projectionOptions = tslib_1.__assign({}, this._projectionOptions, { sync: !this._async });
            switch (type) {
                case AttachType.Append:
                    this._projection = vdom_1.dom.append(this.root, this._boundRender(), this, this._projectionOptions);
                    break;
                case AttachType.Merge:
                    this._projection = vdom_1.dom.merge(this.root, this._boundRender(), this, this._projectionOptions);
                    break;
                case AttachType.Replace:
                    this._projection = vdom_1.dom.replace(this.root, this._boundRender(), this, this._projectionOptions);
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
        DomWrapper.prototype.onElementCreated = function (element, key) {
            options.onAttached && options.onAttached();
        };
        DomWrapper.prototype.render = function () {
            var properties = tslib_1.__assign({}, this.properties, { key: 'root' });
            return d_1.v(domNode.tagName, properties);
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

var apply = Function.prototype.apply;

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
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRGVzdHJveWFibGUudHMiLCJ3ZWJwYWNrOi8vL0V2ZW50ZWQudHMiLCJ3ZWJwYWNrOi8vL2FzcGVjdC50cyIsIndlYnBhY2s6Ly8vbGFuZy50cyIsIndlYnBhY2s6Ly8vaGFzLnRzIiwid2VicGFjazovLy9NYXAudHMiLCJ3ZWJwYWNrOi8vL1Byb21pc2UudHMiLCJ3ZWJwYWNrOi8vL1N5bWJvbC50cyIsIndlYnBhY2s6Ly8vV2Vha01hcC50cyIsIndlYnBhY2s6Ly8vYXJyYXkudHMiLCJ3ZWJwYWNrOi8vL2dsb2JhbC50cyIsIndlYnBhY2s6Ly8vaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL251bWJlci50cyIsIndlYnBhY2s6Ly8vb2JqZWN0LnRzIiwid2VicGFjazovLy9zdHJpbmcudHMiLCJ3ZWJwYWNrOi8vL3F1ZXVlLnRzIiwid2VicGFjazovLy91dGlsLnRzIiwid2VicGFjazovLy9JbmplY3Rvci50cyIsIndlYnBhY2s6Ly8vTm9kZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vL1JlZ2lzdHJ5LnRzIiwid2VicGFjazovLy9SZWdpc3RyeUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vL1dpZGdldEJhc2UudHMiLCJ3ZWJwYWNrOi8vL2Nzc1RyYW5zaXRpb25zLnRzIiwid2VicGFjazovLy9jdXN0b21FbGVtZW50cy50cyIsIndlYnBhY2s6Ly8vZC50cyIsIndlYnBhY2s6Ly8vYWZ0ZXJSZW5kZXIudHMiLCJ3ZWJwYWNrOi8vL2JlZm9yZVByb3BlcnRpZXMudHMiLCJ3ZWJwYWNrOi8vL2N1c3RvbUVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vL2RpZmZQcm9wZXJ0eS50cyIsIndlYnBhY2s6Ly8vaGFuZGxlRGVjb3JhdG9yLnRzIiwid2VicGFjazovLy9pbmplY3QudHMiLCJ3ZWJwYWNrOi8vL2RpZmYudHMiLCJ3ZWJwYWNrOi8vL1Byb2plY3Rvci50cyIsIndlYnBhY2s6Ly8vVGhlbWVkLnRzIiwid2VicGFjazovLy9yZWdpc3RlckN1c3RvbUVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vL0RvbVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vL3Zkb20udHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFFQTs7O0FBR0E7SUFDQyxPQUFPLGlCQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM5QjtBQUVBOzs7QUFHQTtJQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUM7QUFDakQ7QUFFQTtJQU1DOzs7SUFHQTtRQUNDLElBQUksQ0FBQyxRQUFPLEVBQUcsRUFBRTtJQUNsQjtJQUVBOzs7Ozs7SUFNQSwwQkFBRyxFQUFILFVBQUksTUFBYztRQUNULDBCQUFPO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTztZQUNOLE9BQU87Z0JBQ04sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN2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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlCQUF5QiwyQ0FBMkM7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseUJBQXlCLDJDQUEyQzs7QUFFcEU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckIsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsd0JBQXdCO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLHlCQUF5QixFQUFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsdUJBQXVCOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0NBQXdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUNBQXlDLHdCQUF3QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDLEc7Ozs7Ozs7QUNoOENEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7O0FDdkx0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDIiwiZmlsZSI6InJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIYW5kbGUgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2NvcmUnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcblxuLyoqXG4gKiBObyBvcGVyYXRpb24gZnVuY3Rpb24gdG8gcmVwbGFjZSBvd24gb25jZSBpbnN0YW5jZSBpcyBkZXN0b3J5ZWRcbiAqL1xuZnVuY3Rpb24gbm9vcCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG59O1xuXG4vKipcbiAqIE5vIG9wIGZ1bmN0aW9uIHVzZWQgdG8gcmVwbGFjZSBvd24sIG9uY2UgaW5zdGFuY2UgaGFzIGJlZW4gZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3llZCgpOiBuZXZlciB7XG5cdHRocm93IG5ldyBFcnJvcignQ2FsbCBtYWRlIHRvIGRlc3Ryb3llZCBtZXRob2QnKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBEZXN0cm95YWJsZSB7XG5cdC8qKlxuXHQgKiByZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdHByaXZhdGUgaGFuZGxlczogSGFuZGxlW107XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5oYW5kbGVzID0gW107XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcblx0ICpcblx0ICogQHBhcmFtIHtIYW5kbGV9IGhhbmRsZSBUaGUgaGFuZGxlIHRvIGFkZCBmb3IgdGhlIGluc3RhbmNlXG5cdCAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxuXHQgKi9cblx0b3duKGhhbmRsZTogSGFuZGxlKTogSGFuZGxlIHtcblx0XHRjb25zdCB7IGhhbmRsZXMgfSA9IHRoaXM7XG5cdFx0aGFuZGxlcy5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRcdGhhbmRsZXMuc3BsaWNlKGhhbmRsZXMuaW5kZXhPZihoYW5kbGUpKTtcblx0XHRcdFx0aGFuZGxlLmRlc3Ryb3koKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnl9IGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIGhhbmRsZXMgaGF2ZSBiZWVuIGRlc3Ryb3llZFxuXHQgKi9cblx0ZGVzdHJveSgpOiBQcm9taXNlPGFueT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0dGhpcy5oYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4ge1xuXHRcdFx0XHRoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5kZXN0cm95ID0gbm9vcDtcblx0XHRcdHRoaXMub3duID0gZGVzdHJveWVkO1xuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXN0cm95YWJsZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEZXN0cm95YWJsZS50cyIsImltcG9ydCB7IEFjdGlvbmFibGUgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2FiaWxpdGllcyc7XG5pbXBvcnQgeyBFdmVudGVkTGlzdGVuZXIsIEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXksIEV2ZW50ZWRMaXN0ZW5lcnNNYXAgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2Jhc2VzJztcbmltcG9ydCB7IEV2ZW50VGFyZ2V0dGVkT2JqZWN0LCBFdmVudEVycm9yT2JqZWN0LCBIYW5kbGUgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2NvcmUnO1xuaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgeyBvbiBhcyBhc3BlY3RPbiB9IGZyb20gJy4vYXNwZWN0JztcbmltcG9ydCB7IERlc3Ryb3lhYmxlIH0gZnJvbSAnLi9EZXN0cm95YWJsZSc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpcyB0aGUgdmFsdWUgaXMgQWN0aW9uYWJsZSAoaGFzIGEgYC5kb2AgZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlzIHRoZSB2YWx1ZSBpcyBBY3Rpb25hYmxlXG4gKi9cbmZ1bmN0aW9uIGlzQWN0aW9uYWJsZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgQWN0aW9uYWJsZTxhbnksIGFueT4ge1xuXHRyZXR1cm4gQm9vbGVhbih2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuZG8gPT09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIFJlc29sdmUgbGlzdGVuZXJzLlxuICovXG5mdW5jdGlvbiByZXNvbHZlTGlzdGVuZXI8VCwgRSBleHRlbmRzIEV2ZW50VGFyZ2V0dGVkT2JqZWN0PFQ+PihsaXN0ZW5lcjogRXZlbnRlZExpc3RlbmVyPFQsIEU+KTogRXZlbnRlZENhbGxiYWNrPEU+IHtcblx0cmV0dXJuIGlzQWN0aW9uYWJsZShsaXN0ZW5lcikgPyAoZXZlbnQ6IEUpID0+IGxpc3RlbmVyLmRvKHsgZXZlbnQgfSkgOiBsaXN0ZW5lcjtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIGFuIGFycmF5IG9mIGhhbmRsZXNcbiAqXG4gKiBAcGFyYW0gaGFuZGxlcyBhbiBhcnJheSBvZiBoYW5kbGVzXG4gKiBAcmV0dXJucyBhIHNpbmdsZSBIYW5kbGUgZm9yIGhhbmRsZXMgcGFzc2VkXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXM6IEhhbmRsZVtdKTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95KCkge1xuXHRcdFx0aGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZS5kZXN0cm95KCkpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBldmVudCBvYmplY3QsIHdoaWNoIHByb3ZpZGVzIGEgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRPYmplY3Qge1xuXHQvKipcblx0ICogVGhlIHR5cGUgb2YgdGhlIGV2ZW50XG5cdCAqL1xuXHRyZWFkb25seSB0eXBlOiBzdHJpbmcgfCBzeW1ib2w7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRlZENhbGxiYWNrPEUgZXh0ZW5kcyBFdmVudE9iamVjdD4ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayB0aGF0IHRha2VzIGFuIGBldmVudGAgYXJndW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBvYmplY3Rcblx0ICovXG5cdChldmVudDogRSk6IGJvb2xlYW4gfCB2b2lkO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgRXZlbnRlZCBjb25zdHJ1Y3RvciBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRlZE9wdGlvbnMge1xuXHQvKipcblx0ICogT3B0aW9uYWwgbGlzdGVuZXJzIHRvIGFkZFxuXHQgKi9cblx0bGlzdGVuZXJzPzogRXZlbnRlZExpc3RlbmVyc01hcDxhbnk+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VFdmVudGVkRXZlbnRzIHtcblx0LyoqXG5cdCAqIFJlZ3Npc3RlciBhIGNhbGxiYWNrIGZvciBhIHNwZWNpZmljIGV2ZW50IHR5cGVcblx0ICpcblx0ICogQHBhcmFtIGxpc3RlbmVycyBtYXAgb2YgbGlzdGVuZXJzXG5cdCAqL1xuXHQobGlzdGVuZXJzOiBFdmVudGVkTGlzdGVuZXJzTWFwPEV2ZW50ZWQ+KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0gdHlwZSB0aGUgdHlwZSBvZiB0aGUgZXZlbnRcblx0ICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhdHRhY2hcblx0ICovXG5cdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiBFdmVudGVkTGlzdGVuZXJPckFycmF5PEV2ZW50ZWQsIEV2ZW50VGFyZ2V0dGVkT2JqZWN0PEV2ZW50ZWQ+Pik6IEhhbmRsZTtcblxuXHQvKipcblx0ICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgZm9yIGBlcnJvcmBcblx0ICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhdHRhY2hcblx0ICovXG5cdCh0eXBlOiAnZXJyb3InLCBsaXN0ZW5lcjogRXZlbnRlZExpc3RlbmVyT3JBcnJheTxFdmVudGVkLCBFdmVudEVycm9yT2JqZWN0PEV2ZW50ZWQ+Pik6IEhhbmRsZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudGVkIHtcblx0b246IEJhc2VFdmVudGVkRXZlbnRzO1xufVxuXG4vKipcbiAqIE1hcCBvZiBjb21wdXRlZCByZWd1bGFyIGV4cHJlc3Npb25zLCBrZXllZCBieSBzdHJpbmdcbiAqL1xuY29uc3QgcmVnZXhNYXAgPSBuZXcgTWFwPHN0cmluZywgUmVnRXhwPigpO1xuXG4vKipcbiAqIERldGVybWluZXMgaXMgdGhlIGV2ZW50IHR5cGUgZ2xvYiBoYXMgYmVlbiBtYXRjaGVkXG4gKlxuICogQHJldHVybnMgYm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgZ2xvYiBpcyBtYXRjaGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JNYXRjaChnbG9iU3RyaW5nOiBzdHJpbmcgfCBzeW1ib2wsIHRhcmdldFN0cmluZzogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG5cdGlmICh0eXBlb2YgdGFyZ2V0U3RyaW5nID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgZ2xvYlN0cmluZyA9PT0gJ3N0cmluZycgJiYgZ2xvYlN0cmluZy5pbmRleE9mKCcqJykgIT09IC0xKSB7XG5cdFx0bGV0IHJlZ2V4OiBSZWdFeHA7XG5cdFx0aWYgKHJlZ2V4TWFwLmhhcyhnbG9iU3RyaW5nKSkge1xuXHRcdFx0cmVnZXggPSByZWdleE1hcC5nZXQoZ2xvYlN0cmluZykhO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7IGdsb2JTdHJpbmcucmVwbGFjZSgvXFwqL2csICcuKicpIH0kYCk7XG5cdFx0XHRyZWdleE1hcC5zZXQoZ2xvYlN0cmluZywgcmVnZXgpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVnZXgudGVzdCh0YXJnZXRTdHJpbmcpO1xuXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcblx0fVxufVxuXG4vKipcbiAqIEV2ZW50IENsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudGVkIGV4dGVuZHMgRGVzdHJveWFibGUgaW1wbGVtZW50cyBFdmVudGVkIHtcblxuXHQvKipcblx0ICogbWFwIG9mIGxpc3RlbmVycyBrZXllZCBieSBldmVudCB0eXBlXG5cdCAqL1xuXHRwcm90ZWN0ZWQgbGlzdGVuZXJzTWFwOiBNYXA8c3RyaW5nLCBFdmVudGVkQ2FsbGJhY2s8RXZlbnRPYmplY3Q+PiA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudGVkQ2FsbGJhY2s8RXZlbnRPYmplY3Q+PigpO1xuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIG9wdGlvbnMgVGhlIGNvbnN0cnVjdG9yIGFyZ3VybWVudHNcblx0ICovXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IEV2ZW50ZWRPcHRpb25zID0ge30pIHtcblx0XHRzdXBlcigpO1xuXHRcdGNvbnN0IHsgbGlzdGVuZXJzIH0gPSBvcHRpb25zO1xuXHRcdGlmIChsaXN0ZW5lcnMpIHtcblx0XHRcdHRoaXMub3duKHRoaXMub24obGlzdGVuZXJzKSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEVtaXRzIHRoZSBldmVudCBvYmpldCBmb3IgdGhlIHNwZWNpZmllZCB0eXBlXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudCB0aGUgZXZlbnQgdG8gZW1pdFxuXHQgKi9cblx0ZW1pdDxFIGV4dGVuZHMgRXZlbnRPYmplY3Q+KGV2ZW50OiBFKTogdm9pZCB7XG5cdFx0dGhpcy5saXN0ZW5lcnNNYXAuZm9yRWFjaCgobWV0aG9kLCB0eXBlKSA9PiB7XG5cdFx0XHRpZiAoaXNHbG9iTWF0Y2godHlwZSwgZXZlbnQudHlwZSkpIHtcblx0XHRcdFx0bWV0aG9kLmNhbGwodGhpcywgZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhdGNoIGFsbCBoYW5kbGVyIGZvciB2YXJpb3VzIGNhbGwgc2lnbmF0dXJlcy4gVGhlIHNpZ25hdHVyZXMgYXJlIGRlZmluZWQgaW5cblx0ICogYEJhc2VFdmVudGVkRXZlbnRzYC4gIFlvdSBjYW4gYWRkIHlvdXIgb3duIGV2ZW50IHR5cGUgLT4gaGFuZGxlciB0eXBlcyBieSBleHRlbmRpbmdcblx0ICogYEJhc2VFdmVudGVkRXZlbnRzYC4gIFNlZSBleGFtcGxlIGZvciBkZXRhaWxzLlxuXHQgKlxuXHQgKiBAcGFyYW0gYXJnc1xuXHQgKlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiBpbnRlcmZhY2UgV2lkZ2V0QmFzZUV2ZW50cyBleHRlbmRzIEJhc2VFdmVudGVkRXZlbnRzIHtcblx0ICogICAgICh0eXBlOiAncHJvcGVydGllczpjaGFuZ2VkJywgaGFuZGxlcjogUHJvcGVydGllc0NoYW5nZWRIYW5kbGVyKTogSGFuZGxlO1xuXHQgKiB9XG5cdCAqIGNsYXNzIFdpZGdldEJhc2UgZXh0ZW5kcyBFdmVudGVkIHtcblx0ICogICAgb246IFdpZGdldEJhc2VFdmVudHM7XG5cdCAqIH1cblx0ICpcblx0ICogQHJldHVybiB7YW55fVxuXHQgKi9cblx0b246IEJhc2VFdmVudGVkRXZlbnRzID0gZnVuY3Rpb24gKHRoaXM6IEV2ZW50ZWQsIC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRjb25zdCBbIHR5cGUsIGxpc3RlbmVycyBdID0gPFsgc3RyaW5nLCBFdmVudGVkTGlzdGVuZXJPckFycmF5PGFueSwgRXZlbnRUYXJnZXR0ZWRPYmplY3Q8YW55Pj5dPiBhcmdzO1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGVzID0gbGlzdGVuZXJzLm1hcCgobGlzdGVuZXIpID0+IGFzcGVjdE9uKHRoaXMubGlzdGVuZXJzTWFwLCB0eXBlLCByZXNvbHZlTGlzdGVuZXIobGlzdGVuZXIpKSk7XG5cdFx0XHRcdHJldHVybiBoYW5kbGVzQXJyYXl0b0hhbmRsZShoYW5kbGVzKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYXNwZWN0T24odGhpcy5saXN0ZW5lcnNNYXAsIHR5cGUsIHJlc29sdmVMaXN0ZW5lcihsaXN0ZW5lcnMpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcblx0XHRcdGNvbnN0IFsgbGlzdGVuZXJNYXBBcmcgXSA9IDxbRXZlbnRlZExpc3RlbmVyc01hcDxhbnk+XT4gYXJncztcblx0XHRcdGNvbnN0IGhhbmRsZXMgPSBPYmplY3Qua2V5cyhsaXN0ZW5lck1hcEFyZykubWFwKCh0eXBlKSA9PiB0aGlzLm9uKHR5cGUsIGxpc3RlbmVyTWFwQXJnW3R5cGVdKSk7XG5cdFx0XHRyZXR1cm4gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlcyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudHMnKTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50ZWQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRXZlbnRlZC50cyIsImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2ludGVyZmFjZXMvY29yZSc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgY3JlYXRlSGFuZGxlIH0gZnJvbSAnLi9sYW5nJztcblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCBwcm92aWRlcyB0aGUgbmVjZXNzYXJ5IEFQSXMgdG8gYmUgTWFwTGlrZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hcExpa2U8SywgVj4ge1xuXHRnZXQoa2V5OiBLKTogVjtcblx0c2V0KGtleTogSywgdmFsdWU/OiBWKTogdGhpcztcbn1cblxuLyoqXG4gKiBBbiBpbnRlcm5hbCB0eXBlIGd1YXJkIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiB2YWx1ZSBpcyBNYXBMaWtlIG9yIG5vdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ3VhcmQgYWdhaW5zdFxuICovXG5mdW5jdGlvbiBpc01hcExpa2UodmFsdWU6IGFueSk6IHZhbHVlIGlzIE1hcExpa2U8YW55LCBhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5nZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlLnNldCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRleGFibGUge1xuXHRbbWV0aG9kOiBzdHJpbmddOiBhbnk7XG59XG5cbi8qKlxuICogVGhlIHR5cGVzIG9mIG9iamVjdHMgb3IgbWFwcyB3aGVyZSBhZHZpY2UgY2FuIGJlIGFwcGxpZWRcbiAqL1xuZXhwb3J0IHR5cGUgVGFyZ2V0YWJsZSA9IE1hcExpa2U8c3RyaW5nLCBhbnk+IHwgSW5kZXhhYmxlO1xuXG50eXBlIEFkdmljZVR5cGUgPSAnYmVmb3JlJyB8ICdhZnRlcicgfCAnYXJvdW5kJztcblxuLyoqXG4gKiBBIG1ldGEgZGF0YSBzdHJ1Y3R1cmUgd2hlbiBhcHBseWluZyBhZHZpY2VcbiAqL1xuaW50ZXJmYWNlIEFkdmlzZWQge1xuXHRyZWFkb25seSBpZD86IG51bWJlcjtcblx0YWR2aWNlPzogRnVuY3Rpb247XG5cdHByZXZpb3VzPzogQWR2aXNlZDtcblx0bmV4dD86IEFkdmlzZWQ7XG5cdHJlYWRvbmx5IHJlY2VpdmVBcmd1bWVudHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIGFkdmljZSB3aGljaCBpcyBkZWNvcmF0ZWQgd2l0aCBhZGRpdGlvbmFsXG4gKiBtZXRhIGRhdGEgYWJvdXQgdGhlIGFkdmljZSB0byBhcHBseVxuICovXG5pbnRlcmZhY2UgRGlzcGF0Y2hlciB7XG5cdFsgdHlwZTogc3RyaW5nIF06IEFkdmlzZWQgfCB1bmRlZmluZWQ7XG5cdCgpOiBhbnk7XG5cdHRhcmdldDogYW55O1xuXHRiZWZvcmU/OiBBZHZpc2VkO1xuXHRhcm91bmQ/OiBBZHZpc2VkO1xuXHRhZnRlcj86IEFkdmlzZWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm9pblBvaW50RGlzcGF0Y2hBZHZpY2U8VD4ge1xuXHRiZWZvcmU/OiBKb2luUG9pbnRCZWZvcmVBZHZpY2VbXTtcblx0YWZ0ZXI/OiBKb2luUG9pbnRBZnRlckFkdmljZTxUPltdO1xuXHRyZWFkb25seSBqb2luUG9pbnQ6IEZ1bmN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+IHtcblx0LyoqXG5cdCAqIEFkdmljZSB3aGljaCBpcyBhcHBsaWVkICphZnRlciosIHJlY2VpdmluZyB0aGUgcmVzdWx0IGFuZCBhcmd1bWVudHMgZnJvbSB0aGUgam9pbiBwb2ludC5cblx0ICpcblx0ICogQHBhcmFtIHJlc3VsdCBUaGUgcmVzdWx0IGZyb20gdGhlIGZ1bmN0aW9uIGJlaW5nIGFkdmlzZWRcblx0ICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgc3VwcGxpZWQgdG8gdGhlIGFkdmlzZWQgZnVuY3Rpb25cblx0ICogQHJldHVybnMgVGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIGFkdmljZSBpcyB0aGVuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgbWV0aG9kXG5cdCAqL1xuXHQocmVzdWx0OiBULCAuLi5hcmdzOiBhbnlbXSk6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+IHtcblx0LyoqXG5cdCAqIEFkdmljZSB3aGljaCBpcyBhcHBsaWVkICphcm91bmQqLiAgVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiBhbmRcblx0ICogbmVlZHMgdG8gcmV0dXJuIGEgbmV3IGZ1bmN0aW9uIHdoaWNoIHdpbGwgdGhlbiBpbnZva2UgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb3JpZ0ZuIFRoZSBvcmlnaW5hbCBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyBBIG5ldyBmdW5jdGlvbiB3aGljaCB3aWxsIGludm9rZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG5cdCAqL1xuXHQob3JpZ0ZuOiBHZW5lcmljRnVuY3Rpb248VD4pOiAoLi4uYXJnczogYW55W10pID0+IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm9pblBvaW50QmVmb3JlQWR2aWNlIHtcblx0LyoqXG5cdCAqIEFkdmljZSB3aGljaCBpcyBhcHBsaWVkICpiZWZvcmUqLCByZWNlaXZpbmcgdGhlIG9yaWdpbmFsIGFyZ3VtZW50cywgaWYgdGhlIGFkdmlzaW5nXG5cdCAqIGZ1bmN0aW9uIHJldHVybnMgYSB2YWx1ZSwgaXQgaXMgcGFzc2VkIGZ1cnRoZXIgYWxvbmcgdGFraW5nIHRoZSBwbGFjZSBvZiB0aGUgb3JpZ2luYWxcblx0ICogYXJndW1lbnRzLlxuXHQgKlxuXHQgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRoZSBtZXRob2Qgd2FzIGNhbGxlZCB3aXRoXG5cdCAqL1xuXHQoLi4uYXJnczogYW55W10pOiBhbnlbXSB8IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY0Z1bmN0aW9uPFQ+IHtcblx0KC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuLyoqXG4gKiBBIHdlYWsgbWFwIG9mIGRpc3BhdGNoZXJzIHVzZWQgdG8gYXBwbHkgdGhlIGFkdmljZVxuICovXG5jb25zdCBkaXNwYXRjaEFkdmljZU1hcCA9IG5ldyBXZWFrTWFwPEZ1bmN0aW9uLCBKb2luUG9pbnREaXNwYXRjaEFkdmljZTxhbnk+PigpO1xuXG4vKipcbiAqIEEgVUlEIGZvciB0cmFja2luZyBhZHZpY2Ugb3JkZXJpbmdcbiAqL1xubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBhZHZpc2VzIGEgam9pbiBwb2ludFxuICpcbiAqIEBwYXJhbSBkaXNwYXRjaGVyIFRoZSBjdXJyZW50IGFkdmljZSBkaXNwYXRjaGVyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBiZWZvcmUgb3IgYWZ0ZXIgYWR2aWNlIHRvIGFwcGx5XG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhZHZpY2UgdG8gYXBwbHlcbiAqIEBwYXJhbSByZWNlaXZlQXJndW1lbnRzIElmIHRydWUsIHRoZSBhZHZpY2Ugd2lsbCByZWNlaXZlIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBqb2luIHBvaW50XG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgdGhhdCB3aWxsIHJlbW92ZSB0aGUgYWR2aWNlXG4gKi9cbmZ1bmN0aW9uIGFkdmlzZU9iamVjdChcblx0ZGlzcGF0Y2hlcjogRGlzcGF0Y2hlciB8IHVuZGVmaW5lZCxcblx0dHlwZTogQWR2aWNlVHlwZSxcblx0YWR2aWNlOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0cmVjZWl2ZUFyZ3VtZW50cz86IGJvb2xlYW5cbik6IEhhbmRsZSB7XG5cdGxldCBwcmV2aW91cyA9IGRpc3BhdGNoZXIgJiYgZGlzcGF0Y2hlclt0eXBlXTtcblx0bGV0IGFkdmlzZWQ6IEFkdmlzZWQgfCB1bmRlZmluZWQgPSB7XG5cdFx0aWQ6IG5leHRJZCsrLFxuXHRcdGFkdmljZTogYWR2aWNlLFxuXHRcdHJlY2VpdmVBcmd1bWVudHM6IHJlY2VpdmVBcmd1bWVudHNcblx0fTtcblxuXHRpZiAocHJldmlvdXMpIHtcblx0XHRpZiAodHlwZSA9PT0gJ2FmdGVyJykge1xuXHRcdFx0Ly8gYWRkIHRoZSBsaXN0ZW5lciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG5cdFx0XHQvLyBub3RlIHRoYXQgd2UgaGFkIHRvIGNoYW5nZSB0aGlzIGxvb3AgYSBsaXR0bGUgYml0IHRvIHdvcmthcm91bmQgYSBiaXphcnJlIElFMTAgSklUIGJ1Z1xuXHRcdFx0d2hpbGUgKHByZXZpb3VzLm5leHQgJiYgKHByZXZpb3VzID0gcHJldmlvdXMubmV4dCkpIHt9XG5cdFx0XHRwcmV2aW91cy5uZXh0ID0gYWR2aXNlZDtcblx0XHRcdGFkdmlzZWQucHJldmlvdXMgPSBwcmV2aW91cztcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBhZGQgdG8gdGhlIGJlZ2lubmluZ1xuXHRcdFx0aWYgKGRpc3BhdGNoZXIpIHtcblx0XHRcdFx0ZGlzcGF0Y2hlci5iZWZvcmUgPSBhZHZpc2VkO1xuXHRcdFx0fVxuXHRcdFx0YWR2aXNlZC5uZXh0ID0gcHJldmlvdXM7XG5cdFx0XHRwcmV2aW91cy5wcmV2aW91cyA9IGFkdmlzZWQ7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoZXIgJiYgKGRpc3BhdGNoZXJbdHlwZV0gPSBhZHZpc2VkKTtcblx0fVxuXG5cdGFkdmljZSA9IHByZXZpb3VzID0gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuXHRcdGxldCB7IHByZXZpb3VzID0gdW5kZWZpbmVkLCBuZXh0ID0gdW5kZWZpbmVkIH0gPSAoYWR2aXNlZCB8fCB7fSk7XG5cblx0XHRpZiAoZGlzcGF0Y2hlciAmJiAhcHJldmlvdXMgJiYgIW5leHQpIHtcblx0XHRcdGRpc3BhdGNoZXJbdHlwZV0gPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHByZXZpb3VzKSB7XG5cdFx0XHRcdHByZXZpb3VzLm5leHQgPSBuZXh0O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRpc3BhdGNoZXIgJiYgKGRpc3BhdGNoZXJbdHlwZV0gPSBuZXh0KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG5leHQpIHtcblx0XHRcdFx0bmV4dC5wcmV2aW91cyA9IHByZXZpb3VzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYWR2aXNlZCkge1xuXHRcdFx0ZGVsZXRlIGFkdmlzZWQuYWR2aWNlO1xuXHRcdH1cblx0XHRkaXNwYXRjaGVyID0gYWR2aXNlZCA9IHVuZGVmaW5lZDtcblx0fSk7XG59XG5cbi8qKlxuICogQWR2aXNlIGEgam9pbiBwb2ludCAoZnVuY3Rpb24pIHdpdGggc3VwcGxpZWQgYWR2aWNlXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBUaGUgZnVuY3Rpb24gdG8gYmUgYWR2aXNlZFxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgYWR2aWNlIHRvIGJlIGFwcGxpZWRcbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFkdmljZSB0byBhcHBseVxuICovXG5mdW5jdGlvbiBhZHZpc2VKb2luUG9pbnQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4odGhpczogYW55LCBqb2luUG9pbnQ6IEYsIHR5cGU6IEFkdmljZVR5cGUsIGFkdmljZTogSm9pblBvaW50QmVmb3JlQWR2aWNlIHwgSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4gfCBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4pOiBGIHtcblx0bGV0IGRpc3BhdGNoZXI6IEY7XG5cdGlmICh0eXBlID09PSAnYXJvdW5kJykge1xuXHRcdGRpc3BhdGNoZXIgPSBnZXRKb2luUG9pbnREaXNwYXRjaGVyKGFkdmljZS5hcHBseSh0aGlzLCBbIGpvaW5Qb2ludCBdKSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hlciA9IGdldEpvaW5Qb2ludERpc3BhdGNoZXIoam9pblBvaW50KTtcblx0XHQvLyBjYW5ub3QgaGF2ZSB1bmRlZmluZWQgaW4gbWFwIGR1ZSB0byBjb2RlIGxvZ2ljLCB1c2luZyAhXG5cdFx0Y29uc3QgYWR2aWNlTWFwID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGRpc3BhdGNoZXIpITtcblx0XHRpZiAodHlwZSA9PT0gJ2JlZm9yZScpIHtcblx0XHRcdChhZHZpY2VNYXAuYmVmb3JlIHx8IChhZHZpY2VNYXAuYmVmb3JlID0gW10pKS51bnNoaWZ0KDxKb2luUG9pbnRCZWZvcmVBZHZpY2U+IGFkdmljZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0KGFkdmljZU1hcC5hZnRlciB8fCAoYWR2aWNlTWFwLmFmdGVyID0gW10pKS5wdXNoKGFkdmljZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgb3IgY3JlYXRlcyB0aGUgZGlzcGF0Y2hlciBmb3IgYSBnaXZlbiBqb2luIHBvaW50XG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvciBtYXBcbiAqIEBwYXJhbSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdGhhdCB0aGUgZGlzcGF0Y2hlciBzaG91bGQgYmUgcmVzb2x2ZWQgZm9yXG4gKiBAcmV0dXJuIFRoZSBkaXNwYXRjaGVyXG4gKi9cbmZ1bmN0aW9uIGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcpOiBEaXNwYXRjaGVyIHtcblx0Y29uc3QgZXhpc3RpbmcgPSBpc01hcExpa2UodGFyZ2V0KSA/IHRhcmdldC5nZXQobWV0aG9kTmFtZSkgOiB0YXJnZXQgJiYgdGFyZ2V0W21ldGhvZE5hbWVdO1xuXHRsZXQgZGlzcGF0Y2hlcjogRGlzcGF0Y2hlcjtcblxuXHRpZiAoIWV4aXN0aW5nIHx8IGV4aXN0aW5nLnRhcmdldCAhPT0gdGFyZ2V0KSB7XG5cdFx0LyogVGhlcmUgaXMgbm8gZXhpc3RpbmcgZGlzcGF0Y2hlciwgdGhlcmVmb3JlIHdlIHdpbGwgY3JlYXRlIG9uZSAqL1xuXHRcdGRpc3BhdGNoZXIgPSA8RGlzcGF0Y2hlcj4gZnVuY3Rpb24gKHRoaXM6IERpc3BhdGNoZXIpOiBhbnkge1xuXHRcdFx0bGV0IGV4ZWN1dGlvbklkID0gbmV4dElkO1xuXHRcdFx0bGV0IGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsZXQgcmVzdWx0czogYW55O1xuXHRcdFx0bGV0IGJlZm9yZSA9IGRpc3BhdGNoZXIuYmVmb3JlO1xuXG5cdFx0XHR3aGlsZSAoYmVmb3JlKSB7XG5cdFx0XHRcdGlmIChiZWZvcmUuYWR2aWNlKSB7XG5cdFx0XHRcdFx0YXJncyA9IGJlZm9yZS5hZHZpY2UuYXBwbHkodGhpcywgYXJncykgfHwgYXJncztcblx0XHRcdFx0fVxuXHRcdFx0XHRiZWZvcmUgPSBiZWZvcmUubmV4dDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRpc3BhdGNoZXIuYXJvdW5kICYmIGRpc3BhdGNoZXIuYXJvdW5kLmFkdmljZSkge1xuXHRcdFx0XHRyZXN1bHRzID0gZGlzcGF0Y2hlci5hcm91bmQuYWR2aWNlKHRoaXMsIGFyZ3MpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWZ0ZXIgPSBkaXNwYXRjaGVyLmFmdGVyO1xuXHRcdFx0d2hpbGUgKGFmdGVyICYmIGFmdGVyLmlkICE9PSB1bmRlZmluZWQgJiYgYWZ0ZXIuaWQgPCBleGVjdXRpb25JZCkge1xuXHRcdFx0XHRpZiAoYWZ0ZXIuYWR2aWNlKSB7XG5cdFx0XHRcdFx0aWYgKGFmdGVyLnJlY2VpdmVBcmd1bWVudHMpIHtcblx0XHRcdFx0XHRcdGxldCBuZXdSZXN1bHRzID0gYWZ0ZXIuYWR2aWNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IG5ld1Jlc3VsdHMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdHMgOiBuZXdSZXN1bHRzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBhZnRlci5hZHZpY2UuY2FsbCh0aGlzLCByZXN1bHRzLCBhcmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YWZ0ZXIgPSBhZnRlci5uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXG5cdFx0aWYgKGlzTWFwTGlrZSh0YXJnZXQpKSB7XG5cdFx0XHR0YXJnZXQuc2V0KG1ldGhvZE5hbWUsIGRpc3BhdGNoZXIpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRhcmdldCAmJiAodGFyZ2V0W21ldGhvZE5hbWVdID0gZGlzcGF0Y2hlcik7XG5cdFx0fVxuXG5cdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRkaXNwYXRjaGVyLmFyb3VuZCA9IHtcblx0XHRcdFx0YWR2aWNlOiBmdW5jdGlvbiAodGFyZ2V0OiBhbnksIGFyZ3M6IGFueVtdKTogYW55IHtcblx0XHRcdFx0XHRyZXR1cm4gZXhpc3RpbmcuYXBwbHkodGFyZ2V0LCBhcmdzKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkaXNwYXRjaGVyLnRhcmdldCA9IHRhcmdldDtcblx0fVxuXHRlbHNlIHtcblx0XHRkaXNwYXRjaGVyID0gZXhpc3Rpbmc7XG5cdH1cblxuXHRyZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaXNwYXRjaGVyIGZ1bmN0aW9uIGZvciBhIGdpdmVuIGpvaW5Qb2ludCAobWV0aG9kL2Z1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgVGhlIGZ1bmN0aW9uIHRoYXQgaXMgdG8gYmUgYWR2aXNlZFxuICovXG5mdW5jdGlvbiBnZXRKb2luUG9pbnREaXNwYXRjaGVyPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludDogRik6IEYge1xuXG5cdGZ1bmN0aW9uIGRpc3BhdGNoZXIodGhpczogRnVuY3Rpb24sIC4uLmFyZ3M6IGFueVtdKTogVCB7XG5cdFx0Ly8gY2Fubm90IGhhdmUgdW5kZWZpbmVkIGluIG1hcCBkdWUgdG8gY29kZSBsb2dpYywgdXNpbmcgIVxuXHRcdGNvbnN0IHsgYmVmb3JlLCBhZnRlciwgam9pblBvaW50IH0gPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoZGlzcGF0Y2hlcikhO1xuXHRcdGlmIChiZWZvcmUpIHtcblx0XHRcdGFyZ3MgPSBiZWZvcmUucmVkdWNlKChwcmV2aW91c0FyZ3MsIGFkdmljZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50QXJncyA9IGFkdmljZS5hcHBseSh0aGlzLCBwcmV2aW91c0FyZ3MpO1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudEFyZ3MgfHwgcHJldmlvdXNBcmdzO1xuXHRcdFx0fSwgYXJncyk7XG5cdFx0fVxuXHRcdGxldCByZXN1bHQgPSBqb2luUG9pbnQuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0aWYgKGFmdGVyKSB7XG5cdFx0XHRyZXN1bHQgPSBhZnRlci5yZWR1Y2UoKHByZXZpb3VzUmVzdWx0LCBhZHZpY2UpID0+IHtcblx0XHRcdFx0cmV0dXJuIGFkdmljZS5hcHBseSh0aGlzLCBbIHByZXZpb3VzUmVzdWx0IF0uY29uY2F0KGFyZ3MpKTtcblx0XHRcdH0sIHJlc3VsdCk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKiBXZSB3YW50IHRvIFwiY2xvbmVcIiB0aGUgYWR2aWNlIHRoYXQgaGFzIGJlZW4gYXBwbGllZCBhbHJlYWR5LCBpZiB0aGlzXG5cdCAqIGpvaW5Qb2ludCBpcyBhbHJlYWR5IGFkdmlzZWQgKi9cblx0aWYgKGRpc3BhdGNoQWR2aWNlTWFwLmhhcyhqb2luUG9pbnQpKSB7XG5cdFx0Ly8gY2Fubm90IGhhdmUgdW5kZWZpbmVkIGluIG1hcCBkdWUgdG8gY29kZSBsb2dpYywgdXNpbmcgIVxuXHRcdGNvbnN0IGFkdmljZU1hcCA9IGRpc3BhdGNoQWR2aWNlTWFwLmdldChqb2luUG9pbnQpITtcblx0XHRsZXQgeyBiZWZvcmUsIGFmdGVyIH0gPSBhZHZpY2VNYXA7XG5cdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0YmVmb3JlID0gYmVmb3JlLnNsaWNlKDApO1xuXHRcdH1cblx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdGFmdGVyID0gYWZ0ZXIuc2xpY2UoMCk7XG5cdFx0fVxuXHRcdGRpc3BhdGNoQWR2aWNlTWFwLnNldChkaXNwYXRjaGVyLCB7XG5cdFx0XHRqb2luUG9pbnQ6IGFkdmljZU1hcC5qb2luUG9pbnQsXG5cdFx0XHRiZWZvcmUsXG5cdFx0XHRhZnRlclxuXHRcdH0pO1xuXHR9XG5cdC8qIE90aGVyd2lzZSwgdGhpcyBpcyBhIG5ldyBqb2luUG9pbnQsIHNvIHdlIHdpbGwgY3JlYXRlIHRoZSBhZHZpY2UgbWFwIGFmcmVzaCAqL1xuXHRlbHNlIHtcblx0XHRkaXNwYXRjaEFkdmljZU1hcC5zZXQoZGlzcGF0Y2hlciwgeyBqb2luUG9pbnQgfSk7XG5cdH1cblxuXHRyZXR1cm4gZGlzcGF0Y2hlciBhcyBGO1xufVxuXG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYWZ0ZXIqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhZnRlciBhZHZpY2VcbiAqL1xuZnVuY3Rpb24gYWZ0ZXJKb2luUG9pbnQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+KTogRiB7XG5cdHJldHVybiBhZHZpc2VKb2luUG9pbnQoam9pblBvaW50LCAnYWZ0ZXInLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYWZ0ZXJcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdC5cbiAqIFRoZSB2YWx1ZSBpdCByZXR1cm5zIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGUgbWV0aG9kIHdoZW4gaXQgaXMgY2FsbGVkIChldmVuIGlmIHRoZSByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkKS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0XG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5mdW5jdGlvbiBhZnRlck9iamVjdCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAob3JpZ2luYWxSZXR1cm46IGFueSwgb3JpZ2luYWxBcmdzOiBJQXJndW1lbnRzKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRyZXR1cm4gYWR2aXNlT2JqZWN0KGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKSwgJ2FmdGVyJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFmdGVyXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3QuXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAoZXZlbiBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdFxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyKHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6IChvcmlnaW5hbFJldHVybjogYW55LCBvcmlnaW5hbEFyZ3M6IElBcmd1bWVudHMpID0+IGFueSk6IEhhbmRsZTtcbi8qKlxuICogQXBwbHkgYWR2aWNlICphZnRlciogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGFmdGVyIGFkdmljZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXI8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+KTogRjtcbmV4cG9ydCBmdW5jdGlvbiBhZnRlcjxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnRPclRhcmdldDogRiB8IFRhcmdldGFibGUsIG1ldGhvZE5hbWVPckFkdmljZTogc3RyaW5nIHwgSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4sIG9iamVjdEFkdmljZT86IChvcmlnaW5hbFJldHVybjogYW55LCBvcmlnaW5hbEFyZ3M6IElBcmd1bWVudHMpID0+IGFueSk6IEhhbmRsZSB8IEYge1xuXHRpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGFmdGVySm9pblBvaW50KGpvaW5Qb2ludE9yVGFyZ2V0LCA8Sm9pblBvaW50QWZ0ZXJBZHZpY2U8VD4+IG1ldGhvZE5hbWVPckFkdmljZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGFmdGVyT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCA8c3RyaW5nPiBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSEpO1xuXHR9XG59XG5cbi8qKlxuICogQXBwbHkgYWR2aWNlICphcm91bmQqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhcm91bmQgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcm91bmRKb2luUG9pbnQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPik6IEYge1xuXHRyZXR1cm4gYWR2aXNlSm9pblBvaW50PEYsIFQ+KGpvaW5Qb2ludCwgJ2Fyb3VuZCcsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJhcm91bmRcIiBhZHZpY2UgYXJvdW5kIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJvdW5kT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICgocHJldmlvdXM6IEZ1bmN0aW9uKSA9PiBGdW5jdGlvbikpOiBIYW5kbGUge1xuXHRsZXQgZGlzcGF0Y2hlcjogRGlzcGF0Y2hlciB8IHVuZGVmaW5lZCA9IGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKTtcblx0bGV0IHByZXZpb3VzID0gZGlzcGF0Y2hlci5hcm91bmQ7XG5cdGxldCBhZHZpc2VkOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcblx0aWYgKGFkdmljZSkge1xuXHRcdGFkdmlzZWQgPSBhZHZpY2UoZnVuY3Rpb24gKHRoaXM6IERpc3BhdGNoZXIpOiBhbnkge1xuXHRcdFx0aWYgKHByZXZpb3VzICYmIHByZXZpb3VzLmFkdmljZSkge1xuXHRcdFx0XHRyZXR1cm4gcHJldmlvdXMuYWR2aWNlKHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRkaXNwYXRjaGVyLmFyb3VuZCA9IHtcblx0XHRhZHZpY2U6IGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgYXJnczogYW55W10pOiBhbnkge1xuXHRcdFx0cmV0dXJuIGFkdmlzZWQgPyBhZHZpc2VkLmFwcGx5KHRhcmdldCwgYXJncykgOiBwcmV2aW91cyAmJiBwcmV2aW91cy5hZHZpY2UgJiYgcHJldmlvdXMuYWR2aWNlKHRhcmdldCwgYXJncyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuXHRcdGFkdmlzZWQgPSBkaXNwYXRjaGVyID0gdW5kZWZpbmVkO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFyb3VuZFwiIGFkdmljZSBhcm91bmQgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb25cbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcm91bmQodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKChwcmV2aW91czogRnVuY3Rpb24pID0+IEZ1bmN0aW9uKSk6IEhhbmRsZTtcbi8qKlxuICogQXBwbHkgYWR2aWNlICphcm91bmQqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhcm91bmQgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcm91bmQ8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPik6IEY7XG5leHBvcnQgZnVuY3Rpb24gYXJvdW5kPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludE9yVGFyZ2V0OiBGIHwgVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZU9yQWR2aWNlOiBzdHJpbmcgfCBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4sIG9iamVjdEFkdmljZT86ICgocHJldmlvdXM6IEZ1bmN0aW9uKSA9PiBGdW5jdGlvbikpOiBIYW5kbGUgfCBGIHtcblx0aWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBhcm91bmRKb2luUG9pbnQoam9pblBvaW50T3JUYXJnZXQsIDxKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4+IG1ldGhvZE5hbWVPckFkdmljZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGFyb3VuZE9iamVjdChqb2luUG9pbnRPclRhcmdldCwgPHN0cmluZz4gbWV0aG9kTmFtZU9yQWR2aWNlLCBvYmplY3RBZHZpY2UhKTtcblx0fVxufVxuXG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYmVmb3JlKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYmVmb3JlIGFkdmljZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlSm9pblBvaW50PEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248YW55Pj4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEJlZm9yZUFkdmljZSk6IEYge1xuXHRyZXR1cm4gYWR2aXNlSm9pblBvaW50KGpvaW5Qb2ludCwgJ2JlZm9yZScsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJiZWZvcmVcIiBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCwgYW5kIG1heSByZXR1cm4gbmV3IGFyZ3VtZW50c1xuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZU9iamVjdCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55W10gfCB2b2lkKTogSGFuZGxlIHtcblx0cmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdiZWZvcmUnLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYmVmb3JlXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwsIGFuZCBtYXkgcmV0dXJuIG5ldyBhcmd1bWVudHNcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmUodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueVtdIHwgdm9pZCk6IEhhbmRsZTtcbi8qKlxuICogQXBwbHkgYWR2aWNlICpiZWZvcmUqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBiZWZvcmUgYWR2aWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmU8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxhbnk+Pihqb2luUG9pbnQ6IEYsIGFkdmljZTogSm9pblBvaW50QmVmb3JlQWR2aWNlKTogRjtcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmU8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50T3JUYXJnZXQ6IEYgfCBUYXJnZXRhYmxlLCBtZXRob2ROYW1lT3JBZHZpY2U6IHN0cmluZyB8IEpvaW5Qb2ludEJlZm9yZUFkdmljZSwgb2JqZWN0QWR2aWNlPzogKCguLi5vcmlnaW5hbEFyZ3M6IGFueVtdKSA9PiBhbnlbXSB8IHZvaWQpKTogSGFuZGxlIHwgRiB7XG5cdGlmICh0eXBlb2Ygam9pblBvaW50T3JUYXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYmVmb3JlSm9pblBvaW50KGpvaW5Qb2ludE9yVGFyZ2V0LCA8Sm9pblBvaW50QmVmb3JlQWR2aWNlPiBtZXRob2ROYW1lT3JBZHZpY2UpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBiZWZvcmVPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIDxzdHJpbmc+IG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlISk7XG5cdH1cbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBhZHZpY2UgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqIFRoZSBhZHZpc2luZyBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAqdW5sZXNzKiBpdHMgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsIG1ldGhvZFxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uKHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICguLi5vcmlnaW5hbEFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRyZXR1cm4gYWR2aXNlT2JqZWN0KGdldERpc3BhdGNoZXJPYmplY3QodGFyZ2V0LCBtZXRob2ROYW1lKSwgJ2FmdGVyJywgYWR2aWNlLCB0cnVlKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhc3BlY3QudHMiLCJpbXBvcnQgeyBIYW5kbGUgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2NvcmUnO1xuaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vc2hpbS9vYmplY3QnO1xuXG5leHBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5cbmNvbnN0IHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFR5cGUgZ3VhcmQgdGhhdCBlbnN1cmVzIHRoYXQgdGhlIHZhbHVlIGNhbiBiZSBjb2VyY2VkIHRvIE9iamVjdFxuICogdG8gd2VlZCBvdXQgaG9zdCBvYmplY3RzIHRoYXQgZG8gbm90IGRlcml2ZSBmcm9tIE9iamVjdC5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjaGVjayBpZiB3ZSB3YW50IHRvIGRlZXAgY29weSBhbiBvYmplY3Qgb3Igbm90LlxuICogTm90ZTogSW4gRVM2IGl0IGlzIHBvc3NpYmxlIHRvIG1vZGlmeSBhbiBvYmplY3QncyBTeW1ib2wudG9TdHJpbmdUYWcgcHJvcGVydHksIHdoaWNoIHdpbGxcbiAqIGNoYW5nZSB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYHRvU3RyaW5nYC4gVGhpcyBpcyBhIHJhcmUgZWRnZSBjYXNlIHRoYXQgaXMgZGlmZmljdWx0IHRvIGhhbmRsZSxcbiAqIHNvIGl0IGlzIG5vdCBoYW5kbGVkIGhlcmUuXG4gKiBAcGFyYW0gIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybiAgICAgICBJZiB0aGUgdmFsdWUgaXMgY29lcmNpYmxlIGludG8gYW4gT2JqZWN0XG4gKi9cbmZ1bmN0aW9uIHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBPYmplY3Qge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmZ1bmN0aW9uIGNvcHlBcnJheTxUPihhcnJheTogVFtdLCBpbmhlcml0ZWQ6IGJvb2xlYW4pOiBUW10ge1xuXHRyZXR1cm4gYXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtOiBUKTogVCB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcblx0XHRcdHJldHVybiA8YW55PiBjb3B5QXJyYXkoPGFueT4gaXRlbSwgaW5oZXJpdGVkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gIXNob3VsZERlZXBDb3B5T2JqZWN0KGl0ZW0pID9cblx0XHRcdGl0ZW0gOlxuXHRcdFx0X21peGluKHtcblx0XHRcdFx0ZGVlcDogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdGVkOiBpbmhlcml0ZWQsXG5cdFx0XHRcdHNvdXJjZXM6IDxBcnJheTxUPj4gWyBpdGVtIF0sXG5cdFx0XHRcdHRhcmdldDogPFQ+IHt9XG5cdFx0XHR9KTtcblx0fSk7XG59XG5cbmludGVyZmFjZSBNaXhpbkFyZ3M8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+IHtcblx0ZGVlcDogYm9vbGVhbjtcblx0aW5oZXJpdGVkOiBib29sZWFuO1xuXHRzb3VyY2VzOiAoVSB8IG51bGwgfCB1bmRlZmluZWQpW107XG5cdHRhcmdldDogVDtcblx0Y29waWVkPzogYW55W107XG59XG5cbmZ1bmN0aW9uIF9taXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4oa3dBcmdzOiBNaXhpbkFyZ3M8VCwgVT4pOiBUJlUge1xuXHRjb25zdCBkZWVwID0ga3dBcmdzLmRlZXA7XG5cdGNvbnN0IGluaGVyaXRlZCA9IGt3QXJncy5pbmhlcml0ZWQ7XG5cdGNvbnN0IHRhcmdldDogYW55ID0ga3dBcmdzLnRhcmdldDtcblx0Y29uc3QgY29waWVkID0ga3dBcmdzLmNvcGllZCB8fCBbXTtcblx0Y29uc3QgY29waWVkQ2xvbmUgPSBbIC4uLmNvcGllZCBdO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwga3dBcmdzLnNvdXJjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBzb3VyY2UgPSBrd0FyZ3Muc291cmNlc1tpXTtcblxuXHRcdGlmIChzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG5cdFx0XHRpZiAoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG5cdFx0XHRcdGxldCB2YWx1ZTogYW55ID0gc291cmNlW2tleV07XG5cblx0XHRcdFx0aWYgKGNvcGllZENsb25lLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGRlZXApIHtcblx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gY29weUFycmF5KHZhbHVlLCBpbmhlcml0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldFZhbHVlOiBhbnkgPSB0YXJnZXRba2V5XSB8fCB7fTtcblx0XHRcdFx0XHRcdGNvcGllZC5wdXNoKHNvdXJjZSk7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9taXhpbih7XG5cdFx0XHRcdFx0XHRcdGRlZXA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGluaGVyaXRlZDogaW5oZXJpdGVkLFxuXHRcdFx0XHRcdFx0XHRzb3VyY2VzOiBbIHZhbHVlIF0sXG5cdFx0XHRcdFx0XHRcdHRhcmdldDogdGFyZ2V0VmFsdWUsXG5cdFx0XHRcdFx0XHRcdGNvcGllZFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRhcmdldFtrZXldID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIDxUJlU+IHRhcmdldDtcbn1cblxuaW50ZXJmYWNlIE9iamVjdEFzc2lnbkNvbnN0cnVjdG9yIGV4dGVuZHMgT2JqZWN0Q29uc3RydWN0b3Ige1xuXHRhc3NpZ248VCwgVT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcblx0YXNzaWduPFQsIFUxLCBVMj4odGFyZ2V0OiBULCBzb3VyY2UxOiBVMSwgc291cmNlMjogVTIpOiBUICYgVTEgJiBVMjtcblx0YXNzaWduPFQsIFUxLCBVMiwgVTM+KHRhcmdldDogVCwgc291cmNlMTogVTEsIHNvdXJjZTI6IFUyLCBzb3VyY2UzOiBVMyk6IFQgJiBVMSAmIFUyICYgVTM7XG5cdGFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlLCBhbmQgY29waWVzIGFsbCBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlXG4gKiBzb3VyY2Ugb2JqZWN0cyB0byB0aGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBwcm90b3R5cGUgVGhlIHByb3RvdHlwZSB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGZyb21cbiAqIEBwYXJhbSBtaXhpbnMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcsIG1peGluNDogWCwgbWl4aW41OiBZLCBtaXhpbjY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcsIG1peGluNDogWCwgbWl4aW41OiBZKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogViwgbWl4aW4zOiBXLCBtaXhpbjQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCk6IFQ7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZTogYW55LCAuLi5taXhpbnM6IGFueVtdKTogYW55IHtcblx0aWYgKCFtaXhpbnMubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xhbmcuY3JlYXRlIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBtaXhpbiBvYmplY3QuJyk7XG5cdH1cblxuXHRjb25zdCBhcmdzID0gbWl4aW5zLnNsaWNlKCk7XG5cdGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xuXG5cdHJldHVybiBhc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYWxsIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gdGhlIHRhcmdldCBvYmplY3QsXG4gKiByZWN1cnNpdmVseSBjb3B5aW5nIGFsbCBuZXN0ZWQgb2JqZWN0cyBhbmQgYXJyYXlzIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byByZWNlaXZlIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RzXG4gKiBAcGFyYW0gc291cmNlcyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgdGFyZ2V0IG9iamVjdFxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSwgc291cmNlNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVyk6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IHRydWUsXG5cdFx0aW5oZXJpdGVkOiBmYWxzZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIChvd24gb3IgaW5oZXJpdGVkKSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogdGFyZ2V0IG9iamVjdCwgcmVjdXJzaXZlbHkgY29weWluZyBhbGwgbmVzdGVkIG9iamVjdHMgYW5kIGFycmF5cyBhcyB3ZWxsLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gcmVjZWl2ZSB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0c1xuICogQHBhcmFtIHNvdXJjZXMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgdGFyZ2V0IG9iamVjdFxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30sIFogZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZLCBzb3VyY2U2OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW4odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0cmV0dXJuIF9taXhpbih7XG5cdFx0ZGVlcDogdHJ1ZSxcblx0XHRpbmhlcml0ZWQ6IHRydWUsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgcHJvdG90eXBlIGFzIHRoZSBwcm90b3R5cGUgZm9yIHRoZSBuZXcgb2JqZWN0LCBhbmQgdGhlblxuICogZGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHZhbHVlcyBpbnRvIHRoZSBuZXcgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIG9iamVjdCB0byBkdXBsaWNhdGVcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGR1cGxpY2F0ZTxUIGV4dGVuZHMge30+KHNvdXJjZTogVCk6IFQge1xuXHRjb25zdCB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpKTtcblxuXHRyZXR1cm4gZGVlcE1peGluKHRhcmdldCwgc291cmNlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUuXG4gKlxuICogQHBhcmFtIGEgRmlyc3QgdmFsdWUgdG8gY29tcGFyZVxuICogQHBhcmFtIGIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0lkZW50aWNhbChhOiBhbnksIGI6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gYSA9PT0gYiB8fFxuXHRcdC8qIGJvdGggdmFsdWVzIGFyZSBOYU4gKi9cblx0XHQoYSAhPT0gYSAmJiBiICE9PSBiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBiaW5kcyBhIG1ldGhvZCB0byB0aGUgc3BlY2lmaWVkIG9iamVjdCBhdCBydW50aW1lLiBUaGlzIGlzIHNpbWlsYXIgdG9cbiAqIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24gaXQgdGFrZXMgdGhlIG5hbWUgb2YgYSBtZXRob2Qgb24gYW4gb2JqZWN0LlxuICogQXMgYSByZXN1bHQsIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBgbGF0ZUJpbmRgIHdpbGwgYWx3YXlzIGNhbGwgdGhlIGZ1bmN0aW9uIGN1cnJlbnRseSBhc3NpZ25lZCB0b1xuICogdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0IGFzIG9mIHRoZSBtb21lbnQgdGhlIGZ1bmN0aW9uIGl0IHJldHVybnMgaXMgY2FsbGVkLlxuICpcbiAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgY29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBtZXRob2QgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBvbiB0aGUgY29udGV4dCBvYmplY3QgdG8gYmluZCB0byBpdHNlbGZcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgdmFsdWVzIHRvIHByZXBlbmQgdG8gdGhlIGBpbnN0YW5jZVttZXRob2RdYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhdGVCaW5kKGluc3RhbmNlOiB7fSwgbWV0aG9kOiBzdHJpbmcsIC4uLnN1cHBsaWVkQXJnczogYW55W10pOiAoLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBzdXBwbGllZEFyZ3MubGVuZ3RoID9cblx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zdCBhcmdzOiBhbnlbXSA9IGFyZ3VtZW50cy5sZW5ndGggPyBzdXBwbGllZEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBzdXBwbGllZEFyZ3M7XG5cblx0XHRcdC8vIFRTNzAxN1xuXHRcdFx0cmV0dXJuICg8YW55PiBpbnN0YW5jZSlbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJncyk7XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0Ly8gVFM3MDE3XG5cdFx0XHRyZXR1cm4gKDxhbnk+IGluc3RhbmNlKVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuXHRcdH07XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYWxsIGVudW1lcmFibGUgKG93biBvciBpbmhlcml0ZWQpIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30sIFogZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZLCBzb3VyY2U2OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFkpOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCk6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW4odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0cmV0dXJuIF9taXhpbih7XG5cdFx0ZGVlcDogZmFsc2UsXG5cdFx0aW5oZXJpdGVkOiB0cnVlLFxuXHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0dGFyZ2V0OiB0YXJnZXRcblx0fSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXG4gKiBMaWtlIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBkb2VzIG5vdCBhbHRlciBleGVjdXRpb24gY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhlIGB0YXJnZXRGdW5jdGlvbmAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsKHRhcmdldEZ1bmN0aW9uOiAoLi4uYXJnczogYW55W10pID0+IGFueSwgLi4uc3VwcGxpZWRBcmdzOiBhbnlbXSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnkpIHtcblx0XHRjb25zdCBhcmdzOiBhbnlbXSA9IGFyZ3VtZW50cy5sZW5ndGggPyBzdXBwbGllZEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBzdXBwbGllZEFyZ3M7XG5cblx0XHRyZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGRlc3Ryb3kgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBjYWxscyB0aGUgcGFzc2VkLWluIGRlc3RydWN0b3IuXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZSBmb3IgY3JlYXRpbmcgXCJyZW1vdmVcIiAvIFwiZGVzdHJveVwiIGhhbmRsZXJzIGZvclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gZGVzdHJ1Y3RvciBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaGFuZGxlJ3MgYGRlc3Ryb3lgIG1ldGhvZCBpcyBpbnZva2VkXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3RvcjogKCkgPT4gdm9pZCk6IEhhbmRsZSB7XG5cdHJldHVybiB7XG5cdFx0ZGVzdHJveTogZnVuY3Rpb24gKHRoaXM6IEhhbmRsZSkge1xuXHRcdFx0dGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHRkZXN0cnVjdG9yLmNhbGwodGhpcyk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaGFuZGxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGVzdHJveSBtdWx0aXBsZSBoYW5kbGVzIHNpbXVsdGFuZW91c2x5LlxuICpcbiAqIEBwYXJhbSBoYW5kbGVzIEFuIGFycmF5IG9mIGhhbmRsZXMgd2l0aCBgZGVzdHJveWAgbWV0aG9kc1xuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcG9zaXRlSGFuZGxlKC4uLmhhbmRsZXM6IEhhbmRsZVtdKTogSGFuZGxlIHtcblx0cmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBoYW5kbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRoYW5kbGVzW2ldLmRlc3Ryb3koKTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxhbmcudHMiLCJpbXBvcnQgaGFzLCB7IGFkZCB9IGZyb20gJ0Bkb2pvL2hhcy9oYXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xuXG5leHBvcnQgZGVmYXVsdCBoYXM7XG5leHBvcnQgKiBmcm9tICdAZG9qby9oYXMvaGFzJztcblxuLyogRUNNQVNjcmlwdCA2IGFuZCA3IEZlYXR1cmVzICovXG5cbi8qIEFycmF5ICovXG5hZGQoXG5cdCdlczYtYXJyYXknLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFsnZnJvbScsICdvZiddLmV2ZXJ5KChrZXkpID0+IGtleSBpbiBnbG9iYWwuQXJyYXkpICYmXG5cdFx0XHRbJ2ZpbmRJbmRleCcsICdmaW5kJywgJ2NvcHlXaXRoaW4nXS5ldmVyeSgoa2V5KSA9PiBrZXkgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSlcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtYXJyYXktZmlsbCcsXG5cdCgpID0+IHtcblx0XHRpZiAoJ2ZpbGwnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpIHtcblx0XHRcdC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xuXHRcdFx0cmV0dXJuICg8YW55PlsxXSkuZmlsbCg5LCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpWzBdID09PSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZCgnZXM3LWFycmF5JywgKCkgPT4gJ2luY2x1ZGVzJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlLCB0cnVlKTtcblxuLyogTWFwICovXG5hZGQoXG5cdCdlczYtbWFwJyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Lypcblx0XHRJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5XG5cdFx0V2Ugd3JhcCB0aGlzIGluIGEgdHJ5L2NhdGNoIGJlY2F1c2Ugc29tZXRpbWVzIHRoZSBNYXAgY29uc3RydWN0b3IgZXhpc3RzLCBidXQgZG9lcyBub3Rcblx0XHR0YWtlIGFyZ3VtZW50cyAoaU9TIDguNClcblx0XHQgKi9cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuTWFwKFtbMCwgMV1dKTtcblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdG1hcC5oYXMoMCkgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHRoYXMoJ2VzNi1zeW1ib2wnKSAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAudmFsdWVzID09PSAnZnVuY3Rpb24nICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC5lbnRyaWVzID09PSAnZnVuY3Rpb24nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogTWF0aCAqL1xuYWRkKFxuXHQnZXM2LW1hdGgnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCdjbHozMicsXG5cdFx0XHQnc2lnbicsXG5cdFx0XHQnbG9nMTAnLFxuXHRcdFx0J2xvZzInLFxuXHRcdFx0J2xvZzFwJyxcblx0XHRcdCdleHBtMScsXG5cdFx0XHQnY29zaCcsXG5cdFx0XHQnc2luaCcsXG5cdFx0XHQndGFuaCcsXG5cdFx0XHQnYWNvc2gnLFxuXHRcdFx0J2FzaW5oJyxcblx0XHRcdCdhdGFuaCcsXG5cdFx0XHQndHJ1bmMnLFxuXHRcdFx0J2Zyb3VuZCcsXG5cdFx0XHQnY2JydCcsXG5cdFx0XHQnaHlwb3QnXG5cdFx0XS5ldmVyeSgobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5NYXRoW25hbWVdID09PSAnZnVuY3Rpb24nKTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LW1hdGgtaW11bCcsXG5cdCgpID0+IHtcblx0XHRpZiAoJ2ltdWwnIGluIGdsb2JhbC5NYXRoKSB7XG5cdFx0XHQvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBvbiBpb3MgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXG5cdFx0XHRyZXR1cm4gKDxhbnk+TWF0aCkuaW11bCgweGZmZmZmZmZmLCA1KSA9PT0gLTU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogT2JqZWN0ICovXG5hZGQoXG5cdCdlczYtb2JqZWN0Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRoYXMoJ2VzNi1zeW1ib2wnKSAmJlxuXHRcdFx0Wydhc3NpZ24nLCAnaXMnLCAnZ2V0T3duUHJvcGVydHlTeW1ib2xzJywgJ3NldFByb3RvdHlwZU9mJ10uZXZlcnkoXG5cdFx0XHRcdChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzMjAxNy1vYmplY3QnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFsndmFsdWVzJywgJ2VudHJpZXMnLCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyddLmV2ZXJ5KFxuXHRcdFx0KG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogT2JzZXJ2YWJsZSAqL1xuYWRkKCdlcy1vYnNlcnZhYmxlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5PYnNlcnZhYmxlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XG5cbi8qIFByb21pc2UgKi9cbmFkZCgnZXM2LXByb21pc2UnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGhhcygnZXM2LXN5bWJvbCcpLCB0cnVlKTtcblxuLyogU2V0ICovXG5hZGQoXG5cdCdlczYtc2V0Jyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLlNldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0LyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBTZXQgZnVuY3Rpb25hbGl0eSAqL1xuXHRcdFx0Y29uc3Qgc2V0ID0gbmV3IGdsb2JhbC5TZXQoWzFdKTtcblx0XHRcdHJldHVybiBzZXQuaGFzKDEpICYmICdrZXlzJyBpbiBzZXQgJiYgdHlwZW9mIHNldC5rZXlzID09PSAnZnVuY3Rpb24nICYmIGhhcygnZXM2LXN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIFN0cmluZyAqL1xuYWRkKFxuXHQnZXM2LXN0cmluZycsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0W1xuXHRcdFx0XHQvKiBzdGF0aWMgbWV0aG9kcyAqL1xuXHRcdFx0XHQnZnJvbUNvZGVQb2ludCdcblx0XHRcdF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmdba2V5XSA9PT0gJ2Z1bmN0aW9uJykgJiZcblx0XHRcdFtcblx0XHRcdFx0LyogaW5zdGFuY2UgbWV0aG9kcyAqL1xuXHRcdFx0XHQnY29kZVBvaW50QXQnLFxuXHRcdFx0XHQnbm9ybWFsaXplJyxcblx0XHRcdFx0J3JlcGVhdCcsXG5cdFx0XHRcdCdzdGFydHNXaXRoJyxcblx0XHRcdFx0J2VuZHNXaXRoJyxcblx0XHRcdFx0J2luY2x1ZGVzJ1xuXHRcdFx0XS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJylcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtc3RyaW5nLXJhdycsXG5cdCgpID0+IHtcblx0XHRmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnN1YnN0aXR1dGlvbnM6IGFueVtdKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBbLi4uY2FsbFNpdGVdO1xuXHRcdFx0KHJlc3VsdCBhcyBhbnkpLnJhdyA9IGNhbGxTaXRlLnJhdztcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0aWYgKCdyYXcnIGluIGdsb2JhbC5TdHJpbmcpIHtcblx0XHRcdGxldCBiID0gMTtcblx0XHRcdGxldCBjYWxsU2l0ZSA9IGdldENhbGxTaXRlYGFcXG4ke2J9YDtcblxuXHRcdFx0KGNhbGxTaXRlIGFzIGFueSkucmF3ID0gWydhXFxcXG4nXTtcblx0XHRcdGNvbnN0IHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWwuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XG5cblx0XHRcdHJldHVybiBzdXBwb3J0c1RydW5jO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXMyMDE3LXN0cmluZycsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJyk7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIFN5bWJvbCAqL1xuYWRkKCdlczYtc3ltYm9sJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCcsIHRydWUpO1xuXG4vKiBXZWFrTWFwICovXG5hZGQoXG5cdCdlczYtd2Vha21hcCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0LyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eSAqL1xuXHRcdFx0Y29uc3Qga2V5MSA9IHt9O1xuXHRcdFx0Y29uc3Qga2V5MiA9IHt9O1xuXHRcdFx0Y29uc3QgbWFwID0gbmV3IGdsb2JhbC5XZWFrTWFwKFtba2V5MSwgMV1dKTtcblx0XHRcdE9iamVjdC5mcmVlemUoa2V5MSk7XG5cdFx0XHRyZXR1cm4gbWFwLmdldChrZXkxKSA9PT0gMSAmJiBtYXAuc2V0KGtleTIsIDIpID09PSBtYXAgJiYgaGFzKCdlczYtc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogTWlzY2VsbGFuZW91cyBmZWF0dXJlcyAqL1xuYWRkKCdtaWNyb3Rhc2tzJywgKCkgPT4gaGFzKCdlczYtcHJvbWlzZScpIHx8IGhhcygnaG9zdC1ub2RlJykgfHwgaGFzKCdkb20tbXV0YXRpb25vYnNlcnZlcicpLCB0cnVlKTtcbmFkZChcblx0J3Bvc3RtZXNzYWdlJyxcblx0KCkgPT4ge1xuXHRcdC8vIElmIHdpbmRvdyBpcyB1bmRlZmluZWQsIGFuZCB3ZSBoYXZlIHBvc3RNZXNzYWdlLCBpdCBwcm9iYWJseSBtZWFucyB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIuIFdlYiB3b3JrZXJzIGhhdmVcblx0XHQvLyBwb3N0IG1lc3NhZ2UgYnV0IGl0IGRvZXNuJ3Qgd29yayBob3cgd2UgZXhwZWN0IGl0IHRvLCBzbyBpdCdzIGJlc3QganVzdCB0byBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG5cdFx0cmV0dXJuIHR5cGVvZiBnbG9iYWwud2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZ2xvYmFsLnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nO1xuXHR9LFxuXHR0cnVlXG4pO1xuYWRkKCdyYWYnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJywgdHJ1ZSk7XG5hZGQoJ3NldGltbWVkaWF0ZScsICgpID0+IHR5cGVvZiBnbG9iYWwuc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XG5cbi8qIERPTSBGZWF0dXJlcyAqL1xuXG5hZGQoXG5cdCdkb20tbXV0YXRpb25vYnNlcnZlcicsXG5cdCgpID0+IHtcblx0XHRpZiAoaGFzKCdob3N0LWJyb3dzZXInKSAmJiBCb29sZWFuKGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyKSkge1xuXHRcdFx0Ly8gSUUxMSBoYXMgYW4gdW5yZWxpYWJsZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIHdoZXJlIHNldFByb3BlcnR5KCkgZG9lcyBub3Rcblx0XHRcdC8vIGdlbmVyYXRlIGEgbXV0YXRpb24gZXZlbnQsIG9ic2VydmVycyBjYW4gY3Jhc2gsIGFuZCB0aGUgcXVldWUgZG9lcyBub3QgZHJhaW5cblx0XHRcdC8vIHJlbGlhYmx5LiBUaGUgZm9sbG93aW5nIGZlYXR1cmUgdGVzdCB3YXMgYWRhcHRlZCBmcm9tXG5cdFx0XHQvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90MTBrby80YWNlYjhjNzE2ODFmZGIyNzVlMzNlZmU1ZTU3NmIxNFxuXHRcdFx0Y29uc3QgZXhhbXBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRcdGNvbnN0IEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cdFx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpIHt9KTtcblx0XHRcdG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG5cdFx0XHRleGFtcGxlLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiBCb29sZWFuKG9ic2VydmVyLnRha2VSZWNvcmRzKCkubGVuZ3RoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGhhcy50cyIsImltcG9ydCB7IGlzQXJyYXlMaWtlLCBJdGVyYWJsZSwgSXRlcmFibGVJdGVyYXRvciwgU2hpbUl0ZXJhdG9yIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzIGFzIG9iamVjdElzIH0gZnJvbSAnLi9vYmplY3QnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcDxLLCBWPiB7XG5cdC8qKlxuXHQgKiBEZWxldGVzIGFsbCBrZXlzIGFuZCB0aGVpciBhc3NvY2lhdGVkIHZhbHVlcy5cblx0ICovXG5cdGNsZWFyKCk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIERlbGV0ZXMgYSBnaXZlbiBrZXkgYW5kIGl0cyBhc3NvY2lhdGVkIHZhbHVlLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gZGVsZXRlXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUga2V5IGV4aXN0cywgZmFsc2UgaWYgaXQgZG9lcyBub3Rcblx0ICovXG5cdGRlbGV0ZShrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2gga2V5L3ZhbHVlIHBhaXIgYXMgYW4gYXJyYXkuXG5cdCAqXG5cdCAqIEByZXR1cm4gQW4gaXRlcmF0b3IgZm9yIGVhY2gga2V5L3ZhbHVlIHBhaXIgaW4gdGhlIGluc3RhbmNlLlxuXHQgKi9cblx0ZW50cmllcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT47XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIGEgZ2l2ZW4gZnVuY3Rpb24gZm9yIGVhY2ggbWFwIGVudHJ5LiBUaGUgZnVuY3Rpb25cblx0ICogaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogdGhlIGVsZW1lbnQgdmFsdWUsIHRoZVxuXHQgKiBlbGVtZW50IGtleSwgYW5kIHRoZSBhc3NvY2lhdGVkIE1hcCBpbnN0YW5jZS5cblx0ICpcblx0ICogQHBhcmFtIGNhbGxiYWNrZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgZm9yIGVhY2ggbWFwIGVudHJ5LFxuXHQgKiBAcGFyYW0gdGhpc0FyZyBUaGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2AgZm9yIGVhY2ggZXhlY3V0aW9uIG9mIHRoZSBjYWxiYWNrXG5cdCAqL1xuXHRmb3JFYWNoKGNhbGxiYWNrZm46ICh2YWx1ZTogViwga2V5OiBLLCBtYXA6IE1hcDxLLCBWPikgPT4gdm9pZCwgdGhpc0FyZz86IGFueSk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGtleS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGxvb2sgdXBcblx0ICogQHJldHVybiBUaGUgdmFsdWUgaWYgb25lIGV4aXN0cyBvciB1bmRlZmluZWRcblx0ICovXG5cdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2gga2V5IGluIHRoZSBtYXAuXG5cdCAqXG5cdCAqIEByZXR1cm4gQW4gaXRlcmF0b3IgY29udGFpbmluZyB0aGUgaW5zdGFuY2UncyBrZXlzLlxuXHQgKi9cblx0a2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEs+O1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgZm9yIHRoZSBwcmVzZW5jZSBvZiBhIGdpdmVuIGtleS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGNoZWNrIGZvclxuXHQgKiBAcmV0dXJuIHRydWUgaWYgdGhlIGtleSBleGlzdHMsIGZhbHNlIGlmIGl0IGRvZXMgbm90XG5cdCAqL1xuXHRoYXMoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gZGVmaW5lIGEgdmFsdWUgdG9cblx0ICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ25cblx0ICogQHJldHVybiBUaGUgTWFwIGluc3RhbmNlXG5cdCAqL1xuXHRzZXQoa2V5OiBLLCB2YWx1ZTogVik6IHRoaXM7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBrZXkgLyB2YWx1ZSBwYWlycyBpbiB0aGUgTWFwLlxuXHQgKi9cblx0cmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2ggdmFsdWUgaW4gdGhlIG1hcC5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBjb250YWluaW5nIHRoZSBpbnN0YW5jZSdzIHZhbHVlcy5cblx0ICovXG5cdHZhbHVlcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFY+O1xuXG5cdC8qKiBSZXR1cm5zIGFuIGl0ZXJhYmxlIG9mIGVudHJpZXMgaW4gdGhlIG1hcC4gKi9cblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+O1xuXG5cdHJlYWRvbmx5IFtTeW1ib2wudG9TdHJpbmdUYWddOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwQ29uc3RydWN0b3Ige1xuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRuZXcgKCk6IE1hcDxhbnksIGFueT47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTWFwXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmF0b3Jcblx0ICogQXJyYXkgb3IgaXRlcmF0b3IgY29udGFpbmluZyB0d28taXRlbSB0dXBsZXMgdXNlZCB0byBpbml0aWFsbHkgcG9wdWxhdGUgdGhlIG1hcC5cblx0ICogVGhlIGZpcnN0IGl0ZW0gaW4gZWFjaCB0dXBsZSBjb3JyZXNwb25kcyB0byB0aGUga2V5IG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqIFRoZSBzZWNvbmQgaXRlbSBjb3JyZXNwb25kcyB0byB0aGUgdmFsdWUgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICovXG5cdG5ldyA8SywgVj4oaXRlcmF0b3I/OiBbSywgVl1bXSk6IE1hcDxLLCBWPjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYXRvclxuXHQgKiBBcnJheSBvciBpdGVyYXRvciBjb250YWluaW5nIHR3by1pdGVtIHR1cGxlcyB1c2VkIHRvIGluaXRpYWxseSBwb3B1bGF0ZSB0aGUgbWFwLlxuXHQgKiBUaGUgZmlyc3QgaXRlbSBpbiBlYWNoIHR1cGxlIGNvcnJlc3BvbmRzIHRvIHRoZSBrZXkgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICogVGhlIHNlY29uZCBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKi9cblx0bmV3IDxLLCBWPihpdGVyYXRvcjogSXRlcmFibGU8W0ssIFZdPik6IE1hcDxLLCBWPjtcblxuXHRyZWFkb25seSBwcm90b3R5cGU6IE1hcDxhbnksIGFueT47XG5cblx0cmVhZG9ubHkgW1N5bWJvbC5zcGVjaWVzXTogTWFwQ29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBsZXQgTWFwOiBNYXBDb25zdHJ1Y3RvciA9IGdsb2JhbC5NYXA7XG5cbmlmICghaGFzKCdlczYtbWFwJykpIHtcblx0TWFwID0gY2xhc3MgTWFwPEssIFY+IHtcblx0XHRwcm90ZWN0ZWQgcmVhZG9ubHkgX2tleXM6IEtbXSA9IFtdO1xuXHRcdHByb3RlY3RlZCByZWFkb25seSBfdmFsdWVzOiBWW10gPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIEFuIGFsdGVybmF0aXZlIHRvIEFycmF5LnByb3RvdHlwZS5pbmRleE9mIHVzaW5nIE9iamVjdC5pc1xuXHRcdCAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxuXHRcdCAqL1xuXHRcdHByb3RlY3RlZCBfaW5kZXhPZktleShrZXlzOiBLW10sIGtleTogSyk6IG51bWJlciB7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob2JqZWN0SXMoa2V5c1tpXSwga2V5KSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIFtTeW1ib2wuc3BlY2llc10gPSBNYXA7XG5cblx0XHRjb25zdHJ1Y3RvcihpdGVyYWJsZT86IEFycmF5TGlrZTxbSywgVl0+IHwgSXRlcmFibGU8W0ssIFZdPikge1xuXHRcdFx0aWYgKGl0ZXJhYmxlKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRnZXQgc2l6ZSgpOiBudW1iZXIge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2tleXMubGVuZ3RoO1xuXHRcdH1cblxuXHRcdGNsZWFyKCk6IHZvaWQge1xuXHRcdFx0dGhpcy5fa2V5cy5sZW5ndGggPSB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbiB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dGhpcy5fdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPiB7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLl9rZXlzLm1hcCgoa2V5OiBLLCBpOiBudW1iZXIpOiBbSywgVl0gPT4ge1xuXHRcdFx0XHRyZXR1cm4gW2tleSwgdGhpcy5fdmFsdWVzW2ldXTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih2YWx1ZXMpO1xuXHRcdH1cblxuXHRcdGZvckVhY2goY2FsbGJhY2s6ICh2YWx1ZTogViwga2V5OiBLLCBtYXBJbnN0YW5jZTogTWFwPEssIFY+KSA9PiBhbnksIGNvbnRleHQ/OiB7fSkge1xuXHRcdFx0Y29uc3Qga2V5cyA9IHRoaXMuX2tleXM7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLl92YWx1ZXM7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlc1tpXSwga2V5c1tpXSwgdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQge1xuXHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XG5cdFx0XHRyZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogdGhpcy5fdmFsdWVzW2luZGV4XTtcblx0XHR9XG5cblx0XHRoYXMoa2V5OiBLKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpID4gLTE7XG5cdFx0fVxuXG5cdFx0a2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEs+IHtcblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHRoaXMuX2tleXMpO1xuXHRcdH1cblxuXHRcdHNldChrZXk6IEssIHZhbHVlOiBWKTogTWFwPEssIFY+IHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdGluZGV4ID0gaW5kZXggPCAwID8gdGhpcy5fa2V5cy5sZW5ndGggOiBpbmRleDtcblx0XHRcdHRoaXMuX2tleXNbaW5kZXhdID0ga2V5O1xuXHRcdFx0dGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0dmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fdmFsdWVzKTtcblx0XHR9XG5cblx0XHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuZW50cmllcygpO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnTWFwJyA9ICdNYXAnO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gTWFwLnRzIiwiaW1wb3J0IHsgVGhlbmFibGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBxdWV1ZU1pY3JvVGFzayB9IGZyb20gJy4vc3VwcG9ydC9xdWV1ZSc7XG5pbXBvcnQgeyBJdGVyYWJsZSB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuXG4vKipcbiAqIEV4ZWN1dG9yIGlzIHRoZSBpbnRlcmZhY2UgZm9yIGZ1bmN0aW9ucyB1c2VkIHRvIGluaXRpYWxpemUgYSBQcm9taXNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWN1dG9yPFQ+IHtcblx0LyoqXG5cdCAqIFRoZSBleGVjdXRvciBmb3IgdGhlIHByb21pc2Vcblx0ICpcblx0ICogQHBhcmFtIHJlc29sdmUgVGhlIHJlc29sdmVyIGNhbGxiYWNrIG9mIHRoZSBwcm9taXNlXG5cdCAqIEBwYXJhbSByZWplY3QgVGhlIHJlamVjdG9yIGNhbGxiYWNrIG9mIHRoZSBwcm9taXNlXG5cdCAqL1xuXHQocmVzb2x2ZTogKHZhbHVlPzogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgbGV0IFNoaW1Qcm9taXNlOiB0eXBlb2YgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5leHBvcnQgY29uc3QgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGU8VD4odmFsdWU6IGFueSk6IHZhbHVlIGlzIFByb21pc2VMaWtlPFQ+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufTtcblxuaWYgKCFoYXMoJ2VzNi1wcm9taXNlJykpIHtcblx0Y29uc3QgZW51bSBTdGF0ZSB7XG5cdFx0RnVsZmlsbGVkLFxuXHRcdFBlbmRpbmcsXG5cdFx0UmVqZWN0ZWRcblx0fVxuXG5cdGdsb2JhbC5Qcm9taXNlID0gU2hpbVByb21pc2UgPSBjbGFzcyBQcm9taXNlPFQ+IGltcGxlbWVudHMgVGhlbmFibGU8VD4ge1xuXHRcdHN0YXRpYyBhbGwoaXRlcmFibGU6IEl0ZXJhYmxlPGFueSB8IFByb21pc2VMaWtlPGFueT4+IHwgKGFueSB8IFByb21pc2VMaWtlPGFueT4pW10pOiBQcm9taXNlPGFueT4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG5cdFx0XHRcdGxldCBjb21wbGV0ZSA9IDA7XG5cdFx0XHRcdGxldCB0b3RhbCA9IDA7XG5cdFx0XHRcdGxldCBwb3B1bGF0aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmdWxmaWxsKGluZGV4OiBudW1iZXIsIHZhbHVlOiBhbnkpOiB2b2lkIHtcblx0XHRcdFx0XHR2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0Kytjb21wbGV0ZTtcblx0XHRcdFx0XHRmaW5pc2goKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbmlzaCgpOiB2b2lkIHtcblx0XHRcdFx0XHRpZiAocG9wdWxhdGluZyB8fCBjb21wbGV0ZSA8IHRvdGFsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUodmFsdWVzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHByb2Nlc3NJdGVtKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSk6IHZvaWQge1xuXHRcdFx0XHRcdCsrdG90YWw7XG5cdFx0XHRcdFx0aWYgKGlzVGhlbmFibGUoaXRlbSkpIHtcblx0XHRcdFx0XHRcdC8vIElmIGFuIGl0ZW0gUHJvbWlzZSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxuXHRcdFx0XHRcdFx0Ly8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cblx0XHRcdFx0XHRcdGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRwcm9jZXNzSXRlbShpLCB2YWx1ZSk7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBvcHVsYXRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRmaW5pc2goKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByYWNlPFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUIHwgUHJvbWlzZUxpa2U8VD4+IHwgKFQgfCBQcm9taXNlTGlrZTxUPilbXSk6IFByb21pc2U8VFtdPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZTogKHZhbHVlPzogYW55KSA9PiB2b2lkLCByZWplY3QpIHtcblx0XHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRcdFx0XHQvLyBJZiBhIFByb21pc2UgaXRlbSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxuXHRcdFx0XHRcdFx0Ly8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cblx0XHRcdFx0XHRcdGl0ZW0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihyZXNvbHZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByZWplY3QocmVhc29uPzogYW55KTogUHJvbWlzZTxuZXZlcj4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRyZWplY3QocmVhc29uKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByZXNvbHZlKCk6IFByb21pc2U8dm9pZD47XG5cdFx0c3RhdGljIHJlc29sdmU8VD4odmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IFByb21pc2U8VD47XG5cdFx0c3RhdGljIHJlc29sdmU8VD4odmFsdWU/OiBhbnkpOiBQcm9taXNlPFQ+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlKSB7XG5cdFx0XHRcdHJlc29sdmUoPFQ+dmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIFtTeW1ib2wuc3BlY2llc106IFByb21pc2VDb25zdHJ1Y3RvciA9IFNoaW1Qcm9taXNlIGFzIFByb21pc2VDb25zdHJ1Y3RvcjtcblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYSBuZXcgUHJvbWlzZS5cblx0XHQgKlxuXHRcdCAqIEBjb25zdHJ1Y3RvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIGV4ZWN1dG9yXG5cdFx0ICogVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBpbW1lZGlhdGVseSB3aGVuIHRoZSBQcm9taXNlIGlzIGluc3RhbnRpYXRlZC4gSXQgaXMgcmVzcG9uc2libGUgZm9yXG5cdFx0ICogc3RhcnRpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hlbiBpdCBpcyBpbnZva2VkLlxuXHRcdCAqXG5cdFx0ICogVGhlIGV4ZWN1dG9yIG11c3QgY2FsbCBlaXRoZXIgdGhlIHBhc3NlZCBgcmVzb2x2ZWAgZnVuY3Rpb24gd2hlbiB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkXG5cdFx0ICogc3VjY2Vzc2Z1bGx5LCBvciB0aGUgYHJlamVjdGAgZnVuY3Rpb24gd2hlbiB0aGUgb3BlcmF0aW9uIGZhaWxzLlxuXHRcdCAqL1xuXHRcdGNvbnN0cnVjdG9yKGV4ZWN1dG9yOiBFeGVjdXRvcjxUPikge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBJZiB0cnVlLCB0aGUgcmVzb2x1dGlvbiBvZiB0aGlzIHByb21pc2UgaXMgY2hhaW5lZCAoXCJsb2NrZWQgaW5cIikgdG8gYW5vdGhlciBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRsZXQgaXNDaGFpbmVkID0gZmFsc2U7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogV2hldGhlciBvciBub3QgdGhpcyBwcm9taXNlIGlzIGluIGEgcmVzb2x2ZWQgc3RhdGUuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IGlzUmVzb2x2ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnN0YXRlICE9PSBTdGF0ZS5QZW5kaW5nIHx8IGlzQ2hhaW5lZDtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ2FsbGJhY2tzIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgb25jZSB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkLlxuXHRcdFx0ICovXG5cdFx0XHRsZXQgY2FsbGJhY2tzOiBudWxsIHwgKEFycmF5PCgpID0+IHZvaWQ+KSA9IFtdO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIEluaXRpYWxseSBwdXNoZXMgY2FsbGJhY2tzIG9udG8gYSBxdWV1ZSBmb3IgZXhlY3V0aW9uIG9uY2UgdGhpcyBwcm9taXNlIHNldHRsZXMuIEFmdGVyIHRoZSBwcm9taXNlIHNldHRsZXMsXG5cdFx0XHQgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXG5cdFx0XHQgKi9cblx0XHRcdGxldCB3aGVuRmluaXNoZWQgPSBmdW5jdGlvbihjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuXHRcdFx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIFNldHRsZXMgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBzZXR0bGUgPSAobmV3U3RhdGU6IFN0YXRlLCB2YWx1ZTogYW55KTogdm9pZCA9PiB7XG5cdFx0XHRcdC8vIEEgcHJvbWlzZSBjYW4gb25seSBiZSBzZXR0bGVkIG9uY2UuXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlICE9PSBTdGF0ZS5QZW5kaW5nKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zdGF0ZSA9IG5ld1N0YXRlO1xuXHRcdFx0XHR0aGlzLnJlc29sdmVkVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0d2hlbkZpbmlzaGVkID0gcXVldWVNaWNyb1Rhc2s7XG5cblx0XHRcdFx0Ly8gT25seSBlbnF1ZXVlIGEgY2FsbGJhY2sgcnVubmVyIGlmIHRoZXJlIGFyZSBjYWxsYmFja3Mgc28gdGhhdCBpbml0aWFsbHkgZnVsZmlsbGVkIFByb21pc2VzIGRvbid0IGhhdmUgdG9cblx0XHRcdFx0Ly8gd2FpdCBhbiBleHRyYSB0dXJuLlxuXHRcdFx0XHRpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cXVldWVNaWNyb1Rhc2soZnVuY3Rpb24oKTogdm9pZCB7XG5cdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBjb3VudCA9IGNhbGxiYWNrcy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrc1tpXS5jYWxsKG51bGwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrcyA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCByZXNvbHZlID0gKG5ld1N0YXRlOiBTdGF0ZSwgdmFsdWU6IGFueSk6IHZvaWQgPT4ge1xuXHRcdFx0XHRpZiAoaXNSZXNvbHZlZCgpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzVGhlbmFibGUodmFsdWUpKSB7XG5cdFx0XHRcdFx0dmFsdWUudGhlbihzZXR0bGUuYmluZChudWxsLCBTdGF0ZS5GdWxmaWxsZWQpLCBzZXR0bGUuYmluZChudWxsLCBTdGF0ZS5SZWplY3RlZCkpO1xuXHRcdFx0XHRcdGlzQ2hhaW5lZCA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2V0dGxlKG5ld1N0YXRlLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMudGhlbiA9IDxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuXHRcdFx0XHRvbkZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdFx0XHRcdG9uUmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0XHQpOiBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+ID0+IHtcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHQvLyB3aGVuRmluaXNoZWQgaW5pdGlhbGx5IHF1ZXVlcyB1cCBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBhZnRlciB0aGUgcHJvbWlzZSBoYXMgc2V0dGxlZC4gT25jZSB0aGVcblx0XHRcdFx0XHQvLyBwcm9taXNlIGhhcyBzZXR0bGVkLCB3aGVuRmluaXNoZWQgd2lsbCBzY2hlZHVsZSBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCB0dXJuIHRocm91Z2ggdGhlXG5cdFx0XHRcdFx0Ly8gZXZlbnQgbG9vcC5cblx0XHRcdFx0XHR3aGVuRmluaXNoZWQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2s6ICgodmFsdWU/OiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgfCBudWxsID1cblx0XHRcdFx0XHRcdFx0dGhpcy5zdGF0ZSA9PT0gU3RhdGUuUmVqZWN0ZWQgPyBvblJlamVjdGVkIDogb25GdWxmaWxsZWQ7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhbGxiYWNrKHRoaXMucmVzb2x2ZWRWYWx1ZSkpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZSA9PT0gU3RhdGUuUmVqZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KHRoaXMucmVzb2x2ZWRWYWx1ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHRoaXMucmVzb2x2ZWRWYWx1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZXhlY3V0b3IocmVzb2x2ZS5iaW5kKG51bGwsIFN0YXRlLkZ1bGZpbGxlZCksIHJlc29sdmUuYmluZChudWxsLCBTdGF0ZS5SZWplY3RlZCkpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0c2V0dGxlKFN0YXRlLlJlamVjdGVkLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihcblx0XHRcdG9uUmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0IHwgUHJvbWlzZUxpa2U8VFJlc3VsdD4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdCk6IFByb21pc2U8VCB8IFRSZXN1bHQ+IHtcblx0XHRcdHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIHByb21pc2UuXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBzdGF0ZSA9IFN0YXRlLlBlbmRpbmc7XG5cblx0XHQvKipcblx0XHQgKiBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIHtUfGFueX1cblx0XHQgKi9cblx0XHRwcml2YXRlIHJlc29sdmVkVmFsdWU6IGFueTtcblxuXHRcdHRoZW46IDxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuXHRcdFx0b25mdWxmaWxsZWQ/OiAoKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPikgfCB1bmRlZmluZWQgfCBudWxsLFxuXHRcdFx0b25yZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHQpID0+IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XG5cblx0XHRbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1Byb21pc2UnID0gJ1Byb21pc2UnO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaGltUHJvbWlzZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBQcm9taXNlLnRzIiwiaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgZ2V0VmFsdWVEZXNjcmlwdG9yIH0gZnJvbSAnLi9zdXBwb3J0L3V0aWwnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG5cdGludGVyZmFjZSBTeW1ib2xDb25zdHJ1Y3RvciB7XG5cdFx0b2JzZXJ2YWJsZTogc3ltYm9sO1xuXHR9XG59XG5cbmV4cG9ydCBsZXQgU3ltYm9sOiBTeW1ib2xDb25zdHJ1Y3RvciA9IGdsb2JhbC5TeW1ib2w7XG5cbmlmICghaGFzKCdlczYtc3ltYm9sJykpIHtcblx0LyoqXG5cdCAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXG5cdCAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4ge3N5bWJvbH0gICAgICAgUmV0dXJucyB0aGUgc3ltYm9sIG9yIHRocm93c1xuXHQgKi9cblx0Y29uc3QgdmFsaWRhdGVTeW1ib2wgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZTogYW55KTogc3ltYm9sIHtcblx0XHRpZiAoIWlzU3ltYm9sKHZhbHVlKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcih2YWx1ZSArICcgaXMgbm90IGEgc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblxuXHRjb25zdCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG5cdGNvbnN0IGRlZmluZVByb3BlcnR5OiAoXG5cdFx0bzogYW55LFxuXHRcdHA6IHN0cmluZyB8IHN5bWJvbCxcblx0XHRhdHRyaWJ1dGVzOiBQcm9wZXJ0eURlc2NyaXB0b3IgJiBUaGlzVHlwZTxhbnk+XG5cdCkgPT4gYW55ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5IGFzIGFueTtcblx0Y29uc3QgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuXHRjb25zdCBvYmpQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cdGNvbnN0IGdsb2JhbFN5bWJvbHM6IHsgW2tleTogc3RyaW5nXTogc3ltYm9sIH0gPSB7fTtcblxuXHRjb25zdCBnZXRTeW1ib2xOYW1lID0gKGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGRlc2M6IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XG5cdFx0XHRsZXQgcG9zdGZpeCA9IDA7XG5cdFx0XHRsZXQgbmFtZTogc3RyaW5nO1xuXHRcdFx0d2hpbGUgKGNyZWF0ZWRbU3RyaW5nKGRlc2MpICsgKHBvc3RmaXggfHwgJycpXSkge1xuXHRcdFx0XHQrK3Bvc3RmaXg7XG5cdFx0XHR9XG5cdFx0XHRkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcblx0XHRcdGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xuXHRcdFx0bmFtZSA9ICdAQCcgKyBkZXNjO1xuXG5cdFx0XHQvLyBGSVhNRTogVGVtcG9yYXJ5IGd1YXJkIHVudGlsIHRoZSBkdXBsaWNhdGUgZXhlY3V0aW9uIHdoZW4gdGVzdGluZyBjYW4gYmVcblx0XHRcdC8vIHBpbm5lZCBkb3duLlxuXHRcdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialByb3RvdHlwZSwgbmFtZSkpIHtcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCB7XG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih0aGlzOiBTeW1ib2wsIHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0XHRcdGRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH07XG5cdH0pKCk7XG5cblx0Y29uc3QgSW50ZXJuYWxTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2wodGhpczogYW55LCBkZXNjcmlwdGlvbj86IHN0cmluZyB8IG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBJbnRlcm5hbFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0cmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XG5cdH07XG5cblx0U3ltYm9sID0gZ2xvYmFsLlN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCh0aGlzOiBTeW1ib2wsIGRlc2NyaXB0aW9uPzogc3RyaW5nIHwgbnVtYmVyKTogc3ltYm9sIHtcblx0XHRpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0Y29uc3Qgc3ltID0gT2JqZWN0LmNyZWF0ZShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUpO1xuXHRcdGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcblx0XHRyZXR1cm4gZGVmaW5lUHJvcGVydGllcyhzeW0sIHtcblx0XHRcdF9fZGVzY3JpcHRpb25fXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcblx0XHRcdF9fbmFtZV9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZShkZXNjcmlwdGlvbikpXG5cdFx0fSk7XG5cdH0gYXMgU3ltYm9sQ29uc3RydWN0b3I7XG5cblx0LyogRGVjb3JhdGUgdGhlIFN5bWJvbCBmdW5jdGlvbiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBwcm9wZXJ0aWVzICovXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdFN5bWJvbCxcblx0XHQnZm9yJyxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24oa2V5OiBzdHJpbmcpOiBzeW1ib2wge1xuXHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkge1xuXHRcdFx0XHRyZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcblx0XHR9KVxuXHQpO1xuXHRkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbCwge1xuXHRcdGtleUZvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHN5bTogc3ltYm9sKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0XHRcdGxldCBrZXk6IHN0cmluZztcblx0XHRcdHZhbGlkYXRlU3ltYm9sKHN5bSk7XG5cdFx0XHRmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzKSB7XG5cdFx0XHRcdGlmIChnbG9iYWxTeW1ib2xzW2tleV0gPT09IHN5bSkge1xuXHRcdFx0XHRcdHJldHVybiBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KSxcblx0XHRoYXNJbnN0YW5jZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2hhc0luc3RhbmNlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXNDb25jYXRTcHJlYWRhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpdGVyYXRvcicpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdG1hdGNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignbWF0Y2gnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRvYnNlcnZhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignb2JzZXJ2YWJsZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHJlcGxhY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdyZXBsYWNlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c2VhcmNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c3BlY2llczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwZWNpZXMnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzcGxpdDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwbGl0JyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dG9QcmltaXRpdmU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvU3RyaW5nVGFnOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9TdHJpbmdUYWcnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR1bnNjb3BhYmxlczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3Vuc2NvcGFibGVzJyksIGZhbHNlLCBmYWxzZSlcblx0fSk7XG5cblx0LyogRGVjb3JhdGUgdGhlIEludGVybmFsU3ltYm9sIG9iamVjdCAqL1xuXHRkZWZpbmVQcm9wZXJ0aWVzKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwge1xuXHRcdGNvbnN0cnVjdG9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKSxcblx0XHR0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKFxuXHRcdFx0ZnVuY3Rpb24odGhpczogeyBfX25hbWVfXzogc3RyaW5nIH0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX19uYW1lX187XG5cdFx0XHR9LFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRmYWxzZVxuXHRcdClcblx0fSk7XG5cblx0LyogRGVjb3JhdGUgdGhlIFN5bWJvbC5wcm90b3R5cGUgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhTeW1ib2wucHJvdG90eXBlLCB7XG5cdFx0dG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiAnU3ltYm9sICgnICsgKDxhbnk+dmFsaWRhdGVTeW1ib2wodGhpcykpLl9fZGVzY3JpcHRpb25fXyArICcpJztcblx0XHR9KSxcblx0XHR2YWx1ZU9mOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdFx0fSlcblx0fSk7XG5cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0U3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpO1xuXHRcdH0pXG5cdCk7XG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcblxuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsXG5cdFx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcigoPGFueT5TeW1ib2wpLnByb3RvdHlwZVtTeW1ib2wudG9QcmltaXRpdmVdLCBmYWxzZSwgZmFsc2UsIHRydWUpXG5cdCk7XG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdEludGVybmFsU3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9TdHJpbmdUYWcsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKCg8YW55PlN5bWJvbCkucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10sIGZhbHNlLCBmYWxzZSwgdHJ1ZSlcblx0KTtcbn1cblxuLyoqXG4gKiBBIGN1c3RvbSBndWFyZCBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgaWYgYW4gb2JqZWN0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHBhcmFtICB7YW55fSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2sgdG8gc2VlIGlmIGl0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzeW1ib2wge1xuXHRyZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGVtXG4gKi9cbltcblx0J2hhc0luc3RhbmNlJyxcblx0J2lzQ29uY2F0U3ByZWFkYWJsZScsXG5cdCdpdGVyYXRvcicsXG5cdCdzcGVjaWVzJyxcblx0J3JlcGxhY2UnLFxuXHQnc2VhcmNoJyxcblx0J3NwbGl0Jyxcblx0J21hdGNoJyxcblx0J3RvUHJpbWl0aXZlJyxcblx0J3RvU3RyaW5nVGFnJyxcblx0J3Vuc2NvcGFibGVzJyxcblx0J29ic2VydmFibGUnXG5dLmZvckVhY2goKHdlbGxLbm93bikgPT4ge1xuXHRpZiAoIShTeW1ib2wgYXMgYW55KVt3ZWxsS25vd25dKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbCwgd2VsbEtub3duLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcih3ZWxsS25vd24pLCBmYWxzZSwgZmFsc2UpKTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBTeW1ib2wudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlLCBJdGVyYWJsZSB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdlYWtNYXA8SyBleHRlbmRzIG9iamVjdCwgVj4ge1xuXHQvKipcblx0ICogUmVtb3ZlIGEgYGtleWAgZnJvbSB0aGUgbWFwXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byByZW1vdmVcblx0ICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIHZhbHVlIHdhcyByZW1vdmVkLCBvdGhlcndpc2UgYGZhbHNlYFxuXHQgKi9cblx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSB2YWx1ZSwgYmFzZWQgb24gdGhlIHN1cHBsaWVkIGBrZXlgXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byByZXRyaWV2ZSB0aGUgYHZhbHVlYCBmb3Jcblx0ICogQHJldHVybiB0aGUgYHZhbHVlYCBiYXNlZCBvbiB0aGUgYGtleWAgaWYgZm91bmQsIG90aGVyd2lzZSBgZmFsc2VgXG5cdCAqL1xuXHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyBpZiBhIGBrZXlgIGlzIHByZXNlbnQgaW4gdGhlIG1hcFxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBga2V5YCB0byBjaGVja1xuXHQgKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUga2V5IGlzIHBhcnQgb2YgdGhlIG1hcCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG5cdCAqL1xuXHRoYXMoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU2V0IGEgYHZhbHVlYCBmb3IgYSBwYXJ0aWN1bGFyIGBrZXlgLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBga2V5YCB0byBzZXQgdGhlIGB2YWx1ZWAgZm9yXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgYHZhbHVlYCB0byBzZXRcblx0ICogQHJldHVybiB0aGUgaW5zdGFuY2VzXG5cdCAqL1xuXHRzZXQoa2V5OiBLLCB2YWx1ZTogVik6IHRoaXM7XG5cblx0cmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106ICdXZWFrTWFwJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXZWFrTWFwQ29uc3RydWN0b3Ige1xuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0bmV3ICgpOiBXZWFrTWFwPG9iamVjdCwgYW55PjtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmFibGUgQW4gaXRlcmFibGUgdGhhdCBjb250YWlucyB5aWVsZHMgdXAga2V5L3ZhbHVlIHBhaXIgZW50cmllc1xuXHQgKi9cblx0bmV3IDxLIGV4dGVuZHMgb2JqZWN0LCBWPihpdGVyYWJsZT86IFtLLCBWXVtdKTogV2Vha01hcDxLLCBWPjtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmFibGUgQW4gaXRlcmFibGUgdGhhdCBjb250YWlucyB5aWVsZHMgdXAga2V5L3ZhbHVlIHBhaXIgZW50cmllc1xuXHQgKi9cblx0bmV3IDxLIGV4dGVuZHMgb2JqZWN0LCBWPihpdGVyYWJsZTogSXRlcmFibGU8W0ssIFZdPik6IFdlYWtNYXA8SywgVj47XG5cblx0cmVhZG9ubHkgcHJvdG90eXBlOiBXZWFrTWFwPG9iamVjdCwgYW55Pjtcbn1cblxuZXhwb3J0IGxldCBXZWFrTWFwOiBXZWFrTWFwQ29uc3RydWN0b3IgPSBnbG9iYWwuV2Vha01hcDtcblxuaW50ZXJmYWNlIEVudHJ5PEssIFY+IHtcblx0a2V5OiBLO1xuXHR2YWx1ZTogVjtcbn1cblxuaWYgKCFoYXMoJ2VzNi13ZWFrbWFwJykpIHtcblx0Y29uc3QgREVMRVRFRDogYW55ID0ge307XG5cblx0Y29uc3QgZ2V0VUlEID0gZnVuY3Rpb24gZ2V0VUlEKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XG5cdH07XG5cblx0Y29uc3QgZ2VuZXJhdGVOYW1lID0gKGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzdGFydElkID0gTWF0aC5mbG9vcihEYXRlLm5vdygpICUgMTAwMDAwMDAwKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoKTogc3RyaW5nIHtcblx0XHRcdHJldHVybiAnX193bScgKyBnZXRVSUQoKSArIChzdGFydElkKysgKyAnX18nKTtcblx0XHR9O1xuXHR9KSgpO1xuXG5cdFdlYWtNYXAgPSBjbGFzcyBXZWFrTWFwPEssIFY+IHtcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9uYW1lOiBzdHJpbmc7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBfZnJvemVuRW50cmllczogRW50cnk8SywgVj5bXTtcblxuXHRcdGNvbnN0cnVjdG9yKGl0ZXJhYmxlPzogQXJyYXlMaWtlPFtLLCBWXT4gfCBJdGVyYWJsZTxbSywgVl0+KSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19uYW1lJywge1xuXHRcdFx0XHR2YWx1ZTogZ2VuZXJhdGVOYW1lKClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XG5cblx0XHRcdGlmIChpdGVyYWJsZSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbSA9IGl0ZXJhYmxlW2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQoaXRlbVswXSwgaXRlbVsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldChrZXksIHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIF9nZXRGcm96ZW5FbnRyeUluZGV4KGtleTogYW55KTogbnVtYmVyIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZnJvemVuRW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGhpcy5fZnJvemVuRW50cmllc1tpXS5rZXkgPT09IGtleSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRkZWxldGUoa2V5OiBhbnkpOiBib29sZWFuIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpIHtcblx0XHRcdFx0ZW50cnkudmFsdWUgPSBERUxFVEVEO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzLnNwbGljZShmcm96ZW5JbmRleCwgMSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Z2V0KGtleTogYW55KTogViB8IHVuZGVmaW5lZCB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xuXHRcdFx0XHRyZXR1cm4gZW50cnkudmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xuXHRcdFx0aWYgKGZyb3plbkluZGV4ID49IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2Zyb3plbkVudHJpZXNbZnJvemVuSW5kZXhdLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChCb29sZWFuKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHNldChrZXk6IGFueSwgdmFsdWU/OiBhbnkpOiB0aGlzIHtcblx0XHRcdGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIHVzZWQgYXMgd2VhayBtYXAga2V5Jyk7XG5cdFx0XHR9XG5cdFx0XHRsZXQgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKCFlbnRyeSB8fCBlbnRyeS5rZXkgIT09IGtleSkge1xuXHRcdFx0XHRlbnRyeSA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuXHRcdFx0XHRcdGtleTogeyB2YWx1ZToga2V5IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKE9iamVjdC5pc0Zyb3plbihrZXkpKSB7XG5cdFx0XHRcdFx0dGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoa2V5LCB0aGlzLl9uYW1lLCB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogZW50cnlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZW50cnkudmFsdWUgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnV2Vha01hcCcgPSAnV2Vha01hcCc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdlYWtNYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gV2Vha01hcC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UsIGlzSXRlcmFibGUsIEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgeyBNQVhfU0FGRV9JTlRFR0VSIH0gZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwQ2FsbGJhY2s8VCwgVT4ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIG1hcHBpbmdcblx0ICpcblx0ICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgbWFwcGVkXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgZWxlbWVudFxuXHQgKi9cblx0KGVsZW1lbnQ6IFQsIGluZGV4OiBudW1iZXIpOiBVO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbmRDYWxsYmFjazxUPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdXNpbmcgZmluZFxuXHQgKlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IGlzIGN1cnJlbnR5IGJlaW5nIGFuYWx5c2VkXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGFuYWx5c2VkXG5cdCAqIEBwYXJhbSBhcnJheSBUaGUgc291cmNlIGFycmF5XG5cdCAqL1xuXHQoZWxlbWVudDogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IEFycmF5TGlrZTxUPik6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBXcml0YWJsZUFycmF5TGlrZTxUPiB7XG5cdHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyO1xuXHRbbjogbnVtYmVyXTogVDtcbn1cblxuLyogRVM2IEFycmF5IHN0YXRpYyBtZXRob2RzICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRnJvbSB7XG5cdC8qKlxuXHQgKiBUaGUgQXJyYXkuZnJvbSgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IEFycmF5IGluc3RhbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgQW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheVxuXHQgKiBAcGFyYW0gbWFwRnVuY3Rpb24gQSBtYXAgZnVuY3Rpb24gdG8gY2FsbCBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIGFycmF5XG5cdCAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIG1hcCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIFRoZSBuZXcgQXJyYXlcblx0ICovXG5cdDxULCBVPihzb3VyY2U6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+LCBtYXBGdW5jdGlvbjogTWFwQ2FsbGJhY2s8VCwgVT4sIHRoaXNBcmc/OiBhbnkpOiBBcnJheTxVPjtcblxuXHQvKipcblx0ICogVGhlIEFycmF5LmZyb20oKSBtZXRob2QgY3JlYXRlcyBhIG5ldyBBcnJheSBpbnN0YW5jZSBmcm9tIGFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIEFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYW4gYXJyYXlcblx0ICogQHJldHVybiBUaGUgbmV3IEFycmF5XG5cdCAqL1xuXHQ8VD4oc291cmNlOiBBcnJheUxpa2U8VD4gfCBJdGVyYWJsZTxUPik6IEFycmF5PFQ+O1xufVxuXG5leHBvcnQgbGV0IGZyb206IEZyb207XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBhcnJheSBmcm9tIHRoZSBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSBhcmd1bWVudHMgQW55IG51bWJlciBvZiBhcmd1bWVudHMgZm9yIHRoZSBhcnJheVxuICogQHJldHVybiBBbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHNcbiAqL1xuZXhwb3J0IGxldCBvZjogPFQ+KC4uLml0ZW1zOiBUW10pID0+IEFycmF5PFQ+O1xuXG4vKiBFUzYgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIENvcGllcyBkYXRhIGludGVybmFsbHkgd2l0aGluIGFuIGFycmF5IG9yIGFycmF5LWxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIG9mZnNldCBUaGUgaW5kZXggdG8gc3RhcnQgY29weWluZyB2YWx1ZXMgdG87IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IChpbmNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcGFyYW0gZW5kIFRoZSBsYXN0IChleGNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcmV0dXJuIFRoZSB0YXJnZXRcbiAqL1xuZXhwb3J0IGxldCBjb3B5V2l0aGluOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIG9mZnNldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IEFycmF5TGlrZTxUPjtcblxuLyoqXG4gKiBGaWxscyBlbGVtZW50cyBvZiBhbiBhcnJheS1saWtlIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHRvIGZpbGxcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBlYWNoIGVsZW1lbnQgb2YgdGhlIHRhcmdldCB3aXRoXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IGluZGV4IHRvIGZpbGxcbiAqIEBwYXJhbSBlbmQgVGhlIChleGNsdXNpdmUpIGluZGV4IGF0IHdoaWNoIHRvIHN0b3AgZmlsbGluZ1xuICogQHJldHVybiBUaGUgZmlsbGVkIHRhcmdldFxuICovXG5leHBvcnQgbGV0IGZpbGw6IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgdmFsdWU6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IEFycmF5TGlrZTxUPjtcblxuLyoqXG4gKiBGaW5kcyBhbmQgcmV0dXJucyB0aGUgZmlyc3QgaW5zdGFuY2UgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrIG9yIHVuZGVmaW5lZCBpZiBvbmUgaXMgbm90IGZvdW5kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyBpZiB0aGUgY3VycmVudCB2YWx1ZSBtYXRjaGVzIGEgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrLCBvciB1bmRlZmluZWQgaWYgb25lIGRvZXMgbm90IGV4aXN0XG4gKi9cbmV4cG9ydCBsZXQgZmluZDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pID0+IFQgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgc2VhcmNoIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbmRleCB3aG9zZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHBhc3NlZCBjYWxsYmFjayxcbiAqIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyB0cnVlIGlmIHRoZSBjdXJyZW50IHZhbHVlIHNhdGlzZmllcyBpdHMgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLCBvciAtMSBpZiBubyB2YWx1ZXMgc2F0aXNmeSBpdFxuICovXG5leHBvcnQgbGV0IGZpbmRJbmRleDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pID0+IG51bWJlcjtcblxuLyogRVM3IEFycmF5IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gYXJyYXkgaW5jbHVkZXMgYSBnaXZlbiB2YWx1ZVxuICpcbiAqIEBwYXJhbSB0YXJnZXQgdGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIHNlYXJjaEVsZW1lbnQgdGhlIGl0ZW0gdG8gc2VhcmNoIGZvclxuICogQHBhcmFtIGZyb21JbmRleCB0aGUgc3RhcnRpbmcgaW5kZXggdG8gc2VhcmNoIGZyb21cbiAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBhcnJheSBpbmNsdWRlcyB0aGUgZWxlbWVudCwgb3RoZXJ3aXNlIGBmYWxzZWBcbiAqL1xuZXhwb3J0IGxldCBpbmNsdWRlczogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBzZWFyY2hFbGVtZW50OiBULCBmcm9tSW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbmlmIChoYXMoJ2VzNi1hcnJheScpICYmIGhhcygnZXM2LWFycmF5LWZpbGwnKSkge1xuXHRmcm9tID0gZ2xvYmFsLkFycmF5LmZyb207XG5cdG9mID0gZ2xvYmFsLkFycmF5Lm9mO1xuXHRjb3B5V2l0aGluID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xuXHRmaWxsID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbGwpO1xuXHRmaW5kID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbmQpO1xuXHRmaW5kSW5kZXggPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcbn0gZWxzZSB7XG5cdC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXG5cdC8vIFRvIG1ha2UgdGhpbmdzIGVhc2llciwgaWYgdGhlcmUgaXMgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiwgdGhlIHdob2xlIHNldCBvZiBmdW5jdGlvbnMgd2lsbCBiZSBmaWxsZWRcblxuXHQvKipcblx0ICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxuXHQgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxuXHQgKi9cblx0Y29uc3QgdG9MZW5ndGggPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG5cdFx0aWYgKGlzTmFOKGxlbmd0aCkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuXHRcdGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG5cdFx0XHRsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XG5cdFx0fVxuXHRcdC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXG5cdFx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBGcm9tIEVTNiA3LjEuNCBUb0ludGVnZXIoKVxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgQSB2YWx1ZSB0byBjb252ZXJ0XG5cdCAqIEByZXR1cm4gQW4gaW50ZWdlclxuXHQgKi9cblx0Y29uc3QgdG9JbnRlZ2VyID0gZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlOiBhbnkpOiBudW1iZXIge1xuXHRcdHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblx0XHRpZiAoaXNOYU4odmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKHZhbHVlID09PSAwIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHZhbHVlID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIG9yaWdpbmFsIG9mZnNldFxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3Rcblx0ICogQHJldHVybiBJZiBuZWdhdGl2ZSwgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gdGhlIGVuZCAobGVuZ3RoKTsgb3RoZXJ3aXNlIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIDBcblx0ICovXG5cdGNvbnN0IG5vcm1hbGl6ZU9mZnNldCA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG5cdFx0cmV0dXJuIHZhbHVlIDwgMCA/IE1hdGgubWF4KGxlbmd0aCArIHZhbHVlLCAwKSA6IE1hdGgubWluKHZhbHVlLCBsZW5ndGgpO1xuXHR9O1xuXG5cdGZyb20gPSBmdW5jdGlvbiBmcm9tKFxuXHRcdHRoaXM6IEFycmF5Q29uc3RydWN0b3IsXG5cdFx0YXJyYXlMaWtlOiBJdGVyYWJsZTxhbnk+IHwgQXJyYXlMaWtlPGFueT4sXG5cdFx0bWFwRnVuY3Rpb24/OiBNYXBDYWxsYmFjazxhbnksIGFueT4sXG5cdFx0dGhpc0FyZz86IGFueVxuXHQpOiBBcnJheTxhbnk+IHtcblx0XHRpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2Zyb206IHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1hcEZ1bmN0aW9uICYmIHRoaXNBcmcpIHtcblx0XHRcdG1hcEZ1bmN0aW9uID0gbWFwRnVuY3Rpb24uYmluZCh0aGlzQXJnKTtcblx0XHR9XG5cblx0XHQvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xuXHRcdGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblx0XHRjb25zdCBsZW5ndGg6IG51bWJlciA9IHRvTGVuZ3RoKCg8YW55PmFycmF5TGlrZSkubGVuZ3RoKTtcblxuXHRcdC8vIFN1cHBvcnQgZXh0ZW5zaW9uXG5cdFx0Y29uc3QgYXJyYXk6IGFueVtdID1cblx0XHRcdHR5cGVvZiBDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IDxhbnlbXT5PYmplY3QobmV3IENvbnN0cnVjdG9yKGxlbmd0aCkpIDogbmV3IEFycmF5KGxlbmd0aCk7XG5cblx0XHRpZiAoIWlzQXJyYXlMaWtlKGFycmF5TGlrZSkgJiYgIWlzSXRlcmFibGUoYXJyYXlMaWtlKSkge1xuXHRcdFx0cmV0dXJuIGFycmF5O1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgYW5kIHRoZSBub3JtYWxpemVkIGxlbmd0aCBpcyAwLCBqdXN0IHJldHVybiBhbiBlbXB0eSBhcnJheS4gdGhpcyBwcmV2ZW50cyBhIHByb2JsZW1cblx0XHQvLyB3aXRoIHRoZSBpdGVyYXRpb24gb24gSUUgd2hlbiB1c2luZyBhIE5hTiBhcnJheSBsZW5ndGguXG5cdFx0aWYgKGlzQXJyYXlMaWtlKGFycmF5TGlrZSkpIHtcblx0XHRcdGlmIChsZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5TGlrZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGkgPSAwO1xuXHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBhcnJheUxpa2UpIHtcblx0XHRcdFx0YXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKHZhbHVlLCBpKSA6IHZhbHVlO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCg8YW55PmFycmF5TGlrZSkubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGFycmF5Lmxlbmd0aCA9IGxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyYXk7XG5cdH07XG5cblx0b2YgPSBmdW5jdGlvbiBvZjxUPiguLi5pdGVtczogVFtdKTogQXJyYXk8VD4ge1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcyk7XG5cdH07XG5cblx0Y29weVdpdGhpbiA9IGZ1bmN0aW9uIGNvcHlXaXRoaW48VD4oXG5cdFx0dGFyZ2V0OiBBcnJheUxpa2U8VD4sXG5cdFx0b2Zmc2V0OiBudW1iZXIsXG5cdFx0c3RhcnQ6IG51bWJlcixcblx0XHRlbmQ/OiBudW1iZXJcblx0KTogQXJyYXlMaWtlPFQ+IHtcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvcHlXaXRoaW46IHRhcmdldCBtdXN0IGJlIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cdFx0b2Zmc2V0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihvZmZzZXQpLCBsZW5ndGgpO1xuXHRcdHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XG5cdFx0ZW5kID0gbm9ybWFsaXplT2Zmc2V0KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCksIGxlbmd0aCk7XG5cdFx0bGV0IGNvdW50ID0gTWF0aC5taW4oZW5kIC0gc3RhcnQsIGxlbmd0aCAtIG9mZnNldCk7XG5cblx0XHRsZXQgZGlyZWN0aW9uID0gMTtcblx0XHRpZiAob2Zmc2V0ID4gc3RhcnQgJiYgb2Zmc2V0IDwgc3RhcnQgKyBjb3VudCkge1xuXHRcdFx0ZGlyZWN0aW9uID0gLTE7XG5cdFx0XHRzdGFydCArPSBjb3VudCAtIDE7XG5cdFx0XHRvZmZzZXQgKz0gY291bnQgLSAxO1xuXHRcdH1cblxuXHRcdHdoaWxlIChjb3VudCA+IDApIHtcblx0XHRcdGlmIChzdGFydCBpbiB0YXJnZXQpIHtcblx0XHRcdFx0KHRhcmdldCBhcyBXcml0YWJsZUFycmF5TGlrZTxUPilbb2Zmc2V0XSA9IHRhcmdldFtzdGFydF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgKHRhcmdldCBhcyBXcml0YWJsZUFycmF5TGlrZTxUPilbb2Zmc2V0XTtcblx0XHRcdH1cblxuXHRcdFx0b2Zmc2V0ICs9IGRpcmVjdGlvbjtcblx0XHRcdHN0YXJ0ICs9IGRpcmVjdGlvbjtcblx0XHRcdGNvdW50LS07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuXHRmaWxsID0gZnVuY3Rpb24gZmlsbDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgdmFsdWU6IGFueSwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcik6IEFycmF5TGlrZTxUPiB7XG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cdFx0bGV0IGkgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcblx0XHRlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcblxuXHRcdHdoaWxlIChpIDwgZW5kKSB7XG5cdFx0XHQodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtpKytdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuXHRmaW5kID0gZnVuY3Rpb24gZmluZDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgY2FsbGJhY2s6IEZpbmRDYWxsYmFjazxUPiwgdGhpc0FyZz86IHt9KTogVCB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgaW5kZXggPSBmaW5kSW5kZXg8VD4odGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XG5cdFx0cmV0dXJuIGluZGV4ICE9PSAtMSA/IHRhcmdldFtpbmRleF0gOiB1bmRlZmluZWQ7XG5cdH07XG5cblx0ZmluZEluZGV4ID0gZnVuY3Rpb24gZmluZEluZGV4PFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pOiBudW1iZXIge1xuXHRcdGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXG5cdFx0aWYgKCFjYWxsYmFjaykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZmluZDogc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzQXJnKSB7XG5cdFx0XHRjYWxsYmFjayA9IGNhbGxiYWNrLmJpbmQodGhpc0FyZyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGNhbGxiYWNrKHRhcmdldFtpXSwgaSwgdGFyZ2V0KSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH07XG59XG5cbmlmIChoYXMoJ2VzNy1hcnJheScpKSB7XG5cdGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKTtcbn0gZWxzZSB7XG5cdC8qKlxuXHQgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cblx0ICpcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG5cdCAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXG5cdCAqL1xuXHRjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcblx0XHRpZiAoaXNOYU4obGVuZ3RoKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG5cdFx0XHRsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XG5cdFx0fVxuXHRcdC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXG5cdFx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xuXHR9O1xuXG5cdGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXM8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHNlYXJjaEVsZW1lbnQ6IFQsIGZyb21JbmRleDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuXHRcdGxldCBsZW4gPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblxuXHRcdGZvciAobGV0IGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0Y29uc3QgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XG5cdFx0XHRcdChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudClcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYXJyYXkudHMiLCJjb25zdCBnbG9iYWxPYmplY3Q6IGFueSA9IChmdW5jdGlvbigpOiBhbnkge1xuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyBnbG9iYWwgc3BlYyBkZWZpbmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IGNhbGxlZCAnZ2xvYmFsJ1xuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxuXHRcdC8vIGBnbG9iYWxgIGlzIGFsc28gZGVmaW5lZCBpbiBOb2RlSlNcblx0XHRyZXR1cm4gZ2xvYmFsO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gd2luZG93IGlzIGRlZmluZWQgaW4gYnJvd3NlcnNcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdsb2JhbE9iamVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBnbG9iYWwudHMiLCJpbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCB7IEhJR0hfU1VSUk9HQVRFX01BWCwgSElHSF9TVVJST0dBVEVfTUlOIH0gZnJvbSAnLi9zdHJpbmcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0cmVhZG9ubHkgZG9uZTogYm9vbGVhbjtcblx0cmVhZG9ubHkgdmFsdWU6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3I8VD4ge1xuXHRuZXh0KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cblx0cmV0dXJuPyh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG5cdHRocm93PyhlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmFibGU8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZUl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+O1xufVxuXG5jb25zdCBzdGF0aWNEb25lOiBJdGVyYXRvclJlc3VsdDxhbnk+ID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG5cbi8qKlxuICogQSBjbGFzcyB0aGF0IF9zaGltc18gYW4gaXRlcmF0b3IgaW50ZXJmYWNlIG9uIGFycmF5IGxpa2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoaW1JdGVyYXRvcjxUPiB7XG5cdHByaXZhdGUgX2xpc3Q6IEFycmF5TGlrZTxUPjtcblx0cHJpdmF0ZSBfbmV4dEluZGV4ID0gLTE7XG5cdHByaXZhdGUgX25hdGl2ZUl0ZXJhdG9yOiBJdGVyYXRvcjxUPjtcblxuXHRjb25zdHJ1Y3RvcihsaXN0OiBBcnJheUxpa2U8VD4gfCBJdGVyYWJsZTxUPikge1xuXHRcdGlmIChpc0l0ZXJhYmxlKGxpc3QpKSB7XG5cdFx0XHR0aGlzLl9uYXRpdmVJdGVyYXRvciA9IGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9saXN0ID0gbGlzdDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIHRoZSBuZXh0IGl0ZXJhdGlvbiByZXN1bHQgZm9yIHRoZSBJdGVyYXRvclxuXHQgKi9cblx0bmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG5cdFx0aWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbmF0aXZlSXRlcmF0b3IubmV4dCgpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuX2xpc3QpIHtcblx0XHRcdHJldHVybiBzdGF0aWNEb25lO1xuXHRcdH1cblx0XHRpZiAoKyt0aGlzLl9uZXh0SW5kZXggPCB0aGlzLl9saXN0Lmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZG9uZTogZmFsc2UsXG5cdFx0XHRcdHZhbHVlOiB0aGlzLl9saXN0W3RoaXMuX25leHRJbmRleF1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBzdGF0aWNEb25lO1xuXHR9XG5cblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxUPiB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBoYXMgYW4gSXRlcmFibGUgaW50ZXJmYWNlXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIEl0ZXJhYmxlPGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaXMgQXJyYXlMaWtlXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBBcnJheUxpa2U8YW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBmb3IgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBpdGVyYWJsZSBvYmplY3QgdG8gcmV0dXJuIHRoZSBpdGVyYXRvciBmb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldDxUPihpdGVyYWJsZTogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4pOiBJdGVyYXRvcjxUPiB8IHVuZGVmaW5lZCB7XG5cdGlmIChpc0l0ZXJhYmxlKGl0ZXJhYmxlKSkge1xuXHRcdHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cdH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG5cdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IoaXRlcmFibGUpO1xuXHR9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9yT2ZDYWxsYmFjazxUPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBhIGZvck9mKCkgaXRlcmF0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgY3VycmVudCB2YWx1ZVxuXHQgKiBAcGFyYW0gb2JqZWN0IFRoZSBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3ZlclxuXHQgKiBAcGFyYW0gZG9CcmVhayBBIGZ1bmN0aW9uLCBpZiBjYWxsZWQsIHdpbGwgc3RvcCB0aGUgaXRlcmF0aW9uXG5cdCAqL1xuXHQodmFsdWU6IFQsIG9iamVjdDogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4gfCBzdHJpbmcsIGRvQnJlYWs6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIG9iamVjdCB0aGUgcHJvdmlkZXMgYW4gaW50ZXJhdG9yIGludGVyZmFjZVxuICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIG9mIHRoZSBpdGVyYWJsZVxuICogQHBhcmFtIHRoaXNBcmcgT3B0aW9uYWwgc2NvcGUgdG8gcGFzcyB0aGUgY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvck9mPFQ+KFxuXHRpdGVyYWJsZTogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4gfCBzdHJpbmcsXG5cdGNhbGxiYWNrOiBGb3JPZkNhbGxiYWNrPFQ+LFxuXHR0aGlzQXJnPzogYW55XG4pOiB2b2lkIHtcblx0bGV0IGJyb2tlbiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIGRvQnJlYWsoKSB7XG5cdFx0YnJva2VuID0gdHJ1ZTtcblx0fVxuXG5cdC8qIFdlIG5lZWQgdG8gaGFuZGxlIGl0ZXJhdGlvbiBvZiBkb3VibGUgYnl0ZSBzdHJpbmdzIHByb3Blcmx5ICovXG5cdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xuXHRcdGNvbnN0IGwgPSBpdGVyYWJsZS5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcblx0XHRcdGxldCBjaGFyID0gaXRlcmFibGVbaV07XG5cdFx0XHRpZiAoaSArIDEgPCBsKSB7XG5cdFx0XHRcdGNvbnN0IGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG5cdFx0XHRcdGlmIChjb2RlID49IEhJR0hfU1VSUk9HQVRFX01JTiAmJiBjb2RlIDw9IEhJR0hfU1VSUk9HQVRFX01BWCkge1xuXHRcdFx0XHRcdGNoYXIgKz0gaXRlcmFibGVbKytpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRpZiAoYnJva2VuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xuXHRcdGlmIChpdGVyYXRvcikge1xuXHRcdFx0bGV0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcblxuXHRcdFx0d2hpbGUgKCFyZXN1bHQuZG9uZSkge1xuXHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xuXHRcdFx0XHRpZiAoYnJva2VuKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBpdGVyYXRvci50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuXG4vKipcbiAqIFRoZSBzbWFsbGVzdCBpbnRlcnZhbCBiZXR3ZWVuIHR3byByZXByZXNlbnRhYmxlIG51bWJlcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUFNJTE9OID0gMTtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9TQUZFX0lOVEVHRVIgPSAtTUFYX1NBRkVfSU5URUdFUjtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBOYU4gd2l0aG91dCBjb2Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgTmFOLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFOKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsLmlzTmFOKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXIgd2l0aG91dCBjb2Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgZmluaXRlLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNGaW5pdGUodmFsdWUpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXG4gKiAgIDIuIGl0IGhhcyBhIG9uZS10by1vbmUgbWFwcGluZyB0byBhIG1hdGhlbWF0aWNhbCBpbnRlZ2VyLCBtZWFuaW5nIGl0c1xuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZTogYW55KTogdmFsdWUgaXMgbnVtYmVyIHtcblx0cmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgTWF0aC5hYnModmFsdWUpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbnVtYmVyLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgaXNTeW1ib2wgfSBmcm9tICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0QXNzaWduIHtcblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVPih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuXG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKiBAcGFyYW0gc291cmNlMiBUaGUgc2Vjb25kIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVSwgVj4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuXG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKiBAcGFyYW0gc291cmNlMiBUaGUgc2Vjb25kIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UzIFRoZSB0aGlyZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFUsIFYsIFc+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVyk6IFQgJiBVICYgViAmIFc7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZXMgT25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXNcblx0ICovXG5cdCh0YXJnZXQ6IG9iamVjdCwgLi4uc291cmNlczogYW55W10pOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0RW50ZXJpZXMge1xuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXkvdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0PFQgZXh0ZW5kcyB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCk6IFtrZXlvZiBULCBUW0tdXVtdO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleS92YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQobzogb2JqZWN0KTogW3N0cmluZywgYW55XVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcnMge1xuXHQ8VD4obzogVCk6IHsgW0sgaW4ga2V5b2YgVF06IFByb3BlcnR5RGVzY3JpcHRvciB9O1xuXHQobzogYW55KTogeyBba2V5OiBzdHJpbmddOiBQcm9wZXJ0eURlc2NyaXB0b3IgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RWYWx1ZXMge1xuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiB2YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQ8VD4obzogeyBbczogc3RyaW5nXTogVCB9KTogVFtdO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdChvOiBvYmplY3QpOiBhbnlbXTtcbn1cblxuZXhwb3J0IGxldCBhc3NpZ246IE9iamVjdEFzc2lnbjtcblxuLyoqXG4gKiBHZXRzIHRoZSBvd24gcHJvcGVydHkgZGVzY3JpcHRvciBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdC5cbiAqIEFuIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIGlzIG9uZSB0aGF0IGlzIGRlZmluZWQgZGlyZWN0bHkgb24gdGhlIG9iamVjdCBhbmQgaXMgbm90XG4gKiBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIHAgTmFtZSBvZiB0aGUgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiA8VCwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQsIHByb3BlcnR5S2V5OiBLKSA9PiBQcm9wZXJ0eURlc2NyaXB0b3IgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC4gVGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBhcmUgdGhvc2UgdGhhdCBhcmUgZGVmaW5lZCBkaXJlY3RseVxuICogb24gdGhhdCBvYmplY3QsIGFuZCBhcmUgbm90IGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuIFRoZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBpbmNsdWRlIGJvdGggZmllbGRzIChvYmplY3RzKSBhbmQgZnVuY3Rpb25zLlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIG93biBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5TmFtZXM6IChvOiBhbnkpID0+IHN0cmluZ1tdO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHN5bWJvbCBwcm9wZXJ0aWVzIGZvdW5kIGRpcmVjdGx5IG9uIG9iamVjdCBvLlxuICogQHBhcmFtIG8gT2JqZWN0IHRvIHJldHJpZXZlIHRoZSBzeW1ib2xzIGZyb20uXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAobzogYW55KSA9PiBzeW1ib2xbXTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEBwYXJhbSB2YWx1ZTEgVGhlIGZpcnN0IHZhbHVlLlxuICogQHBhcmFtIHZhbHVlMiBUaGUgc2Vjb25kIHZhbHVlLlxuICovXG5leHBvcnQgbGV0IGlzOiAodmFsdWUxOiBhbnksIHZhbHVlMjogYW55KSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb2YgYW4gb2JqZWN0LlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG4gKi9cbmV4cG9ydCBsZXQga2V5czogKG86IG9iamVjdCkgPT4gc3RyaW5nW107XG5cbi8qIEVTNyBPYmplY3Qgc3RhdGljIG1ldGhvZHMgKi9cblxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuXG5leHBvcnQgbGV0IGVudHJpZXM6IE9iamVjdEVudGVyaWVzO1xuXG5leHBvcnQgbGV0IHZhbHVlczogT2JqZWN0VmFsdWVzO1xuXG5pZiAoaGFzKCdlczYtb2JqZWN0JykpIHtcblx0Y29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcblx0YXNzaWduID0gZ2xvYmFsT2JqZWN0LmFzc2lnbjtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblx0Z2V0T3duUHJvcGVydHlOYW1lcyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuXHRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXHRpcyA9IGdsb2JhbE9iamVjdC5pcztcblx0a2V5cyA9IGdsb2JhbE9iamVjdC5rZXlzO1xufSBlbHNlIHtcblx0a2V5cyA9IGZ1bmN0aW9uIHN5bWJvbEF3YXJlS2V5cyhvOiBvYmplY3QpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcblx0fTtcblxuXHRhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKSB7XG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHQvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRvID0gT2JqZWN0KHRhcmdldCk7XG5cdFx0c291cmNlcy5mb3JFYWNoKChuZXh0U291cmNlKSA9PiB7XG5cdFx0XHRpZiAobmV4dFNvdXJjZSkge1xuXHRcdFx0XHQvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdFx0a2V5cyhuZXh0U291cmNlKS5mb3JFYWNoKChuZXh0S2V5KSA9PiB7XG5cdFx0XHRcdFx0dG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0bztcblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG5cdFx0bzogYW55LFxuXHRcdHByb3A6IHN0cmluZyB8IHN5bWJvbFxuXHQpOiBQcm9wZXJ0eURlc2NyaXB0b3IgfCB1bmRlZmluZWQge1xuXHRcdGlmIChpc1N5bWJvbChwcm9wKSkge1xuXHRcdFx0cmV0dXJuICg8YW55Pk9iamVjdCkuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcblx0XHR9XG5cdH07XG5cblx0Z2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobzogYW55KTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoKGtleSkgPT4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSk7XG5cdH07XG5cblx0Z2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG86IGFueSk6IHN5bWJvbFtdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobylcblx0XHRcdC5maWx0ZXIoKGtleSkgPT4gQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKVxuXHRcdFx0Lm1hcCgoa2V5KSA9PiBTeW1ib2wuZm9yKGtleS5zdWJzdHJpbmcoMikpKTtcblx0fTtcblxuXHRpcyA9IGZ1bmN0aW9uIGlzKHZhbHVlMTogYW55LCB2YWx1ZTI6IGFueSk6IGJvb2xlYW4ge1xuXHRcdGlmICh2YWx1ZTEgPT09IHZhbHVlMikge1xuXHRcdFx0cmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxuXHR9O1xufVxuXG5pZiAoaGFzKCdlczIwMTctb2JqZWN0JykpIHtcblx0Y29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuXHRlbnRyaWVzID0gZ2xvYmFsT2JqZWN0LmVudHJpZXM7XG5cdHZhbHVlcyA9IGdsb2JhbE9iamVjdC52YWx1ZXM7XG59IGVsc2Uge1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvOiBhbnkpIHtcblx0XHRyZXR1cm4gZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoXG5cdFx0XHQocHJldmlvdXMsIGtleSkgPT4ge1xuXHRcdFx0XHRwcmV2aW91c1trZXldID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIGtleSkhO1xuXHRcdFx0XHRyZXR1cm4gcHJldmlvdXM7XG5cdFx0XHR9LFxuXHRcdFx0e30gYXMgeyBba2V5OiBzdHJpbmddOiBQcm9wZXJ0eURlc2NyaXB0b3IgfVxuXHRcdCk7XG5cdH07XG5cblx0ZW50cmllcyA9IGZ1bmN0aW9uIGVudHJpZXMobzogYW55KTogW3N0cmluZywgYW55XVtdIHtcblx0XHRyZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gW2tleSwgb1trZXldXSBhcyBbc3RyaW5nLCBhbnldKTtcblx0fTtcblxuXHR2YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobzogYW55KTogYW55W10ge1xuXHRcdHJldHVybiBrZXlzKG8pLm1hcCgoa2V5KSA9PiBvW2tleV0pO1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIG9iamVjdC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nTm9ybWFsaXplIHtcblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cblx0ICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuXHQgKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcblx0ICogaXMgXCJORkNcIlxuXHQgKi9cblx0KHRhcmdldDogc3RyaW5nLCBmb3JtOiAnTkZDJyB8ICdORkQnIHwgJ05GS0MnIHwgJ05GS0QnKTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXG5cdCAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcblx0ICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XG5cdCAqIGlzIFwiTkZDXCJcblx0ICovXG5cdCh0YXJnZXQ6IHN0cmluZywgZm9ybT86IHN0cmluZyk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01JTiA9IDB4ZDgwMDtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NSU4gPSAweGRjMDA7XG5cbi8qKlxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IExPV19TVVJST0dBVEVfTUFYID0gMHhkZmZmO1xuXG4vKiBFUzYgc3RhdGljIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBSZXR1cm4gdGhlIFN0cmluZyB2YWx1ZSB3aG9zZSBlbGVtZW50cyBhcmUsIGluIG9yZGVyLCB0aGUgZWxlbWVudHMgaW4gdGhlIExpc3QgZWxlbWVudHMuXG4gKiBJZiBsZW5ndGggaXMgMCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqIEBwYXJhbSBjb2RlUG9pbnRzIFRoZSBjb2RlIHBvaW50cyB0byBnZW5lcmF0ZSB0aGUgc3RyaW5nXG4gKi9cbmV4cG9ydCBsZXQgZnJvbUNvZGVQb2ludDogKC4uLmNvZGVQb2ludHM6IG51bWJlcltdKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogYHJhd2AgaXMgaW50ZW5kZWQgZm9yIHVzZSBhcyBhIHRhZyBmdW5jdGlvbiBvZiBhIFRhZ2dlZCBUZW1wbGF0ZSBTdHJpbmcuIFdoZW4gY2FsbGVkXG4gKiBhcyBzdWNoIHRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGJlIGEgd2VsbCBmb3JtZWQgdGVtcGxhdGUgY2FsbCBzaXRlIG9iamVjdCBhbmQgdGhlIHJlc3RcbiAqIHBhcmFtZXRlciB3aWxsIGNvbnRhaW4gdGhlIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gKiBAcGFyYW0gdGVtcGxhdGUgQSB3ZWxsLWZvcm1lZCB0ZW1wbGF0ZSBzdHJpbmcgY2FsbCBzaXRlIHJlcHJlc2VudGF0aW9uLlxuICogQHBhcmFtIHN1YnN0aXR1dGlvbnMgQSBzZXQgb2Ygc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGxldCByYXc6ICh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnN1YnN0aXR1dGlvbnM6IGFueVtdKSA9PiBzdHJpbmc7XG5cbi8qIEVTNiBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogUmV0dXJucyBhIG5vbm5lZ2F0aXZlIGludGVnZXIgTnVtYmVyIGxlc3MgdGhhbiAxMTE0MTEyICgweDExMDAwMCkgdGhhdCBpcyB0aGUgY29kZSBwb2ludFxuICogdmFsdWUgb2YgdGhlIFVURi0xNiBlbmNvZGVkIGNvZGUgcG9pbnQgc3RhcnRpbmcgYXQgdGhlIHN0cmluZyBlbGVtZW50IGF0IHBvc2l0aW9uIHBvcyBpblxuICogdGhlIFN0cmluZyByZXN1bHRpbmcgZnJvbSBjb252ZXJ0aW5nIHRoaXMgb2JqZWN0IHRvIGEgU3RyaW5nLlxuICogSWYgdGhlcmUgaXMgbm8gZWxlbWVudCBhdCB0aGF0IHBvc2l0aW9uLCB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZC5cbiAqIElmIGEgdmFsaWQgVVRGLTE2IHN1cnJvZ2F0ZSBwYWlyIGRvZXMgbm90IGJlZ2luIGF0IHBvcywgdGhlIHJlc3VsdCBpcyB0aGUgY29kZSB1bml0IGF0IHBvcy5cbiAqL1xuZXhwb3J0IGxldCBjb2RlUG9pbnRBdDogKHRhcmdldDogc3RyaW5nLCBwb3M/OiBudW1iZXIpID0+IG51bWJlciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNlcXVlbmNlIG9mIGVsZW1lbnRzIG9mIHNlYXJjaFN0cmluZyBjb252ZXJ0ZWQgdG8gYSBTdHJpbmcgaXMgdGhlXG4gKiBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIG9mIHRoaXMgb2JqZWN0IChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpIHN0YXJ0aW5nIGF0XG4gKiBlbmRQb3NpdGlvbiDigJMgbGVuZ3RoKHRoaXMpLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBlbmRzV2l0aDogKHRhcmdldDogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgZW5kUG9zaXRpb24/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHNlYXJjaFN0cmluZyBhcHBlYXJzIGFzIGEgc3Vic3RyaW5nIG9mIHRoZSByZXN1bHQgb2YgY29udmVydGluZyB0aGlzXG4gKiBvYmplY3QgdG8gYSBTdHJpbmcsIGF0IG9uZSBvciBtb3JlIHBvc2l0aW9ucyB0aGF0IGFyZVxuICogZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHBvc2l0aW9uOyBvdGhlcndpc2UsIHJldHVybnMgZmFsc2UuXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gc2VhcmNoU3RyaW5nIHNlYXJjaCBzdHJpbmdcbiAqIEBwYXJhbSBwb3NpdGlvbiBJZiBwb3NpdGlvbiBpcyB1bmRlZmluZWQsIDAgaXMgYXNzdW1lZCwgc28gYXMgdG8gc2VhcmNoIGFsbCBvZiB0aGUgU3RyaW5nLlxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXG4gKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XG4gKiBpcyBcIk5GQ1wiXG4gKi9cbmV4cG9ydCBsZXQgbm9ybWFsaXplOiBTdHJpbmdOb3JtYWxpemU7XG5cbi8qKlxuICogUmV0dXJucyBhIFN0cmluZyB2YWx1ZSB0aGF0IGlzIG1hZGUgZnJvbSBjb3VudCBjb3BpZXMgYXBwZW5kZWQgdG9nZXRoZXIuIElmIGNvdW50IGlzIDAsXG4gKiBUIGlzIHRoZSBlbXB0eSBTdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0gY291bnQgbnVtYmVyIG9mIGNvcGllcyB0byBhcHBlbmRcbiAqL1xuZXhwb3J0IGxldCByZXBlYXQ6ICh0YXJnZXQ6IHN0cmluZywgY291bnQ/OiBudW1iZXIpID0+IHN0cmluZztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNlcXVlbmNlIG9mIGVsZW1lbnRzIG9mIHNlYXJjaFN0cmluZyBjb252ZXJ0ZWQgdG8gYSBTdHJpbmcgaXMgdGhlXG4gKiBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIG9mIHRoaXMgb2JqZWN0IChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpIHN0YXJ0aW5nIGF0XG4gKiBwb3NpdGlvbi4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gKi9cbmV4cG9ydCBsZXQgc3RhcnRzV2l0aDogKHRhcmdldDogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbi8qIEVTNyBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogUGFkcyB0aGUgY3VycmVudCBzdHJpbmcgd2l0aCBhIGdpdmVuIHN0cmluZyAocG9zc2libHkgcmVwZWF0ZWQpIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBzdHJpbmcgcmVhY2hlcyBhIGdpdmVuIGxlbmd0aC5cbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgZW5kIChyaWdodCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXG4gKlxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cbiAqL1xuZXhwb3J0IGxldCBwYWRFbmQ6ICh0YXJnZXQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGZpbGxTdHJpbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuLyoqXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxuICogVGhlIHBhZGRpbmcgaXMgYXBwbGllZCBmcm9tIHRoZSBzdGFydCAobGVmdCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXG4gKlxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cbiAqL1xuZXhwb3J0IGxldCBwYWRTdGFydDogKHRhcmdldDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG5pZiAoaGFzKCdlczYtc3RyaW5nJykgJiYgaGFzKCdlczYtc3RyaW5nLXJhdycpKSB7XG5cdGZyb21Db2RlUG9pbnQgPSBnbG9iYWwuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cdHJhdyA9IGdsb2JhbC5TdHJpbmcucmF3O1xuXG5cdGNvZGVQb2ludEF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdCk7XG5cdGVuZHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCk7XG5cdGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyk7XG5cdG5vcm1hbGl6ZSA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKTtcblx0cmVwZWF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpO1xuXHRzdGFydHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKTtcbn0gZWxzZSB7XG5cdC8qKlxuXHQgKiBWYWxpZGF0ZXMgdGhhdCB0ZXh0IGlzIGRlZmluZWQsIGFuZCBub3JtYWxpemVzIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgZ2l2ZW4gZGVmYXVsdCBpZiB0aGUgaW5wdXQgaXMgTmFOKS5cblx0ICogVXNlZCBieSBzdGFydHNXaXRoLCBpbmNsdWRlcywgYW5kIGVuZHNXaXRoLlxuXHQgKlxuXHQgKiBAcmV0dXJuIE5vcm1hbGl6ZWQgcG9zaXRpb24uXG5cdCAqL1xuXHRjb25zdCBub3JtYWxpemVTdWJzdHJpbmdBcmdzID0gZnVuY3Rpb24oXG5cdFx0bmFtZTogc3RyaW5nLFxuXHRcdHRleHQ6IHN0cmluZyxcblx0XHRzZWFyY2g6IHN0cmluZyxcblx0XHRwb3NpdGlvbjogbnVtYmVyLFxuXHRcdGlzRW5kOiBib29sZWFuID0gZmFsc2Vcblx0KTogW3N0cmluZywgc3RyaW5nLCBudW1iZXJdIHtcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuJyArIG5hbWUgKyAnIHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nIHRvIHNlYXJjaCBhZ2FpbnN0LicpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24gIT09IHBvc2l0aW9uID8gKGlzRW5kID8gbGVuZ3RoIDogMCkgOiBwb3NpdGlvbjtcblx0XHRyZXR1cm4gW3RleHQsIFN0cmluZyhzZWFyY2gpLCBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbiwgMCksIGxlbmd0aCldO1xuXHR9O1xuXG5cdGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHM6IG51bWJlcltdKTogc3RyaW5nIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLmZyb21Db2RlUG9pbnRcblx0XHRjb25zdCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdGlmICghbGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcblx0XHRjb25zdCBNQVhfU0laRSA9IDB4NDAwMDtcblx0XHRsZXQgY29kZVVuaXRzOiBudW1iZXJbXSA9IFtdO1xuXHRcdGxldCBpbmRleCA9IC0xO1xuXHRcdGxldCByZXN1bHQgPSAnJztcblxuXHRcdHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdFx0XHRsZXQgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuXG5cdFx0XHQvLyBDb2RlIHBvaW50cyBtdXN0IGJlIGZpbml0ZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHZhbGlkIHJhbmdlXG5cdFx0XHRsZXQgaXNWYWxpZCA9XG5cdFx0XHRcdGlzRmluaXRlKGNvZGVQb2ludCkgJiYgTWF0aC5mbG9vcihjb2RlUG9pbnQpID09PSBjb2RlUG9pbnQgJiYgY29kZVBvaW50ID49IDAgJiYgY29kZVBvaW50IDw9IDB4MTBmZmZmO1xuXHRcdFx0aWYgKCFpc1ZhbGlkKSB7XG5cdFx0XHRcdHRocm93IFJhbmdlRXJyb3IoJ3N0cmluZy5mcm9tQ29kZVBvaW50OiBJbnZhbGlkIGNvZGUgcG9pbnQgJyArIGNvZGVQb2ludCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2RlUG9pbnQgPD0gMHhmZmZmKSB7XG5cdFx0XHRcdC8vIEJNUCBjb2RlIHBvaW50XG5cdFx0XHRcdGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuXHRcdFx0XHQvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdFx0Y29kZVBvaW50IC09IDB4MTAwMDA7XG5cdFx0XHRcdGxldCBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBISUdIX1NVUlJPR0FURV9NSU47XG5cdFx0XHRcdGxldCBsb3dTdXJyb2dhdGUgPSBjb2RlUG9pbnQgJSAweDQwMCArIExPV19TVVJST0dBVEVfTUlOO1xuXHRcdFx0XHRjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW5kZXggKyAxID09PSBsZW5ndGggfHwgY29kZVVuaXRzLmxlbmd0aCA+IE1BWF9TSVpFKSB7XG5cdFx0XHRcdHJlc3VsdCArPSBmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcblx0XHRcdFx0Y29kZVVuaXRzLmxlbmd0aCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0cmF3ID0gZnVuY3Rpb24gcmF3KGNhbGxTaXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pOiBzdHJpbmcge1xuXHRcdGxldCByYXdTdHJpbmdzID0gY2FsbFNpdGUucmF3O1xuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHRsZXQgbnVtU3Vic3RpdHV0aW9ucyA9IHN1YnN0aXR1dGlvbnMubGVuZ3RoO1xuXG5cdFx0aWYgKGNhbGxTaXRlID09IG51bGwgfHwgY2FsbFNpdGUucmF3ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yYXcgcmVxdWlyZXMgYSB2YWxpZCBjYWxsU2l0ZSBvYmplY3Qgd2l0aCBhIHJhdyB2YWx1ZScpO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSByYXdTdHJpbmdzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRyZXN1bHQgKz0gcmF3U3RyaW5nc1tpXSArIChpIDwgbnVtU3Vic3RpdHV0aW9ucyAmJiBpIDwgbGVuZ3RoIC0gMSA/IHN1YnN0aXR1dGlvbnNbaV0gOiAnJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRjb2RlUG9pbnRBdCA9IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHRleHQ6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLmNvZGVQb2ludEF0IHJlcXVyaWVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwb3NpdGlvbiAhPT0gcG9zaXRpb24pIHtcblx0XHRcdHBvc2l0aW9uID0gMDtcblx0XHR9XG5cdFx0aWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBsZW5ndGgpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBjb2RlIHVuaXRcblx0XHRjb25zdCBmaXJzdCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbik7XG5cdFx0aWYgKGZpcnN0ID49IEhJR0hfU1VSUk9HQVRFX01JTiAmJiBmaXJzdCA8PSBISUdIX1NVUlJPR0FURV9NQVggJiYgbGVuZ3RoID4gcG9zaXRpb24gKyAxKSB7XG5cdFx0XHQvLyBTdGFydCBvZiBhIHN1cnJvZ2F0ZSBwYWlyIChoaWdoIHN1cnJvZ2F0ZSBhbmQgdGhlcmUgaXMgYSBuZXh0IGNvZGUgdW5pdCk7IGNoZWNrIGZvciBsb3cgc3Vycm9nYXRlXG5cdFx0XHQvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdGNvbnN0IHNlY29uZCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbiArIDEpO1xuXHRcdFx0aWYgKHNlY29uZCA+PSBMT1dfU1VSUk9HQVRFX01JTiAmJiBzZWNvbmQgPD0gTE9XX1NVUlJPR0FURV9NQVgpIHtcblx0XHRcdFx0cmV0dXJuIChmaXJzdCAtIEhJR0hfU1VSUk9HQVRFX01JTikgKiAweDQwMCArIHNlY29uZCAtIExPV19TVVJST0dBVEVfTUlOICsgMHgxMDAwMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZpcnN0O1xuXHR9O1xuXG5cdGVuZHNXaXRoID0gZnVuY3Rpb24gZW5kc1dpdGgodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgZW5kUG9zaXRpb24/OiBudW1iZXIpOiBib29sZWFuIHtcblx0XHRpZiAoZW5kUG9zaXRpb24gPT0gbnVsbCkge1xuXHRcdFx0ZW5kUG9zaXRpb24gPSB0ZXh0Lmxlbmd0aDtcblx0XHR9XG5cblx0XHRbdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdlbmRzV2l0aCcsIHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24sIHRydWUpO1xuXG5cdFx0Y29uc3Qgc3RhcnQgPSBlbmRQb3NpdGlvbiAtIHNlYXJjaC5sZW5ndGg7XG5cdFx0aWYgKHN0YXJ0IDwgMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0ZXh0LnNsaWNlKHN0YXJ0LCBlbmRQb3NpdGlvbikgPT09IHNlYXJjaDtcblx0fTtcblxuXHRpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRleHQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0W3RleHQsIHNlYXJjaCwgcG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnaW5jbHVkZXMnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcblx0XHRyZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcblx0fTtcblxuXHRyZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodGV4dDogc3RyaW5nLCBjb3VudDogbnVtYmVyID0gMCk6IHN0cmluZyB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUucmVwZWF0XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cdFx0aWYgKGNvdW50ICE9PSBjb3VudCkge1xuXHRcdFx0Y291bnQgPSAwO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPCAwIHx8IGNvdW50ID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHR3aGlsZSAoY291bnQpIHtcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcblx0XHRcdFx0cmVzdWx0ICs9IHRleHQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY291bnQgPiAxKSB7XG5cdFx0XHRcdHRleHQgKz0gdGV4dDtcblx0XHRcdH1cblx0XHRcdGNvdW50ID4+PSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHN0YXJ0c1dpdGggPSBmdW5jdGlvbiBzdGFydHNXaXRoKHRleHQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0c2VhcmNoID0gU3RyaW5nKHNlYXJjaCk7XG5cdFx0W3RleHQsIHNlYXJjaCwgcG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnc3RhcnRzV2l0aCcsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuXG5cdFx0Y29uc3QgZW5kID0gcG9zaXRpb24gKyBzZWFyY2gubGVuZ3RoO1xuXHRcdGlmIChlbmQgPiB0ZXh0Lmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0ZXh0LnNsaWNlKHBvc2l0aW9uLCBlbmQpID09PSBzZWFyY2g7XG5cdH07XG59XG5cbmlmIChoYXMoJ2VzMjAxNy1zdHJpbmcnKSkge1xuXHRwYWRFbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZEVuZCk7XG5cdHBhZFN0YXJ0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydCk7XG59IGVsc2Uge1xuXHRwYWRFbmQgPSBmdW5jdGlvbiBwYWRFbmQodGV4dDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZzogc3RyaW5nID0gJyAnKTogc3RyaW5nIHtcblx0XHRpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcblx0XHRcdG1heExlbmd0aCA9IDA7XG5cdFx0fVxuXG5cdFx0bGV0IHN0clRleHQgPSBTdHJpbmcodGV4dCk7XG5cdFx0Y29uc3QgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBhZGRpbmcgPiAwKSB7XG5cdFx0XHRzdHJUZXh0ICs9XG5cdFx0XHRcdHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcblx0XHRcdFx0ZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHJUZXh0O1xuXHR9O1xuXG5cdHBhZFN0YXJ0ID0gZnVuY3Rpb24gcGFkU3RhcnQodGV4dDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZzogc3RyaW5nID0gJyAnKTogc3RyaW5nIHtcblx0XHRpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkU3RhcnQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuXHRcdFx0bWF4TGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcblx0XHRjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocGFkZGluZyA+IDApIHtcblx0XHRcdHN0clRleHQgPVxuXHRcdFx0XHRyZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXG5cdFx0XHRcdGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKSArXG5cdFx0XHRcdHN0clRleHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0clRleHQ7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3RyaW5nLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL2hhcyc7XG5pbXBvcnQgeyBIYW5kbGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbTogUXVldWVJdGVtIHwgdW5kZWZpbmVkKTogdm9pZCB7XG5cdGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xuXHRcdGl0ZW0uY2FsbGJhY2soKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRRdWV1ZUhhbmRsZShpdGVtOiBRdWV1ZUl0ZW0sIGRlc3RydWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiB7XG5cdFx0ZGVzdHJveTogZnVuY3Rpb24odGhpczogSGFuZGxlKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHt9O1xuXHRcdFx0aXRlbS5pc0FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0aXRlbS5jYWxsYmFjayA9IG51bGw7XG5cblx0XHRcdGlmIChkZXN0cnVjdG9yKSB7XG5cdFx0XHRcdGRlc3RydWN0b3IoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmludGVyZmFjZSBQb3N0TWVzc2FnZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuXHRzb3VyY2U6IGFueTtcblx0ZGF0YTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlSXRlbSB7XG5cdGlzQWN0aXZlOiBib29sZWFuO1xuXHRjYWxsYmFjazogbnVsbCB8ICgoLi4uYXJnczogYW55W10pID0+IGFueSk7XG59XG5cbmxldCBjaGVja01pY3JvVGFza1F1ZXVlOiAoKSA9PiB2b2lkO1xubGV0IG1pY3JvVGFza3M6IFF1ZXVlSXRlbVtdO1xuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXVlVGFzayA9IChmdW5jdGlvbigpIHtcblx0bGV0IGRlc3RydWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuXHRsZXQgZW5xdWV1ZTogKGl0ZW06IFF1ZXVlSXRlbSkgPT4gdm9pZDtcblxuXHQvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXG5cdGlmIChoYXMoJ3Bvc3RtZXNzYWdlJykpIHtcblx0XHRjb25zdCBxdWV1ZTogUXVldWVJdGVtW10gPSBbXTtcblxuXHRcdGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZXZlbnQ6IFBvc3RNZXNzYWdlRXZlbnQpOiB2b2lkIHtcblx0XHRcdC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cblx0XHRcdGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRpZiAocXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXhlY3V0ZVRhc2socXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdHF1ZXVlLnB1c2goaXRlbSk7XG5cdFx0XHRnbG9iYWwucG9zdE1lc3NhZ2UoJ2Rvam8tcXVldWUtbWVzc2FnZScsICcqJyk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ3NldGltbWVkaWF0ZScpKSB7XG5cdFx0ZGVzdHJ1Y3RvciA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogYW55IHtcblx0XHRcdHJldHVybiBzZXRJbW1lZGlhdGUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFyVGltZW91dDtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogYW55IHtcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSksIDApO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBxdWV1ZVRhc2soY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cdFx0Y29uc3QgaWQ6IGFueSA9IGVucXVldWUoaXRlbSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoXG5cdFx0XHRpdGVtLFxuXHRcdFx0ZGVzdHJ1Y3RvciAmJlxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkZXN0cnVjdG9yKGlkKTtcblx0XHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cblx0cmV0dXJuIGhhcygnbWljcm90YXNrcycpXG5cdFx0PyBxdWV1ZVRhc2tcblx0XHQ6IGZ1bmN0aW9uKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0XHRcdGNoZWNrTWljcm9UYXNrUXVldWUoKTtcblx0XHRcdFx0cmV0dXJuIHF1ZXVlVGFzayhjYWxsYmFjayk7XG5cdFx0XHR9O1xufSkoKTtcblxuLy8gV2hlbiBubyBtZWNoYW5pc20gZm9yIHJlZ2lzdGVyaW5nIG1pY3JvdGFza3MgaXMgZXhwb3NlZCBieSB0aGUgZW52aXJvbm1lbnQsIG1pY3JvdGFza3Mgd2lsbFxuLy8gYmUgcXVldWVkIGFuZCB0aGVuIGV4ZWN1dGVkIGluIGEgc2luZ2xlIG1hY3JvdGFzayBiZWZvcmUgdGhlIG90aGVyIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkLlxuaWYgKCFoYXMoJ21pY3JvdGFza3MnKSkge1xuXHRsZXQgaXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcblxuXHRtaWNyb1Rhc2tzID0gW107XG5cdGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRpZiAoIWlzTWljcm9UYXNrUXVldWVkKSB7XG5cdFx0XHRpc01pY3JvVGFza1F1ZXVlZCA9IHRydWU7XG5cdFx0XHRxdWV1ZVRhc2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlzTWljcm9UYXNrUXVldWVkID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKG1pY3JvVGFza3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bGV0IGl0ZW06IFF1ZXVlSXRlbSB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XG5cdFx0XHRcdFx0XHRleGVjdXRlVGFzayhpdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgYW4gYW5pbWF0aW9uIHRhc2sgd2l0aCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgaXQgZXhpc3RzLCBvciB3aXRoIGBxdWV1ZVRhc2tgIG90aGVyd2lzZS5cbiAqXG4gKiBTaW5jZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUncyBiZWhhdmlvciBkb2VzIG5vdCBtYXRjaCB0aGF0IGV4cGVjdGVkIGZyb20gYHF1ZXVlVGFza2AsIGl0IGlzIG5vdCB1c2VkIHRoZXJlLlxuICogSG93ZXZlciwgYXQgdGltZXMgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byBkZWxlZ2F0ZSB0byByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGhlbmNlIHRoZSBmb2xsb3dpbmcgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBxdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICghaGFzKCdyYWYnKSkge1xuXHRcdHJldHVybiBxdWV1ZVRhc2s7XG5cdH1cblxuXHRmdW5jdGlvbiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cdFx0Y29uc3QgcmFmSWQ6IG51bWJlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBmdW5jdGlvbigpIHtcblx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuXHRyZXR1cm4gaGFzKCdtaWNyb3Rhc2tzJylcblx0XHQ/IHF1ZXVlQW5pbWF0aW9uVGFza1xuXHRcdDogZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKTtcblx0XHRcdH07XG59KSgpO1xuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKlxuICogQW55IGNhbGxiYWNrcyByZWdpc3RlcmVkIHdpdGggYHF1ZXVlTWljcm9UYXNrYCB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgbmV4dCBtYWNyb3Rhc2suIElmIG5vIG5hdGl2ZVxuICogbWVjaGFuaXNtIGZvciBzY2hlZHVsaW5nIG1hY3JvdGFza3MgaXMgZXhwb3NlZCwgdGhlbiBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgZmlyZWQgYmVmb3JlIGFueSBtYWNyb3Rhc2tcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgbGV0IHF1ZXVlTWljcm9UYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRsZXQgZW5xdWV1ZTogKGl0ZW06IFF1ZXVlSXRlbSkgPT4gdm9pZDtcblxuXHRpZiAoaGFzKCdob3N0LW5vZGUnKSkge1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdGdsb2JhbC5wcm9jZXNzLm5leHRUaWNrKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdlczYtcHJvbWlzZScpKSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Z2xvYmFsLlByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGV4ZWN1dGVUYXNrKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKSkge1xuXHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0Y29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblx0XHRjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0Y29uc3QgcXVldWU6IFF1ZXVlSXRlbVtdID0gW107XG5cdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKTogdm9pZCB7XG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb25zdCBpdGVtID0gcXVldWUuc2hpZnQoKTtcblx0XHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0aXRlbS5jYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdHF1ZXVlLnB1c2goaXRlbSk7XG5cdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgncXVldWVTdGF0dXMnLCAnMScpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0bWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cblx0XHRlbnF1ZXVlKGl0ZW0pO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xuXHR9O1xufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBxdWV1ZS50cyIsIi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgICAgVGhlIHZhbHVlIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBzZXQgdG9cbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcbiAqIEBwYXJhbSB3cml0YWJsZSAgICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSB3cml0YWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHBhcmFtIGNvbmZpZ3VyYWJsZSBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcjxUPihcblx0dmFsdWU6IFQsXG5cdGVudW1lcmFibGU6IGJvb2xlYW4gPSBmYWxzZSxcblx0d3JpdGFibGU6IGJvb2xlYW4gPSB0cnVlLFxuXHRjb25maWd1cmFibGU6IGJvb2xlYW4gPSB0cnVlXG4pOiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxUPiB7XG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHZhbHVlLFxuXHRcdGVudW1lcmFibGU6IGVudW1lcmFibGUsXG5cdFx0d3JpdGFibGU6IHdyaXRhYmxlLFxuXHRcdGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXG5cdH07XG59XG5cbi8qKlxuICogQSBoZWxwZXIgZnVuY3Rpb24gd2hpY2ggd3JhcHMgYSBmdW5jdGlvbiB3aGVyZSB0aGUgZmlyc3QgYXJndW1lbnQgYmVjb21lcyB0aGUgc2NvcGVcbiAqIG9mIHRoZSBjYWxsXG4gKlxuICogQHBhcmFtIG5hdGl2ZUZ1bmN0aW9uIFRoZSBzb3VyY2UgZnVuY3Rpb24gdG8gYmUgd3JhcHBlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBSPihuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUpID0+IFIpOiAodGFyZ2V0OiBULCBhcmcxOiBVKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgUj4obmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWKSA9PiBSKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogVikgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBYLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgWCwgWSwgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVywgYXJnNDogWSkgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVywgYXJnNDogWSkgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6ICh0YXJnZXQ6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnkge1xuXHRcdHJldHVybiBuYXRpdmVGdW5jdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHV0aWwudHMiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBJbmplY3RvckV2ZW50TWFwIHtcblx0aW52YWxpZGF0ZTogRXZlbnRPYmplY3Q8J2ludmFsaWRhdGUnPjtcbn1cblxuZXhwb3J0IGNsYXNzIEluamVjdG9yPFQgPSBhbnk+IGV4dGVuZHMgRXZlbnRlZDxJbmplY3RvckV2ZW50TWFwPiB7XG5cdHByaXZhdGUgX3BheWxvYWQ6IFQ7XG5cblx0Y29uc3RydWN0b3IocGF5bG9hZDogVCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0KCk6IFQge1xuXHRcdHJldHVybiB0aGlzLl9wYXlsb2FkO1xuXHR9XG5cblx0cHVibGljIHNldChwYXlsb2FkOiBUKTogdm9pZCB7XG5cdFx0dGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluamVjdG9yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEluamVjdG9yLnRzIiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IE5vZGVIYW5kbGVySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBFbnVtIHRvIGlkZW50aWZ5IHRoZSB0eXBlIG9mIGV2ZW50LlxuICogTGlzdGVuaW5nIHRvICdQcm9qZWN0b3InIHdpbGwgbm90aWZ5IHdoZW4gcHJvamVjdG9yIGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxuICogTGlzdGVuaW5nIHRvICdXaWRnZXQnIHdpbGwgbm90aWZ5IHdoZW4gd2lkZ2V0IHJvb3QgaXMgY3JlYXRlZCBvciB1cGRhdGVkXG4gKi9cbmV4cG9ydCBlbnVtIE5vZGVFdmVudFR5cGUge1xuXHRQcm9qZWN0b3IgPSAnUHJvamVjdG9yJyxcblx0V2lkZ2V0ID0gJ1dpZGdldCdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlSGFuZGxlckV2ZW50TWFwIHtcblx0UHJvamVjdG9yOiBFdmVudE9iamVjdDxOb2RlRXZlbnRUeXBlLlByb2plY3Rvcj47XG5cdFdpZGdldDogRXZlbnRPYmplY3Q8Tm9kZUV2ZW50VHlwZS5XaWRnZXQ+O1xufVxuXG5leHBvcnQgY2xhc3MgTm9kZUhhbmRsZXIgZXh0ZW5kcyBFdmVudGVkPE5vZGVIYW5kbGVyRXZlbnRNYXA+IGltcGxlbWVudHMgTm9kZUhhbmRsZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIF9ub2RlTWFwID0gbmV3IE1hcDxzdHJpbmcsIEVsZW1lbnQ+KCk7XG5cblx0cHVibGljIGdldChrZXk6IHN0cmluZyk6IEVsZW1lbnQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLl9ub2RlTWFwLmdldChrZXkpO1xuXHR9XG5cblx0cHVibGljIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9ub2RlTWFwLmhhcyhrZXkpO1xuXHR9XG5cblx0cHVibGljIGFkZChlbGVtZW50OiBFbGVtZW50LCBrZXk6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuX25vZGVNYXAuc2V0KGtleSwgZWxlbWVudCk7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFJvb3QoKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5XaWRnZXQgfSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkUHJvamVjdG9yKCk6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuUHJvamVjdG9yIH0pO1xuXHR9XG5cblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xuXHRcdHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOb2RlSGFuZGxlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBOb2RlSGFuZGxlci50cyIsImltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgUmVnaXN0cnlMYWJlbCwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yLCBXaWRnZXRCYXNlSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi9JbmplY3Rvcic7XG5cbmV4cG9ydCB0eXBlIFdpZGdldEJhc2VDb25zdHJ1Y3RvckZ1bmN0aW9uID0gKCkgPT4gUHJvbWlzZTxXaWRnZXRCYXNlQ29uc3RydWN0b3I+O1xuXG5leHBvcnQgdHlwZSBFU01EZWZhdWx0V2lkZ2V0QmFzZUZ1bmN0aW9uID0gKCkgPT4gUHJvbWlzZTxFU01EZWZhdWx0V2lkZ2V0QmFzZTxXaWRnZXRCYXNlSW50ZXJmYWNlPj47XG5cbmV4cG9ydCB0eXBlIFJlZ2lzdHJ5SXRlbSA9XG5cdHwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXG5cdHwgUHJvbWlzZTxXaWRnZXRCYXNlQ29uc3RydWN0b3I+XG5cdHwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb25cblx0fCBFU01EZWZhdWx0V2lkZ2V0QmFzZUZ1bmN0aW9uO1xuXG4vKipcbiAqIFdpZGdldCBiYXNlIHN5bWJvbCB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXSURHRVRfQkFTRV9UWVBFID0gU3ltYm9sKCdXaWRnZXQgQmFzZScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5RXZlbnRPYmplY3QgZXh0ZW5kcyBFdmVudE9iamVjdDxSZWdpc3RyeUxhYmVsPiB7XG5cdGFjdGlvbjogc3RyaW5nO1xuXHRpdGVtOiBXaWRnZXRCYXNlQ29uc3RydWN0b3IgfCBJbmplY3Rvcjtcbn1cblxuLyoqXG4gKiBXaWRnZXQgUmVnaXN0cnkgSW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlJbnRlcmZhY2Uge1xuXHQvKipcblx0ICogRGVmaW5lIGEgV2lkZ2V0UmVnaXN0cnlJdGVtIGFnYWluc3QgYSBsYWJlbFxuXHQgKlxuXHQgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB3aWRnZXQgdG8gcmVnaXN0ZXJcblx0ICogQHBhcmFtIHJlZ2lzdHJ5SXRlbSBUaGUgcmVnaXN0cnkgaXRlbSB0byBkZWZpbmVcblx0ICovXG5cdGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgcmVnaXN0cnlJdGVtOiBSZWdpc3RyeUl0ZW0pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSBnaXZlbiBsYWJlbCwgbnVsbCBpZiBhbiBlbnRyeSBkb2Vzbid0IGV4aXN0XG5cdCAqXG5cdCAqIEBwYXJhbSB3aWRnZXRMYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHdpZGdldCB0byByZXR1cm5cblx0ICogQHJldHVybnMgVGhlIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIHdpZGdldExhYmVsLCBgbnVsbGAgaWYgbm8gZW50cnkgZXhpc3RzXG5cdCAqL1xuXHRnZXQ8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBXaWRnZXRCYXNlSW50ZXJmYWNlPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IENvbnN0cnVjdG9yPFQ+IHwgbnVsbDtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIGJvb2xlYW4gaWYgYW4gZW50cnkgZm9yIHRoZSBsYWJlbCBleGlzdHNcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCB0byBzZWFyY2ggZm9yXG5cdCAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhIHdpZGdldCByZWdpc3RyeSBpdGVtIGV4aXN0c1xuXHQgKi9cblx0aGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRGVmaW5lIGFuIEluamVjdG9yIGFnYWluc3QgYSBsYWJlbFxuXHQgKlxuXHQgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSBpbmplY3RvciB0byByZWdpc3RlclxuXHQgKiBAcGFyYW0gcmVnaXN0cnlJdGVtIFRoZSBpbmplY3RvciB0byBkZWZpbmVcblx0ICovXG5cdGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCByZWdpc3RyeUl0ZW06IEluamVjdG9yKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGFuIEluamVjdG9yIHJlZ2lzdHJ5IGl0ZW0gZm9yIHRoZSBnaXZlbiBsYWJlbCwgbnVsbCBpZiBhbiBlbnRyeSBkb2Vzbid0IGV4aXN0XG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIGluamVjdG9yIHRvIHJldHVyblxuXHQgKiBAcmV0dXJucyBUaGUgUmVnaXN0cnlJdGVtIGZvciB0aGUgd2lkZ2V0TGFiZWwsIGBudWxsYCBpZiBubyBlbnRyeSBleGlzdHNcblx0ICovXG5cdGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBUIHwgbnVsbDtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIGJvb2xlYW4gaWYgYW4gaW5qZWN0b3IgZm9yIHRoZSBsYWJlbCBleGlzdHNcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCB0byBzZWFyY2ggZm9yXG5cdCAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhIGluamVjdG9yIHJlZ2lzdHJ5IGl0ZW0gZXhpc3RzXG5cdCAqL1xuXHRoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ2hlY2tzIGlzIHRoZSBpdGVtIGlzIGEgc3ViY2xhc3Mgb2YgV2lkZ2V0QmFzZSAob3IgYSBXaWRnZXRCYXNlKVxuICpcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB0cnVlL2ZhbHNlIGluZGljYXRpbmcgaWYgdGhlIGl0ZW0gaXMgYSBXaWRnZXRCYXNlQ29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yPFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlPihpdGVtOiBhbnkpOiBpdGVtIGlzIENvbnN0cnVjdG9yPFQ+IHtcblx0cmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFU01EZWZhdWx0V2lkZ2V0QmFzZTxUPiB7XG5cdGRlZmF1bHQ6IENvbnN0cnVjdG9yPFQ+O1xuXHRfX2VzTW9kdWxlOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQ8VD4oaXRlbTogYW55KTogaXRlbSBpcyBFU01EZWZhdWx0V2lkZ2V0QmFzZTxUPiB7XG5cdHJldHVybiBCb29sZWFuKFxuXHRcdGl0ZW0gJiZcblx0XHRcdGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxuXHRcdFx0aXRlbS5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpICYmXG5cdFx0XHRpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtLmRlZmF1bHQpXG5cdCk7XG59XG5cbi8qKlxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50ZWQ8e30sIFJlZ2lzdHJ5TGFiZWwsIFJlZ2lzdHJ5RXZlbnRPYmplY3Q+IGltcGxlbWVudHMgUmVnaXN0cnlJbnRlcmZhY2Uge1xuXHQvKipcblx0ICogaW50ZXJuYWwgbWFwIG9mIGxhYmVscyBhbmQgUmVnaXN0cnlJdGVtXG5cdCAqL1xuXHRwcml2YXRlIF93aWRnZXRSZWdpc3RyeTogTWFwPFJlZ2lzdHJ5TGFiZWwsIFJlZ2lzdHJ5SXRlbT47XG5cblx0cHJpdmF0ZSBfaW5qZWN0b3JSZWdpc3RyeTogTWFwPFJlZ2lzdHJ5TGFiZWwsIEluamVjdG9yPjtcblxuXHQvKipcblx0ICogRW1pdCBsb2FkZWQgZXZlbnQgZm9yIHJlZ2lzdHJ5IGxhYmVsXG5cdCAqL1xuXHRwcml2YXRlIGVtaXRMb2FkZWRFdmVudCh3aWRnZXRMYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIHwgSW5qZWN0b3IpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoe1xuXHRcdFx0dHlwZTogd2lkZ2V0TGFiZWwsXG5cdFx0XHRhY3Rpb246ICdsb2FkZWQnLFxuXHRcdFx0aXRlbVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogUmVnaXN0cnlJdGVtKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHdpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuXHRcdH1cblxuXHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XG5cblx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdGl0ZW0udGhlbihcblx0XHRcdFx0KHdpZGdldEN0b3IpID0+IHtcblx0XHRcdFx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0XHRyZXR1cm4gd2lkZ2V0Q3Rvcjtcblx0XHRcdFx0fSxcblx0XHRcdFx0KGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xuXHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkZWZpbmVJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogSW5qZWN0b3IpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgaW5qZWN0b3IgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcblx0XHR9XG5cblx0XHR0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XG5cdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuXHR9XG5cblx0cHVibGljIGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogQ29uc3RydWN0b3I8VD4gfCBudWxsIHtcblx0XHRpZiAoIXRoaXMuaGFzKGxhYmVsKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmdldChsYWJlbCk7XG5cblx0XHRpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8VD4oaXRlbSkpIHtcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH1cblxuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvbWlzZSA9ICg8V2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb24+aXRlbSkoKTtcblx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHByb21pc2UpO1xuXG5cdFx0cHJvbWlzZS50aGVuKFxuXHRcdFx0KHdpZGdldEN0b3IpID0+IHtcblx0XHRcdFx0aWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0PFQ+KHdpZGdldEN0b3IpKSB7XG5cdFx0XHRcdFx0d2lkZ2V0Q3RvciA9IHdpZGdldEN0b3IuZGVmYXVsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0cmV0dXJuIHdpZGdldEN0b3I7XG5cdFx0XHR9LFxuXHRcdFx0KGVycm9yKSA9PiB7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogVCB8IG51bGwge1xuXHRcdGlmICghdGhpcy5oYXNJbmplY3RvcihsYWJlbCkpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmdldChsYWJlbCkgYXMgVDtcblx0fVxuXG5cdHB1YmxpYyBoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2luamVjdG9yUmVnaXN0cnkgJiYgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBSZWdpc3RyeS50cyIsImltcG9ydCB7IE1hcCB9IGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFJlZ2lzdHJ5TGFiZWwsIFdpZGdldEJhc2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnksIFJlZ2lzdHJ5RXZlbnRPYmplY3QsIFJlZ2lzdHJ5SXRlbSB9IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuL0luamVjdG9yJztcblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUhhbmRsZXJFdmVudE1hcCB7XG5cdGludmFsaWRhdGU6IEV2ZW50T2JqZWN0PCdpbnZhbGlkYXRlJz47XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeUhhbmRsZXIgZXh0ZW5kcyBFdmVudGVkPFJlZ2lzdHJ5SGFuZGxlckV2ZW50TWFwPiB7XG5cdHByaXZhdGUgX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG5cdHByaXZhdGUgX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPiA9IG5ldyBNYXAoKTtcblx0cHJpdmF0ZSBfcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT4gPSBuZXcgTWFwKCk7XG5cdHByb3RlY3RlZCBiYXNlUmVnaXN0cnk/OiBSZWdpc3RyeTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcblx0XHRjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuYmFzZVJlZ2lzdHJ5KSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0XHRcdHRoaXMuYmFzZVJlZ2lzdHJ5ID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5vd24oeyBkZXN0cm95IH0pO1xuXHR9XG5cblx0cHVibGljIHNldCBiYXNlKGJhc2VSZWdpc3RyeTogUmVnaXN0cnkpIHtcblx0XHRpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdH1cblx0XHR0aGlzLmJhc2VSZWdpc3RyeSA9IGJhc2VSZWdpc3RyeTtcblx0fVxuXG5cdHB1YmxpYyBkZWZpbmUobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHdpZGdldDogUmVnaXN0cnlJdGVtKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xuXHR9XG5cblx0cHVibGljIGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpbmplY3RvcjogSW5qZWN0b3IpOiB2b2lkIHtcblx0XHR0aGlzLl9yZWdpc3RyeS5kZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3IpO1xuXHR9XG5cblx0cHVibGljIGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBXaWRnZXRCYXNlSW50ZXJmYWNlPihcblx0XHRsYWJlbDogUmVnaXN0cnlMYWJlbCxcblx0XHRnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2Vcblx0KTogQ29uc3RydWN0b3I8VD4gfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZTogYm9vbGVhbiA9IGZhbHNlKTogVCB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXRJbmplY3RvcicsIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXQoXG5cdFx0bGFiZWw6IFJlZ2lzdHJ5TGFiZWwsXG5cdFx0Z2xvYmFsUHJlY2VkZW5jZTogYm9vbGVhbixcblx0XHRnZXRGdW5jdGlvbk5hbWU6ICdnZXRJbmplY3RvcicgfCAnZ2V0Jyxcblx0XHRsYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+XG5cdCk6IGFueSB7XG5cdFx0Y29uc3QgcmVnaXN0cmllcyA9IGdsb2JhbFByZWNlZGVuY2UgPyBbdGhpcy5iYXNlUmVnaXN0cnksIHRoaXMuX3JlZ2lzdHJ5XSA6IFt0aGlzLl9yZWdpc3RyeSwgdGhpcy5iYXNlUmVnaXN0cnldO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVnaXN0cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcmVnaXN0cnk6IGFueSA9IHJlZ2lzdHJpZXNbaV07XG5cdFx0XHRpZiAoIXJlZ2lzdHJ5KSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xuXHRcdFx0Y29uc3QgcmVnaXN0ZXJlZExhYmVscyA9IGxhYmVsTWFwLmdldChyZWdpc3RyeSkgfHwgW107XG5cdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH0gZWxzZSBpZiAocmVnaXN0ZXJlZExhYmVscy5pbmRleE9mKGxhYmVsKSA9PT0gLTEpIHtcblx0XHRcdFx0Y29uc3QgaGFuZGxlID0gcmVnaXN0cnkub24obGFiZWwsIChldmVudDogUmVnaXN0cnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdGV2ZW50LmFjdGlvbiA9PT0gJ2xvYWRlZCcgJiZcblx0XHRcdFx0XHRcdCh0aGlzIGFzIGFueSlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkgPT09IGV2ZW50Lml0ZW1cblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuZW1pdCh7IHR5cGU6ICdpbnZhbGlkYXRlJyB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLm93bihoYW5kbGUpO1xuXHRcdFx0XHRsYWJlbE1hcC5zZXQocmVnaXN0cnksIFsuLi5yZWdpc3RlcmVkTGFiZWxzLCBsYWJlbF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeUhhbmRsZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUmVnaXN0cnlIYW5kbGVyLnRzIiwiaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBhdXRvIH0gZnJvbSAnLi9kaWZmJztcbmltcG9ydCB7XG5cdEFmdGVyUmVuZGVyLFxuXHRCZWZvcmVQcm9wZXJ0aWVzLFxuXHRCZWZvcmVSZW5kZXIsXG5cdENvcmVQcm9wZXJ0aWVzLFxuXHREaWZmUHJvcGVydHlSZWFjdGlvbixcblx0RE5vZGUsXG5cdFJlbmRlcixcblx0V2lkZ2V0TWV0YUJhc2UsXG5cdFdpZGdldE1ldGFDb25zdHJ1Y3Rvcixcblx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0V2lkZ2V0UHJvcGVydGllc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5pbXBvcnQgTm9kZUhhbmRsZXIgZnJvbSAnLi9Ob2RlSGFuZGxlcic7XG5pbXBvcnQgeyB3aWRnZXRJbnN0YW5jZU1hcCB9IGZyb20gJy4vdmRvbSc7XG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciwgV0lER0VUX0JBU0VfVFlQRSB9IGZyb20gJy4vUmVnaXN0cnknO1xuXG5lbnVtIFdpZGdldFJlbmRlclN0YXRlIHtcblx0SURMRSA9IDEsXG5cdFBST1BFUlRJRVMsXG5cdENISUxEUkVOLFxuXHRSRU5ERVJcbn1cblxuaW50ZXJmYWNlIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHMge1xuXHRwcmV2aW91c1Byb3BlcnRpZXM6IGFueTtcblx0bmV3UHJvcGVydGllczogYW55O1xuXHRjaGFuZ2VkOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgUmVhY3Rpb25GdW5jdGlvbkNvbmZpZyB7XG5cdHByb3BlcnR5TmFtZTogc3RyaW5nO1xuXHRyZWFjdGlvbjogRGlmZlByb3BlcnR5UmVhY3Rpb247XG59XG5cbmV4cG9ydCB0eXBlIEJvdW5kRnVuY3Rpb25EYXRhID0geyBib3VuZEZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55OyBzY29wZTogYW55IH07XG5cbmNvbnN0IGRlY29yYXRvck1hcCA9IG5ldyBNYXA8RnVuY3Rpb24sIE1hcDxzdHJpbmcsIGFueVtdPj4oKTtcbmNvbnN0IGJvdW5kQXV0byA9IGF1dG8uYmluZChudWxsKTtcblxuLyoqXG4gKiBNYWluIHdpZGdldCBiYXNlIGZvciBhbGwgd2lkZ2V0cyB0byBleHRlbmRcbiAqL1xuZXhwb3J0IGNsYXNzIFdpZGdldEJhc2U8UCA9IFdpZGdldFByb3BlcnRpZXMsIEMgZXh0ZW5kcyBETm9kZSA9IEROb2RlPiBpbXBsZW1lbnRzIFdpZGdldEJhc2VJbnRlcmZhY2U8UCwgQz4ge1xuXHQvKipcblx0ICogc3RhdGljIGlkZW50aWZpZXJcblx0ICovXG5cdHN0YXRpYyBfdHlwZTogc3ltYm9sID0gV0lER0VUX0JBU0VfVFlQRTtcblxuXHQvKipcblx0ICogY2hpbGRyZW4gYXJyYXlcblx0ICovXG5cdHByaXZhdGUgX2NoaWxkcmVuOiAoQyB8IG51bGwpW107XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyBpZiBpdCBpcyB0aGUgaW5pdGlhbCBzZXQgcHJvcGVydGllcyBjeWNsZVxuXHQgKi9cblx0cHJpdmF0ZSBfaW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBpbnRlcm5hbCB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0cHJpdmF0ZSBfcHJvcGVydGllczogUCAmIFdpZGdldFByb3BlcnRpZXMgJiB7IFtpbmRleDogc3RyaW5nXTogYW55IH07XG5cblx0LyoqXG5cdCAqIEFycmF5IG9mIHByb3BlcnR5IGtleXMgY29uc2lkZXJlZCBjaGFuZ2VkIGZyb20gdGhlIHByZXZpb3VzIHNldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwcml2YXRlIF9jaGFuZ2VkUHJvcGVydHlLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdC8qKlxuXHQgKiBtYXAgb2YgZGVjb3JhdG9ycyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoaXMgd2lkZ2V0XG5cdCAqL1xuXHRwcml2YXRlIF9kZWNvcmF0b3JDYWNoZTogTWFwPHN0cmluZywgYW55W10+O1xuXG5cdHByaXZhdGUgX3JlZ2lzdHJ5OiBSZWdpc3RyeUhhbmRsZXI7XG5cblx0LyoqXG5cdCAqIE1hcCBvZiBmdW5jdGlvbnMgcHJvcGVydGllcyBmb3IgdGhlIGJvdW5kIGZ1bmN0aW9uXG5cdCAqL1xuXHRwcml2YXRlIF9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcDogV2Vha01hcDwoLi4uYXJnczogYW55W10pID0+IGFueSwgQm91bmRGdW5jdGlvbkRhdGE+O1xuXG5cdHByaXZhdGUgX3JlbmRlclN0YXRlOiBXaWRnZXRSZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLklETEU7XG5cblx0cHJpdmF0ZSBfbWV0YU1hcDogTWFwPFdpZGdldE1ldGFDb25zdHJ1Y3Rvcjxhbnk+LCBXaWRnZXRNZXRhQmFzZT47XG5cblx0cHJpdmF0ZSBfYm91bmRSZW5kZXJGdW5jOiBSZW5kZXI7XG5cblx0cHJpdmF0ZSBfYm91bmRJbnZhbGlkYXRlOiAoKSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX25vZGVIYW5kbGVyOiBOb2RlSGFuZGxlciA9IG5ldyBOb2RlSGFuZGxlcigpO1xuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2NoaWxkcmVuID0gW107XG5cdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgYW55W10+KCk7XG5cdFx0dGhpcy5fcHJvcGVydGllcyA9IDxQPnt9O1xuXHRcdHRoaXMuX2JvdW5kUmVuZGVyRnVuYyA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5fYm91bmRJbnZhbGlkYXRlID0gdGhpcy5pbnZhbGlkYXRlLmJpbmQodGhpcyk7XG5cblx0XHR3aWRnZXRJbnN0YW5jZU1hcC5zZXQodGhpcywge1xuXHRcdFx0ZGlydHk6IHRydWUsXG5cdFx0XHRvbkVsZW1lbnRDcmVhdGVkOiAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdHRoaXMub25FbGVtZW50Q3JlYXRlZChlbGVtZW50LCBrZXkpO1xuXHRcdFx0fSxcblx0XHRcdG9uRWxlbWVudFVwZGF0ZWQ6IChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0dGhpcy5vbkVsZW1lbnRVcGRhdGVkKGVsZW1lbnQsIGtleSk7XG5cdFx0XHR9LFxuXHRcdFx0b25BdHRhY2g6ICgpOiB2b2lkID0+IHtcblx0XHRcdFx0dGhpcy5vbkF0dGFjaCgpO1xuXHRcdFx0fSxcblx0XHRcdG9uRGV0YWNoOiAoKTogdm9pZCA9PiB7XG5cdFx0XHRcdHRoaXMub25EZXRhY2goKTtcblx0XHRcdFx0dGhpcy5fZGVzdHJveSgpO1xuXHRcdFx0fSxcblx0XHRcdG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcblx0XHRcdHJlZ2lzdHJ5OiAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlZ2lzdHJ5O1xuXHRcdFx0fSxcblx0XHRcdGNvcmVQcm9wZXJ0aWVzOiB7fSBhcyBDb3JlUHJvcGVydGllcyxcblx0XHRcdGludmFsaWRhdGU6IHRoaXMuX2JvdW5kSW52YWxpZGF0ZVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBtZXRhPFQgZXh0ZW5kcyBXaWRnZXRNZXRhQmFzZT4oTWV0YVR5cGU6IFdpZGdldE1ldGFDb25zdHJ1Y3RvcjxUPik6IFQge1xuXHRcdGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAgPSBuZXcgTWFwPFdpZGdldE1ldGFDb25zdHJ1Y3Rvcjxhbnk+LCBXaWRnZXRNZXRhQmFzZT4oKTtcblx0XHR9XG5cdFx0bGV0IGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcblx0XHRpZiAoIWNhY2hlZCkge1xuXHRcdFx0Y2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcblx0XHRcdFx0aW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxuXHRcdFx0XHRub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG5cdFx0XHRcdGJpbmQ6IHRoaXNcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlZCBhcyBUO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpZGdldCBsaWZlY3ljbGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIGEgZG9tIG5vZGUgaXMgY3JlYXRlZCBmb3IgYSBWTm9kZS5cblx0ICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWNjZXNzIHRoZSBkb20gbm9kZXMgdGhhdCB3ZXJlIGluc2VydGVkIGludG8gdGhlIGRvbS5cblx0ICogQHBhcmFtIGVsZW1lbnQgVGhlIGRvbSBub2RlIHJlcHJlc2VudGVkIGJ5IHRoZSB2ZG9tIG5vZGUuXG5cdCAqIEBwYXJhbSBrZXkgVGhlIHZkb20gbm9kZSdzIGtleS5cblx0ICovXG5cdHByb3RlY3RlZCBvbkVsZW1lbnRDcmVhdGVkKGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nIHwgbnVtYmVyKTogdm9pZCB7XG5cdFx0Ly8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxuXHR9XG5cblx0LyoqXG5cdCAqIFdpZGdldCBsaWZlY3ljbGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIGEgZG9tIG5vZGUgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggYSBWTm9kZSBpcyB1cGRhdGVkLlxuXHQgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBhY2Nlc3MgdGhlIGRvbSBub2RlLlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZG9tIG5vZGUgcmVwcmVzZW50ZWQgYnkgdGhlIHZkb20gbm9kZS5cblx0ICogQHBhcmFtIGtleSBUaGUgdmRvbSBub2RlJ3Mga2V5LlxuXHQgKi9cblx0cHJvdGVjdGVkIG9uRWxlbWVudFVwZGF0ZWQoZWxlbWVudDogRWxlbWVudCwga2V5OiBzdHJpbmcgfCBudW1iZXIpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHRwcm90ZWN0ZWQgb25BdHRhY2goKTogdm9pZCB7XG5cdFx0Ly8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxuXHR9XG5cblx0cHJvdGVjdGVkIG9uRGV0YWNoKCk6IHZvaWQge1xuXHRcdC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cblx0fVxuXG5cdHB1YmxpYyBnZXQgcHJvcGVydGllcygpOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFdpZGdldFByb3BlcnRpZXM+IHtcblx0XHRyZXR1cm4gdGhpcy5fcHJvcGVydGllcztcblx0fVxuXG5cdHB1YmxpYyBnZXQgY2hhbmdlZFByb3BlcnR5S2V5cygpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIFsuLi50aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzXTtcblx0fVxuXG5cdHB1YmxpYyBfX3NldENvcmVQcm9wZXJ0aWVzX18oY29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVuZGVyU3RhdGUgPSBXaWRnZXRSZW5kZXJTdGF0ZS5QUk9QRVJUSUVTO1xuXHRcdGNvbnN0IHsgYmFzZVJlZ2lzdHJ5IH0gPSBjb3JlUHJvcGVydGllcztcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXG5cdFx0aWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xuXHRcdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LmJhc2UgPSBiYXNlUmVnaXN0cnk7XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgX19zZXRQcm9wZXJ0aWVzX18ob3JpZ2luYWxQcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHR0aGlzLl9yZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLlBST1BFUlRJRVM7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcblx0XHRjb25zdCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xuXHRcdGNvbnN0IGNoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdID0gW107XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cblx0XHRpZiAodGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPT09IGZhbHNlIHx8IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5sZW5ndGggIT09IDApIHtcblx0XHRcdGNvbnN0IGFsbFByb3BlcnRpZXMgPSBbLi4ucHJvcGVydHlOYW1lcywgLi4uT2JqZWN0LmtleXModGhpcy5fcHJvcGVydGllcyldO1xuXHRcdFx0Y29uc3QgY2hlY2tlZFByb3BlcnRpZXM6IChzdHJpbmcgfCBudW1iZXIpW10gPSBbXTtcblx0XHRcdGNvbnN0IGRpZmZQcm9wZXJ0eVJlc3VsdHM6IGFueSA9IHt9O1xuXHRcdFx0bGV0IHJ1blJlYWN0aW9ucyA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gYWxsUHJvcGVydGllc1tpXTtcblx0XHRcdFx0aWYgKGNoZWNrZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSA+IDApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGVja2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdGNvbnN0IHByZXZpb3VzUHJvcGVydHkgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdGNvbnN0IG5ld1Byb3BlcnR5ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkoXG5cdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLFxuXHRcdFx0XHRcdGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJ1blJlYWN0aW9ucyA9IHRydWU7XG5cdFx0XHRcdFx0Y29uc3QgZGlmZkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBkaWZmRnVuY3Rpb25zW2ldKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0ZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBib3VuZEF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdFx0XHRcdGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHJ1blJlYWN0aW9ucykge1xuXHRcdFx0XHR0aGlzLl9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMocHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykuZm9yRWFjaCgoYXJncywgcmVhY3Rpb24pID0+IHtcblx0XHRcdFx0XHRpZiAoYXJncy5jaGFuZ2VkKSB7XG5cdFx0XHRcdFx0XHRyZWFjdGlvbi5jYWxsKHRoaXMsIGFyZ3MucHJldmlvdXNQcm9wZXJ0aWVzLCBhcmdzLm5ld1Byb3BlcnRpZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gZGlmZlByb3BlcnR5UmVzdWx0cztcblx0XHRcdHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IGZhbHNlO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZXNbaV07XG5cdFx0XHRcdGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkoXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sXG5cdFx0XHRcdFx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xuXHRcdFx0dGhpcy5fcHJvcGVydGllcyA9IHsgLi4ucHJvcGVydGllcyB9O1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9yZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLklETEU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGdldCBjaGlsZHJlbigpOiAoQyB8IG51bGwpW10ge1xuXHRcdHJldHVybiB0aGlzLl9jaGlsZHJlbjtcblx0fVxuXG5cdHB1YmxpYyBfX3NldENoaWxkcmVuX18oY2hpbGRyZW46IChDIHwgbnVsbClbXSk6IHZvaWQge1xuXHRcdHRoaXMuX3JlbmRlclN0YXRlID0gV2lkZ2V0UmVuZGVyU3RhdGUuQ0hJTERSRU47XG5cdFx0aWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgfHwgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfX3JlbmRlcl9fKCk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0dGhpcy5fcmVuZGVyU3RhdGUgPSBXaWRnZXRSZW5kZXJTdGF0ZS5SRU5ERVI7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcblx0XHRjb25zdCByZW5kZXIgPSB0aGlzLl9ydW5CZWZvcmVSZW5kZXJzKCk7XG5cdFx0bGV0IGROb2RlID0gcmVuZGVyKCk7XG5cdFx0ZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XG5cdFx0dGhpcy5fbm9kZUhhbmRsZXIuY2xlYXIoKTtcblx0XHR0aGlzLl9yZW5kZXJTdGF0ZSA9IFdpZGdldFJlbmRlclN0YXRlLklETEU7XG5cdFx0cmV0dXJuIGROb2RlO1xuXHR9XG5cblx0cHVibGljIGludmFsaWRhdGUoKTogdm9pZCB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpZiAodGhpcy5fcmVuZGVyU3RhdGUgPT09IFdpZGdldFJlbmRlclN0YXRlLklETEUpIHtcblx0XHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XG5cdFx0XHRpZiAoaW5zdGFuY2VEYXRhLnBhcmVudEludmFsaWRhdGUpIHtcblx0XHRcdFx0aW5zdGFuY2VEYXRhLnBhcmVudEludmFsaWRhdGUoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRoaXMuX3JlbmRlclN0YXRlID09PSBXaWRnZXRSZW5kZXJTdGF0ZS5QUk9QRVJUSUVTKSB7XG5cdFx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fcmVuZGVyU3RhdGUgPT09IFdpZGdldFJlbmRlclN0YXRlLkNISUxEUkVOKSB7XG5cdFx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHRyZXR1cm4gdignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGFkZCBkZWNvcmF0b3JzIHRvIFdpZGdldEJhc2Vcblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqL1xuXHRwcm90ZWN0ZWQgYWRkRGVjb3JhdG9yKGRlY29yYXRvcktleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG5cdFx0dmFsdWUgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcblx0XHRpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuXHRcdFx0bGV0IGRlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JNYXAuZ2V0KHRoaXMuY29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKCFkZWNvcmF0b3JMaXN0KSB7XG5cdFx0XHRcdGRlY29yYXRvckxpc3QgPSBuZXcgTWFwPHN0cmluZywgYW55W10+KCk7XG5cdFx0XHRcdGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JMaXN0LmdldChkZWNvcmF0b3JLZXkpO1xuXHRcdFx0aWYgKCFzcGVjaWZpY0RlY29yYXRvckxpc3QpIHtcblx0XHRcdFx0c3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gW107XG5cdFx0XHRcdGRlY29yYXRvckxpc3Quc2V0KGRlY29yYXRvcktleSwgc3BlY2lmaWNEZWNvcmF0b3JMaXN0KTtcblx0XHRcdH1cblx0XHRcdHNwZWNpZmljRGVjb3JhdG9yTGlzdC5wdXNoKC4uLnZhbHVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZGVjb3JhdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSk7XG5cdFx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBbLi4uZGVjb3JhdG9ycywgLi4udmFsdWVdKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gYnVpbGQgdGhlIGxpc3Qgb2YgZGVjb3JhdG9ycyBmcm9tIHRoZSBnbG9iYWwgZGVjb3JhdG9yIG1hcC5cblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEByZXR1cm4gQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleTogc3RyaW5nKTogYW55W10ge1xuXHRcdGNvbnN0IGFsbERlY29yYXRvcnMgPSBbXTtcblxuXHRcdGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG5cblx0XHR3aGlsZSAoY29uc3RydWN0b3IpIHtcblx0XHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZGVjb3JhdG9yTWFwLmdldChjb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoaW5zdGFuY2VNYXApIHtcblx0XHRcdFx0Y29uc3QgZGVjb3JhdG9ycyA9IGluc3RhbmNlTWFwLmdldChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0XHRcdGlmIChkZWNvcmF0b3JzKSB7XG5cdFx0XHRcdFx0YWxsRGVjb3JhdG9ycy51bnNoaWZ0KC4uLmRlY29yYXRvcnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0cnVjdG9yID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnN0cnVjdG9yKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cm95cyBwcml2YXRlIHJlc291cmNlcyBmb3IgV2lkZ2V0QmFzZVxuXHQgKi9cblx0cHJpdmF0ZSBfZGVzdHJveSgpIHtcblx0XHRpZiAodGhpcy5fcmVnaXN0cnkpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LmRlc3Ryb3koKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG5cdFx0XHRcdG1ldGEuZGVzdHJveSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIGRlY29yYXRvciB2YWx1ZXNcblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHJldHVybnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKi9cblx0cHJvdGVjdGVkIGdldERlY29yYXRvcihkZWNvcmF0b3JLZXk6IHN0cmluZyk6IGFueVtdIHtcblx0XHRsZXQgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2RlY29yYXRvckNhY2hlLmdldChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0aWYgKGFsbERlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdFx0fVxuXG5cdFx0YWxsRGVjb3JhdG9ycyA9IHRoaXMuX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgYWxsRGVjb3JhdG9ycyk7XG5cdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdH1cblxuXHRwcml2YXRlIF9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMoXG5cdFx0bmV3UHJvcGVydGllczogYW55LFxuXHRcdGNoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdXG5cdCk6IE1hcDxGdW5jdGlvbiwgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cz4ge1xuXHRcdGNvbnN0IHJlYWN0aW9uRnVuY3Rpb25zOiBSZWFjdGlvbkZ1bmN0aW9uQ29uZmlnW10gPSB0aGlzLmdldERlY29yYXRvcignZGlmZlJlYWN0aW9uJyk7XG5cblx0XHRyZXR1cm4gcmVhY3Rpb25GdW5jdGlvbnMucmVkdWNlKChyZWFjdGlvblByb3BlcnR5TWFwLCB7IHJlYWN0aW9uLCBwcm9wZXJ0eU5hbWUgfSkgPT4ge1xuXHRcdFx0bGV0IHJlYWN0aW9uQXJndW1lbnRzID0gcmVhY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocmVhY3Rpb24pO1xuXHRcdFx0aWYgKHJlYWN0aW9uQXJndW1lbnRzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMgPSB7XG5cdFx0XHRcdFx0cHJldmlvdXNQcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0XHRuZXdQcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0XHRjaGFuZ2VkOiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMucHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5uZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBuZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRpZiAoY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLmNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmVhY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocmVhY3Rpb24sIHJlYWN0aW9uQXJndW1lbnRzKTtcblx0XHRcdHJldHVybiByZWFjdGlvblByb3BlcnR5TWFwO1xuXHRcdH0sIG5ldyBNYXA8RnVuY3Rpb24sIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHM+KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHVuYm91bmQgcHJvcGVydHkgZnVuY3Rpb25zIHRvIHRoZSBzcGVjaWZpZWQgYGJpbmRgIHByb3BlcnR5XG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yIGZ1bmN0aW9uc1xuXHQgKi9cblx0cHJpdmF0ZSBfYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydHk6IGFueSwgYmluZDogYW55KTogYW55IHtcblx0XHRpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnZnVuY3Rpb24nICYmIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKHByb3BlcnR5KSA9PT0gZmFsc2UpIHtcblx0XHRcdGlmICh0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID0gbmV3IFdlYWtNYXA8XG5cdFx0XHRcdFx0KC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksXG5cdFx0XHRcdFx0eyBib3VuZEZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55OyBzY29wZTogYW55IH1cblx0XHRcdFx0PigpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgYmluZEluZm86IFBhcnRpYWw8Qm91bmRGdW5jdGlvbkRhdGE+ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuZ2V0KHByb3BlcnR5KSB8fCB7fTtcblx0XHRcdGxldCB7IGJvdW5kRnVuYywgc2NvcGUgfSA9IGJpbmRJbmZvO1xuXG5cdFx0XHRpZiAoYm91bmRGdW5jID09PSB1bmRlZmluZWQgfHwgc2NvcGUgIT09IGJpbmQpIHtcblx0XHRcdFx0Ym91bmRGdW5jID0gcHJvcGVydHkuYmluZChiaW5kKSBhcyAoLi4uYXJnczogYW55W10pID0+IGFueTtcblx0XHRcdFx0dGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuc2V0KHByb3BlcnR5LCB7IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYm91bmRGdW5jO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHJlZ2lzdHJ5KCk6IFJlZ2lzdHJ5SGFuZGxlciB7XG5cdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcigpO1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cnk7XG5cdH1cblxuXHRwcml2YXRlIF9ydW5CZWZvcmVQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSkge1xuXHRcdGNvbnN0IGJlZm9yZVByb3BlcnRpZXM6IEJlZm9yZVByb3BlcnRpZXNbXSA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJyk7XG5cdFx0aWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKFxuXHRcdFx0XHQocHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHsgLi4ucHJvcGVydGllcywgLi4uYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwodGhpcywgcHJvcGVydGllcykgfTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eyAuLi5wcm9wZXJ0aWVzIH1cblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9wZXJ0aWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBiZWZvcmUgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSB1cGRhdGVkIHJlbmRlciBtZXRob2Rcblx0ICovXG5cdHByaXZhdGUgX3J1bkJlZm9yZVJlbmRlcnMoKTogUmVuZGVyIHtcblx0XHRjb25zdCBiZWZvcmVSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVJlbmRlcicpO1xuXG5cdFx0aWYgKGJlZm9yZVJlbmRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGJlZm9yZVJlbmRlcnMucmVkdWNlKChyZW5kZXI6IFJlbmRlciwgYmVmb3JlUmVuZGVyRnVuY3Rpb246IEJlZm9yZVJlbmRlcikgPT4ge1xuXHRcdFx0XHRjb25zdCB1cGRhdGVkUmVuZGVyID0gYmVmb3JlUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCByZW5kZXIsIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2NoaWxkcmVuKTtcblx0XHRcdFx0aWYgKCF1cGRhdGVkUmVuZGVyKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdSZW5kZXIgZnVuY3Rpb24gbm90IHJldHVybmVkIGZyb20gYmVmb3JlUmVuZGVyLCB1c2luZyBwcmV2aW91cyByZW5kZXInKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVuZGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB1cGRhdGVkUmVuZGVyO1xuXHRcdFx0fSwgdGhpcy5fYm91bmRSZW5kZXJGdW5jKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYWZ0ZXIgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSBkZWNvcmF0ZWQgRE5vZGVzXG5cdCAqXG5cdCAqIEBwYXJhbSBkTm9kZSBUaGUgRE5vZGVzIHRvIHJ1biB0aHJvdWdoIHRoZSBhZnRlciByZW5kZXJzXG5cdCAqL1xuXHRwcm90ZWN0ZWQgcnVuQWZ0ZXJSZW5kZXJzKGROb2RlOiBETm9kZSB8IEROb2RlW10pOiBETm9kZSB8IEROb2RlW10ge1xuXHRcdGNvbnN0IGFmdGVyUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlclJlbmRlcicpO1xuXG5cdFx0aWYgKGFmdGVyUmVuZGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYWZ0ZXJSZW5kZXJzLnJlZHVjZSgoZE5vZGU6IEROb2RlIHwgRE5vZGVbXSwgYWZ0ZXJSZW5kZXJGdW5jdGlvbjogQWZ0ZXJSZW5kZXIpID0+IHtcblx0XHRcdFx0cmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBkTm9kZSk7XG5cdFx0XHR9LCBkTm9kZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG5cdFx0XHRcdG1ldGEuYWZ0ZXJSZW5kZXIoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBkTm9kZTtcblx0fVxuXG5cdHByaXZhdGUgX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk6IHZvaWQge1xuXHRcdGNvbnN0IGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcblxuXHRcdGlmIChhZnRlckNvbnN0cnVjdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRhZnRlckNvbnN0cnVjdG9ycy5mb3JFYWNoKChhZnRlckNvbnN0cnVjdG9yKSA9PiBhZnRlckNvbnN0cnVjdG9yLmNhbGwodGhpcykpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBXaWRnZXRCYXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFdpZGdldEJhc2UudHMiLCJpbXBvcnQgeyBWTm9kZVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG5sZXQgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xubGV0IGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuXHRpZiAoJ1dlYmtpdFRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcblx0XHRicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xuXHRcdGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRBbmltYXRpb25FbmQnO1xuXHR9IGVsc2UgaWYgKCd0cmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlIHx8ICdNb3pUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG5cdFx0YnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd0cmFuc2l0aW9uZW5kJztcblx0XHRicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnYW5pbWF0aW9uZW5kJztcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuXHRpZiAoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID09PSAnJykge1xuXHRcdGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFuZENsZWFuVXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHN0YXJ0QW5pbWF0aW9uOiAoKSA9PiB2b2lkLCBmaW5pc2hBbmltYXRpb246ICgpID0+IHZvaWQpIHtcblx0aW5pdGlhbGl6ZShlbGVtZW50KTtcblxuXHRsZXQgZmluaXNoZWQgPSBmYWxzZTtcblxuXHRsZXQgdHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghZmluaXNoZWQpIHtcblx0XHRcdGZpbmlzaGVkID0gdHJ1ZTtcblx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuXG5cdFx0XHRmaW5pc2hBbmltYXRpb24oKTtcblx0XHR9XG5cdH07XG5cblx0c3RhcnRBbmltYXRpb24oKTtcblxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xufVxuXG5mdW5jdGlvbiBleGl0KG5vZGU6IEhUTUxFbGVtZW50LCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsIGV4aXRBbmltYXRpb246IHN0cmluZywgcmVtb3ZlTm9kZTogKCkgPT4gdm9pZCkge1xuXHRjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbkFjdGl2ZSB8fCBgJHtleGl0QW5pbWF0aW9ufS1hY3RpdmVgO1xuXG5cdHJ1bkFuZENsZWFuVXAoXG5cdFx0bm9kZSxcblx0XHQoKSA9PiB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoZXhpdEFuaW1hdGlvbik7XG5cblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0KCkgPT4ge1xuXHRcdFx0cmVtb3ZlTm9kZSgpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gZW50ZXIobm9kZTogSFRNTEVsZW1lbnQsIHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcywgZW50ZXJBbmltYXRpb246IHN0cmluZykge1xuXHRjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZW50ZXJBbmltYXRpb25BY3RpdmUgfHwgYCR7ZW50ZXJBbmltYXRpb259LWFjdGl2ZWA7XG5cblx0cnVuQW5kQ2xlYW5VcChcblx0XHRub2RlLFxuXHRcdCgpID0+IHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChlbnRlckFuaW1hdGlvbik7XG5cblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0KCkgPT4ge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKGVudGVyQW5pbWF0aW9uKTtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XG5cdFx0fVxuXHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGVudGVyLFxuXHRleGl0XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGNzc1RyYW5zaXRpb25zLnRzIiwiaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IGZyb20gYXMgYXJyYXlGcm9tIH0gZnJvbSAnQGRvam8vc2hpbS9hcnJheSc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJ0Bkb2pvL3NoaW0vZ2xvYmFsJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBETm9kZSwgVk5vZGUsIFZOb2RlUHJvcGVydGllcywgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IHYsIHcgfSBmcm9tICcuL2QnO1xuaW1wb3J0IHsgRG9tV3JhcHBlciB9IGZyb20gJy4vdXRpbC9Eb21XcmFwcGVyJztcbmltcG9ydCB7IFByb2plY3Rvck1peGluIH0gZnJvbSAnLi9taXhpbnMvUHJvamVjdG9yJztcbmltcG9ydCB7IEludGVybmFsVk5vZGUgfSBmcm9tICcuL3Zkb20nO1xuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yXG4gKlxuICogRGVzY3JpYmVzIGEgY3VzdG9tIGVsZW1lbnQgYXR0cmlidXRlXG4gKlxuICogQHByb3BlcnR5IGF0dHJpYnV0ZU5hbWUgICBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIG9uIHRoZSBET00gZWxlbWVudFxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb24gdGhlIHdpZGdldFxuICogQHByb3BlcnR5IHZhbHVlICAgICAgICAgICBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgb3IgbnVsbCB2YWx1ZSwgYW5kIHJldHVybnMgYSBuZXcgdmFsdWUuIFRoZSB3aWRnZXQncyBwcm9wZXJ0eSB3aWxsIGJlIHNldCB0byB0aGUgbmV3IHZhbHVlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yIHtcblx0YXR0cmlidXRlTmFtZTogc3RyaW5nO1xuXHRwcm9wZXJ0eU5hbWU/OiBzdHJpbmc7XG5cdHZhbHVlPzogKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiBhbnk7XG59XG5cbi8qKlxuICogQHR5cGUgQ3VzdG9tRWxlbWVudFByb3BlcnR5RGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIHdpZGdldCBwcm9wZXJ0eSBleHBvc2VkIHZpYSBhIGN1c3RvbSBlbGVtZW50XG4gKlxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICAgICAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSBET00gZWxlbWVudFxuICogQHByb3BlcnR5IHdpZGdldFByb3BlcnR5TmFtZSAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSB3aWRnZXRcbiAqIEBwcm9wZXJ0eSBnZXRWYWx1ZSAgICAgICAgICAgIEEgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gb24gdGhlIHdpZGdldCdzIHByb3BlcnR5IHZhbHVlXG4gKiBAcHJvcGVydHkgc2V0VmFsdWUgICAgICAgICAgICBBIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIG9uIHRoZSBET00gZWxlbWVudHMgcHJvcGVydHkgdmFsdWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50UHJvcGVydHlEZXNjcmlwdG9yIHtcblx0cHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cdHdpZGdldFByb3BlcnR5TmFtZT86IHN0cmluZztcblx0Z2V0VmFsdWU/OiAodmFsdWU6IGFueSkgPT4gYW55O1xuXHRzZXRWYWx1ZT86ICh2YWx1ZTogYW55KSA9PiBhbnk7XG59XG5cbi8qKlxuICogQHR5cGUgQ3VzdG9tRWxlbWVudEV2ZW50RGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIGN1c3RvbSBlbGVtZW50IGV2ZW50XG4gKlxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb24gdGhlIHdpZGdldCB0aGF0IHRha2VzIGEgZnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSBldmVudE5hbWUgICAgICAgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgKGl0IHdpbGwgYmUgYSBDdXN0b21FdmVudCBvYmplY3Qgb2YgdGhpcyB0eXBlKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRFdmVudERlc2NyaXB0b3Ige1xuXHRwcm9wZXJ0eU5hbWU6IHN0cmluZztcblx0ZXZlbnROYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIGN1c3RvbSBlbGVtZW50IGluaXRpYWxpemluZyBmdW5jdGlvbi4gUGFzc2VzIGluIGluaXRpYWwgcHJvcGVydGllcyBzbyB0aGV5IGNhbiBiZSBleHRlbmRlZFxuICogYnkgdGhlIGluaXRpYWxpemVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRJbml0aWFsaXplciB7XG5cdChwcm9wZXJ0aWVzOiBXaWRnZXRQcm9wZXJ0aWVzKTogdm9pZDtcbn1cblxuZXhwb3J0IGVudW0gQ2hpbGRyZW5UeXBlIHtcblx0RE9KTyA9ICdET0pPJyxcblx0RUxFTUVOVCA9ICdFTEVNRU5UJ1xufVxuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yXG4gKlxuICogRGVzY3JpYmVzIGEgY3VzdG9tIGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHRhZ05hbWUgICAgICAgICAgICAgVGhlIHRhZyBuYW1lIHRvIHJlZ2lzdGVyIHRoaXMgd2lkZ2V0IHVuZGVyLiBUYWcgbmFtZXMgbXVzdCBjb250YWluIGEgXCItXCJcbiAqIEBwcm9wZXJ0eSB3aWRnZXRDb25zdHJ1Y3RvciAgIHdpZGdldCBDb25zdHJ1Y3RvciB0aGF0IHdpbGwgcmV0dXJuIHRoZSB3aWRnZXQgdG8gYmUgd3JhcHBlZCBpbiBhIGN1c3RvbSBlbGVtZW50XG4gKiBAcHJvcGVydHkgYXR0cmlidXRlcyAgICAgICAgICBBIGxpc3Qgb2YgYXR0cmlidXRlcyB0byBkZWZpbmUgb24gdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgcHJvcGVydGllcyAgICAgICAgICBBIGxpc3Qgb2YgcHJvcGVydGllcyB0byBkZWZpbmUgb24gdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgZXZlbnRzICAgICAgICAgICAgICBBIGxpc3Qgb2YgZXZlbnRzIHRvIGV4cG9zZSBvbiB0aGlzIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSBpbml0aWFsaXphdGlvbiAgICAgIEEgbWV0aG9kIHRvIHJ1biB0byBzZXQgY3VzdG9tIHByb3BlcnRpZXMgb24gdGhlIHdyYXBwZWQgd2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudERlc2NyaXB0b3Ige1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIGN1c3RvbSBlbGVtZW50IHRhZ1xuXHQgKi9cblx0dGFnTmFtZTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBXaWRnZXQgY29uc3RydWN0b3IgdGhhdCB3aWxsIGNyZWF0ZSB0aGUgd2lkZ2V0XG5cdCAqL1xuXHR3aWRnZXRDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj47XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgYXR0cmlidXRlcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnQgdG8gbWFwIHRvIHdpZGdldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRhdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZURlc2NyaXB0b3JbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiB3aWRnZXQgcHJvcGVydGllcyB0byBleHBvc2UgYXMgcHJvcGVydGllcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHByb3BlcnRpZXM/OiBDdXN0b21FbGVtZW50UHJvcGVydHlEZXNjcmlwdG9yW107XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgZXZlbnRzIHRvIGV4cG9zZVxuXHQgKi9cblx0ZXZlbnRzPzogQ3VzdG9tRWxlbWVudEV2ZW50RGVzY3JpcHRvcltdO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXphdGlvbiBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIHRoZSB3aWRnZXQgaXMgY3JlYXRlZCAoZm9yIGN1c3RvbSBwcm9wZXJ0eSBzZXR0aW5nKVxuXHQgKi9cblx0aW5pdGlhbGl6YXRpb24/OiBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIGNoaWxkcmVuIHRoYXQgdGhlIGN1c3RvbSBlbGVtZW50IGFjY2VwdHNcblx0ICovXG5cdGNoaWxkcmVuVHlwZT86IENoaWxkcmVuVHlwZTtcbn1cblxuLyoqXG4gKiBAdHlwZSBDdXN0b21FbGVtZW50XG4gKlxuICogQSBjdXN0b20gZWxlbWVudCBleHRlbmRzIHVwb24gYSByZWd1bGFyIEhUTUxFbGVtZW50IGJ1dCBhZGRzIGZpZWxkcyBmb3IgZGVzY3JpYmluZyBhbmQgd3JhcHBpbmcgYSB3aWRnZXQgY29uc3RydWN0b3IuXG4gKlxuICogQHByb3BlcnR5IGdldFdpZGdldENvbnN0cnVjdG9yIFJldHVybiB0aGUgd2lkZ2V0IGNvbnN0cnVjdG9yIGZvciB0aGlzIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSBnZXREZXNjcmlwdG9yICAgICAgICBSZXR1cm4gdGhlIGVsZW1lbnQgZGVzY3JpcHRvciBmb3IgdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgZ2V0V2lkZ2V0SW5zdGFuY2UgICAgUmV0dXJuIHRoZSB3aWRnZXQgaW5zdGFuY2UgdGhhdCB0aGlzIGVsZW1lbnQgd3JhcHNcbiAqIEBwcm9wZXJ0eSBzZXRXaWRnZXRJbnN0YW5jZSAgICBTZXQgdGhlIHdpZGdldCBpbnN0YW5jZSBmb3IgdGhpcyBlbGVtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0Z2V0V2lkZ2V0Q29uc3RydWN0b3IoKTogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj47XG5cdGdldERlc2NyaXB0b3IoKTogQ3VzdG9tRWxlbWVudERlc2NyaXB0b3I7XG5cdGdldFdpZGdldEluc3RhbmNlKCk6IFByb2plY3Rvck1peGluPGFueT47XG5cdHNldFdpZGdldEluc3RhbmNlKGluc3RhbmNlOiBQcm9qZWN0b3JNaXhpbjxhbnk+KTogdm9pZDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBEb21Ub1dpZGdldFdyYXBwZXJcbiAqL1xuZXhwb3J0IHR5cGUgRG9tVG9XaWRnZXRXcmFwcGVyUHJvcGVydGllcyA9IFZOb2RlUHJvcGVydGllcyAmIFdpZGdldFByb3BlcnRpZXM7XG5cbi8qKlxuICogRG9tVG9XaWRnZXRXcmFwcGVyIHR5cGVcbiAqL1xuZXhwb3J0IHR5cGUgRG9tVG9XaWRnZXRXcmFwcGVyID0gQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxEb21Ub1dpZGdldFdyYXBwZXJQcm9wZXJ0aWVzPj47XG5cbi8qKlxuICogRG9tVG9XaWRnZXRXcmFwcGVyIEhPQ1xuICpcbiAqIEBwYXJhbSBkb21Ob2RlIFRoZSBkb20gbm9kZSB0byB3cmFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEb21Ub1dpZGdldFdyYXBwZXIoZG9tTm9kZTogQ3VzdG9tRWxlbWVudCk6IERvbVRvV2lkZ2V0V3JhcHBlciB7XG5cdHJldHVybiBjbGFzcyBEb21Ub1dpZGdldFdyYXBwZXIgZXh0ZW5kcyBXaWRnZXRCYXNlPERvbVRvV2lkZ2V0V3JhcHBlclByb3BlcnRpZXM+IHtcblx0XHRwcml2YXRlIF93aWRnZXRJbnN0YW5jZTogUHJvamVjdG9yTWl4aW48YW55PjtcblxuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHRcdGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY29ubmVjdGVkJywgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl93aWRnZXRJbnN0YW5jZSA9IGRvbU5vZGUuZ2V0V2lkZ2V0SW5zdGFuY2UoKTtcblx0XHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwdWJsaWMgX19yZW5kZXJfXygpOiBWTm9kZSB7XG5cdFx0XHRjb25zdCB2Tm9kZSA9IHN1cGVyLl9fcmVuZGVyX18oKSBhcyBJbnRlcm5hbFZOb2RlO1xuXHRcdFx0dk5vZGUuZG9tTm9kZSA9IGRvbU5vZGU7XG5cdFx0XHRyZXR1cm4gdk5vZGU7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHJlbmRlcigpOiBETm9kZSB7XG5cdFx0XHRpZiAodGhpcy5fd2lkZ2V0SW5zdGFuY2UpIHtcblx0XHRcdFx0dGhpcy5fd2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyh7XG5cdFx0XHRcdFx0a2V5OiAncm9vdCcsXG5cdFx0XHRcdFx0Li4udGhpcy5fd2lkZ2V0SW5zdGFuY2UucHJvcGVydGllcyxcblx0XHRcdFx0XHQuLi50aGlzLnByb3BlcnRpZXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdihkb21Ob2RlLnRhZ05hbWUsIHt9KTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShcblx0YXR0cmlidXRlTmFtZTogc3RyaW5nLFxuXHRhdHRyaWJ1dGVWYWx1ZTogc3RyaW5nIHwgbnVsbCxcblx0ZGVzY3JpcHRvcjogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZURlc2NyaXB0b3Jcbik6IFtzdHJpbmcsIGFueV0ge1xuXHRsZXQgeyBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSA9IGF0dHJpYnV0ZVZhbHVlIH0gPSBkZXNjcmlwdG9yO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YWx1ZSA9IHZhbHVlKGF0dHJpYnV0ZVZhbHVlKTtcblx0fVxuXG5cdHJldHVybiBbcHJvcGVydHlOYW1lLCB2YWx1ZV07XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tRXZlbnRDbGFzcyA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuaWYgKHR5cGVvZiBjdXN0b21FdmVudENsYXNzICE9PSAnZnVuY3Rpb24nKSB7XG5cdGNvbnN0IGN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcblx0XHRwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG5cdFx0Y29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cdFx0ZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcblx0XHRyZXR1cm4gZXZ0O1xuXHR9O1xuXG5cdGlmIChnbG9iYWwuRXZlbnQpIHtcblx0XHRjdXN0b21FdmVudC5wcm90b3R5cGUgPSBnbG9iYWwuRXZlbnQucHJvdG90eXBlO1xuXHR9XG5cblx0Y3VzdG9tRXZlbnRDbGFzcyA9IGN1c3RvbUV2ZW50O1xufVxuXG4vKipcbiAqIENhbGxlZCBieSBIVE1MRWxlbWVudCBzdWJjbGFzcyB0byBpbml0aWFsaXplIGl0c2VsZiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBhdHRyaWJ1dGVzL3Byb3BlcnRpZXMvZXZlbnRzLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGluaXRpYWxpemUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRWxlbWVudChlbGVtZW50OiBDdXN0b21FbGVtZW50KSB7XG5cdGxldCBpbml0aWFsUHJvcGVydGllczogYW55ID0ge307XG5cblx0Y29uc3Qge1xuXHRcdGNoaWxkcmVuVHlwZSA9IENoaWxkcmVuVHlwZS5ET0pPLFxuXHRcdGF0dHJpYnV0ZXMgPSBbXSxcblx0XHRldmVudHMgPSBbXSxcblx0XHRwcm9wZXJ0aWVzID0gW10sXG5cdFx0aW5pdGlhbGl6YXRpb25cblx0fSA9IGVsZW1lbnQuZ2V0RGVzY3JpcHRvcigpO1xuXG5cdGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0Y29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5hdHRyaWJ1dGVOYW1lO1xuXG5cdFx0Y29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gPSBnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoXG5cdFx0XHRhdHRyaWJ1dGVOYW1lLFxuXHRcdFx0ZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpKSxcblx0XHRcdGF0dHJpYnV0ZVxuXHRcdCk7XG5cdFx0aW5pdGlhbFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XG5cdH0pO1xuXG5cdGxldCBjdXN0b21Qcm9wZXJ0aWVzOiBQcm9wZXJ0eURlc2NyaXB0b3JNYXAgPSB7fTtcblxuXHRhdHRyaWJ1dGVzLnJlZHVjZSgocHJvcGVydGllcywgYXR0cmlidXRlKSA9PiB7XG5cdFx0Y29uc3QgeyBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZSB9ID0gYXR0cmlidXRlO1xuXG5cdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQodmFsdWU6IGFueSkge1xuXHRcdFx0XHRjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSA9IGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShcblx0XHRcdFx0XHRhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZSxcblx0XHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVcblx0XHRcdFx0KTtcblx0XHRcdFx0ZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnNldFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0YXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywge1xuXHRcdFx0XHRcdFx0W3Byb3BlcnR5TmFtZV06IHByb3BlcnR5VmFsdWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fSwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0cHJvcGVydGllcy5yZWR1Y2UoKHByb3BlcnRpZXMsIHByb3BlcnR5KSA9PiB7XG5cdFx0Y29uc3QgeyBwcm9wZXJ0eU5hbWUsIGdldFZhbHVlLCBzZXRWYWx1ZSB9ID0gcHJvcGVydHk7XG5cdFx0Y29uc3QgeyB3aWRnZXRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUgfSA9IHByb3BlcnR5O1xuXG5cdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5wcm9wZXJ0aWVzW3dpZGdldFByb3BlcnR5TmFtZV07XG5cdFx0XHRcdHJldHVybiBnZXRWYWx1ZSA/IGdldFZhbHVlKHZhbHVlKSA6IHZhbHVlO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0KHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0ZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnNldFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0YXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywge1xuXHRcdFx0XHRcdFx0W3dpZGdldFByb3BlcnR5TmFtZV06IHNldFZhbHVlID8gc2V0VmFsdWUodmFsdWUpIDogdmFsdWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fSwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWxlbWVudCwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0Ly8gZGVmaW5lIGV2ZW50c1xuXHRldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcblx0XHRjb25zdCB7IHByb3BlcnR5TmFtZSwgZXZlbnROYW1lIH0gPSBldmVudDtcblxuXHRcdGluaXRpYWxQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSAoZXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KFxuXHRcdFx0XHRuZXcgY3VzdG9tRXZlbnRDbGFzcyhldmVudE5hbWUsIHtcblx0XHRcdFx0XHRidWJibGVzOiBmYWxzZSxcblx0XHRcdFx0XHRkZXRhaWw6IGV2ZW50XG5cdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdH07XG5cdH0pO1xuXG5cdGlmIChpbml0aWFsaXphdGlvbikge1xuXHRcdGluaXRpYWxpemF0aW9uLmNhbGwoZWxlbWVudCwgaW5pdGlhbFByb3BlcnRpZXMpO1xuXHR9XG5cblx0Y29uc3QgcHJvamVjdG9yID0gUHJvamVjdG9yTWl4aW4oZWxlbWVudC5nZXRXaWRnZXRDb25zdHJ1Y3RvcigpKTtcblx0Y29uc3Qgd2lkZ2V0SW5zdGFuY2UgPSBuZXcgcHJvamVjdG9yKCk7XG5cblx0d2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyhpbml0aWFsUHJvcGVydGllcyk7XG5cdGVsZW1lbnQuc2V0V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRsZXQgY2hpbGRyZW46IEROb2RlW10gPSBbXTtcblx0XHRsZXQgZWxlbWVudENoaWxkcmVuID0gYXJyYXlGcm9tKGVsZW1lbnQuY2hpbGRyZW4pIGFzIEN1c3RvbUVsZW1lbnRbXTtcblxuXHRcdGVsZW1lbnRDaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IEN1c3RvbUVsZW1lbnQsIGluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnRpZXMgPSB7IGtleTogYGNoaWxkLSR7aW5kZXh9YCB9O1xuXHRcdFx0aWYgKGNoaWxkcmVuVHlwZSA9PT0gQ2hpbGRyZW5UeXBlLkRPSk8pIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaCh3KERvbVRvV2lkZ2V0V3JhcHBlcihjaGlsZE5vZGUpLCBwcm9wZXJ0aWVzKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKHcoRG9tV3JhcHBlcihjaGlsZE5vZGUpLCBwcm9wZXJ0aWVzKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZWxlbWVudENoaWxkcmVuLmZvckVhY2goKGNoaWxkTm9kZTogRWxlbWVudCkgPT4ge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xuXHRcdH0pO1xuXG5cdFx0d2lkZ2V0SW5zdGFuY2Uuc2V0Q2hpbGRyZW4oY2hpbGRyZW4pO1xuXHRcdHdpZGdldEluc3RhbmNlLmFwcGVuZChlbGVtZW50KTtcblx0fTtcbn1cblxuLyoqXG4gKiBDYWxsZWQgYnkgSFRNTEVsZW1lbnQgc3ViY2xhc3Mgd2hlbiBhbiBIVE1MIGF0dHJpYnV0ZSBoYXMgY2hhbmdlZC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCAgICAgVGhlIGVsZW1lbnQgd2hvc2UgYXR0cmlidXRlcyBhcmUgYmVpbmcgd2F0Y2hlZFxuICogQHBhcmFtIG5hbWUgICAgICAgIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSBuZXdWYWx1ZSAgICBUaGUgbmV3IHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSBvbGRWYWx1ZSAgICBUaGUgb2xkIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUF0dHJpYnV0ZUNoYW5nZWQoXG5cdGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQsXG5cdG5hbWU6IHN0cmluZyxcblx0bmV3VmFsdWU6IHN0cmluZyB8IG51bGwsXG5cdG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsXG4pIHtcblx0Y29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuZ2V0RGVzY3JpcHRvcigpLmF0dHJpYnV0ZXMgfHwgW107XG5cblx0YXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcblx0XHRjb25zdCB7IGF0dHJpYnV0ZU5hbWUgfSA9IGF0dHJpYnV0ZTtcblxuXHRcdGlmIChhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0Y29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gPSBnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgbmV3VmFsdWUsIGF0dHJpYnV0ZSk7XG5cdFx0XHRlbGVtZW50XG5cdFx0XHRcdC5nZXRXaWRnZXRJbnN0YW5jZSgpXG5cdFx0XHRcdC5zZXRQcm9wZXJ0aWVzKGFzc2lnbih7fSwgZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnByb3BlcnRpZXMsIHsgW3Byb3BlcnR5TmFtZV06IHByb3BlcnR5VmFsdWUgfSkpO1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY3VzdG9tRWxlbWVudHMudHMiLCJpbXBvcnQgU3ltYm9sIGZyb20gJ0Bkb2pvL3NoaW0vU3ltYm9sJztcbmltcG9ydCB7XG5cdENvbnN0cnVjdG9yLFxuXHREZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0RGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyxcblx0RE5vZGUsXG5cdFZOb2RlLFxuXHRSZWdpc3RyeUxhYmVsLFxuXHRWTm9kZVByb3BlcnRpZXMsXG5cdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFdOb2RlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFdOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFdOb2RlLicpO1xuXG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBWTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBWTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZS4nKTtcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgV05vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV05vZGU8VyBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdGNoaWxkOiBETm9kZTxXPlxuKTogY2hpbGQgaXMgV05vZGU8Vz4ge1xuXHRyZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IFdOT0RFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQ6IEROb2RlKTogY2hpbGQgaXMgVk5vZGUge1xuXHRyZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IFZOT0RFKTtcbn1cblxuLyoqXG4gKiBHZW5lcmljIGRlY29yYXRlIGZ1bmN0aW9uIGZvciBETm9kZXMuIFRoZSBub2RlcyBhcmUgbW9kaWZpZWQgaW4gcGxhY2UgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHByZWRpY2F0ZVxuICogYW5kIG1vZGlmaWVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBUaGUgY2hpbGRyZW4gb2YgZWFjaCBub2RlIGFyZSBmbGF0dGVuZWQgYW5kIGFkZGVkIHRvIHRoZSBhcnJheSBmb3IgZGVjb3JhdGlvbi5cbiAqXG4gKiBJZiBubyBwcmVkaWNhdGUgaXMgc3VwcGxpZWQgdGhlbiB0aGUgbW9kaWZpZXIgd2lsbCBiZSBleGVjdXRlZCBvbiBhbGwgbm9kZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KFxuXHRkTm9kZXM6IEROb2RlLFxuXHRtb2RpZmllcjogKGROb2RlOiBUKSA9PiB2b2lkLFxuXHRwcmVkaWNhdGU6IChkTm9kZTogRE5vZGUpID0+IGROb2RlIGlzIFRcbik6IEROb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oXG5cdGROb2RlczogRE5vZGVbXSxcblx0bW9kaWZpZXI6IChkTm9kZTogVCkgPT4gdm9pZCxcblx0cHJlZGljYXRlOiAoZE5vZGU6IEROb2RlKSA9PiBkTm9kZSBpcyBUXG4pOiBETm9kZVtdO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGROb2RlczogRE5vZGUsIG1vZGlmaWVyOiAoZE5vZGU6IEROb2RlKSA9PiB2b2lkKTogRE5vZGU7XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGUoZE5vZGVzOiBETm9kZVtdLCBtb2RpZmllcjogKGROb2RlOiBETm9kZSkgPT4gdm9pZCk6IEROb2RlW107XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGUoXG5cdGROb2RlczogRE5vZGUgfCBETm9kZVtdLFxuXHRtb2RpZmllcjogKGROb2RlOiBETm9kZSkgPT4gdm9pZCxcblx0cHJlZGljYXRlPzogKGROb2RlOiBETm9kZSkgPT4gYm9vbGVhblxuKTogRE5vZGUgfCBETm9kZVtdIHtcblx0bGV0IG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gWy4uLmROb2Rlc10gOiBbZE5vZGVzXTtcblx0d2hpbGUgKG5vZGVzLmxlbmd0aCkge1xuXHRcdGNvbnN0IG5vZGUgPSBub2Rlcy5wb3AoKTtcblx0XHRpZiAobm9kZSkge1xuXHRcdFx0aWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKG5vZGUpKSB7XG5cdFx0XHRcdG1vZGlmaWVyKG5vZGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKChpc1dOb2RlKG5vZGUpIHx8IGlzVk5vZGUobm9kZSkpICYmIG5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0bm9kZXMgPSBbLi4ubm9kZXMsIC4uLm5vZGUuY2hpbGRyZW5dO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZE5vZGVzO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHc8VyBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHR3aWRnZXRDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8Vz4gfCBSZWdpc3RyeUxhYmVsLFxuXHRwcm9wZXJ0aWVzOiBXWydwcm9wZXJ0aWVzJ10sXG5cdGNoaWxkcmVuOiBXWydjaGlsZHJlbiddID0gW11cbik6IFdOb2RlPFc+IHtcblx0cmV0dXJuIHtcblx0XHRjaGlsZHJlbixcblx0XHR3aWRnZXRDb25zdHJ1Y3Rvcixcblx0XHRwcm9wZXJ0aWVzLFxuXHRcdHR5cGU6IFdOT0RFXG5cdH07XG59XG5cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIFZOb2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHYodGFnOiBzdHJpbmcsIHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyB8IERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMsIGNoaWxkcmVuPzogRE5vZGVbXSk6IFZOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIHYodGFnOiBzdHJpbmcsIGNoaWxkcmVuOiB1bmRlZmluZWQgfCBETm9kZVtdKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZyk6IFZOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIHYoXG5cdHRhZzogc3RyaW5nLFxuXHRwcm9wZXJ0aWVzT3JDaGlsZHJlbjogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyB8IEROb2RlW10gPSB7fSxcblx0Y2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlW10gPSB1bmRlZmluZWRcbik6IFZOb2RlIHtcblx0bGV0IHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyB8IERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcblx0bGV0IGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrO1xuXG5cdGlmIChBcnJheS5pc0FycmF5KHByb3BlcnRpZXNPckNoaWxkcmVuKSkge1xuXHRcdGNoaWxkcmVuID0gcHJvcGVydGllc09yQ2hpbGRyZW47XG5cdFx0cHJvcGVydGllcyA9IHt9O1xuXHR9XG5cblx0aWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0ZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xuXHRcdHByb3BlcnRpZXMgPSB7fTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dGFnLFxuXHRcdGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrLFxuXHRcdGNoaWxkcmVuLFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkLnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gcnVuIGFzIGFuIGFzcGVjdCB0byBgcmVuZGVyYFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kOiBGdW5jdGlvbik6ICh0YXJnZXQ6IGFueSkgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcigpOiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kPzogRnVuY3Rpb24pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFmdGVyUmVuZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGFmdGVyUmVuZGVyLnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgQmVmb3JlUHJvcGVydGllcyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVjb3JhdG9yIHRoYXQgYWRkcyB0aGUgZnVuY3Rpb24gcGFzc2VkIG9mIHRhcmdldCBtZXRob2QgdG8gYmUgcnVuXG4gKiBpbiB0aGUgYGJlZm9yZVByb3BlcnRpZXNgIGxpZmVjeWNsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kOiBCZWZvcmVQcm9wZXJ0aWVzKTogKHRhcmdldDogYW55KSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMoKTogKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nKSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kPzogQmVmb3JlUHJvcGVydGllcykge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiZWZvcmVQcm9wZXJ0aWVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGJlZm9yZVByb3BlcnRpZXMudHMiLCJpbXBvcnQgeyBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXIgfSBmcm9tICcuLi9jdXN0b21FbGVtZW50cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHJlZ2lzdGVyQ3VzdG9tRWxlbWVudCBmcm9tICcuLi9yZWdpc3RlckN1c3RvbUVsZW1lbnQnO1xuXG5kZWNsYXJlIGNvbnN0IF9fZG9qb0N1c3RvbUVsZW1lbnRzX186IGJvb2xlYW47XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY3VzdG9tIGVsZW1lbnQgY29uZmlndXJhdGlvbiB1c2VkIGJ5IHRoZSBjdXN0b21FbGVtZW50IGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRDb25maWc8UCBleHRlbmRzIFdpZGdldFByb3BlcnRpZXM+IHtcblx0LyoqXG5cdCAqIFRoZSB0YWcgb2YgdGhlIGN1c3RvbSBlbGVtZW50XG5cdCAqL1xuXHR0YWc6IHN0cmluZztcblxuXHQvKipcblx0ICogTGlzdCBvZiB3aWRnZXQgcHJvcGVydGllcyB0byBleHBvc2UgYXMgcHJvcGVydGllcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHByb3BlcnRpZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBhdHRyaWJ1dGVzIG9uIHRoZSBjdXN0b20gZWxlbWVudCB0byBtYXAgdG8gd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdGF0dHJpYnV0ZXM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiBldmVudHMgdG8gZXhwb3NlXG5cdCAqL1xuXHRldmVudHM/OiAoa2V5b2YgUClbXTtcblxuXHQvKipcblx0ICogSW5pdGlhbGl6YXRpb24gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSB0aGUgd2lkZ2V0IGlzIGNyZWF0ZWQgKGZvciBjdXN0b20gcHJvcGVydHkgc2V0dGluZylcblx0ICovXG5cdGluaXRpYWxpemF0aW9uPzogQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyO1xufVxuXG4vKipcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21FbGVtZW50PFAgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzID0gV2lkZ2V0UHJvcGVydGllcz4oe1xuXHR0YWcsXG5cdHByb3BlcnRpZXMsXG5cdGF0dHJpYnV0ZXMsXG5cdGV2ZW50cyxcblx0aW5pdGlhbGl6YXRpb25cbn06IEN1c3RvbUVsZW1lbnRDb25maWc8UD4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uPFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjxhbnk+Pih0YXJnZXQ6IFQpIHtcblx0XHRpZiAodHlwZW9mIF9fZG9qb0N1c3RvbUVsZW1lbnRzX18gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZWdpc3RlckN1c3RvbUVsZW1lbnQoKCkgPT4gKHtcblx0XHRcdFx0dGFnTmFtZTogdGFnLFxuXHRcdFx0XHR3aWRnZXRDb25zdHJ1Y3RvcjogdGFyZ2V0LFxuXHRcdFx0XHRhdHRyaWJ1dGVzOiAoYXR0cmlidXRlcyB8fCBbXSkubWFwKChhdHRyaWJ1dGVOYW1lKSA9PiAoeyBhdHRyaWJ1dGVOYW1lIH0pKSxcblx0XHRcdFx0cHJvcGVydGllczogKHByb3BlcnRpZXMgfHwgW10pLm1hcCgocHJvcGVydHlOYW1lKSA9PiAoeyBwcm9wZXJ0eU5hbWUgfSkpLFxuXHRcdFx0XHRldmVudHM6IChldmVudHMgfHwgW10pLm1hcCgocHJvcGVydHlOYW1lKSA9PiAoe1xuXHRcdFx0XHRcdHByb3BlcnR5TmFtZSxcblx0XHRcdFx0XHRldmVudE5hbWU6IHByb3BlcnR5TmFtZS5yZXBsYWNlKCdvbicsICcnKS50b0xvd2VyQ2FzZSgpXG5cdFx0XHRcdH0pKSxcblx0XHRcdFx0aW5pdGlhbGl6YXRpb25cblx0XHRcdH0pKTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1c3RvbUVsZW1lbnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY3VzdG9tRWxlbWVudC50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IERpZmZQcm9wZXJ0eUZ1bmN0aW9uIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZTogc3RyaW5nLCBkaWZmRnVuY3Rpb246IERpZmZQcm9wZXJ0eUZ1bmN0aW9uLCByZWFjdGlvbkZ1bmN0aW9uPzogRnVuY3Rpb24pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoYGRpZmZQcm9wZXJ0eToke3Byb3BlcnR5TmFtZX1gLCBkaWZmRnVuY3Rpb24uYmluZChudWxsKSk7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XG5cdFx0aWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcblx0XHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicsIHtcblx0XHRcdFx0cHJvcGVydHlOYW1lLFxuXHRcdFx0XHRyZWFjdGlvbjogcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogcmVhY3Rpb25GdW5jdGlvblxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlmZlByb3BlcnR5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGRpZmZQcm9wZXJ0eS50cyIsImV4cG9ydCB0eXBlIERlY29yYXRvckhhbmRsZXIgPSAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nKSA9PiB2b2lkO1xuXG4vKipcbiAqIEdlbmVyaWMgZGVjb3JhdG9yIGhhbmRsZXIgdG8gdGFrZSBjYXJlIG9mIHdoZXRoZXIgb3Igbm90IHRoZSBkZWNvcmF0b3Igd2FzIGNhbGxlZCBhdCB0aGUgY2xhc3MgbGV2ZWxcbiAqIG9yIHRoZSBtZXRob2QgbGV2ZWwuXG4gKlxuICogQHBhcmFtIGhhbmRsZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZURlY29yYXRvcihoYW5kbGVyOiBEZWNvcmF0b3JIYW5kbGVyKSB7XG5cdHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcsIGRlc2NyaXB0b3I/OiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcblx0XHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0aGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoYW5kbGVyKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRGVjb3JhdG9yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGhhbmRsZURlY29yYXRvci50cyIsImltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi8uLi9JbmplY3Rvcic7XG5pbXBvcnQgeyBiZWZvcmVQcm9wZXJ0aWVzIH0gZnJvbSAnLi9iZWZvcmVQcm9wZXJ0aWVzJztcbmltcG9ydCB7IFJlZ2lzdHJ5TGFiZWwgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIE1hcCBvZiBpbnN0YW5jZXMgYWdhaW5zdCByZWdpc3RlcmVkIGluamVjdG9ycy5cbiAqL1xuY29uc3QgcmVnaXN0ZXJlZEluamVjdG9yc01hcDogV2Vha01hcDxXaWRnZXRCYXNlLCBJbmplY3RvcltdPiA9IG5ldyBXZWFrTWFwKCk7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29udHJhY3QgcmVxdWlyZXMgZm9yIHRoZSBnZXQgcHJvcGVydGllcyBmdW5jdGlvblxuICogdXNlZCB0byBtYXAgdGhlIGluamVjdGVkIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2V0UHJvcGVydGllczxUID0gYW55PiB7XG5cdChwYXlsb2FkOiBhbnksIHByb3BlcnRpZXM6IFQpOiBUO1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIGluamVjdCBjb25maWd1cmF0aW9uIHJlcXVpcmVkIGZvciB1c2Ugb2YgdGhlIGBpbmplY3RgIGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdENvbmZpZyB7XG5cdC8qKlxuXHQgKiBUaGUgbGFiZWwgb2YgdGhlIHJlZ2lzdHJ5IGluamVjdG9yXG5cdCAqL1xuXHRuYW1lOiBSZWdpc3RyeUxhYmVsO1xuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgcHJvcGVydHVlcyB0byBpbmplY3QgdXNpbmcgdGhlIHBhc3NlZCBwcm9wZXJ0aWVzXG5cdCAqIGFuZCB0aGUgaW5qZWN0ZWQgcGF5bG9hZC5cblx0ICovXG5cdGdldFByb3BlcnRpZXM6IEdldFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogRGVjb3JhdG9yIHJldHJpZXZlcyBhbiBpbmplY3RvciBmcm9tIGFuIGF2YWlsYWJsZSByZWdpc3RyeSB1c2luZyB0aGUgbmFtZSBhbmRcbiAqIGNhbGxzIHRoZSBgZ2V0UHJvcGVydGllc2AgZnVuY3Rpb24gd2l0aCB0aGUgcGF5bG9hZCBmcm9tIHRoZSBpbmplY3RvclxuICogYW5kIGN1cnJlbnQgcHJvcGVydGllcyB3aXRoIHRoZSB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gSW5qZWN0Q29uZmlnIHRoZSBpbmplY3QgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KHsgbmFtZSwgZ2V0UHJvcGVydGllcyB9OiBJbmplY3RDb25maWcpIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdGJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24odGhpczogV2lkZ2V0QmFzZSwgcHJvcGVydGllczogYW55KSB7XG5cdFx0XHRjb25zdCBpbmplY3RvciA9IHRoaXMucmVnaXN0cnkuZ2V0SW5qZWN0b3IobmFtZSk7XG5cdFx0XHRpZiAoaW5qZWN0b3IpIHtcblx0XHRcdFx0Y29uc3QgcmVnaXN0ZXJlZEluamVjdG9ycyA9IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuZ2V0KHRoaXMpIHx8IFtdO1xuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZWdpc3RlcmVkSW5qZWN0b3JzTWFwLnNldCh0aGlzLCByZWdpc3RlcmVkSW5qZWN0b3JzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5pbmRleE9mKGluamVjdG9yKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRpbmplY3Rvci5vbignaW52YWxpZGF0ZScsICgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlZ2lzdGVyZWRJbmplY3RvcnMucHVzaChpbmplY3Rvcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGdldFByb3BlcnRpZXMoaW5qZWN0b3IuZ2V0KCksIHByb3BlcnRpZXMpO1xuXHRcdFx0fVxuXHRcdH0pKHRhcmdldCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbmplY3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaW5qZWN0LnRzIiwiaW1wb3J0IHsgUHJvcGVydHlDaGFuZ2VSZWNvcmQgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgV0lER0VUX0JBU0VfVFlQRSB9IGZyb20gJy4vUmVnaXN0cnknO1xuXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IHRydWUsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IGZhbHNlLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG5cdGNvbnN0IHZhbGlkT2xkUHJvcGVydHkgPSBwcmV2aW91c1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShwcmV2aW91c1Byb3BlcnR5KTtcblx0Y29uc3QgdmFsaWROZXdQcm9wZXJ0eSA9IG5ld1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSk7XG5cblx0aWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoYW5nZWQ6IHRydWUsXG5cdFx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0XHR9O1xuXHR9XG5cblx0Y29uc3QgcHJldmlvdXNLZXlzID0gT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0eSk7XG5cdGNvbnN0IG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdQcm9wZXJ0eSk7XG5cblx0aWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XG5cdFx0Y2hhbmdlZCA9IHRydWU7XG5cdH0gZWxzZSB7XG5cdFx0Y2hhbmdlZCA9IG5ld0tleXMuc29tZSgoa2V5KSA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3UHJvcGVydHlba2V5XSAhPT0gcHJldmlvdXNQcm9wZXJ0eVtrZXldO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZCxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG8ocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRsZXQgcmVzdWx0O1xuXHRpZiAodHlwZW9mIG5ld1Byb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0aWYgKG5ld1Byb3BlcnR5Ll90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKSB7XG5cdFx0XHRyZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdH1cblx0fSBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XG5cdFx0cmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdH0gZWxzZSB7XG5cdFx0cmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGRpZmYudHMiLCJpbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICdAZG9qby9zaGltL2dsb2JhbCc7XG5pbXBvcnQgeyBjcmVhdGVIYW5kbGUgfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCAncGVwanMnO1xuaW1wb3J0IGNzc1RyYW5zaXRpb25zIGZyb20gJy4uL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIEROb2RlLCBQcm9qZWN0aW9uLCBQcm9qZWN0aW9uT3B0aW9ucyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGFmdGVyUmVuZGVyIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyJztcbmltcG9ydCB7IHYgfSBmcm9tICcuLy4uL2QnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IGRvbSwgd2lkZ2V0SW5zdGFuY2VNYXAgfSBmcm9tICcuLy4uL3Zkb20nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGF0dGFjaCBzdGF0ZSBvZiB0aGUgcHJvamVjdG9yXG4gKi9cbmV4cG9ydCBlbnVtIFByb2plY3RvckF0dGFjaFN0YXRlIHtcblx0QXR0YWNoZWQgPSAxLFxuXHREZXRhY2hlZFxufVxuXG4vKipcbiAqIEF0dGFjaCB0eXBlIGZvciB0aGUgcHJvamVjdG9yXG4gKi9cbmV4cG9ydCBlbnVtIEF0dGFjaFR5cGUge1xuXHRBcHBlbmQgPSAxLFxuXHRNZXJnZSA9IDIsXG5cdFJlcGxhY2UgPSAzXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0YWNoT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBJZiBgJ2FwcGVuZCdgIGl0IHdpbGwgYXBwZW5kZWQgdG8gdGhlIHJvb3QuIElmIGAnbWVyZ2UnYCBpdCB3aWxsIG1lcmdlZCB3aXRoIHRoZSByb290LiBJZiBgJ3JlcGxhY2UnYCBpdCB3aWxsXG5cdCAqIHJlcGxhY2UgdGhlIHJvb3QuXG5cdCAqL1xuXHR0eXBlOiBBdHRhY2hUeXBlO1xuXG5cdC8qKlxuXHQgKiBFbGVtZW50IHRvIGF0dGFjaCB0aGUgcHJvamVjdG9yLlxuXHQgKi9cblx0cm9vdD86IEVsZW1lbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yUHJvcGVydGllcyB7XG5cdHJlZ2lzdHJ5PzogUmVnaXN0cnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yTWl4aW48UD4ge1xuXHRyZWFkb25seSBwcm9wZXJ0aWVzOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFByb2plY3RvclByb3BlcnRpZXM+O1xuXG5cdC8qKlxuXHQgKiBBcHBlbmQgdGhlIHByb2plY3RvciB0byB0aGUgcm9vdC5cblx0ICovXG5cdGFwcGVuZChyb290PzogRWxlbWVudCk6IEhhbmRsZTtcblxuXHQvKipcblx0ICogTWVyZ2UgdGhlIHByb2plY3RvciBvbnRvIHRoZSByb290LlxuXHQgKlxuXHQgKiBUaGUgYHJvb3RgIGFuZCBhbnkgb2YgaXRzIGBjaGlsZHJlbmAgd2lsbCBiZSByZS11c2VkLiAgQW55IGV4Y2VzcyBET00gbm9kZXMgd2lsbCBiZSBpZ25vcmVkIGFuZCBhbnkgbWlzc2luZyBET00gbm9kZXNcblx0ICogd2lsbCBiZSBjcmVhdGVkLlxuXHQgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBlbGVtZW50IHRoYXQgdGhlIHJvb3QgdmlydHVhbCBET00gbm9kZSB3aWxsIGJlIG1lcmdlZCB3aXRoLiAgRGVmYXVsdHMgdG8gYGRvY3VtZW50LmJvZHlgLlxuXHQgKi9cblx0bWVyZ2Uocm9vdD86IEVsZW1lbnQpOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIFJlcGxhY2UgdGhlIHJvb3Qgd2l0aCB0aGUgcHJvamVjdG9yIG5vZGUuXG5cdCAqL1xuXHRyZXBsYWNlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBQYXVzZSB0aGUgcHJvamVjdG9yLlxuXHQgKi9cblx0cGF1c2UoKTogdm9pZDtcblxuXHQvKipcblx0ICogUmVzdW1lIHRoZSBwcm9qZWN0b3IuXG5cdCAqL1xuXHRyZXN1bWUoKTogdm9pZDtcblxuXHQvKipcblx0ICogQXR0YWNoIHRoZSBwcm9qZWN0IHRvIGEgX3NhbmRib3hlZF8gZG9jdW1lbnQgZnJhZ21lbnQgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgRE9NLlxuXHQgKlxuXHQgKiBXaGVuIHNhbmRib3hlZCwgdGhlIGBQcm9qZWN0b3JgIHdpbGwgcnVuIGluIGEgc3luYyBtYW5uZXIsIHdoZXJlIHJlbmRlcnMgYXJlIGNvbXBsZXRlZCB3aXRoaW4gdGhlIHNhbWUgdHVybi5cblx0ICogVGhlIGBQcm9qZWN0b3JgIGNyZWF0ZXMgYSBgRG9jdW1lbnRGcmFnbWVudGAgd2hpY2ggcmVwbGFjZXMgYW55IG90aGVyIGByb290YCB0aGF0IGhhcyBiZWVuIHNldC5cblx0ICogQHBhcmFtIGRvYyBUaGUgYERvY3VtZW50YCB0byB1c2UsIHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBnbG9iYWwgYGRvY3VtZW50YC5cblx0ICovXG5cdHNhbmRib3goZG9jPzogRG9jdW1lbnQpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBTY2hlZHVsZSBhIHJlbmRlci5cblx0ICovXG5cdHNjaGVkdWxlUmVuZGVyKCk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHByb3BlcnRpZXMgZm9yIHRoZSB3aWRnZXQuIFJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIHRoZSBkaWZmaW5nIGZ1bmN0aW9ucyBmb3IgdGhlIHByb3BlcnRpZXMgYWdhaW5zdCB0aGVcblx0ICogcHJldmlvdXMgcHJvcGVydGllcy4gUnVucyB0aG91Z2ggYW55IHJlZ2lzdGVyZWQgc3BlY2lmaWMgcHJvcGVydHkgZGlmZiBmdW5jdGlvbnMgY29sbGVjdGluZyB0aGUgcmVzdWx0cyBhbmQgdGhlblxuXHQgKiBydW5zIHRoZSByZW1haW5kZXIgdGhyb3VnaCB0aGUgY2F0Y2ggYWxsIGRpZmYgZnVuY3Rpb24uIFRoZSBhZ2dyZWdhdGUgb2YgdGhlIHR3byBzZXRzIG9mIHRoZSByZXN1bHRzIGlzIHRoZW5cblx0ICogc2V0IGFzIHRoZSB3aWRnZXQncyBwcm9wZXJ0aWVzXG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBuZXcgd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHNldFByb3BlcnRpZXMocHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZDtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgd2lkZ2V0J3MgY2hpbGRyZW5cblx0ICovXG5cdHNldENoaWxkcmVuKGNoaWxkcmVuOiBETm9kZVtdKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGEgYHN0cmluZ2AgdGhhdCByZXByZXNlbnRzIHRoZSBIVE1MIG9mIHRoZSBjdXJyZW50IHByb2plY3Rpb24uICBUaGUgcHJvamVjdG9yIG5lZWRzIHRvIGJlIGF0dGFjaGVkLlxuXHQgKi9cblx0dG9IdG1sKCk6IHN0cmluZztcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIHRoZSBwcm9qZWN0b3JzIGlzIGluIGFzeW5jIG1vZGUsIGNvbmZpZ3VyZWQgdG8gYHRydWVgIGJ5IGRlZmF1bHRzLlxuXHQgKi9cblx0YXN5bmM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJvb3QgZWxlbWVudCB0byBhdHRhY2ggdGhlIHByb2plY3RvclxuXHQgKi9cblx0cm9vdDogRWxlbWVudDtcblxuXHQvKipcblx0ICogVGhlIHN0YXR1cyBvZiB0aGUgcHJvamVjdG9yXG5cdCAqL1xuXHRyZWFkb25seSBwcm9qZWN0b3JTdGF0ZTogUHJvamVjdG9yQXR0YWNoU3RhdGU7XG5cblx0LyoqXG5cdCAqIEV4cG9zZXMgaW52YWxpZGF0ZSBmb3IgcHJvamVjdG9yIGluc3RhbmNlc1xuXHQgKi9cblx0aW52YWxpZGF0ZSgpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSdW5zIHJlZ2lzdGVyZWQgZGVzdHJveSBoYW5kbGVzXG5cdCAqL1xuXHRkZXN0cm95KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0b3JNaXhpbjxQLCBUIGV4dGVuZHMgQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxQPj4+KEJhc2U6IFQpOiBUICYgQ29uc3RydWN0b3I8UHJvamVjdG9yTWl4aW48UD4+IHtcblx0Y2xhc3MgUHJvamVjdG9yIGV4dGVuZHMgQmFzZSB7XG5cdFx0cHVibGljIHByb2plY3RvclN0YXRlOiBQcm9qZWN0b3JBdHRhY2hTdGF0ZTtcblx0XHRwdWJsaWMgcHJvcGVydGllczogUmVhZG9ubHk8UD4gJiBSZWFkb25seTxQcm9qZWN0b3JQcm9wZXJ0aWVzPjtcblxuXHRcdHByaXZhdGUgX3Jvb3Q6IEVsZW1lbnQ7XG5cdFx0cHJpdmF0ZSBfYXN5bmMgPSB0cnVlO1xuXHRcdHByaXZhdGUgX2F0dGFjaEhhbmRsZTogSGFuZGxlO1xuXHRcdHByaXZhdGUgX3Byb2plY3Rpb25PcHRpb25zOiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPjtcblx0XHRwcml2YXRlIF9wcm9qZWN0aW9uOiBQcm9qZWN0aW9uIHwgdW5kZWZpbmVkO1xuXHRcdHByaXZhdGUgX3NjaGVkdWxlZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXHRcdHByaXZhdGUgX3BhdXNlZDogYm9vbGVhbjtcblx0XHRwcml2YXRlIF9ib3VuZERvUmVuZGVyOiAoKSA9PiB2b2lkO1xuXHRcdHByaXZhdGUgX2JvdW5kUmVuZGVyOiBGdW5jdGlvbjtcblx0XHRwcml2YXRlIF9wcm9qZWN0b3JDaGlsZHJlbjogRE5vZGVbXSA9IFtdO1xuXHRcdHByaXZhdGUgX3Byb2plY3RvclByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSA9IHt9IGFzIHRoaXNbJ3Byb3BlcnRpZXMnXTtcblx0XHRwcml2YXRlIF9oYW5kbGVzOiBGdW5jdGlvbltdID0gW107XG5cblx0XHRjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuXHRcdFx0c3VwZXIoLi4uYXJncyk7XG5cblx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cblx0XHRcdGluc3RhbmNlRGF0YS5wYXJlbnRJbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNjaGVkdWxlUmVuZGVyKCk7XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5fYm91bmREb1JlbmRlciA9IHRoaXMuX2RvUmVuZGVyLmJpbmQodGhpcyk7XG5cdFx0XHR0aGlzLl9ib3VuZFJlbmRlciA9IHRoaXMuX19yZW5kZXJfXy5iaW5kKHRoaXMpO1xuXHRcdFx0dGhpcy5yb290ID0gZG9jdW1lbnQuYm9keTtcblx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcblx0XHR9XG5cblx0XHRwdWJsaWMgYXBwZW5kKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBtZXJnZShyb290PzogRWxlbWVudCk6IEhhbmRsZSB7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHR0eXBlOiBBdHRhY2hUeXBlLk1lcmdlLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyByZXBsYWNlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuUmVwbGFjZSxcblx0XHRcdFx0cm9vdFxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgcGF1c2UoKSB7XG5cdFx0XHRpZiAodGhpcy5fc2NoZWR1bGVkKSB7XG5cdFx0XHRcdGdsb2JhbC5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9zY2hlZHVsZWQpO1xuXHRcdFx0XHR0aGlzLl9zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wYXVzZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyByZXN1bWUoKSB7XG5cdFx0XHR0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMuc2NoZWR1bGVSZW5kZXIoKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2NoZWR1bGVSZW5kZXIoKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhpcy5fX3NldFByb3BlcnRpZXNfXyh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzKTtcblx0XHRcdFx0dGhpcy5fX3NldENoaWxkcmVuX18odGhpcy5fcHJvamVjdG9yQ2hpbGRyZW4pO1xuXHRcdFx0XHQodGhpcyBhcyBhbnkpLl9yZW5kZXJTdGF0ZSA9IDE7XG5cdFx0XHRcdGlmICghdGhpcy5fc2NoZWR1bGVkICYmICF0aGlzLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fYXN5bmMpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3NjaGVkdWxlZCA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYm91bmREb1JlbmRlcik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX2JvdW5kRG9SZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0IHJvb3Qocm9vdDogRWxlbWVudCkge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjaGFuZ2Ugcm9vdCBlbGVtZW50Jyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9yb290ID0gcm9vdDtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IHJvb3QoKTogRWxlbWVudCB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcm9vdDtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGFzeW5jKCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FzeW5jO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXQgYXN5bmMoYXN5bmM6IGJvb2xlYW4pIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2FzeW5jID0gYXN5bmM7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNhbmRib3goZG9jOiBEb2N1bWVudCA9IGRvY3VtZW50KTogdm9pZCB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9hc3luYyA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgcHJldmlvdXNSb290ID0gdGhpcy5yb290O1xuXG5cdFx0XHQvKiBmcmVlIHVwIHRoZSBkb2N1bWVudCBmcmFnbWVudCBmb3IgR0MgKi9cblx0XHRcdHRoaXMub3duKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fcm9vdCA9IHByZXZpb3VzUm9vdDtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLl9hdHRhY2goe1xuXHRcdFx0XHQvKiBEb2N1bWVudEZyYWdtZW50IGlzIG5vdCBhc3NpZ25hYmxlIHRvIEVsZW1lbnQsIGJ1dCBwcm92aWRlcyBldmVyeXRoaW5nIG5lZWRlZCB0byB3b3JrICovXG5cdFx0XHRcdHJvb3Q6IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkgYXMgYW55LFxuXHRcdFx0XHR0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNldENoaWxkcmVuKGNoaWxkcmVuOiBETm9kZVtdKTogdm9pZCB7XG5cdFx0XHR0aGlzLl9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbik7XG5cdFx0XHR0aGlzLnNjaGVkdWxlUmVuZGVyKCk7XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbjogRE5vZGVbXSkge1xuXHRcdFx0dGhpcy5fcHJvamVjdG9yQ2hpbGRyZW4gPSBbLi4uY2hpbGRyZW5dO1xuXHRcdFx0c3VwZXIuX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHRcdHRoaXMuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG5cdFx0XHR0aGlzLnNjaGVkdWxlUmVuZGVyKCk7XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdFx0aWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgJiYgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSAhPT0gcHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0gYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcblx0XHRcdHN1cGVyLl9fc2V0Q29yZVByb3BlcnRpZXNfXyh7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcblx0XHRcdHN1cGVyLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0h0bWwoKTogc3RyaW5nIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBpcyBub3QgYXR0YWNoZWQsIGNhbm5vdCByZXR1cm4gYW4gSFRNTCBzdHJpbmcgb2YgcHJvamVjdGlvbi4nKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodGhpcy5fcHJvamVjdGlvbi5kb21Ob2RlLmNoaWxkTm9kZXNbMF0gYXMgRWxlbWVudCkub3V0ZXJIVE1MO1xuXHRcdH1cblxuXHRcdEBhZnRlclJlbmRlcigpXG5cdFx0cHVibGljIGFmdGVyUmVuZGVyKHJlc3VsdDogRE5vZGUpIHtcblx0XHRcdGxldCBub2RlID0gcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnIHx8IHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRub2RlID0gdignc3BhbicsIHt9LCBbcmVzdWx0XSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2RvUmVuZGVyKCkge1xuXHRcdFx0dGhpcy5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAodGhpcy5fcHJvamVjdGlvbikge1xuXHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uLnVwZGF0ZSh0aGlzLl9ib3VuZFJlbmRlcigpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIG93bihoYW5kbGU6IEZ1bmN0aW9uKTogdm9pZCB7XG5cdFx0XHR0aGlzLl9oYW5kbGVzLnB1c2goaGFuZGxlKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZGVzdHJveSgpIHtcblx0XHRcdHdoaWxlICh0aGlzLl9oYW5kbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcblx0XHRcdFx0aWYgKGhhbmRsZSkge1xuXHRcdFx0XHRcdGhhbmRsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfYXR0YWNoKHsgdHlwZSwgcm9vdCB9OiBBdHRhY2hPcHRpb25zKTogSGFuZGxlIHtcblx0XHRcdGlmIChyb290KSB7XG5cdFx0XHRcdHRoaXMucm9vdCA9IHJvb3Q7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQ7XG5cblx0XHRcdGNvbnN0IGhhbmRsZSA9ICgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdFx0dGhpcy5wYXVzZSgpO1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLm93bihoYW5kbGUpO1xuXHRcdFx0dGhpcy5fYXR0YWNoSGFuZGxlID0gY3JlYXRlSGFuZGxlKGhhbmRsZSk7XG5cblx0XHRcdHRoaXMuX3Byb2plY3Rpb25PcHRpb25zID0geyAuLi50aGlzLl9wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBzeW5jOiAhdGhpcy5fYXN5bmMgfSB9O1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLkFwcGVuZDpcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMuX2JvdW5kUmVuZGVyKCksIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLk1lcmdlOlxuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSBkb20ubWVyZ2UodGhpcy5yb290LCB0aGlzLl9ib3VuZFJlbmRlcigpLCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQXR0YWNoVHlwZS5SZXBsYWNlOlxuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSBkb20ucmVwbGFjZSh0aGlzLnJvb3QsIHRoaXMuX2JvdW5kUmVuZGVyKCksIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gUHJvamVjdG9yO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0b3JNaXhpbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBQcm9qZWN0b3IudHMiLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgV2lkZ2V0UHJvcGVydGllcywgU3VwcG9ydGVkQ2xhc3NOYW1lIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFJlZ2lzdHJ5IH0gZnJvbSAnLi8uLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vLi4vSW5qZWN0b3InO1xuaW1wb3J0IHsgaW5qZWN0IH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2luamVjdCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgZGlmZlByb3BlcnR5IH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eSc7XG5pbXBvcnQgeyBzaGFsbG93IH0gZnJvbSAnLi8uLi9kaWZmJztcblxuLyoqXG4gKiBBIGxvb2t1cCBvYmplY3QgZm9yIGF2YWlsYWJsZSBjbGFzcyBuYW1lc1xuICovXG5leHBvcnQgdHlwZSBDbGFzc05hbWVzID0ge1xuXHRba2V5OiBzdHJpbmddOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEEgbG9va3VwIG9iamVjdCBmb3IgYXZhaWxhYmxlIHdpZGdldCBjbGFzc2VzIG5hbWVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWUge1xuXHRba2V5OiBzdHJpbmddOiBvYmplY3Q7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyByZXF1aXJlZCBmb3IgdGhlIFRoZW1lZCBtaXhpblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRoZW1lZFByb3BlcnRpZXM8VCA9IENsYXNzTmFtZXM+IGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XG5cdGluamVjdGVkVGhlbWU/OiBhbnk7XG5cdHRoZW1lPzogVGhlbWU7XG5cdGV4dHJhQ2xhc3Nlcz86IHsgW1AgaW4ga2V5b2YgVF0/OiBzdHJpbmcgfTtcbn1cblxuY29uc3QgVEhFTUVfS0VZID0gJyBfa2V5JztcblxuZXhwb3J0IGNvbnN0IElOSkVDVEVEX1RIRU1FX0tFWSA9IFN5bWJvbCgndGhlbWUnKTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBUaGVtZWRNaXhpblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRoZW1lZE1peGluPFQgPSBDbGFzc05hbWVzPiB7XG5cdHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZTtcblx0dGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWVbXTtcblx0cHJvcGVydGllczogVGhlbWVkUHJvcGVydGllczxUPjtcbn1cblxuLyoqXG4gKiBEZWNvcmF0b3IgZm9yIGJhc2UgY3NzIGNsYXNzZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRoZW1lKHRoZW1lOiB7fSkge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJywgdGhlbWUpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgcmV2ZXJzZSBsb29rdXAgZm9yIHRoZSBjbGFzc2VzIHBhc3NlZCBpbiB2aWEgdGhlIGB0aGVtZWAgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGNsYXNzZXMgVGhlIGJhc2VDbGFzc2VzIG9iamVjdFxuICogQHJlcXVpcmVzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChjbGFzc2VzOiBDbGFzc05hbWVzW10pOiBDbGFzc05hbWVzIHtcblx0cmV0dXJuIGNsYXNzZXMucmVkdWNlKFxuXHRcdChjdXJyZW50Q2xhc3NOYW1lcywgYmFzZUNsYXNzKSA9PiB7XG5cdFx0XHRPYmplY3Qua2V5cyhiYXNlQ2xhc3MpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGN1cnJlbnRDbGFzc05hbWVzW2Jhc2VDbGFzc1trZXldXSA9IGtleTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRDbGFzc05hbWVzO1xuXHRcdH0sXG5cdFx0PENsYXNzTmFtZXM+e31cblx0KTtcbn1cblxuLyoqXG4gKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGlzIGdpdmVuIGEgdGhlbWUgYW5kIGFuIG9wdGlvbmFsIHJlZ2lzdHJ5LCB0aGUgdGhlbWVcbiAqIGluamVjdG9yIGlzIGRlZmluZWQgYWdhaW5zdCB0aGUgcmVnaXN0cnksIHJldHVybmluZyB0aGUgdGhlbWUuXG4gKlxuICogQHBhcmFtIHRoZW1lIHRoZSB0aGVtZSB0byBzZXRcbiAqIEBwYXJhbSB0aGVtZVJlZ2lzdHJ5IHJlZ2lzdHJ5IHRvIGRlZmluZSB0aGUgdGhlbWUgaW5qZWN0b3IgYWdhaW5zdC4gRGVmYXVsdHNcbiAqIHRvIHRoZSBnbG9iYWwgcmVnaXN0cnlcbiAqXG4gKiBAcmV0dXJucyB0aGUgdGhlbWUgaW5qZWN0b3IgdXNlZCB0byBzZXQgdGhlIHRoZW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhlbWU6IGFueSwgdGhlbWVSZWdpc3RyeTogUmVnaXN0cnkpOiBJbmplY3RvciB7XG5cdGNvbnN0IHRoZW1lSW5qZWN0b3IgPSBuZXcgSW5qZWN0b3IodGhlbWUpO1xuXHR0aGVtZVJlZ2lzdHJ5LmRlZmluZUluamVjdG9yKElOSkVDVEVEX1RIRU1FX0tFWSwgdGhlbWVJbmplY3Rvcik7XG5cdHJldHVybiB0aGVtZUluamVjdG9yO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGNsYXNzIGRlY29yYXRlZCB3aXRoIHdpdGggVGhlbWVkIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluPEUsIFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxXaWRnZXRCYXNlPFRoZW1lZFByb3BlcnRpZXM8RT4+Pj4oXG5cdEJhc2U6IFRcbik6IENvbnN0cnVjdG9yPFRoZW1lZE1peGluPEU+PiAmIFQge1xuXHRAaW5qZWN0KHtcblx0XHRuYW1lOiBJTkpFQ1RFRF9USEVNRV9LRVksXG5cdFx0Z2V0UHJvcGVydGllczogKHRoZW1lOiBUaGVtZSwgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllcyk6IFRoZW1lZFByb3BlcnRpZXMgPT4ge1xuXHRcdFx0aWYgKCFwcm9wZXJ0aWVzLnRoZW1lKSB7XG5cdFx0XHRcdHJldHVybiB7IHRoZW1lIH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fVxuXHR9KVxuXHRjbGFzcyBUaGVtZWQgZXh0ZW5kcyBCYXNlIHtcblx0XHRwdWJsaWMgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllczxFPjtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBUaGVtZWQgYmFzZUNsYXNzZXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lOiBDbGFzc05hbWVzO1xuXG5cdFx0LyoqXG5cdFx0ICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5czogc3RyaW5nW10gPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIFJldmVyc2UgbG9va3VwIG9mIHRoZSB0aGVtZSBjbGFzc2VzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXA6IENsYXNzTmFtZXM7XG5cblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgY2xhc3NlcyBtZXRhIGRhdGEgbmVlZCB0byBiZSBjYWxjdWxhdGVkLlxuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cblx0XHQvKipcblx0XHQgKiBMb2FkZWQgdGhlbWVcblx0XHQgKi9cblx0XHRwcml2YXRlIF90aGVtZTogQ2xhc3NOYW1lcyA9IHt9O1xuXG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWVbXTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lIHwgU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWUgfCBTdXBwb3J0ZWRDbGFzc05hbWVbXSB7XG5cdFx0XHRpZiAodGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzKSB7XG5cdFx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuXHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXAoKGNsYXNzTmFtZSkgPT4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWUpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cblx0XHQgKi9cblx0XHRAZGlmZlByb3BlcnR5KCd0aGVtZScsIHNoYWxsb3cpXG5cdFx0QGRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgc2hhbGxvdylcblx0XHRwcm90ZWN0ZWQgb25Qcm9wZXJ0aWVzQ2hhbmdlZCgpIHtcblx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWU6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZSB7XG5cdFx0XHRpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQgfHwgY2xhc3NOYW1lID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBjbGFzc05hbWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwgKHt9IGFzIGFueSk7XG5cdFx0XHRjb25zdCB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XG5cdFx0XHRsZXQgcmVzdWx0Q2xhc3NOYW1lczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGlmICghdGhlbWVDbGFzc05hbWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBDbGFzcyBuYW1lOiAnJHtjbGFzc05hbWV9JyBub3QgZm91bmQgaW4gdGhlbWVgKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSkge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKSB7XG5cdFx0XHRjb25zdCB7IHRoZW1lID0ge30gfSA9IHRoaXMucHJvcGVydGllcztcblx0XHRcdGNvbnN0IGJhc2VUaGVtZXMgPSB0aGlzLmdldERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycpO1xuXHRcdFx0aWYgKCF0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lKSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUgPSBiYXNlVGhlbWVzLnJlZHVjZSgoZmluYWxCYXNlVGhlbWUsIGJhc2VUaGVtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHsgW1RIRU1FX0tFWV06IGtleSwgLi4uY2xhc3NlcyB9ID0gYmFzZVRoZW1lO1xuXHRcdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5maW5hbEJhc2VUaGVtZSwgLi4uY2xhc3NlcyB9O1xuXHRcdFx0XHR9LCB7fSk7XG5cdFx0XHRcdHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZSgoYmFzZVRoZW1lLCB0aGVtZUtleSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4geyAuLi5iYXNlVGhlbWUsIC4uLnRoZW1lW3RoZW1lS2V5XSB9O1xuXHRcdFx0fSwge30pO1xuXG5cdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gVGhlbWVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUaGVtZWRNaXhpbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBUaGVtZWQudHMiLCJpbXBvcnQgeyBjdXN0b21FdmVudENsYXNzLCBDdXN0b21FbGVtZW50RGVzY3JpcHRvciwgaGFuZGxlQXR0cmlidXRlQ2hhbmdlZCwgaW5pdGlhbGl6ZUVsZW1lbnQgfSBmcm9tICcuL2N1c3RvbUVsZW1lbnRzJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgUHJvamVjdG9yTWl4aW4gfSBmcm9tICcuL21peGlucy9Qcm9qZWN0b3InO1xuXG5kZWNsYXJlIG5hbWVzcGFjZSBjdXN0b21FbGVtZW50cyB7XG5cdGZ1bmN0aW9uIGRlZmluZShuYW1lOiBzdHJpbmcsIGNvbnN0cnVjdG9yOiBhbnkpOiB2b2lkO1xufVxuXG4vKipcbiAqIERlc2NyaWJlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudERlc2NyaXB0b3JGYWN0b3J5IHtcblx0KCk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgY3VzdG9tIGVsZW1lbnQgdXNpbmcgdGhlIHYxIHNwZWMgb2YgY3VzdG9tIGVsZW1lbnRzLiBOb3RlIHRoYXRcbiAqIHRoaXMgaXMgdGhlIGRlZmF1bHQgZXhwb3J0LCBhbmQsIGV4cGVjdHMgdGhlIHByb3Bvc2FsIHRvIHdvcmsgaW4gdGhlIGJyb3dzZXIuXG4gKiBUaGlzIHdpbGwgbGlrZWx5IHJlcXVpcmUgdGhlIHBvbHlmaWxsIGFuZCBuYXRpdmUgc2hpbS5cbiAqXG4gKiBAcGFyYW0gZGVzY3JpcHRvckZhY3RvcnlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZXNjcmlwdG9yRmFjdG9yeTogQ3VzdG9tRWxlbWVudERlc2NyaXB0b3JGYWN0b3J5KSB7XG5cdGNvbnN0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yRmFjdG9yeSgpO1xuXG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcblx0XHRkZXNjcmlwdG9yLnRhZ05hbWUsXG5cdFx0Y2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdFx0XHRwcml2YXRlIF9pc0FwcGVuZGVkID0gZmFsc2U7XG5cdFx0XHRwcml2YXRlIF9hcHBlbmRlcjogRnVuY3Rpb247XG5cdFx0XHRwcml2YXRlIF93aWRnZXRJbnN0YW5jZTogUHJvamVjdG9yTWl4aW48YW55PjtcblxuXHRcdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdFx0dGhpcy5fYXBwZW5kZXIgPSBpbml0aWFsaXplRWxlbWVudCh0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0cHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0XHRpZiAoIXRoaXMuX2lzQXBwZW5kZWQpIHtcblx0XHRcdFx0XHR0aGlzLl9hcHBlbmRlcigpO1xuXHRcdFx0XHRcdHRoaXMuX2lzQXBwZW5kZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRcdG5ldyBjdXN0b21FdmVudENsYXNzKCdjb25uZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRcdGJ1YmJsZXM6IGZhbHNlXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cHVibGljIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuXHRcdFx0XHRoYW5kbGVBdHRyaWJ1dGVDaGFuZ2VkKHRoaXMsIG5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBnZXRXaWRnZXRJbnN0YW5jZSgpOiBQcm9qZWN0b3JNaXhpbjxhbnk+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3dpZGdldEluc3RhbmNlO1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgc2V0V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0OiBQcm9qZWN0b3JNaXhpbjxhbnk+KTogdm9pZCB7XG5cdFx0XHRcdHRoaXMuX3dpZGdldEluc3RhbmNlID0gd2lkZ2V0O1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgZ2V0V2lkZ2V0Q29uc3RydWN0b3IoKTogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREZXNjcmlwdG9yKCkud2lkZ2V0Q29uc3RydWN0b3I7XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBnZXREZXNjcmlwdG9yKCk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yIHtcblx0XHRcdFx0cmV0dXJuIGRlc2NyaXB0b3I7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCk6IHN0cmluZ1tdIHtcblx0XHRcdFx0cmV0dXJuIChkZXNjcmlwdG9yLmF0dHJpYnV0ZXMgfHwgW10pLm1hcCgoYXR0cmlidXRlKSA9PiBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlZ2lzdGVyQ3VzdG9tRWxlbWVudDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyByZWdpc3RlckN1c3RvbUVsZW1lbnQudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBETm9kZSwgVk5vZGUsIFZOb2RlUHJvcGVydGllcywgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi8uLi9kJztcbmltcG9ydCB7IEludGVybmFsVk5vZGUgfSBmcm9tICcuLy4uL3Zkb20nO1xuXG5leHBvcnQgaW50ZXJmYWNlIERvbVdyYXBwZXJPcHRpb25zIHtcblx0b25BdHRhY2hlZD8oKTogdm9pZDtcbn1cblxuZXhwb3J0IHR5cGUgRG9tV3JhcHBlclByb3BlcnRpZXMgPSBWTm9kZVByb3BlcnRpZXMgJiBXaWRnZXRQcm9wZXJ0aWVzO1xuXG5leHBvcnQgdHlwZSBEb21XcmFwcGVyID0gQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxEb21XcmFwcGVyUHJvcGVydGllcz4+O1xuXG5leHBvcnQgZnVuY3Rpb24gRG9tV3JhcHBlcihkb21Ob2RlOiBFbGVtZW50LCBvcHRpb25zOiBEb21XcmFwcGVyT3B0aW9ucyA9IHt9KTogRG9tV3JhcHBlciB7XG5cdHJldHVybiBjbGFzcyBEb21XcmFwcGVyIGV4dGVuZHMgV2lkZ2V0QmFzZTxEb21XcmFwcGVyUHJvcGVydGllcz4ge1xuXHRcdHB1YmxpYyBfX3JlbmRlcl9fKCk6IFZOb2RlIHtcblx0XHRcdGNvbnN0IHZOb2RlID0gc3VwZXIuX19yZW5kZXJfXygpIGFzIEludGVybmFsVk5vZGU7XG5cdFx0XHR2Tm9kZS5kb21Ob2RlID0gZG9tTm9kZTtcblx0XHRcdHJldHVybiB2Tm9kZTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgb25FbGVtZW50Q3JlYXRlZChlbGVtZW50OiBFbGVtZW50LCBrZXk6IHN0cmluZyB8IG51bWJlcikge1xuXHRcdFx0b3B0aW9ucy5vbkF0dGFjaGVkICYmIG9wdGlvbnMub25BdHRhY2hlZCgpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCByZW5kZXIoKTogRE5vZGUge1xuXHRcdFx0Y29uc3QgcHJvcGVydGllcyA9IHsgLi4udGhpcy5wcm9wZXJ0aWVzLCBrZXk6ICdyb290JyB9O1xuXHRcdFx0cmV0dXJuIHYoZG9tTm9kZS50YWdOYW1lLCBwcm9wZXJ0aWVzKTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERvbVdyYXBwZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRG9tV3JhcHBlci50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IHtcblx0Q29yZVByb3BlcnRpZXMsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFdOb2RlLFxuXHRQcm9qZWN0aW9uT3B0aW9ucyxcblx0UHJvamVjdGlvbixcblx0U3VwcG9ydGVkQ2xhc3NOYW1lLFxuXHRUcmFuc2l0aW9uU3RyYXRlZ3ksXG5cdFZOb2RlUHJvcGVydGllc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgZnJvbSBhcyBhcnJheUZyb20gfSBmcm9tICdAZG9qby9zaGltL2FycmF5JztcbmltcG9ydCB7IGlzV05vZGUsIGlzVk5vZGUsIFZOT0RFIH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5cbmNvbnN0IE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xuY29uc3QgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XG5jb25zdCBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XG5cbmNvbnN0IGVtcHR5QXJyYXk6IChJbnRlcm5hbFdOb2RlIHwgSW50ZXJuYWxWTm9kZSlbXSA9IFtdO1xuXG5leHBvcnQgdHlwZSBSZW5kZXJSZXN1bHQgPSBETm9kZTxhbnk+IHwgRE5vZGU8YW55PltdO1xuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsV05vZGUgZXh0ZW5kcyBXTm9kZTxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4ge1xuXHQvKipcblx0ICogVGhlIGluc3RhbmNlIG9mIHRoZSB3aWRnZXRcblx0ICovXG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZTtcblxuXHQvKipcblx0ICogVGhlIHJlbmRlcmVkIEROb2RlcyBmcm9tIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cmVuZGVyZWQ6IEludGVybmFsRE5vZGVbXTtcblxuXHQvKipcblx0ICogQ29yZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgYnkgdGhlIHdpZGdldCBjb3JlIHN5c3RlbVxuXHQgKi9cblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFdOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsVk5vZGUgZXh0ZW5kcyBWTm9kZSB7XG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFZOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbj86IEludGVybmFsRE5vZGVbXTtcblxuXHRpbnNlcnRlZD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEJhZyB1c2VkIHRvIHN0aWxsIGRlY29yYXRlIHByb3BlcnRpZXMgb24gYSBkZWZlcnJlZCBwcm9wZXJ0aWVzIGNhbGxiYWNrXG5cdCAqL1xuXHRkZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXM7XG5cblx0LyoqXG5cdCAqIERPTSBlbGVtZW50XG5cdCAqL1xuXHRkb21Ob2RlPzogRWxlbWVudCB8IFRleHQ7XG59XG5cbmV4cG9ydCB0eXBlIEludGVybmFsRE5vZGUgPSBJbnRlcm5hbFZOb2RlIHwgSW50ZXJuYWxXTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBXaWRnZXREYXRhIHtcblx0b25FbGVtZW50Q3JlYXRlZDogRnVuY3Rpb247XG5cdG9uRWxlbWVudFVwZGF0ZWQ6IEZ1bmN0aW9uO1xuXHRvbkRldGFjaDogKCkgPT4gdm9pZDtcblx0b25BdHRhY2g6ICgpID0+IHZvaWQ7XG5cdHBhcmVudEludmFsaWRhdGU/OiBGdW5jdGlvbjtcblx0ZGlydHk6IGJvb2xlYW47XG5cdHJlZ2lzdHJ5OiAoKSA9PiBSZWdpc3RyeUhhbmRsZXI7XG5cdG5vZGVIYW5kbGVyOiBOb2RlSGFuZGxlcjtcblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXHRpbnZhbGlkYXRlOiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IHdpZGdldEluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBXaWRnZXREYXRhPigpO1xuXG5mdW5jdGlvbiBzYW1lKGRub2RlMTogSW50ZXJuYWxETm9kZSwgZG5vZGUyOiBJbnRlcm5hbEROb2RlKSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlMSkgJiYgaXNWTm9kZShkbm9kZTIpKSB7XG5cdFx0aWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2UgaWYgKGlzV05vZGUoZG5vZGUxKSAmJiBpc1dOb2RlKGRub2RlMikpIHtcblx0XHRpZiAoZG5vZGUxLndpZGdldENvbnN0cnVjdG9yICE9PSBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGEgdHJhbnNpdGlvbnMgb2JqZWN0IHRvIHRoZSBwcm9qZWN0aW9uT3B0aW9ucyB0byBkbyBhbmltYXRpb25zJyk7XG59O1xuXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0b3JPcHRpb25zPzogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4pOiBQcm9qZWN0aW9uT3B0aW9ucyB7XG5cdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuXHRcdHN0eWxlQXBwbHllcjogZnVuY3Rpb24oZG9tTm9kZTogSFRNTEVsZW1lbnQsIHN0eWxlTmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0XHQoZG9tTm9kZS5zdHlsZSBhcyBhbnkpW3N0eWxlTmFtZV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdHRyYW5zaXRpb25zOiB7XG5cdFx0XHRlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXG5cdFx0XHRleGl0OiBtaXNzaW5nVHJhbnNpdGlvblxuXHRcdH0sXG5cdFx0ZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxuXHRcdGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcblx0XHRub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxuXHRcdG1lcmdlOiBmYWxzZVxuXHR9O1xuXHRyZXR1cm4geyAuLi5kZWZhdWx0cywgLi4ucHJvamVjdG9yT3B0aW9ucyB9IGFzIFByb2plY3Rpb25PcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZTogT2JqZWN0KSB7XG5cdGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVFdmVudHMoXG5cdGRvbU5vZGU6IE5vZGUsXG5cdHByb3BOYW1lOiBzdHJpbmcsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwcmV2aW91c1Byb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXNcbikge1xuXHRjb25zdCBwcmV2aW91cyA9IHByZXZpb3VzUHJvcGVydGllcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRjb25zdCBjdXJyZW50VmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0Y29uc3QgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzW3Byb3BOYW1lXTtcblxuXHRjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMik7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSkgfHwgbmV3IFdlYWtNYXAoKTtcblxuXHRpZiAocHJldmlvdXNWYWx1ZSkge1xuXHRcdGNvbnN0IHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XG5cdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XG5cdH1cblxuXHRsZXQgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXG5cdGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcblx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKHRoaXM6IGFueSwgZXZ0OiBFdmVudCkge1xuXHRcdFx0Y3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcblx0XHRcdChldnQudGFyZ2V0IGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IChldnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXHRcdH0uYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXHR9XG5cblx0ZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHRldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XG5cdHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcbn1cblxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlOiBFbGVtZW50LCBjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpIHtcblx0aWYgKGNsYXNzZXMpIHtcblx0XHRjb25zdCBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzc2VzKGRvbU5vZGU6IEVsZW1lbnQsIGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSkge1xuXHRpZiAoY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRkb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lc1tpXSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMoZG9tTm9kZTogRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcblx0XHRjb25zdCBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcblx0XHRsZXQgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpID8gcHJvcFZhbHVlIDogW3Byb3BWYWx1ZV07XG5cdFx0XHRpZiAoIShkb21Ob2RlIGFzIEVsZW1lbnQpLmNsYXNzTmFtZSkge1xuXHRcdFx0XHQoZG9tTm9kZSBhcyBFbGVtZW50KS5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKCcgJykudHJpbSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGFkZENsYXNzZXMoZG9tTm9kZSBhcyBFbGVtZW50LCBjdXJyZW50Q2xhc3Nlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xuXHRcdFx0Y29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG5cdFx0XHRjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuXHRcdFx0XHRjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuXHRcdFx0XHRjb25zdCBzdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGlmIChzdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBzdHlsZVZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgIT09ICdrZXknICYmIHByb3BWYWx1ZSAhPT0gbnVsbCAmJiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xuXHRcdFx0XHR1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICd2YWx1ZScgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XG5cdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgRWxlbWVudCkuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdHByZXZpb3VzUHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9uc1xuKSB7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSk7XG5cdGlmIChldmVudE1hcCkge1xuXHRcdE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcblx0XHRcdGlmIChwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XG5cdFx0XHRcdGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XG5cdFx0XHRcdGlmIChldmVudENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHByb3BOYW1lLnN1YnN0cigyKSwgZXZlbnRDYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRwcmV2aW91c1Byb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRsZXQgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGlmIChwcm9wTmFtZXMuaW5kZXhPZignY2xhc3NlcycpID09PSAtMSAmJiBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzW2ldKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcyk7XG5cdFx0fVxuXHR9XG5cblx0cmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuXHRcdGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0XHRjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzIVtwcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xuXHRcdFx0Y29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcblx0XHRcdGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IG5ld0NsYXNzZXM6IChudWxsIHwgdW5kZWZpbmVkIHwgc3RyaW5nKVtdID0gWy4uLmN1cnJlbnRDbGFzc2VzXTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV07XG5cdFx0XHRcdFx0XHRpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0YWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XG5cdFx0XHRjb25zdCBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcblx0XHRcdGNvbnN0IHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVDb3VudDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XG5cdFx0XHRcdGNvbnN0IG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0Y29uc3Qgb2xkU3R5bGVWYWx1ZSA9IHByZXZpb3VzVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0aWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdGlmIChuZXdTdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKG5ld1N0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIhKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIHN0eWxlTmFtZSwgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRwcm9wVmFsdWUgPSAnJztcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3ZhbHVlJykge1xuXHRcdFx0XHRjb25zdCBkb21WYWx1ZSA9IChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZG9tVmFsdWUgIT09IHByb3BWYWx1ZSAmJlxuXHRcdFx0XHRcdCgoZG9tTm9kZSBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ11cblx0XHRcdFx0XHRcdD8gZG9tVmFsdWUgPT09IChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXVxuXHRcdFx0XHRcdFx0OiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xuXHRcdFx0XHRjb25zdCB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDApIHtcblx0XHRcdFx0XHR1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBwcmV2aW91c1Byb3BlcnRpZXMpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJykge1xuXHRcdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdFx0ZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdyb2xlJyAmJiBwcm9wVmFsdWUgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShwcm9wTmFtZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRvbU5vZGUuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoKGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gQ29tcGFyaXNvbiBpcyBoZXJlIGZvciBzaWRlLWVmZmVjdHMgaW4gRWRnZSB3aXRoIHNjcm9sbExlZnQgYW5kIHNjcm9sbFRvcFxuXHRcdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sIHNhbWVBczogSW50ZXJuYWxETm9kZSwgc3RhcnQ6IG51bWJlcikge1xuXHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlOiBFbGVtZW50KTogSW50ZXJuYWxWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRjaGlsZHJlbjogdW5kZWZpbmVkLFxuXHRcdGRvbU5vZGUsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGE6IGFueSk6IEludGVybmFsVk5vZGUge1xuXHRyZXR1cm4ge1xuXHRcdHRhZzogJycsXG5cdFx0cHJvcGVydGllczoge30sXG5cdFx0Y2hpbGRyZW46IHVuZGVmaW5lZCxcblx0XHR0ZXh0OiBgJHtkYXRhfWAsXG5cdFx0ZG9tTm9kZTogdW5kZWZpbmVkLFxuXHRcdHR5cGU6IFZOT0RFXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGUgfCBETm9kZVtdLFxuXHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbik6IEludGVybmFsRE5vZGVbXSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGVtcHR5QXJyYXk7XG5cdH1cblx0Y2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKSB7XG5cdFx0Y29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXSBhcyBJbnRlcm5hbEROb2RlO1xuXHRcdGlmIChjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBudWxsKSB7XG5cdFx0XHRjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0aWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0KGNoaWxkLnByb3BlcnRpZXMgYXMgYW55KS5iaW5kID0gaW5zdGFuY2U7XG5cdFx0XHRcdFx0aWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghY2hpbGQuY29yZVByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdFx0XHRjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcblx0XHRcdFx0XHRcdGJpbmQ6IGluc3RhbmNlLFxuXHRcdFx0XHRcdFx0YmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpKys7XG5cdH1cblx0cmV0dXJuIGNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXTtcbn1cblxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlOiBJbnRlcm5hbEROb2RlLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvblN0cmF0ZWd5KSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XG5cdFx0Y29uc3QgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xuXHRcdGlmIChlbnRlckFuaW1hdGlvbikge1xuXHRcdFx0aWYgKHR5cGVvZiBlbnRlckFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJhbnNpdGlvbnMuZW50ZXIoZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbiBhcyBzdHJpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjYWxsT25EZXRhY2goZE5vZGVzOiBJbnRlcm5hbEROb2RlIHwgSW50ZXJuYWxETm9kZVtdLCBwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UpOiB2b2lkIHtcblx0ZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgZE5vZGUgPSBkTm9kZXNbaV07XG5cdFx0aWYgKGlzV05vZGUoZE5vZGUpKSB7XG5cdFx0XHRpZiAoZE5vZGUucmVuZGVyZWQpIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpITtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZE5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXSwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGU6IEludGVybmFsRE5vZGUsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uU3RyYXRlZ3ksIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJlZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgY2hpbGQgPSByZW5kZXJlZFtpXTtcblx0XHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRjaGlsZC5kb21Ob2RlIS5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChjaGlsZC5kb21Ob2RlISk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSBkbm9kZS5wcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IGV4aXRBbmltYXRpb24gPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XG5cdFx0aWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xuXHRcdFx0KGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cdFx0XHRjb25zdCByZW1vdmVEb21Ob2RlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0XHRcdH07XG5cdFx0XHRpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0ZXhpdEFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIHJlbW92ZURvbU5vZGUsIHByb3BlcnRpZXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiBhcyBzdHJpbmcsIHJlbW92ZURvbU5vZGUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja0Rpc3Rpbmd1aXNoYWJsZShcblx0Y2hpbGROb2RlczogSW50ZXJuYWxETm9kZVtdLFxuXHRpbmRleFRvQ2hlY2s6IG51bWJlcixcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pIHtcblx0Y29uc3QgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xuXHRpZiAoaXNWTm9kZShjaGlsZE5vZGUpICYmIGNoaWxkTm9kZS50YWcgPT09ICcnKSB7XG5cdFx0cmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxuXHR9XG5cdGNvbnN0IHsga2V5IH0gPSBjaGlsZE5vZGUucHJvcGVydGllcztcblxuXHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XG5cdFx0XHRcdGNvbnN0IG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XG5cdFx0XHRcdFx0bGV0IG5vZGVJZGVudGlmaWVyOiBzdHJpbmc7XG5cdFx0XHRcdFx0Y29uc3QgcGFyZW50TmFtZSA9IChwYXJlbnRJbnN0YW5jZSBhcyBhbnkpLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkTm9kZSkpIHtcblx0XHRcdFx0XHRcdG5vZGVJZGVudGlmaWVyID0gKGNoaWxkTm9kZS53aWRnZXRDb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdFx0YEEgd2lkZ2V0ICgke3BhcmVudE5hbWV9KSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50ICgke25vZGVJZGVudGlmaWVyfSkgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdG9sZENoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdG5ld0NoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0b2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xuXHRuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuXHRjb25zdCBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcblx0Y29uc3QgbmV3Q2hpbGRyZW5MZW5ndGggPSBuZXdDaGlsZHJlbi5sZW5ndGg7XG5cdGNvbnN0IHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnMhO1xuXG5cdGxldCBvbGRJbmRleCA9IDA7XG5cdGxldCBuZXdJbmRleCA9IDA7XG5cdGxldCBpOiBudW1iZXI7XG5cdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHR3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xuXHRcdGNvbnN0IG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcblxuXHRcdGlmIChvbGRDaGlsZCAhPT0gdW5kZWZpbmVkICYmIHNhbWUob2xkQ2hpbGQsIG5ld0NoaWxkKSkge1xuXHRcdFx0dGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcblx0XHRcdG9sZEluZGV4Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xuXHRcdFx0aWYgKGZpbmRPbGRJbmRleCA+PSAwKSB7XG5cdFx0XHRcdGZvciAoaSA9IG9sZEluZGV4OyBpIDwgZmluZE9sZEluZGV4OyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IGk7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGV4dFVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZURvbShvbGRDaGlsZHJlbltmaW5kT2xkSW5kZXhdLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHxcblx0XHRcdFx0XHR0ZXh0VXBkYXRlZDtcblx0XHRcdFx0b2xkSW5kZXggPSBmaW5kT2xkSW5kZXggKyAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdGxldCBjaGlsZDogSW50ZXJuYWxETm9kZSA9IG9sZENoaWxkcmVuW29sZEluZGV4XTtcblx0XHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdFx0bGV0IG5leHRJbmRleCA9IG9sZEluZGV4ICsgMTtcblx0XHRcdFx0XHR3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY2hpbGQucmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IGNoaWxkLnJlbmRlcmVkWzBdO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG9sZENoaWxkcmVuW25leHRJbmRleF0pIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IG9sZENoaWxkcmVuW25leHRJbmRleF07XG5cdFx0XHRcdFx0XHRcdFx0bmV4dEluZGV4Kys7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluc2VydEJlZm9yZSA9IGNoaWxkLmRvbU5vZGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3JlYXRlRG9tKG5ld0NoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcblx0XHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG5ld0NoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5ld0luZGV4Kys7XG5cdH1cblx0aWYgKG9sZENoaWxkcmVuTGVuZ3RoID4gb2xkSW5kZXgpIHtcblx0XHQvLyBSZW1vdmUgY2hpbGQgZnJhZ21lbnRzXG5cdFx0Zm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gaTtcblx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0Y2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fSk7XG5cdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0ZXh0VXBkYXRlZDtcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4oXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdIHwgdW5kZWZpbmVkLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0aW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcblx0Y2hpbGROb2Rlcz86IChFbGVtZW50IHwgVGV4dClbXVxuKSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdGNoaWxkTm9kZXMgPSBhcnJheUZyb20ocGFyZW50Vk5vZGUuZG9tTm9kZSEuY2hpbGROb2RlcykgYXMgKEVsZW1lbnQgfCBUZXh0KVtdO1xuXHR9XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cblx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzKSB7XG5cdFx0XHRcdGxldCBkb21FbGVtZW50OiBFbGVtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCkgYXMgRWxlbWVudDtcblx0XHRcdFx0XHRpZiAoZG9tRWxlbWVudCAmJiBkb21FbGVtZW50LnRhZ05hbWUgPT09IChjaGlsZC50YWcudG9VcHBlckNhc2UoKSB8fCB1bmRlZmluZWQpKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRkbm9kZTogSW50ZXJuYWxWTm9kZSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcblx0aWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG5cdHNldFByb3BlcnRpZXMoZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25FbGVtZW50Q3JlYXRlZChkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLmtleSEpO1xuXHRcdH0pO1xuXHR9XG5cdGRub2RlLmluc2VydGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRG9tKFxuXHRkbm9kZTogSW50ZXJuYWxETm9kZSxcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRjaGlsZE5vZGVzPzogKEVsZW1lbnQgfCBUZXh0KVtdXG4pIHtcblx0bGV0IGRvbU5vZGU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkO1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRsZXQgeyB3aWRnZXRDb25zdHJ1Y3RvciB9ID0gZG5vZGU7XG5cdFx0Y29uc3QgcGFyZW50SW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0aWYgKCFpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4od2lkZ2V0Q29uc3RydWN0b3IpKSB7XG5cdFx0XHRjb25zdCBpdGVtID0gcGFyZW50SW5zdGFuY2VEYXRhLnJlZ2lzdHJ5KCkuZ2V0PERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPih3aWRnZXRDb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoaXRlbSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR3aWRnZXRDb25zdHJ1Y3RvciA9IGl0ZW07XG5cdFx0fVxuXHRcdGNvbnN0IGluc3RhbmNlID0gbmV3IHdpZGdldENvbnN0cnVjdG9yKCk7XG5cdFx0ZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRpbnN0YW5jZURhdGEucGFyZW50SW52YWxpZGF0ZSA9IHBhcmVudEluc3RhbmNlRGF0YS5pbnZhbGlkYXRlO1xuXHRcdGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XG5cdFx0aW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcblx0XHRpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcblx0XHRpZiAocmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG5cdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XG5cdFx0XHRhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudDtcblx0XHRcdHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IHVuZGVmaW5lZDtcblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBkb2MgPSBwYXJlbnRWTm9kZS5kb21Ob2RlIS5vd25lckRvY3VtZW50O1xuXHRcdGlmIChkbm9kZS50YWcgPT09ICcnKSB7XG5cdFx0XHRpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnN0IG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUhLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0gfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChkbm9kZS50YWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcblx0XHRcdH1cblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEgYXMgRWxlbWVudCwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGRvbU5vZGUhLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUhKSB7XG5cdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVEb20oXG5cdHByZXZpb3VzOiBhbnksXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlLCByZW5kZXJlZDogcHJldmlvdXNSZW5kZXJlZCB9ID0gcHJldmlvdXM7XG5cdFx0aWYgKGluc3RhbmNlICYmIHByZXZpb3VzUmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcblx0XHRcdGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XG5cdFx0XHRpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRcdGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cdFx0XHRpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xuXHRcdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcblx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xuXHRcdFx0fVxuXHRcdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAocHJldmlvdXMgPT09IGRub2RlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnN0IGRvbU5vZGUgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xuXHRcdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHRcdGxldCB1cGRhdGVkID0gZmFsc2U7XG5cdFx0ZG5vZGUuaW5zZXJ0ZWQgPSBwcmV2aW91cy5pbnNlcnRlZDtcblx0XHRpZiAoZG5vZGUudGFnID09PSAnJykge1xuXHRcdFx0aWYgKGRub2RlLnRleHQgIT09IHByZXZpb3VzLnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGRvbU5vZGUucGFyZW50Tm9kZSEucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRvbU5vZGUpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcblx0XHRcdFx0dGV4dFVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSB9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZpb3VzLmNoaWxkcmVuICE9PSBkbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0ZG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdFx0dXBkYXRlZCA9XG5cdFx0XHRcdFx0dXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVkID0gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcblxuXHRcdFx0aWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlRGF0YS5vbkVsZW1lbnRVcGRhdGVkKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMua2V5ISk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XG5cdFx0XHRkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlOiBJbnRlcm5hbFZOb2RlLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Ly8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xuXHR2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2shKCEhdm5vZGUuaW5zZXJ0ZWQpO1xuXHR2bm9kZS5wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzLCAuLi52bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgfTtcblx0cHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHtcblx0XHRcdC4uLnZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrISghIXZub2RlLmluc2VydGVkKSxcblx0XHRcdC4uLnZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllc1xuXHRcdH07XG5cdFx0dXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlISBhcyBFbGVtZW50LCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0dm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdGlvbihcblx0ZG5vZGU6IEludGVybmFsRE5vZGUgfCBJbnRlcm5hbEROb2RlW10sXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pOiBQcm9qZWN0aW9uIHtcblx0bGV0IHByb2plY3Rpb25ETm9kZSA9IEFycmF5LmlzQXJyYXkoZG5vZGUpID8gZG5vZGUgOiBbZG5vZGVdO1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSA9IGZhbHNlO1xuXHRyZXR1cm4ge1xuXHRcdHVwZGF0ZTogZnVuY3Rpb24odXBkYXRlZEROb2RlOiBSZW5kZXJSZXN1bHQpIHtcblx0XHRcdGxldCBkb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMucm9vdE5vZGU7XG5cblx0XHRcdHVwZGF0ZWRETm9kZSA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4odXBkYXRlZEROb2RlLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHR1cGRhdGVDaGlsZHJlbihcblx0XHRcdFx0dG9QYXJlbnRWTm9kZShkb21Ob2RlKSxcblx0XHRcdFx0cHJvamVjdGlvbkROb2RlLFxuXHRcdFx0XHR1cGRhdGVkRE5vZGUgYXMgSW50ZXJuYWxETm9kZVtdLFxuXHRcdFx0XHRwYXJlbnRJbnN0YW5jZSxcblx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnNcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0XHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRwcm9qZWN0aW9uRE5vZGUgPSB1cGRhdGVkRE5vZGUgYXMgSW50ZXJuYWxETm9kZVtdO1xuXHRcdH0sXG5cdFx0ZG9tTm9kZTogcHJvamVjdGlvbk9wdGlvbnMucm9vdE5vZGVcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGRvbSA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbihcblx0XHRkTm9kZTogUmVuZGVyUmVzdWx0LFxuXHRcdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0XHRwcm9qZWN0aW9uT3B0aW9ucz86IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+XG5cdCk6IFByb2plY3Rpb24ge1xuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRjb25zdCByb290Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IHJvb3ROb2RlO1xuXHRcdGNvbnN0IGRlY29yYXRlZE5vZGUgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGROb2RlLCBpbnN0YW5jZSk7XG5cdFx0YWRkQ2hpbGRyZW4oXG5cdFx0XHR0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSksXG5cdFx0XHRkZWNvcmF0ZWROb2RlLFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2UsXG5cdFx0XHR1bmRlZmluZWRcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKGRlY29yYXRlZE5vZGUsIGluc3RhbmNlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHR9LFxuXHRhcHBlbmQ6IGZ1bmN0aW9uKFxuXHRcdHBhcmVudE5vZGU6IEVsZW1lbnQsXG5cdFx0ZE5vZGU6IFJlbmRlclJlc3VsdCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM/OiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPlxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRjb25zdCBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gcGFyZW50Tm9kZTtcblx0XHRjb25zdCBkZWNvcmF0ZWROb2RlID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkTm9kZSwgaW5zdGFuY2UpO1xuXHRcdGFkZENoaWxkcmVuKFxuXHRcdFx0dG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpLFxuXHRcdFx0ZGVjb3JhdGVkTm9kZSxcblx0XHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucyxcblx0XHRcdGluc3RhbmNlLFxuXHRcdFx0dW5kZWZpbmVkXG5cdFx0KTtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuXHRcdH0pO1xuXHRcdHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0cnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRyZXR1cm4gY3JlYXRlUHJvamVjdGlvbihkZWNvcmF0ZWROb2RlLCBpbnN0YW5jZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0fSxcblx0bWVyZ2U6IGZ1bmN0aW9uKFxuXHRcdGVsZW1lbnQ6IEVsZW1lbnQsXG5cdFx0ZE5vZGU6IFJlbmRlclJlc3VsdCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM/OiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPlxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShkTm9kZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIG1lcmdlIGFuIGFycmF5IG9mIG5vZGVzLiAoY29uc2lkZXIgYWRkaW5nIG9uZSBleHRyYSBsZXZlbCB0byB0aGUgdmlydHVhbCBET00pJyk7XG5cdFx0fVxuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRmaW5hbFByb2plY3Rvck9wdGlvbnMubWVyZ2UgPSB0cnVlO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZSBhcyBFbGVtZW50O1xuXHRcdGNvbnN0IGRlY29yYXRlZE5vZGUgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGROb2RlLCBpbnN0YW5jZSlbMF0gYXMgSW50ZXJuYWxWTm9kZTtcblx0XHRjcmVhdGVEb20oXG5cdFx0XHRkZWNvcmF0ZWROb2RlLFxuXHRcdFx0dG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2Vcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKGRlY29yYXRlZE5vZGUsIGluc3RhbmNlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHR9LFxuXHRyZXBsYWNlOiBmdW5jdGlvbihcblx0XHRlbGVtZW50OiBFbGVtZW50LFxuXHRcdGROb2RlOiBSZW5kZXJSZXN1bHQsXG5cdFx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRcdHByb2plY3Rpb25PcHRpb25zPzogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz5cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZE5vZGUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdVbmFibGUgdG8gcmVwbGFjZSBhIG5vZGUgd2l0aCBhbiBhcnJheSBvZiBub2Rlcy4gKGNvbnNpZGVyIGFkZGluZyBvbmUgZXh0cmEgbGV2ZWwgdG8gdGhlIHZpcnR1YWwgRE9NKSdcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRjb25zdCBkZWNvcmF0ZWROb2RlID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkTm9kZSwgaW5zdGFuY2UpWzBdIGFzIEludGVybmFsVk5vZGU7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlISBhcyBFbGVtZW50O1xuXHRcdGNyZWF0ZURvbShcblx0XHRcdGRlY29yYXRlZE5vZGUsXG5cdFx0XHR0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSksXG5cdFx0XHRlbGVtZW50LFxuXHRcdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLFxuXHRcdFx0aW5zdGFuY2Vcblx0XHQpO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XG5cdFx0fSk7XG5cdFx0cnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdGVsZW1lbnQucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdFx0cmV0dXJuIGNyZWF0ZVByb2plY3Rpb24oZGVjb3JhdGVkTm9kZSwgaW5zdGFuY2UsIGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdmRvbS50cyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCIvKiFcbiAqIFBFUCB2MC40LjMgfCBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L1BFUFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgfCBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLlBvaW50ZXJFdmVudHNQb2x5ZmlsbCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBjb25zdHJ1Y3RvciBmb3IgbmV3IFBvaW50ZXJFdmVudHMuXG4gICAqXG4gICAqIE5ldyBQb2ludGVyIEV2ZW50cyBtdXN0IGJlIGdpdmVuIGEgdHlwZSwgYW5kIGFuIG9wdGlvbmFsIGRpY3Rpb25hcnkgb2ZcbiAgICogaW5pdGlhbGl6YXRpb24gcHJvcGVydGllcy5cbiAgICpcbiAgICogRHVlIHRvIGNlcnRhaW4gcGxhdGZvcm0gcmVxdWlyZW1lbnRzLCBldmVudHMgcmV0dXJuZWQgZnJvbSB0aGUgY29uc3RydWN0b3JcbiAgICogaWRlbnRpZnkgYXMgTW91c2VFdmVudHMuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5UeXBlIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbaW5EaWN0XSBBbiBvcHRpb25hbCBkaWN0aW9uYXJ5IG9mIGluaXRpYWwgZXZlbnQgcHJvcGVydGllcy5cbiAgICogQHJldHVybiB7RXZlbnR9IEEgbmV3IFBvaW50ZXJFdmVudCBvZiB0eXBlIGBpblR5cGVgLCBpbml0aWFsaXplZCB3aXRoIHByb3BlcnRpZXMgZnJvbSBgaW5EaWN0YC5cbiAgICovXG4gIHZhciBNT1VTRV9QUk9QUyA9IFtcbiAgICAnYnViYmxlcycsXG4gICAgJ2NhbmNlbGFibGUnLFxuICAgICd2aWV3JyxcbiAgICAnZGV0YWlsJyxcbiAgICAnc2NyZWVuWCcsXG4gICAgJ3NjcmVlblknLFxuICAgICdjbGllbnRYJyxcbiAgICAnY2xpZW50WScsXG4gICAgJ2N0cmxLZXknLFxuICAgICdhbHRLZXknLFxuICAgICdzaGlmdEtleScsXG4gICAgJ21ldGFLZXknLFxuICAgICdidXR0b24nLFxuICAgICdyZWxhdGVkVGFyZ2V0JyxcbiAgICAncGFnZVgnLFxuICAgICdwYWdlWSdcbiAgXTtcblxuICB2YXIgTU9VU0VfREVGQVVMVFMgPSBbXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgbnVsbCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgMCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMFxuICBdO1xuXG4gIGZ1bmN0aW9uIFBvaW50ZXJFdmVudChpblR5cGUsIGluRGljdCkge1xuICAgIGluRGljdCA9IGluRGljdCB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBlLmluaXRFdmVudChpblR5cGUsIGluRGljdC5idWJibGVzIHx8IGZhbHNlLCBpbkRpY3QuY2FuY2VsYWJsZSB8fCBmYWxzZSk7XG5cbiAgICAvLyBkZWZpbmUgaW5oZXJpdGVkIE1vdXNlRXZlbnQgcHJvcGVydGllc1xuICAgIC8vIHNraXAgYnViYmxlcyBhbmQgY2FuY2VsYWJsZSBzaW5jZSB0aGV5J3JlIHNldCBhYm92ZSBpbiBpbml0RXZlbnQoKVxuICAgIGZvciAodmFyIGkgPSAyLCBwOyBpIDwgTU9VU0VfUFJPUFMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHAgPSBNT1VTRV9QUk9QU1tpXTtcbiAgICAgIGVbcF0gPSBpbkRpY3RbcF0gfHwgTU9VU0VfREVGQVVMVFNbaV07XG4gICAgfVxuICAgIGUuYnV0dG9ucyA9IGluRGljdC5idXR0b25zIHx8IDA7XG5cbiAgICAvLyBTcGVjIHJlcXVpcmVzIHRoYXQgcG9pbnRlcnMgd2l0aG91dCBwcmVzc3VyZSBzcGVjaWZpZWQgdXNlIDAuNSBmb3IgZG93blxuICAgIC8vIHN0YXRlIGFuZCAwIGZvciB1cCBzdGF0ZS5cbiAgICB2YXIgcHJlc3N1cmUgPSAwO1xuXG4gICAgaWYgKGluRGljdC5wcmVzc3VyZSAmJiBlLmJ1dHRvbnMpIHtcbiAgICAgIHByZXNzdXJlID0gaW5EaWN0LnByZXNzdXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVzc3VyZSA9IGUuYnV0dG9ucyA/IDAuNSA6IDA7XG4gICAgfVxuXG4gICAgLy8gYWRkIHgveSBwcm9wZXJ0aWVzIGFsaWFzZWQgdG8gY2xpZW50WC9ZXG4gICAgZS54ID0gZS5jbGllbnRYO1xuICAgIGUueSA9IGUuY2xpZW50WTtcblxuICAgIC8vIGRlZmluZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgUG9pbnRlckV2ZW50IGludGVyZmFjZVxuICAgIGUucG9pbnRlcklkID0gaW5EaWN0LnBvaW50ZXJJZCB8fCAwO1xuICAgIGUud2lkdGggPSBpbkRpY3Qud2lkdGggfHwgMDtcbiAgICBlLmhlaWdodCA9IGluRGljdC5oZWlnaHQgfHwgMDtcbiAgICBlLnByZXNzdXJlID0gcHJlc3N1cmU7XG4gICAgZS50aWx0WCA9IGluRGljdC50aWx0WCB8fCAwO1xuICAgIGUudGlsdFkgPSBpbkRpY3QudGlsdFkgfHwgMDtcbiAgICBlLnR3aXN0ID0gaW5EaWN0LnR3aXN0IHx8IDA7XG4gICAgZS50YW5nZW50aWFsUHJlc3N1cmUgPSBpbkRpY3QudGFuZ2VudGlhbFByZXNzdXJlIHx8IDA7XG4gICAgZS5wb2ludGVyVHlwZSA9IGluRGljdC5wb2ludGVyVHlwZSB8fCAnJztcbiAgICBlLmh3VGltZXN0YW1wID0gaW5EaWN0Lmh3VGltZXN0YW1wIHx8IDA7XG4gICAgZS5pc1ByaW1hcnkgPSBpbkRpY3QuaXNQcmltYXJ5IHx8IGZhbHNlO1xuICAgIHJldHVybiBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGltcGxlbWVudHMgYSBtYXAgb2YgcG9pbnRlciBzdGF0ZXNcbiAgICovXG4gIHZhciBVU0VfTUFQID0gd2luZG93Lk1hcCAmJiB3aW5kb3cuTWFwLnByb3RvdHlwZS5mb3JFYWNoO1xuICB2YXIgUG9pbnRlck1hcCA9IFVTRV9NQVAgPyBNYXAgOiBTcGFyc2VBcnJheU1hcDtcblxuICBmdW5jdGlvbiBTcGFyc2VBcnJheU1hcCgpIHtcbiAgICB0aGlzLmFycmF5ID0gW107XG4gICAgdGhpcy5zaXplID0gMDtcbiAgfVxuXG4gIFNwYXJzZUFycmF5TWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsZXRlKGspO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgIH1cbiAgICAgIHRoaXMuYXJyYXlba10gPSB2O1xuICAgIH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheVtrXSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrKSB7XG4gICAgICBpZiAodGhpcy5oYXMoaykpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuYXJyYXlba107XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcnJheVtrXTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgfSxcblxuICAgIC8vIHJldHVybiB2YWx1ZSwga2V5LCBtYXBcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdiwgaywgdGhpcyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIENMT05FX1BST1BTID0gW1xuXG4gICAgLy8gTW91c2VFdmVudFxuICAgICdidWJibGVzJyxcbiAgICAnY2FuY2VsYWJsZScsXG4gICAgJ3ZpZXcnLFxuICAgICdkZXRhaWwnLFxuICAgICdzY3JlZW5YJyxcbiAgICAnc2NyZWVuWScsXG4gICAgJ2NsaWVudFgnLFxuICAgICdjbGllbnRZJyxcbiAgICAnY3RybEtleScsXG4gICAgJ2FsdEtleScsXG4gICAgJ3NoaWZ0S2V5JyxcbiAgICAnbWV0YUtleScsXG4gICAgJ2J1dHRvbicsXG4gICAgJ3JlbGF0ZWRUYXJnZXQnLFxuXG4gICAgLy8gRE9NIExldmVsIDNcbiAgICAnYnV0dG9ucycsXG5cbiAgICAvLyBQb2ludGVyRXZlbnRcbiAgICAncG9pbnRlcklkJyxcbiAgICAnd2lkdGgnLFxuICAgICdoZWlnaHQnLFxuICAgICdwcmVzc3VyZScsXG4gICAgJ3RpbHRYJyxcbiAgICAndGlsdFknLFxuICAgICdwb2ludGVyVHlwZScsXG4gICAgJ2h3VGltZXN0YW1wJyxcbiAgICAnaXNQcmltYXJ5JyxcblxuICAgIC8vIGV2ZW50IGluc3RhbmNlXG4gICAgJ3R5cGUnLFxuICAgICd0YXJnZXQnLFxuICAgICdjdXJyZW50VGFyZ2V0JyxcbiAgICAnd2hpY2gnLFxuICAgICdwYWdlWCcsXG4gICAgJ3BhZ2VZJyxcbiAgICAndGltZVN0YW1wJ1xuICBdO1xuXG4gIHZhciBDTE9ORV9ERUZBVUxUUyA9IFtcblxuICAgIC8vIE1vdXNlRXZlbnRcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICBmYWxzZSxcbiAgICAwLFxuICAgIG51bGwsXG5cbiAgICAvLyBET00gTGV2ZWwgM1xuICAgIDAsXG5cbiAgICAvLyBQb2ludGVyRXZlbnRcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAnJyxcbiAgICAwLFxuICAgIGZhbHNlLFxuXG4gICAgLy8gZXZlbnQgaW5zdGFuY2VcbiAgICAnJyxcbiAgICBudWxsLFxuICAgIG51bGwsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMFxuICBdO1xuXG4gIHZhciBCT1VOREFSWV9FVkVOVFMgPSB7XG4gICAgJ3BvaW50ZXJvdmVyJzogMSxcbiAgICAncG9pbnRlcm91dCc6IDEsXG4gICAgJ3BvaW50ZXJlbnRlcic6IDEsXG4gICAgJ3BvaW50ZXJsZWF2ZSc6IDFcbiAgfTtcblxuICB2YXIgSEFTX1NWR19JTlNUQU5DRSA9ICh0eXBlb2YgU1ZHRWxlbWVudEluc3RhbmNlICE9PSAndW5kZWZpbmVkJyk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGlzIGZvciBub3JtYWxpemluZyBldmVudHMuIE1vdXNlIGFuZCBUb3VjaCBldmVudHMgd2lsbCBiZVxuICAgKiBjb2xsZWN0ZWQgaGVyZSwgYW5kIGZpcmUgUG9pbnRlckV2ZW50cyB0aGF0IGhhdmUgdGhlIHNhbWUgc2VtYW50aWNzLCBub1xuICAgKiBtYXR0ZXIgdGhlIHNvdXJjZS5cbiAgICogRXZlbnRzIGZpcmVkOlxuICAgKiAgIC0gcG9pbnRlcmRvd246IGEgcG9pbnRpbmcgaXMgYWRkZWRcbiAgICogICAtIHBvaW50ZXJ1cDogYSBwb2ludGVyIGlzIHJlbW92ZWRcbiAgICogICAtIHBvaW50ZXJtb3ZlOiBhIHBvaW50ZXIgaXMgbW92ZWRcbiAgICogICAtIHBvaW50ZXJvdmVyOiBhIHBvaW50ZXIgY3Jvc3NlcyBpbnRvIGFuIGVsZW1lbnRcbiAgICogICAtIHBvaW50ZXJvdXQ6IGEgcG9pbnRlciBsZWF2ZXMgYW4gZWxlbWVudFxuICAgKiAgIC0gcG9pbnRlcmNhbmNlbDogYSBwb2ludGVyIHdpbGwgbm8gbG9uZ2VyIGdlbmVyYXRlIGV2ZW50c1xuICAgKi9cbiAgdmFyIGRpc3BhdGNoZXIgPSB7XG4gICAgcG9pbnRlcm1hcDogbmV3IFBvaW50ZXJNYXAoKSxcbiAgICBldmVudE1hcDogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICBjYXB0dXJlSW5mbzogT2JqZWN0LmNyZWF0ZShudWxsKSxcblxuICAgIC8vIFNjb3BlIG9iamVjdHMgZm9yIG5hdGl2ZSBldmVudHMuXG4gICAgLy8gVGhpcyBleGlzdHMgZm9yIGVhc2Ugb2YgdGVzdGluZy5cbiAgICBldmVudFNvdXJjZXM6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgZXZlbnRTb3VyY2VMaXN0OiBbXSxcbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgZXZlbnQgc291cmNlIHRoYXQgd2lsbCBnZW5lcmF0ZSBwb2ludGVyIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIGBpblNvdXJjZWAgbXVzdCBjb250YWluIGFuIGFycmF5IG9mIGV2ZW50IG5hbWVzIG5hbWVkIGBldmVudHNgLCBhbmRcbiAgICAgKiBmdW5jdGlvbnMgd2l0aCB0aGUgbmFtZXMgc3BlY2lmaWVkIGluIHRoZSBgZXZlbnRzYCBhcnJheS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgZm9yIHRoZSBldmVudCBzb3VyY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIEEgbmV3IHNvdXJjZSBvZiBwbGF0Zm9ybSBldmVudHMuXG4gICAgICovXG4gICAgcmVnaXN0ZXJTb3VyY2U6IGZ1bmN0aW9uKG5hbWUsIHNvdXJjZSkge1xuICAgICAgdmFyIHMgPSBzb3VyY2U7XG4gICAgICB2YXIgbmV3RXZlbnRzID0gcy5ldmVudHM7XG4gICAgICBpZiAobmV3RXZlbnRzKSB7XG4gICAgICAgIG5ld0V2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoc1tlXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudE1hcFtlXSA9IHNbZV0uYmluZChzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLmV2ZW50U291cmNlc1tuYW1lXSA9IHM7XG4gICAgICAgIHRoaXMuZXZlbnRTb3VyY2VMaXN0LnB1c2gocyk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGwgPSB0aGlzLmV2ZW50U291cmNlTGlzdC5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMCwgZXM7IChpIDwgbCkgJiYgKGVzID0gdGhpcy5ldmVudFNvdXJjZUxpc3RbaV0pOyBpKyspIHtcblxuICAgICAgICAvLyBjYWxsIGV2ZW50c291cmNlIHJlZ2lzdGVyXG4gICAgICAgIGVzLnJlZ2lzdGVyLmNhbGwoZXMsIGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGwgPSB0aGlzLmV2ZW50U291cmNlTGlzdC5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMCwgZXM7IChpIDwgbCkgJiYgKGVzID0gdGhpcy5ldmVudFNvdXJjZUxpc3RbaV0pOyBpKyspIHtcblxuICAgICAgICAvLyBjYWxsIGV2ZW50c291cmNlIHJlZ2lzdGVyXG4gICAgICAgIGVzLnVucmVnaXN0ZXIuY2FsbChlcywgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjb250YWluczogLypzY29wZS5leHRlcm5hbC5jb250YWlucyB8fCAqL2Z1bmN0aW9uKGNvbnRhaW5lciwgY29udGFpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLmNvbnRhaW5zKGNvbnRhaW5lZCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuXG4gICAgICAgIC8vIG1vc3QgbGlrZWx5OiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0yMDg0MjdcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBFVkVOVFNcbiAgICBkb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJkb3duJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJtb3ZlJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICB1cDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVydXAnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGVudGVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyZW50ZXInLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGxlYXZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVybGVhdmUnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG92ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcm92ZXInLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIG91dDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyb3V0JywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmNhbmNlbCcsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgbGVhdmVPdXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGlzLm91dChldmVudCk7XG4gICAgICB0aGlzLnByb3BhZ2F0ZShldmVudCwgdGhpcy5sZWF2ZSwgZmFsc2UpO1xuICAgIH0sXG4gICAgZW50ZXJPdmVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5vdmVyKGV2ZW50KTtcbiAgICAgIHRoaXMucHJvcGFnYXRlKGV2ZW50LCB0aGlzLmVudGVyLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLy8gTElTVEVORVIgTE9HSUNcbiAgICBldmVudEhhbmRsZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcblxuICAgICAgLy8gVGhpcyBpcyB1c2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgZGlzcGF0Y2ggb2YgcG9pbnRlcmV2ZW50cyBmcm9tXG4gICAgICAvLyBwbGF0Zm9ybSBldmVudHMuIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHR3byBlbGVtZW50cyBpbiBkaWZmZXJlbnQgc2NvcGVzXG4gICAgICAvLyBhcmUgc2V0IHVwIHRvIGNyZWF0ZSBwb2ludGVyIGV2ZW50cywgd2hpY2ggaXMgcmVsZXZhbnQgdG8gU2hhZG93IERPTS5cbiAgICAgIGlmIChpbkV2ZW50Ll9oYW5kbGVkQnlQRSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdHlwZSA9IGluRXZlbnQudHlwZTtcbiAgICAgIHZhciBmbiA9IHRoaXMuZXZlbnRNYXAgJiYgdGhpcy5ldmVudE1hcFt0eXBlXTtcbiAgICAgIGlmIChmbikge1xuICAgICAgICBmbihpbkV2ZW50KTtcbiAgICAgIH1cbiAgICAgIGluRXZlbnQuX2hhbmRsZWRCeVBFID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gc2V0IHVwIGV2ZW50IGxpc3RlbmVyc1xuICAgIGxpc3RlbjogZnVuY3Rpb24odGFyZ2V0LCBldmVudHMpIHtcbiAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudCh0YXJnZXQsIGUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcbiAgICB1bmxpc3RlbjogZnVuY3Rpb24odGFyZ2V0LCBldmVudHMpIHtcbiAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudCh0YXJnZXQsIGUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBhZGRFdmVudDogLypzY29wZS5leHRlcm5hbC5hZGRFdmVudCB8fCAqL2Z1bmN0aW9uKHRhcmdldCwgZXZlbnROYW1lKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuYm91bmRIYW5kbGVyKTtcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLnJlbW92ZUV2ZW50IHx8ICovZnVuY3Rpb24odGFyZ2V0LCBldmVudE5hbWUpIHtcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5ib3VuZEhhbmRsZXIpO1xuICAgIH0sXG5cbiAgICAvLyBFVkVOVCBDUkVBVElPTiBBTkQgVFJBQ0tJTkdcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IEV2ZW50IG9mIHR5cGUgYGluVHlwZWAsIGJhc2VkIG9uIHRoZSBpbmZvcm1hdGlvbiBpblxuICAgICAqIGBpbkV2ZW50YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpblR5cGUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0eXBlIG9mIGV2ZW50IHRvIGNyZWF0ZVxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGluRXZlbnQgQSBwbGF0Zm9ybSBldmVudCB3aXRoIGEgdGFyZ2V0XG4gICAgICogQHJldHVybiB7RXZlbnR9IEEgUG9pbnRlckV2ZW50IG9mIHR5cGUgYGluVHlwZWBcbiAgICAgKi9cbiAgICBtYWtlRXZlbnQ6IGZ1bmN0aW9uKGluVHlwZSwgaW5FdmVudCkge1xuXG4gICAgICAvLyByZWxhdGVkVGFyZ2V0IG11c3QgYmUgbnVsbCBpZiBwb2ludGVyIGlzIGNhcHR1cmVkXG4gICAgICBpZiAodGhpcy5jYXB0dXJlSW5mb1tpbkV2ZW50LnBvaW50ZXJJZF0pIHtcbiAgICAgICAgaW5FdmVudC5yZWxhdGVkVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBlID0gbmV3IFBvaW50ZXJFdmVudChpblR5cGUsIGluRXZlbnQpO1xuICAgICAgaWYgKGluRXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA9IGluRXZlbnQucHJldmVudERlZmF1bHQ7XG4gICAgICB9XG4gICAgICBlLl90YXJnZXQgPSBlLl90YXJnZXQgfHwgaW5FdmVudC50YXJnZXQ7XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuXG4gICAgLy8gbWFrZSBhbmQgZGlzcGF0Y2ggYW4gZXZlbnQgaW4gb25lIGNhbGxcbiAgICBmaXJlRXZlbnQ6IGZ1bmN0aW9uKGluVHlwZSwgaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLm1ha2VFdmVudChpblR5cGUsIGluRXZlbnQpO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzbmFwc2hvdCBvZiBpbkV2ZW50LCB3aXRoIHdyaXRhYmxlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBpbkV2ZW50IEFuIGV2ZW50IHRoYXQgY29udGFpbnMgcHJvcGVydGllcyB0byBjb3B5LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgc2hhbGxvdyBjb3BpZXMgb2YgYGluRXZlbnRgJ3NcbiAgICAgKiAgICBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIGNsb25lRXZlbnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBldmVudENvcHkgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgdmFyIHA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENMT05FX1BST1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHAgPSBDTE9ORV9QUk9QU1tpXTtcbiAgICAgICAgZXZlbnRDb3B5W3BdID0gaW5FdmVudFtwXSB8fCBDTE9ORV9ERUZBVUxUU1tpXTtcblxuICAgICAgICAvLyBXb3JrIGFyb3VuZCBTVkdJbnN0YW5jZUVsZW1lbnQgc2hhZG93IHRyZWVcbiAgICAgICAgLy8gUmV0dXJuIHRoZSA8dXNlPiBlbGVtZW50IHRoYXQgaXMgcmVwcmVzZW50ZWQgYnkgdGhlIGluc3RhbmNlIGZvciBTYWZhcmksIENocm9tZSwgSUUuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGJlaGF2aW9yIGltcGxlbWVudGVkIGJ5IEZpcmVmb3guXG4gICAgICAgIGlmIChIQVNfU1ZHX0lOU1RBTkNFICYmIChwID09PSAndGFyZ2V0JyB8fCBwID09PSAncmVsYXRlZFRhcmdldCcpKSB7XG4gICAgICAgICAgaWYgKGV2ZW50Q29weVtwXSBpbnN0YW5jZW9mIFNWR0VsZW1lbnRJbnN0YW5jZSkge1xuICAgICAgICAgICAgZXZlbnRDb3B5W3BdID0gZXZlbnRDb3B5W3BdLmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBrZWVwIHRoZSBzZW1hbnRpY3Mgb2YgcHJldmVudERlZmF1bHRcbiAgICAgIGlmIChpbkV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgIGV2ZW50Q29weS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGluRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudENvcHk7XG4gICAgfSxcbiAgICBnZXRUYXJnZXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBjYXB0dXJlID0gdGhpcy5jYXB0dXJlSW5mb1tpbkV2ZW50LnBvaW50ZXJJZF07XG4gICAgICBpZiAoIWNhcHR1cmUpIHtcbiAgICAgICAgcmV0dXJuIGluRXZlbnQuX3RhcmdldDtcbiAgICAgIH1cbiAgICAgIGlmIChpbkV2ZW50Ll90YXJnZXQgPT09IGNhcHR1cmUgfHwgIShpbkV2ZW50LnR5cGUgaW4gQk9VTkRBUllfRVZFTlRTKSkge1xuICAgICAgICByZXR1cm4gY2FwdHVyZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHByb3BhZ2F0ZTogZnVuY3Rpb24oZXZlbnQsIGZuLCBwcm9wYWdhdGVEb3duKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgdmFyIHRhcmdldHMgPSBbXTtcblxuICAgICAgLy8gT3JkZXIgb2YgY29uZGl0aW9ucyBkdWUgdG8gZG9jdW1lbnQuY29udGFpbnMoKSBtaXNzaW5nIGluIElFLlxuICAgICAgd2hpbGUgKHRhcmdldCAhPT0gZG9jdW1lbnQgJiYgIXRhcmdldC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cbiAgICAgICAgLy8gVG91Y2g6IERvIG5vdCBwcm9wYWdhdGUgaWYgbm9kZSBpcyBkZXRhY2hlZC5cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wYWdhdGVEb3duKSB7XG4gICAgICAgIHRhcmdldHMucmV2ZXJzZSgpO1xuICAgICAgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICBldmVudC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZXRDYXB0dXJlOiBmdW5jdGlvbihpblBvaW50ZXJJZCwgaW5UYXJnZXQsIHNraXBEaXNwYXRjaCkge1xuICAgICAgaWYgKHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNhcHR1cmUoaW5Qb2ludGVySWQsIHNraXBEaXNwYXRjaCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdID0gaW5UYXJnZXQ7XG4gICAgICB0aGlzLmltcGxpY2l0UmVsZWFzZSA9IHRoaXMucmVsZWFzZUNhcHR1cmUuYmluZCh0aGlzLCBpblBvaW50ZXJJZCwgc2tpcERpc3BhdGNoKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG5cbiAgICAgIHZhciBlID0gbmV3IFBvaW50ZXJFdmVudCgnZ290cG9pbnRlcmNhcHR1cmUnKTtcbiAgICAgIGUucG9pbnRlcklkID0gaW5Qb2ludGVySWQ7XG4gICAgICBlLl90YXJnZXQgPSBpblRhcmdldDtcblxuICAgICAgaWYgKCFza2lwRGlzcGF0Y2gpIHtcbiAgICAgICAgdGhpcy5hc3luY0Rpc3BhdGNoRXZlbnQoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZWxlYXNlQ2FwdHVyZTogZnVuY3Rpb24oaW5Qb2ludGVySWQsIHNraXBEaXNwYXRjaCkge1xuICAgICAgdmFyIHQgPSB0aGlzLmNhcHR1cmVJbmZvW2luUG9pbnRlcklkXTtcbiAgICAgIGlmICghdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FwdHVyZUluZm9baW5Qb2ludGVySWRdID0gdW5kZWZpbmVkO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcblxuICAgICAgdmFyIGUgPSBuZXcgUG9pbnRlckV2ZW50KCdsb3N0cG9pbnRlcmNhcHR1cmUnKTtcbiAgICAgIGUucG9pbnRlcklkID0gaW5Qb2ludGVySWQ7XG4gICAgICBlLl90YXJnZXQgPSB0O1xuXG4gICAgICBpZiAoIXNraXBEaXNwYXRjaCkge1xuICAgICAgICB0aGlzLmFzeW5jRGlzcGF0Y2hFdmVudChlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIERpc3BhdGNoZXMgdGhlIGV2ZW50IHRvIGl0cyB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBpbkV2ZW50IFRoZSBldmVudCB0byBiZSBkaXNwYXRjaGVkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYW4gZXZlbnQgaGFuZGxlciByZXR1cm5zIHRydWUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBkaXNwYXRjaEV2ZW50OiAvKnNjb3BlLmV4dGVybmFsLmRpc3BhdGNoRXZlbnQgfHwgKi9mdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgdCA9IHRoaXMuZ2V0VGFyZ2V0KGluRXZlbnQpO1xuICAgICAgaWYgKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuZGlzcGF0Y2hFdmVudChpbkV2ZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jRGlzcGF0Y2hFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZGlzcGF0Y2hFdmVudC5iaW5kKHRoaXMsIGluRXZlbnQpKTtcbiAgICB9XG4gIH07XG4gIGRpc3BhdGNoZXIuYm91bmRIYW5kbGVyID0gZGlzcGF0Y2hlci5ldmVudEhhbmRsZXIuYmluZChkaXNwYXRjaGVyKTtcblxuICB2YXIgdGFyZ2V0aW5nID0ge1xuICAgIHNoYWRvdzogZnVuY3Rpb24oaW5FbCkge1xuICAgICAgaWYgKGluRWwpIHtcbiAgICAgICAgcmV0dXJuIGluRWwuc2hhZG93Um9vdCB8fCBpbkVsLndlYmtpdFNoYWRvd1Jvb3Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYW5UYXJnZXQ6IGZ1bmN0aW9uKHNoYWRvdykge1xuICAgICAgcmV0dXJuIHNoYWRvdyAmJiBCb29sZWFuKHNoYWRvdy5lbGVtZW50RnJvbVBvaW50KTtcbiAgICB9LFxuICAgIHRhcmdldGluZ1NoYWRvdzogZnVuY3Rpb24oaW5FbCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnNoYWRvdyhpbkVsKTtcbiAgICAgIGlmICh0aGlzLmNhblRhcmdldChzKSkge1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH1cbiAgICB9LFxuICAgIG9sZGVyU2hhZG93OiBmdW5jdGlvbihzaGFkb3cpIHtcbiAgICAgIHZhciBvcyA9IHNoYWRvdy5vbGRlclNoYWRvd1Jvb3Q7XG4gICAgICBpZiAoIW9zKSB7XG4gICAgICAgIHZhciBzZSA9IHNoYWRvdy5xdWVyeVNlbGVjdG9yKCdzaGFkb3cnKTtcbiAgICAgICAgaWYgKHNlKSB7XG4gICAgICAgICAgb3MgPSBzZS5vbGRlclNoYWRvd1Jvb3Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvcztcbiAgICB9LFxuICAgIGFsbFNoYWRvd3M6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBzaGFkb3dzID0gW107XG4gICAgICB2YXIgcyA9IHRoaXMuc2hhZG93KGVsZW1lbnQpO1xuICAgICAgd2hpbGUgKHMpIHtcbiAgICAgICAgc2hhZG93cy5wdXNoKHMpO1xuICAgICAgICBzID0gdGhpcy5vbGRlclNoYWRvdyhzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaGFkb3dzO1xuICAgIH0sXG4gICAgc2VhcmNoUm9vdDogZnVuY3Rpb24oaW5Sb290LCB4LCB5KSB7XG4gICAgICBpZiAoaW5Sb290KSB7XG4gICAgICAgIHZhciB0ID0gaW5Sb290LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgIHZhciBzdCwgc3I7XG5cbiAgICAgICAgLy8gaXMgZWxlbWVudCBhIHNoYWRvdyBob3N0P1xuICAgICAgICBzciA9IHRoaXMudGFyZ2V0aW5nU2hhZG93KHQpO1xuICAgICAgICB3aGlsZSAoc3IpIHtcblxuICAgICAgICAgIC8vIGZpbmQgdGhlIHRoZSBlbGVtZW50IGluc2lkZSB0aGUgc2hhZG93IHJvb3RcbiAgICAgICAgICBzdCA9IHNyLmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgICAgaWYgKCFzdCkge1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3Igb2xkZXIgc2hhZG93c1xuICAgICAgICAgICAgc3IgPSB0aGlzLm9sZGVyU2hhZG93KHNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBzaGFkb3dlZCBlbGVtZW50IG1heSBjb250YWluIGEgc2hhZG93IHJvb3RcbiAgICAgICAgICAgIHZhciBzc3IgPSB0aGlzLnRhcmdldGluZ1NoYWRvdyhzdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hSb290KHNzciwgeCwgeSkgfHwgc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGlnaHQgZG9tIGVsZW1lbnQgaXMgdGhlIHRhcmdldFxuICAgICAgICByZXR1cm4gdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIG93bmVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgcyA9IGVsZW1lbnQ7XG5cbiAgICAgIC8vIHdhbGsgdXAgdW50aWwgeW91IGhpdCB0aGUgc2hhZG93IHJvb3Qgb3IgZG9jdW1lbnRcbiAgICAgIHdoaWxlIChzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcyA9IHMucGFyZW50Tm9kZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGhlIG93bmVyIGVsZW1lbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYSBEb2N1bWVudCBvciBTaGFkb3dSb290XG4gICAgICBpZiAocy5ub2RlVHlwZSAhPT0gTm9kZS5ET0NVTUVOVF9OT0RFICYmIHMubm9kZVR5cGUgIT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgICBzID0gZG9jdW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgICB9LFxuICAgIGZpbmRUYXJnZXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciB4ID0gaW5FdmVudC5jbGllbnRYO1xuICAgICAgdmFyIHkgPSBpbkV2ZW50LmNsaWVudFk7XG5cbiAgICAgIC8vIGlmIHRoZSBsaXN0ZW5lciBpcyBpbiB0aGUgc2hhZG93IHJvb3QsIGl0IGlzIG11Y2ggZmFzdGVyIHRvIHN0YXJ0IHRoZXJlXG4gICAgICB2YXIgcyA9IHRoaXMub3duZXIoaW5FdmVudC50YXJnZXQpO1xuXG4gICAgICAvLyBpZiB4LCB5IGlzIG5vdCBpbiB0aGlzIHJvb3QsIGZhbGwgYmFjayB0byBkb2N1bWVudCBzZWFyY2hcbiAgICAgIGlmICghcy5lbGVtZW50RnJvbVBvaW50KHgsIHkpKSB7XG4gICAgICAgIHMgPSBkb2N1bWVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaFJvb3QocywgeCwgeSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKTtcbiAgdmFyIG1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5tYXApO1xuICB2YXIgdG9BcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLnNsaWNlKTtcbiAgdmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5maWx0ZXIpO1xuICB2YXIgTU8gPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgdmFyIFNFTEVDVE9SID0gJ1t0b3VjaC1hY3Rpb25dJztcbiAgdmFyIE9CU0VSVkVSX0lOSVQgPSB7XG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsndG91Y2gtYWN0aW9uJ11cbiAgfTtcblxuICBmdW5jdGlvbiBJbnN0YWxsZXIoYWRkLCByZW1vdmUsIGNoYW5nZWQsIGJpbmRlcikge1xuICAgIHRoaXMuYWRkQ2FsbGJhY2sgPSBhZGQuYmluZChiaW5kZXIpO1xuICAgIHRoaXMucmVtb3ZlQ2FsbGJhY2sgPSByZW1vdmUuYmluZChiaW5kZXIpO1xuICAgIHRoaXMuY2hhbmdlZENhbGxiYWNrID0gY2hhbmdlZC5iaW5kKGJpbmRlcik7XG4gICAgaWYgKE1PKSB7XG4gICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE1PKHRoaXMubXV0YXRpb25XYXRjaGVyLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIEluc3RhbGxlci5wcm90b3R5cGUgPSB7XG4gICAgd2F0Y2hTdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcblxuICAgICAgLy8gT25seSB3YXRjaCBzY29wZXMgdGhhdCBjYW4gdGFyZ2V0IGZpbmQsIGFzIHRoZXNlIGFyZSB0b3AtbGV2ZWwuXG4gICAgICAvLyBPdGhlcndpc2Ugd2UgY2FuIHNlZSBkdXBsaWNhdGUgYWRkaXRpb25zIGFuZCByZW1vdmFscyB0aGF0IGFkZCBub2lzZS5cbiAgICAgIC8vXG4gICAgICAvLyBUT0RPKGRmcmVlZG1hbik6IEZvciBzb21lIGluc3RhbmNlcyB3aXRoIFNoYWRvd0RPTVBvbHlmaWxsLCB3ZSBjYW4gc2VlXG4gICAgICAvLyBhIHJlbW92YWwgd2l0aG91dCBhbiBpbnNlcnRpb24gd2hlbiBhIG5vZGUgaXMgcmVkaXN0cmlidXRlZCBhbW9uZ1xuICAgICAgLy8gc2hhZG93cy4gU2luY2UgaXQgYWxsIGVuZHMgdXAgY29ycmVjdCBpbiB0aGUgZG9jdW1lbnQsIHdhdGNoaW5nIG9ubHlcbiAgICAgIC8vIHRoZSBkb2N1bWVudCB3aWxsIHlpZWxkIHRoZSBjb3JyZWN0IG11dGF0aW9ucyB0byB3YXRjaC5cbiAgICAgIGlmICh0aGlzLm9ic2VydmVyICYmIHRhcmdldGluZy5jYW5UYXJnZXQodGFyZ2V0KSkge1xuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBPQlNFUlZFUl9JTklUKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuYWJsZU9uU3VidHJlZTogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICB0aGlzLndhdGNoU3VidHJlZSh0YXJnZXQpO1xuICAgICAgaWYgKHRhcmdldCA9PT0gZG9jdW1lbnQgJiYgZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICB0aGlzLmluc3RhbGxPbkxvYWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5zdGFsbE5ld1N1YnRyZWUodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluc3RhbGxOZXdTdWJ0cmVlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGZvckVhY2godGhpcy5maW5kRWxlbWVudHModGFyZ2V0KSwgdGhpcy5hZGRFbGVtZW50LCB0aGlzKTtcbiAgICB9LFxuICAgIGZpbmRFbGVtZW50czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBpZiAodGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuICAgIHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB0aGlzLnJlbW92ZUNhbGxiYWNrKGVsKTtcbiAgICB9LFxuICAgIGFkZEVsZW1lbnQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB0aGlzLmFkZENhbGxiYWNrKGVsKTtcbiAgICB9LFxuICAgIGVsZW1lbnRDaGFuZ2VkOiBmdW5jdGlvbihlbCwgb2xkVmFsdWUpIHtcbiAgICAgIHRoaXMuY2hhbmdlZENhbGxiYWNrKGVsLCBvbGRWYWx1ZSk7XG4gICAgfSxcbiAgICBjb25jYXRMaXN0czogZnVuY3Rpb24oYWNjdW0sIGxpc3QpIHtcbiAgICAgIHJldHVybiBhY2N1bS5jb25jYXQodG9BcnJheShsaXN0KSk7XG4gICAgfSxcblxuICAgIC8vIHJlZ2lzdGVyIGFsbCB0b3VjaC1hY3Rpb24gPSBub25lIG5vZGVzIG9uIGRvY3VtZW50IGxvYWRcbiAgICBpbnN0YWxsT25Mb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbGxOZXdTdWJ0cmVlKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuICAgIGlzRWxlbWVudDogZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFO1xuICAgIH0sXG4gICAgZmxhdHRlbk11dGF0aW9uVHJlZTogZnVuY3Rpb24oaW5Ob2Rlcykge1xuXG4gICAgICAvLyBmaW5kIGNoaWxkcmVuIHdpdGggdG91Y2gtYWN0aW9uXG4gICAgICB2YXIgdHJlZSA9IG1hcChpbk5vZGVzLCB0aGlzLmZpbmRFbGVtZW50cywgdGhpcyk7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgYWRkZWQgbm9kZXMgYXJlIGFjY291bnRlZCBmb3JcbiAgICAgIHRyZWUucHVzaChmaWx0ZXIoaW5Ob2RlcywgdGhpcy5pc0VsZW1lbnQpKTtcblxuICAgICAgLy8gZmxhdHRlbiB0aGUgbGlzdFxuICAgICAgcmV0dXJuIHRyZWUucmVkdWNlKHRoaXMuY29uY2F0TGlzdHMsIFtdKTtcbiAgICB9LFxuICAgIG11dGF0aW9uV2F0Y2hlcjogZnVuY3Rpb24obXV0YXRpb25zKSB7XG4gICAgICBtdXRhdGlvbnMuZm9yRWFjaCh0aGlzLm11dGF0aW9uSGFuZGxlciwgdGhpcyk7XG4gICAgfSxcbiAgICBtdXRhdGlvbkhhbmRsZXI6IGZ1bmN0aW9uKG0pIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIHZhciBhZGRlZCA9IHRoaXMuZmxhdHRlbk11dGF0aW9uVHJlZShtLmFkZGVkTm9kZXMpO1xuICAgICAgICBhZGRlZC5mb3JFYWNoKHRoaXMuYWRkRWxlbWVudCwgdGhpcyk7XG4gICAgICAgIHZhciByZW1vdmVkID0gdGhpcy5mbGF0dGVuTXV0YXRpb25UcmVlKG0ucmVtb3ZlZE5vZGVzKTtcbiAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKHRoaXMucmVtb3ZlRWxlbWVudCwgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudENoYW5nZWQobS50YXJnZXQsIG0ub2xkVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzaGFkb3dTZWxlY3Rvcih2KSB7XG4gICAgcmV0dXJuICdib2R5IC9zaGFkb3ctZGVlcC8gJyArIHNlbGVjdG9yKHYpO1xuICB9XG4gIGZ1bmN0aW9uIHNlbGVjdG9yKHYpIHtcbiAgICByZXR1cm4gJ1t0b3VjaC1hY3Rpb249XCInICsgdiArICdcIl0nO1xuICB9XG4gIGZ1bmN0aW9uIHJ1bGUodikge1xuICAgIHJldHVybiAneyAtbXMtdG91Y2gtYWN0aW9uOiAnICsgdiArICc7IHRvdWNoLWFjdGlvbjogJyArIHYgKyAnOyB9JztcbiAgfVxuICB2YXIgYXR0cmliMmNzcyA9IFtcbiAgICAnbm9uZScsXG4gICAgJ2F1dG8nLFxuICAgICdwYW4teCcsXG4gICAgJ3Bhbi15JyxcbiAgICB7XG4gICAgICBydWxlOiAncGFuLXggcGFuLXknLFxuICAgICAgc2VsZWN0b3JzOiBbXG4gICAgICAgICdwYW4teCBwYW4teScsXG4gICAgICAgICdwYW4teSBwYW4teCdcbiAgICAgIF1cbiAgICB9XG4gIF07XG4gIHZhciBzdHlsZXMgPSAnJztcblxuICAvLyBvbmx5IGluc3RhbGwgc3R5bGVzaGVldCBpZiB0aGUgYnJvd3NlciBoYXMgdG91Y2ggYWN0aW9uIHN1cHBvcnRcbiAgdmFyIGhhc05hdGl2ZVBFID0gd2luZG93LlBvaW50ZXJFdmVudCB8fCB3aW5kb3cuTVNQb2ludGVyRXZlbnQ7XG5cbiAgLy8gb25seSBhZGQgc2hhZG93IHNlbGVjdG9ycyBpZiBzaGFkb3dkb20gaXMgc3VwcG9ydGVkXG4gIHZhciBoYXNTaGFkb3dSb290ID0gIXdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCAmJiBkb2N1bWVudC5oZWFkLmNyZWF0ZVNoYWRvd1Jvb3Q7XG5cbiAgZnVuY3Rpb24gYXBwbHlBdHRyaWJ1dGVTdHlsZXMoKSB7XG4gICAgaWYgKGhhc05hdGl2ZVBFKSB7XG4gICAgICBhdHRyaWIyY3NzLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgICBpZiAoU3RyaW5nKHIpID09PSByKSB7XG4gICAgICAgICAgc3R5bGVzICs9IHNlbGVjdG9yKHIpICsgcnVsZShyKSArICdcXG4nO1xuICAgICAgICAgIGlmIChoYXNTaGFkb3dSb290KSB7XG4gICAgICAgICAgICBzdHlsZXMgKz0gc2hhZG93U2VsZWN0b3IocikgKyBydWxlKHIpICsgJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlcyArPSByLnNlbGVjdG9ycy5tYXAoc2VsZWN0b3IpICsgcnVsZShyLnJ1bGUpICsgJ1xcbic7XG4gICAgICAgICAgaWYgKGhhc1NoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIHN0eWxlcyArPSByLnNlbGVjdG9ycy5tYXAoc2hhZG93U2VsZWN0b3IpICsgcnVsZShyLnJ1bGUpICsgJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gc3R5bGVzO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHBvaW50ZXJtYXAgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG5cbiAgLy8gcmFkaXVzIGFyb3VuZCB0b3VjaGVuZCB0aGF0IHN3YWxsb3dzIG1vdXNlIGV2ZW50c1xuICB2YXIgREVEVVBfRElTVCA9IDI1O1xuXG4gIC8vIGxlZnQsIG1pZGRsZSwgcmlnaHQsIGJhY2ssIGZvcndhcmRcbiAgdmFyIEJVVFRPTl9UT19CVVRUT05TID0gWzEsIDQsIDIsIDgsIDE2XTtcblxuICB2YXIgSEFTX0JVVFRPTlMgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBIQVNfQlVUVE9OUyA9IG5ldyBNb3VzZUV2ZW50KCd0ZXN0JywgeyBidXR0b25zOiAxIH0pLmJ1dHRvbnMgPT09IDE7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgLy8gaGFuZGxlciBibG9jayBmb3IgbmF0aXZlIG1vdXNlIGV2ZW50c1xuICB2YXIgbW91c2VFdmVudHMgPSB7XG4gICAgUE9JTlRFUl9JRDogMSxcbiAgICBQT0lOVEVSX1RZUEU6ICdtb3VzZScsXG4gICAgZXZlbnRzOiBbXG4gICAgICAnbW91c2Vkb3duJyxcbiAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgJ21vdXNldXAnLFxuICAgICAgJ21vdXNlb3ZlcicsXG4gICAgICAnbW91c2VvdXQnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIGxhc3RUb3VjaGVzOiBbXSxcblxuICAgIC8vIGNvbGxpZGUgd2l0aCB0aGUgZ2xvYmFsIG1vdXNlIGxpc3RlbmVyXG4gICAgaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGx0cyA9IHRoaXMubGFzdFRvdWNoZXM7XG4gICAgICB2YXIgeCA9IGluRXZlbnQuY2xpZW50WDtcbiAgICAgIHZhciB5ID0gaW5FdmVudC5jbGllbnRZO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsdHMubGVuZ3RoLCB0OyBpIDwgbCAmJiAodCA9IGx0c1tpXSk7IGkrKykge1xuXG4gICAgICAgIC8vIHNpbXVsYXRlZCBtb3VzZSBldmVudHMgd2lsbCBiZSBzd2FsbG93ZWQgbmVhciBhIHByaW1hcnkgdG91Y2hlbmRcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoeCAtIHQueCk7XG4gICAgICAgIHZhciBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVCAmJiBkeSA8PSBERURVUF9ESVNUKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXBhcmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLmNsb25lRXZlbnQoaW5FdmVudCk7XG5cbiAgICAgIC8vIGZvcndhcmQgbW91c2UgcHJldmVudERlZmF1bHRcbiAgICAgIHZhciBwZCA9IGUucHJldmVudERlZmF1bHQ7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGluRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcGQoKTtcbiAgICAgIH07XG4gICAgICBlLnBvaW50ZXJJZCA9IHRoaXMuUE9JTlRFUl9JRDtcbiAgICAgIGUuaXNQcmltYXJ5ID0gdHJ1ZTtcbiAgICAgIGUucG9pbnRlclR5cGUgPSB0aGlzLlBPSU5URVJfVFlQRTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgcHJlcGFyZUJ1dHRvbnNGb3JNb3ZlOiBmdW5jdGlvbihlLCBpbkV2ZW50KSB7XG4gICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG5cbiAgICAgIC8vIFVwZGF0ZSBidXR0b25zIHN0YXRlIGFmdGVyIHBvc3NpYmxlIG91dC1vZi1kb2N1bWVudCBtb3VzZXVwLlxuICAgICAgaWYgKGluRXZlbnQud2hpY2ggPT09IDAgfHwgIXApIHtcbiAgICAgICAgZS5idXR0b25zID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGUuYnV0dG9ucyA9IHAuYnV0dG9ucztcbiAgICAgIH1cbiAgICAgIGluRXZlbnQuYnV0dG9ucyA9IGUuYnV0dG9ucztcbiAgICB9LFxuICAgIG1vdXNlZG93bjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIHAgPSBwb2ludGVybWFwLmdldCh0aGlzLlBPSU5URVJfSUQpO1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7XG4gICAgICAgICAgZS5idXR0b25zID0gQlVUVE9OX1RPX0JVVFRPTlNbZS5idXR0b25dO1xuICAgICAgICAgIGlmIChwKSB7IGUuYnV0dG9ucyB8PSBwLmJ1dHRvbnM7IH1cbiAgICAgICAgICBpbkV2ZW50LmJ1dHRvbnMgPSBlLmJ1dHRvbnM7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFwIHx8IHAuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIuZG93bihlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlbW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykgeyB0aGlzLnByZXBhcmVCdXR0b25zRm9yTW92ZShlLCBpbkV2ZW50KTsgfVxuICAgICAgICBlLmJ1dHRvbiA9IC0xO1xuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZXVwOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgcCA9IHBvaW50ZXJtYXAuZ2V0KHRoaXMuUE9JTlRFUl9JRCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHtcbiAgICAgICAgICB2YXIgdXAgPSBCVVRUT05fVE9fQlVUVE9OU1tlLmJ1dHRvbl07XG5cbiAgICAgICAgICAvLyBQcm9kdWNlcyB3cm9uZyBzdGF0ZSBvZiBidXR0b25zIGluIEJyb3dzZXJzIHdpdGhvdXQgYGJ1dHRvbnNgIHN1cHBvcnRcbiAgICAgICAgICAvLyB3aGVuIGEgbW91c2UgYnV0dG9uIHRoYXQgd2FzIHByZXNzZWQgb3V0c2lkZSB0aGUgZG9jdW1lbnQgaXMgcmVsZWFzZWRcbiAgICAgICAgICAvLyBpbnNpZGUgYW5kIG90aGVyIGJ1dHRvbnMgYXJlIHN0aWxsIHByZXNzZWQgZG93bi5cbiAgICAgICAgICBlLmJ1dHRvbnMgPSBwID8gcC5idXR0b25zICYgfnVwIDogMDtcbiAgICAgICAgICBpbkV2ZW50LmJ1dHRvbnMgPSBlLmJ1dHRvbnM7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcblxuICAgICAgICAvLyBTdXBwb3J0OiBGaXJlZm94IDw9NDQgb25seVxuICAgICAgICAvLyBGRiBVYnVudHUgaW5jbHVkZXMgdGhlIGxpZnRlZCBidXR0b24gaW4gdGhlIGBidXR0b25zYCBwcm9wZXJ0eSBvblxuICAgICAgICAvLyBtb3VzZXVwLlxuICAgICAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMjIzMzY2XG4gICAgICAgIGUuYnV0dG9ucyAmPSB+QlVUVE9OX1RPX0JVVFRPTlNbZS5idXR0b25dO1xuICAgICAgICBpZiAoZS5idXR0b25zID09PSAwKSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci51cChlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLm1vdmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlb3ZlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykgeyB0aGlzLnByZXBhcmVCdXR0b25zRm9yTW92ZShlLCBpbkV2ZW50KTsgfVxuICAgICAgICBlLmJ1dHRvbiA9IC0xO1xuICAgICAgICBwb2ludGVybWFwLnNldCh0aGlzLlBPSU5URVJfSUQsIGluRXZlbnQpO1xuICAgICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNlb3V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNFdmVudFNpbXVsYXRlZEZyb21Ub3VjaChpbkV2ZW50KSkge1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7IHRoaXMucHJlcGFyZUJ1dHRvbnNGb3JNb3ZlKGUsIGluRXZlbnQpOyB9XG4gICAgICAgIGUuYnV0dG9uID0gLTE7XG4gICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChlKTtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZU1vdXNlKCk7XG4gICAgfSxcbiAgICBkZWFjdGl2YXRlTW91c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcG9pbnRlcm1hcC5kZWxldGUodGhpcy5QT0lOVEVSX0lEKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNhcHR1cmVJbmZvID0gZGlzcGF0Y2hlci5jYXB0dXJlSW5mbztcbiAgdmFyIGZpbmRUYXJnZXQgPSB0YXJnZXRpbmcuZmluZFRhcmdldC5iaW5kKHRhcmdldGluZyk7XG4gIHZhciBhbGxTaGFkb3dzID0gdGFyZ2V0aW5nLmFsbFNoYWRvd3MuYmluZCh0YXJnZXRpbmcpO1xuICB2YXIgcG9pbnRlcm1hcCQxID0gZGlzcGF0Y2hlci5wb2ludGVybWFwO1xuXG4gIC8vIFRoaXMgc2hvdWxkIGJlIGxvbmcgZW5vdWdoIHRvIGlnbm9yZSBjb21wYXQgbW91c2UgZXZlbnRzIG1hZGUgYnkgdG91Y2hcbiAgdmFyIERFRFVQX1RJTUVPVVQgPSAyNTAwO1xuICB2YXIgQ0xJQ0tfQ09VTlRfVElNRU9VVCA9IDIwMDtcbiAgdmFyIEFUVFJJQiA9ICd0b3VjaC1hY3Rpb24nO1xuICB2YXIgSU5TVEFMTEVSO1xuXG4gIC8vIGhhbmRsZXIgYmxvY2sgZm9yIG5hdGl2ZSB0b3VjaCBldmVudHNcbiAgdmFyIHRvdWNoRXZlbnRzID0ge1xuICAgIGV2ZW50czogW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hlbmQnLFxuICAgICAgJ3RvdWNoY2FuY2VsJ1xuICAgIF0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgSU5TVEFMTEVSLmVuYWJsZU9uU3VidHJlZSh0YXJnZXQpO1xuICAgIH0sXG4gICAgdW5yZWdpc3RlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgIC8vIFRPRE8oZGZyZWVkbWFuKTogaXMgaXQgd29ydGggaXQgdG8gZGlzY29ubmVjdCB0aGUgTU8/XG4gICAgfSxcbiAgICBlbGVtZW50QWRkZWQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYSA9IGVsLmdldEF0dHJpYnV0ZShBVFRSSUIpO1xuICAgICAgdmFyIHN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShhKTtcbiAgICAgIGlmIChzdCkge1xuICAgICAgICBlbC5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICBkaXNwYXRjaGVyLmxpc3RlbihlbCwgdGhpcy5ldmVudHMpO1xuXG4gICAgICAgIC8vIHNldCB0b3VjaC1hY3Rpb24gb24gc2hhZG93cyBhcyB3ZWxsXG4gICAgICAgIGFsbFNoYWRvd3MoZWwpLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHMuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgICBkaXNwYXRjaGVyLmxpc3RlbihzLCB0aGlzLmV2ZW50cyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWxlbWVudFJlbW92ZWQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5fc2Nyb2xsVHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4oZWwsIHRoaXMuZXZlbnRzKTtcblxuICAgICAgLy8gcmVtb3ZlIHRvdWNoLWFjdGlvbiBmcm9tIHNoYWRvd1xuICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgIHMuX3Njcm9sbFR5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4ocywgdGhpcy5ldmVudHMpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBlbGVtZW50Q2hhbmdlZDogZnVuY3Rpb24oZWwsIG9sZFZhbHVlKSB7XG4gICAgICB2YXIgYSA9IGVsLmdldEF0dHJpYnV0ZShBVFRSSUIpO1xuICAgICAgdmFyIHN0ID0gdGhpcy50b3VjaEFjdGlvblRvU2Nyb2xsVHlwZShhKTtcbiAgICAgIHZhciBvbGRTdCA9IHRoaXMudG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGUob2xkVmFsdWUpO1xuXG4gICAgICAvLyBzaW1wbHkgdXBkYXRlIHNjcm9sbFR5cGUgaWYgbGlzdGVuZXJzIGFyZSBhbHJlYWR5IGVzdGFibGlzaGVkXG4gICAgICBpZiAoc3QgJiYgb2xkU3QpIHtcbiAgICAgICAgZWwuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgYWxsU2hhZG93cyhlbCkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgcy5fc2Nyb2xsVHlwZSA9IHN0O1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAob2xkU3QpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVtb3ZlZChlbCk7XG4gICAgICB9IGVsc2UgaWYgKHN0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudEFkZGVkKGVsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNjcm9sbFR5cGVzOiB7XG4gICAgICBFTUlUVEVSOiAnbm9uZScsXG4gICAgICBYU0NST0xMRVI6ICdwYW4teCcsXG4gICAgICBZU0NST0xMRVI6ICdwYW4teScsXG4gICAgICBTQ1JPTExFUjogL14oPzpwYW4teCBwYW4teSl8KD86cGFuLXkgcGFuLXgpfGF1dG8kL1xuICAgIH0sXG4gICAgdG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGU6IGZ1bmN0aW9uKHRvdWNoQWN0aW9uKSB7XG4gICAgICB2YXIgdCA9IHRvdWNoQWN0aW9uO1xuICAgICAgdmFyIHN0ID0gdGhpcy5zY3JvbGxUeXBlcztcbiAgICAgIGlmICh0ID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICAgIH0gZWxzZSBpZiAodCA9PT0gc3QuWFNDUk9MTEVSKSB7XG4gICAgICAgIHJldHVybiAnWCc7XG4gICAgICB9IGVsc2UgaWYgKHQgPT09IHN0LllTQ1JPTExFUikge1xuICAgICAgICByZXR1cm4gJ1knO1xuICAgICAgfSBlbHNlIGlmIChzdC5TQ1JPTExFUi5leGVjKHQpKSB7XG4gICAgICAgIHJldHVybiAnWFknO1xuICAgICAgfVxuICAgIH0sXG4gICAgUE9JTlRFUl9UWVBFOiAndG91Y2gnLFxuICAgIGZpcnN0VG91Y2g6IG51bGwsXG4gICAgaXNQcmltYXJ5VG91Y2g6IGZ1bmN0aW9uKGluVG91Y2gpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpcnN0VG91Y2ggPT09IGluVG91Y2guaWRlbnRpZmllcjtcbiAgICB9LFxuICAgIHNldFByaW1hcnlUb3VjaDogZnVuY3Rpb24oaW5Ub3VjaCkge1xuXG4gICAgICAvLyBzZXQgcHJpbWFyeSB0b3VjaCBpZiB0aGVyZSBubyBwb2ludGVycywgb3IgdGhlIG9ubHkgcG9pbnRlciBpcyB0aGUgbW91c2VcbiAgICAgIGlmIChwb2ludGVybWFwJDEuc2l6ZSA9PT0gMCB8fCAocG9pbnRlcm1hcCQxLnNpemUgPT09IDEgJiYgcG9pbnRlcm1hcCQxLmhhcygxKSkpIHtcbiAgICAgICAgdGhpcy5maXJzdFRvdWNoID0gaW5Ub3VjaC5pZGVudGlmaWVyO1xuICAgICAgICB0aGlzLmZpcnN0WFkgPSB7IFg6IGluVG91Y2guY2xpZW50WCwgWTogaW5Ub3VjaC5jbGllbnRZIH07XG4gICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FuY2VsUmVzZXRDbGlja0NvdW50KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVQcmltYXJ5UG9pbnRlcjogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBpZiAoaW5Qb2ludGVyLmlzUHJpbWFyeSkge1xuICAgICAgICB0aGlzLmZpcnN0VG91Y2ggPSBudWxsO1xuICAgICAgICB0aGlzLmZpcnN0WFkgPSBudWxsO1xuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tDb3VudCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xpY2tDb3VudDogMCxcbiAgICByZXNldElkOiBudWxsLFxuICAgIHJlc2V0Q2xpY2tDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jbGlja0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5yZXNldElkID0gbnVsbDtcbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucmVzZXRJZCA9IHNldFRpbWVvdXQoZm4sIENMSUNLX0NPVU5UX1RJTUVPVVQpO1xuICAgIH0sXG4gICAgY2FuY2VsUmVzZXRDbGlja0NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnJlc2V0SWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzZXRJZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0eXBlVG9CdXR0b25zOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICB2YXIgcmV0ID0gMDtcbiAgICAgIGlmICh0eXBlID09PSAndG91Y2hzdGFydCcgfHwgdHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcbiAgICAgICAgcmV0ID0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICB0b3VjaFRvUG9pbnRlcjogZnVuY3Rpb24oaW5Ub3VjaCkge1xuICAgICAgdmFyIGN0ZSA9IHRoaXMuY3VycmVudFRvdWNoRXZlbnQ7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIuY2xvbmVFdmVudChpblRvdWNoKTtcblxuICAgICAgLy8gV2UgcmVzZXJ2ZSBwb2ludGVySWQgMSBmb3IgTW91c2UuXG4gICAgICAvLyBUb3VjaCBpZGVudGlmaWVycyBjYW4gc3RhcnQgYXQgMC5cbiAgICAgIC8vIEFkZCAyIHRvIHRoZSB0b3VjaCBpZGVudGlmaWVyIGZvciBjb21wYXRpYmlsaXR5LlxuICAgICAgdmFyIGlkID0gZS5wb2ludGVySWQgPSBpblRvdWNoLmlkZW50aWZpZXIgKyAyO1xuICAgICAgZS50YXJnZXQgPSBjYXB0dXJlSW5mb1tpZF0gfHwgZmluZFRhcmdldChlKTtcbiAgICAgIGUuYnViYmxlcyA9IHRydWU7XG4gICAgICBlLmNhbmNlbGFibGUgPSB0cnVlO1xuICAgICAgZS5kZXRhaWwgPSB0aGlzLmNsaWNrQ291bnQ7XG4gICAgICBlLmJ1dHRvbiA9IDA7XG4gICAgICBlLmJ1dHRvbnMgPSB0aGlzLnR5cGVUb0J1dHRvbnMoY3RlLnR5cGUpO1xuICAgICAgZS53aWR0aCA9IChpblRvdWNoLnJhZGl1c1ggfHwgaW5Ub3VjaC53ZWJraXRSYWRpdXNYIHx8IDApICogMjtcbiAgICAgIGUuaGVpZ2h0ID0gKGluVG91Y2gucmFkaXVzWSB8fCBpblRvdWNoLndlYmtpdFJhZGl1c1kgfHwgMCkgKiAyO1xuICAgICAgZS5wcmVzc3VyZSA9IGluVG91Y2guZm9yY2UgfHwgaW5Ub3VjaC53ZWJraXRGb3JjZSB8fCAwLjU7XG4gICAgICBlLmlzUHJpbWFyeSA9IHRoaXMuaXNQcmltYXJ5VG91Y2goaW5Ub3VjaCk7XG4gICAgICBlLnBvaW50ZXJUeXBlID0gdGhpcy5QT0lOVEVSX1RZUEU7XG5cbiAgICAgIC8vIGZvcndhcmQgbW9kaWZpZXIga2V5c1xuICAgICAgZS5hbHRLZXkgPSBjdGUuYWx0S2V5O1xuICAgICAgZS5jdHJsS2V5ID0gY3RlLmN0cmxLZXk7XG4gICAgICBlLm1ldGFLZXkgPSBjdGUubWV0YUtleTtcbiAgICAgIGUuc2hpZnRLZXkgPSBjdGUuc2hpZnRLZXk7XG5cbiAgICAgIC8vIGZvcndhcmQgdG91Y2ggcHJldmVudERlZmF1bHRzXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgIHNlbGYuZmlyc3RYWSA9IG51bGw7XG4gICAgICAgIGN0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgcHJvY2Vzc1RvdWNoZXM6IGZ1bmN0aW9uKGluRXZlbnQsIGluRnVuY3Rpb24pIHtcbiAgICAgIHZhciB0bCA9IGluRXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgICB0aGlzLmN1cnJlbnRUb3VjaEV2ZW50ID0gaW5FdmVudDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCB0OyBpIDwgdGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdCA9IHRsW2ldO1xuICAgICAgICBpbkZ1bmN0aW9uLmNhbGwodGhpcywgdGhpcy50b3VjaFRvUG9pbnRlcih0KSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEZvciBzaW5nbGUgYXhpcyBzY3JvbGxlcnMsIGRldGVybWluZXMgd2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgZW1pdFxuICAgIC8vIHBvaW50ZXIgZXZlbnRzIG9yIGJlaGF2ZSBhcyBhIHNjcm9sbGVyXG4gICAgc2hvdWxkU2Nyb2xsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5maXJzdFhZKSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIHZhciBzY3JvbGxBeGlzID0gaW5FdmVudC5jdXJyZW50VGFyZ2V0Ll9zY3JvbGxUeXBlO1xuICAgICAgICBpZiAoc2Nyb2xsQXhpcyA9PT0gJ25vbmUnKSB7XG5cbiAgICAgICAgICAvLyB0aGlzIGVsZW1lbnQgaXMgYSB0b3VjaC1hY3Rpb246IG5vbmUsIHNob3VsZCBuZXZlciBzY3JvbGxcbiAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxBeGlzID09PSAnWFknKSB7XG5cbiAgICAgICAgICAvLyB0aGlzIGVsZW1lbnQgc2hvdWxkIGFsd2F5cyBzY3JvbGxcbiAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0ID0gaW5FdmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgICAgICAgIC8vIGNoZWNrIHRoZSBpbnRlbmRlZCBzY3JvbGwgYXhpcywgYW5kIG90aGVyIGF4aXNcbiAgICAgICAgICB2YXIgYSA9IHNjcm9sbEF4aXM7XG4gICAgICAgICAgdmFyIG9hID0gc2Nyb2xsQXhpcyA9PT0gJ1knID8gJ1gnIDogJ1knO1xuICAgICAgICAgIHZhciBkYSA9IE1hdGguYWJzKHRbJ2NsaWVudCcgKyBhXSAtIHRoaXMuZmlyc3RYWVthXSk7XG4gICAgICAgICAgdmFyIGRvYSA9IE1hdGguYWJzKHRbJ2NsaWVudCcgKyBvYV0gLSB0aGlzLmZpcnN0WFlbb2FdKTtcblxuICAgICAgICAgIC8vIGlmIGRlbHRhIGluIHRoZSBzY3JvbGwgYXhpcyA+IGRlbHRhIG90aGVyIGF4aXMsIHNjcm9sbCBpbnN0ZWFkIG9mXG4gICAgICAgICAgLy8gbWFraW5nIGV2ZW50c1xuICAgICAgICAgIHJldCA9IGRhID49IGRvYTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcnN0WFkgPSBudWxsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuICAgIH0sXG4gICAgZmluZFRvdWNoOiBmdW5jdGlvbihpblRMLCBpbklkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGluVEwubGVuZ3RoLCB0OyBpIDwgbCAmJiAodCA9IGluVExbaV0pOyBpKyspIHtcbiAgICAgICAgaWYgKHQuaWRlbnRpZmllciA9PT0gaW5JZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEluIHNvbWUgaW5zdGFuY2VzLCBhIHRvdWNoc3RhcnQgY2FuIGhhcHBlbiB3aXRob3V0IGEgdG91Y2hlbmQuIFRoaXNcbiAgICAvLyBsZWF2ZXMgdGhlIHBvaW50ZXJtYXAgaW4gYSBicm9rZW4gc3RhdGUuXG4gICAgLy8gVGhlcmVmb3JlLCBvbiBldmVyeSB0b3VjaHN0YXJ0LCB3ZSByZW1vdmUgdGhlIHRvdWNoZXMgdGhhdCBkaWQgbm90IGZpcmUgYVxuICAgIC8vIHRvdWNoZW5kIGV2ZW50LlxuICAgIC8vIFRvIGtlZXAgc3RhdGUgZ2xvYmFsbHkgY29uc2lzdGVudCwgd2UgZmlyZSBhXG4gICAgLy8gcG9pbnRlcmNhbmNlbCBmb3IgdGhpcyBcImFiYW5kb25lZFwiIHRvdWNoXG4gICAgdmFjdXVtVG91Y2hlczogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIHRsID0gaW5FdmVudC50b3VjaGVzO1xuXG4gICAgICAvLyBwb2ludGVybWFwLnNpemUgc2hvdWxkIGJlIDwgdGwubGVuZ3RoIGhlcmUsIGFzIHRoZSB0b3VjaHN0YXJ0IGhhcyBub3RcbiAgICAgIC8vIGJlZW4gcHJvY2Vzc2VkIHlldC5cbiAgICAgIGlmIChwb2ludGVybWFwJDEuc2l6ZSA+PSB0bC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGQgPSBbXTtcbiAgICAgICAgcG9pbnRlcm1hcCQxLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuXG4gICAgICAgICAgLy8gTmV2ZXIgcmVtb3ZlIHBvaW50ZXJJZCA9PSAxLCB3aGljaCBpcyBtb3VzZS5cbiAgICAgICAgICAvLyBUb3VjaCBpZGVudGlmaWVycyBhcmUgMiBzbWFsbGVyIHRoYW4gdGhlaXIgcG9pbnRlcklkLCB3aGljaCBpcyB0aGVcbiAgICAgICAgICAvLyBpbmRleCBpbiBwb2ludGVybWFwLlxuICAgICAgICAgIGlmIChrZXkgIT09IDEgJiYgIXRoaXMuZmluZFRvdWNoKHRsLCBrZXkgLSAyKSkge1xuICAgICAgICAgICAgdmFyIHAgPSB2YWx1ZS5vdXQ7XG4gICAgICAgICAgICBkLnB1c2gocCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgZC5mb3JFYWNoKHRoaXMuY2FuY2VsT3V0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRvdWNoc3RhcnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHRoaXMudmFjdXVtVG91Y2hlcyhpbkV2ZW50KTtcbiAgICAgIHRoaXMuc2V0UHJpbWFyeVRvdWNoKGluRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgdGhpcy5kZWR1cFN5bnRoTW91c2UoaW5FdmVudCk7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpY2tDb3VudCsrO1xuICAgICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMub3ZlckRvd24pO1xuICAgICAgfVxuICAgIH0sXG4gICAgb3ZlckRvd246IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgcG9pbnRlcm1hcCQxLnNldChpblBvaW50ZXIucG9pbnRlcklkLCB7XG4gICAgICAgIHRhcmdldDogaW5Qb2ludGVyLnRhcmdldCxcbiAgICAgICAgb3V0OiBpblBvaW50ZXIsXG4gICAgICAgIG91dFRhcmdldDogaW5Qb2ludGVyLnRhcmdldFxuICAgICAgfSk7XG4gICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihpblBvaW50ZXIpO1xuICAgICAgZGlzcGF0Y2hlci5kb3duKGluUG9pbnRlcik7XG4gICAgfSxcbiAgICB0b3VjaG1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkU2Nyb2xsKGluRXZlbnQpKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudG91Y2hjYW5jZWwoaW5FdmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucHJvY2Vzc1RvdWNoZXMoaW5FdmVudCwgdGhpcy5tb3ZlT3Zlck91dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdmVPdmVyT3V0OiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIHZhciBldmVudCA9IGluUG9pbnRlcjtcbiAgICAgIHZhciBwb2ludGVyID0gcG9pbnRlcm1hcCQxLmdldChldmVudC5wb2ludGVySWQpO1xuXG4gICAgICAvLyBhIGZpbmdlciBkcmlmdGVkIG9mZiB0aGUgc2NyZWVuLCBpZ25vcmUgaXRcbiAgICAgIGlmICghcG9pbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgb3V0RXZlbnQgPSBwb2ludGVyLm91dDtcbiAgICAgIHZhciBvdXRUYXJnZXQgPSBwb2ludGVyLm91dFRhcmdldDtcbiAgICAgIGRpc3BhdGNoZXIubW92ZShldmVudCk7XG4gICAgICBpZiAob3V0RXZlbnQgJiYgb3V0VGFyZ2V0ICE9PSBldmVudC50YXJnZXQpIHtcbiAgICAgICAgb3V0RXZlbnQucmVsYXRlZFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgZXZlbnQucmVsYXRlZFRhcmdldCA9IG91dFRhcmdldDtcblxuICAgICAgICAvLyByZWNvdmVyIGZyb20gcmV0YXJnZXRpbmcgYnkgc2hhZG93XG4gICAgICAgIG91dEV2ZW50LnRhcmdldCA9IG91dFRhcmdldDtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQob3V0RXZlbnQpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIGNsZWFuIHVwIGNhc2Ugd2hlbiBmaW5nZXIgbGVhdmVzIHRoZSBzY3JlZW5cbiAgICAgICAgICBldmVudC50YXJnZXQgPSBvdXRUYXJnZXQ7XG4gICAgICAgICAgZXZlbnQucmVsYXRlZFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5jYW5jZWxPdXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludGVyLm91dCA9IGV2ZW50O1xuICAgICAgcG9pbnRlci5vdXRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgfSxcbiAgICB0b3VjaGVuZDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdGhpcy5kZWR1cFN5bnRoTW91c2UoaW5FdmVudCk7XG4gICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMudXBPdXQpO1xuICAgIH0sXG4gICAgdXBPdXQ6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgICBkaXNwYXRjaGVyLnVwKGluUG9pbnRlcik7XG4gICAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoaW5Qb2ludGVyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYW5VcFBvaW50ZXIoaW5Qb2ludGVyKTtcbiAgICB9LFxuICAgIHRvdWNoY2FuY2VsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMuY2FuY2VsT3V0KTtcbiAgICB9LFxuICAgIGNhbmNlbE91dDogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChpblBvaW50ZXIpO1xuICAgICAgZGlzcGF0Y2hlci5sZWF2ZU91dChpblBvaW50ZXIpO1xuICAgICAgdGhpcy5jbGVhblVwUG9pbnRlcihpblBvaW50ZXIpO1xuICAgIH0sXG4gICAgY2xlYW5VcFBvaW50ZXI6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgcG9pbnRlcm1hcCQxLmRlbGV0ZShpblBvaW50ZXIucG9pbnRlcklkKTtcbiAgICAgIHRoaXMucmVtb3ZlUHJpbWFyeVBvaW50ZXIoaW5Qb2ludGVyKTtcbiAgICB9LFxuXG4gICAgLy8gcHJldmVudCBzeW50aCBtb3VzZSBldmVudHMgZnJvbSBjcmVhdGluZyBwb2ludGVyIGV2ZW50c1xuICAgIGRlZHVwU3ludGhNb3VzZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGx0cyA9IG1vdXNlRXZlbnRzLmxhc3RUb3VjaGVzO1xuICAgICAgdmFyIHQgPSBpbkV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAvLyBvbmx5IHRoZSBwcmltYXJ5IGZpbmdlciB3aWxsIHN5bnRoIG1vdXNlIGV2ZW50c1xuICAgICAgaWYgKHRoaXMuaXNQcmltYXJ5VG91Y2godCkpIHtcblxuICAgICAgICAvLyByZW1lbWJlciB4L3kgb2YgbGFzdCB0b3VjaFxuICAgICAgICB2YXIgbHQgPSB7IHg6IHQuY2xpZW50WCwgeTogdC5jbGllbnRZIH07XG4gICAgICAgIGx0cy5wdXNoKGx0KTtcbiAgICAgICAgdmFyIGZuID0gKGZ1bmN0aW9uKGx0cywgbHQpIHtcbiAgICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGx0KTtcbiAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICBsdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuYmluZChudWxsLCBsdHMsIGx0KTtcbiAgICAgICAgc2V0VGltZW91dChmbiwgREVEVVBfVElNRU9VVCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIElOU1RBTExFUiA9IG5ldyBJbnN0YWxsZXIodG91Y2hFdmVudHMuZWxlbWVudEFkZGVkLCB0b3VjaEV2ZW50cy5lbGVtZW50UmVtb3ZlZCxcbiAgICB0b3VjaEV2ZW50cy5lbGVtZW50Q2hhbmdlZCwgdG91Y2hFdmVudHMpO1xuXG4gIHZhciBwb2ludGVybWFwJDIgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXA7XG4gIHZhciBIQVNfQklUTUFQX1RZUEUgPSB3aW5kb3cuTVNQb2ludGVyRXZlbnQgJiZcbiAgICB0eXBlb2Ygd2luZG93Lk1TUG9pbnRlckV2ZW50Lk1TUE9JTlRFUl9UWVBFX01PVVNFID09PSAnbnVtYmVyJztcbiAgdmFyIG1zRXZlbnRzID0ge1xuICAgIGV2ZW50czogW1xuICAgICAgJ01TUG9pbnRlckRvd24nLFxuICAgICAgJ01TUG9pbnRlck1vdmUnLFxuICAgICAgJ01TUG9pbnRlclVwJyxcbiAgICAgICdNU1BvaW50ZXJPdXQnLFxuICAgICAgJ01TUG9pbnRlck92ZXInLFxuICAgICAgJ01TUG9pbnRlckNhbmNlbCcsXG4gICAgICAnTVNHb3RQb2ludGVyQ2FwdHVyZScsXG4gICAgICAnTVNMb3N0UG9pbnRlckNhcHR1cmUnXG4gICAgXSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBkaXNwYXRjaGVyLmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci51bmxpc3Rlbih0YXJnZXQsIHRoaXMuZXZlbnRzKTtcbiAgICB9LFxuICAgIFBPSU5URVJfVFlQRVM6IFtcbiAgICAgICcnLFxuICAgICAgJ3VuYXZhaWxhYmxlJyxcbiAgICAgICd0b3VjaCcsXG4gICAgICAncGVuJyxcbiAgICAgICdtb3VzZSdcbiAgICBdLFxuICAgIHByZXBhcmVFdmVudDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBpbkV2ZW50O1xuICAgICAgaWYgKEhBU19CSVRNQVBfVFlQRSkge1xuICAgICAgICBlID0gZGlzcGF0Y2hlci5jbG9uZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBlLnBvaW50ZXJUeXBlID0gdGhpcy5QT0lOVEVSX1RZUEVTW2luRXZlbnQucG9pbnRlclR5cGVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICBjbGVhbnVwOiBmdW5jdGlvbihpZCkge1xuICAgICAgcG9pbnRlcm1hcCQyLmRlbGV0ZShpZCk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJEb3duOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBwb2ludGVybWFwJDIuc2V0KGluRXZlbnQucG9pbnRlcklkLCBpbkV2ZW50KTtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRvd24oZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJNb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5tb3ZlKGUpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyVXA6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLnVwKGUpO1xuICAgICAgdGhpcy5jbGVhbnVwKGluRXZlbnQucG9pbnRlcklkKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlck91dDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJPdmVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoZSk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJDYW5jZWw6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmNhbmNlbChlKTtcbiAgICAgIHRoaXMuY2xlYW51cChpbkV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfSxcbiAgICBNU0xvc3RQb2ludGVyQ2FwdHVyZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLm1ha2VFdmVudCgnbG9zdHBvaW50ZXJjYXB0dXJlJywgaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfSxcbiAgICBNU0dvdFBvaW50ZXJDYXB0dXJlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGRpc3BhdGNoZXIubWFrZUV2ZW50KCdnb3Rwb2ludGVyY2FwdHVyZScsIGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBhcHBseVBvbHlmaWxsKCkge1xuXG4gICAgLy8gb25seSBhY3RpdmF0ZSBpZiB0aGlzIHBsYXRmb3JtIGRvZXMgbm90IGhhdmUgcG9pbnRlciBldmVudHNcbiAgICBpZiAoIXdpbmRvdy5Qb2ludGVyRXZlbnQpIHtcbiAgICAgIHdpbmRvdy5Qb2ludGVyRXZlbnQgPSBQb2ludGVyRXZlbnQ7XG5cbiAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgdmFyIHRwID0gd2luZG93Lm5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93Lm5hdmlnYXRvciwgJ21heFRvdWNoUG9pbnRzJywge1xuICAgICAgICAgIHZhbHVlOiB0cCxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCdtcycsIG1zRXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cubmF2aWdhdG9yLCAnbWF4VG91Y2hQb2ludHMnLCB7XG4gICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgZGlzcGF0Y2hlci5yZWdpc3RlclNvdXJjZSgnbW91c2UnLCBtb3VzZUV2ZW50cyk7XG4gICAgICAgIGlmICh3aW5kb3cub250b3VjaHN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyU291cmNlKCd0b3VjaCcsIHRvdWNoRXZlbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaGVyLnJlZ2lzdGVyKGRvY3VtZW50KTtcbiAgICB9XG4gIH1cblxuICB2YXIgbiA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gIHZhciBzO1xuICB2YXIgcjtcbiAgdmFyIGg7XG4gIGZ1bmN0aW9uIGFzc2VydEFjdGl2ZShpZCkge1xuICAgIGlmICghZGlzcGF0Y2hlci5wb2ludGVybWFwLmhhcyhpZCkpIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignSW52YWxpZFBvaW50ZXJJZCcpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhbGlkUG9pbnRlcklkJztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBhc3NlcnRDb25uZWN0ZWQoZWxlbSkge1xuICAgIHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG4gICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IGVsZW0ub3duZXJEb2N1bWVudCkge1xuICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGlmICghcGFyZW50KSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ0ludmFsaWRTdGF0ZUVycm9yJyk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFsaWRTdGF0ZUVycm9yJztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbkFjdGl2ZUJ1dHRvblN0YXRlKGlkKSB7XG4gICAgdmFyIHAgPSBkaXNwYXRjaGVyLnBvaW50ZXJtYXAuZ2V0KGlkKTtcbiAgICByZXR1cm4gcC5idXR0b25zICE9PSAwO1xuICB9XG4gIGlmIChuLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICBzID0gZnVuY3Rpb24ocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGFzc2VydENvbm5lY3RlZCh0aGlzKTtcbiAgICAgIGlmIChpbkFjdGl2ZUJ1dHRvblN0YXRlKHBvaW50ZXJJZCkpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5zZXRDYXB0dXJlKHBvaW50ZXJJZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubXNTZXRQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpO1xuICAgICAgfVxuICAgIH07XG4gICAgciA9IGZ1bmN0aW9uKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBkaXNwYXRjaGVyLnJlbGVhc2VDYXB0dXJlKHBvaW50ZXJJZCwgdHJ1ZSk7XG4gICAgICB0aGlzLm1zUmVsZWFzZVBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBzID0gZnVuY3Rpb24gc2V0UG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgICBhc3NlcnRBY3RpdmUocG9pbnRlcklkKTtcbiAgICAgIGFzc2VydENvbm5lY3RlZCh0aGlzKTtcbiAgICAgIGlmIChpbkFjdGl2ZUJ1dHRvblN0YXRlKHBvaW50ZXJJZCkpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5zZXRDYXB0dXJlKHBvaW50ZXJJZCwgdGhpcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICByID0gZnVuY3Rpb24gcmVsZWFzZVBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBkaXNwYXRjaGVyLnJlbGVhc2VDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgfTtcbiAgfVxuICBoID0gZnVuY3Rpb24gaGFzUG9pbnRlckNhcHR1cmUocG9pbnRlcklkKSB7XG4gICAgcmV0dXJuICEhZGlzcGF0Y2hlci5jYXB0dXJlSW5mb1twb2ludGVySWRdO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGFwcGx5UG9seWZpbGwkMSgpIHtcbiAgICBpZiAod2luZG93LkVsZW1lbnQgJiYgIUVsZW1lbnQucHJvdG90eXBlLnNldFBvaW50ZXJDYXB0dXJlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhFbGVtZW50LnByb3RvdHlwZSwge1xuICAgICAgICAnc2V0UG9pbnRlckNhcHR1cmUnOiB7XG4gICAgICAgICAgdmFsdWU6IHNcbiAgICAgICAgfSxcbiAgICAgICAgJ3JlbGVhc2VQb2ludGVyQ2FwdHVyZSc6IHtcbiAgICAgICAgICB2YWx1ZTogclxuICAgICAgICB9LFxuICAgICAgICAnaGFzUG9pbnRlckNhcHR1cmUnOiB7XG4gICAgICAgICAgdmFsdWU6IGhcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlBdHRyaWJ1dGVTdHlsZXMoKTtcbiAgYXBwbHlQb2x5ZmlsbCgpO1xuICBhcHBseVBvbHlmaWxsJDEoKTtcblxuICB2YXIgcG9pbnRlcmV2ZW50cyA9IHtcbiAgICBkaXNwYXRjaGVyOiBkaXNwYXRjaGVyLFxuICAgIEluc3RhbGxlcjogSW5zdGFsbGVyLFxuICAgIFBvaW50ZXJFdmVudDogUG9pbnRlckV2ZW50LFxuICAgIFBvaW50ZXJNYXA6IFBvaW50ZXJNYXAsXG4gICAgdGFyZ2V0RmluZGluZzogdGFyZ2V0aW5nXG4gIH07XG5cbiAgcmV0dXJuIHBvaW50ZXJldmVudHM7XG5cbn0pKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvcGVwanMvZGlzdC9wZXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gcnVudGltZSIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gcnVudGltZSIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHJ1bnRpbWUiLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBydW50aW1lIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gcnVudGltZSJdLCJzb3VyY2VSb290IjoiIn0=