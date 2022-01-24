import { __spreadArrays } from "tslib";
import { head, last } from '@antv/util';
import fecha from 'fecha';
import { FORMATTER } from '../plots/calendar/constant';
/**
 * 一天多少 ms
 */
export var DAY_MS = 86400000;
/**
 * 获取最大最小日期范围
 * @param dates
 */
export function getDateRange(dates) {
    var ds = __spreadArrays(dates).sort(function (a, b) { return a.getTime() - b.getTime(); });
    return [fecha.format(head(ds), FORMATTER), fecha.format(last(ds), FORMATTER)];
}
/**
 * 日期对应年的范围
 * @param date
 */
export function getYearRange(date) {
    var curr = date ? date : new Date();
    return [
        fecha.format(new Date(curr.getFullYear(), 0, 1), FORMATTER),
        fecha.format(new Date(curr.getFullYear(), 11, 30), FORMATTER),
    ];
}
/**
 * 是否当前月的最后一周
 */
export function isLastWeekOfMonth(date) {
    // 偏移 7 天之后，月份是否一样
    return date.getMonth() !== advanceBy(new Date(date), 7 * DAY_MS).getMonth();
}
/**
 * 是否是当月的最后一天
 */
export function isLastDayOfMonth(date) {
    // 偏移 1 天之后，月份是否一样
    return date.getMonth() !== advanceBy(new Date(date), DAY_MS).getMonth();
}
/**
 * 获取 date 对应的周索引（国际标准：一年的第一个周四为第一周）
 * @param date
 */
export function getWeek(date) {
    // 当年的第一天
    var oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - oneJan.getTime()) / DAY_MS + oneJan.getDay() + 1) / 7);
}
/**
 * 获得一周的第几天（周日第 0 天）
 * @param date
 */
export function getDay(date) {
    return date.getDay();
}
/**
 * 将 Date 前进 ms 时间
 * @param d
 * @param ms
 */
export function advanceBy(d, ms) {
    d.setMilliseconds(d.getMilliseconds() + ms);
    return d;
}
//# sourceMappingURL=date.js.map