"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var global_1 = require("../../base/global");
var layer_1 = tslib_1.__importDefault(require("../column/layer"));
var label_1 = tslib_1.__importDefault(require("./component/label"));
var animation_1 = require("./animation");
var RangeColumnLayer = /** @class */ (function (_super) {
    tslib_1.__extends(RangeColumnLayer, _super);
    function RangeColumnLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'rangeColumn';
        return _this;
    }
    RangeColumnLayer.getDefaultOptions = function () {
        return util_1.deepMix(_super.getDefaultOptions.call(this), {
            label: {
                visible: true,
                position: 'outer',
            },
        }, {});
    };
    RangeColumnLayer.prototype.afterRender = function () {
        this.renderLabel();
        // 为更新动画缓存shape
        var shapeCaches = [];
        var geoms = this.view.geometries;
        util_1.each(geoms, function (geom) {
            var elements = geom.elements;
            util_1.each(elements, function (ele) {
                shapeCaches.push(ele.shape);
            });
        });
        animation_1.setShapeCache(shapeCaches);
        _super.prototype.afterRender.call(this);
    };
    RangeColumnLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        this.column.animate = {
            appear: {
                animation: 'clipInFromCenterVertical',
                duration: 600,
            },
            update: {
                animation: 'updateFromCenterVertical',
                duration: 600,
            },
        };
    };
    RangeColumnLayer.prototype.renderLabel = function () {
        if (this.options.label && this.options.label.visible) {
            var label = new label_1.default(tslib_1.__assign({ view: this.view, plot: this }, this.options.label));
            label.render();
        }
    };
    return RangeColumnLayer;
}(layer_1.default));
exports.default = RangeColumnLayer;
global_1.registerPlotType('rangeColumn', RangeColumnLayer);
//# sourceMappingURL=layer.js.map