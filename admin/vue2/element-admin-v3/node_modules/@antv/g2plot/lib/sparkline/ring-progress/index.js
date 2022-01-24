"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var RingProgress = /** @class */ (function (_super) {
    tslib_1.__extends(RingProgress, _super);
    function RingProgress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RingProgress.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'ringProgress';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RingProgress.prototype.update = function (value) {
        var layer = this.layers[0];
        layer.update(value);
    };
    RingProgress.getDefaultOptions = layer_1.default.getDefaultOptions;
    return RingProgress;
}(plot_1.default));
exports.default = RingProgress;
//# sourceMappingURL=index.js.map