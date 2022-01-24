import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import CalenderLayer from './layer';
// 注册日历图的自定义 shape
import './shape';
/**
 * 日历图
 */
var Calendar = /** @class */ (function (_super) {
    __extends(Calendar, _super);
    function Calendar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 复写父类方法
     * @param props
     */
    Calendar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'calendar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Calendar.getDefaultOptions = CalenderLayer.getDefaultOptions;
    return Calendar;
}(BasePlot));
export default Calendar;
//# sourceMappingURL=index.js.map