"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
// 注册日历图的自定义 shape
require("./shape");
/**
 * 日历图
 */
var Calendar = /** @class */ (function (_super) {
    tslib_1.__extends(Calendar, _super);
    function Calendar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 复写父类方法
     * @param props
     */
    Calendar.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'calendar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Calendar.getDefaultOptions = layer_1.default.getDefaultOptions;
    return Calendar;
}(plot_1.default));
exports.default = Calendar;
//# sourceMappingURL=index.js.map