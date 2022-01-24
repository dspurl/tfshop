import { flatten, groupBy, map } from '@antv/util';
/**
 * 按照scale字段values中的start和end信息从全部数据中取出对应的部分
 *
 * @param field scale field
 * @param values scale values
 * @param data original data
 * @param range range start & end
 */
export var getDataByScaleRange = function (field, values, data, _a, vertical) {
    var start = _a[0], end = _a[1];
    if (vertical === void 0) { vertical = false; }
    var groupedData = groupBy(data, field);
    var newValues = vertical ? values.slice(values.length - end, values.length - start) : values.slice(start, end);
    return flatten(map(newValues, function (value) { return groupedData[value] || []; }));
};
//# sourceMappingURL=data-range.js.map