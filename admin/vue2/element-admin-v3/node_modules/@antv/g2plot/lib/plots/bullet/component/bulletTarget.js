"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var BulletTarget = /** @class */ (function () {
    function BulletTarget(view, cfg) {
        this.view = view;
        this.cfg = cfg;
        this._init();
    }
    /** 绘制辅助labels */
    BulletTarget.prototype.draw = function () {
        if (!this.view || this.view.destroyed) {
            return;
        }
        this.container = this.view.foregroundGroup.addGroup();
        this.container.set('name', 'targetGroups');
        var shapes = util_1.map(this.getGeometry().elements, function (element) { return element.shape; });
        for (var i = 0; i < this.cfg.targets.length; i += 1) {
            var shapeBox = shapes[i].getBBox();
            var widthRatio = shapeBox.width / shapes[i].get('origin').data[this.cfg.yField];
            this.drawTarget(shapeBox, this.cfg.targets[i], widthRatio);
        }
        this.view.canvas.draw();
    };
    BulletTarget.prototype.drawTarget = function (box, targets, widthRatio) {
        var _this = this;
        var options = this.cfg;
        var colors = options.markerColors;
        /** 添加目标值 */
        targets.forEach(function (target, i) {
            var markerStyle = options.markerStyle;
            _this.container.addShape('rect', {
                name: 'bullet-target',
                attrs: tslib_1.__assign(tslib_1.__assign({ width: markerStyle.width, height: box.height * options.markerSize - markerStyle.width / 2, x: box.minX + target * widthRatio, y: box.minY - (box.height * (options.markerSize - 1)) / 2 }, markerStyle), { fill: colors[i % colors.length] || markerStyle.fill }),
            });
        });
    };
    BulletTarget.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    BulletTarget.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
    };
    BulletTarget.prototype._init = function () {
        var _this = this;
        this.view.on('beforerender', function () {
            _this.clear();
        });
        this.view.on('afterrender', function () {
            _this.draw();
        });
    };
    BulletTarget.prototype.getGeometry = function () {
        return util_1.find(this.view.geometries, function (geometry) { return geometry.type === 'interval'; });
    };
    return BulletTarget;
}());
exports.default = BulletTarget;
//# sourceMappingURL=bulletTarget.js.map