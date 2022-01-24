import BasePlot, { PlotConfig } from '../../base/plot';
import ScatterLayer, { ScatterViewConfig } from './layer';
export interface ScatterConfig extends ScatterViewConfig, PlotConfig {
}
export default class Scatter extends BasePlot<ScatterConfig> {
    static getDefaultOptions: typeof ScatterLayer.getDefaultOptions;
    createLayers(props: any): void;
}
