import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import GroupedColumnLayer from '../../grouped-column/layer';
var GroupColumn = /** @class */ (function (_super) {
    __extends(GroupColumn, _super);
    function GroupColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupColumn.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "GroupedColumn" instead of "GroupColumn" which was not recommended.');
    };
    GroupColumn.getDefaultOptions = GroupedColumnLayer.getDefaultOptions;
    return GroupColumn;
}(BasePlot));
export default GroupColumn;
//# sourceMappingURL=index.js.map