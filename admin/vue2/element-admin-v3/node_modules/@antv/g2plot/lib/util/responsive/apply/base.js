"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var ApplyResponsive = /** @class */ (function () {
    function ApplyResponsive(cfg) {
        util_1.assign(this, cfg);
        this.init();
    }
    ApplyResponsive.prototype.init = function () {
        this.type = this.getType();
        if (this.shouldApply()) {
            this.apply();
        }
    };
    return ApplyResponsive;
}());
exports.default = ApplyResponsive;
//# sourceMappingURL=base.js.map