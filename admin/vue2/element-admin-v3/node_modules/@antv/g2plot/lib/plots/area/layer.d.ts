import { LayerConfig } from '../../base/layer';
import ViewLayer from '../../base/view-layer';
import { ElementOption } from '../../interface/config';
import './component/label/area-point';
import './component/label/area-point-auto';
import './theme';
import { AreaViewConfig } from './interface';
export interface AreaLayerConfig extends AreaViewConfig, LayerConfig {
}
export default class AreaLayer<T extends AreaLayerConfig = AreaLayerConfig> extends ViewLayer<T> {
    static getDefaultOptions(): any;
    line: any;
    point: any;
    area: any;
    type: string;
    beforeInit(): void;
    afterRender(): void;
    protected geometryParser(dim: any, type: any): any;
    protected scale(): void;
    protected coord(): any;
    protected addGeometry(): void;
    protected adjustArea(area: ElementOption): void;
    protected adjustLine(line?: ElementOption): void;
    protected adjustPoint(point?: ElementOption): void;
    protected addLine(): void;
    protected addPoint(): void;
    protected renderLabel(): void;
    protected animation(): void;
    protected label(): void;
    protected geometryTooltip(): void;
    protected parseEvents(): void;
    private applyResponsive;
}
