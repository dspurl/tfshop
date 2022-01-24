import BasePlot, { PlotConfig } from '../../base/plot';
import DensityHeatmapLayer, { DensityHeatmapViewConfig } from './layer';
export interface DensityHeatmapConfig extends DensityHeatmapViewConfig, PlotConfig {
}
export default class DensityHeatmap extends BasePlot<DensityHeatmapConfig> {
    static getDefaultOptions: typeof DensityHeatmapLayer.getDefaultOptions;
    createLayers(props: any): void;
}
