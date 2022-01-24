import BasePlot, { PlotConfig } from '../../base/plot';
import GroupedBarLayer, { GroupedBarViewConfig } from './layer';
export interface GroupedBarConfig extends GroupedBarViewConfig, PlotConfig {
}
export default class GroupedBar extends BasePlot<GroupedBarConfig> {
    static getDefaultOptions: typeof GroupedBarLayer.getDefaultOptions;
    createLayers(props: any): void;
}
