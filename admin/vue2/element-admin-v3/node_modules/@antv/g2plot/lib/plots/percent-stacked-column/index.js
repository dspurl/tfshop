"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var PercentStackedColumn = /** @class */ (function (_super) {
    tslib_1.__extends(PercentStackedColumn, _super);
    function PercentStackedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentStackedColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'percentStackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    PercentStackedColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return PercentStackedColumn;
}(plot_1.default));
exports.default = PercentStackedColumn;
//# sourceMappingURL=index.js.map