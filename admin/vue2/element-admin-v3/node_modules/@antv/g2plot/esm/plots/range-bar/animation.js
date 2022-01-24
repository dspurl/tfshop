import { registerAnimation } from '../../dependents';
import { clone, each } from '@antv/util';
// 记录之前的状态
var shapeCache;
function clipInFromCenter(shape, animateCfg) {
    var bbox = shape.getBBox();
    var centerX = bbox.minX + bbox.width / 2;
    shape.setClip({
        type: 'rect',
        attrs: {
            x: centerX,
            y: bbox.minY,
            width: 0,
            height: bbox.height,
        },
    });
    var cliper = shape.get('clipShape');
    cliper.animate({
        width: bbox.width,
        x: bbox.minX,
    }, animateCfg.duration, animateCfg.easing, function () {
        shape.setClip(null);
    }, animateCfg.delay);
}
clipInFromCenter.animationName = 'clipInFromCenter';
export function setShapeCache(shapes) {
    shapeCache = shapes;
}
function updateFromCenter(shape, animateCfg) {
    var fromPath = getShapeFromCache(shape).attr('path');
    var toPath = clone(shape.attr('path'));
    shape.attr('path', fromPath);
    shape.animate({
        path: toPath,
    }, animateCfg.duration, animateCfg.easing, animateCfg.callback, 100);
}
function getShapeFromCache(shape) {
    var id = shape.id;
    var target;
    each(shapeCache, function (s) {
        if (s.id === id) {
            target = s;
        }
    });
    return target;
}
updateFromCenter.animationName = 'updateFromCenter';
registerAnimation('clipInFromCenter', clipInFromCenter);
registerAnimation('updateFromCenter', updateFromCenter);
//# sourceMappingURL=animation.js.map