import BasePlot, { PlotConfig } from '../../../base/plot';
import DonutLayer, { DonutViewConfig } from '../../donut/layer';
export interface RingConfig extends DonutViewConfig, PlotConfig {
}
export default class Ring extends BasePlot<RingConfig> {
    static getDefaultOptions: typeof DonutLayer.getDefaultOptions;
    createLayers(props: any): void;
}
