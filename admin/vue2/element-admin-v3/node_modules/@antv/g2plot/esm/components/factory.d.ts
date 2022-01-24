import AxisParser from './axis/parser';
import GuideLine from './guide-line';
import LabelParser from './label/parser';
declare type FirstArgs<T> = T extends new (first: infer U) => any ? U : never;
declare const COMPONENT_MAPPER: {
    axis: typeof AxisParser;
    label: typeof LabelParser;
    guideLine: typeof GuideLine;
};
export declare function getComponent<K extends keyof typeof COMPONENT_MAPPER>(name: K, cfg: FirstArgs<typeof COMPONENT_MAPPER[K]>): any;
export declare function getComponentStateMethod(name: any, type: any): any;
export {};
