import BarAutoLabel from '../../bar/component/label-auto';
import { IShape } from '../../../dependents';
/** 自动模式的 StackedBar 数据标签，会根据图形和数据标签自动优化数据标签布局和样式等 */
export default class StackedBarAutoLabel extends BarAutoLabel {
    /** 堆积柱形图全部内置 */
    protected shouldInShapeLabels(labels: IShape[]): boolean;
}
