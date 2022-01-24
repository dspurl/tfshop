export default class ConnectedArea {
    private view;
    private container;
    private field;
    private areas;
    private lines;
    private areaStyle;
    private _areaStyle;
    private lineStyle;
    private _lineStyle;
    private triggerOn;
    private animation;
    constructor(cfg: any);
    draw(): void;
    clear(): void;
    destroy(): void;
    setState(state: any, condition: any): void;
    private _init;
    private _getGroupedShapes;
    private _drawConnection;
    private _getShapeStyle;
    private _addInteraction;
    private _initialAnimation;
    private _onActive;
    private _onDisabled;
    private _onSelected;
    private getGeometry;
}
