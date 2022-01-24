import { __extends } from "tslib";
import { registerLabelComponent } from '../../../components/label/base';
import BarLabel from '../../bar/component/label';
var StackedBarLabel = /** @class */ (function (_super) {
    __extends(StackedBarLabel, _super);
    function StackedBarLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedBarLabel.prototype.adjustLabel = function (label, element) {
        if (this.options.adjustPosition) {
            var labelRange = label.getBBox();
            var shapeRange = this.getElementShapeBBox(element);
            // label 有 offset
            if (shapeRange.maxX <= labelRange.maxX) {
                label.set('visible', false);
            }
        }
    };
    return StackedBarLabel;
}(BarLabel));
export default StackedBarLabel;
registerLabelComponent('stacked-bar', StackedBarLabel);
//# sourceMappingURL=label.js.map