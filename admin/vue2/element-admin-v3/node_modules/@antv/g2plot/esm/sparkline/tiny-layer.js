import { __extends } from "tslib";
import { deepMix, each } from '@antv/util';
import ViewLayer from '../base/view-layer';
import { getComponent } from '../components/factory';
import '../geoms/line/mini';
var TinyLayer = /** @class */ (function (_super) {
    __extends(TinyLayer, _super);
    function TinyLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyLayer.getDefaultOptions = function () {
        return deepMix({}, _super.getDefaultOptions.call(this), {
            title: {
                visible: false,
            },
            description: {
                visible: false,
            },
            padding: [0, 0, 0, 0],
            legend: {
                visible: false,
            },
            xAxis: {
                visible: false,
            },
            yAxis: {
                visible: false,
            },
            tooltip: {
                visible: false,
            },
        });
    };
    TinyLayer.prototype.coord = function () {
        return;
    };
    TinyLayer.prototype.addGeometry = function () {
        return;
    };
    TinyLayer.prototype.annotation = function () {
        var _this = this;
        var props = this.options;
        var config = [];
        var defaultGuidelineCfg = {
            line: {
                style: {
                    lineWidth: 1,
                    stroke: '#66d6a8',
                },
            },
        };
        each(props.guideLine, function (line) {
            var guideLine = getComponent('guideLine', {
                plot: _this,
                cfg: deepMix({}, defaultGuidelineCfg, line),
            });
            config.push(guideLine);
        });
        this.setConfig('annotations', config);
    };
    return TinyLayer;
}(ViewLayer));
export default TinyLayer;
//# sourceMappingURL=tiny-layer.js.map