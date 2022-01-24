import { dotProduct2D } from '../../math';
/** 图形在水平或垂直方向抖开 */
export default function nodeJitter(shape, index, cfg) {
    var nodes = cfg.nodes.nodes;
    if (index === nodes.length - 1) {
        return;
    }
    var current = nodes[index];
    var next = nodes[index + 1];
    var dir = alignDirection(current, next).dir;
    var startPoint = shape.get('startPoint');
    if (dir === 'x') {
        shape.attr('y', startPoint.y + 20);
    }
}
function alignDirection(nodeA, nodeB) {
    var dir;
    /** 计算两个node 中心点向量的角度 */
    var vector = { x: nodeB.centerX - nodeA.centerX, y: nodeB.centerY - nodeA.centerY };
    var mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    var vector_horizontal = { x: 10, y: 0 }; // 水平方向向量
    /*tslint:disable*/
    var mag_horizontal = Math.sqrt(vector_horizontal.x * vector_horizontal.x + vector_horizontal.y * vector_horizontal.y);
    var dot = dotProduct2D(vector, vector_horizontal);
    var angle = ((dot / (mag * mag_horizontal)) * 180) / Math.PI;
    if (angle < 0)
        angle = 360 - angle;
    angle = adjustAngle(angle); // 将角度从0-360转换到0-90
    /** 计算两个node在x、y两个方向上的距离 */
    var distX = Math.abs(nodeA.centerX - nodeB.centerX);
    var distY = Math.abs(nodeA.centerY - nodeB.centerY);
    if (angle > 45) {
        dir = 'x';
    }
    else if (angle < 45) {
        dir = 'y';
    }
    return { dir: dir, distX: distX, distY: distY };
}
function adjustAngle(angle) {
    if (angle > 90 && angle <= 180) {
        return 180 - angle;
    }
    if (angle > 180 && angle < 270) {
        return angle - 180;
    }
    return 360 - angle;
}
//# sourceMappingURL=node-jitter.js.map