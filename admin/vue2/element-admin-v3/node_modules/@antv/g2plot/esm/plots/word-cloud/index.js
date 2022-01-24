import { __extends } from "tslib";
/**
 * Create By Bruce Too
 * On 2020-02-14
 */
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import WordCloudLayer from './layer';
import { registerPlotType } from '../../base/global';
var WordCloud = /** @class */ (function (_super) {
    __extends(WordCloud, _super);
    function WordCloud(container, props) {
        var _this = this;
        // only canvas works for now
        props.renderer = 'canvas';
        _this = _super.call(this, container, props) || this;
        return _this;
    }
    WordCloud.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'wordCloud';
        layerProps.container = this.containerDOM;
        _super.prototype.createLayers.call(this, layerProps);
    };
    return WordCloud;
}(BasePlot));
export default WordCloud;
registerPlotType('wordCloud', WordCloudLayer);
//# sourceMappingURL=index.js.map