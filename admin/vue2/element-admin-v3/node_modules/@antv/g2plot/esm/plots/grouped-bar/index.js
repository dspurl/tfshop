import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import GroupedBarLayer from './layer';
var GroupedBar = /** @class */ (function (_super) {
    __extends(GroupedBar, _super);
    function GroupedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedBar.getDefaultOptions = GroupedBarLayer.getDefaultOptions;
    return GroupedBar;
}(BasePlot));
export default GroupedBar;
//# sourceMappingURL=index.js.map