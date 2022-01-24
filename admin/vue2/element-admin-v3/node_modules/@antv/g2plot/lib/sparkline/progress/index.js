"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Progress = /** @class */ (function (_super) {
    tslib_1.__extends(Progress, _super);
    function Progress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Progress.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'progress';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Progress.prototype.update = function (value, style) {
        var layer = this.layers[0];
        layer.update(value, style);
    };
    Progress.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Progress;
}(plot_1.default));
exports.default = Progress;
//# sourceMappingURL=index.js.map