"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var scale_1 = require("@antv/scale");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var math_1 = require("../../util/math");
var layer_1 = tslib_1.__importDefault(require("../area/layer"));
var kernels = {
    epanechnikov: function (dist) {
        return Math.abs(dist) <= 1 ? 0.75 * (1 - dist * dist) : 0;
    },
    gaussian: function (dist) {
        return (1 / Math.sqrt(Math.PI * 2)) * Math.exp(-0.5 * Math.pow(dist, 2));
    },
    uniform: function (dist) {
        return Math.abs(dist) <= 1 ? 0.5 : 0;
    },
    triangle: function (dist) {
        return Math.abs(dist) <= 1 ? 1 - Math.abs(dist) : 0;
    },
    quartic: function (dist) {
        var v = 1 - dist * dist;
        return Math.abs(dist) <= 1 ? (15 / 16) * v * v : 0;
    },
    triweight: function (dist) {
        var v = 1 - dist * dist;
        return Math.abs(dist) <= 1 ? (15 / 16) * Math.pow(v, 3) : 0;
    },
    cosinus: function (dist) {
        var v = (Math.PI / 4) * Math.cos(0.5 * Math.PI * dist);
        return Math.abs(dist) <= 1 ? v : 0;
    },
};
var DensityLayer = /** @class */ (function (_super) {
    tslib_1.__extends(DensityLayer, _super);
    function DensityLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'density';
        return _this;
    }
    DensityLayer.prototype.init = function () {
        var originXAxisConfig = this.options.xAxis ? util_1.clone(this.options.xAxis) : {};
        this.options.xField = 'value';
        this.options.yField = 'density';
        this.options.xAxis = util_1.deepMix({}, originXAxisConfig, { type: 'linear' });
        this.options.smooth = true;
        _super.prototype.init.call(this);
    };
    DensityLayer.prototype.processData = function (originData) {
        var _this = this;
        var _a = this.options, binField = _a.binField, binWidth = _a.binWidth, binNumber = _a.binNumber, kernel = _a.kernel;
        var _kernel = kernel ? kernel : 'epanechnikov';
        var kernelFunc = kernels[_kernel];
        var originDataCopy = util_1.clone(originData);
        util_1.sortBy(originDataCopy, binField);
        // 计算分箱，直方图分箱的计算基于binWidth，如配置了binNumber则将其转为binWidth进行计算
        var values = util_1.valuesOfKey(originDataCopy, binField);
        var range = util_1.getRange(values);
        var rangeWidth = range.max - range.min;
        var _binNumber = binNumber;
        var _binWidth = binWidth;
        if (!binNumber && binWidth) {
            _binNumber = Math.floor(rangeWidth / binWidth);
        }
        if (!binWidth && binNumber) {
            _binWidth = rangeWidth / binNumber;
        }
        // 当binWidth和binNumber都没有指定的情况，采用Sturges formula自动生成binWidth
        if (!binNumber && !binWidth) {
            _binNumber = math_1.sturges(values);
            _binWidth = rangeWidth / binNumber;
        }
        // 根据binNumber获取samples
        var LinearScale = scale_1.getScale('linear');
        var scale = new LinearScale({
            min: range.min,
            max: range.max,
            tickCount: _binNumber,
            nice: false,
        });
        var samples = scale.getTicks();
        // 计算KDE
        var densities = [];
        util_1.each(samples, function (s) {
            var density = _this.kernelDensityEstimator(_binWidth, kernelFunc, s, values);
            densities.push({ value: s.text, density: density });
        });
        return densities;
    };
    DensityLayer.prototype.kernelDensityEstimator = function (binWidth, kernelFunc, x, values) {
        var sum = 0;
        util_1.each(values, function (v) {
            var dist = (x.tickValue - v) / binWidth;
            sum += kernelFunc(dist);
        });
        return values.length === 0 ? 0 : sum / values.length;
    };
    return DensityLayer;
}(layer_1.default));
exports.default = DensityLayer;
global_1.registerPlotType('density', DensityLayer);
//# sourceMappingURL=layer.js.map