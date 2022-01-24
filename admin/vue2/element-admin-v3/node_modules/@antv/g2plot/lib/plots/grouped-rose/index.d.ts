import BasePlot, { PlotConfig } from '../../base/plot';
import GroupedRoseLayer, { GroupedRoseViewConfig } from './layer';
export interface GroupedRoseConfig extends GroupedRoseViewConfig, PlotConfig {
}
export default class GroupedRose extends BasePlot<GroupedRoseConfig> {
    static getDefaultOptions: typeof GroupedRoseLayer.getDefaultOptions;
    createLayers(props: any): void;
}
