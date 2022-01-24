"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dice_1 = require("./dice");
var slice_1 = require("./slice");
//reference: https://github.com/d3/d3-hierarchy/blob/master/src/treemap/squarify.js
// 黄金分割
var ratio = (1 + Math.sqrt(5)) / 2;
function squarify(root, x0, y0, x1, y1) {
    var children = root.children;
    var value = root.value;
    children.sort(function (a, b) {
        return b.value - a.value;
    });
    var rows = [];
    var sumValue, maxValue, minValue;
    var alpha, beta;
    var newRatio, minRatio;
    var nodeValue;
    var i = 0, j = 0;
    // todo: 剔除empty node
    while (i < children.length) {
        var width = x1 - x0;
        var height = y1 - y0;
        sumValue = children[j++].value;
        maxValue = sumValue;
        minValue = sumValue;
        alpha = Math.max(height / width, width / height) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);
        for (; j < children.length; j++) {
            nodeValue = children[j].value;
            sumValue += nodeValue;
            if (nodeValue < minValue)
                minValue = nodeValue;
            if (nodeValue > maxValue)
                maxValue = nodeValue;
            beta = sumValue * sumValue * alpha;
            newRatio = Math.max(maxValue / beta, beta / minValue);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }
            minRatio = newRatio;
        }
        var row = { value: sumValue, dice: width < height, children: children.slice(i, j) };
        rows.push(row);
        if (row.dice) {
            var h = value ? (height * sumValue) / value : height;
            dice_1.dice(row, x0, y0, x1, y0 + h);
            if (value) {
                y0 += h;
            }
        }
        else {
            var w = value ? (width * sumValue) / value : width;
            slice_1.slice(row, x0, y0, x0 + w, y1);
            if (value) {
                x0 += w;
            }
        }
        value -= sumValue;
        i = j;
    }
    return rows;
}
exports.default = squarify;
//# sourceMappingURL=squarify.js.map