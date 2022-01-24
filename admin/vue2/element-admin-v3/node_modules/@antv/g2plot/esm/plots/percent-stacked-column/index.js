import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import PercentStackedColumnLayer from './layer';
var PercentStackedColumn = /** @class */ (function (_super) {
    __extends(PercentStackedColumn, _super);
    function PercentStackedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentStackedColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    PercentStackedColumn.getDefaultOptions = PercentStackedColumnLayer.getDefaultOptions;
    return PercentStackedColumn;
}(BasePlot));
export default PercentStackedColumn;
//# sourceMappingURL=index.js.map