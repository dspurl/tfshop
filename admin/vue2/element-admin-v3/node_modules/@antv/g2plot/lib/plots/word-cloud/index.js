"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-14
 */
var util_1 = require("@antv/util");
var plot_1 = tslib_1.__importDefault(require("../../base/plot"));
var layer_1 = tslib_1.__importDefault(require("./layer"));
var global_1 = require("../../base/global");
var WordCloud = /** @class */ (function (_super) {
    tslib_1.__extends(WordCloud, _super);
    function WordCloud(container, props) {
        var _this = this;
        // only canvas works for now
        props.renderer = 'canvas';
        _this = _super.call(this, container, props) || this;
        return _this;
    }
    WordCloud.prototype.createLayers = function (props) {
        var layerProps = util_1.deepMix({}, props);
        layerProps.type = 'wordCloud';
        layerProps.container = this.containerDOM;
        _super.prototype.createLayers.call(this, layerProps);
    };
    return WordCloud;
}(plot_1.default));
exports.default = WordCloud;
global_1.registerPlotType('wordCloud', layer_1.default);
//# sourceMappingURL=index.js.map