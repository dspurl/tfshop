"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../base"));
var CircleParser = /** @class */ (function (_super) {
    tslib_1.__extends(CircleParser, _super);
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
            config.fields = util_1.isArray(colorField) ? colorField : [colorField];
        }
        if (props.color) {
            this._parseColor(props, config);
        }
        if (!util_1.isEmpty(config)) {
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
            config.values = util_1.isArray(props.pointSize) ? props.pointSize : [props.pointSize];
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
        if (util_1.isFunction(styleProps)) {
            if (colorField) {
                config.fields = util_1.isArray(colorField)
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
            if (!util_1.isNil(styleProps.opacity)) {
                config.cfg.fillOpacity = styleProps.opacity;
            }
        }
        this.config.style = config;
    };
    CircleParser.prototype._parseColor = function (props, config) {
        if (util_1.isString(props.color)) {
            config.values = [props.color];
        }
        else if (util_1.isFunction(props.color)) {
            config.callback = props.color;
        }
        else if (util_1.isArray(props.color)) {
            config.values = props.color;
        }
    };
    return CircleParser;
}(base_1.default));
exports.default = CircleParser;
//# sourceMappingURL=circle.js.map