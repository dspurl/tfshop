import BasePlot, { PlotConfig } from '../../base/plot';
import CalenderLayer from './layer';
import './shape';
export declare type CalendarConfig = PlotConfig;
/**
 * 日历图
 */
export default class Calendar extends BasePlot<any> {
    static getDefaultOptions: typeof CalenderLayer.getDefaultOptions;
    /**
     * 复写父类方法
     * @param props
     */
    protected createLayers(props: any): void;
}
