import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import RangeBarLayer from './layer';
var RangeBar = /** @class */ (function (_super) {
    __extends(RangeBar, _super);
    function RangeBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'rangeBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RangeBar.getDefaultOptions = RangeBarLayer.getDefaultOptions;
    return RangeBar;
}(BasePlot));
export default RangeBar;
//# sourceMappingURL=index.js.map