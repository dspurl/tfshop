import { LayerConfig } from '../../base/layer';
import Column from '../column/layer';
import { ColumnViewConfig } from '../column/interface';
import { DataItem } from '../../interface/config';
export interface HistogramViewConfig extends ColumnViewConfig {
    binField: string;
    binWidth?: number;
    binNumber?: number;
}
export interface HistogramLayerConfig extends HistogramViewConfig, LayerConfig {
}
export default class HistogramLayer extends Column<HistogramLayerConfig> {
    type: string;
    init(): void;
    protected processData(originData?: DataItem[]): any[];
    protected scale(): void;
    private getBin;
}
