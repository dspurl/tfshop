import { ViewConfig } from '../view-layer';
export default class ThemeController<T extends ViewConfig = ViewConfig> {
    /**
     * 获取指定的全局theme
     * @param theme
     */
    static getGlobalTheme(theme: string | object): any;
    /**
     * 通过 theme 和图表类型，获取当前 plot 对应的主题
     * @param props
     * @param type
     */
    getPlotTheme(props: T, type: string): any;
    /**
     * 获取转化成 G2 的结构主题
     * @param props
     * @param type
     */
    getTheme(props: T, type: string): any;
    getResponsiveTheme(type: string): any;
}
