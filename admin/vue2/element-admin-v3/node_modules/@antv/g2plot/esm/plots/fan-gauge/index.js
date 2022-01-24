import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import FanGaugeLayer from './layer';
var FanGauge = /** @class */ (function (_super) {
    __extends(FanGauge, _super);
    function FanGauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FanGauge.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'fanGauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    FanGauge.getDefaultOptions = FanGaugeLayer.getDefaultOptions;
    return FanGauge;
}(BasePlot));
export default FanGauge;
//# sourceMappingURL=index.js.map