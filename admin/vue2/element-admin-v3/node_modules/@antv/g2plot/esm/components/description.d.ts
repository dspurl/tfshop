import { IGroup, IShape } from '../dependents';
import ViewLayer from '../base/view-layer';
import BBox from '../util/bbox';
interface TextConfig {
    leftMargin: number;
    topMargin: number;
    rightMargin: number;
    text: string;
    style: any;
    wrapperWidth: number;
    container: IGroup;
    theme: any;
    index: number;
    plot: ViewLayer;
    name: string;
    alignTo?: 'left' | 'right' | 'middle';
}
/**
 * 图表的文字描述，一般用于生成图表的标题和副标题
 */
export default class TextDescription {
    shape: IShape;
    position: string;
    name: string;
    destroyed: boolean;
    private container;
    private topMargin;
    private leftMargin;
    private rightMargin;
    private wrapperWidth;
    private alignTo;
    private text;
    private style;
    private index;
    private plot;
    constructor(cfg: TextConfig);
    getBBox(): BBox | null;
    clear(): void;
    destroy(): void;
    private init;
    protected getPosition(): {
        x: number;
        y: number;
    };
    protected getTextAlign(): "left" | "right" | "center";
    /**
     * 当text过长时，默认换行
     * 1. 注意初始text带换行符的场景
     */
    private textWrapper;
}
export {};
