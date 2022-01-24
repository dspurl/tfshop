function ringThickness(node, region, cfg) {
    if (cfg === void 0) { cfg = { ratio: 0.8 }; }
    return region.radius * cfg.ratio;
}
export default {
    type: 'padding',
    usage: 'assign',
    expression: ringThickness,
};
//# sourceMappingURL=ring-thickness.js.map