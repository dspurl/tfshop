import { LayerConfig } from '../../base/layer';
import TinyLayer, { TinyViewConfig } from '../tiny-layer';
import { IStyle } from '../../interface/config';
export interface TinyColumnViewConfig extends TinyViewConfig {
    columnStyle?: IStyle;
}
export interface TinyColumnLayerConfig extends TinyColumnViewConfig, LayerConfig {
}
export default class TinyColumnLayer extends TinyLayer<TinyColumnLayerConfig> {
    line: any;
    area: any;
    type: string;
    init(): void;
    protected geometryParser(dim: string, type: string): string;
    protected scale(): void;
    protected addGeometry(): void;
    protected parseEvents(): void;
    private processProps;
    private getSize;
    private getColumnNum;
}
