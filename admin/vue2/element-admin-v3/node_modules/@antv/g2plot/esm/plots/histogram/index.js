import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import HistogramLayer from './layer';
var Histogram = /** @class */ (function (_super) {
    __extends(Histogram, _super);
    function Histogram() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Histogram.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'histogram';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Histogram.getDefaultOptions = HistogramLayer.getDefaultOptions;
    return Histogram;
}(BasePlot));
export default Histogram;
//# sourceMappingURL=index.js.map