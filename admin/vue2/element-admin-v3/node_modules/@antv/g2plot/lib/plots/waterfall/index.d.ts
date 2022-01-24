import BasePlot, { PlotConfig } from '../../base/plot';
import WaterfallLayer, { WaterfallViewConfig } from './layer';
export interface WaterfallConfig extends WaterfallViewConfig, PlotConfig {
}
export default class Waterfall extends BasePlot<WaterfallConfig> {
    static getDefaultOptions: typeof WaterfallLayer.getDefaultOptions;
    createLayers(props: any): void;
}
