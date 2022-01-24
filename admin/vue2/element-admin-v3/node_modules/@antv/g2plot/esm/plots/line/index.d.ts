import BasePlot, { PlotConfig } from '../../base/plot';
import LineLayer, { LineViewConfig } from './layer';
export interface LineConfig extends LineViewConfig, PlotConfig {
}
export default class Line extends BasePlot<LineConfig> {
    static getDefaultOptions: typeof LineLayer.getDefaultOptions;
    createLayers(props: any): void;
}
