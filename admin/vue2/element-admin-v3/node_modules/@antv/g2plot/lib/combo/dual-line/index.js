"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var DualLine = /** @class */ (function (_super) {
    tslib_1.__extends(DualLine, _super);
    function DualLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DualLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'dualLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    DualLine.getDefaultOptions = layer_1.default.getDefaultOptions;
    return DualLine;
}(plot_1.default));
exports.default = DualLine;
//# sourceMappingURL=index.js.map