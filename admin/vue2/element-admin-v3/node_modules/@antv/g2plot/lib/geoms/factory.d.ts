/**
 * 将element的配置逻辑拆离出来，并将每类element细分为主体图形、辅助图形、mini图形三种
 * 这样也方便未来更灵活的调用和组装g2的element模块
 */
declare const GEOMETRY_MAP: {
    area: {
        main: typeof import("./area/main").default;
        mini: typeof import("./area/mini").default;
    };
    line: {
        main: typeof import("./line/main").default;
        guide: typeof import("./line/guide").default;
        mini: typeof import("./line/mini").default;
    };
    point: {
        guide: typeof import("./point/guide").default;
        circle: typeof import("./point/circle").default;
    };
    interval: {
        main: typeof import("./interval/main").default;
    };
};
declare type FirstCtrParam<T> = T extends new (first: infer R) => any ? R : never;
declare type MapType = typeof GEOMETRY_MAP;
export declare function getGeom<T extends keyof MapType, U extends keyof MapType[T]>(name: T, type: U, cfg: FirstCtrParam<MapType[T][U]>): any;
export {};
