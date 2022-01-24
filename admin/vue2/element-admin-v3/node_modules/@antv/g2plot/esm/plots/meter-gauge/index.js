import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import MeterGaugeLayer from './layer';
var MeterGauge = /** @class */ (function (_super) {
    __extends(MeterGauge, _super);
    function MeterGauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MeterGauge.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'meterGauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    MeterGauge.getDefaultOptions = MeterGaugeLayer.getDefaultOptions;
    return MeterGauge;
}(BasePlot));
export default MeterGauge;
//# sourceMappingURL=index.js.map