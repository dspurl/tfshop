import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import StackedBarLayer from '../../stacked-bar/layer';
var StackBar = /** @class */ (function (_super) {
    __extends(StackBar, _super);
    function StackBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "StackedBar" instead of "StackBar" which was not recommended.');
    };
    StackBar.getDefaultOptions = StackedBarLayer.getDefaultOptions;
    return StackBar;
}(BasePlot));
export default StackBar;
//# sourceMappingURL=index.js.map