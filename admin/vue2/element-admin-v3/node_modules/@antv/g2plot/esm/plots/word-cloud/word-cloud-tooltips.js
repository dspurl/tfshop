import { __extends } from "tslib";
/**
 * Create By Bruce Too
 * On 2020-02-14
 */
import { deepMix } from '@antv/util';
import { HtmlTooltip } from '../../dependents';
var WordCloudTooltips = /** @class */ (function (_super) {
    __extends(WordCloudTooltips, _super);
    function WordCloudTooltips(cfg) {
        var _this = this;
        var newCfg = deepMix({}, cfg, {
            itemTpl: "<div data-index={index}>\n        <span style=\"background-color:{color};\" class=\"g2-tooltip-marker\"></span>\n        {name}<span class=\"g2-tooltip-value\">{value}</span></div>",
        }, cfg);
        _this = _super.call(this, newCfg) || this;
        return _this;
    }
    return WordCloudTooltips;
}(HtmlTooltip));
export default WordCloudTooltips;
//# sourceMappingURL=word-cloud-tooltips.js.map