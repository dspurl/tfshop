import { registerAnimation } from '../../../dependents';
import { clone, isFunction, isNil, deepMix } from '@antv/util';
var plotInfo;
function clipingWithData(shape, animateCfg) {
    var defaultCfg = {
        easing: 'easeLinear',
        duration: 10000,
    };
    var animationConfig = deepMix({}, animateCfg, defaultCfg);
    var geometry = shape.get('element').geometry;
    geometry.labelsContainer.set('visible', false);
    /** 动画初始状态 */
    var index = shape.get('index');
    var coord = geometry.coordinate;
    var scales = geometry.scales;
    var yScale = scales[plotInfo.options.yField];
    var shapeData = clone(shape.get('origin'));
    setClip(shape, coord);
    var clip = shape.get('clipShape');
    var parent = shape.get('parent');
    var offsetX = 12;
    var title = null;
    var seriesField = plotInfo.options.seriesField;
    if (seriesField) {
        title = parent.addShape('text', {
            attrs: {
                x: coord.start.x + offsetX,
                y: 0,
                text: shapeData.data[0][seriesField],
                fill: shape.attr('stroke'),
                fontSize: 12,
                textAlign: 'start',
                textBaseline: 'middle',
            },
        });
    }
    var offsetY = title ? 16 : 0;
    var marker = parent.addShape('text', {
        attrs: {
            x: coord.start.x + offsetX,
            y: offsetY,
            text: "test" + index,
            fill: shape.attr('stroke'),
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'middle',
        },
    });
    /** 动画执行之后 */
    animationConfig.callback = function () {
        if (shape && !shape.get('destroyed')) {
            shape.setClip(null);
            clip.remove();
            marker.animate({
                opacity: 0,
            }, 300, function () {
                marker.remove();
                if (!isNil(title)) {
                    title.remove();
                }
                var labelsContainer = geometry.labelsContainer;
                if (!labelsContainer.get('visible')) {
                    labelsContainer.set('visible', true);
                }
            });
        }
    };
    /** 执行动画 */
    /** 准备动画参数 */
    var delay = animationConfig.delay;
    if (isFunction(delay)) {
        delay = animationConfig.delay(index);
    }
    var easing = animationConfig.easing;
    if (isFunction(easing)) {
        easing = animationConfig.easing(index);
    }
    /** 动起来 */
    clip.animate({
        width: coord.getWidth(),
    }, animationConfig.duration, easing, animationConfig.callback, delay);
    (animationConfig.onFrame = function (ratio) {
        var position = getPositionByRatio(ratio, shapeData, coord);
        if (!position)
            return;
        marker.attr('x', position[0] + offsetX);
        marker.attr('y', position[1] + offsetY);
        var yText = getDataByPosition(yScale, position[1], coord);
        // use formatter
        if (yScale.formatter) {
            yText = yScale.formatter(yText);
        }
        marker.attr('text', yText);
    }),
        marker.animate(animationConfig.onFrame, {
            duration: animationConfig.duration,
            easing: easing,
            callback: animationConfig.callback,
            delay: delay,
        });
    if (title) {
        title.animate({
            onFrame: function (ratio) {
                var position = getPositionByRatio(ratio, shapeData, coord);
                if (!position)
                    return;
                title.attr('x', position[0] + offsetX);
                title.attr('y', position[1]);
            },
        }, animationConfig.duration, easing, animationConfig.callback, delay);
    }
}
function setClip(shape, coord) {
    var start = coord.start, end = coord.end, height = coord.height;
    shape.setClip({
        type: 'rect',
        attrs: {
            x: start.x,
            y: end.y,
            width: 0,
            height: height,
        },
    });
}
function getPositionByRatio(ratio, dataPoints, coord) {
    var points = dataPoints.points;
    var currentX = coord.start.x + coord.getWidth() * ratio;
    for (var i = 0; i < points.length - 1; i++) {
        var current = points[i];
        var next = points[i + 1];
        if (currentX >= current.x && currentX <= next.x) {
            var m = (next.y - current.y) / (next.x - current.x); // 斜率
            var y = current.y + m * (currentX - current.x);
            return [currentX, y];
        }
    }
}
function getDataByPosition(scale, y, coord) {
    var yRatio = (y - coord.start.y) / (coord.end.y - coord.start.y);
    return scale.invert(yRatio).toFixed(2);
}
export function getPlotOption(option) {
    plotInfo = option;
}
registerAnimation('clipingWithData', clipingWithData);
//# sourceMappingURL=clipIn-with-data.js.map