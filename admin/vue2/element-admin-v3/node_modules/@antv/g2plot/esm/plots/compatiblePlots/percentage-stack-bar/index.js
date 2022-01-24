import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import PercentStackedBarLayer from '../../percent-stacked-bar/layer';
var PercentageStackBar = /** @class */ (function (_super) {
    __extends(PercentageStackBar, _super);
    function PercentageStackBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "PercentStackedBar" instead of "PercentageStackBar" which was not recommended.');
    };
    PercentageStackBar.getDefaultOptions = PercentStackedBarLayer.getDefaultOptions;
    return PercentageStackBar;
}(BasePlot));
export default PercentageStackBar;
//# sourceMappingURL=index.js.map