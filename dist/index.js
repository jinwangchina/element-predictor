"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ElementPredictorImpl = /** @class */ (function () {
    function ElementPredictorImpl() {
        this.confidentDistance = 200;
        this.confidentResultCount = 10;
        this.sameResultCount = 0;
    }
    ElementPredictorImpl.prototype.setup = function (param) {
        this.destroy();
        this.elementSelectors = param.elementSelectors;
        this.handler = param.handler;
        if (param.confidentDistance) {
            this.confidentDistance = param.confidentDistance;
        }
        if (param.confidentResultCount) {
            this.confidentResultCount = param.confidentResultCount;
        }
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
            _this.handler(result);
        };
    };
    ElementPredictorImpl.prototype.predictResult = function (event) {
        var currentResult = this.getClosest(event);
        this.checkAndCount(currentResult);
        if (this.isResultToGo(currentResult)) {
            return currentResult;
        }
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
        if (!currentResult
            // reset if the closest element is changed
            || (this.previousResult && this.previousResult.element !== currentResult.element)
            // reset if mouse is moving away from the current element
            || (this.previousResult && this.previousResult.distance < currentResult.distance)) {
            this.resetCounting();
            return;
        }
        this.count(currentResult);
    };
    ElementPredictorImpl.prototype.resetCounting = function () {
        this.previousResult = undefined;
        this.sameResultCount = 0;
    };
    ElementPredictorImpl.prototype.count = function (currentResult) {
        this.previousResult = currentResult;
        this.sameResultCount++;
    };
    ElementPredictorImpl.prototype.isResultToGo = function (currentResult) {
        return this.sameResultCount > this.confidentResultCount
            && currentResult.distance < this.confidentDistance;
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
        var mouseX = event.clientX;
        var mouseY = event.clientY;
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