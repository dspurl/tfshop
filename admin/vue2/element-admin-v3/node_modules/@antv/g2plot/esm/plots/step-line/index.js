import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import { StepLineLayer } from './layer';
import BasePlot from '../../base/plot';
var StepLine = /** @class */ (function (_super) {
    __extends(StepLine, _super);
    function StepLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 复写父类方法
     * @param props
     */
    StepLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'step-line';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StepLine.getDefaultOptions = StepLineLayer.getDefaultOptions;
    return StepLine;
}(BasePlot));
export default StepLine;
//# sourceMappingURL=index.js.map