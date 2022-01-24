import { View, ICanvas } from '../dependents';
interface InteractionCfg {
    view: View;
    startEvent?: string;
    processEvent?: string;
    endEvent?: string;
    resetEvent?: string;
}
export interface InteractionConstructor {
    new (cfg: any): Interaction;
}
export default abstract class Interaction {
    view: View;
    protected canvas: ICanvas;
    startEvent: string;
    processEvent: string;
    endEvent: string;
    resetEvent: string;
    private _eventHandlers;
    constructor(cfg: InteractionCfg);
    protected getDefaultCfg(): {
        startEvent: string;
        processEvent: string;
        endEvent: string;
        resetEvent: string;
    };
    private _start;
    protected preStart(ev: any): void;
    protected abstract start(ev: any): void;
    protected afterStart(ev: any): void;
    private _process;
    protected preProcess(ev: any): void;
    protected process(ev: any): void;
    protected afterProcess(ev: any): void;
    private _end;
    protected preEnd(ev: any): void;
    protected end(ev: any): void;
    protected afterEnd(ev: any): void;
    private _reset;
    protected preReset(ev?: any): void;
    protected reset(ev?: any): void;
    protected afterReset(ev?: any): void;
    private _bindEvents;
    private _unbindEvents;
    destroy(): void;
}
export {};
