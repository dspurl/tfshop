import { __extends } from "tslib";
import { has, isString, isFunction, isArray, get } from '@antv/util';
import ElementParser from '../base';
var AreaParser = /** @class */ (function (_super) {
    __extends(AreaParser, _super);
    function AreaParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaParser.prototype.init = function () {
        var props = this.plot.options;
        this.config = {
            type: 'area',
            position: {
                fields: [props.xField, props.yField],
            },
            connectNulls: props.connectNulls || false,
        };
        if (props.smooth) {
            this.config.shape = { values: ['smooth'] };
        }
        if (this._getColorMappingField() || props.color) {
            this.parseColor();
        }
        if (props.areaStyle || (props.area && props.area.style)) {
            this.parseStyle();
        }
    };
    AreaParser.prototype.parseColor = function () {
        var props = this.plot.options;
        var config = {};
        var colorMappingField = this._getColorMappingField();
        if (colorMappingField) {
            config.fields = colorMappingField;
        }
        if (has(props, 'color')) {
            var color = props.color;
            if (isString(color)) {
                config.values = [color];
            }
            else if (isFunction(color)) {
                config.callback = color;
            }
            else if (isArray(color)) {
                if (colorMappingField) {
                    config.values = color;
                }
                else {
                    if (color.length > 0) {
                        config.values = [color[0]];
                    }
                }
            }
        }
        this.config.color = config;
    };
    AreaParser.prototype.parseStyle = function () {
        var props = this.plot.options;
        var styleProps = props.areaStyle ? props.areaStyle : props.area.style;
        var config = {};
        if (isFunction(styleProps) && props.seriesField) {
            config.fields = [props.seriesField];
            config.callback = styleProps;
        }
        else {
            config.cfg = styleProps;
        }
        this.config.style = config;
    };
    AreaParser.prototype._getColorMappingField = function () {
        var props = this.plot.options;
        var colorMapper = ['stackField', 'seriesField'];
        for (var _i = 0, colorMapper_1 = colorMapper; _i < colorMapper_1.length; _i++) {
            var m = colorMapper_1[_i];
            if (get(props, m)) {
                return [props[m]];
            }
        }
    };
    return AreaParser;
}(ElementParser));
export default AreaParser;
//# sourceMappingURL=main.js.map