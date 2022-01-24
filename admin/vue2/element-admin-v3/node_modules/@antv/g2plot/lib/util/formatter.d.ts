import { Formatter } from '../interface/config';
export declare const combineFormatter: (...formatters: Formatter[]) => (text: string, item: any, idx: any) => string;
export declare const getNoopFormatter: () => (text: string) => string;
export declare const getPrecisionFormatter: (precision?: number) => (text: string) => string;
export declare const getSuffixFormatter: (suffix?: string) => (text: string) => string;
