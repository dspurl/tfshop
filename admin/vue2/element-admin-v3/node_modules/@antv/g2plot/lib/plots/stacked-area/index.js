"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var StackedArea = /** @class */ (function (_super) {
    tslib_1.__extends(StackedArea, _super);
    function StackedArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedArea.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedArea';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedArea.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackedArea;
}(plot_1.default));
exports.default = StackedArea;
//# sourceMappingURL=index.js.map