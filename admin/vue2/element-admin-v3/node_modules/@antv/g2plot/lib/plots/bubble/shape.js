"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/g2/lib/geometry/shape/point/util");
g2_1.registerShape('point', 'bubble-point', {
    draw: function (cfg, container) {
        var point = util_1.drawPoints(this, cfg, container, 'circle', false);
        // 如果用户未配置 stroke，气泡图 stroke 默认用 fill 颜色
        if (!cfg.style.stroke) {
            var fill = point.attr('fill');
            point.attr('stroke', fill);
        }
        return point;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: color,
            },
        };
    },
});
//# sourceMappingURL=shape.js.map