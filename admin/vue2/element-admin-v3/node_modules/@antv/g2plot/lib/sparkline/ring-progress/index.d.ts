import BasePlot, { PlotConfig } from '../../base/plot';
import RingProgressLayer, { RingProgressViewConfig } from './layer';
export interface RingProgressConfig extends RingProgressViewConfig, PlotConfig {
}
export default class RingProgress extends BasePlot<RingProgressConfig> {
    static getDefaultOptions: typeof RingProgressLayer.getDefaultOptions;
    createLayers(props: any): void;
    update(value: number): void;
}
