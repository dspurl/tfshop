"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var view_layer_1 = tslib_1.__importDefault(require("../../base/view-layer"));
var factory_1 = require("../../geoms/factory");
var conversion_tag_1 = tslib_1.__importDefault(require("../../components/conversion-tag"));
var scale_1 = require("../../util/scale");
var apply_responsive_1 = tslib_1.__importDefault(require("./apply-responsive"));
require("./apply-responsive/theme");
require("./component/label");
require("./component/label-auto");
var EventParser = tslib_1.__importStar(require("./event"));
require("./theme");
var view_1 = require("../../util/view");
var G2_GEOM_MAP = {
    column: 'interval',
};
var PLOT_GEOM_MAP = {
    interval: 'column',
};
var BaseColumnLayer = /** @class */ (function (_super) {
    tslib_1.__extends(BaseColumnLayer, _super);
    function BaseColumnLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'column';
        return _this;
    }
    BaseColumnLayer.getDefaultOptions = function () {
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
            xAxis: {
                visible: true,
                tickLine: {
                    visible: false,
                },
                title: {
                    visible: true,
                },
            },
            yAxis: {
                nice: true,
                title: {
                    visible: true,
                },
                label: {
                    visible: true,
                },
                grid: {
                    visible: true,
                },
            },
            tooltip: {
                visible: true,
                shared: true,
                showCrosshairs: false,
                showMarkers: false,
            },
            label: {
                visible: false,
                position: 'top',
                adjustColor: true,
            },
            legend: {
                visible: true,
                position: 'top-left',
            },
            interactions: [
                { type: 'tooltip' },
                { type: 'active-region' },
                { type: 'legend-active' },
                { type: 'legend-filter' },
            ],
            conversionTag: {
                visible: false,
            },
        });
    };
    BaseColumnLayer.prototype.beforeInit = function () {
        _super.prototype.beforeInit.call(this);
        /** 响应式图形 */
        if (this.options.responsive && this.options.padding !== 'auto') {
            this.applyResponsive('preRender');
        }
    };
    BaseColumnLayer.prototype.afterRender = function () {
        var props = this.options;
        this.renderLabel();
        /** 响应式 */
        if (this.options.responsive && this.options.padding !== 'auto') {
            this.applyResponsive('afterRender');
        }
        if (props.conversionTag.visible) {
            this.conversionTag = new conversion_tag_1.default(tslib_1.__assign({ view: this.view, field: props.yField, transpose: true, animation: props.animation === false ? false : true }, props.conversionTag));
        }
        _super.prototype.afterRender.call(this);
    };
    BaseColumnLayer.prototype.geometryParser = function (dim, type) {
        if (dim === 'g2') {
            return G2_GEOM_MAP[type];
        }
        return PLOT_GEOM_MAP[type];
    };
    BaseColumnLayer.prototype.processData = function (originData) {
        var xField = this.options.xField;
        var processedData = [];
        util_1.each(originData, function (data) {
            var d = util_1.clone(data);
            d[xField] = d[xField].toString();
            processedData.push(d);
        });
        return processedData;
    };
    BaseColumnLayer.prototype.scale = function () {
        var options = this.options;
        var scales = {};
        /** 配置x-scale */
        scales[options.xField] = { type: 'cat' };
        if (util_1.has(options, 'xAxis')) {
            scale_1.extractScale(scales[options.xField], options.xAxis);
        }
        /** 配置y-scale */
        scales[options.yField] = {};
        if (util_1.has(options, 'yAxis')) {
            scale_1.extractScale(scales[options.yField], options.yAxis);
        }
        this.setConfig('scales', scales);
        _super.prototype.scale.call(this);
    };
    BaseColumnLayer.prototype.coord = function () {
        return;
    };
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    BaseColumnLayer.prototype.adjustColumn = function (column) {
        return;
    };
    BaseColumnLayer.prototype.addGeometry = function () {
        var options = this.options;
        var column = factory_1.getGeom('interval', 'main', {
            positionFields: [options.xField, options.yField],
            plot: this,
        });
        if (options.conversionTag.visible) {
            this.setConfig('theme', util_1.deepMix({}, this.getTheme(), {
                columnWidthRatio: 1 / 3,
            }));
        }
        this.adjustColumn(column);
        this.column = column;
        if (options.tooltip && (options.tooltip.fields || options.tooltip.formatter)) {
            this.geometryTooltip();
        }
        this.setConfig('geometry', column);
    };
    BaseColumnLayer.prototype.geometryTooltip = function () {
        this.column.tooltip = {};
        var tooltipOptions = this.options.tooltip;
        if (tooltipOptions.fields) {
            this.column.tooltip.fields = tooltipOptions.fields;
        }
        if (tooltipOptions.formatter) {
            this.column.tooltip.callback = tooltipOptions.formatter;
            if (!tooltipOptions.fields) {
                this.column.tooltip.fields = [this.options.xField, this.options.yField];
                if (this.options.colorField) {
                    this.column.tooltip.fields.push(this.options.colorField);
                }
            }
        }
    };
    BaseColumnLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        if (this.options.animation === false) {
            /** 关闭动画 */
            this.column.animate = false;
        }
    };
    BaseColumnLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    BaseColumnLayer.prototype.renderLabel = function () {
        var scales = this.config.scales;
        var _a = this.options, label = _a.label, yField = _a.yField;
        var scale = scales[yField];
        if (label === null || label === void 0 ? void 0 : label.visible) {
            var geometry = view_1.getGeometryByType(this.view, 'interval');
            this.doRenderLabel(geometry, tslib_1.__assign({ type: 'column', formatter: scale.formatter && (function (value) { return scale.formatter(value); }) }, this.options.label));
        }
    };
    BaseColumnLayer.prototype.applyResponsive = function (stage) {
        var _this = this;
        var methods = apply_responsive_1.default[stage];
        util_1.each(methods, function (r) {
            var responsive = r;
            responsive.method(_this);
        });
    };
    return BaseColumnLayer;
}(view_layer_1.default));
exports.default = BaseColumnLayer;
global_1.registerPlotType('column', BaseColumnLayer);
//# sourceMappingURL=layer.js.map