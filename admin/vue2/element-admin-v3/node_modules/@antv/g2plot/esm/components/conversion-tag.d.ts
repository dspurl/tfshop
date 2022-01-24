import { View } from '@antv/g2';
export interface ConversionTagOptions {
    visible: boolean;
    size?: number;
    spacing?: number;
    offset?: number;
    arrow?: ArrowOptions;
    value?: ValueOptions;
    animation?: any;
    transpose?: boolean;
}
interface ArrowOptions {
    visible: boolean;
    headSize?: number;
    style?: any;
}
interface ValueOptions {
    visible: boolean;
    style?: any;
    formatter?: (valueUpper: any, valueLower: any) => string;
}
export interface ConversionTagConfig extends ConversionTagOptions {
    view: View;
    field: string;
}
export default class ConversionTag {
    static getDefaultOptions({ transpose }: ConversionTagConfig): ConversionTagOptions;
    private view;
    private container;
    private transpose?;
    private field;
    private size;
    private offset;
    private spacing;
    private arrow;
    private value;
    private animation;
    constructor(cfg: ConversionTagConfig);
    private _init;
    draw(): void;
    clear(): void;
    destroy(): void;
    private _drawTag;
    private _drawTagArrow;
    private _drawTagValue;
    private _fadeInTagShape;
}
export {};
