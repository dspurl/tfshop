import { __extends } from "tslib";
import { deepMix } from '@antv/util';
import BasePlot from '../../base/plot';
import BulletLayer from './layer';
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bullet.prototype.createLayers = function (props) {
        var layerProps = deepMix({}, props);
        layerProps.type = 'bullet';
        _super.prototype.createLayers.call(this, layerProps);
    };
    Bullet.getDefaultOptions = BulletLayer.getDefaultOptions;
    return Bullet;
}(BasePlot));
export default Bullet;
//# sourceMappingURL=index.js.map