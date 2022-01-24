"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var state_1 = require("../../base/controller/state");
// 对label和label样式进行缓存
var labels;
var originAttrs;
function onActive(plot, condition) {
    if (!labels) {
        getAllLabels(plot);
    }
    util_1.each(labels, function (label, index) {
        var origin = label.get('origin');
        if (state_1.compare(origin, condition)) {
            var originAttr = originAttrs[index];
            var style = util_1.mix({}, originAttr, { opacity: 1 });
            label.attr(style);
        }
    });
}
function onDisable(plot, condition) {
    if (!labels) {
        getAllLabels(plot);
    }
    util_1.each(labels, function (label, index) {
        var origin = label.get('origin');
        if (state_1.compare(origin, condition)) {
            var originAttr = originAttrs[index];
            var disableStyle = labelDisableStyle(originAttr);
            label.attr(disableStyle);
        }
    });
}
function getAllLabels(plot) {
    labels = [];
    originAttrs = [];
    var geoms = plot.view.get('elements');
    util_1.each(geoms, function (geom) {
        var geomLabels = geom.get('labels');
        if (geomLabels) {
            util_1.each(geomLabels, function (label) {
                labels.push(label);
                originAttrs.push(label.attr());
            });
        }
    });
}
function labelDisableStyle(style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.2 };
}
exports.default = {
    active: onActive,
    selected: onActive,
    disable: onDisable,
};
//# sourceMappingURL=state.js.map