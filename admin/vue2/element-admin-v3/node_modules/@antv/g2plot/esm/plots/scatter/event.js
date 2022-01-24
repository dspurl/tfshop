import { assign } from '@antv/util';
import { getEventMap, EVENT_MAP, onEvent } from '../../util/event';
var componentMap = {
    point: 'point',
    trendline: 'trendline',
    confidence: 'confidence',
    quadrant: 'quadrant',
    quadrantLabel: 'quadrant-label',
    quadrantLine: 'quadrant-line',
};
var SHAPE_EVENT_MAP = getEventMap(componentMap);
assign(EVENT_MAP, SHAPE_EVENT_MAP);
export { EVENT_MAP, onEvent };
//# sourceMappingURL=event.js.map