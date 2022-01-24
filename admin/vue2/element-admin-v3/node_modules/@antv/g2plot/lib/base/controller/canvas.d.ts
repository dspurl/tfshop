import { ICanvas } from '../../dependents';
import BasePlot from '../plot';
export interface CanvasControllerCfg {
    readonly containerDOM: HTMLElement;
    readonly plot: BasePlot;
}
/**
 * Canvas controller
 * 1. create G.Canvas, destroy G.Canvas
 * 2. process auto fit container
 * 3. API for G.Canvas
 */
export default class CanvasController {
    width: number;
    height: number;
    canvas: ICanvas;
    private containerDOM;
    private plot;
    private resizeObserver;
    /**
     * when the container size changed, trigger it after 300ms.
     */
    private onResize;
    constructor(cfg: CanvasControllerCfg);
    /**
     * get canvas size from props.
     * @returns the width, height of canvas
     */
    getCanvasSize(): {
        width: any;
        height: any;
    };
    /**
     * get the canvas dom
     * @returns Canvas DOM
     */
    getCanvasDOM(): any;
    /**
     * update the plot size
     */
    updateCanvasSize(): void;
    /**
     * 根据主题调整canvas样式
     */
    updateCanvasTheme(): void;
    /**
     * update the canvas dom styles
     * @param styles
     */
    private updateCanvasStyle;
    /**
     * destroy the plot, remove resize event.
     */
    destroy(): void;
    /**
     * when forceFit = true, then bind the event to listen the container size change
     */
    private bindForceFit;
    /**
     * init life circle
     */
    private init;
    /**
     * init G.Canvas instance
     */
    private initGCanvas;
}
