"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var TinyLine = /** @class */ (function (_super) {
    tslib_1.__extends(TinyLine, _super);
    function TinyLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'tinyLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyLine.getDefaultOptions = layer_1.default.getDefaultOptions;
    return TinyLine;
}(plot_1.default));
exports.default = TinyLine;
//# sourceMappingURL=index.js.map