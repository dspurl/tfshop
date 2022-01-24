import BasePlot, { PlotConfig } from '../../base/plot';
import PercentStackedColumnLayer, { PercentStackedColumnLayerConfig } from './layer';
export interface PercentStackedColumnConfig extends PercentStackedColumnLayerConfig, PlotConfig {
}
export default class PercentStackedColumn extends BasePlot<PercentStackedColumnConfig> {
    static getDefaultOptions: typeof PercentStackedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
