import { __assign, __extends } from "tslib";
import { deepMix, has } from '@antv/util';
import * as EventParser from './event';
import ViewLayer from '../../base/view-layer';
import { extractScale } from '../../util/scale';
import { getComponent } from '../../components/factory';
import { getGeom } from '../../geoms/factory';
import { registerPlotType } from '../../base/global';
import BulletRect from './component/bulletRect';
import BulletTarget from './component/bulletTarget';
import './theme';
var G2_GEOM_MAP = {
    bullet: 'interval',
};
var PLOT_GEOM_MAP = {
    interval: 'bullet',
};
export var STACK_FIELD = '$$stackField$$';
export var X_FIELD = '$$xField$$';
export var Y_FIELD = '$$yField$$';
var BulletLayer = /** @class */ (function (_super) {
    __extends(BulletLayer, _super);
    function BulletLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'bullet';
        return _this;
    }
    BulletLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            data: [],
            stackField: STACK_FIELD,
            xField: X_FIELD,
            yField: Y_FIELD,
            rangeColors: ['rgba(91, 143, 249, 0.45)'],
            measureSize: 12,
            rangeSize: 2,
            markerSize: 2,
            markerColors: [],
            markerStyle: {
                width: 2,
                fill: '#5B8FF9',
                lineWidth: 0,
            },
            axis: {
                visible: false,
                position: 'before',
                tickCount: 6,
                formatter: function (text, idx) { return "" + idx; },
                style: {
                    fill: 'rgba(0, 0, 0, 0.25)',
                    textBaseline: 'middle',
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 16,
                },
                tickLine: {
                    visible: true,
                    lineWidth: 1,
                    stroke: '#FFF',
                    lineDash: [4, 2],
                },
            },
            xAxis: {
                visible: true,
                line: {
                    visible: false,
                },
                tickLine: {
                    visible: false,
                },
                label: {
                    visible: true,
                },
            },
            yAxis: {
                visible: false,
                nice: false,
            },
            tooltip: {
                visible: false,
                trigger: 'item',
                crosshairs: false,
            },
            label: {
                visible: true,
                offset: 4,
                style: {
                    fill: 'rgba(0, 0, 0, 0.45)',
                    stroke: '#fff',
                    lineWidth: 1,
                },
            },
        });
    };
    BulletLayer.prototype.afterRender = function () {
        _super.prototype.afterRender.call(this);
        this.view.removeInteraction('legend-filter');
    };
    BulletLayer.prototype.scale = function () {
        var options = this.options;
        var scales = {};
        /** 配置y-scale */
        scales[options.yField] = {};
        if (has(options, 'yAxis')) {
            extractScale(scales[options.yField], options.yAxis);
        }
        /** 配置x-scale */
        scales[options.xField] = {
            type: 'cat',
        };
        if (has(options, 'xAxis')) {
            extractScale(scales[options.xField], options.xAxis);
        }
        this.setConfig('scales', scales);
        _super.prototype.scale.call(this);
    };
    BulletLayer.prototype.getOptions = function (props) {
        var options = _super.prototype.getOptions.call(this, props);
        this.adjustOptions(options);
        return options;
    };
    BulletLayer.prototype.afterInit = function () {
        _super.prototype.afterInit.call(this);
        var options = this.options;
        var ranges = options.data.map(function (d) { return d.ranges; });
        var targets = options.data.map(function (d) { return d.targets; });
        this.bulletRect = new BulletRect(this.view, {
            ranges: ranges,
            rangeMax: options.rangeMax,
            yField: options.yField,
            rangeSize: options.rangeSize,
            rangeColors: options.rangeColors || [],
            axis: options.axis,
        });
        this.bulletTarget = new BulletTarget(this.view, {
            targets: targets,
            yField: options.yField,
            markerSize: options.markerSize,
            markerColors: options.markerColors || [],
            markerStyle: options.markerStyle,
        });
    };
    BulletLayer.prototype.geometryParser = function (dim, type) {
        if (dim === 'g2') {
            return G2_GEOM_MAP[type];
        }
        return PLOT_GEOM_MAP[type];
    };
    BulletLayer.prototype.coord = function () {
        this.setConfig('coordinate', {
            actions: [['transpose']],
        });
    };
    /** 自定义子弹图图例 */
    BulletLayer.prototype.legend = function () {
        var options = this.options;
        var markerColor = options.markerStyle.fill;
        var measureColors = options.measureColors || this.theme.colors;
        var items = [
            {
                name: '实际进度',
                value: '实际进度',
                marker: {
                    symbol: 'square',
                    style: {
                        fill: measureColors[0],
                    },
                },
            },
            {
                name: '目标值',
                value: '目标值',
                marker: {
                    symbol: 'line',
                    style: {
                        stroke: markerColor,
                        lineWidth: 2,
                    },
                },
            },
        ];
        var legendOptions = __assign({ custom: true, position: 'bottom', items: items }, options.legend);
        // @ts-ignore
        this.setConfig('legends', legendOptions);
    };
    BulletLayer.prototype.addGeometry = function () {
        var options = this.options;
        var bullet = getGeom('interval', 'main', {
            positionFields: [options.xField, options.yField],
            plot: this,
        });
        bullet.adjust = [
            {
                type: 'stack',
            },
        ];
        if (options.label) {
            bullet.label = this.extractLabel();
        }
        this.bullet = bullet;
        this.setConfig('geometry', bullet);
    };
    BulletLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    BulletLayer.prototype.extractLabel = function () {
        var options = this.options;
        var label = deepMix({}, options.label);
        if (label.visible === false) {
            return false;
        }
        var labelConfig = getComponent('label', __assign({ plot: this, labelType: 'barLabel', fields: [options.yField] }, label));
        return labelConfig;
    };
    BulletLayer.prototype.adjustOptions = function (options) {
        options.barSize = options.measureSize || 12;
        this.adjustYAxisOptions(options);
    };
    BulletLayer.prototype.adjustYAxisOptions = function (options) {
        var values = [];
        options.data.forEach(function (d) { return values.push(d.measures.reduce(function (a, b) { return a + b; }, 0)); });
        values.push(options.rangeMax);
        options.yAxis.max = Math.max.apply([], values);
    };
    BulletLayer.prototype.processData = function (dataOptions) {
        var options = this.options;
        var data = [];
        dataOptions.forEach(function (dataItem, dataIdx) {
            var _a;
            for (var valueIdx = 0; valueIdx < dataItem.measures.length; valueIdx += 1) {
                var value = dataItem.measures[valueIdx];
                var xField = dataItem.title || "" + dataIdx;
                data.push((_a = {},
                    _a[options.xField] = xField,
                    _a[options.yField] = value,
                    _a[options.stackField] = "" + valueIdx,
                    _a));
            }
        });
        return data;
    };
    return BulletLayer;
}(ViewLayer));
export default BulletLayer;
registerPlotType('bullet', BulletLayer);
//# sourceMappingURL=layer.js.map