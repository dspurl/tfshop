import BasePlot, { PlotConfig } from '../../base/plot';
import StackedColumnLineLayer, { StackedColumnLineViewConfig } from './layer';
export interface StackedColumnLineConfig extends StackedColumnLineViewConfig, PlotConfig {
}
export default class StackedColumnLine extends BasePlot<StackedColumnLineConfig> {
    static getDefaultOptions: typeof StackedColumnLineLayer.getDefaultOptions;
    createLayers(props: any): void;
}
