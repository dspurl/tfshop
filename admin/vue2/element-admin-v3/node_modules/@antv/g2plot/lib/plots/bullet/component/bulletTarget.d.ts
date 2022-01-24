import BBox from '../../../util/bbox';
import { View } from '../../../dependents';
export interface BulletTargetCfg {
    targets: number[][];
    markerSize: number;
    yField: string;
    markerColors: string[];
    markerStyle?: {
        fill?: string;
        stroke?: string;
        strokeOpacity?: number;
        [k: string]: any;
    };
}
export default class BulletTarget {
    private view;
    private container;
    private cfg;
    constructor(view: View, cfg: BulletTargetCfg);
    /** 绘制辅助labels */
    draw(): void;
    protected drawTarget(box: BBox, targets: number[], widthRatio: number): void;
    clear(): void;
    destroy(): void;
    private _init;
    private getGeometry;
}
