import { __assign, __extends } from "tslib";
import { deepMix, each } from '@antv/util';
import { registerPlotType } from '../../base/global';
import BaseColumnLayer from '../column/layer';
import RangeColumnLabel from './component/label';
import { setShapeCache } from './animation';
var RangeColumnLayer = /** @class */ (function (_super) {
    __extends(RangeColumnLayer, _super);
    function RangeColumnLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'rangeColumn';
        return _this;
    }
    RangeColumnLayer.getDefaultOptions = function () {
        return deepMix(_super.getDefaultOptions.call(this), {
            label: {
                visible: true,
                position: 'outer',
            },
        }, {});
    };
    RangeColumnLayer.prototype.afterRender = function () {
        this.renderLabel();
        // 为更新动画缓存shape
        var shapeCaches = [];
        var geoms = this.view.geometries;
        each(geoms, function (geom) {
            var elements = geom.elements;
            each(elements, function (ele) {
                shapeCaches.push(ele.shape);
            });
        });
        setShapeCache(shapeCaches);
        _super.prototype.afterRender.call(this);
    };
    RangeColumnLayer.prototype.animation = function () {
        _super.prototype.animation.call(this);
        this.column.animate = {
            appear: {
                animation: 'clipInFromCenterVertical',
                duration: 600,
            },
            update: {
                animation: 'updateFromCenterVertical',
                duration: 600,
            },
        };
    };
    RangeColumnLayer.prototype.renderLabel = function () {
        if (this.options.label && this.options.label.visible) {
            var label = new RangeColumnLabel(__assign({ view: this.view, plot: this }, this.options.label));
            label.render();
        }
    };
    return RangeColumnLayer;
}(BaseColumnLayer));
export default RangeColumnLayer;
registerPlotType('rangeColumn', RangeColumnLayer);
//# sourceMappingURL=layer.js.map