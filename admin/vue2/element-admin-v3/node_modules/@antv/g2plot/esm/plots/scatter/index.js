import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import ScatterLayer from './layer';
var Scatter = /** @class */ (function (_super) {
    __extends(Scatter, _super);
    function Scatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scatter.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'scatter';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Scatter.getDefaultOptions = ScatterLayer.getDefaultOptions;
    return Scatter;
}(BasePlot));
export default Scatter;
//# sourceMappingURL=index.js.map