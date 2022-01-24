"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var Marker = /** @class */ (function () {
    function Marker(cfg) {
        util_1.assign(this, cfg);
        this.init();
    }
    Marker.prototype.destroy = function () {
        if (this.shape) {
            this.shape.destroy();
        }
    };
    Marker.prototype.update = function (cfg, duration, easing) {
        var updateCfg = {};
        util_1.assign(this, cfg);
        this.coord = this.view.geometries[0].coordinate;
        if (cfg.value) {
            var x = this.coord.convert({ x: 0, y: this.value }).x;
            var matrix = [1, 0, 0, 0, 1, 0, x, 0, 1];
            updateCfg.matrix = matrix;
        }
        if (cfg.style) {
            var shape = this.shape;
            var origin_attr = shape.attrs;
            var attrs = util_1.deepMix({}, origin_attr, cfg.style);
            updateCfg = util_1.deepMix({}, attrs, updateCfg);
        }
        this.shape.stopAnimate();
        this.shape.animate(updateCfg, duration, easing);
    };
    Marker.prototype.init = function () {
        this.coord = this.view.geometries[0].coordinate;
        this.container = this.view.foregroundGroup.addGroup();
        var x = this.coord.convert({ x: 0, y: this.value }).x; // progress坐标系是转置坐标系
        var y0 = this.coord.center.y - this.progressSize / 2 - 2;
        var y1 = this.coord.center.y + this.progressSize / 2 + 2;
        var style = util_1.deepMix({}, { stroke: 'grey', lineWidth: 1 }, this.style);
        this.shape = this.container.addShape('path', {
            attrs: tslib_1.__assign({ path: [
                    ['M', 0, y0],
                    ['L', 0, y1],
                ] }, style),
            name: 'progress-marker',
        });
        this.shape.move(x, 0);
        this.canvas.draw();
    };
    return Marker;
}());
exports.default = Marker;
//# sourceMappingURL=marker.js.map