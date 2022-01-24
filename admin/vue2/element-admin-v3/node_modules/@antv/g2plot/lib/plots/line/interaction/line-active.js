"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var core_1 = tslib_1.__importDefault(require("../../../interaction/core"));
var LineActive = /** @class */ (function (_super) {
    tslib_1.__extends(LineActive, _super);
    function LineActive(cfg) {
        return _super.call(this, tslib_1.__assign({ 
            /** 没有用 line:mouseenter 和 line:mouseleave 事件，是因为可能在多条折线的情况下，从一条线滑动到另一条会同时触发process和reset，使画面出现闪动 */
            processEvent: 'mousemove' }, cfg)) || this;
    }
    LineActive.prototype.start = function () {
        return;
    };
    LineActive.prototype.process = function (ev) {
        var lines = util_1.filter(this.view.geometries, function (geom) { return geom.type == 'line'; });
        var target = ev.target;
        if (target.get('name') === 'line') {
            var data_1 = util_1.get(ev, 'data.data');
            util_1.each(lines, function (line) {
                util_1.each(line.elements, function (element) {
                    element.setState('active', element.data === data_1);
                });
            });
        }
        else {
            util_1.each(lines, function (line) {
                util_1.each(line.elements, function (element) {
                    element.setState('active', false);
                });
            });
        }
    };
    return LineActive;
}(core_1.default));
exports.default = LineActive;
//# sourceMappingURL=line-active.js.map