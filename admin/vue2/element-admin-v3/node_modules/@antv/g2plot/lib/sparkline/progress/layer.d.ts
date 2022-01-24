import TinyLayer, { TinyViewConfig } from '../tiny-layer';
import { MarkerConfig } from './component/marker';
import { GraphicStyle } from '../../interface/config';
export interface ProgressViewConfig extends TinyViewConfig {
    progressStyle?: GraphicStyle;
    percent?: number;
    size?: number;
    marker?: MarkerConfig[];
    /** @ignore */
    barSize?: number;
    /** @ignore */
    barStyle?: GraphicStyle;
    /** @ignore */
    stackField?: string;
}
interface UpdateConfig {
    percent: number;
    color?: string | string[];
    style?: {} | {}[];
    marker?: MarkerConfig[];
}
export declare type ProgressLayerConfig = ProgressViewConfig;
export default class ProgressLayer<T extends ProgressLayerConfig = ProgressLayerConfig> extends TinyLayer<T> {
    /**
     * 将进度条配置项转为堆叠条形图配置项
     */
    type: string;
    protected markers: MarkerConfig[];
    private isEntered;
    processProps(): void;
    init(): void;
    beforeInit(): void;
    update(cfg: UpdateConfig): void;
    destroy(): void;
    afterRender(): void;
    protected geometryParser(dim: string, type: string): string;
    protected coord(): void;
    protected addGeometry(): void;
    protected parseEvents(eventParser?: any): void;
    protected parseColorProps(props: any): any;
    protected processData(): {
        type: string;
        value: number;
    }[];
    protected updateMarkers(markerCfg: MarkerConfig[]): void;
    private getSize;
    private styleUpdateAnimation;
    private getUpdateAnimationOptions;
    private updateColorConfigByStyle;
}
export {};
