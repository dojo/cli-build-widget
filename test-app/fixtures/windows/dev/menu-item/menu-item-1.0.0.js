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
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
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
var Destroyable = /** @class */ (function () {
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
    Destroyable.prototype.own = function (handles) {
        var handle = Array.isArray(handles) ? lang_1.createCompositeHandle.apply(void 0, tslib_1.__spread(handles)) : handles;
        var _handles = this.handles;
        _handles.push(handle);
        return {
            destroy: function () {
                _handles.splice(_handles.indexOf(handle));
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
var Destroyable_1 = __webpack_require__("./node_modules/@dojo/core/Destroyable.js");
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
var Evented = /** @class */ (function (_super) {
    tslib_1.__extends(Evented, _super);
    function Evented() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * map of listeners keyed by event type
         */
        _this.listenersMap = new Map_1.default();
        return _this;
    }
    Evented.prototype.emit = function (event) {
        var _this = this;
        this.listenersMap.forEach(function (methods, type) {
            if (isGlobMatch(type, event.type)) {
                methods.forEach(function (method) {
                    method.call(_this, event);
                });
            }
        });
    };
    Evented.prototype.on = function (type, listener) {
        var _this = this;
        if (Array.isArray(listener)) {
            var handles_1 = listener.map(function (listener) { return _this._addListener(type, listener); });
            return {
                destroy: function () {
                    handles_1.forEach(function (handle) { return handle.destroy(); });
                }
            };
        }
        return this._addListener(type, listener);
    };
    Evented.prototype._addListener = function (type, listener) {
        var _this = this;
        var listeners = this.listenersMap.get(type) || [];
        listeners.push(listener);
        this.listenersMap.set(type, listeners);
        return {
            destroy: function () {
                var listeners = _this.listenersMap.get(type) || [];
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    };
    return Evented;
}(Destroyable_1.Destroyable));
exports.Evented = Evented;
exports.default = Evented;

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
        return !shouldDeepCopyObject(item)
            ? item
            : _mixin({
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
    return (a === b ||
        /* both values are NaN */
        (a !== a && b !== b));
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
    return suppliedArgs.length
        ? function () {
            var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
            // TS7017
            return instance[method].apply(instance, args);
        }
        : function () {
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
has_1.add('dom-webanimation', function () { return has_1.default('host-browser') && global_1.default.Animation !== undefined && global_1.default.KeyframeEffect !== undefined; }, true);
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
function isElementNode(value) {
    return !!value.tagName;
}
exports.isElementNode = isElementNode;
function decorate(dNodes, optionsOrModifier, predicate) {
    var shallow = false;
    var modifier;
    if (typeof optionsOrModifier === 'function') {
        modifier = optionsOrModifier;
    }
    else {
        modifier = optionsOrModifier.modifier;
        predicate = optionsOrModifier.predicate;
        shallow = optionsOrModifier.shallow || false;
    }
    var nodes = Array.isArray(dNodes) ? tslib_1.__spread(dNodes) : [dNodes];
    function breaker() {
        nodes = [];
    }
    while (nodes.length) {
        var node = nodes.shift();
        if (node) {
            if (!shallow && (isWNode(node) || isVNode(node)) && node.children) {
                nodes = tslib_1.__spread(nodes, node.children);
            }
            if (!predicate || predicate(node)) {
                modifier(node, breaker);
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
/**
 * Create a VNode for an existing DOM Node.
 */
function dom(_a, children) {
    var node = _a.node, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c, _d = _a.on, on = _d === void 0 ? {} : _d, _e = _a.diffType, diffType = _e === void 0 ? 'none' : _e;
    return {
        tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
        properties: props,
        attributes: attrs,
        events: on,
        children: children,
        type: exports.VNODE,
        domNode: node,
        text: isElementNode(node) ? undefined : node.data,
        diffType: diffType
    };
}
exports.dom = dom;

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
    var tag = _a.tag, _b = _a.properties, properties = _b === void 0 ? [] : _b, _c = _a.attributes, attributes = _c === void 0 ? [] : _c, _d = _a.events, events = _d === void 0 ? [] : _d, _e = _a.childType, childType = _e === void 0 ? registerCustomElement_1.CustomElementChildType.DOJO : _e;
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            attributes: attributes,
            properties: properties,
            events: events,
            childType: childType
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
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Projector_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.js");
var array_1 = __webpack_require__("./node_modules/@dojo/shim/array.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var CustomElementChildType;
(function (CustomElementChildType) {
    CustomElementChildType["DOJO"] = "DOJO";
    CustomElementChildType["NODE"] = "NODE";
    CustomElementChildType["TEXT"] = "TEXT";
})(CustomElementChildType = exports.CustomElementChildType || (exports.CustomElementChildType = {}));
function DomToWidgetWrapper(domNode) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(DomToWidgetWrapper, _super);
        function DomToWidgetWrapper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DomToWidgetWrapper.prototype.render = function () {
            var _this = this;
            var properties = Object.keys(this.properties).reduce(function (props, key) {
                var value = _this.properties[key];
                if (key.indexOf('on') === 0) {
                    key = "__" + key;
                }
                props[key] = value;
                return props;
            }, {});
            return d_1.dom({ node: domNode, props: properties });
        };
        Object.defineProperty(DomToWidgetWrapper, "domNode", {
            get: function () {
                return domNode;
            },
            enumerable: true,
            configurable: true
        });
        return DomToWidgetWrapper;
    }(WidgetBase_1.WidgetBase));
}
exports.DomToWidgetWrapper = DomToWidgetWrapper;
function create(descriptor, WidgetConstructor) {
    var attributes = descriptor.attributes, childType = descriptor.childType;
    var attributeMap = {};
    attributes.forEach(function (propertyName) {
        var attributeName = propertyName.toLowerCase();
        attributeMap[attributeName] = propertyName;
    });
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._properties = {};
            _this._children = [];
            _this._eventProperties = {};
            _this._initialised = false;
            return _this;
        }
        class_1.prototype.connectedCallback = function () {
            var _this = this;
            if (this._initialised) {
                return;
            }
            var domProperties = {};
            var attributes = descriptor.attributes, properties = descriptor.properties, events = descriptor.events;
            this._properties = tslib_1.__assign({}, this._properties, this._attributesToProperties(attributes));
            tslib_1.__spread(attributes, properties).forEach(function (propertyName) {
                var value = _this[propertyName];
                var filteredPropertyName = propertyName.replace(/^on/, '__');
                if (value !== undefined) {
                    _this._properties[propertyName] = value;
                }
                domProperties[filteredPropertyName] = {
                    get: function () { return _this._getProperty(propertyName); },
                    set: function (value) { return _this._setProperty(propertyName, value); }
                };
            });
            events.forEach(function (propertyName) {
                var eventName = propertyName.replace(/^on/, '').toLowerCase();
                var filteredPropertyName = propertyName.replace(/^on/, '__on');
                domProperties[filteredPropertyName] = {
                    get: function () { return _this._getEventProperty(propertyName); },
                    set: function (value) { return _this._setEventProperty(propertyName, value); }
                };
                _this._eventProperties[propertyName] = undefined;
                _this._properties[propertyName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var eventCallback = _this._getEventProperty(propertyName);
                    if (typeof eventCallback === 'function') {
                        eventCallback.apply(void 0, tslib_1.__spread(args));
                    }
                    _this.dispatchEvent(new CustomEvent(eventName, {
                        bubbles: false,
                        detail: args
                    }));
                };
            });
            Object.defineProperties(this, domProperties);
            var children = childType === CustomElementChildType.TEXT ? this.childNodes : this.children;
            array_1.from(children).forEach(function (childNode) {
                if (childType === CustomElementChildType.DOJO) {
                    childNode.addEventListener('dojo-ce-render', function () { return _this._render(); });
                    childNode.addEventListener('dojo-ce-connected', function () { return _this._render(); });
                    _this._children.push(DomToWidgetWrapper(childNode));
                }
                else {
                    _this._children.push(d_1.dom({ node: childNode }));
                }
            });
            this.addEventListener('dojo-ce-connected', function (e) { return _this._childConnected(e); });
            var widgetProperties = this._properties;
            var renderChildren = function () { return _this.__children__(); };
            var Wrapper = /** @class */ (function (_super) {
                tslib_1.__extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.render = function () {
                    return d_1.w(WidgetConstructor, widgetProperties, renderChildren());
                };
                return class_2;
            }(WidgetBase_1.WidgetBase));
            var registry = new Registry_1.default();
            var themeContext = Themed_1.registerThemeInjector(this._getTheme(), registry);
            global_1.default.addEventListener('dojo-theme-set', function () { return themeContext.set(_this._getTheme()); });
            var Projector = Projector_1.ProjectorMixin(Wrapper);
            this._projector = new Projector();
            this._projector.setProperties({ registry: registry });
            this._projector.append(this);
            this._initialised = true;
            this.dispatchEvent(new CustomEvent('dojo-ce-connected', {
                bubbles: true,
                detail: this
            }));
        };
        class_1.prototype._getTheme = function () {
            if (global_1.default && global_1.default.dojoce && global_1.default.dojoce.theme) {
                return global_1.default.dojoce.themes[global_1.default.dojoce.theme];
            }
        };
        class_1.prototype._childConnected = function (e) {
            var _this = this;
            var node = e.detail;
            if (node.parentNode === this) {
                var exists = this._children.some(function (child) { return child.domNode === node; });
                if (!exists) {
                    node.addEventListener('dojo-ce-render', function () { return _this._render(); });
                    this._children.push(DomToWidgetWrapper(node));
                    this._render();
                }
            }
        };
        class_1.prototype._render = function () {
            if (this._projector) {
                this._projector.invalidate();
                this.dispatchEvent(new CustomEvent('dojo-ce-render', {
                    bubbles: false,
                    detail: this
                }));
            }
        };
        class_1.prototype.__properties__ = function () {
            return tslib_1.__assign({}, this._properties, this._eventProperties);
        };
        class_1.prototype.__children__ = function () {
            if (childType === CustomElementChildType.DOJO) {
                return this._children.filter(function (Child) { return Child.domNode.isWidget; }).map(function (Child) {
                    var domNode = Child.domNode;
                    return d_1.w(Child, tslib_1.__assign({}, domNode.__properties__()), tslib_1.__spread(domNode.__children__()));
                });
            }
            else {
                return this._children;
            }
        };
        class_1.prototype.attributeChangedCallback = function (name, oldValue, value) {
            var propertyName = attributeMap[name];
            this._setProperty(propertyName, value);
        };
        class_1.prototype._setEventProperty = function (propertyName, value) {
            this._eventProperties[propertyName] = value;
        };
        class_1.prototype._getEventProperty = function (propertyName) {
            return this._eventProperties[propertyName];
        };
        class_1.prototype._setProperty = function (propertyName, value) {
            this._properties[propertyName] = value;
            this._render();
        };
        class_1.prototype._getProperty = function (propertyName) {
            return this._properties[propertyName];
        };
        class_1.prototype._attributesToProperties = function (attributes) {
            var _this = this;
            return attributes.reduce(function (properties, propertyName) {
                var attributeName = propertyName.toLowerCase();
                var value = _this.getAttribute(attributeName);
                if (value !== null) {
                    properties[propertyName] = value;
                }
                return properties;
            }, {});
        };
        Object.defineProperty(class_1, "observedAttributes", {
            get: function () {
                return Object.keys(attributeMap);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "isWidget", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(HTMLElement));
}
exports.create = create;
function register(WidgetConstructor) {
    var descriptor = WidgetConstructor.prototype && WidgetConstructor.prototype.__customElementDescriptor;
    if (!descriptor) {
        throw new Error('Cannot get descriptor for Custom Element, have you added the @customElement decorator to your Widget?');
    }
    global_1.default.customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
}
exports.register = register;
exports.default = register;

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
function updateEvent(domNode, eventName, currentValue, projectionOptions, bind, previousValue) {
    var eventMap = projectionOptions.nodeMap.get(domNode) || new WeakMap_1.default();
    if (previousValue) {
        var previousEvent = eventMap.get(previousValue);
        domNode.removeEventListener(eventName, previousEvent);
    }
    var callback = currentValue.bind(bind);
    if (eventName === 'input') {
        callback = function (evt) {
            currentValue.call(this, evt);
            evt.target['oninput-value'] = evt.target.value;
        }.bind(bind);
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
function buildPreviousProperties(domNode, previous, current) {
    var diffType = current.diffType, properties = current.properties, attributes = current.attributes;
    if (!diffType || diffType === 'vdom') {
        return { properties: previous.properties, attributes: previous.attributes, events: previous.events };
    }
    else if (diffType === 'none') {
        return { properties: {}, attributes: previous.attributes ? {} : undefined, events: previous.events };
    }
    var newProperties = {
        properties: {}
    };
    if (attributes) {
        newProperties.attributes = {};
        newProperties.events = previous.events;
        Object.keys(properties).forEach(function (propName) {
            newProperties.properties[propName] = domNode[propName];
        });
        Object.keys(attributes).forEach(function (attrName) {
            newProperties.attributes[attrName] = domNode.getAttribute(attrName);
        });
        return newProperties;
    }
    newProperties.properties = Object.keys(properties).reduce(function (props, property) {
        props[property] = domNode.getAttribute(property) || domNode[property];
        return props;
    }, {});
    return newProperties;
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
function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions, onlyEvents) {
    if (onlyEvents === void 0) { onlyEvents = false; }
    var eventMap = projectionOptions.nodeMap.get(domNode);
    if (eventMap) {
        Object.keys(previousProperties).forEach(function (propName) {
            var isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
            var eventName = onlyEvents ? propName : propName.substr(2);
            if (isEvent && !properties[propName]) {
                var eventCallback = eventMap.get(previousProperties[propName]);
                if (eventCallback) {
                    domNode.removeEventListener(eventName, eventCallback);
                }
            }
        });
    }
}
function updateAttribute(domNode, attrName, attrValue, projectionOptions) {
    if (projectionOptions.namespace === NAMESPACE_SVG && attrName === 'href') {
        domNode.setAttributeNS(NAMESPACE_XLINK, attrName, attrValue);
    }
    else if ((attrName === 'role' && attrValue === '') || attrValue === undefined) {
        domNode.removeAttribute(attrName);
    }
    else {
        domNode.setAttribute(attrName, attrValue);
    }
}
function updateAttributes(domNode, previousAttributes, attributes, projectionOptions) {
    var attrNames = Object.keys(attributes);
    var attrCount = attrNames.length;
    for (var i = 0; i < attrCount; i++) {
        var attrName = attrNames[i];
        var attrValue = attributes[attrName];
        var previousAttrValue = previousAttributes[attrName];
        if (attrValue !== previousAttrValue) {
            updateAttribute(domNode, attrName, attrValue, projectionOptions);
        }
    }
}
function updateProperties(domNode, previousProperties, properties, projectionOptions, includesEventsAndAttributes) {
    if (includesEventsAndAttributes === void 0) { includesEventsAndAttributes = true; }
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
    includesEventsAndAttributes && removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions);
    for (var i = 0; i < propCount; i++) {
        var propName = propNames[i];
        var propValue = properties[propName];
        var previousValue = previousProperties[propName];
        if (propName === 'classes') {
            var previousClasses = Array.isArray(previousValue) ? previousValue : [previousValue];
            var currentClasses = Array.isArray(propValue) ? propValue : [propValue];
            if (previousClasses && previousClasses.length > 0) {
                if (!propValue || propValue.length === 0) {
                    for (var i_1 = 0; i_1 < previousClasses.length; i_1++) {
                        removeClasses(domNode, previousClasses[i_1]);
                    }
                }
                else {
                    var newClasses = tslib_1.__spread(currentClasses);
                    for (var i_2 = 0; i_2 < previousClasses.length; i_2++) {
                        var previousClassName = previousClasses[i_2];
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
                    for (var i_3 = 0; i_3 < newClasses.length; i_3++) {
                        addClasses(domNode, newClasses[i_3]);
                    }
                }
            }
            else {
                for (var i_4 = 0; i_4 < currentClasses.length; i_4++) {
                    addClasses(domNode, currentClasses[i_4]);
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
                var oldStyleValue = previousValue && previousValue[styleName];
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
            else if (propName !== 'key' && propValue !== previousValue) {
                var type = typeof propValue;
                if (type === 'function' && propName.lastIndexOf('on', 0) === 0 && includesEventsAndAttributes) {
                    updateEvent(domNode, propName.substr(2), propValue, projectionOptions, properties.bind, previousValue);
                }
                else if (type === 'string' && propName !== 'innerHTML' && includesEventsAndAttributes) {
                    updateAttribute(domNode, propName, propValue, projectionOptions);
                }
                else if (propName === 'scrollLeft' || propName === 'scrollTop') {
                    if (domNode[propName] !== propValue) {
                        domNode[propName] = propValue;
                    }
                }
                else {
                    domNode[propName] = propValue;
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
    if (dnode.attributes && dnode.events) {
        updateAttributes(domNode, {}, dnode.attributes, projectionOptions);
        updateProperties(domNode, {}, dnode.properties, projectionOptions, false);
        removeOrphanedEvents(domNode, {}, dnode.events, projectionOptions, true);
        var events_1 = dnode.events;
        Object.keys(events_1).forEach(function (event) {
            updateEvent(domNode, event, events_1[event], projectionOptions, dnode.properties.bind);
        });
    }
    else {
        updateProperties(domNode, {}, dnode.properties, projectionOptions);
    }
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
            if (dnode.domNode !== undefined && parentVNode.domNode) {
                var newDomNode = dnode.domNode.ownerDocument.createTextNode(dnode.text);
                if (parentVNode.domNode === dnode.domNode.parentNode) {
                    parentVNode.domNode.replaceChild(newDomNode, dnode.domNode);
                }
                else {
                    parentVNode.domNode.appendChild(newDomNode);
                    dnode.domNode.parentNode && dnode.domNode.parentNode.removeChild(dnode.domNode);
                }
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
        var domNode_2 = (dnode.domNode = previous.domNode);
        var textUpdated = false;
        var updated = false;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.text !== previous.text) {
                var newDomNode = domNode_2.ownerDocument.createTextNode(dnode.text);
                domNode_2.parentNode.replaceChild(newDomNode, domNode_2);
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
            var previousProperties_1 = buildPreviousProperties(domNode_2, previous, dnode);
            if (dnode.attributes && dnode.events) {
                updateAttributes(domNode_2, previousProperties_1.attributes, dnode.attributes, projectionOptions);
                updated =
                    updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions, false) || updated;
                removeOrphanedEvents(domNode_2, previousProperties_1.events, dnode.events, projectionOptions, true);
                var events_2 = dnode.events;
                Object.keys(events_2).forEach(function (event) {
                    updateEvent(domNode_2, event, events_2[event], projectionOptions, dnode.properties.bind, previousProperties_1.events[event]);
                });
            }
            else {
                updated =
                    updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions) ||
                        updated;
            }
            if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                var instanceData = exports.widgetInstanceMap.get(parentInstance);
                instanceData.nodeHandler.add(domNode_2, "" + dnode.properties.key);
            }
        }
        if (updated && dnode.properties && dnode.properties.updateAnimation) {
            dnode.properties.updateAnimation(domNode_2, dnode.properties, previous.properties);
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

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu-item/MenuItem.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js").default;

var defaultExport = widgetFactory.default;
defaultExport && registerCustomElement(defaultExport);



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
module.exports = {" _key":"test-app/menuItem","root":"sUmUi4Sh","item":"_2Mk6Rdqa","selected":"_1-f3ItOh"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTk2ODJiN2QwMGQ1OTkxOWVkYjkiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9sYW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2FycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGlmZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcz9hNTA3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUM3REE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw4Qjs7Ozs7Ozs7QUM1REE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsMkNBQTJDLEVBQUU7QUFDM0c7QUFDQTtBQUNBLHlEQUF5RCx5QkFBeUIsRUFBRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwwQjs7Ozs7Ozs7QUNqRkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxzRDs7Ozs7Ozs7dURDek9BO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFOzs7Ozs7Ozs7QUMxTUQ7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QSxtQkFBbUIsNkJBQTZCO0FBQ2hEO0FBQ0E7QUFDQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw4Qjs7Ozs7Ozs7QUM1Q0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQjs7Ozs7Ozs7QUN2SEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUJBQXFCO0FBQ3pEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0Esa0M7Ozs7Ozs7O0FDcEZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDRCQUE0QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxvQ0FBb0M7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUscUNBQXFDLEVBQUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw2Qjs7Ozs7Ozs7QUM3WUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7O0FDL0RBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsMkJBQTJCO0FBQ3JFLDhCQUE4QixzQkFBc0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxnREFBZ0Qs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OUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHNCQUFzQixxQ0FBcUM7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQ0FBa0Msa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHdCQUF3QjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsd0NBQXdDO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MseURBQXlEO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwyQ0FBMkMsd0JBQXdCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7OztBQzU0QkE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FB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O0lBQy9FLENBQUM7SUFFUywwQkFBTSxFQUFoQjtRQUNPLHdCQUFxQyxFQUFuQyxnQkFBSyxFQUFFLHNCQUFRO1FBRXZCLE9BQU8sS0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxFQUFFO1lBQ2pELEtBQUMsQ0FDQSxNQUFNLEVBQ047Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLEVBQUUsSUFBSSxDQUFDO2FBQ2QsRUFDRCxDQUFDLEtBQUssQ0FBQztTQUVSLENBQUM7SUFDSCxDQUFDO0lBbEJXLFNBQVE7UUFQcEIsNkJBQWEsQ0FBcUI7WUFDbEMsR0FBRyxFQUFFLGdCQUFnQjtZQUNyQixVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN0QixVQUFVLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVTtTQUMvQixDQUFDO1FBQ0QsY0FBSyxDQUFDLEdBQUc7T0FDRyxRQUFRLENBbUJwQjtJQUFELGVBQUM7Q0FuQkQsQ0FBOEIsb0JBQVcsQ0FBQyx1QkFBVSxDQUFDO0FBQXhDO0FBcUJiLGtCQUFlLFFBQVE7Ozs7Ozs7O0FDM0N2QjtBQUNBLGtCQUFrQix5RiIsImZpbGUiOiJtZW51LWl0ZW0tMS4wLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5OTY4MmI3ZDAwZDU5OTE5ZWRiOSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgbGFuZ18xID0gcmVxdWlyZShcIi4vbGFuZ1wiKTtcclxudmFyIFByb21pc2VfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1Byb21pc2VcIik7XHJcbi8qKlxyXG4gKiBObyBvcGVyYXRpb24gZnVuY3Rpb24gdG8gcmVwbGFjZSBvd24gb25jZSBpbnN0YW5jZSBpcyBkZXN0b3J5ZWRcclxuICovXHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZV8xLmRlZmF1bHQucmVzb2x2ZShmYWxzZSk7XHJcbn1cclxuLyoqXHJcbiAqIE5vIG9wIGZ1bmN0aW9uIHVzZWQgdG8gcmVwbGFjZSBvd24sIG9uY2UgaW5zdGFuY2UgaGFzIGJlZW4gZGVzdG9yeWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBkZXN0cm95ZWQoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGwgbWFkZSB0byBkZXN0cm95ZWQgbWV0aG9kJyk7XHJcbn1cclxudmFyIERlc3Ryb3lhYmxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGVzdHJveWFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVzID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gYHRoaXMuZGVzdHJveWAgaXMgY2FsbGVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIYW5kbGV9IGhhbmRsZSBUaGUgaGFuZGxlIHRvIGFkZCBmb3IgdGhlIGluc3RhbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7SGFuZGxlfSBhIGhhbmRsZSBmb3IgdGhlIGhhbmRsZSwgcmVtb3ZlcyB0aGUgaGFuZGxlIGZvciB0aGUgaW5zdGFuY2UgYW5kIGNhbGxzIGRlc3Ryb3lcclxuICAgICAqL1xyXG4gICAgRGVzdHJveWFibGUucHJvdG90eXBlLm93biA9IGZ1bmN0aW9uIChoYW5kbGVzKSB7XHJcbiAgICAgICAgdmFyIGhhbmRsZSA9IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgPyBsYW5nXzEuY3JlYXRlQ29tcG9zaXRlSGFuZGxlLmFwcGx5KHZvaWQgMCwgdHNsaWJfMS5fX3NwcmVhZChoYW5kbGVzKSkgOiBoYW5kbGVzO1xyXG4gICAgICAgIHZhciBfaGFuZGxlcyA9IHRoaXMuaGFuZGxlcztcclxuICAgICAgICBfaGFuZGxlcy5wdXNoKGhhbmRsZSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX2hhbmRsZXMuc3BsaWNlKF9oYW5kbGVzLmluZGV4T2YoaGFuZGxlKSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgaGFuZGxlcyBoYXZlIGJlZW4gZGVzdHJveWVkXHJcbiAgICAgKi9cclxuICAgIERlc3Ryb3lhYmxlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlXzEuZGVmYXVsdChmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5oYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlICYmIGhhbmRsZS5kZXN0cm95ICYmIGhhbmRsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBfdGhpcy5kZXN0cm95ID0gbm9vcDtcclxuICAgICAgICAgICAgX3RoaXMub3duID0gZGVzdHJveWVkO1xyXG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEZXN0cm95YWJsZTtcclxufSgpKTtcclxuZXhwb3J0cy5EZXN0cm95YWJsZSA9IERlc3Ryb3lhYmxlO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEZXN0cm95YWJsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxudmFyIERlc3Ryb3lhYmxlXzEgPSByZXF1aXJlKFwiLi9EZXN0cm95YWJsZVwiKTtcclxuLyoqXHJcbiAqIE1hcCBvZiBjb21wdXRlZCByZWd1bGFyIGV4cHJlc3Npb25zLCBrZXllZCBieSBzdHJpbmdcclxuICovXHJcbnZhciByZWdleE1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSBldmVudCB0eXBlIGdsb2IgaGFzIGJlZW4gbWF0Y2hlZFxyXG4gKlxyXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcclxuICovXHJcbmZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmcsIHRhcmdldFN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcclxuICAgICAgICB2YXIgcmVnZXggPSB2b2lkIDA7XHJcbiAgICAgICAgaWYgKHJlZ2V4TWFwLmhhcyhnbG9iU3RyaW5nKSkge1xyXG4gICAgICAgICAgICByZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cIiArIGdsb2JTdHJpbmcucmVwbGFjZSgvXFwqL2csICcuKicpICsgXCIkXCIpO1xyXG4gICAgICAgICAgICByZWdleE1hcC5zZXQoZ2xvYlN0cmluZywgcmVnZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh0YXJnZXRTdHJpbmcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmlzR2xvYk1hdGNoID0gaXNHbG9iTWF0Y2g7XHJcbi8qKlxyXG4gKiBFdmVudCBDbGFzc1xyXG4gKi9cclxudmFyIEV2ZW50ZWQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhFdmVudGVkLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRXZlbnRlZCgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBfdGhpcy5saXN0ZW5lcnNNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzTWFwLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZHMsIHR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKGlzR2xvYk1hdGNoKHR5cGUsIGV2ZW50LnR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKF90aGlzLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcikpIHtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZXNfMSA9IGxpc3RlbmVyLm1hcChmdW5jdGlvbiAobGlzdGVuZXIpIHsgcmV0dXJuIF90aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXNfMS5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHsgcmV0dXJuIGhhbmRsZS5kZXN0cm95KCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgfTtcclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLl9hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAuc2V0KHR5cGUsIGxpc3RlbmVycyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IF90aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFdmVudGVkO1xyXG59KERlc3Ryb3lhYmxlXzEuRGVzdHJveWFibGUpKTtcclxuZXhwb3J0cy5FdmVudGVkID0gRXZlbnRlZDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRXZlbnRlZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgb2JqZWN0XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9vYmplY3RcIik7XHJcbnZhciBvYmplY3RfMiA9IHJlcXVpcmUoXCJAZG9qby9zaGltL29iamVjdFwiKTtcclxuZXhwb3J0cy5hc3NpZ24gPSBvYmplY3RfMi5hc3NpZ247XHJcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcclxuLyoqXHJcbiAqIFR5cGUgZ3VhcmQgdGhhdCBlbnN1cmVzIHRoYXQgdGhlIHZhbHVlIGNhbiBiZSBjb2VyY2VkIHRvIE9iamVjdFxyXG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY2hlY2sgaWYgd2Ugd2FudCB0byBkZWVwIGNvcHkgYW4gb2JqZWN0IG9yIG5vdC5cclxuICogTm90ZTogSW4gRVM2IGl0IGlzIHBvc3NpYmxlIHRvIG1vZGlmeSBhbiBvYmplY3QncyBTeW1ib2wudG9TdHJpbmdUYWcgcHJvcGVydHksIHdoaWNoIHdpbGxcclxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxyXG4gKiBzbyBpdCBpcyBub3QgaGFuZGxlZCBoZXJlLlxyXG4gKiBAcGFyYW0gIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuZnVuY3Rpb24gY29weUFycmF5KGFycmF5LCBpbmhlcml0ZWQpIHtcclxuICAgIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29weUFycmF5KGl0ZW0sIGluaGVyaXRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSlcclxuICAgICAgICAgICAgPyBpdGVtXHJcbiAgICAgICAgICAgIDogX21peGluKHtcclxuICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmhlcml0ZWQ6IGluaGVyaXRlZCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZXM6IFtpdGVtXSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDoge31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBfbWl4aW4oa3dBcmdzKSB7XHJcbiAgICB2YXIgZGVlcCA9IGt3QXJncy5kZWVwO1xyXG4gICAgdmFyIGluaGVyaXRlZCA9IGt3QXJncy5pbmhlcml0ZWQ7XHJcbiAgICB2YXIgdGFyZ2V0ID0ga3dBcmdzLnRhcmdldDtcclxuICAgIHZhciBjb3BpZWQgPSBrd0FyZ3MuY29waWVkIHx8IFtdO1xyXG4gICAgdmFyIGNvcGllZENsb25lID0gdHNsaWJfMS5fX3NwcmVhZChjb3BpZWQpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrd0FyZ3Muc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSBrd0FyZ3Muc291cmNlc1tpXTtcclxuICAgICAgICBpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvcGllZENsb25lLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGRlZXApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb3B5QXJyYXkodmFsdWUsIGluaGVyaXRlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VmFsdWUgPSB0YXJnZXRba2V5XSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29waWVkLnB1c2goc291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfbWl4aW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZDogaW5oZXJpdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlczogW3ZhbHVlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3BpZWQ6IGNvcGllZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlKSB7XHJcbiAgICB2YXIgbWl4aW5zID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIG1peGluc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIGlmICghbWl4aW5zLmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsYW5nLmNyZWF0ZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgbWl4aW4gb2JqZWN0LicpO1xyXG4gICAgfVxyXG4gICAgdmFyIGFyZ3MgPSBtaXhpbnMuc2xpY2UoKTtcclxuICAgIGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xyXG4gICAgcmV0dXJuIG9iamVjdF8xLmFzc2lnbi5hcHBseShudWxsLCBhcmdzKTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcclxuZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgIGluaGVyaXRlZDogZmFsc2UsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kZWVwQXNzaWduID0gZGVlcEFzc2lnbjtcclxuZnVuY3Rpb24gZGVlcE1peGluKHRhcmdldCkge1xyXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc291cmNlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBfbWl4aW4oe1xyXG4gICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgaW5oZXJpdGVkOiB0cnVlLFxyXG4gICAgICAgIHNvdXJjZXM6IHNvdXJjZXMsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVlcE1peGluID0gZGVlcE1peGluO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cclxuICogZGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHZhbHVlcyBpbnRvIHRoZSBuZXcgdGFyZ2V0LlxyXG4gKlxyXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXHJcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGR1cGxpY2F0ZShzb3VyY2UpIHtcclxuICAgIHZhciB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpKTtcclxuICAgIHJldHVybiBkZWVwTWl4aW4odGFyZ2V0LCBzb3VyY2UpO1xyXG59XHJcbmV4cG9ydHMuZHVwbGljYXRlID0gZHVwbGljYXRlO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSBiIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZTsgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0lkZW50aWNhbChhLCBiKSB7XHJcbiAgICByZXR1cm4gKGEgPT09IGIgfHxcclxuICAgICAgICAvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXHJcbiAgICAgICAgKGEgIT09IGEgJiYgYiAhPT0gYikpO1xyXG59XHJcbmV4cG9ydHMuaXNJZGVudGljYWwgPSBpc0lkZW50aWNhbDtcclxuLyoqXHJcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xyXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cclxuICogQXMgYSByZXN1bHQsIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBgbGF0ZUJpbmRgIHdpbGwgYWx3YXlzIGNhbGwgdGhlIGZ1bmN0aW9uIGN1cnJlbnRseSBhc3NpZ25lZCB0b1xyXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgY29udGV4dCBvYmplY3RcclxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxyXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcclxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGxhdGVCaW5kKGluc3RhbmNlLCBtZXRob2QpIHtcclxuICAgIHZhciBzdXBwbGllZEFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc3VwcGxpZWRBcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGhcclxuICAgICAgICA/IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xyXG4gICAgICAgICAgICAvLyBUUzcwMTdcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gVFM3MDE3XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbn1cclxuZXhwb3J0cy5sYXRlQmluZCA9IGxhdGVCaW5kO1xyXG5mdW5jdGlvbiBtaXhpbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiBmYWxzZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IHRydWUsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5taXhpbiA9IG1peGluO1xyXG4vKipcclxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXHJcbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcclxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxyXG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcGFydGlhbCh0YXJnZXRGdW5jdGlvbikge1xyXG4gICAgdmFyIHN1cHBsaWVkQXJncyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzdXBwbGllZEFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcclxuICAgICAgICByZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMucGFydGlhbCA9IHBhcnRpYWw7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgZGVzdHJveSBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIGNhbGxzIHRoZSBwYXNzZWQtaW4gZGVzdHJ1Y3Rvci5cclxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cclxuICpcclxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxyXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICAgICAgZGVzdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVIYW5kbGUgPSBjcmVhdGVIYW5kbGU7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cclxuICpcclxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXHJcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSgpIHtcclxuICAgIHZhciBoYW5kbGVzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIGhhbmRsZXNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoYW5kbGVzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSA9IGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XHJcbn1cclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgcmVzdWx0cyBvZiBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnRzLnRlc3RDYWNoZSA9IHt9O1xyXG4vKipcclxuICogQSBjYWNoZSBvZiB0aGUgdW4tcmVzb2x2ZWQgZmVhdHVyZSB0ZXN0c1xyXG4gKi9cclxuZXhwb3J0cy50ZXN0RnVuY3Rpb25zID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHVucmVzb2x2ZWQgdGhlbmFibGVzIChwcm9iYWJseSBwcm9taXNlcylcclxuICogQHR5cGUge3t9fVxyXG4gKi9cclxudmFyIHRlc3RUaGVuYWJsZXMgPSB7fTtcclxuLyoqXHJcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUgKGB3aW5kb3dgIGluIGEgYnJvd3NlciwgYGdsb2JhbGAgaW4gTm9kZUpTKVxyXG4gKi9cclxudmFyIGdsb2JhbFNjb3BlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBCcm93c2Vyc1xyXG4gICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIE5vZGVcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gV2ViIHdvcmtlcnNcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4ge307XHJcbn0pKCk7XHJcbi8qIEdyYWIgdGhlIHN0YXRpY0ZlYXR1cmVzIGlmIHRoZXJlIGFyZSBhdmFpbGFibGUgKi9cclxudmFyIHN0YXRpY0ZlYXR1cmVzID0gKGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudCB8fCB7fSkuc3RhdGljRmVhdHVyZXM7XHJcbi8qIENsZWFuaW5nIHVwIHRoZSBEb2pvSGFzRW52aW9ybm1lbnQgKi9cclxuaWYgKCdEb2pvSGFzRW52aXJvbm1lbnQnIGluIGdsb2JhbFNjb3BlKSB7XHJcbiAgICBkZWxldGUgZ2xvYmFsU2NvcGUuRG9qb0hhc0Vudmlyb25tZW50O1xyXG59XHJcbi8qKlxyXG4gKiBDdXN0b20gdHlwZSBndWFyZCB0byBuYXJyb3cgdGhlIGBzdGF0aWNGZWF0dXJlc2AgdG8gZWl0aGVyIGEgbWFwIG9yIGEgZnVuY3Rpb24gdGhhdFxyXG4gKiByZXR1cm5zIGEgbWFwLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGZvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuLyoqXHJcbiAqIFRoZSBjYWNoZSBvZiBhc3NlcnRlZCBmZWF0dXJlcyB0aGF0IHdlcmUgYXZhaWxhYmxlIGluIHRoZSBnbG9iYWwgc2NvcGUgd2hlbiB0aGVcclxuICogbW9kdWxlIGxvYWRlZFxyXG4gKi9cclxudmFyIHN0YXRpY0NhY2hlID0gc3RhdGljRmVhdHVyZXNcclxuICAgID8gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24oc3RhdGljRmVhdHVyZXMpID8gc3RhdGljRmVhdHVyZXMuYXBwbHkoZ2xvYmFsU2NvcGUpIDogc3RhdGljRmVhdHVyZXNcclxuICAgIDoge307LyogUHJvdmlkaW5nIGFuIGVtcHR5IGNhY2hlLCBpZiBub25lIHdhcyBpbiB0aGUgZW52aXJvbm1lbnRcclxuXHJcbi8qKlxyXG4qIEFNRCBwbHVnaW4gZnVuY3Rpb24uXHJcbipcclxuKiBDb25kaXRpb25hbCBsb2FkcyBtb2R1bGVzIGJhc2VkIG9uIGEgaGFzIGZlYXR1cmUgdGVzdCB2YWx1ZS5cclxuKlxyXG4qIEBwYXJhbSByZXNvdXJjZUlkIEdpdmVzIHRoZSByZXNvbHZlZCBtb2R1bGUgaWQgdG8gbG9hZC5cclxuKiBAcGFyYW0gcmVxdWlyZSBUaGUgbG9hZGVyIHJlcXVpcmUgZnVuY3Rpb24gd2l0aCByZXNwZWN0IHRvIHRoZSBtb2R1bGUgdGhhdCBjb250YWluZWQgdGhlIHBsdWdpbiByZXNvdXJjZSBpbiBpdHNcclxuKiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5IGxpc3QuXHJcbiogQHBhcmFtIGxvYWQgQ2FsbGJhY2sgdG8gbG9hZGVyIHRoYXQgY29uc3VtZXMgcmVzdWx0IG9mIHBsdWdpbiBkZW1hbmQuXHJcbiovXHJcbmZ1bmN0aW9uIGxvYWQocmVzb3VyY2VJZCwgcmVxdWlyZSwgbG9hZCwgY29uZmlnKSB7XHJcbiAgICByZXNvdXJjZUlkID8gcmVxdWlyZShbcmVzb3VyY2VJZF0sIGxvYWQpIDogbG9hZCgpO1xyXG59XHJcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XHJcbi8qKlxyXG4gKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBSZXNvbHZlcyByZXNvdXJjZUlkIGludG8gYSBtb2R1bGUgaWQgYmFzZWQgb24gcG9zc2libHktbmVzdGVkIHRlbmFyeSBleHByZXNzaW9uIHRoYXQgYnJhbmNoZXMgb24gaGFzIGZlYXR1cmUgdGVzdFxyXG4gKiB2YWx1ZShzKS5cclxuICpcclxuICogQHBhcmFtIHJlc291cmNlSWQgVGhlIGlkIG9mIHRoZSBtb2R1bGVcclxuICogQHBhcmFtIG5vcm1hbGl6ZSBSZXNvbHZlcyBhIHJlbGF0aXZlIG1vZHVsZSBpZCBpbnRvIGFuIGFic29sdXRlIG1vZHVsZSBpZFxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplKHJlc291cmNlSWQsIG5vcm1hbGl6ZSkge1xyXG4gICAgdmFyIHRva2VucyA9IHJlc291cmNlSWQubWF0Y2goL1tcXD86XXxbXjpcXD9dKi9nKSB8fCBbXTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZ1bmN0aW9uIGdldChza2lwKSB7XHJcbiAgICAgICAgdmFyIHRlcm0gPSB0b2tlbnNbaSsrXTtcclxuICAgICAgICBpZiAodGVybSA9PT0gJzonKSB7XHJcbiAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZyBtb2R1bGUgbmFtZSwgcmVzb2x2ZXMgdG8gbnVsbFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHBvc3RmaXhlZCB3aXRoIGEgPyBtZWFucyBpdCBpcyBhIGZlYXR1cmUgdG8gYnJhbmNoIG9uLCB0aGUgdGVybSBpcyB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gICAgICAgICAgICBpZiAodG9rZW5zW2krK10gPT09ICc/Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFza2lwICYmIGhhcyh0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoZWQgdGhlIGZlYXR1cmUsIGdldCB0aGUgZmlyc3QgdmFsdWUgZnJvbSB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpZCBub3QgbWF0Y2gsIGdldCB0aGUgc2Vjb25kIHZhbHVlLCBwYXNzaW5nIG92ZXIgdGhlIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoc2tpcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYSBtb2R1bGVcclxuICAgICAgICAgICAgcmV0dXJuIHRlcm07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGlkID0gZ2V0KCk7XHJcbiAgICByZXR1cm4gaWQgJiYgbm9ybWFsaXplKGlkKTtcclxufVxyXG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcclxuLyoqXHJcbiAqIENoZWNrIGlmIGEgZmVhdHVyZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICovXHJcbmZ1bmN0aW9uIGV4aXN0cyhmZWF0dXJlKSB7XHJcbiAgICB2YXIgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICByZXR1cm4gQm9vbGVhbihub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSB8fCBub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSB8fCBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKTtcclxufVxyXG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcclxuLyoqXHJcbiAqIFJlZ2lzdGVyIGEgbmV3IHRlc3QgZm9yIGEgbmFtZWQgZmVhdHVyZS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogaGFzLmFkZCgnZG9tLWFkZGV2ZW50bGlzdGVuZXInLCAhIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpO1xyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBoYXMuYWRkKCd0b3VjaC1ldmVudHMnLCBmdW5jdGlvbiAoKSB7XHJcbiAqICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudFxyXG4gKiB9KTtcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSByZXBvcnRlZCBvZiB0aGUgZmVhdHVyZSwgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgb25jZSBvbiBmaXJzdCB0ZXN0XHJcbiAqIEBwYXJhbSBvdmVyd3JpdGUgaWYgYW4gZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGJlIG92ZXJ3cml0dGVuLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICovXHJcbmZ1bmN0aW9uIGFkZChmZWF0dXJlLCB2YWx1ZSwgb3ZlcndyaXRlKSB7XHJcbiAgICBpZiAob3ZlcndyaXRlID09PSB2b2lkIDApIHsgb3ZlcndyaXRlID0gZmFsc2U7IH1cclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChleGlzdHMobm9ybWFsaXplZEZlYXR1cmUpICYmICFvdmVyd3JpdGUgJiYgIShub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmVhdHVyZSBcXFwiXCIgKyBmZWF0dXJlICsgXCJcXFwiIGV4aXN0cyBhbmQgb3ZlcndyaXRlIG5vdCB0cnVlLlwiKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0ZlYXR1cmVUZXN0VGhlbmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXSA9IHZhbHVlLnRoZW4oZnVuY3Rpb24gKHJlc29sdmVkVmFsdWUpIHtcclxuICAgICAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbZmVhdHVyZV0gPSByZXNvbHZlZFZhbHVlO1xyXG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hZGQgPSBhZGQ7XHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgbmFtZSAoaWYgYSBzdHJpbmcpIG9yIGlkZW50aWZpZXIgKGlmIGFuIGludGVnZXIpIG9mIHRoZSBmZWF0dXJlIHRvIHRlc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXMoZmVhdHVyZSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXRpY0NhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBleHBvcnRzLnRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV0gPSBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdLmNhbGwobnVsbCk7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGV4cG9ydHMudGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZlYXR1cmUgaW4gdGVzdFRoZW5hYmxlcykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBdHRlbXB0IHRvIGRldGVjdCB1bnJlZ2lzdGVyZWQgaGFzIGZlYXR1cmUgXFxcIlwiICsgZmVhdHVyZSArIFwiXFxcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzO1xyXG4vKlxyXG4gKiBPdXQgb2YgdGhlIGJveCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG4vKiBFbnZpcm9ubWVudHMgKi9cclxuLyogVXNlZCBhcyBhIHZhbHVlIHRvIHByb3ZpZGUgYSBkZWJ1ZyBvbmx5IGNvZGUgcGF0aCAqL1xyXG5hZGQoJ2RlYnVnJywgdHJ1ZSk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGlzIFwiYnJvd3NlciBsaWtlXCIgKi9cclxuYWRkKCdob3N0LWJyb3dzZXInLCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpO1xyXG4vKiBEZXRlY3RzIGlmIHRoZSBlbnZpcm9ubWVudCBhcHBlYXJzIHRvIGJlIE5vZGVKUyAqL1xyXG5hZGQoJ2hvc3Qtbm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIG9iamVjdF8xID0gcmVxdWlyZShcIi4vb2JqZWN0XCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG5leHBvcnRzLk1hcCA9IGdsb2JhbF8xLmRlZmF1bHQuTWFwO1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1tYXAnKSkge1xyXG4gICAgZXhwb3J0cy5NYXAgPSAoX2EgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE1hcChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnTWFwJztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8xXzEgJiYgIWl0ZXJhYmxlXzFfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzEucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBBbiBhbHRlcm5hdGl2ZSB0byBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB1c2luZyBPYmplY3QuaXNcclxuICAgICAgICAgICAgICogdG8gY2hlY2sgZm9yIGVxdWFsaXR5LiBTZWUgaHR0cDovL216bC5sYS8xenVLTzJWXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLl9pbmRleE9mS2V5ID0gZnVuY3Rpb24gKGtleXMsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8xID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGhfMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF8xLmlzKGtleXNbaV0sIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgXCJzaXplXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5sZW5ndGggPSB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLl9rZXlzLm1hcChmdW5jdGlvbiAoa2V5LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIF90aGlzLl92YWx1ZXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoXzI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogdGhpcy5fdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpID4gLTE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fa2V5cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXggPCAwID8gdGhpcy5fa2V5cy5sZW5ndGggOiBpbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbaW5kZXhdID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbnRyaWVzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBNYXA7XHJcbiAgICAgICAgfSgpKSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBfYSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5NYXA7XHJcbnZhciBfYTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvcXVldWVcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbmV4cG9ydHMuU2hpbVByb21pc2UgPSBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2U7XHJcbmV4cG9ydHMuaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcclxufTtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtcHJvbWlzZScpKSB7XHJcbiAgICBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2UgPSBleHBvcnRzLlNoaW1Qcm9taXNlID0gKF9hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBQcm9taXNlLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHBhcmFtIGV4ZWN1dG9yXHJcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgd2hlbiB0aGUgUHJvbWlzZSBpcyBpbnN0YW50aWF0ZWQuIEl0IGlzIHJlc3BvbnNpYmxlIGZvclxyXG4gICAgICAgICAgICAgKiBzdGFydGluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGVuIGl0IGlzIGludm9rZWQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBtdXN0IGNhbGwgZWl0aGVyIHRoZSBwYXNzZWQgYHJlc29sdmVgIGZ1bmN0aW9uIHdoZW4gdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZFxyXG4gICAgICAgICAgICAgKiBzdWNjZXNzZnVsbHksIG9yIHRoZSBgcmVqZWN0YCBmdW5jdGlvbiB3aGVuIHRoZSBvcGVyYXRpb24gZmFpbHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAxIC8qIFBlbmRpbmcgKi87XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnUHJvbWlzZSc7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIElmIHRydWUsIHRoZSByZXNvbHV0aW9uIG9mIHRoaXMgcHJvbWlzZSBpcyBjaGFpbmVkIChcImxvY2tlZCBpblwiKSB0byBhbm90aGVyIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBpc0NoYWluZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogV2hldGhlciBvciBub3QgdGhpcyBwcm9taXNlIGlzIGluIGEgcmVzb2x2ZWQgc3RhdGUuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBpc1Jlc29sdmVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovIHx8IGlzQ2hhaW5lZDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkIG9uY2UgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJbml0aWFsbHkgcHVzaGVzIGNhbGxiYWNrcyBvbnRvIGEgcXVldWUgZm9yIGV4ZWN1dGlvbiBvbmNlIHRoaXMgcHJvbWlzZSBzZXR0bGVzLiBBZnRlciB0aGUgcHJvbWlzZSBzZXR0bGVzLFxyXG4gICAgICAgICAgICAgICAgICogZW5xdWV1ZXMgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgZXZlbnQgbG9vcCB0dXJuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgd2hlbkZpbmlzaGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2V0dGxlcyB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBzZXR0bGUgPSBmdW5jdGlvbiAobmV3U3RhdGUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuc3RhdGUgIT09IDEgLyogUGVuZGluZyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnN0YXRlID0gbmV3U3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzb2x2ZWRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoZW5GaW5pc2hlZCA9IHF1ZXVlXzEucXVldWVNaWNyb1Rhc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBlbnF1ZXVlIGEgY2FsbGJhY2sgcnVubmVyIGlmIHRoZXJlIGFyZSBjYWxsYmFja3Mgc28gdGhhdCBpbml0aWFsbHkgZnVsZmlsbGVkIFByb21pc2VzIGRvbid0IGhhdmUgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZV8xLnF1ZXVlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY291bnQgPSBjYWxsYmFja3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3NbaV0uY2FsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIChuZXdTdGF0ZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXNvbHZlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNUaGVuYWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbihzZXR0bGUuYmluZChudWxsLCAwIC8qIEZ1bGZpbGxlZCAqLyksIHNldHRsZS5iaW5kKG51bGwsIDIgLyogUmVqZWN0ZWQgKi8pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGFpbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRsZShuZXdTdGF0ZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuRmluaXNoZWQgaW5pdGlhbGx5IHF1ZXVlcyB1cCBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBhZnRlciB0aGUgcHJvbWlzZSBoYXMgc2V0dGxlZC4gT25jZSB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvbWlzZSBoYXMgc2V0dGxlZCwgd2hlbkZpbmlzaGVkIHdpbGwgc2NoZWR1bGUgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgdHVybiB0aHJvdWdoIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVudCBsb29wLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuRmluaXNoZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gX3RoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8gPyBvblJlamVjdGVkIDogb25GdWxmaWxsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxsYmFjayhfdGhpcy5yZXNvbHZlZFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLnN0YXRlID09PSAyIC8qIFJlamVjdGVkICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KF90aGlzLnJlc29sdmVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShfdGhpcy5yZXNvbHZlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCByZXNvbHZlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlKDIgLyogUmVqZWN0ZWQgKi8sIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBQcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3B1bGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrY29tcGxldGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5pc2goKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3B1bGF0aW5nIHx8IGNvbXBsZXRlIDwgdG90YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NJdGVtKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHBvcnRzLmlzVGhlbmFibGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGFuIGl0ZW0gUHJvbWlzZSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NJdGVtKGksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8yID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzJfMSA9IGl0ZXJhYmxlXzIubmV4dCgpOyAhaXRlcmFibGVfMl8xLmRvbmU7IGl0ZXJhYmxlXzJfMSA9IGl0ZXJhYmxlXzIubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZXJhYmxlXzJfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMl8xICYmICFpdGVyYWJsZV8yXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8yLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZV8yLCBfYTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlO1xyXG4gICAgICAgIH0oKSksXHJcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gZXhwb3J0cy5TaGltUHJvbWlzZSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TaGltUHJvbWlzZTtcclxudmFyIF9hO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vUHJvbWlzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvdXRpbFwiKTtcclxuZXhwb3J0cy5TeW1ib2wgPSBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJykpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cclxuICAgICAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAgICAgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3NcclxuICAgICAqL1xyXG4gICAgdmFyIHZhbGlkYXRlU3ltYm9sXzEgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnRpZXNfMSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xyXG4gICAgdmFyIGRlZmluZVByb3BlcnR5XzEgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICB2YXIgY3JlYXRlXzEgPSBPYmplY3QuY3JlYXRlO1xyXG4gICAgdmFyIG9ialByb3RvdHlwZV8xID0gT2JqZWN0LnByb3RvdHlwZTtcclxuICAgIHZhciBnbG9iYWxTeW1ib2xzXzEgPSB7fTtcclxuICAgIHZhciBnZXRTeW1ib2xOYW1lXzEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjcmVhdGVkID0gY3JlYXRlXzEobnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXNjKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3N0Zml4ID0gMDtcclxuICAgICAgICAgICAgdmFyIG5hbWU7XHJcbiAgICAgICAgICAgIHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcclxuICAgICAgICAgICAgICAgICsrcG9zdGZpeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcclxuICAgICAgICAgICAgY3JlYXRlZFtkZXNjXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG5hbWUgPSAnQEAnICsgZGVzYztcclxuICAgICAgICAgICAgLy8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXHJcbiAgICAgICAgICAgIC8vIHBpbm5lZCBkb3duLlxyXG4gICAgICAgICAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlXzEsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eV8xKG9ialByb3RvdHlwZV8xLCBuYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHlfMSh0aGlzLCBuYW1lLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICB2YXIgSW50ZXJuYWxTeW1ib2xfMSA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgSW50ZXJuYWxTeW1ib2xfMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLlN5bWJvbCA9IGdsb2JhbF8xLmRlZmF1bHQuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUpO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydGllc18xKHN5bSwge1xyXG4gICAgICAgICAgICBfX2Rlc2NyaXB0aW9uX186IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICBfX25hbWVfXzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lXzEoZGVzY3JpcHRpb24pKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wgZnVuY3Rpb24gd2l0aCB0aGUgYXBwcm9wcmlhdGUgcHJvcGVydGllcyAqL1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbCwgJ2ZvcicsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsU3ltYm9sc18xW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoZ2xvYmFsU3ltYm9sc18xW2tleV0gPSBleHBvcnRzLlN5bWJvbChTdHJpbmcoa2V5KSkpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydGllc18xKGV4cG9ydHMuU3ltYm9sLCB7XHJcbiAgICAgICAga2V5Rm9yOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uIChzeW0pIHtcclxuICAgICAgICAgICAgdmFyIGtleTtcclxuICAgICAgICAgICAgdmFsaWRhdGVTeW1ib2xfMShzeW0pO1xyXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzXzEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTeW1ib2xzXzFba2V5XSA9PT0gc3ltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGhhc0luc3RhbmNlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpc0NvbmNhdFNwcmVhZGFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBpdGVyYXRvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgbWF0Y2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIG9ic2VydmFibGU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgcmVwbGFjZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzZWFyY2g6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzcGVjaWVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNwbGl0OiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB0b1ByaW1pdGl2ZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdG9TdHJpbmdUYWc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHVuc2NvcGFibGVzOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgfSk7XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbCksXHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX25hbWVfXztcclxuICAgICAgICB9LCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlLCB7XHJcbiAgICAgICAgdG9TdHJpbmc6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sXzEodGhpcykuX19kZXNjcmlwdGlvbl9fICsgJyknO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHZhbHVlT2Y6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2xfMSh0aGlzKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9QcmltaXRpdmUsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVN5bWJvbF8xKHRoaXMpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbC5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvUHJpbWl0aXZlLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZVtleHBvcnRzLlN5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9TdHJpbmdUYWcsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlW2V4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbn1cclxuLyoqXHJcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XHJcbiAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcclxuICovXHJcbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XHJcbn1cclxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xyXG4vKipcclxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGVtXHJcbiAqL1xyXG5bXHJcbiAgICAnaGFzSW5zdGFuY2UnLFxyXG4gICAgJ2lzQ29uY2F0U3ByZWFkYWJsZScsXHJcbiAgICAnaXRlcmF0b3InLFxyXG4gICAgJ3NwZWNpZXMnLFxyXG4gICAgJ3JlcGxhY2UnLFxyXG4gICAgJ3NlYXJjaCcsXHJcbiAgICAnc3BsaXQnLFxyXG4gICAgJ21hdGNoJyxcclxuICAgICd0b1ByaW1pdGl2ZScsXHJcbiAgICAndG9TdHJpbmdUYWcnLFxyXG4gICAgJ3Vuc2NvcGFibGVzJyxcclxuICAgICdvYnNlcnZhYmxlJ1xyXG5dLmZvckVhY2goZnVuY3Rpb24gKHdlbGxLbm93bikge1xyXG4gICAgaWYgKCFleHBvcnRzLlN5bWJvbFt3ZWxsS25vd25dKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMuU3ltYm9sLCB3ZWxsS25vd24sIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5TeW1ib2w7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuZXhwb3J0cy5XZWFrTWFwID0gZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwO1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi13ZWFrbWFwJykpIHtcclxuICAgIHZhciBERUxFVEVEXzEgPSB7fTtcclxuICAgIHZhciBnZXRVSURfMSA9IGZ1bmN0aW9uIGdldFVJRCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKTtcclxuICAgIH07XHJcbiAgICB2YXIgZ2VuZXJhdGVOYW1lXzEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdGFydElkID0gTWF0aC5mbG9vcihEYXRlLm5vdygpICUgMTAwMDAwMDAwKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ19fd20nICsgZ2V0VUlEXzEoKSArIChzdGFydElkKysgKyAnX18nKTtcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuICAgIGV4cG9ydHMuV2Vha01hcCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBXZWFrTWFwKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdXZWFrTWFwJztcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbmFtZScsIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0ZU5hbWVfMSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XHJcbiAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSB0c2xpYl8xLl9fcmVhZChpdGVyYWJsZV8xXzEudmFsdWUsIDIpLCBrZXkgPSBfYVswXSwgdmFsdWUgPSBfYVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2IgPSBpdGVyYWJsZV8xLnJldHVybikpIF9iLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZV8xLCBfYjtcclxuICAgICAgICB9XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuX2dldEZyb3plbkVudHJ5SW5kZXggPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZnJvemVuRW50cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Zyb3plbkVudHJpZXNbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS52YWx1ZSA9IERFTEVURURfMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cnkudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb3plbkVudHJpZXNbZnJvemVuSW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChCb29sZWFuKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEXzEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWtleSB8fCAodHlwZW9mIGtleSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghZW50cnkgfHwgZW50cnkua2V5ICE9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB7IHZhbHVlOiBrZXkgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtleSwgdGhpcy5fbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZW50cnlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBXZWFrTWFwO1xyXG4gICAgfSgpKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLldlYWtNYXA7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1dlYWtNYXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgbnVtYmVyXzEgPSByZXF1aXJlKFwiLi9udW1iZXJcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC91dGlsXCIpO1xyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM2LWFycmF5JykgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LWFycmF5LWZpbGwnKSkge1xyXG4gICAgZXhwb3J0cy5mcm9tID0gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5mcm9tO1xyXG4gICAgZXhwb3J0cy5vZiA9IGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkub2Y7XHJcbiAgICBleHBvcnRzLmNvcHlXaXRoaW4gPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKTtcclxuICAgIGV4cG9ydHMuZmlsbCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmZpbGwpO1xyXG4gICAgZXhwb3J0cy5maW5kID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmluZCk7XHJcbiAgICBleHBvcnRzLmZpbmRJbmRleCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvLyBJdCBpcyBvbmx5IG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaS9pT1MgdGhhdCBoYXZlIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24gYW5kIHNvIGFyZW4ndCBpbiB0aGUgd2lsZFxyXG4gICAgLy8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcclxuICAgICAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXHJcbiAgICAgKi9cclxuICAgIHZhciB0b0xlbmd0aF8xID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgbnVtYmVyXzEuTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGcm9tIEVTNiA3LjEuNCBUb0ludGVnZXIoKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcclxuICAgICAqIEByZXR1cm4gQW4gaW50ZWdlclxyXG4gICAgICovXHJcbiAgICB2YXIgdG9JbnRlZ2VyXzEgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAwIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKHZhbHVlID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBOb3JtYWxpemVzIGFuIG9mZnNldCBhZ2FpbnN0IGEgZ2l2ZW4gbGVuZ3RoLCB3cmFwcGluZyBpdCBpZiBuZWdhdGl2ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9yaWdpbmFsIG9mZnNldFxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgdG90YWwgbGVuZ3RoIHRvIG5vcm1hbGl6ZSBhZ2FpbnN0XHJcbiAgICAgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxyXG4gICAgICovXHJcbiAgICB2YXIgbm9ybWFsaXplT2Zmc2V0XzEgPSBmdW5jdGlvbiBub3JtYWxpemVPZmZzZXQodmFsdWUsIGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLm1heChsZW5ndGggKyB2YWx1ZSwgMCkgOiBNYXRoLm1pbih2YWx1ZSwgbGVuZ3RoKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZyb20gPSBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSwgbWFwRnVuY3Rpb24sIHRoaXNBcmcpIHtcclxuICAgICAgICBpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1hcEZ1bmN0aW9uICYmIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgbWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEoYXJyYXlMaWtlLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBleHRlbnNpb25cclxuICAgICAgICB2YXIgYXJyYXkgPSB0eXBlb2YgQ29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgPyBPYmplY3QobmV3IENvbnN0cnVjdG9yKGxlbmd0aCkpIDogbmV3IEFycmF5KGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKCFpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGFycmF5TGlrZSkgJiYgIWl0ZXJhdG9yXzEuaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxyXG4gICAgICAgIC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cclxuICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShhcnJheUxpa2UpKSB7XHJcbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5TGlrZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKGFycmF5TGlrZVtpXSwgaSkgOiBhcnJheUxpa2VbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGFycmF5TGlrZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhhcnJheUxpa2UpLCBhcnJheUxpa2VfMV8xID0gYXJyYXlMaWtlXzEubmV4dCgpOyAhYXJyYXlMaWtlXzFfMS5kb25lOyBhcnJheUxpa2VfMV8xID0gYXJyYXlMaWtlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlMaWtlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlMaWtlXzFfMSAmJiAhYXJyYXlMaWtlXzFfMS5kb25lICYmIChfYSA9IGFycmF5TGlrZV8xLnJldHVybikpIF9hLmNhbGwoYXJyYXlMaWtlXzEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcnJheUxpa2UubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5vZiA9IGZ1bmN0aW9uIG9mKCkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcyk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5jb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIG9mZnNldCwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb3B5V2l0aGluOiB0YXJnZXQgbXVzdCBiZSBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBvZmZzZXQgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShvZmZzZXQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0XzEodG9JbnRlZ2VyXzEoc3RhcnQpLCBsZW5ndGgpO1xyXG4gICAgICAgIGVuZCA9IG5vcm1hbGl6ZU9mZnNldF8xKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyXzEoZW5kKSwgbGVuZ3RoKTtcclxuICAgICAgICB2YXIgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gc3RhcnQgJiYgb2Zmc2V0IDwgc3RhcnQgKyBjb3VudCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAtMTtcclxuICAgICAgICAgICAgc3RhcnQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGFydCBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRbb2Zmc2V0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBzdGFydCArPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maWxsID0gZnVuY3Rpb24gZmlsbCh0YXJnZXQsIHZhbHVlLCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0XzEoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXJfMShlbmQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHdoaWxlIChpIDwgZW5kKSB7XHJcbiAgICAgICAgICAgIHRhcmdldFtpKytdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maW5kID0gZnVuY3Rpb24gZmluZCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gZXhwb3J0cy5maW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ICE9PSAtMSA/IHRhcmdldFtpbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maW5kSW5kZXggPSBmdW5jdGlvbiBmaW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZmluZDogc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpc0FyZykge1xyXG4gICAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrLmJpbmQodGhpc0FyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHRhcmdldFtpXSwgaSwgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM3LWFycmF5JykpIHtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgdmFyIHRvTGVuZ3RoXzIgPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBudW1iZXJfMS5NQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGFyZ2V0LCBzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcclxuICAgICAgICBpZiAoZnJvbUluZGV4ID09PSB2b2lkIDApIHsgZnJvbUluZGV4ID0gMDsgfVxyXG4gICAgICAgIHZhciBsZW4gPSB0b0xlbmd0aF8yKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXHJcbiAgICAgICAgLy8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHdpbmRvdyBpcyBkZWZpbmVkIGluIGJyb3dzZXJzXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbn0pKCk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdsb2JhbE9iamVjdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbnZhciBzdHJpbmdfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ1wiKTtcclxudmFyIHN0YXRpY0RvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcclxuLyoqXHJcbiAqIEEgY2xhc3MgdGhhdCBfc2hpbXNfIGFuIGl0ZXJhdG9yIGludGVyZmFjZSBvbiBhcnJheSBsaWtlIG9iamVjdHMuXHJcbiAqL1xyXG52YXIgU2hpbUl0ZXJhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU2hpbUl0ZXJhdG9yKGxpc3QpIHtcclxuICAgICAgICB0aGlzLl9uZXh0SW5kZXggPSAtMTtcclxuICAgICAgICBpZiAoaXNJdGVyYWJsZShsaXN0KSkge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmVJdGVyYXRvciA9IGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXHJcbiAgICAgKi9cclxuICAgIFNoaW1JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hdGl2ZUl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0aWNEb25lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKyt0aGlzLl9uZXh0SW5kZXggPCB0aGlzLl9saXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fbGlzdFt0aGlzLl9uZXh0SW5kZXhdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdGF0aWNEb25lO1xyXG4gICAgfTtcclxuICAgIFNoaW1JdGVyYXRvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2hpbUl0ZXJhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLlNoaW1JdGVyYXRvciA9IFNoaW1JdGVyYXRvcjtcclxuLyoqXHJcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcclxuICovXHJcbmZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcclxufVxyXG5leHBvcnRzLmlzSXRlcmFibGUgPSBpc0l0ZXJhYmxlO1xyXG4vKipcclxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaXMgQXJyYXlMaWtlXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xyXG59XHJcbmV4cG9ydHMuaXNBcnJheUxpa2UgPSBpc0FycmF5TGlrZTtcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcclxuICpcclxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBpdGVyYWJsZSBvYmplY3QgdG8gcmV0dXJuIHRoZSBpdGVyYXRvciBmb3JcclxuICovXHJcbmZ1bmN0aW9uIGdldChpdGVyYWJsZSkge1xyXG4gICAgaWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKGl0ZXJhYmxlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmdldCA9IGdldDtcclxuLyoqXHJcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcclxuICpcclxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBvYmplY3QgdGhlIHByb3ZpZGVzIGFuIGludGVyYXRvciBpbnRlcmZhY2VcclxuICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIG9mIHRoZSBpdGVyYWJsZVxyXG4gKiBAcGFyYW0gdGhpc0FyZyBPcHRpb25hbCBzY29wZSB0byBwYXNzIHRoZSBjYWxsYmFja1xyXG4gKi9cclxuZnVuY3Rpb24gZm9yT2YoaXRlcmFibGUsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICB2YXIgYnJva2VuID0gZmFsc2U7XHJcbiAgICBmdW5jdGlvbiBkb0JyZWFrKCkge1xyXG4gICAgICAgIGJyb2tlbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvKiBXZSBuZWVkIHRvIGhhbmRsZSBpdGVyYXRpb24gb2YgZG91YmxlIGJ5dGUgc3RyaW5ncyBwcm9wZXJseSAqL1xyXG4gICAgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdmFyIGwgPSBpdGVyYWJsZS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNoYXIgPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgaWYgKGkgKyAxIDwgbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+PSBzdHJpbmdfMS5ISUdIX1NVUlJPR0FURV9NSU4gJiYgY29kZSA8PSBzdHJpbmdfMS5ISUdIX1NVUlJPR0FURV9NQVgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyICs9IGl0ZXJhYmxlWysraV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XHJcbiAgICAgICAgICAgIGlmIChicm9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XHJcbiAgICAgICAgaWYgKGl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCBpdGVyYWJsZSwgZG9CcmVhayk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnJva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZm9yT2YgPSBmb3JPZjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG4vKipcclxuICogVGhlIHNtYWxsZXN0IGludGVydmFsIGJldHdlZW4gdHdvIHJlcHJlc2VudGFibGUgbnVtYmVycy5cclxuICovXHJcbmV4cG9ydHMuRVBTSUxPTiA9IDE7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxyXG4gKi9cclxuZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XHJcbiAqL1xyXG5leHBvcnRzLk1JTl9TQUZFX0lOVEVHRVIgPSAtZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgTmFOIHdpdGhvdXQgY29lcnNpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIE5hTiwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc05hTih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsXzEuZGVmYXVsdC5pc05hTih2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc05hTiA9IGlzTmFOO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyIHdpdGhvdXQgY29lcnNpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGZpbml0ZSwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsXzEuZGVmYXVsdC5pc0Zpbml0ZSh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc0Zpbml0ZSA9IGlzRmluaXRlO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlci5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0ludGVnZXIodmFsdWUpIHtcclxuICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xyXG59XHJcbmV4cG9ydHMuaXNJbnRlZ2VyID0gaXNJbnRlZ2VyO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlciB0aGF0IGlzICdzYWZlLCcgbWVhbmluZzpcclxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXHJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXHJcbiAqICAgICAgSUVFRS03NTQgcmVwcmVzZW50YXRpb24gY2Fubm90IGJlIHRoZSByZXN1bHQgb2Ygcm91bmRpbmcgYW55IG90aGVyXHJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgTWF0aC5hYnModmFsdWUpIDw9IGV4cG9ydHMuTUFYX1NBRkVfSU5URUdFUjtcclxufVxyXG5leHBvcnRzLmlzU2FmZUludGVnZXIgPSBpc1NhZmVJbnRlZ2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1vYmplY3QnKSkge1xyXG4gICAgdmFyIGdsb2JhbE9iamVjdCA9IGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbiAgICBleHBvcnRzLmlzID0gZ2xvYmFsT2JqZWN0LmlzO1xyXG4gICAgZXhwb3J0cy5rZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5hc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuICAgICAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5rZXlzKG5leHRTb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKG5leHRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0bztcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKSB7XHJcbiAgICAgICAgaWYgKFN5bWJvbF8xLmlzU3ltYm9sKHByb3ApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIEJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKTsgfSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBTeW1ib2wuZm9yKGtleS5zdWJzdHJpbmcoMikpOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmlzID0gZnVuY3Rpb24gaXModmFsdWUxLCB2YWx1ZTIpIHtcclxuICAgICAgICBpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXMyMDE3LW9iamVjdCcpKSB7XHJcbiAgICB2YXIgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3Q7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcclxuICAgIGV4cG9ydHMuZW50cmllcyA9IGdsb2JhbE9iamVjdC5lbnRyaWVzO1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBnbG9iYWxPYmplY3QudmFsdWVzO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZpb3VzLCBrZXkpIHtcclxuICAgICAgICAgICAgcHJldmlvdXNba2V5XSA9IGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIGtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmV2aW91cztcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5lbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMua2V5cyhvKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gW2tleSwgb1trZXldXTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobykge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLmtleXMobykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG9ba2V5XTsgfSk7XHJcbiAgICB9O1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3V0aWxcIik7XHJcbi8qKlxyXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkxPV19TVVJST0dBVEVfTUlOID0gMHhkYzAwO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczYtc3RyaW5nJykgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN0cmluZy1yYXcnKSkge1xyXG4gICAgZXhwb3J0cy5mcm9tQ29kZVBvaW50ID0gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcclxuICAgIGV4cG9ydHMucmF3ID0gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucmF3O1xyXG4gICAgZXhwb3J0cy5jb2RlUG9pbnRBdCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdCk7XHJcbiAgICBleHBvcnRzLmVuZHNXaXRoID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpO1xyXG4gICAgZXhwb3J0cy5ub3JtYWxpemUgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKTtcclxuICAgIGV4cG9ydHMucmVwZWF0ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnJlcGVhdCk7XHJcbiAgICBleHBvcnRzLnN0YXJ0c1dpdGggPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxyXG4gICAgICogVXNlZCBieSBzdGFydHNXaXRoLCBpbmNsdWRlcywgYW5kIGVuZHNXaXRoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cclxuICAgICAqL1xyXG4gICAgdmFyIG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSA9IGZ1bmN0aW9uIChuYW1lLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uLCBpc0VuZCkge1xyXG4gICAgICAgIGlmIChpc0VuZCA9PT0gdm9pZCAwKSB7IGlzRW5kID0gZmFsc2U7IH1cclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy4nICsgbmFtZSArICcgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcgdG8gc2VhcmNoIGFnYWluc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uICE9PSBwb3NpdGlvbiA/IChpc0VuZCA/IGxlbmd0aCA6IDApIDogcG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0LCBTdHJpbmcoc2VhcmNoKSwgTWF0aC5taW4oTWF0aC5tYXgocG9zaXRpb24sIDApLCBsZW5ndGgpXTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xyXG4gICAgICAgIHZhciBjb2RlUG9pbnRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgY29kZVBvaW50c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLmZyb21Db2RlUG9pbnRcclxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xyXG4gICAgICAgIHZhciBNQVhfU0laRSA9IDB4NDAwMDtcclxuICAgICAgICB2YXIgY29kZVVuaXRzID0gW107XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2VcclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBpc0Zpbml0ZShjb2RlUG9pbnQpICYmIE1hdGguZmxvb3IoY29kZVBvaW50KSA9PT0gY29kZVBvaW50ICYmIGNvZGVQb2ludCA+PSAwICYmIGNvZGVQb2ludCA8PSAweDEwZmZmZjtcclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdzdHJpbmcuZnJvbUNvZGVQb2ludDogSW52YWxpZCBjb2RlIHBvaW50ICcgKyBjb2RlUG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhmZmZmKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCTVAgY29kZSBwb2ludFxyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcclxuICAgICAgICAgICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTjtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnJhdyA9IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSkge1xyXG4gICAgICAgIHZhciBzdWJzdGl0dXRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHZhciBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGNhbGxTaXRlID09IG51bGwgfHwgY2FsbFNpdGUucmF3ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMSA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoXzE7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gcmF3U3RyaW5nc1tpXSArIChpIDwgbnVtU3Vic3RpdHV0aW9ucyAmJiBpIDwgbGVuZ3RoXzEgLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dCwgcG9zaXRpb24pIHtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IDA7IH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdFxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLmNvZGVQb2ludEF0IHJlcXVyaWVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgY29kZSB1bml0XHJcbiAgICAgICAgdmFyIGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcclxuICAgICAgICBpZiAoZmlyc3QgPj0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU4gJiYgZmlyc3QgPD0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NQVggJiYgbGVuZ3RoID4gcG9zaXRpb24gKyAxKSB7XHJcbiAgICAgICAgICAgIC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcclxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXHJcbiAgICAgICAgICAgIHZhciBzZWNvbmQgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKTtcclxuICAgICAgICAgICAgaWYgKHNlY29uZCA+PSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUFYKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZpcnN0IC0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU4pICogMHg0MDAgKyBzZWNvbmQgLSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUlOICsgMHgxMDAwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmlyc3Q7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5lbmRzV2l0aCA9IGZ1bmN0aW9uIGVuZHNXaXRoKHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24pIHtcclxuICAgICAgICBpZiAoZW5kUG9zaXRpb24gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfYSA9IHRzbGliXzEuX19yZWFkKG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSgnZW5kc1dpdGgnLCB0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uLCB0cnVlKSwgMyksIHRleHQgPSBfYVswXSwgc2VhcmNoID0gX2FbMV0sIGVuZFBvc2l0aW9uID0gX2FbMl07XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gZW5kUG9zaXRpb24gLSBzZWFyY2gubGVuZ3RoO1xyXG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShzdGFydCwgZW5kUG9zaXRpb24pID09PSBzZWFyY2g7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ2luY2x1ZGVzJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBwb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LmluZGV4T2Yoc2VhcmNoLCBwb3NpdGlvbikgIT09IC0xO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gMDsgfVxyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLnJlcGVhdFxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvdW50ICE9PSBjb3VudCkge1xyXG4gICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlIChjb3VudCkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgJSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnQgPj49IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5zdGFydHNXaXRoID0gZnVuY3Rpb24gc3RhcnRzV2l0aCh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgc2VhcmNoID0gU3RyaW5nKHNlYXJjaCk7XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ3N0YXJ0c1dpdGgnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSwgMyksIHRleHQgPSBfYVswXSwgc2VhcmNoID0gX2FbMV0sIHBvc2l0aW9uID0gX2FbMl07XHJcbiAgICAgICAgdmFyIGVuZCA9IHBvc2l0aW9uICsgc2VhcmNoLmxlbmd0aDtcclxuICAgICAgICBpZiAoZW5kID4gdGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShwb3NpdGlvbiwgZW5kKSA9PT0gc2VhcmNoO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbn1cclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzMjAxNy1zdHJpbmcnKSkge1xyXG4gICAgZXhwb3J0cy5wYWRFbmQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcclxuICAgIGV4cG9ydHMucGFkU3RhcnQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5wYWRFbmQgPSBmdW5jdGlvbiBwYWRFbmQodGV4dCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGZpbGxTdHJpbmcgPT09IHZvaWQgMCkgeyBmaWxsU3RyaW5nID0gJyAnOyB9XHJcbiAgICAgICAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgKz1cclxuICAgICAgICAgICAgICAgIGV4cG9ydHMucmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5wYWRTdGFydCA9IGZ1bmN0aW9uIHBhZFN0YXJ0KHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZykge1xyXG4gICAgICAgIGlmIChmaWxsU3RyaW5nID09PSB2b2lkIDApIHsgZmlsbFN0cmluZyA9ICcgJzsgfVxyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZFN0YXJ0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgPVxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5yZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcclxuICAgICAgICAgICAgICAgICAgICBzdHJUZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyVGV4dDtcclxuICAgIH07XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIkBkb2pvL2hhcy9oYXNcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuLi9nbG9iYWxcIik7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGhhc18xLmRlZmF1bHQ7XHJcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCJAZG9qby9oYXMvaGFzXCIpLCBleHBvcnRzKTtcclxuLyogRUNNQVNjcmlwdCA2IGFuZCA3IEZlYXR1cmVzICovXHJcbi8qIEFycmF5ICovXHJcbmhhc18xLmFkZCgnZXM2LWFycmF5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChbJ2Zyb20nLCAnb2YnXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheTsgfSkgJiZcclxuICAgICAgICBbJ2ZpbmRJbmRleCcsICdmaW5kJywgJ2NvcHlXaXRoaW4nXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGU7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LWFycmF5LWZpbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoJ2ZpbGwnIGluIGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlKSB7XHJcbiAgICAgICAgLyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXHJcbiAgICAgICAgcmV0dXJuIFsxXS5maWxsKDksIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSlbMF0gPT09IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNy1hcnJheScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdpbmNsdWRlcycgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGU7IH0sIHRydWUpO1xyXG4vKiBNYXAgKi9cclxuaGFzXzEuYWRkKCdlczYtbWFwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8qXHJcbiAgICBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5XHJcbiAgICBXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxyXG4gICAgdGFrZSBhcmd1bWVudHMgKGlPUyA4LjQpXHJcbiAgICAgKi9cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdsb2JhbF8xLmRlZmF1bHQuTWFwKFtbMCwgMV1dKTtcclxuICAgICAgICAgICAgcmV0dXJuIChtYXAuaGFzKDApICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKSAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogTWF0aCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXRoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICAnY2x6MzInLFxyXG4gICAgICAgICdzaWduJyxcclxuICAgICAgICAnbG9nMTAnLFxyXG4gICAgICAgICdsb2cyJyxcclxuICAgICAgICAnbG9nMXAnLFxyXG4gICAgICAgICdleHBtMScsXHJcbiAgICAgICAgJ2Nvc2gnLFxyXG4gICAgICAgICdzaW5oJyxcclxuICAgICAgICAndGFuaCcsXHJcbiAgICAgICAgJ2Fjb3NoJyxcclxuICAgICAgICAnYXNpbmgnLFxyXG4gICAgICAgICdhdGFuaCcsXHJcbiAgICAgICAgJ3RydW5jJyxcclxuICAgICAgICAnZnJvdW5kJyxcclxuICAgICAgICAnY2JydCcsXHJcbiAgICAgICAgJ2h5cG90J1xyXG4gICAgXS5ldmVyeShmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuTWF0aFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJzsgfSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXRoLWltdWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoJ2ltdWwnIGluIGdsb2JhbF8xLmRlZmF1bHQuTWF0aCkge1xyXG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDUpID09PSAtNTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9iamVjdCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1vYmplY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKSAmJlxyXG4gICAgICAgIFsnYXNzaWduJywgJ2lzJywgJ2dldE93blByb3BlcnR5U3ltYm9scycsICdzZXRQcm90b3R5cGVPZiddLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbic7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXMyMDE3LW9iamVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBbJ3ZhbHVlcycsICdlbnRyaWVzJywgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcnMnXS5ldmVyeShmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9ic2VydmFibGUgKi9cclxuaGFzXzEuYWRkKCdlcy1vYnNlcnZhYmxlJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JzZXJ2YWJsZSAhPT0gJ3VuZGVmaW5lZCc7IH0sIHRydWUpO1xyXG4vKiBQcm9taXNlICovXHJcbmhhc18xLmFkZCgnZXM2LXByb21pc2UnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7IH0sIHRydWUpO1xyXG4vKiBTZXQgKi9cclxuaGFzXzEuYWRkKCdlczYtc2V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlNldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgU2V0IGZ1bmN0aW9uYWxpdHkgKi9cclxuICAgICAgICB2YXIgc2V0ID0gbmV3IGdsb2JhbF8xLmRlZmF1bHQuU2V0KFsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogU3RyaW5nICovXHJcbmhhc18xLmFkZCgnZXM2LXN0cmluZycsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoW1xyXG4gICAgICAgIC8qIHN0YXRpYyBtZXRob2RzICovXHJcbiAgICAgICAgJ2Zyb21Db2RlUG9pbnQnXHJcbiAgICBdLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nOyB9KSAmJlxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLyogaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4gICAgICAgICAgICAnY29kZVBvaW50QXQnLFxyXG4gICAgICAgICAgICAnbm9ybWFsaXplJyxcclxuICAgICAgICAgICAgJ3JlcGVhdCcsXHJcbiAgICAgICAgICAgICdzdGFydHNXaXRoJyxcclxuICAgICAgICAgICAgJ2VuZHNXaXRoJyxcclxuICAgICAgICAgICAgJ2luY2x1ZGVzJ1xyXG4gICAgICAgIF0uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nOyB9KSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNi1zdHJpbmctcmF3JywgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2FsbFNpdGUoY2FsbFNpdGUpIHtcclxuICAgICAgICB2YXIgc3Vic3RpdHV0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSB0c2xpYl8xLl9fc3ByZWFkKGNhbGxTaXRlKTtcclxuICAgICAgICByZXN1bHQucmF3ID0gY2FsbFNpdGUucmF3O1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoJ3JhdycgaW4gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcpIHtcclxuICAgICAgICB2YXIgYiA9IDE7XHJcbiAgICAgICAgdmFyIGNhbGxTaXRlID0gZ2V0Q2FsbFNpdGUodGVtcGxhdGVPYmplY3RfMSB8fCAodGVtcGxhdGVPYmplY3RfMSA9IHRzbGliXzEuX19tYWtlVGVtcGxhdGVPYmplY3QoW1wiYVxcblwiLCBcIlwiXSwgW1wiYVxcXFxuXCIsIFwiXCJdKSksIGIpO1xyXG4gICAgICAgIGNhbGxTaXRlLnJhdyA9IFsnYVxcXFxuJ107XHJcbiAgICAgICAgdmFyIHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5yYXcoY2FsbFNpdGUsIDQyKSA9PT0gJ2E6XFxcXG4nO1xyXG4gICAgICAgIHJldHVybiBzdXBwb3J0c1RydW5jO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczIwMTctc3RyaW5nJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFsncGFkU3RhcnQnLCAncGFkRW5kJ10uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbi8qIFN5bWJvbCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1zeW1ib2wnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCc7IH0sIHRydWUpO1xyXG4vKiBXZWFrTWFwICovXHJcbmhhc18xLmFkZCgnZXM2LXdlYWttYXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5ICovXHJcbiAgICAgICAgdmFyIGtleTEgPSB7fTtcclxuICAgICAgICB2YXIga2V5MiA9IHt9O1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwKFtba2V5MSwgMV1dKTtcclxuICAgICAgICBPYmplY3QuZnJlZXplKGtleTEpO1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0KGtleTEpID09PSAxICYmIG1hcC5zZXQoa2V5MiwgMikgPT09IG1hcCAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBNaXNjZWxsYW5lb3VzIGZlYXR1cmVzICovXHJcbmhhc18xLmFkZCgnbWljcm90YXNrcycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykgfHwgaGFzXzEuZGVmYXVsdCgnaG9zdC1ub2RlJykgfHwgaGFzXzEuZGVmYXVsdCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKTsgfSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgncG9zdG1lc3NhZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBJZiB3aW5kb3cgaXMgdW5kZWZpbmVkLCBhbmQgd2UgaGF2ZSBwb3N0TWVzc2FnZSwgaXQgcHJvYmFibHkgbWVhbnMgd2UncmUgaW4gYSB3ZWIgd29ya2VyLiBXZWIgd29ya2VycyBoYXZlXHJcbiAgICAvLyBwb3N0IG1lc3NhZ2UgYnV0IGl0IGRvZXNuJ3Qgd29yayBob3cgd2UgZXhwZWN0IGl0IHRvLCBzbyBpdCdzIGJlc3QganVzdCB0byBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXHJcbiAgICByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQud2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgncmFmJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nOyB9LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdzZXRpbW1lZGlhdGUnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5zZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnOyB9LCB0cnVlKTtcclxuLyogRE9NIEZlYXR1cmVzICovXHJcbmhhc18xLmFkZCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgnaG9zdC1icm93c2VyJykgJiYgQm9vbGVhbihnbG9iYWxfMS5kZWZhdWx0Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsXzEuZGVmYXVsdC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyKSkge1xyXG4gICAgICAgIC8vIElFMTEgaGFzIGFuIHVucmVsaWFibGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiB3aGVyZSBzZXRQcm9wZXJ0eSgpIGRvZXMgbm90XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxyXG4gICAgICAgIC8vIHJlbGlhYmx5LiBUaGUgZm9sbG93aW5nIGZlYXR1cmUgdGVzdCB3YXMgYWRhcHRlZCBmcm9tXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdDEwa28vNGFjZWI4YzcxNjgxZmRiMjc1ZTMzZWZlNWU1NzZiMTRcclxuICAgICAgICB2YXIgZXhhbXBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgdmFyIEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsXzEuZGVmYXVsdC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbF8xLmRlZmF1bHQuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGV4YW1wbGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcclxuICAgICAgICBleGFtcGxlLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4ob2JzZXJ2ZXIudGFrZVJlY29yZHMoKS5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdkb20td2ViYW5pbWF0aW9uJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gaGFzXzEuZGVmYXVsdCgnaG9zdC1icm93c2VyJykgJiYgZ2xvYmFsXzEuZGVmYXVsdC5BbmltYXRpb24gIT09IHVuZGVmaW5lZCAmJiBnbG9iYWxfMS5kZWZhdWx0LktleWZyYW1lRWZmZWN0ICE9PSB1bmRlZmluZWQ7IH0sIHRydWUpO1xyXG52YXIgdGVtcGxhdGVPYmplY3RfMTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4uL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vaGFzXCIpO1xyXG5mdW5jdGlvbiBleGVjdXRlVGFzayhpdGVtKSB7XHJcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZGVzdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICAgICAgaXRlbS5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpdGVtLmNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGRlc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxudmFyIGNoZWNrTWljcm9UYXNrUXVldWU7XHJcbnZhciBtaWNyb1Rhc2tzO1xyXG4vKipcclxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZVRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGRlc3RydWN0b3I7XHJcbiAgICB2YXIgZW5xdWV1ZTtcclxuICAgIC8vIFNpbmNlIHRoZSBJRSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0SW1tZWRpYXRlYCBpcyBub3QgZmxhd2xlc3MsIHdlIHdpbGwgdGVzdCBmb3IgYHBvc3RNZXNzYWdlYCBmaXJzdC5cclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdwb3N0bWVzc2FnZScpKSB7XHJcbiAgICAgICAgdmFyIHF1ZXVlXzEgPSBbXTtcclxuICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgLy8gQ29uZmlybSB0aGF0IHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgYnkgdGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uLlxyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWxfMS5kZWZhdWx0ICYmIGV2ZW50LmRhdGEgPT09ICdkb2pvLXF1ZXVlLW1lc3NhZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWV1ZV8xLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrKHF1ZXVlXzEuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcXVldWVfMS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnBvc3RNZXNzYWdlKCdkb2pvLXF1ZXVlLW1lc3NhZ2UnLCAnKicpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChoYXNfMS5kZWZhdWx0KCdzZXRpbW1lZGlhdGUnKSkge1xyXG4gICAgICAgIGRlc3RydWN0b3IgPSBnbG9iYWxfMS5kZWZhdWx0LmNsZWFySW1tZWRpYXRlO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2V0SW1tZWRpYXRlKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsXzEuZGVmYXVsdC5jbGVhclRpbWVvdXQ7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSksIDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBxdWV1ZVRhc2soY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGlkID0gZW5xdWV1ZShpdGVtKTtcclxuICAgICAgICByZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZGVzdHJ1Y3RvciAmJlxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKGlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cclxuICAgIHJldHVybiBoYXNfMS5kZWZhdWx0KCdtaWNyb3Rhc2tzJylcclxuICAgICAgICA/IHF1ZXVlVGFza1xyXG4gICAgICAgIDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlVGFzayhjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuLy8gV2hlbiBubyBtZWNoYW5pc20gZm9yIHJlZ2lzdGVyaW5nIG1pY3JvdGFza3MgaXMgZXhwb3NlZCBieSB0aGUgZW52aXJvbm1lbnQsIG1pY3JvdGFza3Mgd2lsbFxyXG4vLyBiZSBxdWV1ZWQgYW5kIHRoZW4gZXhlY3V0ZWQgaW4gYSBzaW5nbGUgbWFjcm90YXNrIGJlZm9yZSB0aGUgb3RoZXIgbWFjcm90YXNrcyBhcmUgZXhlY3V0ZWQuXHJcbmlmICghaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpKSB7XHJcbiAgICB2YXIgaXNNaWNyb1Rhc2tRdWV1ZWRfMSA9IGZhbHNlO1xyXG4gICAgbWljcm9UYXNrcyA9IFtdO1xyXG4gICAgY2hlY2tNaWNyb1Rhc2tRdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIWlzTWljcm9UYXNrUXVldWVkXzEpIHtcclxuICAgICAgICAgICAgaXNNaWNyb1Rhc2tRdWV1ZWRfMSA9IHRydWU7XHJcbiAgICAgICAgICAgIGV4cG9ydHMucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlzTWljcm9UYXNrUXVldWVkXzEgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChtaWNyb1Rhc2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgoaXRlbSA9IG1pY3JvVGFza3Muc2hpZnQoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2soaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYW4gYW5pbWF0aW9uIHRhc2sgd2l0aCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgaXQgZXhpc3RzLCBvciB3aXRoIGBxdWV1ZVRhc2tgIG90aGVyd2lzZS5cclxuICpcclxuICogU2luY2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lJ3MgYmVoYXZpb3IgZG9lcyBub3QgbWF0Y2ggdGhhdCBleHBlY3RlZCBmcm9tIGBxdWV1ZVRhc2tgLCBpdCBpcyBub3QgdXNlZCB0aGVyZS5cclxuICogSG93ZXZlciwgYXQgdGltZXMgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byBkZWxlZ2F0ZSB0byByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGhlbmNlIHRoZSBmb2xsb3dpbmcgbWV0aG9kLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXHJcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXHJcbiAqL1xyXG5leHBvcnRzLnF1ZXVlQW5pbWF0aW9uVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIWhhc18xLmRlZmF1bHQoJ3JhZicpKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucXVldWVUYXNrO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICByZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cclxuICAgIHJldHVybiBoYXNfMS5kZWZhdWx0KCdtaWNyb3Rhc2tzJylcclxuICAgICAgICA/IHF1ZXVlQW5pbWF0aW9uVGFza1xyXG4gICAgICAgIDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEFueSBjYWxsYmFja3MgcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZU1pY3JvVGFza2Agd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG5leHQgbWFjcm90YXNrLiBJZiBubyBuYXRpdmVcclxuICogbWVjaGFuaXNtIGZvciBzY2hlZHVsaW5nIG1hY3JvdGFza3MgaXMgZXhwb3NlZCwgdGhlbiBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgZmlyZWQgYmVmb3JlIGFueSBtYWNyb3Rhc2tcclxuICogcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZVRhc2tgIG9yIGBxdWV1ZUFuaW1hdGlvblRhc2tgLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXHJcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXHJcbiAqL1xyXG5leHBvcnRzLnF1ZXVlTWljcm9UYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlbnF1ZXVlO1xyXG4gICAgaWYgKGhhc18xLmRlZmF1bHQoJ2hvc3Qtbm9kZScpKSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucHJvY2Vzcy5uZXh0VGljayhleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGFzXzEuZGVmYXVsdCgnZXM2LXByb21pc2UnKSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LlByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGV4ZWN1dGVUYXNrKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGFzXzEuZGVmYXVsdCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKSkge1xyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgdmFyIEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsXzEuZGVmYXVsdC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbF8xLmRlZmF1bHQuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgICAgICB2YXIgbm9kZV8xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdmFyIHF1ZXVlXzIgPSBbXTtcclxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAocXVldWVfMi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlXzIuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUobm9kZV8xLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlXzIucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgbm9kZV8xLnNldEF0dHJpYnV0ZSgncXVldWVTdGF0dXMnLCAnMScpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgY2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xyXG4gICAgICAgICAgICBtaWNyb1Rhc2tzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZW5xdWV1ZShpdGVtKTtcclxuICAgICAgICByZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSk7XHJcbiAgICB9O1xyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHZhbHVlIHByb3BlcnR5IGRlc2NyaXB0b3JcclxuICpcclxuICogQHBhcmFtIHZhbHVlICAgICAgICBUaGUgdmFsdWUgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIHNldCB0b1xyXG4gKiBAcGFyYW0gZW51bWVyYWJsZSAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZW51bWJlcmFibGUsIGRlZmF1bHRzIHRvIGZhbHNlXHJcbiAqIEBwYXJhbSB3cml0YWJsZSAgICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSB3cml0YWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxyXG4gKiBAcGFyYW0gY29uZmlndXJhYmxlIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgY29uZmlndXJhYmxlLCBkZWZhdWx0cyB0byB0cnVlXHJcbiAqIEByZXR1cm4gICAgICAgICAgICAgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUsIGVudW1lcmFibGUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUpIHtcclxuICAgIGlmIChlbnVtZXJhYmxlID09PSB2b2lkIDApIHsgZW51bWVyYWJsZSA9IGZhbHNlOyB9XHJcbiAgICBpZiAod3JpdGFibGUgPT09IHZvaWQgMCkgeyB3cml0YWJsZSA9IHRydWU7IH1cclxuICAgIGlmIChjb25maWd1cmFibGUgPT09IHZvaWQgMCkgeyBjb25maWd1cmFibGUgPSB0cnVlOyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB3cml0YWJsZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmdldFZhbHVlRGVzY3JpcHRvciA9IGdldFZhbHVlRGVzY3JpcHRvcjtcclxuZnVuY3Rpb24gd3JhcE5hdGl2ZShuYXRpdmVGdW5jdGlvbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYXRpdmVGdW5jdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3MpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLndyYXBOYXRpdmUgPSB3cmFwTmF0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvdXRpbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIEluamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoSW5qZWN0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJbmplY3RvcihwYXlsb2FkKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgSW5qZWN0b3IucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH07XHJcbiAgICBJbmplY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcclxuICAgICAgICB0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEluamVjdG9yO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuSW5qZWN0b3IgPSBJbmplY3RvcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSW5qZWN0b3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbi8qKlxyXG4gKiBFbnVtIHRvIGlkZW50aWZ5IHRoZSB0eXBlIG9mIGV2ZW50LlxyXG4gKiBMaXN0ZW5pbmcgdG8gJ1Byb2plY3Rvcicgd2lsbCBub3RpZnkgd2hlbiBwcm9qZWN0b3IgaXMgY3JlYXRlZCBvciB1cGRhdGVkXHJcbiAqIExpc3RlbmluZyB0byAnV2lkZ2V0JyB3aWxsIG5vdGlmeSB3aGVuIHdpZGdldCByb290IGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxyXG4gKi9cclxudmFyIE5vZGVFdmVudFR5cGU7XHJcbihmdW5jdGlvbiAoTm9kZUV2ZW50VHlwZSkge1xyXG4gICAgTm9kZUV2ZW50VHlwZVtcIlByb2plY3RvclwiXSA9IFwiUHJvamVjdG9yXCI7XHJcbiAgICBOb2RlRXZlbnRUeXBlW1wiV2lkZ2V0XCJdID0gXCJXaWRnZXRcIjtcclxufSkoTm9kZUV2ZW50VHlwZSA9IGV4cG9ydHMuTm9kZUV2ZW50VHlwZSB8fCAoZXhwb3J0cy5Ob2RlRXZlbnRUeXBlID0ge30pKTtcclxudmFyIE5vZGVIYW5kbGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoTm9kZUhhbmRsZXIsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBOb2RlSGFuZGxlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fbm9kZU1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU1hcC5nZXQoa2V5KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlTWFwLmhhcyhrZXkpO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCwga2V5KSB7XHJcbiAgICAgICAgdGhpcy5fbm9kZU1hcC5zZXQoa2V5LCBlbGVtZW50KTtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBrZXkgfSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmFkZFJvb3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5XaWRnZXQgfSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmFkZFByb2plY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLlByb2plY3RvciB9KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbm9kZU1hcC5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOb2RlSGFuZGxlcjtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLk5vZGVIYW5kbGVyID0gTm9kZUhhbmRsZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE5vZGVIYW5kbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgUHJvbWlzZV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vUHJvbWlzZVwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgU3ltYm9sXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9TeW1ib2xcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG4vKipcclxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcclxuICovXHJcbmV4cG9ydHMuV0lER0VUX0JBU0VfVFlQRSA9IFN5bWJvbF8xLmRlZmF1bHQoJ1dpZGdldCBCYXNlJyk7XHJcbi8qKlxyXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBleHBvcnRzLldJREdFVF9CQVNFX1RZUEUpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IgPSBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjtcclxuZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxyXG4gICAgICAgIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdCkpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQgPSBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDtcclxuLyoqXHJcbiAqIFRoZSBSZWdpc3RyeSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxudmFyIFJlZ2lzdHJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnksIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBSZWdpc3RyeSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEVtaXQgbG9hZGVkIGV2ZW50IGZvciByZWdpc3RyeSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZW1pdExvYWRlZEV2ZW50ID0gZnVuY3Rpb24gKHdpZGdldExhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHtcclxuICAgICAgICAgICAgdHlwZTogd2lkZ2V0TGFiZWwsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvYWRlZCcsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGxhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIndpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICdcIiArIGxhYmVsLnRvU3RyaW5nKCkgKyBcIidcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICBpdGVtLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluamVjdG9yIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJ1wiICsgbGFiZWwudG9TdHJpbmcoKSArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl93aWRnZXRSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgICAgIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBpdGVtKCk7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0KHdpZGdldEN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICBfdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0Q3RvcjtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmdldEluamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5fd2lkZ2V0UmVnaXN0cnkgJiYgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmhhc0luamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSZWdpc3RyeTtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLlJlZ2lzdHJ5ID0gUmVnaXN0cnk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lzdHJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgUmVnaXN0cnlIYW5kbGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnlIYW5kbGVyLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gUmVnaXN0cnlIYW5kbGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5XzEuUmVnaXN0cnkoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCA9IG5ldyBNYXBfMS5NYXAoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwID0gbmV3IE1hcF8xLk1hcCgpO1xyXG4gICAgICAgIF90aGlzLm93bihfdGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgIHZhciBkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMuYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUoX3RoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKF90aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm93bih7IGRlc3Ryb3k6IGRlc3Ryb3kgfSk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUsIFwiYmFzZVwiLCB7XHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5iYXNlUmVnaXN0cnkgPSBiYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uIChsYWJlbCwgd2lkZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGluamVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5oYXNJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbFByZWNlZGVuY2UgPT09IHZvaWQgMCkgeyBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5nZXRJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxQcmVjZWRlbmNlID09PSB2b2lkIDApIHsgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLl9nZXQgPSBmdW5jdGlvbiAobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsIGdldEZ1bmN0aW9uTmFtZSwgbGFiZWxNYXApIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RyeSA9IHJlZ2lzdHJpZXNbaV07XHJcbiAgICAgICAgICAgIGlmICghcmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZ2lzdGVyZWRMYWJlbHMuaW5kZXhPZihsYWJlbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gcmVnaXN0cnkub24obGFiZWwsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdsb2FkZWQnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgbGFiZWxNYXAuc2V0KHJlZ2lzdHJ5LCB0c2xpYl8xLl9fc3ByZWFkKHJlZ2lzdGVyZWRMYWJlbHMsIFtsYWJlbF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmVnaXN0cnlIYW5kbGVyO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuUmVnaXN0cnlIYW5kbGVyID0gUmVnaXN0cnlIYW5kbGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWdpc3RyeUhhbmRsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCIuL2RcIik7XHJcbnZhciBkaWZmXzEgPSByZXF1aXJlKFwiLi9kaWZmXCIpO1xyXG52YXIgUmVnaXN0cnlIYW5kbGVyXzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeUhhbmRsZXJcIik7XHJcbnZhciBOb2RlSGFuZGxlcl8xID0gcmVxdWlyZShcIi4vTm9kZUhhbmRsZXJcIik7XHJcbnZhciB2ZG9tXzEgPSByZXF1aXJlKFwiLi92ZG9tXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgZGVjb3JhdG9yTWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxudmFyIGJvdW5kQXV0byA9IGRpZmZfMS5hdXRvLmJpbmQobnVsbCk7XHJcbi8qKlxyXG4gKiBNYWluIHdpZGdldCBiYXNlIGZvciBhbGwgd2lkZ2V0cyB0byBleHRlbmRcclxuICovXHJcbnZhciBXaWRnZXRCYXNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gV2lkZ2V0QmFzZSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluZGljYXRlcyBpZiBpdCBpcyB0aGUgaW5pdGlhbCBzZXQgcHJvcGVydGllcyBjeWNsZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gdHJ1ZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheSBvZiBwcm9wZXJ0eSBrZXlzIGNvbnNpZGVyZWQgY2hhbmdlZCBmcm9tIHRoZSBwcmV2aW91cyBzZXQgcHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9ub2RlSGFuZGxlciA9IG5ldyBOb2RlSGFuZGxlcl8xLmRlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2RlY29yYXRvckNhY2hlID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgdGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcclxuICAgICAgICB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuc2V0KHRoaXMsIHtcclxuICAgICAgICAgICAgZGlydHk6IHRydWUsXHJcbiAgICAgICAgICAgIG9uQXR0YWNoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkF0dGFjaCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRldGFjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMub25EZXRhY2goKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcclxuICAgICAgICAgICAgcmVnaXN0cnk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29yZVByb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICByZW5kZXJpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBpbnB1dFByb3BlcnRpZXM6IHt9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTtcclxuICAgIH1cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm1ldGEgPSBmdW5jdGlvbiAoTWV0YVR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2FjaGVkID0gdGhpcy5fbWV0YU1hcC5nZXQoTWV0YVR5cGUpO1xyXG4gICAgICAgIGlmICghY2FjaGVkKSB7XHJcbiAgICAgICAgICAgIGNhY2hlZCA9IG5ldyBNZXRhVHlwZSh7XHJcbiAgICAgICAgICAgICAgICBpbnZhbGlkYXRlOiB0aGlzLl9ib3VuZEludmFsaWRhdGUsXHJcbiAgICAgICAgICAgICAgICBub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICBiaW5kOiB0aGlzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwLnNldChNZXRhVHlwZSwgY2FjaGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlZDtcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5vbkF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUub25EZXRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJwcm9wZXJ0aWVzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwiY2hhbmdlZFByb3BlcnR5S2V5c1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fc3ByZWFkKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX19zZXRDb3JlUHJvcGVydGllc19fID0gZnVuY3Rpb24gKGNvcmVQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIGJhc2VSZWdpc3RyeSA9IGNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeTtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeSAhPT0gYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkuYmFzZSA9IGJhc2VSZWdpc3RyeTtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyA9IGNvcmVQcm9wZXJ0aWVzO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0UHJvcGVydGllc19fID0gZnVuY3Rpb24gKG9yaWdpbmFsUHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyA9IG9yaWdpbmFsUHJvcGVydGllcztcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcclxuICAgICAgICB2YXIgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknKTtcclxuICAgICAgICB2YXIgY2hhbmdlZFByb3BlcnR5S2V5cyA9IFtdO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID09PSBmYWxzZSB8fCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxQcm9wZXJ0aWVzID0gdHNsaWJfMS5fX3NwcmVhZChwcm9wZXJ0eU5hbWVzLCBPYmplY3Qua2V5cyh0aGlzLl9wcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIHZhciBjaGVja2VkUHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgZGlmZlByb3BlcnR5UmVzdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgcnVuUmVhY3Rpb25zID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IGFsbFByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzUHJvcGVydHkgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3UHJvcGVydHkgPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1blJlYWN0aW9ucyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZmZGdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcihcImRpZmZQcm9wZXJ0eTpcIiArIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gMDsgaV8xIDwgZGlmZkZ1bmN0aW9ucy5sZW5ndGg7IGlfMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBkaWZmRnVuY3Rpb25zW2lfMV0ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBib3VuZEF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChydW5SZWFjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhwcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKS5mb3JFYWNoKGZ1bmN0aW9uIChhcmdzLCByZWFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3Rpb24uY2FsbChfdGhpcywgYXJncy5wcmV2aW91c1Byb3BlcnRpZXMsIGFyZ3MubmV3UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLCBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwiY2hpbGRyZW5cIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3NldENoaWxkcmVuX18gPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3JlbmRlcl9fID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZW5kZXIgPSB0aGlzLl9ydW5CZWZvcmVSZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIGROb2RlID0gcmVuZGVyKCk7XHJcbiAgICAgICAgZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XHJcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIuY2xlYXIoKTtcclxuICAgICAgICByZXR1cm4gZE5vZGU7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmludmFsaWRhdGUpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBkXzEudignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gYWRkIGRlY29yYXRvcnMgdG8gV2lkZ2V0QmFzZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuYWRkRGVjb3JhdG9yID0gZnVuY3Rpb24gKGRlY29yYXRvcktleSwgdmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTWFwLmdldCh0aGlzLmNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKCFkZWNvcmF0b3JMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvckxpc3QuZ2V0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgICAgIGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvckxpc3Quc2V0KGRlY29yYXRvcktleSwgc3BlY2lmaWNEZWNvcmF0b3JMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcGVjaWZpY0RlY29yYXRvckxpc3QucHVzaC5hcHBseShzcGVjaWZpY0RlY29yYXRvckxpc3QsIHRzbGliXzEuX19zcHJlYWQodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBkZWNvcmF0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgdHNsaWJfMS5fX3NwcmVhZChkZWNvcmF0b3JzLCB2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGJ1aWxkIHRoZSBsaXN0IG9mIGRlY29yYXRvcnMgZnJvbSB0aGUgZ2xvYmFsIGRlY29yYXRvciBtYXAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcmV0dXJuIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9idWlsZERlY29yYXRvckxpc3QgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5KSB7XHJcbiAgICAgICAgdmFyIGFsbERlY29yYXRvcnMgPSBbXTtcclxuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIHdoaWxlIChjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlTWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdG9ycyA9IGluc3RhbmNlTWFwLmdldChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxEZWNvcmF0b3JzLnVuc2hpZnQuYXBwbHkoYWxsRGVjb3JhdG9ycywgdHNsaWJfMS5fX3NwcmVhZChkZWNvcmF0b3JzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERlc3Ryb3lzIHByaXZhdGUgcmVzb3VyY2VzIGZvciBXaWRnZXRCYXNlXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZWdpc3RyeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5mb3JFYWNoKGZ1bmN0aW9uIChtZXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gcmV0cmlldmUgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLmdldERlY29yYXRvciA9IGZ1bmN0aW9uIChkZWNvcmF0b3JLZXkpIHtcclxuICAgICAgICB2YXIgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2RlY29yYXRvckNhY2hlLmdldChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgIGlmIChhbGxEZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbERlY29yYXRvcnMgPSB0aGlzLl9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBhbGxEZWNvcmF0b3JzKTtcclxuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zID0gZnVuY3Rpb24gKG5ld1Byb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWFjdGlvbkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nKTtcclxuICAgICAgICByZXR1cm4gcmVhY3Rpb25GdW5jdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChyZWFjdGlvblByb3BlcnR5TWFwLCBfYSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhY3Rpb24gPSBfYS5yZWFjdGlvbiwgcHJvcGVydHlOYW1lID0gX2EucHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICB2YXIgcmVhY3Rpb25Bcmd1bWVudHMgPSByZWFjdGlvblByb3BlcnR5TWFwLmdldChyZWFjdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChyZWFjdGlvbkFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1Byb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLnByZXZpb3VzUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gX3RoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMubmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gbmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5jaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFjdGlvblByb3BlcnR5TWFwLnNldChyZWFjdGlvbiwgcmVhY3Rpb25Bcmd1bWVudHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVhY3Rpb25Qcm9wZXJ0eU1hcDtcclxuICAgICAgICB9LCBuZXcgTWFwXzEuZGVmYXVsdCgpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHVuYm91bmQgcHJvcGVydHkgZnVuY3Rpb25zIHRvIHRoZSBzcGVjaWZpZWQgYGJpbmRgIHByb3BlcnR5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSwgYmluZCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgUmVnaXN0cnlfMS5pc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcihwcm9wZXJ0eSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiaW5kSW5mbyA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XHJcbiAgICAgICAgICAgIHZhciBib3VuZEZ1bmMgPSBiaW5kSW5mby5ib3VuZEZ1bmMsIHNjb3BlID0gYmluZEluZm8uc2NvcGU7XHJcbiAgICAgICAgICAgIGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xyXG4gICAgICAgICAgICAgICAgYm91bmRGdW5jID0gcHJvcGVydHkuYmluZChiaW5kKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLnNldChwcm9wZXJ0eSwgeyBib3VuZEZ1bmM6IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kRnVuYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJyZWdpc3RyeVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX3J1bkJlZm9yZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJlZm9yZVByb3BlcnRpZXMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycpO1xyXG4gICAgICAgIGlmIChiZWZvcmVQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24uY2FsbChfdGhpcywgcHJvcGVydGllcykpO1xyXG4gICAgICAgICAgICB9LCB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGJlZm9yZSByZW5kZXJzIGFuZCByZXR1cm4gdGhlIHVwZGF0ZWQgcmVuZGVyIG1ldGhvZFxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fcnVuQmVmb3JlUmVuZGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBiZWZvcmVSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVJlbmRlcicpO1xyXG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVJlbmRlcnMucmVkdWNlKGZ1bmN0aW9uIChyZW5kZXIsIGJlZm9yZVJlbmRlckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlZFJlbmRlciA9IGJlZm9yZVJlbmRlckZ1bmN0aW9uLmNhbGwoX3RoaXMsIHJlbmRlciwgX3RoaXMuX3Byb3BlcnRpZXMsIF90aGlzLl9jaGlsZHJlbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZWRSZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlZFJlbmRlcjtcclxuICAgICAgICAgICAgfSwgdGhpcy5fYm91bmRSZW5kZXJGdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBhZnRlciByZW5kZXJzIGFuZCByZXR1cm4gdGhlIGRlY29yYXRlZCBETm9kZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZE5vZGUgVGhlIEROb2RlcyB0byBydW4gdGhyb3VnaCB0aGUgYWZ0ZXIgcmVuZGVyc1xyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5ydW5BZnRlclJlbmRlcnMgPSBmdW5jdGlvbiAoZE5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhZnRlclJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJSZW5kZXInKTtcclxuICAgICAgICBpZiAoYWZ0ZXJSZW5kZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVycy5yZWR1Y2UoZnVuY3Rpb24gKGROb2RlLCBhZnRlclJlbmRlckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZW5kZXJGdW5jdGlvbi5jYWxsKF90aGlzLCBkTm9kZSk7XHJcbiAgICAgICAgICAgIH0sIGROb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwLmZvckVhY2goZnVuY3Rpb24gKG1ldGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGEuYWZ0ZXJSZW5kZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkTm9kZTtcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYWZ0ZXJDb25zdHJ1Y3RvcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJDb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIGlmIChhZnRlckNvbnN0cnVjdG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGFmdGVyQ29uc3RydWN0b3JzLmZvckVhY2goZnVuY3Rpb24gKGFmdGVyQ29uc3RydWN0b3IpIHsgcmV0dXJuIGFmdGVyQ29uc3RydWN0b3IuY2FsbChfdGhpcyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIHN0YXRpYyBpZGVudGlmaWVyXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UuX3R5cGUgPSBSZWdpc3RyeV8xLldJREdFVF9CQVNFX1RZUEU7XHJcbiAgICByZXR1cm4gV2lkZ2V0QmFzZTtcclxufSgpKTtcclxuZXhwb3J0cy5XaWRnZXRCYXNlID0gV2lkZ2V0QmFzZTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gV2lkZ2V0QmFzZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnJztcclxudmFyIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xyXG5mdW5jdGlvbiBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KSB7XHJcbiAgICBpZiAoJ1dlYmtpdFRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRBbmltYXRpb25FbmQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoJ3RyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUgfHwgJ01velRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3RyYW5zaXRpb25lbmQnO1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICdhbmltYXRpb25lbmQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCcpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXRpYWxpemUoZWxlbWVudCkge1xyXG4gICAgaWYgKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9PT0gJycpIHtcclxuICAgICAgICBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBydW5BbmRDbGVhblVwKGVsZW1lbnQsIHN0YXJ0QW5pbWF0aW9uLCBmaW5pc2hBbmltYXRpb24pIHtcclxuICAgIGluaXRpYWxpemUoZWxlbWVudCk7XHJcbiAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcclxuICAgIHZhciB0cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghZmluaXNoZWQpIHtcclxuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICBmaW5pc2hBbmltYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgc3RhcnRBbmltYXRpb24oKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG59XHJcbmZ1bmN0aW9uIGV4aXQobm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlTm9kZSkge1xyXG4gICAgdmFyIGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uQWN0aXZlIHx8IGV4aXRBbmltYXRpb24gKyBcIi1hY3RpdmVcIjtcclxuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChleGl0QW5pbWF0aW9uKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlbW92ZU5vZGUoKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGVudGVyKG5vZGUsIHByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKSB7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uQWN0aXZlIHx8IGVudGVyQW5pbWF0aW9uICsgXCItYWN0aXZlXCI7XHJcbiAgICBydW5BbmRDbGVhblVwKG5vZGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0ge1xyXG4gICAgZW50ZXI6IGVudGVyLFxyXG4gICAgZXhpdDogZXhpdFxyXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFN5bWJvbF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vU3ltYm9sXCIpO1xyXG4vKipcclxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFdOb2RlIHR5cGVcclxuICovXHJcbmV4cG9ydHMuV05PREUgPSBTeW1ib2xfMS5kZWZhdWx0KCdJZGVudGlmaWVyIGZvciBhIFdOb2RlLicpO1xyXG4vKipcclxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGVcclxuICovXHJcbmV4cG9ydHMuVk5PREUgPSBTeW1ib2xfMS5kZWZhdWx0KCdJZGVudGlmaWVyIGZvciBhIFZOb2RlLicpO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFdOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1dOb2RlKGNoaWxkKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IGV4cG9ydHMuV05PREUpO1xyXG59XHJcbmV4cG9ydHMuaXNXTm9kZSA9IGlzV05vZGU7XHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcclxuICovXHJcbmZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQpIHtcclxuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gZXhwb3J0cy5WTk9ERSk7XHJcbn1cclxuZXhwb3J0cy5pc1ZOb2RlID0gaXNWTm9kZTtcclxuZnVuY3Rpb24gaXNFbGVtZW50Tm9kZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuICEhdmFsdWUudGFnTmFtZTtcclxufVxyXG5leHBvcnRzLmlzRWxlbWVudE5vZGUgPSBpc0VsZW1lbnROb2RlO1xyXG5mdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXMsIG9wdGlvbnNPck1vZGlmaWVyLCBwcmVkaWNhdGUpIHtcclxuICAgIHZhciBzaGFsbG93ID0gZmFsc2U7XHJcbiAgICB2YXIgbW9kaWZpZXI7XHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbW9kaWZpZXIgPSBvcHRpb25zT3JNb2RpZmllcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXIubW9kaWZpZXI7XHJcbiAgICAgICAgcHJlZGljYXRlID0gb3B0aW9uc09yTW9kaWZpZXIucHJlZGljYXRlO1xyXG4gICAgICAgIHNoYWxsb3cgPSBvcHRpb25zT3JNb2RpZmllci5zaGFsbG93IHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdmFyIG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gdHNsaWJfMS5fX3NwcmVhZChkTm9kZXMpIDogW2ROb2Rlc107XHJcbiAgICBmdW5jdGlvbiBicmVha2VyKCkge1xyXG4gICAgICAgIG5vZGVzID0gW107XHJcbiAgICB9XHJcbiAgICB3aGlsZSAobm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlcy5zaGlmdCgpO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmICghc2hhbGxvdyAmJiAoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlcyA9IHRzbGliXzEuX19zcHJlYWQobm9kZXMsIG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kaWZpZXIobm9kZSwgYnJlYWtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZE5vZGVzO1xyXG59XHJcbmV4cG9ydHMuZGVjb3JhdGUgPSBkZWNvcmF0ZTtcclxuLyoqXHJcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cclxuICovXHJcbmZ1bmN0aW9uIHcod2lkZ2V0Q29uc3RydWN0b3IsIHByb3BlcnRpZXMsIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHZvaWQgMCkgeyBjaGlsZHJlbiA9IFtdOyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3Rvcjogd2lkZ2V0Q29uc3RydWN0b3IsXHJcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBleHBvcnRzLldOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudyA9IHc7XHJcbmZ1bmN0aW9uIHYodGFnLCBwcm9wZXJ0aWVzT3JDaGlsZHJlbiwgY2hpbGRyZW4pIHtcclxuICAgIGlmIChwcm9wZXJ0aWVzT3JDaGlsZHJlbiA9PT0gdm9pZCAwKSB7IHByb3BlcnRpZXNPckNoaWxkcmVuID0ge307IH1cclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdm9pZCAwKSB7IGNoaWxkcmVuID0gdW5kZWZpbmVkOyB9XHJcbiAgICB2YXIgcHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xyXG4gICAgdmFyIGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllc09yQ2hpbGRyZW4pKSB7XHJcbiAgICAgICAgY2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcclxuICAgICAgICBwcm9wZXJ0aWVzID0ge307XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6IHRhZyxcclxuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjazogZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXHJcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgdHlwZTogZXhwb3J0cy5WTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnYgPSB2O1xyXG4vKipcclxuICogQ3JlYXRlIGEgVk5vZGUgZm9yIGFuIGV4aXN0aW5nIERPTSBOb2RlLlxyXG4gKi9cclxuZnVuY3Rpb24gZG9tKF9hLCBjaGlsZHJlbikge1xyXG4gICAgdmFyIG5vZGUgPSBfYS5ub2RlLCBfYiA9IF9hLmF0dHJzLCBhdHRycyA9IF9iID09PSB2b2lkIDAgPyB7fSA6IF9iLCBfYyA9IF9hLnByb3BzLCBwcm9wcyA9IF9jID09PSB2b2lkIDAgPyB7fSA6IF9jLCBfZCA9IF9hLm9uLCBvbiA9IF9kID09PSB2b2lkIDAgPyB7fSA6IF9kLCBfZSA9IF9hLmRpZmZUeXBlLCBkaWZmVHlwZSA9IF9lID09PSB2b2lkIDAgPyAnbm9uZScgOiBfZTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiBpc0VsZW1lbnROb2RlKG5vZGUpID8gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wcyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBhdHRycyxcclxuICAgICAgICBldmVudHM6IG9uLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICB0eXBlOiBleHBvcnRzLlZOT0RFLFxyXG4gICAgICAgIGRvbU5vZGU6IG5vZGUsXHJcbiAgICAgICAgdGV4dDogaXNFbGVtZW50Tm9kZShub2RlKSA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YSxcclxuICAgICAgICBkaWZmVHlwZTogZGlmZlR5cGVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kb20gPSBkb207XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5hZnRlclJlbmRlciA9IGFmdGVyUmVuZGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBhZnRlclJlbmRlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG5mdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZCkge1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5iZWZvcmVQcm9wZXJ0aWVzID0gYmVmb3JlUHJvcGVydGllcztcclxuZXhwb3J0cy5kZWZhdWx0ID0gYmVmb3JlUHJvcGVydGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCIuLi9yZWdpc3RlckN1c3RvbUVsZW1lbnRcIik7XHJcbi8qKlxyXG4gKiBUaGlzIERlY29yYXRvciBpcyBwcm92aWRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGN1c3RvbSBlbGVtZW50LCBhbmRcclxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjdXN0b21FbGVtZW50KF9hKSB7XHJcbiAgICB2YXIgdGFnID0gX2EudGFnLCBfYiA9IF9hLnByb3BlcnRpZXMsIHByb3BlcnRpZXMgPSBfYiA9PT0gdm9pZCAwID8gW10gOiBfYiwgX2MgPSBfYS5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzID0gX2MgPT09IHZvaWQgMCA/IFtdIDogX2MsIF9kID0gX2EuZXZlbnRzLCBldmVudHMgPSBfZCA9PT0gdm9pZCAwID8gW10gOiBfZCwgX2UgPSBfYS5jaGlsZFR5cGUsIGNoaWxkVHlwZSA9IF9lID09PSB2b2lkIDAgPyByZWdpc3RlckN1c3RvbUVsZW1lbnRfMS5DdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8gOiBfZTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0LnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0YWdOYW1lOiB0YWcsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnRzLFxyXG4gICAgICAgICAgICBjaGlsZFR5cGU6IGNoaWxkVHlwZVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuY3VzdG9tRWxlbWVudCA9IGN1c3RvbUVsZW1lbnQ7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGN1c3RvbUVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb2Ygd2hpY2ggdGhlIGRpZmYgZnVuY3Rpb24gaXMgYXBwbGllZFxyXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXHJcbiAqIEBwYXJhbSBkaWZmRnVuY3Rpb24gIEEgZGlmZiBmdW5jdGlvbiB0byBydW4gaWYgZGlmZlR5cGUgaWYgRGlmZlR5cGUuQ1VTVE9NXHJcbiAqL1xyXG5mdW5jdGlvbiBkaWZmUHJvcGVydHkocHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24sIHJlYWN0aW9uRnVuY3Rpb24pIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKFwiZGlmZlByb3BlcnR5OlwiICsgcHJvcGVydHlOYW1lLCBkaWZmRnVuY3Rpb24uYmluZChudWxsKSk7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignZGlmZlJlYWN0aW9uJywge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbjogcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogcmVhY3Rpb25GdW5jdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRpZmZQcm9wZXJ0eSA9IGRpZmZQcm9wZXJ0eTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZGlmZlByb3BlcnR5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXHJcbiAqIG9yIHRoZSBtZXRob2QgbGV2ZWwuXHJcbiAqXHJcbiAqIEBwYXJhbSBoYW5kbGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuaGFuZGxlRGVjb3JhdG9yID0gaGFuZGxlRGVjb3JhdG9yO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBoYW5kbGVEZWNvcmF0b3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGJlZm9yZVByb3BlcnRpZXNfMSA9IHJlcXVpcmUoXCIuL2JlZm9yZVByb3BlcnRpZXNcIik7XHJcbi8qKlxyXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXHJcbiAqL1xyXG52YXIgcmVnaXN0ZXJlZEluamVjdG9yc01hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4vKipcclxuICogRGVjb3JhdG9yIHJldHJpZXZlcyBhbiBpbmplY3RvciBmcm9tIGFuIGF2YWlsYWJsZSByZWdpc3RyeSB1c2luZyB0aGUgbmFtZSBhbmRcclxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXHJcbiAqIGFuZCBjdXJyZW50IHByb3BlcnRpZXMgd2l0aCB0aGUgdGhlIGluamVjdGVkIHByb3BlcnRpZXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmplY3QoX2EpIHtcclxuICAgIHZhciBuYW1lID0gX2EubmFtZSwgZ2V0UHJvcGVydGllcyA9IF9hLmdldFByb3BlcnRpZXM7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgYmVmb3JlUHJvcGVydGllc18xLmJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGluamVjdG9yID0gdGhpcy5yZWdpc3RyeS5nZXRJbmplY3RvcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGluamVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnaXN0ZXJlZEluamVjdG9ycyA9IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuZ2V0KHRoaXMpIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9yc01hcC5zZXQodGhpcywgcmVnaXN0ZXJlZEluamVjdG9ycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5pbmRleE9mKGluamVjdG9yKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmplY3Rvci5vbignaW52YWxpZGF0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRJbmplY3RvcnMucHVzaChpbmplY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UHJvcGVydGllcyhpbmplY3Rvci5nZXQoKSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSh0YXJnZXQpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5pbmplY3QgPSBpbmplY3Q7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGluamVjdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9pbmplY3QuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5hbHdheXMgPSBhbHdheXM7XHJcbmZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5pZ25vcmUgPSBpZ25vcmU7XHJcbmZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcbmZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgICB2YXIgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xyXG4gICAgdmFyIHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcclxuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogY2hhbmdlZCxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5zaGFsbG93ID0gc2hhbGxvdztcclxuZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFJlZ2lzdHJ5XzEuV0lER0VUX0JBU0VfVFlQRSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmF1dG8gPSBhdXRvO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2xhbmdcIik7XHJcbnZhciBsYW5nXzIgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgY3NzVHJhbnNpdGlvbnNfMSA9IHJlcXVpcmUoXCIuLi9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zXCIpO1xyXG52YXIgYWZ0ZXJSZW5kZXJfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXJcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi8uLi9kXCIpO1xyXG52YXIgdmRvbV8xID0gcmVxdWlyZShcIi4vLi4vdmRvbVwiKTtcclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIGF0dGFjaCBzdGF0ZSBvZiB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgUHJvamVjdG9yQXR0YWNoU3RhdGU7XHJcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiQXR0YWNoZWRcIl0gPSAxXSA9IFwiQXR0YWNoZWRcIjtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiRGV0YWNoZWRcIl0gPSAyXSA9IFwiRGV0YWNoZWRcIjtcclxufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgPSBleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlIHx8IChleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEF0dGFjaCB0eXBlIGZvciB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgQXR0YWNoVHlwZTtcclxuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJBcHBlbmRcIl0gPSAxXSA9IFwiQXBwZW5kXCI7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJNZXJnZVwiXSA9IDJdID0gXCJNZXJnZVwiO1xyXG59KShBdHRhY2hUeXBlID0gZXhwb3J0cy5BdHRhY2hUeXBlIHx8IChleHBvcnRzLkF0dGFjaFR5cGUgPSB7fSkpO1xyXG5mdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgUHJvamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFByb2plY3RvciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliXzEuX19zcHJlYWQoYXJncykpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9oYW5kbGVzID0gW107XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc18xLmRlZmF1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgX3RoaXMucm9vdCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxyXG4gICAgICAgICAgICAgICAgcm9vdDogcm9vdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5NZXJnZSxcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcImFzeW5jXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGFzeW5jKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2FuZGJveCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGRvYyA9PT0gdm9pZCAwKSB7IGRvYyA9IGRvY3VtZW50OyB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgLyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXHJcbiAgICAgICAgICAgIHRoaXMub3duKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKHtcclxuICAgICAgICAgICAgICAgIC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cclxuICAgICAgICAgICAgICAgIHJvb3Q6IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2V0Q2hpbGRyZW4gPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBsYW5nXzEuYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldENvcmVQcm9wZXJ0aWVzX18uY2FsbCh0aGlzLCB7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5fX3NldFByb3BlcnRpZXNfXy5jYWxsKHRoaXMsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS50b0h0bWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgaXMgbm90IGF0dGFjaGVkLCBjYW5ub3QgcmV0dXJuIGFuIEhUTUwgc3RyaW5nIG9mIHByb2plY3Rpb24uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb24uZG9tTm9kZS5jaGlsZE5vZGVzWzBdLm91dGVySFRNTDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuYWZ0ZXJSZW5kZXIgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gZF8xLnYoJ3NwYW4nLCB7fSwgW3Jlc3VsdF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5vd24gPSBmdW5jdGlvbiAoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5fYXR0YWNoID0gZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gX2EudHlwZSwgcm9vdCA9IF9hLnJvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQ7XHJcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoSGFuZGxlID0gbGFuZ18yLmNyZWF0ZUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zLCB7IHN5bmM6ICF0aGlzLl9hc3luYyB9KTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuQXBwZW5kOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSB2ZG9tXzEuZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdmRvbV8xLmRvbS5tZXJnZSh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJfMS5hZnRlclJlbmRlcigpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3RvcjtcclxuICAgIH0oQmFzZSkpO1xyXG4gICAgcmV0dXJuIFByb2plY3RvcjtcclxufVxyXG5leHBvcnRzLlByb2plY3Rvck1peGluID0gUHJvamVjdG9yTWl4aW47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByb2plY3Rvck1peGluO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIEluamVjdG9yXzEgPSByZXF1aXJlKFwiLi8uLi9JbmplY3RvclwiKTtcclxudmFyIGluamVjdF8xID0gcmVxdWlyZShcIi4vLi4vZGVjb3JhdG9ycy9pbmplY3RcIik7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG52YXIgZGlmZlByb3BlcnR5XzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eVwiKTtcclxudmFyIGRpZmZfMSA9IHJlcXVpcmUoXCIuLy4uL2RpZmZcIik7XHJcbnZhciBUSEVNRV9LRVkgPSAnIF9rZXknO1xyXG5leHBvcnRzLklOSkVDVEVEX1RIRU1FX0tFWSA9IFN5bWJvbCgndGhlbWUnKTtcclxuLyoqXHJcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xyXG4gKi9cclxuZnVuY3Rpb24gdGhlbWUodGhlbWUpIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnLCB0aGVtZSk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLnRoZW1lID0gdGhlbWU7XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgcmV2ZXJzZSBsb29rdXAgZm9yIHRoZSBjbGFzc2VzIHBhc3NlZCBpbiB2aWEgdGhlIGB0aGVtZWAgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSBjbGFzc2VzIFRoZSBiYXNlQ2xhc3NlcyBvYmplY3RcclxuICogQHJlcXVpcmVzXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoY2xhc3Nlcykge1xyXG4gICAgcmV0dXJuIGNsYXNzZXMucmVkdWNlKGZ1bmN0aW9uIChjdXJyZW50Q2xhc3NOYW1lcywgYmFzZUNsYXNzKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoYmFzZUNsYXNzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgY3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50Q2xhc3NOYW1lcztcclxuICAgIH0sIHt9KTtcclxufVxyXG4vKipcclxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBpcyBnaXZlbiBhIHRoZW1lIGFuZCBhbiBvcHRpb25hbCByZWdpc3RyeSwgdGhlIHRoZW1lXHJcbiAqIGluamVjdG9yIGlzIGRlZmluZWQgYWdhaW5zdCB0aGUgcmVnaXN0cnksIHJldHVybmluZyB0aGUgdGhlbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB0aGVtZSB0aGUgdGhlbWUgdG8gc2V0XHJcbiAqIEBwYXJhbSB0aGVtZVJlZ2lzdHJ5IHJlZ2lzdHJ5IHRvIGRlZmluZSB0aGUgdGhlbWUgaW5qZWN0b3IgYWdhaW5zdC4gRGVmYXVsdHNcclxuICogdG8gdGhlIGdsb2JhbCByZWdpc3RyeVxyXG4gKlxyXG4gKiBAcmV0dXJucyB0aGUgdGhlbWUgaW5qZWN0b3IgdXNlZCB0byBzZXQgdGhlIHRoZW1lXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhlbWUsIHRoZW1lUmVnaXN0cnkpIHtcclxuICAgIHZhciB0aGVtZUluamVjdG9yID0gbmV3IEluamVjdG9yXzEuSW5qZWN0b3IodGhlbWUpO1xyXG4gICAgdGhlbWVSZWdpc3RyeS5kZWZpbmVJbmplY3RvcihleHBvcnRzLklOSkVDVEVEX1RIRU1FX0tFWSwgdGhlbWVJbmplY3Rvcik7XHJcbiAgICByZXR1cm4gdGhlbWVJbmplY3RvcjtcclxufVxyXG5leHBvcnRzLnJlZ2lzdGVyVGhlbWVJbmplY3RvciA9IHJlZ2lzdGVyVGhlbWVJbmplY3RvcjtcclxuLyoqXHJcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGNsYXNzIGRlY29yYXRlZCB3aXRoIHdpdGggVGhlbWVkIGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmZ1bmN0aW9uIFRoZW1lZE1peGluKEJhc2UpIHtcclxuICAgIHZhciBUaGVtZWQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoVGhlbWVkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRoZW1lZCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZWdpc3RlcmVkIGJhc2UgdGhlbWUga2V5c1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgX3RoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzID0gW107XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgY2xhc3NlcyBtZXRhIGRhdGEgbmVlZCB0byBiZSBjYWxjdWxhdGVkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgX3RoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMb2FkZWQgdGhlbWVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl90aGVtZSA9IHt9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUudGhlbWUgPSBmdW5jdGlvbiAoY2xhc3Nlcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5tYXAoZnVuY3Rpb24gKGNsYXNzTmFtZSkgeyByZXR1cm4gX3RoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3NOYW1lKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3Nlcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGdW5jdGlvbiBmaXJlZCB3aGVuIGB0aGVtZWAgb3IgYGV4dHJhQ2xhc3Nlc2AgYXJlIGNoYW5nZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVGhlbWVkLnByb3RvdHlwZS5vblByb3BlcnRpZXNDaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgVGhlbWVkLnByb3RvdHlwZS5fZ2V0VGhlbWVDbGFzcyA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZXh0cmFDbGFzc2VzID0gdGhpcy5wcm9wZXJ0aWVzLmV4dHJhQ2xhc3NlcyB8fCB7fTtcclxuICAgICAgICAgICAgdmFyIHRoZW1lQ2xhc3NOYW1lID0gdGhpcy5fYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXBbY2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdENsYXNzTmFtZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKCF0aGVtZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ2xhc3MgbmFtZTogJ1wiICsgY2xhc3NOYW1lICsgXCInIG5vdCBmb3VuZCBpbiB0aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRDbGFzc05hbWVzLmpvaW4oJyAnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMudGhlbWUsIHRoZW1lID0gX2EgPT09IHZvaWQgMCA/IHt9IDogX2E7XHJcbiAgICAgICAgICAgIHZhciBiYXNlVGhlbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoZnVuY3Rpb24gKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSBUSEVNRV9LRVksIGtleSA9IGJhc2VUaGVtZVtfYV0sIGNsYXNzZXMgPSB0c2xpYl8xLl9fcmVzdChiYXNlVGhlbWUsIFt0eXBlb2YgX2EgPT09IFwic3ltYm9sXCIgPyBfYSA6IF9hICsgXCJcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGZpbmFsQmFzZVRoZW1lLCBjbGFzc2VzKTtcclxuICAgICAgICAgICAgICAgIH0sIHt9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RoZW1lID0gdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucmVkdWNlKGZ1bmN0aW9uIChiYXNlVGhlbWUsIHRoZW1lS2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgYmFzZVRoZW1lLCB0aGVtZVt0aGVtZUtleV0pO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgZGlmZlByb3BlcnR5XzEuZGlmZlByb3BlcnR5KCd0aGVtZScsIGRpZmZfMS5zaGFsbG93KSxcclxuICAgICAgICAgICAgZGlmZlByb3BlcnR5XzEuZGlmZlByb3BlcnR5KCdleHRyYUNsYXNzZXMnLCBkaWZmXzEuc2hhbGxvdyksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbiAgICAgICAgXSwgVGhlbWVkLnByb3RvdHlwZSwgXCJvblByb3BlcnRpZXNDaGFuZ2VkXCIsIG51bGwpO1xyXG4gICAgICAgIFRoZW1lZCA9IHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGluamVjdF8xLmluamVjdCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBleHBvcnRzLklOSkVDVEVEX1RIRU1FX0tFWSxcclxuICAgICAgICAgICAgICAgIGdldFByb3BlcnRpZXM6IGZ1bmN0aW9uICh0aGVtZSwgcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydGllcy50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB0aGVtZTogdGhlbWUgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0sIFRoZW1lZCk7XHJcbiAgICAgICAgcmV0dXJuIFRoZW1lZDtcclxuICAgIH0oQmFzZSkpO1xyXG4gICAgcmV0dXJuIFRoZW1lZDtcclxufVxyXG5leHBvcnRzLlRoZW1lZE1peGluID0gVGhlbWVkTWl4aW47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRoZW1lZE1peGluO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCIuL1dpZGdldEJhc2VcIik7XHJcbnZhciBQcm9qZWN0b3JfMSA9IHJlcXVpcmUoXCIuL21peGlucy9Qcm9qZWN0b3JcIik7XHJcbnZhciBhcnJheV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vYXJyYXlcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9nbG9iYWxcIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBUaGVtZWRfMSA9IHJlcXVpcmUoXCIuL21peGlucy9UaGVtZWRcIik7XHJcbnZhciBDdXN0b21FbGVtZW50Q2hpbGRUeXBlO1xyXG4oZnVuY3Rpb24gKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUpIHtcclxuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJET0pPXCJdID0gXCJET0pPXCI7XHJcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiTk9ERVwiXSA9IFwiTk9ERVwiO1xyXG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIlRFWFRcIl0gPSBcIlRFWFRcIjtcclxufSkoQ3VzdG9tRWxlbWVudENoaWxkVHlwZSA9IGV4cG9ydHMuQ3VzdG9tRWxlbWVudENoaWxkVHlwZSB8fCAoZXhwb3J0cy5DdXN0b21FbGVtZW50Q2hpbGRUeXBlID0ge30pKTtcclxuZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGUpIHtcclxuICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoRG9tVG9XaWRnZXRXcmFwcGVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIERvbVRvV2lkZ2V0V3JhcHBlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBEb21Ub1dpZGdldFdyYXBwZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3RoaXMucHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKCdvbicpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJfX1wiICsga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcHNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkXzEuZG9tKHsgbm9kZTogZG9tTm9kZSwgcHJvcHM6IHByb3BlcnRpZXMgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRG9tVG9XaWRnZXRXcmFwcGVyLCBcImRvbU5vZGVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkb21Ob2RlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gRG9tVG9XaWRnZXRXcmFwcGVyO1xyXG4gICAgfShXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSkpO1xyXG59XHJcbmV4cG9ydHMuRG9tVG9XaWRnZXRXcmFwcGVyID0gRG9tVG9XaWRnZXRXcmFwcGVyO1xyXG5mdW5jdGlvbiBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpIHtcclxuICAgIHZhciBhdHRyaWJ1dGVzID0gZGVzY3JpcHRvci5hdHRyaWJ1dGVzLCBjaGlsZFR5cGUgPSBkZXNjcmlwdG9yLmNoaWxkVHlwZTtcclxuICAgIHZhciBhdHRyaWJ1dGVNYXAgPSB7fTtcclxuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBhdHRyaWJ1dGVNYXBbYXR0cmlidXRlTmFtZV0gPSBwcm9wZXJ0eU5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoY2xhc3NfMSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBjbGFzc18xKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICAgICAgX3RoaXMuX2NoaWxkcmVuID0gW107XHJcbiAgICAgICAgICAgIF90aGlzLl9ldmVudFByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICAgICAgX3RoaXMuX2luaXRpYWxpc2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuY29ubmVjdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbml0aWFsaXNlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkb21Qcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gZGVzY3JpcHRvci5hdHRyaWJ1dGVzLCBwcm9wZXJ0aWVzID0gZGVzY3JpcHRvci5wcm9wZXJ0aWVzLCBldmVudHMgPSBkZXNjcmlwdG9yLmV2ZW50cztcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlcykpO1xyXG4gICAgICAgICAgICB0c2xpYl8xLl9fc3ByZWFkKGF0dHJpYnV0ZXMsIHByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3RoaXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZFByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnX18nKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9tUHJvcGVydGllc1tmaWx0ZXJlZFByb3BlcnR5TmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKTsgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gX3RoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpOyB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnJykudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZFByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnX19vbicpO1xyXG4gICAgICAgICAgICAgICAgZG9tUHJvcGVydGllc1tmaWx0ZXJlZFByb3BlcnR5TmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBfdGhpcy5fc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKTsgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudENhbGxiYWNrID0gX3RoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRDYWxsYmFjay5hcHBseSh2b2lkIDAsIHRzbGliXzEuX19zcHJlYWQoYXJncykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogYXJnc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBkb21Qcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLlRFWFQgPyB0aGlzLmNoaWxkTm9kZXMgOiB0aGlzLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICBhcnJheV8xLmZyb20oY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkVHlwZSA9PT0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5ET0pPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX3JlbmRlcigpOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fcmVuZGVyKCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jaGlsZHJlbi5wdXNoKERvbVRvV2lkZ2V0V3JhcHBlcihjaGlsZE5vZGUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jaGlsZHJlbi5wdXNoKGRfMS5kb20oeyBub2RlOiBjaGlsZE5vZGUgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5fY2hpbGRDb25uZWN0ZWQoZSk7IH0pO1xyXG4gICAgICAgICAgICB2YXIgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMuX3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9fY2hpbGRyZW5fXygpOyB9O1xyXG4gICAgICAgICAgICB2YXIgV3JhcHBlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgIHRzbGliXzEuX19leHRlbmRzKGNsYXNzXzIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGFzc18yKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsYXNzXzIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZF8xLncoV2lkZ2V0Q29uc3RydWN0b3IsIHdpZGdldFByb3BlcnRpZXMsIHJlbmRlckNoaWxkcmVuKCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc18yO1xyXG4gICAgICAgICAgICB9KFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKSk7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeV8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHRoZW1lQ29udGV4dCA9IFRoZW1lZF8xLnJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGlzLl9nZXRUaGVtZSgpLCByZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuYWRkRXZlbnRMaXN0ZW5lcignZG9qby10aGVtZS1zZXQnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGVtZUNvbnRleHQuc2V0KF90aGlzLl9nZXRUaGVtZSgpKTsgfSk7XHJcbiAgICAgICAgICAgIHZhciBQcm9qZWN0b3IgPSBQcm9qZWN0b3JfMS5Qcm9qZWN0b3JNaXhpbihXcmFwcGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yID0gbmV3IFByb2plY3RvcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3Iuc2V0UHJvcGVydGllcyh7IHJlZ2lzdHJ5OiByZWdpc3RyeSB9KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdkb2pvLWNlLWNvbm5lY3RlZCcsIHtcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX2dldFRoZW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdCAmJiBnbG9iYWxfMS5kZWZhdWx0LmRvam9jZSAmJiBnbG9iYWxfMS5kZWZhdWx0LmRvam9jZS50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbF8xLmRlZmF1bHQuZG9qb2NlLnRoZW1lc1tnbG9iYWxfMS5kZWZhdWx0LmRvam9jZS50aGVtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9jaGlsZENvbm5lY3RlZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gZS5kZXRhaWw7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUgPT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGlzdHMgPSB0aGlzLl9jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gY2hpbGQuZG9tTm9kZSA9PT0gbm9kZTsgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fcmVuZGVyKCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKG5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Rvam8tY2UtcmVuZGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogdGhpc1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fX3Byb3BlcnRpZXNfXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2V2ZW50UHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fX2NoaWxkcmVuX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoQ2hpbGQpIHsgcmV0dXJuIENoaWxkLmRvbU5vZGUuaXNXaWRnZXQ7IH0pLm1hcChmdW5jdGlvbiAoQ2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZG9tTm9kZSA9IENoaWxkLmRvbU5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRfMS53KENoaWxkLCB0c2xpYl8xLl9fYXNzaWduKHt9LCBkb21Ob2RlLl9fcHJvcGVydGllc19fKCkpLCB0c2xpYl8xLl9fc3ByZWFkKGRvbU5vZGUuX19jaGlsZHJlbl9fKCkpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAobmFtZSwgb2xkVmFsdWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVNYXBbbmFtZV07XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX3NldEV2ZW50UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX2dldEV2ZW50UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9hdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xhc3NfMSwgXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVNYXApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xhc3NfMS5wcm90b3R5cGUsIFwiaXNXaWRnZXRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY2xhc3NfMTtcclxuICAgIH0oSFRNTEVsZW1lbnQpKTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcclxuZnVuY3Rpb24gcmVnaXN0ZXIoV2lkZ2V0Q29uc3RydWN0b3IpIHtcclxuICAgIHZhciBkZXNjcmlwdG9yID0gV2lkZ2V0Q29uc3RydWN0b3IucHJvdG90eXBlICYmIFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xyXG4gICAgaWYgKCFkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGRlc2NyaXB0b3IgZm9yIEN1c3RvbSBFbGVtZW50LCBoYXZlIHlvdSBhZGRlZCB0aGUgQGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yIHRvIHlvdXIgV2lkZ2V0PycpO1xyXG4gICAgfVxyXG4gICAgZ2xvYmFsXzEuZGVmYXVsdC5jdXN0b21FbGVtZW50cy5kZWZpbmUoZGVzY3JpcHRvci50YWdOYW1lLCBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpKTtcclxufVxyXG5leHBvcnRzLnJlZ2lzdGVyID0gcmVnaXN0ZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHJlZ2lzdGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIGFycmF5XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9hcnJheVwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCIuL2RcIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBXZWFrTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9XZWFrTWFwXCIpO1xyXG52YXIgTkFNRVNQQUNFX1czID0gJ2h0dHA6Ly93d3cudzMub3JnLyc7XHJcbnZhciBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcclxudmFyIE5BTUVTUEFDRV9YTElOSyA9IE5BTUVTUEFDRV9XMyArICcxOTk5L3hsaW5rJztcclxudmFyIGVtcHR5QXJyYXkgPSBbXTtcclxuZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG52YXIgaW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxudmFyIHJlbmRlclF1ZXVlTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbmZ1bmN0aW9uIHNhbWUoZG5vZGUxLCBkbm9kZTIpIHtcclxuICAgIGlmIChkXzEuaXNWTm9kZShkbm9kZTEpICYmIGRfMS5pc1ZOb2RlKGRub2RlMikpIHtcclxuICAgICAgICBpZiAoZG5vZGUxLnRhZyAhPT0gZG5vZGUyLnRhZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZF8xLmlzV05vZGUoZG5vZGUxKSAmJiBkXzEuaXNXTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGRub2RlMS53aWRnZXRDb25zdHJ1Y3RvciAhPT0gZG5vZGUyLndpZGdldENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxudmFyIG1pc3NpbmdUcmFuc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGEgdHJhbnNpdGlvbnMgb2JqZWN0IHRvIHRoZSBwcm9qZWN0aW9uT3B0aW9ucyB0byBkbyBhbmltYXRpb25zJyk7XHJcbn07XHJcbmZ1bmN0aW9uIGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rvck9wdGlvbnMsIHByb2plY3Rvckluc3RhbmNlKSB7XHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc3R5bGVBcHBseWVyOiBmdW5jdGlvbiAoZG9tTm9kZSwgc3R5bGVOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLnN0eWxlW3N0eWxlTmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zaXRpb25zOiB7XHJcbiAgICAgICAgICAgIGVudGVyOiBtaXNzaW5nVHJhbnNpdGlvbixcclxuICAgICAgICAgICAgZXhpdDogbWlzc2luZ1RyYW5zaXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzOiBbXSxcclxuICAgICAgICBhZnRlclJlbmRlckNhbGxiYWNrczogW10sXHJcbiAgICAgICAgbm9kZU1hcDogbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCksXHJcbiAgICAgICAgZGVwdGg6IDAsXHJcbiAgICAgICAgbWVyZ2U6IGZhbHNlLFxyXG4gICAgICAgIHJlbmRlclNjaGVkdWxlZDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHJlbmRlclF1ZXVlOiBbXSxcclxuICAgICAgICBwcm9qZWN0b3JJbnN0YW5jZTogcHJvamVjdG9ySW5zdGFuY2VcclxuICAgIH07XHJcbiAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgZGVmYXVsdHMsIHByb2plY3Rvck9wdGlvbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnROYW1lLCBjdXJyZW50VmFsdWUsIHByb2plY3Rpb25PcHRpb25zLCBiaW5kLCBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICB2YXIgZXZlbnRNYXAgPSBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLmdldChkb21Ob2RlKSB8fCBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XHJcbiAgICB9XHJcbiAgICB2YXIgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChiaW5kKTtcclxuICAgIGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgY3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcclxuICAgICAgICAgICAgZXZ0LnRhcmdldFsnb25pbnB1dC12YWx1ZSddID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9LmJpbmQoYmluZCk7XHJcbiAgICB9XHJcbiAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XHJcbiAgICBldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIHZhciBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgY2xhc3Nlcykge1xyXG4gICAgaWYgKGNsYXNzZXMpIHtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cywgY3VycmVudCkge1xyXG4gICAgdmFyIGRpZmZUeXBlID0gY3VycmVudC5kaWZmVHlwZSwgcHJvcGVydGllcyA9IGN1cnJlbnQucHJvcGVydGllcywgYXR0cmlidXRlcyA9IGN1cnJlbnQuYXR0cmlidXRlcztcclxuICAgIGlmICghZGlmZlR5cGUgfHwgZGlmZlR5cGUgPT09ICd2ZG9tJykge1xyXG4gICAgICAgIHJldHVybiB7IHByb3BlcnRpZXM6IHByZXZpb3VzLnByb3BlcnRpZXMsIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkaWZmVHlwZSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcHJvcGVydGllczoge30sIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMgPyB7fSA6IHVuZGVmaW5lZCwgZXZlbnRzOiBwcmV2aW91cy5ldmVudHMgfTtcclxuICAgIH1cclxuICAgIHZhciBuZXdQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgIHByb3BlcnRpZXM6IHt9XHJcbiAgICB9O1xyXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSB7fTtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmV2ZW50cyA9IHByZXZpb3VzLmV2ZW50cztcclxuICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wTmFtZSkge1xyXG4gICAgICAgICAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXNbcHJvcE5hbWVdID0gZG9tTm9kZVtwcm9wTmFtZV07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0ck5hbWUpIHtcclxuICAgICAgICAgICAgbmV3UHJvcGVydGllcy5hdHRyaWJ1dGVzW2F0dHJOYW1lXSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3UHJvcGVydGllcztcclxuICAgIH1cclxuICAgIG5ld1Byb3BlcnRpZXMucHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgcHJvcHNbcHJvcGVydHldID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUocHJvcGVydHkpIHx8IGRvbU5vZGVbcHJvcGVydHldO1xyXG4gICAgICAgIHJldHVybiBwcm9wcztcclxuICAgIH0sIHt9KTtcclxuICAgIHJldHVybiBuZXdQcm9wZXJ0aWVzO1xyXG59XHJcbmZ1bmN0aW9uIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSAmJiAhcHJldmlvdXNWYWx1ZTtcclxuICAgIH1cclxuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5mb2N1cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIG9ubHlFdmVudHMpIHtcclxuICAgIGlmIChvbmx5RXZlbnRzID09PSB2b2lkIDApIHsgb25seUV2ZW50cyA9IGZhbHNlOyB9XHJcbiAgICB2YXIgZXZlbnRNYXAgPSBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLmdldChkb21Ob2RlKTtcclxuICAgIGlmIChldmVudE1hcCkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGlzRXZlbnQgPSBwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgfHwgb25seUV2ZW50cztcclxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IG9ubHlFdmVudHMgPyBwcm9wTmFtZSA6IHByb3BOYW1lLnN1YnN0cigyKTtcclxuICAgICAgICAgICAgaWYgKGlzRXZlbnQgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGV2ZW50TWFwLmdldChwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgYXR0ck5hbWUgPT09ICdocmVmJykge1xyXG4gICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChhdHRyTmFtZSA9PT0gJ3JvbGUnICYmIGF0dHJWYWx1ZSA9PT0gJycpIHx8IGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCBwcmV2aW91c0F0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgYXR0ck5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XHJcbiAgICB2YXIgYXR0ckNvdW50ID0gYXR0ck5hbWVzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcclxuICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyTmFtZXNbaV07XHJcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xyXG4gICAgICAgIHZhciBwcmV2aW91c0F0dHJWYWx1ZSA9IHByZXZpb3VzQXR0cmlidXRlc1thdHRyTmFtZV07XHJcbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gcHJldmlvdXNBdHRyVmFsdWUpIHtcclxuICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgIGlmIChpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPSB0cnVlOyB9XHJcbiAgICB2YXIgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgIHZhciBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xyXG4gICAgaWYgKHByb3BOYW1lcy5pbmRleE9mKCdjbGFzc2VzJykgPT09IC0xICYmIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgJiYgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xyXG4gICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV07XHJcbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NlcyAmJiBwcmV2aW91c0NsYXNzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMSA9IDA7IGlfMSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGlfMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc2VzW2lfMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDbGFzc2VzID0gdHNsaWJfMS5fX3NwcmVhZChjdXJyZW50Q2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8yID0gMDsgaV8yIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaV8yKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQ2xhc3NOYW1lID0gcHJldmlvdXNDbGFzc2VzW2lfMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0NsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsYXNzSW5kZXggPSBuZXdDbGFzc2VzLmluZGV4T2YocHJldmlvdXNDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDbGFzc2VzLnNwbGljZShjbGFzc0luZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzMgPSAwOyBpXzMgPCBuZXdDbGFzc2VzLmxlbmd0aDsgaV8zKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2lfM10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlfNCA9IDA7IGlfNCA8IGN1cnJlbnRDbGFzc2VzLmxlbmd0aDsgaV80KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2lfNF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnZm9jdXMnKSB7XHJcbiAgICAgICAgICAgIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRTdHlsZVZhbHVlID0gcHJldmlvdXNWYWx1ZSAmJiBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgbmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tVmFsdWUgPSBkb21Ob2RlW3Byb3BOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSAhPT0gJ2tleScgJiYgcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCAmJiBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBwcm9wTmFtZS5zdWJzdHIoMiksIHByb3BWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMsIHByb3BlcnRpZXMuYmluZCwgcHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnc2Nyb2xsTGVmdCcgfHwgcHJvcE5hbWUgPT09ICdzY3JvbGxUb3AnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbU5vZGVbcHJvcE5hbWVdICE9PSBwcm9wVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJvcGVydGllc1VwZGF0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gZmluZEluZGV4T2ZDaGlsZChjaGlsZHJlbiwgc2FtZUFzLCBzdGFydCkge1xyXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoc2FtZShjaGlsZHJlbltpXSwgc2FtZUFzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn1cclxuZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICBkb21Ob2RlOiBkb21Ob2RlLFxyXG4gICAgICAgIHR5cGU6IGRfMS5WTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnRvUGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlO1xyXG5mdW5jdGlvbiB0b1RleHRWTm9kZShkYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICB0ZXh0OiBcIlwiICsgZGF0YSxcclxuICAgICAgICBkb21Ob2RlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdHlwZTogZF8xLlZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudG9UZXh0Vk5vZGUgPSB0b1RleHRWTm9kZTtcclxuZnVuY3Rpb24gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxyXG4gICAgICAgIHJlbmRlcmVkOiBbXSxcclxuICAgICAgICBjb3JlUHJvcGVydGllczogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLFxyXG4gICAgICAgIGNoaWxkcmVuOiBpbnN0YW5jZS5jaGlsZHJlbixcclxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvcjogaW5zdGFuY2UuY29uc3RydWN0b3IsXHJcbiAgICAgICAgcHJvcGVydGllczogaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBkXzEuV05PREVcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZHJlbiwgaW5zdGFuY2UpIHtcclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGVtcHR5QXJyYXk7XHJcbiAgICB9XHJcbiAgICBjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7KSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGNoaWxkID09PSB1bmRlZmluZWQgfHwgY2hpbGQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltpXSA9IHRvVGV4dFZOb2RlKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3BlcnRpZXMuYmluZCA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkLmNvcmVQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VSZWdpc3RyeTogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbn1cclxuZXhwb3J0cy5maWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbjtcclxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlLCB0cmFuc2l0aW9ucykge1xyXG4gICAgaWYgKGRfMS5pc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIGVudGVyQW5pbWF0aW9uID0gZG5vZGUucHJvcGVydGllcy5lbnRlckFuaW1hdGlvbjtcclxuICAgICAgICBpZiAoZW50ZXJBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbnRlckFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZW50ZXJBbmltYXRpb24oZG5vZGUuZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5lbnRlcihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2FsbE9uRGV0YWNoKGROb2RlcywgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIGROb2RlcyA9IEFycmF5LmlzQXJyYXkoZE5vZGVzKSA/IGROb2RlcyA6IFtkTm9kZXNdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZE5vZGUgPSBkTm9kZXNbaV07XHJcbiAgICAgICAgaWYgKGRfMS5pc1dOb2RlKGROb2RlKSkge1xyXG4gICAgICAgICAgICBpZiAoZE5vZGUucmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChkTm9kZS5yZW5kZXJlZCwgZE5vZGUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGROb2RlLmluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZE5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChkTm9kZS5jaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vZGVUb1JlbW92ZShkbm9kZSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAoZF8xLmlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gZG5vZGUucmVuZGVyZWQgfHwgZW1wdHlBcnJheTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbmRlcmVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHJlbmRlcmVkW2ldO1xyXG4gICAgICAgICAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZG9tTm9kZV8xID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IGRub2RlLnByb3BlcnRpZXM7XHJcbiAgICAgICAgdmFyIGV4aXRBbmltYXRpb24gPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBkb21Ob2RlXzEuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgICAgdmFyIHJlbW92ZURvbU5vZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlXzEgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZV8xKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleGl0QW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBleGl0QW5pbWF0aW9uKGRvbU5vZGVfMSwgcmVtb3ZlRG9tTm9kZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24sIHJlbW92ZURvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbU5vZGVfMSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlXzEpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKGNoaWxkTm9kZXMsIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIHZhciBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGROb2RlKSAmJiAhY2hpbGROb2RlLnRhZykge1xyXG4gICAgICAgIHJldHVybjsgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcclxuICAgIH1cclxuICAgIHZhciBrZXkgPSBjaGlsZE5vZGUucHJvcGVydGllcy5rZXk7XHJcbiAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYW1lKG5vZGUsIGNoaWxkTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZUlkZW50aWZpZXIgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnRJbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZF8xLmlzV05vZGUoY2hpbGROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS53aWRnZXRDb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLnRhZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQSB3aWRnZXQgKFwiICsgcGFyZW50TmFtZSArIFwiKSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50IChcIiArIG5vZGVJZGVudGlmaWVyICsgXCIpIG11bHRpcGxlIHRpbWVzIGFzIHNpYmxpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBvbGRDaGlsZHJlbiwgbmV3Q2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgb2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xyXG4gICAgbmV3Q2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcclxuICAgIHZhciBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcclxuICAgIHZhciBuZXdDaGlsZHJlbkxlbmd0aCA9IG5ld0NoaWxkcmVuLmxlbmd0aDtcclxuICAgIHZhciB0cmFuc2l0aW9ucyA9IHByb2plY3Rpb25PcHRpb25zLnRyYW5zaXRpb25zO1xyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH0pO1xyXG4gICAgdmFyIG9sZEluZGV4ID0gMDtcclxuICAgIHZhciBuZXdJbmRleCA9IDA7XHJcbiAgICB2YXIgaTtcclxuICAgIHZhciB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltuZXdJbmRleF07XHJcbiAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKG5ld0NoaWxkKSAmJiB0eXBlb2YgbmV3Q2hpbGQuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbmV3Q2hpbGQuaW5zZXJ0ZWQgPSBkXzEuaXNWTm9kZShvbGRDaGlsZCkgJiYgb2xkQ2hpbGQuaW5zZXJ0ZWQ7XHJcbiAgICAgICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcclxuICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBmaW5kT2xkSW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG9sZENoaWxkcmVuLCBuZXdDaGlsZCwgb2xkSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgaWYgKGZpbmRPbGRJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkQ2hpbGRfMSA9IG9sZENoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleFRvQ2hlY2sgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2gob2xkQ2hpbGRfMSwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgZmluZE9sZEluZGV4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfbG9vcF8yKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlRG9tKG9sZENoaWxkcmVuW2ZpbmRPbGRJbmRleF0sIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gZmluZE9sZEluZGV4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBvbGRDaGlsZHJlbltvbGRJbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gb2xkSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnNlcnRCZWZvcmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZF8xLmlzV05vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQucmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLnJlbmRlcmVkWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob2xkQ2hpbGRyZW5bbmV4dEluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gb2xkQ2hpbGRyZW5bbmV4dEluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlID0gY2hpbGQuZG9tTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNyZWF0ZURvbShuZXdDaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIG5vZGVBZGRlZChuZXdDaGlsZCwgdHJhbnNpdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4VG9DaGVja18xID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShuZXdDaGlsZHJlbiwgaW5kZXhUb0NoZWNrXzEsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld0luZGV4Kys7XHJcbiAgICB9O1xyXG4gICAgd2hpbGUgKG5ld0luZGV4IDwgbmV3Q2hpbGRyZW5MZW5ndGgpIHtcclxuICAgICAgICBfbG9vcF8xKCk7XHJcbiAgICB9XHJcbiAgICBpZiAob2xkQ2hpbGRyZW5MZW5ndGggPiBvbGRJbmRleCkge1xyXG4gICAgICAgIHZhciBfbG9vcF8zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgb2xkQ2hpbGQgPSBvbGRDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9DaGVjayA9IGk7XHJcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBSZW1vdmUgY2hpbGQgZnJhZ21lbnRzXHJcbiAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIF9sb29wXzMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIGNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcykge1xyXG4gICAgaWYgKGluc2VydEJlZm9yZSA9PT0gdm9pZCAwKSB7IGluc2VydEJlZm9yZSA9IHVuZGVmaW5lZDsgfVxyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgY2hpbGROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY2hpbGROb2RlcyA9IGFycmF5XzEuZnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlLmNoaWxkTm9kZXMpO1xyXG4gICAgfVxyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH0pO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb21FbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21FbGVtZW50ID0gY2hpbGROb2Rlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQudGFnTmFtZSA9PT0gKGNoaWxkLnRhZy50b1VwcGVyQ2FzZSgpIHx8IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcclxuICAgIGlmICh0eXBlb2YgZG5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgZG5vZGUuaW5zZXJ0ZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XHJcbiAgICAgICAgdXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCB7fSwgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSk7XHJcbiAgICAgICAgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwge30sIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xyXG4gICAgICAgIHZhciBldmVudHNfMSA9IGRub2RlLmV2ZW50cztcclxuICAgICAgICBPYmplY3Qua2V5cyhldmVudHNfMSkuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnQsIGV2ZW50c18xW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHt9LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBcIlwiICsgZG5vZGUucHJvcGVydGllcy5rZXkpO1xyXG4gICAgfVxyXG4gICAgZG5vZGUuaW5zZXJ0ZWQgPSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZURvbShkbm9kZSwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKSB7XHJcbiAgICB2YXIgZG9tTm9kZTtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgd2lkZ2V0Q29uc3RydWN0b3IgPSBkbm9kZS53aWRnZXRDb25zdHJ1Y3RvcjtcclxuICAgICAgICB2YXIgcGFyZW50SW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIGlmICghUmVnaXN0cnlfMS5pc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcih3aWRnZXRDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBwYXJlbnRJbnN0YW5jZURhdGEucmVnaXN0cnkoKS5nZXQod2lkZ2V0Q29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpZGdldENvbnN0cnVjdG9yID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluc3RhbmNlXzEgPSBuZXcgd2lkZ2V0Q29uc3RydWN0b3IoKTtcclxuICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlXzE7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YV8xID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2VfMSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhXzEuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhXzEucmVuZGVyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZTogaW5zdGFuY2VfMSwgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5yZW5kZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgIGluc3RhbmNlXzEuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZV8xLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgaW5zdGFuY2VfMS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICB2YXIgcmVuZGVyZWQgPSBpbnN0YW5jZV8xLl9fcmVuZGVyX18oKTtcclxuICAgICAgICBpZiAocmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZV8xKTtcclxuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJlZFJlbmRlcmVkO1xyXG4gICAgICAgICAgICBhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlXzEsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZV8xLCB7IGRub2RlOiBkbm9kZSwgcGFyZW50Vk5vZGU6IHBhcmVudFZOb2RlIH0pO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhXzEub25BdHRhY2goKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudDtcclxuICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkb2MgPSBwYXJlbnRWTm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQ7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlICE9PSB1bmRlZmluZWQgJiYgcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Vk5vZGUuZG9tTm9kZSA9PT0gZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKG5ld0RvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSAmJiBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkbm9kZS50YWcgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlIHx8IGRvYy5jcmVhdGVFbGVtZW50KGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZG9tTm9kZS5wYXJlbnROb2RlICE9PSBwYXJlbnRWTm9kZS5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZURvbShwcmV2aW91cywgZG5vZGUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBwcmV2aW91cy5pbnN0YW5jZTtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdmFyIF9hID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSwgcGFyZW50Vk5vZGVfMSA9IF9hLnBhcmVudFZOb2RlLCBub2RlID0gX2EuZG5vZGU7XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1JlbmRlcmVkID0gbm9kZSA/IG5vZGUucmVuZGVyZWQgOiBwcmV2aW91cy5yZW5kZXJlZDtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZTogZG5vZGUsIHBhcmVudFZOb2RlOiBwYXJlbnRWTm9kZV8xIH0pO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlXzEsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCB1bmRlZmluZWQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSBkbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkb21Ob2RlXzIgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xyXG4gICAgICAgIHZhciB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB1cGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS50ZXh0ICE9PSBwcmV2aW91cy50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9tTm9kZSA9IGRvbU5vZGVfMi5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZV8yLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRvbU5vZGVfMik7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGRub2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1Byb3BlcnRpZXNfMSA9IGJ1aWxkUHJldmlvdXNQcm9wZXJ0aWVzKGRvbU5vZGVfMiwgcHJldmlvdXMsIGRub2RlKTtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGVfMiwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuYXR0cmlidXRlcywgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlXzIsIHByZXZpb3VzUHJvcGVydGllc18xLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSkgfHwgdXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGVfMiwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuZXZlbnRzLCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudHNfMiA9IGRub2RlLmV2ZW50cztcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV2ZW50c18yKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGVfMiwgZXZlbnQsIGV2ZW50c18yW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZV8yLCBwcmV2aW91c1Byb3BlcnRpZXNfMS5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZV8yLCBcIlwiICsgZG5vZGUucHJvcGVydGllcy5rZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1cGRhdGVkICYmIGRub2RlLnByb3BlcnRpZXMgJiYgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZV8yLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgLy8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xyXG4gICAgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzID0gdm5vZGUucHJvcGVydGllcztcclxuICAgIHZhciBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2soISF2bm9kZS5pbnNlcnRlZCk7XHJcbiAgICB2bm9kZS5wcm9wZXJ0aWVzID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcywgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzKTtcclxuICAgIHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2soISF2bm9kZS5pbnNlcnRlZCksIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlLCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgdm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RJZGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID0gZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID0gdW5kZWZpbmVkO1xyXG4gICAgdmFyIHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHZhciByZW5kZXJzID0gdHNsaWJfMS5fX3NwcmVhZChyZW5kZXJRdWV1ZSk7XHJcbiAgICByZW5kZXJRdWV1ZU1hcC5zZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UsIFtdKTtcclxuICAgIHJlbmRlcnMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5kZXB0aCAtIGIuZGVwdGg7IH0pO1xyXG4gICAgd2hpbGUgKHJlbmRlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gcmVuZGVycy5zaGlmdCgpLmluc3RhbmNlO1xyXG4gICAgICAgIHZhciBfYSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSksIHBhcmVudFZOb2RlID0gX2EucGFyZW50Vk5vZGUsIGRub2RlID0gX2EuZG5vZGU7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICB1cGRhdGVEb20oZG5vZGUsIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XHJcbiAgICB9XHJcbiAgICBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbn1cclxuZXhwb3J0cy5kb20gPSB7XHJcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMgPT09IHZvaWQgMCkgeyBwcm9qZWN0aW9uT3B0aW9ucyA9IHt9OyB9XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICB2YXIgZmluYWxQcm9qZWN0b3JPcHRpb25zID0gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlKTtcclxuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xyXG4gICAgICAgIHZhciBwYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGUoZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlKTtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKTtcclxuICAgICAgICB2YXIgcmVuZGVyUXVldWUgPSBbXTtcclxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGU6IG5vZGUsIHBhcmVudFZOb2RlOiBwYXJlbnRWTm9kZSB9KTtcclxuICAgICAgICByZW5kZXJRdWV1ZU1hcC5zZXQoZmluYWxQcm9qZWN0b3JPcHRpb25zLnByb2plY3Rvckluc3RhbmNlLCByZW5kZXJRdWV1ZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlclF1ZXVlXzEgPSByZW5kZXJRdWV1ZU1hcC5nZXQoZmluYWxQcm9qZWN0b3JPcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlclF1ZXVlXzEucHVzaCh7IGluc3RhbmNlOiBpbnN0YW5jZSwgZGVwdGg6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5kZXB0aCB9KTtcclxuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHVwZGF0ZURvbShub2RlLCBub2RlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgZmluYWxQcm9qZWN0b3JPcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEub25BdHRhY2goKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZG9tTm9kZTogZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIChpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgbWVyZ2U6IGZ1bmN0aW9uIChlbGVtZW50LCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMgPT09IHZvaWQgMCkgeyBwcm9qZWN0aW9uT3B0aW9ucyA9IHt9OyB9XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgPSB0cnVlO1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH1cclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xudmFyIHdpZGdldEZhY3RvcnkgPSByZXF1aXJlKFwic3JjL21lbnUtaXRlbS9NZW51SXRlbVwiKTtcblxudmFyIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudCA9IHJlcXVpcmUoJ0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudCcpLmRlZmF1bHQ7XG5cbnZhciBkZWZhdWx0RXhwb3J0ID0gd2lkZ2V0RmFjdG9yeS5kZWZhdWx0O1xuZGVmYXVsdEV4cG9ydCAmJiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVmYXVsdEV4cG9ydCk7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUtaXRlbS9NZW51SXRlbSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51LWl0ZW0vTWVudUl0ZW0hLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG4vLyBPbiBzb21lIGV4b3RpYyBlbnZpcm9ubWVudHMsIGl0J3Mgbm90IGNsZWFyIHdoaWNoIG9iamVjdCBgc2V0aW1tZWlkYXRlYCB3YXNcbi8vIGFibGUgdG8gaW5zdGFsbCBvbnRvLiAgU2VhcmNoIGVhY2ggcG9zc2liaWxpdHkgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlXG4vLyBgc2V0aW1tZWRpYXRlYCBsaWJyYXJ5LlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuc2V0SW1tZWRpYXRlKTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5jbGVhckltbWVkaWF0ZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXG5cdFx0ZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XG5pbXBvcnQgeyBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcblxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudUl0ZW0ubS5jc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtUHJvcGVydGllcyBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHR0aXRsZTogc3RyaW5nO1xuXHRzZWxlY3RlZD86IGJvb2xlYW47XG5cdGRhdGE/OiBhbnk7XG5cdG9uU2VsZWN0ZWQ/OiAoZGF0YTogYW55KSA9PiB2b2lkO1xufVxuXG5AY3VzdG9tRWxlbWVudDxNZW51SXRlbVByb3BlcnRpZXM+KHtcblx0dGFnOiAnZGVtby1tZW51LWl0ZW0nLFxuXHRhdHRyaWJ1dGVzOiBbJ3RpdGxlJywgJ3NlbGVjdGVkJ10sXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ10sXG5cdHByb3BlcnRpZXM6IFsnZGF0YScsICdzZWxlY3RlZCddXG59KVxuQHRoZW1lKGNzcylcbmV4cG9ydCBjbGFzcyBNZW51SXRlbSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVJdGVtUHJvcGVydGllcz4ge1xuXHRwcml2YXRlIF9vbkNsaWNrKCkge1xuXHRcdHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkICYmIHRoaXMucHJvcGVydGllcy5vblNlbGVjdGVkKHRoaXMucHJvcGVydGllcy5kYXRhKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0Y29uc3QgeyB0aXRsZSwgc2VsZWN0ZWQgfSA9IHRoaXMucHJvcGVydGllcztcblxuXHRcdHJldHVybiB2KCdsaScsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xuXHRcdFx0dihcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShbY3NzLml0ZW0sIHNlbGVjdGVkID8gY3NzLnNlbGVjdGVkIDogbnVsbF0pLFxuXHRcdFx0XHRcdG9uY2xpY2s6IHRoaXMuX29uQ2xpY2tcblx0XHRcdFx0fSxcblx0XHRcdFx0W3RpdGxlXVxuXHRcdFx0KVxuXHRcdF0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVJdGVtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9tZW51LWl0ZW0hLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcInRlc3QtYXBwL21lbnVJdGVtXCIsXCJyb290XCI6XCJzVW1VaTRTaFwiLFwiaXRlbVwiOlwiXzJNazZSZHFhXCIsXCJzZWxlY3RlZFwiOlwiXzEtZjNJdE9oXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIl0sInNvdXJjZVJvb3QiOiIifQ==