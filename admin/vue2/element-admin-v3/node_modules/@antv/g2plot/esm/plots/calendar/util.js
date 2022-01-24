import { __assign } from "tslib";
import fecha from 'fecha';
import { head, last, find } from '@antv/util';
import { DATE_FIELD, DAY_FIELD, FORMATTER, WEEK_FIELD } from './constant';
import { advanceBy, DAY_MS, getDay, getWeek } from '../../util/date';
/**
 * 解析日期
 * @param dateRange
 */
function parseDateRange(dateRange) {
    var _a;
    var from = dateRange[0], to = dateRange[1];
    var fromDate = fecha.parse(from, FORMATTER);
    var toDate = fecha.parse(to, FORMATTER);
    // 交换顺序
    if (fromDate > toDate) {
        _a = [fromDate, toDate], toDate = _a[0], fromDate = _a[1];
    }
    return [fromDate, toDate];
}
/**
 * 根据 range 补齐日历图的数据
 * @param data 传入数据
 * @param dateRange 日期区间
 * @param dateField 日期字段
 */
export function generateCalendarData(data, dateRange, dateField) {
    var all = [];
    var _a = parseDateRange(dateRange), fromDate = _a[0], toDate = _a[1];
    // copy 一份
    var curr = new Date(fromDate);
    var _loop_1 = function () {
        var _a;
        var dateString = fecha.format(curr, FORMATTER);
        // 找到对应的数据
        var datum = find(data, function (datum) { return datum[dateField] === dateString; });
        all.push(__assign((_a = {}, _a[DAY_FIELD] = getDay(curr), _a[WEEK_FIELD] = "" + getWeek(curr), _a[dateField] = dateString, _a[DATE_FIELD] = new Date(curr), _a), datum));
        // 向前移动一天
        advanceBy(curr, DAY_MS);
    };
    while (curr <= toDate) {
        _loop_1();
    }
    return all;
}
/**
 * 计算每个月的中间周。
 */
export function getMonthCenterWeek(dateRange) {
    var _a = parseDateRange(dateRange), fromDate = _a[0], toDate = _a[1];
    var monthWeekMap = new Map();
    function append(current) {
        var month = current.getMonth(); // 从 0 开始
        var week = getWeek(current);
        if (!monthWeekMap.has(month)) {
            monthWeekMap.set(month, []);
        }
        monthWeekMap.get(month).push(week);
    }
    // copy 一份
    var curr = new Date(fromDate);
    while (curr <= toDate) {
        // 设置到 map 中
        append(curr);
        // 向前移动 7 天（一周）
        advanceBy(curr, DAY_MS * 7);
    }
    // 增加最后一个日期的计算
    if (toDate < curr) {
        append(toDate);
    }
    // 处理数据，返回结果
    var result = {}; // week -> month
    monthWeekMap.forEach(function (v, k) {
        var w = Math.ceil((head(v) + last(v)) / 2); // 取平均值
        result[w] = k;
    });
    return result;
}
//# sourceMappingURL=util.js.map