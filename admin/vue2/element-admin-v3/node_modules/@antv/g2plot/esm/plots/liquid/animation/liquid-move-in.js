import { registerAnimation } from '../../../dependents';
import { get, clone } from '@antv/util';
import { transform } from '../../../util/g-util';
function liquidMoveIn(shape, animateCfg) {
    var container = shape.get('parent');
    var box = container.getBBox();
    var factor = Math.min(Math.max(0, get(animateCfg, 'factor', 0.5)), 1);
    var delay = get(animateCfg, 'delay', 0);
    var duration = get(animateCfg, 'duration', 800);
    var callback = animateCfg.callback;
    var originX = (box.minX + box.maxX) / 2;
    var originY = box.maxY;
    var wrap = container.find(function (shape) { return shape.get('name') == 'wrap'; });
    var wrapTargetOpacity = wrap.attr('opacity');
    wrap.attr('opacity', 0);
    wrap.animate({ opacity: wrapTargetOpacity }, duration * factor, 'easeLinear', null, delay);
    var waves = container.find(function (shape) { return shape.get('name') == 'waves'; });
    var wavesTargetMatrix = clone(waves.attr('matrix')) || [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var transformMatrix = transform(wavesTargetMatrix, [
        ['t', -originX, -originY],
        ['s', 1, 0],
        ['t', originX, originY],
    ]);
    waves.setMatrix(transformMatrix);
    waves.animate({ matrix: wavesTargetMatrix }, duration, animateCfg.easing, function () { return callback && callback(container, wrap, waves); }, delay);
}
liquidMoveIn.animationName = 'liquidMoveIn';
registerAnimation('liquidMoveIn', liquidMoveIn);
//# sourceMappingURL=liquid-move-in.js.map