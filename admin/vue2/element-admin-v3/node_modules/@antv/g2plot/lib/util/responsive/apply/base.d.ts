export default abstract class ApplyResponsive {
    plot: any;
    type: string;
    responsiveTheme: any;
    constructor(cfg: any);
    protected init(): void;
    protected abstract shouldApply(): boolean;
    protected abstract apply(): void;
    protected abstract getType(): string;
}
