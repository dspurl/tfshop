import LineLayer, { LineLayerConfig, LineViewConfig } from '../line/layer';
import { LayerConfig } from '../..';
export interface StepLineViewConfig extends LineViewConfig {
    readonly step?: 'hv' | 'vh' | 'vhv' | 'hvh';
}
export interface StepLineLayerConfig extends StepLineViewConfig, LayerConfig {
}
export declare class StepLineLayer extends LineLayer<StepLineLayerConfig> {
    type: string;
    static getDefaultOptions(): Partial<LineLayerConfig>;
}
