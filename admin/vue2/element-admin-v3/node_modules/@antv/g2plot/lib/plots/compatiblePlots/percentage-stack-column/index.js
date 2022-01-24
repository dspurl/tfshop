"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../../base/plot"));
var warning_1 = tslib_1.__importDefault(require("warning"));
var layer_1 = tslib_1.__importDefault(require("../../percent-stacked-column/layer"));
var PercentageStackColumn = /** @class */ (function (_super) {
    tslib_1.__extends(PercentageStackColumn, _super);
    function PercentageStackColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageStackColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'percentStackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
        warning_1.default(false, 'Please use "PercentStackedColumn" instead of "PercentageStackColumn" which was not recommended.');
    };
    PercentageStackColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return PercentageStackColumn;
}(plot_1.default));
exports.default = PercentageStackColumn;
//# sourceMappingURL=index.js.map