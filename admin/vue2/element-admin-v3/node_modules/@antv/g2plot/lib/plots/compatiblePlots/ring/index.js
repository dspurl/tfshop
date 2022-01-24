"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../donut/layer"));
var Ring = /** @class */ (function (_super) {
    tslib_1.__extends(Ring, _super);
    function Ring() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ring.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'donut';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "Donut" instead of "Ring" which was not recommended.');
    };
    Ring.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Ring;
}(plot_1.default));
exports.default = Ring;
//# sourceMappingURL=index.js.map