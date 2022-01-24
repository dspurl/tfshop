import { ICanvas } from '../../dependents';
import BasePlot from '../plot';
interface ControllerConfig {
    canvas: ICanvas;
    plot: BasePlot;
}
export default class EventController {
    private plot;
    private canvas;
    private eventHandlers;
    private lastShape;
    constructor(cfg: ControllerConfig);
    bindEvents(): void;
    clearEvents(): void;
    private addEvent;
    private onEvents;
    private onMove;
    private isShapeInView;
    private getEventObj;
    private onLayerEvent;
}
export {};
