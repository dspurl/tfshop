import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import DonutLayer from '../../donut/layer';
var Ring = /** @class */ (function (_super) {
    __extends(Ring, _super);
    function Ring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ring.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'donut';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "Donut" instead of "Ring" which was not recommended.');
    };
    Ring.getDefaultOptions = DonutLayer.getDefaultOptions;
    return Ring;
}(BasePlot));
export default Ring;
//# sourceMappingURL=index.js.map