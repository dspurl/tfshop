"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../percent-stacked-bar/layer"));
var PercentageStackBar = /** @class */ (function (_super) {
    tslib_1.__extends(PercentageStackBar, _super);
    function PercentageStackBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'percentStackedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "PercentStackedBar" instead of "PercentageStackBar" which was not recommended.');
    };
    PercentageStackBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return PercentageStackBar;
}(plot_1.default));
exports.default = PercentageStackBar;
//# sourceMappingURL=index.js.map