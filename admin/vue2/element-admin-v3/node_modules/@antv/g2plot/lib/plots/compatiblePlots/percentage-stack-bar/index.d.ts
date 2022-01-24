import BasePlot, { PlotConfig } from '../../../base/plot';
import PercentStackedBarLayer, { PercentStackedBarViewConfig } from '../../percent-stacked-bar/layer';
export interface PercentageStackBarConfig extends PercentStackedBarViewConfig, PlotConfig {
}
export default class PercentageStackBar extends BasePlot<PercentageStackBarConfig> {
    static getDefaultOptions: typeof PercentStackedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
