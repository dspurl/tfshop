import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import GroupedColumnLayer from './layer';
var GroupedColumn = /** @class */ (function (_super) {
    __extends(GroupedColumn, _super);
    function GroupedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedColumn.getDefaultOptions = GroupedColumnLayer.getDefaultOptions;
    return GroupedColumn;
}(BasePlot));
export default GroupedColumn;
//# sourceMappingURL=index.js.map