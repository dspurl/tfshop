import { View, IGroup } from '../../../dependents';
interface ILabel {
    position?: string;
    text: string[] | Function;
    offset?: number | Function;
    style?: any;
}
export interface QuadrantConfig {
    visible?: boolean;
    xBaseline?: number;
    yBaseline?: number;
    regionStyle?: any[] | any;
    lineStyle?: any;
    label?: ILabel;
}
export interface IQuadrant extends QuadrantConfig {
    view: View;
    plotOptions: any;
}
export default class Quadrant {
    options: IQuadrant;
    protected view: View;
    protected quadrantGroups: IGroup[];
    protected container: IGroup;
    protected regionData: any[];
    protected lineData: any[];
    constructor(cfg: IQuadrant);
    init(): void;
    render(): void;
    clear(): void;
    destroy(): void;
    protected getDefaultStyle(): {
        line: {
            stroke: string;
            lineWidth: number;
        };
        regionStyle: {
            fill: string;
            opacity: number;
        }[];
        label: {
            position: string;
            offset: number;
            style: {
                fontSize: number;
                fill: string;
            };
        };
    };
    private getRegionStyle;
    private getLabelConfig;
}
export {};
