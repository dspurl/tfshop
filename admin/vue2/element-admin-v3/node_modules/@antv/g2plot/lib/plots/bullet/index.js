"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var Bullet = /** @class */ (function (_super) {
    tslib_1.__extends(Bullet, _super);
    function Bullet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bullet.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'bullet';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Bullet.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Bullet;
}(plot_1.default));
exports.default = Bullet;
//# sourceMappingURL=index.js.map