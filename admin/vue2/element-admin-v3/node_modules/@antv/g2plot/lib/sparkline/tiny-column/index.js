"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var TinyColumn = /** @class */ (function (_super) {
    tslib_1.__extends(TinyColumn, _super);
    function TinyColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyColumn.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'tinyColumn';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyColumn.getDefaultOptions = layer_1.default.getDefaultOptions;
    return TinyColumn;
}(plot_1.default));
exports.default = TinyColumn;
//# sourceMappingURL=index.js.map