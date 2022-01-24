import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import BarLayer from './layer';
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bar.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'bar';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Bar.getDefaultOptions = BarLayer.getDefaultOptions;
    return Bar;
}(BasePlot));
export default Bar;
//# sourceMappingURL=index.js.map