import { __extends } from "tslib";
import { registerPlotType } from '../../base/global';
import { getGeom } from '../../geoms/factory';
import TinyLayer from '../tiny-layer';
import * as EventParser from './event';
var GEOM_MAP = {
    line: 'line',
};
var TinyLineLayer = /** @class */ (function (_super) {
    __extends(TinyLineLayer, _super);
    function TinyLineLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tinyLine';
        return _this;
    }
    TinyLineLayer.prototype.geometryParser = function (dim, type) {
        return GEOM_MAP[type];
    };
    TinyLineLayer.prototype.addGeometry = function () {
        this.line = getGeom('line', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.line);
    };
    TinyLineLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return TinyLineLayer;
}(TinyLayer));
export default TinyLineLayer;
registerPlotType('tinyLine', TinyLineLayer);
//# sourceMappingURL=layer.js.map