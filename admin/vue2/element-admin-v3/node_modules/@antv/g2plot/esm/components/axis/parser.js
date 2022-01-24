import { __assign, __rest } from "tslib";
import { deepMix, isFunction, get } from '@antv/util';
import { combineFormatter, getNoopFormatter, getPrecisionFormatter, getSuffixFormatter } from '../../util/formatter';
function propertyMapping(source, target, field) {
    if (source[field]) {
        target[field] = source[field];
    }
}
var AxisParser = /** @class */ (function () {
    function AxisParser(cfg) {
        this.config = false;
        this.plot = cfg.plot;
        this.dim = cfg.dim;
        this.init();
    }
    AxisParser.prototype.init = function () {
        this.config = false;
        var theme = this.plot.getPlotTheme();
        this.themeConfig = theme && theme.axis && theme.axis[this.dim];
        if (this._needDraw()) {
            this._styleParser();
        }
    };
    AxisParser.prototype._styleParser = function () {
        this.config = __assign({}, this.localProps);
        this._isVisible('line') ? this._lineParser() : (this.config.line = null);
        this._isVisible('grid') ? this._gridParser() : (this.config.grid = null);
        this._isVisible('tickLine') ? this._tickLineParser() : (this.config.tickLine = null);
        this._isVisible('label') ? this._labelParser() : (this.config.label = null);
        this._isVisible('title') ? this._titleParser() : (this.config.title = null);
        propertyMapping(this.localProps, this.config, 'autoHideLabel');
        propertyMapping(this.localProps, this.config, 'autoRotateLabel');
        propertyMapping(this.localProps, this.config, 'autoRotateTitle');
    };
    AxisParser.prototype._needDraw = function () {
        /** 如果在图表配置项里没有设置坐标轴整体的visibility则去对应的theme取 */
        var propos = this.plot.options;
        var propsConfig = propos[this.dim + "Axis"] ? propos[this.dim + "Axis"] : {};
        var config = deepMix({}, this.themeConfig, propsConfig);
        this.localProps = config;
        if (config.visible) {
            return true;
        }
        return false;
    };
    AxisParser.prototype._lineParser = function () {
        this.config.line = this.localProps.line;
        if (this.localProps.line.style) {
            this.config.line = { style: this.localProps.line.style };
        }
        this.applyThemeConfig('line');
    };
    AxisParser.prototype._gridParser = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        var style = (_b = (_a = this.localProps.grid) === null || _a === void 0 ? void 0 : _a.line) === null || _b === void 0 ? void 0 : _b.style;
        var type = (_d = (_c = this.localProps.grid) === null || _c === void 0 ? void 0 : _c.line) === null || _d === void 0 ? void 0 : _d.type;
        var alternateColor = (_e = this.localProps.grid) === null || _e === void 0 ? void 0 : _e.alternateColor;
        if (isFunction(style)) {
            this.config.grid = function (text, index, count) {
                var cfg = style(text, index, count);
                return {
                    line: {
                        type: type,
                        style: deepMix({}, get(_this.themeConfig, "grid.line.style"), cfg),
                    },
                    alternateColor: alternateColor,
                };
            };
        }
        else if (style) {
            this.config.grid = {
                line: {
                    type: type,
                    style: style,
                },
                alternateColor: alternateColor,
            };
            this.applyThemeConfig('grid');
        }
    };
    AxisParser.prototype._tickLineParser = function () {
        this.config.tickLine = this.localProps.tickLine;
        if (this.localProps.tickLine.style) {
            this.config.tickLine = { style: this.localProps.tickLine.style };
        }
        this.applyThemeConfig('tickLine');
    };
    AxisParser.prototype._labelParser = function () {
        var _a = this.localProps.label, style = _a.style, restLabelProps = __rest(_a, ["style"]);
        var labelConfig = __assign({}, restLabelProps);
        if (style) {
            labelConfig.style = __assign({}, this.localProps.label.style);
        }
        labelConfig.style = deepMix({}, get(this.themeConfig, 'label.style'), labelConfig.style);
        var formatter = this.parseFormatter(labelConfig);
        labelConfig.formatter = formatter;
        this.config.label = labelConfig;
    };
    AxisParser.prototype._titleParser = function () {
        var titleConfig = __assign({}, this.localProps.title);
        var _a = this.localProps.title, visible = _a.visible, style = _a.style, text = _a.text;
        if (!visible) {
            this.config.showTitle = false;
        }
        else {
            this.config.showTitle = true;
            if (style) {
                titleConfig.style = style;
            }
            titleConfig.style = deepMix({}, get(this.config, 'title.style'), titleConfig.textStyle);
            if (text) {
                titleConfig.text = text;
            }
        }
        this.config.title = titleConfig;
    };
    AxisParser.prototype._isVisible = function (name) {
        if (this.localProps[name] && this.localProps[name].visible) {
            return true;
        }
        return false;
    };
    AxisParser.prototype.applyThemeConfig = function (type) {
        this.config[type] = deepMix({}, get(this.themeConfig, type + ".style"), this.config[type]);
    };
    AxisParser.prototype.parseFormatter = function (labelConfig) {
        var formatter = combineFormatter(getNoopFormatter(), getPrecisionFormatter(labelConfig.precision), getSuffixFormatter(labelConfig.suffix));
        if (labelConfig.formatter) {
            formatter = combineFormatter(formatter, labelConfig.formatter);
        }
        return formatter;
    };
    return AxisParser;
}());
export default AxisParser;
//# sourceMappingURL=parser.js.map