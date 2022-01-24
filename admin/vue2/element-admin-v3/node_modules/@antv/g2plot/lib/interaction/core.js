"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var EVENT_TYPES = ['start', 'process', 'end', 'reset'];
var Interaction = /** @class */ (function () {
    function Interaction(cfg) {
        var defaultCfg = this.getDefaultCfg();
        util_1.assign(this, defaultCfg, cfg);
        this.canvas = this.view.canvas;
        this._eventHandlers = [];
        this._bindEvents();
    }
    Interaction.prototype.getDefaultCfg = function () {
        return {
            startEvent: 'mousedown',
            processEvent: 'mousemove',
            endEvent: 'mouseup',
            resetEvent: 'dblclick',
        };
    };
    Interaction.prototype._start = function (ev) {
        this.preStart(ev);
        this.start(ev);
        this.afterStart(ev);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.preStart = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.afterStart = function (ev) {
        return;
    };
    Interaction.prototype._process = function (ev) {
        this.preProcess(ev);
        this.process(ev);
        this.afterProcess(ev);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.preProcess = function (ev) {
        return;
    };
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.process = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.afterProcess = function (ev) {
        return;
    };
    Interaction.prototype._end = function (ev) {
        this.preEnd(ev);
        this.end(ev);
        this.afterEnd(ev);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.preEnd = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.end = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.afterEnd = function (ev) {
        return;
    };
    Interaction.prototype._reset = function (ev) {
        this.preReset(ev);
        this.reset(ev);
        this.afterReset(ev);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.preReset = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.reset = function (ev) {
        return;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Interaction.prototype.afterReset = function (ev) {
        return;
    };
    Interaction.prototype._bindEvents = function () {
        var _this = this;
        util_1.each(EVENT_TYPES, function (type) {
            var eventName = _this[type + "Event"];
            var handler = util_1.wrapBehavior(_this, "_" + type);
            _this.view.on(eventName, handler);
            _this._eventHandlers.push({ type: eventName, handler: handler });
        });
    };
    Interaction.prototype._unbindEvents = function () {
        var _this = this;
        var eventHandlers = this._eventHandlers;
        util_1.each(eventHandlers, function (eh) {
            _this.view.off(eh.type, eh.handler);
        });
    };
    Interaction.prototype.destroy = function () {
        this._unbindEvents();
        this._reset();
    };
    return Interaction;
}());
exports.default = Interaction;
//# sourceMappingURL=core.js.map