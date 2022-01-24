"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../stacked-area/layer"));
var StackArea = /** @class */ (function (_super) {
    tslib_1.__extends(StackArea, _super);
    function StackArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackArea.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedArea';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "StackedArea" instead of "StackArea" which was not recommended.');
    };
    StackArea.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackArea;
}(plot_1.default));
exports.default = StackArea;
//# sourceMappingURL=index.js.map