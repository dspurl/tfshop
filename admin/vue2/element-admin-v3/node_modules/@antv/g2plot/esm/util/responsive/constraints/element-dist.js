import * as MathUtil from '../../math';
function elementDist(a, b, cfg) {
    if (cfg === void 0) { cfg = { value: 4 }; }
    var polygonA = [a.topLeft, a.topRight, a.bottomRight, a.bottomLeft]; // 顶点顺时针
    var polygonB = [b.topLeft, b.topRight, b.bottomRight, b.bottomLeft];
    var dist = MathUtil.minDistBetweenConvexPolygon(polygonA, polygonB);
    return Math.round(dist) >= cfg.value;
}
export default {
    type: 'chain',
    usage: 'compare',
    expression: elementDist,
};
//# sourceMappingURL=element-dist.js.map