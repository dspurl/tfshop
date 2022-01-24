import { LayerConfig } from '../../base/layer';
import TinyLayer, { TinyViewConfig } from '../tiny-layer';
import { IStyle } from '../../interface/config';
export interface TinyAreaViewConfig extends TinyViewConfig {
    areaStyle?: IStyle;
    lineStyle?: IStyle;
    smooth?: boolean;
}
export interface TinyAreaLayerConfig extends TinyAreaViewConfig, LayerConfig {
}
export default class TinyAreaLayer extends TinyLayer<TinyAreaLayerConfig> {
    line: any;
    area: any;
    type: string;
    protected geometryParser(dim: string, type: string): string;
    protected addGeometry(): void;
    protected parseEvents(): void;
}
