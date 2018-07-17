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

/***/ "./node_modules/@dojo/framework/core/Destroyable.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__("./node_modules/@dojo/framework/core/lang.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shim_Promise__ = __webpack_require__("./node_modules/@dojo/framework/shim/Promise.mjs");


/**
 * No operation function to replace own once instance is destoryed
 */
function noop() {
    return __WEBPACK_IMPORTED_MODULE_1__shim_Promise__["a" /* default */].resolve(false);
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
        return new __WEBPACK_IMPORTED_MODULE_1__shim_Promise__["a" /* default */]((resolve) => {
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

/***/ "./node_modules/@dojo/framework/core/Evented.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isGlobMatch */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_Map__ = __webpack_require__("./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Destroyable__ = __webpack_require__("./node_modules/@dojo/framework/core/Destroyable.mjs");


/**
 * Map of computed regular expressions, keyed by string
 */
const regexMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
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
        this.listenersMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
    }
    emit(event) {
        this.listenersMap.forEach((methods, type) => {
            if (isGlobMatch(type, event.type)) {
                [...methods].forEach((method) => {
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

/***/ "./node_modules/@dojo/framework/core/lang.mjs":
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_object__ = __webpack_require__("./node_modules/@dojo/framework/shim/object.mjs");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__shim_object__["a"]; });


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
    return __WEBPACK_IMPORTED_MODULE_0__shim_object__["a" /* assign */].apply(null, args);
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

/***/ "./node_modules/@dojo/framework/has/has.mjs":
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

/***/ "./node_modules/@dojo/framework/shim/Map.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__iterator__ = __webpack_require__("./node_modules/@dojo/framework/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__object__ = __webpack_require__("./node_modules/@dojo/framework/shim/object.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");





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

/***/ "./node_modules/@dojo/framework/shim/Promise.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ShimPromise */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_queue__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/queue.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");




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

/***/ "./node_modules/@dojo/framework/shim/Symbol.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Symbol */
/* unused harmony export isSymbol */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_util__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/util.mjs");



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

/***/ "./node_modules/@dojo/framework/shim/WeakMap.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export WeakMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterator__ = __webpack_require__("./node_modules/@dojo/framework/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");




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

/***/ "./node_modules/@dojo/framework/shim/array.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return from; });
/* unused harmony export of */
/* unused harmony export copyWithin */
/* unused harmony export fill */
/* unused harmony export find */
/* unused harmony export findIndex */
/* unused harmony export includes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterator__ = __webpack_require__("./node_modules/@dojo/framework/shim/iterator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__number__ = __webpack_require__("./node_modules/@dojo/framework/shim/number.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__support_util__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/util.mjs");





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

/***/ "./node_modules/@dojo/framework/shim/global.mjs":
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

/***/ "./node_modules/@dojo/framework/shim/iterator.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isIterable */
/* unused harmony export isArrayLike */
/* unused harmony export get */
/* unused harmony export forOf */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string__ = __webpack_require__("./node_modules/@dojo/framework/shim/string.mjs");


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

/***/ "./node_modules/@dojo/framework/shim/number.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isNaN */
/* unused harmony export isFinite */
/* unused harmony export isInteger */
/* unused harmony export isSafeInteger */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");

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

/***/ "./node_modules/@dojo/framework/shim/object.mjs":
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");



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

/***/ "./node_modules/@dojo/framework/shim/string.mjs":
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__support_has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__support_util__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/util.mjs");



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

/***/ "./node_modules/@dojo/framework/shim/support/has.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__has_has__ = __webpack_require__("./node_modules/@dojo/framework/has/has.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* unused harmony reexport namespace */


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__has_has__["b" /* default */]);

/* ECMAScript 6 and 7 Features */
/* Array */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-array', () => {
    return (['from', 'of'].every((key) => key in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array) &&
        ['findIndex', 'find', 'copyWithin'].every((key) => key in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype));
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-array-fill', () => {
    if ('fill' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype) {
        /* Some versions of Safari do not properly implement this */
        return [1].fill(9, Number.POSITIVE_INFINITY)[0] === 1;
    }
    return false;
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es7-array', () => 'includes' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Array.prototype, true);
/* Map */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-map', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-math', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-math-imul', () => {
    if ('imul' in __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Math) {
        /* Some versions of Safari on ios do not properly implement this */
        return Math.imul(0xffffffff, 5) === -5;
    }
    return false;
}, true);
/* Object */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-object', () => {
    return true &&
        ['assign', 'is', 'getOwnPropertySymbols', 'setPrototypeOf'].every((name) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Object[name] === 'function');
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es2017-object', () => {
    return ['values', 'entries', 'getOwnPropertyDescriptors'].every((name) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Object[name] === 'function');
}, true);
/* Observable */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es-observable', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Observable !== 'undefined', true);
/* Promise */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-promise', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Promise !== 'undefined' && true, true);
/* Set */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-set', () => {
    if (typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Set === 'function') {
        /* IE11 and older versions of Safari are missing critical ES6 Set functionality */
        const set = new __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Set([1]);
        return set.has(1) && 'keys' in set && typeof set.keys === 'function' && true;
    }
    return false;
}, true);
/* String */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-string', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-string-raw', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es2017-string', () => {
    return ['padStart', 'padEnd'].every((key) => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].String.prototype[key] === 'function');
}, true);
/* Symbol */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-symbol', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Symbol !== 'undefined' && typeof Symbol() === 'symbol', true);
/* WeakMap */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('es6-weakmap', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('microtasks', () => true || false || true, true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('postmessage', () => {
    // If window is undefined, and we have postMessage, it probably means we're in a web worker. Web workers have
    // post message but it doesn't work how we expect it to, so it's best just to pretend it doesn't exist.
    return typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].window !== 'undefined' && typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].postMessage === 'function';
}, true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('raf', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].requestAnimationFrame === 'function', true);
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('setimmediate', () => typeof __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].setImmediate !== 'undefined', true);
/* DOM Features */
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('dom-mutationobserver', () => {
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
Object(__WEBPACK_IMPORTED_MODULE_0__has_has__["a" /* add */])('dom-webanimation', () => true && __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].Animation !== undefined && __WEBPACK_IMPORTED_MODULE_1__global__["a" /* default */].KeyframeEffect !== undefined, true);
//# sourceMappingURL=has.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/framework/shim/support/queue.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export queueMicroTask */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__has__ = __webpack_require__("./node_modules/@dojo/framework/shim/support/has.mjs");


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

/***/ "./node_modules/@dojo/framework/shim/support/util.mjs":
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

/***/ "./node_modules/@dojo/framework/widget-core/Injector.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Evented__ = __webpack_require__("./node_modules/@dojo/framework/core/Evented.mjs");

class Injector extends __WEBPACK_IMPORTED_MODULE_0__core_Evented__["a" /* Evented */] {
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

/***/ "./node_modules/@dojo/framework/widget-core/NodeHandler.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export NodeEventType */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Evented__ = __webpack_require__("./node_modules/@dojo/framework/core/Evented.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shim_Map__ = __webpack_require__("./node_modules/@dojo/framework/shim/Map.mjs");


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
class NodeHandler extends __WEBPACK_IMPORTED_MODULE_0__core_Evented__["a" /* Evented */] {
    constructor() {
        super(...arguments);
        this._nodeMap = new __WEBPACK_IMPORTED_MODULE_1__shim_Map__["b" /* default */]();
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

/***/ "./node_modules/@dojo/framework/widget-core/Registry.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = isWidgetBaseConstructor;
/* unused harmony export isWidgetConstructorDefaultExport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_Promise__ = __webpack_require__("./node_modules/@dojo/framework/shim/Promise.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shim_Map__ = __webpack_require__("./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shim_Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Evented__ = __webpack_require__("./node_modules/@dojo/framework/core/Evented.mjs");




/**
 * Widget base symbol type
 */
const WIDGET_BASE_TYPE = Object(__WEBPACK_IMPORTED_MODULE_2__shim_Symbol__["a" /* default */])('Widget Base');
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
class Registry extends __WEBPACK_IMPORTED_MODULE_3__core_Evented__["a" /* Evented */] {
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
            this._widgetRegistry = new __WEBPACK_IMPORTED_MODULE_1__shim_Map__["b" /* default */]();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error(`widget has already been registered for '${label.toString()}'`);
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof __WEBPACK_IMPORTED_MODULE_0__shim_Promise__["a" /* default */]) {
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
            this._injectorRegistry = new __WEBPACK_IMPORTED_MODULE_1__shim_Map__["b" /* default */]();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error(`injector has already been registered for '${label.toString()}'`);
        }
        const invalidator = new __WEBPACK_IMPORTED_MODULE_3__core_Evented__["a" /* Evented */]();
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
        if (item instanceof __WEBPACK_IMPORTED_MODULE_0__shim_Promise__["a" /* default */]) {
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

/***/ "./node_modules/@dojo/framework/widget-core/RegistryHandler.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_Map__ = __webpack_require__("./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Evented__ = __webpack_require__("./node_modules/@dojo/framework/core/Evented.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Registry__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Registry.mjs");



class RegistryHandler extends __WEBPACK_IMPORTED_MODULE_1__core_Evented__["a" /* Evented */] {
    constructor() {
        super();
        this._registry = new __WEBPACK_IMPORTED_MODULE_2__Registry__["a" /* Registry */]();
        this._registryWidgetLabelMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["a" /* Map */]();
        this._registryInjectorLabelMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["a" /* Map */]();
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

/***/ "./node_modules/@dojo/framework/widget-core/WidgetBase.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_Map__ = __webpack_require__("./node_modules/@dojo/framework/shim/Map.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/framework/shim/WeakMap.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shim_Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__d__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__diff__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/diff.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RegistryHandler__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/RegistryHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__NodeHandler__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/NodeHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vdom__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/vdom.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Registry__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Registry.mjs");









const decoratorMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
const boundAuto = __WEBPACK_IMPORTED_MODULE_4__diff__["a" /* auto */].bind(null);
const noBind = __WEBPACK_IMPORTED_MODULE_2__shim_Symbol__["a" /* default */].for('dojoNoBind');
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
        this._decoratorCache = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
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
            this._metaMap = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
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
                const reactionFunctions = this.getDecorator('diffReaction');
                const executedReactions = [];
                reactionFunctions.forEach(({ reaction, propertyName }) => {
                    const propertyChanged = changedPropertyKeys.indexOf(propertyName) !== -1;
                    const reactionRun = executedReactions.indexOf(reaction) !== -1;
                    if (propertyChanged && !reactionRun) {
                        reaction.call(this, this._properties, diffPropertyResults);
                        executedReactions.push(reaction);
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
                decoratorList = new __WEBPACK_IMPORTED_MODULE_0__shim_Map__["b" /* default */]();
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
    /**
     * Binds unbound property functions to the specified `bind` property
     *
     * @param properties properties to check for functions
     */
    _bindFunctionProperty(property, bind) {
        if (typeof property === 'function' && !property[noBind] && Object(__WEBPACK_IMPORTED_MODULE_8__Registry__["d" /* isWidgetBaseConstructor */])(property) === false) {
            if (this._bindFunctionPropertyMap === undefined) {
                this._bindFunctionPropertyMap = new __WEBPACK_IMPORTED_MODULE_1__shim_WeakMap__["a" /* default */]();
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
            dNode = afterRenders.reduce((dNode, afterRenderFunction) => {
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

/***/ "./node_modules/@dojo/framework/widget-core/animations/cssTransitions.mjs":
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

/***/ "./node_modules/@dojo/framework/widget-core/d.mjs":
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_Symbol__ = __webpack_require__("./node_modules/@dojo/framework/shim/Symbol.mjs");

/**
 * The symbol identifier for a WNode type
 */
const WNODE = Object(__WEBPACK_IMPORTED_MODULE_0__shim_Symbol__["a" /* default */])('Identifier for a WNode.');
/* harmony export (immutable) */ __webpack_exports__["b"] = WNODE;

/**
 * The symbol identifier for a VNode type
 */
const VNODE = Object(__WEBPACK_IMPORTED_MODULE_0__shim_Symbol__["a" /* default */])('Identifier for a VNode.');
/* harmony export (immutable) */ __webpack_exports__["a"] = VNODE;

/**
 * The symbol identifier for a VNode type created using dom()
 */
const DOMVNODE = Object(__WEBPACK_IMPORTED_MODULE_0__shim_Symbol__["a" /* default */])('Identifier for a VNode created using existing dom.');
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

/***/ "./node_modules/@dojo/framework/widget-core/decorators/afterRender.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = afterRender;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");

function afterRender(method) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (afterRender);
//# sourceMappingURL=afterRender.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/framework/widget-core/decorators/alwaysRender.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = alwaysRender;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__beforeProperties__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/beforeProperties.mjs");


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

/***/ "./node_modules/@dojo/framework/widget-core/decorators/beforeProperties.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = beforeProperties;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");

function beforeProperties(method) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__handleDecorator__["a" /* handleDecorator */])((target, propertyKey) => {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
/* unused harmony default export */ var _unused_webpack_default_export = (beforeProperties);
//# sourceMappingURL=beforeProperties.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/framework/widget-core/decorators/customElement.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = customElement;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__registerCustomElement__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/registerCustomElement.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Registry__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Registry.mjs");


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

/***/ "./node_modules/@dojo/framework/widget-core/decorators/diffProperty.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = diffProperty;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__diff__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/diff.mjs");


/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
function diffProperty(propertyName, diffFunction = __WEBPACK_IMPORTED_MODULE_1__diff__["a" /* auto */], reactionFunction) {
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

/***/ "./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs":
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

/***/ "./node_modules/@dojo/framework/widget-core/decorators/inject.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = inject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/framework/shim/WeakMap.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__beforeProperties__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/beforeProperties.mjs");



/**
 * Map of instances against registered injectors.
 */
const registeredInjectorsMap = new __WEBPACK_IMPORTED_MODULE_0__shim_WeakMap__["a" /* default */]();
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

/***/ "./node_modules/@dojo/framework/widget-core/diff.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export always */
/* unused harmony export ignore */
/* unused harmony export reference */
/* harmony export (immutable) */ __webpack_exports__["b"] = shallow;
/* harmony export (immutable) */ __webpack_exports__["a"] = auto;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Registry__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Registry.mjs");

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

/***/ "./node_modules/@dojo/framework/widget-core/mixins/Projector.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ProjectorAttachState */
/* unused harmony export AttachType */
/* harmony export (immutable) */ __webpack_exports__["a"] = ProjectorMixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_lang__ = __webpack_require__("./node_modules/@dojo/framework/core/lang.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__animations_cssTransitions__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/animations/cssTransitions.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__decorators_afterRender__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/afterRender.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vdom__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/vdom.mjs");






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
            this._projectorProperties = Object(__WEBPACK_IMPORTED_MODULE_1__core_lang__["a" /* assign */])({}, properties);
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
        Object(__WEBPACK_IMPORTED_MODULE_3__decorators_afterRender__["a" /* afterRender */])()
    ], Projector.prototype, "afterRender", null);
    return Projector;
}
/* unused harmony default export */ var _unused_webpack_default_export = (ProjectorMixin);
//# sourceMappingURL=Projector.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/framework/widget-core/mixins/Themed.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = theme;
/* harmony export (immutable) */ __webpack_exports__["b"] = registerThemeInjector;
/* harmony export (immutable) */ __webpack_exports__["a"] = ThemedMixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Injector__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Injector.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__decorators_inject__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/inject.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__decorators_handleDecorator__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/handleDecorator.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__decorators_diffProperty__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/diffProperty.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__diff__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/diff.mjs");






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
                    const _a = THEME_KEY, key = baseTheme[_a], classes = __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __rest */](baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
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
        Object(__WEBPACK_IMPORTED_MODULE_4__decorators_diffProperty__["a" /* diffProperty */])('extraClasses', __WEBPACK_IMPORTED_MODULE_5__diff__["b" /* shallow */])
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

/***/ "./node_modules/@dojo/framework/widget-core/registerCustomElement.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomElementChildType", function() { return CustomElementChildType; });
/* harmony export (immutable) */ __webpack_exports__["DomToWidgetWrapper"] = DomToWidgetWrapper;
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["register"] = register;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WidgetBase__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/WidgetBase.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_Projector__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/mixins/Projector.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shim_array__ = __webpack_require__("./node_modules/@dojo/framework/shim/array.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shim_global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Themed__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/mixins/Themed.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__decorators_alwaysRender__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/alwaysRender.mjs");








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
            Object(__WEBPACK_IMPORTED_MODULE_3__shim_array__["a" /* from */])(children).forEach((childNode) => {
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
            __WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].addEventListener('dojo-theme-set', () => themeContext.set(this._getTheme()));
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
            if (__WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */] && __WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].dojoce && __WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].dojoce.theme) {
                return __WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].dojoce.themes[__WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].dojoce.theme];
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
    __WEBPACK_IMPORTED_MODULE_5__shim_global__["a" /* default */].customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
}
/* harmony default export */ __webpack_exports__["default"] = (register);
//# sourceMappingURL=registerCustomElement.mjs.map

/***/ }),

/***/ "./node_modules/@dojo/framework/widget-core/vdom.mjs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export toParentVNode */
/* unused harmony export toTextVNode */
/* unused harmony export filterAndDecorateChildren */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shim_global__ = __webpack_require__("./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shim_array__ = __webpack_require__("./node_modules/@dojo/framework/shim/array.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__d__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Registry__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/Registry.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__ = __webpack_require__("./node_modules/@dojo/framework/shim/WeakMap.mjs");





const NAMESPACE_W3 = 'http://www.w3.org/';
const NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
const NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
const emptyArray = [];
const nodeOperations = ['focus', 'blur', 'scrollIntoView', 'click'];
const widgetInstanceMap = new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */]();
/* harmony export (immutable) */ __webpack_exports__["b"] = widgetInstanceMap;

const instanceMap = new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */]();
const nextSiblingMap = new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */]();
const projectorStateMap = new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */]();
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
    const eventMap = projectorState.nodeMap.get(domNode) || new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */]();
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
function nodeOperation(propName, propValue, previousValue, domNode, projectionOptions) {
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
            domNode[propName]();
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
        else if (nodeOperations.indexOf(propName) !== -1) {
            nodeOperation(propName, propValue, previousValue, domNode, projectionOptions);
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
        const item = instanceMap.get(dnode.instance);
        const rendered = (item ? item.dnode.rendered : dnode.rendered) || emptyArray;
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
function updateChildren(parentVNode, siblings, oldChildren, newChildren, parentInstance, projectionOptions) {
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
            oldIndex++;
            newIndex++;
            textUpdated =
                updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance, oldChildren.slice(oldIndex), newChildren.slice(newIndex)) || textUpdated;
            continue;
        }
        const findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
        const addChild = () => {
            let insertBeforeDomNode = undefined;
            let childrenArray = oldChildren;
            let nextIndex = oldIndex + 1;
            let child = oldChildren[oldIndex];
            if (!child) {
                child = siblings[0];
                nextIndex = 1;
                childrenArray = siblings;
            }
            if (child) {
                let insertBeforeChildren = [child];
                while (insertBeforeChildren.length) {
                    const insertBefore = insertBeforeChildren.shift();
                    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(insertBefore)) {
                        const item = instanceMap.get(insertBefore.instance);
                        if (item && item.dnode.rendered) {
                            insertBeforeChildren.push(...item.dnode.rendered);
                        }
                    }
                    else {
                        if (insertBefore.domNode) {
                            if (insertBefore.domNode.parentElement !== parentVNode.domNode) {
                                break;
                            }
                            insertBeforeDomNode = insertBefore.domNode;
                            break;
                        }
                    }
                    if (insertBeforeChildren.length === 0 && childrenArray[nextIndex]) {
                        insertBeforeChildren.push(childrenArray[nextIndex]);
                        nextIndex++;
                    }
                }
            }
            createDom(newChild, parentVNode, newChildren.slice(newIndex + 1), insertBeforeDomNode, projectionOptions, parentInstance);
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
        childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__shim_array__["a" /* from */])(parentVNode.domNode.childNodes);
    }
    const transitions = projectionOptions.transitions;
    projectionOptions = Object.assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const nextSiblings = children.slice(i + 1);
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
            createDom(child, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance);
        }
        else {
            createDom(child, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance, childNodes);
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
function createDom(dnode, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance, childNodes) {
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
        nextSiblingMap.set(instance, nextSiblings);
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
function updateDom(previous, dnode, projectionOptions, parentVNode, parentInstance, oldNextSiblings, nextSiblings) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* isWNode */])(dnode)) {
        const { instance } = previous;
        const { parentVNode, dnode: node } = instanceMap.get(instance);
        const previousRendered = node ? node.rendered : previous.rendered;
        const instanceData = widgetInstanceMap.get(instance);
        instanceData.rendering = true;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        nextSiblingMap.set(instance, nextSiblings);
        dnode.instance = instance;
        if (instanceData.dirty === true) {
            const rendered = instance.__render__();
            instanceData.rendering = false;
            dnode.rendered = filterAndDecorateChildren(rendered, instance);
            updateChildren(parentVNode, oldNextSiblings, previousRendered, dnode.rendered, instance, projectionOptions);
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
                    updateChildren(dnode, oldNextSiblings, previous.children, children, parentInstance, projectionOptions) || updated;
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
            __WEBPACK_IMPORTED_MODULE_0__shim_global__["a" /* default */].requestAnimationFrame(() => {
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
        if (__WEBPACK_IMPORTED_MODULE_0__shim_global__["a" /* default */].requestIdleCallback) {
            __WEBPACK_IMPORTED_MODULE_0__shim_global__["a" /* default */].requestIdleCallback(() => {
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
        projectorState.renderScheduled = __WEBPACK_IMPORTED_MODULE_0__shim_global__["a" /* default */].requestAnimationFrame(() => {
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
            const nextSiblings = nextSiblingMap.get(instance);
            updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance, nextSiblings, nextSiblings);
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
            nodeMap: new __WEBPACK_IMPORTED_MODULE_4__shim_WeakMap__["a" /* default */](),
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
        updateDom(node, node, finalProjectorOptions, parentVNode, instance, [], []);
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

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu/Menu.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/framework/widget-core/registerCustomElement.mjs").default;

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
/* harmony export (immutable) */ __webpack_exports__["b"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["a"] = __decorate;
/* unused harmony export __param */
/* unused harmony export __metadata */
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

/***/ "./src/menu/Menu.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("./node_modules/tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dojo_framework_widget_core_d__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_framework_widget_core_decorators_customElement__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/decorators/customElement.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dojo_framework_widget_core_mixins_Themed__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/mixins/Themed.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dojo_framework_widget_core_WidgetBase__ = __webpack_require__("./node_modules/@dojo/framework/widget-core/WidgetBase.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__menu_m_css__ = __webpack_require__("./src/menu/menu.m.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__menu_m_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__menu_m_css__);






let Menu = class Menu extends Object(__WEBPACK_IMPORTED_MODULE_3__dojo_framework_widget_core_mixins_Themed__["a" /* ThemedMixin */])(__WEBPACK_IMPORTED_MODULE_4__dojo_framework_widget_core_WidgetBase__["a" /* WidgetBase */]) {
    _onSelected(id, data) {
        this._selectedId = id;
        this.properties.onSelected(data);
        this.invalidate();
    }
    render() {
        const items = this.children.map((child, index) => {
            if (child) {
                const properties = {
                    onSelected: (data) => {
                        this._onSelected(index, data);
                    }
                };
                if (this._selectedId !== undefined) {
                    properties.selected = index === this._selectedId;
                }
                child.properties = Object.assign({}, child.properties, properties);
            }
            return child;
        });
        return Object(__WEBPACK_IMPORTED_MODULE_1__dojo_framework_widget_core_d__["g" /* v */])('nav', { classes: this.theme(__WEBPACK_IMPORTED_MODULE_5__menu_m_css__["root"]) }, [
            Object(__WEBPACK_IMPORTED_MODULE_1__dojo_framework_widget_core_d__["g" /* v */])('ol', {
                classes: this.theme(__WEBPACK_IMPORTED_MODULE_5__menu_m_css__["menuContainer"])
            }, items)
        ]);
    }
};
Menu = __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __decorate */]([
    Object(__WEBPACK_IMPORTED_MODULE_2__dojo_framework_widget_core_decorators_customElement__["a" /* customElement */])({
        tag: 'demo-menu',
        events: ['onSelected']
    }),
    Object(__WEBPACK_IMPORTED_MODULE_3__dojo_framework_widget_core_mixins_Themed__["c" /* theme */])(__WEBPACK_IMPORTED_MODULE_5__menu_m_css__)
], Menu);

/* harmony default export */ __webpack_exports__["default"] = (Menu);


/***/ }),

/***/ "./src/menu/menu.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"test-app/menu","root":"menu-m__root__3bA6j","menuContainer":"menu-m__menuContainer__1eoGf"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDkxNTUyNjI2M2M4Yjc1MTFjZjIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9jb3JlL0Rlc3Ryb3lhYmxlLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL2NvcmUvRXZlbnRlZC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9jb3JlL2xhbmcubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvaGFzL2hhcy5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL01hcC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL1Byb21pc2UubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9TeW1ib2wubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9XZWFrTWFwLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vYXJyYXkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9nbG9iYWwubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9pdGVyYXRvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL251bWJlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL29iamVjdC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N0cmluZy5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N1cHBvcnQvaGFzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vc3VwcG9ydC9xdWV1ZS5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N1cHBvcnQvdXRpbC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9JbmplY3Rvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9SZWdpc3RyeS5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2QubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hZnRlclJlbmRlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RpZmYubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS92ZG9tLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS9NZW51LnRzIiwid2VicGFjazovLy8uL3NyYy9tZW51L21lbnUubS5jc3M/ZWMxMSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUM3RGdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUN2REE7QUFDc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsZ0NBQWdDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RWlCO0FBQ0E7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUM7Ozs7Ozs7Ozs7OztBQ25NQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLE9BQU8saUJBQWlCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsUUFBUTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQzs7Ozs7Ozs7Ozs7Ozs7O0FDbk1vQztBQUNwQztBQUN5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFCQUFxQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxZQUFZO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFlBQVk7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7Ozs7Ozs7QUMvRkE7QUFDeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7O0FDdE1BO0FBQ0E7QUFDNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBSTtBQUNwQixnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFJO0FBQ2hCLFlBQVksVUFBVTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxtQzs7Ozs7Ozs7Ozs7OztBQ2hKQTtBQUNzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlHQTtBQUNrQztBQUNQO0FBQzNCO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsc0JBQXNCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0M7Ozs7Ozs7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG1DOzs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7QUFDaUQ7QUFDakQsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlHQTtBQUNBO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RkFBd0Y7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7OztBQ3hTbUI7QUFDbkI7MEVBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsRUFBRTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxFQUFFO0FBQ2pFLG1DQUFtQyxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxnQzs7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQzs7Ozs7Ozs7O0FDekxBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7O0FDdEJrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7QUNwQmtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2THRDO0FBQUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxnQkFBZ0Isc0NBQXNDLGlC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QU0sRUFBRSxDQUFDLFlBQVksQ0FBQztLQUN0QixDQUFDO0lBQ0QsZ0dBQUssQ0FBQyx5Q0FBRyxDQUFDO0dBQ0UsSUFBSSxDQW1DaEI7QUFuQ2dCO0FBcUNqQiwrREFBZSxJQUFJLEVBQUM7Ozs7Ozs7O0FDdkRwQjtBQUNBLGtCQUFrQixxRyIsImZpbGUiOiJtZW51LTEuMC4wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDkxNTUyNjI2M2M4Yjc1MTFjZjIiLCJpbXBvcnQgeyBjcmVhdGVDb21wb3NpdGVIYW5kbGUgfSBmcm9tICcuL2xhbmcnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vc2hpbS9Qcm9taXNlJztcbi8qKlxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG59XG4vKipcbiAqIE5vIG9wIGZ1bmN0aW9uIHVzZWQgdG8gcmVwbGFjZSBvd24sIG9uY2UgaW5zdGFuY2UgaGFzIGJlZW4gZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3llZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGwgbWFkZSB0byBkZXN0cm95ZWQgbWV0aG9kJyk7XG59XG5leHBvcnQgY2xhc3MgRGVzdHJveWFibGUge1xuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SGFuZGxlfSBoYW5kbGUgVGhlIGhhbmRsZSB0byBhZGQgZm9yIHRoZSBpbnN0YW5jZVxuICAgICAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxuICAgICAqL1xuICAgIG93bihoYW5kbGVzKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgPyBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlcykgOiBoYW5kbGVzO1xuICAgICAgICBjb25zdCB7IGhhbmRsZXM6IF9oYW5kbGVzIH0gPSB0aGlzO1xuICAgICAgICBfaGFuZGxlcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIF9oYW5kbGVzLnNwbGljZShfaGFuZGxlcy5pbmRleE9mKGhhbmRsZSkpO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IHtcbiAgICAgICAgICAgICAgICBoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95ID0gbm9vcDtcbiAgICAgICAgICAgIHRoaXMub3duID0gZGVzdHJveWVkO1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRGVzdHJveWFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1EZXN0cm95YWJsZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL2NvcmUvRGVzdHJveWFibGUubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvY29yZS9EZXN0cm95YWJsZS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IE1hcCBmcm9tICcuLi9zaGltL01hcCc7XHJcbmltcG9ydCB7IERlc3Ryb3lhYmxlIH0gZnJvbSAnLi9EZXN0cm95YWJsZSc7XHJcbi8qKlxyXG4gKiBNYXAgb2YgY29tcHV0ZWQgcmVndWxhciBleHByZXNzaW9ucywga2V5ZWQgYnkgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCByZWdleE1hcCA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgaXMgdGhlIGV2ZW50IHR5cGUgZ2xvYiBoYXMgYmVlbiBtYXRjaGVkXHJcbiAqXHJcbiAqIEByZXR1cm5zIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGdsb2IgaXMgbWF0Y2hlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmcsIHRhcmdldFN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcclxuICAgICAgICBsZXQgcmVnZXg7XHJcbiAgICAgICAgaWYgKHJlZ2V4TWFwLmhhcyhnbG9iU3RyaW5nKSkge1xyXG4gICAgICAgICAgICByZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7Z2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJyl9JGApO1xyXG4gICAgICAgICAgICByZWdleE1hcC5zZXQoZ2xvYlN0cmluZywgcmVnZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh0YXJnZXRTdHJpbmcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRXZlbnQgQ2xhc3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudGVkIGV4dGVuZHMgRGVzdHJveWFibGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcCA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIGVtaXQoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcC5mb3JFYWNoKChtZXRob2RzLCB0eXBlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0dsb2JNYXRjaCh0eXBlLCBldmVudC50eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgWy4uLm1ldGhvZHNdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKHRoaXMsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvbih0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVyKSkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVzID0gbGlzdGVuZXIubWFwKChsaXN0ZW5lcikgPT4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZS5kZXN0cm95KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgX2FkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNNYXAuZ2V0KHR5cGUpIHx8IFtdO1xyXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcC5zZXQodHlwZSwgbGlzdGVuZXJzKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50ZWQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUV2ZW50ZWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9jb3JlL0V2ZW50ZWQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvY29yZS9FdmVudGVkLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyBhc3NpZ24gfSBmcm9tICcuLi9zaGltL29iamVjdCc7XG5leHBvcnQgeyBhc3NpZ24gfSBmcm9tICcuLi9zaGltL29iamVjdCc7XG5jb25zdCBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbi8qKlxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcbiAqL1xuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5mdW5jdGlvbiBjb3B5QXJyYXkoYXJyYXksIGluaGVyaXRlZCkge1xuICAgIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3B5QXJyYXkoaXRlbSwgaW5oZXJpdGVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXNob3VsZERlZXBDb3B5T2JqZWN0KGl0ZW0pXG4gICAgICAgICAgICA/IGl0ZW1cbiAgICAgICAgICAgIDogX21peGluKHtcbiAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluaGVyaXRlZDogaW5oZXJpdGVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZXM6IFtpdGVtXSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHt9XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIF9taXhpbihrd0FyZ3MpIHtcbiAgICBjb25zdCBkZWVwID0ga3dBcmdzLmRlZXA7XG4gICAgY29uc3QgaW5oZXJpdGVkID0ga3dBcmdzLmluaGVyaXRlZDtcbiAgICBjb25zdCB0YXJnZXQgPSBrd0FyZ3MudGFyZ2V0O1xuICAgIGNvbnN0IGNvcGllZCA9IGt3QXJncy5jb3BpZWQgfHwgW107XG4gICAgY29uc3QgY29waWVkQ2xvbmUgPSBbLi4uY29waWVkXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGt3QXJncy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xuICAgICAgICBpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvcGllZENsb25lLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRlZXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvcHlBcnJheSh2YWx1ZSwgaW5oZXJpdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV0gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3BpZWQucHVzaChzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfbWl4aW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlczogW3ZhbHVlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIC4uLm1peGlucykge1xuICAgIGlmICghbWl4aW5zLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcbiAgICB9XG4gICAgY29uc3QgYXJncyA9IG1peGlucy5zbGljZSgpO1xuICAgIGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xuICAgIHJldHVybiBhc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gX21peGluKHtcbiAgICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgICAgaW5oZXJpdGVkOiBmYWxzZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW4odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gICAgcmV0dXJuIF9taXhpbih7XG4gICAgICAgIGRlZXA6IHRydWUsXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGUoc291cmNlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XG4gICAgcmV0dXJuIGRlZXBNaXhpbih0YXJnZXQsIHNvdXJjZSk7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lOyBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSWRlbnRpY2FsKGEsIGIpIHtcbiAgICByZXR1cm4gKGEgPT09IGIgfHxcbiAgICAgICAgLyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xuICAgICAgICAoYSAhPT0gYSAmJiBiICE9PSBiKSk7XG59XG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xuICogYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGluc3RlYWQgb2YgYSBmdW5jdGlvbiBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIG1ldGhvZCBvbiBhbiBvYmplY3QuXG4gKiBBcyBhIHJlc3VsdCwgdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IGBsYXRlQmluZGAgd2lsbCBhbHdheXMgY2FsbCB0aGUgZnVuY3Rpb24gY3VycmVudGx5IGFzc2lnbmVkIHRvXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXG4gKlxuICogQHBhcmFtIGluc3RhbmNlIFRoZSBjb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcHJlcGVuZCB0byB0aGUgYGluc3RhbmNlW21ldGhvZF1gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF0ZUJpbmQoaW5zdGFuY2UsIG1ldGhvZCwgLi4uc3VwcGxpZWRBcmdzKSB7XG4gICAgcmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGhcbiAgICAgICAgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcbiAgICAgICAgICAgIC8vIFRTNzAxN1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gVFM3MDE3XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gX21peGluKHtcbiAgICAgICAgZGVlcDogZmFsc2UsXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXG4gKiBMaWtlIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBkb2VzIG5vdCBhbHRlciBleGVjdXRpb24gY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhlIGB0YXJnZXRGdW5jdGlvbmAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsKHRhcmdldEZ1bmN0aW9uLCAuLi5zdXBwbGllZEFyZ3MpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcbiAgICAgICAgcmV0dXJuIHRhcmdldEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG59XG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBkZXN0cm95IG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgY2FsbHMgdGhlIHBhc3NlZC1pbiBkZXN0cnVjdG9yLlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcbiAqIGV2ZW50IGxpc3RlbmVycywgdGltZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGRlc3RydWN0b3IpIHtcbiAgICBsZXQgY2FsbGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRlc3RydWN0b3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaGFuZGxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGVzdHJveSBtdWx0aXBsZSBoYW5kbGVzIHNpbXVsdGFuZW91c2x5LlxuICpcbiAqIEBwYXJhbSBoYW5kbGVzIEFuIGFycmF5IG9mIGhhbmRsZXMgd2l0aCBgZGVzdHJveWAgbWV0aG9kc1xuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcG9zaXRlSGFuZGxlKC4uLmhhbmRsZXMpIHtcbiAgICByZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYW5kbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGVzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGFuZy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL2NvcmUvbGFuZy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9jb3JlL2xhbmcubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImZ1bmN0aW9uIGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XHJcbn1cclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgcmVzdWx0cyBvZiBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdGVzdENhY2hlID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHRoZSB1bi1yZXNvbHZlZCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdGVzdEZ1bmN0aW9ucyA9IHt9O1xyXG4vKipcclxuICogQSBjYWNoZSBvZiB1bnJlc29sdmVkIHRoZW5hYmxlcyAocHJvYmFibHkgcHJvbWlzZXMpXHJcbiAqIEB0eXBlIHt7fX1cclxuICovXHJcbmNvbnN0IHRlc3RUaGVuYWJsZXMgPSB7fTtcclxuLyoqXHJcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUgKGB3aW5kb3dgIGluIGEgYnJvd3NlciwgYGdsb2JhbGAgaW4gTm9kZUpTKVxyXG4gKi9cclxuY29uc3QgZ2xvYmFsU2NvcGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIEJyb3dzZXJzXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gTm9kZVxyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBXZWIgd29ya2Vyc1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJldHVybiB7fTtcclxufSkoKTtcclxuLyogR3JhYiB0aGUgc3RhdGljRmVhdHVyZXMgaWYgdGhlcmUgYXJlIGF2YWlsYWJsZSAqL1xyXG5jb25zdCB7IHN0YXRpY0ZlYXR1cmVzIH0gPSBnbG9iYWxTY29wZS5Eb2pvSGFzRW52aXJvbm1lbnQgfHwge307XHJcbi8qIENsZWFuaW5nIHVwIHRoZSBEb2pvSGFzRW52aW9ybm1lbnQgKi9cclxuaWYgKCdEb2pvSGFzRW52aXJvbm1lbnQnIGluIGdsb2JhbFNjb3BlKSB7XHJcbiAgICBkZWxldGUgZ2xvYmFsU2NvcGUuRG9qb0hhc0Vudmlyb25tZW50O1xyXG59XHJcbi8qKlxyXG4gKiBDdXN0b20gdHlwZSBndWFyZCB0byBuYXJyb3cgdGhlIGBzdGF0aWNGZWF0dXJlc2AgdG8gZWl0aGVyIGEgbWFwIG9yIGEgZnVuY3Rpb24gdGhhdFxyXG4gKiByZXR1cm5zIGEgbWFwLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGZvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuLyoqXHJcbiAqIFRoZSBjYWNoZSBvZiBhc3NlcnRlZCBmZWF0dXJlcyB0aGF0IHdlcmUgYXZhaWxhYmxlIGluIHRoZSBnbG9iYWwgc2NvcGUgd2hlbiB0aGVcclxuICogbW9kdWxlIGxvYWRlZFxyXG4gKi9cclxuY29uc3Qgc3RhdGljQ2FjaGUgPSBzdGF0aWNGZWF0dXJlc1xyXG4gICAgPyBpc1N0YXRpY0ZlYXR1cmVGdW5jdGlvbihzdGF0aWNGZWF0dXJlcykgPyBzdGF0aWNGZWF0dXJlcy5hcHBseShnbG9iYWxTY29wZSkgOiBzdGF0aWNGZWF0dXJlc1xyXG4gICAgOiB7fTsgLyogUHJvdmlkaW5nIGFuIGVtcHR5IGNhY2hlLCBpZiBub25lIHdhcyBpbiB0aGUgZW52aXJvbm1lbnRcclxuXHJcbi8qKlxyXG4qIEFNRCBwbHVnaW4gZnVuY3Rpb24uXHJcbipcclxuKiBDb25kaXRpb25hbCBsb2FkcyBtb2R1bGVzIGJhc2VkIG9uIGEgaGFzIGZlYXR1cmUgdGVzdCB2YWx1ZS5cclxuKlxyXG4qIEBwYXJhbSByZXNvdXJjZUlkIEdpdmVzIHRoZSByZXNvbHZlZCBtb2R1bGUgaWQgdG8gbG9hZC5cclxuKiBAcGFyYW0gcmVxdWlyZSBUaGUgbG9hZGVyIHJlcXVpcmUgZnVuY3Rpb24gd2l0aCByZXNwZWN0IHRvIHRoZSBtb2R1bGUgdGhhdCBjb250YWluZWQgdGhlIHBsdWdpbiByZXNvdXJjZSBpbiBpdHNcclxuKiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5IGxpc3QuXHJcbiogQHBhcmFtIGxvYWQgQ2FsbGJhY2sgdG8gbG9hZGVyIHRoYXQgY29uc3VtZXMgcmVzdWx0IG9mIHBsdWdpbiBkZW1hbmQuXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkKHJlc291cmNlSWQsIHJlcXVpcmUsIGxvYWQsIGNvbmZpZykge1xyXG4gICAgcmVzb3VyY2VJZCA/IHJlcXVpcmUoW3Jlc291cmNlSWRdLCBsb2FkKSA6IGxvYWQoKTtcclxufVxyXG4vKipcclxuICogQU1EIHBsdWdpbiBmdW5jdGlvbi5cclxuICpcclxuICogUmVzb2x2ZXMgcmVzb3VyY2VJZCBpbnRvIGEgbW9kdWxlIGlkIGJhc2VkIG9uIHBvc3NpYmx5LW5lc3RlZCB0ZW5hcnkgZXhwcmVzc2lvbiB0aGF0IGJyYW5jaGVzIG9uIGhhcyBmZWF0dXJlIHRlc3RcclxuICogdmFsdWUocykuXHJcbiAqXHJcbiAqIEBwYXJhbSByZXNvdXJjZUlkIFRoZSBpZCBvZiB0aGUgbW9kdWxlXHJcbiAqIEBwYXJhbSBub3JtYWxpemUgUmVzb2x2ZXMgYSByZWxhdGl2ZSBtb2R1bGUgaWQgaW50byBhbiBhYnNvbHV0ZSBtb2R1bGUgaWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUocmVzb3VyY2VJZCwgbm9ybWFsaXplKSB7XHJcbiAgICBjb25zdCB0b2tlbnMgPSByZXNvdXJjZUlkLm1hdGNoKC9bXFw/Ol18W146XFw/XSovZykgfHwgW107XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBmdW5jdGlvbiBnZXQoc2tpcCkge1xyXG4gICAgICAgIGNvbnN0IHRlcm0gPSB0b2tlbnNbaSsrXTtcclxuICAgICAgICBpZiAodGVybSA9PT0gJzonKSB7XHJcbiAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZyBtb2R1bGUgbmFtZSwgcmVzb2x2ZXMgdG8gbnVsbFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHBvc3RmaXhlZCB3aXRoIGEgPyBtZWFucyBpdCBpcyBhIGZlYXR1cmUgdG8gYnJhbmNoIG9uLCB0aGUgdGVybSBpcyB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gICAgICAgICAgICBpZiAodG9rZW5zW2krK10gPT09ICc/Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFza2lwICYmIGhhcyh0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoZWQgdGhlIGZlYXR1cmUsIGdldCB0aGUgZmlyc3QgdmFsdWUgZnJvbSB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpZCBub3QgbWF0Y2gsIGdldCB0aGUgc2Vjb25kIHZhbHVlLCBwYXNzaW5nIG92ZXIgdGhlIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoc2tpcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYSBtb2R1bGVcclxuICAgICAgICAgICAgcmV0dXJuIHRlcm07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgaWQgPSBnZXQoKTtcclxuICAgIHJldHVybiBpZCAmJiBub3JtYWxpemUoaWQpO1xyXG59XHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhIGZlYXR1cmUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkXHJcbiAqXHJcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXhpc3RzKGZlYXR1cmUpIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIEJvb2xlYW4obm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUgfHwgbm9ybWFsaXplZEZlYXR1cmUgaW4gdGVzdENhY2hlIHx8IHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKTtcclxufVxyXG4vKipcclxuICogUmVnaXN0ZXIgYSBuZXcgdGVzdCBmb3IgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBoYXMuYWRkKCdkb20tYWRkZXZlbnRsaXN0ZW5lcicsICEhZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcik7XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGhhcy5hZGQoJ3RvdWNoLWV2ZW50cycsIGZ1bmN0aW9uICgpIHtcclxuICogICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50XHJcbiAqIH0pO1xyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHJlcG9ydGVkIG9mIHRoZSBmZWF0dXJlLCBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBvbmNlIG9uIGZpcnN0IHRlc3RcclxuICogQHBhcmFtIG92ZXJ3cml0ZSBpZiBhbiBleGlzdGluZyB2YWx1ZSBzaG91bGQgYmUgb3ZlcndyaXR0ZW4uIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZChmZWF0dXJlLCB2YWx1ZSwgb3ZlcndyaXRlID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKGV4aXN0cyhub3JtYWxpemVkRmVhdHVyZSkgJiYgIW92ZXJ3cml0ZSAmJiAhKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEZlYXR1cmUgXCIke2ZlYXR1cmV9XCIgZXhpc3RzIGFuZCBvdmVyd3JpdGUgbm90IHRydWUuYCk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdID0gdmFsdWUudGhlbigocmVzb2x2ZWRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0Q2FjaGVbZmVhdHVyZV0gPSByZXNvbHZlZFZhbHVlO1xyXG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHZhbHVlO1xyXG4gICAgICAgIGRlbGV0ZSB0ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmV0dXJuIHRoZSBjdXJyZW50IHZhbHVlIG9mIGEgbmFtZWQgZmVhdHVyZS5cclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgVGhlIG5hbWUgKGlmIGEgc3RyaW5nKSBvciBpZGVudGlmaWVyIChpZiBhbiBpbnRlZ2VyKSBvZiB0aGUgZmVhdHVyZSB0byB0ZXN0LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFzKGZlYXR1cmUpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBjb25zdCBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXRpY0NhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdLmNhbGwobnVsbCk7XHJcbiAgICAgICAgZGVsZXRlIHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobm9ybWFsaXplZEZlYXR1cmUgaW4gdGVzdENhY2hlKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZlYXR1cmUgaW4gdGVzdFRoZW5hYmxlcykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEF0dGVtcHQgdG8gZGV0ZWN0IHVucmVnaXN0ZXJlZCBoYXMgZmVhdHVyZSBcIiR7ZmVhdHVyZX1cImApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4vKlxyXG4gKiBPdXQgb2YgdGhlIGJveCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG4vKiBFbnZpcm9ubWVudHMgKi9cclxuLyogVXNlZCBhcyBhIHZhbHVlIHRvIHByb3ZpZGUgYSBkZWJ1ZyBvbmx5IGNvZGUgcGF0aCAqL1xyXG5hZGQoJ2RlYnVnJywgdHJ1ZSk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGlzIFwiYnJvd3NlciBsaWtlXCIgKi9cclxuYWRkKCdob3N0LWJyb3dzZXInLCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpO1xyXG4vKiBEZXRlY3RzIGlmIHRoZSBlbnZpcm9ubWVudCBhcHBlYXJzIHRvIGJlIE5vZGVKUyAqL1xyXG5hZGQoJ2hvc3Qtbm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFzLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvaGFzL2hhcy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9oYXMvaGFzLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyBpc0FycmF5TGlrZSwgU2hpbUl0ZXJhdG9yIH0gZnJvbSAnLi9pdGVyYXRvcic7XHJcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgeyBpcyBhcyBvYmplY3RJcyB9IGZyb20gJy4vb2JqZWN0JztcclxuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcclxuaW1wb3J0ICcuL1N5bWJvbCc7XHJcbmV4cG9ydCBsZXQgTWFwID0gZ2xvYmFsLk1hcDtcclxuaWYgKCF0cnVlKSB7XHJcbiAgICBNYXAgPSAoX2EgPSBjbGFzcyBNYXAge1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnTWFwJztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEFuIGFsdGVybmF0aXZlIHRvIEFycmF5LnByb3RvdHlwZS5pbmRleE9mIHVzaW5nIE9iamVjdC5pc1xyXG4gICAgICAgICAgICAgKiB0byBjaGVjayBmb3IgZXF1YWxpdHkuIFNlZSBodHRwOi8vbXpsLmxhLzF6dUtPMlZcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF9pbmRleE9mS2V5KGtleXMsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0SXMoa2V5c1tpXSwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xlYXIoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLmxlbmd0aCA9IHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZShrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50cmllcygpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuX2tleXMubWFwKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdGhpcy5fdmFsdWVzW2ldXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JFYWNoKGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5fa2V5cztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZXNbaV0sIGtleXNbaV0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IHRoaXMuX3ZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaGFzKGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KSA+IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGtleXMoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl9rZXlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXQoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyB0aGlzLl9rZXlzLmxlbmd0aCA6IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tpbmRleF0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWx1ZXMoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBfYSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTWFwO1xyXG52YXIgX2E7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1hcC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vTWFwLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vTWFwLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcclxuaW1wb3J0IHsgcXVldWVNaWNyb1Rhc2sgfSBmcm9tICcuL3N1cHBvcnQvcXVldWUnO1xyXG5pbXBvcnQgJy4vU3ltYm9sJztcclxuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcclxuZXhwb3J0IGxldCBTaGltUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xyXG5leHBvcnQgY29uc3QgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcclxufTtcclxuaWYgKCF0cnVlKSB7XHJcbiAgICBnbG9iYWwuUHJvbWlzZSA9IFNoaW1Qcm9taXNlID0gKF9hID0gY2xhc3MgUHJvbWlzZSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IFByb21pc2UuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gZXhlY3V0b3JcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBpbW1lZGlhdGVseSB3aGVuIHRoZSBQcm9taXNlIGlzIGluc3RhbnRpYXRlZC4gSXQgaXMgcmVzcG9uc2libGUgZm9yXHJcbiAgICAgICAgICAgICAqIHN0YXJ0aW5nIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoZW4gaXQgaXMgaW52b2tlZC5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIG11c3QgY2FsbCBlaXRoZXIgdGhlIHBhc3NlZCBgcmVzb2x2ZWAgZnVuY3Rpb24gd2hlbiB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkXHJcbiAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxseSwgb3IgdGhlIGByZWplY3RgIGZ1bmN0aW9uIHdoZW4gdGhlIG9wZXJhdGlvbiBmYWlscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yKSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IDEgLyogUGVuZGluZyAqLztcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdQcm9taXNlJztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgdHJ1ZSwgdGhlIHJlc29sdXRpb24gb2YgdGhpcyBwcm9taXNlIGlzIGNoYWluZWQgKFwibG9ja2VkIGluXCIpIHRvIGFub3RoZXIgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzQ2hhaW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZXNvbHZlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovIHx8IGlzQ2hhaW5lZDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkIG9uY2UgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJbml0aWFsbHkgcHVzaGVzIGNhbGxiYWNrcyBvbnRvIGEgcXVldWUgZm9yIGV4ZWN1dGlvbiBvbmNlIHRoaXMgcHJvbWlzZSBzZXR0bGVzLiBBZnRlciB0aGUgcHJvbWlzZSBzZXR0bGVzLFxyXG4gICAgICAgICAgICAgICAgICogZW5xdWV1ZXMgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgZXZlbnQgbG9vcCB0dXJuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgd2hlbkZpbmlzaGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2V0dGxlcyB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNldHRsZSA9IChuZXdTdGF0ZSwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBIHByb21pc2UgY2FuIG9ubHkgYmUgc2V0dGxlZCBvbmNlLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSAxIC8qIFBlbmRpbmcgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gbmV3U3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkID0gcXVldWVNaWNyb1Rhc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBlbnF1ZXVlIGEgY2FsbGJhY2sgcnVubmVyIGlmIHRoZXJlIGFyZSBjYWxsYmFja3Mgc28gdGhhdCBpbml0aWFsbHkgZnVsZmlsbGVkIFByb21pc2VzIGRvbid0IGhhdmUgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZU1pY3JvVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gY2FsbGJhY2tzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJlc29sdmVzIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZSA9IChuZXdTdGF0ZSwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXNvbHZlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVGhlbmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4oc2V0dGxlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCBzZXR0bGUuYmluZChudWxsLCAyIC8qIFJlamVjdGVkICovKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2hhaW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0bGUobmV3U3RhdGUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aGVuID0gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbkZpbmlzaGVkIGluaXRpYWxseSBxdWV1ZXMgdXAgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gYWZ0ZXIgdGhlIHByb21pc2UgaGFzIHNldHRsZWQuIE9uY2UgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb21pc2UgaGFzIHNldHRsZWQsIHdoZW5GaW5pc2hlZCB3aWxsIHNjaGVkdWxlIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IHR1cm4gdGhyb3VnaCB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnQgbG9vcC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5zdGF0ZSA9PT0gMiAvKiBSZWplY3RlZCAqLyA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKHRoaXMucmVzb2x2ZWRWYWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXRlID09PSAyIC8qIFJlamVjdGVkICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoaXMucmVzb2x2ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzb2x2ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0b3IocmVzb2x2ZS5iaW5kKG51bGwsIDAgLyogRnVsZmlsbGVkICovKSwgcmVzb2x2ZS5iaW5kKG51bGwsIDIgLyogUmVqZWN0ZWQgKi8pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRsZSgyIC8qIFJlamVjdGVkICovLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGljIGFsbChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxldGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvcHVsYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKytjb21wbGV0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcHVsYXRpbmcgfHwgY29tcGxldGUgPCB0b3RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVGhlbmFibGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGFuIGl0ZW0gUHJvbWlzZSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvbWlzZSdzIHJlamVjdGlvbiBlcnJvci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0l0ZW0oaSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVsYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0YXRpYyByYWNlKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgUHJvbWlzZSBpdGVtIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihyZXNvbHZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWplY3QocmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGljIHJlc29sdmUodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2gob25SZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBTaGltUHJvbWlzZSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU2hpbVByb21pc2U7XHJcbnZhciBfYTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UHJvbWlzZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vUHJvbWlzZS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL1Byb21pc2UubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XHJcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgeyBnZXRWYWx1ZURlc2NyaXB0b3IgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XHJcbmV4cG9ydCBsZXQgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcclxuaWYgKCF0cnVlKSB7XHJcbiAgICAvKipcclxuICAgICAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXHJcbiAgICAgKiBAcGFyYW0gIHthbnl9ICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gICAgICogQHJldHVybiB7c3ltYm9sfSAgICAgICBSZXR1cm5zIHRoZSBzeW1ib2wgb3IgdGhyb3dzXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHZhbGlkYXRlU3ltYm9sID0gZnVuY3Rpb24gdmFsaWRhdGVTeW1ib2wodmFsdWUpIHtcclxuICAgICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcclxuICAgIGNvbnN0IGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xyXG4gICAgY29uc3QgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcclxuICAgIGNvbnN0IG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICBjb25zdCBnbG9iYWxTeW1ib2xzID0ge307XHJcbiAgICBjb25zdCBnZXRTeW1ib2xOYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBjcmVhdGVkID0gY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZGVzYykge1xyXG4gICAgICAgICAgICBsZXQgcG9zdGZpeCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBuYW1lO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XHJcbiAgICAgICAgICAgICAgICArK3Bvc3RmaXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVzYyArPSBTdHJpbmcocG9zdGZpeCB8fCAnJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xyXG4gICAgICAgICAgICBuYW1lID0gJ0BAJyArIGRlc2M7XHJcbiAgICAgICAgICAgIC8vIEZJWE1FOiBUZW1wb3JhcnkgZ3VhcmQgdW50aWwgdGhlIGR1cGxpY2F0ZSBleGVjdXRpb24gd2hlbiB0ZXN0aW5nIGNhbiBiZVxyXG4gICAgICAgICAgICAvLyBwaW5uZWQgZG93bi5cclxuICAgICAgICAgICAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialByb3RvdHlwZSwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9ialByb3RvdHlwZSwgbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG4gICAgY29uc3QgSW50ZXJuYWxTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTeW1ib2woZGVzY3JpcHRpb24pO1xyXG4gICAgfTtcclxuICAgIFN5bWJvbCA9IGdsb2JhbC5TeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bSwge1xyXG4gICAgICAgICAgICBfX2Rlc2NyaXB0aW9uX186IGdldFZhbHVlRGVzY3JpcHRvcihkZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgIF9fbmFtZV9fOiBnZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZShkZXNjcmlwdGlvbikpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIFN5bWJvbCBmdW5jdGlvbiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBwcm9wZXJ0aWVzICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0eShTeW1ib2wsICdmb3InLCBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxTeW1ib2xzW2tleV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbFN5bWJvbHNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcclxuICAgIH0pKTtcclxuICAgIGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLCB7XHJcbiAgICAgICAga2V5Rm9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKHN5bSkge1xyXG4gICAgICAgICAgICBsZXQga2V5O1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVN5bWJvbChzeW0pO1xyXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU3ltYm9sc1trZXldID09PSBzeW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaGFzSW5zdGFuY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIGlzQ29uY2F0U3ByZWFkYWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2lzQ29uY2F0U3ByZWFkYWJsZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIGl0ZXJhdG9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaXRlcmF0b3InKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBtYXRjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgb2JzZXJ2YWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ29ic2VydmFibGUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICByZXBsYWNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigncmVwbGFjZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNlYXJjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NlYXJjaCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNwZWNpZXM6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzcGVjaWVzJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc3BsaXQ6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzcGxpdCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHRvUHJpbWl0aXZlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9QcmltaXRpdmUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB0b1N0cmluZ1RhZzogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3RvU3RyaW5nVGFnJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdW5zY29wYWJsZXM6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd1bnNjb3BhYmxlcycpLCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBJbnRlcm5hbFN5bWJvbCBvYmplY3QgKi9cclxuICAgIGRlZmluZVByb3BlcnRpZXMoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLCB7XHJcbiAgICAgICAgY29uc3RydWN0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wpLFxyXG4gICAgICAgIHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX25hbWVfXztcclxuICAgICAgICB9LCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcclxuICAgICAgICB0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdTeW1ib2wgKCcgKyB2YWxpZGF0ZVN5bWJvbCh0aGlzKS5fX2Rlc2NyaXB0aW9uX18gKyAnKSc7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdmFsdWVPZjogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuICAgIGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XHJcbiAgICB9KSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIGdldFZhbHVlRGVzY3JpcHRvcignU3ltYm9sJywgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbn1cclxuLyoqXHJcbiAqIEEgY3VzdG9tIGd1YXJkIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbiBvYmplY3QgaXMgYSBzeW1ib2wgb3Igbm90XHJcbiAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyB8fCB2YWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykpIHx8IGZhbHNlO1xyXG59XHJcbi8qKlxyXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cclxuICovXHJcbltcclxuICAgICdoYXNJbnN0YW5jZScsXHJcbiAgICAnaXNDb25jYXRTcHJlYWRhYmxlJyxcclxuICAgICdpdGVyYXRvcicsXHJcbiAgICAnc3BlY2llcycsXHJcbiAgICAncmVwbGFjZScsXHJcbiAgICAnc2VhcmNoJyxcclxuICAgICdzcGxpdCcsXHJcbiAgICAnbWF0Y2gnLFxyXG4gICAgJ3RvUHJpbWl0aXZlJyxcclxuICAgICd0b1N0cmluZ1RhZycsXHJcbiAgICAndW5zY29wYWJsZXMnLFxyXG4gICAgJ29ic2VydmFibGUnXHJcbl0uZm9yRWFjaCgod2VsbEtub3duKSA9PiB7XHJcbiAgICBpZiAoIVN5bWJvbFt3ZWxsS25vd25dKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbCwgd2VsbEtub3duLCBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcih3ZWxsS25vd24pLCBmYWxzZSwgZmFsc2UpKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3ltYm9sLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9TeW1ib2wubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9TeW1ib2wubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4vaXRlcmF0b3InO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xyXG5pbXBvcnQgJy4vU3ltYm9sJztcclxuZXhwb3J0IGxldCBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XHJcbmlmICghdHJ1ZSkge1xyXG4gICAgY29uc3QgREVMRVRFRCA9IHt9O1xyXG4gICAgY29uc3QgZ2V0VUlEID0gZnVuY3Rpb24gZ2V0VUlEKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGdlbmVyYXRlTmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0SWQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgJSAxMDAwMDAwMDApO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnX193bScgKyBnZXRVSUQoKSArIChzdGFydElkKysgKyAnX18nKTtcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuICAgIFdlYWtNYXAgPSBjbGFzcyBXZWFrTWFwIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnV2Vha01hcCc7XHJcbiAgICAgICAgICAgIHRoaXMuX25hbWUgPSBnZW5lcmF0ZU5hbWUoKTtcclxuICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoaXRlbVswXSwgaXRlbVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Zyb3plbkVudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mcm96ZW5FbnRyaWVzW2ldLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS52YWx1ZSA9IERFTEVURUQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm96ZW5FbnRyaWVzW2Zyb3plbkluZGV4XS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBoYXMoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKEJvb2xlYW4oZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0KGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHZhbHVlIHVzZWQgYXMgd2VhayBtYXAga2V5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWVudHJ5IHx8IGVudHJ5LmtleSAhPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeSA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogeyB2YWx1ZToga2V5IH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbihrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBXZWFrTWFwO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1XZWFrTWFwLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9XZWFrTWFwLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vV2Vha01hcC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XHJcbmltcG9ydCB7IGlzQXJyYXlMaWtlLCBpc0l0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XHJcbmltcG9ydCB7IE1BWF9TQUZFX0lOVEVHRVIgfSBmcm9tICcuL251bWJlcic7XHJcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XHJcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XHJcbmV4cG9ydCBsZXQgZnJvbTtcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgZnJvbSB0aGUgZnVuY3Rpb24gcGFyYW1ldGVycy5cclxuICpcclxuICogQHBhcmFtIGFyZ3VtZW50cyBBbnkgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgdGhlIGFycmF5XHJcbiAqIEByZXR1cm4gQW4gYXJyYXkgZnJvbSB0aGUgZ2l2ZW4gYXJndW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgbGV0IG9mO1xyXG4vKiBFUzYgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4vKipcclxuICogQ29waWVzIGRhdGEgaW50ZXJuYWxseSB3aXRoaW4gYW4gYXJyYXkgb3IgYXJyYXktbGlrZSBvYmplY3QuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxyXG4gKiBAcGFyYW0gb2Zmc2V0IFRoZSBpbmRleCB0byBzdGFydCBjb3B5aW5nIHZhbHVlcyB0bzsgaWYgbmVnYXRpdmUsIGl0IGNvdW50cyBiYWNrd2FyZHMgZnJvbSBsZW5ndGhcclxuICogQHBhcmFtIHN0YXJ0IFRoZSBmaXJzdCAoaW5jbHVzaXZlKSBpbmRleCB0byBjb3B5OyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxyXG4gKiBAcGFyYW0gZW5kIFRoZSBsYXN0IChleGNsdXNpdmUpIGluZGV4IHRvIGNvcHk7IGlmIG5lZ2F0aXZlLCBpdCBjb3VudHMgYmFja3dhcmRzIGZyb20gbGVuZ3RoXHJcbiAqIEByZXR1cm4gVGhlIHRhcmdldFxyXG4gKi9cclxuZXhwb3J0IGxldCBjb3B5V2l0aGluO1xyXG4vKipcclxuICogRmlsbHMgZWxlbWVudHMgb2YgYW4gYXJyYXktbGlrZSBvYmplY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gZmlsbFxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgZWFjaCBlbGVtZW50IG9mIHRoZSB0YXJnZXQgd2l0aFxyXG4gKiBAcGFyYW0gc3RhcnQgVGhlIGZpcnN0IGluZGV4IHRvIGZpbGxcclxuICogQHBhcmFtIGVuZCBUaGUgKGV4Y2x1c2l2ZSkgaW5kZXggYXQgd2hpY2ggdG8gc3RvcCBmaWxsaW5nXHJcbiAqIEByZXR1cm4gVGhlIGZpbGxlZCB0YXJnZXRcclxuICovXHJcbmV4cG9ydCBsZXQgZmlsbDtcclxuLyoqXHJcbiAqIEZpbmRzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbnN0YW5jZSBtYXRjaGluZyB0aGUgY2FsbGJhY2sgb3IgdW5kZWZpbmVkIGlmIG9uZSBpcyBub3QgZm91bmQuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcclxuICogQHBhcmFtIGNhbGxiYWNrIEEgZnVuY3Rpb24gcmV0dXJuaW5nIGlmIHRoZSBjdXJyZW50IHZhbHVlIG1hdGNoZXMgYSBjcml0ZXJpYVxyXG4gKiBAcGFyYW0gdGhpc0FyZyBUaGUgZXhlY3V0aW9uIGNvbnRleHQgZm9yIHRoZSBmaW5kIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4gVGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrLCBvciB1bmRlZmluZWQgaWYgb25lIGRvZXMgbm90IGV4aXN0XHJcbiAqL1xyXG5leHBvcnQgbGV0IGZpbmQ7XHJcbi8qKlxyXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBzZWFyY2ggYW5kIHJldHVybnMgdGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLFxyXG4gKiBvciAtMSBpZiBubyB2YWx1ZXMgc2F0aXNmeSBpdC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBBbiBhcnJheS1saWtlIG9iamVjdFxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgQSBmdW5jdGlvbiByZXR1cm5pbmcgdHJ1ZSBpZiB0aGUgY3VycmVudCB2YWx1ZSBzYXRpc2ZpZXMgaXRzIGNyaXRlcmlhXHJcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cclxuICogQHJldHVybiBUaGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0XHJcbiAqL1xyXG5leHBvcnQgbGV0IGZpbmRJbmRleDtcclxuLyogRVM3IEFycmF5IGluc3RhbmNlIG1ldGhvZHMgKi9cclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBhcnJheSBpbmNsdWRlcyBhIGdpdmVuIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgdGhlIHRhcmdldCBhcnJheS1saWtlIG9iamVjdFxyXG4gKiBAcGFyYW0gc2VhcmNoRWxlbWVudCB0aGUgaXRlbSB0byBzZWFyY2ggZm9yXHJcbiAqIEBwYXJhbSBmcm9tSW5kZXggdGhlIHN0YXJ0aW5nIGluZGV4IHRvIHNlYXJjaCBmcm9tXHJcbiAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSBhcnJheSBpbmNsdWRlcyB0aGUgZWxlbWVudCwgb3RoZXJ3aXNlIGBmYWxzZWBcclxuICovXHJcbmV4cG9ydCBsZXQgaW5jbHVkZXM7XHJcbmlmICh0cnVlICYmIHRydWUpIHtcclxuICAgIGZyb20gPSBnbG9iYWwuQXJyYXkuZnJvbTtcclxuICAgIG9mID0gZ2xvYmFsLkFycmF5Lm9mO1xyXG4gICAgY29weVdpdGhpbiA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKTtcclxuICAgIGZpbGwgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XHJcbiAgICBmaW5kID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbmQpO1xyXG4gICAgZmluZEluZGV4ID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvLyBJdCBpcyBvbmx5IG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaS9pT1MgdGhhdCBoYXZlIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24gYW5kIHNvIGFyZW4ndCBpbiB0aGUgd2lsZFxyXG4gICAgLy8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcclxuICAgICAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGcm9tIEVTNiA3LjEuNCBUb0ludGVnZXIoKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcclxuICAgICAqIEByZXR1cm4gQW4gaW50ZWdlclxyXG4gICAgICovXHJcbiAgICBjb25zdCB0b0ludGVnZXIgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAwIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKHZhbHVlID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBOb3JtYWxpemVzIGFuIG9mZnNldCBhZ2FpbnN0IGEgZ2l2ZW4gbGVuZ3RoLCB3cmFwcGluZyBpdCBpZiBuZWdhdGl2ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9yaWdpbmFsIG9mZnNldFxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgdG90YWwgbGVuZ3RoIHRvIG5vcm1hbGl6ZSBhZ2FpbnN0XHJcbiAgICAgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxyXG4gICAgICovXHJcbiAgICBjb25zdCBub3JtYWxpemVPZmZzZXQgPSBmdW5jdGlvbiBub3JtYWxpemVPZmZzZXQodmFsdWUsIGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLm1heChsZW5ndGggKyB2YWx1ZSwgMCkgOiBNYXRoLm1pbih2YWx1ZSwgbGVuZ3RoKTtcclxuICAgIH07XHJcbiAgICBmcm9tID0gZnVuY3Rpb24gZnJvbShhcnJheUxpa2UsIG1hcEZ1bmN0aW9uLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgaWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Zyb206IHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXBGdW5jdGlvbiAmJiB0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgIG1hcEZ1bmN0aW9uID0gbWFwRnVuY3Rpb24uYmluZCh0aGlzQXJnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICBjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdG9MZW5ndGgoYXJyYXlMaWtlLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBleHRlbnNpb25cclxuICAgICAgICBjb25zdCBhcnJheSA9IHR5cGVvZiBDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdChuZXcgQ29uc3RydWN0b3IobGVuZ3RoKSkgOiBuZXcgQXJyYXkobGVuZ3RoKTtcclxuICAgICAgICBpZiAoIWlzQXJyYXlMaWtlKGFycmF5TGlrZSkgJiYgIWlzSXRlcmFibGUoYXJyYXlMaWtlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgYW5kIHRoZSBub3JtYWxpemVkIGxlbmd0aCBpcyAwLCBqdXN0IHJldHVybiBhbiBlbXB0eSBhcnJheS4gdGhpcyBwcmV2ZW50cyBhIHByb2JsZW1cclxuICAgICAgICAvLyB3aXRoIHRoZSBpdGVyYXRpb24gb24gSUUgd2hlbiB1c2luZyBhIE5hTiBhcnJheSBsZW5ndGguXHJcbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGFycmF5TGlrZSkpIHtcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMaWtlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGFycmF5TGlrZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKHZhbHVlLCBpKSA6IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcnJheUxpa2UubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9O1xyXG4gICAgb2YgPSBmdW5jdGlvbiBvZiguLi5pdGVtcykge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcyk7XHJcbiAgICB9O1xyXG4gICAgY29weVdpdGhpbiA9IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LCBvZmZzZXQsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29weVdpdGhpbjogdGFyZ2V0IG11c3QgYmUgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgb2Zmc2V0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihvZmZzZXQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCksIGxlbmd0aCk7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gTWF0aC5taW4oZW5kIC0gc3RhcnQsIGxlbmd0aCAtIG9mZnNldCk7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgaWYgKG9mZnNldCA+IHN0YXJ0ICYmIG9mZnNldCA8IHN0YXJ0ICsgY291bnQpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgICAgIHN0YXJ0ICs9IGNvdW50IC0gMTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGNvdW50IC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRbb2Zmc2V0XSA9IHRhcmdldFtzdGFydF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGFyZ2V0W29mZnNldF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgc3RhcnQgKz0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBjb3VudC0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfTtcclxuICAgIGZpbGwgPSBmdW5jdGlvbiBmaWxsKHRhcmdldCwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBsZXQgaSA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xyXG4gICAgICAgIGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHdoaWxlIChpIDwgZW5kKSB7XHJcbiAgICAgICAgICAgIHRhcmdldFtpKytdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZmluZCA9IGZ1bmN0aW9uIGZpbmQodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmluZEluZGV4KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpO1xyXG4gICAgICAgIHJldHVybiBpbmRleCAhPT0gLTEgPyB0YXJnZXRbaW5kZXhdIDogdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIGZpbmRJbmRleCA9IGZ1bmN0aW9uIGZpbmRJbmRleCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmaW5kOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzQXJnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sodGFyZ2V0W2ldLCBpLCB0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9O1xyXG59XHJcbmlmICh0cnVlKSB7XHJcbiAgICBpbmNsdWRlcyA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgY29uc3QgdG9MZW5ndGggPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBNQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICBpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRhcmdldCwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4ID0gMCkge1xyXG4gICAgICAgIGxldCBsZW4gPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gZnJvbUluZGV4OyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJheS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vYXJyYXkubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9hcnJheS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiY29uc3QgZ2xvYmFsT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gZ2xvYmFsIHNwZWMgZGVmaW5lcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBjYWxsZWQgJ2dsb2JhbCdcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG4gICAgICAgIC8vIGBnbG9iYWxgIGlzIGFsc28gZGVmaW5lZCBpbiBOb2RlSlNcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gd2luZG93IGlzIGRlZmluZWQgaW4gYnJvd3NlcnNcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbn0pKCk7XG5leHBvcnQgZGVmYXVsdCBnbG9iYWxPYmplY3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nbG9iYWwubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL2dsb2JhbC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL2dsb2JhbC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0ICcuL1N5bWJvbCc7XG5pbXBvcnQgeyBISUdIX1NVUlJPR0FURV9NQVgsIEhJR0hfU1VSUk9HQVRFX01JTiB9IGZyb20gJy4vc3RyaW5nJztcbmNvbnN0IHN0YXRpY0RvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbi8qKlxuICogQSBjbGFzcyB0aGF0IF9zaGltc18gYW4gaXRlcmF0b3IgaW50ZXJmYWNlIG9uIGFycmF5IGxpa2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoaW1JdGVyYXRvciB7XG4gICAgY29uc3RydWN0b3IobGlzdCkge1xuICAgICAgICB0aGlzLl9uZXh0SW5kZXggPSAtMTtcbiAgICAgICAgaWYgKGlzSXRlcmFibGUobGlzdCkpIHtcbiAgICAgICAgICAgIHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gbGlzdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlSXRlcmF0b3IubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRpY0RvbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcbiAgICB9XG4gICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbi8qKlxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaGFzIGFuIEl0ZXJhYmxlIGludGVyZmFjZVxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xufVxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGl0ZXJhYmxlKSB7XG4gICAgaWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG4gICAgfVxufVxuLyoqXG4gKiBTaGltcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiBgZm9yIC4uLiBvZmAgYmxvY2tzXG4gKlxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBvYmplY3QgdGhlIHByb3ZpZGVzIGFuIGludGVyYXRvciBpbnRlcmZhY2VcbiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSBvZiB0aGUgaXRlcmFibGVcbiAqIEBwYXJhbSB0aGlzQXJnIE9wdGlvbmFsIHNjb3BlIHRvIHBhc3MgdGhlIGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JPZihpdGVyYWJsZSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBsZXQgYnJva2VuID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gZG9CcmVhaygpIHtcbiAgICAgICAgYnJva2VuID0gdHJ1ZTtcbiAgICB9XG4gICAgLyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cbiAgICBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpICYmIHR5cGVvZiBpdGVyYWJsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICBpZiAoaSArIDEgPCBsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+PSBISUdIX1NVUlJPR0FURV9NSU4gJiYgY29kZSA8PSBISUdIX1NVUlJPR0FURV9NQVgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhciArPSBpdGVyYWJsZVsrK2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY2hhciwgaXRlcmFibGUsIGRvQnJlYWspO1xuICAgICAgICAgICAgaWYgKGJyb2tlbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xuICAgICAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZXN1bHQudmFsdWUsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlcmF0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL2l0ZXJhdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vaXRlcmF0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuLyoqXG4gKiBUaGUgc21hbGxlc3QgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcmVwcmVzZW50YWJsZSBudW1iZXJzLlxuICovXG5leHBvcnQgY29uc3QgRVBTSUxPTiA9IDE7XG4vKipcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbi8qKlxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9TQUZFX0lOVEVHRVIgPSAtTUFYX1NBRkVfSU5URUdFUjtcbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgTmFOIHdpdGhvdXQgY29lcnNpb24uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIE5hTiwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc05hTih2YWx1ZSk7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNGaW5pdGUodmFsdWUpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXG4gKiAgIDIuIGl0IGhhcyBhIG9uZS10by1vbmUgbWFwcGluZyB0byBhIG1hdGhlbWF0aWNhbCBpbnRlZ2VyLCBtZWFuaW5nIGl0c1xuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmIE1hdGguYWJzKHZhbHVlKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9udW1iZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9udW1iZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vc3VwcG9ydC9oYXMnO1xyXG5pbXBvcnQgeyBpc1N5bWJvbCB9IGZyb20gJy4vU3ltYm9sJztcclxuZXhwb3J0IGxldCBhc3NpZ247XHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBvd24gcHJvcGVydHkgZGVzY3JpcHRvciBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdC5cclxuICogQW4gb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb25lIHRoYXQgaXMgZGVmaW5lZCBkaXJlY3RseSBvbiB0aGUgb2JqZWN0IGFuZCBpcyBub3RcclxuICogaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS5cclxuICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnR5LlxyXG4gKiBAcGFyYW0gcCBOYW1lIG9mIHRoZSBwcm9wZXJ0eS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC4gVGhlIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCBhcmUgdGhvc2UgdGhhdCBhcmUgZGVmaW5lZCBkaXJlY3RseVxyXG4gKiBvbiB0aGF0IG9iamVjdCwgYW5kIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS4gVGhlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGluY2x1ZGUgYm90aCBmaWVsZHMgKG9iamVjdHMpIGFuZCBmdW5jdGlvbnMuXHJcbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBvd24gcHJvcGVydGllcy5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlOYW1lcztcclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHN5bWJvbCBwcm9wZXJ0aWVzIGZvdW5kIGRpcmVjdGx5IG9uIG9iamVjdCBvLlxyXG4gKiBAcGFyYW0gbyBPYmplY3QgdG8gcmV0cmlldmUgdGhlIHN5bWJvbHMgZnJvbS5cclxuICovXHJcbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqIEBwYXJhbSB2YWx1ZTEgVGhlIGZpcnN0IHZhbHVlLlxyXG4gKiBAcGFyYW0gdmFsdWUyIFRoZSBzZWNvbmQgdmFsdWUuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGlzO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvZiBhbiBvYmplY3QuXHJcbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxyXG4gKi9cclxuZXhwb3J0IGxldCBrZXlzO1xyXG4vKiBFUzcgT2JqZWN0IHN0YXRpYyBtZXRob2RzICovXHJcbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcclxuZXhwb3J0IGxldCBlbnRyaWVzO1xyXG5leHBvcnQgbGV0IHZhbHVlcztcclxuaWYgKHRydWUpIHtcclxuICAgIGNvbnN0IGdsb2JhbE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XHJcbiAgICBhc3NpZ24gPSBnbG9iYWxPYmplY3QuYXNzaWduO1xyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcclxuICAgIGdldE93blByb3BlcnR5TmFtZXMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcclxuICAgIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbiAgICBpcyA9IGdsb2JhbE9iamVjdC5pcztcclxuICAgIGtleXMgPSBnbG9iYWxPYmplY3Qua2V5cztcclxufVxyXG5lbHNlIHtcclxuICAgIGtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobykge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5maWx0ZXIoKGtleSkgPT4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSk7XHJcbiAgICB9O1xyXG4gICAgYXNzaWduID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgLi4uc291cmNlcykge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRvID0gT2JqZWN0KHRhcmdldCk7XHJcbiAgICAgICAgc291cmNlcy5mb3JFYWNoKChuZXh0U291cmNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuZXh0U291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgICAgIGtleXMobmV4dFNvdXJjZSkuZm9yRWFjaCgobmV4dEtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRvO1xyXG4gICAgfTtcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKSB7XHJcbiAgICAgICAgaWYgKGlzU3ltYm9sKHByb3ApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xyXG4gICAgfTtcclxuICAgIGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGtleSkgPT4gQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKVxyXG4gICAgICAgICAgICAubWFwKChrZXkpID0+IFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSkpO1xyXG4gICAgfTtcclxuICAgIGlzID0gZnVuY3Rpb24gaXModmFsdWUxLCB2YWx1ZTIpIHtcclxuICAgICAgICBpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlMSAhPT0gMCB8fCAxIC8gdmFsdWUxID09PSAxIC8gdmFsdWUyOyAvLyAtMFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxyXG4gICAgfTtcclxufVxyXG5pZiAodHJ1ZSkge1xyXG4gICAgY29uc3QgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcclxuICAgIGVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcclxuICAgIHZhbHVlcyA9IGdsb2JhbE9iamVjdC52YWx1ZXM7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldE93blByb3BlcnR5TmFtZXMobykucmVkdWNlKChwcmV2aW91cywga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzW2tleV0gPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gICAgICAgIH0sIHt9KTtcclxuICAgIH07XHJcbiAgICBlbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IFtrZXksIG9ba2V5XV0pO1xyXG4gICAgfTtcclxuICAgIHZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IG9ba2V5XSk7XHJcbiAgICB9O1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9iamVjdC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vb2JqZWN0Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vb2JqZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcclxuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcclxuaW1wb3J0IHsgd3JhcE5hdGl2ZSB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01JTiA9IDB4ZDgwMDtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NSU4gPSAweGRjMDA7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IExPV19TVVJST0dBVEVfTUFYID0gMHhkZmZmO1xyXG4vKiBFUzYgc3RhdGljIG1ldGhvZHMgKi9cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgU3RyaW5nIHZhbHVlIHdob3NlIGVsZW1lbnRzIGFyZSwgaW4gb3JkZXIsIHRoZSBlbGVtZW50cyBpbiB0aGUgTGlzdCBlbGVtZW50cy5cclxuICogSWYgbGVuZ3RoIGlzIDAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXHJcbiAqIEBwYXJhbSBjb2RlUG9pbnRzIFRoZSBjb2RlIHBvaW50cyB0byBnZW5lcmF0ZSB0aGUgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgbGV0IGZyb21Db2RlUG9pbnQ7XHJcbi8qKlxyXG4gKiBgcmF3YCBpcyBpbnRlbmRlZCBmb3IgdXNlIGFzIGEgdGFnIGZ1bmN0aW9uIG9mIGEgVGFnZ2VkIFRlbXBsYXRlIFN0cmluZy4gV2hlbiBjYWxsZWRcclxuICogYXMgc3VjaCB0aGUgZmlyc3QgYXJndW1lbnQgd2lsbCBiZSBhIHdlbGwgZm9ybWVkIHRlbXBsYXRlIGNhbGwgc2l0ZSBvYmplY3QgYW5kIHRoZSByZXN0XHJcbiAqIHBhcmFtZXRlciB3aWxsIGNvbnRhaW4gdGhlIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB0ZW1wbGF0ZSBBIHdlbGwtZm9ybWVkIHRlbXBsYXRlIHN0cmluZyBjYWxsIHNpdGUgcmVwcmVzZW50YXRpb24uXHJcbiAqIEBwYXJhbSBzdWJzdGl0dXRpb25zIEEgc2V0IG9mIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHJhdztcclxuLyogRVM2IGluc3RhbmNlIG1ldGhvZHMgKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSBub25uZWdhdGl2ZSBpbnRlZ2VyIE51bWJlciBsZXNzIHRoYW4gMTExNDExMiAoMHgxMTAwMDApIHRoYXQgaXMgdGhlIGNvZGUgcG9pbnRcclxuICogdmFsdWUgb2YgdGhlIFVURi0xNiBlbmNvZGVkIGNvZGUgcG9pbnQgc3RhcnRpbmcgYXQgdGhlIHN0cmluZyBlbGVtZW50IGF0IHBvc2l0aW9uIHBvcyBpblxyXG4gKiB0aGUgU3RyaW5nIHJlc3VsdGluZyBmcm9tIGNvbnZlcnRpbmcgdGhpcyBvYmplY3QgdG8gYSBTdHJpbmcuXHJcbiAqIElmIHRoZXJlIGlzIG5vIGVsZW1lbnQgYXQgdGhhdCBwb3NpdGlvbiwgdGhlIHJlc3VsdCBpcyB1bmRlZmluZWQuXHJcbiAqIElmIGEgdmFsaWQgVVRGLTE2IHN1cnJvZ2F0ZSBwYWlyIGRvZXMgbm90IGJlZ2luIGF0IHBvcywgdGhlIHJlc3VsdCBpcyB0aGUgY29kZSB1bml0IGF0IHBvcy5cclxuICovXHJcbmV4cG9ydCBsZXQgY29kZVBvaW50QXQ7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNlcXVlbmNlIG9mIGVsZW1lbnRzIG9mIHNlYXJjaFN0cmluZyBjb252ZXJ0ZWQgdG8gYSBTdHJpbmcgaXMgdGhlXHJcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcclxuICogZW5kUG9zaXRpb24g4oCTIGxlbmd0aCh0aGlzKS4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXHJcbiAqL1xyXG5leHBvcnQgbGV0IGVuZHNXaXRoO1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHNlYXJjaFN0cmluZyBhcHBlYXJzIGFzIGEgc3Vic3RyaW5nIG9mIHRoZSByZXN1bHQgb2YgY29udmVydGluZyB0aGlzXHJcbiAqIG9iamVjdCB0byBhIFN0cmluZywgYXQgb25lIG9yIG1vcmUgcG9zaXRpb25zIHRoYXQgYXJlXHJcbiAqIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBwb3NpdGlvbjsgb3RoZXJ3aXNlLCByZXR1cm5zIGZhbHNlLlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXHJcbiAqIEBwYXJhbSBzZWFyY2hTdHJpbmcgc2VhcmNoIHN0cmluZ1xyXG4gKiBAcGFyYW0gcG9zaXRpb24gSWYgcG9zaXRpb24gaXMgdW5kZWZpbmVkLCAwIGlzIGFzc3VtZWQsIHNvIGFzIHRvIHNlYXJjaCBhbGwgb2YgdGhlIFN0cmluZy5cclxuICovXHJcbmV4cG9ydCBsZXQgaW5jbHVkZXM7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXHJcbiAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcclxuICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XHJcbiAqIGlzIFwiTkZDXCJcclxuICovXHJcbmV4cG9ydCBsZXQgbm9ybWFsaXplO1xyXG4vKipcclxuICogUmV0dXJucyBhIFN0cmluZyB2YWx1ZSB0aGF0IGlzIG1hZGUgZnJvbSBjb3VudCBjb3BpZXMgYXBwZW5kZWQgdG9nZXRoZXIuIElmIGNvdW50IGlzIDAsXHJcbiAqIFQgaXMgdGhlIGVtcHR5IFN0cmluZyBpcyByZXR1cm5lZC5cclxuICogQHBhcmFtIGNvdW50IG51bWJlciBvZiBjb3BpZXMgdG8gYXBwZW5kXHJcbiAqL1xyXG5leHBvcnQgbGV0IHJlcGVhdDtcclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcclxuICogc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50cyBvZiB0aGlzIG9iamVjdCAoY29udmVydGVkIHRvIGEgU3RyaW5nKSBzdGFydGluZyBhdFxyXG4gKiBwb3NpdGlvbi4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXHJcbiAqL1xyXG5leHBvcnQgbGV0IHN0YXJ0c1dpdGg7XHJcbi8qIEVTNyBpbnN0YW5jZSBtZXRob2RzICovXHJcbi8qKlxyXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxyXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIGVuZCAocmlnaHQpIG9mIHRoZSBjdXJyZW50IHN0cmluZy5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xyXG4gKiBAcGFyYW0gbWF4TGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBzdHJpbmcgb25jZSB0aGUgY3VycmVudCBzdHJpbmcgaGFzIGJlZW4gcGFkZGVkLlxyXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmaWxsU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFkIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoLlxyXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxyXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxyXG4gKi9cclxuZXhwb3J0IGxldCBwYWRFbmQ7XHJcbi8qKlxyXG4gKiBQYWRzIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoIGEgZ2l2ZW4gc3RyaW5nIChwb3NzaWJseSByZXBlYXRlZCkgc28gdGhhdCB0aGUgcmVzdWx0aW5nIHN0cmluZyByZWFjaGVzIGEgZ2l2ZW4gbGVuZ3RoLlxyXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIHN0YXJ0IChsZWZ0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcclxuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cclxuICogICAgICAgIElmIHRoaXMgcGFyYW1ldGVyIGlzIHNtYWxsZXIgdGhhbiB0aGUgY3VycmVudCBzdHJpbmcncyBsZW5ndGgsIHRoZSBjdXJyZW50IHN0cmluZyB3aWxsIGJlIHJldHVybmVkIGFzIGl0IGlzLlxyXG4gKlxyXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cclxuICogICAgICAgIElmIHRoaXMgc3RyaW5nIGlzIHRvbyBsb25nLCBpdCB3aWxsIGJlIHRydW5jYXRlZCBhbmQgdGhlIGxlZnQtbW9zdCBwYXJ0IHdpbGwgYmUgYXBwbGllZC5cclxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cclxuICovXHJcbmV4cG9ydCBsZXQgcGFkU3RhcnQ7XHJcbmlmICh0cnVlICYmIHRydWUpIHtcclxuICAgIGZyb21Db2RlUG9pbnQgPSBnbG9iYWwuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XHJcbiAgICByYXcgPSBnbG9iYWwuU3RyaW5nLnJhdztcclxuICAgIGNvZGVQb2ludEF0ID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdCk7XHJcbiAgICBlbmRzV2l0aCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgpO1xyXG4gICAgaW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKTtcclxuICAgIG5vcm1hbGl6ZSA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKTtcclxuICAgIHJlcGVhdCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucmVwZWF0KTtcclxuICAgIHN0YXJ0c1dpdGggPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBWYWxpZGF0ZXMgdGhhdCB0ZXh0IGlzIGRlZmluZWQsIGFuZCBub3JtYWxpemVzIHBvc2l0aW9uIChiYXNlZCBvbiB0aGUgZ2l2ZW4gZGVmYXVsdCBpZiB0aGUgaW5wdXQgaXMgTmFOKS5cclxuICAgICAqIFVzZWQgYnkgc3RhcnRzV2l0aCwgaW5jbHVkZXMsIGFuZCBlbmRzV2l0aC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIE5vcm1hbGl6ZWQgcG9zaXRpb24uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MgPSBmdW5jdGlvbiAobmFtZSwgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiwgaXNFbmQgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLicgKyBuYW1lICsgJyByZXF1aXJlcyBhIHZhbGlkIHN0cmluZyB0byBzZWFyY2ggYWdhaW5zdC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xyXG4gICAgICAgIHJldHVybiBbdGV4dCwgU3RyaW5nKHNlYXJjaCksIE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9uLCAwKSwgbGVuZ3RoKV07XHJcbiAgICB9O1xyXG4gICAgZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cykge1xyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcuZnJvbUNvZGVQb2ludFxyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xyXG4gICAgICAgIGNvbnN0IE1BWF9TSVpFID0gMHg0MDAwO1xyXG4gICAgICAgIGxldCBjb2RlVW5pdHMgPSBbXTtcclxuICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcclxuICAgICAgICAgICAgLy8gQ29kZSBwb2ludHMgbXVzdCBiZSBmaW5pdGUgaW50ZWdlcnMgd2l0aGluIHRoZSB2YWxpZCByYW5nZVxyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGlzRmluaXRlKGNvZGVQb2ludCkgJiYgTWF0aC5mbG9vcihjb2RlUG9pbnQpID09PSBjb2RlUG9pbnQgJiYgY29kZVBvaW50ID49IDAgJiYgY29kZVBvaW50IDw9IDB4MTBmZmZmO1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3N0cmluZy5mcm9tQ29kZVBvaW50OiBJbnZhbGlkIGNvZGUgcG9pbnQgJyArIGNvZGVQb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcclxuICAgICAgICAgICAgICAgIC8vIEJNUCBjb2RlIHBvaW50XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQXN0cmFsIGNvZGUgcG9pbnQ7IHNwbGl0IGluIHN1cnJvZ2F0ZSBoYWx2ZXNcclxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxyXG4gICAgICAgICAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgSElHSF9TVVJST0dBVEVfTUlOO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgTE9XX1NVUlJPR0FURV9NSU47XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgcmF3ID0gZnVuY3Rpb24gcmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKSB7XHJcbiAgICAgICAgbGV0IHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIGxldCBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGNhbGxTaXRlID09IG51bGwgfHwgY2FsbFNpdGUucmF3ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSByYXdTdHJpbmdzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGggLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBjb2RlUG9pbnRBdCA9IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHRleHQsIHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuY29kZVBvaW50QXQgcmVxdXJpZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiAhPT0gcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBHZXQgdGhlIGZpcnN0IGNvZGUgdW5pdFxyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcclxuICAgICAgICBpZiAoZmlyc3QgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IEhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcclxuICAgICAgICAgICAgLy8gU3RhcnQgb2YgYSBzdXJyb2dhdGUgcGFpciAoaGlnaCBzdXJyb2dhdGUgYW5kIHRoZXJlIGlzIGEgbmV4dCBjb2RlIHVuaXQpOyBjaGVjayBmb3IgbG93IHN1cnJvZ2F0ZVxyXG4gICAgICAgICAgICAvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XHJcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gTE9XX1NVUlJPR0FURV9NSU4gJiYgc2Vjb25kIDw9IExPV19TVVJST0dBVEVfTUFYKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZpcnN0IC0gSElHSF9TVVJST0dBVEVfTUlOKSAqIDB4NDAwICsgc2Vjb25kIC0gTE9XX1NVUlJPR0FURV9NSU4gKyAweDEwMDAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaXJzdDtcclxuICAgIH07XHJcbiAgICBlbmRzV2l0aCA9IGZ1bmN0aW9uIGVuZHNXaXRoKHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24pIHtcclxuICAgICAgICBpZiAoZW5kUG9zaXRpb24gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBbdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdlbmRzV2l0aCcsIHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24sIHRydWUpO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gZW5kUG9zaXRpb24gLSBzZWFyY2gubGVuZ3RoO1xyXG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShzdGFydCwgZW5kUG9zaXRpb24pID09PSBzZWFyY2g7XHJcbiAgICB9O1xyXG4gICAgaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgIFt0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2luY2x1ZGVzJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuaW5kZXhPZihzZWFyY2gsIHBvc2l0aW9uKSAhPT0gLTE7XHJcbiAgICB9O1xyXG4gICAgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHRleHQsIGNvdW50ID0gMCkge1xyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLnJlcGVhdFxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvdW50ICE9PSBjb3VudCkge1xyXG4gICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlIChjb3VudCkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgJSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnQgPj49IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgc3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dCwgc2VhcmNoLCBwb3NpdGlvbiA9IDApIHtcclxuICAgICAgICBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoKTtcclxuICAgICAgICBbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdzdGFydHNXaXRoJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgZW5kID0gcG9zaXRpb24gKyBzZWFyY2gubGVuZ3RoO1xyXG4gICAgICAgIGlmIChlbmQgPiB0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKHBvc2l0aW9uLCBlbmQpID09PSBzZWFyY2g7XHJcbiAgICB9O1xyXG59XHJcbmlmICh0cnVlKSB7XHJcbiAgICBwYWRFbmQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLnBhZEVuZCk7XHJcbiAgICBwYWRTdGFydCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgcGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZyA9ICcgJykge1xyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZEVuZCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICBjb25zdCBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgKz1cclxuICAgICAgICAgICAgICAgIHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJUZXh0O1xyXG4gICAgfTtcclxuICAgIHBhZFN0YXJ0ID0gZnVuY3Rpb24gcGFkU3RhcnQodGV4dCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nID0gJyAnKSB7XHJcbiAgICAgICAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkU3RhcnQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHN0clRleHQgPSBTdHJpbmcodGV4dCk7XHJcbiAgICAgICAgY29uc3QgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWRkaW5nID4gMCkge1xyXG4gICAgICAgICAgICBzdHJUZXh0ID1cclxuICAgICAgICAgICAgICAgIHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCkgK1xyXG4gICAgICAgICAgICAgICAgICAgIHN0clRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJUZXh0O1xyXG4gICAgfTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJpbmcubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N0cmluZy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N0cmluZy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IGhhcywgeyBhZGQgfSBmcm9tICcuLi8uLi9oYXMvaGFzJztcclxuaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xyXG5leHBvcnQgZGVmYXVsdCBoYXM7XHJcbmV4cG9ydCAqIGZyb20gJy4uLy4uL2hhcy9oYXMnO1xyXG4vKiBFQ01BU2NyaXB0IDYgYW5kIDcgRmVhdHVyZXMgKi9cclxuLyogQXJyYXkgKi9cclxuYWRkKCdlczYtYXJyYXknLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gKFsnZnJvbScsICdvZiddLmV2ZXJ5KChrZXkpID0+IGtleSBpbiBnbG9iYWwuQXJyYXkpICYmXHJcbiAgICAgICAgWydmaW5kSW5kZXgnLCAnZmluZCcsICdjb3B5V2l0aGluJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpKTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZXM2LWFycmF5LWZpbGwnLCAoKSA9PiB7XHJcbiAgICBpZiAoJ2ZpbGwnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpIHtcclxuICAgICAgICAvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gWzFdLmZpbGwoOSwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKVswXSA9PT0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZXM3LWFycmF5JywgKCkgPT4gJ2luY2x1ZGVzJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlLCB0cnVlKTtcclxuLyogTWFwICovXHJcbmFkZCgnZXM2LW1hcCcsICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsLk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8qXHJcbiAgICBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5XHJcbiAgICBXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxyXG4gICAgdGFrZSBhcmd1bWVudHMgKGlPUyA4LjQpXHJcbiAgICAgKi9cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLk1hcChbWzAsIDFdXSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXAuaGFzKDApICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIHRydWUgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAudmFsdWVzID09PSAnZnVuY3Rpb24nICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmVudHJpZXMgPT09ICdmdW5jdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogTWF0aCAqL1xyXG5hZGQoJ2VzNi1tYXRoJywgKCkgPT4ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICAnY2x6MzInLFxyXG4gICAgICAgICdzaWduJyxcclxuICAgICAgICAnbG9nMTAnLFxyXG4gICAgICAgICdsb2cyJyxcclxuICAgICAgICAnbG9nMXAnLFxyXG4gICAgICAgICdleHBtMScsXHJcbiAgICAgICAgJ2Nvc2gnLFxyXG4gICAgICAgICdzaW5oJyxcclxuICAgICAgICAndGFuaCcsXHJcbiAgICAgICAgJ2Fjb3NoJyxcclxuICAgICAgICAnYXNpbmgnLFxyXG4gICAgICAgICdhdGFuaCcsXHJcbiAgICAgICAgJ3RydW5jJyxcclxuICAgICAgICAnZnJvdW5kJyxcclxuICAgICAgICAnY2JydCcsXHJcbiAgICAgICAgJ2h5cG90J1xyXG4gICAgXS5ldmVyeSgobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5NYXRoW25hbWVdID09PSAnZnVuY3Rpb24nKTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZXM2LW1hdGgtaW11bCcsICgpID0+IHtcclxuICAgIGlmICgnaW11bCcgaW4gZ2xvYmFsLk1hdGgpIHtcclxuICAgICAgICAvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBvbiBpb3MgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXHJcbiAgICAgICAgcmV0dXJuIE1hdGguaW11bCgweGZmZmZmZmZmLCA1KSA9PT0gLTU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBPYmplY3QgKi9cclxuYWRkKCdlczYtb2JqZWN0JywgKCkgPT4ge1xyXG4gICAgcmV0dXJuIHRydWUgJiZcclxuICAgICAgICBbJ2Fzc2lnbicsICdpcycsICdnZXRPd25Qcm9wZXJ0eVN5bWJvbHMnLCAnc2V0UHJvdG90eXBlT2YnXS5ldmVyeSgobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbicpO1xyXG59LCB0cnVlKTtcclxuYWRkKCdlczIwMTctb2JqZWN0JywgKCkgPT4ge1xyXG4gICAgcmV0dXJuIFsndmFsdWVzJywgJ2VudHJpZXMnLCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyddLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XHJcbn0sIHRydWUpO1xyXG4vKiBPYnNlcnZhYmxlICovXHJcbmFkZCgnZXMtb2JzZXJ2YWJsZScsICgpID0+IHR5cGVvZiBnbG9iYWwuT2JzZXJ2YWJsZSAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xyXG4vKiBQcm9taXNlICovXHJcbmFkZCgnZXM2LXByb21pc2UnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIHRydWUsIHRydWUpO1xyXG4vKiBTZXQgKi9cclxuYWRkKCdlczYtc2V0JywgKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwuU2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBTZXQgZnVuY3Rpb25hbGl0eSAqL1xyXG4gICAgICAgIGNvbnN0IHNldCA9IG5ldyBnbG9iYWwuU2V0KFsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIFN0cmluZyAqL1xyXG5hZGQoJ2VzNi1zdHJpbmcnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gKFtcclxuICAgICAgICAvKiBzdGF0aWMgbWV0aG9kcyAqL1xyXG4gICAgICAgICdmcm9tQ29kZVBvaW50J1xyXG4gICAgXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nKSAmJlxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLyogaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4gICAgICAgICAgICAnY29kZVBvaW50QXQnLFxyXG4gICAgICAgICAgICAnbm9ybWFsaXplJyxcclxuICAgICAgICAgICAgJ3JlcGVhdCcsXHJcbiAgICAgICAgICAgICdzdGFydHNXaXRoJyxcclxuICAgICAgICAgICAgJ2VuZHNXaXRoJyxcclxuICAgICAgICAgICAgJ2luY2x1ZGVzJ1xyXG4gICAgICAgIF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpKTtcclxufSwgdHJ1ZSk7XHJcbmFkZCgnZXM2LXN0cmluZy1yYXcnLCAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFsuLi5jYWxsU2l0ZV07XHJcbiAgICAgICAgcmVzdWx0LnJhdyA9IGNhbGxTaXRlLnJhdztcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgaWYgKCdyYXcnIGluIGdsb2JhbC5TdHJpbmcpIHtcclxuICAgICAgICBsZXQgYiA9IDE7XHJcbiAgICAgICAgbGV0IGNhbGxTaXRlID0gZ2V0Q2FsbFNpdGUgYGFcXG4ke2J9YDtcclxuICAgICAgICBjYWxsU2l0ZS5yYXcgPSBbJ2FcXFxcbiddO1xyXG4gICAgICAgIGNvbnN0IHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWwuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XHJcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzVHJ1bmM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5hZGQoJ2VzMjAxNy1zdHJpbmcnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJyk7XHJcbn0sIHRydWUpO1xyXG4vKiBTeW1ib2wgKi9cclxuYWRkKCdlczYtc3ltYm9sJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCcsIHRydWUpO1xyXG4vKiBXZWFrTWFwICovXHJcbmFkZCgnZXM2LXdlYWttYXAnLCAoKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHkgKi9cclxuICAgICAgICBjb25zdCBrZXkxID0ge307XHJcbiAgICAgICAgY29uc3Qga2V5MiA9IHt9O1xyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuV2Vha01hcChbW2tleTEsIDFdXSk7XHJcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShrZXkxKTtcclxuICAgICAgICByZXR1cm4gbWFwLmdldChrZXkxKSA9PT0gMSAmJiBtYXAuc2V0KGtleTIsIDIpID09PSBtYXAgJiYgdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE1pc2NlbGxhbmVvdXMgZmVhdHVyZXMgKi9cclxuYWRkKCdtaWNyb3Rhc2tzJywgKCkgPT4gdHJ1ZSB8fCBmYWxzZSB8fCB0cnVlLCB0cnVlKTtcclxuYWRkKCdwb3N0bWVzc2FnZScsICgpID0+IHtcclxuICAgIC8vIElmIHdpbmRvdyBpcyB1bmRlZmluZWQsIGFuZCB3ZSBoYXZlIHBvc3RNZXNzYWdlLCBpdCBwcm9iYWJseSBtZWFucyB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIuIFdlYiB3b3JrZXJzIGhhdmVcclxuICAgIC8vIHBvc3QgbWVzc2FnZSBidXQgaXQgZG9lc24ndCB3b3JrIGhvdyB3ZSBleHBlY3QgaXQgdG8sIHNvIGl0J3MgYmVzdCBqdXN0IHRvIHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cclxuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsLndpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGdsb2JhbC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcclxufSwgdHJ1ZSk7XHJcbmFkZCgncmFmJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicsIHRydWUpO1xyXG5hZGQoJ3NldGltbWVkaWF0ZScsICgpID0+IHR5cGVvZiBnbG9iYWwuc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XHJcbi8qIERPTSBGZWF0dXJlcyAqL1xyXG5hZGQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJywgKCkgPT4ge1xyXG4gICAgaWYgKHRydWUgJiYgQm9vbGVhbihnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcikpIHtcclxuICAgICAgICAvLyBJRTExIGhhcyBhbiB1bnJlbGlhYmxlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gd2hlcmUgc2V0UHJvcGVydHkoKSBkb2VzIG5vdFxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGEgbXV0YXRpb24gZXZlbnQsIG9ic2VydmVycyBjYW4gY3Jhc2gsIGFuZCB0aGUgcXVldWUgZG9lcyBub3QgZHJhaW5cclxuICAgICAgICAvLyByZWxpYWJseS4gVGhlIGZvbGxvd2luZyBmZWF0dXJlIHRlc3Qgd2FzIGFkYXB0ZWQgZnJvbVxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3QxMGtvLzRhY2ViOGM3MTY4MWZkYjI3NWUzM2VmZTVlNTc2YjE0XHJcbiAgICAgICAgY29uc3QgZXhhbXBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgY29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGV4YW1wbGUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbihvYnNlcnZlci50YWtlUmVjb3JkcygpLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5hZGQoJ2RvbS13ZWJhbmltYXRpb24nLCAoKSA9PiB0cnVlICYmIGdsb2JhbC5BbmltYXRpb24gIT09IHVuZGVmaW5lZCAmJiBnbG9iYWwuS2V5ZnJhbWVFZmZlY3QgIT09IHVuZGVmaW5lZCwgdHJ1ZSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhcy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3NoaW0vc3VwcG9ydC9oYXMubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9zdXBwb3J0L2hhcy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9nbG9iYWwnO1xyXG5pbXBvcnQgaGFzIGZyb20gJy4vaGFzJztcclxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbSkge1xyXG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaXRlbS5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChkZXN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmxldCBjaGVja01pY3JvVGFza1F1ZXVlO1xyXG5sZXQgbWljcm9UYXNrcztcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydCBjb25zdCBxdWV1ZVRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGRlc3RydWN0b3I7XHJcbiAgICBsZXQgZW5xdWV1ZTtcclxuICAgIC8vIFNpbmNlIHRoZSBJRSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0SW1tZWRpYXRlYCBpcyBub3QgZmxhd2xlc3MsIHdlIHdpbGwgdGVzdCBmb3IgYHBvc3RNZXNzYWdlYCBmaXJzdC5cclxuICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgcXVldWUgPSBbXTtcclxuICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAvLyBDb25maXJtIHRoYXQgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBieSB0aGlzIHBhcnRpY3VsYXIgaW1wbGVtZW50YXRpb24uXHJcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2socXVldWUuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcXVldWUucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKCdkb2pvLXF1ZXVlLW1lc3NhZ2UnLCAnKicpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRJbW1lZGlhdGUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJUaW1lb3V0O1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHtcclxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgaWQgPSBlbnF1ZXVlKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBkZXN0cnVjdG9yICYmXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RydWN0b3IoaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxyXG4gICAgcmV0dXJuIHRydWVcclxuICAgICAgICA/IHF1ZXVlVGFza1xyXG4gICAgICAgIDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlVGFzayhjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuLy8gV2hlbiBubyBtZWNoYW5pc20gZm9yIHJlZ2lzdGVyaW5nIG1pY3JvdGFza3MgaXMgZXhwb3NlZCBieSB0aGUgZW52aXJvbm1lbnQsIG1pY3JvdGFza3Mgd2lsbFxyXG4vLyBiZSBxdWV1ZWQgYW5kIHRoZW4gZXhlY3V0ZWQgaW4gYSBzaW5nbGUgbWFjcm90YXNrIGJlZm9yZSB0aGUgb3RoZXIgbWFjcm90YXNrcyBhcmUgZXhlY3V0ZWQuXHJcbmlmICghdHJ1ZSkge1xyXG4gICAgbGV0IGlzTWljcm9UYXNrUXVldWVkID0gZmFsc2U7XHJcbiAgICBtaWNyb1Rhc2tzID0gW107XHJcbiAgICBjaGVja01pY3JvVGFza1F1ZXVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghaXNNaWNyb1Rhc2tRdWV1ZWQpIHtcclxuICAgICAgICAgICAgaXNNaWNyb1Rhc2tRdWV1ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBxdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaXNNaWNyb1Rhc2tRdWV1ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChtaWNyb1Rhc2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgoaXRlbSA9IG1pY3JvVGFza3Muc2hpZnQoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2soaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYW4gYW5pbWF0aW9uIHRhc2sgd2l0aCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgaXQgZXhpc3RzLCBvciB3aXRoIGBxdWV1ZVRhc2tgIG90aGVyd2lzZS5cclxuICpcclxuICogU2luY2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lJ3MgYmVoYXZpb3IgZG9lcyBub3QgbWF0Y2ggdGhhdCBleHBlY3RlZCBmcm9tIGBxdWV1ZVRhc2tgLCBpdCBpcyBub3QgdXNlZCB0aGVyZS5cclxuICogSG93ZXZlciwgYXQgdGltZXMgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byBkZWxlZ2F0ZSB0byByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGhlbmNlIHRoZSBmb2xsb3dpbmcgbWV0aG9kLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXHJcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcXVldWVBbmltYXRpb25UYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBxdWV1ZVRhc2s7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICByZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cclxuICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgPyBxdWV1ZUFuaW1hdGlvblRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxyXG4gKlxyXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXHJcbiAqIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtYWNyb3Rhc2tzIGlzIGV4cG9zZWQsIHRoZW4gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGZpcmVkIGJlZm9yZSBhbnkgbWFjcm90YXNrXHJcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0IGxldCBxdWV1ZU1pY3JvVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZW5xdWV1ZTtcclxuICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWwucHJvY2Vzcy5uZXh0VGljayhleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHJ1ZSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWwuUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZXhlY3V0ZVRhc2spO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0cnVlKSB7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICBjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBxdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIG1pY3JvVGFza3MucHVzaChpdGVtKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xyXG4gICAgfTtcclxufSkoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N1cHBvcnQvcXVldWUubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvc2hpbS9zdXBwb3J0L3F1ZXVlLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHZhbHVlIHByb3BlcnR5IGRlc2NyaXB0b3JcbiAqXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXG4gKiBAcGFyYW0gZW51bWVyYWJsZSAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZW51bWJlcmFibGUsIGRlZmF1bHRzIHRvIGZhbHNlXG4gKiBAcGFyYW0gd3JpdGFibGUgICAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgd3JpdGFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEByZXR1cm4gICAgICAgICAgICAgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUsIGVudW1lcmFibGUgPSBmYWxzZSwgd3JpdGFibGUgPSB0cnVlLCBjb25maWd1cmFibGUgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxuICAgICAgICB3cml0YWJsZTogd3JpdGFibGUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N1cHBvcnQvdXRpbC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay9zaGltL3N1cHBvcnQvdXRpbC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJy4uL2NvcmUvRXZlbnRlZCc7XG5leHBvcnQgY2xhc3MgSW5qZWN0b3IgZXh0ZW5kcyBFdmVudGVkIHtcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbiAgICBzZXRJbnZhbGlkYXRvcihpbnZhbGlkYXRvcikge1xuICAgICAgICB0aGlzLl9pbnZhbGlkYXRvciA9IGludmFsaWRhdG9yO1xuICAgIH1cbiAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXlsb2FkO1xuICAgIH1cbiAgICBzZXQocGF5bG9hZCkge1xuICAgICAgICB0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgaWYgKHRoaXMuX2ludmFsaWRhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnZhbGlkYXRvcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0b3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1JbmplY3Rvci5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL0luamVjdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL0luamVjdG9yLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnLi4vY29yZS9FdmVudGVkJztcclxuaW1wb3J0IE1hcCBmcm9tICcuLi9zaGltL01hcCc7XHJcbi8qKlxyXG4gKiBFbnVtIHRvIGlkZW50aWZ5IHRoZSB0eXBlIG9mIGV2ZW50LlxyXG4gKiBMaXN0ZW5pbmcgdG8gJ1Byb2plY3Rvcicgd2lsbCBub3RpZnkgd2hlbiBwcm9qZWN0b3IgaXMgY3JlYXRlZCBvciB1cGRhdGVkXHJcbiAqIExpc3RlbmluZyB0byAnV2lkZ2V0JyB3aWxsIG5vdGlmeSB3aGVuIHdpZGdldCByb290IGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxyXG4gKi9cclxuZXhwb3J0IHZhciBOb2RlRXZlbnRUeXBlO1xyXG4oZnVuY3Rpb24gKE5vZGVFdmVudFR5cGUpIHtcclxuICAgIE5vZGVFdmVudFR5cGVbXCJQcm9qZWN0b3JcIl0gPSBcIlByb2plY3RvclwiO1xyXG4gICAgTm9kZUV2ZW50VHlwZVtcIldpZGdldFwiXSA9IFwiV2lkZ2V0XCI7XHJcbn0pKE5vZGVFdmVudFR5cGUgfHwgKE5vZGVFdmVudFR5cGUgPSB7fSkpO1xyXG5leHBvcnQgY2xhc3MgTm9kZUhhbmRsZXIgZXh0ZW5kcyBFdmVudGVkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgdGhpcy5fbm9kZU1hcCA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIGdldChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU1hcC5nZXQoa2V5KTtcclxuICAgIH1cclxuICAgIGhhcyhrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU1hcC5oYXMoa2V5KTtcclxuICAgIH1cclxuICAgIGFkZChlbGVtZW50LCBrZXkpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLnNldChrZXksIGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IGtleSB9KTtcclxuICAgIH1cclxuICAgIGFkZFJvb3QoKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5XaWRnZXQgfSk7XHJcbiAgICB9XHJcbiAgICBhZGRQcm9qZWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTm9kZUhhbmRsZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vZGVIYW5kbGVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBQcm9taXNlIGZyb20gJy4uL3NoaW0vUHJvbWlzZSc7XHJcbmltcG9ydCBNYXAgZnJvbSAnLi4vc2hpbS9NYXAnO1xyXG5pbXBvcnQgU3ltYm9sIGZyb20gJy4uL3NoaW0vU3ltYm9sJztcclxuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJy4uL2NvcmUvRXZlbnRlZCc7XHJcbi8qKlxyXG4gKiBXaWRnZXQgYmFzZSBzeW1ib2wgdHlwZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFdJREdFVF9CQVNFX1RZUEUgPSBTeW1ib2woJ1dpZGdldCBCYXNlJyk7XHJcbi8qKlxyXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pIHtcclxuICAgIHJldHVybiBCb29sZWFuKGl0ZW0gJiYgaXRlbS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0KGl0ZW0pIHtcclxuICAgIHJldHVybiBCb29sZWFuKGl0ZW0gJiZcclxuICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KCdfX2VzTW9kdWxlJykgJiZcclxuICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykgJiZcclxuICAgICAgICBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtLmRlZmF1bHQpKTtcclxufVxyXG4vKipcclxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVnaXN0cnkgZXh0ZW5kcyBFdmVudGVkIHtcclxuICAgIC8qKlxyXG4gICAgICogRW1pdCBsb2FkZWQgZXZlbnQgZm9yIHJlZ2lzdHJ5IGxhYmVsXHJcbiAgICAgKi9cclxuICAgIGVtaXRMb2FkZWRFdmVudCh3aWRnZXRMYWJlbCwgaXRlbSkge1xyXG4gICAgICAgIHRoaXMuZW1pdCh7XHJcbiAgICAgICAgICAgIHR5cGU6IHdpZGdldExhYmVsLFxyXG4gICAgICAgICAgICBhY3Rpb246ICdsb2FkZWQnLFxyXG4gICAgICAgICAgICBpdGVtXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkZWZpbmUobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB3aWRnZXQgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgaXRlbS50aGVuKCh3aWRnZXRDdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldEN0b3I7XHJcbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yRmFjdG9yeSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9IG5ldyBNYXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGluamVjdG9yIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJyR7bGFiZWwudG9TdHJpbmcoKX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGludmFsaWRhdG9yID0gbmV3IEV2ZW50ZWQoKTtcclxuICAgICAgICBjb25zdCBpbmplY3Rvckl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGluamVjdG9yOiBpbmplY3RvckZhY3RvcnkoKCkgPT4gaW52YWxpZGF0b3IuZW1pdCh7IHR5cGU6ICdpbnZhbGlkYXRlJyB9KSksXHJcbiAgICAgICAgICAgIGludmFsaWRhdG9yXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LnNldChsYWJlbCwgaW5qZWN0b3JJdGVtKTtcclxuICAgICAgICB0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaW5qZWN0b3JJdGVtKTtcclxuICAgIH1cclxuICAgIGdldChsYWJlbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fd2lkZ2V0UmVnaXN0cnkgfHwgIXRoaXMuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmdldChsYWJlbCk7XHJcbiAgICAgICAgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBpdGVtKCk7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oKHdpZGdldEN0b3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0KHdpZGdldEN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdpZGdldEN0b3I7XHJcbiAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgZ2V0SW5qZWN0b3IobGFiZWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2luamVjdG9yUmVnaXN0cnkgfHwgIXRoaXMuaGFzSW5qZWN0b3IobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgfVxyXG4gICAgaGFzKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5fd2lkZ2V0UmVnaXN0cnkgJiYgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9XHJcbiAgICBoYXNJbmplY3RvcihsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuX2luamVjdG9yUmVnaXN0cnkgJiYgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVnaXN0cnkubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9SZWdpc3RyeS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9SZWdpc3RyeS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vc2hpbS9NYXAnO1xyXG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnLi4vY29yZS9FdmVudGVkJztcclxuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuL1JlZ2lzdHJ5JztcclxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5SGFuZGxlciBleHRlbmRzIEV2ZW50ZWQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcclxuICAgICAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub3duKHsgZGVzdHJveSB9KTtcclxuICAgIH1cclxuICAgIHNldCBiYXNlKGJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJhc2VSZWdpc3RyeSA9IGJhc2VSZWdpc3RyeTtcclxuICAgIH1cclxuICAgIGRlZmluZShsYWJlbCwgd2lkZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xyXG4gICAgfVxyXG4gICAgZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcclxuICAgIH1cclxuICAgIGhhcyhsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9XHJcbiAgICBoYXNJbmplY3RvcihsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xyXG4gICAgfVxyXG4gICAgZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XHJcbiAgICB9XHJcbiAgICBnZXRJbmplY3RvcihsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcclxuICAgIH1cclxuICAgIF9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsIGdldEZ1bmN0aW9uTmFtZSwgbGFiZWxNYXApIHtcclxuICAgICAgICBjb25zdCByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gcmVnaXN0cmllc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFyZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xyXG4gICAgICAgICAgICBjb25zdCByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZ2lzdGVyZWRMYWJlbHMuaW5kZXhPZihsYWJlbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSByZWdpc3RyeS5vbihsYWJlbCwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ2xvYWRlZCcgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgbGFiZWxNYXAuc2V0KHJlZ2lzdHJ5LCBbLi4ucmVnaXN0ZXJlZExhYmVscywgbGFiZWxdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeUhhbmRsZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJlZ2lzdHJ5SGFuZGxlci5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL1JlZ2lzdHJ5SGFuZGxlci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBNYXAgZnJvbSAnLi4vc2hpbS9NYXAnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLi4vc2hpbS9XZWFrTWFwJztcbmltcG9ydCBTeW1ib2wgZnJvbSAnLi4vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBhdXRvIH0gZnJvbSAnLi9kaWZmJztcbmltcG9ydCBSZWdpc3RyeUhhbmRsZXIgZnJvbSAnLi9SZWdpc3RyeUhhbmRsZXInO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IHsgd2lkZ2V0SW5zdGFuY2VNYXAgfSBmcm9tICcuL3Zkb20nO1xuaW1wb3J0IHsgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmNvbnN0IGRlY29yYXRvck1hcCA9IG5ldyBNYXAoKTtcbmNvbnN0IGJvdW5kQXV0byA9IGF1dG8uYmluZChudWxsKTtcbmV4cG9ydCBjb25zdCBub0JpbmQgPSBTeW1ib2wuZm9yKCdkb2pvTm9CaW5kJyk7XG4vKipcbiAqIE1haW4gd2lkZ2V0IGJhc2UgZm9yIGFsbCB3aWRnZXRzIHRvIGV4dGVuZFxuICovXG5leHBvcnQgY2xhc3MgV2lkZ2V0QmFzZSB7XG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgaXQgaXMgdGhlIGluaXRpYWwgc2V0IHByb3BlcnRpZXMgY3ljbGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFycmF5IG9mIHByb3BlcnR5IGtleXMgY29uc2lkZXJlZCBjaGFuZ2VkIGZyb20gdGhlIHByZXZpb3VzIHNldCBwcm9wZXJ0aWVzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuX2hhbmRsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYm91bmRJbnZhbGlkYXRlID0gdGhpcy5pbnZhbGlkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHdpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XG4gICAgICAgICAgICBkaXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgIG9uQXR0YWNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkF0dGFjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGV0YWNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkRldGFjaCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcbiAgICAgICAgICAgIHJlZ2lzdHJ5OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29yZVByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgcmVuZGVyaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGlucHV0UHJvcGVydGllczoge31cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk7XG4gICAgfVxuICAgIG1ldGEoTWV0YVR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2FjaGVkID0gdGhpcy5fbWV0YU1hcC5nZXQoTWV0YVR5cGUpO1xuICAgICAgICBpZiAoIWNhY2hlZCkge1xuICAgICAgICAgICAgY2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcbiAgICAgICAgICAgICAgICBpbnZhbGlkYXRlOiB0aGlzLl9ib3VuZEludmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxuICAgICAgICAgICAgICAgIGJpbmQ6IHRoaXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5vd24oY2FjaGVkKTtcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuc2V0KE1ldGFUeXBlLCBjYWNoZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWNoZWQ7XG4gICAgfVxuICAgIG9uQXR0YWNoKCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gICAgfVxuICAgIG9uRGV0YWNoKCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gICAgfVxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG4gICAgZ2V0IGNoYW5nZWRQcm9wZXJ0eUtleXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5c107XG4gICAgfVxuICAgIF9fc2V0Q29yZVByb3BlcnRpZXNfXyhjb3JlUHJvcGVydGllcykge1xuICAgICAgICBjb25zdCB7IGJhc2VSZWdpc3RyeSB9ID0gY29yZVByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmJhc2UgPSBiYXNlUmVnaXN0cnk7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMgPSBjb3JlUHJvcGVydGllcztcbiAgICB9XG4gICAgX19zZXRQcm9wZXJ0aWVzX18ob3JpZ2luYWxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcbiAgICAgICAgaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyA9IG9yaWdpbmFsUHJvcGVydGllcztcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknKTtcbiAgICAgICAgY29uc3QgY2hhbmdlZFByb3BlcnR5S2V5cyA9IFtdO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG4gICAgICAgIGlmICh0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9PT0gZmFsc2UgfHwgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgYWxsUHJvcGVydGllcyA9IFsuLi5wcm9wZXJ0eU5hbWVzLCAuLi5PYmplY3Qua2V5cyh0aGlzLl9wcm9wZXJ0aWVzKV07XG4gICAgICAgICAgICBjb25zdCBjaGVja2VkUHJvcGVydGllcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZGlmZlByb3BlcnR5UmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgbGV0IHJ1blJlYWN0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gYWxsUHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2tlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUHJvcGVydHkgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UHJvcGVydHkgPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVuUmVhY3Rpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZkZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGlmZkZ1bmN0aW9uc1tpXShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGJvdW5kQXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1blJlYWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWN0aW9uRnVuY3Rpb25zID0gdGhpcy5nZXREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4ZWN1dGVkUmVhY3Rpb25zID0gW107XG4gICAgICAgICAgICAgICAgcmVhY3Rpb25GdW5jdGlvbnMuZm9yRWFjaCgoeyByZWFjdGlvbiwgcHJvcGVydHlOYW1lIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDaGFuZ2VkID0gY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFjdGlvblJ1biA9IGV4ZWN1dGVkUmVhY3Rpb25zLmluZGV4T2YocmVhY3Rpb24pICE9PSAtMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5Q2hhbmdlZCAmJiAhcmVhY3Rpb25SdW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWN0aW9uLmNhbGwodGhpcywgdGhpcy5fcHJvcGVydGllcywgZGlmZlByb3BlcnR5UmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRlZFJlYWN0aW9ucy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgfVxuICAgIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbikge1xuICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX19yZW5kZXJfXygpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgcmVuZGVyID0gdGhpcy5fcnVuQmVmb3JlUmVuZGVycygpO1xuICAgICAgICBsZXQgZE5vZGUgPSByZW5kZXIoKTtcbiAgICAgICAgZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBkTm9kZTtcbiAgICB9XG4gICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmludmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gdignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxuICAgICAqL1xuICAgIGFkZERlY29yYXRvcihkZWNvcmF0b3JLZXksIHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG4gICAgICAgICAgICBsZXQgZGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvck1hcC5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBpZiAoIWRlY29yYXRvckxpc3QpIHtcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgIGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgICAgIGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XG4gICAgICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0LnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSk7XG4gICAgICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBbLi4uZGVjb3JhdG9ycywgLi4udmFsdWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBidWlsZCB0aGUgbGlzdCBvZiBkZWNvcmF0b3JzIGZyb20gdGhlIGdsb2JhbCBkZWNvcmF0b3IgbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG4gICAgICogQHJldHVybiBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSkge1xuICAgICAgICBjb25zdCBhbGxEZWNvcmF0b3JzID0gW107XG4gICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHdoaWxlIChjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZU1hcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSBpbnN0YW5jZU1hcC5nZXQoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBhbGxEZWNvcmF0b3JzLnVuc2hpZnQoLi4uZGVjb3JhdG9ycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byByZXRyaWV2ZSBkZWNvcmF0b3IgdmFsdWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcbiAgICAgKi9cbiAgICBnZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5KSB7XG4gICAgICAgIGxldCBhbGxEZWNvcmF0b3JzID0gdGhpcy5fZGVjb3JhdG9yQ2FjaGUuZ2V0KGRlY29yYXRvcktleSk7XG4gICAgICAgIGlmIChhbGxEZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xuICAgICAgICB9XG4gICAgICAgIGFsbERlY29yYXRvcnMgPSB0aGlzLl9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgYWxsRGVjb3JhdG9ycyk7XG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXG4gICAgICovXG4gICAgX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnR5LCBiaW5kKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgIXByb3BlcnR5W25vQmluZF0gJiYgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBiaW5kSW5mbyA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XG4gICAgICAgICAgICBsZXQgeyBib3VuZEZ1bmMsIHNjb3BlIH0gPSBiaW5kSW5mbztcbiAgICAgICAgICAgIGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xuICAgICAgICAgICAgICAgIGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuc2V0KHByb3BlcnR5LCB7IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYm91bmRGdW5jO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICB9XG4gICAgZ2V0IHJlZ2lzdHJ5KCkge1xuICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyKCk7XG4gICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeSk7XG4gICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeTtcbiAgICB9XG4gICAgX3J1bkJlZm9yZVByb3BlcnRpZXMocHJvcGVydGllcykge1xuICAgICAgICBjb25zdCBiZWZvcmVQcm9wZXJ0aWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcbiAgICAgICAgaWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwodGhpcywgcHJvcGVydGllcykpO1xuICAgICAgICAgICAgfSwgT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXG4gICAgICovXG4gICAgX3J1bkJlZm9yZVJlbmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZSgocmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHJlbmRlciwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlZFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlZFJlbmRlcjtcbiAgICAgICAgICAgIH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xuICAgICAqXG4gICAgICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcbiAgICAgKi9cbiAgICBydW5BZnRlclJlbmRlcnMoZE5vZGUpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XG4gICAgICAgIGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZE5vZGUgPSBhZnRlclJlbmRlcnMucmVkdWNlKChkTm9kZSwgYWZ0ZXJSZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgZE5vZGUpO1xuICAgICAgICAgICAgfSwgZE5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuZm9yRWFjaCgobWV0YSkgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGEuYWZ0ZXJSZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkTm9kZTtcbiAgICB9XG4gICAgX3J1bkFmdGVyQ29uc3RydWN0b3JzKCkge1xuICAgICAgICBjb25zdCBhZnRlckNvbnN0cnVjdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlckNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGlmIChhZnRlckNvbnN0cnVjdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZnRlckNvbnN0cnVjdG9ycy5mb3JFYWNoKChhZnRlckNvbnN0cnVjdG9yKSA9PiBhZnRlckNvbnN0cnVjdG9yLmNhbGwodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG93bihoYW5kbGUpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlcy5wdXNoKGhhbmRsZSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9oYW5kbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXMucG9wKCk7XG4gICAgICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogc3RhdGljIGlkZW50aWZpZXJcbiAqL1xuV2lkZ2V0QmFzZS5fdHlwZSA9IFdJREdFVF9CQVNFX1RZUEU7XG5leHBvcnQgZGVmYXVsdCBXaWRnZXRCYXNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2lkZ2V0QmFzZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL1dpZGdldEJhc2UubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwibGV0IGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnJztcbmxldCBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnJztcbmZ1bmN0aW9uIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpIHtcbiAgICBpZiAoJ1dlYmtpdFRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKCd0cmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlIHx8ICdNb3pUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICdhbmltYXRpb25lbmQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIGJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXRpYWxpemUoZWxlbWVudCkge1xuICAgIGlmIChicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPT09ICcnKSB7XG4gICAgICAgIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJ1bkFuZENsZWFuVXAoZWxlbWVudCwgc3RhcnRBbmltYXRpb24sIGZpbmlzaEFuaW1hdGlvbikge1xuICAgIGluaXRpYWxpemUoZWxlbWVudCk7XG4gICAgbGV0IGZpbmlzaGVkID0gZmFsc2U7XG4gICAgbGV0IHRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZmluaXNoZWQpIHtcbiAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuICAgICAgICAgICAgZmluaXNoQW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xufVxuZnVuY3Rpb24gZXhpdChub2RlLCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uLCByZW1vdmVOb2RlKSB7XG4gICAgY29uc3QgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb25BY3RpdmUgfHwgYCR7ZXhpdEFuaW1hdGlvbn0tYWN0aXZlYDtcbiAgICBydW5BbmRDbGVhblVwKG5vZGUsICgpID0+IHtcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGV4aXRBbmltYXRpb24pO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgfSwgKCkgPT4ge1xuICAgICAgICByZW1vdmVOb2RlKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBlbnRlcihub2RlLCBwcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbikge1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5lbnRlckFuaW1hdGlvbkFjdGl2ZSB8fCBgJHtlbnRlckFuaW1hdGlvbn0tYWN0aXZlYDtcbiAgICBydW5BbmRDbGVhblVwKG5vZGUsICgpID0+IHtcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGVudGVyQW5pbWF0aW9uKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgIH0sICgpID0+IHtcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKGVudGVyQW5pbWF0aW9uKTtcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKGFjdGl2ZUNsYXNzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBlbnRlcixcbiAgICBleGl0XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3NzVHJhbnNpdGlvbnMubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi4vc2hpbS9TeW1ib2wnO1xuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgV05vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgV05PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgV05vZGUuJyk7XG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBWTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBWTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBWTm9kZS4nKTtcbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGUgY3JlYXRlZCB1c2luZyBkb20oKVxuICovXG5leHBvcnQgY29uc3QgRE9NVk5PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgVk5vZGUgY3JlYXRlZCB1c2luZyBleGlzdGluZyBkb20uJyk7XG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXTm9kZShjaGlsZCkge1xuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gV05PREUpO1xufVxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQpIHtcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIChjaGlsZC50eXBlID09PSBWTk9ERSB8fCBjaGlsZC50eXBlID09PSBET01WTk9ERSkpO1xufVxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIGNyZWF0ZWQgd2l0aCBgZG9tKClgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRG9tVk5vZGUoY2hpbGQpIHtcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IERPTVZOT0RFKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnROb2RlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUudGFnTmFtZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXMsIG9wdGlvbnNPck1vZGlmaWVyLCBwcmVkaWNhdGUpIHtcbiAgICBsZXQgc2hhbGxvdyA9IGZhbHNlO1xuICAgIGxldCBtb2RpZmllcjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBtb2RpZmllciA9IG9wdGlvbnNPck1vZGlmaWVyLm1vZGlmaWVyO1xuICAgICAgICBwcmVkaWNhdGUgPSBvcHRpb25zT3JNb2RpZmllci5wcmVkaWNhdGU7XG4gICAgICAgIHNoYWxsb3cgPSBvcHRpb25zT3JNb2RpZmllci5zaGFsbG93IHx8IGZhbHNlO1xuICAgIH1cbiAgICBsZXQgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBbLi4uZE5vZGVzXSA6IFtkTm9kZXNdO1xuICAgIGZ1bmN0aW9uIGJyZWFrZXIoKSB7XG4gICAgICAgIG5vZGVzID0gW107XG4gICAgfVxuICAgIHdoaWxlIChub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzLnNoaWZ0KCk7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXNoYWxsb3cgJiYgKGlzV05vZGUobm9kZSkgfHwgaXNWTm9kZShub2RlKSkgJiYgbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gWy4uLm5vZGVzLCAuLi5ub2RlLmNoaWxkcmVuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgICAgICAgICAgIG1vZGlmaWVyKG5vZGUsIGJyZWFrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkTm9kZXM7XG59XG4vKipcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHcod2lkZ2V0Q29uc3RydWN0b3IsIHByb3BlcnRpZXMsIGNoaWxkcmVuID0gW10pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3IsXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIHR5cGU6IFdOT0RFXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB2KHRhZywgcHJvcGVydGllc09yQ2hpbGRyZW4gPSB7fSwgY2hpbGRyZW4gPSB1bmRlZmluZWQpIHtcbiAgICBsZXQgcHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuICAgIGxldCBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjaztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzT3JDaGlsZHJlbikpIHtcbiAgICAgICAgY2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xuICAgICAgICBwcm9wZXJ0aWVzID0ge307XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHRhZyxcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICB0eXBlOiBWTk9ERVxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIFZOb2RlIGZvciBhbiBleGlzdGluZyBET00gTm9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbSh7IG5vZGUsIGF0dHJzID0ge30sIHByb3BzID0ge30sIG9uID0ge30sIGRpZmZUeXBlID0gJ25vbmUnIH0sIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFnOiBpc0VsZW1lbnROb2RlKG5vZGUpID8gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJyxcbiAgICAgICAgcHJvcGVydGllczogcHJvcHMsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJzLFxuICAgICAgICBldmVudHM6IG9uLFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgdHlwZTogRE9NVk5PREUsXG4gICAgICAgIGRvbU5vZGU6IG5vZGUsXG4gICAgICAgIHRleHQ6IGlzRWxlbWVudE5vZGUobm9kZSkgPyB1bmRlZmluZWQgOiBub2RlLmRhdGEsXG4gICAgICAgIGRpZmZUeXBlXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2QubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcihtZXRob2QpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGFmdGVyUmVuZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWZ0ZXJSZW5kZXIubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuL2JlZm9yZVByb3BlcnRpZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGFsd2F5c1JlbmRlcigpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH0pKHRhcmdldCk7XG4gICAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCBhbHdheXNSZW5kZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbHdheXNSZW5kZXIubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kKSB7XG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGJlZm9yZVByb3BlcnRpZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iZWZvcmVQcm9wZXJ0aWVzLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IHsgQ3VzdG9tRWxlbWVudENoaWxkVHlwZSB9IGZyb20gJy4uL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudCc7XG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vUmVnaXN0cnknO1xuLyoqXG4gKiBUaGlzIERlY29yYXRvciBpcyBwcm92aWRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGN1c3RvbSBlbGVtZW50LCBhbmRcbiAqIHJlZ2lzdGVycyB0aGF0IGN1c3RvbSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRWxlbWVudCh7IHRhZywgcHJvcGVydGllcyA9IFtdLCBhdHRyaWJ1dGVzID0gW10sIGV2ZW50cyA9IFtdLCBjaGlsZFR5cGUgPSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8sIHJlZ2lzdHJ5RmFjdG9yeSA9ICgpID0+IG5ldyBSZWdpc3RyeSgpIH0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgICB0YWdOYW1lOiB0YWcsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgICAgIGV2ZW50cyxcbiAgICAgICAgICAgIGNoaWxkVHlwZSxcbiAgICAgICAgICAgIHJlZ2lzdHJ5RmFjdG9yeVxuICAgICAgICB9O1xuICAgIH07XG59XG5leHBvcnQgZGVmYXVsdCBjdXN0b21FbGVtZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3VzdG9tRWxlbWVudC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGF1dG8gfSBmcm9tICcuLy4uL2RpZmYnO1xuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZSwgZGlmZkZ1bmN0aW9uID0gYXV0bywgcmVhY3Rpb25GdW5jdGlvbikge1xuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWAsIGRpZmZGdW5jdGlvbi5iaW5kKG51bGwpKTtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgIGlmIChyZWFjdGlvbkZ1bmN0aW9uIHx8IHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nLCB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgIHJlYWN0aW9uOiBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiByZWFjdGlvbkZ1bmN0aW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgZGlmZlByb3BlcnR5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlmZlByb3BlcnR5Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsIi8qKlxuICogR2VuZXJpYyBkZWNvcmF0b3IgaGFuZGxlciB0byB0YWtlIGNhcmUgb2Ygd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgY2FsbGVkIGF0IHRoZSBjbGFzcyBsZXZlbFxuICogb3IgdGhlIG1ldGhvZCBsZXZlbC5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRGVjb3JhdG9yKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LnByb3RvdHlwZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZXIodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRGVjb3JhdG9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFuZGxlRGVjb3JhdG9yLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsImltcG9ydCBXZWFrTWFwIGZyb20gJy4uLy4uL3NoaW0vV2Vha01hcCc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBiZWZvcmVQcm9wZXJ0aWVzIH0gZnJvbSAnLi9iZWZvcmVQcm9wZXJ0aWVzJztcbi8qKlxuICogTWFwIG9mIGluc3RhbmNlcyBhZ2FpbnN0IHJlZ2lzdGVyZWQgaW5qZWN0b3JzLlxuICovXG5jb25zdCByZWdpc3RlcmVkSW5qZWN0b3JzTWFwID0gbmV3IFdlYWtNYXAoKTtcbi8qKlxuICogRGVjb3JhdG9yIHJldHJpZXZlcyBhbiBpbmplY3RvciBmcm9tIGFuIGF2YWlsYWJsZSByZWdpc3RyeSB1c2luZyB0aGUgbmFtZSBhbmRcbiAqIGNhbGxzIHRoZSBgZ2V0UHJvcGVydGllc2AgZnVuY3Rpb24gd2l0aCB0aGUgcGF5bG9hZCBmcm9tIHRoZSBpbmplY3RvclxuICogYW5kIGN1cnJlbnQgcHJvcGVydGllcyB3aXRoIHRoZSB0aGUgaW5qZWN0ZWQgcHJvcGVydGllcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0gSW5qZWN0Q29uZmlnIHRoZSBpbmplY3QgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KHsgbmFtZSwgZ2V0UHJvcGVydGllcyB9KSB7XG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuICAgICAgICBiZWZvcmVQcm9wZXJ0aWVzKGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rvckl0ZW0gPSB0aGlzLnJlZ2lzdHJ5LmdldEluamVjdG9yKG5hbWUpO1xuICAgICAgICAgICAgaWYgKGluamVjdG9ySXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaW5qZWN0b3IsIGludmFsaWRhdG9yIH0gPSBpbmplY3Rvckl0ZW07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaXN0ZXJlZEluamVjdG9ycyA9IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuZ2V0KHRoaXMpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLnNldCh0aGlzLCByZWdpc3RlcmVkSW5qZWN0b3JzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMuaW5kZXhPZihpbmplY3Rvckl0ZW0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm93bihpbnZhbGlkYXRvci5vbignaW52YWxpZGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRJbmplY3RvcnMucHVzaChpbmplY3Rvckl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UHJvcGVydGllcyhpbmplY3RvcigpLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkodGFyZ2V0KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGluamVjdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluamVjdC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyBXSURHRVRfQkFTRV9UWVBFIH0gZnJvbSAnLi9SZWdpc3RyeSc7XG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcbiAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93KHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICBjb25zdCB2YWxpZE9sZFByb3BlcnR5ID0gcHJldmlvdXNQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkocHJldmlvdXNQcm9wZXJ0eSk7XG4gICAgY29uc3QgdmFsaWROZXdQcm9wZXJ0eSA9IG5ld1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSk7XG4gICAgaWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFuZ2VkOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzS2V5cyA9IE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydHkpO1xuICAgIGNvbnN0IG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdQcm9wZXJ0eSk7XG4gICAgaWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2hhbmdlZCA9IG5ld0tleXMuc29tZSgoa2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3UHJvcGVydHlba2V5XSAhPT0gcHJldmlvdXNQcm9wZXJ0eVtrZXldO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2hhbmdlZCxcbiAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodHlwZW9mIG5ld1Byb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChuZXdQcm9wZXJ0eS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KSkge1xuICAgICAgICByZXN1bHQgPSBzaGFsbG93KHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaWZmLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvZGlmZi5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9kaWZmLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnLi4vLi4vY29yZS9sYW5nJztcbmltcG9ydCBjc3NUcmFuc2l0aW9ucyBmcm9tICcuLi9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zJztcbmltcG9ydCB7IGFmdGVyUmVuZGVyIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyJztcbmltcG9ydCB7IHYgfSBmcm9tICcuLy4uL2QnO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi8uLi92ZG9tJztcbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYXR0YWNoIHN0YXRlIG9mIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IHZhciBQcm9qZWN0b3JBdHRhY2hTdGF0ZTtcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcbiAgICBQcm9qZWN0b3JBdHRhY2hTdGF0ZVtQcm9qZWN0b3JBdHRhY2hTdGF0ZVtcIkF0dGFjaGVkXCJdID0gMV0gPSBcIkF0dGFjaGVkXCI7XG4gICAgUHJvamVjdG9yQXR0YWNoU3RhdGVbUHJvamVjdG9yQXR0YWNoU3RhdGVbXCJEZXRhY2hlZFwiXSA9IDJdID0gXCJEZXRhY2hlZFwiO1xufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgfHwgKFByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcbi8qKlxuICogQXR0YWNoIHR5cGUgZm9yIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IHZhciBBdHRhY2hUeXBlO1xuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XG4gICAgQXR0YWNoVHlwZVtBdHRhY2hUeXBlW1wiQXBwZW5kXCJdID0gMV0gPSBcIkFwcGVuZFwiO1xuICAgIEF0dGFjaFR5cGVbQXR0YWNoVHlwZVtcIk1lcmdlXCJdID0gMl0gPSBcIk1lcmdlXCI7XG59KShBdHRhY2hUeXBlIHx8IChBdHRhY2hUeXBlID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XG4gICAgY2xhc3MgUHJvamVjdG9yIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB0aGlzLl9hc3luYyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0ge307XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uczogY3NzVHJhbnNpdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuICAgICAgICB9XG4gICAgICAgIGFwcGVuZChyb290KSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxuICAgICAgICAgICAgICAgIHJvb3RcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlKHJvb3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5NZXJnZSxcbiAgICAgICAgICAgICAgICByb290XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcm9vdChyb290KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJvb3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYXN5bmMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXN5bmM7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGFzeW5jKGFzeW5jKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gYXN5bmM7XG4gICAgICAgIH1cbiAgICAgICAgc2FuZGJveChkb2MgPSBkb2N1bWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hc3luYyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNSb290ID0gdGhpcy5yb290O1xuICAgICAgICAgICAgLyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXG4gICAgICAgICAgICB0aGlzLm93bih7XG4gICAgICAgICAgICAgICAgZGVzdHJveTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb290ID0gcHJldmlvdXNSb290O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYXR0YWNoKHtcbiAgICAgICAgICAgICAgICAvKiBEb2N1bWVudEZyYWdtZW50IGlzIG5vdCBhc3NpZ25hYmxlIHRvIEVsZW1lbnQsIGJ1dCBwcm92aWRlcyBldmVyeXRoaW5nIG5lZWRlZCB0byB3b3JrICovXG4gICAgICAgICAgICAgICAgcm9vdDogZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgJiYgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSAhPT0gcHJvcGVydGllcy5yZWdpc3RyeSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBhc3NpZ24oe30sIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgc3VwZXIuX19zZXRDb3JlUHJvcGVydGllc19fKHsgYmluZDogdGhpcywgYmFzZVJlZ2lzdHJ5OiBwcm9wZXJ0aWVzLnJlZ2lzdHJ5IH0pO1xuICAgICAgICAgICAgc3VwZXIuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgdG9IdG1sKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgIT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkIHx8ICF0aGlzLl9wcm9qZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgaXMgbm90IGF0dGFjaGVkLCBjYW5ub3QgcmV0dXJuIGFuIEhUTUwgc3RyaW5nIG9mIHByb2plY3Rpb24uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvamVjdGlvbi5kb21Ob2RlLmNoaWxkTm9kZXNbMF0ub3V0ZXJIVE1MO1xuICAgICAgICB9XG4gICAgICAgIGFmdGVyUmVuZGVyKHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IHYoJ3NwYW4nLCB7fSwgW3Jlc3VsdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBfYXR0YWNoKHsgdHlwZSwgcm9vdCB9KSB7XG4gICAgICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fYXR0YWNoSGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZDtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHtcbiAgICAgICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xuICAgICAgICAgICAgdGhpcy5fYXR0YWNoSGFuZGxlID0gaGFuZGxlO1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucywgeyBzeW5jOiAhdGhpcy5fYXN5bmMgfSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuQXBwZW5kOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBBdHRhY2hUeXBlLk1lcmdlOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gZG9tLm1lcmdlKHRoaXMucm9vdCwgdGhpcywgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2hIYW5kbGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgYWZ0ZXJSZW5kZXIoKVxuICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XG4gICAgcmV0dXJuIFByb2plY3Rvcjtcbn1cbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rvck1peGluO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UHJvamVjdG9yLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9pbmplY3QnO1xuaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBkaWZmUHJvcGVydHkgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5JztcbmltcG9ydCB7IHNoYWxsb3cgfSBmcm9tICcuLy4uL2RpZmYnO1xuY29uc3QgVEhFTUVfS0VZID0gJyBfa2V5JztcbmV4cG9ydCBjb25zdCBJTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XG4vKipcbiAqIERlY29yYXRvciBmb3IgYmFzZSBjc3MgY2xhc3Nlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodGhlbWUpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycsIHRoZW1lKTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBjbGFzc2VzIFRoZSBiYXNlQ2xhc3NlcyBvYmplY3RcbiAqIEByZXF1aXJlc1xuICovXG5mdW5jdGlvbiBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZSgoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhiYXNlQ2xhc3MpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY3VycmVudENsYXNzTmFtZXNbYmFzZUNsYXNzW2tleV1dID0ga2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDbGFzc05hbWVzO1xuICAgIH0sIHt9KTtcbn1cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBpcyBnaXZlbiBhIHRoZW1lIGFuZCBhbiBvcHRpb25hbCByZWdpc3RyeSwgdGhlIHRoZW1lXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxuICpcbiAqIEBwYXJhbSB0aGVtZSB0aGUgdGhlbWUgdG8gc2V0XG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXG4gKiB0byB0aGUgZ2xvYmFsIHJlZ2lzdHJ5XG4gKlxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lLCB0aGVtZVJlZ2lzdHJ5KSB7XG4gICAgY29uc3QgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGVtZSk7XG4gICAgdGhlbWVSZWdpc3RyeS5kZWZpbmVJbmplY3RvcihJTkpFQ1RFRF9USEVNRV9LRVksIChpbnZhbGlkYXRvcikgPT4ge1xuICAgICAgICB0aGVtZUluamVjdG9yLnNldEludmFsaWRhdG9yKGludmFsaWRhdG9yKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHRoZW1lSW5qZWN0b3IuZ2V0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGNsYXNzIGRlY29yYXRlZCB3aXRoIHdpdGggVGhlbWVkIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluKEJhc2UpIHtcbiAgICBsZXQgVGhlbWVkID0gY2xhc3MgVGhlbWVkIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMgPSBbXTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuX3RoZW1lID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhlbWUoY2xhc3Nlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLm1hcCgoY2xhc3NOYW1lKSA9PiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cbiAgICAgICAgICovXG4gICAgICAgIG9uUHJvcGVydGllc0NoYW5nZWQoKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xuICAgICAgICAgICAgbGV0IHJlc3VsdENsYXNzTmFtZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENsYXNzIG5hbWU6ICcke2NsYXNzTmFtZX0nIG5vdCBmb3VuZCBpbiB0aGVtZWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIF9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGhlbWUgPSB7fSB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX2EgPSBUSEVNRV9LRVksIGtleSA9IGJhc2VUaGVtZVtfYV0sIGNsYXNzZXMgPSB0c2xpYl8xLl9fcmVzdChiYXNlVGhlbWUsIFt0eXBlb2YgX2EgPT09IFwic3ltYm9sXCIgPyBfYSA6IF9hICsgXCJcIl0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoKGJhc2VUaGVtZSwgdGhlbWVLZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYmFzZVRoZW1lLCB0aGVtZVt0aGVtZUtleV0pO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGRpZmZQcm9wZXJ0eSgndGhlbWUnLCBzaGFsbG93KSxcbiAgICAgICAgZGlmZlByb3BlcnR5KCdleHRyYUNsYXNzZXMnLCBzaGFsbG93KVxuICAgIF0sIFRoZW1lZC5wcm90b3R5cGUsIFwib25Qcm9wZXJ0aWVzQ2hhbmdlZFwiLCBudWxsKTtcbiAgICBUaGVtZWQgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbmplY3Qoe1xuICAgICAgICAgICAgbmFtZTogSU5KRUNURURfVEhFTUVfS0VZLFxuICAgICAgICAgICAgZ2V0UHJvcGVydGllczogKHRoZW1lLCBwcm9wZXJ0aWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzLnRoZW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHRoZW1lIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICBdLCBUaGVtZWQpO1xuICAgIHJldHVybiBUaGVtZWQ7XG59XG5leHBvcnQgZGVmYXVsdCBUaGVtZWRNaXhpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRoZW1lZC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFdpZGdldEJhc2UsIG5vQmluZCB9IGZyb20gJy4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBQcm9qZWN0b3JNaXhpbiB9IGZyb20gJy4vbWl4aW5zL1Byb2plY3Rvcic7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vc2hpbS9hcnJheSc7XG5pbXBvcnQgeyB3LCBkb20gfSBmcm9tICcuL2QnO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9zaGltL2dsb2JhbCc7XG5pbXBvcnQgeyByZWdpc3RlclRoZW1lSW5qZWN0b3IgfSBmcm9tICcuL21peGlucy9UaGVtZWQnO1xuaW1wb3J0IHsgYWx3YXlzUmVuZGVyIH0gZnJvbSAnLi9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlcic7XG5leHBvcnQgdmFyIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGU7XG4oZnVuY3Rpb24gKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUpIHtcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiRE9KT1wiXSA9IFwiRE9KT1wiO1xuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJOT0RFXCJdID0gXCJOT0RFXCI7XG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIlRFWFRcIl0gPSBcIlRFWFRcIjtcbn0pKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgfHwgKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgPSB7fSkpO1xuZXhwb3J0IGZ1bmN0aW9uIERvbVRvV2lkZ2V0V3JhcHBlcihkb21Ob2RlKSB7XG4gICAgbGV0IERvbVRvV2lkZ2V0V3JhcHBlciA9IGNsYXNzIERvbVRvV2lkZ2V0V3JhcHBlciBleHRlbmRzIFdpZGdldEJhc2Uge1xuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXModGhpcy5wcm9wZXJ0aWVzKS5yZWR1Y2UoKHByb3BzLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZignb24nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBgX18ke2tleX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgcmV0dXJuIGRvbSh7IG5vZGU6IGRvbU5vZGUsIHByb3BzOiBwcm9wZXJ0aWVzLCBkaWZmVHlwZTogJ2RvbScgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGdldCBkb21Ob2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERvbVRvV2lkZ2V0V3JhcHBlciA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGFsd2F5c1JlbmRlcigpXG4gICAgXSwgRG9tVG9XaWRnZXRXcmFwcGVyKTtcbiAgICByZXR1cm4gRG9tVG9XaWRnZXRXcmFwcGVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShkZXNjcmlwdG9yLCBXaWRnZXRDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnN0IHsgYXR0cmlidXRlcywgY2hpbGRUeXBlLCByZWdpc3RyeUZhY3RvcnkgfSA9IGRlc2NyaXB0b3I7XG4gICAgY29uc3QgYXR0cmlidXRlTWFwID0ge307XG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKChwcm9wZXJ0eU5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhdHRyaWJ1dGVNYXBbYXR0cmlidXRlTmFtZV0gPSBwcm9wZXJ0eU5hbWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0ge307XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzID0ge307XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luaXRpYWxpc2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZG9tUHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgY29uc3QgeyBhdHRyaWJ1dGVzLCBwcm9wZXJ0aWVzLCBldmVudHMgfSA9IGRlc2NyaXB0b3I7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fYXR0cmlidXRlc1RvUHJvcGVydGllcyhhdHRyaWJ1dGVzKSk7XG4gICAgICAgICAgICBbLi4uYXR0cmlidXRlcywgLi4ucHJvcGVydGllc10uZm9yRWFjaCgocHJvcGVydHlOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJ19fJyk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZFByb3BlcnR5TmFtZSAhPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbVByb3BlcnRpZXNbZmlsdGVyZWRQcm9wZXJ0eU5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLl9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiAodmFsdWUpID0+IHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvbVByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLl9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4gdGhpcy5fc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaCgocHJvcGVydHlOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfX29uJyk7XG4gICAgICAgICAgICAgICAgZG9tUHJvcGVydGllc1tmaWx0ZXJlZFByb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5fZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4gdGhpcy5fc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXZlbnRDYWxsYmFjayA9IHRoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudENhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogYXJnc1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgZG9tUHJvcGVydGllcyk7XG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGNoaWxkVHlwZSA9PT0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5URVhUID8gdGhpcy5jaGlsZE5vZGVzIDogdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgICAgIGZyb20oY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsICgpID0+IHRoaXMuX3JlbmRlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChEb21Ub1dpZGdldFdyYXBwZXIoY2hpbGROb2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKGRvbSh7IG5vZGU6IGNoaWxkTm9kZSwgZGlmZlR5cGU6ICdkb20nIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCAoZSkgPT4gdGhpcy5fY2hpbGRDb25uZWN0ZWQoZSkpO1xuICAgICAgICAgICAgY29uc3Qgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMuX3Byb3BlcnRpZXM7XG4gICAgICAgICAgICBjb25zdCByZW5kZXJDaGlsZHJlbiA9ICgpID0+IHRoaXMuX19jaGlsZHJlbl9fKCk7XG4gICAgICAgICAgICBjb25zdCBXcmFwcGVyID0gY2xhc3MgZXh0ZW5kcyBXaWRnZXRCYXNlIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3KFdpZGdldENvbnN0cnVjdG9yLCB3aWRnZXRQcm9wZXJ0aWVzLCByZW5kZXJDaGlsZHJlbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcmVnaXN0cnkgPSByZWdpc3RyeUZhY3RvcnkoKTtcbiAgICAgICAgICAgIGNvbnN0IHRoZW1lQ29udGV4dCA9IHJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGlzLl9nZXRUaGVtZSgpLCByZWdpc3RyeSk7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignZG9qby10aGVtZS1zZXQnLCAoKSA9PiB0aGVtZUNvbnRleHQuc2V0KHRoaXMuX2dldFRoZW1lKCkpKTtcbiAgICAgICAgICAgIGNvbnN0IFByb2plY3RvciA9IFByb2plY3Rvck1peGluKFdyYXBwZXIpO1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yID0gbmV3IFByb2plY3RvcigpO1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLnNldFByb3BlcnRpZXMoeyByZWdpc3RyeSB9KTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5hcHBlbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdkb2pvLWNlLWNvbm5lY3RlZCcsIHtcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdGhpc1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRUaGVtZSgpIHtcbiAgICAgICAgICAgIGlmIChnbG9iYWwgJiYgZ2xvYmFsLmRvam9jZSAmJiBnbG9iYWwuZG9qb2NlLnRoZW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5kb2pvY2UudGhlbWVzW2dsb2JhbC5kb2pvY2UudGhlbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9jaGlsZENvbm5lY3RlZChlKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gZS5kZXRhaWw7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gdGhpcy5fY2hpbGRyZW4uc29tZSgoY2hpbGQpID0+IGNoaWxkLmRvbU5vZGUgPT09IG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKG5vZGUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9yZW5kZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdkb2pvLWNlLXJlbmRlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogdGhpc1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfX3Byb3BlcnRpZXNfXygpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9wcm9wZXJ0aWVzLCB0aGlzLl9ldmVudFByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIF9fY2hpbGRyZW5fXygpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoKENoaWxkKSA9PiBDaGlsZC5kb21Ob2RlLmlzV2lkZ2V0KS5tYXAoKENoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZG9tTm9kZSB9ID0gQ2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3KENoaWxkLCBPYmplY3QuYXNzaWduKHt9LCBkb21Ob2RlLl9fcHJvcGVydGllc19fKCkpLCBbLi4uZG9tTm9kZS5fX2NoaWxkcmVuX18oKV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZU1hcFtuYW1lXTtcbiAgICAgICAgICAgIHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIF9zZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtub0JpbmRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgX2dldFByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBfYXR0cmlidXRlc1RvUHJvcGVydGllcyhhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5yZWR1Y2UoKHByb3BlcnRpZXMsIHByb3BlcnR5TmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlTWFwKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXNXaWRnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoV2lkZ2V0Q29uc3RydWN0b3IpIHtcbiAgICBjb25zdCBkZXNjcmlwdG9yID0gV2lkZ2V0Q29uc3RydWN0b3IucHJvdG90eXBlICYmIFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xuICAgIGlmICghZGVzY3JpcHRvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBnZXQgZGVzY3JpcHRvciBmb3IgQ3VzdG9tIEVsZW1lbnQsIGhhdmUgeW91IGFkZGVkIHRoZSBAY3VzdG9tRWxlbWVudCBkZWNvcmF0b3IgdG8geW91ciBXaWRnZXQ/Jyk7XG4gICAgfVxuICAgIGdsb2JhbC5jdXN0b21FbGVtZW50cy5kZWZpbmUoZGVzY3JpcHRvci50YWdOYW1lLCBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHJlZ2lzdGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuLi9zaGltL2dsb2JhbCc7XHJcbmltcG9ydCB7IGZyb20gYXMgYXJyYXlGcm9tIH0gZnJvbSAnLi4vc2hpbS9hcnJheSc7XHJcbmltcG9ydCB7IGlzV05vZGUsIGlzVk5vZGUsIGlzRG9tVk5vZGUsIFZOT0RFLCBXTk9ERSB9IGZyb20gJy4vZCc7XHJcbmltcG9ydCB7IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIH0gZnJvbSAnLi9SZWdpc3RyeSc7XHJcbmltcG9ydCBXZWFrTWFwIGZyb20gJy4uL3NoaW0vV2Vha01hcCc7XHJcbmNvbnN0IE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xyXG5jb25zdCBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcclxuY29uc3QgTkFNRVNQQUNFX1hMSU5LID0gTkFNRVNQQUNFX1czICsgJzE5OTkveGxpbmsnO1xyXG5jb25zdCBlbXB0eUFycmF5ID0gW107XHJcbmNvbnN0IG5vZGVPcGVyYXRpb25zID0gWydmb2N1cycsICdibHVyJywgJ3Njcm9sbEludG9WaWV3JywgJ2NsaWNrJ107XHJcbmV4cG9ydCBjb25zdCB3aWRnZXRJbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwKCk7XHJcbmNvbnN0IGluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXAoKTtcclxuY29uc3QgbmV4dFNpYmxpbmdNYXAgPSBuZXcgV2Vha01hcCgpO1xyXG5jb25zdCBwcm9qZWN0b3JTdGF0ZU1hcCA9IG5ldyBXZWFrTWFwKCk7XHJcbmZ1bmN0aW9uIHNhbWUoZG5vZGUxLCBkbm9kZTIpIHtcclxuICAgIGlmIChpc1ZOb2RlKGRub2RlMSkgJiYgaXNWTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGlzRG9tVk5vZGUoZG5vZGUxKSB8fCBpc0RvbVZOb2RlKGRub2RlMikpIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlMS5kb21Ob2RlICE9PSBkbm9kZTIuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEudGFnICE9PSBkbm9kZTIudGFnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc1dOb2RlKGRub2RlMSkgJiYgaXNXTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGRub2RlMS5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS53aWRnZXRDb25zdHJ1Y3RvciAhPT0gZG5vZGUyLndpZGdldENvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuY29uc3QgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGUgYSB0cmFuc2l0aW9ucyBvYmplY3QgdG8gdGhlIHByb2plY3Rpb25PcHRpb25zIHRvIGRvIGFuaW1hdGlvbnMnKTtcclxufTtcclxuZnVuY3Rpb24gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdG9yT3B0aW9ucywgcHJvamVjdG9ySW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xyXG4gICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHN0eWxlQXBwbHllcjogZnVuY3Rpb24gKGRvbU5vZGUsIHN0eWxlTmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZVtzdHlsZU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2l0aW9uczoge1xyXG4gICAgICAgICAgICBlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXHJcbiAgICAgICAgICAgIGV4aXQ6IG1pc3NpbmdUcmFuc2l0aW9uXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXB0aDogMCxcclxuICAgICAgICBtZXJnZTogZmFsc2UsXHJcbiAgICAgICAgc3luYzogZmFsc2UsXHJcbiAgICAgICAgcHJvamVjdG9ySW5zdGFuY2VcclxuICAgIH07XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIHByb2plY3Rvck9wdGlvbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnROYW1lLCBjdXJyZW50VmFsdWUsIHByb2plY3Rpb25PcHRpb25zLCBiaW5kLCBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBjb25zdCBldmVudE1hcCA9IHByb2plY3RvclN0YXRlLm5vZGVNYXAuZ2V0KGRvbU5vZGUpIHx8IG5ldyBXZWFrTWFwKCk7XHJcbiAgICBpZiAocHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XHJcbiAgICB9XHJcbiAgICBsZXQgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChiaW5kKTtcclxuICAgIGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgY3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcclxuICAgICAgICAgICAgZXZ0LnRhcmdldFsnb25pbnB1dC12YWx1ZSddID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9LmJpbmQoYmluZCk7XHJcbiAgICB9XHJcbiAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XHJcbiAgICBldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYnVpbGRQcmV2aW91c1Byb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXMsIGN1cnJlbnQpIHtcclxuICAgIGNvbnN0IHsgZGlmZlR5cGUsIHByb3BlcnRpZXMsIGF0dHJpYnV0ZXMgfSA9IGN1cnJlbnQ7XHJcbiAgICBpZiAoIWRpZmZUeXBlIHx8IGRpZmZUeXBlID09PSAndmRvbScpIHtcclxuICAgICAgICByZXR1cm4geyBwcm9wZXJ0aWVzOiBwcmV2aW91cy5wcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzOiBwcmV2aW91cy5hdHRyaWJ1dGVzLCBldmVudHM6IHByZXZpb3VzLmV2ZW50cyB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlmZlR5cGUgPT09ICdub25lJykge1xyXG4gICAgICAgIHJldHVybiB7IHByb3BlcnRpZXM6IHt9LCBhdHRyaWJ1dGVzOiBwcmV2aW91cy5hdHRyaWJ1dGVzID8ge30gOiB1bmRlZmluZWQsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XHJcbiAgICB9XHJcbiAgICBsZXQgbmV3UHJvcGVydGllcyA9IHtcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fVxyXG4gICAgfTtcclxuICAgIGlmIChhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgbmV3UHJvcGVydGllcy5hdHRyaWJ1dGVzID0ge307XHJcbiAgICAgICAgbmV3UHJvcGVydGllcy5ldmVudHMgPSBwcmV2aW91cy5ldmVudHM7XHJcbiAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcclxuICAgICAgICAgICAgbmV3UHJvcGVydGllcy5wcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IGRvbU5vZGVbcHJvcE5hbWVdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goKGF0dHJOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIG5ld1Byb3BlcnRpZXMuYXR0cmlidXRlc1thdHRyTmFtZV0gPSBkb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ld1Byb3BlcnRpZXM7XHJcbiAgICB9XHJcbiAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5yZWR1Y2UoKHByb3BzLCBwcm9wZXJ0eSkgPT4ge1xyXG4gICAgICAgIHByb3BzW3Byb3BlcnR5XSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKHByb3BlcnR5KSB8fCBkb21Ob2RlW3Byb3BlcnR5XTtcclxuICAgICAgICByZXR1cm4gcHJvcHM7XHJcbiAgICB9LCB7fSk7XHJcbiAgICByZXR1cm4gbmV3UHJvcGVydGllcztcclxufVxyXG5mdW5jdGlvbiBub2RlT3BlcmF0aW9uKHByb3BOYW1lLCBwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSAmJiAhcHJldmlvdXNWYWx1ZTtcclxuICAgIH1cclxuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgb25seUV2ZW50cyA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBjb25zdCBldmVudE1hcCA9IHByb2plY3RvclN0YXRlLm5vZGVNYXAuZ2V0KGRvbU5vZGUpO1xyXG4gICAgaWYgKGV2ZW50TWFwKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0aWVzKS5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpc0V2ZW50ID0gcHJvcE5hbWUuc3Vic3RyKDAsIDIpID09PSAnb24nIHx8IG9ubHlFdmVudHM7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IG9ubHlFdmVudHMgPyBwcm9wTmFtZSA6IHByb3BOYW1lLnN1YnN0cigyKTtcclxuICAgICAgICAgICAgaWYgKGlzRXZlbnQgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudENhbGxiYWNrID0gZXZlbnRNYXAuZ2V0KHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRyAmJiBhdHRyTmFtZSA9PT0gJ2hyZWYnKSB7XHJcbiAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoKGF0dHJOYW1lID09PSAncm9sZScgJiYgYXR0clZhbHVlID09PSAnJykgfHwgYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHByZXZpb3VzQXR0cmlidXRlcywgYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGF0dHJOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpO1xyXG4gICAgY29uc3QgYXR0ckNvdW50ID0gYXR0ck5hbWVzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcclxuICAgICAgICBjb25zdCBhdHRyTmFtZSA9IGF0dHJOYW1lc1tpXTtcclxuICAgICAgICBjb25zdCBhdHRyVmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJOYW1lXTtcclxuICAgICAgICBjb25zdCBwcmV2aW91c0F0dHJWYWx1ZSA9IHByZXZpb3VzQXR0cmlidXRlc1thdHRyTmFtZV07XHJcbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gcHJldmlvdXNBdHRyVmFsdWUpIHtcclxuICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPSB0cnVlKSB7XHJcbiAgICBsZXQgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG4gICAgY29uc3QgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcclxuICAgIGlmIChwcm9wTmFtZXMuaW5kZXhPZignY2xhc3NlcycpID09PSAtMSAmJiBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcykge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzICYmIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xyXG4gICAgICAgIGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0NsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByZXZpb3VzVmFsdWUpID8gcHJldmlvdXNWYWx1ZSA6IFtwcmV2aW91c1ZhbHVlXTtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NlcyAmJiBwcmV2aW91c0NsYXNzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc2VzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdDbGFzc2VzID0gWy4uLmN1cnJlbnRDbGFzc2VzXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0NsYXNzTmFtZSA9IHByZXZpb3VzQ2xhc3Nlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGFzc0luZGV4ID0gbmV3Q2xhc3Nlcy5pbmRleE9mKHByZXZpb3VzQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2xhc3Nlcy5zcGxpY2UoY2xhc3NJbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgbmV3Q2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGVPcGVyYXRpb25zLmluZGV4T2YocHJvcE5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBub2RlT3BlcmF0aW9uKHByb3BOYW1lLCBwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R5bGVDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkU3R5bGVWYWx1ZSA9IHByZXZpb3VzVmFsdWUgJiYgcHJldmlvdXNWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdTdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tTdHlsZVZhbHVlKG5ld1N0eWxlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsIG5ld1N0eWxlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIXByb3BWYWx1ZSAmJiB0eXBlb2YgcHJldmlvdXNWYWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ3ZhbHVlJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tVmFsdWUgPSBkb21Ob2RlW3Byb3BOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSAhPT0gJ2tleScgJiYgcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIHByb3BOYW1lLnN1YnN0cigyKSwgcHJvcFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJvcGVydGllcy5iaW5kLCBwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJyAmJiBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzY3JvbGxMZWZ0JyB8fCBwcm9wTmFtZSA9PT0gJ3Njcm9sbFRvcCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tTm9kZVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcm9wZXJ0aWVzVXBkYXRlZDtcclxufVxyXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuLCBzYW1lQXMsIHN0YXJ0KSB7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICBkb21Ob2RlLFxyXG4gICAgICAgIHR5cGU6IFZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0b1RleHRWTm9kZShkYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICB0ZXh0OiBgJHtkYXRhfWAsXHJcbiAgICAgICAgZG9tTm9kZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHR5cGU6IFZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbmNlLFxyXG4gICAgICAgIHJlbmRlcmVkOiBbXSxcclxuICAgICAgICBjb3JlUHJvcGVydGllczogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLFxyXG4gICAgICAgIGNoaWxkcmVuOiBpbnN0YW5jZS5jaGlsZHJlbixcclxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvcjogaW5zdGFuY2UuY29uc3RydWN0b3IsXHJcbiAgICAgICAgcHJvcGVydGllczogaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBXTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZHJlbiwgaW5zdGFuY2UpIHtcclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGVtcHR5QXJyYXk7XHJcbiAgICB9XHJcbiAgICBjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7KSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGlzVk5vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQucHJvcGVydGllcy5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPSBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZC5jb3JlUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuY29yZVByb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IGluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUmVnaXN0cnk6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG59XHJcbmZ1bmN0aW9uIG5vZGVBZGRlZChkbm9kZSwgdHJhbnNpdGlvbnMpIHtcclxuICAgIGlmIChpc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgY29uc3QgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChlbnRlckFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVudGVyQW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmVudGVyKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGUsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKGlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGluc3RhbmNlTWFwLmdldChkbm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZWQgPSAoaXRlbSA/IGl0ZW0uZG5vZGUucmVuZGVyZWQgOiBkbm9kZS5yZW5kZXJlZCkgfHwgZW1wdHlBcnJheTtcclxuICAgICAgICBpZiAoZG5vZGUuaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGRub2RlLmluc3RhbmNlKTtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uRGV0YWNoKCk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlTWFwLmRlbGV0ZShkbm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKHJlbmRlcmVkW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBkbm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIGlmIChkbm9kZS5jaGlsZHJlbiAmJiBkbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZShkbm9kZS5jaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBleGl0QW5pbWF0aW9uID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICYmIGV4aXRBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVEb21Ob2RlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUgJiYgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleGl0QW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBleGl0QW5pbWF0aW9uKGRvbU5vZGUsIHJlbW92ZURvbU5vZGUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMuZXhpdChkbm9kZS5kb21Ob2RlLCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uLCByZW1vdmVEb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkb21Ob2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgZG5vZGUuZG9tTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjaGVja0Rpc3Rpbmd1aXNoYWJsZShjaGlsZE5vZGVzLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKSB7XHJcbiAgICBjb25zdCBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XHJcbiAgICBpZiAoaXNWTm9kZShjaGlsZE5vZGUpICYmICFjaGlsZE5vZGUudGFnKSB7XHJcbiAgICAgICAgcmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxyXG4gICAgfVxyXG4gICAgY29uc3QgeyBrZXkgfSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYW1lKG5vZGUsIGNoaWxkTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkZW50aWZpZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50TmFtZSA9IHBhcmVudEluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dOb2RlKGNoaWxkTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUud2lkZ2V0Q29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQSB3aWRnZXQgKCR7cGFyZW50TmFtZX0pIGhhcyBoYWQgYSBjaGlsZCBhZGRkZWQgb3IgcmVtb3ZlZCwgYnV0IHRoZXkgd2VyZSBub3QgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmaWVkLiBJdCBpcyByZWNvbW1lbmRlZCB0byBwcm92aWRlIGEgdW5pcXVlICdrZXknIHByb3BlcnR5IHdoZW4gdXNpbmcgdGhlIHNhbWUgd2lkZ2V0IG9yIGVsZW1lbnQgKCR7bm9kZUlkZW50aWZpZXJ9KSBtdWx0aXBsZSB0aW1lcyBhcyBzaWJsaW5nc2ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBzaWJsaW5ncywgb2xkQ2hpbGRyZW4sIG5ld0NoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIG9sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcclxuICAgIG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XHJcbiAgICBjb25zdCBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcclxuICAgIGNvbnN0IG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgY29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucztcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIGxldCBvbGRJbmRleCA9IDA7XHJcbiAgICBsZXQgbmV3SW5kZXggPSAwO1xyXG4gICAgbGV0IGk7XHJcbiAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcclxuICAgICAgICBpZiAoaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkLmluc2VydGVkID0gaXNWTm9kZShvbGRDaGlsZCkgJiYgb2xkQ2hpbGQuaW5zZXJ0ZWQ7XHJcbiAgICAgICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcclxuICAgICAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICAgICAgbmV3SW5kZXgrKztcclxuICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlRG9tKG9sZENoaWxkLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSwgb2xkQ2hpbGRyZW4uc2xpY2Uob2xkSW5kZXgpLCBuZXdDaGlsZHJlbi5zbGljZShuZXdJbmRleCkpIHx8IHRleHRVcGRhdGVkO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZmluZE9sZEluZGV4ID0gZmluZEluZGV4T2ZDaGlsZChvbGRDaGlsZHJlbiwgbmV3Q2hpbGQsIG9sZEluZGV4ICsgMSk7XHJcbiAgICAgICAgY29uc3QgYWRkQ2hpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbnNlcnRCZWZvcmVEb21Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRyZW5BcnJheSA9IG9sZENoaWxkcmVuO1xyXG4gICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gb2xkSW5kZXggKyAxO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBvbGRDaGlsZHJlbltvbGRJbmRleF07XHJcbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gc2libGluZ3NbMF07XHJcbiAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5BcnJheSA9IHNpYmxpbmdzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc2VydEJlZm9yZUNoaWxkcmVuID0gW2NoaWxkXTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpbnNlcnRCZWZvcmVDaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnNlcnRCZWZvcmUgPSBpbnNlcnRCZWZvcmVDaGlsZHJlbi5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dOb2RlKGluc2VydEJlZm9yZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGluc3RhbmNlTWFwLmdldChpbnNlcnRCZWZvcmUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmRub2RlLnJlbmRlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmVDaGlsZHJlbi5wdXNoKC4uLml0ZW0uZG5vZGUucmVuZGVyZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlLmRvbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUuZG9tTm9kZS5wYXJlbnRFbGVtZW50ICE9PSBwYXJlbnRWTm9kZS5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmVEb21Ob2RlID0gaW5zZXJ0QmVmb3JlLmRvbU5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlQ2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIGNoaWxkcmVuQXJyYXlbbmV4dEluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmVDaGlsZHJlbi5wdXNoKGNoaWxkcmVuQXJyYXlbbmV4dEluZGV4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIHBhcmVudFZOb2RlLCBuZXdDaGlsZHJlbi5zbGljZShuZXdJbmRleCArIDEpLCBpbnNlcnRCZWZvcmVEb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghb2xkQ2hpbGQgfHwgZmluZE9sZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICBhZGRDaGlsZCgpO1xyXG4gICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlQ2hpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4VG9DaGVjayA9IG9sZEluZGV4O1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc1dOb2RlKG9sZENoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGluc3RhbmNlTWFwLmdldChvbGRDaGlsZC5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZENoaWxkID0gaXRlbS5kbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUob2xkQ2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBmaW5kTmV3SW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG5ld0NoaWxkcmVuLCBvbGRDaGlsZCwgbmV3SW5kZXggKyAxKTtcclxuICAgICAgICBpZiAoZmluZE5ld0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgICAgICBvbGRJbmRleCsrO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkQ2hpbGQoKTtcclxuICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgbmV3SW5kZXgrKztcclxuICAgIH1cclxuICAgIGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xyXG4gICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZFRvUmVtb3ZlID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChpc1dOb2RlKGNoaWxkVG9SZW1vdmUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gaW5zdGFuY2VNYXAuZ2V0KGNoaWxkVG9SZW1vdmUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZFRvUmVtb3ZlID0gaXRlbS5kbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUoY2hpbGRUb1JlbW92ZSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIGNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGluc2VydEJlZm9yZSA9IHVuZGVmaW5lZCwgY2hpbGROb2Rlcykge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgY2hpbGROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY2hpbGROb2RlcyA9IGFycmF5RnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlLmNoaWxkTm9kZXMpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHJhbnNpdGlvbnMgPSBwcm9qZWN0aW9uT3B0aW9ucy50cmFuc2l0aW9ucztcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGNvbnN0IG5leHRTaWJsaW5ncyA9IGNoaWxkcmVuLnNsaWNlKGkgKyAxKTtcclxuICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgaWYgKHByb2plY3RvclN0YXRlLm1lcmdlICYmIGNoaWxkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkb21FbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21FbGVtZW50ID0gY2hpbGROb2Rlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQudGFnTmFtZSA9PT0gKGNoaWxkLnRhZy50b1VwcGVyQ2FzZSgpIHx8IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIG5leHRTaWJsaW5ncywgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgbmV4dFNpYmxpbmdzLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGVBZGRlZChjaGlsZCwgdHJhbnNpdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgYWRkQ2hpbGRyZW4oZG5vZGUsIGRub2RlLmNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIHVuZGVmaW5lZCk7XHJcbiAgICBpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nICYmIGRub2RlLmluc2VydGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhZGREZWZlcnJlZFByb3BlcnRpZXMoZG5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xyXG4gICAgICAgIHVwZGF0ZUF0dHJpYnV0ZXMoZG9tTm9kZSwge30sIGRub2RlLmF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHt9LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgZmFsc2UpO1xyXG4gICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHt9LCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBkbm9kZS5ldmVudHM7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudCwgZXZlbnRzW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHt9LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcclxuICAgIH1cclxuICAgIGRub2RlLmluc2VydGVkID0gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCBuZXh0U2libGluZ3MsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKSB7XHJcbiAgICBsZXQgZG9tTm9kZTtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChpc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIGxldCB7IHdpZGdldENvbnN0cnVjdG9yIH0gPSBkbm9kZTtcclxuICAgICAgICBjb25zdCBwYXJlbnRJbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIGlmICghaXNXaWRnZXRCYXNlQ29uc3RydWN0b3Iod2lkZ2V0Q29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJlbnRJbnN0YW5jZURhdGEucmVnaXN0cnkoKS5nZXQod2lkZ2V0Q29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpZGdldENvbnN0cnVjdG9yID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgd2lkZ2V0Q29uc3RydWN0b3IoKTtcclxuICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgICAgIG5leHRTaWJsaW5nTWFwLnNldChpbnN0YW5jZSwgbmV4dFNpYmxpbmdzKTtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3RvclN0YXRlLnJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZSwgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyZW5kZXJlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XHJcbiAgICAgICAgICAgIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBmaWx0ZXJlZFJlbmRlcmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgcHJvamVjdG9yU3RhdGUubWVyZ2VFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHByb2plY3RvclN0YXRlLm1lcmdlRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkb2MgPSBwYXJlbnRWTm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQ7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlICE9PSB1bmRlZmluZWQgJiYgcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RG9tTm9kZSA9IGRub2RlLmRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWTm9kZS5kb21Ob2RlID09PSBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQobmV3RG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlICYmIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkbm9kZS5kb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmRvbU5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UsIGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgfHwgZG9jLmNyZWF0ZUVsZW1lbnQoZG5vZGUudGFnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkb21Ob2RlLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRG9tKHByZXZpb3VzLCBkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSwgb2xkTmV4dFNpYmxpbmdzLCBuZXh0U2libGluZ3MpIHtcclxuICAgIGlmIChpc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5zdGFuY2UgfSA9IHByZXZpb3VzO1xyXG4gICAgICAgIGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlOiBub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzUmVuZGVyZWQgPSBub2RlID8gbm9kZS5yZW5kZXJlZCA6IHByZXZpb3VzLnJlbmRlcmVkO1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIG5leHRTaWJsaW5nTWFwLnNldChpbnN0YW5jZSwgbmV4dFNpYmxpbmdzKTtcclxuICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuZGlydHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBvbGROZXh0U2libGluZ3MsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IHByZXZpb3VzUmVuZGVyZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkb21Ob2RlID0gKGRub2RlLmRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlKTtcclxuICAgICAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RG9tTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oZG5vZGUuY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGRub2RlLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVDaGlsZHJlbihkbm9kZSwgb2xkTmV4dFNpYmxpbmdzLCBwcmV2aW91cy5jaGlsZHJlbiwgY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1Byb3BlcnRpZXMgPSBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cywgZG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUuYXR0cmlidXRlcyAmJiBkbm9kZS5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUF0dHJpYnV0ZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMsIGRub2RlLmF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSkgfHwgdXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5ldmVudHMsIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnRzID0gZG5vZGUuZXZlbnRzO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIGV2ZW50LCBldmVudHNbZXZlbnRdLCBwcm9qZWN0aW9uT3B0aW9ucywgZG5vZGUucHJvcGVydGllcy5iaW5kLCBwcmV2aW91c1Byb3BlcnRpZXMuZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKGRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhZGREZWZlcnJlZFByb3BlcnRpZXModm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAvLyB0cmFuc2ZlciBhbnkgcHJvcGVydGllcyB0aGF0IGhhdmUgYmVlbiBwYXNzZWQgLSBhcyB0aGVzZSBtdXN0IGJlIGRlY29yYXRlZCBwcm9wZXJ0aWVzXHJcbiAgICB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgY29uc3QgcHJvcGVydGllcyA9IHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpO1xyXG4gICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgdm5vZGUucHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHByb3BlcnRpZXMsIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2soISF2bm9kZS5pbnNlcnRlZCksIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlLCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgdm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgaWYgKHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgd2hpbGUgKHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbC5yZXF1ZXN0SWRsZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwcm9qZWN0b3JTdGF0ZS5yZW5kZXJTY2hlZHVsZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgcHJvamVjdG9yU3RhdGUucmVuZGVyU2NoZWR1bGVkID0gdW5kZWZpbmVkO1xyXG4gICAgY29uc3QgcmVuZGVyUXVldWUgPSBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZTtcclxuICAgIGNvbnN0IHJlbmRlcnMgPSBbLi4ucmVuZGVyUXVldWVdO1xyXG4gICAgcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWUgPSBbXTtcclxuICAgIHJlbmRlcnMuc29ydCgoYSwgYikgPT4gYS5kZXB0aCAtIGIuZGVwdGgpO1xyXG4gICAgY29uc3QgcHJldmlvdXNseVJlbmRlcmVkID0gW107XHJcbiAgICB3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCB7IGluc3RhbmNlIH0gPSByZW5kZXJzLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlTWFwLmhhcyhpbnN0YW5jZSkgJiYgcHJldmlvdXNseVJlbmRlcmVkLmluZGV4T2YoaW5zdGFuY2UpID09PSAtMSkge1xyXG4gICAgICAgICAgICBwcmV2aW91c2x5UmVuZGVyZWQucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0U2libGluZ3MgPSBuZXh0U2libGluZ01hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB1cGRhdGVEb20oZG5vZGUsIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSwgbmV4dFNpYmxpbmdzLCBuZXh0U2libGluZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxufVxyXG5leHBvcnQgY29uc3QgZG9tID0ge1xyXG4gICAgYXBwZW5kOiBmdW5jdGlvbiAocGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zID0ge30pIHtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGNvbnN0IGZpbmFsUHJvamVjdG9yT3B0aW9ucyA9IGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdG9yU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcclxuICAgICAgICAgICAgZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxyXG4gICAgICAgICAgICBub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxyXG4gICAgICAgICAgICByZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVuZGVyUXVldWU6IFtdLFxyXG4gICAgICAgICAgICBtZXJnZTogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIG1lcmdlRWxlbWVudDogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZU1hcC5zZXQoaW5zdGFuY2UsIHByb2plY3RvclN0YXRlKTtcclxuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFZOb2RlID0gdG9QYXJlbnRWTm9kZShmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUpO1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSk7XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZSB9KTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBmaW5hbFByb2plY3Rvck9wdGlvbnMuZGVwdGggfSk7XHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB1cGRhdGVEb20obm9kZSwgbm9kZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UsIFtdLCBbXSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkb21Ob2RlOiBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGVcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcGVuZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH0sXHJcbiAgICBtZXJnZTogZnVuY3Rpb24gKGVsZW1lbnQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgPSB0cnVlO1xyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdGlvbiA9IHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUubWVyZ2UgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gcHJvamVjdGlvbjtcclxuICAgIH1cclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmRvbS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL3Zkb20ubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvdmRvbS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xudmFyIHdpZGdldEZhY3RvcnkgPSByZXF1aXJlKFwic3JjL21lbnUvTWVudVwiKTtcblxudmFyIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudCA9IHJlcXVpcmUoJ0Bkb2pvL2ZyYW1ld29yay93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xyXG5cclxudmFyIGRlZmF1bHRFeHBvcnQgPSB3aWRnZXRGYWN0b3J5LmRlZmF1bHQ7XHJcbmRlZmF1bHRFeHBvcnQgJiYgcmVnaXN0ZXJDdXN0b21FbGVtZW50KGRlZmF1bHRFeHBvcnQpO1xyXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51L01lbnUhLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51IiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUiLCJpbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2QnO1xyXG5pbXBvcnQgeyBjdXN0b21FbGVtZW50IH0gZnJvbSAnQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudCc7XHJcbmltcG9ydCB7IFdpZGdldFByb3BlcnRpZXMsIFdOb2RlIH0gZnJvbSAnQGRvam8vZnJhbWV3b3JrL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XHJcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby9mcmFtZXdvcmsvd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCB7IE1lbnVJdGVtLCBNZW51SXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9tZW51LWl0ZW0vTWVudUl0ZW0nO1xyXG5cclxuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4vbWVudS5tLmNzcyc7XHJcblxyXG5pbnRlcmZhY2UgTWVudVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcclxuXHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG59XHJcblxyXG5AY3VzdG9tRWxlbWVudDxNZW51UHJvcGVydGllcz4oe1xyXG5cdHRhZzogJ2RlbW8tbWVudScsXHJcblx0ZXZlbnRzOiBbJ29uU2VsZWN0ZWQnXVxyXG59KVxyXG5AdGhlbWUoY3NzKVxyXG5leHBvcnQgY2xhc3MgTWVudSBleHRlbmRzIFRoZW1lZE1peGluKFdpZGdldEJhc2UpPE1lbnVQcm9wZXJ0aWVzLCBXTm9kZTxNZW51SXRlbT4+IHtcclxuXHRwcml2YXRlIF9zZWxlY3RlZElkOiBudW1iZXI7XHJcblxyXG5cdHByaXZhdGUgX29uU2VsZWN0ZWQoaWQ6IG51bWJlciwgZGF0YTogYW55KSB7XHJcblx0XHR0aGlzLl9zZWxlY3RlZElkID0gaWQ7XHJcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZChkYXRhKTtcclxuXHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIHJlbmRlcigpIHtcclxuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRpZiAoY2hpbGQpIHtcclxuXHRcdFx0XHRjb25zdCBwcm9wZXJ0aWVzOiBQYXJ0aWFsPE1lbnVJdGVtUHJvcGVydGllcz4gPSB7XHJcblx0XHRcdFx0XHRvblNlbGVjdGVkOiAoZGF0YTogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMuX29uU2VsZWN0ZWQoaW5kZXgsIGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKHRoaXMuX3NlbGVjdGVkSWQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0cHJvcGVydGllcy5zZWxlY3RlZCA9IGluZGV4ID09PSB0aGlzLl9zZWxlY3RlZElkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGlsZC5wcm9wZXJ0aWVzID0geyAuLi5jaGlsZC5wcm9wZXJ0aWVzLCAuLi5wcm9wZXJ0aWVzIH07XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNoaWxkO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHYoJ25hdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3Mucm9vdCkgfSwgW1xyXG5cdFx0XHR2KFxyXG5cdFx0XHRcdCdvbCcsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MubWVudUNvbnRhaW5lcilcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGl0ZW1zXHJcblx0XHRcdClcclxuXHRcdF0pO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWVudTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9tZW51IS4vc3JjL21lbnUvTWVudS50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJ0ZXN0LWFwcC9tZW51XCIsXCJyb290XCI6XCJtZW51LW1fX3Jvb3RfXzNiQTZqXCIsXCJtZW51Q29udGFpbmVyXCI6XCJtZW51LW1fX21lbnVDb250YWluZXJfXzFlb0dmXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lbnUvbWVudS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvbWVudS9tZW51Lm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudSJdLCJzb3VyY2VSb290IjoiIn0=