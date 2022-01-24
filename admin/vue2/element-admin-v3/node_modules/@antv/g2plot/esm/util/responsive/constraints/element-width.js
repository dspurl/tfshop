function elementWidth(node, region, cfg) {
    if (cfg === void 0) { cfg = { ratio: 0.15 }; }
    return node.width < region.width * cfg.ratio;
}
export default {
    type: 'padding',
    usage: 'compare',
    expression: elementWidth,
};
//# sourceMappingURL=element-width.js.map