import { IShape } from '@antv/g-base';
interface TextAbbreviateCfg {
    abbreviateBy?: 'start' | 'middle' | 'end';
}
export default function textAbbreviate(shape: IShape, option: TextAbbreviateCfg): void;
export {};
