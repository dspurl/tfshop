import { isNil, isNumber, filter } from '@antv/util';
import { timeIntervals } from '../interface/config';
function adjustTimeTickInterval(interval) {
    var intervals = timeIntervals;
    var intervalArr = interval.split(' ');
    var basicInterval = intervals[intervalArr[1]];
    var intervalCount = parseInt(intervalArr[0], 10);
    return [basicInterval.format, intervalCount * basicInterval.value];
}
export function extractScale(desScale, axisConfig) {
    if (!axisConfig) {
        return desScale;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'tickCount')) {
        desScale.tickCount = axisConfig.tickCount;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'type')) {
        // fixme: dateTime plot层处理
        if (axisConfig.type !== 'dateTime') {
            desScale.type = axisConfig.type;
        }
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'tickInterval')) {
        if (axisConfig.type === 'time') {
            desScale.tickInterval = adjustTimeTickInterval(axisConfig.tickInterval);
        }
        else {
            desScale.tickInterval = axisConfig.tickInterval;
        }
    }
    if (axisConfig.type === 'time' && axisConfig.mask) {
        desScale.mask = axisConfig.mask;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'min')) {
        desScale.min = axisConfig.min;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'max')) {
        desScale.max = axisConfig.max;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'minLimit')) {
        desScale.minLimit = axisConfig.minLimit;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'maxLimit')) {
        desScale.maxLimit = axisConfig.maxLimit;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'nice')) {
        desScale.nice = axisConfig.nice;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'formatter')) {
        desScale.formatter = axisConfig.formatter;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'exponent')) {
        desScale.exponent = axisConfig.exponent;
    }
    if (Object.prototype.hasOwnProperty.call(axisConfig, 'base')) {
        desScale.base = axisConfig.base;
    }
    if (axisConfig.tickMethod) {
        desScale.tickMethod = axisConfig.tickMethod;
    }
}
export function trySetScaleMinToZero(desScale, data) {
    var validData = filter(data, function (v) { return isNumber(v); });
    var min = Math.min.apply(Math, validData);
    var max = Math.max.apply(Math, validData);
    if (min > 0) {
        if (isNil(desScale.min)) {
            desScale.min = 0;
        }
    }
    else if (max < 0) {
        if (isNil(desScale.max)) {
            desScale.max = 0;
        }
    }
}
//# sourceMappingURL=scale.js.map