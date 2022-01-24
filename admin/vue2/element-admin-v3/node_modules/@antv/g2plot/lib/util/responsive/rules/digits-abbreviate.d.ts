import { IShape } from '@antv/g-base';
interface DigitsAbbreviateCfg {
    unit?: 'k' | 'm' | 'b' | 't' | 'auto';
    formatter?: (val: number) => string;
    decimal?: number;
}
export default function digitsAbbreviate(shape: IShape, option: DigitsAbbreviateCfg, index: any, cfg: any): void;
export {};
