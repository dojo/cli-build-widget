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

/***/ "./node_modules/@dojo/core/Destroyable.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__("./node_modules/@dojo/core/lang.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Promise__ = __webpack_require__("./node_modules/@dojo/shim/Promise.mjs");


/**
 * No operation function to replace own once instance is destoryed
 */
function noop() {
    return __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Promise__["a" /* default */].resolve(false);
}
/**
 * No op function used to replace own, once instance has been destoryed
 */
function destroyed() {
    throw new Error('Call made to destroyed method');
}
class Destroyable {
    /**
     * @constructor
     */
    constructor() {
        this.handles = [];
    }
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} a handle for the handle, removes the handle for the instance and calls destroy
     */
    own(handles) {
        const handle = Array.isArray(handles) ? Object(__WEBPACK_IMPORTED_MODULE_0__lang__["b" /* createCompositeHandle */])(...handles) : handles;
        const { handles: _handles } = this;
        _handles.push(handle);
        return {
            destroy() {
                _handles.splice(_handles.indexOf(handle));
                handle.destroy();
            }
        };
    }
    /**
     * Destrpys all handers registered for the instance
     *
     * @returns {Promise<any} a promise that resolves once all handles have been destroyed
     */
    destroy() {
        return new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Promise__["a" /* default */]((resolve) => {
            this.handles.forEach((handle) => {
                handle && handle.destroy && handle.destroy();
            });
            this.destroy = noop;
            this.own = destroyed;
            resolve(true);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Destroyable;

/* unused harmony default export */ var _unused_webpack_default_export = (Destroyable);
//# sourceMappingURL=Destroyable.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/core/Evented.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isGlobMatch */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__ = __webpack_require__("./node_modules/@dojo/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Destroyable__ = __webpack_require__("./node_modules/@dojo/core/Destroyable.mjs");


/**
 * Map of computed regular expressions, keyed by string
 */
const regexMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
/**
 * Determines is the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
function isGlobMatch(globString, targetString) {
    if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
        let regex;
        if (regexMap.has(globString)) {
            regex = regexMap.get(globString);
        }
        else {
            regex = new RegExp(`^${globString.replace(/\*/g, '.*')}$`);
            regexMap.set(globString, regex);
        }
        return regex.test(targetString);
    }
    else {
        return globString === targetString;
    }
}
/**
 * Event Class
 */
class Evented extends __WEBPACK_IMPORTED_MODULE_1__Destroyable__["a" /* Destroyable */] {
    constructor() {
        super(...arguments);
        /**
         * map of listeners keyed by event type
         */
        this.listenersMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
    }
    emit(event) {
        this.listenersMap.forEach((methods, type) => {
            if (isGlobMatch(type, event.type)) {
                methods.forEach((method) => {
                    method.call(this, event);
                });
            }
        });
    }
    on(type, listener) {
        if (Array.isArray(listener)) {
            const handles = listener.map((listener) => this._addListener(type, listener));
            return {
                destroy() {
                    handles.forEach((handle) => handle.destroy());
                }
            };
        }
        return this._addListener(type, listener);
    }
    _addListener(type, listener) {
        const listeners = this.listenersMap.get(type) || [];
        listeners.push(listener);
        this.listenersMap.set(type, listeners);
        return {
            destroy: () => {
                const listeners = this.listenersMap.get(type) || [];
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Evented;

/* unused harmony default export */ var _unused_webpack_default_export = (Evented);
//# sourceMappingURL=Evented.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/core/lang.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export create */
/* unused harmony export deepAssign */
/* unused harmony export deepMixin */
/* unused harmony export duplicate */
/* unused harmony export isIdentical */
/* unused harmony export lateBind */
/* unused harmony export mixin */
/* unused harmony export partial */
/* unused harmony export createHandle */
/* harmony export (immutable) */ __webpack_exports__["b"] = createCompositeHandle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_object__ = __webpack_require__("./node_modules/@dojo/shim/object.mjs");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__dojo_shim_object__["a"]; });


const slice = Array.prototype.slice;
const hasOwnProperty = Object.prototype.hasOwnProperty;
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
    const deep = kwArgs.deep;
    const inherited = kwArgs.inherited;
    const target = kwArgs.target;
    const copied = kwArgs.copied || [];
    const copiedClone = [...copied];
    for (let i = 0; i < kwArgs.sources.length; i++) {
        const source = kwArgs.sources[i];
        if (source === null || source === undefined) {
            continue;
        }
        for (let key in source) {
            if (inherited || hasOwnProperty.call(source, key)) {
                let value = source[key];
                if (copiedClone.indexOf(value) !== -1) {
                    continue;
                }
                if (deep) {
                    if (Array.isArray(value)) {
                        value = copyArray(value, inherited);
                    }
                    else if (shouldDeepCopyObject(value)) {
                        const targetValue = target[key] || {};
                        copied.push(source);
                        value = _mixin({
                            deep: true,
                            inherited: inherited,
                            sources: [value],
                            target: targetValue,
                            copied
                        });
                    }
                }
                target[key] = value;
            }
        }
    }
    return target;
}
function create(prototype, ...mixins) {
    if (!mixins.length) {
        throw new RangeError('lang.create requires at least one mixin object.');
    }
    const args = mixins.slice();
    args.unshift(Object.create(prototype));
    return __WEBPACK_IMPORTED_MODULE_0__dojo_shim_object__["a" /* assign */].apply(null, args);
}
function deepAssign(target, ...sources) {
    return _mixin({
        deep: true,
        inherited: false,
        sources: sources,
        target: target
    });
}
function deepMixin(target, ...sources) {
    return _mixin({
        deep: true,
        inherited: true,
        sources: sources,
        target: target
    });
}
/**
 * Creates a new object using the provided source's prototype as the prototype for the new object, and then
 * deep copies the provided source's values into the new target.
 *
 * @param source The object to duplicate
 * @return The new object
 */
function duplicate(source) {
    const target = Object.create(Object.getPrototypeOf(source));
    return deepMixin(target, source);
}
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
function lateBind(instance, method, ...suppliedArgs) {
    return suppliedArgs.length
        ? function () {
            const args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
            // TS7017
            return instance[method].apply(instance, args);
        }
        : function () {
            // TS7017
            return instance[method].apply(instance, arguments);
        };
}
function mixin(target, ...sources) {
    return _mixin({
        deep: false,
        inherited: true,
        sources: sources,
        target: target
    });
}
/**
 * Returns a function which invokes the given function with the given arguments prepended to its argument list.
 * Like `Function.prototype.bind`, but does not alter execution context.
 *
 * @param targetFunction The function that needs to be bound
 * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
 * @return The bound function
 */
function partial(targetFunction, ...suppliedArgs) {
    return function () {
        const args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
        return targetFunction.apply(this, args);
    };
}
/**
 * Returns an object with a destroy method that, when called, calls the passed-in destructor.
 * This is intended to provide a unified interface for creating "remove" / "destroy" handlers for
 * event listeners, timers, etc.
 *
 * @param destructor A function that will be called when the handle's `destroy` method is invoked
 * @return The handle object
 */
function createHandle(destructor) {
    let called = false;
    return {
        destroy: function () {
            if (!called) {
                called = true;
                destructor();
            }
        }
    };
}
/**
 * Returns a single handle that can be used to destroy multiple handles simultaneously.
 *
 * @param handles An array of handles with `destroy` methods
 * @return The handle object
 */
function createCompositeHandle(...handles) {
    return createHandle(function () {
        for (let i = 0; i < handles.length; i++) {
            handles[i].destroy();
        }
    });
}
//# sourceMappingURL=lang.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/has/has.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {/* unused harmony export load */
/* unused harmony export normalize */
/* unused harmony export exists */
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony export (immutable) */ __webpack_exports__["b"] = has;
function isFeatureTestThenable(value) {
    return value && value.then;
}
/**
 * A cache of results of feature tests
 */
const testCache = {};
/* unused harmony export testCache */

/**
 * A cache of the un-resolved feature tests
 */
const testFunctions = {};
/* unused harmony export testFunctions */

/**
 * A cache of unresolved thenables (probably promises)
 * @type {{}}
 */
const testThenables = {};
/**
 * A reference to the global scope (`window` in a browser, `global` in NodeJS)
 */
const globalScope = (function () {
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
const { staticFeatures } = globalScope.DojoHasEnvironment || {};
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
const staticCache = staticFeatures
    ? isStaticFeatureFunction(staticFeatures) ? staticFeatures.apply(globalScope) : staticFeatures
    : {}; /* Providing an empty cache, if none was in the environment

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
    const tokens = resourceId.match(/[\?:]|[^:\?]*/g) || [];
    let i = 0;
    function get(skip) {
        const term = tokens[i++];
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
    const id = get();
    return id && normalize(id);
}
/**
 * Check if a feature has already been registered
 *
 * @param feature the name of the feature
 */
function exists(feature) {
    const normalizedFeature = feature.toLowerCase();
    return Boolean(normalizedFeature in staticCache || normalizedFeature in testCache || testFunctions[normalizedFeature]);
}
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
function add(feature, value, overwrite = false) {
    const normalizedFeature = feature.toLowerCase();
    if (exists(normalizedFeature) && !overwrite && !(normalizedFeature in staticCache)) {
        throw new TypeError(`Feature "${feature}" exists and overwrite not true.`);
    }
    if (typeof value === 'function') {
        testFunctions[normalizedFeature] = value;
    }
    else if (isFeatureTestThenable(value)) {
        testThenables[feature] = value.then((resolvedValue) => {
            testCache[feature] = resolvedValue;
            delete testThenables[feature];
        }, () => {
            delete testThenables[feature];
        });
    }
    else {
        testCache[normalizedFeature] = value;
        delete testFunctions[normalizedFeature];
    }
}
/**
 * Return the current value of a named feature.
 *
 * @param feature The name (if a string) or identifier (if an integer) of the feature to test.
 */
function has(feature) {
    let result;
    const normalizedFeature = feature.toLowerCase();
    if (normalizedFeature in staticCache) {
        result = staticCache[normalizedFeature];
    }
    else if (testFunctions[normalizedFeature]) {
        result = testCache[normalizedFeature] = testFunctions[normalizedFeature].call(null);
        delete testFunctions[normalizedFeature];
    }
    else if (normalizedFeature in testCache) {
        result = testCache[normalizedFeature];
    }
    else if (feature in testThenables) {
        return false;
    }
    else {
        throw new TypeError(`Attempt to detect unregistered has feature "${feature}"`);
    }
    return result;
}
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
//# sourceMappingURL=has.mjs.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/Map.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__iterator__ = __webpack_require__("./node_modules/@dojo/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__object__ = __webpack_require__("./node_modules/@dojo/shim/object.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");





let Map = __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Map;
if (false) {
    Map = (_a = class Map {
            constructor(iterable) {
                this._keys = [];
                this._values = [];
                this[Symbol.toStringTag] = 'Map';
                if (iterable) {
                    if (isArrayLike(iterable)) {
                        for (let i = 0; i < iterable.length; i++) {
                            const value = iterable[i];
                            this.set(value[0], value[1]);
                        }
                    }
                    else {
                        for (const value of iterable) {
                            this.set(value[0], value[1]);
                        }
                    }
                }
            }
            /**
             * An alternative to Array.prototype.indexOf using Object.is
             * to check for equality. See http://mzl.la/1zuKO2V
             */
            _indexOfKey(keys, key) {
                for (let i = 0, length = keys.length; i < length; i++) {
                    if (objectIs(keys[i], key)) {
                        return i;
                    }
                }
                return -1;
            }
            get size() {
                return this._keys.length;
            }
            clear() {
                this._keys.length = this._values.length = 0;
            }
            delete(key) {
                const index = this._indexOfKey(this._keys, key);
                if (index < 0) {
                    return false;
                }
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            }
            entries() {
                const values = this._keys.map((key, i) => {
                    return [key, this._values[i]];
                });
                return new ShimIterator(values);
            }
            forEach(callback, context) {
                const keys = this._keys;
                const values = this._values;
                for (let i = 0, length = keys.length; i < length; i++) {
                    callback.call(context, values[i], keys[i], this);
                }
            }
            get(key) {
                const index = this._indexOfKey(this._keys, key);
                return index < 0 ? undefined : this._values[index];
            }
            has(key) {
                return this._indexOfKey(this._keys, key) > -1;
            }
            keys() {
                return new ShimIterator(this._keys);
            }
            set(key, value) {
                let index = this._indexOfKey(this._keys, key);
                index = index < 0 ? this._keys.length : index;
                this._keys[index] = key;
                this._values[index] = value;
                return this;
            }
            values() {
                return new ShimIterator(this._values);
            }
            [Symbol.iterator]() {
                return this.entries();
            }
        },
        _a[Symbol.species] = _a,
        _a);
}
/* harmony default export */ __webpack_exports__["b"] = (Map);
var _a;
//# sourceMappingURL=Map.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/Promise.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ShimPromise */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_queue__ = __webpack_require__("./node_modules/@dojo/shim/support/queue.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");




let ShimPromise = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Promise;
const isThenable = function isThenable(value) {
    return value && typeof value.then === 'function';
};
/* unused harmony export isThenable */

if (false) {
    global.Promise = ShimPromise = (_a = class Promise {
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
            constructor(executor) {
                /**
                 * The current state of this promise.
                 */
                this.state = 1 /* Pending */;
                this[Symbol.toStringTag] = 'Promise';
                /**
                 * If true, the resolution of this promise is chained ("locked in") to another promise.
                 */
                let isChained = false;
                /**
                 * Whether or not this promise is in a resolved state.
                 */
                const isResolved = () => {
                    return this.state !== 1 /* Pending */ || isChained;
                };
                /**
                 * Callbacks that should be invoked once the asynchronous operation has completed.
                 */
                let callbacks = [];
                /**
                 * Initially pushes callbacks onto a queue for execution once this promise settles. After the promise settles,
                 * enqueues callbacks for execution on the next event loop turn.
                 */
                let whenFinished = function (callback) {
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
                const settle = (newState, value) => {
                    // A promise can only be settled once.
                    if (this.state !== 1 /* Pending */) {
                        return;
                    }
                    this.state = newState;
                    this.resolvedValue = value;
                    whenFinished = queueMicroTask;
                    // Only enqueue a callback runner if there are callbacks so that initially fulfilled Promises don't have to
                    // wait an extra turn.
                    if (callbacks && callbacks.length > 0) {
                        queueMicroTask(function () {
                            if (callbacks) {
                                let count = callbacks.length;
                                for (let i = 0; i < count; ++i) {
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
                const resolve = (newState, value) => {
                    if (isResolved()) {
                        return;
                    }
                    if (isThenable(value)) {
                        value.then(settle.bind(null, 0 /* Fulfilled */), settle.bind(null, 2 /* Rejected */));
                        isChained = true;
                    }
                    else {
                        settle(newState, value);
                    }
                };
                this.then = (onFulfilled, onRejected) => {
                    return new Promise((resolve, reject) => {
                        // whenFinished initially queues up callbacks for execution after the promise has settled. Once the
                        // promise has settled, whenFinished will schedule callbacks for execution on the next turn through the
                        // event loop.
                        whenFinished(() => {
                            const callback = this.state === 2 /* Rejected */ ? onRejected : onFulfilled;
                            if (typeof callback === 'function') {
                                try {
                                    resolve(callback(this.resolvedValue));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }
                            else if (this.state === 2 /* Rejected */) {
                                reject(this.resolvedValue);
                            }
                            else {
                                resolve(this.resolvedValue);
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
            static all(iterable) {
                return new this(function (resolve, reject) {
                    const values = [];
                    let complete = 0;
                    let total = 0;
                    let populating = true;
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
                        if (isThenable(item)) {
                            // If an item Promise rejects, this Promise is immediately rejected with the item
                            // Promise's rejection error.
                            item.then(fulfill.bind(null, index), reject);
                        }
                        else {
                            Promise.resolve(item).then(fulfill.bind(null, index));
                        }
                    }
                    let i = 0;
                    for (const value of iterable) {
                        processItem(i, value);
                        i++;
                    }
                    populating = false;
                    finish();
                });
            }
            static race(iterable) {
                return new this(function (resolve, reject) {
                    for (const item of iterable) {
                        if (item instanceof Promise) {
                            // If a Promise item rejects, this Promise is immediately rejected with the item
                            // Promise's rejection error.
                            item.then(resolve, reject);
                        }
                        else {
                            Promise.resolve(item).then(resolve);
                        }
                    }
                });
            }
            static reject(reason) {
                return new this(function (resolve, reject) {
                    reject(reason);
                });
            }
            static resolve(value) {
                return new this(function (resolve) {
                    resolve(value);
                });
            }
            catch(onRejected) {
                return this.then(undefined, onRejected);
            }
        },
        _a[Symbol.species] = ShimPromise,
        _a);
}
/* harmony default export */ __webpack_exports__["a"] = (ShimPromise);
var _a;
//# sourceMappingURL=Promise.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/Symbol.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Symbol */
/* unused harmony export isSymbol */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_util__ = __webpack_require__("./node_modules/@dojo/shim/support/util.mjs");



let Symbol = __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Symbol;
if (false) {
    /**
     * Throws if the value is not a symbol, used internally within the Shim
     * @param  {any}    value The value to check
     * @return {symbol}       Returns the symbol or throws
     */
    const validateSymbol = function validateSymbol(value) {
        if (!isSymbol(value)) {
            throw new TypeError(value + ' is not a symbol');
        }
        return value;
    };
    const defineProperties = Object.defineProperties;
    const defineProperty = Object.defineProperty;
    const create = Object.create;
    const objPrototype = Object.prototype;
    const globalSymbols = {};
    const getSymbolName = (function () {
        const created = create(null);
        return function (desc) {
            let postfix = 0;
            let name;
            while (created[String(desc) + (postfix || '')]) {
                ++postfix;
            }
            desc += String(postfix || '');
            created[desc] = true;
            name = '@@' + desc;
            // FIXME: Temporary guard until the duplicate execution when testing can be
            // pinned down.
            if (!Object.getOwnPropertyDescriptor(objPrototype, name)) {
                defineProperty(objPrototype, name, {
                    set: function (value) {
                        defineProperty(this, name, getValueDescriptor(value));
                    }
                });
            }
            return name;
        };
    })();
    const InternalSymbol = function Symbol(description) {
        if (this instanceof InternalSymbol) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        return Symbol(description);
    };
    Symbol = global.Symbol = function Symbol(description) {
        if (this instanceof Symbol) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        const sym = Object.create(InternalSymbol.prototype);
        description = description === undefined ? '' : String(description);
        return defineProperties(sym, {
            __description__: getValueDescriptor(description),
            __name__: getValueDescriptor(getSymbolName(description))
        });
    };
    /* Decorate the Symbol function with the appropriate properties */
    defineProperty(Symbol, 'for', getValueDescriptor(function (key) {
        if (globalSymbols[key]) {
            return globalSymbols[key];
        }
        return (globalSymbols[key] = Symbol(String(key)));
    }));
    defineProperties(Symbol, {
        keyFor: getValueDescriptor(function (sym) {
            let key;
            validateSymbol(sym);
            for (key in globalSymbols) {
                if (globalSymbols[key] === sym) {
                    return key;
                }
            }
        }),
        hasInstance: getValueDescriptor(Symbol.for('hasInstance'), false, false),
        isConcatSpreadable: getValueDescriptor(Symbol.for('isConcatSpreadable'), false, false),
        iterator: getValueDescriptor(Symbol.for('iterator'), false, false),
        match: getValueDescriptor(Symbol.for('match'), false, false),
        observable: getValueDescriptor(Symbol.for('observable'), false, false),
        replace: getValueDescriptor(Symbol.for('replace'), false, false),
        search: getValueDescriptor(Symbol.for('search'), false, false),
        species: getValueDescriptor(Symbol.for('species'), false, false),
        split: getValueDescriptor(Symbol.for('split'), false, false),
        toPrimitive: getValueDescriptor(Symbol.for('toPrimitive'), false, false),
        toStringTag: getValueDescriptor(Symbol.for('toStringTag'), false, false),
        unscopables: getValueDescriptor(Symbol.for('unscopables'), false, false)
    });
    /* Decorate the InternalSymbol object */
    defineProperties(InternalSymbol.prototype, {
        constructor: getValueDescriptor(Symbol),
        toString: getValueDescriptor(function () {
            return this.__name__;
        }, false, false)
    });
    /* Decorate the Symbol.prototype */
    defineProperties(Symbol.prototype, {
        toString: getValueDescriptor(function () {
            return 'Symbol (' + validateSymbol(this).__description__ + ')';
        }),
        valueOf: getValueDescriptor(function () {
            return validateSymbol(this);
        })
    });
    defineProperty(Symbol.prototype, Symbol.toPrimitive, getValueDescriptor(function () {
        return validateSymbol(this);
    }));
    defineProperty(Symbol.prototype, Symbol.toStringTag, getValueDescriptor('Symbol', false, false, true));
    defineProperty(InternalSymbol.prototype, Symbol.toPrimitive, getValueDescriptor(Symbol.prototype[Symbol.toPrimitive], false, false, true));
    defineProperty(InternalSymbol.prototype, Symbol.toStringTag, getValueDescriptor(Symbol.prototype[Symbol.toStringTag], false, false, true));
}
/**
 * A custom guard function that determines if an object is a symbol or not
 * @param  {any}       value The value to check to see if it is a symbol or not
 * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
 */
function isSymbol(value) {
    return (value && (typeof value === 'symbol' || value['@@toStringTag'] === 'Symbol')) || false;
}
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
].forEach((wellKnown) => {
    if (!Symbol[wellKnown]) {
        Object.defineProperty(Symbol, wellKnown, Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["a" /* getValueDescriptor */])(Symbol.for(wellKnown), false, false));
    }
});
/* harmony default export */ __webpack_exports__["a"] = (Symbol);
//# sourceMappingURL=Symbol.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/WeakMap.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export WeakMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterator__ = __webpack_require__("./node_modules/@dojo/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");




let WeakMap = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].WeakMap;
if (false) {
    const DELETED = {};
    const getUID = function getUID() {
        return Math.floor(Math.random() * 100000000);
    };
    const generateName = (function () {
        let startId = Math.floor(Date.now() % 100000000);
        return function generateName() {
            return '__wm' + getUID() + (startId++ + '__');
        };
    })();
    WeakMap = class WeakMap {
        constructor(iterable) {
            this[Symbol.toStringTag] = 'WeakMap';
            this._name = generateName();
            this._frozenEntries = [];
            if (iterable) {
                if (isArrayLike(iterable)) {
                    for (let i = 0; i < iterable.length; i++) {
                        const item = iterable[i];
                        this.set(item[0], item[1]);
                    }
                }
                else {
                    for (const [key, value] of iterable) {
                        this.set(key, value);
                    }
                }
            }
        }
        _getFrozenEntryIndex(key) {
            for (let i = 0; i < this._frozenEntries.length; i++) {
                if (this._frozenEntries[i].key === key) {
                    return i;
                }
            }
            return -1;
        }
        delete(key) {
            if (key === undefined || key === null) {
                return false;
            }
            const entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED) {
                entry.value = DELETED;
                return true;
            }
            const frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                this._frozenEntries.splice(frozenIndex, 1);
                return true;
            }
            return false;
        }
        get(key) {
            if (key === undefined || key === null) {
                return undefined;
            }
            const entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED) {
                return entry.value;
            }
            const frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return this._frozenEntries[frozenIndex].value;
            }
        }
        has(key) {
            if (key === undefined || key === null) {
                return false;
            }
            const entry = key[this._name];
            if (Boolean(entry && entry.key === key && entry.value !== DELETED)) {
                return true;
            }
            const frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return true;
            }
            return false;
        }
        set(key, value) {
            if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
                throw new TypeError('Invalid value used as weak map key');
            }
            let entry = key[this._name];
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
        }
    };
}
/* harmony default export */ __webpack_exports__["a"] = (WeakMap);
//# sourceMappingURL=WeakMap.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/array.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return from; });
/* unused harmony export of */
/* unused harmony export copyWithin */
/* unused harmony export fill */
/* unused harmony export find */
/* unused harmony export findIndex */
/* unused harmony export includes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterator__ = __webpack_require__("./node_modules/@dojo/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__number__ = __webpack_require__("./node_modules/@dojo/shim/number.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__support_util__ = __webpack_require__("./node_modules/@dojo/shim/support/util.mjs");





let from;
/**
 * Creates a new array from the function parameters.
 *
 * @param arguments Any number of arguments for the array
 * @return An array from the given arguments
 */
let of;
/* ES6 Array instance methods */
/**
 * Copies data internally within an array or array-like object.
 *
 * @param target The target array-like object
 * @param offset The index to start copying values to; if negative, it counts backwards from length
 * @param start The first (inclusive) index to copy; if negative, it counts backwards from length
 * @param end The last (exclusive) index to copy; if negative, it counts backwards from length
 * @return The target
 */
let copyWithin;
/**
 * Fills elements of an array-like object with the specified value.
 *
 * @param target The target to fill
 * @param value The value to fill each element of the target with
 * @param start The first index to fill
 * @param end The (exclusive) index at which to stop filling
 * @return The filled target
 */
let fill;
/**
 * Finds and returns the first instance matching the callback or undefined if one is not found.
 *
 * @param target An array-like object
 * @param callback A function returning if the current value matches a criteria
 * @param thisArg The execution context for the find function
 * @return The first element matching the callback, or undefined if one does not exist
 */
let find;
/**
 * Performs a linear search and returns the first index whose value satisfies the passed callback,
 * or -1 if no values satisfy it.
 *
 * @param target An array-like object
 * @param callback A function returning true if the current value satisfies its criteria
 * @param thisArg The execution context for the find function
 * @return The first index whose value satisfies the passed callback, or -1 if no values satisfy it
 */
let findIndex;
/* ES7 Array instance methods */
/**
 * Determines whether an array includes a given value
 *
 * @param target the target array-like object
 * @param searchElement the item to search for
 * @param fromIndex the starting index to search from
 * @return `true` if the array includes the element, otherwise `false`
 */
let includes;
if (true) {
    from = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.from;
    of = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.of;
    copyWithin = Object(__WEBPACK_IMPORTED_MODULE_4__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.prototype.copyWithin);
    fill = Object(__WEBPACK_IMPORTED_MODULE_4__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.prototype.fill);
    find = Object(__WEBPACK_IMPORTED_MODULE_4__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.prototype.find);
    findIndex = Object(__WEBPACK_IMPORTED_MODULE_4__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.prototype.findIndex);
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
    const toLength = function toLength(length) {
        if (isNaN(length)) {
            return 0;
        }
        length = Number(length);
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), MAX_SAFE_INTEGER);
    };
    /**
     * From ES6 7.1.4 ToInteger()
     *
     * @param value A value to convert
     * @return An integer
     */
    const toInteger = function toInteger(value) {
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
    const normalizeOffset = function normalizeOffset(value, length) {
        return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
    };
    from = function from(arrayLike, mapFunction, thisArg) {
        if (arrayLike == null) {
            throw new TypeError('from: requires an array-like object');
        }
        if (mapFunction && thisArg) {
            mapFunction = mapFunction.bind(thisArg);
        }
        /* tslint:disable-next-line:variable-name */
        const Constructor = this;
        const length = toLength(arrayLike.length);
        // Support extension
        const array = typeof Constructor === 'function' ? Object(new Constructor(length)) : new Array(length);
        if (!isArrayLike(arrayLike) && !isIterable(arrayLike)) {
            return array;
        }
        // if this is an array and the normalized length is 0, just return an empty array. this prevents a problem
        // with the iteration on IE when using a NaN array length.
        if (isArrayLike(arrayLike)) {
            if (length === 0) {
                return [];
            }
            for (let i = 0; i < arrayLike.length; i++) {
                array[i] = mapFunction ? mapFunction(arrayLike[i], i) : arrayLike[i];
            }
        }
        else {
            let i = 0;
            for (const value of arrayLike) {
                array[i] = mapFunction ? mapFunction(value, i) : value;
                i++;
            }
        }
        if (arrayLike.length !== undefined) {
            array.length = length;
        }
        return array;
    };
    of = function of(...items) {
        return Array.prototype.slice.call(items);
    };
    copyWithin = function copyWithin(target, offset, start, end) {
        if (target == null) {
            throw new TypeError('copyWithin: target must be an array-like object');
        }
        const length = toLength(target.length);
        offset = normalizeOffset(toInteger(offset), length);
        start = normalizeOffset(toInteger(start), length);
        end = normalizeOffset(end === undefined ? length : toInteger(end), length);
        let count = Math.min(end - start, length - offset);
        let direction = 1;
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
    fill = function fill(target, value, start, end) {
        const length = toLength(target.length);
        let i = normalizeOffset(toInteger(start), length);
        end = normalizeOffset(end === undefined ? length : toInteger(end), length);
        while (i < end) {
            target[i++] = value;
        }
        return target;
    };
    find = function find(target, callback, thisArg) {
        const index = findIndex(target, callback, thisArg);
        return index !== -1 ? target[index] : undefined;
    };
    findIndex = function findIndex(target, callback, thisArg) {
        const length = toLength(target.length);
        if (!callback) {
            throw new TypeError('find: second argument must be a function');
        }
        if (thisArg) {
            callback = callback.bind(thisArg);
        }
        for (let i = 0; i < length; i++) {
            if (callback(target[i], i, target)) {
                return i;
            }
        }
        return -1;
    };
}
if (true) {
    includes = Object(__WEBPACK_IMPORTED_MODULE_4__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Array.prototype.includes);
}
else {
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    const toLength = function toLength(length) {
        length = Number(length);
        if (isNaN(length)) {
            return 0;
        }
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), MAX_SAFE_INTEGER);
    };
    includes = function includes(target, searchElement, fromIndex = 0) {
        let len = toLength(target.length);
        for (let i = fromIndex; i < len; ++i) {
            const currentElement = target[i];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
        }
        return false;
    };
}
//# sourceMappingURL=array.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/global.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {const globalObject = (function () {
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
/* harmony default export */ __webpack_exports__["a"] = (globalObject);
//# sourceMappingURL=global.mjs.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/iterator.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isIterable */
/* unused harmony export isArrayLike */
/* unused harmony export get */
/* unused harmony export forOf */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string__ = __webpack_require__("./node_modules/@dojo/shim/string.mjs");


const staticDone = { done: true, value: undefined };
/**
 * A class that _shims_ an iterator interface on array like objects.
 */
class ShimIterator {
    constructor(list) {
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
    next() {
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
    }
    [Symbol.iterator]() {
        return this;
    }
}
/* unused harmony export ShimIterator */

/**
 * A type guard for checking if something has an Iterable interface
 *
 * @param value The value to type guard against
 */
function isIterable(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
/**
 * A type guard for checking if something is ArrayLike
 *
 * @param value The value to type guard against
 */
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
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
/**
 * Shims the functionality of `for ... of` blocks
 *
 * @param iterable The object the provides an interator interface
 * @param callback The callback which will be called for each item of the iterable
 * @param thisArg Optional scope to pass the callback
 */
function forOf(iterable, callback, thisArg) {
    let broken = false;
    function doBreak() {
        broken = true;
    }
    /* We need to handle iteration of double byte strings properly */
    if (isArrayLike(iterable) && typeof iterable === 'string') {
        const l = iterable.length;
        for (let i = 0; i < l; ++i) {
            let char = iterable[i];
            if (i + 1 < l) {
                const code = char.charCodeAt(0);
                if (code >= __WEBPACK_IMPORTED_MODULE_1__string__["b" /* HIGH_SURROGATE_MIN */] && code <= __WEBPACK_IMPORTED_MODULE_1__string__["a" /* HIGH_SURROGATE_MAX */]) {
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
        const iterator = get(iterable);
        if (iterator) {
            let result = iterator.next();
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
//# sourceMappingURL=iterator.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/number.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isNaN */
/* unused harmony export isFinite */
/* unused harmony export isInteger */
/* unused harmony export isSafeInteger */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");

/**
 * The smallest interval between two representable numbers.
 */
const EPSILON = 1;
/* unused harmony export EPSILON */

/**
 * The maximum safe integer in JavaScript
 */
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
/* unused harmony export MAX_SAFE_INTEGER */

/**
 * The minimum safe integer in JavaScript
 */
const MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;
/* unused harmony export MIN_SAFE_INTEGER */

/**
 * Determines whether the passed value is NaN without coersion.
 *
 * @param value The value to test
 * @return true if the value is NaN, false if it is not
 */
function isNaN(value) {
    return typeof value === 'number' && __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].isNaN(value);
}
/**
 * Determines whether the passed value is a finite number without coersion.
 *
 * @param value The value to test
 * @return true if the value is finite, false if it is not
 */
function isFinite(value) {
    return typeof value === 'number' && __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].isFinite(value);
}
/**
 * Determines whether the passed value is an integer.
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
function isInteger(value) {
    return isFinite(value) && Math.floor(value) === value;
}
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
    return isInteger(value) && Math.abs(value) <= MAX_SAFE_INTEGER;
}
//# sourceMappingURL=number.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/object.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assign; });
/* unused harmony export getOwnPropertyDescriptor */
/* unused harmony export getOwnPropertyNames */
/* unused harmony export getOwnPropertySymbols */
/* unused harmony export is */
/* unused harmony export keys */
/* unused harmony export getOwnPropertyDescriptors */
/* unused harmony export entries */
/* unused harmony export values */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");



let assign;
/**
 * Gets the own property descriptor of the specified object.
 * An own property descriptor is one that is defined directly on the object and is not
 * inherited from the object's prototype.
 * @param o Object that contains the property.
 * @param p Name of the property.
 */
let getOwnPropertyDescriptor;
/**
 * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
 * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
 * @param o Object that contains the own properties.
 */
let getOwnPropertyNames;
/**
 * Returns an array of all symbol properties found directly on object o.
 * @param o Object to retrieve the symbols from.
 */
let getOwnPropertySymbols;
/**
 * Returns true if the values are the same value, false otherwise.
 * @param value1 The first value.
 * @param value2 The second value.
 */
let is;
/**
 * Returns the names of the enumerable properties and methods of an object.
 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
let keys;
/* ES7 Object static methods */
let getOwnPropertyDescriptors;
let entries;
let values;
if (true) {
    const globalObject = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Object;
    assign = globalObject.assign;
    getOwnPropertyDescriptor = globalObject.getOwnPropertyDescriptor;
    getOwnPropertyNames = globalObject.getOwnPropertyNames;
    getOwnPropertySymbols = globalObject.getOwnPropertySymbols;
    is = globalObject.is;
    keys = globalObject.keys;
}
else {
    keys = function symbolAwareKeys(o) {
        return Object.keys(o).filter((key) => !Boolean(key.match(/^@@.+/)));
    };
    assign = function assign(target, ...sources) {
        if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        const to = Object(target);
        sources.forEach((nextSource) => {
            if (nextSource) {
                // Skip over if undefined or null
                keys(nextSource).forEach((nextKey) => {
                    to[nextKey] = nextSource[nextKey];
                });
            }
        });
        return to;
    };
    getOwnPropertyDescriptor = function getOwnPropertyDescriptor(o, prop) {
        if (isSymbol(prop)) {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
        else {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
    };
    getOwnPropertyNames = function getOwnPropertyNames(o) {
        return Object.getOwnPropertyNames(o).filter((key) => !Boolean(key.match(/^@@.+/)));
    };
    getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return Object.getOwnPropertyNames(o)
            .filter((key) => Boolean(key.match(/^@@.+/)))
            .map((key) => Symbol.for(key.substring(2)));
    };
    is = function is(value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2; // -0
        }
        return value1 !== value1 && value2 !== value2; // NaN
    };
}
if (true) {
    const globalObject = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Object;
    getOwnPropertyDescriptors = globalObject.getOwnPropertyDescriptors;
    entries = globalObject.entries;
    values = globalObject.values;
}
else {
    getOwnPropertyDescriptors = function getOwnPropertyDescriptors(o) {
        return getOwnPropertyNames(o).reduce((previous, key) => {
            previous[key] = getOwnPropertyDescriptor(o, key);
            return previous;
        }, {});
    };
    entries = function entries(o) {
        return keys(o).map((key) => [key, o[key]]);
    };
    values = function values(o) {
        return keys(o).map((key) => o[key]);
    };
}
//# sourceMappingURL=object.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/string.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export fromCodePoint */
/* unused harmony export raw */
/* unused harmony export codePointAt */
/* unused harmony export endsWith */
/* unused harmony export includes */
/* unused harmony export normalize */
/* unused harmony export repeat */
/* unused harmony export startsWith */
/* unused harmony export padEnd */
/* unused harmony export padStart */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_util__ = __webpack_require__("./node_modules/@dojo/shim/support/util.mjs");



/**
 * The minimum location of high surrogates
 */
const HIGH_SURROGATE_MIN = 0xd800;
/* harmony export (immutable) */ __webpack_exports__["b"] = HIGH_SURROGATE_MIN;

/**
 * The maximum location of high surrogates
 */
const HIGH_SURROGATE_MAX = 0xdbff;
/* harmony export (immutable) */ __webpack_exports__["a"] = HIGH_SURROGATE_MAX;

/**
 * The minimum location of low surrogates
 */
const LOW_SURROGATE_MIN = 0xdc00;
/* unused harmony export LOW_SURROGATE_MIN */

/**
 * The maximum location of low surrogates
 */
const LOW_SURROGATE_MAX = 0xdfff;
/* unused harmony export LOW_SURROGATE_MAX */

/* ES6 static methods */
/**
 * Return the String value whose elements are, in order, the elements in the List elements.
 * If length is 0, the empty string is returned.
 * @param codePoints The code points to generate the string
 */
let fromCodePoint;
/**
 * `raw` is intended for use as a tag function of a Tagged Template String. When called
 * as such the first argument will be a well formed template call site object and the rest
 * parameter will contain the substitution values.
 * @param template A well-formed template string call site representation.
 * @param substitutions A set of substitution values.
 */
let raw;
/* ES6 instance methods */
/**
 * Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
 * value of the UTF-16 encoded code point starting at the string element at position pos in
 * the String resulting from converting this object to a String.
 * If there is no element at that position, the result is undefined.
 * If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.
 */
let codePointAt;
/**
 * Returns true if the sequence of elements of searchString converted to a String is the
 * same as the corresponding elements of this object (converted to a String) starting at
 * endPosition – length(this). Otherwise returns false.
 */
let endsWith;
/**
 * Returns true if searchString appears as a substring of the result of converting this
 * object to a String, at one or more positions that are
 * greater than or equal to position; otherwise, returns false.
 * @param target The target string
 * @param searchString search string
 * @param position If position is undefined, 0 is assumed, so as to search all of the String.
 */
let includes;
/**
 * Returns the String value result of normalizing the string into the normalization form
 * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
 * @param target The target string
 * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
 * is "NFC"
 */
let normalize;
/**
 * Returns a String value that is made from count copies appended together. If count is 0,
 * T is the empty String is returned.
 * @param count number of copies to append
 */
let repeat;
/**
 * Returns true if the sequence of elements of searchString converted to a String is the
 * same as the corresponding elements of this object (converted to a String) starting at
 * position. Otherwise returns false.
 */
let startsWith;
/* ES7 instance methods */
/**
 * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
 * The padding is applied from the end (right) of the current string.
 *
 * @param target The target string
 * @param maxLength The length of the resulting string once the current string has been padded.
 *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
 *
 * @param fillString The string to pad the current string with.
 *        If this string is too long, it will be truncated and the left-most part will be applied.
 *        The default value for this parameter is " " (U+0020).
 */
let padEnd;
/**
 * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
 * The padding is applied from the start (left) of the current string.
 *
 * @param target The target string
 * @param maxLength The length of the resulting string once the current string has been padded.
 *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
 *
 * @param fillString The string to pad the current string with.
 *        If this string is too long, it will be truncated and the left-most part will be applied.
 *        The default value for this parameter is " " (U+0020).
 */
let padStart;
if (true) {
    fromCodePoint = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.fromCodePoint;
    raw = __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.raw;
    codePointAt = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.codePointAt);
    endsWith = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.endsWith);
    includes = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.includes);
    normalize = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.normalize);
    repeat = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.repeat);
    startsWith = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.startsWith);
}
else {
    /**
     * Validates that text is defined, and normalizes position (based on the given default if the input is NaN).
     * Used by startsWith, includes, and endsWith.
     *
     * @return Normalized position.
     */
    const normalizeSubstringArgs = function (name, text, search, position, isEnd = false) {
        if (text == null) {
            throw new TypeError('string.' + name + ' requires a valid string to search against.');
        }
        const length = text.length;
        position = position !== position ? (isEnd ? length : 0) : position;
        return [text, String(search), Math.min(Math.max(position, 0), length)];
    };
    fromCodePoint = function fromCodePoint(...codePoints) {
        // Adapted from https://github.com/mathiasbynens/String.fromCodePoint
        const length = arguments.length;
        if (!length) {
            return '';
        }
        const fromCharCode = String.fromCharCode;
        const MAX_SIZE = 0x4000;
        let codeUnits = [];
        let index = -1;
        let result = '';
        while (++index < length) {
            let codePoint = Number(arguments[index]);
            // Code points must be finite integers within the valid range
            let isValid = isFinite(codePoint) && Math.floor(codePoint) === codePoint && codePoint >= 0 && codePoint <= 0x10ffff;
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
                let highSurrogate = (codePoint >> 10) + HIGH_SURROGATE_MIN;
                let lowSurrogate = codePoint % 0x400 + LOW_SURROGATE_MIN;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += fromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
    raw = function raw(callSite, ...substitutions) {
        let rawStrings = callSite.raw;
        let result = '';
        let numSubstitutions = substitutions.length;
        if (callSite == null || callSite.raw == null) {
            throw new TypeError('string.raw requires a valid callSite object with a raw value');
        }
        for (let i = 0, length = rawStrings.length; i < length; i++) {
            result += rawStrings[i] + (i < numSubstitutions && i < length - 1 ? substitutions[i] : '');
        }
        return result;
    };
    codePointAt = function codePointAt(text, position = 0) {
        // Adapted from https://github.com/mathiasbynens/String.prototype.codePointAt
        if (text == null) {
            throw new TypeError('string.codePointAt requries a valid string.');
        }
        const length = text.length;
        if (position !== position) {
            position = 0;
        }
        if (position < 0 || position >= length) {
            return undefined;
        }
        // Get the first code unit
        const first = text.charCodeAt(position);
        if (first >= HIGH_SURROGATE_MIN && first <= HIGH_SURROGATE_MAX && length > position + 1) {
            // Start of a surrogate pair (high surrogate and there is a next code unit); check for low surrogate
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            const second = text.charCodeAt(position + 1);
            if (second >= LOW_SURROGATE_MIN && second <= LOW_SURROGATE_MAX) {
                return (first - HIGH_SURROGATE_MIN) * 0x400 + second - LOW_SURROGATE_MIN + 0x10000;
            }
        }
        return first;
    };
    endsWith = function endsWith(text, search, endPosition) {
        if (endPosition == null) {
            endPosition = text.length;
        }
        [text, search, endPosition] = normalizeSubstringArgs('endsWith', text, search, endPosition, true);
        const start = endPosition - search.length;
        if (start < 0) {
            return false;
        }
        return text.slice(start, endPosition) === search;
    };
    includes = function includes(text, search, position = 0) {
        [text, search, position] = normalizeSubstringArgs('includes', text, search, position);
        return text.indexOf(search, position) !== -1;
    };
    repeat = function repeat(text, count = 0) {
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
        let result = '';
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
    startsWith = function startsWith(text, search, position = 0) {
        search = String(search);
        [text, search, position] = normalizeSubstringArgs('startsWith', text, search, position);
        const end = position + search.length;
        if (end > text.length) {
            return false;
        }
        return text.slice(position, end) === search;
    };
}
if (true) {
    padEnd = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.padEnd);
    padStart = Object(__WEBPACK_IMPORTED_MODULE_2__support_util__["b" /* wrapNative */])(__WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].String.prototype.padStart);
}
else {
    padEnd = function padEnd(text, maxLength, fillString = ' ') {
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padEnd requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        let strText = String(text);
        const padding = maxLength - strText.length;
        if (padding > 0) {
            strText +=
                repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length);
        }
        return strText;
    };
    padStart = function padStart(text, maxLength, fillString = ' ') {
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padStart requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        let strText = String(text);
        const padding = maxLength - strText.length;
        if (padding > 0) {
            strText =
                repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length) +
                    strText;
        }
        return strText;
    };
}
//# sourceMappingURL=string.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/support/has.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_has_has__ = __webpack_require__("./node_modules/@dojo/has/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* unused harmony reexport namespace */


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["b" /* default */]);

/* ECMAScript 6 and 7 Features */
/* Array */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-array', () => {
    return (['from', 'of'].every((key) => key in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array) &&
        ['findIndex', 'find', 'copyWithin'].every((key) => key in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype));
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-array-fill', () => {
    if ('fill' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype) {
        /* Some versions of Safari do not properly implement this */
        return [1].fill(9, Number.POSITIVE_INFINITY)[0] === 1;
    }
    return false;
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es7-array', () => 'includes' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype, true);
/* Map */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-map', () => {
    if (typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Map === 'function') {
        /*
    IE11 and older versions of Safari are missing critical ES6 Map functionality
    We wrap this in a try/catch because sometimes the Map constructor exists, but does not
    take arguments (iOS 8.4)
     */
        try {
            const map = new __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Map([[0, 1]]);
            return map.has(0) &&
                typeof map.keys === 'function' &&
                true &&
                typeof map.values === 'function' &&
                typeof map.entries === 'function';
        }
        catch (e) {
            /* istanbul ignore next: not testing on iOS at the moment */
            return false;
        }
    }
    return false;
}, true);
/* Math */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-math', () => {
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
    ].every((name) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Math[name] === 'function');
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-math-imul', () => {
    if ('imul' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Math) {
        /* Some versions of Safari on ios do not properly implement this */
        return Math.imul(0xffffffff, 5) === -5;
    }
    return false;
}, true);
/* Object */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-object', () => {
    return true &&
        ['assign', 'is', 'getOwnPropertySymbols', 'setPrototypeOf'].every((name) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Object[name] === 'function');
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es2017-object', () => {
    return ['values', 'entries', 'getOwnPropertyDescriptors'].every((name) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Object[name] === 'function');
}, true);
/* Observable */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es-observable', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Observable !== 'undefined', true);
/* Promise */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-promise', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Promise !== 'undefined' && true, true);
/* Set */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-set', () => {
    if (typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Set === 'function') {
        /* IE11 and older versions of Safari are missing critical ES6 Set functionality */
        const set = new __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Set([1]);
        return set.has(1) && 'keys' in set && typeof set.keys === 'function' && true;
    }
    return false;
}, true);
/* String */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-string', () => {
    return ([
        /* static methods */
        'fromCodePoint'
    ].every((key) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String[key] === 'function') &&
        [
            /* instance methods */
            'codePointAt',
            'normalize',
            'repeat',
            'startsWith',
            'endsWith',
            'includes'
        ].every((key) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String.prototype[key] === 'function'));
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-string-raw', () => {
    function getCallSite(callSite, ...substitutions) {
        const result = [...callSite];
        result.raw = callSite.raw;
        return result;
    }
    if ('raw' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String) {
        let b = 1;
        let callSite = getCallSite `a\n${b}`;
        callSite.raw = ['a\\n'];
        const supportsTrunc = __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String.raw(callSite, 42) === 'a:\\n';
        return supportsTrunc;
    }
    return false;
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es2017-string', () => {
    return ['padStart', 'padEnd'].every((key) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String.prototype[key] === 'function');
}, true);
/* Symbol */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-symbol', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Symbol !== 'undefined' && typeof Symbol() === 'symbol', true);
/* WeakMap */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('es6-weakmap', () => {
    if (typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].WeakMap !== 'undefined') {
        /* IE11 and older versions of Safari are missing critical ES6 Map functionality */
        const key1 = {};
        const key2 = {};
        const map = new __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].WeakMap([[key1, 1]]);
        Object.freeze(key1);
        return map.get(key1) === 1 && map.set(key2, 2) === map && true;
    }
    return false;
}, true);
/* Miscellaneous features */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('microtasks', () => true || false || true, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('postmessage', () => {
    // If window is undefined, and we have postMessage, it probably means we're in a web worker. Web workers have
    // post message but it doesn't work how we expect it to, so it's best just to pretend it doesn't exist.
    return typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].window !== 'undefined' && typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].postMessage === 'function';
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('raf', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].requestAnimationFrame === 'function', true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('setimmediate', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].setImmediate !== 'undefined', true);
/* DOM Features */
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('dom-mutationobserver', () => {
    if (true && Boolean(__WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].MutationObserver || __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].WebKitMutationObserver)) {
        // IE11 has an unreliable MutationObserver implementation where setProperty() does not
        // generate a mutation event, observers can crash, and the queue does not drain
        // reliably. The following feature test was adapted from
        // https://gist.github.com/t10ko/4aceb8c71681fdb275e33efe5e576b14
        const example = document.createElement('div');
        /* tslint:disable-next-line:variable-name */
        const HostMutationObserver = __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].MutationObserver || __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].WebKitMutationObserver;
        const observer = new HostMutationObserver(function () { });
        observer.observe(example, { attributes: true });
        example.style.setProperty('display', 'block');
        return Boolean(observer.takeRecords().length);
    }
    return false;
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__dojo_has_has__["a" /* add */])('dom-webanimation', () => true && __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Animation !== undefined && __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].KeyframeEffect !== undefined, true);
//# sourceMappingURL=has.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/support/queue.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export queueMicroTask */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__has__ = __webpack_require__("./node_modules/@dojo/shim/support/has.mjs");


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
let checkMicroTaskQueue;
let microTasks;
/**
 * Schedules a callback to the macrotask queue.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
const queueTask = (function () {
    let destructor;
    let enqueue;
    // Since the IE implementation of `setImmediate` is not flawless, we will test for `postMessage` first.
    if (true) {
        const queue = [];
        __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].addEventListener('message', function (event) {
            // Confirm that the event was triggered by the current window and by this particular implementation.
            if (event.source === __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */] && event.data === 'dojo-queue-message') {
                event.stopPropagation();
                if (queue.length) {
                    executeTask(queue.shift());
                }
            }
        });
        enqueue = function (item) {
            queue.push(item);
            __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].postMessage('dojo-queue-message', '*');
        };
    }
    else if (false) {
        destructor = global.clearImmediate;
        enqueue = function (item) {
            return setImmediate(executeTask.bind(null, item));
        };
    }
    else {
        destructor = global.clearTimeout;
        enqueue = function (item) {
            return setTimeout(executeTask.bind(null, item), 0);
        };
    }
    function queueTask(callback) {
        const item = {
            isActive: true,
            callback: callback
        };
        const id = enqueue(item);
        return getQueueHandle(item, destructor &&
            function () {
                destructor(id);
            });
    }
    // TODO: Use aspect.before when it is available.
    return true
        ? queueTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueTask(callback);
        };
})();
/* unused harmony export queueTask */

// When no mechanism for registering microtasks is exposed by the environment, microtasks will
// be queued and then executed in a single macrotask before the other macrotasks are executed.
if (false) {
    let isMicroTaskQueued = false;
    microTasks = [];
    checkMicroTaskQueue = function () {
        if (!isMicroTaskQueued) {
            isMicroTaskQueued = true;
            queueTask(function () {
                isMicroTaskQueued = false;
                if (microTasks.length) {
                    let item;
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
const queueAnimationTask = (function () {
    if (false) {
        return queueTask;
    }
    function queueAnimationTask(callback) {
        const item = {
            isActive: true,
            callback: callback
        };
        const rafId = requestAnimationFrame(executeTask.bind(null, item));
        return getQueueHandle(item, function () {
            cancelAnimationFrame(rafId);
        });
    }
    // TODO: Use aspect.before when it is available.
    return true
        ? queueAnimationTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueAnimationTask(callback);
        };
})();
/* unused harmony export queueAnimationTask */

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
let queueMicroTask = (function () {
    let enqueue;
    if (false) {
        enqueue = function (item) {
            global.process.nextTick(executeTask.bind(null, item));
        };
    }
    else if (true) {
        enqueue = function (item) {
            __WEBPACK_IMPORTED_MODULE_0__global__["a" /* default */].Promise.resolve(item).then(executeTask);
        };
    }
    else if (true) {
        /* tslint:disable-next-line:variable-name */
        const HostMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
        const node = document.createElement('div');
        const queue = [];
        const observer = new HostMutationObserver(function () {
            while (queue.length > 0) {
                const item = queue.shift();
                if (item && item.isActive && item.callback) {
                    item.callback();
                }
            }
        });
        observer.observe(node, { attributes: true });
        enqueue = function (item) {
            queue.push(item);
            node.setAttribute('queueStatus', '1');
        };
    }
    else {
        enqueue = function (item) {
            checkMicroTaskQueue();
            microTasks.push(item);
        };
    }
    return function (callback) {
        const item = {
            isActive: true,
            callback: callback
        };
        enqueue(item);
        return getQueueHandle(item);
    };
})();
//# sourceMappingURL=queue.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/shim/support/util.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getValueDescriptor;
/* harmony export (immutable) */ __webpack_exports__["b"] = wrapNative;
/**
 * Helper function to generate a value property descriptor
 *
 * @param value        The value the property descriptor should be set to
 * @param enumerable   If the property should be enumberable, defaults to false
 * @param writable     If the property should be writable, defaults to true
 * @param configurable If the property should be configurable, defaults to true
 * @return             The property descriptor object
 */
function getValueDescriptor(value, enumerable = false, writable = true, configurable = true) {
    return {
        value: value,
        enumerable: enumerable,
        writable: writable,
        configurable: configurable
    };
}
function wrapNative(nativeFunction) {
    return function (target, ...args) {
        return nativeFunction.apply(target, args);
    };
}
//# sourceMappingURL=util.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Injector.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_core_Evented__ = __webpack_require__("./node_modules/@dojo/core/Evented.mjs");

class Injector extends __WEBPACK_IMPORTED_MODULE_0__dojo_core_Evented__["a" /* Evented */] {
    constructor(payload) {
        super();
        this._payload = payload;
    }
    setInvalidator(invalidator) {
        this._invalidator = invalidator;
    }
    get() {
        return this._payload;
    }
    set(payload) {
        this._payload = payload;
        if (this._invalidator) {
            this._invalidator();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Injector;

/* unused harmony default export */ var _unused_webpack_default_export = (Injector);
//# sourceMappingURL=Injector.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/NodeHandler.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export NodeEventType */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_core_Evented__ = __webpack_require__("./node_modules/@dojo/core/Evented.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__ = __webpack_require__("./node_modules/@dojo/shim/Map.mjs");


/**
 * Enum to identify the type of event.
 * Listening to 'Projector' will notify when projector is created or updated
 * Listening to 'Widget' will notify when widget root is created or updated
 */
var NodeEventType;
(function (NodeEventType) {
    NodeEventType["Projector"] = "Projector";
    NodeEventType["Widget"] = "Widget";
})(NodeEventType || (NodeEventType = {}));
class NodeHandler extends __WEBPACK_IMPORTED_MODULE_0__dojo_core_Evented__["a" /* Evented */] {
    constructor() {
        super(...arguments);
        this._nodeMap = new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__["b" /* default */]();
    }
    get(key) {
        return this._nodeMap.get(key);
    }
    has(key) {
        return this._nodeMap.has(key);
    }
    add(element, key) {
        this._nodeMap.set(key, element);
        this.emit({ type: key });
    }
    addRoot() {
        this.emit({ type: NodeEventType.Widget });
    }
    addProjector() {
        this.emit({ type: NodeEventType.Projector });
    }
    clear() {
        this._nodeMap.clear();
    }
}
/* unused harmony export NodeHandler */

/* harmony default export */ __webpack_exports__["a"] = (NodeHandler);
//# sourceMappingURL=NodeHandler.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Registry.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = isWidgetBaseConstructor;
/* unused harmony export isWidgetConstructorDefaultExport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Promise__ = __webpack_require__("./node_modules/@dojo/shim/Promise.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__ = __webpack_require__("./node_modules/@dojo/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_shim_Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dojo_core_Evented__ = __webpack_require__("./node_modules/@dojo/core/Evented.mjs");




/**
 * Widget base symbol type
 */
const WIDGET_BASE_TYPE = Object(__WEBPACK_IMPORTED_MODULE_2__dojo_shim_Symbol__["a" /* default */])('Widget Base');
/* harmony export (immutable) */ __webpack_exports__["b"] = WIDGET_BASE_TYPE;

/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
function isWidgetBaseConstructor(item) {
    return Boolean(item && item._type === WIDGET_BASE_TYPE);
}
function isWidgetConstructorDefaultExport(item) {
    return Boolean(item &&
        item.hasOwnProperty('__esModule') &&
        item.hasOwnProperty('default') &&
        isWidgetBaseConstructor(item.default));
}
/**
 * The Registry implementation
 */
class Registry extends __WEBPACK_IMPORTED_MODULE_3__dojo_core_Evented__["a" /* Evented */] {
    /**
     * Emit loaded event for registry label
     */
    emitLoadedEvent(widgetLabel, item) {
        this.emit({
            type: widgetLabel,
            action: 'loaded',
            item
        });
    }
    define(label, item) {
        if (this._widgetRegistry === undefined) {
            this._widgetRegistry = new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__["b" /* default */]();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error(`widget has already been registered for '${label.toString()}'`);
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Promise__["a" /* default */]) {
            item.then((widgetCtor) => {
                this._widgetRegistry.set(label, widgetCtor);
                this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, (error) => {
                throw error;
            });
        }
        else if (isWidgetBaseConstructor(item)) {
            this.emitLoadedEvent(label, item);
        }
    }
    defineInjector(label, injectorFactory) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__["b" /* default */]();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error(`injector has already been registered for '${label.toString()}'`);
        }
        const invalidator = new __WEBPACK_IMPORTED_MODULE_3__dojo_core_Evented__["a" /* Evented */]();
        const injectorItem = {
            injector: injectorFactory(() => invalidator.emit({ type: 'invalidate' })),
            invalidator
        };
        this._injectorRegistry.set(label, injectorItem);
        this.emitLoadedEvent(label, injectorItem);
    }
    get(label) {
        if (!this._widgetRegistry || !this.has(label)) {
            return null;
        }
        const item = this._widgetRegistry.get(label);
        if (isWidgetBaseConstructor(item)) {
            return item;
        }
        if (item instanceof __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Promise__["a" /* default */]) {
            return null;
        }
        const promise = item();
        this._widgetRegistry.set(label, promise);
        promise.then((widgetCtor) => {
            if (isWidgetConstructorDefaultExport(widgetCtor)) {
                widgetCtor = widgetCtor.default;
            }
            this._widgetRegistry.set(label, widgetCtor);
            this.emitLoadedEvent(label, widgetCtor);
            return widgetCtor;
        }, (error) => {
            throw error;
        });
        return null;
    }
    getInjector(label) {
        if (!this._injectorRegistry || !this.hasInjector(label)) {
            return null;
        }
        return this._injectorRegistry.get(label);
    }
    has(label) {
        return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
    }
    hasInjector(label) {
        return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Registry;

/* harmony default export */ __webpack_exports__["c"] = (Registry);
//# sourceMappingURL=Registry.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/RegistryHandler.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__ = __webpack_require__("./node_modules/@dojo/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_core_Evented__ = __webpack_require__("./node_modules/@dojo/core/Evented.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");



class RegistryHandler extends __WEBPACK_IMPORTED_MODULE_1__dojo_core_Evented__["a" /* Evented */] {
    constructor() {
        super();
        this._registry = new __WEBPACK_IMPORTED_MODULE_2__Registry__["a" /* Registry */]();
        this._registryWidgetLabelMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["a" /* Map */]();
        this._registryInjectorLabelMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["a" /* Map */]();
        this.own(this._registry);
        const destroy = () => {
            if (this.baseRegistry) {
                this._registryWidgetLabelMap.delete(this.baseRegistry);
                this._registryInjectorLabelMap.delete(this.baseRegistry);
                this.baseRegistry = undefined;
            }
        };
        this.own({ destroy });
    }
    set base(baseRegistry) {
        if (this.baseRegistry) {
            this._registryWidgetLabelMap.delete(this.baseRegistry);
            this._registryInjectorLabelMap.delete(this.baseRegistry);
        }
        this.baseRegistry = baseRegistry;
    }
    define(label, widget) {
        this._registry.define(label, widget);
    }
    defineInjector(label, injector) {
        this._registry.defineInjector(label, injector);
    }
    has(label) {
        return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
    }
    hasInjector(label) {
        return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
    }
    get(label, globalPrecedence = false) {
        return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
    }
    getInjector(label, globalPrecedence = false) {
        return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
    }
    _get(label, globalPrecedence, getFunctionName, labelMap) {
        const registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
        for (let i = 0; i < registries.length; i++) {
            const registry = registries[i];
            if (!registry) {
                continue;
            }
            const item = registry[getFunctionName](label);
            const registeredLabels = labelMap.get(registry) || [];
            if (item) {
                return item;
            }
            else if (registeredLabels.indexOf(label) === -1) {
                const handle = registry.on(label, (event) => {
                    if (event.action === 'loaded' &&
                        this[getFunctionName](label, globalPrecedence) === event.item) {
                        this.emit({ type: 'invalidate' });
                    }
                });
                this.own(handle);
                labelMap.set(registry, [...registeredLabels, label]);
            }
        }
        return null;
    }
}
/* unused harmony export RegistryHandler */

/* harmony default export */ __webpack_exports__["a"] = (RegistryHandler);
//# sourceMappingURL=RegistryHandler.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/WidgetBase.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__ = __webpack_require__("./node_modules/@dojo/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/shim/WeakMap.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_shim_Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__diff__ = __webpack_require__("./node_modules/@dojo/widget-core/diff.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RegistryHandler__ = __webpack_require__("./node_modules/@dojo/widget-core/RegistryHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__NodeHandler__ = __webpack_require__("./node_modules/@dojo/widget-core/NodeHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vdom__ = __webpack_require__("./node_modules/@dojo/widget-core/vdom.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");









const decoratorMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
const boundAuto = __WEBPACK_IMPORTED_MODULE_4__diff__["a" /* auto */].bind(null);
const noBind = __WEBPACK_IMPORTED_MODULE_2__dojo_shim_Symbol__["a" /* default */].for('dojoNoBind');
/* harmony export (immutable) */ __webpack_exports__["b"] = noBind;

/**
 * Main widget base for all widgets to extend
 */
class WidgetBase {
    /**
     * @constructor
     */
    constructor() {
        /**
         * Indicates if it is the initial set properties cycle
         */
        this._initialProperties = true;
        /**
         * Array of property keys considered changed from the previous set properties
         */
        this._changedPropertyKeys = [];
        this._nodeHandler = new __WEBPACK_IMPORTED_MODULE_6__NodeHandler__["a" /* default */]();
        this._handles = [];
        this._children = [];
        this._decoratorCache = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
        this._properties = {};
        this._boundRenderFunc = this.render.bind(this);
        this._boundInvalidate = this.invalidate.bind(this);
        __WEBPACK_IMPORTED_MODULE_7__vdom__["b" /* widgetInstanceMap */].set(this, {
            dirty: true,
            onAttach: () => {
                this.onAttach();
            },
            onDetach: () => {
                this.onDetach();
                this.destroy();
            },
            nodeHandler: this._nodeHandler,
            registry: () => {
                return this.registry;
            },
            coreProperties: {},
            rendering: false,
            inputProperties: {}
        });
        this._runAfterConstructors();
    }
    meta(MetaType) {
        if (this._metaMap === undefined) {
            this._metaMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
        }
        let cached = this._metaMap.get(MetaType);
        if (!cached) {
            cached = new MetaType({
                invalidate: this._boundInvalidate,
                nodeHandler: this._nodeHandler,
                bind: this
            });
            this.own(cached);
            this._metaMap.set(MetaType, cached);
        }
        return cached;
    }
    onAttach() {
        // Do nothing by default.
    }
    onDetach() {
        // Do nothing by default.
    }
    get properties() {
        return this._properties;
    }
    get changedPropertyKeys() {
        return [...this._changedPropertyKeys];
    }
    __setCoreProperties__(coreProperties) {
        const { baseRegistry } = coreProperties;
        const instanceData = __WEBPACK_IMPORTED_MODULE_7__vdom__["b" /* widgetInstanceMap */].get(this);
        if (instanceData.coreProperties.baseRegistry !== baseRegistry) {
            if (this._registry === undefined) {
                this._registry = new __WEBPACK_IMPORTED_MODULE_5__RegistryHandler__["a" /* default */]();
                this.own(this._registry);
                this.own(this._registry.on('invalidate', this._boundInvalidate));
            }
            this._registry.base = baseRegistry;
            this.invalidate();
        }
        instanceData.coreProperties = coreProperties;
    }
    __setProperties__(originalProperties) {
        const instanceData = __WEBPACK_IMPORTED_MODULE_7__vdom__["b" /* widgetInstanceMap */].get(this);
        instanceData.inputProperties = originalProperties;
        const properties = this._runBeforeProperties(originalProperties);
        const registeredDiffPropertyNames = this.getDecorator('registeredDiffProperty');
        const changedPropertyKeys = [];
        const propertyNames = Object.keys(properties);
        if (this._initialProperties === false || registeredDiffPropertyNames.length !== 0) {
            const allProperties = [...propertyNames, ...Object.keys(this._properties)];
            const checkedProperties = [];
            const diffPropertyResults = {};
            let runReactions = false;
            for (let i = 0; i < allProperties.length; i++) {
                const propertyName = allProperties[i];
                if (checkedProperties.indexOf(propertyName) !== -1) {
                    continue;
                }
                checkedProperties.push(propertyName);
                const previousProperty = this._properties[propertyName];
                const newProperty = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                if (registeredDiffPropertyNames.indexOf(propertyName) !== -1) {
                    runReactions = true;
                    const diffFunctions = this.getDecorator(`diffProperty:${propertyName}`);
                    for (let i = 0; i < diffFunctions.length; i++) {
                        const result = diffFunctions[i](previousProperty, newProperty);
                        if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                            changedPropertyKeys.push(propertyName);
                        }
                        if (propertyName in properties) {
                            diffPropertyResults[propertyName] = result.value;
                        }
                    }
                }
                else {
                    const result = boundAuto(previousProperty, newProperty);
                    if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                        changedPropertyKeys.push(propertyName);
                    }
                    if (propertyName in properties) {
                        diffPropertyResults[propertyName] = result.value;
                    }
                }
            }
            if (runReactions) {
                this._mapDiffPropertyReactions(properties, changedPropertyKeys).forEach((args, reaction) => {
                    if (args.changed) {
                        reaction.call(this, args.previousProperties, args.newProperties);
                    }
                });
            }
            this._properties = diffPropertyResults;
            this._changedPropertyKeys = changedPropertyKeys;
        }
        else {
            this._initialProperties = false;
            for (let i = 0; i < propertyNames.length; i++) {
                const propertyName = propertyNames[i];
                if (typeof properties[propertyName] === 'function') {
                    properties[propertyName] = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                }
                else {
                    changedPropertyKeys.push(propertyName);
                }
            }
            this._changedPropertyKeys = changedPropertyKeys;
            this._properties = Object.assign({}, properties);
        }
        if (this._changedPropertyKeys.length > 0) {
            this.invalidate();
        }
    }
    get children() {
        return this._children;
    }
    __setChildren__(children) {
        if (this._children.length > 0 || children.length > 0) {
            this._children = children;
            this.invalidate();
        }
    }
    __render__() {
        const instanceData = __WEBPACK_IMPORTED_MODULE_7__vdom__["b" /* widgetInstanceMap */].get(this);
        instanceData.dirty = false;
        const render = this._runBeforeRenders();
        let dNode = render();
        dNode = this.runAfterRenders(dNode);
        this._nodeHandler.clear();
        return dNode;
    }
    invalidate() {
        const instanceData = __WEBPACK_IMPORTED_MODULE_7__vdom__["b" /* widgetInstanceMap */].get(this);
        if (instanceData.invalidate) {
            instanceData.invalidate();
        }
    }
    render() {
        return Object(__WEBPACK_IMPORTED_MODULE_3__d__["g" /* v */])('div', {}, this.children);
    }
    /**
     * Function to add decorators to WidgetBase
     *
     * @param decoratorKey The key of the decorator
     * @param value The value of the decorator
     */
    addDecorator(decoratorKey, value) {
        value = Array.isArray(value) ? value : [value];
        if (this.hasOwnProperty('constructor')) {
            let decoratorList = decoratorMap.get(this.constructor);
            if (!decoratorList) {
                decoratorList = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
                decoratorMap.set(this.constructor, decoratorList);
            }
            let specificDecoratorList = decoratorList.get(decoratorKey);
            if (!specificDecoratorList) {
                specificDecoratorList = [];
                decoratorList.set(decoratorKey, specificDecoratorList);
            }
            specificDecoratorList.push(...value);
        }
        else {
            const decorators = this.getDecorator(decoratorKey);
            this._decoratorCache.set(decoratorKey, [...decorators, ...value]);
        }
    }
    /**
     * Function to build the list of decorators from the global decorator map.
     *
     * @param decoratorKey  The key of the decorator
     * @return An array of decorator values
     * @private
     */
    _buildDecoratorList(decoratorKey) {
        const allDecorators = [];
        let constructor = this.constructor;
        while (constructor) {
            const instanceMap = decoratorMap.get(constructor);
            if (instanceMap) {
                const decorators = instanceMap.get(decoratorKey);
                if (decorators) {
                    allDecorators.unshift(...decorators);
                }
            }
            constructor = Object.getPrototypeOf(constructor);
        }
        return allDecorators;
    }
    /**
     * Function to retrieve decorator values
     *
     * @param decoratorKey The key of the decorator
     * @returns An array of decorator values
     */
    getDecorator(decoratorKey) {
        let allDecorators = this._decoratorCache.get(decoratorKey);
        if (allDecorators !== undefined) {
            return allDecorators;
        }
        allDecorators = this._buildDecoratorList(decoratorKey);
        this._decoratorCache.set(decoratorKey, allDecorators);
        return allDecorators;
    }
    _mapDiffPropertyReactions(newProperties, changedPropertyKeys) {
        const reactionFunctions = this.getDecorator('diffReaction');
        return reactionFunctions.reduce((reactionPropertyMap, { reaction, propertyName }) => {
            let reactionArguments = reactionPropertyMap.get(reaction);
            if (reactionArguments === undefined) {
                reactionArguments = {
                    previousProperties: {},
                    newProperties: {},
                    changed: false
                };
            }
            reactionArguments.previousProperties[propertyName] = this._properties[propertyName];
            reactionArguments.newProperties[propertyName] = newProperties[propertyName];
            if (changedPropertyKeys.indexOf(propertyName) !== -1) {
                reactionArguments.changed = true;
            }
            reactionPropertyMap.set(reaction, reactionArguments);
            return reactionPropertyMap;
        }, new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]());
    }
    /**
     * Binds unbound property functions to the specified `bind` property
     *
     * @param properties properties to check for functions
     */
    _bindFunctionProperty(property, bind) {
        if (typeof property === 'function' && !property[noBind] && Object(__WEBPACK_IMPORTED_MODULE_8__Registry__["d" /* isWidgetBaseConstructor */])(property) === false) {
            if (this._bindFunctionPropertyMap === undefined) {
                this._bindFunctionPropertyMap = new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_WeakMap__["a" /* default */]();
            }
            const bindInfo = this._bindFunctionPropertyMap.get(property) || {};
            let { boundFunc, scope } = bindInfo;
            if (boundFunc === undefined || scope !== bind) {
                boundFunc = property.bind(bind);
                this._bindFunctionPropertyMap.set(property, { boundFunc, scope: bind });
            }
            return boundFunc;
        }
        return property;
    }
    get registry() {
        if (this._registry === undefined) {
            this._registry = new __WEBPACK_IMPORTED_MODULE_5__RegistryHandler__["a" /* default */]();
            this.own(this._registry);
            this.own(this._registry.on('invalidate', this._boundInvalidate));
        }
        return this._registry;
    }
    _runBeforeProperties(properties) {
        const beforeProperties = this.getDecorator('beforeProperties');
        if (beforeProperties.length > 0) {
            return beforeProperties.reduce((properties, beforePropertiesFunction) => {
                return Object.assign({}, properties, beforePropertiesFunction.call(this, properties));
            }, Object.assign({}, properties));
        }
        return properties;
    }
    /**
     * Run all registered before renders and return the updated render method
     */
    _runBeforeRenders() {
        const beforeRenders = this.getDecorator('beforeRender');
        if (beforeRenders.length > 0) {
            return beforeRenders.reduce((render, beforeRenderFunction) => {
                const updatedRender = beforeRenderFunction.call(this, render, this._properties, this._children);
                if (!updatedRender) {
                    console.warn('Render function not returned from beforeRender, using previous render');
                    return render;
                }
                return updatedRender;
            }, this._boundRenderFunc);
        }
        return this._boundRenderFunc;
    }
    /**
     * Run all registered after renders and return the decorated DNodes
     *
     * @param dNode The DNodes to run through the after renders
     */
    runAfterRenders(dNode) {
        const afterRenders = this.getDecorator('afterRender');
        if (afterRenders.length > 0) {
            return afterRenders.reduce((dNode, afterRenderFunction) => {
                return afterRenderFunction.call(this, dNode);
            }, dNode);
        }
        if (this._metaMap !== undefined) {
            this._metaMap.forEach((meta) => {
                meta.afterRender();
            });
        }
        return dNode;
    }
    _runAfterConstructors() {
        const afterConstructors = this.getDecorator('afterConstructor');
        if (afterConstructors.length > 0) {
            afterConstructors.forEach((afterConstructor) => afterConstructor.call(this));
        }
    }
    own(handle) {
        this._handles.push(handle);
    }
    destroy() {
        while (this._handles.length > 0) {
            const handle = this._handles.pop();
            if (handle) {
                handle.destroy();
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WidgetBase;

/**
 * static identifier
 */
WidgetBase._type = __WEBPACK_IMPORTED_MODULE_8__Registry__["b" /* WIDGET_BASE_TYPE */];
/* unused harmony default export */ var _unused_webpack_default_export = (WidgetBase);
//# sourceMappingURL=WidgetBase.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/animations/cssTransitions.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let browserSpecificTransitionEndEventName = '';
let browserSpecificAnimationEndEventName = '';
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
    let finished = false;
    let transitionEnd = function () {
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
    const activeClass = properties.exitAnimationActive || `${exitAnimation}-active`;
    runAndCleanUp(node, () => {
        node.classList.add(exitAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, () => {
        removeNode();
    });
}
function enter(node, properties, enterAnimation) {
    const activeClass = properties.enterAnimationActive || `${enterAnimation}-active`;
    runAndCleanUp(node, () => {
        node.classList.add(enterAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, () => {
        node.classList.remove(enterAnimation);
        node.classList.remove(activeClass);
    });
}
/* harmony default export */ __webpack_exports__["a"] = ({
    enter,
    exit
});
//# sourceMappingURL=cssTransitions.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/d.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["f"] = isWNode;
/* harmony export (immutable) */ __webpack_exports__["e"] = isVNode;
/* harmony export (immutable) */ __webpack_exports__["d"] = isDomVNode;
/* unused harmony export isElementNode */
/* unused harmony export decorate */
/* harmony export (immutable) */ __webpack_exports__["h"] = w;
/* harmony export (immutable) */ __webpack_exports__["g"] = v;
/* harmony export (immutable) */ __webpack_exports__["c"] = dom;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Symbol__ = __webpack_require__("./node_modules/@dojo/shim/Symbol.mjs");

/**
 * The symbol identifier for a WNode type
 */
const WNODE = Object(__WEBPACK_IMPORTED_MODULE_0__dojo_shim_Symbol__["a" /* default */])('Identifier for a WNode.');
/* harmony export (immutable) */ __webpack_exports__["b"] = WNODE;

/**
 * The symbol identifier for a VNode type
 */
const VNODE = Object(__WEBPACK_IMPORTED_MODULE_0__dojo_shim_Symbol__["a" /* default */])('Identifier for a VNode.');
/* harmony export (immutable) */ __webpack_exports__["a"] = VNODE;

/**
 * The symbol identifier for a VNode type created using dom()
 */
const DOMVNODE = Object(__WEBPACK_IMPORTED_MODULE_0__dojo_shim_Symbol__["a" /* default */])('Identifier for a VNode created using existing dom.');
/* unused harmony export DOMVNODE */

/**
 * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
 */
function isWNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === WNODE);
}
/**
 * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
 */
function isVNode(child) {
    return Boolean(child && typeof child !== 'string' && (child.type === VNODE || child.type === DOMVNODE));
}
/**
 * Helper function that returns true if the `DNode` is a `VNode` created with `dom()` using the `type` property
 */
function isDomVNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === DOMVNODE);
}
function isElementNode(value) {
    return !!value.tagName;
}
function decorate(dNodes, optionsOrModifier, predicate) {
    let shallow = false;
    let modifier;
    if (typeof optionsOrModifier === 'function') {
        modifier = optionsOrModifier;
    }
    else {
        modifier = optionsOrModifier.modifier;
        predicate = optionsOrModifier.predicate;
        shallow = optionsOrModifier.shallow || false;
    }
    let nodes = Array.isArray(dNodes) ? [...dNodes] : [dNodes];
    function breaker() {
        nodes = [];
    }
    while (nodes.length) {
        const node = nodes.shift();
        if (node) {
            if (!shallow && (isWNode(node) || isVNode(node)) && node.children) {
                nodes = [...nodes, ...node.children];
            }
            if (!predicate || predicate(node)) {
                modifier(node, breaker);
            }
        }
    }
    return dNodes;
}
/**
 * Wrapper function for calls to create a widget.
 */
function w(widgetConstructor, properties, children = []) {
    return {
        children,
        widgetConstructor,
        properties,
        type: WNODE
    };
}
function v(tag, propertiesOrChildren = {}, children = undefined) {
    let properties = propertiesOrChildren;
    let deferredPropertiesCallback;
    if (Array.isArray(propertiesOrChildren)) {
        children = propertiesOrChildren;
        properties = {};
    }
    if (typeof properties === 'function') {
        deferredPropertiesCallback = properties;
        properties = {};
    }
    return {
        tag,
        deferredPropertiesCallback,
        children,
        properties,
        type: VNODE
    };
}
/**
 * Create a VNode for an existing DOM Node.
 */
function dom({ node, attrs = {}, props = {}, on = {}, diffType = 'none' }, children) {
    return {
        tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
        properties: props,
        attributes: attrs,
        events: on,
        children,
        type: DOMVNODE,
        domNode: node,
        text: isElementNode(node) ? undefined : node.data,
        diffType
    };
}
//# sourceMappingURL=d.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/afterRender.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = afterRender;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");

function afterRender(method) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (afterRender);
//# sourceMappingURL=afterRender.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/alwaysRender.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = alwaysRender;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__beforeProperties__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/beforeProperties.mjs");


function alwaysRender() {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__beforeProperties__["a" /* beforeProperties */])(function () {
            this.invalidate();
        })(target);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (alwaysRender);
//# sourceMappingURL=alwaysRender.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/beforeProperties.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = beforeProperties;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");

function beforeProperties(method) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (beforeProperties);
//# sourceMappingURL=beforeProperties.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/customElement.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = customElement;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__registerCustomElement__ = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");


/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
function customElement({ tag, properties = [], attributes = [], events = [], childType = __WEBPACK_IMPORTED_MODULE_0__registerCustomElement__["CustomElementChildType"].DOJO, registryFactory = () => new __WEBPACK_IMPORTED_MODULE_1__Registry__["c" /* default */]() }) {
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            attributes,
            properties,
            events,
            childType,
            registryFactory
        };
    };
}
/* unused harmony default export */ var _unused_webpack_default_export = (customElement);
//# sourceMappingURL=customElement.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/diffProperty.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = diffProperty;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");

/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
function diffProperty(propertyName, diffFunction, reactionFunction) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        target.addDecorator(`diffProperty:${propertyName}`, diffFunction.bind(null));
        target.addDecorator('registeredDiffProperty', propertyName);
        if (reactionFunction || propertyKey) {
            target.addDecorator('diffReaction', {
                propertyName,
                reaction: propertyKey ? target[propertyKey] : reactionFunction
            });
        }
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (diffProperty);
//# sourceMappingURL=diffProperty.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = handleDecorator;
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
/* unused harmony default export */ var _unused_webpack_default_export = (handleDecorator);
//# sourceMappingURL=handleDecorator.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/inject.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = inject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/shim/WeakMap.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__beforeProperties__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/beforeProperties.mjs");



/**
 * Map of instances against registered injectors.
 */
const registeredInjectorsMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_WeakMap__["a" /* default */]();
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
function inject({ name, getProperties }) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        Object(__WEBPACK_IMPORTED_MODULE_2__beforeProperties__["a" /* beforeProperties */])(function (properties) {
            const injectorItem = this.registry.getInjector(name);
            if (injectorItem) {
                const { injector, invalidator } = injectorItem;
                const registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injectorItem) === -1) {
                    this.own(invalidator.on('invalidate', () => {
                        this.invalidate();
                    }));
                    registeredInjectors.push(injectorItem);
                }
                return getProperties(injector(), properties);
            }
        })(target);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (inject);
//# sourceMappingURL=inject.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/diff.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export always */
/* unused harmony export ignore */
/* unused harmony export reference */
/* harmony export (immutable) */ __webpack_exports__["b"] = shallow;
/* harmony export (immutable) */ __webpack_exports__["a"] = auto;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");

function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}
function always(previousProperty, newProperty) {
    return {
        changed: true,
        value: newProperty
    };
}
function ignore(previousProperty, newProperty) {
    return {
        changed: false,
        value: newProperty
    };
}
function reference(previousProperty, newProperty) {
    return {
        changed: previousProperty !== newProperty,
        value: newProperty
    };
}
function shallow(previousProperty, newProperty) {
    let changed = false;
    const validOldProperty = previousProperty && isObjectOrArray(previousProperty);
    const validNewProperty = newProperty && isObjectOrArray(newProperty);
    if (!validOldProperty || !validNewProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    const previousKeys = Object.keys(previousProperty);
    const newKeys = Object.keys(newProperty);
    if (previousKeys.length !== newKeys.length) {
        changed = true;
    }
    else {
        changed = newKeys.some((key) => {
            return newProperty[key] !== previousProperty[key];
        });
    }
    return {
        changed,
        value: newProperty
    };
}
function auto(previousProperty, newProperty) {
    let result;
    if (typeof newProperty === 'function') {
        if (newProperty._type === __WEBPACK_IMPORTED_MODULE_0__Registry__["b" /* WIDGET_BASE_TYPE */]) {
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
//# sourceMappingURL=diff.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Projector.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ProjectorAttachState */
/* unused harmony export AttachType */
/* harmony export (immutable) */ __webpack_exports__["a"] = ProjectorMixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_core_lang__ = __webpack_require__("./node_modules/@dojo/core/lang.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__animations_cssTransitions__ = __webpack_require__("./node_modules/@dojo/widget-core/animations/cssTransitions.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__decorators_afterRender__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/afterRender.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vdom__ = __webpack_require__("./node_modules/@dojo/widget-core/vdom.mjs");






/**
 * Represents the attach state of the projector
 */
var ProjectorAttachState;
(function (ProjectorAttachState) {
    ProjectorAttachState[ProjectorAttachState["Attached"] = 1] = "Attached";
    ProjectorAttachState[ProjectorAttachState["Detached"] = 2] = "Detached";
})(ProjectorAttachState || (ProjectorAttachState = {}));
/**
 * Attach type for the projector
 */
var AttachType;
(function (AttachType) {
    AttachType[AttachType["Append"] = 1] = "Append";
    AttachType[AttachType["Merge"] = 2] = "Merge";
})(AttachType || (AttachType = {}));
function ProjectorMixin(Base) {
    class Projector extends Base {
        constructor(...args) {
            super(...args);
            this._root = document.body;
            this._async = true;
            this._projectorProperties = {};
            this._projectionOptions = {
                transitions: __WEBPACK_IMPORTED_MODULE_2__animations_cssTransitions__["a" /* default */]
            };
            this.root = document.body;
            this.projectorState = ProjectorAttachState.Detached;
        }
        append(root) {
            const options = {
                type: AttachType.Append,
                root
            };
            return this._attach(options);
        }
        merge(root) {
            const options = {
                type: AttachType.Merge,
                root
            };
            return this._attach(options);
        }
        set root(root) {
            if (this.projectorState === ProjectorAttachState.Attached) {
                throw new Error('Projector already attached, cannot change root element');
            }
            this._root = root;
        }
        get root() {
            return this._root;
        }
        get async() {
            return this._async;
        }
        set async(async) {
            if (this.projectorState === ProjectorAttachState.Attached) {
                throw new Error('Projector already attached, cannot change async mode');
            }
            this._async = async;
        }
        sandbox(doc = document) {
            if (this.projectorState === ProjectorAttachState.Attached) {
                throw new Error('Projector already attached, cannot create sandbox');
            }
            this._async = false;
            const previousRoot = this.root;
            /* free up the document fragment for GC */
            this.own({
                destroy: () => {
                    this._root = previousRoot;
                }
            });
            this._attach({
                /* DocumentFragment is not assignable to Element, but provides everything needed to work */
                root: doc.createDocumentFragment(),
                type: AttachType.Append
            });
        }
        setChildren(children) {
            this.__setChildren__(children);
        }
        setProperties(properties) {
            this.__setProperties__(properties);
        }
        __setProperties__(properties) {
            if (this._projectorProperties && this._projectorProperties.registry !== properties.registry) {
                if (this._projectorProperties.registry) {
                    this._projectorProperties.registry.destroy();
                }
            }
            this._projectorProperties = Object(__WEBPACK_IMPORTED_MODULE_1__dojo_core_lang__["a" /* assign */])({}, properties);
            super.__setCoreProperties__({ bind: this, baseRegistry: properties.registry });
            super.__setProperties__(properties);
        }
        toHtml() {
            if (this.projectorState !== ProjectorAttachState.Attached || !this._projection) {
                throw new Error('Projector is not attached, cannot return an HTML string of projection.');
            }
            return this._projection.domNode.childNodes[0].outerHTML;
        }
        afterRender(result) {
            let node = result;
            if (typeof result === 'string' || result === null || result === undefined) {
                node = Object(__WEBPACK_IMPORTED_MODULE_4__d__["g" /* v */])('span', {}, [result]);
            }
            return node;
        }
        destroy() {
            super.destroy();
        }
        _attach({ type, root }) {
            if (root) {
                this.root = root;
            }
            if (this._attachHandle) {
                return this._attachHandle;
            }
            this.projectorState = ProjectorAttachState.Attached;
            const handle = {
                destroy: () => {
                    if (this.projectorState === ProjectorAttachState.Attached) {
                        this._projection = undefined;
                        this.projectorState = ProjectorAttachState.Detached;
                    }
                }
            };
            this.own(handle);
            this._attachHandle = handle;
            this._projectionOptions = Object.assign({}, this._projectionOptions, { sync: !this._async });
            switch (type) {
                case AttachType.Append:
                    this._projection = __WEBPACK_IMPORTED_MODULE_5__vdom__["a" /* dom */].append(this.root, this, this._projectionOptions);
                    break;
                case AttachType.Merge:
                    this._projection = __WEBPACK_IMPORTED_MODULE_5__vdom__["a" /* dom */].merge(this.root, this, this._projectionOptions);
                    break;
            }
            return this._attachHandle;
        }
    }
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
        Object(__WEBPACK_IMPORTED_MODULE_3__decorators_afterRender__["a" /* afterRender */])(),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:type", Function),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:paramtypes", [Object]),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:returntype", void 0)
    ], Projector.prototype, "afterRender", null);
    return Projector;
}
/* unused harmony default export */ var _unused_webpack_default_export = (ProjectorMixin);
//# sourceMappingURL=Projector.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Themed.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = theme;
/* harmony export (immutable) */ __webpack_exports__["b"] = registerThemeInjector;
/* harmony export (immutable) */ __webpack_exports__["a"] = ThemedMixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Injector__ = __webpack_require__("./node_modules/@dojo/widget-core/Injector.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__decorators_inject__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/inject.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__decorators_handleDecorator__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__decorators_diffProperty__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/diffProperty.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__diff__ = __webpack_require__("./node_modules/@dojo/widget-core/diff.mjs");






const THEME_KEY = ' _key';
const INJECTED_THEME_KEY = Symbol('theme');
/* unused harmony export INJECTED_THEME_KEY */

/**
 * Decorator for base css classes
 */
function theme(theme) {
    return Object(__WEBPACK_IMPORTED_MODULE_3__decorators_handleDecorator__["a" /* handleDecorator */])((target) => {
        target.addDecorator('baseThemeClasses', theme);
    });
}
/**
 * Creates a reverse lookup for the classes passed in via the `theme` function.
 *
 * @param classes The baseClasses object
 * @requires
 */
function createThemeClassesLookup(classes) {
    return classes.reduce((currentClassNames, baseClass) => {
        Object.keys(baseClass).forEach((key) => {
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
    const themeInjector = new __WEBPACK_IMPORTED_MODULE_1__Injector__["a" /* Injector */](theme);
    themeRegistry.defineInjector(INJECTED_THEME_KEY, (invalidator) => {
        themeInjector.setInvalidator(invalidator);
        return () => themeInjector.get();
    });
    return themeInjector;
}
/**
 * Function that returns a class decorated with with Themed functionality
 */
function ThemedMixin(Base) {
    let Themed = class Themed extends Base {
        constructor() {
            super(...arguments);
            /**
             * Registered base theme keys
             */
            this._registeredBaseThemeKeys = [];
            /**
             * Indicates if classes meta data need to be calculated.
             */
            this._recalculateClasses = true;
            /**
             * Loaded theme
             */
            this._theme = {};
        }
        theme(classes) {
            if (this._recalculateClasses) {
                this._recalculateThemeClasses();
            }
            if (Array.isArray(classes)) {
                return classes.map((className) => this._getThemeClass(className));
            }
            return this._getThemeClass(classes);
        }
        /**
         * Function fired when `theme` or `extraClasses` are changed.
         */
        onPropertiesChanged() {
            this._recalculateClasses = true;
        }
        _getThemeClass(className) {
            if (className === undefined || className === null) {
                return className;
            }
            const extraClasses = this.properties.extraClasses || {};
            const themeClassName = this._baseThemeClassesReverseLookup[className];
            let resultClassNames = [];
            if (!themeClassName) {
                console.warn(`Class name: '${className}' not found in theme`);
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
        }
        _recalculateThemeClasses() {
            const { theme = {} } = this.properties;
            const baseThemes = this.getDecorator('baseThemeClasses');
            if (!this._registeredBaseTheme) {
                this._registeredBaseTheme = baseThemes.reduce((finalBaseTheme, baseTheme) => {
                    const _a = THEME_KEY, key = baseTheme[_a], classes = __WEBPACK_IMPORTED_MODULE_0_tslib__["c" /* __rest */](baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
                    this._registeredBaseThemeKeys.push(key);
                    return Object.assign({}, finalBaseTheme, classes);
                }, {});
                this._baseThemeClassesReverseLookup = createThemeClassesLookup(baseThemes);
            }
            this._theme = this._registeredBaseThemeKeys.reduce((baseTheme, themeKey) => {
                return Object.assign({}, baseTheme, theme[themeKey]);
            }, {});
            this._recalculateClasses = false;
        }
    };
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
        Object(__WEBPACK_IMPORTED_MODULE_4__decorators_diffProperty__["a" /* diffProperty */])('theme', __WEBPACK_IMPORTED_MODULE_5__diff__["b" /* shallow */]),
        Object(__WEBPACK_IMPORTED_MODULE_4__decorators_diffProperty__["a" /* diffProperty */])('extraClasses', __WEBPACK_IMPORTED_MODULE_5__diff__["b" /* shallow */]),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:type", Function),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:paramtypes", []),
        __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __metadata */]("design:returntype", void 0)
    ], Themed.prototype, "onPropertiesChanged", null);
    Themed = __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
        Object(__WEBPACK_IMPORTED_MODULE_2__decorators_inject__["a" /* inject */])({
            name: INJECTED_THEME_KEY,
            getProperties: (theme, properties) => {
                if (!properties.theme) {
                    return { theme };
                }
                return {};
            }
        })
    ], Themed);
    return Themed;
}
/* unused harmony default export */ var _unused_webpack_default_export = (ThemedMixin);
//# sourceMappingURL=Themed.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/registerCustomElement.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomElementChildType", function() { return CustomElementChildType; });
/* harmony export (immutable) */ __webpack_exports__["DomToWidgetWrapper"] = DomToWidgetWrapper;
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["register"] = register;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WidgetBase__ = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_Projector__ = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dojo_shim_array__ = __webpack_require__("./node_modules/@dojo/shim/array.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Themed__ = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__decorators_alwaysRender__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/alwaysRender.mjs");








var CustomElementChildType;
(function (CustomElementChildType) {
    CustomElementChildType["DOJO"] = "DOJO";
    CustomElementChildType["NODE"] = "NODE";
    CustomElementChildType["TEXT"] = "TEXT";
})(CustomElementChildType || (CustomElementChildType = {}));
function DomToWidgetWrapper(domNode) {
    let DomToWidgetWrapper = class DomToWidgetWrapper extends __WEBPACK_IMPORTED_MODULE_1__WidgetBase__["a" /* WidgetBase */] {
        render() {
            const properties = Object.keys(this.properties).reduce((props, key) => {
                const value = this.properties[key];
                if (key.indexOf('on') === 0) {
                    key = `__${key}`;
                }
                props[key] = value;
                return props;
            }, {});
            return Object(__WEBPACK_IMPORTED_MODULE_4__d__["c" /* dom */])({ node: domNode, props: properties, diffType: 'dom' });
        }
        static get domNode() {
            return domNode;
        }
    };
    DomToWidgetWrapper = __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
        Object(__WEBPACK_IMPORTED_MODULE_7__decorators_alwaysRender__["a" /* alwaysRender */])()
    ], DomToWidgetWrapper);
    return DomToWidgetWrapper;
}
function create(descriptor, WidgetConstructor) {
    const { attributes, childType, registryFactory } = descriptor;
    const attributeMap = {};
    attributes.forEach((propertyName) => {
        const attributeName = propertyName.toLowerCase();
        attributeMap[attributeName] = propertyName;
    });
    return class extends HTMLElement {
        constructor() {
            super(...arguments);
            this._properties = {};
            this._children = [];
            this._eventProperties = {};
            this._initialised = false;
        }
        connectedCallback() {
            if (this._initialised) {
                return;
            }
            const domProperties = {};
            const { attributes, properties, events } = descriptor;
            this._properties = Object.assign({}, this._properties, this._attributesToProperties(attributes));
            [...attributes, ...properties].forEach((propertyName) => {
                const value = this[propertyName];
                const filteredPropertyName = propertyName.replace(/^on/, '__');
                if (value !== undefined) {
                    this._properties[propertyName] = value;
                }
                if (filteredPropertyName !== propertyName) {
                    domProperties[filteredPropertyName] = {
                        get: () => this._getProperty(propertyName),
                        set: (value) => this._setProperty(propertyName, value)
                    };
                }
                domProperties[propertyName] = {
                    get: () => this._getProperty(propertyName),
                    set: (value) => this._setProperty(propertyName, value)
                };
            });
            events.forEach((propertyName) => {
                const eventName = propertyName.replace(/^on/, '').toLowerCase();
                const filteredPropertyName = propertyName.replace(/^on/, '__on');
                domProperties[filteredPropertyName] = {
                    get: () => this._getEventProperty(propertyName),
                    set: (value) => this._setEventProperty(propertyName, value)
                };
                this._eventProperties[propertyName] = undefined;
                this._properties[propertyName] = (...args) => {
                    const eventCallback = this._getEventProperty(propertyName);
                    if (typeof eventCallback === 'function') {
                        eventCallback(...args);
                    }
                    this.dispatchEvent(new CustomEvent(eventName, {
                        bubbles: false,
                        detail: args
                    }));
                };
            });
            Object.defineProperties(this, domProperties);
            const children = childType === CustomElementChildType.TEXT ? this.childNodes : this.children;
            Object(__WEBPACK_IMPORTED_MODULE_3__dojo_shim_array__["a" /* from */])(children).forEach((childNode) => {
                if (childType === CustomElementChildType.DOJO) {
                    childNode.addEventListener('dojo-ce-render', () => this._render());
                    childNode.addEventListener('dojo-ce-connected', () => this._render());
                    this._children.push(DomToWidgetWrapper(childNode));
                }
                else {
                    this._children.push(Object(__WEBPACK_IMPORTED_MODULE_4__d__["c" /* dom */])({ node: childNode, diffType: 'dom' }));
                }
            });
            this.addEventListener('dojo-ce-connected', (e) => this._childConnected(e));
            const widgetProperties = this._properties;
            const renderChildren = () => this.__children__();
            const Wrapper = class extends __WEBPACK_IMPORTED_MODULE_1__WidgetBase__["a" /* WidgetBase */] {
                render() {
                    return Object(__WEBPACK_IMPORTED_MODULE_4__d__["h" /* w */])(WidgetConstructor, widgetProperties, renderChildren());
                }
            };
            const registry = registryFactory();
            const themeContext = Object(__WEBPACK_IMPORTED_MODULE_6__mixins_Themed__["b" /* registerThemeInjector */])(this._getTheme(), registry);
            __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].addEventListener('dojo-theme-set', () => themeContext.set(this._getTheme()));
            const Projector = Object(__WEBPACK_IMPORTED_MODULE_2__mixins_Projector__["a" /* ProjectorMixin */])(Wrapper);
            this._projector = new Projector();
            this._projector.setProperties({ registry });
            this._projector.append(this);
            this._initialised = true;
            this.dispatchEvent(new CustomEvent('dojo-ce-connected', {
                bubbles: true,
                detail: this
            }));
        }
        _getTheme() {
            if (__WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */] && __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].dojoce && __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].dojoce.theme) {
                return __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].dojoce.themes[__WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].dojoce.theme];
            }
        }
        _childConnected(e) {
            const node = e.detail;
            if (node.parentNode === this) {
                const exists = this._children.some((child) => child.domNode === node);
                if (!exists) {
                    node.addEventListener('dojo-ce-render', () => this._render());
                    this._children.push(DomToWidgetWrapper(node));
                    this._render();
                }
            }
        }
        _render() {
            if (this._projector) {
                this._projector.invalidate();
                this.dispatchEvent(new CustomEvent('dojo-ce-render', {
                    bubbles: false,
                    detail: this
                }));
            }
        }
        __properties__() {
            return Object.assign({}, this._properties, this._eventProperties);
        }
        __children__() {
            if (childType === CustomElementChildType.DOJO) {
                return this._children.filter((Child) => Child.domNode.isWidget).map((Child) => {
                    const { domNode } = Child;
                    return Object(__WEBPACK_IMPORTED_MODULE_4__d__["h" /* w */])(Child, Object.assign({}, domNode.__properties__()), [...domNode.__children__()]);
                });
            }
            else {
                return this._children;
            }
        }
        attributeChangedCallback(name, oldValue, value) {
            const propertyName = attributeMap[name];
            this._setProperty(propertyName, value);
        }
        _setEventProperty(propertyName, value) {
            this._eventProperties[propertyName] = value;
        }
        _getEventProperty(propertyName) {
            return this._eventProperties[propertyName];
        }
        _setProperty(propertyName, value) {
            if (typeof value === 'function') {
                value[__WEBPACK_IMPORTED_MODULE_1__WidgetBase__["b" /* noBind */]] = true;
            }
            this._properties[propertyName] = value;
            this._render();
        }
        _getProperty(propertyName) {
            return this._properties[propertyName];
        }
        _attributesToProperties(attributes) {
            return attributes.reduce((properties, propertyName) => {
                const attributeName = propertyName.toLowerCase();
                const value = this.getAttribute(attributeName);
                if (value !== null) {
                    properties[propertyName] = value;
                }
                return properties;
            }, {});
        }
        static get observedAttributes() {
            return Object.keys(attributeMap);
        }
        get isWidget() {
            return true;
        }
    };
}
function register(WidgetConstructor) {
    const descriptor = WidgetConstructor.prototype && WidgetConstructor.prototype.__customElementDescriptor;
    if (!descriptor) {
        throw new Error('Cannot get descriptor for Custom Element, have you added the @customElement decorator to your Widget?');
    }
    __WEBPACK_IMPORTED_MODULE_5__dojo_shim_global__["a" /* default */].customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
}
/* harmony default export */ __webpack_exports__["default"] = (register);
//# sourceMappingURL=registerCustomElement.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/widget-core/vdom.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export toParentVNode */
/* unused harmony export toTextVNode */
/* unused harmony export filterAndDecorateChildren */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_shim_array__ = __webpack_require__("./node_modules/@dojo/shim/array.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/shim/WeakMap.mjs");





const NAMESPACE_W3 = 'http://www.w3.org/';
const NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
const NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
const emptyArray = [];
const widgetInstanceMap = new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
/* harmony export (immutable) */ __webpack_exports__["b"] = widgetInstanceMap;

const instanceMap = new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
const projectorStateMap = new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
function same(dnode1, dnode2) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(dnode1) && Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(dnode2)) {
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isDomVNode */])(dnode1) || Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isDomVNode */])(dnode2)) {
            if (dnode1.domNode !== dnode2.domNode) {
                return false;
            }
        }
        if (dnode1.tag !== dnode2.tag) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    else if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode1) && Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode2)) {
        if (dnode1.instance === undefined && typeof dnode2.widgetConstructor === 'string') {
            return false;
        }
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
const missingTransition = function () {
    throw new Error('Provide a transitions object to the projectionOptions to do animations');
};
function getProjectionOptions(projectorOptions, projectorInstance) {
    const defaults = {
        namespace: undefined,
        styleApplyer: function (domNode, styleName, value) {
            domNode.style[styleName] = value;
        },
        transitions: {
            enter: missingTransition,
            exit: missingTransition
        },
        depth: 0,
        merge: false,
        sync: false,
        projectorInstance
    };
    return Object.assign({}, defaults, projectorOptions);
}
function checkStyleValue(styleValue) {
    if (typeof styleValue !== 'string') {
        throw new Error('Style values must be strings');
    }
}
function updateEvent(domNode, eventName, currentValue, projectionOptions, bind, previousValue) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    const eventMap = projectorState.nodeMap.get(domNode) || new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
    if (previousValue) {
        const previousEvent = eventMap.get(previousValue);
        domNode.removeEventListener(eventName, previousEvent);
    }
    let callback = currentValue.bind(bind);
    if (eventName === 'input') {
        callback = function (evt) {
            currentValue.call(this, evt);
            evt.target['oninput-value'] = evt.target.value;
        }.bind(bind);
    }
    domNode.addEventListener(eventName, callback);
    eventMap.set(currentValue, callback);
    projectorState.nodeMap.set(domNode, eventMap);
}
function addClasses(domNode, classes) {
    if (classes) {
        const classNames = classes.split(' ');
        for (let i = 0; i < classNames.length; i++) {
            domNode.classList.add(classNames[i]);
        }
    }
}
function removeClasses(domNode, classes) {
    if (classes) {
        const classNames = classes.split(' ');
        for (let i = 0; i < classNames.length; i++) {
            domNode.classList.remove(classNames[i]);
        }
    }
}
function buildPreviousProperties(domNode, previous, current) {
    const { diffType, properties, attributes } = current;
    if (!diffType || diffType === 'vdom') {
        return { properties: previous.properties, attributes: previous.attributes, events: previous.events };
    }
    else if (diffType === 'none') {
        return { properties: {}, attributes: previous.attributes ? {} : undefined, events: previous.events };
    }
    let newProperties = {
        properties: {}
    };
    if (attributes) {
        newProperties.attributes = {};
        newProperties.events = previous.events;
        Object.keys(properties).forEach((propName) => {
            newProperties.properties[propName] = domNode[propName];
        });
        Object.keys(attributes).forEach((attrName) => {
            newProperties.attributes[attrName] = domNode.getAttribute(attrName);
        });
        return newProperties;
    }
    newProperties.properties = Object.keys(properties).reduce((props, property) => {
        props[property] = domNode.getAttribute(property) || domNode[property];
        return props;
    }, {});
    return newProperties;
}
function focusNode(propValue, previousValue, domNode, projectionOptions) {
    let result;
    if (typeof propValue === 'function') {
        result = propValue();
    }
    else {
        result = propValue && !previousValue;
    }
    if (result === true) {
        const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        projectorState.deferredRenderCallbacks.push(() => {
            domNode.focus();
        });
    }
}
function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions, onlyEvents = false) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    const eventMap = projectorState.nodeMap.get(domNode);
    if (eventMap) {
        Object.keys(previousProperties).forEach((propName) => {
            const isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
            const eventName = onlyEvents ? propName : propName.substr(2);
            if (isEvent && !properties[propName]) {
                const eventCallback = eventMap.get(previousProperties[propName]);
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
    const attrNames = Object.keys(attributes);
    const attrCount = attrNames.length;
    for (let i = 0; i < attrCount; i++) {
        const attrName = attrNames[i];
        const attrValue = attributes[attrName];
        const previousAttrValue = previousAttributes[attrName];
        if (attrValue !== previousAttrValue) {
            updateAttribute(domNode, attrName, attrValue, projectionOptions);
        }
    }
}
function updateProperties(domNode, previousProperties, properties, projectionOptions, includesEventsAndAttributes = true) {
    let propertiesUpdated = false;
    const propNames = Object.keys(properties);
    const propCount = propNames.length;
    if (propNames.indexOf('classes') === -1 && previousProperties.classes) {
        if (Array.isArray(previousProperties.classes)) {
            for (let i = 0; i < previousProperties.classes.length; i++) {
                removeClasses(domNode, previousProperties.classes[i]);
            }
        }
        else {
            removeClasses(domNode, previousProperties.classes);
        }
    }
    includesEventsAndAttributes && removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions);
    for (let i = 0; i < propCount; i++) {
        const propName = propNames[i];
        let propValue = properties[propName];
        const previousValue = previousProperties[propName];
        if (propName === 'classes') {
            const previousClasses = Array.isArray(previousValue) ? previousValue : [previousValue];
            const currentClasses = Array.isArray(propValue) ? propValue : [propValue];
            if (previousClasses && previousClasses.length > 0) {
                if (!propValue || propValue.length === 0) {
                    for (let i = 0; i < previousClasses.length; i++) {
                        removeClasses(domNode, previousClasses[i]);
                    }
                }
                else {
                    const newClasses = [...currentClasses];
                    for (let i = 0; i < previousClasses.length; i++) {
                        const previousClassName = previousClasses[i];
                        if (previousClassName) {
                            const classIndex = newClasses.indexOf(previousClassName);
                            if (classIndex === -1) {
                                removeClasses(domNode, previousClassName);
                            }
                            else {
                                newClasses.splice(classIndex, 1);
                            }
                        }
                    }
                    for (let i = 0; i < newClasses.length; i++) {
                        addClasses(domNode, newClasses[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < currentClasses.length; i++) {
                    addClasses(domNode, currentClasses[i]);
                }
            }
        }
        else if (propName === 'focus') {
            focusNode(propValue, previousValue, domNode, projectionOptions);
        }
        else if (propName === 'styles') {
            const styleNames = Object.keys(propValue);
            const styleCount = styleNames.length;
            for (let j = 0; j < styleCount; j++) {
                const styleName = styleNames[j];
                const newStyleValue = propValue[styleName];
                const oldStyleValue = previousValue && previousValue[styleName];
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
                const domValue = domNode[propName];
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
                const type = typeof propValue;
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
    for (let i = start; i < children.length; i++) {
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
        domNode,
        type: __WEBPACK_IMPORTED_MODULE_2__d__["a" /* VNODE */]
    };
}
function toTextVNode(data) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        text: `${data}`,
        domNode: undefined,
        type: __WEBPACK_IMPORTED_MODULE_2__d__["a" /* VNODE */]
    };
}
function toInternalWNode(instance, instanceData) {
    return {
        instance,
        rendered: [],
        coreProperties: instanceData.coreProperties,
        children: instance.children,
        widgetConstructor: instance.constructor,
        properties: instanceData.inputProperties,
        type: __WEBPACK_IMPORTED_MODULE_2__d__["b" /* WNODE */]
    };
}
function filterAndDecorateChildren(children, instance) {
    if (children === undefined) {
        return emptyArray;
    }
    children = Array.isArray(children) ? children : [children];
    for (let i = 0; i < children.length;) {
        const child = children[i];
        if (child === undefined || child === null) {
            children.splice(i, 1);
            continue;
        }
        else if (typeof child === 'string') {
            children[i] = toTextVNode(child);
        }
        else {
            if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(child)) {
                if (child.properties.bind === undefined) {
                    child.properties.bind = instance;
                    if (child.children && child.children.length > 0) {
                        filterAndDecorateChildren(child.children, instance);
                    }
                }
            }
            else {
                if (!child.coreProperties) {
                    const instanceData = widgetInstanceMap.get(instance);
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
function nodeAdded(dnode, transitions) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(dnode) && dnode.properties) {
        const enterAnimation = dnode.properties.enterAnimation;
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
function nodeToRemove(dnode, transitions, projectionOptions) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode)) {
        const rendered = dnode.rendered || emptyArray;
        if (dnode.instance) {
            const instanceData = widgetInstanceMap.get(dnode.instance);
            instanceData.onDetach();
            instanceMap.delete(dnode.instance);
        }
        for (let i = 0; i < rendered.length; i++) {
            nodeToRemove(rendered[i], transitions, projectionOptions);
        }
    }
    else {
        const domNode = dnode.domNode;
        const properties = dnode.properties;
        if (dnode.children && dnode.children.length > 0) {
            for (let i = 0; i < dnode.children.length; i++) {
                nodeToRemove(dnode.children[i], transitions, projectionOptions);
            }
        }
        const exitAnimation = properties.exitAnimation;
        if (properties && exitAnimation) {
            domNode.style.pointerEvents = 'none';
            const removeDomNode = function () {
                domNode && domNode.parentNode && domNode.parentNode.removeChild(domNode);
                dnode.domNode = undefined;
            };
            if (typeof exitAnimation === 'function') {
                exitAnimation(domNode, removeDomNode, properties);
                return;
            }
            else {
                transitions.exit(dnode.domNode, properties, exitAnimation, removeDomNode);
                return;
            }
        }
        domNode && domNode.parentNode && domNode.parentNode.removeChild(domNode);
        dnode.domNode = undefined;
    }
}
function checkDistinguishable(childNodes, indexToCheck, parentInstance) {
    const childNode = childNodes[indexToCheck];
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(childNode) && !childNode.tag) {
        return; // Text nodes need not be distinguishable
    }
    const { key } = childNode.properties;
    if (key === undefined || key === null) {
        for (let i = 0; i < childNodes.length; i++) {
            if (i !== indexToCheck) {
                const node = childNodes[i];
                if (same(node, childNode)) {
                    let nodeIdentifier;
                    const parentName = parentInstance.constructor.name || 'unknown';
                    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(childNode)) {
                        nodeIdentifier = childNode.widgetConstructor.name || 'unknown';
                    }
                    else {
                        nodeIdentifier = childNode.tag;
                    }
                    console.warn(`A widget (${parentName}) has had a child addded or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (${nodeIdentifier}) multiple times as siblings`);
                    break;
                }
            }
        }
    }
}
function updateChildren(parentVNode, oldChildren, newChildren, parentInstance, projectionOptions) {
    oldChildren = oldChildren || emptyArray;
    newChildren = newChildren;
    const oldChildrenLength = oldChildren.length;
    const newChildrenLength = newChildren.length;
    const transitions = projectionOptions.transitions;
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    projectionOptions = Object.assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    let oldIndex = 0;
    let newIndex = 0;
    let i;
    let textUpdated = false;
    while (newIndex < newChildrenLength) {
        let oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
        const newChild = newChildren[newIndex];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(newChild) && typeof newChild.deferredPropertiesCallback === 'function') {
            newChild.inserted = Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(oldChild) && oldChild.inserted;
            addDeferredProperties(newChild, projectionOptions);
        }
        if (oldChild !== undefined && same(oldChild, newChild)) {
            textUpdated = updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance) || textUpdated;
            oldIndex++;
            newIndex++;
            continue;
        }
        const findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
        const addChild = () => {
            let insertBeforeDomNode = undefined;
            let child = oldChildren[oldIndex];
            if (child) {
                let nextIndex = oldIndex + 1;
                let insertBeforeChildren = [child];
                while (insertBeforeChildren.length) {
                    const insertBefore = insertBeforeChildren.shift();
                    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(insertBefore)) {
                        if (insertBefore.rendered) {
                            insertBeforeChildren.push(...insertBefore.rendered);
                        }
                    }
                    else {
                        if (insertBefore.domNode) {
                            insertBeforeDomNode = insertBefore.domNode;
                            break;
                        }
                    }
                    if (insertBeforeChildren.length === 0 && oldChildren[nextIndex]) {
                        insertBeforeChildren.push(oldChildren[nextIndex]);
                        nextIndex++;
                    }
                }
            }
            createDom(newChild, parentVNode, insertBeforeDomNode, projectionOptions, parentInstance);
            nodeAdded(newChild, transitions);
            const indexToCheck = newIndex;
            projectorState.afterRenderCallbacks.push(() => {
                checkDistinguishable(newChildren, indexToCheck, parentInstance);
            });
        };
        if (!oldChild || findOldIndex === -1) {
            addChild();
            newIndex++;
            continue;
        }
        const removeChild = () => {
            const indexToCheck = oldIndex;
            projectorState.afterRenderCallbacks.push(() => {
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(oldChild)) {
                const item = instanceMap.get(oldChild.instance);
                if (item) {
                    oldChild = item.dnode;
                }
            }
            nodeToRemove(oldChild, transitions, projectionOptions);
        };
        const findNewIndex = findIndexOfChild(newChildren, oldChild, newIndex + 1);
        if (findNewIndex === -1) {
            removeChild();
            oldIndex++;
            continue;
        }
        addChild();
        removeChild();
        oldIndex++;
        newIndex++;
    }
    if (oldChildrenLength > oldIndex) {
        // Remove child fragments
        for (i = oldIndex; i < oldChildrenLength; i++) {
            const indexToCheck = i;
            projectorState.afterRenderCallbacks.push(() => {
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            let childToRemove = oldChildren[i];
            if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(childToRemove)) {
                const item = instanceMap.get(childToRemove.instance);
                if (item) {
                    childToRemove = item.dnode;
                }
            }
            nodeToRemove(childToRemove, transitions, projectionOptions);
        }
    }
    return textUpdated;
}
function addChildren(parentVNode, children, projectionOptions, parentInstance, insertBefore = undefined, childNodes) {
    if (children === undefined) {
        return;
    }
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectorState.merge && childNodes === undefined) {
        childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__dojo_shim_array__["a" /* from */])(parentVNode.domNode.childNodes);
    }
    const transitions = projectionOptions.transitions;
    projectionOptions = Object.assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isVNode */])(child)) {
            if (projectorState.merge && childNodes) {
                let domElement = undefined;
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
        nodeAdded(child, transitions);
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
        const events = dnode.events;
        Object.keys(events).forEach((event) => {
            updateEvent(domNode, event, events[event], projectionOptions, dnode.properties.bind);
        });
    }
    else {
        updateProperties(domNode, {}, dnode.properties, projectionOptions);
    }
    if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
        const instanceData = widgetInstanceMap.get(parentInstance);
        instanceData.nodeHandler.add(domNode, `${dnode.properties.key}`);
    }
    dnode.inserted = true;
}
function createDom(dnode, parentVNode, insertBefore, projectionOptions, parentInstance, childNodes) {
    let domNode;
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode)) {
        let { widgetConstructor } = dnode;
        const parentInstanceData = widgetInstanceMap.get(parentInstance);
        if (!Object(__WEBPACK_IMPORTED_MODULE_3__Registry__["d" /* isWidgetBaseConstructor */])(widgetConstructor)) {
            const item = parentInstanceData.registry().get(widgetConstructor);
            if (item === null) {
                return;
            }
            widgetConstructor = item;
        }
        const instance = new widgetConstructor();
        dnode.instance = instance;
        const instanceData = widgetInstanceMap.get(instance);
        instanceData.invalidate = () => {
            instanceData.dirty = true;
            if (instanceData.rendering === false) {
                projectorState.renderQueue.push({ instance, depth: projectionOptions.depth });
                scheduleRender(projectionOptions);
            }
        };
        instanceData.rendering = true;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        const rendered = instance.__render__();
        instanceData.rendering = false;
        if (rendered) {
            const filteredRendered = filterAndDecorateChildren(rendered, instance);
            dnode.rendered = filteredRendered;
            addChildren(parentVNode, filteredRendered, projectionOptions, instance, insertBefore, childNodes);
        }
        instanceMap.set(instance, { dnode, parentVNode });
        instanceData.nodeHandler.addRoot();
        projectorState.afterRenderCallbacks.push(() => {
            instanceData.onAttach();
        });
    }
    else {
        if (projectorState.merge && projectorState.mergeElement !== undefined) {
            domNode = dnode.domNode = projectionOptions.mergeElement;
            projectorState.mergeElement = undefined;
            initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
            return;
        }
        const doc = parentVNode.domNode.ownerDocument;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.domNode !== undefined && parentVNode.domNode) {
                const newDomNode = dnode.domNode.ownerDocument.createTextNode(dnode.text);
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
                    projectionOptions = Object.assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
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
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode)) {
        const { instance } = previous;
        const { parentVNode, dnode: node } = instanceMap.get(instance);
        const previousRendered = node ? node.rendered : previous.rendered;
        const instanceData = widgetInstanceMap.get(instance);
        instanceData.rendering = true;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        dnode.instance = instance;
        if (instanceData.dirty === true) {
            const rendered = instance.__render__();
            instanceData.rendering = false;
            dnode.rendered = filterAndDecorateChildren(rendered, instance);
            updateChildren(parentVNode, previousRendered, dnode.rendered, instance, projectionOptions);
        }
        else {
            instanceData.rendering = false;
            dnode.rendered = previousRendered;
        }
        instanceMap.set(instance, { dnode, parentVNode });
        instanceData.nodeHandler.addRoot();
    }
    else {
        if (previous === dnode) {
            return false;
        }
        const domNode = (dnode.domNode = previous.domNode);
        let textUpdated = false;
        let updated = false;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.text !== previous.text) {
                const newDomNode = domNode.ownerDocument.createTextNode(dnode.text);
                domNode.parentNode.replaceChild(newDomNode, domNode);
                dnode.domNode = newDomNode;
                textUpdated = true;
                return textUpdated;
            }
        }
        else {
            if (dnode.tag && dnode.tag.lastIndexOf('svg', 0) === 0) {
                projectionOptions = Object.assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.children !== dnode.children) {
                const children = filterAndDecorateChildren(dnode.children, parentInstance);
                dnode.children = children;
                updated =
                    updateChildren(dnode, previous.children, children, parentInstance, projectionOptions) || updated;
            }
            const previousProperties = buildPreviousProperties(domNode, previous, dnode);
            if (dnode.attributes && dnode.events) {
                updateAttributes(domNode, previousProperties.attributes, dnode.attributes, projectionOptions);
                updated =
                    updateProperties(domNode, previousProperties.properties, dnode.properties, projectionOptions, false) || updated;
                removeOrphanedEvents(domNode, previousProperties.events, dnode.events, projectionOptions, true);
                const events = dnode.events;
                Object.keys(events).forEach((event) => {
                    updateEvent(domNode, event, events[event], projectionOptions, dnode.properties.bind, previousProperties.events[event]);
                });
            }
            else {
                updated =
                    updateProperties(domNode, previousProperties.properties, dnode.properties, projectionOptions) ||
                        updated;
            }
            if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                const instanceData = widgetInstanceMap.get(parentInstance);
                instanceData.nodeHandler.add(domNode, `${dnode.properties.key}`);
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
    const properties = vnode.deferredPropertiesCallback(!!vnode.inserted);
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    vnode.properties = Object.assign({}, properties, vnode.decoratedDeferredProperties);
    projectorState.deferredRenderCallbacks.push(() => {
        const properties = Object.assign({}, vnode.deferredPropertiesCallback(!!vnode.inserted), vnode.decoratedDeferredProperties);
        updateProperties(vnode.domNode, vnode.properties, properties, projectionOptions);
        vnode.properties = properties;
    });
}
function runDeferredRenderCallbacks(projectionOptions) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectorState.deferredRenderCallbacks.length) {
        if (projectionOptions.sync) {
            while (projectorState.deferredRenderCallbacks.length) {
                const callback = projectorState.deferredRenderCallbacks.shift();
                callback && callback();
            }
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestAnimationFrame(() => {
                while (projectorState.deferredRenderCallbacks.length) {
                    const callback = projectorState.deferredRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function runAfterRenderCallbacks(projectionOptions) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectionOptions.sync) {
        while (projectorState.afterRenderCallbacks.length) {
            const callback = projectorState.afterRenderCallbacks.shift();
            callback && callback();
        }
    }
    else {
        if (__WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestIdleCallback) {
            __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestIdleCallback(() => {
                while (projectorState.afterRenderCallbacks.length) {
                    const callback = projectorState.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
        else {
            setTimeout(() => {
                while (projectorState.afterRenderCallbacks.length) {
                    const callback = projectorState.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function scheduleRender(projectionOptions) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectionOptions.sync) {
        render(projectionOptions);
    }
    else if (projectorState.renderScheduled === undefined) {
        projectorState.renderScheduled = __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestAnimationFrame(() => {
            render(projectionOptions);
        });
    }
}
function render(projectionOptions) {
    const projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    projectorState.renderScheduled = undefined;
    const renderQueue = projectorState.renderQueue;
    const renders = [...renderQueue];
    projectorState.renderQueue = [];
    renders.sort((a, b) => a.depth - b.depth);
    const previouslyRendered = [];
    while (renders.length) {
        const { instance } = renders.shift();
        if (instanceMap.has(instance) && previouslyRendered.indexOf(instance) === -1) {
            previouslyRendered.push(instance);
            const { parentVNode, dnode } = instanceMap.get(instance);
            const instanceData = widgetInstanceMap.get(instance);
            updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance);
        }
    }
    runAfterRenderCallbacks(projectionOptions);
    runDeferredRenderCallbacks(projectionOptions);
}
const dom = {
    append: function (parentNode, instance, projectionOptions = {}) {
        const instanceData = widgetInstanceMap.get(instance);
        const finalProjectorOptions = getProjectionOptions(projectionOptions, instance);
        const projectorState = {
            afterRenderCallbacks: [],
            deferredRenderCallbacks: [],
            nodeMap: new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */](),
            renderScheduled: undefined,
            renderQueue: [],
            merge: projectionOptions.merge || false,
            mergeElement: projectionOptions.mergeElement
        };
        projectorStateMap.set(instance, projectorState);
        finalProjectorOptions.rootNode = parentNode;
        const parentVNode = toParentVNode(finalProjectorOptions.rootNode);
        const node = toInternalWNode(instance, instanceData);
        instanceMap.set(instance, { dnode: node, parentVNode });
        instanceData.invalidate = () => {
            instanceData.dirty = true;
            if (instanceData.rendering === false) {
                projectorState.renderQueue.push({ instance, depth: finalProjectorOptions.depth });
                scheduleRender(finalProjectorOptions);
            }
        };
        updateDom(node, node, finalProjectorOptions, parentVNode, instance);
        projectorState.afterRenderCallbacks.push(() => {
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
    merge: function (element, instance, projectionOptions = {}) {
        projectionOptions.merge = true;
        projectionOptions.mergeElement = element;
        const projection = this.append(element.parentNode, instance, projectionOptions);
        const projectorState = projectorStateMap.get(instance);
        projectorState.merge = false;
        return projection;
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = dom;

//# sourceMappingURL=vdom.mjs.map

/***/ }),

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu-item/MenuItem.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.mjs").default;

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

/***/ "./node_modules/tslib/tslib.es6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export __extends */
/* unused harmony export __assign */
/* harmony export (immutable) */ __webpack_exports__["c"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["a"] = __decorate;
/* unused harmony export __param */
/* harmony export (immutable) */ __webpack_exports__["b"] = __metadata;
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuItem", function() { return MenuItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_widget_core_d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_widget_core_decorators_customElement__ = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dojo_widget_core_mixins_Themed__ = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dojo_widget_core_WidgetBase__ = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__ = __webpack_require__("./src/menu-item/menuItem.m.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__menuItem_m_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__);






let MenuItem = class MenuItem extends Object(__WEBPACK_IMPORTED_MODULE_3__dojo_widget_core_mixins_Themed__["a" /* ThemedMixin */])(__WEBPACK_IMPORTED_MODULE_4__dojo_widget_core_WidgetBase__["a" /* WidgetBase */]) {
    _onClick() {
        this.properties.onSelected && this.properties.onSelected(this.properties.data);
    }
    render() {
        const { title, selected } = this.properties;
        return Object(__WEBPACK_IMPORTED_MODULE_1__dojo_widget_core_d__["g" /* v */])('li', { classes: this.theme(__WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__["root"]) }, [
            Object(__WEBPACK_IMPORTED_MODULE_1__dojo_widget_core_d__["g" /* v */])('span', {
                classes: this.theme([__WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__["item"], selected ? __WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__["selected"] : null]),
                onclick: this._onClick
            }, [title])
        ]);
    }
};
MenuItem = __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
    Object(__WEBPACK_IMPORTED_MODULE_2__dojo_widget_core_decorators_customElement__["a" /* customElement */])({
        tag: 'demo-menu-item',
        attributes: ['title', 'selected'],
        events: ['onSelected'],
        properties: ['data', 'selected']
    }),
    Object(__WEBPACK_IMPORTED_MODULE_3__dojo_widget_core_mixins_Themed__["c" /* theme */])(__WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__)
], MenuItem);

/* harmony default export */ __webpack_exports__["default"] = (MenuItem);


/***/ }),

/***/ "./src/menu-item/menuItem.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"test-app/menuItem","root":"menuItem-m__root__sUmUi","item":"menuItem-m__item__2Mk6R","selected":"menuItem-m__selected__1-f3I"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDc0NDRkYmQxMGU3MDBjYTU4OTIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9JbmplY3Rvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2QubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hbHdheXNSZW5kZXIubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9pbmplY3QubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kaWZmLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS1pdGVtL01lbnVJdGVtLnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3M/NmE5NSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUM3RGdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUN2REE7QUFDc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsZ0NBQWdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RWlCO0FBQ0E7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUM7Ozs7Ozs7Ozs7OztBQ25NQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLE9BQU8saUJBQWlCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsUUFBUTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQzs7Ozs7Ozs7Ozs7Ozs7O0FDbk1vQztBQUNwQztBQUN5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFCQUFxQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxZQUFZO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFlBQVk7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7Ozs7Ozs7QUMvRkE7QUFDeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7O0FDdE1BO0FBQ0E7QUFDNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBSTtBQUNwQixnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFJO0FBQ2hCLFlBQVksVUFBVTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxtQzs7Ozs7Ozs7Ozs7OztBQ2hKQTtBQUNzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlHQTtBQUNrQztBQUNQO0FBQzNCO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsc0JBQXNCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0M7Ozs7Ozs7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG1DOzs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7QUFDaUQ7QUFDakQsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlHQTtBQUNBO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RkFBd0Y7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7OztBQ3hTbUI7QUFDbkI7MEVBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsRUFBRTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxFQUFFO0FBQ2pFLG1DQUFtQyxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxnQzs7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQzs7Ozs7Ozs7O0FDekxBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7O0FDdEJrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7QUNwQmtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxzQ0FBc0M7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0EsbUJBQW1CLDZCQUE2QjtBQUNoRDtBQUNBO0FBQ0EsbUJBQW1CLGdDQUFnQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0Esd0M7Ozs7Ozs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUVBQXVFLGlCQUFpQjtBQUN4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxpQkFBaUI7QUFDMUY7QUFDQTtBQUNBO0FBQ0EsOERBQThELHFCQUFxQjtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7QUNoSGM7QUFDSTtBQUNDO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0EsNEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNZO0FBQ0c7QUFDZjtBQUNBO0FBQzRCO0FBQ3dCO0FBQ3BEO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLGFBQWE7QUFDekYsbUNBQW1DLDBCQUEwQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCx5QkFBeUI7QUFDeEY7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQSw2REFBNkQseUJBQXlCO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Qzs7Ozs7Ozs7QUNyWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGNBQWM7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw4REFBOEQsZUFBZTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQXFCLGlCQUFpQixZQUFZLFNBQVMscUJBQXFCO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCOzs7Ozs7Ozs7O0FDNUcwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdDOzs7Ozs7Ozs7OztBQ1AwQjtBQUNDO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EseUM7Ozs7Ozs7Ozs7QUNWMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw2Qzs7Ozs7Ozs7Ozs7QUNQaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUErQixnUEFBc0k7QUFDcks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEM7Ozs7Ozs7Ozs7QUNuQjBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxhQUFhO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlDOzs7Ozs7OztBQ3JCQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Qzs7Ozs7Ozs7Ozs7O0FDakJBO0FBQzBCO0FBQ0M7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsd0JBQXdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7O0FDcEMyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakVBO0FBQ2lCO0FBQ2pCO0FBQ3NCO0FBQ1Y7QUFDRTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxvREFBb0Q7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLGdDQUFnQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0hBQWlEO0FBQ2pELHlDQUF5QyxnREFBZ0Q7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVGQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELDRCQUE0QixxQkFBcUI7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVKQTtBQUNtQjtBQUNGO0FBQ1M7QUFDSDtBQUNMO0FBQ2xCO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVcsRUFBRTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLGlCQUFpQixJQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QyxhQUFhLElBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvSUE7QUFDNkI7QUFDSjtBQUNWO0FBQ0U7QUFDakI7QUFDZ0M7QUFDVDtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyx3REFBd0Q7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLElBQUk7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsYUFBYSxJQUFJO0FBQ2pCLDRFQUF3QixvREFBb0Q7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcseUNBQXlDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlDQUFpQztBQUNwRCwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUdBQTZDLG1DQUFtQztBQUNoRjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxXQUFXO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsVUFBVTtBQUNyQyx3R0FBb0Q7QUFDcEQsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwTkE7QUFDNEI7QUFDeUI7QUFDbkI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG1DQUFtQztBQUM5QztBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsZ0JBQWdCLGVBQWUsc0NBQXNDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsdUNBQXVDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLDRCQUE0QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLDRCQUE0QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHVCQUF1QjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDJCQUEyQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxpQkFBaUIsS0FBSztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsV0FBVyxrTEFBa0wsZUFBZTtBQUMxUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxzQkFBc0IscUNBQXFDO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msc0JBQXNCLHFDQUFxQztBQUNuRyxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsaURBQWlELHFCQUFxQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsb0JBQW9CO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsMkNBQTJDO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxzQkFBc0IsMkJBQTJCO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUIsZUFBZSwyQkFBMkI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxzQkFBc0IsMkJBQTJCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQscUJBQXFCO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsMkJBQTJCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCwrQ0FBK0M7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxpQzs7Ozs7OztBQ3g1QkE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNOQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkx0QztBQUFBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUMvRSxxQkFBcUIsdURBQXVEOztBQUU1RTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBOztBQUVBO0FBQ0EsNENBQTRDLE9BQU87QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELGNBQWM7QUFDMUU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsb0NBQW9DO0FBQ3ZFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLGlFQUFpRSx1QkFBdUIsRUFBRSw0QkFBNEI7QUFDcko7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLDZCQUE2QiwwQkFBMEIsYUFBYSxFQUFFLHFCQUFxQjtBQUN4RyxnQkFBZ0IscURBQXFELG9FQUFvRSxhQUFhLEVBQUU7QUFDeEosc0JBQXNCLHNCQUFzQixxQkFBcUIsR0FBRztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsa0NBQWtDLFNBQVM7QUFDM0Msa0NBQWtDLFdBQVcsVUFBVTtBQUN2RCx5Q0FBeUMsY0FBYztBQUN2RDtBQUNBLDZHQUE2RyxPQUFPLFVBQVU7QUFDOUgsZ0ZBQWdGLGlCQUFpQixPQUFPO0FBQ3hHLHdEQUF3RCxnQkFBZ0IsUUFBUSxPQUFPO0FBQ3ZGLDhDQUE4QyxnQkFBZ0IsZ0JBQWdCLE9BQU87QUFDckY7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLFNBQVMsWUFBWSxhQUFhLE9BQU8sRUFBRSxVQUFVLFdBQVc7QUFDaEUsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixNQUFNLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLHNCQUFzQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzRkFBc0YsYUFBYSxFQUFFO0FBQ3RILHNCQUFzQixnQ0FBZ0MscUNBQXFDLDBDQUEwQyxFQUFFLEVBQUUsR0FBRztBQUM1SSwyQkFBMkIsTUFBTSxlQUFlLEVBQUUsWUFBWSxvQkFBb0IsRUFBRTtBQUNwRixzQkFBc0Isb0dBQW9HO0FBQzFILDZCQUE2Qix1QkFBdUI7QUFDcEQsNEJBQTRCLHdCQUF3QjtBQUNwRCwyQkFBMkIseURBQXlEO0FBQ3BGOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsNENBQTRDLFNBQVMsRUFBRSxxREFBcUQsYUFBYSxFQUFFO0FBQzVJLHlCQUF5QixnQ0FBZ0Msb0JBQW9CLGdEQUFnRCxnQkFBZ0IsR0FBRztBQUNoSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLHVDQUF1QyxhQUFhLEVBQUUsRUFBRSxPQUFPLGtCQUFrQjtBQUNqSDtBQUNBOzs7Ozs7OztBQ3JLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCd0M7QUFDbUM7QUFFTjtBQUNYO0FBRWxCO0FBZ0J4QyxJQUFhLFFBQVEsR0FBckIsY0FBc0IsU0FBUSw0RkFBVyxDQUFDLGdGQUFVLENBQXFCO0lBQ2hFLFFBQVE7UUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFUyxNQUFNO1FBQ2YsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxzRUFBQyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFEQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2pELHNFQUFDLENBQ0EsTUFBTSxFQUNOO2dCQUNDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMscURBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLHlEQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDdEIsRUFDRCxDQUFDLEtBQUssQ0FBQyxDQUNQO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBbkJZLFFBQVE7SUFQcEIseUdBQWEsQ0FBcUI7UUFDbEMsR0FBRyxFQUFFLGdCQUFnQjtRQUNyQixVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1FBQ2pDLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztRQUN0QixVQUFVLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO0tBQ2hDLENBQUM7SUFDRCxzRkFBSyxDQUFDLDZDQUFHLENBQUM7R0FDRSxRQUFRLENBbUJwQjtBQW5Cb0I7QUFxQnJCLCtEQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7QUMzQ3hCO0FBQ0Esa0JBQWtCLHdJIiwiZmlsZSI6Im1lbnUtaXRlbS0xLjAuMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ3NDQ0ZGJkMTBlNzAwY2E1ODkyIiwiaW1wb3J0IHsgY3JlYXRlQ29tcG9zaXRlSGFuZGxlIH0gZnJvbSAnLi9sYW5nJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG4vKipcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBub29wKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xufVxuLyoqXG4gKiBObyBvcCBmdW5jdGlvbiB1c2VkIHRvIHJlcGxhY2Ugb3duLCBvbmNlIGluc3RhbmNlIGhhcyBiZWVuIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBkZXN0cm95ZWQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsIG1hZGUgdG8gZGVzdHJveWVkIG1ldGhvZCcpO1xufVxuZXhwb3J0IGNsYXNzIERlc3Ryb3lhYmxlIHtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gYHRoaXMuZGVzdHJveWAgaXMgY2FsbGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2VcbiAgICAgKiBAcmV0dXJucyB7SGFuZGxlfSBhIGhhbmRsZSBmb3IgdGhlIGhhbmRsZSwgcmVtb3ZlcyB0aGUgaGFuZGxlIGZvciB0aGUgaW5zdGFuY2UgYW5kIGNhbGxzIGRlc3Ryb3lcbiAgICAgKi9cbiAgICBvd24oaGFuZGxlcykge1xuICAgICAgICBjb25zdCBoYW5kbGUgPSBBcnJheS5pc0FycmF5KGhhbmRsZXMpID8gY3JlYXRlQ29tcG9zaXRlSGFuZGxlKC4uLmhhbmRsZXMpIDogaGFuZGxlcztcbiAgICAgICAgY29uc3QgeyBoYW5kbGVzOiBfaGFuZGxlcyB9ID0gdGhpcztcbiAgICAgICAgX2hhbmRsZXMucHVzaChoYW5kbGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICBfaGFuZGxlcy5zcGxpY2UoX2hhbmRsZXMuaW5kZXhPZihoYW5kbGUpKTtcbiAgICAgICAgICAgICAgICBoYW5kbGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZXN0cnB5cyBhbGwgaGFuZGVycyByZWdpc3RlcmVkIGZvciB0aGUgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgaGFuZGxlcyBoYXZlIGJlZW4gZGVzdHJveWVkXG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiB7XG4gICAgICAgICAgICAgICAgaGFuZGxlICYmIGhhbmRsZS5kZXN0cm95ICYmIGhhbmRsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IG5vb3A7XG4gICAgICAgICAgICB0aGlzLm93biA9IGRlc3Ryb3llZDtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IERlc3Ryb3lhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGVzdHJveWFibGUubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xyXG5pbXBvcnQgeyBEZXN0cm95YWJsZSB9IGZyb20gJy4vRGVzdHJveWFibGUnO1xyXG4vKipcclxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xyXG4gKi9cclxuY29uc3QgcmVnZXhNYXAgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSBldmVudCB0eXBlIGdsb2IgaGFzIGJlZW4gbWF0Y2hlZFxyXG4gKlxyXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0dsb2JNYXRjaChnbG9iU3RyaW5nLCB0YXJnZXRTdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgdGFyZ2V0U3RyaW5nID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgZ2xvYlN0cmluZyA9PT0gJ3N0cmluZycgJiYgZ2xvYlN0cmluZy5pbmRleE9mKCcqJykgIT09IC0xKSB7XHJcbiAgICAgICAgbGV0IHJlZ2V4O1xyXG4gICAgICAgIGlmIChyZWdleE1hcC5oYXMoZ2xvYlN0cmluZykpIHtcclxuICAgICAgICAgICAgcmVnZXggPSByZWdleE1hcC5nZXQoZ2xvYlN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoYF4ke2dsb2JTdHJpbmcucmVwbGFjZSgvXFwqL2csICcuKicpfSRgKTtcclxuICAgICAgICAgICAgcmVnZXhNYXAuc2V0KGdsb2JTdHJpbmcsIHJlZ2V4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodGFyZ2V0U3RyaW5nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBnbG9iU3RyaW5nID09PSB0YXJnZXRTdHJpbmc7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEV2ZW50IENsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRlZCBleHRlbmRzIERlc3Ryb3lhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogbWFwIG9mIGxpc3RlbmVycyBrZXllZCBieSBldmVudCB0eXBlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICBlbWl0KGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAuZm9yRWFjaCgobWV0aG9kcywgdHlwZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNHbG9iTWF0Y2godHlwZSwgZXZlbnQudHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwodGhpcywgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9uKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXMgPSBsaXN0ZW5lci5tYXAoKGxpc3RlbmVyKSA9PiB0aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlLmRlc3Ryb3koKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBfYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcclxuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XHJcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzTWFwLnNldCh0eXBlLCBsaXN0ZW5lcnMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRlc3Ryb3k6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRlZDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RXZlbnRlZC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9FdmVudGVkLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9FdmVudGVkLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcbmV4cG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcbmNvbnN0IHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuLyoqXG4gKiBUeXBlIGd1YXJkIHRoYXQgZW5zdXJlcyB0aGF0IHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCB0byBPYmplY3RcbiAqIHRvIHdlZWQgb3V0IGhvc3Qgb2JqZWN0cyB0aGF0IGRvIG5vdCBkZXJpdmUgZnJvbSBPYmplY3QuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY2hlY2sgaWYgd2Ugd2FudCB0byBkZWVwIGNvcHkgYW4gb2JqZWN0IG9yIG5vdC5cbiAqIE5vdGU6IEluIEVTNiBpdCBpcyBwb3NzaWJsZSB0byBtb2RpZnkgYW4gb2JqZWN0J3MgU3ltYm9sLnRvU3RyaW5nVGFnIHByb3BlcnR5LCB3aGljaCB3aWxsXG4gKiBjaGFuZ2UgdGhlIHZhbHVlIHJldHVybmVkIGJ5IGB0b1N0cmluZ2AuIFRoaXMgaXMgYSByYXJlIGVkZ2UgY2FzZSB0aGF0IGlzIGRpZmZpY3VsdCB0byBoYW5kbGUsXG4gKiBzbyBpdCBpcyBub3QgaGFuZGxlZCBoZXJlLlxuICogQHBhcmFtICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4gICAgICAgSWYgdGhlIHZhbHVlIGlzIGNvZXJjaWJsZSBpbnRvIGFuIE9iamVjdFxuICovXG5mdW5jdGlvbiBzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cbmZ1bmN0aW9uIGNvcHlBcnJheShhcnJheSwgaW5oZXJpdGVkKSB7XG4gICAgcmV0dXJuIGFycmF5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvcHlBcnJheShpdGVtLCBpbmhlcml0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSlcbiAgICAgICAgICAgID8gaXRlbVxuICAgICAgICAgICAgOiBfbWl4aW4oe1xuICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXG4gICAgICAgICAgICAgICAgc291cmNlczogW2l0ZW1dLFxuICAgICAgICAgICAgICAgIHRhcmdldDoge31cbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gX21peGluKGt3QXJncykge1xuICAgIGNvbnN0IGRlZXAgPSBrd0FyZ3MuZGVlcDtcbiAgICBjb25zdCBpbmhlcml0ZWQgPSBrd0FyZ3MuaW5oZXJpdGVkO1xuICAgIGNvbnN0IHRhcmdldCA9IGt3QXJncy50YXJnZXQ7XG4gICAgY29uc3QgY29waWVkID0ga3dBcmdzLmNvcGllZCB8fCBbXTtcbiAgICBjb25zdCBjb3BpZWRDbG9uZSA9IFsuLi5jb3BpZWRdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3dBcmdzLnNvdXJjZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0ga3dBcmdzLnNvdXJjZXNbaV07XG4gICAgICAgIGlmIChzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoY29waWVkQ2xvbmUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGVlcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29weUFycmF5KHZhbHVlLCBpbmhlcml0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0VmFsdWUgPSB0YXJnZXRba2V5XSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZC5wdXNoKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IF9taXhpbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQ6IGluaGVyaXRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VzOiBbdmFsdWVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29waWVkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgLi4ubWl4aW5zKSB7XG4gICAgaWYgKCFtaXhpbnMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsYW5nLmNyZWF0ZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgbWl4aW4gb2JqZWN0LicpO1xuICAgIH1cbiAgICBjb25zdCBhcmdzID0gbWl4aW5zLnNsaWNlKCk7XG4gICAgYXJncy51bnNoaWZ0KE9iamVjdC5jcmVhdGUocHJvdG90eXBlKSk7XG4gICAgcmV0dXJuIGFzc2lnbi5hcHBseShudWxsLCBhcmdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduKHRhcmdldCwgLi4uc291cmNlcykge1xuICAgIHJldHVybiBfbWl4aW4oe1xuICAgICAgICBkZWVwOiB0cnVlLFxuICAgICAgICBpbmhlcml0ZWQ6IGZhbHNlLFxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gX21peGluKHtcbiAgICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgICAgaW5oZXJpdGVkOiB0cnVlLFxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgc291cmNlJ3MgcHJvdG90eXBlIGFzIHRoZSBwcm90b3R5cGUgZm9yIHRoZSBuZXcgb2JqZWN0LCBhbmQgdGhlblxuICogZGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHZhbHVlcyBpbnRvIHRoZSBuZXcgdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIG9iamVjdCB0byBkdXBsaWNhdGVcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGR1cGxpY2F0ZShzb3VyY2UpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpKTtcbiAgICByZXR1cm4gZGVlcE1peGluKHRhcmdldCwgc291cmNlKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBhIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSBiIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWU7IGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGljYWwoYSwgYikge1xuICAgIHJldHVybiAoYSA9PT0gYiB8fFxuICAgICAgICAvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXG4gICAgICAgIChhICE9PSBhICYmIGIgIT09IGIpKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYmluZHMgYSBtZXRob2QgdG8gdGhlIHNwZWNpZmllZCBvYmplY3QgYXQgcnVudGltZS4gVGhpcyBpcyBzaW1pbGFyIHRvXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cbiAqIEFzIGEgcmVzdWx0LCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgYnkgYGxhdGVCaW5kYCB3aWxsIGFsd2F5cyBjYWxsIHRoZSBmdW5jdGlvbiBjdXJyZW50bHkgYXNzaWduZWQgdG9cbiAqIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgb24gdGhlIG9iamVjdCBhcyBvZiB0aGUgbW9tZW50IHRoZSBmdW5jdGlvbiBpdCByZXR1cm5zIGlzIGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGNvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbWV0aG9kIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgb24gdGhlIGNvbnRleHQgb2JqZWN0IHRvIGJpbmQgdG8gaXRzZWxmXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXRlQmluZChpbnN0YW5jZSwgbWV0aG9kLCAuLi5zdXBwbGllZEFyZ3MpIHtcbiAgICByZXR1cm4gc3VwcGxpZWRBcmdzLmxlbmd0aFxuICAgICAgICA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuICAgICAgICAgICAgLy8gVFM3MDE3XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBUUzcwMTdcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1peGluKHRhcmdldCwgLi4uc291cmNlcykge1xuICAgIHJldHVybiBfbWl4aW4oe1xuICAgICAgICBkZWVwOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdGVkOiB0cnVlLFxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgIH0pO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIHByZXBlbmRlZCB0byBpdHMgYXJndW1lbnQgbGlzdC5cbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXRGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBib3VuZFxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpYWwodGFyZ2V0RnVuY3Rpb24sIC4uLnN1cHBsaWVkQXJncykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuICAgICAgICByZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbn1cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGRlc3Ryb3kgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBjYWxscyB0aGUgcGFzc2VkLWluIGRlc3RydWN0b3IuXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZSBmb3IgY3JlYXRpbmcgXCJyZW1vdmVcIiAvIFwiZGVzdHJveVwiIGhhbmRsZXJzIGZvclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gZGVzdHJ1Y3RvciBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaGFuZGxlJ3MgYGRlc3Ryb3lgIG1ldGhvZCBpcyBpbnZva2VkXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3Rvcikge1xuICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXN0cm95IG11bHRpcGxlIGhhbmRsZXMgc2ltdWx0YW5lb3VzbHkuXG4gKlxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlcykge1xuICAgIHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbmRsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sYW5nLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiZnVuY3Rpb24gaXNGZWF0dXJlVGVzdFRoZW5hYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcclxufVxyXG4vKipcclxuICogQSBjYWNoZSBvZiByZXN1bHRzIG9mIGZlYXR1cmUgdGVzdHNcclxuICovXHJcbmV4cG9ydCBjb25zdCB0ZXN0Q2FjaGUgPSB7fTtcclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgdGhlIHVuLXJlc29sdmVkIGZlYXR1cmUgdGVzdHNcclxuICovXHJcbmV4cG9ydCBjb25zdCB0ZXN0RnVuY3Rpb25zID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHVucmVzb2x2ZWQgdGhlbmFibGVzIChwcm9iYWJseSBwcm9taXNlcylcclxuICogQHR5cGUge3t9fVxyXG4gKi9cclxuY29uc3QgdGVzdFRoZW5hYmxlcyA9IHt9O1xyXG4vKipcclxuICogQSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBzY29wZSAoYHdpbmRvd2AgaW4gYSBicm93c2VyLCBgZ2xvYmFsYCBpbiBOb2RlSlMpXHJcbiAqL1xyXG5jb25zdCBnbG9iYWxTY29wZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gQnJvd3NlcnNcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBOb2RlXHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIFdlYiB3b3JrZXJzXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHt9O1xyXG59KSgpO1xyXG4vKiBHcmFiIHRoZSBzdGF0aWNGZWF0dXJlcyBpZiB0aGVyZSBhcmUgYXZhaWxhYmxlICovXHJcbmNvbnN0IHsgc3RhdGljRmVhdHVyZXMgfSA9IGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudCB8fCB7fTtcclxuLyogQ2xlYW5pbmcgdXAgdGhlIERvam9IYXNFbnZpb3JubWVudCAqL1xyXG5pZiAoJ0Rvam9IYXNFbnZpcm9ubWVudCcgaW4gZ2xvYmFsU2NvcGUpIHtcclxuICAgIGRlbGV0ZSBnbG9iYWxTY29wZS5Eb2pvSGFzRW52aXJvbm1lbnQ7XHJcbn1cclxuLyoqXHJcbiAqIEN1c3RvbSB0eXBlIGd1YXJkIHRvIG5hcnJvdyB0aGUgYHN0YXRpY0ZlYXR1cmVzYCB0byBlaXRoZXIgYSBtYXAgb3IgYSBmdW5jdGlvbiB0aGF0XHJcbiAqIHJldHVybnMgYSBtYXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ3VhcmQgZm9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1N0YXRpY0ZlYXR1cmVGdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcclxufVxyXG4vKipcclxuICogVGhlIGNhY2hlIG9mIGFzc2VydGVkIGZlYXR1cmVzIHRoYXQgd2VyZSBhdmFpbGFibGUgaW4gdGhlIGdsb2JhbCBzY29wZSB3aGVuIHRoZVxyXG4gKiBtb2R1bGUgbG9hZGVkXHJcbiAqL1xyXG5jb25zdCBzdGF0aWNDYWNoZSA9IHN0YXRpY0ZlYXR1cmVzXHJcbiAgICA/IGlzU3RhdGljRmVhdHVyZUZ1bmN0aW9uKHN0YXRpY0ZlYXR1cmVzKSA/IHN0YXRpY0ZlYXR1cmVzLmFwcGx5KGdsb2JhbFNjb3BlKSA6IHN0YXRpY0ZlYXR1cmVzXHJcbiAgICA6IHt9OyAvKiBQcm92aWRpbmcgYW4gZW1wdHkgY2FjaGUsIGlmIG5vbmUgd2FzIGluIHRoZSBlbnZpcm9ubWVudFxyXG5cclxuLyoqXHJcbiogQU1EIHBsdWdpbiBmdW5jdGlvbi5cclxuKlxyXG4qIENvbmRpdGlvbmFsIGxvYWRzIG1vZHVsZXMgYmFzZWQgb24gYSBoYXMgZmVhdHVyZSB0ZXN0IHZhbHVlLlxyXG4qXHJcbiogQHBhcmFtIHJlc291cmNlSWQgR2l2ZXMgdGhlIHJlc29sdmVkIG1vZHVsZSBpZCB0byBsb2FkLlxyXG4qIEBwYXJhbSByZXF1aXJlIFRoZSBsb2FkZXIgcmVxdWlyZSBmdW5jdGlvbiB3aXRoIHJlc3BlY3QgdG8gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5lZCB0aGUgcGx1Z2luIHJlc291cmNlIGluIGl0c1xyXG4qICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kgbGlzdC5cclxuKiBAcGFyYW0gbG9hZCBDYWxsYmFjayB0byBsb2FkZXIgdGhhdCBjb25zdW1lcyByZXN1bHQgb2YgcGx1Z2luIGRlbWFuZC5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQocmVzb3VyY2VJZCwgcmVxdWlyZSwgbG9hZCwgY29uZmlnKSB7XHJcbiAgICByZXNvdXJjZUlkID8gcmVxdWlyZShbcmVzb3VyY2VJZF0sIGxvYWQpIDogbG9hZCgpO1xyXG59XHJcbi8qKlxyXG4gKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBSZXNvbHZlcyByZXNvdXJjZUlkIGludG8gYSBtb2R1bGUgaWQgYmFzZWQgb24gcG9zc2libHktbmVzdGVkIHRlbmFyeSBleHByZXNzaW9uIHRoYXQgYnJhbmNoZXMgb24gaGFzIGZlYXR1cmUgdGVzdFxyXG4gKiB2YWx1ZShzKS5cclxuICpcclxuICogQHBhcmFtIHJlc291cmNlSWQgVGhlIGlkIG9mIHRoZSBtb2R1bGVcclxuICogQHBhcmFtIG5vcm1hbGl6ZSBSZXNvbHZlcyBhIHJlbGF0aXZlIG1vZHVsZSBpZCBpbnRvIGFuIGFic29sdXRlIG1vZHVsZSBpZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShyZXNvdXJjZUlkLCBub3JtYWxpemUpIHtcclxuICAgIGNvbnN0IHRva2VucyA9IHJlc291cmNlSWQubWF0Y2goL1tcXD86XXxbXjpcXD9dKi9nKSB8fCBbXTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGZ1bmN0aW9uIGdldChza2lwKSB7XHJcbiAgICAgICAgY29uc3QgdGVybSA9IHRva2Vuc1tpKytdO1xyXG4gICAgICAgIGlmICh0ZXJtID09PSAnOicpIHtcclxuICAgICAgICAgICAgLy8gZW1wdHkgc3RyaW5nIG1vZHVsZSBuYW1lLCByZXNvbHZlcyB0byBudWxsXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcG9zdGZpeGVkIHdpdGggYSA/IG1lYW5zIGl0IGlzIGEgZmVhdHVyZSB0byBicmFuY2ggb24sIHRoZSB0ZXJtIGlzIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAgICAgICAgICAgIGlmICh0b2tlbnNbaSsrXSA9PT0gJz8nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNraXAgJiYgaGFzKHRlcm0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hlZCB0aGUgZmVhdHVyZSwgZ2V0IHRoZSBmaXJzdCB2YWx1ZSBmcm9tIHRoZSBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlkIG5vdCBtYXRjaCwgZ2V0IHRoZSBzZWNvbmQgdmFsdWUsIHBhc3Npbmcgb3ZlciB0aGUgZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICBnZXQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChza2lwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhIG1vZHVsZVxyXG4gICAgICAgICAgICByZXR1cm4gdGVybTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBpZCA9IGdldCgpO1xyXG4gICAgcmV0dXJuIGlkICYmIG5vcm1hbGl6ZShpZCk7XHJcbn1cclxuLyoqXHJcbiAqIENoZWNrIGlmIGEgZmVhdHVyZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleGlzdHMoZmVhdHVyZSkge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICByZXR1cm4gQm9vbGVhbihub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSB8fCBub3JtYWxpemVkRmVhdHVyZSBpbiB0ZXN0Q2FjaGUgfHwgdGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pO1xyXG59XHJcbi8qKlxyXG4gKiBSZWdpc3RlciBhIG5ldyB0ZXN0IGZvciBhIG5hbWVkIGZlYXR1cmUuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGhhcy5hZGQoJ2RvbS1hZGRldmVudGxpc3RlbmVyJywgISFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKTtcclxuICpcclxuICogQGV4YW1wbGVcclxuICogaGFzLmFkZCgndG91Y2gtZXZlbnRzJywgZnVuY3Rpb24gKCkge1xyXG4gKiAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnRcclxuICogfSk7XHJcbiAqXHJcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgcmVwb3J0ZWQgb2YgdGhlIGZlYXR1cmUsIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIG9uY2Ugb24gZmlyc3QgdGVzdFxyXG4gKiBAcGFyYW0gb3ZlcndyaXRlIGlmIGFuIGV4aXN0aW5nIHZhbHVlIHNob3VsZCBiZSBvdmVyd3JpdHRlbi4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkKGZlYXR1cmUsIHZhbHVlLCBvdmVyd3JpdGUgPSBmYWxzZSkge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAoZXhpc3RzKG5vcm1hbGl6ZWRGZWF0dXJlKSAmJiAhb3ZlcndyaXRlICYmICEobm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRmVhdHVyZSBcIiR7ZmVhdHVyZX1cIiBleGlzdHMgYW5kIG92ZXJ3cml0ZSBub3QgdHJ1ZS5gKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNGZWF0dXJlVGVzdFRoZW5hYmxlKHZhbHVlKSkge1xyXG4gICAgICAgIHRlc3RUaGVuYWJsZXNbZmVhdHVyZV0gPSB2YWx1ZS50aGVuKChyZXNvbHZlZFZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRlc3RDYWNoZVtmZWF0dXJlXSA9IHJlc29sdmVkVmFsdWU7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgZGVsZXRlIHRlc3RUaGVuYWJsZXNbZmVhdHVyZV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgbmFtZSAoaWYgYSBzdHJpbmcpIG9yIGlkZW50aWZpZXIgKGlmIGFuIGludGVnZXIpIG9mIHRoZSBmZWF0dXJlIHRvIHRlc3QuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYXMoZmVhdHVyZSkge1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc3RhdGljQ2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pIHtcclxuICAgICAgICByZXN1bHQgPSB0ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0uY2FsbChudWxsKTtcclxuICAgICAgICBkZWxldGUgdGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiB0ZXN0Q2FjaGUpIHtcclxuICAgICAgICByZXN1bHQgPSB0ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZmVhdHVyZSBpbiB0ZXN0VGhlbmFibGVzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgQXR0ZW1wdCB0byBkZXRlY3QgdW5yZWdpc3RlcmVkIGhhcyBmZWF0dXJlIFwiJHtmZWF0dXJlfVwiYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8qXHJcbiAqIE91dCBvZiB0aGUgYm94IGZlYXR1cmUgdGVzdHNcclxuICovXHJcbi8qIEVudmlyb25tZW50cyAqL1xyXG4vKiBVc2VkIGFzIGEgdmFsdWUgdG8gcHJvdmlkZSBhIGRlYnVnIG9ubHkgY29kZSBwYXRoICovXHJcbmFkZCgnZGVidWcnLCB0cnVlKTtcclxuLyogRGV0ZWN0cyBpZiB0aGUgZW52aXJvbm1lbnQgaXMgXCJicm93c2VyIGxpa2VcIiAqL1xyXG5hZGQoJ2hvc3QtYnJvd3NlcicsIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJyk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGFwcGVhcnMgdG8gYmUgTm9kZUpTICovXHJcbmFkZCgnaG9zdC1ub2RlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZSkge1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXMubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2hhcy9oYXMubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IGlzQXJyYXlMaWtlLCBTaGltSXRlcmF0b3IgfSBmcm9tICcuL2l0ZXJhdG9yJztcclxuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XHJcbmltcG9ydCB7IGlzIGFzIG9iamVjdElzIH0gZnJvbSAnLi9vYmplY3QnO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xyXG5pbXBvcnQgJy4vU3ltYm9sJztcclxuZXhwb3J0IGxldCBNYXAgPSBnbG9iYWwuTWFwO1xyXG5pZiAoIXRydWUpIHtcclxuICAgIE1hcCA9IChfYSA9IGNsYXNzIE1hcCB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdNYXAnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXHJcbiAgICAgICAgICAgICAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgX2luZGV4T2ZLZXkoa2V5cywga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RJcyhrZXlzW2ldLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXQgc2l6ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbGVhcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoID0gdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsZXRlKGtleSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRyaWVzKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5fa2V5cy5tYXAoKGtleSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB0aGlzLl92YWx1ZXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih2YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvckVhY2goY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLl9rZXlzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5fdmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlc1tpXSwga2V5c1tpXSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0KGtleSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogdGhpcy5fdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoYXMoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpID4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAga2V5cygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHRoaXMuX2tleXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4IDwgMCA/IHRoaXMuX2tleXMubGVuZ3RoIDogaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2luZGV4XSA9IGtleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlcygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHRoaXMuX3ZhbHVlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbnRyaWVzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIF9hW1N5bWJvbC5zcGVjaWVzXSA9IF9hLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBNYXA7XHJcbnZhciBfYTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TWFwLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vTWFwLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgeyBxdWV1ZU1pY3JvVGFzayB9IGZyb20gJy4vc3VwcG9ydC9xdWV1ZSc7XHJcbmltcG9ydCAnLi9TeW1ib2wnO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xyXG5leHBvcnQgbGV0IFNoaW1Qcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XHJcbmV4cG9ydCBjb25zdCBpc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xyXG59O1xyXG5pZiAoIXRydWUpIHtcclxuICAgIGdsb2JhbC5Qcm9taXNlID0gU2hpbVByb21pc2UgPSAoX2EgPSBjbGFzcyBQcm9taXNlIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgUHJvbWlzZS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSBleGVjdXRvclxyXG4gICAgICAgICAgICAgKiBUaGUgZXhlY3V0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIFByb21pc2UgaXMgaW5zdGFudGlhdGVkLiBJdCBpcyByZXNwb25zaWJsZSBmb3JcclxuICAgICAgICAgICAgICogc3RhcnRpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hlbiBpdCBpcyBpbnZva2VkLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBUaGUgZXhlY3V0b3IgbXVzdCBjYWxsIGVpdGhlciB0aGUgcGFzc2VkIGByZXNvbHZlYCBmdW5jdGlvbiB3aGVuIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWRcclxuICAgICAgICAgICAgICogc3VjY2Vzc2Z1bGx5LCBvciB0aGUgYHJlamVjdGAgZnVuY3Rpb24gd2hlbiB0aGUgb3BlcmF0aW9uIGZhaWxzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY29uc3RydWN0b3IoZXhlY3V0b3IpIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gMSAvKiBQZW5kaW5nICovO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ1Byb21pc2UnO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiB0cnVlLCB0aGUgcmVzb2x1dGlvbiBvZiB0aGlzIHByb21pc2UgaXMgY2hhaW5lZCAoXCJsb2NrZWQgaW5cIikgdG8gYW5vdGhlciBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNDaGFpbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgcHJvbWlzZSBpcyBpbiBhIHJlc29sdmVkIHN0YXRlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1Jlc29sdmVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlICE9PSAxIC8qIFBlbmRpbmcgKi8gfHwgaXNDaGFpbmVkO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2FsbGJhY2tzIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgb25jZSB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEluaXRpYWxseSBwdXNoZXMgY2FsbGJhY2tzIG9udG8gYSBxdWV1ZSBmb3IgZXhlY3V0aW9uIG9uY2UgdGhpcyBwcm9taXNlIHNldHRsZXMuIEFmdGVyIHRoZSBwcm9taXNlIHNldHRsZXMsXHJcbiAgICAgICAgICAgICAgICAgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxldCB3aGVuRmluaXNoZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXR0bGVzIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGxlID0gKG5ld1N0YXRlLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEEgcHJvbWlzZSBjYW4gb25seSBiZSBzZXR0bGVkIG9uY2UuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IDEgLyogUGVuZGluZyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB3aGVuRmluaXNoZWQgPSBxdWV1ZU1pY3JvVGFzaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgYW4gZXh0cmEgdHVybi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSBjYWxsYmFja3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3NbaV0uY2FsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlID0gKG5ld1N0YXRlLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc29sdmVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbihzZXR0bGUuYmluZChudWxsLCAwIC8qIEZ1bGZpbGxlZCAqLyksIHNldHRsZS5iaW5kKG51bGwsIDIgLyogUmVqZWN0ZWQgKi8pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGFpbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRsZShuZXdTdGF0ZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRoZW4gPSAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuRmluaXNoZWQgaW5pdGlhbGx5IHF1ZXVlcyB1cCBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBhZnRlciB0aGUgcHJvbWlzZSBoYXMgc2V0dGxlZC4gT25jZSB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvbWlzZSBoYXMgc2V0dGxlZCwgd2hlbkZpbmlzaGVkIHdpbGwgc2NoZWR1bGUgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgdHVybiB0aHJvdWdoIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVudCBsb29wLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuRmluaXNoZWQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnN0YXRlID09PSAyIC8qIFJlamVjdGVkICovID8gb25SZWplY3RlZCA6IG9uRnVsZmlsbGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2FsbGJhY2sodGhpcy5yZXNvbHZlZFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5yZXNvbHZlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNvbHZlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCByZXNvbHZlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlKDIgLyogUmVqZWN0ZWQgKi8sIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdGF0aWMgYWxsKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wbGV0ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9wdWxhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZnVsZmlsbChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2NvbXBsZXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZmluaXNoKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9wdWxhdGluZyB8fCBjb21wbGV0ZSA8IHRvdGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzSXRlbShpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK3RvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNUaGVuYWJsZShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzSXRlbShpLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGljIHJhY2UoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBQcm9taXNlIGl0ZW0gcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKHJlc29sdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGljIHJlamVjdChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdGF0aWMgcmVzb2x2ZSh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaChvblJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIF9hW1N5bWJvbC5zcGVjaWVzXSA9IFNoaW1Qcm9taXNlLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaGltUHJvbWlzZTtcclxudmFyIF9hO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Qcm9taXNlLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcclxuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XHJcbmltcG9ydCB7IGdldFZhbHVlRGVzY3JpcHRvciB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcclxuZXhwb3J0IGxldCBTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xyXG5pZiAoIXRydWUpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBzeW1ib2wsIHVzZWQgaW50ZXJuYWxseSB3aXRoaW4gdGhlIFNoaW1cclxuICAgICAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXHJcbiAgICAgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3NcclxuICAgICAqL1xyXG4gICAgY29uc3QgdmFsaWRhdGVTeW1ib2wgPSBmdW5jdGlvbiB2YWxpZGF0ZVN5bWJvbCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xyXG4gICAgY29uc3QgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XHJcbiAgICBjb25zdCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xyXG4gICAgY29uc3Qgb2JqUHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcclxuICAgIGNvbnN0IGdsb2JhbFN5bWJvbHMgPSB7fTtcclxuICAgIGNvbnN0IGdldFN5bWJvbE5hbWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXNjKSB7XHJcbiAgICAgICAgICAgIGxldCBwb3N0Zml4ID0gMDtcclxuICAgICAgICAgICAgbGV0IG5hbWU7XHJcbiAgICAgICAgICAgIHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcclxuICAgICAgICAgICAgICAgICsrcG9zdGZpeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcclxuICAgICAgICAgICAgY3JlYXRlZFtkZXNjXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG5hbWUgPSAnQEAnICsgZGVzYztcclxuICAgICAgICAgICAgLy8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXHJcbiAgICAgICAgICAgIC8vIHBpbm5lZCBkb3duLlxyXG4gICAgICAgICAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqUHJvdG90eXBlLCBuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH0pKCk7XHJcbiAgICBjb25zdCBJbnRlcm5hbFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgSW50ZXJuYWxTeW1ib2wpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XHJcbiAgICB9O1xyXG4gICAgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlKTtcclxuICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgPyAnJyA6IFN0cmluZyhkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXMoc3ltLCB7XHJcbiAgICAgICAgICAgIF9fZGVzY3JpcHRpb25fXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcclxuICAgICAgICAgICAgX19uYW1lX186IGdldFZhbHVlRGVzY3JpcHRvcihnZXRTeW1ib2xOYW1lKGRlc2NyaXB0aW9uKSlcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cclxuICAgIGRlZmluZVByb3BlcnR5KFN5bWJvbCwgJ2ZvcicsIGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbFN5bWJvbHNba2V5XSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbChTdHJpbmcoa2V5KSkpO1xyXG4gICAgfSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydGllcyhTeW1ib2wsIHtcclxuICAgICAgICBrZXlGb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoc3ltKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXk7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU3ltYm9sKHN5bSk7XHJcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxTeW1ib2xzW2tleV0gPT09IHN5bSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBoYXNJbnN0YW5jZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2hhc0luc3RhbmNlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgaXNDb25jYXRTcHJlYWRhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgaXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpdGVyYXRvcicpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIG1hdGNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignbWF0Y2gnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBvYnNlcnZhYmxlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignb2JzZXJ2YWJsZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHJlcGxhY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdyZXBsYWNlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc2VhcmNoOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc3BlY2llczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwZWNpZXMnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzcGxpdDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwbGl0JyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdG9QcmltaXRpdmU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHRvU3RyaW5nVGFnOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9TdHJpbmdUYWcnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB1bnNjb3BhYmxlczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3Vuc2NvcGFibGVzJyksIGZhbHNlLCBmYWxzZSlcclxuICAgIH0pO1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIEludGVybmFsU3ltYm9sIG9iamVjdCAqL1xyXG4gICAgZGVmaW5lUHJvcGVydGllcyhJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCksXHJcbiAgICAgICAgdG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbmFtZV9fO1xyXG4gICAgICAgIH0sIGZhbHNlLCBmYWxzZSlcclxuICAgIH0pO1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIFN5bWJvbC5wcm90b3R5cGUgKi9cclxuICAgIGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLnByb3RvdHlwZSwge1xyXG4gICAgICAgIHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sKHRoaXMpLl9fZGVzY3JpcHRpb25fXyArICcpJztcclxuICAgICAgICB9KSxcclxuICAgICAgICB2YWx1ZU9mOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvUHJpbWl0aXZlLCBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTtcclxuICAgIH0pKTtcclxuICAgIGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5KEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvUHJpbWl0aXZlLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLnByb3RvdHlwZVtTeW1ib2wudG9QcmltaXRpdmVdLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5KEludGVybmFsU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxufVxyXG4vKipcclxuICogQSBjdXN0b20gZ3VhcmQgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIGlmIGFuIG9iamVjdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHBhcmFtICB7YW55fSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2sgdG8gc2VlIGlmIGl0IGlzIGEgc3ltYm9sIG9yIG5vdFxyXG4gKiBAcmV0dXJuIHtpcyBzeW1ib2x9ICAgICAgIFJldHVybnMgdHJ1ZSBpZiBhIHN5bWJvbCBvciBub3QgKGFuZCBuYXJyb3dzIHRoZSB0eXBlIGd1YXJkKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnIHx8IHZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkgfHwgZmFsc2U7XHJcbn1cclxuLyoqXHJcbiAqIEZpbGwgYW55IG1pc3Npbmcgd2VsbCBrbm93biBzeW1ib2xzIGlmIHRoZSBuYXRpdmUgU3ltYm9sIGlzIG1pc3NpbmcgdGhlbVxyXG4gKi9cclxuW1xyXG4gICAgJ2hhc0luc3RhbmNlJyxcclxuICAgICdpc0NvbmNhdFNwcmVhZGFibGUnLFxyXG4gICAgJ2l0ZXJhdG9yJyxcclxuICAgICdzcGVjaWVzJyxcclxuICAgICdyZXBsYWNlJyxcclxuICAgICdzZWFyY2gnLFxyXG4gICAgJ3NwbGl0JyxcclxuICAgICdtYXRjaCcsXHJcbiAgICAndG9QcmltaXRpdmUnLFxyXG4gICAgJ3RvU3RyaW5nVGFnJyxcclxuICAgICd1bnNjb3BhYmxlcycsXHJcbiAgICAnb2JzZXJ2YWJsZSdcclxuXS5mb3JFYWNoKCh3ZWxsS25vd24pID0+IHtcclxuICAgIGlmICghU3ltYm9sW3dlbGxLbm93bl0pIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sLCB3ZWxsS25vd24sIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TeW1ib2wubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XHJcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi9pdGVyYXRvcic7XHJcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XHJcbmltcG9ydCAnLi9TeW1ib2wnO1xyXG5leHBvcnQgbGV0IFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcclxuaWYgKCF0cnVlKSB7XHJcbiAgICBjb25zdCBERUxFVEVEID0ge307XHJcbiAgICBjb25zdCBnZXRVSUQgPSBmdW5jdGlvbiBnZXRVSUQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgZ2VuZXJhdGVOYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgc3RhcnRJZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAlIDEwMDAwMDAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlTmFtZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdfX3dtJyArIGdldFVJRCgpICsgKHN0YXJ0SWQrKyArICdfXycpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG4gICAgV2Vha01hcCA9IGNsYXNzIFdlYWtNYXAge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdXZWFrTWFwJztcclxuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IGdlbmVyYXRlTmFtZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XHJcbiAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZnJvemVuRW50cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Zyb3plbkVudHJpZXNbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZShrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5LnZhbHVlID0gREVMRVRFRDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5zcGxpY2UoZnJvemVuSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb3plbkVudHJpZXNbZnJvemVuSW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhhcyhrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoQm9vbGVhbihlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWtleSB8fCAodHlwZW9mIGtleSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghZW50cnkgfHwgZW50cnkua2V5ICE9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB7IHZhbHVlOiBrZXkgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtleSwgdGhpcy5fbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZW50cnlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFdlYWtNYXA7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdlYWtNYXAubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcclxuaW1wb3J0IHsgaXNBcnJheUxpa2UsIGlzSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcclxuaW1wb3J0IHsgTUFYX1NBRkVfSU5URUdFUiB9IGZyb20gJy4vbnVtYmVyJztcclxuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcclxuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcclxuZXhwb3J0IGxldCBmcm9tO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBhcnJheSBmcm9tIHRoZSBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0gYXJndW1lbnRzIEFueSBudW1iZXIgb2YgYXJndW1lbnRzIGZvciB0aGUgYXJyYXlcclxuICogQHJldHVybiBBbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHNcclxuICovXHJcbmV4cG9ydCBsZXQgb2Y7XHJcbi8qIEVTNiBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXHJcbi8qKlxyXG4gKiBDb3BpZXMgZGF0YSBpbnRlcm5hbGx5IHdpdGhpbiBhbiBhcnJheSBvciBhcnJheS1saWtlIG9iamVjdC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XHJcbiAqIEBwYXJhbSBvZmZzZXQgVGhlIGluZGV4IHRvIHN0YXJ0IGNvcHlpbmcgdmFsdWVzIHRvOyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxyXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IChpbmNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXHJcbiAqIEBwYXJhbSBlbmQgVGhlIGxhc3QgKGV4Y2x1c2l2ZSkgaW5kZXggdG8gY29weTsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcclxuICogQHJldHVybiBUaGUgdGFyZ2V0XHJcbiAqL1xyXG5leHBvcnQgbGV0IGNvcHlXaXRoaW47XHJcbi8qKlxyXG4gKiBGaWxscyBlbGVtZW50cyBvZiBhbiBhcnJheS1saWtlIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCB0byBmaWxsXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBlYWNoIGVsZW1lbnQgb2YgdGhlIHRhcmdldCB3aXRoXHJcbiAqIEBwYXJhbSBzdGFydCBUaGUgZmlyc3QgaW5kZXggdG8gZmlsbFxyXG4gKiBAcGFyYW0gZW5kIFRoZSAoZXhjbHVzaXZlKSBpbmRleCBhdCB3aGljaCB0byBzdG9wIGZpbGxpbmdcclxuICogQHJldHVybiBUaGUgZmlsbGVkIHRhcmdldFxyXG4gKi9cclxuZXhwb3J0IGxldCBmaWxsO1xyXG4vKipcclxuICogRmluZHMgYW5kIHJldHVybnMgdGhlIGZpcnN0IGluc3RhbmNlIG1hdGNoaW5nIHRoZSBjYWxsYmFjayBvciB1bmRlZmluZWQgaWYgb25lIGlzIG5vdCBmb3VuZC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgQSBmdW5jdGlvbiByZXR1cm5pbmcgaWYgdGhlIGN1cnJlbnQgdmFsdWUgbWF0Y2hlcyBhIGNyaXRlcmlhXHJcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cclxuICogQHJldHVybiBUaGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyB0aGUgY2FsbGJhY2ssIG9yIHVuZGVmaW5lZCBpZiBvbmUgZG9lcyBub3QgZXhpc3RcclxuICovXHJcbmV4cG9ydCBsZXQgZmluZDtcclxuLyoqXHJcbiAqIFBlcmZvcm1zIGEgbGluZWFyIHNlYXJjaCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssXHJcbiAqIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0LlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IEFuIGFycmF5LWxpa2Ugb2JqZWN0XHJcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyB0cnVlIGlmIHRoZSBjdXJyZW50IHZhbHVlIHNhdGlzZmllcyBpdHMgY3JpdGVyaWFcclxuICogQHBhcmFtIHRoaXNBcmcgVGhlIGV4ZWN1dGlvbiBjb250ZXh0IGZvciB0aGUgZmluZCBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIFRoZSBmaXJzdCBpbmRleCB3aG9zZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHBhc3NlZCBjYWxsYmFjaywgb3IgLTEgaWYgbm8gdmFsdWVzIHNhdGlzZnkgaXRcclxuICovXHJcbmV4cG9ydCBsZXQgZmluZEluZGV4O1xyXG4vKiBFUzcgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIGFycmF5IGluY2x1ZGVzIGEgZ2l2ZW4gdmFsdWVcclxuICpcclxuICogQHBhcmFtIHRhcmdldCB0aGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XHJcbiAqIEBwYXJhbSBzZWFyY2hFbGVtZW50IHRoZSBpdGVtIHRvIHNlYXJjaCBmb3JcclxuICogQHBhcmFtIGZyb21JbmRleCB0aGUgc3RhcnRpbmcgaW5kZXggdG8gc2VhcmNoIGZyb21cclxuICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGFycmF5IGluY2x1ZGVzIHRoZSBlbGVtZW50LCBvdGhlcndpc2UgYGZhbHNlYFxyXG4gKi9cclxuZXhwb3J0IGxldCBpbmNsdWRlcztcclxuaWYgKHRydWUgJiYgdHJ1ZSkge1xyXG4gICAgZnJvbSA9IGdsb2JhbC5BcnJheS5mcm9tO1xyXG4gICAgb2YgPSBnbG9iYWwuQXJyYXkub2Y7XHJcbiAgICBjb3B5V2l0aGluID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xyXG4gICAgZmlsbCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maWxsKTtcclxuICAgIGZpbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZCk7XHJcbiAgICBmaW5kSW5kZXggPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXHJcbiAgICAvLyBUbyBtYWtlIHRoaW5ncyBlYXNpZXIsIGlmIHRoZXJlIGlzIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24sIHRoZSB3aG9sZSBzZXQgb2YgZnVuY3Rpb25zIHdpbGwgYmUgZmlsbGVkXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgY29uc3QgdG9MZW5ndGggPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBNQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZyb20gRVM2IDcuMS40IFRvSW50ZWdlcigpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgdG8gY29udmVydFxyXG4gICAgICogQHJldHVybiBBbiBpbnRlZ2VyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHRvSW50ZWdlciA9IGZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgb3JpZ2luYWwgb2Zmc2V0XHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3RcclxuICAgICAqIEByZXR1cm4gSWYgbmVnYXRpdmUsIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIHRoZSBlbmQgKGxlbmd0aCk7IG90aGVyd2lzZSBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSAwXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IG5vcm1hbGl6ZU9mZnNldCA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGgubWF4KGxlbmd0aCArIHZhbHVlLCAwKSA6IE1hdGgubWluKHZhbHVlLCBsZW5ndGgpO1xyXG4gICAgfTtcclxuICAgIGZyb20gPSBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSwgbWFwRnVuY3Rpb24sIHRoaXNBcmcpIHtcclxuICAgICAgICBpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1hcEZ1bmN0aW9uICYmIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgbWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcztcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0b0xlbmd0aChhcnJheUxpa2UubGVuZ3RoKTtcclxuICAgICAgICAvLyBTdXBwb3J0IGV4dGVuc2lvblxyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gdHlwZW9mIENvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gT2JqZWN0KG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpKSA6IG5ldyBBcnJheShsZW5ndGgpO1xyXG4gICAgICAgIGlmICghaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxyXG4gICAgICAgIC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cclxuICAgICAgICBpZiAoaXNBcnJheUxpa2UoYXJyYXlMaWtlKSkge1xyXG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheUxpa2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbihhcnJheUxpa2VbaV0sIGkpIDogYXJyYXlMaWtlW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgYXJyYXlMaWtlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFycmF5TGlrZS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhcnJheS5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH07XHJcbiAgICBvZiA9IGZ1bmN0aW9uIG9mKC4uLml0ZW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcclxuICAgIH07XHJcbiAgICBjb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIG9mZnNldCwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb3B5V2l0aGluOiB0YXJnZXQgbXVzdCBiZSBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBvZmZzZXQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKG9mZnNldCksIGxlbmd0aCk7XHJcbiAgICAgICAgc3RhcnQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKHN0YXJ0KSwgbGVuZ3RoKTtcclxuICAgICAgICBlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcclxuICAgICAgICBsZXQgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gc3RhcnQgJiYgb2Zmc2V0IDwgc3RhcnQgKyBjb3VudCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAtMTtcclxuICAgICAgICAgICAgc3RhcnQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGFydCBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRbb2Zmc2V0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBzdGFydCArPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZmlsbCA9IGZ1bmN0aW9uIGZpbGwodGFyZ2V0LCB2YWx1ZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGxldCBpID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCksIGxlbmd0aCk7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBlbmQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2krK10gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcbiAgICBmaW5kID0gZnVuY3Rpb24gZmluZCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ICE9PSAtMSA/IHRhcmdldFtpbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgZmluZEluZGV4ID0gZnVuY3Rpb24gZmluZEluZGV4KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ZpbmQ6IHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXNBcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayh0YXJnZXRbaV0sIGksIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcbn1cclxuaWYgKHRydWUpIHtcclxuICAgIGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXHJcbiAgICAgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxyXG4gICAgICovXHJcbiAgICBjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xyXG4gICAgfTtcclxuICAgIGluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGFyZ2V0LCBzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXggPSAwKSB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IHRhcmdldFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFycmF5Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2FycmF5Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJjb25zdCBnbG9iYWxPYmplY3QgPSAoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBnbG9iYWwgc3BlYyBkZWZpbmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IGNhbGxlZCAnZ2xvYmFsJ1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1nbG9iYWxcbiAgICAgICAgLy8gYGdsb2JhbGAgaXMgYWxzbyBkZWZpbmVkIGluIE5vZGVKU1xuICAgICAgICByZXR1cm4gZ2xvYmFsO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB3aW5kb3cgaXMgZGVmaW5lZCBpbiBicm93c2Vyc1xuICAgICAgICByZXR1cm4gd2luZG93O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gc2VsZiBpcyBkZWZpbmVkIGluIFdlYldvcmtlcnNcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfVxufSkoKTtcbmV4cG9ydCBkZWZhdWx0IGdsb2JhbE9iamVjdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdsb2JhbC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgJy4vU3ltYm9sJztcbmltcG9ydCB7IEhJR0hfU1VSUk9HQVRFX01BWCwgSElHSF9TVVJST0dBVEVfTUlOIH0gZnJvbSAnLi9zdHJpbmcnO1xuY29uc3Qgc3RhdGljRG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuLyoqXG4gKiBBIGNsYXNzIHRoYXQgX3NoaW1zXyBhbiBpdGVyYXRvciBpbnRlcmZhY2Ugb24gYXJyYXkgbGlrZSBvYmplY3RzLlxuICovXG5leHBvcnQgY2xhc3MgU2hpbUl0ZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihsaXN0KSB7XG4gICAgICAgIHRoaXMuX25leHRJbmRleCA9IC0xO1xuICAgICAgICBpZiAoaXNJdGVyYWJsZShsaXN0KSkge1xuICAgICAgICAgICAgdGhpcy5fbmF0aXZlSXRlcmF0b3IgPSBsaXN0W1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSBsaXN0O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgbmV4dCBpdGVyYXRpb24gcmVzdWx0IGZvciB0aGUgSXRlcmF0b3JcbiAgICAgKi9cbiAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9saXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKyt0aGlzLl9uZXh0SW5kZXggPCB0aGlzLl9saXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fbGlzdFt0aGlzLl9uZXh0SW5kZXhdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0aWNEb25lO1xuICAgIH1cbiAgICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBoYXMgYW4gSXRlcmFibGUgaW50ZXJmYWNlXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGlzIEFycmF5TGlrZVxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgZm9yIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgaXRlcmFibGUgb2JqZWN0IHRvIHJldHVybiB0aGUgaXRlcmF0b3IgZm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXQoaXRlcmFibGUpIHtcbiAgICBpZiAoaXNJdGVyYWJsZShpdGVyYWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICB9XG59XG4vKipcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIG9iamVjdCB0aGUgcHJvdmlkZXMgYW4gaW50ZXJhdG9yIGludGVyZmFjZVxuICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIG9mIHRoZSBpdGVyYWJsZVxuICogQHBhcmFtIHRoaXNBcmcgT3B0aW9uYWwgc2NvcGUgdG8gcGFzcyB0aGUgY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvck9mKGl0ZXJhYmxlLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGxldCBicm9rZW4gPSBmYWxzZTtcbiAgICBmdW5jdGlvbiBkb0JyZWFrKCkge1xuICAgICAgICBicm9rZW4gPSB0cnVlO1xuICAgIH1cbiAgICAvKiBXZSBuZWVkIHRvIGhhbmRsZSBpdGVyYXRpb24gb2YgZG91YmxlIGJ5dGUgc3RyaW5ncyBwcm9wZXJseSAqL1xuICAgIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkgJiYgdHlwZW9mIGl0ZXJhYmxlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBsID0gaXRlcmFibGUubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNoYXIgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgIGlmIChpICsgMSA8IGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIGlmIChjb2RlID49IEhJR0hfU1VSUk9HQVRFX01JTiAmJiBjb2RlIDw9IEhJR0hfU1VSUk9HQVRFX01BWCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFyICs9IGl0ZXJhYmxlWysraV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XG4gICAgICAgICAgICBpZiAoYnJva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XG4gICAgICAgIGlmIChpdGVyYXRvcikge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlc3VsdC52YWx1ZSwgaXRlcmFibGUsIGRvQnJlYWspO1xuICAgICAgICAgICAgICAgIGlmIChicm9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pdGVyYXRvci5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9pdGVyYXRvci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG4vKipcbiAqIFRoZSBzbWFsbGVzdCBpbnRlcnZhbCBiZXR3ZWVuIHR3byByZXByZXNlbnRhYmxlIG51bWJlcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUFNJTE9OID0gMTtcbi8qKlxuICogVGhlIG1heGltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuLyoqXG4gKiBUaGUgbWluaW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxuICovXG5leHBvcnQgY29uc3QgTUlOX1NBRkVfSU5URUdFUiA9IC1NQVhfU0FGRV9JTlRFR0VSO1xuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBOYU4gd2l0aG91dCBjb2Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgTmFOLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsLmlzTmFOKHZhbHVlKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyIHdpdGhvdXQgY29lcnNpb24uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGZpbml0ZSwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc0Zpbml0ZSh2YWx1ZSk7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIgdGhhdCBpcyAnc2FmZSwnIG1lYW5pbmc6XG4gKiAgIDEuIGl0IGNhbiBiZSBleHByZXNzZWQgYXMgYW4gSUVFRS03NTQgZG91YmxlIHByZWNpc2lvbiBudW1iZXJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXG4gKiAgICAgIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uIGNhbm5vdCBiZSB0aGUgcmVzdWx0IG9mIHJvdW5kaW5nIGFueSBvdGhlclxuICogICAgICBpbnRlZ2VyIHRvIGZpdCB0aGUgSUVFRS03NTQgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgTWF0aC5hYnModmFsdWUpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1udW1iZXIubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XHJcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XHJcbmltcG9ydCB7IGlzU3ltYm9sIH0gZnJvbSAnLi9TeW1ib2wnO1xyXG5leHBvcnQgbGV0IGFzc2lnbjtcclxuLyoqXHJcbiAqIEdldHMgdGhlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxyXG4gKiBBbiBvd24gcHJvcGVydHkgZGVzY3JpcHRvciBpcyBvbmUgdGhhdCBpcyBkZWZpbmVkIGRpcmVjdGx5IG9uIHRoZSBvYmplY3QgYW5kIGlzIG5vdFxyXG4gKiBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLlxyXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydHkuXHJcbiAqIEBwYXJhbSBwIE5hbWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LiBUaGUgb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFyZSB0aG9zZSB0aGF0IGFyZSBkZWZpbmVkIGRpcmVjdGx5XHJcbiAqIG9uIHRoYXQgb2JqZWN0LCBhbmQgYXJlIG5vdCBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLiBUaGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgaW5jbHVkZSBib3RoIGZpZWxkcyAob2JqZWN0cykgYW5kIGZ1bmN0aW9ucy5cclxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIG93biBwcm9wZXJ0aWVzLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eU5hbWVzO1xyXG4vKipcclxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3ltYm9sIHByb3BlcnRpZXMgZm91bmQgZGlyZWN0bHkgb24gb2JqZWN0IG8uXHJcbiAqIEBwYXJhbSBvIE9iamVjdCB0byByZXRyaWV2ZSB0aGUgc3ltYm9scyBmcm9tLlxyXG4gKi9cclxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWUgdmFsdWUsIGZhbHNlIG90aGVyd2lzZS5cclxuICogQHBhcmFtIHZhbHVlMSBUaGUgZmlyc3QgdmFsdWUuXHJcbiAqIEBwYXJhbSB2YWx1ZTIgVGhlIHNlY29uZCB2YWx1ZS5cclxuICovXHJcbmV4cG9ydCBsZXQgaXM7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9mIGFuIG9iamVjdC5cclxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGtleXM7XHJcbi8qIEVTNyBPYmplY3Qgc3RhdGljIG1ldGhvZHMgKi9cclxuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xyXG5leHBvcnQgbGV0IGVudHJpZXM7XHJcbmV4cG9ydCBsZXQgdmFsdWVzO1xyXG5pZiAodHJ1ZSkge1xyXG4gICAgY29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcclxuICAgIGFzc2lnbiA9IGdsb2JhbE9iamVjdC5hc3NpZ247XHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4gICAgZ2V0T3duUHJvcGVydHlOYW1lcyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xyXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcclxuICAgIGlzID0gZ2xvYmFsT2JqZWN0LmlzO1xyXG4gICAga2V5cyA9IGdsb2JhbE9iamVjdC5rZXlzO1xyXG59XHJcbmVsc2Uge1xyXG4gICAga2V5cyA9IGZ1bmN0aW9uIHN5bWJvbEF3YXJlS2V5cyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcclxuICAgIH07XHJcbiAgICBhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuICAgICAgICBzb3VyY2VzLmZvckVhY2goKG5leHRTb3VyY2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAga2V5cyhuZXh0U291cmNlKS5mb3JFYWNoKChuZXh0S2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdG87XHJcbiAgICB9O1xyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApIHtcclxuICAgICAgICBpZiAoaXNTeW1ib2wocHJvcCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5maWx0ZXIoKGtleSkgPT4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSk7XHJcbiAgICB9O1xyXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobylcclxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KSA9PiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpXHJcbiAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gU3ltYm9sLmZvcihrZXkuc3Vic3RyaW5nKDIpKSk7XHJcbiAgICB9O1xyXG4gICAgaXMgPSBmdW5jdGlvbiBpcyh2YWx1ZTEsIHZhbHVlMikge1xyXG4gICAgICAgIGlmICh2YWx1ZTEgPT09IHZhbHVlMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUxICE9PSAwIHx8IDEgLyB2YWx1ZTEgPT09IDEgLyB2YWx1ZTI7IC8vIC0wXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMSAmJiB2YWx1ZTIgIT09IHZhbHVlMjsgLy8gTmFOXHJcbiAgICB9O1xyXG59XHJcbmlmICh0cnVlKSB7XHJcbiAgICBjb25zdCBnbG9iYWxPYmplY3QgPSBnbG9iYWwuT2JqZWN0O1xyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xyXG4gICAgZW50cmllcyA9IGdsb2JhbE9iamVjdC5lbnRyaWVzO1xyXG4gICAgdmFsdWVzID0gZ2xvYmFsT2JqZWN0LnZhbHVlcztcclxufVxyXG5lbHNlIHtcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG8pIHtcclxuICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoKHByZXZpb3VzLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgcHJldmlvdXNba2V5XSA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgICAgICAgfSwge30pO1xyXG4gICAgfTtcclxuICAgIGVudHJpZXMgPSBmdW5jdGlvbiBlbnRyaWVzKG8pIHtcclxuICAgICAgICByZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gW2tleSwgb1trZXldXSk7XHJcbiAgICB9O1xyXG4gICAgdmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzKG8pIHtcclxuICAgICAgICByZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gb1trZXldKTtcclxuICAgIH07XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JqZWN0Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xyXG5pbXBvcnQgeyB3cmFwTmF0aXZlIH0gZnJvbSAnLi9zdXBwb3J0L3V0aWwnO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUFYID0gMHhkYmZmO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydCBjb25zdCBMT1dfU1VSUk9HQVRFX01JTiA9IDB4ZGMwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XHJcbi8qIEVTNiBzdGF0aWMgbWV0aG9kcyAqL1xyXG4vKipcclxuICogUmV0dXJuIHRoZSBTdHJpbmcgdmFsdWUgd2hvc2UgZWxlbWVudHMgYXJlLCBpbiBvcmRlciwgdGhlIGVsZW1lbnRzIGluIHRoZSBMaXN0IGVsZW1lbnRzLlxyXG4gKiBJZiBsZW5ndGggaXMgMCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cclxuICogQHBhcmFtIGNvZGVQb2ludHMgVGhlIGNvZGUgcG9pbnRzIHRvIGdlbmVyYXRlIHRoZSBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBsZXQgZnJvbUNvZGVQb2ludDtcclxuLyoqXHJcbiAqIGByYXdgIGlzIGludGVuZGVkIGZvciB1c2UgYXMgYSB0YWcgZnVuY3Rpb24gb2YgYSBUYWdnZWQgVGVtcGxhdGUgU3RyaW5nLiBXaGVuIGNhbGxlZFxyXG4gKiBhcyBzdWNoIHRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGJlIGEgd2VsbCBmb3JtZWQgdGVtcGxhdGUgY2FsbCBzaXRlIG9iamVjdCBhbmQgdGhlIHJlc3RcclxuICogcGFyYW1ldGVyIHdpbGwgY29udGFpbiB0aGUgc3Vic3RpdHV0aW9uIHZhbHVlcy5cclxuICogQHBhcmFtIHRlbXBsYXRlIEEgd2VsbC1mb3JtZWQgdGVtcGxhdGUgc3RyaW5nIGNhbGwgc2l0ZSByZXByZXNlbnRhdGlvbi5cclxuICogQHBhcmFtIHN1YnN0aXR1dGlvbnMgQSBzZXQgb2Ygc3Vic3RpdHV0aW9uIHZhbHVlcy5cclxuICovXHJcbmV4cG9ydCBsZXQgcmF3O1xyXG4vKiBFUzYgaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIG5vbm5lZ2F0aXZlIGludGVnZXIgTnVtYmVyIGxlc3MgdGhhbiAxMTE0MTEyICgweDExMDAwMCkgdGhhdCBpcyB0aGUgY29kZSBwb2ludFxyXG4gKiB2YWx1ZSBvZiB0aGUgVVRGLTE2IGVuY29kZWQgY29kZSBwb2ludCBzdGFydGluZyBhdCB0aGUgc3RyaW5nIGVsZW1lbnQgYXQgcG9zaXRpb24gcG9zIGluXHJcbiAqIHRoZSBTdHJpbmcgcmVzdWx0aW5nIGZyb20gY29udmVydGluZyB0aGlzIG9iamVjdCB0byBhIFN0cmluZy5cclxuICogSWYgdGhlcmUgaXMgbm8gZWxlbWVudCBhdCB0aGF0IHBvc2l0aW9uLCB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZC5cclxuICogSWYgYSB2YWxpZCBVVEYtMTYgc3Vycm9nYXRlIHBhaXIgZG9lcyBub3QgYmVnaW4gYXQgcG9zLCB0aGUgcmVzdWx0IGlzIHRoZSBjb2RlIHVuaXQgYXQgcG9zLlxyXG4gKi9cclxuZXhwb3J0IGxldCBjb2RlUG9pbnRBdDtcclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcclxuICogc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50cyBvZiB0aGlzIG9iamVjdCAoY29udmVydGVkIHRvIGEgU3RyaW5nKSBzdGFydGluZyBhdFxyXG4gKiBlbmRQb3NpdGlvbiDigJMgbGVuZ3RoKHRoaXMpLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICovXHJcbmV4cG9ydCBsZXQgZW5kc1dpdGg7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgc2VhcmNoU3RyaW5nIGFwcGVhcnMgYXMgYSBzdWJzdHJpbmcgb2YgdGhlIHJlc3VsdCBvZiBjb252ZXJ0aW5nIHRoaXNcclxuICogb2JqZWN0IHRvIGEgU3RyaW5nLCBhdCBvbmUgb3IgbW9yZSBwb3NpdGlvbnMgdGhhdCBhcmVcclxuICogZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHBvc2l0aW9uOyBvdGhlcndpc2UsIHJldHVybnMgZmFsc2UuXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcclxuICogQHBhcmFtIHNlYXJjaFN0cmluZyBzZWFyY2ggc3RyaW5nXHJcbiAqIEBwYXJhbSBwb3NpdGlvbiBJZiBwb3NpdGlvbiBpcyB1bmRlZmluZWQsIDAgaXMgYXNzdW1lZCwgc28gYXMgdG8gc2VhcmNoIGFsbCBvZiB0aGUgU3RyaW5nLlxyXG4gKi9cclxuZXhwb3J0IGxldCBpbmNsdWRlcztcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIFN0cmluZyB2YWx1ZSByZXN1bHQgb2Ygbm9ybWFsaXppbmcgdGhlIHN0cmluZyBpbnRvIHRoZSBub3JtYWxpemF0aW9uIGZvcm1cclxuICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xyXG4gKiBAcGFyYW0gZm9ybSBBcHBsaWNhYmxlIHZhbHVlczogXCJORkNcIiwgXCJORkRcIiwgXCJORktDXCIsIG9yIFwiTkZLRFwiLCBJZiBub3Qgc3BlY2lmaWVkIGRlZmF1bHRcclxuICogaXMgXCJORkNcIlxyXG4gKi9cclxuZXhwb3J0IGxldCBub3JtYWxpemU7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHRoYXQgaXMgbWFkZSBmcm9tIGNvdW50IGNvcGllcyBhcHBlbmRlZCB0b2dldGhlci4gSWYgY291bnQgaXMgMCxcclxuICogVCBpcyB0aGUgZW1wdHkgU3RyaW5nIGlzIHJldHVybmVkLlxyXG4gKiBAcGFyYW0gY291bnQgbnVtYmVyIG9mIGNvcGllcyB0byBhcHBlbmRcclxuICovXHJcbmV4cG9ydCBsZXQgcmVwZWF0O1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzZXF1ZW5jZSBvZiBlbGVtZW50cyBvZiBzZWFyY2hTdHJpbmcgY29udmVydGVkIHRvIGEgU3RyaW5nIGlzIHRoZVxyXG4gKiBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIG9mIHRoaXMgb2JqZWN0IChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpIHN0YXJ0aW5nIGF0XHJcbiAqIHBvc2l0aW9uLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICovXHJcbmV4cG9ydCBsZXQgc3RhcnRzV2l0aDtcclxuLyogRVM3IGluc3RhbmNlIG1ldGhvZHMgKi9cclxuLyoqXHJcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXHJcbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgZW5kIChyaWdodCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXHJcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXHJcbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cclxuICpcclxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXHJcbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXHJcbiAqICAgICAgICBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhpcyBwYXJhbWV0ZXIgaXMgXCIgXCIgKFUrMDAyMCkuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHBhZEVuZDtcclxuLyoqXHJcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXHJcbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgc3RhcnQgKGxlZnQpIG9mIHRoZSBjdXJyZW50IHN0cmluZy5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xyXG4gKiBAcGFyYW0gbWF4TGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBzdHJpbmcgb25jZSB0aGUgY3VycmVudCBzdHJpbmcgaGFzIGJlZW4gcGFkZGVkLlxyXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmaWxsU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFkIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoLlxyXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxyXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxyXG4gKi9cclxuZXhwb3J0IGxldCBwYWRTdGFydDtcclxuaWYgKHRydWUgJiYgdHJ1ZSkge1xyXG4gICAgZnJvbUNvZGVQb2ludCA9IGdsb2JhbC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcclxuICAgIHJhdyA9IGdsb2JhbC5TdHJpbmcucmF3O1xyXG4gICAgY29kZVBvaW50QXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcclxuICAgIGVuZHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCk7XHJcbiAgICBpbmNsdWRlcyA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpO1xyXG4gICAgbm9ybWFsaXplID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xyXG4gICAgcmVwZWF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQpO1xyXG4gICAgc3RhcnRzV2l0aCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxyXG4gICAgICogVXNlZCBieSBzdGFydHNXaXRoLCBpbmNsdWRlcywgYW5kIGVuZHNXaXRoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cclxuICAgICAqL1xyXG4gICAgY29uc3Qgbm9ybWFsaXplU3Vic3RyaW5nQXJncyA9IGZ1bmN0aW9uIChuYW1lLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uLCBpc0VuZCA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuJyArIG5hbWUgKyAnIHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nIHRvIHNlYXJjaCBhZ2FpbnN0LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uICE9PSBwb3NpdGlvbiA/IChpc0VuZCA/IGxlbmd0aCA6IDApIDogcG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0LCBTdHJpbmcoc2VhcmNoKSwgTWF0aC5taW4oTWF0aC5tYXgocG9zaXRpb24sIDApLCBsZW5ndGgpXTtcclxuICAgIH07XHJcbiAgICBmcm9tQ29kZVBvaW50ID0gZnVuY3Rpb24gZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKSB7XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5mcm9tQ29kZVBvaW50XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XHJcbiAgICAgICAgY29uc3QgTUFYX1NJWkUgPSAweDQwMDA7XHJcbiAgICAgICAgbGV0IGNvZGVVbml0cyA9IFtdO1xyXG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICBsZXQgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAvLyBDb2RlIHBvaW50cyBtdXN0IGJlIGZpbml0ZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHZhbGlkIHJhbmdlXHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gaXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc3RyaW5nLmZyb21Db2RlUG9pbnQ6IEludmFsaWQgY29kZSBwb2ludCAnICsgY29kZVBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29kZVBvaW50IDw9IDB4ZmZmZikge1xyXG4gICAgICAgICAgICAgICAgLy8gQk1QIGNvZGUgcG9pbnRcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXHJcbiAgICAgICAgICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBISUdIX1NVUlJPR0FURV9NSU47XHJcbiAgICAgICAgICAgICAgICBsZXQgbG93U3Vycm9nYXRlID0gY29kZVBvaW50ICUgMHg0MDAgKyBMT1dfU1VSUk9HQVRFX01JTjtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICByYXcgPSBmdW5jdGlvbiByYXcoY2FsbFNpdGUsIC4uLnN1YnN0aXR1dGlvbnMpIHtcclxuICAgICAgICBsZXQgcmF3U3RyaW5ncyA9IGNhbGxTaXRlLnJhdztcclxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgbGV0IG51bVN1YnN0aXR1dGlvbnMgPSBzdWJzdGl0dXRpb25zLmxlbmd0aDtcclxuICAgICAgICBpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmF3IHJlcXVpcmVzIGEgdmFsaWQgY2FsbFNpdGUgb2JqZWN0IHdpdGggYSByYXcgdmFsdWUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHJhd1N0cmluZ3NbaV0gKyAoaSA8IG51bVN1YnN0aXR1dGlvbnMgJiYgaSA8IGxlbmd0aCAtIDEgPyBzdWJzdGl0dXRpb25zW2ldIDogJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIGNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dCwgcG9zaXRpb24gPSAwKSB7XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5jb2RlUG9pbnRBdCByZXF1cmllcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgY29kZSB1bml0XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xyXG4gICAgICAgIGlmIChmaXJzdCA+PSBISUdIX1NVUlJPR0FURV9NSU4gJiYgZmlyc3QgPD0gSElHSF9TVVJST0dBVEVfTUFYICYmIGxlbmd0aCA+IHBvc2l0aW9uICsgMSkge1xyXG4gICAgICAgICAgICAvLyBTdGFydCBvZiBhIHN1cnJvZ2F0ZSBwYWlyIChoaWdoIHN1cnJvZ2F0ZSBhbmQgdGhlcmUgaXMgYSBuZXh0IGNvZGUgdW5pdCk7IGNoZWNrIGZvciBsb3cgc3Vycm9nYXRlXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmQgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKTtcclxuICAgICAgICAgICAgaWYgKHNlY29uZCA+PSBMT1dfU1VSUk9HQVRFX01JTiAmJiBzZWNvbmQgPD0gTE9XX1NVUlJPR0FURV9NQVgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZmlyc3QgLSBISUdIX1NVUlJPR0FURV9NSU4pICogMHg0MDAgKyBzZWNvbmQgLSBMT1dfU1VSUk9HQVRFX01JTiArIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0O1xyXG4gICAgfTtcclxuICAgIGVuZHNXaXRoID0gZnVuY3Rpb24gZW5kc1dpdGgodGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFt0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBlbmRQb3NpdGlvbiAtIHNlYXJjaC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKHN0YXJ0LCBlbmRQb3NpdGlvbikgPT09IHNlYXJjaDtcclxuICAgIH07XHJcbiAgICBpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRleHQsIHNlYXJjaCwgcG9zaXRpb24gPSAwKSB7XHJcbiAgICAgICAgW3RleHQsIHNlYXJjaCwgcG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnaW5jbHVkZXMnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcclxuICAgICAgICByZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcclxuICAgIH07XHJcbiAgICByZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQodGV4dCwgY291bnQgPSAwKSB7XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUucmVwZWF0XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY291bnQgIT09IGNvdW50KSB7XHJcbiAgICAgICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvdW50IDwgMCB8fCBjb3VudCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKGNvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjb3VudCAlIDIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCA+Pj0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBzdGFydHNXaXRoID0gZnVuY3Rpb24gc3RhcnRzV2l0aCh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgIHNlYXJjaCA9IFN0cmluZyhzZWFyY2gpO1xyXG4gICAgICAgIFt0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ3N0YXJ0c1dpdGgnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcclxuICAgICAgICBjb25zdCBlbmQgPSBwb3NpdGlvbiArIHNlYXJjaC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGVuZCA+IHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UocG9zaXRpb24sIGVuZCkgPT09IHNlYXJjaDtcclxuICAgIH07XHJcbn1cclxuaWYgKHRydWUpIHtcclxuICAgIHBhZEVuZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcclxuICAgIHBhZFN0YXJ0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBwYWRFbmQgPSBmdW5jdGlvbiBwYWRFbmQodGV4dCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nID0gJyAnKSB7XHJcbiAgICAgICAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgICAgIGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcclxuICAgICAgICBpZiAocGFkZGluZyA+IDApIHtcclxuICAgICAgICAgICAgc3RyVGV4dCArPVxyXG4gICAgICAgICAgICAgICAgcmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG4gICAgcGFkU3RhcnQgPSBmdW5jdGlvbiBwYWRTdGFydCh0ZXh0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcgPSAnICcpIHtcclxuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRTdGFydCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICBjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgPVxyXG4gICAgICAgICAgICAgICAgcmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyVGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cmluZy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgaGFzLCB7IGFkZCB9IGZyb20gJ0Bkb2pvL2hhcy9oYXMnO1xyXG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XHJcbmV4cG9ydCBkZWZhdWx0IGhhcztcclxuZXhwb3J0ICogZnJvbSAnQGRvam8vaGFzL2hhcyc7XHJcbi8qIEVDTUFTY3JpcHQgNiBhbmQgNyBGZWF0dXJlcyAqL1xyXG4vKiBBcnJheSAqL1xyXG5hZGQoJ2VzNi1hcnJheScsICgpID0+IHtcclxuICAgIHJldHVybiAoWydmcm9tJywgJ29mJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheSkgJiZcclxuICAgICAgICBbJ2ZpbmRJbmRleCcsICdmaW5kJywgJ2NvcHlXaXRoaW4nXS5ldmVyeSgoa2V5KSA9PiBrZXkgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSkpO1xyXG59LCB0cnVlKTtcclxuYWRkKCdlczYtYXJyYXktZmlsbCcsICgpID0+IHtcclxuICAgIGlmICgnZmlsbCcgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSkge1xyXG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xyXG4gICAgICAgIHJldHVybiBbMV0uZmlsbCg5LCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpWzBdID09PSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuYWRkKCdlczctYXJyYXknLCAoKSA9PiAnaW5jbHVkZXMnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUsIHRydWUpO1xyXG4vKiBNYXAgKi9cclxuYWRkKCdlczYtbWFwJywgKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwuTWFwID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLypcclxuICAgIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcclxuICAgIFdlIHdyYXAgdGhpcyBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIHNvbWV0aW1lcyB0aGUgTWFwIGNvbnN0cnVjdG9yIGV4aXN0cywgYnV0IGRvZXMgbm90XHJcbiAgICB0YWtlIGFyZ3VtZW50cyAoaU9TIDguNClcclxuICAgICAqL1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuTWFwKFtbMCwgMV1dKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcC5oYXMoMCkgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJlxyXG4gICAgICAgICAgICAgICAgdHJ1ZSAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCB0ZXN0aW5nIG9uIGlPUyBhdCB0aGUgbW9tZW50ICovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBNYXRoICovXHJcbmFkZCgnZXM2LW1hdGgnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgICdjbHozMicsXHJcbiAgICAgICAgJ3NpZ24nLFxyXG4gICAgICAgICdsb2cxMCcsXHJcbiAgICAgICAgJ2xvZzInLFxyXG4gICAgICAgICdsb2cxcCcsXHJcbiAgICAgICAgJ2V4cG0xJyxcclxuICAgICAgICAnY29zaCcsXHJcbiAgICAgICAgJ3NpbmgnLFxyXG4gICAgICAgICd0YW5oJyxcclxuICAgICAgICAnYWNvc2gnLFxyXG4gICAgICAgICdhc2luaCcsXHJcbiAgICAgICAgJ2F0YW5oJyxcclxuICAgICAgICAndHJ1bmMnLFxyXG4gICAgICAgICdmcm91bmQnLFxyXG4gICAgICAgICdjYnJ0JyxcclxuICAgICAgICAnaHlwb3QnXHJcbiAgICBdLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk1hdGhbbmFtZV0gPT09ICdmdW5jdGlvbicpO1xyXG59LCB0cnVlKTtcclxuYWRkKCdlczYtbWF0aC1pbXVsJywgKCkgPT4ge1xyXG4gICAgaWYgKCdpbXVsJyBpbiBnbG9iYWwuTWF0aCkge1xyXG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDUpID09PSAtNTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9iamVjdCAqL1xyXG5hZGQoJ2VzNi1vYmplY3QnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gdHJ1ZSAmJlxyXG4gICAgICAgIFsnYXNzaWduJywgJ2lzJywgJ2dldE93blByb3BlcnR5U3ltYm9scycsICdzZXRQcm90b3R5cGVPZiddLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XHJcbn0sIHRydWUpO1xyXG5hZGQoJ2VzMjAxNy1vYmplY3QnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gWyd2YWx1ZXMnLCAnZW50cmllcycsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzJ10uZXZlcnkoKG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nKTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9ic2VydmFibGUgKi9cclxuYWRkKCdlcy1vYnNlcnZhYmxlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5PYnNlcnZhYmxlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XHJcbi8qIFByb21pc2UgKi9cclxuYWRkKCdlczYtcHJvbWlzZScsICgpID0+IHR5cGVvZiBnbG9iYWwuUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHJ1ZSwgdHJ1ZSk7XHJcbi8qIFNldCAqL1xyXG5hZGQoJ2VzNi1zZXQnLCAoKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5TZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IFNldCBmdW5jdGlvbmFsaXR5ICovXHJcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IGdsb2JhbC5TZXQoWzFdKTtcclxuICAgICAgICByZXR1cm4gc2V0LmhhcygxKSAmJiAna2V5cycgaW4gc2V0ICYmIHR5cGVvZiBzZXQua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogU3RyaW5nICovXHJcbmFkZCgnZXM2LXN0cmluZycsICgpID0+IHtcclxuICAgIHJldHVybiAoW1xyXG4gICAgICAgIC8qIHN0YXRpYyBtZXRob2RzICovXHJcbiAgICAgICAgJ2Zyb21Db2RlUG9pbnQnXHJcbiAgICBdLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nW2tleV0gPT09ICdmdW5jdGlvbicpICYmXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAvKiBpbnN0YW5jZSBtZXRob2RzICovXHJcbiAgICAgICAgICAgICdjb2RlUG9pbnRBdCcsXHJcbiAgICAgICAgICAgICdub3JtYWxpemUnLFxyXG4gICAgICAgICAgICAncmVwZWF0JyxcclxuICAgICAgICAgICAgJ3N0YXJ0c1dpdGgnLFxyXG4gICAgICAgICAgICAnZW5kc1dpdGgnLFxyXG4gICAgICAgICAgICAnaW5jbHVkZXMnXHJcbiAgICAgICAgXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJykpO1xyXG59LCB0cnVlKTtcclxuYWRkKCdlczYtc3RyaW5nLXJhdycsICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIGdldENhbGxTaXRlKGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gWy4uLmNhbGxTaXRlXTtcclxuICAgICAgICByZXN1bHQucmF3ID0gY2FsbFNpdGUucmF3O1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoJ3JhdycgaW4gZ2xvYmFsLlN0cmluZykge1xyXG4gICAgICAgIGxldCBiID0gMTtcclxuICAgICAgICBsZXQgY2FsbFNpdGUgPSBnZXRDYWxsU2l0ZSBgYVxcbiR7Yn1gO1xyXG4gICAgICAgIGNhbGxTaXRlLnJhdyA9IFsnYVxcXFxuJ107XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydHNUcnVuYyA9IGdsb2JhbC5TdHJpbmcucmF3KGNhbGxTaXRlLCA0MikgPT09ICdhOlxcXFxuJztcclxuICAgICAgICByZXR1cm4gc3VwcG9ydHNUcnVuYztcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZXMyMDE3LXN0cmluZycsICgpID0+IHtcclxuICAgIHJldHVybiBbJ3BhZFN0YXJ0JywgJ3BhZEVuZCddLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nKTtcclxufSwgdHJ1ZSk7XHJcbi8qIFN5bWJvbCAqL1xyXG5hZGQoJ2VzNi1zeW1ib2wnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFN5bWJvbCgpID09PSAnc3ltYm9sJywgdHJ1ZSk7XHJcbi8qIFdlYWtNYXAgKi9cclxuYWRkKCdlczYtd2Vha21hcCcsICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsLldlYWtNYXAgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eSAqL1xyXG4gICAgICAgIGNvbnN0IGtleTEgPSB7fTtcclxuICAgICAgICBjb25zdCBrZXkyID0ge307XHJcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IGdsb2JhbC5XZWFrTWFwKFtba2V5MSwgMV1dKTtcclxuICAgICAgICBPYmplY3QuZnJlZXplKGtleTEpO1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0KGtleTEpID09PSAxICYmIG1hcC5zZXQoa2V5MiwgMikgPT09IG1hcCAmJiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogTWlzY2VsbGFuZW91cyBmZWF0dXJlcyAqL1xyXG5hZGQoJ21pY3JvdGFza3MnLCAoKSA9PiB0cnVlIHx8IGZhbHNlIHx8IHRydWUsIHRydWUpO1xyXG5hZGQoJ3Bvc3RtZXNzYWdlJywgKCkgPT4ge1xyXG4gICAgLy8gSWYgd2luZG93IGlzIHVuZGVmaW5lZCwgYW5kIHdlIGhhdmUgcG9zdE1lc3NhZ2UsIGl0IHByb2JhYmx5IG1lYW5zIHdlJ3JlIGluIGEgd2ViIHdvcmtlci4gV2ViIHdvcmtlcnMgaGF2ZVxyXG4gICAgLy8gcG9zdCBtZXNzYWdlIGJ1dCBpdCBkb2Vzbid0IHdvcmsgaG93IHdlIGV4cGVjdCBpdCB0bywgc28gaXQncyBiZXN0IGp1c3QgdG8gcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxyXG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWwud2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZ2xvYmFsLnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nO1xyXG59LCB0cnVlKTtcclxuYWRkKCdyYWYnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJywgdHJ1ZSk7XHJcbmFkZCgnc2V0aW1tZWRpYXRlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5zZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcclxuLyogRE9NIEZlYXR1cmVzICovXHJcbmFkZCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLCAoKSA9PiB7XHJcbiAgICBpZiAodHJ1ZSAmJiBCb29sZWFuKGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyKSkge1xyXG4gICAgICAgIC8vIElFMTEgaGFzIGFuIHVucmVsaWFibGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiB3aGVyZSBzZXRQcm9wZXJ0eSgpIGRvZXMgbm90XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxyXG4gICAgICAgIC8vIHJlbGlhYmx5LiBUaGUgZm9sbG93aW5nIGZlYXR1cmUgdGVzdCB3YXMgYWRhcHRlZCBmcm9tXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdDEwa28vNGFjZWI4YzcxNjgxZmRiMjc1ZTMzZWZlNWU1NzZiMTRcclxuICAgICAgICBjb25zdCBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICBjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShleGFtcGxlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XHJcbiAgICAgICAgZXhhbXBsZS5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKG9ic2VydmVyLnRha2VSZWNvcmRzKCkubGVuZ3RoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZG9tLXdlYmFuaW1hdGlvbicsICgpID0+IHRydWUgJiYgZ2xvYmFsLkFuaW1hdGlvbiAhPT0gdW5kZWZpbmVkICYmIGdsb2JhbC5LZXlmcmFtZUVmZmVjdCAhPT0gdW5kZWZpbmVkLCB0cnVlKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L2hhcy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XHJcbmltcG9ydCBoYXMgZnJvbSAnLi9oYXMnO1xyXG5mdW5jdGlvbiBleGVjdXRlVGFzayhpdGVtKSB7XHJcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZGVzdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICAgICAgaXRlbS5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpdGVtLmNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGRlc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxubGV0IGNoZWNrTWljcm9UYXNrUXVldWU7XHJcbmxldCBtaWNyb1Rhc2tzO1xyXG4vKipcclxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHF1ZXVlVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZGVzdHJ1Y3RvcjtcclxuICAgIGxldCBlbnF1ZXVlO1xyXG4gICAgLy8gU2luY2UgdGhlIElFIGltcGxlbWVudGF0aW9uIG9mIGBzZXRJbW1lZGlhdGVgIGlzIG5vdCBmbGF3bGVzcywgd2Ugd2lsbCB0ZXN0IGZvciBgcG9zdE1lc3NhZ2VgIGZpcnN0LlxyXG4gICAgaWYgKHRydWUpIHtcclxuICAgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xyXG4gICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09ICdkb2pvLXF1ZXVlLW1lc3NhZ2UnKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhxdWV1ZS5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoJ2Rvam8tcXVldWUtbWVzc2FnZScsICcqJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZhbHNlKSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbC5jbGVhclRpbWVvdXQ7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSksIDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBxdWV1ZVRhc2soY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBpZCA9IGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IgJiZcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcihpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgID8gcXVldWVUYXNrXHJcbiAgICAgICAgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVldWVUYXNrKGNhbGxiYWNrKTtcclxuICAgICAgICB9O1xyXG59KSgpO1xyXG4vLyBXaGVuIG5vIG1lY2hhbmlzbSBmb3IgcmVnaXN0ZXJpbmcgbWljcm90YXNrcyBpcyBleHBvc2VkIGJ5IHRoZSBlbnZpcm9ubWVudCwgbWljcm90YXNrcyB3aWxsXHJcbi8vIGJlIHF1ZXVlZCBhbmQgdGhlbiBleGVjdXRlZCBpbiBhIHNpbmdsZSBtYWNyb3Rhc2sgYmVmb3JlIHRoZSBvdGhlciBtYWNyb3Rhc2tzIGFyZSBleGVjdXRlZC5cclxuaWYgKCF0cnVlKSB7XHJcbiAgICBsZXQgaXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcclxuICAgIG1pY3JvVGFza3MgPSBbXTtcclxuICAgIGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFpc01pY3JvVGFza1F1ZXVlZCkge1xyXG4gICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pY3JvVGFza3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChpdGVtID0gbWljcm9UYXNrcy5zaGlmdCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhbiBhbmltYXRpb24gdGFzayB3aXRoIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBpdCBleGlzdHMsIG9yIHdpdGggYHF1ZXVlVGFza2Agb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBTaW5jZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUncyBiZWhhdmlvciBkb2VzIG5vdCBtYXRjaCB0aGF0IGV4cGVjdGVkIGZyb20gYHF1ZXVlVGFza2AsIGl0IGlzIG5vdCB1c2VkIHRoZXJlLlxyXG4gKiBIb3dldmVyLCBhdCB0aW1lcyBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIGRlbGVnYXRlIHRvIHJlcXVlc3RBbmltYXRpb25GcmFtZTsgaGVuY2UgdGhlIGZvbGxvd2luZyBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydCBjb25zdCBxdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCF0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXVlVGFzaztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xyXG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxyXG4gICAgcmV0dXJuIHRydWVcclxuICAgICAgICA/IHF1ZXVlQW5pbWF0aW9uVGFza1xyXG4gICAgICAgIDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEFueSBjYWxsYmFja3MgcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZU1pY3JvVGFza2Agd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG5leHQgbWFjcm90YXNrLiBJZiBubyBuYXRpdmVcclxuICogbWVjaGFuaXNtIGZvciBzY2hlZHVsaW5nIG1hY3JvdGFza3MgaXMgZXhwb3NlZCwgdGhlbiBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgZmlyZWQgYmVmb3JlIGFueSBtYWNyb3Rhc2tcclxuICogcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZVRhc2tgIG9yIGBxdWV1ZUFuaW1hdGlvblRhc2tgLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXHJcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHF1ZXVlTWljcm9UYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlbnF1ZXVlO1xyXG4gICAgaWYgKGZhbHNlKSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5wcm9jZXNzLm5leHRUaWNrKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0cnVlKSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRydWUpIHtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIGNvbnN0IEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IHF1ZXVlID0gW107XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcXVldWUucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3F1ZXVlU3RhdHVzJywgJzEnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgbWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHtcclxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZW5xdWV1ZShpdGVtKTtcclxuICAgICAgICByZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1xdWV1ZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgICAgVGhlIHZhbHVlIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBzZXQgdG9cbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcbiAqIEBwYXJhbSB3cml0YWJsZSAgICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSB3cml0YWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHBhcmFtIGNvbmZpZ3VyYWJsZSBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSwgZW51bWVyYWJsZSA9IGZhbHNlLCB3cml0YWJsZSA9IHRydWUsIGNvbmZpZ3VyYWJsZSA9IHRydWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IGVudW1lcmFibGUsXG4gICAgICAgIHdyaXRhYmxlOiB3cml0YWJsZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBjb25maWd1cmFibGVcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmUobmF0aXZlRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbmF0aXZlRnVuY3Rpb24uYXBwbHkodGFyZ2V0LCBhcmdzKTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvdXRpbC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmV4cG9ydCBjbGFzcyBJbmplY3RvciBleHRlbmRzIEV2ZW50ZWQge1xuICAgIGNvbnN0cnVjdG9yKHBheWxvYWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgfVxuICAgIHNldEludmFsaWRhdG9yKGludmFsaWRhdG9yKSB7XG4gICAgICAgIHRoaXMuX2ludmFsaWRhdG9yID0gaW52YWxpZGF0b3I7XG4gICAgfVxuICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BheWxvYWQ7XG4gICAgfVxuICAgIHNldChwYXlsb2FkKSB7XG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICBpZiAodGhpcy5faW52YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2ludmFsaWRhdG9yKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBJbmplY3Rvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUluamVjdG9yLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9JbmplY3Rvci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xyXG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcclxuLyoqXHJcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXHJcbiAqIExpc3RlbmluZyB0byAnUHJvamVjdG9yJyB3aWxsIG5vdGlmeSB3aGVuIHByb2plY3RvciBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcclxuICogTGlzdGVuaW5nIHRvICdXaWRnZXQnIHdpbGwgbm90aWZ5IHdoZW4gd2lkZ2V0IHJvb3QgaXMgY3JlYXRlZCBvciB1cGRhdGVkXHJcbiAqL1xyXG5leHBvcnQgdmFyIE5vZGVFdmVudFR5cGU7XHJcbihmdW5jdGlvbiAoTm9kZUV2ZW50VHlwZSkge1xyXG4gICAgTm9kZUV2ZW50VHlwZVtcIlByb2plY3RvclwiXSA9IFwiUHJvamVjdG9yXCI7XHJcbiAgICBOb2RlRXZlbnRUeXBlW1wiV2lkZ2V0XCJdID0gXCJXaWRnZXRcIjtcclxufSkoTm9kZUV2ZW50VHlwZSB8fCAoTm9kZUV2ZW50VHlwZSA9IHt9KSk7XHJcbmV4cG9ydCBjbGFzcyBOb2RlSGFuZGxlciBleHRlbmRzIEV2ZW50ZWQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlTWFwLmdldChrZXkpO1xyXG4gICAgfVxyXG4gICAgaGFzKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlTWFwLmhhcyhrZXkpO1xyXG4gICAgfVxyXG4gICAgYWRkKGVsZW1lbnQsIGtleSkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuc2V0KGtleSwgZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xyXG4gICAgfVxyXG4gICAgYWRkUm9vdCgpIHtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcclxuICAgIH1cclxuICAgIGFkZFByb2plY3RvcigpIHtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLlByb2plY3RvciB9KTtcclxuICAgIH1cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBOb2RlSGFuZGxlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Tm9kZUhhbmRsZXIubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcclxuaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XHJcbmltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xyXG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcclxuLyoqXHJcbiAqIFdpZGdldCBiYXNlIHN5bWJvbCB0eXBlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgV0lER0VUX0JBU0VfVFlQRSA9IFN5bWJvbCgnV2lkZ2V0IEJhc2UnKTtcclxuLyoqXHJcbiAqIENoZWNrcyBpcyB0aGUgaXRlbSBpcyBhIHN1YmNsYXNzIG9mIFdpZGdldEJhc2UgKG9yIGEgV2lkZ2V0QmFzZSlcclxuICpcclxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcclxuICogQHJldHVybnMgdHJ1ZS9mYWxzZSBpbmRpY2F0aW5nIGlmIHRoZSBpdGVtIGlzIGEgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxyXG4gICAgICAgIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdCkpO1xyXG59XHJcbi8qKlxyXG4gKiBUaGUgUmVnaXN0cnkgaW1wbGVtZW50YXRpb25cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50ZWQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbWl0IGxvYWRlZCBldmVudCBmb3IgcmVnaXN0cnkgbGFiZWxcclxuICAgICAqL1xyXG4gICAgZW1pdExvYWRlZEV2ZW50KHdpZGdldExhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHtcclxuICAgICAgICAgICAgdHlwZTogd2lkZ2V0TGFiZWwsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvYWRlZCcsXHJcbiAgICAgICAgICAgIGl0ZW1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRlZmluZShsYWJlbCwgaXRlbSkge1xyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHdpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICBpdGVtLnRoZW4oKHdpZGdldEN0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2lkZ2V0Q3RvcjtcclxuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3JGYWN0b3J5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW5qZWN0b3IgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW52YWxpZGF0b3IgPSBuZXcgRXZlbnRlZCgpO1xyXG4gICAgICAgIGNvbnN0IGluamVjdG9ySXRlbSA9IHtcclxuICAgICAgICAgICAgaW5qZWN0b3I6IGluamVjdG9yRmFjdG9yeSgoKSA9PiBpbnZhbGlkYXRvci5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pKSxcclxuICAgICAgICAgICAgaW52YWxpZGF0b3JcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuc2V0KGxhYmVsLCBpbmplY3Rvckl0ZW0pO1xyXG4gICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpbmplY3Rvckl0ZW0pO1xyXG4gICAgfVxyXG4gICAgZ2V0KGxhYmVsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl93aWRnZXRSZWdpc3RyeSB8fCAhdGhpcy5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fd2lkZ2V0UmVnaXN0cnkuZ2V0KGxhYmVsKTtcclxuICAgICAgICBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGl0ZW0oKTtcclxuICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHByb21pc2UpO1xyXG4gICAgICAgIHByb21pc2UudGhlbigod2lkZ2V0Q3RvcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQod2lkZ2V0Q3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHdpZGdldEN0b3IgPSB3aWRnZXRDdG9yLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0Q3RvcjtcclxuICAgICAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBnZXRJbmplY3RvcihsYWJlbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW5qZWN0b3JSZWdpc3RyeSB8fCAhdGhpcy5oYXNJbmplY3RvcihsYWJlbCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmdldChsYWJlbCk7XHJcbiAgICB9XHJcbiAgICBoYXMobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcclxuICAgIH1cclxuICAgIGhhc0luamVjdG9yKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZWdpc3RyeS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyBNYXAgfSBmcm9tICdAZG9qby9zaGltL01hcCc7XHJcbmltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xyXG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gJy4vUmVnaXN0cnknO1xyXG5leHBvcnQgY2xhc3MgUmVnaXN0cnlIYW5kbGVyIGV4dGVuZHMgRXZlbnRlZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhc2VSZWdpc3RyeSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vd24oeyBkZXN0cm95IH0pO1xyXG4gICAgfVxyXG4gICAgc2V0IGJhc2UoYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xyXG4gICAgfVxyXG4gICAgZGVmaW5lKGxhYmVsLCB3aWRnZXQpIHtcclxuICAgICAgICB0aGlzLl9yZWdpc3RyeS5kZWZpbmUobGFiZWwsIHdpZGdldCk7XHJcbiAgICB9XHJcbiAgICBkZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3IpIHtcclxuICAgICAgICB0aGlzLl9yZWdpc3RyeS5kZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG4gICAgaGFzKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmhhcyhsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXMobGFiZWwpKTtcclxuICAgIH1cclxuICAgIGhhc0luamVjdG9yKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5Lmhhc0luamVjdG9yKGxhYmVsKSB8fCBCb29sZWFuKHRoaXMuYmFzZVJlZ2lzdHJ5ICYmIHRoaXMuYmFzZVJlZ2lzdHJ5Lmhhc0luamVjdG9yKGxhYmVsKSk7XHJcbiAgICB9XHJcbiAgICBnZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXQnLCB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwKTtcclxuICAgIH1cclxuICAgIGdldEluamVjdG9yKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0SW5qZWN0b3InLCB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXApO1xyXG4gICAgfVxyXG4gICAgX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgZ2V0RnVuY3Rpb25OYW1lLCBsYWJlbE1hcCkge1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdHJpZXMgPSBnbG9iYWxQcmVjZWRlbmNlID8gW3RoaXMuYmFzZVJlZ2lzdHJ5LCB0aGlzLl9yZWdpc3RyeV0gOiBbdGhpcy5fcmVnaXN0cnksIHRoaXMuYmFzZVJlZ2lzdHJ5XTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZ2lzdHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcmVnaXN0cnkgPSByZWdpc3RyaWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRMYWJlbHMgPSBsYWJlbE1hcC5nZXQocmVnaXN0cnkpIHx8IFtdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmVnaXN0ZXJlZExhYmVscy5pbmRleE9mKGxhYmVsKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHJlZ2lzdHJ5Lm9uKGxhYmVsLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6ICdpbnZhbGlkYXRlJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3duKGhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICBsYWJlbE1hcC5zZXQocmVnaXN0cnksIFsuLi5yZWdpc3RlcmVkTGFiZWxzLCBsYWJlbF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5SGFuZGxlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVnaXN0cnlIYW5kbGVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi9kJztcbmltcG9ydCB7IGF1dG8gfSBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IFJlZ2lzdHJ5SGFuZGxlciBmcm9tICcuL1JlZ2lzdHJ5SGFuZGxlcic7XG5pbXBvcnQgTm9kZUhhbmRsZXIgZnJvbSAnLi9Ob2RlSGFuZGxlcic7XG5pbXBvcnQgeyB3aWRnZXRJbnN0YW5jZU1hcCB9IGZyb20gJy4vdmRvbSc7XG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciwgV0lER0VUX0JBU0VfVFlQRSB9IGZyb20gJy4vUmVnaXN0cnknO1xuY29uc3QgZGVjb3JhdG9yTWFwID0gbmV3IE1hcCgpO1xuY29uc3QgYm91bmRBdXRvID0gYXV0by5iaW5kKG51bGwpO1xuZXhwb3J0IGNvbnN0IG5vQmluZCA9IFN5bWJvbC5mb3IoJ2Rvam9Ob0JpbmQnKTtcbi8qKlxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXG4gKi9cbmV4cG9ydCBjbGFzcyBXaWRnZXRCYXNlIHtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlcyBpZiBpdCBpcyB0aGUgaW5pdGlhbCBzZXQgcHJvcGVydGllcyBjeWNsZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBbXTtcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIgPSBuZXcgTm9kZUhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5faGFuZGxlcyA9IFtdO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHt9O1xuICAgICAgICB0aGlzLl9ib3VuZFJlbmRlckZ1bmMgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgd2lkZ2V0SW5zdGFuY2VNYXAuc2V0KHRoaXMsIHtcbiAgICAgICAgICAgIGRpcnR5OiB0cnVlLFxuICAgICAgICAgICAgb25BdHRhY2g6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQXR0YWNoKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EZXRhY2g6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxuICAgICAgICAgICAgcmVnaXN0cnk6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb3JlUHJvcGVydGllczoge30sXG4gICAgICAgICAgICByZW5kZXJpbmc6IGZhbHNlLFxuICAgICAgICAgICAgaW5wdXRQcm9wZXJ0aWVzOiB7fVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKTtcbiAgICB9XG4gICAgbWV0YShNZXRhVHlwZSkge1xuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYWNoZWQgPSB0aGlzLl9tZXRhTWFwLmdldChNZXRhVHlwZSk7XG4gICAgICAgIGlmICghY2FjaGVkKSB7XG4gICAgICAgICAgICBjYWNoZWQgPSBuZXcgTWV0YVR5cGUoe1xuICAgICAgICAgICAgICAgIGludmFsaWRhdGU6IHRoaXMuX2JvdW5kSW52YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICBub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG4gICAgICAgICAgICAgICAgYmluZDogdGhpc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm93bihjYWNoZWQpO1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlZDtcbiAgICB9XG4gICAgb25BdHRhY2goKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgICB9XG4gICAgb25EZXRhY2goKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cbiAgICB9XG4gICAgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBnZXQgY2hhbmdlZFByb3BlcnR5S2V5cygpIHtcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzXTtcbiAgICB9XG4gICAgX19zZXRDb3JlUHJvcGVydGllc19fKGNvcmVQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvbnN0IHsgYmFzZVJlZ2lzdHJ5IH0gPSBjb3JlUHJvcGVydGllcztcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeSAhPT0gYmFzZVJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkuYmFzZSA9IGJhc2VSZWdpc3RyeTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyA9IGNvcmVQcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBfX3NldFByb3BlcnRpZXNfXyhvcmlnaW5hbFByb3BlcnRpZXMpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzID0gb3JpZ2luYWxQcm9wZXJ0aWVzO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5fcnVuQmVmb3JlUHJvcGVydGllcyhvcmlnaW5hbFByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xuICAgICAgICBjb25zdCBjaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgaWYgKHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID09PSBmYWxzZSB8fCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxQcm9wZXJ0aWVzID0gWy4uLnByb3BlcnR5TmFtZXMsIC4uLk9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpXTtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWRQcm9wZXJ0aWVzID0gW107XG4gICAgICAgICAgICBjb25zdCBkaWZmUHJvcGVydHlSZXN1bHRzID0ge307XG4gICAgICAgICAgICBsZXQgcnVuUmVhY3Rpb25zID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBhbGxQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja2VkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaGVja2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQcm9wZXJ0eSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQcm9wZXJ0eSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBydW5SZWFjdGlvbnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWZmRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoYGRpZmZQcm9wZXJ0eToke3Byb3BlcnR5TmFtZX1gKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkaWZmRnVuY3Rpb25zW2ldKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYm91bmRBdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVuUmVhY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKHByb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpLmZvckVhY2goKGFyZ3MsIHJlYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0aW9uLmNhbGwodGhpcywgYXJncy5wcmV2aW91c1Byb3BlcnRpZXMsIGFyZ3MubmV3UHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBkaWZmUHJvcGVydHlSZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgIH1cbiAgICBfX3NldENoaWxkcmVuX18oY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgfHwgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9fcmVuZGVyX18oKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcbiAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHJlbmRlciA9IHRoaXMuX3J1bkJlZm9yZVJlbmRlcnMoKTtcbiAgICAgICAgbGV0IGROb2RlID0gcmVuZGVyKCk7XG4gICAgICAgIGROb2RlID0gdGhpcy5ydW5BZnRlclJlbmRlcnMoZE5vZGUpO1xuICAgICAgICB0aGlzLl9ub2RlSGFuZGxlci5jbGVhcigpO1xuICAgICAgICByZXR1cm4gZE5vZGU7XG4gICAgfVxuICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHYoJ2RpdicsIHt9LCB0aGlzLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gYWRkIGRlY29yYXRvcnMgdG8gV2lkZ2V0QmFzZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBkZWNvcmF0b3JcbiAgICAgKi9cbiAgICBhZGREZWNvcmF0b3IoZGVjb3JhdG9yS2V5LCB2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgICAgICAgbGV0IGRlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JNYXAuZ2V0KHRoaXMuY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgaWYgKCFkZWNvcmF0b3JMaXN0KSB7XG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JNYXAuc2V0KHRoaXMuY29uc3RydWN0b3IsIGRlY29yYXRvckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvckxpc3QuZ2V0KGRlY29yYXRvcktleSk7XG4gICAgICAgICAgICBpZiAoIXNwZWNpZmljRGVjb3JhdG9yTGlzdCkge1xuICAgICAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGRlY29yYXRvckxpc3Quc2V0KGRlY29yYXRvcktleSwgc3BlY2lmaWNEZWNvcmF0b3JMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdC5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSB0aGlzLmdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpO1xuICAgICAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgWy4uLmRlY29yYXRvcnMsIC4uLnZhbHVlXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gYnVpbGQgdGhlIGxpc3Qgb2YgZGVjb3JhdG9ycyBmcm9tIHRoZSBnbG9iYWwgZGVjb3JhdG9yIG1hcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgIFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuICAgICAqIEByZXR1cm4gQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXkpIHtcbiAgICAgICAgY29uc3QgYWxsRGVjb3JhdG9ycyA9IFtdO1xuICAgICAgICBsZXQgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICB3aGlsZSAoY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlTWFwID0gZGVjb3JhdG9yTWFwLmdldChjb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VNYXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNvcmF0b3JzID0gaW5zdGFuY2VNYXAuZ2V0KGRlY29yYXRvcktleSk7XG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsRGVjb3JhdG9ycy51bnNoaWZ0KC4uLmRlY29yYXRvcnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gcmV0cmlldmUgZGVjb3JhdG9yIHZhbHVlc1xuICAgICAqXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG4gICAgICovXG4gICAgZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSkge1xuICAgICAgICBsZXQgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2RlY29yYXRvckNhY2hlLmdldChkZWNvcmF0b3JLZXkpO1xuICAgICAgICBpZiAoYWxsRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcbiAgICAgICAgfVxuICAgICAgICBhbGxEZWNvcmF0b3JzID0gdGhpcy5fYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSk7XG4gICAgICAgIHRoaXMuX2RlY29yYXRvckNhY2hlLnNldChkZWNvcmF0b3JLZXksIGFsbERlY29yYXRvcnMpO1xuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcbiAgICB9XG4gICAgX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhuZXdQcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKSB7XG4gICAgICAgIGNvbnN0IHJlYWN0aW9uRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicpO1xuICAgICAgICByZXR1cm4gcmVhY3Rpb25GdW5jdGlvbnMucmVkdWNlKChyZWFjdGlvblByb3BlcnR5TWFwLCB7IHJlYWN0aW9uLCBwcm9wZXJ0eU5hbWUgfSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlYWN0aW9uQXJndW1lbnRzID0gcmVhY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocmVhY3Rpb24pO1xuICAgICAgICAgICAgaWYgKHJlYWN0aW9uQXJndW1lbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNQcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgbmV3UHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLnByZXZpb3VzUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMubmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gbmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVhY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocmVhY3Rpb24sIHJlYWN0aW9uQXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiByZWFjdGlvblByb3BlcnR5TWFwO1xuICAgICAgICB9LCBuZXcgTWFwKCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXG4gICAgICovXG4gICAgX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnR5LCBiaW5kKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgIXByb3BlcnR5W25vQmluZF0gJiYgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiaW5kSW5mbyA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XG4gICAgICAgICAgICBsZXQgeyBib3VuZEZ1bmMsIHNjb3BlIH0gPSBiaW5kSW5mbztcbiAgICAgICAgICAgIGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xuICAgICAgICAgICAgICAgIGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuc2V0KHByb3BlcnR5LCB7IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYm91bmRGdW5jO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICB9XG4gICAgZ2V0IHJlZ2lzdHJ5KCkge1xuICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG4gICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeSk7XG4gICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeTtcbiAgICB9XG4gICAgX3J1bkJlZm9yZVByb3BlcnRpZXMocHJvcGVydGllcykge1xuICAgICAgICBjb25zdCBiZWZvcmVQcm9wZXJ0aWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcbiAgICAgICAgaWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwodGhpcywgcHJvcGVydGllcykpO1xuICAgICAgICAgICAgfSwgT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXG4gICAgICovXG4gICAgX3J1bkJlZm9yZVJlbmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZSgocmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHJlbmRlciwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlZFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlZFJlbmRlcjtcbiAgICAgICAgICAgIH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xuICAgICAqXG4gICAgICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcbiAgICAgKi9cbiAgICBydW5BZnRlclJlbmRlcnMoZE5vZGUpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XG4gICAgICAgIGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVycy5yZWR1Y2UoKGROb2RlLCBhZnRlclJlbmRlckZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBkTm9kZSk7XG4gICAgICAgICAgICB9LCBkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0YS5hZnRlclJlbmRlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGROb2RlO1xuICAgIH1cbiAgICBfcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcbiAgICAgICAgaWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFmdGVyQ29uc3RydWN0b3JzLmZvckVhY2goKGFmdGVyQ29uc3RydWN0b3IpID0+IGFmdGVyQ29uc3RydWN0b3IuY2FsbCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3duKGhhbmRsZSkge1xuICAgICAgICB0aGlzLl9oYW5kbGVzLnB1c2goaGFuZGxlKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2hhbmRsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcbiAgICAgICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBzdGF0aWMgaWRlbnRpZmllclxuICovXG5XaWRnZXRCYXNlLl90eXBlID0gV0lER0VUX0JBU0VfVFlQRTtcbmV4cG9ydCBkZWZhdWx0IFdpZGdldEJhc2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XaWRnZXRCYXNlLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJsZXQgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xubGV0IGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xuZnVuY3Rpb24gZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudCkge1xuICAgIGlmICgnV2Via2l0VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xuICAgICAgICBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcbiAgICB9XG4gICAgZWxzZSBpZiAoJ3RyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUgfHwgJ01velRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd0cmFuc2l0aW9uZW5kJztcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ2FuaW1hdGlvbmVuZCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdGlhbGl6ZShlbGVtZW50KSB7XG4gICAgaWYgKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9PT0gJycpIHtcbiAgICAgICAgZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudCk7XG4gICAgfVxufVxuZnVuY3Rpb24gcnVuQW5kQ2xlYW5VcChlbGVtZW50LCBzdGFydEFuaW1hdGlvbiwgZmluaXNoQW5pbWF0aW9uKSB7XG4gICAgaW5pdGlhbGl6ZShlbGVtZW50KTtcbiAgICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgICBsZXQgdHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFmaW5pc2hlZCkge1xuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG4gICAgICAgICAgICBmaW5pc2hBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc3RhcnRBbmltYXRpb24oKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG59XG5mdW5jdGlvbiBleGl0KG5vZGUsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24sIHJlbW92ZU5vZGUpIHtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbkFjdGl2ZSB8fCBgJHtleGl0QW5pbWF0aW9ufS1hY3RpdmVgO1xuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgKCkgPT4ge1xuICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoZXhpdEFuaW1hdGlvbik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICB9LCAoKSA9PiB7XG4gICAgICAgIHJlbW92ZU5vZGUoKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVudGVyKG5vZGUsIHByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKSB7XG4gICAgY29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uQWN0aXZlIHx8IGAke2VudGVyQW5pbWF0aW9ufS1hY3RpdmVgO1xuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgKCkgPT4ge1xuICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoZW50ZXJBbmltYXRpb24pO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgfSwgKCkgPT4ge1xuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoZW50ZXJBbmltYXRpb24pO1xuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGVudGVyLFxuICAgIGV4aXRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3NUcmFuc2l0aW9ucy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBXTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBXTm9kZS4nKTtcbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFZOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFZOb2RlLicpO1xuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgVk5vZGUgdHlwZSBjcmVhdGVkIHVzaW5nIGRvbSgpXG4gKi9cbmV4cG9ydCBjb25zdCBET01WTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZSBjcmVhdGVkIHVzaW5nIGV4aXN0aW5nIGRvbS4nKTtcbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFdOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dOb2RlKGNoaWxkKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBXTk9ERSk7XG59XG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBWTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWTm9kZShjaGlsZCkge1xuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgKGNoaWxkLnR5cGUgPT09IFZOT0RFIHx8IGNoaWxkLnR5cGUgPT09IERPTVZOT0RFKSk7XG59XG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBWTm9kZWAgY3JlYXRlZCB3aXRoIGBkb20oKWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEb21WTm9kZShjaGlsZCkge1xuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gRE9NVk5PREUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudE5vZGUodmFsdWUpIHtcbiAgICByZXR1cm4gISF2YWx1ZS50YWdOYW1lO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGROb2Rlcywgb3B0aW9uc09yTW9kaWZpZXIsIHByZWRpY2F0ZSkge1xuICAgIGxldCBzaGFsbG93ID0gZmFsc2U7XG4gICAgbGV0IG1vZGlmaWVyO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc09yTW9kaWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbW9kaWZpZXIgPSBvcHRpb25zT3JNb2RpZmllcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXIubW9kaWZpZXI7XG4gICAgICAgIHByZWRpY2F0ZSA9IG9wdGlvbnNPck1vZGlmaWVyLnByZWRpY2F0ZTtcbiAgICAgICAgc2hhbGxvdyA9IG9wdGlvbnNPck1vZGlmaWVyLnNoYWxsb3cgfHwgZmFsc2U7XG4gICAgfVxuICAgIGxldCBub2RlcyA9IEFycmF5LmlzQXJyYXkoZE5vZGVzKSA/IFsuLi5kTm9kZXNdIDogW2ROb2Rlc107XG4gICAgZnVuY3Rpb24gYnJlYWtlcigpIHtcbiAgICAgICAgbm9kZXMgPSBbXTtcbiAgICB9XG4gICAgd2hpbGUgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXMuc2hpZnQoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghc2hhbGxvdyAmJiAoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbLi4ubm9kZXMsIC4uLm5vZGUuY2hpbGRyZW5dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgbW9kaWZpZXIobm9kZSwgYnJlYWtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGROb2Rlcztcbn1cbi8qKlxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIGEgd2lkZ2V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdyh3aWRnZXRDb25zdHJ1Y3RvciwgcHJvcGVydGllcywgY2hpbGRyZW4gPSBbXSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvcixcbiAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgdHlwZTogV05PREVcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHYodGFnLCBwcm9wZXJ0aWVzT3JDaGlsZHJlbiA9IHt9LCBjaGlsZHJlbiA9IHVuZGVmaW5lZCkge1xuICAgIGxldCBwcm9wZXJ0aWVzID0gcHJvcGVydGllc09yQ2hpbGRyZW47XG4gICAgbGV0IGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnRpZXNPckNoaWxkcmVuKSkge1xuICAgICAgICBjaGlsZHJlbiA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuICAgICAgICBwcm9wZXJ0aWVzID0ge307XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFnLFxuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayxcbiAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIHR5cGU6IFZOT0RFXG4gICAgfTtcbn1cbi8qKlxuICogQ3JlYXRlIGEgVk5vZGUgZm9yIGFuIGV4aXN0aW5nIERPTSBOb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZG9tKHsgbm9kZSwgYXR0cnMgPSB7fSwgcHJvcHMgPSB7fSwgb24gPSB7fSwgZGlmZlR5cGUgPSAnbm9uZScgfSwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0YWc6IGlzRWxlbWVudE5vZGUobm9kZSkgPyBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA6ICcnLFxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wcyxcbiAgICAgICAgYXR0cmlidXRlczogYXR0cnMsXG4gICAgICAgIGV2ZW50czogb24sXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICB0eXBlOiBET01WTk9ERSxcbiAgICAgICAgZG9tTm9kZTogbm9kZSxcbiAgICAgICAgdGV4dDogaXNFbGVtZW50Tm9kZShub2RlKSA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YSxcbiAgICAgICAgZGlmZlR5cGVcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2QubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZCkge1xuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgYWZ0ZXJSZW5kZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hZnRlclJlbmRlci5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hZnRlclJlbmRlci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgYmVmb3JlUHJvcGVydGllcyB9IGZyb20gJy4vYmVmb3JlUHJvcGVydGllcyc7XG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzUmVuZGVyKCkge1xuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcbiAgICAgICAgYmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfSkodGFyZ2V0KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGFsd2F5c1JlbmRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFsd2F5c1JlbmRlci5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hbHdheXNSZW5kZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlUHJvcGVydGllcyhtZXRob2QpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgYmVmb3JlUHJvcGVydGllcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJlZm9yZVByb3BlcnRpZXMubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyBDdXN0b21FbGVtZW50Q2hpbGRUeXBlIH0gZnJvbSAnLi4vcmVnaXN0ZXJDdXN0b21FbGVtZW50JztcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuLi9SZWdpc3RyeSc7XG4vKipcbiAqIFRoaXMgRGVjb3JhdG9yIGlzIHByb3ZpZGVkIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgdGhlIGJlaGF2aW9yIG9mIGEgY3VzdG9tIGVsZW1lbnQsIGFuZFxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21FbGVtZW50KHsgdGFnLCBwcm9wZXJ0aWVzID0gW10sIGF0dHJpYnV0ZXMgPSBbXSwgZXZlbnRzID0gW10sIGNoaWxkVHlwZSA9IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTywgcmVnaXN0cnlGYWN0b3J5ID0gKCkgPT4gbmV3IFJlZ2lzdHJ5KCkgfSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvciA9IHtcbiAgICAgICAgICAgIHRhZ05hbWU6IHRhZyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICAgICAgZXZlbnRzLFxuICAgICAgICAgICAgY2hpbGRUeXBlLFxuICAgICAgICAgICAgcmVnaXN0cnlGYWN0b3J5XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBkZWZhdWx0IGN1c3RvbUVsZW1lbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jdXN0b21FbGVtZW50Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZSwgZGlmZkZ1bmN0aW9uLCByZWFjdGlvbkZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCwgZGlmZkZ1bmN0aW9uLmJpbmQobnVsbCkpO1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5JywgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicsIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgcmVhY3Rpb246IHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IHJlYWN0aW9uRnVuY3Rpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCBkaWZmUHJvcGVydHk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaWZmUHJvcGVydHkubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiLyoqXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZGVmYXVsdCBoYW5kbGVEZWNvcmF0b3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYW5kbGVEZWNvcmF0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuL2JlZm9yZVByb3BlcnRpZXMnO1xuLyoqXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXG4gKi9cbmNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXG4gKiBhbmQgY3VycmVudCBwcm9wZXJ0aWVzIHdpdGggdGhlIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoeyBuYW1lLCBnZXRQcm9wZXJ0aWVzIH0pIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluamVjdG9ySXRlbSA9IHRoaXMucmVnaXN0cnkuZ2V0SW5qZWN0b3IobmFtZSk7XG4gICAgICAgICAgICBpZiAoaW5qZWN0b3JJdGVtKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpbmplY3RvciwgaW52YWxpZGF0b3IgfSA9IGluamVjdG9ySXRlbTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzID0gcmVnaXN0ZXJlZEluamVjdG9yc01hcC5nZXQodGhpcykgfHwgW107XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuc2V0KHRoaXMsIHJlZ2lzdGVyZWRJbmplY3RvcnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5pbmRleE9mKGluamVjdG9ySXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3duKGludmFsaWRhdG9yLm9uKCdpbnZhbGlkYXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9ySXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yKCksIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSh0YXJnZXQpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgaW5qZWN0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5qZWN0Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmZ1bmN0aW9uIGlzT2JqZWN0T3JBcnJheSh2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkOiB0cnVlLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNoYW5nZWQ6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNoYW5nZWQ6IHByZXZpb3VzUHJvcGVydHkgIT09IG5ld1Byb3BlcnR5LFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHZhbGlkT2xkUHJvcGVydHkgPSBwcmV2aW91c1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShwcmV2aW91c1Byb3BlcnR5KTtcbiAgICBjb25zdCB2YWxpZE5ld1Byb3BlcnR5ID0gbmV3UHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KTtcbiAgICBpZiAoIXZhbGlkT2xkUHJvcGVydHkgfHwgIXZhbGlkTmV3UHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoYW5nZWQ6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcHJldmlvdXNLZXlzID0gT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0eSk7XG4gICAgY29uc3QgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld1Byb3BlcnR5KTtcbiAgICBpZiAocHJldmlvdXNLZXlzLmxlbmd0aCAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKChrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXdQcm9wZXJ0eVtrZXldICE9PSBwcmV2aW91c1Byb3BlcnR5W2tleV07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKG5ld1Byb3BlcnR5Ll90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XG4gICAgICAgIHJlc3VsdCA9IHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpZmYubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kaWZmLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IGNzc1RyYW5zaXRpb25zIGZyb20gJy4uL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMnO1xuaW1wb3J0IHsgYWZ0ZXJSZW5kZXIgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXInO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vLi4vZCc7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLy4uL3Zkb20nO1xuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBhdHRhY2ggc3RhdGUgb2YgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgdmFyIFByb2plY3RvckF0dGFjaFN0YXRlO1xuKGZ1bmN0aW9uIChQcm9qZWN0b3JBdHRhY2hTdGF0ZSkge1xuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiQXR0YWNoZWRcIl0gPSAxXSA9IFwiQXR0YWNoZWRcIjtcbiAgICBQcm9qZWN0b3JBdHRhY2hTdGF0ZVtQcm9qZWN0b3JBdHRhY2hTdGF0ZVtcIkRldGFjaGVkXCJdID0gMl0gPSBcIkRldGFjaGVkXCI7XG59KShQcm9qZWN0b3JBdHRhY2hTdGF0ZSB8fCAoUHJvamVjdG9yQXR0YWNoU3RhdGUgPSB7fSkpO1xuLyoqXG4gKiBBdHRhY2ggdHlwZSBmb3IgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgdmFyIEF0dGFjaFR5cGU7XG4oZnVuY3Rpb24gKEF0dGFjaFR5cGUpIHtcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJBcHBlbmRcIl0gPSAxXSA9IFwiQXBwZW5kXCI7XG4gICAgQXR0YWNoVHlwZVtBdHRhY2hUeXBlW1wiTWVyZ2VcIl0gPSAyXSA9IFwiTWVyZ2VcIjtcbn0pKEF0dGFjaFR5cGUgfHwgKEF0dGFjaFR5cGUgPSB7fSkpO1xuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3Rvck1peGluKEJhc2UpIHtcbiAgICBjbGFzcyBQcm9qZWN0b3IgZXh0ZW5kcyBCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgICAgICB0aGlzLl9yb290ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXBwZW5kKHJvb3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5BcHBlbmQsXG4gICAgICAgICAgICAgICAgcm9vdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2Uocm9vdCkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLk1lcmdlLFxuICAgICAgICAgICAgICAgIHJvb3RcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHNldCByb290KHJvb3QpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjaGFuZ2Ugcm9vdCBlbGVtZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcm9vdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuICAgICAgICB9XG4gICAgICAgIGdldCBhc3luYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hc3luYztcbiAgICAgICAgfVxuICAgICAgICBzZXQgYXN5bmMoYXN5bmMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjaGFuZ2UgYXN5bmMgbW9kZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBhc3luYztcbiAgICAgICAgfVxuICAgICAgICBzYW5kYm94KGRvYyA9IGRvY3VtZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY3JlYXRlIHNhbmRib3gnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1Jvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgICAgICAvKiBmcmVlIHVwIHRoZSBkb2N1bWVudCBmcmFnbWVudCBmb3IgR0MgKi9cbiAgICAgICAgICAgIHRoaXMub3duKHtcbiAgICAgICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSBwcmV2aW91c1Jvb3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2goe1xuICAgICAgICAgICAgICAgIC8qIERvY3VtZW50RnJhZ21lbnQgaXMgbm90IGFzc2lnbmFibGUgdG8gRWxlbWVudCwgYnV0IHByb3ZpZGVzIGV2ZXJ5dGhpbmcgbmVlZGVkIHRvIHdvcmsgKi9cbiAgICAgICAgICAgICAgICByb290OiBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRDaGlsZHJlbihjaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIHNldFByb3BlcnRpZXMocHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICBfX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyA9IGFzc2lnbih7fSwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICBzdXBlci5fX3NldENvcmVQcm9wZXJ0aWVzX18oeyBiaW5kOiB0aGlzLCBiYXNlUmVnaXN0cnk6IHByb3BlcnRpZXMucmVnaXN0cnkgfSk7XG4gICAgICAgICAgICBzdXBlci5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICB0b0h0bWwoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSAhPT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQgfHwgIXRoaXMuX3Byb2plY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBpcyBub3QgYXR0YWNoZWQsIGNhbm5vdCByZXR1cm4gYW4gSFRNTCBzdHJpbmcgb2YgcHJvamVjdGlvbi4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9qZWN0aW9uLmRvbU5vZGUuY2hpbGROb2Rlc1swXS5vdXRlckhUTUw7XG4gICAgICAgIH1cbiAgICAgICAgYWZ0ZXJSZW5kZXIocmVzdWx0KSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJyB8fCByZXN1bHQgPT09IG51bGwgfHwgcmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gdignc3BhbicsIHt9LCBbcmVzdWx0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIF9hdHRhY2goeyB0eXBlLCByb290IH0pIHtcbiAgICAgICAgICAgIGlmIChyb290KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9hdHRhY2hIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkO1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlID0ge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub3duKGhhbmRsZSk7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hIYW5kbGUgPSBoYW5kbGU7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zLCB7IHN5bmM6ICF0aGlzLl9hc3luYyB9KTtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5BcHBlbmQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSBkb20uYXBwZW5kKHRoaXMucm9vdCwgdGhpcywgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuTWVyZ2U6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSBkb20ubWVyZ2UodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBhZnRlclJlbmRlcigpLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxuICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XG4gICAgcmV0dXJuIFByb2plY3Rvcjtcbn1cbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rvck1peGluO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UHJvamVjdG9yLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9pbmplY3QnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBkaWZmUHJvcGVydHkgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5JztcbmltcG9ydCB7IHNoYWxsb3cgfSBmcm9tICcuLy4uL2RpZmYnO1xuY29uc3QgVEhFTUVfS0VZID0gJyBfa2V5JztcbmV4cG9ydCBjb25zdCBJTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XG4vKipcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodGhlbWUpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycsIHRoZW1lKTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBjbGFzc2VzIFRoZSBiYXNlQ2xhc3NlcyBvYmplY3RcbiAqIEByZXF1aXJlc1xuICovXG5mdW5jdGlvbiBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZSgoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhiYXNlQ2xhc3MpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDbGFzc05hbWVzO1xuICAgIH0sIHt9KTtcbn1cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBpcyBnaXZlbiBhIHRoZW1lIGFuZCBhbiBvcHRpb25hbCByZWdpc3RyeSwgdGhlIHRoZW1lXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxuICpcbiAqIEBwYXJhbSB0aGVtZSB0aGUgdGhlbWUgdG8gc2V0XG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXG4gKiB0byB0aGUgZ2xvYmFsIHJlZ2lzdHJ5XG4gKlxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lLCB0aGVtZVJlZ2lzdHJ5KSB7XG4gICAgY29uc3QgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGVtZSk7XG4gICAgdGhlbWVSZWdpc3RyeS5kZWZpbmVJbmplY3RvcihJTkpFQ1RFRF9USEVNRV9LRVksIChpbnZhbGlkYXRvcikgPT4ge1xuICAgICAgICB0aGVtZUluamVjdG9yLnNldEludmFsaWRhdG9yKGludmFsaWRhdG9yKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHRoZW1lSW5qZWN0b3IuZ2V0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGNsYXNzIGRlY29yYXRlZCB3aXRoIHdpdGggVGhlbWVkIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluKEJhc2UpIHtcbiAgICBsZXQgVGhlbWVkID0gY2xhc3MgVGhlbWVkIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMgPSBbXTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuX3RoZW1lID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhlbWUoY2xhc3Nlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLm1hcCgoY2xhc3NOYW1lKSA9PiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cbiAgICAgICAgICovXG4gICAgICAgIG9uUHJvcGVydGllc0NoYW5nZWQoKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xuICAgICAgICAgICAgbGV0IHJlc3VsdENsYXNzTmFtZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENsYXNzIG5hbWU6ICcke2NsYXNzTmFtZX0nIG5vdCBmb3VuZCBpbiB0aGVtZWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIF9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGhlbWUgPSB7fSB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX2EgPSBUSEVNRV9LRVksIGtleSA9IGJhc2VUaGVtZVtfYV0sIGNsYXNzZXMgPSB0c2xpYl8xLl9fcmVzdChiYXNlVGhlbWUsIFt0eXBlb2YgX2EgPT09IFwic3ltYm9sXCIgPyBfYSA6IF9hICsgXCJcIl0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoKGJhc2VUaGVtZSwgdGhlbWVLZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYmFzZVRoZW1lLCB0aGVtZVt0aGVtZUtleV0pO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGRpZmZQcm9wZXJ0eSgndGhlbWUnLCBzaGFsbG93KSxcbiAgICAgICAgZGlmZlByb3BlcnR5KCdleHRyYUNsYXNzZXMnLCBzaGFsbG93KSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcbiAgICBdLCBUaGVtZWQucHJvdG90eXBlLCBcIm9uUHJvcGVydGllc0NoYW5nZWRcIiwgbnVsbCk7XG4gICAgVGhlbWVkID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW5qZWN0KHtcbiAgICAgICAgICAgIG5hbWU6IElOSkVDVEVEX1RIRU1FX0tFWSxcbiAgICAgICAgICAgIGdldFByb3BlcnRpZXM6ICh0aGVtZSwgcHJvcGVydGllcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydGllcy50aGVtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB0aGVtZSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgXSwgVGhlbWVkKTtcbiAgICByZXR1cm4gVGhlbWVkO1xufVxuZXhwb3J0IGRlZmF1bHQgVGhlbWVkTWl4aW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UaGVtZWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBXaWRnZXRCYXNlLCBub0JpbmQgfSBmcm9tICcuL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgUHJvamVjdG9yTWl4aW4gfSBmcm9tICcuL21peGlucy9Qcm9qZWN0b3InO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJ0Bkb2pvL3NoaW0vYXJyYXknO1xuaW1wb3J0IHsgdywgZG9tIH0gZnJvbSAnLi9kJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IHsgcmVnaXN0ZXJUaGVtZUluamVjdG9yIH0gZnJvbSAnLi9taXhpbnMvVGhlbWVkJztcbmltcG9ydCB7IGFsd2F5c1JlbmRlciB9IGZyb20gJy4vZGVjb3JhdG9ycy9hbHdheXNSZW5kZXInO1xuZXhwb3J0IHZhciBDdXN0b21FbGVtZW50Q2hpbGRUeXBlO1xuKGZ1bmN0aW9uIChDdXN0b21FbGVtZW50Q2hpbGRUeXBlKSB7XG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIkRPSk9cIl0gPSBcIkRPSk9cIjtcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiTk9ERVwiXSA9IFwiTk9ERVwiO1xuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJURVhUXCJdID0gXCJURVhUXCI7XG59KShDdXN0b21FbGVtZW50Q2hpbGRUeXBlIHx8IChDdXN0b21FbGVtZW50Q2hpbGRUeXBlID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBEb21Ub1dpZGdldFdyYXBwZXIoZG9tTm9kZSkge1xuICAgIGxldCBEb21Ub1dpZGdldFdyYXBwZXIgPSBjbGFzcyBEb21Ub1dpZGdldFdyYXBwZXIgZXh0ZW5kcyBXaWRnZXRCYXNlIHtcbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcGVydGllcykucmVkdWNlKChwcm9wcywga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoJ29uJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gYF9fJHtrZXl9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIHJldHVybiBkb20oeyBub2RlOiBkb21Ob2RlLCBwcm9wczogcHJvcGVydGllcywgZGlmZlR5cGU6ICdkb20nIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgZG9tTm9kZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21Ob2RlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEb21Ub1dpZGdldFdyYXBwZXIgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBhbHdheXNSZW5kZXIoKVxuICAgIF0sIERvbVRvV2lkZ2V0V3JhcHBlcik7XG4gICAgcmV0dXJuIERvbVRvV2lkZ2V0V3JhcHBlcjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpIHtcbiAgICBjb25zdCB7IGF0dHJpYnV0ZXMsIGNoaWxkVHlwZSwgcmVnaXN0cnlGYWN0b3J5IH0gPSBkZXNjcmlwdG9yO1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hcCA9IHt9O1xuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCgocHJvcGVydHlOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYXR0cmlidXRlTWFwW2F0dHJpYnV0ZU5hbWVdID0gcHJvcGVydHlOYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50UHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbml0aWFsaXNlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRvbVByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHsgYXR0cmlidXRlcywgcHJvcGVydGllcywgZXZlbnRzIH0gPSBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlcykpO1xuICAgICAgICAgICAgWy4uLmF0dHJpYnV0ZXMsIC4uLnByb3BlcnRpZXNdLmZvckVhY2goKHByb3BlcnR5TmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfXycpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRQcm9wZXJ0eU5hbWUgIT09IHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5fZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB0aGlzLl9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb21Qcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5fZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgc2V0OiAodmFsdWUpID0+IHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goKHByb3BlcnR5TmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eb24vLCAnX19vbicpO1xuICAgICAgICAgICAgICAgIGRvbVByb3BlcnRpZXNbZmlsdGVyZWRQcm9wZXJ0eU5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHRoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgc2V0OiAodmFsdWUpID0+IHRoaXMuX3NldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSB0aGlzLl9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRDYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGFyZ3NcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIGRvbVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuVEVYVCA/IHRoaXMuY2hpbGROb2RlcyA6IHRoaXMuY2hpbGRyZW47XG4gICAgICAgICAgICBmcm9tKGNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZE5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgKCkgPT4gdGhpcy5fcmVuZGVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKGNoaWxkTm9kZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChkb20oeyBub2RlOiBjaGlsZE5vZGUsIGRpZmZUeXBlOiAnZG9tJyB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtY29ubmVjdGVkJywgKGUpID0+IHRoaXMuX2NoaWxkQ29ubmVjdGVkKGUpKTtcbiAgICAgICAgICAgIGNvbnN0IHdpZGdldFByb3BlcnRpZXMgPSB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyQ2hpbGRyZW4gPSAoKSA9PiB0aGlzLl9fY2hpbGRyZW5fXygpO1xuICAgICAgICAgICAgY29uc3QgV3JhcHBlciA9IGNsYXNzIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdyhXaWRnZXRDb25zdHJ1Y3Rvciwgd2lkZ2V0UHJvcGVydGllcywgcmVuZGVyQ2hpbGRyZW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gcmVnaXN0cnlGYWN0b3J5KCk7XG4gICAgICAgICAgICBjb25zdCB0aGVtZUNvbnRleHQgPSByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhpcy5fZ2V0VGhlbWUoKSwgcmVnaXN0cnkpO1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tdGhlbWUtc2V0JywgKCkgPT4gdGhlbWVDb250ZXh0LnNldCh0aGlzLl9nZXRUaGVtZSgpKSk7XG4gICAgICAgICAgICBjb25zdCBQcm9qZWN0b3IgPSBQcm9qZWN0b3JNaXhpbihXcmFwcGVyKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5zZXRQcm9wZXJ0aWVzKHsgcmVnaXN0cnkgfSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3IuYXBwZW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1jb25uZWN0ZWQnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBfZ2V0VGhlbWUoKSB7XG4gICAgICAgICAgICBpZiAoZ2xvYmFsICYmIGdsb2JhbC5kb2pvY2UgJiYgZ2xvYmFsLmRvam9jZS50aGVtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWwuZG9qb2NlLnRoZW1lc1tnbG9iYWwuZG9qb2NlLnRoZW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfY2hpbGRDb25uZWN0ZWQoZSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGUuZGV0YWlsO1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMuX2NoaWxkcmVuLnNvbWUoKGNoaWxkKSA9PiBjaGlsZC5kb21Ob2RlID09PSBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgKCkgPT4gdGhpcy5fcmVuZGVyKCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKERvbVRvV2lkZ2V0V3JhcHBlcihub2RlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3Rvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1yZW5kZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX19wcm9wZXJ0aWVzX18oKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICBfX2NoaWxkcmVuX18oKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKChDaGlsZCkgPT4gQ2hpbGQuZG9tTm9kZS5pc1dpZGdldCkubWFwKChDaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRvbU5vZGUgfSA9IENoaWxkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdyhDaGlsZCwgT2JqZWN0LmFzc2lnbih7fSwgZG9tTm9kZS5fX3Byb3BlcnRpZXNfXygpKSwgWy4uLmRvbU5vZGUuX19jaGlsZHJlbl9fKCldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVNYXBbbmFtZV07XG4gICAgICAgICAgICB0aGlzLl9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBfc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIF9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbbm9CaW5kXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBwcm9wZXJ0eU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZU1hcCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGlzV2lkZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKFdpZGdldENvbnN0cnVjdG9yKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvciA9IFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBXaWRnZXRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcjtcbiAgICBpZiAoIWRlc2NyaXB0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGRlc2NyaXB0b3IgZm9yIEN1c3RvbSBFbGVtZW50LCBoYXZlIHlvdSBhZGRlZCB0aGUgQGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yIHRvIHlvdXIgV2lkZ2V0PycpO1xuICAgIH1cbiAgICBnbG9iYWwuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGRlc2NyaXB0b3IudGFnTmFtZSwgY3JlYXRlKGRlc2NyaXB0b3IsIFdpZGdldENvbnN0cnVjdG9yKSk7XG59XG5leHBvcnQgZGVmYXVsdCByZWdpc3Rlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZ2lzdGVyQ3VzdG9tRWxlbWVudC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xyXG5pbXBvcnQgeyBmcm9tIGFzIGFycmF5RnJvbSB9IGZyb20gJ0Bkb2pvL3NoaW0vYXJyYXknO1xyXG5pbXBvcnQgeyBpc1dOb2RlLCBpc1ZOb2RlLCBpc0RvbVZOb2RlLCBWTk9ERSwgV05PREUgfSBmcm9tICcuL2QnO1xyXG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciB9IGZyb20gJy4vUmVnaXN0cnknO1xyXG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xyXG5jb25zdCBOQU1FU1BBQ0VfVzMgPSAnaHR0cDovL3d3dy53My5vcmcvJztcclxuY29uc3QgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XHJcbmNvbnN0IE5BTUVTUEFDRV9YTElOSyA9IE5BTUVTUEFDRV9XMyArICcxOTk5L3hsaW5rJztcclxuY29uc3QgZW1wdHlBcnJheSA9IFtdO1xyXG5leHBvcnQgY29uc3Qgd2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcCgpO1xyXG5jb25zdCBpbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwKCk7XHJcbmNvbnN0IHByb2plY3RvclN0YXRlTWFwID0gbmV3IFdlYWtNYXAoKTtcclxuZnVuY3Rpb24gc2FtZShkbm9kZTEsIGRub2RlMikge1xyXG4gICAgaWYgKGlzVk5vZGUoZG5vZGUxKSAmJiBpc1ZOb2RlKGRub2RlMikpIHtcclxuICAgICAgICBpZiAoaXNEb21WTm9kZShkbm9kZTEpIHx8IGlzRG9tVk5vZGUoZG5vZGUyKSkge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUxLmRvbU5vZGUgIT09IGRub2RlMi5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzV05vZGUoZG5vZGUxKSAmJiBpc1dOb2RlKGRub2RlMikpIHtcclxuICAgICAgICBpZiAoZG5vZGUxLmluc3RhbmNlID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIGRub2RlMi53aWRnZXRDb25zdHJ1Y3RvciA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLndpZGdldENvbnN0cnVjdG9yICE9PSBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5jb25zdCBtaXNzaW5nVHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xyXG59O1xyXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0b3JPcHRpb25zLCBwcm9qZWN0b3JJbnN0YW5jZSkge1xyXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc3R5bGVBcHBseWVyOiBmdW5jdGlvbiAoZG9tTm9kZSwgc3R5bGVOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLnN0eWxlW3N0eWxlTmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zaXRpb25zOiB7XHJcbiAgICAgICAgICAgIGVudGVyOiBtaXNzaW5nVHJhbnNpdGlvbixcclxuICAgICAgICAgICAgZXhpdDogbWlzc2luZ1RyYW5zaXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlcHRoOiAwLFxyXG4gICAgICAgIG1lcmdlOiBmYWxzZSxcclxuICAgICAgICBzeW5jOiBmYWxzZSxcclxuICAgICAgICBwcm9qZWN0b3JJbnN0YW5jZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgcHJvamVjdG9yT3B0aW9ucyk7XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudE5hbWUsIGN1cnJlbnRWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMsIGJpbmQsIHByZXZpb3VzVmFsdWUpIHtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdG9yU3RhdGUubm9kZU1hcC5nZXQoZG9tTm9kZSkgfHwgbmV3IFdlYWtNYXAoKTtcclxuICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgY29uc3QgcHJldmlvdXNFdmVudCA9IGV2ZW50TWFwLmdldChwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICBkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcmV2aW91c0V2ZW50KTtcclxuICAgIH1cclxuICAgIGxldCBjYWxsYmFjayA9IGN1cnJlbnRWYWx1ZS5iaW5kKGJpbmQpO1xyXG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2lucHV0Jykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBjdXJyZW50VmFsdWUuY2FsbCh0aGlzLCBldnQpO1xyXG4gICAgICAgICAgICBldnQudGFyZ2V0WydvbmlucHV0LXZhbHVlJ10gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIH0uYmluZChiaW5kKTtcclxuICAgIH1cclxuICAgIGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICAgIGV2ZW50TWFwLnNldChjdXJyZW50VmFsdWUsIGNhbGxiYWNrKTtcclxuICAgIHByb2plY3RvclN0YXRlLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcclxufVxyXG5mdW5jdGlvbiBhZGRDbGFzc2VzKGRvbU5vZGUsIGNsYXNzZXMpIHtcclxuICAgIGlmIChjbGFzc2VzKSB7XHJcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIGNsYXNzZXMpIHtcclxuICAgIGlmIChjbGFzc2VzKSB7XHJcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cywgY3VycmVudCkge1xyXG4gICAgY29uc3QgeyBkaWZmVHlwZSwgcHJvcGVydGllcywgYXR0cmlidXRlcyB9ID0gY3VycmVudDtcclxuICAgIGlmICghZGlmZlR5cGUgfHwgZGlmZlR5cGUgPT09ICd2ZG9tJykge1xyXG4gICAgICAgIHJldHVybiB7IHByb3BlcnRpZXM6IHByZXZpb3VzLnByb3BlcnRpZXMsIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkaWZmVHlwZSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcHJvcGVydGllczoge30sIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMgPyB7fSA6IHVuZGVmaW5lZCwgZXZlbnRzOiBwcmV2aW91cy5ldmVudHMgfTtcclxuICAgIH1cclxuICAgIGxldCBuZXdQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgIHByb3BlcnRpZXM6IHt9XHJcbiAgICB9O1xyXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSB7fTtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmV2ZW50cyA9IHByZXZpb3VzLmV2ZW50cztcclxuICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXNbcHJvcE5hbWVdID0gZG9tTm9kZVtwcm9wTmFtZV07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaCgoYXR0ck5hbWUpID0+IHtcclxuICAgICAgICAgICAgbmV3UHJvcGVydGllcy5hdHRyaWJ1dGVzW2F0dHJOYW1lXSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3UHJvcGVydGllcztcclxuICAgIH1cclxuICAgIG5ld1Byb3BlcnRpZXMucHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLnJlZHVjZSgocHJvcHMsIHByb3BlcnR5KSA9PiB7XHJcbiAgICAgICAgcHJvcHNbcHJvcGVydHldID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUocHJvcGVydHkpIHx8IGRvbU5vZGVbcHJvcGVydHldO1xyXG4gICAgICAgIHJldHVybiBwcm9wcztcclxuICAgIH0sIHt9KTtcclxuICAgIHJldHVybiBuZXdQcm9wZXJ0aWVzO1xyXG59XHJcbmZ1bmN0aW9uIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSAmJiAhcHJldmlvdXNWYWx1ZTtcclxuICAgIH1cclxuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuZm9jdXMoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBvbmx5RXZlbnRzID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdG9yU3RhdGUubm9kZU1hcC5nZXQoZG9tTm9kZSk7XHJcbiAgICBpZiAoZXZlbnRNYXApIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnRpZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzRXZlbnQgPSBwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgfHwgb25seUV2ZW50cztcclxuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gb25seUV2ZW50cyA/IHByb3BOYW1lIDogcHJvcE5hbWUuc3Vic3RyKDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNFdmVudCAmJiAhcHJvcGVydGllc1twcm9wTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIGF0dHJOYW1lID09PSAnaHJlZicpIHtcclxuICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgoYXR0ck5hbWUgPT09ICdyb2xlJyAmJiBhdHRyVmFsdWUgPT09ICcnKSB8fCBhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGRvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZXMoZG9tTm9kZSwgcHJldmlvdXNBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgYXR0ck5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XHJcbiAgICBjb25zdCBhdHRyQ291bnQgPSBhdHRyTmFtZXMubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyQ291bnQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gYXR0ck5hbWVzW2ldO1xyXG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzQXR0clZhbHVlID0gcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJOYW1lXTtcclxuICAgICAgICBpZiAoYXR0clZhbHVlICE9PSBwcmV2aW91c0F0dHJWYWx1ZSkge1xyXG4gICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcyA9IHRydWUpIHtcclxuICAgIGxldCBwcm9wZXJ0aWVzVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgY29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICBjb25zdCBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xyXG4gICAgaWYgKHByb3BOYW1lcy5pbmRleE9mKCdjbGFzc2VzJykgPT09IC0xICYmIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgJiYgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XHJcbiAgICAgICAgbGV0IHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSBwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzZXMnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSA/IHByb3BWYWx1ZSA6IFtwcm9wVmFsdWVdO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc2VzICYmIHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BWYWx1ZSB8fCBwcm9wVmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NsYXNzZXMgPSBbLi4uY3VycmVudENsYXNzZXNdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzQ2xhc3NOYW1lID0gcHJldmlvdXNDbGFzc2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzSW5kZXggPSBuZXdDbGFzc2VzLmluZGV4T2YocHJldmlvdXNDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDbGFzc2VzLnNwbGljZShjbGFzc0luZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjdXJyZW50Q2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcclxuICAgICAgICAgICAgZm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRTdHlsZVZhbHVlID0gcHJldmlvdXNWYWx1ZSAmJiBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgbmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21WYWx1ZSA9IGRvbU5vZGVbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbVZhbHVlICE9PSBwcm9wVmFsdWUgJiZcclxuICAgICAgICAgICAgICAgICAgICAoZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZG9tVmFsdWUgPT09IGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ10gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDAgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlRXZlbnQoZG9tTm9kZSwgcHJvcE5hbWUuc3Vic3RyKDIpLCBwcm9wVmFsdWUsIHByb2plY3Rpb25PcHRpb25zLCBwcm9wZXJ0aWVzLmJpbmQsIHByZXZpb3VzVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3Njcm9sbExlZnQnIHx8IHByb3BOYW1lID09PSAnc2Nyb2xsVG9wJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21Ob2RlW3Byb3BOYW1lXSAhPT0gcHJvcFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRJbmRleE9mQ2hpbGQoY2hpbGRyZW4sIHNhbWVBcywgc3RhcnQpIHtcclxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHNhbWUoY2hpbGRyZW5baV0sIHNhbWVBcykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0b1BhcmVudFZOb2RlKGRvbU5vZGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRvbU5vZGUsXHJcbiAgICAgICAgdHlwZTogVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIHRleHQ6IGAke2RhdGF9YCxcclxuICAgICAgICBkb21Ob2RlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdHlwZTogVk5PREVcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2UsXHJcbiAgICAgICAgcmVuZGVyZWQ6IFtdLFxyXG4gICAgICAgIGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXHJcbiAgICAgICAgY2hpbGRyZW46IGluc3RhbmNlLmNoaWxkcmVuLFxyXG4gICAgICAgIHdpZGdldENvbnN0cnVjdG9yOiBpbnN0YW5jZS5jb25zdHJ1Y3RvcixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IFdOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkcmVuLCBpbnN0YW5jZSkge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZW1wdHlBcnJheTtcclxuICAgIH1cclxuICAgIGNoaWxkcmVuID0gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IFtjaGlsZHJlbl07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5baV0gPSB0b1RleHRWTm9kZShjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3BlcnRpZXMuYmluZCA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkLmNvcmVQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VSZWdpc3RyeTogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbn1cclxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlLCB0cmFuc2l0aW9ucykge1xyXG4gICAgaWYgKGlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcclxuICAgICAgICBjb25zdCBlbnRlckFuaW1hdGlvbiA9IGRub2RlLnByb3BlcnRpZXMuZW50ZXJBbmltYXRpb247XHJcbiAgICAgICAgaWYgKGVudGVyQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW50ZXJBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGVudGVyQW5pbWF0aW9uKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMuZW50ZXIoZG5vZGUuZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vZGVUb1JlbW92ZShkbm9kZSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAoaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICBjb25zdCByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XHJcbiAgICAgICAgaWYgKGRub2RlLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChkbm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZU1hcC5kZWxldGUoZG5vZGUuaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcmVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZShyZW5kZXJlZFtpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gZG5vZGUucHJvcGVydGllcztcclxuICAgICAgICBpZiAoZG5vZGUuY2hpbGRyZW4gJiYgZG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUoZG5vZGUuY2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcclxuICAgICAgICBpZiAocHJvcGVydGllcyAmJiBleGl0QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhpdEFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZXhpdEFuaW1hdGlvbihkb21Ob2RlLCByZW1vdmVEb21Ob2RlLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmV4aXQoZG5vZGUuZG9tTm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlRG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgIGRub2RlLmRvbU5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tEaXN0aW5ndWlzaGFibGUoY2hpbGROb2RlcywgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgY29uc3QgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xyXG4gICAgaWYgKGlzVk5vZGUoY2hpbGROb2RlKSAmJiAhY2hpbGROb2RlLnRhZykge1xyXG4gICAgICAgIHJldHVybjsgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcclxuICAgIH1cclxuICAgIGNvbnN0IHsga2V5IH0gPSBjaGlsZE5vZGUucHJvcGVydGllcztcclxuICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4VG9DaGVjaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGVJZGVudGlmaWVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudE5hbWUgPSBwYXJlbnRJbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNXTm9kZShjaGlsZE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLndpZGdldENvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUudGFnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEEgd2lkZ2V0ICgke3BhcmVudE5hbWV9KSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50ICgke25vZGVJZGVudGlmaWVyfSkgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZSwgb2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIG9sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcclxuICAgIG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XHJcbiAgICBjb25zdCBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcclxuICAgIGNvbnN0IG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgY29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucztcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIGxldCBvbGRJbmRleCA9IDA7XHJcbiAgICBsZXQgbmV3SW5kZXggPSAwO1xyXG4gICAgbGV0IGk7XHJcbiAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcclxuICAgICAgICBpZiAoaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkLmluc2VydGVkID0gaXNWTm9kZShvbGRDaGlsZCkgJiYgb2xkQ2hpbGQuaW5zZXJ0ZWQ7XHJcbiAgICAgICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcclxuICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICAgICAgbmV3SW5kZXgrKztcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGFkZENoaWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0QmVmb3JlRG9tTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBvbGRJbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0QmVmb3JlQ2hpbGRyZW4gPSBbY2hpbGRdO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGluc2VydEJlZm9yZUNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydEJlZm9yZSA9IGluc2VydEJlZm9yZUNoaWxkcmVuLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzV05vZGUoaW5zZXJ0QmVmb3JlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlLnJlbmRlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmVDaGlsZHJlbi5wdXNoKC4uLmluc2VydEJlZm9yZS5yZW5kZXJlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlRG9tTm9kZSA9IGluc2VydEJlZm9yZS5kb21Ob2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZUNoaWxkcmVuLmxlbmd0aCA9PT0gMCAmJiBvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZUNoaWxkcmVuLnB1c2gob2xkQ2hpbGRyZW5bbmV4dEluZGV4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmVEb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghb2xkQ2hpbGQgfHwgZmluZE9sZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICBhZGRDaGlsZCgpO1xyXG4gICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlQ2hpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4VG9DaGVjayA9IG9sZEluZGV4O1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc1dOb2RlKG9sZENoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGluc3RhbmNlTWFwLmdldChvbGRDaGlsZC5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZENoaWxkID0gaXRlbS5kbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUob2xkQ2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBmaW5kTmV3SW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG5ld0NoaWxkcmVuLCBvbGRDaGlsZCwgbmV3SW5kZXggKyAxKTtcclxuICAgICAgICBpZiAoZmluZE5ld0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgICAgICBvbGRJbmRleCsrO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkQ2hpbGQoKTtcclxuICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgbmV3SW5kZXgrKztcclxuICAgIH1cclxuICAgIGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xyXG4gICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZFRvUmVtb3ZlID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChpc1dOb2RlKGNoaWxkVG9SZW1vdmUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gaW5zdGFuY2VNYXAuZ2V0KGNoaWxkVG9SZW1vdmUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZFRvUmVtb3ZlID0gaXRlbS5kbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUoY2hpbGRUb1JlbW92ZSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIGNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGluc2VydEJlZm9yZSA9IHVuZGVmaW5lZCwgY2hpbGROb2Rlcykge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgY2hpbGROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY2hpbGROb2RlcyA9IGFycmF5RnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlLmNoaWxkTm9kZXMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucztcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChpc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgY2hpbGROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvbUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlQWRkZWQoY2hpbGQsIHRyYW5zaXRpb25zKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGFkZENoaWxkcmVuKGRub2RlLCBkbm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCB1bmRlZmluZWQpO1xyXG4gICAgaWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiBkbm9kZS5pbnNlcnRlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG5vZGUuYXR0cmlidXRlcyAmJiBkbm9kZS5ldmVudHMpIHtcclxuICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHt9LCBkbm9kZS5hdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCB7fSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIGZhbHNlKTtcclxuICAgICAgICByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCB7fSwgZG5vZGUuZXZlbnRzLCBwcm9qZWN0aW9uT3B0aW9ucywgdHJ1ZSk7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzID0gZG5vZGUuZXZlbnRzO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnQsIGV2ZW50c1tldmVudF0sIHByb2plY3Rpb25PcHRpb25zLCBkbm9kZS5wcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCB7fSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XHJcbiAgICB9XHJcbiAgICBkbm9kZS5pbnNlcnRlZCA9IHRydWU7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpIHtcclxuICAgIGxldCBkb21Ob2RlO1xyXG4gICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgaWYgKGlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgbGV0IHsgd2lkZ2V0Q29uc3RydWN0b3IgfSA9IGRub2RlO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudEluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgaWYgKCFpc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcih3aWRnZXRDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBhcmVudEluc3RhbmNlRGF0YS5yZWdpc3RyeSgpLmdldCh3aWRnZXRDb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3IgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB3aWRnZXRDb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgIGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCB9KTtcclxuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRSZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJlZFJlbmRlcmVkO1xyXG4gICAgICAgICAgICBhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGUsIHBhcmVudFZOb2RlIH0pO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGRSb290KCk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHByb2plY3RvclN0YXRlLm1lcmdlICYmIHByb2plY3RvclN0YXRlLm1lcmdlRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50O1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZG9jID0gcGFyZW50Vk5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50O1xyXG4gICAgICAgIGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkICYmIHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Vk5vZGUuZG9tTm9kZSA9PT0gZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKG5ld0RvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSAmJiBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkbm9kZS50YWcgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlIHx8IGRvYy5jcmVhdGVFbGVtZW50KGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZG9tTm9kZS5wYXJlbnROb2RlICE9PSBwYXJlbnRWTm9kZS5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZURvbShwcmV2aW91cywgZG5vZGUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIGlmIChpc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5zdGFuY2UgfSA9IHByZXZpb3VzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlOiBub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzUmVuZGVyZWQgPSBub2RlID8gbm9kZS5yZW5kZXJlZCA6IHByZXZpb3VzLnJlbmRlcmVkO1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5kaXJ0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IHByZXZpb3VzUmVuZGVyZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkb21Ob2RlID0gKGRub2RlLmRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlKTtcclxuICAgICAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVDaGlsZHJlbihkbm9kZSwgcHJldmlvdXMuY2hpbGRyZW4sIGNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQcm9wZXJ0aWVzID0gYnVpbGRQcmV2aW91c1Byb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXMsIGRub2RlKTtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5hdHRyaWJ1dGVzLCBkbm9kZS5hdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgZmFsc2UpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuZXZlbnRzLCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50cyA9IGRub2RlLmV2ZW50cztcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudCwgZXZlbnRzW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCwgcHJldmlvdXNQcm9wZXJ0aWVzLmV2ZW50c1tldmVudF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwZGF0ZWQgJiYgZG5vZGUucHJvcGVydGllcyAmJiBkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbihkb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgLy8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xyXG4gICAgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzID0gdm5vZGUucHJvcGVydGllcztcclxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB2bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayghIXZub2RlLmluc2VydGVkKTtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHZub2RlLnByb3BlcnRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wZXJ0aWVzLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXModm5vZGUuZG9tTm9kZSwgdm5vZGUucHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHZub2RlLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocHJvamVjdG9yU3RhdGUucmVuZGVyU2NoZWR1bGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJTY2hlZHVsZWQgPSBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHByb2plY3RvclN0YXRlLnJlbmRlclNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0IHJlbmRlclF1ZXVlID0gcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWU7XHJcbiAgICBjb25zdCByZW5kZXJzID0gWy4uLnJlbmRlclF1ZXVlXTtcclxuICAgIHByb2plY3RvclN0YXRlLnJlbmRlclF1ZXVlID0gW107XHJcbiAgICByZW5kZXJzLnNvcnQoKGEsIGIpID0+IGEuZGVwdGggLSBiLmRlcHRoKTtcclxuICAgIGNvbnN0IHByZXZpb3VzbHlSZW5kZXJlZCA9IFtdO1xyXG4gICAgd2hpbGUgKHJlbmRlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZSB9ID0gcmVuZGVycy5zaGlmdCgpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZU1hcC5oYXMoaW5zdGFuY2UpICYmIHByZXZpb3VzbHlSZW5kZXJlZC5pbmRleE9mKGluc3RhbmNlKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcHJldmlvdXNseVJlbmRlcmVkLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBjb25zdCB7IHBhcmVudFZOb2RlLCBkbm9kZSB9ID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgdXBkYXRlRG9tKGRub2RlLCB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSksIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxufVxyXG5leHBvcnQgY29uc3QgZG9tID0ge1xyXG4gICAgYXBwZW5kOiBmdW5jdGlvbiAocGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zID0ge30pIHtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcclxuICAgICAgICAgICAgZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxyXG4gICAgICAgICAgICBub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxyXG4gICAgICAgICAgICByZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVuZGVyUXVldWU6IFtdLFxyXG4gICAgICAgICAgICBtZXJnZTogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIG1lcmdlRWxlbWVudDogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZU1hcC5zZXQoaW5zdGFuY2UsIHByb2plY3RvclN0YXRlKTtcclxuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFZOb2RlID0gdG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpO1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSk7XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZSB9KTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBmaW5hbFByb2plY3Rvck9wdGlvbnMuZGVwdGggfSk7XHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGVEb20obm9kZSwgbm9kZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEub25BdHRhY2goKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZG9tTm9kZTogZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIChpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgbWVyZ2U6IGZ1bmN0aW9uIChlbGVtZW50LCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlID0gdHJ1ZTtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb24gPSB0aGlzLmFwcGVuZChlbGVtZW50LnBhcmVudE5vZGUsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLm1lcmdlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHByb2plY3Rpb247XHJcbiAgICB9XHJcbn07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZkb20ubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3Zkb20ubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciB3aWRnZXRGYWN0b3J5ID0gcmVxdWlyZShcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIik7XG5cbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnQgPSByZXF1aXJlKCdAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xuXG52YXIgZGVmYXVsdEV4cG9ydCA9IHdpZGdldEZhY3RvcnkuZGVmYXVsdDtcbmRlZmF1bHRFeHBvcnQgJiYgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGRlZmF1bHRFeHBvcnQpO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlcj93aWRnZXRGYWN0b3J5PXNyYy9tZW51LWl0ZW0vTWVudUl0ZW0hLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXIvaW5kZXguanM/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS1pdGVtL01lbnVJdGVtIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XG59IGNhdGNoKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcblx0XHRnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgeyBjdXN0b21FbGVtZW50IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50JztcbmltcG9ydCB7IFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHRoZW1lLCBUaGVtZWRNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuXG5pbXBvcnQgKiBhcyBjc3MgZnJvbSAnLi9tZW51SXRlbS5tLmNzcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVudUl0ZW1Qcm9wZXJ0aWVzIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcyB7XG5cdHRpdGxlOiBzdHJpbmc7XG5cdHNlbGVjdGVkPzogYm9vbGVhbjtcblx0ZGF0YT86IGFueTtcblx0b25TZWxlY3RlZD86IChkYXRhOiBhbnkpID0+IHZvaWQ7XG59XG5cbkBjdXN0b21FbGVtZW50PE1lbnVJdGVtUHJvcGVydGllcz4oe1xuXHR0YWc6ICdkZW1vLW1lbnUtaXRlbScsXG5cdGF0dHJpYnV0ZXM6IFsndGl0bGUnLCAnc2VsZWN0ZWQnXSxcblx0ZXZlbnRzOiBbJ29uU2VsZWN0ZWQnXSxcblx0cHJvcGVydGllczogWydkYXRhJywgJ3NlbGVjdGVkJ11cbn0pXG5AdGhlbWUoY3NzKVxuZXhwb3J0IGNsYXNzIE1lbnVJdGVtIGV4dGVuZHMgVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk8TWVudUl0ZW1Qcm9wZXJ0aWVzPiB7XG5cdHByaXZhdGUgX29uQ2xpY2soKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uU2VsZWN0ZWQgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uU2VsZWN0ZWQodGhpcy5wcm9wZXJ0aWVzLmRhdGEpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpIHtcblx0XHRjb25zdCB7IHRpdGxlLCBzZWxlY3RlZCB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuXG5cdFx0cmV0dXJuIHYoJ2xpJywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5yb290KSB9LCBbXG5cdFx0XHR2KFxuXHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKFtjc3MuaXRlbSwgc2VsZWN0ZWQgPyBjc3Muc2VsZWN0ZWQgOiBudWxsXSksXG5cdFx0XHRcdFx0b25jbGljazogdGhpcy5fb25DbGlja1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRbdGl0bGVdXG5cdFx0XHQpXG5cdFx0XSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVudUl0ZW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX21lbnUtaXRlbSEuL3NyYy9tZW51LWl0ZW0vTWVudUl0ZW0udHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwidGVzdC1hcHAvbWVudUl0ZW1cIixcInJvb3RcIjpcIm1lbnVJdGVtLW1fX3Jvb3RfX3NVbVVpXCIsXCJpdGVtXCI6XCJtZW51SXRlbS1tX19pdGVtX18yTWs2UlwiLFwic2VsZWN0ZWRcIjpcIm1lbnVJdGVtLW1fX3NlbGVjdGVkX18xLWYzSVwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSJdLCJzb3VyY2VSb290IjoiIn0=