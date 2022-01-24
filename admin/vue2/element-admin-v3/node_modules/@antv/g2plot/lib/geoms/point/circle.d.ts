import ElementParser from '../base';
export default class CircleParser extends ElementParser {
    init(): void;
    parseColor(): void;
    parseSize(): void;
    parseShape(shapeName: any): void;
    parseStyle(): void;
    private _parseColor;
}
