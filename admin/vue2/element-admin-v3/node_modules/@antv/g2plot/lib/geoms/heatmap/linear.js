"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dependents_1 = require("../../dependents");
var util_1 = require("@antv/util");
var colorUtil = tslib_1.__importStar(require("../../util/color"));
var GAUSS_COEF = 0.3989422804014327;
var ZERO = 1.0 / 255.0 / 16.0;
var ORIGIN_FIELD = '_origin';
var LinearHeatmap = /** @class */ (function (_super) {
    tslib_1.__extends(LinearHeatmap, _super);
    function LinearHeatmap(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'heatmap';
        _this.paletteCache = {};
        _this.intensity = cfg.intensity;
        _this.radius = cfg.radius;
        return _this;
    }
    LinearHeatmap.prototype.createElements = function (mappingData /*index: number, isUpdate: boolean = false*/) {
        var range = this.prepareRange(mappingData);
        this.prepareSize();
        this.prepareBlur();
        this.prepareGreyScaleBlurredCircle(this.radius);
        this.drawWithRange(mappingData, range);
        return null;
    };
    LinearHeatmap.prototype.clear = function () {
        this.clearShadowCanvasCtx();
        _super.prototype.clear.call(this);
    };
    LinearHeatmap.prototype.prepareRange = function (data) {
        var colorAttr = this.getAttribute('color');
        var colorField = colorAttr.getFields()[0];
        var min = Infinity;
        var max = -Infinity;
        data.forEach(function (row) {
            var value = row[ORIGIN_FIELD][colorField];
            if (value > max) {
                max = value;
            }
            if (value < min) {
                min = value;
            }
        });
        if (min === max) {
            min = max - 1;
        }
        return [min, max];
    };
    LinearHeatmap.prototype.prepareSize = function () {
        var radius = this.radius;
        if (!this.radius) {
            radius = this.getDefaultValue('size');
            if (!util_1.isNumber(radius)) {
                radius = this.getDefaultSize();
            }
            this.radius = radius;
        }
    };
    LinearHeatmap.prototype.prepareBlur = function () {
        var blur = util_1.get(this.styleOption, ['style', 'shadowBlur']);
        if (!util_1.isNumber(blur)) {
            blur = this.radius / 2;
        }
        this.blur = blur;
    };
    LinearHeatmap.prototype.getDefaultSize = function () {
        var position = this.getAttribute('position');
        var coord = this.coordinate;
        var radius = Math.min(coord.getWidth() / (position.scales[0].ticks.length * 4), coord.getHeight() / (position.scales[1].ticks.length * 4));
        return radius;
    };
    LinearHeatmap.prototype.colorize = function (img) {
        var colorAttr = this.getAttribute('color');
        var pixels = img.data;
        var paletteCache = this.paletteCache;
        for (var i = 3; i < pixels.length; i += 4) {
            var alpha = pixels[i]; // get gradient color from opacity value
            if (alpha) {
                var palette = void 0;
                if (paletteCache[alpha]) {
                    palette = paletteCache[alpha];
                }
                else {
                    palette = colorUtil.rgb2arr(colorAttr.gradient(alpha / 256));
                    paletteCache[alpha] = palette;
                }
                // const palette = colorUtil.rgb2arr(colorAttr.gradient(alpha / 256));
                pixels[i - 3] = palette[0];
                pixels[i - 2] = palette[1];
                pixels[i - 1] = palette[2];
                pixels[i] = alpha;
            }
        }
    };
    LinearHeatmap.prototype.prepareGreyScaleBlurredCircle = function (r) {
        var circleCanvas = this.grayScaleCanvas;
        if (!circleCanvas) {
            circleCanvas = document.createElement('canvas');
            this.grayScaleCanvas = circleCanvas;
        }
        var intensity = this.intensity ? this.intensity : 2;
        var circleRadius = (Math.sqrt(-2.0 * Math.log(ZERO / r / intensity / GAUSS_COEF)) / 3.0) * r;
        var blur = circleRadius - r;
        var r2 = circleRadius + blur;
        var ctx = circleCanvas.getContext('2d');
        circleCanvas.width = circleCanvas.height = r2 * 2;
        ctx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    LinearHeatmap.prototype.drawGrayScaleBlurredCircle = function (x, y, r, alpha, ctx) {
        var circleCanvas = this.grayScaleCanvas;
        ctx.globalAlpha = alpha;
        ctx.drawImage(circleCanvas, x - r, y - r);
    };
    LinearHeatmap.prototype.getShadowCanvasCtx = function () {
        var canvas = this.shadowCanvas;
        if (!canvas) {
            canvas = document.createElement('canvas');
            this.shadowCanvas = canvas;
        }
        canvas.width = this.coordinate.getWidth();
        canvas.height = this.coordinate.getHeight();
        var context = canvas.getContext('2d');
        context.globalCompositeOperation = 'lighter';
        return context;
    };
    LinearHeatmap.prototype.clearShadowCanvasCtx = function () {
        var ctx = this.getShadowCanvasCtx();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    LinearHeatmap.prototype.getImageShape = function () {
        var imageShape = this.imageShape;
        if (imageShape) {
            return imageShape;
        }
        var container = this.container;
        imageShape = container.addShape({
            type: 'image',
            attrs: {},
        });
        this.imageShape = imageShape;
    };
    LinearHeatmap.prototype.drawWithRange = function (data, range) {
        // canvas size
        var _a = this.coordinate, start = _a.start, end = _a.end;
        var width = this.coordinate.getWidth();
        var height = this.coordinate.getHeight();
        // value, range, etc
        var colorAttr = this.getAttribute('color');
        var valueField = colorAttr.getFields()[0];
        // prepare shadow canvas context
        this.clearShadowCanvasCtx();
        var ctx = this.getShadowCanvasCtx();
        // filter data
        if (range) {
            data = data.filter(function (row) {
                return row[ORIGIN_FIELD][valueField] <= range[1] && row[ORIGIN_FIELD][valueField] >= range[0];
            });
        }
        // step1. draw points with shadow
        var scale = this.scales[valueField];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var cfg = this.getDrawCfg(obj);
            var alpha = scale.scale(obj[ORIGIN_FIELD][valueField]);
            // @ts-ignore
            this.drawGrayScaleBlurredCircle(cfg.x - start.x, cfg.y - end.y, this.radius + this.blur, alpha, ctx);
        }
        // step2. convert pixels
        var colored = ctx.getImageData(0, 0, width, height);
        this.clearShadowCanvasCtx();
        this.colorize(colored);
        ctx.putImageData(colored, 0, 0);
        var image = new Image();
        image.src = ctx.canvas.toDataURL('image/png');
        this.getImageShape();
        this.imageShape.attr('x', start.x);
        this.imageShape.attr('y', end.y);
        this.imageShape.attr('width', width);
        this.imageShape.attr('height', height);
        this.imageShape.attr('img', ctx.canvas);
        this.imageShape.set('origin', this.getShapeInfo(data)); // 存储绘图信息数据
    };
    LinearHeatmap.prototype.getShapeInfo = function (mappingData) {
        var shapeCfg = this.getDrawCfg(mappingData[0]);
        return tslib_1.__assign(tslib_1.__assign({}, shapeCfg), { mappingData: mappingData, data: this.getData(mappingData) });
    };
    LinearHeatmap.prototype.getData = function (mappingData) {
        return mappingData.map(function (obj) {
            return obj[ORIGIN_FIELD];
        });
    };
    return LinearHeatmap;
}(dependents_1.Geometry));
dependents_1.registerGeometry('linearHeatmap', LinearHeatmap);
//# sourceMappingURL=linear.js.map