"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var animate_1 = require("@antv/g2/lib/animate");
var util_1 = require("@antv/util");
function parsePoints(shape, coord) {
    var parsedPoints = [];
    var points = shape.get('origin').points;
    util_1.each(points, function (p) {
        parsedPoints.push(coord.convertPoint(p));
    });
    return parsedPoints;
}
var ConversionTag = /** @class */ (function () {
    function ConversionTag(cfg) {
        // @ts-ignore
        util_1.deepMix(this, this.constructor.getDefaultOptions(cfg), cfg);
        this._init();
    }
    ConversionTag.getDefaultOptions = function (_a) {
        var transpose = _a.transpose;
        return {
            visible: true,
            size: transpose ? 32 : 80,
            spacing: transpose ? 8 : 12,
            offset: transpose ? 32 : 0,
            arrow: {
                visible: true,
                headSize: 12,
                style: {
                    fill: 'rgba(0, 0, 0, 0.05)',
                },
            },
            value: {
                visible: true,
                style: {
                    fontSize: 12,
                    fill: 'rgba(0, 0, 0, 0.85)',
                },
                formatter: function (valueUpper, valueLower) { return ((100 * valueLower) / valueUpper).toFixed(2) + "%"; },
            },
            animation: util_1.deepMix({}, animate_1.DEFAULT_ANIMATE_CFG),
        };
    };
    ConversionTag.prototype._init = function () {
        var _this = this;
        var layer = this.view.backgroundGroup;
        this.container = layer.addGroup();
        this.draw();
        this.view.on('beforerender', function () {
            _this.clear();
        });
    };
    ConversionTag.prototype.draw = function () {
        var _this = this;
        var transpose = this.transpose;
        var values = this.view.getScaleByField(this.field).values;
        var geometry = this.view.geometries[0];
        var shapes = geometry.getShapes();
        var shapeLower, valueLower, shapeUpper, valueUpper;
        if (transpose) {
            shapes.forEach(function (shapeLower, i) {
                valueLower = values[i];
                if (i++ > 0) {
                    _this._drawTag(shapeUpper, valueUpper, shapeLower, valueLower);
                }
                valueUpper = valueLower;
                shapeUpper = shapeLower;
            });
        }
        else {
            shapes.forEach(function (shapeUpper, i) {
                valueUpper = values[i];
                if (i++ > 0) {
                    _this._drawTag(shapeUpper, valueUpper, shapeLower, valueLower);
                }
                valueLower = valueUpper;
                shapeLower = shapeUpper;
            });
        }
    };
    ConversionTag.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    ConversionTag.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
    };
    ConversionTag.prototype._drawTag = function (shapeUpper, valueUpper, shapeLower, valueLower) {
        var transpose = this.transpose;
        var coord = this.view.geometries[0].coordinate;
        var pointUpper = parsePoints(shapeUpper, coord)[transpose ? 3 : 0];
        var pointLower = parsePoints(shapeLower, coord)[transpose ? 0 : 3];
        this._drawTagArrow(pointUpper, pointLower);
        this._drawTagValue(pointUpper, valueUpper, pointLower, valueLower);
    };
    ConversionTag.prototype._drawTagArrow = function (pointUpper, pointLower) {
        var spacing = this.spacing;
        var _a = this, size = _a.size, offset = _a.offset, animation = _a.animation, transpose = _a.transpose;
        var headSize = this.arrow.headSize;
        var totalHeight = pointLower.y - pointUpper.y;
        var totalWidth = pointLower.x - pointUpper.x;
        var points;
        if (transpose) {
            if ((totalWidth - headSize) / 2 < spacing) {
                // 当柱间距不足容纳箭头尖与间隔时，画三角并挤占间隔
                spacing = Math.max(1, (totalWidth - headSize) / 2);
                points = [
                    [pointUpper.x + spacing, pointUpper.y - offset],
                    [pointUpper.x + spacing, pointUpper.y - offset - size],
                    [pointLower.x - spacing, pointLower.y - offset - size / 2],
                ];
            }
            else {
                // 当柱间距足够时，画完整图形并留出间隔。
                points = [
                    [pointUpper.x + spacing, pointUpper.y - offset],
                    [pointUpper.x + spacing, pointUpper.y - offset - size],
                    [pointLower.x - spacing - headSize, pointLower.y - offset - size],
                    [pointLower.x - spacing, pointLower.y - offset - size / 2],
                    [pointLower.x - spacing - headSize, pointLower.y - offset],
                ];
            }
        }
        else {
            if ((totalHeight - headSize) / 2 < spacing) {
                // 当柱间距不足容纳箭头尖与间隔时，画三角并挤占间隔
                spacing = Math.max(1, (totalHeight - headSize) / 2);
                points = [
                    [pointUpper.x + offset, pointUpper.y + spacing],
                    [pointUpper.x + offset + size, pointUpper.y + spacing],
                    [pointLower.x + offset + size / 2, pointLower.y - spacing],
                ];
            }
            else {
                // 当柱间距足够时，画完整图形并留出间隔。
                points = [
                    [pointUpper.x + offset, pointUpper.y + spacing],
                    [pointUpper.x + offset + size, pointUpper.y + spacing],
                    [pointLower.x + offset + size, pointLower.y - spacing - headSize],
                    [pointLower.x + offset + size / 2, pointLower.y - spacing],
                    [pointLower.x + offset, pointLower.y - spacing - headSize],
                ];
            }
        }
        var tagArrow = this.container.addShape('polygon', {
            name: 'arrow',
            attrs: tslib_1.__assign(tslib_1.__assign({}, this.arrow.style), { points: points }),
        });
        if (animation !== false) {
            this._fadeInTagShape(tagArrow);
        }
    };
    ConversionTag.prototype._drawTagValue = function (pointUpper, valueUpper, pointLower, valueLower) {
        var _a = this, size = _a.size, offset = _a.offset, animation = _a.animation, transpose = _a.transpose;
        var text = this.value.formatter(valueUpper, valueLower);
        var tagValue = this.container.addShape('text', {
            name: 'value',
            attrs: tslib_1.__assign(tslib_1.__assign({}, this.value.style), { text: text, x: transpose ? (pointUpper.x + pointLower.x) / 2 : pointUpper.x + offset + size / 2, y: transpose ? pointUpper.y - offset - size / 2 : (pointUpper.y + pointLower.y) / 2, textAlign: 'center', textBaseline: 'middle' }),
        });
        if (transpose) {
            var totalWidth = pointLower.x - pointUpper.x;
            var textWidth = tagValue.getBBox().width;
            if (textWidth > totalWidth) {
                var cWidth = textWidth / text.length;
                var cEnd = Math.max(1, Math.ceil(totalWidth / cWidth) - 1);
                var textAdjusted = text.slice(0, cEnd) + "...";
                tagValue.attr('text', textAdjusted);
            }
        }
        if (animation !== false) {
            this._fadeInTagShape(tagValue);
        }
    };
    ConversionTag.prototype._fadeInTagShape = function (shape) {
        var animation = this.animation;
        var opacity = shape.attr('opacity');
        shape.attr('opacity', 0);
        var duration = util_1.get(animation, 'appear', animate_1.DEFAULT_ANIMATE_CFG.appear).duration;
        shape.animate({ opacity: opacity }, duration);
    };
    return ConversionTag;
}());
exports.default = ConversionTag;
//# sourceMappingURL=conversion-tag.js.map