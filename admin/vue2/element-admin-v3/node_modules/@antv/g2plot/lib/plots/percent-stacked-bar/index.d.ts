import BasePlot, { PlotConfig } from '../../base/plot';
import PercentStackedBarLayer, { PercentStackedBarLayerConfig } from './layer';
export interface PercentStackedBarConfig extends PercentStackedBarLayerConfig, PlotConfig {
}
export default class PercentStackedBar extends BasePlot<PercentStackedBarConfig> {
    static getDefaultOptions: typeof PercentStackedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
