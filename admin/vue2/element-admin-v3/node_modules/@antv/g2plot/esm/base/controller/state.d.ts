import StateManager from '../../util/state-manager';
export declare function compare(origin: any, condition: any): any;
export default class StateController {
    private plot;
    private stateManager;
    private shapes;
    private originAttrs;
    private shapeContainers;
    constructor(cfg: any);
    createStateManager(): void;
    bindStateManager(manager: StateManager, cfg: any): void;
    defaultStates(states: any): void;
    setState(cfg: any): void;
    private _updateStateProcess;
    private _stateChangeProcess;
    private _getShapes;
    private _getOriginAttrs;
    private _eventParser;
    private _getDefaultStateStyle;
    private _parserRelated;
    private setZIndex;
    private resetZIndex;
}
