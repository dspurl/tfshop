import BasePlot, { PlotConfig } from '../../base/plot';
import RangeBarLayer, { RangeBarViewConfig } from './layer';
export interface RangeBarConfig extends RangeBarViewConfig, PlotConfig {
}
export default class RangeBar extends BasePlot<RangeBarConfig> {
    static getDefaultOptions: typeof RangeBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
