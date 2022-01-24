declare type Input = Record<string | number | symbol, any>;
declare type Merger = <T extends Input, K extends keyof T>(obj: T, key: keyof T, value: T[K], namespace: string) => any;
declare type MergeObjects<Destination extends Input, Defaults extends Input> = Destination extends Defaults ? Destination : Omit<Destination, keyof Destination & keyof Defaults> & Omit<Defaults, keyof Destination & keyof Defaults> & {
    -readonly [Key in keyof Destination & keyof Defaults]: Destination[Key] extends null ? Defaults[Key] extends null ? null : Defaults[Key] : Defaults[Key] extends null ? Destination[Key] : Merge<Destination[Key], Defaults[Key]>;
};
declare type DefuFn = <Source extends Input, Defaults extends Input>(source: Source, ...defaults: Defaults[]) => MergeObjects<Source, Defaults>;
interface Defu {
    <Source extends Input, Defaults extends Input>(source: Source, ...defaults: Defaults[]): MergeObjects<Source, Defaults>;
    fn: DefuFn;
    arrayFn: DefuFn;
    extend(merger?: Merger): DefuFn;
}
declare type MergeArrays<Destination, Source> = Destination extends Array<infer DestinationType> ? Source extends Array<infer SourceType> ? Array<DestinationType | SourceType> : Source | Array<DestinationType> : Source | Destination;
declare type Merge<Destination extends Input, Defaults extends Input> = Destination extends null ? Defaults extends null ? null : Defaults : Defaults extends null ? Destination : Destination extends Array<any> ? Defaults extends Array<any> ? MergeArrays<Destination, Defaults> : Destination | Defaults : Destination extends Function ? Destination | Defaults : Destination extends RegExp ? Destination | Defaults : Destination extends Promise<any> ? Destination | Defaults : Defaults extends Function ? Destination | Defaults : Defaults extends RegExp ? Destination | Defaults : Defaults extends Promise<any> ? Destination | Defaults : Destination extends Input ? Defaults extends Input ? MergeObjects<Destination, Defaults> : Destination | Defaults : Destination | Defaults;

declare const defu: Defu;

export default defu;
