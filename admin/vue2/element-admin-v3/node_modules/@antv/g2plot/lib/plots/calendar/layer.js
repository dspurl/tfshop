"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var fecha_1 = tslib_1.__importDefault(require("fecha"));
var view_layer_1 = tslib_1.__importDefault(require("../../base/view-layer"));
var constant_1 = require("./constant");
var util_2 = require("./util");
var global_1 = require("../../base/global");
var date_1 = require("../../util/date");
var factory_1 = require("../../components/factory");
var EventParser = tslib_1.__importStar(require("./event"));
/**
 * 日历图
 */
var CalendarLayer = /** @class */ (function (_super) {
    tslib_1.__extends(CalendarLayer, _super);
    function CalendarLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'calendar';
        return _this;
    }
    CalendarLayer.getDefaultOptions = function () {
        var _a;
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
            xAxis: {
                line: {
                    visible: false,
                },
                grid: {
                    visible: false,
                },
                tickLine: {
                    visible: false,
                },
                label: {
                    visible: true,
                    autoRotate: false,
                    autoHide: false,
                },
            },
            yAxis: {
                line: {
                    visible: false,
                },
                grid: {
                    visible: false,
                },
                tickLine: {
                    visible: false,
                },
                label: {
                    visible: true,
                    autoRotate: false,
                    autoHide: false,
                },
            },
            legend: { visible: false },
            meta: (_a = {},
                _a[constant_1.DAY_FIELD] = {
                    type: 'cat',
                    alias: 'Day',
                    values: [0, 1, 2, 3, 4, 5, 6],
                },
                _a[constant_1.WEEK_FIELD] = {
                    type: 'cat',
                    alias: 'Month',
                },
                _a),
            tooltip: {
                visible: true,
                showTitle: true,
                showCrosshairs: false,
                showMarkers: false,
                title: 'date',
            },
        });
    };
    /**
     * 复写父类的数据处理类，主要完成：
     * 1. 生成 polygon 的 x y field（虚拟的，无需用户传入）
     *
     * @param data
     */
    CalendarLayer.prototype.processData = function (data) {
        var dateField = this.options.dateField;
        var dateRange = this.options.dateRange;
        // 给与默认值是当前这一年
        if (util_1.isNil(dateRange)) {
            var dates = util_1.map(data, function (datum) { return fecha_1.default.parse("" + datum[dateField], constant_1.FORMATTER); });
            dateRange = date_1.getDateRange(dates);
        }
        return util_2.generateCalendarData(data, dateRange, dateField);
    };
    CalendarLayer.prototype.addGeometry = function () {
        var _a = this.options, valueField = _a.valueField, colors = _a.colors, tooltip = _a.tooltip;
        var polygonConfig = {
            type: 'polygon',
            position: {
                fields: [constant_1.WEEK_FIELD, constant_1.DAY_FIELD],
            },
            shape: {
                values: ['calendar-polygon'],
            },
            color: {
                fields: [valueField],
                values: colors,
            },
            label: this.extractLabel(),
        };
        if (tooltip && (tooltip.fields || tooltip.formatter)) {
            this.geometryTooltip(polygonConfig);
        }
        this.setConfig('geometry', polygonConfig);
    };
    CalendarLayer.prototype.geometryTooltip = function (geomConfig) {
        geomConfig.tooltip = {};
        var tooltipOptions = this.options.tooltip;
        if (tooltipOptions.fields) {
            geomConfig.tooltip.fields = tooltipOptions.fields;
        }
        if (tooltipOptions.formatter) {
            geomConfig.tooltip.callback = tooltipOptions.formatter;
            if (!tooltipOptions.fields) {
                geomConfig.tooltip.fields = [constant_1.WEEK_FIELD, constant_1.DAY_FIELD];
            }
        }
    };
    CalendarLayer.prototype.extractLabel = function () {
        var props = this.options;
        var label = props.label;
        if (label && label.visible === false) {
            return false;
        }
        var valueField = this.options.valueField;
        return factory_1.getComponent('label', tslib_1.__assign({ plot: this, fields: [valueField], position: 'top', offset: 0 }, label));
    };
    /**
     * 写入坐标系配置，默认增加镜像
     */
    CalendarLayer.prototype.coord = function () {
        // 默认做镜像处理
        var coordinateConfig = {
            type: 'rect',
            cfg: {},
            actions: [['reflect', 'y']],
        };
        this.setConfig('coordinate', coordinateConfig);
    };
    /**
     * 无需 geometry parser，直接使用 polygon 即可
     */
    CalendarLayer.prototype.geometryParser = function () {
        return '';
    };
    CalendarLayer.prototype.axis = function () {
        var xAxis_parser = factory_1.getComponent('axis', {
            plot: this,
            dim: 'x',
        });
        var yAxis_parser = factory_1.getComponent('axis', {
            plot: this,
            dim: 'y',
        });
        var axesConfig = {};
        axesConfig[constant_1.WEEK_FIELD] = xAxis_parser;
        axesConfig[constant_1.DAY_FIELD] = yAxis_parser;
        /** 存储坐标轴配置项到config */
        this.setConfig('axes', axesConfig);
    };
    CalendarLayer.prototype.scale = function () {
        _super.prototype.scale.call(this);
        var monthWeek = util_2.getMonthCenterWeek(this.options.dateRange);
        // 拿出 scale 二次加工，主要是配置 x y 中的标题显示
        var scales = this.config.scales;
        var _a = this.options, _b = _a.weeks, weeks = _b === void 0 ? constant_1.WEEKS : _b, _c = _a.months, months = _c === void 0 ? constant_1.MONTHS : _c;
        var x = scales[constant_1.WEEK_FIELD];
        var y = scales[constant_1.DAY_FIELD];
        // 1. 设置 formatter
        x.formatter = function (v) {
            var m = monthWeek[v];
            return m !== undefined ? months[m] : '';
        };
        y.formatter = function (v) { return weeks[v] || ''; };
        // 2. 设置 alias
        var _d = this.options, xAxis = _d.xAxis, yAxis = _d.yAxis;
        x.alias = util_1.get(xAxis, ['title', 'text'], x.alias);
        y.alias = util_1.get(yAxis, ['title', 'text'], y.alias);
        this.setConfig('scales', scales);
    };
    CalendarLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return CalendarLayer;
}(view_layer_1.default));
exports.default = CalendarLayer;
// 注册到池子中
global_1.registerPlotType('calendar', CalendarLayer);
//# sourceMappingURL=layer.js.map