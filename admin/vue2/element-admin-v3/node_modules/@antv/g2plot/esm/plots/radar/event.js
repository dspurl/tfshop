/**
 * Create By Bruce Too
 * On 2020-02-14
 */
import { assign } from '@antv/util';
import { getEventMap, EVENT_MAP, onEvent } from '../../util/event';
var componentMap = {
    area: 'area',
    line: 'line',
    point: 'point',
};
var SHAPE_EVENT_MAP = getEventMap(componentMap);
assign(EVENT_MAP, SHAPE_EVENT_MAP);
export { EVENT_MAP, onEvent };
//# sourceMappingURL=event.js.map