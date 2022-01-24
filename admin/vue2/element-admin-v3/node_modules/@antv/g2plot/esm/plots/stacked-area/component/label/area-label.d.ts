import { View } from '../../../../dependents';
export interface AreaLabelConfig {
    visible: boolean;
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
    autoScale?: boolean;
}
export interface IAreaLabel extends AreaLabelConfig {
    view: View;
    plot: any;
}
export default class AreaLabel {
    options: AreaLabelConfig;
    destroyed: boolean;
    protected plot: any;
    protected view: View;
    private container;
    private scaleFactor;
    constructor(cfg: IAreaLabel);
    protected init(): void;
    render(): void;
    clear(): void;
    hide(): void;
    show(): void;
    destroy(): void;
    getBBox(): any;
    protected getDefaultOptions(): {
        offsetX: number;
        offsetY: number;
        style: any;
        autoScale: boolean;
    };
    protected drawLabel(points: any, name: any): any;
    private getInterpolatedPoints;
    private bisection;
    private testFit;
    private getLabelBbox;
    private getGeometry;
    protected getFontSize(index: any): number;
}
