import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../../base/plot';
import warning from 'warning';
import GroupedBarLayer from '../../grouped-bar/layer';
var GroupBar = /** @class */ (function (_super) {
    __extends(GroupBar, _super);
    function GroupBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupBar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning(false, 'Please use "GroupedBar" instead of "GroupBar" which was not recommended.');
    };
    GroupBar.getDefaultOptions = GroupedBarLayer.getDefaultOptions;
    return GroupBar;
}(BasePlot));
export default GroupBar;
//# sourceMappingURL=index.js.map