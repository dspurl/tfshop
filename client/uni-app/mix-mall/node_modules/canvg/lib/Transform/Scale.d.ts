import { RenderingContext2D } from '../types';
import Document from '../Document';
import Point from '../Point';
export default class Scale {
    type: string;
    private readonly scale;
    constructor(_: Document, scale: string);
    apply(ctx: RenderingContext2D): void;
    unapply(ctx: RenderingContext2D): void;
    applyToPoint(point: Point): void;
}
//# sourceMappingURL=Scale.d.ts.map