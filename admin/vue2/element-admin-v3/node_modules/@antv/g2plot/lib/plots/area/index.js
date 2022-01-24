"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Area = /** @class */ (function (_super) {
    tslib_1.__extends(Area, _super);
    function Area() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Area.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'area';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Area.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Area;
}(plot_1.default));
exports.default = Area;
//# sourceMappingURL=index.js.map