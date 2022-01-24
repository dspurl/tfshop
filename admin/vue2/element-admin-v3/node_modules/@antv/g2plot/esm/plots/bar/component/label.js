import { __assign, __extends } from "tslib";
import { each, get, deepMix } from '@antv/util';
import { _ORIGIN } from '../../../dependents';
import BaseLabel, { registerLabelComponent } from '../../../components/label/base';
import { rgb2arr, mappingColor } from '../../../util/color';
import BBox from '../../../util/bbox';
var BarLabel = /** @class */ (function (_super) {
    __extends(BarLabel, _super);
    function BarLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarLabel.prototype.getLabelItemAttrs = function (element, index) {
        var _a;
        var _b = this.options, style = _b.style, formatter = _b.formatter;
        var mappingData = [].concat(element.getModel().mappingData);
        var value = this.getValue(element);
        return deepMix({}, style, __assign(__assign({}, this.getPosition(element)), { text: formatter
                ? formatter(value, (_a = {},
                    _a[_ORIGIN] = mappingData[0]._origin,
                    _a.mappingDatum = mappingData[0],
                    _a.mappingDatumIndex = 0,
                    _a.element = element,
                    _a.elementIndex = index,
                    _a), index)
                : value, fill: this.getTextFill(element), stroke: this.getTextStroke(element), textAlign: this.getTextAlign(element), textBaseline: this.getTextBaseline() }));
    };
    BarLabel.prototype.adjustLabel = function (label, element) {
        var _a = this.options, adjustPosition = _a.adjustPosition, style = _a.style;
        if (adjustPosition) {
            var offset = this.getDefaultOffset();
            var labelRange = label.getBBox();
            var shapeRange = this.getElementShapeBBox(element);
            if (shapeRange.width <= labelRange.width) {
                var xPosition = shapeRange.maxX + this.options.offsetX + offset;
                label.attr('x', xPosition);
                label.attr('fill', style.fill);
            }
        }
    };
    BarLabel.prototype.getDefaultOptions = function () {
        var theme = this.layer.theme;
        var _a = theme.label, label = _a === void 0 ? {} : _a;
        return __assign({ offsetX: 0, offsetY: 0, adjustPosition: true }, label);
    };
    BarLabel.prototype.getValue = function (element) {
        return get(element.getData(), this.layer.options.xField);
    };
    BarLabel.prototype.getPosition = function (element) {
        var offset = this.getDefaultOffset();
        var value = this.getValue(element);
        var bbox = this.getElementShapeBBox(element);
        var minX = bbox.minX, maxX = bbox.maxX, minY = bbox.minY, height = bbox.height, width = bbox.width;
        var _a = this.options, offsetX = _a.offsetX, offsetY = _a.offsetY, position = _a.position;
        var y = minY + height / 2 + offsetY;
        var dir = value < 0 ? -1 : 1;
        var x;
        if (position === 'left') {
            var root = value > 0 ? minX : maxX;
            x = root + offset * dir + offsetX;
        }
        else if (position === 'right') {
            var root = value > 0 ? maxX : minX;
            x = root + offset * dir + offsetX;
        }
        else {
            x = minX + width / 2 + offsetX;
        }
        return { x: x, y: y };
    };
    BarLabel.prototype.getTextFill = function (element) {
        var shape = element.shape;
        if (this.options.adjustColor && this.options.position !== 'right') {
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
        var defaultColor = this.options.style.fill;
        return defaultColor;
    };
    BarLabel.prototype.getTextStroke = function (element) {
        var fill = this.getTextFill(element);
        var _a = this.options, position = _a.position, adjustColor = _a.adjustColor;
        return position !== 'right' && adjustColor && fill !== 'black' ? null : undefined;
    };
    BarLabel.prototype.getTextAlign = function (element) {
        var value = this.getValue(element);
        var position = this.options.position;
        var alignOptions = {
            right: 'left',
            left: 'left',
            middle: 'center',
        };
        var alignOptionsReverse = {
            right: 'right',
            left: 'right',
            middle: 'center',
        };
        if (value < 0) {
            return alignOptionsReverse[position];
        }
        return alignOptions[position];
    };
    BarLabel.prototype.getTextBaseline = function () {
        return 'middle';
    };
    BarLabel.prototype.getElementShapeBBox = function (element) {
        var _this = this;
        var shape = element.shape;
        var points = [];
        each(shape.get('origin').points, function (p) {
            points.push(_this.coord.convertPoint(p));
        });
        var xValues = points.map(function (point) { return point.x; });
        var xValuesMin = Math.min.apply(Math, xValues);
        var xValueMax = Math.max.apply(Math, xValues);
        var yValues = points.map(function (point) { return point.y; });
        var yValuesMin = Math.min.apply(Math, yValues);
        var yValuesMax = Math.max.apply(Math, yValues);
        var bbox = new BBox(xValuesMin, yValuesMin, xValueMax - xValuesMin, yValuesMax - yValuesMin);
        return bbox;
    };
    BarLabel.prototype.getLabelOffset = function () {
        // Column 的 offset 在 getPosition 中因 position 不同单独处理
        return {
            x: 0,
            y: 0,
        };
    };
    return BarLabel;
}(BaseLabel));
export default BarLabel;
registerLabelComponent('bar', BarLabel);
//# sourceMappingURL=label.js.map