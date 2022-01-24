"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var g2_1 = require("@antv/g2");
var constant_1 = require("./constant");
var date_1 = require("../../util/date");
/**
 * 注册自定义日历图的 shape
 * code from https://g2.antv.vision/zh/examples/heatmap/heatmap#calendar-horizontal
 */
g2_1.registerShape('polygon', 'calendar-polygon', {
    draw: function (cfg, container) {
        if (!util_1.isEmpty(cfg.points)) {
            var points = cfg.points;
            // rect path
            var path = [
                ['M', points[0].x, points[0].y],
                ['L', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y],
                ['L', points[3].x, points[3].y],
                ['Z'],
            ];
            path = this.parsePath(path);
            var attrs = tslib_1.__assign(tslib_1.__assign({ stroke: '#fff', lineWidth: 1, fill: cfg.color }, cfg.style), { path: path });
            var polygon = container.addShape('path', {
                attrs: attrs,
            });
            var date = cfg.data[constant_1.DATE_FIELD];
            if (date_1.isLastWeekOfMonth(date)) {
                var linePath = [
                    ['M', points[2].x, points[2].y],
                    ['L', points[3].x, points[3].y],
                ];
                // 最后一周的多边形添加右侧边框
                container.addShape('path', {
                    zIndex: 1,
                    attrs: {
                        path: this.parsePath(linePath),
                        lineWidth: 1,
                        stroke: '#404040',
                    },
                });
                if (date_1.isLastDayOfMonth(date)) {
                    container.addShape('path', {
                        zIndex: 1,
                        attrs: {
                            path: this.parsePath([
                                ['M', points[1].x, points[1].y],
                                ['L', points[2].x, points[2].y],
                            ]),
                            lineWidth: 1,
                            stroke: '#404040',
                        },
                    });
                }
            }
            container.sort();
            return polygon;
        }
    },
});
//# sourceMappingURL=shape.js.map