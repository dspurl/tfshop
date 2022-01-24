import BasePlot, { PlotConfig } from '../../base/plot';
import BulletLayer, { BulletViewConfig } from './layer';
export interface BulletConfig extends BulletViewConfig, PlotConfig {
}
export default class Bullet extends BasePlot<BulletConfig> {
    static getDefaultOptions: typeof BulletLayer.getDefaultOptions;
    createLayers(props: any): void;
}
