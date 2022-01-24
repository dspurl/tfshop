import BasePlot, { PlotConfig } from '../../../base/plot';
import StackedBarLayer, { StackedBarViewConfig } from '../../stacked-bar/layer';
export interface StackBarConfig extends StackedBarViewConfig, PlotConfig {
}
export default class StackBar extends BasePlot<StackBarConfig> {
    static getDefaultOptions: typeof StackedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
