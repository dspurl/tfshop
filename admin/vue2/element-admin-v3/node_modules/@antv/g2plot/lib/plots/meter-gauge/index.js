"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var MeterGauge = /** @class */ (function (_super) {
    tslib_1.__extends(MeterGauge, _super);
    function MeterGauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MeterGauge.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'meterGauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    MeterGauge.getDefaultOptions = layer_1.default.getDefaultOptions;
    return MeterGauge;
}(plot_1.default));
exports.default = MeterGauge;
//# sourceMappingURL=index.js.map