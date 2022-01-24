import { View } from '../../../dependents';
import BBox from '../../../util/bbox';
export interface RangeColumnLabelConfig {
    visible: boolean;
    position?: 'outer' | 'inner';
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
    topStyle?: any;
    bottomStyle?: any;
    adjustColor?: boolean;
    adjustPosition?: boolean;
}
export interface IRangeColumnLabel extends RangeColumnLabelConfig {
    view: View;
    plot: any;
}
export default class RangeColumnLabel {
    options: RangeColumnLabelConfig;
    destroyed: boolean;
    private plot;
    private view;
    private coord;
    private container;
    constructor(cfg: IRangeColumnLabel);
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
    private getTextBaseline;
    private getTextColor;
    private doAnimation;
    private adjustPosition;
    private getGeometry;
}
