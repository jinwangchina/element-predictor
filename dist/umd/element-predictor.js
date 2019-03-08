(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["elementPredictor"] = factory();
	else
		root["elementPredictor"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/element-predictor.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/element-predictor.ts":
/*!**********************************!*\
  !*** ./src/element-predictor.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar ElementPredictorImpl = /** @class */ (function () {\r\n    function ElementPredictorImpl() {\r\n        this.confidentDistance = 200;\r\n        this.confidentResultCount = 10;\r\n        this.sameResultCount = 0;\r\n    }\r\n    ElementPredictorImpl.prototype.setup = function (param) {\r\n        this.destroy();\r\n        this.elementSelectors = param.elementSelectors;\r\n        this.handler = param.handler;\r\n        if (param.confidentDistance) {\r\n            this.confidentDistance = param.confidentDistance;\r\n        }\r\n        if (param.confidentResultCount) {\r\n            this.confidentResultCount = param.confidentResultCount;\r\n        }\r\n        this.documentListener = this.createDocumentListener();\r\n        return this;\r\n    };\r\n    ElementPredictorImpl.prototype.start = function () {\r\n        this.registerDocumentListener();\r\n        return this;\r\n    };\r\n    ElementPredictorImpl.prototype.stop = function () {\r\n        this.deRegisterDocumentListener();\r\n        return this;\r\n    };\r\n    ElementPredictorImpl.prototype.destroy = function () {\r\n        this.stop();\r\n        this.elementSelectors = null;\r\n        this.handler = null;\r\n        this.documentListener = null;\r\n        return this;\r\n    };\r\n    ElementPredictorImpl.prototype.createDocumentListener = function () {\r\n        var _this = this;\r\n        return function (event) {\r\n            if (_this.elementSelectors == null\r\n                || _this.elementSelectors.length === 0\r\n                || !_this.handler) {\r\n                return;\r\n            }\r\n            var result = _this.predictResult(event);\r\n            _this.handler(result);\r\n        };\r\n    };\r\n    ElementPredictorImpl.prototype.predictResult = function (event) {\r\n        var currentResult = this.getClosest(event);\r\n        this.checkAndCount(currentResult);\r\n        if (this.isResultToGo(currentResult)) {\r\n            return currentResult;\r\n        }\r\n    };\r\n    ElementPredictorImpl.prototype.getClosest = function (event) {\r\n        var _this = this;\r\n        var closestSelector;\r\n        var closestElement;\r\n        var closestDistance;\r\n        this.elementSelectors.forEach(function (selector) {\r\n            var element = _this.getElement(selector);\r\n            if (!element || !_this.isElementInTheViewPort(element)) {\r\n                return;\r\n            }\r\n            var distance = _this.calculateDistance(event, element);\r\n            if (closestDistance !== undefined && distance > closestDistance) {\r\n                return;\r\n            }\r\n            closestSelector = selector;\r\n            closestElement = element;\r\n            closestDistance = distance;\r\n        });\r\n        return closestElement && {\r\n            selector: closestSelector,\r\n            element: closestElement,\r\n            distance: closestDistance\r\n        };\r\n    };\r\n    ElementPredictorImpl.prototype.checkAndCount = function (currentResult) {\r\n        // reset if the current result is not valid\r\n        if (!currentResult\r\n            // reset if the closest element is changed\r\n            || (this.previousResult && this.previousResult.element !== currentResult.element)\r\n            // reset if mouse is moving away from the current element\r\n            || (this.previousResult && this.previousResult.distance < currentResult.distance)) {\r\n            this.resetCounting();\r\n            return;\r\n        }\r\n        this.count(currentResult);\r\n    };\r\n    ElementPredictorImpl.prototype.resetCounting = function () {\r\n        this.previousResult = undefined;\r\n        this.sameResultCount = 0;\r\n    };\r\n    ElementPredictorImpl.prototype.count = function (currentResult) {\r\n        this.previousResult = currentResult;\r\n        this.sameResultCount++;\r\n    };\r\n    ElementPredictorImpl.prototype.isResultToGo = function (currentResult) {\r\n        return this.sameResultCount > this.confidentResultCount\r\n            && currentResult.distance < this.confidentDistance;\r\n    };\r\n    ElementPredictorImpl.prototype.getElement = function (selector) {\r\n        return document.querySelector(selector);\r\n    };\r\n    ElementPredictorImpl.prototype.isElementInTheViewPort = function (element) {\r\n        var elementRect = element.getBoundingClientRect();\r\n        return elementRect.top >= 0\r\n            && elementRect.left >= 0\r\n            && elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)\r\n            && elementRect.right <= (window.innerWidth || document.documentElement.clientWidth);\r\n    };\r\n    ElementPredictorImpl.prototype.calculateDistance = function (event, element) {\r\n        var elementRect = element.getBoundingClientRect();\r\n        var elementX = elementRect.left + (elementRect.width / 2);\r\n        var elementY = elementRect.top + (elementRect.height / 2);\r\n        var mouseX = event.clientX;\r\n        var mouseY = event.clientY;\r\n        return Math.floor(Math.sqrt(Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2)));\r\n    };\r\n    ElementPredictorImpl.prototype.registerDocumentListener = function () {\r\n        document.addEventListener(\"mousemove\", this.documentListener);\r\n    };\r\n    ElementPredictorImpl.prototype.deRegisterDocumentListener = function () {\r\n        document.removeEventListener(\"mousemove\", this.documentListener);\r\n    };\r\n    return ElementPredictorImpl;\r\n}());\r\nexports.default = new ElementPredictorImpl();\r\n\n\n//# sourceURL=webpack://elementPredictor/./src/element-predictor.ts?");

/***/ })

/******/ });
});