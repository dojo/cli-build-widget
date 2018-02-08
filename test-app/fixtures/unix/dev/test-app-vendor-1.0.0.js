/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["dojoWebpackJsonptest_app_custom_elements"];
/******/ 	window["dojoWebpackJsonptest_app_custom_elements"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		"vendor": 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + ({"src/menu-item/MenuItem":"src/menu-item/MenuItem","src/menu/Menu":"src/menu/Menu"}[chunkId]||chunkId) + "-1.0.0.bundle.js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
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

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu-item/MenuItem!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu-item/MenuItem.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js").default;

var defaultExport = widgetFactory.default;
var descriptor;

if (defaultExport) {
	if (defaultExport.prototype && defaultExport.prototype.__customElementDescriptor) {
		descriptor = function() { return defaultExport.prototype.__customElementDescriptor };
	}
}

descriptor && registerCustomElement(descriptor);



/***/ }),

/***/ "./node_modules/imports-loader/index.js?widgetFactory=src/menu/Menu!./node_modules/@dojo/cli-build-widget/template/custom-element.js":
/***/ (function(module, exports, __webpack_require__) {

/*** IMPORTS FROM imports-loader ***/
var widgetFactory = __webpack_require__("./src/menu/Menu.ts");

var registerCustomElement = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js").default;

var defaultExport = widgetFactory.default;
var descriptor;

if (defaultExport) {
	if (defaultExport.prototype && defaultExport.prototype.__customElementDescriptor) {
		descriptor = function() { return defaultExport.prototype.__customElementDescriptor };
	}
}

descriptor && registerCustomElement(descriptor);



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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGRkOGFjYmRmOTUzMzJlNTU3MDEiLCJ3ZWJwYWNrOi8vL0Rlc3Ryb3lhYmxlLnRzIiwid2VicGFjazovLy9FdmVudGVkLnRzIiwid2VicGFjazovLy9hc3BlY3QudHMiLCJ3ZWJwYWNrOi8vL2xhbmcudHMiLCJ3ZWJwYWNrOi8vL2hhcy50cyIsIndlYnBhY2s6Ly8vTWFwLnRzIiwid2VicGFjazovLy9Qcm9taXNlLnRzIiwid2VicGFjazovLy9TeW1ib2wudHMiLCJ3ZWJwYWNrOi8vL1dlYWtNYXAudHMiLCJ3ZWJwYWNrOi8vL2FycmF5LnRzIiwid2VicGFjazovLy9nbG9iYWwudHMiLCJ3ZWJwYWNrOi8vL2l0ZXJhdG9yLnRzIiwid2VicGFjazovLy9udW1iZXIudHMiLCJ3ZWJwYWNrOi8vL29iamVjdC50cyIsIndlYnBhY2s6Ly8vc3RyaW5nLnRzIiwid2VicGFjazovLy9xdWV1ZS50cyIsIndlYnBhY2s6Ly8vdXRpbC50cyIsIndlYnBhY2s6Ly8vSW5qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL05vZGVIYW5kbGVyLnRzIiwid2VicGFjazovLy9SZWdpc3RyeS50cyIsIndlYnBhY2s6Ly8vUmVnaXN0cnlIYW5kbGVyLnRzIiwid2VicGFjazovLy9XaWRnZXRCYXNlLnRzIiwid2VicGFjazovLy9jc3NUcmFuc2l0aW9ucy50cyIsIndlYnBhY2s6Ly8vY3VzdG9tRWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vL2QudHMiLCJ3ZWJwYWNrOi8vL2FmdGVyUmVuZGVyLnRzIiwid2VicGFjazovLy9iZWZvcmVQcm9wZXJ0aWVzLnRzIiwid2VicGFjazovLy9jdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9kaWZmUHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vL2hhbmRsZURlY29yYXRvci50cyIsIndlYnBhY2s6Ly8vaW5qZWN0LnRzIiwid2VicGFjazovLy9kaWZmLnRzIiwid2VicGFjazovLy9Qcm9qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL1RoZW1lZC50cyIsIndlYnBhY2s6Ly8vcmVnaXN0ZXJDdXN0b21FbGVtZW50LnRzIiwid2VicGFjazovLy9Eb21XcmFwcGVyLnRzIiwid2VicGFjazovLy92ZG9tLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qcz81OWNjIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZXBqcy9kaXN0L3BlcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxv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QkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkIseUJBQXlCLEVBQUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsYUFBYTtBQUN2RCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qyx1QkFBdUI7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdDQUF3QztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3Q0FBd0M7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdDQUF3QztBQUNuRTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSx5Q0FBeUMsd0JBQXdCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUMsRzs7Ozs7OztBQ2g4Q0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7QUN2THRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBDQUEwQyxzQkFBc0IsRUFBRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7O0FDekxEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDOztBQUVBO0FBQ0EsbUJBQW1CLDJCQUEyQjs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTs7QUFFQSxRQUFRLHVCQUF1QjtBQUMvQjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkLGtEQUFrRCxzQkFBc0I7QUFDeEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDNVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxXQUFXLEVBQUU7QUFDckQsd0NBQXdDLFdBQVcsRUFBRTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQ0FBc0M7QUFDdEMsR0FBRztBQUNIO0FBQ0EsOERB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Rjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLDRDQUE0QyxTQUFTLEVBQUUscURBQXFELGFBQWEsRUFBRTtBQUM1SSx5QkFBeUIsZ0NBQWdDLG9CQUFvQixnREFBZ0QsZ0JBQWdCLEdBQUc7QUFDaEo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyx1Q0FBdUMsYUFBYSxFQUFFLEVBQUUsT0FBTyxrQkFBa0I7QUFDakg7QUFDQTs7Ozs7Ozs7QUNyS0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMiLCJmaWxlIjoidGVzdC1hcHAtdmVuZG9yLTEuMC4wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcImRvam9XZWJwYWNrSnNvbnB0ZXN0X2FwcF9jdXN0b21fZWxlbWVudHNcIl07XG4gXHR3aW5kb3dbXCJkb2pvV2VicGFja0pzb25wdGVzdF9hcHBfY3VzdG9tX2VsZW1lbnRzXCJdID0gZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBleGVjdXRlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIHJlc29sdmVzID0gW10sIHJlc3VsdDtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcywgZXhlY3V0ZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdH1cbiBcdFx0aWYoZXhlY3V0ZU1vZHVsZXMpIHtcbiBcdFx0XHRmb3IoaT0wOyBpIDwgZXhlY3V0ZU1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZXhlY3V0ZU1vZHVsZXNbaV0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0cyB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcInZlbmRvclwiOiAwXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cbiBcdC8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbiBcdC8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5lID0gZnVuY3Rpb24gcmVxdWlyZUVuc3VyZShjaHVua0lkKSB7XG4gXHRcdHZhciBpbnN0YWxsZWRDaHVua0RhdGEgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSA9PT0gMCkge1xuIFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7IHJlc29sdmUoKTsgfSk7XG4gXHRcdH1cblxuIFx0XHQvLyBhIFByb21pc2UgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEpIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkQ2h1bmtEYXRhWzJdO1xuIFx0XHR9XG5cbiBcdFx0Ly8gc2V0dXAgUHJvbWlzZSBpbiBjaHVuayBjYWNoZVxuIFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rRGF0YSA9IGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IFtyZXNvbHZlLCByZWplY3RdO1xuIFx0XHR9KTtcbiBcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhWzJdID0gcHJvbWlzZTtcblxuIFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuIFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdHNjcmlwdC50aW1lb3V0ID0gMTIwMDAwO1xuXG4gXHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm5jKSB7XG4gXHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIF9fd2VicGFja19yZXF1aXJlX18ubmMpO1xuIFx0XHR9XG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgKHtcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIjpcInNyYy9tZW51LWl0ZW0vTWVudUl0ZW1cIixcInNyYy9tZW51L01lbnVcIjpcInNyYy9tZW51L01lbnVcIn1bY2h1bmtJZF18fGNodW5rSWQpICsgXCItMS4wLjAuYnVuZGxlLmpzXCI7XG4gXHRcdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLCAxMjAwMDApO1xuIFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBvblNjcmlwdENvbXBsZXRlO1xuIFx0XHRmdW5jdGlvbiBvblNjcmlwdENvbXBsZXRlKCkge1xuIFx0XHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cbiBcdFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuIFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiBcdFx0XHR2YXIgY2h1bmsgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHRcdFx0aWYoY2h1bmsgIT09IDApIHtcbiBcdFx0XHRcdGlmKGNodW5rKSB7XG4gXHRcdFx0XHRcdGNodW5rWzFdKG5ldyBFcnJvcignTG9hZGluZyBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLicpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IHVuZGVmaW5lZDtcbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuIFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIG9uIGVycm9yIGZ1bmN0aW9uIGZvciBhc3luYyBsb2FkaW5nXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm9lID0gZnVuY3Rpb24oZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyKTsgdGhyb3cgZXJyOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRkZDhhY2JkZjk1MzMyZTU1NzAxIiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9jb3JlJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ0Bkb2pvL3NoaW0vUHJvbWlzZSc7XG5cbi8qKlxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xufTtcblxuLyoqXG4gKiBObyBvcCBmdW5jdGlvbiB1c2VkIHRvIHJlcGxhY2Ugb3duLCBvbmNlIGluc3RhbmNlIGhhcyBiZWVuIGRlc3RvcnllZFxuICovXG5mdW5jdGlvbiBkZXN0cm95ZWQoKTogbmV2ZXIge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ0NhbGwgbWFkZSB0byBkZXN0cm95ZWQgbWV0aG9kJyk7XG59O1xuXG5leHBvcnQgY2xhc3MgRGVzdHJveWFibGUge1xuXHQvKipcblx0ICogcmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlXG5cdCAqL1xuXHRwcml2YXRlIGhhbmRsZXM6IEhhbmRsZVtdO1xuXG5cdC8qKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuaGFuZGxlcyA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGhhbmRsZXMgZm9yIHRoZSBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gYHRoaXMuZGVzdHJveWAgaXMgY2FsbGVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7SGFuZGxlfSBoYW5kbGUgVGhlIGhhbmRsZSB0byBhZGQgZm9yIHRoZSBpbnN0YW5jZVxuXHQgKiBAcmV0dXJucyB7SGFuZGxlfSBhIGhhbmRsZSBmb3IgdGhlIGhhbmRsZSwgcmVtb3ZlcyB0aGUgaGFuZGxlIGZvciB0aGUgaW5zdGFuY2UgYW5kIGNhbGxzIGRlc3Ryb3lcblx0ICovXG5cdG93bihoYW5kbGU6IEhhbmRsZSk6IEhhbmRsZSB7XG5cdFx0Y29uc3QgeyBoYW5kbGVzIH0gPSB0aGlzO1xuXHRcdGhhbmRsZXMucHVzaChoYW5kbGUpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZXN0cm95KCkge1xuXHRcdFx0XHRoYW5kbGVzLnNwbGljZShoYW5kbGVzLmluZGV4T2YoaGFuZGxlKSk7XG5cdFx0XHRcdGhhbmRsZS5kZXN0cm95KCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cnB5cyBhbGwgaGFuZGVycyByZWdpc3RlcmVkIGZvciB0aGUgaW5zdGFuY2Vcblx0ICpcblx0ICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcblx0ICovXG5cdGRlc3Ryb3koKTogUHJvbWlzZTxhbnk+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdHRoaXMuaGFuZGxlcy5mb3JFYWNoKChoYW5kbGUpID0+IHtcblx0XHRcdFx0aGFuZGxlICYmIGhhbmRsZS5kZXN0cm95ICYmIGhhbmRsZS5kZXN0cm95KCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZGVzdHJveSA9IG5vb3A7XG5cdFx0XHR0aGlzLm93biA9IGRlc3Ryb3llZDtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVzdHJveWFibGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRGVzdHJveWFibGUudHMiLCJpbXBvcnQgeyBBY3Rpb25hYmxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9hYmlsaXRpZXMnO1xuaW1wb3J0IHsgRXZlbnRlZExpc3RlbmVyLCBFdmVudGVkTGlzdGVuZXJPckFycmF5LCBFdmVudGVkTGlzdGVuZXJzTWFwIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9iYXNlcyc7XG5pbXBvcnQgeyBFdmVudFRhcmdldHRlZE9iamVjdCwgRXZlbnRFcnJvck9iamVjdCwgSGFuZGxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9jb3JlJztcbmltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IHsgb24gYXMgYXNwZWN0T24gfSBmcm9tICcuL2FzcGVjdCc7XG5pbXBvcnQgeyBEZXN0cm95YWJsZSB9IGZyb20gJy4vRGVzdHJveWFibGUnO1xuXG4vKipcbiAqIERldGVybWluZXMgaXMgdGhlIHZhbHVlIGlzIEFjdGlvbmFibGUgKGhhcyBhIGAuZG9gIGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpcyB0aGUgdmFsdWUgaXMgQWN0aW9uYWJsZVxuICovXG5mdW5jdGlvbiBpc0FjdGlvbmFibGUodmFsdWU6IGFueSk6IHZhbHVlIGlzIEFjdGlvbmFibGU8YW55LCBhbnk+IHtcblx0cmV0dXJuIEJvb2xlYW4odmFsdWUgJiYgdHlwZW9mIHZhbHVlLmRvID09PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGxpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZUxpc3RlbmVyPFQsIEUgZXh0ZW5kcyBFdmVudFRhcmdldHRlZE9iamVjdDxUPj4obGlzdGVuZXI6IEV2ZW50ZWRMaXN0ZW5lcjxULCBFPik6IEV2ZW50ZWRDYWxsYmFjazxFPiB7XG5cdHJldHVybiBpc0FjdGlvbmFibGUobGlzdGVuZXIpID8gKGV2ZW50OiBFKSA9PiBsaXN0ZW5lci5kbyh7IGV2ZW50IH0pIDogbGlzdGVuZXI7XG59XG5cbi8qKlxuICogSGFuZGxlcyBhbiBhcnJheSBvZiBoYW5kbGVzXG4gKlxuICogQHBhcmFtIGhhbmRsZXMgYW4gYXJyYXkgb2YgaGFuZGxlc1xuICogQHJldHVybnMgYSBzaW5nbGUgSGFuZGxlIGZvciBoYW5kbGVzIHBhc3NlZFxuICovXG5mdW5jdGlvbiBoYW5kbGVzQXJyYXl0b0hhbmRsZShoYW5kbGVzOiBIYW5kbGVbXSk6IEhhbmRsZSB7XG5cdHJldHVybiB7XG5cdFx0ZGVzdHJveSgpIHtcblx0XHRcdGhhbmRsZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUuZGVzdHJveSgpKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgZXZlbnQgb2JqZWN0LCB3aGljaCBwcm92aWRlcyBhIGB0eXBlYCBwcm9wZXJ0eVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50T2JqZWN0IHtcblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIHRoZSBldmVudFxuXHQgKi9cblx0cmVhZG9ubHkgdHlwZTogc3RyaW5nIHwgc3ltYm9sO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50ZWRDYWxsYmFjazxFIGV4dGVuZHMgRXZlbnRPYmplY3Q+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgdGhhdCB0YWtlcyBhbiBgZXZlbnRgIGFyZ3VtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgb2JqZWN0XG5cdCAqL1xuXHQoZXZlbnQ6IEUpOiBib29sZWFuIHwgdm9pZDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIEV2ZW50ZWQgY29uc3RydWN0b3Igb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50ZWRPcHRpb25zIHtcblx0LyoqXG5cdCAqIE9wdGlvbmFsIGxpc3RlbmVycyB0byBhZGRcblx0ICovXG5cdGxpc3RlbmVycz86IEV2ZW50ZWRMaXN0ZW5lcnNNYXA8YW55Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCYXNlRXZlbnRlZEV2ZW50cyB7XG5cdC8qKlxuXHQgKiBSZWdzaXN0ZXIgYSBjYWxsYmFjayBmb3IgYSBzcGVjaWZpYyBldmVudCB0eXBlXG5cdCAqXG5cdCAqIEBwYXJhbSBsaXN0ZW5lcnMgbWFwIG9mIGxpc3RlbmVyc1xuXHQgKi9cblx0KGxpc3RlbmVyczogRXZlbnRlZExpc3RlbmVyc01hcDxFdmVudGVkPik6IEhhbmRsZTtcblxuXHQvKipcblx0ICogQHBhcmFtIHR5cGUgdGhlIHR5cGUgb2YgdGhlIGV2ZW50XG5cdCAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gYXR0YWNoXG5cdCAqL1xuXHQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCBsaXN0ZW5lcjogRXZlbnRlZExpc3RlbmVyT3JBcnJheTxFdmVudGVkLCBFdmVudFRhcmdldHRlZE9iamVjdDxFdmVudGVkPj4pOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB0eXBlIHRoZSB0eXBlIGZvciBgZXJyb3JgXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gYXR0YWNoXG5cdCAqL1xuXHQodHlwZTogJ2Vycm9yJywgbGlzdGVuZXI6IEV2ZW50ZWRMaXN0ZW5lck9yQXJyYXk8RXZlbnRlZCwgRXZlbnRFcnJvck9iamVjdDxFdmVudGVkPj4pOiBIYW5kbGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRlZCB7XG5cdG9uOiBCYXNlRXZlbnRlZEV2ZW50cztcbn1cblxuLyoqXG4gKiBNYXAgb2YgY29tcHV0ZWQgcmVndWxhciBleHByZXNzaW9ucywga2V5ZWQgYnkgc3RyaW5nXG4gKi9cbmNvbnN0IHJlZ2V4TWFwID0gbmV3IE1hcDxzdHJpbmcsIFJlZ0V4cD4oKTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSBldmVudCB0eXBlIGdsb2IgaGFzIGJlZW4gbWF0Y2hlZFxuICpcbiAqIEByZXR1cm5zIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGdsb2IgaXMgbWF0Y2hlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNHbG9iTWF0Y2goZ2xvYlN0cmluZzogc3RyaW5nIHwgc3ltYm9sLCB0YXJnZXRTdHJpbmc6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuXHRpZiAodHlwZW9mIHRhcmdldFN0cmluZyA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGdsb2JTdHJpbmcgPT09ICdzdHJpbmcnICYmIGdsb2JTdHJpbmcuaW5kZXhPZignKicpICE9PSAtMSkge1xuXHRcdGxldCByZWdleDogUmVnRXhwO1xuXHRcdGlmIChyZWdleE1hcC5oYXMoZ2xvYlN0cmluZykpIHtcblx0XHRcdHJlZ2V4ID0gcmVnZXhNYXAuZ2V0KGdsb2JTdHJpbmcpITtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZWdleCA9IG5ldyBSZWdFeHAoYF4keyBnbG9iU3RyaW5nLnJlcGxhY2UoL1xcKi9nLCAnLionKSB9JGApO1xuXHRcdFx0cmVnZXhNYXAuc2V0KGdsb2JTdHJpbmcsIHJlZ2V4KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlZ2V4LnRlc3QodGFyZ2V0U3RyaW5nKTtcblxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBnbG9iU3RyaW5nID09PSB0YXJnZXRTdHJpbmc7XG5cdH1cbn1cblxuLyoqXG4gKiBFdmVudCBDbGFzc1xuICovXG5leHBvcnQgY2xhc3MgRXZlbnRlZCBleHRlbmRzIERlc3Ryb3lhYmxlIGltcGxlbWVudHMgRXZlbnRlZCB7XG5cblx0LyoqXG5cdCAqIG1hcCBvZiBsaXN0ZW5lcnMga2V5ZWQgYnkgZXZlbnQgdHlwZVxuXHQgKi9cblx0cHJvdGVjdGVkIGxpc3RlbmVyc01hcDogTWFwPHN0cmluZywgRXZlbnRlZENhbGxiYWNrPEV2ZW50T2JqZWN0Pj4gPSBuZXcgTWFwPHN0cmluZywgRXZlbnRlZENhbGxiYWNrPEV2ZW50T2JqZWN0Pj4oKTtcblxuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSBvcHRpb25zIFRoZSBjb25zdHJ1Y3RvciBhcmd1cm1lbnRzXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBFdmVudGVkT3B0aW9ucyA9IHt9KSB7XG5cdFx0c3VwZXIoKTtcblx0XHRjb25zdCB7IGxpc3RlbmVycyB9ID0gb3B0aW9ucztcblx0XHRpZiAobGlzdGVuZXJzKSB7XG5cdFx0XHR0aGlzLm93bih0aGlzLm9uKGxpc3RlbmVycykpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBFbWl0cyB0aGUgZXZlbnQgb2JqZXQgZm9yIHRoZSBzcGVjaWZpZWQgdHlwZVxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGVtaXRcblx0ICovXG5cdGVtaXQ8RSBleHRlbmRzIEV2ZW50T2JqZWN0PihldmVudDogRSk6IHZvaWQge1xuXHRcdHRoaXMubGlzdGVuZXJzTWFwLmZvckVhY2goKG1ldGhvZCwgdHlwZSkgPT4ge1xuXHRcdFx0aWYgKGlzR2xvYk1hdGNoKHR5cGUsIGV2ZW50LnR5cGUpKSB7XG5cdFx0XHRcdG1ldGhvZC5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYXRjaCBhbGwgaGFuZGxlciBmb3IgdmFyaW91cyBjYWxsIHNpZ25hdHVyZXMuIFRoZSBzaWduYXR1cmVzIGFyZSBkZWZpbmVkIGluXG5cdCAqIGBCYXNlRXZlbnRlZEV2ZW50c2AuICBZb3UgY2FuIGFkZCB5b3VyIG93biBldmVudCB0eXBlIC0+IGhhbmRsZXIgdHlwZXMgYnkgZXh0ZW5kaW5nXG5cdCAqIGBCYXNlRXZlbnRlZEV2ZW50c2AuICBTZWUgZXhhbXBsZSBmb3IgZGV0YWlscy5cblx0ICpcblx0ICogQHBhcmFtIGFyZ3Ncblx0ICpcblx0ICogQGV4YW1wbGVcblx0ICpcblx0ICogaW50ZXJmYWNlIFdpZGdldEJhc2VFdmVudHMgZXh0ZW5kcyBCYXNlRXZlbnRlZEV2ZW50cyB7XG5cdCAqICAgICAodHlwZTogJ3Byb3BlcnRpZXM6Y2hhbmdlZCcsIGhhbmRsZXI6IFByb3BlcnRpZXNDaGFuZ2VkSGFuZGxlcik6IEhhbmRsZTtcblx0ICogfVxuXHQgKiBjbGFzcyBXaWRnZXRCYXNlIGV4dGVuZHMgRXZlbnRlZCB7XG5cdCAqICAgIG9uOiBXaWRnZXRCYXNlRXZlbnRzO1xuXHQgKiB9XG5cdCAqXG5cdCAqIEByZXR1cm4ge2FueX1cblx0ICovXG5cdG9uOiBCYXNlRXZlbnRlZEV2ZW50cyA9IGZ1bmN0aW9uICh0aGlzOiBFdmVudGVkLCAuLi5hcmdzOiBhbnlbXSkge1xuXHRcdGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0Y29uc3QgWyB0eXBlLCBsaXN0ZW5lcnMgXSA9IDxbIHN0cmluZywgRXZlbnRlZExpc3RlbmVyT3JBcnJheTxhbnksIEV2ZW50VGFyZ2V0dGVkT2JqZWN0PGFueT4+XT4gYXJncztcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcblx0XHRcdFx0Y29uc3QgaGFuZGxlcyA9IGxpc3RlbmVycy5tYXAoKGxpc3RlbmVyKSA9PiBhc3BlY3RPbih0aGlzLmxpc3RlbmVyc01hcCwgdHlwZSwgcmVzb2x2ZUxpc3RlbmVyKGxpc3RlbmVyKSkpO1xuXHRcdFx0XHRyZXR1cm4gaGFuZGxlc0FycmF5dG9IYW5kbGUoaGFuZGxlcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGFzcGVjdE9uKHRoaXMubGlzdGVuZXJzTWFwLCB0eXBlLCByZXNvbHZlTGlzdGVuZXIobGlzdGVuZXJzKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRjb25zdCBbIGxpc3RlbmVyTWFwQXJnIF0gPSA8W0V2ZW50ZWRMaXN0ZW5lcnNNYXA8YW55Pl0+IGFyZ3M7XG5cdFx0XHRjb25zdCBoYW5kbGVzID0gT2JqZWN0LmtleXMobGlzdGVuZXJNYXBBcmcpLm1hcCgodHlwZSkgPT4gdGhpcy5vbih0eXBlLCBsaXN0ZW5lck1hcEFyZ1t0eXBlXSkpO1xuXHRcdFx0cmV0dXJuIGhhbmRsZXNBcnJheXRvSGFuZGxlKGhhbmRsZXMpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzJyk7XG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudGVkO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIEV2ZW50ZWQudHMiLCJpbXBvcnQgeyBIYW5kbGUgfSBmcm9tICdAZG9qby9pbnRlcmZhY2VzL2NvcmUnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IGNyZWF0ZUhhbmRsZSB9IGZyb20gJy4vbGFuZyc7XG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgcHJvdmlkZXMgdGhlIG5lY2Vzc2FyeSBBUElzIHRvIGJlIE1hcExpa2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXBMaWtlPEssIFY+IHtcblx0Z2V0KGtleTogSyk6IFY7XG5cdHNldChrZXk6IEssIHZhbHVlPzogVik6IHRoaXM7XG59XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgdHlwZSBndWFyZCB0aGF0IGRldGVybWluZXMgaWYgYW4gdmFsdWUgaXMgTWFwTGlrZSBvciBub3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGFnYWluc3RcbiAqL1xuZnVuY3Rpb24gaXNNYXBMaWtlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBNYXBMaWtlPGFueSwgYW55PiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWx1ZS5zZXQgPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5kZXhhYmxlIHtcblx0W21ldGhvZDogc3RyaW5nXTogYW55O1xufVxuXG4vKipcbiAqIFRoZSB0eXBlcyBvZiBvYmplY3RzIG9yIG1hcHMgd2hlcmUgYWR2aWNlIGNhbiBiZSBhcHBsaWVkXG4gKi9cbmV4cG9ydCB0eXBlIFRhcmdldGFibGUgPSBNYXBMaWtlPHN0cmluZywgYW55PiB8IEluZGV4YWJsZTtcblxudHlwZSBBZHZpY2VUeXBlID0gJ2JlZm9yZScgfCAnYWZ0ZXInIHwgJ2Fyb3VuZCc7XG5cbi8qKlxuICogQSBtZXRhIGRhdGEgc3RydWN0dXJlIHdoZW4gYXBwbHlpbmcgYWR2aWNlXG4gKi9cbmludGVyZmFjZSBBZHZpc2VkIHtcblx0cmVhZG9ubHkgaWQ/OiBudW1iZXI7XG5cdGFkdmljZT86IEZ1bmN0aW9uO1xuXHRwcmV2aW91cz86IEFkdmlzZWQ7XG5cdG5leHQ/OiBBZHZpc2VkO1xuXHRyZWFkb25seSByZWNlaXZlQXJndW1lbnRzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyBhZHZpY2Ugd2hpY2ggaXMgZGVjb3JhdGVkIHdpdGggYWRkaXRpb25hbFxuICogbWV0YSBkYXRhIGFib3V0IHRoZSBhZHZpY2UgdG8gYXBwbHlcbiAqL1xuaW50ZXJmYWNlIERpc3BhdGNoZXIge1xuXHRbIHR5cGU6IHN0cmluZyBdOiBBZHZpc2VkIHwgdW5kZWZpbmVkO1xuXHQoKTogYW55O1xuXHR0YXJnZXQ6IGFueTtcblx0YmVmb3JlPzogQWR2aXNlZDtcblx0YXJvdW5kPzogQWR2aXNlZDtcblx0YWZ0ZXI/OiBBZHZpc2VkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpvaW5Qb2ludERpc3BhdGNoQWR2aWNlPFQ+IHtcblx0YmVmb3JlPzogSm9pblBvaW50QmVmb3JlQWR2aWNlW107XG5cdGFmdGVyPzogSm9pblBvaW50QWZ0ZXJBZHZpY2U8VD5bXTtcblx0cmVhZG9ubHkgam9pblBvaW50OiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKb2luUG9pbnRBZnRlckFkdmljZTxUPiB7XG5cdC8qKlxuXHQgKiBBZHZpY2Ugd2hpY2ggaXMgYXBwbGllZCAqYWZ0ZXIqLCByZWNlaXZpbmcgdGhlIHJlc3VsdCBhbmQgYXJndW1lbnRzIGZyb20gdGhlIGpvaW4gcG9pbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSByZXN1bHQgVGhlIHJlc3VsdCBmcm9tIHRoZSBmdW5jdGlvbiBiZWluZyBhZHZpc2VkXG5cdCAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHN1cHBsaWVkIHRvIHRoZSBhZHZpc2VkIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIFRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIHRoZSBhZHZpY2UgaXMgdGhlbiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIG1ldGhvZFxuXHQgKi9cblx0KHJlc3VsdDogVCwgLi4uYXJnczogYW55W10pOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpvaW5Qb2ludEFyb3VuZEFkdmljZTxUPiB7XG5cdC8qKlxuXHQgKiBBZHZpY2Ugd2hpY2ggaXMgYXBwbGllZCAqYXJvdW5kKi4gIFRoZSBhZHZpc2luZyBmdW5jdGlvbiByZWNlaXZlcyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gYW5kXG5cdCAqIG5lZWRzIHRvIHJldHVybiBhIG5ldyBmdW5jdGlvbiB3aGljaCB3aWxsIHRoZW4gaW52b2tlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIG9yaWdGbiBUaGUgb3JpZ2luYWwgZnVuY3Rpb25cblx0ICogQHJldHVybnMgQSBuZXcgZnVuY3Rpb24gd2hpY2ggd2lsbCBpbnZva2UgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuXHQgKi9cblx0KG9yaWdGbjogR2VuZXJpY0Z1bmN0aW9uPFQ+KTogKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpvaW5Qb2ludEJlZm9yZUFkdmljZSB7XG5cdC8qKlxuXHQgKiBBZHZpY2Ugd2hpY2ggaXMgYXBwbGllZCAqYmVmb3JlKiwgcmVjZWl2aW5nIHRoZSBvcmlnaW5hbCBhcmd1bWVudHMsIGlmIHRoZSBhZHZpc2luZ1xuXHQgKiBmdW5jdGlvbiByZXR1cm5zIGEgdmFsdWUsIGl0IGlzIHBhc3NlZCBmdXJ0aGVyIGFsb25nIHRha2luZyB0aGUgcGxhY2Ugb2YgdGhlIG9yaWdpbmFsXG5cdCAqIGFyZ3VtZW50cy5cblx0ICpcblx0ICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0aGUgbWV0aG9kIHdhcyBjYWxsZWQgd2l0aFxuXHQgKi9cblx0KC4uLmFyZ3M6IGFueVtdKTogYW55W10gfCB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNGdW5jdGlvbjxUPiB7XG5cdCguLi5hcmdzOiBhbnlbXSk6IFQ7XG59XG5cbi8qKlxuICogQSB3ZWFrIG1hcCBvZiBkaXNwYXRjaGVycyB1c2VkIHRvIGFwcGx5IHRoZSBhZHZpY2VcbiAqL1xuY29uc3QgZGlzcGF0Y2hBZHZpY2VNYXAgPSBuZXcgV2Vha01hcDxGdW5jdGlvbiwgSm9pblBvaW50RGlzcGF0Y2hBZHZpY2U8YW55Pj4oKTtcblxuLyoqXG4gKiBBIFVJRCBmb3IgdHJhY2tpbmcgYWR2aWNlIG9yZGVyaW5nXG4gKi9cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgYWR2aXNlcyBhIGpvaW4gcG9pbnRcbiAqXG4gKiBAcGFyYW0gZGlzcGF0Y2hlciBUaGUgY3VycmVudCBhZHZpY2UgZGlzcGF0Y2hlclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgYmVmb3JlIG9yIGFmdGVyIGFkdmljZSB0byBhcHBseVxuICogQHBhcmFtIGFkdmljZSBUaGUgYWR2aWNlIHRvIGFwcGx5XG4gKiBAcGFyYW0gcmVjZWl2ZUFyZ3VtZW50cyBJZiB0cnVlLCB0aGUgYWR2aWNlIHdpbGwgcmVjZWl2ZSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgam9pbiBwb2ludFxuICogQHJldHVybiBUaGUgaGFuZGxlIHRoYXQgd2lsbCByZW1vdmUgdGhlIGFkdmljZVxuICovXG5mdW5jdGlvbiBhZHZpc2VPYmplY3QoXG5cdGRpc3BhdGNoZXI6IERpc3BhdGNoZXIgfCB1bmRlZmluZWQsXG5cdHR5cGU6IEFkdmljZVR5cGUsXG5cdGFkdmljZTogRnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdHJlY2VpdmVBcmd1bWVudHM/OiBib29sZWFuXG4pOiBIYW5kbGUge1xuXHRsZXQgcHJldmlvdXMgPSBkaXNwYXRjaGVyICYmIGRpc3BhdGNoZXJbdHlwZV07XG5cdGxldCBhZHZpc2VkOiBBZHZpc2VkIHwgdW5kZWZpbmVkID0ge1xuXHRcdGlkOiBuZXh0SWQrKyxcblx0XHRhZHZpY2U6IGFkdmljZSxcblx0XHRyZWNlaXZlQXJndW1lbnRzOiByZWNlaXZlQXJndW1lbnRzXG5cdH07XG5cblx0aWYgKHByZXZpb3VzKSB7XG5cdFx0aWYgKHR5cGUgPT09ICdhZnRlcicpIHtcblx0XHRcdC8vIGFkZCB0aGUgbGlzdGVuZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuXHRcdFx0Ly8gbm90ZSB0aGF0IHdlIGhhZCB0byBjaGFuZ2UgdGhpcyBsb29wIGEgbGl0dGxlIGJpdCB0byB3b3JrYXJvdW5kIGEgYml6YXJyZSBJRTEwIEpJVCBidWdcblx0XHRcdHdoaWxlIChwcmV2aW91cy5uZXh0ICYmIChwcmV2aW91cyA9IHByZXZpb3VzLm5leHQpKSB7fVxuXHRcdFx0cHJldmlvdXMubmV4dCA9IGFkdmlzZWQ7XG5cdFx0XHRhZHZpc2VkLnByZXZpb3VzID0gcHJldmlvdXM7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gYWRkIHRvIHRoZSBiZWdpbm5pbmdcblx0XHRcdGlmIChkaXNwYXRjaGVyKSB7XG5cdFx0XHRcdGRpc3BhdGNoZXIuYmVmb3JlID0gYWR2aXNlZDtcblx0XHRcdH1cblx0XHRcdGFkdmlzZWQubmV4dCA9IHByZXZpb3VzO1xuXHRcdFx0cHJldmlvdXMucHJldmlvdXMgPSBhZHZpc2VkO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHRkaXNwYXRjaGVyICYmIChkaXNwYXRjaGVyW3R5cGVdID0gYWR2aXNlZCk7XG5cdH1cblxuXHRhZHZpY2UgPSBwcmV2aW91cyA9IHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgeyBwcmV2aW91cyA9IHVuZGVmaW5lZCwgbmV4dCA9IHVuZGVmaW5lZCB9ID0gKGFkdmlzZWQgfHwge30pO1xuXG5cdFx0aWYgKGRpc3BhdGNoZXIgJiYgIXByZXZpb3VzICYmICFuZXh0KSB7XG5cdFx0XHRkaXNwYXRjaGVyW3R5cGVdID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChwcmV2aW91cykge1xuXHRcdFx0XHRwcmV2aW91cy5uZXh0ID0gbmV4dDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkaXNwYXRjaGVyICYmIChkaXNwYXRjaGVyW3R5cGVdID0gbmV4dCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdG5leHQucHJldmlvdXMgPSBwcmV2aW91cztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGFkdmlzZWQpIHtcblx0XHRcdGRlbGV0ZSBhZHZpc2VkLmFkdmljZTtcblx0XHR9XG5cdFx0ZGlzcGF0Y2hlciA9IGFkdmlzZWQgPSB1bmRlZmluZWQ7XG5cdH0pO1xufVxuXG4vKipcbiAqIEFkdmlzZSBhIGpvaW4gcG9pbnQgKGZ1bmN0aW9uKSB3aXRoIHN1cHBsaWVkIGFkdmljZVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgVGhlIGZ1bmN0aW9uIHRvIGJlIGFkdmlzZWRcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGFkdmljZSB0byBiZSBhcHBsaWVkXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhZHZpY2UgdG8gYXBwbHlcbiAqL1xuZnVuY3Rpb24gYWR2aXNlSm9pblBvaW50PEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KHRoaXM6IGFueSwgam9pblBvaW50OiBGLCB0eXBlOiBBZHZpY2VUeXBlLCBhZHZpY2U6IEpvaW5Qb2ludEJlZm9yZUFkdmljZSB8IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+IHwgSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+KTogRiB7XG5cdGxldCBkaXNwYXRjaGVyOiBGO1xuXHRpZiAodHlwZSA9PT0gJ2Fyb3VuZCcpIHtcblx0XHRkaXNwYXRjaGVyID0gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcihhZHZpY2UuYXBwbHkodGhpcywgWyBqb2luUG9pbnQgXSkpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGRpc3BhdGNoZXIgPSBnZXRKb2luUG9pbnREaXNwYXRjaGVyKGpvaW5Qb2ludCk7XG5cdFx0Ly8gY2Fubm90IGhhdmUgdW5kZWZpbmVkIGluIG1hcCBkdWUgdG8gY29kZSBsb2dpYywgdXNpbmcgIVxuXHRcdGNvbnN0IGFkdmljZU1hcCA9IGRpc3BhdGNoQWR2aWNlTWFwLmdldChkaXNwYXRjaGVyKSE7XG5cdFx0aWYgKHR5cGUgPT09ICdiZWZvcmUnKSB7XG5cdFx0XHQoYWR2aWNlTWFwLmJlZm9yZSB8fCAoYWR2aWNlTWFwLmJlZm9yZSA9IFtdKSkudW5zaGlmdCg8Sm9pblBvaW50QmVmb3JlQWR2aWNlPiBhZHZpY2UpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdChhZHZpY2VNYXAuYWZ0ZXIgfHwgKGFkdmljZU1hcC5hZnRlciA9IFtdKSkucHVzaChhZHZpY2UpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuLyoqXG4gKiBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIG9yIGNyZWF0ZXMgdGhlIGRpc3BhdGNoZXIgZm9yIGEgZ2l2ZW4gam9pbiBwb2ludFxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb3IgbWFwXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRoYXQgdGhlIGRpc3BhdGNoZXIgc2hvdWxkIGJlIHJlc29sdmVkIGZvclxuICogQHJldHVybiBUaGUgZGlzcGF0Y2hlclxuICovXG5mdW5jdGlvbiBnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nKTogRGlzcGF0Y2hlciB7XG5cdGNvbnN0IGV4aXN0aW5nID0gaXNNYXBMaWtlKHRhcmdldCkgPyB0YXJnZXQuZ2V0KG1ldGhvZE5hbWUpIDogdGFyZ2V0ICYmIHRhcmdldFttZXRob2ROYW1lXTtcblx0bGV0IGRpc3BhdGNoZXI6IERpc3BhdGNoZXI7XG5cblx0aWYgKCFleGlzdGluZyB8fCBleGlzdGluZy50YXJnZXQgIT09IHRhcmdldCkge1xuXHRcdC8qIFRoZXJlIGlzIG5vIGV4aXN0aW5nIGRpc3BhdGNoZXIsIHRoZXJlZm9yZSB3ZSB3aWxsIGNyZWF0ZSBvbmUgKi9cblx0XHRkaXNwYXRjaGVyID0gPERpc3BhdGNoZXI+IGZ1bmN0aW9uICh0aGlzOiBEaXNwYXRjaGVyKTogYW55IHtcblx0XHRcdGxldCBleGVjdXRpb25JZCA9IG5leHRJZDtcblx0XHRcdGxldCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0bGV0IHJlc3VsdHM6IGFueTtcblx0XHRcdGxldCBiZWZvcmUgPSBkaXNwYXRjaGVyLmJlZm9yZTtcblxuXHRcdFx0d2hpbGUgKGJlZm9yZSkge1xuXHRcdFx0XHRpZiAoYmVmb3JlLmFkdmljZSkge1xuXHRcdFx0XHRcdGFyZ3MgPSBiZWZvcmUuYWR2aWNlLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IGFyZ3M7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmVmb3JlID0gYmVmb3JlLm5leHQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkaXNwYXRjaGVyLmFyb3VuZCAmJiBkaXNwYXRjaGVyLmFyb3VuZC5hZHZpY2UpIHtcblx0XHRcdFx0cmVzdWx0cyA9IGRpc3BhdGNoZXIuYXJvdW5kLmFkdmljZSh0aGlzLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFmdGVyID0gZGlzcGF0Y2hlci5hZnRlcjtcblx0XHRcdHdoaWxlIChhZnRlciAmJiBhZnRlci5pZCAhPT0gdW5kZWZpbmVkICYmIGFmdGVyLmlkIDwgZXhlY3V0aW9uSWQpIHtcblx0XHRcdFx0aWYgKGFmdGVyLmFkdmljZSkge1xuXHRcdFx0XHRcdGlmIChhZnRlci5yZWNlaXZlQXJndW1lbnRzKSB7XG5cdFx0XHRcdFx0XHRsZXQgbmV3UmVzdWx0cyA9IGFmdGVyLmFkdmljZS5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBuZXdSZXN1bHRzID09PSB1bmRlZmluZWQgPyByZXN1bHRzIDogbmV3UmVzdWx0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gYWZ0ZXIuYWR2aWNlLmNhbGwodGhpcywgcmVzdWx0cywgYXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGFmdGVyID0gYWZ0ZXIubmV4dDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHRcdGlmIChpc01hcExpa2UodGFyZ2V0KSkge1xuXHRcdFx0dGFyZ2V0LnNldChtZXRob2ROYW1lLCBkaXNwYXRjaGVyKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0YXJnZXQgJiYgKHRhcmdldFttZXRob2ROYW1lXSA9IGRpc3BhdGNoZXIpO1xuXHRcdH1cblxuXHRcdGlmIChleGlzdGluZykge1xuXHRcdFx0ZGlzcGF0Y2hlci5hcm91bmQgPSB7XG5cdFx0XHRcdGFkdmljZTogZnVuY3Rpb24gKHRhcmdldDogYW55LCBhcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0XHRcdFx0cmV0dXJuIGV4aXN0aW5nLmFwcGx5KHRhcmdldCwgYXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZGlzcGF0Y2hlci50YXJnZXQgPSB0YXJnZXQ7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hlciA9IGV4aXN0aW5nO1xuXHR9XG5cblx0cmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGlzcGF0Y2hlciBmdW5jdGlvbiBmb3IgYSBnaXZlbiBqb2luUG9pbnQgKG1ldGhvZC9mdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IFRoZSBmdW5jdGlvbiB0aGF0IGlzIHRvIGJlIGFkdmlzZWRcbiAqL1xuZnVuY3Rpb24gZ2V0Sm9pblBvaW50RGlzcGF0Y2hlcjxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnQ6IEYpOiBGIHtcblxuXHRmdW5jdGlvbiBkaXNwYXRjaGVyKHRoaXM6IEZ1bmN0aW9uLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuXHRcdC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcblx0XHRjb25zdCB7IGJlZm9yZSwgYWZ0ZXIsIGpvaW5Qb2ludCB9ID0gZGlzcGF0Y2hBZHZpY2VNYXAuZ2V0KGRpc3BhdGNoZXIpITtcblx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRhcmdzID0gYmVmb3JlLnJlZHVjZSgocHJldmlvdXNBcmdzLCBhZHZpY2UpID0+IHtcblx0XHRcdFx0Y29uc3QgY3VycmVudEFyZ3MgPSBhZHZpY2UuYXBwbHkodGhpcywgcHJldmlvdXNBcmdzKTtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRBcmdzIHx8IHByZXZpb3VzQXJncztcblx0XHRcdH0sIGFyZ3MpO1xuXHRcdH1cblx0XHRsZXQgcmVzdWx0ID0gam9pblBvaW50LmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGlmIChhZnRlcikge1xuXHRcdFx0cmVzdWx0ID0gYWZ0ZXIucmVkdWNlKChwcmV2aW91c1Jlc3VsdCwgYWR2aWNlKSA9PiB7XG5cdFx0XHRcdHJldHVybiBhZHZpY2UuYXBwbHkodGhpcywgWyBwcmV2aW91c1Jlc3VsdCBdLmNvbmNhdChhcmdzKSk7XG5cdFx0XHR9LCByZXN1bHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyogV2Ugd2FudCB0byBcImNsb25lXCIgdGhlIGFkdmljZSB0aGF0IGhhcyBiZWVuIGFwcGxpZWQgYWxyZWFkeSwgaWYgdGhpc1xuXHQgKiBqb2luUG9pbnQgaXMgYWxyZWFkeSBhZHZpc2VkICovXG5cdGlmIChkaXNwYXRjaEFkdmljZU1hcC5oYXMoam9pblBvaW50KSkge1xuXHRcdC8vIGNhbm5vdCBoYXZlIHVuZGVmaW5lZCBpbiBtYXAgZHVlIHRvIGNvZGUgbG9naWMsIHVzaW5nICFcblx0XHRjb25zdCBhZHZpY2VNYXAgPSBkaXNwYXRjaEFkdmljZU1hcC5nZXQoam9pblBvaW50KSE7XG5cdFx0bGV0IHsgYmVmb3JlLCBhZnRlciB9ID0gYWR2aWNlTWFwO1xuXHRcdGlmIChiZWZvcmUpIHtcblx0XHRcdGJlZm9yZSA9IGJlZm9yZS5zbGljZSgwKTtcblx0XHR9XG5cdFx0aWYgKGFmdGVyKSB7XG5cdFx0XHRhZnRlciA9IGFmdGVyLnNsaWNlKDApO1xuXHRcdH1cblx0XHRkaXNwYXRjaEFkdmljZU1hcC5zZXQoZGlzcGF0Y2hlciwge1xuXHRcdFx0am9pblBvaW50OiBhZHZpY2VNYXAuam9pblBvaW50LFxuXHRcdFx0YmVmb3JlLFxuXHRcdFx0YWZ0ZXJcblx0XHR9KTtcblx0fVxuXHQvKiBPdGhlcndpc2UsIHRoaXMgaXMgYSBuZXcgam9pblBvaW50LCBzbyB3ZSB3aWxsIGNyZWF0ZSB0aGUgYWR2aWNlIG1hcCBhZnJlc2ggKi9cblx0ZWxzZSB7XG5cdFx0ZGlzcGF0Y2hBZHZpY2VNYXAuc2V0KGRpc3BhdGNoZXIsIHsgam9pblBvaW50IH0pO1xuXHR9XG5cblx0cmV0dXJuIGRpc3BhdGNoZXIgYXMgRjtcbn1cblxuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmFmdGVyKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYWZ0ZXIgYWR2aWNlXG4gKi9cbmZ1bmN0aW9uIGFmdGVySm9pblBvaW50PEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRBZnRlckFkdmljZTxUPik6IEYge1xuXHRyZXR1cm4gYWR2aXNlSm9pblBvaW50KGpvaW5Qb2ludCwgJ2FmdGVyJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImFmdGVyXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3QuXG4gKiBUaGUgdmFsdWUgaXQgcmV0dXJucyB3aWxsIGJlIHJldHVybmVkIGZyb20gdGhlIG1ldGhvZCB3aGVuIGl0IGlzIGNhbGxlZCAoZXZlbiBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIHVuZGVmaW5lZCkuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSBhbmQgYXJndW1lbnRzIG9iamVjdFxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZnVuY3Rpb24gYWZ0ZXJPYmplY3QodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKG9yaWdpbmFsUmV0dXJuOiBhbnksIG9yaWdpbmFsQXJnczogSUFyZ3VtZW50cykgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdhZnRlcicsIGFkdmljZSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJhZnRlclwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIGFkdmlzaW5nIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kJ3MgcmV0dXJuIHZhbHVlIGFuZCBhcmd1bWVudHMgb2JqZWN0LlxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKGV2ZW4gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQpLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgYW5kIGFyZ3VtZW50cyBvYmplY3RcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcih0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAob3JpZ2luYWxSZXR1cm46IGFueSwgb3JpZ2luYWxBcmdzOiBJQXJndW1lbnRzKSA9PiBhbnkpOiBIYW5kbGU7XG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYWZ0ZXIqIHRoZSBzdXBwbGllZCBqb2luUG9pbnQgKGZ1bmN0aW9uKVxuICpcbiAqIEBwYXJhbSBqb2luUG9pbnQgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBoYXZlIGFkdmljZSBhcHBsaWVkIHRvXG4gKiBAcGFyYW0gYWR2aWNlIFRoZSBhZnRlciBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRBZnRlckFkdmljZTxUPik6IEY7XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXI8RiBleHRlbmRzIEdlbmVyaWNGdW5jdGlvbjxUPiwgVD4oam9pblBvaW50T3JUYXJnZXQ6IEYgfCBUYXJnZXRhYmxlLCBtZXRob2ROYW1lT3JBZHZpY2U6IHN0cmluZyB8IEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+LCBvYmplY3RBZHZpY2U/OiAob3JpZ2luYWxSZXR1cm46IGFueSwgb3JpZ2luYWxBcmdzOiBJQXJndW1lbnRzKSA9PiBhbnkpOiBIYW5kbGUgfCBGIHtcblx0aWYgKHR5cGVvZiBqb2luUG9pbnRPclRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBhZnRlckpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgPEpvaW5Qb2ludEFmdGVyQWR2aWNlPFQ+PiBtZXRob2ROYW1lT3JBZHZpY2UpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBhZnRlck9iamVjdChqb2luUG9pbnRPclRhcmdldCwgPHN0cmluZz4gbWV0aG9kTmFtZU9yQWR2aWNlLCBvYmplY3RBZHZpY2UhKTtcblx0fVxufVxuXG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYXJvdW5kKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYXJvdW5kIGFkdmljZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJvdW5kSm9pblBvaW50PEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4pOiBGIHtcblx0cmV0dXJuIGFkdmlzZUpvaW5Qb2ludDxGLCBUPihqb2luUG9pbnQsICdhcm91bmQnLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYXJvdW5kXCIgYWR2aWNlIGFyb3VuZCB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICogQHJldHVybiBBIGhhbmRsZSB3aGljaCB3aWxsIHJlbW92ZSB0aGUgYXNwZWN0IHdoZW4gZGVzdHJveSBpcyBjYWxsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZE9iamVjdCh0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoKHByZXZpb3VzOiBGdW5jdGlvbikgPT4gRnVuY3Rpb24pKTogSGFuZGxlIHtcblx0bGV0IGRpc3BhdGNoZXI6IERpc3BhdGNoZXIgfCB1bmRlZmluZWQgPSBnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSk7XG5cdGxldCBwcmV2aW91cyA9IGRpc3BhdGNoZXIuYXJvdW5kO1xuXHRsZXQgYWR2aXNlZDogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG5cdGlmIChhZHZpY2UpIHtcblx0XHRhZHZpc2VkID0gYWR2aWNlKGZ1bmN0aW9uICh0aGlzOiBEaXNwYXRjaGVyKTogYW55IHtcblx0XHRcdGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy5hZHZpY2UpIHtcblx0XHRcdFx0cmV0dXJuIHByZXZpb3VzLmFkdmljZSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZGlzcGF0Y2hlci5hcm91bmQgPSB7XG5cdFx0YWR2aWNlOiBmdW5jdGlvbiAodGFyZ2V0OiBhbnksIGFyZ3M6IGFueVtdKTogYW55IHtcblx0XHRcdHJldHVybiBhZHZpc2VkID8gYWR2aXNlZC5hcHBseSh0YXJnZXQsIGFyZ3MpIDogcHJldmlvdXMgJiYgcHJldmlvdXMuYWR2aWNlICYmIHByZXZpb3VzLmFkdmljZSh0YXJnZXQsIGFyZ3MpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcblx0XHRhZHZpc2VkID0gZGlzcGF0Y2hlciA9IHVuZGVmaW5lZDtcblx0fSk7XG59XG5cbi8qKlxuICogQXR0YWNoZXMgXCJhcm91bmRcIiBhZHZpY2UgYXJvdW5kIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJvdW5kKHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICgocHJldmlvdXM6IEZ1bmN0aW9uKSA9PiBGdW5jdGlvbikpOiBIYW5kbGU7XG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYXJvdW5kKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYXJvdW5kIGFkdmljZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJvdW5kPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRBcm91bmRBZHZpY2U8VD4pOiBGO1xuZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPFQ+LCBUPihqb2luUG9pbnRPclRhcmdldDogRiB8IFRhcmdldGFibGUsIG1ldGhvZE5hbWVPckFkdmljZTogc3RyaW5nIHwgSm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+LCBvYmplY3RBZHZpY2U/OiAoKHByZXZpb3VzOiBGdW5jdGlvbikgPT4gRnVuY3Rpb24pKTogSGFuZGxlIHwgRiB7XG5cdGlmICh0eXBlb2Ygam9pblBvaW50T3JUYXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYXJvdW5kSm9pblBvaW50KGpvaW5Qb2ludE9yVGFyZ2V0LCA8Sm9pblBvaW50QXJvdW5kQWR2aWNlPFQ+PiBtZXRob2ROYW1lT3JBZHZpY2UpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBhcm91bmRPYmplY3Qoam9pblBvaW50T3JUYXJnZXQsIDxzdHJpbmc+IG1ldGhvZE5hbWVPckFkdmljZSwgb2JqZWN0QWR2aWNlISk7XG5cdH1cbn1cblxuLyoqXG4gKiBBcHBseSBhZHZpY2UgKmJlZm9yZSogdGhlIHN1cHBsaWVkIGpvaW5Qb2ludCAoZnVuY3Rpb24pXG4gKlxuICogQHBhcmFtIGpvaW5Qb2ludCBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGhhdmUgYWR2aWNlIGFwcGxpZWQgdG9cbiAqIEBwYXJhbSBhZHZpY2UgVGhlIGJlZm9yZSBhZHZpY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZUpvaW5Qb2ludDxGIGV4dGVuZHMgR2VuZXJpY0Z1bmN0aW9uPGFueT4+KGpvaW5Qb2ludDogRiwgYWR2aWNlOiBKb2luUG9pbnRCZWZvcmVBZHZpY2UpOiBGIHtcblx0cmV0dXJuIGFkdmlzZUpvaW5Qb2ludChqb2luUG9pbnQsICdiZWZvcmUnLCBhZHZpY2UpO1xufVxuXG4vKipcbiAqIEF0dGFjaGVzIFwiYmVmb3JlXCIgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgT2JqZWN0IHdob3NlIG1ldGhvZCB3aWxsIGJlIGFzcGVjdGVkXG4gKiBAcGFyYW0gbWV0aG9kTmFtZSBOYW1lIG9mIG1ldGhvZCB0byBhc3BlY3RcbiAqIEBwYXJhbSBhZHZpY2UgQWR2aXNpbmcgZnVuY3Rpb24gd2hpY2ggd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwsIGFuZCBtYXkgcmV0dXJuIG5ldyBhcmd1bWVudHNcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVPYmplY3QodGFyZ2V0OiBUYXJnZXRhYmxlLCBtZXRob2ROYW1lOiBzdHJpbmcsIGFkdmljZTogKC4uLm9yaWdpbmFsQXJnczogYW55W10pID0+IGFueVtdIHwgdm9pZCk6IEhhbmRsZSB7XG5cdHJldHVybiBhZHZpc2VPYmplY3QoZ2V0RGlzcGF0Y2hlck9iamVjdCh0YXJnZXQsIG1ldGhvZE5hbWUpLCAnYmVmb3JlJywgYWR2aWNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2hlcyBcImJlZm9yZVwiIGFkdmljZSB0byBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IE9iamVjdCB3aG9zZSBtZXRob2Qgd2lsbCBiZSBhc3BlY3RlZFxuICogQHBhcmFtIG1ldGhvZE5hbWUgTmFtZSBvZiBtZXRob2QgdG8gYXNwZWN0XG4gKiBAcGFyYW0gYWR2aWNlIEFkdmlzaW5nIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVjZWl2ZSB0aGUgc2FtZSBhcmd1bWVudHMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgbWF5IHJldHVybiBuZXcgYXJndW1lbnRzXG4gKiBAcmV0dXJuIEEgaGFuZGxlIHdoaWNoIHdpbGwgcmVtb3ZlIHRoZSBhc3BlY3Qgd2hlbiBkZXN0cm95IGlzIGNhbGxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlKHRhcmdldDogVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhZHZpY2U6ICguLi5vcmlnaW5hbEFyZ3M6IGFueVtdKSA9PiBhbnlbXSB8IHZvaWQpOiBIYW5kbGU7XG4vKipcbiAqIEFwcGx5IGFkdmljZSAqYmVmb3JlKiB0aGUgc3VwcGxpZWQgam9pblBvaW50IChmdW5jdGlvbilcbiAqXG4gKiBAcGFyYW0gam9pblBvaW50IEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgaGF2ZSBhZHZpY2UgYXBwbGllZCB0b1xuICogQHBhcmFtIGFkdmljZSBUaGUgYmVmb3JlIGFkdmljZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248YW55Pj4oam9pblBvaW50OiBGLCBhZHZpY2U6IEpvaW5Qb2ludEJlZm9yZUFkdmljZSk6IEY7XG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlPEYgZXh0ZW5kcyBHZW5lcmljRnVuY3Rpb248VD4sIFQ+KGpvaW5Qb2ludE9yVGFyZ2V0OiBGIHwgVGFyZ2V0YWJsZSwgbWV0aG9kTmFtZU9yQWR2aWNlOiBzdHJpbmcgfCBKb2luUG9pbnRCZWZvcmVBZHZpY2UsIG9iamVjdEFkdmljZT86ICgoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55W10gfCB2b2lkKSk6IEhhbmRsZSB8IEYge1xuXHRpZiAodHlwZW9mIGpvaW5Qb2ludE9yVGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGJlZm9yZUpvaW5Qb2ludChqb2luUG9pbnRPclRhcmdldCwgPEpvaW5Qb2ludEJlZm9yZUFkdmljZT4gbWV0aG9kTmFtZU9yQWR2aWNlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gYmVmb3JlT2JqZWN0KGpvaW5Qb2ludE9yVGFyZ2V0LCA8c3RyaW5nPiBtZXRob2ROYW1lT3JBZHZpY2UsIG9iamVjdEFkdmljZSEpO1xuXHR9XG59XG5cbi8qKlxuICogQXR0YWNoZXMgYWR2aWNlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gKiBUaGUgYWR2aXNpbmcgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICogVGhlIHZhbHVlIGl0IHJldHVybnMgd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBtZXRob2Qgd2hlbiBpdCBpcyBjYWxsZWQgKnVubGVzcyogaXRzIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQuXG4gKlxuICogQHBhcmFtIHRhcmdldCBPYmplY3Qgd2hvc2UgbWV0aG9kIHdpbGwgYmUgYXNwZWN0ZWRcbiAqIEBwYXJhbSBtZXRob2ROYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGFzcGVjdFxuICogQHBhcmFtIGFkdmljZSBBZHZpc2luZyBmdW5jdGlvbiB3aGljaCB3aWxsIHJlY2VpdmUgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAqIEByZXR1cm4gQSBoYW5kbGUgd2hpY2ggd2lsbCByZW1vdmUgdGhlIGFzcGVjdCB3aGVuIGRlc3Ryb3kgaXMgY2FsbGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbih0YXJnZXQ6IFRhcmdldGFibGUsIG1ldGhvZE5hbWU6IHN0cmluZywgYWR2aWNlOiAoLi4ub3JpZ2luYWxBcmdzOiBhbnlbXSkgPT4gYW55KTogSGFuZGxlIHtcblx0cmV0dXJuIGFkdmlzZU9iamVjdChnZXREaXNwYXRjaGVyT2JqZWN0KHRhcmdldCwgbWV0aG9kTmFtZSksICdhZnRlcicsIGFkdmljZSwgdHJ1ZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gYXNwZWN0LnRzIiwiaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnQGRvam8vaW50ZXJmYWNlcy9jb3JlJztcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0Bkb2pvL3NoaW0vb2JqZWN0JztcblxuZXhwb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vc2hpbS9vYmplY3QnO1xuXG5jb25zdCBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUeXBlIGd1YXJkIHRoYXQgZW5zdXJlcyB0aGF0IHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCB0byBPYmplY3RcbiAqIHRvIHdlZWQgb3V0IGhvc3Qgb2JqZWN0cyB0aGF0IGRvIG5vdCBkZXJpdmUgZnJvbSBPYmplY3QuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY2hlY2sgaWYgd2Ugd2FudCB0byBkZWVwIGNvcHkgYW4gb2JqZWN0IG9yIG5vdC5cbiAqIE5vdGU6IEluIEVTNiBpdCBpcyBwb3NzaWJsZSB0byBtb2RpZnkgYW4gb2JqZWN0J3MgU3ltYm9sLnRvU3RyaW5nVGFnIHByb3BlcnR5LCB3aGljaCB3aWxsXG4gKiBjaGFuZ2UgdGhlIHZhbHVlIHJldHVybmVkIGJ5IGB0b1N0cmluZ2AuIFRoaXMgaXMgYSByYXJlIGVkZ2UgY2FzZSB0aGF0IGlzIGRpZmZpY3VsdCB0byBoYW5kbGUsXG4gKiBzbyBpdCBpcyBub3QgaGFuZGxlZCBoZXJlLlxuICogQHBhcmFtICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4gICAgICAgSWYgdGhlIHZhbHVlIGlzIGNvZXJjaWJsZSBpbnRvIGFuIE9iamVjdFxuICovXG5mdW5jdGlvbiBzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZTogYW55KTogdmFsdWUgaXMgT2JqZWN0IHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBjb3B5QXJyYXk8VD4oYXJyYXk6IFRbXSwgaW5oZXJpdGVkOiBib29sZWFuKTogVFtdIHtcblx0cmV0dXJuIGFycmF5Lm1hcChmdW5jdGlvbiAoaXRlbTogVCk6IFQge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG5cdFx0XHRyZXR1cm4gPGFueT4gY29weUFycmF5KDxhbnk+IGl0ZW0sIGluaGVyaXRlZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICFzaG91bGREZWVwQ29weU9iamVjdChpdGVtKSA/XG5cdFx0XHRpdGVtIDpcblx0XHRcdF9taXhpbih7XG5cdFx0XHRcdGRlZXA6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRlZDogaW5oZXJpdGVkLFxuXHRcdFx0XHRzb3VyY2VzOiA8QXJyYXk8VD4+IFsgaXRlbSBdLFxuXHRcdFx0XHR0YXJnZXQ6IDxUPiB7fVxuXHRcdFx0fSk7XG5cdH0pO1xufVxuXG5pbnRlcmZhY2UgTWl4aW5BcmdzPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9PiB7XG5cdGRlZXA6IGJvb2xlYW47XG5cdGluaGVyaXRlZDogYm9vbGVhbjtcblx0c291cmNlczogKFUgfCBudWxsIHwgdW5kZWZpbmVkKVtdO1xuXHR0YXJnZXQ6IFQ7XG5cdGNvcGllZD86IGFueVtdO1xufVxuXG5mdW5jdGlvbiBfbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KGt3QXJnczogTWl4aW5BcmdzPFQsIFU+KTogVCZVIHtcblx0Y29uc3QgZGVlcCA9IGt3QXJncy5kZWVwO1xuXHRjb25zdCBpbmhlcml0ZWQgPSBrd0FyZ3MuaW5oZXJpdGVkO1xuXHRjb25zdCB0YXJnZXQ6IGFueSA9IGt3QXJncy50YXJnZXQ7XG5cdGNvbnN0IGNvcGllZCA9IGt3QXJncy5jb3BpZWQgfHwgW107XG5cdGNvbnN0IGNvcGllZENsb25lID0gWyAuLi5jb3BpZWQgXTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGt3QXJncy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgc291cmNlID0ga3dBcmdzLnNvdXJjZXNbaV07XG5cblx0XHRpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Zm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0aWYgKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuXHRcdFx0XHRsZXQgdmFsdWU6IGFueSA9IHNvdXJjZVtrZXldO1xuXG5cdFx0XHRcdGlmIChjb3BpZWRDbG9uZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkZWVwKSB7XG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGNvcHlBcnJheSh2YWx1ZSwgaW5oZXJpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoc2hvdWxkRGVlcENvcHlPYmplY3QodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXRWYWx1ZTogYW55ID0gdGFyZ2V0W2tleV0gfHwge307XG5cdFx0XHRcdFx0XHRjb3BpZWQucHVzaChzb3VyY2UpO1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBfbWl4aW4oe1xuXHRcdFx0XHRcdFx0XHRkZWVwOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRpbmhlcml0ZWQ6IGluaGVyaXRlZCxcblx0XHRcdFx0XHRcdFx0c291cmNlczogWyB2YWx1ZSBdLFxuXHRcdFx0XHRcdFx0XHR0YXJnZXQ6IHRhcmdldFZhbHVlLFxuXHRcdFx0XHRcdFx0XHRjb3BpZWRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXRba2V5XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiA8VCZVPiB0YXJnZXQ7XG59XG5cbmludGVyZmFjZSBPYmplY3RBc3NpZ25Db25zdHJ1Y3RvciBleHRlbmRzIE9iamVjdENvbnN0cnVjdG9yIHtcblx0YXNzaWduPFQsIFU+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5cdGFzc2lnbjxULCBVMSwgVTI+KHRhcmdldDogVCwgc291cmNlMTogVTEsIHNvdXJjZTI6IFUyKTogVCAmIFUxICYgVTI7XG5cdGFzc2lnbjxULCBVMSwgVTIsIFUzPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUxLCBzb3VyY2UyOiBVMiwgc291cmNlMzogVTMpOiBUICYgVTEgJiBVMiAmIFUzO1xuXHRhc3NpZ24odGFyZ2V0OiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSwgYW5kIGNvcGllcyBhbGwgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZVxuICogc291cmNlIG9iamVjdHMgdG8gdGhlIG5ld2x5IGNyZWF0ZWQgdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gcHJvdG90eXBlIFRoZSBwcm90b3R5cGUgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBmcm9tXG4gKiBAcGFyYW0gbWl4aW5zIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBjcmVhdGVkIG9iamVjdFxuICogQHJldHVybiBUaGUgbmV3IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30sIFogZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogViwgbWl4aW4zOiBXLCBtaXhpbjQ6IFgsIG1peGluNTogWSwgbWl4aW42OiBaKTogVCAmIFUgJiBWICYgVyAmIFggJiBZICYgWjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogViwgbWl4aW4zOiBXLCBtaXhpbjQ6IFgsIG1peGluNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW4xOiBVLCBtaXhpbjI6IFYsIG1peGluMzogVywgbWl4aW40OiBYKTogVCAmIFUgJiBWICYgVyAmIFg7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogViwgbWl4aW4zOiBXKTogVCAmIFUgJiBWICYgVztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4ocHJvdG90eXBlOiBULCBtaXhpbjE6IFUsIG1peGluMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHByb3RvdHlwZTogVCwgbWl4aW46IFUpOiBUICYgVTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIHt9Pihwcm90b3R5cGU6IFQpOiBUO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGU6IGFueSwgLi4ubWl4aW5zOiBhbnlbXSk6IGFueSB7XG5cdGlmICghbWl4aW5zLmxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdsYW5nLmNyZWF0ZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgbWl4aW4gb2JqZWN0LicpO1xuXHR9XG5cblx0Y29uc3QgYXJncyA9IG1peGlucy5zbGljZSgpO1xuXHRhcmdzLnVuc2hpZnQoT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpKTtcblxuXHRyZXR1cm4gYXNzaWduLmFwcGx5KG51bGwsIGFyZ3MpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZSB0YXJnZXQgb2JqZWN0LFxuICogcmVjdXJzaXZlbHkgY29weWluZyBhbGwgbmVzdGVkIG9iamVjdHMgYW5kIGFycmF5cyBhcyB3ZWxsLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gcmVjZWl2ZSB2YWx1ZXMgZnJvbSBzb3VyY2Ugb2JqZWN0c1xuICogQHBhcmFtIHNvdXJjZXMgQW55IG51bWJlciBvZiBvYmplY3RzIHdob3NlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIHRhcmdldCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fSwgWiBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgsIHNvdXJjZTU6IFksIHNvdXJjZTY6IFopOiBUICYgVSAmIFYgJiBXICYgWCAmIFkgJiBaO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCk6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBBc3NpZ248VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBhbnkge1xuXHRyZXR1cm4gX21peGluKHtcblx0XHRkZWVwOiB0cnVlLFxuXHRcdGluaGVyaXRlZDogZmFsc2UsXG5cdFx0c291cmNlczogc291cmNlcyxcblx0XHR0YXJnZXQ6IHRhcmdldFxuXHR9KTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBhbGwgZW51bWVyYWJsZSAob3duIG9yIGluaGVyaXRlZCkgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIHRhcmdldCBvYmplY3QsIHJlY3Vyc2l2ZWx5IGNvcHlpbmcgYWxsIG5lc3RlZCBvYmplY3RzIGFuZCBhcnJheXMgYXMgd2VsbC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIHJlY2VpdmUgdmFsdWVzIGZyb20gc291cmNlIG9iamVjdHNcbiAqIEBwYXJhbSBzb3VyY2VzIEFueSBudW1iZXIgb2Ygb2JqZWN0cyB3aG9zZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIHRhcmdldCBvYmplY3RcbiAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSwgc291cmNlNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9LCBZIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSk6IFQgJiBVICYgViAmIFcgJiBYICYgWTtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCk6IFQgJiBVICYgViAmIFcgJiBYO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVyk6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlOiBVKTogVCAmIFU7XG5leHBvcnQgZnVuY3Rpb24gZGVlcE1peGluKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IHRydWUsXG5cdFx0aW5oZXJpdGVkOiB0cnVlLFxuXHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0dGFyZ2V0OiB0YXJnZXRcblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cbiAqXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGU8VCBleHRlbmRzIHt9Pihzb3VyY2U6IFQpOiBUIHtcblx0Y29uc3QgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XG5cblx0cmV0dXJuIGRlZXBNaXhpbih0YXJnZXQsIHNvdXJjZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBhIEZpcnN0IHZhbHVlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSBiIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWU7IGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGljYWwoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIGEgPT09IGIgfHxcblx0XHQvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXG5cdFx0KGEgIT09IGEgJiYgYiAhPT0gYik7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYmluZHMgYSBtZXRob2QgdG8gdGhlIHNwZWNpZmllZCBvYmplY3QgYXQgcnVudGltZS4gVGhpcyBpcyBzaW1pbGFyIHRvXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cbiAqIEFzIGEgcmVzdWx0LCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgYnkgYGxhdGVCaW5kYCB3aWxsIGFsd2F5cyBjYWxsIHRoZSBmdW5jdGlvbiBjdXJyZW50bHkgYXNzaWduZWQgdG9cbiAqIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgb24gdGhlIG9iamVjdCBhcyBvZiB0aGUgbW9tZW50IHRoZSBmdW5jdGlvbiBpdCByZXR1cm5zIGlzIGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGNvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbWV0aG9kIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgb24gdGhlIGNvbnRleHQgb2JqZWN0IHRvIGJpbmQgdG8gaXRzZWxmXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXRlQmluZChpbnN0YW5jZToge30sIG1ldGhvZDogc3RyaW5nLCAuLi5zdXBwbGllZEFyZ3M6IGFueVtdKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gc3VwcGxpZWRBcmdzLmxlbmd0aCA/XG5cdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc3QgYXJnczogYW55W10gPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuXG5cdFx0XHQvLyBUUzcwMTdcblx0XHRcdHJldHVybiAoPGFueT4gaW5zdGFuY2UpW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIFRTNzAxN1xuXHRcdFx0cmV0dXJuICg8YW55PiBpbnN0YW5jZSlbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcblx0XHR9O1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGFsbCBlbnVtZXJhYmxlIChvd24gb3IgaW5oZXJpdGVkKSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIFRoZSBtb2RpZmllZCB0YXJnZXQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30sIFggZXh0ZW5kcyB7fSwgWSBleHRlbmRzIHt9LCBaIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVywgc291cmNlNDogWCwgc291cmNlNTogWSwgc291cmNlNjogWik6IFQgJiBVICYgViAmIFcgJiBYICYgWSAmIFo7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fSwgVyBleHRlbmRzIHt9LCBYIGV4dGVuZHMge30sIFkgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWLCBzb3VyY2UzOiBXLCBzb3VyY2U0OiBYLCBzb3VyY2U1OiBZKTogVCAmIFUgJiBWICYgVyAmIFggJiBZO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9LCBWIGV4dGVuZHMge30sIFcgZXh0ZW5kcyB7fSwgWCBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcsIHNvdXJjZTQ6IFgpOiBUICYgVSAmIFYgJiBXICYgWDtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbjxUIGV4dGVuZHMge30sIFUgZXh0ZW5kcyB7fSwgViBleHRlbmRzIHt9LCBXIGV4dGVuZHMge30+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogViwgc291cmNlMzogVyk6IFQgJiBVICYgViAmIFc7XG5leHBvcnQgZnVuY3Rpb24gbWl4aW48VCBleHRlbmRzIHt9LCBVIGV4dGVuZHMge30sIFYgZXh0ZW5kcyB7fT4odGFyZ2V0OiBULCBzb3VyY2UxOiBVLCBzb3VyY2UyOiBWKTogVCAmIFUgJiBWO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluPFQgZXh0ZW5kcyB7fSwgVSBleHRlbmRzIHt9Pih0YXJnZXQ6IFQsIHNvdXJjZTogVSk6IFQgJiBVO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG5cdHJldHVybiBfbWl4aW4oe1xuXHRcdGRlZXA6IGZhbHNlLFxuXHRcdGluaGVyaXRlZDogdHJ1ZSxcblx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdHRhcmdldDogdGFyZ2V0XG5cdH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB3aGljaCBpbnZva2VzIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIGl0cyBhcmd1bWVudCBsaXN0LlxuICogTGlrZSBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgZG9lcyBub3QgYWx0ZXIgZXhlY3V0aW9uIGNvbnRleHQuXG4gKlxuICogQHBhcmFtIHRhcmdldEZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0aGF0IG5lZWRzIHRvIGJlIGJvdW5kXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRoZSBgdGFyZ2V0RnVuY3Rpb25gIGFyZ3VtZW50cyBsaXN0XG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFydGlhbCh0YXJnZXRGdW5jdGlvbjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIC4uLnN1cHBsaWVkQXJnczogYW55W10pOiAoLi4uYXJnczogYW55W10pID0+IGFueSB7XG5cdHJldHVybiBmdW5jdGlvbiAodGhpczogYW55KSB7XG5cdFx0Y29uc3QgYXJnczogYW55W10gPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xuXG5cdFx0cmV0dXJuIHRhcmdldEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBkZXN0cm95IG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgY2FsbHMgdGhlIHBhc3NlZC1pbiBkZXN0cnVjdG9yLlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcbiAqIGV2ZW50IGxpc3RlbmVycywgdGltZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGRlc3RydWN0b3I6ICgpID0+IHZvaWQpOiBIYW5kbGUge1xuXHRyZXR1cm4ge1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uICh0aGlzOiBIYW5kbGUpIHtcblx0XHRcdHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0ZGVzdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlcyBBbiBhcnJheSBvZiBoYW5kbGVzIHdpdGggYGRlc3Ryb3lgIG1ldGhvZHNcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSguLi5oYW5kbGVzOiBIYW5kbGVbXSk6IEhhbmRsZSB7XG5cdHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aGFuZGxlc1tpXS5kZXN0cm95KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsYW5nLnRzIiwiaW1wb3J0IGhhcywgeyBhZGQgfSBmcm9tICdAZG9qby9oYXMvaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi4vZ2xvYmFsJztcblxuZXhwb3J0IGRlZmF1bHQgaGFzO1xuZXhwb3J0ICogZnJvbSAnQGRvam8vaGFzL2hhcyc7XG5cbi8qIEVDTUFTY3JpcHQgNiBhbmQgNyBGZWF0dXJlcyAqL1xuXG4vKiBBcnJheSAqL1xuYWRkKFxuXHQnZXM2LWFycmF5Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiAoXG5cdFx0XHRbJ2Zyb20nLCAnb2YnXS5ldmVyeSgoa2V5KSA9PiBrZXkgaW4gZ2xvYmFsLkFycmF5KSAmJlxuXHRcdFx0WydmaW5kSW5kZXgnLCAnZmluZCcsICdjb3B5V2l0aGluJ10uZXZlcnkoKGtleSkgPT4ga2V5IGluIGdsb2JhbC5BcnJheS5wcm90b3R5cGUpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LWFycmF5LWZpbGwnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKCdmaWxsJyBpbiBnbG9iYWwuQXJyYXkucHJvdG90eXBlKSB7XG5cdFx0XHQvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cblx0XHRcdHJldHVybiAoPGFueT5bMV0pLmZpbGwoOSwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKVswXSA9PT0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoJ2VzNy1hcnJheScsICgpID0+ICdpbmNsdWRlcycgaW4gZ2xvYmFsLkFycmF5LnByb3RvdHlwZSwgdHJ1ZSk7XG5cbi8qIE1hcCAqL1xuYWRkKFxuXHQnZXM2LW1hcCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5NYXAgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdC8qXG5cdFx0SUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eVxuXHRcdFdlIHdyYXAgdGhpcyBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIHNvbWV0aW1lcyB0aGUgTWFwIGNvbnN0cnVjdG9yIGV4aXN0cywgYnV0IGRvZXMgbm90XG5cdFx0dGFrZSBhcmd1bWVudHMgKGlPUyA4LjQpXG5cdFx0ICovXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBtYXAgPSBuZXcgZ2xvYmFsLk1hcChbWzAsIDFdXSk7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRtYXAuaGFzKDApICYmXG5cdFx0XHRcdFx0dHlwZW9mIG1hcC5rZXlzID09PSAnZnVuY3Rpb24nICYmXG5cdFx0XHRcdFx0aGFzKCdlczYtc3ltYm9sJykgJiZcblx0XHRcdFx0XHR0eXBlb2YgbWFwLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdFx0XHRcdHR5cGVvZiBtYXAuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogbm90IHRlc3Rpbmcgb24gaU9TIGF0IHRoZSBtb21lbnQgKi9cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE1hdGggKi9cbmFkZChcblx0J2VzNi1tYXRoJyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnY2x6MzInLFxuXHRcdFx0J3NpZ24nLFxuXHRcdFx0J2xvZzEwJyxcblx0XHRcdCdsb2cyJyxcblx0XHRcdCdsb2cxcCcsXG5cdFx0XHQnZXhwbTEnLFxuXHRcdFx0J2Nvc2gnLFxuXHRcdFx0J3NpbmgnLFxuXHRcdFx0J3RhbmgnLFxuXHRcdFx0J2Fjb3NoJyxcblx0XHRcdCdhc2luaCcsXG5cdFx0XHQnYXRhbmgnLFxuXHRcdFx0J3RydW5jJyxcblx0XHRcdCdmcm91bmQnLFxuXHRcdFx0J2NicnQnLFxuXHRcdFx0J2h5cG90J1xuXHRcdF0uZXZlcnkoKG5hbWUpID0+IHR5cGVvZiBnbG9iYWwuTWF0aFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzNi1tYXRoLWltdWwnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKCdpbXVsJyBpbiBnbG9iYWwuTWF0aCkge1xuXHRcdFx0LyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgb24gaW9zIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xuXHRcdFx0cmV0dXJuICg8YW55Pk1hdGgpLmltdWwoMHhmZmZmZmZmZiwgNSkgPT09IC01O1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE9iamVjdCAqL1xuYWRkKFxuXHQnZXM2LW9iamVjdCcsXG5cdCgpID0+IHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0aGFzKCdlczYtc3ltYm9sJykgJiZcblx0XHRcdFsnYXNzaWduJywgJ2lzJywgJ2dldE93blByb3BlcnR5U3ltYm9scycsICdzZXRQcm90b3R5cGVPZiddLmV2ZXJ5KFxuXHRcdFx0XHQobmFtZSkgPT4gdHlwZW9mIGdsb2JhbC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbidcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG5hZGQoXG5cdCdlczIwMTctb2JqZWN0Jyxcblx0KCkgPT4ge1xuXHRcdHJldHVybiBbJ3ZhbHVlcycsICdlbnRyaWVzJywgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcnMnXS5ldmVyeShcblx0XHRcdChuYW1lKSA9PiB0eXBlb2YgZ2xvYmFsLk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdCk7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE9ic2VydmFibGUgKi9cbmFkZCgnZXMtb2JzZXJ2YWJsZScsICgpID0+IHR5cGVvZiBnbG9iYWwuT2JzZXJ2YWJsZSAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xuXG4vKiBQcm9taXNlICovXG5hZGQoJ2VzNi1wcm9taXNlJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5Qcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBoYXMoJ2VzNi1zeW1ib2wnKSwgdHJ1ZSk7XG5cbi8qIFNldCAqL1xuYWRkKFxuXHQnZXM2LXNldCcsXG5cdCgpID0+IHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbC5TZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgU2V0IGZ1bmN0aW9uYWxpdHkgKi9cblx0XHRcdGNvbnN0IHNldCA9IG5ldyBnbG9iYWwuU2V0KFsxXSk7XG5cdFx0XHRyZXR1cm4gc2V0LmhhcygxKSAmJiAna2V5cycgaW4gc2V0ICYmIHR5cGVvZiBzZXQua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiBoYXMoJ2VzNi1zeW1ib2wnKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBTdHJpbmcgKi9cbmFkZChcblx0J2VzNi1zdHJpbmcnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFtcblx0XHRcdFx0Lyogc3RhdGljIG1ldGhvZHMgKi9cblx0XHRcdFx0J2Zyb21Db2RlUG9pbnQnXG5cdFx0XHRdLmV2ZXJ5KChrZXkpID0+IHR5cGVvZiBnbG9iYWwuU3RyaW5nW2tleV0gPT09ICdmdW5jdGlvbicpICYmXG5cdFx0XHRbXG5cdFx0XHRcdC8qIGluc3RhbmNlIG1ldGhvZHMgKi9cblx0XHRcdFx0J2NvZGVQb2ludEF0Jyxcblx0XHRcdFx0J25vcm1hbGl6ZScsXG5cdFx0XHRcdCdyZXBlYXQnLFxuXHRcdFx0XHQnc3RhcnRzV2l0aCcsXG5cdFx0XHRcdCdlbmRzV2l0aCcsXG5cdFx0XHRcdCdpbmNsdWRlcydcblx0XHRcdF0uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpXG5cdFx0KTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuYWRkKFxuXHQnZXM2LXN0cmluZy1yYXcnLFxuXHQoKSA9PiB7XG5cdFx0ZnVuY3Rpb24gZ2V0Q2FsbFNpdGUoY2FsbFNpdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gWy4uLmNhbGxTaXRlXTtcblx0XHRcdChyZXN1bHQgYXMgYW55KS5yYXcgPSBjYWxsU2l0ZS5yYXc7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGlmICgncmF3JyBpbiBnbG9iYWwuU3RyaW5nKSB7XG5cdFx0XHRsZXQgYiA9IDE7XG5cdFx0XHRsZXQgY2FsbFNpdGUgPSBnZXRDYWxsU2l0ZWBhXFxuJHtifWA7XG5cblx0XHRcdChjYWxsU2l0ZSBhcyBhbnkpLnJhdyA9IFsnYVxcXFxuJ107XG5cdFx0XHRjb25zdCBzdXBwb3J0c1RydW5jID0gZ2xvYmFsLlN0cmluZy5yYXcoY2FsbFNpdGUsIDQyKSA9PT0gJ2E6XFxcXG4nO1xuXG5cdFx0XHRyZXR1cm4gc3VwcG9ydHNUcnVuYztcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbmFkZChcblx0J2VzMjAxNy1zdHJpbmcnLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIFsncGFkU3RhcnQnLCAncGFkRW5kJ10uZXZlcnkoKGtleSkgPT4gdHlwZW9mIGdsb2JhbC5TdHJpbmcucHJvdG90eXBlW2tleV0gPT09ICdmdW5jdGlvbicpO1xuXHR9LFxuXHR0cnVlXG4pO1xuXG4vKiBTeW1ib2wgKi9cbmFkZCgnZXM2LXN5bWJvbCcsICgpID0+IHR5cGVvZiBnbG9iYWwuU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnLCB0cnVlKTtcblxuLyogV2Vha01hcCAqL1xuYWRkKFxuXHQnZXM2LXdlYWttYXAnLFxuXHQoKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWwuV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgTWFwIGZ1bmN0aW9uYWxpdHkgKi9cblx0XHRcdGNvbnN0IGtleTEgPSB7fTtcblx0XHRcdGNvbnN0IGtleTIgPSB7fTtcblx0XHRcdGNvbnN0IG1hcCA9IG5ldyBnbG9iYWwuV2Vha01hcChbW2tleTEsIDFdXSk7XG5cdFx0XHRPYmplY3QuZnJlZXplKGtleTEpO1xuXHRcdFx0cmV0dXJuIG1hcC5nZXQoa2V5MSkgPT09IDEgJiYgbWFwLnNldChrZXkyLCAyKSA9PT0gbWFwICYmIGhhcygnZXM2LXN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdHRydWVcbik7XG5cbi8qIE1pc2NlbGxhbmVvdXMgZmVhdHVyZXMgKi9cbmFkZCgnbWljcm90YXNrcycsICgpID0+IGhhcygnZXM2LXByb21pc2UnKSB8fCBoYXMoJ2hvc3Qtbm9kZScpIHx8IGhhcygnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKSwgdHJ1ZSk7XG5hZGQoXG5cdCdwb3N0bWVzc2FnZScsXG5cdCgpID0+IHtcblx0XHQvLyBJZiB3aW5kb3cgaXMgdW5kZWZpbmVkLCBhbmQgd2UgaGF2ZSBwb3N0TWVzc2FnZSwgaXQgcHJvYmFibHkgbWVhbnMgd2UncmUgaW4gYSB3ZWIgd29ya2VyLiBXZWIgd29ya2VycyBoYXZlXG5cdFx0Ly8gcG9zdCBtZXNzYWdlIGJ1dCBpdCBkb2Vzbid0IHdvcmsgaG93IHdlIGV4cGVjdCBpdCB0bywgc28gaXQncyBiZXN0IGp1c3QgdG8gcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuXHRcdHJldHVybiB0eXBlb2YgZ2xvYmFsLndpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGdsb2JhbC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcblx0fSxcblx0dHJ1ZVxuKTtcbmFkZCgncmFmJywgKCkgPT4gdHlwZW9mIGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicsIHRydWUpO1xuYWRkKCdzZXRpbW1lZGlhdGUnLCAoKSA9PiB0eXBlb2YgZ2xvYmFsLnNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcsIHRydWUpO1xuXG4vKiBET00gRmVhdHVyZXMgKi9cblxuYWRkKFxuXHQnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLFxuXHQoKSA9PiB7XG5cdFx0aWYgKGhhcygnaG9zdC1icm93c2VyJykgJiYgQm9vbGVhbihnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcikpIHtcblx0XHRcdC8vIElFMTEgaGFzIGFuIHVucmVsaWFibGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiB3aGVyZSBzZXRQcm9wZXJ0eSgpIGRvZXMgbm90XG5cdFx0XHQvLyBnZW5lcmF0ZSBhIG11dGF0aW9uIGV2ZW50LCBvYnNlcnZlcnMgY2FuIGNyYXNoLCBhbmQgdGhlIHF1ZXVlIGRvZXMgbm90IGRyYWluXG5cdFx0XHQvLyByZWxpYWJseS4gVGhlIGZvbGxvd2luZyBmZWF0dXJlIHRlc3Qgd2FzIGFkYXB0ZWQgZnJvbVxuXHRcdFx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdDEwa28vNGFjZWI4YzcxNjgxZmRiMjc1ZTMzZWZlNWU1NzZiMTRcblx0XHRcdGNvbnN0IGV4YW1wbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXG5cdFx0XHRjb25zdCBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oKSB7fSk7XG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKGV4YW1wbGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuXHRcdFx0ZXhhbXBsZS5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihvYnNlcnZlci50YWtlUmVjb3JkcygpLmxlbmd0aCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0dHJ1ZVxuKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBoYXMudHMiLCJpbXBvcnQgeyBpc0FycmF5TGlrZSwgSXRlcmFibGUsIEl0ZXJhYmxlSXRlcmF0b3IsIFNoaW1JdGVyYXRvciB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpcyBhcyBvYmplY3RJcyB9IGZyb20gJy4vb2JqZWN0JztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgJy4vU3ltYm9sJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXA8SywgVj4ge1xuXHQvKipcblx0ICogRGVsZXRlcyBhbGwga2V5cyBhbmQgdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMuXG5cdCAqL1xuXHRjbGVhcigpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBEZWxldGVzIGEgZ2l2ZW4ga2V5IGFuZCBpdHMgYXNzb2NpYXRlZCB2YWx1ZS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGRlbGV0ZVxuXHQgKiBAcmV0dXJuIHRydWUgaWYgdGhlIGtleSBleGlzdHMsIGZhbHNlIGlmIGl0IGRvZXMgbm90XG5cdCAqL1xuXHRkZWxldGUoa2V5OiBLKTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBpdGVyYXRvciB0aGF0IHlpZWxkcyBlYWNoIGtleS92YWx1ZSBwYWlyIGFzIGFuIGFycmF5LlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGl0ZXJhdG9yIGZvciBlYWNoIGtleS92YWx1ZSBwYWlyIGluIHRoZSBpbnN0YW5jZS5cblx0ICovXG5cdGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+O1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyBhIGdpdmVuIGZ1bmN0aW9uIGZvciBlYWNoIG1hcCBlbnRyeS4gVGhlIGZ1bmN0aW9uXG5cdCAqIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBlbGVtZW50IHZhbHVlLCB0aGVcblx0ICogZWxlbWVudCBrZXksIGFuZCB0aGUgYXNzb2NpYXRlZCBNYXAgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBjYWxsYmFja2ZuIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGZvciBlYWNoIG1hcCBlbnRyeSxcblx0ICogQHBhcmFtIHRoaXNBcmcgVGhlIHZhbHVlIHRvIHVzZSBmb3IgYHRoaXNgIGZvciBlYWNoIGV4ZWN1dGlvbiBvZiB0aGUgY2FsYmFja1xuXHQgKi9cblx0Zm9yRWFjaChjYWxsYmFja2ZuOiAodmFsdWU6IFYsIGtleTogSywgbWFwOiBNYXA8SywgVj4pID0+IHZvaWQsIHRoaXNBcmc/OiBhbnkpOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBsb29rIHVwXG5cdCAqIEByZXR1cm4gVGhlIHZhbHVlIGlmIG9uZSBleGlzdHMgb3IgdW5kZWZpbmVkXG5cdCAqL1xuXHRnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBpdGVyYXRvciB0aGF0IHlpZWxkcyBlYWNoIGtleSBpbiB0aGUgbWFwLlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdGhlIGluc3RhbmNlJ3Mga2V5cy5cblx0ICovXG5cdGtleXMoKTogSXRlcmFibGVJdGVyYXRvcjxLPjtcblxuXHQvKipcblx0ICogQ2hlY2tzIGZvciB0aGUgcHJlc2VuY2Ugb2YgYSBnaXZlbiBrZXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBrZXkgVGhlIGtleSB0byBjaGVjayBmb3Jcblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBrZXkgZXhpc3RzLCBmYWxzZSBpZiBpdCBkb2VzIG5vdFxuXHQgKi9cblx0aGFzKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGtleS5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUga2V5IHRvIGRlZmluZSBhIHZhbHVlIHRvXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduXG5cdCAqIEByZXR1cm4gVGhlIE1hcCBpbnN0YW5jZVxuXHQgKi9cblx0c2V0KGtleTogSywgdmFsdWU6IFYpOiB0aGlzO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Yga2V5IC8gdmFsdWUgcGFpcnMgaW4gdGhlIE1hcC5cblx0ICovXG5cdHJlYWRvbmx5IHNpemU6IG51bWJlcjtcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBpdGVyYXRvciB0aGF0IHlpZWxkcyBlYWNoIHZhbHVlIGluIHRoZSBtYXAuXG5cdCAqXG5cdCAqIEByZXR1cm4gQW4gaXRlcmF0b3IgY29udGFpbmluZyB0aGUgaW5zdGFuY2UncyB2YWx1ZXMuXG5cdCAqL1xuXHR2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxWPjtcblxuXHQvKiogUmV0dXJucyBhbiBpdGVyYWJsZSBvZiBlbnRyaWVzIGluIHRoZSBtYXAuICovXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8W0ssIFZdPjtcblxuXHRyZWFkb25seSBbU3ltYm9sLnRvU3RyaW5nVGFnXTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcENvbnN0cnVjdG9yIHtcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTWFwXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0bmV3ICgpOiBNYXA8YW55LCBhbnk+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1hcFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhdG9yXG5cdCAqIEFycmF5IG9yIGl0ZXJhdG9yIGNvbnRhaW5pbmcgdHdvLWl0ZW0gdHVwbGVzIHVzZWQgdG8gaW5pdGlhbGx5IHBvcHVsYXRlIHRoZSBtYXAuXG5cdCAqIFRoZSBmaXJzdCBpdGVtIGluIGVhY2ggdHVwbGUgY29ycmVzcG9uZHMgdG8gdGhlIGtleSBvZiB0aGUgbWFwIGVudHJ5LlxuXHQgKiBUaGUgc2Vjb25kIGl0ZW0gY29ycmVzcG9uZHMgdG8gdGhlIHZhbHVlIG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqL1xuXHRuZXcgPEssIFY+KGl0ZXJhdG9yPzogW0ssIFZdW10pOiBNYXA8SywgVj47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTWFwXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlcmF0b3Jcblx0ICogQXJyYXkgb3IgaXRlcmF0b3IgY29udGFpbmluZyB0d28taXRlbSB0dXBsZXMgdXNlZCB0byBpbml0aWFsbHkgcG9wdWxhdGUgdGhlIG1hcC5cblx0ICogVGhlIGZpcnN0IGl0ZW0gaW4gZWFjaCB0dXBsZSBjb3JyZXNwb25kcyB0byB0aGUga2V5IG9mIHRoZSBtYXAgZW50cnkuXG5cdCAqIFRoZSBzZWNvbmQgaXRlbSBjb3JyZXNwb25kcyB0byB0aGUgdmFsdWUgb2YgdGhlIG1hcCBlbnRyeS5cblx0ICovXG5cdG5ldyA8SywgVj4oaXRlcmF0b3I6IEl0ZXJhYmxlPFtLLCBWXT4pOiBNYXA8SywgVj47XG5cblx0cmVhZG9ubHkgcHJvdG90eXBlOiBNYXA8YW55LCBhbnk+O1xuXG5cdHJlYWRvbmx5IFtTeW1ib2wuc3BlY2llc106IE1hcENvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgbGV0IE1hcDogTWFwQ29uc3RydWN0b3IgPSBnbG9iYWwuTWFwO1xuXG5pZiAoIWhhcygnZXM2LW1hcCcpKSB7XG5cdE1hcCA9IGNsYXNzIE1hcDxLLCBWPiB7XG5cdFx0cHJvdGVjdGVkIHJlYWRvbmx5IF9rZXlzOiBLW10gPSBbXTtcblx0XHRwcm90ZWN0ZWQgcmVhZG9ubHkgX3ZhbHVlczogVltdID0gW107XG5cblx0XHQvKipcblx0XHQgKiBBbiBhbHRlcm5hdGl2ZSB0byBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB1c2luZyBPYmplY3QuaXNcblx0XHQgKiB0byBjaGVjayBmb3IgZXF1YWxpdHkuIFNlZSBodHRwOi8vbXpsLmxhLzF6dUtPMlZcblx0XHQgKi9cblx0XHRwcm90ZWN0ZWQgX2luZGV4T2ZLZXkoa2V5czogS1tdLCBrZXk6IEspOiBudW1iZXIge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKG9iamVjdElzKGtleXNbaV0sIGtleSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBbU3ltYm9sLnNwZWNpZXNdID0gTWFwO1xuXG5cdFx0Y29uc3RydWN0b3IoaXRlcmFibGU/OiBBcnJheUxpa2U8W0ssIFZdPiB8IEl0ZXJhYmxlPFtLLCBWXT4pIHtcblx0XHRcdGlmIChpdGVyYWJsZSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBpdGVyYWJsZVtpXTtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Z2V0IHNpemUoKTogbnVtYmVyIHtcblx0XHRcdHJldHVybiB0aGlzLl9rZXlzLmxlbmd0aDtcblx0XHR9XG5cblx0XHRjbGVhcigpOiB2b2lkIHtcblx0XHRcdHRoaXMuX2tleXMubGVuZ3RoID0gdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlKGtleTogSyk6IGJvb2xlYW4ge1xuXHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XG5cdFx0XHRpZiAoaW5kZXggPCAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2tleXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHRoaXMuX3ZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0ZW50cmllcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFtLLCBWXT4ge1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5fa2V5cy5tYXAoKGtleTogSywgaTogbnVtYmVyKTogW0ssIFZdID0+IHtcblx0XHRcdFx0cmV0dXJuIFtrZXksIHRoaXMuX3ZhbHVlc1tpXV07XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5ldyBTaGltSXRlcmF0b3IodmFsdWVzKTtcblx0XHR9XG5cblx0XHRmb3JFYWNoKGNhbGxiYWNrOiAodmFsdWU6IFYsIGtleTogSywgbWFwSW5zdGFuY2U6IE1hcDxLLCBWPikgPT4gYW55LCBjb250ZXh0Pzoge30pIHtcblx0XHRcdGNvbnN0IGtleXMgPSB0aGlzLl9rZXlzO1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5fdmFsdWVzO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZXNbaV0sIGtleXNbaV0sIHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkIHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xuXHRcdFx0cmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IHRoaXMuX3ZhbHVlc1tpbmRleF07XG5cdFx0fVxuXG5cdFx0aGFzKGtleTogSyk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KSA+IC0xO1xuXHRcdH1cblxuXHRcdGtleXMoKTogSXRlcmFibGVJdGVyYXRvcjxLPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFNoaW1JdGVyYXRvcih0aGlzLl9rZXlzKTtcblx0XHR9XG5cblx0XHRzZXQoa2V5OiBLLCB2YWx1ZTogVik6IE1hcDxLLCBWPiB7XG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XG5cdFx0XHRpbmRleCA9IGluZGV4IDwgMCA/IHRoaXMuX2tleXMubGVuZ3RoIDogaW5kZXg7XG5cdFx0XHR0aGlzLl9rZXlzW2luZGV4XSA9IGtleTtcblx0XHRcdHRoaXMuX3ZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdHZhbHVlcygpOiBJdGVyYWJsZUl0ZXJhdG9yPFY+IHtcblx0XHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKHRoaXMuX3ZhbHVlcyk7XG5cdFx0fVxuXG5cdFx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxbSywgVl0+IHtcblx0XHRcdHJldHVybiB0aGlzLmVudHJpZXMoKTtcblx0XHR9XG5cblx0XHRbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ01hcCcgPSAnTWFwJztcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIE1hcC50cyIsImltcG9ydCB7IFRoZW5hYmxlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgcXVldWVNaWNyb1Rhc2sgfSBmcm9tICcuL3N1cHBvcnQvcXVldWUnO1xuaW1wb3J0IHsgSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCAnLi9TeW1ib2wnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcblxuLyoqXG4gKiBFeGVjdXRvciBpcyB0aGUgaW50ZXJmYWNlIGZvciBmdW5jdGlvbnMgdXNlZCB0byBpbml0aWFsaXplIGEgUHJvbWlzZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeGVjdXRvcjxUPiB7XG5cdC8qKlxuXHQgKiBUaGUgZXhlY3V0b3IgZm9yIHRoZSBwcm9taXNlXG5cdCAqXG5cdCAqIEBwYXJhbSByZXNvbHZlIFRoZSByZXNvbHZlciBjYWxsYmFjayBvZiB0aGUgcHJvbWlzZVxuXHQgKiBAcGFyYW0gcmVqZWN0IFRoZSByZWplY3RvciBjYWxsYmFjayBvZiB0aGUgcHJvbWlzZVxuXHQgKi9cblx0KHJlc29sdmU6ICh2YWx1ZT86IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZXhwb3J0IGxldCBTaGltUHJvbWlzZTogdHlwZW9mIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxuZXhwb3J0IGNvbnN0IGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlPFQ+KHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBQcm9taXNlTGlrZTxUPiB7XG5cdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cbmlmICghaGFzKCdlczYtcHJvbWlzZScpKSB7XG5cdGNvbnN0IGVudW0gU3RhdGUge1xuXHRcdEZ1bGZpbGxlZCxcblx0XHRQZW5kaW5nLFxuXHRcdFJlamVjdGVkXG5cdH1cblxuXHRnbG9iYWwuUHJvbWlzZSA9IFNoaW1Qcm9taXNlID0gY2xhc3MgUHJvbWlzZTxUPiBpbXBsZW1lbnRzIFRoZW5hYmxlPFQ+IHtcblx0XHRzdGF0aWMgYWxsKGl0ZXJhYmxlOiBJdGVyYWJsZTxhbnkgfCBQcm9taXNlTGlrZTxhbnk+PiB8IChhbnkgfCBQcm9taXNlTGlrZTxhbnk+KVtdKTogUHJvbWlzZTxhbnk+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRsZXQgY29tcGxldGUgPSAwO1xuXHRcdFx0XHRsZXQgdG90YWwgPSAwO1xuXHRcdFx0XHRsZXQgcG9wdWxhdGluZyA9IHRydWU7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZnVsZmlsbChpbmRleDogbnVtYmVyLCB2YWx1ZTogYW55KTogdm9pZCB7XG5cdFx0XHRcdFx0dmFsdWVzW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdCsrY29tcGxldGU7XG5cdFx0XHRcdFx0ZmluaXNoKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBmaW5pc2goKTogdm9pZCB7XG5cdFx0XHRcdFx0aWYgKHBvcHVsYXRpbmcgfHwgY29tcGxldGUgPCB0b3RhbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKHZhbHVlcyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBwcm9jZXNzSXRlbShpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpOiB2b2lkIHtcblx0XHRcdFx0XHQrK3RvdGFsO1xuXHRcdFx0XHRcdGlmIChpc1RoZW5hYmxlKGl0ZW0pKSB7XG5cdFx0XHRcdFx0XHQvLyBJZiBhbiBpdGVtIFByb21pc2UgcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cblx0XHRcdFx0XHRcdC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXG5cdFx0XHRcdFx0XHRpdGVtLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSwgcmVqZWN0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0UHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGkgPSAwO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG5cdFx0XHRcdFx0cHJvY2Vzc0l0ZW0oaSwgdmFsdWUpO1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fVxuXHRcdFx0XHRwb3B1bGF0aW5nID0gZmFsc2U7XG5cblx0XHRcdFx0ZmluaXNoKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgcmFjZTxUPihpdGVyYWJsZTogSXRlcmFibGU8VCB8IFByb21pc2VMaWtlPFQ+PiB8IChUIHwgUHJvbWlzZUxpa2U8VD4pW10pOiBQcm9taXNlPFRbXT4ge1xuXHRcdFx0cmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlc29sdmU6ICh2YWx1ZT86IGFueSkgPT4gdm9pZCwgcmVqZWN0KSB7XG5cdFx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdGlmIChpdGVtIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0XHRcdFx0Ly8gSWYgYSBQcm9taXNlIGl0ZW0gcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cblx0XHRcdFx0XHRcdC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXG5cdFx0XHRcdFx0XHRpdGVtLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0UHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4ocmVzb2x2ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgcmVqZWN0KHJlYXNvbj86IGFueSk6IFByb21pc2U8bmV2ZXI+IHtcblx0XHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0cmVqZWN0KHJlYXNvbik7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRzdGF0aWMgcmVzb2x2ZSgpOiBQcm9taXNlPHZvaWQ+O1xuXHRcdHN0YXRpYyByZXNvbHZlPFQ+KHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pOiBQcm9taXNlPFQ+O1xuXHRcdHN0YXRpYyByZXNvbHZlPFQ+KHZhbHVlPzogYW55KTogUHJvbWlzZTxUPiB7XG5cdFx0XHRyZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzb2x2ZSkge1xuXHRcdFx0XHRyZXNvbHZlKDxUPnZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHN0YXRpYyBbU3ltYm9sLnNwZWNpZXNdOiBQcm9taXNlQ29uc3RydWN0b3IgPSBTaGltUHJvbWlzZSBhcyBQcm9taXNlQ29uc3RydWN0b3I7XG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGVzIGEgbmV3IFByb21pc2UuXG5cdFx0ICpcblx0XHQgKiBAY29uc3RydWN0b3Jcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBleGVjdXRvclxuXHRcdCAqIFRoZSBleGVjdXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgd2hlbiB0aGUgUHJvbWlzZSBpcyBpbnN0YW50aWF0ZWQuIEl0IGlzIHJlc3BvbnNpYmxlIGZvclxuXHRcdCAqIHN0YXJ0aW5nIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoZW4gaXQgaXMgaW52b2tlZC5cblx0XHQgKlxuXHRcdCAqIFRoZSBleGVjdXRvciBtdXN0IGNhbGwgZWl0aGVyIHRoZSBwYXNzZWQgYHJlc29sdmVgIGZ1bmN0aW9uIHdoZW4gdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZFxuXHRcdCAqIHN1Y2Nlc3NmdWxseSwgb3IgdGhlIGByZWplY3RgIGZ1bmN0aW9uIHdoZW4gdGhlIG9wZXJhdGlvbiBmYWlscy5cblx0XHQgKi9cblx0XHRjb25zdHJ1Y3RvcihleGVjdXRvcjogRXhlY3V0b3I8VD4pIHtcblx0XHRcdC8qKlxuXHRcdFx0ICogSWYgdHJ1ZSwgdGhlIHJlc29sdXRpb24gb2YgdGhpcyBwcm9taXNlIGlzIGNoYWluZWQgKFwibG9ja2VkIGluXCIpIHRvIGFub3RoZXIgcHJvbWlzZS5cblx0XHRcdCAqL1xuXHRcdFx0bGV0IGlzQ2hhaW5lZCA9IGZhbHNlO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIFdoZXRoZXIgb3Igbm90IHRoaXMgcHJvbWlzZSBpcyBpbiBhIHJlc29sdmVkIHN0YXRlLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBpc1Jlc29sdmVkID0gKCk6IGJvb2xlYW4gPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zdGF0ZSAhPT0gU3RhdGUuUGVuZGluZyB8fCBpc0NoYWluZWQ7XG5cdFx0XHR9O1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIENhbGxiYWNrcyB0aGF0IHNob3VsZCBiZSBpbnZva2VkIG9uY2UgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cblx0XHRcdCAqL1xuXHRcdFx0bGV0IGNhbGxiYWNrczogbnVsbCB8IChBcnJheTwoKSA9PiB2b2lkPikgPSBbXTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJbml0aWFsbHkgcHVzaGVzIGNhbGxiYWNrcyBvbnRvIGEgcXVldWUgZm9yIGV4ZWN1dGlvbiBvbmNlIHRoaXMgcHJvbWlzZSBzZXR0bGVzLiBBZnRlciB0aGUgcHJvbWlzZSBzZXR0bGVzLFxuXHRcdFx0ICogZW5xdWV1ZXMgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgZXZlbnQgbG9vcCB0dXJuLlxuXHRcdFx0ICovXG5cdFx0XHRsZXQgd2hlbkZpbmlzaGVkID0gZnVuY3Rpb24oY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcblx0XHRcdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBTZXR0bGVzIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqL1xuXHRcdFx0Y29uc3Qgc2V0dGxlID0gKG5ld1N0YXRlOiBTdGF0ZSwgdmFsdWU6IGFueSk6IHZvaWQgPT4ge1xuXHRcdFx0XHQvLyBBIHByb21pc2UgY2FuIG9ubHkgYmUgc2V0dGxlZCBvbmNlLlxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZSAhPT0gU3RhdGUuUGVuZGluZykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcblx0XHRcdFx0dGhpcy5yZXNvbHZlZFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdHdoZW5GaW5pc2hlZCA9IHF1ZXVlTWljcm9UYXNrO1xuXG5cdFx0XHRcdC8vIE9ubHkgZW5xdWV1ZSBhIGNhbGxiYWNrIHJ1bm5lciBpZiB0aGVyZSBhcmUgY2FsbGJhY2tzIHNvIHRoYXQgaW5pdGlhbGx5IGZ1bGZpbGxlZCBQcm9taXNlcyBkb24ndCBoYXZlIHRvXG5cdFx0XHRcdC8vIHdhaXQgYW4gZXh0cmEgdHVybi5cblx0XHRcdFx0aWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHF1ZXVlTWljcm9UYXNrKGZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdFx0XHRsZXQgY291bnQgPSBjYWxsYmFja3MubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3NbaV0uY2FsbChudWxsKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIFJlc29sdmVzIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0XHQgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgcmVzb2x2ZSA9IChuZXdTdGF0ZTogU3RhdGUsIHZhbHVlOiBhbnkpOiB2b2lkID0+IHtcblx0XHRcdFx0aWYgKGlzUmVzb2x2ZWQoKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpc1RoZW5hYmxlKHZhbHVlKSkge1xuXHRcdFx0XHRcdHZhbHVlLnRoZW4oc2V0dGxlLmJpbmQobnVsbCwgU3RhdGUuRnVsZmlsbGVkKSwgc2V0dGxlLmJpbmQobnVsbCwgU3RhdGUuUmVqZWN0ZWQpKTtcblx0XHRcdFx0XHRpc0NoYWluZWQgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNldHRsZShuZXdTdGF0ZSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnRoZW4gPSA8VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcblx0XHRcdFx0b25GdWxmaWxsZWQ/OiAoKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPikgfCB1bmRlZmluZWQgfCBudWxsLFxuXHRcdFx0XHRvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pIHwgdW5kZWZpbmVkIHwgbnVsbFxuXHRcdFx0KTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiA9PiB7XG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0Ly8gd2hlbkZpbmlzaGVkIGluaXRpYWxseSBxdWV1ZXMgdXAgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gYWZ0ZXIgdGhlIHByb21pc2UgaGFzIHNldHRsZWQuIE9uY2UgdGhlXG5cdFx0XHRcdFx0Ly8gcHJvbWlzZSBoYXMgc2V0dGxlZCwgd2hlbkZpbmlzaGVkIHdpbGwgc2NoZWR1bGUgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gb24gdGhlIG5leHQgdHVybiB0aHJvdWdoIHRoZVxuXHRcdFx0XHRcdC8vIGV2ZW50IGxvb3AuXG5cdFx0XHRcdFx0d2hlbkZpbmlzaGVkKCgpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrOiAoKHZhbHVlPzogYW55KSA9PiBhbnkpIHwgdW5kZWZpbmVkIHwgbnVsbCA9XG5cdFx0XHRcdFx0XHRcdHRoaXMuc3RhdGUgPT09IFN0YXRlLlJlamVjdGVkID8gb25SZWplY3RlZCA6IG9uRnVsZmlsbGVkO1xuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjYWxsYmFjayh0aGlzLnJlc29sdmVkVmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUgPT09IFN0YXRlLlJlamVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdCh0aGlzLnJlc29sdmVkVmFsdWUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLnJlc29sdmVkVmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGV4ZWN1dG9yKHJlc29sdmUuYmluZChudWxsLCBTdGF0ZS5GdWxmaWxsZWQpLCByZXNvbHZlLmJpbmQobnVsbCwgU3RhdGUuUmVqZWN0ZWQpKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHNldHRsZShTdGF0ZS5SZWplY3RlZCwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNhdGNoPFRSZXN1bHQgPSBuZXZlcj4oXG5cdFx0XHRvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdCB8IFByb21pc2VMaWtlPFRSZXN1bHQ+KSB8IHVuZGVmaW5lZCB8IG51bGxcblx0XHQpOiBQcm9taXNlPFQgfCBUUmVzdWx0PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyBwcm9taXNlLlxuXHRcdCAqL1xuXHRcdHByaXZhdGUgc3RhdGUgPSBTdGF0ZS5QZW5kaW5nO1xuXG5cdFx0LyoqXG5cdFx0ICogVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSB7VHxhbnl9XG5cdFx0ICovXG5cdFx0cHJpdmF0ZSByZXNvbHZlZFZhbHVlOiBhbnk7XG5cblx0XHR0aGVuOiA8VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcblx0XHRcdG9uZnVsZmlsbGVkPzogKCh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pIHwgdW5kZWZpbmVkIHwgbnVsbCxcblx0XHRcdG9ucmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPikgfCB1bmRlZmluZWQgfCBudWxsXG5cdFx0KSA9PiBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xuXG5cdFx0W1N5bWJvbC50b1N0cmluZ1RhZ106ICdQcm9taXNlJyA9ICdQcm9taXNlJztcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpbVByb21pc2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUHJvbWlzZS50cyIsImltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGdldFZhbHVlRGVzY3JpcHRvciB9IGZyb20gJy4vc3VwcG9ydC91dGlsJztcblxuZGVjbGFyZSBnbG9iYWwge1xuXHRpbnRlcmZhY2UgU3ltYm9sQ29uc3RydWN0b3Ige1xuXHRcdG9ic2VydmFibGU6IHN5bWJvbDtcblx0fVxufVxuXG5leHBvcnQgbGV0IFN5bWJvbDogU3ltYm9sQ29uc3RydWN0b3IgPSBnbG9iYWwuU3ltYm9sO1xuXG5pZiAoIWhhcygnZXM2LXN5bWJvbCcpKSB7XG5cdC8qKlxuXHQgKiBUaHJvd3MgaWYgdGhlIHZhbHVlIGlzIG5vdCBhIHN5bWJvbCwgdXNlZCBpbnRlcm5hbGx5IHdpdGhpbiB0aGUgU2hpbVxuXHQgKiBAcGFyYW0gIHthbnl9ICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xuXHQgKiBAcmV0dXJuIHtzeW1ib2x9ICAgICAgIFJldHVybnMgdGhlIHN5bWJvbCBvciB0aHJvd3Ncblx0ICovXG5cdGNvbnN0IHZhbGlkYXRlU3ltYm9sID0gZnVuY3Rpb24gdmFsaWRhdGVTeW1ib2wodmFsdWU6IGFueSk6IHN5bWJvbCB7XG5cdFx0aWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodmFsdWUgKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cblx0Y29uc3QgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuXHRjb25zdCBkZWZpbmVQcm9wZXJ0eTogKFxuXHRcdG86IGFueSxcblx0XHRwOiBzdHJpbmcgfCBzeW1ib2wsXG5cdFx0YXR0cmlidXRlczogUHJvcGVydHlEZXNjcmlwdG9yICYgVGhpc1R5cGU8YW55PlxuXHQpID0+IGFueSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBhcyBhbnk7XG5cdGNvbnN0IGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cblx0Y29uc3Qgb2JqUHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcblxuXHRjb25zdCBnbG9iYWxTeW1ib2xzOiB7IFtrZXk6IHN0cmluZ106IHN5bWJvbCB9ID0ge307XG5cblx0Y29uc3QgZ2V0U3ltYm9sTmFtZSA9IChmdW5jdGlvbigpIHtcblx0XHRjb25zdCBjcmVhdGVkID0gY3JlYXRlKG51bGwpO1xuXHRcdHJldHVybiBmdW5jdGlvbihkZXNjOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuXHRcdFx0bGV0IHBvc3RmaXggPSAwO1xuXHRcdFx0bGV0IG5hbWU6IHN0cmluZztcblx0XHRcdHdoaWxlIChjcmVhdGVkW1N0cmluZyhkZXNjKSArIChwb3N0Zml4IHx8ICcnKV0pIHtcblx0XHRcdFx0Kytwb3N0Zml4O1xuXHRcdFx0fVxuXHRcdFx0ZGVzYyArPSBTdHJpbmcocG9zdGZpeCB8fCAnJyk7XG5cdFx0XHRjcmVhdGVkW2Rlc2NdID0gdHJ1ZTtcblx0XHRcdG5hbWUgPSAnQEAnICsgZGVzYztcblxuXHRcdFx0Ly8gRklYTUU6IFRlbXBvcmFyeSBndWFyZCB1bnRpbCB0aGUgZHVwbGljYXRlIGV4ZWN1dGlvbiB3aGVuIHRlc3RpbmcgY2FuIGJlXG5cdFx0XHQvLyBwaW5uZWQgZG93bi5cblx0XHRcdGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmpQcm90b3R5cGUsIG5hbWUpKSB7XG5cdFx0XHRcdGRlZmluZVByb3BlcnR5KG9ialByb3RvdHlwZSwgbmFtZSwge1xuXHRcdFx0XHRcdHNldDogZnVuY3Rpb24odGhpczogU3ltYm9sLCB2YWx1ZTogYW55KSB7XG5cdFx0XHRcdFx0XHRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9O1xuXHR9KSgpO1xuXG5cdGNvbnN0IEludGVybmFsU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKHRoaXM6IGFueSwgZGVzY3JpcHRpb24/OiBzdHJpbmcgfCBudW1iZXIpOiBzeW1ib2wge1xuXHRcdGlmICh0aGlzIGluc3RhbmNlb2YgSW50ZXJuYWxTeW1ib2wpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdFx0fVxuXHRcdHJldHVybiBTeW1ib2woZGVzY3JpcHRpb24pO1xuXHR9O1xuXG5cdFN5bWJvbCA9IGdsb2JhbC5TeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2wodGhpczogU3ltYm9sLCBkZXNjcmlwdGlvbj86IHN0cmluZyB8IG51bWJlcik6IHN5bWJvbCB7XG5cdFx0aWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdFx0fVxuXHRcdGNvbnN0IHN5bSA9IE9iamVjdC5jcmVhdGUoSW50ZXJuYWxTeW1ib2wucHJvdG90eXBlKTtcblx0XHRkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgPyAnJyA6IFN0cmluZyhkZXNjcmlwdGlvbik7XG5cdFx0cmV0dXJuIGRlZmluZVByb3BlcnRpZXMoc3ltLCB7XG5cdFx0XHRfX2Rlc2NyaXB0aW9uX186IGdldFZhbHVlRGVzY3JpcHRvcihkZXNjcmlwdGlvbiksXG5cdFx0XHRfX25hbWVfXzogZ2V0VmFsdWVEZXNjcmlwdG9yKGdldFN5bWJvbE5hbWUoZGVzY3JpcHRpb24pKVxuXHRcdH0pO1xuXHR9IGFzIFN5bWJvbENvbnN0cnVjdG9yO1xuXG5cdC8qIERlY29yYXRlIHRoZSBTeW1ib2wgZnVuY3Rpb24gd2l0aCB0aGUgYXBwcm9wcmlhdGUgcHJvcGVydGllcyAqL1xuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRTeW1ib2wsXG5cdFx0J2ZvcicsXG5cdFx0Z2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKGtleTogc3RyaW5nKTogc3ltYm9sIHtcblx0XHRcdGlmIChnbG9iYWxTeW1ib2xzW2tleV0pIHtcblx0XHRcdFx0cmV0dXJuIGdsb2JhbFN5bWJvbHNba2V5XTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAoZ2xvYmFsU3ltYm9sc1trZXldID0gU3ltYm9sKFN0cmluZyhrZXkpKSk7XG5cdFx0fSlcblx0KTtcblx0ZGVmaW5lUHJvcGVydGllcyhTeW1ib2wsIHtcblx0XHRrZXlGb3I6IGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbihzeW06IHN5bWJvbCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdFx0XHRsZXQga2V5OiBzdHJpbmc7XG5cdFx0XHR2YWxpZGF0ZVN5bWJvbChzeW0pO1xuXHRcdFx0Zm9yIChrZXkgaW4gZ2xvYmFsU3ltYm9scykge1xuXHRcdFx0XHRpZiAoZ2xvYmFsU3ltYm9sc1trZXldID09PSBzeW0pIHtcblx0XHRcdFx0XHRyZXR1cm4ga2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSksXG5cdFx0aGFzSW5zdGFuY2U6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdGlzQ29uY2F0U3ByZWFkYWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ2lzQ29uY2F0U3ByZWFkYWJsZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdGl0ZXJhdG9yOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcignaXRlcmF0b3InKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRtYXRjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0b2JzZXJ2YWJsZTogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ29ic2VydmFibGUnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHRyZXBsYWNlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigncmVwbGFjZScpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNlYXJjaDogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3NlYXJjaCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHNwZWNpZXM6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzcGVjaWVzJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0c3BsaXQ6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCdzcGxpdCcpLCBmYWxzZSwgZmFsc2UpLFxuXHRcdHRvUHJpbWl0aXZlOiBnZXRWYWx1ZURlc2NyaXB0b3IoU3ltYm9sLmZvcigndG9QcmltaXRpdmUnKSwgZmFsc2UsIGZhbHNlKSxcblx0XHR0b1N0cmluZ1RhZzogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3IoJ3RvU3RyaW5nVGFnJyksIGZhbHNlLCBmYWxzZSksXG5cdFx0dW5zY29wYWJsZXM6IGdldFZhbHVlRGVzY3JpcHRvcihTeW1ib2wuZm9yKCd1bnNjb3BhYmxlcycpLCBmYWxzZSwgZmFsc2UpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBJbnRlcm5hbFN5bWJvbCBvYmplY3QgKi9cblx0ZGVmaW5lUHJvcGVydGllcyhJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsIHtcblx0XHRjb25zdHJ1Y3RvcjogZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbCksXG5cdFx0dG9TdHJpbmc6IGdldFZhbHVlRGVzY3JpcHRvcihcblx0XHRcdGZ1bmN0aW9uKHRoaXM6IHsgX19uYW1lX186IHN0cmluZyB9KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9fbmFtZV9fO1xuXHRcdFx0fSxcblx0XHRcdGZhbHNlLFxuXHRcdFx0ZmFsc2Vcblx0XHQpXG5cdH0pO1xuXG5cdC8qIERlY29yYXRlIHRoZSBTeW1ib2wucHJvdG90eXBlICovXG5cdGRlZmluZVByb3BlcnRpZXMoU3ltYm9sLnByb3RvdHlwZSwge1xuXHRcdHRvU3RyaW5nOiBnZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24odGhpczogU3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gJ1N5bWJvbCAoJyArICg8YW55PnZhbGlkYXRlU3ltYm9sKHRoaXMpKS5fX2Rlc2NyaXB0aW9uX18gKyAnKSc7XG5cdFx0fSksXG5cdFx0dmFsdWVPZjogZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uKHRoaXM6IFN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpO1xuXHRcdH0pXG5cdH0pO1xuXG5cdGRlZmluZVByb3BlcnR5KFxuXHRcdFN5bWJvbC5wcm90b3R5cGUsXG5cdFx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbih0aGlzOiBTeW1ib2wpIHtcblx0XHRcdHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTtcblx0XHR9KVxuXHQpO1xuXHRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIGdldFZhbHVlRGVzY3JpcHRvcignU3ltYm9sJywgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XG5cblx0ZGVmaW5lUHJvcGVydHkoXG5cdFx0SW50ZXJuYWxTeW1ib2wucHJvdG90eXBlLFxuXHRcdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XHRnZXRWYWx1ZURlc2NyaXB0b3IoKDxhbnk+U3ltYm9sKS5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKVxuXHQpO1xuXHRkZWZpbmVQcm9wZXJ0eShcblx0XHRJbnRlcm5hbFN5bWJvbC5wcm90b3R5cGUsXG5cdFx0U3ltYm9sLnRvU3RyaW5nVGFnLFxuXHRcdGdldFZhbHVlRGVzY3JpcHRvcigoPGFueT5TeW1ib2wpLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddLCBmYWxzZSwgZmFsc2UsIHRydWUpXG5cdCk7XG59XG5cbi8qKlxuICogQSBjdXN0b20gZ3VhcmQgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIGlmIGFuIG9iamVjdCBpcyBhIHN5bWJvbCBvciBub3RcbiAqIEBwYXJhbSAge2FueX0gICAgICAgdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyBhIHN5bWJvbCBvciBub3RcbiAqIEByZXR1cm4ge2lzIHN5bWJvbH0gICAgICAgUmV0dXJucyB0cnVlIGlmIGEgc3ltYm9sIG9yIG5vdCAoYW5kIG5hcnJvd3MgdGhlIHR5cGUgZ3VhcmQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZTogYW55KTogdmFsdWUgaXMgc3ltYm9sIHtcblx0cmV0dXJuICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyB8fCB2YWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykpIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIEZpbGwgYW55IG1pc3Npbmcgd2VsbCBrbm93biBzeW1ib2xzIGlmIHRoZSBuYXRpdmUgU3ltYm9sIGlzIG1pc3NpbmcgdGhlbVxuICovXG5bXG5cdCdoYXNJbnN0YW5jZScsXG5cdCdpc0NvbmNhdFNwcmVhZGFibGUnLFxuXHQnaXRlcmF0b3InLFxuXHQnc3BlY2llcycsXG5cdCdyZXBsYWNlJyxcblx0J3NlYXJjaCcsXG5cdCdzcGxpdCcsXG5cdCdtYXRjaCcsXG5cdCd0b1ByaW1pdGl2ZScsXG5cdCd0b1N0cmluZ1RhZycsXG5cdCd1bnNjb3BhYmxlcycsXG5cdCdvYnNlcnZhYmxlJ1xuXS5mb3JFYWNoKCh3ZWxsS25vd24pID0+IHtcblx0aWYgKCEoU3ltYm9sIGFzIGFueSlbd2VsbEtub3duXSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2wsIHdlbGxLbm93biwgZ2V0VmFsdWVEZXNjcmlwdG9yKFN5bWJvbC5mb3Iod2VsbEtub3duKSwgZmFsc2UsIGZhbHNlKSk7XG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2w7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gU3ltYm9sLnRzIiwiaW1wb3J0IGdsb2JhbCBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSwgSXRlcmFibGUgfSBmcm9tICcuL2l0ZXJhdG9yJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgJy4vU3ltYm9sJztcblxuZXhwb3J0IGludGVyZmFjZSBXZWFrTWFwPEsgZXh0ZW5kcyBvYmplY3QsIFY+IHtcblx0LyoqXG5cdCAqIFJlbW92ZSBhIGBrZXlgIGZyb20gdGhlIG1hcFxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gcmVtb3ZlXG5cdCAqIEByZXR1cm4gYHRydWVgIGlmIHRoZSB2YWx1ZSB3YXMgcmVtb3ZlZCwgb3RoZXJ3aXNlIGBmYWxzZWBcblx0ICovXG5cdGRlbGV0ZShrZXk6IEspOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSB0aGUgdmFsdWUsIGJhc2VkIG9uIHRoZSBzdXBwbGllZCBga2V5YFxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBrZXkgdG8gcmV0cmlldmUgdGhlIGB2YWx1ZWAgZm9yXG5cdCAqIEByZXR1cm4gdGhlIGB2YWx1ZWAgYmFzZWQgb24gdGhlIGBrZXlgIGlmIGZvdW5kLCBvdGhlcndpc2UgYGZhbHNlYFxuXHQgKi9cblx0Z2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgaWYgYSBga2V5YCBpcyBwcmVzZW50IGluIHRoZSBtYXBcblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUgYGtleWAgdG8gY2hlY2tcblx0ICogQHJldHVybiBgdHJ1ZWAgaWYgdGhlIGtleSBpcyBwYXJ0IG9mIHRoZSBtYXAsIG90aGVyd2lzZSBgZmFsc2VgLlxuXHQgKi9cblx0aGFzKGtleTogSyk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFNldCBhIGB2YWx1ZWAgZm9yIGEgcGFydGljdWxhciBga2V5YC5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUgYGtleWAgdG8gc2V0IHRoZSBgdmFsdWVgIGZvclxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIGB2YWx1ZWAgdG8gc2V0XG5cdCAqIEByZXR1cm4gdGhlIGluc3RhbmNlc1xuXHQgKi9cblx0c2V0KGtleTogSywgdmFsdWU6IFYpOiB0aGlzO1xuXG5cdHJlYWRvbmx5IFtTeW1ib2wudG9TdHJpbmdUYWddOiAnV2Vha01hcCc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Vha01hcENvbnN0cnVjdG9yIHtcblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGBXZWFrTWFwYFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdG5ldyAoKTogV2Vha01hcDxvYmplY3QsIGFueT47XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGBXZWFrTWFwYFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhYmxlIEFuIGl0ZXJhYmxlIHRoYXQgY29udGFpbnMgeWllbGRzIHVwIGtleS92YWx1ZSBwYWlyIGVudHJpZXNcblx0ICovXG5cdG5ldyA8SyBleHRlbmRzIG9iamVjdCwgVj4oaXRlcmFibGU/OiBbSywgVl1bXSk6IFdlYWtNYXA8SywgVj47XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGBXZWFrTWFwYFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHBhcmFtIGl0ZXJhYmxlIEFuIGl0ZXJhYmxlIHRoYXQgY29udGFpbnMgeWllbGRzIHVwIGtleS92YWx1ZSBwYWlyIGVudHJpZXNcblx0ICovXG5cdG5ldyA8SyBleHRlbmRzIG9iamVjdCwgVj4oaXRlcmFibGU6IEl0ZXJhYmxlPFtLLCBWXT4pOiBXZWFrTWFwPEssIFY+O1xuXG5cdHJlYWRvbmx5IHByb3RvdHlwZTogV2Vha01hcDxvYmplY3QsIGFueT47XG59XG5cbmV4cG9ydCBsZXQgV2Vha01hcDogV2Vha01hcENvbnN0cnVjdG9yID0gZ2xvYmFsLldlYWtNYXA7XG5cbmludGVyZmFjZSBFbnRyeTxLLCBWPiB7XG5cdGtleTogSztcblx0dmFsdWU6IFY7XG59XG5cbmlmICghaGFzKCdlczYtd2Vha21hcCcpKSB7XG5cdGNvbnN0IERFTEVURUQ6IGFueSA9IHt9O1xuXG5cdGNvbnN0IGdldFVJRCA9IGZ1bmN0aW9uIGdldFVJRCgpOiBudW1iZXIge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApO1xuXHR9O1xuXG5cdGNvbnN0IGdlbmVyYXRlTmFtZSA9IChmdW5jdGlvbigpIHtcblx0XHRsZXQgc3RhcnRJZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAlIDEwMDAwMDAwMCk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKCk6IHN0cmluZyB7XG5cdFx0XHRyZXR1cm4gJ19fd20nICsgZ2V0VUlEKCkgKyAoc3RhcnRJZCsrICsgJ19fJyk7XG5cdFx0fTtcblx0fSkoKTtcblxuXHRXZWFrTWFwID0gY2xhc3MgV2Vha01hcDxLLCBWPiB7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX2Zyb3plbkVudHJpZXM6IEVudHJ5PEssIFY+W107XG5cblx0XHRjb25zdHJ1Y3RvcihpdGVyYWJsZT86IEFycmF5TGlrZTxbSywgVl0+IHwgSXRlcmFibGU8W0ssIFZdPikge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbmFtZScsIHtcblx0XHRcdFx0dmFsdWU6IGdlbmVyYXRlTmFtZSgpXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5fZnJvemVuRW50cmllcyA9IFtdO1xuXG5cdFx0XHRpZiAoaXRlcmFibGUpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVyYWJsZVtpXTtcblx0XHRcdFx0XHRcdHRoaXMuc2V0KGl0ZW1bMF0sIGl0ZW1bMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBpdGVyYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0RnJvemVuRW50cnlJbmRleChrZXk6IGFueSk6IG51bWJlciB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Zyb3plbkVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHRoaXMuX2Zyb3plbkVudHJpZXNbaV0ua2V5ID09PSBrZXkpIHtcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlKGtleTogYW55KTogYm9vbGVhbiB7XG5cdFx0XHRpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZW50cnk6IEVudHJ5PEssIFY+ID0ga2V5W3RoaXMuX25hbWVdO1xuXHRcdFx0aWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEKSB7XG5cdFx0XHRcdGVudHJ5LnZhbHVlID0gREVMRVRFRDtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xuXHRcdFx0aWYgKGZyb3plbkluZGV4ID49IDApIHtcblx0XHRcdFx0dGhpcy5fZnJvemVuRW50cmllcy5zcGxpY2UoZnJvemVuSW5kZXgsIDEpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGdldChrZXk6IGFueSk6IFYgfCB1bmRlZmluZWQge1xuXHRcdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURUQpIHtcblx0XHRcdFx0cmV0dXJuIGVudHJ5LnZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcblx0XHRcdGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9mcm96ZW5FbnRyaWVzW2Zyb3plbkluZGV4XS52YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRoYXMoa2V5OiBhbnkpOiBib29sZWFuIHtcblx0XHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbnRyeTogRW50cnk8SywgVj4gPSBrZXlbdGhpcy5fbmFtZV07XG5cdFx0XHRpZiAoQm9vbGVhbihlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xuXHRcdFx0aWYgKGZyb3plbkluZGV4ID49IDApIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRzZXQoa2V5OiBhbnksIHZhbHVlPzogYW55KTogdGhpcyB7XG5cdFx0XHRpZiAoIWtleSB8fCAodHlwZW9mIGtleSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJykpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB2YWx1ZSB1c2VkIGFzIHdlYWsgbWFwIGtleScpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IGVudHJ5OiBFbnRyeTxLLCBWPiA9IGtleVt0aGlzLl9uYW1lXTtcblx0XHRcdGlmICghZW50cnkgfHwgZW50cnkua2V5ICE9PSBrZXkpIHtcblx0XHRcdFx0ZW50cnkgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcblx0XHRcdFx0XHRrZXk6IHsgdmFsdWU6IGtleSB9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChPYmplY3QuaXNGcm96ZW4oa2V5KSkge1xuXHRcdFx0XHRcdHRoaXMuX2Zyb3plbkVudHJpZXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGtleSwgdGhpcy5fbmFtZSwge1xuXHRcdFx0XHRcdFx0dmFsdWU6IGVudHJ5XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVudHJ5LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRbU3ltYm9sLnRvU3RyaW5nVGFnXTogJ1dlYWtNYXAnID0gJ1dlYWtNYXAnO1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBXZWFrTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFdlYWtNYXAudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlLCBpc0l0ZXJhYmxlLCBJdGVyYWJsZSB9IGZyb20gJy4vaXRlcmF0b3InO1xuaW1wb3J0IHsgTUFYX1NBRkVfSU5URUdFUiB9IGZyb20gJy4vbnVtYmVyJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgeyB3cmFwTmF0aXZlIH0gZnJvbSAnLi9zdXBwb3J0L3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcENhbGxiYWNrPFQsIFU+IHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBtYXBwaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIG1hcHBlZFxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGVsZW1lbnRcblx0ICovXG5cdChlbGVtZW50OiBULCBpbmRleDogbnVtYmVyKTogVTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaW5kQ2FsbGJhY2s8VD4ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHVzaW5nIGZpbmRcblx0ICpcblx0ICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCBpcyBjdXJyZW50eSBiZWluZyBhbmFseXNlZFxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGVsZW1lbnQgdGhhdCBpcyBiZWluZyBhbmFseXNlZFxuXHQgKiBAcGFyYW0gYXJyYXkgVGhlIHNvdXJjZSBhcnJheVxuXHQgKi9cblx0KGVsZW1lbnQ6IFQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBBcnJheUxpa2U8VD4pOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgV3JpdGFibGVBcnJheUxpa2U8VD4ge1xuXHRyZWFkb25seSBsZW5ndGg6IG51bWJlcjtcblx0W246IG51bWJlcl06IFQ7XG59XG5cbi8qIEVTNiBBcnJheSBzdGF0aWMgbWV0aG9kcyAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEZyb20ge1xuXHQvKipcblx0ICogVGhlIEFycmF5LmZyb20oKSBtZXRob2QgY3JlYXRlcyBhIG5ldyBBcnJheSBpbnN0YW5jZSBmcm9tIGFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc291cmNlIEFuIGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYW4gYXJyYXlcblx0ICogQHBhcmFtIG1hcEZ1bmN0aW9uIEEgbWFwIGZ1bmN0aW9uIHRvIGNhbGwgb24gZWFjaCBlbGVtZW50IGluIHRoZSBhcnJheVxuXHQgKiBAcGFyYW0gdGhpc0FyZyBUaGUgZXhlY3V0aW9uIGNvbnRleHQgZm9yIHRoZSBtYXAgZnVuY3Rpb25cblx0ICogQHJldHVybiBUaGUgbmV3IEFycmF5XG5cdCAqL1xuXHQ8VCwgVT4oc291cmNlOiBBcnJheUxpa2U8VD4gfCBJdGVyYWJsZTxUPiwgbWFwRnVuY3Rpb246IE1hcENhbGxiYWNrPFQsIFU+LCB0aGlzQXJnPzogYW55KTogQXJyYXk8VT47XG5cblx0LyoqXG5cdCAqIFRoZSBBcnJheS5mcm9tKCkgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgQXJyYXkgaW5zdGFuY2UgZnJvbSBhbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZSBBbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5XG5cdCAqIEByZXR1cm4gVGhlIG5ldyBBcnJheVxuXHQgKi9cblx0PFQ+KHNvdXJjZTogQXJyYXlMaWtlPFQ+IHwgSXRlcmFibGU8VD4pOiBBcnJheTxUPjtcbn1cblxuZXhwb3J0IGxldCBmcm9tOiBGcm9tO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgZnJvbSB0aGUgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0gYXJndW1lbnRzIEFueSBudW1iZXIgb2YgYXJndW1lbnRzIGZvciB0aGUgYXJyYXlcbiAqIEByZXR1cm4gQW4gYXJyYXkgZnJvbSB0aGUgZ2l2ZW4gYXJndW1lbnRzXG4gKi9cbmV4cG9ydCBsZXQgb2Y6IDxUPiguLi5pdGVtczogVFtdKSA9PiBBcnJheTxUPjtcblxuLyogRVM2IEFycmF5IGluc3RhbmNlIG1ldGhvZHMgKi9cblxuLyoqXG4gKiBDb3BpZXMgZGF0YSBpbnRlcm5hbGx5IHdpdGhpbiBhbiBhcnJheSBvciBhcnJheS1saWtlIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBvZmZzZXQgVGhlIGluZGV4IHRvIHN0YXJ0IGNvcHlpbmcgdmFsdWVzIHRvOyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHBhcmFtIHN0YXJ0IFRoZSBmaXJzdCAoaW5jbHVzaXZlKSBpbmRleCB0byBjb3B5OyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHBhcmFtIGVuZCBUaGUgbGFzdCAoZXhjbHVzaXZlKSBpbmRleCB0byBjb3B5OyBpZiBuZWdhdGl2ZSwgaXQgY291bnRzIGJhY2t3YXJkcyBmcm9tIGxlbmd0aFxuICogQHJldHVybiBUaGUgdGFyZ2V0XG4gKi9cbmV4cG9ydCBsZXQgY29weVdpdGhpbjogPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBvZmZzZXQ6IG51bWJlciwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBBcnJheUxpa2U8VD47XG5cbi8qKlxuICogRmlsbHMgZWxlbWVudHMgb2YgYW4gYXJyYXktbGlrZSBvYmplY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCB0byBmaWxsXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgZWFjaCBlbGVtZW50IG9mIHRoZSB0YXJnZXQgd2l0aFxuICogQHBhcmFtIHN0YXJ0IFRoZSBmaXJzdCBpbmRleCB0byBmaWxsXG4gKiBAcGFyYW0gZW5kIFRoZSAoZXhjbHVzaXZlKSBpbmRleCBhdCB3aGljaCB0byBzdG9wIGZpbGxpbmdcbiAqIEByZXR1cm4gVGhlIGZpbGxlZCB0YXJnZXRcbiAqL1xuZXhwb3J0IGxldCBmaWxsOiA8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHZhbHVlOiBULCBzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyKSA9PiBBcnJheUxpa2U8VD47XG5cbi8qKlxuICogRmluZHMgYW5kIHJldHVybnMgdGhlIGZpcnN0IGluc3RhbmNlIG1hdGNoaW5nIHRoZSBjYWxsYmFjayBvciB1bmRlZmluZWQgaWYgb25lIGlzIG5vdCBmb3VuZC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IEFuIGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gY2FsbGJhY2sgQSBmdW5jdGlvbiByZXR1cm5pbmcgaWYgdGhlIGN1cnJlbnQgdmFsdWUgbWF0Y2hlcyBhIGNyaXRlcmlhXG4gKiBAcGFyYW0gdGhpc0FyZyBUaGUgZXhlY3V0aW9uIGNvbnRleHQgZm9yIHRoZSBmaW5kIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIFRoZSBmaXJzdCBlbGVtZW50IG1hdGNoaW5nIHRoZSBjYWxsYmFjaywgb3IgdW5kZWZpbmVkIGlmIG9uZSBkb2VzIG5vdCBleGlzdFxuICovXG5leHBvcnQgbGV0IGZpbmQ6IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgY2FsbGJhY2s6IEZpbmRDYWxsYmFjazxUPiwgdGhpc0FyZz86IHt9KSA9PiBUIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgbGluZWFyIHNlYXJjaCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgaW5kZXggd2hvc2UgdmFsdWUgc2F0aXNmaWVzIHRoZSBwYXNzZWQgY2FsbGJhY2ssXG4gKiBvciAtMSBpZiBubyB2YWx1ZXMgc2F0aXNmeSBpdC5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IEFuIGFycmF5LWxpa2Ugb2JqZWN0XG4gKiBAcGFyYW0gY2FsbGJhY2sgQSBmdW5jdGlvbiByZXR1cm5pbmcgdHJ1ZSBpZiB0aGUgY3VycmVudCB2YWx1ZSBzYXRpc2ZpZXMgaXRzIGNyaXRlcmlhXG4gKiBAcGFyYW0gdGhpc0FyZyBUaGUgZXhlY3V0aW9uIGNvbnRleHQgZm9yIHRoZSBmaW5kIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIFRoZSBmaXJzdCBpbmRleCB3aG9zZSB2YWx1ZSBzYXRpc2ZpZXMgdGhlIHBhc3NlZCBjYWxsYmFjaywgb3IgLTEgaWYgbm8gdmFsdWVzIHNhdGlzZnkgaXRcbiAqL1xuZXhwb3J0IGxldCBmaW5kSW5kZXg6IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgY2FsbGJhY2s6IEZpbmRDYWxsYmFjazxUPiwgdGhpc0FyZz86IHt9KSA9PiBudW1iZXI7XG5cbi8qIEVTNyBBcnJheSBpbnN0YW5jZSBtZXRob2RzICovXG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIGFycmF5IGluY2x1ZGVzIGEgZ2l2ZW4gdmFsdWVcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IHRoZSB0YXJnZXQgYXJyYXktbGlrZSBvYmplY3RcbiAqIEBwYXJhbSBzZWFyY2hFbGVtZW50IHRoZSBpdGVtIHRvIHNlYXJjaCBmb3JcbiAqIEBwYXJhbSBmcm9tSW5kZXggdGhlIHN0YXJ0aW5nIGluZGV4IHRvIHNlYXJjaCBmcm9tXG4gKiBAcmV0dXJuIGB0cnVlYCBpZiB0aGUgYXJyYXkgaW5jbHVkZXMgdGhlIGVsZW1lbnQsIG90aGVyd2lzZSBgZmFsc2VgXG4gKi9cbmV4cG9ydCBsZXQgaW5jbHVkZXM6IDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgc2VhcmNoRWxlbWVudDogVCwgZnJvbUluZGV4PzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG5pZiAoaGFzKCdlczYtYXJyYXknKSAmJiBoYXMoJ2VzNi1hcnJheS1maWxsJykpIHtcblx0ZnJvbSA9IGdsb2JhbC5BcnJheS5mcm9tO1xuXHRvZiA9IGdsb2JhbC5BcnJheS5vZjtcblx0Y29weVdpdGhpbiA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKTtcblx0ZmlsbCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maWxsKTtcblx0ZmluZCA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5maW5kKTtcblx0ZmluZEluZGV4ID0gd3JhcE5hdGl2ZShnbG9iYWwuQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCk7XG59IGVsc2Uge1xuXHQvLyBJdCBpcyBvbmx5IG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaS9pT1MgdGhhdCBoYXZlIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24gYW5kIHNvIGFyZW4ndCBpbiB0aGUgd2lsZFxuXHQvLyBUbyBtYWtlIHRoaW5ncyBlYXNpZXIsIGlmIHRoZXJlIGlzIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24sIHRoZSB3aG9sZSBzZXQgb2YgZnVuY3Rpb25zIHdpbGwgYmUgZmlsbGVkXG5cblx0LyoqXG5cdCAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcblx0ICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcblx0ICovXG5cdGNvbnN0IHRvTGVuZ3RoID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGlmIChpc05hTihsZW5ndGgpKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHRsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcblx0XHRpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuXHRcdFx0bGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xuXHRcdH1cblx0XHQvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxuXHRcdHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBNQVhfU0FGRV9JTlRFR0VSKTtcblx0fTtcblxuXHQvKipcblx0ICogRnJvbSBFUzYgNy4xLjQgVG9JbnRlZ2VyKClcblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgdG8gY29udmVydFxuXHQgKiBAcmV0dXJuIEFuIGludGVnZXJcblx0ICovXG5cdGNvbnN0IHRvSW50ZWdlciA9IGZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZTogYW55KTogbnVtYmVyIHtcblx0XHR2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG5cdFx0aWYgKGlzTmFOKHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdGlmICh2YWx1ZSA9PT0gMCB8fCAhaXNGaW5pdGUodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICh2YWx1ZSA+IDAgPyAxIDogLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBOb3JtYWxpemVzIGFuIG9mZnNldCBhZ2FpbnN0IGEgZ2l2ZW4gbGVuZ3RoLCB3cmFwcGluZyBpdCBpZiBuZWdhdGl2ZS5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBvcmlnaW5hbCBvZmZzZXRcblx0ICogQHBhcmFtIGxlbmd0aCBUaGUgdG90YWwgbGVuZ3RoIHRvIG5vcm1hbGl6ZSBhZ2FpbnN0XG5cdCAqIEByZXR1cm4gSWYgbmVnYXRpdmUsIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIHRoZSBlbmQgKGxlbmd0aCk7IG90aGVyd2lzZSBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSAwXG5cdCAqL1xuXHRjb25zdCBub3JtYWxpemVPZmZzZXQgPSBmdW5jdGlvbiBub3JtYWxpemVPZmZzZXQodmFsdWU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLm1heChsZW5ndGggKyB2YWx1ZSwgMCkgOiBNYXRoLm1pbih2YWx1ZSwgbGVuZ3RoKTtcblx0fTtcblxuXHRmcm9tID0gZnVuY3Rpb24gZnJvbShcblx0XHR0aGlzOiBBcnJheUNvbnN0cnVjdG9yLFxuXHRcdGFycmF5TGlrZTogSXRlcmFibGU8YW55PiB8IEFycmF5TGlrZTxhbnk+LFxuXHRcdG1hcEZ1bmN0aW9uPzogTWFwQ2FsbGJhY2s8YW55LCBhbnk+LFxuXHRcdHRoaXNBcmc/OiBhbnlcblx0KTogQXJyYXk8YW55PiB7XG5cdFx0aWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdmcm9tOiByZXF1aXJlcyBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xuXHRcdH1cblxuXHRcdGlmIChtYXBGdW5jdGlvbiAmJiB0aGlzQXJnKSB7XG5cdFx0XHRtYXBGdW5jdGlvbiA9IG1hcEZ1bmN0aW9uLmJpbmQodGhpc0FyZyk7XG5cdFx0fVxuXG5cdFx0LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cblx0XHRjb25zdCBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cdFx0Y29uc3QgbGVuZ3RoOiBudW1iZXIgPSB0b0xlbmd0aCgoPGFueT5hcnJheUxpa2UpLmxlbmd0aCk7XG5cblx0XHQvLyBTdXBwb3J0IGV4dGVuc2lvblxuXHRcdGNvbnN0IGFycmF5OiBhbnlbXSA9XG5cdFx0XHR0eXBlb2YgQ29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgPyA8YW55W10+T2JqZWN0KG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpKSA6IG5ldyBBcnJheShsZW5ndGgpO1xuXG5cdFx0aWYgKCFpc0FycmF5TGlrZShhcnJheUxpa2UpICYmICFpc0l0ZXJhYmxlKGFycmF5TGlrZSkpIHtcblx0XHRcdHJldHVybiBhcnJheTtcblx0XHR9XG5cblx0XHQvLyBpZiB0aGlzIGlzIGFuIGFycmF5IGFuZCB0aGUgbm9ybWFsaXplZCBsZW5ndGggaXMgMCwganVzdCByZXR1cm4gYW4gZW1wdHkgYXJyYXkuIHRoaXMgcHJldmVudHMgYSBwcm9ibGVtXG5cdFx0Ly8gd2l0aCB0aGUgaXRlcmF0aW9uIG9uIElFIHdoZW4gdXNpbmcgYSBOYU4gYXJyYXkgbGVuZ3RoLlxuXHRcdGlmIChpc0FycmF5TGlrZShhcnJheUxpa2UpKSB7XG5cdFx0XHRpZiAobGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheUxpa2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0YXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKGFycmF5TGlrZVtpXSwgaSkgOiBhcnJheUxpa2VbaV07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBpID0gMDtcblx0XHRcdGZvciAoY29uc3QgdmFsdWUgb2YgYXJyYXlMaWtlKSB7XG5cdFx0XHRcdGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbih2YWx1ZSwgaSkgOiB2YWx1ZTtcblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICgoPGFueT5hcnJheUxpa2UpLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhcnJheS5sZW5ndGggPSBsZW5ndGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFycmF5O1xuXHR9O1xuXG5cdG9mID0gZnVuY3Rpb24gb2Y8VD4oLi4uaXRlbXM6IFRbXSk6IEFycmF5PFQ+IHtcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpO1xuXHR9O1xuXG5cdGNvcHlXaXRoaW4gPSBmdW5jdGlvbiBjb3B5V2l0aGluPFQ+KFxuXHRcdHRhcmdldDogQXJyYXlMaWtlPFQ+LFxuXHRcdG9mZnNldDogbnVtYmVyLFxuXHRcdHN0YXJ0OiBudW1iZXIsXG5cdFx0ZW5kPzogbnVtYmVyXG5cdCk6IEFycmF5TGlrZTxUPiB7XG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdjb3B5V2l0aGluOiB0YXJnZXQgbXVzdCBiZSBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXHRcdG9mZnNldCA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIob2Zmc2V0KSwgbGVuZ3RoKTtcblx0XHRzdGFydCA9IG5vcm1hbGl6ZU9mZnNldCh0b0ludGVnZXIoc3RhcnQpLCBsZW5ndGgpO1xuXHRcdGVuZCA9IG5vcm1hbGl6ZU9mZnNldChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpLCBsZW5ndGgpO1xuXHRcdGxldCBjb3VudCA9IE1hdGgubWluKGVuZCAtIHN0YXJ0LCBsZW5ndGggLSBvZmZzZXQpO1xuXG5cdFx0bGV0IGRpcmVjdGlvbiA9IDE7XG5cdFx0aWYgKG9mZnNldCA+IHN0YXJ0ICYmIG9mZnNldCA8IHN0YXJ0ICsgY291bnQpIHtcblx0XHRcdGRpcmVjdGlvbiA9IC0xO1xuXHRcdFx0c3RhcnQgKz0gY291bnQgLSAxO1xuXHRcdFx0b2Zmc2V0ICs9IGNvdW50IC0gMTtcblx0XHR9XG5cblx0XHR3aGlsZSAoY291bnQgPiAwKSB7XG5cdFx0XHRpZiAoc3RhcnQgaW4gdGFyZ2V0KSB7XG5cdFx0XHRcdCh0YXJnZXQgYXMgV3JpdGFibGVBcnJheUxpa2U8VD4pW29mZnNldF0gPSB0YXJnZXRbc3RhcnRdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlICh0YXJnZXQgYXMgV3JpdGFibGVBcnJheUxpa2U8VD4pW29mZnNldF07XG5cdFx0XHR9XG5cblx0XHRcdG9mZnNldCArPSBkaXJlY3Rpb247XG5cdFx0XHRzdGFydCArPSBkaXJlY3Rpb247XG5cdFx0XHRjb3VudC0tO1xuXHRcdH1cblxuXHRcdHJldHVybiB0YXJnZXQ7XG5cdH07XG5cblx0ZmlsbCA9IGZ1bmN0aW9uIGZpbGw8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIHZhbHVlOiBhbnksIHN0YXJ0PzogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBBcnJheUxpa2U8VD4ge1xuXHRcdGNvbnN0IGxlbmd0aCA9IHRvTGVuZ3RoKHRhcmdldC5sZW5ndGgpO1xuXHRcdGxldCBpID0gbm9ybWFsaXplT2Zmc2V0KHRvSW50ZWdlcihzdGFydCksIGxlbmd0aCk7XG5cdFx0ZW5kID0gbm9ybWFsaXplT2Zmc2V0KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCksIGxlbmd0aCk7XG5cblx0XHR3aGlsZSAoaSA8IGVuZCkge1xuXHRcdFx0KHRhcmdldCBhcyBXcml0YWJsZUFycmF5TGlrZTxUPilbaSsrXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0YXJnZXQ7XG5cdH07XG5cblx0ZmluZCA9IGZ1bmN0aW9uIGZpbmQ8VD4odGFyZ2V0OiBBcnJheUxpa2U8VD4sIGNhbGxiYWNrOiBGaW5kQ2FsbGJhY2s8VD4sIHRoaXNBcmc/OiB7fSk6IFQgfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IGluZGV4ID0gZmluZEluZGV4PFQ+KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuXHRcdHJldHVybiBpbmRleCAhPT0gLTEgPyB0YXJnZXRbaW5kZXhdIDogdW5kZWZpbmVkO1xuXHR9O1xuXG5cdGZpbmRJbmRleCA9IGZ1bmN0aW9uIGZpbmRJbmRleDxUPih0YXJnZXQ6IEFycmF5TGlrZTxUPiwgY2FsbGJhY2s6IEZpbmRDYWxsYmFjazxUPiwgdGhpc0FyZz86IHt9KTogbnVtYmVyIHtcblx0XHRjb25zdCBsZW5ndGggPSB0b0xlbmd0aCh0YXJnZXQubGVuZ3RoKTtcblxuXHRcdGlmICghY2FsbGJhY2spIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2ZpbmQ6IHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHR9XG5cblx0XHRpZiAodGhpc0FyZykge1xuXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXNBcmcpO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChjYWxsYmFjayh0YXJnZXRbaV0sIGksIHRhcmdldCkpIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIC0xO1xuXHR9O1xufVxuXG5pZiAoaGFzKCdlczctYXJyYXknKSkge1xuXHRpbmNsdWRlcyA9IHdyYXBOYXRpdmUoZ2xvYmFsLkFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XG59IGVsc2Uge1xuXHQvKipcblx0ICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxuXHQgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxuXHQgKi9cblx0Y29uc3QgdG9MZW5ndGggPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG5cdFx0bGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG5cdFx0aWYgKGlzTmFOKGxlbmd0aCkpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuXHRcdFx0bGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xuXHRcdH1cblx0XHQvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxuXHRcdHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBNQVhfU0FGRV9JTlRFR0VSKTtcblx0fTtcblxuXHRpbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzPFQ+KHRhcmdldDogQXJyYXlMaWtlPFQ+LCBzZWFyY2hFbGVtZW50OiBULCBmcm9tSW5kZXg6IG51bWJlciA9IDApOiBib29sZWFuIHtcblx0XHRsZXQgbGVuID0gdG9MZW5ndGgodGFyZ2V0Lmxlbmd0aCk7XG5cblx0XHRmb3IgKGxldCBpID0gZnJvbUluZGV4OyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRFbGVtZW50ID0gdGFyZ2V0W2ldO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxuXHRcdFx0XHQoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGFycmF5LnRzIiwiY29uc3QgZ2xvYmFsT2JqZWN0OiBhbnkgPSAoZnVuY3Rpb24oKTogYW55IHtcblx0aWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Ly8gZ2xvYmFsIHNwZWMgZGVmaW5lcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBjYWxsZWQgJ2dsb2JhbCdcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1nbG9iYWxcblx0XHQvLyBgZ2xvYmFsYCBpcyBhbHNvIGRlZmluZWQgaW4gTm9kZUpTXG5cdFx0cmV0dXJuIGdsb2JhbDtcblx0fSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdC8vIHdpbmRvdyBpcyBkZWZpbmVkIGluIGJyb3dzZXJzXG5cdFx0cmV0dXJuIHdpbmRvdztcblx0fSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQvLyBzZWxmIGlzIGRlZmluZWQgaW4gV2ViV29ya2Vyc1xuXHRcdHJldHVybiBzZWxmO1xuXHR9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnbG9iYWxPYmplY3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZ2xvYmFsLnRzIiwiaW1wb3J0ICcuL1N5bWJvbCc7XG5pbXBvcnQgeyBISUdIX1NVUlJPR0FURV9NQVgsIEhJR0hfU1VSUk9HQVRFX01JTiB9IGZyb20gJy4vc3RyaW5nJztcblxuZXhwb3J0IGludGVyZmFjZSBJdGVyYXRvclJlc3VsdDxUPiB7XG5cdHJlYWRvbmx5IGRvbmU6IGJvb2xlYW47XG5cdHJlYWRvbmx5IHZhbHVlOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yPFQ+IHtcblx0bmV4dCh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG5cdHJldHVybj8odmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcblxuXHR0aHJvdz8oZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlPFQ+IHtcblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmFibGVJdGVyYXRvcjxUPiBleHRlbmRzIEl0ZXJhdG9yPFQ+IHtcblx0W1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxUPjtcbn1cblxuY29uc3Qgc3RhdGljRG9uZTogSXRlcmF0b3JSZXN1bHQ8YW55PiA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXG4vKipcbiAqIEEgY2xhc3MgdGhhdCBfc2hpbXNfIGFuIGl0ZXJhdG9yIGludGVyZmFjZSBvbiBhcnJheSBsaWtlIG9iamVjdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaGltSXRlcmF0b3I8VD4ge1xuXHRwcml2YXRlIF9saXN0OiBBcnJheUxpa2U8VD47XG5cdHByaXZhdGUgX25leHRJbmRleCA9IC0xO1xuXHRwcml2YXRlIF9uYXRpdmVJdGVyYXRvcjogSXRlcmF0b3I8VD47XG5cblx0Y29uc3RydWN0b3IobGlzdDogQXJyYXlMaWtlPFQ+IHwgSXRlcmFibGU8VD4pIHtcblx0XHRpZiAoaXNJdGVyYWJsZShsaXN0KSkge1xuXHRcdFx0dGhpcy5fbmF0aXZlSXRlcmF0b3IgPSBsaXN0W1N5bWJvbC5pdGVyYXRvcl0oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fbGlzdCA9IGxpc3Q7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiB0aGUgbmV4dCBpdGVyYXRpb24gcmVzdWx0IGZvciB0aGUgSXRlcmF0b3Jcblx0ICovXG5cdG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuXHRcdGlmICh0aGlzLl9uYXRpdmVJdGVyYXRvcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX25hdGl2ZUl0ZXJhdG9yLm5leHQoKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLl9saXN0KSB7XG5cdFx0XHRyZXR1cm4gc3RhdGljRG9uZTtcblx0XHR9XG5cdFx0aWYgKCsrdGhpcy5fbmV4dEluZGV4IDwgdGhpcy5fbGlzdC5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGRvbmU6IGZhbHNlLFxuXHRcdFx0XHR2YWx1ZTogdGhpcy5fbGlzdFt0aGlzLl9uZXh0SW5kZXhdXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gc3RhdGljRG9uZTtcblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhYmxlSXRlcmF0b3I8VD4ge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbi8qKlxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaGFzIGFuIEl0ZXJhYmxlIGludGVyZmFjZVxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBJdGVyYWJsZTxhbnk+IHtcblx0cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGlzIEFycmF5TGlrZVxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgQXJyYXlMaWtlPGFueT4ge1xuXHRyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgZm9yIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSBpdGVyYWJsZSBUaGUgaXRlcmFibGUgb2JqZWN0IHRvIHJldHVybiB0aGUgaXRlcmF0b3IgZm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXQ8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQ+IHwgQXJyYXlMaWtlPFQ+KTogSXRlcmF0b3I8VD4gfCB1bmRlZmluZWQge1xuXHRpZiAoaXNJdGVyYWJsZShpdGVyYWJsZSkpIHtcblx0XHRyZXR1cm4gaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpO1xuXHR9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xuXHRcdHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKGl0ZXJhYmxlKTtcblx0fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvck9mQ2FsbGJhY2s8VD4ge1xuXHQvKipcblx0ICogQSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgYSBmb3JPZigpIGl0ZXJhdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIGN1cnJlbnQgdmFsdWVcblx0ICogQHBhcmFtIG9iamVjdCBUaGUgb2JqZWN0IGJlaW5nIGl0ZXJhdGVkIG92ZXJcblx0ICogQHBhcmFtIGRvQnJlYWsgQSBmdW5jdGlvbiwgaWYgY2FsbGVkLCB3aWxsIHN0b3AgdGhlIGl0ZXJhdGlvblxuXHQgKi9cblx0KHZhbHVlOiBULCBvYmplY3Q6IEl0ZXJhYmxlPFQ+IHwgQXJyYXlMaWtlPFQ+IHwgc3RyaW5nLCBkb0JyZWFrOiAoKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuLyoqXG4gKiBTaGltcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiBgZm9yIC4uLiBvZmAgYmxvY2tzXG4gKlxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBvYmplY3QgdGhlIHByb3ZpZGVzIGFuIGludGVyYXRvciBpbnRlcmZhY2VcbiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSBvZiB0aGUgaXRlcmFibGVcbiAqIEBwYXJhbSB0aGlzQXJnIE9wdGlvbmFsIHNjb3BlIHRvIHBhc3MgdGhlIGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JPZjxUPihcblx0aXRlcmFibGU6IEl0ZXJhYmxlPFQ+IHwgQXJyYXlMaWtlPFQ+IHwgc3RyaW5nLFxuXHRjYWxsYmFjazogRm9yT2ZDYWxsYmFjazxUPixcblx0dGhpc0FyZz86IGFueVxuKTogdm9pZCB7XG5cdGxldCBicm9rZW4gPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBkb0JyZWFrKCkge1xuXHRcdGJyb2tlbiA9IHRydWU7XG5cdH1cblxuXHQvKiBXZSBuZWVkIHRvIGhhbmRsZSBpdGVyYXRpb24gb2YgZG91YmxlIGJ5dGUgc3RyaW5ncyBwcm9wZXJseSAqL1xuXHRpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpICYmIHR5cGVvZiBpdGVyYWJsZSA9PT0gJ3N0cmluZycpIHtcblx0XHRjb25zdCBsID0gaXRlcmFibGUubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgKytpKSB7XG5cdFx0XHRsZXQgY2hhciA9IGl0ZXJhYmxlW2ldO1xuXHRcdFx0aWYgKGkgKyAxIDwgbCkge1xuXHRcdFx0XHRjb25zdCBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xuXHRcdFx0XHRpZiAoY29kZSA+PSBISUdIX1NVUlJPR0FURV9NSU4gJiYgY29kZSA8PSBISUdIX1NVUlJPR0FURV9NQVgpIHtcblx0XHRcdFx0XHRjaGFyICs9IGl0ZXJhYmxlWysraV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY2hhciwgaXRlcmFibGUsIGRvQnJlYWspO1xuXHRcdFx0aWYgKGJyb2tlbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGl0ZXJhdG9yID0gZ2V0KGl0ZXJhYmxlKTtcblx0XHRpZiAoaXRlcmF0b3IpIHtcblx0XHRcdGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cblx0XHRcdHdoaWxlICghcmVzdWx0LmRvbmUpIHtcblx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZXN1bHQudmFsdWUsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcblx0XHRcdFx0aWYgKGJyb2tlbikge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaXRlcmF0b3IudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcblxuLyoqXG4gKiBUaGUgc21hbGxlc3QgaW50ZXJ2YWwgYmV0d2VlbiB0d28gcmVwcmVzZW50YWJsZSBudW1iZXJzLlxuICovXG5leHBvcnQgY29uc3QgRVBTSUxPTiA9IDE7XG5cbi8qKlxuICogVGhlIG1heGltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIFRoZSBtaW5pbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fU0FGRV9JTlRFR0VSID0gLU1BWF9TQUZFX0lOVEVHRVI7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgTmFOIHdpdGhvdXQgY29lcnNpb24uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIE5hTiwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hTih2YWx1ZTogYW55KTogYm9vbGVhbiB7XG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbC5pc05hTih2YWx1ZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyIHdpdGhvdXQgY29lcnNpb24uXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGZpbml0ZSwgZmFsc2UgaWYgaXQgaXMgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgbnVtYmVyIHtcblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsLmlzRmluaXRlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhc3NlZCB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZTogYW55KTogdmFsdWUgaXMgbnVtYmVyIHtcblx0cmV0dXJuIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlciB0aGF0IGlzICdzYWZlLCcgbWVhbmluZzpcbiAqICAgMS4gaXQgY2FuIGJlIGV4cHJlc3NlZCBhcyBhbiBJRUVFLTc1NCBkb3VibGUgcHJlY2lzaW9uIG51bWJlclxuICogICAyLiBpdCBoYXMgYSBvbmUtdG8tb25lIG1hcHBpbmcgdG8gYSBtYXRoZW1hdGljYWwgaW50ZWdlciwgbWVhbmluZyBpdHNcbiAqICAgICAgSUVFRS03NTQgcmVwcmVzZW50YXRpb24gY2Fubm90IGJlIHRoZSByZXN1bHQgb2Ygcm91bmRpbmcgYW55IG90aGVyXG4gKiAgICAgIGludGVnZXIgdG8gZml0IHRoZSBJRUVFLTc1NCByZXByZXNlbnRhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIG51bWJlciB7XG5cdHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmIE1hdGguYWJzKHZhbHVlKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIG51bWJlci50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IGhhcyBmcm9tICcuL3N1cHBvcnQvaGFzJztcbmltcG9ydCB7IGlzU3ltYm9sIH0gZnJvbSAnLi9TeW1ib2wnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdEFzc2lnbiB7XG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QgZnJvbSB3aGljaCB0byBjb3B5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHQ8VCwgVT4odGFyZ2V0OiBULCBzb3VyY2U6IFUpOiBUICYgVTtcblxuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlMSBUaGUgZmlyc3Qgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICogQHBhcmFtIHNvdXJjZTIgVGhlIHNlY29uZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0PFQsIFUsIFY+KHRhcmdldDogVCwgc291cmNlMTogVSwgc291cmNlMjogVik6IFQgJiBVICYgVjtcblxuXHQvKipcblx0ICogQ29weSB0aGUgdmFsdWVzIG9mIGFsbCBvZiB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIHRvIGFcblx0ICogdGFyZ2V0IG9iamVjdC4gUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cblx0ICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBjb3B5IHRvLlxuXHQgKiBAcGFyYW0gc291cmNlMSBUaGUgZmlyc3Qgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICogQHBhcmFtIHNvdXJjZTIgVGhlIHNlY29uZCBzb3VyY2Ugb2JqZWN0IGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzLlxuXHQgKiBAcGFyYW0gc291cmNlMyBUaGUgdGhpcmQgc291cmNlIG9iamVjdCBmcm9tIHdoaWNoIHRvIGNvcHkgcHJvcGVydGllcy5cblx0ICovXG5cdDxULCBVLCBWLCBXPih0YXJnZXQ6IFQsIHNvdXJjZTE6IFUsIHNvdXJjZTI6IFYsIHNvdXJjZTM6IFcpOiBUICYgVSAmIFYgJiBXO1xuXG5cdC8qKlxuXHQgKiBDb3B5IHRoZSB2YWx1ZXMgb2YgYWxsIG9mIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlIG9iamVjdHMgdG8gYVxuXHQgKiB0YXJnZXQgb2JqZWN0LiBSZXR1cm5zIHRoZSB0YXJnZXQgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGNvcHkgdG8uXG5cdCAqIEBwYXJhbSBzb3VyY2VzIE9uZSBvciBtb3JlIHNvdXJjZSBvYmplY3RzIGZyb20gd2hpY2ggdG8gY29weSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHQodGFyZ2V0OiBvYmplY3QsIC4uLnNvdXJjZXM6IGFueVtdKTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdEVudGVyaWVzIHtcblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5L3ZhbHVlcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdFxuXHQgKiBAcGFyYW0gbyBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBhbmQgbWV0aG9kcy4gVGhpcyBjYW4gYmUgYW4gb2JqZWN0IHRoYXQgeW91IGNyZWF0ZWQgb3IgYW4gZXhpc3RpbmcgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIChET00pIG9iamVjdC5cblx0ICovXG5cdDxUIGV4dGVuZHMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQpOiBba2V5b2YgVCwgVFtLXV1bXTtcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXkvdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0KG86IG9iamVjdCk6IFtzdHJpbmcsIGFueV1bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIHtcblx0PFQ+KG86IFQpOiB7IFtLIGluIGtleW9mIFRdOiBQcm9wZXJ0eURlc2NyaXB0b3IgfTtcblx0KG86IGFueSk6IHsgW2tleTogc3RyaW5nXTogUHJvcGVydHlEZXNjcmlwdG9yIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0VmFsdWVzIHtcblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzIG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuXHQgKi9cblx0PFQ+KG86IHsgW3M6IHN0cmluZ106IFQgfSk6IFRbXTtcblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBhcnJheSBvZiB2YWx1ZXMgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3Rcblx0ICogQHBhcmFtIG8gT2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuIFRoaXMgY2FuIGJlIGFuIG9iamVjdCB0aGF0IHlvdSBjcmVhdGVkIG9yIGFuIGV4aXN0aW5nIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBvYmplY3QuXG5cdCAqL1xuXHQobzogb2JqZWN0KTogYW55W107XG59XG5cbmV4cG9ydCBsZXQgYXNzaWduOiBPYmplY3RBc3NpZ247XG5cbi8qKlxuICogR2V0cyB0aGUgb3duIHByb3BlcnR5IGRlc2NyaXB0b3Igb2YgdGhlIHNwZWNpZmllZCBvYmplY3QuXG4gKiBBbiBvd24gcHJvcGVydHkgZGVzY3JpcHRvciBpcyBvbmUgdGhhdCBpcyBkZWZpbmVkIGRpcmVjdGx5IG9uIHRoZSBvYmplY3QgYW5kIGlzIG5vdFxuICogaW5oZXJpdGVkIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZS5cbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSBwIE5hbWUgb2YgdGhlIHByb3BlcnR5LlxuICovXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogPFQsIEsgZXh0ZW5kcyBrZXlvZiBUPihvOiBULCBwcm9wZXJ0eUtleTogSykgPT4gUHJvcGVydHlEZXNjcmlwdG9yIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QuIFRoZSBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QgYXJlIHRob3NlIHRoYXQgYXJlIGRlZmluZWQgZGlyZWN0bHlcbiAqIG9uIHRoYXQgb2JqZWN0LCBhbmQgYXJlIG5vdCBpbmhlcml0ZWQgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlLiBUaGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgaW5jbHVkZSBib3RoIGZpZWxkcyAob2JqZWN0cykgYW5kIGZ1bmN0aW9ucy5cbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBvd24gcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGxldCBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAobzogYW55KSA9PiBzdHJpbmdbXTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBzeW1ib2wgcHJvcGVydGllcyBmb3VuZCBkaXJlY3RseSBvbiBvYmplY3Qgby5cbiAqIEBwYXJhbSBvIE9iamVjdCB0byByZXRyaWV2ZSB0aGUgc3ltYm9scyBmcm9tLlxuICovXG5leHBvcnQgbGV0IGdldE93blByb3BlcnR5U3ltYm9sczogKG86IGFueSkgPT4gc3ltYm9sW107XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAcGFyYW0gdmFsdWUxIFRoZSBmaXJzdCB2YWx1ZS5cbiAqIEBwYXJhbSB2YWx1ZTIgVGhlIHNlY29uZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGxldCBpczogKHZhbHVlMTogYW55LCB2YWx1ZTI6IGFueSkgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9mIGFuIG9iamVjdC5cbiAqIEBwYXJhbSBvIE9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLiBUaGlzIGNhbiBiZSBhbiBvYmplY3QgdGhhdCB5b3UgY3JlYXRlZCBvciBhbiBleGlzdGluZyBEb2N1bWVudCBPYmplY3QgTW9kZWwgKERPTSkgb2JqZWN0LlxuICovXG5leHBvcnQgbGV0IGtleXM6IChvOiBvYmplY3QpID0+IHN0cmluZ1tdO1xuXG4vKiBFUzcgT2JqZWN0IHN0YXRpYyBtZXRob2RzICovXG5cbmV4cG9ydCBsZXQgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcblxuZXhwb3J0IGxldCBlbnRyaWVzOiBPYmplY3RFbnRlcmllcztcblxuZXhwb3J0IGxldCB2YWx1ZXM6IE9iamVjdFZhbHVlcztcblxuaWYgKGhhcygnZXM2LW9iamVjdCcpKSB7XG5cdGNvbnN0IGdsb2JhbE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG5cdGFzc2lnbiA9IGdsb2JhbE9iamVjdC5hc3NpZ247XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cdGdldE93blByb3BlcnR5TmFtZXMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcblx0Z2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblx0aXMgPSBnbG9iYWxPYmplY3QuaXM7XG5cdGtleXMgPSBnbG9iYWxPYmplY3Qua2V5cztcbn0gZWxzZSB7XG5cdGtleXMgPSBmdW5jdGlvbiBzeW1ib2xBd2FyZUtleXMobzogb2JqZWN0KTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBPYmplY3Qua2V5cyhvKS5maWx0ZXIoKGtleSkgPT4gIUJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSk7XG5cdH07XG5cblx0YXNzaWduID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldDogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSkge1xuXHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0Ly8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRjb25zdCB0byA9IE9iamVjdCh0YXJnZXQpO1xuXHRcdHNvdXJjZXMuZm9yRWFjaCgobmV4dFNvdXJjZSkgPT4ge1xuXHRcdFx0aWYgKG5leHRTb3VyY2UpIHtcblx0XHRcdFx0Ly8gU2tpcCBvdmVyIGlmIHVuZGVmaW5lZCBvciBudWxsXG5cdFx0XHRcdGtleXMobmV4dFNvdXJjZSkuZm9yRWFjaCgobmV4dEtleSkgPT4ge1xuXHRcdFx0XHRcdHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdG87XG5cdH07XG5cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuXHRcdG86IGFueSxcblx0XHRwcm9wOiBzdHJpbmcgfCBzeW1ib2xcblx0KTogUHJvcGVydHlEZXNjcmlwdG9yIHwgdW5kZWZpbmVkIHtcblx0XHRpZiAoaXNTeW1ib2wocHJvcCkpIHtcblx0XHRcdHJldHVybiAoPGFueT5PYmplY3QpLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XG5cdFx0fVxuXHR9O1xuXG5cdGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG86IGFueSk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZmlsdGVyKChrZXkpID0+ICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSkpO1xuXHR9O1xuXG5cdGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvOiBhbnkpOiBzeW1ib2xbXSB7XG5cdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pXG5cdFx0XHQuZmlsdGVyKChrZXkpID0+IEJvb2xlYW4oa2V5Lm1hdGNoKC9eQEAuKy8pKSlcblx0XHRcdC5tYXAoKGtleSkgPT4gU3ltYm9sLmZvcihrZXkuc3Vic3RyaW5nKDIpKSk7XG5cdH07XG5cblx0aXMgPSBmdW5jdGlvbiBpcyh2YWx1ZTE6IGFueSwgdmFsdWUyOiBhbnkpOiBib29sZWFuIHtcblx0XHRpZiAodmFsdWUxID09PSB2YWx1ZTIpIHtcblx0XHRcdHJldHVybiB2YWx1ZTEgIT09IDAgfHwgMSAvIHZhbHVlMSA9PT0gMSAvIHZhbHVlMjsgLy8gLTBcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlMSAhPT0gdmFsdWUxICYmIHZhbHVlMiAhPT0gdmFsdWUyOyAvLyBOYU5cblx0fTtcbn1cblxuaWYgKGhhcygnZXMyMDE3LW9iamVjdCcpKSB7XG5cdGNvbnN0IGdsb2JhbE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycztcblx0ZW50cmllcyA9IGdsb2JhbE9iamVjdC5lbnRyaWVzO1xuXHR2YWx1ZXMgPSBnbG9iYWxPYmplY3QudmFsdWVzO1xufSBlbHNlIHtcblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobzogYW55KSB7XG5cdFx0cmV0dXJuIGdldE93blByb3BlcnR5TmFtZXMobykucmVkdWNlKFxuXHRcdFx0KHByZXZpb3VzLCBrZXkpID0+IHtcblx0XHRcdFx0cHJldmlvdXNba2V5XSA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBrZXkpITtcblx0XHRcdFx0cmV0dXJuIHByZXZpb3VzO1xuXHRcdFx0fSxcblx0XHRcdHt9IGFzIHsgW2tleTogc3RyaW5nXTogUHJvcGVydHlEZXNjcmlwdG9yIH1cblx0XHQpO1xuXHR9O1xuXG5cdGVudHJpZXMgPSBmdW5jdGlvbiBlbnRyaWVzKG86IGFueSk6IFtzdHJpbmcsIGFueV1bXSB7XG5cdFx0cmV0dXJuIGtleXMobykubWFwKChrZXkpID0+IFtrZXksIG9ba2V5XV0gYXMgW3N0cmluZywgYW55XSk7XG5cdH07XG5cblx0dmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzKG86IGFueSk6IGFueVtdIHtcblx0XHRyZXR1cm4ga2V5cyhvKS5tYXAoKGtleSkgPT4gb1trZXldKTtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBvYmplY3QudHMiLCJpbXBvcnQgZ2xvYmFsIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9zdXBwb3J0L2hhcyc7XG5pbXBvcnQgeyB3cmFwTmF0aXZlIH0gZnJvbSAnLi9zdXBwb3J0L3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ05vcm1hbGl6ZSB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBTdHJpbmcgdmFsdWUgcmVzdWx0IG9mIG5vcm1hbGl6aW5nIHRoZSBzdHJpbmcgaW50byB0aGUgbm9ybWFsaXphdGlvbiBmb3JtXG5cdCAqIG5hbWVkIGJ5IGZvcm0gYXMgc3BlY2lmaWVkIGluIFVuaWNvZGUgU3RhbmRhcmQgQW5uZXggIzE1LCBVbmljb2RlIE5vcm1hbGl6YXRpb24gRm9ybXMuXG5cdCAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcblx0ICogQHBhcmFtIGZvcm0gQXBwbGljYWJsZSB2YWx1ZXM6IFwiTkZDXCIsIFwiTkZEXCIsIFwiTkZLQ1wiLCBvciBcIk5GS0RcIiwgSWYgbm90IHNwZWNpZmllZCBkZWZhdWx0XG5cdCAqIGlzIFwiTkZDXCJcblx0ICovXG5cdCh0YXJnZXQ6IHN0cmluZywgZm9ybTogJ05GQycgfCAnTkZEJyB8ICdORktDJyB8ICdORktEJyk6IHN0cmluZztcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuXHQgKiBuYW1lZCBieSBmb3JtIGFzIHNwZWNpZmllZCBpbiBVbmljb2RlIFN0YW5kYXJkIEFubmV4ICMxNSwgVW5pY29kZSBOb3JtYWxpemF0aW9uIEZvcm1zLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG5cdCAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuXHQgKiBpcyBcIk5GQ1wiXG5cdCAqL1xuXHQodGFyZ2V0OiBzdHJpbmcsIGZvcm0/OiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBISUdIX1NVUlJPR0FURV9NSU4gPSAweGQ4MDA7XG5cbi8qKlxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBISUdIX1NVUlJPR0FURV9NQVggPSAweGRiZmY7XG5cbi8qKlxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IExPV19TVVJST0dBVEVfTUlOID0gMHhkYzAwO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXG4gKi9cbmV4cG9ydCBjb25zdCBMT1dfU1VSUk9HQVRFX01BWCA9IDB4ZGZmZjtcblxuLyogRVM2IHN0YXRpYyBtZXRob2RzICovXG5cbi8qKlxuICogUmV0dXJuIHRoZSBTdHJpbmcgdmFsdWUgd2hvc2UgZWxlbWVudHMgYXJlLCBpbiBvcmRlciwgdGhlIGVsZW1lbnRzIGluIHRoZSBMaXN0IGVsZW1lbnRzLlxuICogSWYgbGVuZ3RoIGlzIDAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiBAcGFyYW0gY29kZVBvaW50cyBUaGUgY29kZSBwb2ludHMgdG8gZ2VuZXJhdGUgdGhlIHN0cmluZ1xuICovXG5leHBvcnQgbGV0IGZyb21Db2RlUG9pbnQ6ICguLi5jb2RlUG9pbnRzOiBudW1iZXJbXSkgPT4gc3RyaW5nO1xuXG4vKipcbiAqIGByYXdgIGlzIGludGVuZGVkIGZvciB1c2UgYXMgYSB0YWcgZnVuY3Rpb24gb2YgYSBUYWdnZWQgVGVtcGxhdGUgU3RyaW5nLiBXaGVuIGNhbGxlZFxuICogYXMgc3VjaCB0aGUgZmlyc3QgYXJndW1lbnQgd2lsbCBiZSBhIHdlbGwgZm9ybWVkIHRlbXBsYXRlIGNhbGwgc2l0ZSBvYmplY3QgYW5kIHRoZSByZXN0XG4gKiBwYXJhbWV0ZXIgd2lsbCBjb250YWluIHRoZSBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICogQHBhcmFtIHRlbXBsYXRlIEEgd2VsbC1mb3JtZWQgdGVtcGxhdGUgc3RyaW5nIGNhbGwgc2l0ZSByZXByZXNlbnRhdGlvbi5cbiAqIEBwYXJhbSBzdWJzdGl0dXRpb25zIEEgc2V0IG9mIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBsZXQgcmF3OiAodGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi5zdWJzdGl0dXRpb25zOiBhbnlbXSkgPT4gc3RyaW5nO1xuXG4vKiBFUzYgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIFJldHVybnMgYSBub25uZWdhdGl2ZSBpbnRlZ2VyIE51bWJlciBsZXNzIHRoYW4gMTExNDExMiAoMHgxMTAwMDApIHRoYXQgaXMgdGhlIGNvZGUgcG9pbnRcbiAqIHZhbHVlIG9mIHRoZSBVVEYtMTYgZW5jb2RlZCBjb2RlIHBvaW50IHN0YXJ0aW5nIGF0IHRoZSBzdHJpbmcgZWxlbWVudCBhdCBwb3NpdGlvbiBwb3MgaW5cbiAqIHRoZSBTdHJpbmcgcmVzdWx0aW5nIGZyb20gY29udmVydGluZyB0aGlzIG9iamVjdCB0byBhIFN0cmluZy5cbiAqIElmIHRoZXJlIGlzIG5vIGVsZW1lbnQgYXQgdGhhdCBwb3NpdGlvbiwgdGhlIHJlc3VsdCBpcyB1bmRlZmluZWQuXG4gKiBJZiBhIHZhbGlkIFVURi0xNiBzdXJyb2dhdGUgcGFpciBkb2VzIG5vdCBiZWdpbiBhdCBwb3MsIHRoZSByZXN1bHQgaXMgdGhlIGNvZGUgdW5pdCBhdCBwb3MuXG4gKi9cbmV4cG9ydCBsZXQgY29kZVBvaW50QXQ6ICh0YXJnZXQ6IHN0cmluZywgcG9zPzogbnVtYmVyKSA9PiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzZXF1ZW5jZSBvZiBlbGVtZW50cyBvZiBzZWFyY2hTdHJpbmcgY29udmVydGVkIHRvIGEgU3RyaW5nIGlzIHRoZVxuICogc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50cyBvZiB0aGlzIG9iamVjdCAoY29udmVydGVkIHRvIGEgU3RyaW5nKSBzdGFydGluZyBhdFxuICogZW5kUG9zaXRpb24g4oCTIGxlbmd0aCh0aGlzKS4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gKi9cbmV4cG9ydCBsZXQgZW5kc1dpdGg6ICh0YXJnZXQ6IHN0cmluZywgc2VhcmNoU3RyaW5nOiBzdHJpbmcsIGVuZFBvc2l0aW9uPzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBzZWFyY2hTdHJpbmcgYXBwZWFycyBhcyBhIHN1YnN0cmluZyBvZiB0aGUgcmVzdWx0IG9mIGNvbnZlcnRpbmcgdGhpc1xuICogb2JqZWN0IHRvIGEgU3RyaW5nLCBhdCBvbmUgb3IgbW9yZSBwb3NpdGlvbnMgdGhhdCBhcmVcbiAqIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBwb3NpdGlvbjsgb3RoZXJ3aXNlLCByZXR1cm5zIGZhbHNlLlxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHN0cmluZ1xuICogQHBhcmFtIHNlYXJjaFN0cmluZyBzZWFyY2ggc3RyaW5nXG4gKiBAcGFyYW0gcG9zaXRpb24gSWYgcG9zaXRpb24gaXMgdW5kZWZpbmVkLCAwIGlzIGFzc3VtZWQsIHNvIGFzIHRvIHNlYXJjaCBhbGwgb2YgdGhlIFN0cmluZy5cbiAqL1xuZXhwb3J0IGxldCBpbmNsdWRlczogKHRhcmdldDogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUmV0dXJucyB0aGUgU3RyaW5nIHZhbHVlIHJlc3VsdCBvZiBub3JtYWxpemluZyB0aGUgc3RyaW5nIGludG8gdGhlIG5vcm1hbGl6YXRpb24gZm9ybVxuICogbmFtZWQgYnkgZm9ybSBhcyBzcGVjaWZpZWQgaW4gVW5pY29kZSBTdGFuZGFyZCBBbm5leCAjMTUsIFVuaWNvZGUgTm9ybWFsaXphdGlvbiBGb3Jtcy5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzdHJpbmdcbiAqIEBwYXJhbSBmb3JtIEFwcGxpY2FibGUgdmFsdWVzOiBcIk5GQ1wiLCBcIk5GRFwiLCBcIk5GS0NcIiwgb3IgXCJORktEXCIsIElmIG5vdCBzcGVjaWZpZWQgZGVmYXVsdFxuICogaXMgXCJORkNcIlxuICovXG5leHBvcnQgbGV0IG5vcm1hbGl6ZTogU3RyaW5nTm9ybWFsaXplO1xuXG4vKipcbiAqIFJldHVybnMgYSBTdHJpbmcgdmFsdWUgdGhhdCBpcyBtYWRlIGZyb20gY291bnQgY29waWVzIGFwcGVuZGVkIHRvZ2V0aGVyLiBJZiBjb3VudCBpcyAwLFxuICogVCBpcyB0aGUgZW1wdHkgU3RyaW5nIGlzIHJldHVybmVkLlxuICogQHBhcmFtIGNvdW50IG51bWJlciBvZiBjb3BpZXMgdG8gYXBwZW5kXG4gKi9cbmV4cG9ydCBsZXQgcmVwZWF0OiAodGFyZ2V0OiBzdHJpbmcsIGNvdW50PzogbnVtYmVyKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzZXF1ZW5jZSBvZiBlbGVtZW50cyBvZiBzZWFyY2hTdHJpbmcgY29udmVydGVkIHRvIGEgU3RyaW5nIGlzIHRoZVxuICogc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50cyBvZiB0aGlzIG9iamVjdCAoY29udmVydGVkIHRvIGEgU3RyaW5nKSBzdGFydGluZyBhdFxuICogcG9zaXRpb24uIE90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICovXG5leHBvcnQgbGV0IHN0YXJ0c1dpdGg6ICh0YXJnZXQ6IHN0cmluZywgc2VhcmNoU3RyaW5nOiBzdHJpbmcsIHBvc2l0aW9uPzogbnVtYmVyKSA9PiBib29sZWFuO1xuXG4vKiBFUzcgaW5zdGFuY2UgbWV0aG9kcyAqL1xuXG4vKipcbiAqIFBhZHMgdGhlIGN1cnJlbnQgc3RyaW5nIHdpdGggYSBnaXZlbiBzdHJpbmcgKHBvc3NpYmx5IHJlcGVhdGVkKSBzbyB0aGF0IHRoZSByZXN1bHRpbmcgc3RyaW5nIHJlYWNoZXMgYSBnaXZlbiBsZW5ndGguXG4gKiBUaGUgcGFkZGluZyBpcyBhcHBsaWVkIGZyb20gdGhlIGVuZCAocmlnaHQpIG9mIHRoZSBjdXJyZW50IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gbWF4TGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBzdHJpbmcgb25jZSB0aGUgY3VycmVudCBzdHJpbmcgaGFzIGJlZW4gcGFkZGVkLlxuICogICAgICAgIElmIHRoaXMgcGFyYW1ldGVyIGlzIHNtYWxsZXIgdGhhbiB0aGUgY3VycmVudCBzdHJpbmcncyBsZW5ndGgsIHRoZSBjdXJyZW50IHN0cmluZyB3aWxsIGJlIHJldHVybmVkIGFzIGl0IGlzLlxuICpcbiAqIEBwYXJhbSBmaWxsU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFkIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoLlxuICogICAgICAgIElmIHRoaXMgc3RyaW5nIGlzIHRvbyBsb25nLCBpdCB3aWxsIGJlIHRydW5jYXRlZCBhbmQgdGhlIGxlZnQtbW9zdCBwYXJ0IHdpbGwgYmUgYXBwbGllZC5cbiAqICAgICAgICBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhpcyBwYXJhbWV0ZXIgaXMgXCIgXCIgKFUrMDAyMCkuXG4gKi9cbmV4cG9ydCBsZXQgcGFkRW5kOiAodGFyZ2V0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBmaWxsU3RyaW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogUGFkcyB0aGUgY3VycmVudCBzdHJpbmcgd2l0aCBhIGdpdmVuIHN0cmluZyAocG9zc2libHkgcmVwZWF0ZWQpIHNvIHRoYXQgdGhlIHJlc3VsdGluZyBzdHJpbmcgcmVhY2hlcyBhIGdpdmVuIGxlbmd0aC5cbiAqIFRoZSBwYWRkaW5nIGlzIGFwcGxpZWQgZnJvbSB0aGUgc3RhcnQgKGxlZnQpIG9mIHRoZSBjdXJyZW50IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc3RyaW5nXG4gKiBAcGFyYW0gbWF4TGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBzdHJpbmcgb25jZSB0aGUgY3VycmVudCBzdHJpbmcgaGFzIGJlZW4gcGFkZGVkLlxuICogICAgICAgIElmIHRoaXMgcGFyYW1ldGVyIGlzIHNtYWxsZXIgdGhhbiB0aGUgY3VycmVudCBzdHJpbmcncyBsZW5ndGgsIHRoZSBjdXJyZW50IHN0cmluZyB3aWxsIGJlIHJldHVybmVkIGFzIGl0IGlzLlxuICpcbiAqIEBwYXJhbSBmaWxsU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFkIHRoZSBjdXJyZW50IHN0cmluZyB3aXRoLlxuICogICAgICAgIElmIHRoaXMgc3RyaW5nIGlzIHRvbyBsb25nLCBpdCB3aWxsIGJlIHRydW5jYXRlZCBhbmQgdGhlIGxlZnQtbW9zdCBwYXJ0IHdpbGwgYmUgYXBwbGllZC5cbiAqICAgICAgICBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhpcyBwYXJhbWV0ZXIgaXMgXCIgXCIgKFUrMDAyMCkuXG4gKi9cbmV4cG9ydCBsZXQgcGFkU3RhcnQ6ICh0YXJnZXQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGZpbGxTdHJpbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuaWYgKGhhcygnZXM2LXN0cmluZycpICYmIGhhcygnZXM2LXN0cmluZy1yYXcnKSkge1xuXHRmcm9tQ29kZVBvaW50ID0gZ2xvYmFsLlN0cmluZy5mcm9tQ29kZVBvaW50O1xuXHRyYXcgPSBnbG9iYWwuU3RyaW5nLnJhdztcblxuXHRjb2RlUG9pbnRBdCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQpO1xuXHRlbmRzV2l0aCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgpO1xuXHRpbmNsdWRlcyA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpO1xuXHRub3JtYWxpemUgPSB3cmFwTmF0aXZlKGdsb2JhbC5TdHJpbmcucHJvdG90eXBlLm5vcm1hbGl6ZSk7XG5cdHJlcGVhdCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucmVwZWF0KTtcblx0c3RhcnRzV2l0aCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCk7XG59IGVsc2Uge1xuXHQvKipcblx0ICogVmFsaWRhdGVzIHRoYXQgdGV4dCBpcyBkZWZpbmVkLCBhbmQgbm9ybWFsaXplcyBwb3NpdGlvbiAoYmFzZWQgb24gdGhlIGdpdmVuIGRlZmF1bHQgaWYgdGhlIGlucHV0IGlzIE5hTikuXG5cdCAqIFVzZWQgYnkgc3RhcnRzV2l0aCwgaW5jbHVkZXMsIGFuZCBlbmRzV2l0aC5cblx0ICpcblx0ICogQHJldHVybiBOb3JtYWxpemVkIHBvc2l0aW9uLlxuXHQgKi9cblx0Y29uc3Qgbm9ybWFsaXplU3Vic3RyaW5nQXJncyA9IGZ1bmN0aW9uKFxuXHRcdG5hbWU6IHN0cmluZyxcblx0XHR0ZXh0OiBzdHJpbmcsXG5cdFx0c2VhcmNoOiBzdHJpbmcsXG5cdFx0cG9zaXRpb246IG51bWJlcixcblx0XHRpc0VuZDogYm9vbGVhbiA9IGZhbHNlXG5cdCk6IFtzdHJpbmcsIHN0cmluZywgbnVtYmVyXSB7XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLicgKyBuYW1lICsgJyByZXF1aXJlcyBhIHZhbGlkIHN0cmluZyB0byBzZWFyY2ggYWdhaW5zdC4nKTtcblx0XHR9XG5cblx0XHRjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uICE9PSBwb3NpdGlvbiA/IChpc0VuZCA/IGxlbmd0aCA6IDApIDogcG9zaXRpb247XG5cdFx0cmV0dXJuIFt0ZXh0LCBTdHJpbmcoc2VhcmNoKSwgTWF0aC5taW4oTWF0aC5tYXgocG9zaXRpb24sIDApLCBsZW5ndGgpXTtcblx0fTtcblxuXHRmcm9tQ29kZVBvaW50ID0gZnVuY3Rpb24gZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzOiBudW1iZXJbXSk6IHN0cmluZyB7XG5cdFx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5mcm9tQ29kZVBvaW50XG5cdFx0Y29uc3QgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblx0XHRpZiAoIWxlbmd0aCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cdFx0Y29uc3QgTUFYX1NJWkUgPSAweDQwMDA7XG5cdFx0bGV0IGNvZGVVbml0czogbnVtYmVyW10gPSBbXTtcblx0XHRsZXQgaW5kZXggPSAtMTtcblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cblx0XHR3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHRcdFx0bGV0IGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcblxuXHRcdFx0Ly8gQ29kZSBwb2ludHMgbXVzdCBiZSBmaW5pdGUgaW50ZWdlcnMgd2l0aGluIHRoZSB2YWxpZCByYW5nZVxuXHRcdFx0bGV0IGlzVmFsaWQgPVxuXHRcdFx0XHRpc0Zpbml0ZShjb2RlUG9pbnQpICYmIE1hdGguZmxvb3IoY29kZVBvaW50KSA9PT0gY29kZVBvaW50ICYmIGNvZGVQb2ludCA+PSAwICYmIGNvZGVQb2ludCA8PSAweDEwZmZmZjtcblx0XHRcdGlmICghaXNWYWxpZCkge1xuXHRcdFx0XHR0aHJvdyBSYW5nZUVycm9yKCdzdHJpbmcuZnJvbUNvZGVQb2ludDogSW52YWxpZCBjb2RlIHBvaW50ICcgKyBjb2RlUG9pbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29kZVBvaW50IDw9IDB4ZmZmZikge1xuXHRcdFx0XHQvLyBCTVAgY29kZSBwb2ludFxuXHRcdFx0XHRjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQXN0cmFsIGNvZGUgcG9pbnQ7IHNwbGl0IGluIHN1cnJvZ2F0ZSBoYWx2ZXNcblx0XHRcdFx0Ly8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG5cdFx0XHRcdGNvZGVQb2ludCAtPSAweDEwMDAwO1xuXHRcdFx0XHRsZXQgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgSElHSF9TVVJST0dBVEVfTUlOO1xuXHRcdFx0XHRsZXQgbG93U3Vycm9nYXRlID0gY29kZVBvaW50ICUgMHg0MDAgKyBMT1dfU1VSUk9HQVRFX01JTjtcblx0XHRcdFx0Y29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuXHRcdFx0XHRyZXN1bHQgKz0gZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG5cdFx0XHRcdGNvZGVVbml0cy5sZW5ndGggPSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHJhdyA9IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnN1YnN0aXR1dGlvbnM6IGFueVtdKTogc3RyaW5nIHtcblx0XHRsZXQgcmF3U3RyaW5ncyA9IGNhbGxTaXRlLnJhdztcblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cdFx0bGV0IG51bVN1YnN0aXR1dGlvbnMgPSBzdWJzdGl0dXRpb25zLmxlbmd0aDtcblxuXHRcdGlmIChjYWxsU2l0ZSA9PSBudWxsIHx8IGNhbGxTaXRlLnJhdyA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmF3IHJlcXVpcmVzIGEgdmFsaWQgY2FsbFNpdGUgb2JqZWN0IHdpdGggYSByYXcgdmFsdWUnKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmF3U3RyaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0cmVzdWx0ICs9IHJhd1N0cmluZ3NbaV0gKyAoaSA8IG51bVN1YnN0aXR1dGlvbnMgJiYgaSA8IGxlbmd0aCAtIDEgPyBzdWJzdGl0dXRpb25zW2ldIDogJycpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0Y29kZVBvaW50QXQgPSBmdW5jdGlvbiBjb2RlUG9pbnRBdCh0ZXh0OiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIgPSAwKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcblx0XHQvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdFxuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5jb2RlUG9pbnRBdCByZXF1cmllcyBhIHZhbGlkIHN0cmluZy4nKTtcblx0XHR9XG5cdFx0Y29uc3QgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XG5cblx0XHRpZiAocG9zaXRpb24gIT09IHBvc2l0aW9uKSB7XG5cdFx0XHRwb3NpdGlvbiA9IDA7XG5cdFx0fVxuXHRcdGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gbGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0aGUgZmlyc3QgY29kZSB1bml0XG5cdFx0Y29uc3QgZmlyc3QgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xuXHRcdGlmIChmaXJzdCA+PSBISUdIX1NVUlJPR0FURV9NSU4gJiYgZmlyc3QgPD0gSElHSF9TVVJST0dBVEVfTUFYICYmIGxlbmd0aCA+IHBvc2l0aW9uICsgMSkge1xuXHRcdFx0Ly8gU3RhcnQgb2YgYSBzdXJyb2dhdGUgcGFpciAoaGlnaCBzdXJyb2dhdGUgYW5kIHRoZXJlIGlzIGEgbmV4dCBjb2RlIHVuaXQpOyBjaGVjayBmb3IgbG93IHN1cnJvZ2F0ZVxuXHRcdFx0Ly8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG5cdFx0XHRjb25zdCBzZWNvbmQgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKTtcblx0XHRcdGlmIChzZWNvbmQgPj0gTE9XX1NVUlJPR0FURV9NSU4gJiYgc2Vjb25kIDw9IExPV19TVVJST0dBVEVfTUFYKSB7XG5cdFx0XHRcdHJldHVybiAoZmlyc3QgLSBISUdIX1NVUlJPR0FURV9NSU4pICogMHg0MDAgKyBzZWNvbmQgLSBMT1dfU1VSUk9HQVRFX01JTiArIDB4MTAwMDA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmaXJzdDtcblx0fTtcblxuXHRlbmRzV2l0aCA9IGZ1bmN0aW9uIGVuZHNXaXRoKHRleHQ6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIGVuZFBvc2l0aW9uPzogbnVtYmVyKTogYm9vbGVhbiB7XG5cdFx0aWYgKGVuZFBvc2l0aW9uID09IG51bGwpIHtcblx0XHRcdGVuZFBvc2l0aW9uID0gdGV4dC5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0W3RleHQsIHNlYXJjaCwgZW5kUG9zaXRpb25dID0gbm9ybWFsaXplU3Vic3RyaW5nQXJncygnZW5kc1dpdGgnLCB0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uLCB0cnVlKTtcblxuXHRcdGNvbnN0IHN0YXJ0ID0gZW5kUG9zaXRpb24gLSBzZWFyY2gubGVuZ3RoO1xuXHRcdGlmIChzdGFydCA8IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGV4dC5zbGljZShzdGFydCwgZW5kUG9zaXRpb24pID09PSBzZWFyY2g7XG5cdH07XG5cblx0aW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0ZXh0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuXHRcdFt0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ2luY2x1ZGVzJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbik7XG5cdFx0cmV0dXJuIHRleHQuaW5kZXhPZihzZWFyY2gsIHBvc2l0aW9uKSAhPT0gLTE7XG5cdH07XG5cblx0cmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHRleHQ6IHN0cmluZywgY291bnQ6IG51bWJlciA9IDApOiBzdHJpbmcge1xuXHRcdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLnJlcGVhdFxuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XG5cdFx0fVxuXHRcdGlmIChjb3VudCAhPT0gY291bnQpIHtcblx0XHRcdGNvdW50ID0gMDtcblx0XHR9XG5cdFx0aWYgKGNvdW50IDwgMCB8fCBjb3VudCA9PT0gSW5maW5pdHkpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcblx0XHR9XG5cblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cdFx0d2hpbGUgKGNvdW50KSB7XG5cdFx0XHRpZiAoY291bnQgJSAyKSB7XG5cdFx0XHRcdHJlc3VsdCArPSB0ZXh0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNvdW50ID4gMSkge1xuXHRcdFx0XHR0ZXh0ICs9IHRleHQ7XG5cdFx0XHR9XG5cdFx0XHRjb3VudCA+Pj0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRzdGFydHNXaXRoID0gZnVuY3Rpb24gc3RhcnRzV2l0aCh0ZXh0OiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuXHRcdHNlYXJjaCA9IFN0cmluZyhzZWFyY2gpO1xuXHRcdFt0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uXSA9IG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3MoJ3N0YXJ0c1dpdGgnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKTtcblxuXHRcdGNvbnN0IGVuZCA9IHBvc2l0aW9uICsgc2VhcmNoLmxlbmd0aDtcblx0XHRpZiAoZW5kID4gdGV4dC5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGV4dC5zbGljZShwb3NpdGlvbiwgZW5kKSA9PT0gc2VhcmNoO1xuXHR9O1xufVxuXG5pZiAoaGFzKCdlczIwMTctc3RyaW5nJykpIHtcblx0cGFkRW5kID0gd3JhcE5hdGl2ZShnbG9iYWwuU3RyaW5nLnByb3RvdHlwZS5wYWRFbmQpO1xuXHRwYWRTdGFydCA9IHdyYXBOYXRpdmUoZ2xvYmFsLlN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQpO1xufSBlbHNlIHtcblx0cGFkRW5kID0gZnVuY3Rpb24gcGFkRW5kKHRleHQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGZpbGxTdHJpbmc6IHN0cmluZyA9ICcgJyk6IHN0cmluZyB7XG5cdFx0aWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZEVuZCByZXF1aXJlcyBhIG5vbi1uZWdhdGl2ZSBmaW5pdGUgY291bnQuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XG5cdFx0XHRtYXhMZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdGxldCBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xuXHRcdGNvbnN0IHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcblxuXHRcdGlmIChwYWRkaW5nID4gMCkge1xuXHRcdFx0c3RyVGV4dCArPVxuXHRcdFx0XHRyZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXG5cdFx0XHRcdGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyVGV4dDtcblx0fTtcblxuXHRwYWRTdGFydCA9IGZ1bmN0aW9uIHBhZFN0YXJ0KHRleHQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGZpbGxTdHJpbmc6IHN0cmluZyA9ICcgJyk6IHN0cmluZyB7XG5cdFx0aWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xuXHRcdH1cblxuXHRcdGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZFN0YXJ0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcblx0XHR9XG5cblx0XHRpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcblx0XHRcdG1heExlbmd0aCA9IDA7XG5cdFx0fVxuXG5cdFx0bGV0IHN0clRleHQgPSBTdHJpbmcodGV4dCk7XG5cdFx0Y29uc3QgcGFkZGluZyA9IG1heExlbmd0aCAtIHN0clRleHQubGVuZ3RoO1xuXG5cdFx0aWYgKHBhZGRpbmcgPiAwKSB7XG5cdFx0XHRzdHJUZXh0ID1cblx0XHRcdFx0cmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xuXHRcdFx0XHRmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCkgK1xuXHRcdFx0XHRzdHJUZXh0O1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHJUZXh0O1xuXHR9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHN0cmluZy50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnLi4vZ2xvYmFsJztcbmltcG9ydCBoYXMgZnJvbSAnLi9oYXMnO1xuaW1wb3J0IHsgSGFuZGxlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbmZ1bmN0aW9uIGV4ZWN1dGVUYXNrKGl0ZW06IFF1ZXVlSXRlbSB8IHVuZGVmaW5lZCk6IHZvaWQge1xuXHRpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcblx0XHRpdGVtLmNhbGxiYWNrKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0UXVldWVIYW5kbGUoaXRlbTogUXVldWVJdGVtLCBkZXN0cnVjdG9yPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRyZXR1cm4ge1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKHRoaXM6IEhhbmRsZSkge1xuXHRcdFx0dGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKSB7fTtcblx0XHRcdGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcblx0XHRcdGl0ZW0uY2FsbGJhY2sgPSBudWxsO1xuXG5cdFx0XHRpZiAoZGVzdHJ1Y3Rvcikge1xuXHRcdFx0XHRkZXN0cnVjdG9yKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG5pbnRlcmZhY2UgUG9zdE1lc3NhZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0c291cmNlOiBhbnk7XG5cdGRhdGE6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZUl0ZW0ge1xuXHRpc0FjdGl2ZTogYm9vbGVhbjtcblx0Y2FsbGJhY2s6IG51bGwgfCAoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpO1xufVxuXG5sZXQgY2hlY2tNaWNyb1Rhc2tRdWV1ZTogKCkgPT4gdm9pZDtcbmxldCBtaWNyb1Rhc2tzOiBRdWV1ZUl0ZW1bXTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWFjcm90YXNrIHF1ZXVlLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBxdWV1ZVRhc2sgPSAoZnVuY3Rpb24oKSB7XG5cdGxldCBkZXN0cnVjdG9yOiAoLi4uYXJnczogYW55W10pID0+IGFueTtcblx0bGV0IGVucXVldWU6IChpdGVtOiBRdWV1ZUl0ZW0pID0+IHZvaWQ7XG5cblx0Ly8gU2luY2UgdGhlIElFIGltcGxlbWVudGF0aW9uIG9mIGBzZXRJbW1lZGlhdGVgIGlzIG5vdCBmbGF3bGVzcywgd2Ugd2lsbCB0ZXN0IGZvciBgcG9zdE1lc3NhZ2VgIGZpcnN0LlxuXHRpZiAoaGFzKCdwb3N0bWVzc2FnZScpKSB7XG5cdFx0Y29uc3QgcXVldWU6IFF1ZXVlSXRlbVtdID0gW107XG5cblx0XHRnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGV2ZW50OiBQb3N0TWVzc2FnZUV2ZW50KTogdm9pZCB7XG5cdFx0XHQvLyBDb25maXJtIHRoYXQgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBieSB0aGlzIHBhcnRpY3VsYXIgaW1wbGVtZW50YXRpb24uXG5cdFx0XHRpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiYgZXZlbnQuZGF0YSA9PT0gJ2Rvam8tcXVldWUtbWVzc2FnZScpIHtcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0aWYgKHF1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGV4ZWN1dGVUYXNrKHF1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRxdWV1ZS5wdXNoKGl0ZW0pO1xuXHRcdFx0Z2xvYmFsLnBvc3RNZXNzYWdlKCdkb2pvLXF1ZXVlLW1lc3NhZ2UnLCAnKicpO1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaGFzKCdzZXRpbW1lZGlhdGUnKSkge1xuXHRcdGRlc3RydWN0b3IgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gc2V0SW1tZWRpYXRlKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0ZGVzdHJ1Y3RvciA9IGdsb2JhbC5jbGVhclRpbWVvdXQ7XG5cdFx0ZW5xdWV1ZSA9IGZ1bmN0aW9uKGl0ZW06IFF1ZXVlSXRlbSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0Y29uc3QgaXRlbTogUXVldWVJdGVtID0ge1xuXHRcdFx0aXNBY3RpdmU6IHRydWUsXG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0XHR9O1xuXHRcdGNvbnN0IGlkOiBhbnkgPSBlbnF1ZXVlKGl0ZW0pO1xuXG5cdFx0cmV0dXJuIGdldFF1ZXVlSGFuZGxlKFxuXHRcdFx0aXRlbSxcblx0XHRcdGRlc3RydWN0b3IgJiZcblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZGVzdHJ1Y3RvcihpZCk7XG5cdFx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0Ly8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG5cdHJldHVybiBoYXMoJ21pY3JvdGFza3MnKVxuXHRcdD8gcXVldWVUYXNrXG5cdFx0OiBmdW5jdGlvbihjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBIYW5kbGUge1xuXHRcdFx0XHRjaGVja01pY3JvVGFza1F1ZXVlKCk7XG5cdFx0XHRcdHJldHVybiBxdWV1ZVRhc2soY2FsbGJhY2spO1xuXHRcdFx0fTtcbn0pKCk7XG5cbi8vIFdoZW4gbm8gbWVjaGFuaXNtIGZvciByZWdpc3RlcmluZyBtaWNyb3Rhc2tzIGlzIGV4cG9zZWQgYnkgdGhlIGVudmlyb25tZW50LCBtaWNyb3Rhc2tzIHdpbGxcbi8vIGJlIHF1ZXVlZCBhbmQgdGhlbiBleGVjdXRlZCBpbiBhIHNpbmdsZSBtYWNyb3Rhc2sgYmVmb3JlIHRoZSBvdGhlciBtYWNyb3Rhc2tzIGFyZSBleGVjdXRlZC5cbmlmICghaGFzKCdtaWNyb3Rhc2tzJykpIHtcblx0bGV0IGlzTWljcm9UYXNrUXVldWVkID0gZmFsc2U7XG5cblx0bWljcm9UYXNrcyA9IFtdO1xuXHRjaGVja01pY3JvVGFza1F1ZXVlID0gZnVuY3Rpb24oKTogdm9pZCB7XG5cdFx0aWYgKCFpc01pY3JvVGFza1F1ZXVlZCkge1xuXHRcdFx0aXNNaWNyb1Rhc2tRdWV1ZWQgPSB0cnVlO1xuXHRcdFx0cXVldWVUYXNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpc01pY3JvVGFza1F1ZXVlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChtaWNyb1Rhc2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxldCBpdGVtOiBRdWV1ZUl0ZW0gfCB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0d2hpbGUgKChpdGVtID0gbWljcm9UYXNrcy5zaGlmdCgpKSkge1xuXHRcdFx0XHRcdFx0ZXhlY3V0ZVRhc2soaXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogU2NoZWR1bGVzIGFuIGFuaW1hdGlvbiB0YXNrIHdpdGggYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGl0IGV4aXN0cywgb3Igd2l0aCBgcXVldWVUYXNrYCBvdGhlcndpc2UuXG4gKlxuICogU2luY2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lJ3MgYmVoYXZpb3IgZG9lcyBub3QgbWF0Y2ggdGhhdCBleHBlY3RlZCBmcm9tIGBxdWV1ZVRhc2tgLCBpdCBpcyBub3QgdXNlZCB0aGVyZS5cbiAqIEhvd2V2ZXIsIGF0IHRpbWVzIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gZGVsZWdhdGUgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lOyBoZW5jZSB0aGUgZm9sbG93aW5nIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxuICovXG5leHBvcnQgY29uc3QgcXVldWVBbmltYXRpb25UYXNrID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAoIWhhcygncmFmJykpIHtcblx0XHRyZXR1cm4gcXVldWVUYXNrO1xuXHR9XG5cblx0ZnVuY3Rpb24gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0Y29uc3QgaXRlbTogUXVldWVJdGVtID0ge1xuXHRcdFx0aXNBY3RpdmU6IHRydWUsXG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0XHR9O1xuXHRcdGNvbnN0IHJhZklkOiBudW1iZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XG5cblx0XHRyZXR1cm4gZ2V0UXVldWVIYW5kbGUoaXRlbSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBUT0RPOiBVc2UgYXNwZWN0LmJlZm9yZSB3aGVuIGl0IGlzIGF2YWlsYWJsZS5cblx0cmV0dXJuIGhhcygnbWljcm90YXNrcycpXG5cdFx0PyBxdWV1ZUFuaW1hdGlvblRhc2tcblx0XHQ6IGZ1bmN0aW9uKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0XHRcdGNoZWNrTWljcm9UYXNrUXVldWUoKTtcblx0XHRcdFx0cmV0dXJuIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjayk7XG5cdFx0XHR9O1xufSkoKTtcblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxuICpcbiAqIEFueSBjYWxsYmFja3MgcmVnaXN0ZXJlZCB3aXRoIGBxdWV1ZU1pY3JvVGFza2Agd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgdGhlIG5leHQgbWFjcm90YXNrLiBJZiBubyBuYXRpdmVcbiAqIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtYWNyb3Rhc2tzIGlzIGV4cG9zZWQsIHRoZW4gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGZpcmVkIGJlZm9yZSBhbnkgbWFjcm90YXNrXG4gKiByZWdpc3RlcmVkIHdpdGggYHF1ZXVlVGFza2Agb3IgYHF1ZXVlQW5pbWF0aW9uVGFza2AuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cbiAqL1xuZXhwb3J0IGxldCBxdWV1ZU1pY3JvVGFzayA9IChmdW5jdGlvbigpIHtcblx0bGV0IGVucXVldWU6IChpdGVtOiBRdWV1ZUl0ZW0pID0+IHZvaWQ7XG5cblx0aWYgKGhhcygnaG9zdC1ub2RlJykpIHtcblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRnbG9iYWwucHJvY2Vzcy5uZXh0VGljayhleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGhhcygnZXM2LXByb21pc2UnKSkge1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdGdsb2JhbC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XG5cdFx0fTtcblx0fSBlbHNlIGlmIChoYXMoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJykpIHtcblx0XHQvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xuXHRcdGNvbnN0IEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cdFx0Y29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNvbnN0IHF1ZXVlOiBRdWV1ZUl0ZW1bXSA9IFtdO1xuXHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgaXRlbSA9IHF1ZXVlLnNoaWZ0KCk7XG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xuXHRcdFx0XHRcdGl0ZW0uY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cblx0XHRlbnF1ZXVlID0gZnVuY3Rpb24oaXRlbTogUXVldWVJdGVtKTogdm9pZCB7XG5cdFx0XHRxdWV1ZS5wdXNoKGl0ZW0pO1xuXHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ3F1ZXVlU3RhdHVzJywgJzEnKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGVucXVldWUgPSBmdW5jdGlvbihpdGVtOiBRdWV1ZUl0ZW0pOiB2b2lkIHtcblx0XHRcdGNoZWNrTWljcm9UYXNrUXVldWUoKTtcblx0XHRcdG1pY3JvVGFza3MucHVzaChpdGVtKTtcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IEhhbmRsZSB7XG5cdFx0Y29uc3QgaXRlbTogUXVldWVJdGVtID0ge1xuXHRcdFx0aXNBY3RpdmU6IHRydWUsXG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0XHR9O1xuXG5cdFx0ZW5xdWV1ZShpdGVtKTtcblxuXHRcdHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtKTtcblx0fTtcbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcXVldWUudHMiLCIvKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHZhbHVlIHByb3BlcnR5IGRlc2NyaXB0b3JcbiAqXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXG4gKiBAcGFyYW0gZW51bWVyYWJsZSAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZW51bWJlcmFibGUsIGRlZmF1bHRzIHRvIGZhbHNlXG4gKiBAcGFyYW0gd3JpdGFibGUgICAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgd3JpdGFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqIEByZXR1cm4gICAgICAgICAgICAgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3I8VD4oXG5cdHZhbHVlOiBULFxuXHRlbnVtZXJhYmxlOiBib29sZWFuID0gZmFsc2UsXG5cdHdyaXRhYmxlOiBib29sZWFuID0gdHJ1ZSxcblx0Y29uZmlndXJhYmxlOiBib29sZWFuID0gdHJ1ZVxuKTogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8VD4ge1xuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB2YWx1ZSxcblx0XHRlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxuXHRcdHdyaXRhYmxlOiB3cml0YWJsZSxcblx0XHRjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZVxuXHR9O1xufVxuXG4vKipcbiAqIEEgaGVscGVyIGZ1bmN0aW9uIHdoaWNoIHdyYXBzIGEgZnVuY3Rpb24gd2hlcmUgdGhlIGZpcnN0IGFyZ3VtZW50IGJlY29tZXMgdGhlIHNjb3BlXG4gKiBvZiB0aGUgY2FsbFxuICpcbiAqIEBwYXJhbSBuYXRpdmVGdW5jdGlvbiBUaGUgc291cmNlIGZ1bmN0aW9uIHRvIGJlIHdyYXBwZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgUj4obmF0aXZlRnVuY3Rpb246IChhcmcxOiBVKSA9PiBSKTogKHRhcmdldDogVCwgYXJnMTogVSkgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFI+KG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogVikgPT4gUik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZTxULCBVLCBWLCBXLCBSPihcblx0bmF0aXZlRnVuY3Rpb246IChhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSXG4pOiAodGFyZ2V0OiBULCBhcmcxOiBVLCBhcmcyOiBWLCBhcmczOiBXKSA9PiBSO1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBOYXRpdmU8VCwgVSwgViwgVywgWCwgUj4oXG5cdG5hdGl2ZUZ1bmN0aW9uOiAoYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUlxuKTogKHRhcmdldDogVCwgYXJnMTogVSwgYXJnMjogViwgYXJnMzogVykgPT4gUjtcbmV4cG9ydCBmdW5jdGlvbiB3cmFwTmF0aXZlPFQsIFUsIFYsIFcsIFgsIFksIFI+KFxuXHRuYXRpdmVGdW5jdGlvbjogKGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcsIGFyZzQ6IFkpID0+IFJcbik6ICh0YXJnZXQ6IFQsIGFyZzE6IFUsIGFyZzI6IFYsIGFyZzM6IFcsIGFyZzQ6IFkpID0+IFI7XG5leHBvcnQgZnVuY3Rpb24gd3JhcE5hdGl2ZShuYXRpdmVGdW5jdGlvbjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiAodGFyZ2V0OiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcblx0XHRyZXR1cm4gbmF0aXZlRnVuY3Rpb24uYXBwbHkodGFyZ2V0LCBhcmdzKTtcblx0fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB1dGlsLnRzIiwiaW1wb3J0IHsgRXZlbnRlZCB9IGZyb20gJ0Bkb2pvL2NvcmUvRXZlbnRlZCc7XG5pbXBvcnQgeyBFdmVudE9iamVjdCB9IGZyb20gJ0Bkb2pvL2NvcmUvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0b3JFdmVudE1hcCB7XG5cdGludmFsaWRhdGU6IEV2ZW50T2JqZWN0PCdpbnZhbGlkYXRlJz47XG59XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RvcjxUID0gYW55PiBleHRlbmRzIEV2ZW50ZWQ8SW5qZWN0b3JFdmVudE1hcD4ge1xuXHRwcml2YXRlIF9wYXlsb2FkOiBUO1xuXG5cdGNvbnN0cnVjdG9yKHBheWxvYWQ6IFQpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xuXHR9XG5cblx0cHVibGljIGdldCgpOiBUIHtcblx0XHRyZXR1cm4gdGhpcy5fcGF5bG9hZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQocGF5bG9hZDogVCk6IHZvaWQge1xuXHRcdHRoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xuXHRcdHRoaXMuZW1pdCh7IHR5cGU6ICdpbnZhbGlkYXRlJyB9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmplY3RvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBJbmplY3Rvci50cyIsImltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgRXZlbnRPYmplY3QgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgeyBOb2RlSGFuZGxlckludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRW51bSB0byBpZGVudGlmeSB0aGUgdHlwZSBvZiBldmVudC5cbiAqIExpc3RlbmluZyB0byAnUHJvamVjdG9yJyB3aWxsIG5vdGlmeSB3aGVuIHByb2plY3RvciBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcbiAqIExpc3RlbmluZyB0byAnV2lkZ2V0JyB3aWxsIG5vdGlmeSB3aGVuIHdpZGdldCByb290IGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxuICovXG5leHBvcnQgZW51bSBOb2RlRXZlbnRUeXBlIHtcblx0UHJvamVjdG9yID0gJ1Byb2plY3RvcicsXG5cdFdpZGdldCA9ICdXaWRnZXQnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZUhhbmRsZXJFdmVudE1hcCB7XG5cdFByb2plY3RvcjogRXZlbnRPYmplY3Q8Tm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3I+O1xuXHRXaWRnZXQ6IEV2ZW50T2JqZWN0PE5vZGVFdmVudFR5cGUuV2lkZ2V0Pjtcbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVIYW5kbGVyIGV4dGVuZHMgRXZlbnRlZDxOb2RlSGFuZGxlckV2ZW50TWFwPiBpbXBsZW1lbnRzIE5vZGVIYW5kbGVySW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBfbm9kZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBFbGVtZW50PigpO1xuXG5cdHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBFbGVtZW50IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy5fbm9kZU1hcC5nZXQoa2V5KTtcblx0fVxuXG5cdHB1YmxpYyBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fbm9kZU1hcC5oYXMoa2V5KTtcblx0fVxuXG5cdHB1YmxpYyBhZGQoZWxlbWVudDogRWxlbWVudCwga2V5OiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlTWFwLnNldChrZXksIGVsZW1lbnQpO1xuXHRcdHRoaXMuZW1pdCh7IHR5cGU6IGtleSB9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRSb290KCk6IHZvaWQge1xuXHRcdHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuV2lkZ2V0IH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFByb2plY3RvcigpOiB2b2lkIHtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLlByb2plY3RvciB9KTtcblx0fVxuXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblx0XHR0aGlzLl9ub2RlTWFwLmNsZWFyKCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZUhhbmRsZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gTm9kZUhhbmRsZXIudHMiLCJpbXBvcnQgUHJvbWlzZSBmcm9tICdAZG9qby9zaGltL1Byb21pc2UnO1xuaW1wb3J0IE1hcCBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgU3ltYm9sIGZyb20gJ0Bkb2pvL3NoaW0vU3ltYm9sJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEV2ZW50ZWQgfSBmcm9tICdAZG9qby9jb3JlL0V2ZW50ZWQnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFJlZ2lzdHJ5TGFiZWwsIFdpZGdldEJhc2VDb25zdHJ1Y3RvciwgV2lkZ2V0QmFzZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vSW5qZWN0b3InO1xuXG5leHBvcnQgdHlwZSBXaWRnZXRCYXNlQ29uc3RydWN0b3JGdW5jdGlvbiA9ICgpID0+IFByb21pc2U8V2lkZ2V0QmFzZUNvbnN0cnVjdG9yPjtcblxuZXhwb3J0IHR5cGUgRVNNRGVmYXVsdFdpZGdldEJhc2VGdW5jdGlvbiA9ICgpID0+IFByb21pc2U8RVNNRGVmYXVsdFdpZGdldEJhc2U8V2lkZ2V0QmFzZUludGVyZmFjZT4+O1xuXG5leHBvcnQgdHlwZSBSZWdpc3RyeUl0ZW0gPVxuXHR8IFdpZGdldEJhc2VDb25zdHJ1Y3RvclxuXHR8IFByb21pc2U8V2lkZ2V0QmFzZUNvbnN0cnVjdG9yPlxuXHR8IFdpZGdldEJhc2VDb25zdHJ1Y3RvckZ1bmN0aW9uXG5cdHwgRVNNRGVmYXVsdFdpZGdldEJhc2VGdW5jdGlvbjtcblxuLyoqXG4gKiBXaWRnZXQgYmFzZSBzeW1ib2wgdHlwZVxuICovXG5leHBvcnQgY29uc3QgV0lER0VUX0JBU0VfVFlQRSA9IFN5bWJvbCgnV2lkZ2V0IEJhc2UnKTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyeUV2ZW50T2JqZWN0IGV4dGVuZHMgRXZlbnRPYmplY3Q8UmVnaXN0cnlMYWJlbD4ge1xuXHRhY3Rpb246IHN0cmluZztcblx0aXRlbTogV2lkZ2V0QmFzZUNvbnN0cnVjdG9yIHwgSW5qZWN0b3I7XG59XG5cbi8qKlxuICogV2lkZ2V0IFJlZ2lzdHJ5IEludGVyZmFjZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdHJ5SW50ZXJmYWNlIHtcblx0LyoqXG5cdCAqIERlZmluZSBhIFdpZGdldFJlZ2lzdHJ5SXRlbSBhZ2FpbnN0IGEgbGFiZWxcblx0ICpcblx0ICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgd2lkZ2V0IHRvIHJlZ2lzdGVyXG5cdCAqIEBwYXJhbSByZWdpc3RyeUl0ZW0gVGhlIHJlZ2lzdHJ5IGl0ZW0gdG8gZGVmaW5lXG5cdCAqL1xuXHRkZWZpbmUobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIHJlZ2lzdHJ5SXRlbTogUmVnaXN0cnlJdGVtKTogdm9pZDtcblxuXHQvKipcblx0ICogUmV0dXJuIGEgUmVnaXN0cnlJdGVtIGZvciB0aGUgZ2l2ZW4gbGFiZWwsIG51bGwgaWYgYW4gZW50cnkgZG9lc24ndCBleGlzdFxuXHQgKlxuXHQgKiBAcGFyYW0gd2lkZ2V0TGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB3aWRnZXQgdG8gcmV0dXJuXG5cdCAqIEByZXR1cm5zIFRoZSBSZWdpc3RyeUl0ZW0gZm9yIHRoZSB3aWRnZXRMYWJlbCwgYG51bGxgIGlmIG5vIGVudHJ5IGV4aXN0c1xuXHQgKi9cblx0Z2V0PFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gV2lkZ2V0QmFzZUludGVyZmFjZT4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBDb25zdHJ1Y3RvcjxUPiB8IG51bGw7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSBib29sZWFuIGlmIGFuIGVudHJ5IGZvciB0aGUgbGFiZWwgZXhpc3RzXG5cdCAqXG5cdCAqIEBwYXJhbSB3aWRnZXRMYWJlbCBUaGUgbGFiZWwgdG8gc2VhcmNoIGZvclxuXHQgKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgYSB3aWRnZXQgcmVnaXN0cnkgaXRlbSBleGlzdHNcblx0ICovXG5cdGhhcyhsYWJlbDogUmVnaXN0cnlMYWJlbCk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIERlZmluZSBhbiBJbmplY3RvciBhZ2FpbnN0IGEgbGFiZWxcblx0ICpcblx0ICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgaW5qZWN0b3IgdG8gcmVnaXN0ZXJcblx0ICogQHBhcmFtIHJlZ2lzdHJ5SXRlbSBUaGUgaW5qZWN0b3IgdG8gZGVmaW5lXG5cdCAqL1xuXHRkZWZpbmVJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCwgcmVnaXN0cnlJdGVtOiBJbmplY3Rvcik6IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFJldHVybiBhbiBJbmplY3RvciByZWdpc3RyeSBpdGVtIGZvciB0aGUgZ2l2ZW4gbGFiZWwsIG51bGwgaWYgYW4gZW50cnkgZG9lc24ndCBleGlzdFxuXHQgKlxuXHQgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSBpbmplY3RvciB0byByZXR1cm5cblx0ICogQHJldHVybnMgVGhlIFJlZ2lzdHJ5SXRlbSBmb3IgdGhlIHdpZGdldExhYmVsLCBgbnVsbGAgaWYgbm8gZW50cnkgZXhpc3RzXG5cdCAqL1xuXHRnZXRJbmplY3RvcjxUIGV4dGVuZHMgSW5qZWN0b3I+KGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogVCB8IG51bGw7XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSBib29sZWFuIGlmIGFuIGluamVjdG9yIGZvciB0aGUgbGFiZWwgZXhpc3RzXG5cdCAqXG5cdCAqIEBwYXJhbSB3aWRnZXRMYWJlbCBUaGUgbGFiZWwgdG8gc2VhcmNoIGZvclxuXHQgKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgYSBpbmplY3RvciByZWdpc3RyeSBpdGVtIGV4aXN0c1xuXHQgKi9cblx0aGFzSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENoZWNrcyBpcyB0aGUgaXRlbSBpcyBhIHN1YmNsYXNzIG9mIFdpZGdldEJhc2UgKG9yIGEgV2lkZ2V0QmFzZSlcbiAqXG4gKiBAcGFyYW0gaXRlbSB0aGUgaXRlbSB0byBjaGVja1xuICogQHJldHVybnMgdHJ1ZS9mYWxzZSBpbmRpY2F0aW5nIGlmIHRoZSBpdGVtIGlzIGEgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjxUIGV4dGVuZHMgV2lkZ2V0QmFzZUludGVyZmFjZT4oaXRlbTogYW55KTogaXRlbSBpcyBDb25zdHJ1Y3RvcjxUPiB7XG5cdHJldHVybiBCb29sZWFuKGl0ZW0gJiYgaXRlbS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRVNNRGVmYXVsdFdpZGdldEJhc2U8VD4ge1xuXHRkZWZhdWx0OiBDb25zdHJ1Y3RvcjxUPjtcblx0X19lc01vZHVsZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0PFQ+KGl0ZW06IGFueSk6IGl0ZW0gaXMgRVNNRGVmYXVsdFdpZGdldEJhc2U8VD4ge1xuXHRyZXR1cm4gQm9vbGVhbihcblx0XHRpdGVtICYmXG5cdFx0XHRpdGVtLmhhc093blByb3BlcnR5KCdfX2VzTW9kdWxlJykgJiZcblx0XHRcdGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxuXHRcdFx0aXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbS5kZWZhdWx0KVxuXHQpO1xufVxuXG4vKipcbiAqIFRoZSBSZWdpc3RyeSBpbXBsZW1lbnRhdGlvblxuICovXG5leHBvcnQgY2xhc3MgUmVnaXN0cnkgZXh0ZW5kcyBFdmVudGVkPHt9LCBSZWdpc3RyeUxhYmVsLCBSZWdpc3RyeUV2ZW50T2JqZWN0PiBpbXBsZW1lbnRzIFJlZ2lzdHJ5SW50ZXJmYWNlIHtcblx0LyoqXG5cdCAqIGludGVybmFsIG1hcCBvZiBsYWJlbHMgYW5kIFJlZ2lzdHJ5SXRlbVxuXHQgKi9cblx0cHJpdmF0ZSBfd2lkZ2V0UmVnaXN0cnk6IE1hcDxSZWdpc3RyeUxhYmVsLCBSZWdpc3RyeUl0ZW0+O1xuXG5cdHByaXZhdGUgX2luamVjdG9yUmVnaXN0cnk6IE1hcDxSZWdpc3RyeUxhYmVsLCBJbmplY3Rvcj47XG5cblx0LyoqXG5cdCAqIEVtaXQgbG9hZGVkIGV2ZW50IGZvciByZWdpc3RyeSBsYWJlbFxuXHQgKi9cblx0cHJpdmF0ZSBlbWl0TG9hZGVkRXZlbnQod2lkZ2V0TGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGl0ZW06IFdpZGdldEJhc2VDb25zdHJ1Y3RvciB8IEluamVjdG9yKTogdm9pZCB7XG5cdFx0dGhpcy5lbWl0KHtcblx0XHRcdHR5cGU6IHdpZGdldExhYmVsLFxuXHRcdFx0YWN0aW9uOiAnbG9hZGVkJyxcblx0XHRcdGl0ZW1cblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBkZWZpbmUobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGl0ZW06IFJlZ2lzdHJ5SXRlbSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXAoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGB3aWRnZXQgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnJHtsYWJlbC50b1N0cmluZygpfSdgKTtcblx0XHR9XG5cblx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xuXG5cdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRpdGVtLnRoZW4oXG5cdFx0XHRcdCh3aWRnZXRDdG9yKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCB3aWRnZXRDdG9yKTtcblx0XHRcdFx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdFx0cmV0dXJuIHdpZGdldEN0b3I7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcblx0XHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGl0ZW06IEluamVjdG9yKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9IG5ldyBNYXAoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGluamVjdG9yIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJyR7bGFiZWwudG9TdHJpbmcoKX0nYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5faW5qZWN0b3JSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xuXHRcdHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFdpZGdldEJhc2VJbnRlcmZhY2UgPSBXaWRnZXRCYXNlSW50ZXJmYWNlPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IENvbnN0cnVjdG9yPFQ+IHwgbnVsbCB7XG5cdFx0aWYgKCF0aGlzLmhhcyhsYWJlbCkpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLl93aWRnZXRSZWdpc3RyeS5nZXQobGFiZWwpO1xuXG5cdFx0aWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yPFQ+KGl0ZW0pKSB7XG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9XG5cblx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByb21pc2UgPSAoPFdpZGdldEJhc2VDb25zdHJ1Y3RvckZ1bmN0aW9uPml0ZW0pKCk7XG5cdFx0dGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcblxuXHRcdHByb21pc2UudGhlbihcblx0XHRcdCh3aWRnZXRDdG9yKSA9PiB7XG5cdFx0XHRcdGlmIChpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDxUPih3aWRnZXRDdG9yKSkge1xuXHRcdFx0XHRcdHdpZGdldEN0b3IgPSB3aWRnZXRDdG9yLmRlZmF1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xuXHRcdFx0XHR0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgd2lkZ2V0Q3Rvcik7XG5cdFx0XHRcdHJldHVybiB3aWRnZXRDdG9yO1xuXHRcdFx0fSxcblx0XHRcdChlcnJvcikgPT4ge1xuXHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwdWJsaWMgZ2V0SW5qZWN0b3I8VCBleHRlbmRzIEluamVjdG9yPihsYWJlbDogUmVnaXN0cnlMYWJlbCk6IFQgfCBudWxsIHtcblx0XHRpZiAoIXRoaXMuaGFzSW5qZWN0b3IobGFiZWwpKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5nZXQobGFiZWwpIGFzIFQ7XG5cdH1cblxuXHRwdWJsaWMgaGFzKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5fd2lkZ2V0UmVnaXN0cnkgJiYgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSk7XG5cdH1cblxuXHRwdWJsaWMgaGFzSW5qZWN0b3IobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ICYmIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUmVnaXN0cnkudHMiLCJpbXBvcnQgeyBNYXAgfSBmcm9tICdAZG9qby9zaGltL01hcCc7XG5pbXBvcnQgeyBFdmVudGVkIH0gZnJvbSAnQGRvam8vY29yZS9FdmVudGVkJztcbmltcG9ydCB7IEV2ZW50T2JqZWN0IH0gZnJvbSAnQGRvam8vY29yZS9pbnRlcmZhY2VzJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBSZWdpc3RyeUxhYmVsLCBXaWRnZXRCYXNlSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFJlZ2lzdHJ5LCBSZWdpc3RyeUV2ZW50T2JqZWN0LCBSZWdpc3RyeUl0ZW0gfSBmcm9tICcuL1JlZ2lzdHJ5JztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnLi9JbmplY3Rvcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVnaXN0cnlIYW5kbGVyRXZlbnRNYXAge1xuXHRpbnZhbGlkYXRlOiBFdmVudE9iamVjdDwnaW52YWxpZGF0ZSc+O1xufVxuXG5leHBvcnQgY2xhc3MgUmVnaXN0cnlIYW5kbGVyIGV4dGVuZHMgRXZlbnRlZDxSZWdpc3RyeUhhbmRsZXJFdmVudE1hcD4ge1xuXHRwcml2YXRlIF9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuXHRwcml2YXRlIF9yZWdpc3RyeVdpZGdldExhYmVsTWFwOiBNYXA8UmVnaXN0cnksIFJlZ2lzdHJ5TGFiZWxbXT4gPSBuZXcgTWFwKCk7XG5cdHByaXZhdGUgX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcDogTWFwPFJlZ2lzdHJ5LCBSZWdpc3RyeUxhYmVsW10+ID0gbmV3IE1hcCgpO1xuXHRwcm90ZWN0ZWQgYmFzZVJlZ2lzdHJ5PzogUmVnaXN0cnk7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm93bih0aGlzLl9yZWdpc3RyeSk7XG5cdFx0Y29uc3QgZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xuXHRcdFx0XHR0aGlzLmJhc2VSZWdpc3RyeSA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMub3duKHsgZGVzdHJveSB9KTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYmFzZShiYXNlUmVnaXN0cnk6IFJlZ2lzdHJ5KSB7XG5cdFx0aWYgKHRoaXMuYmFzZVJlZ2lzdHJ5KSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeVdpZGdldExhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcblx0XHR9XG5cdFx0dGhpcy5iYXNlUmVnaXN0cnkgPSBiYXNlUmVnaXN0cnk7XG5cdH1cblxuXHRwdWJsaWMgZGVmaW5lKGxhYmVsOiBSZWdpc3RyeUxhYmVsLCB3aWRnZXQ6IFJlZ2lzdHJ5SXRlbSk6IHZvaWQge1xuXHRcdHRoaXMuX3JlZ2lzdHJ5LmRlZmluZShsYWJlbCwgd2lkZ2V0KTtcblx0fVxuXG5cdHB1YmxpYyBkZWZpbmVJbmplY3RvcihsYWJlbDogUmVnaXN0cnlMYWJlbCwgaW5qZWN0b3I6IEluamVjdG9yKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcblx0fVxuXG5cdHB1YmxpYyBoYXMobGFiZWw6IFJlZ2lzdHJ5TGFiZWwpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzKGxhYmVsKSB8fCBCb29sZWFuKHRoaXMuYmFzZVJlZ2lzdHJ5ICYmIHRoaXMuYmFzZVJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xuXHR9XG5cblx0cHVibGljIGhhc0luamVjdG9yKGxhYmVsOiBSZWdpc3RyeUxhYmVsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlZ2lzdHJ5Lmhhc0luamVjdG9yKGxhYmVsKSB8fCBCb29sZWFuKHRoaXMuYmFzZVJlZ2lzdHJ5ICYmIHRoaXMuYmFzZVJlZ2lzdHJ5Lmhhc0luamVjdG9yKGxhYmVsKSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gV2lkZ2V0QmFzZUludGVyZmFjZT4oXG5cdFx0bGFiZWw6IFJlZ2lzdHJ5TGFiZWwsXG5cdFx0Z2xvYmFsUHJlY2VkZW5jZTogYm9vbGVhbiA9IGZhbHNlXG5cdCk6IENvbnN0cnVjdG9yPFQ+IHwgbnVsbCB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldCcsIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXApO1xuXHR9XG5cblx0cHVibGljIGdldEluamVjdG9yPFQgZXh0ZW5kcyBJbmplY3Rvcj4obGFiZWw6IFJlZ2lzdHJ5TGFiZWwsIGdsb2JhbFByZWNlZGVuY2U6IGJvb2xlYW4gPSBmYWxzZSk6IFQgfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0SW5qZWN0b3InLCB0aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXApO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0KFxuXHRcdGxhYmVsOiBSZWdpc3RyeUxhYmVsLFxuXHRcdGdsb2JhbFByZWNlZGVuY2U6IGJvb2xlYW4sXG5cdFx0Z2V0RnVuY3Rpb25OYW1lOiAnZ2V0SW5qZWN0b3InIHwgJ2dldCcsXG5cdFx0bGFiZWxNYXA6IE1hcDxSZWdpc3RyeSwgUmVnaXN0cnlMYWJlbFtdPlxuXHQpOiBhbnkge1xuXHRcdGNvbnN0IHJlZ2lzdHJpZXMgPSBnbG9iYWxQcmVjZWRlbmNlID8gW3RoaXMuYmFzZVJlZ2lzdHJ5LCB0aGlzLl9yZWdpc3RyeV0gOiBbdGhpcy5fcmVnaXN0cnksIHRoaXMuYmFzZVJlZ2lzdHJ5XTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlZ2lzdHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHJlZ2lzdHJ5OiBhbnkgPSByZWdpc3RyaWVzW2ldO1xuXHRcdFx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGl0ZW0gPSByZWdpc3RyeVtnZXRGdW5jdGlvbk5hbWVdKGxhYmVsKTtcblx0XHRcdGNvbnN0IHJlZ2lzdGVyZWRMYWJlbHMgPSBsYWJlbE1hcC5nZXQocmVnaXN0cnkpIHx8IFtdO1xuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9IGVsc2UgaWYgKHJlZ2lzdGVyZWRMYWJlbHMuaW5kZXhPZihsYWJlbCkgPT09IC0xKSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZSA9IHJlZ2lzdHJ5Lm9uKGxhYmVsLCAoZXZlbnQ6IFJlZ2lzdHJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRldmVudC5hY3Rpb24gPT09ICdsb2FkZWQnICYmXG5cdFx0XHRcdFx0XHQodGhpcyBhcyBhbnkpW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5vd24oaGFuZGxlKTtcblx0XHRcdFx0bGFiZWxNYXAuc2V0KHJlZ2lzdHJ5LCBbLi4ucmVnaXN0ZXJlZExhYmVscywgbGFiZWxdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnlIYW5kbGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFJlZ2lzdHJ5SGFuZGxlci50cyIsImltcG9ydCBNYXAgZnJvbSAnQGRvam8vc2hpbS9NYXAnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCB7IHYgfSBmcm9tICcuL2QnO1xuaW1wb3J0IHsgYXV0byB9IGZyb20gJy4vZGlmZic7XG5pbXBvcnQge1xuXHRBZnRlclJlbmRlcixcblx0QmVmb3JlUHJvcGVydGllcyxcblx0QmVmb3JlUmVuZGVyLFxuXHRDb3JlUHJvcGVydGllcyxcblx0RGlmZlByb3BlcnR5UmVhY3Rpb24sXG5cdEROb2RlLFxuXHRSZW5kZXIsXG5cdFdpZGdldE1ldGFCYXNlLFxuXHRXaWRnZXRNZXRhQ29uc3RydWN0b3IsXG5cdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFdpZGdldFByb3BlcnRpZXNcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCBSZWdpc3RyeUhhbmRsZXIgZnJvbSAnLi9SZWdpc3RyeUhhbmRsZXInO1xuaW1wb3J0IE5vZGVIYW5kbGVyIGZyb20gJy4vTm9kZUhhbmRsZXInO1xuaW1wb3J0IHsgd2lkZ2V0SW5zdGFuY2VNYXAgfSBmcm9tICcuL3Zkb20nO1xuaW1wb3J0IHsgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IsIFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcblxuaW50ZXJmYWNlIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHMge1xuXHRwcmV2aW91c1Byb3BlcnRpZXM6IGFueTtcblx0bmV3UHJvcGVydGllczogYW55O1xuXHRjaGFuZ2VkOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgUmVhY3Rpb25GdW5jdGlvbkNvbmZpZyB7XG5cdHByb3BlcnR5TmFtZTogc3RyaW5nO1xuXHRyZWFjdGlvbjogRGlmZlByb3BlcnR5UmVhY3Rpb247XG59XG5cbmV4cG9ydCB0eXBlIEJvdW5kRnVuY3Rpb25EYXRhID0geyBib3VuZEZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55OyBzY29wZTogYW55IH07XG5cbmNvbnN0IGRlY29yYXRvck1hcCA9IG5ldyBNYXA8RnVuY3Rpb24sIE1hcDxzdHJpbmcsIGFueVtdPj4oKTtcbmNvbnN0IGJvdW5kQXV0byA9IGF1dG8uYmluZChudWxsKTtcblxuLyoqXG4gKiBNYWluIHdpZGdldCBiYXNlIGZvciBhbGwgd2lkZ2V0cyB0byBleHRlbmRcbiAqL1xuZXhwb3J0IGNsYXNzIFdpZGdldEJhc2U8UCA9IFdpZGdldFByb3BlcnRpZXMsIEMgZXh0ZW5kcyBETm9kZSA9IEROb2RlPiBpbXBsZW1lbnRzIFdpZGdldEJhc2VJbnRlcmZhY2U8UCwgQz4ge1xuXHQvKipcblx0ICogc3RhdGljIGlkZW50aWZpZXJcblx0ICovXG5cdHN0YXRpYyBfdHlwZTogc3ltYm9sID0gV0lER0VUX0JBU0VfVFlQRTtcblxuXHQvKipcblx0ICogY2hpbGRyZW4gYXJyYXlcblx0ICovXG5cdHByaXZhdGUgX2NoaWxkcmVuOiAoQyB8IG51bGwpW107XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyBpZiBpdCBpcyB0aGUgaW5pdGlhbCBzZXQgcHJvcGVydGllcyBjeWNsZVxuXHQgKi9cblx0cHJpdmF0ZSBfaW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBpbnRlcm5hbCB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0cHJpdmF0ZSBfcHJvcGVydGllczogUCAmIFdpZGdldFByb3BlcnRpZXMgJiB7IFtpbmRleDogc3RyaW5nXTogYW55IH07XG5cblx0LyoqXG5cdCAqIEFycmF5IG9mIHByb3BlcnR5IGtleXMgY29uc2lkZXJlZCBjaGFuZ2VkIGZyb20gdGhlIHByZXZpb3VzIHNldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwcml2YXRlIF9jaGFuZ2VkUHJvcGVydHlLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXG5cdC8qKlxuXHQgKiBtYXAgb2YgZGVjb3JhdG9ycyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoaXMgd2lkZ2V0XG5cdCAqL1xuXHRwcml2YXRlIF9kZWNvcmF0b3JDYWNoZTogTWFwPHN0cmluZywgYW55W10+O1xuXG5cdHByaXZhdGUgX3JlZ2lzdHJ5OiBSZWdpc3RyeUhhbmRsZXI7XG5cblx0LyoqXG5cdCAqIE1hcCBvZiBmdW5jdGlvbnMgcHJvcGVydGllcyBmb3IgdGhlIGJvdW5kIGZ1bmN0aW9uXG5cdCAqL1xuXHRwcml2YXRlIF9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcDogV2Vha01hcDwoLi4uYXJnczogYW55W10pID0+IGFueSwgQm91bmRGdW5jdGlvbkRhdGE+O1xuXG5cdHByaXZhdGUgX21ldGFNYXA6IE1hcDxXaWRnZXRNZXRhQ29uc3RydWN0b3I8YW55PiwgV2lkZ2V0TWV0YUJhc2U+O1xuXG5cdHByaXZhdGUgX2JvdW5kUmVuZGVyRnVuYzogUmVuZGVyO1xuXG5cdHByaXZhdGUgX2JvdW5kSW52YWxpZGF0ZTogKCkgPT4gdm9pZDtcblxuXHRwcml2YXRlIF9ub2RlSGFuZGxlcjogTm9kZUhhbmRsZXIgPSBuZXcgTm9kZUhhbmRsZXIoKTtcblxuXHQvKipcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXHRcdHRoaXMuX2RlY29yYXRvckNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIGFueVtdPigpO1xuXHRcdHRoaXMuX3Byb3BlcnRpZXMgPSA8UD57fTtcblx0XHR0aGlzLl9ib3VuZFJlbmRlckZ1bmMgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuX2JvdW5kSW52YWxpZGF0ZSA9IHRoaXMuaW52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuXG5cdFx0d2lkZ2V0SW5zdGFuY2VNYXAuc2V0KHRoaXMsIHtcblx0XHRcdGRpcnR5OiB0cnVlLFxuXHRcdFx0b25BdHRhY2g6ICgpOiB2b2lkID0+IHtcblx0XHRcdFx0dGhpcy5vbkF0dGFjaCgpO1xuXHRcdFx0fSxcblx0XHRcdG9uRGV0YWNoOiAoKTogdm9pZCA9PiB7XG5cdFx0XHRcdHRoaXMub25EZXRhY2goKTtcblx0XHRcdFx0dGhpcy5fZGVzdHJveSgpO1xuXHRcdFx0fSxcblx0XHRcdG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcblx0XHRcdHJlZ2lzdHJ5OiAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlZ2lzdHJ5O1xuXHRcdFx0fSxcblx0XHRcdGNvcmVQcm9wZXJ0aWVzOiB7fSBhcyBDb3JlUHJvcGVydGllcyxcblx0XHRcdHJlbmRlcmluZzogZmFsc2UsXG5cdFx0XHRpbnB1dFByb3BlcnRpZXM6IHt9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9ydW5BZnRlckNvbnN0cnVjdG9ycygpO1xuXHR9XG5cblx0cHJvdGVjdGVkIG1ldGE8VCBleHRlbmRzIFdpZGdldE1ldGFCYXNlPihNZXRhVHlwZTogV2lkZ2V0TWV0YUNvbnN0cnVjdG9yPFQ+KTogVCB7XG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcCA9IG5ldyBNYXA8V2lkZ2V0TWV0YUNvbnN0cnVjdG9yPGFueT4sIFdpZGdldE1ldGFCYXNlPigpO1xuXHRcdH1cblx0XHRsZXQgY2FjaGVkID0gdGhpcy5fbWV0YU1hcC5nZXQoTWV0YVR5cGUpO1xuXHRcdGlmICghY2FjaGVkKSB7XG5cdFx0XHRjYWNoZWQgPSBuZXcgTWV0YVR5cGUoe1xuXHRcdFx0XHRpbnZhbGlkYXRlOiB0aGlzLl9ib3VuZEludmFsaWRhdGUsXG5cdFx0XHRcdG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcblx0XHRcdFx0YmluZDogdGhpc1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9tZXRhTWFwLnNldChNZXRhVHlwZSwgY2FjaGVkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGVkIGFzIFQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgb25BdHRhY2goKTogdm9pZCB7XG5cdFx0Ly8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxuXHR9XG5cblx0cHJvdGVjdGVkIG9uRGV0YWNoKCk6IHZvaWQge1xuXHRcdC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cblx0fVxuXG5cdHB1YmxpYyBnZXQgcHJvcGVydGllcygpOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFdpZGdldFByb3BlcnRpZXM+IHtcblx0XHRyZXR1cm4gdGhpcy5fcHJvcGVydGllcztcblx0fVxuXG5cdHB1YmxpYyBnZXQgY2hhbmdlZFByb3BlcnR5S2V5cygpOiBzdHJpbmdbXSB7XG5cdFx0cmV0dXJuIFsuLi50aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzXTtcblx0fVxuXG5cdHB1YmxpYyBfX3NldENvcmVQcm9wZXJ0aWVzX18oY29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzKTogdm9pZCB7XG5cdFx0Y29uc3QgeyBiYXNlUmVnaXN0cnkgfSA9IGNvcmVQcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cblx0XHRpZiAoaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeSAhPT0gYmFzZVJlZ2lzdHJ5KSB7XG5cdFx0XHRpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXIoKTtcblx0XHRcdFx0dGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVnaXN0cnkuYmFzZSA9IGJhc2VSZWdpc3RyeTtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMgPSBjb3JlUHJvcGVydGllcztcblx0fVxuXG5cdHB1YmxpYyBfX3NldFByb3BlcnRpZXNfXyhvcmlnaW5hbFByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cdFx0aW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyA9IG9yaWdpbmFsUHJvcGVydGllcztcblx0XHRjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5fcnVuQmVmb3JlUHJvcGVydGllcyhvcmlnaW5hbFByb3BlcnRpZXMpO1xuXHRcdGNvbnN0IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5Jyk7XG5cdFx0Y29uc3QgY2hhbmdlZFByb3BlcnR5S2V5czogc3RyaW5nW10gPSBbXTtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cblx0XHRpZiAodGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPT09IGZhbHNlIHx8IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5sZW5ndGggIT09IDApIHtcblx0XHRcdGNvbnN0IGFsbFByb3BlcnRpZXMgPSBbLi4ucHJvcGVydHlOYW1lcywgLi4uT2JqZWN0LmtleXModGhpcy5fcHJvcGVydGllcyldO1xuXHRcdFx0Y29uc3QgY2hlY2tlZFByb3BlcnRpZXM6IChzdHJpbmcgfCBudW1iZXIpW10gPSBbXTtcblx0XHRcdGNvbnN0IGRpZmZQcm9wZXJ0eVJlc3VsdHM6IGFueSA9IHt9O1xuXHRcdFx0bGV0IHJ1blJlYWN0aW9ucyA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gYWxsUHJvcGVydGllc1tpXTtcblx0XHRcdFx0aWYgKGNoZWNrZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHlOYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGVja2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdGNvbnN0IHByZXZpb3VzUHJvcGVydHkgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRcdGNvbnN0IG5ld1Byb3BlcnR5ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkoXG5cdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLFxuXHRcdFx0XHRcdGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChyZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJ1blJlYWN0aW9ucyA9IHRydWU7XG5cdFx0XHRcdFx0Y29uc3QgZGlmZkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBkaWZmRnVuY3Rpb25zW2ldKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdFx0ZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBib3VuZEF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHRcdFx0XHRcdGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRcdGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHJ1blJlYWN0aW9ucykge1xuXHRcdFx0XHR0aGlzLl9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMocHJvcGVydGllcywgY2hhbmdlZFByb3BlcnR5S2V5cykuZm9yRWFjaCgoYXJncywgcmVhY3Rpb24pID0+IHtcblx0XHRcdFx0XHRpZiAoYXJncy5jaGFuZ2VkKSB7XG5cdFx0XHRcdFx0XHRyZWFjdGlvbi5jYWxsKHRoaXMsIGFyZ3MucHJldmlvdXNQcm9wZXJ0aWVzLCBhcmdzLm5ld1Byb3BlcnRpZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzID0gZGlmZlByb3BlcnR5UmVzdWx0cztcblx0XHRcdHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IGZhbHNlO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZXNbaV07XG5cdFx0XHRcdGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkoXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sXG5cdFx0XHRcdFx0XHRpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xuXHRcdFx0dGhpcy5fcHJvcGVydGllcyA9IHsgLi4ucHJvcGVydGllcyB9O1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBnZXQgY2hpbGRyZW4oKTogKEMgfCBudWxsKVtdIHtcblx0XHRyZXR1cm4gdGhpcy5fY2hpbGRyZW47XG5cdH1cblxuXHRwdWJsaWMgX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuOiAoQyB8IG51bGwpW10pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9fcmVuZGVyX18oKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcykhO1xuXHRcdGluc3RhbmNlRGF0YS5kaXJ0eSA9IGZhbHNlO1xuXHRcdGNvbnN0IHJlbmRlciA9IHRoaXMuX3J1bkJlZm9yZVJlbmRlcnMoKTtcblx0XHRsZXQgZE5vZGUgPSByZW5kZXIoKTtcblx0XHRkTm9kZSA9IHRoaXMucnVuQWZ0ZXJSZW5kZXJzKGROb2RlKTtcblx0XHR0aGlzLl9ub2RlSGFuZGxlci5jbGVhcigpO1xuXHRcdHJldHVybiBkTm9kZTtcblx0fVxuXG5cdHB1YmxpYyBpbnZhbGlkYXRlKCk6IHZvaWQge1xuXHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKSE7XG5cdFx0aWYgKGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlKSB7XG5cdFx0XHRpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCByZW5kZXIoKTogRE5vZGUgfCBETm9kZVtdIHtcblx0XHRyZXR1cm4gdignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGFkZCBkZWNvcmF0b3JzIHRvIFdpZGdldEJhc2Vcblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqL1xuXHRwcm90ZWN0ZWQgYWRkRGVjb3JhdG9yKGRlY29yYXRvcktleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG5cdFx0dmFsdWUgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcblx0XHRpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuXHRcdFx0bGV0IGRlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JNYXAuZ2V0KHRoaXMuY29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKCFkZWNvcmF0b3JMaXN0KSB7XG5cdFx0XHRcdGRlY29yYXRvckxpc3QgPSBuZXcgTWFwPHN0cmluZywgYW55W10+KCk7XG5cdFx0XHRcdGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JMaXN0LmdldChkZWNvcmF0b3JLZXkpO1xuXHRcdFx0aWYgKCFzcGVjaWZpY0RlY29yYXRvckxpc3QpIHtcblx0XHRcdFx0c3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gW107XG5cdFx0XHRcdGRlY29yYXRvckxpc3Quc2V0KGRlY29yYXRvcktleSwgc3BlY2lmaWNEZWNvcmF0b3JMaXN0KTtcblx0XHRcdH1cblx0XHRcdHNwZWNpZmljRGVjb3JhdG9yTGlzdC5wdXNoKC4uLnZhbHVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZGVjb3JhdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKGRlY29yYXRvcktleSk7XG5cdFx0XHR0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBbLi4uZGVjb3JhdG9ycywgLi4udmFsdWVdKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gYnVpbGQgdGhlIGxpc3Qgb2YgZGVjb3JhdG9ycyBmcm9tIHRoZSBnbG9iYWwgZGVjb3JhdG9yIG1hcC5cblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXG5cdCAqIEByZXR1cm4gQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleTogc3RyaW5nKTogYW55W10ge1xuXHRcdGNvbnN0IGFsbERlY29yYXRvcnMgPSBbXTtcblxuXHRcdGxldCBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG5cblx0XHR3aGlsZSAoY29uc3RydWN0b3IpIHtcblx0XHRcdGNvbnN0IGluc3RhbmNlTWFwID0gZGVjb3JhdG9yTWFwLmdldChjb25zdHJ1Y3Rvcik7XG5cdFx0XHRpZiAoaW5zdGFuY2VNYXApIHtcblx0XHRcdFx0Y29uc3QgZGVjb3JhdG9ycyA9IGluc3RhbmNlTWFwLmdldChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0XHRcdGlmIChkZWNvcmF0b3JzKSB7XG5cdFx0XHRcdFx0YWxsRGVjb3JhdG9ycy51bnNoaWZ0KC4uLmRlY29yYXRvcnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0cnVjdG9yID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnN0cnVjdG9yKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYWxsRGVjb3JhdG9ycztcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cm95cyBwcml2YXRlIHJlc291cmNlcyBmb3IgV2lkZ2V0QmFzZVxuXHQgKi9cblx0cHJpdmF0ZSBfZGVzdHJveSgpIHtcblx0XHRpZiAodGhpcy5fcmVnaXN0cnkpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5LmRlc3Ryb3koKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG5cdFx0XHRcdG1ldGEuZGVzdHJveSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIGRlY29yYXRvciB2YWx1ZXNcblx0ICpcblx0ICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3Jcblx0ICogQHJldHVybnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xuXHQgKi9cblx0cHJvdGVjdGVkIGdldERlY29yYXRvcihkZWNvcmF0b3JLZXk6IHN0cmluZyk6IGFueVtdIHtcblx0XHRsZXQgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2RlY29yYXRvckNhY2hlLmdldChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0aWYgKGFsbERlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdFx0fVxuXG5cdFx0YWxsRGVjb3JhdG9ycyA9IHRoaXMuX2J1aWxkRGVjb3JhdG9yTGlzdChkZWNvcmF0b3JLZXkpO1xuXG5cdFx0dGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgYWxsRGVjb3JhdG9ycyk7XG5cdFx0cmV0dXJuIGFsbERlY29yYXRvcnM7XG5cdH1cblxuXHRwcml2YXRlIF9tYXBEaWZmUHJvcGVydHlSZWFjdGlvbnMoXG5cdFx0bmV3UHJvcGVydGllczogYW55LFxuXHRcdGNoYW5nZWRQcm9wZXJ0eUtleXM6IHN0cmluZ1tdXG5cdCk6IE1hcDxGdW5jdGlvbiwgUmVhY3Rpb25GdW5jdGlvbkFyZ3VtZW50cz4ge1xuXHRcdGNvbnN0IHJlYWN0aW9uRnVuY3Rpb25zOiBSZWFjdGlvbkZ1bmN0aW9uQ29uZmlnW10gPSB0aGlzLmdldERlY29yYXRvcignZGlmZlJlYWN0aW9uJyk7XG5cblx0XHRyZXR1cm4gcmVhY3Rpb25GdW5jdGlvbnMucmVkdWNlKChyZWFjdGlvblByb3BlcnR5TWFwLCB7IHJlYWN0aW9uLCBwcm9wZXJ0eU5hbWUgfSkgPT4ge1xuXHRcdFx0bGV0IHJlYWN0aW9uQXJndW1lbnRzID0gcmVhY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocmVhY3Rpb24pO1xuXHRcdFx0aWYgKHJlYWN0aW9uQXJndW1lbnRzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMgPSB7XG5cdFx0XHRcdFx0cHJldmlvdXNQcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0XHRuZXdQcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0XHRjaGFuZ2VkOiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmVhY3Rpb25Bcmd1bWVudHMucHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRyZWFjdGlvbkFyZ3VtZW50cy5uZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBuZXdQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRpZiAoY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdHJlYWN0aW9uQXJndW1lbnRzLmNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmVhY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocmVhY3Rpb24sIHJlYWN0aW9uQXJndW1lbnRzKTtcblx0XHRcdHJldHVybiByZWFjdGlvblByb3BlcnR5TWFwO1xuXHRcdH0sIG5ldyBNYXA8RnVuY3Rpb24sIFJlYWN0aW9uRnVuY3Rpb25Bcmd1bWVudHM+KCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHVuYm91bmQgcHJvcGVydHkgZnVuY3Rpb25zIHRvIHRoZSBzcGVjaWZpZWQgYGJpbmRgIHByb3BlcnR5XG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yIGZ1bmN0aW9uc1xuXHQgKi9cblx0cHJpdmF0ZSBfYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydHk6IGFueSwgYmluZDogYW55KTogYW55IHtcblx0XHRpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnZnVuY3Rpb24nICYmIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKHByb3BlcnR5KSA9PT0gZmFsc2UpIHtcblx0XHRcdGlmICh0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwID0gbmV3IFdlYWtNYXA8XG5cdFx0XHRcdFx0KC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksXG5cdFx0XHRcdFx0eyBib3VuZEZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55OyBzY29wZTogYW55IH1cblx0XHRcdFx0PigpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgYmluZEluZm86IFBhcnRpYWw8Qm91bmRGdW5jdGlvbkRhdGE+ID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuZ2V0KHByb3BlcnR5KSB8fCB7fTtcblx0XHRcdGxldCB7IGJvdW5kRnVuYywgc2NvcGUgfSA9IGJpbmRJbmZvO1xuXG5cdFx0XHRpZiAoYm91bmRGdW5jID09PSB1bmRlZmluZWQgfHwgc2NvcGUgIT09IGJpbmQpIHtcblx0XHRcdFx0Ym91bmRGdW5jID0gcHJvcGVydHkuYmluZChiaW5kKSBhcyAoLi4uYXJnczogYW55W10pID0+IGFueTtcblx0XHRcdFx0dGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAuc2V0KHByb3BlcnR5LCB7IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYm91bmRGdW5jO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvcGVydHk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHJlZ2lzdHJ5KCk6IFJlZ2lzdHJ5SGFuZGxlciB7XG5cdFx0aWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcigpO1xuXHRcdFx0dGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0cnk7XG5cdH1cblxuXHRwcml2YXRlIF9ydW5CZWZvcmVQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSkge1xuXHRcdGNvbnN0IGJlZm9yZVByb3BlcnRpZXM6IEJlZm9yZVByb3BlcnRpZXNbXSA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJyk7XG5cdFx0aWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGJlZm9yZVByb3BlcnRpZXMucmVkdWNlKFxuXHRcdFx0XHQocHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHsgLi4ucHJvcGVydGllcywgLi4uYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwodGhpcywgcHJvcGVydGllcykgfTtcblx0XHRcdFx0fSxcblx0XHRcdFx0eyAuLi5wcm9wZXJ0aWVzIH1cblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9wZXJ0aWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBiZWZvcmUgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSB1cGRhdGVkIHJlbmRlciBtZXRob2Rcblx0ICovXG5cdHByaXZhdGUgX3J1bkJlZm9yZVJlbmRlcnMoKTogUmVuZGVyIHtcblx0XHRjb25zdCBiZWZvcmVSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVJlbmRlcicpO1xuXG5cdFx0aWYgKGJlZm9yZVJlbmRlcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIGJlZm9yZVJlbmRlcnMucmVkdWNlKChyZW5kZXI6IFJlbmRlciwgYmVmb3JlUmVuZGVyRnVuY3Rpb246IEJlZm9yZVJlbmRlcikgPT4ge1xuXHRcdFx0XHRjb25zdCB1cGRhdGVkUmVuZGVyID0gYmVmb3JlUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCByZW5kZXIsIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2NoaWxkcmVuKTtcblx0XHRcdFx0aWYgKCF1cGRhdGVkUmVuZGVyKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdSZW5kZXIgZnVuY3Rpb24gbm90IHJldHVybmVkIGZyb20gYmVmb3JlUmVuZGVyLCB1c2luZyBwcmV2aW91cyByZW5kZXInKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVuZGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB1cGRhdGVkUmVuZGVyO1xuXHRcdFx0fSwgdGhpcy5fYm91bmRSZW5kZXJGdW5jKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kUmVuZGVyRnVuYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYWZ0ZXIgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSBkZWNvcmF0ZWQgRE5vZGVzXG5cdCAqXG5cdCAqIEBwYXJhbSBkTm9kZSBUaGUgRE5vZGVzIHRvIHJ1biB0aHJvdWdoIHRoZSBhZnRlciByZW5kZXJzXG5cdCAqL1xuXHRwcm90ZWN0ZWQgcnVuQWZ0ZXJSZW5kZXJzKGROb2RlOiBETm9kZSB8IEROb2RlW10pOiBETm9kZSB8IEROb2RlW10ge1xuXHRcdGNvbnN0IGFmdGVyUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlclJlbmRlcicpO1xuXG5cdFx0aWYgKGFmdGVyUmVuZGVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gYWZ0ZXJSZW5kZXJzLnJlZHVjZSgoZE5vZGU6IEROb2RlIHwgRE5vZGVbXSwgYWZ0ZXJSZW5kZXJGdW5jdGlvbjogQWZ0ZXJSZW5kZXIpID0+IHtcblx0XHRcdFx0cmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBkTm9kZSk7XG5cdFx0XHR9LCBkTm9kZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX21ldGFNYXAgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fbWV0YU1hcC5mb3JFYWNoKChtZXRhKSA9PiB7XG5cdFx0XHRcdG1ldGEuYWZ0ZXJSZW5kZXIoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBkTm9kZTtcblx0fVxuXG5cdHByaXZhdGUgX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk6IHZvaWQge1xuXHRcdGNvbnN0IGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcblxuXHRcdGlmIChhZnRlckNvbnN0cnVjdG9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRhZnRlckNvbnN0cnVjdG9ycy5mb3JFYWNoKChhZnRlckNvbnN0cnVjdG9yKSA9PiBhZnRlckNvbnN0cnVjdG9yLmNhbGwodGhpcykpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBXaWRnZXRCYXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIFdpZGdldEJhc2UudHMiLCJpbXBvcnQgeyBWTm9kZVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG5sZXQgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xubGV0IGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVCcm93c2VyU3R5bGVOYW1lcyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuXHRpZiAoJ1dlYmtpdFRyYW5zaXRpb24nIGluIGVsZW1lbnQuc3R5bGUpIHtcblx0XHRicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xuXHRcdGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRBbmltYXRpb25FbmQnO1xuXHR9IGVsc2UgaWYgKCd0cmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlIHx8ICdNb3pUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XG5cdFx0YnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd0cmFuc2l0aW9uZW5kJztcblx0XHRicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnYW5pbWF0aW9uZW5kJztcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuXHRpZiAoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID09PSAnJykge1xuXHRcdGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFuZENsZWFuVXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHN0YXJ0QW5pbWF0aW9uOiAoKSA9PiB2b2lkLCBmaW5pc2hBbmltYXRpb246ICgpID0+IHZvaWQpIHtcblx0aW5pdGlhbGl6ZShlbGVtZW50KTtcblxuXHRsZXQgZmluaXNoZWQgPSBmYWxzZTtcblxuXHRsZXQgdHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghZmluaXNoZWQpIHtcblx0XHRcdGZpbmlzaGVkID0gdHJ1ZTtcblx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xuXG5cdFx0XHRmaW5pc2hBbmltYXRpb24oKTtcblx0XHR9XG5cdH07XG5cblx0c3RhcnRBbmltYXRpb24oKTtcblxuXHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcblx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xufVxuXG5mdW5jdGlvbiBleGl0KG5vZGU6IEhUTUxFbGVtZW50LCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsIGV4aXRBbmltYXRpb246IHN0cmluZywgcmVtb3ZlTm9kZTogKCkgPT4gdm9pZCkge1xuXHRjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbkFjdGl2ZSB8fCBgJHtleGl0QW5pbWF0aW9ufS1hY3RpdmVgO1xuXG5cdHJ1bkFuZENsZWFuVXAoXG5cdFx0bm9kZSxcblx0XHQoKSA9PiB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQoZXhpdEFuaW1hdGlvbik7XG5cblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0KCkgPT4ge1xuXHRcdFx0cmVtb3ZlTm9kZSgpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gZW50ZXIobm9kZTogSFRNTEVsZW1lbnQsIHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcywgZW50ZXJBbmltYXRpb246IHN0cmluZykge1xuXHRjb25zdCBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZW50ZXJBbmltYXRpb25BY3RpdmUgfHwgYCR7ZW50ZXJBbmltYXRpb259LWFjdGl2ZWA7XG5cblx0cnVuQW5kQ2xlYW5VcChcblx0XHRub2RlLFxuXHRcdCgpID0+IHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChlbnRlckFuaW1hdGlvbik7XG5cblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0KCkgPT4ge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKGVudGVyQW5pbWF0aW9uKTtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XG5cdFx0fVxuXHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGVudGVyLFxuXHRleGl0XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGNzc1RyYW5zaXRpb25zLnRzIiwiaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IGZyb20gYXMgYXJyYXlGcm9tIH0gZnJvbSAnQGRvam8vc2hpbS9hcnJheSc7XG5pbXBvcnQgZ2xvYmFsIGZyb20gJ0Bkb2pvL3NoaW0vZ2xvYmFsJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBETm9kZSwgVk5vZGUsIFZOb2RlUHJvcGVydGllcywgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IHYsIHcgfSBmcm9tICcuL2QnO1xuaW1wb3J0IHsgRG9tV3JhcHBlciB9IGZyb20gJy4vdXRpbC9Eb21XcmFwcGVyJztcbmltcG9ydCB7IFByb2plY3Rvck1peGluIH0gZnJvbSAnLi9taXhpbnMvUHJvamVjdG9yJztcbmltcG9ydCB7IEludGVybmFsVk5vZGUgfSBmcm9tICcuL3Zkb20nO1xuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yXG4gKlxuICogRGVzY3JpYmVzIGEgY3VzdG9tIGVsZW1lbnQgYXR0cmlidXRlXG4gKlxuICogQHByb3BlcnR5IGF0dHJpYnV0ZU5hbWUgICBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIG9uIHRoZSBET00gZWxlbWVudFxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb24gdGhlIHdpZGdldFxuICogQHByb3BlcnR5IHZhbHVlICAgICAgICAgICBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgb3IgbnVsbCB2YWx1ZSwgYW5kIHJldHVybnMgYSBuZXcgdmFsdWUuIFRoZSB3aWRnZXQncyBwcm9wZXJ0eSB3aWxsIGJlIHNldCB0byB0aGUgbmV3IHZhbHVlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVEZXNjcmlwdG9yIHtcblx0YXR0cmlidXRlTmFtZTogc3RyaW5nO1xuXHRwcm9wZXJ0eU5hbWU/OiBzdHJpbmc7XG5cdHZhbHVlPzogKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiBhbnk7XG59XG5cbi8qKlxuICogQHR5cGUgQ3VzdG9tRWxlbWVudFByb3BlcnR5RGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIHdpZGdldCBwcm9wZXJ0eSBleHBvc2VkIHZpYSBhIGN1c3RvbSBlbGVtZW50XG4gKlxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICAgICAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSBET00gZWxlbWVudFxuICogQHByb3BlcnR5IHdpZGdldFByb3BlcnR5TmFtZSAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9uIHRoZSB3aWRnZXRcbiAqIEBwcm9wZXJ0eSBnZXRWYWx1ZSAgICAgICAgICAgIEEgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gb24gdGhlIHdpZGdldCdzIHByb3BlcnR5IHZhbHVlXG4gKiBAcHJvcGVydHkgc2V0VmFsdWUgICAgICAgICAgICBBIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIG9uIHRoZSBET00gZWxlbWVudHMgcHJvcGVydHkgdmFsdWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50UHJvcGVydHlEZXNjcmlwdG9yIHtcblx0cHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cdHdpZGdldFByb3BlcnR5TmFtZT86IHN0cmluZztcblx0Z2V0VmFsdWU/OiAodmFsdWU6IGFueSkgPT4gYW55O1xuXHRzZXRWYWx1ZT86ICh2YWx1ZTogYW55KSA9PiBhbnk7XG59XG5cbi8qKlxuICogQHR5cGUgQ3VzdG9tRWxlbWVudEV2ZW50RGVzY3JpcHRvclxuICpcbiAqIERlc2NyaWJlcyBhIGN1c3RvbSBlbGVtZW50IGV2ZW50XG4gKlxuICogQHByb3BlcnR5IHByb3BlcnR5TmFtZSAgICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb24gdGhlIHdpZGdldCB0aGF0IHRha2VzIGEgZnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSBldmVudE5hbWUgICAgICAgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgKGl0IHdpbGwgYmUgYSBDdXN0b21FdmVudCBvYmplY3Qgb2YgdGhpcyB0eXBlKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRFdmVudERlc2NyaXB0b3Ige1xuXHRwcm9wZXJ0eU5hbWU6IHN0cmluZztcblx0ZXZlbnROYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIGN1c3RvbSBlbGVtZW50IGluaXRpYWxpemluZyBmdW5jdGlvbi4gUGFzc2VzIGluIGluaXRpYWwgcHJvcGVydGllcyBzbyB0aGV5IGNhbiBiZSBleHRlbmRlZFxuICogYnkgdGhlIGluaXRpYWxpemVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRJbml0aWFsaXplciB7XG5cdChwcm9wZXJ0aWVzOiBXaWRnZXRQcm9wZXJ0aWVzKTogdm9pZDtcbn1cblxuZXhwb3J0IGVudW0gQ2hpbGRyZW5UeXBlIHtcblx0RE9KTyA9ICdET0pPJyxcblx0RUxFTUVOVCA9ICdFTEVNRU5UJ1xufVxuXG4vKipcbiAqIEB0eXBlIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yXG4gKlxuICogRGVzY3JpYmVzIGEgY3VzdG9tIGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHRhZ05hbWUgICAgICAgICAgICAgVGhlIHRhZyBuYW1lIHRvIHJlZ2lzdGVyIHRoaXMgd2lkZ2V0IHVuZGVyLiBUYWcgbmFtZXMgbXVzdCBjb250YWluIGEgXCItXCJcbiAqIEBwcm9wZXJ0eSB3aWRnZXRDb25zdHJ1Y3RvciAgIHdpZGdldCBDb25zdHJ1Y3RvciB0aGF0IHdpbGwgcmV0dXJuIHRoZSB3aWRnZXQgdG8gYmUgd3JhcHBlZCBpbiBhIGN1c3RvbSBlbGVtZW50XG4gKiBAcHJvcGVydHkgYXR0cmlidXRlcyAgICAgICAgICBBIGxpc3Qgb2YgYXR0cmlidXRlcyB0byBkZWZpbmUgb24gdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgcHJvcGVydGllcyAgICAgICAgICBBIGxpc3Qgb2YgcHJvcGVydGllcyB0byBkZWZpbmUgb24gdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgZXZlbnRzICAgICAgICAgICAgICBBIGxpc3Qgb2YgZXZlbnRzIHRvIGV4cG9zZSBvbiB0aGlzIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSBpbml0aWFsaXphdGlvbiAgICAgIEEgbWV0aG9kIHRvIHJ1biB0byBzZXQgY3VzdG9tIHByb3BlcnRpZXMgb24gdGhlIHdyYXBwZWQgd2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudERlc2NyaXB0b3Ige1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIGN1c3RvbSBlbGVtZW50IHRhZ1xuXHQgKi9cblx0dGFnTmFtZTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBXaWRnZXQgY29uc3RydWN0b3IgdGhhdCB3aWxsIGNyZWF0ZSB0aGUgd2lkZ2V0XG5cdCAqL1xuXHR3aWRnZXRDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj47XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgYXR0cmlidXRlcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnQgdG8gbWFwIHRvIHdpZGdldCBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRhdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZURlc2NyaXB0b3JbXTtcblxuXHQvKipcblx0ICogTGlzdCBvZiB3aWRnZXQgcHJvcGVydGllcyB0byBleHBvc2UgYXMgcHJvcGVydGllcyBvbiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHByb3BlcnRpZXM/OiBDdXN0b21FbGVtZW50UHJvcGVydHlEZXNjcmlwdG9yW107XG5cblx0LyoqXG5cdCAqIExpc3Qgb2YgZXZlbnRzIHRvIGV4cG9zZVxuXHQgKi9cblx0ZXZlbnRzPzogQ3VzdG9tRWxlbWVudEV2ZW50RGVzY3JpcHRvcltdO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXphdGlvbiBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIHRoZSB3aWRnZXQgaXMgY3JlYXRlZCAoZm9yIGN1c3RvbSBwcm9wZXJ0eSBzZXR0aW5nKVxuXHQgKi9cblx0aW5pdGlhbGl6YXRpb24/OiBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIGNoaWxkcmVuIHRoYXQgdGhlIGN1c3RvbSBlbGVtZW50IGFjY2VwdHNcblx0ICovXG5cdGNoaWxkcmVuVHlwZT86IENoaWxkcmVuVHlwZTtcbn1cblxuLyoqXG4gKiBAdHlwZSBDdXN0b21FbGVtZW50XG4gKlxuICogQSBjdXN0b20gZWxlbWVudCBleHRlbmRzIHVwb24gYSByZWd1bGFyIEhUTUxFbGVtZW50IGJ1dCBhZGRzIGZpZWxkcyBmb3IgZGVzY3JpYmluZyBhbmQgd3JhcHBpbmcgYSB3aWRnZXQgY29uc3RydWN0b3IuXG4gKlxuICogQHByb3BlcnR5IGdldFdpZGdldENvbnN0cnVjdG9yIFJldHVybiB0aGUgd2lkZ2V0IGNvbnN0cnVjdG9yIGZvciB0aGlzIGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSBnZXREZXNjcmlwdG9yICAgICAgICBSZXR1cm4gdGhlIGVsZW1lbnQgZGVzY3JpcHRvciBmb3IgdGhpcyBlbGVtZW50XG4gKiBAcHJvcGVydHkgZ2V0V2lkZ2V0SW5zdGFuY2UgICAgUmV0dXJuIHRoZSB3aWRnZXQgaW5zdGFuY2UgdGhhdCB0aGlzIGVsZW1lbnQgd3JhcHNcbiAqIEBwcm9wZXJ0eSBzZXRXaWRnZXRJbnN0YW5jZSAgICBTZXQgdGhlIHdpZGdldCBpbnN0YW5jZSBmb3IgdGhpcyBlbGVtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0Z2V0V2lkZ2V0Q29uc3RydWN0b3IoKTogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj47XG5cdGdldERlc2NyaXB0b3IoKTogQ3VzdG9tRWxlbWVudERlc2NyaXB0b3I7XG5cdGdldFdpZGdldEluc3RhbmNlKCk6IFByb2plY3Rvck1peGluPGFueT47XG5cdHNldFdpZGdldEluc3RhbmNlKGluc3RhbmNlOiBQcm9qZWN0b3JNaXhpbjxhbnk+KTogdm9pZDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBEb21Ub1dpZGdldFdyYXBwZXJcbiAqL1xuZXhwb3J0IHR5cGUgRG9tVG9XaWRnZXRXcmFwcGVyUHJvcGVydGllcyA9IFZOb2RlUHJvcGVydGllcyAmIFdpZGdldFByb3BlcnRpZXM7XG5cbi8qKlxuICogRG9tVG9XaWRnZXRXcmFwcGVyIHR5cGVcbiAqL1xuZXhwb3J0IHR5cGUgRG9tVG9XaWRnZXRXcmFwcGVyID0gQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxEb21Ub1dpZGdldFdyYXBwZXJQcm9wZXJ0aWVzPj47XG5cbi8qKlxuICogRG9tVG9XaWRnZXRXcmFwcGVyIEhPQ1xuICpcbiAqIEBwYXJhbSBkb21Ob2RlIFRoZSBkb20gbm9kZSB0byB3cmFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEb21Ub1dpZGdldFdyYXBwZXIoZG9tTm9kZTogQ3VzdG9tRWxlbWVudCk6IERvbVRvV2lkZ2V0V3JhcHBlciB7XG5cdHJldHVybiBjbGFzcyBEb21Ub1dpZGdldFdyYXBwZXIgZXh0ZW5kcyBXaWRnZXRCYXNlPERvbVRvV2lkZ2V0V3JhcHBlclByb3BlcnRpZXM+IHtcblx0XHRwcml2YXRlIF93aWRnZXRJbnN0YW5jZTogUHJvamVjdG9yTWl4aW48YW55PjtcblxuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHRcdHRoaXMuX3dpZGdldEluc3RhbmNlID0gZG9tTm9kZS5nZXRXaWRnZXRJbnN0YW5jZSAmJiBkb21Ob2RlLmdldFdpZGdldEluc3RhbmNlKCk7XG5cdFx0XHRpZiAoIXRoaXMuX3dpZGdldEluc3RhbmNlKSB7XG5cdFx0XHRcdGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY29ubmVjdGVkJywgKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3dpZGdldEluc3RhbmNlID0gZG9tTm9kZS5nZXRXaWRnZXRJbnN0YW5jZSgpO1xuXHRcdFx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwdWJsaWMgX19yZW5kZXJfXygpOiBWTm9kZSB7XG5cdFx0XHRjb25zdCB2Tm9kZSA9IHN1cGVyLl9fcmVuZGVyX18oKSBhcyBJbnRlcm5hbFZOb2RlO1xuXHRcdFx0dk5vZGUuZG9tTm9kZSA9IGRvbU5vZGU7XG5cdFx0XHRyZXR1cm4gdk5vZGU7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHJlbmRlcigpOiBETm9kZSB7XG5cdFx0XHRpZiAodGhpcy5fd2lkZ2V0SW5zdGFuY2UpIHtcblx0XHRcdFx0dGhpcy5fd2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyh7XG5cdFx0XHRcdFx0a2V5OiAncm9vdCcsXG5cdFx0XHRcdFx0Li4udGhpcy5fd2lkZ2V0SW5zdGFuY2UucHJvcGVydGllcyxcblx0XHRcdFx0XHQuLi50aGlzLnByb3BlcnRpZXNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdihkb21Ob2RlLnRhZ05hbWUsIHt9KTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShcblx0YXR0cmlidXRlTmFtZTogc3RyaW5nLFxuXHRhdHRyaWJ1dGVWYWx1ZTogc3RyaW5nIHwgbnVsbCxcblx0ZGVzY3JpcHRvcjogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZURlc2NyaXB0b3Jcbik6IFtzdHJpbmcsIGFueV0ge1xuXHRsZXQgeyBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSA9IGF0dHJpYnV0ZVZhbHVlIH0gPSBkZXNjcmlwdG9yO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YWx1ZSA9IHZhbHVlKGF0dHJpYnV0ZVZhbHVlKTtcblx0fVxuXG5cdHJldHVybiBbcHJvcGVydHlOYW1lLCB2YWx1ZV07XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tRXZlbnRDbGFzcyA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuaWYgKHR5cGVvZiBjdXN0b21FdmVudENsYXNzICE9PSAnZnVuY3Rpb24nKSB7XG5cdGNvbnN0IGN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQ6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcblx0XHRwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG5cdFx0Y29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cdFx0ZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcblx0XHRyZXR1cm4gZXZ0O1xuXHR9O1xuXG5cdGlmIChnbG9iYWwuRXZlbnQpIHtcblx0XHRjdXN0b21FdmVudC5wcm90b3R5cGUgPSBnbG9iYWwuRXZlbnQucHJvdG90eXBlO1xuXHR9XG5cblx0Y3VzdG9tRXZlbnRDbGFzcyA9IGN1c3RvbUV2ZW50O1xufVxuXG4vKipcbiAqIENhbGxlZCBieSBIVE1MRWxlbWVudCBzdWJjbGFzcyB0byBpbml0aWFsaXplIGl0c2VsZiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBhdHRyaWJ1dGVzL3Byb3BlcnRpZXMvZXZlbnRzLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGluaXRpYWxpemUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRWxlbWVudChlbGVtZW50OiBDdXN0b21FbGVtZW50KSB7XG5cdGxldCBpbml0aWFsUHJvcGVydGllczogYW55ID0ge307XG5cblx0Y29uc3Qge1xuXHRcdGNoaWxkcmVuVHlwZSA9IENoaWxkcmVuVHlwZS5ET0pPLFxuXHRcdGF0dHJpYnV0ZXMgPSBbXSxcblx0XHRldmVudHMgPSBbXSxcblx0XHRwcm9wZXJ0aWVzID0gW10sXG5cdFx0aW5pdGlhbGl6YXRpb25cblx0fSA9IGVsZW1lbnQuZ2V0RGVzY3JpcHRvcigpO1xuXG5cdGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0Y29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5hdHRyaWJ1dGVOYW1lO1xuXG5cdFx0Y29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gPSBnZXRXaWRnZXRQcm9wZXJ0eUZyb21BdHRyaWJ1dGUoXG5cdFx0XHRhdHRyaWJ1dGVOYW1lLFxuXHRcdFx0ZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpKSxcblx0XHRcdGF0dHJpYnV0ZVxuXHRcdCk7XG5cdFx0aW5pdGlhbFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XG5cdH0pO1xuXG5cdHByb3BlcnRpZXMuZm9yRWFjaCgoeyBwcm9wZXJ0eU5hbWUsIHdpZGdldFByb3BlcnR5TmFtZSB9KSA9PiB7XG5cdFx0aW5pdGlhbFByb3BlcnRpZXNbd2lkZ2V0UHJvcGVydHlOYW1lIHx8IHByb3BlcnR5TmFtZV0gPSAoZWxlbWVudCBhcyBhbnkpW3Byb3BlcnR5TmFtZV07XG5cdH0pO1xuXG5cdGxldCBjdXN0b21Qcm9wZXJ0aWVzOiBQcm9wZXJ0eURlc2NyaXB0b3JNYXAgPSB7fTtcblxuXHRhdHRyaWJ1dGVzLnJlZHVjZSgocHJvcGVydGllcywgYXR0cmlidXRlKSA9PiB7XG5cdFx0Y29uc3QgeyBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZSB9ID0gYXR0cmlidXRlO1xuXG5cdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQodmFsdWU6IGFueSkge1xuXHRcdFx0XHRjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSA9IGdldFdpZGdldFByb3BlcnR5RnJvbUF0dHJpYnV0ZShcblx0XHRcdFx0XHRhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZSxcblx0XHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVcblx0XHRcdFx0KTtcblx0XHRcdFx0ZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnNldFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0YXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywge1xuXHRcdFx0XHRcdFx0W3Byb3BlcnR5TmFtZV06IHByb3BlcnR5VmFsdWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fSwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0cHJvcGVydGllcy5yZWR1Y2UoKHByb3BlcnRpZXMsIHByb3BlcnR5KSA9PiB7XG5cdFx0Y29uc3QgeyBwcm9wZXJ0eU5hbWUsIGdldFZhbHVlLCBzZXRWYWx1ZSB9ID0gcHJvcGVydHk7XG5cdFx0Y29uc3QgeyB3aWRnZXRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUgfSA9IHByb3BlcnR5O1xuXG5cdFx0cHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5wcm9wZXJ0aWVzW3dpZGdldFByb3BlcnR5TmFtZV07XG5cdFx0XHRcdHJldHVybiBnZXRWYWx1ZSA/IGdldFZhbHVlKHZhbHVlKSA6IHZhbHVlO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0KHZhbHVlOiBhbnkpIHtcblx0XHRcdFx0ZWxlbWVudC5nZXRXaWRnZXRJbnN0YW5jZSgpLnNldFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0YXNzaWduKHt9LCBlbGVtZW50LmdldFdpZGdldEluc3RhbmNlKCkucHJvcGVydGllcywge1xuXHRcdFx0XHRcdFx0W3dpZGdldFByb3BlcnR5TmFtZV06IHNldFZhbHVlID8gc2V0VmFsdWUodmFsdWUpIDogdmFsdWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fSwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWxlbWVudCwgY3VzdG9tUHJvcGVydGllcyk7XG5cblx0Ly8gZGVmaW5lIGV2ZW50c1xuXHRldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcblx0XHRjb25zdCB7IHByb3BlcnR5TmFtZSwgZXZlbnROYW1lIH0gPSBldmVudDtcblxuXHRcdGluaXRpYWxQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSAoZXZlbnQ6IGFueSkgPT4ge1xuXHRcdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KFxuXHRcdFx0XHRuZXcgY3VzdG9tRXZlbnRDbGFzcyhldmVudE5hbWUsIHtcblx0XHRcdFx0XHRidWJibGVzOiBmYWxzZSxcblx0XHRcdFx0XHRkZXRhaWw6IGV2ZW50XG5cdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdH07XG5cdH0pO1xuXG5cdGlmIChpbml0aWFsaXphdGlvbikge1xuXHRcdGluaXRpYWxpemF0aW9uLmNhbGwoZWxlbWVudCwgaW5pdGlhbFByb3BlcnRpZXMpO1xuXHR9XG5cblx0Y29uc3QgcHJvamVjdG9yID0gUHJvamVjdG9yTWl4aW4oZWxlbWVudC5nZXRXaWRnZXRDb25zdHJ1Y3RvcigpKTtcblx0Y29uc3Qgd2lkZ2V0SW5zdGFuY2UgPSBuZXcgcHJvamVjdG9yKCk7XG5cblx0d2lkZ2V0SW5zdGFuY2Uuc2V0UHJvcGVydGllcyhpbml0aWFsUHJvcGVydGllcyk7XG5cdGVsZW1lbnQuc2V0V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRsZXQgY2hpbGRyZW46IEROb2RlW10gPSBbXTtcblx0XHRsZXQgZWxlbWVudENoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzID8gKGFycmF5RnJvbShlbGVtZW50LmNoaWxkTm9kZXMpIGFzIEN1c3RvbUVsZW1lbnRbXSkgOiBbXTtcblxuXHRcdGVsZW1lbnRDaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGUsIGluZGV4KSA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0geyBrZXk6IGBjaGlsZC0ke2luZGV4fWAgfTtcblx0XHRcdGlmIChjaGlsZHJlblR5cGUgPT09IENoaWxkcmVuVHlwZS5ET0pPKSB7XG5cdFx0XHRcdGNoaWxkcmVuLnB1c2godyhEb21Ub1dpZGdldFdyYXBwZXIoY2hpbGROb2RlKSwgcHJvcGVydGllcykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaCh3KERvbVdyYXBwZXIoY2hpbGROb2RlKSwgcHJvcGVydGllcykpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGVsZW1lbnRDaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGUpID0+IHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcblx0XHR9KTtcblxuXHRcdHdpZGdldEluc3RhbmNlLnNldENoaWxkcmVuKGNoaWxkcmVuKTtcblx0XHR3aWRnZXRJbnN0YW5jZS5hcHBlbmQoZWxlbWVudCk7XG5cdH07XG59XG5cbi8qKlxuICogQ2FsbGVkIGJ5IEhUTUxFbGVtZW50IHN1YmNsYXNzIHdoZW4gYW4gSFRNTCBhdHRyaWJ1dGUgaGFzIGNoYW5nZWQuXG4gKlxuICogQHBhcmFtIGVsZW1lbnQgICAgIFRoZSBlbGVtZW50IHdob3NlIGF0dHJpYnV0ZXMgYXJlIGJlaW5nIHdhdGNoZWRcbiAqIEBwYXJhbSBuYW1lICAgICAgICBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gKiBAcGFyYW0gbmV3VmFsdWUgICAgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlXG4gKiBAcGFyYW0gb2xkVmFsdWUgICAgVGhlIG9sZCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBdHRyaWJ1dGVDaGFuZ2VkKFxuXHRlbGVtZW50OiBDdXN0b21FbGVtZW50LFxuXHRuYW1lOiBzdHJpbmcsXG5cdG5ld1ZhbHVlOiBzdHJpbmcgfCBudWxsLFxuXHRvbGRWYWx1ZTogc3RyaW5nIHwgbnVsbFxuKSB7XG5cdGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmdldERlc2NyaXB0b3IoKS5hdHRyaWJ1dGVzIHx8IFtdO1xuXG5cdGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0Y29uc3QgeyBhdHRyaWJ1dGVOYW1lIH0gPSBhdHRyaWJ1dGU7XG5cblx0XHRpZiAoYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdID0gZ2V0V2lkZ2V0UHJvcGVydHlGcm9tQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIG5ld1ZhbHVlLCBhdHRyaWJ1dGUpO1xuXHRcdFx0ZWxlbWVudFxuXHRcdFx0XHQuZ2V0V2lkZ2V0SW5zdGFuY2UoKVxuXHRcdFx0XHQuc2V0UHJvcGVydGllcyhhc3NpZ24oe30sIGVsZW1lbnQuZ2V0V2lkZ2V0SW5zdGFuY2UoKS5wcm9wZXJ0aWVzLCB7IFtwcm9wZXJ0eU5hbWVdOiBwcm9wZXJ0eVZhbHVlIH0pKTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGN1c3RvbUVsZW1lbnRzLnRzIiwiaW1wb3J0IFN5bWJvbCBmcm9tICdAZG9qby9zaGltL1N5bWJvbCc7XG5pbXBvcnQge1xuXHRDb25zdHJ1Y3Rvcixcblx0RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMsXG5cdEROb2RlLFxuXHRWTm9kZSxcblx0UmVnaXN0cnlMYWJlbCxcblx0Vk5vZGVQcm9wZXJ0aWVzLFxuXHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRXTm9kZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIFRoZSBzeW1ib2wgaWRlbnRpZmllciBmb3IgYSBXTm9kZSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBXTk9ERSA9IFN5bWJvbCgnSWRlbnRpZmllciBmb3IgYSBXTm9kZS4nKTtcblxuLyoqXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgVk5vZGUgdHlwZVxuICovXG5leHBvcnQgY29uc3QgVk5PREUgPSBTeW1ib2woJ0lkZW50aWZpZXIgZm9yIGEgVk5vZGUuJyk7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFdOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dOb2RlPFcgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlID0gRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KFxuXHRjaGlsZDogRE5vZGU8Vz5cbik6IGNoaWxkIGlzIFdOb2RlPFc+IHtcblx0cmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBXTk9ERSk7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFZOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZOb2RlKGNoaWxkOiBETm9kZSk6IGNoaWxkIGlzIFZOb2RlIHtcblx0cmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBWTk9ERSk7XG59XG5cbi8qKlxuICogR2VuZXJpYyBkZWNvcmF0ZSBmdW5jdGlvbiBmb3IgRE5vZGVzLiBUaGUgbm9kZXMgYXJlIG1vZGlmaWVkIGluIHBsYWNlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwcmVkaWNhdGVcbiAqIGFuZCBtb2RpZmllciBmdW5jdGlvbnMuXG4gKlxuICogVGhlIGNoaWxkcmVuIG9mIGVhY2ggbm9kZSBhcmUgZmxhdHRlbmVkIGFuZCBhZGRlZCB0byB0aGUgYXJyYXkgZm9yIGRlY29yYXRpb24uXG4gKlxuICogSWYgbm8gcHJlZGljYXRlIGlzIHN1cHBsaWVkIHRoZW4gdGhlIG1vZGlmaWVyIHdpbGwgYmUgZXhlY3V0ZWQgb24gYWxsIG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGU8VCBleHRlbmRzIEROb2RlPihcblx0ZE5vZGVzOiBETm9kZSxcblx0bW9kaWZpZXI6IChkTm9kZTogVCkgPT4gdm9pZCxcblx0cHJlZGljYXRlOiAoZE5vZGU6IEROb2RlKSA9PiBkTm9kZSBpcyBUXG4pOiBETm9kZTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZTxUIGV4dGVuZHMgRE5vZGU+KFxuXHRkTm9kZXM6IEROb2RlW10sXG5cdG1vZGlmaWVyOiAoZE5vZGU6IFQpID0+IHZvaWQsXG5cdHByZWRpY2F0ZTogKGROb2RlOiBETm9kZSkgPT4gZE5vZGUgaXMgVFxuKTogRE5vZGVbXTtcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXM6IEROb2RlLCBtb2RpZmllcjogKGROb2RlOiBETm9kZSkgPT4gdm9pZCk6IEROb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKGROb2RlczogRE5vZGVbXSwgbW9kaWZpZXI6IChkTm9kZTogRE5vZGUpID0+IHZvaWQpOiBETm9kZVtdO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRlKFxuXHRkTm9kZXM6IEROb2RlIHwgRE5vZGVbXSxcblx0bW9kaWZpZXI6IChkTm9kZTogRE5vZGUpID0+IHZvaWQsXG5cdHByZWRpY2F0ZT86IChkTm9kZTogRE5vZGUpID0+IGJvb2xlYW5cbik6IEROb2RlIHwgRE5vZGVbXSB7XG5cdGxldCBub2RlcyA9IEFycmF5LmlzQXJyYXkoZE5vZGVzKSA/IFsuLi5kTm9kZXNdIDogW2ROb2Rlc107XG5cdHdoaWxlIChub2Rlcy5sZW5ndGgpIHtcblx0XHRjb25zdCBub2RlID0gbm9kZXMucG9wKCk7XG5cdFx0aWYgKG5vZGUpIHtcblx0XHRcdGlmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShub2RlKSkge1xuXHRcdFx0XHRtb2RpZmllcihub2RlKTtcblx0XHRcdH1cblx0XHRcdGlmICgoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdG5vZGVzID0gWy4uLm5vZGVzLCAuLi5ub2RlLmNoaWxkcmVuXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGROb2Rlcztcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZ1bmN0aW9uIGZvciBjYWxscyB0byBjcmVhdGUgYSB3aWRnZXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3PFcgZXh0ZW5kcyBXaWRnZXRCYXNlSW50ZXJmYWNlPihcblx0d2lkZ2V0Q29uc3RydWN0b3I6IENvbnN0cnVjdG9yPFc+IHwgUmVnaXN0cnlMYWJlbCxcblx0cHJvcGVydGllczogV1sncHJvcGVydGllcyddLFxuXHRjaGlsZHJlbjogV1snY2hpbGRyZW4nXSA9IFtdXG4pOiBXTm9kZTxXPiB7XG5cdHJldHVybiB7XG5cdFx0Y2hpbGRyZW4sXG5cdFx0d2lkZ2V0Q29uc3RydWN0b3IsXG5cdFx0cHJvcGVydGllcyxcblx0XHR0eXBlOiBXTk9ERVxuXHR9O1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBWTm9kZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2KHRhZzogc3RyaW5nLCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMgfCBEZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzLCBjaGlsZHJlbj86IEROb2RlW10pOiBWTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiB2KHRhZzogc3RyaW5nLCBjaGlsZHJlbjogdW5kZWZpbmVkIHwgRE5vZGVbXSk6IFZOb2RlO1xuZXhwb3J0IGZ1bmN0aW9uIHYodGFnOiBzdHJpbmcpOiBWTm9kZTtcbmV4cG9ydCBmdW5jdGlvbiB2KFxuXHR0YWc6IHN0cmluZyxcblx0cHJvcGVydGllc09yQ2hpbGRyZW46IFZOb2RlUHJvcGVydGllcyB8IERlZmVycmVkVmlydHVhbFByb3BlcnRpZXMgfCBETm9kZVtdID0ge30sXG5cdGNoaWxkcmVuOiB1bmRlZmluZWQgfCBETm9kZVtdID0gdW5kZWZpbmVkXG4pOiBWTm9kZSB7XG5cdGxldCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMgfCBEZWZlcnJlZFZpcnR1YWxQcm9wZXJ0aWVzID0gcHJvcGVydGllc09yQ2hpbGRyZW47XG5cdGxldCBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjaztcblxuXHRpZiAoQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzT3JDaGlsZHJlbikpIHtcblx0XHRjaGlsZHJlbiA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xuXHRcdHByb3BlcnRpZXMgPSB7fTtcblx0fVxuXG5cdGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID0gcHJvcGVydGllcztcblx0XHRwcm9wZXJ0aWVzID0ge307XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHRhZyxcblx0XHRkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayxcblx0XHRjaGlsZHJlbixcblx0XHRwcm9wZXJ0aWVzLFxuXHRcdHR5cGU6IFZOT0RFXG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZC50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBEZWNvcmF0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBhIGZ1bmN0aW9uIHRvIHJ1biBhcyBhbiBhc3BlY3QgdG8gYHJlbmRlcmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZDogRnVuY3Rpb24pOiAodGFyZ2V0OiBhbnkpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJSZW5kZXIoKTogKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nKSA9PiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZD86IEZ1bmN0aW9uKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdhZnRlclJlbmRlcicsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhZnRlclJlbmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhZnRlclJlbmRlci50cyIsImltcG9ydCB7IGhhbmRsZURlY29yYXRvciB9IGZyb20gJy4vaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IEJlZm9yZVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIERlY29yYXRvciB0aGF0IGFkZHMgdGhlIGZ1bmN0aW9uIHBhc3NlZCBvZiB0YXJnZXQgbWV0aG9kIHRvIGJlIHJ1blxuICogaW4gdGhlIGBiZWZvcmVQcm9wZXJ0aWVzYCBsaWZlY3ljbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZDogQmVmb3JlUHJvcGVydGllcyk6ICh0YXJnZXQ6IGFueSkgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKCk6ICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZD86IEJlZm9yZVByb3BlcnRpZXMpIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmVmb3JlUHJvcGVydGllcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBiZWZvcmVQcm9wZXJ0aWVzLnRzIiwiaW1wb3J0IHsgQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyIH0gZnJvbSAnLi4vY3VzdG9tRWxlbWVudHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFdpZGdldFByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjdXN0b20gZWxlbWVudCBjb25maWd1cmF0aW9uIHVzZWQgYnkgdGhlIGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudENvbmZpZzxQIGV4dGVuZHMgV2lkZ2V0UHJvcGVydGllcz4ge1xuXHQvKipcblx0ICogVGhlIHRhZyBvZiB0aGUgY3VzdG9tIGVsZW1lbnRcblx0ICovXG5cdHRhZzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIHdpZGdldCBwcm9wZXJ0aWVzIHRvIGV4cG9zZSBhcyBwcm9wZXJ0aWVzIG9uIHRoZSBjdXN0b20gZWxlbWVudFxuXHQgKi9cblx0cHJvcGVydGllcz86IChrZXlvZiBQKVtdO1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGF0dHJpYnV0ZXMgb24gdGhlIGN1c3RvbSBlbGVtZW50IHRvIG1hcCB0byB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0YXR0cmlidXRlcz86IChrZXlvZiBQKVtdO1xuXG5cdC8qKlxuXHQgKiBMaXN0IG9mIGV2ZW50cyB0byBleHBvc2Vcblx0ICovXG5cdGV2ZW50cz86IChrZXlvZiBQKVtdO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXphdGlvbiBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIHRoZSB3aWRnZXQgaXMgY3JlYXRlZCAoZm9yIGN1c3RvbSBwcm9wZXJ0eSBzZXR0aW5nKVxuXHQgKi9cblx0aW5pdGlhbGl6YXRpb24/OiBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXI7XG59XG5cbi8qKlxuICogVGhpcyBEZWNvcmF0b3IgaXMgcHJvdmlkZWQgcHJvcGVydGllcyB0aGF0IGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgYSBjdXN0b20gZWxlbWVudCwgYW5kXG4gKiByZWdpc3RlcnMgdGhhdCBjdXN0b20gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbUVsZW1lbnQ8UCBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMgPSBXaWRnZXRQcm9wZXJ0aWVzPih7XG5cdHRhZyxcblx0cHJvcGVydGllcyxcblx0YXR0cmlidXRlcyxcblx0ZXZlbnRzLFxuXHRpbml0aWFsaXphdGlvblxufTogQ3VzdG9tRWxlbWVudENvbmZpZzxQPikge1xuXHRyZXR1cm4gZnVuY3Rpb248VCBleHRlbmRzIENvbnN0cnVjdG9yPGFueT4+KHRhcmdldDogVCkge1xuXHRcdHRhcmdldC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvciA9IHtcblx0XHRcdHRhZ05hbWU6IHRhZyxcblx0XHRcdHdpZGdldENvbnN0cnVjdG9yOiB0YXJnZXQsXG5cdFx0XHRhdHRyaWJ1dGVzOiAoYXR0cmlidXRlcyB8fCBbXSkubWFwKChhdHRyaWJ1dGVOYW1lKSA9PiAoeyBhdHRyaWJ1dGVOYW1lIH0pKSxcblx0XHRcdHByb3BlcnRpZXM6IChwcm9wZXJ0aWVzIHx8IFtdKS5tYXAoKHByb3BlcnR5TmFtZSkgPT4gKHsgcHJvcGVydHlOYW1lIH0pKSxcblx0XHRcdGV2ZW50czogKGV2ZW50cyB8fCBbXSkubWFwKChwcm9wZXJ0eU5hbWUpID0+ICh7XG5cdFx0XHRcdHByb3BlcnR5TmFtZSxcblx0XHRcdFx0ZXZlbnROYW1lOiBwcm9wZXJ0eU5hbWUucmVwbGFjZSgnb24nLCAnJykudG9Mb3dlckNhc2UoKVxuXHRcdFx0fSkpLFxuXHRcdFx0aW5pdGlhbGl6YXRpb25cblx0XHR9O1xuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdXN0b21FbGVtZW50O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGN1c3RvbUVsZW1lbnQudHMiLCJpbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBEaWZmUHJvcGVydHlGdW5jdGlvbiB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogRGVjb3JhdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgYSBmdW5jdGlvbiBhcyBhIHNwZWNpZmljIHByb3BlcnR5IGRpZmZcbiAqXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lICBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb2Ygd2hpY2ggdGhlIGRpZmYgZnVuY3Rpb24gaXMgYXBwbGllZFxuICogQHBhcmFtIGRpZmZUeXBlICAgICAgVGhlIGRpZmYgdHlwZSwgZGVmYXVsdCBpcyBEaWZmVHlwZS5BVVRPLlxuICogQHBhcmFtIGRpZmZGdW5jdGlvbiAgQSBkaWZmIGZ1bmN0aW9uIHRvIHJ1biBpZiBkaWZmVHlwZSBpZiBEaWZmVHlwZS5DVVNUT01cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZywgZGlmZkZ1bmN0aW9uOiBEaWZmUHJvcGVydHlGdW5jdGlvbiwgcmVhY3Rpb25GdW5jdGlvbj86IEZ1bmN0aW9uKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKGBkaWZmUHJvcGVydHk6JHtwcm9wZXJ0eU5hbWV9YCwgZGlmZkZ1bmN0aW9uLmJpbmQobnVsbCkpO1xuXHRcdHRhcmdldC5hZGREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknLCBwcm9wZXJ0eU5hbWUpO1xuXHRcdGlmIChyZWFjdGlvbkZ1bmN0aW9uIHx8IHByb3BlcnR5S2V5KSB7XG5cdFx0XHR0YXJnZXQuYWRkRGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nLCB7XG5cdFx0XHRcdHByb3BlcnR5TmFtZSxcblx0XHRcdFx0cmVhY3Rpb246IHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IHJlYWN0aW9uRnVuY3Rpb25cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpZmZQcm9wZXJ0eTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkaWZmUHJvcGVydHkudHMiLCJleHBvcnQgdHlwZSBEZWNvcmF0b3JIYW5kbGVyID0gKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZykgPT4gdm9pZDtcblxuLyoqXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXG4gKiBvciB0aGUgbWV0aG9kIGxldmVsLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcjogRGVjb3JhdG9ySGFuZGxlcikge1xuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5Pzogc3RyaW5nLCBkZXNjcmlwdG9yPzogUHJvcGVydHlEZXNjcmlwdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGhhbmRsZXIodGFyZ2V0LnByb3RvdHlwZSwgdW5kZWZpbmVkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZURlY29yYXRvcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBoYW5kbGVEZWNvcmF0b3IudHMiLCJpbXBvcnQgV2Vha01hcCBmcm9tICdAZG9qby9zaGltL1dlYWtNYXAnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuL2hhbmRsZURlY29yYXRvcic7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4vLi4vSW5qZWN0b3InO1xuaW1wb3J0IHsgYmVmb3JlUHJvcGVydGllcyB9IGZyb20gJy4vYmVmb3JlUHJvcGVydGllcyc7XG5pbXBvcnQgeyBSZWdpc3RyeUxhYmVsIH0gZnJvbSAnLi8uLi9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXG4gKi9cbmNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXA6IFdlYWtNYXA8V2lkZ2V0QmFzZSwgSW5qZWN0b3JbXT4gPSBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbnRyYWN0IHJlcXVpcmVzIGZvciB0aGUgZ2V0IHByb3BlcnRpZXMgZnVuY3Rpb25cbiAqIHVzZWQgdG8gbWFwIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdldFByb3BlcnRpZXM8VCA9IGFueT4ge1xuXHQocGF5bG9hZDogYW55LCBwcm9wZXJ0aWVzOiBUKTogVDtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBpbmplY3QgY29uZmlndXJhdGlvbiByZXF1aXJlZCBmb3IgdXNlIG9mIHRoZSBgaW5qZWN0YCBkZWNvcmF0b3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmplY3RDb25maWcge1xuXHQvKipcblx0ICogVGhlIGxhYmVsIG9mIHRoZSByZWdpc3RyeSBpbmplY3RvclxuXHQgKi9cblx0bmFtZTogUmVnaXN0cnlMYWJlbDtcblxuXHQvKipcblx0ICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHByb3BlcnR1ZXMgdG8gaW5qZWN0IHVzaW5nIHRoZSBwYXNzZWQgcHJvcGVydGllc1xuXHQgKiBhbmQgdGhlIGluamVjdGVkIHBheWxvYWQuXG5cdCAqL1xuXHRnZXRQcm9wZXJ0aWVzOiBHZXRQcm9wZXJ0aWVzO1xufVxuXG4vKipcbiAqIERlY29yYXRvciByZXRyaWV2ZXMgYW4gaW5qZWN0b3IgZnJvbSBhbiBhdmFpbGFibGUgcmVnaXN0cnkgdXNpbmcgdGhlIG5hbWUgYW5kXG4gKiBjYWxscyB0aGUgYGdldFByb3BlcnRpZXNgIGZ1bmN0aW9uIHdpdGggdGhlIHBheWxvYWQgZnJvbSB0aGUgaW5qZWN0b3JcbiAqIGFuZCBjdXJyZW50IHByb3BlcnRpZXMgd2l0aCB0aGUgdGhlIGluamVjdGVkIHByb3BlcnRpZXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIEluamVjdENvbmZpZyB0aGUgaW5qZWN0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdCh7IG5hbWUsIGdldFByb3BlcnRpZXMgfTogSW5qZWN0Q29uZmlnKSB7XG5cdHJldHVybiBoYW5kbGVEZWNvcmF0b3IoKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcblx0XHRiZWZvcmVQcm9wZXJ0aWVzKGZ1bmN0aW9uKHRoaXM6IFdpZGdldEJhc2UsIHByb3BlcnRpZXM6IGFueSkge1xuXHRcdFx0Y29uc3QgaW5qZWN0b3IgPSB0aGlzLnJlZ2lzdHJ5LmdldEluamVjdG9yKG5hbWUpO1xuXHRcdFx0aWYgKGluamVjdG9yKSB7XG5cdFx0XHRcdGNvbnN0IHJlZ2lzdGVyZWRJbmplY3RvcnMgPSByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLmdldCh0aGlzKSB8fCBbXTtcblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmVnaXN0ZXJlZEluamVjdG9yc01hcC5zZXQodGhpcywgcmVnaXN0ZXJlZEluamVjdG9ycyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMuaW5kZXhPZihpbmplY3RvcikgPT09IC0xKSB7XG5cdFx0XHRcdFx0aW5qZWN0b3Iub24oJ2ludmFsaWRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZWdpc3RlcmVkSW5qZWN0b3JzLnB1c2goaW5qZWN0b3IpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yLmdldCgpLCBwcm9wZXJ0aWVzKTtcblx0XHRcdH1cblx0XHR9KSh0YXJnZXQpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5qZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGluamVjdC50cyIsImltcG9ydCB7IFByb3BlcnR5Q2hhbmdlUmVjb3JkIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFdJREdFVF9CQVNFX1RZUEUgfSBmcm9tICcuL1JlZ2lzdHJ5JztcblxuZnVuY3Rpb24gaXNPYmplY3RPckFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHtcblx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiB0cnVlLFxuXHRcdHZhbHVlOiBuZXdQcm9wZXJ0eVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaWdub3JlKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0cmV0dXJuIHtcblx0XHRjaGFuZ2VkOiBmYWxzZSxcblx0XHR2YWx1ZTogbmV3UHJvcGVydHlcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5OiBhbnksIG5ld1Byb3BlcnR5OiBhbnkpOiBQcm9wZXJ0eUNoYW5nZVJlY29yZCB7XG5cdHJldHVybiB7XG5cdFx0Y2hhbmdlZDogcHJldmlvdXNQcm9wZXJ0eSAhPT0gbmV3UHJvcGVydHksXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93KHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0bGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuXHRjb25zdCB2YWxpZE9sZFByb3BlcnR5ID0gcHJldmlvdXNQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkocHJldmlvdXNQcm9wZXJ0eSk7XG5cdGNvbnN0IHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xuXG5cdGlmICghdmFsaWRPbGRQcm9wZXJ0eSB8fCAhdmFsaWROZXdQcm9wZXJ0eSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjaGFuZ2VkOiB0cnVlLFxuXHRcdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdFx0fTtcblx0fVxuXG5cdGNvbnN0IHByZXZpb3VzS2V5cyA9IE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydHkpO1xuXHRjb25zdCBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xuXG5cdGlmIChwcmV2aW91c0tleXMubGVuZ3RoICE9PSBuZXdLZXlzLmxlbmd0aCkge1xuXHRcdGNoYW5nZWQgPSB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdGNoYW5nZWQgPSBuZXdLZXlzLnNvbWUoKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGNoYW5nZWQsXG5cdFx0dmFsdWU6IG5ld1Byb3BlcnR5XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvKHByZXZpb3VzUHJvcGVydHk6IGFueSwgbmV3UHJvcGVydHk6IGFueSk6IFByb3BlcnR5Q2hhbmdlUmVjb3JkIHtcblx0bGV0IHJlc3VsdDtcblx0aWYgKHR5cGVvZiBuZXdQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChuZXdQcm9wZXJ0eS5fdHlwZSA9PT0gV0lER0VUX0JBU0VfVFlQRSkge1xuXHRcdFx0cmVzdWx0ID0gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoaXNPYmplY3RPckFycmF5KG5ld1Byb3BlcnR5KSkge1xuXHRcdHJlc3VsdCA9IHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBkaWZmLnRzIiwiaW1wb3J0IHsgYXNzaWduIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IGNyZWF0ZUhhbmRsZSB9IGZyb20gJ0Bkb2pvL2NvcmUvbGFuZyc7XG5pbXBvcnQgeyBIYW5kbGUgfSBmcm9tICdAZG9qby9jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IGNzc1RyYW5zaXRpb25zIGZyb20gJy4uL2FuaW1hdGlvbnMvY3NzVHJhbnNpdGlvbnMnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIEROb2RlLCBQcm9qZWN0aW9uLCBQcm9qZWN0aW9uT3B0aW9ucyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IGFmdGVyUmVuZGVyIH0gZnJvbSAnLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyJztcbmltcG9ydCB7IHYgfSBmcm9tICcuLy4uL2QnO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICcuLy4uL1JlZ2lzdHJ5JztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4vLi4vdmRvbSc7XG5pbXBvcnQgJ3BlcGpzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBhdHRhY2ggc3RhdGUgb2YgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgZW51bSBQcm9qZWN0b3JBdHRhY2hTdGF0ZSB7XG5cdEF0dGFjaGVkID0gMSxcblx0RGV0YWNoZWRcbn1cblxuLyoqXG4gKiBBdHRhY2ggdHlwZSBmb3IgdGhlIHByb2plY3RvclxuICovXG5leHBvcnQgZW51bSBBdHRhY2hUeXBlIHtcblx0QXBwZW5kID0gMSxcblx0TWVyZ2UgPSAyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0YWNoT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBJZiBgJ2FwcGVuZCdgIGl0IHdpbGwgYXBwZW5kZWQgdG8gdGhlIHJvb3QuIElmIGAnbWVyZ2UnYCBpdCB3aWxsIG1lcmdlZCB3aXRoIHRoZSByb290LiBJZiBgJ3JlcGxhY2UnYCBpdCB3aWxsXG5cdCAqIHJlcGxhY2UgdGhlIHJvb3QuXG5cdCAqL1xuXHR0eXBlOiBBdHRhY2hUeXBlO1xuXG5cdC8qKlxuXHQgKiBFbGVtZW50IHRvIGF0dGFjaCB0aGUgcHJvamVjdG9yLlxuXHQgKi9cblx0cm9vdD86IEVsZW1lbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yUHJvcGVydGllcyB7XG5cdHJlZ2lzdHJ5PzogUmVnaXN0cnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdG9yTWl4aW48UD4ge1xuXHRyZWFkb25seSBwcm9wZXJ0aWVzOiBSZWFkb25seTxQPiAmIFJlYWRvbmx5PFByb2plY3RvclByb3BlcnRpZXM+O1xuXG5cdC8qKlxuXHQgKiBBcHBlbmQgdGhlIHByb2plY3RvciB0byB0aGUgcm9vdC5cblx0ICovXG5cdGFwcGVuZChyb290PzogRWxlbWVudCk6IEhhbmRsZTtcblxuXHQvKipcblx0ICogTWVyZ2UgdGhlIHByb2plY3RvciBvbnRvIHRoZSByb290LlxuXHQgKlxuXHQgKiBUaGUgYHJvb3RgIGFuZCBhbnkgb2YgaXRzIGBjaGlsZHJlbmAgd2lsbCBiZSByZS11c2VkLiAgQW55IGV4Y2VzcyBET00gbm9kZXMgd2lsbCBiZSBpZ25vcmVkIGFuZCBhbnkgbWlzc2luZyBET00gbm9kZXNcblx0ICogd2lsbCBiZSBjcmVhdGVkLlxuXHQgKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBlbGVtZW50IHRoYXQgdGhlIHJvb3QgdmlydHVhbCBET00gbm9kZSB3aWxsIGJlIG1lcmdlZCB3aXRoLiAgRGVmYXVsdHMgdG8gYGRvY3VtZW50LmJvZHlgLlxuXHQgKi9cblx0bWVyZ2Uocm9vdD86IEVsZW1lbnQpOiBIYW5kbGU7XG5cblx0LyoqXG5cdCAqIEF0dGFjaCB0aGUgcHJvamVjdCB0byBhIF9zYW5kYm94ZWRfIGRvY3VtZW50IGZyYWdtZW50IHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIERPTS5cblx0ICpcblx0ICogV2hlbiBzYW5kYm94ZWQsIHRoZSBgUHJvamVjdG9yYCB3aWxsIHJ1biBpbiBhIHN5bmMgbWFubmVyLCB3aGVyZSByZW5kZXJzIGFyZSBjb21wbGV0ZWQgd2l0aGluIHRoZSBzYW1lIHR1cm4uXG5cdCAqIFRoZSBgUHJvamVjdG9yYCBjcmVhdGVzIGEgYERvY3VtZW50RnJhZ21lbnRgIHdoaWNoIHJlcGxhY2VzIGFueSBvdGhlciBgcm9vdGAgdGhhdCBoYXMgYmVlbiBzZXQuXG5cdCAqIEBwYXJhbSBkb2MgVGhlIGBEb2N1bWVudGAgdG8gdXNlLCB3aGljaCBkZWZhdWx0cyB0byB0aGUgZ2xvYmFsIGBkb2N1bWVudGAuXG5cdCAqL1xuXHRzYW5kYm94KGRvYz86IERvY3VtZW50KTogdm9pZDtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgcHJvcGVydGllcyBmb3IgdGhlIHdpZGdldC4gUmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGRpZmZpbmcgZnVuY3Rpb25zIGZvciB0aGUgcHJvcGVydGllcyBhZ2FpbnN0IHRoZVxuXHQgKiBwcmV2aW91cyBwcm9wZXJ0aWVzLiBSdW5zIHRob3VnaCBhbnkgcmVnaXN0ZXJlZCBzcGVjaWZpYyBwcm9wZXJ0eSBkaWZmIGZ1bmN0aW9ucyBjb2xsZWN0aW5nIHRoZSByZXN1bHRzIGFuZCB0aGVuXG5cdCAqIHJ1bnMgdGhlIHJlbWFpbmRlciB0aHJvdWdoIHRoZSBjYXRjaCBhbGwgZGlmZiBmdW5jdGlvbi4gVGhlIGFnZ3JlZ2F0ZSBvZiB0aGUgdHdvIHNldHMgb2YgdGhlIHJlc3VsdHMgaXMgdGhlblxuXHQgKiBzZXQgYXMgdGhlIHdpZGdldCdzIHByb3BlcnRpZXNcblx0ICpcblx0ICogQHBhcmFtIHByb3BlcnRpZXMgVGhlIG5ldyB3aWRnZXQgcHJvcGVydGllc1xuXHQgKi9cblx0c2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSB3aWRnZXQncyBjaGlsZHJlblxuXHQgKi9cblx0c2V0Q2hpbGRyZW4oY2hpbGRyZW46IEROb2RlW10pOiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBgc3RyaW5nYCB0aGF0IHJlcHJlc2VudHMgdGhlIEhUTUwgb2YgdGhlIGN1cnJlbnQgcHJvamVjdGlvbi4gIFRoZSBwcm9qZWN0b3IgbmVlZHMgdG8gYmUgYXR0YWNoZWQuXG5cdCAqL1xuXHR0b0h0bWwoKTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgaWYgdGhlIHByb2plY3RvcnMgaXMgaW4gYXN5bmMgbW9kZSwgY29uZmlndXJlZCB0byBgdHJ1ZWAgYnkgZGVmYXVsdHMuXG5cdCAqL1xuXHRhc3luYzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogUm9vdCBlbGVtZW50IHRvIGF0dGFjaCB0aGUgcHJvamVjdG9yXG5cdCAqL1xuXHRyb290OiBFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBUaGUgc3RhdHVzIG9mIHRoZSBwcm9qZWN0b3Jcblx0ICovXG5cdHJlYWRvbmx5IHByb2plY3RvclN0YXRlOiBQcm9qZWN0b3JBdHRhY2hTdGF0ZTtcblxuXHQvKipcblx0ICogUnVucyByZWdpc3RlcmVkIGRlc3Ryb3kgaGFuZGxlc1xuXHQgKi9cblx0ZGVzdHJveSgpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUHJvamVjdG9yTWl4aW48UCwgVCBleHRlbmRzIENvbnN0cnVjdG9yPFdpZGdldEJhc2U8UD4+PihCYXNlOiBUKTogVCAmIENvbnN0cnVjdG9yPFByb2plY3Rvck1peGluPFA+PiB7XG5cdGNsYXNzIFByb2plY3RvciBleHRlbmRzIEJhc2Uge1xuXHRcdHB1YmxpYyBwcm9qZWN0b3JTdGF0ZTogUHJvamVjdG9yQXR0YWNoU3RhdGU7XG5cdFx0cHVibGljIHByb3BlcnRpZXM6IFJlYWRvbmx5PFA+ICYgUmVhZG9ubHk8UHJvamVjdG9yUHJvcGVydGllcz47XG5cblx0XHRwcml2YXRlIF9yb290OiBFbGVtZW50O1xuXHRcdHByaXZhdGUgX2FzeW5jID0gdHJ1ZTtcblx0XHRwcml2YXRlIF9hdHRhY2hIYW5kbGU6IEhhbmRsZTtcblx0XHRwcml2YXRlIF9wcm9qZWN0aW9uT3B0aW9uczogUGFydGlhbDxQcm9qZWN0aW9uT3B0aW9ucz47XG5cdFx0cHJpdmF0ZSBfcHJvamVjdGlvbjogUHJvamVjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRwcml2YXRlIF9wcm9qZWN0b3JQcm9wZXJ0aWVzOiB0aGlzWydwcm9wZXJ0aWVzJ10gPSB7fSBhcyB0aGlzWydwcm9wZXJ0aWVzJ107XG5cdFx0cHJpdmF0ZSBfaGFuZGxlczogRnVuY3Rpb25bXSA9IFtdO1xuXG5cdFx0Y29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcblx0XHRcdHN1cGVyKC4uLmFyZ3MpO1xuXG5cdFx0XHR0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcblx0XHRcdFx0dHJhbnNpdGlvbnM6IGNzc1RyYW5zaXRpb25zXG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnJvb3QgPSBkb2N1bWVudC5ib2R5O1xuXHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhcHBlbmQocm9vdD86IEVsZW1lbnQpOiBIYW5kbGUge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0dHlwZTogQXR0YWNoVHlwZS5BcHBlbmQsXG5cdFx0XHRcdHJvb3Rcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIG1lcmdlKHJvb3Q/OiBFbGVtZW50KTogSGFuZGxlIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdHR5cGU6IEF0dGFjaFR5cGUuTWVyZ2UsXG5cdFx0XHRcdHJvb3Rcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIHNldCByb290KHJvb3Q6IEVsZW1lbnQpIHtcblx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcm9vdCA9IHJvb3Q7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCByb290KCk6IEVsZW1lbnQge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jvb3Q7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBhc3luYygpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiB0aGlzLl9hc3luYztcblx0XHR9XG5cblx0XHRwdWJsaWMgc2V0IGFzeW5jKGFzeW5jOiBib29sZWFuKSB7XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSBhc3luYyBtb2RlJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9hc3luYyA9IGFzeW5jO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzYW5kYm94KGRvYzogRG9jdW1lbnQgPSBkb2N1bWVudCk6IHZvaWQge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjcmVhdGUgc2FuZGJveCcpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYXN5bmMgPSBmYWxzZTtcblx0XHRcdGNvbnN0IHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcblxuXHRcdFx0LyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXG5cdFx0XHR0aGlzLm93bigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3Jvb3QgPSBwcmV2aW91c1Jvb3Q7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5fYXR0YWNoKHtcblx0XHRcdFx0LyogRG9jdW1lbnRGcmFnbWVudCBpcyBub3QgYXNzaWduYWJsZSB0byBFbGVtZW50LCBidXQgcHJvdmlkZXMgZXZlcnl0aGluZyBuZWVkZWQgdG8gd29yayAqL1xuXHRcdFx0XHRyb290OiBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpIGFzIGFueSxcblx0XHRcdFx0dHlwZTogQXR0YWNoVHlwZS5BcHBlbmRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRDaGlsZHJlbihjaGlsZHJlbjogRE5vZGVbXSk6IHZvaWQge1xuXHRcdFx0dGhpcy5fX3NldENoaWxkcmVuX18oY2hpbGRyZW4pO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBzZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IHRoaXNbJ3Byb3BlcnRpZXMnXSk6IHZvaWQge1xuXHRcdFx0dGhpcy5fX3NldFByb3BlcnRpZXNfXyhwcm9wZXJ0aWVzKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllczogdGhpc1sncHJvcGVydGllcyddKTogdm9pZCB7XG5cdFx0XHRpZiAodGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyAmJiB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5ICE9PSBwcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XG5cdFx0XHRcdFx0dGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeS5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgPSBhc3NpZ24oe30sIHByb3BlcnRpZXMpO1xuXHRcdFx0c3VwZXIuX19zZXRDb3JlUHJvcGVydGllc19fKHsgYmluZDogdGhpcywgYmFzZVJlZ2lzdHJ5OiBwcm9wZXJ0aWVzLnJlZ2lzdHJ5IH0pO1xuXHRcdFx0c3VwZXIuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIHRvSHRtbCgpOiBzdHJpbmcge1xuXHRcdFx0aWYgKHRoaXMucHJvamVjdG9yU3RhdGUgIT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkIHx8ICF0aGlzLl9wcm9qZWN0aW9uKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGlzIG5vdCBhdHRhY2hlZCwgY2Fubm90IHJldHVybiBhbiBIVE1MIHN0cmluZyBvZiBwcm9qZWN0aW9uLicpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0aGlzLl9wcm9qZWN0aW9uLmRvbU5vZGUuY2hpbGROb2Rlc1swXSBhcyBFbGVtZW50KS5vdXRlckhUTUw7XG5cdFx0fVxuXG5cdFx0QGFmdGVyUmVuZGVyKClcblx0XHRwdWJsaWMgYWZ0ZXJSZW5kZXIocmVzdWx0OiBETm9kZSkge1xuXHRcdFx0bGV0IG5vZGUgPSByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgfHwgcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG5vZGUgPSB2KCdzcGFuJywge30sIFtyZXN1bHRdKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBvd24oaGFuZGxlOiBGdW5jdGlvbik6IHZvaWQge1xuXHRcdFx0dGhpcy5faGFuZGxlcy5wdXNoKGhhbmRsZSk7XG5cdFx0fVxuXG5cdFx0cHVibGljIGRlc3Ryb3koKSB7XG5cdFx0XHR3aGlsZSAodGhpcy5faGFuZGxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXMucG9wKCk7XG5cdFx0XHRcdGlmIChoYW5kbGUpIHtcblx0XHRcdFx0XHRoYW5kbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgX2F0dGFjaCh7IHR5cGUsIHJvb3QgfTogQXR0YWNoT3B0aW9ucyk6IEhhbmRsZSB7XG5cdFx0XHRpZiAocm9vdCkge1xuXHRcdFx0XHR0aGlzLnJvb3QgPSByb290O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkO1xuXG5cdFx0XHRjb25zdCBoYW5kbGUgPSAoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLm93bihoYW5kbGUpO1xuXHRcdFx0dGhpcy5fYXR0YWNoSGFuZGxlID0gY3JlYXRlSGFuZGxlKGhhbmRsZSk7XG5cblx0XHRcdHRoaXMuX3Byb2plY3Rpb25PcHRpb25zID0geyAuLi50aGlzLl9wcm9qZWN0aW9uT3B0aW9ucywgLi4ueyBzeW5jOiAhdGhpcy5fYXN5bmMgfSB9O1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLkFwcGVuZDpcblx0XHRcdFx0XHR0aGlzLl9wcm9qZWN0aW9uID0gZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBBdHRhY2hUeXBlLk1lcmdlOlxuXHRcdFx0XHRcdHRoaXMuX3Byb2plY3Rpb24gPSBkb20ubWVyZ2UodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLl9hdHRhY2hIYW5kbGU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFByb2plY3Rvcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdG9yTWl4aW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gUHJvamVjdG9yLnRzIiwiaW1wb3J0IHsgQ29uc3RydWN0b3IsIFdpZGdldFByb3BlcnRpZXMsIFN1cHBvcnRlZENsYXNzTmFtZSB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZWdpc3RyeSB9IGZyb20gJy4vLi4vUmVnaXN0cnknO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLy4uL0luamVjdG9yJztcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9pbmplY3QnO1xuaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJy4vLi4vV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyBoYW5kbGVEZWNvcmF0b3IgfSBmcm9tICcuLy4uL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yJztcbmltcG9ydCB7IGRpZmZQcm9wZXJ0eSB9IGZyb20gJy4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHknO1xuaW1wb3J0IHsgc2hhbGxvdyB9IGZyb20gJy4vLi4vZGlmZic7XG5cbi8qKlxuICogQSBsb29rdXAgb2JqZWN0IGZvciBhdmFpbGFibGUgY2xhc3MgbmFtZXNcbiAqL1xuZXhwb3J0IHR5cGUgQ2xhc3NOYW1lcyA9IHtcblx0W2tleTogc3RyaW5nXTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBBIGxvb2t1cCBvYmplY3QgZm9yIGF2YWlsYWJsZSB3aWRnZXQgY2xhc3NlcyBuYW1lc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRoZW1lIHtcblx0W2tleTogc3RyaW5nXTogb2JqZWN0O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgcmVxdWlyZWQgZm9yIHRoZSBUaGVtZWQgbWl4aW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZWRQcm9wZXJ0aWVzPFQgPSBDbGFzc05hbWVzPiBleHRlbmRzIFdpZGdldFByb3BlcnRpZXMge1xuXHRpbmplY3RlZFRoZW1lPzogYW55O1xuXHR0aGVtZT86IFRoZW1lO1xuXHRleHRyYUNsYXNzZXM/OiB7IFtQIGluIGtleW9mIFRdPzogc3RyaW5nIH07XG59XG5cbmNvbnN0IFRIRU1FX0tFWSA9ICcgX2tleSc7XG5cbmV4cG9ydCBjb25zdCBJTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgVGhlbWVkTWl4aW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaGVtZWRNaXhpbjxUID0gQ2xhc3NOYW1lcz4ge1xuXHR0aGVtZShjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpOiBTdXBwb3J0ZWRDbGFzc05hbWU7XG5cdHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZVtdKTogU3VwcG9ydGVkQ2xhc3NOYW1lW107XG5cdHByb3BlcnRpZXM6IFRoZW1lZFByb3BlcnRpZXM8VD47XG59XG5cbi8qKlxuICogRGVjb3JhdG9yIGZvciBiYXNlIGNzcyBjbGFzc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aGVtZSh0aGVtZToge30pIHtcblx0cmV0dXJuIGhhbmRsZURlY29yYXRvcigodGFyZ2V0KSA9PiB7XG5cdFx0dGFyZ2V0LmFkZERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycsIHRoZW1lKTtcblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBjbGFzc2VzIFRoZSBiYXNlQ2xhc3NlcyBvYmplY3RcbiAqIEByZXF1aXJlc1xuICovXG5mdW5jdGlvbiBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoY2xhc3NlczogQ2xhc3NOYW1lc1tdKTogQ2xhc3NOYW1lcyB7XG5cdHJldHVybiBjbGFzc2VzLnJlZHVjZShcblx0XHQoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykgPT4ge1xuXHRcdFx0T2JqZWN0LmtleXMoYmFzZUNsYXNzKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjdXJyZW50Q2xhc3NOYW1lc1tiYXNlQ2xhc3Nba2V5XV0gPSBrZXk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjdXJyZW50Q2xhc3NOYW1lcztcblx0XHR9LFxuXHRcdDxDbGFzc05hbWVzPnt9XG5cdCk7XG59XG5cbi8qKlxuICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBpcyBnaXZlbiBhIHRoZW1lIGFuZCBhbiBvcHRpb25hbCByZWdpc3RyeSwgdGhlIHRoZW1lXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxuICpcbiAqIEBwYXJhbSB0aGVtZSB0aGUgdGhlbWUgdG8gc2V0XG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXG4gKiB0byB0aGUgZ2xvYmFsIHJlZ2lzdHJ5XG4gKlxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lOiBhbnksIHRoZW1lUmVnaXN0cnk6IFJlZ2lzdHJ5KTogSW5qZWN0b3Ige1xuXHRjb25zdCB0aGVtZUluamVjdG9yID0gbmV3IEluamVjdG9yKHRoZW1lKTtcblx0dGhlbWVSZWdpc3RyeS5kZWZpbmVJbmplY3RvcihJTkpFQ1RFRF9USEVNRV9LRVksIHRoZW1lSW5qZWN0b3IpO1xuXHRyZXR1cm4gdGhlbWVJbmplY3Rvcjtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjbGFzcyBkZWNvcmF0ZWQgd2l0aCB3aXRoIFRoZW1lZCBmdW5jdGlvbmFsaXR5XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lZE1peGluPEUsIFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxXaWRnZXRCYXNlPFRoZW1lZFByb3BlcnRpZXM8RT4+Pj4oXG5cdEJhc2U6IFRcbik6IENvbnN0cnVjdG9yPFRoZW1lZE1peGluPEU+PiAmIFQge1xuXHRAaW5qZWN0KHtcblx0XHRuYW1lOiBJTkpFQ1RFRF9USEVNRV9LRVksXG5cdFx0Z2V0UHJvcGVydGllczogKHRoZW1lOiBUaGVtZSwgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllcyk6IFRoZW1lZFByb3BlcnRpZXMgPT4ge1xuXHRcdFx0aWYgKCFwcm9wZXJ0aWVzLnRoZW1lKSB7XG5cdFx0XHRcdHJldHVybiB7IHRoZW1lIH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fVxuXHR9KVxuXHRjbGFzcyBUaGVtZWQgZXh0ZW5kcyBCYXNlIHtcblx0XHRwdWJsaWMgcHJvcGVydGllczogVGhlbWVkUHJvcGVydGllczxFPjtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBUaGVtZWQgYmFzZUNsYXNzZXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lOiBDbGFzc05hbWVzO1xuXG5cdFx0LyoqXG5cdFx0ICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcblx0XHQgKi9cblx0XHRwcml2YXRlIF9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5czogc3RyaW5nW10gPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIFJldmVyc2UgbG9va3VwIG9mIHRoZSB0aGVtZSBjbGFzc2VzXG5cdFx0ICovXG5cdFx0cHJpdmF0ZSBfYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXA6IENsYXNzTmFtZXM7XG5cblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgY2xhc3NlcyBtZXRhIGRhdGEgbmVlZCB0byBiZSBjYWxjdWxhdGVkLlxuXHRcdCAqL1xuXHRcdHByaXZhdGUgX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cblx0XHQvKipcblx0XHQgKiBMb2FkZWQgdGhlbWVcblx0XHQgKi9cblx0XHRwcml2YXRlIF90aGVtZTogQ2xhc3NOYW1lcyA9IHt9O1xuXG5cdFx0cHVibGljIHRoZW1lKGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWVbXTtcblx0XHRwdWJsaWMgdGhlbWUoY2xhc3NlczogU3VwcG9ydGVkQ2xhc3NOYW1lIHwgU3VwcG9ydGVkQ2xhc3NOYW1lW10pOiBTdXBwb3J0ZWRDbGFzc05hbWUgfCBTdXBwb3J0ZWRDbGFzc05hbWVbXSB7XG5cdFx0XHRpZiAodGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzKSB7XG5cdFx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuXHRcdFx0XHRyZXR1cm4gY2xhc3Nlcy5tYXAoKGNsYXNzTmFtZSkgPT4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWUpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cblx0XHQgKi9cblx0XHRAZGlmZlByb3BlcnR5KCd0aGVtZScsIHNoYWxsb3cpXG5cdFx0QGRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgc2hhbGxvdylcblx0XHRwcm90ZWN0ZWQgb25Qcm9wZXJ0aWVzQ2hhbmdlZCgpIHtcblx0XHRcdHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWU6IFN1cHBvcnRlZENsYXNzTmFtZSk6IFN1cHBvcnRlZENsYXNzTmFtZSB7XG5cdFx0XHRpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQgfHwgY2xhc3NOYW1lID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBjbGFzc05hbWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwgKHt9IGFzIGFueSk7XG5cdFx0XHRjb25zdCB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XG5cdFx0XHRsZXQgcmVzdWx0Q2xhc3NOYW1lczogc3RyaW5nW10gPSBbXTtcblx0XHRcdGlmICghdGhlbWVDbGFzc05hbWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBDbGFzcyBuYW1lOiAnJHtjbGFzc05hbWV9JyBub3QgZm91bmQgaW4gdGhlbWVgKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3RoZW1lW3RoZW1lQ2xhc3NOYW1lXSkge1xuXHRcdFx0XHRyZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKSB7XG5cdFx0XHRjb25zdCB7IHRoZW1lID0ge30gfSA9IHRoaXMucHJvcGVydGllcztcblx0XHRcdGNvbnN0IGJhc2VUaGVtZXMgPSB0aGlzLmdldERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycpO1xuXHRcdFx0aWYgKCF0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lKSB7XG5cdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUgPSBiYXNlVGhlbWVzLnJlZHVjZSgoZmluYWxCYXNlVGhlbWUsIGJhc2VUaGVtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHsgW1RIRU1FX0tFWV06IGtleSwgLi4uY2xhc3NlcyB9ID0gYmFzZVRoZW1lO1xuXHRcdFx0XHRcdHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5maW5hbEJhc2VUaGVtZSwgLi4uY2xhc3NlcyB9O1xuXHRcdFx0XHR9LCB7fSk7XG5cdFx0XHRcdHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwID0gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGJhc2VUaGVtZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZSgoYmFzZVRoZW1lLCB0aGVtZUtleSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4geyAuLi5iYXNlVGhlbWUsIC4uLnRoZW1lW3RoZW1lS2V5XSB9O1xuXHRcdFx0fSwge30pO1xuXG5cdFx0XHR0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gVGhlbWVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUaGVtZWRNaXhpbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBUaGVtZWQudHMiLCJpbXBvcnQgeyBjdXN0b21FdmVudENsYXNzLCBDdXN0b21FbGVtZW50RGVzY3JpcHRvciwgaGFuZGxlQXR0cmlidXRlQ2hhbmdlZCwgaW5pdGlhbGl6ZUVsZW1lbnQgfSBmcm9tICcuL2N1c3RvbUVsZW1lbnRzJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBXaWRnZXRQcm9wZXJ0aWVzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICcuL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgUHJvamVjdG9yTWl4aW4gfSBmcm9tICcuL21peGlucy9Qcm9qZWN0b3InO1xuXG5kZWNsYXJlIG5hbWVzcGFjZSBjdXN0b21FbGVtZW50cyB7XG5cdGZ1bmN0aW9uIGRlZmluZShuYW1lOiBzdHJpbmcsIGNvbnN0cnVjdG9yOiBhbnkpOiB2b2lkO1xufVxuXG4vKipcbiAqIERlc2NyaWJlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudERlc2NyaXB0b3JGYWN0b3J5IHtcblx0KCk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgY3VzdG9tIGVsZW1lbnQgdXNpbmcgdGhlIHYxIHNwZWMgb2YgY3VzdG9tIGVsZW1lbnRzLiBOb3RlIHRoYXRcbiAqIHRoaXMgaXMgdGhlIGRlZmF1bHQgZXhwb3J0LCBhbmQsIGV4cGVjdHMgdGhlIHByb3Bvc2FsIHRvIHdvcmsgaW4gdGhlIGJyb3dzZXIuXG4gKiBUaGlzIHdpbGwgbGlrZWx5IHJlcXVpcmUgdGhlIHBvbHlmaWxsIGFuZCBuYXRpdmUgc2hpbS5cbiAqXG4gKiBAcGFyYW0gZGVzY3JpcHRvckZhY3RvcnlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZXNjcmlwdG9yRmFjdG9yeTogQ3VzdG9tRWxlbWVudERlc2NyaXB0b3JGYWN0b3J5KSB7XG5cdGNvbnN0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yRmFjdG9yeSgpO1xuXG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcblx0XHRkZXNjcmlwdG9yLnRhZ05hbWUsXG5cdFx0Y2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdFx0XHRwcml2YXRlIF9pc0FwcGVuZGVkID0gZmFsc2U7XG5cdFx0XHRwcml2YXRlIF9hcHBlbmRlcjogRnVuY3Rpb247XG5cdFx0XHRwcml2YXRlIF93aWRnZXRJbnN0YW5jZTogUHJvamVjdG9yTWl4aW48YW55PjtcblxuXHRcdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHRcdHN1cGVyKCk7XG5cblx0XHRcdFx0dGhpcy5fYXBwZW5kZXIgPSBpbml0aWFsaXplRWxlbWVudCh0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0cHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0XHRpZiAoIXRoaXMuX2lzQXBwZW5kZWQpIHtcblx0XHRcdFx0XHR0aGlzLl9hcHBlbmRlcigpO1xuXHRcdFx0XHRcdHRoaXMuX2lzQXBwZW5kZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcblx0XHRcdFx0XHRcdG5ldyBjdXN0b21FdmVudENsYXNzKCdjb25uZWN0ZWQnLCB7XG5cdFx0XHRcdFx0XHRcdGJ1YmJsZXM6IGZhbHNlXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cHVibGljIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuXHRcdFx0XHRoYW5kbGVBdHRyaWJ1dGVDaGFuZ2VkKHRoaXMsIG5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBnZXRXaWRnZXRJbnN0YW5jZSgpOiBQcm9qZWN0b3JNaXhpbjxhbnk+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3dpZGdldEluc3RhbmNlO1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgc2V0V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0OiBQcm9qZWN0b3JNaXhpbjxhbnk+KTogdm9pZCB7XG5cdFx0XHRcdHRoaXMuX3dpZGdldEluc3RhbmNlID0gd2lkZ2V0O1xuXHRcdFx0fVxuXG5cdFx0XHRwdWJsaWMgZ2V0V2lkZ2V0Q29uc3RydWN0b3IoKTogQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxXaWRnZXRQcm9wZXJ0aWVzPj4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREZXNjcmlwdG9yKCkud2lkZ2V0Q29uc3RydWN0b3I7XG5cdFx0XHR9XG5cblx0XHRcdHB1YmxpYyBnZXREZXNjcmlwdG9yKCk6IEN1c3RvbUVsZW1lbnREZXNjcmlwdG9yIHtcblx0XHRcdFx0cmV0dXJuIGRlc2NyaXB0b3I7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCk6IHN0cmluZ1tdIHtcblx0XHRcdFx0cmV0dXJuIChkZXNjcmlwdG9yLmF0dHJpYnV0ZXMgfHwgW10pLm1hcCgoYXR0cmlidXRlKSA9PiBhdHRyaWJ1dGUuYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlZ2lzdGVyQ3VzdG9tRWxlbWVudDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyByZWdpc3RlckN1c3RvbUVsZW1lbnQudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnLi8uLi9XaWRnZXRCYXNlJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBETm9kZSwgVk5vZGUsIFZOb2RlUHJvcGVydGllcywgV2lkZ2V0UHJvcGVydGllcyB9IGZyb20gJy4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnLi8uLi9kJztcbmltcG9ydCB7IEludGVybmFsVk5vZGUgfSBmcm9tICcuLy4uL3Zkb20nO1xuXG5leHBvcnQgaW50ZXJmYWNlIERvbVdyYXBwZXJPcHRpb25zIHtcblx0b25BdHRhY2hlZD8oKTogdm9pZDtcbn1cblxuZXhwb3J0IHR5cGUgRG9tV3JhcHBlclByb3BlcnRpZXMgPSBWTm9kZVByb3BlcnRpZXMgJiBXaWRnZXRQcm9wZXJ0aWVzO1xuXG5leHBvcnQgdHlwZSBEb21XcmFwcGVyID0gQ29uc3RydWN0b3I8V2lkZ2V0QmFzZTxEb21XcmFwcGVyUHJvcGVydGllcz4+O1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWU6IGFueSk6IHZhbHVlIGlzIEVsZW1lbnQge1xuXHRyZXR1cm4gdmFsdWUudGFnTmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERvbVdyYXBwZXIoZG9tTm9kZTogRWxlbWVudCB8IFRleHQsIG9wdGlvbnM6IERvbVdyYXBwZXJPcHRpb25zID0ge30pOiBEb21XcmFwcGVyIHtcblx0cmV0dXJuIGNsYXNzIERvbVdyYXBwZXIgZXh0ZW5kcyBXaWRnZXRCYXNlPERvbVdyYXBwZXJQcm9wZXJ0aWVzPiB7XG5cdFx0cHVibGljIF9fcmVuZGVyX18oKTogVk5vZGUge1xuXHRcdFx0Y29uc3Qgdk5vZGUgPSBzdXBlci5fX3JlbmRlcl9fKCkgYXMgSW50ZXJuYWxWTm9kZTtcblx0XHRcdHZOb2RlLmRvbU5vZGUgPSBkb21Ob2RlO1xuXHRcdFx0cmV0dXJuIHZOb2RlO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvbkF0dGFjaCgpIHtcblx0XHRcdG9wdGlvbnMub25BdHRhY2hlZCAmJiBvcHRpb25zLm9uQXR0YWNoZWQoKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcmVuZGVyKCk6IEROb2RlIHtcblx0XHRcdGNvbnN0IHByb3BlcnRpZXMgPSB7IC4uLnRoaXMucHJvcGVydGllcywga2V5OiAncm9vdCcgfTtcblx0XHRcdGNvbnN0IHRhZyA9IGlzRWxlbWVudChkb21Ob2RlKSA/IGRvbU5vZGUudGFnTmFtZSA6ICcnO1xuXHRcdFx0cmV0dXJuIHYodGFnLCBwcm9wZXJ0aWVzKTtcblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERvbVdyYXBwZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gRG9tV3JhcHBlci50cyIsImltcG9ydCBnbG9iYWwgZnJvbSAnQGRvam8vc2hpbS9nbG9iYWwnO1xuaW1wb3J0IHtcblx0Q29yZVByb3BlcnRpZXMsXG5cdERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRETm9kZSxcblx0Vk5vZGUsXG5cdFdOb2RlLFxuXHRQcm9qZWN0aW9uT3B0aW9ucyxcblx0UHJvamVjdGlvbixcblx0U3VwcG9ydGVkQ2xhc3NOYW1lLFxuXHRUcmFuc2l0aW9uU3RyYXRlZ3ksXG5cdFZOb2RlUHJvcGVydGllc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgZnJvbSBhcyBhcnJheUZyb20gfSBmcm9tICdAZG9qby9zaGltL2FycmF5JztcbmltcG9ydCB7IGlzV05vZGUsIGlzVk5vZGUsIFZOT0RFLCBXTk9ERSB9IGZyb20gJy4vZCc7XG5pbXBvcnQgeyBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvciB9IGZyb20gJy4vUmVnaXN0cnknO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnQGRvam8vc2hpbS9XZWFrTWFwJztcbmltcG9ydCBOb2RlSGFuZGxlciBmcm9tICcuL05vZGVIYW5kbGVyJztcbmltcG9ydCBSZWdpc3RyeUhhbmRsZXIgZnJvbSAnLi9SZWdpc3RyeUhhbmRsZXInO1xuXG5jb25zdCBOQU1FU1BBQ0VfVzMgPSAnaHR0cDovL3d3dy53My5vcmcvJztcbmNvbnN0IE5BTUVTUEFDRV9TVkcgPSBOQU1FU1BBQ0VfVzMgKyAnMjAwMC9zdmcnO1xuY29uc3QgTkFNRVNQQUNFX1hMSU5LID0gTkFNRVNQQUNFX1czICsgJzE5OTkveGxpbmsnO1xuXG5jb25zdCBlbXB0eUFycmF5OiAoSW50ZXJuYWxXTm9kZSB8IEludGVybmFsVk5vZGUpW10gPSBbXTtcblxuZXhwb3J0IHR5cGUgUmVuZGVyUmVzdWx0ID0gRE5vZGU8YW55PiB8IEROb2RlPGFueT5bXTtcblxuaW50ZXJmYWNlIEluc3RhbmNlTWFwRGF0YSB7XG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlO1xuXHRkbm9kZTogSW50ZXJuYWxXTm9kZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbFdOb2RlIGV4dGVuZHMgV05vZGU8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+IHtcblx0LyoqXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgd2lkZ2V0XG5cdCAqL1xuXHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U7XG5cblx0LyoqXG5cdCAqIFRoZSByZW5kZXJlZCBETm9kZXMgZnJvbSB0aGUgaW5zdGFuY2Vcblx0ICovXG5cdHJlbmRlcmVkOiBJbnRlcm5hbEROb2RlW107XG5cblx0LyoqXG5cdCAqIENvcmUgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkIGJ5IHRoZSB3aWRnZXQgY29yZSBzeXN0ZW1cblx0ICovXG5cdGNvcmVQcm9wZXJ0aWVzOiBDb3JlUHJvcGVydGllcztcblxuXHQvKipcblx0ICogQ2hpbGRyZW4gZm9yIHRoZSBXTm9kZVxuXHQgKi9cblx0Y2hpbGRyZW46IEludGVybmFsRE5vZGVbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbFZOb2RlIGV4dGVuZHMgVk5vZGUge1xuXHQvKipcblx0ICogQ2hpbGRyZW4gZm9yIHRoZSBWTm9kZVxuXHQgKi9cblx0Y2hpbGRyZW4/OiBJbnRlcm5hbEROb2RlW107XG5cblx0aW5zZXJ0ZWQ/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBCYWcgdXNlZCB0byBzdGlsbCBkZWNvcmF0ZSBwcm9wZXJ0aWVzIG9uIGEgZGVmZXJyZWQgcHJvcGVydGllcyBjYWxsYmFja1xuXHQgKi9cblx0ZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzPzogVk5vZGVQcm9wZXJ0aWVzO1xuXG5cdC8qKlxuXHQgKiBET00gZWxlbWVudFxuXHQgKi9cblx0ZG9tTm9kZT86IEVsZW1lbnQgfCBUZXh0O1xufVxuXG5leHBvcnQgdHlwZSBJbnRlcm5hbEROb2RlID0gSW50ZXJuYWxWTm9kZSB8IEludGVybmFsV05vZGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyUXVldWUge1xuXHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U7XG5cdGRlcHRoOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2lkZ2V0RGF0YSB7XG5cdG9uRGV0YWNoOiAoKSA9PiB2b2lkO1xuXHRvbkF0dGFjaDogKCkgPT4gdm9pZDtcblx0ZGlydHk6IGJvb2xlYW47XG5cdHJlZ2lzdHJ5OiAoKSA9PiBSZWdpc3RyeUhhbmRsZXI7XG5cdG5vZGVIYW5kbGVyOiBOb2RlSGFuZGxlcjtcblx0Y29yZVByb3BlcnRpZXM6IENvcmVQcm9wZXJ0aWVzO1xuXHRpbnZhbGlkYXRlPzogRnVuY3Rpb247XG5cdHJlbmRlcmluZzogYm9vbGVhbjtcblx0aW5wdXRQcm9wZXJ0aWVzOiBhbnk7XG59XG5cbmV4cG9ydCBjb25zdCB3aWRnZXRJbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwPGFueSwgV2lkZ2V0RGF0YT4oKTtcblxuY29uc3QgaW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcDxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSwgSW5zdGFuY2VNYXBEYXRhPigpO1xuY29uc3QgcmVuZGVyUXVldWVNYXAgPSBuZXcgV2Vha01hcDxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSwgUmVuZGVyUXVldWVbXT4oKTtcblxuZnVuY3Rpb24gc2FtZShkbm9kZTE6IEludGVybmFsRE5vZGUsIGRub2RlMjogSW50ZXJuYWxETm9kZSkge1xuXHRpZiAoaXNWTm9kZShkbm9kZTEpICYmIGlzVk5vZGUoZG5vZGUyKSkge1xuXHRcdGlmIChkbm9kZTEudGFnICE9PSBkbm9kZTIudGFnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlIGlmIChpc1dOb2RlKGRub2RlMSkgJiYgaXNXTm9kZShkbm9kZTIpKSB7XG5cdFx0aWYgKGRub2RlMS53aWRnZXRDb25zdHJ1Y3RvciAhPT0gZG5vZGUyLndpZGdldENvbnN0cnVjdG9yKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IG1pc3NpbmdUcmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xufTtcblxuZnVuY3Rpb24gZ2V0UHJvamVjdGlvbk9wdGlvbnMoXG5cdHByb2plY3Rvck9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+LFxuXHRwcm9qZWN0b3JJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbik6IFByb2plY3Rpb25PcHRpb25zIHtcblx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0bmFtZXNwYWNlOiB1bmRlZmluZWQsXG5cdFx0c3R5bGVBcHBseWVyOiBmdW5jdGlvbihkb21Ob2RlOiBIVE1MRWxlbWVudCwgc3R5bGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0XHRcdChkb21Ob2RlLnN0eWxlIGFzIGFueSlbc3R5bGVOYW1lXSA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0dHJhbnNpdGlvbnM6IHtcblx0XHRcdGVudGVyOiBtaXNzaW5nVHJhbnNpdGlvbixcblx0XHRcdGV4aXQ6IG1pc3NpbmdUcmFuc2l0aW9uXG5cdFx0fSxcblx0XHRkZWZlcnJlZFJlbmRlckNhbGxiYWNrczogW10sXG5cdFx0YWZ0ZXJSZW5kZXJDYWxsYmFja3M6IFtdLFxuXHRcdG5vZGVNYXA6IG5ldyBXZWFrTWFwKCksXG5cdFx0ZGVwdGg6IDAsXG5cdFx0bWVyZ2U6IGZhbHNlLFxuXHRcdHJlbmRlclNjaGVkdWxlZDogdW5kZWZpbmVkLFxuXHRcdHJlbmRlclF1ZXVlOiBbXSxcblx0XHRwcm9qZWN0b3JJbnN0YW5jZVxuXHR9O1xuXHRyZXR1cm4geyAuLi5kZWZhdWx0cywgLi4ucHJvamVjdG9yT3B0aW9ucyB9IGFzIFByb2plY3Rpb25PcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZTogT2JqZWN0KSB7XG5cdGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVFdmVudHMoXG5cdGRvbU5vZGU6IE5vZGUsXG5cdHByb3BOYW1lOiBzdHJpbmcsXG5cdHByb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zLFxuXHRwcmV2aW91c1Byb3BlcnRpZXM/OiBWTm9kZVByb3BlcnRpZXNcbikge1xuXHRjb25zdCBwcmV2aW91cyA9IHByZXZpb3VzUHJvcGVydGllcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRjb25zdCBjdXJyZW50VmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0Y29uc3QgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzW3Byb3BOYW1lXTtcblxuXHRjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMik7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSkgfHwgbmV3IFdlYWtNYXAoKTtcblxuXHRpZiAocHJldmlvdXNWYWx1ZSkge1xuXHRcdGNvbnN0IHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XG5cdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XG5cdH1cblxuXHRsZXQgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXG5cdGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcblx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKHRoaXM6IGFueSwgZXZ0OiBFdmVudCkge1xuXHRcdFx0Y3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcblx0XHRcdChldnQudGFyZ2V0IGFzIGFueSlbJ29uaW5wdXQtdmFsdWUnXSA9IChldnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXHRcdH0uYmluZChwcm9wZXJ0aWVzLmJpbmQpO1xuXHR9XG5cblx0ZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHRldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XG5cdHByb2plY3Rpb25PcHRpb25zLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcbn1cblxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlOiBFbGVtZW50LCBjbGFzc2VzOiBTdXBwb3J0ZWRDbGFzc05hbWUpIHtcblx0aWYgKGNsYXNzZXMpIHtcblx0XHRjb25zdCBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXNbaV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzc2VzKGRvbU5vZGU6IEVsZW1lbnQsIGNsYXNzZXM6IFN1cHBvcnRlZENsYXNzTmFtZSkge1xuXHRpZiAoY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRkb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lc1tpXSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGZvY3VzTm9kZShwcm9wVmFsdWU6IGFueSwgcHJldmlvdXNWYWx1ZTogYW55LCBkb21Ob2RlOiBFbGVtZW50LCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpOiB2b2lkIHtcblx0bGV0IHJlc3VsdDtcblx0aWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXN1bHQgPSBwcm9wVmFsdWUoKTtcblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSBwcm9wVmFsdWUgJiYgIXByZXZpb3VzVmFsdWU7XG5cdH1cblx0aWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuXHRcdHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0KGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydGllcyhkb21Ob2RlOiBFbGVtZW50LCBwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRjb25zdCBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0Y29uc3QgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuXHRcdGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0XHRpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xuXHRcdFx0Y29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcblx0XHRcdGlmICghZG9tTm9kZS5jbGFzc05hbWUpIHtcblx0XHRcdFx0ZG9tTm9kZS5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKCcgJykudHJpbSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2ZvY3VzJykge1xuXHRcdFx0Zm9jdXNOb2RlKHByb3BWYWx1ZSwgZmFsc2UsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xuXHRcdFx0Y29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG5cdFx0XHRjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuXHRcdFx0XHRjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuXHRcdFx0XHRjb25zdCBzdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGlmIChzdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpO1xuXHRcdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllciEoZG9tTm9kZSBhcyBIVE1MRWxlbWVudCwgc3R5bGVOYW1lLCBzdHlsZVZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgIT09ICdrZXknICYmIHByb3BWYWx1ZSAhPT0gbnVsbCAmJiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xuXHRcdFx0XHR1cGRhdGVFdmVudHMoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICd2YWx1ZScgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XG5cdFx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdChkb21Ob2RlIGFzIEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KGRvbU5vZGUgYXMgRWxlbWVudCkuc2V0QXR0cmlidXRlKHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoXG5cdGRvbU5vZGU6IEVsZW1lbnQsXG5cdHByZXZpb3VzUHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9wZXJ0aWVzOiBWTm9kZVByb3BlcnRpZXMsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9uc1xuKSB7XG5cdGNvbnN0IGV2ZW50TWFwID0gcHJvamVjdGlvbk9wdGlvbnMubm9kZU1hcC5nZXQoZG9tTm9kZSk7XG5cdGlmIChldmVudE1hcCkge1xuXHRcdE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcblx0XHRcdGlmIChwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XG5cdFx0XHRcdGNvbnN0IGV2ZW50Q2FsbGJhY2sgPSBldmVudE1hcC5nZXQocHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXSk7XG5cdFx0XHRcdGlmIChldmVudENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0ZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHByb3BOYW1lLnN1YnN0cigyKSwgZXZlbnRDYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRwcmV2aW91c1Byb3BlcnRpZXM6IFZOb2RlUHJvcGVydGllcyxcblx0cHJvcGVydGllczogVk5vZGVQcm9wZXJ0aWVzLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRsZXQgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcblx0Y29uc3QgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdGNvbnN0IHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XG5cdGlmIChwcm9wTmFtZXMuaW5kZXhPZignY2xhc3NlcycpID09PSAtMSAmJiBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzW2ldKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcyk7XG5cdFx0fVxuXHR9XG5cblx0cmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuXHRcdGNvbnN0IHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuXHRcdGxldCBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcblx0XHRjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzIVtwcm9wTmFtZV07XG5cdFx0aWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcblx0XHRcdGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xuXHRcdFx0Y29uc3QgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcblx0XHRcdGlmIChwcmV2aW91c0NsYXNzZXMgJiYgcHJldmlvdXNDbGFzc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRyZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3Nlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IG5ld0NsYXNzZXM6IChudWxsIHwgdW5kZWZpbmVkIHwgc3RyaW5nKVtdID0gWy4uLmN1cnJlbnRDbGFzc2VzXTtcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV07XG5cdFx0XHRcdFx0XHRpZiAocHJldmlvdXNDbGFzc05hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChjbGFzc0luZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc05hbWUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Q2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0YWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcblx0XHRcdGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xuXHRcdFx0Y29uc3Qgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG5cdFx0XHRjb25zdCBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuXHRcdFx0XHRjb25zdCBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xuXHRcdFx0XHRjb25zdCBuZXdTdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGNvbnN0IG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XG5cdFx0XHRcdGlmIChuZXdTdHlsZVZhbHVlID09PSBvbGRTdHlsZVZhbHVlKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAobmV3U3R5bGVWYWx1ZSkge1xuXHRcdFx0XHRcdGNoZWNrU3R5bGVWYWx1ZShuZXdTdHlsZVZhbHVlKTtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIhKGRvbU5vZGUgYXMgSFRNTEVsZW1lbnQsIHN0eWxlTmFtZSwgbmV3U3R5bGVWYWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyIShkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBzdHlsZU5hbWUsICcnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIXByb3BWYWx1ZSAmJiB0eXBlb2YgcHJldmlvdXNWYWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cHJvcFZhbHVlID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJvcE5hbWUgPT09ICd2YWx1ZScpIHtcblx0XHRcdFx0Y29uc3QgZG9tVmFsdWUgPSAoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGRvbVZhbHVlICE9PSBwcm9wVmFsdWUgJiZcblx0XHRcdFx0XHQoKGRvbU5vZGUgYXMgYW55KVsnb25pbnB1dC12YWx1ZSddXG5cdFx0XHRcdFx0XHQ/IGRvbVZhbHVlID09PSAoZG9tTm9kZSBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ11cblx0XHRcdFx0XHRcdDogcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcblx0XHRcdFx0XHQoZG9tTm9kZSBhcyBhbnkpWydvbmlucHV0LXZhbHVlJ10gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xuXHRcdFx0XHRcdHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcblx0XHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwKSB7XG5cdFx0XHRcdFx0dXBkYXRlRXZlbnRzKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJldmlvdXNQcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcpIHtcblx0XHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHICYmIHByb3BOYW1lID09PSAnaHJlZicpIHtcblx0XHRcdFx0XHRcdGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBwcm9wTmFtZSwgcHJvcFZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHByb3BOYW1lID09PSAncm9sZScgJiYgcHJvcFZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdFx0ZG9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUocHJvcE5hbWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdICE9PSBwcm9wVmFsdWUpIHtcblx0XHRcdFx0XHRcdC8vIENvbXBhcmlzb24gaXMgaGVyZSBmb3Igc2lkZS1lZmZlY3RzIGluIEVkZ2Ugd2l0aCBzY3JvbGxMZWZ0IGFuZCBzY3JvbGxUb3Bcblx0XHRcdFx0XHRcdChkb21Ob2RlIGFzIGFueSlbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBwcm9wZXJ0aWVzVXBkYXRlZDtcbn1cblxuZnVuY3Rpb24gZmluZEluZGV4T2ZDaGlsZChjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdLCBzYW1lQXM6IEludGVybmFsRE5vZGUsIHN0YXJ0OiBudW1iZXIpIHtcblx0Zm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoc2FtZShjaGlsZHJlbltpXSwgc2FtZUFzKSkge1xuXHRcdFx0cmV0dXJuIGk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUGFyZW50Vk5vZGUoZG9tTm9kZTogRWxlbWVudCk6IEludGVybmFsVk5vZGUge1xuXHRyZXR1cm4ge1xuXHRcdHRhZzogJycsXG5cdFx0cHJvcGVydGllczoge30sXG5cdFx0Y2hpbGRyZW46IHVuZGVmaW5lZCxcblx0XHRkb21Ob2RlLFxuXHRcdHR5cGU6IFZOT0RFXG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RleHRWTm9kZShkYXRhOiBhbnkpOiBJbnRlcm5hbFZOb2RlIHtcblx0cmV0dXJuIHtcblx0XHR0YWc6ICcnLFxuXHRcdHByb3BlcnRpZXM6IHt9LFxuXHRcdGNoaWxkcmVuOiB1bmRlZmluZWQsXG5cdFx0dGV4dDogYCR7ZGF0YX1gLFxuXHRcdGRvbU5vZGU6IHVuZGVmaW5lZCxcblx0XHR0eXBlOiBWTk9ERVxuXHR9O1xufVxuXG5mdW5jdGlvbiB0b0ludGVybmFsV05vZGUoaW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLCBpbnN0YW5jZURhdGE6IFdpZGdldERhdGEpOiBJbnRlcm5hbFdOb2RlIHtcblx0cmV0dXJuIHtcblx0XHRpbnN0YW5jZSxcblx0XHRyZW5kZXJlZDogW10sXG5cdFx0Y29yZVByb3BlcnRpZXM6IGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyxcblx0XHRjaGlsZHJlbjogaW5zdGFuY2UuY2hpbGRyZW4gYXMgYW55LFxuXHRcdHdpZGdldENvbnN0cnVjdG9yOiBpbnN0YW5jZS5jb25zdHJ1Y3RvciBhcyBhbnksXG5cdFx0cHJvcGVydGllczogaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyxcblx0XHR0eXBlOiBXTk9ERVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihcblx0Y2hpbGRyZW46IHVuZGVmaW5lZCB8IEROb2RlIHwgRE5vZGVbXSxcblx0aW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlXG4pOiBJbnRlcm5hbEROb2RlW10ge1xuXHRpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBlbXB0eUFycmF5O1xuXHR9XG5cdGNoaWxkcmVuID0gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IFtjaGlsZHJlbl07XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICkge1xuXHRcdGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV0gYXMgSW50ZXJuYWxETm9kZTtcblx0XHRpZiAoY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gbnVsbCkge1xuXHRcdFx0Y2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjaGlsZHJlbltpXSA9IHRvVGV4dFZOb2RlKGNoaWxkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGlzVk5vZGUoY2hpbGQpKSB7XG5cdFx0XHRcdGlmIChjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdChjaGlsZC5wcm9wZXJ0aWVzIGFzIGFueSkuYmluZCA9IGluc3RhbmNlO1xuXHRcdFx0XHRcdGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWNoaWxkLmNvcmVQcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0XHRcdFx0Y2hpbGQuY29yZVByb3BlcnRpZXMgPSB7XG5cdFx0XHRcdFx0XHRiaW5kOiBpbnN0YW5jZSxcblx0XHRcdFx0XHRcdGJhc2VSZWdpc3RyeTogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBpbnN0YW5jZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aSsrO1xuXHR9XG5cdHJldHVybiBjaGlsZHJlbiBhcyBJbnRlcm5hbEROb2RlW107XG59XG5cbmZ1bmN0aW9uIG5vZGVBZGRlZChkbm9kZTogSW50ZXJuYWxETm9kZSwgdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25TdHJhdGVneSkge1xuXHRpZiAoaXNWTm9kZShkbm9kZSkgJiYgZG5vZGUucHJvcGVydGllcykge1xuXHRcdGNvbnN0IGVudGVyQW5pbWF0aW9uID0gZG5vZGUucHJvcGVydGllcy5lbnRlckFuaW1hdGlvbjtcblx0XHRpZiAoZW50ZXJBbmltYXRpb24pIHtcblx0XHRcdGlmICh0eXBlb2YgZW50ZXJBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0ZW50ZXJBbmltYXRpb24oZG5vZGUuZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyYW5zaXRpb25zLmVudGVyKGRub2RlLmRvbU5vZGUgYXMgRWxlbWVudCwgZG5vZGUucHJvcGVydGllcywgZW50ZXJBbmltYXRpb24gYXMgc3RyaW5nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY2FsbE9uRGV0YWNoKGROb2RlczogSW50ZXJuYWxETm9kZSB8IEludGVybmFsRE5vZGVbXSwgcGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlKTogdm9pZCB7XG5cdGROb2RlcyA9IEFycmF5LmlzQXJyYXkoZE5vZGVzKSA/IGROb2RlcyA6IFtkTm9kZXNdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGROb2RlID0gZE5vZGVzW2ldO1xuXHRcdGlmIChpc1dOb2RlKGROb2RlKSkge1xuXHRcdFx0aWYgKGROb2RlLnJlbmRlcmVkKSB7XG5cdFx0XHRcdGNhbGxPbkRldGFjaChkTm9kZS5yZW5kZXJlZCwgZE5vZGUuaW5zdGFuY2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGROb2RlLmluc3RhbmNlKSB7XG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChkTm9kZS5pbnN0YW5jZSkhO1xuXHRcdFx0XHRpbnN0YW5jZURhdGEub25EZXRhY2goKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGROb2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdGNhbGxPbkRldGFjaChkTm9kZS5jaGlsZHJlbiBhcyBJbnRlcm5hbEROb2RlW10sIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbm9kZVRvUmVtb3ZlKGRub2RlOiBJbnRlcm5hbEROb2RlLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvblN0cmF0ZWd5LCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKGlzV05vZGUoZG5vZGUpKSB7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSBkbm9kZS5yZW5kZXJlZCB8fCBlbXB0eUFycmF5O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyZWQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGNoaWxkID0gcmVuZGVyZWRbaV07XG5cdFx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdFx0Y2hpbGQuZG9tTm9kZSEucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQoY2hpbGQuZG9tTm9kZSEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZVRvUmVtb3ZlKGNoaWxkLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdCBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcblx0XHRjb25zdCBwcm9wZXJ0aWVzID0gZG5vZGUucHJvcGVydGllcztcblx0XHRjb25zdCBleGl0QW5pbWF0aW9uID0gcHJvcGVydGllcy5leGl0QW5pbWF0aW9uO1xuXHRcdGlmIChwcm9wZXJ0aWVzICYmIGV4aXRBbmltYXRpb24pIHtcblx0XHRcdChkb21Ob2RlIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXHRcdFx0Y29uc3QgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkb21Ob2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG5cdFx0XHR9O1xuXHRcdFx0aWYgKHR5cGVvZiBleGl0QW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGV4aXRBbmltYXRpb24oZG9tTm9kZSBhcyBFbGVtZW50LCByZW1vdmVEb21Ob2RlLCBwcm9wZXJ0aWVzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJhbnNpdGlvbnMuZXhpdChkbm9kZS5kb21Ob2RlIGFzIEVsZW1lbnQsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24gYXMgc3RyaW5nLCByZW1vdmVEb21Ob2RlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRkb21Ob2RlICYmIGRvbU5vZGUucGFyZW50Tm9kZSAmJiBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2hlY2tEaXN0aW5ndWlzaGFibGUoXG5cdGNoaWxkTm9kZXM6IEludGVybmFsRE5vZGVbXSxcblx0aW5kZXhUb0NoZWNrOiBudW1iZXIsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZVxuKSB7XG5cdGNvbnN0IGNoaWxkTm9kZSA9IGNoaWxkTm9kZXNbaW5kZXhUb0NoZWNrXTtcblx0aWYgKGlzVk5vZGUoY2hpbGROb2RlKSAmJiAhY2hpbGROb2RlLnRhZykge1xuXHRcdHJldHVybjsgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcblx0fVxuXHRjb25zdCB7IGtleSB9ID0gY2hpbGROb2RlLnByb3BlcnRpZXM7XG5cblx0aWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGkgIT09IGluZGV4VG9DaGVjaykge1xuXHRcdFx0XHRjb25zdCBub2RlID0gY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0aWYgKHNhbWUobm9kZSwgY2hpbGROb2RlKSkge1xuXHRcdFx0XHRcdGxldCBub2RlSWRlbnRpZmllcjogc3RyaW5nO1xuXHRcdFx0XHRcdGNvbnN0IHBhcmVudE5hbWUgPSAocGFyZW50SW5zdGFuY2UgYXMgYW55KS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcblx0XHRcdFx0XHRpZiAoaXNXTm9kZShjaGlsZE5vZGUpKSB7XG5cdFx0XHRcdFx0XHRub2RlSWRlbnRpZmllciA9IChjaGlsZE5vZGUud2lkZ2V0Q29uc3RydWN0b3IgYXMgYW55KS5uYW1lIHx8ICd1bmtub3duJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUudGFnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRcdGBBIHdpZGdldCAoJHtwYXJlbnROYW1lfSkgaGFzIGhhZCBhIGNoaWxkIGFkZGRlZCBvciByZW1vdmVkLCBidXQgdGhleSB3ZXJlIG5vdCBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZpZWQuIEl0IGlzIHJlY29tbWVuZGVkIHRvIHByb3ZpZGUgYSB1bmlxdWUgJ2tleScgcHJvcGVydHkgd2hlbiB1c2luZyB0aGUgc2FtZSB3aWRnZXQgb3IgZWxlbWVudCAoJHtub2RlSWRlbnRpZmllcn0pIG11bHRpcGxlIHRpbWVzIGFzIHNpYmxpbmdzYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4oXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRvbGRDaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdLFxuXHRuZXdDaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9uc1xuKSB7XG5cdG9sZENoaWxkcmVuID0gb2xkQ2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcblx0bmV3Q2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcblx0Y29uc3Qgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRDaGlsZHJlbi5sZW5ndGg7XG5cdGNvbnN0IG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xuXHRjb25zdCB0cmFuc2l0aW9ucyA9IHByb2plY3Rpb25PcHRpb25zLnRyYW5zaXRpb25zITtcblx0cHJvamVjdGlvbk9wdGlvbnMgPSB7IC4uLnByb2plY3Rpb25PcHRpb25zLCBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH07XG5cdGxldCBvbGRJbmRleCA9IDA7XG5cdGxldCBuZXdJbmRleCA9IDA7XG5cdGxldCBpOiBudW1iZXI7XG5cdGxldCB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xuXHR3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xuXHRcdGNvbnN0IG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcblx0XHRpZiAoaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRuZXdDaGlsZC5pbnNlcnRlZCA9IGlzVk5vZGUob2xkQ2hpbGQpICYmIG9sZENoaWxkLmluc2VydGVkO1xuXHRcdFx0YWRkRGVmZXJyZWRQcm9wZXJ0aWVzKG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fVxuXHRcdGlmIChvbGRDaGlsZCAhPT0gdW5kZWZpbmVkICYmIHNhbWUob2xkQ2hpbGQsIG5ld0NoaWxkKSkge1xuXHRcdFx0dGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcblx0XHRcdG9sZEluZGV4Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xuXHRcdFx0aWYgKGZpbmRPbGRJbmRleCA+PSAwKSB7XG5cdFx0XHRcdGZvciAoaSA9IG9sZEluZGV4OyBpIDwgZmluZE9sZEluZGV4OyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4VG9DaGVjayA9IGk7XG5cdFx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGV4dFVwZGF0ZWQgPVxuXHRcdFx0XHRcdHVwZGF0ZURvbShvbGRDaGlsZHJlbltmaW5kT2xkSW5kZXhdLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHxcblx0XHRcdFx0XHR0ZXh0VXBkYXRlZDtcblx0XHRcdFx0b2xkSW5kZXggPSBmaW5kT2xkSW5kZXggKyAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGluc2VydEJlZm9yZTogRWxlbWVudCB8IFRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdGxldCBjaGlsZDogSW50ZXJuYWxETm9kZSA9IG9sZENoaWxkcmVuW29sZEluZGV4XTtcblx0XHRcdFx0aWYgKGNoaWxkKSB7XG5cdFx0XHRcdFx0bGV0IG5leHRJbmRleCA9IG9sZEluZGV4ICsgMTtcblx0XHRcdFx0XHR3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGlmIChpc1dOb2RlKGNoaWxkKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY2hpbGQucmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IGNoaWxkLnJlbmRlcmVkWzBdO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG9sZENoaWxkcmVuW25leHRJbmRleF0pIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZCA9IG9sZENoaWxkcmVuW25leHRJbmRleF07XG5cdFx0XHRcdFx0XHRcdFx0bmV4dEluZGV4Kys7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluc2VydEJlZm9yZSA9IGNoaWxkLmRvbU5vZGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3JlYXRlRG9tKG5ld0NoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcblx0XHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XG5cdFx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRcdGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG5ld0NoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5ld0luZGV4Kys7XG5cdH1cblx0aWYgKG9sZENoaWxkcmVuTGVuZ3RoID4gb2xkSW5kZXgpIHtcblx0XHQvLyBSZW1vdmUgY2hpbGQgZnJhZ21lbnRzXG5cdFx0Zm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xuXHRcdFx0Y29uc3QgaW5kZXhUb0NoZWNrID0gaTtcblx0XHRcdHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuXHRcdFx0XHRjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcblx0XHRcdFx0Y2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0fSk7XG5cdFx0XHRub2RlVG9SZW1vdmUob2xkQ2hpbGRyZW5baV0sIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0ZXh0VXBkYXRlZDtcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGRyZW4oXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRjaGlsZHJlbjogSW50ZXJuYWxETm9kZVtdIHwgdW5kZWZpbmVkLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0aW5zZXJ0QmVmb3JlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcblx0Y2hpbGROb2Rlcz86IChFbGVtZW50IHwgVGV4dClbXVxuKSB7XG5cdGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKHByb2plY3Rpb25PcHRpb25zLm1lcmdlICYmIGNoaWxkTm9kZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdGNoaWxkTm9kZXMgPSBhcnJheUZyb20ocGFyZW50Vk5vZGUuZG9tTm9kZSEuY2hpbGROb2RlcykgYXMgKEVsZW1lbnQgfCBUZXh0KVtdO1xuXHR9XG5cblx0cHJvamVjdGlvbk9wdGlvbnMgPSB7IC4uLnByb2plY3Rpb25PcHRpb25zLCBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH07XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cblx0XHRpZiAoaXNWTm9kZShjaGlsZCkpIHtcblx0XHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBjaGlsZE5vZGVzKSB7XG5cdFx0XHRcdGxldCBkb21FbGVtZW50OiBFbGVtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCkgYXMgRWxlbWVudDtcblx0XHRcdFx0XHRpZiAoZG9tRWxlbWVudCAmJiBkb21FbGVtZW50LnRhZ05hbWUgPT09IChjaGlsZC50YWcudG9VcHBlckNhc2UoKSB8fCB1bmRlZmluZWQpKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKFxuXHRkb21Ob2RlOiBFbGVtZW50LFxuXHRkbm9kZTogSW50ZXJuYWxWTm9kZSxcblx0cGFyZW50SW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnNcbikge1xuXHRhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcblx0aWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiBkbm9kZS5pbnNlcnRlZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0YWRkRGVmZXJyZWRQcm9wZXJ0aWVzKGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdH1cblx0c2V0UHJvcGVydGllcyhkb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKSE7XG5cdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlIGFzIEhUTUxFbGVtZW50LCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcblx0fVxuXHRkbm9kZS5pbnNlcnRlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURvbShcblx0ZG5vZGU6IEludGVybmFsRE5vZGUsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRpbnNlcnRCZWZvcmU6IEVsZW1lbnQgfCBUZXh0IHwgdW5kZWZpbmVkLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudEluc3RhbmNlOiBEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZSxcblx0Y2hpbGROb2Rlcz86IChFbGVtZW50IHwgVGV4dClbXVxuKSB7XG5cdGxldCBkb21Ob2RlOiBFbGVtZW50IHwgVGV4dCB8IHVuZGVmaW5lZDtcblx0aWYgKGlzV05vZGUoZG5vZGUpKSB7XG5cdFx0bGV0IHsgd2lkZ2V0Q29uc3RydWN0b3IgfSA9IGRub2RlO1xuXHRcdGNvbnN0IHBhcmVudEluc3RhbmNlRGF0YSA9IHdpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSkhO1xuXHRcdGlmICghaXNXaWRnZXRCYXNlQ29uc3RydWN0b3I8RGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2U+KHdpZGdldENvbnN0cnVjdG9yKSkge1xuXHRcdFx0Y29uc3QgaXRlbSA9IHBhcmVudEluc3RhbmNlRGF0YS5yZWdpc3RyeSgpLmdldDxEZWZhdWx0V2lkZ2V0QmFzZUludGVyZmFjZT4od2lkZ2V0Q29uc3RydWN0b3IpO1xuXHRcdFx0aWYgKGl0ZW0gPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0d2lkZ2V0Q29uc3RydWN0b3IgPSBpdGVtO1xuXHRcdH1cblx0XHRjb25zdCBpbnN0YW5jZSA9IG5ldyB3aWRnZXRDb25zdHJ1Y3RvcigpO1xuXHRcdGRub2RlLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0aW5zdGFuY2VEYXRhLmludmFsaWRhdGUgPSAoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEuZGlydHkgPSB0cnVlO1xuXHRcdFx0aWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlclF1ZXVlID0gcmVuZGVyUXVldWVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKSE7XG5cdFx0XHRcdHJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZSwgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoIH0pO1xuXHRcdFx0XHRzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcblx0XHRpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xuXHRcdGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XG5cdFx0aW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XG5cdFx0aW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xuXHRcdGlmIChyZW5kZXJlZCkge1xuXHRcdFx0Y29uc3QgZmlsdGVyZWRSZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcblx0XHRcdGRub2RlLnJlbmRlcmVkID0gZmlsdGVyZWRSZW5kZXJlZDtcblx0XHRcdGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBmaWx0ZXJlZFJlbmRlcmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcyk7XG5cdFx0fVxuXHRcdGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG5cdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcblx0XHRwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKCgpID0+IHtcblx0XHRcdGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSAmJiBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQ7XG5cdFx0XHRwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHRpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUhLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZG9jID0gcGFyZW50Vk5vZGUuZG9tTm9kZSEub3duZXJEb2N1bWVudDtcblx0XHRpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlICE9PSB1bmRlZmluZWQgJiYgZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdGNvbnN0IG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUhLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0ISk7XG5cdFx0XHRcdGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcblx0XHRcdFx0XHRwcm9qZWN0aW9uT3B0aW9ucyA9IHsgLi4ucHJvamVjdGlvbk9wdGlvbnMsIC4uLnsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0gfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChkbm9kZS50YWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcblx0XHRcdH1cblx0XHRcdGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSEgYXMgRWxlbWVudCwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHRpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyZW50Vk5vZGUuZG9tTm9kZSEuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG5cdFx0XHR9IGVsc2UgaWYgKGRvbU5vZGUhLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUhKSB7XG5cdFx0XHRcdHBhcmVudFZOb2RlLmRvbU5vZGUhLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVEb20oXG5cdHByZXZpb3VzOiBhbnksXG5cdGRub2RlOiBJbnRlcm5hbEROb2RlLFxuXHRwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMsXG5cdHBhcmVudFZOb2RlOiBJbnRlcm5hbFZOb2RlLFxuXHRwYXJlbnRJbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2Vcbikge1xuXHRpZiAoaXNXTm9kZShkbm9kZSkpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlIH0gPSBwcmV2aW91cztcblx0XHRpZiAoaW5zdGFuY2UpIHtcblx0XHRcdGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlOiBub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRcdGNvbnN0IHByZXZpb3VzUmVuZGVyZWQgPSBub2RlID8gbm9kZS5yZW5kZXJlZCA6IHByZXZpb3VzLnJlbmRlcmVkO1xuXHRcdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcblx0XHRcdGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XG5cdFx0XHRpbnN0YW5jZS5fX3NldENoaWxkcmVuX18oZG5vZGUuY2hpbGRyZW4pO1xuXHRcdFx0aW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XG5cdFx0XHRpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gZmFsc2U7XG5cdFx0XHRkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXHRcdFx0aW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlLCBwYXJlbnRWTm9kZSB9KTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEuZGlydHkgPT09IHRydWUpIHtcblx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSBpbnN0YW5jZS5fX3JlbmRlcl9fKCk7XG5cdFx0XHRcdGRub2RlLnJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xuXHRcdFx0XHR1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZSwgcHJldmlvdXNSZW5kZXJlZCwgZG5vZGUucmVuZGVyZWQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkbm9kZS5yZW5kZXJlZCA9IHByZXZpb3VzUmVuZGVyZWQ7XG5cdFx0XHR9XG5cdFx0XHRpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcmVhdGVEb20oZG5vZGUsIHBhcmVudFZOb2RlLCB1bmRlZmluZWQsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Y29uc3QgZG9tTm9kZSA9IChkbm9kZS5kb21Ob2RlID0gcHJldmlvdXMuZG9tTm9kZSk7XG5cdFx0bGV0IHRleHRVcGRhdGVkID0gZmFsc2U7XG5cdFx0bGV0IHVwZGF0ZWQgPSBmYWxzZTtcblx0XHRpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmIChkbm9kZS50ZXh0ICE9PSBwcmV2aW91cy50ZXh0KSB7XG5cdFx0XHRcdGNvbnN0IG5ld0RvbU5vZGUgPSBkb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCEpO1xuXHRcdFx0XHRkb21Ob2RlLnBhcmVudE5vZGUhLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkb21Ob2RlKTtcblx0XHRcdFx0ZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XG5cdFx0XHRcdHRleHRVcGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuIHRleHRVcGRhdGVkO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZG5vZGUudGFnICYmIGRub2RlLnRhZy5sYXN0SW5kZXhPZignc3ZnJywgMCkgPT09IDApIHtcblx0XHRcdFx0cHJvamVjdGlvbk9wdGlvbnMgPSB7IC4uLnByb2plY3Rpb25PcHRpb25zLCAuLi57IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9IH07XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdGNvbnN0IGNoaWxkcmVuID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkbm9kZS5jaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UpO1xuXHRcdFx0XHRkbm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXHRcdFx0XHR1cGRhdGVkID1cblx0XHRcdFx0XHR1cGRhdGVDaGlsZHJlbihkbm9kZSwgcHJldmlvdXMuY2hpbGRyZW4sIGNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZWQgPSB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xuXG5cdFx0XHRpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpITtcblx0XHRcdFx0aW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBgJHtkbm9kZS5wcm9wZXJ0aWVzLmtleX1gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHVwZGF0ZWQgJiYgZG5vZGUucHJvcGVydGllcyAmJiBkbm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbikge1xuXHRcdFx0ZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZSBhcyBFbGVtZW50LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlOiBJbnRlcm5hbFZOb2RlLCBwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0Ly8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xuXHR2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgPSB2bm9kZS5wcm9wZXJ0aWVzO1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2shKCEhdm5vZGUuaW5zZXJ0ZWQpO1xuXHR2bm9kZS5wcm9wZXJ0aWVzID0geyAuLi5wcm9wZXJ0aWVzLCAuLi52bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMgfTtcblx0cHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydGllcyA9IHtcblx0XHRcdC4uLnZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrISghIXZub2RlLmluc2VydGVkKSxcblx0XHRcdC4uLnZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllc1xuXHRcdH07XG5cdFx0dXBkYXRlUHJvcGVydGllcyh2bm9kZS5kb21Ob2RlISBhcyBFbGVtZW50LCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG5cdFx0dm5vZGUucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9uczogUHJvamVjdGlvbk9wdGlvbnMpIHtcblx0aWYgKHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjYWxsYmFjayA9IHByb2plY3Rpb25PcHRpb25zLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zOiBQcm9qZWN0aW9uT3B0aW9ucykge1xuXHRpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xuXHRcdHdoaWxlIChwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChnbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjaykge1xuXHRcdFx0Z2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAocHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBwcm9qZWN0aW9uT3B0aW9ucy5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2hpbGUgKHByb2plY3Rpb25PcHRpb25zLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcHJvamVjdGlvbk9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcblx0XHRcdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XG5cdFx0cmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcblx0fSBlbHNlIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5yZW5kZXJTY2hlZHVsZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFx0cmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW5kZXIocHJvamVjdGlvbk9wdGlvbnM6IFByb2plY3Rpb25PcHRpb25zKSB7XG5cdHByb2plY3Rpb25PcHRpb25zLnJlbmRlclNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblx0Y29uc3QgcmVuZGVyUXVldWUgPSByZW5kZXJRdWV1ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpITtcblx0Y29uc3QgcmVuZGVycyA9IFsuLi5yZW5kZXJRdWV1ZV07XG5cdHJlbmRlclF1ZXVlTWFwLnNldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgW10pO1xuXHRyZW5kZXJzLnNvcnQoKGEsIGIpID0+IGEuZGVwdGggLSBiLmRlcHRoKTtcblxuXHR3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcblx0XHRjb25zdCB7IGluc3RhbmNlIH0gPSByZW5kZXJzLnNoaWZ0KCkhO1xuXHRcdGNvbnN0IHsgcGFyZW50Vk5vZGUsIGRub2RlIH0gPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHRjb25zdCBpbnN0YW5jZURhdGEgPSB3aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpITtcblx0XHR1cGRhdGVEb20oZG5vZGUsIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XG5cdH1cblx0cnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpO1xuXHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XG59XG5cbmV4cG9ydCBjb25zdCBkb20gPSB7XG5cdGFwcGVuZDogZnVuY3Rpb24oXG5cdFx0cGFyZW50Tm9kZTogRWxlbWVudCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+ID0ge31cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0Y29uc3QgaW5zdGFuY2VEYXRhID0gd2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSE7XG5cdFx0Y29uc3QgZmluYWxQcm9qZWN0b3JPcHRpb25zID0gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlKTtcblxuXHRcdGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSA9IHBhcmVudE5vZGU7XG5cdFx0Y29uc3QgcGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSk7XG5cdFx0Y29uc3Qgbm9kZSA9IHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKTtcblx0XHRjb25zdCByZW5kZXJRdWV1ZTogUmVuZGVyUXVldWVbXSA9IFtdO1xuXHRcdGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZTogbm9kZSwgcGFyZW50Vk5vZGUgfSk7XG5cdFx0cmVuZGVyUXVldWVNYXAuc2V0KGZpbmFsUHJvamVjdG9yT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSwgcmVuZGVyUXVldWUpO1xuXHRcdGluc3RhbmNlRGF0YS5pbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdFx0aW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcblx0XHRcdGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xuXHRcdFx0XHRjb25zdCByZW5kZXJRdWV1ZSA9IHJlbmRlclF1ZXVlTWFwLmdldChmaW5hbFByb2plY3Rvck9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpITtcblx0XHRcdFx0cmVuZGVyUXVldWUucHVzaCh7IGluc3RhbmNlLCBkZXB0aDogZmluYWxQcm9qZWN0b3JPcHRpb25zLmRlcHRoIH0pO1xuXHRcdFx0XHRzY2hlZHVsZVJlbmRlcihmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dXBkYXRlRG9tKG5vZGUsIG5vZGUsIGZpbmFsUHJvamVjdG9yT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcblx0XHRmaW5hbFByb2plY3Rvck9wdGlvbnMuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaCgoKSA9PiB7XG5cdFx0XHRpbnN0YW5jZURhdGEub25BdHRhY2goKTtcblx0XHR9KTtcblx0XHRydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xuXHRcdHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRvbU5vZGU6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZVxuXHRcdH07XG5cdH0sXG5cdGNyZWF0ZTogZnVuY3Rpb24oaW5zdGFuY2U6IERlZmF1bHRXaWRnZXRCYXNlSW50ZXJmYWNlLCBwcm9qZWN0aW9uT3B0aW9ucz86IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+KTogUHJvamVjdGlvbiB7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9LFxuXHRtZXJnZTogZnVuY3Rpb24oXG5cdFx0ZWxlbWVudDogRWxlbWVudCxcblx0XHRpbnN0YW5jZTogRGVmYXVsdFdpZGdldEJhc2VJbnRlcmZhY2UsXG5cdFx0cHJvamVjdGlvbk9wdGlvbnM6IFBhcnRpYWw8UHJvamVjdGlvbk9wdGlvbnM+ID0ge31cblx0KTogUHJvamVjdGlvbiB7XG5cdFx0cHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgPSB0cnVlO1xuXHRcdHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSBhcyBFbGVtZW50LCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuXHR9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHZkb20udHMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB2ZW5kb3IiLCIvKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgd2lkZ2V0RmFjdG9yeSA9IHJlcXVpcmUoXCJzcmMvbWVudS1pdGVtL01lbnVJdGVtXCIpO1xuXG52YXIgcmVnaXN0ZXJDdXN0b21FbGVtZW50ID0gcmVxdWlyZSgnQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50JykuZGVmYXVsdDtcblxudmFyIGRlZmF1bHRFeHBvcnQgPSB3aWRnZXRGYWN0b3J5LmRlZmF1bHQ7XG52YXIgZGVzY3JpcHRvcjtcblxuaWYgKGRlZmF1bHRFeHBvcnQpIHtcblx0aWYgKGRlZmF1bHRFeHBvcnQucHJvdG90eXBlICYmIGRlZmF1bHRFeHBvcnQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IpIHtcblx0XHRkZXNjcmlwdG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBkZWZhdWx0RXhwb3J0LnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yIH07XG5cdH1cbn1cblxuZGVzY3JpcHRvciAmJiByZWdpc3RlckN1c3RvbUVsZW1lbnQoZGVzY3JpcHRvcik7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUtaXRlbS9NZW51SXRlbSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlci9pbmRleC5qcz93aWRnZXRGYWN0b3J5PXNyYy9tZW51LWl0ZW0vTWVudUl0ZW0hLi9ub2RlX21vZHVsZXMvQGRvam8vY2xpLWJ1aWxkLXdpZGdldC90ZW1wbGF0ZS9jdXN0b20tZWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHZlbmRvciIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciB3aWRnZXRGYWN0b3J5ID0gcmVxdWlyZShcInNyYy9tZW51L01lbnVcIik7XG5cbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnQgPSByZXF1aXJlKCdAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQnKS5kZWZhdWx0O1xuXG52YXIgZGVmYXVsdEV4cG9ydCA9IHdpZGdldEZhY3RvcnkuZGVmYXVsdDtcbnZhciBkZXNjcmlwdG9yO1xuXG5pZiAoZGVmYXVsdEV4cG9ydCkge1xuXHRpZiAoZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUgJiYgZGVmYXVsdEV4cG9ydC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcikge1xuXHRcdGRlc2NyaXB0b3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGRlZmF1bHRFeHBvcnQucHJvdG90eXBlLl9fY3VzdG9tRWxlbWVudERlc2NyaXB0b3IgfTtcblx0fVxufVxuXG5kZXNjcmlwdG9yICYmIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudChkZXNjcmlwdG9yKTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/d2lkZ2V0RmFjdG9yeT1zcmMvbWVudS9NZW51IS4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NsaS1idWlsZC13aWRnZXQvdGVtcGxhdGUvY3VzdG9tLWVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3dpZGdldEZhY3Rvcnk9c3JjL21lbnUvTWVudSEuL25vZGVfbW9kdWxlcy9AZG9qby9jbGktYnVpbGQtd2lkZ2V0L3RlbXBsYXRlL2N1c3RvbS1lbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdmVuZG9yIiwiLyohXG4gKiBQRVAgdjAuNC4zIHwgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9QRVBcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIHwgaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5Qb2ludGVyRXZlbnRzUG9seWZpbGwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgY29uc3RydWN0b3IgZm9yIG5ldyBQb2ludGVyRXZlbnRzLlxuICAgKlxuICAgKiBOZXcgUG9pbnRlciBFdmVudHMgbXVzdCBiZSBnaXZlbiBhIHR5cGUsIGFuZCBhbiBvcHRpb25hbCBkaWN0aW9uYXJ5IG9mXG4gICAqIGluaXRpYWxpemF0aW9uIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIER1ZSB0byBjZXJ0YWluIHBsYXRmb3JtIHJlcXVpcmVtZW50cywgZXZlbnRzIHJldHVybmVkIGZyb20gdGhlIGNvbnN0cnVjdG9yXG4gICAqIGlkZW50aWZ5IGFzIE1vdXNlRXZlbnRzLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IGluVHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgdG8gY3JlYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2luRGljdF0gQW4gb3B0aW9uYWwgZGljdGlvbmFyeSBvZiBpbml0aWFsIGV2ZW50IHByb3BlcnRpZXMuXG4gICAqIEByZXR1cm4ge0V2ZW50fSBBIG5ldyBQb2ludGVyRXZlbnQgb2YgdHlwZSBgaW5UeXBlYCwgaW5pdGlhbGl6ZWQgd2l0aCBwcm9wZXJ0aWVzIGZyb20gYGluRGljdGAuXG4gICAqL1xuICB2YXIgTU9VU0VfUFJPUFMgPSBbXG4gICAgJ2J1YmJsZXMnLFxuICAgICdjYW5jZWxhYmxlJyxcbiAgICAndmlldycsXG4gICAgJ2RldGFpbCcsXG4gICAgJ3NjcmVlblgnLFxuICAgICdzY3JlZW5ZJyxcbiAgICAnY2xpZW50WCcsXG4gICAgJ2NsaWVudFknLFxuICAgICdjdHJsS2V5JyxcbiAgICAnYWx0S2V5JyxcbiAgICAnc2hpZnRLZXknLFxuICAgICdtZXRhS2V5JyxcbiAgICAnYnV0dG9uJyxcbiAgICAncmVsYXRlZFRhcmdldCcsXG4gICAgJ3BhZ2VYJyxcbiAgICAncGFnZVknXG4gIF07XG5cbiAgdmFyIE1PVVNFX0RFRkFVTFRTID0gW1xuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIG51bGwsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIGZhbHNlLFxuICAgIDAsXG4gICAgbnVsbCxcbiAgICAwLFxuICAgIDBcbiAgXTtcblxuICBmdW5jdGlvbiBQb2ludGVyRXZlbnQoaW5UeXBlLCBpbkRpY3QpIHtcbiAgICBpbkRpY3QgPSBpbkRpY3QgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZS5pbml0RXZlbnQoaW5UeXBlLCBpbkRpY3QuYnViYmxlcyB8fCBmYWxzZSwgaW5EaWN0LmNhbmNlbGFibGUgfHwgZmFsc2UpO1xuXG4gICAgLy8gZGVmaW5lIGluaGVyaXRlZCBNb3VzZUV2ZW50IHByb3BlcnRpZXNcbiAgICAvLyBza2lwIGJ1YmJsZXMgYW5kIGNhbmNlbGFibGUgc2luY2UgdGhleSdyZSBzZXQgYWJvdmUgaW4gaW5pdEV2ZW50KClcbiAgICBmb3IgKHZhciBpID0gMiwgcDsgaSA8IE1PVVNFX1BST1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwID0gTU9VU0VfUFJPUFNbaV07XG4gICAgICBlW3BdID0gaW5EaWN0W3BdIHx8IE1PVVNFX0RFRkFVTFRTW2ldO1xuICAgIH1cbiAgICBlLmJ1dHRvbnMgPSBpbkRpY3QuYnV0dG9ucyB8fCAwO1xuXG4gICAgLy8gU3BlYyByZXF1aXJlcyB0aGF0IHBvaW50ZXJzIHdpdGhvdXQgcHJlc3N1cmUgc3BlY2lmaWVkIHVzZSAwLjUgZm9yIGRvd25cbiAgICAvLyBzdGF0ZSBhbmQgMCBmb3IgdXAgc3RhdGUuXG4gICAgdmFyIHByZXNzdXJlID0gMDtcblxuICAgIGlmIChpbkRpY3QucHJlc3N1cmUgJiYgZS5idXR0b25zKSB7XG4gICAgICBwcmVzc3VyZSA9IGluRGljdC5wcmVzc3VyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlc3N1cmUgPSBlLmJ1dHRvbnMgPyAwLjUgOiAwO1xuICAgIH1cblxuICAgIC8vIGFkZCB4L3kgcHJvcGVydGllcyBhbGlhc2VkIHRvIGNsaWVudFgvWVxuICAgIGUueCA9IGUuY2xpZW50WDtcbiAgICBlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAvLyBkZWZpbmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIFBvaW50ZXJFdmVudCBpbnRlcmZhY2VcbiAgICBlLnBvaW50ZXJJZCA9IGluRGljdC5wb2ludGVySWQgfHwgMDtcbiAgICBlLndpZHRoID0gaW5EaWN0LndpZHRoIHx8IDA7XG4gICAgZS5oZWlnaHQgPSBpbkRpY3QuaGVpZ2h0IHx8IDA7XG4gICAgZS5wcmVzc3VyZSA9IHByZXNzdXJlO1xuICAgIGUudGlsdFggPSBpbkRpY3QudGlsdFggfHwgMDtcbiAgICBlLnRpbHRZID0gaW5EaWN0LnRpbHRZIHx8IDA7XG4gICAgZS50d2lzdCA9IGluRGljdC50d2lzdCB8fCAwO1xuICAgIGUudGFuZ2VudGlhbFByZXNzdXJlID0gaW5EaWN0LnRhbmdlbnRpYWxQcmVzc3VyZSB8fCAwO1xuICAgIGUucG9pbnRlclR5cGUgPSBpbkRpY3QucG9pbnRlclR5cGUgfHwgJyc7XG4gICAgZS5od1RpbWVzdGFtcCA9IGluRGljdC5od1RpbWVzdGFtcCB8fCAwO1xuICAgIGUuaXNQcmltYXJ5ID0gaW5EaWN0LmlzUHJpbWFyeSB8fCBmYWxzZTtcbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBpbXBsZW1lbnRzIGEgbWFwIG9mIHBvaW50ZXIgc3RhdGVzXG4gICAqL1xuICB2YXIgVVNFX01BUCA9IHdpbmRvdy5NYXAgJiYgd2luZG93Lk1hcC5wcm90b3R5cGUuZm9yRWFjaDtcbiAgdmFyIFBvaW50ZXJNYXAgPSBVU0VfTUFQID8gTWFwIDogU3BhcnNlQXJyYXlNYXA7XG5cbiAgZnVuY3Rpb24gU3BhcnNlQXJyYXlNYXAoKSB7XG4gICAgdGhpcy5hcnJheSA9IFtdO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG4gIH1cblxuICBTcGFyc2VBcnJheU1hcC5wcm90b3R5cGUgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGV0ZShrKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICB9XG4gICAgICB0aGlzLmFycmF5W2tdID0gdjtcbiAgICB9LFxuICAgIGhhczogZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHRoaXMuYXJyYXlba10gIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykge1xuICAgICAgaWYgKHRoaXMuaGFzKGspKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFycmF5W2tdO1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHRoaXMuYXJyYXlba107XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICB0aGlzLnNpemUgPSAwO1xuICAgIH0sXG5cbiAgICAvLyByZXR1cm4gdmFsdWUsIGtleSwgbWFwXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmFycmF5LmZvckVhY2goZnVuY3Rpb24odiwgaykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIGssIHRoaXMpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBDTE9ORV9QUk9QUyA9IFtcblxuICAgIC8vIE1vdXNlRXZlbnRcbiAgICAnYnViYmxlcycsXG4gICAgJ2NhbmNlbGFibGUnLFxuICAgICd2aWV3JyxcbiAgICAnZGV0YWlsJyxcbiAgICAnc2NyZWVuWCcsXG4gICAgJ3NjcmVlblknLFxuICAgICdjbGllbnRYJyxcbiAgICAnY2xpZW50WScsXG4gICAgJ2N0cmxLZXknLFxuICAgICdhbHRLZXknLFxuICAgICdzaGlmdEtleScsXG4gICAgJ21ldGFLZXknLFxuICAgICdidXR0b24nLFxuICAgICdyZWxhdGVkVGFyZ2V0JyxcblxuICAgIC8vIERPTSBMZXZlbCAzXG4gICAgJ2J1dHRvbnMnLFxuXG4gICAgLy8gUG9pbnRlckV2ZW50XG4gICAgJ3BvaW50ZXJJZCcsXG4gICAgJ3dpZHRoJyxcbiAgICAnaGVpZ2h0JyxcbiAgICAncHJlc3N1cmUnLFxuICAgICd0aWx0WCcsXG4gICAgJ3RpbHRZJyxcbiAgICAncG9pbnRlclR5cGUnLFxuICAgICdod1RpbWVzdGFtcCcsXG4gICAgJ2lzUHJpbWFyeScsXG5cbiAgICAvLyBldmVudCBpbnN0YW5jZVxuICAgICd0eXBlJyxcbiAgICAndGFyZ2V0JyxcbiAgICAnY3VycmVudFRhcmdldCcsXG4gICAgJ3doaWNoJyxcbiAgICAncGFnZVgnLFxuICAgICdwYWdlWScsXG4gICAgJ3RpbWVTdGFtcCdcbiAgXTtcblxuICB2YXIgQ0xPTkVfREVGQVVMVFMgPSBbXG5cbiAgICAvLyBNb3VzZUV2ZW50XG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgbnVsbCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgZmFsc2UsXG4gICAgMCxcbiAgICBudWxsLFxuXG4gICAgLy8gRE9NIExldmVsIDNcbiAgICAwLFxuXG4gICAgLy8gUG9pbnRlckV2ZW50XG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgJycsXG4gICAgMCxcbiAgICBmYWxzZSxcblxuICAgIC8vIGV2ZW50IGluc3RhbmNlXG4gICAgJycsXG4gICAgbnVsbCxcbiAgICBudWxsLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDBcbiAgXTtcblxuICB2YXIgQk9VTkRBUllfRVZFTlRTID0ge1xuICAgICdwb2ludGVyb3Zlcic6IDEsXG4gICAgJ3BvaW50ZXJvdXQnOiAxLFxuICAgICdwb2ludGVyZW50ZXInOiAxLFxuICAgICdwb2ludGVybGVhdmUnOiAxXG4gIH07XG5cbiAgdmFyIEhBU19TVkdfSU5TVEFOQ0UgPSAodHlwZW9mIFNWR0VsZW1lbnRJbnN0YW5jZSAhPT0gJ3VuZGVmaW5lZCcpO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBpcyBmb3Igbm9ybWFsaXppbmcgZXZlbnRzLiBNb3VzZSBhbmQgVG91Y2ggZXZlbnRzIHdpbGwgYmVcbiAgICogY29sbGVjdGVkIGhlcmUsIGFuZCBmaXJlIFBvaW50ZXJFdmVudHMgdGhhdCBoYXZlIHRoZSBzYW1lIHNlbWFudGljcywgbm9cbiAgICogbWF0dGVyIHRoZSBzb3VyY2UuXG4gICAqIEV2ZW50cyBmaXJlZDpcbiAgICogICAtIHBvaW50ZXJkb3duOiBhIHBvaW50aW5nIGlzIGFkZGVkXG4gICAqICAgLSBwb2ludGVydXA6IGEgcG9pbnRlciBpcyByZW1vdmVkXG4gICAqICAgLSBwb2ludGVybW92ZTogYSBwb2ludGVyIGlzIG1vdmVkXG4gICAqICAgLSBwb2ludGVyb3ZlcjogYSBwb2ludGVyIGNyb3NzZXMgaW50byBhbiBlbGVtZW50XG4gICAqICAgLSBwb2ludGVyb3V0OiBhIHBvaW50ZXIgbGVhdmVzIGFuIGVsZW1lbnRcbiAgICogICAtIHBvaW50ZXJjYW5jZWw6IGEgcG9pbnRlciB3aWxsIG5vIGxvbmdlciBnZW5lcmF0ZSBldmVudHNcbiAgICovXG4gIHZhciBkaXNwYXRjaGVyID0ge1xuICAgIHBvaW50ZXJtYXA6IG5ldyBQb2ludGVyTWFwKCksXG4gICAgZXZlbnRNYXA6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgY2FwdHVyZUluZm86IE9iamVjdC5jcmVhdGUobnVsbCksXG5cbiAgICAvLyBTY29wZSBvYmplY3RzIGZvciBuYXRpdmUgZXZlbnRzLlxuICAgIC8vIFRoaXMgZXhpc3RzIGZvciBlYXNlIG9mIHRlc3RpbmcuXG4gICAgZXZlbnRTb3VyY2VzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIGV2ZW50U291cmNlTGlzdDogW10sXG4gICAgLyoqXG4gICAgICogQWRkIGEgbmV3IGV2ZW50IHNvdXJjZSB0aGF0IHdpbGwgZ2VuZXJhdGUgcG9pbnRlciBldmVudHMuXG4gICAgICpcbiAgICAgKiBgaW5Tb3VyY2VgIG11c3QgY29udGFpbiBhbiBhcnJheSBvZiBldmVudCBuYW1lcyBuYW1lZCBgZXZlbnRzYCwgYW5kXG4gICAgICogZnVuY3Rpb25zIHdpdGggdGhlIG5hbWVzIHNwZWNpZmllZCBpbiB0aGUgYGV2ZW50c2AgYXJyYXkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSBuYW1lIGZvciB0aGUgZXZlbnQgc291cmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBBIG5ldyBzb3VyY2Ugb2YgcGxhdGZvcm0gZXZlbnRzLlxuICAgICAqL1xuICAgIHJlZ2lzdGVyU291cmNlOiBmdW5jdGlvbihuYW1lLCBzb3VyY2UpIHtcbiAgICAgIHZhciBzID0gc291cmNlO1xuICAgICAgdmFyIG5ld0V2ZW50cyA9IHMuZXZlbnRzO1xuICAgICAgaWYgKG5ld0V2ZW50cykge1xuICAgICAgICBuZXdFdmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKHNbZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRNYXBbZV0gPSBzW2VdLmJpbmQocyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ldmVudFNvdXJjZXNbbmFtZV0gPSBzO1xuICAgICAgICB0aGlzLmV2ZW50U291cmNlTGlzdC5wdXNoKHMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBsID0gdGhpcy5ldmVudFNvdXJjZUxpc3QubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGVzOyAoaSA8IGwpICYmIChlcyA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0W2ldKTsgaSsrKSB7XG5cbiAgICAgICAgLy8gY2FsbCBldmVudHNvdXJjZSByZWdpc3RlclxuICAgICAgICBlcy5yZWdpc3Rlci5jYWxsKGVzLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIHZhciBsID0gdGhpcy5ldmVudFNvdXJjZUxpc3QubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGVzOyAoaSA8IGwpICYmIChlcyA9IHRoaXMuZXZlbnRTb3VyY2VMaXN0W2ldKTsgaSsrKSB7XG5cbiAgICAgICAgLy8gY2FsbCBldmVudHNvdXJjZSByZWdpc3RlclxuICAgICAgICBlcy51bnJlZ2lzdGVyLmNhbGwoZXMsIGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29udGFpbnM6IC8qc2NvcGUuZXh0ZXJuYWwuY29udGFpbnMgfHwgKi9mdW5jdGlvbihjb250YWluZXIsIGNvbnRhaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5jb250YWlucyhjb250YWluZWQpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcblxuICAgICAgICAvLyBtb3N0IGxpa2VseTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjA4NDI3XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRVZFTlRTXG4gICAgZG93bjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVyZG93bicsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KCdwb2ludGVybW92ZScsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgdXA6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcnVwJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBlbnRlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gZmFsc2U7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmVudGVyJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBsZWF2ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaW5FdmVudC5idWJibGVzID0gZmFsc2U7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcmxlYXZlJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBvdmVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJvdmVyJywgaW5FdmVudCk7XG4gICAgfSxcbiAgICBvdXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGluRXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICB0aGlzLmZpcmVFdmVudCgncG9pbnRlcm91dCcsIGluRXZlbnQpO1xuICAgIH0sXG4gICAgY2FuY2VsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpbkV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgdGhpcy5maXJlRXZlbnQoJ3BvaW50ZXJjYW5jZWwnLCBpbkV2ZW50KTtcbiAgICB9LFxuICAgIGxlYXZlT3V0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5vdXQoZXZlbnQpO1xuICAgICAgdGhpcy5wcm9wYWdhdGUoZXZlbnQsIHRoaXMubGVhdmUsIGZhbHNlKTtcbiAgICB9LFxuICAgIGVudGVyT3ZlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHRoaXMub3ZlcihldmVudCk7XG4gICAgICB0aGlzLnByb3BhZ2F0ZShldmVudCwgdGhpcy5lbnRlciwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8vIExJU1RFTkVSIExPR0lDXG4gICAgZXZlbnRIYW5kbGVyOiBmdW5jdGlvbihpbkV2ZW50KSB7XG5cbiAgICAgIC8vIFRoaXMgaXMgdXNlZCB0byBwcmV2ZW50IG11bHRpcGxlIGRpc3BhdGNoIG9mIHBvaW50ZXJldmVudHMgZnJvbVxuICAgICAgLy8gcGxhdGZvcm0gZXZlbnRzLiBUaGlzIGNhbiBoYXBwZW4gd2hlbiB0d28gZWxlbWVudHMgaW4gZGlmZmVyZW50IHNjb3Blc1xuICAgICAgLy8gYXJlIHNldCB1cCB0byBjcmVhdGUgcG9pbnRlciBldmVudHMsIHdoaWNoIGlzIHJlbGV2YW50IHRvIFNoYWRvdyBET00uXG4gICAgICBpZiAoaW5FdmVudC5faGFuZGxlZEJ5UEUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHR5cGUgPSBpbkV2ZW50LnR5cGU7XG4gICAgICB2YXIgZm4gPSB0aGlzLmV2ZW50TWFwICYmIHRoaXMuZXZlbnRNYXBbdHlwZV07XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgZm4oaW5FdmVudCk7XG4gICAgICB9XG4gICAgICBpbkV2ZW50Ll9oYW5kbGVkQnlQRSA9IHRydWU7XG4gICAgfSxcblxuICAgIC8vIHNldCB1cCBldmVudCBsaXN0ZW5lcnNcbiAgICBsaXN0ZW46IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnRzKSB7XG4gICAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQodGFyZ2V0LCBlKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXG4gICAgdW5saXN0ZW46IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnRzKSB7XG4gICAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnQodGFyZ2V0LCBlKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgYWRkRXZlbnQ6IC8qc2NvcGUuZXh0ZXJuYWwuYWRkRXZlbnQgfHwgKi9mdW5jdGlvbih0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmJvdW5kSGFuZGxlcik7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudDogLypzY29wZS5leHRlcm5hbC5yZW1vdmVFdmVudCB8fCAqL2Z1bmN0aW9uKHRhcmdldCwgZXZlbnROYW1lKSB7XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuYm91bmRIYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgLy8gRVZFTlQgQ1JFQVRJT04gQU5EIFRSQUNLSU5HXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBFdmVudCBvZiB0eXBlIGBpblR5cGVgLCBiYXNlZCBvbiB0aGUgaW5mb3JtYXRpb24gaW5cbiAgICAgKiBgaW5FdmVudGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5UeXBlIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdHlwZSBvZiBldmVudCB0byBjcmVhdGVcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBpbkV2ZW50IEEgcGxhdGZvcm0gZXZlbnQgd2l0aCBhIHRhcmdldFxuICAgICAqIEByZXR1cm4ge0V2ZW50fSBBIFBvaW50ZXJFdmVudCBvZiB0eXBlIGBpblR5cGVgXG4gICAgICovXG4gICAgbWFrZUV2ZW50OiBmdW5jdGlvbihpblR5cGUsIGluRXZlbnQpIHtcblxuICAgICAgLy8gcmVsYXRlZFRhcmdldCBtdXN0IGJlIG51bGwgaWYgcG9pbnRlciBpcyBjYXB0dXJlZFxuICAgICAgaWYgKHRoaXMuY2FwdHVyZUluZm9baW5FdmVudC5wb2ludGVySWRdKSB7XG4gICAgICAgIGluRXZlbnQucmVsYXRlZFRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgICB2YXIgZSA9IG5ldyBQb2ludGVyRXZlbnQoaW5UeXBlLCBpbkV2ZW50KTtcbiAgICAgIGlmIChpbkV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPSBpbkV2ZW50LnByZXZlbnREZWZhdWx0O1xuICAgICAgfVxuICAgICAgZS5fdGFyZ2V0ID0gZS5fdGFyZ2V0IHx8IGluRXZlbnQudGFyZ2V0O1xuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcblxuICAgIC8vIG1ha2UgYW5kIGRpc3BhdGNoIGFuIGV2ZW50IGluIG9uZSBjYWxsXG4gICAgZmlyZUV2ZW50OiBmdW5jdGlvbihpblR5cGUsIGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5tYWtlRXZlbnQoaW5UeXBlLCBpbkV2ZW50KTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc25hcHNob3Qgb2YgaW5FdmVudCwgd2l0aCB3cml0YWJsZSBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gaW5FdmVudCBBbiBldmVudCB0aGF0IGNvbnRhaW5zIHByb3BlcnRpZXMgdG8gY29weS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHNoYWxsb3cgY29waWVzIG9mIGBpbkV2ZW50YCdzXG4gICAgICogICAgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBjbG9uZUV2ZW50OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZXZlbnRDb3B5ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIHZhciBwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDTE9ORV9QUk9QUy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwID0gQ0xPTkVfUFJPUFNbaV07XG4gICAgICAgIGV2ZW50Q29weVtwXSA9IGluRXZlbnRbcF0gfHwgQ0xPTkVfREVGQVVMVFNbaV07XG5cbiAgICAgICAgLy8gV29yayBhcm91bmQgU1ZHSW5zdGFuY2VFbGVtZW50IHNoYWRvdyB0cmVlXG4gICAgICAgIC8vIFJldHVybiB0aGUgPHVzZT4gZWxlbWVudCB0aGF0IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBpbnN0YW5jZSBmb3IgU2FmYXJpLCBDaHJvbWUsIElFLlxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBiZWhhdmlvciBpbXBsZW1lbnRlZCBieSBGaXJlZm94LlxuICAgICAgICBpZiAoSEFTX1NWR19JTlNUQU5DRSAmJiAocCA9PT0gJ3RhcmdldCcgfHwgcCA9PT0gJ3JlbGF0ZWRUYXJnZXQnKSkge1xuICAgICAgICAgIGlmIChldmVudENvcHlbcF0gaW5zdGFuY2VvZiBTVkdFbGVtZW50SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGV2ZW50Q29weVtwXSA9IGV2ZW50Q29weVtwXS5jb3JyZXNwb25kaW5nVXNlRWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8ga2VlcCB0aGUgc2VtYW50aWNzIG9mIHByZXZlbnREZWZhdWx0XG4gICAgICBpZiAoaW5FdmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudENvcHkucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZXZlbnRDb3B5O1xuICAgIH0sXG4gICAgZ2V0VGFyZ2V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgY2FwdHVyZSA9IHRoaXMuY2FwdHVyZUluZm9baW5FdmVudC5wb2ludGVySWRdO1xuICAgICAgaWYgKCFjYXB0dXJlKSB7XG4gICAgICAgIHJldHVybiBpbkV2ZW50Ll90YXJnZXQ7XG4gICAgICB9XG4gICAgICBpZiAoaW5FdmVudC5fdGFyZ2V0ID09PSBjYXB0dXJlIHx8ICEoaW5FdmVudC50eXBlIGluIEJPVU5EQVJZX0VWRU5UUykpIHtcbiAgICAgICAgcmV0dXJuIGNhcHR1cmU7XG4gICAgICB9XG4gICAgfSxcbiAgICBwcm9wYWdhdGU6IGZ1bmN0aW9uKGV2ZW50LCBmbiwgcHJvcGFnYXRlRG93bikge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIHZhciB0YXJnZXRzID0gW107XG5cbiAgICAgIC8vIE9yZGVyIG9mIGNvbmRpdGlvbnMgZHVlIHRvIGRvY3VtZW50LmNvbnRhaW5zKCkgbWlzc2luZyBpbiBJRS5cbiAgICAgIHdoaWxlICh0YXJnZXQgIT09IGRvY3VtZW50ICYmICF0YXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXG4gICAgICAgIC8vIFRvdWNoOiBEbyBub3QgcHJvcGFnYXRlIGlmIG5vZGUgaXMgZGV0YWNoZWQuXG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcGFnYXRlRG93bikge1xuICAgICAgICB0YXJnZXRzLnJldmVyc2UoKTtcbiAgICAgIH1cbiAgICAgIHRhcmdldHMuZm9yRWFjaChmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgc2V0Q2FwdHVyZTogZnVuY3Rpb24oaW5Qb2ludGVySWQsIGluVGFyZ2V0LCBza2lwRGlzcGF0Y2gpIHtcbiAgICAgIGlmICh0aGlzLmNhcHR1cmVJbmZvW2luUG9pbnRlcklkXSkge1xuICAgICAgICB0aGlzLnJlbGVhc2VDYXB0dXJlKGluUG9pbnRlcklkLCBza2lwRGlzcGF0Y2gpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhcHR1cmVJbmZvW2luUG9pbnRlcklkXSA9IGluVGFyZ2V0O1xuICAgICAgdGhpcy5pbXBsaWNpdFJlbGVhc2UgPSB0aGlzLnJlbGVhc2VDYXB0dXJlLmJpbmQodGhpcywgaW5Qb2ludGVySWQsIHNraXBEaXNwYXRjaCk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgdGhpcy5pbXBsaWNpdFJlbGVhc2UpO1xuXG4gICAgICB2YXIgZSA9IG5ldyBQb2ludGVyRXZlbnQoJ2dvdHBvaW50ZXJjYXB0dXJlJyk7XG4gICAgICBlLnBvaW50ZXJJZCA9IGluUG9pbnRlcklkO1xuICAgICAgZS5fdGFyZ2V0ID0gaW5UYXJnZXQ7XG5cbiAgICAgIGlmICghc2tpcERpc3BhdGNoKSB7XG4gICAgICAgIHRoaXMuYXN5bmNEaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVsZWFzZUNhcHR1cmU6IGZ1bmN0aW9uKGluUG9pbnRlcklkLCBza2lwRGlzcGF0Y2gpIHtcbiAgICAgIHZhciB0ID0gdGhpcy5jYXB0dXJlSW5mb1tpblBvaW50ZXJJZF07XG4gICAgICBpZiAoIXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhcHR1cmVJbmZvW2luUG9pbnRlcklkXSA9IHVuZGVmaW5lZDtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuaW1wbGljaXRSZWxlYXNlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLmltcGxpY2l0UmVsZWFzZSk7XG5cbiAgICAgIHZhciBlID0gbmV3IFBvaW50ZXJFdmVudCgnbG9zdHBvaW50ZXJjYXB0dXJlJyk7XG4gICAgICBlLnBvaW50ZXJJZCA9IGluUG9pbnRlcklkO1xuICAgICAgZS5fdGFyZ2V0ID0gdDtcblxuICAgICAgaWYgKCFza2lwRGlzcGF0Y2gpIHtcbiAgICAgICAgdGhpcy5hc3luY0Rpc3BhdGNoRXZlbnQoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBldmVudCB0byBpdHMgdGFyZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gaW5FdmVudCBUaGUgZXZlbnQgdG8gYmUgZGlzcGF0Y2hlZC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGFuIGV2ZW50IGhhbmRsZXIgcmV0dXJucyB0cnVlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgZGlzcGF0Y2hFdmVudDogLypzY29wZS5leHRlcm5hbC5kaXNwYXRjaEV2ZW50IHx8ICovZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIHQgPSB0aGlzLmdldFRhcmdldChpbkV2ZW50KTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHJldHVybiB0LmRpc3BhdGNoRXZlbnQoaW5FdmVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luY0Rpc3BhdGNoRXZlbnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRpc3BhdGNoRXZlbnQuYmluZCh0aGlzLCBpbkV2ZW50KSk7XG4gICAgfVxuICB9O1xuICBkaXNwYXRjaGVyLmJvdW5kSGFuZGxlciA9IGRpc3BhdGNoZXIuZXZlbnRIYW5kbGVyLmJpbmQoZGlzcGF0Y2hlcik7XG5cbiAgdmFyIHRhcmdldGluZyA9IHtcbiAgICBzaGFkb3c6IGZ1bmN0aW9uKGluRWwpIHtcbiAgICAgIGlmIChpbkVsKSB7XG4gICAgICAgIHJldHVybiBpbkVsLnNoYWRvd1Jvb3QgfHwgaW5FbC53ZWJraXRTaGFkb3dSb290O1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuVGFyZ2V0OiBmdW5jdGlvbihzaGFkb3cpIHtcbiAgICAgIHJldHVybiBzaGFkb3cgJiYgQm9vbGVhbihzaGFkb3cuZWxlbWVudEZyb21Qb2ludCk7XG4gICAgfSxcbiAgICB0YXJnZXRpbmdTaGFkb3c6IGZ1bmN0aW9uKGluRWwpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zaGFkb3coaW5FbCk7XG4gICAgICBpZiAodGhpcy5jYW5UYXJnZXQocykpIHtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbGRlclNoYWRvdzogZnVuY3Rpb24oc2hhZG93KSB7XG4gICAgICB2YXIgb3MgPSBzaGFkb3cub2xkZXJTaGFkb3dSb290O1xuICAgICAgaWYgKCFvcykge1xuICAgICAgICB2YXIgc2UgPSBzaGFkb3cucXVlcnlTZWxlY3Rvcignc2hhZG93Jyk7XG4gICAgICAgIGlmIChzZSkge1xuICAgICAgICAgIG9zID0gc2Uub2xkZXJTaGFkb3dSb290O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3M7XG4gICAgfSxcbiAgICBhbGxTaGFkb3dzOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgc2hhZG93cyA9IFtdO1xuICAgICAgdmFyIHMgPSB0aGlzLnNoYWRvdyhlbGVtZW50KTtcbiAgICAgIHdoaWxlIChzKSB7XG4gICAgICAgIHNoYWRvd3MucHVzaChzKTtcbiAgICAgICAgcyA9IHRoaXMub2xkZXJTaGFkb3cocyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hhZG93cztcbiAgICB9LFxuICAgIHNlYXJjaFJvb3Q6IGZ1bmN0aW9uKGluUm9vdCwgeCwgeSkge1xuICAgICAgaWYgKGluUm9vdCkge1xuICAgICAgICB2YXIgdCA9IGluUm9vdC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgICAgICB2YXIgc3QsIHNyO1xuXG4gICAgICAgIC8vIGlzIGVsZW1lbnQgYSBzaGFkb3cgaG9zdD9cbiAgICAgICAgc3IgPSB0aGlzLnRhcmdldGluZ1NoYWRvdyh0KTtcbiAgICAgICAgd2hpbGUgKHNyKSB7XG5cbiAgICAgICAgICAvLyBmaW5kIHRoZSB0aGUgZWxlbWVudCBpbnNpZGUgdGhlIHNoYWRvdyByb290XG4gICAgICAgICAgc3QgPSBzci5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgICAgICAgIGlmICghc3QpIHtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIG9sZGVyIHNoYWRvd3NcbiAgICAgICAgICAgIHNyID0gdGhpcy5vbGRlclNoYWRvdyhzcik7XG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gc2hhZG93ZWQgZWxlbWVudCBtYXkgY29udGFpbiBhIHNoYWRvdyByb290XG4gICAgICAgICAgICB2YXIgc3NyID0gdGhpcy50YXJnZXRpbmdTaGFkb3coc3QpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUm9vdChzc3IsIHgsIHkpIHx8IHN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxpZ2h0IGRvbSBlbGVtZW50IGlzIHRoZSB0YXJnZXRcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBvd25lcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIHMgPSBlbGVtZW50O1xuXG4gICAgICAvLyB3YWxrIHVwIHVudGlsIHlvdSBoaXQgdGhlIHNoYWRvdyByb290IG9yIGRvY3VtZW50XG4gICAgICB3aGlsZSAocy5wYXJlbnROb2RlKSB7XG4gICAgICAgIHMgPSBzLnBhcmVudE5vZGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRoZSBvd25lciBlbGVtZW50IGlzIGV4cGVjdGVkIHRvIGJlIGEgRG9jdW1lbnQgb3IgU2hhZG93Um9vdFxuICAgICAgaWYgKHMubm9kZVR5cGUgIT09IE5vZGUuRE9DVU1FTlRfTk9ERSAmJiBzLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgICAgcyA9IGRvY3VtZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfSxcbiAgICBmaW5kVGFyZ2V0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgeCA9IGluRXZlbnQuY2xpZW50WDtcbiAgICAgIHZhciB5ID0gaW5FdmVudC5jbGllbnRZO1xuXG4gICAgICAvLyBpZiB0aGUgbGlzdGVuZXIgaXMgaW4gdGhlIHNoYWRvdyByb290LCBpdCBpcyBtdWNoIGZhc3RlciB0byBzdGFydCB0aGVyZVxuICAgICAgdmFyIHMgPSB0aGlzLm93bmVyKGluRXZlbnQudGFyZ2V0KTtcblxuICAgICAgLy8gaWYgeCwgeSBpcyBub3QgaW4gdGhpcyByb290LCBmYWxsIGJhY2sgdG8gZG9jdW1lbnQgc2VhcmNoXG4gICAgICBpZiAoIXMuZWxlbWVudEZyb21Qb2ludCh4LCB5KSkge1xuICAgICAgICBzID0gZG9jdW1lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hSb290KHMsIHgsIHkpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuZm9yRWFjaCk7XG4gIHZhciBtYXAgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUubWFwKTtcbiAgdmFyIHRvQXJyYXkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5zbGljZSk7XG4gIHZhciBmaWx0ZXIgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwuYmluZChBcnJheS5wcm90b3R5cGUuZmlsdGVyKTtcbiAgdmFyIE1PID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIHZhciBTRUxFQ1RPUiA9ICdbdG91Y2gtYWN0aW9uXSc7XG4gIHZhciBPQlNFUlZFUl9JTklUID0ge1xuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgYXR0cmlidXRlRmlsdGVyOiBbJ3RvdWNoLWFjdGlvbiddXG4gIH07XG5cbiAgZnVuY3Rpb24gSW5zdGFsbGVyKGFkZCwgcmVtb3ZlLCBjaGFuZ2VkLCBiaW5kZXIpIHtcbiAgICB0aGlzLmFkZENhbGxiYWNrID0gYWRkLmJpbmQoYmluZGVyKTtcbiAgICB0aGlzLnJlbW92ZUNhbGxiYWNrID0gcmVtb3ZlLmJpbmQoYmluZGVyKTtcbiAgICB0aGlzLmNoYW5nZWRDYWxsYmFjayA9IGNoYW5nZWQuYmluZChiaW5kZXIpO1xuICAgIGlmIChNTykge1xuICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNTyh0aGlzLm11dGF0aW9uV2F0Y2hlci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBJbnN0YWxsZXIucHJvdG90eXBlID0ge1xuICAgIHdhdGNoU3VidHJlZTogZnVuY3Rpb24odGFyZ2V0KSB7XG5cbiAgICAgIC8vIE9ubHkgd2F0Y2ggc2NvcGVzIHRoYXQgY2FuIHRhcmdldCBmaW5kLCBhcyB0aGVzZSBhcmUgdG9wLWxldmVsLlxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbiBzZWUgZHVwbGljYXRlIGFkZGl0aW9ucyBhbmQgcmVtb3ZhbHMgdGhhdCBhZGQgbm9pc2UuXG4gICAgICAvL1xuICAgICAgLy8gVE9ETyhkZnJlZWRtYW4pOiBGb3Igc29tZSBpbnN0YW5jZXMgd2l0aCBTaGFkb3dET01Qb2x5ZmlsbCwgd2UgY2FuIHNlZVxuICAgICAgLy8gYSByZW1vdmFsIHdpdGhvdXQgYW4gaW5zZXJ0aW9uIHdoZW4gYSBub2RlIGlzIHJlZGlzdHJpYnV0ZWQgYW1vbmdcbiAgICAgIC8vIHNoYWRvd3MuIFNpbmNlIGl0IGFsbCBlbmRzIHVwIGNvcnJlY3QgaW4gdGhlIGRvY3VtZW50LCB3YXRjaGluZyBvbmx5XG4gICAgICAvLyB0aGUgZG9jdW1lbnQgd2lsbCB5aWVsZCB0aGUgY29ycmVjdCBtdXRhdGlvbnMgdG8gd2F0Y2guXG4gICAgICBpZiAodGhpcy5vYnNlcnZlciAmJiB0YXJnZXRpbmcuY2FuVGFyZ2V0KHRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgT0JTRVJWRVJfSU5JVCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmFibGVPblN1YnRyZWU6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgdGhpcy53YXRjaFN1YnRyZWUodGFyZ2V0KTtcbiAgICAgIGlmICh0YXJnZXQgPT09IGRvY3VtZW50ICYmIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgdGhpcy5pbnN0YWxsT25Mb2FkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluc3RhbGxOZXdTdWJ0cmVlKHRhcmdldCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnN0YWxsTmV3U3VidHJlZTogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBmb3JFYWNoKHRoaXMuZmluZEVsZW1lbnRzKHRhcmdldCksIHRoaXMuYWRkRWxlbWVudCwgdGhpcyk7XG4gICAgfSxcbiAgICBmaW5kRWxlbWVudHM6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgaWYgKHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUik7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcbiAgICByZW1vdmVFbGVtZW50OiBmdW5jdGlvbihlbCkge1xuICAgICAgdGhpcy5yZW1vdmVDYWxsYmFjayhlbCk7XG4gICAgfSxcbiAgICBhZGRFbGVtZW50OiBmdW5jdGlvbihlbCkge1xuICAgICAgdGhpcy5hZGRDYWxsYmFjayhlbCk7XG4gICAgfSxcbiAgICBlbGVtZW50Q2hhbmdlZDogZnVuY3Rpb24oZWwsIG9sZFZhbHVlKSB7XG4gICAgICB0aGlzLmNoYW5nZWRDYWxsYmFjayhlbCwgb2xkVmFsdWUpO1xuICAgIH0sXG4gICAgY29uY2F0TGlzdHM6IGZ1bmN0aW9uKGFjY3VtLCBsaXN0KSB7XG4gICAgICByZXR1cm4gYWNjdW0uY29uY2F0KHRvQXJyYXkobGlzdCkpO1xuICAgIH0sXG5cbiAgICAvLyByZWdpc3RlciBhbGwgdG91Y2gtYWN0aW9uID0gbm9uZSBub2RlcyBvbiBkb2N1bWVudCBsb2FkXG4gICAgaW5zdGFsbE9uTG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgdGhpcy5pbnN0YWxsTmV3U3VidHJlZShkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcbiAgICBpc0VsZW1lbnQ6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERTtcbiAgICB9LFxuICAgIGZsYXR0ZW5NdXRhdGlvblRyZWU6IGZ1bmN0aW9uKGluTm9kZXMpIHtcblxuICAgICAgLy8gZmluZCBjaGlsZHJlbiB3aXRoIHRvdWNoLWFjdGlvblxuICAgICAgdmFyIHRyZWUgPSBtYXAoaW5Ob2RlcywgdGhpcy5maW5kRWxlbWVudHMsIHRoaXMpO1xuXG4gICAgICAvLyBtYWtlIHN1cmUgdGhlIGFkZGVkIG5vZGVzIGFyZSBhY2NvdW50ZWQgZm9yXG4gICAgICB0cmVlLnB1c2goZmlsdGVyKGluTm9kZXMsIHRoaXMuaXNFbGVtZW50KSk7XG5cbiAgICAgIC8vIGZsYXR0ZW4gdGhlIGxpc3RcbiAgICAgIHJldHVybiB0cmVlLnJlZHVjZSh0aGlzLmNvbmNhdExpc3RzLCBbXSk7XG4gICAgfSxcbiAgICBtdXRhdGlvbldhdGNoZXI6IGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2godGhpcy5tdXRhdGlvbkhhbmRsZXIsIHRoaXMpO1xuICAgIH0sXG4gICAgbXV0YXRpb25IYW5kbGVyOiBmdW5jdGlvbihtKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuICAgICAgICB2YXIgYWRkZWQgPSB0aGlzLmZsYXR0ZW5NdXRhdGlvblRyZWUobS5hZGRlZE5vZGVzKTtcbiAgICAgICAgYWRkZWQuZm9yRWFjaCh0aGlzLmFkZEVsZW1lbnQsIHRoaXMpO1xuICAgICAgICB2YXIgcmVtb3ZlZCA9IHRoaXMuZmxhdHRlbk11dGF0aW9uVHJlZShtLnJlbW92ZWROb2Rlcyk7XG4gICAgICAgIHJlbW92ZWQuZm9yRWFjaCh0aGlzLnJlbW92ZUVsZW1lbnQsIHRoaXMpO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICB0aGlzLmVsZW1lbnRDaGFuZ2VkKG0udGFyZ2V0LCBtLm9sZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc2hhZG93U2VsZWN0b3Iodikge1xuICAgIHJldHVybiAnYm9keSAvc2hhZG93LWRlZXAvICcgKyBzZWxlY3Rvcih2KTtcbiAgfVxuICBmdW5jdGlvbiBzZWxlY3Rvcih2KSB7XG4gICAgcmV0dXJuICdbdG91Y2gtYWN0aW9uPVwiJyArIHYgKyAnXCJdJztcbiAgfVxuICBmdW5jdGlvbiBydWxlKHYpIHtcbiAgICByZXR1cm4gJ3sgLW1zLXRvdWNoLWFjdGlvbjogJyArIHYgKyAnOyB0b3VjaC1hY3Rpb246ICcgKyB2ICsgJzsgfSc7XG4gIH1cbiAgdmFyIGF0dHJpYjJjc3MgPSBbXG4gICAgJ25vbmUnLFxuICAgICdhdXRvJyxcbiAgICAncGFuLXgnLFxuICAgICdwYW4teScsXG4gICAge1xuICAgICAgcnVsZTogJ3Bhbi14IHBhbi15JyxcbiAgICAgIHNlbGVjdG9yczogW1xuICAgICAgICAncGFuLXggcGFuLXknLFxuICAgICAgICAncGFuLXkgcGFuLXgnXG4gICAgICBdXG4gICAgfVxuICBdO1xuICB2YXIgc3R5bGVzID0gJyc7XG5cbiAgLy8gb25seSBpbnN0YWxsIHN0eWxlc2hlZXQgaWYgdGhlIGJyb3dzZXIgaGFzIHRvdWNoIGFjdGlvbiBzdXBwb3J0XG4gIHZhciBoYXNOYXRpdmVQRSA9IHdpbmRvdy5Qb2ludGVyRXZlbnQgfHwgd2luZG93Lk1TUG9pbnRlckV2ZW50O1xuXG4gIC8vIG9ubHkgYWRkIHNoYWRvdyBzZWxlY3RvcnMgaWYgc2hhZG93ZG9tIGlzIHN1cHBvcnRlZFxuICB2YXIgaGFzU2hhZG93Um9vdCA9ICF3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwgJiYgZG9jdW1lbnQuaGVhZC5jcmVhdGVTaGFkb3dSb290O1xuXG4gIGZ1bmN0aW9uIGFwcGx5QXR0cmlidXRlU3R5bGVzKCkge1xuICAgIGlmIChoYXNOYXRpdmVQRSkge1xuICAgICAgYXR0cmliMmNzcy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgaWYgKFN0cmluZyhyKSA9PT0gcikge1xuICAgICAgICAgIHN0eWxlcyArPSBzZWxlY3RvcihyKSArIHJ1bGUocikgKyAnXFxuJztcbiAgICAgICAgICBpZiAoaGFzU2hhZG93Um9vdCkge1xuICAgICAgICAgICAgc3R5bGVzICs9IHNoYWRvd1NlbGVjdG9yKHIpICsgcnVsZShyKSArICdcXG4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHlsZXMgKz0gci5zZWxlY3RvcnMubWFwKHNlbGVjdG9yKSArIHJ1bGUoci5ydWxlKSArICdcXG4nO1xuICAgICAgICAgIGlmIChoYXNTaGFkb3dSb290KSB7XG4gICAgICAgICAgICBzdHlsZXMgKz0gci5zZWxlY3RvcnMubWFwKHNoYWRvd1NlbGVjdG9yKSArIHJ1bGUoci5ydWxlKSArICdcXG4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IHN0eWxlcztcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwb2ludGVybWFwID0gZGlzcGF0Y2hlci5wb2ludGVybWFwO1xuXG4gIC8vIHJhZGl1cyBhcm91bmQgdG91Y2hlbmQgdGhhdCBzd2FsbG93cyBtb3VzZSBldmVudHNcbiAgdmFyIERFRFVQX0RJU1QgPSAyNTtcblxuICAvLyBsZWZ0LCBtaWRkbGUsIHJpZ2h0LCBiYWNrLCBmb3J3YXJkXG4gIHZhciBCVVRUT05fVE9fQlVUVE9OUyA9IFsxLCA0LCAyLCA4LCAxNl07XG5cbiAgdmFyIEhBU19CVVRUT05TID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgSEFTX0JVVFRPTlMgPSBuZXcgTW91c2VFdmVudCgndGVzdCcsIHsgYnV0dG9uczogMSB9KS5idXR0b25zID09PSAxO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIC8vIGhhbmRsZXIgYmxvY2sgZm9yIG5hdGl2ZSBtb3VzZSBldmVudHNcbiAgdmFyIG1vdXNlRXZlbnRzID0ge1xuICAgIFBPSU5URVJfSUQ6IDEsXG4gICAgUE9JTlRFUl9UWVBFOiAnbW91c2UnLFxuICAgIGV2ZW50czogW1xuICAgICAgJ21vdXNlZG93bicsXG4gICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICdtb3VzZXVwJyxcbiAgICAgICdtb3VzZW92ZXInLFxuICAgICAgJ21vdXNlb3V0J1xuICAgIF0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci5saXN0ZW4odGFyZ2V0LCB0aGlzLmV2ZW50cyk7XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4odGFyZ2V0LCB0aGlzLmV2ZW50cyk7XG4gICAgfSxcbiAgICBsYXN0VG91Y2hlczogW10sXG5cbiAgICAvLyBjb2xsaWRlIHdpdGggdGhlIGdsb2JhbCBtb3VzZSBsaXN0ZW5lclxuICAgIGlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2g6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBsdHMgPSB0aGlzLmxhc3RUb3VjaGVzO1xuICAgICAgdmFyIHggPSBpbkV2ZW50LmNsaWVudFg7XG4gICAgICB2YXIgeSA9IGluRXZlbnQuY2xpZW50WTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbHRzLmxlbmd0aCwgdDsgaSA8IGwgJiYgKHQgPSBsdHNbaV0pOyBpKyspIHtcblxuICAgICAgICAvLyBzaW11bGF0ZWQgbW91c2UgZXZlbnRzIHdpbGwgYmUgc3dhbGxvd2VkIG5lYXIgYSBwcmltYXJ5IHRvdWNoZW5kXG4gICAgICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpO1xuICAgICAgICB2YXIgZHkgPSBNYXRoLmFicyh5IC0gdC55KTtcbiAgICAgICAgaWYgKGR4IDw9IERFRFVQX0RJU1QgJiYgZHkgPD0gREVEVVBfRElTVCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmVwYXJlRXZlbnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5jbG9uZUV2ZW50KGluRXZlbnQpO1xuXG4gICAgICAvLyBmb3J3YXJkIG1vdXNlIHByZXZlbnREZWZhdWx0XG4gICAgICB2YXIgcGQgPSBlLnByZXZlbnREZWZhdWx0O1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHBkKCk7XG4gICAgICB9O1xuICAgICAgZS5wb2ludGVySWQgPSB0aGlzLlBPSU5URVJfSUQ7XG4gICAgICBlLmlzUHJpbWFyeSA9IHRydWU7XG4gICAgICBlLnBvaW50ZXJUeXBlID0gdGhpcy5QT0lOVEVSX1RZUEU7XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuICAgIHByZXBhcmVCdXR0b25zRm9yTW92ZTogZnVuY3Rpb24oZSwgaW5FdmVudCkge1xuICAgICAgdmFyIHAgPSBwb2ludGVybWFwLmdldCh0aGlzLlBPSU5URVJfSUQpO1xuXG4gICAgICAvLyBVcGRhdGUgYnV0dG9ucyBzdGF0ZSBhZnRlciBwb3NzaWJsZSBvdXQtb2YtZG9jdW1lbnQgbW91c2V1cC5cbiAgICAgIGlmIChpbkV2ZW50LndoaWNoID09PSAwIHx8ICFwKSB7XG4gICAgICAgIGUuYnV0dG9ucyA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlLmJ1dHRvbnMgPSBwLmJ1dHRvbnM7XG4gICAgICB9XG4gICAgICBpbkV2ZW50LmJ1dHRvbnMgPSBlLmJ1dHRvbnM7XG4gICAgfSxcbiAgICBtb3VzZWRvd246IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBwID0gcG9pbnRlcm1hcC5nZXQodGhpcy5QT0lOVEVSX0lEKTtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykge1xuICAgICAgICAgIGUuYnV0dG9ucyA9IEJVVFRPTl9UT19CVVRUT05TW2UuYnV0dG9uXTtcbiAgICAgICAgICBpZiAocCkgeyBlLmJ1dHRvbnMgfD0gcC5idXR0b25zOyB9XG4gICAgICAgICAgaW5FdmVudC5idXR0b25zID0gZS5idXR0b25zO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG4gICAgICAgIGlmICghcCB8fCBwLmJ1dHRvbnMgPT09IDApIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLmRvd24oZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5tb3ZlKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZW1vdmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHsgdGhpcy5wcmVwYXJlQnV0dG9uc0Zvck1vdmUoZSwgaW5FdmVudCk7IH1cbiAgICAgICAgZS5idXR0b24gPSAtMTtcbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcbiAgICAgICAgZGlzcGF0Y2hlci5tb3ZlKGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbW91c2V1cDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIHAgPSBwb2ludGVybWFwLmdldCh0aGlzLlBPSU5URVJfSUQpO1xuICAgICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgICBpZiAoIUhBU19CVVRUT05TKSB7XG4gICAgICAgICAgdmFyIHVwID0gQlVUVE9OX1RPX0JVVFRPTlNbZS5idXR0b25dO1xuXG4gICAgICAgICAgLy8gUHJvZHVjZXMgd3Jvbmcgc3RhdGUgb2YgYnV0dG9ucyBpbiBCcm93c2VycyB3aXRob3V0IGBidXR0b25zYCBzdXBwb3J0XG4gICAgICAgICAgLy8gd2hlbiBhIG1vdXNlIGJ1dHRvbiB0aGF0IHdhcyBwcmVzc2VkIG91dHNpZGUgdGhlIGRvY3VtZW50IGlzIHJlbGVhc2VkXG4gICAgICAgICAgLy8gaW5zaWRlIGFuZCBvdGhlciBidXR0b25zIGFyZSBzdGlsbCBwcmVzc2VkIGRvd24uXG4gICAgICAgICAgZS5idXR0b25zID0gcCA/IHAuYnV0dG9ucyAmIH51cCA6IDA7XG4gICAgICAgICAgaW5FdmVudC5idXR0b25zID0gZS5idXR0b25zO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50ZXJtYXAuc2V0KHRoaXMuUE9JTlRFUl9JRCwgaW5FdmVudCk7XG5cbiAgICAgICAgLy8gU3VwcG9ydDogRmlyZWZveCA8PTQ0IG9ubHlcbiAgICAgICAgLy8gRkYgVWJ1bnR1IGluY2x1ZGVzIHRoZSBsaWZ0ZWQgYnV0dG9uIGluIHRoZSBgYnV0dG9uc2AgcHJvcGVydHkgb25cbiAgICAgICAgLy8gbW91c2V1cC5cbiAgICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTIyMzM2NlxuICAgICAgICBlLmJ1dHRvbnMgJj0gfkJVVFRPTl9UT19CVVRUT05TW2UuYnV0dG9uXTtcbiAgICAgICAgaWYgKGUuYnV0dG9ucyA9PT0gMCkge1xuICAgICAgICAgIGRpc3BhdGNoZXIudXAoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5tb3ZlKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZW92ZXI6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0V2ZW50U2ltdWxhdGVkRnJvbVRvdWNoKGluRXZlbnQpKSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICAgIGlmICghSEFTX0JVVFRPTlMpIHsgdGhpcy5wcmVwYXJlQnV0dG9uc0Zvck1vdmUoZSwgaW5FdmVudCk7IH1cbiAgICAgICAgZS5idXR0b24gPSAtMTtcbiAgICAgICAgcG9pbnRlcm1hcC5zZXQodGhpcy5QT0lOVEVSX0lELCBpbkV2ZW50KTtcbiAgICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3VzZW91dDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmlzRXZlbnRTaW11bGF0ZWRGcm9tVG91Y2goaW5FdmVudCkpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgaWYgKCFIQVNfQlVUVE9OUykgeyB0aGlzLnByZXBhcmVCdXR0b25zRm9yTW92ZShlLCBpbkV2ZW50KTsgfVxuICAgICAgICBlLmJ1dHRvbiA9IC0xO1xuICAgICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5jYW5jZWwoZSk7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVNb3VzZSgpO1xuICAgIH0sXG4gICAgZGVhY3RpdmF0ZU1vdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHBvaW50ZXJtYXAuZGVsZXRlKHRoaXMuUE9JTlRFUl9JRCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjYXB0dXJlSW5mbyA9IGRpc3BhdGNoZXIuY2FwdHVyZUluZm87XG4gIHZhciBmaW5kVGFyZ2V0ID0gdGFyZ2V0aW5nLmZpbmRUYXJnZXQuYmluZCh0YXJnZXRpbmcpO1xuICB2YXIgYWxsU2hhZG93cyA9IHRhcmdldGluZy5hbGxTaGFkb3dzLmJpbmQodGFyZ2V0aW5nKTtcbiAgdmFyIHBvaW50ZXJtYXAkMSA9IGRpc3BhdGNoZXIucG9pbnRlcm1hcDtcblxuICAvLyBUaGlzIHNob3VsZCBiZSBsb25nIGVub3VnaCB0byBpZ25vcmUgY29tcGF0IG1vdXNlIGV2ZW50cyBtYWRlIGJ5IHRvdWNoXG4gIHZhciBERURVUF9USU1FT1VUID0gMjUwMDtcbiAgdmFyIENMSUNLX0NPVU5UX1RJTUVPVVQgPSAyMDA7XG4gIHZhciBBVFRSSUIgPSAndG91Y2gtYWN0aW9uJztcbiAgdmFyIElOU1RBTExFUjtcblxuICAvLyBoYW5kbGVyIGJsb2NrIGZvciBuYXRpdmUgdG91Y2ggZXZlbnRzXG4gIHZhciB0b3VjaEV2ZW50cyA9IHtcbiAgICBldmVudHM6IFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICd0b3VjaGNhbmNlbCdcbiAgICBdLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIElOU1RBTExFUi5lbmFibGVPblN1YnRyZWUodGFyZ2V0KTtcbiAgICB9LFxuICAgIHVucmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAvLyBUT0RPKGRmcmVlZG1hbik6IGlzIGl0IHdvcnRoIGl0IHRvIGRpc2Nvbm5lY3QgdGhlIE1PP1xuICAgIH0sXG4gICAgZWxlbWVudEFkZGVkOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGEgPSBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCKTtcbiAgICAgIHZhciBzdCA9IHRoaXMudG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGUoYSk7XG4gICAgICBpZiAoc3QpIHtcbiAgICAgICAgZWwuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgZGlzcGF0Y2hlci5saXN0ZW4oZWwsIHRoaXMuZXZlbnRzKTtcblxuICAgICAgICAvLyBzZXQgdG91Y2gtYWN0aW9uIG9uIHNoYWRvd3MgYXMgd2VsbFxuICAgICAgICBhbGxTaGFkb3dzKGVsKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgICAgZGlzcGF0Y2hlci5saXN0ZW4ocywgdGhpcy5ldmVudHMpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVsZW1lbnRSZW1vdmVkOiBmdW5jdGlvbihlbCkge1xuICAgICAgZWwuX3Njcm9sbFR5cGUgPSB1bmRlZmluZWQ7XG4gICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKGVsLCB0aGlzLmV2ZW50cyk7XG5cbiAgICAgIC8vIHJlbW92ZSB0b3VjaC1hY3Rpb24gZnJvbSBzaGFkb3dcbiAgICAgIGFsbFNoYWRvd3MoZWwpLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICBzLl9zY3JvbGxUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICBkaXNwYXRjaGVyLnVubGlzdGVuKHMsIHRoaXMuZXZlbnRzKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgZWxlbWVudENoYW5nZWQ6IGZ1bmN0aW9uKGVsLCBvbGRWYWx1ZSkge1xuICAgICAgdmFyIGEgPSBlbC5nZXRBdHRyaWJ1dGUoQVRUUklCKTtcbiAgICAgIHZhciBzdCA9IHRoaXMudG91Y2hBY3Rpb25Ub1Njcm9sbFR5cGUoYSk7XG4gICAgICB2YXIgb2xkU3QgPSB0aGlzLnRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlKG9sZFZhbHVlKTtcblxuICAgICAgLy8gc2ltcGx5IHVwZGF0ZSBzY3JvbGxUeXBlIGlmIGxpc3RlbmVycyBhcmUgYWxyZWFkeSBlc3RhYmxpc2hlZFxuICAgICAgaWYgKHN0ICYmIG9sZFN0KSB7XG4gICAgICAgIGVsLl9zY3JvbGxUeXBlID0gc3Q7XG4gICAgICAgIGFsbFNoYWRvd3MoZWwpLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHMuX3Njcm9sbFR5cGUgPSBzdDtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKG9sZFN0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlbW92ZWQoZWwpO1xuICAgICAgfSBlbHNlIGlmIChzdCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRBZGRlZChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzY3JvbGxUeXBlczoge1xuICAgICAgRU1JVFRFUjogJ25vbmUnLFxuICAgICAgWFNDUk9MTEVSOiAncGFuLXgnLFxuICAgICAgWVNDUk9MTEVSOiAncGFuLXknLFxuICAgICAgU0NST0xMRVI6IC9eKD86cGFuLXggcGFuLXkpfCg/OnBhbi15IHBhbi14KXxhdXRvJC9cbiAgICB9LFxuICAgIHRvdWNoQWN0aW9uVG9TY3JvbGxUeXBlOiBmdW5jdGlvbih0b3VjaEFjdGlvbikge1xuICAgICAgdmFyIHQgPSB0b3VjaEFjdGlvbjtcbiAgICAgIHZhciBzdCA9IHRoaXMuc2Nyb2xsVHlwZXM7XG4gICAgICBpZiAodCA9PT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgICB9IGVsc2UgaWYgKHQgPT09IHN0LlhTQ1JPTExFUikge1xuICAgICAgICByZXR1cm4gJ1gnO1xuICAgICAgfSBlbHNlIGlmICh0ID09PSBzdC5ZU0NST0xMRVIpIHtcbiAgICAgICAgcmV0dXJuICdZJztcbiAgICAgIH0gZWxzZSBpZiAoc3QuU0NST0xMRVIuZXhlYyh0KSkge1xuICAgICAgICByZXR1cm4gJ1hZJztcbiAgICAgIH1cbiAgICB9LFxuICAgIFBPSU5URVJfVFlQRTogJ3RvdWNoJyxcbiAgICBmaXJzdFRvdWNoOiBudWxsLFxuICAgIGlzUHJpbWFyeVRvdWNoOiBmdW5jdGlvbihpblRvdWNoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXJzdFRvdWNoID09PSBpblRvdWNoLmlkZW50aWZpZXI7XG4gICAgfSxcbiAgICBzZXRQcmltYXJ5VG91Y2g6IGZ1bmN0aW9uKGluVG91Y2gpIHtcblxuICAgICAgLy8gc2V0IHByaW1hcnkgdG91Y2ggaWYgdGhlcmUgbm8gcG9pbnRlcnMsIG9yIHRoZSBvbmx5IHBvaW50ZXIgaXMgdGhlIG1vdXNlXG4gICAgICBpZiAocG9pbnRlcm1hcCQxLnNpemUgPT09IDAgfHwgKHBvaW50ZXJtYXAkMS5zaXplID09PSAxICYmIHBvaW50ZXJtYXAkMS5oYXMoMSkpKSB7XG4gICAgICAgIHRoaXMuZmlyc3RUb3VjaCA9IGluVG91Y2guaWRlbnRpZmllcjtcbiAgICAgICAgdGhpcy5maXJzdFhZID0geyBYOiBpblRvdWNoLmNsaWVudFgsIFk6IGluVG91Y2guY2xpZW50WSB9O1xuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbmNlbFJlc2V0Q2xpY2tDb3VudCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlUHJpbWFyeVBvaW50ZXI6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgaWYgKGluUG9pbnRlci5pc1ByaW1hcnkpIHtcbiAgICAgICAgdGhpcy5maXJzdFRvdWNoID0gbnVsbDtcbiAgICAgICAgdGhpcy5maXJzdFhZID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXNldENsaWNrQ291bnQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsaWNrQ291bnQ6IDAsXG4gICAgcmVzZXRJZDogbnVsbCxcbiAgICByZXNldENsaWNrQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2xpY2tDb3VudCA9IDA7XG4gICAgICAgIHRoaXMucmVzZXRJZCA9IG51bGw7XG4gICAgICB9LmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnJlc2V0SWQgPSBzZXRUaW1lb3V0KGZuLCBDTElDS19DT1VOVF9USU1FT1VUKTtcbiAgICB9LFxuICAgIGNhbmNlbFJlc2V0Q2xpY2tDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5yZXNldElkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2V0SWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdHlwZVRvQnV0dG9uczogZnVuY3Rpb24odHlwZSkge1xuICAgICAgdmFyIHJldCA9IDA7XG4gICAgICBpZiAodHlwZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IHR5cGUgPT09ICd0b3VjaG1vdmUnKSB7XG4gICAgICAgIHJldCA9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgdG91Y2hUb1BvaW50ZXI6IGZ1bmN0aW9uKGluVG91Y2gpIHtcbiAgICAgIHZhciBjdGUgPSB0aGlzLmN1cnJlbnRUb3VjaEV2ZW50O1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLmNsb25lRXZlbnQoaW5Ub3VjaCk7XG5cbiAgICAgIC8vIFdlIHJlc2VydmUgcG9pbnRlcklkIDEgZm9yIE1vdXNlLlxuICAgICAgLy8gVG91Y2ggaWRlbnRpZmllcnMgY2FuIHN0YXJ0IGF0IDAuXG4gICAgICAvLyBBZGQgMiB0byB0aGUgdG91Y2ggaWRlbnRpZmllciBmb3IgY29tcGF0aWJpbGl0eS5cbiAgICAgIHZhciBpZCA9IGUucG9pbnRlcklkID0gaW5Ub3VjaC5pZGVudGlmaWVyICsgMjtcbiAgICAgIGUudGFyZ2V0ID0gY2FwdHVyZUluZm9baWRdIHx8IGZpbmRUYXJnZXQoZSk7XG4gICAgICBlLmJ1YmJsZXMgPSB0cnVlO1xuICAgICAgZS5jYW5jZWxhYmxlID0gdHJ1ZTtcbiAgICAgIGUuZGV0YWlsID0gdGhpcy5jbGlja0NvdW50O1xuICAgICAgZS5idXR0b24gPSAwO1xuICAgICAgZS5idXR0b25zID0gdGhpcy50eXBlVG9CdXR0b25zKGN0ZS50eXBlKTtcbiAgICAgIGUud2lkdGggPSAoaW5Ub3VjaC5yYWRpdXNYIHx8IGluVG91Y2gud2Via2l0UmFkaXVzWCB8fCAwKSAqIDI7XG4gICAgICBlLmhlaWdodCA9IChpblRvdWNoLnJhZGl1c1kgfHwgaW5Ub3VjaC53ZWJraXRSYWRpdXNZIHx8IDApICogMjtcbiAgICAgIGUucHJlc3N1cmUgPSBpblRvdWNoLmZvcmNlIHx8IGluVG91Y2gud2Via2l0Rm9yY2UgfHwgMC41O1xuICAgICAgZS5pc1ByaW1hcnkgPSB0aGlzLmlzUHJpbWFyeVRvdWNoKGluVG91Y2gpO1xuICAgICAgZS5wb2ludGVyVHlwZSA9IHRoaXMuUE9JTlRFUl9UWVBFO1xuXG4gICAgICAvLyBmb3J3YXJkIG1vZGlmaWVyIGtleXNcbiAgICAgIGUuYWx0S2V5ID0gY3RlLmFsdEtleTtcbiAgICAgIGUuY3RybEtleSA9IGN0ZS5jdHJsS2V5O1xuICAgICAgZS5tZXRhS2V5ID0gY3RlLm1ldGFLZXk7XG4gICAgICBlLnNoaWZ0S2V5ID0gY3RlLnNoaWZ0S2V5O1xuXG4gICAgICAvLyBmb3J3YXJkIHRvdWNoIHByZXZlbnREZWZhdWx0c1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLmZpcnN0WFkgPSBudWxsO1xuICAgICAgICBjdGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gZTtcbiAgICB9LFxuICAgIHByb2Nlc3NUb3VjaGVzOiBmdW5jdGlvbihpbkV2ZW50LCBpbkZ1bmN0aW9uKSB7XG4gICAgICB2YXIgdGwgPSBpbkV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuICAgICAgdGhpcy5jdXJyZW50VG91Y2hFdmVudCA9IGluRXZlbnQ7XG4gICAgICBmb3IgKHZhciBpID0gMCwgdDsgaSA8IHRsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHQgPSB0bFtpXTtcbiAgICAgICAgaW5GdW5jdGlvbi5jYWxsKHRoaXMsIHRoaXMudG91Y2hUb1BvaW50ZXIodCkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBGb3Igc2luZ2xlIGF4aXMgc2Nyb2xsZXJzLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIGVtaXRcbiAgICAvLyBwb2ludGVyIGV2ZW50cyBvciBiZWhhdmUgYXMgYSBzY3JvbGxlclxuICAgIHNob3VsZFNjcm9sbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgaWYgKHRoaXMuZmlyc3RYWSkge1xuICAgICAgICB2YXIgcmV0O1xuICAgICAgICB2YXIgc2Nyb2xsQXhpcyA9IGluRXZlbnQuY3VycmVudFRhcmdldC5fc2Nyb2xsVHlwZTtcbiAgICAgICAgaWYgKHNjcm9sbEF4aXMgPT09ICdub25lJykge1xuXG4gICAgICAgICAgLy8gdGhpcyBlbGVtZW50IGlzIGEgdG91Y2gtYWN0aW9uOiBub25lLCBzaG91bGQgbmV2ZXIgc2Nyb2xsXG4gICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsQXhpcyA9PT0gJ1hZJykge1xuXG4gICAgICAgICAgLy8gdGhpcyBlbGVtZW50IHNob3VsZCBhbHdheXMgc2Nyb2xsXG4gICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdCA9IGluRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgICAgICAvLyBjaGVjayB0aGUgaW50ZW5kZWQgc2Nyb2xsIGF4aXMsIGFuZCBvdGhlciBheGlzXG4gICAgICAgICAgdmFyIGEgPSBzY3JvbGxBeGlzO1xuICAgICAgICAgIHZhciBvYSA9IHNjcm9sbEF4aXMgPT09ICdZJyA/ICdYJyA6ICdZJztcbiAgICAgICAgICB2YXIgZGEgPSBNYXRoLmFicyh0WydjbGllbnQnICsgYV0gLSB0aGlzLmZpcnN0WFlbYV0pO1xuICAgICAgICAgIHZhciBkb2EgPSBNYXRoLmFicyh0WydjbGllbnQnICsgb2FdIC0gdGhpcy5maXJzdFhZW29hXSk7XG5cbiAgICAgICAgICAvLyBpZiBkZWx0YSBpbiB0aGUgc2Nyb2xsIGF4aXMgPiBkZWx0YSBvdGhlciBheGlzLCBzY3JvbGwgaW5zdGVhZCBvZlxuICAgICAgICAgIC8vIG1ha2luZyBldmVudHNcbiAgICAgICAgICByZXQgPSBkYSA+PSBkb2E7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJzdFhZID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbmRUb3VjaDogZnVuY3Rpb24oaW5UTCwgaW5JZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBpblRMLmxlbmd0aCwgdDsgaSA8IGwgJiYgKHQgPSBpblRMW2ldKTsgaSsrKSB7XG4gICAgICAgIGlmICh0LmlkZW50aWZpZXIgPT09IGluSWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBJbiBzb21lIGluc3RhbmNlcywgYSB0b3VjaHN0YXJ0IGNhbiBoYXBwZW4gd2l0aG91dCBhIHRvdWNoZW5kLiBUaGlzXG4gICAgLy8gbGVhdmVzIHRoZSBwb2ludGVybWFwIGluIGEgYnJva2VuIHN0YXRlLlxuICAgIC8vIFRoZXJlZm9yZSwgb24gZXZlcnkgdG91Y2hzdGFydCwgd2UgcmVtb3ZlIHRoZSB0b3VjaGVzIHRoYXQgZGlkIG5vdCBmaXJlIGFcbiAgICAvLyB0b3VjaGVuZCBldmVudC5cbiAgICAvLyBUbyBrZWVwIHN0YXRlIGdsb2JhbGx5IGNvbnNpc3RlbnQsIHdlIGZpcmUgYVxuICAgIC8vIHBvaW50ZXJjYW5jZWwgZm9yIHRoaXMgXCJhYmFuZG9uZWRcIiB0b3VjaFxuICAgIHZhY3V1bVRvdWNoZXM6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciB0bCA9IGluRXZlbnQudG91Y2hlcztcblxuICAgICAgLy8gcG9pbnRlcm1hcC5zaXplIHNob3VsZCBiZSA8IHRsLmxlbmd0aCBoZXJlLCBhcyB0aGUgdG91Y2hzdGFydCBoYXMgbm90XG4gICAgICAvLyBiZWVuIHByb2Nlc3NlZCB5ZXQuXG4gICAgICBpZiAocG9pbnRlcm1hcCQxLnNpemUgPj0gdGwubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkID0gW107XG4gICAgICAgIHBvaW50ZXJtYXAkMS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcblxuICAgICAgICAgIC8vIE5ldmVyIHJlbW92ZSBwb2ludGVySWQgPT0gMSwgd2hpY2ggaXMgbW91c2UuXG4gICAgICAgICAgLy8gVG91Y2ggaWRlbnRpZmllcnMgYXJlIDIgc21hbGxlciB0aGFuIHRoZWlyIHBvaW50ZXJJZCwgd2hpY2ggaXMgdGhlXG4gICAgICAgICAgLy8gaW5kZXggaW4gcG9pbnRlcm1hcC5cbiAgICAgICAgICBpZiAoa2V5ICE9PSAxICYmICF0aGlzLmZpbmRUb3VjaCh0bCwga2V5IC0gMikpIHtcbiAgICAgICAgICAgIHZhciBwID0gdmFsdWUub3V0O1xuICAgICAgICAgICAgZC5wdXNoKHApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIGQuZm9yRWFjaCh0aGlzLmNhbmNlbE91dCwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0b3VjaHN0YXJ0OiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB0aGlzLnZhY3V1bVRvdWNoZXMoaW5FdmVudCk7XG4gICAgICB0aGlzLnNldFByaW1hcnlUb3VjaChpbkV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKTtcbiAgICAgIHRoaXMuZGVkdXBTeW50aE1vdXNlKGluRXZlbnQpO1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgICB0aGlzLmNsaWNrQ291bnQrKztcbiAgICAgICAgdGhpcy5wcm9jZXNzVG91Y2hlcyhpbkV2ZW50LCB0aGlzLm92ZXJEb3duKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG92ZXJEb3duOiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIHBvaW50ZXJtYXAkMS5zZXQoaW5Qb2ludGVyLnBvaW50ZXJJZCwge1xuICAgICAgICB0YXJnZXQ6IGluUG9pbnRlci50YXJnZXQsXG4gICAgICAgIG91dDogaW5Qb2ludGVyLFxuICAgICAgICBvdXRUYXJnZXQ6IGluUG9pbnRlci50YXJnZXRcbiAgICAgIH0pO1xuICAgICAgZGlzcGF0Y2hlci5lbnRlck92ZXIoaW5Qb2ludGVyKTtcbiAgICAgIGRpc3BhdGNoZXIuZG93bihpblBvaW50ZXIpO1xuICAgIH0sXG4gICAgdG91Y2htb3ZlOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFNjcm9sbChpbkV2ZW50KSkge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnRvdWNoY2FuY2VsKGluRXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NUb3VjaGVzKGluRXZlbnQsIHRoaXMubW92ZU92ZXJPdXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3ZlT3Zlck91dDogZnVuY3Rpb24oaW5Qb2ludGVyKSB7XG4gICAgICB2YXIgZXZlbnQgPSBpblBvaW50ZXI7XG4gICAgICB2YXIgcG9pbnRlciA9IHBvaW50ZXJtYXAkMS5nZXQoZXZlbnQucG9pbnRlcklkKTtcblxuICAgICAgLy8gYSBmaW5nZXIgZHJpZnRlZCBvZmYgdGhlIHNjcmVlbiwgaWdub3JlIGl0XG4gICAgICBpZiAoIXBvaW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG91dEV2ZW50ID0gcG9pbnRlci5vdXQ7XG4gICAgICB2YXIgb3V0VGFyZ2V0ID0gcG9pbnRlci5vdXRUYXJnZXQ7XG4gICAgICBkaXNwYXRjaGVyLm1vdmUoZXZlbnQpO1xuICAgICAgaWYgKG91dEV2ZW50ICYmIG91dFRhcmdldCAhPT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIG91dEV2ZW50LnJlbGF0ZWRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGV2ZW50LnJlbGF0ZWRUYXJnZXQgPSBvdXRUYXJnZXQ7XG5cbiAgICAgICAgLy8gcmVjb3ZlciBmcm9tIHJldGFyZ2V0aW5nIGJ5IHNoYWRvd1xuICAgICAgICBvdXRFdmVudC50YXJnZXQgPSBvdXRUYXJnZXQ7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KG91dEV2ZW50KTtcbiAgICAgICAgICBkaXNwYXRjaGVyLmVudGVyT3ZlcihldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyBjbGVhbiB1cCBjYXNlIHdoZW4gZmluZ2VyIGxlYXZlcyB0aGUgc2NyZWVuXG4gICAgICAgICAgZXZlbnQudGFyZ2V0ID0gb3V0VGFyZ2V0O1xuICAgICAgICAgIGV2ZW50LnJlbGF0ZWRUYXJnZXQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuY2FuY2VsT3V0KGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcG9pbnRlci5vdXQgPSBldmVudDtcbiAgICAgIHBvaW50ZXIub3V0VGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIH0sXG4gICAgdG91Y2hlbmQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHRoaXMuZGVkdXBTeW50aE1vdXNlKGluRXZlbnQpO1xuICAgICAgdGhpcy5wcm9jZXNzVG91Y2hlcyhpbkV2ZW50LCB0aGlzLnVwT3V0KTtcbiAgICB9LFxuICAgIHVwT3V0OiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgICAgZGlzcGF0Y2hlci51cChpblBvaW50ZXIpO1xuICAgICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KGluUG9pbnRlcik7XG4gICAgICB9XG4gICAgICB0aGlzLmNsZWFuVXBQb2ludGVyKGluUG9pbnRlcik7XG4gICAgfSxcbiAgICB0b3VjaGNhbmNlbDogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdGhpcy5wcm9jZXNzVG91Y2hlcyhpbkV2ZW50LCB0aGlzLmNhbmNlbE91dCk7XG4gICAgfSxcbiAgICBjYW5jZWxPdXQ6IGZ1bmN0aW9uKGluUG9pbnRlcikge1xuICAgICAgZGlzcGF0Y2hlci5jYW5jZWwoaW5Qb2ludGVyKTtcbiAgICAgIGRpc3BhdGNoZXIubGVhdmVPdXQoaW5Qb2ludGVyKTtcbiAgICAgIHRoaXMuY2xlYW5VcFBvaW50ZXIoaW5Qb2ludGVyKTtcbiAgICB9LFxuICAgIGNsZWFuVXBQb2ludGVyOiBmdW5jdGlvbihpblBvaW50ZXIpIHtcbiAgICAgIHBvaW50ZXJtYXAkMS5kZWxldGUoaW5Qb2ludGVyLnBvaW50ZXJJZCk7XG4gICAgICB0aGlzLnJlbW92ZVByaW1hcnlQb2ludGVyKGluUG9pbnRlcik7XG4gICAgfSxcblxuICAgIC8vIHByZXZlbnQgc3ludGggbW91c2UgZXZlbnRzIGZyb20gY3JlYXRpbmcgcG9pbnRlciBldmVudHNcbiAgICBkZWR1cFN5bnRoTW91c2U6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBsdHMgPSBtb3VzZUV2ZW50cy5sYXN0VG91Y2hlcztcbiAgICAgIHZhciB0ID0gaW5FdmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgICAgLy8gb25seSB0aGUgcHJpbWFyeSBmaW5nZXIgd2lsbCBzeW50aCBtb3VzZSBldmVudHNcbiAgICAgIGlmICh0aGlzLmlzUHJpbWFyeVRvdWNoKHQpKSB7XG5cbiAgICAgICAgLy8gcmVtZW1iZXIgeC95IG9mIGxhc3QgdG91Y2hcbiAgICAgICAgdmFyIGx0ID0geyB4OiB0LmNsaWVudFgsIHk6IHQuY2xpZW50WSB9O1xuICAgICAgICBsdHMucHVzaChsdCk7XG4gICAgICAgIHZhciBmbiA9IChmdW5jdGlvbihsdHMsIGx0KSB7XG4gICAgICAgICAgdmFyIGkgPSBsdHMuaW5kZXhPZihsdCk7XG4gICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgbHRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQobnVsbCwgbHRzLCBsdCk7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIERFRFVQX1RJTUVPVVQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJTlNUQUxMRVIgPSBuZXcgSW5zdGFsbGVyKHRvdWNoRXZlbnRzLmVsZW1lbnRBZGRlZCwgdG91Y2hFdmVudHMuZWxlbWVudFJlbW92ZWQsXG4gICAgdG91Y2hFdmVudHMuZWxlbWVudENoYW5nZWQsIHRvdWNoRXZlbnRzKTtcblxuICB2YXIgcG9pbnRlcm1hcCQyID0gZGlzcGF0Y2hlci5wb2ludGVybWFwO1xuICB2YXIgSEFTX0JJVE1BUF9UWVBFID0gd2luZG93Lk1TUG9pbnRlckV2ZW50ICYmXG4gICAgdHlwZW9mIHdpbmRvdy5NU1BvaW50ZXJFdmVudC5NU1BPSU5URVJfVFlQRV9NT1VTRSA9PT0gJ251bWJlcic7XG4gIHZhciBtc0V2ZW50cyA9IHtcbiAgICBldmVudHM6IFtcbiAgICAgICdNU1BvaW50ZXJEb3duJyxcbiAgICAgICdNU1BvaW50ZXJNb3ZlJyxcbiAgICAgICdNU1BvaW50ZXJVcCcsXG4gICAgICAnTVNQb2ludGVyT3V0JyxcbiAgICAgICdNU1BvaW50ZXJPdmVyJyxcbiAgICAgICdNU1BvaW50ZXJDYW5jZWwnLFxuICAgICAgJ01TR290UG9pbnRlckNhcHR1cmUnLFxuICAgICAgJ01TTG9zdFBvaW50ZXJDYXB0dXJlJ1xuICAgIF0sXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgZGlzcGF0Y2hlci5saXN0ZW4odGFyZ2V0LCB0aGlzLmV2ZW50cyk7XG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGRpc3BhdGNoZXIudW5saXN0ZW4odGFyZ2V0LCB0aGlzLmV2ZW50cyk7XG4gICAgfSxcbiAgICBQT0lOVEVSX1RZUEVTOiBbXG4gICAgICAnJyxcbiAgICAgICd1bmF2YWlsYWJsZScsXG4gICAgICAndG91Y2gnLFxuICAgICAgJ3BlbicsXG4gICAgICAnbW91c2UnXG4gICAgXSxcbiAgICBwcmVwYXJlRXZlbnQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gaW5FdmVudDtcbiAgICAgIGlmIChIQVNfQklUTUFQX1RZUEUpIHtcbiAgICAgICAgZSA9IGRpc3BhdGNoZXIuY2xvbmVFdmVudChpbkV2ZW50KTtcbiAgICAgICAgZS5wb2ludGVyVHlwZSA9IHRoaXMuUE9JTlRFUl9UWVBFU1tpbkV2ZW50LnBvaW50ZXJUeXBlXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlO1xuICAgIH0sXG4gICAgY2xlYW51cDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHBvaW50ZXJtYXAkMi5kZWxldGUoaWQpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyRG93bjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgcG9pbnRlcm1hcCQyLnNldChpbkV2ZW50LnBvaW50ZXJJZCwgaW5FdmVudCk7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5kb3duKGUpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyTW92ZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIubW92ZShlKTtcbiAgICB9LFxuICAgIE1TUG9pbnRlclVwOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci51cChlKTtcbiAgICAgIHRoaXMuY2xlYW51cChpbkV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfSxcbiAgICBNU1BvaW50ZXJPdXQ6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gdGhpcy5wcmVwYXJlRXZlbnQoaW5FdmVudCk7XG4gICAgICBkaXNwYXRjaGVyLmxlYXZlT3V0KGUpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyT3ZlcjogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSB0aGlzLnByZXBhcmVFdmVudChpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZW50ZXJPdmVyKGUpO1xuICAgIH0sXG4gICAgTVNQb2ludGVyQ2FuY2VsOiBmdW5jdGlvbihpbkV2ZW50KSB7XG4gICAgICB2YXIgZSA9IHRoaXMucHJlcGFyZUV2ZW50KGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5jYW5jZWwoZSk7XG4gICAgICB0aGlzLmNsZWFudXAoaW5FdmVudC5wb2ludGVySWQpO1xuICAgIH0sXG4gICAgTVNMb3N0UG9pbnRlckNhcHR1cmU6IGZ1bmN0aW9uKGluRXZlbnQpIHtcbiAgICAgIHZhciBlID0gZGlzcGF0Y2hlci5tYWtlRXZlbnQoJ2xvc3Rwb2ludGVyY2FwdHVyZScsIGluRXZlbnQpO1xuICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0sXG4gICAgTVNHb3RQb2ludGVyQ2FwdHVyZTogZnVuY3Rpb24oaW5FdmVudCkge1xuICAgICAgdmFyIGUgPSBkaXNwYXRjaGVyLm1ha2VFdmVudCgnZ290cG9pbnRlcmNhcHR1cmUnLCBpbkV2ZW50KTtcbiAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gYXBwbHlQb2x5ZmlsbCgpIHtcblxuICAgIC8vIG9ubHkgYWN0aXZhdGUgaWYgdGhpcyBwbGF0Zm9ybSBkb2VzIG5vdCBoYXZlIHBvaW50ZXIgZXZlbnRzXG4gICAgaWYgKCF3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgICB3aW5kb3cuUG9pbnRlckV2ZW50ID0gUG9pbnRlckV2ZW50O1xuXG4gICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgICAgIHZhciB0cCA9IHdpbmRvdy5uYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cztcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5uYXZpZ2F0b3IsICdtYXhUb3VjaFBvaW50cycsIHtcbiAgICAgICAgICB2YWx1ZTogdHAsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgZGlzcGF0Y2hlci5yZWdpc3RlclNvdXJjZSgnbXMnLCBtc0V2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93Lm5hdmlnYXRvciwgJ21heFRvdWNoUG9pbnRzJywge1xuICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGRpc3BhdGNoZXIucmVnaXN0ZXJTb3VyY2UoJ21vdXNlJywgbW91c2VFdmVudHMpO1xuICAgICAgICBpZiAod2luZG93Lm9udG91Y2hzdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZGlzcGF0Y2hlci5yZWdpc3RlclNvdXJjZSgndG91Y2gnLCB0b3VjaEV2ZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGlzcGF0Y2hlci5yZWdpc3Rlcihkb2N1bWVudCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIG4gPSB3aW5kb3cubmF2aWdhdG9yO1xuICB2YXIgcztcbiAgdmFyIHI7XG4gIHZhciBoO1xuICBmdW5jdGlvbiBhc3NlcnRBY3RpdmUoaWQpIHtcbiAgICBpZiAoIWRpc3BhdGNoZXIucG9pbnRlcm1hcC5oYXMoaWQpKSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ0ludmFsaWRQb2ludGVySWQnKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YWxpZFBvaW50ZXJJZCc7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYXNzZXJ0Q29ubmVjdGVkKGVsZW0pIHtcbiAgICB2YXIgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuICAgIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50ICE9PSBlbGVtLm93bmVyRG9jdW1lbnQpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuICAgIH1cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdJbnZhbGlkU3RhdGVFcnJvcicpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhbGlkU3RhdGVFcnJvcic7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaW5BY3RpdmVCdXR0b25TdGF0ZShpZCkge1xuICAgIHZhciBwID0gZGlzcGF0Y2hlci5wb2ludGVybWFwLmdldChpZCk7XG4gICAgcmV0dXJuIHAuYnV0dG9ucyAhPT0gMDtcbiAgfVxuICBpZiAobi5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgcyA9IGZ1bmN0aW9uKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBhc3NlcnRDb25uZWN0ZWQodGhpcyk7XG4gICAgICBpZiAoaW5BY3RpdmVCdXR0b25TdGF0ZShwb2ludGVySWQpKSB7XG4gICAgICAgIGRpc3BhdGNoZXIuc2V0Q2FwdHVyZShwb2ludGVySWQsIHRoaXMsIHRydWUpO1xuICAgICAgICB0aGlzLm1zU2V0UG9pbnRlckNhcHR1cmUocG9pbnRlcklkKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHIgPSBmdW5jdGlvbihwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgZGlzcGF0Y2hlci5yZWxlYXNlQ2FwdHVyZShwb2ludGVySWQsIHRydWUpO1xuICAgICAgdGhpcy5tc1JlbGVhc2VQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcyA9IGZ1bmN0aW9uIHNldFBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCkge1xuICAgICAgYXNzZXJ0QWN0aXZlKHBvaW50ZXJJZCk7XG4gICAgICBhc3NlcnRDb25uZWN0ZWQodGhpcyk7XG4gICAgICBpZiAoaW5BY3RpdmVCdXR0b25TdGF0ZShwb2ludGVySWQpKSB7XG4gICAgICAgIGRpc3BhdGNoZXIuc2V0Q2FwdHVyZShwb2ludGVySWQsIHRoaXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgciA9IGZ1bmN0aW9uIHJlbGVhc2VQb2ludGVyQ2FwdHVyZShwb2ludGVySWQpIHtcbiAgICAgIGFzc2VydEFjdGl2ZShwb2ludGVySWQpO1xuICAgICAgZGlzcGF0Y2hlci5yZWxlYXNlQ2FwdHVyZShwb2ludGVySWQpO1xuICAgIH07XG4gIH1cbiAgaCA9IGZ1bmN0aW9uIGhhc1BvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCkge1xuICAgIHJldHVybiAhIWRpc3BhdGNoZXIuY2FwdHVyZUluZm9bcG9pbnRlcklkXTtcbiAgfTtcblxuICBmdW5jdGlvbiBhcHBseVBvbHlmaWxsJDEoKSB7XG4gICAgaWYgKHdpbmRvdy5FbGVtZW50ICYmICFFbGVtZW50LnByb3RvdHlwZS5zZXRQb2ludGVyQ2FwdHVyZSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgJ3NldFBvaW50ZXJDYXB0dXJlJzoge1xuICAgICAgICAgIHZhbHVlOiBzXG4gICAgICAgIH0sXG4gICAgICAgICdyZWxlYXNlUG9pbnRlckNhcHR1cmUnOiB7XG4gICAgICAgICAgdmFsdWU6IHJcbiAgICAgICAgfSxcbiAgICAgICAgJ2hhc1BvaW50ZXJDYXB0dXJlJzoge1xuICAgICAgICAgIHZhbHVlOiBoXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5QXR0cmlidXRlU3R5bGVzKCk7XG4gIGFwcGx5UG9seWZpbGwoKTtcbiAgYXBwbHlQb2x5ZmlsbCQxKCk7XG5cbiAgdmFyIHBvaW50ZXJldmVudHMgPSB7XG4gICAgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcixcbiAgICBJbnN0YWxsZXI6IEluc3RhbGxlcixcbiAgICBQb2ludGVyRXZlbnQ6IFBvaW50ZXJFdmVudCxcbiAgICBQb2ludGVyTWFwOiBQb2ludGVyTWFwLFxuICAgIHRhcmdldEZpbmRpbmc6IHRhcmdldGluZ1xuICB9O1xuXG4gIHJldHVybiBwb2ludGVyZXZlbnRzO1xuXG59KSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcGVwanMvZGlzdC9wZXAuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3BlcGpzL2Rpc3QvcGVwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdmVuZG9yIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdmVuZG9yIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHZlbmRvciIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSB2ZW5kb3IiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gdmVuZG9yIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuLy8gT24gc29tZSBleG90aWMgZW52aXJvbm1lbnRzLCBpdCdzIG5vdCBjbGVhciB3aGljaCBvYmplY3QgYHNldGltbWVpZGF0ZWAgd2FzXG4vLyBhYmxlIHRvIGluc3RhbGwgb250by4gIFNlYXJjaCBlYWNoIHBvc3NpYmlsaXR5IGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZVxuLy8gYHNldGltbWVkaWF0ZWAgbGlicmFyeS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuc2V0SW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLnNldEltbWVkaWF0ZSk7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuY2xlYXJJbW1lZGlhdGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHZlbmRvciIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHZlbmRvciIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IHZlbmRvciJdLCJzb3VyY2VSb290IjoiIn0=