import BasePlot, { PlotConfig } from '../../../base/plot';
import StackedColumnLayer, { StackedColumnViewConfig } from '../../stacked-column/layer';
export interface StackColumnConfig extends StackedColumnViewConfig, PlotConfig {
}
export default class StackColumn extends BasePlot<StackColumnConfig> {
    static getDefaultOptions: typeof StackedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
