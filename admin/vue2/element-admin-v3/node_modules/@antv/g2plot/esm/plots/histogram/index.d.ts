import BasePlot, { PlotConfig } from '../../base/plot';
import HistogramLayer, { HistogramViewConfig } from './layer';
export interface HistogramConfig extends HistogramViewConfig, PlotConfig {
}
export default class Histogram extends BasePlot<HistogramConfig> {
    static getDefaultOptions: typeof HistogramLayer.getDefaultOptions;
    createLayers(props: any): void;
}
