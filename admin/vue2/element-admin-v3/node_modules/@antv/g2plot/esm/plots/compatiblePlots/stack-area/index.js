import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import StackedAreaLayer from '../../stacked-area/layer';
var StackArea = /** @class */ (function (_super) {
    __extends(StackArea, _super);
    function StackArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackArea.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedArea';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "StackedArea" instead of "StackArea" which was not recommended.');
    };
    StackArea.getDefaultOptions = StackedAreaLayer.getDefaultOptions;
    return StackArea;
}(BasePlot));
export default StackArea;
//# sourceMappingURL=index.js.map