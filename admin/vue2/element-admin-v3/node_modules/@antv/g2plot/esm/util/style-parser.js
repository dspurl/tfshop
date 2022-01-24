import { __assign } from "tslib";
import { clone } from '@antv/util';
function AxisStyleParser(axisCfg, axis) {
    var _a, _b, _c, _d;
    axisCfg.line = ((_a = axis.line) === null || _a === void 0 ? void 0 : _a.visible) ? __assign({}, axis.line) : null;
    axisCfg.title = ((_b = axis.title) === null || _b === void 0 ? void 0 : _b.visible) ? __assign(__assign({}, axis.title), { autoRotate: axisCfg.autoRotateTitle }) : null;
    axisCfg.tickLine = ((_c = axis.tickLine) === null || _c === void 0 ? void 0 : _c.visible) ? __assign({}, axis.tickLine) : null;
    axisCfg.overlapOrder = [];
    axisCfg.label = ((_d = axis.label) === null || _d === void 0 ? void 0 : _d.visible) ? __assign({}, axis.label) : null;
    if (axis.autoRotateLabel) {
        axisCfg.overlapOrder.push('autoRotate');
    }
    if (axisCfg.autoEllipsisLabel) {
        axisCfg.overlapOrder.push('autoEllipsis');
    }
    if (axis.autoHideLabel) {
        axisCfg.overlapOrder.push('autoHide');
    }
    // TODO: grid
    if (axis.grid) {
        if (axis.grid.visible === false) {
            axisCfg.grid = null;
        }
        else {
            axisCfg.grid = clone(axis.grid);
            if (axis.grid.style) {
                axisCfg.grid = clone(axis.grid.style);
            }
        }
    }
}
function TooltipStyleParser() {
    return;
}
function LabelStyleParser(theme, style) {
    var labelCfg = theme.label;
    labelCfg.textStyle = style;
}
function AnnotationStyleParser() {
    return;
}
export { AxisStyleParser, TooltipStyleParser, LabelStyleParser, AnnotationStyleParser };
//# sourceMappingURL=style-parser.js.map