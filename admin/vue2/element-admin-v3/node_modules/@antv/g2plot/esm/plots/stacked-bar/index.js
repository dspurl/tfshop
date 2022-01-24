import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import StackedBarLayer from './layer';
var StackedBar = /** @class */ (function (_super) {
    __extends(StackedBar, _super);
    function StackedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedBar.getDefaultOptions = StackedBarLayer.getDefaultOptions;
    return StackedBar;
}(BasePlot));
export default StackedBar;
//# sourceMappingURL=index.js.map