import BasePlot, { PlotConfig } from '../../base/plot';
import TinyLineLayer, { TinyLineViewConfig } from './layer';
export interface TinyLineConfig extends TinyLineViewConfig, PlotConfig {
}
export default class TinyLine extends BasePlot<TinyLineConfig> {
    static getDefaultOptions: typeof TinyLineLayer.getDefaultOptions;
    createLayers(props: any): void;
}
