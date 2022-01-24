import { __extends } from "tslib";
import { registerLabelComponent } from '../../../components/label/base';
import ColumnAutoLabel from '../../column/component/label-auto';
/** 自动模式的 StackedColumn 数据标签，会根据图形和数据标签自动优化数据标签布局和样式等 */
var StackedColumnAutoLabel = /** @class */ (function (_super) {
    __extends(StackedColumnAutoLabel, _super);
    function StackedColumnAutoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** 堆积柱形图全部内置 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    StackedColumnAutoLabel.prototype.shouldInShapeLabels = function (labels) {
        return true;
    };
    return StackedColumnAutoLabel;
}(ColumnAutoLabel));
export default StackedColumnAutoLabel;
registerLabelComponent('stacked-column-auto', StackedColumnAutoLabel);
//# sourceMappingURL=label-auto.js.map