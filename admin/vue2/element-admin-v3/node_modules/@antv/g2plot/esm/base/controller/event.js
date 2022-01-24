import { wrapBehavior, each, contains } from '@antv/util';
function isSameShape(shape1, shape2) {
    if (shape1 && shape2 && shape1 === shape2) {
        return true;
    }
    return false;
}
function isPointInBBox(point, bbox) {
    if (point.x >= bbox.minX && point.x <= bbox.maxX && point.y >= bbox.minY && point.y <= bbox.maxY) {
        return true;
    }
    return false;
}
var EventController = /** @class */ (function () {
    function EventController(cfg) {
        this.plot = cfg.plot;
        this.canvas = cfg.canvas;
        this.eventHandlers = [];
    }
    EventController.prototype.bindEvents = function () {
        this.addEvent(this.canvas, 'mousedown', wrapBehavior(this, 'onEvents'));
        this.addEvent(this.canvas, 'mousemove', wrapBehavior(this, 'onMove'));
        this.addEvent(this.canvas, 'mouseup', wrapBehavior(this, 'onEvents'));
        this.addEvent(this.canvas, 'click', wrapBehavior(this, 'onEvents'));
        this.addEvent(this.canvas, 'dblclick', wrapBehavior(this, 'onEvents'));
        this.addEvent(this.canvas, 'contextmenu', wrapBehavior(this, 'onEvents'));
        this.addEvent(this.canvas, 'wheel', wrapBehavior(this, 'onEvents'));
    };
    EventController.prototype.clearEvents = function () {
        var eventHandlers = this.eventHandlers;
        each(eventHandlers, function (eh) {
            eh.target.off(eh.type, eh.handler);
        });
    };
    EventController.prototype.addEvent = function (target, eventType, handler) {
        target.on(eventType, handler);
        this.eventHandlers.push({ target: target, type: eventType, handler: handler });
    };
    EventController.prototype.onEvents = function (ev) {
        var eventObj = this.getEventObj(ev);
        var target = ev.target;
        // 判断是否拾取到view以外的shape
        if (!this.isShapeInView(target) && target.name) {
            this.plot.emit(target.name + ":" + ev.type, ev);
        }
        this.plot.emit("" + ev.type, eventObj);
        // layer事件
        var layers = this.plot.getLayers();
        if (layers.length > 0) {
            this.onLayerEvent(layers, eventObj, ev.type);
        }
    };
    EventController.prototype.onMove = function (ev) {
        var target = ev.target;
        var eventObj = this.getEventObj(ev);
        // shape的mouseenter, mouseleave和mousemove事件
        if (!this.isShapeInView(target) && target.name) {
            this.plot.emit(target.name + ":" + ev.type, eventObj);
            // mouseleave & mouseenter
            if (this.lastShape && !isSameShape(target, this.lastShape)) {
                if (this.lastShape) {
                    this.plot.emit(this.lastShape.name + ":mouseleave", eventObj);
                }
                this.plot.emit(target.name + ":mouseenter", eventObj);
            }
            this.lastShape = target;
        }
        this.plot.emit('mousemove', eventObj);
        // layer事件
        var layers = this.plot.getLayers();
        if (layers.length > 0) {
            this.onLayerEvent(layers, eventObj, 'mousemove');
        }
    };
    EventController.prototype.isShapeInView = function (shape) {
        var groupName = ['frontgroundGroup', 'backgroundGroup', 'panelGroup'];
        var parent = shape.get('parent');
        while (parent) {
            var parentName = parent.get('name');
            if (parentName && contains(groupName, parentName)) {
                return true;
            }
            parent = parent.get('parent');
        }
        return false;
    };
    EventController.prototype.getEventObj = function (ev) {
        var obj = {
            clientX: ev.clientX,
            clientY: ev.clientY,
            x: ev.x,
            y: ev.y,
            plot: this.plot,
            data: ev.data ? ev.data.data : null,
            canvas: this.canvas,
            target: ev.target,
            gEvent: ev,
        };
        return obj;
    };
    EventController.prototype.onLayerEvent = function (layers, eventObj, eventName) {
        var _this = this;
        each(layers, function (layer) {
            var bbox = layer.getGlobalBBox();
            if (isPointInBBox({ x: eventObj.x, y: eventObj.y }, bbox)) {
                layer.emit("" + eventName, eventObj);
                var subLayers = layer.layers;
                if (subLayers.length > 0) {
                    _this.onLayerEvent(subLayers, eventObj, eventName);
                }
            }
        });
    };
    return EventController;
}());
export default EventController;
//# sourceMappingURL=event.js.map