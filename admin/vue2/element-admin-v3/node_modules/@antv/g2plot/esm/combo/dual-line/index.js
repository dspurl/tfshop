import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import DualLineLayer from './layer';
var DualLine = /** @class */ (function (_super) {
    __extends(DualLine, _super);
    function DualLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DualLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'dualLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    DualLine.getDefaultOptions = DualLineLayer.getDefaultOptions;
    return DualLine;
}(BasePlot));
export default DualLine;
//# sourceMappingURL=index.js.map