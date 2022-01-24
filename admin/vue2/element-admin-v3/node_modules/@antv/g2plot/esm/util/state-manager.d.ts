/**
 * 可插拔的状态量管理机
 */
import EventEmitter from '@antv/event-emitter';
import { LooseMap } from '../interface/types';
declare type States = LooseMap;
export default class StateManager extends EventEmitter {
    private _states;
    private _stateStack;
    private _changeTimer;
    constructor();
    setState(name: string, exp: any): void;
    getState(name: string): any;
    getAllStates(): States;
    clear(): void;
    private _onUpdate;
    private _triggerEvent;
}
export {};
