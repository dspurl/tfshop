import { each, clone, isFunction, has } from '@antv/util';
import { compare } from '../../base/controller/state';
var POSITION_MAPPER = ['xField', 'yField', 'angleField'];
function onActive(plot, condition) {
    var props = plot.options;
    // 获取state condition对应在画布的位置，只有在state condition对应字段为位置映射字段时，tooltip才会对齐进行响应
    if (shouldActive(props, condition)) {
        var data = props.data;
        each(data, function (d) {
            if (compare(d, condition)) {
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
    var originItems = clone(e.items);
    e.items.splice(0);
    each(originItems, function (item) {
        var origin = item.point._origin;
        if (compare(origin, condition) === expected) {
            e.items.push(item);
        }
    });
}
function shouldActive(props, condition) {
    var fields = getPositionField(props);
    return !isFunction(condition) && fields.indexOf(condition.name);
}
function getPositionField(props) {
    var fields = [];
    each(POSITION_MAPPER, function (v) {
        if (has(props, v)) {
            fields.push(v);
        }
    });
    return fields;
}
export default {
    active: onActive,
    selected: onActive,
    disable: onDisable,
};
//# sourceMappingURL=state.js.map