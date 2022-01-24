import { isKeep } from './nodes-resampling';
import textHide from './text-hide';
export default function nodesResamplingByAbbrevate(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    if (isKeep(option.keep, index, nodes)) {
        return;
    }
    {
        var currentText = shape.attr('text');
        var originText = shape.get('delegateObject').item.name;
        if (currentText !== originText) {
            textHide(shape);
        }
    }
}
//# sourceMappingURL=nodes-resampling-by-abbrevate.js.map