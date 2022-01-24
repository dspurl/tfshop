import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import GroupedRoseLayer from './layer';
var GroupedRose = /** @class */ (function (_super) {
    __extends(GroupedRose, _super);
    function GroupedRose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedRose.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedRose';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedRose.getDefaultOptions = GroupedRoseLayer.getDefaultOptions;
    return GroupedRose;
}(BasePlot));
export default GroupedRose;
//# sourceMappingURL=index.js.map