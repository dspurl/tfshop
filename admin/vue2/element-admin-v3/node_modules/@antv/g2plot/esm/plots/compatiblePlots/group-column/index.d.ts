import BasePlot, { PlotConfig } from '../../../base/plot';
import GroupedColumnLayer, { GroupedColumnViewConfig } from '../../grouped-column/layer';
export interface GroupColumnConfig extends GroupedColumnViewConfig, PlotConfig {
}
export default class GroupColumn extends BasePlot<GroupColumnConfig> {
    static getDefaultOptions: typeof GroupedColumnLayer.getDefaultOptions;
    createLayers(props: any): void;
}
