import { isFunction, assign, each, isArray, mix, clone } from '@antv/util';
import { getComponentStateMethod } from '../../components/factory';
import { onEvent } from '../../util/event';
import StateManager from '../../util/state-manager';
export function compare(origin, condition) {
    if (!isFunction(condition)) {
        var name_1 = condition.name, exp = condition.exp;
        if (isFunction(exp)) {
            return exp(origin[name_1]);
        }
        return origin[name_1] === exp;
    }
    return condition(origin);
}
var StateController = /** @class */ (function () {
    function StateController(cfg) {
        this.shapeContainers = [];
        assign(this, cfg);
    }
    StateController.prototype.createStateManager = function () {
        this.stateManager = new StateManager();
    };
    StateController.prototype.bindStateManager = function (manager, cfg) {
        this.stateManager = manager;
        if (cfg.setState) {
            this._updateStateProcess(cfg.setState);
        }
        if (cfg.onStateChange) {
            this._stateChangeProcess(cfg.onStateChange);
        }
    };
    StateController.prototype.defaultStates = function (states) {
        var _this = this;
        each(states, function (state, type) {
            var condition = state.condition, related = state.related;
            _this.setState({ type: type, condition: condition, related: related });
        });
    };
    StateController.prototype.setState = function (cfg) {
        var _this = this;
        var type = cfg.type, condition = cfg.condition, related = cfg.related;
        this.shapes = this._getShapes();
        this.originAttrs = this._getOriginAttrs();
        // this.resetZIndex();
        each(this.shapes, function (shape, index) {
            var shapeOrigin = shape.get('origin').data;
            var origin = isArray(shapeOrigin) ? shapeOrigin[0] : shapeOrigin;
            if (compare(origin, condition)) {
                var stateStyle = cfg.style ? cfg.style : _this._getDefaultStateStyle(type, shape);
                var originAttr = _this.originAttrs[index];
                var attrs = void 0;
                if (isFunction(stateStyle)) {
                    attrs = stateStyle(originAttr);
                }
                else {
                    attrs = mix({}, originAttr, stateStyle);
                }
                shape.attr(attrs);
                _this.setZIndex(type, shape);
                // const canvas = this.plot.canvas;
                // canvas.draw();
            }
        });
        // 组件与图形对状态量的响应不一定同步
        if (related) {
            this._parserRelated(type, related, condition);
        }
        this.plot.canvas.draw();
    };
    StateController.prototype._updateStateProcess = function (setStateCfg) {
        var _this = this;
        each(setStateCfg, function (cfg) {
            var state = cfg.state;
            var handler;
            if (isFunction(state)) {
                handler = function (e) {
                    var s = state(e);
                    _this.stateManager.setState(s.name, s.exp);
                };
            }
            else {
                handler = function () {
                    _this.stateManager.setState(state.name, state.exp);
                };
            }
            if (cfg.event) {
                onEvent(_this.plot, _this._eventParser(cfg.event), handler);
            }
            else {
                handler();
            }
        });
    };
    StateController.prototype._stateChangeProcess = function (onChangeCfg) {
        var _this = this;
        each(onChangeCfg, function (cfg) {
            _this.stateManager.on(cfg.name + ":change", function (props) {
                cfg.callback(props, _this.plot);
            });
        });
    };
    StateController.prototype._getShapes = function () {
        var _this = this;
        var shapes = [];
        var geoms = this.plot.view.geometries;
        each(geoms, function (geom) {
            var shapeContainer = geom.container;
            _this.shapeContainers.push(shapeContainer);
            if (!geom.destroyed) {
                shapes.push.apply(shapes, geom.getShapes());
            }
        });
        return shapes;
    };
    StateController.prototype._getOriginAttrs = function () {
        var attrs = [];
        each(this.shapes, function (shape) {
            attrs.push(clone(shape.attr()));
        });
        return attrs;
    };
    // 将g2 geomtry转为plot层geometry
    StateController.prototype._eventParser = function (event) {
        var eventCfg = event.split(':');
        var eventTarget = this.plot.geometryParser('g2', eventCfg[0]);
        var eventName = eventCfg[1];
        return eventTarget + ":" + eventName;
    };
    StateController.prototype._getDefaultStateStyle = function (type, shape) {
        var theme = this.plot.theme;
        var plotGeomType = this.plot.geometryParser('plot', shape.name);
        var styleField = plotGeomType + "Style";
        if (theme[styleField]) {
            var style = theme[styleField][type];
            if (isFunction(style)) {
                style = style(shape.attr());
            }
            return style;
        }
        return {};
    };
    StateController.prototype._parserRelated = function (type, related, condition) {
        var _this = this;
        each(related, function (r) {
            if (_this.plot[r]) {
                // fixme: 自定义组件
                // this.plot[r].setState(type, condition);
                var method = getComponentStateMethod(r, type);
                method(_this.plot, condition);
            }
        });
    };
    // private set
    StateController.prototype.setZIndex = function (stateType, shape) {
        if (stateType === 'active' || stateType === 'selected') {
            // shape.setZIndex(1);
            var children = shape.get('parent').get('children');
            children[children.length - 1].setZIndex(0);
            shape.setZIndex(1);
        }
    };
    StateController.prototype.resetZIndex = function () {
        each(this.shapeContainers, function (container) {
            var children = container.get('children');
            children.sort(function (obj1, obj2) {
                return obj1._INDEX - obj2._INDEX;
            });
        });
    };
    return StateController;
}());
export default StateController;
//# sourceMappingURL=state.js.map