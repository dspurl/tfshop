"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var event_emitter_1 = tslib_1.__importDefault(require("@antv/event-emitter"));
var HeatmapBackground = /** @class */ (function (_super) {
    tslib_1.__extends(HeatmapBackground, _super);
    function HeatmapBackground(cfg) {
        var _this = _super.call(this) || this;
        _this.options = cfg;
        _this.view = _this.options.view;
        _this.init();
        return _this;
    }
    HeatmapBackground.prototype.init = function () {
        var coord = this.getCoordinate();
        this.width = coord.getWidth();
        this.height = coord.getHeight();
        this.x = coord.start.x;
        this.y = coord.end.y;
        this.container = this.view.backgroundGroup.addGroup({});
    };
    HeatmapBackground.prototype.render = function () {
        if (this.options.type === 'color') {
            this.renderColorBackground();
        }
        else if (this.options.type === 'image') {
            this.renderImageBackground();
        }
        else if (this.options.callback) {
            var callbackCfg = {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                container: this.container,
            };
            this.options.callback(callbackCfg);
        }
    };
    HeatmapBackground.prototype.renderColorBackground = function () {
        this.container.addShape('rect', {
            attrs: {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                fill: this.options.value,
            },
            name: 'heatmap-background',
        });
    };
    HeatmapBackground.prototype.renderImageBackground = function () {
        this.container.addShape('image', {
            attrs: {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                img: this.options.src,
            },
            name: 'heatmap-background',
        });
    };
    HeatmapBackground.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
            this.emit('background:clear');
        }
    };
    HeatmapBackground.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
            // 使用callback定制的html background需要自己监听销毁事件自行销毁
            this.emit('background:destroy');
        }
    };
    HeatmapBackground.prototype.getCoordinate = function () {
        var coordinate;
        util_1.each(this.view.geometries, function (geom) {
            if (geom.type === 'heatmap') {
                coordinate = geom.coordinate;
            }
        });
        return coordinate;
    };
    return HeatmapBackground;
}(event_emitter_1.default));
exports.default = HeatmapBackground;
//# sourceMappingURL=background.js.map