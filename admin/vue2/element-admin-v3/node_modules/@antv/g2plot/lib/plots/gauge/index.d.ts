import BasePlot, { PlotConfig } from '../../base/plot';
import GaugeLayer, { GaugeLayerConfig } from './layer';
export interface GaugeConfig extends GaugeLayerConfig, PlotConfig {
}
export default class Gauge extends BasePlot<GaugeConfig> {
    static getDefaultOptions: typeof GaugeLayer.getDefaultOptions;
    createLayers(props: any): void;
}
