"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var state_1 = require("../../base/controller/state");
var POSITION_MAPPER = ['xField', 'yField', 'angleField'];
function onActive(plot, condition) {
    var props = plot.options;
    // 获取state condition对应在画布的位置，只有在state condition对应字段为位置映射字段时，tooltip才会对齐进行响应
    if (shouldActive(props, condition)) {
        var data = props.data;
        util_1.each(data, function (d) {
            if (state_1.compare(d, condition)) {
                var point = plot.view.getXY(d);
                // 调用showTooltip方法
                plot.view.on('tooltip:create', function (e) {
                    processState(condition, e, false);
                });
                plot.view.showTooltip(point);
            }
        });
    }
}
function onDisable(plot, condition) {
    plot.view.on('tooltip:change', function (e) {
        processState(condition, e, true);
    });
}
function processState(condition, e, inverse) {
    var expected = inverse ? false : true;
    var originItems = util_1.clone(e.items);
    e.items.splice(0);
    util_1.each(originItems, function (item) {
        var origin = item.point._origin;
        if (state_1.compare(origin, condition) === expected) {
            e.items.push(item);
        }
    });
}
function shouldActive(props, condition) {
    var fields = getPositionField(props);
    return !util_1.isFunction(condition) && fields.indexOf(condition.name);
}
function getPositionField(props) {
    var fields = [];
    util_1.each(POSITION_MAPPER, function (v) {
        if (util_1.has(props, v)) {
            fields.push(v);
        }
    });
    return fields;
}
exports.default = {
    active: onActive,
    selected: onActive,
    disable: onDisable,
};
//# sourceMappingURL=state.js.map