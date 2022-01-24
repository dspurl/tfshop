import { LayerConfig } from '../../base/layer';
import ViewLayer, { ViewConfig } from '../../base/view-layer';
import '../../geoms/heatmap/linear';
import { HeatmapLegendConfig } from './components/legend';
import { HeatmapBackgroundConfig } from './components/background';
import { GraphicStyle } from '../../interface/config';
export interface DensityHeatmapViewConfig extends ViewConfig {
    colorField: string;
    radius?: number;
    intensity?: number;
    point?: {
        visible?: boolean;
        shape?: string;
        size?: number;
        color?: string;
        style?: GraphicStyle;
    };
    legend?: HeatmapLegendConfig;
    background?: HeatmapBackgroundConfig;
}
export interface DensityHeatmapLayerConfig extends DensityHeatmapViewConfig, LayerConfig {
}
export default class DensityHeatmapLayer<T extends DensityHeatmapLayerConfig = DensityHeatmapLayerConfig> extends ViewLayer<T> {
    type: string;
    protected plotComponents: any[];
    static getDefaultOptions(): any;
    afterRender(): void;
    destroy(): void;
    protected scale(): void;
    protected coord(): void;
    protected geometryParser(): string;
    protected addGeometry(): void;
    protected addPoint(): void;
    protected extractLabel(): any;
    protected legend(): void;
    protected geometryTooltip(config: any): void;
    protected parseEvents(): void;
    protected renderPlotComponents(): void;
}
