import { View, IGroup, IShape } from '../../../dependents';
export interface TrendlineConfig {
    visible?: boolean;
    type?: string;
    style?: any;
    showConfidence?: boolean;
    confidenceStyle?: any;
}
export interface ITrendline extends TrendlineConfig {
    view: View;
    plotOptions: any;
}
export default class TrendLine {
    data: {
        trendlineData: any[];
        confidenceData: any[];
    };
    protected options: any;
    protected view: View;
    protected container: IGroup;
    protected shape: IShape;
    constructor(cfg: ITrendline);
    init(): void;
    render(): void;
    clear(): void;
    destroy(): void;
    private processData;
    private getTrendlinePoints;
    private getConfidencePath;
    private adjustScale;
}
