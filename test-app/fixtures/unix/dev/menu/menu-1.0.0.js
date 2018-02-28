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

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu/Menu.ts");

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
module.exports = {" _key":"test-app/menu","root":"_3bA6jdSn","menuContainer":"_1eoGfqku"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGRkMmI4NzkwMWEwNDE2NzQwYTgiLCJ3ZWJwYWNrOi8vL0Rlc3Ryb3lhYmxlLnRzIiwid2VicGFjazovLy9FdmVudGVkLnRzIiwid2VicGFjazovLy9sYW5nLnRzIiwid2VicGFjazovLy9oYXMudHMiLCJ3ZWJwYWNrOi8vL01hcC50cyIsIndlYnBhY2s6Ly8vUHJvbWlzZS50cyIsIndlYnBhY2s6Ly8vU3ltYm9sLnRzIiwid2VicGFjazovLy9XZWFrTWFwLnRzIiwid2VicGFjazovLy9hcnJheS50cyIsIndlYnBhY2s6Ly8vZ2xvYmFsLnRzIiwid2VicGFjazovLy9pdGVyYXRvci50cyIsIndlYnBhY2s6Ly8vbnVtYmVyLnRzIiwid2VicGFjazovLy9vYmplY3QudHMiLCJ3ZWJwYWNrOi8vL3N0cmluZy50cyIsIndlYnBhY2s6Ly8vcXVldWUudHMiLCJ3ZWJwYWNrOi8vL3V0aWwudHMiLCJ3ZWJwYWNrOi8vL0luamVjdG9yLnRzIiwid2VicGFjazovLy9Ob2RlSGFuZGxlci50cyIsIndlYnBhY2s6Ly8vUmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vL1JlZ2lzdHJ5SGFuZGxlci50cyIsIndlYnBhY2s6Ly8vV2lkZ2V0QmFzZS50cyIsIndlYnBhY2s6Ly8vY3NzVHJhbnNpdGlvbnMudHMiLCJ3ZWJwYWNrOi8vL2QudHMiLCJ3ZWJwYWNrOi8vL2FmdGVyUmVuZGVyLnRzIiwid2VicGFjazovLy9iZWZvcmVQcm9wZXJ0aWVzLnRzIiwid2VicGFjazovLy9jdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9kaWZmUHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vL2hhbmRsZURlY29yYXRvci50cyIsIndlYnBhY2s6Ly8vaW5qZWN0LnRzIiwid2VicGFjazovLy9kaWZmLnRzIiwid2VicGFjazovLy9Qcm9qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL1RoZW1lZC50cyIsIndlYnBhY2s6Ly8vcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy92ZG9tLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9tZW51L01lbnUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUvbWVudS5tLmNzcz81ZDQwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM1REE7QUFDQTtBQUVBOzs7QUFHQTtJQUNDLE9BQU8saUJBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzlCO0FBRUE7OztBQUdBO0lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQztBQUNqRDtBQUVBO0lBTUM7OztJQUdBO1FBQ0MsSUFBSSxDQUFDLFFBQU8sRUFBRyxFQUFFO0lBQ2xCO0lBRUE7Ozs7OztJQU1BLDBCQUFHLEVBQUgsVUFBSSxPQUEwQjtRQUM3QixJQUFNLE9BQU0sRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLDRCQUFxQixnQ0FBSSxPQUFPLEdBQUUsRUFBRSxPQUFPO1FBQzNFLDJCQUFpQjtRQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixPQUFPO1lBQ04sT0FBTztnQkFDTixRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDakI7U0FDQTtJQUNGLENBQUM7SUFFRDs7Ozs7SUFLQSw4QkFBTyxFQUFQO1FBQUE7UUFDQyxPQUFPLElBQUksaUJBQU8sQ0FBQyxVQUFDLE9BQU87WUFDMUIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2dCQUMzQixPQUFNLEdBQUksTUFBTSxDQUFDLFFBQU8sR0FBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQzdDLENBQUMsQ0FBQztZQUNGLEtBQUksQ0FBQyxRQUFPLEVBQUcsSUFBSTtZQUNuQixLQUFJLENBQUMsSUFBRyxFQUFHLFNBQVM7WUFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNILENBQUM7SUFDRixrQkFBQztBQUFELENBOUNBO0FBQWE7QUFnRGIsa0JBQWUsV0FBVzs7Ozs7Ozs7Ozs7O0FDbEUxQjtBQUVBO0FBRUE7OztBQUdBLElBQU0sU0FBUSxFQUFHLElBQUksYUFBRyxFQUFrQjtBQUUxQzs7Ozs7QUFLQSxxQkFBNEIsVUFBMkIsRUFBRSxZQUE2QjtJQUNyRixHQUFHLENBQUMsT0FBTyxhQUFZLElBQUssU0FBUSxHQUFJLE9BQU8sV0FBVSxJQUFLLFNBQVEsR0FBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3pHLElBQUksTUFBSyxRQUFRO1FBQ2pCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdCLE1BQUssRUFBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRTtRQUNsQztRQUFFLEtBQUs7WUFDTixNQUFLLEVBQUcsSUFBSSxNQUFNLENBQUMsTUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsS0FBRyxDQUFDO1lBQzFELFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUNoQztRQUNBLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDaEM7SUFBRSxLQUFLO1FBQ04sT0FBTyxXQUFVLElBQUssWUFBWTtJQUNuQztBQUNEO0FBYkE7QUFrQ0E7OztBQUdBO0lBQTBHO0lBQTFHO1FBQUE7UUFNQzs7O1FBR1UsbUJBQVksRUFBOEMsSUFBSSxhQUFHLEVBQUU7O0lBOEQ5RTtJQXJEQyx1QkFBSSxFQUFKLFVBQUssS0FBVTtRQUFmO1FBQ0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsSUFBSTtZQUN2QyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO29CQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksRUFBRSxLQUFLLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQztZQUNIO1FBQ0QsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQXNCRCxxQkFBRSxFQUFGLFVBQUcsSUFBUyxFQUFFLFFBQTBDO1FBQXhEO1FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDNUIsSUFBTSxVQUFPLEVBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLFFBQVEsSUFBSyxZQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztZQUM3RSxPQUFPO2dCQUNOLE9BQU87b0JBQ04sU0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sSUFBSyxhQUFNLENBQUMsT0FBTyxFQUFFLEVBQWhCLENBQWdCLENBQUM7Z0JBQzlDO2FBQ0E7UUFDRjtRQUNBLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0lBQ3pDLENBQUM7SUFFTywrQkFBWSxFQUFwQixVQUFxQixJQUFpQixFQUFFLFFBQStCO1FBQXZFO1FBQ0MsSUFBTSxVQUFTLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLEdBQUksRUFBRTtRQUNuRCxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1FBQ3RDLE9BQU87WUFDTixPQUFPLEVBQUU7Z0JBQ1IsSUFBTSxVQUFTLEVBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLEdBQUksRUFBRTtnQkFDbkQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRDtTQUNBO0lBQ0YsQ0FBQztJQUNGLGNBQUM7QUFBRCxDQXZFQSxDQUEwRyx5QkFBVztBQUF4RztBQXlFYixrQkFBZSxPQUFPOzs7Ozs7Ozs7Ozs7QUMzSHRCO0FBRUE7QUFBUyxnQ0FBTTtBQUVmLElBQU0sTUFBSyxFQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSztBQUNuQyxJQUFNLGVBQWMsRUFBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWM7QUFFdEQ7Ozs7Ozs7Ozs7QUFVQSw4QkFBOEIsS0FBVTtJQUN2QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsSUFBSyxpQkFBaUI7QUFDbkU7QUFFQSxtQkFBc0IsS0FBVSxFQUFFLFNBQWtCO0lBQ25ELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFTLElBQU87UUFDaEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBWSxTQUFTLENBQU0sSUFBSSxFQUFFLFNBQVMsQ0FBQztRQUM1QztRQUVBLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJO1lBQ2hDLEVBQUU7WUFDRixFQUFFLE1BQU0sQ0FBQztnQkFDUCxJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsU0FBUztnQkFDcEIsT0FBTyxFQUFZLENBQUMsSUFBSSxDQUFDO2dCQUN6QixNQUFNLEVBQUs7YUFDWCxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0g7QUFVQSxnQkFBNEMsTUFBdUI7SUFDbEUsSUFBTSxLQUFJLEVBQUcsTUFBTSxDQUFDLElBQUk7SUFDeEIsSUFBTSxVQUFTLEVBQUcsTUFBTSxDQUFDLFNBQVM7SUFDbEMsSUFBTSxPQUFNLEVBQVEsTUFBTSxDQUFDLE1BQU07SUFDakMsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE9BQU0sR0FBSSxFQUFFO0lBQ2xDLElBQU0sWUFBVyxtQkFBTyxNQUFNLENBQUM7SUFFL0IsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFaEMsR0FBRyxDQUFDLE9BQU0sSUFBSyxLQUFJLEdBQUksT0FBTSxJQUFLLFNBQVMsRUFBRTtZQUM1QyxRQUFRO1FBQ1Q7UUFDQSxJQUFJLENBQUMsSUFBSSxJQUFHLEdBQUksTUFBTSxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxVQUFTLEdBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xELElBQUksTUFBSyxFQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBRTVCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO29CQUN0QyxRQUFRO2dCQUNUO2dCQUVBLEdBQUcsQ0FBQyxJQUFJLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3pCLE1BQUssRUFBRyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztvQkFDcEM7b0JBQUUsS0FBSyxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3ZDLElBQU0sWUFBVyxFQUFRLE1BQU0sQ0FBQyxHQUFHLEVBQUMsR0FBSSxFQUFFO3dCQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzt3QkFDbkIsTUFBSyxFQUFHLE1BQU0sQ0FBQzs0QkFDZCxJQUFJLEVBQUUsSUFBSTs0QkFDVixTQUFTLEVBQUUsU0FBUzs0QkFDcEIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDOzRCQUNoQixNQUFNLEVBQUUsV0FBVzs0QkFDbkIsTUFBTTt5QkFDTixDQUFDO29CQUNIO2dCQUNEO2dCQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUMsRUFBRyxLQUFLO1lBQ3BCO1FBQ0Q7SUFDRDtJQUVBLE9BQWMsTUFBTTtBQUNyQjtBQTJDQSxnQkFBdUIsU0FBYztJQUFFO1NBQUEsVUFBZ0IsRUFBaEIscUJBQWdCLEVBQWhCLElBQWdCO1FBQWhCOztJQUN0QyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ25CLE1BQU0sSUFBSSxVQUFVLENBQUMsaURBQWlELENBQUM7SUFDeEU7SUFFQSxJQUFNLEtBQUksRUFBRyxNQUFNLENBQUMsS0FBSyxFQUFFO0lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV0QyxPQUFPLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUNoQztBQVRBO0FBbURBLG9CQUEyQixNQUFXO0lBQUU7U0FBQSxVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7UUFBakI7O0lBQ3ZDLE9BQU8sTUFBTSxDQUFDO1FBQ2IsSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsS0FBSztRQUNoQixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUU7S0FDUixDQUFDO0FBQ0g7QUFQQTtBQWlEQSxtQkFBMEIsTUFBVztJQUFFO1NBQUEsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1FBQWpCOztJQUN0QyxPQUFPLE1BQU0sQ0FBQztRQUNiLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLElBQUk7UUFDZixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUU7S0FDUixDQUFDO0FBQ0g7QUFQQTtBQVNBOzs7Ozs7O0FBT0EsbUJBQXdDLE1BQVM7SUFDaEQsSUFBTSxPQUFNLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTNELE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDakM7QUFKQTtBQU1BOzs7Ozs7O0FBT0EscUJBQTRCLENBQU0sRUFBRSxDQUFNO0lBQ3pDLE9BQU8sQ0FDTixFQUFDLElBQUssRUFBQztRQUNQO1FBQ0EsQ0FBQyxFQUFDLElBQUssRUFBQyxHQUFJLEVBQUMsSUFBSyxDQUFDLENBQUMsQ0FDcEI7QUFDRjtBQU5BO0FBUUE7Ozs7Ozs7Ozs7O0FBV0Esa0JBQXlCLFFBQVksRUFBRSxNQUFjO0lBQUU7U0FBQSxVQUFzQixFQUF0QixxQkFBc0IsRUFBdEIsSUFBc0I7UUFBdEI7O0lBQ3RELE9BQU8sWUFBWSxDQUFDO1FBQ25CLEVBQUU7WUFDQSxJQUFNLEtBQUksRUFBVSxTQUFTLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFlBQVk7WUFFaEc7WUFDQSxPQUFhLFFBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztRQUNyRDtRQUNELEVBQUU7WUFDQTtZQUNBLE9BQWEsUUFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO1FBQzFELENBQUM7QUFDSjtBQVpBO0FBb0RBLGVBQXNCLE1BQVc7SUFBRTtTQUFBLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtRQUFqQjs7SUFDbEMsT0FBTyxNQUFNLENBQUM7UUFDYixJQUFJLEVBQUUsS0FBSztRQUNYLFNBQVMsRUFBRSxJQUFJO1FBQ2YsT0FBTyxFQUFFLE9BQU87UUFDaEIsTUFBTSxFQUFFO0tBQ1IsQ0FBQztBQUNIO0FBUEE7QUFTQTs7Ozs7Ozs7QUFRQSxpQkFBd0IsY0FBdUM7SUFBRTtTQUFBLFVBQXNCLEVBQXRCLHFCQUFzQixFQUF0QixJQUFzQjtRQUF0Qjs7SUFDaEUsT0FBTztRQUNOLElBQU0sS0FBSSxFQUFVLFNBQVMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsWUFBWTtRQUVoRyxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUN4QyxDQUFDO0FBQ0Y7QUFOQTtBQVFBOzs7Ozs7OztBQVFBLHNCQUE2QixVQUFzQjtJQUNsRCxPQUFPO1FBQ04sT0FBTyxFQUFFO1lBQ1IsSUFBSSxDQUFDLFFBQU8sRUFBRyxjQUFZLENBQUM7WUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEI7S0FDQTtBQUNGO0FBUEE7QUFTQTs7Ozs7O0FBTUE7SUFBc0M7U0FBQSxVQUFvQixFQUFwQixxQkFBb0IsRUFBcEIsSUFBb0I7UUFBcEI7O0lBQ3JDLE9BQU8sWUFBWSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtRQUNyQjtJQUNELENBQUMsQ0FBQztBQUNIO0FBTkE7Ozs7Ozs7Ozs7O0FDOVdBLCtCQUErQixLQUFVO0lBQ3hDLE9BQU8sTUFBSyxHQUFJLEtBQUssQ0FBQyxJQUFJO0FBQzNCO0FBRUE7OztBQUdhLGtCQUFTLEVBQTZDLEVBQUU7QUFFckU7OztBQUdhLHNCQUFhLEVBQXVDLEVBQUU7QUFFbkU7Ozs7QUFJQSxJQUFNLGNBQWEsRUFBK0MsRUFBRTtBQXdCcEU7OztBQUdBLElBQU0sWUFBVyxFQUFHLENBQUM7SUFDcEI7SUFDQSxHQUFHLENBQUMsT0FBTyxPQUFNLElBQUssV0FBVyxFQUFFO1FBQ2xDO1FBQ0EsT0FBTyxNQUFNO0lBQ2Q7SUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLE9BQU0sSUFBSyxXQUFXLEVBQUU7UUFDekM7UUFDQSxPQUFPLE1BQU07SUFDZDtJQUFFLEtBQUssR0FBRyxDQUFDLE9BQU8sS0FBSSxJQUFLLFdBQVcsRUFBRTtRQUN2QztRQUNBLE9BQU8sSUFBSTtJQUNaO0lBQ0E7SUFDQSxPQUFPLEVBQUU7QUFDVixDQUFDLENBQUMsRUFBRTtBQUVKO0FBQ1EsMEVBQWM7QUFFdEI7QUFDQSxHQUFHLENBQUMscUJBQW9CLEdBQUksV0FBVyxFQUFFO0lBQ3hDLE9BQU8sV0FBVyxDQUFDLGtCQUFrQjtBQUN0QztBQUVBOzs7Ozs7QUFNQSxpQ0FBaUMsS0FBVTtJQUMxQyxPQUFPLE9BQU8sTUFBSyxJQUFLLFVBQVU7QUFDbkM7QUFFQTs7OztBQUlBLElBQU0sWUFBVyxFQUFzQjtJQUN0QyxFQUFFLHVCQUF1QixDQUFDLGNBQWMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7SUFDaEYsRUFBRSxFQUFFLENBQUU7Ozs7Ozs7Ozs7OztBQVlQLGNBQXFCLFVBQWtCLEVBQUUsT0FBZ0IsRUFBRSxJQUEyQixFQUFFLE1BQWU7SUFDdEcsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRTtBQUNsRDtBQUZBO0FBSUE7Ozs7Ozs7OztBQVNBLG1CQUEwQixVQUFrQixFQUFFLFNBQXVDO0lBQ3BGLElBQU0sT0FBTSxFQUFxQixVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFDLEdBQUksRUFBRTtJQUN6RSxJQUFJLEVBQUMsRUFBRyxDQUFDO0lBRVQsYUFBYSxJQUFjO1FBQzFCLElBQU0sS0FBSSxFQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN4QixHQUFHLENBQUMsS0FBSSxJQUFLLEdBQUcsRUFBRTtZQUNqQjtZQUNBLE9BQU8sSUFBSTtRQUNaO1FBQUUsS0FBSztZQUNOO1lBQ0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQyxJQUFLLEdBQUcsRUFBRTtnQkFDeEIsR0FBRyxDQUFDLENBQUMsS0FBSSxHQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkI7b0JBQ0EsT0FBTyxHQUFHLEVBQUU7Z0JBQ2I7Z0JBQUUsS0FBSztvQkFDTjtvQkFDQSxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNULE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDakI7WUFDRDtZQUNBO1lBQ0EsT0FBTyxJQUFJO1FBQ1o7SUFDRDtJQUVBLElBQU0sR0FBRSxFQUFHLEdBQUcsRUFBRTtJQUVoQixPQUFPLEdBQUUsR0FBSSxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQzNCO0FBN0JBO0FBK0JBOzs7OztBQUtBLGdCQUF1QixPQUFlO0lBQ3JDLElBQU0sa0JBQWlCLEVBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRTtJQUUvQyxPQUFPLE9BQU8sQ0FDYixrQkFBaUIsR0FBSSxZQUFXLEdBQUksa0JBQWlCLEdBQUksa0JBQVMsR0FBSSxxQkFBYSxDQUFDLGlCQUFpQixDQUFDLENBQ3RHO0FBQ0Y7QUFOQTtBQVFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxhQUNDLE9BQWUsRUFDZixLQUE0RCxFQUM1RCxTQUEwQjtJQUExQiw2Q0FBMEI7SUFFMUIsSUFBTSxrQkFBaUIsRUFBRyxPQUFPLENBQUMsV0FBVyxFQUFFO0lBRS9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUMsR0FBSSxDQUFDLFVBQVMsR0FBSSxDQUFDLENBQUMsa0JBQWlCLEdBQUksV0FBVyxDQUFDLEVBQUU7UUFDbkYsTUFBTSxJQUFJLFNBQVMsQ0FBQyxlQUFZLFFBQU8scUNBQWtDLENBQUM7SUFDM0U7SUFFQSxHQUFHLENBQUMsT0FBTyxNQUFLLElBQUssVUFBVSxFQUFFO1FBQ2hDLHFCQUFhLENBQUMsaUJBQWlCLEVBQUMsRUFBRyxLQUFLO0lBQ3pDO0lBQUUsS0FBSyxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEMsYUFBYSxDQUFDLE9BQU8sRUFBQyxFQUFHLEtBQUssQ0FBQyxJQUFJLENBQ2xDLFVBQUMsYUFBZ0M7WUFDaEMsaUJBQVMsQ0FBQyxPQUFPLEVBQUMsRUFBRyxhQUFhO1lBQ2xDLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUM5QixDQUFDLEVBQ0Q7WUFDQyxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDOUIsQ0FBQyxDQUNEO0lBQ0Y7SUFBRSxLQUFLO1FBQ04saUJBQVMsQ0FBQyxpQkFBaUIsRUFBQyxFQUFHLEtBQUs7UUFDcEMsT0FBTyxxQkFBYSxDQUFDLGlCQUFpQixDQUFDO0lBQ3hDO0FBQ0Q7QUEzQkE7QUE2QkE7Ozs7O0FBS0EsYUFBNEIsT0FBZTtJQUMxQyxJQUFJLE1BQXlCO0lBRTdCLElBQU0sa0JBQWlCLEVBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRTtJQUUvQyxHQUFHLENBQUMsa0JBQWlCLEdBQUksV0FBVyxFQUFFO1FBQ3JDLE9BQU0sRUFBRyxXQUFXLENBQUMsaUJBQWlCLENBQUM7SUFDeEM7SUFBRSxLQUFLLEdBQUcsQ0FBQyxxQkFBYSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDNUMsT0FBTSxFQUFHLGlCQUFTLENBQUMsaUJBQWlCLEVBQUMsRUFBRyxxQkFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRixPQUFPLHFCQUFhLENBQUMsaUJBQWlCLENBQUM7SUFDeEM7SUFBRSxLQUFLLEdBQUcsQ0FBQyxrQkFBaUIsR0FBSSxpQkFBUyxFQUFFO1FBQzFDLE9BQU0sRUFBRyxpQkFBUyxDQUFDLGlCQUFpQixDQUFDO0lBQ3RDO0lBQUUsS0FBSyxHQUFHLENBQUMsUUFBTyxHQUFJLGFBQWEsRUFBRTtRQUNwQyxPQUFPLEtBQUs7SUFDYjtJQUFFLEtBQUs7UUFDTixNQUFNLElBQUksU0FBUyxDQUFDLGtEQUErQyxRQUFPLE1BQUcsQ0FBQztJQUMvRTtJQUVBLE9BQU8sTUFBTTtBQUNkO0FBbkJBO0FBcUJBOzs7QUFJQTtBQUVBO0FBQ0EsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7QUFFbEI7QUFDQSxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sU0FBUSxJQUFLLFlBQVcsR0FBSSxPQUFPLFNBQVEsSUFBSyxXQUFXLENBQUM7QUFFdkY7QUFDQSxHQUFHLENBQUMsV0FBVyxFQUFFO0lBQ2hCLEdBQUcsQ0FBQyxPQUFPLFFBQU8sSUFBSyxTQUFRLEdBQUksT0FBTyxDQUFDLFNBQVEsR0FBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtRQUM3RSxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSTtJQUM3QjtBQUNELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQy9QRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBd0hXLFlBQUcsRUFBbUIsZ0JBQU0sQ0FBQyxHQUFHO0FBRTNDLEdBQUcsQ0FBQyxDQUFDLGFBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUNwQixZQUFHO1lBbUJGLGFBQVksUUFBK0M7Z0JBbEJ4QyxXQUFLLEVBQVEsRUFBRTtnQkFDZixhQUFPLEVBQVEsRUFBRTtnQkErRnBDLEtBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQyxFQUFVLEtBQUs7Z0JBN0VsQyxHQUFHLENBQUMsUUFBUSxFQUFFO29CQUNiLEdBQUcsQ0FBQyxzQkFBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUMxQixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN6QyxJQUFNLE1BQUssRUFBRyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCO29CQUNEO29CQUFFLEtBQUs7OzRCQUNOLElBQUksQ0FBZ0IsMENBQVE7Z0NBQXZCLElBQU0sTUFBSztnQ0FDZixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7b0JBRTlCO2dCQUNEOztZQUNEO1lBNUJBOzs7O1lBSVUsMEJBQVcsRUFBckIsVUFBc0IsSUFBUyxFQUFFLEdBQU07Z0JBQ3RDLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsU0FBTSxFQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxFQUFHLFFBQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEQsR0FBRyxDQUFDLFdBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7d0JBQzNCLE9BQU8sQ0FBQztvQkFDVDtnQkFDRDtnQkFDQSxPQUFPLENBQUMsQ0FBQztZQUNWLENBQUM7WUFtQkQsc0JBQUkscUJBQUk7cUJBQVI7b0JBQ0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQ3pCLENBQUM7Ozs7WUFFRCxvQkFBSyxFQUFMO2dCQUNDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTSxFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTSxFQUFHLENBQUM7WUFDNUMsQ0FBQztZQUVELHFCQUFNLEVBQU4sVUFBTyxHQUFNO2dCQUNaLElBQU0sTUFBSyxFQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFLLEVBQUcsQ0FBQyxFQUFFO29CQUNkLE9BQU8sS0FBSztnQkFDYjtnQkFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLElBQUk7WUFDWixDQUFDO1lBRUQsc0JBQU8sRUFBUDtnQkFBQTtnQkFDQyxJQUFNLE9BQU0sRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQU0sRUFBRSxDQUFTO29CQUMvQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLENBQUMsQ0FBQztnQkFFRixPQUFPLElBQUksdUJBQVksQ0FBQyxNQUFNLENBQUM7WUFDaEMsQ0FBQztZQUVELHNCQUFPLEVBQVAsVUFBUSxRQUEyRCxFQUFFLE9BQVk7Z0JBQ2hGLElBQU0sS0FBSSxFQUFHLElBQUksQ0FBQyxLQUFLO2dCQUN2QixJQUFNLE9BQU0sRUFBRyxJQUFJLENBQUMsT0FBTztnQkFDM0IsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxTQUFNLEVBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLEVBQUcsUUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztnQkFDakQ7WUFDRCxDQUFDO1lBRUQsa0JBQUcsRUFBSCxVQUFJLEdBQU07Z0JBQ1QsSUFBTSxNQUFLLEVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztnQkFDL0MsT0FBTyxNQUFLLEVBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNuRCxDQUFDO1lBRUQsa0JBQUcsRUFBSCxVQUFJLEdBQU07Z0JBQ1QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLEVBQUcsQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFFRCxtQkFBSSxFQUFKO2dCQUNDLE9BQU8sSUFBSSx1QkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDcEMsQ0FBQztZQUVELGtCQUFHLEVBQUgsVUFBSSxHQUFNLEVBQUUsS0FBUTtnQkFDbkIsSUFBSSxNQUFLLEVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztnQkFDN0MsTUFBSyxFQUFHLE1BQUssRUFBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSztnQkFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsRUFBRyxHQUFHO2dCQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxFQUFHLEtBQUs7Z0JBQzNCLE9BQU8sSUFBSTtZQUNaLENBQUM7WUFFRCxxQkFBTSxFQUFOO2dCQUNDLE9BQU8sSUFBSSx1QkFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDdEMsQ0FBQztZQUVELGNBQUMsTUFBTSxDQUFDLFFBQVEsRUFBQyxFQUFqQjtnQkFDQyxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDdEIsQ0FBQztZQUdGLFVBQUM7UUFBRCxDQWxHTTtRQWlCRSxHQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUMsRUFBRyxFQUFJO1dBaUY5QjtBQUNGO0FBRUEsa0JBQWUsV0FBRzs7Ozs7Ozs7Ozs7OztBQ25PbEI7QUFDQTtBQUVBO0FBQ0E7QUFlVyxvQkFBVyxFQUFtQixnQkFBTSxDQUFDLE9BQU87QUFFMUMsbUJBQVUsRUFBRyxvQkFBdUIsS0FBVTtJQUMxRCxPQUFPLE1BQUssR0FBSSxPQUFPLEtBQUssQ0FBQyxLQUFJLElBQUssVUFBVTtBQUNqRCxDQUFDO0FBRUQsR0FBRyxDQUFDLENBQUMsYUFBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO0lBT3hCLGdCQUFNLENBQUMsUUFBTyxFQUFHLG9CQUFXO1lBeUUzQjs7Ozs7Ozs7Ozs7O1lBWUEsaUJBQVksUUFBcUI7Z0JBQWpDO2dCQXNIQTs7O2dCQUdRLFdBQUs7Z0JBY2IsS0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDLEVBQWMsU0FBUztnQkF0STFDOzs7Z0JBR0EsSUFBSSxVQUFTLEVBQUcsS0FBSztnQkFFckI7OztnQkFHQSxJQUFNLFdBQVUsRUFBRztvQkFDbEIsT0FBTyxLQUFJLENBQUMsTUFBSyxvQkFBa0IsR0FBSSxTQUFTO2dCQUNqRCxDQUFDO2dCQUVEOzs7Z0JBR0EsSUFBSSxVQUFTLEVBQStCLEVBQUU7Z0JBRTlDOzs7O2dCQUlBLElBQUksYUFBWSxFQUFHLFVBQVMsUUFBb0I7b0JBQy9DLEdBQUcsQ0FBQyxTQUFTLEVBQUU7d0JBQ2QsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3pCO2dCQUNELENBQUM7Z0JBRUQ7Ozs7OztnQkFNQSxJQUFNLE9BQU0sRUFBRyxVQUFDLFFBQWUsRUFBRSxLQUFVO29CQUMxQztvQkFDQSxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQUssbUJBQWtCLEVBQUU7d0JBQ2pDLE1BQU07b0JBQ1A7b0JBRUEsS0FBSSxDQUFDLE1BQUssRUFBRyxRQUFRO29CQUNyQixLQUFJLENBQUMsY0FBYSxFQUFHLEtBQUs7b0JBQzFCLGFBQVksRUFBRyxzQkFBYztvQkFFN0I7b0JBQ0E7b0JBQ0EsR0FBRyxDQUFDLFVBQVMsR0FBSSxTQUFTLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTt3QkFDdEMsc0JBQWMsQ0FBQzs0QkFDZCxHQUFHLENBQUMsU0FBUyxFQUFFO2dDQUNkLElBQUksTUFBSyxFQUFHLFNBQVMsQ0FBQyxNQUFNO2dDQUM1QixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0NBQy9CLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dDQUN4QjtnQ0FDQSxVQUFTLEVBQUcsSUFBSTs0QkFDakI7d0JBQ0QsQ0FBQyxDQUFDO29CQUNIO2dCQUNELENBQUM7Z0JBRUQ7Ozs7OztnQkFNQSxJQUFNLFFBQU8sRUFBRyxVQUFDLFFBQWUsRUFBRSxLQUFVO29CQUMzQyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUU7d0JBQ2pCLE1BQU07b0JBQ1A7b0JBRUEsR0FBRyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFrQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBaUIsQ0FBQzt3QkFDakYsVUFBUyxFQUFHLElBQUk7b0JBQ2pCO29CQUFFLEtBQUs7d0JBQ04sTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7b0JBQ3hCO2dCQUNELENBQUM7Z0JBRUQsSUFBSSxDQUFDLEtBQUksRUFBRyxVQUNYLFdBQWlGLEVBQ2pGLFVBQW1GO29CQUVuRixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07d0JBQ2xDO3dCQUNBO3dCQUNBO3dCQUNBLFlBQVksQ0FBQzs0QkFDWixJQUFNLFNBQVEsRUFDYixLQUFJLENBQUMsTUFBSyxxQkFBb0IsRUFBRSxXQUFXLEVBQUUsV0FBVzs0QkFFekQsR0FBRyxDQUFDLE9BQU8sU0FBUSxJQUFLLFVBQVUsRUFBRTtnQ0FDbkMsSUFBSTtvQ0FDSCxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQ0FDdEM7Z0NBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtvQ0FDZixNQUFNLENBQUMsS0FBSyxDQUFDO2dDQUNkOzRCQUNEOzRCQUFFLEtBQUssR0FBRyxDQUFDLEtBQUksQ0FBQyxNQUFLLG9CQUFtQixFQUFFO2dDQUN6QyxNQUFNLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDM0I7NEJBQUUsS0FBSztnQ0FDTixPQUFPLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDNUI7d0JBQ0QsQ0FBQyxDQUFDO29CQUNILENBQUMsQ0FBQztnQkFDSCxDQUFDO2dCQUVELElBQUk7b0JBQ0gsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBa0IsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQWlCLENBQUM7Z0JBQ2xGO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQ2YsTUFBTSxtQkFBaUIsS0FBSyxDQUFDO2dCQUM5QjtZQUNEO1lBbE1PLFlBQUcsRUFBVixVQUFXLFFBQXVFO2dCQUNqRixPQUFPLElBQUksSUFBSSxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07b0JBQ3ZDLElBQU0sT0FBTSxFQUFVLEVBQUU7b0JBQ3hCLElBQUksU0FBUSxFQUFHLENBQUM7b0JBQ2hCLElBQUksTUFBSyxFQUFHLENBQUM7b0JBQ2IsSUFBSSxXQUFVLEVBQUcsSUFBSTtvQkFFckIsaUJBQWlCLEtBQWEsRUFBRSxLQUFVO3dCQUN6QyxNQUFNLENBQUMsS0FBSyxFQUFDLEVBQUcsS0FBSzt3QkFDckIsRUFBRSxRQUFRO3dCQUNWLE1BQU0sRUFBRTtvQkFDVDtvQkFFQTt3QkFDQyxHQUFHLENBQUMsV0FBVSxHQUFJLFNBQVEsRUFBRyxLQUFLLEVBQUU7NEJBQ25DLE1BQU07d0JBQ1A7d0JBQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFDaEI7b0JBRUEscUJBQXFCLEtBQWEsRUFBRSxJQUFTO3dCQUM1QyxFQUFFLEtBQUs7d0JBQ1AsR0FBRyxDQUFDLGtCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ3JCOzRCQUNBOzRCQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDO3dCQUM3Qzt3QkFBRSxLQUFLOzRCQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN0RDtvQkFDRDtvQkFFQSxJQUFJLEVBQUMsRUFBRyxDQUFDOzt3QkFDVCxJQUFJLENBQWdCLDBDQUFROzRCQUF2QixJQUFNLE1BQUs7NEJBQ2YsV0FBVyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7NEJBQ3JCLENBQUMsRUFBRTs7Ozs7Ozs7OztvQkFFSixXQUFVLEVBQUcsS0FBSztvQkFFbEIsTUFBTSxFQUFFOztnQkFDVCxDQUFDLENBQUM7WUFDSCxDQUFDO1lBRU0sYUFBSSxFQUFYLFVBQWUsUUFBK0Q7Z0JBQzdFLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBUyxPQUE4QixFQUFFLE1BQU07O3dCQUM5RCxJQUFJLENBQWUsMENBQVE7NEJBQXRCLElBQU0sS0FBSTs0QkFDZCxHQUFHLENBQUMsS0FBSSxXQUFZLE9BQU8sRUFBRTtnQ0FDNUI7Z0NBQ0E7Z0NBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDOzRCQUMzQjs0QkFBRSxLQUFLO2dDQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzs0QkFDcEM7Ozs7Ozs7Ozs7O2dCQUVGLENBQUMsQ0FBQztZQUNILENBQUM7WUFFTSxlQUFNLEVBQWIsVUFBYyxNQUFZO2dCQUN6QixPQUFPLElBQUksSUFBSSxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07b0JBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDO1lBQ0gsQ0FBQztZQUlNLGdCQUFPLEVBQWQsVUFBa0IsS0FBVztnQkFDNUIsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFTLE9BQU87b0JBQy9CLE9BQU8sQ0FBSSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQztZQUNILENBQUM7WUFnSUQsd0JBQUssRUFBTCxVQUNDLFVBQWlGO2dCQUVqRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztZQUN4QyxDQUFDO1lBb0JGLGNBQUM7UUFBRCxDQTdOK0I7UUF1RXZCLEdBQUMsTUFBTSxDQUFDLE9BQU8sRUFBQyxFQUF1QixtQkFBa0M7V0FzSmhGO0FBQ0Y7QUFFQSxrQkFBZSxtQkFBVzs7Ozs7Ozs7Ozs7O0FDalExQjtBQUNBO0FBQ0E7QUFRVyxlQUFNLEVBQXNCLGdCQUFNLENBQUMsTUFBTTtBQUVwRCxHQUFHLENBQUMsQ0FBQyxhQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7SUFDdkI7Ozs7O0lBS0EsSUFBTSxpQkFBYyxFQUFHLHdCQUF3QixLQUFVO1FBQ3hELEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksU0FBUyxDQUFDLE1BQUssRUFBRyxrQkFBa0IsQ0FBQztRQUNoRDtRQUNBLE9BQU8sS0FBSztJQUNiLENBQUM7SUFFRCxJQUFNLG1CQUFnQixFQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7SUFDaEQsSUFBTSxpQkFBYyxFQUlULE1BQU0sQ0FBQyxjQUFxQjtJQUN2QyxJQUFNLFNBQU0sRUFBRyxNQUFNLENBQUMsTUFBTTtJQUU1QixJQUFNLGVBQVksRUFBRyxNQUFNLENBQUMsU0FBUztJQUVyQyxJQUFNLGdCQUFhLEVBQThCLEVBQUU7SUFFbkQsSUFBTSxnQkFBYSxFQUFHLENBQUM7UUFDdEIsSUFBTSxRQUFPLEVBQUcsUUFBTSxDQUFDLElBQUksQ0FBQztRQUM1QixPQUFPLFVBQVMsSUFBcUI7WUFDcEMsSUFBSSxRQUFPLEVBQUcsQ0FBQztZQUNmLElBQUksSUFBWTtZQUNoQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxRQUFPLEdBQUksRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDL0MsRUFBRSxPQUFPO1lBQ1Y7WUFDQSxLQUFJLEdBQUksTUFBTSxDQUFDLFFBQU8sR0FBSSxFQUFFLENBQUM7WUFDN0IsT0FBTyxDQUFDLElBQUksRUFBQyxFQUFHLElBQUk7WUFDcEIsS0FBSSxFQUFHLEtBQUksRUFBRyxJQUFJO1lBRWxCO1lBQ0E7WUFDQSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsY0FBWSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUN6RCxnQkFBYyxDQUFDLGNBQVksRUFBRSxJQUFJLEVBQUU7b0JBQ2xDLEdBQUcsRUFBRSxVQUF1QixLQUFVO3dCQUNyQyxnQkFBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUseUJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3REO2lCQUNBLENBQUM7WUFDSDtZQUVBLE9BQU8sSUFBSTtRQUNaLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRTtJQUVKLElBQU0saUJBQWMsRUFBRyxnQkFBMkIsV0FBNkI7UUFDOUUsR0FBRyxDQUFDLEtBQUksV0FBWSxnQkFBYyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLENBQUM7UUFDOUQ7UUFDQSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDM0IsQ0FBQztJQUVELGVBQU0sRUFBRyxnQkFBTSxDQUFDLE9BQU0sRUFBRyxnQkFBOEIsV0FBNkI7UUFDbkYsR0FBRyxDQUFDLEtBQUksV0FBWSxNQUFNLEVBQUU7WUFDM0IsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztRQUM5RDtRQUNBLElBQU0sSUFBRyxFQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWMsQ0FBQyxTQUFTLENBQUM7UUFDbkQsWUFBVyxFQUFHLFlBQVcsSUFBSyxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDbEUsT0FBTyxrQkFBZ0IsQ0FBQyxHQUFHLEVBQUU7WUFDNUIsZUFBZSxFQUFFLHlCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUNoRCxRQUFRLEVBQUUseUJBQWtCLENBQUMsZUFBYSxDQUFDLFdBQVcsQ0FBQztTQUN2RCxDQUFDO0lBQ0gsQ0FBc0I7SUFFdEI7SUFDQSxnQkFBYyxDQUNiLGNBQU0sRUFDTixLQUFLLEVBQ0wseUJBQWtCLENBQUMsVUFBUyxHQUFXO1FBQ3RDLEdBQUcsQ0FBQyxlQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxlQUFhLENBQUMsR0FBRyxDQUFDO1FBQzFCO1FBQ0EsT0FBTyxDQUFDLGVBQWEsQ0FBQyxHQUFHLEVBQUMsRUFBRyxjQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQ0Y7SUFDRCxrQkFBZ0IsQ0FBQyxjQUFNLEVBQUU7UUFDeEIsTUFBTSxFQUFFLHlCQUFrQixDQUFDLFVBQVMsR0FBVztZQUM5QyxJQUFJLEdBQVc7WUFDZixnQkFBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQixJQUFJLENBQUMsSUFBRyxHQUFJLGVBQWEsRUFBRTtnQkFDMUIsR0FBRyxDQUFDLGVBQWEsQ0FBQyxHQUFHLEVBQUMsSUFBSyxHQUFHLEVBQUU7b0JBQy9CLE9BQU8sR0FBRztnQkFDWDtZQUNEO1FBQ0QsQ0FBQyxDQUFDO1FBQ0YsV0FBVyxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN4RSxrQkFBa0IsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN0RixRQUFRLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ2xFLEtBQUssRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDNUQsVUFBVSxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN0RSxPQUFPLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ2hFLE1BQU0sRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDOUQsT0FBTyxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUNoRSxLQUFLLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQzVELFdBQVcsRUFBRSx5QkFBa0IsQ0FBQyxjQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDeEUsV0FBVyxFQUFFLHlCQUFrQixDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN4RSxXQUFXLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSztLQUN2RSxDQUFDO0lBRUY7SUFDQSxrQkFBZ0IsQ0FBQyxnQkFBYyxDQUFDLFNBQVMsRUFBRTtRQUMxQyxXQUFXLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDO1FBQ3ZDLFFBQVEsRUFBRSx5QkFBa0IsQ0FDM0I7WUFDQyxPQUFPLElBQUksQ0FBQyxRQUFRO1FBQ3JCLENBQUMsRUFDRCxLQUFLLEVBQ0wsS0FBSztLQUVOLENBQUM7SUFFRjtJQUNBLGtCQUFnQixDQUFDLGNBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEMsUUFBUSxFQUFFLHlCQUFrQixDQUFDO1lBQzVCLE9BQU8sV0FBVSxFQUFTLGdCQUFjLENBQUMsSUFBSSxDQUFFLENBQUMsZ0JBQWUsRUFBRyxHQUFHO1FBQ3RFLENBQUMsQ0FBQztRQUNGLE9BQU8sRUFBRSx5QkFBa0IsQ0FBQztZQUMzQixPQUFPLGdCQUFjLENBQUMsSUFBSSxDQUFDO1FBQzVCLENBQUM7S0FDRCxDQUFDO0lBRUYsZ0JBQWMsQ0FDYixjQUFNLENBQUMsU0FBUyxFQUNoQixjQUFNLENBQUMsV0FBVyxFQUNsQix5QkFBa0IsQ0FBQztRQUNsQixPQUFPLGdCQUFjLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUNGO0lBQ0QsZ0JBQWMsQ0FBQyxjQUFNLENBQUMsU0FBUyxFQUFFLGNBQU0sQ0FBQyxXQUFXLEVBQUUseUJBQWtCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdEcsZ0JBQWMsQ0FDYixnQkFBYyxDQUFDLFNBQVMsRUFDeEIsY0FBTSxDQUFDLFdBQVcsRUFDbEIseUJBQWtCLENBQU8sY0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FDbkY7SUFDRCxnQkFBYyxDQUNiLGdCQUFjLENBQUMsU0FBUyxFQUN4QixjQUFNLENBQUMsV0FBVyxFQUNsQix5QkFBa0IsQ0FBTyxjQUFPLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUNuRjtBQUNGO0FBRUE7Ozs7O0FBS0Esa0JBQXlCLEtBQVU7SUFDbEMsT0FBTyxDQUFDLE1BQUssR0FBSSxDQUFDLE9BQU8sTUFBSyxJQUFLLFNBQVEsR0FBSSxLQUFLLENBQUMsZUFBZSxFQUFDLElBQUssUUFBUSxDQUFDLEVBQUMsR0FBSSxLQUFLO0FBQzlGO0FBRkE7QUFJQTs7O0FBR0E7SUFDQyxhQUFhO0lBQ2Isb0JBQW9CO0lBQ3BCLFVBQVU7SUFDVixTQUFTO0lBQ1QsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLGFBQWE7SUFDYixhQUFhO0lBQ2IsYUFBYTtJQUNiO0NBQ0EsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTO0lBQ25CLEdBQUcsQ0FBQyxDQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNoQyxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQU0sRUFBRSxTQUFTLEVBQUUseUJBQWtCLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEc7QUFDRCxDQUFDLENBQUM7QUFFRixrQkFBZSxjQUFNOzs7Ozs7Ozs7Ozs7QUMvTHJCO0FBQ0E7QUFDQTtBQUNBO0FBb0VXLGdCQUFPLEVBQXVCLGdCQUFNLENBQUMsT0FBTztBQU92RCxHQUFHLENBQUMsQ0FBQyxhQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7SUFDeEIsSUFBTSxVQUFPLEVBQVEsRUFBRTtJQUV2QixJQUFNLFNBQU0sRUFBRztRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFFLEVBQUcsU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFNLGVBQVksRUFBRyxDQUFDO1FBQ3JCLElBQUksUUFBTyxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRSxFQUFHLFNBQVMsQ0FBQztRQUVoRCxPQUFPO1lBQ04sT0FBTyxPQUFNLEVBQUcsUUFBTSxHQUFFLEVBQUcsQ0FBQyxPQUFPLEdBQUUsRUFBRyxJQUFJLENBQUM7UUFDOUMsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFO0lBRUosZ0JBQU87UUFJTixpQkFBWSxRQUErQztZQTJHM0QsS0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDLEVBQWMsU0FBUztZQTFHMUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO2dCQUNwQyxLQUFLLEVBQUUsY0FBWTthQUNuQixDQUFDO1lBRUYsSUFBSSxDQUFDLGVBQWMsRUFBRyxFQUFFO1lBRXhCLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLHNCQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3pDLElBQU0sS0FBSSxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0I7Z0JBQ0Q7Z0JBQUUsS0FBSzs7d0JBQ04sSUFBSSxDQUF1QiwwQ0FBUTs0QkFBeEIsOENBQVksRUFBWCxXQUFHLEVBQUUsYUFBSzs0QkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDOzs7Ozs7Ozs7O2dCQUV0QjtZQUNEOztRQUNEO1FBRVEsdUNBQW9CLEVBQTVCLFVBQTZCLEdBQVE7WUFDcEMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUcsSUFBSyxHQUFHLEVBQUU7b0JBQ3ZDLE9BQU8sQ0FBQztnQkFDVDtZQUNEO1lBRUEsT0FBTyxDQUFDLENBQUM7UUFDVixDQUFDO1FBRUQseUJBQU0sRUFBTixVQUFPLEdBQVE7WUFDZCxHQUFHLENBQUMsSUFBRyxJQUFLLFVBQVMsR0FBSSxJQUFHLElBQUssSUFBSSxFQUFFO2dCQUN0QyxPQUFPLEtBQUs7WUFDYjtZQUVBLElBQU0sTUFBSyxFQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMxQyxHQUFHLENBQUMsTUFBSyxHQUFJLEtBQUssQ0FBQyxJQUFHLElBQUssSUFBRyxHQUFJLEtBQUssQ0FBQyxNQUFLLElBQUssU0FBTyxFQUFFO2dCQUMxRCxLQUFLLENBQUMsTUFBSyxFQUFHLFNBQU87Z0JBQ3JCLE9BQU8sSUFBSTtZQUNaO1lBRUEsSUFBTSxZQUFXLEVBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztZQUNsRCxHQUFHLENBQUMsWUFBVyxHQUFJLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxJQUFJO1lBQ1o7WUFFQSxPQUFPLEtBQUs7UUFDYixDQUFDO1FBRUQsc0JBQUcsRUFBSCxVQUFJLEdBQVE7WUFDWCxHQUFHLENBQUMsSUFBRyxJQUFLLFVBQVMsR0FBSSxJQUFHLElBQUssSUFBSSxFQUFFO2dCQUN0QyxPQUFPLFNBQVM7WUFDakI7WUFFQSxJQUFNLE1BQUssRUFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUMsR0FBRyxDQUFDLE1BQUssR0FBSSxLQUFLLENBQUMsSUFBRyxJQUFLLElBQUcsR0FBSSxLQUFLLENBQUMsTUFBSyxJQUFLLFNBQU8sRUFBRTtnQkFDMUQsT0FBTyxLQUFLLENBQUMsS0FBSztZQUNuQjtZQUVBLElBQU0sWUFBVyxFQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7WUFDbEQsR0FBRyxDQUFDLFlBQVcsR0FBSSxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLO1lBQzlDO1FBQ0QsQ0FBQztRQUVELHNCQUFHLEVBQUgsVUFBSSxHQUFRO1lBQ1gsR0FBRyxDQUFDLElBQUcsSUFBSyxVQUFTLEdBQUksSUFBRyxJQUFLLElBQUksRUFBRTtnQkFDdEMsT0FBTyxLQUFLO1lBQ2I7WUFFQSxJQUFNLE1BQUssRUFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFLLEdBQUksS0FBSyxDQUFDLElBQUcsSUFBSyxJQUFHLEdBQUksS0FBSyxDQUFDLE1BQUssSUFBSyxTQUFPLENBQUMsRUFBRTtnQkFDbkUsT0FBTyxJQUFJO1lBQ1o7WUFFQSxJQUFNLFlBQVcsRUFBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDO1lBQ2xELEdBQUcsQ0FBQyxZQUFXLEdBQUksQ0FBQyxFQUFFO2dCQUNyQixPQUFPLElBQUk7WUFDWjtZQUVBLE9BQU8sS0FBSztRQUNiLENBQUM7UUFFRCxzQkFBRyxFQUFILFVBQUksR0FBUSxFQUFFLEtBQVc7WUFDeEIsR0FBRyxDQUFDLENBQUMsSUFBRyxHQUFJLENBQUMsT0FBTyxJQUFHLElBQUssU0FBUSxHQUFJLE9BQU8sSUFBRyxJQUFLLFVBQVUsQ0FBQyxFQUFFO2dCQUNuRSxNQUFNLElBQUksU0FBUyxDQUFDLG9DQUFvQyxDQUFDO1lBQzFEO1lBQ0EsSUFBSSxNQUFLLEVBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxDQUFDLE1BQUssR0FBSSxLQUFLLENBQUMsSUFBRyxJQUFLLEdBQUcsRUFBRTtnQkFDaEMsTUFBSyxFQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUMzQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBRztpQkFDakIsQ0FBQztnQkFFRixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDekIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNoQztnQkFBRSxLQUFLO29CQUNOLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ3RDLEtBQUssRUFBRTtxQkFDUCxDQUFDO2dCQUNIO1lBQ0Q7WUFDQSxLQUFLLENBQUMsTUFBSyxFQUFHLEtBQUs7WUFDbkIsT0FBTyxJQUFJO1FBQ1osQ0FBQztRQUdGLGNBQUM7SUFBRCxDQWhIVSxHQWdIVDtBQUNGO0FBRUEsa0JBQWUsZUFBTzs7Ozs7Ozs7Ozs7O0FDaE50QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcUhBLEdBQUcsQ0FBQyxhQUFHLENBQUMsV0FBVyxFQUFDLEdBQUksYUFBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7SUFDOUMsYUFBSSxFQUFHLGdCQUFNLENBQUMsS0FBSyxDQUFDLElBQUk7SUFDeEIsV0FBRSxFQUFHLGdCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDcEIsbUJBQVUsRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFDMUQsYUFBSSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztJQUM5QyxhQUFJLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQzlDLGtCQUFTLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0FBQ3pEO0FBQUUsS0FBSztJQUNOO0lBQ0E7SUFFQTs7Ozs7O0lBTUEsSUFBTSxXQUFRLEVBQUcsa0JBQWtCLE1BQWM7UUFDaEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQixPQUFPLENBQUM7UUFDVDtRQUVBLE9BQU0sRUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckIsT0FBTSxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzVCO1FBQ0E7UUFDQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUseUJBQWdCLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7SUFNQSxJQUFNLFlBQVMsRUFBRyxtQkFBbUIsS0FBVTtRQUM5QyxNQUFLLEVBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNyQixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQztRQUNUO1FBQ0EsR0FBRyxDQUFDLE1BQUssSUFBSyxFQUFDLEdBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEMsT0FBTyxLQUFLO1FBQ2I7UUFFQSxPQUFPLENBQUMsTUFBSyxFQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7Ozs7O0lBT0EsSUFBTSxrQkFBZSxFQUFHLHlCQUF5QixLQUFhLEVBQUUsTUFBYztRQUM3RSxPQUFPLE1BQUssRUFBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFNLEVBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztJQUN6RSxDQUFDO0lBRUQsYUFBSSxFQUFHLGNBRU4sU0FBeUMsRUFDekMsV0FBbUMsRUFDbkMsT0FBYTtRQUViLEdBQUcsQ0FBQyxVQUFTLEdBQUksSUFBSSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxTQUFTLENBQUMscUNBQXFDLENBQUM7UUFDM0Q7UUFFQSxHQUFHLENBQUMsWUFBVyxHQUFJLE9BQU8sRUFBRTtZQUMzQixZQUFXLEVBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEM7UUFFQTtRQUNBLElBQU0sWUFBVyxFQUFHLElBQUk7UUFDeEIsSUFBTSxPQUFNLEVBQVcsVUFBUSxDQUFPLFNBQVUsQ0FBQyxNQUFNLENBQUM7UUFFeEQ7UUFDQSxJQUFNLE1BQUssRUFDVixPQUFPLFlBQVcsSUFBSyxXQUFXLEVBQVMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRS9GLEdBQUcsQ0FBQyxDQUFDLHNCQUFXLENBQUMsU0FBUyxFQUFDLEdBQUksQ0FBQyxxQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RELE9BQU8sS0FBSztRQUNiO1FBRUE7UUFDQTtRQUNBLEdBQUcsQ0FBQyxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNCLEdBQUcsQ0FBQyxPQUFNLElBQUssQ0FBQyxFQUFFO2dCQUNqQixPQUFPLEVBQUU7WUFDVjtZQUVBLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsRUFBRyxZQUFZLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3JFO1FBQ0Q7UUFBRSxLQUFLO1lBQ04sSUFBSSxFQUFDLEVBQUcsQ0FBQzs7Z0JBQ1QsSUFBSSxDQUFnQiw0Q0FBUztvQkFBeEIsSUFBTSxNQUFLO29CQUNmLEtBQUssQ0FBQyxDQUFDLEVBQUMsRUFBRyxZQUFZLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLO29CQUN0RCxDQUFDLEVBQUU7Ozs7Ozs7Ozs7UUFFTDtRQUVBLEdBQUcsQ0FBTyxTQUFVLENBQUMsT0FBTSxJQUFLLFNBQVMsRUFBRTtZQUMxQyxLQUFLLENBQUMsT0FBTSxFQUFHLE1BQU07UUFDdEI7UUFFQSxPQUFPLEtBQUs7O0lBQ2IsQ0FBQztJQUVELFdBQUUsRUFBRztRQUFlO2FBQUEsVUFBYSxFQUFiLHFCQUFhLEVBQWIsSUFBYTtZQUFiOztRQUNuQixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUVELG1CQUFVLEVBQUcsb0JBQ1osTUFBb0IsRUFDcEIsTUFBYyxFQUNkLEtBQWEsRUFDYixHQUFZO1FBRVosR0FBRyxDQUFDLE9BQU0sR0FBSSxJQUFJLEVBQUU7WUFDbkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpREFBaUQsQ0FBQztRQUN2RTtRQUVBLElBQU0sT0FBTSxFQUFHLFVBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RDLE9BQU0sRUFBRyxpQkFBZSxDQUFDLFdBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDbkQsTUFBSyxFQUFHLGlCQUFlLENBQUMsV0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUNqRCxJQUFHLEVBQUcsaUJBQWUsQ0FBQyxJQUFHLElBQUssVUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQzFFLElBQUksTUFBSyxFQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBRyxFQUFHLEtBQUssRUFBRSxPQUFNLEVBQUcsTUFBTSxDQUFDO1FBRWxELElBQUksVUFBUyxFQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLE9BQU0sRUFBRyxNQUFLLEdBQUksT0FBTSxFQUFHLE1BQUssRUFBRyxLQUFLLEVBQUU7WUFDN0MsVUFBUyxFQUFHLENBQUMsQ0FBQztZQUNkLE1BQUssR0FBSSxNQUFLLEVBQUcsQ0FBQztZQUNsQixPQUFNLEdBQUksTUFBSyxFQUFHLENBQUM7UUFDcEI7UUFFQSxPQUFPLE1BQUssRUFBRyxDQUFDLEVBQUU7WUFDakIsR0FBRyxDQUFDLE1BQUssR0FBSSxNQUFNLEVBQUU7Z0JBQ25CLE1BQStCLENBQUMsTUFBTSxFQUFDLEVBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6RDtZQUFFLEtBQUs7Z0JBQ04sT0FBUSxNQUErQixDQUFDLE1BQU0sQ0FBQztZQUNoRDtZQUVBLE9BQU0sR0FBSSxTQUFTO1lBQ25CLE1BQUssR0FBSSxTQUFTO1lBQ2xCLEtBQUssRUFBRTtRQUNSO1FBRUEsT0FBTyxNQUFNO0lBQ2QsQ0FBQztJQUVELGFBQUksRUFBRyxjQUFpQixNQUFvQixFQUFFLEtBQVUsRUFBRSxLQUFjLEVBQUUsR0FBWTtRQUNyRixJQUFNLE9BQU0sRUFBRyxVQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN0QyxJQUFJLEVBQUMsRUFBRyxpQkFBZSxDQUFDLFdBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDakQsSUFBRyxFQUFHLGlCQUFlLENBQUMsSUFBRyxJQUFLLFVBQVUsRUFBRSxPQUFPLEVBQUUsV0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUUxRSxPQUFPLEVBQUMsRUFBRyxHQUFHLEVBQUU7WUFDZCxNQUErQixDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUcsS0FBSztRQUM5QztRQUVBLE9BQU8sTUFBTTtJQUNkLENBQUM7SUFFRCxhQUFJLEVBQUcsY0FBaUIsTUFBb0IsRUFBRSxRQUF5QixFQUFFLE9BQVk7UUFDcEYsSUFBTSxNQUFLLEVBQUcsaUJBQVMsQ0FBSSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztRQUNyRCxPQUFPLE1BQUssSUFBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsU0FBUztJQUNoRCxDQUFDO0lBRUQsa0JBQVMsRUFBRyxtQkFBc0IsTUFBb0IsRUFBRSxRQUF5QixFQUFFLE9BQVk7UUFDOUYsSUFBTSxPQUFNLEVBQUcsVUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFdEMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2QsTUFBTSxJQUFJLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQztRQUNoRTtRQUVBLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDWixTQUFRLEVBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDbEM7UUFFQSxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUM7WUFDVDtRQUNEO1FBRUEsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0FBQ0Y7QUFFQSxHQUFHLENBQUMsYUFBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQ3JCLGlCQUFRLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQ3ZEO0FBQUUsS0FBSztJQUNOOzs7Ozs7SUFNQSxJQUFNLFdBQVEsRUFBRyxrQkFBa0IsTUFBYztRQUNoRCxPQUFNLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQztRQUNUO1FBQ0EsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQixPQUFNLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDNUI7UUFDQTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSx5QkFBZ0IsQ0FBQztJQUN2RCxDQUFDO0lBRUQsaUJBQVEsRUFBRyxrQkFBcUIsTUFBb0IsRUFBRSxhQUFnQixFQUFFLFNBQXFCO1FBQXJCLHlDQUFxQjtRQUM1RixJQUFJLElBQUcsRUFBRyxVQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUVqQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsU0FBUyxFQUFFLEVBQUMsRUFBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckMsSUFBTSxlQUFjLEVBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQyxHQUFHLENBQ0YsY0FBYSxJQUFLLGVBQWM7Z0JBQ2hDLENBQUMsY0FBYSxJQUFLLGNBQWEsR0FBSSxlQUFjLElBQUssY0FBYyxDQUN0RSxFQUFFO2dCQUNELE9BQU8sSUFBSTtZQUNaO1FBQ0Q7UUFFQSxPQUFPLEtBQUs7SUFDYixDQUFDO0FBQ0Y7Ozs7Ozs7Ozs7O0FDM1ZBLElBQU0sYUFBWSxFQUFRLENBQUM7SUFDMUIsR0FBRyxDQUFDLE9BQU8sT0FBTSxJQUFLLFdBQVcsRUFBRTtRQUNsQztRQUNBO1FBQ0E7UUFDQSxPQUFPLE1BQU07SUFDZDtJQUFFLEtBQUssR0FBRyxDQUFDLE9BQU8sT0FBTSxJQUFLLFdBQVcsRUFBRTtRQUN6QztRQUNBLE9BQU8sTUFBTTtJQUNkO0lBQUUsS0FBSyxHQUFHLENBQUMsT0FBTyxLQUFJLElBQUssV0FBVyxFQUFFO1FBQ3ZDO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7QUFDRCxDQUFDLENBQUMsRUFBRTtBQUVKLGtCQUFlLFlBQVk7Ozs7Ozs7Ozs7OztBQ2YzQjtBQUNBO0FBdUJBLElBQU0sV0FBVSxFQUF3QixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVMsQ0FBRTtBQUV4RTs7O0FBR0E7SUFLQyxzQkFBWSxJQUFnQztRQUhwQyxnQkFBVSxFQUFHLENBQUMsQ0FBQztRQUl0QixHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxnQkFBZSxFQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDL0M7UUFBRSxLQUFLO1lBQ04sSUFBSSxDQUFDLE1BQUssRUFBRyxJQUFJO1FBQ2xCO0lBQ0Q7SUFFQTs7O0lBR0EsNEJBQUksRUFBSjtRQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUU7UUFDbkM7UUFDQSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2hCLE9BQU8sVUFBVTtRQUNsQjtRQUNBLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFVLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDMUMsT0FBTztnQkFDTixJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVTthQUNqQztRQUNGO1FBQ0EsT0FBTyxVQUFVO0lBQ2xCLENBQUM7SUFFRCx1QkFBQyxNQUFNLENBQUMsUUFBUSxFQUFDLEVBQWpCO1FBQ0MsT0FBTyxJQUFJO0lBQ1osQ0FBQztJQUNGLG1CQUFDO0FBQUQsQ0FuQ0E7QUFBYTtBQXFDYjs7Ozs7QUFLQSxvQkFBMkIsS0FBVTtJQUNwQyxPQUFPLE1BQUssR0FBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDLElBQUssVUFBVTtBQUM3RDtBQUZBO0FBSUE7Ozs7O0FBS0EscUJBQTRCLEtBQVU7SUFDckMsT0FBTyxNQUFLLEdBQUksT0FBTyxLQUFLLENBQUMsT0FBTSxJQUFLLFFBQVE7QUFDakQ7QUFGQTtBQUlBOzs7OztBQUtBLGFBQXVCLFFBQW9DO0lBQzFELEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDekIsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQ25DO0lBQUUsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ2xDO0FBQ0Q7QUFOQTtBQW1CQTs7Ozs7OztBQU9BLGVBQ0MsUUFBNkMsRUFDN0MsUUFBMEIsRUFDMUIsT0FBYTtJQUViLElBQUksT0FBTSxFQUFHLEtBQUs7SUFFbEI7UUFDQyxPQUFNLEVBQUcsSUFBSTtJQUNkO0lBRUE7SUFDQSxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBQyxHQUFJLE9BQU8sU0FBUSxJQUFLLFFBQVEsRUFBRTtRQUMxRCxJQUFNLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTTtRQUN6QixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDM0IsSUFBSSxLQUFJLEVBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsRUFBQyxFQUFHLEVBQUMsRUFBRyxDQUFDLEVBQUU7Z0JBQ2QsSUFBTSxLQUFJLEVBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQyxLQUFJLEdBQUksNEJBQWtCLEdBQUksS0FBSSxHQUFJLDJCQUFrQixFQUFFO29CQUM3RCxLQUFJLEdBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QjtZQUNEO1lBQ0EsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUM7WUFDL0MsR0FBRyxDQUFDLE1BQU0sRUFBRTtnQkFDWCxNQUFNO1lBQ1A7UUFDRDtJQUNEO0lBQUUsS0FBSztRQUNOLElBQU0sU0FBUSxFQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDOUIsR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNiLElBQUksT0FBTSxFQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFFNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztnQkFDdkQsR0FBRyxDQUFDLE1BQU0sRUFBRTtvQkFDWCxNQUFNO2dCQUNQO2dCQUNBLE9BQU0sRUFBRyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ3pCO1FBQ0Q7SUFDRDtBQUNEO0FBekNBOzs7Ozs7Ozs7OztBQ25IQTtBQUVBOzs7QUFHYSxnQkFBTyxFQUFHLENBQUM7QUFFeEI7OztBQUdhLHlCQUFnQixFQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFHLENBQUM7QUFFbkQ7OztBQUdhLHlCQUFnQixFQUFHLENBQUMsd0JBQWdCO0FBRWpEOzs7Ozs7QUFNQSxlQUFzQixLQUFVO0lBQy9CLE9BQU8sT0FBTyxNQUFLLElBQUssU0FBUSxHQUFJLGdCQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN4RDtBQUZBO0FBSUE7Ozs7OztBQU1BLGtCQUF5QixLQUFVO0lBQ2xDLE9BQU8sT0FBTyxNQUFLLElBQUssU0FBUSxHQUFJLGdCQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzRDtBQUZBO0FBSUE7Ozs7OztBQU1BLG1CQUEwQixLQUFVO0lBQ25DLE9BQU8sUUFBUSxDQUFDLEtBQUssRUFBQyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUssS0FBSztBQUN0RDtBQUZBO0FBSUE7Ozs7Ozs7Ozs7QUFVQSx1QkFBOEIsS0FBVTtJQUN2QyxPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUMsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxHQUFJLHdCQUFnQjtBQUMvRDtBQUZBOzs7Ozs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFxSEEsR0FBRyxDQUFDLGFBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUN0QixJQUFNLGFBQVksRUFBRyxnQkFBTSxDQUFDLE1BQU07SUFDbEMsZUFBTSxFQUFHLFlBQVksQ0FBQyxNQUFNO0lBQzVCLGlDQUF3QixFQUFHLFlBQVksQ0FBQyx3QkFBd0I7SUFDaEUsNEJBQW1CLEVBQUcsWUFBWSxDQUFDLG1CQUFtQjtJQUN0RCw4QkFBcUIsRUFBRyxZQUFZLENBQUMscUJBQXFCO0lBQzFELFdBQUUsRUFBRyxZQUFZLENBQUMsRUFBRTtJQUNwQixhQUFJLEVBQUcsWUFBWSxDQUFDLElBQUk7QUFDekI7QUFBRSxLQUFLO0lBQ04sYUFBSSxFQUFHLHlCQUF5QixDQUFTO1FBQ3hDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssUUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE1QixDQUE0QixDQUFDO0lBQ3BFLENBQUM7SUFFRCxlQUFNLEVBQUcsZ0JBQWdCLE1BQVc7UUFBRTthQUFBLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQjs7UUFDckMsR0FBRyxDQUFDLE9BQU0sR0FBSSxJQUFJLEVBQUU7WUFDbkI7WUFDQSxNQUFNLElBQUksU0FBUyxDQUFDLDRDQUE0QyxDQUFDO1FBQ2xFO1FBRUEsSUFBTSxHQUFFLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN6QixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTtZQUMxQixHQUFHLENBQUMsVUFBVSxFQUFFO2dCQUNmO2dCQUNBLFlBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO29CQUNoQyxFQUFFLENBQUMsT0FBTyxFQUFDLEVBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDbEMsQ0FBQyxDQUFDO1lBQ0g7UUFDRCxDQUFDLENBQUM7UUFFRixPQUFPLEVBQUU7SUFDVixDQUFDO0lBRUQsaUNBQXdCLEVBQUcsa0NBQzFCLENBQU0sRUFDTixJQUFxQjtRQUVyQixHQUFHLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQixPQUFhLE1BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO1FBQ3ZEO1FBQUUsS0FBSztZQUNOLE9BQU8sTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDaEQ7SUFDRCxDQUFDO0lBRUQsNEJBQW1CLEVBQUcsNkJBQTZCLENBQU07UUFDeEQsT0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxJQUFLLFFBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQztJQUNuRixDQUFDO0lBRUQsOEJBQXFCLEVBQUcsK0JBQStCLENBQU07UUFDNUQsT0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUNqQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssY0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBM0IsQ0FBMkI7YUFDM0MsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLGFBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUE1QixDQUE0QixDQUFDO0lBQzdDLENBQUM7SUFFRCxXQUFFLEVBQUcsWUFBWSxNQUFXLEVBQUUsTUFBVztRQUN4QyxHQUFHLENBQUMsT0FBTSxJQUFLLE1BQU0sRUFBRTtZQUN0QixPQUFPLE9BQU0sSUFBSyxFQUFDLEdBQUksRUFBQyxFQUFHLE9BQU0sSUFBSyxFQUFDLEVBQUcsTUFBTSxFQUFFO1FBQ25EO1FBQ0EsT0FBTyxPQUFNLElBQUssT0FBTSxHQUFJLE9BQU0sSUFBSyxNQUFNLEVBQUU7SUFDaEQsQ0FBQztBQUNGO0FBRUEsR0FBRyxDQUFDLGFBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRTtJQUN6QixJQUFNLGFBQVksRUFBRyxnQkFBTSxDQUFDLE1BQU07SUFDbEMsa0NBQXlCLEVBQUcsWUFBWSxDQUFDLHlCQUF5QjtJQUNsRSxnQkFBTyxFQUFHLFlBQVksQ0FBQyxPQUFPO0lBQzlCLGVBQU0sRUFBRyxZQUFZLENBQUMsTUFBTTtBQUM3QjtBQUFFLEtBQUs7SUFDTixrQ0FBeUIsRUFBRyxtQ0FBbUMsQ0FBTTtRQUNwRSxPQUFPLDJCQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDbkMsVUFBQyxRQUFRLEVBQUUsR0FBRztZQUNiLFFBQVEsQ0FBQyxHQUFHLEVBQUMsRUFBRyxnQ0FBd0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFFO1lBQ2pELE9BQU8sUUFBUTtRQUNoQixDQUFDLEVBQ0QsRUFBMkMsQ0FDM0M7SUFDRixDQUFDO0lBRUQsZ0JBQU8sRUFBRyxpQkFBaUIsQ0FBTTtRQUNoQyxPQUFPLFlBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssUUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFrQixFQUE5QixDQUE4QixDQUFDO0lBQzVELENBQUM7SUFFRCxlQUFNLEVBQUcsZ0JBQWdCLENBQU07UUFDOUIsT0FBTyxZQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLFFBQUMsQ0FBQyxHQUFHLENBQUMsRUFBTixDQUFNLENBQUM7SUFDcEMsQ0FBQztBQUNGOzs7Ozs7Ozs7Ozs7QUMzTUE7QUFDQTtBQUNBO0FBc0JBOzs7QUFHYSwyQkFBa0IsRUFBRyxNQUFNO0FBRXhDOzs7QUFHYSwyQkFBa0IsRUFBRyxNQUFNO0FBRXhDOzs7QUFHYSwwQkFBaUIsRUFBRyxNQUFNO0FBRXZDOzs7QUFHYSwwQkFBaUIsRUFBRyxNQUFNO0FBcUd2QyxHQUFHLENBQUMsYUFBRyxDQUFDLFlBQVksRUFBQyxHQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQy9DLHNCQUFhLEVBQUcsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYTtJQUMzQyxZQUFHLEVBQUcsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRztJQUV2QixvQkFBVyxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztJQUM3RCxpQkFBUSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN2RCxpQkFBUSxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN2RCxrQkFBUyxFQUFHLGlCQUFVLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUN6RCxlQUFNLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQ25ELG1CQUFVLEVBQUcsaUJBQVUsQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO0FBQzVEO0FBQUUsS0FBSztJQUNOOzs7Ozs7SUFNQSxJQUFNLHlCQUFzQixFQUFHLFVBQzlCLElBQVksRUFDWixJQUFZLEVBQ1osTUFBYyxFQUNkLFFBQWdCLEVBQ2hCLEtBQXNCO1FBQXRCLHFDQUFzQjtRQUV0QixHQUFHLENBQUMsS0FBSSxHQUFJLElBQUksRUFBRTtZQUNqQixNQUFNLElBQUksU0FBUyxDQUFDLFVBQVMsRUFBRyxLQUFJLEVBQUcsNkNBQTZDLENBQUM7UUFDdEY7UUFFQSxJQUFNLE9BQU0sRUFBRyxJQUFJLENBQUMsTUFBTTtRQUMxQixTQUFRLEVBQUcsU0FBUSxJQUFLLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsUUFBUTtRQUNsRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxzQkFBYSxFQUFHO1FBQXVCO2FBQUEsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO1lBQXZCOztRQUN0QztRQUNBLElBQU0sT0FBTSxFQUFHLFNBQVMsQ0FBQyxNQUFNO1FBQy9CLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNaLE9BQU8sRUFBRTtRQUNWO1FBRUEsSUFBTSxhQUFZLEVBQUcsTUFBTSxDQUFDLFlBQVk7UUFDeEMsSUFBTSxTQUFRLEVBQUcsTUFBTTtRQUN2QixJQUFJLFVBQVMsRUFBYSxFQUFFO1FBQzVCLElBQUksTUFBSyxFQUFHLENBQUMsQ0FBQztRQUNkLElBQUksT0FBTSxFQUFHLEVBQUU7UUFFZixPQUFPLEVBQUUsTUFBSyxFQUFHLE1BQU0sRUFBRTtZQUN4QixJQUFJLFVBQVMsRUFBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXhDO1lBQ0EsSUFBSSxRQUFPLEVBQ1YsUUFBUSxDQUFDLFNBQVMsRUFBQyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDLElBQUssVUFBUyxHQUFJLFVBQVMsR0FBSSxFQUFDLEdBQUksVUFBUyxHQUFJLFFBQVE7WUFDdEcsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUNiLE1BQU0sVUFBVSxDQUFDLDRDQUEyQyxFQUFHLFNBQVMsQ0FBQztZQUMxRTtZQUVBLEdBQUcsQ0FBQyxVQUFTLEdBQUksTUFBTSxFQUFFO2dCQUN4QjtnQkFDQSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUMxQjtZQUFFLEtBQUs7Z0JBQ047Z0JBQ0E7Z0JBQ0EsVUFBUyxHQUFJLE9BQU87Z0JBQ3BCLElBQUksY0FBYSxFQUFHLENBQUMsVUFBUyxHQUFJLEVBQUUsRUFBQyxFQUFHLDBCQUFrQjtnQkFDMUQsSUFBSSxhQUFZLEVBQUcsVUFBUyxFQUFHLE1BQUssRUFBRyx5QkFBaUI7Z0JBQ3hELFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQztZQUM1QztZQUVBLEdBQUcsQ0FBQyxNQUFLLEVBQUcsRUFBQyxJQUFLLE9BQU0sR0FBSSxTQUFTLENBQUMsT0FBTSxFQUFHLFFBQVEsRUFBRTtnQkFDeEQsT0FBTSxHQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztnQkFDN0MsU0FBUyxDQUFDLE9BQU0sRUFBRyxDQUFDO1lBQ3JCO1FBQ0Q7UUFDQSxPQUFPLE1BQU07SUFDZCxDQUFDO0lBRUQsWUFBRyxFQUFHLGFBQWEsUUFBOEI7UUFBRTthQUFBLFVBQXVCLEVBQXZCLHFCQUF1QixFQUF2QixJQUF1QjtZQUF2Qjs7UUFDbEQsSUFBSSxXQUFVLEVBQUcsUUFBUSxDQUFDLEdBQUc7UUFDN0IsSUFBSSxPQUFNLEVBQUcsRUFBRTtRQUNmLElBQUksaUJBQWdCLEVBQUcsYUFBYSxDQUFDLE1BQU07UUFFM0MsR0FBRyxDQUFDLFNBQVEsR0FBSSxLQUFJLEdBQUksUUFBUSxDQUFDLElBQUcsR0FBSSxJQUFJLEVBQUU7WUFDN0MsTUFBTSxJQUFJLFNBQVMsQ0FBQyw4REFBOEQsQ0FBQztRQUNwRjtRQUVBLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsU0FBTSxFQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxFQUFHLFFBQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1RCxPQUFNLEdBQUksVUFBVSxDQUFDLENBQUMsRUFBQyxFQUFHLENBQUMsRUFBQyxFQUFHLGlCQUFnQixHQUFJLEVBQUMsRUFBRyxTQUFNLEVBQUcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDM0Y7UUFFQSxPQUFPLE1BQU07SUFDZCxDQUFDO0lBRUQsb0JBQVcsRUFBRyxxQkFBcUIsSUFBWSxFQUFFLFFBQW9CO1FBQXBCLHVDQUFvQjtRQUNwRTtRQUNBLEdBQUcsQ0FBQyxLQUFJLEdBQUksSUFBSSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUM7UUFDbkU7UUFDQSxJQUFNLE9BQU0sRUFBRyxJQUFJLENBQUMsTUFBTTtRQUUxQixHQUFHLENBQUMsU0FBUSxJQUFLLFFBQVEsRUFBRTtZQUMxQixTQUFRLEVBQUcsQ0FBQztRQUNiO1FBQ0EsR0FBRyxDQUFDLFNBQVEsRUFBRyxFQUFDLEdBQUksU0FBUSxHQUFJLE1BQU0sRUFBRTtZQUN2QyxPQUFPLFNBQVM7UUFDakI7UUFFQTtRQUNBLElBQU0sTUFBSyxFQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxNQUFLLEdBQUksMkJBQWtCLEdBQUksTUFBSyxHQUFJLDJCQUFrQixHQUFJLE9BQU0sRUFBRyxTQUFRLEVBQUcsQ0FBQyxFQUFFO1lBQ3hGO1lBQ0E7WUFDQSxJQUFNLE9BQU0sRUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVEsRUFBRyxDQUFDLENBQUM7WUFDNUMsR0FBRyxDQUFDLE9BQU0sR0FBSSwwQkFBaUIsR0FBSSxPQUFNLEdBQUkseUJBQWlCLEVBQUU7Z0JBQy9ELE9BQU8sQ0FBQyxNQUFLLEVBQUcsMEJBQWtCLEVBQUMsRUFBRyxNQUFLLEVBQUcsT0FBTSxFQUFHLDBCQUFpQixFQUFHLE9BQU87WUFDbkY7UUFDRDtRQUNBLE9BQU8sS0FBSztJQUNiLENBQUM7SUFFRCxpQkFBUSxFQUFHLGtCQUFrQixJQUFZLEVBQUUsTUFBYyxFQUFFLFdBQW9CO1FBQzlFLEdBQUcsQ0FBQyxZQUFXLEdBQUksSUFBSSxFQUFFO1lBQ3hCLFlBQVcsRUFBRyxJQUFJLENBQUMsTUFBTTtRQUMxQjtRQUVBLDZGQUFpRyxFQUFoRyxZQUFJLEVBQUUsY0FBTSxFQUFFLG1CQUFXO1FBRTFCLElBQU0sTUFBSyxFQUFHLFlBQVcsRUFBRyxNQUFNLENBQUMsTUFBTTtRQUN6QyxHQUFHLENBQUMsTUFBSyxFQUFHLENBQUMsRUFBRTtZQUNkLE9BQU8sS0FBSztRQUNiO1FBRUEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsSUFBSyxNQUFNOztJQUNqRCxDQUFDO0lBRUQsaUJBQVEsRUFBRyxrQkFBa0IsSUFBWSxFQUFFLE1BQWMsRUFBRSxRQUFvQjtRQUFwQix1Q0FBb0I7UUFDOUUsb0ZBQXFGLEVBQXBGLFlBQUksRUFBRSxjQUFNLEVBQUUsZ0JBQVE7UUFDdkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsSUFBSyxDQUFDLENBQUM7O0lBQzdDLENBQUM7SUFFRCxlQUFNLEVBQUcsZ0JBQWdCLElBQVksRUFBRSxLQUFpQjtRQUFqQixpQ0FBaUI7UUFDdkQ7UUFDQSxHQUFHLENBQUMsS0FBSSxHQUFJLElBQUksRUFBRTtZQUNqQixNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO1FBQzlEO1FBQ0EsR0FBRyxDQUFDLE1BQUssSUFBSyxLQUFLLEVBQUU7WUFDcEIsTUFBSyxFQUFHLENBQUM7UUFDVjtRQUNBLEdBQUcsQ0FBQyxNQUFLLEVBQUcsRUFBQyxHQUFJLE1BQUssSUFBSyxRQUFRLEVBQUU7WUFDcEMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxxREFBcUQsQ0FBQztRQUM1RTtRQUVBLElBQUksT0FBTSxFQUFHLEVBQUU7UUFDZixPQUFPLEtBQUssRUFBRTtZQUNiLEdBQUcsQ0FBQyxNQUFLLEVBQUcsQ0FBQyxFQUFFO2dCQUNkLE9BQU0sR0FBSSxJQUFJO1lBQ2Y7WUFDQSxHQUFHLENBQUMsTUFBSyxFQUFHLENBQUMsRUFBRTtnQkFDZCxLQUFJLEdBQUksSUFBSTtZQUNiO1lBQ0EsTUFBSyxJQUFLLENBQUM7UUFDWjtRQUNBLE9BQU8sTUFBTTtJQUNkLENBQUM7SUFFRCxtQkFBVSxFQUFHLG9CQUFvQixJQUFZLEVBQUUsTUFBYyxFQUFFLFFBQW9CO1FBQXBCLHVDQUFvQjtRQUNsRixPQUFNLEVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixzRkFBdUYsRUFBdEYsWUFBSSxFQUFFLGNBQU0sRUFBRSxnQkFBUTtRQUV2QixJQUFNLElBQUcsRUFBRyxTQUFRLEVBQUcsTUFBTSxDQUFDLE1BQU07UUFDcEMsR0FBRyxDQUFDLElBQUcsRUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3RCLE9BQU8sS0FBSztRQUNiO1FBRUEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUMsSUFBSyxNQUFNOztJQUM1QyxDQUFDO0FBQ0Y7QUFFQSxHQUFHLENBQUMsYUFBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFO0lBQ3pCLGVBQU0sRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDbkQsaUJBQVEsRUFBRyxpQkFBVSxDQUFDLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDeEQ7QUFBRSxLQUFLO0lBQ04sZUFBTSxFQUFHLGdCQUFnQixJQUFZLEVBQUUsU0FBaUIsRUFBRSxVQUF3QjtRQUF4Qiw2Q0FBd0I7UUFDakYsR0FBRyxDQUFDLEtBQUksSUFBSyxLQUFJLEdBQUksS0FBSSxJQUFLLFNBQVMsRUFBRTtZQUN4QyxNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO1FBQzlEO1FBRUEsR0FBRyxDQUFDLFVBQVMsSUFBSyxRQUFRLEVBQUU7WUFDM0IsTUFBTSxJQUFJLFVBQVUsQ0FBQyxxREFBcUQsQ0FBQztRQUM1RTtRQUVBLEdBQUcsQ0FBQyxVQUFTLElBQUssS0FBSSxHQUFJLFVBQVMsSUFBSyxVQUFTLEdBQUksVUFBUyxFQUFHLENBQUMsRUFBRTtZQUNuRSxVQUFTLEVBQUcsQ0FBQztRQUNkO1FBRUEsSUFBSSxRQUFPLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFFBQU8sRUFBRyxVQUFTLEVBQUcsT0FBTyxDQUFDLE1BQU07UUFFMUMsR0FBRyxDQUFDLFFBQU8sRUFBRyxDQUFDLEVBQUU7WUFDaEIsUUFBTztnQkFDTixjQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQztvQkFDM0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBTyxFQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDbEQ7UUFFQSxPQUFPLE9BQU87SUFDZixDQUFDO0lBRUQsaUJBQVEsRUFBRyxrQkFBa0IsSUFBWSxFQUFFLFNBQWlCLEVBQUUsVUFBd0I7UUFBeEIsNkNBQXdCO1FBQ3JGLEdBQUcsQ0FBQyxLQUFJLElBQUssS0FBSSxHQUFJLEtBQUksSUFBSyxTQUFTLEVBQUU7WUFDeEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztRQUM5RDtRQUVBLEdBQUcsQ0FBQyxVQUFTLElBQUssUUFBUSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxVQUFVLENBQUMsdURBQXVELENBQUM7UUFDOUU7UUFFQSxHQUFHLENBQUMsVUFBUyxJQUFLLEtBQUksR0FBSSxVQUFTLElBQUssVUFBUyxHQUFJLFVBQVMsRUFBRyxDQUFDLEVBQUU7WUFDbkUsVUFBUyxFQUFHLENBQUM7UUFDZDtRQUVBLElBQUksUUFBTyxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxRQUFPLEVBQUcsVUFBUyxFQUFHLE9BQU8sQ0FBQyxNQUFNO1FBRTFDLEdBQUcsQ0FBQyxRQUFPLEVBQUcsQ0FBQyxFQUFFO1lBQ2hCLFFBQU87Z0JBQ04sY0FBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQU8sRUFBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUM7b0JBQzNELFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQU8sRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFDO29CQUNoRCxPQUFPO1FBQ1Q7UUFFQSxPQUFPLE9BQU87SUFDZixDQUFDO0FBQ0Y7Ozs7Ozs7Ozs7OztBVnRYQTtBQUNBO0FBRUEsa0JBQWUsYUFBRztBQUNsQjtBQUVBO0FBRUE7QUFDQSxTQUFHLENBQ0YsV0FBVyxFQUNYO0lBQ0MsT0FBTyxDQUNOLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxXQUFHLEdBQUksZ0JBQU0sQ0FBQyxLQUFLLEVBQW5CLENBQW1CLEVBQUM7UUFDbEQsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxXQUFHLEdBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUE3QixDQUE2QixDQUFDLENBQ2pGO0FBQ0YsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVELFNBQUcsQ0FDRixnQkFBZ0IsRUFDaEI7SUFDQyxHQUFHLENBQUMsT0FBTSxHQUFJLGdCQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUNyQztRQUNBLE9BQWEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFLLENBQUM7SUFDN0Q7SUFDQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUFDLFdBQVcsRUFBRSxjQUFNLGtCQUFVLEdBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFwQyxDQUFvQyxFQUFFLElBQUksQ0FBQztBQUVsRTtBQUNBLFNBQUcsQ0FDRixTQUFTLEVBQ1Q7SUFDQyxHQUFHLENBQUMsT0FBTyxnQkFBTSxDQUFDLElBQUcsSUFBSyxVQUFVLEVBQUU7UUFDckM7Ozs7O1FBS0EsSUFBSTtZQUNILElBQU0sSUFBRyxFQUFHLElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBDLE9BQU8sQ0FDTixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztnQkFDVixPQUFPLEdBQUcsQ0FBQyxLQUFJLElBQUssV0FBVTtnQkFDOUIsYUFBRyxDQUFDLFlBQVksRUFBQztnQkFDakIsT0FBTyxHQUFHLENBQUMsT0FBTSxJQUFLLFdBQVU7Z0JBQ2hDLE9BQU8sR0FBRyxDQUFDLFFBQU8sSUFBSyxVQUFVLENBQ2pDO1FBQ0Y7UUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO1lBQ1g7WUFDQSxPQUFPLEtBQUs7UUFDYjtJQUNEO0lBQ0EsT0FBTyxLQUFLO0FBQ2IsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVEO0FBQ0EsU0FBRyxDQUNGLFVBQVUsRUFDVjtJQUNDLE9BQU87UUFDTixPQUFPO1FBQ1AsTUFBTTtRQUNOLE9BQU87UUFDUCxNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixPQUFPO1FBQ1AsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE1BQU07UUFDTjtLQUNBLENBQUMsS0FBSyxDQUFDLFVBQUMsSUFBSSxJQUFLLGNBQU8sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLElBQUssVUFBVSxFQUF2QyxDQUF1QyxDQUFDO0FBQzNELENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRCxTQUFHLENBQ0YsZUFBZSxFQUNmO0lBQ0MsR0FBRyxDQUFDLE9BQU0sR0FBSSxnQkFBTSxDQUFDLElBQUksRUFBRTtRQUMxQjtRQUNBLE9BQWEsSUFBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFDLElBQUssQ0FBQyxDQUFDO0lBQzlDO0lBQ0EsT0FBTyxLQUFLO0FBQ2IsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVEO0FBQ0EsU0FBRyxDQUNGLFlBQVksRUFDWjtJQUNDLE9BQU8sQ0FDTixhQUFHLENBQUMsWUFBWSxFQUFDO1FBQ2pCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FDaEUsVUFBQyxJQUFJLElBQUssY0FBTyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsSUFBSyxVQUFVLEVBQXpDLENBQXlDLENBQ25ELENBQ0Q7QUFDRixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUNGLGVBQWUsRUFDZjtJQUNDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLDJCQUEyQixDQUFDLENBQUMsS0FBSyxDQUM5RCxVQUFDLElBQUksSUFBSyxjQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFLLFVBQVUsRUFBekMsQ0FBeUMsQ0FDbkQ7QUFDRixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQ7QUFDQSxTQUFHLENBQUMsZUFBZSxFQUFFLGNBQU0sY0FBTyxnQkFBTSxDQUFDLFdBQVUsSUFBSyxXQUFXLEVBQXhDLENBQXdDLEVBQUUsSUFBSSxDQUFDO0FBRTFFO0FBQ0EsU0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFNLGNBQU8sZ0JBQU0sQ0FBQyxRQUFPLElBQUssWUFBVyxHQUFJLGFBQUcsQ0FBQyxZQUFZLENBQUMsRUFBMUQsQ0FBMEQsRUFBRSxJQUFJLENBQUM7QUFFMUY7QUFDQSxTQUFHLENBQ0YsU0FBUyxFQUNUO0lBQ0MsR0FBRyxDQUFDLE9BQU8sZ0JBQU0sQ0FBQyxJQUFHLElBQUssVUFBVSxFQUFFO1FBQ3JDO1FBQ0EsSUFBTSxJQUFHLEVBQUcsSUFBSSxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsR0FBSSxPQUFNLEdBQUksSUFBRyxHQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUksSUFBSyxXQUFVLEdBQUksYUFBRyxDQUFDLFlBQVksQ0FBQztJQUMxRjtJQUNBLE9BQU8sS0FBSztBQUNiLENBQUMsRUFDRCxJQUFJLENBQ0o7QUFFRDtBQUNBLFNBQUcsQ0FDRixZQUFZLEVBQ1o7SUFDQyxPQUFPLENBQ047UUFDQztRQUNBO0tBQ0EsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHLElBQUssY0FBTyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsSUFBSyxVQUFVLEVBQXhDLENBQXdDLEVBQUM7UUFDMUQ7WUFDQztZQUNBLGFBQWE7WUFDYixXQUFXO1lBQ1gsUUFBUTtZQUNSLFlBQVk7WUFDWixVQUFVO1lBQ1Y7U0FDQSxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxjQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUMsSUFBSyxVQUFVLEVBQWxELENBQWtELENBQUMsQ0FDcEU7QUFDRixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUNGLGdCQUFnQixFQUNoQjtJQUNDLHFCQUFxQixRQUE4QjtRQUFFO2FBQUEsVUFBdUIsRUFBdkIscUJBQXVCLEVBQXZCLElBQXVCO1lBQXZCOztRQUNwRCxJQUFNLE9BQU0sbUJBQU8sUUFBUSxDQUFDO1FBQzNCLE1BQWMsQ0FBQyxJQUFHLEVBQUcsUUFBUSxDQUFDLEdBQUc7UUFDbEMsT0FBTyxNQUFNO0lBQ2Q7SUFFQSxHQUFHLENBQUMsTUFBSyxHQUFJLGdCQUFNLENBQUMsTUFBTSxFQUFFO1FBQzNCLElBQUksRUFBQyxFQUFHLENBQUM7UUFDVCxJQUFJLFNBQVEsRUFBRyxXQUFXLDBGQUFNLEVBQUMsRUFBRSxLQUFILENBQUMsQ0FBRTtRQUVsQyxRQUFnQixDQUFDLElBQUcsRUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFNLGNBQWEsRUFBRyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxJQUFLLE9BQU87UUFFakUsT0FBTyxhQUFhO0lBQ3JCO0lBRUEsT0FBTyxLQUFLO0FBQ2IsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVELFNBQUcsQ0FDRixlQUFlLEVBQ2Y7SUFDQyxPQUFPLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxjQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUMsSUFBSyxVQUFVLEVBQWxELENBQWtELENBQUM7QUFDakcsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUVEO0FBQ0EsU0FBRyxDQUFDLFlBQVksRUFBRSxjQUFNLGNBQU8sZ0JBQU0sQ0FBQyxPQUFNLElBQUssWUFBVyxHQUFJLE9BQU8sTUFBTSxHQUFFLElBQUssUUFBUSxFQUFwRSxDQUFvRSxFQUFFLElBQUksQ0FBQztBQUVuRztBQUNBLFNBQUcsQ0FDRixhQUFhLEVBQ2I7SUFDQyxHQUFHLENBQUMsT0FBTyxnQkFBTSxDQUFDLFFBQU8sSUFBSyxXQUFXLEVBQUU7UUFDMUM7UUFDQSxJQUFNLEtBQUksRUFBRyxFQUFFO1FBQ2YsSUFBTSxLQUFJLEVBQUcsRUFBRTtRQUNmLElBQU0sSUFBRyxFQUFHLElBQUksZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ25CLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSyxFQUFDLEdBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDLElBQUssSUFBRyxHQUFJLGFBQUcsQ0FBQyxZQUFZLENBQUM7SUFDNUU7SUFDQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQ7QUFDQSxTQUFHLENBQUMsWUFBWSxFQUFFLGNBQU0sb0JBQUcsQ0FBQyxhQUFhLEVBQUMsR0FBSSxhQUFHLENBQUMsV0FBVyxFQUFDLEdBQUksYUFBRyxDQUFDLHNCQUFzQixDQUFDLEVBQXJFLENBQXFFLEVBQUUsSUFBSSxDQUFDO0FBQ3BHLFNBQUcsQ0FDRixhQUFhLEVBQ2I7SUFDQztJQUNBO0lBQ0EsT0FBTyxPQUFPLGdCQUFNLENBQUMsT0FBTSxJQUFLLFlBQVcsR0FBSSxPQUFPLGdCQUFNLENBQUMsWUFBVyxJQUFLLFVBQVU7QUFDeEYsQ0FBQyxFQUNELElBQUksQ0FDSjtBQUNELFNBQUcsQ0FBQyxLQUFLLEVBQUUsY0FBTSxjQUFPLGdCQUFNLENBQUMsc0JBQXFCLElBQUssVUFBVSxFQUFsRCxDQUFrRCxFQUFFLElBQUksQ0FBQztBQUMxRSxTQUFHLENBQUMsY0FBYyxFQUFFLGNBQU0sY0FBTyxnQkFBTSxDQUFDLGFBQVksSUFBSyxXQUFXLEVBQTFDLENBQTBDLEVBQUUsSUFBSSxDQUFDO0FBRTNFO0FBRUEsU0FBRyxDQUNGLHNCQUFzQixFQUN0QjtJQUNDLEdBQUcsQ0FBQyxhQUFHLENBQUMsY0FBYyxFQUFDLEdBQUksT0FBTyxDQUFDLGdCQUFNLENBQUMsaUJBQWdCLEdBQUksZ0JBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO1FBQzdGO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBTSxRQUFPLEVBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDN0M7UUFDQSxJQUFNLHFCQUFvQixFQUFHLGdCQUFNLENBQUMsaUJBQWdCLEdBQUksZ0JBQU0sQ0FBQyxzQkFBc0I7UUFDckYsSUFBTSxTQUFRLEVBQUcsSUFBSSxvQkFBb0IsQ0FBQyxjQUFZLENBQUMsQ0FBQztRQUN4RCxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFJLENBQUUsQ0FBQztRQUUvQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO1FBRTdDLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDOUM7SUFDQSxPQUFPLEtBQUs7QUFDYixDQUFDLEVBQ0QsSUFBSSxDQUNKO0FBRUQsU0FBRyxDQUNGLGtCQUFrQixFQUNsQixjQUFNLG9CQUFHLENBQUMsY0FBYyxFQUFDLEdBQUksZ0JBQU0sQ0FBQyxVQUFTLElBQUssVUFBUyxHQUFJLGdCQUFNLENBQUMsZUFBYyxJQUFLLFNBQVMsRUFBNUYsQ0FBNEYsRUFDbEcsSUFBSSxDQUNKOzs7Ozs7Ozs7Ozs7QVd4UUQ7QUFDQTtBQUdBLHFCQUFxQixJQUEyQjtJQUMvQyxHQUFHLENBQUMsS0FBSSxHQUFJLElBQUksQ0FBQyxTQUFRLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2hCO0FBQ0Q7QUFFQSx3QkFBd0IsSUFBZSxFQUFFLFVBQW9DO0lBQzVFLE9BQU87UUFDTixPQUFPLEVBQUU7WUFDUixJQUFJLENBQUMsUUFBTyxFQUFHLGNBQVksQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUSxFQUFHLEtBQUs7WUFDckIsSUFBSSxDQUFDLFNBQVEsRUFBRyxJQUFJO1lBRXBCLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsVUFBVSxFQUFFO1lBQ2I7UUFDRDtLQUNBO0FBQ0Y7QUFZQSxJQUFJLG1CQUErQjtBQUNuQyxJQUFJLFVBQXVCO0FBRTNCOzs7Ozs7QUFNYSxrQkFBUyxFQUFHLENBQUM7SUFDekIsSUFBSSxVQUFtQztJQUN2QyxJQUFJLE9BQWtDO0lBRXRDO0lBQ0EsR0FBRyxDQUFDLGFBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRTtRQUN2QixJQUFNLFFBQUssRUFBZ0IsRUFBRTtRQUU3QixnQkFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFTLEtBQXVCO1lBQ2xFO1lBQ0EsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFNLElBQUssaUJBQU0sR0FBSSxLQUFLLENBQUMsS0FBSSxJQUFLLG9CQUFvQixFQUFFO2dCQUNuRSxLQUFLLENBQUMsZUFBZSxFQUFFO2dCQUV2QixHQUFHLENBQUMsT0FBSyxDQUFDLE1BQU0sRUFBRTtvQkFDakIsV0FBVyxDQUFDLE9BQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0I7WUFDRDtRQUNELENBQUMsQ0FBQztRQUVGLFFBQU8sRUFBRyxVQUFTLElBQWU7WUFDakMsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEIsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDO1FBQzlDLENBQUM7SUFDRjtJQUFFLEtBQUssR0FBRyxDQUFDLGFBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUMvQixXQUFVLEVBQUcsZ0JBQU0sQ0FBQyxjQUFjO1FBQ2xDLFFBQU8sRUFBRyxVQUFTLElBQWU7WUFDakMsT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNGO0lBQUUsS0FBSztRQUNOLFdBQVUsRUFBRyxnQkFBTSxDQUFDLFlBQVk7UUFDaEMsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNGO0lBRUEsbUJBQW1CLFFBQWlDO1FBQ25ELElBQU0sS0FBSSxFQUFjO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFO1NBQ1Y7UUFDRCxJQUFNLEdBQUUsRUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRTdCLE9BQU8sY0FBYyxDQUNwQixJQUFJLEVBQ0osV0FBVTtZQUNUO2dCQUNDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDZixDQUFDLENBQ0Y7SUFDRjtJQUVBO0lBQ0EsT0FBTyxhQUFHLENBQUMsWUFBWTtRQUN0QixFQUFFO1FBQ0YsRUFBRSxVQUFTLFFBQWlDO1lBQzFDLG1CQUFtQixFQUFFO1lBQ3JCLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUMzQixDQUFDO0FBQ0osQ0FBQyxDQUFDLEVBQUU7QUFFSjtBQUNBO0FBQ0EsR0FBRyxDQUFDLENBQUMsYUFBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0lBQ3ZCLElBQUksb0JBQWlCLEVBQUcsS0FBSztJQUU3QixXQUFVLEVBQUcsRUFBRTtJQUNmLG9CQUFtQixFQUFHO1FBQ3JCLEdBQUcsQ0FBQyxDQUFDLG1CQUFpQixFQUFFO1lBQ3ZCLG9CQUFpQixFQUFHLElBQUk7WUFDeEIsaUJBQVMsQ0FBQztnQkFDVCxvQkFBaUIsRUFBRyxLQUFLO2dCQUV6QixHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDdEIsSUFBSSxLQUFJLFFBQXVCO29CQUMvQixPQUFPLENBQUMsS0FBSSxFQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO3dCQUNuQyxXQUFXLENBQUMsSUFBSSxDQUFDO29CQUNsQjtnQkFDRDtZQUNELENBQUMsQ0FBQztRQUNIO0lBQ0QsQ0FBQztBQUNGO0FBRUE7Ozs7Ozs7OztBQVNhLDJCQUFrQixFQUFHLENBQUM7SUFDbEMsR0FBRyxDQUFDLENBQUMsYUFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2hCLE9BQU8saUJBQVM7SUFDakI7SUFFQSw0QkFBNEIsUUFBaUM7UUFDNUQsSUFBTSxLQUFJLEVBQWM7WUFDdkIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUU7U0FDVjtRQUNELElBQU0sTUFBSyxFQUFXLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXpFLE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRTtZQUMzQixvQkFBb0IsQ0FBQyxLQUFLLENBQUM7UUFDNUIsQ0FBQyxDQUFDO0lBQ0g7SUFFQTtJQUNBLE9BQU8sYUFBRyxDQUFDLFlBQVk7UUFDdEIsRUFBRTtRQUNGLEVBQUUsVUFBUyxRQUFpQztZQUMxQyxtQkFBbUIsRUFBRTtZQUNyQixPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUNwQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLEVBQUU7QUFFSjs7Ozs7Ozs7OztBQVVXLHVCQUFjLEVBQUcsQ0FBQztJQUM1QixJQUFJLE9BQWtDO0lBRXRDLEdBQUcsQ0FBQyxhQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDckIsUUFBTyxFQUFHLFVBQVMsSUFBZTtZQUNqQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsQ0FBQztJQUNGO0lBQUUsS0FBSyxHQUFHLENBQUMsYUFBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQzlCLFFBQU8sRUFBRyxVQUFTLElBQWU7WUFDakMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDL0MsQ0FBQztJQUNGO0lBQUUsS0FBSyxHQUFHLENBQUMsYUFBRyxDQUFDLHNCQUFzQixDQUFDLEVBQUU7UUFDdkM7UUFDQSxJQUFNLHFCQUFvQixFQUFHLGdCQUFNLENBQUMsaUJBQWdCLEdBQUksZ0JBQU0sQ0FBQyxzQkFBc0I7UUFDckYsSUFBTSxPQUFJLEVBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDMUMsSUFBTSxRQUFLLEVBQWdCLEVBQUU7UUFDN0IsSUFBTSxTQUFRLEVBQUcsSUFBSSxvQkFBb0IsQ0FBQztZQUN6QyxPQUFPLE9BQUssQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO2dCQUN4QixJQUFNLEtBQUksRUFBRyxPQUFLLENBQUMsS0FBSyxFQUFFO2dCQUMxQixHQUFHLENBQUMsS0FBSSxHQUFJLElBQUksQ0FBQyxTQUFRLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDaEI7WUFDRDtRQUNELENBQUMsQ0FBQztRQUVGLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUksQ0FBRSxDQUFDO1FBRTVDLFFBQU8sRUFBRyxVQUFTLElBQWU7WUFDakMsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEIsTUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO1FBQ3RDLENBQUM7SUFDRjtJQUFFLEtBQUs7UUFDTixRQUFPLEVBQUcsVUFBUyxJQUFlO1lBQ2pDLG1CQUFtQixFQUFFO1lBQ3JCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLENBQUM7SUFDRjtJQUVBLE9BQU8sVUFBUyxRQUFpQztRQUNoRCxJQUFNLEtBQUksRUFBYztZQUN2QixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRTtTQUNWO1FBRUQsT0FBTyxDQUFDLElBQUksQ0FBQztRQUViLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDO0FBQ0YsQ0FBQyxDQUFDLEVBQUU7Ozs7Ozs7Ozs7OztBQzNOSjs7Ozs7Ozs7O0FBU0EsNEJBQ0MsS0FBUSxFQUNSLFVBQTJCLEVBQzNCLFFBQXdCLEVBQ3hCLFlBQTRCO0lBRjVCLCtDQUEyQjtJQUMzQiwwQ0FBd0I7SUFDeEIsa0RBQTRCO0lBRTVCLE9BQU87UUFDTixLQUFLLEVBQUUsS0FBSztRQUNaLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFlBQVksRUFBRTtLQUNkO0FBQ0Y7QUFaQTtBQStCQSxvQkFBMkIsY0FBdUM7SUFDakUsT0FBTyxVQUFTLE1BQVc7UUFBRTthQUFBLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZDs7UUFDNUIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7SUFDMUMsQ0FBQztBQUNGO0FBSkE7Ozs7Ozs7Ozs7OztBQ3hDQTtBQU9BO0lBQXVDO0lBR3RDLGtCQUFZLE9BQVU7UUFBdEIsWUFDQyxrQkFBTztRQUNQLEtBQUksQ0FBQyxTQUFRLEVBQUcsT0FBTzs7SUFDeEI7SUFFTyx1QkFBRyxFQUFWO1FBQ0MsT0FBTyxJQUFJLENBQUMsUUFBUTtJQUNyQixDQUFDO0lBRU0sdUJBQUcsRUFBVixVQUFXLE9BQVU7UUFDcEIsSUFBSSxDQUFDLFNBQVEsRUFBRyxPQUFPO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBWSxDQUFFLENBQUM7SUFDbEMsQ0FBQztJQUNGLGVBQUM7QUFBRCxDQWhCQSxDQUF1QyxpQkFBTztBQUFqQztBQWtCYixrQkFBZSxRQUFROzs7Ozs7Ozs7Ozs7QUN6QnZCO0FBRUE7QUFHQTs7Ozs7QUFLQSxJQUFZLGFBR1g7QUFIRCxXQUFZLGFBQWE7SUFDeEIsd0NBQXVCO0lBQ3ZCLGtDQUFpQjtBQUNsQixDQUFDLEVBSFcsY0FBYSxFQUFiLHNCQUFhLElBQWIsc0JBQWE7QUFVekI7SUFBaUM7SUFBakM7UUFBQTtRQUNTLGVBQVEsRUFBRyxJQUFJLGFBQUcsRUFBbUI7O0lBMEI5QztJQXhCUSwwQkFBRyxFQUFWLFVBQVcsR0FBVztRQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM5QixDQUFDO0lBRU0sMEJBQUcsRUFBVixVQUFXLEdBQVc7UUFDckIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDOUIsQ0FBQztJQUVNLDBCQUFHLEVBQVYsVUFBVyxPQUFnQixFQUFFLEdBQVc7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUcsQ0FBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSw4QkFBTyxFQUFkO1FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsT0FBTSxDQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVNLG1DQUFZLEVBQW5CO1FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsVUFBUyxDQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVNLDRCQUFLLEVBQVo7UUFDQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtJQUN0QixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQTNCQSxDQUFpQyxpQkFBTztBQUEzQjtBQTZCYixrQkFBZSxXQUFXOzs7Ozs7Ozs7Ozs7QUNqRDFCO0FBQ0E7QUFDQTtBQUVBO0FBY0E7OztBQUdhLHlCQUFnQixFQUFHLGdCQUFNLENBQUMsYUFBYSxDQUFDO0FBNERyRDs7Ozs7O0FBTUEsaUNBQXVFLElBQVM7SUFDL0UsT0FBTyxPQUFPLENBQUMsS0FBSSxHQUFJLElBQUksQ0FBQyxNQUFLLElBQUssd0JBQWdCLENBQUM7QUFDeEQ7QUFGQTtBQVNBLDBDQUFvRCxJQUFTO0lBQzVELE9BQU8sT0FBTyxDQUNiLEtBQUk7UUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBQztRQUM5Qix1QkFBdUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQ3RDO0FBQ0Y7QUFQQTtBQVNBOzs7QUFHQTtJQUE4QjtJQUE5Qjs7SUE4R0E7SUF0R0M7OztJQUdRLG1DQUFlLEVBQXZCLFVBQXdCLFdBQTBCLEVBQUUsSUFBc0M7UUFDekYsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNULElBQUksRUFBRSxXQUFXO1lBQ2pCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUk7U0FDSixDQUFDO0lBQ0gsQ0FBQztJQUVNLDBCQUFNLEVBQWIsVUFBYyxLQUFvQixFQUFFLElBQWtCO1FBQXREO1FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZSxJQUFLLFNBQVMsRUFBRTtZQUN2QyxJQUFJLENBQUMsZ0JBQWUsRUFBRyxJQUFJLGFBQUcsRUFBRTtRQUNqQztRQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUEyQyxLQUFLLENBQUMsUUFBUSxHQUFFLEtBQUcsQ0FBQztRQUNoRjtRQUVBLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFFckMsR0FBRyxDQUFDLEtBQUksV0FBWSxpQkFBTyxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQ1IsVUFBQyxVQUFVO2dCQUNWLEtBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7Z0JBQzNDLEtBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQztnQkFDdkMsT0FBTyxVQUFVO1lBQ2xCLENBQUMsRUFDRCxVQUFDLEtBQUs7Z0JBQ0wsTUFBTSxLQUFLO1lBQ1osQ0FBQyxDQUNEO1FBQ0Y7UUFBRSxLQUFLLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFDbEM7SUFDRCxDQUFDO0lBRU0sa0NBQWMsRUFBckIsVUFBc0IsS0FBb0IsRUFBRSxJQUFjO1FBQ3pELEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWlCLElBQUssU0FBUyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxrQkFBaUIsRUFBRyxJQUFJLGFBQUcsRUFBRTtRQUNuQztRQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQTZDLEtBQUssQ0FBQyxRQUFRLEdBQUUsS0FBRyxDQUFDO1FBQ2xGO1FBRUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRU0sdUJBQUcsRUFBVixVQUFnRSxLQUFvQjtRQUFwRjtRQUNDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckIsT0FBTyxJQUFJO1FBQ1o7UUFFQSxJQUFNLEtBQUksRUFBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFFNUMsR0FBRyxDQUFDLHVCQUF1QixDQUFJLElBQUksQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSTtRQUNaO1FBRUEsR0FBRyxDQUFDLEtBQUksV0FBWSxpQkFBTyxFQUFFO1lBQzVCLE9BQU8sSUFBSTtRQUNaO1FBRUEsSUFBTSxRQUFPLEVBQW1DLElBQUssRUFBRTtRQUN2RCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxJQUFJLENBQ1gsVUFBQyxVQUFVO1lBQ1YsR0FBRyxDQUFDLGdDQUFnQyxDQUFJLFVBQVUsQ0FBQyxFQUFFO2dCQUNwRCxXQUFVLEVBQUcsVUFBVSxDQUFDLE9BQU87WUFDaEM7WUFFQSxLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1lBQzNDLEtBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUN2QyxPQUFPLFVBQVU7UUFDbEIsQ0FBQyxFQUNELFVBQUMsS0FBSztZQUNMLE1BQU0sS0FBSztRQUNaLENBQUMsQ0FDRDtRQUVELE9BQU8sSUFBSTtJQUNaLENBQUM7SUFFTSwrQkFBVyxFQUFsQixVQUF1QyxLQUFvQjtRQUMxRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE9BQU8sSUFBSTtRQUNaO1FBRUEsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBTTtJQUM5QyxDQUFDO0lBRU0sdUJBQUcsRUFBVixVQUFXLEtBQW9CO1FBQzlCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZSxHQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTSwrQkFBVyxFQUFsQixVQUFtQixLQUFvQjtRQUN0QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWlCLEdBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0YsZUFBQztBQUFELENBOUdBLENBQThCLGlCQUFPO0FBQXhCO0FBZ0hiLGtCQUFlLFFBQVE7Ozs7Ozs7Ozs7OztBQzVOdkI7QUFDQTtBQUdBO0FBT0E7SUFBcUM7SUFNcEM7UUFBQSxZQUNDLGtCQUFPO1FBTkEsZ0JBQVMsRUFBRyxJQUFJLG1CQUFRLEVBQUU7UUFDMUIsOEJBQXVCLEVBQW1DLElBQUksU0FBRyxFQUFFO1FBQ25FLGdDQUF5QixFQUFtQyxJQUFJLFNBQUcsRUFBRTtRQUs1RSxLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsSUFBTSxRQUFPLEVBQUc7WUFDZixHQUFHLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsS0FBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDO2dCQUN0RCxLQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3hELEtBQUksQ0FBQyxhQUFZLEVBQUcsU0FBUztZQUM5QjtRQUNELENBQUM7UUFDRCxLQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxXQUFFLENBQUM7O0lBQ3RCO0lBRUEsc0JBQVcsaUNBQUk7YUFBZixVQUFnQixZQUFzQjtZQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUN0RCxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDekQ7WUFDQSxJQUFJLENBQUMsYUFBWSxFQUFHLFlBQVk7UUFDakMsQ0FBQzs7OztJQUVNLGlDQUFNLEVBQWIsVUFBYyxLQUFvQixFQUFFLE1BQW9CO1FBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7SUFDckMsQ0FBQztJQUVNLHlDQUFjLEVBQXJCLFVBQXNCLEtBQW9CLEVBQUUsUUFBa0I7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUMvQyxDQUFDO0lBRU0sOEJBQUcsRUFBVixVQUFXLEtBQW9CO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEdBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFZLEdBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVNLHNDQUFXLEVBQWxCLFVBQW1CLEtBQW9CO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFDLEdBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFZLEdBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0csQ0FBQztJQUVNLDhCQUFHLEVBQVYsVUFDQyxLQUFvQixFQUNwQixnQkFBaUM7UUFBakMsMkRBQWlDO1FBRWpDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztJQUMvRSxDQUFDO0lBRU0sc0NBQVcsRUFBbEIsVUFBdUMsS0FBb0IsRUFBRSxnQkFBaUM7UUFBakMsMkRBQWlDO1FBQzdGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztJQUN6RixDQUFDO0lBRU8sK0JBQUksRUFBWixVQUNDLEtBQW9CLEVBQ3BCLGdCQUF5QixFQUN6QixlQUFzQyxFQUN0QyxRQUF3QztRQUp6QztRQU1DLElBQU0sV0FBVSxFQUFHLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDL0csSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFNLFNBQVEsRUFBUSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25DLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDZCxRQUFRO1lBQ1Q7WUFDQSxJQUFNLEtBQUksRUFBRyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzdDLElBQU0saUJBQWdCLEVBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUMsR0FBSSxFQUFFO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJO1lBQ1o7WUFBRSxLQUFLLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLElBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xELElBQU0sT0FBTSxFQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQUMsS0FBMEI7b0JBQzVELEdBQUcsQ0FDRixLQUFLLENBQUMsT0FBTSxJQUFLLFNBQVE7d0JBQ3hCLEtBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUMsSUFBSyxLQUFLLENBQUMsSUFDbkUsRUFBRTt3QkFDRCxLQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQVksQ0FBRSxDQUFDO29CQUNsQztnQkFDRCxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxtQkFBTSxnQkFBZ0IsR0FBRSxLQUFLLEdBQUU7WUFDckQ7UUFDRDtRQUNBLE9BQU8sSUFBSTtJQUNaLENBQUM7SUFDRixzQkFBQztBQUFELENBckZBLENBQXFDLGlCQUFPO0FBQS9CO0FBdUZiLGtCQUFlLGVBQWU7Ozs7Ozs7Ozs7OztBQ2xHOUI7QUFDQTtBQUNBO0FBQ0E7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQWVBLElBQU0sYUFBWSxFQUFHLElBQUksYUFBRyxFQUFnQztBQUM1RCxJQUFNLFVBQVMsRUFBRyxXQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUVqQzs7O0FBR0E7SUE4Q0M7OztJQUdBO1FBQUE7UUF0Q0E7OztRQUdRLHdCQUFrQixFQUFHLElBQUk7UUFPakM7OztRQUdRLDBCQUFvQixFQUFhLEVBQUU7UUFvQm5DLGtCQUFZLEVBQWdCLElBQUkscUJBQVcsRUFBRTtRQU1wRCxJQUFJLENBQUMsVUFBUyxFQUFHLEVBQUU7UUFDbkIsSUFBSSxDQUFDLGdCQUFlLEVBQUcsSUFBSSxhQUFHLEVBQWlCO1FBQy9DLElBQUksQ0FBQyxZQUFXLEVBQU0sRUFBRTtRQUN4QixJQUFJLENBQUMsaUJBQWdCLEVBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzlDLElBQUksQ0FBQyxpQkFBZ0IsRUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFbEQsd0JBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtZQUMzQixLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFBRTtnQkFDVCxLQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLENBQUM7WUFDRCxRQUFRLEVBQUU7Z0JBQ1QsS0FBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZixLQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hCLENBQUM7WUFDRCxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDOUIsUUFBUSxFQUFFO2dCQUNULE9BQU8sS0FBSSxDQUFDLFFBQVE7WUFDckIsQ0FBQztZQUNELGNBQWMsRUFBRSxFQUFvQjtZQUNwQyxTQUFTLEVBQUUsS0FBSztZQUNoQixlQUFlLEVBQUU7U0FDakIsQ0FBQztRQUVGLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtJQUM3QjtJQUVVLDBCQUFJLEVBQWQsVUFBeUMsUUFBa0M7UUFDMUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxTQUFRLEVBQUcsSUFBSSxhQUFHLEVBQThDO1FBQ3RFO1FBQ0EsSUFBSSxPQUFNLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNaLE9BQU0sRUFBRyxJQUFJLFFBQVEsQ0FBQztnQkFDckIsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ2pDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDOUIsSUFBSSxFQUFFO2FBQ04sQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7UUFDcEM7UUFFQSxPQUFPLE1BQVc7SUFDbkIsQ0FBQztJQUVTLDhCQUFRLEVBQWxCO1FBQ0M7SUFDRCxDQUFDO0lBRVMsOEJBQVEsRUFBbEI7UUFDQztJQUNELENBQUM7SUFFRCxzQkFBVyxrQ0FBVTthQUFyQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFdBQVc7UUFDeEIsQ0FBQzs7OztJQUVELHNCQUFXLDJDQUFtQjthQUE5QjtZQUNDLE9BQU0saUJBQUssSUFBSSxDQUFDLG9CQUFvQjtRQUNyQyxDQUFDOzs7O0lBRU0sMkNBQXFCLEVBQTVCLFVBQTZCLGNBQThCO1FBQ2xELDhDQUFZO1FBQ3BCLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFFakQsR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsYUFBWSxJQUFLLFlBQVksRUFBRTtZQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSyxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxVQUFTLEVBQUcsSUFBSSx5QkFBZSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ3ZEO1lBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFJLEVBQUcsWUFBWTtZQUNsQyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2xCO1FBQ0EsWUFBWSxDQUFDLGVBQWMsRUFBRyxjQUFjO0lBQzdDLENBQUM7SUFFTSx1Q0FBaUIsRUFBeEIsVUFBeUIsa0JBQXNDO1FBQS9EO1FBQ0MsSUFBTSxhQUFZLEVBQUcsd0JBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRTtRQUNqRCxZQUFZLENBQUMsZ0JBQWUsRUFBRyxrQkFBa0I7UUFDakQsSUFBTSxXQUFVLEVBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDO1FBQ2hFLElBQU0sNEJBQTJCLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQztRQUMvRSxJQUFNLG9CQUFtQixFQUFhLEVBQUU7UUFDeEMsSUFBTSxjQUFhLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFN0MsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBa0IsSUFBSyxNQUFLLEdBQUksMkJBQTJCLENBQUMsT0FBTSxJQUFLLENBQUMsRUFBRTtZQUNsRixJQUFNLGNBQWEsbUJBQU8sYUFBYSxFQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFFLElBQU0sa0JBQWlCLEVBQXdCLEVBQUU7WUFDakQsSUFBTSxvQkFBbUIsRUFBUSxFQUFFO1lBQ25DLElBQUksYUFBWSxFQUFHLEtBQUs7WUFFeEIsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsSUFBTSxhQUFZLEVBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTtvQkFDbkQsUUFBUTtnQkFDVDtnQkFDQSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNwQyxJQUFNLGlCQUFnQixFQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO2dCQUN2RCxJQUFNLFlBQVcsRUFBRyxJQUFJLENBQUMscUJBQXFCLENBQzdDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDeEIsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ2hDO2dCQUNELEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFDLElBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzdELGFBQVksRUFBRyxJQUFJO29CQUNuQixJQUFNLGNBQWEsRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFnQixZQUFjLENBQUM7b0JBQ3ZFLElBQUksQ0FBQyxJQUFJLElBQUMsRUFBRyxDQUFDLEVBQUUsSUFBQyxFQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQU0sT0FBTSxFQUFHLGFBQWEsQ0FBQyxHQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7d0JBQzlELEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBTyxHQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTs0QkFDdkUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzt3QkFDdkM7d0JBQ0EsR0FBRyxDQUFDLGFBQVksR0FBSSxVQUFVLEVBQUU7NEJBQy9CLG1CQUFtQixDQUFDLFlBQVksRUFBQyxFQUFHLE1BQU0sQ0FBQyxLQUFLO3dCQUNqRDtvQkFDRDtnQkFDRDtnQkFBRSxLQUFLO29CQUNOLElBQU0sT0FBTSxFQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBTyxHQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUMsSUFBSyxDQUFDLENBQUMsRUFBRTt3QkFDdkUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDdkM7b0JBQ0EsR0FBRyxDQUFDLGFBQVksR0FBSSxVQUFVLEVBQUU7d0JBQy9CLG1CQUFtQixDQUFDLFlBQVksRUFBQyxFQUFHLE1BQU0sQ0FBQyxLQUFLO29CQUNqRDtnQkFDRDtZQUNEO1lBRUEsR0FBRyxDQUFDLFlBQVksRUFBRTtnQkFDakIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxRQUFRO29CQUN0RixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2pFO2dCQUNELENBQUMsQ0FBQztZQUNIO1lBQ0EsSUFBSSxDQUFDLFlBQVcsRUFBRyxtQkFBbUI7WUFDdEMsSUFBSSxDQUFDLHFCQUFvQixFQUFHLG1CQUFtQjtRQUNoRDtRQUFFLEtBQUs7WUFDTixJQUFJLENBQUMsbUJBQWtCLEVBQUcsS0FBSztZQUMvQixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QyxJQUFNLGFBQVksRUFBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxHQUFHLENBQUMsT0FBTyxVQUFVLENBQUMsWUFBWSxFQUFDLElBQUssVUFBVSxFQUFFO29CQUNuRCxVQUFVLENBQUMsWUFBWSxFQUFDLEVBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUNwRCxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQ3hCLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUNoQztnQkFDRjtnQkFBRSxLQUFLO29CQUNOLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZDO1lBQ0Q7WUFDQSxJQUFJLENBQUMscUJBQW9CLEVBQUcsbUJBQW1CO1lBQy9DLElBQUksQ0FBQyxZQUFXLHVCQUFRLFVBQVUsQ0FBRTtRQUNyQztRQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2xCO0lBQ0QsQ0FBQztJQUVELHNCQUFXLGdDQUFRO2FBQW5CO1lBQ0MsT0FBTyxJQUFJLENBQUMsU0FBUztRQUN0QixDQUFDOzs7O0lBRU0scUNBQWUsRUFBdEIsVUFBdUIsUUFBc0I7UUFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTSxFQUFHLEVBQUMsR0FBSSxRQUFRLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsVUFBUyxFQUFHLFFBQVE7WUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNsQjtJQUNELENBQUM7SUFFTSxnQ0FBVSxFQUFqQjtRQUNDLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFDakQsWUFBWSxDQUFDLE1BQUssRUFBRyxLQUFLO1FBQzFCLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUN2QyxJQUFJLE1BQUssRUFBRyxNQUFNLEVBQUU7UUFDcEIsTUFBSyxFQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1FBQ3pCLE9BQU8sS0FBSztJQUNiLENBQUM7SUFFTSxnQ0FBVSxFQUFqQjtRQUNDLElBQU0sYUFBWSxFQUFHLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUU7UUFDakQsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDNUIsWUFBWSxDQUFDLFVBQVUsRUFBRTtRQUMxQjtJQUNELENBQUM7SUFFUyw0QkFBTSxFQUFoQjtRQUNDLE9BQU8sS0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7OztJQU1VLGtDQUFZLEVBQXRCLFVBQXVCLFlBQW9CLEVBQUUsS0FBVTtRQUN0RCxNQUFLLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxjQUFhLEVBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3RELEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRTtnQkFDbkIsY0FBYSxFQUFHLElBQUksYUFBRyxFQUFpQjtnQkFDeEMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQztZQUNsRDtZQUVBLElBQUksc0JBQXFCLEVBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7WUFDM0QsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUU7Z0JBQzNCLHNCQUFxQixFQUFHLEVBQUU7Z0JBQzFCLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLHFCQUFxQixDQUFDO1lBQ3ZEO1lBQ0EscUJBQXFCLENBQUMsSUFBSSxPQUExQixxQkFBcUIsbUJBQVMsS0FBSztRQUNwQztRQUFFLEtBQUs7WUFDTixJQUFNLFdBQVUsRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztZQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLG1CQUFNLFVBQVUsRUFBSyxLQUFLLEVBQUU7UUFDbEU7SUFDRCxDQUFDO0lBRUQ7Ozs7Ozs7SUFPUSx5Q0FBbUIsRUFBM0IsVUFBNEIsWUFBb0I7UUFDL0MsSUFBTSxjQUFhLEVBQUcsRUFBRTtRQUV4QixJQUFJLFlBQVcsRUFBRyxJQUFJLENBQUMsV0FBVztRQUVsQyxPQUFPLFdBQVcsRUFBRTtZQUNuQixJQUFNLFlBQVcsRUFBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUNqRCxHQUFHLENBQUMsV0FBVyxFQUFFO2dCQUNoQixJQUFNLFdBQVUsRUFBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztnQkFFaEQsR0FBRyxDQUFDLFVBQVUsRUFBRTtvQkFDZixhQUFhLENBQUMsT0FBTyxPQUFyQixhQUFhLG1CQUFZLFVBQVU7Z0JBQ3BDO1lBQ0Q7WUFFQSxZQUFXLEVBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUM7UUFDakQ7UUFFQSxPQUFPLGFBQWE7SUFDckIsQ0FBQztJQUVEOzs7SUFHUSw4QkFBUSxFQUFoQjtRQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1FBQ3pCO1FBQ0EsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtnQkFDMUIsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLENBQUMsQ0FBQztRQUNIO0lBQ0QsQ0FBQztJQUVEOzs7Ozs7SUFNVSxrQ0FBWSxFQUF0QixVQUF1QixZQUFvQjtRQUMxQyxJQUFJLGNBQWEsRUFBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFFMUQsR0FBRyxDQUFDLGNBQWEsSUFBSyxTQUFTLEVBQUU7WUFDaEMsT0FBTyxhQUFhO1FBQ3JCO1FBRUEsY0FBYSxFQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUM7UUFFdEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztRQUNyRCxPQUFPLGFBQWE7SUFDckIsQ0FBQztJQUVPLCtDQUF5QixFQUFqQyxVQUNDLGFBQWtCLEVBQ2xCLG1CQUE2QjtRQUY5QjtRQUlDLElBQU0sa0JBQWlCLEVBQTZCLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO1FBRXJGLE9BQU8saUJBQWlCLENBQUMsTUFBTSxDQUFDLFVBQUMsbUJBQW1CLEVBQUUsRUFBMEI7Z0JBQXhCLHNCQUFRLEVBQUUsOEJBQVk7WUFDN0UsSUFBSSxrQkFBaUIsRUFBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxrQkFBaUIsSUFBSyxTQUFTLEVBQUU7Z0JBQ3BDLGtCQUFpQixFQUFHO29CQUNuQixrQkFBa0IsRUFBRSxFQUFFO29CQUN0QixhQUFhLEVBQUUsRUFBRTtvQkFDakIsT0FBTyxFQUFFO2lCQUNUO1lBQ0Y7WUFDQSxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUMsRUFBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztZQUNuRixpQkFBaUIsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFDLEVBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQztZQUMzRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBQyxJQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNyRCxpQkFBaUIsQ0FBQyxRQUFPLEVBQUcsSUFBSTtZQUNqQztZQUNBLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUM7WUFDcEQsT0FBTyxtQkFBbUI7UUFDM0IsQ0FBQyxFQUFFLElBQUksYUFBRyxFQUF1QyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7Ozs7SUFLUSwyQ0FBcUIsRUFBN0IsVUFBOEIsUUFBYSxFQUFFLElBQVM7UUFDckQsR0FBRyxDQUFDLE9BQU8sU0FBUSxJQUFLLFdBQVUsR0FBSSxrQ0FBdUIsQ0FBQyxRQUFRLEVBQUMsSUFBSyxLQUFLLEVBQUU7WUFDbEYsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBd0IsSUFBSyxTQUFTLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyx5QkFBd0IsRUFBRyxJQUFJLGlCQUFPLEVBR3hDO1lBQ0o7WUFDQSxJQUFNLFNBQVEsRUFBK0IsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUMsR0FBSSxFQUFFO1lBQ3hGLGtDQUFTLEVBQUUsc0JBQUs7WUFFdEIsR0FBRyxDQUFDLFVBQVMsSUFBSyxVQUFTLEdBQUksTUFBSyxJQUFLLElBQUksRUFBRTtnQkFDOUMsVUFBUyxFQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUE0QjtnQkFDMUQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLGFBQUUsS0FBSyxFQUFFLEtBQUksQ0FBRSxDQUFDO1lBQ3hFO1lBQ0EsT0FBTyxTQUFTO1FBQ2pCO1FBQ0EsT0FBTyxRQUFRO0lBQ2hCLENBQUM7SUFFRCxzQkFBVyxnQ0FBUTthQUFuQjtZQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFLLFNBQVMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLFVBQVMsRUFBRyxJQUFJLHlCQUFlLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDdkQ7WUFDQSxPQUFPLElBQUksQ0FBQyxTQUFTO1FBQ3RCLENBQUM7Ozs7SUFFTywwQ0FBb0IsRUFBNUIsVUFBNkIsVUFBZTtRQUE1QztRQUNDLElBQU0saUJBQWdCLEVBQXVCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7UUFDbEYsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7WUFDaEMsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQzdCLFVBQUMsVUFBVSxFQUFFLHdCQUF3QjtnQkFDcEMsT0FBTSxxQkFBTSxVQUFVLEVBQUssd0JBQXdCLENBQUMsSUFBSSxDQUFDLEtBQUksRUFBRSxVQUFVLENBQUM7WUFDM0UsQ0FBQyx1QkFDSSxVQUFVLEVBQ2Y7UUFDRjtRQUNBLE9BQU8sVUFBVTtJQUNsQixDQUFDO0lBRUQ7OztJQUdRLHVDQUFpQixFQUF6QjtRQUFBO1FBQ0MsSUFBTSxjQUFhLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7UUFFdkQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO1lBQzdCLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQWMsRUFBRSxvQkFBa0M7Z0JBQzlFLElBQU0sY0FBYSxFQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQztnQkFDL0YsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFO29CQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLHVFQUF1RSxDQUFDO29CQUNyRixPQUFPLE1BQU07Z0JBQ2Q7Z0JBQ0EsT0FBTyxhQUFhO1lBQ3JCLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDMUI7UUFDQSxPQUFPLElBQUksQ0FBQyxnQkFBZ0I7SUFDN0IsQ0FBQztJQUVEOzs7OztJQUtVLHFDQUFlLEVBQXpCLFVBQTBCLEtBQXNCO1FBQWhEO1FBQ0MsSUFBTSxhQUFZLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7UUFFckQsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQXNCLEVBQUUsbUJBQWdDO2dCQUNuRixPQUFPLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsS0FBSyxDQUFDO1lBQzdDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDVjtRQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUSxJQUFLLFNBQVMsRUFBRTtZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7Z0JBQzFCLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsQ0FBQyxDQUFDO1FBQ0g7UUFFQSxPQUFPLEtBQUs7SUFDYixDQUFDO0lBRU8sMkNBQXFCLEVBQTdCO1FBQUE7UUFDQyxJQUFNLGtCQUFpQixFQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7UUFFL0QsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7WUFDakMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsZ0JBQWdCLElBQUssdUJBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUEzQixDQUEyQixDQUFDO1FBQzdFO0lBQ0QsQ0FBQztJQTFiRDs7O0lBR08saUJBQUssRUFBVywyQkFBZ0I7SUF3YnhDLGlCQUFDO0NBNWJEO0FBQWE7QUE4YmIsa0JBQWUsVUFBVTs7Ozs7Ozs7Ozs7QUNyZXpCLElBQUksc0NBQXFDLEVBQUcsRUFBRTtBQUM5QyxJQUFJLHFDQUFvQyxFQUFHLEVBQUU7QUFFN0Msb0NBQW9DLE9BQW9CO0lBQ3ZELEdBQUcsQ0FBQyxtQkFBa0IsR0FBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1FBQ3hDLHNDQUFxQyxFQUFHLHFCQUFxQjtRQUM3RCxxQ0FBb0MsRUFBRyxvQkFBb0I7SUFDNUQ7SUFBRSxLQUFLLEdBQUcsQ0FBQyxhQUFZLEdBQUksT0FBTyxDQUFDLE1BQUssR0FBSSxnQkFBZSxHQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7UUFDN0Usc0NBQXFDLEVBQUcsZUFBZTtRQUN2RCxxQ0FBb0MsRUFBRyxjQUFjO0lBQ3REO0lBQUUsS0FBSztRQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUM7SUFDakQ7QUFDRDtBQUVBLG9CQUFvQixPQUFvQjtJQUN2QyxHQUFHLENBQUMscUNBQW9DLElBQUssRUFBRSxFQUFFO1FBQ2hELDBCQUEwQixDQUFDLE9BQU8sQ0FBQztJQUNwQztBQUNEO0FBRUEsdUJBQXVCLE9BQW9CLEVBQUUsY0FBMEIsRUFBRSxlQUEyQjtJQUNuRyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBRW5CLElBQUksU0FBUSxFQUFHLEtBQUs7SUFFcEIsSUFBSSxjQUFhLEVBQUc7UUFDbkIsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2QsU0FBUSxFQUFHLElBQUk7WUFDZixPQUFPLENBQUMsbUJBQW1CLENBQUMscUNBQXFDLEVBQUUsYUFBYSxDQUFDO1lBQ2pGLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxvQ0FBb0MsRUFBRSxhQUFhLENBQUM7WUFFaEYsZUFBZSxFQUFFO1FBQ2xCO0lBQ0QsQ0FBQztJQUVELGNBQWMsRUFBRTtJQUVoQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLEVBQUUsYUFBYSxDQUFDO0lBQzdFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxxQ0FBcUMsRUFBRSxhQUFhLENBQUM7QUFDL0U7QUFFQSxjQUFjLElBQWlCLEVBQUUsVUFBMkIsRUFBRSxhQUFxQixFQUFFLFVBQXNCO0lBQzFHLElBQU0sWUFBVyxFQUFHLFVBQVUsQ0FBQyxvQkFBbUIsR0FBTyxjQUFhLFdBQVM7SUFFL0UsYUFBYSxDQUNaLElBQUksRUFDSjtRQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUVqQyxxQkFBcUIsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDaEMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxFQUNEO1FBQ0MsVUFBVSxFQUFFO0lBQ2IsQ0FBQyxDQUNEO0FBQ0Y7QUFFQSxlQUFlLElBQWlCLEVBQUUsVUFBMkIsRUFBRSxjQUFzQjtJQUNwRixJQUFNLFlBQVcsRUFBRyxVQUFVLENBQUMscUJBQW9CLEdBQU8sZUFBYyxXQUFTO0lBRWpGLGFBQWEsQ0FDWixJQUFJLEVBQ0o7UUFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7UUFFbEMscUJBQXFCLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ2hDLENBQUMsQ0FBQztJQUNILENBQUMsRUFDRDtRQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDbkMsQ0FBQyxDQUNEO0FBQ0Y7QUFFQSxrQkFBZTtJQUNkLEtBQUs7SUFDTCxJQUFJO0NBQ0o7Ozs7Ozs7Ozs7OztBQ3BGRDtBQWVBOzs7QUFHYSxjQUFLLEVBQUcsZ0JBQU0sQ0FBQyx5QkFBeUIsQ0FBQztBQUV0RDs7O0FBR2EsY0FBSyxFQUFHLGdCQUFNLENBQUMseUJBQXlCLENBQUM7QUFFdEQ7OztBQUdBLGlCQUNDLEtBQWU7SUFFZixPQUFPLE9BQU8sQ0FBQyxNQUFLLEdBQUksT0FBTyxNQUFLLElBQUssU0FBUSxHQUFJLEtBQUssQ0FBQyxLQUFJLElBQUssYUFBSyxDQUFDO0FBQzNFO0FBSkE7QUFNQTs7O0FBR0EsaUJBQXdCLEtBQVk7SUFDbkMsT0FBTyxPQUFPLENBQUMsTUFBSyxHQUFJLE9BQU8sTUFBSyxJQUFLLFNBQVEsR0FBSSxLQUFLLENBQUMsS0FBSSxJQUFLLGFBQUssQ0FBQztBQUMzRTtBQUZBO0FBSUEsdUJBQThCLEtBQVU7SUFDdkMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU87QUFDdkI7QUFGQTtBQW9EQSxrQkFDQyxNQUF1QixFQUN2QixpQkFBMkQsRUFDM0QsU0FBNEI7SUFFNUIsSUFBSSxRQUFPLEVBQUcsS0FBSztJQUNuQixJQUFJLFFBQVE7SUFDWixHQUFHLENBQUMsT0FBTyxrQkFBaUIsSUFBSyxVQUFVLEVBQUU7UUFDNUMsU0FBUSxFQUFHLGlCQUFpQjtJQUM3QjtJQUFFLEtBQUs7UUFDTixTQUFRLEVBQUcsaUJBQWlCLENBQUMsUUFBUTtRQUNyQyxVQUFTLEVBQUcsaUJBQWlCLENBQUMsU0FBUztRQUN2QyxRQUFPLEVBQUcsaUJBQWlCLENBQUMsUUFBTyxHQUFJLEtBQUs7SUFDN0M7SUFFQSxJQUFJLE1BQUssRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFDLGlCQUFLLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQzFEO1FBQ0MsTUFBSyxFQUFHLEVBQUU7SUFDWDtJQUNBLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNwQixJQUFNLEtBQUksRUFBRyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDVCxHQUFHLENBQUMsQ0FBQyxRQUFPLEdBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLEdBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEUsTUFBSyxtQkFBTyxLQUFLLEVBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNyQztZQUNBLEdBQUcsQ0FBQyxDQUFDLFVBQVMsR0FBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1lBQ3hCO1FBQ0Q7SUFDRDtJQUNBLE9BQU8sTUFBTTtBQUNkO0FBL0JBO0FBaUNBOzs7QUFHQSxXQUNDLGlCQUFpRCxFQUNqRCxVQUEyQixFQUMzQixRQUE0QjtJQUE1Qix3Q0FBNEI7SUFFNUIsT0FBTztRQUNOLFFBQVE7UUFDUixpQkFBaUI7UUFDakIsVUFBVTtRQUNWLElBQUksRUFBRTtLQUNOO0FBQ0Y7QUFYQTtBQW1CQSxXQUNDLEdBQVcsRUFDWCxvQkFBZ0YsRUFDaEYsUUFBeUM7SUFEekMsZ0VBQWdGO0lBQ2hGLCtDQUF5QztJQUV6QyxJQUFJLFdBQVUsRUFBZ0Qsb0JBQW9CO0lBQ2xGLElBQUksMEJBQTBCO0lBRTlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7UUFDeEMsU0FBUSxFQUFHLG9CQUFvQjtRQUMvQixXQUFVLEVBQUcsRUFBRTtJQUNoQjtJQUVBLEdBQUcsQ0FBQyxPQUFPLFdBQVUsSUFBSyxVQUFVLEVBQUU7UUFDckMsMkJBQTBCLEVBQUcsVUFBVTtRQUN2QyxXQUFVLEVBQUcsRUFBRTtJQUNoQjtJQUVBLE9BQU87UUFDTixHQUFHO1FBQ0gsMEJBQTBCO1FBQzFCLFFBQVE7UUFDUixVQUFVO1FBQ1YsSUFBSSxFQUFFO0tBQ047QUFDRjtBQXpCQTtBQTJCQTs7O0FBR0EsYUFDQyxFQUF3RSxFQUN4RSxRQUFrQjtRQURoQixjQUFJLEVBQUUsYUFBVSxFQUFWLCtCQUFVLEVBQUUsYUFBVSxFQUFWLCtCQUFVLEVBQUUsVUFBTyxFQUFQLDRCQUFPLEVBQUUsZ0JBQWlCLEVBQWpCLHNDQUFpQjtJQUcxRCxPQUFPO1FBQ04sR0FBRyxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxFQUFFLEVBQUU7UUFDMUQsVUFBVSxFQUFFLEtBQUs7UUFDakIsVUFBVSxFQUFFLEtBQUs7UUFDakIsTUFBTSxFQUFFLEVBQUU7UUFDVixRQUFRO1FBQ1IsSUFBSSxFQUFFLGFBQUs7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2pELFFBQVE7S0FDUztBQUNuQjtBQWZBOzs7Ozs7Ozs7OztBQ2xMQTtBQU9BLHFCQUE0QixNQUFpQjtJQUM1QyxPQUFPLGlDQUFlLENBQUMsVUFBQyxNQUFNLEVBQUUsV0FBVztRQUMxQyxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQztJQUMvRSxDQUFDLENBQUM7QUFDSDtBQUpBO0FBTUEsa0JBQWUsV0FBVzs7Ozs7Ozs7Ozs7QUNiMUI7QUFTQSwwQkFBaUMsTUFBeUI7SUFDekQsT0FBTyxpQ0FBZSxDQUFDLFVBQUMsTUFBTSxFQUFFLFdBQVc7UUFDMUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQztJQUNwRixDQUFDLENBQUM7QUFDSDtBQUpBO0FBTUEsa0JBQWUsZ0JBQWdCOzs7Ozs7Ozs7OztBQ2QvQjtBQStCQTs7OztBQUlBLHVCQUEyRSxFQU1sRDtRQUx4QixZQUFHLEVBQ0gsa0JBQWUsRUFBZixvQ0FBZSxFQUNmLGtCQUFlLEVBQWYsb0NBQWUsRUFDZixjQUFXLEVBQVgsZ0NBQVcsRUFDWCxpQkFBdUMsRUFBdkMsb0ZBQXVDO0lBRXZDLE9BQU8sVUFBcUMsTUFBUztRQUNwRCxNQUFNLENBQUMsU0FBUyxDQUFDLDBCQUF5QixFQUFHO1lBQzVDLE9BQU8sRUFBRSxHQUFHO1lBQ1osVUFBVTtZQUNWLFVBQVU7WUFDVixNQUFNO1lBQ04sU0FBUztTQUNUO0lBQ0YsQ0FBQztBQUNGO0FBaEJBO0FBa0JBLGtCQUFlLGFBQWE7Ozs7Ozs7Ozs7O0FDdEQ1QjtBQUdBOzs7Ozs7O0FBT0Esc0JBQTZCLFlBQW9CLEVBQUUsWUFBa0MsRUFBRSxnQkFBMkI7SUFDakgsT0FBTyxpQ0FBZSxDQUFDLFVBQUMsTUFBTSxFQUFFLFdBQVc7UUFDMUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxrQkFBZ0IsWUFBYyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsRUFBRSxZQUFZLENBQUM7UUFDM0QsR0FBRyxDQUFDLGlCQUFnQixHQUFJLFdBQVcsRUFBRTtZQUNwQyxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtnQkFDbkMsWUFBWTtnQkFDWixRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTthQUM5QyxDQUFDO1FBQ0g7SUFDRCxDQUFDLENBQUM7QUFDSDtBQVhBO0FBYUEsa0JBQWUsWUFBWTs7Ozs7Ozs7Ozs7QUNyQjNCOzs7Ozs7QUFNQSx5QkFBZ0MsT0FBeUI7SUFDeEQsT0FBTyxVQUFTLE1BQVcsRUFBRSxXQUFvQixFQUFFLFVBQStCO1FBQ2pGLEdBQUcsQ0FBQyxPQUFPLE9BQU0sSUFBSyxVQUFVLEVBQUU7WUFDakMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBQ3JDO1FBQUUsS0FBSztZQUNOLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDO1FBQzdCO0lBQ0QsQ0FBQztBQUNGO0FBUkE7QUFVQSxrQkFBZSxlQUFlOzs7Ozs7Ozs7OztBQ2xCOUI7QUFFQTtBQUVBO0FBR0E7OztBQUdBLElBQU0sdUJBQXNCLEVBQW9DLElBQUksaUJBQU8sRUFBRTtBQTBCN0U7Ozs7Ozs7QUFPQSxnQkFBdUIsRUFBcUM7UUFBbkMsY0FBSSxFQUFFLGdDQUFhO0lBQzNDLE9BQU8saUNBQWUsQ0FBQyxVQUFDLE1BQU0sRUFBRSxXQUFXO1FBQzFDLG1DQUFnQixDQUFDLFVBQTJCLFVBQWU7WUFBMUM7WUFDaEIsSUFBTSxTQUFRLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ2hELEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsSUFBTSxvQkFBbUIsRUFBRyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLEdBQUksRUFBRTtnQkFDbEUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU0sSUFBSyxDQUFDLEVBQUU7b0JBQ3JDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUM7Z0JBQ3REO2dCQUNBLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFDLElBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ2pELFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFO3dCQUN6QixLQUFJLENBQUMsVUFBVSxFQUFFO29CQUNsQixDQUFDLENBQUM7b0JBQ0YsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDbkM7Z0JBQ0EsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsQ0FBQztZQUNqRDtRQUNELENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNYLENBQUMsQ0FBQztBQUNIO0FBbkJBO0FBcUJBLGtCQUFlLE1BQU07Ozs7Ozs7Ozs7O0FDL0RyQjtBQUVBLHlCQUF5QixLQUFVO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFLLGtCQUFpQixHQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzNGO0FBRUEsZ0JBQXVCLGdCQUFxQixFQUFFLFdBQWdCO0lBQzdELE9BQU87UUFDTixPQUFPLEVBQUUsSUFBSTtRQUNiLEtBQUssRUFBRTtLQUNQO0FBQ0Y7QUFMQTtBQU9BLGdCQUF1QixnQkFBcUIsRUFBRSxXQUFnQjtJQUM3RCxPQUFPO1FBQ04sT0FBTyxFQUFFLEtBQUs7UUFDZCxLQUFLLEVBQUU7S0FDUDtBQUNGO0FBTEE7QUFPQSxtQkFBMEIsZ0JBQXFCLEVBQUUsV0FBZ0I7SUFDaEUsT0FBTztRQUNOLE9BQU8sRUFBRSxpQkFBZ0IsSUFBSyxXQUFXO1FBQ3pDLEtBQUssRUFBRTtLQUNQO0FBQ0Y7QUFMQTtBQU9BLGlCQUF3QixnQkFBcUIsRUFBRSxXQUFnQjtJQUM5RCxJQUFJLFFBQU8sRUFBRyxLQUFLO0lBRW5CLElBQU0saUJBQWdCLEVBQUcsaUJBQWdCLEdBQUksZUFBZSxDQUFDLGdCQUFnQixDQUFDO0lBQzlFLElBQU0saUJBQWdCLEVBQUcsWUFBVyxHQUFJLGVBQWUsQ0FBQyxXQUFXLENBQUM7SUFFcEUsR0FBRyxDQUFDLENBQUMsaUJBQWdCLEdBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUMzQyxPQUFPO1lBQ04sT0FBTyxFQUFFLElBQUk7WUFDYixLQUFLLEVBQUU7U0FDUDtJQUNGO0lBRUEsSUFBTSxhQUFZLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNsRCxJQUFNLFFBQU8sRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUV4QyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU0sSUFBSyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQzNDLFFBQU8sRUFBRyxJQUFJO0lBQ2Y7SUFBRSxLQUFLO1FBQ04sUUFBTyxFQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO1lBQzFCLE9BQU8sV0FBVyxDQUFDLEdBQUcsRUFBQyxJQUFLLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztRQUNsRCxDQUFDLENBQUM7SUFDSDtJQUNBLE9BQU87UUFDTixPQUFPO1FBQ1AsS0FBSyxFQUFFO0tBQ1A7QUFDRjtBQTNCQTtBQTZCQSxjQUFxQixnQkFBcUIsRUFBRSxXQUFnQjtJQUMzRCxJQUFJLE1BQU07SUFDVixHQUFHLENBQUMsT0FBTyxZQUFXLElBQUssVUFBVSxFQUFFO1FBQ3RDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBSyxJQUFLLDJCQUFnQixFQUFFO1lBQzNDLE9BQU0sRUFBRyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO1FBQ2xEO1FBQUUsS0FBSztZQUNOLE9BQU0sRUFBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO1FBQy9DO0lBQ0Q7SUFBRSxLQUFLLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDeEMsT0FBTSxFQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7SUFDaEQ7SUFBRSxLQUFLO1FBQ04sT0FBTSxFQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7SUFDbEQ7SUFDQSxPQUFPLE1BQU07QUFDZDtBQWRBOzs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUVBO0FBRUE7OztBQUdBLElBQVksb0JBR1g7QUFIRCxXQUFZLG9CQUFvQjtJQUMvQix1RUFBWTtJQUNaLHVFQUFRO0FBQ1QsQ0FBQyxFQUhXLHFCQUFvQixFQUFwQiw2QkFBb0IsSUFBcEIsNkJBQW9CO0FBS2hDOzs7QUFHQSxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDckIsK0NBQVU7SUFDViw2Q0FBUztBQUNWLENBQUMsRUFIVyxXQUFVLEVBQVYsbUJBQVUsSUFBVixtQkFBVTtBQXlGdEIsd0JBQXdFLElBQU87SUFDOUU7UUFBd0I7UUFZdkI7WUFBWTtpQkFBQSxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkOztZQUFaLGdEQUNVLElBQUk7WUFSTixhQUFNLEVBQUcsSUFBSTtZQUliLDJCQUFvQixFQUF1QixFQUF3QjtZQUNuRSxlQUFRLEVBQWUsRUFBRTtZQUtoQyxLQUFJLENBQUMsbUJBQWtCLEVBQUc7Z0JBQ3pCLFdBQVcsRUFBRTthQUNiO1lBRUQsS0FBSSxDQUFDLEtBQUksRUFBRyxRQUFRLENBQUMsSUFBSTtZQUN6QixLQUFJLENBQUMsZUFBYyxFQUFHLG9CQUFvQixDQUFDLFFBQVE7O1FBQ3BEO1FBRU8sMkJBQU0sRUFBYixVQUFjLElBQWM7WUFDM0IsSUFBTSxRQUFPLEVBQUc7Z0JBQ2YsSUFBSSxFQUFFLFVBQVUsQ0FBQyxNQUFNO2dCQUN2QixJQUFJO2FBQ0o7WUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLENBQUM7UUFFTSwwQkFBSyxFQUFaLFVBQWEsSUFBYztZQUMxQixJQUFNLFFBQU8sRUFBRztnQkFDZixJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUs7Z0JBQ3RCLElBQUk7YUFDSjtZQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDN0IsQ0FBQztRQUVELHNCQUFXLDJCQUFJO2lCQU9mO2dCQUNDLE9BQU8sSUFBSSxDQUFDLEtBQUs7WUFDbEIsQ0FBQztpQkFURCxVQUFnQixJQUFhO2dCQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWMsSUFBSyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUU7b0JBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUM7Z0JBQzFFO2dCQUNBLElBQUksQ0FBQyxNQUFLLEVBQUcsSUFBSTtZQUNsQixDQUFDOzs7O1FBTUQsc0JBQVcsNEJBQUs7aUJBQWhCO2dCQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU07WUFDbkIsQ0FBQztpQkFFRCxVQUFpQixLQUFjO2dCQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWMsSUFBSyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUU7b0JBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUM7Z0JBQ3hFO2dCQUNBLElBQUksQ0FBQyxPQUFNLEVBQUcsS0FBSztZQUNwQixDQUFDOzs7O1FBRU0sNEJBQU8sRUFBZCxVQUFlLEdBQXdCO1lBQXZDO1lBQWUsb0NBQXdCO1lBQ3RDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBYyxJQUFLLG9CQUFvQixDQUFDLFFBQVEsRUFBRTtnQkFDMUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQztZQUNyRTtZQUNBLElBQUksQ0FBQyxPQUFNLEVBQUcsS0FBSztZQUNuQixJQUFNLGFBQVksRUFBRyxJQUFJLENBQUMsSUFBSTtZQUU5QjtZQUNBLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ1IsS0FBSSxDQUFDLE1BQUssRUFBRyxZQUFZO1lBQzFCLENBQUMsQ0FBQztZQUVGLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1o7Z0JBQ0EsSUFBSSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsRUFBUztnQkFDekMsSUFBSSxFQUFFLFVBQVUsQ0FBQzthQUNqQixDQUFDO1FBQ0gsQ0FBQztRQUVNLGdDQUFXLEVBQWxCLFVBQW1CLFFBQWlCO1lBQ25DLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFFTSxrQ0FBYSxFQUFwQixVQUFxQixVQUE4QjtZQUNsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDO1FBQ25DLENBQUM7UUFFTSxzQ0FBaUIsRUFBeEIsVUFBeUIsVUFBOEI7WUFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBb0IsR0FBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUSxJQUFLLFVBQVUsQ0FBQyxRQUFRLEVBQUU7Z0JBQzVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFO29CQUN2QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDN0M7WUFDRDtZQUNBLElBQUksQ0FBQyxxQkFBb0IsRUFBRyxhQUFNLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQztZQUNsRCxpQkFBTSxxQkFBcUIsWUFBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxTQUFRLENBQUUsQ0FBQztZQUM5RSxpQkFBTSxpQkFBaUIsWUFBQyxVQUFVLENBQUM7UUFDcEMsQ0FBQztRQUVNLDJCQUFNLEVBQWI7WUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWMsSUFBSyxvQkFBb0IsQ0FBQyxTQUFRLEdBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDO1lBQzFGO1lBQ0EsT0FBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFhLENBQUMsU0FBUztRQUNyRSxDQUFDO1FBR00sZ0NBQVcsRUFBbEIsVUFBbUIsTUFBYTtZQUMvQixJQUFJLEtBQUksRUFBRyxNQUFNO1lBQ2pCLEdBQUcsQ0FBQyxPQUFPLE9BQU0sSUFBSyxTQUFRLEdBQUksT0FBTSxJQUFLLEtBQUksR0FBSSxPQUFNLElBQUssU0FBUyxFQUFFO2dCQUMxRSxLQUFJLEVBQUcsS0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQjtZQUVBLE9BQU8sSUFBSTtRQUNaLENBQUM7UUFFTyx3QkFBRyxFQUFYLFVBQVksTUFBZ0I7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLENBQUM7UUFFTSw0QkFBTyxFQUFkO1lBQ0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7Z0JBQ2hDLElBQU0sT0FBTSxFQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUNYLE1BQU0sRUFBRTtnQkFDVDtZQUNEO1FBQ0QsQ0FBQztRQUVPLDRCQUFPLEVBQWYsVUFBZ0IsRUFBNkI7WUFBN0M7Z0JBQWtCLGNBQUksRUFBRSxjQUFJO1lBQzNCLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLEtBQUksRUFBRyxJQUFJO1lBQ2pCO1lBRUEsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFjLElBQUssb0JBQW9CLENBQUMsUUFBUSxFQUFFO2dCQUMxRCxPQUFPLElBQUksQ0FBQyxhQUFhO1lBQzFCO1lBRUEsSUFBSSxDQUFDLGVBQWMsRUFBRyxvQkFBb0IsQ0FBQyxRQUFRO1lBRW5ELElBQU0sT0FBTSxFQUFHO2dCQUNkLEdBQUcsQ0FBQyxLQUFJLENBQUMsZUFBYyxJQUFLLG9CQUFvQixDQUFDLFFBQVEsRUFBRTtvQkFDMUQsS0FBSSxDQUFDLFlBQVcsRUFBRyxTQUFTO29CQUM1QixLQUFJLENBQUMsZUFBYyxFQUFHLG9CQUFvQixDQUFDLFFBQVE7Z0JBQ3BEO1lBQ0QsQ0FBQztZQUVELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxjQUFhLEVBQUcsbUJBQVksQ0FBQyxNQUFNLENBQUM7WUFFekMsSUFBSSxDQUFDLG1CQUFrQix1QkFBUSxJQUFJLENBQUMsa0JBQWtCLEVBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTSxDQUFFLENBQUU7WUFFbkYsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDYixLQUFLLFVBQVUsQ0FBQyxNQUFNO29CQUNyQixJQUFJLENBQUMsWUFBVyxFQUFHLFVBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUN2RSxLQUFLO2dCQUNOLEtBQUssVUFBVSxDQUFDLEtBQUs7b0JBQ3BCLElBQUksQ0FBQyxZQUFXLEVBQUcsVUFBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUM7b0JBQ3RFLEtBQUs7WUFDUDtZQUVBLE9BQU8sSUFBSSxDQUFDLGFBQWE7UUFDMUIsQ0FBQztRQXZERDtZQURDLHlCQUFXLEVBQUU7Ozs7b0RBUWI7UUFpREYsZ0JBQUM7S0FyS0QsQ0FBd0IsSUFBSTtJQXVLNUIsT0FBTyxTQUFTO0FBQ2pCO0FBektBO0FBMktBLGtCQUFlLGNBQWM7Ozs7Ozs7Ozs7OztBQ3hSN0I7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQXlCQSxJQUFNLFVBQVMsRUFBRyxPQUFPO0FBRVosMkJBQWtCLEVBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQVdqRDs7O0FBR0EsZUFBc0IsS0FBUztJQUM5QixPQUFPLGlDQUFlLENBQUMsVUFBQyxNQUFNO1FBQzdCLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO0lBQy9DLENBQUMsQ0FBQztBQUNIO0FBSkE7QUFNQTs7Ozs7O0FBTUEsa0NBQWtDLE9BQXFCO0lBQ3RELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FDcEIsVUFBQyxpQkFBaUIsRUFBRSxTQUFTO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBVztZQUMxQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFBRyxHQUFHO1FBQ3hDLENBQUMsQ0FBQztRQUNGLE9BQU8saUJBQWlCO0lBQ3pCLENBQUMsRUFDVyxFQUFFLENBQ2Q7QUFDRjtBQUVBOzs7Ozs7Ozs7O0FBVUEsK0JBQXNDLEtBQVUsRUFBRSxhQUF1QjtJQUN4RSxJQUFNLGNBQWEsRUFBRyxJQUFJLG1CQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3pDLGFBQWEsQ0FBQyxjQUFjLENBQUMsMEJBQWtCLEVBQUUsYUFBYSxDQUFDO0lBQy9ELE9BQU8sYUFBYTtBQUNyQjtBQUpBO0FBTUE7OztBQUlBLHFCQUNDLElBQU87SUFXUDtRQUFxQjtRQVRyQjtZQUFBO1lBaUJDOzs7WUFHUSwrQkFBd0IsRUFBYSxFQUFFO1lBTy9DOzs7WUFHUSwwQkFBbUIsRUFBRyxJQUFJO1lBRWxDOzs7WUFHUSxhQUFNLEVBQWUsRUFBRTs7UUFrRWhDO1FBOURRLHVCQUFLLEVBQVosVUFBYSxPQUFrRDtZQUEvRDtZQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUNoQztZQUNBLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMzQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxTQUFTLElBQUssWUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQztZQUNsRTtZQUNBLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7UUFLVSxxQ0FBbUIsRUFBN0I7WUFDQyxJQUFJLENBQUMsb0JBQW1CLEVBQUcsSUFBSTtRQUNoQyxDQUFDO1FBRU8sZ0NBQWMsRUFBdEIsVUFBdUIsU0FBNkI7WUFDbkQsR0FBRyxDQUFDLFVBQVMsSUFBSyxVQUFTLEdBQUksVUFBUyxJQUFLLElBQUksRUFBRTtnQkFDbEQsT0FBTyxTQUFTO1lBQ2pCO1lBRUEsSUFBTSxhQUFZLEVBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFZLEdBQUssRUFBVTtZQUNoRSxJQUFNLGVBQWMsRUFBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsU0FBUyxDQUFDO1lBQ3JFLElBQUksaUJBQWdCLEVBQWEsRUFBRTtZQUNuQyxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUU7Z0JBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWdCLFVBQVMsd0JBQXNCLENBQUM7Z0JBQzdELE9BQU8sSUFBSTtZQUNaO1lBRUEsR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNwRDtZQUVBLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNoQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNuRDtZQUFFLEtBQUs7Z0JBQ04sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRTtZQUNBLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNsQyxDQUFDO1FBRU8sMENBQXdCLEVBQWhDO1lBQUE7WUFDUyw4QkFBVSxFQUFWLCtCQUFVO1lBQ2xCLElBQU0sV0FBVSxFQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7WUFDeEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUMvQixJQUFJLENBQUMscUJBQW9CLEVBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLGNBQWMsRUFBRSxTQUFTO29CQUN2RSxJQUFRLGNBQVcsRUFBWCxtQkFBZ0IsRUFBRSw0RUFBd0I7b0JBQ2xELEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUN2QyxPQUFNLHFCQUFNLGNBQWMsRUFBSyxPQUFPO2dCQUN2QyxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNOLElBQUksQ0FBQywrQkFBOEIsRUFBRyx3QkFBd0IsQ0FBQyxVQUFVLENBQUM7WUFDM0U7WUFFQSxJQUFJLENBQUMsT0FBTSxFQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsVUFBQyxTQUFTLEVBQUUsUUFBUTtnQkFDdEUsT0FBTSxxQkFBTSxTQUFTLEVBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUMxQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBRU4sSUFBSSxDQUFDLG9CQUFtQixFQUFHLEtBQUs7UUFDakMsQ0FBQztRQTlDRDtZQUZDLDJCQUFZLENBQUMsT0FBTyxFQUFFLGNBQU8sQ0FBQztZQUM5QiwyQkFBWSxDQUFDLGNBQWMsRUFBRSxjQUFPLENBQUM7Ozs7eURBR3JDO1FBL0NJLE9BQU07WUFUWCxlQUFNLENBQUM7Z0JBQ1AsSUFBSSxFQUFFLDBCQUFrQjtnQkFDeEIsYUFBYSxFQUFFLFVBQUMsS0FBWSxFQUFFLFVBQTRCO29CQUN6RCxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO3dCQUN0QixPQUFPLEVBQUUsS0FBSyxTQUFFO29CQUNqQjtvQkFDQSxPQUFPLEVBQUU7Z0JBQ1Y7YUFDQTtXQUNLLE1BQU0sQ0E0Rlg7UUFBRCxhQUFDO0tBNUZELENBQXFCLElBQUk7SUE4RnpCLE9BQU8sTUFBTTtBQUNkO0FBM0dBO0FBNkdBLGtCQUFlLFdBQVc7Ozs7Ozs7Ozs7OztBQ3pNMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFZLHNCQUlYO0FBSkQsV0FBWSxzQkFBc0I7SUFDakMsdUNBQWE7SUFDYix1Q0FBYTtJQUNiLHVDQUFhO0FBQ2QsQ0FBQyxFQUpXLHVCQUFzQixFQUF0QiwrQkFBc0IsSUFBdEIsK0JBQXNCO0FBTWxDLDRCQUFtQyxPQUFvQjtJQUN0RCxPQUFNO1FBQWtDO1FBQWpDOztRQW1CUDtRQWxCVyxvQ0FBTSxFQUFoQjtZQUFBO1lBQ0MsSUFBTSxXQUFVLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUNyRCxVQUFDLEtBQUssRUFBRSxHQUFXO2dCQUNsQixJQUFNLE1BQUssRUFBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUssQ0FBQyxFQUFFO29CQUM1QixJQUFHLEVBQUcsT0FBSyxHQUFLO2dCQUNqQjtnQkFDQSxLQUFLLENBQUMsR0FBRyxFQUFDLEVBQUcsS0FBSztnQkFDbEIsT0FBTyxLQUFLO1lBQ2IsQ0FBQyxFQUNELEVBQVMsQ0FDVDtZQUNELE9BQU8sT0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVSxDQUFFLENBQUM7UUFDakQsQ0FBQztRQUVELHNCQUFXLDZCQUFPO2lCQUFsQjtnQkFDQyxPQUFPLE9BQU87WUFDZixDQUFDOzs7O1FBQ0YseUJBQUM7SUFBRCxDQW5CTyxDQUFpQyx1QkFBVTtBQW9CbkQ7QUFyQkE7QUF1QkEsZ0JBQXVCLFVBQWUsRUFBRSxpQkFBc0I7SUFDckQsc0NBQVUsRUFBRSxnQ0FBUztJQUM3QixJQUFNLGFBQVksRUFBUSxFQUFFO0lBRTVCLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxZQUFvQjtRQUN2QyxJQUFNLGNBQWEsRUFBRyxZQUFZLENBQUMsV0FBVyxFQUFFO1FBQ2hELFlBQVksQ0FBQyxhQUFhLEVBQUMsRUFBRyxZQUFZO0lBQzNDLENBQUMsQ0FBQztJQUVGLE9BQU07UUFBZTtRQUFkO1lBQUE7WUFFRSxrQkFBVyxFQUFRLEVBQUU7WUFDckIsZ0JBQVMsRUFBVSxFQUFFO1lBQ3JCLHVCQUFnQixFQUFRLEVBQUU7WUFDMUIsbUJBQVksRUFBRyxLQUFLOztRQThLN0I7UUE1S1Esb0NBQWlCLEVBQXhCO1lBQUE7WUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsTUFBTTtZQUNQO1lBRUEsSUFBTSxjQUFhLEVBQVEsRUFBRTtZQUNyQixzQ0FBVSxFQUFFLGtDQUFVLEVBQUUsMEJBQU07WUFFdEMsSUFBSSxDQUFDLFlBQVcsdUJBQVEsSUFBSSxDQUFDLFdBQVcsRUFBSyxJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUU7WUFFdkYsaUJBQUksVUFBVSxFQUFLLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBQyxZQUFvQjtnQkFDM0QsSUFBTSxNQUFLLEVBQUksS0FBWSxDQUFDLFlBQVksQ0FBQztnQkFDekMsSUFBTSxxQkFBb0IsRUFBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7Z0JBQzlELEdBQUcsQ0FBQyxNQUFLLElBQUssU0FBUyxFQUFFO29CQUN4QixLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBQyxFQUFHLEtBQUs7Z0JBQ3ZDO2dCQUVBLGFBQWEsQ0FBQyxvQkFBb0IsRUFBQyxFQUFHO29CQUNyQyxHQUFHLEVBQUUsY0FBTSxZQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUEvQixDQUErQjtvQkFDMUMsR0FBRyxFQUFFLFVBQUMsS0FBVSxJQUFLLFlBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUF0QztpQkFDckI7WUFDRixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBb0I7Z0JBQ25DLElBQU0sVUFBUyxFQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRTtnQkFDL0QsSUFBTSxxQkFBb0IsRUFBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7Z0JBRWhFLGFBQWEsQ0FBQyxvQkFBb0IsRUFBQyxFQUFHO29CQUNyQyxHQUFHLEVBQUUsY0FBTSxZQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEVBQXBDLENBQW9DO29CQUMvQyxHQUFHLEVBQUUsVUFBQyxLQUFVLElBQUssWUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBM0M7aUJBQ3JCO2dCQUVELEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUMsRUFBRyxTQUFTO2dCQUMvQyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBQyxFQUFHO29CQUFDO3lCQUFBLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7d0JBQWQ7O29CQUNqQyxJQUFNLGNBQWEsRUFBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDO29CQUMxRCxHQUFHLENBQUMsT0FBTyxjQUFhLElBQUssVUFBVSxFQUFFO3dCQUN4QyxhQUFhLGdDQUFJLElBQUk7b0JBQ3RCO29CQUNBLEtBQUksQ0FBQyxhQUFhLENBQ2pCLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTt3QkFDMUIsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsTUFBTSxFQUFFO3FCQUNSLENBQUMsQ0FDRjtnQkFDRixDQUFDO1lBQ0YsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7WUFFNUMsSUFBTSxTQUFRLEVBQUcsVUFBUyxJQUFLLHNCQUFzQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBRTVGLFlBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFlO2dCQUN0QyxHQUFHLENBQUMsVUFBUyxJQUFLLHNCQUFzQixDQUFDLElBQUksRUFBRTtvQkFDOUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGNBQU0sWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQztvQkFDbEUsU0FBUyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLGNBQU0sWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQztvQkFDckUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBd0IsQ0FBQyxDQUFDO2dCQUNsRTtnQkFBRSxLQUFLO29CQUNOLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUF3QixDQUFFLENBQUMsQ0FBQztnQkFDN0Q7WUFDRCxDQUFDLENBQUM7WUFFRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxDQUFNLElBQUssWUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQztZQUUvRSxJQUFNLGlCQUFnQixFQUFHLElBQUksQ0FBQyxXQUFXO1lBQ3pDLElBQU0sZUFBYyxFQUFHLGNBQU0sWUFBSSxDQUFDLFlBQVksRUFBRSxFQUFuQixDQUFtQjtZQUNoRCxJQUFNLFFBQU87Z0JBQWlCO2dCQUFkOztnQkFJaEI7Z0JBSEMseUJBQU0sRUFBTjtvQkFDQyxPQUFPLEtBQUMsQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsQ0FBQztnQkFDaEUsQ0FBQztnQkFDRixjQUFDO1lBQUQsQ0FKZ0IsQ0FBYyx1QkFBVSxFQUl2QztZQUNELElBQU0sU0FBUSxFQUFHLElBQUksa0JBQVEsRUFBRTtZQUMvQixJQUFNLGFBQVksRUFBRyw4QkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ3RFLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsY0FBTSxtQkFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQztZQUNuRixJQUFNLFVBQVMsRUFBRywwQkFBYyxDQUFDLE9BQU8sQ0FBQztZQUN6QyxJQUFJLENBQUMsV0FBVSxFQUFHLElBQUksU0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxZQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRTVCLElBQUksQ0FBQyxhQUFZLEVBQUcsSUFBSTtZQUN4QixJQUFJLENBQUMsYUFBYSxDQUNqQixJQUFJLFdBQVcsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDcEMsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFO2FBQ1IsQ0FBQyxDQUNGO1FBQ0YsQ0FBQztRQUVPLDRCQUFTLEVBQWpCO1lBQ0MsR0FBRyxDQUFDLGlCQUFNLEdBQUksZ0JBQU0sQ0FBQyxPQUFNLEdBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNuRCxPQUFPLGdCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakQ7UUFDRCxDQUFDO1FBRU8sa0NBQWUsRUFBdkIsVUFBd0IsQ0FBTTtZQUE5QjtZQUNDLElBQU0sS0FBSSxFQUFHLENBQUMsQ0FBQyxNQUFNO1lBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVSxJQUFLLElBQUksRUFBRTtnQkFDN0IsSUFBTSxPQUFNLEVBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLElBQUssWUFBSyxDQUFDLFFBQU8sSUFBSyxJQUFJLEVBQXRCLENBQXNCLENBQUM7Z0JBQ3JFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsY0FBTSxZQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDO29CQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZjtZQUNEO1FBQ0QsQ0FBQztRQUVPLDBCQUFPLEVBQWY7WUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxhQUFhLENBQ2pCLElBQUksV0FBVyxDQUFDLGdCQUFnQixFQUFFO29CQUNqQyxPQUFPLEVBQUUsS0FBSztvQkFDZCxNQUFNLEVBQUU7aUJBQ1IsQ0FBQyxDQUNGO1lBQ0Y7UUFDRCxDQUFDO1FBRU0saUNBQWMsRUFBckI7WUFDQyxPQUFNLHFCQUFNLElBQUksQ0FBQyxXQUFXLEVBQUssSUFBSSxDQUFDLGdCQUFnQjtRQUN2RCxDQUFDO1FBRU0sK0JBQVksRUFBbkI7WUFDQyxHQUFHLENBQUMsVUFBUyxJQUFLLHNCQUFzQixDQUFDLElBQUksRUFBRTtnQkFDOUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssSUFBSyxZQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQVU7b0JBQ3RFLDJCQUFPO29CQUNmLE9BQU8sS0FBQyxDQUFDLEtBQUssdUJBQU8sT0FBTyxDQUFDLGNBQWMsRUFBRSxvQkFBUSxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQzlFLENBQUMsQ0FBQztZQUNIO1lBQUUsS0FBSztnQkFDTixPQUFPLElBQUksQ0FBQyxTQUFTO1lBQ3RCO1FBQ0QsQ0FBQztRQUVNLDJDQUF3QixFQUEvQixVQUFnQyxJQUFZLEVBQUUsUUFBdUIsRUFBRSxLQUFvQjtZQUMxRixJQUFNLGFBQVksRUFBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQztRQUN2QyxDQUFDO1FBRU8sb0NBQWlCLEVBQXpCLFVBQTBCLFlBQW9CLEVBQUUsS0FBVTtZQUN6RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFDLEVBQUcsS0FBSztRQUM1QyxDQUFDO1FBRU8sb0NBQWlCLEVBQXpCLFVBQTBCLFlBQW9CO1lBQzdDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQztRQUMzQyxDQUFDO1FBRU8sK0JBQVksRUFBcEIsVUFBcUIsWUFBb0IsRUFBRSxLQUFVO1lBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFDLEVBQUcsS0FBSztZQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2YsQ0FBQztRQUVPLCtCQUFZLEVBQXBCLFVBQXFCLFlBQW9CO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7UUFDdEMsQ0FBQztRQUVPLDBDQUF1QixFQUEvQixVQUFnQyxVQUFvQjtZQUFwRDtZQUNDLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFVBQWUsRUFBRSxZQUFvQjtnQkFDOUQsSUFBTSxjQUFhLEVBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRTtnQkFDaEQsSUFBTSxNQUFLLEVBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7Z0JBQzlDLEdBQUcsQ0FBQyxNQUFLLElBQUssSUFBSSxFQUFFO29CQUNuQixVQUFVLENBQUMsWUFBWSxFQUFDLEVBQUcsS0FBSztnQkFDakM7Z0JBQ0EsT0FBTyxVQUFVO1lBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDUCxDQUFDO1FBRUQsc0JBQVcsNkJBQWtCO2lCQUE3QjtnQkFDQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2pDLENBQUM7Ozs7UUFFRCxzQkFBVyw2QkFBUTtpQkFBbkI7Z0JBQ0MsT0FBTyxJQUFJO1lBQ1osQ0FBQzs7OztRQUNGLGNBQUM7SUFBRCxDQW5MTyxDQUFjLFdBQVc7QUFvTGpDO0FBN0xBO0FBK0xBLGtCQUF5QixpQkFBc0I7SUFDOUMsSUFBTSxXQUFVLEVBQUcsaUJBQWlCLENBQUMsVUFBUyxHQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyx5QkFBeUI7SUFFdkcsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQ2QsdUdBQXVHLENBQ3ZHO0lBQ0Y7SUFFQSxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDeEY7QUFWQTtBQVlBLGtCQUFlLFFBQVE7Ozs7Ozs7Ozs7OztBQ2hQdkI7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUlBLElBQU0sYUFBWSxFQUFHLG9CQUFvQjtBQUN6QyxJQUFNLGNBQWEsRUFBRyxhQUFZLEVBQUcsVUFBVTtBQUMvQyxJQUFNLGdCQUFlLEVBQUcsYUFBWSxFQUFHLFlBQVk7QUFFbkQsSUFBTSxXQUFVLEVBQXNDLEVBQUU7QUFxRTNDLDBCQUFpQixFQUFHLElBQUksaUJBQU8sRUFBbUI7QUFFL0QsSUFBTSxZQUFXLEVBQUcsSUFBSSxpQkFBTyxFQUErQztBQUM5RSxJQUFNLGVBQWMsRUFBRyxJQUFJLGlCQUFPLEVBQTZDO0FBRS9FLGNBQWMsTUFBcUIsRUFBRSxNQUFxQjtJQUN6RCxHQUFHLENBQUMsV0FBTyxDQUFDLE1BQU0sRUFBQyxHQUFJLFdBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUcsSUFBSyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQzlCLE9BQU8sS0FBSztRQUNiO1FBQ0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sS0FBSztRQUNiO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7SUFBRSxLQUFLLEdBQUcsQ0FBQyxXQUFPLENBQUMsTUFBTSxFQUFDLEdBQUksV0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzlDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWlCLElBQUssTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzFELE9BQU8sS0FBSztRQUNiO1FBQ0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3BELE9BQU8sS0FBSztRQUNiO1FBQ0EsT0FBTyxJQUFJO0lBQ1o7SUFDQSxPQUFPLEtBQUs7QUFDYjtBQUVBLElBQU0sa0JBQWlCLEVBQUc7SUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQztBQUMxRixDQUFDO0FBRUQsOEJBQ0MsZ0JBQTRDLEVBQzVDLGlCQUE2QztJQUU3QyxJQUFNLFNBQVEsRUFBRztRQUNoQixTQUFTLEVBQUUsU0FBUztRQUNwQixZQUFZLEVBQUUsVUFBUyxPQUFvQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtZQUMzRSxPQUFPLENBQUMsS0FBYSxDQUFDLFNBQVMsRUFBQyxFQUFHLEtBQUs7UUFDMUMsQ0FBQztRQUNELFdBQVcsRUFBRTtZQUNaLEtBQUssRUFBRSxpQkFBaUI7WUFDeEIsSUFBSSxFQUFFO1NBQ047UUFDRCx1QkFBdUIsRUFBRSxFQUFFO1FBQzNCLG9CQUFvQixFQUFFLEVBQUU7UUFDeEIsT0FBTyxFQUFFLElBQUksaUJBQU8sRUFBRTtRQUN0QixLQUFLLEVBQUUsQ0FBQztRQUNSLEtBQUssRUFBRSxLQUFLO1FBQ1osZUFBZSxFQUFFLFNBQVM7UUFDMUIsV0FBVyxFQUFFLEVBQUU7UUFDZixpQkFBaUI7S0FDakI7SUFDRCxPQUFPLHFCQUFLLFFBQVEsRUFBSyxnQkFBZ0IsQ0FBdUI7QUFDakU7QUFFQSx5QkFBeUIsVUFBa0I7SUFDMUMsR0FBRyxDQUFDLE9BQU8sV0FBVSxJQUFLLFFBQVEsRUFBRTtRQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDO0lBQ2hEO0FBQ0Q7QUFFQSxxQkFDQyxPQUFhLEVBQ2IsU0FBaUIsRUFDakIsWUFBc0IsRUFDdEIsaUJBQW9DLEVBQ3BDLElBQVMsRUFDVCxhQUF3QjtJQUV4QixJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxHQUFJLElBQUksaUJBQU8sRUFBRTtJQUV4RSxHQUFHLENBQUMsYUFBYSxFQUFFO1FBQ2xCLElBQU0sY0FBYSxFQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO0lBQ3REO0lBRUEsSUFBSSxTQUFRLEVBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFdEMsR0FBRyxDQUFDLFVBQVMsSUFBSyxPQUFPLEVBQUU7UUFDMUIsU0FBUSxFQUFHLFVBQW9CLEdBQVU7WUFDeEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxNQUFjLENBQUMsZUFBZSxFQUFDLEVBQUksR0FBRyxDQUFDLE1BQTJCLENBQUMsS0FBSztRQUM5RSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNiO0lBRUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7SUFDN0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDO0lBQ3BDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztBQUNqRDtBQUVBLG9CQUFvQixPQUFnQixFQUFFLE9BQTJCO0lBQ2hFLEdBQUcsQ0FBQyxPQUFPLEVBQUU7UUFDWixJQUFNLFdBQVUsRUFBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQztJQUNEO0FBQ0Q7QUFFQSx1QkFBdUIsT0FBZ0IsRUFBRSxPQUEyQjtJQUNuRSxHQUFHLENBQUMsT0FBTyxFQUFFO1FBQ1osSUFBTSxXQUFVLEVBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEM7SUFDRDtBQUNEO0FBRUEsaUNBQWlDLE9BQVksRUFBRSxRQUF1QixFQUFFLE9BQXNCO0lBQ3JGLCtCQUFRLEVBQUUsK0JBQVUsRUFBRSwrQkFBVTtJQUN4QyxHQUFHLENBQUMsQ0FBQyxTQUFRLEdBQUksU0FBUSxJQUFLLE1BQU0sRUFBRTtRQUNyQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFNLENBQUU7SUFDckc7SUFBRSxLQUFLLEdBQUcsQ0FBQyxTQUFRLElBQUssTUFBTSxFQUFFO1FBQy9CLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFNLENBQUU7SUFDckc7SUFDQSxJQUFJLGNBQWEsRUFBUTtRQUN4QixVQUFVLEVBQUU7S0FDWjtJQUNELEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDZixhQUFhLENBQUMsV0FBVSxFQUFHLEVBQUU7UUFDN0IsYUFBYSxDQUFDLE9BQU0sRUFBRyxRQUFRLENBQUMsTUFBTTtRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDeEMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUMsRUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3ZELENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtZQUN4QyxhQUFhLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBQyxFQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3BFLENBQUMsQ0FBQztRQUNGLE9BQU8sYUFBYTtJQUNyQjtJQUNBLGFBQWEsQ0FBQyxXQUFVLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQ3hELFVBQUMsS0FBSyxFQUFFLFFBQVE7UUFDZixLQUFLLENBQUMsUUFBUSxFQUFDLEVBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUMsR0FBSSxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3JFLE9BQU8sS0FBSztJQUNiLENBQUMsRUFDRCxFQUFTLENBQ1Q7SUFDRCxPQUFPLGFBQWE7QUFDckI7QUFFQSxtQkFBbUIsU0FBYyxFQUFFLGFBQWtCLEVBQUUsT0FBZ0IsRUFBRSxpQkFBb0M7SUFDNUcsSUFBSSxNQUFNO0lBQ1YsR0FBRyxDQUFDLE9BQU8sVUFBUyxJQUFLLFVBQVUsRUFBRTtRQUNwQyxPQUFNLEVBQUcsU0FBUyxFQUFFO0lBQ3JCO0lBQUUsS0FBSztRQUNOLE9BQU0sRUFBRyxVQUFTLEdBQUksQ0FBQyxhQUFhO0lBQ3JDO0lBQ0EsR0FBRyxDQUFDLE9BQU0sSUFBSyxJQUFJLEVBQUU7UUFDcEIsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDO1lBQzdDLE9BQXVCLENBQUMsS0FBSyxFQUFFO1FBQ2pDLENBQUMsQ0FBQztJQUNIO0FBQ0Q7QUFFQSw4QkFDQyxPQUFnQixFQUNoQixrQkFBbUMsRUFDbkMsVUFBMkIsRUFDM0IsaUJBQW9DLEVBQ3BDLFVBQTJCO0lBQTNCLCtDQUEyQjtJQUUzQixJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUN2RCxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDaEQsSUFBTSxRQUFPLEVBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLElBQUssS0FBSSxHQUFJLFVBQVU7WUFDNUQsSUFBTSxVQUFTLEVBQUcsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RCxHQUFHLENBQUMsUUFBTyxHQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNyQyxJQUFNLGNBQWEsRUFBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxHQUFHLENBQUMsYUFBYSxFQUFFO29CQUNsQixPQUFPLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztnQkFDdEQ7WUFDRDtRQUNELENBQUMsQ0FBQztJQUNIO0FBQ0Q7QUFFQSx5QkFBeUIsT0FBZ0IsRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQUUsaUJBQW9DO0lBQ25ILEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFTLElBQUssY0FBYSxHQUFJLFNBQVEsSUFBSyxNQUFNLEVBQUU7UUFDekUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztJQUM3RDtJQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUSxJQUFLLE9BQU0sR0FBSSxVQUFTLElBQUssRUFBRSxFQUFDLEdBQUksVUFBUyxJQUFLLFNBQVMsRUFBRTtRQUNoRixPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztJQUNsQztJQUFFLEtBQUs7UUFDTixPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFDMUM7QUFDRDtBQUVBLDBCQUNDLE9BQWdCLEVBQ2hCLGtCQUErQyxFQUMvQyxVQUF1QyxFQUN2QyxpQkFBb0M7SUFFcEMsSUFBTSxVQUFTLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekMsSUFBTSxVQUFTLEVBQUcsU0FBUyxDQUFDLE1BQU07SUFDbEMsSUFBSSxDQUFDLElBQUksRUFBQyxFQUFHLENBQUMsRUFBRSxFQUFDLEVBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sU0FBUSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBTSxVQUFTLEVBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFNLGtCQUFpQixFQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUN0RCxHQUFHLENBQUMsVUFBUyxJQUFLLGlCQUFpQixFQUFFO1lBQ3BDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQztRQUNqRTtJQUNEO0FBQ0Q7QUFFQSwwQkFDQyxPQUFnQixFQUNoQixrQkFBbUMsRUFDbkMsVUFBMkIsRUFDM0IsaUJBQW9DLEVBQ3BDLDJCQUFrQztJQUFsQyxnRkFBa0M7SUFFbEMsSUFBSSxrQkFBaUIsRUFBRyxLQUFLO0lBQzdCLElBQU0sVUFBUyxFQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pDLElBQU0sVUFBUyxFQUFHLFNBQVMsQ0FBQyxNQUFNO0lBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBQyxJQUFLLENBQUMsRUFBQyxHQUFJLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtRQUN0RSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzRCxhQUFhLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RDtRQUNEO1FBQUUsS0FBSztZQUNOLGFBQWEsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxDQUFDO1FBQ25EO0lBQ0Q7SUFFQSw0QkFBMkIsR0FBSSxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDO0lBRS9HLElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLFNBQVEsRUFBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksVUFBUyxFQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDcEMsSUFBTSxjQUFhLEVBQUcsa0JBQW1CLENBQUMsUUFBUSxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1lBQzNCLElBQU0sZ0JBQWUsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUN0RixJQUFNLGVBQWMsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUN6RSxHQUFHLENBQUMsZ0JBQWUsR0FBSSxlQUFlLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtnQkFDbEQsR0FBRyxDQUFDLENBQUMsVUFBUyxHQUFJLFNBQVMsQ0FBQyxPQUFNLElBQUssQ0FBQyxFQUFFO29CQUN6QyxJQUFJLENBQUMsSUFBSSxJQUFDLEVBQUcsQ0FBQyxFQUFFLElBQUMsRUFBRyxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFFO3dCQUNoRCxhQUFhLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxHQUFDLENBQUMsQ0FBQztvQkFDM0M7Z0JBQ0Q7Z0JBQUUsS0FBSztvQkFDTixJQUFNLFdBQVUsbUJBQXNDLGNBQWMsQ0FBQztvQkFDckUsSUFBSSxDQUFDLElBQUksSUFBQyxFQUFHLENBQUMsRUFBRSxJQUFDLEVBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsRUFBRTt3QkFDaEQsSUFBTSxrQkFBaUIsRUFBRyxlQUFlLENBQUMsR0FBQyxDQUFDO3dCQUM1QyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7NEJBQ3RCLElBQU0sV0FBVSxFQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7NEJBQ3hELEdBQUcsQ0FBQyxXQUFVLElBQUssQ0FBQyxDQUFDLEVBQUU7Z0NBQ3RCLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUM7NEJBQzFDOzRCQUFFLEtBQUs7Z0NBQ04sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDOzRCQUNqQzt3QkFDRDtvQkFDRDtvQkFDQSxJQUFJLENBQUMsSUFBSSxJQUFDLEVBQUcsQ0FBQyxFQUFFLElBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFFO3dCQUMzQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFDLENBQUMsQ0FBQztvQkFDbkM7Z0JBQ0Q7WUFDRDtZQUFFLEtBQUs7Z0JBQ04sSUFBSSxDQUFDLElBQUksSUFBQyxFQUFHLENBQUMsRUFBRSxJQUFDLEVBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsRUFBRTtvQkFDL0MsVUFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsR0FBQyxDQUFDLENBQUM7Z0JBQ3ZDO1lBQ0Q7UUFDRDtRQUFFLEtBQUssR0FBRyxDQUFDLFNBQVEsSUFBSyxPQUFPLEVBQUU7WUFDaEMsU0FBUyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixDQUFDO1FBQ2hFO1FBQUUsS0FBSyxHQUFHLENBQUMsU0FBUSxJQUFLLFFBQVEsRUFBRTtZQUNqQyxJQUFNLFdBQVUsRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QyxJQUFNLFdBQVUsRUFBRyxVQUFVLENBQUMsTUFBTTtZQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQU0sVUFBUyxFQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQU0sY0FBYSxFQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7Z0JBQzFDLElBQU0sY0FBYSxFQUFHLGNBQWEsR0FBSSxhQUFhLENBQUMsU0FBUyxDQUFDO2dCQUMvRCxHQUFHLENBQUMsY0FBYSxJQUFLLGFBQWEsRUFBRTtvQkFDcEMsUUFBUTtnQkFDVDtnQkFDQSxrQkFBaUIsRUFBRyxJQUFJO2dCQUN4QixHQUFHLENBQUMsYUFBYSxFQUFFO29CQUNsQixlQUFlLENBQUMsYUFBYSxDQUFDO29CQUM5QixpQkFBaUIsQ0FBQyxZQUFhLENBQUMsT0FBc0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxDQUFDO2dCQUNsRjtnQkFBRSxLQUFLO29CQUNOLGlCQUFpQixDQUFDLFlBQWEsQ0FBQyxPQUFzQixFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZFO1lBQ0Q7UUFDRDtRQUFFLEtBQUs7WUFDTixHQUFHLENBQUMsQ0FBQyxVQUFTLEdBQUksT0FBTyxjQUFhLElBQUssUUFBUSxFQUFFO2dCQUNwRCxVQUFTLEVBQUcsRUFBRTtZQUNmO1lBQ0EsR0FBRyxDQUFDLFNBQVEsSUFBSyxPQUFPLEVBQUU7Z0JBQ3pCLElBQU0sU0FBUSxFQUFJLE9BQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzNDLEdBQUcsQ0FDRixTQUFRLElBQUssVUFBUztvQkFDdEIsQ0FBRSxPQUFlLENBQUMsZUFBZTt3QkFDaEMsRUFBRSxTQUFRLElBQU0sT0FBZSxDQUFDLGVBQWU7d0JBQy9DLEVBQUUsVUFBUyxJQUFLLGFBQWEsQ0FDL0IsRUFBRTtvQkFDQSxPQUFlLENBQUMsUUFBUSxFQUFDLEVBQUcsU0FBUztvQkFDckMsT0FBZSxDQUFDLGVBQWUsRUFBQyxFQUFHLFNBQVM7Z0JBQzlDO2dCQUNBLEdBQUcsQ0FBQyxVQUFTLElBQUssYUFBYSxFQUFFO29CQUNoQyxrQkFBaUIsRUFBRyxJQUFJO2dCQUN6QjtZQUNEO1lBQUUsS0FBSyxHQUFHLENBQUMsU0FBUSxJQUFLLE1BQUssR0FBSSxVQUFTLElBQUssYUFBYSxFQUFFO2dCQUM3RCxJQUFNLEtBQUksRUFBRyxPQUFPLFNBQVM7Z0JBQzdCLEdBQUcsQ0FBQyxLQUFJLElBQUssV0FBVSxHQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxJQUFLLEVBQUMsR0FBSSwyQkFBMkIsRUFBRTtvQkFDOUYsV0FBVyxDQUNWLE9BQU8sRUFDUCxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNsQixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFVBQVUsQ0FBQyxJQUFJLEVBQ2YsYUFBYSxDQUNiO2dCQUNGO2dCQUFFLEtBQUssR0FBRyxDQUFDLEtBQUksSUFBSyxTQUFRLEdBQUksU0FBUSxJQUFLLFlBQVcsR0FBSSwyQkFBMkIsRUFBRTtvQkFDeEYsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDO2dCQUNqRTtnQkFBRSxLQUFLLEdBQUcsQ0FBQyxTQUFRLElBQUssYUFBWSxHQUFJLFNBQVEsSUFBSyxXQUFXLEVBQUU7b0JBQ2pFLEdBQUcsQ0FBRSxPQUFlLENBQUMsUUFBUSxFQUFDLElBQUssU0FBUyxFQUFFO3dCQUM1QyxPQUFlLENBQUMsUUFBUSxFQUFDLEVBQUcsU0FBUztvQkFDdkM7Z0JBQ0Q7Z0JBQUUsS0FBSztvQkFDTCxPQUFlLENBQUMsUUFBUSxFQUFDLEVBQUcsU0FBUztnQkFDdkM7Z0JBQ0Esa0JBQWlCLEVBQUcsSUFBSTtZQUN6QjtRQUNEO0lBQ0Q7SUFDQSxPQUFPLGlCQUFpQjtBQUN6QjtBQUVBLDBCQUEwQixRQUF5QixFQUFFLE1BQXFCLEVBQUUsS0FBYTtJQUN4RixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsS0FBSyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQzlCLE9BQU8sQ0FBQztRQUNUO0lBQ0Q7SUFDQSxPQUFPLENBQUMsQ0FBQztBQUNWO0FBRUEsdUJBQThCLE9BQWdCO0lBQzdDLE9BQU87UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLFVBQVUsRUFBRSxFQUFFO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsT0FBTztRQUNQLElBQUksRUFBRTtLQUNOO0FBQ0Y7QUFSQTtBQVVBLHFCQUE0QixJQUFTO0lBQ3BDLE9BQU87UUFDTixHQUFHLEVBQUUsRUFBRTtRQUNQLFVBQVUsRUFBRSxFQUFFO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsSUFBSSxFQUFFLEtBQUcsSUFBTTtRQUNmLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLElBQUksRUFBRTtLQUNOO0FBQ0Y7QUFUQTtBQVdBLHlCQUF5QixRQUFvQyxFQUFFLFlBQXdCO0lBQ3RGLE9BQU87UUFDTixRQUFRO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixjQUFjLEVBQUUsWUFBWSxDQUFDLGNBQWM7UUFDM0MsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFlO1FBQ2xDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxXQUFrQjtRQUM5QyxVQUFVLEVBQUUsWUFBWSxDQUFDLGVBQWU7UUFDeEMsSUFBSSxFQUFFO0tBQ047QUFDRjtBQUVBLG1DQUNDLFFBQXFDLEVBQ3JDLFFBQW9DO0lBRXBDLEdBQUcsQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1FBQzNCLE9BQU8sVUFBVTtJQUNsQjtJQUNBLFNBQVEsRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUUxRCxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxHQUFJO1FBQ3RDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQWtCO1FBQzFDLEdBQUcsQ0FBQyxNQUFLLElBQUssVUFBUyxHQUFJLE1BQUssSUFBSyxJQUFJLEVBQUU7WUFDMUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLFFBQVE7UUFDVDtRQUFFLEtBQUssR0FBRyxDQUFDLE9BQU8sTUFBSyxJQUFLLFFBQVEsRUFBRTtZQUNyQyxRQUFRLENBQUMsQ0FBQyxFQUFDLEVBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUNqQztRQUFFLEtBQUs7WUFDTixHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFJLElBQUssU0FBUyxFQUFFO29CQUN2QyxLQUFLLENBQUMsVUFBa0IsQ0FBQyxLQUFJLEVBQUcsUUFBUTtvQkFDekMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFRLEdBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFNLEVBQUcsQ0FBQyxFQUFFO3dCQUNoRCx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztvQkFDcEQ7Z0JBQ0Q7WUFDRDtZQUFFLEtBQUs7Z0JBQ04sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtvQkFDMUIsSUFBTSxhQUFZLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBRTtvQkFDckQsS0FBSyxDQUFDLGVBQWMsRUFBRzt3QkFDdEIsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsWUFBWSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUM7cUJBQzFDO2dCQUNGO2dCQUNBLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUSxHQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTSxFQUFHLENBQUMsRUFBRTtvQkFDaEQseUJBQXlCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7Z0JBQ3BEO1lBQ0Q7UUFDRDtRQUNBLENBQUMsRUFBRTtJQUNKO0lBQ0EsT0FBTyxRQUEyQjtBQUNuQztBQXhDQTtBQTBDQSxtQkFBbUIsS0FBb0IsRUFBRSxXQUErQjtJQUN2RSxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssRUFBQyxHQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7UUFDdkMsSUFBTSxlQUFjLEVBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjO1FBQ3RELEdBQUcsQ0FBQyxjQUFjLEVBQUU7WUFDbkIsR0FBRyxDQUFDLE9BQU8sZUFBYyxJQUFLLFVBQVUsRUFBRTtnQkFDekMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFrQixFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDM0Q7WUFBRSxLQUFLO2dCQUNOLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWtCLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxjQUF3QixDQUFDO1lBQ3hGO1FBQ0Q7SUFDRDtBQUNEO0FBRUEsc0JBQXNCLE1BQXVDLEVBQUUsY0FBMEM7SUFDeEcsT0FBTSxFQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2xELElBQUksQ0FBQyxJQUFJLEVBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQyxFQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsSUFBTSxNQUFLLEVBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNuQixZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQzdDO1lBQ0EsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ25CLElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFFO2dCQUMzRCxZQUFZLENBQUMsUUFBUSxFQUFFO1lBQ3hCO1FBQ0Q7UUFBRSxLQUFLO1lBQ04sR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBMkIsRUFBRSxjQUFjLENBQUM7WUFDaEU7UUFDRDtJQUNEO0FBQ0Q7QUFFQSxzQkFBc0IsS0FBb0IsRUFBRSxXQUErQixFQUFFLGlCQUFvQztJQUNoSCxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQU0sU0FBUSxFQUFHLEtBQUssQ0FBQyxTQUFRLEdBQUksVUFBVTtRQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkIsS0FBSyxDQUFDLE9BQVEsQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUM7WUFDdkQ7WUFBRSxLQUFLO2dCQUNOLFlBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDO1lBQ3BEO1FBQ0Q7SUFDRDtJQUFFLEtBQUs7UUFDTixJQUFNLFVBQU8sRUFBRyxLQUFLLENBQUMsT0FBTztRQUM3QixJQUFNLFdBQVUsRUFBRyxLQUFLLENBQUMsVUFBVTtRQUNuQyxJQUFNLGNBQWEsRUFBRyxVQUFVLENBQUMsYUFBYTtRQUM5QyxHQUFHLENBQUMsV0FBVSxHQUFJLGFBQWEsRUFBRTtZQUMvQixTQUF1QixDQUFDLEtBQUssQ0FBQyxjQUFhLEVBQUcsTUFBTTtZQUNyRCxJQUFNLGNBQWEsRUFBRztnQkFDckIsVUFBTyxHQUFJLFNBQU8sQ0FBQyxXQUFVLEdBQUksU0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBTyxDQUFDO1lBQ3pFLENBQUM7WUFDRCxHQUFHLENBQUMsT0FBTyxjQUFhLElBQUssVUFBVSxFQUFFO2dCQUN4QyxhQUFhLENBQUMsU0FBa0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDO2dCQUM1RCxNQUFNO1lBQ1A7WUFBRSxLQUFLO2dCQUNOLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQWtCLEVBQUUsVUFBVSxFQUFFLGFBQXVCLEVBQUUsYUFBYSxDQUFDO2dCQUM5RixNQUFNO1lBQ1A7UUFDRDtRQUNBLFVBQU8sR0FBSSxTQUFPLENBQUMsV0FBVSxHQUFJLFNBQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQU8sQ0FBQztJQUN6RTtBQUNEO0FBRUEsOEJBQ0MsVUFBMkIsRUFDM0IsWUFBb0IsRUFDcEIsY0FBMEM7SUFFMUMsSUFBTSxVQUFTLEVBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztJQUMxQyxHQUFHLENBQUMsV0FBTyxDQUFDLFNBQVMsRUFBQyxHQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUN6QyxNQUFNLEVBQUU7SUFDVDtJQUNRLGtDQUFHO0lBRVgsR0FBRyxDQUFDLElBQUcsSUFBSyxVQUFTLEdBQUksSUFBRyxJQUFLLElBQUksRUFBRTtRQUN0QyxJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLEdBQUcsQ0FBQyxFQUFDLElBQUssWUFBWSxFQUFFO2dCQUN2QixJQUFNLEtBQUksRUFBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxlQUFjLFFBQVE7b0JBQzFCLElBQU0sV0FBVSxFQUFJLGNBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUksR0FBSSxTQUFTO29CQUN4RSxHQUFHLENBQUMsV0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUN2QixlQUFjLEVBQUksU0FBUyxDQUFDLGlCQUF5QixDQUFDLEtBQUksR0FBSSxTQUFTO29CQUN4RTtvQkFBRSxLQUFLO3dCQUNOLGVBQWMsRUFBRyxTQUFTLENBQUMsR0FBRztvQkFDL0I7b0JBRUEsT0FBTyxDQUFDLElBQUksQ0FDWCxlQUFhLFdBQVUsdUxBQW1MLGVBQWMsZ0NBQThCLENBQ3RQO29CQUNELEtBQUs7Z0JBQ047WUFDRDtRQUNEO0lBQ0Q7QUFDRDtBQUVBLHdCQUNDLFdBQTBCLEVBQzFCLFdBQTRCLEVBQzVCLFdBQTRCLEVBQzVCLGNBQTBDLEVBQzFDLGlCQUFvQztJQUVwQyxZQUFXLEVBQUcsWUFBVyxHQUFJLFVBQVU7SUFDdkMsWUFBVyxFQUFHLFdBQVc7SUFDekIsSUFBTSxrQkFBaUIsRUFBRyxXQUFXLENBQUMsTUFBTTtJQUM1QyxJQUFNLGtCQUFpQixFQUFHLFdBQVcsQ0FBQyxNQUFNO0lBQzVDLElBQU0sWUFBVyxFQUFHLGlCQUFpQixDQUFDLFdBQVk7SUFDbEQsa0JBQWlCLHVCQUFRLGlCQUFpQixJQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxNQUFLLEVBQUcsRUFBQyxFQUFFO0lBQ2hGLElBQUksU0FBUSxFQUFHLENBQUM7SUFDaEIsSUFBSSxTQUFRLEVBQUcsQ0FBQztJQUNoQixJQUFJLENBQVM7SUFDYixJQUFJLFlBQVcsRUFBRyxLQUFLOztRQUV0QixJQUFNLFNBQVEsRUFBRyxTQUFRLEVBQUcsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVM7UUFDakYsSUFBTSxTQUFRLEVBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUN0QyxHQUFHLENBQUMsV0FBTyxDQUFDLFFBQVEsRUFBQyxHQUFJLE9BQU8sUUFBUSxDQUFDLDJCQUEwQixJQUFLLFVBQVUsRUFBRTtZQUNuRixRQUFRLENBQUMsU0FBUSxFQUFHLFdBQU8sQ0FBQyxRQUFRLEVBQUMsR0FBSSxRQUFRLENBQUMsUUFBUTtZQUMxRCxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUM7UUFDbkQ7UUFDQSxHQUFHLENBQUMsU0FBUSxJQUFLLFVBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZELFlBQVcsRUFBRyxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLEdBQUksV0FBVztZQUMxRyxRQUFRLEVBQUU7UUFDWDtRQUFFLEtBQUs7WUFDTixJQUFNLGFBQVksRUFBRyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFNBQVEsRUFBRyxDQUFDLENBQUM7WUFDMUUsR0FBRyxDQUFDLGFBQVksR0FBSSxDQUFDLEVBQUU7O29CQUVyQixJQUFNLFdBQVEsRUFBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUMvQixJQUFNLGFBQVksRUFBRyxDQUFDO29CQUN0QixpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7d0JBQzNDLFlBQVksQ0FBQyxVQUFRLEVBQUUsY0FBYyxDQUFDO3dCQUN0QyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQztvQkFDaEUsQ0FBQyxDQUFDO29CQUNGLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDO2dCQUM3RCxDQUFDO2dCQVJELElBQUksQ0FBQyxFQUFDLEVBQUcsUUFBUSxFQUFFLEVBQUMsRUFBRyxZQUFZLEVBQUUsQ0FBQyxFQUFFOzs7Z0JBU3hDLFlBQVc7b0JBQ1YsU0FBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQzt3QkFDOUYsV0FBVztnQkFDWixTQUFRLEVBQUcsYUFBWSxFQUFHLENBQUM7WUFDNUI7WUFBRSxLQUFLO2dCQUNOLElBQUksYUFBWSxFQUErQixTQUFTO2dCQUN4RCxJQUFJLE1BQUssRUFBa0IsV0FBVyxDQUFDLFFBQVEsQ0FBQztnQkFDaEQsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDVixJQUFJLFVBQVMsRUFBRyxTQUFRLEVBQUcsQ0FBQztvQkFDNUIsT0FBTyxhQUFZLElBQUssU0FBUyxFQUFFO3dCQUNsQyxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFOzRCQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQ0FDbkIsTUFBSyxFQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUMxQjs0QkFBRSxLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0NBQ2xDLE1BQUssRUFBRyxXQUFXLENBQUMsU0FBUyxDQUFDO2dDQUM5QixTQUFTLEVBQUU7NEJBQ1o7NEJBQUUsS0FBSztnQ0FDTixLQUFLOzRCQUNOO3dCQUNEO3dCQUFFLEtBQUs7NEJBQ04sYUFBWSxFQUFHLEtBQUssQ0FBQyxPQUFPO3dCQUM3QjtvQkFDRDtnQkFDRDtnQkFFQSxTQUFTLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO2dCQUNqRixTQUFTLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQztnQkFDaEMsSUFBTSxlQUFZLEVBQUcsUUFBUTtnQkFDN0IsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO29CQUMzQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsY0FBWSxFQUFFLGNBQWMsQ0FBQztnQkFDaEUsQ0FBQyxDQUFDO1lBQ0g7UUFDRDtRQUNBLFFBQVEsRUFBRTtJQUNYLENBQUM7SUF4REQsT0FBTyxTQUFRLEVBQUcsaUJBQWlCOzs7SUF5RG5DLEdBQUcsQ0FBQyxrQkFBaUIsRUFBRyxRQUFRLEVBQUU7O1lBR2hDLElBQU0sU0FBUSxFQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBTSxhQUFZLEVBQUcsQ0FBQztZQUN0QixpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDO2dCQUN0QyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQztZQUNoRSxDQUFDLENBQUM7WUFDRixZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQztRQUM3RCxDQUFDO1FBVEQ7UUFDQSxJQUFJLENBQUMsRUFBQyxFQUFHLFFBQVEsRUFBRSxFQUFDLEVBQUcsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFOzs7SUFTOUM7SUFDQSxPQUFPLFdBQVc7QUFDbkI7QUFFQSxxQkFDQyxXQUEwQixFQUMxQixRQUFxQyxFQUNyQyxpQkFBb0MsRUFDcEMsY0FBMEMsRUFDMUMsWUFBb0QsRUFDcEQsVUFBK0I7SUFEL0IsdURBQW9EO0lBR3BELEdBQUcsQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1FBQzNCLE1BQU07SUFDUDtJQUVBLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFLLEdBQUksV0FBVSxJQUFLLFNBQVMsRUFBRTtRQUN4RCxXQUFVLEVBQUcsWUFBUyxDQUFDLFdBQVcsQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUF1QjtJQUM5RTtJQUVBLGtCQUFpQix1QkFBUSxpQkFBaUIsSUFBRSxLQUFLLEVBQUUsaUJBQWlCLENBQUMsTUFBSyxFQUFHLEVBQUMsRUFBRTtJQUVoRixJQUFJLENBQUMsSUFBSSxFQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLElBQU0sTUFBSyxFQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFekIsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQixHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBSyxHQUFJLFVBQVUsRUFBRTtnQkFDMUMsSUFBSSxXQUFVLEVBQXdCLFNBQVM7Z0JBQy9DLE9BQU8sS0FBSyxDQUFDLFFBQU8sSUFBSyxVQUFTLEdBQUksVUFBVSxDQUFDLE9BQU0sRUFBRyxDQUFDLEVBQUU7b0JBQzVELFdBQVUsRUFBRyxVQUFVLENBQUMsS0FBSyxFQUFhO29CQUMxQyxHQUFHLENBQUMsV0FBVSxHQUFJLFVBQVUsQ0FBQyxRQUFPLElBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRSxHQUFJLFNBQVMsQ0FBQyxFQUFFO3dCQUNoRixLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVU7b0JBQzNCO2dCQUNEO1lBQ0Q7WUFDQSxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO1FBQy9FO1FBQUUsS0FBSztZQUNOLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO1FBQzNGO0lBQ0Q7QUFDRDtBQUVBLG1DQUNDLE9BQWdCLEVBQ2hCLEtBQW9CLEVBQ3BCLGNBQTBDLEVBQzFDLGlCQUFvQztJQUVwQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQztJQUNoRixHQUFHLENBQUMsT0FBTyxLQUFLLENBQUMsMkJBQTBCLElBQUssV0FBVSxHQUFJLEtBQUssQ0FBQyxTQUFRLElBQUssU0FBUyxFQUFFO1FBQzNGLHFCQUFxQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQztJQUNoRDtJQUVBLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVSxHQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDckMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1FBQ2xFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUM7UUFDekUsb0JBQW9CLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQztRQUN4RSxJQUFNLFNBQU0sRUFBRyxLQUFLLENBQUMsTUFBTTtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDakMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3JGLENBQUMsQ0FBQztJQUNIO0lBQUUsS0FBSztRQUNOLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQztJQUNuRTtJQUNBLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUcsSUFBSyxLQUFJLEdBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFHLElBQUssU0FBUyxFQUFFO1FBQ3hFLElBQU0sYUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUU7UUFDM0QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBc0IsRUFBRSxLQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBSyxDQUFDO0lBQ2hGO0lBQ0EsS0FBSyxDQUFDLFNBQVEsRUFBRyxJQUFJO0FBQ3RCO0FBRUEsbUJBQ0MsS0FBb0IsRUFDcEIsV0FBMEIsRUFDMUIsWUFBd0MsRUFDeEMsaUJBQW9DLEVBQ3BDLGNBQTBDLEVBQzFDLFVBQStCO0lBRS9CLElBQUksT0FBbUM7SUFDdkMsR0FBRyxDQUFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNiLCtDQUFpQjtRQUN2QixJQUFNLG1CQUFrQixFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUU7UUFDakUsR0FBRyxDQUFDLENBQUMsa0NBQXVCLENBQTZCLGlCQUFpQixDQUFDLEVBQUU7WUFDNUUsSUFBTSxLQUFJLEVBQUcsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUE2QixpQkFBaUIsQ0FBQztZQUM3RixHQUFHLENBQUMsS0FBSSxJQUFLLElBQUksRUFBRTtnQkFDbEIsTUFBTTtZQUNQO1lBQ0Esa0JBQWlCLEVBQUcsSUFBSTtRQUN6QjtRQUNBLElBQU0sV0FBUSxFQUFHLElBQUksaUJBQWlCLEVBQUU7UUFDeEMsS0FBSyxDQUFDLFNBQVEsRUFBRyxVQUFRO1FBQ3pCLElBQU0sZUFBWSxFQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFRLENBQUU7UUFDckQsY0FBWSxDQUFDLFdBQVUsRUFBRztZQUN6QixjQUFZLENBQUMsTUFBSyxFQUFHLElBQUk7WUFDekIsR0FBRyxDQUFDLGNBQVksQ0FBQyxVQUFTLElBQUssS0FBSyxFQUFFO2dCQUNyQyxJQUFNLFlBQVcsRUFBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFFO2dCQUM1RSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxjQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxNQUFLLENBQUUsQ0FBQztnQkFDOUQsY0FBYyxDQUFDLGlCQUFpQixDQUFDO1lBQ2xDO1FBQ0QsQ0FBQztRQUNELGNBQVksQ0FBQyxVQUFTLEVBQUcsSUFBSTtRQUM3QixVQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUNwRCxVQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDeEMsVUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDNUMsY0FBWSxDQUFDLFVBQVMsRUFBRyxLQUFLO1FBQzlCLElBQU0sU0FBUSxFQUFHLFVBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDdEMsR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNiLElBQU0saUJBQWdCLEVBQUcseUJBQXlCLENBQUMsUUFBUSxFQUFFLFVBQVEsQ0FBQztZQUN0RSxLQUFLLENBQUMsU0FBUSxFQUFHLGdCQUFnQjtZQUNqQyxXQUFXLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLFVBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDO1FBQ2xHO1FBQ0EsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFRLEVBQUUsRUFBRSxLQUFLLFNBQUUsV0FBVyxlQUFFLENBQUM7UUFDakQsY0FBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDbEMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQzNDLGNBQVksQ0FBQyxRQUFRLEVBQUU7UUFDeEIsQ0FBQyxDQUFDO0lBQ0g7SUFBRSxLQUFLO1FBQ04sR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQUssR0FBSSxpQkFBaUIsQ0FBQyxhQUFZLElBQUssU0FBUyxFQUFFO1lBQzVFLFFBQU8sRUFBRyxLQUFLLENBQUMsUUFBTyxFQUFHLGlCQUFpQixDQUFDLFlBQVk7WUFDeEQsaUJBQWlCLENBQUMsYUFBWSxFQUFHLFNBQVM7WUFDMUMseUJBQXlCLENBQUMsT0FBUSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7WUFDN0UsTUFBTTtRQUNQO1FBQ0EsSUFBTSxJQUFHLEVBQUcsV0FBVyxDQUFDLE9BQVEsQ0FBQyxhQUFhO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFHLEdBQUksT0FBTyxLQUFLLENBQUMsS0FBSSxJQUFLLFFBQVEsRUFBRTtZQUNqRCxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQU8sSUFBSyxVQUFTLEdBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtnQkFDdkQsSUFBTSxXQUFVLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUM7Z0JBQzFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBTyxJQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO29CQUNyRCxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDNUQ7Z0JBQUUsS0FBSztvQkFDTixXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7b0JBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVSxHQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUNoRjtnQkFDQSxLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVU7WUFDM0I7WUFBRSxLQUFLO2dCQUNOLFFBQU8sRUFBRyxLQUFLLENBQUMsUUFBTyxFQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQztnQkFDekQsR0FBRyxDQUFDLGFBQVksSUFBSyxTQUFTLEVBQUU7b0JBQy9CLFdBQVcsQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7Z0JBQ3pEO2dCQUFFLEtBQUs7b0JBQ04sV0FBVyxDQUFDLE9BQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUMxQztZQUNEO1FBQ0Q7UUFBRSxLQUFLO1lBQ04sR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFPLElBQUssU0FBUyxFQUFFO2dCQUNoQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUcsSUFBSyxLQUFLLEVBQUU7b0JBQ3hCLGtCQUFpQix1QkFBUSxpQkFBaUIsRUFBSyxFQUFFLFNBQVMsRUFBRSxjQUFhLENBQUUsQ0FBRTtnQkFDOUU7Z0JBQ0EsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVMsSUFBSyxTQUFTLEVBQUU7b0JBQzlDLFFBQU8sRUFBRyxLQUFLLENBQUMsUUFBTyxFQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3RGO2dCQUFFLEtBQUs7b0JBQ04sUUFBTyxFQUFHLEtBQUssQ0FBQyxRQUFPLEVBQUcsS0FBSyxDQUFDLFFBQU8sR0FBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3hFO1lBQ0Q7WUFBRSxLQUFLO2dCQUNOLFFBQU8sRUFBRyxLQUFLLENBQUMsT0FBTztZQUN4QjtZQUNBLHlCQUF5QixDQUFDLE9BQW1CLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQztZQUN4RixHQUFHLENBQUMsYUFBWSxJQUFLLFNBQVMsRUFBRTtnQkFDL0IsV0FBVyxDQUFDLE9BQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztZQUN6RDtZQUFFLEtBQUssR0FBRyxDQUFDLE9BQVEsQ0FBQyxXQUFVLElBQUssV0FBVyxDQUFDLE9BQVEsRUFBRTtnQkFDeEQsV0FBVyxDQUFDLE9BQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1lBQzFDO1FBQ0Q7SUFDRDtBQUNEO0FBRUEsbUJBQ0MsUUFBYSxFQUNiLEtBQW9CLEVBQ3BCLGlCQUFvQyxFQUNwQyxXQUEwQixFQUMxQixjQUEwQztJQUUxQyxHQUFHLENBQUMsV0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ1gsZ0NBQVE7UUFDaEIsR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNQLGtDQUF5RCxFQUF2RCw4QkFBVyxFQUFFLGVBQVc7WUFDaEMsSUFBTSxpQkFBZ0IsRUFBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsUUFBUTtZQUNqRSxJQUFNLGFBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFO1lBQ3JELFlBQVksQ0FBQyxVQUFTLEVBQUcsSUFBSTtZQUM3QixRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUNwRCxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDeEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDNUMsWUFBWSxDQUFDLFVBQVMsRUFBRyxLQUFLO1lBQzlCLEtBQUssQ0FBQyxTQUFRLEVBQUcsUUFBUTtZQUN6QixXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssU0FBRSxXQUFXLGlCQUFFLENBQUM7WUFDakQsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFLLElBQUssSUFBSSxFQUFFO2dCQUNoQyxJQUFNLFNBQVEsRUFBRyxRQUFRLENBQUMsVUFBVSxFQUFFO2dCQUN0QyxLQUFLLENBQUMsU0FBUSxFQUFHLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7Z0JBQzlELGNBQWMsQ0FBQyxhQUFXLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLENBQUM7WUFDM0Y7WUFBRSxLQUFLO2dCQUNOLEtBQUssQ0FBQyxTQUFRLEVBQUcsZ0JBQWdCO1lBQ2xDO1lBQ0EsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDbkM7UUFBRSxLQUFLO1lBQ04sU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztRQUM1RTtJQUNEO0lBQUUsS0FBSztRQUNOLEdBQUcsQ0FBQyxTQUFRLElBQUssS0FBSyxFQUFFO1lBQ3ZCLE9BQU8sS0FBSztRQUNiO1FBQ0EsSUFBTSxVQUFPLEVBQUcsQ0FBQyxLQUFLLENBQUMsUUFBTyxFQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDbEQsSUFBSSxZQUFXLEVBQUcsS0FBSztRQUN2QixJQUFJLFFBQU8sRUFBRyxLQUFLO1FBQ25CLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFHLEdBQUksT0FBTyxLQUFLLENBQUMsS0FBSSxJQUFLLFFBQVEsRUFBRTtZQUNqRCxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUksSUFBSyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNqQyxJQUFNLFdBQVUsRUFBRyxTQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFDO2dCQUNwRSxTQUFPLENBQUMsVUFBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBTyxDQUFDO2dCQUNyRCxLQUFLLENBQUMsUUFBTyxFQUFHLFVBQVU7Z0JBQzFCLFlBQVcsRUFBRyxJQUFJO2dCQUNsQixPQUFPLFdBQVc7WUFDbkI7UUFDRDtRQUFFLEtBQUs7WUFDTixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUcsR0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLElBQUssQ0FBQyxFQUFFO2dCQUN2RCxrQkFBaUIsdUJBQVEsaUJBQWlCLEVBQUssRUFBRSxTQUFTLEVBQUUsY0FBYSxDQUFFLENBQUU7WUFDOUU7WUFDQSxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVEsSUFBSyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUN6QyxJQUFNLFNBQVEsRUFBRyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQztnQkFDMUUsS0FBSyxDQUFDLFNBQVEsRUFBRyxRQUFRO2dCQUN6QixRQUFPO29CQUNOLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFDLEdBQUksT0FBTztZQUNsRztZQUVBLElBQU0scUJBQWtCLEVBQUcsdUJBQXVCLENBQUMsU0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7WUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFVLEdBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckMsZ0JBQWdCLENBQUMsU0FBTyxFQUFFLG9CQUFrQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO2dCQUM3RixRQUFPO29CQUNOLGdCQUFnQixDQUNmLFNBQU8sRUFDUCxvQkFBa0IsQ0FBQyxVQUFVLEVBQzdCLEtBQUssQ0FBQyxVQUFVLEVBQ2hCLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsR0FBSSxPQUFPO2dCQUNiLG9CQUFvQixDQUFDLFNBQU8sRUFBRSxvQkFBa0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUM7Z0JBQy9GLElBQU0sU0FBTSxFQUFHLEtBQUssQ0FBQyxNQUFNO2dCQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7b0JBQ2pDLFdBQVcsQ0FDVixTQUFPLEVBQ1AsS0FBSyxFQUNMLFFBQU0sQ0FBQyxLQUFLLENBQUMsRUFDYixpQkFBaUIsRUFDakIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQ3JCLG9CQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FDaEM7Z0JBQ0YsQ0FBQyxDQUFDO1lBQ0g7WUFBRSxLQUFLO2dCQUNOLFFBQU87b0JBQ04sZ0JBQWdCLENBQUMsU0FBTyxFQUFFLG9CQUFrQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFDO3dCQUM3RixPQUFPO1lBQ1Q7WUFFQSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFHLElBQUssS0FBSSxHQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBRyxJQUFLLFNBQVMsRUFBRTtnQkFDeEUsSUFBTSxhQUFZLEVBQUcseUJBQWlCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBRTtnQkFDM0QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBTyxFQUFFLEtBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFLLENBQUM7WUFDakU7UUFDRDtRQUNBLEdBQUcsQ0FBQyxRQUFPLEdBQUksS0FBSyxDQUFDLFdBQVUsR0FBSSxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRTtZQUNwRSxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxTQUFrQixFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUM1RjtJQUNEO0FBQ0Q7QUFFQSwrQkFBK0IsS0FBb0IsRUFBRSxpQkFBb0M7SUFDeEY7SUFDQSxLQUFLLENBQUMsNEJBQTJCLEVBQUcsS0FBSyxDQUFDLFVBQVU7SUFDcEQsSUFBTSxXQUFVLEVBQUcsS0FBSyxDQUFDLDBCQUEyQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQ3RFLEtBQUssQ0FBQyxXQUFVLHVCQUFRLFVBQVUsRUFBSyxLQUFLLENBQUMsMkJBQTJCLENBQUU7SUFDMUUsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDO1FBQzlDLElBQU0sV0FBVSx1QkFDWixLQUFLLENBQUMsMEJBQTJCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFDbkQsS0FBSyxDQUFDLDJCQUEyQixDQUNwQztRQUNELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFtQixFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1FBQzVGLEtBQUssQ0FBQyxXQUFVLEVBQUcsVUFBVTtJQUM5QixDQUFDLENBQUM7QUFDSDtBQUVBLG9DQUFvQyxpQkFBb0M7SUFDdkUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRTtRQUNyRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO1lBQzNCLE9BQU8saUJBQWlCLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFO2dCQUN4RCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xFLFNBQVEsR0FBSSxRQUFRLEVBQUU7WUFDdkI7UUFDRDtRQUFFLEtBQUs7WUFDTixnQkFBTSxDQUFDLHFCQUFxQixDQUFDO2dCQUM1QixPQUFPLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRTtvQkFDeEQsSUFBTSxTQUFRLEVBQUcsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFO29CQUNsRSxTQUFRLEdBQUksUUFBUSxFQUFFO2dCQUN2QjtZQUNELENBQUMsQ0FBQztRQUNIO0lBQ0Q7QUFDRDtBQUVBLGlDQUFpQyxpQkFBb0M7SUFDcEUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRTtRQUMzQixPQUFPLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtZQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7WUFDL0QsU0FBUSxHQUFJLFFBQVEsRUFBRTtRQUN2QjtJQUNEO0lBQUUsS0FBSztRQUNOLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLG1CQUFtQixFQUFFO1lBQy9CLGdCQUFNLENBQUMsbUJBQW1CLENBQUM7Z0JBQzFCLE9BQU8saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO29CQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7b0JBQy9ELFNBQVEsR0FBSSxRQUFRLEVBQUU7Z0JBQ3ZCO1lBQ0QsQ0FBQyxDQUFDO1FBQ0g7UUFBRSxLQUFLO1lBQ04sVUFBVSxDQUFDO2dCQUNWLE9BQU8saUJBQWlCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO29CQUNyRCxJQUFNLFNBQVEsRUFBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7b0JBQy9ELFNBQVEsR0FBSSxRQUFRLEVBQUU7Z0JBQ3ZCO1lBQ0QsQ0FBQyxDQUFDO1FBQ0g7SUFDRDtBQUNEO0FBRUEsd0JBQXdCLGlCQUFvQztJQUMzRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUMxQjtJQUFFLEtBQUssR0FBRyxDQUFDLGlCQUFpQixDQUFDLGdCQUFlLElBQUssU0FBUyxFQUFFO1FBQzNELGlCQUFpQixDQUFDLGdCQUFlLEVBQUcsZ0JBQU0sQ0FBQyxxQkFBcUIsQ0FBQztZQUNoRSxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDMUIsQ0FBQyxDQUFDO0lBQ0g7QUFDRDtBQUVBLGdCQUFnQixpQkFBb0M7SUFDbkQsaUJBQWlCLENBQUMsZ0JBQWUsRUFBRyxTQUFTO0lBQzdDLElBQU0sWUFBVyxFQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUU7SUFDNUUsSUFBTSxRQUFPLG1CQUFPLFdBQVcsQ0FBQztJQUNoQyxjQUFjLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztJQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxRQUFDLENBQUMsTUFBSyxFQUFHLENBQUMsQ0FBQyxLQUFLLEVBQWpCLENBQWlCLENBQUM7SUFFekMsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ2QsdUNBQVE7UUFDVixrQ0FBbUQsRUFBakQsNEJBQVcsRUFBRSxnQkFBSztRQUMxQixJQUFNLGFBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFO1FBQ3JELFNBQVMsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDO0lBQ3BHO0lBQ0EsdUJBQXVCLENBQUMsaUJBQWlCLENBQUM7SUFDMUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUM7QUFDOUM7QUFFYSxZQUFHLEVBQUc7SUFDbEIsTUFBTSxFQUFFLFVBQ1AsVUFBbUIsRUFDbkIsUUFBb0MsRUFDcEMsaUJBQWtEO1FBQWxELDBEQUFrRDtRQUVsRCxJQUFNLGFBQVksRUFBRyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFO1FBQ3JELElBQU0sc0JBQXFCLEVBQUcsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDO1FBRS9FLHFCQUFxQixDQUFDLFNBQVEsRUFBRyxVQUFVO1FBQzNDLElBQU0sWUFBVyxFQUFHLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUM7UUFDakUsSUFBTSxLQUFJLEVBQUcsZUFBZSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUM7UUFDcEQsSUFBTSxZQUFXLEVBQWtCLEVBQUU7UUFDckMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsZUFBRSxDQUFDO1FBQ3ZELGNBQWMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDO1FBQ3hFLFlBQVksQ0FBQyxXQUFVLEVBQUc7WUFDekIsWUFBWSxDQUFDLE1BQUssRUFBRyxJQUFJO1lBQ3pCLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBUyxJQUFLLEtBQUssRUFBRTtnQkFDckMsSUFBTSxjQUFXLEVBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBRTtnQkFDaEYsYUFBVyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsWUFBRSxLQUFLLEVBQUUscUJBQXFCLENBQUMsTUFBSyxDQUFFLENBQUM7Z0JBQ2xFLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQztZQUN0QztRQUNELENBQUM7UUFDRCxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDO1FBQ25FLHFCQUFxQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztZQUMvQyxZQUFZLENBQUMsUUFBUSxFQUFFO1FBQ3hCLENBQUMsQ0FBQztRQUNGLDBCQUEwQixDQUFDLHFCQUFxQixDQUFDO1FBQ2pELHVCQUF1QixDQUFDLHFCQUFxQixDQUFDO1FBQzlDLE9BQU87WUFDTixPQUFPLEVBQUUscUJBQXFCLENBQUM7U0FDL0I7SUFDRixDQUFDO0lBQ0QsTUFBTSxFQUFFLFVBQVMsUUFBb0MsRUFBRSxpQkFBOEM7UUFDcEcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDO0lBQy9FLENBQUM7SUFDRCxLQUFLLEVBQUUsVUFDTixPQUFnQixFQUNoQixRQUFvQyxFQUNwQyxpQkFBa0Q7UUFBbEQsMERBQWtEO1FBRWxELGlCQUFpQixDQUFDLE1BQUssRUFBRyxJQUFJO1FBQzlCLGlCQUFpQixDQUFDLGFBQVksRUFBRyxPQUFPO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBcUIsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLENBQUM7SUFDL0U7Q0FDQTs7Ozs7Ozs7QUN0akNEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7QUN2THRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7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QUMsR0FBRyxDQUFDLElBQUksRUFBQyxDQUFFLEVBQUU7WUFDbEQsS0FBQyxDQUNBLElBQUksRUFDSjtnQkFDQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYTthQUNyQyxFQUNELEtBQUs7U0FFTixDQUFDO0lBQ0gsQ0FBQztJQWxDVyxLQUFJO1FBTGhCLDZCQUFhLENBQWlCO1lBQzlCLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLFlBQVk7U0FDckIsQ0FBQztRQUNELGNBQUssQ0FBQyxHQUFHO09BQ0csSUFBSSxDQW1DaEI7SUFBRCxXQUFDO0NBbkNELENBQTBCLG9CQUFXLENBQUMsdUJBQVUsQ0FBQztBQUFwQztBQXFDYixrQkFBZSxJQUFJOzs7Ozs7OztBQ3ZEbkI7QUFDQSxrQkFBa0Isd0UiLCJmaWxlIjoibWVudS0xLjAuMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhkZDJiODc5MDFhMDQxNjc0MGE4IiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSB9IGZyb20gJy4vbGFuZyc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdAZG9qby9zaGltL1Byb21pc2UnO1xuXG4vKipcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBub29wKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbn1cblxuLyoqXG4gKiBObyBvcCBmdW5jdGlvbiB1c2VkIHRvIHJlcGxhY2Ugb3duLCBvbmNlIGluc3RhbmNlIGhhcyBiZWVuIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBkZXN0cm95ZWQoKTogbmV2ZXIge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ0NhbGwgbWFkZSB0byBkZXN0cm95ZWQgbWV0aG9kJyk7XG59XG5cbmV4cG9ydCBjbGFzcyBEZXN0cm95YWJsZSB7XG5cdC8qKlxuXHQgKiByZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdHByaXZhdGUgaGFuZGxlczogSGFuZGxlW107XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5oYW5kbGVzID0gW107XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcblx0ICpcblx0ICogQHBhcmFtIHtIYW5kbGV9IGhhbmRsZSBUaGUgaGFuZGxlIHRvIGFkZCBmb3IgdGhlIGluc3RhbmNlXG5cdCAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxuXHQgKi9cblx0b3duKGhhbmRsZXM6IEhhbmRsZSB8IEhhbmRsZVtdKTogSGFuZGxlIHtcblx0XHRjb25zdCBoYW5kbGUgPSBBcnJheS5pc0FycmF5KGhhbmRsZXMpID8gY3JlYXRlQ29tcG9zaXRlSGFuZGxlKC4uLmhhbmRsZXMpIDogaGFuZGxlcztcblx0XHRjb25zdCB7IGhhbmRsZXM6IF9oYW5kbGVzIH0gPSB0aGlzO1xuXHRcdF9oYW5kbGVzLnB1c2goaGFuZGxlKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGVzdHJveSgpIHtcblx0XHRcdFx0X2hhbmRsZXMuc3BsaWNlKF9oYW5kbGVzLmluZGV4T2YoaGFuZGxlKSk7XG5cdFx0XHRcdGhhbmRsZS5kZXN0cm95KCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cnB5cyBhbGwgaGFuZGVycyByZWdpc3RlcmVkIGZvciB0aGUgaW5zdGFuY2Vcblx0ICpcblx0ICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcblx0ICovXG5cdGRlc3Ryb3koKTogUHJvbWlzZTxhbnk+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdHRoaXMuaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IHtcblx0XHRcdFx0aGFuZGxlICYmIGhhbmRsZS5kZXN0cm95ICYmIGhhbmRsZS5kZXN0cm95KCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZGVzdHJveSA9IG5vb3A7XG5cdFx0XHR0aGlzLm93biA9IGRlc3Ryb3llZDtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVzdHJveWFibGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRGVzdHJveWFibGUudHMiLCJpbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IEhhbmRsZSwgRXZlbnRUeXBlLCBFdmVudE9iamVjdCB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEZXN0cm95YWJsZSB9IGZyb20gJy4vRGVzdHJveWFibGUnO1xuXG4vKipcbiAqIE1hcCBvZiBjb21wdXRlZCByZWd1bGFyIGV4cHJlc3Npb25zLCBrZXllZCBieSBzdHJpbmdcbiAqL1xuY29uc3QgcmVnZXhNYXAgPSBuZXcgTWFwPHN0cmluZywgUmVnRXhwPigpO1xuXG4vKipcbiAqIERldGVybWluZXMgaXMgdGhlIGV2ZW50IHR5cGUgZ2xvYiBoYXMgYmVlbiBtYXRjaGVkXG4gKlxuICogQHJldHVybnMgYm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgZ2xvYiBpcyBtYXRjaGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JNYXRjaChnbG9iU3RyaW5nOiBzdHJpbmcgfCBzeW1ib2wsIHRhcmdldFN0cmluZzogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG5cdGlmICh0eXBlb2YgdGFyZ2V0U3RyaW5nID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgZ2xvYlN0cmluZyA9PT0gJ3N0cmluZycgJiYgZ2xvYlN0cmluZy5pbmRleE9mKCcqJykgIT09IC0xKSB7XG5cdFx0bGV0IHJlZ2V4OiBSZWdFeHA7XG5cdFx0aWYgKHJlZ2V4TWFwLmhhcyhnbG9iU3RyaW5nKSkge1xuXHRcdFx0cmVnZXggPSByZWdleE1hcC5nZXQoZ2xvYlN0cmluZykhO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWdleCA9IG5ldyBSZWdFeHAoYF4ke2dsb2JTdHJpbmcucmVwbGFjZSgvXFwqL2csICcuKicpfSRgKTtcblx0XHRcdHJlZ2V4TWFwLnNldChnbG9iU3RyaW5nLCByZWdleCk7XG5cdFx0fVxuXHRcdHJldHVybiByZWdleC50ZXN0KHRhcmdldFN0cmluZyk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcblx0fVxufVxuXG5leHBvcnQgdHlwZSBFdmVudGVkQ2FsbGJhY2s8VCA9IEV2ZW50VHlwZSwgRSBleHRlbmRzIEV2ZW50T2JqZWN0PFQ+ID0gRXZlbnRPYmplY3Q8VD4+ID0ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayB0aGF0IHRha2VzIGFuIGBldmVudGAgYXJndW1lbnRcblx0ICpcblx0ICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBvYmplY3Rcblx0ICovXG5cblx0KGV2ZW50OiBFKTogYm9vbGVhbiB8IHZvaWQ7XG59O1xuXG4vKipcbiAqIEEgdHlwZSB3aGljaCBpcyBlaXRoZXIgYSB0YXJnZXRlZCBldmVudCBsaXN0ZW5lciBvciBhbiBhcnJheSBvZiBsaXN0ZW5lcnNcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0eXBlIG9mIHRhcmdldCBmb3IgdGhlIGV2ZW50c1xuICogQHRlbXBsYXRlIEUgVGhlIGV2ZW50IHR5cGUgZm9yIHRoZSBldmVudHNcbiAqL1xuZXhwb3J0IHR5cGUgRXZlbnRlZENhbGxiYWNrT3JBcnJheTxUID0gRXZlbnRUeXBlLCBFIGV4dGVuZHMgRXZlbnRPYmplY3Q8VD4gPSBFdmVudE9iamVjdDxUPj4gPVxuXHR8IEV2ZW50ZWRDYWxsYmFjazxULCBFPlxuXHR8IEV2ZW50ZWRDYWxsYmFjazxULCBFPltdO1xuXG4vKipcbiAqIEV2ZW50IENsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudGVkPE0gZXh0ZW5kcyB7fSA9IHt9LCBUID0gRXZlbnRUeXBlLCBPIGV4dGVuZHMgRXZlbnRPYmplY3Q8VD4gPSBFdmVudE9iamVjdDxUPj4gZXh0ZW5kcyBEZXN0cm95YWJsZSB7XG5cdC8vIFRoZSBmb2xsb3dpbmcgbWVtYmVyIGlzIHB1cmVseSBzbyBUeXBlU2NyaXB0IHJlbWVtYmVycyB0aGUgdHlwZSBvZiBgTWAgd2hlbiBleHRlbmRpbmcgc29cblx0Ly8gdGhhdCB0aGUgdXRpbGl0aWVzIGluIGBvbi50c2Agd2lsbCB3b3JrIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjAzNDhcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5cdHByb3RlY3RlZCBfX3R5cGVNYXBfXz86IE07XG5cblx0LyoqXG5cdCAqIG1hcCBvZiBsaXN0ZW5lcnMga2V5ZWQgYnkgZXZlbnQgdHlwZVxuXHQgKi9cblx0cHJvdGVjdGVkIGxpc3RlbmVyc01hcDogTWFwPFQgfCBrZXlvZiBNLCBFdmVudGVkQ2FsbGJhY2s8VCwgTz5bXT4gPSBuZXcgTWFwKCk7XG5cblx0LyoqXG5cdCAqIEVtaXRzIHRoZSBldmVudCBvYmplY3QgZm9yIHRoZSBzcGVjaWZpZWQgdHlwZVxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGVtaXRcblx0ICovXG5cdGVtaXQ8SyBleHRlbmRzIGtleW9mIE0+KGV2ZW50OiBNW0tdKTogdm9pZDtcblx0ZW1pdChldmVudDogTyk6IHZvaWQ7XG5cdGVtaXQoZXZlbnQ6IGFueSk6IHZvaWQge1xuXHRcdHRoaXMubGlzdGVuZXJzTWFwLmZvckVhY2goKG1ldGhvZHMsIHR5cGUpID0+IHtcblx0XHRcdGlmIChpc0dsb2JNYXRjaCh0eXBlIGFzIGFueSwgZXZlbnQudHlwZSkpIHtcblx0XHRcdFx0bWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcblx0XHRcdFx0XHRtZXRob2QuY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhdGNoIGFsbCBoYW5kbGVyIGZvciB2YXJpb3VzIGNhbGwgc2lnbmF0dXJlcy4gVGhlIHNpZ25hdHVyZXMgYXJlIGRlZmluZWQgaW5cblx0ICogYEJhc2VFdmVudGVkRXZlbnRzYC4gIFlvdSBjYW4gYWRkIHlvdXIgb3duIGV2ZW50IHR5cGUgLT4gaGFuZGxlciB0eXBlcyBieSBleHRlbmRpbmdcblx0ICogYEJhc2VFdmVudGVkRXZlbnRzYC4gIFNlZSBleGFtcGxlIGZvciBkZXRhaWxzLlxuXHQgKlxuXHQgKiBAcGFyYW0gYXJnc1xuXHQgKlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiBpbnRlcmZhY2UgV2lkZ2V0QmFzZUV2ZW50cyBleHRlbmRzIEJhc2VFdmVudGVkRXZlbnRzIHtcblx0ICogICAgICh0eXBlOiAncHJvcGVydGllczpjaGFuZ2VkJywgaGFuZGxlcjogUHJvcGVydGllc0NoYW5nZWRIYW5kbGVyKTogSGFuZGxlO1xuXHQgKiB9XG5cdCAqIGNsYXNzIFdpZGdldEJhc2UgZXh0ZW5kcyBFdmVudGVkIHtcblx0ICogICAgb246IFdpZGdldEJhc2VFdmVudHM7XG5cdCAqIH1cblx0ICpcblx0ICogQHJldHVybiB7YW55fVxuXHQgKi9cblx0b248SyBleHRlbmRzIGtleW9mIE0+KHR5cGU6IEssIGxpc3RlbmVyOiBFdmVudGVkQ2FsbGJhY2tPckFycmF5PEssIE1bS10+KTogSGFuZGxlO1xuXHRvbih0eXBlOiBULCBsaXN0ZW5lcjogRXZlbnRlZENhbGxiYWNrT3JBcnJheTxULCBPPik6IEhhbmRsZTtcblx0b24odHlwZTogYW55LCBsaXN0ZW5lcjogRXZlbnRlZENhbGxiYWNrT3JBcnJheTxhbnksIGFueT4pOiBIYW5kbGUge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVyKSkge1xuXHRcdFx0Y29uc3QgaGFuZGxlcyA9IGxpc3RlbmVyLm1hcCgobGlzdGVuZXIpID0+IHRoaXMuX2FkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkZXN0cm95KCkge1xuXHRcdFx0XHRcdGhhbmRsZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUuZGVzdHJveSgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2FkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKTtcblx0fVxuXG5cdHByaXZhdGUgX2FkZExpc3RlbmVyKHR5cGU6IFQgfCBrZXlvZiBNLCBsaXN0ZW5lcjogRXZlbnRlZENhbGxiYWNrPFQsIE8+KSB7XG5cdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNNYXAuZ2V0KHR5cGUpIHx8IFtdO1xuXHRcdGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblx0XHR0aGlzLmxpc3RlbmVyc01hcC5zZXQodHlwZSwgbGlzdGVuZXJzKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGVzdHJveTogKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XG5cdFx0XHRcdGxpc3RlbmVycy5zcGxpY2UobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50ZWQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRXZlbnRlZC50cyIsImltcG9ydCB7IEhhbmRsZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5cbmV4cG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcblxuY29uc3Qgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcbiAqL1xuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWU6IGFueSk6IHZhbHVlIGlzIE9iamVjdCB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gY29weUFycmF5PFQ+KGFycmF5OiBUW10sIGluaGVyaXRlZDogYm9vbGVhbik6IFRbXSB7XG5cdHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24oaXRlbTogVCk6IFQge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG5cdFx0XHRyZXR1cm4gPGFueT5jb3B5QXJyYXkoPGFueT5pdGVtLCBpbmhlcml0ZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSlcblx0XHRcdD8gaXRlbVxuXHRcdFx0OiBfbWl4aW4oe1xuXHRcdFx0XHRcdGRlZXA6IHRydWUsXG5cdFx0XHRcdFx0aW5oZXJpdGVkOiBpbmhlcml0ZWQsXG5cdFx0XHRcdFx0c291cmNlczogPEFycmF5PFQ+PltpdGVtXSxcblx0XHRcdFx0XHR0YXJnZXQ6IDxUPnt9XG5cdFx0XHRcdH0pO1xuXHR9KTtcbn1cblxuaW50ZXJmYWNlIE1peGluQXJnczxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4ge1xuXHRkZWVwOiBib29sZWFuO1xuXHRpbmhlcml0ZWQ6IGJvb2xlYW47XG5cdHNvdXJjZXM6IChVIHwgbnVsbCB8IHVuZGVmaW5lZClbXTtcblx0dGFyZ2V0OiBUO1xuXHRjb3BpZWQ/OiBhbnlbXTtcbn1cblxuZnVuY3Rpb24gX21peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pihrd0FyZ3M6IE1peGluQXJnczxULCBVPik6IFQgJiBVIHtcblx0Y29uc3QgZGVlcCA9IGt3QXJncy5kZWVwO1xuXHRjb25zdCBpbmhlcml0ZWQgPSBrd0FyZ3MuaW5oZXJpdGVkO1xuXHRjb25zdCB0YXJnZXQ6IGFueSA9IGt3QXJncy50YXJnZXQ7XG5cdGNvbnN0IGNvcGllZCA9IGt3QXJncy5jb3BpZWQgfHwgW107XG5cdGNvbnN0IGNvcGllZENsb25lID0gWy4uLmNvcGllZF07XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrd0FyZ3Muc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xuXG5cdFx0aWYgKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcblx0XHRcdGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcblx0XHRcdFx0bGV0IHZhbHVlOiBhbnkgPSBzb3VyY2Vba2V5XTtcblxuXHRcdFx0XHRpZiAoY29waWVkQ2xvbmUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGVlcCkge1xuXHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBjb3B5QXJyYXkodmFsdWUsIGluaGVyaXRlZCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldFZhbHVlOiBhbnkgPSB0YXJnZXRba2V5XSB8fCB7fTtcblx0XHRcdFx0XHRcdGNvcGllZC5wdXNoKHNvdXJjZSk7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9taXhpbih7XG5cdFx0XHRcdFx0XHRcdGRlZXA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGluaGVyaXRlZDogaW5oZXJpdGVkLFxuXHRcdFx0XHRcdFx0XHRzb3VyY2VzOiBbdmFsdWVdLFxuXHRcdFx0XHRcdFx0XHR0YXJnZXQ6IHRhcmdldFZhbHVlLFxuXHRcdFx0XHRcdFx0XHRjb3BpZWRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXRba2V5XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiA8VCAmIFU+dGFyZ2V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSwgYW5kIGNvcGllcyBhbGwgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZVxuICogc291cmNlIG9iamVjdHMgdG8gdGhlIG5ld2x5IGNyZWF0ZWQgdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gcHJvdG90eXBlIFRoZSBwcm90b3R5cGUgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBmcm9tXG4gKiBAcGFyYW0gbWl4aW5zIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBjcmVhdGVkIG9iamVjdFxuICogQHJldHVybiBUaGUgbmV3IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFxuXHRUIGV4dGVuZHMge30sXG5cdFUgZXh0ZW5kcyB7fSxcblx0ViBleHRlbmRzIHt9LFxuXHRXIGV4dGVuZHMge30sXG5cdFggZXh0ZW5kcyB7fSxcblx0WSBleHRlbmRzIHt9LFxuXHRaIGV4dGVuZHMge31cbj4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogViwgbWl4aW4zOiBXLCBtaXhpbjQ6IFgsIG1peGluNTogWSwgbWl4aW42OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4oXG5cdHByb3RvdHlwZTogVCxcblx0bWl4aW4xOiBVLFxuXHRtaXhpbjI6IFYsXG5cdG1peGluMzogVyxcblx0bWl4aW40OiBYLFxuXHRtaXhpbjU6IFlcbik6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KFxuXHRwcm90b3R5cGU6IFQsXG5cdG1peGluMTogVSxcblx0bWl4aW4yOiBWLFxuXHRtaXhpbjM6IFcsXG5cdG1peGluNDogWFxuKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4oXG5cdHByb3RvdHlwZTogVCxcblx0bWl4aW4xOiBVLFxuXHRtaXhpbjI6IFYsXG5cdG1peGluMzogV1xuKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW46IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQpOiBUO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGU6IGFueSwgLi4ubWl4aW5zOiBhbnlbXSk6IGFueSB7XG5cdGlmICghbWl4aW5zLmxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdsYW5nLmNyZWF0ZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgbWl4aW4gb2JqZWN0LicpO1xuXHR9XG5cblx0Y29uc3QgYXJncyA9IG1peGlucy5zbGljZSgpO1xuXHRhcmdzLnVuc2hpZnQoT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpKTtcblxuXHRyZXR1cm4gYXNzaWduLmFwcGx5KG51bGwsIGFyZ3MpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZSB0YXJnZXQgb2JqZWN0LFxuICogcmVjdXJzaXZlbHkgY29weWluZyBhbGwgbmVzdGVkIG9iamVjdHMgYW5kIGFycmF5cyBhcyB3ZWxsLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gcmVjZWl2ZSB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0c1xuICogQHBhcmFtIHNvdXJjZXMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIHRhcmdldCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248XG5cdFQgZXh0ZW5kcyB7fSxcblx0VSBleHRlbmRzIHt9LFxuXHRWIGV4dGVuZHMge30sXG5cdFcgZXh0ZW5kcyB7fSxcblx0WCBleHRlbmRzIHt9LFxuXHRZIGV4dGVuZHMge30sXG5cdFogZXh0ZW5kcyB7fVxuPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWCxcblx0c291cmNlNTogWVxuKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFcsXG5cdHNvdXJjZTQ6IFhcbik6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pihcblx0dGFyZ2V0OiBULFxuXHRzb3VyY2UxOiBVLFxuXHRzb3VyY2UyOiBWLFxuXHRzb3VyY2UzOiBXXG4pOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiB0cnVlLFxuXHRcdGluaGVyaXRlZDogZmFsc2UsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSAob3duIG9yIGluaGVyaXRlZCkgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIHRhcmdldCBvYmplY3QsIHJlY3Vyc2l2ZWx5IGNvcHlpbmcgYWxsIG5lc3RlZCBvYmplY3RzIGFuZCBhcnJheXMgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIHJlY2VpdmUgdmFsdWVzIGZyb20gc291cmNlIG9iamVjdHNcbiAqIEBwYXJhbSBzb3VyY2VzIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIHRhcmdldCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxcblx0VCBleHRlbmRzIHt9LFxuXHRVIGV4dGVuZHMge30sXG5cdFYgZXh0ZW5kcyB7fSxcblx0VyBleHRlbmRzIHt9LFxuXHRYIGV4dGVuZHMge30sXG5cdFkgZXh0ZW5kcyB7fSxcblx0WiBleHRlbmRzIHt9XG4+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSwgc291cmNlNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFcsXG5cdHNvdXJjZTQ6IFgsXG5cdHNvdXJjZTU6IFlcbik6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFcsXG5cdHNvdXJjZTQ6IFhcbik6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFdcbik6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IHRydWUsXG5cdFx0aW5oZXJpdGVkOiB0cnVlLFxuXHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0dGFyZ2V0OiB0YXJnZXRcblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGU8VCBleHRlbmRzIHt9Pihzb3VyY2U6IFQpOiBUIHtcblx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XG5cblx0cmV0dXJuIGRlZXBNaXhpbih0YXJnZXQsIHNvdXJjZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBhIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSBiIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWU7IGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGljYWwoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHRhID09PSBiIHx8XG5cdFx0LyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xuXHRcdChhICE9PSBhICYmIGIgIT09IGIpXG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYmluZHMgYSBtZXRob2QgdG8gdGhlIHNwZWNpZmllZCBvYmplY3QgYXQgcnVudGltZS4gVGhpcyBpcyBzaW1pbGFyIHRvXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cbiAqIEFzIGEgcmVzdWx0LCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgYnkgYGxhdGVCaW5kYCB3aWxsIGFsd2F5cyBjYWxsIHRoZSBmdW5jdGlvbiBjdXJyZW50bHkgYXNzaWduZWQgdG9cbiAqIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgb24gdGhlIG9iamVjdCBhcyBvZiB0aGUgbW9tZW50IHRoZSBmdW5jdGlvbiBpdCByZXR1cm5zIGlzIGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGNvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbWV0aG9kIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgb24gdGhlIGNvbnRleHQgb2JqZWN0IHRvIGJpbmQgdG8gaXRzZWxmXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXRlQmluZChpbnN0YW5jZToge30sIG1ldGhvZDogc3RyaW5nLCAuLi5zdXBwbGllZEFyZ3M6IGFueVtdKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gc3VwcGxpZWRBcmdzLmxlbmd0aFxuXHRcdD8gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IGFyZ3M6IGFueVtdID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcblxuXHRcdFx0XHQvLyBUUzcwMTdcblx0XHRcdFx0cmV0dXJuICg8YW55Pmluc3RhbmNlKVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblx0XHRcdH1cblx0XHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBUUzcwMTdcblx0XHRcdFx0cmV0dXJuICg8YW55Pmluc3RhbmNlKVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSAob3duIG9yIGluaGVyaXRlZCkgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHJldHVybiBUaGUgbW9kaWZpZWQgdGFyZ2V0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pihcblx0dGFyZ2V0OiBULFxuXHRzb3VyY2UxOiBVLFxuXHRzb3VyY2UyOiBWLFxuXHRzb3VyY2UzOiBXLFxuXHRzb3VyY2U0OiBYLFxuXHRzb3VyY2U1OiBZLFxuXHRzb3VyY2U2OiBaXG4pOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KFxuXHR0YXJnZXQ6IFQsXG5cdHNvdXJjZTE6IFUsXG5cdHNvdXJjZTI6IFYsXG5cdHNvdXJjZTM6IFcsXG5cdHNvdXJjZTQ6IFgsXG5cdHNvdXJjZTU6IFlcbik6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fT4oXG5cdHRhcmdldDogVCxcblx0c291cmNlMTogVSxcblx0c291cmNlMjogVixcblx0c291cmNlMzogVyxcblx0c291cmNlNDogWFxuKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pihcblx0dGFyZ2V0OiBULFxuXHRzb3VyY2UxOiBVLFxuXHRzb3VyY2UyOiBWLFxuXHRzb3VyY2UzOiBXXG4pOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiBmYWxzZSxcblx0XHRpbmhlcml0ZWQ6IHRydWUsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIHByZXBlbmRlZCB0byBpdHMgYXJndW1lbnQgbGlzdC5cbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXRGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBib3VuZFxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpYWwodGFyZ2V0RnVuY3Rpb246ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCAuLi5zdXBwbGllZEFyZ3M6IGFueVtdKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gZnVuY3Rpb24odGhpczogYW55KSB7XG5cdFx0Y29uc3QgYXJnczogYW55W10gPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuXG5cdFx0cmV0dXJuIHRhcmdldEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBkZXN0cm95IG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgY2FsbHMgdGhlIHBhc3NlZC1pbiBkZXN0cnVjdG9yLlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcbiAqIGV2ZW50IGxpc3RlbmVycywgdGltZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGRlc3RydWN0b3I6ICgpID0+IHZvaWQpOiBIYW5kbGUge1xuXHRyZXR1cm4ge1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKHRoaXM6IEhhbmRsZSkge1xuXHRcdFx0dGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKSB7fTtcblx0XHRcdGRlc3RydWN0b3IuY2FsbCh0aGlzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXN0cm95IG11bHRpcGxlIGhhbmRsZXMgc2ltdWx0YW5lb3VzbHkuXG4gKlxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlczogSGFuZGxlW10pOiBIYW5kbGUge1xuXHRyZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uKCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aGFuZGxlc1tpXS5kZXN0cm95KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsYW5nLnRzIiwiaW1wb3J0IGhhcywgeyBhZGQgfSBmcm9tICdAZG9qby9oYXMvaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi4vZ2xvYmFsJztcblxuZXhwb3J0IGRlZmF1bHQgaGFzO1xuZXhwb3J0ICogZnJvbSAnQGRvam8vaGFzL2hhcyc7XG5cbi8qIEVDTUFTY3JpcHQgNiBhbmQgNyBGZWF0dXJlcyAqL1xuXG4vKiBBcnJheSAqL1xuYWRkKFxuXHQnZXM2LWFycmF5Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRbJ2Zyb20nLCAnb2YnXS5ldmVyeSgoa2V5KSA9PiBrZXkgaW4gZ2xvYmFsLkFycmF5KSAmJlxuXHRcdFx0WydmaW5kSW5kZXgnLCAnZmluZCcsICdjb3B5V2l0aGluJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LWFycmF5LWZpbGwnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKCdmaWxsJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlKSB7XG5cdFx0XHQvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cblx0XHRcdHJldHVybiAoPGFueT5bMV0pLmZpbGwoOSwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKVswXSA9PT0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoJ2VzNy1hcnJheScsICgpID0+ICdpbmNsdWRlcycgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSwgdHJ1ZSk7XG5cbi8qIE1hcCAqL1xuYWRkKFxuXHQnZXM2LW1hcCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5NYXAgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdC8qXG5cdFx0SUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eVxuXHRcdFdlIHdyYXAgdGhpcyBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIHNvbWV0aW1lcyB0aGUgTWFwIGNvbnN0cnVjdG9yIGV4aXN0cywgYnV0IGRvZXMgbm90XG5cdFx0dGFrZSBhcmd1bWVudHMgKGlPUyA4LjQpXG5cdFx0ICovXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLk1hcChbWzAsIDFdXSk7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRtYXAuaGFzKDApICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC5rZXlzID09PSAnZnVuY3Rpb24nICYmXG5cdFx0XHRcdFx0aGFzKCdlczYtc3ltYm9sJykgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogbm90IHRlc3Rpbmcgb24gaU9TIGF0IHRoZSBtb21lbnQgKi9cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE1hdGggKi9cbmFkZChcblx0J2VzNi1tYXRoJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnY2x6MzInLFxuXHRcdFx0J3NpZ24nLFxuXHRcdFx0J2xvZzEwJyxcblx0XHRcdCdsb2cyJyxcblx0XHRcdCdsb2cxcCcsXG5cdFx0XHQnZXhwbTEnLFxuXHRcdFx0J2Nvc2gnLFxuXHRcdFx0J3NpbmgnLFxuXHRcdFx0J3RhbmgnLFxuXHRcdFx0J2Fjb3NoJyxcblx0XHRcdCdhc2luaCcsXG5cdFx0XHQnYXRhbmgnLFxuXHRcdFx0J3RydW5jJyxcblx0XHRcdCdmcm91bmQnLFxuXHRcdFx0J2NicnQnLFxuXHRcdFx0J2h5cG90J1xuXHRcdF0uZXZlcnkoKG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuTWF0aFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1tYXRoLWltdWwnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKCdpbXVsJyBpbiBnbG9iYWwuTWF0aCkge1xuXHRcdFx0LyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgb24gaW9zIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xuXHRcdFx0cmV0dXJuICg8YW55Pk1hdGgpLmltdWwoMHhmZmZmZmZmZiwgNSkgPT09IC01O1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE9iamVjdCAqL1xuYWRkKFxuXHQnZXM2LW9iamVjdCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0aGFzKCdlczYtc3ltYm9sJykgJiZcblx0XHRcdFsnYXNzaWduJywgJ2lzJywgJ2dldE93blByb3BlcnR5U3ltYm9scycsICdzZXRQcm90b3R5cGVPZiddLmV2ZXJ5KFxuXHRcdFx0XHQobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbidcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczIwMTctb2JqZWN0Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbJ3ZhbHVlcycsICdlbnRyaWVzJywgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcnMnXS5ldmVyeShcblx0XHRcdChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE9ic2VydmFibGUgKi9cbmFkZCgnZXMtb2JzZXJ2YWJsZScsICgpID0+IHR5cGVvZiBnbG9iYWwuT2JzZXJ2YWJsZSAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xuXG4vKiBQcm9taXNlICovXG5hZGQoJ2VzNi1wcm9taXNlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5Qcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBoYXMoJ2VzNi1zeW1ib2wnKSwgdHJ1ZSk7XG5cbi8qIFNldCAqL1xuYWRkKFxuXHQnZXM2LXNldCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5TZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgU2V0IGZ1bmN0aW9uYWxpdHkgKi9cblx0XHRcdGNvbnN0IHNldCA9IG5ldyBnbG9iYWwuU2V0KFsxXSk7XG5cdFx0XHRyZXR1cm4gc2V0LmhhcygxKSAmJiAna2V5cycgaW4gc2V0ICYmIHR5cGVvZiBzZXQua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiBoYXMoJ2VzNi1zeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBTdHJpbmcgKi9cbmFkZChcblx0J2VzNi1zdHJpbmcnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFtcblx0XHRcdFx0Lyogc3RhdGljIG1ldGhvZHMgKi9cblx0XHRcdFx0J2Zyb21Db2RlUG9pbnQnXG5cdFx0XHRdLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nW2tleV0gPT09ICdmdW5jdGlvbicpICYmXG5cdFx0XHRbXG5cdFx0XHRcdC8qIGluc3RhbmNlIG1ldGhvZHMgKi9cblx0XHRcdFx0J2NvZGVQb2ludEF0Jyxcblx0XHRcdFx0J25vcm1hbGl6ZScsXG5cdFx0XHRcdCdyZXBlYXQnLFxuXHRcdFx0XHQnc3RhcnRzV2l0aCcsXG5cdFx0XHRcdCdlbmRzV2l0aCcsXG5cdFx0XHRcdCdpbmNsdWRlcydcblx0XHRcdF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LXN0cmluZy1yYXcnLFxuXHQoKSA9PiB7XG5cdFx0ZnVuY3Rpb24gZ2V0Q2FsbFNpdGUoY2FsbFNpdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gWy4uLmNhbGxTaXRlXTtcblx0XHRcdChyZXN1bHQgYXMgYW55KS5yYXcgPSBjYWxsU2l0ZS5yYXc7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGlmICgncmF3JyBpbiBnbG9iYWwuU3RyaW5nKSB7XG5cdFx0XHRsZXQgYiA9IDE7XG5cdFx0XHRsZXQgY2FsbFNpdGUgPSBnZXRDYWxsU2l0ZWBhXFxuJHtifWA7XG5cblx0XHRcdChjYWxsU2l0ZSBhcyBhbnkpLnJhdyA9IFsnYVxcXFxuJ107XG5cdFx0XHRjb25zdCBzdXBwb3J0c1RydW5jID0gZ2xvYmFsLlN0cmluZy5yYXcoY2FsbFNpdGUsIDQyKSA9PT0gJ2E6XFxcXG4nO1xuXG5cdFx0XHRyZXR1cm4gc3VwcG9ydHNUcnVuYztcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzMjAxNy1zdHJpbmcnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFsncGFkU3RhcnQnLCAncGFkRW5kJ10uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBTeW1ib2wgKi9cbmFkZCgnZXM2LXN5bWJvbCcsICgpID0+IHR5cGVvZiBnbG9iYWwuU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnLCB0cnVlKTtcblxuLyogV2Vha01hcCAqL1xuYWRkKFxuXHQnZXM2LXdlYWttYXAnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHkgKi9cblx0XHRcdGNvbnN0IGtleTEgPSB7fTtcblx0XHRcdGNvbnN0IGtleTIgPSB7fTtcblx0XHRcdGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuV2Vha01hcChbW2tleTEsIDFdXSk7XG5cdFx0XHRPYmplY3QuZnJlZXplKGtleTEpO1xuXHRcdFx0cmV0dXJuIG1hcC5nZXQoa2V5MSkgPT09IDEgJiYgbWFwLnNldChrZXkyLCAyKSA9PT0gbWFwICYmIGhhcygnZXM2LXN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE1pc2NlbGxhbmVvdXMgZmVhdHVyZXMgKi9cbmFkZCgnbWljcm90YXNrcycsICgpID0+IGhhcygnZXM2LXByb21pc2UnKSB8fCBoYXMoJ2hvc3Qtbm9kZScpIHx8IGhhcygnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKSwgdHJ1ZSk7XG5hZGQoXG5cdCdwb3N0bWVzc2FnZScsXG5cdCgpID0+IHtcblx0XHQvLyBJZiB3aW5kb3cgaXMgdW5kZWZpbmVkLCBhbmQgd2UgaGF2ZSBwb3N0TWVzc2FnZSwgaXQgcHJvYmFibHkgbWVhbnMgd2UncmUgaW4gYSB3ZWIgd29ya2VyLiBXZWIgd29ya2VycyBoYXZlXG5cdFx0Ly8gcG9zdCBtZXNzYWdlIGJ1dCBpdCBkb2Vzbid0IHdvcmsgaG93IHdlIGV4cGVjdCBpdCB0bywgc28gaXQncyBiZXN0IGp1c3QgdG8gcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuXHRcdHJldHVybiB0eXBlb2YgZ2xvYmFsLndpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGdsb2JhbC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcblx0fSxcblx0dHJ1ZVxuKTtcbmFkZCgncmFmJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicsIHRydWUpO1xuYWRkKCdzZXRpbW1lZGlhdGUnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xuXG4vKiBET00gRmVhdHVyZXMgKi9cblxuYWRkKFxuXHQnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLFxuXHQoKSA9PiB7XG5cdFx0aWYgKGhhcygnaG9zdC1icm93c2VyJykgJiYgQm9vbGVhbihnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcikpIHtcblx0XHRcdC8vIElFMTEgaGFzIGFuIHVucmVsaWFibGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiB3aGVyZSBzZXRQcm9wZXJ0eSgpIGRvZXMgbm90XG5cdFx0XHQvLyBnZW5lcmF0ZSBhIG11dGF0aW9uIGV2ZW50LCBvYnNlcnZlcnMgY2FuIGNyYXNoLCBhbmQgdGhlIHF1ZXVlIGRvZXMgbm90IGRyYWluXG5cdFx0XHQvLyByZWxpYWJseS4gVGhlIGZvbGxvd2luZyBmZWF0dXJlIHRlc3Qgd2FzIGFkYXB0ZWQgZnJvbVxuXHRcdFx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdDEwa28vNGFjZWI4YzcxNjgxZmRiMjc1ZTMzZWZlNWU1NzZiMTRcblx0XHRcdGNvbnN0IGV4YW1wbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0XHRjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKSB7fSk7XG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKGV4YW1wbGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuXHRcdFx0ZXhhbXBsZS5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihvYnNlcnZlci50YWtlUmVjb3JkcygpLmxlbmd0aCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZG9tLXdlYmFuaW1hdGlvbicsXG5cdCgpID0+IGhhcygnaG9zdC1icm93c2VyJykgJiYgZ2xvYmFsLkFuaW1hdGlvbiAhPT0gdW5kZWZpbmVkICYmIGdsb2JhbC5LZXlmcmFtZUVmZmVjdCAhPT0gdW5kZWZpbmVkLFxuXHR0cnVlXG4pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGhhcy50cyIsImltcG9ydCB7IGlzQXJyYXlMaWtlLCBJdGVyYWJsZSwgSXRlcmFibGVJdGVyYXRvciwgU2hpbUl0ZXJhdG9yIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzIGFzIG9iamVjdElzIH0gZnJvbSAnLi9vYmplY3QnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcDxLLCBWPiB7XG5cdC8qKlxuXHQgKiBEZWxldGVzIGFsbCBrZXlzIGFuZCB0aGVpciBhc3NvY2lhdGVkIHZhbHVlcy5cblx0ICovXG5cdGNsZWFyKCk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIERlbGV0ZXMgYSBnaXZlbiBrZXkgYW5kIGl0cyBhc3NvY2lhdGVkIHZhbHVlLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gZGVsZXRlXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUga2V5IGV4aXN0cywgZmFsc2UgaWYgaXQgZG9lcyBub3Rcblx0ICovXG5cdGRlbGV0ZShrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2gga2V5L3ZhbHVlIHBhaXIgYXMgYW4gYXJyYXkuXG5cdCAqXG5cdCAqIEByZXR1cm4gQW4gaXRlcmF0b3IgZm9yIGVhY2gga2V5L3ZhbHVlIHBhaXIgaW4gdGhlIGluc3RhbmNlLlxuXHQgKi9cblx0ZW50cmllcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT47XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIGEgZ2l2ZW4gZnVuY3Rpb24gZm9yIGVhY2ggbWFwIGVudHJ5LiBUaGUgZnVuY3Rpb25cblx0ICogaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogdGhlIGVsZW1lbnQgdmFsdWUsIHRoZVxuXHQgKiBlbGVtZW50IGtleSwgYW5kIHRoZSBhc3NvY2lhdGVkIE1hcCBpbnN0YW5jZS5cblx0ICpcblx0ICogQHBhcmFtIGNhbGxiYWNrZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgZm9yIGVhY2ggbWFwIGVudHJ5LFxuXHQgKiBAcGFyYW0gdGhpc0FyZyBUaGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2AgZm9yIGVhY2ggZXhlY3V0aW9uIG9mIHRoZSBjYWxiYWNrXG5cdCAqL1xuXHRmb3JFYWNoKGNhbGxiYWNrZm46ICh2YWx1ZTogViwga2V5OiBLLCBtYXA6IE1hcDxLLCBWPikgPT4gdm9pZCwgdGhpc0FyZz86IGFueSk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGtleS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGxvb2sgdXBcblx0ICogQHJldHVybiBUaGUgdmFsdWUgaWYgb25lIGV4aXN0cyBvciB1bmRlZmluZWRcblx0ICovXG5cdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2gga2V5IGluIHRoZSBtYXAuXG5cdCAqXG5cdCAqIEByZXR1cm4gQW4gaXRlcmF0b3IgY29udGFpbmluZyB0aGUgaW5zdGFuY2UncyBrZXlzLlxuXHQgKi9cblx0a2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEs+O1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgZm9yIHRoZSBwcmVzZW5jZSBvZiBhIGdpdmVuIGtleS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGNoZWNrIGZvclxuXHQgKiBAcmV0dXJuIHRydWUgaWYgdGhlIGtleSBleGlzdHMsIGZhbHNlIGlmIGl0IGRvZXMgbm90XG5cdCAqL1xuXHRoYXMoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gZGVmaW5lIGEgdmFsdWUgdG9cblx0ICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ25cblx0ICogQHJldHVybiBUaGUgTWFwIGluc3RhbmNlXG5cdCAqL1xuXHRzZXQoa2V5OiBLLCB2YWx1ZTogVik6IHRoaXM7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBrZXkgLyB2YWx1ZSBwYWlycyBpbiB0aGUgTWFwLlxuXHQgKi9cblx0cmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRoYXQgeWllbGRzIGVhY2ggdmFsdWUgaW4gdGhlIG1hcC5cblx0ICpcblx0ICogQHJldHVybiBBbiBpdGVyYXRvciBjb250YWluaW5nIHRoZSBpbnN0YW5jZSdzIHZhbHVlcy5cblx0ICovXG5cdHZhbHVlcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFY+O1xuXG5cdC8qKiBSZXR1cm5zIGFuIGl0ZXJhYmxlIG9mIGVudHJpZXMgaW4gdGhlIG1hcC4gKi9cblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+O1xuXG5cdHJlYWRvbmx5IFtTeW1ib2wudG9TdHJpbmdUYWddOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwQ29uc3RydWN0b3Ige1xuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRuZXcgKCk6IE1hcDxhbnksIGFueT47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTWFwXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmF0b3Jcblx0ICogQXJyYXkgb3IgaXRlcmF0b3IgY29udGFpbmluZyB0d28taXRlbSB0dXBsZXMgdXNlZCB0byBpbml0aWFsbHkgcG9wdWxhdGUgdGhlIG1hcC5cblx0ICogVGhlIGZpcnN0IGl0ZW0gaW4gZWFjaCB0dXBsZSBjb3JyZXNwb25kcyB0byB0aGUga2V5IG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqIFRoZSBzZWNvbmQgaXRlbSBjb3JyZXNwb25kcyB0byB0aGUgdmFsdWUgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICovXG5cdG5ldyA8SywgVj4oaXRlcmF0b3I/OiBbSywgVl1bXSk6IE1hcDxLLCBWPjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNYXBcblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVyYXRvclxuXHQgKiBBcnJheSBvciBpdGVyYXRvciBjb250YWluaW5nIHR3by1pdGVtIHR1cGxlcyB1c2VkIHRvIGluaXRpYWxseSBwb3B1bGF0ZSB0aGUgbWFwLlxuXHQgKiBUaGUgZmlyc3QgaXRlbSBpbiBlYWNoIHR1cGxlIGNvcnJlc3BvbmRzIHRvIHRoZSBrZXkgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICogVGhlIHNlY29uZCBpdGVtIGNvcnJlc3BvbmRzIHRvIHRoZSB2YWx1ZSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKi9cblx0bmV3IDxLLCBWPihpdGVyYXRvcjogSXRlcmFibGU8W0ssIFZdPik6IE1hcDxLLCBWPjtcblxuXHRyZWFkb25seSBwcm90b3R5cGU6IE1hcDxhbnksIGFueT47XG5cblx0cmVhZG9ubHkgW1N5bWJvbC5zcGVjaWVzXTogTWFwQ29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBsZXQgTWFwOiBNYXBDb25zdHJ1Y3RvciA9IGdsb2JhbC5NYXA7XG5cbmlmICghaGFzKCdlczYtbWFwJykpIHtcblx0TWFwID0gY2xhc3MgTWFwPEssIFY+IHtcblx0XHRwcm90ZWN0ZWQgcmVhZG9ubHkgX2tleXM6IEtbXSA9IFtdO1xuXHRcdHByb3RlY3RlZCByZWFkb25seSBfdmFsdWVzOiBWW10gPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIEFuIGFsdGVybmF0aXZlIHRvIEFycmF5LnByb3RvdHlwZS5pbmRleE9mIHVzaW5nIE9iamVjdC5pc1xuXHRcdCAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxuXHRcdCAqL1xuXHRcdHByb3RlY3RlZCBfaW5kZXhPZktleShrZXlzOiBLW10sIGtleTogSyk6IG51bWJlciB7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob2JqZWN0SXMoa2V5c1tpXSwga2V5KSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIFtTeW1ib2wuc3BlY2llc10gPSBNYXA7XG5cblx0XHRjb25zdHJ1Y3RvcihpdGVyYWJsZT86IEFycmF5TGlrZTxbSywgVl0+IHwgSXRlcmFibGU8W0ssIFZdPikge1xuXHRcdFx0aWYgKGl0ZXJhYmxlKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRnZXQgc2l6ZSgpOiBudW1iZXIge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2tleXMubGVuZ3RoO1xuXHRcdH1cblxuXHRcdGNsZWFyKCk6IHZvaWQge1xuXHRcdFx0dGhpcy5fa2V5cy5sZW5ndGggPSB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbiB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdGlmIChpbmRleCA8IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dGhpcy5fdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbnRyaWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPiB7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLl9rZXlzLm1hcCgoa2V5OiBLLCBpOiBudW1iZXIpOiBbSywgVl0gPT4ge1xuXHRcdFx0XHRyZXR1cm4gW2tleSwgdGhpcy5fdmFsdWVzW2ldXTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih2YWx1ZXMpO1xuXHRcdH1cblxuXHRcdGZvckVhY2goY2FsbGJhY2s6ICh2YWx1ZTogViwga2V5OiBLLCBtYXBJbnN0YW5jZTogTWFwPEssIFY+KSA9PiBhbnksIGNvbnRleHQ/OiB7fSkge1xuXHRcdFx0Y29uc3Qga2V5cyA9IHRoaXMuX2tleXM7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLl92YWx1ZXM7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlc1tpXSwga2V5c1tpXSwgdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQge1xuXHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XG5cdFx0XHRyZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogdGhpcy5fdmFsdWVzW2luZGV4XTtcblx0XHR9XG5cblx0XHRoYXMoa2V5OiBLKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpID4gLTE7XG5cdFx0fVxuXG5cdFx0a2V5cygpOiBJdGVyYWJsZUl0ZXJhdG9yPEs+IHtcblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHRoaXMuX2tleXMpO1xuXHRcdH1cblxuXHRcdHNldChrZXk6IEssIHZhbHVlOiBWKTogTWFwPEssIFY+IHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcblx0XHRcdGluZGV4ID0gaW5kZXggPCAwID8gdGhpcy5fa2V5cy5sZW5ndGggOiBpbmRleDtcblx0XHRcdHRoaXMuX2tleXNbaW5kZXhdID0ga2V5O1xuXHRcdFx0dGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0dmFsdWVzKCk6IEl0ZXJhYmxlSXRlcmF0b3I8Vj4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fdmFsdWVzKTtcblx0XHR9XG5cblx0XHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuZW50cmllcygpO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnTWFwJyA9ICdNYXAnO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gTWFwLnRzIiwiaW1wb3J0IHsgVGhlbmFibGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBxdWV1ZU1pY3JvVGFzayB9IGZyb20gJy4vc3VwcG9ydC9xdWV1ZSc7XG5pbXBvcnQgeyBJdGVyYWJsZSB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0ICcuL1N5bWJvbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuXG4vKipcbiAqIEV4ZWN1dG9yIGlzIHRoZSBpbnRlcmZhY2UgZm9yIGZ1bmN0aW9ucyB1c2VkIHRvIGluaXRpYWxpemUgYSBQcm9taXNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWN1dG9yPFQ+IHtcblx0LyoqXG5cdCAqIFRoZSBleGVjdXRvciBmb3IgdGhlIHByb21pc2Vcblx0ICpcblx0ICogQHBhcmFtIHJlc29sdmUgVGhlIHJlc29sdmVyIGNhbGxiYWNrIG9mIHRoZSBwcm9taXNlXG5cdCAqIEBwYXJhbSByZWplY3QgVGhlIHJlamVjdG9yIGNhbGxiYWNrIG9mIHRoZSBwcm9taXNlXG5cdCAqL1xuXHQocmVzb2x2ZTogKHZhbHVlPzogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgbGV0IFNoaW1Qcm9taXNlOiB0eXBlb2YgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5leHBvcnQgY29uc3QgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGU8VD4odmFsdWU6IGFueSk6IHZhbHVlIGlzIFByb21pc2VMaWtlPFQ+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufTtcblxuaWYgKCFoYXMoJ2VzNi1wcm9taXNlJykpIHtcblx0Y29uc3QgZW51bSBTdGF0ZSB7XG5cdFx0RnVsZmlsbGVkLFxuXHRcdFBlbmRpbmcsXG5cdFx0UmVqZWN0ZWRcblx0fVxuXG5cdGdsb2JhbC5Qcm9taXNlID0gU2hpbVByb21pc2UgPSBjbGFzcyBQcm9taXNlPFQ+IGltcGxlbWVudHMgVGhlbmFibGU8VD4ge1xuXHRcdHN0YXRpYyBhbGwoaXRlcmFibGU6IEl0ZXJhYmxlPGFueSB8IFByb21pc2VMaWtlPGFueT4+IHwgKGFueSB8IFByb21pc2VMaWtlPGFueT4pW10pOiBQcm9taXNlPGFueT4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG5cdFx0XHRcdGxldCBjb21wbGV0ZSA9IDA7XG5cdFx0XHRcdGxldCB0b3RhbCA9IDA7XG5cdFx0XHRcdGxldCBwb3B1bGF0aW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmdWxmaWxsKGluZGV4OiBudW1iZXIsIHZhbHVlOiBhbnkpOiB2b2lkIHtcblx0XHRcdFx0XHR2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0Kytjb21wbGV0ZTtcblx0XHRcdFx0XHRmaW5pc2goKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbmlzaCgpOiB2b2lkIHtcblx0XHRcdFx0XHRpZiAocG9wdWxhdGluZyB8fCBjb21wbGV0ZSA8IHRvdGFsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUodmFsdWVzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIHByb2Nlc3NJdGVtKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSk6IHZvaWQge1xuXHRcdFx0XHRcdCsrdG90YWw7XG5cdFx0XHRcdFx0aWYgKGlzVGhlbmFibGUoaXRlbSkpIHtcblx0XHRcdFx0XHRcdC8vIElmIGFuIGl0ZW0gUHJvbWlzZSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxuXHRcdFx0XHRcdFx0Ly8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cblx0XHRcdFx0XHRcdGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRwcm9jZXNzSXRlbShpLCB2YWx1ZSk7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBvcHVsYXRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRmaW5pc2goKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByYWNlPFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUIHwgUHJvbWlzZUxpa2U8VD4+IHwgKFQgfCBQcm9taXNlTGlrZTxUPilbXSk6IFByb21pc2U8VFtdPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZTogKHZhbHVlPzogYW55KSA9PiB2b2lkLCByZWplY3QpIHtcblx0XHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRcdFx0XHQvLyBJZiBhIFByb21pc2UgaXRlbSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxuXHRcdFx0XHRcdFx0Ly8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cblx0XHRcdFx0XHRcdGl0ZW0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihyZXNvbHZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByZWplY3QocmVhc29uPzogYW55KTogUHJvbWlzZTxuZXZlcj4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRyZWplY3QocmVhc29uKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyByZXNvbHZlKCk6IFByb21pc2U8dm9pZD47XG5cdFx0c3RhdGljIHJlc29sdmU8VD4odmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IFByb21pc2U8VD47XG5cdFx0c3RhdGljIHJlc29sdmU8VD4odmFsdWU/OiBhbnkpOiBQcm9taXNlPFQ+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlKSB7XG5cdFx0XHRcdHJlc29sdmUoPFQ+dmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIFtTeW1ib2wuc3BlY2llc106IFByb21pc2VDb25zdHJ1Y3RvciA9IFNoaW1Qcm9taXNlIGFzIFByb21pc2VDb25zdHJ1Y3RvcjtcblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYSBuZXcgUHJvbWlzZS5cblx0XHQgKlxuXHRcdCAqIEBjb25zdHJ1Y3RvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIGV4ZWN1dG9yXG5cdFx0ICogVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBpbW1lZGlhdGVseSB3aGVuIHRoZSBQcm9taXNlIGlzIGluc3RhbnRpYXRlZC4gSXQgaXMgcmVzcG9uc2libGUgZm9yXG5cdFx0ICogc3RhcnRpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hlbiBpdCBpcyBpbnZva2VkLlxuXHRcdCAqXG5cdFx0ICogVGhlIGV4ZWN1dG9yIG11c3QgY2FsbCBlaXRoZXIgdGhlIHBhc3NlZCBgcmVzb2x2ZWAgZnVuY3Rpb24gd2hlbiB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkXG5cdFx0ICogc3VjY2Vzc2Z1bGx5LCBvciB0aGUgYHJlamVjdGAgZnVuY3Rpb24gd2hlbiB0aGUgb3BlcmF0aW9uIGZhaWxzLlxuXHRcdCAqL1xuXHRcdGNvbnN0cnVjdG9yKGV4ZWN1dG9yOiBFeGVjdXRvcjxUPikge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBJZiB0cnVlLCB0aGUgcmVzb2x1dGlvbiBvZiB0aGlzIHByb21pc2UgaXMgY2hhaW5lZCAoXCJsb2NrZWQgaW5cIikgdG8gYW5vdGhlciBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRsZXQgaXNDaGFpbmVkID0gZmFsc2U7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogV2hldGhlciBvciBub3QgdGhpcyBwcm9taXNlIGlzIGluIGEgcmVzb2x2ZWQgc3RhdGUuXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IGlzUmVzb2x2ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnN0YXRlICE9PSBTdGF0ZS5QZW5kaW5nIHx8IGlzQ2hhaW5lZDtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ2FsbGJhY2tzIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgb25jZSB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkLlxuXHRcdFx0ICovXG5cdFx0XHRsZXQgY2FsbGJhY2tzOiBudWxsIHwgKEFycmF5PCgpID0+IHZvaWQ+KSA9IFtdO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIEluaXRpYWxseSBwdXNoZXMgY2FsbGJhY2tzIG9udG8gYSBxdWV1ZSBmb3IgZXhlY3V0aW9uIG9uY2UgdGhpcyBwcm9taXNlIHNldHRsZXMuIEFmdGVyIHRoZSBwcm9taXNlIHNldHRsZXMsXG5cdFx0XHQgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXG5cdFx0XHQgKi9cblx0XHRcdGxldCB3aGVuRmluaXNoZWQgPSBmdW5jdGlvbihjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuXHRcdFx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIFNldHRsZXMgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBzZXR0bGUgPSAobmV3U3RhdGU6IFN0YXRlLCB2YWx1ZTogYW55KTogdm9pZCA9PiB7XG5cdFx0XHRcdC8vIEEgcHJvbWlzZSBjYW4gb25seSBiZSBzZXR0bGVkIG9uY2UuXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlICE9PSBTdGF0ZS5QZW5kaW5nKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zdGF0ZSA9IG5ld1N0YXRlO1xuXHRcdFx0XHR0aGlzLnJlc29sdmVkVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0d2hlbkZpbmlzaGVkID0gcXVldWVNaWNyb1Rhc2s7XG5cblx0XHRcdFx0Ly8gT25seSBlbnF1ZXVlIGEgY2FsbGJhY2sgcnVubmVyIGlmIHRoZXJlIGFyZSBjYWxsYmFja3Mgc28gdGhhdCBpbml0aWFsbHkgZnVsZmlsbGVkIFByb21pc2VzIGRvbid0IGhhdmUgdG9cblx0XHRcdFx0Ly8gd2FpdCBhbiBleHRyYSB0dXJuLlxuXHRcdFx0XHRpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cXVldWVNaWNyb1Rhc2soZnVuY3Rpb24oKTogdm9pZCB7XG5cdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBjb3VudCA9IGNhbGxiYWNrcy5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrc1tpXS5jYWxsKG51bGwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrcyA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCByZXNvbHZlID0gKG5ld1N0YXRlOiBTdGF0ZSwgdmFsdWU6IGFueSk6IHZvaWQgPT4ge1xuXHRcdFx0XHRpZiAoaXNSZXNvbHZlZCgpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzVGhlbmFibGUodmFsdWUpKSB7XG5cdFx0XHRcdFx0dmFsdWUudGhlbihzZXR0bGUuYmluZChudWxsLCBTdGF0ZS5GdWxmaWxsZWQpLCBzZXR0bGUuYmluZChudWxsLCBTdGF0ZS5SZWplY3RlZCkpO1xuXHRcdFx0XHRcdGlzQ2hhaW5lZCA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2V0dGxlKG5ld1N0YXRlLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMudGhlbiA9IDxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuXHRcdFx0XHRvbkZ1bGZpbGxlZD86ICgodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KSB8IHVuZGVmaW5lZCB8IG51bGwsXG5cdFx0XHRcdG9uUmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0XHQpOiBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+ID0+IHtcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHQvLyB3aGVuRmluaXNoZWQgaW5pdGlhbGx5IHF1ZXVlcyB1cCBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBhZnRlciB0aGUgcHJvbWlzZSBoYXMgc2V0dGxlZC4gT25jZSB0aGVcblx0XHRcdFx0XHQvLyBwcm9taXNlIGhhcyBzZXR0bGVkLCB3aGVuRmluaXNoZWQgd2lsbCBzY2hlZHVsZSBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCB0dXJuIHRocm91Z2ggdGhlXG5cdFx0XHRcdFx0Ly8gZXZlbnQgbG9vcC5cblx0XHRcdFx0XHR3aGVuRmluaXNoZWQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2s6ICgodmFsdWU/OiBhbnkpID0+IGFueSkgfCB1bmRlZmluZWQgfCBudWxsID1cblx0XHRcdFx0XHRcdFx0dGhpcy5zdGF0ZSA9PT0gU3RhdGUuUmVqZWN0ZWQgPyBvblJlamVjdGVkIDogb25GdWxmaWxsZWQ7XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhbGxiYWNrKHRoaXMucmVzb2x2ZWRWYWx1ZSkpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZSA9PT0gU3RhdGUuUmVqZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KHRoaXMucmVzb2x2ZWRWYWx1ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHRoaXMucmVzb2x2ZWRWYWx1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZXhlY3V0b3IocmVzb2x2ZS5iaW5kKG51bGwsIFN0YXRlLkZ1bGZpbGxlZCksIHJlc29sdmUuYmluZChudWxsLCBTdGF0ZS5SZWplY3RlZCkpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0c2V0dGxlKFN0YXRlLlJlamVjdGVkLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihcblx0XHRcdG9uUmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0IHwgUHJvbWlzZUxpa2U8VFJlc3VsdD4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdCk6IFByb21pc2U8VCB8IFRSZXN1bHQ+IHtcblx0XHRcdHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIHByb21pc2UuXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBzdGF0ZSA9IFN0YXRlLlBlbmRpbmc7XG5cblx0XHQvKipcblx0XHQgKiBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIHtUfGFueX1cblx0XHQgKi9cblx0XHRwcml2YXRlIHJlc29sdmVkVmFsdWU6IGFueTtcblxuXHRcdHRoZW46IDxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuXHRcdFx0b25mdWxmaWxsZWQ/OiAoKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPikgfCB1bmRlZmluZWQgfCBudWxsLFxuXHRcdFx0b25yZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHQpID0+IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XG5cblx0XHRbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1Byb21pc2UnID0gJ1Byb21pc2UnO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaGltUHJvbWlzZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBQcm9taXNlLnRzIiwiaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgZ2V0VmFsdWVEZXNjcmlwdG9yIH0gZnJvbSAnLi9zdXBwb3J0L3V0aWwnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG5cdGludGVyZmFjZSBTeW1ib2xDb25zdHJ1Y3RvciB7XG5cdFx0b2JzZXJ2YWJsZTogc3ltYm9sO1xuXHR9XG59XG5cbmV4cG9ydCBsZXQgU3ltYm9sOiBTeW1ib2xDb25zdHJ1Y3RvciA9IGdsb2JhbC5TeW1ib2w7XG5cbmlmICghaGFzKCdlczYtc3ltYm9sJykpIHtcblx0LyoqXG5cdCAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXG5cdCAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCAqIEByZXR1cm4ge3N5bWJvbH0gICAgICAgUmV0dXJucyB0aGUgc3ltYm9sIG9yIHRocm93c1xuXHQgKi9cblx0Y29uc3QgdmFsaWRhdGVTeW1ib2wgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZTogYW55KTogc3ltYm9sIHtcblx0XHRpZiAoIWlzU3ltYm9sKHZhbHVlKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcih2YWx1ZSArICcgaXMgbm90IGEgc3ltYm9sJyk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblxuXHRjb25zdCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG5cdGNvbnN0IGRlZmluZVByb3BlcnR5OiAoXG5cdFx0bzogYW55LFxuXHRcdHA6IHN0cmluZyB8IHN5bWJvbCxcblx0XHRhdHRyaWJ1dGVzOiBQcm9wZXJ0eURlc2NyaXB0b3IgJiBUaGlzVHlwZTxhbnk+XG5cdCkgPT4gYW55ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5IGFzIGFueTtcblx0Y29uc3QgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuXHRjb25zdCBvYmpQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG5cdGNvbnN0IGdsb2JhbFN5bWJvbHM6IHsgW2tleTogc3RyaW5nXTogc3ltYm9sIH0gPSB7fTtcblxuXHRjb25zdCBnZXRTeW1ib2xOYW1lID0gKGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGRlc2M6IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XG5cdFx0XHRsZXQgcG9zdGZpeCA9IDA7XG5cdFx0XHRsZXQgbmFtZTogc3RyaW5nO1xuXHRcdFx0d2hpbGUgKGNyZWF0ZWRbU3RyaW5nKGRlc2MpICsgKHBvc3RmaXggfHwgJycpXSkge1xuXHRcdFx0XHQrK3Bvc3RmaXg7XG5cdFx0XHR9XG5cdFx0XHRkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcblx0XHRcdGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xuXHRcdFx0bmFtZSA9ICdAQCcgKyBkZXNjO1xuXG5cdFx0XHQvLyBGSVhNRTogVGVtcG9yYXJ5IGd1YXJkIHVudGlsIHRoZSBkdXBsaWNhdGUgZXhlY3V0aW9uIHdoZW4gdGVzdGluZyBjYW4gYmVcblx0XHRcdC8vIHBpbm5lZCBkb3duLlxuXHRcdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialByb3RvdHlwZSwgbmFtZSkpIHtcblx0XHRcdFx0ZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCB7XG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih0aGlzOiBTeW1ib2wsIHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0XHRcdGRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH07XG5cdH0pKCk7XG5cblx0Y29uc3QgSW50ZXJuYWxTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2wodGhpczogYW55LCBkZXNjcmlwdGlvbj86IHN0cmluZyB8IG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBJbnRlcm5hbFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0cmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XG5cdH07XG5cblx0U3ltYm9sID0gZ2xvYmFsLlN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCh0aGlzOiBTeW1ib2wsIGRlc2NyaXB0aW9uPzogc3RyaW5nIHwgbnVtYmVyKTogc3ltYm9sIHtcblx0XHRpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0XHR9XG5cdFx0Y29uc3Qgc3ltID0gT2JqZWN0LmNyZWF0ZShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUpO1xuXHRcdGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcblx0XHRyZXR1cm4gZGVmaW5lUHJvcGVydGllcyhzeW0sIHtcblx0XHRcdF9fZGVzY3JpcHRpb25fXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcblx0XHRcdF9fbmFtZV9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZShkZXNjcmlwdGlvbikpXG5cdFx0fSk7XG5cdH0gYXMgU3ltYm9sQ29uc3RydWN0b3I7XG5cblx0LyogRGVjb3JhdGUgdGhlIFN5bWJvbCBmdW5jdGlvbiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBwcm9wZXJ0aWVzICovXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdFN5bWJvbCxcblx0XHQnZm9yJyxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24oa2V5OiBzdHJpbmcpOiBzeW1ib2wge1xuXHRcdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkge1xuXHRcdFx0XHRyZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcblx0XHR9KVxuXHQpO1xuXHRkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbCwge1xuXHRcdGtleUZvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHN5bTogc3ltYm9sKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0XHRcdGxldCBrZXk6IHN0cmluZztcblx0XHRcdHZhbGlkYXRlU3ltYm9sKHN5bSk7XG5cdFx0XHRmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzKSB7XG5cdFx0XHRcdGlmIChnbG9iYWxTeW1ib2xzW2tleV0gPT09IHN5bSkge1xuXHRcdFx0XHRcdHJldHVybiBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KSxcblx0XHRoYXNJbnN0YW5jZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2hhc0luc3RhbmNlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXNDb25jYXRTcHJlYWRhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0aXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpdGVyYXRvcicpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdG1hdGNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignbWF0Y2gnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRvYnNlcnZhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignb2JzZXJ2YWJsZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHJlcGxhY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdyZXBsYWNlJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c2VhcmNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c3BlY2llczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwZWNpZXMnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRzcGxpdDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwbGl0JyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dG9QcmltaXRpdmU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvU3RyaW5nVGFnOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9TdHJpbmdUYWcnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR1bnNjb3BhYmxlczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3Vuc2NvcGFibGVzJyksIGZhbHNlLCBmYWxzZSlcblx0fSk7XG5cblx0LyogRGVjb3JhdGUgdGhlIEludGVybmFsU3ltYm9sIG9iamVjdCAqL1xuXHRkZWZpbmVQcm9wZXJ0aWVzKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwge1xuXHRcdGNvbnN0cnVjdG9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sKSxcblx0XHR0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKFxuXHRcdFx0ZnVuY3Rpb24odGhpczogeyBfX25hbWVfXzogc3RyaW5nIH0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX19uYW1lX187XG5cdFx0XHR9LFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRmYWxzZVxuXHRcdClcblx0fSk7XG5cblx0LyogRGVjb3JhdGUgdGhlIFN5bWJvbC5wcm90b3R5cGUgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhTeW1ib2wucHJvdG90eXBlLCB7XG5cdFx0dG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiAnU3ltYm9sICgnICsgKDxhbnk+dmFsaWRhdGVTeW1ib2wodGhpcykpLl9fZGVzY3JpcHRpb25fXyArICcpJztcblx0XHR9KSxcblx0XHR2YWx1ZU9mOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdFx0fSlcblx0fSk7XG5cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0U3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpO1xuXHRcdH0pXG5cdCk7XG5cdGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcblxuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsXG5cdFx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcigoPGFueT5TeW1ib2wpLnByb3RvdHlwZVtTeW1ib2wudG9QcmltaXRpdmVdLCBmYWxzZSwgZmFsc2UsIHRydWUpXG5cdCk7XG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdEludGVybmFsU3ltYm9sLnByb3RvdHlwZSxcblx0XHRTeW1ib2wudG9TdHJpbmdUYWcsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKCg8YW55PlN5bWJvbCkucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10sIGZhbHNlLCBmYWxzZSwgdHJ1ZSlcblx0KTtcbn1cblxuLyoqXG4gKiBBIGN1c3RvbSBndWFyZCBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgaWYgYW4gb2JqZWN0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHBhcmFtICB7YW55fSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2sgdG8gc2VlIGlmIGl0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzeW1ib2wge1xuXHRyZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogRmlsbCBhbnkgbWlzc2luZyB3ZWxsIGtub3duIHN5bWJvbHMgaWYgdGhlIG5hdGl2ZSBTeW1ib2wgaXMgbWlzc2luZyB0aGVtXG4gKi9cbltcblx0J2hhc0luc3RhbmNlJyxcblx0J2lzQ29uY2F0U3ByZWFkYWJsZScsXG5cdCdpdGVyYXRvcicsXG5cdCdzcGVjaWVzJyxcblx0J3JlcGxhY2UnLFxuXHQnc2VhcmNoJyxcblx0J3NwbGl0Jyxcblx0J21hdGNoJyxcblx0J3RvUHJpbWl0aXZlJyxcblx0J3RvU3RyaW5nVGFnJyxcblx0J3Vuc2NvcGFibGVzJyxcblx0J29ic2VydmFibGUnXG5dLmZvckVhY2goKHdlbGxLbm93bikgPT4ge1xuXHRpZiAoIShTeW1ib2wgYXMgYW55KVt3ZWxsS25vd25dKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbCwgd2VsbEtub3duLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcih3ZWxsS25vd24pLCBmYWxzZSwgZmFsc2UpKTtcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBTeW1ib2wudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlLCBJdGVyYWJsZSB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdlYWtNYXA8SyBleHRlbmRzIG9iamVjdCwgVj4ge1xuXHQvKipcblx0ICogUmVtb3ZlIGEgYGtleWAgZnJvbSB0aGUgbWFwXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byByZW1vdmVcblx0ICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIHZhbHVlIHdhcyByZW1vdmVkLCBvdGhlcndpc2UgYGZhbHNlYFxuXHQgKi9cblx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSB2YWx1ZSwgYmFzZWQgb24gdGhlIHN1cHBsaWVkIGBrZXlgXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byByZXRyaWV2ZSB0aGUgYHZhbHVlYCBmb3Jcblx0ICogQHJldHVybiB0aGUgYHZhbHVlYCBiYXNlZCBvbiB0aGUgYGtleWAgaWYgZm91bmQsIG90aGVyd2lzZSBgZmFsc2VgXG5cdCAqL1xuXHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyBpZiBhIGBrZXlgIGlzIHByZXNlbnQgaW4gdGhlIG1hcFxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBga2V5YCB0byBjaGVja1xuXHQgKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUga2V5IGlzIHBhcnQgb2YgdGhlIG1hcCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG5cdCAqL1xuXHRoYXMoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU2V0IGEgYHZhbHVlYCBmb3IgYSBwYXJ0aWN1bGFyIGBrZXlgLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBga2V5YCB0byBzZXQgdGhlIGB2YWx1ZWAgZm9yXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgYHZhbHVlYCB0byBzZXRcblx0ICogQHJldHVybiB0aGUgaW5zdGFuY2VzXG5cdCAqL1xuXHRzZXQoa2V5OiBLLCB2YWx1ZTogVik6IHRoaXM7XG5cblx0cmVhZG9ubHkgW1N5bWJvbC50b1N0cmluZ1RhZ106ICdXZWFrTWFwJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXZWFrTWFwQ29uc3RydWN0b3Ige1xuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0bmV3ICgpOiBXZWFrTWFwPG9iamVjdCwgYW55PjtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmFibGUgQW4gaXRlcmFibGUgdGhhdCBjb250YWlucyB5aWVsZHMgdXAga2V5L3ZhbHVlIHBhaXIgZW50cmllc1xuXHQgKi9cblx0bmV3IDxLIGV4dGVuZHMgb2JqZWN0LCBWPihpdGVyYWJsZT86IFtLLCBWXVtdKTogV2Vha01hcDxLLCBWPjtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYFdlYWtNYXBgXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmFibGUgQW4gaXRlcmFibGUgdGhhdCBjb250YWlucyB5aWVsZHMgdXAga2V5L3ZhbHVlIHBhaXIgZW50cmllc1xuXHQgKi9cblx0bmV3IDxLIGV4dGVuZHMgb2JqZWN0LCBWPihpdGVyYWJsZTogSXRlcmFibGU8W0ssIFZdPik6IFdlYWtNYXA8SywgVj47XG5cblx0cmVhZG9ubHkgcHJvdG90eXBlOiBXZWFrTWFwPG9iamVjdCwgYW55Pjtcbn1cblxuZXhwb3J0IGxldCBXZWFrTWFwOiBXZWFrTWFwQ29uc3RydWN0b3IgPSBnbG9iYWwuV2Vha01hcDtcblxuaW50ZXJmYWNlIEVudHJ5PEssIFY+IHtcblx0a2V5OiBLO1xuXHR2YWx1ZTogVjtcbn1cblxuaWYgKCFoYXMoJ2VzNi13ZWFrbWFwJykpIHtcblx0Y29uc3QgREVMRVRFRDogYW55ID0ge307XG5cblx0Y29uc3QgZ2V0VUlEID0gZnVuY3Rpb24gZ2V0VUlEKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XG5cdH07XG5cblx0Y29uc3QgZ2VuZXJhdGVOYW1lID0gKGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzdGFydElkID0gTWF0aC5mbG9vcihEYXRlLm5vdygpICUgMTAwMDAwMDAwKTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoKTogc3RyaW5nIHtcblx0XHRcdHJldHVybiAnX193bScgKyBnZXRVSUQoKSArIChzdGFydElkKysgKyAnX18nKTtcblx0XHR9O1xuXHR9KSgpO1xuXG5cdFdlYWtNYXAgPSBjbGFzcyBXZWFrTWFwPEssIFY+IHtcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9uYW1lOiBzdHJpbmc7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBfZnJvemVuRW50cmllczogRW50cnk8SywgVj5bXTtcblxuXHRcdGNvbnN0cnVjdG9yKGl0ZXJhYmxlPzogQXJyYXlMaWtlPFtLLCBWXT4gfCBJdGVyYWJsZTxbSywgVl0+KSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19uYW1lJywge1xuXHRcdFx0XHR2YWx1ZTogZ2VuZXJhdGVOYW1lKClcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XG5cblx0XHRcdGlmIChpdGVyYWJsZSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbSA9IGl0ZXJhYmxlW2ldO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQoaXRlbVswXSwgaXRlbVsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldChrZXksIHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIF9nZXRGcm96ZW5FbnRyeUluZGV4KGtleTogYW55KTogbnVtYmVyIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZnJvemVuRW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGhpcy5fZnJvemVuRW50cmllc1tpXS5rZXkgPT09IGtleSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRkZWxldGUoa2V5OiBhbnkpOiBib29sZWFuIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpIHtcblx0XHRcdFx0ZW50cnkudmFsdWUgPSBERUxFVEVEO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHR0aGlzLl9mcm96ZW5FbnRyaWVzLnNwbGljZShmcm96ZW5JbmRleCwgMSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Z2V0KGtleTogYW55KTogViB8IHVuZGVmaW5lZCB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xuXHRcdFx0XHRyZXR1cm4gZW50cnkudmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xuXHRcdFx0aWYgKGZyb3plbkluZGV4ID49IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2Zyb3plbkVudHJpZXNbZnJvemVuSW5kZXhdLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhcyhrZXk6IGFueSk6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmIChCb29sZWFuKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG5cdFx0XHRpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHNldChrZXk6IGFueSwgdmFsdWU/OiBhbnkpOiB0aGlzIHtcblx0XHRcdGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIHVzZWQgYXMgd2VhayBtYXAga2V5Jyk7XG5cdFx0XHR9XG5cdFx0XHRsZXQgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKCFlbnRyeSB8fCBlbnRyeS5rZXkgIT09IGtleSkge1xuXHRcdFx0XHRlbnRyeSA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuXHRcdFx0XHRcdGtleTogeyB2YWx1ZToga2V5IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKE9iamVjdC5pc0Zyb3plbihrZXkpKSB7XG5cdFx0XHRcdFx0dGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoa2V5LCB0aGlzLl9uYW1lLCB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogZW50cnlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZW50cnkudmFsdWUgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFtTeW1ib2wudG9TdHJpbmdUYWddOiAnV2Vha01hcCcgPSAnV2Vha01hcCc7XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdlYWtNYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gV2Vha01hcC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UsIGlzSXRlcmFibGUsIEl0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgeyBNQVhfU0FGRV9JTlRFR0VSIH0gZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFwQ2FsbGJhY2s8VCwgVT4ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIG1hcHBpbmdcblx0ICpcblx0ICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgbWFwcGVkXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgZWxlbWVudFxuXHQgKi9cblx0KGVsZW1lbnQ6IFQsIGluZGV4OiBudW1iZXIpOiBVO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbmRDYWxsYmFjazxUPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdXNpbmcgZmluZFxuXHQgKlxuXHQgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IGlzIGN1cnJlbnR5IGJlaW5nIGFuYWx5c2VkXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGFuYWx5c2VkXG5cdCAqIEBwYXJhbSBhcnJheSBUaGUgc291cmNlIGFycmF5XG5cdCAqL1xuXHQoZWxlbWVudDogVCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IEFycmF5TGlrZTxUPik6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBXcml0YWJsZUFycmF5TGlrZTxUPiB7XG5cdHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyO1xuXHRbbjogbnVtYmVyXTogVDtcbn1cblxuLyogRVM2IEFycmF5IHN0YXRpYyBtZXRob2RzICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRnJvbSB7XG5cdC8qKlxuXHQgKiBUaGUgQXJyYXkuZnJvbSgpIG1ldGhvZCBjcmVhdGVzIGEgbmV3IEFycmF5IGluc3RhbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBzb3VyY2UgQW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheVxuXHQgKiBAcGFyYW0gbWFwRnVuY3Rpb24gQSBtYXAgZnVuY3Rpb24gdG8gY2FsbCBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIGFycmF5XG5cdCAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIG1hcCBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIFRoZSBuZXcgQXJyYXlcblx0ICovXG5cdDxULCBVPihzb3VyY2U6IEFycmF5TGlrZTxUPiB8IEl0ZXJhYmxlPFQ+LCBtYXBGdW5jdGlvbjogTWFwQ2FsbGJhY2s8VCwgVT4sIHRoaXNBcmc/OiBhbnkpOiBBcnJheTxVPjtcblxuXHQvKipcblx0ICogVGhlIEFycmF5LmZyb20oKSBtZXRob2QgY3JlYXRlcyBhIG5ldyBBcnJheSBpbnN0YW5jZSBmcm9tIGFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIEFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYW4gYXJyYXlcblx0ICogQHJldHVybiBUaGUgbmV3IEFycmF5XG5cdCAqL1xuXHQ8VD4oc291cmNlOiBBcnJheUxpa2U8VD4gfCBJdGVyYWJsZTxUPik6IEFycmF5PFQ+O1xufVxuXG5leHBvcnQgbGV0IGZyb206IEZyb207XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBhcnJheSBmcm9tIHRoZSBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSBhcmd1bWVudHMgQW55IG51bWJlciBvZiBhcmd1bWVudHMgZm9yIHRoZSBhcnJheVxuICogQHJldHVybiBBbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHNcbiAqL1xuZXhwb3J0IGxldCBvZjogPFQ+KC4uLml0ZW1zOiBUW10pID0+IEFycmF5PFQ+O1xuXG4vKiBFUzYgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIENvcGllcyBkYXRhIGludGVybmFsbHkgd2l0aGluIGFuIGFycmF5IG9yIGFycmF5LWxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIG9mZnNldCBUaGUgaW5kZXggdG8gc3RhcnQgY29weWluZyB2YWx1ZXMgdG87IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IChpbmNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcGFyYW0gZW5kIFRoZSBsYXN0IChleGNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXG4gKiBAcmV0dXJuIFRoZSB0YXJnZXRcbiAqL1xuZXhwb3J0IGxldCBjb3B5V2l0aGluOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIG9mZnNldDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IEFycmF5TGlrZTxUPjtcblxuLyoqXG4gKiBGaWxscyBlbGVtZW50cyBvZiBhbiBhcnJheS1saWtlIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHRvIGZpbGxcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBlYWNoIGVsZW1lbnQgb2YgdGhlIHRhcmdldCB3aXRoXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IGluZGV4IHRvIGZpbGxcbiAqIEBwYXJhbSBlbmQgVGhlIChleGNsdXNpdmUpIGluZGV4IGF0IHdoaWNoIHRvIHN0b3AgZmlsbGluZ1xuICogQHJldHVybiBUaGUgZmlsbGVkIHRhcmdldFxuICovXG5leHBvcnQgbGV0IGZpbGw6IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgdmFsdWU6IFQsIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IEFycmF5TGlrZTxUPjtcblxuLyoqXG4gKiBGaW5kcyBhbmQgcmV0dXJucyB0aGUgZmlyc3QgaW5zdGFuY2UgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrIG9yIHVuZGVmaW5lZCBpZiBvbmUgaXMgbm90IGZvdW5kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyBpZiB0aGUgY3VycmVudCB2YWx1ZSBtYXRjaGVzIGEgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrLCBvciB1bmRlZmluZWQgaWYgb25lIGRvZXMgbm90IGV4aXN0XG4gKi9cbmV4cG9ydCBsZXQgZmluZDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pID0+IFQgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgc2VhcmNoIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbmRleCB3aG9zZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHBhc3NlZCBjYWxsYmFjayxcbiAqIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyB0cnVlIGlmIHRoZSBjdXJyZW50IHZhbHVlIHNhdGlzZmllcyBpdHMgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLCBvciAtMSBpZiBubyB2YWx1ZXMgc2F0aXNmeSBpdFxuICovXG5leHBvcnQgbGV0IGZpbmRJbmRleDogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pID0+IG51bWJlcjtcblxuLyogRVM3IEFycmF5IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gYXJyYXkgaW5jbHVkZXMgYSBnaXZlbiB2YWx1ZVxuICpcbiAqIEBwYXJhbSB0YXJnZXQgdGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtIHNlYXJjaEVsZW1lbnQgdGhlIGl0ZW0gdG8gc2VhcmNoIGZvclxuICogQHBhcmFtIGZyb21JbmRleCB0aGUgc3RhcnRpbmcgaW5kZXggdG8gc2VhcmNoIGZyb21cbiAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBhcnJheSBpbmNsdWRlcyB0aGUgZWxlbWVudCwgb3RoZXJ3aXNlIGBmYWxzZWBcbiAqL1xuZXhwb3J0IGxldCBpbmNsdWRlczogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBzZWFyY2hFbGVtZW50OiBULCBmcm9tSW5kZXg/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbmlmIChoYXMoJ2VzNi1hcnJheScpICYmIGhhcygnZXM2LWFycmF5LWZpbGwnKSkge1xuXHRmcm9tID0gZ2xvYmFsLkFycmF5LmZyb207XG5cdG9mID0gZ2xvYmFsLkFycmF5Lm9mO1xuXHRjb3B5V2l0aGluID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xuXHRmaWxsID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbGwpO1xuXHRmaW5kID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbmQpO1xuXHRmaW5kSW5kZXggPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcbn0gZWxzZSB7XG5cdC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXG5cdC8vIFRvIG1ha2UgdGhpbmdzIGVhc2llciwgaWYgdGhlcmUgaXMgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiwgdGhlIHdob2xlIHNldCBvZiBmdW5jdGlvbnMgd2lsbCBiZSBmaWxsZWRcblxuXHQvKipcblx0ICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxuXHQgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxuXHQgKi9cblx0Y29uc3QgdG9MZW5ndGggPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG5cdFx0aWYgKGlzTmFOKGxlbmd0aCkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuXHRcdGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG5cdFx0XHRsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XG5cdFx0fVxuXHRcdC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXG5cdFx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBGcm9tIEVTNiA3LjEuNCBUb0ludGVnZXIoKVxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgQSB2YWx1ZSB0byBjb252ZXJ0XG5cdCAqIEByZXR1cm4gQW4gaW50ZWdlclxuXHQgKi9cblx0Y29uc3QgdG9JbnRlZ2VyID0gZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlOiBhbnkpOiBudW1iZXIge1xuXHRcdHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblx0XHRpZiAoaXNOYU4odmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKHZhbHVlID09PSAwIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHZhbHVlID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIG9yaWdpbmFsIG9mZnNldFxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3Rcblx0ICogQHJldHVybiBJZiBuZWdhdGl2ZSwgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gdGhlIGVuZCAobGVuZ3RoKTsgb3RoZXJ3aXNlIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIDBcblx0ICovXG5cdGNvbnN0IG5vcm1hbGl6ZU9mZnNldCA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG5cdFx0cmV0dXJuIHZhbHVlIDwgMCA/IE1hdGgubWF4KGxlbmd0aCArIHZhbHVlLCAwKSA6IE1hdGgubWluKHZhbHVlLCBsZW5ndGgpO1xuXHR9O1xuXG5cdGZyb20gPSBmdW5jdGlvbiBmcm9tKFxuXHRcdHRoaXM6IEFycmF5Q29uc3RydWN0b3IsXG5cdFx0YXJyYXlMaWtlOiBJdGVyYWJsZTxhbnk+IHwgQXJyYXlMaWtlPGFueT4sXG5cdFx0bWFwRnVuY3Rpb24/OiBNYXBDYWxsYmFjazxhbnksIGFueT4sXG5cdFx0dGhpc0FyZz86IGFueVxuXHQpOiBBcnJheTxhbnk+IHtcblx0XHRpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2Zyb206IHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1hcEZ1bmN0aW9uICYmIHRoaXNBcmcpIHtcblx0XHRcdG1hcEZ1bmN0aW9uID0gbWFwRnVuY3Rpb24uYmluZCh0aGlzQXJnKTtcblx0XHR9XG5cblx0XHQvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xuXHRcdGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcblx0XHRjb25zdCBsZW5ndGg6IG51bWJlciA9IHRvTGVuZ3RoKCg8YW55PmFycmF5TGlrZSkubGVuZ3RoKTtcblxuXHRcdC8vIFN1cHBvcnQgZXh0ZW5zaW9uXG5cdFx0Y29uc3QgYXJyYXk6IGFueVtdID1cblx0XHRcdHR5cGVvZiBDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IDxhbnlbXT5PYmplY3QobmV3IENvbnN0cnVjdG9yKGxlbmd0aCkpIDogbmV3IEFycmF5KGxlbmd0aCk7XG5cblx0XHRpZiAoIWlzQXJyYXlMaWtlKGFycmF5TGlrZSkgJiYgIWlzSXRlcmFibGUoYXJyYXlMaWtlKSkge1xuXHRcdFx0cmV0dXJuIGFycmF5O1xuXHRcdH1cblxuXHRcdC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgYW5kIHRoZSBub3JtYWxpemVkIGxlbmd0aCBpcyAwLCBqdXN0IHJldHVybiBhbiBlbXB0eSBhcnJheS4gdGhpcyBwcmV2ZW50cyBhIHByb2JsZW1cblx0XHQvLyB3aXRoIHRoZSBpdGVyYXRpb24gb24gSUUgd2hlbiB1c2luZyBhIE5hTiBhcnJheSBsZW5ndGguXG5cdFx0aWYgKGlzQXJyYXlMaWtlKGFycmF5TGlrZSkpIHtcblx0XHRcdGlmIChsZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5TGlrZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGkgPSAwO1xuXHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiBhcnJheUxpa2UpIHtcblx0XHRcdFx0YXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKHZhbHVlLCBpKSA6IHZhbHVlO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCg8YW55PmFycmF5TGlrZSkubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGFycmF5Lmxlbmd0aCA9IGxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyYXk7XG5cdH07XG5cblx0b2YgPSBmdW5jdGlvbiBvZjxUPiguLi5pdGVtczogVFtdKTogQXJyYXk8VD4ge1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcyk7XG5cdH07XG5cblx0Y29weVdpdGhpbiA9IGZ1bmN0aW9uIGNvcHlXaXRoaW48VD4oXG5cdFx0dGFyZ2V0OiBBcnJheUxpa2U8VD4sXG5cdFx0b2Zmc2V0OiBudW1iZXIsXG5cdFx0c3RhcnQ6IG51bWJlcixcblx0XHRlbmQ/OiBudW1iZXJcblx0KTogQXJyYXlMaWtlPFQ+IHtcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvcHlXaXRoaW46IHRhcmdldCBtdXN0IGJlIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cdFx0b2Zmc2V0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihvZmZzZXQpLCBsZW5ndGgpO1xuXHRcdHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XG5cdFx0ZW5kID0gbm9ybWFsaXplT2Zmc2V0KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCksIGxlbmd0aCk7XG5cdFx0bGV0IGNvdW50ID0gTWF0aC5taW4oZW5kIC0gc3RhcnQsIGxlbmd0aCAtIG9mZnNldCk7XG5cblx0XHRsZXQgZGlyZWN0aW9uID0gMTtcblx0XHRpZiAob2Zmc2V0ID4gc3RhcnQgJiYgb2Zmc2V0IDwgc3RhcnQgKyBjb3VudCkge1xuXHRcdFx0ZGlyZWN0aW9uID0gLTE7XG5cdFx0XHRzdGFydCArPSBjb3VudCAtIDE7XG5cdFx0XHRvZmZzZXQgKz0gY291bnQgLSAxO1xuXHRcdH1cblxuXHRcdHdoaWxlIChjb3VudCA+IDApIHtcblx0XHRcdGlmIChzdGFydCBpbiB0YXJnZXQpIHtcblx0XHRcdFx0KHRhcmdldCBhcyBXcml0YWJsZUFycmF5TGlrZTxUPilbb2Zmc2V0XSA9IHRhcmdldFtzdGFydF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgKHRhcmdldCBhcyBXcml0YWJsZUFycmF5TGlrZTxUPilbb2Zmc2V0XTtcblx0XHRcdH1cblxuXHRcdFx0b2Zmc2V0ICs9IGRpcmVjdGlvbjtcblx0XHRcdHN0YXJ0ICs9IGRpcmVjdGlvbjtcblx0XHRcdGNvdW50LS07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuXHRmaWxsID0gZnVuY3Rpb24gZmlsbDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgdmFsdWU6IGFueSwgc3RhcnQ/OiBudW1iZXIsIGVuZD86IG51bWJlcik6IEFycmF5TGlrZTxUPiB7XG5cdFx0Y29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cdFx0bGV0IGkgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcblx0XHRlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcblxuXHRcdHdoaWxlIChpIDwgZW5kKSB7XG5cdFx0XHQodGFyZ2V0IGFzIFdyaXRhYmxlQXJyYXlMaWtlPFQ+KVtpKytdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuXHRmaW5kID0gZnVuY3Rpb24gZmluZDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgY2FsbGJhY2s6IEZpbmRDYWxsYmFjazxUPiwgdGhpc0FyZz86IHt9KTogVCB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgaW5kZXggPSBmaW5kSW5kZXg8VD4odGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XG5cdFx0cmV0dXJuIGluZGV4ICE9PSAtMSA/IHRhcmdldFtpbmRleF0gOiB1bmRlZmluZWQ7XG5cdH07XG5cblx0ZmluZEluZGV4ID0gZnVuY3Rpb24gZmluZEluZGV4PFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBjYWxsYmFjazogRmluZENhbGxiYWNrPFQ+LCB0aGlzQXJnPzoge30pOiBudW1iZXIge1xuXHRcdGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXG5cdFx0aWYgKCFjYWxsYmFjaykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZmluZDogc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzQXJnKSB7XG5cdFx0XHRjYWxsYmFjayA9IGNhbGxiYWNrLmJpbmQodGhpc0FyZyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGNhbGxiYWNrKHRhcmdldFtpXSwgaSwgdGFyZ2V0KSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH07XG59XG5cbmlmIChoYXMoJ2VzNy1hcnJheScpKSB7XG5cdGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKTtcbn0gZWxzZSB7XG5cdC8qKlxuXHQgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cblx0ICpcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG5cdCAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXG5cdCAqL1xuXHRjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcblx0XHRpZiAoaXNOYU4obGVuZ3RoKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG5cdFx0XHRsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XG5cdFx0fVxuXHRcdC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXG5cdFx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xuXHR9O1xuXG5cdGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXM8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHNlYXJjaEVsZW1lbnQ6IFQsIGZyb21JbmRleDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuXHRcdGxldCBsZW4gPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblxuXHRcdGZvciAobGV0IGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0Y29uc3QgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XG5cdFx0XHRcdChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudClcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYXJyYXkudHMiLCJjb25zdCBnbG9iYWxPYmplY3Q6IGFueSA9IChmdW5jdGlvbigpOiBhbnkge1xuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyBnbG9iYWwgc3BlYyBkZWZpbmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IGNhbGxlZCAnZ2xvYmFsJ1xuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxuXHRcdC8vIGBnbG9iYWxgIGlzIGFsc28gZGVmaW5lZCBpbiBOb2RlSlNcblx0XHRyZXR1cm4gZ2xvYmFsO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gd2luZG93IGlzIGRlZmluZWQgaW4gYnJvd3NlcnNcblx0XHRyZXR1cm4gd2luZG93O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdsb2JhbE9iamVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBnbG9iYWwudHMiLCJpbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCB7IEhJR0hfU1VSUk9HQVRFX01BWCwgSElHSF9TVVJST0dBVEVfTUlOIH0gZnJvbSAnLi9zdHJpbmcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yUmVzdWx0PFQ+IHtcblx0cmVhZG9ubHkgZG9uZTogYm9vbGVhbjtcblx0cmVhZG9ubHkgdmFsdWU6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3I8VD4ge1xuXHRuZXh0KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG5cblx0cmV0dXJuPyh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG5cdHRocm93PyhlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmFibGU8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZUl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFQ+O1xufVxuXG5jb25zdCBzdGF0aWNEb25lOiBJdGVyYXRvclJlc3VsdDxhbnk+ID0geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG5cbi8qKlxuICogQSBjbGFzcyB0aGF0IF9zaGltc18gYW4gaXRlcmF0b3IgaW50ZXJmYWNlIG9uIGFycmF5IGxpa2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoaW1JdGVyYXRvcjxUPiB7XG5cdHByaXZhdGUgX2xpc3Q6IEFycmF5TGlrZTxUPjtcblx0cHJpdmF0ZSBfbmV4dEluZGV4ID0gLTE7XG5cdHByaXZhdGUgX25hdGl2ZUl0ZXJhdG9yOiBJdGVyYXRvcjxUPjtcblxuXHRjb25zdHJ1Y3RvcihsaXN0OiBBcnJheUxpa2U8VD4gfCBJdGVyYWJsZTxUPikge1xuXHRcdGlmIChpc0l0ZXJhYmxlKGxpc3QpKSB7XG5cdFx0XHR0aGlzLl9uYXRpdmVJdGVyYXRvciA9IGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9saXN0ID0gbGlzdDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIHRoZSBuZXh0IGl0ZXJhdGlvbiByZXN1bHQgZm9yIHRoZSBJdGVyYXRvclxuXHQgKi9cblx0bmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG5cdFx0aWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbmF0aXZlSXRlcmF0b3IubmV4dCgpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuX2xpc3QpIHtcblx0XHRcdHJldHVybiBzdGF0aWNEb25lO1xuXHRcdH1cblx0XHRpZiAoKyt0aGlzLl9uZXh0SW5kZXggPCB0aGlzLl9saXN0Lmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZG9uZTogZmFsc2UsXG5cdFx0XHRcdHZhbHVlOiB0aGlzLl9saXN0W3RoaXMuX25leHRJbmRleF1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBzdGF0aWNEb25lO1xuXHR9XG5cblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxUPiB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBoYXMgYW4gSXRlcmFibGUgaW50ZXJmYWNlXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIEl0ZXJhYmxlPGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaXMgQXJyYXlMaWtlXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBBcnJheUxpa2U8YW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBmb3IgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBpdGVyYWJsZSBvYmplY3QgdG8gcmV0dXJuIHRoZSBpdGVyYXRvciBmb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldDxUPihpdGVyYWJsZTogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4pOiBJdGVyYXRvcjxUPiB8IHVuZGVmaW5lZCB7XG5cdGlmIChpc0l0ZXJhYmxlKGl0ZXJhYmxlKSkge1xuXHRcdHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cdH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG5cdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IoaXRlcmFibGUpO1xuXHR9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9yT2ZDYWxsYmFjazxUPiB7XG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBhIGZvck9mKCkgaXRlcmF0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgY3VycmVudCB2YWx1ZVxuXHQgKiBAcGFyYW0gb2JqZWN0IFRoZSBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3ZlclxuXHQgKiBAcGFyYW0gZG9CcmVhayBBIGZ1bmN0aW9uLCBpZiBjYWxsZWQsIHdpbGwgc3RvcCB0aGUgaXRlcmF0aW9uXG5cdCAqL1xuXHQodmFsdWU6IFQsIG9iamVjdDogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4gfCBzdHJpbmcsIGRvQnJlYWs6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIG9iamVjdCB0aGUgcHJvdmlkZXMgYW4gaW50ZXJhdG9yIGludGVyZmFjZVxuICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIG9mIHRoZSBpdGVyYWJsZVxuICogQHBhcmFtIHRoaXNBcmcgT3B0aW9uYWwgc2NvcGUgdG8gcGFzcyB0aGUgY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvck9mPFQ+KFxuXHRpdGVyYWJsZTogSXRlcmFibGU8VD4gfCBBcnJheUxpa2U8VD4gfCBzdHJpbmcsXG5cdGNhbGxiYWNrOiBGb3JPZkNhbGxiYWNrPFQ+LFxuXHR0aGlzQXJnPzogYW55XG4pOiB2b2lkIHtcblx0bGV0IGJyb2tlbiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIGRvQnJlYWsoKSB7XG5cdFx0YnJva2VuID0gdHJ1ZTtcblx0fVxuXG5cdC8qIFdlIG5lZWQgdG8gaGFuZGxlIGl0ZXJhdGlvbiBvZiBkb3VibGUgYnl0ZSBzdHJpbmdzIHByb3Blcmx5ICovXG5cdGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xuXHRcdGNvbnN0IGwgPSBpdGVyYWJsZS5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcblx0XHRcdGxldCBjaGFyID0gaXRlcmFibGVbaV07XG5cdFx0XHRpZiAoaSArIDEgPCBsKSB7XG5cdFx0XHRcdGNvbnN0IGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG5cdFx0XHRcdGlmIChjb2RlID49IEhJR0hfU1VSUk9HQVRFX01JTiAmJiBjb2RlIDw9IEhJR0hfU1VSUk9HQVRFX01BWCkge1xuXHRcdFx0XHRcdGNoYXIgKz0gaXRlcmFibGVbKytpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XG5cdFx0XHRpZiAoYnJva2VuKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xuXHRcdGlmIChpdGVyYXRvcikge1xuXHRcdFx0bGV0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcblxuXHRcdFx0d2hpbGUgKCFyZXN1bHQuZG9uZSkge1xuXHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xuXHRcdFx0XHRpZiAoYnJva2VuKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBpdGVyYXRvci50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuXG4vKipcbiAqIFRoZSBzbWFsbGVzdCBpbnRlcnZhbCBiZXR3ZWVuIHR3byByZXByZXNlbnRhYmxlIG51bWJlcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUFNJTE9OID0gMTtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9TQUZFX0lOVEVHRVIgPSAtTUFYX1NBRkVfSU5URUdFUjtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBOYU4gd2l0aG91dCBjb2Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgTmFOLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFOKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsLmlzTmFOKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXIgd2l0aG91dCBjb2Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgZmluaXRlLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNGaW5pdGUodmFsdWUpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuXHRyZXR1cm4gaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXG4gKiAgIDIuIGl0IGhhcyBhIG9uZS10by1vbmUgbWFwcGluZyB0byBhIG1hdGhlbWF0aWNhbCBpbnRlZ2VyLCBtZWFuaW5nIGl0c1xuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZTogYW55KTogdmFsdWUgaXMgbnVtYmVyIHtcblx0cmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgTWF0aC5hYnModmFsdWUpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbnVtYmVyLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xuaW1wb3J0IHsgaXNTeW1ib2wgfSBmcm9tICcuL1N5bWJvbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0QXNzaWduIHtcblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVPih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuXG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKiBAcGFyYW0gc291cmNlMiBUaGUgc2Vjb25kIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVSwgVj4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuXG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2UxIFRoZSBmaXJzdCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKiBAcGFyYW0gc291cmNlMiBUaGUgc2Vjb25kIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqIEBwYXJhbSBzb3VyY2UzIFRoZSB0aGlyZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFUsIFYsIFc+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVyk6IFQgJiBVICYgViAmIFc7XG5cblx0LyoqXG5cdCAqIENvcHkgdGhlIHZhbHVlcyBvZiBhbGwgb2YgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byBhXG5cdCAqIHRhcmdldCBvYmplY3QuIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gY29weSB0by5cblx0ICogQHBhcmFtIHNvdXJjZXMgT25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXNcblx0ICovXG5cdCh0YXJnZXQ6IG9iamVjdCwgLi4uc291cmNlczogYW55W10pOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0RW50ZXJpZXMge1xuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXkvdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0PFQgZXh0ZW5kcyB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCk6IFtrZXlvZiBULCBUW0tdXVtdO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleS92YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQobzogb2JqZWN0KTogW3N0cmluZywgYW55XVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcnMge1xuXHQ8VD4obzogVCk6IHsgW0sgaW4ga2V5b2YgVF06IFByb3BlcnR5RGVzY3JpcHRvciB9O1xuXHQobzogYW55KTogeyBba2V5OiBzdHJpbmddOiBQcm9wZXJ0eURlc2NyaXB0b3IgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RWYWx1ZXMge1xuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiB2YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQ8VD4obzogeyBbczogc3RyaW5nXTogVCB9KTogVFtdO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdChvOiBvYmplY3QpOiBhbnlbXTtcbn1cblxuZXhwb3J0IGxldCBhc3NpZ246IE9iamVjdEFzc2lnbjtcblxuLyoqXG4gKiBHZXRzIHRoZSBvd24gcHJvcGVydHkgZGVzY3JpcHRvciBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdC5cbiAqIEFuIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIGlzIG9uZSB0aGF0IGlzIGRlZmluZWQgZGlyZWN0bHkgb24gdGhlIG9iamVjdCBhbmQgaXMgbm90XG4gKiBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnR5LlxuICogQHBhcmFtIHAgTmFtZSBvZiB0aGUgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiA8VCwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQsIHByb3BlcnR5S2V5OiBLKSA9PiBQcm9wZXJ0eURlc2NyaXB0b3IgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC4gVGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBhcmUgdGhvc2UgdGhhdCBhcmUgZGVmaW5lZCBkaXJlY3RseVxuICogb24gdGhhdCBvYmplY3QsIGFuZCBhcmUgbm90IGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuIFRoZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBpbmNsdWRlIGJvdGggZmllbGRzIChvYmplY3RzKSBhbmQgZnVuY3Rpb25zLlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIG93biBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5TmFtZXM6IChvOiBhbnkpID0+IHN0cmluZ1tdO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHN5bWJvbCBwcm9wZXJ0aWVzIGZvdW5kIGRpcmVjdGx5IG9uIG9iamVjdCBvLlxuICogQHBhcmFtIG8gT2JqZWN0IHRvIHJldHJpZXZlIHRoZSBzeW1ib2xzIGZyb20uXG4gKi9cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAobzogYW55KSA9PiBzeW1ib2xbXTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEBwYXJhbSB2YWx1ZTEgVGhlIGZpcnN0IHZhbHVlLlxuICogQHBhcmFtIHZhbHVlMiBUaGUgc2Vjb25kIHZhbHVlLlxuICovXG5leHBvcnQgbGV0IGlzOiAodmFsdWUxOiBhbnksIHZhbHVlMjogYW55KSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb2YgYW4gb2JqZWN0LlxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG4gKi9cbmV4cG9ydCBsZXQga2V5czogKG86IG9iamVjdCkgPT4gc3RyaW5nW107XG5cbi8qIEVTNyBPYmplY3Qgc3RhdGljIG1ldGhvZHMgKi9cblxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuXG5leHBvcnQgbGV0IGVudHJpZXM6IE9iamVjdEVudGVyaWVzO1xuXG5leHBvcnQgbGV0IHZhbHVlczogT2JqZWN0VmFsdWVzO1xuXG5pZiAoaGFzKCdlczYtb2JqZWN0JykpIHtcblx0Y29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcblx0YXNzaWduID0gZ2xvYmFsT2JqZWN0LmFzc2lnbjtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblx0Z2V0T3duUHJvcGVydHlOYW1lcyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuXHRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXHRpcyA9IGdsb2JhbE9iamVjdC5pcztcblx0a2V5cyA9IGdsb2JhbE9iamVjdC5rZXlzO1xufSBlbHNlIHtcblx0a2V5cyA9IGZ1bmN0aW9uIHN5bWJvbEF3YXJlS2V5cyhvOiBvYmplY3QpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcblx0fTtcblxuXHRhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKSB7XG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHQvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRvID0gT2JqZWN0KHRhcmdldCk7XG5cdFx0c291cmNlcy5mb3JFYWNoKChuZXh0U291cmNlKSA9PiB7XG5cdFx0XHRpZiAobmV4dFNvdXJjZSkge1xuXHRcdFx0XHQvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdFx0a2V5cyhuZXh0U291cmNlKS5mb3JFYWNoKChuZXh0S2V5KSA9PiB7XG5cdFx0XHRcdFx0dG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0bztcblx0fTtcblxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG5cdFx0bzogYW55LFxuXHRcdHByb3A6IHN0cmluZyB8IHN5bWJvbFxuXHQpOiBQcm9wZXJ0eURlc2NyaXB0b3IgfCB1bmRlZmluZWQge1xuXHRcdGlmIChpc1N5bWJvbChwcm9wKSkge1xuXHRcdFx0cmV0dXJuICg8YW55Pk9iamVjdCkuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcblx0XHR9XG5cdH07XG5cblx0Z2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobzogYW55KTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoKGtleSkgPT4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSk7XG5cdH07XG5cblx0Z2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG86IGFueSk6IHN5bWJvbFtdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobylcblx0XHRcdC5maWx0ZXIoKGtleSkgPT4gQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKVxuXHRcdFx0Lm1hcCgoa2V5KSA9PiBTeW1ib2wuZm9yKGtleS5zdWJzdHJpbmcoMikpKTtcblx0fTtcblxuXHRpcyA9IGZ1bmN0aW9uIGlzKHZhbHVlMTogYW55LCB2YWx1ZTI6IGFueSk6IGJvb2xlYW4ge1xuXHRcdGlmICh2YWx1ZTEgPT09IHZhbHVlMikge1xuXHRcdFx0cmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxuXHR9O1xufVxuXG5pZiAoaGFzKCdlczIwMTctb2JqZWN0JykpIHtcblx0Y29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuXHRlbnRyaWVzID0gZ2xvYmFsT2JqZWN0LmVudHJpZXM7XG5cdHZhbHVlcyA9IGdsb2JhbE9iamVjdC52YWx1ZXM7XG59IGVsc2Uge1xuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvOiBhbnkpIHtcblx0XHRyZXR1cm4gZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoXG5cdFx0XHQocHJldmlvdXMsIGtleSkgPT4ge1xuXHRcdFx0XHRwcmV2aW91c1trZXldID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIGtleSkhO1xuXHRcdFx0XHRyZXR1cm4gcHJldmlvdXM7XG5cdFx0XHR9LFxuXHRcdFx0e30gYXMgeyBba2V5OiBzdHJpbmddOiBQcm9wZXJ0eURlc2NyaXB0b3IgfVxuXHRcdCk7XG5cdH07XG5cblx0ZW50cmllcyA9IGZ1bmN0aW9uIGVudHJpZXMobzogYW55KTogW3N0cmluZywgYW55XVtdIHtcblx0XHRyZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gW2tleSwgb1trZXldXSBhcyBbc3RyaW5nLCBhbnldKTtcblx0fTtcblxuXHR2YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobzogYW55KTogYW55W10ge1xuXHRcdHJldHVybiBrZXlzKG8pLm1hcCgoa2V5KSA9PiBvW2tleV0pO1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIG9iamVjdC50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nTm9ybWFsaXplIHtcblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cblx0ICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuXHQgKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcblx0ICogaXMgXCJORkNcIlxuXHQgKi9cblx0KHRhcmdldDogc3RyaW5nLCBmb3JtOiAnTkZDJyB8ICdORkQnIHwgJ05GS0MnIHwgJ05GS0QnKTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXG5cdCAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcblx0ICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XG5cdCAqIGlzIFwiTkZDXCJcblx0ICovXG5cdCh0YXJnZXQ6IHN0cmluZywgZm9ybT86IHN0cmluZyk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01JTiA9IDB4ZDgwMDtcblxuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcblxuLyoqXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NSU4gPSAweGRjMDA7XG5cbi8qKlxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IExPV19TVVJST0dBVEVfTUFYID0gMHhkZmZmO1xuXG4vKiBFUzYgc3RhdGljIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBSZXR1cm4gdGhlIFN0cmluZyB2YWx1ZSB3aG9zZSBlbGVtZW50cyBhcmUsIGluIG9yZGVyLCB0aGUgZWxlbWVudHMgaW4gdGhlIExpc3QgZWxlbWVudHMuXG4gKiBJZiBsZW5ndGggaXMgMCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqIEBwYXJhbSBjb2RlUG9pbnRzIFRoZSBjb2RlIHBvaW50cyB0byBnZW5lcmF0ZSB0aGUgc3RyaW5nXG4gKi9cbmV4cG9ydCBsZXQgZnJvbUNvZGVQb2ludDogKC4uLmNvZGVQb2ludHM6IG51bWJlcltdKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogYHJhd2AgaXMgaW50ZW5kZWQgZm9yIHVzZSBhcyBhIHRhZyBmdW5jdGlvbiBvZiBhIFRhZ2dlZCBUZW1wbGF0ZSBTdHJpbmcuIFdoZW4gY2FsbGVkXG4gKiBhcyBzdWNoIHRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGJlIGEgd2VsbCBmb3JtZWQgdGVtcGxhdGUgY2FsbCBzaXRlIG9iamVjdCBhbmQgdGhlIHJlc3RcbiAqIHBhcmFtZXRlciB3aWxsIGNvbnRhaW4gdGhlIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gKiBAcGFyYW0gdGVtcGxhdGUgQSB3ZWxsLWZvcm1lZCB0ZW1wbGF0ZSBzdHJpbmcgY2FsbCBzaXRlIHJlcHJlc2VudGF0aW9uLlxuICogQHBhcmFtIHN1YnN0aXR1dGlvbnMgQSBzZXQgb2Ygc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGxldCByYXc6ICh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnN1YnN0aXR1dGlvbnM6IGFueVtdKSA9PiBzdHJpbmc7XG5cbi8qIEVTNiBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogUmV0dXJucyBhIG5vbm5lZ2F0aXZlIGludGVnZXIgTnVtYmVyIGxlc3MgdGhhbiAxMTE0MTEyICgweDExMDAwMCkgdGhhdCBpcyB0aGUgY29kZSBwb2ludFxuICogdmFsdWUgb2YgdGhlIFVURi0xNiBlbmNvZGVkIGNvZGUgcG9pbnQgc3RhcnRpbmcgYXQgdGhlIHN0cmluZyBlbGVtZW50IGF0IHBvc2l0aW9uIHBvcyBpblxuICogdGhlIFN0cmluZyByZXN1bHRpbmcgZnJvbSBjb252ZXJ0aW5nIHRoaXMgb2JqZWN0IHRvIGEgU3RyaW5nLlxuICogSWYgdGhlcmUgaXMgbm8gZWxlbWVudCBhdCB0aGF0IHBvc2l0aW9uLCB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZC5cbiAqIElmIGEgdmFsaWQgVVRGLTE2IHN1cnJvZ2F0ZSBwYWlyIGRvZXMgbm90IGJlZ2luIGF0IHBvcywgdGhlIHJlc3VsdCBpcyB0aGUgY29kZSB1bml0IGF0IHBvcy5cbiAqL1xuZXhwb3J0IGxldCBjb2RlUG9pbnRBdDogKHRhcmdldDogc3RyaW5nLCBwb3M/OiBudW1iZXIpID0+IG51bWJlciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNlcXVlbmNlIG9mIGVsZW1lbnRzIG9mIHNlYXJjaFN0cmluZyBjb252ZXJ0ZWQgdG8gYSBTdHJpbmcgaXMgdGhlXG4gKiBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIG9mIHRoaXMgb2JqZWN0IChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpIHN0YXJ0aW5nIGF0XG4gKiBlbmRQb3NpdGlvbiDigJMgbGVuZ3RoKHRoaXMpLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBlbmRzV2l0aDogKHRhcmdldDogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgZW5kUG9zaXRpb24/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHNlYXJjaFN0cmluZyBhcHBlYXJzIGFzIGEgc3Vic3RyaW5nIG9mIHRoZSByZXN1bHQgb2YgY29udmVydGluZyB0aGlzXG4gKiBvYmplY3QgdG8gYSBTdHJpbmcsIGF0IG9uZSBvciBtb3JlIHBvc2l0aW9ucyB0aGF0IGFyZVxuICogZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHBvc2l0aW9uOyBvdGhlcndpc2UsIHJldHVybnMgZmFsc2UuXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gc2VhcmNoU3RyaW5nIHNlYXJjaCBzdHJpbmdcbiAqIEBwYXJhbSBwb3NpdGlvbiBJZiBwb3NpdGlvbiBpcyB1bmRlZmluZWQsIDAgaXMgYXNzdW1lZCwgc28gYXMgdG8gc2VhcmNoIGFsbCBvZiB0aGUgU3RyaW5nLlxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzOiAodGFyZ2V0OiBzdHJpbmcsIHNlYXJjaFN0cmluZzogc3RyaW5nLCBwb3NpdGlvbj86IG51bWJlcikgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXG4gKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XG4gKiBpcyBcIk5GQ1wiXG4gKi9cbmV4cG9ydCBsZXQgbm9ybWFsaXplOiBTdHJpbmdOb3JtYWxpemU7XG5cbi8qKlxuICogUmV0dXJucyBhIFN0cmluZyB2YWx1ZSB0aGF0IGlzIG1hZGUgZnJvbSBjb3VudCBjb3BpZXMgYXBwZW5kZWQgdG9nZXRoZXIuIElmIGNvdW50IGlzIDAsXG4gKiBUIGlzIHRoZSBlbXB0eSBTdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0gY291bnQgbnVtYmVyIG9mIGNvcGllcyB0byBhcHBlbmRcbiAqL1xuZXhwb3J0IGxldCByZXBlYXQ6ICh0YXJnZXQ6IHN0cmluZywgY291bnQ/OiBudW1iZXIpID0+IHN0cmluZztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNlcXVlbmNlIG9mIGVsZW1lbnRzIG9mIHNlYXJjaFN0cmluZyBjb252ZXJ0ZWQgdG8gYSBTdHJpbmcgaXMgdGhlXG4gKiBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIG9mIHRoaXMgb2JqZWN0IChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpIHN0YXJ0aW5nIGF0XG4gKiBwb3NpdGlvbi4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gKi9cbmV4cG9ydCBsZXQgc3RhcnRzV2l0aDogKHRhcmdldDogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbi8qIEVTNyBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogUGFkcyB0aGUgY3VycmVudCBzdHJpbmcgd2l0aCBhIGdpdmVuIHN0cmluZyAocG9zc2libHkgcmVwZWF0ZWQpIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBzdHJpbmcgcmVhY2hlcyBhIGdpdmVuIGxlbmd0aC5cbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgZW5kIChyaWdodCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXG4gKlxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cbiAqL1xuZXhwb3J0IGxldCBwYWRFbmQ6ICh0YXJnZXQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGZpbGxTdHJpbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuLyoqXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxuICogVGhlIHBhZGRpbmcgaXMgYXBwbGllZCBmcm9tIHRoZSBzdGFydCAobGVmdCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXG4gKlxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cbiAqL1xuZXhwb3J0IGxldCBwYWRTdGFydDogKHRhcmdldDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG5pZiAoaGFzKCdlczYtc3RyaW5nJykgJiYgaGFzKCdlczYtc3RyaW5nLXJhdycpKSB7XG5cdGZyb21Db2RlUG9pbnQgPSBnbG9iYWwuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cdHJhdyA9IGdsb2JhbC5TdHJpbmcucmF3O1xuXG5cdGNvZGVQb2ludEF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdCk7XG5cdGVuZHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCk7XG5cdGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyk7XG5cdG5vcm1hbGl6ZSA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKTtcblx0cmVwZWF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpO1xuXHRzdGFydHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKTtcbn0gZWxzZSB7XG5cdC8qKlxuXHQgKiBWYWxpZGF0ZXMgdGhhdCB0ZXh0IGlzIGRlZmluZWQsIGFuZCBub3JtYWxpemVzIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgZ2l2ZW4gZGVmYXVsdCBpZiB0aGUgaW5wdXQgaXMgTmFOKS5cblx0ICogVXNlZCBieSBzdGFydHNXaXRoLCBpbmNsdWRlcywgYW5kIGVuZHNXaXRoLlxuXHQgKlxuXHQgKiBAcmV0dXJuIE5vcm1hbGl6ZWQgcG9zaXRpb24uXG5cdCAqL1xuXHRjb25zdCBub3JtYWxpemVTdWJzdHJpbmdBcmdzID0gZnVuY3Rpb24oXG5cdFx0bmFtZTogc3RyaW5nLFxuXHRcdHRleHQ6IHN0cmluZyxcblx0XHRzZWFyY2g6IHN0cmluZyxcblx0XHRwb3NpdGlvbjogbnVtYmVyLFxuXHRcdGlzRW5kOiBib29sZWFuID0gZmFsc2Vcblx0KTogW3N0cmluZywgc3RyaW5nLCBudW1iZXJdIHtcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuJyArIG5hbWUgKyAnIHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nIHRvIHNlYXJjaCBhZ2FpbnN0LicpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24gIT09IHBvc2l0aW9uID8gKGlzRW5kID8gbGVuZ3RoIDogMCkgOiBwb3NpdGlvbjtcblx0XHRyZXR1cm4gW3RleHQsIFN0cmluZyhzZWFyY2gpLCBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbiwgMCksIGxlbmd0aCldO1xuXHR9O1xuXG5cdGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHM6IG51bWJlcltdKTogc3RyaW5nIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLmZyb21Db2RlUG9pbnRcblx0XHRjb25zdCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdGlmICghbGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcblx0XHRjb25zdCBNQVhfU0laRSA9IDB4NDAwMDtcblx0XHRsZXQgY29kZVVuaXRzOiBudW1iZXJbXSA9IFtdO1xuXHRcdGxldCBpbmRleCA9IC0xO1xuXHRcdGxldCByZXN1bHQgPSAnJztcblxuXHRcdHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdFx0XHRsZXQgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuXG5cdFx0XHQvLyBDb2RlIHBvaW50cyBtdXN0IGJlIGZpbml0ZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHZhbGlkIHJhbmdlXG5cdFx0XHRsZXQgaXNWYWxpZCA9XG5cdFx0XHRcdGlzRmluaXRlKGNvZGVQb2ludCkgJiYgTWF0aC5mbG9vcihjb2RlUG9pbnQpID09PSBjb2RlUG9pbnQgJiYgY29kZVBvaW50ID49IDAgJiYgY29kZVBvaW50IDw9IDB4MTBmZmZmO1xuXHRcdFx0aWYgKCFpc1ZhbGlkKSB7XG5cdFx0XHRcdHRocm93IFJhbmdlRXJyb3IoJ3N0cmluZy5mcm9tQ29kZVBvaW50OiBJbnZhbGlkIGNvZGUgcG9pbnQgJyArIGNvZGVQb2ludCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2RlUG9pbnQgPD0gMHhmZmZmKSB7XG5cdFx0XHRcdC8vIEJNUCBjb2RlIHBvaW50XG5cdFx0XHRcdGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuXHRcdFx0XHQvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdFx0Y29kZVBvaW50IC09IDB4MTAwMDA7XG5cdFx0XHRcdGxldCBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBISUdIX1NVUlJPR0FURV9NSU47XG5cdFx0XHRcdGxldCBsb3dTdXJyb2dhdGUgPSBjb2RlUG9pbnQgJSAweDQwMCArIExPV19TVVJST0dBVEVfTUlOO1xuXHRcdFx0XHRjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW5kZXggKyAxID09PSBsZW5ndGggfHwgY29kZVVuaXRzLmxlbmd0aCA+IE1BWF9TSVpFKSB7XG5cdFx0XHRcdHJlc3VsdCArPSBmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcblx0XHRcdFx0Y29kZVVuaXRzLmxlbmd0aCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0cmF3ID0gZnVuY3Rpb24gcmF3KGNhbGxTaXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uc3Vic3RpdHV0aW9uczogYW55W10pOiBzdHJpbmcge1xuXHRcdGxldCByYXdTdHJpbmdzID0gY2FsbFNpdGUucmF3O1xuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHRsZXQgbnVtU3Vic3RpdHV0aW9ucyA9IHN1YnN0aXR1dGlvbnMubGVuZ3RoO1xuXG5cdFx0aWYgKGNhbGxTaXRlID09IG51bGwgfHwgY2FsbFNpdGUucmF3ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yYXcgcmVxdWlyZXMgYSB2YWxpZCBjYWxsU2l0ZSBvYmplY3Qgd2l0aCBhIHJhdyB2YWx1ZScpO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSByYXdTdHJpbmdzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRyZXN1bHQgKz0gcmF3U3RyaW5nc1tpXSArIChpIDwgbnVtU3Vic3RpdHV0aW9ucyAmJiBpIDwgbGVuZ3RoIC0gMSA/IHN1YnN0aXR1dGlvbnNbaV0gOiAnJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRjb2RlUG9pbnRBdCA9IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHRleHQ6IHN0cmluZywgcG9zaXRpb246IG51bWJlciA9IDApOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLmNvZGVQb2ludEF0IHJlcXVyaWVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblx0XHRjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwb3NpdGlvbiAhPT0gcG9zaXRpb24pIHtcblx0XHRcdHBvc2l0aW9uID0gMDtcblx0XHR9XG5cdFx0aWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBsZW5ndGgpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBjb2RlIHVuaXRcblx0XHRjb25zdCBmaXJzdCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbik7XG5cdFx0aWYgKGZpcnN0ID49IEhJR0hfU1VSUk9HQVRFX01JTiAmJiBmaXJzdCA8PSBISUdIX1NVUlJPR0FURV9NQVggJiYgbGVuZ3RoID4gcG9zaXRpb24gKyAxKSB7XG5cdFx0XHQvLyBTdGFydCBvZiBhIHN1cnJvZ2F0ZSBwYWlyIChoaWdoIHN1cnJvZ2F0ZSBhbmQgdGhlcmUgaXMgYSBuZXh0IGNvZGUgdW5pdCk7IGNoZWNrIGZvciBsb3cgc3Vycm9nYXRlXG5cdFx0XHQvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdGNvbnN0IHNlY29uZCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbiArIDEpO1xuXHRcdFx0aWYgKHNlY29uZCA+PSBMT1dfU1VSUk9HQVRFX01JTiAmJiBzZWNvbmQgPD0gTE9XX1NVUlJPR0FURV9NQVgpIHtcblx0XHRcdFx0cmV0dXJuIChmaXJzdCAtIEhJR0hfU1VSUk9HQVRFX01JTikgKiAweDQwMCArIHNlY29uZCAtIExPV19TVVJST0dBVEVfTUlOICsgMHgxMDAwMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZpcnN0O1xuXHR9O1xuXG5cdGVuZHNXaXRoID0gZnVuY3Rpb24gZW5kc1dpdGgodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgZW5kUG9zaXRpb24/OiBudW1iZXIpOiBib29sZWFuIHtcblx0XHRpZiAoZW5kUG9zaXRpb24gPT0gbnVsbCkge1xuXHRcdFx0ZW5kUG9zaXRpb24gPSB0ZXh0Lmxlbmd0aDtcblx0XHR9XG5cblx0XHRbdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdlbmRzV2l0aCcsIHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24sIHRydWUpO1xuXG5cdFx0Y29uc3Qgc3RhcnQgPSBlbmRQb3NpdGlvbiAtIHNlYXJjaC5sZW5ndGg7XG5cdFx0aWYgKHN0YXJ0IDwgMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0ZXh0LnNsaWNlKHN0YXJ0LCBlbmRQb3NpdGlvbikgPT09IHNlYXJjaDtcblx0fTtcblxuXHRpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRleHQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0W3RleHQsIHNlYXJjaCwgcG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnaW5jbHVkZXMnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcblx0XHRyZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcblx0fTtcblxuXHRyZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodGV4dDogc3RyaW5nLCBjb3VudDogbnVtYmVyID0gMCk6IHN0cmluZyB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUucmVwZWF0XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cdFx0aWYgKGNvdW50ICE9PSBjb3VudCkge1xuXHRcdFx0Y291bnQgPSAwO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPCAwIHx8IGNvdW50ID09PSBJbmZpbml0eSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHR3aGlsZSAoY291bnQpIHtcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcblx0XHRcdFx0cmVzdWx0ICs9IHRleHQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY291bnQgPiAxKSB7XG5cdFx0XHRcdHRleHQgKz0gdGV4dDtcblx0XHRcdH1cblx0XHRcdGNvdW50ID4+PSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHN0YXJ0c1dpdGggPSBmdW5jdGlvbiBzdGFydHNXaXRoKHRleHQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG5cdFx0c2VhcmNoID0gU3RyaW5nKHNlYXJjaCk7XG5cdFx0W3RleHQsIHNlYXJjaCwgcG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnc3RhcnRzV2l0aCcsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuXG5cdFx0Y29uc3QgZW5kID0gcG9zaXRpb24gKyBzZWFyY2gubGVuZ3RoO1xuXHRcdGlmIChlbmQgPiB0ZXh0Lmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0ZXh0LnNsaWNlKHBvc2l0aW9uLCBlbmQpID09PSBzZWFyY2g7XG5cdH07XG59XG5cbmlmIChoYXMoJ2VzMjAxNy1zdHJpbmcnKSkge1xuXHRwYWRFbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZEVuZCk7XG5cdHBhZFN0YXJ0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydCk7XG59IGVsc2Uge1xuXHRwYWRFbmQgPSBmdW5jdGlvbiBwYWRFbmQodGV4dDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZzogc3RyaW5nID0gJyAnKTogc3RyaW5nIHtcblx0XHRpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcblx0XHRcdG1heExlbmd0aCA9IDA7XG5cdFx0fVxuXG5cdFx0bGV0IHN0clRleHQgPSBTdHJpbmcodGV4dCk7XG5cdFx0Y29uc3QgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBhZGRpbmcgPiAwKSB7XG5cdFx0XHRzdHJUZXh0ICs9XG5cdFx0XHRcdHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcblx0XHRcdFx0ZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHJUZXh0O1xuXHR9O1xuXG5cdHBhZFN0YXJ0ID0gZnVuY3Rpb24gcGFkU3RhcnQodGV4dDogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlciwgZmlsbFN0cmluZzogc3RyaW5nID0gJyAnKTogc3RyaW5nIHtcblx0XHRpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkU3RhcnQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuXHRcdFx0bWF4TGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcblx0XHRjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocGFkZGluZyA+IDApIHtcblx0XHRcdHN0clRleHQgPVxuXHRcdFx0XHRyZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXG5cdFx0XHRcdGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKSArXG5cdFx0XHRcdHN0clRleHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0clRleHQ7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3RyaW5nLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL2hhcyc7XG5pbXBvcnQgeyBIYW5kbGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbTogUXVldWVJdGVtIHwgdW5kZWZpbmVkKTogdm9pZCB7XG5cdGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xuXHRcdGl0ZW0uY2FsbGJhY2soKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRRdWV1ZUhhbmRsZShpdGVtOiBRdWV1ZUl0ZW0sIGRlc3RydWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdHJldHVybiB7XG5cdFx0ZGVzdHJveTogZnVuY3Rpb24odGhpczogSGFuZGxlKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHt9O1xuXHRcdFx0aXRlbS5pc0FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0aXRlbS5jYWxsYmFjayA9IG51bGw7XG5cblx0XHRcdGlmIChkZXN0cnVjdG9yKSB7XG5cdFx0XHRcdGRlc3RydWN0b3IoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmludGVyZmFjZSBQb3N0TWVzc2FnZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuXHRzb3VyY2U6IGFueTtcblx0ZGF0YTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlSXRlbSB7XG5cdGlzQWN0aXZlOiBib29sZWFuO1xuXHRjYWxsYmFjazogbnVsbCB8ICgoLi4uYXJnczogYW55W10pID0+IGFueSk7XG59XG5cbmxldCBjaGVja01pY3JvVGFza1F1ZXVlOiAoKSA9PiB2b2lkO1xubGV0IG1pY3JvVGFza3M6IFF1ZXVlSXRlbVtdO1xuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXVlVGFzayA9IChmdW5jdGlvbigpIHtcblx0bGV0IGRlc3RydWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuXHRsZXQgZW5xdWV1ZTogKGl0ZW06IFF1ZXVlSXRlbSkgPT4gdm9pZDtcblxuXHQvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXG5cdGlmIChoYXMoJ3Bvc3RtZXNzYWdlJykpIHtcblx0XHRjb25zdCBxdWV1ZTogUXVldWVJdGVtW10gPSBbXTtcblxuXHRcdGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZXZlbnQ6IFBvc3RNZXNzYWdlRXZlbnQpOiB2b2lkIHtcblx0XHRcdC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cblx0XHRcdGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRpZiAocXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXhlY3V0ZVRhc2socXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdHF1ZXVlLnB1c2goaXRlbSk7XG5cdFx0XHRnbG9iYWwucG9zdE1lc3NhZ2UoJ2Rvam8tcXVldWUtbWVzc2FnZScsICcqJyk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ3NldGltbWVkaWF0ZScpKSB7XG5cdFx0ZGVzdHJ1Y3RvciA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogYW55IHtcblx0XHRcdHJldHVybiBzZXRJbW1lZGlhdGUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFyVGltZW91dDtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogYW55IHtcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSksIDApO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBxdWV1ZVRhc2soY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cdFx0Y29uc3QgaWQ6IGFueSA9IGVucXVldWUoaXRlbSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoXG5cdFx0XHRpdGVtLFxuXHRcdFx0ZGVzdHJ1Y3RvciAmJlxuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkZXN0cnVjdG9yKGlkKTtcblx0XHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cblx0cmV0dXJuIGhhcygnbWljcm90YXNrcycpXG5cdFx0PyBxdWV1ZVRhc2tcblx0XHQ6IGZ1bmN0aW9uKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0XHRcdGNoZWNrTWljcm9UYXNrUXVldWUoKTtcblx0XHRcdFx0cmV0dXJuIHF1ZXVlVGFzayhjYWxsYmFjayk7XG5cdFx0XHR9O1xufSkoKTtcblxuLy8gV2hlbiBubyBtZWNoYW5pc20gZm9yIHJlZ2lzdGVyaW5nIG1pY3JvdGFza3MgaXMgZXhwb3NlZCBieSB0aGUgZW52aXJvbm1lbnQsIG1pY3JvdGFza3Mgd2lsbFxuLy8gYmUgcXVldWVkIGFuZCB0aGVuIGV4ZWN1dGVkIGluIGEgc2luZ2xlIG1hY3JvdGFzayBiZWZvcmUgdGhlIG90aGVyIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkLlxuaWYgKCFoYXMoJ21pY3JvdGFza3MnKSkge1xuXHRsZXQgaXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcblxuXHRtaWNyb1Rhc2tzID0gW107XG5cdGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcblx0XHRpZiAoIWlzTWljcm9UYXNrUXVldWVkKSB7XG5cdFx0XHRpc01pY3JvVGFza1F1ZXVlZCA9IHRydWU7XG5cdFx0XHRxdWV1ZVRhc2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlzTWljcm9UYXNrUXVldWVkID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKG1pY3JvVGFza3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bGV0IGl0ZW06IFF1ZXVlSXRlbSB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XG5cdFx0XHRcdFx0XHRleGVjdXRlVGFzayhpdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgYW4gYW5pbWF0aW9uIHRhc2sgd2l0aCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgaXQgZXhpc3RzLCBvciB3aXRoIGBxdWV1ZVRhc2tgIG90aGVyd2lzZS5cbiAqXG4gKiBTaW5jZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUncyBiZWhhdmlvciBkb2VzIG5vdCBtYXRjaCB0aGF0IGV4cGVjdGVkIGZyb20gYHF1ZXVlVGFza2AsIGl0IGlzIG5vdCB1c2VkIHRoZXJlLlxuICogSG93ZXZlciwgYXQgdGltZXMgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byBkZWxlZ2F0ZSB0byByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGhlbmNlIHRoZSBmb2xsb3dpbmcgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBxdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICghaGFzKCdyYWYnKSkge1xuXHRcdHJldHVybiBxdWV1ZVRhc2s7XG5cdH1cblxuXHRmdW5jdGlvbiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cdFx0Y29uc3QgcmFmSWQ6IG51bWJlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBmdW5jdGlvbigpIHtcblx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuXHRyZXR1cm4gaGFzKCdtaWNyb3Rhc2tzJylcblx0XHQ/IHF1ZXVlQW5pbWF0aW9uVGFza1xuXHRcdDogZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKTtcblx0XHRcdH07XG59KSgpO1xuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKlxuICogQW55IGNhbGxiYWNrcyByZWdpc3RlcmVkIHdpdGggYHF1ZXVlTWljcm9UYXNrYCB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgbmV4dCBtYWNyb3Rhc2suIElmIG5vIG5hdGl2ZVxuICogbWVjaGFuaXNtIGZvciBzY2hlZHVsaW5nIG1hY3JvdGFza3MgaXMgZXhwb3NlZCwgdGhlbiBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgZmlyZWQgYmVmb3JlIGFueSBtYWNyb3Rhc2tcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgbGV0IHF1ZXVlTWljcm9UYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRsZXQgZW5xdWV1ZTogKGl0ZW06IFF1ZXVlSXRlbSkgPT4gdm9pZDtcblxuXHRpZiAoaGFzKCdob3N0LW5vZGUnKSkge1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdGdsb2JhbC5wcm9jZXNzLm5leHRUaWNrKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdlczYtcHJvbWlzZScpKSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Z2xvYmFsLlByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGV4ZWN1dGVUYXNrKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKSkge1xuXHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0Y29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblx0XHRjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0Y29uc3QgcXVldWU6IFF1ZXVlSXRlbVtdID0gW107XG5cdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKTogdm9pZCB7XG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb25zdCBpdGVtID0gcXVldWUuc2hpZnQoKTtcblx0XHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0aXRlbS5jYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdHF1ZXVlLnB1c2goaXRlbSk7XG5cdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgncXVldWVTdGF0dXMnLCAnMScpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IHZvaWQge1xuXHRcdFx0Y2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xuXHRcdFx0bWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0XHRjb25zdCBpdGVtOiBRdWV1ZUl0ZW0gPSB7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdH07XG5cblx0XHRlbnF1ZXVlKGl0ZW0pO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xuXHR9O1xufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBxdWV1ZS50cyIsIi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgICAgVGhlIHZhbHVlIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBzZXQgdG9cbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcbiAqIEBwYXJhbSB3cml0YWJsZSAgICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSB3cml0YWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHBhcmFtIGNvbmZpZ3VyYWJsZSBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcjxUPihcblx0dmFsdWU6IFQsXG5cdGVudW1lcmFibGU6IGJvb2xlYW4gPSBmYWxzZSxcblx0d3JpdGFibGU6IGJvb2xlYW4gPSB0cnVlLFxuXHRjb25maWd1cmFibGU6IGJvb2xlYW4gPSB0cnVlXG4pOiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxUPiB7XG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHZhbHVlLFxuXHRcdGVudW1lcmFibGU6IGVudW1lcmFibGUsXG5cdFx0d3JpdGFibGU6IHdyaXRhYmxlLFxuXHRcdGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXG5cdH07XG59XG5cbi8qKlxuICogQSBoZWxwZXIgZnVuY3Rpb24gd2hpY2ggd3JhcHMgYSBmdW5jdGlvbiB3aGVyZSB0aGUgZmlyc3QgYXJndW1lbnQgYmVjb21lcyB0aGUgc2NvcGVcbiAqIG9mIHRoZSBjYWxsXG4gKlxuICogQHBhcmFtIG5hdGl2ZUZ1bmN0aW9uIFRoZSBzb3VyY2UgZnVuY3Rpb24gdG8gYmUgd3JhcHBlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBSPihuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUpID0+IFIpOiAodGFyZ2V0OiBULCBhcmcxOiBVKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgUj4obmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWKSA9PiBSKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogVikgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBYLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgWCwgWSwgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVywgYXJnNDogWSkgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVywgYXJnNDogWSkgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6ICh0YXJnZXQ6IGFueSwgLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnkge1xuXHRcdHJldHVybiBuYXRpdmVGdW5jdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHV0aWwudHMiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBJbmplY3RvckV2ZW50TWFwIHtcblx0aW52YWxpZGF0ZTogRXZlbnRPYmplY3Q8J2ludmFsaWRhdGUnPjtcbn1cblxuZXhwb3J0IGNsYXNzIEluamVjdG9yPFQgPSBhbnk+IGV4dGVuZHMgRXZlbnRlZDxJbmplY3RvckV2ZW50TWFwPiB7XG5cdHByaXZhdGUgX3BheWxvYWQ6IFQ7XG5cblx0Y29uc3RydWN0b3IocGF5bG9hZDogVCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0KCk6IFQge1xuXHRcdHJldHVybiB0aGlzLl9wYXlsb2FkO1xuXHR9XG5cblx0cHVibGljIHNldChwYXlsb2FkOiBUKTogdm9pZCB7XG5cdFx0dGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluamVjdG9yO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEluamVjdG9yLnRzIiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IE5vZGVIYW5kbGVySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBFbnVtIHRvIGlkZW50aWZ5IHRoZSB0eXBlIG9mIGV2ZW50LlxuICogTGlzdGVuaW5nIHRvICdQcm9qZWN0b3InIHdpbGwgbm90aWZ5IHdoZW4gcHJvamVjdG9yIGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxuICogTGlzdGVuaW5nIHRvICdXaWRnZXQnIHdpbGwgbm90aWZ5IHdoZW4gd2lkZ2V0IHJvb3QgaXMgY3JlYXRlZCBvciB1cGRhdGVkXG4gKi9cbmV4cG9ydCBlbnVtIE5vZGVFdmVudFR5cGUge1xuXHRQcm9qZWN0b3IgPSAnUHJvamVjdG9yJyxcblx0V2lkZ2V0ID0gJ1dpZGdldCdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlSGFuZGxlckV2ZW50TWFwIHtcblx0UHJvamVjdG9yOiBFdmVudE9iamVjdDxOb2RlRXZlbnRUeXBlLlByb2plY3Rvcj47XG5cdFdpZGdldDogRXZlbnRPYmplY3Q8Tm9kZUV2ZW50VHlwZS5XaWRnZXQ+O1xufVxuXG5leHBvcnQgY2xhc3MgTm9kZUhhbmRsZXIgZXh0ZW5kcyBFdmVudGVkPE5vZGVIYW5kbGVyRXZlbnRNYXA+IGltcGxlbWVudHMgTm9kZUhhbmRsZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIF9ub2RlTWFwID0gbmV3IE1hcDxzdHJpbmcsIEVsZW1lbnQ+KCk7XG5cblx0cHVibGljIGdldChrZXk6IHN0cmluZyk6IEVsZW1lbnQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLl9ub2RlTWFwLmdldChrZXkpO1xuXHR9XG5cblx0cHVibGljIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9ub2RlTWFwLmhhcyhrZXkpO1xuXHR9XG5cblx0cHVibGljIGFkZChlbGVtZW50OiBFbGVtZW50LCBrZXk6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuX25vZGVNYXAuc2V0KGtleSwgZWxlbWVudCk7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFJvb3QoKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5XaWRnZXQgfSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkUHJvamVjdG9yKCk6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuUHJvamVjdG9yIH0pO1xuXHR9XG5cblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xuXHRcdHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBOb2RlSGFuZGxlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBOb2RlSGFuZGxlci50cyIsImltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RvciwgUmVnaXN0cnlMYWJlbCwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yLCBXaWRnZXRCYXNlSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi9JbmplY3Rvcic7XG5cbmV4cG9ydCB0eXBlIFdpZGdldEJhc2VDb25zdHJ1Y3RvckZ1bmN0aW9uID0gKCkgPT4gUHJvbWlzZTxXaWRnZXRCYXNlQ29uc3RydWN0b3I+O1xuXG5leHBvcnQgdHlwZSBFU01EZWZhdWx0V2lkZ2V0QmFzZUZ1bmN0aW9uID0gKCkgPT4gUHJvbWlzZTxFU01EZWZhdWx0V2lkZ2V0QmFzZTxXaWRnZXRCYXNlSW50ZXJmYWNlPj47XG5cbmV4cG9ydCB0eXBlIFJlZ2lzdHJ5SXRlbSA9XG5cdHwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXG5cdHwgUHJvbWlzZTxXaWRnZXRCYXNlQ29uc3RydWN0b3I+XG5cdHwgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb25cblx0fCBFU01EZWZhdWx0V2lkZ2V0QmFzZUZ1bmN0aW9uO1xuXG4vKipcbiAqIFdpZGdldCBiYXNlIHN5bWJvbCB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXSURHRVRfQkFTRV9UWVBFID0gU3ltYm9sKCdXaWRnZXQgQmFzZScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5RXZlbnRPYmplY3QgZXh0ZW5kcyBFdmVudE9iamVjdDxSZWdpc3RyeUxhYmVsPiB7XG5cdGFjdGlvbjogc3RyaW5nO1xuXHRpdGVtOiBXaWRnZXRCYXNlQ29uc3RydWN0b3IgfCBJbmplY3Rvcjtcbn1cblxuLyoqXG4gKiBXaWRnZXQgUmVnaXN0cnkgSW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlJbnRlcmZhY2Uge1xuXHQvKipcblx0ICogRGVmaW5lIGEgV2lkZ2V0UmVnaXN0cnlJdGVtIGFnYWluc3QgYSBsYWJlbFxuXHQgKlxuXHQgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB3aWRnZXQgdG8gcmVnaXN0ZXJcblx0ICogQHBhcmFtIHJlZ2lzdHJ5SXRlbSBUaGUgcmVnaXN0cnkgaXRlbSB0byBkZWZpbmVcblx0ICovXG5cdGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgcmVnaXN0cnlJdGVtOiBSZWdpc3RyeUl0ZW0pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSBnaXZlbiBsYWJlbCwgbnVsbCBpZiBhbiBlbnRyeSBkb2Vzbid0IGV4aXN0XG5cdCAqXG5cdCAqIEBwYXJhbSB3aWRnZXRMYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHdpZGdldCB0byByZXR1cm5cblx0ICogQHJldHVybnMgVGhlIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIHdpZGdldExhYmVsLCBgbnVsbGAgaWYgbm8gZW50cnkgZXhpc3RzXG5cdCAqL1xuXHRnZXQ8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBXaWRnZXRCYXNlSW50ZXJmYWNlPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IENvbnN0cnVjdG9yPFQ+IHwgbnVsbDtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIGJvb2xlYW4gaWYgYW4gZW50cnkgZm9yIHRoZSBsYWJlbCBleGlzdHNcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCB0byBzZWFyY2ggZm9yXG5cdCAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhIHdpZGdldCByZWdpc3RyeSBpdGVtIGV4aXN0c1xuXHQgKi9cblx0aGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRGVmaW5lIGFuIEluamVjdG9yIGFnYWluc3QgYSBsYWJlbFxuXHQgKlxuXHQgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSBpbmplY3RvciB0byByZWdpc3RlclxuXHQgKiBAcGFyYW0gcmVnaXN0cnlJdGVtIFRoZSBpbmplY3RvciB0byBkZWZpbmVcblx0ICovXG5cdGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCByZWdpc3RyeUl0ZW06IEluamVjdG9yKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGFuIEluamVjdG9yIHJlZ2lzdHJ5IGl0ZW0gZm9yIHRoZSBnaXZlbiBsYWJlbCwgbnVsbCBpZiBhbiBlbnRyeSBkb2Vzbid0IGV4aXN0XG5cdCAqXG5cdCAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIGluamVjdG9yIHRvIHJldHVyblxuXHQgKiBAcmV0dXJucyBUaGUgUmVnaXN0cnlJdGVtIGZvciB0aGUgd2lkZ2V0TGFiZWwsIGBudWxsYCBpZiBubyBlbnRyeSBleGlzdHNcblx0ICovXG5cdGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBUIHwgbnVsbDtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIGJvb2xlYW4gaWYgYW4gaW5qZWN0b3IgZm9yIHRoZSBsYWJlbCBleGlzdHNcblx0ICpcblx0ICogQHBhcmFtIHdpZGdldExhYmVsIFRoZSBsYWJlbCB0byBzZWFyY2ggZm9yXG5cdCAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhIGluamVjdG9yIHJlZ2lzdHJ5IGl0ZW0gZXhpc3RzXG5cdCAqL1xuXHRoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ2hlY2tzIGlzIHRoZSBpdGVtIGlzIGEgc3ViY2xhc3Mgb2YgV2lkZ2V0QmFzZSAob3IgYSBXaWRnZXRCYXNlKVxuICpcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB0cnVlL2ZhbHNlIGluZGljYXRpbmcgaWYgdGhlIGl0ZW0gaXMgYSBXaWRnZXRCYXNlQ29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yPFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlPihpdGVtOiBhbnkpOiBpdGVtIGlzIENvbnN0cnVjdG9yPFQ+IHtcblx0cmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFU01EZWZhdWx0V2lkZ2V0QmFzZTxUPiB7XG5cdGRlZmF1bHQ6IENvbnN0cnVjdG9yPFQ+O1xuXHRfX2VzTW9kdWxlOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQ8VD4oaXRlbTogYW55KTogaXRlbSBpcyBFU01EZWZhdWx0V2lkZ2V0QmFzZTxUPiB7XG5cdHJldHVybiBCb29sZWFuKFxuXHRcdGl0ZW0gJiZcblx0XHRcdGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxuXHRcdFx0aXRlbS5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpICYmXG5cdFx0XHRpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtLmRlZmF1bHQpXG5cdCk7XG59XG5cbi8qKlxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50ZWQ8e30sIFJlZ2lzdHJ5TGFiZWwsIFJlZ2lzdHJ5RXZlbnRPYmplY3Q+IGltcGxlbWVudHMgUmVnaXN0cnlJbnRlcmZhY2Uge1xuXHQvKipcblx0ICogaW50ZXJuYWwgbWFwIG9mIGxhYmVscyBhbmQgUmVnaXN0cnlJdGVtXG5cdCAqL1xuXHRwcml2YXRlIF93aWRnZXRSZWdpc3RyeTogTWFwPFJlZ2lzdHJ5TGFiZWwsIFJlZ2lzdHJ5SXRlbT47XG5cblx0cHJpdmF0ZSBfaW5qZWN0b3JSZWdpc3RyeTogTWFwPFJlZ2lzdHJ5TGFiZWwsIEluamVjdG9yPjtcblxuXHQvKipcblx0ICogRW1pdCBsb2FkZWQgZXZlbnQgZm9yIHJlZ2lzdHJ5IGxhYmVsXG5cdCAqL1xuXHRwcml2YXRlIGVtaXRMb2FkZWRFdmVudCh3aWRnZXRMYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIHwgSW5qZWN0b3IpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoe1xuXHRcdFx0dHlwZTogd2lkZ2V0TGFiZWwsXG5cdFx0XHRhY3Rpb246ICdsb2FkZWQnLFxuXHRcdFx0aXRlbVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGRlZmluZShsYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogUmVnaXN0cnlJdGVtKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHdpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuXHRcdH1cblxuXHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XG5cblx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdGl0ZW0udGhlbihcblx0XHRcdFx0KHdpZGdldEN0b3IpID0+IHtcblx0XHRcdFx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0XHRyZXR1cm4gd2lkZ2V0Q3Rvcjtcblx0XHRcdFx0fSxcblx0XHRcdFx0KGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xuXHRcdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkZWZpbmVJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCwgaXRlbTogSW5qZWN0b3IpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgaW5qZWN0b3IgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcblx0XHR9XG5cblx0XHR0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XG5cdFx0dGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuXHR9XG5cblx0cHVibGljIGdldDxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZSA9IFdpZGdldEJhc2VJbnRlcmZhY2U+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogQ29uc3RydWN0b3I8VD4gfCBudWxsIHtcblx0XHRpZiAoIXRoaXMuaGFzKGxhYmVsKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXRlbSA9IHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmdldChsYWJlbCk7XG5cblx0XHRpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8VD4oaXRlbSkpIHtcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH1cblxuXHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvbWlzZSA9ICg8V2lkZ2V0QmFzZUNvbnN0cnVjdG9yRnVuY3Rpb24+aXRlbSkoKTtcblx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHByb21pc2UpO1xuXG5cdFx0cHJvbWlzZS50aGVuKFxuXHRcdFx0KHdpZGdldEN0b3IpID0+IHtcblx0XHRcdFx0aWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0PFQ+KHdpZGdldEN0b3IpKSB7XG5cdFx0XHRcdFx0d2lkZ2V0Q3RvciA9IHdpZGdldEN0b3IuZGVmYXVsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0cmV0dXJuIHdpZGdldEN0b3I7XG5cdFx0XHR9LFxuXHRcdFx0KGVycm9yKSA9PiB7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogVCB8IG51bGwge1xuXHRcdGlmICghdGhpcy5oYXNJbmplY3RvcihsYWJlbCkpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmdldChsYWJlbCkgYXMgVDtcblx0fVxuXG5cdHB1YmxpYyBoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2luamVjdG9yUmVnaXN0cnkgJiYgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBSZWdpc3RyeS50cyIsImltcG9ydCB7IE1hcCB9IGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFJlZ2lzdHJ5TGFiZWwsIFdpZGdldEJhc2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnksIFJlZ2lzdHJ5RXZlbnRPYmplY3QsIFJlZ2lzdHJ5SXRlbSB9IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuL0luamVjdG9yJztcblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUhhbmRsZXJFdmVudE1hcCB7XG5cdGludmFsaWRhdGU6IEV2ZW50T2JqZWN0PCdpbnZhbGlkYXRlJz47XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeUhhbmRsZXIgZXh0ZW5kcyBFdmVudGVkPFJlZ2lzdHJ5SGFuZGxlckV2ZW50TWFwPiB7XG5cdHByaXZhdGUgX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG5cdHByaXZhdGUgX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPiA9IG5ldyBNYXAoKTtcblx0cHJpdmF0ZSBfcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT4gPSBuZXcgTWFwKCk7XG5cdHByb3RlY3RlZCBiYXNlUmVnaXN0cnk/OiBSZWdpc3RyeTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcblx0XHRjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuYmFzZVJlZ2lzdHJ5KSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0XHRcdHRoaXMuYmFzZVJlZ2lzdHJ5ID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5vd24oeyBkZXN0cm95IH0pO1xuXHR9XG5cblx0cHVibGljIHNldCBiYXNlKGJhc2VSZWdpc3RyeTogUmVnaXN0cnkpIHtcblx0XHRpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdH1cblx0XHR0aGlzLmJhc2VSZWdpc3RyeSA9IGJhc2VSZWdpc3RyeTtcblx0fVxuXG5cdHB1YmxpYyBkZWZpbmUobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHdpZGdldDogUmVnaXN0cnlJdGVtKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xuXHR9XG5cblx0cHVibGljIGRlZmluZUluamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCBpbmplY3RvcjogSW5qZWN0b3IpOiB2b2lkIHtcblx0XHR0aGlzLl9yZWdpc3RyeS5kZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3IpO1xuXHR9XG5cblx0cHVibGljIGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBXaWRnZXRCYXNlSW50ZXJmYWNlPihcblx0XHRsYWJlbDogUmVnaXN0cnlMYWJlbCxcblx0XHRnbG9iYWxQcmVjZWRlbmNlOiBib29sZWFuID0gZmFsc2Vcblx0KTogQ29uc3RydWN0b3I8VD4gfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZTogYm9vbGVhbiA9IGZhbHNlKTogVCB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXRJbmplY3RvcicsIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXQoXG5cdFx0bGFiZWw6IFJlZ2lzdHJ5TGFiZWwsXG5cdFx0Z2xvYmFsUHJlY2VkZW5jZTogYm9vbGVhbixcblx0XHRnZXRGdW5jdGlvbk5hbWU6ICdnZXRJbmplY3RvcicgfCAnZ2V0Jyxcblx0XHRsYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+XG5cdCk6IGFueSB7XG5cdFx0Y29uc3QgcmVnaXN0cmllcyA9IGdsb2JhbFByZWNlZGVuY2UgPyBbdGhpcy5iYXNlUmVnaXN0cnksIHRoaXMuX3JlZ2lzdHJ5XSA6IFt0aGlzLl9yZWdpc3RyeSwgdGhpcy5iYXNlUmVnaXN0cnldO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVnaXN0cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcmVnaXN0cnk6IGFueSA9IHJlZ2lzdHJpZXNbaV07XG5cdFx0XHRpZiAoIXJlZ2lzdHJ5KSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xuXHRcdFx0Y29uc3QgcmVnaXN0ZXJlZExhYmVscyA9IGxhYmVsTWFwLmdldChyZWdpc3RyeSkgfHwgW107XG5cdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH0gZWxzZSBpZiAocmVnaXN0ZXJlZExhYmVscy5pbmRleE9mKGxhYmVsKSA9PT0gLTEpIHtcblx0XHRcdFx0Y29uc3QgaGFuZGxlID0gcmVnaXN0cnkub24obGFiZWwsIChldmVudDogUmVnaXN0cnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdGV2ZW50LmFjdGlvbiA9PT0gJ2xvYWRlZCcgJiZcblx0XHRcdFx0XHRcdCh0aGlzIGFzIGFueSlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkgPT09IGV2ZW50Lml0ZW1cblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuZW1pdCh7IHR5cGU6ICdpbnZhbGlkYXRlJyB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLm93bihoYW5kbGUpO1xuXHRcdFx0XHRsYWJlbE1hcC5zZXQocmVnaXN0cnksIFsuLi5yZWdpc3RlcmVkTGFiZWxzLCBsYWJlbF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeUhhbmRsZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUmVnaXN0cnlIYW5kbGVyLnRzIiwiaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBhdXRvIH0gZnJvbSAnLi9kaWZmJztcbmltcG9ydCB7XG5cdEFmdGVyUmVuZGVyLFxuXHRCZWZvcmVQcm9wZXJ0aWVzLFxuXHRCZWZvcmVSZW5kZXIsXG5cdENvcmVQcm9wZXJ0aWVzLFxuXHREaWZmUHJvcGVydHlSZWFjdGlvbixcblx0RE5vZGUsXG5cdFJlbmRlcixcblx0V2lkZ2V0TWV0YUJhc2UsXG5cdFdpZGdldE1ldGFDb25zdHJ1Y3Rvcixcblx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0V2lkZ2V0UHJvcGVydGllc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5pbXBvcnQgTm9kZUhhbmRsZXIgZnJvbSAnLi9Ob2RlSGFuZGxlcic7XG5pbXBvcnQgeyB3aWRnZXRJbnN0YW5jZU1hcCB9IGZyb20gJy4vdmRvbSc7XG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciwgV0lER0VUX0JBU0VfVFlQRSB9IGZyb20gJy4vUmVnaXN0cnknO1xuXG5pbnRlcmZhY2UgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cyB7XG5cdHByZXZpb3VzUHJvcGVydGllczogYW55O1xuXHRuZXdQcm9wZXJ0aWVzOiBhbnk7XG5cdGNoYW5nZWQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZWFjdGlvbkZ1bmN0aW9uQ29uZmlnIHtcblx0cHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cdHJlYWN0aW9uOiBEaWZmUHJvcGVydHlSZWFjdGlvbjtcbn1cblxuZXhwb3J0IHR5cGUgQm91bmRGdW5jdGlvbkRhdGEgPSB7IGJvdW5kRnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7IHNjb3BlOiBhbnkgfTtcblxuY29uc3QgZGVjb3JhdG9yTWFwID0gbmV3IE1hcDxGdW5jdGlvbiwgTWFwPHN0cmluZywgYW55W10+PigpO1xuY29uc3QgYm91bmRBdXRvID0gYXV0by5iaW5kKG51bGwpO1xuXG4vKipcbiAqIE1haW4gd2lkZ2V0IGJhc2UgZm9yIGFsbCB3aWRnZXRzIHRvIGV4dGVuZFxuICovXG5leHBvcnQgY2xhc3MgV2lkZ2V0QmFzZTxQID0gV2lkZ2V0UHJvcGVydGllcywgQyBleHRlbmRzIEROb2RlID0gRE5vZGU+IGltcGxlbWVudHMgV2lkZ2V0QmFzZUludGVyZmFjZTxQLCBDPiB7XG5cdC8qKlxuXHQgKiBzdGF0aWMgaWRlbnRpZmllclxuXHQgKi9cblx0c3RhdGljIF90eXBlOiBzeW1ib2wgPSBXSURHRVRfQkFTRV9UWVBFO1xuXG5cdC8qKlxuXHQgKiBjaGlsZHJlbiBhcnJheVxuXHQgKi9cblx0cHJpdmF0ZSBfY2hpbGRyZW46IChDIHwgbnVsbClbXTtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIGl0IGlzIHRoZSBpbml0aWFsIHNldCBwcm9wZXJ0aWVzIGN5Y2xlXG5cdCAqL1xuXHRwcml2YXRlIF9pbml0aWFsUHJvcGVydGllcyA9IHRydWU7XG5cblx0LyoqXG5cdCAqIGludGVybmFsIHdpZGdldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwcml2YXRlIF9wcm9wZXJ0aWVzOiBQICYgV2lkZ2V0UHJvcGVydGllcyAmIHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfTtcblxuXHQvKipcblx0ICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHByaXZhdGUgX2NoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdID0gW107XG5cblx0LyoqXG5cdCAqIG1hcCBvZiBkZWNvcmF0b3JzIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhpcyB3aWRnZXRcblx0ICovXG5cdHByaXZhdGUgX2RlY29yYXRvckNhY2hlOiBNYXA8c3RyaW5nLCBhbnlbXT47XG5cblx0cHJpdmF0ZSBfcmVnaXN0cnk6IFJlZ2lzdHJ5SGFuZGxlcjtcblxuXHQvKipcblx0ICogTWFwIG9mIGZ1bmN0aW9ucyBwcm9wZXJ0aWVzIGZvciB0aGUgYm91bmQgZnVuY3Rpb25cblx0ICovXG5cdHByaXZhdGUgX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwOiBXZWFrTWFwPCguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCBCb3VuZEZ1bmN0aW9uRGF0YT47XG5cblx0cHJpdmF0ZSBfbWV0YU1hcDogTWFwPFdpZGdldE1ldGFDb25zdHJ1Y3Rvcjxhbnk+LCBXaWRnZXRNZXRhQmFzZT47XG5cblx0cHJpdmF0ZSBfYm91bmRSZW5kZXJGdW5jOiBSZW5kZXI7XG5cblx0cHJpdmF0ZSBfYm91bmRJbnZhbGlkYXRlOiAoKSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX25vZGVIYW5kbGVyOiBOb2RlSGFuZGxlciA9IG5ldyBOb2RlSGFuZGxlcigpO1xuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2NoaWxkcmVuID0gW107XG5cdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgYW55W10+KCk7XG5cdFx0dGhpcy5fcHJvcGVydGllcyA9IDxQPnt9O1xuXHRcdHRoaXMuX2JvdW5kUmVuZGVyRnVuYyA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5fYm91bmRJbnZhbGlkYXRlID0gdGhpcy5pbnZhbGlkYXRlLmJpbmQodGhpcyk7XG5cblx0XHR3aWRnZXRJbnN0YW5jZU1hcC5zZXQodGhpcywge1xuXHRcdFx0ZGlydHk6IHRydWUsXG5cdFx0XHRvbkF0dGFjaDogKCk6IHZvaWQgPT4ge1xuXHRcdFx0XHR0aGlzLm9uQXR0YWNoKCk7XG5cdFx0XHR9LFxuXHRcdFx0b25EZXRhY2g6ICgpOiB2b2lkID0+IHtcblx0XHRcdFx0dGhpcy5vbkRldGFjaCgpO1xuXHRcdFx0XHR0aGlzLl9kZXN0cm95KCk7XG5cdFx0XHR9LFxuXHRcdFx0bm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxuXHRcdFx0cmVnaXN0cnk6ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0cnk7XG5cdFx0XHR9LFxuXHRcdFx0Y29yZVByb3BlcnRpZXM6IHt9IGFzIENvcmVQcm9wZXJ0aWVzLFxuXHRcdFx0cmVuZGVyaW5nOiBmYWxzZSxcblx0XHRcdGlucHV0UHJvcGVydGllczoge31cblx0XHR9KTtcblxuXHRcdHRoaXMuX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbWV0YTxUIGV4dGVuZHMgV2lkZ2V0TWV0YUJhc2U+KE1ldGFUeXBlOiBXaWRnZXRNZXRhQ29uc3RydWN0b3I8VD4pOiBUIHtcblx0XHRpZiAodGhpcy5fbWV0YU1hcCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9tZXRhTWFwID0gbmV3IE1hcDxXaWRnZXRNZXRhQ29uc3RydWN0b3I8YW55PiwgV2lkZ2V0TWV0YUJhc2U+KCk7XG5cdFx0fVxuXHRcdGxldCBjYWNoZWQgPSB0aGlzLl9tZXRhTWFwLmdldChNZXRhVHlwZSk7XG5cdFx0aWYgKCFjYWNoZWQpIHtcblx0XHRcdGNhY2hlZCA9IG5ldyBNZXRhVHlwZSh7XG5cdFx0XHRcdGludmFsaWRhdGU6IHRoaXMuX2JvdW5kSW52YWxpZGF0ZSxcblx0XHRcdFx0bm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxuXHRcdFx0XHRiaW5kOiB0aGlzXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX21ldGFNYXAuc2V0KE1ldGFUeXBlLCBjYWNoZWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjYWNoZWQgYXMgVDtcblx0fVxuXG5cdHByb3RlY3RlZCBvbkF0dGFjaCgpOiB2b2lkIHtcblx0XHQvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5cdH1cblxuXHRwcm90ZWN0ZWQgb25EZXRhY2goKTogdm9pZCB7XG5cdFx0Ly8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxuXHR9XG5cblx0cHVibGljIGdldCBwcm9wZXJ0aWVzKCk6IFJlYWRvbmx5PFA+ICYgUmVhZG9ubHk8V2lkZ2V0UHJvcGVydGllcz4ge1xuXHRcdHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuXHR9XG5cblx0cHVibGljIGdldCBjaGFuZ2VkUHJvcGVydHlLZXlzKCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gWy4uLnRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXNdO1xuXHR9XG5cblx0cHVibGljIF9fc2V0Q29yZVByb3BlcnRpZXNfXyhjb3JlUHJvcGVydGllczogQ29yZVByb3BlcnRpZXMpOiB2b2lkIHtcblx0XHRjb25zdCB7IGJhc2VSZWdpc3RyeSB9ID0gY29yZVByb3BlcnRpZXM7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblxuXHRcdGlmIChpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5ICE9PSBiYXNlUmVnaXN0cnkpIHtcblx0XHRcdGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcigpO1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5iYXNlID0gYmFzZVJlZ2lzdHJ5O1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0fVxuXHRcdGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyA9IGNvcmVQcm9wZXJ0aWVzO1xuXHR9XG5cblx0cHVibGljIF9fc2V0UHJvcGVydGllc19fKG9yaWdpbmFsUHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZCB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzID0gb3JpZ2luYWxQcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLl9ydW5CZWZvcmVQcm9wZXJ0aWVzKG9yaWdpbmFsUHJvcGVydGllcyk7XG5cdFx0Y29uc3QgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknKTtcblx0XHRjb25zdCBjaGFuZ2VkUHJvcGVydHlLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdGNvbnN0IHByb3BlcnR5TmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblxuXHRcdGlmICh0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9PT0gZmFsc2UgfHwgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0Y29uc3QgYWxsUHJvcGVydGllcyA9IFsuLi5wcm9wZXJ0eU5hbWVzLCAuLi5PYmplY3Qua2V5cyh0aGlzLl9wcm9wZXJ0aWVzKV07XG5cdFx0XHRjb25zdCBjaGVja2VkUHJvcGVydGllczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuXHRcdFx0Y29uc3QgZGlmZlByb3BlcnR5UmVzdWx0czogYW55ID0ge307XG5cdFx0XHRsZXQgcnVuUmVhY3Rpb25zID0gZmFsc2U7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBhbGxQcm9wZXJ0aWVzW2ldO1xuXHRcdFx0XHRpZiAoY2hlY2tlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNoZWNrZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0Y29uc3QgcHJldmlvdXNQcm9wZXJ0eSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdFx0Y29uc3QgbmV3UHJvcGVydHkgPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShcblx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sXG5cdFx0XHRcdFx0aW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmRcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0cnVuUmVhY3Rpb25zID0gdHJ1ZTtcblx0XHRcdFx0XHRjb25zdCBkaWZmRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoYGRpZmZQcm9wZXJ0eToke3Byb3BlcnR5TmFtZX1gKTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGRpZmZGdW5jdGlvbnNbaV0ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0XHRkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGJvdW5kQXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuXHRcdFx0XHRcdFx0ZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAocnVuUmVhY3Rpb25zKSB7XG5cdFx0XHRcdHRoaXMuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhwcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKS5mb3JFYWNoKChhcmdzLCByZWFjdGlvbikgPT4ge1xuXHRcdFx0XHRcdGlmIChhcmdzLmNoYW5nZWQpIHtcblx0XHRcdFx0XHRcdHJlYWN0aW9uLmNhbGwodGhpcywgYXJncy5wcmV2aW91c1Byb3BlcnRpZXMsIGFyZ3MubmV3UHJvcGVydGllcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3Byb3BlcnRpZXMgPSBkaWZmUHJvcGVydHlSZXN1bHRzO1xuXHRcdFx0dGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gZmFsc2U7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lc1tpXTtcblx0XHRcdFx0aWYgKHR5cGVvZiBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSxcblx0XHRcdFx0XHRcdGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzIH07XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGdldCBjaGlsZHJlbigpOiAoQyB8IG51bGwpW10ge1xuXHRcdHJldHVybiB0aGlzLl9jaGlsZHJlbjtcblx0fVxuXG5cdHB1YmxpYyBfX3NldENoaWxkcmVuX18oY2hpbGRyZW46IChDIHwgbnVsbClbXSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPiAwIHx8IGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG5cdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgX19yZW5kZXJfXygpOiBETm9kZSB8IEROb2RlW10ge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gZmFsc2U7XG5cdFx0Y29uc3QgcmVuZGVyID0gdGhpcy5fcnVuQmVmb3JlUmVuZGVycygpO1xuXHRcdGxldCBkTm9kZSA9IHJlbmRlcigpO1xuXHRcdGROb2RlID0gdGhpcy5ydW5BZnRlclJlbmRlcnMoZE5vZGUpO1xuXHRcdHRoaXMuX25vZGVIYW5kbGVyLmNsZWFyKCk7XG5cdFx0cmV0dXJuIGROb2RlO1xuXHR9XG5cblx0cHVibGljIGludmFsaWRhdGUoKTogdm9pZCB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpITtcblx0XHRpZiAoaW5zdGFuY2VEYXRhLmludmFsaWRhdGUpIHtcblx0XHRcdGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpOiBETm9kZSB8IEROb2RlW10ge1xuXHRcdHJldHVybiB2KCdkaXYnLCB7fSwgdGhpcy5jaGlsZHJlbik7XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gYWRkIGRlY29yYXRvcnMgdG8gV2lkZ2V0QmFzZVxuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBkZWNvcmF0b3Jcblx0ICovXG5cdHByb3RlY3RlZCBhZGREZWNvcmF0b3IoZGVjb3JhdG9yS2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcblx0XHR2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuXHRcdGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG5cdFx0XHRsZXQgZGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvck1hcC5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoIWRlY29yYXRvckxpc3QpIHtcblx0XHRcdFx0ZGVjb3JhdG9yTGlzdCA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblx0XHRcdFx0ZGVjb3JhdG9yTWFwLnNldCh0aGlzLmNvbnN0cnVjdG9yLCBkZWNvcmF0b3JMaXN0KTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvckxpc3QuZ2V0KGRlY29yYXRvcktleSk7XG5cdFx0XHRpZiAoIXNwZWNpZmljRGVjb3JhdG9yTGlzdCkge1xuXHRcdFx0XHRzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBbXTtcblx0XHRcdFx0ZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xuXHRcdFx0fVxuXHRcdFx0c3BlY2lmaWNEZWNvcmF0b3JMaXN0LnB1c2goLi4udmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBkZWNvcmF0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5KTtcblx0XHRcdHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIFsuLi5kZWNvcmF0b3JzLCAuLi52YWx1ZV0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBidWlsZCB0aGUgbGlzdCBvZiBkZWNvcmF0b3JzIGZyb20gdGhlIGdsb2JhbCBkZWNvcmF0b3IgbWFwLlxuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5ICBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHJldHVybiBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIF9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5OiBzdHJpbmcpOiBhbnlbXSB7XG5cdFx0Y29uc3QgYWxsRGVjb3JhdG9ycyA9IFtdO1xuXG5cdFx0bGV0IGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuXHRcdHdoaWxlIChjb25zdHJ1Y3Rvcikge1xuXHRcdFx0Y29uc3QgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcblx0XHRcdGlmIChpbnN0YW5jZU1hcCkge1xuXHRcdFx0XHRjb25zdCBkZWNvcmF0b3JzID0gaW5zdGFuY2VNYXAuZ2V0KGRlY29yYXRvcktleSk7XG5cblx0XHRcdFx0aWYgKGRlY29yYXRvcnMpIHtcblx0XHRcdFx0XHRhbGxEZWNvcmF0b3JzLnVuc2hpZnQoLi4uZGVjb3JhdG9ycyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhbGxEZWNvcmF0b3JzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3Ryb3lzIHByaXZhdGUgcmVzb3VyY2VzIGZvciBXaWRnZXRCYXNlXG5cdCAqL1xuXHRwcml2YXRlIF9kZXN0cm95KCkge1xuXHRcdGlmICh0aGlzLl9yZWdpc3RyeSkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkuZGVzdHJveSgpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLmZvckVhY2goKG1ldGEpID0+IHtcblx0XHRcdFx0bWV0YS5kZXN0cm95KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gcmV0cmlldmUgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKlxuXHQgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuXHQgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG5cdCAqL1xuXHRwcm90ZWN0ZWQgZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleTogc3RyaW5nKTogYW55W10ge1xuXHRcdGxldCBhbGxEZWNvcmF0b3JzID0gdGhpcy5fZGVjb3JhdG9yQ2FjaGUuZ2V0KGRlY29yYXRvcktleSk7XG5cblx0XHRpZiAoYWxsRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0XHR9XG5cblx0XHRhbGxEZWNvcmF0b3JzID0gdGhpcy5fYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSk7XG5cblx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBhbGxEZWNvcmF0b3JzKTtcblx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0fVxuXG5cdHByaXZhdGUgX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhcblx0XHRuZXdQcm9wZXJ0aWVzOiBhbnksXG5cdFx0Y2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW11cblx0KTogTWFwPEZ1bmN0aW9uLCBSZWFjdGlvbkZ1bmN0aW9uQXJndW1lbnRzPiB7XG5cdFx0Y29uc3QgcmVhY3Rpb25GdW5jdGlvbnM6IFJlYWN0aW9uRnVuY3Rpb25Db25maWdbXSA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nKTtcblxuXHRcdHJldHVybiByZWFjdGlvbkZ1bmN0aW9ucy5yZWR1Y2UoKHJlYWN0aW9uUHJvcGVydHlNYXAsIHsgcmVhY3Rpb24sIHByb3BlcnR5TmFtZSB9KSA9PiB7XG5cdFx0XHRsZXQgcmVhY3Rpb25Bcmd1bWVudHMgPSByZWFjdGlvblByb3BlcnR5TWFwLmdldChyZWFjdGlvbik7XG5cdFx0XHRpZiAocmVhY3Rpb25Bcmd1bWVudHMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZWFjdGlvbkFyZ3VtZW50cyA9IHtcblx0XHRcdFx0XHRwcmV2aW91c1Byb3BlcnRpZXM6IHt9LFxuXHRcdFx0XHRcdG5ld1Byb3BlcnRpZXM6IHt9LFxuXHRcdFx0XHRcdGNoYW5nZWQ6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5wcmV2aW91c1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLm5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IG5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdGlmIChjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMuY2hhbmdlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZWFjdGlvblByb3BlcnR5TWFwLnNldChyZWFjdGlvbiwgcmVhY3Rpb25Bcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIHJlYWN0aW9uUHJvcGVydHlNYXA7XG5cdFx0fSwgbmV3IE1hcDxGdW5jdGlvbiwgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cz4oKSk7XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdW5ib3VuZCBwcm9wZXJ0eSBmdW5jdGlvbnMgdG8gdGhlIHNwZWNpZmllZCBgYmluZGAgcHJvcGVydHlcblx0ICpcblx0ICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXG5cdCAqL1xuXHRwcml2YXRlIF9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0eTogYW55LCBiaW5kOiBhbnkpOiBhbnkge1xuXHRcdGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xuXHRcdFx0aWYgKHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPSBuZXcgV2Vha01hcDxcblx0XHRcdFx0XHQoLi4uYXJnczogYW55W10pID0+IGFueSxcblx0XHRcdFx0XHR7IGJvdW5kRnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7IHNjb3BlOiBhbnkgfVxuXHRcdFx0XHQ+KCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBiaW5kSW5mbzogUGFydGlhbDxCb3VuZEZ1bmN0aW9uRGF0YT4gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocHJvcGVydHkpIHx8IHt9O1xuXHRcdFx0bGV0IHsgYm91bmRGdW5jLCBzY29wZSB9ID0gYmluZEluZm87XG5cblx0XHRcdGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xuXHRcdFx0XHRib3VuZEZ1bmMgPSBwcm9wZXJ0eS5iaW5kKGJpbmQpIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuXHRcdFx0XHR0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocHJvcGVydHksIHsgYm91bmRGdW5jLCBzY29wZTogYmluZCB9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBib3VuZEZ1bmM7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9wZXJ0eTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgcmVnaXN0cnkoKTogUmVnaXN0cnlIYW5kbGVyIHtcblx0XHRpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9yZWdpc3RyeTtcblx0fVxuXG5cdHByaXZhdGUgX3J1bkJlZm9yZVByb3BlcnRpZXMocHJvcGVydGllczogYW55KSB7XG5cdFx0Y29uc3QgYmVmb3JlUHJvcGVydGllczogQmVmb3JlUHJvcGVydGllc1tdID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcblx0XHRpZiAoYmVmb3JlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYmVmb3JlUHJvcGVydGllcy5yZWR1Y2UoXG5cdFx0XHRcdChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pID0+IHtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5wcm9wZXJ0aWVzLCAuLi5iZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24uY2FsbCh0aGlzLCBwcm9wZXJ0aWVzKSB9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7IC4uLnByb3BlcnRpZXMgfVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XG5cdH1cblxuXHQvKipcblx0ICogUnVuIGFsbCByZWdpc3RlcmVkIGJlZm9yZSByZW5kZXJzIGFuZCByZXR1cm4gdGhlIHVwZGF0ZWQgcmVuZGVyIG1ldGhvZFxuXHQgKi9cblx0cHJpdmF0ZSBfcnVuQmVmb3JlUmVuZGVycygpOiBSZW5kZXIge1xuXHRcdGNvbnN0IGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XG5cblx0XHRpZiAoYmVmb3JlUmVuZGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYmVmb3JlUmVuZGVycy5yZWR1Y2UoKHJlbmRlcjogUmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbjogQmVmb3JlUmVuZGVyKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHJlbmRlciwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fY2hpbGRyZW4pO1xuXHRcdFx0XHRpZiAoIXVwZGF0ZWRSZW5kZXIpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xuXHRcdFx0XHRcdHJldHVybiByZW5kZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRSZW5kZXI7XG5cdFx0XHR9LCB0aGlzLl9ib3VuZFJlbmRlckZ1bmMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYm91bmRSZW5kZXJGdW5jO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBhZnRlciByZW5kZXJzIGFuZCByZXR1cm4gdGhlIGRlY29yYXRlZCBETm9kZXNcblx0ICpcblx0ICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcblx0ICovXG5cdHByb3RlY3RlZCBydW5BZnRlclJlbmRlcnMoZE5vZGU6IEROb2RlIHwgRE5vZGVbXSk6IEROb2RlIHwgRE5vZGVbXSB7XG5cdFx0Y29uc3QgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XG5cblx0XHRpZiAoYWZ0ZXJSZW5kZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBhZnRlclJlbmRlcnMucmVkdWNlKChkTm9kZTogRE5vZGUgfCBETm9kZVtdLCBhZnRlclJlbmRlckZ1bmN0aW9uOiBBZnRlclJlbmRlcikgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWZ0ZXJSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIGROb2RlKTtcblx0XHRcdH0sIGROb2RlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLmZvckVhY2goKG1ldGEpID0+IHtcblx0XHRcdFx0bWV0YS5hZnRlclJlbmRlcigpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGROb2RlO1xuXHR9XG5cblx0cHJpdmF0ZSBfcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTogdm9pZCB7XG5cdFx0Y29uc3QgYWZ0ZXJDb25zdHJ1Y3RvcnMgPSB0aGlzLmdldERlY29yYXRvcignYWZ0ZXJDb25zdHJ1Y3RvcicpO1xuXG5cdFx0aWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdGFmdGVyQ29uc3RydWN0b3JzLmZvckVhY2goKGFmdGVyQ29uc3RydWN0b3IpID0+IGFmdGVyQ29uc3RydWN0b3IuY2FsbCh0aGlzKSk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdpZGdldEJhc2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gV2lkZ2V0QmFzZS50cyIsImltcG9ydCB7IFZOb2RlUHJvcGVydGllcyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbmxldCBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJyc7XG5sZXQgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJyc7XG5cbmZ1bmN0aW9uIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdGlmICgnV2Via2l0VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xuXHRcdGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XG5cdFx0YnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XG5cdH0gZWxzZSBpZiAoJ3RyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUgfHwgJ01velRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcblx0XHRicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3RyYW5zaXRpb25lbmQnO1xuXHRcdGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICdhbmltYXRpb25lbmQnO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcignWW91ciBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdGlmIChicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPT09ICcnKSB7XG5cdFx0ZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcnVuQW5kQ2xlYW5VcChlbGVtZW50OiBIVE1MRWxlbWVudCwgc3RhcnRBbmltYXRpb246ICgpID0+IHZvaWQsIGZpbmlzaEFuaW1hdGlvbjogKCkgPT4gdm9pZCkge1xuXHRpbml0aWFsaXplKGVsZW1lbnQpO1xuXG5cdGxldCBmaW5pc2hlZCA9IGZhbHNlO1xuXG5cdGxldCB0cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCFmaW5pc2hlZCkge1xuXHRcdFx0ZmluaXNoZWQgPSB0cnVlO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG5cblx0XHRcdGZpbmlzaEFuaW1hdGlvbigpO1xuXHRcdH1cblx0fTtcblxuXHRzdGFydEFuaW1hdGlvbigpO1xuXG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG59XG5cbmZ1bmN0aW9uIGV4aXQobm9kZTogSFRNTEVsZW1lbnQsIHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcywgZXhpdEFuaW1hdGlvbjogc3RyaW5nLCByZW1vdmVOb2RlOiAoKSA9PiB2b2lkKSB7XG5cdGNvbnN0IGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uQWN0aXZlIHx8IGAke2V4aXRBbmltYXRpb259LWFjdGl2ZWA7XG5cblx0cnVuQW5kQ2xlYW5VcChcblx0XHRub2RlLFxuXHRcdCgpID0+IHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChleGl0QW5pbWF0aW9uKTtcblxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHQoKSA9PiB7XG5cdFx0XHRyZW1vdmVOb2RlKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5mdW5jdGlvbiBlbnRlcihub2RlOiBIVE1MRWxlbWVudCwgcHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbjogc3RyaW5nKSB7XG5cdGNvbnN0IGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5lbnRlckFuaW1hdGlvbkFjdGl2ZSB8fCBgJHtlbnRlckFuaW1hdGlvbn0tYWN0aXZlYDtcblxuXHRydW5BbmRDbGVhblVwKFxuXHRcdG5vZGUsXG5cdFx0KCkgPT4ge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGVudGVyQW5pbWF0aW9uKTtcblxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHQoKSA9PiB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoZW50ZXJBbmltYXRpb24pO1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKGFjdGl2ZUNsYXNzKTtcblx0XHR9XG5cdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0ZW50ZXIsXG5cdGV4aXRcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY3NzVHJhbnNpdGlvbnMudHMiLCJpbXBvcnQgU3ltYm9sIGZyb20gJ0Bkb2pvL3NoaW0vU3ltYm9sJztcbmltcG9ydCB7XG5cdENvbnN0cnVjdG9yLFxuXHREZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0RGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyxcblx0RE5vZGUsXG5cdFZOb2RlLFxuXHRSZWdpc3RyeUxhYmVsLFxuXHRWTm9kZVByb3BlcnRpZXMsXG5cdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFdOb2RlLFxuXHREb21PcHRpb25zXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBJbnRlcm5hbFZOb2RlLCBSZW5kZXJSZXN1bHQgfSBmcm9tICcuL3Zkb20nO1xuXG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBXTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBXTm9kZS4nKTtcblxuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgVk5vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgVk5PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgVk5vZGUuJyk7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFdOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dOb2RlPFcgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHRjaGlsZDogRE5vZGU8Vz5cbik6IGNoaWxkIGlzIFdOb2RlPFc+IHtcblx0cmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBXTk9ERSk7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFZOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZOb2RlKGNoaWxkOiBETm9kZSk6IGNoaWxkIGlzIFZOb2RlIHtcblx0cmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBWTk9ERSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnROb2RlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBFbGVtZW50IHtcblx0cmV0dXJuICEhdmFsdWUudGFnTmFtZTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBkZWNvcmF0ZSBtb2RpZmllclxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1vZGlmaWVyPFQgZXh0ZW5kcyBETm9kZT4ge1xuXHQoZE5vZGU6IFQsIGJyZWFrZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gZm9yIGRlY29yYXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJlZGljYXRlPFQgZXh0ZW5kcyBETm9kZT4ge1xuXHQoZE5vZGU6IEROb2RlKTogZE5vZGUgaXMgVDtcbn1cblxuLyoqXG4gKiBEZWNvcmF0b3Igb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY29yYXRlT3B0aW9uczxUIGV4dGVuZHMgRE5vZGU+IHtcblx0bW9kaWZpZXI6IE1vZGlmaWVyPFQ+O1xuXHRwcmVkaWNhdGU/OiBQcmVkaWNhdGU8VD47XG5cdHNoYWxsb3c/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEdlbmVyaWMgZGVjb3JhdGUgZnVuY3Rpb24gZm9yIEROb2Rlcy4gVGhlIG5vZGVzIGFyZSBtb2RpZmllZCBpbiBwbGFjZSBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcHJlZGljYXRlXG4gKiBhbmQgbW9kaWZpZXIgZnVuY3Rpb25zLlxuICpcbiAqIFRoZSBjaGlsZHJlbiBvZiBlYWNoIG5vZGUgYXJlIGZsYXR0ZW5lZCBhbmQgYWRkZWQgdG8gdGhlIGFycmF5IGZvciBkZWNvcmF0aW9uLlxuICpcbiAqIElmIG5vIHByZWRpY2F0ZSBpcyBzdXBwbGllZCB0aGVuIHRoZSBtb2RpZmllciB3aWxsIGJlIGV4ZWN1dGVkIG9uIGFsbCBub2Rlcy4gQSBgYnJlYWtlcmAgZnVuY3Rpb24gaXMgcGFzc2VkIHRvIHRoZVxuICogbW9kaWZpZXIgd2hpY2ggd2lsbCBkcmFpbiB0aGUgbm9kZXMgYXJyYXkgYW5kIGV4aXQgdGhlIGRlY29yYXRpb24uXG4gKlxuICogV2hlbiB0aGUgYHNoYWxsb3dgIG9wdGlvbnMgaXMgc2V0IHRvIGB0cnVlYCB0aGUgb25seSB0aGUgdG9wIG5vZGUgb3Igbm9kZXMgd2lsbCBiZSBkZWNvcmF0ZWQgKG9ubHkgc3VwcG9ydGVkIHVzaW5nXG4gKiBgRGVjb3JhdGVPcHRpb25zYCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KGROb2RlczogRE5vZGUsIG9wdGlvbnM6IERlY29yYXRlT3B0aW9uczxUPik6IEROb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oZE5vZGVzOiBETm9kZVtdLCBvcHRpb25zOiBEZWNvcmF0ZU9wdGlvbnM8VD4pOiBETm9kZVtdO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlPFQgZXh0ZW5kcyBETm9kZT4oZE5vZGVzOiBETm9kZSB8IEROb2RlW10sIG9wdGlvbnM6IERlY29yYXRlT3B0aW9uczxUPik6IEROb2RlIHwgRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KGROb2RlczogRE5vZGUsIG1vZGlmaWVyOiBNb2RpZmllcjxUPiwgcHJlZGljYXRlOiBQcmVkaWNhdGU8VD4pOiBETm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KGROb2RlczogRE5vZGVbXSwgbW9kaWZpZXI6IE1vZGlmaWVyPFQ+LCBwcmVkaWNhdGU6IFByZWRpY2F0ZTxUPik6IEROb2RlW107XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihcblx0ZE5vZGVzOiBSZW5kZXJSZXN1bHQsXG5cdG1vZGlmaWVyOiBNb2RpZmllcjxUPixcblx0cHJlZGljYXRlOiBQcmVkaWNhdGU8VD5cbik6IFJlbmRlclJlc3VsdDtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IEROb2RlLCBtb2RpZmllcjogTW9kaWZpZXI8RE5vZGU+KTogRE5vZGU7XG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGUoZE5vZGVzOiBETm9kZVtdLCBtb2RpZmllcjogTW9kaWZpZXI8RE5vZGU+KTogRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IFJlbmRlclJlc3VsdCwgbW9kaWZpZXI6IE1vZGlmaWVyPEROb2RlPik6IFJlbmRlclJlc3VsdDtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShcblx0ZE5vZGVzOiBETm9kZSB8IEROb2RlW10sXG5cdG9wdGlvbnNPck1vZGlmaWVyOiBNb2RpZmllcjxETm9kZT4gfCBEZWNvcmF0ZU9wdGlvbnM8RE5vZGU+LFxuXHRwcmVkaWNhdGU/OiBQcmVkaWNhdGU8RE5vZGU+XG4pOiBETm9kZSB8IEROb2RlW10ge1xuXHRsZXQgc2hhbGxvdyA9IGZhbHNlO1xuXHRsZXQgbW9kaWZpZXI7XG5cdGlmICh0eXBlb2Ygb3B0aW9uc09yTW9kaWZpZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRtb2RpZmllciA9IG9wdGlvbnNPck1vZGlmaWVyO1xuXHR9IGVsc2Uge1xuXHRcdG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXIubW9kaWZpZXI7XG5cdFx0cHJlZGljYXRlID0gb3B0aW9uc09yTW9kaWZpZXIucHJlZGljYXRlO1xuXHRcdHNoYWxsb3cgPSBvcHRpb25zT3JNb2RpZmllci5zaGFsbG93IHx8IGZhbHNlO1xuXHR9XG5cblx0bGV0IG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gWy4uLmROb2Rlc10gOiBbZE5vZGVzXTtcblx0ZnVuY3Rpb24gYnJlYWtlcigpIHtcblx0XHRub2RlcyA9IFtdO1xuXHR9XG5cdHdoaWxlIChub2Rlcy5sZW5ndGgpIHtcblx0XHRjb25zdCBub2RlID0gbm9kZXMuc2hpZnQoKTtcblx0XHRpZiAobm9kZSkge1xuXHRcdFx0aWYgKCFzaGFsbG93ICYmIChpc1dOb2RlKG5vZGUpIHx8IGlzVk5vZGUobm9kZSkpICYmIG5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0bm9kZXMgPSBbLi4ubm9kZXMsIC4uLm5vZGUuY2hpbGRyZW5dO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKG5vZGUpKSB7XG5cdFx0XHRcdG1vZGlmaWVyKG5vZGUsIGJyZWFrZXIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZE5vZGVzO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHc8VyBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHR3aWRnZXRDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8Vz4gfCBSZWdpc3RyeUxhYmVsLFxuXHRwcm9wZXJ0aWVzOiBXWydwcm9wZXJ0aWVzJ10sXG5cdGNoaWxkcmVuOiBXWydjaGlsZHJlbiddID0gW11cbik6IFdOb2RlPFc+IHtcblx0cmV0dXJuIHtcblx0XHRjaGlsZHJlbixcblx0XHR3aWRnZXRDb25zdHJ1Y3Rvcixcblx0XHRwcm9wZXJ0aWVzLFxuXHRcdHR5cGU6IFdOT0RFXG5cdH07XG59XG5cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIFZOb2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHYodGFnOiBzdHJpbmcsIHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyB8IERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMsIGNoaWxkcmVuPzogRE5vZGVbXSk6IFZOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIHYodGFnOiBzdHJpbmcsIGNoaWxkcmVuOiB1bmRlZmluZWQgfCBETm9kZVtdKTogVk5vZGU7XG5leHBvcnQgZnVuY3Rpb24gdih0YWc6IHN0cmluZyk6IFZOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIHYoXG5cdHRhZzogc3RyaW5nLFxuXHRwcm9wZXJ0aWVzT3JDaGlsZHJlbjogVk5vZGVQcm9wZXJ0aWVzIHwgRGVmZXJyZWRWaXJ0dWFsUHJvcGVydGllcyB8IEROb2RlW10gPSB7fSxcblx0Y2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlW10gPSB1bmRlZmluZWRcbik6IFZOb2RlIHtcblx0bGV0IHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyB8IERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcblx0bGV0IGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrO1xuXG5cdGlmIChBcnJheS5pc0FycmF5KHByb3BlcnRpZXNPckNoaWxkcmVuKSkge1xuXHRcdGNoaWxkcmVuID0gcHJvcGVydGllc09yQ2hpbGRyZW47XG5cdFx0cHJvcGVydGllcyA9IHt9O1xuXHR9XG5cblx0aWYgKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0ZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xuXHRcdHByb3BlcnRpZXMgPSB7fTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dGFnLFxuXHRcdGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrLFxuXHRcdGNoaWxkcmVuLFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBWTm9kZSBmb3IgYW4gZXhpc3RpbmcgRE9NIE5vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb20oXG5cdHsgbm9kZSwgYXR0cnMgPSB7fSwgcHJvcHMgPSB7fSwgb24gPSB7fSwgZGlmZlR5cGUgPSAnbm9uZScgfTogRG9tT3B0aW9ucyxcblx0Y2hpbGRyZW4/OiBETm9kZVtdXG4pOiBWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiBpc0VsZW1lbnROb2RlKG5vZGUpID8gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiBwcm9wcyxcblx0XHRhdHRyaWJ1dGVzOiBhdHRycyxcblx0XHRldmVudHM6IG9uLFxuXHRcdGNoaWxkcmVuLFxuXHRcdHR5cGU6IFZOT0RFLFxuXHRcdGRvbU5vZGU6IG5vZGUsXG5cdFx0dGV4dDogaXNFbGVtZW50Tm9kZShub2RlKSA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YSxcblx0XHRkaWZmVHlwZVxuXHR9IGFzIEludGVybmFsVk5vZGU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZC50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIHRvIHJ1biBhcyBhbiBhc3BlY3QgdG8gYHJlbmRlcmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZDogRnVuY3Rpb24pOiAodGFyZ2V0OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIoKTogKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nKSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZD86IEZ1bmN0aW9uKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdhZnRlclJlbmRlcicsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhZnRlclJlbmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhZnRlclJlbmRlci50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IEJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGFkZHMgdGhlIGZ1bmN0aW9uIHBhc3NlZCBvZiB0YXJnZXQgbWV0aG9kIHRvIGJlIHJ1blxuICogaW4gdGhlIGBiZWZvcmVQcm9wZXJ0aWVzYCBsaWZlY3ljbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZDogQmVmb3JlUHJvcGVydGllcyk6ICh0YXJnZXQ6IGFueSkgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKCk6ICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZD86IEJlZm9yZVByb3BlcnRpZXMpIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmVmb3JlUHJvcGVydGllcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBiZWZvcmVQcm9wZXJ0aWVzLnRzIiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgfSBmcm9tICcuLi9yZWdpc3RlckN1c3RvbUVsZW1lbnQnO1xuXG5leHBvcnQgdHlwZSBDdXN0b21FbGVtZW50UHJvcGVydHlOYW1lczxQIGV4dGVuZHMgb2JqZWN0PiA9ICgoa2V5b2YgUCkgfCAoa2V5b2YgV2lkZ2V0UHJvcGVydGllcykpW107XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY3VzdG9tIGVsZW1lbnQgY29uZmlndXJhdGlvbiB1c2VkIGJ5IHRoZSBjdXN0b21FbGVtZW50IGRlY29yYXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRDb25maWc8UCBleHRlbmRzIG9iamVjdCA9IHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfT4ge1xuXHQvKipcblx0ICogVGhlIHRhZyBvZiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHRhZzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIHdpZGdldCBwcm9wZXJ0aWVzIHRvIGV4cG9zZSBhcyBwcm9wZXJ0aWVzIG9uIHRoZSBjdXN0b20gZWxlbWVudFxuXHQgKi9cblx0cHJvcGVydGllcz86IEN1c3RvbUVsZW1lbnRQcm9wZXJ0eU5hbWVzPFA+O1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGF0dHJpYnV0ZXMgb24gdGhlIGN1c3RvbSBlbGVtZW50IHRvIG1hcCB0byB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0YXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRQcm9wZXJ0eU5hbWVzPFA+O1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGV2ZW50cyB0byBleHBvc2Vcblx0ICovXG5cdGV2ZW50cz86IEN1c3RvbUVsZW1lbnRQcm9wZXJ0eU5hbWVzPFA+O1xuXG5cdGNoaWxkVHlwZT86IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGU7XG59XG5cbi8qKlxuICogVGhpcyBEZWNvcmF0b3IgaXMgcHJvdmlkZWQgcHJvcGVydGllcyB0aGF0IGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgYSBjdXN0b20gZWxlbWVudCwgYW5kXG4gKiByZWdpc3RlcnMgdGhhdCBjdXN0b20gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbUVsZW1lbnQ8UCBleHRlbmRzIG9iamVjdCA9IHsgW2luZGV4OiBzdHJpbmddOiBhbnkgfT4oe1xuXHR0YWcsXG5cdHByb3BlcnRpZXMgPSBbXSxcblx0YXR0cmlidXRlcyA9IFtdLFxuXHRldmVudHMgPSBbXSxcblx0Y2hpbGRUeXBlID0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5ET0pPXG59OiBDdXN0b21FbGVtZW50Q29uZmlnPFA+KSB7XG5cdHJldHVybiBmdW5jdGlvbjxUIGV4dGVuZHMgQ29uc3RydWN0b3I8YW55Pj4odGFyZ2V0OiBUKSB7XG5cdFx0dGFyZ2V0LnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yID0ge1xuXHRcdFx0dGFnTmFtZTogdGFnLFxuXHRcdFx0YXR0cmlidXRlcyxcblx0XHRcdHByb3BlcnRpZXMsXG5cdFx0XHRldmVudHMsXG5cdFx0XHRjaGlsZFR5cGVcblx0XHR9O1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdXN0b21FbGVtZW50O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGN1c3RvbUVsZW1lbnQudHMiLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBEaWZmUHJvcGVydHlGdW5jdGlvbiB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVjb3JhdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgYSBmdW5jdGlvbiBhcyBhIHNwZWNpZmljIHByb3BlcnR5IGRpZmZcbiAqXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb2Ygd2hpY2ggdGhlIGRpZmYgZnVuY3Rpb24gaXMgYXBwbGllZFxuICogQHBhcmFtIGRpZmZUeXBlICAgICAgVGhlIGRpZmYgdHlwZSwgZGVmYXVsdCBpcyBEaWZmVHlwZS5BVVRPLlxuICogQHBhcmFtIGRpZmZGdW5jdGlvbiAgQSBkaWZmIGZ1bmN0aW9uIHRvIHJ1biBpZiBkaWZmVHlwZSBpZiBEaWZmVHlwZS5DVVNUT01cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZywgZGlmZkZ1bmN0aW9uOiBEaWZmUHJvcGVydHlGdW5jdGlvbiwgcmVhY3Rpb25GdW5jdGlvbj86IEZ1bmN0aW9uKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCwgZGlmZkZ1bmN0aW9uLmJpbmQobnVsbCkpO1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknLCBwcm9wZXJ0eU5hbWUpO1xuXHRcdGlmIChyZWFjdGlvbkZ1bmN0aW9uIHx8IHByb3BlcnR5S2V5KSB7XG5cdFx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nLCB7XG5cdFx0XHRcdHByb3BlcnR5TmFtZSxcblx0XHRcdFx0cmVhY3Rpb246IHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IHJlYWN0aW9uRnVuY3Rpb25cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpZmZQcm9wZXJ0eTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkaWZmUHJvcGVydHkudHMiLCJleHBvcnQgdHlwZSBEZWNvcmF0b3JIYW5kbGVyID0gKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZykgPT4gdm9pZDtcblxuLyoqXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcjogRGVjb3JhdG9ySGFuZGxlcikge1xuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nLCBkZXNjcmlwdG9yPzogUHJvcGVydHlEZXNjcmlwdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGhhbmRsZXIodGFyZ2V0LnByb3RvdHlwZSwgdW5kZWZpbmVkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZURlY29yYXRvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBoYW5kbGVEZWNvcmF0b3IudHMiLCJpbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vLi4vSW5qZWN0b3InO1xuaW1wb3J0IHsgYmVmb3JlUHJvcGVydGllcyB9IGZyb20gJy4vYmVmb3JlUHJvcGVydGllcyc7XG5pbXBvcnQgeyBSZWdpc3RyeUxhYmVsIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXG4gKi9cbmNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXA6IFdlYWtNYXA8V2lkZ2V0QmFzZSwgSW5qZWN0b3JbXT4gPSBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbnRyYWN0IHJlcXVpcmVzIGZvciB0aGUgZ2V0IHByb3BlcnRpZXMgZnVuY3Rpb25cbiAqIHVzZWQgdG8gbWFwIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdldFByb3BlcnRpZXM8VCA9IGFueT4ge1xuXHQocGF5bG9hZDogYW55LCBwcm9wZXJ0aWVzOiBUKTogVDtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBpbmplY3QgY29uZmlndXJhdGlvbiByZXF1aXJlZCBmb3IgdXNlIG9mIHRoZSBgaW5qZWN0YCBkZWNvcmF0b3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmplY3RDb25maWcge1xuXHQvKipcblx0ICogVGhlIGxhYmVsIG9mIHRoZSByZWdpc3RyeSBpbmplY3RvclxuXHQgKi9cblx0bmFtZTogUmVnaXN0cnlMYWJlbDtcblxuXHQvKipcblx0ICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHByb3BlcnR1ZXMgdG8gaW5qZWN0IHVzaW5nIHRoZSBwYXNzZWQgcHJvcGVydGllc1xuXHQgKiBhbmQgdGhlIGluamVjdGVkIHBheWxvYWQuXG5cdCAqL1xuXHRnZXRQcm9wZXJ0aWVzOiBHZXRQcm9wZXJ0aWVzO1xufVxuXG4vKipcbiAqIERlY29yYXRvciByZXRyaWV2ZXMgYW4gaW5qZWN0b3IgZnJvbSBhbiBhdmFpbGFibGUgcmVnaXN0cnkgdXNpbmcgdGhlIG5hbWUgYW5kXG4gKiBjYWxscyB0aGUgYGdldFByb3BlcnRpZXNgIGZ1bmN0aW9uIHdpdGggdGhlIHBheWxvYWQgZnJvbSB0aGUgaW5qZWN0b3JcbiAqIGFuZCBjdXJyZW50IHByb3BlcnRpZXMgd2l0aCB0aGUgdGhlIGluamVjdGVkIHByb3BlcnRpZXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIEluamVjdENvbmZpZyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdCh7IG5hbWUsIGdldFByb3BlcnRpZXMgfTogSW5qZWN0Q29uZmlnKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHRiZWZvcmVQcm9wZXJ0aWVzKGZ1bmN0aW9uKHRoaXM6IFdpZGdldEJhc2UsIHByb3BlcnRpZXM6IGFueSkge1xuXHRcdFx0Y29uc3QgaW5qZWN0b3IgPSB0aGlzLnJlZ2lzdHJ5LmdldEluamVjdG9yKG5hbWUpO1xuXHRcdFx0aWYgKGluamVjdG9yKSB7XG5cdFx0XHRcdGNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnMgPSByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLmdldCh0aGlzKSB8fCBbXTtcblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmVnaXN0ZXJlZEluamVjdG9yc01hcC5zZXQodGhpcywgcmVnaXN0ZXJlZEluamVjdG9ycyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMuaW5kZXhPZihpbmplY3RvcikgPT09IC0xKSB7XG5cdFx0XHRcdFx0aW5qZWN0b3Iub24oJ2ludmFsaWRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWdpc3RlcmVkSW5qZWN0b3JzLnB1c2goaW5qZWN0b3IpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yLmdldCgpLCBwcm9wZXJ0aWVzKTtcblx0XHRcdH1cblx0XHR9KSh0YXJnZXQpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5qZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGluamVjdC50cyIsImltcG9ydCB7IFByb3BlcnR5Q2hhbmdlUmVjb3JkIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcblxuZnVuY3Rpb24gaXNPYmplY3RPckFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiB0cnVlLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWdub3JlKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiBmYWxzZSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogcHJldmlvdXNQcm9wZXJ0eSAhPT0gbmV3UHJvcGVydHksXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93KHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0bGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuXHRjb25zdCB2YWxpZE9sZFByb3BlcnR5ID0gcHJldmlvdXNQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkocHJldmlvdXNQcm9wZXJ0eSk7XG5cdGNvbnN0IHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xuXG5cdGlmICghdmFsaWRPbGRQcm9wZXJ0eSB8fCAhdmFsaWROZXdQcm9wZXJ0eSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjaGFuZ2VkOiB0cnVlLFxuXHRcdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdFx0fTtcblx0fVxuXG5cdGNvbnN0IHByZXZpb3VzS2V5cyA9IE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydHkpO1xuXHRjb25zdCBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xuXG5cdGlmIChwcmV2aW91c0tleXMubGVuZ3RoICE9PSBuZXdLZXlzLmxlbmd0aCkge1xuXHRcdGNoYW5nZWQgPSB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdGNoYW5nZWQgPSBuZXdLZXlzLnNvbWUoKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0bGV0IHJlc3VsdDtcblx0aWYgKHR5cGVvZiBuZXdQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChuZXdQcm9wZXJ0eS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSkge1xuXHRcdFx0cmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KSkge1xuXHRcdHJlc3VsdCA9IHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkaWZmLnRzIiwiaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IGNyZWF0ZUhhbmRsZSB9IGZyb20gJ0Bkb2pvL2NvcmUvbGFuZyc7XG5pbXBvcnQgeyBIYW5kbGUgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IGNzc1RyYW5zaXRpb25zIGZyb20gJy4uL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIEROb2RlLCBQcm9qZWN0aW9uLCBQcm9qZWN0aW9uT3B0aW9ucyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGFmdGVyUmVuZGVyIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyJztcbmltcG9ydCB7IHYgfSBmcm9tICcuLy4uL2QnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4vLi4vdmRvbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYXR0YWNoIHN0YXRlIG9mIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gUHJvamVjdG9yQXR0YWNoU3RhdGUge1xuXHRBdHRhY2hlZCA9IDEsXG5cdERldGFjaGVkXG59XG5cbi8qKlxuICogQXR0YWNoIHR5cGUgZm9yIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IGVudW0gQXR0YWNoVHlwZSB7XG5cdEFwcGVuZCA9IDEsXG5cdE1lcmdlID0gMlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF0dGFjaE9wdGlvbnMge1xuXHQvKipcblx0ICogSWYgYCdhcHBlbmQnYCBpdCB3aWxsIGFwcGVuZGVkIHRvIHRoZSByb290LiBJZiBgJ21lcmdlJ2AgaXQgd2lsbCBtZXJnZWQgd2l0aCB0aGUgcm9vdC4gSWYgYCdyZXBsYWNlJ2AgaXQgd2lsbFxuXHQgKiByZXBsYWNlIHRoZSByb290LlxuXHQgKi9cblx0dHlwZTogQXR0YWNoVHlwZTtcblxuXHQvKipcblx0ICogRWxlbWVudCB0byBhdHRhY2ggdGhlIHByb2plY3Rvci5cblx0ICovXG5cdHJvb3Q/OiBFbGVtZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3RvclByb3BlcnRpZXMge1xuXHRyZWdpc3RyeT86IFJlZ2lzdHJ5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3Rvck1peGluPFA+IHtcblx0cmVhZG9ubHkgcHJvcGVydGllczogUmVhZG9ubHk8UD4gJiBSZWFkb25seTxQcm9qZWN0b3JQcm9wZXJ0aWVzPjtcblxuXHQvKipcblx0ICogQXBwZW5kIHRoZSBwcm9qZWN0b3IgdG8gdGhlIHJvb3QuXG5cdCAqL1xuXHRhcHBlbmQocm9vdD86IEVsZW1lbnQpOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIE1lcmdlIHRoZSBwcm9qZWN0b3Igb250byB0aGUgcm9vdC5cblx0ICpcblx0ICogVGhlIGByb290YCBhbmQgYW55IG9mIGl0cyBgY2hpbGRyZW5gIHdpbGwgYmUgcmUtdXNlZC4gIEFueSBleGNlc3MgRE9NIG5vZGVzIHdpbGwgYmUgaWdub3JlZCBhbmQgYW55IG1pc3NpbmcgRE9NIG5vZGVzXG5cdCAqIHdpbGwgYmUgY3JlYXRlZC5cblx0ICogQHBhcmFtIHJvb3QgVGhlIHJvb3QgZWxlbWVudCB0aGF0IHRoZSByb290IHZpcnR1YWwgRE9NIG5vZGUgd2lsbCBiZSBtZXJnZWQgd2l0aC4gIERlZmF1bHRzIHRvIGBkb2N1bWVudC5ib2R5YC5cblx0ICovXG5cdG1lcmdlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlO1xuXG5cdC8qKlxuXHQgKiBBdHRhY2ggdGhlIHByb2plY3QgdG8gYSBfc2FuZGJveGVkXyBkb2N1bWVudCBmcmFnbWVudCB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBET00uXG5cdCAqXG5cdCAqIFdoZW4gc2FuZGJveGVkLCB0aGUgYFByb2plY3RvcmAgd2lsbCBydW4gaW4gYSBzeW5jIG1hbm5lciwgd2hlcmUgcmVuZGVycyBhcmUgY29tcGxldGVkIHdpdGhpbiB0aGUgc2FtZSB0dXJuLlxuXHQgKiBUaGUgYFByb2plY3RvcmAgY3JlYXRlcyBhIGBEb2N1bWVudEZyYWdtZW50YCB3aGljaCByZXBsYWNlcyBhbnkgb3RoZXIgYHJvb3RgIHRoYXQgaGFzIGJlZW4gc2V0LlxuXHQgKiBAcGFyYW0gZG9jIFRoZSBgRG9jdW1lbnRgIHRvIHVzZSwgd2hpY2ggZGVmYXVsdHMgdG8gdGhlIGdsb2JhbCBgZG9jdW1lbnRgLlxuXHQgKi9cblx0c2FuZGJveChkb2M/OiBEb2N1bWVudCk6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHByb3BlcnRpZXMgZm9yIHRoZSB3aWRnZXQuIFJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIHRoZSBkaWZmaW5nIGZ1bmN0aW9ucyBmb3IgdGhlIHByb3BlcnRpZXMgYWdhaW5zdCB0aGVcblx0ICogcHJldmlvdXMgcHJvcGVydGllcy4gUnVucyB0aG91Z2ggYW55IHJlZ2lzdGVyZWQgc3BlY2lmaWMgcHJvcGVydHkgZGlmZiBmdW5jdGlvbnMgY29sbGVjdGluZyB0aGUgcmVzdWx0cyBhbmQgdGhlblxuXHQgKiBydW5zIHRoZSByZW1haW5kZXIgdGhyb3VnaCB0aGUgY2F0Y2ggYWxsIGRpZmYgZnVuY3Rpb24uIFRoZSBhZ2dyZWdhdGUgb2YgdGhlIHR3byBzZXRzIG9mIHRoZSByZXN1bHRzIGlzIHRoZW5cblx0ICogc2V0IGFzIHRoZSB3aWRnZXQncyBwcm9wZXJ0aWVzXG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBuZXcgd2lkZ2V0IHByb3BlcnRpZXNcblx0ICovXG5cdHNldFByb3BlcnRpZXMocHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZDtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgd2lkZ2V0J3MgY2hpbGRyZW5cblx0ICovXG5cdHNldENoaWxkcmVuKGNoaWxkcmVuOiBETm9kZVtdKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGEgYHN0cmluZ2AgdGhhdCByZXByZXNlbnRzIHRoZSBIVE1MIG9mIHRoZSBjdXJyZW50IHByb2plY3Rpb24uICBUaGUgcHJvamVjdG9yIG5lZWRzIHRvIGJlIGF0dGFjaGVkLlxuXHQgKi9cblx0dG9IdG1sKCk6IHN0cmluZztcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIHRoZSBwcm9qZWN0b3JzIGlzIGluIGFzeW5jIG1vZGUsIGNvbmZpZ3VyZWQgdG8gYHRydWVgIGJ5IGRlZmF1bHRzLlxuXHQgKi9cblx0YXN5bmM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFJvb3QgZWxlbWVudCB0byBhdHRhY2ggdGhlIHByb2plY3RvclxuXHQgKi9cblx0cm9vdDogRWxlbWVudDtcblxuXHQvKipcblx0ICogVGhlIHN0YXR1cyBvZiB0aGUgcHJvamVjdG9yXG5cdCAqL1xuXHRyZWFkb25seSBwcm9qZWN0b3JTdGF0ZTogUHJvamVjdG9yQXR0YWNoU3RhdGU7XG5cblx0LyoqXG5cdCAqIFJ1bnMgcmVnaXN0ZXJlZCBkZXN0cm95IGhhbmRsZXNcblx0ICovXG5cdGRlc3Ryb3koKTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3Rvck1peGluPFAsIFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxXaWRnZXRCYXNlPFA+Pj4oQmFzZTogVCk6IFQgJiBDb25zdHJ1Y3RvcjxQcm9qZWN0b3JNaXhpbjxQPj4ge1xuXHRjbGFzcyBQcm9qZWN0b3IgZXh0ZW5kcyBCYXNlIHtcblx0XHRwdWJsaWMgcHJvamVjdG9yU3RhdGU6IFByb2plY3RvckF0dGFjaFN0YXRlO1xuXHRcdHB1YmxpYyBwcm9wZXJ0aWVzOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFByb2plY3RvclByb3BlcnRpZXM+O1xuXG5cdFx0cHJpdmF0ZSBfcm9vdDogRWxlbWVudDtcblx0XHRwcml2YXRlIF9hc3luYyA9IHRydWU7XG5cdFx0cHJpdmF0ZSBfYXR0YWNoSGFuZGxlOiBIYW5kbGU7XG5cdFx0cHJpdmF0ZSBfcHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+O1xuXHRcdHByaXZhdGUgX3Byb2plY3Rpb246IFByb2plY3Rpb24gfCB1bmRlZmluZWQ7XG5cdFx0cHJpdmF0ZSBfcHJvamVjdG9yUHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddID0ge30gYXMgdGhpc1sncHJvcGVydGllcyddO1xuXHRcdHByaXZhdGUgX2hhbmRsZXM6IEZ1bmN0aW9uW10gPSBbXTtcblxuXHRcdGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRzdXBlciguLi5hcmdzKTtcblxuXHRcdFx0dGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5yb290ID0gZG9jdW1lbnQuYm9keTtcblx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcblx0XHR9XG5cblx0XHRwdWJsaWMgYXBwZW5kKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBtZXJnZShyb290PzogRWxlbWVudCk6IEhhbmRsZSB7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHR0eXBlOiBBdHRhY2hUeXBlLk1lcmdlLFxuXHRcdFx0XHRyb290XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXQgcm9vdChyb290OiBFbGVtZW50KSB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSByb290IGVsZW1lbnQnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3Jvb3QgPSByb290O1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgcm9vdCgpOiBFbGVtZW50IHtcblx0XHRcdHJldHVybiB0aGlzLl9yb290O1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQgYXN5bmMoKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYXN5bmM7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNldCBhc3luYyhhc3luYzogYm9vbGVhbikge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjaGFuZ2UgYXN5bmMgbW9kZScpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYXN5bmMgPSBhc3luYztcblx0XHR9XG5cblx0XHRwdWJsaWMgc2FuZGJveChkb2M6IERvY3VtZW50ID0gZG9jdW1lbnQpOiB2b2lkIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY3JlYXRlIHNhbmRib3gnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2FzeW5jID0gZmFsc2U7XG5cdFx0XHRjb25zdCBwcmV2aW91c1Jvb3QgPSB0aGlzLnJvb3Q7XG5cblx0XHRcdC8qIGZyZWUgdXAgdGhlIGRvY3VtZW50IGZyYWdtZW50IGZvciBHQyAqL1xuXHRcdFx0dGhpcy5vd24oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuX2F0dGFjaCh7XG5cdFx0XHRcdC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cblx0XHRcdFx0cm9vdDogZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSBhcyBhbnksXG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEROb2RlW10pOiB2b2lkIHtcblx0XHRcdHRoaXMuX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkIHtcblx0XHRcdHRoaXMuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIF9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdFx0aWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgJiYgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSAhPT0gcHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0gYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcblx0XHRcdHN1cGVyLl9fc2V0Q29yZVByb3BlcnRpZXNfXyh7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcblx0XHRcdHN1cGVyLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyB0b0h0bWwoKTogc3RyaW5nIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBpcyBub3QgYXR0YWNoZWQsIGNhbm5vdCByZXR1cm4gYW4gSFRNTCBzdHJpbmcgb2YgcHJvamVjdGlvbi4nKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodGhpcy5fcHJvamVjdGlvbi5kb21Ob2RlLmNoaWxkTm9kZXNbMF0gYXMgRWxlbWVudCkub3V0ZXJIVE1MO1xuXHRcdH1cblxuXHRcdEBhZnRlclJlbmRlcigpXG5cdFx0cHVibGljIGFmdGVyUmVuZGVyKHJlc3VsdDogRE5vZGUpIHtcblx0XHRcdGxldCBub2RlID0gcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnIHx8IHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRub2RlID0gdignc3BhbicsIHt9LCBbcmVzdWx0XSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgb3duKGhhbmRsZTogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRcdHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBkZXN0cm95KCkge1xuXHRcdFx0d2hpbGUgKHRoaXMuX2hhbmRsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb25zdCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzLnBvcCgpO1xuXHRcdFx0XHRpZiAoaGFuZGxlKSB7XG5cdFx0XHRcdFx0aGFuZGxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIF9hdHRhY2goeyB0eXBlLCByb290IH06IEF0dGFjaE9wdGlvbnMpOiBIYW5kbGUge1xuXHRcdFx0aWYgKHJvb3QpIHtcblx0XHRcdFx0dGhpcy5yb290ID0gcm9vdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2hIYW5kbGU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZDtcblxuXHRcdFx0Y29uc3QgaGFuZGxlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5vd24oaGFuZGxlKTtcblx0XHRcdHRoaXMuX2F0dGFjaEhhbmRsZSA9IGNyZWF0ZUhhbmRsZShoYW5kbGUpO1xuXG5cdFx0XHR0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4udGhpcy5fcHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgc3luYzogIXRoaXMuX2FzeW5jIH0gfTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgQXR0YWNoVHlwZS5BcHBlbmQ6XG5cdFx0XHRcdFx0dGhpcy5fcHJvamVjdGlvbiA9IGRvbS5hcHBlbmQodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gZG9tLm1lcmdlKHRoaXMucm9vdCwgdGhpcywgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBQcm9qZWN0b3I7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rvck1peGluO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFByb2plY3Rvci50cyIsImltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzLCBTdXBwb3J0ZWRDbGFzc05hbWUgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi8uLi9JbmplY3Rvcic7XG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaW5qZWN0JztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuLy4uL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBkaWZmUHJvcGVydHkgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5JztcbmltcG9ydCB7IHNoYWxsb3cgfSBmcm9tICcuLy4uL2RpZmYnO1xuXG4vKipcbiAqIEEgbG9va3VwIG9iamVjdCBmb3IgYXZhaWxhYmxlIGNsYXNzIG5hbWVzXG4gKi9cbmV4cG9ydCB0eXBlIENsYXNzTmFtZXMgPSB7XG5cdFtrZXk6IHN0cmluZ106IHN0cmluZztcbn07XG5cbi8qKlxuICogQSBsb29rdXAgb2JqZWN0IGZvciBhdmFpbGFibGUgd2lkZ2V0IGNsYXNzZXMgbmFtZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZSB7XG5cdFtrZXk6IHN0cmluZ106IG9iamVjdDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHJlcXVpcmVkIGZvciB0aGUgVGhlbWVkIG1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkUHJvcGVydGllczxUID0gQ2xhc3NOYW1lcz4gZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0aW5qZWN0ZWRUaGVtZT86IGFueTtcblx0dGhlbWU/OiBUaGVtZTtcblx0ZXh0cmFDbGFzc2VzPzogeyBbUCBpbiBrZXlvZiBUXT86IHN0cmluZyB9O1xufVxuXG5jb25zdCBUSEVNRV9LRVkgPSAnIF9rZXknO1xuXG5leHBvcnQgY29uc3QgSU5KRUNURURfVEhFTUVfS0VZID0gU3ltYm9sKCd0aGVtZScpO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIFRoZW1lZE1peGluXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVkTWl4aW48VCA9IENsYXNzTmFtZXM+IHtcblx0dGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKTogU3VwcG9ydGVkQ2xhc3NOYW1lO1xuXHR0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWVbXSk6IFN1cHBvcnRlZENsYXNzTmFtZVtdO1xuXHRwcm9wZXJ0aWVzOiBUaGVtZWRQcm9wZXJ0aWVzPFQ+O1xufVxuXG4vKipcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodGhlbWU6IHt9KSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnLCB0aGVtZSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZXZlcnNlIGxvb2t1cCBmb3IgdGhlIGNsYXNzZXMgcGFzc2VkIGluIHZpYSB0aGUgYHRoZW1lYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XG4gKiBAcmVxdWlyZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXM6IENsYXNzTmFtZXNbXSk6IENsYXNzTmFtZXMge1xuXHRyZXR1cm4gY2xhc3Nlcy5yZWR1Y2UoXG5cdFx0KGN1cnJlbnRDbGFzc05hbWVzLCBiYXNlQ2xhc3MpID0+IHtcblx0XHRcdE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Y3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XG5cdFx0fSxcblx0XHQ8Q2xhc3NOYW1lcz57fVxuXHQpO1xufVxuXG4vKipcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxuICogaW5qZWN0b3IgaXMgZGVmaW5lZCBhZ2FpbnN0IHRoZSByZWdpc3RyeSwgcmV0dXJuaW5nIHRoZSB0aGVtZS5cbiAqXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxuICogQHBhcmFtIHRoZW1lUmVnaXN0cnkgcmVnaXN0cnkgdG8gZGVmaW5lIHRoZSB0aGVtZSBpbmplY3RvciBhZ2FpbnN0LiBEZWZhdWx0c1xuICogdG8gdGhlIGdsb2JhbCByZWdpc3RyeVxuICpcbiAqIEByZXR1cm5zIHRoZSB0aGVtZSBpbmplY3RvciB1c2VkIHRvIHNldCB0aGUgdGhlbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGVtZTogYW55LCB0aGVtZVJlZ2lzdHJ5OiBSZWdpc3RyeSk6IEluamVjdG9yIHtcblx0Y29uc3QgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGVtZSk7XG5cdHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoSU5KRUNURURfVEhFTUVfS0VZLCB0aGVtZUluamVjdG9yKTtcblx0cmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY2xhc3MgZGVjb3JhdGVkIHdpdGggd2l0aCBUaGVtZWQgZnVuY3Rpb25hbGl0eVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBUaGVtZWRNaXhpbjxFLCBUIGV4dGVuZHMgQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxUaGVtZWRQcm9wZXJ0aWVzPEU+Pj4+KFxuXHRCYXNlOiBUXG4pOiBDb25zdHJ1Y3RvcjxUaGVtZWRNaXhpbjxFPj4gJiBUIHtcblx0QGluamVjdCh7XG5cdFx0bmFtZTogSU5KRUNURURfVEhFTUVfS0VZLFxuXHRcdGdldFByb3BlcnRpZXM6ICh0aGVtZTogVGhlbWUsIHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXMpOiBUaGVtZWRQcm9wZXJ0aWVzID0+IHtcblx0XHRcdGlmICghcHJvcGVydGllcy50aGVtZSkge1xuXHRcdFx0XHRyZXR1cm4geyB0aGVtZSB9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHt9O1xuXHRcdH1cblx0fSlcblx0Y2xhc3MgVGhlbWVkIGV4dGVuZHMgQmFzZSB7XG5cdFx0cHVibGljIHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXM8RT47XG5cblx0XHQvKipcblx0XHQgKiBUaGUgVGhlbWVkIGJhc2VDbGFzc2VzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfcmVnaXN0ZXJlZEJhc2VUaGVtZTogQ2xhc3NOYW1lcztcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVyZWQgYmFzZSB0aGVtZSBrZXlzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXM6IHN0cmluZ1tdID0gW107XG5cblx0XHQvKipcblx0XHQgKiBSZXZlcnNlIGxvb2t1cCBvZiB0aGUgdGhlbWUgY2xhc3Nlc1xuXHRcdCAqL1xuXHRcdHByaXZhdGUgX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwOiBDbGFzc05hbWVzO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuXG5cdFx0LyoqXG5cdFx0ICogTG9hZGVkIHRoZW1lXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfdGhlbWU6IENsYXNzTmFtZXMgPSB7fTtcblxuXHRcdHB1YmxpYyB0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWU7XG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lW107XG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSB8IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lIHwgU3VwcG9ydGVkQ2xhc3NOYW1lW10ge1xuXHRcdFx0aWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xuXHRcdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcblx0XHRcdFx0cmV0dXJuIGNsYXNzZXMubWFwKChjbGFzc05hbWUpID0+IHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3NOYW1lKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc2VzKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBGdW5jdGlvbiBmaXJlZCB3aGVuIGB0aGVtZWAgb3IgYGV4dHJhQ2xhc3Nlc2AgYXJlIGNoYW5nZWQuXG5cdFx0ICovXG5cdFx0QGRpZmZQcm9wZXJ0eSgndGhlbWUnLCBzaGFsbG93KVxuXHRcdEBkaWZmUHJvcGVydHkoJ2V4dHJhQ2xhc3NlcycsIHNoYWxsb3cpXG5cdFx0cHJvdGVjdGVkIG9uUHJvcGVydGllc0NoYW5nZWQoKSB7XG5cdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldFRoZW1lQ2xhc3MoY2xhc3NOYW1lOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWUge1xuXHRcdFx0aWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gY2xhc3NOYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8ICh7fSBhcyBhbnkpO1xuXHRcdFx0Y29uc3QgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xuXHRcdFx0bGV0IHJlc3VsdENsYXNzTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdFx0XHRpZiAoIXRoZW1lQ2xhc3NOYW1lKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgQ2xhc3MgbmFtZTogJyR7Y2xhc3NOYW1lfScgbm90IGZvdW5kIGluIHRoZW1lYCk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSkge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pIHtcblx0XHRcdFx0cmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCkge1xuXHRcdFx0Y29uc3QgeyB0aGVtZSA9IHt9IH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cdFx0XHRjb25zdCBiYXNlVGhlbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2Jhc2VUaGVtZUNsYXNzZXMnKTtcblx0XHRcdGlmICghdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSkge1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpID0+IHtcblx0XHRcdFx0XHRjb25zdCB7IFtUSEVNRV9LRVldOiBrZXksIC4uLmNsYXNzZXMgfSA9IGJhc2VUaGVtZTtcblx0XHRcdFx0XHR0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0cmV0dXJuIHsgLi4uZmluYWxCYXNlVGhlbWUsIC4uLmNsYXNzZXMgfTtcblx0XHRcdFx0fSwge30pO1xuXHRcdFx0XHR0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cCA9IGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChiYXNlVGhlbWVzKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoKGJhc2VUaGVtZSwgdGhlbWVLZXkpID0+IHtcblx0XHRcdFx0cmV0dXJuIHsgLi4uYmFzZVRoZW1lLCAuLi50aGVtZVt0aGVtZUtleV0gfTtcblx0XHRcdH0sIHt9KTtcblxuXHRcdFx0dGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFRoZW1lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGhlbWVkTWl4aW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gVGhlbWVkLnRzIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBQcm9qZWN0b3JNaXhpbiB9IGZyb20gJy4vbWl4aW5zL1Byb2plY3Rvcic7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnQGRvam8vc2hpbS9hcnJheSc7XG5pbXBvcnQgeyB3LCBkb20gfSBmcm9tICcuL2QnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICdAZG9qby9zaGltL2dsb2JhbCc7XG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgeyByZWdpc3RlclRoZW1lSW5qZWN0b3IgfSBmcm9tICcuL21peGlucy9UaGVtZWQnO1xuXG5leHBvcnQgZW51bSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlIHtcblx0RE9KTyA9ICdET0pPJyxcblx0Tk9ERSA9ICdOT0RFJyxcblx0VEVYVCA9ICdURVhUJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGU6IEhUTUxFbGVtZW50KTogYW55IHtcblx0cmV0dXJuIGNsYXNzIERvbVRvV2lkZ2V0V3JhcHBlciBleHRlbmRzIFdpZGdldEJhc2U8YW55PiB7XG5cdFx0cHJvdGVjdGVkIHJlbmRlcigpIHtcblx0XHRcdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZShcblx0XHRcdFx0KHByb3BzLCBrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG5cdFx0XHRcdFx0aWYgKGtleS5pbmRleE9mKCdvbicpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRrZXkgPSBgX18ke2tleX1gO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwcm9wc1trZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuIHByb3BzO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7fSBhcyBhbnlcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gZG9tKHsgbm9kZTogZG9tTm9kZSwgcHJvcHM6IHByb3BlcnRpZXMgfSk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldCBkb21Ob2RlKCkge1xuXHRcdFx0cmV0dXJuIGRvbU5vZGU7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGRlc2NyaXB0b3I6IGFueSwgV2lkZ2V0Q29uc3RydWN0b3I6IGFueSk6IGFueSB7XG5cdGNvbnN0IHsgYXR0cmlidXRlcywgY2hpbGRUeXBlIH0gPSBkZXNjcmlwdG9yO1xuXHRjb25zdCBhdHRyaWJ1dGVNYXA6IGFueSA9IHt9O1xuXG5cdGF0dHJpYnV0ZXMuZm9yRWFjaCgocHJvcGVydHlOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0YXR0cmlidXRlTWFwW2F0dHJpYnV0ZU5hbWVdID0gcHJvcGVydHlOYW1lO1xuXHR9KTtcblxuXHRyZXR1cm4gY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdFx0cHJpdmF0ZSBfcHJvamVjdG9yOiBhbnk7XG5cdFx0cHJpdmF0ZSBfcHJvcGVydGllczogYW55ID0ge307XG5cdFx0cHJpdmF0ZSBfY2hpbGRyZW46IGFueVtdID0gW107XG5cdFx0cHJpdmF0ZSBfZXZlbnRQcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblx0XHRwcml2YXRlIF9pbml0aWFsaXNlZCA9IGZhbHNlO1xuXG5cdFx0cHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0aWYgKHRoaXMuX2luaXRpYWxpc2VkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZG9tUHJvcGVydGllczogYW55ID0ge307XG5cdFx0XHRjb25zdCB7IGF0dHJpYnV0ZXMsIHByb3BlcnRpZXMsIGV2ZW50cyB9ID0gZGVzY3JpcHRvcjtcblxuXHRcdFx0dGhpcy5fcHJvcGVydGllcyA9IHsgLi4udGhpcy5fcHJvcGVydGllcywgLi4udGhpcy5fYXR0cmlidXRlc1RvUHJvcGVydGllcyhhdHRyaWJ1dGVzKSB9O1xuXG5cdFx0XHRbLi4uYXR0cmlidXRlcywgLi4ucHJvcGVydGllc10uZm9yRWFjaCgocHJvcGVydHlOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSAodGhpcyBhcyBhbnkpW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdGNvbnN0IGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfXycpO1xuXHRcdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZG9tUHJvcGVydGllc1tmaWx0ZXJlZFByb3BlcnR5TmFtZV0gPSB7XG5cdFx0XHRcdFx0Z2V0OiAoKSA9PiB0aGlzLl9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuXHRcdFx0XHRcdHNldDogKHZhbHVlOiBhbnkpID0+IHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblxuXHRcdFx0ZXZlbnRzLmZvckVhY2goKHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGV2ZW50TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyZWRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJ19fb24nKTtcblxuXHRcdFx0XHRkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcblx0XHRcdFx0XHRnZXQ6ICgpID0+IHRoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKSxcblx0XHRcdFx0XHRzZXQ6ICh2YWx1ZTogYW55KSA9PiB0aGlzLl9zZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSB0aGlzLl9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRldmVudENhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoXG5cdFx0XHRcdFx0XHRuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG5cdFx0XHRcdFx0XHRcdGJ1YmJsZXM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRkZXRhaWw6IGFyZ3Ncblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBkb21Qcm9wZXJ0aWVzKTtcblxuXHRcdFx0Y29uc3QgY2hpbGRyZW4gPSBjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuVEVYVCA/IHRoaXMuY2hpbGROb2RlcyA6IHRoaXMuY2hpbGRyZW47XG5cblx0XHRcdGZyb20oY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTm9kZTogTm9kZSkgPT4ge1xuXHRcdFx0XHRpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcblx0XHRcdFx0XHRjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG5cdFx0XHRcdFx0Y2hpbGROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtY29ubmVjdGVkJywgKCkgPT4gdGhpcy5fcmVuZGVyKCkpO1xuXHRcdFx0XHRcdHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKGNoaWxkTm9kZSBhcyBIVE1MRWxlbWVudCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2NoaWxkcmVuLnB1c2goZG9tKHsgbm9kZTogY2hpbGROb2RlIGFzIEhUTUxFbGVtZW50IH0pKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCAoZTogYW55KSA9PiB0aGlzLl9jaGlsZENvbm5lY3RlZChlKSk7XG5cblx0XHRcdGNvbnN0IHdpZGdldFByb3BlcnRpZXMgPSB0aGlzLl9wcm9wZXJ0aWVzO1xuXHRcdFx0Y29uc3QgcmVuZGVyQ2hpbGRyZW4gPSAoKSA9PiB0aGlzLl9fY2hpbGRyZW5fXygpO1xuXHRcdFx0Y29uc3QgV3JhcHBlciA9IGNsYXNzIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG5cdFx0XHRcdHJlbmRlcigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdyhXaWRnZXRDb25zdHJ1Y3Rvciwgd2lkZ2V0UHJvcGVydGllcywgcmVuZGVyQ2hpbGRyZW4oKSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRjb25zdCByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuXHRcdFx0Y29uc3QgdGhlbWVDb250ZXh0ID0gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoaXMuX2dldFRoZW1lKCksIHJlZ2lzdHJ5KTtcblx0XHRcdGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdkb2pvLXRoZW1lLXNldCcsICgpID0+IHRoZW1lQ29udGV4dC5zZXQodGhpcy5fZ2V0VGhlbWUoKSkpO1xuXHRcdFx0Y29uc3QgUHJvamVjdG9yID0gUHJvamVjdG9yTWl4aW4oV3JhcHBlcik7XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3IgPSBuZXcgUHJvamVjdG9yKCk7XG5cdFx0XHR0aGlzLl9wcm9qZWN0b3Iuc2V0UHJvcGVydGllcyh7IHJlZ2lzdHJ5IH0pO1xuXHRcdFx0dGhpcy5fcHJvamVjdG9yLmFwcGVuZCh0aGlzKTtcblxuXHRcdFx0dGhpcy5faW5pdGlhbGlzZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KFxuXHRcdFx0XHRuZXcgQ3VzdG9tRXZlbnQoJ2Rvam8tY2UtY29ubmVjdGVkJywge1xuXHRcdFx0XHRcdGJ1YmJsZXM6IHRydWUsXG5cdFx0XHRcdFx0ZGV0YWlsOiB0aGlzXG5cdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldFRoZW1lKCkge1xuXHRcdFx0aWYgKGdsb2JhbCAmJiBnbG9iYWwuZG9qb2NlICYmIGdsb2JhbC5kb2pvY2UudGhlbWUpIHtcblx0XHRcdFx0cmV0dXJuIGdsb2JhbC5kb2pvY2UudGhlbWVzW2dsb2JhbC5kb2pvY2UudGhlbWVdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2NoaWxkQ29ubmVjdGVkKGU6IGFueSkge1xuXHRcdFx0Y29uc3Qgbm9kZSA9IGUuZGV0YWlsO1xuXHRcdFx0aWYgKG5vZGUucGFyZW50Tm9kZSA9PT0gdGhpcykge1xuXHRcdFx0XHRjb25zdCBleGlzdHMgPSB0aGlzLl9jaGlsZHJlbi5zb21lKChjaGlsZCkgPT4gY2hpbGQuZG9tTm9kZSA9PT0gbm9kZSk7XG5cdFx0XHRcdGlmICghZXhpc3RzKSB7XG5cdFx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLXJlbmRlcicsICgpID0+IHRoaXMuX3JlbmRlcigpKTtcblx0XHRcdFx0XHR0aGlzLl9jaGlsZHJlbi5wdXNoKERvbVRvV2lkZ2V0V3JhcHBlcihub2RlKSk7XG5cdFx0XHRcdFx0dGhpcy5fcmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIF9yZW5kZXIoKSB7XG5cdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yKSB7XG5cdFx0XHRcdHRoaXMuX3Byb2plY3Rvci5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRuZXcgQ3VzdG9tRXZlbnQoJ2Rvam8tY2UtcmVuZGVyJywge1xuXHRcdFx0XHRcdFx0YnViYmxlczogZmFsc2UsXG5cdFx0XHRcdFx0XHRkZXRhaWw6IHRoaXNcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHB1YmxpYyBfX3Byb3BlcnRpZXNfXygpIHtcblx0XHRcdHJldHVybiB7IC4uLnRoaXMuX3Byb3BlcnRpZXMsIC4uLnRoaXMuX2V2ZW50UHJvcGVydGllcyB9O1xuXHRcdH1cblxuXHRcdHB1YmxpYyBfX2NoaWxkcmVuX18oKSB7XG5cdFx0XHRpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuLmZpbHRlcigoQ2hpbGQpID0+IENoaWxkLmRvbU5vZGUuaXNXaWRnZXQpLm1hcCgoQ2hpbGQ6IGFueSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHsgZG9tTm9kZSB9ID0gQ2hpbGQ7XG5cdFx0XHRcdFx0cmV0dXJuIHcoQ2hpbGQsIHsgLi4uZG9tTm9kZS5fX3Byb3BlcnRpZXNfXygpIH0sIFsuLi5kb21Ob2RlLl9fY2hpbGRyZW5fXygpXSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHB1YmxpYyBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nIHwgbnVsbCwgdmFsdWU6IHN0cmluZyB8IG51bGwpIHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU1hcFtuYW1lXTtcblx0XHRcdHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX3NldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcblx0XHRcdHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdHRoaXMuX3JlbmRlcigpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2dldFByb3BlcnR5KHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlczogc3RyaW5nW10pIHtcblx0XHRcdHJldHVybiBhdHRyaWJ1dGVzLnJlZHVjZSgocHJvcGVydGllczogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zdCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwcm9wZXJ0aWVzO1xuXHRcdFx0fSwge30pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZU1hcCk7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBpc1dpZGdldCgpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKFdpZGdldENvbnN0cnVjdG9yOiBhbnkpOiB2b2lkIHtcblx0Y29uc3QgZGVzY3JpcHRvciA9IFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBXaWRnZXRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcjtcblxuXHRpZiAoIWRlc2NyaXB0b3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHQnQ2Fubm90IGdldCBkZXNjcmlwdG9yIGZvciBDdXN0b20gRWxlbWVudCwgaGF2ZSB5b3UgYWRkZWQgdGhlIEBjdXN0b21FbGVtZW50IGRlY29yYXRvciB0byB5b3VyIFdpZGdldD8nXG5cdFx0KTtcblx0fVxuXG5cdGdsb2JhbC5jdXN0b21FbGVtZW50cy5kZWZpbmUoZGVzY3JpcHRvci50YWdOYW1lLCBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICdAZG9qby9zaGltL2dsb2JhbCc7XG5pbXBvcnQge1xuXHRDb3JlUHJvcGVydGllcyxcblx0RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdEROb2RlLFxuXHRWTm9kZSxcblx0V05vZGUsXG5cdFByb2plY3Rpb25PcHRpb25zLFxuXHRQcm9qZWN0aW9uLFxuXHRTdXBwb3J0ZWRDbGFzc05hbWUsXG5cdFRyYW5zaXRpb25TdHJhdGVneSxcblx0Vk5vZGVQcm9wZXJ0aWVzXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBmcm9tIGFzIGFycmF5RnJvbSB9IGZyb20gJ0Bkb2pvL3NoaW0vYXJyYXknO1xuaW1wb3J0IHsgaXNXTm9kZSwgaXNWTm9kZSwgVk5PREUsIFdOT0RFIH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5cbmNvbnN0IE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xuY29uc3QgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XG5jb25zdCBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XG5cbmNvbnN0IGVtcHR5QXJyYXk6IChJbnRlcm5hbFdOb2RlIHwgSW50ZXJuYWxWTm9kZSlbXSA9IFtdO1xuXG5leHBvcnQgdHlwZSBSZW5kZXJSZXN1bHQgPSBETm9kZTxhbnk+IHwgRE5vZGU8YW55PltdO1xuXG5pbnRlcmZhY2UgSW5zdGFuY2VNYXBEYXRhIHtcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGU7XG5cdGRub2RlOiBJbnRlcm5hbFdOb2RlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsV05vZGUgZXh0ZW5kcyBXTm9kZTxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4ge1xuXHQvKipcblx0ICogVGhlIGluc3RhbmNlIG9mIHRoZSB3aWRnZXRcblx0ICovXG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZTtcblxuXHQvKipcblx0ICogVGhlIHJlbmRlcmVkIEROb2RlcyBmcm9tIHRoZSBpbnN0YW5jZVxuXHQgKi9cblx0cmVuZGVyZWQ6IEludGVybmFsRE5vZGVbXTtcblxuXHQvKipcblx0ICogQ29yZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgYnkgdGhlIHdpZGdldCBjb3JlIHN5c3RlbVxuXHQgKi9cblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFdOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVybmFsVk5vZGUgZXh0ZW5kcyBWTm9kZSB7XG5cdC8qKlxuXHQgKiBDaGlsZHJlbiBmb3IgdGhlIFZOb2RlXG5cdCAqL1xuXHRjaGlsZHJlbj86IEludGVybmFsRE5vZGVbXTtcblxuXHRpbnNlcnRlZD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEJhZyB1c2VkIHRvIHN0aWxsIGRlY29yYXRlIHByb3BlcnRpZXMgb24gYSBkZWZlcnJlZCBwcm9wZXJ0aWVzIGNhbGxiYWNrXG5cdCAqL1xuXHRkZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXM7XG5cblx0LyoqXG5cdCAqIERPTSBlbGVtZW50XG5cdCAqL1xuXHRkb21Ob2RlPzogRWxlbWVudCB8IFRleHQ7XG59XG5cbmV4cG9ydCB0eXBlIEludGVybmFsRE5vZGUgPSBJbnRlcm5hbFZOb2RlIHwgSW50ZXJuYWxXTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJRdWV1ZSB7XG5cdGluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZTtcblx0ZGVwdGg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXaWRnZXREYXRhIHtcblx0b25EZXRhY2g6ICgpID0+IHZvaWQ7XG5cdG9uQXR0YWNoOiAoKSA9PiB2b2lkO1xuXHRkaXJ0eTogYm9vbGVhbjtcblx0cmVnaXN0cnk6ICgpID0+IFJlZ2lzdHJ5SGFuZGxlcjtcblx0bm9kZUhhbmRsZXI6IE5vZGVIYW5kbGVyO1xuXHRjb3JlUHJvcGVydGllczogQ29yZVByb3BlcnRpZXM7XG5cdGludmFsaWRhdGU/OiBGdW5jdGlvbjtcblx0cmVuZGVyaW5nOiBib29sZWFuO1xuXHRpbnB1dFByb3BlcnRpZXM6IGFueTtcbn1cblxuZXhwb3J0IGNvbnN0IHdpZGdldEluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBXaWRnZXREYXRhPigpO1xuXG5jb25zdCBpbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLCBJbnN0YW5jZU1hcERhdGE+KCk7XG5jb25zdCByZW5kZXJRdWV1ZU1hcCA9IG5ldyBXZWFrTWFwPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLCBSZW5kZXJRdWV1ZVtdPigpO1xuXG5mdW5jdGlvbiBzYW1lKGRub2RlMTogSW50ZXJuYWxETm9kZSwgZG5vZGUyOiBJbnRlcm5hbEROb2RlKSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlMSkgJiYgaXNWTm9kZShkbm9kZTIpKSB7XG5cdFx0aWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2UgaWYgKGlzV05vZGUoZG5vZGUxKSAmJiBpc1dOb2RlKGRub2RlMikpIHtcblx0XHRpZiAoZG5vZGUxLndpZGdldENvbnN0cnVjdG9yICE9PSBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKCdQcm92aWRlIGEgdHJhbnNpdGlvbnMgb2JqZWN0IHRvIHRoZSBwcm9qZWN0aW9uT3B0aW9ucyB0byBkbyBhbmltYXRpb25zJyk7XG59O1xuXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhcblx0cHJvamVjdG9yT3B0aW9uczogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz4sXG5cdHByb2plY3Rvckluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZVxuKTogUHJvamVjdGlvbk9wdGlvbnMge1xuXHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRuYW1lc3BhY2U6IHVuZGVmaW5lZCxcblx0XHRzdHlsZUFwcGx5ZXI6IGZ1bmN0aW9uKGRvbU5vZGU6IEhUTUxFbGVtZW50LCBzdHlsZU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdFx0KGRvbU5vZGUuc3R5bGUgYXMgYW55KVtzdHlsZU5hbWVdID0gdmFsdWU7XG5cdFx0fSxcblx0XHR0cmFuc2l0aW9uczoge1xuXHRcdFx0ZW50ZXI6IG1pc3NpbmdUcmFuc2l0aW9uLFxuXHRcdFx0ZXhpdDogbWlzc2luZ1RyYW5zaXRpb25cblx0XHR9LFxuXHRcdGRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzOiBbXSxcblx0XHRhZnRlclJlbmRlckNhbGxiYWNrczogW10sXG5cdFx0bm9kZU1hcDogbmV3IFdlYWtNYXAoKSxcblx0XHRkZXB0aDogMCxcblx0XHRtZXJnZTogZmFsc2UsXG5cdFx0cmVuZGVyU2NoZWR1bGVkOiB1bmRlZmluZWQsXG5cdFx0cmVuZGVyUXVldWU6IFtdLFxuXHRcdHByb2plY3Rvckluc3RhbmNlXG5cdH07XG5cdHJldHVybiB7IC4uLmRlZmF1bHRzLCAuLi5wcm9qZWN0b3JPcHRpb25zIH0gYXMgUHJvamVjdGlvbk9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlOiBPYmplY3QpIHtcblx0aWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignU3R5bGUgdmFsdWVzIG11c3QgYmUgc3RyaW5ncycpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUV2ZW50KFxuXHRkb21Ob2RlOiBOb2RlLFxuXHRldmVudE5hbWU6IHN0cmluZyxcblx0Y3VycmVudFZhbHVlOiBGdW5jdGlvbixcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRiaW5kOiBhbnksXG5cdHByZXZpb3VzVmFsdWU/OiBGdW5jdGlvblxuKSB7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSkgfHwgbmV3IFdlYWtNYXAoKTtcblxuXHRpZiAocHJldmlvdXNWYWx1ZSkge1xuXHRcdGNvbnN0IHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XG5cdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XG5cdH1cblxuXHRsZXQgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChiaW5kKTtcblxuXHRpZiAoZXZlbnROYW1lID09PSAnaW5wdXQnKSB7XG5cdFx0Y2FsbGJhY2sgPSBmdW5jdGlvbih0aGlzOiBhbnksIGV2dDogRXZlbnQpIHtcblx0XHRcdGN1cnJlbnRWYWx1ZS5jYWxsKHRoaXMsIGV2dCk7XG5cdFx0XHQoZXZ0LnRhcmdldCBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ10gPSAoZXZ0LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcblx0XHR9LmJpbmQoYmluZCk7XG5cdH1cblxuXHRkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdGV2ZW50TWFwLnNldChjdXJyZW50VmFsdWUsIGNhbGxiYWNrKTtcblx0cHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5zZXQoZG9tTm9kZSwgZXZlbnRNYXApO1xufVxuXG5mdW5jdGlvbiBhZGRDbGFzc2VzKGRvbU5vZGU6IEVsZW1lbnQsIGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSkge1xuXHRpZiAoY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRkb21Ob2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lc1tpXSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoZG9tTm9kZTogRWxlbWVudCwgY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lKSB7XG5cdGlmIChjbGFzc2VzKSB7XG5cdFx0Y29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVzW2ldKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYnVpbGRQcmV2aW91c1Byb3BlcnRpZXMoZG9tTm9kZTogYW55LCBwcmV2aW91czogSW50ZXJuYWxWTm9kZSwgY3VycmVudDogSW50ZXJuYWxWTm9kZSkge1xuXHRjb25zdCB7IGRpZmZUeXBlLCBwcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzIH0gPSBjdXJyZW50O1xuXHRpZiAoIWRpZmZUeXBlIHx8IGRpZmZUeXBlID09PSAndmRvbScpIHtcblx0XHRyZXR1cm4geyBwcm9wZXJ0aWVzOiBwcmV2aW91cy5wcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzOiBwcmV2aW91cy5hdHRyaWJ1dGVzLCBldmVudHM6IHByZXZpb3VzLmV2ZW50cyB9O1xuXHR9IGVsc2UgaWYgKGRpZmZUeXBlID09PSAnbm9uZScpIHtcblx0XHRyZXR1cm4geyBwcm9wZXJ0aWVzOiB7fSwgYXR0cmlidXRlczogcHJldmlvdXMuYXR0cmlidXRlcyA/IHt9IDogdW5kZWZpbmVkLCBldmVudHM6IHByZXZpb3VzLmV2ZW50cyB9O1xuXHR9XG5cdGxldCBuZXdQcm9wZXJ0aWVzOiBhbnkgPSB7XG5cdFx0cHJvcGVydGllczoge31cblx0fTtcblx0aWYgKGF0dHJpYnV0ZXMpIHtcblx0XHRuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSB7fTtcblx0XHRuZXdQcm9wZXJ0aWVzLmV2ZW50cyA9IHByZXZpb3VzLmV2ZW50cztcblx0XHRPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0bmV3UHJvcGVydGllcy5wcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IGRvbU5vZGVbcHJvcE5hbWVdO1xuXHRcdH0pO1xuXHRcdE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goKGF0dHJOYW1lKSA9PiB7XG5cdFx0XHRuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXNbYXR0ck5hbWVdID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdQcm9wZXJ0aWVzO1xuXHR9XG5cdG5ld1Byb3BlcnRpZXMucHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLnJlZHVjZShcblx0XHQocHJvcHMsIHByb3BlcnR5KSA9PiB7XG5cdFx0XHRwcm9wc1twcm9wZXJ0eV0gPSBkb21Ob2RlLmdldEF0dHJpYnV0ZShwcm9wZXJ0eSkgfHwgZG9tTm9kZVtwcm9wZXJ0eV07XG5cdFx0XHRyZXR1cm4gcHJvcHM7XG5cdFx0fSxcblx0XHR7fSBhcyBhbnlcblx0KTtcblx0cmV0dXJuIG5ld1Byb3BlcnRpZXM7XG59XG5cbmZ1bmN0aW9uIGZvY3VzTm9kZShwcm9wVmFsdWU6IGFueSwgcHJldmlvdXNWYWx1ZTogYW55LCBkb21Ob2RlOiBFbGVtZW50LCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpOiB2b2lkIHtcblx0bGV0IHJlc3VsdDtcblx0aWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXN1bHQgPSBwcm9wVmFsdWUoKTtcblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSBwcm9wVmFsdWUgJiYgIXByZXZpb3VzVmFsdWU7XG5cdH1cblx0aWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuXHRcdHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0KGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdHByZXZpb3VzUHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0b25seUV2ZW50czogYm9vbGVhbiA9IGZhbHNlXG4pIHtcblx0Y29uc3QgZXZlbnRNYXAgPSBwcm9qZWN0aW9uT3B0aW9ucy5ub2RlTWFwLmdldChkb21Ob2RlKTtcblx0aWYgKGV2ZW50TWFwKSB7XG5cdFx0T2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0Y29uc3QgaXNFdmVudCA9IHByb3BOYW1lLnN1YnN0cigwLCAyKSA9PT0gJ29uJyB8fCBvbmx5RXZlbnRzO1xuXHRcdFx0Y29uc3QgZXZlbnROYW1lID0gb25seUV2ZW50cyA/IHByb3BOYW1lIDogcHJvcE5hbWUuc3Vic3RyKDIpO1xuXHRcdFx0aWYgKGlzRXZlbnQgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XG5cdFx0XHRcdGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XG5cdFx0XHRcdGlmIChldmVudENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZTogRWxlbWVudCwgYXR0ck5hbWU6IHN0cmluZywgYXR0clZhbHVlOiBzdHJpbmcsIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIGF0dHJOYW1lID09PSAnaHJlZicpIHtcblx0XHRkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG5cdH0gZWxzZSBpZiAoKGF0dHJOYW1lID09PSAncm9sZScgJiYgYXR0clZhbHVlID09PSAnJykgfHwgYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cdH0gZWxzZSB7XG5cdFx0ZG9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlcyhcblx0ZG9tTm9kZTogRWxlbWVudCxcblx0cHJldmlvdXNBdHRyaWJ1dGVzOiB7IFtpbmRleDogc3RyaW5nXTogc3RyaW5nIH0sXG5cdGF0dHJpYnV0ZXM6IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0Y29uc3QgYXR0ck5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IGF0dHJDb3VudCA9IGF0dHJOYW1lcy5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcblx0XHRjb25zdCBhdHRyTmFtZSA9IGF0dHJOYW1lc1tpXTtcblx0XHRjb25zdCBhdHRyVmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJOYW1lXTtcblx0XHRjb25zdCBwcmV2aW91c0F0dHJWYWx1ZSA9IHByZXZpb3VzQXR0cmlidXRlc1thdHRyTmFtZV07XG5cdFx0aWYgKGF0dHJWYWx1ZSAhPT0gcHJldmlvdXNBdHRyVmFsdWUpIHtcblx0XHRcdHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVByb3BlcnRpZXMoXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdHByZXZpb3VzUHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0aW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzID0gdHJ1ZVxuKSB7XG5cdGxldCBwcm9wZXJ0aWVzVXBkYXRlZCA9IGZhbHNlO1xuXHRjb25zdCBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0Y29uc3QgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcblx0aWYgKHByb3BOYW1lcy5pbmRleE9mKCdjbGFzc2VzJykgPT09IC0xICYmIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcblx0XHR9XG5cdH1cblxuXHRpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgJiYgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuXHRcdGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0XHRjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzIVtwcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xuXHRcdFx0Y29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcblx0XHRcdGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IG5ld0NsYXNzZXM6IChudWxsIHwgdW5kZWZpbmVkIHwgc3RyaW5nKVtdID0gWy4uLmN1cnJlbnRDbGFzc2VzXTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV07XG5cdFx0XHRcdFx0XHRpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0YWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcblx0XHRcdGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xuXHRcdFx0Y29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG5cdFx0XHRjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuXHRcdFx0XHRjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuXHRcdFx0XHRjb25zdCBuZXdTdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGNvbnN0IG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlICYmIHByZXZpb3VzVmFsdWVbc3R5bGVOYW1lXTtcblx0XHRcdFx0aWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdGlmIChuZXdTdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKG5ld1N0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIhKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIHN0eWxlTmFtZSwgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRwcm9wVmFsdWUgPSAnJztcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3ZhbHVlJykge1xuXHRcdFx0XHRjb25zdCBkb21WYWx1ZSA9IChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZG9tVmFsdWUgIT09IHByb3BWYWx1ZSAmJlxuXHRcdFx0XHRcdCgoZG9tTm9kZSBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ11cblx0XHRcdFx0XHRcdD8gZG9tVmFsdWUgPT09IChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXVxuXHRcdFx0XHRcdFx0OiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcblx0XHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xuXHRcdFx0XHRcdHVwZGF0ZUV2ZW50KFxuXHRcdFx0XHRcdFx0ZG9tTm9kZSxcblx0XHRcdFx0XHRcdHByb3BOYW1lLnN1YnN0cigyKSxcblx0XHRcdFx0XHRcdHByb3BWYWx1ZSxcblx0XHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLFxuXHRcdFx0XHRcdFx0cHJvcGVydGllcy5iaW5kLFxuXHRcdFx0XHRcdFx0cHJldmlvdXNWYWx1ZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xuXHRcdFx0XHRcdHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzY3JvbGxMZWZ0JyB8fCBwcm9wTmFtZSA9PT0gJ3Njcm9sbFRvcCcpIHtcblx0XHRcdFx0XHRpZiAoKGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xuXHRcdFx0XHRcdFx0KGRvbU5vZGUgYXMgYW55KVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sIHNhbWVBczogSW50ZXJuYWxETm9kZSwgc3RhcnQ6IG51bWJlcikge1xuXHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlOiBFbGVtZW50KTogSW50ZXJuYWxWTm9kZSB7XG5cdHJldHVybiB7XG5cdFx0dGFnOiAnJyxcblx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRjaGlsZHJlbjogdW5kZWZpbmVkLFxuXHRcdGRvbU5vZGUsXG5cdFx0dHlwZTogVk5PREVcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGE6IGFueSk6IEludGVybmFsVk5vZGUge1xuXHRyZXR1cm4ge1xuXHRcdHRhZzogJycsXG5cdFx0cHJvcGVydGllczoge30sXG5cdFx0Y2hpbGRyZW46IHVuZGVmaW5lZCxcblx0XHR0ZXh0OiBgJHtkYXRhfWAsXG5cdFx0ZG9tTm9kZTogdW5kZWZpbmVkLFxuXHRcdHR5cGU6IFZOT0RFXG5cdH07XG59XG5cbmZ1bmN0aW9uIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsIGluc3RhbmNlRGF0YTogV2lkZ2V0RGF0YSk6IEludGVybmFsV05vZGUge1xuXHRyZXR1cm4ge1xuXHRcdGluc3RhbmNlLFxuXHRcdHJlbmRlcmVkOiBbXSxcblx0XHRjb3JlUHJvcGVydGllczogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLFxuXHRcdGNoaWxkcmVuOiBpbnN0YW5jZS5jaGlsZHJlbiBhcyBhbnksXG5cdFx0d2lkZ2V0Q29uc3RydWN0b3I6IGluc3RhbmNlLmNvbnN0cnVjdG9yIGFzIGFueSxcblx0XHRwcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzLFxuXHRcdHR5cGU6IFdOT0RFXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKFxuXHRjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGUgfCBETm9kZVtdLFxuXHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbik6IEludGVybmFsRE5vZGVbXSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGVtcHR5QXJyYXk7XG5cdH1cblx0Y2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKSB7XG5cdFx0Y29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXSBhcyBJbnRlcm5hbEROb2RlO1xuXHRcdGlmIChjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBudWxsKSB7XG5cdFx0XHRjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0aWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0KGNoaWxkLnByb3BlcnRpZXMgYXMgYW55KS5iaW5kID0gaW5zdGFuY2U7XG5cdFx0XHRcdFx0aWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghY2hpbGQuY29yZVByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdFx0XHRjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcblx0XHRcdFx0XHRcdGJpbmQ6IGluc3RhbmNlLFxuXHRcdFx0XHRcdFx0YmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpKys7XG5cdH1cblx0cmV0dXJuIGNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXTtcbn1cblxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlOiBJbnRlcm5hbEROb2RlLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvblN0cmF0ZWd5KSB7XG5cdGlmIChpc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XG5cdFx0Y29uc3QgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xuXHRcdGlmIChlbnRlckFuaW1hdGlvbikge1xuXHRcdFx0aWYgKHR5cGVvZiBlbnRlckFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJhbnNpdGlvbnMuZW50ZXIoZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbiBhcyBzdHJpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjYWxsT25EZXRhY2goZE5vZGVzOiBJbnRlcm5hbEROb2RlIHwgSW50ZXJuYWxETm9kZVtdLCBwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UpOiB2b2lkIHtcblx0ZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgZE5vZGUgPSBkTm9kZXNbaV07XG5cdFx0aWYgKGlzV05vZGUoZE5vZGUpKSB7XG5cdFx0XHRpZiAoZE5vZGUucmVuZGVyZWQpIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZE5vZGUuaW5zdGFuY2UpIHtcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGROb2RlLmluc3RhbmNlKSE7XG5cdFx0XHRcdGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZE5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0Y2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuIGFzIEludGVybmFsRE5vZGVbXSwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGU6IEludGVybmFsRE5vZGUsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uU3RyYXRlZ3ksIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJlZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgY2hpbGQgPSByZW5kZXJlZFtpXTtcblx0XHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRjaGlsZC5kb21Ob2RlIS5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChjaGlsZC5kb21Ob2RlISk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xuXHRcdGNvbnN0IHByb3BlcnRpZXMgPSBkbm9kZS5wcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IGV4aXRBbmltYXRpb24gPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XG5cdFx0aWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xuXHRcdFx0KGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cdFx0XHRjb25zdCByZW1vdmVEb21Ob2RlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0XHRcdH07XG5cdFx0XHRpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0ZXhpdEFuaW1hdGlvbihkb21Ob2RlIGFzIEVsZW1lbnQsIHJlbW92ZURvbU5vZGUsIHByb3BlcnRpZXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiBhcyBzdHJpbmcsIHJlbW92ZURvbU5vZGUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja0Rpc3Rpbmd1aXNoYWJsZShcblx0Y2hpbGROb2RlczogSW50ZXJuYWxETm9kZVtdLFxuXHRpbmRleFRvQ2hlY2s6IG51bWJlcixcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pIHtcblx0Y29uc3QgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xuXHRpZiAoaXNWTm9kZShjaGlsZE5vZGUpICYmICFjaGlsZE5vZGUudGFnKSB7XG5cdFx0cmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxuXHR9XG5cdGNvbnN0IHsga2V5IH0gPSBjaGlsZE5vZGUucHJvcGVydGllcztcblxuXHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XG5cdFx0XHRcdGNvbnN0IG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XG5cdFx0XHRcdFx0bGV0IG5vZGVJZGVudGlmaWVyOiBzdHJpbmc7XG5cdFx0XHRcdFx0Y29uc3QgcGFyZW50TmFtZSA9IChwYXJlbnRJbnN0YW5jZSBhcyBhbnkpLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkTm9kZSkpIHtcblx0XHRcdFx0XHRcdG5vZGVJZGVudGlmaWVyID0gKGNoaWxkTm9kZS53aWRnZXRDb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWUgfHwgJ3Vua25vd24nO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdFx0YEEgd2lkZ2V0ICgke3BhcmVudE5hbWV9KSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50ICgke25vZGVJZGVudGlmaWVyfSkgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdG9sZENoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdG5ld0NoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10sXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zXG4pIHtcblx0b2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xuXHRuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuXHRjb25zdCBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcblx0Y29uc3QgbmV3Q2hpbGRyZW5MZW5ndGggPSBuZXdDaGlsZHJlbi5sZW5ndGg7XG5cdGNvbnN0IHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnMhO1xuXHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfTtcblx0bGV0IG9sZEluZGV4ID0gMDtcblx0bGV0IG5ld0luZGV4ID0gMDtcblx0bGV0IGk6IG51bWJlcjtcblx0bGV0IHRleHRVcGRhdGVkID0gZmFsc2U7XG5cdHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XG5cdFx0Y29uc3Qgb2xkQ2hpbGQgPSBvbGRJbmRleCA8IG9sZENoaWxkcmVuTGVuZ3RoID8gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5bbmV3SW5kZXhdO1xuXHRcdGlmIChpc1ZOb2RlKG5ld0NoaWxkKSAmJiB0eXBlb2YgbmV3Q2hpbGQuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdG5ld0NoaWxkLmluc2VydGVkID0gaXNWTm9kZShvbGRDaGlsZCkgJiYgb2xkQ2hpbGQuaW5zZXJ0ZWQ7XG5cdFx0XHRhZGREZWZlcnJlZFByb3BlcnRpZXMobmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9XG5cdFx0aWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XG5cdFx0XHR0ZXh0VXBkYXRlZCA9IHVwZGF0ZURvbShvbGRDaGlsZCwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8IHRleHRVcGRhdGVkO1xuXHRcdFx0b2xkSW5kZXgrKztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZmluZE9sZEluZGV4ID0gZmluZEluZGV4T2ZDaGlsZChvbGRDaGlsZHJlbiwgbmV3Q2hpbGQsIG9sZEluZGV4ICsgMSk7XG5cdFx0XHRpZiAoZmluZE9sZEluZGV4ID49IDApIHtcblx0XHRcdFx0Zm9yIChpID0gb2xkSW5kZXg7IGkgPCBmaW5kT2xkSW5kZXg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IG9sZENoaWxkID0gb2xkQ2hpbGRyZW5baV07XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gaTtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdFx0XHRcdGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRcdFx0Y2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ZXh0VXBkYXRlZCA9XG5cdFx0XHRcdFx0dXBkYXRlRG9tKG9sZENoaWxkcmVuW2ZpbmRPbGRJbmRleF0sIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fFxuXHRcdFx0XHRcdHRleHRVcGRhdGVkO1xuXHRcdFx0XHRvbGRJbmRleCA9IGZpbmRPbGRJbmRleCArIDE7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgaW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0bGV0IGNoaWxkOiBJbnRlcm5hbEROb2RlID0gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdO1xuXHRcdFx0XHRpZiAoY2hpbGQpIHtcblx0XHRcdFx0XHRsZXQgbmV4dEluZGV4ID0gb2xkSW5kZXggKyAxO1xuXHRcdFx0XHRcdHdoaWxlIChpbnNlcnRCZWZvcmUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0aWYgKGlzV05vZGUoY2hpbGQpKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjaGlsZC5yZW5kZXJlZCkge1xuXHRcdFx0XHRcdFx0XHRcdGNoaWxkID0gY2hpbGQucmVuZGVyZWRbMF07XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAob2xkQ2hpbGRyZW5bbmV4dEluZGV4XSkge1xuXHRcdFx0XHRcdFx0XHRcdGNoaWxkID0gb2xkQ2hpbGRyZW5bbmV4dEluZGV4XTtcblx0XHRcdFx0XHRcdFx0XHRuZXh0SW5kZXgrKztcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW5zZXJ0QmVmb3JlID0gY2hpbGQuZG9tTm9kZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjcmVhdGVEb20obmV3Q2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHRcdG5vZGVBZGRlZChuZXdDaGlsZCwgdHJhbnNpdGlvbnMpO1xuXHRcdFx0XHRjb25zdCBpbmRleFRvQ2hlY2sgPSBuZXdJbmRleDtcblx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRcdFx0Y2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bmV3SW5kZXgrKztcblx0fVxuXHRpZiAob2xkQ2hpbGRyZW5MZW5ndGggPiBvbGRJbmRleCkge1xuXHRcdC8vIFJlbW92ZSBjaGlsZCBmcmFnbWVudHNcblx0XHRmb3IgKGkgPSBvbGRJbmRleDsgaSA8IG9sZENoaWxkcmVuTGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG9sZENoaWxkID0gb2xkQ2hpbGRyZW5baV07XG5cdFx0XHRjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xuXHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRcdGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0XHR9KTtcblx0XHRcdG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRleHRVcGRhdGVkO1xufVxuXG5mdW5jdGlvbiBhZGRDaGlsZHJlbihcblx0cGFyZW50Vk5vZGU6IEludGVybmFsVk5vZGUsXG5cdGNoaWxkcmVuOiBJbnRlcm5hbEROb2RlW10gfCB1bmRlZmluZWQsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucyxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRpbnNlcnRCZWZvcmU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuXHRjaGlsZE5vZGVzPzogKEVsZW1lbnQgfCBUZXh0KVtdXG4pIHtcblx0aWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgY2hpbGROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y2hpbGROb2RlcyA9IGFycmF5RnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlIS5jaGlsZE5vZGVzKSBhcyAoRWxlbWVudCB8IFRleHQpW107XG5cdH1cblxuXHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuXHRcdGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuXHRcdFx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMpIHtcblx0XHRcdFx0bGV0IGRvbUVsZW1lbnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHdoaWxlIChjaGlsZC5kb21Ob2RlID09PSB1bmRlZmluZWQgJiYgY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZG9tRWxlbWVudCA9IGNoaWxkTm9kZXMuc2hpZnQoKSBhcyBFbGVtZW50O1xuXHRcdFx0XHRcdGlmIChkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQudGFnTmFtZSA9PT0gKGNoaWxkLnRhZy50b1VwcGVyQ2FzZSgpIHx8IHVuZGVmaW5lZCkpIHtcblx0XHRcdFx0XHRcdGNoaWxkLmRvbU5vZGUgPSBkb21FbGVtZW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdGRub2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9uc1xuKSB7XG5cdGFkZENoaWxkcmVuKGRub2RlLCBkbm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCB1bmRlZmluZWQpO1xuXHRpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nICYmIGRub2RlLmluc2VydGVkID09PSB1bmRlZmluZWQpIHtcblx0XHRhZGREZWZlcnJlZFByb3BlcnRpZXMoZG5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0fVxuXG5cdGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xuXHRcdHVwZGF0ZUF0dHJpYnV0ZXMoZG9tTm9kZSwge30sIGRub2RlLmF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHt9LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgZmFsc2UpO1xuXHRcdHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHt9LCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcblx0XHRjb25zdCBldmVudHMgPSBkbm9kZS5ldmVudHM7XG5cdFx0T2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChldmVudCkgPT4ge1xuXHRcdFx0dXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnQsIGV2ZW50c1tldmVudF0sIHByb2plY3Rpb25PcHRpb25zLCBkbm9kZS5wcm9wZXJ0aWVzLmJpbmQpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0fVxuXHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG5cdH1cblx0ZG5vZGUuaW5zZXJ0ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEb20oXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwYXJlbnRWTm9kZTogSW50ZXJuYWxWTm9kZSxcblx0aW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdGNoaWxkTm9kZXM/OiAoRWxlbWVudCB8IFRleHQpW11cbikge1xuXHRsZXQgZG9tTm9kZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQ7XG5cdGlmIChpc1dOb2RlKGRub2RlKSkge1xuXHRcdGxldCB7IHdpZGdldENvbnN0cnVjdG9yIH0gPSBkbm9kZTtcblx0XHRjb25zdCBwYXJlbnRJbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRpZiAoIWlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yPERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlPih3aWRnZXRDb25zdHJ1Y3RvcikpIHtcblx0XHRcdGNvbnN0IGl0ZW0gPSBwYXJlbnRJbnN0YW5jZURhdGEucmVnaXN0cnkoKS5nZXQ8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KHdpZGdldENvbnN0cnVjdG9yKTtcblx0XHRcdGlmIChpdGVtID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHdpZGdldENvbnN0cnVjdG9yID0gaXRlbTtcblx0XHR9XG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBuZXcgd2lkZ2V0Q29uc3RydWN0b3IoKTtcblx0XHRkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSkhO1xuXHRcdGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xuXHRcdFx0XHRjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSkhO1xuXHRcdFx0XHRyZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCB9KTtcblx0XHRcdFx0c2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XG5cdFx0aW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcblx0XHRpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xuXHRcdGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xuXHRcdGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcblx0XHRjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcblx0XHRpZiAocmVuZGVyZWQpIHtcblx0XHRcdGNvbnN0IGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG5cdFx0XHRkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XG5cdFx0XHRhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0XHRpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGUsIHBhcmVudFZOb2RlIH0pO1xuXHRcdGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25BdHRhY2goKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgJiYgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50O1xuXHRcdFx0cHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gdW5kZWZpbmVkO1xuXHRcdFx0aW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlISwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGRvYyA9IHBhcmVudFZOb2RlLmRvbU5vZGUhLm93bmVyRG9jdW1lbnQ7XG5cdFx0aWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkICYmIHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcblx0XHRcdFx0Y29uc3QgbmV3RG9tTm9kZSA9IGRub2RlLmRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGlmIChwYXJlbnRWTm9kZS5kb21Ob2RlID09PSBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKG5ld0RvbU5vZGUpO1xuXHRcdFx0XHRcdGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSAmJiBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG5vZGUuZG9tTm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0gfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChkbm9kZS50YWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcblx0XHRcdH1cblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEgYXMgRWxlbWVudCwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGRvbU5vZGUhLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUhKSB7XG5cdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVEb20oXG5cdHByZXZpb3VzOiBhbnksXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlIH0gPSBwcmV2aW91cztcblx0XHRpZiAoaW5zdGFuY2UpIHtcblx0XHRcdGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlOiBub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdGNvbnN0IHByZXZpb3VzUmVuZGVyZWQgPSBub2RlID8gbm9kZS5yZW5kZXJlZCA6IHByZXZpb3VzLnJlbmRlcmVkO1xuXHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcblx0XHRcdGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XG5cdFx0XHRpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XG5cdFx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gZmFsc2U7XG5cdFx0XHRkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXHRcdFx0aW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlLCBwYXJlbnRWTm9kZSB9KTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEuZGlydHkgPT09IHRydWUpIHtcblx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XG5cdFx0XHRcdGRub2RlLnJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xuXHRcdFx0XHR1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZSwgcHJldmlvdXNSZW5kZXJlZCwgZG5vZGUucmVuZGVyZWQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkbm9kZS5yZW5kZXJlZCA9IHByZXZpb3VzUmVuZGVyZWQ7XG5cdFx0XHR9XG5cdFx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCB1bmRlZmluZWQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Y29uc3QgZG9tTm9kZSA9IChkbm9kZS5kb21Ob2RlID0gcHJldmlvdXMuZG9tTm9kZSk7XG5cdFx0bGV0IHRleHRVcGRhdGVkID0gZmFsc2U7XG5cdFx0bGV0IHVwZGF0ZWQgPSBmYWxzZTtcblx0XHRpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmIChkbm9kZS50ZXh0ICE9PSBwcmV2aW91cy50ZXh0KSB7XG5cdFx0XHRcdGNvbnN0IG5ld0RvbU5vZGUgPSBkb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRkb21Ob2RlLnBhcmVudE5vZGUhLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkb21Ob2RlKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHRcdHRleHRVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuIHRleHRVcGRhdGVkO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZG5vZGUudGFnICYmIGRub2RlLnRhZy5sYXN0SW5kZXhPZignc3ZnJywgMCkgPT09IDApIHtcblx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMgPSB7IC4uLnByb2plY3Rpb25PcHRpb25zLCAuLi57IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9IH07XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdGNvbnN0IGNoaWxkcmVuID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkbm9kZS5jaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRkbm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXHRcdFx0XHR1cGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVDaGlsZHJlbihkbm9kZSwgcHJldmlvdXMuY2hpbGRyZW4sIGNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHByZXZpb3VzUHJvcGVydGllcyA9IGJ1aWxkUHJldmlvdXNQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzLCBkbm9kZSk7XG5cdFx0XHRpZiAoZG5vZGUuYXR0cmlidXRlcyAmJiBkbm9kZS5ldmVudHMpIHtcblx0XHRcdFx0dXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuYXR0cmlidXRlcywgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0XHR1cGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVQcm9wZXJ0aWVzKFxuXHRcdFx0XHRcdFx0ZG9tTm9kZSxcblx0XHRcdFx0XHRcdHByZXZpb3VzUHJvcGVydGllcy5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdFx0ZG5vZGUucHJvcGVydGllcyxcblx0XHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHQpIHx8IHVwZGF0ZWQ7XG5cdFx0XHRcdHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5ldmVudHMsIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xuXHRcdFx0XHRjb25zdCBldmVudHMgPSBkbm9kZS5ldmVudHM7XG5cdFx0XHRcdE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoZXZlbnQpID0+IHtcblx0XHRcdFx0XHR1cGRhdGVFdmVudChcblx0XHRcdFx0XHRcdGRvbU5vZGUsXG5cdFx0XHRcdFx0XHRldmVudCxcblx0XHRcdFx0XHRcdGV2ZW50c1tldmVudF0sXG5cdFx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyxcblx0XHRcdFx0XHRcdGRub2RlLnByb3BlcnRpZXMuYmluZCxcblx0XHRcdFx0XHRcdHByZXZpb3VzUHJvcGVydGllcy5ldmVudHNbZXZlbnRdXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1cGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHxcblx0XHRcdFx0XHR1cGRhdGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRcdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHVwZGF0ZWQgJiYgZG5vZGUucHJvcGVydGllcyAmJiBkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbikge1xuXHRcdFx0ZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlOiBJbnRlcm5hbFZOb2RlLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Ly8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xuXHR2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2shKCEhdm5vZGUuaW5zZXJ0ZWQpO1xuXHR2bm9kZS5wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzLCAuLi52bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgfTtcblx0cHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHtcblx0XHRcdC4uLnZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrISghIXZub2RlLmluc2VydGVkKSxcblx0XHRcdC4uLnZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllc1xuXHRcdH07XG5cdFx0dXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlISBhcyBFbGVtZW50LCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0dm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0cmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcblx0fSBlbHNlIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0cmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW5kZXIocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblx0Y29uc3QgcmVuZGVyUXVldWUgPSByZW5kZXJRdWV1ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpITtcblx0Y29uc3QgcmVuZGVycyA9IFsuLi5yZW5kZXJRdWV1ZV07XG5cdHJlbmRlclF1ZXVlTWFwLnNldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgW10pO1xuXHRyZW5kZXJzLnNvcnQoKGEsIGIpID0+IGEuZGVwdGggLSBiLmRlcHRoKTtcblxuXHR3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlIH0gPSByZW5kZXJzLnNoaWZ0KCkhO1xuXHRcdGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHR1cGRhdGVEb20oZG5vZGUsIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XG5cdH1cblx0cnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xuXHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG59XG5cbmV4cG9ydCBjb25zdCBkb20gPSB7XG5cdGFwcGVuZDogZnVuY3Rpb24oXG5cdFx0cGFyZW50Tm9kZTogRWxlbWVudCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+ID0ge31cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0Y29uc3QgZmluYWxQcm9qZWN0b3JPcHRpb25zID0gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlKTtcblxuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IHBhcmVudE5vZGU7XG5cdFx0Y29uc3QgcGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSk7XG5cdFx0Y29uc3Qgbm9kZSA9IHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKTtcblx0XHRjb25zdCByZW5kZXJRdWV1ZTogUmVuZGVyUXVldWVbXSA9IFtdO1xuXHRcdGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZTogbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG5cdFx0cmVuZGVyUXVldWVNYXAuc2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgcmVuZGVyUXVldWUpO1xuXHRcdGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xuXHRcdFx0XHRjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpITtcblx0XHRcdFx0cmVuZGVyUXVldWUucHVzaCh7IGluc3RhbmNlLCBkZXB0aDogZmluYWxQcm9qZWN0b3JPcHRpb25zLmRlcHRoIH0pO1xuXHRcdFx0XHRzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dXBkYXRlRG9tKG5vZGUsIG5vZGUsIGZpbmFsUHJvamVjdG9yT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcblx0XHRmaW5hbFByb2plY3Rvck9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25BdHRhY2goKTtcblx0XHR9KTtcblx0XHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRvbU5vZGU6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZVxuXHRcdH07XG5cdH0sXG5cdGNyZWF0ZTogZnVuY3Rpb24oaW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLCBwcm9qZWN0aW9uT3B0aW9ucz86IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+KTogUHJvamVjdGlvbiB7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9LFxuXHRtZXJnZTogZnVuY3Rpb24oXG5cdFx0ZWxlbWVudDogRWxlbWVudCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+ID0ge31cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgPSB0cnVlO1xuXHRcdHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSBhcyBFbGVtZW50LCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHZkb20udHMiLCIvKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgd2lkZ2V0RmFjdG9yeSA9IHJlcXVpcmUoXCJzcmMvbWVudS9NZW51XCIpO1xuXG52YXIgcmVnaXN0ZXJDdXN0b21FbGVtZW50ID0gcmVxdWlyZSgnQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50JykuZGVmYXVsdDtcblxudmFyIGRlZmF1bHRFeHBvcnQgPSB3aWRnZXRGYWN0b3J5LmRlZmF1bHQ7XG5kZWZhdWx0RXhwb3J0ICYmIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZWZhdWx0RXhwb3J0KTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS9NZW51IS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbi8vIE9uIHNvbWUgZXhvdGljIGVudmlyb25tZW50cywgaXQncyBub3QgY2xlYXIgd2hpY2ggb2JqZWN0IGBzZXRpbW1laWRhdGVgIHdhc1xuLy8gYWJsZSB0byBpbnN0YWxsIG9udG8uICBTZWFyY2ggZWFjaCBwb3NzaWJpbGl0eSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGVcbi8vIGBzZXRpbW1lZGlhdGVgIGxpYnJhcnkuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5zZXRJbW1lZGlhdGUpO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLmNsZWFySW1tZWRpYXRlKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgeyBjdXN0b21FbGVtZW50IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50JztcbmltcG9ydCB7IFdpZGdldFByb3BlcnRpZXMsIFdOb2RlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcbmltcG9ydCB7IE1lbnVJdGVtLCBNZW51SXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9tZW51LWl0ZW0vTWVudUl0ZW0nO1xuXG5pbXBvcnQgKiBhcyBjc3MgZnJvbSAnLi9tZW51Lm0uY3NzJztcblxuaW50ZXJmYWNlIE1lbnVQcm9wZXJ0aWVzIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XG5cdG9uU2VsZWN0ZWQ6IChkYXRhOiBhbnkpID0+IHZvaWQ7XG59XG5cbkBjdXN0b21FbGVtZW50PE1lbnVQcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudScsXG5cdGV2ZW50czogWydvblNlbGVjdGVkJ11cbn0pXG5AdGhlbWUoY3NzKVxuZXhwb3J0IGNsYXNzIE1lbnUgZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51UHJvcGVydGllcywgV05vZGU8TWVudUl0ZW0+PiB7XG5cdHByaXZhdGUgX3NlbGVjdGVkSWQ6IG51bWJlcjtcblxuXHRwcml2YXRlIF9vblNlbGVjdGVkKGlkOiBudW1iZXIsIGRhdGE6IGFueSkge1xuXHRcdHRoaXMuX3NlbGVjdGVkSWQgPSBpZDtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZChkYXRhKTtcblx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQsIGluZGV4KSA9PiB7XG5cdFx0XHRpZiAoY2hpbGQpIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydGllczogUGFydGlhbDxNZW51SXRlbVByb3BlcnRpZXM+ID0ge1xuXHRcdFx0XHRcdG9uU2VsZWN0ZWQ6IChkYXRhOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuX29uU2VsZWN0ZWQoaW5kZXgsIGRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKHRoaXMuX3NlbGVjdGVkSWQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHByb3BlcnRpZXMuc2VsZWN0ZWQgPSBpbmRleCA9PT0gdGhpcy5fc2VsZWN0ZWRJZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZC5wcm9wZXJ0aWVzID0geyAuLi5jaGlsZC5wcm9wZXJ0aWVzLCAuLi5wcm9wZXJ0aWVzIH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hpbGQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdignbmF2JywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5yb290KSB9LCBbXG5cdFx0XHR2KFxuXHRcdFx0XHQnb2wnLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MubWVudUNvbnRhaW5lcilcblx0XHRcdFx0fSxcblx0XHRcdFx0aXRlbXNcblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9tZW51IS4vc3JjL21lbnUvTWVudS50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJ0ZXN0LWFwcC9tZW51XCIsXCJyb290XCI6XCJfM2JBNmpkU25cIixcIm1lbnVDb250YWluZXJcIjpcIl8xZW9HZnFrdVwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZW51L21lbnUubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiXSwic291cmNlUm9vdCI6IiJ9