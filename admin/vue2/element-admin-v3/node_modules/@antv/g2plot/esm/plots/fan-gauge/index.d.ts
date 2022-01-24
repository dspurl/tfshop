import BasePlot, { PlotConfig } from '../../base/plot';
import FanGaugeLayer, { FanGaugeLayerConfig } from './layer';
export interface FanGaugeConfig extends FanGaugeLayerConfig, PlotConfig {
}
export default class FanGauge extends BasePlot<FanGaugeConfig> {
    static getDefaultOptions: typeof FanGaugeLayer.getDefaultOptions;
    createLayers(props: any): void;
}
