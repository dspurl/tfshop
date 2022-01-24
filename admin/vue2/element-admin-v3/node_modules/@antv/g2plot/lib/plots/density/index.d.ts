import BasePlot, { PlotConfig } from '../../base/plot';
import DensityLayer, { DensityViewConfig } from './layer';
export interface DensityConfig extends DensityViewConfig, PlotConfig {
}
export default class Density extends BasePlot<DensityConfig> {
    static getDefaultOptions: typeof DensityLayer.getDefaultOptions;
    createLayers(props: any): void;
}
