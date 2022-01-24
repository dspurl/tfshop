import { __assign, __extends } from "tslib";
import PieBaseLabel from './base-label';
// 默认label和element的偏移 16px
export var DEFAULT_OFFSET = 16;
var PieOuterCenterLabel = /** @class */ (function (_super) {
    __extends(PieOuterCenterLabel, _super);
    function PieOuterCenterLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @override 不能大于0 */
    PieOuterCenterLabel.prototype.adjustOption = function (options) {
        _super.prototype.adjustOption.call(this, options);
        if (options.offset < 0) {
            options.offset = 0;
        }
    };
    PieOuterCenterLabel.prototype.getDefaultOptions = function () {
        var theme = this.plot.theme;
        var labelStyle = theme.label.style;
        return {
            offsetX: 0,
            offsetY: 0,
            offset: 12,
            style: __assign(__assign({}, labelStyle), { textBaseline: 'middle' }),
        };
    };
    PieOuterCenterLabel.prototype.adjustItem = function (item) {
        var offset = this.options.offset;
        if (item.textAlign === 'left') {
            item.x += offset > 4 ? 4 : offset / 2;
        }
        else if (item.textAlign === 'right') {
            item.x -= offset > 4 ? 4 : offset / 2;
        }
    };
    /** label 碰撞调整 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
    PieOuterCenterLabel.prototype.layout = function (labels, items, panel) { };
    return PieOuterCenterLabel;
}(PieBaseLabel));
export default PieOuterCenterLabel;
//# sourceMappingURL=outer-center-label.js.map