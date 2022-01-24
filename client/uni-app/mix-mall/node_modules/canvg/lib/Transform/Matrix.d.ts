import { RenderingContext2D } from '../types';
import Document from '../Document';
import Point from '../Point';
import { ITransform } from './types';
export default class Matrix implements ITransform {
    type: string;
    protected matrix: number[];
    constructor(_: Document, matrix: string);
    apply(ctx: RenderingContext2D): void;
    unapply(ctx: RenderingContext2D): void;
    applyToPoint(point: Point): void;
}
//# sourceMappingURL=Matrix.d.ts.map