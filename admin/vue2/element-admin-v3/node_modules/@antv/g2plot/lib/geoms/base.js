"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var ElementParser = /** @class */ (function () {
    function ElementParser(cfg) {
        util_1.assign(this, cfg);
        this.init();
    }
    ElementParser.prototype.init = function () {
        this.config = {
            type: this.type,
            position: {
                fields: this.positionFields,
            },
        };
    };
    return ElementParser;
}());
exports.default = ElementParser;
//# sourceMappingURL=base.js.map