import { IShape } from '../../../../dependents';
import PieBaseLabel, { LabelItem, PieLabelConfig } from './base-label';
export declare function percent2Number(value: string): number;
export default class PieInnerLabel extends PieBaseLabel {
    /** @override 不能大于0 */
    protected adjustOption(options: PieLabelConfig): void;
    protected adjustItem(item: LabelItem): void;
    /** @override 不绘制拉线 */
    protected drawLines(): void;
    protected layout(labels: IShape[], shapeInfos: LabelItem[]): void;
    protected getDefaultOptions(): {
        offsetX: number;
        offsetY: number;
        offset: string;
        style: any;
    };
    /** label 碰撞调整 */
    protected resolveCollision(label: IShape, prev: IShape, shapeInfo: LabelItem): void;
}
