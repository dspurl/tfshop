import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import ColumnLineLayer from './layer';
var ColumnLine = /** @class */ (function (_super) {
    __extends(ColumnLine, _super);
    function ColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'columnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    ColumnLine.getDefaultOptions = ColumnLineLayer.getDefaultOptions;
    return ColumnLine;
}(BasePlot));
export default ColumnLine;
//# sourceMappingURL=index.js.map