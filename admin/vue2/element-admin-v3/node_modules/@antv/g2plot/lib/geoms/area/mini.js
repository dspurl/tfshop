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
dependents_1.registerShape('area', 'miniArea', {
    draw: function (cfg, container) {
        var opacity = cfg.style ? cfg.style.opacity : null;
        var path = getPath(cfg, this, false);
        var style = util_1.deepMix({}, {
            lineJoin: 'round',
            lineCap: 'round',
        }, cfg.style);
        var shape = container.addShape('path', {
            attrs: {
                path: path,
                fill: parseGradient(cfg.color || theme_1.getGlobalTheme().defaultColor),
                opacity: opacity || 0.4,
            },
            style: style,
        });
        return shape;
    },
});
dependents_1.registerShape('area', 'miniAreaSmooth', {
    draw: function (cfg, container) {
        var opacity = cfg.style ? cfg.style.opacity : null;
        var path = getPath(cfg, this, true);
        var shape = container.addShape('path', {
            attrs: {
                path: path,
                fill: parseGradient(cfg.color || theme_1.getGlobalTheme().defaultColor),
                opacity: opacity || 0.5,
            },
        });
        return shape;
    },
});
function getPath(cfg, shape, isSmooth) {
    var constraint = [
        [0, 0],
        [1, 1],
    ];
    var topLinePoints = [];
    var bottomLinePoints = [];
    util_1.each(cfg.points, function (point) {
        topLinePoints.push(point[1]);
        bottomLinePoints.push(point[0]);
    });
    bottomLinePoints = shape.parsePoints(bottomLinePoints.reverse());
    topLinePoints = math_1.lineSimplification(shape.parsePoints(topLinePoints));
    var topPath = isSmooth ? path_1.getSplinePath(topLinePoints, false, constraint) : getStraightPath(topLinePoints);
    var bottomPath = getStraightPath(bottomLinePoints);
    bottomPath[0][0] = 'L';
    var path = topPath.concat(bottomPath);
    return path;
}
function getStraightPath(points) {
    var path = [];
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var flag = i === 0 ? 'M' : 'L';
        path.push([flag, p.x, p.y]);
    }
    return path;
}
function parseGradient(color) {
    return "l(90) 0:" + color + " 1:#ffffff";
}
var MiniAreaParser = /** @class */ (function (_super) {
    tslib_1.__extends(MiniAreaParser, _super);
    function MiniAreaParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MiniAreaParser.prototype.init = function () {
        _super.prototype.init.call(this);
        this.parseShape();
    };
    MiniAreaParser.prototype.parseShape = function () {
        var props = this.plot.options;
        if (props.smooth) {
            this.config.shape = { values: ['miniAreaSmooth'] };
        }
        else {
            this.config.shape = { values: ['miniArea'] };
        }
    };
    return MiniAreaParser;
}(main_1.default));
exports.default = MiniAreaParser;
//# sourceMappingURL=mini.js.map