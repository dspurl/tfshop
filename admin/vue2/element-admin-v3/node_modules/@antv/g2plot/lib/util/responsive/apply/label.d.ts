import ApplyResponsive from './base';
export default class ApplyResponsiveLabel extends ApplyResponsive {
    protected shouldApply(): boolean;
    protected apply(): void;
    protected getType(): any;
}
