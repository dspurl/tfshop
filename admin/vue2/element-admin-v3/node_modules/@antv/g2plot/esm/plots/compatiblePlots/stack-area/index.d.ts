import BasePlot, { PlotConfig } from '../../../base/plot';
import StackedAreaLayer from '../../stacked-area/layer';
import { StackedAreaViewConfig } from '../../stacked-area/interface';
export interface StackAreaConfig extends StackedAreaViewConfig, PlotConfig {
}
export default class StackArea extends BasePlot<StackAreaConfig> {
    static getDefaultOptions: typeof StackedAreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
