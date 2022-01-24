export interface NodesResamplingCfg {
    keep: string[];
}
export default function nodesResampling(shape: any, option: NodesResamplingCfg, index: any, cfg: any): void;
export declare function isKeep(keepCfg: any, index: any, nodes: any): boolean;
