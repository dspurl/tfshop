"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-18
 */
var util_1 = require("@antv/util");
var layer_1 = require("../../layer");
var dependents_1 = require("../../../../dependents");
function getDefaultCfg() {
    return {
        fill: '#fff',
        fontSize: 12,
        lineHeight: 12,
        stroke: 'rgba(0, 0, 0, 0.45)',
    };
}
var DiffLabel = /** @class */ (function () {
    function DiffLabel(cfg) {
        this.textAttrs = {};
        this.view = cfg.view;
        this.fields = cfg.fields;
        this.formatter = cfg.formatter;
        this.textAttrs = util_1.mix(getDefaultCfg(), cfg.style);
        this._init();
    }
    /** 绘制辅助labels */
    DiffLabel.prototype.draw = function () {
        var _this = this;
        if (!this.view || this.view.destroyed) {
            return;
        }
        var data = util_1.clone(this.view.getData());
        this.container = this.view.foregroundGroup.addGroup();
        var shapes = this.view.geometries[0].elements.map(function (value) { return value.shape; });
        util_1.each(shapes, function (shape, idx) {
            if (!shape.cfg.origin)
                return;
            var _origin = shape.cfg.origin.data;
            var shapeBox = shape.getBBox();
            var values = _origin[layer_1.VALUE_FIELD];
            var diff = values;
            if (util_1.isArray(values)) {
                diff = values[1] - values[0];
            }
            diff = diff > 0 ? "+" + diff : diff;
            /** is total, total do not need `+` sign */
            if (_origin[layer_1.IS_TOTAL]) {
                diff = values[0] - values[1];
            }
            var formattedText = diff;
            if (_this.formatter) {
                var color = shapes[idx].attr('fill');
                formattedText = _this.formatter("" + diff, { _origin: data[idx], color: color }, idx);
            }
            var text = _this.container.addShape('text', {
                attrs: tslib_1.__assign({ text: formattedText, textBaseline: 'middle', textAlign: 'center', x: (shapeBox.minX + shapeBox.maxX) / 2, y: (shapeBox.minY + shapeBox.maxY) / 2 }, _this.textAttrs),
                name: 'dill-label',
            });
            if (text.getBBox().height > shapeBox.height) {
                text.set('visible', false);
            }
        });
        this.view.getCanvas().draw();
    };
    DiffLabel.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    DiffLabel.prototype._init = function () {
        var _this = this;
        this.view.on(dependents_1.VIEW_LIFE_CIRCLE.BEFORE_RENDER, function () {
            _this.clear();
        });
        this.view.on(dependents_1.VIEW_LIFE_CIRCLE.AFTER_RENDER, function () {
            _this.draw();
        });
    };
    return DiffLabel;
}());
exports.default = DiffLabel;
//# sourceMappingURL=diff-label.js.map