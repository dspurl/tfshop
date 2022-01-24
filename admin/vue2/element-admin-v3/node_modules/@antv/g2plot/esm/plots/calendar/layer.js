import { __assign, __extends } from "tslib";
import { deepMix, isNil, map, get } from '@antv/util';
import fecha from 'fecha';
import ViewLayer from '../../base/view-layer';
import { DAY_FIELD, FORMATTER, MONTHS, WEEK_FIELD, WEEKS } from './constant';
import { generateCalendarData, getMonthCenterWeek } from './util';
import { registerPlotType } from '../../base/global';
import { getDateRange } from '../../util/date';
import { getComponent } from '../../components/factory';
import * as EventParser from './event';
/**
 * 日历图
 */
var CalendarLayer = /** @class */ (function (_super) {
    __extends(CalendarLayer, _super);
    function CalendarLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'calendar';
        return _this;
    }
    CalendarLayer.getDefaultOptions = function () {
        var _a;
        return deepMix({}, _super.getDefaultOptions.call(this), {
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
                _a[DAY_FIELD] = {
                    type: 'cat',
                    alias: 'Day',
                    values: [0, 1, 2, 3, 4, 5, 6],
                },
                _a[WEEK_FIELD] = {
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
        if (isNil(dateRange)) {
            var dates = map(data, function (datum) { return fecha.parse("" + datum[dateField], FORMATTER); });
            dateRange = getDateRange(dates);
        }
        return generateCalendarData(data, dateRange, dateField);
    };
    CalendarLayer.prototype.addGeometry = function () {
        var _a = this.options, valueField = _a.valueField, colors = _a.colors, tooltip = _a.tooltip;
        var polygonConfig = {
            type: 'polygon',
            position: {
                fields: [WEEK_FIELD, DAY_FIELD],
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
                geomConfig.tooltip.fields = [WEEK_FIELD, DAY_FIELD];
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
        return getComponent('label', __assign({ plot: this, fields: [valueField], position: 'top', offset: 0 }, label));
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
        var xAxis_parser = getComponent('axis', {
            plot: this,
            dim: 'x',
        });
        var yAxis_parser = getComponent('axis', {
            plot: this,
            dim: 'y',
        });
        var axesConfig = {};
        axesConfig[WEEK_FIELD] = xAxis_parser;
        axesConfig[DAY_FIELD] = yAxis_parser;
        /** 存储坐标轴配置项到config */
        this.setConfig('axes', axesConfig);
    };
    CalendarLayer.prototype.scale = function () {
        _super.prototype.scale.call(this);
        var monthWeek = getMonthCenterWeek(this.options.dateRange);
        // 拿出 scale 二次加工，主要是配置 x y 中的标题显示
        var scales = this.config.scales;
        var _a = this.options, _b = _a.weeks, weeks = _b === void 0 ? WEEKS : _b, _c = _a.months, months = _c === void 0 ? MONTHS : _c;
        var x = scales[WEEK_FIELD];
        var y = scales[DAY_FIELD];
        // 1. 设置 formatter
        x.formatter = function (v) {
            var m = monthWeek[v];
            return m !== undefined ? months[m] : '';
        };
        y.formatter = function (v) { return weeks[v] || ''; };
        // 2. 设置 alias
        var _d = this.options, xAxis = _d.xAxis, yAxis = _d.yAxis;
        x.alias = get(xAxis, ['title', 'text'], x.alias);
        y.alias = get(yAxis, ['title', 'text'], y.alias);
        this.setConfig('scales', scales);
    };
    CalendarLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return CalendarLayer;
}(ViewLayer));
export default CalendarLayer;
// 注册到池子中
registerPlotType('calendar', CalendarLayer);
//# sourceMappingURL=layer.js.map