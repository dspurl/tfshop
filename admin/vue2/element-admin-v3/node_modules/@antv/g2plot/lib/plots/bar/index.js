"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Bar = /** @class */ (function (_super) {
    tslib_1.__extends(Bar, _super);
    function Bar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'bar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Bar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Bar;
}(plot_1.default));
exports.default = Bar;
//# sourceMappingURL=index.js.map