import { __assign, __extends } from "tslib";
import { deepMix, has, each } from '@antv/util';
import { registerPlotType } from '../../base/global';
import ViewLayer from '../../base/view-layer';
import { getGeom } from '../../geoms/factory';
import './component/label/area-point';
import './component/label/area-point-auto';
import { extractScale } from '../../util/scale';
import responsiveMethods from './apply-responsive';
import * as EventParser from './event';
import './theme';
import { getGeometryByType } from '../../util/view';
var GEOM_MAP = {
    area: 'area',
    line: 'line',
    point: 'point',
};
var AreaLayer = /** @class */ (function (_super) {
    __extends(AreaLayer, _super);
    function AreaLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'area';
        return _this;
    }
    AreaLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            smooth: false,
            areaStyle: {
                opacity: 0.25,
            },
            line: {
                visible: true,
                size: 2,
                style: {
                    opacity: 1,
                    lineJoin: 'round',
                    lineCap: 'round',
                },
            },
            point: {
                visible: false,
                size: 4,
                shape: 'point',
            },
            label: {
                visible: false,
                type: 'point',
            },
            legend: {
                visible: true,
                position: 'top-left',
                wordSpacing: 4,
            },
            tooltip: {
                visible: true,
                shared: true,
                showCrosshairs: true,
                crosshairs: {
                    type: 'x',
                },
                offset: 20,
            },
        });
    };
    AreaLayer.prototype.beforeInit = function () {
        _super.prototype.beforeInit.call(this);
        /** 响应式图形 */
        if (this.options.responsive && this.options.padding !== 'auto') {
            this.applyResponsive('preRender');
        }
    };
    AreaLayer.prototype.afterRender = function () {
        this.renderLabel();
        /** 响应式 */
        if (this.options.responsive && this.options.padding !== 'auto') {
            this.applyResponsive('afterRender');
        }
        _super.prototype.afterRender.call(this);
    };
    AreaLayer.prototype.geometryParser = function (dim, type) {
        return GEOM_MAP[type];
    };
    AreaLayer.prototype.scale = function () {
        var props = this.options;
        var scales = {};
        /** 配置x-scale */
        scales[props.xField] = {
            type: 'cat',
        };
        if (has(props, 'xAxis')) {
            extractScale(scales[props.xField], props.xAxis);
        }
        /** 配置y-scale */
        scales[props.yField] = {};
        if (has(props, 'yAxis')) {
            extractScale(scales[props.yField], props.yAxis);
        }
        this.setConfig('scales', scales);
        _super.prototype.scale.call(this);
    };
    AreaLayer.prototype.coord = function () {
        return null;
    };
    AreaLayer.prototype.addGeometry = function () {
        var props = this.options;
        var area = getGeom('area', 'main', {
            plot: this,
        });
        this.area = area;
        if (props.label) {
            this.label();
        }
        if (props.tooltip && (props.tooltip.fields || props.tooltip.formatter)) {
            this.geometryTooltip();
        }
        this.adjustArea(area);
        this.setConfig('geometry', area);
        this.addLine();
        this.addPoint();
    };
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    AreaLayer.prototype.adjustArea = function (area) {
        return;
    };
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    AreaLayer.prototype.adjustLine = function (line) {
        return;
    };
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    AreaLayer.prototype.adjustPoint = function (point) {
        return;
    };
    AreaLayer.prototype.addLine = function () {
        var props = this.options;
        var lineConfig = deepMix({}, props.line);
        if (lineConfig.visible) {
            var line = getGeom('line', 'guide', {
                type: 'line',
                plot: this,
                line: lineConfig,
            });
            this.adjustLine(line);
            this.setConfig('geometry', line);
            this.line = line;
        }
    };
    AreaLayer.prototype.addPoint = function () {
        var props = this.options;
        var pointConfig = deepMix({}, props.point);
        if (pointConfig.visible) {
            var point = getGeom('point', 'guide', {
                plot: this,
            });
            this.adjustPoint(point);
            this.setConfig('geometry', point);
            this.point = point;
        }
    };
    AreaLayer.prototype.renderLabel = function () {
        var scales = this.config.scales;
        var _a = this.options, label = _a.label, yField = _a.yField;
        var scale = scales[yField];
        if (label.visible) {
            var geometry = getGeometryByType(this.view, 'area');
            this.doRenderLabel(geometry, __assign({ type: 'area-point', formatter: scale.formatter && (function (value) { return scale.formatter(value); }) }, this.options.label));
        }
    };
    AreaLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        var props = this.options;
        if (props.animation === false) {
            // 关闭动画
            this.area.animate = false;
            if (this.line)
                this.line.animate = false;
            if (this.point)
                this.point.animate = false;
        }
    };
    AreaLayer.prototype.label = function () {
        return;
    };
    AreaLayer.prototype.geometryTooltip = function () {
        this.area.tooltip = {};
        var tooltipOptions = this.options.tooltip;
        if (tooltipOptions.fields) {
            this.area.tooltip.fields = tooltipOptions.fields;
        }
        if (tooltipOptions.formatter) {
            this.area.tooltip.callback = tooltipOptions.formatter;
            if (!tooltipOptions.fields) {
                this.area.tooltip.fields = [this.options.xField, this.options.yField];
                if (this.options.seriesField) {
                    this.area.tooltip.fields.push(this.options.seriesField);
                }
            }
        }
    };
    AreaLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    AreaLayer.prototype.applyResponsive = function (stage) {
        var _this = this;
        var methods = responsiveMethods[stage];
        each(methods, function (r) {
            var responsive = r;
            responsive.method(_this);
        });
    };
    return AreaLayer;
}(ViewLayer));
export default AreaLayer;
registerPlotType('area', AreaLayer);
//# sourceMappingURL=layer.js.map