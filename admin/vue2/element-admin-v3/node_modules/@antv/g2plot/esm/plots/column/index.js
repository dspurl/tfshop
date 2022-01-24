import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import ColumnLayer from './layer';
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Column.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'column';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Column.getDefaultOptions = ColumnLayer.getDefaultOptions;
    return Column;
}(BasePlot));
export default Column;
//# sourceMappingURL=index.js.map