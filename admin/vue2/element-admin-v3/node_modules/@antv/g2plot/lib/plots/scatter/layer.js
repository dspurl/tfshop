"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var view_layer_1 = tslib_1.__importDefault(require("../../base/view-layer"));
var factory_1 = require("../../geoms/factory");
var scale_1 = require("../../util/scale");
var quadrant_1 = tslib_1.__importDefault(require("./components/quadrant"));
var trendline_1 = tslib_1.__importDefault(require("./components/trendline"));
var EventParser = tslib_1.__importStar(require("./event"));
var factory_2 = require("../../components/factory");
require("./theme");
var G2_GEOM_MAP = {
    scatter: 'point',
};
var PLOT_GEOM_MAP = {
    point: 'point',
};
var ScatterLayer = /** @class */ (function (_super) {
    tslib_1.__extends(ScatterLayer, _super);
    function ScatterLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'scatter';
        return _this;
    }
    ScatterLayer.getDefaultOptions = function () {
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
            pointSize: 4,
            pointStyle: {
                lineWidth: 1,
                strokeOpacity: 1,
                fillOpacity: 0.95,
                stroke: '#fff',
            },
            xAxis: {
                nice: true,
                grid: {
                    visible: true,
                },
                line: {
                    visible: true,
                },
            },
            yAxis: {
                nice: true,
                grid: {
                    visible: true,
                },
                line: {
                    visible: true,
                },
            },
            tooltip: {
                visible: true,
                // false 会造成 tooltip 只能显示一条数据，true 会造成 tooltip 在空白区域也会显示
                shared: null,
                showTitle: false,
                showMarkers: false,
                showCrosshairs: false,
            },
            label: {
                visible: false,
            },
            shape: 'circle',
        });
    };
    ScatterLayer.prototype.afterRender = function () {
        _super.prototype.afterRender.call(this);
        if (this.quadrant) {
            this.quadrant.destroy();
        }
        if (this.trendline) {
            this.trendline.destroy();
        }
        if (this.options.quadrant && this.options.quadrant.visible) {
            this.quadrant = new quadrant_1.default(tslib_1.__assign({ view: this.view, plotOptions: this.options }, this.options.quadrant));
            this.quadrant.render();
        }
        if (this.options.trendline && this.options.trendline.visible) {
            this.trendline = new trendline_1.default(tslib_1.__assign({ view: this.view, plotOptions: this.options }, this.options.trendline));
            this.trendline.render();
        }
    };
    ScatterLayer.prototype.destroy = function () {
        if (this.quadrant) {
            this.quadrant.destroy();
            this.quadrant = null;
        }
        if (this.trendline) {
            this.trendline.destroy();
            this.trendline = null;
        }
        _super.prototype.destroy.call(this);
    };
    ScatterLayer.prototype.isValidLinearValue = function (value) {
        if (util_1.isNil(value)) {
            return false;
        }
        else if (Number.isNaN(Number(value))) {
            return false;
        }
        return true;
    };
    ScatterLayer.prototype.processData = function (data) {
        var _this = this;
        var _a = this.options, xField = _a.xField, yField = _a.yField;
        var xAxisType = util_1.get(this.options, ['xAxis', 'type'], 'linear');
        var yAxisType = util_1.get(this.options, ['yAxis', 'type'], 'linear');
        if (xAxisType && yAxisType) {
            var fiteredData = data
                .filter(function (item) {
                if (xAxisType === 'linear' && !_this.isValidLinearValue(item[xField])) {
                    return false;
                }
                if (yAxisType === 'linear' && !_this.isValidLinearValue(item[yField])) {
                    return false;
                }
                return true;
            })
                .map(function (item) {
                var _a;
                return tslib_1.__assign(tslib_1.__assign({}, item), (_a = {}, _a[xField] = xAxisType === 'linear' ? Number(item[xField]) : String(item[xField]), _a[yField] = yAxisType === 'linear' ? Number(item[yField]) : String(item[yField]), _a));
            });
            return fiteredData;
        }
        return data;
    };
    ScatterLayer.prototype.geometryParser = function (dim, type) {
        if (dim === 'g2') {
            return G2_GEOM_MAP[type];
        }
        return PLOT_GEOM_MAP[type];
    };
    ScatterLayer.prototype.scale = function () {
        var props = this.options;
        var scales = {};
        /** 配置x-scale */
        scales[props.xField] = {};
        if (util_1.has(props, 'xAxis')) {
            scale_1.extractScale(scales[props.xField], props.xAxis);
        }
        /** 配置y-scale */
        scales[props.yField] = {};
        if (util_1.has(props, 'yAxis')) {
            scale_1.extractScale(scales[props.yField], props.yAxis);
        }
        var timeLineInteraction = util_1.find(props.interactions, function (interaction) {
            return interaction.type === 'timeline';
        });
        if (timeLineInteraction && util_1.get(timeLineInteraction, 'cfg.key')) {
            var keyField = timeLineInteraction.cfg.key;
            if (scales[keyField]) {
                scales[keyField].key = true;
            }
            else {
                scales[keyField] = { key: true };
            }
        }
        this.setConfig('scales', scales);
        _super.prototype.scale.call(this);
    };
    ScatterLayer.prototype.coord = function () {
        return;
    };
    ScatterLayer.prototype.annotation = function () {
        return;
    };
    ScatterLayer.prototype.addGeometry = function () {
        var points = factory_1.getGeom('point', 'circle', {
            plot: this,
        });
        this.points = points;
        if (this.options.tooltip && this.options.tooltip.visible) {
            var _a = this.options.tooltip, showTitle = _a.showTitle, titleField = _a.titleField;
            this.extractTooltip();
            this.setConfig('tooltip', tslib_1.__assign({ showTitle: showTitle, title: showTitle ? titleField : undefined }, this.options.tooltip));
        }
        if (this.options.label) {
            this.label();
        }
        this.setConfig('geometry', points);
    };
    ScatterLayer.prototype.label = function () {
        var props = this.options;
        if (props.label.visible === false) {
            if (this.points) {
                this.points.label = false;
            }
            return;
        }
        var label = factory_2.getComponent('label', tslib_1.__assign(tslib_1.__assign({ fields: props.label.field ? [props.label.field] : [props.yField] }, props.label), { plot: this }));
        if (this.points) {
            this.points.label = label;
        }
    };
    ScatterLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        var props = this.options;
        if (props.animation === false) {
            /** 关闭动画 */
            this.points.animate = false;
        }
    };
    ScatterLayer.prototype.parseEvents = function (eventParser) {
        // 气泡图继承散点图时，会存在 eventParser
        _super.prototype.parseEvents.call(this, eventParser || EventParser);
    };
    ScatterLayer.prototype.extractTooltip = function () {
        this.points.tooltip = {};
        var tooltipOptions = this.options.tooltip;
        if (tooltipOptions.fields) {
            this.points.tooltip.fields = tooltipOptions.fields;
        }
        else {
            this.points.tooltip.fields = [this.options.xField, this.options.yField];
        }
        if (tooltipOptions.formatter) {
            this.points.tooltip.callback = tooltipOptions.formatter;
            if (this.options.colorField) {
                this.points.tooltip.fields.push(this.options.colorField);
            }
        }
    };
    return ScatterLayer;
}(view_layer_1.default));
exports.default = ScatterLayer;
global_1.registerPlotType('scatter', ScatterLayer);
//# sourceMappingURL=layer.js.map