import BasePlot, { PlotConfig } from '../../base/plot';
import PercentStackedAreaLayer, { PercentStackedAreaLayerConfig } from './layer';
export interface PercentStackedAreaConfig extends PercentStackedAreaLayerConfig, PlotConfig {
}
export default class PercentStackedArea extends BasePlot<PercentStackedAreaConfig> {
    static getDefaultOptions: typeof PercentStackedAreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
