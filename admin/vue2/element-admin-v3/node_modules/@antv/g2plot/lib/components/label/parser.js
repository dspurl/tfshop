"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var formatter_1 = require("../../util/formatter");
var LabelParser = /** @class */ (function () {
    function LabelParser(cfg) {
        this.config = {};
        var plot = cfg.plot, rest = tslib_1.__rest(cfg, ["plot"]);
        this.plot = plot;
        this.originConfig = rest;
        this.init(cfg);
    }
    LabelParser.prototype.getConfig = function () {
        return this.config;
    };
    LabelParser.prototype.init = function (cfg) {
        var _this = this;
        util_1.assign(this.config, cfg);
        this.config.callback = function (val) {
            return _this.parseCallBack(val);
        };
    };
    LabelParser.prototype.parseCallBack = function (val) {
        var labelProps = this.originConfig;
        var theme = this.plot.getPlotTheme();
        var config = tslib_1.__assign({}, labelProps);
        this.parseOffset(labelProps, config);
        if (labelProps.position) {
            if (util_1.isFunction(labelProps.position)) {
                config.position = labelProps.position(val);
            }
            else {
                config.position = labelProps.position;
            }
        }
        this.parseFormatter(config);
        if (labelProps.style) {
            if (util_1.isFunction(labelProps.style)) {
                config.textStyle = labelProps.style(val);
            }
            else {
                config.textStyle = labelProps.style;
            }
        }
        config.textStyle = util_1.deepMix({}, util_1.get(theme, 'label.style'), config.textStyle);
        if (labelProps.autoRotate) {
            config.autoRotate = labelProps.autoRotate;
        }
        return config;
    };
    LabelParser.prototype.parseOffset = function (props, config) {
        var mapper = ['offset', 'offsetX', 'offsetY'];
        var count = 0;
        util_1.each(mapper, function (m) {
            if (util_1.has(props, m)) {
                config[m] = props[m];
                count++;
            }
        });
        // 如用户没有设置offset，而label position又为middle时，则默认设置offset为0
        if (count === 0 && util_1.get(props, 'position') === 'middle') {
            config.offset = 0;
        }
    };
    LabelParser.prototype.parseFormatter = function (config) {
        var labelProps = this.originConfig;
        config.content = function (data, index) {
            // @ts-ignore
            var text = data[labelProps.fields[0]];
            return formatter_1.combineFormatter(formatter_1.getNoopFormatter(), formatter_1.getPrecisionFormatter(labelProps.precision), formatter_1.getSuffixFormatter(labelProps.suffix), labelProps.formatter
                ? labelProps.formatter
                : formatter_1.getNoopFormatter())(text, data, index);
        };
    };
    return LabelParser;
}());
exports.default = LabelParser;
//# sourceMappingURL=parser.js.map