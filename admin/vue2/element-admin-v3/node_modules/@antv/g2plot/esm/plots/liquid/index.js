import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import LiquidLayer from './layer';
var Liquid = /** @class */ (function (_super) {
    __extends(Liquid, _super);
    function Liquid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Liquid.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'liquid';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Liquid.prototype.changeValue = function (value, all) {
        if (all === void 0) { all = false; }
        if (all) {
            this.eachLayer(function (layer) {
                if (layer instanceof LiquidLayer) {
                    layer.changeValue(value);
                }
            });
        }
        else {
            var layer = this.layers[0];
            if (layer instanceof LiquidLayer) {
                layer.changeValue(value);
            }
        }
    };
    Liquid.getDefaultOptions = LiquidLayer.getDefaultOptions;
    return Liquid;
}(BasePlot));
export default Liquid;
//# sourceMappingURL=index.js.map