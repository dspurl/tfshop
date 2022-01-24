import { deepMix } from '@antv/util';
import textHide from './text-hide';
/** 根据变化进行抽样，保留变化较大的点，类似于点简化算法 */
export default function nodesResamplingByChange(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    var tolerance = getGlobalTolerance(nodes);
    if (index <= 1) {
        return;
    }
    var current = nodes[index];
    // const previous = nodes[index-1];
    var previous = findPrevious(index, nodes);
    var distX = previous.centerX - current.centerX;
    var distY = previous.centerY - current.centerY;
    var dist = Math.sqrt(distX * distX + distY * distY);
    if (dist < tolerance) {
        textHide(shape);
        shape.set('blank', true);
    }
}
function findPrevious(index, nodes) {
    for (var i = index - 1; i > 0; i--) {
        var node = nodes[i];
        if (!node.shape.get('blank')) {
            return node;
        }
    }
}
function getGlobalTolerance(nodes) {
    var nodesClone = deepMix([], nodes);
    nodesClone.sort(function (a, b) {
        return b.width - a.width;
    });
    return Math.round(nodesClone[0].width);
}
//# sourceMappingURL=nodes-resampling-by-change.js.map