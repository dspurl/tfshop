import { LayerConfig } from '../../base/layer';
import ViewLayer, { ViewConfig } from '../../base/view-layer';
import { TreemapLabelConfig } from './components/label';
import { GraphicStyle, IInteractions } from '../../interface/config';
import { IDrillDown } from './interaction/drillDown';
declare type TreemapInteraction = {
    type: 'drilldown';
    cfg: IDrillDown;
} | IInteractions;
export interface TreemapViewConfig extends ViewConfig {
    data: any;
    maxLevel?: number;
    colorField: string;
    colors?: string[];
    rectStyle?: GraphicStyle;
    label: TreemapLabelConfig;
    interactions?: TreemapInteraction[];
}
export interface TreemapLayerConfig extends TreemapViewConfig, LayerConfig {
}
export default class TreemapLayer<T extends TreemapLayerConfig = TreemapLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): Partial<TreemapLayerConfig>;
    type: string;
    rootData: any;
    rect: any;
    private isDrilldown;
    beforeInit(): void;
    afterRender(): void;
    protected geometryParser(): string;
    getTreemapData(data: any, level?: any): any[];
    protected processData(): any;
    protected coord(): void;
    protected addGeometry(): void;
    protected applyInteractions(): void;
    protected animation(): void;
    protected parseEvents(): void;
    private recursive;
    private getAllNodes;
    private fillColorField;
    private getLabelHeight;
    private isLeaf;
    private isNested;
    private adjustStyleByDepth;
}
export {};
