export interface RingThicknessCfg {
    ratio: number;
}
declare function ringThickness(node: any, region: any, cfg?: RingThicknessCfg): number;
declare const _default: {
    type: string;
    usage: string;
    expression: typeof ringThickness;
};
export default _default;
