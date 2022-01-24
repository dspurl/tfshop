import { __assign } from "tslib";
import { isEmpty } from '@antv/util';
import { registerShape } from '@antv/g2';
import { DATE_FIELD } from './constant';
import { isLastDayOfMonth, isLastWeekOfMonth } from '../../util/date';
/**
 * 注册自定义日历图的 shape
 * code from https://g2.antv.vision/zh/examples/heatmap/heatmap#calendar-horizontal
 */
registerShape('polygon', 'calendar-polygon', {
    draw: function (cfg, container) {
        if (!isEmpty(cfg.points)) {
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
            var attrs = __assign(__assign({ stroke: '#fff', lineWidth: 1, fill: cfg.color }, cfg.style), { path: path });
            var polygon = container.addShape('path', {
                attrs: attrs,
            });
            var date = cfg.data[DATE_FIELD];
            if (isLastWeekOfMonth(date)) {
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
                if (isLastDayOfMonth(date)) {
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