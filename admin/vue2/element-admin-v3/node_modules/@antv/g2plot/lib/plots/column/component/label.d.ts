import { IShape, Element } from '../../../dependents';
import BaseLabel from '../../../components/label/base';
import { TextStyle } from '../../../interface/config';
import BBox from '../../../util/bbox';
import { IColumnLabel } from '../interface';
export default class ColumnLabel<L extends IColumnLabel = IColumnLabel> extends BaseLabel<L> {
    protected getLabelItemAttrs(element: Element, index: number): TextStyle;
    protected getDefaultOptions(): any;
    protected adjustLabel(label: IShape, element: Element): void;
    protected getValue(element: Element): number | undefined | null;
    protected getPosition(element: Element): {
        x: number;
        y: number;
    };
    protected getTextFill(element: Element): any;
    protected getTextStroke(element: Element): any;
    protected getElementShapeBBox(element: Element): BBox;
    protected getTextAlign(): string;
    protected getTextBaseLine(): string;
    protected getLabelOffset(): {
        x: number;
        y: number;
    };
}
