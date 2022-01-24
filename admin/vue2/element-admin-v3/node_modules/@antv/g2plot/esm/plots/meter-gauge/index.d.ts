import BasePlot, { PlotConfig } from '../../base/plot';
import MeterGaugeLayer, { MeterGaugeLayerConfig } from './layer';
export interface MeterGaugeConfig extends MeterGaugeLayerConfig, PlotConfig {
}
export default class MeterGauge extends BasePlot<MeterGaugeConfig> {
    static getDefaultOptions: typeof MeterGaugeLayer.getDefaultOptions;
    createLayers(props: any): void;
}
