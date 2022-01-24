import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import PercentStackedAreaLayer from '../../percent-stacked-area/layer';
var PercentageStackArea = /** @class */ (function (_super) {
    __extends(PercentageStackArea, _super);
    function PercentageStackArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackArea.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedArea';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "PercentStackedArea" instead of "PercentageStackArea" which was not recommended.');
    };
    PercentageStackArea.getDefaultOptions = PercentStackedAreaLayer.getDefaultOptions;
    return PercentageStackArea;
}(BasePlot));
export default PercentageStackArea;
//# sourceMappingURL=index.js.map