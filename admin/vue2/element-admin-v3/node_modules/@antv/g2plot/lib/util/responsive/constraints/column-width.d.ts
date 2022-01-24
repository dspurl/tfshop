export interface ColumnWidthCfg {
    ratio?: number;
}
declare function columnWidth(node: any, region: any, cfg?: ColumnWidthCfg): number;
declare const _default: {
    type: string;
    usage: string;
    expression: typeof columnWidth;
};
export default _default;
