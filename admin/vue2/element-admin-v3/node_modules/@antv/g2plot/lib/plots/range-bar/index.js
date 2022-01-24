"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var RangeBar = /** @class */ (function (_super) {
    tslib_1.__extends(RangeBar, _super);
    function RangeBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'rangeBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RangeBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return RangeBar;
}(plot_1.default));
exports.default = RangeBar;
//# sourceMappingURL=index.js.map