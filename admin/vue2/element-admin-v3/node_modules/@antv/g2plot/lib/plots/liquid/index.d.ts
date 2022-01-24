import BasePlot, { PlotConfig } from '../../base/plot';
import LiquidLayer, { LiquidViewConfig } from './layer';
export interface LiquidConfig extends LiquidViewConfig, PlotConfig {
}
export default class Liquid extends BasePlot<LiquidConfig> {
    static getDefaultOptions: typeof LiquidLayer.getDefaultOptions;
    createLayers(props: any): void;
    changeValue(value: number, all?: boolean): void;
}
