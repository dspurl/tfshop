import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import GaugeLayer from './layer';
var Gauge = /** @class */ (function (_super) {
    __extends(Gauge, _super);
    function Gauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gauge.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'gauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Gauge.getDefaultOptions = GaugeLayer.getDefaultOptions;
    return Gauge;
}(BasePlot));
export default Gauge;
//# sourceMappingURL=index.js.map