import { __extends } from "tslib";
import { registerLabelComponent } from '../../../../components/label/base';
import AreaPointAutoLabel from '../../../area/component/label/area-point-auto';
var StackedAreaPointAutoLabel = /** @class */ (function (_super) {
    __extends(StackedAreaPointAutoLabel, _super);
    function StackedAreaPointAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** 对堆积面积使用自定义的排序 */
    StackedAreaPointAutoLabel.prototype.sortLabels = function (geometry, labels) {
        var sorted = [];
        if (labels.length > 0) {
            sorted.push(labels.shift());
        }
        if (labels.length > 0) {
            sorted.push(labels.pop());
        }
        sorted.push.apply(sorted, labels);
        return sorted;
    };
    return StackedAreaPointAutoLabel;
}(AreaPointAutoLabel));
export default StackedAreaPointAutoLabel;
registerLabelComponent('stackedArea-point-auto', StackedAreaPointAutoLabel);
//# sourceMappingURL=area-point-auto.js.map