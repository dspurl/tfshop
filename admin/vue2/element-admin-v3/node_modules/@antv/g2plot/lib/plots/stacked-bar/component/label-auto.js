"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("../../../components/label/base");
var label_auto_1 = tslib_1.__importDefault(require("../../bar/component/label-auto"));
/** 自动模式的 StackedBar 数据标签，会根据图形和数据标签自动优化数据标签布局和样式等 */
var StackedBarAutoLabel = /** @class */ (function (_super) {
    tslib_1.__extends(StackedBarAutoLabel, _super);
    function StackedBarAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** 堆积柱形图全部内置 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    StackedBarAutoLabel.prototype.shouldInShapeLabels = function (labels) {
        return true;
    };
    return StackedBarAutoLabel;
}(label_auto_1.default));
exports.default = StackedBarAutoLabel;
base_1.registerLabelComponent('stacked-bar-auto', StackedBarAutoLabel);
//# sourceMappingURL=label-auto.js.map