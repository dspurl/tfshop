import { IShape, Geometry, Element } from '../../../dependents';
import ColumnLabel from './label';
import { IColumnAutoLabel } from '../interface';
/** 自动模式的 Column 数据标签，会根据图形和数据标签自动优化数据标签布局和样式等 */
export default class ColumnAutoLabel extends ColumnLabel<IColumnAutoLabel> {
    protected getPosition(element: Element): {
        x: number;
        y: number;
    };
    /** 默认的 fill 取自用户配置或主题配置 */
    protected getTextFill(element: Element): string;
    /** 默认不描边 */
    protected getTextStroke(element: Element): any;
    /** 默认无处理：在 layout 阶段处理 */
    protected adjustLabel(label: IShape, element: Element): void;
    /** 自动布局所有的数据标签 */
    protected layoutLabels(geometry: Geometry, labels: IShape[]): void;
    /** 判断是否可以把数据标签放置在柱子内部 */
    protected shouldInShapeLabels(labels: IShape[]): boolean;
    /** 内置数据标签，并自动设置颜色描边等属性 */
    protected inShapeLabels(geometry: Geometry, labels: IShape[]): void;
    /** 数据标签防重叠抽样 */
    protected autoHideLabels(geometry: Geometry, labels: IShape[]): void;
    /** 抽样数据标签，设置最大数量的数据标签，其他的统一隐藏 */
    private filterLabels;
}
