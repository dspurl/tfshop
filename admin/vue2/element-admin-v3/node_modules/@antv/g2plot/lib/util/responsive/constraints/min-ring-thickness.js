"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function minRingThickness(node, region) {
    var minThicknessPixel = 2;
    var minThickness = region.coord.radius / minThicknessPixel;
    return Math.min(minThickness, node.value);
}
exports.default = {
    type: 'padding',
    usage: 'assign',
    expression: minRingThickness,
};
//# sourceMappingURL=min-ring-thickness.js.map