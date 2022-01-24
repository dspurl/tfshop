"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var StackedColumnLine = /** @class */ (function (_super) {
    tslib_1.__extends(StackedColumnLine, _super);
    function StackedColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedColumnLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedColumnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedColumnLine.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackedColumnLine;
}(plot_1.default));
exports.default = StackedColumnLine;
//# sourceMappingURL=index.js.map