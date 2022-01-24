import BasePlot, { PlotConfig } from '../../base/plot';
import { WordCloudViewConfig } from './layer';
export interface WordCloudPlotConfig extends PlotConfig {
    container?: HTMLDivElement;
}
export interface WordCloudConfig extends WordCloudViewConfig, WordCloudPlotConfig {
}
export default class WordCloud extends BasePlot<WordCloudConfig> {
    constructor(container: HTMLElement, props: WordCloudConfig);
    createLayers(props: any): void;
}
