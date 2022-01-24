"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var StackedBar = /** @class */ (function (_super) {
    tslib_1.__extends(StackedBar, _super);
    function StackedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackedBar;
}(plot_1.default));
exports.default = StackedBar;
//# sourceMappingURL=index.js.map