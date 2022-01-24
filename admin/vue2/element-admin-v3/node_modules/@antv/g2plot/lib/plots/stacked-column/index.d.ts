import BasePlot, { PlotConfig } from '../../base/plot';
import StackedColumnLayer, { StackedColumnViewConfig } from './layer';
export interface StackedColumnConfig extends StackedColumnViewConfig, PlotConfig {
}
export default class StackedColumn extends BasePlot<StackedColumnConfig> {
    static getDefaultOptions: typeof StackedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
