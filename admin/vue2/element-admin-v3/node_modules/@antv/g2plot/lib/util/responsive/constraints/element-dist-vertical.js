"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function elementDistVertical(a, b, cfg) {
    if (cfg === void 0) { cfg = { value: 5 }; }
    var dist = Math.abs(a.bottom - b.top);
    return Math.round(dist) >= cfg.value;
}
exports.default = {
    type: 'chain',
    usage: 'compare',
    expression: elementDistVertical,
};
//# sourceMappingURL=element-dist-vertical.js.map