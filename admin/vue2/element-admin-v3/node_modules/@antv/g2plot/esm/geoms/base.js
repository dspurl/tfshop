import { assign } from '@antv/util';
var ElementParser = /** @class */ (function () {
    function ElementParser(cfg) {
        assign(this, cfg);
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
export default ElementParser;
//# sourceMappingURL=base.js.map