import { __extends } from "tslib";
import { isArray, isFunction, isString, isEmpty, isNil } from '@antv/util';
import ElementParser from '../base';
var CircleParser = /** @class */ (function (_super) {
    __extends(CircleParser, _super);
    function CircleParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CircleParser.prototype.init = function () {
        var props = this.plot.options;
        this.style = props.pointStyle;
        if (!props.xField || !props.yField) {
            return;
        }
        this.config = {
            type: 'point',
            position: {
                fields: [props.xField, props.yField],
            },
        };
        this.parseColor();
        this.parseSize();
        if (props.shape) {
            this.parseShape(props.shape);
        }
        if (props.pointStyle) {
            this.parseStyle();
        }
    };
    CircleParser.prototype.parseColor = function () {
        var props = this.plot.options;
        var config = {};
        var colorField = props.colorField;
        if (colorField) {
            config.fields = isArray(colorField) ? colorField : [colorField];
        }
        if (props.color) {
            this._parseColor(props, config);
        }
        if (!isEmpty(config)) {
            this.config.color = config;
        }
    };
    CircleParser.prototype.parseSize = function () {
        var props = this.plot.options;
        var config = {};
        if (props.sizeField) {
            config.fields = [props.sizeField];
        }
        if (props.pointSize) {
            config.values = isArray(props.pointSize) ? props.pointSize : [props.pointSize];
        }
        this.config.size = config;
    };
    CircleParser.prototype.parseShape = function (shapeName) {
        this.config.shape = shapeName;
    };
    CircleParser.prototype.parseStyle = function () {
        var props = this.plot.options;
        var styleProps = props.pointStyle;
        var config = {
            fields: null,
            callback: null,
            cfg: null,
        };
        var xField = props.xField, yField = props.yField, colorField = props.colorField;
        if (isFunction(styleProps)) {
            if (colorField) {
                config.fields = isArray(colorField)
                    ? [xField, yField, colorField].concat(colorField)
                    : [xField, yField, colorField];
            }
            else {
                config.fields = [xField, yField];
            }
            config.callback = styleProps;
        }
        else {
            config.cfg = styleProps;
            // opacity 与 fillOpacity 兼容
            if (!isNil(styleProps.opacity)) {
                config.cfg.fillOpacity = styleProps.opacity;
            }
        }
        this.config.style = config;
    };
    CircleParser.prototype._parseColor = function (props, config) {
        if (isString(props.color)) {
            config.values = [props.color];
        }
        else if (isFunction(props.color)) {
            config.callback = props.color;
        }
        else if (isArray(props.color)) {
            config.values = props.color;
        }
    };
    return CircleParser;
}(ElementParser));
export default CircleParser;
//# sourceMappingURL=circle.js.map