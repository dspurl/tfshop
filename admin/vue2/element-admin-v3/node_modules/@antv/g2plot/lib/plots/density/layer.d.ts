import { LayerConfig } from '../../base/layer';
import Area from '../area/layer';
import { AreaViewConfig } from '../area/interface';
import { DataItem } from '../../interface/config';
export interface DensityViewConfig extends AreaViewConfig {
    binField: string;
    binWidth?: number;
    binNumber?: number;
    kernel?: 'uniform' | 'triangle' | 'epanechnikov' | 'quartic' | 'triweight' | 'gaussian' | 'cosinus';
}
export interface DensityLayerConfig extends DensityViewConfig, LayerConfig {
}
export default class DensityLayer<T extends DensityLayerConfig = DensityLayerConfig> extends Area<T> {
    type: string;
    init(): void;
    protected processData(originData?: DataItem[]): any[];
    private kernelDensityEstimator;
}
