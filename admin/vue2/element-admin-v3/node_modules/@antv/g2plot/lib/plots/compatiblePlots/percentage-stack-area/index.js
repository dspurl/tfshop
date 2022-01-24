"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../percent-stacked-area/layer"));
var PercentageStackArea = /** @class */ (function (_super) {
    tslib_1.__extends(PercentageStackArea, _super);
    function PercentageStackArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackArea.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'percentStackedArea';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "PercentStackedArea" instead of "PercentageStackArea" which was not recommended.');
    };
    PercentageStackArea.getDefaultOptions = layer_1.default.getDefaultOptions;
    return PercentageStackArea;
}(plot_1.default));
exports.default = PercentageStackArea;
//# sourceMappingURL=index.js.map