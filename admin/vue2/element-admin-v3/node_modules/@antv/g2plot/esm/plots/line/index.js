import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import LineLayer from './layer';
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'line';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Line.getDefaultOptions = LineLayer.getDefaultOptions;
    return Line;
}(BasePlot));
export default Line;
//# sourceMappingURL=index.js.map