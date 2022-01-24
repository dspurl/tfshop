import { IShape } from '@antv/g-base';
interface RobustAbbrevaiteCfg {
    keep?: string[];
    abbreviateBy?: 'start' | 'middle' | 'end';
    unit?: 'k' | 'm' | 'b' | 't' | 'auto';
    decimal?: number;
}
export default function robustAbbrevaite(shape: IShape, option: RobustAbbrevaiteCfg, index: any, cfg: any): void;
export {};
