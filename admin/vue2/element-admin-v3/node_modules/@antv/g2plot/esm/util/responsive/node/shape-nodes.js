import { deepMix, each } from '@antv/util';
import * as MathUtil from '../../math';
var ShapeNodes = /** @class */ (function () {
    function ShapeNodes(cfg) {
        this.type = 'shape';
        this.shapes = cfg.shapes;
        this.nodes = [];
        this._parserNodes();
        this.origion_nodes = deepMix([], this.nodes);
    }
    ShapeNodes.prototype.measure = function (shape) {
        var node = deepMix({}, MathUtil.bboxOnRotate(shape), { shape: shape });
        return node;
    };
    ShapeNodes.prototype.measureNodes = function () {
        var _this = this;
        var nodes = [];
        var shapes = [];
        each(this.shapes, function (shape, index) {
            var node = deepMix({}, _this.nodes[index], _this.measure(shape));
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
        each(this.shapes, function (shape) {
            var node = _this.measure(shape);
            _this.nodes.push(node);
        });
    };
    return ShapeNodes;
}());
export default ShapeNodes;
//# sourceMappingURL=shape-nodes.js.map