import { View, IGroup } from '../dependents';
import { MappingDatum, GAnimateCfg } from '@antv/g2/lib/interface';
import { Event } from '@antv/g2/lib/dependents';
interface PointStyle {
    size?: number;
    fill?: string;
    stroke?: string;
    lineWidth?: number;
}
interface MarkerItem {
    _origin: object;
}
declare type AnimationOption = {
    endState: PointStyle;
    animateCfg: GAnimateCfg;
};
interface Cfg {
    view: View;
    data: any[];
    symbol?: string | ((x: number, y: number, r: number) => any[][]);
    size?: number;
    /** 标注点 point 坐标的 x 偏移 */
    offsetX?: number;
    offsetY?: number;
    label?: {
        visible: boolean;
        /** marker point 映射的字段 */
        field?: string;
        /** _origin: 原始数据 */
        formatter?: (text: string, item: MarkerItem, index: number) => string;
        position?: 'top' | 'bottom';
        offsetX?: number;
        offsetY?: number;
        style?: object;
    };
    style?: {
        normal?: PointStyle;
        active?: PointStyle;
        selected?: PointStyle;
    };
    events?: {
        mouseenter?: (e: Event) => void;
        mouseleave?: (e: Event) => void;
        click?: (e: Event) => void;
    };
    animation?: boolean | AnimationOption;
}
export { Cfg as MarkerPointCfg };
/**
 * 标注点 绘制在最顶层
 */
export default class MarkerPoint {
    view: View;
    container: IGroup;
    config: Cfg;
    private points;
    private labels;
    private size;
    private name;
    private selectedPoint;
    protected defaultCfg: {
        offsetX: number;
        offsetY: number;
        style: {
            normal: {
                stroke: string;
                fill: string;
                lineWidth: number;
            };
            selected: {
                stroke: string;
                fill: string;
                lineWidth: number;
            };
            active: {
                stroke: string;
                fill: string;
                lineWidth: number;
            };
        };
        label: {
            visible: boolean;
            offsetY: number;
            position: string;
            style: {
                fill: string;
            };
        };
        animation: boolean;
    };
    constructor(cfg: Cfg);
    render(): void;
    clear(): void;
    destroy(): void;
    protected getDataArray(): MappingDatum[][];
    private _init;
    private _renderPoints;
    private _renderLabel;
    private _addInteraction;
    private setState;
    private _onActive;
    private _onInactive;
    private _onSelected;
    /** point animation, not for label */
    private _animatePoint;
}
