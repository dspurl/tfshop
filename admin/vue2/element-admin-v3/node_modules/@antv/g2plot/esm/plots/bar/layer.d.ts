import { LayerConfig } from '../../base/layer';
import ViewLayer from '../../base/view-layer';
import ConversionTag from '../../components/conversion-tag';
import { ElementOption, DataItem } from '../../interface/config';
import './theme';
import './component/label';
import './component/label-auto';
import { BarViewConfig } from './interface';
export interface BarLayerConfig extends BarViewConfig, LayerConfig {
}
export default class BaseBarLayer<T extends BarLayerConfig = BarLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): Partial<BarViewConfig>;
    bar: any;
    type: string;
    conversionTag?: ConversionTag;
    beforeInit(): void;
    afterRender(): void;
    protected geometryParser(dim: any, type: any): any;
    protected processData(originData?: DataItem[]): any[];
    protected scale(): void;
    protected coord(): void;
    protected axis(): void;
    protected adjustBar(bar: ElementOption): any;
    protected addGeometry(): void;
    protected animation(): void;
    protected parseEvents(): void;
    protected renderLabel(): void;
    protected geometryTooltip(): void;
    private applyResponsive;
    getLabelOptionsByPosition(position: string): {
        offset: number;
        style?: undefined;
    } | {
        offset: number;
        style: {
            stroke: any;
            lineWidth: number;
        };
    };
}
