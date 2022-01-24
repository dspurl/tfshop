"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var layer_1 = require("./layer");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var StepLine = /** @class */ (function (_super) {
    tslib_1.__extends(StepLine, _super);
    function StepLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 复写父类方法
     * @param props
     */
    StepLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'step-line';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StepLine.getDefaultOptions = layer_1.StepLineLayer.getDefaultOptions;
    return StepLine;
}(plot_1.default));
exports.default = StepLine;
//# sourceMappingURL=index.js.map