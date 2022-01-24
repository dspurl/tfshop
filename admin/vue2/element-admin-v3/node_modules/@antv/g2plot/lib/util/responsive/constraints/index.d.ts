/** constraints约束库 */
export interface IConstraint {
    usage: string;
    type: string;
    method: (...args: any) => any;
}
export declare const constraintsLib: {
    elementDist: {
        type: string;
        usage: string;
        expression: (a: any, b: any, cfg?: import("./element-dist").ElementDistCfg) => boolean;
    };
    elementDistVertical: {
        type: string;
        usage: string;
        expression: (a: any, b: any, cfg?: import("./element-dist-vertical").ElementDistVerticalCfg) => boolean;
    };
    elementCollision: {
        type: string;
        usage: string;
        expression: (a: any, b: any) => boolean;
    };
    elementWidth: {
        type: string;
        usage: string;
        expression: (node: any, region: any, cfg?: import("./element-width").ElementWidthCfg) => boolean;
    };
    columnWidth: {
        type: string;
        usage: string;
        expression: (node: any, region: any, cfg?: import("./column-width").ColumnWidthCfg) => number;
    };
    ringThickness: {
        type: string;
        usage: string;
        expression: (node: any, region: any, cfg?: import("./ring-thickness").RingThicknessCfg) => number;
    };
    minRingThickness: {
        type: string;
        usage: string;
        expression: (node: any, region: any) => number;
    };
};
export declare function registerResponsiveConstraint(name: any, constraint: IConstraint): void;
