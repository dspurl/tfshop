"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var GroupedBar = /** @class */ (function (_super) {
    tslib_1.__extends(GroupedBar, _super);
    function GroupedBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedBar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupedBar;
}(plot_1.default));
exports.default = GroupedBar;
//# sourceMappingURL=index.js.map