"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var layer_1 = tslib_1.__importDefault(require("../gauge/layer"));
var MeterGaugeLayer = /** @class */ (function (_super) {
    tslib_1.__extends(MeterGaugeLayer, _super);
    function MeterGaugeLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'meterGauge';
        return _this;
    }
    MeterGaugeLayer.getDefaultOptions = function () {
        return util_1.deepMix({}, _super.getDefaultOptions.call(this), {
            axis: {
                visible: true,
                offset: -10,
                tickCount: 25,
                subTickCount: 4,
                tickLine: {
                    visible: true,
                    length: 2,
                    style: {
                        stroke: '#aaa',
                        lineWidth: 1,
                    },
                },
            },
        });
    };
    return MeterGaugeLayer;
}(layer_1.default));
exports.default = MeterGaugeLayer;
global_1.registerPlotType('meterGauge', MeterGaugeLayer);
//# sourceMappingURL=layer.js.map