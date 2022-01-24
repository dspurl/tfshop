import { LayerConfig } from '../../base/layer';
import StackedBar, { StackedBarViewConfig } from '../stacked-bar/layer';
import { DataItem } from '../../interface/config';
export declare type PercentStackedBarViewConfig = StackedBarViewConfig;
export interface PercentStackedBarLayerConfig extends PercentStackedBarViewConfig, LayerConfig {
}
export default class PercentStackedBarLayer extends StackedBar<PercentStackedBarLayerConfig> {
    static getDefaultOptions(): any;
    type: string;
    protected processData(originData?: DataItem[]): DataItem[];
    protected scale(): void;
}
