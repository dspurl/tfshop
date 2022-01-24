import { View } from '../../../../dependents';
import { TextStyle } from '../../../../interface/config';
export interface DiffLabelcfg {
    view: View;
    fields: string[];
    formatter: (text: string, item: object, idx: number) => string;
    style?: TextStyle;
}
export default class DiffLabel {
    private view;
    private fields;
    private container;
    private formatter;
    private textAttrs;
    constructor(cfg: DiffLabelcfg);
    /** 绘制辅助labels */
    draw(): void;
    clear(): void;
    private _init;
}
