"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var GroupedColumnLine = /** @class */ (function (_super) {
    tslib_1.__extends(GroupedColumnLine, _super);
    function GroupedColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedColumnLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedColumnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedColumnLine.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupedColumnLine;
}(plot_1.default));
exports.default = GroupedColumnLine;
//# sourceMappingURL=index.js.map