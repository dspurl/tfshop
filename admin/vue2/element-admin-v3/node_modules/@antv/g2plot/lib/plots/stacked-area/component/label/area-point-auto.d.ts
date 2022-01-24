import { Geometry, IShape } from '../../../../dependents';
import AreaPointAutoLabel from '../../../area/component/label/area-point-auto';
export default class StackedAreaPointAutoLabel extends AreaPointAutoLabel {
    /** 对堆积面积使用自定义的排序 */
    protected sortLabels(geometry: Geometry, labels: IShape[]): IShape[];
}
