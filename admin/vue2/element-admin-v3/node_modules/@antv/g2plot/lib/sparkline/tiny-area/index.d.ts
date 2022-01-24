import BasePlot, { PlotConfig } from '../../base/plot';
import TinyAreaLayer, { TinyAreaViewConfig } from './layer';
export interface TinyAreaConfig extends TinyAreaViewConfig, PlotConfig {
}
export default class TinyArea extends BasePlot<TinyAreaConfig> {
    static getDefaultOptions: typeof TinyAreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
