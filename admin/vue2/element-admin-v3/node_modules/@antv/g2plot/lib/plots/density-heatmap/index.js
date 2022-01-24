"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var DensityHeatmap = /** @class */ (function (_super) {
    tslib_1.__extends(DensityHeatmap, _super);
    function DensityHeatmap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DensityHeatmap.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'densityHeatmap';
        _super.prototype.createLayers.call(this, layerProps);
    };
    DensityHeatmap.getDefaultOptions = layer_1.default.getDefaultOptions;
    return DensityHeatmap;
}(plot_1.default));
exports.default = DensityHeatmap;
//# sourceMappingURL=index.js.map