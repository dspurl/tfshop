import { LayerConfig } from '../../base/layer';
import ViewLayer from '../../base/view-layer';
import { ElementOption } from '../../interface/config';
import ConversionTag from '../../components/conversion-tag';
import './apply-responsive/theme';
import './component/label';
import './component/label-auto';
import './theme';
import { DataItem } from '../../interface/config';
import { ColumnViewConfig } from './interface';
export interface ColumnLayerConfig extends ColumnViewConfig, LayerConfig {
}
export default class BaseColumnLayer<T extends ColumnLayerConfig = ColumnLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): any;
    column: any;
    type: string;
    conversionTag?: ConversionTag;
    beforeInit(): void;
    afterRender(): void;
    protected geometryParser(dim: any, type: any): any;
    protected processData(originData?: DataItem[]): any[];
    protected scale(): void;
    protected coord(): void;
    protected adjustColumn(column: ElementOption): void;
    protected addGeometry(): void;
    protected geometryTooltip(): void;
    protected animation(): void;
    protected parseEvents(): void;
    protected renderLabel(): void;
    private applyResponsive;
}
