"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var TinyArea = /** @class */ (function (_super) {
    tslib_1.__extends(TinyArea, _super);
    function TinyArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyArea.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'tinyArea';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyArea.getDefaultOptions = layer_1.default.getDefaultOptions;
    return TinyArea;
}(plot_1.default));
exports.default = TinyArea;
//# sourceMappingURL=index.js.map