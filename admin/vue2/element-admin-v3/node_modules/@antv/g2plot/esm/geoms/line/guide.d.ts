import LineParser from './main';
export default class GuideLineParser extends LineParser {
    init(): void;
    parseSize(): void;
    parseColor(): void;
    parseStyle(): void;
    private _needParseAttribute;
    private _getColorMappingField;
}
