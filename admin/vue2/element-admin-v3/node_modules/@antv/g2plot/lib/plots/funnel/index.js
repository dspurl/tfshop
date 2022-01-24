"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Funnel = /** @class */ (function (_super) {
    tslib_1.__extends(Funnel, _super);
    function Funnel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Funnel.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'funnel';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Funnel.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Funnel;
}(plot_1.default));
exports.default = Funnel;
//# sourceMappingURL=index.js.map