export interface Point {
    x: number;
    y: number;
}
export declare function getEndPoint(center: any, angle: any, r: any): Point;
export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** 获取矩形中点 */
export declare function getCenter(box: Box): Point;
export declare function getOverlapArea(a: Box, b: Box, margin?: number): number;
/**
 * 计算两个矩形之间的堆叠情况
 * @return xOverlap x方向重叠大小
 * @return yOverlap y方向重叠大小
 */
export declare function getOverlapInfo(a: Box, b: Box, margin?: number): {
    xOverlap: number;
    yOverlap: number;
};
/**
 * 粗略地判断是否在panel内部
 * @param panel
 * @param shape
 */
export declare function inPanel(panel: Box, shape: Box): boolean;
/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export declare const near: (x: number, y: number, e?: number) => boolean;
/**
 * 获取点到圆心的连线与水平方向的夹角
 */
export declare function getAngleByPoint(coordinate: any, point: any): number;
/**
 * 获取 label 的旋转角度
 * @param angle
 */
export declare function getLabelRotate(angle: number): number;
