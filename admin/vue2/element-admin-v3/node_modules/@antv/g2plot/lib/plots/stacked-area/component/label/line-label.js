"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var line_label_1 = tslib_1.__importDefault(require("../../../line/component/label/line-label"));
/**
 * 复用扎线图的 label，并修改取值方式
 */
var AreaLineLabel = /** @class */ (function (_super) {
    tslib_1.__extends(AreaLineLabel, _super);
    function AreaLineLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaLineLabel.prototype.getShapeInfo = function (shape) {
        var originPoints = shape.get('origin').points;
        var lastPoint = originPoints[originPoints.length - 1];
        var color = shape.attr('stroke');
        var stackField = this.plot.options.stackField;
        var name = shape.get('origin').data[0][stackField];
        var y = util_1.reduce(lastPoint.y, function (r, a) {
            return r + a;
        }, 0) / util_1.size(lastPoint.y);
        return { x: lastPoint.x, y: y, color: color, name: name };
    };
    return AreaLineLabel;
}(line_label_1.default));
exports.default = AreaLineLabel;
//# sourceMappingURL=line-label.js.map