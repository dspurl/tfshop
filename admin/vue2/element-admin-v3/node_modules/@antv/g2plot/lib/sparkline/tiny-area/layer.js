"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var global_1 = require("../../base/global");
var factory_1 = require("../../geoms/factory");
var tiny_layer_1 = tslib_1.__importDefault(require("../tiny-layer"));
var EventParser = tslib_1.__importStar(require("./event"));
var GEOM_MAP = {
    area: 'area',
    line: 'line',
};
var TinyAreaLayer = /** @class */ (function (_super) {
    tslib_1.__extends(TinyAreaLayer, _super);
    function TinyAreaLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tinyArea';
        return _this;
    }
    TinyAreaLayer.prototype.geometryParser = function (dim, type) {
        return GEOM_MAP[type];
    };
    TinyAreaLayer.prototype.addGeometry = function () {
        this.area = factory_1.getGeom('area', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.area);
        this.line = factory_1.getGeom('line', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.line);
    };
    TinyAreaLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return TinyAreaLayer;
}(tiny_layer_1.default));
exports.default = TinyAreaLayer;
global_1.registerPlotType('tinyArea', TinyAreaLayer);
//# sourceMappingURL=layer.js.map