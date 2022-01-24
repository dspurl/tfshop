import { each, deepMix, clone, find } from '@antv/util';
import { rgb2arr } from '../../../util/color';
import BBox from '../../../util/bbox';
var DEFAULT_OFFSET = 8;
function mappingColor(band, gray) {
    var reflect;
    each(band, function (b) {
        var map = b;
        if (gray >= map.from && gray < map.to) {
            reflect = map.color;
        }
    });
    return reflect;
}
var RangeBarLabel = /** @class */ (function () {
    function RangeBarLabel(cfg) {
        this.destroyed = false;
        this.view = cfg.view;
        this.plot = cfg.plot;
        var defaultOptions = this.getDefaultOptions();
        this.options = deepMix(defaultOptions, cfg, {});
        if (!this.options.leftStyle) {
            this.options.leftStyle = this.options.style;
        }
        if (!this.options.rightStyle) {
            this.options.rightStyle = this.options.style;
        }
        this.init();
    }
    RangeBarLabel.prototype.init = function () {
        var _this = this;
        this.container = this.getGeometry().labelsContainer;
        this.view.on('beforerender', function () {
            _this.clear();
            _this.plot.canvas.draw();
        });
    };
    RangeBarLabel.prototype.render = function () {
        var _this = this;
        var _a = this.getGeometry(), elements = _a.elements, coordinate = _a.coordinate;
        this.coord = coordinate;
        each(elements, function (ele) {
            var shape = ele.shape;
            var positions = _this.getPosition(shape);
            var values = _this.getValue(shape);
            var textAlign = _this.getTextAlign();
            var labels = [];
            each(positions, function (pos, i) {
                var style = i === 0 ? _this.options.leftStyle : _this.options.rightStyle;
                var color = _this.getTextColor(shape, i);
                if (_this.options.position === 'inner' && _this.options.adjustColor && color !== 'black') {
                    style.stroke = null;
                }
                var formatter = _this.options.formatter;
                var content = formatter ? formatter(values[i]) : values[i];
                var label = _this.container.addShape('text', {
                    attrs: deepMix({}, style, {
                        x: pos.x,
                        y: pos.y,
                        text: content,
                        fill: color,
                        textAlign: textAlign[i],
                        textBaseline: 'middle',
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
    RangeBarLabel.prototype.hide = function () {
        this.container.set('visible', false);
        this.plot.canvas.draw();
    };
    RangeBarLabel.prototype.show = function () {
        this.container.set('visible', true);
        this.plot.canvas.draw();
    };
    RangeBarLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    RangeBarLabel.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
        this.destroyed = true;
    };
    RangeBarLabel.prototype.getBBox = function () {
        return this.container.getBBox();
    };
    RangeBarLabel.prototype.getShapeBbox = function (shape) {
        var _this = this;
        var points = [];
        each(shape.get('origin').points, function (p) {
            points.push(_this.coord.convertPoint(p));
        });
        var bbox = new BBox(points[0].x, points[1].y, Math.abs(points[2].x - points[0].x), Math.abs(points[0].y - points[1].y));
        return bbox;
    };
    RangeBarLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            position: 'outer',
            offsetX: DEFAULT_OFFSET,
            offsetY: 0,
            style: clone(labelStyle),
            adjustColor: true,
            adjustPosition: true,
        };
    };
    RangeBarLabel.prototype.getPosition = function (shape) {
        var bbox = this.getShapeBbox(shape);
        var minX = bbox.minX, maxX = bbox.maxX, minY = bbox.minY, height = bbox.height;
        var _a = this.options, offsetX = _a.offsetX, offsetY = _a.offsetY;
        var y = minY + height / 2 + offsetY;
        var x1, x2;
        if (this.options.position === 'outer') {
            x1 = minX - offsetX;
            x2 = maxX + offsetX;
        }
        else {
            x1 = minX + offsetX;
            x2 = maxX - offsetX;
        }
        return [
            { x: x1, y: y },
            { x: x2, y: y },
        ];
    };
    RangeBarLabel.prototype.getValue = function (shape) {
        var xField = this.plot.options.xField;
        return shape.get('origin').data[xField];
    };
    RangeBarLabel.prototype.getTextAlign = function () {
        if (this.options.position === 'outer') {
            return ['right', 'left'];
        }
        else {
            return ['left', 'right'];
        }
    };
    RangeBarLabel.prototype.getTextColor = function (shape, index) {
        if (this.options.adjustColor && this.options.position === 'inner') {
            var shapeColor = shape.attr('fill');
            var shapeOpacity = shape.attr('opacity') ? shape.attr('opacity') : 1;
            var rgb = rgb2arr(shapeColor);
            var gray = Math.round(rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / shapeOpacity;
            var colorBand = [
                { from: 0, to: 85, color: 'white' },
                { from: 85, to: 170, color: '#F6F6F6' },
                { from: 170, to: 255, color: 'black' },
            ];
            var reflect = mappingColor(colorBand, gray);
            return reflect;
        }
        var defaultColor = index === 0 ? this.options.leftStyle.fill : this.options.rightStyle.fill;
        return defaultColor;
    };
    RangeBarLabel.prototype.doAnimation = function (label) {
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
    RangeBarLabel.prototype.adjustPosition = function (la, lb, shape) {
        var origin = shape.get('origin');
        var shapeMinX = origin.x[0];
        var shapeMaxX = origin.x[1];
        var shapeWidth = Math.abs(shapeMaxX - shapeMinX);
        var panelRange = this.view.coordinateBBox;
        var boxes = [la.getBBox(), lb.getBBox()];
        var ax = la.attr('x');
        var bx = lb.attr('x');
        if (this.options.adjustPosition && this.options.position === 'inner') {
            var totalLength = boxes[0].width + boxes[1].width;
            var isOverlap = boxes[0].maxX - boxes[1].minX > 2;
            var isTooShort = totalLength > shapeWidth;
            if (isOverlap || isTooShort) {
                ax = shapeMinX - this.options.offsetX;
                la.attr('fill', this.options.leftStyle.fill);
                la.attr('textAlign', 'right');
                boxes[0] = la.getBBox();
                bx = shapeMaxX + this.options.offsetX;
                lb.attr('fill', this.options.rightStyle.fill);
                lb.attr('textAlign', 'left');
                boxes[1] = lb.getBBox();
            }
        }
        if (boxes[0].minX < panelRange.minX) {
            ax = panelRange.minX + DEFAULT_OFFSET;
            la.attr('textAlign', 'left');
        }
        la.attr('x', ax);
        lb.attr('x', bx);
        this.plot.canvas.draw();
    };
    RangeBarLabel.prototype.getGeometry = function () {
        return find(this.view.geometries, function (geom) { return geom.type === 'interval'; });
    };
    return RangeBarLabel;
}());
export default RangeBarLabel;
//# sourceMappingURL=label.js.map