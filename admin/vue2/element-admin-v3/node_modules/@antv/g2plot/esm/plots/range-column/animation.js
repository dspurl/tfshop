import { registerAnimation } from '../../dependents';
import { clone, each } from '@antv/util';
// 记录之前的状态
var shapeCache;
function clipInFromCenterVertical(shape, animateCfg) {
    var bbox = shape.getBBox();
    var centerY = bbox.minY + bbox.height / 2;
    shape.setClip({
        type: 'rect',
        attrs: {
            x: bbox.minX,
            y: centerY,
            width: bbox.width,
            height: 0,
        },
    });
    var cliper = shape.get('clipShape');
    cliper.animate({
        height: bbox.height,
        y: bbox.minY,
    }, animateCfg.duration, animateCfg.easing, function () {
        shape.setClip(null);
    }, animateCfg.delay);
}
clipInFromCenterVertical.animationName = 'clipInFromCenterVertical';
export function setShapeCache(shapes) {
    shapeCache = shapes;
}
function updateFromCenterVertical(shape, animateCfg) {
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
updateFromCenterVertical.animationName = 'updateFromCenterVertical';
registerAnimation('clipInFromCenterVertical', clipInFromCenterVertical);
registerAnimation('updateFromCenterVertical', updateFromCenterVertical);
//# sourceMappingURL=animation.js.map