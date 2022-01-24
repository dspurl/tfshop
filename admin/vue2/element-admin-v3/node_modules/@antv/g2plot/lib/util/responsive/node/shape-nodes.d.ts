/** 负责将shape数据转为node，使shape根据node数据进行update */
import { IShape } from '@antv/g-base';
interface NodesCfg {
    shapes: IShape[];
}
export interface IShapeNode {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
    topLeft?: {};
    topRight?: {};
    bottomLeft?: {};
    bottomRight?: {};
    shape?: IShape;
}
export default class ShapeNodes {
    shapes: IShape[];
    nodes: IShapeNode[];
    origion_nodes: IShapeNode[];
    type: string;
    constructor(cfg: NodesCfg);
    measure(shape: any): any;
    measureNodes(): void;
    private _parserNodes;
}
export {};
