import BasePlot, { PlotConfig } from '../../base/plot';
import ProgressLayer, { ProgressViewConfig } from './layer';
export interface ProgressConfig extends ProgressViewConfig, PlotConfig {
}
export default class Progress extends BasePlot<ProgressConfig> {
    static getDefaultOptions: typeof ProgressLayer.getDefaultOptions;
    createLayers(props: any): void;
    update(value: number, style?: any): void;
}
