import { LayerConfig } from '../../base/layer';
import ColumnLineLayer, { ColumnLineViewConfig } from '../column-line/layer';
export interface StackedColumnLineViewConfig extends ColumnLineViewConfig {
    columnStackField?: string;
}
interface StackedColumnLineLayerConfig extends StackedColumnLineViewConfig, LayerConfig {
}
export default class StackedColumnLineLayer<T extends StackedColumnLineLayerConfig = StackedColumnLineLayerConfig> extends ColumnLineLayer<T> {
    static getDefaultOptions(): Partial<StackedColumnLineLayerConfig>;
    type: string;
    protected requiredField: string[];
    beforeInit(): void;
    protected drawColumn(): void;
    protected customLegend(): void;
    protected getValueByStackField(): any[];
    protected getUnCheckedValue(): any[];
    protected getMockData(index: number): {}[];
}
export {};
