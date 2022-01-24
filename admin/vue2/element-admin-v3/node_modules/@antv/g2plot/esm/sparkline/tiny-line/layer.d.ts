import { LayerConfig } from '../../base/layer';
import TinyLayer, { TinyViewConfig } from '../tiny-layer';
import { IStyle } from '../../interface/config';
export interface TinyLineViewConfig extends TinyViewConfig {
    lineStyle?: IStyle;
    smooth?: boolean;
}
export interface TinyLineLayerConfig extends TinyLineViewConfig, LayerConfig {
}
export default class TinyLineLayer extends TinyLayer<TinyLineLayerConfig> {
    line: any;
    type: string;
    protected geometryParser(dim: string, type: string): string;
    protected addGeometry(): void;
    protected parseEvents(): void;
}
