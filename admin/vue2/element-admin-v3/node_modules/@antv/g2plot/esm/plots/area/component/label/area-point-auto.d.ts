import PointAutoLabel from '../../../../components/label/point-auto';
import { Geometry, IShape } from '../../../../dependents';
import { IAreaPointAutoLabel } from '../../interface';
export default class AreaPointAutoLabel extends PointAutoLabel<IAreaPointAutoLabel> {
    protected layoutLabels(geometry: Geometry, labels: IShape[]): void;
    protected adjustAreaLabelsStyle(labels: IShape[]): void;
}
