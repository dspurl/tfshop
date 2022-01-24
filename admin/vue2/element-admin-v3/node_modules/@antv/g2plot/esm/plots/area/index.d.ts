import BasePlot, { PlotConfig } from '../../base/plot';
import AreaLayer from './layer';
import { AreaViewConfig } from './interface';
export interface AreaConfig extends AreaViewConfig, PlotConfig {
}
export default class Area extends BasePlot<AreaConfig> {
    static getDefaultOptions: typeof AreaLayer.getDefaultOptions;
    createLayers(props: any): void;
}
