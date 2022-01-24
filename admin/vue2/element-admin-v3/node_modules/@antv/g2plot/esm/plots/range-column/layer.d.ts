import { LayerConfig } from '../../base/layer';
import BaseColumnLayer from '../column/layer';
import { ColumnViewConfig } from '../column/interface';
import { RangeColumnLabelConfig } from './component/label';
export interface RangeColumnViewConfig extends ColumnViewConfig {
    label?: RangeColumnLabelConfig;
}
export interface RangeColumnLayerConfig extends RangeColumnViewConfig, LayerConfig {
}
export default class RangeColumnLayer extends BaseColumnLayer<RangeColumnLayerConfig> {
    static getDefaultOptions(): Partial<RangeColumnViewConfig>;
    type: string;
    afterRender(): void;
    protected animation(): void;
    protected renderLabel(): void;
}
