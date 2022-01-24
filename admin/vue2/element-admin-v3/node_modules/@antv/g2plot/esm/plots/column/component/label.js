import { __assign, __extends } from "tslib";
import { get, each, deepMix } from '@antv/util';
import { _ORIGIN } from '../../../dependents';
import BaseLabel, { registerLabelComponent } from '../../../components/label/base';
import { mappingColor, rgb2arr } from '../../../util/color';
import BBox from '../../../util/bbox';
var ColumnLabel = /** @class */ (function (_super) {
    __extends(ColumnLabel, _super);
    function ColumnLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnLabel.prototype.getLabelItemAttrs = function (element, index) {
        var _a;
        var _b;
        var _c = this.options, style = _c.style, formatter = _c.formatter;
        var mappingData = [].concat(element.getModel().mappingData);
        var value = this.getValue(element);
        return deepMix({}, style, __assign(__assign({}, this.getPosition(element)), { text: formatter
                ? formatter(value, (_a = {},
                    _a[_ORIGIN] = (_b = mappingData[0]) === null || _b === void 0 ? void 0 : _b._origin,
                    _a.mappingDatum = mappingData[0],
                    _a.mappingDatumIndex = 0,
                    _a.element = element,
                    _a.elementIndex = index,
                    _a), index)
                : value, fill: this.getTextFill(element), stroke: this.getTextStroke(element), textAlign: this.getTextAlign(), textBaseline: this.getTextBaseLine() }));
    };
    ColumnLabel.prototype.getDefaultOptions = function () {
        var theme = this.layer.theme;
        var _a = theme.label, label = _a === void 0 ? {} : _a;
        return __assign({ offsetX: 0, offsetY: 0, adjustPosition: true }, label);
    };
    ColumnLabel.prototype.adjustLabel = function (label, element) {
        var adjustPosition = this.options.adjustPosition;
        if (adjustPosition) {
            var offset = this.getDefaultOffset();
            var labelRange = label.getBBox();
            var shapeRange = this.getElementShapeBBox(element);
            if (shapeRange.height <= labelRange.height) {
                var yPosition = shapeRange.minY + this.options.offsetY - offset;
                label.attr('y', yPosition);
                label.attr('textBaseline', 'bottom');
                label.attr('fill', this.options.style.fill);
            }
        }
    };
    ColumnLabel.prototype.getValue = function (element) {
        return get(element.getData(), this.layer.options.yField);
    };
    ColumnLabel.prototype.getPosition = function (element) {
        var offset = this.getDefaultOffset();
        var value = this.getValue(element);
        var bbox = this.getElementShapeBBox(element);
        var minX = bbox.minX, minY = bbox.minY, maxY = bbox.maxY, height = bbox.height, width = bbox.width;
        var _a = this.options, offsetX = _a.offsetX, offsetY = _a.offsetY, position = _a.position;
        var x = minX + width / 2 + offsetX;
        var dir = value > 0 ? -1 : 1;
        var y;
        if (position === 'top') {
            var root = value > 0 ? minY : maxY;
            y = root + offset * dir + offsetY;
        }
        else if (position === 'bottom') {
            var root = value > 0 ? maxY : minY;
            y = root + offset * dir + offsetY;
        }
        else {
            y = minY + height / 2 + offsetY;
        }
        return { x: x, y: y };
    };
    ColumnLabel.prototype.getTextFill = function (element) {
        var shape = element.shape;
        if (this.options.adjustColor && this.options.position !== 'top') {
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
    ColumnLabel.prototype.getTextStroke = function (element) {
        var fill = this.getTextFill(element);
        var _a = this.options, position = _a.position, adjustColor = _a.adjustColor;
        return position !== 'top' && adjustColor && fill !== 'black' ? null : undefined;
    };
    ColumnLabel.prototype.getElementShapeBBox = function (element) {
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
    ColumnLabel.prototype.getTextAlign = function () {
        return 'center';
    };
    ColumnLabel.prototype.getTextBaseLine = function () {
        return 'middle';
    };
    ColumnLabel.prototype.getLabelOffset = function () {
        // Column 的 offset 在 getPosition 中因 position 不同单独处理
        return {
            x: 0,
            y: 0,
        };
    };
    return ColumnLabel;
}(BaseLabel));
export default ColumnLabel;
registerLabelComponent('column', ColumnLabel);
//# sourceMappingURL=label.js.map