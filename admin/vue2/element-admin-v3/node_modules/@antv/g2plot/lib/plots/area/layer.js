"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var view_layer_1 = tslib_1.__importDefault(require("../../base/view-layer"));
var factory_1 = require("../../geoms/factory");
require("./component/label/area-point");
require("./component/label/area-point-auto");
var scale_1 = require("../../util/scale");
var apply_responsive_1 = tslib_1.__importDefault(require("./apply-responsive"));
var EventParser = tslib_1.__importStar(require("./event"));
require("./theme");
var view_1 = require("../../util/view");
var GEOM_MAP = {
    area: 'area',
    line: 'line',
    point: 'point',
};
var AreaLayer = /** @class */ (function (_super) {
    tslib_1.__extends(AreaLayer, _super);
    function AreaLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'area';
        return _this;
    }
    AreaLayer.getDefaultOptions = function () {
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
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
        if (util_1.has(props, 'xAxis')) {
            scale_1.extractScale(scales[props.xField], props.xAxis);
        }
        /** 配置y-scale */
        scales[props.yField] = {};
        if (util_1.has(props, 'yAxis')) {
            scale_1.extractScale(scales[props.yField], props.yAxis);
        }
        this.setConfig('scales', scales);
        _super.prototype.scale.call(this);
    };
    AreaLayer.prototype.coord = function () {
        return null;
    };
    AreaLayer.prototype.addGeometry = function () {
        var props = this.options;
        var area = factory_1.getGeom('area', 'main', {
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
        var lineConfig = util_1.deepMix({}, props.line);
        if (lineConfig.visible) {
            var line = factory_1.getGeom('line', 'guide', {
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
        var pointConfig = util_1.deepMix({}, props.point);
        if (pointConfig.visible) {
            var point = factory_1.getGeom('point', 'guide', {
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
            var geometry = view_1.getGeometryByType(this.view, 'area');
            this.doRenderLabel(geometry, tslib_1.__assign({ type: 'area-point', formatter: scale.formatter && (function (value) { return scale.formatter(value); }) }, this.options.label));
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
        var methods = apply_responsive_1.default[stage];
        util_1.each(methods, function (r) {
            var responsive = r;
            responsive.method(_this);
        });
    };
    return AreaLayer;
}(view_layer_1.default));
exports.default = AreaLayer;
global_1.registerPlotType('area', AreaLayer);
//# sourceMappingURL=layer.js.map