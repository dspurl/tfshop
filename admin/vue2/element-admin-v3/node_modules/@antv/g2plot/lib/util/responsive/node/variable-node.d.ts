interface NodesCfg {
    nodes: IVariableNode[];
}
interface IVariableNode {
    name: string;
    value: any;
}
export default class VariableNodes {
    nodes: IVariableNode[];
    type: string;
    constructor(cfg: NodesCfg);
}
export {};
