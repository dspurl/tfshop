import ElementParser from '../base';
declare type PointShape = string | {
    fields?: [];
    callback: () => string;
};
export default class GuidePointParser extends ElementParser {
    init(): void;
    parseColor(): void;
    parseSize(): void;
    parseShape(shapeCfg: PointShape): void;
    parseStyle(): void;
    private _parseColorByField;
    private _parseColor;
    private _needParseAttribute;
    private _getColorMappingField;
}
export {};
