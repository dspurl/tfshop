"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var MathUtil = tslib_1.__importStar(require("../../math"));
var ShapeNodes = /** @class */ (function () {
    function ShapeNodes(cfg) {
        this.type = 'shape';
        this.shapes = cfg.shapes;
        this.nodes = [];
        this._parserNodes();
        this.origion_nodes = util_1.deepMix([], this.nodes);
    }
    ShapeNodes.prototype.measure = function (shape) {
        var node = util_1.deepMix({}, MathUtil.bboxOnRotate(shape), { shape: shape });
        return node;
    };
    ShapeNodes.prototype.measureNodes = function () {
        var _this = this;
        var nodes = [];
        var shapes = [];
        util_1.each(this.shapes, function (shape, index) {
            var node = util_1.deepMix({}, _this.nodes[index], _this.measure(shape));
            if (node.width !== 0 && node.height !== 0) {
                nodes.push(node);
                shapes.push(shape);
            }
            // this.nodes[index] = node;
        });
        this.nodes = nodes;
        this.shapes = shapes;
    };
    ShapeNodes.prototype._parserNodes = function () {
        var _this = this;
        util_1.each(this.shapes, function (shape) {
            var node = _this.measure(shape);
            _this.nodes.push(node);
        });
    };
    return ShapeNodes;
}());
exports.default = ShapeNodes;
//# sourceMappingURL=shape-nodes.js.map