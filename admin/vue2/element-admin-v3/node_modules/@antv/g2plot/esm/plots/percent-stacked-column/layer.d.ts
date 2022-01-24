import { LayerConfig } from '../../base/layer';
import StackedColumn, { StackedColumnViewConfig } from '../stacked-column/layer';
import { DataItem } from '../../interface/config';
export declare type PercentStackedColumnViewConfig = StackedColumnViewConfig;
export interface PercentStackedColumnLayerConfig extends PercentStackedColumnViewConfig, LayerConfig {
}
export default class PercentStackedColumnLayer extends StackedColumn<PercentStackedColumnLayerConfig> {
    static getDefaultOptions(): any;
    type: string;
    protected processData(originData?: DataItem[]): DataItem[];
    protected scale(): void;
}
