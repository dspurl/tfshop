"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../../../../components/label/base");
var area_point_1 = tslib_1.__importDefault(require("../../../area/component/label/area-point"));
var StackedAreaPointLabel = /** @class */ (function (_super) {
    tslib_1.__extends(StackedAreaPointLabel, _super);
    function StackedAreaPointLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StackedAreaPointLabel;
}(area_point_1.default));
exports.default = StackedAreaPointLabel;
base_1.registerLabelComponent('stackedArea-point', StackedAreaPointLabel);
//# sourceMappingURL=area-point.js.map