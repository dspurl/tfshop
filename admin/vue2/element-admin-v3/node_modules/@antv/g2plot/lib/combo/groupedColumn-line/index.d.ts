import BasePlot, { PlotConfig } from '../../base/plot';
import GroupedColumnLineLayer, { GroupedColumnLineViewConfig } from './layer';
export interface GroupedColumnLineConfig extends GroupedColumnLineViewConfig, PlotConfig {
}
export default class GroupedColumnLine extends BasePlot<GroupedColumnLineConfig> {
    static getDefaultOptions: typeof GroupedColumnLineLayer.getDefaultOptions;
    createLayers(props: any): void;
}
