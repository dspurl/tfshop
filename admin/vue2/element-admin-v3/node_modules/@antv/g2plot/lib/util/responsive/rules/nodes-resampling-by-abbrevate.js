"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var nodes_resampling_1 = require("./nodes-resampling");
var text_hide_1 = tslib_1.__importDefault(require("./text-hide"));
function nodesResamplingByAbbrevate(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    if (nodes_resampling_1.isKeep(option.keep, index, nodes)) {
        return;
    }
    {
        var currentText = shape.attr('text');
        var originText = shape.get('delegateObject').item.name;
        if (currentText !== originText) {
            text_hide_1.default(shape);
        }
    }
}
exports.default = nodesResamplingByAbbrevate;
//# sourceMappingURL=nodes-resampling-by-abbrevate.js.map