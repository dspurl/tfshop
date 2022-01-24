"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var datetime_string_abbrevaite_1 = tslib_1.__importStar(require("./datetime-string-abbrevaite"));
var digits_abbreviate_1 = tslib_1.__importDefault(require("./digits-abbreviate"));
var text_abbreviate_1 = tslib_1.__importDefault(require("./text-abbreviate"));
function robustAbbrevaite(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    var text = shape.attr('text');
    /** 判断text类型： 数字、时间、文本 */
    var isnum = /^\d+$/.test(text);
    if (isnum) {
        digits_abbreviate_1.default(shape, option, index, nodes);
    }
    else if (datetime_string_abbrevaite_1.isTime(text)) {
        datetime_string_abbrevaite_1.default(shape, option, index, nodes);
    }
    else {
        text_abbreviate_1.default(shape, option);
    }
}
exports.default = robustAbbrevaite;
//# sourceMappingURL=robust-abbrevaite.js.map