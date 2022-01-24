import { __extends } from "tslib";
import { mix, each } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { getGeom } from '../../geoms/factory';
import TinyLayer from '../tiny-layer';
import * as EventParser from './event';
var WIDTH_RATIO = 0.6;
var G2_GEOM_MAP = {
    column: 'interval',
};
var PLOT_GEOM_MAP = {
    interval: 'column',
};
var TinyColumnLayer = /** @class */ (function (_super) {
    __extends(TinyColumnLayer, _super);
    function TinyColumnLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tinyColumn';
        return _this;
    }
    TinyColumnLayer.prototype.init = function () {
        this.processProps();
        _super.prototype.init.call(this);
    };
    TinyColumnLayer.prototype.geometryParser = function (dim, type) {
        if (dim === 'g2') {
            return G2_GEOM_MAP[type];
        }
        return PLOT_GEOM_MAP[type];
    };
    TinyColumnLayer.prototype.scale = function () {
        var options = this.options;
        var scales = {};
        /** 配置x-scale */
        scales[options.xField] = { type: 'cat' };
        this.setConfig('scales', scales);
    };
    TinyColumnLayer.prototype.addGeometry = function () {
        var props = this.options;
        var column = getGeom('interval', 'main', {
            positionFields: [props.xField, props.yField],
            plot: this,
        });
        this.setConfig('geometry', column);
    };
    TinyColumnLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    TinyColumnLayer.prototype.processProps = function () {
        var cfg = {
            padding: [0, 0, 0, 0],
            columnSize: this.getSize(),
        };
        this.options = mix(this.options, cfg);
    };
    TinyColumnLayer.prototype.getSize = function () {
        var props = this.options;
        var columnNumber = this.getColumnNum(props.data, props.xField);
        var width = this.width;
        return (width / columnNumber) * WIDTH_RATIO;
    };
    TinyColumnLayer.prototype.getColumnNum = function (data, field) {
        var values = [];
        each(data, function (d) {
            var v = d[field];
            if (values.indexOf(v) < 0) {
                values.push(v);
            }
        });
        return values.length;
    };
    return TinyColumnLayer;
}(TinyLayer));
export default TinyColumnLayer;
registerPlotType('tinyColumn', TinyColumnLayer);
//# sourceMappingURL=layer.js.map