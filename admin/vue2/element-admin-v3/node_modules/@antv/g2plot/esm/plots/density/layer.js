import { __extends } from "tslib";
import { getScale } from '@antv/scale';
import { clone, deepMix, sortBy, valuesOfKey, getRange, each } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { sturges } from '../../util/math';
import Area from '../area/layer';
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
    __extends(DensityLayer, _super);
    function DensityLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'density';
        return _this;
    }
    DensityLayer.prototype.init = function () {
        var originXAxisConfig = this.options.xAxis ? clone(this.options.xAxis) : {};
        this.options.xField = 'value';
        this.options.yField = 'density';
        this.options.xAxis = deepMix({}, originXAxisConfig, { type: 'linear' });
        this.options.smooth = true;
        _super.prototype.init.call(this);
    };
    DensityLayer.prototype.processData = function (originData) {
        var _this = this;
        var _a = this.options, binField = _a.binField, binWidth = _a.binWidth, binNumber = _a.binNumber, kernel = _a.kernel;
        var _kernel = kernel ? kernel : 'epanechnikov';
        var kernelFunc = kernels[_kernel];
        var originDataCopy = clone(originData);
        sortBy(originDataCopy, binField);
        // 计算分箱，直方图分箱的计算基于binWidth，如配置了binNumber则将其转为binWidth进行计算
        var values = valuesOfKey(originDataCopy, binField);
        var range = getRange(values);
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
            _binNumber = sturges(values);
            _binWidth = rangeWidth / binNumber;
        }
        // 根据binNumber获取samples
        var LinearScale = getScale('linear');
        var scale = new LinearScale({
            min: range.min,
            max: range.max,
            tickCount: _binNumber,
            nice: false,
        });
        var samples = scale.getTicks();
        // 计算KDE
        var densities = [];
        each(samples, function (s) {
            var density = _this.kernelDensityEstimator(_binWidth, kernelFunc, s, values);
            densities.push({ value: s.text, density: density });
        });
        return densities;
    };
    DensityLayer.prototype.kernelDensityEstimator = function (binWidth, kernelFunc, x, values) {
        var sum = 0;
        each(values, function (v) {
            var dist = (x.tickValue - v) / binWidth;
            sum += kernelFunc(dist);
        });
        return values.length === 0 ? 0 : sum / values.length;
    };
    return DensityLayer;
}(Area));
export default DensityLayer;
registerPlotType('density', DensityLayer);
//# sourceMappingURL=layer.js.map