import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import TreemapLayer from './layer';
var Treemap = /** @class */ (function (_super) {
    __extends(Treemap, _super);
    function Treemap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Treemap.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'treemap';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Treemap.getDefaultOptions = TreemapLayer.getDefaultOptions;
    return Treemap;
}(BasePlot));
export default Treemap;
//# sourceMappingURL=index.js.map