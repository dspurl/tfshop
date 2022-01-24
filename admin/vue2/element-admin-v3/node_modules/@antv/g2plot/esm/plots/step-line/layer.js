import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import LineLayer from '../line/layer';
import { registerPlotType } from '../../base/global';
var StepLineLayer = /** @class */ (function (_super) {
    __extends(StepLineLayer, _super);
    function StepLineLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'step-line'; // 覆写父类的 type
        return _this;
    }
    StepLineLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            step: 'hv',
        });
    };
    return StepLineLayer;
}(LineLayer));
export { StepLineLayer };
registerPlotType('step-line', StepLineLayer);
//# sourceMappingURL=layer.js.map