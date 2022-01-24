import { __extends } from "tslib";
/**
 * 可插拔的状态量管理机
 */
// todo: 后续还需要加入交互互斥的维护机制
import EventEmitter from '@antv/event-emitter';
import { each } from '@antv/util';
var StateManager = /** @class */ (function (_super) {
    __extends(StateManager, _super);
    function StateManager() {
        var _this = _super.call(this) || this;
        _this._states = {};
        _this._stateStack = {};
        return _this;
    }
    StateManager.prototype.setState = function (name, exp) {
        this._stateStack[name] = exp;
        this._onUpdate();
    };
    StateManager.prototype.getState = function (name) {
        return this._states[name];
    };
    StateManager.prototype.getAllStates = function () {
        return this._states;
    };
    StateManager.prototype.clear = function () {
        this._states = {};
        this._stateStack = {};
        if (this._changeTimer) {
            clearTimeout(this._changeTimer);
            this._changeTimer = null;
        }
    };
    StateManager.prototype._onUpdate = function () {
        var _this = this;
        var stateStack = this._stateStack;
        if (this._changeTimer) {
            clearTimeout(this._changeTimer);
            this._changeTimer = null;
        }
        this._changeTimer = setTimeout(function () {
            // for (const name in stateStack) {
            each(stateStack, function (exp, name) {
                var state = stateStack[name];
                if (!_this._states[name] || _this._states[name] !== exp) {
                    // update states
                    _this._states[name] = exp;
                    // dispatch state event
                    _this._triggerEvent(name, state);
                }
            });
            // }
            // clear stack
            _this._stateStack = {};
        }, 16);
    };
    StateManager.prototype._triggerEvent = function (name, exp) {
        this.emit(name + ":change", {
            name: name,
            exp: exp,
        });
    };
    return StateManager;
}(EventEmitter));
export default StateManager;
//# sourceMappingURL=state-manager.js.map