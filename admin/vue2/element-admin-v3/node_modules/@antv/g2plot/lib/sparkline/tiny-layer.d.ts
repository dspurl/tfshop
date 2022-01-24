import { LayerConfig } from '../base/layer';
import ViewLayer, { ViewConfig } from '../base/view-layer';
import '../geoms/line/mini';
export interface TinyViewConfig extends ViewConfig {
    indicator?: any;
    guideLine?: any;
}
export interface TinyLayerConfig extends TinyViewConfig, LayerConfig {
}
export default abstract class TinyLayer<T extends TinyLayerConfig = TinyLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): any;
    protected coord(): void;
    protected addGeometry(): void;
    protected annotation(): void;
}
