import { __assign } from "tslib";
import { get } from '@antv/util';
import { registerShape } from '@antv/g2';
import { getStyle } from '@antv/g2/lib/geometry/shape/util/get-style';
function lerp(a, b, factor) {
    return (1 - factor) * a + factor * b;
}
// 根据矩形关键点绘制 path
function _getRectPath(points, _a) {
    var reverse = _a.reverse, ratioUpper = _a.ratioUpper, ratioLower = _a.ratioLower;
    var path = [];
    var firstPoint = points[0];
    var originX = (points[1].x + points[2].x) / 2;
    var factorTop = 1.2;
    var factorBottom = 0.6;
    if (reverse) {
        var tmp = ratioLower;
        ratioLower = ratioUpper;
        ratioUpper = tmp;
    }
    var firstPointX = (firstPoint.x - originX) * lerp(factorBottom, factorTop, ratioLower) + originX;
    path.push(['M', firstPointX, firstPoint.y]);
    for (var i = 1, len = points.length; i < len; i++) {
        var pointX = points[i].x;
        switch (i) {
            case 1:
            case 2:
                pointX = (pointX - originX) * lerp(factorBottom, factorTop, ratioUpper) + originX;
                break;
            case 3:
                pointX = (pointX - originX) * lerp(factorBottom, factorTop, ratioLower) + originX;
                break;
        }
        path.push(['L', pointX, points[i].y]);
    }
    path.push(['L', firstPointX, firstPoint.y]); // 需要闭合
    path.push(['z']);
    return path;
}
registerShape('interval', 'funnel-dynamic-rect', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, false, true);
        var custom = get(cfg, 'data.__custom__');
        var path = this.parsePath(_getRectPath(cfg.points, custom));
        return container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color, isInPolar = markerCfg.isInPolar;
        return {
            symbol: isInPolar ? 'circle' : 'square',
            style: {
                r: isInPolar ? 4.5 : 4,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=funnel-dynamic-rect.js.map