"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var StackedColumn = /** @class */ (function (_super) {
    tslib_1.__extends(StackedColumn, _super);
    function StackedColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackedColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'stackedColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    StackedColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return StackedColumn;
}(plot_1.default));
exports.default = StackedColumn;
//# sourceMappingURL=index.js.map