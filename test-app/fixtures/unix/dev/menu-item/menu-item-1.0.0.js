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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTA3ZGMxNTU5ZjRmMjMyYzQ0NDIiLCJ3ZWJwYWNrOi8vL0Rlc3Ryb3lhYmxlLnRzIiwid2VicGFjazovLy9FdmVudGVkLnRzIiwid2VicGFjazovLy9sYW5nLnRzIiwid2VicGFjazovLy9oYXMudHMiLCJ3ZWJwYWNrOi8vL01hcC50cyIsIndlYnBhY2s6Ly8vUHJvbWlzZS50cyIsIndlYnBhY2s6Ly8vU3ltYm9sLnRzIiwid2VicGFjazovLy9XZWFrTWFwLnRzIiwid2VicGFjazovLy9hcnJheS50cyIsIndlYnBhY2s6Ly8vZ2xvYmFsLnRzIiwid2VicGFjazovLy9pdGVyYXRvci50cyIsIndlYnBhY2s6Ly8vbnVtYmVyLnRzIiwid2VicGFjazovLy9vYmplY3QudHMiLCJ3ZWJwYWNrOi8vL3N0cmluZy50cyIsIndlYnBhY2s6Ly8vcXVldWUudHMiLCJ3ZWJwYWNrOi8vL3V0aWwudHMiLCJ3ZWJwYWNrOi8vL0luamVjdG9yLnRzIiwid2VicGFjazovLy9Ob2RlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vUmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vL1JlZ2lzdHJ5SGFuZGxlci50cyIsIndlYnBhY2s6Ly8vV2lkZ2V0QmFzZS50cyIsIndlYnBhY2s6Ly8vY3NzVHJhbnNpdGlvbnMudHMiLCJ3ZWJwYWNrOi8vL2QudHMiLCJ3ZWJwYWNrOi8vL2FmdGVyUmVuZGVyLnRzIiwid2VicGFjazovLy9iZWZvcmVQcm9wZXJ0aWVzLnRzIiwid2VicGFjazovLy9jdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9kaWZmUHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vL2hhbmRsZURlY29yYXRvci50cyIsIndlYnBhY2s6Ly8vaW5qZWN0LnRzIiwid2VicGFjazovLy9kaWZmLnRzIiwid2VicGFjazovLy9Qcm9qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL1RoZW1lZC50cyIsIndlYnBhY2s6Ly8vcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy92ZG9tLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzcz9hNTA3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM1REE7QUFDQTtBQUVBOzs7QUFHQTtJQUNDLE9BQU8saUJBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzlCO0FBRUE7OztBQUdBO0lBQ0MsTUFBTSxJQUFJLEtB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QVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7QUN2THRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBDQUEwQyxzQkFBc0IsRUFBRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7O0FDekxEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBO0FBQUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxnQkFBZ0Isc0NBQXNDLGlCQUFpQixFQUFFO0FBQy9FLHFCQUFxQix1REFBdUQ7O0FBRTVFO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEMsT0FBTztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsY0FBYztBQUMxRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxvQ0FBb0M7QUFDdkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsNkJBQTZCLDBCQUEwQixhQUFhLEVBQUUscUJBQXFCO0FBQ3hHLGdCQUFnQixxREFBcUQsb0VBQW9FLGFBQWEsRUFBRTtBQUN4SixzQkFBc0Isc0JBQXNCLHFCQUFxQixHQUFHO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QyxrQ0FBa0MsU0FBUztBQUMzQyxrQ0FBa0MsV0FBVyxVQUFVO0FBQ3ZELHlDQUF5QyxjQUFjO0FBQ3ZEO0FBQ0EsNkdBQTZHLE9BQU8sVUFBVTtBQUM5SCxnRkFBZ0YsaUJBQWlCLE9BQU87QUFDeEcsd0RBQXdELGdCQUFnQixRQUFRLE9BQU87QUFDdkYsOENBQThDLGdCQUFnQixnQkFBZ0IsT0FBTztBQUNyRjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EsU0FBUyxZQUFZLGFBQWEsT0FBTyxFQUFFLFVBQVUsV0FBVztBQUNoRSxtQ0FBbUMsU0FBUztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE1BQU0sZ0JBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsc0JBQXNCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNGQUFzRixhQUFhLEVBQUU7QUFDdEgsc0JBQXNCLGdDQUFnQyxxQ0FBcUMsMENBQTBDLEVBQUUsRUFBRSxHQUFHO0FBQzVJLDJCQUEyQixNQUFNLGVBQWUsRUFBRSxZQUFZLG9CQUFvQixFQUFFO0FBQ3BGLHNCQUFzQixvR0FBb0c7QUFDMUgsNkJBQTZCLHVCQUF1QjtBQUNwRCw0QkFBNEIsd0JBQXdCO0FBQ3BELDJCQUEyQix5REFBeUQ7QUFDcEY7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQiw0Q0FBNEMsU0FBUyxFQUFFLHFEQUFxRCxhQUFhLEVBQUU7QUFDNUkseUJBQXlCLGdDQUFnQyxvQkFBb0IsZ0RBQWdELGdCQUFnQixHQUFHO0FBQ2hKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsdUNBQXVDLGFBQWEsRUFBRSxFQUFFLE9BQU8sa0JBQWtCO0FBQ2pIO0FBQ0E7Ozs7Ozs7O0FDcktBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDOzs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQWdCQTtJQUE4QjtJQUE5Qjs7SUFtQkE7SUFsQlMsNEJBQVEsRUFBaEI7UUFDQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVUsR0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUMvRSxDQUFDO0lBRVMsMEJBQU0sRUFBaEI7UUFDTyx3QkFBcUMsRUFBbkMsZ0JBQUssRUFBRSxzQkFBUTtRQUV2QixPQUFPLEtBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLENBQUUsRUFBRTtZQUNqRCxLQUFDLENBQ0EsTUFBTSxFQUNOO2dCQUNDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0QsT0FBTyxFQUFFLElBQUksQ0FBQzthQUNkLEVBQ0QsQ0FBQyxLQUFLLENBQUM7U0FFUixDQUFDO0lBQ0gsQ0FBQztJQWxCVyxTQUFRO1FBUHBCLDZCQUFhLENBQXFCO1lBQ2xDLEdBQUcsRUFBRSxnQkFBZ0I7WUFDckIsVUFBVSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztZQUNqQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdEIsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVU7U0FDL0IsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csUUFBUSxDQW1CcEI7SUFBRCxlQUFDO0NBbkJELENBQThCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUF4QztBQXFCYixrQkFBZSxRQUFROzs7Ozs7OztBQzNDdkI7QUFDQSxrQkFBa0IseUYiLCJmaWxlIjoibWVudS1pdGVtLTEuMC4wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTA3ZGMxNTU5ZjRmMjMyYzQ0NDIiLCJpbXBvcnQgeyBIYW5kbGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgY3JlYXRlQ29tcG9zaXRlSGFuZGxlIH0gZnJvbSAnLi9sYW5nJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG5cbi8qKlxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xufVxuXG4vKipcbiAqIE5vIG9wIGZ1bmN0aW9uIHVzZWQgdG8gcmVwbGFjZSBvd24sIG9uY2UgaW5zdGFuY2UgaGFzIGJlZW4gZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3llZCgpOiBuZXZlciB7XG5cdHRocm93IG5ldyBFcnJvcignQ2FsbCBtYWRlIHRvIGRlc3Ryb3llZCBtZXRob2QnKTtcbn1cblxuZXhwb3J0IGNsYXNzIERlc3Ryb3lhYmxlIHtcblx0LyoqXG5cdCAqIHJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cHJpdmF0ZSBoYW5kbGVzOiBIYW5kbGVbXTtcblxuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmhhbmRsZXMgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2UgdGhhdCB3aWxsIGJlIGRlc3Ryb3llZCB3aGVuIGB0aGlzLmRlc3Ryb3lgIGlzIGNhbGxlZFxuXHQgKlxuXHQgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2Vcblx0ICogQHJldHVybnMge0hhbmRsZX0gYSBoYW5kbGUgZm9yIHRoZSBoYW5kbGUsIHJlbW92ZXMgdGhlIGhhbmRsZSBmb3IgdGhlIGluc3RhbmNlIGFuZCBjYWxscyBkZXN0cm95XG5cdCAqL1xuXHRvd24oaGFuZGxlczogSGFuZGxlIHwgSGFuZGxlW10pOiBIYW5kbGUge1xuXHRcdGNvbnN0IGhhbmRsZSA9IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgPyBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlcykgOiBoYW5kbGVzO1xuXHRcdGNvbnN0IHsgaGFuZGxlczogX2hhbmRsZXMgfSA9IHRoaXM7XG5cdFx0X2hhbmRsZXMucHVzaChoYW5kbGUpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZXN0cm95KCkge1xuXHRcdFx0XHRfaGFuZGxlcy5zcGxpY2UoX2hhbmRsZXMuaW5kZXhPZihoYW5kbGUpKTtcblx0XHRcdFx0aGFuZGxlLmRlc3Ryb3koKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnl9IGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIGhhbmRsZXMgaGF2ZSBiZWVuIGRlc3Ryb3llZFxuXHQgKi9cblx0ZGVzdHJveSgpOiBQcm9taXNlPGFueT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0dGhpcy5oYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4ge1xuXHRcdFx0XHRoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5kZXN0cm95ID0gbm9vcDtcblx0XHRcdHRoaXMub3duID0gZGVzdHJveWVkO1xuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXN0cm95YWJsZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBEZXN0cm95YWJsZS50cyIsImltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgSGFuZGxlLCBFdmVudFR5cGUsIEV2ZW50T2JqZWN0IH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IERlc3Ryb3lhYmxlIH0gZnJvbSAnLi9EZXN0cm95YWJsZSc7XG5cbi8qKlxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xuICovXG5jb25zdCByZWdleE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBSZWdFeHA+KCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpcyB0aGUgZXZlbnQgdHlwZSBnbG9iIGhhcyBiZWVuIG1hdGNoZWRcbiAqXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmc6IHN0cmluZyB8IHN5bWJvbCwgdGFyZ2V0U3RyaW5nOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcblx0aWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcblx0XHRsZXQgcmVnZXg6IFJlZ0V4cDtcblx0XHRpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XG5cdFx0XHRyZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKSE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7Z2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJyl9JGApO1xuXHRcdFx0cmVnZXhNYXAuc2V0KGdsb2JTdHJpbmcsIHJlZ2V4KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlZ2V4LnRlc3QodGFyZ2V0U3RyaW5nKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZ2xvYlN0cmluZyA9PT0gdGFyZ2V0U3RyaW5nO1xuXHR9XG59XG5cbmV4cG9ydCB0eXBlIEV2ZW50ZWRDYWxsYmFjazxUID0gRXZlbnRUeXBlLCBFIGV4dGVuZHMgRXZlbnRPYmplY3Q8VD4gPSBFdmVudE9iamVjdDxUPj4gPSB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgYW4gYGV2ZW50YCBhcmd1bWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IG9iamVjdFxuXHQgKi9cblxuXHQoZXZlbnQ6IEUpOiBib29sZWFuIHwgdm9pZDtcbn07XG5cbi8qKlxuICogQSB0eXBlIHdoaWNoIGlzIGVpdGhlciBhIHRhcmdldGVkIGV2ZW50IGxpc3RlbmVyIG9yIGFuIGFycmF5IG9mIGxpc3RlbmVyc1xuICogQHRlbXBsYXRlIFQgVGhlIHR5cGUgb2YgdGFyZ2V0IGZvciB0aGUgZXZlbnRzXG4gKiBAdGVtcGxhdGUgRSBUaGUgZXZlbnQgdHlwZSBmb3IgdGhlIGV2ZW50c1xuICovXG5leHBvcnQgdHlwZSBFdmVudGVkQ2FsbGJhY2tPckFycmF5PFQgPSBFdmVudFR5cGUsIEUgZXh0ZW5kcyBFdmVudE9iamVjdDxUPiA9IEV2ZW50T2JqZWN0PFQ+PiA9XG5cdHwgRXZlbnRlZENhbGxiYWNrPFQsIEU+XG5cdHwgRXZlbnRlZENhbGxiYWNrPFQsIEU+W107XG5cbi8qKlxuICogRXZlbnQgQ2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50ZWQ8TSBleHRlbmRzIHt9ID0ge30sIFQgPSBFdmVudFR5cGUsIE8gZXh0ZW5kcyBFdmVudE9iamVjdDxUPiA9IEV2ZW50T2JqZWN0PFQ+PiBleHRlbmRzIERlc3Ryb3lhYmxlIHtcblx0Ly8gVGhlIGZvbGxvd2luZyBtZW1iZXIgaXMgcHVyZWx5IHNvIFR5cGVTY3JpcHQgcmVtZW1iZXJzIHRoZSB0eXBlIG9mIGBNYCB3aGVuIGV4dGVuZGluZyBzb1xuXHQvLyB0aGF0IHRoZSB1dGlsaXRpZXMgaW4gYG9uLnRzYCB3aWxsIHdvcmsgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yMDM0OFxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcblx0cHJvdGVjdGVkIF9fdHlwZU1hcF9fPzogTTtcblxuXHQvKipcblx0ICogbWFwIG9mIGxpc3RlbmVycyBrZXllZCBieSBldmVudCB0eXBlXG5cdCAqL1xuXHRwcm90ZWN0ZWQgbGlzdGVuZXJzTWFwOiBNYXA8VCB8IGtleW9mIE0sIEV2ZW50ZWRDYWxsYmFjazxULCBPPltdPiA9IG5ldyBNYXAoKTtcblxuXHQvKipcblx0ICogRW1pdHMgdGhlIGV2ZW50IG9iamVjdCBmb3IgdGhlIHNwZWNpZmllZCB0eXBlXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudCB0aGUgZXZlbnQgdG8gZW1pdFxuXHQgKi9cblx0ZW1pdDxLIGV4dGVuZHMga2V5b2YgTT4oZXZlbnQ6IE1bS10pOiB2b2lkO1xuXHRlbWl0KGV2ZW50OiBPKTogdm9pZDtcblx0ZW1pdChldmVudDogYW55KTogdm9pZCB7XG5cdFx0dGhpcy5saXN0ZW5lcnNNYXAuZm9yRWFjaCgobWV0aG9kcywgdHlwZSkgPT4ge1xuXHRcdFx0aWYgKGlzR2xvYk1hdGNoKHR5cGUgYXMgYW55LCBldmVudC50eXBlKSkge1xuXHRcdFx0XHRtZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuXHRcdFx0XHRcdG1ldGhvZC5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2F0Y2ggYWxsIGhhbmRsZXIgZm9yIHZhcmlvdXMgY2FsbCBzaWduYXR1cmVzLiBUaGUgc2lnbmF0dXJlcyBhcmUgZGVmaW5lZCBpblxuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgWW91IGNhbiBhZGQgeW91ciBvd24gZXZlbnQgdHlwZSAtPiBoYW5kbGVyIHR5cGVzIGJ5IGV4dGVuZGluZ1xuXHQgKiBgQmFzZUV2ZW50ZWRFdmVudHNgLiAgU2VlIGV4YW1wbGUgZm9yIGRldGFpbHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBhcmdzXG5cdCAqXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIGludGVyZmFjZSBXaWRnZXRCYXNlRXZlbnRzIGV4dGVuZHMgQmFzZUV2ZW50ZWRFdmVudHMge1xuXHQgKiAgICAgKHR5cGU6ICdwcm9wZXJ0aWVzOmNoYW5nZWQnLCBoYW5kbGVyOiBQcm9wZXJ0aWVzQ2hhbmdlZEhhbmRsZXIpOiBIYW5kbGU7XG5cdCAqIH1cblx0ICogY2xhc3MgV2lkZ2V0QmFzZSBleHRlbmRzIEV2ZW50ZWQge1xuXHQgKiAgICBvbjogV2lkZ2V0QmFzZUV2ZW50cztcblx0ICogfVxuXHQgKlxuXHQgKiBAcmV0dXJuIHthbnl9XG5cdCAqL1xuXHRvbjxLIGV4dGVuZHMga2V5b2YgTT4odHlwZTogSywgbGlzdGVuZXI6IEV2ZW50ZWRDYWxsYmFja09yQXJyYXk8SywgTVtLXT4pOiBIYW5kbGU7XG5cdG9uKHR5cGU6IFQsIGxpc3RlbmVyOiBFdmVudGVkQ2FsbGJhY2tPckFycmF5PFQsIE8+KTogSGFuZGxlO1xuXHRvbih0eXBlOiBhbnksIGxpc3RlbmVyOiBFdmVudGVkQ2FsbGJhY2tPckFycmF5PGFueSwgYW55Pik6IEhhbmRsZSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXIpKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVzID0gbGlzdGVuZXIubWFwKChsaXN0ZW5lcikgPT4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZS5kZXN0cm95KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYWRkTGlzdGVuZXIodHlwZTogVCB8IGtleW9mIE0sIGxpc3RlbmVyOiBFdmVudGVkQ2FsbGJhY2s8VCwgTz4pIHtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XG5cdFx0bGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXHRcdHRoaXMubGlzdGVuZXJzTWFwLnNldCh0eXBlLCBsaXN0ZW5lcnMpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZXN0cm95OiAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcblx0XHRcdFx0bGlzdGVuZXJzLnNwbGljZShsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lciksIDEpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRlZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBFdmVudGVkLnRzIiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcblxuZXhwb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vc2hpbS9vYmplY3QnO1xuXG5jb25zdCBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUeXBlIGd1YXJkIHRoYXQgZW5zdXJlcyB0aGF0IHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCB0byBPYmplY3RcbiAqIHRvIHdlZWQgb3V0IGhvc3Qgb2JqZWN0cyB0aGF0IGRvIG5vdCBkZXJpdmUgZnJvbSBPYmplY3QuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY2hlY2sgaWYgd2Ugd2FudCB0byBkZWVwIGNvcHkgYW4gb2JqZWN0IG9yIG5vdC5cbiAqIE5vdGU6IEluIEVTNiBpdCBpcyBwb3NzaWJsZSB0byBtb2RpZnkgYW4gb2JqZWN0J3MgU3ltYm9sLnRvU3RyaW5nVGFnIHByb3BlcnR5LCB3aGljaCB3aWxsXG4gKiBjaGFuZ2UgdGhlIHZhbHVlIHJldHVybmVkIGJ5IGB0b1N0cmluZ2AuIFRoaXMgaXMgYSByYXJlIGVkZ2UgY2FzZSB0aGF0IGlzIGRpZmZpY3VsdCB0byBoYW5kbGUsXG4gKiBzbyBpdCBpcyBub3QgaGFuZGxlZCBoZXJlLlxuICogQHBhcmFtICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4gICAgICAgSWYgdGhlIHZhbHVlIGlzIGNvZXJjaWJsZSBpbnRvIGFuIE9iamVjdFxuICovXG5mdW5jdGlvbiBzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZTogYW55KTogdmFsdWUgaXMgT2JqZWN0IHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBjb3B5QXJyYXk8VD4oYXJyYXk6IFRbXSwgaW5oZXJpdGVkOiBib29sZWFuKTogVFtdIHtcblx0cmV0dXJuIGFycmF5Lm1hcChmdW5jdGlvbihpdGVtOiBUKTogVCB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcblx0XHRcdHJldHVybiA8YW55PmNvcHlBcnJheSg8YW55Pml0ZW0sIGluaGVyaXRlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICFzaG91bGREZWVwQ29weU9iamVjdChpdGVtKVxuXHRcdFx0PyBpdGVtXG5cdFx0XHQ6IF9taXhpbih7XG5cdFx0XHRcdFx0ZGVlcDogdHJ1ZSxcblx0XHRcdFx0XHRpbmhlcml0ZWQ6IGluaGVyaXRlZCxcblx0XHRcdFx0XHRzb3VyY2VzOiA8QXJyYXk8VD4+W2l0ZW1dLFxuXHRcdFx0XHRcdHRhcmdldDogPFQ+e31cblx0XHRcdFx0fSk7XG5cdH0pO1xufVxuXG5pbnRlcmZhY2UgTWl4aW5BcmdzPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9PiB7XG5cdGRlZXA6IGJvb2xlYW47XG5cdGluaGVyaXRlZDogYm9vbGVhbjtcblx0c291cmNlczogKFUgfCBudWxsIHwgdW5kZWZpbmVkKVtdO1xuXHR0YXJnZXQ6IFQ7XG5cdGNvcGllZD86IGFueVtdO1xufVxuXG5mdW5jdGlvbiBfbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KGt3QXJnczogTWl4aW5BcmdzPFQsIFU+KTogVCAmIFUge1xuXHRjb25zdCBkZWVwID0ga3dBcmdzLmRlZXA7XG5cdGNvbnN0IGluaGVyaXRlZCA9IGt3QXJncy5pbmhlcml0ZWQ7XG5cdGNvbnN0IHRhcmdldDogYW55ID0ga3dBcmdzLnRhcmdldDtcblx0Y29uc3QgY29waWVkID0ga3dBcmdzLmNvcGllZCB8fCBbXTtcblx0Y29uc3QgY29waWVkQ2xvbmUgPSBbLi4uY29waWVkXTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGt3QXJncy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgc291cmNlID0ga3dBcmdzLnNvdXJjZXNbaV07XG5cblx0XHRpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Zm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0aWYgKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuXHRcdFx0XHRsZXQgdmFsdWU6IGFueSA9IHNvdXJjZVtrZXldO1xuXG5cdFx0XHRcdGlmIChjb3BpZWRDbG9uZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkZWVwKSB7XG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGNvcHlBcnJheSh2YWx1ZSwgaW5oZXJpdGVkKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0VmFsdWU6IGFueSA9IHRhcmdldFtrZXldIHx8IHt9O1xuXHRcdFx0XHRcdFx0Y29waWVkLnB1c2goc291cmNlKTtcblx0XHRcdFx0XHRcdHZhbHVlID0gX21peGluKHtcblx0XHRcdFx0XHRcdFx0ZGVlcDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aW5oZXJpdGVkOiBpbmhlcml0ZWQsXG5cdFx0XHRcdFx0XHRcdHNvdXJjZXM6IFt2YWx1ZV0sXG5cdFx0XHRcdFx0XHRcdHRhcmdldDogdGFyZ2V0VmFsdWUsXG5cdFx0XHRcdFx0XHRcdGNvcGllZFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRhcmdldFtrZXldID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIDxUICYgVT50YXJnZXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlLCBhbmQgY29waWVzIGFsbCBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlXG4gKiBzb3VyY2Ugb2JqZWN0cyB0byB0aGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBwcm90b3R5cGUgVGhlIHByb3RvdHlwZSB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGZyb21cbiAqIEBwYXJhbSBtaXhpbnMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0XG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8XG5cdFQgZXh0ZW5kcyB7fSxcblx0VSBleHRlbmRzIHt9LFxuXHRWIGV4dGVuZHMge30sXG5cdFcgZXh0ZW5kcyB7fSxcblx0WCBleHRlbmRzIHt9LFxuXHRZIGV4dGVuZHMge30sXG5cdFogZXh0ZW5kcyB7fVxuPihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWLCBtaXhpbjM6IFcsIG1peGluNDogWCwgbWl4aW41OiBZLCBtaXhpbjY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pihcblx0cHJvdG90eXBlOiBULFxuXHRtaXhpbjE6IFUsXG5cdG1peGluMjogVixcblx0bWl4aW4zOiBXLFxuXHRtaXhpbjQ6IFgsXG5cdG1peGluNTogWVxuKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4oXG5cdHByb3RvdHlwZTogVCxcblx0bWl4aW4xOiBVLFxuXHRtaXhpbjI6IFYsXG5cdG1peGluMzogVyxcblx0bWl4aW40OiBYXG4pOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pihcblx0cHJvdG90eXBlOiBULFxuXHRtaXhpbjE6IFUsXG5cdG1peGluMjogVixcblx0bWl4aW4zOiBXXG4pOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQsIG1peGluMTogVSwgbWl4aW4yOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCk6IFQ7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZTogYW55LCAuLi5taXhpbnM6IGFueVtdKTogYW55IHtcblx0aWYgKCFtaXhpbnMubGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xhbmcuY3JlYXRlIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBtaXhpbiBvYmplY3QuJyk7XG5cdH1cblxuXHRjb25zdCBhcmdzID0gbWl4aW5zLnNsaWNlKCk7XG5cdGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xuXG5cdHJldHVybiBhc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XG59XG5cbi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYWxsIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gdGhlIHRhcmdldCBvYmplY3QsXG4gKiByZWN1cnNpdmVseSBjb3B5aW5nIGFsbCBuZXN0ZWQgb2JqZWN0cyBhbmQgYXJyYXlzIGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byByZWNlaXZlIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RzXG4gKiBAcGFyYW0gc291cmNlcyBBbnkgbnVtYmVyIG9mIG9iamVjdHMgd2hvc2UgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgdGFyZ2V0IG9iamVjdFxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxcblx0VCBleHRlbmRzIHt9LFxuXHRVIGV4dGVuZHMge30sXG5cdFYgZXh0ZW5kcyB7fSxcblx0VyBleHRlbmRzIHt9LFxuXHRYIGV4dGVuZHMge30sXG5cdFkgZXh0ZW5kcyB7fSxcblx0WiBleHRlbmRzIHt9XG4+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSwgc291cmNlNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9Pihcblx0dGFyZ2V0OiBULFxuXHRzb3VyY2UxOiBVLFxuXHRzb3VyY2UyOiBWLFxuXHRzb3VyY2UzOiBXLFxuXHRzb3VyY2U0OiBYLFxuXHRzb3VyY2U1OiBZXG4pOiBUICYgVSAmIFYgJiBXICYgWCAmIFk7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWFxuKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFdcbik6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IHRydWUsXG5cdFx0aW5oZXJpdGVkOiBmYWxzZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIChvd24gb3IgaW5oZXJpdGVkKSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogdGFyZ2V0IG9iamVjdCwgcmVjdXJzaXZlbHkgY29weWluZyBhbGwgbmVzdGVkIG9iamVjdHMgYW5kIGFycmF5cyBhcyB3ZWxsLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gcmVjZWl2ZSB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0c1xuICogQHBhcmFtIHNvdXJjZXMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgdGFyZ2V0IG9iamVjdFxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFxuXHRUIGV4dGVuZHMge30sXG5cdFUgZXh0ZW5kcyB7fSxcblx0ViBleHRlbmRzIHt9LFxuXHRXIGV4dGVuZHMge30sXG5cdFggZXh0ZW5kcyB7fSxcblx0WSBleHRlbmRzIHt9LFxuXHRaIGV4dGVuZHMge31cbj4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZLCBzb3VyY2U2OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWCxcblx0c291cmNlNTogWVxuKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWFxuKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogV1xuKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW4odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0cmV0dXJuIF9taXhpbih7XG5cdFx0ZGVlcDogdHJ1ZSxcblx0XHRpbmhlcml0ZWQ6IHRydWUsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgcHJvdG90eXBlIGFzIHRoZSBwcm90b3R5cGUgZm9yIHRoZSBuZXcgb2JqZWN0LCBhbmQgdGhlblxuICogZGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHZhbHVlcyBpbnRvIHRoZSBuZXcgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIG9iamVjdCB0byBkdXBsaWNhdGVcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGR1cGxpY2F0ZTxUIGV4dGVuZHMge30+KHNvdXJjZTogVCk6IFQge1xuXHRjb25zdCB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpKTtcblxuXHRyZXR1cm4gZGVlcE1peGluKHRhcmdldCwgc291cmNlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdHdvIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUuXG4gKlxuICogQHBhcmFtIGEgRmlyc3QgdmFsdWUgdG8gY29tcGFyZVxuICogQHBhcmFtIGIgU2Vjb25kIHZhbHVlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0lkZW50aWNhbChhOiBhbnksIGI6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gKFxuXHRcdGEgPT09IGIgfHxcblx0XHQvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXG5cdFx0KGEgIT09IGEgJiYgYiAhPT0gYilcblx0KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBiaW5kcyBhIG1ldGhvZCB0byB0aGUgc3BlY2lmaWVkIG9iamVjdCBhdCBydW50aW1lLiBUaGlzIGlzIHNpbWlsYXIgdG9cbiAqIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24gaXQgdGFrZXMgdGhlIG5hbWUgb2YgYSBtZXRob2Qgb24gYW4gb2JqZWN0LlxuICogQXMgYSByZXN1bHQsIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBgbGF0ZUJpbmRgIHdpbGwgYWx3YXlzIGNhbGwgdGhlIGZ1bmN0aW9uIGN1cnJlbnRseSBhc3NpZ25lZCB0b1xuICogdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0IGFzIG9mIHRoZSBtb21lbnQgdGhlIGZ1bmN0aW9uIGl0IHJldHVybnMgaXMgY2FsbGVkLlxuICpcbiAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgY29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBtZXRob2QgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBvbiB0aGUgY29udGV4dCBvYmplY3QgdG8gYmluZCB0byBpdHNlbGZcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgdmFsdWVzIHRvIHByZXBlbmQgdG8gdGhlIGBpbnN0YW5jZVttZXRob2RdYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhdGVCaW5kKGluc3RhbmNlOiB7fSwgbWV0aG9kOiBzdHJpbmcsIC4uLnN1cHBsaWVkQXJnczogYW55W10pOiAoLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBzdXBwbGllZEFyZ3MubGVuZ3RoXG5cdFx0PyBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgYXJnczogYW55W10gPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuXG5cdFx0XHRcdC8vIFRTNzAxN1xuXHRcdFx0XHRyZXR1cm4gKDxhbnk+aW5zdGFuY2UpW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIFRTNzAxN1xuXHRcdFx0XHRyZXR1cm4gKDxhbnk+aW5zdGFuY2UpW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIChvd24gb3IgaW5oZXJpdGVkKSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFcsXG5cdHNvdXJjZTQ6IFgsXG5cdHNvdXJjZTU6IFksXG5cdHNvdXJjZTY6IFpcbik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWCxcblx0c291cmNlNTogWVxuKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pihcblx0dGFyZ2V0OiBULFxuXHRzb3VyY2UxOiBVLFxuXHRzb3VyY2UyOiBWLFxuXHRzb3VyY2UzOiBXLFxuXHRzb3VyY2U0OiBYXG4pOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFdcbik6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IGZhbHNlLFxuXHRcdGluaGVyaXRlZDogdHJ1ZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB3aGljaCBpbnZva2VzIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIGl0cyBhcmd1bWVudCBsaXN0LlxuICogTGlrZSBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgZG9lcyBub3QgYWx0ZXIgZXhlY3V0aW9uIGNvbnRleHQuXG4gKlxuICogQHBhcmFtIHRhcmdldEZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0aGF0IG5lZWRzIHRvIGJlIGJvdW5kXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRoZSBgdGFyZ2V0RnVuY3Rpb25gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFydGlhbCh0YXJnZXRGdW5jdGlvbjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIC4uLnN1cHBsaWVkQXJnczogYW55W10pOiAoLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBmdW5jdGlvbih0aGlzOiBhbnkpIHtcblx0XHRjb25zdCBhcmdzOiBhbnlbXSA9IGFyZ3VtZW50cy5sZW5ndGggPyBzdXBwbGllZEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBzdXBwbGllZEFyZ3M7XG5cblx0XHRyZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGRlc3Ryb3kgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBjYWxscyB0aGUgcGFzc2VkLWluIGRlc3RydWN0b3IuXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZSBmb3IgY3JlYXRpbmcgXCJyZW1vdmVcIiAvIFwiZGVzdHJveVwiIGhhbmRsZXJzIGZvclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gZGVzdHJ1Y3RvciBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaGFuZGxlJ3MgYGRlc3Ryb3lgIG1ldGhvZCBpcyBpbnZva2VkXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3RvcjogKCkgPT4gdm9pZCk6IEhhbmRsZSB7XG5cdHJldHVybiB7XG5cdFx0ZGVzdHJveTogZnVuY3Rpb24odGhpczogSGFuZGxlKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHt9O1xuXHRcdFx0ZGVzdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlcyBBbiBhcnJheSBvZiBoYW5kbGVzIHdpdGggYGRlc3Ryb3lgIG1ldGhvZHNcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSguLi5oYW5kbGVzOiBIYW5kbGVbXSk6IEhhbmRsZSB7XG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24oKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBoYW5kbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRoYW5kbGVzW2ldLmRlc3Ryb3koKTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxhbmcudHMiLCJpbXBvcnQgaGFzLCB7IGFkZCB9IGZyb20gJ0Bkb2pvL2hhcy9oYXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xuXG5leHBvcnQgZGVmYXVsdCBoYXM7XG5leHBvcnQgKiBmcm9tICdAZG9qby9oYXMvaGFzJztcblxuLyogRUNNQVNjcmlwdCA2IGFuZCA3IEZlYXR1cmVzICovXG5cbi8qIEFycmF5ICovXG5hZGQoXG5cdCdlczYtYXJyYXknLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFsnZnJvbScsICdvZiddLmV2ZXJ5KChrZXkpID0+IGtleSBpbiBnbG9iYWwuQXJyYXkpICYmXG5cdFx0XHRbJ2ZpbmRJbmRleCcsICdmaW5kJywgJ2NvcHlXaXRoaW4nXS5ldmVyeSgoa2V5KSA9PiBrZXkgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSlcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtYXJyYXktZmlsbCcsXG5cdCgpID0+IHtcblx0XHRpZiAoJ2ZpbGwnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpIHtcblx0XHRcdC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xuXHRcdFx0cmV0dXJuICg8YW55PlsxXSkuZmlsbCg5LCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpWzBdID09PSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZCgnZXM3LWFycmF5JywgKCkgPT4gJ2luY2x1ZGVzJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlLCB0cnVlKTtcblxuLyogTWFwICovXG5hZGQoXG5cdCdlczYtbWFwJyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Lypcblx0XHRJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5XG5cdFx0V2Ugd3JhcCB0aGlzIGluIGEgdHJ5L2NhdGNoIGJlY2F1c2Ugc29tZXRpbWVzIHRoZSBNYXAgY29uc3RydWN0b3IgZXhpc3RzLCBidXQgZG9lcyBub3Rcblx0XHR0YWtlIGFyZ3VtZW50cyAoaU9TIDguNClcblx0XHQgKi9cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuTWFwKFtbMCwgMV1dKTtcblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdG1hcC5oYXMoMCkgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdFx0XHRoYXMoJ2VzNi1zeW1ib2wnKSAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAudmFsdWVzID09PSAnZnVuY3Rpb24nICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC5lbnRyaWVzID09PSAnZnVuY3Rpb24nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogTWF0aCAqL1xuYWRkKFxuXHQnZXM2LW1hdGgnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCdjbHozMicsXG5cdFx0XHQnc2lnbicsXG5cdFx0XHQnbG9nMTAnLFxuXHRcdFx0J2xvZzInLFxuXHRcdFx0J2xvZzFwJyxcblx0XHRcdCdleHBtMScsXG5cdFx0XHQnY29zaCcsXG5cdFx0XHQnc2luaCcsXG5cdFx0XHQndGFuaCcsXG5cdFx0XHQnYWNvc2gnLFxuXHRcdFx0J2FzaW5oJyxcblx0XHRcdCdhdGFuaCcsXG5cdFx0XHQndHJ1bmMnLFxuXHRcdFx0J2Zyb3VuZCcsXG5cdFx0XHQnY2JydCcsXG5cdFx0XHQnaHlwb3QnXG5cdFx0XS5ldmVyeSgobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5NYXRoW25hbWVdID09PSAnZnVuY3Rpb24nKTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LW1hdGgtaW11bCcsXG5cdCgpID0+IHtcblx0XHRpZiAoJ2ltdWwnIGluIGdsb2JhbC5NYXRoKSB7XG5cdFx0XHQvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBvbiBpb3MgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXG5cdFx0XHRyZXR1cm4gKDxhbnk+TWF0aCkuaW11bCgweGZmZmZmZmZmLCA1KSA9PT0gLTU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogT2JqZWN0ICovXG5hZGQoXG5cdCdlczYtb2JqZWN0Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRoYXMoJ2VzNi1zeW1ib2wnKSAmJlxuXHRcdFx0Wydhc3NpZ24nLCAnaXMnLCAnZ2V0T3duUHJvcGVydHlTeW1ib2xzJywgJ3NldFByb3RvdHlwZU9mJ10uZXZlcnkoXG5cdFx0XHRcdChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzMjAxNy1vYmplY3QnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFsndmFsdWVzJywgJ2VudHJpZXMnLCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyddLmV2ZXJ5KFxuXHRcdFx0KG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogT2JzZXJ2YWJsZSAqL1xuYWRkKCdlcy1vYnNlcnZhYmxlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5PYnNlcnZhYmxlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XG5cbi8qIFByb21pc2UgKi9cbmFkZCgnZXM2LXByb21pc2UnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIGhhcygnZXM2LXN5bWJvbCcpLCB0cnVlKTtcblxuLyogU2V0ICovXG5hZGQoXG5cdCdlczYtc2V0Jyxcblx0KCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsLlNldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0LyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBTZXQgZnVuY3Rpb25hbGl0eSAqL1xuXHRcdFx0Y29uc3Qgc2V0ID0gbmV3IGdsb2JhbC5TZXQoWzFdKTtcblx0XHRcdHJldHVybiBzZXQuaGFzKDEpICYmICdrZXlzJyBpbiBzZXQgJiYgdHlwZW9mIHNldC5rZXlzID09PSAnZnVuY3Rpb24nICYmIGhhcygnZXM2LXN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIFN0cmluZyAqL1xuYWRkKFxuXHQnZXM2LXN0cmluZycsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0W1xuXHRcdFx0XHQvKiBzdGF0aWMgbWV0aG9kcyAqL1xuXHRcdFx0XHQnZnJvbUNvZGVQb2ludCdcblx0XHRcdF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmdba2V5XSA9PT0gJ2Z1bmN0aW9uJykgJiZcblx0XHRcdFtcblx0XHRcdFx0LyogaW5zdGFuY2UgbWV0aG9kcyAqL1xuXHRcdFx0XHQnY29kZVBvaW50QXQnLFxuXHRcdFx0XHQnbm9ybWFsaXplJyxcblx0XHRcdFx0J3JlcGVhdCcsXG5cdFx0XHRcdCdzdGFydHNXaXRoJyxcblx0XHRcdFx0J2VuZHNXaXRoJyxcblx0XHRcdFx0J2luY2x1ZGVzJ1xuXHRcdFx0XS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJylcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczYtc3RyaW5nLXJhdycsXG5cdCgpID0+IHtcblx0XHRmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnN1YnN0aXR1dGlvbnM6IGFueVtdKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBbLi4uY2FsbFNpdGVdO1xuXHRcdFx0KHJlc3VsdCBhcyBhbnkpLnJhdyA9IGNhbGxTaXRlLnJhdztcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0aWYgKCdyYXcnIGluIGdsb2JhbC5TdHJpbmcpIHtcblx0XHRcdGxldCBiID0gMTtcblx0XHRcdGxldCBjYWxsU2l0ZSA9IGdldENhbGxTaXRlYGFcXG4ke2J9YDtcblxuXHRcdFx0KGNhbGxTaXRlIGFzIGFueSkucmF3ID0gWydhXFxcXG4nXTtcblx0XHRcdGNvbnN0IHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWwuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XG5cblx0XHRcdHJldHVybiBzdXBwb3J0c1RydW5jO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXMyMDE3LXN0cmluZycsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJyk7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIFN5bWJvbCAqL1xuYWRkKCdlczYtc3ltYm9sJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCcsIHRydWUpO1xuXG4vKiBXZWFrTWFwICovXG5hZGQoXG5cdCdlczYtd2Vha21hcCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0LyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eSAqL1xuXHRcdFx0Y29uc3Qga2V5MSA9IHt9O1xuXHRcdFx0Y29uc3Qga2V5MiA9IHt9O1xuXHRcdFx0Y29uc3QgbWFwID0gbmV3IGdsb2JhbC5XZWFrTWFwKFtba2V5MSwgMV1dKTtcblx0XHRcdE9iamVjdC5mcmVlemUoa2V5MSk7XG5cdFx0XHRyZXR1cm4gbWFwLmdldChrZXkxKSA9PT0gMSAmJiBtYXAuc2V0KGtleTIsIDIpID09PSBtYXAgJiYgaGFzKCdlczYtc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuLyogTWlzY2VsbGFuZW91cyBmZWF0dXJlcyAqL1xuYWRkKCdtaWNyb3Rhc2tzJywgKCkgPT4gaGFzKCdlczYtcHJvbWlzZScpIHx8IGhhcygnaG9zdC1ub2RlJykgfHwgaGFzKCdkb20tbXV0YXRpb25vYnNlcnZlcicpLCB0cnVlKTtcbmFkZChcblx0J3Bvc3RtZXNzYWdlJyxcblx0KCkgPT4ge1xuXHRcdC8vIElmIHdpbmRvdyBpcyB1bmRlZmluZWQsIGFuZCB3ZSBoYXZlIHBvc3RNZXNzYWdlLCBpdCBwcm9iYWJseSBtZWFucyB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIuIFdlYiB3b3JrZXJzIGhhdmVcblx0XHQvLyBwb3N0IG1lc3NhZ2UgYnV0IGl0IGRvZXNuJ3Qgd29yayBob3cgd2UgZXhwZWN0IGl0IHRvLCBzbyBpdCdzIGJlc3QganVzdCB0byBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG5cdFx0cmV0dXJuIHR5cGVvZiBnbG9iYWwud2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZ2xvYmFsLnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nO1xuXHR9LFxuXHR0cnVlXG4pO1xuYWRkKCdyYWYnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJywgdHJ1ZSk7XG5hZGQoJ3NldGltbWVkaWF0ZScsICgpID0+IHR5cGVvZiBnbG9iYWwuc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XG5cbi8qIERPTSBGZWF0dXJlcyAqL1xuXG5hZGQoXG5cdCdkb20tbXV0YXRpb25vYnNlcnZlcicsXG5cdCgpID0+IHtcblx0XHRpZiAoaGFzKCdob3N0LWJyb3dzZXInKSAmJiBCb29sZWFuKGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyKSkge1xuXHRcdFx0Ly8gSUUxMSBoYXMgYW4gdW5yZWxpYWJsZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIHdoZXJlIHNldFByb3BlcnR5KCkgZG9lcyBub3Rcblx0XHRcdC8vIGdlbmVyYXRlIGEgbXV0YXRpb24gZXZlbnQsIG9ic2VydmVycyBjYW4gY3Jhc2gsIGFuZCB0aGUgcXVldWUgZG9lcyBub3QgZHJhaW5cblx0XHRcdC8vIHJlbGlhYmx5LiBUaGUgZm9sbG93aW5nIGZlYXR1cmUgdGVzdCB3YXMgYWRhcHRlZCBmcm9tXG5cdFx0XHQvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90MTBrby80YWNlYjhjNzE2ODFmZGIyNzVlMzNlZmU1ZTU3NmIxNFxuXHRcdFx0Y29uc3QgZXhhbXBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRcdGNvbnN0IEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cdFx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpIHt9KTtcblx0XHRcdG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG5cdFx0XHRleGFtcGxlLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHJldHVybiBCb29sZWFuKG9ic2VydmVyLnRha2VSZWNvcmRzKCkubGVuZ3RoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdkb20td2ViYW5pbWF0aW9uJyxcblx0KCkgPT4gaGFzKCdob3N0LWJyb3dzZXInKSAmJiBnbG9iYWwuQW5pbWF0aW9uICE9PSB1bmRlZmluZWQgJiYgZ2xvYmFsLktleWZyYW1lRWZmZWN0ICE9PSB1bmRlZmluZWQsXG5cdHRydWVcbik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaGFzLnRzIiwiaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlLCBJdGVyYWJsZUl0ZXJhdG9yLCBTaGltSXRlcmF0b3IgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXMgYXMgb2JqZWN0SXMgfSBmcm9tICcuL29iamVjdCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwPEssIFY+IHtcblx0LyoqXG5cdCAqIERlbGV0ZXMgYWxsIGtleXMgYW5kIHRoZWlyIGFzc29jaWF0ZWQgdmFsdWVzLlxuXHQgKi9cblx0Y2xlYXIoKTogdm9pZDtcblxuXHQvKipcblx0ICogRGVsZXRlcyBhIGdpdmVuIGtleSBhbmQgaXRzIGFzc29jaWF0ZWQgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWxldGVcblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBrZXkgZXhpc3RzLCBmYWxzZSBpZiBpdCBkb2VzIG5vdFxuXHQgKi9cblx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkvdmFsdWUgcGFpciBhcyBhbiBhcnJheS5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBmb3IgZWFjaCBrZXkvdmFsdWUgcGFpciBpbiB0aGUgaW5zdGFuY2UuXG5cdCAqL1xuXHRlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPjtcblxuXHQvKipcblx0ICogRXhlY3V0ZXMgYSBnaXZlbiBmdW5jdGlvbiBmb3IgZWFjaCBtYXAgZW50cnkuIFRoZSBmdW5jdGlvblxuXHQgKiBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgZWxlbWVudCB2YWx1ZSwgdGhlXG5cdCAqIGVsZW1lbnQga2V5LCBhbmQgdGhlIGFzc29jaWF0ZWQgTWFwIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gY2FsbGJhY2tmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBmb3IgZWFjaCBtYXAgZW50cnksXG5cdCAqIEBwYXJhbSB0aGlzQXJnIFRoZSB2YWx1ZSB0byB1c2UgZm9yIGB0aGlzYCBmb3IgZWFjaCBleGVjdXRpb24gb2YgdGhlIGNhbGJhY2tcblx0ICovXG5cdGZvckVhY2goY2FsbGJhY2tmbjogKHZhbHVlOiBWLCBrZXk6IEssIG1hcDogTWFwPEssIFY+KSA9PiB2b2lkLCB0aGlzQXJnPzogYW55KTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gbG9vayB1cFxuXHQgKiBAcmV0dXJuIFRoZSB2YWx1ZSBpZiBvbmUgZXhpc3RzIG9yIHVuZGVmaW5lZFxuXHQgKi9cblx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCBrZXkgaW4gdGhlIG1hcC5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBjb250YWluaW5nIHRoZSBpbnN0YW5jZSdzIGtleXMuXG5cdCAqL1xuXHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz47XG5cblx0LyoqXG5cdCAqIENoZWNrcyBmb3IgdGhlIHByZXNlbmNlIG9mIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gY2hlY2sgZm9yXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUga2V5IGV4aXN0cywgZmFsc2UgaWYgaXQgZG9lcyBub3Rcblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBkZWZpbmUgYSB2YWx1ZSB0b1xuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnblxuXHQgKiBAcmV0dXJuIFRoZSBNYXAgaW5zdGFuY2Vcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleSAvIHZhbHVlIHBhaXJzIGluIHRoZSBNYXAuXG5cdCAqL1xuXHRyZWFkb25seSBzaXplOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gaXRlcmF0b3IgdGhhdCB5aWVsZHMgZWFjaCB2YWx1ZSBpbiB0aGUgbWFwLlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdGhlIGluc3RhbmNlJ3MgdmFsdWVzLlxuXHQgKi9cblx0dmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj47XG5cblx0LyoqIFJldHVybnMgYW4gaXRlcmFibGUgb2YgZW50cmllcyBpbiB0aGUgbWFwLiAqL1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT47XG5cblx0cmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdG5ldyAoKTogTWFwPGFueSwgYW55PjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYXRvclxuXHQgKiBBcnJheSBvciBpdGVyYXRvciBjb250YWluaW5nIHR3by1pdGVtIHR1cGxlcyB1c2VkIHRvIGluaXRpYWxseSBwb3B1bGF0ZSB0aGUgbWFwLlxuXHQgKiBUaGUgZmlyc3QgaXRlbSBpbiBlYWNoIHR1cGxlIGNvcnJlc3BvbmRzIHRvIHRoZSBrZXkgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICogVGhlIHNlY29uZCBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKi9cblx0bmV3IDxLLCBWPihpdGVyYXRvcj86IFtLLCBWXVtdKTogTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhdG9yXG5cdCAqIEFycmF5IG9yIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdHdvLWl0ZW0gdHVwbGVzIHVzZWQgdG8gaW5pdGlhbGx5IHBvcHVsYXRlIHRoZSBtYXAuXG5cdCAqIFRoZSBmaXJzdCBpdGVtIGluIGVhY2ggdHVwbGUgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKiBUaGUgc2Vjb25kIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqL1xuXHRuZXcgPEssIFY+KGl0ZXJhdG9yOiBJdGVyYWJsZTxbSywgVl0+KTogTWFwPEssIFY+O1xuXG5cdHJlYWRvbmx5IHByb3RvdHlwZTogTWFwPGFueSwgYW55PjtcblxuXHRyZWFkb25seSBbU3ltYm9sLnNwZWNpZXNdOiBNYXBDb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGxldCBNYXA6IE1hcENvbnN0cnVjdG9yID0gZ2xvYmFsLk1hcDtcblxuaWYgKCFoYXMoJ2VzNi1tYXAnKSkge1xuXHRNYXAgPSBjbGFzcyBNYXA8SywgVj4ge1xuXHRcdHByb3RlY3RlZCByZWFkb25seSBfa2V5czogS1tdID0gW107XG5cdFx0cHJvdGVjdGVkIHJlYWRvbmx5IF92YWx1ZXM6IFZbXSA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXG5cdFx0ICogdG8gY2hlY2sgZm9yIGVxdWFsaXR5LiBTZWUgaHR0cDovL216bC5sYS8xenVLTzJWXG5cdFx0ICovXG5cdFx0cHJvdGVjdGVkIF9pbmRleE9mS2V5KGtleXM6IEtbXSwga2V5OiBLKTogbnVtYmVyIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChvYmplY3RJcyhrZXlzW2ldLCBrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXSA9IE1hcDtcblxuXHRcdGNvbnN0cnVjdG9yKGl0ZXJhYmxlPzogQXJyYXlMaWtlPFtLLCBWXT4gfCBJdGVyYWJsZTxbSywgVl0+KSB7XG5cdFx0XHRpZiAoaXRlcmFibGUpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdldCBzaXplKCk6IG51bWJlciB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0Y2xlYXIoKTogdm9pZCB7XG5cdFx0XHR0aGlzLl9rZXlzLmxlbmd0aCA9IHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9rZXlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR0aGlzLl92YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX2tleXMubWFwKChrZXk6IEssIGk6IG51bWJlcik6IFtLLCBWXSA9PiB7XG5cdFx0XHRcdHJldHVybiBba2V5LCB0aGlzLl92YWx1ZXNbaV1dO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XG5cdFx0fVxuXG5cdFx0Zm9yRWFjaChjYWxsYmFjazogKHZhbHVlOiBWLCBrZXk6IEssIG1hcEluc3RhbmNlOiBNYXA8SywgVj4pID0+IGFueSwgY29udGV4dD86IHt9KSB7XG5cdFx0XHRjb25zdCBrZXlzID0gdGhpcy5fa2V5cztcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcblx0XHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZCB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiB0aGlzLl92YWx1ZXNbaW5kZXhdO1xuXHRcdH1cblxuXHRcdGhhcyhrZXk6IEspOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSkgPiAtMTtcblx0XHR9XG5cblx0XHRrZXlzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Sz4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fa2V5cyk7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogSywgdmFsdWU6IFYpOiBNYXA8SywgVj4ge1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0aW5kZXggPSBpbmRleCA8IDAgPyB0aGlzLl9rZXlzLmxlbmd0aCA6IGluZGV4O1xuXHRcdFx0dGhpcy5fa2V5c1tpbmRleF0gPSBrZXk7XG5cdFx0XHR0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHR2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxWPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzKCk7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdNYXAnID0gJ01hcCc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBNYXAudHMiLCJpbXBvcnQgeyBUaGVuYWJsZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IHF1ZXVlTWljcm9UYXNrIH0gZnJvbSAnLi9zdXBwb3J0L3F1ZXVlJztcbmltcG9ydCB7IEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5cbi8qKlxuICogRXhlY3V0b3IgaXMgdGhlIGludGVyZmFjZSBmb3IgZnVuY3Rpb25zIHVzZWQgdG8gaW5pdGlhbGl6ZSBhIFByb21pc2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0b3I8VD4ge1xuXHQvKipcblx0ICogVGhlIGV4ZWN1dG9yIGZvciB0aGUgcHJvbWlzZVxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzb2x2ZSBUaGUgcmVzb2x2ZXIgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICogQHBhcmFtIHJlamVjdCBUaGUgcmVqZWN0b3IgY2FsbGJhY2sgb2YgdGhlIHByb21pc2Vcblx0ICovXG5cdChyZXNvbHZlOiAodmFsdWU/OiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQsIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBsZXQgU2hpbVByb21pc2U6IHR5cGVvZiBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbmV4cG9ydCBjb25zdCBpc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZTxUPih2YWx1ZTogYW55KTogdmFsdWUgaXMgUHJvbWlzZUxpa2U8VD4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59O1xuXG5pZiAoIWhhcygnZXM2LXByb21pc2UnKSkge1xuXHRjb25zdCBlbnVtIFN0YXRlIHtcblx0XHRGdWxmaWxsZWQsXG5cdFx0UGVuZGluZyxcblx0XHRSZWplY3RlZFxuXHR9XG5cblx0Z2xvYmFsLlByb21pc2UgPSBTaGltUHJvbWlzZSA9IGNsYXNzIFByb21pc2U8VD4gaW1wbGVtZW50cyBUaGVuYWJsZTxUPiB7XG5cdFx0c3RhdGljIGFsbChpdGVyYWJsZTogSXRlcmFibGU8YW55IHwgUHJvbWlzZUxpa2U8YW55Pj4gfCAoYW55IHwgUHJvbWlzZUxpa2U8YW55PilbXSk6IFByb21pc2U8YW55PiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcblx0XHRcdFx0bGV0IGNvbXBsZXRlID0gMDtcblx0XHRcdFx0bGV0IHRvdGFsID0gMDtcblx0XHRcdFx0bGV0IHBvcHVsYXRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXg6IG51bWJlciwgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdFx0XHRcdHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHQrK2NvbXBsZXRlO1xuXHRcdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmluaXNoKCk6IHZvaWQge1xuXHRcdFx0XHRcdGlmIChwb3B1bGF0aW5nIHx8IGNvbXBsZXRlIDwgdG90YWwpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZSh2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KTogdm9pZCB7XG5cdFx0XHRcdFx0Kyt0b3RhbDtcblx0XHRcdFx0XHRpZiAoaXNUaGVuYWJsZShpdGVtKSkge1xuXHRcdFx0XHRcdFx0Ly8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpID0gMDtcblx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdHByb2Nlc3NJdGVtKGksIHZhbHVlKTtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG9wdWxhdGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdGZpbmlzaCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJhY2U8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQgfCBQcm9taXNlTGlrZTxUPj4gfCAoVCB8IFByb21pc2VMaWtlPFQ+KVtdKTogUHJvbWlzZTxUW10+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlOiAodmFsdWU/OiBhbnkpID0+IHZvaWQsIHJlamVjdCkge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdFx0XHRcdC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXG5cdFx0XHRcdFx0XHQvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuXHRcdFx0XHRcdFx0aXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlamVjdChyZWFzb24/OiBhbnkpOiBQcm9taXNlPG5ldmVyPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdHJlamVjdChyZWFzb24pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlc29sdmUoKTogUHJvbWlzZTx2b2lkPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPjtcblx0XHRzdGF0aWMgcmVzb2x2ZTxUPih2YWx1ZT86IGFueSk6IFByb21pc2U8VD4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUpIHtcblx0XHRcdFx0cmVzb2x2ZSg8VD52YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgW1N5bWJvbC5zcGVjaWVzXTogUHJvbWlzZUNvbnN0cnVjdG9yID0gU2hpbVByb21pc2UgYXMgUHJvbWlzZUNvbnN0cnVjdG9yO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBhIG5ldyBQcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZXhlY3V0b3Jcblx0XHQgKiBUaGUgZXhlY3V0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIFByb21pc2UgaXMgaW5zdGFudGlhdGVkLiBJdCBpcyByZXNwb25zaWJsZSBmb3Jcblx0XHQgKiBzdGFydGluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGVuIGl0IGlzIGludm9rZWQuXG5cdFx0ICpcblx0XHQgKiBUaGUgZXhlY3V0b3IgbXVzdCBjYWxsIGVpdGhlciB0aGUgcGFzc2VkIGByZXNvbHZlYCBmdW5jdGlvbiB3aGVuIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWRcblx0XHQgKiBzdWNjZXNzZnVsbHksIG9yIHRoZSBgcmVqZWN0YCBmdW5jdGlvbiB3aGVuIHRoZSBvcGVyYXRpb24gZmFpbHMuXG5cdFx0ICovXG5cdFx0Y29uc3RydWN0b3IoZXhlY3V0b3I6IEV4ZWN1dG9yPFQ+KSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIElmIHRydWUsIHRoZSByZXNvbHV0aW9uIG9mIHRoaXMgcHJvbWlzZSBpcyBjaGFpbmVkIChcImxvY2tlZCBpblwiKSB0byBhbm90aGVyIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBpc0NoYWluZWQgPSBmYWxzZTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgaXNSZXNvbHZlZCA9ICgpOiBib29sZWFuID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcgfHwgaXNDaGFpbmVkO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDYWxsYmFja3MgdGhhdCBzaG91bGQgYmUgaW52b2tlZCBvbmNlIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWQuXG5cdFx0XHQgKi9cblx0XHRcdGxldCBjYWxsYmFja3M6IG51bGwgfCAoQXJyYXk8KCkgPT4gdm9pZD4pID0gW107XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW5pdGlhbGx5IHB1c2hlcyBjYWxsYmFja3Mgb250byBhIHF1ZXVlIGZvciBleGVjdXRpb24gb25jZSB0aGlzIHByb21pc2Ugc2V0dGxlcy4gQWZ0ZXIgdGhlIHByb21pc2Ugc2V0dGxlcyxcblx0XHRcdCAqIGVucXVldWVzIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3AgdHVybi5cblx0XHRcdCAqL1xuXHRcdFx0bGV0IHdoZW5GaW5pc2hlZCA9IGZ1bmN0aW9uKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG5cdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogU2V0dGxlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHNldHRsZSA9IChuZXdTdGF0ZTogU3RhdGUsIHZhbHVlOiBhbnkpOiB2b2lkID0+IHtcblx0XHRcdFx0Ly8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUgIT09IFN0YXRlLlBlbmRpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZWRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR3aGVuRmluaXNoZWQgPSBxdWV1ZU1pY3JvVGFzaztcblxuXHRcdFx0XHQvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xuXHRcdFx0XHQvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXG5cdFx0XHRcdGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRxdWV1ZU1pY3JvVGFzayhmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGNvdW50ID0gY2FsbGJhY2tzLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNvbHZlcyB0aGlzIHByb21pc2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IHJlc29sdmUgPSAobmV3U3RhdGU6IFN0YXRlLCB2YWx1ZTogYW55KTogdm9pZCA9PiB7XG5cdFx0XHRcdGlmIChpc1Jlc29sdmVkKCkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHtcblx0XHRcdFx0XHR2YWx1ZS50aGVuKHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLkZ1bGZpbGxlZCksIHNldHRsZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHRcdFx0aXNDaGFpbmVkID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZXR0bGUobmV3U3RhdGUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy50aGVuID0gPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRcdG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pIHwgdW5kZWZpbmVkIHwgbnVsbCxcblx0XHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHRcdCk6IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4gPT4ge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIHdoZW5GaW5pc2hlZCBpbml0aWFsbHkgcXVldWVzIHVwIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIGFmdGVyIHRoZSBwcm9taXNlIGhhcyBzZXR0bGVkLiBPbmNlIHRoZVxuXHRcdFx0XHRcdC8vIHByb21pc2UgaGFzIHNldHRsZWQsIHdoZW5GaW5pc2hlZCB3aWxsIHNjaGVkdWxlIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IHR1cm4gdGhyb3VnaCB0aGVcblx0XHRcdFx0XHQvLyBldmVudCBsb29wLlxuXHRcdFx0XHRcdHdoZW5GaW5pc2hlZCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBjYWxsYmFjazogKCh2YWx1ZT86IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZCB8IG51bGwgPVxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoY2FsbGJhY2sodGhpcy5yZXNvbHZlZFZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlID09PSBTdGF0ZS5SZWplY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5yZXNvbHZlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgU3RhdGUuRnVsZmlsbGVkKSwgcmVzb2x2ZS5iaW5kKG51bGwsIFN0YXRlLlJlamVjdGVkKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRzZXR0bGUoU3RhdGUuUmVqZWN0ZWQsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjYXRjaDxUUmVzdWx0ID0gbmV2ZXI+KFxuXHRcdFx0b25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0KTogUHJvbWlzZTxUIHwgVFJlc3VsdD4ge1xuXHRcdFx0cmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cblx0XHQgKi9cblx0XHRwcml2YXRlIHN0YXRlID0gU3RhdGUuUGVuZGluZztcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUge1R8YW55fVxuXHRcdCAqL1xuXHRcdHByaXZhdGUgcmVzb2x2ZWRWYWx1ZTogYW55O1xuXG5cdFx0dGhlbjogPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG5cdFx0XHRvbmZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdFx0XHRvbnJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdCkgPT4gUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnUHJvbWlzZScgPSAnUHJvbWlzZSc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaW1Qcm9taXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFByb21pc2UudHMiLCJpbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBnZXRWYWx1ZURlc2NyaXB0b3IgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcblx0aW50ZXJmYWNlIFN5bWJvbENvbnN0cnVjdG9yIHtcblx0XHRvYnNlcnZhYmxlOiBzeW1ib2w7XG5cdH1cbn1cblxuZXhwb3J0IGxldCBTeW1ib2w6IFN5bWJvbENvbnN0cnVjdG9yID0gZ2xvYmFsLlN5bWJvbDtcblxuaWYgKCFoYXMoJ2VzNi1zeW1ib2wnKSkge1xuXHQvKipcblx0ICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cblx0ICogQHBhcmFtICB7YW55fSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcblx0ICogQHJldHVybiB7c3ltYm9sfSAgICAgICBSZXR1cm5zIHRoZSBzeW1ib2wgb3IgdGhyb3dzXG5cdCAqL1xuXHRjb25zdCB2YWxpZGF0ZVN5bWJvbCA9IGZ1bmN0aW9uIHZhbGlkYXRlU3ltYm9sKHZhbHVlOiBhbnkpOiBzeW1ib2wge1xuXHRcdGlmICghaXNTeW1ib2wodmFsdWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXG5cdGNvbnN0IGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcblx0Y29uc3QgZGVmaW5lUHJvcGVydHk6IChcblx0XHRvOiBhbnksXG5cdFx0cDogc3RyaW5nIHwgc3ltYm9sLFxuXHRcdGF0dHJpYnV0ZXM6IFByb3BlcnR5RGVzY3JpcHRvciAmIFRoaXNUeXBlPGFueT5cblx0KSA9PiBhbnkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgYXMgYW55O1xuXHRjb25zdCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG5cdGNvbnN0IG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5cblx0Y29uc3QgZ2xvYmFsU3ltYm9sczogeyBba2V5OiBzdHJpbmddOiBzeW1ib2wgfSA9IHt9O1xuXG5cdGNvbnN0IGdldFN5bWJvbE5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgY3JlYXRlZCA9IGNyZWF0ZShudWxsKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZGVzYzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcblx0XHRcdGxldCBwb3N0Zml4ID0gMDtcblx0XHRcdGxldCBuYW1lOiBzdHJpbmc7XG5cdFx0XHR3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XG5cdFx0XHRcdCsrcG9zdGZpeDtcblx0XHRcdH1cblx0XHRcdGRlc2MgKz0gU3RyaW5nKHBvc3RmaXggfHwgJycpO1xuXHRcdFx0Y3JlYXRlZFtkZXNjXSA9IHRydWU7XG5cdFx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cblx0XHRcdC8vIEZJWE1FOiBUZW1wb3JhcnkgZ3VhcmQgdW50aWwgdGhlIGR1cGxpY2F0ZSBleGVjdXRpb24gd2hlbiB0ZXN0aW5nIGNhbiBiZVxuXHRcdFx0Ly8gcGlubmVkIGRvd24uXG5cdFx0XHRpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlLCBuYW1lKSkge1xuXHRcdFx0XHRkZWZpbmVQcm9wZXJ0eShvYmpQcm90b3R5cGUsIG5hbWUsIHtcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCwgdmFsdWU6IGFueSkge1xuXHRcdFx0XHRcdFx0ZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fTtcblx0fSkoKTtcblxuXHRjb25zdCBJbnRlcm5hbFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCh0aGlzOiBhbnksIGRlc2NyaXB0aW9uPzogc3RyaW5nIHwgbnVtYmVyKTogc3ltYm9sIHtcblx0XHRpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRyZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcblx0fTtcblxuXHRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKHRoaXM6IFN5bWJvbCwgZGVzY3JpcHRpb24/OiBzdHJpbmcgfCBudW1iZXIpOiBzeW1ib2wge1xuXHRcdGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRcdH1cblx0XHRjb25zdCBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSk7XG5cdFx0ZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pO1xuXHRcdHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bSwge1xuXHRcdFx0X19kZXNjcmlwdGlvbl9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZGVzY3JpcHRpb24pLFxuXHRcdFx0X19uYW1lX186IGdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lKGRlc2NyaXB0aW9uKSlcblx0XHR9KTtcblx0fSBhcyBTeW1ib2xDb25zdHJ1Y3RvcjtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0U3ltYm9sLFxuXHRcdCdmb3InLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbihrZXk6IHN0cmluZyk6IHN5bWJvbCB7XG5cdFx0XHRpZiAoZ2xvYmFsU3ltYm9sc1trZXldKSB7XG5cdFx0XHRcdHJldHVybiBnbG9iYWxTeW1ib2xzW2tleV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbChTdHJpbmcoa2V5KSkpO1xuXHRcdH0pXG5cdCk7XG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLCB7XG5cdFx0a2V5Rm9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24oc3ltOiBzeW1ib2wpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRcdFx0bGV0IGtleTogc3RyaW5nO1xuXHRcdFx0dmFsaWRhdGVTeW1ib2woc3ltKTtcblx0XHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcblx0XHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLFxuXHRcdGhhc0luc3RhbmNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaGFzSW5zdGFuY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpc0NvbmNhdFNwcmVhZGFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRpdGVyYXRvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2l0ZXJhdG9yJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0bWF0Y2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdtYXRjaCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdG9ic2VydmFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0cmVwbGFjZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3JlcGxhY2UnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzZWFyY2g6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzZWFyY2gnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzcGVjaWVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwbGl0OiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BsaXQnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR0b1ByaW1pdGl2ZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3RvUHJpbWl0aXZlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dG9TdHJpbmdUYWc6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHVuc2NvcGFibGVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndW5zY29wYWJsZXMnKSwgZmFsc2UsIGZhbHNlKVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXG5cdGRlZmluZVByb3BlcnRpZXMoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLCB7XG5cdFx0Y29uc3RydWN0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wpLFxuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoXG5cdFx0XHRmdW5jdGlvbih0aGlzOiB7IF9fbmFtZV9fOiBzdHJpbmcgfSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX25hbWVfXztcblx0XHRcdH0sXG5cdFx0XHRmYWxzZSxcblx0XHRcdGZhbHNlXG5cdFx0KVxuXHR9KTtcblxuXHQvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sLnByb3RvdHlwZSAqL1xuXHRkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHR0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuICdTeW1ib2wgKCcgKyAoPGFueT52YWxpZGF0ZVN5bWJvbCh0aGlzKSkuX19kZXNjcmlwdGlvbl9fICsgJyknO1xuXHRcdH0pLFxuXHRcdHZhbHVlT2Y6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTtcblx0XHR9KVxuXHR9KTtcblxuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdFx0fSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoJ1N5bWJvbCcsIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xuXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdEludGVybmFsU3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKCg8YW55PlN5bWJvbCkucHJvdG90eXBlW1N5bWJvbC50b1ByaW1pdGl2ZV0sIGZhbHNlLCBmYWxzZSwgdHJ1ZSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0SW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoKDxhbnk+U3ltYm9sKS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKVxuXHQpO1xufVxuXG4vKipcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcGFyYW0gIHthbnl9ICAgICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjayB0byBzZWUgaWYgaXQgaXMgYSBzeW1ib2wgb3Igbm90XG4gKiBAcmV0dXJuIHtpcyBzeW1ib2x9ICAgICAgIFJldHVybnMgdHJ1ZSBpZiBhIHN5bWJvbCBvciBub3QgKGFuZCBuYXJyb3dzIHRoZSB0eXBlIGd1YXJkKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTeW1ib2wodmFsdWU6IGFueSk6IHZhbHVlIGlzIHN5bWJvbCB7XG5cdHJldHVybiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgfHwgdmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpKSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cbiAqL1xuW1xuXHQnaGFzSW5zdGFuY2UnLFxuXHQnaXNDb25jYXRTcHJlYWRhYmxlJyxcblx0J2l0ZXJhdG9yJyxcblx0J3NwZWNpZXMnLFxuXHQncmVwbGFjZScsXG5cdCdzZWFyY2gnLFxuXHQnc3BsaXQnLFxuXHQnbWF0Y2gnLFxuXHQndG9QcmltaXRpdmUnLFxuXHQndG9TdHJpbmdUYWcnLFxuXHQndW5zY29wYWJsZXMnLFxuXHQnb2JzZXJ2YWJsZSdcbl0uZm9yRWFjaCgod2VsbEtub3duKSA9PiB7XG5cdGlmICghKFN5bWJvbCBhcyBhbnkpW3dlbGxLbm93bl0pIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sLCB3ZWxsS25vd24sIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFN5bWJvbC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UsIEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Vha01hcDxLIGV4dGVuZHMgb2JqZWN0LCBWPiB7XG5cdC8qKlxuXHQgKiBSZW1vdmUgYSBga2V5YCBmcm9tIHRoZSBtYXBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJlbW92ZVxuXHQgKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUgdmFsdWUgd2FzIHJlbW92ZWQsIG90aGVyd2lzZSBgZmFsc2VgXG5cdCAqL1xuXHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIHZhbHVlLCBiYXNlZCBvbiB0aGUgc3VwcGxpZWQgYGtleWBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIHJldHJpZXZlIHRoZSBgdmFsdWVgIGZvclxuXHQgKiBAcmV0dXJuIHRoZSBgdmFsdWVgIGJhc2VkIG9uIHRoZSBga2V5YCBpZiBmb3VuZCwgb3RoZXJ3aXNlIGBmYWxzZWBcblx0ICovXG5cdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIGlmIGEgYGtleWAgaXMgcHJlc2VudCBpbiB0aGUgbWFwXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBrZXkgaXMgcGFydCBvZiB0aGUgbWFwLCBvdGhlcndpc2UgYGZhbHNlYC5cblx0ICovXG5cdGhhcyhrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBTZXQgYSBgdmFsdWVgIGZvciBhIHBhcnRpY3VsYXIgYGtleWAuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGBrZXlgIHRvIHNldCB0aGUgYHZhbHVlYCBmb3Jcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBgdmFsdWVgIHRvIHNldFxuXHQgKiBAcmV0dXJuIHRoZSBpbnN0YW5jZXNcblx0ICovXG5cdHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcztcblxuXHRyZWFkb25seSBbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1dlYWtNYXAnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdlYWtNYXBDb25zdHJ1Y3RvciB7XG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRuZXcgKCk6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlPzogW0ssIFZdW10pOiBXZWFrTWFwPEssIFY+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBgV2Vha01hcGBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSB0aGF0IGNvbnRhaW5zIHlpZWxkcyB1cCBrZXkvdmFsdWUgcGFpciBlbnRyaWVzXG5cdCAqL1xuXHRuZXcgPEsgZXh0ZW5kcyBvYmplY3QsIFY+KGl0ZXJhYmxlOiBJdGVyYWJsZTxbSywgVl0+KTogV2Vha01hcDxLLCBWPjtcblxuXHRyZWFkb25seSBwcm90b3R5cGU6IFdlYWtNYXA8b2JqZWN0LCBhbnk+O1xufVxuXG5leHBvcnQgbGV0IFdlYWtNYXA6IFdlYWtNYXBDb25zdHJ1Y3RvciA9IGdsb2JhbC5XZWFrTWFwO1xuXG5pbnRlcmZhY2UgRW50cnk8SywgVj4ge1xuXHRrZXk6IEs7XG5cdHZhbHVlOiBWO1xufVxuXG5pZiAoIWhhcygnZXM2LXdlYWttYXAnKSkge1xuXHRjb25zdCBERUxFVEVEOiBhbnkgPSB7fTtcblxuXHRjb25zdCBnZXRVSUQgPSBmdW5jdGlvbiBnZXRVSUQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKTtcblx0fTtcblxuXHRjb25zdCBnZW5lcmF0ZU5hbWUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHN0YXJ0SWQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgJSAxMDAwMDAwMDApO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuICdfX3dtJyArIGdldFVJRCgpICsgKHN0YXJ0SWQrKyArICdfXycpO1xuXHRcdH07XG5cdH0pKCk7XG5cblx0V2Vha01hcCA9IGNsYXNzIFdlYWtNYXA8SywgVj4ge1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZztcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9mcm96ZW5FbnRyaWVzOiBFbnRyeTxLLCBWPltdO1xuXG5cdFx0Y29uc3RydWN0b3IoaXRlcmFibGU/OiBBcnJheUxpa2U8W0ssIFZdPiB8IEl0ZXJhYmxlPFtLLCBWXT4pIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX25hbWUnLCB7XG5cdFx0XHRcdHZhbHVlOiBnZW5lcmF0ZU5hbWUoKVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMgPSBbXTtcblxuXHRcdFx0aWYgKGl0ZXJhYmxlKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpdGVtID0gaXRlcmFibGVbaV07XG5cdFx0XHRcdFx0XHR0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5OiBhbnkpOiBudW1iZXIge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mcm96ZW5FbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdGRlbGV0ZShrZXk6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xuXHRcdFx0XHRlbnRyeS52YWx1ZSA9IERFTEVURUQ7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRnZXQoa2V5OiBhbnkpOiBWIHwgdW5kZWZpbmVkIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG5cdFx0XHRcdHJldHVybiBlbnRyeS52YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnJvemVuRW50cmllc1tmcm96ZW5JbmRleF0udmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFzKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKEJvb2xlYW4oZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0c2V0KGtleTogYW55LCB2YWx1ZT86IGFueSk6IHRoaXMge1xuXHRcdFx0aWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcblx0XHRcdH1cblx0XHRcdGxldCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XG5cdFx0XHRcdGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG5cdFx0XHRcdFx0a2V5OiB7IHZhbHVlOiBrZXkgfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcblx0XHRcdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiBlbnRyeVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbnRyeS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdXZWFrTWFwJyA9ICdXZWFrTWFwJztcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgV2Vha01hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBXZWFrTWFwLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSwgaXNJdGVyYWJsZSwgSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCB7IE1BWF9TQUZFX0lOVEVHRVIgfSBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXBDYWxsYmFjazxULCBVPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gbWFwcGluZ1xuXHQgKlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBtYXBwZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50XG5cdCAqL1xuXHQoZWxlbWVudDogVCwgaW5kZXg6IG51bWJlcik6IFU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZENhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB1c2luZyBmaW5kXG5cdCAqXG5cdCAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgaXMgY3VycmVudHkgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgYW5hbHlzZWRcblx0ICogQHBhcmFtIGFycmF5IFRoZSBzb3VyY2UgYXJyYXlcblx0ICovXG5cdChlbGVtZW50OiBULCBpbmRleDogbnVtYmVyLCBhcnJheTogQXJyYXlMaWtlPFQ+KTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFdyaXRhYmxlQXJyYXlMaWtlPFQ+IHtcblx0cmVhZG9ubHkgbGVuZ3RoOiBudW1iZXI7XG5cdFtuOiBudW1iZXJdOiBUO1xufVxuXG4vKiBFUzYgQXJyYXkgc3RhdGljIG1ldGhvZHMgKi9cblxuZXhwb3J0IGludGVyZmFjZSBGcm9tIHtcblx0LyoqXG5cdCAqIFRoZSBBcnJheS5mcm9tKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgQXJyYXkgaW5zdGFuY2UgZnJvbSBhbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZSBBbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdCAqIEBwYXJhbSBtYXBGdW5jdGlvbiBBIG1hcCBmdW5jdGlvbiB0byBjYWxsIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXlcblx0ICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgbWFwIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm4gVGhlIG5ldyBBcnJheVxuXHQgKi9cblx0PFQsIFU+KHNvdXJjZTogQXJyYXlMaWtlPFQ+IHwgSXRlcmFibGU8VD4sIG1hcEZ1bmN0aW9uOiBNYXBDYWxsYmFjazxULCBVPiwgdGhpc0FyZz86IGFueSk6IEFycmF5PFU+O1xuXG5cdC8qKlxuXHQgKiBUaGUgQXJyYXkuZnJvbSgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IEFycmF5IGluc3RhbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgQW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheVxuXHQgKiBAcmV0dXJuIFRoZSBuZXcgQXJyYXlcblx0ICovXG5cdDxUPihzb3VyY2U6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KTogQXJyYXk8VD47XG59XG5cbmV4cG9ydCBsZXQgZnJvbTogRnJvbTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGFycmF5IGZyb20gdGhlIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIGFyZ3VtZW50cyBBbnkgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgdGhlIGFycmF5XG4gKiBAcmV0dXJuIEFuIGFycmF5IGZyb20gdGhlIGdpdmVuIGFyZ3VtZW50c1xuICovXG5leHBvcnQgbGV0IG9mOiA8VD4oLi4uaXRlbXM6IFRbXSkgPT4gQXJyYXk8VD47XG5cbi8qIEVTNiBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogQ29waWVzIGRhdGEgaW50ZXJuYWxseSB3aXRoaW4gYW4gYXJyYXkgb3IgYXJyYXktbGlrZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gb2Zmc2V0IFRoZSBpbmRleCB0byBzdGFydCBjb3B5aW5nIHZhbHVlcyB0bzsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgKGluY2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEBwYXJhbSBlbmQgVGhlIGxhc3QgKGV4Y2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcbiAqIEByZXR1cm4gVGhlIHRhcmdldFxuICovXG5leHBvcnQgbGV0IGNvcHlXaXRoaW46IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgb2Zmc2V0OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbGxzIGVsZW1lbnRzIG9mIGFuIGFycmF5LWxpa2Ugb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gZmlsbFxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBmaWxsIGVhY2ggZWxlbWVudCBvZiB0aGUgdGFyZ2V0IHdpdGhcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgaW5kZXggdG8gZmlsbFxuICogQHBhcmFtIGVuZCBUaGUgKGV4Y2x1c2l2ZSkgaW5kZXggYXQgd2hpY2ggdG8gc3RvcCBmaWxsaW5nXG4gKiBAcmV0dXJuIFRoZSBmaWxsZWQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBsZXQgZmlsbDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogVCwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcikgPT4gQXJyYXlMaWtlPFQ+O1xuXG4vKipcbiAqIEZpbmRzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbnN0YW5jZSBtYXRjaGluZyB0aGUgY2FsbGJhY2sgb3IgdW5kZWZpbmVkIGlmIG9uZSBpcyBub3QgZm91bmQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGlmIHRoZSBjdXJyZW50IHZhbHVlIG1hdGNoZXMgYSBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyB0aGUgY2FsbGJhY2ssIG9yIHVuZGVmaW5lZCBpZiBvbmUgZG9lcyBub3QgZXhpc3RcbiAqL1xuZXhwb3J0IGxldCBmaW5kOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gVCB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBzZWFyY2ggYW5kIHJldHVybnMgdGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLFxuICogb3IgLTEgaWYgbm8gdmFsdWVzIHNhdGlzZnkgaXQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIHRydWUgaWYgdGhlIGN1cnJlbnQgdmFsdWUgc2F0aXNmaWVzIGl0cyBjcml0ZXJpYVxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxuICogQHJldHVybiBUaGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0XG4gKi9cbmV4cG9ydCBsZXQgZmluZEluZGV4OiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSkgPT4gbnVtYmVyO1xuXG4vKiBFUzcgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBhcnJheSBpbmNsdWRlcyBhIGdpdmVuIHZhbHVlXG4gKlxuICogQHBhcmFtIHRhcmdldCB0aGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gc2VhcmNoRWxlbWVudCB0aGUgaXRlbSB0byBzZWFyY2ggZm9yXG4gKiBAcGFyYW0gZnJvbUluZGV4IHRoZSBzdGFydGluZyBpbmRleCB0byBzZWFyY2ggZnJvbVxuICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGFycmF5IGluY2x1ZGVzIHRoZSBlbGVtZW50LCBvdGhlcndpc2UgYGZhbHNlYFxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHNlYXJjaEVsZW1lbnQ6IFQsIGZyb21JbmRleD86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuaWYgKGhhcygnZXM2LWFycmF5JykgJiYgaGFzKCdlczYtYXJyYXktZmlsbCcpKSB7XG5cdGZyb20gPSBnbG9iYWwuQXJyYXkuZnJvbTtcblx0b2YgPSBnbG9iYWwuQXJyYXkub2Y7XG5cdGNvcHlXaXRoaW4gPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuY29weVdpdGhpbik7XG5cdGZpbGwgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XG5cdGZpbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZCk7XG5cdGZpbmRJbmRleCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpO1xufSBlbHNlIHtcblx0Ly8gSXQgaXMgb25seSBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkvaU9TIHRoYXQgaGF2ZSBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uIGFuZCBzbyBhcmVuJ3QgaW4gdGhlIHdpbGRcblx0Ly8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxuXG5cdC8qKlxuXHQgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cblx0ICpcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG5cdCAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXG5cdCAqL1xuXHRjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAoaXNOYU4obGVuZ3RoKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0bGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcblx0ICogQHJldHVybiBBbiBpbnRlZ2VyXG5cdCAqL1xuXHRjb25zdCB0b0ludGVnZXIgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWU6IGFueSk6IG51bWJlciB7XG5cdFx0dmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXHRcdGlmIChpc05hTih2YWx1ZSkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcblx0fTtcblxuXHQvKipcblx0ICogTm9ybWFsaXplcyBhbiBvZmZzZXQgYWdhaW5zdCBhIGdpdmVuIGxlbmd0aCwgd3JhcHBpbmcgaXQgaWYgbmVnYXRpdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIHRvdGFsIGxlbmd0aCB0byBub3JtYWxpemUgYWdhaW5zdFxuXHQgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxuXHQgKi9cblx0Y29uc3Qgbm9ybWFsaXplT2Zmc2V0ID0gZnVuY3Rpb24gbm9ybWFsaXplT2Zmc2V0KHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5tYXgobGVuZ3RoICsgdmFsdWUsIDApIDogTWF0aC5taW4odmFsdWUsIGxlbmd0aCk7XG5cdH07XG5cblx0ZnJvbSA9IGZ1bmN0aW9uIGZyb20oXG5cdFx0dGhpczogQXJyYXlDb25zdHJ1Y3Rvcixcblx0XHRhcnJheUxpa2U6IEl0ZXJhYmxlPGFueT4gfCBBcnJheUxpa2U8YW55Pixcblx0XHRtYXBGdW5jdGlvbj86IE1hcENhbGxiYWNrPGFueSwgYW55Pixcblx0XHR0aGlzQXJnPzogYW55XG5cdCk6IEFycmF5PGFueT4ge1xuXHRcdGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRpZiAobWFwRnVuY3Rpb24gJiYgdGhpc0FyZykge1xuXHRcdFx0bWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xuXHRcdH1cblxuXHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0Y29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuXHRcdGNvbnN0IGxlbmd0aDogbnVtYmVyID0gdG9MZW5ndGgoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGgpO1xuXG5cdFx0Ly8gU3VwcG9ydCBleHRlbnNpb25cblx0XHRjb25zdCBhcnJheTogYW55W10gPVxuXHRcdFx0dHlwZW9mIENvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gPGFueVtdPk9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcblxuXHRcdGlmICghaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxuXHRcdC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cblx0XHRpZiAoaXNBcnJheUxpa2UoYXJyYXlMaWtlKSkge1xuXHRcdFx0aWYgKGxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbihhcnJheUxpa2VbaV0sIGkpIDogYXJyYXlMaWtlW2ldO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGFycmF5TGlrZSkge1xuXHRcdFx0XHRhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoKDxhbnk+YXJyYXlMaWtlKS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnJheTtcblx0fTtcblxuXHRvZiA9IGZ1bmN0aW9uIG9mPFQ+KC4uLml0ZW1zOiBUW10pOiBBcnJheTxUPiB7XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcblx0fTtcblxuXHRjb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbjxUPihcblx0XHR0YXJnZXQ6IEFycmF5TGlrZTxUPixcblx0XHRvZmZzZXQ6IG51bWJlcixcblx0XHRzdGFydDogbnVtYmVyLFxuXHRcdGVuZD86IG51bWJlclxuXHQpOiBBcnJheUxpa2U8VD4ge1xuXHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignY29weVdpdGhpbjogdGFyZ2V0IG11c3QgYmUgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRvZmZzZXQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKG9mZnNldCksIGxlbmd0aCk7XG5cdFx0c3RhcnQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcblx0XHRlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcblx0XHRsZXQgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcblxuXHRcdGxldCBkaXJlY3Rpb24gPSAxO1xuXHRcdGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XG5cdFx0XHRkaXJlY3Rpb24gPSAtMTtcblx0XHRcdHN0YXJ0ICs9IGNvdW50IC0gMTtcblx0XHRcdG9mZnNldCArPSBjb3VudCAtIDE7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKGNvdW50ID4gMCkge1xuXHRcdFx0aWYgKHN0YXJ0IGluIHRhcmdldCkge1xuXHRcdFx0XHQodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSAodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtvZmZzZXRdO1xuXHRcdFx0fVxuXG5cdFx0XHRvZmZzZXQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0c3RhcnQgKz0gZGlyZWN0aW9uO1xuXHRcdFx0Y291bnQtLTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbGwgPSBmdW5jdGlvbiBmaWxsPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCB2YWx1ZTogYW55LCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKTogQXJyYXlMaWtlPFQ+IHtcblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblx0XHRsZXQgaSA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xuXHRcdGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xuXG5cdFx0d2hpbGUgKGkgPCBlbmQpIHtcblx0XHRcdCh0YXJnZXQgYXMgV3JpdGFibGVBcnJheUxpa2U8VD4pW2krK10gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cdGZpbmQgPSBmdW5jdGlvbiBmaW5kPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pOiBUIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBpbmRleCA9IGZpbmRJbmRleDxUPih0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0XHRyZXR1cm4gaW5kZXggIT09IC0xID8gdGFyZ2V0W2luZGV4XSA6IHVuZGVmaW5lZDtcblx0fTtcblxuXHRmaW5kSW5kZXggPSBmdW5jdGlvbiBmaW5kSW5kZXg8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSk6IG51bWJlciB7XG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cblx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNBcmcpIHtcblx0XHRcdGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fTtcbn1cblxuaWYgKGhhcygnZXM3LWFycmF5JykpIHtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcblx0ICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcblx0ICovXG5cdGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuXHRcdGlmIChpc05hTihsZW5ndGgpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcblx0XHRcdGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG5cdH07XG5cblx0aW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlczxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgc2VhcmNoRWxlbWVudDogVCwgZnJvbUluZGV4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0bGV0IGxlbiA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IGZyb21JbmRleDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcblx0XHRcdGlmIChcblx0XHRcdFx0c2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcblx0XHRcdFx0KHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcnJheS50cyIsImNvbnN0IGdsb2JhbE9iamVjdDogYW55ID0gKGZ1bmN0aW9uKCk6IGFueSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIGdsb2JhbCBzcGVjIGRlZmluZXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgY2FsbGVkICdnbG9iYWwnXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG5cdFx0Ly8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xuXHRcdHJldHVybiBnbG9iYWw7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyB3aW5kb3cgaXMgZGVmaW5lZCBpbiBicm93c2Vyc1xuXHRcdHJldHVybiB3aW5kb3c7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gc2VsZiBpcyBkZWZpbmVkIGluIFdlYldvcmtlcnNcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2xvYmFsT2JqZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGdsb2JhbC50cyIsImltcG9ydCAnLi9TeW1ib2wnO1xuaW1wb3J0IHsgSElHSF9TVVJST0dBVEVfTUFYLCBISUdIX1NVUlJPR0FURV9NSU4gfSBmcm9tICcuL3N0cmluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3JSZXN1bHQ8VD4ge1xuXHRyZWFkb25seSBkb25lOiBib29sZWFuO1xuXHRyZWFkb25seSB2YWx1ZTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYXRvcjxUPiB7XG5cdG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcblxuXHRyZXR1cm4/KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cblx0dGhyb3c/KGU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZTxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlSXRlcmF0b3I8VD4gZXh0ZW5kcyBJdGVyYXRvcjxUPiB7XG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VD47XG59XG5cbmNvbnN0IHN0YXRpY0RvbmU6IEl0ZXJhdG9yUmVzdWx0PGFueT4gPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcblxuLyoqXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgU2hpbUl0ZXJhdG9yPFQ+IHtcblx0cHJpdmF0ZSBfbGlzdDogQXJyYXlMaWtlPFQ+O1xuXHRwcml2YXRlIF9uZXh0SW5kZXggPSAtMTtcblx0cHJpdmF0ZSBfbmF0aXZlSXRlcmF0b3I6IEl0ZXJhdG9yPFQ+O1xuXG5cdGNvbnN0cnVjdG9yKGxpc3Q6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+KSB7XG5cdFx0aWYgKGlzSXRlcmFibGUobGlzdCkpIHtcblx0XHRcdHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2xpc3QgPSBsaXN0O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXG5cdCAqL1xuXHRuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0XHRpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5fbGlzdCkge1xuXHRcdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdFx0fVxuXHRcdGlmICgrK3RoaXMuX25leHRJbmRleCA8IHRoaXMuX2xpc3QubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkb25lOiBmYWxzZSxcblx0XHRcdFx0dmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0YXRpY0RvbmU7XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+IHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgSXRlcmFibGU8YW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWU6IGFueSk6IHZhbHVlIGlzIEFycmF5TGlrZTxhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0PFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPik6IEl0ZXJhdG9yPFQ+IHwgdW5kZWZpbmVkIHtcblx0aWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XG5cdFx0cmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcblx0fSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb3JPZkNhbGxiYWNrPFQ+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGEgZm9yT2YoKSBpdGVyYXRpb25cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBjdXJyZW50IHZhbHVlXG5cdCAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyXG5cdCAqIEBwYXJhbSBkb0JyZWFrIEEgZnVuY3Rpb24sIGlmIGNhbGxlZCwgd2lsbCBzdG9wIHRoZSBpdGVyYXRpb25cblx0ICovXG5cdCh2YWx1ZTogVCwgb2JqZWN0OiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZywgZG9CcmVhazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKlxuICogU2hpbXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYGZvciAuLi4gb2ZgIGJsb2Nrc1xuICpcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgb2JqZWN0IHRoZSBwcm92aWRlcyBhbiBpbnRlcmF0b3IgaW50ZXJmYWNlXG4gKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gb2YgdGhlIGl0ZXJhYmxlXG4gKiBAcGFyYW0gdGhpc0FyZyBPcHRpb25hbCBzY29wZSB0byBwYXNzIHRoZSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yT2Y8VD4oXG5cdGl0ZXJhYmxlOiBJdGVyYWJsZTxUPiB8IEFycmF5TGlrZTxUPiB8IHN0cmluZyxcblx0Y2FsbGJhY2s6IEZvck9mQ2FsbGJhY2s8VD4sXG5cdHRoaXNBcmc/OiBhbnlcbik6IHZvaWQge1xuXHRsZXQgYnJva2VuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gZG9CcmVhaygpIHtcblx0XHRicm9rZW4gPSB0cnVlO1xuXHR9XG5cblx0LyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cblx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0Y29uc3QgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7ICsraSkge1xuXHRcdFx0bGV0IGNoYXIgPSBpdGVyYWJsZVtpXTtcblx0XHRcdGlmIChpICsgMSA8IGwpIHtcblx0XHRcdFx0Y29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcblx0XHRcdFx0aWYgKGNvZGUgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGNvZGUgPD0gSElHSF9TVVJST0dBVEVfTUFYKSB7XG5cdFx0XHRcdFx0Y2hhciArPSBpdGVyYWJsZVsrK2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNoYXIsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcblx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdCBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XG5cdFx0aWYgKGl0ZXJhdG9yKSB7XG5cdFx0XHRsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG5cdFx0XHR3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRcdGlmIChicm9rZW4pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGl0ZXJhdG9yLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKlxuICogVGhlIHNtYWxsZXN0IGludGVydmFsIGJldHdlZW4gdHdvIHJlcHJlc2VudGFibGUgbnVtYmVycy5cbiAqL1xuZXhwb3J0IGNvbnN0IEVQU0lMT04gPSAxO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUlOX1NBRkVfSU5URUdFUiA9IC1NQVhfU0FGRV9JTlRFR0VSO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIE5hTiB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBOYU4sIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYU4odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNOYU4odmFsdWUpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc0Zpbml0ZSh2YWx1ZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIgdGhhdCBpcyAnc2FmZSwnIG1lYW5pbmc6XG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXG4gKiAgICAgIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uIGNhbm5vdCBiZSB0aGUgcmVzdWx0IG9mIHJvdW5kaW5nIGFueSBvdGhlclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiBNYXRoLmFicyh2YWx1ZSkgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBudW1iZXIudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgeyBpc1N5bWJvbCB9IGZyb20gJy4vU3ltYm9sJztcblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RBc3NpZ24ge1xuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFU+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVLCBWPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYpOiBUICYgVSAmIFY7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZTEgVGhlIGZpcnN0IHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UyIFRoZSBzZWNvbmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICogQHBhcmFtIHNvdXJjZTMgVGhlIHRoaXJkIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVSwgViwgVz4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXKTogVCAmIFUgJiBWICYgVztcblxuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlcyBPbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllc1xuXHQgKi9cblx0KHRhcmdldDogb2JqZWN0LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RFbnRlcmllcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleS92YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQ8VCBleHRlbmRzIHsgW2tleTogc3RyaW5nXTogYW55IH0sIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBUKTogW2tleW9mIFQsIFRbS11dW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5L3ZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdChvOiBvYmplY3QpOiBbc3RyaW5nLCBhbnldW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyB7XG5cdDxUPihvOiBUKTogeyBbSyBpbiBrZXlvZiBUXTogUHJvcGVydHlEZXNjcmlwdG9yIH07XG5cdChvOiBhbnkpOiB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdFZhbHVlcyB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdDxUPihvOiB7IFtzOiBzdHJpbmddOiBUIH0pOiBUW107XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0KG86IG9iamVjdCk6IGFueVtdO1xufVxuXG5leHBvcnQgbGV0IGFzc2lnbjogT2JqZWN0QXNzaWduO1xuXG4vKipcbiAqIEdldHMgdGhlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICogQW4gb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb25lIHRoYXQgaXMgZGVmaW5lZCBkaXJlY3RseSBvbiB0aGUgb2JqZWN0IGFuZCBpcyBub3RcbiAqIGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gcCBOYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IDxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcHJvcGVydHlLZXk6IEspID0+IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LiBUaGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFyZSB0aG9zZSB0aGF0IGFyZSBkZWZpbmVkIGRpcmVjdGx5XG4gKiBvbiB0aGF0IG9iamVjdCwgYW5kIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS4gVGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGluY2x1ZGUgYm90aCBmaWVsZHMgKG9iamVjdHMpIGFuZCBmdW5jdGlvbnMuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgb3duIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlOYW1lczogKG86IGFueSkgPT4gc3RyaW5nW107XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3ltYm9sIHByb3BlcnRpZXMgZm91bmQgZGlyZWN0bHkgb24gb2JqZWN0IG8uXG4gKiBAcGFyYW0gbyBPYmplY3QgdG8gcmV0cmlldmUgdGhlIHN5bWJvbHMgZnJvbS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IChvOiBhbnkpID0+IHN5bWJvbFtdO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHBhcmFtIHZhbHVlMSBUaGUgZmlyc3QgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUyIFRoZSBzZWNvbmQgdmFsdWUuXG4gKi9cbmV4cG9ydCBsZXQgaXM6ICh2YWx1ZTE6IGFueSwgdmFsdWUyOiBhbnkpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvZiBhbiBvYmplY3QuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cbiAqL1xuZXhwb3J0IGxldCBrZXlzOiAobzogb2JqZWN0KSA9PiBzdHJpbmdbXTtcblxuLyogRVM3IE9iamVjdCBzdGF0aWMgbWV0aG9kcyAqL1xuXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cbmV4cG9ydCBsZXQgZW50cmllczogT2JqZWN0RW50ZXJpZXM7XG5cbmV4cG9ydCBsZXQgdmFsdWVzOiBPYmplY3RWYWx1ZXM7XG5cbmlmIChoYXMoJ2VzNi1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRhc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG5cdGdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cdGlzID0gZ2xvYmFsT2JqZWN0LmlzO1xuXHRrZXlzID0gZ2xvYmFsT2JqZWN0LmtleXM7XG59IGVsc2Uge1xuXHRrZXlzID0gZnVuY3Rpb24gc3ltYm9sQXdhcmVLZXlzKG86IG9iamVjdCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xuXHR9O1xuXG5cdGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pIHtcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcblx0XHRzb3VyY2VzLmZvckVhY2goKG5leHRTb3VyY2UpID0+IHtcblx0XHRcdGlmIChuZXh0U291cmNlKSB7XG5cdFx0XHRcdC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0XHRrZXlzKG5leHRTb3VyY2UpLmZvckVhY2goKG5leHRLZXkpID0+IHtcblx0XHRcdFx0XHR0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRvO1xuXHR9O1xuXG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihcblx0XHRvOiBhbnksXG5cdFx0cHJvcDogc3RyaW5nIHwgc3ltYm9sXG5cdCk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKGlzU3ltYm9sKHByb3ApKSB7XG5cdFx0XHRyZXR1cm4gKDxhbnk+T2JqZWN0KS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuXHRcdH1cblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvOiBhbnkpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMobzogYW55KTogc3ltYm9sW10ge1xuXHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxuXHRcdFx0LmZpbHRlcigoa2V5KSA9PiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpXG5cdFx0XHQubWFwKChrZXkpID0+IFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSkpO1xuXHR9O1xuXG5cdGlzID0gZnVuY3Rpb24gaXModmFsdWUxOiBhbnksIHZhbHVlMjogYW55KTogYm9vbGVhbiB7XG5cdFx0aWYgKHZhbHVlMSA9PT0gdmFsdWUyKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUxICE9PSAwIHx8IDEgLyB2YWx1ZTEgPT09IDEgLyB2YWx1ZTI7IC8vIC0wXG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMSAmJiB2YWx1ZTIgIT09IHZhbHVlMjsgLy8gTmFOXG5cdH07XG59XG5cbmlmIChoYXMoJ2VzMjAxNy1vYmplY3QnKSkge1xuXHRjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XG5cdGVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcblx0dmFsdWVzID0gZ2xvYmFsT2JqZWN0LnZhbHVlcztcbn0gZWxzZSB7XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG86IGFueSkge1xuXHRcdHJldHVybiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLnJlZHVjZShcblx0XHRcdChwcmV2aW91cywga2V5KSA9PiB7XG5cdFx0XHRcdHByZXZpb3VzW2tleV0gPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KSE7XG5cdFx0XHRcdHJldHVybiBwcmV2aW91cztcblx0XHRcdH0sXG5cdFx0XHR7fSBhcyB7IFtrZXk6IHN0cmluZ106IFByb3BlcnR5RGVzY3JpcHRvciB9XG5cdFx0KTtcblx0fTtcblxuXHRlbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvOiBhbnkpOiBbc3RyaW5nLCBhbnldW10ge1xuXHRcdHJldHVybiBrZXlzKG8pLm1hcCgoa2V5KSA9PiBba2V5LCBvW2tleV1dIGFzIFtzdHJpbmcsIGFueV0pO1xuXHR9O1xuXG5cdHZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyhvOiBhbnkpOiBhbnlbXSB7XG5cdFx0cmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IG9ba2V5XSk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gb2JqZWN0LnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpbmdOb3JtYWxpemUge1xuXHQvKipcblx0ICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuXHQgKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG5cdCAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuXHQgKiBpcyBcIk5GQ1wiXG5cdCAqL1xuXHQodGFyZ2V0OiBzdHJpbmcsIGZvcm06ICdORkMnIHwgJ05GRCcgfCAnTkZLQycgfCAnTkZLRCcpOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cblx0ICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuXHQgKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcblx0ICogaXMgXCJORkNcIlxuXHQgKi9cblx0KHRhcmdldDogc3RyaW5nLCBmb3JtPzogc3RyaW5nKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUFYID0gMHhkYmZmO1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBMT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XG5cbi8qIEVTNiBzdGF0aWMgbWV0aG9kcyAqL1xuXG4vKipcbiAqIFJldHVybiB0aGUgU3RyaW5nIHZhbHVlIHdob3NlIGVsZW1lbnRzIGFyZSwgaW4gb3JkZXIsIHRoZSBlbGVtZW50cyBpbiB0aGUgTGlzdCBlbGVtZW50cy5cbiAqIElmIGxlbmd0aCBpcyAwLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICogQHBhcmFtIGNvZGVQb2ludHMgVGhlIGNvZGUgcG9pbnRzIHRvIGdlbmVyYXRlIHRoZSBzdHJpbmdcbiAqL1xuZXhwb3J0IGxldCBmcm9tQ29kZVBvaW50OiAoLi4uY29kZVBvaW50czogbnVtYmVyW10pID0+IHN0cmluZztcblxuLyoqXG4gKiBgcmF3YCBpcyBpbnRlbmRlZCBmb3IgdXNlIGFzIGEgdGFnIGZ1bmN0aW9uIG9mIGEgVGFnZ2VkIFRlbXBsYXRlIFN0cmluZy4gV2hlbiBjYWxsZWRcbiAqIGFzIHN1Y2ggdGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgYmUgYSB3ZWxsIGZvcm1lZCB0ZW1wbGF0ZSBjYWxsIHNpdGUgb2JqZWN0IGFuZCB0aGUgcmVzdFxuICogcGFyYW1ldGVyIHdpbGwgY29udGFpbiB0aGUgc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAqIEBwYXJhbSB0ZW1wbGF0ZSBBIHdlbGwtZm9ybWVkIHRlbXBsYXRlIHN0cmluZyBjYWxsIHNpdGUgcmVwcmVzZW50YXRpb24uXG4gKiBAcGFyYW0gc3Vic3RpdHV0aW9ucyBBIHNldCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICovXG5leHBvcnQgbGV0IHJhdzogKHRlbXBsYXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pID0+IHN0cmluZztcblxuLyogRVM2IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgbm9ubmVnYXRpdmUgaW50ZWdlciBOdW1iZXIgbGVzcyB0aGFuIDExMTQxMTIgKDB4MTEwMDAwKSB0aGF0IGlzIHRoZSBjb2RlIHBvaW50XG4gKiB2YWx1ZSBvZiB0aGUgVVRGLTE2IGVuY29kZWQgY29kZSBwb2ludCBzdGFydGluZyBhdCB0aGUgc3RyaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gcG9zIGluXG4gKiB0aGUgU3RyaW5nIHJlc3VsdGluZyBmcm9tIGNvbnZlcnRpbmcgdGhpcyBvYmplY3QgdG8gYSBTdHJpbmcuXG4gKiBJZiB0aGVyZSBpcyBubyBlbGVtZW50IGF0IHRoYXQgcG9zaXRpb24sIHRoZSByZXN1bHQgaXMgdW5kZWZpbmVkLlxuICogSWYgYSB2YWxpZCBVVEYtMTYgc3Vycm9nYXRlIHBhaXIgZG9lcyBub3QgYmVnaW4gYXQgcG9zLCB0aGUgcmVzdWx0IGlzIHRoZSBjb2RlIHVuaXQgYXQgcG9zLlxuICovXG5leHBvcnQgbGV0IGNvZGVQb2ludEF0OiAodGFyZ2V0OiBzdHJpbmcsIHBvcz86IG51bWJlcikgPT4gbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIGVuZFBvc2l0aW9uIOKAkyBsZW5ndGgodGhpcykuIE90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICovXG5leHBvcnQgbGV0IGVuZHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgc2VhcmNoU3RyaW5nIGFwcGVhcnMgYXMgYSBzdWJzdHJpbmcgb2YgdGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIHRoaXNcbiAqIG9iamVjdCB0byBhIFN0cmluZywgYXQgb25lIG9yIG1vcmUgcG9zaXRpb25zIHRoYXQgYXJlXG4gKiBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gcG9zaXRpb247IG90aGVyd2lzZSwgcmV0dXJucyBmYWxzZS5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBzZWFyY2hTdHJpbmcgc2VhcmNoIHN0cmluZ1xuICogQHBhcmFtIHBvc2l0aW9uIElmIHBvc2l0aW9uIGlzIHVuZGVmaW5lZCwgMCBpcyBhc3N1bWVkLCBzbyBhcyB0byBzZWFyY2ggYWxsIG9mIHRoZSBTdHJpbmcuXG4gKi9cbmV4cG9ydCBsZXQgaW5jbHVkZXM6ICh0YXJnZXQ6IHN0cmluZywgc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cbiAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcbiAqIGlzIFwiTkZDXCJcbiAqL1xuZXhwb3J0IGxldCBub3JtYWxpemU6IFN0cmluZ05vcm1hbGl6ZTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbWFkZSBmcm9tIGNvdW50IGNvcGllcyBhcHBlbmRlZCB0b2dldGhlci4gSWYgY291bnQgaXMgMCxcbiAqIFQgaXMgdGhlIGVtcHR5IFN0cmluZyBpcyByZXR1cm5lZC5cbiAqIEBwYXJhbSBjb3VudCBudW1iZXIgb2YgY29waWVzIHRvIGFwcGVuZFxuICovXG5leHBvcnQgbGV0IHJlcGVhdDogKHRhcmdldDogc3RyaW5nLCBjb3VudD86IG51bWJlcikgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIHBvc2l0aW9uLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBzdGFydHNXaXRoOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyogRVM3IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxuICogVGhlIHBhZGRpbmcgaXMgYXBwbGllZCBmcm9tIHRoZSBlbmQgKHJpZ2h0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZEVuZDogKHRhcmdldDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG4vKipcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIHN0YXJ0IChsZWZ0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZFN0YXJ0OiAodGFyZ2V0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbmlmIChoYXMoJ2VzNi1zdHJpbmcnKSAmJiBoYXMoJ2VzNi1zdHJpbmctcmF3JykpIHtcblx0ZnJvbUNvZGVQb2ludCA9IGdsb2JhbC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcblx0cmF3ID0gZ2xvYmFsLlN0cmluZy5yYXc7XG5cblx0Y29kZVBvaW50QXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcblx0ZW5kc1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKTtcblx0aW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcblx0bm9ybWFsaXplID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xuXHRyZXBlYXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnJlcGVhdCk7XG5cdHN0YXJ0c1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xufSBlbHNlIHtcblx0LyoqXG5cdCAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxuXHQgKiBVc2VkIGJ5IHN0YXJ0c1dpdGgsIGluY2x1ZGVzLCBhbmQgZW5kc1dpdGguXG5cdCAqXG5cdCAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cblx0ICovXG5cdGNvbnN0IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MgPSBmdW5jdGlvbihcblx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0dGV4dDogc3RyaW5nLFxuXHRcdHNlYXJjaDogc3RyaW5nLFxuXHRcdHBvc2l0aW9uOiBudW1iZXIsXG5cdFx0aXNFbmQ6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBbc3RyaW5nLCBzdHJpbmcsIG51bWJlcl0ge1xuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy4nICsgbmFtZSArICcgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcgdG8gc2VhcmNoIGFnYWluc3QuJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xuXHRcdHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XG5cdH07XG5cblx0ZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50czogbnVtYmVyW10pOiBzdHJpbmcge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcuZnJvbUNvZGVQb2ludFxuXHRcdGNvbnN0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0aWYgKCFsZW5ndGgpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRjb25zdCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXHRcdGNvbnN0IE1BWF9TSVpFID0gMHg0MDAwO1xuXHRcdGxldCBjb2RlVW5pdHM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IGluZGV4ID0gLTE7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXG5cdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdGxldCBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG5cblx0XHRcdC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2Vcblx0XHRcdGxldCBpc1ZhbGlkID1cblx0XHRcdFx0aXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XG5cdFx0XHRpZiAoIWlzVmFsaWQpIHtcblx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcblx0XHRcdFx0Ly8gQk1QIGNvZGUgcG9pbnRcblx0XHRcdFx0Y29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0bGV0IGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIEhJR0hfU1VSUk9HQVRFX01JTjtcblx0XHRcdFx0bGV0IGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgTE9XX1NVUlJPR0FURV9NSU47XG5cdFx0XHRcdGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcblx0XHRcdFx0cmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuXHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRyYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSk6IHN0cmluZyB7XG5cdFx0bGV0IHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGxldCBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XG5cblx0XHRpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGggLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dDogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuY29kZVBvaW50QXQgcmVxdXJpZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXHRcdGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xuXHRcdFx0cG9zaXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxuXHRcdGNvbnN0IGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcblx0XHRpZiAoZmlyc3QgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IEhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcblx0XHRcdC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcblx0XHRcdC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuXHRcdFx0Y29uc3Qgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG5cdFx0XHRpZiAoc2Vjb25kID49IExPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBMT1dfU1VSUk9HQVRFX01BWCkge1xuXHRcdFx0XHRyZXR1cm4gKGZpcnN0IC0gSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gTE9XX1NVUlJPR0FURV9NSU4gKyAweDEwMDAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlyc3Q7XG5cdH07XG5cblx0ZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCBlbmRQb3NpdGlvbj86IG51bWJlcik6IGJvb2xlYW4ge1xuXHRcdGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xuXHRcdH1cblxuXHRcdFt0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSk7XG5cblx0XHRjb25zdCBzdGFydCA9IGVuZFBvc2l0aW9uIC0gc2VhcmNoLmxlbmd0aDtcblx0XHRpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xuXHR9O1xuXG5cdGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuXHRcdHJldHVybiB0ZXh0LmluZGV4T2Yoc2VhcmNoLCBwb3NpdGlvbikgIT09IC0xO1xuXHR9O1xuXG5cdHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0OiBzdHJpbmcsIGNvdW50OiBudW1iZXIgPSAwKTogc3RyaW5nIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5yZXBlYXRcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblx0XHRpZiAoY291bnQgIT09IGNvdW50KSB7XG5cdFx0XHRjb3VudCA9IDA7XG5cdFx0fVxuXHRcdGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdHdoaWxlIChjb3VudCkge1xuXHRcdFx0aWYgKGNvdW50ICUgMikge1xuXHRcdFx0XHRyZXN1bHQgKz0gdGV4dDtcblx0XHRcdH1cblx0XHRcdGlmIChjb3VudCA+IDEpIHtcblx0XHRcdFx0dGV4dCArPSB0ZXh0O1xuXHRcdFx0fVxuXHRcdFx0Y291bnQgPj49IDE7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0c3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRzZWFyY2ggPSBTdHJpbmcoc2VhcmNoKTtcblx0XHRbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XG5cblx0XHRjb25zdCBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XG5cdFx0aWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcblx0fTtcbn1cblxuaWYgKGhhcygnZXMyMDE3LXN0cmluZycpKSB7XG5cdHBhZEVuZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcblx0cGFkU3RhcnQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZFN0YXJ0KTtcbn0gZWxzZSB7XG5cdHBhZEVuZCA9IGZ1bmN0aW9uIHBhZEVuZCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRFbmQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuXHRcdFx0bWF4TGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcblx0XHRjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocGFkZGluZyA+IDApIHtcblx0XHRcdHN0clRleHQgKz1cblx0XHRcdFx0cmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xuXHRcdFx0XHRmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0clRleHQ7XG5cdH07XG5cblx0cGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nOiBzdHJpbmcgPSAnICcpOiBzdHJpbmcge1xuXHRcdGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XG5cdFx0XHRtYXhMZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGxldCBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xuXHRcdGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwYWRkaW5nID4gMCkge1xuXHRcdFx0c3RyVGV4dCA9XG5cdFx0XHRcdHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcblx0XHRcdFx0ZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcblx0XHRcdFx0c3RyVGV4dDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyVGV4dDtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzdHJpbmcudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcbmltcG9ydCB7IEhhbmRsZSB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5mdW5jdGlvbiBleGVjdXRlVGFzayhpdGVtOiBRdWV1ZUl0ZW0gfCB1bmRlZmluZWQpOiB2b2lkIHtcblx0aWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XG5cdFx0aXRlbS5jYWxsYmFjaygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW06IFF1ZXVlSXRlbSwgZGVzdHJ1Y3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIHtcblx0XHRkZXN0cm95OiBmdW5jdGlvbih0aGlzOiBIYW5kbGUpIHtcblx0XHRcdHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge307XG5cdFx0XHRpdGVtLmlzQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRpdGVtLmNhbGxiYWNrID0gbnVsbDtcblxuXHRcdFx0aWYgKGRlc3RydWN0b3IpIHtcblx0XHRcdFx0ZGVzdHJ1Y3RvcigpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuaW50ZXJmYWNlIFBvc3RNZXNzYWdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHNvdXJjZTogYW55O1xuXHRkYXRhOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJdGVtIHtcblx0aXNBY3RpdmU6IGJvb2xlYW47XG5cdGNhbGxiYWNrOiBudWxsIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbn1cblxubGV0IGNoZWNrTWljcm9UYXNrUXVldWU6ICgpID0+IHZvaWQ7XG5sZXQgbWljcm9UYXNrczogUXVldWVJdGVtW107XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVUYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRsZXQgZGVzdHJ1Y3RvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdC8vIFNpbmNlIHRoZSBJRSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0SW1tZWRpYXRlYCBpcyBub3QgZmxhd2xlc3MsIHdlIHdpbGwgdGVzdCBmb3IgYHBvc3RNZXNzYWdlYCBmaXJzdC5cblx0aWYgKGhhcygncG9zdG1lc3NhZ2UnKSkge1xuXHRcdGNvbnN0IHF1ZXVlOiBRdWV1ZUl0ZW1bXSA9IFtdO1xuXG5cdFx0Z2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudDogUG9zdE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuXHRcdFx0Ly8gQ29uZmlybSB0aGF0IHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgYnkgdGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uLlxuXHRcdFx0aWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09ICdkb2pvLXF1ZXVlLW1lc3NhZ2UnKSB7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdGlmIChxdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRleGVjdXRlVGFzayhxdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdGdsb2JhbC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnc2V0aW1tZWRpYXRlJykpIHtcblx0XHRkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJUaW1lb3V0O1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiBhbnkge1xuXHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSwgMCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCBpZDogYW55ID0gZW5xdWV1ZShpdGVtKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShcblx0XHRcdGl0ZW0sXG5cdFx0XHRkZXN0cnVjdG9yICYmXG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRlc3RydWN0b3IoaWQpO1xuXHRcdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuXHRyZXR1cm4gaGFzKCdtaWNyb3Rhc2tzJylcblx0XHQ/IHF1ZXVlVGFza1xuXHRcdDogZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gcXVldWVUYXNrKGNhbGxiYWNrKTtcblx0XHRcdH07XG59KSgpO1xuXG4vLyBXaGVuIG5vIG1lY2hhbmlzbSBmb3IgcmVnaXN0ZXJpbmcgbWljcm90YXNrcyBpcyBleHBvc2VkIGJ5IHRoZSBlbnZpcm9ubWVudCwgbWljcm90YXNrcyB3aWxsXG4vLyBiZSBxdWV1ZWQgYW5kIHRoZW4gZXhlY3V0ZWQgaW4gYSBzaW5nbGUgbWFjcm90YXNrIGJlZm9yZSB0aGUgb3RoZXIgbWFjcm90YXNrcyBhcmUgZXhlY3V0ZWQuXG5pZiAoIWhhcygnbWljcm90YXNrcycpKSB7XG5cdGxldCBpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xuXG5cdG1pY3JvVGFza3MgPSBbXTtcblx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdGlmICghaXNNaWNyb1Rhc2tRdWV1ZWQpIHtcblx0XHRcdGlzTWljcm9UYXNrUXVldWVkID0gdHJ1ZTtcblx0XHRcdHF1ZXVlVGFzayhmdW5jdGlvbigpIHtcblx0XHRcdFx0aXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRsZXQgaXRlbTogUXVldWVJdGVtIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHdoaWxlICgoaXRlbSA9IG1pY3JvVGFza3Muc2hpZnQoKSkpIHtcblx0XHRcdFx0XHRcdGV4ZWN1dGVUYXNrKGl0ZW0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyBhbiBhbmltYXRpb24gdGFzayB3aXRoIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBpdCBleGlzdHMsIG9yIHdpdGggYHF1ZXVlVGFza2Agb3RoZXJ3aXNlLlxuICpcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXG4gKiBIb3dldmVyLCBhdCB0aW1lcyBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIGRlbGVnYXRlIHRvIHJlcXVlc3RBbmltYXRpb25GcmFtZTsgaGVuY2UgdGhlIGZvbGxvd2luZyBtZXRob2QuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXVlQW5pbWF0aW9uVGFzayA9IChmdW5jdGlvbigpIHtcblx0aWYgKCFoYXMoJ3JhZicpKSB7XG5cdFx0cmV0dXJuIHF1ZXVlVGFzaztcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblx0XHRjb25zdCByYWZJZDogbnVtYmVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG5cdHJldHVybiBoYXMoJ21pY3JvdGFza3MnKVxuXHRcdD8gcXVldWVBbmltYXRpb25UYXNrXG5cdFx0OiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRcdHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xuXHRcdFx0fTtcbn0pKCk7XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXG4gKiBtZWNoYW5pc20gZm9yIHNjaGVkdWxpbmcgbWFjcm90YXNrcyBpcyBleHBvc2VkLCB0aGVuIGFueSBjYWxsYmFja3Mgd2lsbCBiZSBmaXJlZCBiZWZvcmUgYW55IG1hY3JvdGFza1xuICogcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZVRhc2tgIG9yIGBxdWV1ZUFuaW1hdGlvblRhc2tgLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBsZXQgcXVldWVNaWNyb1Rhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGxldCBlbnF1ZXVlOiAoaXRlbTogUXVldWVJdGVtKSA9PiB2b2lkO1xuXG5cdGlmIChoYXMoJ2hvc3Qtbm9kZScpKSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Z2xvYmFsLnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ2VzNi1wcm9taXNlJykpIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRnbG9iYWwuUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZXhlY3V0ZVRhc2spO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdkb20tbXV0YXRpb25vYnNlcnZlcicpKSB7XG5cdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXHRcdGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjb25zdCBxdWV1ZTogUXVldWVJdGVtW10gPSBbXTtcblx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcblx0XHRcdFx0XHRpdGVtLmNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0cXVldWUucHVzaChpdGVtKTtcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRtaWNyb1Rhc2tzLnB1c2goaXRlbSk7XG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdGNvbnN0IGl0ZW06IFF1ZXVlSXRlbSA9IHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fTtcblxuXHRcdGVucXVldWUoaXRlbSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSk7XG5cdH07XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHF1ZXVlLnRzIiwiLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSB2YWx1ZSBwcm9wZXJ0eSBkZXNjcmlwdG9yXG4gKlxuICogQHBhcmFtIHZhbHVlICAgICAgICBUaGUgdmFsdWUgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIHNldCB0b1xuICogQHBhcmFtIGVudW1lcmFibGUgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGVudW1iZXJhYmxlLCBkZWZhdWx0cyB0byBmYWxzZVxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcGFyYW0gY29uZmlndXJhYmxlIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgY29uZmlndXJhYmxlLCBkZWZhdWx0cyB0byB0cnVlXG4gKiBAcmV0dXJuICAgICAgICAgICAgIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVEZXNjcmlwdG9yPFQ+KFxuXHR2YWx1ZTogVCxcblx0ZW51bWVyYWJsZTogYm9vbGVhbiA9IGZhbHNlLFxuXHR3cml0YWJsZTogYm9vbGVhbiA9IHRydWUsXG5cdGNvbmZpZ3VyYWJsZTogYm9vbGVhbiA9IHRydWVcbik6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPFQ+IHtcblx0cmV0dXJuIHtcblx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0ZW51bWVyYWJsZTogZW51bWVyYWJsZSxcblx0XHR3cml0YWJsZTogd3JpdGFibGUsXG5cdFx0Y29uZmlndXJhYmxlOiBjb25maWd1cmFibGVcblx0fTtcbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB3aGljaCB3cmFwcyBhIGZ1bmN0aW9uIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCBiZWNvbWVzIHRoZSBzY29wZVxuICogb2YgdGhlIGNhbGxcbiAqXG4gKiBAcGFyYW0gbmF0aXZlRnVuY3Rpb24gVGhlIHNvdXJjZSBmdW5jdGlvbiB0byBiZSB3cmFwcGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFI+KG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSkgPT4gUik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBSPihuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYpID0+IFIpOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFgsIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBYLCBZLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXLCBhcmc0OiBZKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmUobmF0aXZlRnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdXRpbC50cyIsImltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdG9yRXZlbnRNYXAge1xuXHRpbnZhbGlkYXRlOiBFdmVudE9iamVjdDwnaW52YWxpZGF0ZSc+O1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0b3I8VCA9IGFueT4gZXh0ZW5kcyBFdmVudGVkPEluamVjdG9yRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcGF5bG9hZDogVDtcblxuXHRjb25zdHJ1Y3RvcihwYXlsb2FkOiBUKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0fVxuXG5cdHB1YmxpYyBnZXQoKTogVCB7XG5cdFx0cmV0dXJuIHRoaXMuX3BheWxvYWQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0KHBheWxvYWQ6IFQpOiB2b2lkIHtcblx0XHR0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0b3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gSW5qZWN0b3IudHMiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgTm9kZUhhbmRsZXJJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXG4gKiBMaXN0ZW5pbmcgdG8gJ1Byb2plY3Rvcicgd2lsbCBub3RpZnkgd2hlbiBwcm9qZWN0b3IgaXMgY3JlYXRlZCBvciB1cGRhdGVkXG4gKiBMaXN0ZW5pbmcgdG8gJ1dpZGdldCcgd2lsbCBub3RpZnkgd2hlbiB3aWRnZXQgcm9vdCBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcbiAqL1xuZXhwb3J0IGVudW0gTm9kZUV2ZW50VHlwZSB7XG5cdFByb2plY3RvciA9ICdQcm9qZWN0b3InLFxuXHRXaWRnZXQgPSAnV2lkZ2V0J1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVIYW5kbGVyRXZlbnRNYXAge1xuXHRQcm9qZWN0b3I6IEV2ZW50T2JqZWN0PE5vZGVFdmVudFR5cGUuUHJvamVjdG9yPjtcblx0V2lkZ2V0OiBFdmVudE9iamVjdDxOb2RlRXZlbnRUeXBlLldpZGdldD47XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlSGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8Tm9kZUhhbmRsZXJFdmVudE1hcD4gaW1wbGVtZW50cyBOb2RlSGFuZGxlckludGVyZmFjZSB7XG5cdHByaXZhdGUgX25vZGVNYXAgPSBuZXcgTWFwPHN0cmluZywgRWxlbWVudD4oKTtcblxuXHRwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogRWxlbWVudCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkKGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5zZXQoa2V5LCBlbGVtZW50KTtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBrZXkgfSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkUm9vdCgpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRQcm9qZWN0b3IoKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XG5cdH1cblxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG5cdFx0dGhpcy5fbm9kZU1hcC5jbGVhcigpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVIYW5kbGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIE5vZGVIYW5kbGVyLnRzIiwiaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBSZWdpc3RyeUxhYmVsLCBXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdpZGdldEJhc2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuL0luamVjdG9yJztcblxuZXhwb3J0IHR5cGUgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj47XG5cbmV4cG9ydCB0eXBlIEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb24gPSAoKSA9PiBQcm9taXNlPEVTTURlZmF1bHRXaWRnZXRCYXNlPFdpZGdldEJhc2VJbnRlcmZhY2U+PjtcblxuZXhwb3J0IHR5cGUgUmVnaXN0cnlJdGVtID1cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3Jcblx0fCBQcm9taXNlPFdpZGdldEJhc2VDb25zdHJ1Y3Rvcj5cblx0fCBXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvblxuXHR8IEVTTURlZmF1bHRXaWRnZXRCYXNlRnVuY3Rpb247XG5cbi8qKlxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdJREdFVF9CQVNFX1RZUEUgPSBTeW1ib2woJ1dpZGdldCBCYXNlJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlFdmVudE9iamVjdCBleHRlbmRzIEV2ZW50T2JqZWN0PFJlZ2lzdHJ5TGFiZWw+IHtcblx0YWN0aW9uOiBzdHJpbmc7XG5cdGl0ZW06IFdpZGdldEJhc2VDb25zdHJ1Y3RvciB8IEluamVjdG9yO1xufVxuXG4vKipcbiAqIFdpZGdldCBSZWdpc3RyeSBJbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBEZWZpbmUgYSBXaWRnZXRSZWdpc3RyeUl0ZW0gYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHdpZGdldCB0byByZWdpc3RlclxuXHQgKiBAcGFyYW0gcmVnaXN0cnlJdGVtIFRoZSByZWdpc3RyeSBpdGVtIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCByZWdpc3RyeUl0ZW06IFJlZ2lzdHJ5SXRlbSk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCBvZiB0aGUgd2lkZ2V0IHRvIHJldHVyblxuXHQgKiBAcmV0dXJucyBUaGUgUmVnaXN0cnlJdGVtIGZvciB0aGUgd2lkZ2V0TGFiZWwsIGBudWxsYCBpZiBubyBlbnRyeSBleGlzdHNcblx0ICovXG5cdGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogQ29uc3RydWN0b3I8VD4gfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBlbnRyeSBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgd2lkZ2V0IHJlZ2lzdHJ5IGl0ZW0gZXhpc3RzXG5cdCAqL1xuXHRoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmUgYW4gSW5qZWN0b3IgYWdhaW5zdCBhIGxhYmVsXG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIGluamVjdG9yIHRvIHJlZ2lzdGVyXG5cdCAqIEBwYXJhbSByZWdpc3RyeUl0ZW0gVGhlIGluamVjdG9yIHRvIGRlZmluZVxuXHQgKi9cblx0ZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHJlZ2lzdHJ5SXRlbTogSW5qZWN0b3IpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYW4gSW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBmb3IgdGhlIGdpdmVuIGxhYmVsLCBudWxsIGlmIGFuIGVudHJ5IGRvZXNuJ3QgZXhpc3Rcblx0ICpcblx0ICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgaW5qZWN0b3IgdG8gcmV0dXJuXG5cdCAqIEByZXR1cm5zIFRoZSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSB3aWRnZXRMYWJlbCwgYG51bGxgIGlmIG5vIGVudHJ5IGV4aXN0c1xuXHQgKi9cblx0Z2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IFQgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgYm9vbGVhbiBpZiBhbiBpbmplY3RvciBmb3IgdGhlIGxhYmVsIGV4aXN0c1xuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIHRvIHNlYXJjaCBmb3Jcblx0ICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgaW5qZWN0b3IgcmVnaXN0cnkgaXRlbSBleGlzdHNcblx0ICovXG5cdGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXG4gKlxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2U+KGl0ZW06IGFueSk6IGl0ZW0gaXMgQ29uc3RydWN0b3I8VD4ge1xuXHRyZXR1cm4gQm9vbGVhbihpdGVtICYmIGl0ZW0uX3R5cGUgPT09IFdJREdFVF9CQVNFX1RZUEUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0ZGVmYXVsdDogQ29uc3RydWN0b3I8VD47XG5cdF9fZXNNb2R1bGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDxUPihpdGVtOiBhbnkpOiBpdGVtIGlzIEVTTURlZmF1bHRXaWRnZXRCYXNlPFQ+IHtcblx0cmV0dXJuIEJvb2xlYW4oXG5cdFx0aXRlbSAmJlxuXHRcdFx0aXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXG5cdFx0XHRpdGVtLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykgJiZcblx0XHRcdGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdClcblx0KTtcbn1cblxuLyoqXG4gKiBUaGUgUmVnaXN0cnkgaW1wbGVtZW50YXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IGV4dGVuZHMgRXZlbnRlZDx7fSwgUmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlFdmVudE9iamVjdD4gaW1wbGVtZW50cyBSZWdpc3RyeUludGVyZmFjZSB7XG5cdC8qKlxuXHQgKiBpbnRlcm5hbCBtYXAgb2YgbGFiZWxzIGFuZCBSZWdpc3RyeUl0ZW1cblx0ICovXG5cdHByaXZhdGUgX3dpZGdldFJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgUmVnaXN0cnlJdGVtPjtcblxuXHRwcml2YXRlIF9pbmplY3RvclJlZ2lzdHJ5OiBNYXA8UmVnaXN0cnlMYWJlbCwgSW5qZWN0b3I+O1xuXG5cdC8qKlxuXHQgKiBFbWl0IGxvYWRlZCBldmVudCBmb3IgcmVnaXN0cnkgbGFiZWxcblx0ICovXG5cdHByaXZhdGUgZW1pdExvYWRlZEV2ZW50KHdpZGdldExhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBXaWRnZXRCYXNlQ29uc3RydWN0b3IgfCBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7XG5cdFx0XHR0eXBlOiB3aWRnZXRMYWJlbCxcblx0XHRcdGFjdGlvbjogJ2xvYWRlZCcsXG5cdFx0XHRpdGVtXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgd2lkZ2V0IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJyR7bGFiZWwudG9TdHJpbmcoKX0nYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblxuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0aXRlbS50aGVuKFxuXHRcdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRcdHJldHVybiB3aWRnZXRDdG9yO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XG5cdFx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpdGVtOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbmplY3RvciBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuXHRcdH1cblxuXHRcdHRoaXMuX2luamVjdG9yUmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcblx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gV2lkZ2V0QmFzZUludGVyZmFjZT4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdGlmICghdGhpcy5oYXMobGFiZWwpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBpdGVtID0gdGhpcy5fd2lkZ2V0UmVnaXN0cnkuZ2V0KGxhYmVsKTtcblxuXHRcdGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxUPihpdGVtKSkge1xuXHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0fVxuXG5cdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9taXNlID0gKDxXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvbj5pdGVtKSgpO1xuXHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgcHJvbWlzZSk7XG5cblx0XHRwcm9taXNlLnRoZW4oXG5cdFx0XHQod2lkZ2V0Q3RvcikgPT4ge1xuXHRcdFx0XHRpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQ8VD4od2lkZ2V0Q3RvcikpIHtcblx0XHRcdFx0XHR3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRyZXR1cm4gd2lkZ2V0Q3Rvcjtcblx0XHRcdH0sXG5cdFx0XHQoZXJyb3IpID0+IHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKSBhcyBUO1xuXHR9XG5cblx0cHVibGljIGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX3dpZGdldFJlZ2lzdHJ5ICYmIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFJlZ2lzdHJ5LnRzIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgUmVnaXN0cnlMYWJlbCwgV2lkZ2V0QmFzZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZWdpc3RyeSwgUmVnaXN0cnlFdmVudE9iamVjdCwgUmVnaXN0cnlJdGVtIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vSW5qZWN0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5SGFuZGxlckV2ZW50TWFwIHtcblx0aW52YWxpZGF0ZTogRXZlbnRPYmplY3Q8J2ludmFsaWRhdGUnPjtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5SGFuZGxlciBleHRlbmRzIEV2ZW50ZWQ8UmVnaXN0cnlIYW5kbGVyRXZlbnRNYXA+IHtcblx0cHJpdmF0ZSBfcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcblx0cHJpdmF0ZSBfcmVnaXN0cnlXaWRnZXRMYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+ID0gbmV3IE1hcCgpO1xuXHRwcml2YXRlIF9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPiA9IG5ldyBNYXAoKTtcblx0cHJvdGVjdGVkIGJhc2VSZWdpc3RyeT86IFJlZ2lzdHJ5O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xuXHRcdGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdFx0dGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLm93bih7IGRlc3Ryb3kgfSk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJhc2UoYmFzZVJlZ2lzdHJ5OiBSZWdpc3RyeSkge1xuXHRcdGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0dGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0fVxuXHRcdHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xuXHR9XG5cblx0cHVibGljIGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgd2lkZ2V0OiBSZWdpc3RyeUl0ZW0pOiB2b2lkIHtcblx0XHR0aGlzLl9yZWdpc3RyeS5kZWZpbmUobGFiZWwsIHdpZGdldCk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGluamVjdG9yOiBJbmplY3Rvcik6IHZvaWQge1xuXHRcdHRoaXMuX3JlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGxhYmVsLCBpbmplY3Rvcik7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmhhcyhsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHRcdGxhYmVsOiBSZWdpc3RyeUxhYmVsLFxuXHRcdGdsb2JhbFByZWNlZGVuY2U6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXQnLCB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2UpOiBUIHwgbnVsbCB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcblx0fVxuXG5cdHByaXZhdGUgX2dldChcblx0XHRsYWJlbDogUmVnaXN0cnlMYWJlbCxcblx0XHRnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuLFxuXHRcdGdldEZ1bmN0aW9uTmFtZTogJ2dldEluamVjdG9yJyB8ICdnZXQnLFxuXHRcdGxhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT5cblx0KTogYW55IHtcblx0XHRjb25zdCByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCByZWdpc3RyeTogYW55ID0gcmVnaXN0cmllc1tpXTtcblx0XHRcdGlmICghcmVnaXN0cnkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XG5cdFx0XHRjb25zdCByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcblx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fSBlbHNlIGlmIChyZWdpc3RlcmVkTGFiZWxzLmluZGV4T2YobGFiZWwpID09PSAtMSkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGUgPSByZWdpc3RyeS5vbihsYWJlbCwgKGV2ZW50OiBSZWdpc3RyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0ZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxuXHRcdFx0XHRcdFx0KHRoaXMgYXMgYW55KVtnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMub3duKGhhbmRsZSk7XG5cdFx0XHRcdGxhYmVsTWFwLnNldChyZWdpc3RyeSwgWy4uLnJlZ2lzdGVyZWRMYWJlbHMsIGxhYmVsXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5SGFuZGxlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBSZWdpc3RyeUhhbmRsZXIudHMiLCJpbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGF1dG8gfSBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IHtcblx0QWZ0ZXJSZW5kZXIsXG5cdEJlZm9yZVByb3BlcnRpZXMsXG5cdEJlZm9yZVJlbmRlcixcblx0Q29yZVByb3BlcnRpZXMsXG5cdERpZmZQcm9wZXJ0eVJlYWN0aW9uLFxuXHRETm9kZSxcblx0UmVuZGVyLFxuXHRXaWRnZXRNZXRhQmFzZSxcblx0V2lkZ2V0TWV0YUNvbnN0cnVjdG9yLFxuXHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRXaWRnZXRQcm9wZXJ0aWVzXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgUmVnaXN0cnlIYW5kbGVyIGZyb20gJy4vUmVnaXN0cnlIYW5kbGVyJztcbmltcG9ydCBOb2RlSGFuZGxlciBmcm9tICcuL05vZGVIYW5kbGVyJztcbmltcG9ydCB7IHdpZGdldEluc3RhbmNlTWFwIH0gZnJvbSAnLi92ZG9tJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yLCBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5cbmludGVyZmFjZSBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzIHtcblx0cHJldmlvdXNQcm9wZXJ0aWVzOiBhbnk7XG5cdG5ld1Byb3BlcnRpZXM6IGFueTtcblx0Y2hhbmdlZDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlYWN0aW9uRnVuY3Rpb25Db25maWcge1xuXHRwcm9wZXJ0eU5hbWU6IHN0cmluZztcblx0cmVhY3Rpb246IERpZmZQcm9wZXJ0eVJlYWN0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBCb3VuZEZ1bmN0aW9uRGF0YSA9IHsgYm91bmRGdW5jOiAoLi4uYXJnczogYW55W10pID0+IGFueTsgc2NvcGU6IGFueSB9O1xuXG5jb25zdCBkZWNvcmF0b3JNYXAgPSBuZXcgTWFwPEZ1bmN0aW9uLCBNYXA8c3RyaW5nLCBhbnlbXT4+KCk7XG5jb25zdCBib3VuZEF1dG8gPSBhdXRvLmJpbmQobnVsbCk7XG5cbi8qKlxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXG4gKi9cbmV4cG9ydCBjbGFzcyBXaWRnZXRCYXNlPFAgPSBXaWRnZXRQcm9wZXJ0aWVzLCBDIGV4dGVuZHMgRE5vZGUgPSBETm9kZT4gaW1wbGVtZW50cyBXaWRnZXRCYXNlSW50ZXJmYWNlPFAsIEM+IHtcblx0LyoqXG5cdCAqIHN0YXRpYyBpZGVudGlmaWVyXG5cdCAqL1xuXHRzdGF0aWMgX3R5cGU6IHN5bWJvbCA9IFdJREdFVF9CQVNFX1RZUEU7XG5cblx0LyoqXG5cdCAqIGNoaWxkcmVuIGFycmF5XG5cdCAqL1xuXHRwcml2YXRlIF9jaGlsZHJlbjogKEMgfCBudWxsKVtdO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgaWYgaXQgaXMgdGhlIGluaXRpYWwgc2V0IHByb3BlcnRpZXMgY3ljbGVcblx0ICovXG5cdHByaXZhdGUgX2luaXRpYWxQcm9wZXJ0aWVzID0gdHJ1ZTtcblxuXHQvKipcblx0ICogaW50ZXJuYWwgd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX3Byb3BlcnRpZXM6IFAgJiBXaWRnZXRQcm9wZXJ0aWVzICYgeyBbaW5kZXg6IHN0cmluZ106IGFueSB9O1xuXG5cdC8qKlxuXHQgKiBBcnJheSBvZiBwcm9wZXJ0eSBrZXlzIGNvbnNpZGVyZWQgY2hhbmdlZCBmcm9tIHRoZSBwcmV2aW91cyBzZXQgcHJvcGVydGllc1xuXHQgKi9cblx0cHJpdmF0ZSBfY2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW10gPSBbXTtcblxuXHQvKipcblx0ICogbWFwIG9mIGRlY29yYXRvcnMgdGhhdCBhcmUgYXBwbGllZCB0byB0aGlzIHdpZGdldFxuXHQgKi9cblx0cHJpdmF0ZSBfZGVjb3JhdG9yQ2FjaGU6IE1hcDxzdHJpbmcsIGFueVtdPjtcblxuXHRwcml2YXRlIF9yZWdpc3RyeTogUmVnaXN0cnlIYW5kbGVyO1xuXG5cdC8qKlxuXHQgKiBNYXAgb2YgZnVuY3Rpb25zIHByb3BlcnRpZXMgZm9yIHRoZSBib3VuZCBmdW5jdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBfYmluZEZ1bmN0aW9uUHJvcGVydHlNYXA6IFdlYWtNYXA8KC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIEJvdW5kRnVuY3Rpb25EYXRhPjtcblxuXHRwcml2YXRlIF9tZXRhTWFwOiBNYXA8V2lkZ2V0TWV0YUNvbnN0cnVjdG9yPGFueT4sIFdpZGdldE1ldGFCYXNlPjtcblxuXHRwcml2YXRlIF9ib3VuZFJlbmRlckZ1bmM6IFJlbmRlcjtcblxuXHRwcml2YXRlIF9ib3VuZEludmFsaWRhdGU6ICgpID0+IHZvaWQ7XG5cblx0cHJpdmF0ZSBfbm9kZUhhbmRsZXI6IE5vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyKCk7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fY2hpbGRyZW4gPSBbXTtcblx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gPFA+e307XG5cdFx0dGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcblxuXHRcdHdpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XG5cdFx0XHRkaXJ0eTogdHJ1ZSxcblx0XHRcdG9uQXR0YWNoOiAoKTogdm9pZCA9PiB7XG5cdFx0XHRcdHRoaXMub25BdHRhY2goKTtcblx0XHRcdH0sXG5cdFx0XHRvbkRldGFjaDogKCk6IHZvaWQgPT4ge1xuXHRcdFx0XHR0aGlzLm9uRGV0YWNoKCk7XG5cdFx0XHRcdHRoaXMuX2Rlc3Ryb3koKTtcblx0XHRcdH0sXG5cdFx0XHRub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG5cdFx0XHRyZWdpc3RyeTogKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZWdpc3RyeTtcblx0XHRcdH0sXG5cdFx0XHRjb3JlUHJvcGVydGllczoge30gYXMgQ29yZVByb3BlcnRpZXMsXG5cdFx0XHRyZW5kZXJpbmc6IGZhbHNlLFxuXHRcdFx0aW5wdXRQcm9wZXJ0aWVzOiB7fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBtZXRhPFQgZXh0ZW5kcyBXaWRnZXRNZXRhQmFzZT4oTWV0YVR5cGU6IFdpZGdldE1ldGFDb25zdHJ1Y3RvcjxUPik6IFQge1xuXHRcdGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAgPSBuZXcgTWFwPFdpZGdldE1ldGFDb25zdHJ1Y3Rvcjxhbnk+LCBXaWRnZXRNZXRhQmFzZT4oKTtcblx0XHR9XG5cdFx0bGV0IGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcblx0XHRpZiAoIWNhY2hlZCkge1xuXHRcdFx0Y2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcblx0XHRcdFx0aW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxuXHRcdFx0XHRub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG5cdFx0XHRcdGJpbmQ6IHRoaXNcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlZCBhcyBUO1xuXHR9XG5cblx0cHJvdGVjdGVkIG9uQXR0YWNoKCk6IHZvaWQge1xuXHRcdC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cblx0fVxuXG5cdHByb3RlY3RlZCBvbkRldGFjaCgpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHRwdWJsaWMgZ2V0IHByb3BlcnRpZXMoKTogUmVhZG9ubHk8UD4gJiBSZWFkb25seTxXaWRnZXRQcm9wZXJ0aWVzPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNoYW5nZWRQcm9wZXJ0eUtleXMoKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBbLi4udGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5c107XG5cdH1cblxuXHRwdWJsaWMgX19zZXRDb3JlUHJvcGVydGllc19fKGNvcmVQcm9wZXJ0aWVzOiBDb3JlUHJvcGVydGllcyk6IHZvaWQge1xuXHRcdGNvbnN0IHsgYmFzZVJlZ2lzdHJ5IH0gPSBjb3JlUHJvcGVydGllcztcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXG5cdFx0aWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xuXHRcdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LmJhc2UgPSBiYXNlUmVnaXN0cnk7XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgX19zZXRQcm9wZXJ0aWVzX18ob3JpZ2luYWxQcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMgPSBvcmlnaW5hbFByb3BlcnRpZXM7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcblx0XHRjb25zdCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xuXHRcdGNvbnN0IGNoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdID0gW107XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXG5cdFx0aWYgKHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID09PSBmYWxzZSB8fCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRjb25zdCBhbGxQcm9wZXJ0aWVzID0gWy4uLnByb3BlcnR5TmFtZXMsIC4uLk9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpXTtcblx0XHRcdGNvbnN0IGNoZWNrZWRQcm9wZXJ0aWVzOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gW107XG5cdFx0XHRjb25zdCBkaWZmUHJvcGVydHlSZXN1bHRzOiBhbnkgPSB7fTtcblx0XHRcdGxldCBydW5SZWFjdGlvbnMgPSBmYWxzZTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IGFsbFByb3BlcnRpZXNbaV07XG5cdFx0XHRcdGlmIChjaGVja2VkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hlY2tlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRjb25zdCBwcmV2aW91c1Byb3BlcnR5ID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0XHRjb25zdCBuZXdQcm9wZXJ0eSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KFxuXHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSxcblx0XHRcdFx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRydW5SZWFjdGlvbnMgPSB0cnVlO1xuXHRcdFx0XHRcdGNvbnN0IGRpZmZGdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWApO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZkZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gZGlmZkZ1bmN0aW9uc1tpXShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRcdGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYm91bmRBdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHRcdFx0XHRpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0XHRkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChydW5SZWFjdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKHByb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpLmZvckVhY2goKGFyZ3MsIHJlYWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFyZ3MuY2hhbmdlZCkge1xuXHRcdFx0XHRcdFx0cmVhY3Rpb24uY2FsbCh0aGlzLCBhcmdzLnByZXZpb3VzUHJvcGVydGllcywgYXJncy5uZXdQcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XG5cdFx0XHR0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSBmYWxzZTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydHlOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xuXHRcdFx0XHRpZiAodHlwZW9mIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KFxuXHRcdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLFxuXHRcdFx0XHRcdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcblx0XHRcdHRoaXMuX3Byb3BlcnRpZXMgPSB7IC4uLnByb3BlcnRpZXMgfTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cy5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNoaWxkcmVuKCk6IChDIHwgbnVsbClbXSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuXHR9XG5cblx0cHVibGljIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbjogKEMgfCBudWxsKVtdKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgfHwgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfX3JlbmRlcl9fKCk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcblx0XHRjb25zdCByZW5kZXIgPSB0aGlzLl9ydW5CZWZvcmVSZW5kZXJzKCk7XG5cdFx0bGV0IGROb2RlID0gcmVuZGVyKCk7XG5cdFx0ZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XG5cdFx0dGhpcy5fbm9kZUhhbmRsZXIuY2xlYXIoKTtcblx0XHRyZXR1cm4gZE5vZGU7XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZSgpOiB2b2lkIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGlmIChpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSkge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0cmV0dXJuIHYoJ2RpdicsIHt9LCB0aGlzLmNoaWxkcmVuKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxuXHQgKi9cblx0cHJvdGVjdGVkIGFkZERlY29yYXRvcihkZWNvcmF0b3JLZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuXHRcdHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG5cdFx0aWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcblx0XHRcdGxldCBkZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTWFwLmdldCh0aGlzLmNvbnN0cnVjdG9yKTtcblx0XHRcdGlmICghZGVjb3JhdG9yTGlzdCkge1xuXHRcdFx0XHRkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcDxzdHJpbmcsIGFueVtdPigpO1xuXHRcdFx0XHRkZWNvcmF0b3JNYXAuc2V0KHRoaXMuY29uc3RydWN0b3IsIGRlY29yYXRvckxpc3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcblx0XHRcdGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XG5cdFx0XHRcdHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IFtdO1xuXHRcdFx0XHRkZWNvcmF0b3JMaXN0LnNldChkZWNvcmF0b3JLZXksIHNwZWNpZmljRGVjb3JhdG9yTGlzdCk7XG5cdFx0XHR9XG5cdFx0XHRzcGVjaWZpY0RlY29yYXRvckxpc3QucHVzaCguLi52YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGRlY29yYXRvcnMgPSB0aGlzLmdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpO1xuXHRcdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgWy4uLmRlY29yYXRvcnMsIC4uLnZhbHVlXSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGJ1aWxkIHRoZSBsaXN0IG9mIGRlY29yYXRvcnMgZnJvbSB0aGUgZ2xvYmFsIGRlY29yYXRvciBtYXAuXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgIFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcmV0dXJuIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXk6IHN0cmluZyk6IGFueVtdIHtcblx0XHRjb25zdCBhbGxEZWNvcmF0b3JzID0gW107XG5cblx0XHRsZXQgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG5cdFx0d2hpbGUgKGNvbnN0cnVjdG9yKSB7XG5cdFx0XHRjb25zdCBpbnN0YW5jZU1hcCA9IGRlY29yYXRvck1hcC5nZXQoY29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKGluc3RhbmNlTWFwKSB7XG5cdFx0XHRcdGNvbnN0IGRlY29yYXRvcnMgPSBpbnN0YW5jZU1hcC5nZXQoZGVjb3JhdG9yS2V5KTtcblxuXHRcdFx0XHRpZiAoZGVjb3JhdG9ycykge1xuXHRcdFx0XHRcdGFsbERlY29yYXRvcnMudW5zaGlmdCguLi5kZWNvcmF0b3JzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdHJ1Y3RvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb25zdHJ1Y3Rvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveXMgcHJpdmF0ZSByZXNvdXJjZXMgZm9yIFdpZGdldEJhc2Vcblx0ICovXG5cdHByaXZhdGUgX2Rlc3Ryb3koKSB7XG5cdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5KSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5kZXN0cm95KCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAuZm9yRWFjaCgobWV0YSkgPT4ge1xuXHRcdFx0XHRtZXRhLmRlc3Ryb3koKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byByZXRyaWV2ZSBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqXG5cdCAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcblx0ICovXG5cdHByb3RlY3RlZCBnZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5OiBzdHJpbmcpOiBhbnlbXSB7XG5cdFx0bGV0IGFsbERlY29yYXRvcnMgPSB0aGlzLl9kZWNvcmF0b3JDYWNoZS5nZXQoZGVjb3JhdG9yS2V5KTtcblxuXHRcdGlmIChhbGxEZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHRcdH1cblxuXHRcdGFsbERlY29yYXRvcnMgPSB0aGlzLl9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5KTtcblxuXHRcdHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIGFsbERlY29yYXRvcnMpO1xuXHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHR9XG5cblx0cHJpdmF0ZSBfbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKFxuXHRcdG5ld1Byb3BlcnRpZXM6IGFueSxcblx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzOiBzdHJpbmdbXVxuXHQpOiBNYXA8RnVuY3Rpb24sIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHM+IHtcblx0XHRjb25zdCByZWFjdGlvbkZ1bmN0aW9uczogUmVhY3Rpb25GdW5jdGlvbkNvbmZpZ1tdID0gdGhpcy5nZXREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicpO1xuXG5cdFx0cmV0dXJuIHJlYWN0aW9uRnVuY3Rpb25zLnJlZHVjZSgocmVhY3Rpb25Qcm9wZXJ0eU1hcCwgeyByZWFjdGlvbiwgcHJvcGVydHlOYW1lIH0pID0+IHtcblx0XHRcdGxldCByZWFjdGlvbkFyZ3VtZW50cyA9IHJlYWN0aW9uUHJvcGVydHlNYXAuZ2V0KHJlYWN0aW9uKTtcblx0XHRcdGlmIChyZWFjdGlvbkFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJlYWN0aW9uQXJndW1lbnRzID0ge1xuXHRcdFx0XHRcdHByZXZpb3VzUHJvcGVydGllczoge30sXG5cdFx0XHRcdFx0bmV3UHJvcGVydGllczoge30sXG5cdFx0XHRcdFx0Y2hhbmdlZDogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLnByZXZpb3VzUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMubmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gbmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdFx0aWYgKGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5jaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJlYWN0aW9uUHJvcGVydHlNYXAuc2V0KHJlYWN0aW9uLCByZWFjdGlvbkFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gcmVhY3Rpb25Qcm9wZXJ0eU1hcDtcblx0XHR9LCBuZXcgTWFwPEZ1bmN0aW9uLCBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzPigpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvcGVydGllcyBwcm9wZXJ0aWVzIHRvIGNoZWNrIGZvciBmdW5jdGlvbnNcblx0ICovXG5cdHByaXZhdGUgX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnR5OiBhbnksIGJpbmQ6IGFueSk6IGFueSB7XG5cdFx0aWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcihwcm9wZXJ0eSkgPT09IGZhbHNlKSB7XG5cdFx0XHRpZiAodGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwPFxuXHRcdFx0XHRcdCguLi5hcmdzOiBhbnlbXSkgPT4gYW55LFxuXHRcdFx0XHRcdHsgYm91bmRGdW5jOiAoLi4uYXJnczogYW55W10pID0+IGFueTsgc2NvcGU6IGFueSB9XG5cdFx0XHRcdD4oKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGJpbmRJbmZvOiBQYXJ0aWFsPEJvdW5kRnVuY3Rpb25EYXRhPiA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XG5cdFx0XHRsZXQgeyBib3VuZEZ1bmMsIHNjb3BlIH0gPSBiaW5kSW5mbztcblxuXHRcdFx0aWYgKGJvdW5kRnVuYyA9PT0gdW5kZWZpbmVkIHx8IHNjb3BlICE9PSBiaW5kKSB7XG5cdFx0XHRcdGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCkgYXMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cdFx0XHRcdHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLnNldChwcm9wZXJ0eSwgeyBib3VuZEZ1bmMsIHNjb3BlOiBiaW5kIH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJvdW5kRnVuYztcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BlcnR5O1xuXHR9XG5cblx0cHVibGljIGdldCByZWdpc3RyeSgpOiBSZWdpc3RyeUhhbmRsZXIge1xuXHRcdGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5O1xuXHR9XG5cblx0cHJpdmF0ZSBfcnVuQmVmb3JlUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcblx0XHRjb25zdCBiZWZvcmVQcm9wZXJ0aWVzOiBCZWZvcmVQcm9wZXJ0aWVzW10gPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycpO1xuXHRcdGlmIChiZWZvcmVQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBiZWZvcmVQcm9wZXJ0aWVzLnJlZHVjZShcblx0XHRcdFx0KHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbikgPT4ge1xuXHRcdFx0XHRcdHJldHVybiB7IC4uLnByb3BlcnRpZXMsIC4uLmJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbi5jYWxsKHRoaXMsIHByb3BlcnRpZXMpIH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHsgLi4ucHJvcGVydGllcyB9XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXG5cdCAqL1xuXHRwcml2YXRlIF9ydW5CZWZvcmVSZW5kZXJzKCk6IFJlbmRlciB7XG5cdFx0Y29uc3QgYmVmb3JlUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVSZW5kZXInKTtcblxuXHRcdGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZSgocmVuZGVyOiBSZW5kZXIsIGJlZm9yZVJlbmRlckZ1bmN0aW9uOiBCZWZvcmVSZW5kZXIpID0+IHtcblx0XHRcdFx0Y29uc3QgdXBkYXRlZFJlbmRlciA9IGJlZm9yZVJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgcmVuZGVyLCB0aGlzLl9wcm9wZXJ0aWVzLCB0aGlzLl9jaGlsZHJlbik7XG5cdFx0XHRcdGlmICghdXBkYXRlZFJlbmRlcikge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybignUmVuZGVyIGZ1bmN0aW9uIG5vdCByZXR1cm5lZCBmcm9tIGJlZm9yZVJlbmRlciwgdXNpbmcgcHJldmlvdXMgcmVuZGVyJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlbmRlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdXBkYXRlZFJlbmRlcjtcblx0XHRcdH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZFJlbmRlckZ1bmM7XG5cdH1cblxuXHQvKipcblx0ICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xuXHQgKlxuXHQgKiBAcGFyYW0gZE5vZGUgVGhlIEROb2RlcyB0byBydW4gdGhyb3VnaCB0aGUgYWZ0ZXIgcmVuZGVyc1xuXHQgKi9cblx0cHJvdGVjdGVkIHJ1bkFmdGVyUmVuZGVycyhkTm9kZTogRE5vZGUgfCBETm9kZVtdKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHRjb25zdCBhZnRlclJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJSZW5kZXInKTtcblxuXHRcdGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGFmdGVyUmVuZGVycy5yZWR1Y2UoKGROb2RlOiBETm9kZSB8IEROb2RlW10sIGFmdGVyUmVuZGVyRnVuY3Rpb246IEFmdGVyUmVuZGVyKSA9PiB7XG5cdFx0XHRcdHJldHVybiBhZnRlclJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgZE5vZGUpO1xuXHRcdFx0fSwgZE5vZGUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX21ldGFNYXAuZm9yRWFjaCgobWV0YSkgPT4ge1xuXHRcdFx0XHRtZXRhLmFmdGVyUmVuZGVyKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZE5vZGU7XG5cdH1cblxuXHRwcml2YXRlIF9ydW5BZnRlckNvbnN0cnVjdG9ycygpOiB2b2lkIHtcblx0XHRjb25zdCBhZnRlckNvbnN0cnVjdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlckNvbnN0cnVjdG9yJyk7XG5cblx0XHRpZiAoYWZ0ZXJDb25zdHJ1Y3RvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0YWZ0ZXJDb25zdHJ1Y3RvcnMuZm9yRWFjaCgoYWZ0ZXJDb25zdHJ1Y3RvcikgPT4gYWZ0ZXJDb25zdHJ1Y3Rvci5jYWxsKHRoaXMpKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2lkZ2V0QmFzZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBXaWRnZXRCYXNlLnRzIiwiaW1wb3J0IHsgVk5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxubGV0IGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnJztcbmxldCBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnJztcblxuZnVuY3Rpb24gZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0aWYgKCdXZWJraXRUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG5cdFx0YnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcblx0XHRicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcblx0fSBlbHNlIGlmICgndHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSB8fCAnTW96VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xuXHRcdGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XG5cdFx0YnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ2FuaW1hdGlvbmVuZCc7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdZb3VyIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCcpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcblx0aWYgKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9PT0gJycpIHtcblx0XHRkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KTtcblx0fVxufVxuXG5mdW5jdGlvbiBydW5BbmRDbGVhblVwKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdGFydEFuaW1hdGlvbjogKCkgPT4gdm9pZCwgZmluaXNoQW5pbWF0aW9uOiAoKSA9PiB2b2lkKSB7XG5cdGluaXRpYWxpemUoZWxlbWVudCk7XG5cblx0bGV0IGZpbmlzaGVkID0gZmFsc2U7XG5cblx0bGV0IHRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIWZpbmlzaGVkKSB7XG5cdFx0XHRmaW5pc2hlZCA9IHRydWU7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblxuXHRcdFx0ZmluaXNoQW5pbWF0aW9uKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHN0YXJ0QW5pbWF0aW9uKCk7XG5cblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbn1cblxuZnVuY3Rpb24gZXhpdChub2RlOiBIVE1MRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uOiBzdHJpbmcsIHJlbW92ZU5vZGU6ICgpID0+IHZvaWQpIHtcblx0Y29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb25BY3RpdmUgfHwgYCR7ZXhpdEFuaW1hdGlvbn0tYWN0aXZlYDtcblxuXHRydW5BbmRDbGVhblVwKFxuXHRcdG5vZGUsXG5cdFx0KCkgPT4ge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGV4aXRBbmltYXRpb24pO1xuXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdCgpID0+IHtcblx0XHRcdHJlbW92ZU5vZGUoKTtcblx0XHR9XG5cdCk7XG59XG5cbmZ1bmN0aW9uIGVudGVyKG5vZGU6IEhUTUxFbGVtZW50LCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uOiBzdHJpbmcpIHtcblx0Y29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uQWN0aXZlIHx8IGAke2VudGVyQW5pbWF0aW9ufS1hY3RpdmVgO1xuXG5cdHJ1bkFuZENsZWFuVXAoXG5cdFx0bm9kZSxcblx0XHQoKSA9PiB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoZW50ZXJBbmltYXRpb24pO1xuXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdCgpID0+IHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZShlbnRlckFuaW1hdGlvbik7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuXHRcdH1cblx0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRlbnRlcixcblx0ZXhpdFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjc3NUcmFuc2l0aW9ucy50cyIsImltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHtcblx0Q29uc3RydWN0b3IsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHREZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFJlZ2lzdHJ5TGFiZWwsXG5cdFZOb2RlUHJvcGVydGllcyxcblx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0V05vZGUsXG5cdERvbU9wdGlvbnNcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEludGVybmFsVk5vZGUsIFJlbmRlclJlc3VsdCB9IGZyb20gJy4vdmRvbSc7XG5cbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFdOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFdOb2RlLicpO1xuXG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBWTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBWTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZS4nKTtcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgV05vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV05vZGU8VyBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdGNoaWxkOiBETm9kZTxXPlxuKTogY2hpbGQgaXMgV05vZGU8Vz4ge1xuXHRyZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IFdOT0RFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQ6IEROb2RlKTogY2hpbGQgaXMgVk5vZGUge1xuXHRyZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IFZOT0RFKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudE5vZGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIEVsZW1lbnQge1xuXHRyZXR1cm4gISF2YWx1ZS50YWdOYW1lO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGRlY29yYXRlIG1vZGlmaWVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW9kaWZpZXI8VCBleHRlbmRzIEROb2RlPiB7XG5cdChkTm9kZTogVCwgYnJlYWtlcjogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKlxuICogVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiBmb3IgZGVjb3JhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcmVkaWNhdGU8VCBleHRlbmRzIEROb2RlPiB7XG5cdChkTm9kZTogRE5vZGUpOiBkTm9kZSBpcyBUO1xufVxuXG4vKipcbiAqIERlY29yYXRvciBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVjb3JhdGVPcHRpb25zPFQgZXh0ZW5kcyBETm9kZT4ge1xuXHRtb2RpZmllcjogTW9kaWZpZXI8VD47XG5cdHByZWRpY2F0ZT86IFByZWRpY2F0ZTxUPjtcblx0c2hhbGxvdz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyBkZWNvcmF0ZSBmdW5jdGlvbiBmb3IgRE5vZGVzLiBUaGUgbm9kZXMgYXJlIG1vZGlmaWVkIGluIHBsYWNlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwcmVkaWNhdGVcbiAqIGFuZCBtb2RpZmllciBmdW5jdGlvbnMuXG4gKlxuICogVGhlIGNoaWxkcmVuIG9mIGVhY2ggbm9kZSBhcmUgZmxhdHRlbmVkIGFuZCBhZGRlZCB0byB0aGUgYXJyYXkgZm9yIGRlY29yYXRpb24uXG4gKlxuICogSWYgbm8gcHJlZGljYXRlIGlzIHN1cHBsaWVkIHRoZW4gdGhlIG1vZGlmaWVyIHdpbGwgYmUgZXhlY3V0ZWQgb24gYWxsIG5vZGVzLiBBIGBicmVha2VyYCBmdW5jdGlvbiBpcyBwYXNzZWQgdG8gdGhlXG4gKiBtb2RpZmllciB3aGljaCB3aWxsIGRyYWluIHRoZSBub2RlcyBhcnJheSBhbmQgZXhpdCB0aGUgZGVjb3JhdGlvbi5cbiAqXG4gKiBXaGVuIHRoZSBgc2hhbGxvd2Agb3B0aW9ucyBpcyBzZXQgdG8gYHRydWVgIHRoZSBvbmx5IHRoZSB0b3Agbm9kZSBvciBub2RlcyB3aWxsIGJlIGRlY29yYXRlZCAob25seSBzdXBwb3J0ZWQgdXNpbmdcbiAqIGBEZWNvcmF0ZU9wdGlvbnNgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oZE5vZGVzOiBETm9kZSwgb3B0aW9uczogRGVjb3JhdGVPcHRpb25zPFQ+KTogRE5vZGU7XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihkTm9kZXM6IEROb2RlW10sIG9wdGlvbnM6IERlY29yYXRlT3B0aW9uczxUPik6IEROb2RlW107XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihkTm9kZXM6IEROb2RlIHwgRE5vZGVbXSwgb3B0aW9uczogRGVjb3JhdGVPcHRpb25zPFQ+KTogRE5vZGUgfCBETm9kZVtdO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oZE5vZGVzOiBETm9kZSwgbW9kaWZpZXI6IE1vZGlmaWVyPFQ+LCBwcmVkaWNhdGU6IFByZWRpY2F0ZTxUPik6IEROb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oZE5vZGVzOiBETm9kZVtdLCBtb2RpZmllcjogTW9kaWZpZXI8VD4sIHByZWRpY2F0ZTogUHJlZGljYXRlPFQ+KTogRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KFxuXHRkTm9kZXM6IFJlbmRlclJlc3VsdCxcblx0bW9kaWZpZXI6IE1vZGlmaWVyPFQ+LFxuXHRwcmVkaWNhdGU6IFByZWRpY2F0ZTxUPlxuKTogUmVuZGVyUmVzdWx0O1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGROb2RlczogRE5vZGUsIG1vZGlmaWVyOiBNb2RpZmllcjxETm9kZT4pOiBETm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IEROb2RlW10sIG1vZGlmaWVyOiBNb2RpZmllcjxETm9kZT4pOiBETm9kZVtdO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGROb2RlczogUmVuZGVyUmVzdWx0LCBtb2RpZmllcjogTW9kaWZpZXI8RE5vZGU+KTogUmVuZGVyUmVzdWx0O1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKFxuXHRkTm9kZXM6IEROb2RlIHwgRE5vZGVbXSxcblx0b3B0aW9uc09yTW9kaWZpZXI6IE1vZGlmaWVyPEROb2RlPiB8IERlY29yYXRlT3B0aW9uczxETm9kZT4sXG5cdHByZWRpY2F0ZT86IFByZWRpY2F0ZTxETm9kZT5cbik6IEROb2RlIHwgRE5vZGVbXSB7XG5cdGxldCBzaGFsbG93ID0gZmFsc2U7XG5cdGxldCBtb2RpZmllcjtcblx0aWYgKHR5cGVvZiBvcHRpb25zT3JNb2RpZmllciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXI7XG5cdH0gZWxzZSB7XG5cdFx0bW9kaWZpZXIgPSBvcHRpb25zT3JNb2RpZmllci5tb2RpZmllcjtcblx0XHRwcmVkaWNhdGUgPSBvcHRpb25zT3JNb2RpZmllci5wcmVkaWNhdGU7XG5cdFx0c2hhbGxvdyA9IG9wdGlvbnNPck1vZGlmaWVyLnNoYWxsb3cgfHwgZmFsc2U7XG5cdH1cblxuXHRsZXQgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBbLi4uZE5vZGVzXSA6IFtkTm9kZXNdO1xuXHRmdW5jdGlvbiBicmVha2VyKCkge1xuXHRcdG5vZGVzID0gW107XG5cdH1cblx0d2hpbGUgKG5vZGVzLmxlbmd0aCkge1xuXHRcdGNvbnN0IG5vZGUgPSBub2Rlcy5zaGlmdCgpO1xuXHRcdGlmIChub2RlKSB7XG5cdFx0XHRpZiAoIXNoYWxsb3cgJiYgKGlzV05vZGUobm9kZSkgfHwgaXNWTm9kZShub2RlKSkgJiYgbm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRub2RlcyA9IFsuLi5ub2RlcywgLi4ubm9kZS5jaGlsZHJlbl07XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUobm9kZSkpIHtcblx0XHRcdFx0bW9kaWZpZXIobm9kZSwgYnJlYWtlcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkTm9kZXM7XG59XG5cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIGEgd2lkZ2V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdzxXIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdHdpZGdldENvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxXPiB8IFJlZ2lzdHJ5TGFiZWwsXG5cdHByb3BlcnRpZXM6IFdbJ3Byb3BlcnRpZXMnXSxcblx0Y2hpbGRyZW46IFdbJ2NoaWxkcmVuJ10gPSBbXVxuKTogV05vZGU8Vz4ge1xuXHRyZXR1cm4ge1xuXHRcdGNoaWxkcmVuLFxuXHRcdHdpZGdldENvbnN0cnVjdG9yLFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dHlwZTogV05PREVcblx0fTtcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgVk5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcywgY2hpbGRyZW4/OiBETm9kZVtdKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZywgY2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlW10pOiBWTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiB2KHRhZzogc3RyaW5nKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdihcblx0dGFnOiBzdHJpbmcsXG5cdHByb3BlcnRpZXNPckNoaWxkcmVuOiBWTm9kZVByb3BlcnRpZXMgfCBEZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzIHwgRE5vZGVbXSA9IHt9LFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGVbXSA9IHVuZGVmaW5lZFxuKTogVk5vZGUge1xuXHRsZXQgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuXHRsZXQgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s7XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllc09yQ2hpbGRyZW4pKSB7XG5cdFx0Y2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcblx0XHRwcm9wZXJ0aWVzID0ge307XG5cdH1cblxuXHRpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XG5cdFx0cHJvcGVydGllcyA9IHt9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0YWcsXG5cdFx0ZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXG5cdFx0Y2hpbGRyZW4sXG5cdFx0cHJvcGVydGllcyxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIFZOb2RlIGZvciBhbiBleGlzdGluZyBET00gTm9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbShcblx0eyBub2RlLCBhdHRycyA9IHt9LCBwcm9wcyA9IHt9LCBvbiA9IHt9LCBkaWZmVHlwZSA9ICdub25lJyB9OiBEb21PcHRpb25zLFxuXHRjaGlsZHJlbj86IEROb2RlW11cbik6IFZOb2RlIHtcblx0cmV0dXJuIHtcblx0XHR0YWc6IGlzRWxlbWVudE5vZGUobm9kZSkgPyBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA6ICcnLFxuXHRcdHByb3BlcnRpZXM6IHByb3BzLFxuXHRcdGF0dHJpYnV0ZXM6IGF0dHJzLFxuXHRcdGV2ZW50czogb24sXG5cdFx0Y2hpbGRyZW4sXG5cdFx0dHlwZTogVk5PREUsXG5cdFx0ZG9tTm9kZTogbm9kZSxcblx0XHR0ZXh0OiBpc0VsZW1lbnROb2RlKG5vZGUpID8gdW5kZWZpbmVkIDogbm9kZS5kYXRhLFxuXHRcdGRpZmZUeXBlXG5cdH0gYXMgSW50ZXJuYWxWTm9kZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkLnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gcnVuIGFzIGFuIGFzcGVjdCB0byBgcmVuZGVyYFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kOiBGdW5jdGlvbik6ICh0YXJnZXQ6IGFueSkgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcigpOiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kPzogRnVuY3Rpb24pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFmdGVyUmVuZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGFmdGVyUmVuZGVyLnRzIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgQmVmb3JlUHJvcGVydGllcyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVjb3JhdG9yIHRoYXQgYWRkcyB0aGUgZnVuY3Rpb24gcGFzc2VkIG9mIHRhcmdldCBtZXRob2QgdG8gYmUgcnVuXG4gKiBpbiB0aGUgYGJlZm9yZVByb3BlcnRpZXNgIGxpZmVjeWNsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kOiBCZWZvcmVQcm9wZXJ0aWVzKTogKHRhcmdldDogYW55KSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMoKTogKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nKSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kPzogQmVmb3JlUHJvcGVydGllcykge1xuXHRyZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiZWZvcmVQcm9wZXJ0aWVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGJlZm9yZVByb3BlcnRpZXMudHMiLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciwgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgQ3VzdG9tRWxlbWVudENoaWxkVHlwZSB9IGZyb20gJy4uL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudCc7XG5cbmV4cG9ydCB0eXBlIEN1c3RvbUVsZW1lbnRQcm9wZXJ0eU5hbWVzPFAgZXh0ZW5kcyBvYmplY3Q+ID0gKChrZXlvZiBQKSB8IChrZXlvZiBXaWRnZXRQcm9wZXJ0aWVzKSlbXTtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjdXN0b20gZWxlbWVudCBjb25maWd1cmF0aW9uIHVzZWQgYnkgdGhlIGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudENvbmZpZzxQIGV4dGVuZHMgb2JqZWN0ID0geyBbaW5kZXg6IHN0cmluZ106IGFueSB9PiB7XG5cdC8qKlxuXHQgKiBUaGUgdGFnIG9mIHRoZSBjdXN0b20gZWxlbWVudFxuXHQgKi9cblx0dGFnOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIExpc3Qgb2Ygd2lkZ2V0IHByb3BlcnRpZXMgdG8gZXhwb3NlIGFzIHByb3BlcnRpZXMgb24gdGhlIGN1c3RvbSBlbGVtZW50XG5cdCAqL1xuXHRwcm9wZXJ0aWVzPzogQ3VzdG9tRWxlbWVudFByb3BlcnR5TmFtZXM8UD47XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgYXR0cmlidXRlcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnQgdG8gbWFwIHRvIHdpZGdldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRhdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudFByb3BlcnR5TmFtZXM8UD47XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgZXZlbnRzIHRvIGV4cG9zZVxuXHQgKi9cblx0ZXZlbnRzPzogQ3VzdG9tRWxlbWVudFByb3BlcnR5TmFtZXM8UD47XG5cblx0Y2hpbGRUeXBlPzogQ3VzdG9tRWxlbWVudENoaWxkVHlwZTtcbn1cblxuLyoqXG4gKiBUaGlzIERlY29yYXRvciBpcyBwcm92aWRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGN1c3RvbSBlbGVtZW50LCBhbmRcbiAqIHJlZ2lzdGVycyB0aGF0IGN1c3RvbSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRWxlbWVudDxQIGV4dGVuZHMgb2JqZWN0ID0geyBbaW5kZXg6IHN0cmluZ106IGFueSB9Pih7XG5cdHRhZyxcblx0cHJvcGVydGllcyA9IFtdLFxuXHRhdHRyaWJ1dGVzID0gW10sXG5cdGV2ZW50cyA9IFtdLFxuXHRjaGlsZFR5cGUgPSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk9cbn06IEN1c3RvbUVsZW1lbnRDb25maWc8UD4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uPFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjxhbnk+Pih0YXJnZXQ6IFQpIHtcblx0XHR0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XG5cdFx0XHR0YWdOYW1lOiB0YWcsXG5cdFx0XHRhdHRyaWJ1dGVzLFxuXHRcdFx0cHJvcGVydGllcyxcblx0XHRcdGV2ZW50cyxcblx0XHRcdGNoaWxkVHlwZVxuXHRcdH07XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1c3RvbUVsZW1lbnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY3VzdG9tRWxlbWVudC50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IERpZmZQcm9wZXJ0eUZ1bmN0aW9uIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZTogc3RyaW5nLCBkaWZmRnVuY3Rpb246IERpZmZQcm9wZXJ0eUZ1bmN0aW9uLCByZWFjdGlvbkZ1bmN0aW9uPzogRnVuY3Rpb24pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoYGRpZmZQcm9wZXJ0eToke3Byb3BlcnR5TmFtZX1gLCBkaWZmRnVuY3Rpb24uYmluZChudWxsKSk7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XG5cdFx0aWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcblx0XHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicsIHtcblx0XHRcdFx0cHJvcGVydHlOYW1lLFxuXHRcdFx0XHRyZWFjdGlvbjogcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogcmVhY3Rpb25GdW5jdGlvblxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlmZlByb3BlcnR5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGRpZmZQcm9wZXJ0eS50cyIsImV4cG9ydCB0eXBlIERlY29yYXRvckhhbmRsZXIgPSAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nKSA9PiB2b2lkO1xuXG4vKipcbiAqIEdlbmVyaWMgZGVjb3JhdG9yIGhhbmRsZXIgdG8gdGFrZSBjYXJlIG9mIHdoZXRoZXIgb3Igbm90IHRoZSBkZWNvcmF0b3Igd2FzIGNhbGxlZCBhdCB0aGUgY2xhc3MgbGV2ZWxcbiAqIG9yIHRoZSBtZXRob2QgbGV2ZWwuXG4gKlxuICogQHBhcmFtIGhhbmRsZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZURlY29yYXRvcihoYW5kbGVyOiBEZWNvcmF0b3JIYW5kbGVyKSB7XG5cdHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcsIGRlc2NyaXB0b3I/OiBQcm9wZXJ0eURlc2NyaXB0b3IpIHtcblx0XHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0aGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoYW5kbGVyKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRGVjb3JhdG9yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGhhbmRsZURlY29yYXRvci50cyIsImltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi8uLi9JbmplY3Rvcic7XG5pbXBvcnQgeyBiZWZvcmVQcm9wZXJ0aWVzIH0gZnJvbSAnLi9iZWZvcmVQcm9wZXJ0aWVzJztcbmltcG9ydCB7IFJlZ2lzdHJ5TGFiZWwgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIE1hcCBvZiBpbnN0YW5jZXMgYWdhaW5zdCByZWdpc3RlcmVkIGluamVjdG9ycy5cbiAqL1xuY29uc3QgcmVnaXN0ZXJlZEluamVjdG9yc01hcDogV2Vha01hcDxXaWRnZXRCYXNlLCBJbmplY3RvcltdPiA9IG5ldyBXZWFrTWFwKCk7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29udHJhY3QgcmVxdWlyZXMgZm9yIHRoZSBnZXQgcHJvcGVydGllcyBmdW5jdGlvblxuICogdXNlZCB0byBtYXAgdGhlIGluamVjdGVkIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2V0UHJvcGVydGllczxUID0gYW55PiB7XG5cdChwYXlsb2FkOiBhbnksIHByb3BlcnRpZXM6IFQpOiBUO1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIGluamVjdCBjb25maWd1cmF0aW9uIHJlcXVpcmVkIGZvciB1c2Ugb2YgdGhlIGBpbmplY3RgIGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdENvbmZpZyB7XG5cdC8qKlxuXHQgKiBUaGUgbGFiZWwgb2YgdGhlIHJlZ2lzdHJ5IGluamVjdG9yXG5cdCAqL1xuXHRuYW1lOiBSZWdpc3RyeUxhYmVsO1xuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgcHJvcGVydHVlcyB0byBpbmplY3QgdXNpbmcgdGhlIHBhc3NlZCBwcm9wZXJ0aWVzXG5cdCAqIGFuZCB0aGUgaW5qZWN0ZWQgcGF5bG9hZC5cblx0ICovXG5cdGdldFByb3BlcnRpZXM6IEdldFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogRGVjb3JhdG9yIHJldHJpZXZlcyBhbiBpbmplY3RvciBmcm9tIGFuIGF2YWlsYWJsZSByZWdpc3RyeSB1c2luZyB0aGUgbmFtZSBhbmRcbiAqIGNhbGxzIHRoZSBgZ2V0UHJvcGVydGllc2AgZnVuY3Rpb24gd2l0aCB0aGUgcGF5bG9hZCBmcm9tIHRoZSBpbmplY3RvclxuICogYW5kIGN1cnJlbnQgcHJvcGVydGllcyB3aXRoIHRoZSB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gSW5qZWN0Q29uZmlnIHRoZSBpbmplY3QgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KHsgbmFtZSwgZ2V0UHJvcGVydGllcyB9OiBJbmplY3RDb25maWcpIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdGJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24odGhpczogV2lkZ2V0QmFzZSwgcHJvcGVydGllczogYW55KSB7XG5cdFx0XHRjb25zdCBpbmplY3RvciA9IHRoaXMucmVnaXN0cnkuZ2V0SW5qZWN0b3IobmFtZSk7XG5cdFx0XHRpZiAoaW5qZWN0b3IpIHtcblx0XHRcdFx0Y29uc3QgcmVnaXN0ZXJlZEluamVjdG9ycyA9IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuZ2V0KHRoaXMpIHx8IFtdO1xuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZWdpc3RlcmVkSW5qZWN0b3JzTWFwLnNldCh0aGlzLCByZWdpc3RlcmVkSW5qZWN0b3JzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5pbmRleE9mKGluamVjdG9yKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRpbmplY3Rvci5vbignaW52YWxpZGF0ZScsICgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlZ2lzdGVyZWRJbmplY3RvcnMucHVzaChpbmplY3Rvcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGdldFByb3BlcnRpZXMoaW5qZWN0b3IuZ2V0KCksIHByb3BlcnRpZXMpO1xuXHRcdFx0fVxuXHRcdH0pKHRhcmdldCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbmplY3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaW5qZWN0LnRzIiwiaW1wb3J0IHsgUHJvcGVydHlDaGFuZ2VSZWNvcmQgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgV0lER0VUX0JBU0VfVFlQRSB9IGZyb20gJy4vUmVnaXN0cnknO1xuXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IHRydWUsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQ6IGZhbHNlLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG5cdGNvbnN0IHZhbGlkT2xkUHJvcGVydHkgPSBwcmV2aW91c1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShwcmV2aW91c1Byb3BlcnR5KTtcblx0Y29uc3QgdmFsaWROZXdQcm9wZXJ0eSA9IG5ld1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSk7XG5cblx0aWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoYW5nZWQ6IHRydWUsXG5cdFx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0XHR9O1xuXHR9XG5cblx0Y29uc3QgcHJldmlvdXNLZXlzID0gT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0eSk7XG5cdGNvbnN0IG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdQcm9wZXJ0eSk7XG5cblx0aWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XG5cdFx0Y2hhbmdlZCA9IHRydWU7XG5cdH0gZWxzZSB7XG5cdFx0Y2hhbmdlZCA9IG5ld0tleXMuc29tZSgoa2V5KSA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3UHJvcGVydHlba2V5XSAhPT0gcHJldmlvdXNQcm9wZXJ0eVtrZXldO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZCxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG8ocHJldmlvdXNQcm9wZXJ0eTogYW55LCBuZXdQcm9wZXJ0eTogYW55KTogUHJvcGVydHlDaGFuZ2VSZWNvcmQge1xuXHRsZXQgcmVzdWx0O1xuXHRpZiAodHlwZW9mIG5ld1Byb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0aWYgKG5ld1Byb3BlcnR5Ll90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKSB7XG5cdFx0XHRyZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdH1cblx0fSBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XG5cdFx0cmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdH0gZWxzZSB7XG5cdFx0cmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGRpZmYudHMiLCJpbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IHsgY3JlYXRlSGFuZGxlIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IEhhbmRsZSB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgY3NzVHJhbnNpdGlvbnMgZnJvbSAnLi4vYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgRE5vZGUsIFByb2plY3Rpb24sIFByb2plY3Rpb25PcHRpb25zIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgYWZ0ZXJSZW5kZXIgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXInO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vLi4vZCc7XG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gJy4vLi4vUmVnaXN0cnknO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi8uLi92ZG9tJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBhdHRhY2ggc3RhdGUgb2YgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgZW51bSBQcm9qZWN0b3JBdHRhY2hTdGF0ZSB7XG5cdEF0dGFjaGVkID0gMSxcblx0RGV0YWNoZWRcbn1cblxuLyoqXG4gKiBBdHRhY2ggdHlwZSBmb3IgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgZW51bSBBdHRhY2hUeXBlIHtcblx0QXBwZW5kID0gMSxcblx0TWVyZ2UgPSAyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0YWNoT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBJZiBgJ2FwcGVuZCdgIGl0IHdpbGwgYXBwZW5kZWQgdG8gdGhlIHJvb3QuIElmIGAnbWVyZ2UnYCBpdCB3aWxsIG1lcmdlZCB3aXRoIHRoZSByb290LiBJZiBgJ3JlcGxhY2UnYCBpdCB3aWxsXG5cdCAqIHJlcGxhY2UgdGhlIHJvb3QuXG5cdCAqL1xuXHR0eXBlOiBBdHRhY2hUeXBlO1xuXG5cdC8qKlxuXHQgKiBFbGVtZW50IHRvIGF0dGFjaCB0aGUgcHJvamVjdG9yLlxuXHQgKi9cblx0cm9vdD86IEVsZW1lbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yUHJvcGVydGllcyB7XG5cdHJlZ2lzdHJ5PzogUmVnaXN0cnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yTWl4aW48UD4ge1xuXHRyZWFkb25seSBwcm9wZXJ0aWVzOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFByb2plY3RvclByb3BlcnRpZXM+O1xuXG5cdC8qKlxuXHQgKiBBcHBlbmQgdGhlIHByb2plY3RvciB0byB0aGUgcm9vdC5cblx0ICovXG5cdGFwcGVuZChyb290PzogRWxlbWVudCk6IEhhbmRsZTtcblxuXHQvKipcblx0ICogTWVyZ2UgdGhlIHByb2plY3RvciBvbnRvIHRoZSByb290LlxuXHQgKlxuXHQgKiBUaGUgYHJvb3RgIGFuZCBhbnkgb2YgaXRzIGBjaGlsZHJlbmAgd2lsbCBiZSByZS11c2VkLiAgQW55IGV4Y2VzcyBET00gbm9kZXMgd2lsbCBiZSBpZ25vcmVkIGFuZCBhbnkgbWlzc2luZyBET00gbm9kZXNcblx0ICogd2lsbCBiZSBjcmVhdGVkLlxuXHQgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBlbGVtZW50IHRoYXQgdGhlIHJvb3QgdmlydHVhbCBET00gbm9kZSB3aWxsIGJlIG1lcmdlZCB3aXRoLiAgRGVmYXVsdHMgdG8gYGRvY3VtZW50LmJvZHlgLlxuXHQgKi9cblx0bWVyZ2Uocm9vdD86IEVsZW1lbnQpOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIEF0dGFjaCB0aGUgcHJvamVjdCB0byBhIF9zYW5kYm94ZWRfIGRvY3VtZW50IGZyYWdtZW50IHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIERPTS5cblx0ICpcblx0ICogV2hlbiBzYW5kYm94ZWQsIHRoZSBgUHJvamVjdG9yYCB3aWxsIHJ1biBpbiBhIHN5bmMgbWFubmVyLCB3aGVyZSByZW5kZXJzIGFyZSBjb21wbGV0ZWQgd2l0aGluIHRoZSBzYW1lIHR1cm4uXG5cdCAqIFRoZSBgUHJvamVjdG9yYCBjcmVhdGVzIGEgYERvY3VtZW50RnJhZ21lbnRgIHdoaWNoIHJlcGxhY2VzIGFueSBvdGhlciBgcm9vdGAgdGhhdCBoYXMgYmVlbiBzZXQuXG5cdCAqIEBwYXJhbSBkb2MgVGhlIGBEb2N1bWVudGAgdG8gdXNlLCB3aGljaCBkZWZhdWx0cyB0byB0aGUgZ2xvYmFsIGBkb2N1bWVudGAuXG5cdCAqL1xuXHRzYW5kYm94KGRvYz86IERvY3VtZW50KTogdm9pZDtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgcHJvcGVydGllcyBmb3IgdGhlIHdpZGdldC4gUmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGRpZmZpbmcgZnVuY3Rpb25zIGZvciB0aGUgcHJvcGVydGllcyBhZ2FpbnN0IHRoZVxuXHQgKiBwcmV2aW91cyBwcm9wZXJ0aWVzLiBSdW5zIHRob3VnaCBhbnkgcmVnaXN0ZXJlZCBzcGVjaWZpYyBwcm9wZXJ0eSBkaWZmIGZ1bmN0aW9ucyBjb2xsZWN0aW5nIHRoZSByZXN1bHRzIGFuZCB0aGVuXG5cdCAqIHJ1bnMgdGhlIHJlbWFpbmRlciB0aHJvdWdoIHRoZSBjYXRjaCBhbGwgZGlmZiBmdW5jdGlvbi4gVGhlIGFnZ3JlZ2F0ZSBvZiB0aGUgdHdvIHNldHMgb2YgdGhlIHJlc3VsdHMgaXMgdGhlblxuXHQgKiBzZXQgYXMgdGhlIHdpZGdldCdzIHByb3BlcnRpZXNcblx0ICpcblx0ICogQHBhcmFtIHByb3BlcnRpZXMgVGhlIG5ldyB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0c2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB3aWRnZXQncyBjaGlsZHJlblxuXHQgKi9cblx0c2V0Q2hpbGRyZW4oY2hpbGRyZW46IEROb2RlW10pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBgc3RyaW5nYCB0aGF0IHJlcHJlc2VudHMgdGhlIEhUTUwgb2YgdGhlIGN1cnJlbnQgcHJvamVjdGlvbi4gIFRoZSBwcm9qZWN0b3IgbmVlZHMgdG8gYmUgYXR0YWNoZWQuXG5cdCAqL1xuXHR0b0h0bWwoKTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgaWYgdGhlIHByb2plY3RvcnMgaXMgaW4gYXN5bmMgbW9kZSwgY29uZmlndXJlZCB0byBgdHJ1ZWAgYnkgZGVmYXVsdHMuXG5cdCAqL1xuXHRhc3luYzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUm9vdCBlbGVtZW50IHRvIGF0dGFjaCB0aGUgcHJvamVjdG9yXG5cdCAqL1xuXHRyb290OiBFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBUaGUgc3RhdHVzIG9mIHRoZSBwcm9qZWN0b3Jcblx0ICovXG5cdHJlYWRvbmx5IHByb2plY3RvclN0YXRlOiBQcm9qZWN0b3JBdHRhY2hTdGF0ZTtcblxuXHQvKipcblx0ICogUnVucyByZWdpc3RlcmVkIGRlc3Ryb3kgaGFuZGxlc1xuXHQgKi9cblx0ZGVzdHJveSgpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUHJvamVjdG9yTWl4aW48UCwgVCBleHRlbmRzIENvbnN0cnVjdG9yPFdpZGdldEJhc2U8UD4+PihCYXNlOiBUKTogVCAmIENvbnN0cnVjdG9yPFByb2plY3Rvck1peGluPFA+PiB7XG5cdGNsYXNzIFByb2plY3RvciBleHRlbmRzIEJhc2Uge1xuXHRcdHB1YmxpYyBwcm9qZWN0b3JTdGF0ZTogUHJvamVjdG9yQXR0YWNoU3RhdGU7XG5cdFx0cHVibGljIHByb3BlcnRpZXM6IFJlYWRvbmx5PFA+ICYgUmVhZG9ubHk8UHJvamVjdG9yUHJvcGVydGllcz47XG5cblx0XHRwcml2YXRlIF9yb290OiBFbGVtZW50O1xuXHRcdHByaXZhdGUgX2FzeW5jID0gdHJ1ZTtcblx0XHRwcml2YXRlIF9hdHRhY2hIYW5kbGU6IEhhbmRsZTtcblx0XHRwcml2YXRlIF9wcm9qZWN0aW9uT3B0aW9uczogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz47XG5cdFx0cHJpdmF0ZSBfcHJvamVjdGlvbjogUHJvamVjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRwcml2YXRlIF9wcm9qZWN0b3JQcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10gPSB7fSBhcyB0aGlzWydwcm9wZXJ0aWVzJ107XG5cdFx0cHJpdmF0ZSBfaGFuZGxlczogRnVuY3Rpb25bXSA9IFtdO1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHR0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcblx0XHRcdFx0dHJhbnNpdGlvbnM6IGNzc1RyYW5zaXRpb25zXG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnJvb3QgPSBkb2N1bWVudC5ib2R5O1xuXHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhcHBlbmQocm9vdD86IEVsZW1lbnQpOiBIYW5kbGUge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0dHlwZTogQXR0YWNoVHlwZS5BcHBlbmQsXG5cdFx0XHRcdHJvb3Rcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIG1lcmdlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuTWVyZ2UsXG5cdFx0XHRcdHJvb3Rcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNldCByb290KHJvb3Q6IEVsZW1lbnQpIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcm9vdCA9IHJvb3Q7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCByb290KCk6IEVsZW1lbnQge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jvb3Q7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBhc3luYygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLl9hc3luYztcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0IGFzeW5jKGFzeW5jOiBib29sZWFuKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSBhc3luYyBtb2RlJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9hc3luYyA9IGFzeW5jO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzYW5kYm94KGRvYzogRG9jdW1lbnQgPSBkb2N1bWVudCk6IHZvaWQge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjcmVhdGUgc2FuZGJveCcpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYXN5bmMgPSBmYWxzZTtcblx0XHRcdGNvbnN0IHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcblxuXHRcdFx0LyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXG5cdFx0XHR0aGlzLm93bigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3Jvb3QgPSBwcmV2aW91c1Jvb3Q7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5fYXR0YWNoKHtcblx0XHRcdFx0LyogRG9jdW1lbnRGcmFnbWVudCBpcyBub3QgYXNzaWduYWJsZSB0byBFbGVtZW50LCBidXQgcHJvdmlkZXMgZXZlcnl0aGluZyBuZWVkZWQgdG8gd29yayAqL1xuXHRcdFx0XHRyb290OiBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpIGFzIGFueSxcblx0XHRcdFx0dHlwZTogQXR0YWNoVHlwZS5BcHBlbmRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRDaGlsZHJlbihjaGlsZHJlbjogRE5vZGVbXSk6IHZvaWQge1xuXHRcdFx0dGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdFx0dGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZCB7XG5cdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG5cdFx0XHRcdFx0dGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeS5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBhc3NpZ24oe30sIHByb3BlcnRpZXMpO1xuXHRcdFx0c3VwZXIuX19zZXRDb3JlUHJvcGVydGllc19fKHsgYmluZDogdGhpcywgYmFzZVJlZ2lzdHJ5OiBwcm9wZXJ0aWVzLnJlZ2lzdHJ5IH0pO1xuXHRcdFx0c3VwZXIuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIHRvSHRtbCgpOiBzdHJpbmcge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgIT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkIHx8ICF0aGlzLl9wcm9qZWN0aW9uKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGlzIG5vdCBhdHRhY2hlZCwgY2Fubm90IHJldHVybiBhbiBIVE1MIHN0cmluZyBvZiBwcm9qZWN0aW9uLicpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0aGlzLl9wcm9qZWN0aW9uLmRvbU5vZGUuY2hpbGROb2Rlc1swXSBhcyBFbGVtZW50KS5vdXRlckhUTUw7XG5cdFx0fVxuXG5cdFx0QGFmdGVyUmVuZGVyKClcblx0XHRwdWJsaWMgYWZ0ZXJSZW5kZXIocmVzdWx0OiBETm9kZSkge1xuXHRcdFx0bGV0IG5vZGUgPSByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG5vZGUgPSB2KCdzcGFuJywge30sIFtyZXN1bHRdKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBvd24oaGFuZGxlOiBGdW5jdGlvbik6IHZvaWQge1xuXHRcdFx0dGhpcy5faGFuZGxlcy5wdXNoKGhhbmRsZSk7XG5cdFx0fVxuXG5cdFx0cHVibGljIGRlc3Ryb3koKSB7XG5cdFx0XHR3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXMucG9wKCk7XG5cdFx0XHRcdGlmIChoYW5kbGUpIHtcblx0XHRcdFx0XHRoYW5kbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2F0dGFjaCh7IHR5cGUsIHJvb3QgfTogQXR0YWNoT3B0aW9ucyk6IEhhbmRsZSB7XG5cdFx0XHRpZiAocm9vdCkge1xuXHRcdFx0XHR0aGlzLnJvb3QgPSByb290O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkO1xuXG5cdFx0XHRjb25zdCBoYW5kbGUgPSAoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLm93bihoYW5kbGUpO1xuXHRcdFx0dGhpcy5fYXR0YWNoSGFuZGxlID0gY3JlYXRlSGFuZGxlKGhhbmRsZSk7XG5cblx0XHRcdHRoaXMuX3Byb2plY3Rpb25PcHRpb25zID0geyAuLi50aGlzLl9wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBzeW5jOiAhdGhpcy5fYXN5bmMgfSB9O1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLkFwcGVuZDpcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLk1lcmdlOlxuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSBkb20ubWVyZ2UodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2hIYW5kbGU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFByb2plY3Rvcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdG9yTWl4aW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUHJvamVjdG9yLnRzIiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIFdpZGdldFByb3BlcnRpZXMsIFN1cHBvcnRlZENsYXNzTmFtZSB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gJy4vLi4vUmVnaXN0cnknO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9pbmplY3QnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGRpZmZQcm9wZXJ0eSB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHknO1xuaW1wb3J0IHsgc2hhbGxvdyB9IGZyb20gJy4vLi4vZGlmZic7XG5cbi8qKlxuICogQSBsb29rdXAgb2JqZWN0IGZvciBhdmFpbGFibGUgY2xhc3MgbmFtZXNcbiAqL1xuZXhwb3J0IHR5cGUgQ2xhc3NOYW1lcyA9IHtcblx0W2tleTogc3RyaW5nXTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBBIGxvb2t1cCBvYmplY3QgZm9yIGF2YWlsYWJsZSB3aWRnZXQgY2xhc3NlcyBuYW1lc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRoZW1lIHtcblx0W2tleTogc3RyaW5nXTogb2JqZWN0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgcmVxdWlyZWQgZm9yIHRoZSBUaGVtZWQgbWl4aW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZWRQcm9wZXJ0aWVzPFQgPSBDbGFzc05hbWVzPiBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHRpbmplY3RlZFRoZW1lPzogYW55O1xuXHR0aGVtZT86IFRoZW1lO1xuXHRleHRyYUNsYXNzZXM/OiB7IFtQIGluIGtleW9mIFRdPzogc3RyaW5nIH07XG59XG5cbmNvbnN0IFRIRU1FX0tFWSA9ICcgX2tleSc7XG5cbmV4cG9ydCBjb25zdCBJTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgVGhlbWVkTWl4aW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZWRNaXhpbjxUID0gQ2xhc3NOYW1lcz4ge1xuXHR0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWU7XG5cdHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lW107XG5cdHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXM8VD47XG59XG5cbi8qKlxuICogRGVjb3JhdG9yIGZvciBiYXNlIGNzcyBjbGFzc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aGVtZSh0aGVtZToge30pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycsIHRoZW1lKTtcblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBjbGFzc2VzIFRoZSBiYXNlQ2xhc3NlcyBvYmplY3RcbiAqIEByZXF1aXJlc1xuICovXG5mdW5jdGlvbiBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoY2xhc3NlczogQ2xhc3NOYW1lc1tdKTogQ2xhc3NOYW1lcyB7XG5cdHJldHVybiBjbGFzc2VzLnJlZHVjZShcblx0XHQoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykgPT4ge1xuXHRcdFx0T2JqZWN0LmtleXMoYmFzZUNsYXNzKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjdXJyZW50Q2xhc3NOYW1lc1tiYXNlQ2xhc3Nba2V5XV0gPSBrZXk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjdXJyZW50Q2xhc3NOYW1lcztcblx0XHR9LFxuXHRcdDxDbGFzc05hbWVzPnt9XG5cdCk7XG59XG5cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBpcyBnaXZlbiBhIHRoZW1lIGFuZCBhbiBvcHRpb25hbCByZWdpc3RyeSwgdGhlIHRoZW1lXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxuICpcbiAqIEBwYXJhbSB0aGVtZSB0aGUgdGhlbWUgdG8gc2V0XG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXG4gKiB0byB0aGUgZ2xvYmFsIHJlZ2lzdHJ5XG4gKlxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lOiBhbnksIHRoZW1lUmVnaXN0cnk6IFJlZ2lzdHJ5KTogSW5qZWN0b3Ige1xuXHRjb25zdCB0aGVtZUluamVjdG9yID0gbmV3IEluamVjdG9yKHRoZW1lKTtcblx0dGhlbWVSZWdpc3RyeS5kZWZpbmVJbmplY3RvcihJTkpFQ1RFRF9USEVNRV9LRVksIHRoZW1lSW5qZWN0b3IpO1xuXHRyZXR1cm4gdGhlbWVJbmplY3Rvcjtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjbGFzcyBkZWNvcmF0ZWQgd2l0aCB3aXRoIFRoZW1lZCBmdW5jdGlvbmFsaXR5XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluPEUsIFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxXaWRnZXRCYXNlPFRoZW1lZFByb3BlcnRpZXM8RT4+Pj4oXG5cdEJhc2U6IFRcbik6IENvbnN0cnVjdG9yPFRoZW1lZE1peGluPEU+PiAmIFQge1xuXHRAaW5qZWN0KHtcblx0XHRuYW1lOiBJTkpFQ1RFRF9USEVNRV9LRVksXG5cdFx0Z2V0UHJvcGVydGllczogKHRoZW1lOiBUaGVtZSwgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllcyk6IFRoZW1lZFByb3BlcnRpZXMgPT4ge1xuXHRcdFx0aWYgKCFwcm9wZXJ0aWVzLnRoZW1lKSB7XG5cdFx0XHRcdHJldHVybiB7IHRoZW1lIH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fVxuXHR9KVxuXHRjbGFzcyBUaGVtZWQgZXh0ZW5kcyBCYXNlIHtcblx0XHRwdWJsaWMgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllczxFPjtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBUaGVtZWQgYmFzZUNsYXNzZXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lOiBDbGFzc05hbWVzO1xuXG5cdFx0LyoqXG5cdFx0ICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5czogc3RyaW5nW10gPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIFJldmVyc2UgbG9va3VwIG9mIHRoZSB0aGVtZSBjbGFzc2VzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXA6IENsYXNzTmFtZXM7XG5cblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgY2xhc3NlcyBtZXRhIGRhdGEgbmVlZCB0byBiZSBjYWxjdWxhdGVkLlxuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cblx0XHQvKipcblx0XHQgKiBMb2FkZWQgdGhlbWVcblx0XHQgKi9cblx0XHRwcml2YXRlIF90aGVtZTogQ2xhc3NOYW1lcyA9IHt9O1xuXG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWVbXTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lIHwgU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWUgfCBTdXBwb3J0ZWRDbGFzc05hbWVbXSB7XG5cdFx0XHRpZiAodGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzKSB7XG5cdFx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuXHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXAoKGNsYXNzTmFtZSkgPT4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWUpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cblx0XHQgKi9cblx0XHRAZGlmZlByb3BlcnR5KCd0aGVtZScsIHNoYWxsb3cpXG5cdFx0QGRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgc2hhbGxvdylcblx0XHRwcm90ZWN0ZWQgb25Qcm9wZXJ0aWVzQ2hhbmdlZCgpIHtcblx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWU6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZSB7XG5cdFx0XHRpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQgfHwgY2xhc3NOYW1lID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBjbGFzc05hbWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwgKHt9IGFzIGFueSk7XG5cdFx0XHRjb25zdCB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XG5cdFx0XHRsZXQgcmVzdWx0Q2xhc3NOYW1lczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGlmICghdGhlbWVDbGFzc05hbWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBDbGFzcyBuYW1lOiAnJHtjbGFzc05hbWV9JyBub3QgZm91bmQgaW4gdGhlbWVgKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSkge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKSB7XG5cdFx0XHRjb25zdCB7IHRoZW1lID0ge30gfSA9IHRoaXMucHJvcGVydGllcztcblx0XHRcdGNvbnN0IGJhc2VUaGVtZXMgPSB0aGlzLmdldERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycpO1xuXHRcdFx0aWYgKCF0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lKSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUgPSBiYXNlVGhlbWVzLnJlZHVjZSgoZmluYWxCYXNlVGhlbWUsIGJhc2VUaGVtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHsgW1RIRU1FX0tFWV06IGtleSwgLi4uY2xhc3NlcyB9ID0gYmFzZVRoZW1lO1xuXHRcdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5maW5hbEJhc2VUaGVtZSwgLi4uY2xhc3NlcyB9O1xuXHRcdFx0XHR9LCB7fSk7XG5cdFx0XHRcdHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZSgoYmFzZVRoZW1lLCB0aGVtZUtleSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4geyAuLi5iYXNlVGhlbWUsIC4uLnRoZW1lW3RoZW1lS2V5XSB9O1xuXHRcdFx0fSwge30pO1xuXG5cdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gVGhlbWVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUaGVtZWRNaXhpbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBUaGVtZWQudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IFByb2plY3Rvck1peGluIH0gZnJvbSAnLi9taXhpbnMvUHJvamVjdG9yJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICdAZG9qby9zaGltL2FycmF5JztcbmltcG9ydCB7IHcsIGRvbSB9IGZyb20gJy4vZCc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJ0Bkb2pvL3NoaW0vZ2xvYmFsJztcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL1JlZ2lzdHJ5JztcbmltcG9ydCB7IHJlZ2lzdGVyVGhlbWVJbmplY3RvciB9IGZyb20gJy4vbWl4aW5zL1RoZW1lZCc7XG5cbmV4cG9ydCBlbnVtIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUge1xuXHRET0pPID0gJ0RPSk8nLFxuXHROT0RFID0gJ05PREUnLFxuXHRURVhUID0gJ1RFWFQnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEb21Ub1dpZGdldFdyYXBwZXIoZG9tTm9kZTogSFRNTEVsZW1lbnQpOiBhbnkge1xuXHRyZXR1cm4gY2xhc3MgRG9tVG9XaWRnZXRXcmFwcGVyIGV4dGVuZHMgV2lkZ2V0QmFzZTxhbnk+IHtcblx0XHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdFx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcGVydGllcykucmVkdWNlKFxuXHRcdFx0XHQocHJvcHMsIGtleTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnByb3BlcnRpZXNba2V5XTtcblx0XHRcdFx0XHRpZiAoa2V5LmluZGV4T2YoJ29uJykgPT09IDApIHtcblx0XHRcdFx0XHRcdGtleSA9IGBfXyR7a2V5fWA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHByb3BzW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm4gcHJvcHM7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHt9IGFzIGFueVxuXHRcdFx0KTtcblx0XHRcdHJldHVybiBkb20oeyBub2RlOiBkb21Ob2RlLCBwcm9wczogcHJvcGVydGllcyB9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgZ2V0IGRvbU5vZGUoKSB7XG5cdFx0XHRyZXR1cm4gZG9tTm9kZTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoZGVzY3JpcHRvcjogYW55LCBXaWRnZXRDb25zdHJ1Y3RvcjogYW55KTogYW55IHtcblx0Y29uc3QgeyBhdHRyaWJ1dGVzLCBjaGlsZFR5cGUgfSA9IGRlc2NyaXB0b3I7XG5cdGNvbnN0IGF0dHJpYnV0ZU1hcDogYW55ID0ge307XG5cblx0YXR0cmlidXRlcy5mb3JFYWNoKChwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuXHRcdGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRhdHRyaWJ1dGVNYXBbYXR0cmlidXRlTmFtZV0gPSBwcm9wZXJ0eU5hbWU7XG5cdH0pO1xuXG5cdHJldHVybiBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0XHRwcml2YXRlIF9wcm9qZWN0b3I6IGFueTtcblx0XHRwcml2YXRlIF9wcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblx0XHRwcml2YXRlIF9jaGlsZHJlbjogYW55W10gPSBbXTtcblx0XHRwcml2YXRlIF9ldmVudFByb3BlcnRpZXM6IGFueSA9IHt9O1xuXHRcdHByaXZhdGUgX2luaXRpYWxpc2VkID0gZmFsc2U7XG5cblx0XHRwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRpZiAodGhpcy5faW5pdGlhbGlzZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBkb21Qcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblx0XHRcdGNvbnN0IHsgYXR0cmlidXRlcywgcHJvcGVydGllcywgZXZlbnRzIH0gPSBkZXNjcmlwdG9yO1xuXG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzID0geyAuLi50aGlzLl9wcm9wZXJ0aWVzLCAuLi50aGlzLl9hdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKGF0dHJpYnV0ZXMpIH07XG5cblx0XHRcdFsuLi5hdHRyaWJ1dGVzLCAuLi5wcm9wZXJ0aWVzXS5mb3JFYWNoKChwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9ICh0aGlzIGFzIGFueSlbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyZWRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJ19fJyk7XG5cdFx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcblx0XHRcdFx0XHRnZXQ6ICgpID0+IHRoaXMuX2dldFByb3BlcnR5KHByb3BlcnR5TmFtZSksXG5cdFx0XHRcdFx0c2V0OiAodmFsdWU6IGFueSkgPT4gdGhpcy5fc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSlcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXG5cdFx0XHRldmVudHMuZm9yRWFjaCgocHJvcGVydHlOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Y29uc3QgZXZlbnROYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICcnKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJlZFByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnX19vbicpO1xuXG5cdFx0XHRcdGRvbVByb3BlcnRpZXNbZmlsdGVyZWRQcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0XHRcdGdldDogKCkgPT4gdGhpcy5fZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuXHRcdFx0XHRcdHNldDogKHZhbHVlOiBhbnkpID0+IHRoaXMuX3NldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSlcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgZXZlbnRDYWxsYmFjayA9IHRoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGV2ZW50Q2FsbGJhY2soLi4uYXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRcdG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcblx0XHRcdFx0XHRcdFx0YnViYmxlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGRldGFpbDogYXJnc1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIGRvbVByb3BlcnRpZXMpO1xuXG5cdFx0XHRjb25zdCBjaGlsZHJlbiA9IGNoaWxkVHlwZSA9PT0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5URVhUID8gdGhpcy5jaGlsZE5vZGVzIDogdGhpcy5jaGlsZHJlbjtcblxuXHRcdFx0ZnJvbShjaGlsZHJlbikuZm9yRWFjaCgoY2hpbGROb2RlOiBOb2RlKSA9PiB7XG5cdFx0XHRcdGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xuXHRcdFx0XHRcdGNoaWxkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLXJlbmRlcicsICgpID0+IHRoaXMuX3JlbmRlcigpKTtcblx0XHRcdFx0XHRjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG5cdFx0XHRcdFx0dGhpcy5fY2hpbGRyZW4ucHVzaChEb21Ub1dpZGdldFdyYXBwZXIoY2hpbGROb2RlIGFzIEhUTUxFbGVtZW50KSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fY2hpbGRyZW4ucHVzaChkb20oeyBub2RlOiBjaGlsZE5vZGUgYXMgSFRNTEVsZW1lbnQgfSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsIChlOiBhbnkpID0+IHRoaXMuX2NoaWxkQ29ubmVjdGVkKGUpKTtcblxuXHRcdFx0Y29uc3Qgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMuX3Byb3BlcnRpZXM7XG5cdFx0XHRjb25zdCByZW5kZXJDaGlsZHJlbiA9ICgpID0+IHRoaXMuX19jaGlsZHJlbl9fKCk7XG5cdFx0XHRjb25zdCBXcmFwcGVyID0gY2xhc3MgZXh0ZW5kcyBXaWRnZXRCYXNlIHtcblx0XHRcdFx0cmVuZGVyKCkge1xuXHRcdFx0XHRcdHJldHVybiB3KFdpZGdldENvbnN0cnVjdG9yLCB3aWRnZXRQcm9wZXJ0aWVzLCByZW5kZXJDaGlsZHJlbigpKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG5cdFx0XHRjb25zdCB0aGVtZUNvbnRleHQgPSByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhpcy5fZ2V0VGhlbWUoKSwgcmVnaXN0cnkpO1xuXHRcdFx0Z2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tdGhlbWUtc2V0JywgKCkgPT4gdGhlbWVDb250ZXh0LnNldCh0aGlzLl9nZXRUaGVtZSgpKSk7XG5cdFx0XHRjb25zdCBQcm9qZWN0b3IgPSBQcm9qZWN0b3JNaXhpbihXcmFwcGVyKTtcblx0XHRcdHRoaXMuX3Byb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcblx0XHRcdHRoaXMuX3Byb2plY3Rvci5zZXRQcm9wZXJ0aWVzKHsgcmVnaXN0cnkgfSk7XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3IuYXBwZW5kKHRoaXMpO1xuXG5cdFx0XHR0aGlzLl9pbml0aWFsaXNlZCA9IHRydWU7XG5cdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoXG5cdFx0XHRcdG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1jb25uZWN0ZWQnLCB7XG5cdFx0XHRcdFx0YnViYmxlczogdHJ1ZSxcblx0XHRcdFx0XHRkZXRhaWw6IHRoaXNcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0VGhlbWUoKSB7XG5cdFx0XHRpZiAoZ2xvYmFsICYmIGdsb2JhbC5kb2pvY2UgJiYgZ2xvYmFsLmRvam9jZS50aGVtZSkge1xuXHRcdFx0XHRyZXR1cm4gZ2xvYmFsLmRvam9jZS50aGVtZXNbZ2xvYmFsLmRvam9jZS50aGVtZV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfY2hpbGRDb25uZWN0ZWQoZTogYW55KSB7XG5cdFx0XHRjb25zdCBub2RlID0gZS5kZXRhaWw7XG5cdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlID09PSB0aGlzKSB7XG5cdFx0XHRcdGNvbnN0IGV4aXN0cyA9IHRoaXMuX2NoaWxkcmVuLnNvbWUoKGNoaWxkKSA9PiBjaGlsZC5kb21Ob2RlID09PSBub2RlKTtcblx0XHRcdFx0aWYgKCFleGlzdHMpIHtcblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgKCkgPT4gdGhpcy5fcmVuZGVyKCkpO1xuXHRcdFx0XHRcdHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKG5vZGUpKTtcblx0XHRcdFx0XHR0aGlzLl9yZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX3JlbmRlcigpIHtcblx0XHRcdGlmICh0aGlzLl9wcm9qZWN0b3IpIHtcblx0XHRcdFx0dGhpcy5fcHJvamVjdG9yLmludmFsaWRhdGUoKTtcblx0XHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KFxuXHRcdFx0XHRcdG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1yZW5kZXInLCB7XG5cdFx0XHRcdFx0XHRidWJibGVzOiBmYWxzZSxcblx0XHRcdFx0XHRcdGRldGFpbDogdGhpc1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fcHJvcGVydGllc19fKCkge1xuXHRcdFx0cmV0dXJuIHsgLi4udGhpcy5fcHJvcGVydGllcywgLi4udGhpcy5fZXZlbnRQcm9wZXJ0aWVzIH07XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fY2hpbGRyZW5fXygpIHtcblx0XHRcdGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKChDaGlsZCkgPT4gQ2hpbGQuZG9tTm9kZS5pc1dpZGdldCkubWFwKChDaGlsZDogYW55KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgeyBkb21Ob2RlIH0gPSBDaGlsZDtcblx0XHRcdFx0XHRyZXR1cm4gdyhDaGlsZCwgeyAuLi5kb21Ob2RlLl9fcHJvcGVydGllc19fKCkgfSwgWy4uLmRvbU5vZGUuX19jaGlsZHJlbl9fKCldKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2hpbGRyZW47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHVibGljIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCB2YWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTWFwW25hbWVdO1xuXHRcdFx0dGhpcy5fc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuXHRcdFx0dGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRwcml2YXRlIF9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfc2V0UHJvcGVydHkocHJvcGVydHlOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcblx0XHRcdHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0dGhpcy5fcmVuZGVyKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfYXR0cmlidXRlc1RvUHJvcGVydGllcyhhdHRyaWJ1dGVzOiBzdHJpbmdbXSkge1xuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXMucmVkdWNlKChwcm9wZXJ0aWVzOiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdFx0XHR9LCB7fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlTWFwKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0IGlzV2lkZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoV2lkZ2V0Q29uc3RydWN0b3I6IGFueSk6IHZvaWQge1xuXHRjb25zdCBkZXNjcmlwdG9yID0gV2lkZ2V0Q29uc3RydWN0b3IucHJvdG90eXBlICYmIFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xuXG5cdGlmICghZGVzY3JpcHRvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdCdDYW5ub3QgZ2V0IGRlc2NyaXB0b3IgZm9yIEN1c3RvbSBFbGVtZW50LCBoYXZlIHlvdSBhZGRlZCB0aGUgQGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yIHRvIHlvdXIgV2lkZ2V0Pydcblx0XHQpO1xuXHR9XG5cblx0Z2xvYmFsLmN1c3RvbUVsZW1lbnRzLmRlZmluZShkZXNjcmlwdG9yLnRhZ05hbWUsIGNyZWF0ZShkZXNjcmlwdG9yLCBXaWRnZXRDb25zdHJ1Y3RvcikpO1xufVxuXG5leHBvcnQgZGVmYXVsdCByZWdpc3RlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyByZWdpc3RlckN1c3RvbUVsZW1lbnQudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJ0Bkb2pvL3NoaW0vZ2xvYmFsJztcbmltcG9ydCB7XG5cdENvcmVQcm9wZXJ0aWVzLFxuXHREZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0RE5vZGUsXG5cdFZOb2RlLFxuXHRXTm9kZSxcblx0UHJvamVjdGlvbk9wdGlvbnMsXG5cdFByb2plY3Rpb24sXG5cdFN1cHBvcnRlZENsYXNzTmFtZSxcblx0VHJhbnNpdGlvblN0cmF0ZWd5LFxuXHRWTm9kZVByb3BlcnRpZXNcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGZyb20gYXMgYXJyYXlGcm9tIH0gZnJvbSAnQGRvam8vc2hpbS9hcnJheSc7XG5pbXBvcnQgeyBpc1dOb2RlLCBpc1ZOb2RlLCBWTk9ERSwgV05PREUgfSBmcm9tICcuL2QnO1xuaW1wb3J0IHsgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmltcG9ydCBXZWFrTWFwIGZyb20gJ0Bkb2pvL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgTm9kZUhhbmRsZXIgZnJvbSAnLi9Ob2RlSGFuZGxlcic7XG5pbXBvcnQgUmVnaXN0cnlIYW5kbGVyIGZyb20gJy4vUmVnaXN0cnlIYW5kbGVyJztcblxuY29uc3QgTkFNRVNQQUNFX1czID0gJ2h0dHA6Ly93d3cudzMub3JnLyc7XG5jb25zdCBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcbmNvbnN0IE5BTUVTUEFDRV9YTElOSyA9IE5BTUVTUEFDRV9XMyArICcxOTk5L3hsaW5rJztcblxuY29uc3QgZW1wdHlBcnJheTogKEludGVybmFsV05vZGUgfCBJbnRlcm5hbFZOb2RlKVtdID0gW107XG5cbmV4cG9ydCB0eXBlIFJlbmRlclJlc3VsdCA9IEROb2RlPGFueT4gfCBETm9kZTxhbnk+W107XG5cbmludGVyZmFjZSBJbnN0YW5jZU1hcERhdGEge1xuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZTtcblx0ZG5vZGU6IEludGVybmFsV05vZGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxXTm9kZSBleHRlbmRzIFdOb2RlPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPiB7XG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIHdpZGdldFxuXHQgKi9cblx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVuZGVyZWQgRE5vZGVzIGZyb20gdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRyZW5kZXJlZDogSW50ZXJuYWxETm9kZVtdO1xuXG5cdC8qKlxuXHQgKiBDb3JlIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBieSB0aGUgd2lkZ2V0IGNvcmUgc3lzdGVtXG5cdCAqL1xuXHRjb3JlUHJvcGVydGllczogQ29yZVByb3BlcnRpZXM7XG5cblx0LyoqXG5cdCAqIENoaWxkcmVuIGZvciB0aGUgV05vZGVcblx0ICovXG5cdGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxWTm9kZSBleHRlbmRzIFZOb2RlIHtcblx0LyoqXG5cdCAqIENoaWxkcmVuIGZvciB0aGUgVk5vZGVcblx0ICovXG5cdGNoaWxkcmVuPzogSW50ZXJuYWxETm9kZVtdO1xuXG5cdGluc2VydGVkPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQmFnIHVzZWQgdG8gc3RpbGwgZGVjb3JhdGUgcHJvcGVydGllcyBvbiBhIGRlZmVycmVkIHByb3BlcnRpZXMgY2FsbGJhY2tcblx0ICovXG5cdGRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcz86IFZOb2RlUHJvcGVydGllcztcblxuXHQvKipcblx0ICogRE9NIGVsZW1lbnRcblx0ICovXG5cdGRvbU5vZGU/OiBFbGVtZW50IHwgVGV4dDtcbn1cblxuZXhwb3J0IHR5cGUgSW50ZXJuYWxETm9kZSA9IEludGVybmFsVk5vZGUgfCBJbnRlcm5hbFdOb2RlO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclF1ZXVlIHtcblx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlO1xuXHRkZXB0aDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdpZGdldERhdGEge1xuXHRvbkRldGFjaDogKCkgPT4gdm9pZDtcblx0b25BdHRhY2g6ICgpID0+IHZvaWQ7XG5cdGRpcnR5OiBib29sZWFuO1xuXHRyZWdpc3RyeTogKCkgPT4gUmVnaXN0cnlIYW5kbGVyO1xuXHRub2RlSGFuZGxlcjogTm9kZUhhbmRsZXI7XG5cdGNvcmVQcm9wZXJ0aWVzOiBDb3JlUHJvcGVydGllcztcblx0aW52YWxpZGF0ZT86IEZ1bmN0aW9uO1xuXHRyZW5kZXJpbmc6IGJvb2xlYW47XG5cdGlucHV0UHJvcGVydGllczogYW55O1xufVxuXG5leHBvcnQgY29uc3Qgd2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcDxhbnksIFdpZGdldERhdGE+KCk7XG5cbmNvbnN0IGluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXA8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIEluc3RhbmNlTWFwRGF0YT4oKTtcbmNvbnN0IHJlbmRlclF1ZXVlTWFwID0gbmV3IFdlYWtNYXA8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIFJlbmRlclF1ZXVlW10+KCk7XG5cbmZ1bmN0aW9uIHNhbWUoZG5vZGUxOiBJbnRlcm5hbEROb2RlLCBkbm9kZTI6IEludGVybmFsRE5vZGUpIHtcblx0aWYgKGlzVk5vZGUoZG5vZGUxKSAmJiBpc1ZOb2RlKGRub2RlMikpIHtcblx0XHRpZiAoZG5vZGUxLnRhZyAhPT0gZG5vZGUyLnRhZykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZSBpZiAoaXNXTm9kZShkbm9kZTEpICYmIGlzV05vZGUoZG5vZGUyKSkge1xuXHRcdGlmIChkbm9kZTEud2lkZ2V0Q29uc3RydWN0b3IgIT09IGRub2RlMi53aWRnZXRDb25zdHJ1Y3Rvcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBtaXNzaW5nVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGUgYSB0cmFuc2l0aW9ucyBvYmplY3QgdG8gdGhlIHByb2plY3Rpb25PcHRpb25zIHRvIGRvIGFuaW1hdGlvbnMnKTtcbn07XG5cbmZ1bmN0aW9uIGdldFByb2plY3Rpb25PcHRpb25zKFxuXHRwcm9qZWN0b3JPcHRpb25zOiBQYXJ0aWFsPFByb2plY3Rpb25PcHRpb25zPixcblx0cHJvamVjdG9ySW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pOiBQcm9qZWN0aW9uT3B0aW9ucyB7XG5cdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuXHRcdHN0eWxlQXBwbHllcjogZnVuY3Rpb24oZG9tTm9kZTogSFRNTEVsZW1lbnQsIHN0eWxlTmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0XHQoZG9tTm9kZS5zdHlsZSBhcyBhbnkpW3N0eWxlTmFtZV0gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdHRyYW5zaXRpb25zOiB7XG5cdFx0XHRlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXG5cdFx0XHRleGl0OiBtaXNzaW5nVHJhbnNpdGlvblxuXHRcdH0sXG5cdFx0ZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxuXHRcdGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcblx0XHRub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxuXHRcdGRlcHRoOiAwLFxuXHRcdG1lcmdlOiBmYWxzZSxcblx0XHRyZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcblx0XHRyZW5kZXJRdWV1ZTogW10sXG5cdFx0cHJvamVjdG9ySW5zdGFuY2Vcblx0fTtcblx0cmV0dXJuIHsgLi4uZGVmYXVsdHMsIC4uLnByb2plY3Rvck9wdGlvbnMgfSBhcyBQcm9qZWN0aW9uT3B0aW9ucztcbn1cblxuZnVuY3Rpb24gY2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWU6IE9iamVjdCkge1xuXHRpZiAodHlwZW9mIHN0eWxlVmFsdWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlRXZlbnQoXG5cdGRvbU5vZGU6IE5vZGUsXG5cdGV2ZW50TmFtZTogc3RyaW5nLFxuXHRjdXJyZW50VmFsdWU6IEZ1bmN0aW9uLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdGJpbmQ6IGFueSxcblx0cHJldmlvdXNWYWx1ZT86IEZ1bmN0aW9uXG4pIHtcblx0Y29uc3QgZXZlbnRNYXAgPSBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLmdldChkb21Ob2RlKSB8fCBuZXcgV2Vha01hcCgpO1xuXG5cdGlmIChwcmV2aW91c1ZhbHVlKSB7XG5cdFx0Y29uc3QgcHJldmlvdXNFdmVudCA9IGV2ZW50TWFwLmdldChwcmV2aW91c1ZhbHVlKTtcblx0XHRkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcmV2aW91c0V2ZW50KTtcblx0fVxuXG5cdGxldCBjYWxsYmFjayA9IGN1cnJlbnRWYWx1ZS5iaW5kKGJpbmQpO1xuXG5cdGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcblx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKHRoaXM6IGFueSwgZXZ0OiBFdmVudCkge1xuXHRcdFx0Y3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcblx0XHRcdChldnQudGFyZ2V0IGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IChldnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXHRcdH0uYmluZChiaW5kKTtcblx0fVxuXG5cdGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcblx0ZXZlbnRNYXAuc2V0KGN1cnJlbnRWYWx1ZSwgY2FsbGJhY2spO1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XG59XG5cbmZ1bmN0aW9uIGFkZENsYXNzZXMoZG9tTm9kZTogRWxlbWVudCwgY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKSB7XG5cdGlmIChjbGFzc2VzKSB7XG5cdFx0Y29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRvbU5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzW2ldKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlOiBFbGVtZW50LCBjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpIHtcblx0aWYgKGNsYXNzZXMpIHtcblx0XHRjb25zdCBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlOiBhbnksIHByZXZpb3VzOiBJbnRlcm5hbFZOb2RlLCBjdXJyZW50OiBJbnRlcm5hbFZOb2RlKSB7XG5cdGNvbnN0IHsgZGlmZlR5cGUsIHByb3BlcnRpZXMsIGF0dHJpYnV0ZXMgfSA9IGN1cnJlbnQ7XG5cdGlmICghZGlmZlR5cGUgfHwgZGlmZlR5cGUgPT09ICd2ZG9tJykge1xuXHRcdHJldHVybiB7IHByb3BlcnRpZXM6IHByZXZpb3VzLnByb3BlcnRpZXMsIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XG5cdH0gZWxzZSBpZiAoZGlmZlR5cGUgPT09ICdub25lJykge1xuXHRcdHJldHVybiB7IHByb3BlcnRpZXM6IHt9LCBhdHRyaWJ1dGVzOiBwcmV2aW91cy5hdHRyaWJ1dGVzID8ge30gOiB1bmRlZmluZWQsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XG5cdH1cblx0bGV0IG5ld1Byb3BlcnRpZXM6IGFueSA9IHtcblx0XHRwcm9wZXJ0aWVzOiB7fVxuXHR9O1xuXHRpZiAoYXR0cmlidXRlcykge1xuXHRcdG5ld1Byb3BlcnRpZXMuYXR0cmlidXRlcyA9IHt9O1xuXHRcdG5ld1Byb3BlcnRpZXMuZXZlbnRzID0gcHJldmlvdXMuZXZlbnRzO1xuXHRcdE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXNbcHJvcE5hbWVdID0gZG9tTm9kZVtwcm9wTmFtZV07XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaCgoYXR0ck5hbWUpID0+IHtcblx0XHRcdG5ld1Byb3BlcnRpZXMuYXR0cmlidXRlc1thdHRyTmFtZV0gPSBkb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld1Byb3BlcnRpZXM7XG5cdH1cblx0bmV3UHJvcGVydGllcy5wcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcykucmVkdWNlKFxuXHRcdChwcm9wcywgcHJvcGVydHkpID0+IHtcblx0XHRcdHByb3BzW3Byb3BlcnR5XSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKHByb3BlcnR5KSB8fCBkb21Ob2RlW3Byb3BlcnR5XTtcblx0XHRcdHJldHVybiBwcm9wcztcblx0XHR9LFxuXHRcdHt9IGFzIGFueVxuXHQpO1xuXHRyZXR1cm4gbmV3UHJvcGVydGllcztcbn1cblxuZnVuY3Rpb24gZm9jdXNOb2RlKHByb3BWYWx1ZTogYW55LCBwcmV2aW91c1ZhbHVlOiBhbnksIGRvbU5vZGU6IEVsZW1lbnQsIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyk6IHZvaWQge1xuXHRsZXQgcmVzdWx0O1xuXHRpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJlc3VsdCA9IHByb3BWYWx1ZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9IHByb3BWYWx1ZSAmJiAhcHJldmlvdXNWYWx1ZTtcblx0fVxuXHRpZiAocmVzdWx0ID09PSB0cnVlKSB7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCkuZm9jdXMoKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVPcnBoYW5lZEV2ZW50cyhcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0cHJldmlvdXNQcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRvbmx5RXZlbnRzOiBib29sZWFuID0gZmFsc2Vcbikge1xuXHRjb25zdCBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpO1xuXHRpZiAoZXZlbnRNYXApIHtcblx0XHRPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnRpZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRjb25zdCBpc0V2ZW50ID0gcHJvcE5hbWUuc3Vic3RyKDAsIDIpID09PSAnb24nIHx8IG9ubHlFdmVudHM7XG5cdFx0XHRjb25zdCBldmVudE5hbWUgPSBvbmx5RXZlbnRzID8gcHJvcE5hbWUgOiBwcm9wTmFtZS5zdWJzdHIoMik7XG5cdFx0XHRpZiAoaXNFdmVudCAmJiAhcHJvcGVydGllc1twcm9wTmFtZV0pIHtcblx0XHRcdFx0Y29uc3QgZXZlbnRDYWxsYmFjayA9IGV2ZW50TWFwLmdldChwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdKTtcblx0XHRcdFx0aWYgKGV2ZW50Q2FsbGJhY2spIHtcblx0XHRcdFx0XHRkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlOiBFbGVtZW50LCBhdHRyTmFtZTogc3RyaW5nLCBhdHRyVmFsdWU6IHN0cmluZywgcHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgYXR0ck5hbWUgPT09ICdocmVmJykge1xuXHRcdGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcblx0fSBlbHNlIGlmICgoYXR0ck5hbWUgPT09ICdyb2xlJyAmJiBhdHRyVmFsdWUgPT09ICcnKSB8fCBhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdGRvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcblx0fSBlbHNlIHtcblx0XHRkb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGVzKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRwcmV2aW91c0F0dHJpYnV0ZXM6IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfSxcblx0YXR0cmlidXRlczogeyBbaW5kZXg6IHN0cmluZ106IHN0cmluZyB9LFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRjb25zdCBhdHRyTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcblx0Y29uc3QgYXR0ckNvdW50ID0gYXR0ck5hbWVzLmxlbmd0aDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IGF0dHJOYW1lID0gYXR0ck5hbWVzW2ldO1xuXHRcdGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xuXHRcdGNvbnN0IHByZXZpb3VzQXR0clZhbHVlID0gcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJOYW1lXTtcblx0XHRpZiAoYXR0clZhbHVlICE9PSBwcmV2aW91c0F0dHJWYWx1ZSkge1xuXHRcdFx0dXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0cHJldmlvdXNQcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPSB0cnVlXG4pIHtcblx0bGV0IHByb3BlcnRpZXNVcGRhdGVkID0gZmFsc2U7XG5cdGNvbnN0IHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRjb25zdCBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xuXHRpZiAocHJvcE5hbWVzLmluZGV4T2YoJ2NsYXNzZXMnKSA9PT0gLTEgJiYgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3NlcykpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlc1tpXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpO1xuXHRcdH1cblx0fVxuXG5cdGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcyAmJiByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XG5cdFx0Y29uc3QgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XG5cdFx0bGV0IHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xuXHRcdGNvbnN0IHByZXZpb3VzVmFsdWUgPSBwcmV2aW91c1Byb3BlcnRpZXMhW3Byb3BOYW1lXTtcblx0XHRpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xuXHRcdFx0Y29uc3QgcHJldmlvdXNDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcmV2aW91c1ZhbHVlKSA/IHByZXZpb3VzVmFsdWUgOiBbcHJldmlvdXNWYWx1ZV07XG5cdFx0XHRjb25zdCBjdXJyZW50Q2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSA/IHByb3BWYWx1ZSA6IFtwcm9wVmFsdWVdO1xuXHRcdFx0aWYgKHByZXZpb3VzQ2xhc3NlcyAmJiBwcmV2aW91c0NsYXNzZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAoIXByb3BWYWx1ZSB8fCBwcm9wVmFsdWUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc2VzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgbmV3Q2xhc3NlczogKG51bGwgfCB1bmRlZmluZWQgfCBzdHJpbmcpW10gPSBbLi4uY3VycmVudENsYXNzZXNdO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBwcmV2aW91c0NsYXNzTmFtZSA9IHByZXZpb3VzQ2xhc3Nlc1tpXTtcblx0XHRcdFx0XHRcdGlmIChwcmV2aW91c0NsYXNzTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjbGFzc0luZGV4ID0gbmV3Q2xhc3Nlcy5pbmRleE9mKHByZXZpb3VzQ2xhc3NOYW1lKTtcblx0XHRcdFx0XHRcdFx0aWYgKGNsYXNzSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzTmFtZSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bmV3Q2xhc3Nlcy5zcGxpY2UoY2xhc3NJbmRleCwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuZXdDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIG5ld0NsYXNzZXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2ZvY3VzJykge1xuXHRcdFx0Zm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XG5cdFx0XHRjb25zdCBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcblx0XHRcdGNvbnN0IHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVDb3VudDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XG5cdFx0XHRcdGNvbnN0IG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0Y29uc3Qgb2xkU3R5bGVWYWx1ZSA9IHByZXZpb3VzVmFsdWUgJiYgcHJldmlvdXNWYWx1ZVtzdHlsZU5hbWVdO1xuXHRcdFx0XHRpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKG5ld1N0eWxlVmFsdWUpIHtcblx0XHRcdFx0XHRjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyIShkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBzdHlsZU5hbWUsIG5ld1N0eWxlVmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFwcm9wVmFsdWUgJiYgdHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHByb3BWYWx1ZSA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XG5cdFx0XHRcdGNvbnN0IGRvbVZhbHVlID0gKGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV07XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXG5cdFx0XHRcdFx0KChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXVxuXHRcdFx0XHRcdFx0PyBkb21WYWx1ZSA9PT0gKGRvbU5vZGUgYXMgYW55KVsnb25pbnB1dC12YWx1ZSddXG5cdFx0XHRcdFx0XHQ6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgIT09ICdrZXknICYmIHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xuXHRcdFx0XHRjb25zdCB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDAgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0dXBkYXRlRXZlbnQoXG5cdFx0XHRcdFx0XHRkb21Ob2RlLFxuXHRcdFx0XHRcdFx0cHJvcE5hbWUuc3Vic3RyKDIpLFxuXHRcdFx0XHRcdFx0cHJvcFZhbHVlLFxuXHRcdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMsXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzLmJpbmQsXG5cdFx0XHRcdFx0XHRwcmV2aW91c1ZhbHVlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0dXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3Njcm9sbExlZnQnIHx8IHByb3BOYW1lID09PSAnc2Nyb2xsVG9wJykge1xuXHRcdFx0XHRcdGlmICgoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSAhPT0gcHJvcFZhbHVlKSB7XG5cdFx0XHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcHJvcGVydGllc1VwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mQ2hpbGQoY2hpbGRyZW46IEludGVybmFsRE5vZGVbXSwgc2FtZUFzOiBJbnRlcm5hbEROb2RlLCBzdGFydDogbnVtYmVyKSB7XG5cdGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHNhbWUoY2hpbGRyZW5baV0sIHNhbWVBcykpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1BhcmVudFZOb2RlKGRvbU5vZGU6IEVsZW1lbnQpOiBJbnRlcm5hbFZOb2RlIHtcblx0cmV0dXJuIHtcblx0XHR0YWc6ICcnLFxuXHRcdHByb3BlcnRpZXM6IHt9LFxuXHRcdGNoaWxkcmVuOiB1bmRlZmluZWQsXG5cdFx0ZG9tTm9kZSxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9UZXh0Vk5vZGUoZGF0YTogYW55KTogSW50ZXJuYWxWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRjaGlsZHJlbjogdW5kZWZpbmVkLFxuXHRcdHRleHQ6IGAke2RhdGF9YCxcblx0XHRkb21Ob2RlOiB1bmRlZmluZWQsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuZnVuY3Rpb24gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSwgaW5zdGFuY2VEYXRhOiBXaWRnZXREYXRhKTogSW50ZXJuYWxXTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0aW5zdGFuY2UsXG5cdFx0cmVuZGVyZWQ6IFtdLFxuXHRcdGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXG5cdFx0Y2hpbGRyZW46IGluc3RhbmNlLmNoaWxkcmVuIGFzIGFueSxcblx0XHR3aWRnZXRDb25zdHJ1Y3RvcjogaW5zdGFuY2UuY29uc3RydWN0b3IgYXMgYW55LFxuXHRcdHByb3BlcnRpZXM6IGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMsXG5cdFx0dHlwZTogV05PREVcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oXG5cdGNoaWxkcmVuOiB1bmRlZmluZWQgfCBETm9kZSB8IEROb2RlW10sXG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZVxuKTogSW50ZXJuYWxETm9kZVtdIHtcblx0aWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gZW1wdHlBcnJheTtcblx0fVxuXHRjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyApIHtcblx0XHRjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldIGFzIEludGVybmFsRE5vZGU7XG5cdFx0aWYgKGNoaWxkID09PSB1bmRlZmluZWQgfHwgY2hpbGQgPT09IG51bGwpIHtcblx0XHRcdGNoaWxkcmVuLnNwbGljZShpLCAxKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xuXHRcdFx0Y2hpbGRyZW5baV0gPSB0b1RleHRWTm9kZShjaGlsZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRpZiAoY2hpbGQucHJvcGVydGllcy5iaW5kID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQoY2hpbGQucHJvcGVydGllcyBhcyBhbnkpLmJpbmQgPSBpbnN0YW5jZTtcblx0XHRcdFx0XHRpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFjaGlsZC5jb3JlUHJvcGVydGllcykge1xuXHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0XHRcdGNoaWxkLmNvcmVQcm9wZXJ0aWVzID0ge1xuXHRcdFx0XHRcdFx0YmluZDogaW5zdGFuY2UsXG5cdFx0XHRcdFx0XHRiYXNlUmVnaXN0cnk6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnlcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGkrKztcblx0fVxuXHRyZXR1cm4gY2hpbGRyZW4gYXMgSW50ZXJuYWxETm9kZVtdO1xufVxuXG5mdW5jdGlvbiBub2RlQWRkZWQoZG5vZGU6IEludGVybmFsRE5vZGUsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uU3RyYXRlZ3kpIHtcblx0aWYgKGlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcblx0XHRjb25zdCBlbnRlckFuaW1hdGlvbiA9IGRub2RlLnByb3BlcnRpZXMuZW50ZXJBbmltYXRpb247XG5cdFx0aWYgKGVudGVyQW5pbWF0aW9uKSB7XG5cdFx0XHRpZiAodHlwZW9mIGVudGVyQW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGVudGVyQW5pbWF0aW9uKGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgZG5vZGUucHJvcGVydGllcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmFuc2l0aW9ucy5lbnRlcihkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uIGFzIHN0cmluZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGNhbGxPbkRldGFjaChkTm9kZXM6IEludGVybmFsRE5vZGUgfCBJbnRlcm5hbEROb2RlW10sIHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSk6IHZvaWQge1xuXHRkTm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBkTm9kZXMgOiBbZE5vZGVzXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBkTm9kZSA9IGROb2Rlc1tpXTtcblx0XHRpZiAoaXNXTm9kZShkTm9kZSkpIHtcblx0XHRcdGlmIChkTm9kZS5yZW5kZXJlZCkge1xuXHRcdFx0XHRjYWxsT25EZXRhY2goZE5vZGUucmVuZGVyZWQsIGROb2RlLmluc3RhbmNlKTtcblx0XHRcdH1cblx0XHRcdGlmIChkTm9kZS5pbnN0YW5jZSkge1xuXHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpITtcblx0XHRcdFx0aW5zdGFuY2VEYXRhLm9uRGV0YWNoKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkTm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRjYWxsT25EZXRhY2goZE5vZGUuY2hpbGRyZW4gYXMgSW50ZXJuYWxETm9kZVtdLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG5vZGVUb1JlbW92ZShkbm9kZTogSW50ZXJuYWxETm9kZSwgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25TdHJhdGVneSwgcHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChpc1dOb2RlKGRub2RlKSkge1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gZG5vZGUucmVuZGVyZWQgfHwgZW1wdHlBcnJheTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBjaGlsZCA9IHJlbmRlcmVkW2ldO1xuXHRcdFx0aWYgKGlzVk5vZGUoY2hpbGQpKSB7XG5cdFx0XHRcdGNoaWxkLmRvbU5vZGUhLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKGNoaWxkLmRvbU5vZGUhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVUb1JlbW92ZShjaGlsZCwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGU7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IGRub2RlLnByb3BlcnRpZXM7XG5cdFx0Y29uc3QgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcblx0XHRpZiAocHJvcGVydGllcyAmJiBleGl0QW5pbWF0aW9uKSB7XG5cdFx0XHQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCkuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblx0XHRcdGNvbnN0IHJlbW92ZURvbU5vZGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0eXBlb2YgZXhpdEFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRleGl0QW5pbWF0aW9uKGRvbU5vZGUgYXMgRWxlbWVudCwgcmVtb3ZlRG9tTm9kZSwgcHJvcGVydGllcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zLmV4aXQoZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uIGFzIHN0cmluZywgcmVtb3ZlRG9tTm9kZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKFxuXHRjaGlsZE5vZGVzOiBJbnRlcm5hbEROb2RlW10sXG5cdGluZGV4VG9DaGVjazogbnVtYmVyLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRjb25zdCBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XG5cdGlmIChpc1ZOb2RlKGNoaWxkTm9kZSkgJiYgIWNoaWxkTm9kZS50YWcpIHtcblx0XHRyZXR1cm47IC8vIFRleHQgbm9kZXMgbmVlZCBub3QgYmUgZGlzdGluZ3Vpc2hhYmxlXG5cdH1cblx0Y29uc3QgeyBrZXkgfSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xuXG5cdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcblx0XHRcdFx0Y29uc3Qgbm9kZSA9IGNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdGlmIChzYW1lKG5vZGUsIGNoaWxkTm9kZSkpIHtcblx0XHRcdFx0XHRsZXQgbm9kZUlkZW50aWZpZXI6IHN0cmluZztcblx0XHRcdFx0XHRjb25zdCBwYXJlbnROYW1lID0gKHBhcmVudEluc3RhbmNlIGFzIGFueSkuY29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XG5cdFx0XHRcdFx0aWYgKGlzV05vZGUoY2hpbGROb2RlKSkge1xuXHRcdFx0XHRcdFx0bm9kZUlkZW50aWZpZXIgPSAoY2hpbGROb2RlLndpZGdldENvbnN0cnVjdG9yIGFzIGFueSkubmFtZSB8fCAndW5rbm93bic7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLnRhZztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XHRgQSB3aWRnZXQgKCR7cGFyZW50TmFtZX0pIGhhcyBoYWQgYSBjaGlsZCBhZGRkZWQgb3IgcmVtb3ZlZCwgYnV0IHRoZXkgd2VyZSBub3QgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmaWVkLiBJdCBpcyByZWNvbW1lbmRlZCB0byBwcm92aWRlIGEgdW5pcXVlICdrZXknIHByb3BlcnR5IHdoZW4gdXNpbmcgdGhlIHNhbWUgd2lkZ2V0IG9yIGVsZW1lbnQgKCR7bm9kZUlkZW50aWZpZXJ9KSBtdWx0aXBsZSB0aW1lcyBhcyBzaWJsaW5nc2Bcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0b2xkQ2hpbGRyZW46IEludGVybmFsRE5vZGVbXSxcblx0bmV3Q2hpbGRyZW46IEludGVybmFsRE5vZGVbXSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRvbGRDaGlsZHJlbiA9IG9sZENoaWxkcmVuIHx8IGVtcHR5QXJyYXk7XG5cdG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XG5cdGNvbnN0IG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xuXHRjb25zdCBuZXdDaGlsZHJlbkxlbmd0aCA9IG5ld0NoaWxkcmVuLmxlbmd0aDtcblx0Y29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucyE7XG5cdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9O1xuXHRsZXQgb2xkSW5kZXggPSAwO1xuXHRsZXQgbmV3SW5kZXggPSAwO1xuXHRsZXQgaTogbnVtYmVyO1xuXHRsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcblx0d2hpbGUgKG5ld0luZGV4IDwgbmV3Q2hpbGRyZW5MZW5ndGgpIHtcblx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltuZXdJbmRleF07XG5cdFx0aWYgKGlzVk5vZGUobmV3Q2hpbGQpICYmIHR5cGVvZiBuZXdDaGlsZC5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0bmV3Q2hpbGQuaW5zZXJ0ZWQgPSBpc1ZOb2RlKG9sZENoaWxkKSAmJiBvbGRDaGlsZC5pbnNlcnRlZDtcblx0XHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH1cblx0XHRpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcblx0XHRcdHRleHRVcGRhdGVkID0gdXBkYXRlRG9tKG9sZENoaWxkLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHwgdGV4dFVwZGF0ZWQ7XG5cdFx0XHRvbGRJbmRleCsrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmaW5kT2xkSW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG9sZENoaWxkcmVuLCBuZXdDaGlsZCwgb2xkSW5kZXggKyAxKTtcblx0XHRcdGlmIChmaW5kT2xkSW5kZXggPj0gMCkge1xuXHRcdFx0XHRmb3IgKGkgPSBvbGRJbmRleDsgaSA8IGZpbmRPbGRJbmRleDsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkQ2hpbGQgPSBvbGRDaGlsZHJlbltpXTtcblx0XHRcdFx0XHRjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdFx0XHRjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0bm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRleHRVcGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVEb20ob2xkQ2hpbGRyZW5bZmluZE9sZEluZGV4XSwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8XG5cdFx0XHRcdFx0dGV4dFVwZGF0ZWQ7XG5cdFx0XHRcdG9sZEluZGV4ID0gZmluZE9sZEluZGV4ICsgMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpbnNlcnRCZWZvcmU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRsZXQgY2hpbGQ6IEludGVybmFsRE5vZGUgPSBvbGRDaGlsZHJlbltvbGRJbmRleF07XG5cdFx0XHRcdGlmIChjaGlsZCkge1xuXHRcdFx0XHRcdGxldCBuZXh0SW5kZXggPSBvbGRJbmRleCArIDE7XG5cdFx0XHRcdFx0d2hpbGUgKGluc2VydEJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXNXTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNoaWxkLnJlbmRlcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5yZW5kZXJlZFswXTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGQgPSBvbGRDaGlsZHJlbltuZXh0SW5kZXhdO1xuXHRcdFx0XHRcdFx0XHRcdG5leHRJbmRleCsrO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbnNlcnRCZWZvcmUgPSBjaGlsZC5kb21Ob2RlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNyZWF0ZURvbShuZXdDaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0bm9kZUFkZGVkKG5ld0NoaWxkLCB0cmFuc2l0aW9ucyk7XG5cdFx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IG5ld0luZGV4O1xuXHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdFx0XHRjaGVja0Rpc3Rpbmd1aXNoYWJsZShuZXdDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRuZXdJbmRleCsrO1xuXHR9XG5cdGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XG5cdFx0Ly8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xuXHRcdGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qgb2xkQ2hpbGQgPSBvbGRDaGlsZHJlbltpXTtcblx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IGk7XG5cdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdH0pO1xuXHRcdFx0bm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIGFkZENoaWxkcmVuKFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0Y2hpbGRyZW46IEludGVybmFsRE5vZGVbXSB8IHVuZGVmaW5lZCxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG5cdGNoaWxkTm9kZXM/OiAoRWxlbWVudCB8IFRleHQpW11cbikge1xuXHRpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzID09PSB1bmRlZmluZWQpIHtcblx0XHRjaGlsZE5vZGVzID0gYXJyYXlGcm9tKHBhcmVudFZOb2RlLmRvbU5vZGUhLmNoaWxkTm9kZXMpIGFzIChFbGVtZW50IHwgVGV4dClbXTtcblx0fVxuXG5cdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9O1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG5cdFx0aWYgKGlzVk5vZGUoY2hpbGQpKSB7XG5cdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgY2hpbGROb2Rlcykge1xuXHRcdFx0XHRsZXQgZG9tRWxlbWVudDogRWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0d2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRkb21FbGVtZW50ID0gY2hpbGROb2Rlcy5zaGlmdCgpIGFzIEVsZW1lbnQ7XG5cdFx0XHRcdFx0aWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xuXHRcdFx0XHRcdFx0Y2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0ZG5vZGU6IEludGVybmFsVk5vZGUsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0YWRkQ2hpbGRyZW4oZG5vZGUsIGRub2RlLmNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIHVuZGVmaW5lZCk7XG5cdGlmICh0eXBlb2YgZG5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgZG5vZGUuaW5zZXJ0ZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG5cblx0aWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XG5cdFx0dXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCB7fSwgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSk7XG5cdFx0cmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwge30sIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xuXHRcdGNvbnN0IGV2ZW50cyA9IGRub2RlLmV2ZW50cztcblx0XHRPYmplY3Qua2V5cyhldmVudHMpLmZvckVhY2goKGV2ZW50KSA9PiB7XG5cdFx0XHR1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudCwgZXZlbnRzW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCk7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0dXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCB7fSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG5cdGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcblx0fVxuXHRkbm9kZS5pbnNlcnRlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURvbShcblx0ZG5vZGU6IEludGVybmFsRE5vZGUsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRpbnNlcnRCZWZvcmU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0Y2hpbGROb2Rlcz86IChFbGVtZW50IHwgVGV4dClbXVxuKSB7XG5cdGxldCBkb21Ob2RlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZDtcblx0aWYgKGlzV05vZGUoZG5vZGUpKSB7XG5cdFx0bGV0IHsgd2lkZ2V0Q29uc3RydWN0b3IgfSA9IGRub2RlO1xuXHRcdGNvbnN0IHBhcmVudEluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGlmICghaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KHdpZGdldENvbnN0cnVjdG9yKSkge1xuXHRcdFx0Y29uc3QgaXRlbSA9IHBhcmVudEluc3RhbmNlRGF0YS5yZWdpc3RyeSgpLmdldDxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4od2lkZ2V0Q29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKGl0ZW0gPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0d2lkZ2V0Q29uc3RydWN0b3IgPSBpdGVtO1xuXHRcdH1cblx0XHRjb25zdCBpbnN0YW5jZSA9IG5ldyB3aWRnZXRDb25zdHJ1Y3RvcigpO1xuXHRcdGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0aW5zdGFuY2VEYXRhLmludmFsaWRhdGUgPSAoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xuXHRcdFx0aWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKSE7XG5cdFx0XHRcdHJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZSwgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoIH0pO1xuXHRcdFx0XHRzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcblx0XHRpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xuXHRcdGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XG5cdFx0aW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XG5cdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xuXHRcdGlmIChyZW5kZXJlZCkge1xuXHRcdFx0Y29uc3QgZmlsdGVyZWRSZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcblx0XHRcdGRub2RlLnJlbmRlcmVkID0gZmlsdGVyZWRSZW5kZXJlZDtcblx0XHRcdGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBmaWx0ZXJlZFJlbmRlcmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcyk7XG5cdFx0fVxuXHRcdGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG5cdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQ7XG5cdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHRpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUhLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZG9jID0gcGFyZW50Vk5vZGUuZG9tTm9kZSEub3duZXJEb2N1bWVudDtcblx0XHRpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlICE9PSB1bmRlZmluZWQgJiYgcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xuXHRcdFx0XHRjb25zdCBuZXdEb21Ob2RlID0gZG5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQhKTtcblx0XHRcdFx0aWYgKHBhcmVudFZOb2RlLmRvbU5vZGUgPT09IGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRub2RlLmRvbU5vZGUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQobmV3RG9tTm9kZSk7XG5cdFx0XHRcdFx0ZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlICYmIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkbm9kZS5kb21Ob2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQhKTtcblx0XHRcdFx0aWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGRub2RlLmRvbU5vZGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpZiAoZG5vZGUudGFnID09PSAnc3ZnJykge1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zID0geyAuLi5wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UsIGRub2RlLnRhZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlIHx8IGRvYy5jcmVhdGVFbGVtZW50KGRub2RlLnRhZyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xuXHRcdFx0fVxuXHRcdFx0aW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlISBhcyBFbGVtZW50LCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlIS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcblx0XHRcdH0gZWxzZSBpZiAoZG9tTm9kZSEucGFyZW50Tm9kZSAhPT0gcGFyZW50Vk5vZGUuZG9tTm9kZSEpIHtcblx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURvbShcblx0cHJldmlvdXM6IGFueSxcblx0ZG5vZGU6IEludGVybmFsRE5vZGUsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZVxuKSB7XG5cdGlmIChpc1dOb2RlKGRub2RlKSkge1xuXHRcdGNvbnN0IHsgaW5zdGFuY2UgfSA9IHByZXZpb3VzO1xuXHRcdGlmIChpbnN0YW5jZSkge1xuXHRcdFx0Y29uc3QgeyBwYXJlbnRWTm9kZSwgZG5vZGU6IG5vZGUgfSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdFx0Y29uc3QgcHJldmlvdXNSZW5kZXJlZCA9IG5vZGUgPyBub2RlLnJlbmRlcmVkIDogcHJldmlvdXMucmVuZGVyZWQ7XG5cdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSB0cnVlO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcblx0XHRcdGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XG5cdFx0XHRpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRcdGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcblx0XHRcdGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cdFx0XHRpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGUsIHBhcmVudFZOb2RlIH0pO1xuXHRcdFx0aWYgKGluc3RhbmNlRGF0YS5kaXJ0eSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcblx0XHRcdFx0ZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG5cdFx0XHRcdHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBwcmV2aW91c1JlbmRlcmVkLCBkbm9kZS5yZW5kZXJlZCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRub2RlLnJlbmRlcmVkID0gcHJldmlvdXNSZW5kZXJlZDtcblx0XHRcdH1cblx0XHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNyZWF0ZURvbShkbm9kZSwgcGFyZW50Vk5vZGUsIHVuZGVmaW5lZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHByZXZpb3VzID09PSBkbm9kZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRjb25zdCBkb21Ob2RlID0gKGRub2RlLmRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlKTtcblx0XHRsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcblx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xuXHRcdGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xuXHRcdFx0aWYgKGRub2RlLnRleHQgIT09IHByZXZpb3VzLnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGRvbU5vZGUucGFyZW50Tm9kZSEucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRvbU5vZGUpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcblx0XHRcdFx0dGV4dFVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm4gdGV4dFVwZGF0ZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS50YWcgJiYgZG5vZGUudGFnLmxhc3RJbmRleE9mKCdzdmcnLCAwKSA9PT0gMCkge1xuXHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0gfTtcblx0XHRcdH1cblx0XHRcdGlmIChwcmV2aW91cy5jaGlsZHJlbiAhPT0gZG5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0Y29uc3QgY2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGRub2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdGRub2RlLmNoaWxkcmVuID0gY2hpbGRyZW47XG5cdFx0XHRcdHVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZUNoaWxkcmVuKGRub2RlLCBwcmV2aW91cy5jaGlsZHJlbiwgY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcHJldmlvdXNQcm9wZXJ0aWVzID0gYnVpbGRQcmV2aW91c1Byb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXMsIGRub2RlKTtcblx0XHRcdGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xuXHRcdFx0XHR1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5hdHRyaWJ1dGVzLCBkbm9kZS5hdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdHVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZVByb3BlcnRpZXMoXG5cdFx0XHRcdFx0XHRkb21Ob2RlLFxuXHRcdFx0XHRcdFx0cHJldmlvdXNQcm9wZXJ0aWVzLnByb3BlcnRpZXMsXG5cdFx0XHRcdFx0XHRkbm9kZS5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMsXG5cdFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRcdCkgfHwgdXBkYXRlZDtcblx0XHRcdFx0cmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmV2ZW50cywgZG5vZGUuZXZlbnRzLCBwcm9qZWN0aW9uT3B0aW9ucywgdHJ1ZSk7XG5cdFx0XHRcdGNvbnN0IGV2ZW50cyA9IGRub2RlLmV2ZW50cztcblx0XHRcdFx0T2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChldmVudCkgPT4ge1xuXHRcdFx0XHRcdHVwZGF0ZUV2ZW50KFxuXHRcdFx0XHRcdFx0ZG9tTm9kZSxcblx0XHRcdFx0XHRcdGV2ZW50LFxuXHRcdFx0XHRcdFx0ZXZlbnRzW2V2ZW50XSxcblx0XHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLFxuXHRcdFx0XHRcdFx0ZG5vZGUucHJvcGVydGllcy5iaW5kLFxuXHRcdFx0XHRcdFx0cHJldmlvdXNQcm9wZXJ0aWVzLmV2ZW50c1tldmVudF1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB8fFxuXHRcdFx0XHRcdHVwZGF0ZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdFx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkKGRvbU5vZGUsIGAke2Rub2RlLnByb3BlcnRpZXMua2V5fWApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XG5cdFx0XHRkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhZGREZWZlcnJlZFByb3BlcnRpZXModm5vZGU6IEludGVybmFsVk5vZGUsIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHQvLyB0cmFuc2ZlciBhbnkgcHJvcGVydGllcyB0aGF0IGhhdmUgYmVlbiBwYXNzZWQgLSBhcyB0aGVzZSBtdXN0IGJlIGRlY29yYXRlZCBwcm9wZXJ0aWVzXG5cdHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyA9IHZub2RlLnByb3BlcnRpZXM7XG5cdGNvbnN0IHByb3BlcnRpZXMgPSB2bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayEoISF2bm9kZS5pbnNlcnRlZCk7XG5cdHZub2RlLnByb3BlcnRpZXMgPSB7IC4uLnByb3BlcnRpZXMsIC4uLnZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyB9O1xuXHRwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRjb25zdCBwcm9wZXJ0aWVzID0ge1xuXHRcdFx0Li4udm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2shKCEhdm5vZGUuaW5zZXJ0ZWQpLFxuXHRcdFx0Li4udm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzXG5cdFx0fTtcblx0XHR1cGRhdGVQcm9wZXJ0aWVzKHZub2RlLmRvbU5vZGUhIGFzIEVsZW1lbnQsIHZub2RlLnByb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR2bm9kZS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcblx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGdsb2JhbC5yZXF1ZXN0SWRsZUNhbGxiYWNrKSB7XG5cdFx0XHRnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcblx0XHRyZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9IGVsc2UgaWYgKHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID0gZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRyZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0cHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuXHRjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSkhO1xuXHRjb25zdCByZW5kZXJzID0gWy4uLnJlbmRlclF1ZXVlXTtcblx0cmVuZGVyUXVldWVNYXAuc2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlLCBbXSk7XG5cdHJlbmRlcnMuc29ydCgoYSwgYikgPT4gYS5kZXB0aCAtIGIuZGVwdGgpO1xuXG5cdHdoaWxlIChyZW5kZXJzLmxlbmd0aCkge1xuXHRcdGNvbnN0IHsgaW5zdGFuY2UgfSA9IHJlbmRlcnMuc2hpZnQoKSE7XG5cdFx0Y29uc3QgeyBwYXJlbnRWTm9kZSwgZG5vZGUgfSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdHVwZGF0ZURvbShkbm9kZSwgdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcblx0fVxuXHRydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRvbSA9IHtcblx0YXBwZW5kOiBmdW5jdGlvbihcblx0XHRwYXJlbnROb2RlOiBFbGVtZW50LFxuXHRcdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0XHRwcm9qZWN0aW9uT3B0aW9uczogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4gPSB7fVxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRjb25zdCBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UpO1xuXG5cdFx0ZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gcGFyZW50Tm9kZTtcblx0XHRjb25zdCBwYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGUoZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlKTtcblx0XHRjb25zdCBub2RlID0gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpO1xuXHRcdGNvbnN0IHJlbmRlclF1ZXVlOiBSZW5kZXJRdWV1ZVtdID0gW107XG5cdFx0aW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZSB9KTtcblx0XHRyZW5kZXJRdWV1ZU1hcC5zZXQoZmluYWxQcm9qZWN0b3JPcHRpb25zLnByb2plY3Rvckluc3RhbmNlLCByZW5kZXJRdWV1ZSk7XG5cdFx0aW5zdGFuY2VEYXRhLmludmFsaWRhdGUgPSAoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xuXHRcdFx0aWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSkhO1xuXHRcdFx0XHRyZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBmaW5hbFByb2plY3Rvck9wdGlvbnMuZGVwdGggfSk7XG5cdFx0XHRcdHNjaGVkdWxlUmVuZGVyKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR1cGRhdGVEb20obm9kZSwgbm9kZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuXHRcdH0pO1xuXHRcdHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0cnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZG9tTm9kZTogZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlXG5cdFx0fTtcblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbihpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIHByb2plY3Rpb25PcHRpb25zPzogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4pOiBQcm9qZWN0aW9uIHtcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdH0sXG5cdG1lcmdlOiBmdW5jdGlvbihcblx0XHRlbGVtZW50OiBFbGVtZW50LFxuXHRcdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0XHRwcm9qZWN0aW9uT3B0aW9uczogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4gPSB7fVxuXHQpOiBQcm9qZWN0aW9uIHtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSA9IHRydWU7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gZWxlbWVudDtcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoZWxlbWVudC5wYXJlbnROb2RlIGFzIEVsZW1lbnQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gdmRvbS50cyIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciB3aWRnZXRGYWN0b3J5ID0gcmVxdWlyZShcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIik7XG5cbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnQgPSByZXF1aXJlKCdAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xuXG52YXIgZGVmYXVsdEV4cG9ydCA9IHdpZGdldEZhY3RvcnkuZGVmYXVsdDtcbmRlZmF1bHRFeHBvcnQgJiYgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGRlZmF1bHRFeHBvcnQpO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlcj93aWRnZXRGYWN0b3J5PXNyYy9tZW51LWl0ZW0vTWVudUl0ZW0hLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXIvaW5kZXguanM/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS1pdGVtL01lbnVJdGVtIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVpZGF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnVJdGVtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0dGl0bGU6IHN0cmluZztcblx0c2VsZWN0ZWQ/OiBib29sZWFuO1xuXHRkYXRhPzogYW55O1xuXHRvblNlbGVjdGVkPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudUl0ZW1Qcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudS1pdGVtJyxcblx0YXR0cmlidXRlczogWyd0aXRsZScsICdzZWxlY3RlZCddLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddLFxuXHRwcm9wZXJ0aWVzOiBbJ2RhdGEnLCAnc2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudUl0ZW0gZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51SXRlbVByb3BlcnRpZXM+IHtcblx0cHJpdmF0ZSBfb25DbGljaygpIHtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCAmJiB0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCh0aGlzLnByb3BlcnRpZXMuZGF0YSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgdGl0bGUsIHNlbGVjdGVkIH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignbGknLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcblx0XHRcdHYoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoW2Nzcy5pdGVtLCBzZWxlY3RlZCA/IGNzcy5zZWxlY3RlZCA6IG51bGxdKSxcblx0XHRcdFx0XHRvbmNsaWNrOiB0aGlzLl9vbkNsaWNrXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFt0aXRsZV1cblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51SXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfbWVudS1pdGVtIS4vc3JjL21lbnUtaXRlbS9NZW51SXRlbS50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJ0ZXN0LWFwcC9tZW51SXRlbVwiLFwicm9vdFwiOlwic1VtVWk0U2hcIixcIml0ZW1cIjpcIl8yTWs2UmRxYVwiLFwic2VsZWN0ZWRcIjpcIl8xLWYzSXRPaFwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSJdLCJzb3VyY2VSb290IjoiIn0=