import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import AreaLayer from './layer';
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Area.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'area';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Area.getDefaultOptions = AreaLayer.getDefaultOptions;
    return Area;
}(BasePlot));
export default Area;
//# sourceMappingURL=index.js.map