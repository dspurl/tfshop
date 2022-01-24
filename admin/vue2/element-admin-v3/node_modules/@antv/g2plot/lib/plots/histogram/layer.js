"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var math_1 = require("../../util/math");
var layer_1 = tslib_1.__importDefault(require("../column/layer"));
var HistogramLayer = /** @class */ (function (_super) {
    tslib_1.__extends(HistogramLayer, _super);
    function HistogramLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'histogram';
        return _this;
    }
    HistogramLayer.prototype.init = function () {
        this.options.xField = 'range';
        this.options.yField = 'count';
        _super.prototype.init.call(this);
    };
    HistogramLayer.prototype.processData = function (originData) {
        var _this = this;
        var _a = this.options, binField = _a.binField, binWidth = _a.binWidth, binNumber = _a.binNumber;
        var originData_copy = util_1.clone(originData);
        // 根据binField value对源数据进行排序
        util_1.sortBy(originData_copy, binField);
        // 获取源数据binField values的range
        var values = util_1.valuesOfKey(originData_copy, binField);
        var range = util_1.getRange(values);
        var rangeWidth = range.max - range.min;
        // 计算分箱，直方图分箱的计算基于binWidth，如配置了binNumber则将其转为binWidth进行计算
        var _binWidth = binWidth;
        if (!binWidth && binNumber) {
            _binWidth = rangeWidth / binNumber;
        }
        // 当binWidth和binNumber都没有指定的情况，采用Sturges formula自动生成binWidth
        if (!binWidth && !binNumber) {
            var _defaultBinNumber = math_1.sturges(values);
            _binWidth = rangeWidth / _defaultBinNumber;
        }
        var bins = {};
        util_1.each(originData_copy, function (data) {
            var value = data[binField];
            var bin = _this.getBin(value, _binWidth);
            var binName = bin[0] + "-" + bin[1];
            if (!util_1.hasKey(bins, binName)) {
                bins[binName] = { name: binName, range: bin, count: 0, data: [] };
            }
            bins[binName].data.push(data);
            bins[binName].count += 1;
        });
        // 将分箱数据转换为plotData
        var plotData = [];
        util_1.each(bins, function (bin) {
            plotData.push(bin);
        });
        return plotData;
    };
    HistogramLayer.prototype.scale = function () {
        _super.prototype.scale.call(this);
        // fixme: 类型定义
        var range = this.config.scales.range;
        range.nice = false;
        range.type = 'linear';
    };
    HistogramLayer.prototype.getBin = function (value, binWidth) {
        var index = Math.floor(value / binWidth);
        return [binWidth * index, binWidth * (index + 1)];
    };
    return HistogramLayer;
}(layer_1.default));
exports.default = HistogramLayer;
global_1.registerPlotType('histogram', HistogramLayer);
//# sourceMappingURL=layer.js.map