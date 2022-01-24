import BasePlot, { PlotConfig } from '../../base/plot';
import TinyColumnLayer, { TinyColumnLayerConfig } from './layer';
export interface TinyColumnConfig extends TinyColumnLayerConfig, PlotConfig {
}
export default class TinyColumn extends BasePlot<TinyColumnConfig> {
    static getDefaultOptions: typeof TinyColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
