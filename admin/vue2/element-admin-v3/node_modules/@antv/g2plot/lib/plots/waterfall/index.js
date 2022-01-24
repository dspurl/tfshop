"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-18
 */
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Waterfall = /** @class */ (function (_super) {
    tslib_1.__extends(Waterfall, _super);
    function Waterfall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Waterfall.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'waterfall';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Waterfall.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Waterfall;
}(plot_1.default));
exports.default = Waterfall;
//# sourceMappingURL=index.js.map