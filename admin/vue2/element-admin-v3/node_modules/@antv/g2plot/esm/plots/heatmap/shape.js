import { registerShape } from '../../dependents';
import { deepMix } from '@antv/util';
export function getRectPath(cx, cy, width, height, size) {
    var w = width * size;
    var h = height * size;
    var path = [
        ['M', cx - w / 2, cy + h / 2],
        ['Q', cx - w / 2, cy, cx - w / 2, cy - h / 2],
        ['Q', cx, cy - h / 2, cx + w / 2, cy - h / 2],
        ['Q', cx + w / 2, cy, cx + w / 2, cy + h / 2],
        ['Q', cx, cy + h / 2, cx - w / 2, cy + h / 2],
        ['Z'],
    ];
    return path;
}
export function getCirclePath(x, y, size) {
    var path = [
        ['M', x, y],
        ['l', -size, 0],
        ['a', size, size, 0, 1, 0, size * 2, 0],
        ['a', size, size, 0, 1, 0, -(size * 2), 0],
        ['Z'],
    ];
    return path;
}
export function getCircleCurve(x, y, size) {
    // 计算四个角和中点
    var path = [
        ['M', x - size, y],
        ['Q', x - size, y - size, x, y - size],
        ['Q', x + size, y - size, x + size, y],
        ['Q', x + size, y + size, x, y + size],
        ['Q', x - size, y + size, x - size, y],
        ['Z'],
    ];
    return path;
}
registerShape('polygon', 'rect', {
    draw: function (cfg, container) {
        var points = this.parsePoints(cfg.points);
        var width = points[2].x - points[0].x;
        var height = points[0].y - points[1].y;
        var centerX = points[0].x + width / 2;
        var centerY = points[1].y + height / 2;
        /*
            const path = [
              ['M', centerX - w / 2, centerY + h / 2],
              ['L', centerX - w / 2, centerY - h / 2],
              ['L', centerX + w / 2, centerY - h / 2],
              ['L', centerX + w / 2, centerY + h / 2],
              ['Z'],
            ];
            */
        var path = getRectPath(centerX, centerY, width, height, cfg.size);
        return container.addShape('path', {
            attrs: deepMix({}, {
                path: path,
                fill: cfg.color,
                opacity: 1,
            }, cfg.style),
        });
    },
});
registerShape('point', 'curvePoint', {
    draw: function (cfg, container) {
        var path = getCirclePath(cfg.x, cfg.y, cfg.size);
        return container.addShape('path', {
            attrs: deepMix({}, {
                path: path,
                fill: cfg.color,
                opacity: 1,
            }, cfg.style),
        });
    },
});
//# sourceMappingURL=shape.js.map