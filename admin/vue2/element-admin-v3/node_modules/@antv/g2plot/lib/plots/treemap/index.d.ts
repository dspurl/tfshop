import BasePlot, { PlotConfig } from '../../base/plot';
import TreemapLayer, { TreemapViewConfig } from './layer';
export interface TreemapConfig extends TreemapViewConfig, PlotConfig {
}
export default class Treemap extends BasePlot<TreemapConfig> {
    static getDefaultOptions: typeof TreemapLayer.getDefaultOptions;
    createLayers(props: any): void;
}
