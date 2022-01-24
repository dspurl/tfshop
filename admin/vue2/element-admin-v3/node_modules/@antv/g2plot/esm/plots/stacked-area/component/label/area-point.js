import { __extends } from "tslib";
import { registerLabelComponent } from '../../../../components/label/base';
import AreaPointLabel from '../../../area/component/label/area-point';
var StackedAreaPointLabel = /** @class */ (function (_super) {
    __extends(StackedAreaPointLabel, _super);
    function StackedAreaPointLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StackedAreaPointLabel;
}(AreaPointLabel));
export default StackedAreaPointLabel;
registerLabelComponent('stackedArea-point', StackedAreaPointLabel);
//# sourceMappingURL=area-point.js.map