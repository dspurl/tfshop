import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import ProgressLayer from './layer';
var Progress = /** @class */ (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Progress.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'progress';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Progress.prototype.update = function (value, style) {
        var layer = this.layers[0];
        layer.update(value, style);
    };
    Progress.getDefaultOptions = ProgressLayer.getDefaultOptions;
    return Progress;
}(BasePlot));
export default Progress;
//# sourceMappingURL=index.js.map