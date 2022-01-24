import { __extends } from "tslib";
import { registerPlotType } from '../../base/global';
import { getGeom } from '../../geoms/factory';
import TinyLayer from '../tiny-layer';
import * as EventParser from './event';
var GEOM_MAP = {
    area: 'area',
    line: 'line',
};
var TinyAreaLayer = /** @class */ (function (_super) {
    __extends(TinyAreaLayer, _super);
    function TinyAreaLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tinyArea';
        return _this;
    }
    TinyAreaLayer.prototype.geometryParser = function (dim, type) {
        return GEOM_MAP[type];
    };
    TinyAreaLayer.prototype.addGeometry = function () {
        this.area = getGeom('area', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.area);
        this.line = getGeom('line', 'mini', {
            plot: this,
        });
        this.setConfig('geometry', this.line);
    };
    TinyAreaLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    return TinyAreaLayer;
}(TinyLayer));
export default TinyAreaLayer;
registerPlotType('tinyArea', TinyAreaLayer);
//# sourceMappingURL=layer.js.map