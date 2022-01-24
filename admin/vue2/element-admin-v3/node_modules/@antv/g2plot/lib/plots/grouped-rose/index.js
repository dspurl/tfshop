"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var GroupedRose = /** @class */ (function (_super) {
    tslib_1.__extends(GroupedRose, _super);
    function GroupedRose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedRose.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedRose';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedRose.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupedRose;
}(plot_1.default));
exports.default = GroupedRose;
//# sourceMappingURL=index.js.map