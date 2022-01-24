"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var scale_1 = require("@antv/scale");
var d3_regression_1 = require("d3-regression");
var path_1 = require("../../../util/path");
var REGRESSION_MAP = {
    exp: d3_regression_1.regressionExp,
    linear: d3_regression_1.regressionLinear,
    loess: d3_regression_1.regressionLoess,
    log: d3_regression_1.regressionLog,
    poly: d3_regression_1.regressionPoly,
    pow: d3_regression_1.regressionPow,
    quad: d3_regression_1.regressionQuad,
};
function se95(p, n) {
    return Math.sqrt((p * (1 - p)) / n) * 1.96;
}
var TrendLine = /** @class */ (function () {
    function TrendLine(cfg) {
        var defaultOptions = {
            type: 'linear',
            style: {
                stroke: '#9ba29a',
                lineWidth: 2,
                opacity: 0.5,
                lineJoin: 'round',
                lineCap: 'round',
            },
            showConfidence: false,
            confidenceStyle: {
                fill: '#ccc',
                opacity: 0.1,
            },
        };
        this.options = util_1.deepMix({}, defaultOptions, cfg);
        this.view = this.options.view;
        this.init();
    }
    TrendLine.prototype.init = function () {
        // 处理数据
        var _a = this.options.plotOptions, xField = _a.xField, yField = _a.yField, data = _a.data;
        var reg = REGRESSION_MAP[this.options.type]()
            .x(function (d) { return d[xField]; })
            .y(function (d) { return d[yField]; });
        this.data = this.processData(reg(data));
        // 创建container
        this.container = this.view.backgroundGroup.addGroup();
    };
    TrendLine.prototype.render = function () {
        var xscale_view = this.view.getScaleByField(this.options.plotOptions.xField);
        var yscale_view = this.view.getScaleByField(this.options.plotOptions.yField);
        var coord = this.view.getCoordinate();
        var trendlineData = this.data.trendlineData;
        // 创建图形绘制的scale
        var LinearScale = scale_1.getScale('linear');
        var xRange = this.adjustScale(xscale_view, trendlineData, 'x');
        var xScale = new LinearScale({
            min: xRange.min,
            max: xRange.max,
        });
        var yRange = this.adjustScale(yscale_view, trendlineData, 'y');
        var yScale = new LinearScale({
            min: yRange.min,
            max: yRange.max,
        });
        // 绘制置信区间曲线
        if (this.options.showConfidence) {
            var confidencePath = this.getConfidencePath(xScale, yScale, coord);
            this.container.addShape('path', {
                attrs: tslib_1.__assign({ path: confidencePath }, this.options.confidenceStyle),
                name: 'confidence',
            });
        }
        // 绘制trendline
        var points = this.getTrendlinePoints(xScale, yScale, coord);
        var constraint = [
            [0, 0],
            [1, 1],
        ];
        var path = path_1.getSplinePath(points, false, constraint);
        this.shape = this.container.addShape('path', {
            attrs: tslib_1.__assign({ path: path }, this.options.style),
            name: 'trendline',
        });
    };
    TrendLine.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    TrendLine.prototype.destroy = function () {
        if (this.container) {
            this.container.destroy();
        }
    };
    TrendLine.prototype.processData = function (data) {
        var trendline = [];
        var confidence = [];
        util_1.each(data, function (d) {
            trendline.push({ x: d[0], y: d[1] });
            var conf = se95(data.rSquared, d[1]);
            confidence.push({ x: d[0], y0: d[1] - conf, y1: d[1] + conf });
        });
        return { trendlineData: trendline, confidenceData: confidence };
    };
    TrendLine.prototype.getTrendlinePoints = function (xScale, yScale, coord) {
        var points = [];
        util_1.each(this.data.trendlineData, function (d) {
            var xRatio = xScale.scale(d.x);
            var yRatio = yScale.scale(d.y);
            var x = coord.start.x + coord.width * xRatio;
            var y = coord.start.y - coord.height * yRatio;
            points.push({ x: x, y: y });
        });
        return points;
    };
    TrendLine.prototype.getConfidencePath = function (xScale, yScale, coord) {
        var upperPoints = [];
        var lowerPoints = [];
        var path = [];
        util_1.each(this.data.confidenceData, function (d) {
            var xRatio = xScale.scale(d.x);
            var y0Ratio = yScale.scale(d.y0);
            var y1Ratio = yScale.scale(d.y1);
            var x = coord.start.x + coord.width * xRatio;
            var y0 = coord.start.y - coord.height * y0Ratio;
            var y1 = coord.start.y - coord.height * y1Ratio;
            upperPoints.push({ x: x, y: y0 });
            lowerPoints.push({ x: x, y: y1 });
        });
        for (var i = 0; i < upperPoints.length; i++) {
            var flag = i === 0 ? 'M' : 'L';
            var p = upperPoints[i];
            if (!isNaN(p.x) && !isNaN(p.y)) {
                path.push([flag, p.x, p.y]);
            }
        }
        for (var j = lowerPoints.length - 1; j > 0; j--) {
            var p = lowerPoints[j];
            if (!isNaN(p.x) && !isNaN(p.y)) {
                path.push(['L', p.x, p.y]);
            }
        }
        return path;
    };
    TrendLine.prototype.adjustScale = function (viewScale, trendlineData, dim) {
        // 处理用户自行配置min max的情况
        var min = viewScale.min, max = viewScale.max;
        var _a = this.options.plotOptions, data = _a.data, xField = _a.xField, yField = _a.yField;
        var field = dim === 'x' ? xField : yField;
        var dataMin = util_1.minBy(data, field)[field];
        var dataMax = util_1.maxBy(data, field)[field];
        var minRatio = (min - dataMin) / (dataMax - dataMin);
        var maxRatio = (max - dataMax) / (dataMax - dataMin);
        var trendMin = util_1.minBy(trendlineData, dim)[dim];
        var trendMax = util_1.maxBy(trendlineData, dim)[dim];
        return {
            min: trendMin + minRatio * (trendMax - trendMin),
            max: trendMax + maxRatio * (trendMax - trendMin),
        };
    };
    return TrendLine;
}());
exports.default = TrendLine;
//# sourceMappingURL=trendline.js.map