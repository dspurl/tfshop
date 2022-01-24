import { RenderingContext2D } from '../types';
import Point from '../Point';
import BoundingBox from '../BoundingBox';
import PathParser from '../PathParser';
import Document from './Document';
import RenderedElement from './RenderedElement';
export declare type Marker = [Point, number];
export default class PathElement extends RenderedElement {
    type: string;
    readonly pathParser: PathParser;
    constructor(document: Document, node: HTMLElement, captureTextNodes?: boolean);
    path(ctx?: RenderingContext2D): BoundingBox;
    getBoundingBox(_?: RenderingContext2D): BoundingBox;
    getMarkers(): Marker[];
    renderChildren(ctx: RenderingContext2D): void;
    protected pathM(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathL(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathH(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathV(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathC(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathS(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathQ(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathT(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathA(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
    protected pathZ(ctx: RenderingContext2D, boundingBox: BoundingBox): void;
}
//# sourceMappingURL=PathElement.d.ts.map