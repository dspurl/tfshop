import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import StackedAreaLayer from './layer';
var StackedArea = /** @class */ (function (_super) {
    __extends(StackedArea, _super);
    function StackedArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedArea.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedArea';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedArea.getDefaultOptions = StackedAreaLayer.getDefaultOptions;
    return StackedArea;
}(BasePlot));
export default StackedArea;
//# sourceMappingURL=index.js.map