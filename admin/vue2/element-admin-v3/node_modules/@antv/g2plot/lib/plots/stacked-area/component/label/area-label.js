"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var DEFAULT_SIZE = 12;
var TOLERANCE = 0.01;
var MAX_ITERATION = 100;
var MIN_HEIGHT = 12;
function getRange(points) {
    var maxHeight = -Infinity;
    var min = Infinity;
    var max = -Infinity;
    util_1.each(points, function (p) {
        min = Math.min(p.x, min);
        max = Math.max(p.x, max);
        var height = Math.abs(p.y[0] - p.y[1]);
        maxHeight = Math.max(maxHeight, height);
    });
    return {
        xRange: [min, max],
        maxHeight: maxHeight,
    };
}
function interpolateY(x, points, index) {
    var leftPoint = points[0];
    var rightPoint = points[points.length - 1];
    util_1.each(points, function (p) {
        if (p.x === x) {
            return p.y[index];
        }
        if (p.x < x && p.x > leftPoint.x) {
            leftPoint = p;
        }
        if (p.x > x && p.x < rightPoint.x) {
            rightPoint = p;
        }
    });
    var t = (x - leftPoint.x) / (rightPoint.x - leftPoint.x);
    return leftPoint.y[index] * (1 - t) + rightPoint.y[index] * t;
}
function getXIndex(data, x) {
    // tslint:disable-next-line: prefer-for-of
    var i;
    for (i = 0; i < data.length; i++) {
        var d = data[i];
        if (d.x === x || d.x > x) {
            break;
        }
    }
    return i;
}
var AreaLabel = /** @class */ (function () {
    function AreaLabel(cfg) {
        this.destroyed = false;
        this.scaleFactor = [];
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = util_1.deepMix(defaultOptions, cfg, {});
        this.init();
    }
    AreaLabel.prototype.init = function () {
        var _this = this;
        this.container = this.getGeometry().labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    AreaLabel.prototype.render = function () {
        var _this = this;
        var stackField = this.plot.options.stackField;
        var groupedPoints = this.getGeometry().dataArray;
        var labelPoints = [];
        util_1.each(groupedPoints, function (pointArray, name) {
            var labelPoint = _this.drawLabel(pointArray, name);
            if (labelPoint) {
                labelPoints.push(util_1.deepMix({}, pointArray[0], labelPoint));
                _this.scaleFactor.push(labelPoint.scaleFactor);
            }
        });
        var labelShapes = [];
        util_1.each(labelPoints, function (p, index) {
            var _a = _this.options, style = _a.style, offsetX = _a.offsetX, offsetY = _a.offsetY;
            var labelSize = _this.getFontSize(index);
            var formatter = _this.options.formatter;
            var content = formatter ? formatter(p._origin[stackField]) : p._origin[stackField];
            var text = _this.container.addShape('text', {
                attrs: util_1.deepMix({}, {
                    x: p.x + offsetX,
                    y: p.y + offsetY,
                    text: content,
                    fill: p.color,
                    fontSize: labelSize,
                    textAlign: 'center',
                    textBaseline: 'top',
                }, style),
                name: 'label',
            });
            labelShapes.push(text);
        });
        this.plot.canvas.draw();
    };
    AreaLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    AreaLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    AreaLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    AreaLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    AreaLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    AreaLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = util_1.clone(theme.label.style);
        labelStyle.stroke = null;
        delete labelStyle.fill;
        return {
            offsetX: 0,
            offsetY: 0,
            style: labelStyle,
            autoScale: true,
        };
    };
    AreaLabel.prototype.drawLabel = function (points, name) {
        var _a = getRange(points), xRange = _a.xRange, maxHeight = _a.maxHeight;
        // 根据area宽度在x方向各点间做插值
        var resolution = xRange[1] - xRange[0];
        var interpolatedPoints = this.getInterpolatedPoints(xRange[0], resolution, points);
        // 获取label的bbox
        var bbox = this.getLabelBbox(name);
        var fitOption = {
            xRange: xRange,
            aspect: bbox.width / bbox.height,
            data: interpolatedPoints,
            justTest: true,
        };
        var height = this.bisection(MIN_HEIGHT, maxHeight, this.testFit, fitOption, TOLERANCE, MAX_ITERATION);
        if (height === null) {
            return;
        }
        fitOption.justTest = false;
        var fit = this.testFit(fitOption);
        fit.x = fit.x;
        fit.y = fit.y0 + (fit.y1 - fit.y0) / 2;
        fit.scaleFactor = (height / bbox.height) * 0.2;
        return fit;
    };
    AreaLabel.prototype.getInterpolatedPoints = function (minX, resolution, points) {
        var interpolatedPoints = [];
        var step = 2;
        for (var i = minX; i < resolution; i += step) {
            var y0 = interpolateY(i, points, 0);
            var y1 = interpolateY(i, points, 1);
            interpolatedPoints.push({
                x: i,
                y: [y0, y1],
            });
        }
        return interpolatedPoints;
    };
    AreaLabel.prototype.bisection = function (min, max, test, testOption, tolerance, maxIteration) {
        for (var i = 0; i < maxIteration; i++) {
            var middle = (min + max) / 2;
            var options = testOption;
            options.height = middle;
            options.width = middle * options.aspect;
            var passesTest = test(options);
            var withinTolerance = (max - min) / 2 < tolerance;
            if (passesTest && withinTolerance) {
                return middle;
            }
            if (passesTest) {
                min = middle;
            }
            else {
                max = middle;
            }
        }
        return null;
    };
    AreaLabel.prototype.testFit = function (option) {
        var xRange = option.xRange, width = option.width, height = option.height, data = option.data, justTest = option.justTest;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var x0 = d.x;
            var x1 = x0 + width;
            if (x1 > xRange[1]) {
                break;
            }
            var x1_index = getXIndex(data, x1);
            var ceiling = -Infinity;
            var ceilingFloor = null; // 保存ceiling时对应的bottom位置，ceil和floor不一定是一对坐标
            var floor = Infinity;
            for (var j = i; j < x1_index; j++) {
                var top_1 = data[j].y[1];
                var bottom = data[j].y[0];
                if (bottom < floor) {
                    floor = bottom;
                }
                if (top_1 > ceiling) {
                    ceiling = top_1;
                    ceilingFloor = bottom;
                }
                if (floor - ceiling < height) {
                    break;
                }
            }
            if (floor - ceiling >= height) {
                if (justTest) {
                    return true;
                }
                return {
                    x: x0,
                    y0: ceiling,
                    y1: ceilingFloor,
                    width: width,
                    height: height,
                };
            }
        }
        return false;
    };
    AreaLabel.prototype.getLabelBbox = function (text) {
        var labelStyle = util_1.clone(this.plot.theme.label.textStyle);
        labelStyle.fontSize = DEFAULT_SIZE;
        var tShape = this.container.addShape('text', {
            attrs: tslib_1.__assign({ text: text, x: 0, y: 0 }, labelStyle),
        });
        var bbox = tShape.getBBox();
        tShape.remove();
        return bbox;
    };
    AreaLabel.prototype.getGeometry = function () {
        return util_1.find(this.view.geometries, function (geom) { return geom.type === 'area'; });
    };
    AreaLabel.prototype.getFontSize = function (index) {
        if (this.options.autoScale) {
            var scaleFactor = this.scaleFactor[index];
            return DEFAULT_SIZE * scaleFactor;
        }
        return DEFAULT_SIZE;
    };
    return AreaLabel;
}());
exports.default = AreaLabel;
//# sourceMappingURL=area-label.js.map