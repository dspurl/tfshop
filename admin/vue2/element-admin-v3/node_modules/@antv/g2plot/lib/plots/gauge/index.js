"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Gauge = /** @class */ (function (_super) {
    tslib_1.__extends(Gauge, _super);
    function Gauge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gauge.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'gauge';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Gauge.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Gauge;
}(plot_1.default));
exports.default = Gauge;
//# sourceMappingURL=index.js.map