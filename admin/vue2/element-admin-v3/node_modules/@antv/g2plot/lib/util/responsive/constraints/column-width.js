"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function columnWidth(node, region, cfg) {
    if (cfg === void 0) { cfg = { ratio: 0.6 }; }
    return region.width * cfg.ratio;
}
exports.default = {
    type: 'padding',
    usage: 'assign',
    expression: columnWidth,
};
//# sourceMappingURL=column-width.js.map