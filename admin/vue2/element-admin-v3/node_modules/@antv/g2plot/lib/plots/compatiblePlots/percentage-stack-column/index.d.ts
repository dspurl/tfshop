import BasePlot, { PlotConfig } from '../../../base/plot';
import PercentStackedColumnLayer, { PercentStackedColumnViewConfig } from '../../percent-stacked-column/layer';
export interface PercentageStackColumnConfig extends PercentStackedColumnViewConfig, PlotConfig {
}
export default class PercentageStackColumn extends BasePlot<PercentageStackColumnConfig> {
    static getDefaultOptions: typeof PercentStackedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
