import { LayerConfig } from '../../base/layer';
import GaugeLayer from '../gauge/layer';
import { GaugeViewConfig } from '../gauge/interface';
export declare type MeterGaugeViewConfig = GaugeViewConfig;
export interface MeterGaugeLayerConfig extends MeterGaugeViewConfig, LayerConfig {
}
export default class MeterGaugeLayer<T extends MeterGaugeLayerConfig = MeterGaugeLayerConfig> extends GaugeLayer<T> {
    static getDefaultOptions(): any;
    type: string;
}
