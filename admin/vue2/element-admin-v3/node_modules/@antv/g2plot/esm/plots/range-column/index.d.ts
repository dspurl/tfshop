import BasePlot, { PlotConfig } from '../../base/plot';
import RangeColumnLayer, { RangeColumnViewConfig } from './layer';
export interface RangeColumnConfig extends RangeColumnViewConfig, PlotConfig {
}
export default class RangeColumn extends BasePlot<RangeColumnConfig> {
    static getDefaultOptions: typeof RangeColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
