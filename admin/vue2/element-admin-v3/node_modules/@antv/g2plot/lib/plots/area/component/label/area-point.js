"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../../../../components/label/base");
var point_1 = tslib_1.__importDefault(require("../../../../components/label/point"));
var AreaPointLabel = /** @class */ (function (_super) {
    tslib_1.__extends(AreaPointLabel, _super);
    function AreaPointLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AreaPointLabel;
}(point_1.default));
exports.default = AreaPointLabel;
base_1.registerLabelComponent('area-point', AreaPointLabel);
//# sourceMappingURL=area-point.js.map