"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Scatter = /** @class */ (function (_super) {
    tslib_1.__extends(Scatter, _super);
    function Scatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scatter.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'scatter';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Scatter.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Scatter;
}(plot_1.default));
exports.default = Scatter;
//# sourceMappingURL=index.js.map