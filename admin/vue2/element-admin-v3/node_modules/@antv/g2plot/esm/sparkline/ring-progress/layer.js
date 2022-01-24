import { __extends } from "tslib";
import { mix } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { getGeom } from '../../geoms/factory';
import ProgressLayer from '../progress/layer';
import * as EventParser from './event';
var DEFAULT_COLOR = ['#55A6F3', '#E8EDF3'];
var RingProgressLayer = /** @class */ (function (_super) {
    __extends(RingProgressLayer, _super);
    function RingProgressLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ringProgrsss';
        return _this;
    }
    RingProgressLayer.prototype.processProps = function () {
        var props = this.options;
        props.data = this.processData();
        var cfg = {
            padding: [0, 0, 0, 0],
            xField: 'value',
            yField: '1',
            stackField: 'type',
            barStyle: props.progressStyle,
            color: this.parseColorProps(props) || DEFAULT_COLOR,
        };
        props = mix(props, cfg);
    };
    RingProgressLayer.prototype.coord = function () {
        var coordConfig = {
            type: 'theta',
            cfg: {
                radius: 1.0,
                innerRadius: this.getThickness(this.options.size),
            },
        };
        this.setConfig('coordinate', coordConfig);
    };
    RingProgressLayer.prototype.annotation = function () {
        return;
    };
    RingProgressLayer.prototype.addGeometry = function () {
        var props = this.options;
        this.ring = getGeom('interval', 'main', {
            positionFields: [props.yField, props.xField],
            plot: this,
        });
        this.ring.adjust = [
            {
                type: 'stack',
            },
        ];
        this.setConfig('geometry', this.ring);
    };
    RingProgressLayer.prototype.animation = function () {
        this.ring.animate = {
            appear: {
                duration: 1000,
            },
        };
    };
    RingProgressLayer.prototype.parseEvents = function () {
        _super.prototype.parseEvents.call(this, EventParser);
    };
    RingProgressLayer.prototype.getThickness = function (value) {
        var width = this.width;
        var height = this.height;
        var size = Math.min(width, height);
        if (value) {
            return 1.0 - value / size;
        }
        if (size >= 60) {
            return 1.0 - 20 / size;
        }
        return 1.0 - 10 / size;
    };
    return RingProgressLayer;
}(ProgressLayer));
export default RingProgressLayer;
registerPlotType('ringProgress', RingProgressLayer);
//# sourceMappingURL=layer.js.map