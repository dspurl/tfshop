import BasePlot, { PlotConfig } from '../../base/plot';
import BarLayer from './layer';
import { BarViewConfig } from './interface';
export interface BarConfig extends BarViewConfig, PlotConfig {
}
export default class Bar extends BasePlot<BarConfig> {
    static getDefaultOptions: typeof BarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
