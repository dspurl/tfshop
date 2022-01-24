/** 可插拔的responsive模块 */
import { BBox } from '@antv/g-base';
import ShapeNodes from './node/shape-nodes';
import VariableNodes from './node/variable-node';
import { LooseMap } from '../../interface/types';
interface IConstraint {
    name: string;
    option?: any;
}
interface ResponsiveCfg {
    plot: any;
    region?: any;
    nodes: ShapeNodes | VariableNodes;
    constraints: IConstraint[];
    rules?: any;
    iterationTime?: number;
    onStart?: (...args: any[]) => any;
    onIteration?: (...args: any[]) => any;
    onEnd?: (...args: any[]) => any;
    cfg?: LooseMap;
}
export default class Responsive {
    plot: any;
    region: BBox;
    nodes: ShapeNodes | VariableNodes;
    constraints: any[];
    rules: any[];
    iterationTime: number;
    iterationIndex: number;
    rulesLocker: any[];
    currentConstraint: IConstraint;
    constraintIndex: number;
    onStart: (nodes: ShapeNodes | VariableNodes) => void;
    onIteration: (nodes: ShapeNodes | VariableNodes) => void;
    onEnd: (nodes: ShapeNodes | VariableNodes) => void;
    constructor(cfg: ResponsiveCfg);
    private _start;
    private _iteration;
    private _end;
    private _run;
    private _constraintsTest;
    private _constraintCompare;
    private _chainConstraintCompare;
    private _paddingConstraintCompare;
    private _groupConstraintCompare;
    private _constraintAssignment;
    private _chainConstraintAssign;
    private _paddingConstraintAssign;
    private _applyRules;
    private _applyRule;
}
export {};
