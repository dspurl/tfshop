import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import { registerPlotType } from '../../base/global';
import GaugeLayer from '../gauge/layer';
var MeterGaugeLayer = /** @class */ (function (_super) {
    __extends(MeterGaugeLayer, _super);
    function MeterGaugeLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'meterGauge';
        return _this;
    }
    MeterGaugeLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            axis: {
                visible: true,
                offset: -10,
                tickCount: 25,
                subTickCount: 4,
                tickLine: {
                    visible: true,
                    length: 2,
                    style: {
                        stroke: '#aaa',
                        lineWidth: 1,
                    },
                },
            },
        });
    };
    return MeterGaugeLayer;
}(GaugeLayer));
export default MeterGaugeLayer;
registerPlotType('meterGauge', MeterGaugeLayer);
//# sourceMappingURL=layer.js.map