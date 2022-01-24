import { __extends } from "tslib";
/** 简化折线点 */
import { registerShape } from '../../dependents';
import { deepMix, mix } from '@antv/util';
import { lineSimplification } from '../../util/math';
import { getSplinePath } from '../../util/path';
import LineParser from './main';
import { getGlobalTheme } from '../../theme';
registerShape('line', 'miniLine', {
    draw: function (cfg, container) {
        var points = lineSimplification(cfg.points);
        var path = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var flag = i === 0 ? 'M' : 'L';
            path.push([flag, p.x, p.y]);
        }
        var style = deepMix({}, {
            lineJoin: 'round',
            lineCap: 'round',
        }, cfg.style);
        var shape = container.addShape('path', {
            attrs: mix({
                path: path,
                stroke: cfg.color || getGlobalTheme().defaultColor,
                lineWidth: cfg.size || 2,
            }, style),
        });
        return shape;
    },
});
registerShape('line', 'miniLineSmooth', {
    draw: function (cfg, container) {
        var points = lineSimplification(cfg.points);
        var constraint = [
            [0, 0],
            [1, 1],
        ];
        var path = getSplinePath(points, false, constraint);
        var shape = container.addShape('path', {
            attrs: mix({
                path: path,
                stroke: cfg.color || getGlobalTheme().defaultColor,
                lineWidth: cfg.size || 2,
            }, cfg.style),
        });
        return shape;
    },
});
var MiniLineParser = /** @class */ (function (_super) {
    __extends(MiniLineParser, _super);
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
}(LineParser));
export default MiniLineParser;
//# sourceMappingURL=mini.js.map