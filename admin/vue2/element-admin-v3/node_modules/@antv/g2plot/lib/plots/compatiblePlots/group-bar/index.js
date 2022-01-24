"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../grouped-bar/layer"));
var GroupBar = /** @class */ (function (_super) {
    tslib_1.__extends(GroupBar, _super);
    function GroupBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupBar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedBar';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "GroupedBar" instead of "GroupBar" which was not recommended.');
    };
    GroupBar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupBar;
}(plot_1.default));
exports.default = GroupBar;
//# sourceMappingURL=index.js.map