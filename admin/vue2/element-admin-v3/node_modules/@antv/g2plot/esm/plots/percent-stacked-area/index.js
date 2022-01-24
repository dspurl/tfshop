import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import PercentStackedAreaLayer from './layer';
var PercentStackedArea = /** @class */ (function (_super) {
    __extends(PercentStackedArea, _super);
    function PercentStackedArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentStackedArea.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedArea';
        _super.prototype.createLayers.call(this, layerProps);
    };
    PercentStackedArea.getDefaultOptions = PercentStackedAreaLayer.getDefaultOptions;
    return PercentStackedArea;
}(BasePlot));
export default PercentStackedArea;
//# sourceMappingURL=index.js.map