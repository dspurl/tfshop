import { __assign, __rest } from "tslib";
import { assign, isFunction, deepMix, get, each, has } from '@antv/util';
import { combineFormatter, getNoopFormatter, getPrecisionFormatter, getSuffixFormatter } from '../../util/formatter';
var LabelParser = /** @class */ (function () {
    function LabelParser(cfg) {
        this.config = {};
        var plot = cfg.plot, rest = __rest(cfg, ["plot"]);
        this.plot = plot;
        this.originConfig = rest;
        this.init(cfg);
    }
    LabelParser.prototype.getConfig = function () {
        return this.config;
    };
    LabelParser.prototype.init = function (cfg) {
        var _this = this;
        assign(this.config, cfg);
        this.config.callback = function (val) {
            return _this.parseCallBack(val);
        };
    };
    LabelParser.prototype.parseCallBack = function (val) {
        var labelProps = this.originConfig;
        var theme = this.plot.getPlotTheme();
        var config = __assign({}, labelProps);
        this.parseOffset(labelProps, config);
        if (labelProps.position) {
            if (isFunction(labelProps.position)) {
                config.position = labelProps.position(val);
            }
            else {
                config.position = labelProps.position;
            }
        }
        this.parseFormatter(config);
        if (labelProps.style) {
            if (isFunction(labelProps.style)) {
                config.textStyle = labelProps.style(val);
            }
            else {
                config.textStyle = labelProps.style;
            }
        }
        config.textStyle = deepMix({}, get(theme, 'label.style'), config.textStyle);
        if (labelProps.autoRotate) {
            config.autoRotate = labelProps.autoRotate;
        }
        return config;
    };
    LabelParser.prototype.parseOffset = function (props, config) {
        var mapper = ['offset', 'offsetX', 'offsetY'];
        var count = 0;
        each(mapper, function (m) {
            if (has(props, m)) {
                config[m] = props[m];
                count++;
            }
        });
        // 如用户没有设置offset，而label position又为middle时，则默认设置offset为0
        if (count === 0 && get(props, 'position') === 'middle') {
            config.offset = 0;
        }
    };
    LabelParser.prototype.parseFormatter = function (config) {
        var labelProps = this.originConfig;
        config.content = function (data, index) {
            // @ts-ignore
            var text = data[labelProps.fields[0]];
            return combineFormatter(getNoopFormatter(), getPrecisionFormatter(labelProps.precision), getSuffixFormatter(labelProps.suffix), labelProps.formatter
                ? labelProps.formatter
                : getNoopFormatter())(text, data, index);
        };
    };
    return LabelParser;
}());
export default LabelParser;
//# sourceMappingURL=parser.js.map