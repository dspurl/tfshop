import { __assign, __extends } from "tslib";
import { get, each, filter } from '@antv/util';
import Interaction from '../../../interaction/core';
var LineSelect = /** @class */ (function (_super) {
    __extends(LineSelect, _super);
    function LineSelect(cfg) {
        return _super.call(this, __assign({ endEvent: 'click' }, cfg)) || this;
    }
    LineSelect.prototype.start = function () {
        return;
    };
    LineSelect.prototype.end = function (ev) {
        var target = ev.target;
        var lines = filter(this.view.geometries, function (geom) { return geom.type == 'line'; });
        if (target.get('name') === 'line') {
            var data_1 = get(ev, 'data.data');
            each(lines, function (line) {
                each(line.elements, function (element) {
                    element.setState('inactive', element.data !== data_1);
                });
            });
            // TODO： 设置z-index
        }
        else {
            each(lines, function (line) {
                each(line.elements, function (element) {
                    element.setState('inactive', false);
                });
            });
            // TODO: 重置z-index
        }
    };
    return LineSelect;
}(Interaction));
export default LineSelect;
//# sourceMappingURL=line-select.js.map