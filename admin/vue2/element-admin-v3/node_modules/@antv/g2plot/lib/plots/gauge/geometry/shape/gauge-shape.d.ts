import { GaugeViewConfig, GaugeAxis, GaugePivot } from '../../interface';
/**
 * 仪表盘指针图形
 * 指针主体由梯形和一大一小圆形组成，
 * 中心处由灰色圆底和小白圆加以装饰
 */
export declare class GaugeShape {
    uid: any;
    ringRadius: number;
    center: any;
    group: any;
    options: GaugeViewConfig;
    axis: GaugeAxis;
    pivot: GaugePivot;
    type: string;
    constructor(uid: any);
    setOption(type: any, options: any): void;
    render(): void;
}
