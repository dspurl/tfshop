"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Liquid = /** @class */ (function (_super) {
    tslib_1.__extends(Liquid, _super);
    function Liquid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Liquid.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'liquid';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Liquid.prototype.changeValue = function (value, all) {
        if (all === void 0) { all = false; }
        if (all) {
            this.eachLayer(function (layer) {
                if (layer instanceof layer_1.default) {
                    layer.changeValue(value);
                }
            });
        }
        else {
            var layer = this.layers[0];
            if (layer instanceof layer_1.default) {
                layer.changeValue(value);
            }
        }
    };
    Liquid.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Liquid;
}(plot_1.default));
exports.default = Liquid;
//# sourceMappingURL=index.js.map