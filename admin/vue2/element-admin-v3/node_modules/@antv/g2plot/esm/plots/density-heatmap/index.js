import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import DensityHeatmapLayer from './layer';
var DensityHeatmap = /** @class */ (function (_super) {
    __extends(DensityHeatmap, _super);
    function DensityHeatmap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DensityHeatmap.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'densityHeatmap';
        _super.prototype.createLayers.call(this, layerProps);
    };
    DensityHeatmap.getDefaultOptions = DensityHeatmapLayer.getDefaultOptions;
    return DensityHeatmap;
}(BasePlot));
export default DensityHeatmap;
//# sourceMappingURL=index.js.map