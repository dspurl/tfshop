import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import FunnelLayer from './layer';
var Funnel = /** @class */ (function (_super) {
    __extends(Funnel, _super);
    function Funnel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Funnel.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'funnel';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Funnel.getDefaultOptions = FunnelLayer.getDefaultOptions;
    return Funnel;
}(BasePlot));
export default Funnel;
//# sourceMappingURL=index.js.map