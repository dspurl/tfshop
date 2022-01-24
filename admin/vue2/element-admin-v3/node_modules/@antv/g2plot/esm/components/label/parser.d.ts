import { Label } from '../../interface/config';
import { LooseMap } from '../../interface/types';
export default class LabelParser {
    config: LooseMap;
    protected plot: any;
    protected originConfig: Label;
    constructor(cfg: any);
    getConfig(): LooseMap<any>;
    protected init(cfg: any): void;
    protected parseCallBack(val: any): LooseMap<any>;
    protected parseOffset(props: any, config: any): void;
    protected parseFormatter(config: LooseMap): void;
}
