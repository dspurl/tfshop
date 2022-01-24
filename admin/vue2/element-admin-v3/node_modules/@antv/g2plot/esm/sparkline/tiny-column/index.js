import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import TinyColumnLayer from './layer';
var TinyColumn = /** @class */ (function (_super) {
    __extends(TinyColumn, _super);
    function TinyColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'tinyColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyColumn.getDefaultOptions = TinyColumnLayer.getDefaultOptions;
    return TinyColumn;
}(BasePlot));
export default TinyColumn;
//# sourceMappingURL=index.js.map