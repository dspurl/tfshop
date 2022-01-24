import { __assign, __extends } from "tslib";
import { each, filter, get } from '@antv/util';
import Interaction from '../../../interaction/core';
var LineActive = /** @class */ (function (_super) {
    __extends(LineActive, _super);
    function LineActive(cfg) {
        return _super.call(this, __assign({ 
            /** 没有用 line:mouseenter 和 line:mouseleave 事件，是因为可能在多条折线的情况下，从一条线滑动到另一条会同时触发process和reset，使画面出现闪动 */
            processEvent: 'mousemove' }, cfg)) || this;
    }
    LineActive.prototype.start = function () {
        return;
    };
    LineActive.prototype.process = function (ev) {
        var lines = filter(this.view.geometries, function (geom) { return geom.type == 'line'; });
        var target = ev.target;
        if (target.get('name') === 'line') {
            var data_1 = get(ev, 'data.data');
            each(lines, function (line) {
                each(line.elements, function (element) {
                    element.setState('active', element.data === data_1);
                });
            });
        }
        else {
            each(lines, function (line) {
                each(line.elements, function (element) {
                    element.setState('active', false);
                });
            });
        }
    };
    return LineActive;
}(Interaction));
export default LineActive;
//# sourceMappingURL=line-active.js.map