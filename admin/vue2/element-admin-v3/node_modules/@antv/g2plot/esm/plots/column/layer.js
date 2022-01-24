import { __assign, __extends } from "tslib";
import { deepMix, has, each, clone } from '@antv/util';
import { registerPlotType } from '../../base/global';
import ViewLayer from '../../base/view-layer';
import { getGeom } from '../../geoms/factory';
import ConversionTag from '../../components/conversion-tag';
import { extractScale } from '../../util/scale';
import responsiveMethods from './apply-responsive';
import './apply-responsive/theme';
import './component/label';
import './component/label-auto';
import * as EventParser from './event';
import './theme';
import { getGeometryByType } from '../../util/view';
var G2_GEOM_MAP = {
    column: 'interval',
};
var PLOT_GEOM_MAP = {
    interval: 'column',
};
var BaseColumnLayer = /** @class */ (function (_super) {
    __extends(BaseColumnLayer, _super);
    function BaseColumnLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'column';
        return _this;
    }
    BaseColumnLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
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
            this.conversionTag = new ConversionTag(__assign({ view: this.view, field: props.yField, transpose: true, animation: props.animation === false ? false : true }, props.conversionTag));
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
        each(originData, function (data) {
            var d = clone(data);
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
        if (has(options, 'xAxis')) {
            extractScale(scales[options.xField], options.xAxis);
        }
        /** 配置y-scale */
        scales[options.yField] = {};
        if (has(options, 'yAxis')) {
            extractScale(scales[options.yField], options.yAxis);
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
        var column = getGeom('interval', 'main', {
            positionFields: [options.xField, options.yField],
            plot: this,
        });
        if (options.conversionTag.visible) {
            this.setConfig('theme', deepMix({}, this.getTheme(), {
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
            var geometry = getGeometryByType(this.view, 'interval');
            this.doRenderLabel(geometry, __assign({ type: 'column', formatter: scale.formatter && (function (value) { return scale.formatter(value); }) }, this.options.label));
        }
    };
    BaseColumnLayer.prototype.applyResponsive = function (stage) {
        var _this = this;
        var methods = responsiveMethods[stage];
        each(methods, function (r) {
            var responsive = r;
            responsive.method(_this);
        });
    };
    return BaseColumnLayer;
}(ViewLayer));
export default BaseColumnLayer;
registerPlotType('column', BaseColumnLayer);
//# sourceMappingURL=layer.js.map