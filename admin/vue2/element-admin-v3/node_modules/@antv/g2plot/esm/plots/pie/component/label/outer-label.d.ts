import { IShape, BBox } from '../../../../dependents';
import PieBaseLabel, { LabelItem, PieLabelConfig } from './base-label';
export declare const DEFAULT_OFFSET = 16;
export default class PieOuterLabel extends PieBaseLabel {
    /** @override 不能大于0 */
    protected adjustOption(options: PieLabelConfig): void;
    protected getDefaultOptions(): {
        offsetX: number;
        offsetY: number;
        offset: number;
        style: any;
    };
    /** label 碰撞调整 */
    protected layout(labels: IShape[], items: LabelItem[], panel: BBox): void;
    /** labels 碰撞处理（重点算法） */
    private _antiCollision;
    /** 获取label height */
    private getLabelHeight;
}
