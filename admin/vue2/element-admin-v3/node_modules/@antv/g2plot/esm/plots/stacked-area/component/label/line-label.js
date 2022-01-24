import { __extends } from "tslib";
import { reduce, size } from '@antv/util';
import LineLabel from '../../../line/component/label/line-label';
/**
 * 复用扎线图的 label，并修改取值方式
 */
var AreaLineLabel = /** @class */ (function (_super) {
    __extends(AreaLineLabel, _super);
    function AreaLineLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaLineLabel.prototype.getShapeInfo = function (shape) {
        var originPoints = shape.get('origin').points;
        var lastPoint = originPoints[originPoints.length - 1];
        var color = shape.attr('stroke');
        var stackField = this.plot.options.stackField;
        var name = shape.get('origin').data[0][stackField];
        var y = reduce(lastPoint.y, function (r, a) {
            return r + a;
        }, 0) / size(lastPoint.y);
        return { x: lastPoint.x, y: y, color: color, name: name };
    };
    return AreaLineLabel;
}(LineLabel));
export default AreaLineLabel;
//# sourceMappingURL=line-label.js.map