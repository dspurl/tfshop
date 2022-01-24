"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Histogram = /** @class */ (function (_super) {
    tslib_1.__extends(Histogram, _super);
    function Histogram() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Histogram.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'histogram';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Histogram.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Histogram;
}(plot_1.default));
exports.default = Histogram;
//# sourceMappingURL=index.js.map