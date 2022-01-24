import BasePlot, { PlotConfig } from '../../../base/plot';
import GroupedBarLayer, { GroupedBarViewConfig } from '../../grouped-bar/layer';
export interface GroupBarConfig extends GroupedBarViewConfig, PlotConfig {
}
export default class GroupBar extends BasePlot<GroupBarConfig> {
    static getDefaultOptions: typeof GroupedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
