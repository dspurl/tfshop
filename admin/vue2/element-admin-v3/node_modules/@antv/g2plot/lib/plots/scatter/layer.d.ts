import { LayerConfig } from '../../base/layer';
import ViewLayer, { ViewConfig } from '../../base/view-layer';
import { ITimeAxis, IValueAxis, DataItem, GraphicStyle } from '../../interface/config';
import Quadrant, { QuadrantConfig } from './components/quadrant';
import Trendline, { TrendlineConfig } from './components/trendline';
import './theme';
export interface PointViewConfig extends ViewConfig {
    /** 散点样式 */
    pointStyle?: GraphicStyle | ((...args: any) => GraphicStyle);
    /** 颜色字段 */
    colorField?: string | string[];
    /** x 轴配置 */
    xAxis?: ITimeAxis | IValueAxis;
    /** y 轴配置 */
    yAxis?: ITimeAxis | IValueAxis;
    quadrant?: QuadrantConfig;
    trendline?: TrendlineConfig;
}
export interface ScatterViewConfig extends PointViewConfig {
    /** 散点大小 */
    pointSize?: number | any;
}
export interface ScatterLayerConfig extends ScatterViewConfig, LayerConfig {
}
export default class ScatterLayer<T extends ScatterLayerConfig = ScatterLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): any;
    type: string;
    points: any;
    protected quadrant: Quadrant;
    protected trendline: Trendline;
    afterRender(): void;
    destroy(): void;
    private isValidLinearValue;
    protected processData(data?: DataItem[]): DataItem[] | undefined;
    protected geometryParser(dim: any, type: any): any;
    protected scale(): void;
    protected coord(): void;
    protected annotation(): void;
    protected addGeometry(): void;
    protected label(): void;
    protected animation(): void;
    protected parseEvents(eventParser: any): void;
    protected extractTooltip(): void;
}
