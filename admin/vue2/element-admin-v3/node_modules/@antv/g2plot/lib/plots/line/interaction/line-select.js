"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var core_1 = tslib_1.__importDefault(require("../../../interaction/core"));
var LineSelect = /** @class */ (function (_super) {
    tslib_1.__extends(LineSelect, _super);
    function LineSelect(cfg) {
        return _super.call(this, tslib_1.__assign({ endEvent: 'click' }, cfg)) || this;
    }
    LineSelect.prototype.start = function () {
        return;
    };
    LineSelect.prototype.end = function (ev) {
        var target = ev.target;
        var lines = util_1.filter(this.view.geometries, function (geom) { return geom.type == 'line'; });
        if (target.get('name') === 'line') {
            var data_1 = util_1.get(ev, 'data.data');
            util_1.each(lines, function (line) {
                util_1.each(line.elements, function (element) {
                    element.setState('inactive', element.data !== data_1);
                });
            });
            // TODO： 设置z-index
        }
        else {
            util_1.each(lines, function (line) {
                util_1.each(line.elements, function (element) {
                    element.setState('inactive', false);
                });
            });
            // TODO: 重置z-index
        }
    };
    return LineSelect;
}(core_1.default));
exports.default = LineSelect;
//# sourceMappingURL=line-select.js.map