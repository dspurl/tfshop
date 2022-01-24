import ViewLayer, { ViewConfig } from '../../base/view-layer';
import { LayerConfig } from '../../base/layer';
import { TextStyle, LineStyle } from '../../interface/config';
import './theme';
export declare const STACK_FIELD = "$$stackField$$";
export declare const X_FIELD = "$$xField$$";
export declare const Y_FIELD = "$$yField$$";
interface BulletAxisTickLine extends LineStyle {
    visible?: boolean;
}
export interface BulletAxis {
    visible: boolean;
    position?: 'before' | 'after';
    style?: TextStyle;
    tickCount?: number;
    tickLine?: BulletAxisTickLine;
    formatter?: (text: string, idx: number) => string;
}
export interface BulletViewConfig extends ViewConfig {
    data: {
        /** 子弹图标题 */
        title?: string;
        /** 进度值，array类型。支持阶段性的进度值（即堆叠） */
        measures: number[];
        /** 进度条的色条范围区间，相对数值：[0, 1] */
        ranges?: number[];
        /** 目标值，array类型。支持多目标设置 */
        targets: number[];
    }[];
    /** 进度条的色条范围区间的最大值 */
    rangeMax: number;
    /** 实际进度条大小设置 */
    measureSize?: number;
    measureColors?: string[];
    /** 区间背景条大小设置。ratio number, relative to measureSize */
    rangeSize?: number;
    /** 进度条背景颜色 */
    rangeColors?: string[];
    /** 目标值 marker 大小设置。ratio number, relative to measureSize */
    markerSize?: number;
    /** marker 的填充色 */
    markerColors?: string[];
    markerStyle?: {
        /** marker 的宽度，default: 1 */
        width?: number;
        /** marker 的填充色, 若存在 markerColors, 优先取 markerColors */
        fill?: string;
        [k: string]: any;
    };
    /** 进度条刻度轴设置 */
    axis?: BulletAxis;
    stackField?: string;
}
export interface BulletLayerConfig extends BulletViewConfig, LayerConfig {
}
export default abstract class BulletLayer extends ViewLayer<BulletViewConfig> {
    bullet: any;
    protected bulletRect: any;
    protected bulletTarget: any;
    type: string;
    static getDefaultOptions(): Partial<BulletViewConfig>;
    afterRender(): void;
    protected scale(): void;
    getOptions(props: BulletViewConfig): BulletViewConfig;
    afterInit(): void;
    protected geometryParser(dim: any, type: any): any;
    protected coord(): void;
    /** 自定义子弹图图例 */
    protected legend(): void;
    protected addGeometry(): void;
    protected parseEvents(): void;
    protected extractLabel(): any;
    protected adjustOptions(options: any): void;
    protected adjustYAxisOptions(options: any): void;
    protected processData(dataOptions: BulletViewConfig['data']): any[];
}
export {};
