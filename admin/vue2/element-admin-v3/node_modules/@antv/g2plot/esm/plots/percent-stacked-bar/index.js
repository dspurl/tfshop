import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import PercentStackedBarLayer from './layer';
var PercentStackedBar = /** @class */ (function (_super) {
    __extends(PercentStackedBar, _super);
    function PercentStackedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentStackedBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    PercentStackedBar.getDefaultOptions = PercentStackedBarLayer.getDefaultOptions;
    return PercentStackedBar;
}(BasePlot));
export default PercentStackedBar;
//# sourceMappingURL=index.js.map