"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var color_1 = require("../../../util/color");
var MatrixLabel = /** @class */ (function () {
    function MatrixLabel(cfg) {
        this.destroyed = false;
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = util_1.deepMix(defaultOptions, cfg, {});
        this.init();
    }
    MatrixLabel.prototype.init = function () {
        var _this = this;
        this.container = this.view.geometries[0].labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    MatrixLabel.prototype.render = function () {
        var _this = this;
        var elements = this.view.geometries[0].elements;
        util_1.each(elements, function (ele) {
            var shape = ele.shape;
            var _a = _this.options, style = _a.style, offsetX = _a.offsetX, offsetY = _a.offsetY;
            var formatter = _this.options.formatter;
            var content = formatter ? formatter(_this.getContent(shape)) : _this.getContent(shape);
            var position = _this.getPosition(shape);
            var color = _this.getTextColor(shape);
            var label = _this.container.addShape('text', {
                attrs: util_1.deepMix({}, style, {
                    x: position.x + offsetX,
                    y: position.y + offsetY,
                    text: content,
                    fill: color,
                    textAlign: 'center',
                    textBaseline: 'middle',
                }),
                name: 'label',
            });
            if (_this.options.adjustPosition) {
                _this.adjustLabel(label, shape);
            }
        });
    };
    MatrixLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    MatrixLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    MatrixLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    MatrixLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    MatrixLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    MatrixLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            offsetX: 0,
            offsetY: 0,
            style: util_1.clone(labelStyle),
        };
    };
    MatrixLabel.prototype.getContent = function (shape) {
        var data = shape.get('origin').data;
        var field = this.plot.options.colorField;
        return data[field];
    };
    MatrixLabel.prototype.getPosition = function (shape) {
        var bbox = shape.getBBox();
        return {
            x: bbox.minX + bbox.width / 2,
            y: bbox.minY + bbox.height / 2,
        };
    };
    MatrixLabel.prototype.getTextColor = function (shape) {
        if (this.options.adjustColor) {
            var shapeColor = shape.attr('fill');
            var shapeOpacity = shape.attr('opacity') ? shape.attr('opacity') : 1;
            var rgb = color_1.rgb2arr(shapeColor);
            var gray = Math.round(rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / shapeOpacity;
            var colorBand = [
                { from: 0, to: 85, color: 'white' },
                { from: 85, to: 170, color: '#F6F6F6' },
                { from: 170, to: 255, color: 'black' },
            ];
            var reflect = color_1.mappingColor(colorBand, gray);
            return reflect;
        }
        var defaultColor = this.options.style.fill;
        return defaultColor;
    };
    MatrixLabel.prototype.adjustLabel = function (label, shape) {
        var labelRange = label.getBBox();
        var shapeRange = shape.getBBox();
        if (labelRange.width > shapeRange.width || labelRange.height > shapeRange.height) {
            label.attr('text', '');
        }
    };
    return MatrixLabel;
}());
exports.default = MatrixLabel;
//# sourceMappingURL=label.js.map