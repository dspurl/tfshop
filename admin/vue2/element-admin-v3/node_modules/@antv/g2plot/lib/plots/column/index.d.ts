import BasePlot, { PlotConfig } from '../../base/plot';
import ColumnLayer from './layer';
import { ColumnViewConfig } from './interface';
export interface ColumnConfig extends ColumnViewConfig, PlotConfig {
}
export default class Column extends BasePlot<ColumnConfig> {
    static getDefaultOptions: typeof ColumnLayer.getDefaultOptions;
    createLayers(props: ColumnConfig): void;
}
