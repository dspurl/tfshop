import { ViewLayer } from '../..';
interface AxisConfig {
    plot: ViewLayer;
    dim: string;
}
export default class AxisParser {
    config: any;
    protected originConfig: any;
    private plot;
    private dim;
    private localProps;
    private themeConfig;
    constructor(cfg: AxisConfig);
    private init;
    private _styleParser;
    private _needDraw;
    private _lineParser;
    private _gridParser;
    private _tickLineParser;
    private _labelParser;
    private _titleParser;
    private _isVisible;
    private applyThemeConfig;
    protected parseFormatter(labelConfig: any): (text: string, item: any, idx: any) => string;
}
export {};
