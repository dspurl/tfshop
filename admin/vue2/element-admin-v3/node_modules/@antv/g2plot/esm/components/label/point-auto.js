import { __extends } from "tslib";
import { groupBy, each, keys } from '@antv/util';
import { registerLabelComponent } from './base';
import PointLabel from './point';
import { FIELD_ORIGIN, ORIGIN } from '../../dependents';
import { checkOriginEqual, moveInPanel, checkShapeOverlap } from '../../util/view';
import BBox from '../../util/bbox';
var PointAutoLabel = /** @class */ (function (_super) {
    __extends(PointAutoLabel, _super);
    function PointAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PointAutoLabel.prototype.layoutLabels = function (geometry, labels) {
        var _this = this;
        var _a;
        var dones = [];
        var panel = BBox.fromBBoxObject(this.getCoordinateBBox());
        var _b = geometry.getXYFields(), xField = _b[0], yField = _b[1];
        var groupedMap = groupBy(labels, function (label) { return label.get(ORIGIN)[FIELD_ORIGIN][xField]; });
        var offset = (_a = labels[0]) === null || _a === void 0 ? void 0 : _a.get('offset');
        each(keys(groupedMap).reverse(), function (xValue) {
            var group = _this.sortLabels(geometry, groupedMap[xValue]);
            while (group.length) {
                var label = group.shift();
                if (checkOriginEqual(label, dones, function (datumLeft, datumRight) {
                    return datumLeft._origin[xField] === datumRight._origin[xField] &&
                        datumLeft._origin[yField] === datumRight._origin[yField];
                })) {
                    label.set('visible', false);
                    continue;
                }
                moveInPanel(label, panel);
                var upFail = checkShapeOverlap(label, dones);
                var downFail = void 0;
                if (upFail) {
                    label.attr('y', label.attr('y') + 2 * offset);
                    moveInPanel(label, panel);
                    downFail = checkShapeOverlap(label, dones);
                }
                if (downFail) {
                    label.set('visible', false);
                    continue;
                }
                dones.push(label);
            }
        });
    };
    /** 对 Labels 排序，排序顺序决定自动布局优先级 */
    PointAutoLabel.prototype.sortLabels = function (geometry, labels) {
        var yField = geometry.getXYFields()[1];
        var sorted = [];
        // 顺序：第一个、最后一个、再其他
        labels.sort(function (a, b) {
            return b.get(ORIGIN)[FIELD_ORIGIN][yField] - a.get(ORIGIN)[FIELD_ORIGIN][yField];
        });
        if (labels.length > 0) {
            sorted.push(labels.shift());
        }
        if (labels.length > 0) {
            sorted.push(labels.pop());
        }
        sorted.push.apply(sorted, labels);
        return sorted;
    };
    return PointAutoLabel;
}(PointLabel));
export default PointAutoLabel;
registerLabelComponent('point-auto', PointAutoLabel);
//# sourceMappingURL=point-auto.js.map