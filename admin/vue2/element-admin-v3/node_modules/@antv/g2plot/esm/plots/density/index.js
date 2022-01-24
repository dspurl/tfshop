import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import DensityLayer from './layer';
var Density = /** @class */ (function (_super) {
    __extends(Density, _super);
    function Density() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Density.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'density';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Density.getDefaultOptions = DensityLayer.getDefaultOptions;
    return Density;
}(BasePlot));
export default Density;
//# sourceMappingURL=index.js.map