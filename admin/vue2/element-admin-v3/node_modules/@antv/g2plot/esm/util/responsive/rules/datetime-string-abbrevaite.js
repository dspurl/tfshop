import { each } from '@antv/util';
import fecha from 'fecha';
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MONTH = 31 * DAY;
var YEAR = 365 * DAY;
export default function datetimeStringAbbrevaite(shape, option, index, cfg) {
    var nodes = cfg.nodes.nodes;
    var campareText;
    if (index === nodes.length - 1) {
        campareText = nodes[index - 1].shape.get('delegateObject').item.name;
    }
    else {
        campareText = nodes[index + 1].shape.get('delegateObject').item.name;
    }
    var compare = new Date(campareText);
    /** 获取时间周期和时间间隔 */
    var text = shape.get('delegateObject').item.name;
    var current = new Date(text);
    var startText = nodes[0].shape.get('delegateObject').item.name;
    var start = new Date(startText);
    var endText = nodes[nodes.length - 1].shape.get('delegateObject').item.name;
    var end = new Date(endText);
    var timeDuration = getDateTimeMode(start, end);
    var timeCycle = getDateTimeMode(current, compare); // time frequency
    // 如果duration和frequency在同一区间
    if (timeDuration === timeCycle) {
        if (index !== 0 && index !== nodes.length - 1) {
            var formatter = sameSectionFormatter(timeDuration);
            shape.attr('text', fecha.format(current, formatter));
        }
        return;
    }
    if (index !== 0) {
        var previousText = nodes[index - 1].shape.get('delegateObject').item.name;
        var previous = new Date(previousText);
        var isAbbreviate = needAbbrevaite(timeDuration, current, previous);
        if (isAbbreviate) {
            var formatter = getAbbrevaiteFormatter(timeDuration, timeCycle);
            shape.attr('text', fecha.format(current, formatter));
            return;
        }
    }
}
function needAbbrevaite(mode, current, previous) {
    var currentStamp = getTime(current, mode);
    var previousStamp = getTime(previous, mode);
    if (currentStamp !== previousStamp) {
        return false;
    }
    return true;
}
function getDateTimeMode(a, b) {
    var mode;
    var dist = Math.abs(a - b);
    var mapper = {
        minute: [MINUTE, HOUR],
        hour: [HOUR, DAY],
        day: [DAY, MONTH],
        month: [MONTH, YEAR],
        year: [YEAR, Infinity],
    };
    each(mapper, function (range, key) {
        if (dist >= range[0] && dist < range[1]) {
            mode = key;
        }
    });
    return mode;
}
function getAbbrevaiteFormatter(duration, cycle) {
    var times = ['year', 'month', 'day', 'hour', 'minute'];
    var formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    var startIndex = times.indexOf(duration) + 1;
    var endIndex = times.indexOf(cycle);
    var formatter = '';
    for (var i = startIndex; i <= endIndex; i++) {
        formatter += formatters[i];
        if (i < endIndex) {
            formatter += '-';
        }
    }
    return formatter;
}
function sameSectionFormatter(mode) {
    var times = ['year', 'month', 'day', 'hour', 'minute'];
    var formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    var index = times.indexOf(mode);
    var formatter = formatters[index];
    return formatter;
}
function getTime(date, mode) {
    if (mode === 'year') {
        return date.getFullYear();
    }
    if (mode === 'month') {
        return date.getMonth() + 1;
    }
    if (mode === 'day') {
        return date.getDay() + 1;
    }
    if (mode === 'hour') {
        return date.getHours() + 1;
    }
    if (mode === 'minute') {
        return date.getMinutes() + 1;
    }
}
/*tslint:disable*/
export function isTime(string) {
    var hourminExp = /^(?:(?:[0-2][0-3])|(?:[01]\d)):[0-5]\d$/;
    var hourminSecExp = /^(?:(?:[0-2][0-3])|(?:[01]\d))(?::[0-5]\d){2}$/;
    return hourminExp.test(string) || hourminSecExp.test(string);
}
//# sourceMappingURL=datetime-string-abbrevaite.js.map