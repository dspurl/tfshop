export interface ElementDistCfg {
    value: number;
}
declare function elementDist(a: any, b: any, cfg?: ElementDistCfg): boolean;
declare const _default: {
    type: string;
    usage: string;
    expression: typeof elementDist;
};
export default _default;
