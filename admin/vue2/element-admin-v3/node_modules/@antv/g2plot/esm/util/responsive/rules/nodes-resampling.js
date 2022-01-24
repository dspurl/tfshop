import { each, isNumber } from '@antv/util';
import textHide from './text-hide';
export default function nodesResampling(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    /** nodeLength为偶数，则奇数index的shape保留，反之则偶数index的shape保留 */
    var oddKeep = nodes.length % 2 === 0 ? false : true;
    if (isKeep(option.keep, index, nodes)) {
        return;
    }
    {
        var isOdd = index % 2 === 0 ? true : false;
        if ((!oddKeep && isOdd) || (oddKeep && !isOdd)) {
            textHide(shape);
        }
    }
}
export function isKeep(keepCfg, index, nodes) {
    /** 允许设置start end 或任意index */
    var conditions = [];
    each(keepCfg, function (cfg) {
        if (cfg === 'start') {
            conditions.push(index === 0);
        }
        else if (cfg === 'end') {
            conditions.push(index === nodes.length - 1);
        }
        else if (isNumber(cfg)) {
            conditions.push(index === cfg);
        }
    });
    for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
        var condition = conditions_1[_i];
        if (condition === true) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=nodes-resampling.js.map