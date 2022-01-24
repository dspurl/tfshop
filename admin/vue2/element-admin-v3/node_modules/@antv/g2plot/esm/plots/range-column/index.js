import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import RangeColumnLayer from './layer';
var RangeColumn = /** @class */ (function (_super) {
    __extends(RangeColumn, _super);
    function RangeColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'rangeColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RangeColumn.getDefaultOptions = RangeColumnLayer.getDefaultOptions;
    return RangeColumn;
}(BasePlot));
export default RangeColumn;
//# sourceMappingURL=index.js.map