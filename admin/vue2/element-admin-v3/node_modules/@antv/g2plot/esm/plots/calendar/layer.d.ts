import { DataItem, LayerConfig, ViewConfig } from '../..';
import ViewLayer from '../../base/view-layer';
/** 日历图配置定义 */
export interface CalendarViewConfig extends ViewConfig {
    /** 字段信息 */
    readonly dateField: string;
    /** 映射的颜色值字段 */
    readonly valueField: string;
    /** 日历图的起止时间：[2019-10, 2020-03] */
    readonly dateRange?: string[];
    readonly colors?: string[] | string;
    readonly months?: string[];
    readonly weeks?: string[];
}
interface CalendarLayerConfig extends CalendarViewConfig, LayerConfig {
}
/**
 * 日历图
 */
export default class CalendarLayer extends ViewLayer<CalendarLayerConfig> {
    type: string;
    static getDefaultOptions(): Partial<CalendarLayerConfig>;
    /**
     * 复写父类的数据处理类，主要完成：
     * 1. 生成 polygon 的 x y field（虚拟的，无需用户传入）
     *
     * @param data
     */
    protected processData(data?: DataItem[]): DataItem[] | undefined;
    protected addGeometry(): void;
    protected geometryTooltip(geomConfig: any): void;
    private extractLabel;
    /**
     * 写入坐标系配置，默认增加镜像
     */
    protected coord(): void;
    /**
     * 无需 geometry parser，直接使用 polygon 即可
     */
    protected geometryParser(): string;
    protected axis(): void;
    protected scale(): void;
    protected parseEvents(): void;
}
export {};
