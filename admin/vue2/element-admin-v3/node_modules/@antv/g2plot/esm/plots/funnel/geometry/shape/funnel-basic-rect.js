import { __assign } from "tslib";
import { get, isNil, isArray } from '@antv/util';
import { registerShape } from '@antv/g2';
import { getStyle } from '@antv/g2/lib/geometry/shape/util/get-style';
// 根据数据点生成矩形的四个关键点
function _getRectPoints(cfg, isPyramid) {
    if (isPyramid === void 0) { isPyramid = false; }
    var x = cfg.x, y = cfg.y, y0 = cfg.y0, size = cfg.size;
    // 有 4 种情况，
    // 1. x, y 都不是数组
    // 2. y是数组，x不是
    // 3. x是数组，y不是
    // 4. x, y 都是数组
    var yMin;
    var yMax;
    if (isArray(y)) {
        yMin = y[0];
        yMax = y[1];
    }
    else {
        yMin = y0;
        yMax = y;
    }
    var xMin;
    var xMax;
    if (isArray(x)) {
        xMin = x[0];
        xMax = x[1];
    }
    else {
        xMin = x - size / 2;
        xMax = x + size / 2;
    }
    var points = [
        { x: xMin, y: yMin },
        { x: xMin, y: yMax },
    ];
    if (isPyramid) {
        // 绘制尖底漏斗图
        // 金字塔漏斗图的关键点
        // 1
        // |   2
        // 0
        points.push({
            x: xMax,
            y: (yMax + yMin) / 2,
        });
    }
    else {
        // 矩形的四个关键点，结构如下（左下角顺时针连接）
        // 1 ---- 2
        // |      |
        // 0 ---- 3
        points.push({ x: xMax, y: yMax }, { x: xMax, y: yMin });
    }
    return points;
}
// 根据关键点绘制漏斗图的 path
function _getFunnelPath(cfg, compare) {
    var path = [];
    var points = cfg.points, nextPoints = cfg.nextPoints;
    if (compare) {
        // 对比漏斗
        var yValues = compare.yValues, yValuesMax = compare.yValuesMax, yValuesNext = compare.yValuesNext;
        var originY = (points[0].y + points[1].y) / 2;
        var yValueTotal_1 = yValues[0] + yValues[1];
        var yRatios = yValues.map(function (yValue) { return yValue / yValueTotal_1 / 0.5; });
        var yOffset = (yValuesMax[0] / (yValuesMax[0] + yValuesMax[1]) - 0.5) * 0.9;
        var spacing = 0.001;
        if (!isNil(nextPoints)) {
            var yValueTotalNext_1 = yValuesNext[0] + yValuesNext[1];
            var yRatiosNext = yValuesNext.map(function (yValueNext) { return yValueNext / yValueTotalNext_1 / 0.5; });
            path.push(['M', points[0].x, yOffset + (points[0].y - originY) * yRatios[0] + originY - spacing], ['L', points[1].x, yOffset + originY - spacing], ['L', nextPoints[1].x, yOffset + originY - spacing], ['L', nextPoints[0].x, yOffset + (nextPoints[3].y - originY) * yRatiosNext[0] + originY - spacing], ['Z']);
            path.push(['M', points[0].x, yOffset + originY + spacing], ['L', points[1].x, yOffset + (points[1].y - originY) * yRatios[1] + originY + spacing], ['L', nextPoints[1].x, yOffset + (nextPoints[2].y - originY) * yRatiosNext[1] + originY + spacing], ['L', nextPoints[0].x, yOffset + originY + spacing], ['Z']);
        }
        else {
            path.push(['M', points[0].x, yOffset + (points[0].y - originY) * yRatios[0] + originY], ['L', points[1].x, yOffset + originY], ['L', points[2].x, yOffset + originY], ['L', points[3].x, yOffset + (points[3].y - originY) * yRatios[0] + originY], ['Z']);
            path.push(['M', points[0].x, yOffset + 0.002 + originY], ['L', points[1].x, yOffset + 0.002 + (points[1].y - originY) * yRatios[1] + originY], ['L', points[2].x, yOffset + 0.002 + (points[2].y - originY) * yRatios[1] + originY], ['L', points[3].x, yOffset + 0.002 + originY], ['Z']);
        }
    }
    else {
        // 标准漏斗
        if (!isNil(nextPoints)) {
            path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', nextPoints[1].x, nextPoints[1].y], ['L', nextPoints[0].x, nextPoints[0].y], ['Z']);
        }
        else {
            path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['Z']);
        }
    }
    return path;
}
registerShape('interval', 'funnel-basic-rect', {
    getPoints: function (pointInfo) {
        pointInfo.size = pointInfo.size * 1.8; // 调整面积
        return _getRectPoints(pointInfo);
    },
    draw: function (cfg, container) {
        var _a;
        var style = getStyle(cfg, false, true);
        var compare = get(cfg, 'data.__compare__');
        var path = this.parsePath(_getFunnelPath(cfg, compare));
        return container.addShape('path', (_a = {
                name: 'interval',
                attrs: __assign(__assign({}, style), { path: path })
            },
            _a['__compare__'] = compare,
            _a));
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'square',
            style: {
                r: 4,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=funnel-basic-rect.js.map