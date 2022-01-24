import { _ORIGIN, } from '../dependents';
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;
export var timeIntervals = {
    second: { value: SECOND, format: 'HH:mm:ss' },
    miniute: { value: MINUTE, format: 'HH:mm' },
    hour: { value: HOUR, format: 'HH' },
    day: { value: DAY, format: 'YYYY-MM-DD' },
    week: { value: WEEK, format: 'YYYY-MM-DD' },
    month: { value: MONTH, format: 'YYYY-MM' },
    year: { value: YEAR, format: 'YYYY' },
};
//# sourceMappingURL=config.js.map