import { LayerConfig } from '../../base/layer';
import BaseBarLayer from '../bar/layer';
import { BarViewConfig } from '../bar/interface';
import { RangeBarLabelConfig } from './component/label';
export interface RangeBarViewConfig extends BarViewConfig {
    label?: RangeBarLabelConfig;
}
export interface RangeBarLayerConfig extends RangeBarViewConfig, LayerConfig {
}
export default class RangeBarLayer extends BaseBarLayer<RangeBarLayerConfig> {
    static getDefaultOptions(): Partial<RangeBarViewConfig>;
    type: string;
    afterRender(): void;
    protected renderLabel(): void;
    protected animation(): void;
}
