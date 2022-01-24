"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var math_1 = require("../../math");
var unitMapper = {
    k: { number: 1e3, index: 0 },
    m: { number: 1e6, index: 1 },
    b: { number: 1e9, index: 2 },
    t: { number: 1e12, index: 3 },
};
// https://gist.github.com/MartinMuzatko/1060fe584d17c7b9ca6e
// https://jburrows.wordpress.com/2014/11/18/abbreviating-numbers/
/*tslint:disable*/
function digitsAbbreviate(shape, option, index, cfg) {
    if (!util_1.has(cfg, 'node') || !util_1.has(cfg.node, 'node')) {
        return;
    }
    var nodes = cfg.nodes.nodes;
    var number = parseFloat(shape.get('origin').text);
    if (number === 0) {
        return;
    }
    if (option.formatter) {
        shape.attr('text', option.formatter(number));
        return;
    }
    if (option.unit) {
        var _a = abbravateDigitsByUnit(option, number), num = _a.num, unitname = _a.unitname;
        shape.attr('text', num + unitname);
    }
    else {
        // 自动换算逻辑
        // 根据中位数得到换算单位
        var numbers = extractNumbers(nodes);
        var median = math_1.getMedian(numbers);
        var unitname = getUnitByNumber(median);
        //根据数值的interval计算换算后保留的浮点数
        var unitNumber = unitMapper[unitname].number;
        var interval = getLinearNodesInterval(nodes);
        var decimal = getDigitsDecimal(interval, unitNumber);
        var num = abbravateDigitsByUnit({ unit: unitname, decimal: decimal }, number).num;
        shape.attr('text', num + unitname);
    }
}
exports.default = digitsAbbreviate;
function abbravateDigitsByUnit(option, number) {
    var units = ['k', 'm', 'b', 't'];
    var num;
    var unitname;
    if (option.unit === 'auto') {
        /** auto formatt k-m-b-t */
        var order = Math.floor(Math.log(number) / Math.log(1000));
        unitname = units[order - 1];
        num = (number / Math.pow(1000, order)).toFixed(option.decimal);
    }
    else if (option.unit) {
        var unit = unitMapper[option.unit];
        unitname = option.unit;
        num = (number / unit.number).toFixed(option.decimal);
    }
    return { num: num, unitname: unitname };
}
function getUnitByNumber(number) {
    var units = ['k', 'm', 'b', 't'];
    var order = Math.floor(Math.log(number) / Math.log(1000));
    return units[order - 1];
}
function extractNumbers(nodes) {
    var numbers = [];
    util_1.each(nodes, function (node) {
        var n = node;
        var number = parseFloat(n.shape.get('origin').text);
        numbers.push(number);
    });
    return numbers;
}
function getLinearNodesInterval(nodes) {
    if (nodes.length >= 2) {
        var a = parseFloat(nodes[0].shape.get('origin').text);
        var b = parseFloat(nodes[1].shape.get('origin').text);
        return Math.abs(a - b);
    }
    return 0;
}
function getDigitsDecimal(interval, unitNumber) {
    var unitBit = Math.floor(Math.log10(unitNumber));
    if (interval >= unitNumber) {
        var remainder = interval % unitNumber;
        if (remainder > 0) {
            var remainderBit = Math.floor(Math.log10(remainder));
            return Math.abs(remainderBit - unitBit);
        }
    }
    else {
        var intervalBit = Math.floor(Math.log10(interval));
        return Math.abs(intervalBit - unitBit);
    }
    return 0;
}
//# sourceMappingURL=digits-abbreviate.js.map