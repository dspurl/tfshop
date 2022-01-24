import { __extends } from "tslib";
/**
 * Create By Bruce Too
 * On 2020-02-18
 */
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import WaterfallLayer from './layer';
var Waterfall = /** @class */ (function (_super) {
    __extends(Waterfall, _super);
    function Waterfall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Waterfall.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'waterfall';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Waterfall.getDefaultOptions = WaterfallLayer.getDefaultOptions;
    return Waterfall;
}(BasePlot));
export default Waterfall;
//# sourceMappingURL=index.js.map