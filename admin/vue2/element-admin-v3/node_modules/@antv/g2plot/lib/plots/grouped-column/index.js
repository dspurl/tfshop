"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var GroupedColumn = /** @class */ (function (_super) {
    tslib_1.__extends(GroupedColumn, _super);
    function GroupedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    GroupedColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupedColumn;
}(plot_1.default));
exports.default = GroupedColumn;
//# sourceMappingURL=index.js.map