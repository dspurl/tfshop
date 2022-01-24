import { Element, IShape } from '../../../dependents';
import BaseLabel from '../../../components/label/base';
import BBox from '../../../util/bbox';
import { TextStyle } from '../../../interface/config';
import { IBarLabel } from '../interface';
export default class BarLabel<L extends IBarLabel = IBarLabel> extends BaseLabel<L> {
    protected getLabelItemAttrs(element: Element, index: number): TextStyle;
    protected adjustLabel(label: IShape, element: Element): void;
    protected getDefaultOptions(): any;
    protected getValue(element: Element): number | undefined | null;
    protected getPosition(element: Element): {
        x: number;
        y: number;
    };
    protected getTextFill(element: Element): any;
    protected getTextStroke(element: Element): any;
    protected getTextAlign(element: Element): any;
    protected getTextBaseline(): string;
    protected getElementShapeBBox(element: Element): BBox;
    protected getLabelOffset(): {
        x: number;
        y: number;
    };
}
