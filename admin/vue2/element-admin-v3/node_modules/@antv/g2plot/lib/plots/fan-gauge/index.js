"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var FanGauge = /** @class */ (function (_super) {
    tslib_1.__extends(FanGauge, _super);
    function FanGauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FanGauge.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'fanGauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    FanGauge.getDefaultOptions = layer_1.default.getDefaultOptions;
    return FanGauge;
}(plot_1.default));
exports.default = FanGauge;
//# sourceMappingURL=index.js.map