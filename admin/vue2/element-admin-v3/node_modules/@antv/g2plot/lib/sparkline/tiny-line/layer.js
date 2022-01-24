"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var global_1 = require("../../base/global");
var factory_1 = require("../../geoms/factory");
var tiny_layer_1 = tslib_1.__importDefault(require("../tiny-layer"));
var EventParser = tslib_1.__importStar(require("./event"));
var GEOM_MAP = {
    line: 'line',
};
var TinyLineLayer = /** @class */ (function (_super) {
    tslib_1.__extends(TinyLineLayer, _super);
    function TinyLineLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tinyLine';
        return _this;
    }
    TinyLineLayer.prototype.geometryParser = function (dim, type) {
        return GEOM_MAP[type];
    };
    TinyLineLayer.prototype.addGeometry = function () {
        this.line = factory_1.getGeom('line', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.line);
    };
    TinyLineLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return TinyLineLayer;
}(tiny_layer_1.default));
exports.default = TinyLineLayer;
global_1.registerPlotType('tinyLine', TinyLineLayer);
//# sourceMappingURL=layer.js.map