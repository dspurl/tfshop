"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../stacked-column/layer"));
var StackColumn = /** @class */ (function (_super) {
    tslib_1.__extends(StackColumn, _super);
    function StackColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "StackedColumn" instead of "StackColumn" which was not recommended.');
    };
    StackColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackColumn;
}(plot_1.default));
exports.default = StackColumn;
//# sourceMappingURL=index.js.map