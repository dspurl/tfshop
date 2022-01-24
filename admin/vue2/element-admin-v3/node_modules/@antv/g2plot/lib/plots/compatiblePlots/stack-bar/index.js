"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../stacked-bar/layer"));
var StackBar = /** @class */ (function (_super) {
    tslib_1.__extends(StackBar, _super);
    function StackBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "StackedBar" instead of "StackBar" which was not recommended.');
    };
    StackBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackBar;
}(plot_1.default));
exports.default = StackBar;
//# sourceMappingURL=index.js.map