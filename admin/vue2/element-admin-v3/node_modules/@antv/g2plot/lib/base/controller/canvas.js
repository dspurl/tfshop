"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_util_1 = require("@antv/dom-util");
var dependents_1 = require("../../dependents");
var util_1 = require("@antv/util");
var resize_observer_polyfill_1 = tslib_1.__importDefault(require("resize-observer-polyfill"));
var global_1 = require("../../theme/global");
var theme_1 = tslib_1.__importDefault(require("./theme"));
/**
 * Canvas controller
 * 1. create G.Canvas, destroy G.Canvas
 * 2. process auto fit container
 * 3. API for G.Canvas
 */
var CanvasController = /** @class */ (function () {
    function CanvasController(cfg) {
        var _this = this;
        /**
         * when the container size changed, trigger it after 300ms.
         */
        this.onResize = util_1.debounce(function () {
            if (_this.plot.destroyed) {
                return;
            }
            var _a = _this.getCanvasSize(), width = _a.width, height = _a.height;
            /** height measure不准导致重复 forceFit */
            if (_this.width === width && _this.height === height) {
                return;
            }
            // got new width, height, re-render the plot
            _this.width = width;
            _this.height = height;
            _this.plot.updateConfig({ width: width, height: height });
            _this.plot.render();
        }, 300);
        var containerDOM = cfg.containerDOM, plot = cfg.plot;
        this.containerDOM = containerDOM;
        this.plot = plot;
        this.init();
    }
    /**
     * get canvas size from props.
     * @returns the width, height of canvas
     */
    CanvasController.prototype.getCanvasSize = function () {
        var theme = global_1.getGlobalTheme();
        var width = this.plot.width ? this.plot.width : theme.width;
        var height = this.plot.height ? this.plot.height : theme.height;
        // if forceFit = true, then use the container's size as default.
        if (this.plot.forceFit) {
            width = this.containerDOM.offsetWidth ? this.containerDOM.offsetWidth : width;
            height = this.containerDOM.offsetHeight ? this.containerDOM.offsetHeight : height;
        }
        return { width: width, height: height };
    };
    /**
     * get the canvas dom
     * @returns Canvas DOM
     */
    CanvasController.prototype.getCanvasDOM = function () {
        return this.canvas.get('container');
    };
    /**
     * update the plot size
     */
    CanvasController.prototype.updateCanvasSize = function () {
        var _a = this.getCanvasSize(), width = _a.width, height = _a.height;
        this.width = width;
        this.height = height;
        this.canvas.changeSize(width, height);
        // this.plot.updateRange();
    };
    /**
     * 根据主题调整canvas样式
     */
    CanvasController.prototype.updateCanvasTheme = function () {
        var theme = this.plot.theme;
        var globalTheme = theme_1.default.getGlobalTheme(theme);
        var fill = util_1.get(globalTheme, 'backgroundStyle.fill');
        if (fill) {
            this.updateCanvasStyle({
                backgroundColor: fill,
            });
        }
    };
    /**
     * update the canvas dom styles
     * @param styles
     */
    CanvasController.prototype.updateCanvasStyle = function (styles) {
        // 修改容器的样式
        dom_util_1.modifyCSS(this.getCanvasDOM(), styles);
        // 修改 canvas 的样式
        dom_util_1.modifyCSS(this.canvas.get('el'), {
            display: 'inline-block',
            verticalAlign: 'middle',
        });
    };
    /**
     * destroy the plot, remove resize event.
     */
    CanvasController.prototype.destroy = function () {
        // remove event
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.containerDOM);
            this.resizeObserver.disconnect();
            this.containerDOM = null;
        }
        // remove G.Canvas
        this.canvas.destroy();
    };
    /**
     * when forceFit = true, then bind the event to listen the container size change
     */
    CanvasController.prototype.bindForceFit = function () {
        var forceFit = this.plot.forceFit;
        // use ResizeObserver to listen the container size change.
        if (forceFit) {
            this.resizeObserver = new resize_observer_polyfill_1.default(this.onResize);
            this.resizeObserver.observe(this.containerDOM);
        }
    };
    /**
     * init life circle
     */
    CanvasController.prototype.init = function () {
        this.initGCanvas();
        this.bindForceFit();
        // 追加容器的 css 样式，防止 tooltip 的位置参考点不正确
        this.updateCanvasStyle({ position: 'relative' });
    };
    /**
     * init G.Canvas instance
     */
    CanvasController.prototype.initGCanvas = function () {
        /** 创建canvas */
        var _a = this.plot, _b = _a.renderer, renderer = _b === void 0 ? 'canvas' : _b, pixelRatio = _a.pixelRatio, _c = _a.localRefresh, localRefresh = _c === void 0 ? false : _c;
        var _d = this.getCanvasSize(), width = _d.width, height = _d.height;
        var G = renderer === 'canvas' ? dependents_1.Canvas : dependents_1.SVG;
        this.canvas = new G({
            localRefresh: localRefresh,
            container: this.containerDOM,
            width: width,
            height: height,
            pixelRatio: pixelRatio,
        });
        this.width = width;
        this.height = height;
        this.updateCanvasTheme();
    };
    return CanvasController;
}());
exports.default = CanvasController;
//# sourceMappingURL=canvas.js.map