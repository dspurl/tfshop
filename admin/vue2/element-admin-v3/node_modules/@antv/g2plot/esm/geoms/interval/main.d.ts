import ElementParser from '../base';
export default class IntervalParser extends ElementParser {
    init(): void;
    parseColor(): void;
    parseSize(sizeProps: any): void;
    parseStyle(styleProps: any): void;
    private _getSizeProps;
    private _getStyleProps;
    private _getColorMappingField;
    private _needParserColor;
}
