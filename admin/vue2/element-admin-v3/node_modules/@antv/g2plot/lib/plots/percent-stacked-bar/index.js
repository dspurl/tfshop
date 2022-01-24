"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var PercentStackedBar = /** @class */ (function (_super) {
    tslib_1.__extends(PercentStackedBar, _super);
    function PercentStackedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentStackedBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'percentStackedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    PercentStackedBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return PercentStackedBar;
}(plot_1.default));
exports.default = PercentStackedBar;
//# sourceMappingURL=index.js.map