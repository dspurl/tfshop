import EventEmitter from '@antv/event-emitter';
import { ICanvas, IGroup } from '../dependents';
import { Point } from '../interface/config';
import BBox from '../util/bbox';
export interface LayerConfig {
    /** @ignore */
    id?: string;
    /** the top-left-x of layer, local position relative to the parent layer */
    /** @ignore */
    x?: number;
    /** the top-left-y of layer, local position relative to the parent layer */
    /** @ignore */
    y?: number;
    /** layer width */
    width?: number;
    /** layer height */
    height?: number;
    /** the parent node of layer */
    /** @ignore */
    parent?: any;
    /** @ignore */
    canvas?: ICanvas;
    name?: string;
}
export interface Region {
    /** the top-left corner of layer-range, range from 0 to 1, relative to parent layer's range */
    readonly start: Point;
    /** the bottom-right corner of layer-range, range from 0 to 1, relative to parent layer's range */
    readonly end: Point;
}
export interface Range {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
export default class Layer<T extends LayerConfig = LayerConfig> extends EventEmitter {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    parent: Layer;
    canvas: ICanvas;
    layerBBox: BBox;
    layers: Layer[];
    container: IGroup;
    destroyed: boolean;
    protected visibility: boolean;
    protected layerRegion: Region;
    private rendered;
    private eventHandlers;
    options: T;
    /**
     * layer base for g2plot
     */
    constructor(props: T);
    processOptions(options: any): void;
    updateConfig(cfg: Partial<T>): void;
    beforeInit(): any;
    /**
     * init life cycle
     */
    init(): void;
    afterInit(): any;
    /**
     * render layer recursively
     */
    render(): void;
    /**
     * clear layer content
     */
    clear(): void;
    /**
     * destroy layer recursively, remove the container of layer
     */
    destroy(): void;
    /**
     * display layer
     */
    show(): void;
    /**
     * hide layer
     */
    hide(): void;
    /**
     * add children layer
     * @param layer
     */
    addLayer(layer: Layer<any>): void;
    /**
     * remove children layer
     * @param layer
     */
    removeLayer(layer: Layer<any>): void;
    /**
     * update layer's display range
     * @param props
     * @param recursive whether update children layers or not
     */
    updateBBox(props: Range, recursive?: boolean): void;
    /**
     * update display range according to parent layer's range
     */
    updateBBoxByParent(): void;
    /**
     * get global position of layer
     */
    getGlobalPosition(): {
        x: number;
        y: number;
    };
    getGlobalBBox(): BBox;
    getOptions(props: Partial<T>): T;
    eachLayer(cb: (layer: Layer<any>) => void): void;
    protected parseEvents(eventParser?: any): void;
    private getLayerBBox;
    private getLayerRegion;
}
