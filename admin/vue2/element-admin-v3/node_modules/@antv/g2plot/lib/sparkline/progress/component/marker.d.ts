import { View, IGroup, IShape, Canvas } from '../../../dependents';
export interface MarkerConfig {
    view?: View;
    canvas?: Canvas;
    progressSize?: number;
    value: number;
    style?: any;
}
export default class Marker {
    canvas: Canvas;
    view: View;
    progressSize: number;
    value: number;
    style: any;
    protected coord: any;
    protected container: IGroup;
    protected shape: IShape;
    constructor(cfg: MarkerConfig);
    destroy(): void;
    update(cfg: MarkerConfig, duration: number, easing: string): void;
    protected init(): void;
}
