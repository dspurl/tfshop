import BasePlot, { PlotConfig } from '../../base/plot';
import StackedBarLayer, { StackedBarViewConfig } from './layer';
export interface StackedBarConfig extends StackedBarViewConfig, PlotConfig {
}
export default class StackedBar extends BasePlot<StackedBarConfig> {
    static getDefaultOptions: typeof StackedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
