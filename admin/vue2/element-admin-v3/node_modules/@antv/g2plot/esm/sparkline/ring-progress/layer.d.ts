import { LayerConfig } from '../../base/layer';
import ProgressLayer, { ProgressViewConfig } from '../progress/layer';
export declare type RingProgressViewConfig = ProgressViewConfig;
export interface RingProgressLayerConfig extends RingProgressViewConfig, LayerConfig {
}
export default class RingProgressLayer extends ProgressLayer<RingProgressLayerConfig> {
    ring: any;
    type: string;
    processProps(): void;
    protected coord(): void;
    protected annotation(): void;
    protected addGeometry(): void;
    protected animation(): void;
    protected parseEvents(): void;
    private getThickness;
}
