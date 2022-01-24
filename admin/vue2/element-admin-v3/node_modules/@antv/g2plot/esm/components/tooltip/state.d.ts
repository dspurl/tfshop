declare function onActive(plot: any, condition: any): void;
declare function onDisable(plot: any, condition: any): void;
declare const _default: {
    active: typeof onActive;
    selected: typeof onActive;
    disable: typeof onDisable;
};
export default _default;
