import { __assign, __extends } from "tslib";
import { each, clone } from '@antv/util';
import PieBaseLabel from './base-label';
import { getOverlapInfo } from './utils';
import { distBetweenPoints } from '../../../../util/math';
export function percent2Number(value) {
    var percentage = Number(value.endsWith('%') ? value.slice(0, -1) : value);
    return percentage / 100;
}
var PieInnerLabel = /** @class */ (function (_super) {
    __extends(PieInnerLabel, _super);
    function PieInnerLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @override 不能大于0 */
    PieInnerLabel.prototype.adjustOption = function (options) {
        _super.prototype.adjustOption.call(this, options);
        if (options.offset > 0) {
            options.offset = 0;
        }
    };
    PieInnerLabel.prototype.adjustItem = function (item) {
        item.textAlign = 'middle';
    };
    /** @override 不绘制拉线 */
    PieInnerLabel.prototype.drawLines = function () {
        return;
    };
    PieInnerLabel.prototype.layout = function (labels, shapeInfos) {
        var _this = this;
        labels.forEach(function (label, idx) {
            if (idx > 0) {
                each(labels.slice(0, idx), function (prevLabel) {
                    _this.resolveCollision(label, prevLabel, shapeInfos[idx]);
                });
            }
        });
    };
    PieInnerLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            offsetX: 0,
            offsetY: 0,
            offset: '-30%',
            style: __assign(__assign({}, labelStyle), { textAlign: 'center', textBaseline: 'middle' }),
        };
    };
    /** label 碰撞调整 */
    PieInnerLabel.prototype.resolveCollision = function (label, prev, shapeInfo) {
        var center = this.getCoordinate().center;
        var angle = shapeInfo.angle;
        var box = label.getBBox();
        var prevBBox = prev.getBBox();
        var pos = { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
        // 两种调整方案
        /** 先偏移 x 方向 -> 再计算 y 位置 */
        var pos1 = clone(pos);
        /** 先偏移 y 方向 -> 再计算 x 位置 */
        var pos2 = clone(pos);
        // check overlap
        if (prev.get('id') !== label.get('id')) {
            var _a = getOverlapInfo(box, prevBBox), xOverlap = _a.xOverlap, yOverlap = _a.yOverlap;
            if (xOverlap) {
                pos1.x = pos.x + xOverlap;
                pos1.y = pos.y + Math.tan(angle) * xOverlap;
            }
            if (yOverlap) {
                // fix issue-460
                var yMover = yOverlap;
                if (pos.y < center.y) {
                    // 上方label优先往上偏移
                    yMover = yMover < 0 ? yMover : prevBBox.minY - box.maxY;
                }
                else {
                    // 下方label优先往下偏移
                    yMover = yMover > 0 ? yMover : prevBBox.maxY - box.minY;
                }
                pos2.y = pos.y + yMover;
                pos2.x = pos.x + yMover / Math.tan(angle);
            }
            var dist1 = distBetweenPoints(pos, pos1);
            var dist2 = distBetweenPoints(pos, pos2);
            var actualPos = dist1 < dist2 ? pos1 : pos2;
            // 取偏移距离最小的
            label.attr('x', actualPos.x);
            label.attr('y', actualPos.y);
        }
    };
    return PieInnerLabel;
}(PieBaseLabel));
export default PieInnerLabel;
//# sourceMappingURL=inner-label.js.map