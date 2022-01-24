"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../../../../components/label/base");
var area_point_auto_1 = tslib_1.__importDefault(require("../../../area/component/label/area-point-auto"));
var StackedAreaPointAutoLabel = /** @class */ (function (_super) {
    tslib_1.__extends(StackedAreaPointAutoLabel, _super);
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
}(area_point_auto_1.default));
exports.default = StackedAreaPointAutoLabel;
base_1.registerLabelComponent('stackedArea-point-auto', StackedAreaPointAutoLabel);
//# sourceMappingURL=area-point-auto.js.map