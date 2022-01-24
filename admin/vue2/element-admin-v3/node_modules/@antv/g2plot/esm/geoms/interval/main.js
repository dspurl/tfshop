import { __extends } from "tslib";
import { isString, isFunction, isArray, isObject, get } from '@antv/util';
import ElementParser from '../base';
var COLOR_MAPPER = ['colorField', 'stackField', 'groupField'];
var IntervalParser = /** @class */ (function (_super) {
    __extends(IntervalParser, _super);
    function IntervalParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntervalParser.prototype.init = function () {
        this.type = 'interval';
        _super.prototype.init.call(this);
        var props = this.plot.options;
        if (this._needParserColor()) {
            this.parseColor();
        }
        if (!this.config.color) {
            this.config.color = { values: ['#5b8ff9'] };
        }
        var sizeProps = this._getSizeProps(props);
        if (sizeProps) {
            this.parseSize(sizeProps);
        }
        var styleProps = this._getStyleProps(props);
        if (styleProps) {
            this.parseStyle(styleProps);
        }
    };
    IntervalParser.prototype.parseColor = function () {
        var props = this.plot.options;
        var colorField = this._getColorMappingField(props);
        var config = {};
        if (colorField) {
            config.fields = colorField;
        }
        if (props.color) {
            if (isString(props.color)) {
                config.values = [props.color];
            }
            else if (isFunction(props.color)) {
                config.callback = props.color;
            }
            else if (isArray(props.color)) {
                if (colorField) {
                    config.values = props.color;
                }
                else {
                    if (props.color.length > 0) {
                        config.values = [props.color[0]];
                    }
                }
            }
            else if (isObject(props.color)) {
                config.fields = colorField;
                config.callback = function (d) {
                    return props.color[d];
                };
            }
        }
        this.config.color = config;
    };
    IntervalParser.prototype.parseSize = function (sizeProps) {
        var props = this.plot.options;
        var config = {};
        if (isFunction(props[sizeProps])) {
            config.fields = [this.config.position.fields];
            config.callback = props[sizeProps];
        }
        else {
            config.values = [props[sizeProps]];
        }
        this.config.size = config;
    };
    IntervalParser.prototype.parseStyle = function (styleProps) {
        var props = this.plot.options;
        var color = this.config.color;
        var style = this.plot.options[styleProps];
        var config = {};
        if (isFunction(style)) {
            config.fields = (color === null || color === void 0 ? void 0 : color.fields) || [props.xField, props.yField];
            config.callback = style;
        }
        else {
            config.cfg = style;
        }
        this.config.style = config;
    };
    IntervalParser.prototype._getSizeProps = function (props) {
        var sizeMapper = ['columnSize', 'barSize'];
        for (var _i = 0, sizeMapper_1 = sizeMapper; _i < sizeMapper_1.length; _i++) {
            var m = sizeMapper_1[_i];
            if (get(props, m)) {
                return m;
            }
        }
    };
    IntervalParser.prototype._getStyleProps = function (props) {
        var sizeMapper = ['columnStyle', 'barStyle', 'pieStyle', 'ringStyle'];
        for (var _i = 0, sizeMapper_2 = sizeMapper; _i < sizeMapper_2.length; _i++) {
            var m = sizeMapper_2[_i];
            if (get(props, m)) {
                return m;
            }
        }
    };
    IntervalParser.prototype._getColorMappingField = function (props) {
        /**如果有colorFiled或stackField配置项(后者为堆叠interval)，则参与colorMapping的字段为对应值
         * 如没有特别设定，则一般是callback中的传参，传入位置映射的字段
         */
        for (var _i = 0, COLOR_MAPPER_1 = COLOR_MAPPER; _i < COLOR_MAPPER_1.length; _i++) {
            var m = COLOR_MAPPER_1[_i];
            if (get(props, m)) {
                return [props[m]];
            }
        }
    };
    IntervalParser.prototype._needParserColor = function () {
        var props = this.plot.options;
        if (props.color) {
            return true;
        }
        for (var _i = 0, COLOR_MAPPER_2 = COLOR_MAPPER; _i < COLOR_MAPPER_2.length; _i++) {
            var m = COLOR_MAPPER_2[_i];
            if (props[m]) {
                return true;
            }
        }
        return false;
    };
    return IntervalParser;
}(ElementParser));
export default IntervalParser;
//# sourceMappingURL=main.js.map