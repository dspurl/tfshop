import { View, IGroup } from '../../../dependents';
import BBox from '../../../util/bbox';
import { LegendPosition } from '../../../interface/config';
export interface HeatmapLegendConfig {
    visible?: boolean;
    position?: LegendPosition;
    width?: number;
    height?: number;
    text?: {
        style?: any;
        formatter?: () => string;
    };
    gridlineStyle?: any;
    triggerOn?: string;
}
export interface IHeatmapLegend extends HeatmapLegendConfig {
    view: View;
    plot: any;
}
export default class HeatmapLegend {
    options: IHeatmapLegend;
    container: IGroup;
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
    constructor(cfg: IHeatmapLegend);
    init(): void;
    render(): void;
    hide(): void;
    show(): void;
    clear(): void;
    destroy(): void;
    getBBox(): BBox;
    protected renderVertical(min: any, max: any, colors: any): void;
    protected renderHorizontal(min: any, max: any, colors: any): void;
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
        gridlineStyle: {
            lineWidth: number;
            stroke: string;
        };
    };
    protected getDarkOptions(): {
        text: {
            style: {
                fontSize: number;
                fill: string;
            };
        };
        gridlineStyle: {
            lineWidth: number;
            stroke: string;
        };
    };
    protected addInteraction(): void;
    protected getFilteredData(): any[];
    protected getDataSlide(range: any): any[];
    private getTopPosition;
    private getScales;
}
