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
/* harmony export (immutable) */ __webpack_exports__["c"] = createHandle;
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
    return {
        destroy: function () {
            this.destroy = function () { };
            destructor.call(this);
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
            Object.defineProperty(this, '_name', {
                value: generateName()
            });
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
    get() {
        return this._payload;
    }
    set(payload) {
        this._payload = payload;
        this.emit({ type: 'invalidate' });
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
    defineInjector(label, item) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new __WEBPACK_IMPORTED_MODULE_1__dojo_shim_Map__["b" /* default */]();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error(`injector has already been registered for '${label.toString()}'`);
        }
        this._injectorRegistry.set(label, item);
        this.emitLoadedEvent(label, item);
    }
    get(label) {
        if (!this.has(label)) {
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
        if (!this.hasInjector(label)) {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__diff__ = __webpack_require__("./node_modules/@dojo/widget-core/diff.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RegistryHandler__ = __webpack_require__("./node_modules/@dojo/widget-core/RegistryHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__NodeHandler__ = __webpack_require__("./node_modules/@dojo/widget-core/NodeHandler.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__vdom__ = __webpack_require__("./node_modules/@dojo/widget-core/vdom.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");








const decoratorMap = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
const boundAuto = __WEBPACK_IMPORTED_MODULE_3__diff__["a" /* auto */].bind(null);
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
        this._nodeHandler = new __WEBPACK_IMPORTED_MODULE_5__NodeHandler__["a" /* default */]();
        this._children = [];
        this._decoratorCache = new __WEBPACK_IMPORTED_MODULE_0__dojo_shim_Map__["b" /* default */]();
        this._properties = {};
        this._boundRenderFunc = this.render.bind(this);
        this._boundInvalidate = this.invalidate.bind(this);
        __WEBPACK_IMPORTED_MODULE_6__vdom__["b" /* widgetInstanceMap */].set(this, {
            dirty: true,
            onAttach: () => {
                this.onAttach();
            },
            onDetach: () => {
                this.onDetach();
                this._destroy();
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
        const instanceData = __WEBPACK_IMPORTED_MODULE_6__vdom__["b" /* widgetInstanceMap */].get(this);
        if (instanceData.coreProperties.baseRegistry !== baseRegistry) {
            if (this._registry === undefined) {
                this._registry = new __WEBPACK_IMPORTED_MODULE_4__RegistryHandler__["a" /* default */]();
                this._registry.on('invalidate', this._boundInvalidate);
            }
            this._registry.base = baseRegistry;
            this.invalidate();
        }
        instanceData.coreProperties = coreProperties;
    }
    __setProperties__(originalProperties) {
        const instanceData = __WEBPACK_IMPORTED_MODULE_6__vdom__["b" /* widgetInstanceMap */].get(this);
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
        const instanceData = __WEBPACK_IMPORTED_MODULE_6__vdom__["b" /* widgetInstanceMap */].get(this);
        instanceData.dirty = false;
        const render = this._runBeforeRenders();
        let dNode = render();
        dNode = this.runAfterRenders(dNode);
        this._nodeHandler.clear();
        return dNode;
    }
    invalidate() {
        const instanceData = __WEBPACK_IMPORTED_MODULE_6__vdom__["b" /* widgetInstanceMap */].get(this);
        if (instanceData.invalidate) {
            instanceData.invalidate();
        }
    }
    render() {
        return Object(__WEBPACK_IMPORTED_MODULE_2__d__["f" /* v */])('div', {}, this.children);
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
     * Destroys private resources for WidgetBase
     */
    _destroy() {
        if (this._registry) {
            this._registry.destroy();
        }
        if (this._metaMap !== undefined) {
            this._metaMap.forEach((meta) => {
                meta.destroy();
            });
        }
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
        if (typeof property === 'function' && Object(__WEBPACK_IMPORTED_MODULE_7__Registry__["d" /* isWidgetBaseConstructor */])(property) === false) {
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
            this._registry = new __WEBPACK_IMPORTED_MODULE_4__RegistryHandler__["a" /* default */]();
            this._registry.on('invalidate', this._boundInvalidate);
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WidgetBase;

/**
 * static identifier
 */
WidgetBase._type = __WEBPACK_IMPORTED_MODULE_7__Registry__["b" /* WIDGET_BASE_TYPE */];
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
/* harmony export (immutable) */ __webpack_exports__["e"] = isWNode;
/* harmony export (immutable) */ __webpack_exports__["d"] = isVNode;
/* unused harmony export isElementNode */
/* unused harmony export decorate */
/* harmony export (immutable) */ __webpack_exports__["g"] = w;
/* harmony export (immutable) */ __webpack_exports__["f"] = v;
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
 * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
 */
function isWNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === WNODE);
}
/**
 * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
 */
function isVNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === VNODE);
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
        type: VNODE,
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

/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
function customElement({ tag, properties = [], attributes = [], events = [], childType = __WEBPACK_IMPORTED_MODULE_0__registerCustomElement__["CustomElementChildType"].DOJO }) {
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            attributes,
            properties,
            events,
            childType
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
            const injector = this.registry.getInjector(name);
            if (injector) {
                const registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injector) === -1) {
                    injector.on('invalidate', () => {
                        this.invalidate();
                    });
                    registeredInjectors.push(injector);
                }
                return getProperties(injector.get(), properties);
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
            this._async = true;
            this._projectorProperties = {};
            this._handles = [];
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
            this.own(() => {
                this._root = previousRoot;
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
                node = Object(__WEBPACK_IMPORTED_MODULE_4__d__["f" /* v */])('span', {}, [result]);
            }
            return node;
        }
        own(handle) {
            this._handles.push(handle);
        }
        destroy() {
            while (this._handles.length > 0) {
                const handle = this._handles.pop();
                if (handle) {
                    handle();
                }
            }
        }
        _attach({ type, root }) {
            if (root) {
                this.root = root;
            }
            if (this.projectorState === ProjectorAttachState.Attached) {
                return this._attachHandle;
            }
            this.projectorState = ProjectorAttachState.Attached;
            const handle = () => {
                if (this.projectorState === ProjectorAttachState.Attached) {
                    this._projection = undefined;
                    this.projectorState = ProjectorAttachState.Detached;
                }
            };
            this.own(handle);
            this._attachHandle = Object(__WEBPACK_IMPORTED_MODULE_1__dojo_core_lang__["c" /* createHandle */])(handle);
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
    themeRegistry.defineInjector(INJECTED_THEME_KEY, themeInjector);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WidgetBase__ = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_Projector__ = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_shim_array__ = __webpack_require__("./node_modules/@dojo/shim/array.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__d__ = __webpack_require__("./node_modules/@dojo/widget-core/d.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__ = __webpack_require__("./node_modules/@dojo/shim/global.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Registry__ = __webpack_require__("./node_modules/@dojo/widget-core/Registry.mjs");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Themed__ = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.mjs");







var CustomElementChildType;
(function (CustomElementChildType) {
    CustomElementChildType["DOJO"] = "DOJO";
    CustomElementChildType["NODE"] = "NODE";
    CustomElementChildType["TEXT"] = "TEXT";
})(CustomElementChildType || (CustomElementChildType = {}));
function DomToWidgetWrapper(domNode) {
    return class DomToWidgetWrapper extends __WEBPACK_IMPORTED_MODULE_0__WidgetBase__["a" /* WidgetBase */] {
        render() {
            const properties = Object.keys(this.properties).reduce((props, key) => {
                const value = this.properties[key];
                if (key.indexOf('on') === 0) {
                    key = `__${key}`;
                }
                props[key] = value;
                return props;
            }, {});
            return Object(__WEBPACK_IMPORTED_MODULE_3__d__["c" /* dom */])({ node: domNode, props: properties });
        }
        static get domNode() {
            return domNode;
        }
    };
}
function create(descriptor, WidgetConstructor) {
    const { attributes, childType } = descriptor;
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
                domProperties[filteredPropertyName] = {
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
            Object(__WEBPACK_IMPORTED_MODULE_2__dojo_shim_array__["a" /* from */])(children).forEach((childNode) => {
                if (childType === CustomElementChildType.DOJO) {
                    childNode.addEventListener('dojo-ce-render', () => this._render());
                    childNode.addEventListener('dojo-ce-connected', () => this._render());
                    this._children.push(DomToWidgetWrapper(childNode));
                }
                else {
                    this._children.push(Object(__WEBPACK_IMPORTED_MODULE_3__d__["c" /* dom */])({ node: childNode }));
                }
            });
            this.addEventListener('dojo-ce-connected', (e) => this._childConnected(e));
            const widgetProperties = this._properties;
            const renderChildren = () => this.__children__();
            const Wrapper = class extends __WEBPACK_IMPORTED_MODULE_0__WidgetBase__["a" /* WidgetBase */] {
                render() {
                    return Object(__WEBPACK_IMPORTED_MODULE_3__d__["g" /* w */])(WidgetConstructor, widgetProperties, renderChildren());
                }
            };
            const registry = new __WEBPACK_IMPORTED_MODULE_5__Registry__["c" /* default */]();
            const themeContext = Object(__WEBPACK_IMPORTED_MODULE_6__mixins_Themed__["b" /* registerThemeInjector */])(this._getTheme(), registry);
            __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].addEventListener('dojo-theme-set', () => themeContext.set(this._getTheme()));
            const Projector = Object(__WEBPACK_IMPORTED_MODULE_1__mixins_Projector__["a" /* ProjectorMixin */])(Wrapper);
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
            if (__WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */] && __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].dojoce && __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].dojoce.theme) {
                return __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].dojoce.themes[__WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].dojoce.theme];
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
                    return Object(__WEBPACK_IMPORTED_MODULE_3__d__["g" /* w */])(Child, Object.assign({}, domNode.__properties__()), [...domNode.__children__()]);
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
    __WEBPACK_IMPORTED_MODULE_4__dojo_shim_global__["a" /* default */].customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
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
const renderQueueMap = new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
function same(dnode1, dnode2) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(dnode1) && Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(dnode2)) {
        if (dnode1.tag !== dnode2.tag) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    else if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dnode1) && Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dnode2)) {
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
        deferredRenderCallbacks: [],
        afterRenderCallbacks: [],
        nodeMap: new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */](),
        depth: 0,
        merge: false,
        renderScheduled: undefined,
        renderQueue: [],
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
    const eventMap = projectionOptions.nodeMap.get(domNode) || new __WEBPACK_IMPORTED_MODULE_4__dojo_shim_WeakMap__["a" /* default */]();
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
    projectionOptions.nodeMap.set(domNode, eventMap);
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
        projectionOptions.deferredRenderCallbacks.push(() => {
            domNode.focus();
        });
    }
}
function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions, onlyEvents = false) {
    const eventMap = projectionOptions.nodeMap.get(domNode);
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
            if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(child)) {
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
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(dnode) && dnode.properties) {
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
function callOnDetach(dNodes, parentInstance) {
    dNodes = Array.isArray(dNodes) ? dNodes : [dNodes];
    for (let i = 0; i < dNodes.length; i++) {
        const dNode = dNodes[i];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dNode)) {
            if (dNode.rendered) {
                callOnDetach(dNode.rendered, dNode.instance);
            }
            if (dNode.instance) {
                const instanceData = widgetInstanceMap.get(dNode.instance);
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
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dnode)) {
        const rendered = dnode.rendered || emptyArray;
        for (let i = 0; i < rendered.length; i++) {
            const child = rendered[i];
            if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(child)) {
                child.domNode.parentNode.removeChild(child.domNode);
            }
            else {
                nodeToRemove(child, transitions, projectionOptions);
            }
        }
    }
    else {
        const domNode = dnode.domNode;
        const properties = dnode.properties;
        const exitAnimation = properties.exitAnimation;
        if (properties && exitAnimation) {
            domNode.style.pointerEvents = 'none';
            const removeDomNode = function () {
                domNode && domNode.parentNode && domNode.parentNode.removeChild(domNode);
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
    }
}
function checkDistinguishable(childNodes, indexToCheck, parentInstance) {
    const childNode = childNodes[indexToCheck];
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(childNode) && !childNode.tag) {
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
                    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(childNode)) {
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
    projectionOptions = Object.assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    let oldIndex = 0;
    let newIndex = 0;
    let i;
    let textUpdated = false;
    while (newIndex < newChildrenLength) {
        const oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
        const newChild = newChildren[newIndex];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(newChild) && typeof newChild.deferredPropertiesCallback === 'function') {
            newChild.inserted = Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(oldChild) && oldChild.inserted;
            addDeferredProperties(newChild, projectionOptions);
        }
        if (oldChild !== undefined && same(oldChild, newChild)) {
            textUpdated = updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance) || textUpdated;
            oldIndex++;
        }
        else {
            const findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
            if (findOldIndex >= 0) {
                for (i = oldIndex; i < findOldIndex; i++) {
                    const oldChild = oldChildren[i];
                    const indexToCheck = i;
                    projectionOptions.afterRenderCallbacks.push(() => {
                        callOnDetach(oldChild, parentInstance);
                        checkDistinguishable(oldChildren, indexToCheck, parentInstance);
                    });
                    nodeToRemove(oldChildren[i], transitions, projectionOptions);
                }
                textUpdated =
                    updateDom(oldChildren[findOldIndex], newChild, projectionOptions, parentVNode, parentInstance) ||
                        textUpdated;
                oldIndex = findOldIndex + 1;
            }
            else {
                let insertBefore = undefined;
                let child = oldChildren[oldIndex];
                if (child) {
                    let nextIndex = oldIndex + 1;
                    while (insertBefore === undefined) {
                        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(child)) {
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
                const indexToCheck = newIndex;
                projectionOptions.afterRenderCallbacks.push(() => {
                    checkDistinguishable(newChildren, indexToCheck, parentInstance);
                });
            }
        }
        newIndex++;
    }
    if (oldChildrenLength > oldIndex) {
        // Remove child fragments
        for (i = oldIndex; i < oldChildrenLength; i++) {
            const oldChild = oldChildren[i];
            const indexToCheck = i;
            projectionOptions.afterRenderCallbacks.push(() => {
                callOnDetach(oldChild, parentInstance);
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            nodeToRemove(oldChildren[i], transitions, projectionOptions);
        }
    }
    return textUpdated;
}
function addChildren(parentVNode, children, projectionOptions, parentInstance, insertBefore = undefined, childNodes) {
    if (children === undefined) {
        return;
    }
    if (projectionOptions.merge && childNodes === undefined) {
        childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__dojo_shim_array__["a" /* from */])(parentVNode.domNode.childNodes);
    }
    projectionOptions = Object.assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["d" /* isVNode */])(child)) {
            if (projectionOptions.merge && childNodes) {
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
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dnode)) {
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
                const renderQueue = renderQueueMap.get(projectionOptions.projectorInstance);
                renderQueue.push({ instance, depth: projectionOptions.depth });
                scheduleRender(projectionOptions);
            }
        };
        instanceData.rendering = true;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        instanceData.rendering = false;
        const rendered = instance.__render__();
        if (rendered) {
            const filteredRendered = filterAndDecorateChildren(rendered, instance);
            dnode.rendered = filteredRendered;
            addChildren(parentVNode, filteredRendered, projectionOptions, instance, insertBefore, childNodes);
        }
        instanceMap.set(instance, { dnode, parentVNode });
        instanceData.nodeHandler.addRoot();
        projectionOptions.afterRenderCallbacks.push(() => {
            instanceData.onAttach();
        });
    }
    else {
        if (projectionOptions.merge && projectionOptions.mergeElement !== undefined) {
            domNode = dnode.domNode = projectionOptions.mergeElement;
            projectionOptions.mergeElement = undefined;
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
    if (Object(__WEBPACK_IMPORTED_MODULE_2__d__["e" /* isWNode */])(dnode)) {
        const { instance } = previous;
        if (instance) {
            const { parentVNode, dnode: node } = instanceMap.get(instance);
            const previousRendered = node ? node.rendered : previous.rendered;
            const instanceData = widgetInstanceMap.get(instance);
            instanceData.rendering = true;
            instance.__setCoreProperties__(dnode.coreProperties);
            instance.__setChildren__(dnode.children);
            instance.__setProperties__(dnode.properties);
            instanceData.rendering = false;
            dnode.instance = instance;
            instanceMap.set(instance, { dnode, parentVNode });
            if (instanceData.dirty === true) {
                const rendered = instance.__render__();
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
    vnode.properties = Object.assign({}, properties, vnode.decoratedDeferredProperties);
    projectionOptions.deferredRenderCallbacks.push(() => {
        const properties = Object.assign({}, vnode.deferredPropertiesCallback(!!vnode.inserted), vnode.decoratedDeferredProperties);
        updateProperties(vnode.domNode, vnode.properties, properties, projectionOptions);
        vnode.properties = properties;
    });
}
function runDeferredRenderCallbacks(projectionOptions) {
    if (projectionOptions.deferredRenderCallbacks.length) {
        if (projectionOptions.sync) {
            while (projectionOptions.deferredRenderCallbacks.length) {
                const callback = projectionOptions.deferredRenderCallbacks.shift();
                callback && callback();
            }
        }
        else {
            __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestAnimationFrame(() => {
                while (projectionOptions.deferredRenderCallbacks.length) {
                    const callback = projectionOptions.deferredRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function runAfterRenderCallbacks(projectionOptions) {
    if (projectionOptions.sync) {
        while (projectionOptions.afterRenderCallbacks.length) {
            const callback = projectionOptions.afterRenderCallbacks.shift();
            callback && callback();
        }
    }
    else {
        if (__WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestIdleCallback) {
            __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestIdleCallback(() => {
                while (projectionOptions.afterRenderCallbacks.length) {
                    const callback = projectionOptions.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
        else {
            setTimeout(() => {
                while (projectionOptions.afterRenderCallbacks.length) {
                    const callback = projectionOptions.afterRenderCallbacks.shift();
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
        projectionOptions.renderScheduled = __WEBPACK_IMPORTED_MODULE_0__dojo_shim_global__["a" /* default */].requestAnimationFrame(() => {
            render(projectionOptions);
        });
    }
}
function render(projectionOptions) {
    projectionOptions.renderScheduled = undefined;
    const renderQueue = renderQueueMap.get(projectionOptions.projectorInstance);
    const renders = [...renderQueue];
    renderQueueMap.set(projectionOptions.projectorInstance, []);
    renders.sort((a, b) => a.depth - b.depth);
    while (renders.length) {
        const { instance } = renders.shift();
        const { parentVNode, dnode } = instanceMap.get(instance);
        const instanceData = widgetInstanceMap.get(instance);
        updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance);
    }
    runAfterRenderCallbacks(projectionOptions);
    runDeferredRenderCallbacks(projectionOptions);
}
const dom = {
    append: function (parentNode, instance, projectionOptions = {}) {
        const instanceData = widgetInstanceMap.get(instance);
        const finalProjectorOptions = getProjectionOptions(projectionOptions, instance);
        finalProjectorOptions.rootNode = parentNode;
        const parentVNode = toParentVNode(finalProjectorOptions.rootNode);
        const node = toInternalWNode(instance, instanceData);
        const renderQueue = [];
        instanceMap.set(instance, { dnode: node, parentVNode });
        renderQueueMap.set(finalProjectorOptions.projectorInstance, renderQueue);
        instanceData.invalidate = () => {
            instanceData.dirty = true;
            if (instanceData.rendering === false) {
                const renderQueue = renderQueueMap.get(finalProjectorOptions.projectorInstance);
                renderQueue.push({ instance, depth: finalProjectorOptions.depth });
                scheduleRender(finalProjectorOptions);
            }
        };
        updateDom(node, node, finalProjectorOptions, parentVNode, instance);
        finalProjectorOptions.afterRenderCallbacks.push(() => {
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
        return this.append(element.parentNode, instance, projectionOptions);
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
        return Object(__WEBPACK_IMPORTED_MODULE_1__dojo_widget_core_d__["f" /* v */])('li', { classes: this.theme(__WEBPACK_IMPORTED_MODULE_5__menuItem_m_css__["root"]) }, [
            Object(__WEBPACK_IMPORTED_MODULE_1__dojo_widget_core_d__["f" /* v */])('span', {
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
module.exports = {" _key":"test-app/menuItem","root":"sUmUi4Sh","item":"_2Mk6Rdqa","selected":"_1-f3ItOh"};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js");


/***/ })

/******/ }));;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGJhYzYzOTY3MWYyOTc2N2UxYWYiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9JbmplY3Rvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2QubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGlmZi5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IubWpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lbnUtaXRlbS9NZW51SXRlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVudS1pdGVtL21lbnVJdGVtLm0uY3NzPzZhOTUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDN0RnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0Esd0M7Ozs7Ozs7Ozs7O0FDdkRBO0FBQ3NCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGdDQUFnQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0Esb0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkVpQjtBQUNBO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsaUM7Ozs7Ozs7Ozs7OztBQ2hNQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLE9BQU8saUJBQWlCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsUUFBUTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQzs7Ozs7Ozs7Ozs7Ozs7O0FDbk1vQztBQUNwQztBQUN5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFCQUFxQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxZQUFZO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFlBQVk7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7Ozs7Ozs7QUMvRkE7QUFDeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7O0FDdE1BO0FBQ0E7QUFDNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBSTtBQUNwQixnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFJO0FBQ2hCLFlBQVksVUFBVTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxtQzs7Ozs7Ozs7Ozs7OztBQ2hKQTtBQUNzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hIQTtBQUNrQztBQUNQO0FBQzNCO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsc0JBQXNCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0M7Ozs7Ozs7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG1DOzs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7QUFDaUQ7QUFDakQsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlHQTtBQUNBO0FBQ3FCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RkFBd0Y7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7OztBQ3hTbUI7QUFDbkI7MEVBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsRUFBRTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxFQUFFO0FBQ2pFLG1DQUFtQyxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxnQzs7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQTtBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQzs7Ozs7Ozs7O0FDekxBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQzs7Ozs7Ozs7O0FDdEJrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLHFDOzs7Ozs7Ozs7OztBQ2ZrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsc0NBQXNDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBLG1CQUFtQiw2QkFBNkI7QUFDaEQ7QUFDQTtBQUNBLG1CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLHdDOzs7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSxpQkFBaUI7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsaUJBQWlCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7QUMzR2M7QUFDSTtBQUNDO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0EsNEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RUE7QUFDQTtBQUNZO0FBQ0c7QUFDZjtBQUNBO0FBQzRCO0FBQ3dCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLGFBQWE7QUFDekYsbUNBQW1DLDBCQUEwQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QseUJBQXlCO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0EsNkRBQTZELHlCQUF5QjtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QyxhQUFhLGtCQUFrQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUM7Ozs7Ozs7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxjQUFjO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOERBQThELGVBQWU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDOzs7Ozs7Ozs7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQXFCLGlCQUFpQixZQUFZLFNBQVMscUJBQXFCO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCOzs7Ozs7Ozs7O0FDbEcwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdDOzs7Ozs7Ozs7O0FDUDBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkM7Ozs7Ozs7Ozs7QUNQaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBK0Isc0pBQThGO0FBQzdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQzs7Ozs7Ozs7OztBQ2pCMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLGFBQWE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseUM7Ozs7Ozs7O0FDckJBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDOzs7Ozs7Ozs7Ozs7QUNqQkE7QUFDMEI7QUFDQztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7O0FDbkMyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakVBO0FBQ2lCO0FBQ007QUFDdkI7QUFDc0I7QUFDVjtBQUNFO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9EQUFvRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsZ0NBQWdDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtIQUFpRDtBQUNqRCx5Q0FBeUMsZ0RBQWdEO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixhQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCw0QkFBNEIscUJBQXFCO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqS0E7QUFDbUI7QUFDRjtBQUNTO0FBQ0g7QUFDTDtBQUNsQjtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVyxFQUFFO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsaUJBQWlCLElBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDLGFBQWEsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUlxQjtBQUNJO0FBQ1Y7QUFDRTtBQUNqQjtBQUNBO0FBQ2dDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHdEQUF3RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsSUFBSTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxhQUFhLElBQUk7QUFDakIsNEVBQXdCLG1DQUFtQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsd0JBQXdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlDQUFpQztBQUNwRCwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUdBQTZDLGtCQUFrQjtBQUMvRDtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxXQUFXO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsVUFBVTtBQUNyQyx3R0FBb0Q7QUFDcEQsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0TUE7QUFDNEI7QUFDYTtBQUNQO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG1DQUFtQztBQUM5QztBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsZ0JBQWdCLGVBQWUsc0NBQXNDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix1Q0FBdUM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsNEJBQTRCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsNEJBQTRCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsdUJBQXVCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkJBQTJCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLGlCQUFpQixLQUFLO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsV0FBVyxrTEFBa0wsZUFBZTtBQUMxUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msc0JBQXNCLHFDQUFxQztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNCQUFzQixxQ0FBcUM7QUFDbkcsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEMsb0NBQW9DO0FBQ3BDLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQSxpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsb0JBQW9CO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQ0FBMkM7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELHNCQUFzQiwyQkFBMkI7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBLG1CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxzQkFBc0IsMkJBQTJCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQscUJBQXFCO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUIsZUFBZSxxQkFBcUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLDJCQUEyQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLCtDQUErQztBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGlDOzs7Ozs7O0FDejNCQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2THRDO0FBQUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxnQkFBZ0Isc0NBQXNDLGlCQUFpQixFQUFFO0FBQy9FLHFCQUFxQix1REFBdUQ7O0FBRTVFO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEMsT0FBTztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsY0FBYztBQUMxRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxvQ0FBb0M7QUFDdkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGFBQWEsNkJBQTZCLDBCQUEwQixhQUFhLEVBQUUscUJBQXFCO0FBQ3hHLGdCQUFnQixxREFBcUQsb0VBQW9FLGFBQWEsRUFBRTtBQUN4SixzQkFBc0Isc0JBQXNCLHFCQUFxQixHQUFHO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QyxrQ0FBa0MsU0FBUztBQUMzQyxrQ0FBa0MsV0FBVyxVQUFVO0FBQ3ZELHlDQUF5QyxjQUFjO0FBQ3ZEO0FBQ0EsNkdBQTZHLE9BQU8sVUFBVTtBQUM5SCxnRkFBZ0YsaUJBQWlCLE9BQU87QUFDeEcsd0RBQXdELGdCQUFnQixRQUFRLE9BQU87QUFDdkYsOENBQThDLGdCQUFnQixnQkFBZ0IsT0FBTztBQUNyRjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EsU0FBUyxZQUFZLGFBQWEsT0FBTyxFQUFFLFVBQVUsV0FBVztBQUNoRSxtQ0FBbUMsU0FBUztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE1BQU0sZ0JBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsc0JBQXNCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNGQUFzRixhQUFhLEVBQUU7QUFDdEgsc0JBQXNCLGdDQUFnQyxxQ0FBcUMsMENBQTBDLEVBQUUsRUFBRSxHQUFHO0FBQzVJLDJCQUEyQixNQUFNLGVBQWUsRUFBRSxZQUFZLG9CQUFvQixFQUFFO0FBQ3BGLHNCQUFzQixvR0FBb0c7QUFDMUgsNkJBQTZCLHVCQUF1QjtBQUNwRCw0QkFBNEIsd0JBQXdCO0FBQ3BELDJCQUEyQix5REFBeUQ7QUFDcEY7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQiw0Q0FBNEMsU0FBUyxFQUFFLHFEQUFxRCxhQUFhLEVBQUU7QUFDNUkseUJBQXlCLGdDQUFnQyxvQkFBb0IsZ0RBQWdELGdCQUFnQixHQUFHO0FBQ2hKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsdUNBQXVDLGFBQWEsRUFBRSxFQUFFLE9BQU8sa0JBQWtCO0FBQ2pIO0FBQ0E7Ozs7Ozs7O0FDcktBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJ3QztBQUNtQztBQUVOO0FBQ1g7QUFFbEI7QUFnQnhDLElBQWEsUUFBUSxHQUFyQixjQUFzQixTQUFRLDRGQUFXLENBQUMsZ0ZBQVUsQ0FBcUI7SUFDaEUsUUFBUTtRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVTLE1BQU07UUFDZixNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFNUMsTUFBTSxDQUFDLHNFQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMscURBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDakQsc0VBQUMsQ0FDQSxNQUFNLEVBQ047Z0JBQ0MsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxxREFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMseURBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUTthQUN0QixFQUNELENBQUMsS0FBSyxDQUFDLENBQ1A7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUFuQlksUUFBUTtJQVBwQix5R0FBYSxDQUFxQjtRQUNsQyxHQUFHLEVBQUUsZ0JBQWdCO1FBQ3JCLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDakMsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3RCLFVBQVUsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7S0FDaEMsQ0FBQztJQUNELHNGQUFLLENBQUMsNkNBQUcsQ0FBQztHQUNFLFFBQVEsQ0FtQnBCO0FBbkJvQjtBQXFCckIsK0RBQWUsUUFBUSxFQUFDOzs7Ozs7OztBQzNDeEI7QUFDQSxrQkFBa0IseUYiLCJmaWxlIjoibWVudS1pdGVtLTEuMC4wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMGJhYzYzOTY3MWYyOTc2N2UxYWYiLCJpbXBvcnQgeyBjcmVhdGVDb21wb3NpdGVIYW5kbGUgfSBmcm9tICcuL2xhbmcnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnQGRvam8vc2hpbS9Qcm9taXNlJztcbi8qKlxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG59XG4vKipcbiAqIE5vIG9wIGZ1bmN0aW9uIHVzZWQgdG8gcmVwbGFjZSBvd24sIG9uY2UgaW5zdGFuY2UgaGFzIGJlZW4gZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3llZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGwgbWFkZSB0byBkZXN0cm95ZWQgbWV0aG9kJyk7XG59XG5leHBvcnQgY2xhc3MgRGVzdHJveWFibGUge1xuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SGFuZGxlfSBoYW5kbGUgVGhlIGhhbmRsZSB0byBhZGQgZm9yIHRoZSBpbnN0YW5jZVxuICAgICAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxuICAgICAqL1xuICAgIG93bihoYW5kbGVzKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgPyBjcmVhdGVDb21wb3NpdGVIYW5kbGUoLi4uaGFuZGxlcykgOiBoYW5kbGVzO1xuICAgICAgICBjb25zdCB7IGhhbmRsZXM6IF9oYW5kbGVzIH0gPSB0aGlzO1xuICAgICAgICBfaGFuZGxlcy5wdXNoKGhhbmRsZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIF9oYW5kbGVzLnNwbGljZShfaGFuZGxlcy5pbmRleE9mKGhhbmRsZSkpO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlc3RycHlzIGFsbCBoYW5kZXJzIHJlZ2lzdGVyZWQgZm9yIHRoZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IHtcbiAgICAgICAgICAgICAgICBoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95ID0gbm9vcDtcbiAgICAgICAgICAgIHRoaXMub3duID0gZGVzdHJveWVkO1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRGVzdHJveWFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1EZXN0cm95YWJsZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9EZXN0cm95YWJsZS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgeyBEZXN0cm95YWJsZSB9IGZyb20gJy4vRGVzdHJveWFibGUnO1xuLyoqXG4gKiBNYXAgb2YgY29tcHV0ZWQgcmVndWxhciBleHByZXNzaW9ucywga2V5ZWQgYnkgc3RyaW5nXG4gKi9cbmNvbnN0IHJlZ2V4TWFwID0gbmV3IE1hcCgpO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSBldmVudCB0eXBlIGdsb2IgaGFzIGJlZW4gbWF0Y2hlZFxuICpcbiAqIEByZXR1cm5zIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGdsb2IgaXMgbWF0Y2hlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iTWF0Y2goZ2xvYlN0cmluZywgdGFyZ2V0U3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcbiAgICAgICAgbGV0IHJlZ2V4O1xuICAgICAgICBpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XG4gICAgICAgICAgICByZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7Z2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJyl9JGApO1xuICAgICAgICAgICAgcmVnZXhNYXAuc2V0KGdsb2JTdHJpbmcsIHJlZ2V4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh0YXJnZXRTdHJpbmcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcbiAgICB9XG59XG4vKipcbiAqIEV2ZW50IENsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudGVkIGV4dGVuZHMgRGVzdHJveWFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogbWFwIG9mIGxpc3RlbmVycyBrZXllZCBieSBldmVudCB0eXBlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgZW1pdChldmVudCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcC5mb3JFYWNoKChtZXRob2RzLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNHbG9iTWF0Y2godHlwZSwgZXZlbnQudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBtZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2QuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXMgPSBsaXN0ZW5lci5tYXAoKGxpc3RlbmVyKSA9PiB0aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVzLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlLmRlc3Ryb3koKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBfYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNNYXAuZ2V0KHR5cGUpIHx8IFtdO1xuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzTWFwLnNldCh0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVzdHJveTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgRXZlbnRlZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUV2ZW50ZWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5leHBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9zaGltL29iamVjdCc7XG5jb25zdCBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbi8qKlxuICogVHlwZSBndWFyZCB0aGF0IGVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQgdG8gT2JqZWN0XG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXG4gKiBOb3RlOiBJbiBFUzYgaXQgaXMgcG9zc2libGUgdG8gbW9kaWZ5IGFuIG9iamVjdCdzIFN5bWJvbC50b1N0cmluZ1RhZyBwcm9wZXJ0eSwgd2hpY2ggd2lsbFxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cbiAqIEBwYXJhbSAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcbiAqL1xuZnVuY3Rpb24gc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5mdW5jdGlvbiBjb3B5QXJyYXkoYXJyYXksIGluaGVyaXRlZCkge1xuICAgIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3B5QXJyYXkoaXRlbSwgaW5oZXJpdGVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXNob3VsZERlZXBDb3B5T2JqZWN0KGl0ZW0pXG4gICAgICAgICAgICA/IGl0ZW1cbiAgICAgICAgICAgIDogX21peGluKHtcbiAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluaGVyaXRlZDogaW5oZXJpdGVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZXM6IFtpdGVtXSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHt9XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIF9taXhpbihrd0FyZ3MpIHtcbiAgICBjb25zdCBkZWVwID0ga3dBcmdzLmRlZXA7XG4gICAgY29uc3QgaW5oZXJpdGVkID0ga3dBcmdzLmluaGVyaXRlZDtcbiAgICBjb25zdCB0YXJnZXQgPSBrd0FyZ3MudGFyZ2V0O1xuICAgIGNvbnN0IGNvcGllZCA9IGt3QXJncy5jb3BpZWQgfHwgW107XG4gICAgY29uc3QgY29waWVkQ2xvbmUgPSBbLi4uY29waWVkXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGt3QXJncy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGt3QXJncy5zb3VyY2VzW2ldO1xuICAgICAgICBpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvcGllZENsb25lLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRlZXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvcHlBcnJheSh2YWx1ZSwgaW5oZXJpdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV0gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3BpZWQucHVzaChzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfbWl4aW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlczogW3ZhbHVlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIC4uLm1peGlucykge1xuICAgIGlmICghbWl4aW5zLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcbiAgICB9XG4gICAgY29uc3QgYXJncyA9IG1peGlucy5zbGljZSgpO1xuICAgIGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xuICAgIHJldHVybiBhc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gX21peGluKHtcbiAgICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgICAgaW5oZXJpdGVkOiBmYWxzZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW4odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gICAgcmV0dXJuIF9taXhpbih7XG4gICAgICAgIGRlZXA6IHRydWUsXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGUoc291cmNlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XG4gICAgcmV0dXJuIGRlZXBNaXhpbih0YXJnZXQsIHNvdXJjZSk7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lOyBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSWRlbnRpY2FsKGEsIGIpIHtcbiAgICByZXR1cm4gKGEgPT09IGIgfHxcbiAgICAgICAgLyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xuICAgICAgICAoYSAhPT0gYSAmJiBiICE9PSBiKSk7XG59XG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xuICogYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGluc3RlYWQgb2YgYSBmdW5jdGlvbiBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIG1ldGhvZCBvbiBhbiBvYmplY3QuXG4gKiBBcyBhIHJlc3VsdCwgdGhlIGZ1bmN0aW9uIHJldHVybmVkIGJ5IGBsYXRlQmluZGAgd2lsbCBhbHdheXMgY2FsbCB0aGUgZnVuY3Rpb24gY3VycmVudGx5IGFzc2lnbmVkIHRvXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXG4gKlxuICogQHBhcmFtIGluc3RhbmNlIFRoZSBjb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcHJlcGVuZCB0byB0aGUgYGluc3RhbmNlW21ldGhvZF1gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF0ZUJpbmQoaW5zdGFuY2UsIG1ldGhvZCwgLi4uc3VwcGxpZWRBcmdzKSB7XG4gICAgcmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGhcbiAgICAgICAgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcbiAgICAgICAgICAgIC8vIFRTNzAxN1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gVFM3MDE3XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gX21peGluKHtcbiAgICAgICAgZGVlcDogZmFsc2UsXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcbiAgICAgICAgc291cmNlczogc291cmNlcyxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcbiAgICB9KTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXG4gKiBMaWtlIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBkb2VzIG5vdCBhbHRlciBleGVjdXRpb24gY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhlIGB0YXJnZXRGdW5jdGlvbmAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsKHRhcmdldEZ1bmN0aW9uLCAuLi5zdXBwbGllZEFyZ3MpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcbiAgICAgICAgcmV0dXJuIHRhcmdldEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG59XG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBkZXN0cm95IG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgY2FsbHMgdGhlIHBhc3NlZC1pbiBkZXN0cnVjdG9yLlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcbiAqIGV2ZW50IGxpc3RlbmVycywgdGltZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGRlc3RydWN0b3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgICAgICAgICBkZXN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlcyBBbiBhcnJheSBvZiBoYW5kbGVzIHdpdGggYGRlc3Ryb3lgIG1ldGhvZHNcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSguLi5oYW5kbGVzKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhhbmRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhbmcubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJmdW5jdGlvbiBpc0ZlYXR1cmVUZXN0VGhlbmFibGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcbn1cbi8qKlxuICogQSBjYWNoZSBvZiByZXN1bHRzIG9mIGZlYXR1cmUgdGVzdHNcbiAqL1xuZXhwb3J0IGNvbnN0IHRlc3RDYWNoZSA9IHt9O1xuLyoqXG4gKiBBIGNhY2hlIG9mIHRoZSB1bi1yZXNvbHZlZCBmZWF0dXJlIHRlc3RzXG4gKi9cbmV4cG9ydCBjb25zdCB0ZXN0RnVuY3Rpb25zID0ge307XG4vKipcbiAqIEEgY2FjaGUgb2YgdW5yZXNvbHZlZCB0aGVuYWJsZXMgKHByb2JhYmx5IHByb21pc2VzKVxuICogQHR5cGUge3t9fVxuICovXG5jb25zdCB0ZXN0VGhlbmFibGVzID0ge307XG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUgKGB3aW5kb3dgIGluIGEgYnJvd3NlciwgYGdsb2JhbGAgaW4gTm9kZUpTKVxuICovXG5jb25zdCBnbG9iYWxTY29wZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gQnJvd3NlcnNcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gTm9kZVxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gV2ViIHdvcmtlcnNcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIHt9O1xufSkoKTtcbi8qIEdyYWIgdGhlIHN0YXRpY0ZlYXR1cmVzIGlmIHRoZXJlIGFyZSBhdmFpbGFibGUgKi9cbmNvbnN0IHsgc3RhdGljRmVhdHVyZXMgfSA9IGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudCB8fCB7fTtcbi8qIENsZWFuaW5nIHVwIHRoZSBEb2pvSGFzRW52aW9ybm1lbnQgKi9cbmlmICgnRG9qb0hhc0Vudmlyb25tZW50JyBpbiBnbG9iYWxTY29wZSkge1xuICAgIGRlbGV0ZSBnbG9iYWxTY29wZS5Eb2pvSGFzRW52aXJvbm1lbnQ7XG59XG4vKipcbiAqIEN1c3RvbSB0eXBlIGd1YXJkIHRvIG5hcnJvdyB0aGUgYHN0YXRpY0ZlYXR1cmVzYCB0byBlaXRoZXIgYSBtYXAgb3IgYSBmdW5jdGlvbiB0aGF0XG4gKiByZXR1cm5zIGEgbWFwLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ3VhcmQgZm9yXG4gKi9cbmZ1bmN0aW9uIGlzU3RhdGljRmVhdHVyZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8qKlxuICogVGhlIGNhY2hlIG9mIGFzc2VydGVkIGZlYXR1cmVzIHRoYXQgd2VyZSBhdmFpbGFibGUgaW4gdGhlIGdsb2JhbCBzY29wZSB3aGVuIHRoZVxuICogbW9kdWxlIGxvYWRlZFxuICovXG5jb25zdCBzdGF0aWNDYWNoZSA9IHN0YXRpY0ZlYXR1cmVzXG4gICAgPyBpc1N0YXRpY0ZlYXR1cmVGdW5jdGlvbihzdGF0aWNGZWF0dXJlcykgPyBzdGF0aWNGZWF0dXJlcy5hcHBseShnbG9iYWxTY29wZSkgOiBzdGF0aWNGZWF0dXJlc1xuICAgIDoge307IC8qIFByb3ZpZGluZyBhbiBlbXB0eSBjYWNoZSwgaWYgbm9uZSB3YXMgaW4gdGhlIGVudmlyb25tZW50XG5cbi8qKlxuKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxuKlxuKiBDb25kaXRpb25hbCBsb2FkcyBtb2R1bGVzIGJhc2VkIG9uIGEgaGFzIGZlYXR1cmUgdGVzdCB2YWx1ZS5cbipcbiogQHBhcmFtIHJlc291cmNlSWQgR2l2ZXMgdGhlIHJlc29sdmVkIG1vZHVsZSBpZCB0byBsb2FkLlxuKiBAcGFyYW0gcmVxdWlyZSBUaGUgbG9hZGVyIHJlcXVpcmUgZnVuY3Rpb24gd2l0aCByZXNwZWN0IHRvIHRoZSBtb2R1bGUgdGhhdCBjb250YWluZWQgdGhlIHBsdWdpbiByZXNvdXJjZSBpbiBpdHNcbiogICAgICAgICAgICAgICAgZGVwZW5kZW5jeSBsaXN0LlxuKiBAcGFyYW0gbG9hZCBDYWxsYmFjayB0byBsb2FkZXIgdGhhdCBjb25zdW1lcyByZXN1bHQgb2YgcGx1Z2luIGRlbWFuZC5cbiovXG5leHBvcnQgZnVuY3Rpb24gbG9hZChyZXNvdXJjZUlkLCByZXF1aXJlLCBsb2FkLCBjb25maWcpIHtcbiAgICByZXNvdXJjZUlkID8gcmVxdWlyZShbcmVzb3VyY2VJZF0sIGxvYWQpIDogbG9hZCgpO1xufVxuLyoqXG4gKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxuICpcbiAqIFJlc29sdmVzIHJlc291cmNlSWQgaW50byBhIG1vZHVsZSBpZCBiYXNlZCBvbiBwb3NzaWJseS1uZXN0ZWQgdGVuYXJ5IGV4cHJlc3Npb24gdGhhdCBicmFuY2hlcyBvbiBoYXMgZmVhdHVyZSB0ZXN0XG4gKiB2YWx1ZShzKS5cbiAqXG4gKiBAcGFyYW0gcmVzb3VyY2VJZCBUaGUgaWQgb2YgdGhlIG1vZHVsZVxuICogQHBhcmFtIG5vcm1hbGl6ZSBSZXNvbHZlcyBhIHJlbGF0aXZlIG1vZHVsZSBpZCBpbnRvIGFuIGFic29sdXRlIG1vZHVsZSBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHJlc291cmNlSWQsIG5vcm1hbGl6ZSkge1xuICAgIGNvbnN0IHRva2VucyA9IHJlc291cmNlSWQubWF0Y2goL1tcXD86XXxbXjpcXD9dKi9nKSB8fCBbXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZnVuY3Rpb24gZ2V0KHNraXApIHtcbiAgICAgICAgY29uc3QgdGVybSA9IHRva2Vuc1tpKytdO1xuICAgICAgICBpZiAodGVybSA9PT0gJzonKSB7XG4gICAgICAgICAgICAvLyBlbXB0eSBzdHJpbmcgbW9kdWxlIG5hbWUsIHJlc29sdmVzIHRvIG51bGxcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcG9zdGZpeGVkIHdpdGggYSA/IG1lYW5zIGl0IGlzIGEgZmVhdHVyZSB0byBicmFuY2ggb24sIHRoZSB0ZXJtIGlzIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXG4gICAgICAgICAgICBpZiAodG9rZW5zW2krK10gPT09ICc/Jykge1xuICAgICAgICAgICAgICAgIGlmICghc2tpcCAmJiBoYXModGVybSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hlZCB0aGUgZmVhdHVyZSwgZ2V0IHRoZSBmaXJzdCB2YWx1ZSBmcm9tIHRoZSBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpZCBub3QgbWF0Y2gsIGdldCB0aGUgc2Vjb25kIHZhbHVlLCBwYXNzaW5nIG92ZXIgdGhlIGZpcnN0XG4gICAgICAgICAgICAgICAgICAgIGdldCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChza2lwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhIG1vZHVsZVxuICAgICAgICAgICAgcmV0dXJuIHRlcm07XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZXQoKTtcbiAgICByZXR1cm4gaWQgJiYgbm9ybWFsaXplKGlkKTtcbn1cbi8qKlxuICogQ2hlY2sgaWYgYSBmZWF0dXJlIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZFxuICpcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGlzdHMoZmVhdHVyZSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBCb29sZWFuKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlIHx8IG5vcm1hbGl6ZWRGZWF0dXJlIGluIHRlc3RDYWNoZSB8fCB0ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXSk7XG59XG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IHRlc3QgZm9yIGEgbmFtZWQgZmVhdHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaGFzLmFkZCgnZG9tLWFkZGV2ZW50bGlzdGVuZXInLCAhIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpO1xuICpcbiAqIEBleGFtcGxlXG4gKiBoYXMuYWRkKCd0b3VjaC1ldmVudHMnLCBmdW5jdGlvbiAoKSB7XG4gKiAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnRcbiAqIH0pO1xuICpcbiAqIEBwYXJhbSBmZWF0dXJlIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHJlcG9ydGVkIG9mIHRoZSBmZWF0dXJlLCBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBvbmNlIG9uIGZpcnN0IHRlc3RcbiAqIEBwYXJhbSBvdmVyd3JpdGUgaWYgYW4gZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGJlIG92ZXJ3cml0dGVuLiBEZWZhdWx0cyB0byBmYWxzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChmZWF0dXJlLCB2YWx1ZSwgb3ZlcndyaXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZXhpc3RzKG5vcm1hbGl6ZWRGZWF0dXJlKSAmJiAhb3ZlcndyaXRlICYmICEobm9ybWFsaXplZEZlYXR1cmUgaW4gc3RhdGljQ2FjaGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEZlYXR1cmUgXCIke2ZlYXR1cmV9XCIgZXhpc3RzIGFuZCBvdmVyd3JpdGUgbm90IHRydWUuYCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNGZWF0dXJlVGVzdFRoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdID0gdmFsdWUudGhlbigocmVzb2x2ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGVzdENhY2hlW2ZlYXR1cmVdID0gcmVzb2x2ZWRWYWx1ZTtcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XG4gICAgICAgIGRlbGV0ZSB0ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXTtcbiAgICB9XG59XG4vKipcbiAqIFJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBhIG5hbWVkIGZlYXR1cmUuXG4gKlxuICogQHBhcmFtIGZlYXR1cmUgVGhlIG5hbWUgKGlmIGEgc3RyaW5nKSBvciBpZGVudGlmaWVyIChpZiBhbiBpbnRlZ2VyKSBvZiB0aGUgZmVhdHVyZSB0byB0ZXN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYXMoZmVhdHVyZSkge1xuICAgIGxldCByZXN1bHQ7XG4gICAgY29uc3Qgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlKSB7XG4gICAgICAgIHJlc3VsdCA9IHN0YXRpY0NhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pIHtcbiAgICAgICAgcmVzdWx0ID0gdGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXSA9IHRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdLmNhbGwobnVsbCk7XG4gICAgICAgIGRlbGV0ZSB0ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9ybWFsaXplZEZlYXR1cmUgaW4gdGVzdENhY2hlKSB7XG4gICAgICAgIHJlc3VsdCA9IHRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV07XG4gICAgfVxuICAgIGVsc2UgaWYgKGZlYXR1cmUgaW4gdGVzdFRoZW5hYmxlcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBBdHRlbXB0IHRvIGRldGVjdCB1bnJlZ2lzdGVyZWQgaGFzIGZlYXR1cmUgXCIke2ZlYXR1cmV9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qXG4gKiBPdXQgb2YgdGhlIGJveCBmZWF0dXJlIHRlc3RzXG4gKi9cbi8qIEVudmlyb25tZW50cyAqL1xuLyogVXNlZCBhcyBhIHZhbHVlIHRvIHByb3ZpZGUgYSBkZWJ1ZyBvbmx5IGNvZGUgcGF0aCAqL1xuYWRkKCdkZWJ1ZycsIHRydWUpO1xuLyogRGV0ZWN0cyBpZiB0aGUgZW52aXJvbm1lbnQgaXMgXCJicm93c2VyIGxpa2VcIiAqL1xuYWRkKCdob3N0LWJyb3dzZXInLCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpO1xuLyogRGV0ZWN0cyBpZiB0aGUgZW52aXJvbm1lbnQgYXBwZWFycyB0byBiZSBOb2RlSlMgKi9cbmFkZCgnaG9zdC1ub2RlJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhcy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vaGFzL2hhcy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2hhcy9oYXMubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgaXNBcnJheUxpa2UsIFNoaW1JdGVyYXRvciB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpcyBhcyBvYmplY3RJcyB9IGZyb20gJy4vb2JqZWN0JztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgJy4vU3ltYm9sJztcbmV4cG9ydCBsZXQgTWFwID0gZ2xvYmFsLk1hcDtcbmlmICghdHJ1ZSkge1xuICAgIE1hcCA9IChfYSA9IGNsYXNzIE1hcCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihpdGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnTWFwJztcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQodmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBbiBhbHRlcm5hdGl2ZSB0byBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB1c2luZyBPYmplY3QuaXNcbiAgICAgICAgICAgICAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfaW5kZXhPZktleShrZXlzLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0SXMoa2V5c1tpXSwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0IHNpemUoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYXIoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5sZW5ndGggPSB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZShrZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50cmllcygpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLl9rZXlzLm1hcCgoa2V5LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB0aGlzLl92YWx1ZXNbaV1dO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3JFYWNoKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5fdmFsdWVzO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IHRoaXMuX3ZhbHVlc1tpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXMoa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KSA+IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5cygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl9rZXlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXggPCAwID8gdGhpcy5fa2V5cy5sZW5ndGggOiBpbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2luZGV4XSA9IGtleTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodGhpcy5fdmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVudHJpZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gX2EsXG4gICAgICAgIF9hKTtcbn1cbmV4cG9ydCBkZWZhdWx0IE1hcDtcbnZhciBfYTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1hcC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IHF1ZXVlTWljcm9UYXNrIH0gZnJvbSAnLi9zdXBwb3J0L3F1ZXVlJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmV4cG9ydCBsZXQgU2hpbVByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbmV4cG9ydCBjb25zdCBpc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn07XG5pZiAoIXRydWUpIHtcbiAgICBnbG9iYWwuUHJvbWlzZSA9IFNoaW1Qcm9taXNlID0gKF9hID0gY2xhc3MgUHJvbWlzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgUHJvbWlzZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0gZXhlY3V0b3JcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgd2hlbiB0aGUgUHJvbWlzZSBpcyBpbnN0YW50aWF0ZWQuIEl0IGlzIHJlc3BvbnNpYmxlIGZvclxuICAgICAgICAgICAgICogc3RhcnRpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hlbiBpdCBpcyBpbnZva2VkLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRoZSBleGVjdXRvciBtdXN0IGNhbGwgZWl0aGVyIHRoZSBwYXNzZWQgYHJlc29sdmVgIGZ1bmN0aW9uIHdoZW4gdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZFxuICAgICAgICAgICAgICogc3VjY2Vzc2Z1bGx5LCBvciB0aGUgYHJlamVjdGAgZnVuY3Rpb24gd2hlbiB0aGUgb3BlcmF0aW9uIGZhaWxzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihleGVjdXRvcikge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gMSAvKiBQZW5kaW5nICovO1xuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdQcm9taXNlJztcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0cnVlLCB0aGUgcmVzb2x1dGlvbiBvZiB0aGlzIHByb21pc2UgaXMgY2hhaW5lZCAoXCJsb2NrZWQgaW5cIikgdG8gYW5vdGhlciBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCBpc0NoYWluZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBpc1Jlc29sdmVkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovIHx8IGlzQ2hhaW5lZDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkIG9uY2UgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGx5IHB1c2hlcyBjYWxsYmFja3Mgb250byBhIHF1ZXVlIGZvciBleGVjdXRpb24gb25jZSB0aGlzIHByb21pc2Ugc2V0dGxlcy4gQWZ0ZXIgdGhlIHByb21pc2Ugc2V0dGxlcyxcbiAgICAgICAgICAgICAgICAgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IHdoZW5GaW5pc2hlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFNldHRsZXMgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldHRsZSA9IChuZXdTdGF0ZSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQSBwcm9taXNlIGNhbiBvbmx5IGJlIHNldHRsZWQgb25jZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IDEgLyogUGVuZGluZyAqLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHdoZW5GaW5pc2hlZCA9IHF1ZXVlTWljcm9UYXNrO1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IGFuIGV4dHJhIHR1cm4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlTWljcm9UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IGNhbGxiYWNrcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmVzb2x2ZXMgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmUgPSAobmV3U3RhdGUsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc29sdmVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4oc2V0dGxlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCBzZXR0bGUuYmluZChudWxsLCAyIC8qIFJlamVjdGVkICovKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NoYWluZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGxlKG5ld1N0YXRlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMudGhlbiA9IChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbkZpbmlzaGVkIGluaXRpYWxseSBxdWV1ZXMgdXAgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gYWZ0ZXIgdGhlIHByb21pc2UgaGFzIHNldHRsZWQuIE9uY2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9taXNlIGhhcyBzZXR0bGVkLCB3aGVuRmluaXNoZWQgd2lsbCBzY2hlZHVsZSBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCB0dXJuIHRocm91Z2ggdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVudCBsb29wLlxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8gPyBvblJlamVjdGVkIDogb25GdWxmaWxsZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxsYmFjayh0aGlzLnJlc29sdmVkVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0ZSA9PT0gMiAvKiBSZWplY3RlZCAqLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5yZXNvbHZlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNvbHZlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBleGVjdXRvcihyZXNvbHZlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCByZXNvbHZlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlKDIgLyogUmVqZWN0ZWQgKi8sIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0aWMgYWxsKGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wbGV0ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3B1bGF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZnVsZmlsbChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrY29tcGxldGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9wdWxhdGluZyB8fCBjb21wbGV0ZSA8IHRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NJdGVtKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK3RvdGFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVGhlbmFibGUoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhbiBpdGVtIFByb21pc2UgcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzSXRlbShpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyByYWNlKGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIFByb21pc2UgaXRlbSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGljIHJlamVjdChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRpYyByZXNvbHZlKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2gob25SZWplY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gU2hpbVByb21pc2UsXG4gICAgICAgIF9hKTtcbn1cbmV4cG9ydCBkZWZhdWx0IFNoaW1Qcm9taXNlO1xudmFyIF9hO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UHJvbWlzZS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGdldFZhbHVlRGVzY3JpcHRvciB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcbmV4cG9ydCBsZXQgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbmlmICghdHJ1ZSkge1xuICAgIC8qKlxuICAgICAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXG4gICAgICogQHBhcmFtICB7YW55fSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3NcbiAgICAgKi9cbiAgICBjb25zdCB2YWxpZGF0ZVN5bWJvbCA9IGZ1bmN0aW9uIHZhbGlkYXRlU3ltYm9sKHZhbHVlKSB7XG4gICAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBjb25zdCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gICAgY29uc3QgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gICAgY29uc3QgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbiAgICBjb25zdCBvYmpQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuICAgIGNvbnN0IGdsb2JhbFN5bWJvbHMgPSB7fTtcbiAgICBjb25zdCBnZXRTeW1ib2xOYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgY3JlYXRlZCA9IGNyZWF0ZShudWxsKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkZXNjKSB7XG4gICAgICAgICAgICBsZXQgcG9zdGZpeCA9IDA7XG4gICAgICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgICAgIHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcbiAgICAgICAgICAgICAgICArK3Bvc3RmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZXNjICs9IFN0cmluZyhwb3N0Zml4IHx8ICcnKTtcbiAgICAgICAgICAgIGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9ICdAQCcgKyBkZXNjO1xuICAgICAgICAgICAgLy8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXG4gICAgICAgICAgICAvLyBwaW5uZWQgZG93bi5cbiAgICAgICAgICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmpQcm90b3R5cGUsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH07XG4gICAgfSkoKTtcbiAgICBjb25zdCBJbnRlcm5hbFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTeW1ib2woZGVzY3JpcHRpb24pO1xuICAgIH07XG4gICAgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sLnByb3RvdHlwZSk7XG4gICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXMoc3ltLCB7XG4gICAgICAgICAgICBfX2Rlc2NyaXB0aW9uX186IGdldFZhbHVlRGVzY3JpcHRvcihkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBfX25hbWVfXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGdldFN5bWJvbE5hbWUoZGVzY3JpcHRpb24pKVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qIERlY29yYXRlIHRoZSBTeW1ib2wgZnVuY3Rpb24gd2l0aCB0aGUgYXBwcm9wcmlhdGUgcHJvcGVydGllcyAqL1xuICAgIGRlZmluZVByb3BlcnR5KFN5bWJvbCwgJ2ZvcicsIGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChnbG9iYWxTeW1ib2xzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxTeW1ib2xzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcbiAgICB9KSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhTeW1ib2wsIHtcbiAgICAgICAga2V5Rm9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgICAgICAgbGV0IGtleTtcbiAgICAgICAgICAgIHZhbGlkYXRlU3ltYm9sKHN5bSk7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gc3ltKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgaGFzSW5zdGFuY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxuICAgICAgICBpc0NvbmNhdFNwcmVhZGFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpc0NvbmNhdFNwcmVhZGFibGUnKSwgZmFsc2UsIGZhbHNlKSxcbiAgICAgICAgaXRlcmF0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdpdGVyYXRvcicpLCBmYWxzZSwgZmFsc2UpLFxuICAgICAgICBtYXRjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXG4gICAgICAgIG9ic2VydmFibGU6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdvYnNlcnZhYmxlJyksIGZhbHNlLCBmYWxzZSksXG4gICAgICAgIHJlcGxhY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdyZXBsYWNlJyksIGZhbHNlLCBmYWxzZSksXG4gICAgICAgIHNlYXJjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NlYXJjaCcpLCBmYWxzZSwgZmFsc2UpLFxuICAgICAgICBzcGVjaWVzOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignc3BlY2llcycpLCBmYWxzZSwgZmFsc2UpLFxuICAgICAgICBzcGxpdDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NwbGl0JyksIGZhbHNlLCBmYWxzZSksXG4gICAgICAgIHRvUHJpbWl0aXZlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9QcmltaXRpdmUnKSwgZmFsc2UsIGZhbHNlKSxcbiAgICAgICAgdG9TdHJpbmdUYWc6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd0b1N0cmluZ1RhZycpLCBmYWxzZSwgZmFsc2UpLFxuICAgICAgICB1bnNjb3BhYmxlczogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3Vuc2NvcGFibGVzJyksIGZhbHNlLCBmYWxzZSlcbiAgICB9KTtcbiAgICAvKiBEZWNvcmF0ZSB0aGUgSW50ZXJuYWxTeW1ib2wgb2JqZWN0ICovXG4gICAgZGVmaW5lUHJvcGVydGllcyhJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wpLFxuICAgICAgICB0b1N0cmluZzogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbmFtZV9fO1xuICAgICAgICB9LCBmYWxzZSwgZmFsc2UpXG4gICAgfSk7XG4gICAgLyogRGVjb3JhdGUgdGhlIFN5bWJvbC5wcm90b3R5cGUgKi9cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcbiAgICAgICAgdG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sKHRoaXMpLl9fZGVzY3JpcHRpb25fXyArICcpJztcbiAgICAgICAgfSksXG4gICAgICAgIHZhbHVlT2Y6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG4gICAgICAgIH0pXG4gICAgfSk7XG4gICAgZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvUHJpbWl0aXZlLCBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG4gICAgfSkpO1xuICAgIGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZ2V0VmFsdWVEZXNjcmlwdG9yKCdTeW1ib2wnLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcbiAgICBkZWZpbmVQcm9wZXJ0eShJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1ByaW1pdGl2ZSwgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XG4gICAgZGVmaW5lUHJvcGVydHkoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10sIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xufVxuLyoqXG4gKiBBIGN1c3RvbSBndWFyZCBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgaWYgYW4gb2JqZWN0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHBhcmFtICB7YW55fSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2sgdG8gc2VlIGlmIGl0IGlzIGEgc3ltYm9sIG9yIG5vdFxuICogQHJldHVybiB7aXMgc3ltYm9sfSAgICAgICBSZXR1cm5zIHRydWUgaWYgYSBzeW1ib2wgb3Igbm90IChhbmQgbmFycm93cyB0aGUgdHlwZSBndWFyZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyB8fCB2YWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykpIHx8IGZhbHNlO1xufVxuLyoqXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cbiAqL1xuW1xuICAgICdoYXNJbnN0YW5jZScsXG4gICAgJ2lzQ29uY2F0U3ByZWFkYWJsZScsXG4gICAgJ2l0ZXJhdG9yJyxcbiAgICAnc3BlY2llcycsXG4gICAgJ3JlcGxhY2UnLFxuICAgICdzZWFyY2gnLFxuICAgICdzcGxpdCcsXG4gICAgJ21hdGNoJyxcbiAgICAndG9QcmltaXRpdmUnLFxuICAgICd0b1N0cmluZ1RhZycsXG4gICAgJ3Vuc2NvcGFibGVzJyxcbiAgICAnb2JzZXJ2YWJsZSdcbl0uZm9yRWFjaCgod2VsbEtub3duKSA9PiB7XG4gICAgaWYgKCFTeW1ib2xbd2VsbEtub3duXSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sLCB3ZWxsS25vd24sIGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKHdlbGxLbm93biksIGZhbHNlLCBmYWxzZSkpO1xuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3ltYm9sLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgJy4vU3ltYm9sJztcbmV4cG9ydCBsZXQgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuaWYgKCF0cnVlKSB7XG4gICAgY29uc3QgREVMRVRFRCA9IHt9O1xuICAgIGNvbnN0IGdldFVJRCA9IGZ1bmN0aW9uIGdldFVJRCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCk7XG4gICAgfTtcbiAgICBjb25zdCBnZW5lcmF0ZU5hbWUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3RhcnRJZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAlIDEwMDAwMDAwMCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ19fd20nICsgZ2V0VUlEKCkgKyAoc3RhcnRJZCsrICsgJ19fJyk7XG4gICAgICAgIH07XG4gICAgfSkoKTtcbiAgICBXZWFrTWFwID0gY2xhc3MgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnV2Vha01hcCc7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19uYW1lJywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0ZU5hbWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XG4gICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Zyb3plbkVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZnJvemVuRW50cmllc1tpXS5rZXkgPT09IGtleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlKGtleSkge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG4gICAgICAgICAgICAgICAgZW50cnkudmFsdWUgPSBERUxFVEVEO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm96ZW5FbnRyaWVzW2Zyb3plbkluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBoYXMoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XG4gICAgICAgICAgICBpZiAoQm9vbGVhbihlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkgIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB2YWx1ZSB1c2VkIGFzIHdlYWsgbWFwIGtleScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGVudHJ5ID0ga2V5W3RoaXMuX25hbWVdO1xuICAgICAgICAgICAgaWYgKCFlbnRyeSB8fCBlbnRyeS5rZXkgIT09IGtleSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogeyB2YWx1ZToga2V5IH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShrZXksIHRoaXMuX25hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlbnRyeVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGRlZmF1bHQgV2Vha01hcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdlYWtNYXAubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlLCBpc0l0ZXJhYmxlIH0gZnJvbSAnLi9pdGVyYXRvcic7XG5pbXBvcnQgeyBNQVhfU0FGRV9JTlRFR0VSIH0gZnJvbSAnLi9udW1iZXInO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG5leHBvcnQgbGV0IGZyb207XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgZnJvbSB0aGUgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0gYXJndW1lbnRzIEFueSBudW1iZXIgb2YgYXJndW1lbnRzIGZvciB0aGUgYXJyYXlcbiAqIEByZXR1cm4gQW4gYXJyYXkgZnJvbSB0aGUgZ2l2ZW4gYXJndW1lbnRzXG4gKi9cbmV4cG9ydCBsZXQgb2Y7XG4vKiBFUzYgQXJyYXkgaW5zdGFuY2UgbWV0aG9kcyAqL1xuLyoqXG4gKiBDb3BpZXMgZGF0YSBpbnRlcm5hbGx5IHdpdGhpbiBhbiBhcnJheSBvciBhcnJheS1saWtlIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBvZmZzZXQgVGhlIGluZGV4IHRvIHN0YXJ0IGNvcHlpbmcgdmFsdWVzIHRvOyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHBhcmFtIHN0YXJ0IFRoZSBmaXJzdCAoaW5jbHVzaXZlKSBpbmRleCB0byBjb3B5OyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHBhcmFtIGVuZCBUaGUgbGFzdCAoZXhjbHVzaXZlKSBpbmRleCB0byBjb3B5OyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHJldHVybiBUaGUgdGFyZ2V0XG4gKi9cbmV4cG9ydCBsZXQgY29weVdpdGhpbjtcbi8qKlxuICogRmlsbHMgZWxlbWVudHMgb2YgYW4gYXJyYXktbGlrZSBvYmplY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCB0byBmaWxsXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgZWFjaCBlbGVtZW50IG9mIHRoZSB0YXJnZXQgd2l0aFxuICogQHBhcmFtIHN0YXJ0IFRoZSBmaXJzdCBpbmRleCB0byBmaWxsXG4gKiBAcGFyYW0gZW5kIFRoZSAoZXhjbHVzaXZlKSBpbmRleCBhdCB3aGljaCB0byBzdG9wIGZpbGxpbmdcbiAqIEByZXR1cm4gVGhlIGZpbGxlZCB0YXJnZXRcbiAqL1xuZXhwb3J0IGxldCBmaWxsO1xuLyoqXG4gKiBGaW5kcyBhbmQgcmV0dXJucyB0aGUgZmlyc3QgaW5zdGFuY2UgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrIG9yIHVuZGVmaW5lZCBpZiBvbmUgaXMgbm90IGZvdW5kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyBpZiB0aGUgY3VycmVudCB2YWx1ZSBtYXRjaGVzIGEgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGNhbGxiYWNrLCBvciB1bmRlZmluZWQgaWYgb25lIGRvZXMgbm90IGV4aXN0XG4gKi9cbmV4cG9ydCBsZXQgZmluZDtcbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgc2VhcmNoIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpbmRleCB3aG9zZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHBhc3NlZCBjYWxsYmFjayxcbiAqIG9yIC0xIGlmIG5vIHZhbHVlcyBzYXRpc2Z5IGl0LlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgQW4gYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBjYWxsYmFjayBBIGZ1bmN0aW9uIHJldHVybmluZyB0cnVlIGlmIHRoZSBjdXJyZW50IHZhbHVlIHNhdGlzZmllcyBpdHMgY3JpdGVyaWFcbiAqIEBwYXJhbSB0aGlzQXJnIFRoZSBleGVjdXRpb24gY29udGV4dCBmb3IgdGhlIGZpbmQgZnVuY3Rpb25cbiAqIEByZXR1cm4gVGhlIGZpcnN0IGluZGV4IHdob3NlIHZhbHVlIHNhdGlzZmllcyB0aGUgcGFzc2VkIGNhbGxiYWNrLCBvciAtMSBpZiBubyB2YWx1ZXMgc2F0aXNmeSBpdFxuICovXG5leHBvcnQgbGV0IGZpbmRJbmRleDtcbi8qIEVTNyBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBhcnJheSBpbmNsdWRlcyBhIGdpdmVuIHZhbHVlXG4gKlxuICogQHBhcmFtIHRhcmdldCB0aGUgdGFyZ2V0IGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gc2VhcmNoRWxlbWVudCB0aGUgaXRlbSB0byBzZWFyY2ggZm9yXG4gKiBAcGFyYW0gZnJvbUluZGV4IHRoZSBzdGFydGluZyBpbmRleCB0byBzZWFyY2ggZnJvbVxuICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGFycmF5IGluY2x1ZGVzIHRoZSBlbGVtZW50LCBvdGhlcndpc2UgYGZhbHNlYFxuICovXG5leHBvcnQgbGV0IGluY2x1ZGVzO1xuaWYgKHRydWUgJiYgdHJ1ZSkge1xuICAgIGZyb20gPSBnbG9iYWwuQXJyYXkuZnJvbTtcbiAgICBvZiA9IGdsb2JhbC5BcnJheS5vZjtcbiAgICBjb3B5V2l0aGluID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4pO1xuICAgIGZpbGwgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmlsbCk7XG4gICAgZmluZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maW5kKTtcbiAgICBmaW5kSW5kZXggPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuZmluZEluZGV4KTtcbn1cbmVsc2Uge1xuICAgIC8vIEl0IGlzIG9ubHkgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpL2lPUyB0aGF0IGhhdmUgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiBhbmQgc28gYXJlbid0IGluIHRoZSB3aWxkXG4gICAgLy8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxuICAgIC8qKlxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcbiAgICAgKi9cbiAgICBjb25zdCB0b0xlbmd0aCA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG4gICAgICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICAgICAgICBsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIE1BWF9TQUZFX0lOVEVHRVIpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRnJvbSBFUzYgNy4xLjQgVG9JbnRlZ2VyKClcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcbiAgICAgKiBAcmV0dXJuIEFuIGludGVnZXJcbiAgICAgKi9cbiAgICBjb25zdCB0b0ludGVnZXIgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPT09IDAgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodmFsdWUgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZXMgYW4gb2Zmc2V0IGFnYWluc3QgYSBnaXZlbiBsZW5ndGgsIHdyYXBwaW5nIGl0IGlmIG5lZ2F0aXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBvcmlnaW5hbCBvZmZzZXRcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB0b3RhbCBsZW5ndGggdG8gbm9ybWFsaXplIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxuICAgICAqL1xuICAgIGNvbnN0IG5vcm1hbGl6ZU9mZnNldCA9IGZ1bmN0aW9uIG5vcm1hbGl6ZU9mZnNldCh2YWx1ZSwgbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLm1heChsZW5ndGggKyB2YWx1ZSwgMCkgOiBNYXRoLm1pbih2YWx1ZSwgbGVuZ3RoKTtcbiAgICB9O1xuICAgIGZyb20gPSBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSwgbWFwRnVuY3Rpb24sIHRoaXNBcmcpIHtcbiAgICAgICAgaWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmcm9tOiByZXF1aXJlcyBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXBGdW5jdGlvbiAmJiB0aGlzQXJnKSB7XG4gICAgICAgICAgICBtYXBGdW5jdGlvbiA9IG1hcEZ1bmN0aW9uLmJpbmQodGhpc0FyZyk7XG4gICAgICAgIH1cbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cbiAgICAgICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzO1xuICAgICAgICBjb25zdCBsZW5ndGggPSB0b0xlbmd0aChhcnJheUxpa2UubGVuZ3RoKTtcbiAgICAgICAgLy8gU3VwcG9ydCBleHRlbnNpb25cbiAgICAgICAgY29uc3QgYXJyYXkgPSB0eXBlb2YgQ29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgPyBPYmplY3QobmV3IENvbnN0cnVjdG9yKGxlbmd0aCkpIDogbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgIGlmICghaXNBcnJheUxpa2UoYXJyYXlMaWtlKSAmJiAhaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxuICAgICAgICAvLyB3aXRoIHRoZSBpdGVyYXRpb24gb24gSUUgd2hlbiB1c2luZyBhIE5hTiBhcnJheSBsZW5ndGguXG4gICAgICAgIGlmIChpc0FycmF5TGlrZShhcnJheUxpa2UpKSB7XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheUxpa2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24oYXJyYXlMaWtlW2ldLCBpKSA6IGFycmF5TGlrZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgYXJyYXlMaWtlKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKHZhbHVlLCBpKSA6IHZhbHVlO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyYXlMaWtlLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhcnJheS5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH07XG4gICAgb2YgPSBmdW5jdGlvbiBvZiguLi5pdGVtcykge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpO1xuICAgIH07XG4gICAgY29weVdpdGhpbiA9IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LCBvZmZzZXQsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb3B5V2l0aGluOiB0YXJnZXQgbXVzdCBiZSBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuICAgICAgICBvZmZzZXQgPSBub3JtYWxpemVPZmZzZXQodG9JbnRlZ2VyKG9mZnNldCksIGxlbmd0aCk7XG4gICAgICAgIHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XG4gICAgICAgIGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xuICAgICAgICBsZXQgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IDE7XG4gICAgICAgIGlmIChvZmZzZXQgPiBzdGFydCAmJiBvZmZzZXQgPCBzdGFydCArIGNvdW50KSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgIHN0YXJ0ICs9IGNvdW50IC0gMTtcbiAgICAgICAgICAgIG9mZnNldCArPSBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGNvdW50ID4gMCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0IGluIHRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRbb2Zmc2V0XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldCArPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBzdGFydCArPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBjb3VudC0tO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbiAgICBmaWxsID0gZnVuY3Rpb24gZmlsbCh0YXJnZXQsIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuICAgICAgICBsZXQgaSA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xuICAgICAgICBlbmQgPSBub3JtYWxpemVPZmZzZXQoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKSwgbGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICAgICAgICAgIHRhcmdldFtpKytdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuICAgIGZpbmQgPSBmdW5jdGlvbiBmaW5kKHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybiBpbmRleCAhPT0gLTEgPyB0YXJnZXRbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgIH07XG4gICAgZmluZEluZGV4ID0gZnVuY3Rpb24gZmluZEluZGV4KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ZpbmQ6IHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpc0FyZykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXNBcmcpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayh0YXJnZXRbaV0sIGksIHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cbmlmICh0cnVlKSB7XG4gICAgaW5jbHVkZXMgPSB3cmFwTmF0aXZlKGdsb2JhbC5BcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xufVxuZWxzZSB7XG4gICAgLyoqXG4gICAgICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcbiAgICAgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxuICAgICAqL1xuICAgIGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgTUFYX1NBRkVfSU5URUdFUik7XG4gICAgfTtcbiAgICBpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRhcmdldCwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4ID0gMCkge1xuICAgICAgICBsZXQgbGVuID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XG4gICAgICAgICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJheS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiY29uc3QgZ2xvYmFsT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gZ2xvYmFsIHNwZWMgZGVmaW5lcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBjYWxsZWQgJ2dsb2JhbCdcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG4gICAgICAgIC8vIGBnbG9iYWxgIGlzIGFsc28gZGVmaW5lZCBpbiBOb2RlSlNcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gd2luZG93IGlzIGRlZmluZWQgaW4gYnJvd3NlcnNcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHNlbGYgaXMgZGVmaW5lZCBpbiBXZWJXb3JrZXJzXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbn0pKCk7XG5leHBvcnQgZGVmYXVsdCBnbG9iYWxPYmplY3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nbG9iYWwubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vZ2xvYmFsLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0ICcuL1N5bWJvbCc7XG5pbXBvcnQgeyBISUdIX1NVUlJPR0FURV9NQVgsIEhJR0hfU1VSUk9HQVRFX01JTiB9IGZyb20gJy4vc3RyaW5nJztcbmNvbnN0IHN0YXRpY0RvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbi8qKlxuICogQSBjbGFzcyB0aGF0IF9zaGltc18gYW4gaXRlcmF0b3IgaW50ZXJmYWNlIG9uIGFycmF5IGxpa2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNoaW1JdGVyYXRvciB7XG4gICAgY29uc3RydWN0b3IobGlzdCkge1xuICAgICAgICB0aGlzLl9uZXh0SW5kZXggPSAtMTtcbiAgICAgICAgaWYgKGlzSXRlcmFibGUobGlzdCkpIHtcbiAgICAgICAgICAgIHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gbGlzdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX25hdGl2ZUl0ZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlSXRlcmF0b3IubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRpY0RvbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2xpc3RbdGhpcy5fbmV4dEluZGV4XVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGljRG9uZTtcbiAgICB9XG4gICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbi8qKlxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaGFzIGFuIEl0ZXJhYmxlIGludGVyZmFjZVxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xufVxuLyoqXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGl0ZXJhYmxlKSB7XG4gICAgaWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNoaW1JdGVyYXRvcihpdGVyYWJsZSk7XG4gICAgfVxufVxuLyoqXG4gKiBTaGltcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiBgZm9yIC4uLiBvZmAgYmxvY2tzXG4gKlxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBvYmplY3QgdGhlIHByb3ZpZGVzIGFuIGludGVyYXRvciBpbnRlcmZhY2VcbiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSBvZiB0aGUgaXRlcmFibGVcbiAqIEBwYXJhbSB0aGlzQXJnIE9wdGlvbmFsIHNjb3BlIHRvIHBhc3MgdGhlIGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JPZihpdGVyYWJsZSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBsZXQgYnJva2VuID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gZG9CcmVhaygpIHtcbiAgICAgICAgYnJva2VuID0gdHJ1ZTtcbiAgICB9XG4gICAgLyogV2UgbmVlZCB0byBoYW5kbGUgaXRlcmF0aW9uIG9mIGRvdWJsZSBieXRlIHN0cmluZ3MgcHJvcGVybHkgKi9cbiAgICBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpICYmIHR5cGVvZiBpdGVyYWJsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICBpZiAoaSArIDEgPCBsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+PSBISUdIX1NVUlJPR0FURV9NSU4gJiYgY29kZSA8PSBISUdIX1NVUlJPR0FURV9NQVgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhciArPSBpdGVyYWJsZVsrK2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY2hhciwgaXRlcmFibGUsIGRvQnJlYWspO1xuICAgICAgICAgICAgaWYgKGJyb2tlbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpO1xuICAgICAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZXN1bHQudmFsdWUsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlcmF0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2l0ZXJhdG9yLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuLyoqXG4gKiBUaGUgc21hbGxlc3QgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcmVwcmVzZW50YWJsZSBudW1iZXJzLlxuICovXG5leHBvcnQgY29uc3QgRVBTSUxPTiA9IDE7XG4vKipcbiAqIFRoZSBtYXhpbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbi8qKlxuICogVGhlIG1pbmltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9TQUZFX0lOVEVHRVIgPSAtTUFYX1NBRkVfSU5URUdFUjtcbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgTmFOIHdpdGhvdXQgY29lcnNpb24uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIE5hTiwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc05hTih2YWx1ZSk7XG59XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBnbG9iYWwuaXNGaW5pdGUodmFsdWUpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyIHRoYXQgaXMgJ3NhZmUsJyBtZWFuaW5nOlxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXG4gKiAgIDIuIGl0IGhhcyBhIG9uZS10by1vbmUgbWFwcGluZyB0byBhIG1hdGhlbWF0aWNhbCBpbnRlZ2VyLCBtZWFuaW5nIGl0c1xuICogICAgICBJRUVFLTc1NCByZXByZXNlbnRhdGlvbiBjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiByb3VuZGluZyBhbnkgb3RoZXJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmIE1hdGguYWJzKHZhbHVlKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IGlzU3ltYm9sIH0gZnJvbSAnLi9TeW1ib2wnO1xuZXhwb3J0IGxldCBhc3NpZ247XG4vKipcbiAqIEdldHMgdGhlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICogQW4gb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgaXMgb25lIHRoYXQgaXMgZGVmaW5lZCBkaXJlY3RseSBvbiB0aGUgb2JqZWN0IGFuZCBpcyBub3RcbiAqIGluaGVyaXRlZCBmcm9tIHRoZSBvYmplY3QncyBwcm90b3R5cGUuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydHkuXG4gKiBAcGFyYW0gcCBOYW1lIG9mIHRoZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4vKipcbiAqIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QuIFRoZSBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QgYXJlIHRob3NlIHRoYXQgYXJlIGRlZmluZWQgZGlyZWN0bHlcbiAqIG9uIHRoYXQgb2JqZWN0LCBhbmQgYXJlIG5vdCBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLiBUaGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgaW5jbHVkZSBib3RoIGZpZWxkcyAob2JqZWN0cykgYW5kIGZ1bmN0aW9ucy5cbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBvd24gcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBzeW1ib2wgcHJvcGVydGllcyBmb3VuZCBkaXJlY3RseSBvbiBvYmplY3Qgby5cbiAqIEBwYXJhbSBvIE9iamVjdCB0byByZXRyaWV2ZSB0aGUgc3ltYm9scyBmcm9tLlxuICovXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5U3ltYm9scztcbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAcGFyYW0gdmFsdWUxIFRoZSBmaXJzdCB2YWx1ZS5cbiAqIEBwYXJhbSB2YWx1ZTIgVGhlIHNlY29uZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGxldCBpcztcbi8qKlxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvZiBhbiBvYmplY3QuXG4gKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cbiAqL1xuZXhwb3J0IGxldCBrZXlzO1xuLyogRVM3IE9iamVjdCBzdGF0aWMgbWV0aG9kcyAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuZXhwb3J0IGxldCBlbnRyaWVzO1xuZXhwb3J0IGxldCB2YWx1ZXM7XG5pZiAodHJ1ZSkge1xuICAgIGNvbnN0IGdsb2JhbE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG4gICAgYXNzaWduID0gZ2xvYmFsT2JqZWN0LmFzc2lnbjtcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgIGdldE93blByb3BlcnR5TmFtZXMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIGlzID0gZ2xvYmFsT2JqZWN0LmlzO1xuICAgIGtleXMgPSBnbG9iYWxPYmplY3Qua2V5cztcbn1cbmVsc2Uge1xuICAgIGtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xuICAgIH07XG4gICAgYXNzaWduID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgLi4uc291cmNlcykge1xuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgICAgc291cmNlcy5mb3JFYWNoKChuZXh0U291cmNlKSA9PiB7XG4gICAgICAgICAgICBpZiAobmV4dFNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICAgICAgICAgIGtleXMobmV4dFNvdXJjZSkuZm9yRWFjaCgobmV4dEtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdG87XG4gICAgfTtcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCkge1xuICAgICAgICBpZiAoaXNTeW1ib2wocHJvcCkpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZpbHRlcigoa2V5KSA9PiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpKTtcbiAgICB9O1xuICAgIGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKVxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KSA9PiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpXG4gICAgICAgICAgICAubWFwKChrZXkpID0+IFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSkpO1xuICAgIH07XG4gICAgaXMgPSBmdW5jdGlvbiBpcyh2YWx1ZTEsIHZhbHVlMikge1xuICAgICAgICBpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTEgIT09IDAgfHwgMSAvIHZhbHVlMSA9PT0gMSAvIHZhbHVlMjsgLy8gLTBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTEgJiYgdmFsdWUyICE9PSB2YWx1ZTI7IC8vIE5hTlxuICAgIH07XG59XG5pZiAodHJ1ZSkge1xuICAgIGNvbnN0IGdsb2JhbE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xuICAgIGVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcbiAgICB2YWx1ZXMgPSBnbG9iYWxPYmplY3QudmFsdWVzO1xufVxuZWxzZSB7XG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobykge1xuICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlOYW1lcyhvKS5yZWR1Y2UoKHByZXZpb3VzLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHByZXZpb3VzW2tleV0gPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KTtcbiAgICAgICAgICAgIHJldHVybiBwcmV2aW91cztcbiAgICAgICAgfSwge30pO1xuICAgIH07XG4gICAgZW50cmllcyA9IGZ1bmN0aW9uIGVudHJpZXMobykge1xuICAgICAgICByZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gW2tleSwgb1trZXldXSk7XG4gICAgfTtcbiAgICB2YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMobykge1xuICAgICAgICByZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gb1trZXldKTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JqZWN0Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IHdyYXBOYXRpdmUgfSBmcm9tICcuL3N1cHBvcnQvdXRpbCc7XG4vKipcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcbi8qKlxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IExPV19TVVJST0dBVEVfTUlOID0gMHhkYzAwO1xuLyoqXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xuICovXG5leHBvcnQgY29uc3QgTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XG4vKiBFUzYgc3RhdGljIG1ldGhvZHMgKi9cbi8qKlxuICogUmV0dXJuIHRoZSBTdHJpbmcgdmFsdWUgd2hvc2UgZWxlbWVudHMgYXJlLCBpbiBvcmRlciwgdGhlIGVsZW1lbnRzIGluIHRoZSBMaXN0IGVsZW1lbnRzLlxuICogSWYgbGVuZ3RoIGlzIDAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0gY29kZVBvaW50cyBUaGUgY29kZSBwb2ludHMgdG8gZ2VuZXJhdGUgdGhlIHN0cmluZ1xuICovXG5leHBvcnQgbGV0IGZyb21Db2RlUG9pbnQ7XG4vKipcbiAqIGByYXdgIGlzIGludGVuZGVkIGZvciB1c2UgYXMgYSB0YWcgZnVuY3Rpb24gb2YgYSBUYWdnZWQgVGVtcGxhdGUgU3RyaW5nLiBXaGVuIGNhbGxlZFxuICogYXMgc3VjaCB0aGUgZmlyc3QgYXJndW1lbnQgd2lsbCBiZSBhIHdlbGwgZm9ybWVkIHRlbXBsYXRlIGNhbGwgc2l0ZSBvYmplY3QgYW5kIHRoZSByZXN0XG4gKiBwYXJhbWV0ZXIgd2lsbCBjb250YWluIHRoZSBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICogQHBhcmFtIHRlbXBsYXRlIEEgd2VsbC1mb3JtZWQgdGVtcGxhdGUgc3RyaW5nIGNhbGwgc2l0ZSByZXByZXNlbnRhdGlvbi5cbiAqIEBwYXJhbSBzdWJzdGl0dXRpb25zIEEgc2V0IG9mIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBsZXQgcmF3O1xuLyogRVM2IGluc3RhbmNlIG1ldGhvZHMgKi9cbi8qKlxuICogUmV0dXJucyBhIG5vbm5lZ2F0aXZlIGludGVnZXIgTnVtYmVyIGxlc3MgdGhhbiAxMTE0MTEyICgweDExMDAwMCkgdGhhdCBpcyB0aGUgY29kZSBwb2ludFxuICogdmFsdWUgb2YgdGhlIFVURi0xNiBlbmNvZGVkIGNvZGUgcG9pbnQgc3RhcnRpbmcgYXQgdGhlIHN0cmluZyBlbGVtZW50IGF0IHBvc2l0aW9uIHBvcyBpblxuICogdGhlIFN0cmluZyByZXN1bHRpbmcgZnJvbSBjb252ZXJ0aW5nIHRoaXMgb2JqZWN0IHRvIGEgU3RyaW5nLlxuICogSWYgdGhlcmUgaXMgbm8gZWxlbWVudCBhdCB0aGF0IHBvc2l0aW9uLCB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZC5cbiAqIElmIGEgdmFsaWQgVVRGLTE2IHN1cnJvZ2F0ZSBwYWlyIGRvZXMgbm90IGJlZ2luIGF0IHBvcywgdGhlIHJlc3VsdCBpcyB0aGUgY29kZSB1bml0IGF0IHBvcy5cbiAqL1xuZXhwb3J0IGxldCBjb2RlUG9pbnRBdDtcbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzZXF1ZW5jZSBvZiBlbGVtZW50cyBvZiBzZWFyY2hTdHJpbmcgY29udmVydGVkIHRvIGEgU3RyaW5nIGlzIHRoZVxuICogc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50cyBvZiB0aGlzIG9iamVjdCAoY29udmVydGVkIHRvIGEgU3RyaW5nKSBzdGFydGluZyBhdFxuICogZW5kUG9zaXRpb24g4oCTIGxlbmd0aCh0aGlzKS4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gKi9cbmV4cG9ydCBsZXQgZW5kc1dpdGg7XG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBzZWFyY2hTdHJpbmcgYXBwZWFycyBhcyBhIHN1YnN0cmluZyBvZiB0aGUgcmVzdWx0IG9mIGNvbnZlcnRpbmcgdGhpc1xuICogb2JqZWN0IHRvIGEgU3RyaW5nLCBhdCBvbmUgb3IgbW9yZSBwb3NpdGlvbnMgdGhhdCBhcmVcbiAqIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBwb3NpdGlvbjsgb3RoZXJ3aXNlLCByZXR1cm5zIGZhbHNlLlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIHNlYXJjaFN0cmluZyBzZWFyY2ggc3RyaW5nXG4gKiBAcGFyYW0gcG9zaXRpb24gSWYgcG9zaXRpb24gaXMgdW5kZWZpbmVkLCAwIGlzIGFzc3VtZWQsIHNvIGFzIHRvIHNlYXJjaCBhbGwgb2YgdGhlIFN0cmluZy5cbiAqL1xuZXhwb3J0IGxldCBpbmNsdWRlcztcbi8qKlxuICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuICogaXMgXCJORkNcIlxuICovXG5leHBvcnQgbGV0IG5vcm1hbGl6ZTtcbi8qKlxuICogUmV0dXJucyBhIFN0cmluZyB2YWx1ZSB0aGF0IGlzIG1hZGUgZnJvbSBjb3VudCBjb3BpZXMgYXBwZW5kZWQgdG9nZXRoZXIuIElmIGNvdW50IGlzIDAsXG4gKiBUIGlzIHRoZSBlbXB0eSBTdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0gY291bnQgbnVtYmVyIG9mIGNvcGllcyB0byBhcHBlbmRcbiAqL1xuZXhwb3J0IGxldCByZXBlYXQ7XG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VxdWVuY2Ugb2YgZWxlbWVudHMgb2Ygc2VhcmNoU3RyaW5nIGNvbnZlcnRlZCB0byBhIFN0cmluZyBpcyB0aGVcbiAqIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudHMgb2YgdGhpcyBvYmplY3QgKGNvbnZlcnRlZCB0byBhIFN0cmluZykgc3RhcnRpbmcgYXRcbiAqIHBvc2l0aW9uLiBPdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAqL1xuZXhwb3J0IGxldCBzdGFydHNXaXRoO1xuLyogRVM3IGluc3RhbmNlIG1ldGhvZHMgKi9cbi8qKlxuICogUGFkcyB0aGUgY3VycmVudCBzdHJpbmcgd2l0aCBhIGdpdmVuIHN0cmluZyAocG9zc2libHkgcmVwZWF0ZWQpIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBzdHJpbmcgcmVhY2hlcyBhIGdpdmVuIGxlbmd0aC5cbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgZW5kIChyaWdodCkgb2YgdGhlIGN1cnJlbnQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBtYXhMZW5ndGggVGhlIGxlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHN0cmluZyBvbmNlIHRoZSBjdXJyZW50IHN0cmluZyBoYXMgYmVlbiBwYWRkZWQuXG4gKiAgICAgICAgSWYgdGhpcyBwYXJhbWV0ZXIgaXMgc21hbGxlciB0aGFuIHRoZSBjdXJyZW50IHN0cmluZydzIGxlbmd0aCwgdGhlIGN1cnJlbnQgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMuXG4gKlxuICogQHBhcmFtIGZpbGxTdHJpbmcgVGhlIHN0cmluZyB0byBwYWQgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGguXG4gKiAgICAgICAgSWYgdGhpcyBzdHJpbmcgaXMgdG9vIGxvbmcsIGl0IHdpbGwgYmUgdHJ1bmNhdGVkIGFuZCB0aGUgbGVmdC1tb3N0IHBhcnQgd2lsbCBiZSBhcHBsaWVkLlxuICogICAgICAgIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBcIiBcIiAoVSswMDIwKS5cbiAqL1xuZXhwb3J0IGxldCBwYWRFbmQ7XG4vKipcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIHN0YXJ0IChsZWZ0KSBvZiB0aGUgY3VycmVudCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIG1heExlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nIG9uY2UgdGhlIGN1cnJlbnQgc3RyaW5nIGhhcyBiZWVuIHBhZGRlZC5cbiAqICAgICAgICBJZiB0aGlzIHBhcmFtZXRlciBpcyBzbWFsbGVyIHRoYW4gdGhlIGN1cnJlbnQgc3RyaW5nJ3MgbGVuZ3RoLCB0aGUgY3VycmVudCBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcy5cbiAqXG4gKiBAcGFyYW0gZmlsbFN0cmluZyBUaGUgc3RyaW5nIHRvIHBhZCB0aGUgY3VycmVudCBzdHJpbmcgd2l0aC5cbiAqICAgICAgICBJZiB0aGlzIHN0cmluZyBpcyB0b28gbG9uZywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgYW5kIHRoZSBsZWZ0LW1vc3QgcGFydCB3aWxsIGJlIGFwcGxpZWQuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgcGFyYW1ldGVyIGlzIFwiIFwiIChVKzAwMjApLlxuICovXG5leHBvcnQgbGV0IHBhZFN0YXJ0O1xuaWYgKHRydWUgJiYgdHJ1ZSkge1xuICAgIGZyb21Db2RlUG9pbnQgPSBnbG9iYWwuU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG4gICAgcmF3ID0gZ2xvYmFsLlN0cmluZy5yYXc7XG4gICAgY29kZVBvaW50QXQgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcbiAgICBlbmRzV2l0aCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgpO1xuICAgIGluY2x1ZGVzID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyk7XG4gICAgbm9ybWFsaXplID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xuICAgIHJlcGVhdCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucmVwZWF0KTtcbiAgICBzdGFydHNXaXRoID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKTtcbn1cbmVsc2Uge1xuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxuICAgICAqIFVzZWQgYnkgc3RhcnRzV2l0aCwgaW5jbHVkZXMsIGFuZCBlbmRzV2l0aC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBub3JtYWxpemVTdWJzdHJpbmdBcmdzID0gZnVuY3Rpb24gKG5hbWUsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24sIGlzRW5kID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLicgKyBuYW1lICsgJyByZXF1aXJlcyBhIHZhbGlkIHN0cmluZyB0byBzZWFyY2ggYWdhaW5zdC4nKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiAhPT0gcG9zaXRpb24gPyAoaXNFbmQgPyBsZW5ndGggOiAwKSA6IHBvc2l0aW9uO1xuICAgICAgICByZXR1cm4gW3RleHQsIFN0cmluZyhzZWFyY2gpLCBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbiwgMCksIGxlbmd0aCldO1xuICAgIH07XG4gICAgZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cykge1xuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLmZyb21Db2RlUG9pbnRcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuICAgICAgICBjb25zdCBNQVhfU0laRSA9IDB4NDAwMDtcbiAgICAgICAgbGV0IGNvZGVVbml0cyA9IFtdO1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgICAgICAgIC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2VcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gaXNGaW5pdGUoY29kZVBvaW50KSAmJiBNYXRoLmZsb29yKGNvZGVQb2ludCkgPT09IGNvZGVQb2ludCAmJiBjb2RlUG9pbnQgPj0gMCAmJiBjb2RlUG9pbnQgPD0gMHgxMGZmZmY7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdzdHJpbmcuZnJvbUNvZGVQb2ludDogSW52YWxpZCBjb2RlIHBvaW50ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcbiAgICAgICAgICAgICAgICAvLyBCTVAgY29kZSBwb2ludFxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuICAgICAgICAgICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICAgICAgICAgIGxldCBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyBISUdIX1NVUlJPR0FURV9NSU47XG4gICAgICAgICAgICAgICAgbGV0IGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgTE9XX1NVUlJPR0FURV9NSU47XG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIHJhdyA9IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucykge1xuICAgICAgICBsZXQgcmF3U3RyaW5ncyA9IGNhbGxTaXRlLnJhdztcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBsZXQgbnVtU3Vic3RpdHV0aW9ucyA9IHN1YnN0aXR1dGlvbnMubGVuZ3RoO1xuICAgICAgICBpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGggLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgY29kZVBvaW50QXQgPSBmdW5jdGlvbiBjb2RlUG9pbnRBdCh0ZXh0LCBwb3NpdGlvbiA9IDApIHtcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLmNvZGVQb2ludEF0IHJlcXVyaWVzIGEgdmFsaWQgc3RyaW5nLicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRleHQubGVuZ3RoO1xuICAgICAgICBpZiAocG9zaXRpb24gIT09IHBvc2l0aW9uKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCBjb2RlIHVuaXRcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgICAgICBpZiAoZmlyc3QgPj0gSElHSF9TVVJST0dBVEVfTUlOICYmIGZpcnN0IDw9IEhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcbiAgICAgICAgICAgIC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID49IExPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBMT1dfU1VSUk9HQVRFX01BWCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZmlyc3QgLSBISUdIX1NVUlJPR0FURV9NSU4pICogMHg0MDAgKyBzZWNvbmQgLSBMT1dfU1VSUk9HQVRFX01JTiArIDB4MTAwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpcnN0O1xuICAgIH07XG4gICAgZW5kc1dpdGggPSBmdW5jdGlvbiBlbmRzV2l0aCh0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICBlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIFt0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2VuZHNXaXRoJywgdGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gZW5kUG9zaXRpb24gLSBzZWFyY2gubGVuZ3RoO1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2Uoc3RhcnQsIGVuZFBvc2l0aW9uKSA9PT0gc2VhcmNoO1xuICAgIH07XG4gICAgaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uID0gMCkge1xuICAgICAgICBbdGV4dCwgc2VhcmNoLCBwb3NpdGlvbl0gPSBub3JtYWxpemVTdWJzdHJpbmdBcmdzKCdpbmNsdWRlcycsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGV4dC5pbmRleE9mKHNlYXJjaCwgcG9zaXRpb24pICE9PSAtMTtcbiAgICB9O1xuICAgIHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0LCBjb3VudCA9IDApIHtcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUucmVwZWF0XG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ICE9PSBjb3VudCkge1xuICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICB3aGlsZSAoY291bnQpIHtcbiAgICAgICAgICAgIGlmIChjb3VudCAlIDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudCA+Pj0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgc3RhcnRzV2l0aCA9IGZ1bmN0aW9uIHN0YXJ0c1dpdGgodGV4dCwgc2VhcmNoLCBwb3NpdGlvbiA9IDApIHtcbiAgICAgICAgc2VhcmNoID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgICAgIFt0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ3N0YXJ0c1dpdGgnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgZW5kID0gcG9zaXRpb24gKyBzZWFyY2gubGVuZ3RoO1xuICAgICAgICBpZiAoZW5kID4gdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShwb3NpdGlvbiwgZW5kKSA9PT0gc2VhcmNoO1xuICAgIH07XG59XG5pZiAodHJ1ZSkge1xuICAgIHBhZEVuZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcbiAgICBwYWRTdGFydCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQpO1xufVxuZWxzZSB7XG4gICAgcGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZyA9ICcgJykge1xuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0clRleHQgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgIGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XG4gICAgICAgICAgICBzdHJUZXh0ICs9XG4gICAgICAgICAgICAgICAgcmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XG4gICAgfTtcbiAgICBwYWRTdGFydCA9IGZ1bmN0aW9uIHBhZFN0YXJ0KHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZyA9ICcgJykge1xuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkU3RhcnQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IG51bGwgfHwgbWF4TGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbWF4TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RyVGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgY29uc3QgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xuICAgICAgICBpZiAocGFkZGluZyA+IDApIHtcbiAgICAgICAgICAgIHN0clRleHQgPVxuICAgICAgICAgICAgICAgIHJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcbiAgICAgICAgICAgICAgICAgICAgc3RyVGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyVGV4dDtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaW5nLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3RyaW5nLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBoYXMsIHsgYWRkIH0gZnJvbSAnQGRvam8vaGFzL2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4uL2dsb2JhbCc7XG5leHBvcnQgZGVmYXVsdCBoYXM7XG5leHBvcnQgKiBmcm9tICdAZG9qby9oYXMvaGFzJztcbi8qIEVDTUFTY3JpcHQgNiBhbmQgNyBGZWF0dXJlcyAqL1xuLyogQXJyYXkgKi9cbmFkZCgnZXM2LWFycmF5JywgKCkgPT4ge1xuICAgIHJldHVybiAoWydmcm9tJywgJ29mJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheSkgJiZcbiAgICAgICAgWydmaW5kSW5kZXgnLCAnZmluZCcsICdjb3B5V2l0aGluJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpKTtcbn0sIHRydWUpO1xuYWRkKCdlczYtYXJyYXktZmlsbCcsICgpID0+IHtcbiAgICBpZiAoJ2ZpbGwnIGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpIHtcbiAgICAgICAgLyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXG4gICAgICAgIHJldHVybiBbMV0uZmlsbCg5LCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpWzBdID09PSAxO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59LCB0cnVlKTtcbmFkZCgnZXM3LWFycmF5JywgKCkgPT4gJ2luY2x1ZGVzJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlLCB0cnVlKTtcbi8qIE1hcCAqL1xuYWRkKCdlczYtbWFwJywgKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsLk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvKlxuICAgIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHlcbiAgICBXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxuICAgIHRha2UgYXJndW1lbnRzIChpT1MgOC40KVxuICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IGdsb2JhbC5NYXAoW1swLCAxXV0pO1xuICAgICAgICAgICAgcmV0dXJuIG1hcC5oYXMoMCkgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICB0cnVlICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmVudHJpZXMgPT09ICdmdW5jdGlvbic7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn0sIHRydWUpO1xuLyogTWF0aCAqL1xuYWRkKCdlczYtbWF0aCcsICgpID0+IHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnY2x6MzInLFxuICAgICAgICAnc2lnbicsXG4gICAgICAgICdsb2cxMCcsXG4gICAgICAgICdsb2cyJyxcbiAgICAgICAgJ2xvZzFwJyxcbiAgICAgICAgJ2V4cG0xJyxcbiAgICAgICAgJ2Nvc2gnLFxuICAgICAgICAnc2luaCcsXG4gICAgICAgICd0YW5oJyxcbiAgICAgICAgJ2Fjb3NoJyxcbiAgICAgICAgJ2FzaW5oJyxcbiAgICAgICAgJ2F0YW5oJyxcbiAgICAgICAgJ3RydW5jJyxcbiAgICAgICAgJ2Zyb3VuZCcsXG4gICAgICAgICdjYnJ0JyxcbiAgICAgICAgJ2h5cG90J1xuICAgIF0uZXZlcnkoKG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuTWF0aFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XG59LCB0cnVlKTtcbmFkZCgnZXM2LW1hdGgtaW11bCcsICgpID0+IHtcbiAgICBpZiAoJ2ltdWwnIGluIGdsb2JhbC5NYXRoKSB7XG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cbiAgICAgICAgcmV0dXJuIE1hdGguaW11bCgweGZmZmZmZmZmLCA1KSA9PT0gLTU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn0sIHRydWUpO1xuLyogT2JqZWN0ICovXG5hZGQoJ2VzNi1vYmplY3QnLCAoKSA9PiB7XG4gICAgcmV0dXJuIHRydWUgJiZcbiAgICAgICAgWydhc3NpZ24nLCAnaXMnLCAnZ2V0T3duUHJvcGVydHlTeW1ib2xzJywgJ3NldFByb3RvdHlwZU9mJ10uZXZlcnkoKG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nKTtcbn0sIHRydWUpO1xuYWRkKCdlczIwMTctb2JqZWN0JywgKCkgPT4ge1xuICAgIHJldHVybiBbJ3ZhbHVlcycsICdlbnRyaWVzJywgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcnMnXS5ldmVyeSgobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbicpO1xufSwgdHJ1ZSk7XG4vKiBPYnNlcnZhYmxlICovXG5hZGQoJ2VzLW9ic2VydmFibGUnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLk9ic2VydmFibGUgIT09ICd1bmRlZmluZWQnLCB0cnVlKTtcbi8qIFByb21pc2UgKi9cbmFkZCgnZXM2LXByb21pc2UnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLlByb21pc2UgIT09ICd1bmRlZmluZWQnICYmIHRydWUsIHRydWUpO1xuLyogU2V0ICovXG5hZGQoJ2VzNi1zZXQnLCAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwuU2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgU2V0IGZ1bmN0aW9uYWxpdHkgKi9cbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IGdsb2JhbC5TZXQoWzFdKTtcbiAgICAgICAgcmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufSwgdHJ1ZSk7XG4vKiBTdHJpbmcgKi9cbmFkZCgnZXM2LXN0cmluZycsICgpID0+IHtcbiAgICByZXR1cm4gKFtcbiAgICAgICAgLyogc3RhdGljIG1ldGhvZHMgKi9cbiAgICAgICAgJ2Zyb21Db2RlUG9pbnQnXG4gICAgXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nKSAmJlxuICAgICAgICBbXG4gICAgICAgICAgICAvKiBpbnN0YW5jZSBtZXRob2RzICovXG4gICAgICAgICAgICAnY29kZVBvaW50QXQnLFxuICAgICAgICAgICAgJ25vcm1hbGl6ZScsXG4gICAgICAgICAgICAncmVwZWF0JyxcbiAgICAgICAgICAgICdzdGFydHNXaXRoJyxcbiAgICAgICAgICAgICdlbmRzV2l0aCcsXG4gICAgICAgICAgICAnaW5jbHVkZXMnXG4gICAgICAgIF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpKTtcbn0sIHRydWUpO1xuYWRkKCdlczYtc3RyaW5nLXJhdycsICgpID0+IHtcbiAgICBmdW5jdGlvbiBnZXRDYWxsU2l0ZShjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbLi4uY2FsbFNpdGVdO1xuICAgICAgICByZXN1bHQucmF3ID0gY2FsbFNpdGUucmF3O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBpZiAoJ3JhdycgaW4gZ2xvYmFsLlN0cmluZykge1xuICAgICAgICBsZXQgYiA9IDE7XG4gICAgICAgIGxldCBjYWxsU2l0ZSA9IGdldENhbGxTaXRlIGBhXFxuJHtifWA7XG4gICAgICAgIGNhbGxTaXRlLnJhdyA9IFsnYVxcXFxuJ107XG4gICAgICAgIGNvbnN0IHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWwuU3RyaW5nLnJhdyhjYWxsU2l0ZSwgNDIpID09PSAnYTpcXFxcbic7XG4gICAgICAgIHJldHVybiBzdXBwb3J0c1RydW5jO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59LCB0cnVlKTtcbmFkZCgnZXMyMDE3LXN0cmluZycsICgpID0+IHtcbiAgICByZXR1cm4gWydwYWRTdGFydCcsICdwYWRFbmQnXS5ldmVyeSgoa2V5KSA9PiB0eXBlb2YgZ2xvYmFsLlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJyk7XG59LCB0cnVlKTtcbi8qIFN5bWJvbCAqL1xuYWRkKCdlczYtc3ltYm9sJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCcsIHRydWUpO1xuLyogV2Vha01hcCAqL1xuYWRkKCdlczYtd2Vha21hcCcsICgpID0+IHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5XZWFrTWFwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5ICovXG4gICAgICAgIGNvbnN0IGtleTEgPSB7fTtcbiAgICAgICAgY29uc3Qga2V5MiA9IHt9O1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLldlYWtNYXAoW1trZXkxLCAxXV0pO1xuICAgICAgICBPYmplY3QuZnJlZXplKGtleTEpO1xuICAgICAgICByZXR1cm4gbWFwLmdldChrZXkxKSA9PT0gMSAmJiBtYXAuc2V0KGtleTIsIDIpID09PSBtYXAgJiYgdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufSwgdHJ1ZSk7XG4vKiBNaXNjZWxsYW5lb3VzIGZlYXR1cmVzICovXG5hZGQoJ21pY3JvdGFza3MnLCAoKSA9PiB0cnVlIHx8IGZhbHNlIHx8IHRydWUsIHRydWUpO1xuYWRkKCdwb3N0bWVzc2FnZScsICgpID0+IHtcbiAgICAvLyBJZiB3aW5kb3cgaXMgdW5kZWZpbmVkLCBhbmQgd2UgaGF2ZSBwb3N0TWVzc2FnZSwgaXQgcHJvYmFibHkgbWVhbnMgd2UncmUgaW4gYSB3ZWIgd29ya2VyLiBXZWIgd29ya2VycyBoYXZlXG4gICAgLy8gcG9zdCBtZXNzYWdlIGJ1dCBpdCBkb2Vzbid0IHdvcmsgaG93IHdlIGV4cGVjdCBpdCB0bywgc28gaXQncyBiZXN0IGp1c3QgdG8gcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsLndpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGdsb2JhbC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcbn0sIHRydWUpO1xuYWRkKCdyYWYnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJywgdHJ1ZSk7XG5hZGQoJ3NldGltbWVkaWF0ZScsICgpID0+IHR5cGVvZiBnbG9iYWwuc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJywgdHJ1ZSk7XG4vKiBET00gRmVhdHVyZXMgKi9cbmFkZCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLCAoKSA9PiB7XG4gICAgaWYgKHRydWUgJiYgQm9vbGVhbihnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcikpIHtcbiAgICAgICAgLy8gSUUxMSBoYXMgYW4gdW5yZWxpYWJsZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIHdoZXJlIHNldFByb3BlcnR5KCkgZG9lcyBub3RcbiAgICAgICAgLy8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxuICAgICAgICAvLyByZWxpYWJseS4gVGhlIGZvbGxvd2luZyBmZWF0dXJlIHRlc3Qgd2FzIGFkYXB0ZWQgZnJvbVxuICAgICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90MTBrby80YWNlYjhjNzE2ODFmZGIyNzVlMzNlZmU1ZTU3NmIxNFxuICAgICAgICBjb25zdCBleGFtcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG4gICAgICAgIGNvbnN0IEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZXhhbXBsZSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgICAgICBleGFtcGxlLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgIHJldHVybiBCb29sZWFuKG9ic2VydmVyLnRha2VSZWNvcmRzKCkubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufSwgdHJ1ZSk7XG5hZGQoJ2RvbS13ZWJhbmltYXRpb24nLCAoKSA9PiB0cnVlICYmIGdsb2JhbC5BbmltYXRpb24gIT09IHVuZGVmaW5lZCAmJiBnbG9iYWwuS2V5ZnJhbWVFZmZlY3QgIT09IHVuZGVmaW5lZCwgdHJ1ZSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXMubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9oYXMubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9oYXMnO1xuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbSkge1xuICAgIGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xuICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZGVzdHJ1Y3Rvcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGl0ZW0uY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGRlc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxubGV0IGNoZWNrTWljcm9UYXNrUXVldWU7XG5sZXQgbWljcm9UYXNrcztcbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1hY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVUYXNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgZGVzdHJ1Y3RvcjtcbiAgICBsZXQgZW5xdWV1ZTtcbiAgICAvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXG4gICAgaWYgKHRydWUpIHtcbiAgICAgICAgY29uc3QgcXVldWUgPSBbXTtcbiAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2socXVldWUuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKCdkb2pvLXF1ZXVlLW1lc3NhZ2UnLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChmYWxzZSkge1xuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRJbW1lZGlhdGUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsLmNsZWFyVGltZW91dDtcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBpZCA9IGVucXVldWUoaXRlbSk7XG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBkZXN0cnVjdG9yICYmXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcihpZCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG4gICAgcmV0dXJuIHRydWVcbiAgICAgICAgPyBxdWV1ZVRhc2tcbiAgICAgICAgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZVRhc2soY2FsbGJhY2spO1xuICAgICAgICB9O1xufSkoKTtcbi8vIFdoZW4gbm8gbWVjaGFuaXNtIGZvciByZWdpc3RlcmluZyBtaWNyb3Rhc2tzIGlzIGV4cG9zZWQgYnkgdGhlIGVudmlyb25tZW50LCBtaWNyb3Rhc2tzIHdpbGxcbi8vIGJlIHF1ZXVlZCBhbmQgdGhlbiBleGVjdXRlZCBpbiBhIHNpbmdsZSBtYWNyb3Rhc2sgYmVmb3JlIHRoZSBvdGhlciBtYWNyb3Rhc2tzIGFyZSBleGVjdXRlZC5cbmlmICghdHJ1ZSkge1xuICAgIGxldCBpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xuICAgIG1pY3JvVGFza3MgPSBbXTtcbiAgICBjaGVja01pY3JvVGFza1F1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzTWljcm9UYXNrUXVldWVkKSB7XG4gICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZCA9IHRydWU7XG4gICAgICAgICAgICBxdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlzTWljcm9UYXNrUXVldWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKG1pY3JvVGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8qKlxuICogU2NoZWR1bGVzIGFuIGFuaW1hdGlvbiB0YXNrIHdpdGggYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGl0IGV4aXN0cywgb3Igd2l0aCBgcXVldWVUYXNrYCBvdGhlcndpc2UuXG4gKlxuICogU2luY2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lJ3MgYmVoYXZpb3IgZG9lcyBub3QgbWF0Y2ggdGhhdCBleHBlY3RlZCBmcm9tIGBxdWV1ZVRhc2tgLCBpdCBpcyBub3QgdXNlZCB0aGVyZS5cbiAqIEhvd2V2ZXIsIGF0IHRpbWVzIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gZGVsZWdhdGUgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lOyBoZW5jZSB0aGUgZm9sbG93aW5nIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVBbmltYXRpb25UYXNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRydWUpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXVlVGFzaztcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxuICAgIHJldHVybiB0cnVlXG4gICAgICAgID8gcXVldWVBbmltYXRpb25UYXNrXG4gICAgICAgIDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XG4gICAgICAgICAgICByZXR1cm4gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbn0pKCk7XG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKlxuICogQW55IGNhbGxiYWNrcyByZWdpc3RlcmVkIHdpdGggYHF1ZXVlTWljcm9UYXNrYCB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgbmV4dCBtYWNyb3Rhc2suIElmIG5vIG5hdGl2ZVxuICogbWVjaGFuaXNtIGZvciBzY2hlZHVsaW5nIG1hY3JvdGFza3MgaXMgZXhwb3NlZCwgdGhlbiBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgZmlyZWQgYmVmb3JlIGFueSBtYWNyb3Rhc2tcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgbGV0IHF1ZXVlTWljcm9UYXNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgZW5xdWV1ZTtcbiAgICBpZiAoZmFsc2UpIHtcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBnbG9iYWwucHJvY2Vzcy5uZXh0VGljayhleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHJ1ZSkge1xuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGdsb2JhbC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRydWUpIHtcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cbiAgICAgICAgY29uc3QgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcXVldWUucHVzaChpdGVtKTtcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcbiAgICAgICAgICAgIG1pY3JvVGFza3MucHVzaChpdGVtKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgICAgfTtcbiAgICAgICAgZW5xdWV1ZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xuICAgIH07XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCIvKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHZhbHVlIHByb3BlcnR5IGRlc2NyaXB0b3JcbiAqXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXG4gKiBAcGFyYW0gZW51bWVyYWJsZSAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZW51bWJlcmFibGUsIGRlZmF1bHRzIHRvIGZhbHNlXG4gKiBAcGFyYW0gd3JpdGFibGUgICAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgd3JpdGFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEByZXR1cm4gICAgICAgICAgICAgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUsIGVudW1lcmFibGUgPSBmYWxzZSwgd3JpdGFibGUgPSB0cnVlLCBjb25maWd1cmFibGUgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxuICAgICAgICB3cml0YWJsZTogd3JpdGFibGUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5leHBvcnQgY2xhc3MgSW5qZWN0b3IgZXh0ZW5kcyBFdmVudGVkIHtcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xuICAgIH1cbiAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXlsb2FkO1xuICAgIH1cbiAgICBzZXQocGF5bG9hZCkge1xuICAgICAgICB0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEluamVjdG9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SW5qZWN0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbi8qKlxuICogRW51bSB0byBpZGVudGlmeSB0aGUgdHlwZSBvZiBldmVudC5cbiAqIExpc3RlbmluZyB0byAnUHJvamVjdG9yJyB3aWxsIG5vdGlmeSB3aGVuIHByb2plY3RvciBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcbiAqIExpc3RlbmluZyB0byAnV2lkZ2V0JyB3aWxsIG5vdGlmeSB3aGVuIHdpZGdldCByb290IGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxuICovXG5leHBvcnQgdmFyIE5vZGVFdmVudFR5cGU7XG4oZnVuY3Rpb24gKE5vZGVFdmVudFR5cGUpIHtcbiAgICBOb2RlRXZlbnRUeXBlW1wiUHJvamVjdG9yXCJdID0gXCJQcm9qZWN0b3JcIjtcbiAgICBOb2RlRXZlbnRUeXBlW1wiV2lkZ2V0XCJdID0gXCJXaWRnZXRcIjtcbn0pKE5vZGVFdmVudFR5cGUgfHwgKE5vZGVFdmVudFR5cGUgPSB7fSkpO1xuZXhwb3J0IGNsYXNzIE5vZGVIYW5kbGVyIGV4dGVuZHMgRXZlbnRlZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX25vZGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGdldChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XG4gICAgfVxuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XG4gICAgfVxuICAgIGFkZChlbGVtZW50LCBrZXkpIHtcbiAgICAgICAgdGhpcy5fbm9kZU1hcC5zZXQoa2V5LCBlbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xuICAgIH1cbiAgICBhZGRSb290KCkge1xuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcbiAgICB9XG4gICAgYWRkUHJvamVjdG9yKCkge1xuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLlByb2plY3RvciB9KTtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBOb2RlSGFuZGxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vZGVIYW5kbGVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG5pbXBvcnQgTWFwIGZyb20gJ0Bkb2pvL3NoaW0vTWFwJztcbmltcG9ydCBTeW1ib2wgZnJvbSAnQGRvam8vc2hpbS9TeW1ib2wnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG4vKipcbiAqIFdpZGdldCBiYXNlIHN5bWJvbCB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXSURHRVRfQkFTRV9UWVBFID0gU3ltYm9sKCdXaWRnZXQgQmFzZScpO1xuLyoqXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXG4gKlxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkge1xuICAgIHJldHVybiBCb29sZWFuKGl0ZW0gJiYgaXRlbS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQoaXRlbSkge1xuICAgIHJldHVybiBCb29sZWFuKGl0ZW0gJiZcbiAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxuICAgICAgICBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtLmRlZmF1bHQpKTtcbn1cbi8qKlxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50ZWQge1xuICAgIC8qKlxuICAgICAqIEVtaXQgbG9hZGVkIGV2ZW50IGZvciByZWdpc3RyeSBsYWJlbFxuICAgICAqL1xuICAgIGVtaXRMb2FkZWRFdmVudCh3aWRnZXRMYWJlbCwgaXRlbSkge1xuICAgICAgICB0aGlzLmVtaXQoe1xuICAgICAgICAgICAgdHlwZTogd2lkZ2V0TGFiZWwsXG4gICAgICAgICAgICBhY3Rpb246ICdsb2FkZWQnLFxuICAgICAgICAgICAgaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVmaW5lKGxhYmVsLCBpdGVtKSB7XG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB3aWRnZXQgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIGl0ZW0udGhlbigod2lkZ2V0Q3RvcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlZmluZUluamVjdG9yKGxhYmVsLCBpdGVtKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbmplY3RvciBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICcke2xhYmVsLnRvU3RyaW5nKCl9J2ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcbiAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xuICAgIH1cbiAgICBnZXQobGFiZWwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhcyhsYWJlbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl93aWRnZXRSZWdpc3RyeS5nZXQobGFiZWwpO1xuICAgICAgICBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGl0ZW0oKTtcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKCh3aWRnZXRDdG9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQod2lkZ2V0Q3RvcikpIHtcbiAgICAgICAgICAgICAgICB3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcbiAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xuICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldEluamVjdG9yKGxhYmVsKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNJbmplY3RvcihsYWJlbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmdldChsYWJlbCk7XG4gICAgfVxuICAgIGhhcyhsYWJlbCkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcbiAgICB9XG4gICAgaGFzSW5qZWN0b3IobGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVnaXN0cnkubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gJy4vUmVnaXN0cnknO1xuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5SGFuZGxlciBleHRlbmRzIEV2ZW50ZWQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuICAgICAgICB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLmJhc2VSZWdpc3RyeSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vd24oeyBkZXN0cm95IH0pO1xuICAgIH1cbiAgICBzZXQgYmFzZShiYXNlUmVnaXN0cnkpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFzZVJlZ2lzdHJ5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJhc2VSZWdpc3RyeSA9IGJhc2VSZWdpc3RyeTtcbiAgICB9XG4gICAgZGVmaW5lKGxhYmVsLCB3aWRnZXQpIHtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xuICAgIH1cbiAgICBkZWZpbmVJbmplY3RvcihsYWJlbCwgaW5qZWN0b3IpIHtcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcbiAgICB9XG4gICAgaGFzKGxhYmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XG4gICAgfVxuICAgIGhhc0luamVjdG9yKGxhYmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xuICAgIH1cbiAgICBnZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XG4gICAgfVxuICAgIGdldEluamVjdG9yKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcbiAgICB9XG4gICAgX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgZ2V0RnVuY3Rpb25OYW1lLCBsYWJlbE1hcCkge1xuICAgICAgICBjb25zdCByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVnaXN0cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVnaXN0cnkgPSByZWdpc3RyaWVzW2ldO1xuICAgICAgICAgICAgaWYgKCFyZWdpc3RyeSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xuICAgICAgICAgICAgY29uc3QgcmVnaXN0ZXJlZExhYmVscyA9IGxhYmVsTWFwLmdldChyZWdpc3RyeSkgfHwgW107XG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocmVnaXN0ZXJlZExhYmVscy5pbmRleE9mKGxhYmVsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSByZWdpc3RyeS5vbihsYWJlbCwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdsb2FkZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xuICAgICAgICAgICAgICAgIGxhYmVsTWFwLnNldChyZWdpc3RyeSwgWy4uLnJlZ2lzdGVyZWRMYWJlbHMsIGxhYmVsXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnlIYW5kbGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVnaXN0cnlIYW5kbGVyLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgdiB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBhdXRvIH0gZnJvbSAnLi9kaWZmJztcbmltcG9ydCBSZWdpc3RyeUhhbmRsZXIgZnJvbSAnLi9SZWdpc3RyeUhhbmRsZXInO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IHsgd2lkZ2V0SW5zdGFuY2VNYXAgfSBmcm9tICcuL3Zkb20nO1xuaW1wb3J0IHsgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmNvbnN0IGRlY29yYXRvck1hcCA9IG5ldyBNYXAoKTtcbmNvbnN0IGJvdW5kQXV0byA9IGF1dG8uYmluZChudWxsKTtcbi8qKlxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXG4gKi9cbmV4cG9ydCBjbGFzcyBXaWRnZXRCYXNlIHtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlcyBpZiBpdCBpcyB0aGUgaW5pdGlhbCBzZXQgcHJvcGVydGllcyBjeWNsZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBbXTtcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIgPSBuZXcgTm9kZUhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYm91bmRJbnZhbGlkYXRlID0gdGhpcy5pbnZhbGlkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHdpZGdldEluc3RhbmNlTWFwLnNldCh0aGlzLCB7XG4gICAgICAgICAgICBkaXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgIG9uQXR0YWNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkF0dGFjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGV0YWNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkRldGFjaCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3koKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXG4gICAgICAgICAgICByZWdpc3RyeTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcmVQcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgIHJlbmRlcmluZzogZmFsc2UsXG4gICAgICAgICAgICBpbnB1dFByb3BlcnRpZXM6IHt9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9ydW5BZnRlckNvbnN0cnVjdG9ycygpO1xuICAgIH1cbiAgICBtZXRhKE1ldGFUeXBlKSB7XG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcbiAgICAgICAgaWYgKCFjYWNoZWQpIHtcbiAgICAgICAgICAgIGNhY2hlZCA9IG5ldyBNZXRhVHlwZSh7XG4gICAgICAgICAgICAgICAgaW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxuICAgICAgICAgICAgICAgIG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcbiAgICAgICAgICAgICAgICBiaW5kOiB0aGlzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuc2V0KE1ldGFUeXBlLCBjYWNoZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWNoZWQ7XG4gICAgfVxuICAgIG9uQXR0YWNoKCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gICAgfVxuICAgIG9uRGV0YWNoKCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gICAgfVxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG4gICAgZ2V0IGNoYW5nZWRQcm9wZXJ0eUtleXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5c107XG4gICAgfVxuICAgIF9fc2V0Q29yZVByb3BlcnRpZXNfXyhjb3JlUHJvcGVydGllcykge1xuICAgICAgICBjb25zdCB7IGJhc2VSZWdpc3RyeSB9ID0gY29yZVByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5iYXNlID0gYmFzZVJlZ2lzdHJ5O1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XG4gICAgfVxuICAgIF9fc2V0UHJvcGVydGllc19fKG9yaWdpbmFsUHJvcGVydGllcykge1xuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XG4gICAgICAgIGluc3RhbmNlRGF0YS5pbnB1dFByb3BlcnRpZXMgPSBvcmlnaW5hbFByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLl9ydW5CZWZvcmVQcm9wZXJ0aWVzKG9yaWdpbmFsUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5Jyk7XG4gICAgICAgIGNvbnN0IGNoYW5nZWRQcm9wZXJ0eUtleXMgPSBbXTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuICAgICAgICBpZiAodGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPT09IGZhbHNlIHx8IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGFsbFByb3BlcnRpZXMgPSBbLi4ucHJvcGVydHlOYW1lcywgLi4uT2JqZWN0LmtleXModGhpcy5fcHJvcGVydGllcyldO1xuICAgICAgICAgICAgY29uc3QgY2hlY2tlZFByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZQcm9wZXJ0eVJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgIGxldCBydW5SZWFjdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGFsbFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoZWNrZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1Byb3BlcnR5ID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Byb3BlcnR5ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLCBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1blJlYWN0aW9ucyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZGdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcihgZGlmZlByb3BlcnR5OiR7cHJvcGVydHlOYW1lfWApO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRpZmZGdW5jdGlvbnNbaV0ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBib3VuZEF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydW5SZWFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMocHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykuZm9yRWFjaCgoYXJncywgcmVhY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MuY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3Rpb24uY2FsbCh0aGlzLCBhcmdzLnByZXZpb3VzUHJvcGVydGllcywgYXJncy5uZXdQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgfVxuICAgIF9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbikge1xuICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX19yZW5kZXJfXygpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpbnN0YW5jZURhdGEuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgcmVuZGVyID0gdGhpcy5fcnVuQmVmb3JlUmVuZGVycygpO1xuICAgICAgICBsZXQgZE5vZGUgPSByZW5kZXIoKTtcbiAgICAgICAgZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBkTm9kZTtcbiAgICB9XG4gICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmludmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gdignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxuICAgICAqL1xuICAgIGFkZERlY29yYXRvcihkZWNvcmF0b3JLZXksIHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG4gICAgICAgICAgICBsZXQgZGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvck1hcC5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBpZiAoIWRlY29yYXRvckxpc3QpIHtcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgIGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgICAgIGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XG4gICAgICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BlY2lmaWNEZWNvcmF0b3JMaXN0LnB1c2goLi4udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSk7XG4gICAgICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBbLi4uZGVjb3JhdG9ycywgLi4udmFsdWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBidWlsZCB0aGUgbGlzdCBvZiBkZWNvcmF0b3JzIGZyb20gdGhlIGdsb2JhbCBkZWNvcmF0b3IgbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG4gICAgICogQHJldHVybiBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSkge1xuICAgICAgICBjb25zdCBhbGxEZWNvcmF0b3JzID0gW107XG4gICAgICAgIGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHdoaWxlIChjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZU1hcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSBpbnN0YW5jZU1hcC5nZXQoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBhbGxEZWNvcmF0b3JzLnVuc2hpZnQoLi4uZGVjb3JhdG9ycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyBwcml2YXRlIHJlc291cmNlcyBmb3IgV2lkZ2V0QmFzZVxuICAgICAqL1xuICAgIF9kZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwLmZvckVhY2goKG1ldGEpID0+IHtcbiAgICAgICAgICAgICAgICBtZXRhLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIGRlY29yYXRvciB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuICAgICAqL1xuICAgIGdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpIHtcbiAgICAgICAgbGV0IGFsbERlY29yYXRvcnMgPSB0aGlzLl9kZWNvcmF0b3JDYWNoZS5nZXQoZGVjb3JhdG9yS2V5KTtcbiAgICAgICAgaWYgKGFsbERlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XG4gICAgICAgIH1cbiAgICAgICAgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXkpO1xuICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBhbGxEZWNvcmF0b3JzKTtcbiAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XG4gICAgfVxuICAgIF9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMobmV3UHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykge1xuICAgICAgICBjb25zdCByZWFjdGlvbkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIHJlYWN0aW9uRnVuY3Rpb25zLnJlZHVjZSgocmVhY3Rpb25Qcm9wZXJ0eU1hcCwgeyByZWFjdGlvbiwgcHJvcGVydHlOYW1lIH0pID0+IHtcbiAgICAgICAgICAgIGxldCByZWFjdGlvbkFyZ3VtZW50cyA9IHJlYWN0aW9uUHJvcGVydHlNYXAuZ2V0KHJlYWN0aW9uKTtcbiAgICAgICAgICAgIGlmIChyZWFjdGlvbkFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzUHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5wcmV2aW91c1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLm5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IG5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWN0aW9uUHJvcGVydHlNYXAuc2V0KHJlYWN0aW9uLCByZWFjdGlvbkFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gcmVhY3Rpb25Qcm9wZXJ0eU1hcDtcbiAgICAgICAgfSwgbmV3IE1hcCgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQmluZHMgdW5ib3VuZCBwcm9wZXJ0eSBmdW5jdGlvbnMgdG8gdGhlIHNwZWNpZmllZCBgYmluZGAgcHJvcGVydHlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yIGZ1bmN0aW9uc1xuICAgICAqL1xuICAgIF9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0eSwgYmluZCkge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnZnVuY3Rpb24nICYmIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKHByb3BlcnR5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYmluZEluZm8gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocHJvcGVydHkpIHx8IHt9O1xuICAgICAgICAgICAgbGV0IHsgYm91bmRGdW5jLCBzY29wZSB9ID0gYmluZEluZm87XG4gICAgICAgICAgICBpZiAoYm91bmRGdW5jID09PSB1bmRlZmluZWQgfHwgc2NvcGUgIT09IGJpbmQpIHtcbiAgICAgICAgICAgICAgICBib3VuZEZ1bmMgPSBwcm9wZXJ0eS5iaW5kKGJpbmQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLnNldChwcm9wZXJ0eSwgeyBib3VuZEZ1bmMsIHNjb3BlOiBiaW5kIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kRnVuYztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuICAgIGdldCByZWdpc3RyeSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcigpO1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeTtcbiAgICB9XG4gICAgX3J1bkJlZm9yZVByb3BlcnRpZXMocHJvcGVydGllcykge1xuICAgICAgICBjb25zdCBiZWZvcmVQcm9wZXJ0aWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcbiAgICAgICAgaWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBiZWZvcmVQcm9wZXJ0aWVzRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwodGhpcywgcHJvcGVydGllcykpO1xuICAgICAgICAgICAgfSwgT2JqZWN0LmFzc2lnbih7fSwgcHJvcGVydGllcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXG4gICAgICovXG4gICAgX3J1bkJlZm9yZVJlbmRlcnMoKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZSgocmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHJlbmRlciwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlZFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlbmRlciBmdW5jdGlvbiBub3QgcmV0dXJuZWQgZnJvbSBiZWZvcmVSZW5kZXIsIHVzaW5nIHByZXZpb3VzIHJlbmRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlZFJlbmRlcjtcbiAgICAgICAgICAgIH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xuICAgICAqXG4gICAgICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcbiAgICAgKi9cbiAgICBydW5BZnRlclJlbmRlcnMoZE5vZGUpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XG4gICAgICAgIGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVycy5yZWR1Y2UoKGROb2RlLCBhZnRlclJlbmRlckZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBkTm9kZSk7XG4gICAgICAgICAgICB9LCBkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0YS5hZnRlclJlbmRlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGROb2RlO1xuICAgIH1cbiAgICBfcnVuQWZ0ZXJDb25zdHJ1Y3RvcnMoKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcbiAgICAgICAgaWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFmdGVyQ29uc3RydWN0b3JzLmZvckVhY2goKGFmdGVyQ29uc3RydWN0b3IpID0+IGFmdGVyQ29uc3RydWN0b3IuY2FsbCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIHN0YXRpYyBpZGVudGlmaWVyXG4gKi9cbldpZGdldEJhc2UuX3R5cGUgPSBXSURHRVRfQkFTRV9UWVBFO1xuZXhwb3J0IGRlZmF1bHQgV2lkZ2V0QmFzZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdpZGdldEJhc2UubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImxldCBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJyc7XG5sZXQgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJyc7XG5mdW5jdGlvbiBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KSB7XG4gICAgaWYgKCdXZWJraXRUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRBbmltYXRpb25FbmQnO1xuICAgIH1cbiAgICBlbHNlIGlmICgndHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSB8fCAnTW96VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xuICAgICAgICBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3RyYW5zaXRpb25lbmQnO1xuICAgICAgICBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnYW5pbWF0aW9uZW5kJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbml0aWFsaXplKGVsZW1lbnQpIHtcbiAgICBpZiAoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID09PSAnJykge1xuICAgICAgICBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50KTtcbiAgICB9XG59XG5mdW5jdGlvbiBydW5BbmRDbGVhblVwKGVsZW1lbnQsIHN0YXJ0QW5pbWF0aW9uLCBmaW5pc2hBbmltYXRpb24pIHtcbiAgICBpbml0aWFsaXplKGVsZW1lbnQpO1xuICAgIGxldCBmaW5pc2hlZCA9IGZhbHNlO1xuICAgIGxldCB0cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWZpbmlzaGVkKSB7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbiAgICAgICAgICAgIGZpbmlzaEFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBzdGFydEFuaW1hdGlvbigpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcbn1cbmZ1bmN0aW9uIGV4aXQobm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlTm9kZSkge1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uQWN0aXZlIHx8IGAke2V4aXRBbmltYXRpb259LWFjdGl2ZWA7XG4gICAgcnVuQW5kQ2xlYW5VcChub2RlLCAoKSA9PiB7XG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChleGl0QW5pbWF0aW9uKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgIH0sICgpID0+IHtcbiAgICAgICAgcmVtb3ZlTm9kZSgpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZW50ZXIobm9kZSwgcHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pIHtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZW50ZXJBbmltYXRpb25BY3RpdmUgfHwgYCR7ZW50ZXJBbmltYXRpb259LWFjdGl2ZWA7XG4gICAgcnVuQW5kQ2xlYW5VcChub2RlLCAoKSA9PiB7XG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChlbnRlckFuaW1hdGlvbik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICB9LCAoKSA9PiB7XG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShlbnRlckFuaW1hdGlvbik7XG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XG4gICAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZW50ZXIsXG4gICAgZXhpdFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNzc1RyYW5zaXRpb25zLm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5tanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtZW51LWl0ZW0iLCJpbXBvcnQgU3ltYm9sIGZyb20gJ0Bkb2pvL3NoaW0vU3ltYm9sJztcbi8qKlxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFdOb2RlIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IFdOT0RFID0gU3ltYm9sKCdJZGVudGlmaWVyIGZvciBhIFdOb2RlLicpO1xuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgVk5vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgVk5PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgVk5vZGUuJyk7XG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBXTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXTm9kZShjaGlsZCkge1xuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gV05PREUpO1xufVxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQpIHtcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IFZOT0RFKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnROb2RlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUudGFnTmFtZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXMsIG9wdGlvbnNPck1vZGlmaWVyLCBwcmVkaWNhdGUpIHtcbiAgICBsZXQgc2hhbGxvdyA9IGZhbHNlO1xuICAgIGxldCBtb2RpZmllcjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBtb2RpZmllciA9IG9wdGlvbnNPck1vZGlmaWVyLm1vZGlmaWVyO1xuICAgICAgICBwcmVkaWNhdGUgPSBvcHRpb25zT3JNb2RpZmllci5wcmVkaWNhdGU7XG4gICAgICAgIHNoYWxsb3cgPSBvcHRpb25zT3JNb2RpZmllci5zaGFsbG93IHx8IGZhbHNlO1xuICAgIH1cbiAgICBsZXQgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyBbLi4uZE5vZGVzXSA6IFtkTm9kZXNdO1xuICAgIGZ1bmN0aW9uIGJyZWFrZXIoKSB7XG4gICAgICAgIG5vZGVzID0gW107XG4gICAgfVxuICAgIHdoaWxlIChub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzLnNoaWZ0KCk7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIXNoYWxsb3cgJiYgKGlzV05vZGUobm9kZSkgfHwgaXNWTm9kZShub2RlKSkgJiYgbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gWy4uLm5vZGVzLCAuLi5ub2RlLmNoaWxkcmVuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShub2RlKSkge1xuICAgICAgICAgICAgICAgIG1vZGlmaWVyKG5vZGUsIGJyZWFrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkTm9kZXM7XG59XG4vKipcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHcod2lkZ2V0Q29uc3RydWN0b3IsIHByb3BlcnRpZXMsIGNoaWxkcmVuID0gW10pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3IsXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIHR5cGU6IFdOT0RFXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB2KHRhZywgcHJvcGVydGllc09yQ2hpbGRyZW4gPSB7fSwgY2hpbGRyZW4gPSB1bmRlZmluZWQpIHtcbiAgICBsZXQgcHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuICAgIGxldCBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjaztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzT3JDaGlsZHJlbikpIHtcbiAgICAgICAgY2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBwcm9wZXJ0aWVzO1xuICAgICAgICBwcm9wZXJ0aWVzID0ge307XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHRhZyxcbiAgICAgICAgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICB0eXBlOiBWTk9ERVxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIFZOb2RlIGZvciBhbiBleGlzdGluZyBET00gTm9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbSh7IG5vZGUsIGF0dHJzID0ge30sIHByb3BzID0ge30sIG9uID0ge30sIGRpZmZUeXBlID0gJ25vbmUnIH0sIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFnOiBpc0VsZW1lbnROb2RlKG5vZGUpID8gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJyxcbiAgICAgICAgcHJvcGVydGllczogcHJvcHMsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJzLFxuICAgICAgICBldmVudHM6IG9uLFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgdHlwZTogVk5PREUsXG4gICAgICAgIGRvbU5vZGU6IG5vZGUsXG4gICAgICAgIHRleHQ6IGlzRWxlbWVudE5vZGUobm9kZSkgPyB1bmRlZmluZWQgOiBub2RlLmRhdGEsXG4gICAgICAgIGRpZmZUeXBlXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2QubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmV4cG9ydCBmdW5jdGlvbiBhZnRlclJlbmRlcihtZXRob2QpIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGFmdGVyUmVuZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWZ0ZXJSZW5kZXIubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXIubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZCkge1xuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XG4gICAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCBiZWZvcmVQcm9wZXJ0aWVzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmVmb3JlUHJvcGVydGllcy5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgfSBmcm9tICcuLi9yZWdpc3RlckN1c3RvbUVsZW1lbnQnO1xuLyoqXG4gKiBUaGlzIERlY29yYXRvciBpcyBwcm92aWRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGN1c3RvbSBlbGVtZW50LCBhbmRcbiAqIHJlZ2lzdGVycyB0aGF0IGN1c3RvbSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRWxlbWVudCh7IHRhZywgcHJvcGVydGllcyA9IFtdLCBhdHRyaWJ1dGVzID0gW10sIGV2ZW50cyA9IFtdLCBjaGlsZFR5cGUgPSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8gfSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvciA9IHtcbiAgICAgICAgICAgIHRhZ05hbWU6IHRhZyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICAgICAgZXZlbnRzLFxuICAgICAgICAgICAgY2hpbGRUeXBlXG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydCBkZWZhdWx0IGN1c3RvbUVsZW1lbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jdXN0b21FbGVtZW50Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IHsgaGFuZGxlRGVjb3JhdG9yIH0gZnJvbSAnLi9oYW5kbGVEZWNvcmF0b3InO1xuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIGFzIGEgc3BlY2lmaWMgcHJvcGVydHkgZGlmZlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXG4gKiBAcGFyYW0gZGlmZlR5cGUgICAgICBUaGUgZGlmZiB0eXBlLCBkZWZhdWx0IGlzIERpZmZUeXBlLkFVVE8uXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZSwgZGlmZkZ1bmN0aW9uLCByZWFjdGlvbkZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCwgZGlmZkZ1bmN0aW9uLmJpbmQobnVsbCkpO1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5JywgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgaWYgKHJlYWN0aW9uRnVuY3Rpb24gfHwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicsIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgcmVhY3Rpb246IHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IHJlYWN0aW9uRnVuY3Rpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCBkaWZmUHJvcGVydHk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaWZmUHJvcGVydHkubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiLyoqXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZGVmYXVsdCBoYW5kbGVEZWNvcmF0b3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYW5kbGVEZWNvcmF0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuL2JlZm9yZVByb3BlcnRpZXMnO1xuLyoqXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXG4gKi9cbmNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBEZWNvcmF0b3IgcmV0cmlldmVzIGFuIGluamVjdG9yIGZyb20gYW4gYXZhaWxhYmxlIHJlZ2lzdHJ5IHVzaW5nIHRoZSBuYW1lIGFuZFxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXG4gKiBhbmQgY3VycmVudCBwcm9wZXJ0aWVzIHdpdGggdGhlIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QoeyBuYW1lLCBnZXRQcm9wZXJ0aWVzIH0pIHtcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yKCh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5yZWdpc3RyeS5nZXRJbmplY3RvcihuYW1lKTtcbiAgICAgICAgICAgIGlmIChpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnMgPSByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLmdldCh0aGlzKSB8fCBbXTtcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9yc01hcC5zZXQodGhpcywgcmVnaXN0ZXJlZEluamVjdG9ycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmluZGV4T2YoaW5qZWN0b3IpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmplY3Rvci5vbignaW52YWxpZGF0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFByb3BlcnRpZXMoaW5qZWN0b3IuZ2V0KCksIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSh0YXJnZXQpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgaW5qZWN0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5qZWN0Lm1qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmZ1bmN0aW9uIGlzT2JqZWN0T3JBcnJheSh2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkOiB0cnVlLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNoYW5nZWQ6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNoYW5nZWQ6IHByZXZpb3VzUHJvcGVydHkgIT09IG5ld1Byb3BlcnR5LFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHZhbGlkT2xkUHJvcGVydHkgPSBwcmV2aW91c1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShwcmV2aW91c1Byb3BlcnR5KTtcbiAgICBjb25zdCB2YWxpZE5ld1Byb3BlcnR5ID0gbmV3UHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KTtcbiAgICBpZiAoIXZhbGlkT2xkUHJvcGVydHkgfHwgIXZhbGlkTmV3UHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoYW5nZWQ6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcHJldmlvdXNLZXlzID0gT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0eSk7XG4gICAgY29uc3QgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld1Byb3BlcnR5KTtcbiAgICBpZiAocHJldmlvdXNLZXlzLmxlbmd0aCAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKChrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXdQcm9wZXJ0eVtrZXldICE9PSBwcmV2aW91c1Byb3BlcnR5W2tleV07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VkLFxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKG5ld1Byb3BlcnR5Ll90eXBlID09PSBXSURHRVRfQkFTRV9UWVBFKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XG4gICAgICAgIHJlc3VsdCA9IHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpZmYubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kaWZmLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdAZG9qby9jb3JlL2xhbmcnO1xuaW1wb3J0IHsgY3JlYXRlSGFuZGxlIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCBjc3NUcmFuc2l0aW9ucyBmcm9tICcuLi9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zJztcbmltcG9ydCB7IGFmdGVyUmVuZGVyIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyJztcbmltcG9ydCB7IHYgfSBmcm9tICcuLy4uL2QnO1xuaW1wb3J0IHsgZG9tIH0gZnJvbSAnLi8uLi92ZG9tJztcbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYXR0YWNoIHN0YXRlIG9mIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IHZhciBQcm9qZWN0b3JBdHRhY2hTdGF0ZTtcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcbiAgICBQcm9qZWN0b3JBdHRhY2hTdGF0ZVtQcm9qZWN0b3JBdHRhY2hTdGF0ZVtcIkF0dGFjaGVkXCJdID0gMV0gPSBcIkF0dGFjaGVkXCI7XG4gICAgUHJvamVjdG9yQXR0YWNoU3RhdGVbUHJvamVjdG9yQXR0YWNoU3RhdGVbXCJEZXRhY2hlZFwiXSA9IDJdID0gXCJEZXRhY2hlZFwiO1xufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgfHwgKFByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcbi8qKlxuICogQXR0YWNoIHR5cGUgZm9yIHRoZSBwcm9qZWN0b3JcbiAqL1xuZXhwb3J0IHZhciBBdHRhY2hUeXBlO1xuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XG4gICAgQXR0YWNoVHlwZVtBdHRhY2hUeXBlW1wiQXBwZW5kXCJdID0gMV0gPSBcIkFwcGVuZFwiO1xuICAgIEF0dGFjaFR5cGVbQXR0YWNoVHlwZVtcIk1lcmdlXCJdID0gMl0gPSBcIk1lcmdlXCI7XG59KShBdHRhY2hUeXBlIHx8IChBdHRhY2hUeXBlID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XG4gICAgY2xhc3MgUHJvamVjdG9yIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnM6IGNzc1RyYW5zaXRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5yb290ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgIHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcbiAgICAgICAgfVxuICAgICAgICBhcHBlbmQocm9vdCkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZCxcbiAgICAgICAgICAgICAgICByb290XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZShyb290KSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuTWVyZ2UsXG4gICAgICAgICAgICAgICAgcm9vdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHJvb3Qocm9vdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSByb290IGVsZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB9XG4gICAgICAgIGdldCByb290KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGFzeW5jKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FzeW5jO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhc3luYyhhc3luYykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSBhc3luYyBtb2RlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hc3luYyA9IGFzeW5jO1xuICAgICAgICB9XG4gICAgICAgIHNhbmRib3goZG9jID0gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjcmVhdGUgc2FuZGJveCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcbiAgICAgICAgICAgIC8qIGZyZWUgdXAgdGhlIGRvY3VtZW50IGZyYWdtZW50IGZvciBHQyAqL1xuICAgICAgICAgICAgdGhpcy5vd24oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSBwcmV2aW91c1Jvb3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaCh7XG4gICAgICAgICAgICAgICAgLyogRG9jdW1lbnRGcmFnbWVudCBpcyBub3QgYXNzaWduYWJsZSB0byBFbGVtZW50LCBidXQgcHJvdmlkZXMgZXZlcnl0aGluZyBuZWVkZWQgdG8gd29yayAqL1xuICAgICAgICAgICAgICAgIHJvb3Q6IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5BcHBlbmRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNldENoaWxkcmVuKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLl9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgICAgc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB0aGlzLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIF9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzICYmIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkgIT09IHByb3BlcnRpZXMucmVnaXN0cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0gYXNzaWduKHt9LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIHN1cGVyLl9fc2V0Q29yZVByb3BlcnRpZXNfXyh7IGJpbmQ6IHRoaXMsIGJhc2VSZWdpc3RyeTogcHJvcGVydGllcy5yZWdpc3RyeSB9KTtcbiAgICAgICAgICAgIHN1cGVyLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHRvSHRtbCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlICE9PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCB8fCAhdGhpcy5fcHJvamVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGlzIG5vdCBhdHRhY2hlZCwgY2Fubm90IHJldHVybiBhbiBIVE1MIHN0cmluZyBvZiBwcm9qZWN0aW9uLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2plY3Rpb24uZG9tTm9kZS5jaGlsZE5vZGVzWzBdLm91dGVySFRNTDtcbiAgICAgICAgfVxuICAgICAgICBhZnRlclJlbmRlcihyZXN1bHQpIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVzdWx0O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnIHx8IHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSB2KCdzcGFuJywge30sIFtyZXN1bHRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICAgIG93bihoYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xuICAgICAgICB9XG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfYXR0YWNoKHsgdHlwZSwgcm9vdCB9KSB7XG4gICAgICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkO1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub3duKGhhbmRsZSk7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hIYW5kbGUgPSBjcmVhdGVIYW5kbGUoaGFuZGxlKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMsIHsgc3luYzogIXRoaXMuX2FzeW5jIH0pO1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBBdHRhY2hUeXBlLkFwcGVuZDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbiA9IGRvbS5hcHBlbmQodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbiA9IGRvbS5tZXJnZSh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGFmdGVyUmVuZGVyKCksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXG4gICAgXSwgUHJvamVjdG9yLnByb3RvdHlwZSwgXCJhZnRlclJlbmRlclwiLCBudWxsKTtcbiAgICByZXR1cm4gUHJvamVjdG9yO1xufVxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdG9yTWl4aW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Qcm9qZWN0b3IubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vLi4vSW5qZWN0b3InO1xuaW1wb3J0IHsgaW5qZWN0IH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2luamVjdCc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGRpZmZQcm9wZXJ0eSB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHknO1xuaW1wb3J0IHsgc2hhbGxvdyB9IGZyb20gJy4vLi4vZGlmZic7XG5jb25zdCBUSEVNRV9LRVkgPSAnIF9rZXknO1xuZXhwb3J0IGNvbnN0IElOSkVDVEVEX1RIRU1FX0tFWSA9IFN5bWJvbCgndGhlbWUnKTtcbi8qKlxuICogRGVjb3JhdG9yIGZvciBiYXNlIGNzcyBjbGFzc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aGVtZSh0aGVtZSkge1xuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCkgPT4ge1xuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJywgdGhlbWUpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgcmV2ZXJzZSBsb29rdXAgZm9yIHRoZSBjbGFzc2VzIHBhc3NlZCBpbiB2aWEgdGhlIGB0aGVtZWAgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGNsYXNzZXMgVGhlIGJhc2VDbGFzc2VzIG9iamVjdFxuICogQHJlcXVpcmVzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMucmVkdWNlKChjdXJyZW50Q2xhc3NOYW1lcywgYmFzZUNsYXNzKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50Q2xhc3NOYW1lc1tiYXNlQ2xhc3Nba2V5XV0gPSBrZXk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XG4gICAgfSwge30pO1xufVxuLyoqXG4gKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGlzIGdpdmVuIGEgdGhlbWUgYW5kIGFuIG9wdGlvbmFsIHJlZ2lzdHJ5LCB0aGUgdGhlbWVcbiAqIGluamVjdG9yIGlzIGRlZmluZWQgYWdhaW5zdCB0aGUgcmVnaXN0cnksIHJldHVybmluZyB0aGUgdGhlbWUuXG4gKlxuICogQHBhcmFtIHRoZW1lIHRoZSB0aGVtZSB0byBzZXRcbiAqIEBwYXJhbSB0aGVtZVJlZ2lzdHJ5IHJlZ2lzdHJ5IHRvIGRlZmluZSB0aGUgdGhlbWUgaW5qZWN0b3IgYWdhaW5zdC4gRGVmYXVsdHNcbiAqIHRvIHRoZSBnbG9iYWwgcmVnaXN0cnlcbiAqXG4gKiBAcmV0dXJucyB0aGUgdGhlbWUgaW5qZWN0b3IgdXNlZCB0byBzZXQgdGhlIHRoZW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhlbWUsIHRoZW1lUmVnaXN0cnkpIHtcbiAgICBjb25zdCB0aGVtZUluamVjdG9yID0gbmV3IEluamVjdG9yKHRoZW1lKTtcbiAgICB0aGVtZVJlZ2lzdHJ5LmRlZmluZUluamVjdG9yKElOSkVDVEVEX1RIRU1FX0tFWSwgdGhlbWVJbmplY3Rvcik7XG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XG59XG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGNsYXNzIGRlY29yYXRlZCB3aXRoIHdpdGggVGhlbWVkIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluKEJhc2UpIHtcbiAgICBsZXQgVGhlbWVkID0gY2xhc3MgVGhlbWVkIGV4dGVuZHMgQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMgPSBbXTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuX3RoZW1lID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhlbWUoY2xhc3Nlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLm1hcCgoY2xhc3NOYW1lKSA9PiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRoZW1lQ2xhc3MoY2xhc3Nlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cbiAgICAgICAgICovXG4gICAgICAgIG9uUHJvcGVydGllc0NoYW5nZWQoKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNsYXNzTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xuICAgICAgICAgICAgbGV0IHJlc3VsdENsYXNzTmFtZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENsYXNzIG5hbWU6ICcke2NsYXNzTmFtZX0nIG5vdCBmb3VuZCBpbiB0aGVtZWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2goZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIF9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcygpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdGhlbWUgPSB7fSB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lID0gYmFzZVRoZW1lcy5yZWR1Y2UoKGZpbmFsQmFzZVRoZW1lLCBiYXNlVGhlbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX2EgPSBUSEVNRV9LRVksIGtleSA9IGJhc2VUaGVtZVtfYV0sIGNsYXNzZXMgPSB0c2xpYl8xLl9fcmVzdChiYXNlVGhlbWUsIFt0eXBlb2YgX2EgPT09IFwic3ltYm9sXCIgPyBfYSA6IF9hICsgXCJcIl0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoKGJhc2VUaGVtZSwgdGhlbWVLZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYmFzZVRoZW1lLCB0aGVtZVt0aGVtZUtleV0pO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGRpZmZQcm9wZXJ0eSgndGhlbWUnLCBzaGFsbG93KSxcbiAgICAgICAgZGlmZlByb3BlcnR5KCdleHRyYUNsYXNzZXMnLCBzaGFsbG93KSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcbiAgICBdLCBUaGVtZWQucHJvdG90eXBlLCBcIm9uUHJvcGVydGllc0NoYW5nZWRcIiwgbnVsbCk7XG4gICAgVGhlbWVkID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW5qZWN0KHtcbiAgICAgICAgICAgIG5hbWU6IElOSkVDVEVEX1RIRU1FX0tFWSxcbiAgICAgICAgICAgIGdldFByb3BlcnRpZXM6ICh0aGVtZSwgcHJvcGVydGllcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydGllcy50aGVtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB0aGVtZSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgXSwgVGhlbWVkKTtcbiAgICByZXR1cm4gVGhlbWVkO1xufVxuZXhwb3J0IGRlZmF1bHQgVGhlbWVkTWl4aW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UaGVtZWQubWpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQubWpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgUHJvamVjdG9yTWl4aW4gfSBmcm9tICcuL21peGlucy9Qcm9qZWN0b3InO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJ0Bkb2pvL3NoaW0vYXJyYXknO1xuaW1wb3J0IHsgdywgZG9tIH0gZnJvbSAnLi9kJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IHsgcmVnaXN0ZXJUaGVtZUluamVjdG9yIH0gZnJvbSAnLi9taXhpbnMvVGhlbWVkJztcbmV4cG9ydCB2YXIgQ3VzdG9tRWxlbWVudENoaWxkVHlwZTtcbihmdW5jdGlvbiAoQ3VzdG9tRWxlbWVudENoaWxkVHlwZSkge1xuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJET0pPXCJdID0gXCJET0pPXCI7XG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIk5PREVcIl0gPSBcIk5PREVcIjtcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiVEVYVFwiXSA9IFwiVEVYVFwiO1xufSkoQ3VzdG9tRWxlbWVudENoaWxkVHlwZSB8fCAoQ3VzdG9tRWxlbWVudENoaWxkVHlwZSA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGUpIHtcbiAgICByZXR1cm4gY2xhc3MgRG9tVG9XaWRnZXRXcmFwcGVyIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZSgocHJvcHMsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKCdvbicpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGBfXyR7a2V5fWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgICByZXR1cm4gZG9tKHsgbm9kZTogZG9tTm9kZSwgcHJvcHM6IHByb3BlcnRpZXMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGdldCBkb21Ob2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShkZXNjcmlwdG9yLCBXaWRnZXRDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnN0IHsgYXR0cmlidXRlcywgY2hpbGRUeXBlIH0gPSBkZXNjcmlwdG9yO1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hcCA9IHt9O1xuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCgocHJvcGVydHlOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYXR0cmlidXRlTWFwW2F0dHJpYnV0ZU5hbWVdID0gcHJvcGVydHlOYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50UHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbml0aWFsaXNlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRvbVByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHsgYXR0cmlidXRlcywgcHJvcGVydGllcywgZXZlbnRzIH0gPSBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlcykpO1xuICAgICAgICAgICAgWy4uLmF0dHJpYnV0ZXMsIC4uLnByb3BlcnRpZXNdLmZvckVhY2goKHByb3BlcnR5TmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfXycpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLl9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4gdGhpcy5fc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaCgocHJvcGVydHlOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfX29uJyk7XG4gICAgICAgICAgICAgICAgZG9tUHJvcGVydGllc1tmaWx0ZXJlZFByb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5fZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4gdGhpcy5fc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXZlbnRDYWxsYmFjayA9IHRoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudENhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbDogYXJnc1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgZG9tUHJvcGVydGllcyk7XG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGNoaWxkVHlwZSA9PT0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5URVhUID8gdGhpcy5jaGlsZE5vZGVzIDogdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgICAgIGZyb20oY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCAoKSA9PiB0aGlzLl9yZW5kZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsICgpID0+IHRoaXMuX3JlbmRlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChEb21Ub1dpZGdldFdyYXBwZXIoY2hpbGROb2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKGRvbSh7IG5vZGU6IGNoaWxkTm9kZSB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtY29ubmVjdGVkJywgKGUpID0+IHRoaXMuX2NoaWxkQ29ubmVjdGVkKGUpKTtcbiAgICAgICAgICAgIGNvbnN0IHdpZGdldFByb3BlcnRpZXMgPSB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgcmVuZGVyQ2hpbGRyZW4gPSAoKSA9PiB0aGlzLl9fY2hpbGRyZW5fXygpO1xuICAgICAgICAgICAgY29uc3QgV3JhcHBlciA9IGNsYXNzIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdyhXaWRnZXRDb25zdHJ1Y3Rvciwgd2lkZ2V0UHJvcGVydGllcywgcmVuZGVyQ2hpbGRyZW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG4gICAgICAgICAgICBjb25zdCB0aGVtZUNvbnRleHQgPSByZWdpc3RlclRoZW1lSW5qZWN0b3IodGhpcy5fZ2V0VGhlbWUoKSwgcmVnaXN0cnkpO1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tdGhlbWUtc2V0JywgKCkgPT4gdGhlbWVDb250ZXh0LnNldCh0aGlzLl9nZXRUaGVtZSgpKSk7XG4gICAgICAgICAgICBjb25zdCBQcm9qZWN0b3IgPSBQcm9qZWN0b3JNaXhpbihXcmFwcGVyKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5zZXRQcm9wZXJ0aWVzKHsgcmVnaXN0cnkgfSk7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3IuYXBwZW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1jb25uZWN0ZWQnLCB7XG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBfZ2V0VGhlbWUoKSB7XG4gICAgICAgICAgICBpZiAoZ2xvYmFsICYmIGdsb2JhbC5kb2pvY2UgJiYgZ2xvYmFsLmRvam9jZS50aGVtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWwuZG9qb2NlLnRoZW1lc1tnbG9iYWwuZG9qb2NlLnRoZW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfY2hpbGRDb25uZWN0ZWQoZSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGUuZGV0YWlsO1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMuX2NoaWxkcmVuLnNvbWUoKGNoaWxkKSA9PiBjaGlsZC5kb21Ob2RlID09PSBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgKCkgPT4gdGhpcy5fcmVuZGVyKCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKERvbVRvV2lkZ2V0V3JhcHBlcihub2RlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmVuZGVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3Rvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1yZW5kZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX19wcm9wZXJ0aWVzX18oKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICBfX2NoaWxkcmVuX18oKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKChDaGlsZCkgPT4gQ2hpbGQuZG9tTm9kZS5pc1dpZGdldCkubWFwKChDaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRvbU5vZGUgfSA9IENoaWxkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdyhDaGlsZCwgT2JqZWN0LmFzc2lnbih7fSwgZG9tTm9kZS5fX3Byb3BlcnRpZXNfXygpKSwgWy4uLmRvbU5vZGUuX19jaGlsZHJlbl9fKCldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVNYXBbbmFtZV07XG4gICAgICAgICAgICB0aGlzLl9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBfc2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIF9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIF9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgX2F0dHJpYnV0ZXNUb1Byb3BlcnRpZXMoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMucmVkdWNlKChwcm9wZXJ0aWVzLCBwcm9wZXJ0eU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZU1hcCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGlzV2lkZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKFdpZGdldENvbnN0cnVjdG9yKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvciA9IFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBXaWRnZXRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcjtcbiAgICBpZiAoIWRlc2NyaXB0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGRlc2NyaXB0b3IgZm9yIEN1c3RvbSBFbGVtZW50LCBoYXZlIHlvdSBhZGRlZCB0aGUgQGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yIHRvIHlvdXIgV2lkZ2V0PycpO1xuICAgIH1cbiAgICBnbG9iYWwuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGRlc2NyaXB0b3IudGFnTmFtZSwgY3JlYXRlKGRlc2NyaXB0b3IsIFdpZGdldENvbnN0cnVjdG9yKSk7XG59XG5leHBvcnQgZGVmYXVsdCByZWdpc3Rlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZ2lzdGVyQ3VzdG9tRWxlbWVudC5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50Lm1qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IHsgZnJvbSBhcyBhcnJheUZyb20gfSBmcm9tICdAZG9qby9zaGltL2FycmF5JztcbmltcG9ydCB7IGlzV05vZGUsIGlzVk5vZGUsIFZOT0RFLCBXTk9ERSB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciB9IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmNvbnN0IE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xuY29uc3QgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XG5jb25zdCBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XG5jb25zdCBlbXB0eUFycmF5ID0gW107XG5leHBvcnQgY29uc3Qgd2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgaW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmVuZGVyUXVldWVNYXAgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gc2FtZShkbm9kZTEsIGRub2RlMikge1xuICAgIGlmIChpc1ZOb2RlKGRub2RlMSkgJiYgaXNWTm9kZShkbm9kZTIpKSB7XG4gICAgICAgIGlmIChkbm9kZTEudGFnICE9PSBkbm9kZTIudGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzV05vZGUoZG5vZGUxKSAmJiBpc1dOb2RlKGRub2RlMikpIHtcbiAgICAgICAgaWYgKGRub2RlMS53aWRnZXRDb25zdHJ1Y3RvciAhPT0gZG5vZGUyLndpZGdldENvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmNvbnN0IG1pc3NpbmdUcmFuc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xufTtcbmZ1bmN0aW9uIGdldFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rvck9wdGlvbnMsIHByb2plY3Rvckluc3RhbmNlKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICBzdHlsZUFwcGx5ZXI6IGZ1bmN0aW9uIChkb21Ob2RlLCBzdHlsZU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBkb21Ob2RlLnN0eWxlW3N0eWxlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNpdGlvbnM6IHtcbiAgICAgICAgICAgIGVudGVyOiBtaXNzaW5nVHJhbnNpdGlvbixcbiAgICAgICAgICAgIGV4aXQ6IG1pc3NpbmdUcmFuc2l0aW9uXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzOiBbXSxcbiAgICAgICAgYWZ0ZXJSZW5kZXJDYWxsYmFja3M6IFtdLFxuICAgICAgICBub2RlTWFwOiBuZXcgV2Vha01hcCgpLFxuICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgbWVyZ2U6IGZhbHNlLFxuICAgICAgICByZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgcmVuZGVyUXVldWU6IFtdLFxuICAgICAgICBwcm9qZWN0b3JJbnN0YW5jZVxuICAgIH07XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBwcm9qZWN0b3JPcHRpb25zKTtcbn1cbmZ1bmN0aW9uIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudE5hbWUsIGN1cnJlbnRWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMsIGJpbmQsIHByZXZpb3VzVmFsdWUpIHtcbiAgICBjb25zdCBldmVudE1hcCA9IHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuZ2V0KGRvbU5vZGUpIHx8IG5ldyBXZWFrTWFwKCk7XG4gICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNFdmVudCA9IGV2ZW50TWFwLmdldChwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XG4gICAgfVxuICAgIGxldCBjYWxsYmFjayA9IGN1cnJlbnRWYWx1ZS5iaW5kKGJpbmQpO1xuICAgIGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBjdXJyZW50VmFsdWUuY2FsbCh0aGlzLCBldnQpO1xuICAgICAgICAgICAgZXZ0LnRhcmdldFsnb25pbnB1dC12YWx1ZSddID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfS5iaW5kKGJpbmQpO1xuICAgIH1cbiAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgZXZlbnRNYXAuc2V0KGN1cnJlbnRWYWx1ZSwgY2FsbGJhY2spO1xuICAgIHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcbn1cbmZ1bmN0aW9uIGFkZENsYXNzZXMoZG9tTm9kZSwgY2xhc3Nlcykge1xuICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XG4gICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cywgY3VycmVudCkge1xuICAgIGNvbnN0IHsgZGlmZlR5cGUsIHByb3BlcnRpZXMsIGF0dHJpYnV0ZXMgfSA9IGN1cnJlbnQ7XG4gICAgaWYgKCFkaWZmVHlwZSB8fCBkaWZmVHlwZSA9PT0gJ3Zkb20nKSB7XG4gICAgICAgIHJldHVybiB7IHByb3BlcnRpZXM6IHByZXZpb3VzLnByb3BlcnRpZXMsIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGRpZmZUeXBlID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuIHsgcHJvcGVydGllczoge30sIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMgPyB7fSA6IHVuZGVmaW5lZCwgZXZlbnRzOiBwcmV2aW91cy5ldmVudHMgfTtcbiAgICB9XG4gICAgbGV0IG5ld1Byb3BlcnRpZXMgPSB7XG4gICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgfTtcbiAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICBuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgbmV3UHJvcGVydGllcy5ldmVudHMgPSBwcmV2aW91cy5ldmVudHM7XG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXNbcHJvcE5hbWVdID0gZG9tTm9kZVtwcm9wTmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKChhdHRyTmFtZSkgPT4ge1xuICAgICAgICAgICAgbmV3UHJvcGVydGllcy5hdHRyaWJ1dGVzW2F0dHJOYW1lXSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXdQcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5yZWR1Y2UoKHByb3BzLCBwcm9wZXJ0eSkgPT4ge1xuICAgICAgICBwcm9wc1twcm9wZXJ0eV0gPSBkb21Ob2RlLmdldEF0dHJpYnV0ZShwcm9wZXJ0eSkgfHwgZG9tTm9kZVtwcm9wZXJ0eV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIG5ld1Byb3BlcnRpZXM7XG59XG5mdW5jdGlvbiBmb2N1c05vZGUocHJvcFZhbHVlLCBwcmV2aW91c1ZhbHVlLCBkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVzdWx0ID0gcHJvcFZhbHVlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUgJiYgIXByZXZpb3VzVmFsdWU7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBkb21Ob2RlLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIG9ubHlFdmVudHMgPSBmYWxzZSkge1xuICAgIGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSk7XG4gICAgaWYgKGV2ZW50TWFwKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzRXZlbnQgPSBwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgfHwgb25seUV2ZW50cztcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IG9ubHlFdmVudHMgPyBwcm9wTmFtZSA6IHByb3BOYW1lLnN1YnN0cigyKTtcbiAgICAgICAgICAgIGlmIChpc0V2ZW50ICYmICFwcm9wZXJ0aWVzW3Byb3BOYW1lXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIGF0dHJOYW1lID09PSAnaHJlZicpIHtcbiAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIGlmICgoYXR0ck5hbWUgPT09ICdyb2xlJyAmJiBhdHRyVmFsdWUgPT09ICcnKSB8fCBhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHByZXZpb3VzQXR0cmlidXRlcywgYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBhdHRyTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBhdHRyQ291bnQgPSBhdHRyTmFtZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyTmFtZXNbaV07XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xuICAgICAgICBjb25zdCBwcmV2aW91c0F0dHJWYWx1ZSA9IHByZXZpb3VzQXR0cmlidXRlc1thdHRyTmFtZV07XG4gICAgICAgIGlmIChhdHRyVmFsdWUgIT09IHByZXZpb3VzQXR0clZhbHVlKSB7XG4gICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPSB0cnVlKSB7XG4gICAgbGV0IHByb3BlcnRpZXNVcGRhdGVkID0gZmFsc2U7XG4gICAgY29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG4gICAgY29uc3QgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcbiAgICBpZiAocHJvcE5hbWVzLmluZGV4T2YoJ2NsYXNzZXMnKSA9PT0gLTEgJiYgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgJiYgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcbiAgICAgICAgbGV0IHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xuICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BWYWx1ZSB8fCBwcm9wVmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NsYXNzZXMgPSBbLi4uY3VycmVudENsYXNzZXNdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGFzc0luZGV4ID0gbmV3Q2xhc3Nlcy5pbmRleE9mKHByZXZpb3VzQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDbGFzc2VzLnNwbGljZShjbGFzc0luZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIG5ld0NsYXNzZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcbiAgICAgICAgICAgIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRTdHlsZVZhbHVlID0gcHJldmlvdXNWYWx1ZSAmJiBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsIG5ld1N0eWxlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZG9tVmFsdWUgPSBkb21Ob2RlW3Byb3BOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tVmFsdWUgIT09IHByb3BWYWx1ZSAmJlxuICAgICAgICAgICAgICAgICAgICAoZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIDogcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSAhPT0gJ2tleScgJiYgcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicgJiYgcHJvcE5hbWUubGFzdEluZGV4T2YoJ29uJywgMCkgPT09IDAgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIHByb3BOYW1lLnN1YnN0cigyKSwgcHJvcFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJvcGVydGllcy5iaW5kLCBwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3Njcm9sbExlZnQnIHx8IHByb3BOYW1lID09PSAnc2Nyb2xsVG9wJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tTm9kZVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BlcnRpZXNVcGRhdGVkO1xufVxuZnVuY3Rpb24gZmluZEluZGV4T2ZDaGlsZChjaGlsZHJlbiwgc2FtZUFzLCBzdGFydCkge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFnOiAnJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgICAgIGRvbU5vZGUsXG4gICAgICAgIHR5cGU6IFZOT0RFXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1RleHRWTm9kZShkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFnOiAnJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgICAgIHRleHQ6IGAke2RhdGF9YCxcbiAgICAgICAgZG9tTm9kZTogdW5kZWZpbmVkLFxuICAgICAgICB0eXBlOiBWTk9ERVxuICAgIH07XG59XG5mdW5jdGlvbiB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbmNlLFxuICAgICAgICByZW5kZXJlZDogW10sXG4gICAgICAgIGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXG4gICAgICAgIGNoaWxkcmVuOiBpbnN0YW5jZS5jaGlsZHJlbixcbiAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3I6IGluc3RhbmNlLmNvbnN0cnVjdG9yLFxuICAgICAgICBwcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzLFxuICAgICAgICB0eXBlOiBXTk9ERVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZHJlbiwgaW5zdGFuY2UpIHtcbiAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZW1wdHlBcnJheTtcbiAgICB9XG4gICAgY2hpbGRyZW4gPSBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDspIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGNoaWxkID09PSB1bmRlZmluZWQgfHwgY2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzVk5vZGUoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3BlcnRpZXMuYmluZCA9IGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZC5jb3JlUHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IGluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gY2hpbGRyZW47XG59XG5mdW5jdGlvbiBub2RlQWRkZWQoZG5vZGUsIHRyYW5zaXRpb25zKSB7XG4gICAgaWYgKGlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcbiAgICAgICAgY29uc3QgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xuICAgICAgICBpZiAoZW50ZXJBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW50ZXJBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmVudGVyKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbGxPbkRldGFjaChkTm9kZXMsIHBhcmVudEluc3RhbmNlKSB7XG4gICAgZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZE5vZGUgPSBkTm9kZXNbaV07XG4gICAgICAgIGlmIChpc1dOb2RlKGROb2RlKSkge1xuICAgICAgICAgICAgaWYgKGROb2RlLnJlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZE5vZGUuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBub2RlVG9SZW1vdmUoZG5vZGUsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIGlmIChpc1dOb2RlKGRub2RlKSkge1xuICAgICAgICBjb25zdCByZW5kZXJlZCA9IGRub2RlLnJlbmRlcmVkIHx8IGVtcHR5QXJyYXk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcmVuZGVyZWRbaV07XG4gICAgICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQuZG9tTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gZG5vZGUucHJvcGVydGllcztcbiAgICAgICAgY29uc3QgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkb21Ob2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleGl0QW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgZXhpdEFuaW1hdGlvbihkb21Ob2RlLCByZW1vdmVEb21Ob2RlLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24sIHJlbW92ZURvbU5vZGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkb21Ob2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2hlY2tEaXN0aW5ndWlzaGFibGUoY2hpbGROb2RlcywgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSkge1xuICAgIGNvbnN0IGNoaWxkTm9kZSA9IGNoaWxkTm9kZXNbaW5kZXhUb0NoZWNrXTtcbiAgICBpZiAoaXNWTm9kZShjaGlsZE5vZGUpICYmICFjaGlsZE5vZGUudGFnKSB7XG4gICAgICAgIHJldHVybjsgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcbiAgICB9XG4gICAgY29uc3QgeyBrZXkgfSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xuICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXhUb0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHNhbWUobm9kZSwgY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkZW50aWZpZXI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudE5hbWUgPSBwYXJlbnRJbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzV05vZGUoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUud2lkZ2V0Q29uc3RydWN0b3IubmFtZSB8fCAndW5rbm93bic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS50YWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBBIHdpZGdldCAoJHtwYXJlbnROYW1lfSkgaGFzIGhhZCBhIGNoaWxkIGFkZGRlZCBvciByZW1vdmVkLCBidXQgdGhleSB3ZXJlIG5vdCBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZpZWQuIEl0IGlzIHJlY29tbWVuZGVkIHRvIHByb3ZpZGUgYSB1bmlxdWUgJ2tleScgcHJvcGVydHkgd2hlbiB1c2luZyB0aGUgc2FtZSB3aWRnZXQgb3IgZWxlbWVudCAoJHtub2RlSWRlbnRpZmllcn0pIG11bHRpcGxlIHRpbWVzIGFzIHNpYmxpbmdzYCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBvbGRDaGlsZHJlbiwgbmV3Q2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIG9sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcbiAgICBuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuICAgIGNvbnN0IG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xuICAgIGNvbnN0IG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xuICAgIGNvbnN0IHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnM7XG4gICAgcHJvamVjdGlvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH0pO1xuICAgIGxldCBvbGRJbmRleCA9IDA7XG4gICAgbGV0IG5ld0luZGV4ID0gMDtcbiAgICBsZXQgaTtcbiAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcbiAgICB3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xuICAgICAgICBjb25zdCBvbGRDaGlsZCA9IG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5bbmV3SW5kZXhdO1xuICAgICAgICBpZiAoaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBuZXdDaGlsZC5pbnNlcnRlZCA9IGlzVk5vZGUob2xkQ2hpbGQpICYmIG9sZENoaWxkLmluc2VydGVkO1xuICAgICAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XG4gICAgICAgICAgICB0ZXh0VXBkYXRlZCA9IHVwZGF0ZURvbShvbGRDaGlsZCwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHx8IHRleHRVcGRhdGVkO1xuICAgICAgICAgICAgb2xkSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xuICAgICAgICAgICAgaWYgKGZpbmRPbGRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBmaW5kT2xkSW5kZXg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleFRvQ2hlY2sgPSBpO1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZCA9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZURvbShvbGRDaGlsZHJlbltmaW5kT2xkSW5kZXhdLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkO1xuICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gZmluZE9sZEluZGV4ICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gb2xkSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1dOb2RlKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5yZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkLnJlbmRlcmVkWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gb2xkQ2hpbGRyZW5bbmV4dEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUgPSBjaGlsZC5kb21Ob2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNyZWF0ZURvbShuZXdDaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleFRvQ2hlY2sgPSBuZXdJbmRleDtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5ld0luZGV4Kys7XG4gICAgfVxuICAgIGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XG4gICAgICAgIC8vIFJlbW92ZSBjaGlsZCBmcmFnbWVudHNcbiAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY29uc3QgaW5kZXhUb0NoZWNrID0gaTtcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcbn1cbmZ1bmN0aW9uIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBjaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQsIGNoaWxkTm9kZXMpIHtcbiAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2hpbGROb2RlcyA9IGFycmF5RnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlLmNoaWxkTm9kZXMpO1xuICAgIH1cbiAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkpIHtcbiAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvbUVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tRWxlbWVudCA9IGNoaWxkTm9kZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjcmVhdGVEb20oY2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICBhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcbiAgICBpZiAodHlwZW9mIGRub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nICYmIGRub2RlLmluc2VydGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xuICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHt9LCBkbm9kZS5hdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHt9LCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZXZlbnRzID0gZG5vZGUuZXZlbnRzO1xuICAgICAgICBPYmplY3Qua2V5cyhldmVudHMpLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudCwgZXZlbnRzW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCB7fSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkKGRvbU5vZGUsIGAke2Rub2RlLnByb3BlcnRpZXMua2V5fWApO1xuICAgIH1cbiAgICBkbm9kZS5pbnNlcnRlZCA9IHRydWU7XG59XG5mdW5jdGlvbiBjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgY2hpbGROb2Rlcykge1xuICAgIGxldCBkb21Ob2RlO1xuICAgIGlmIChpc1dOb2RlKGRub2RlKSkge1xuICAgICAgICBsZXQgeyB3aWRnZXRDb25zdHJ1Y3RvciB9ID0gZG5vZGU7XG4gICAgICAgIGNvbnN0IHBhcmVudEluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XG4gICAgICAgIGlmICghaXNXaWRnZXRCYXNlQ29uc3RydWN0b3Iod2lkZ2V0Q29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gcGFyZW50SW5zdGFuY2VEYXRhLnJlZ2lzdHJ5KCkuZ2V0KHdpZGdldENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2lkZ2V0Q29uc3RydWN0b3IgPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IHdpZGdldENvbnN0cnVjdG9yKCk7XG4gICAgICAgIGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XG4gICAgICAgIGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICByZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2UsIGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCB9KTtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICBpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xuICAgICAgICBpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICBpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcbiAgICAgICAgaWYgKHJlbmRlcmVkKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJlZFJlbmRlcmVkO1xuICAgICAgICAgICAgYWRkQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIGZpbHRlcmVkUmVuZGVyZWQsIHByb2plY3Rpb25PcHRpb25zLCBpbnN0YW5jZSwgaW5zZXJ0QmVmb3JlLCBjaGlsZE5vZGVzKTtcbiAgICAgICAgfVxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGUsIHBhcmVudFZOb2RlIH0pO1xuICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQ7XG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvYyA9IHBhcmVudFZOb2RlLmRvbU5vZGUub3duZXJEb2N1bWVudDtcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoZG5vZGUuZG9tTm9kZSAhPT0gdW5kZWZpbmVkICYmIHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEb21Ob2RlID0gZG5vZGUuZG9tTm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWTm9kZS5kb21Ob2RlID09PSBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG5vZGUuZG9tTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKG5ld0RvbU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUgJiYgZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRub2RlLmRvbU5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG5vZGUuZG9tTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlIHx8IGRvYy5jcmVhdGVFbGVtZW50KGRub2RlLnRhZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSAhPT0gcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVEb20ocHJldmlvdXMsIGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB7XG4gICAgaWYgKGlzV05vZGUoZG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IHsgaW5zdGFuY2UgfSA9IHByZXZpb3VzO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlOiBub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNSZW5kZXJlZCA9IG5vZGUgPyBub2RlLnJlbmRlcmVkIDogcHJldmlvdXMucmVuZGVyZWQ7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IHRydWU7XG4gICAgICAgICAgICBpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgaW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIGluc3RhbmNlLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XG4gICAgICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIHByZXZpb3VzUmVuZGVyZWQsIGRub2RlLnJlbmRlcmVkLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNyZWF0ZURvbShkbm9kZSwgcGFyZW50Vk5vZGUsIHVuZGVmaW5lZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSBkbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRvbU5vZGUgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xuICAgICAgICBsZXQgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoZG5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RvbU5vZGUgPSBkb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XG4gICAgICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkb21Ob2RlKTtcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcbiAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHRVcGRhdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGRub2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgZG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQcm9wZXJ0aWVzID0gYnVpbGRQcmV2aW91c1Byb3BlcnRpZXMoZG9tTm9kZSwgcHJldmlvdXMsIGRub2RlKTtcbiAgICAgICAgICAgIGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUF0dHJpYnV0ZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMsIGRub2RlLmF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMucHJvcGVydGllcywgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIGZhbHNlKSB8fCB1cGRhdGVkO1xuICAgICAgICAgICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5ldmVudHMsIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50cyA9IGRub2RlLmV2ZW50cztcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhldmVudHMpLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIGV2ZW50LCBldmVudHNbZXZlbnRdLCBwcm9qZWN0aW9uT3B0aW9ucywgZG5vZGUucHJvcGVydGllcy5iaW5kLCBwcmV2aW91c1Byb3BlcnRpZXMuZXZlbnRzW2V2ZW50XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMucHJvcGVydGllcywgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZSwgYCR7ZG5vZGUucHJvcGVydGllcy5rZXl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWQgJiYgZG5vZGUucHJvcGVydGllcyAmJiBkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcywgcHJldmlvdXMucHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBhZGREZWZlcnJlZFByb3BlcnRpZXModm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgLy8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xuICAgIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyA9IHZub2RlLnByb3BlcnRpZXM7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpO1xuICAgIHZub2RlLnByb3BlcnRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wZXJ0aWVzLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xuICAgIHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2soISF2bm9kZS5pbnNlcnRlZCksIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXModm5vZGUuZG9tTm9kZSwgdm5vZGUucHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG4gICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xuICAgICAgICAgICAgZ2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG4gICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgcHJvamVjdGlvbk9wdGlvbnMucmVuZGVyU2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcbiAgICBjb25zdCByZW5kZXJzID0gWy4uLnJlbmRlclF1ZXVlXTtcbiAgICByZW5kZXJRdWV1ZU1hcC5zZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UsIFtdKTtcbiAgICByZW5kZXJzLnNvcnQoKGEsIGIpID0+IGEuZGVwdGggLSBiLmRlcHRoKTtcbiAgICB3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgeyBpbnN0YW5jZSB9ID0gcmVuZGVycy5zaGlmdCgpO1xuICAgICAgICBjb25zdCB7IHBhcmVudFZOb2RlLCBkbm9kZSB9ID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcbiAgICAgICAgdXBkYXRlRG9tKGRub2RlLCB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSksIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xufVxuZXhwb3J0IGNvbnN0IGRvbSA9IHtcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICBjb25zdCBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UpO1xuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xuICAgICAgICBjb25zdCBwYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGUoZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKTtcbiAgICAgICAgY29uc3QgcmVuZGVyUXVldWUgPSBbXTtcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZSB9KTtcbiAgICAgICAgcmVuZGVyUXVldWVNYXAuc2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgcmVuZGVyUXVldWUpO1xuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZSwgZGVwdGg6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5kZXB0aCB9KTtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB1cGRhdGVEb20obm9kZSwgbm9kZSwgZmluYWxQcm9qZWN0b3JPcHRpb25zLCBwYXJlbnRWTm9kZSwgaW5zdGFuY2UpO1xuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBpbnN0YW5jZURhdGEub25BdHRhY2goKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG4gICAgICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb21Ob2RlOiBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24gKGVsZW1lbnQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlID0gdHJ1ZTtcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmRvbS5tanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5tanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3Zkb20ubWpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWVudS1pdGVtIiwiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xudmFyIHdpZGdldEZhY3RvcnkgPSByZXF1aXJlKFwic3JjL21lbnUtaXRlbS9NZW51SXRlbVwiKTtcblxudmFyIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudCA9IHJlcXVpcmUoJ0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudCcpLmRlZmF1bHQ7XG5cbnZhciBkZWZhdWx0RXhwb3J0ID0gd2lkZ2V0RmFjdG9yeS5kZWZhdWx0O1xuZGVmYXVsdEV4cG9ydCAmJiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVmYXVsdEV4cG9ydCk7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUtaXRlbS9NZW51SXRlbSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51LWl0ZW0vTWVudUl0ZW0hLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSIsImltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCB7IGN1c3RvbUVsZW1lbnQgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQnO1xuaW1wb3J0IHsgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5cbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuL21lbnVJdGVtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVByb3BlcnRpZXMgZXh0ZW5kcyBXaWRnZXRQcm9wZXJ0aWVzIHtcblx0dGl0bGU6IHN0cmluZztcblx0c2VsZWN0ZWQ/OiBib29sZWFuO1xuXHRkYXRhPzogYW55O1xuXHRvblNlbGVjdGVkPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuQGN1c3RvbUVsZW1lbnQ8TWVudUl0ZW1Qcm9wZXJ0aWVzPih7XG5cdHRhZzogJ2RlbW8tbWVudS1pdGVtJyxcblx0YXR0cmlidXRlczogWyd0aXRsZScsICdzZWxlY3RlZCddLFxuXHRldmVudHM6IFsnb25TZWxlY3RlZCddLFxuXHRwcm9wZXJ0aWVzOiBbJ2RhdGEnLCAnc2VsZWN0ZWQnXVxufSlcbkB0aGVtZShjc3MpXG5leHBvcnQgY2xhc3MgTWVudUl0ZW0gZXh0ZW5kcyBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTxNZW51SXRlbVByb3BlcnRpZXM+IHtcblx0cHJpdmF0ZSBfb25DbGljaygpIHtcblx0XHR0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCAmJiB0aGlzLnByb3BlcnRpZXMub25TZWxlY3RlZCh0aGlzLnByb3BlcnRpZXMuZGF0YSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgdGl0bGUsIHNlbGVjdGVkIH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignbGknLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcblx0XHRcdHYoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoW2Nzcy5pdGVtLCBzZWxlY3RlZCA/IGNzcy5zZWxlY3RlZCA6IG51bGxdKSxcblx0XHRcdFx0XHRvbmNsaWNrOiB0aGlzLl9vbkNsaWNrXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFt0aXRsZV1cblx0XHRcdClcblx0XHRdKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51SXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfbWVudS1pdGVtIS4vc3JjL21lbnUtaXRlbS9NZW51SXRlbS50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJ0ZXN0LWFwcC9tZW51SXRlbVwiLFwicm9vdFwiOlwic1VtVWk0U2hcIixcIml0ZW1cIjpcIl8yTWs2UmRxYVwiLFwic2VsZWN0ZWRcIjpcIl8xLWYzSXRPaFwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZW51LWl0ZW0vbWVudUl0ZW0ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL21lbnUtaXRlbS9tZW51SXRlbS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1lbnUtaXRlbSJdLCJzb3VyY2VSb290IjoiIn0=