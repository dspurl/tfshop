import BasePlot, { PlotConfig } from '../../base/plot';
import FunnelLayer, { FunnelViewConfig } from './layer';
export interface FunnelConfig extends FunnelViewConfig, PlotConfig {
}
export default class Funnel extends BasePlot<FunnelConfig> {
    static getDefaultOptions: typeof FunnelLayer.getDefaultOptions;
    createLayers(props: any): void;
}
