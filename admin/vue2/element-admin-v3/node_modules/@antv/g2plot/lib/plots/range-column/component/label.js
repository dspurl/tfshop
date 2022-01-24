"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var color_1 = require("../../../util/color");
var bbox_1 = tslib_1.__importDefault(require("../../../util/bbox"));
var DEFAULT_OFFSET = 8;
function mappingColor(band, gray) {
    var reflect;
    util_1.each(band, function (b) {
        var map = b;
        if (gray >= map.from && gray < map.to) {
            reflect = map.color;
        }
    });
    return reflect;
}
var RangeColumnLabel = /** @class */ (function () {
    function RangeColumnLabel(cfg) {
        this.destroyed = false;
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = util_1.deepMix(defaultOptions, cfg, {});
        if (!this.options.topStyle) {
            this.options.topStyle = this.options.style;
        }
        if (!this.options.bottomStyle) {
            this.options.bottomStyle = this.options.style;
        }
        this.init();
    }
    RangeColumnLabel.prototype.init = function () {
        var _this = this;
        this.container = this.getGeometry().labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    RangeColumnLabel.prototype.render = function () {
        var _this = this;
        var _a = this.getGeometry(), coordinate = _a.coordinate, elements = _a.elements;
        this.coord = coordinate;
        util_1.each(elements, function (ele) {
            var shape = ele.shape;
            var positions = _this.getPosition(shape);
            var values = _this.getValue(shape);
            var textBaeline = _this.getTextBaseline();
            var labels = [];
            util_1.each(positions, function (pos, i) {
                var style = i === 1 ? _this.options.topStyle : _this.options.bottomStyle;
                var color = _this.getTextColor(shape, i);
                if (_this.options.position === 'inner' && _this.options.adjustColor && color !== 'black') {
                    style.stroke = null;
                }
                var formatter = _this.options.formatter;
                var content = formatter ? formatter(values[i]) : values[i];
                var label = _this.container.addShape('text', {
                    attrs: util_1.deepMix({}, style, {
                        x: pos.x,
                        y: pos.y,
                        text: content,
                        fill: color,
                        textAlign: 'center',
                        textBaseline: textBaeline[i],
                    }),
                    name: 'label',
                });
                labels.push(label);
                _this.doAnimation(label);
            });
            shape.set('labelShapes', labels);
            _this.adjustPosition(labels[0], labels[1], shape);
        });
        this.plot.canvas.draw();
    };
    RangeColumnLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    RangeColumnLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    RangeColumnLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    RangeColumnLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    RangeColumnLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    RangeColumnLabel.prototype.getShapeBbox = function (shape) {
        var _this = this;
        var points = [];
        util_1.each(shape.get('origin').points, function (p) {
            points.push(_this.coord.convertPoint(p));
        });
        var bbox = new bbox_1.default(points[0].x, points[1].y, Math.abs(points[2].x - points[0].x), Math.abs(points[0].y - points[1].y));
        return bbox;
    };
    RangeColumnLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            position: 'outer',
            offsetX: 0,
            offsetY: DEFAULT_OFFSET,
            style: util_1.clone(labelStyle),
            adjustColor: true,
            adjustPosition: true,
        };
    };
    RangeColumnLabel.prototype.getPosition = function (shape) {
        var bbox = this.getShapeBbox(shape);
        var minX = bbox.minX, minY = bbox.minY, maxY = bbox.maxY, width = bbox.width;
        var offsetY = this.options.offsetY;
        var x = minX + width / 2;
        var y1, y2;
        if (this.options.position === 'outer') {
            y1 = minY - offsetY;
            y2 = maxY + offsetY;
        }
        else {
            y1 = minY + offsetY;
            y2 = maxY - offsetY;
        }
        return [
            { x: x, y: y2 },
            { x: x, y: y1 },
        ];
    };
    RangeColumnLabel.prototype.getValue = function (shape) {
        var yField = this.plot.options.yField;
        return shape.get('origin').data[yField];
    };
    RangeColumnLabel.prototype.getTextBaseline = function () {
        if (this.options.position === 'outer') {
            return ['top', 'bottom'];
        }
        else {
            return ['bottom', 'top'];
        }
    };
    RangeColumnLabel.prototype.getTextColor = function (shape, index) {
        if (this.options.adjustColor && this.options.position === 'inner') {
            var shapeColor = shape.attr('fill');
            var shapeOpacity = shape.attr('opacity') ? shape.attr('opacity') : 1;
            var rgb = color_1.rgb2arr(shapeColor);
            var gray = Math.round(rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / shapeOpacity;
            var colorBand = [
                { from: 0, to: 85, color: 'white' },
                { from: 85, to: 170, color: '#F6F6F6' },
                { from: 170, to: 255, color: 'black' },
            ];
            var reflect = mappingColor(colorBand, gray);
            return reflect;
        }
        var defaultColor = index === 1 ? this.options.topStyle.fill : this.options.bottomStyle.fill;
        return defaultColor;
    };
    RangeColumnLabel.prototype.doAnimation = function (label) {
        if (this.plot.animation && this.plot.animation === false) {
            return;
        }
        label.attr('fillOpacity', 0);
        label.attr('strokeOpacity', 0);
        label.stopAnimate();
        label.animate({
            fillOpacity: 1,
            strokeOpacity: 1,
        }, 800, 'easeLinear', 500);
    };
    RangeColumnLabel.prototype.adjustPosition = function (la, lb, shape) {
        var origin = shape.get('origin');
        var shapeMinY = origin.y[1];
        var shapeMaxY = origin.y[0];
        var bbox = shape.getBBox();
        var height = bbox.height;
        var shapeHeight = height;
        var panelRange = this.view.coordinateBBox;
        var boxes = [la.getBBox(), lb.getBBox()];
        var ay = la.attr('y');
        var by = lb.attr('y');
        if (this.options.adjustPosition && this.options.position === 'inner') {
            var totalLength = boxes[0].height + boxes[1].height;
            var isOverlap = boxes[1].maxY - boxes[0].minY > 2;
            var isTooShort = totalLength > shapeHeight;
            if (isOverlap || isTooShort) {
                by = shapeMinY - this.options.offsetY;
                lb.attr('fill', this.options.topStyle.fill);
                lb.attr('textBaseline', 'bottom');
                ay = shapeMaxY + this.options.offsetY;
                la.attr('fill', this.options.bottomStyle.fill);
                la.attr('textBaseline', 'top');
                boxes[0] = la.getBBox();
                boxes[1] = lb.getBBox();
            }
        }
        // fixme: textBaseline 取不准bbox
        if (boxes[0].maxY > panelRange.maxY - DEFAULT_OFFSET) {
            ay = panelRange.maxY - DEFAULT_OFFSET / 2;
            la.attr('textBaseline', 'bottom');
        }
        la.attr('y', ay);
        lb.attr('y', by);
        this.plot.canvas.draw();
    };
    RangeColumnLabel.prototype.getGeometry = function () {
        return util_1.find(this.view.geometries, function (geom) { return geom.type === 'interval'; });
    };
    return RangeColumnLabel;
}());
exports.default = RangeColumnLabel;
//# sourceMappingURL=label.js.map