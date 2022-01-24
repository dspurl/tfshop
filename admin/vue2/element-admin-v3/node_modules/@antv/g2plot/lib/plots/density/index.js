"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Density = /** @class */ (function (_super) {
    tslib_1.__extends(Density, _super);
    function Density() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Density.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'density';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Density.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Density;
}(plot_1.default));
exports.default = Density;
//# sourceMappingURL=index.js.map