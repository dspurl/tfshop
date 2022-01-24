import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import StackedColumnLayer from '../../stacked-column/layer';
var StackColumn = /** @class */ (function (_super) {
    __extends(StackColumn, _super);
    function StackColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'stackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "StackedColumn" instead of "StackColumn" which was not recommended.');
    };
    StackColumn.getDefaultOptions = StackedColumnLayer.getDefaultOptions;
    return StackColumn;
}(BasePlot));
export default StackColumn;
//# sourceMappingURL=index.js.map