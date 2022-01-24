import BasePlot, { PlotConfig } from '../../../base/plot';
import PercentStackedAreaLayer, { PercentStackedAreaViewConfig } from '../../percent-stacked-area/layer';
export interface PercentageStackAreaConfig extends PercentStackedAreaViewConfig, PlotConfig {
}
export default class PercentageStackArea extends BasePlot<PercentageStackAreaConfig> {
    static getDefaultOptions: typeof PercentStackedAreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
