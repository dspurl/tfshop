import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import RingProgressLayer from './layer';
var RingProgress = /** @class */ (function (_super) {
    __extends(RingProgress, _super);
    function RingProgress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RingProgress.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'ringProgress';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RingProgress.prototype.update = function (value) {
        var layer = this.layers[0];
        layer.update(value);
    };
    RingProgress.getDefaultOptions = RingProgressLayer.getDefaultOptions;
    return RingProgress;
}(BasePlot));
export default RingProgress;
//# sourceMappingURL=index.js.map