"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-14
 */
var util_1 = require("@antv/util");
var dependents_1 = require("../../dependents");
var WordCloudTooltips = /** @class */ (function (_super) {
    tslib_1.__extends(WordCloudTooltips, _super);
    function WordCloudTooltips(cfg) {
        var _this = this;
        var newCfg = util_1.deepMix({}, cfg, {
            itemTpl: "<div data-index={index}>\n        <span style=\"background-color:{color};\" class=\"g2-tooltip-marker\"></span>\n        {name}<span class=\"g2-tooltip-value\">{value}</span></div>",
        }, cfg);
        _this = _super.call(this, newCfg) || this;
        return _this;
    }
    return WordCloudTooltips;
}(dependents_1.HtmlTooltip));
exports.default = WordCloudTooltips;
//# sourceMappingURL=word-cloud-tooltips.js.map