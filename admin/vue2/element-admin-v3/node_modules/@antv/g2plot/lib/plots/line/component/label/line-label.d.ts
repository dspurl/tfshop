import { View } from '../../../../dependents';
export interface LineLabelConfig {
    visible?: boolean;
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
}
export interface ILineLabel extends LineLabelConfig {
    view: View;
    plot: any;
}
export default class LineLabel {
    options: LineLabelConfig;
    destroyed: boolean;
    protected plot: any;
    protected view: View;
    private container;
    constructor(cfg: ILineLabel);
    protected init(): void;
    render(): void;
    clear(): void;
    hide(): void;
    show(): void;
    destroy(): void;
    getBBox(): any;
    private getDefaultOptions;
    private getGeometry;
    protected getShapeInfo(shape: any): {
        x: any;
        y: any;
        color: any;
        name: any;
    };
}
