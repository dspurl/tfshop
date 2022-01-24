export interface ElementWidthCfg {
    ratio: number;
}
declare function elementWidth(node: any, region: any, cfg?: ElementWidthCfg): boolean;
declare const _default: {
    type: string;
    usage: string;
    expression: typeof elementWidth;
};
export default _default;
