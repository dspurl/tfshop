/**
 * @description path 计算、转换的辅助工具
 */
interface PointObject {
    x: number;
    y: number;
}
declare type PointArray = [number, number];
export declare const smoothBezier: (points: PointArray[], smooth: number, isLoop: boolean, constraint: PointArray[]) => PointArray[];
export declare function catmullRom2bezier(crp: number[], z: boolean, constraint: PointArray[]): any[];
export declare function getLinePath(points: PointObject[], isInCircle: boolean): any[];
export declare function getSplinePath(points: PointObject[], isInCircle: boolean, constaint: any): any[];
export declare function getPointRadius(coord: any, point: PointObject): number;
export declare function getPointAngle(coord: any, point: PointObject): number;
export declare function convertNormalPath(coord: any, path: any[]): any[];
export declare function convertPolarPath(coord: any, path: any[]): any[];
export {};
