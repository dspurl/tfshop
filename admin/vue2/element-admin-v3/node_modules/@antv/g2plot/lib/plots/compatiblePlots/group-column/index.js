"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../grouped-column/layer"));
var GroupColumn = /** @class */ (function (_super) {
    tslib_1.__extends(GroupColumn, _super);
    function GroupColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'groupedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "GroupedColumn" instead of "GroupColumn" which was not recommended.');
    };
    GroupColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return GroupColumn;
}(plot_1.default));
exports.default = GroupColumn;
//# sourceMappingURL=index.js.map