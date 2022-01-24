"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../../../components/label/base");
var label_1 = tslib_1.__importDefault(require("../../bar/component/label"));
var StackedBarLabel = /** @class */ (function (_super) {
    tslib_1.__extends(StackedBarLabel, _super);
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
}(label_1.default));
exports.default = StackedBarLabel;
base_1.registerLabelComponent('stacked-bar', StackedBarLabel);
//# sourceMappingURL=label.js.map