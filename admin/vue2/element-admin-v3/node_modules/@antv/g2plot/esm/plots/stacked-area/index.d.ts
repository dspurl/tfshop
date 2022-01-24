import BasePlot, { PlotConfig } from '../../base/plot';
import StackedAreaLayer, { StackedAreaLayerConfig } from './layer';
export interface StackedAreaConfig extends StackedAreaLayerConfig, PlotConfig {
}
export default class StackedArea extends BasePlot<StackedAreaConfig> {
    static getDefaultOptions: typeof StackedAreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
