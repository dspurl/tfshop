export function getEndPoint(center, angle, r) {
    return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle),
    };
}
/** 获取矩形中点 */
export function getCenter(box) {
    return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
    };
}
export function getOverlapArea(a, b, margin) {
    if (margin === void 0) { margin = 0; }
    var xOverlap = Math.max(0, Math.min(a.x + a.width + margin, b.x + b.width + margin) - Math.max(a.x - margin, b.x - margin));
    var yOverlap = Math.max(0, Math.min(a.y + a.height + margin, b.y + b.height + margin) - Math.max(a.y - margin, b.y - margin));
    return xOverlap * yOverlap;
}
/**
 * 计算两个矩形之间的堆叠情况
 * @return xOverlap x方向重叠大小
 * @return yOverlap y方向重叠大小
 */
export function getOverlapInfo(a, b, margin) {
    if (margin === void 0) { margin = 0; }
    var xOverlap = Math.max(0, Math.min(a.x + a.width + margin, b.x + b.width + margin) - Math.max(a.x - margin, b.x - margin));
    var yOverlap = Math.max(0, Math.min(a.y + a.height + margin, b.y + b.height + margin) - Math.max(a.y - margin, b.y - margin));
    // 添加 sign
    if (xOverlap && a.x < b.x) {
        xOverlap = -xOverlap;
    }
    if (yOverlap && a.y < b.y) {
        yOverlap = -yOverlap;
    }
    // 重叠
    if (a.x === b.x && a.width === b.width) {
        xOverlap = b.width;
    }
    if (a.y === b.y && a.height === b.height) {
        yOverlap = b.height;
    }
    return { xOverlap: xOverlap, yOverlap: yOverlap };
}
/**
 * 粗略地判断是否在panel内部
 * @param panel
 * @param shape
 */
export function inPanel(panel, shape) {
    return (panel.x < shape.x &&
        panel.x + panel.width > shape.x + shape.width &&
        panel.y < shape.y &&
        panel.y + panel.height > shape.y + shape.height);
}
/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export var near = function (x, y, e) {
    if (e === void 0) { e = Math.pow(Number.EPSILON, 0.5); }
    return [x, y].includes(Infinity) ? Math.abs(x) === Math.abs(y) : Math.abs(x - y) < e;
};
/**
 * 获取点到圆心的连线与水平方向的夹角
 */
export function getAngleByPoint(coordinate, point) {
    var center = coordinate.getCenter();
    return Math.atan2(point.y - center.y, point.x - center.x);
}
/**
 * 获取 label 的旋转角度
 * @param angle
 */
export function getLabelRotate(angle) {
    var HALF_PI = Math.PI / 2;
    var rotate = angle;
    if (rotate > HALF_PI || rotate < -HALF_PI) {
        rotate = rotate + Math.PI;
    }
    return rotate;
}
//# sourceMappingURL=index.js.map