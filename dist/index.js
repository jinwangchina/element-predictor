"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ElementPredictorImpl = /** @class */ (function () {
    function ElementPredictorImpl() {
        this.sameResultCount = 0;
    }
    ElementPredictorImpl.prototype.setup = function (param) {
        this.destroy();
        this.elementSelectors = param.elementSelectors;
        this.handler = param.handler;
        this.documentListener = this.createDocumentListener();
        return this;
    };
    ElementPredictorImpl.prototype.start = function () {
        this.registerDocumentListener();
        return this;
    };
    ElementPredictorImpl.prototype.stop = function () {
        this.deRegisterDocumentListener();
        return this;
    };
    ElementPredictorImpl.prototype.destroy = function () {
        this.stop();
        this.elementSelectors = null;
        this.handler = null;
        this.documentListener = null;
        return this;
    };
    ElementPredictorImpl.prototype.createDocumentListener = function () {
        var _this = this;
        return function (event) {
            if (_this.elementSelectors == null
                || _this.elementSelectors.length === 0
                || !_this.handler) {
                return;
            }
            var result = _this.predictResult(event);
            if (result) {
                _this.handler(result);
            }
        };
    };
    ElementPredictorImpl.prototype.predictResult = function (event) {
        var currentResult = this.getClosest(event);
        this.checkAndCount(currentResult);
        return this.isResultToGo() && currentResult;
    };
    ElementPredictorImpl.prototype.getClosest = function (event) {
        var _this = this;
        var closestSelector;
        var closestElement;
        var closestDistance;
        this.elementSelectors.forEach(function (selector) {
            var element = _this.getElement(selector);
            if (!element || !_this.isElementInTheViewPort(element)) {
                return;
            }
            var distance = _this.calculateDistance(event, element);
            if (closestDistance !== undefined && distance > closestDistance) {
                return;
            }
            closestSelector = selector;
            closestElement = element;
            closestDistance = distance;
        });
        return closestElement && {
            selector: closestSelector,
            element: closestElement,
            distance: closestDistance
        };
    };
    ElementPredictorImpl.prototype.checkAndCount = function (currentResult) {
        // reset if the current result is not valid
        if (!currentResult || currentResult.distance > 200) {
            this.resetCounting();
            return;
        }
        // count if it is the first time counting
        if (!this.previousResult) {
            this.count(currentResult);
            return;
        }
        // reset if the closest element is changed
        if (this.previousResult.element !== currentResult.element) {
            this.resetCounting();
            return;
        }
        // reset if mouse is moving away the current element
        if (this.previousResult.distance < currentResult.distance) {
            this.resetCounting();
            return;
        }
    };
    ElementPredictorImpl.prototype.resetCounting = function () {
        this.previousResult = undefined;
        this.sameResultCount = 0;
    };
    ElementPredictorImpl.prototype.count = function (currentResult) {
        this.previousResult = currentResult;
        this.sameResultCount++;
    };
    ElementPredictorImpl.prototype.isResultToGo = function () {
        return this.sameResultCount > 10;
    };
    ElementPredictorImpl.prototype.getElement = function (selector) {
        return document.querySelector(selector);
    };
    ElementPredictorImpl.prototype.isElementInTheViewPort = function (element) {
        var elementRect = element.getBoundingClientRect();
        return elementRect.top >= 0
            && elementRect.left >= 0
            && elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            && elementRect.right <= (window.innerWidth || document.documentElement.clientWidth);
    };
    ElementPredictorImpl.prototype.calculateDistance = function (event, element) {
        var elementRect = element.getBoundingClientRect();
        var elementX = elementRect.left + (elementRect.width / 2);
        var elementY = elementRect.top + (elementRect.height / 2);
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        return Math.floor(Math.sqrt(Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2)));
    };
    ElementPredictorImpl.prototype.registerDocumentListener = function () {
        document.addEventListener("mousemove", this.documentListener);
    };
    ElementPredictorImpl.prototype.deRegisterDocumentListener = function () {
        document.removeEventListener("mousemove", this.documentListener);
    };
    return ElementPredictorImpl;
}());
exports.default = new ElementPredictorImpl();
//# sourceMappingURL=index.js.map