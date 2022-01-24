import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import TinyLineLayer from './layer';
var TinyLine = /** @class */ (function (_super) {
    __extends(TinyLine, _super);
    function TinyLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyLine.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'tinyLine';
        _super.prototype.createLayers.call(this, layerProps);
    };
    TinyLine.getDefaultOptions = TinyLineLayer.getDefaultOptions;
    return TinyLine;
}(BasePlot));
export default TinyLine;
//# sourceMappingURL=index.js.map