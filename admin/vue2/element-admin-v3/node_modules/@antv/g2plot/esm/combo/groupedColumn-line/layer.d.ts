import { LayerConfig } from '../../base/layer';
import ColumnLineLayer, { ColumnLineViewConfig } from '../column-line/layer';
export interface GroupedColumnLineViewConfig extends ColumnLineViewConfig {
    columnGroupField?: string;
}
interface GroupedColumnLineLayerConfig extends GroupedColumnLineViewConfig, LayerConfig {
}
export default class GroupedColumnLineLayer<T extends GroupedColumnLineLayerConfig = GroupedColumnLineLayerConfig> extends ColumnLineLayer<T> {
    static getDefaultOptions(): Partial<GroupedColumnLineLayerConfig>;
    type: string;
    protected requiredField: string[];
    beforeInit(): void;
    protected drawColumn(): void;
    protected customLegend(): void;
    protected getValueByGroupField(): any[];
    protected getMockData(index: number): {}[];
}
export {};
