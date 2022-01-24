import ApplyResponsive from './base';
export default class ApplyResponsiveAxis extends ApplyResponsive {
    private dim;
    private axisInstance;
    protected init(): void;
    protected shouldApply(): boolean;
    protected apply(): void;
    protected getType(): any;
    private getAxisInstance;
    private updateTicks;
}
