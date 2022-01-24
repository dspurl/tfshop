export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<RecursivePartial<U>> : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export declare type MarginPadding = [number, number, number, number];
export interface LooseMap<T = any> {
    [key: string]: T;
}
export declare type Maybe<T> = T | undefined | null;
