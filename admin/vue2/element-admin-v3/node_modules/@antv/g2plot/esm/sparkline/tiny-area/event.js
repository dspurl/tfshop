import { assign } from '@antv/util';
import { EVENT_MAP, onEvent } from '../../util/event';
var SHAPE_EVENT_MAP = {
    onAreaClick: 'area:click',
    onAreaDblclick: 'area:dblclick',
    onAreaMousemove: 'area:mousemove',
    onAreaMousedown: 'area:mousedown',
    onAreaMouseup: 'area:mouseup',
    onAreaMouseenter: 'area:mouseenter',
    onAreaMouseleave: 'area:mouseleave',
    onAreaContextmenu: 'area:contextmenu',
    onLineClick: 'line:click',
    onLineDblclick: 'line:dblclick',
    onLineMousemove: 'line:mousemove',
    onLineMousedown: 'line:mousedown',
    onLineMouseup: 'line:mouseup',
    onLineMouseenter: 'line:mouseenter',
    onLineMouseleave: 'line:mouseleave',
    onLineContextmenu: 'line:contextmenu',
};
assign(EVENT_MAP, SHAPE_EVENT_MAP);
export { EVENT_MAP, onEvent };
//# sourceMappingURL=event.js.map