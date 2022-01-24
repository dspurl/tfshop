import { each, deepMix, upperFirst } from '@antv/util';
var eventNames = [
    'click',
    'dblclick',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'mousedown',
    'mouseup',
    'contextmenu',
];
var mobileEventNames = [
/*'touchstart',
'touchmove',
'touchend',
'pressstart',
'press',
'pressend',
'swipestart',
'swipe',
'swipeend',
'pinchstart',
'pinch',
'pinchend',
'panstart',
'pan',
'panend',*/
];
var viewComponentMap = {
    axis: 'axis-label',
    label: 'label',
    legend: 'legend-item',
};
var canvasComponentMap = {
    title: 'title',
    description: 'description',
    breadcrumb: 'breadcrumb',
};
var CANVAS_EVENT_MAP = deepMix(getEventMap(canvasComponentMap), getRegionEventMap('Plot', eventNames));
var LAYER_EVENT_MAP = getRegionEventMap('Layer', eventNames);
//移动端事件暂时只支持view级
var EVENT_MAP = deepMix({}, getEventMap(viewComponentMap), getRegionEventMap('View', eventNames), getMobileEventMap());
function onEvent(layer, eventName, handler) {
    layer.view.on(eventName, function (ev) {
        var eventData = {
            x: ev === null || ev === void 0 ? void 0 : ev.x,
            y: ev === null || ev === void 0 ? void 0 : ev.y,
            clientX: ev === null || ev === void 0 ? void 0 : ev.clientX,
            clientY: ev === null || ev === void 0 ? void 0 : ev.clientY,
            target: ev === null || ev === void 0 ? void 0 : ev.target,
            data: (ev === null || ev === void 0 ? void 0 : ev.data) ? ev.data.data : null,
            plot: layer,
            canvas: layer.canvas,
            gEvent: ev === null || ev === void 0 ? void 0 : ev.gEvent,
        };
        handler(eventData);
    });
}
export function getEventMap(map) {
    var eventMap = {};
    each(map, function (item, key) {
        var componentName = upperFirst(key);
        var namePrefix = "on" + componentName;
        var eventPrefix = item + ":";
        each(eventNames, function (name) {
            var eventName = upperFirst(name);
            var eventKey = "" + namePrefix + eventName;
            var event = "" + eventPrefix + name;
            eventMap[eventKey] = event;
        });
    });
    return eventMap;
}
export function getRegionEventMap(prefix, eventList) {
    var eventMap = {};
    var namePrefix = "on";
    each(eventList, function (name) {
        var eventName = upperFirst(name);
        var eventKey = "" + namePrefix + prefix + eventName;
        eventMap[eventKey] = name;
    });
    return eventMap;
}
export function getMobileEventMap() {
    var eventMap = {};
    var namePrefix = "on";
    each(mobileEventNames, function (name) {
        var eventName = upperFirst(name);
        var eventKey = "" + namePrefix + eventName;
        eventMap[eventKey] = name;
    });
    return eventMap;
}
export { EVENT_MAP, CANVAS_EVENT_MAP, LAYER_EVENT_MAP, onEvent };
//# sourceMappingURL=event.js.map