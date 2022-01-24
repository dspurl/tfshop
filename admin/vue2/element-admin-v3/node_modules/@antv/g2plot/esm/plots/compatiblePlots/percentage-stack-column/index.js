import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import PercentStackedColumnLayer from '../../percent-stacked-column/layer';
var PercentageStackColumn = /** @class */ (function (_super) {
    __extends(PercentageStackColumn, _super);
    function PercentageStackColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'percentStackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "PercentStackedColumn" instead of "PercentageStackColumn" which was not recommended.');
    };
    PercentageStackColumn.getDefaultOptions = PercentStackedColumnLayer.getDefaultOptions;
    return PercentageStackColumn;
}(BasePlot));
export default PercentageStackColumn;
//# sourceMappingURL=index.js.map