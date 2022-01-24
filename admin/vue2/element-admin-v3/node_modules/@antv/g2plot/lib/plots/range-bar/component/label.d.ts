import { View } from '../../../dependents';
import BBox from '../../../util/bbox';
export interface RangeBarLabelConfig {
    visible: boolean;
    position?: 'outer' | 'inner';
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
    leftStyle?: any;
    rightStyle?: any;
    adjustColor?: boolean;
    adjustPosition?: boolean;
}
export interface IRangeBarLabel extends RangeBarLabelConfig {
    view: View;
    plot: any;
}
export default class RangeBarLabel {
    options: RangeBarLabelConfig;
    destroyed: boolean;
    private plot;
    private view;
    private coord;
    private container;
    constructor(cfg: IRangeBarLabel);
    init(): void;
    render(): void;
    hide(): void;
    show(): void;
    clear(): void;
    destroy(): void;
    getBBox(): any;
    protected getShapeBbox(shape: any): BBox;
    private getDefaultOptions;
    private getPosition;
    private getValue;
    private getTextAlign;
    private getTextColor;
    private doAnimation;
    private adjustPosition;
    private getGeometry;
}
