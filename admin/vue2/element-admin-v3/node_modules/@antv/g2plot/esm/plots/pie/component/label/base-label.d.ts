import { IGroup, IShape, BBox } from '../../../../dependents';
import { Label, TextStyle } from '../../../../interface/config';
import PieLayer from '../../layer';
/** label text和line距离 4px */
export declare const CROOK_DISTANCE = 4;
export declare function percent2Number(value: string): number;
export interface LabelItem {
    x: number;
    y: number;
    color: string;
    origin: object;
    name: string;
    angle: number;
    textAlign: string;
    textBaseline?: string;
}
export interface PieLabelConfig extends Label {
    visible: boolean;
    formatter?: (text: string | number | undefined | null, item: any, idx: number, ...extras: any[]) => string;
    /** whether */
    adjustPosition?: boolean;
    /** allow label overlap */
    allowOverlap?: boolean;
    autoRotate?: boolean;
    labelHeight?: number;
    offset?: number | string;
    offsetX?: number;
    offsetY?: number;
    /** label leader-line */
    line?: {
        visible?: boolean;
        smooth?: boolean;
        stroke?: string;
        lineWidth?: number;
    };
    style?: TextStyle;
}
export default abstract class PieBaseLabel {
    options: PieLabelConfig & {
        offset: number;
    };
    destroyed: boolean;
    protected plot: PieLayer;
    protected coordinateBBox: BBox;
    protected container: IGroup;
    /** 圆弧上的锚点 */
    protected arcPoints: LabelItem[];
    constructor(plot: PieLayer, cfg: PieLabelConfig);
    protected abstract getDefaultOptions(): any;
    protected abstract layout(labels: IShape[], shapeInfos: LabelItem[], panelBox: BBox): any;
    /** 处理标签遮挡问题 */
    protected adjustOverlap(labels: IShape[], panel: BBox): void;
    protected adjustItem(item: LabelItem): void;
    protected init(): void;
    render(): void;
    clear(): void;
    hide(): void;
    show(): void;
    destroy(): void;
    private getFilteredSum;
    /** 绘制文本 */
    protected drawTexts(): void;
    private adjustText;
    /** 绘制拉线 */
    protected drawLines(): void;
    /** 获取label leader-line, 默认 not smooth */
    private getLinePath;
    protected getGeometry(): import("@antv/g2/lib/geometry/base").default;
    protected getCoordinate(): {
        center: import("@antv/coord").Point;
        radius: number;
        startAngle: number;
    };
    protected adjustOption(options: PieLabelConfig): void;
    private rotateLabel;
    private getItems;
    private initArcPoints;
}
