"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/** 简化折线点 */
var dependents_1 = require("../../dependents");
var util_1 = require("@antv/util");
var math_1 = require("../../util/math");
var path_1 = require("../../util/path");
var main_1 = tslib_1.__importDefault(require("./main"));
var theme_1 = require("../../theme");
dependents_1.registerShape('line', 'miniLine', {
    draw: function (cfg, container) {
        var points = math_1.lineSimplification(cfg.points);
        var path = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var flag = i === 0 ? 'M' : 'L';
            path.push([flag, p.x, p.y]);
        }
        var style = util_1.deepMix({}, {
            lineJoin: 'round',
            lineCap: 'round',
        }, cfg.style);
        var shape = container.addShape('path', {
            attrs: util_1.mix({
                path: path,
                stroke: cfg.color || theme_1.getGlobalTheme().defaultColor,
                lineWidth: cfg.size || 2,
            }, style),
        });
        return shape;
    },
});
dependents_1.registerShape('line', 'miniLineSmooth', {
    draw: function (cfg, container) {
        var points = math_1.lineSimplification(cfg.points);
        var constraint = [
            [0, 0],
            [1, 1],
        ];
        var path = path_1.getSplinePath(points, false, constraint);
        var shape = container.addShape('path', {
            attrs: util_1.mix({
                path: path,
                stroke: cfg.color || theme_1.getGlobalTheme().defaultColor,
                lineWidth: cfg.size || 2,
            }, cfg.style),
        });
        return shape;
    },
});
var MiniLineParser = /** @class */ (function (_super) {
    tslib_1.__extends(MiniLineParser, _super);
    function MiniLineParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MiniLineParser.prototype.init = function () {
        _super.prototype.init.call(this);
        this.parseShape();
    };
    MiniLineParser.prototype.parseShape = function () {
        var props = this.plot.options;
        if (props.smooth) {
            this.config.shape = { values: ['miniLineSmooth'] };
        }
        else {
            this.config.shape = { values: ['miniLine'] };
        }
    };
    return MiniLineParser;
}(main_1.default));
exports.default = MiniLineParser;
//# sourceMappingURL=mini.js.map