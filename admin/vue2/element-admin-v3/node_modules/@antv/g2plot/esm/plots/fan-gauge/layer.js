import { __extends } from "tslib";
import { deepMix, uniqueId } from '@antv/util';
import { registerPlotType } from '../../base/global';
import GaugeLayer from '../gauge/layer';
import { GaugeShape } from '../gauge/geometry/shape/gauge-shape';
var FanGaugeLayer = /** @class */ (function (_super) {
    __extends(FanGaugeLayer, _super);
    function FanGaugeLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'fanGauge';
        return _this;
    }
    FanGaugeLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            rangeColor: '#F6445A',
            rangeSize: 70,
            axis: {
                visible: true,
                offset: 5,
                tickCount: 10,
                subTickCount: 4,
                tickLine: {
                    visible: true,
                    length: 3,
                    style: {
                        stroke: '#aaa',
                        lineWidth: 3,
                    },
                },
                label: {
                    visible: true,
                    style: {
                        fill: '#aaa',
                        fontSize: 16,
                        textAlign: 'center',
                        textBaseline: 'middle',
                    },
                },
            },
        });
    };
    FanGaugeLayer.prototype.initG2Shape = function () {
        this.gaugeShape = new GaugeShape(uniqueId());
        this.gaugeShape.setOption(this.type, deepMix({}, this.options, {
            radius: 1,
            angle: 120,
            textPosition: '125%',
            bottomRatio: 3.5,
        }));
        this.gaugeShape.render();
    };
    FanGaugeLayer.prototype.axis = function () {
        var axesConfig = {
            value: false,
            1: false,
        };
        this.setConfig('axes', axesConfig);
    };
    FanGaugeLayer.prototype.annotation = function () {
        var statistic = this.options.statistic;
        var annotationConfigs = [];
        // @ts-ignore
        if (statistic && statistic.visible) {
            var statistics = this.renderStatistic();
            annotationConfigs.push(statistics);
        }
        var siderTexts = this.renderSideText();
        var allAnnotations = annotationConfigs.concat(siderTexts);
        this.setConfig('annotations', allAnnotations);
    };
    FanGaugeLayer.prototype.renderSideText = function () {
        var _a = this.options, max = _a.max, min = _a.min, format = _a.format, rangeSize = _a.rangeSize, axis = _a.axis;
        var OFFSET_Y = 12;
        return [min, max].map(function (value, index) {
            return {
                type: 'text',
                top: true,
                position: ['50%', '50%'],
                content: format(value),
                style: deepMix({}, axis.label.style, {
                    textAlign: 'center',
                }),
                offsetX: !index ? -rangeSize : rangeSize,
                offsetY: OFFSET_Y,
            };
        });
    };
    return FanGaugeLayer;
}(GaugeLayer));
export default FanGaugeLayer;
registerPlotType('fanGauge', FanGaugeLayer);
//# sourceMappingURL=layer.js.map