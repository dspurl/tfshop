import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import StackedColumnLineLayer from './layer';
var StackedColumnLine = /** @class */ (function (_super) {
    __extends(StackedColumnLine, _super);
    function StackedColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedColumnLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedColumnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedColumnLine.getDefaultOptions = StackedColumnLineLayer.getDefaultOptions;
    return StackedColumnLine;
}(BasePlot));
export default StackedColumnLine;
//# sourceMappingURL=index.js.map