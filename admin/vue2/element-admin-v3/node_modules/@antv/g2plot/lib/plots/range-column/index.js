"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var RangeColumn = /** @class */ (function (_super) {
    tslib_1.__extends(RangeColumn, _super);
    function RangeColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'rangeColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    RangeColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return RangeColumn;
}(plot_1.default));
exports.default = RangeColumn;
//# sourceMappingURL=index.js.map