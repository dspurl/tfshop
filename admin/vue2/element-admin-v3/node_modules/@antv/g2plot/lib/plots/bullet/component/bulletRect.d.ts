import { View } from '../../../dependents';
import { BulletAxis } from '../layer';
import BBox from '../../../util/bbox';
export interface BulletRectCfg {
    /** 背景区间的区间范围 */
    ranges: number[][];
    yField: string;
    rangeColors: string[];
    rangeMax: number;
    rangeSize: number;
    axis?: BulletAxis;
    style?: {
        fill?: string;
        stroke?: string;
        strokeOpacity?: number;
        [k: string]: any;
    };
}
export default class BulletRect {
    private view;
    private container;
    private cfg;
    constructor(view: View, cfg: BulletRectCfg);
    /** 绘制辅助labels */
    draw(): void;
    protected drawRect(box: BBox, ranges: number[], widthRatio: number): void;
    /** 添加 ticks  */
    protected drawBulletTicks(box: BBox, tickInterval: number, widthRatio: number): void;
    clear(): void;
    destroy(): void;
    private _init;
    private getGeometry;
}
