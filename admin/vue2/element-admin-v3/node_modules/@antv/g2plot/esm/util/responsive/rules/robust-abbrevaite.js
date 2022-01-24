import datetimeStringAbbrevaite, { isTime } from './datetime-string-abbrevaite';
import digitsAbbreviate from './digits-abbreviate';
import textAbbreviate from './text-abbreviate';
export default function robustAbbrevaite(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    var text = shape.attr('text');
    /** 判断text类型： 数字、时间、文本 */
    var isnum = /^\d+$/.test(text);
    if (isnum) {
        digitsAbbreviate(shape, option, index, nodes);
    }
    else if (isTime(text)) {
        datetimeStringAbbrevaite(shape, option, index, nodes);
    }
    else {
        textAbbreviate(shape, option);
    }
}
//# sourceMappingURL=robust-abbrevaite.js.map