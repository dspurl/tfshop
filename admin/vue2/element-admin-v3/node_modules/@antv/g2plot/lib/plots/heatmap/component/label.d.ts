import { View } from '../../../dependents';
export interface MatrixLabelConfig {
    visible: boolean;
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
    adjustColor?: boolean;
    adjustPosition?: boolean;
}
export interface IMatrixLabel extends MatrixLabelConfig {
    view: View;
    plot: any;
}
export default class MatrixLabel {
    options: MatrixLabelConfig;
    destroyed: boolean;
    protected plot: any;
    protected view: View;
    private container;
    constructor(cfg: IMatrixLabel);
    protected init(): void;
    render(): void;
    clear(): void;
    hide(): void;
    show(): void;
    destroy(): void;
    getBBox(): any;
    private getDefaultOptions;
    protected getContent(shape: any): any;
    protected getPosition(shape: any): {
        x: any;
        y: any;
    };
    protected getTextColor(shape: any): any;
    protected adjustLabel(label: any, shape: any): void;
}
