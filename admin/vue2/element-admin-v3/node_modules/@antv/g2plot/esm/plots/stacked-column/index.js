import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import StackedColumnLayer from './layer';
var StackedColumn = /** @class */ (function (_super) {
    __extends(StackedColumn, _super);
    function StackedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedColumn.getDefaultOptions = StackedColumnLayer.getDefaultOptions;
    return StackedColumn;
}(BasePlot));
export default StackedColumn;
//# sourceMappingURL=index.js.map