"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("./base");
var point_1 = tslib_1.__importDefault(require("./point"));
var dependents_1 = require("../../dependents");
var view_1 = require("../../util/view");
var bbox_1 = tslib_1.__importDefault(require("../../util/bbox"));
var PointAutoLabel = /** @class */ (function (_super) {
    tslib_1.__extends(PointAutoLabel, _super);
    function PointAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PointAutoLabel.prototype.layoutLabels = function (geometry, labels) {
        var _this = this;
        var _a;
        var dones = [];
        var panel = bbox_1.default.fromBBoxObject(this.getCoordinateBBox());
        var _b = geometry.getXYFields(), xField = _b[0], yField = _b[1];
        var groupedMap = util_1.groupBy(labels, function (label) { return label.get(dependents_1.ORIGIN)[dependents_1.FIELD_ORIGIN][xField]; });
        var offset = (_a = labels[0]) === null || _a === void 0 ? void 0 : _a.get('offset');
        util_1.each(util_1.keys(groupedMap).reverse(), function (xValue) {
            var group = _this.sortLabels(geometry, groupedMap[xValue]);
            while (group.length) {
                var label = group.shift();
                if (view_1.checkOriginEqual(label, dones, function (datumLeft, datumRight) {
                    return datumLeft._origin[xField] === datumRight._origin[xField] &&
                        datumLeft._origin[yField] === datumRight._origin[yField];
                })) {
                    label.set('visible', false);
                    continue;
                }
                view_1.moveInPanel(label, panel);
                var upFail = view_1.checkShapeOverlap(label, dones);
                var downFail = void 0;
                if (upFail) {
                    label.attr('y', label.attr('y') + 2 * offset);
                    view_1.moveInPanel(label, panel);
                    downFail = view_1.checkShapeOverlap(label, dones);
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
            return b.get(dependents_1.ORIGIN)[dependents_1.FIELD_ORIGIN][yField] - a.get(dependents_1.ORIGIN)[dependents_1.FIELD_ORIGIN][yField];
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
}(point_1.default));
exports.default = PointAutoLabel;
base_1.registerLabelComponent('point-auto', PointAutoLabel);
//# sourceMappingURL=point-auto.js.map