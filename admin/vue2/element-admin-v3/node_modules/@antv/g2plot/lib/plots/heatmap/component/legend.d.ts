import BBox from '../../../util/bbox';
import { View, IGroup, IShape } from '../../../dependents';
import { LegendPosition, GraphicStyle, TextStyle, LineStyle } from '../../../interface/config';
export interface MatrixLegendConfig {
    visible?: boolean;
    position?: LegendPosition;
    width?: number;
    height?: number;
    text?: {
        style?: TextStyle;
        formatter?: () => string;
    };
    ticklineStyle?: LineStyle;
    anchorStyle?: GraphicStyle;
    triggerOn?: string;
}
export interface IMatrixLegend extends MatrixLegendConfig {
    view: View;
    plot: any;
}
export default class MatrixLegend {
    options: IMatrixLegend;
    container: IGroup;
    anchor: IShape;
    afterRender: boolean;
    destroyed: boolean;
    protected view: View;
    protected layout: string;
    protected width: number;
    protected height: number;
    protected position: string;
    protected x: number;
    protected y: number;
    protected dataSlides: any;
    protected colorScale: any;
    private interactiveEvents;
    constructor(cfg: IMatrixLegend);
    init(): void;
    render(): void;
    hide(): void;
    show(): void;
    clear(): void;
    destroy(): void;
    getBBox(): BBox;
    protected renderVertical(min: number, max: number, colors: string[]): void;
    protected renderHorizontal(min: number, max: number, colors: string[]): void;
    protected getLayout(): "horizontal" | "vertical";
    protected getDefaultWidth(): number;
    protected getDefaultHeight(): number;
    protected legendLayout(): void;
    protected getDefaultOptions(): {
        text: {
            style: {
                fontSize: number;
                fill: string;
            };
        };
        ticklineStyle: {
            lineWidth: number;
            stroke: string;
        };
        anchorStyle: {
            fill: string;
        };
        triggerOn: string;
    };
    protected addInteraction(): void;
    private moveAnchor;
    private getTopPosition;
    private offEvent;
}
