import { __assign } from "tslib";
import { find, map, get } from '@antv/util';
import BBox from '../../../util/bbox';
var BulletRect = /** @class */ (function () {
    function BulletRect(view, cfg) {
        this.view = view;
        this.cfg = cfg;
        this._init();
    }
    /** 绘制辅助labels */
    BulletRect.prototype.draw = function () {
        if (!this.view || this.view.destroyed) {
            return;
        }
        this.container = this.view.middleGroup.addGroup();
        this.container.set('name', 'rectGroups');
        this.container.setZIndex(-100);
        var geometry = this.getGeometry();
        var shapes = map(geometry === null || geometry === void 0 ? void 0 : geometry.elements, function (element) { return element.shape; });
        for (var i = 0; i < this.cfg.ranges.length; i += 1) {
            var shapeBox = shapes[i].getBBox();
            var widthRatio = shapeBox.width / shapes[i].get('origin').data[this.cfg.yField];
            this.drawRect(shapeBox, this.cfg.ranges[i] || [0, 1], widthRatio);
        }
        this.view.canvas.draw();
    };
    BulletRect.prototype.drawRect = function (box, ranges, widthRatio) {
        var options = this.cfg;
        var rangeColors = options.rangeColors;
        var xPos = box.minX;
        var yPos = box.minY - (box.height * (options.rangeSize - 1)) / 2;
        for (var i = 1; i < ranges.length; i += 1) {
            var width = (ranges[i] - ranges[i - 1]) * options.rangeMax * widthRatio;
            this.container
                .addShape('rect', {
                name: 'bullet-rect',
                attrs: {
                    width: width,
                    height: box.height * options.rangeSize,
                    x: xPos,
                    y: yPos,
                    fill: rangeColors[(i - 1) % rangeColors.length],
                    fillOpacity: 0.25,
                },
            })
                .set('zIndex', -1);
            xPos += width;
        }
        if (options.axis && options.axis.visible) {
            var tickInterval = options.rangeMax / (options.axis.tickCount - 1);
            var rangeBox = new BBox(box.x, yPos, xPos, box.height * options.rangeSize);
            this.drawBulletTicks(rangeBox, tickInterval, widthRatio);
        }
    };
    /** 添加 ticks  */
    BulletRect.prototype.drawBulletTicks = function (box, tickInterval, widthRatio) {
        var options = this.cfg;
        var ticksStyle = options.axis.style;
        var tickCount = options.axis.tickCount;
        var tickPosition = options.axis.position;
        var tickOffset = get(ticksStyle, 'lineHeight', 0) - ticksStyle.fontSize / 2;
        for (var tickIdx = 0; tickIdx < tickCount; tickIdx += 1) {
            var x = box.minX + tickInterval * tickIdx * widthRatio;
            var tickText = "" + tickInterval * tickIdx;
            if (options.axis.formatter) {
                tickText = options.axis.formatter(tickText, tickIdx);
            }
            this.container.addShape('text', {
                name: 'tick',
                attrs: __assign({ x: x, y: tickPosition === 'before' ? box.minY - tickOffset : box.maxY + tickOffset, text: "" + tickText }, ticksStyle),
            });
            if (options.axis.tickLine && options.axis.tickLine.visible) {
                var tickLineCfg = options.axis.tickLine;
                if (tickIdx > 0 && tickIdx !== tickCount - 1) {
                    this.container
                        .addShape('path', {
                        attrs: __assign({ path: [
                                ['M', x, box.minY],
                                ['L', x, box.maxY],
                            ] }, tickLineCfg),
                    })
                        .set('zIndex', -1);
                }
            }
        }
    };
    BulletRect.prototype.clear = function () {
        if (this.container) {
            this.container.clear();
        }
    };
    BulletRect.prototype.destroy = function () {
        if (this.container) {
            this.container.remove();
        }
    };
    BulletRect.prototype._init = function () {
        var _this = this;
        this.view.on('beforerender', function () {
            _this.clear();
        });
        this.view.on('afterrender', function () {
            _this.draw();
        });
    };
    BulletRect.prototype.getGeometry = function () {
        return find(this.view.geometries, function (geometry) { return geometry.type === 'interval'; });
    };
    return BulletRect;
}());
export default BulletRect;
//# sourceMappingURL=bulletRect.js.map