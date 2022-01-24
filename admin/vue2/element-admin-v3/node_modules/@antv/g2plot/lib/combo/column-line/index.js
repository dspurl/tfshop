"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var ColumnLine = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnLine, _super);
    function ColumnLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnLine.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'columnLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    ColumnLine.getDefaultOptions = layer_1.default.getDefaultOptions;
    return ColumnLine;
}(plot_1.default));
exports.default = ColumnLine;
//# sourceMappingURL=index.js.map