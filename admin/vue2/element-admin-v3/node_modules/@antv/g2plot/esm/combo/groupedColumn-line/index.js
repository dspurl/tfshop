import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import GroupedColumnLineLayer from './layer';
var GroupedColumnLine = /** @class */ (function (_super) {
    __extends(GroupedColumnLine, _super);
    function GroupedColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedColumnLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'groupedColumnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedColumnLine.getDefaultOptions = GroupedColumnLineLayer.getDefaultOptions;
    return GroupedColumnLine;
}(BasePlot));
export default GroupedColumnLine;
//# sourceMappingURL=index.js.map