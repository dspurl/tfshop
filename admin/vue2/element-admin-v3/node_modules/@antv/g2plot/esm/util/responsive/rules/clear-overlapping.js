import { each } from '@antv/util';
import textHide from './text-hide';
export default function clearOverlapping(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    var current = nodes[index];
    var overlapped = [];
    /** 找到所有与当前点overlap的node */
    if (!current.shape.get('blank')) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var _shape = node.shape;
            if (i !== index && !_shape.get('blank')) {
                var isOverlap = isNodeOverlap(current, node);
                if (isOverlap) {
                    overlapped.push(node);
                }
            }
        }
    }
    /** overlap处理逻辑 */
    if (overlapped.length > 0) {
        overlapped.push(current);
        overlapped.sort(function (a, b) {
            return b.top - a.top;
        });
        /** 隐藏除最高点以外的node */
        each(overlapped, function (node, idx) {
            if (idx > 0) {
                var _shape = node.shape;
                textHide(_shape);
                _shape.set('blank', true);
            }
        });
    }
}
export function isNodeOverlap(nodeA, nodeB) {
    if (nodeA.bottom < nodeB.top || nodeB.bottom < nodeA.top) {
        return false;
    }
    if (nodeA.right < nodeB.left || nodeB.right < nodeA.left) {
        return false;
    }
    return true;
}
//# sourceMappingURL=clear-overlapping.js.map