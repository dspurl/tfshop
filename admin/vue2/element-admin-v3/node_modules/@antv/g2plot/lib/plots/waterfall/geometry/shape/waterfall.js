"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-18
 */
var util_1 = require("@antv/util");
var dependents_1 = require("../../../../dependents");
function getStyle(cfg, isStroke, isFill) {
    var style = cfg.style, defaultStyle = cfg.defaultStyle, color = cfg.color;
    var attrs = tslib_1.__assign(tslib_1.__assign({}, defaultStyle), style);
    if (color) {
        if (isStroke) {
            attrs.stroke = color;
        }
        if (isFill) {
            attrs.fill = color;
        }
    }
    return attrs;
}
function getRectPath(points) {
    var path = [];
    var firstPoint = points[0];
    path.push(['M', firstPoint.x, firstPoint.y]);
    for (var i = 1, len = points.length; i < len; i++) {
        path.push(['L', points[i].x, points[i].y]);
    }
    path.push(['L', firstPoint.x, firstPoint.y]); // 需要闭合
    path.push(['z']);
    return path;
}
// @ts-ignore
dependents_1.registerShape('interval', 'waterfall', {
    // @ts-ignore
    draw: function (cfg, container) {
        var style = getStyle(cfg, false, true);
        var path = this.parsePath(getRectPath(cfg.points));
        var shape = container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
            name: 'interval',
        });
        var leaderLine = util_1.get(cfg.style, 'leaderLine');
        if (leaderLine && leaderLine.visible) {
            var lineStyle = leaderLine.style || {};
            // 2. 虚线连线
            if (cfg.nextPoints) {
                var linkPath = [
                    // @ts-ignore
                    ['M', cfg.points[2].x, cfg.points[2].y],
                    // @ts-ignore
                    ['L', cfg.nextPoints[0].x, cfg.nextPoints[0].y],
                ];
                linkPath = this.parsePath(linkPath);
                container.addShape('path', {
                    attrs: tslib_1.__assign({ path: linkPath, stroke: '#d3d3d3', lineDash: [4, 2], lineWidth: 1 }, lineStyle),
                    name: 'leader-line',
                });
            }
        }
        return shape;
    },
});
//# sourceMappingURL=waterfall.js.map