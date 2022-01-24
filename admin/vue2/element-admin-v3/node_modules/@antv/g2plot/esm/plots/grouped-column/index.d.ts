import BasePlot, { PlotConfig } from '../../base/plot';
import GroupedColumnLayer, { GroupedColumnViewConfig } from './layer';
export interface GroupedColumnConfig extends GroupedColumnViewConfig, PlotConfig {
}
export default class GroupedColumn extends BasePlot<GroupedColumnConfig> {
    static getDefaultOptions: typeof GroupedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
