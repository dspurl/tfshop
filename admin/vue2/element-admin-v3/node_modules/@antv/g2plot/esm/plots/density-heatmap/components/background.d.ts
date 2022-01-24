import { View, IGroup } from '../../../dependents';
import EventEmitter from '@antv/event-emitter';
export interface HeatmapBackgroundConfig {
    visible?: boolean;
    type?: string;
    value?: any;
    src?: string;
    callback?: Function;
}
export interface IHeatmapBackground extends HeatmapBackgroundConfig {
    view: View;
    plot: any;
}
export default class HeatmapBackground extends EventEmitter {
    options: IHeatmapBackground;
    container: IGroup;
    protected view: View;
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    constructor(cfg: IHeatmapBackground);
    init(): void;
    render(): void;
    renderColorBackground(): void;
    renderImageBackground(): void;
    clear(): void;
    destroy(): void;
    private getCoordinate;
}
