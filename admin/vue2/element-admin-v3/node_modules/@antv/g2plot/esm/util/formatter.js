import { isNil } from '@antv/util';
export var combineFormatter = function () {
    var formatters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        formatters[_i] = arguments[_i];
    }
    return function (text, item, idx) {
        return formatters.reduce(function (curText, formatter) { return formatter(curText, item, idx); }, text);
    };
};
export var getNoopFormatter = function () { return function (text) { return text; }; };
export var getPrecisionFormatter = function (precision) { return function (text) {
    var num = Number(text);
    return isNaN(num) || isNil(precision) ? text : num.toFixed(precision);
}; };
export var getSuffixFormatter = function (suffix) { return function (text) {
    return isNil(suffix) ? text : text + " " + suffix;
}; };
//# sourceMappingURL=formatter.js.map