import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import TinyAreaLayer from './layer';
var TinyArea = /** @class */ (function (_super) {
    __extends(TinyArea, _super);
    function TinyArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyArea.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'tinyArea';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyArea.getDefaultOptions = TinyAreaLayer.getDefaultOptions;
    return TinyArea;
}(BasePlot));
export default TinyArea;
//# sourceMappingURL=index.js.map