import GaugeLayer from '../gauge/layer';
import { GaugeViewConfig } from '../gauge/interface';
import { LayerConfig } from '../../base/layer';
export interface FanGaugeViewConfig extends GaugeViewConfig {
}
export interface FanGaugeLayerConfig extends FanGaugeViewConfig, LayerConfig {
}
export default class FanGaugeLayer<T extends FanGaugeLayerConfig = FanGaugeLayerConfig> extends GaugeLayer<T> {
    static getDefaultOptions(): any;
    type: string;
    protected initG2Shape(): void;
    protected axis(): void;
    protected annotation(): void;
    protected renderSideText(): {
        type: string;
        top: boolean;
        position: string[];
        content: any;
        style: any;
        offsetX: any;
        offsetY: number;
    }[];
}
