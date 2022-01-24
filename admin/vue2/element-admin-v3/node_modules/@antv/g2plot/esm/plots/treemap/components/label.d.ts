import { View } from '../../../dependents';
export interface TreemapLabelConfig {
    visible?: boolean;
    formatter?: (...args: any[]) => string;
    offsetX?: number;
    offsetY?: number;
    style?: any;
}
export interface ILineLabel extends TreemapLabelConfig {
    view: View;
    plot: any;
}
export default class TreemapLabel {
    options: TreemapLabelConfig;
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
    protected getPosition(shape: any, isLeafNode: any): {
        x: number;
        y: number;
    };
    protected getTextBaseLine(isLeafNode: any): "middle" | "top";
    protected adjustLabel(label: any, shape: any, isLeafNode: any): void;
    private adjustLeafLabel;
    private adjustParentLabel;
    private getDefaultOptions;
    private getGeometry;
}
