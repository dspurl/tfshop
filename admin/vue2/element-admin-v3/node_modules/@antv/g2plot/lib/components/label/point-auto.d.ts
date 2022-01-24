import PointLabel from './point';
import { Geometry, IShape } from '../../dependents';
import { Label } from '../../interface/config';
export default class PointAutoLabel<L extends Label = Label> extends PointLabel<L> {
    protected layoutLabels(geometry: Geometry, labels: IShape[]): void;
    /** 对 Labels 排序，排序顺序决定自动布局优先级 */
    protected sortLabels(geometry: Geometry, labels: IShape[]): IShape[];
}
