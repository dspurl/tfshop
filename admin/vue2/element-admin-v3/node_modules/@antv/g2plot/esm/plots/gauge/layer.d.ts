import { LayerConfig } from '../../base/layer';
import ViewLayer from '../../base/view-layer';
import { GaugeViewConfig } from './interface';
export interface GaugeLayerConfig extends GaugeViewConfig, LayerConfig {
}
export default class GaugeLayer<T extends GaugeLayerConfig = GaugeLayerConfig> extends ViewLayer<T> {
    data: [];
    gaugeShape: any;
    options: any;
    constructor(props: any);
    static getDefaultOptions(): any;
    type: string;
    init(): void;
    /**
     * 绘制指针
     */
    protected initG2Shape(): void;
    protected geometryParser(): string;
    protected scale(): void;
    protected coord(): void;
    protected axis(): void;
    protected addGeometry(): void;
    protected annotation(): void;
    protected renderStatistic(): {
        type: string;
        content: any;
        top: boolean;
        position: any;
        style: {
            fill: any;
            fontSize: any;
            textAlign: string;
            textBaseline: string;
        };
    };
    protected parseEvents(): void;
}
