"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var view_layer_1 = tslib_1.__importDefault(require("../base/view-layer"));
var factory_1 = require("../components/factory");
require("../geoms/line/mini");
var TinyLayer = /** @class */ (function (_super) {
    tslib_1.__extends(TinyLayer, _super);
    function TinyLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyLayer.getDefaultOptions = function () {
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
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
        util_1.each(props.guideLine, function (line) {
            var guideLine = factory_1.getComponent('guideLine', {
                plot: _this,
                cfg: util_1.deepMix({}, defaultGuidelineCfg, line),
            });
            config.push(guideLine);
        });
        this.setConfig('annotations', config);
    };
    return TinyLayer;
}(view_layer_1.default));
exports.default = TinyLayer;
//# sourceMappingURL=tiny-layer.js.map