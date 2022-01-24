"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Treemap = /** @class */ (function (_super) {
    tslib_1.__extends(Treemap, _super);
    function Treemap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Treemap.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'treemap';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Treemap.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Treemap;
}(plot_1.default));
exports.default = Treemap;
//# sourceMappingURL=index.js.map