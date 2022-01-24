import { ElementOption } from '../interface/config';
export default class ElementParser {
    plot: any;
    type: string;
    config: ElementOption;
    style: any;
    private positionFields;
    private widthRatio;
    constructor(cfg: any);
    init(): void;
}
