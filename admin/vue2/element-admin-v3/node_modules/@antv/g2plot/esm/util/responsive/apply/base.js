import { assign } from '@antv/util';
var ApplyResponsive = /** @class */ (function () {
    function ApplyResponsive(cfg) {
        assign(this, cfg);
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
export default ApplyResponsive;
//# sourceMappingURL=base.js.map