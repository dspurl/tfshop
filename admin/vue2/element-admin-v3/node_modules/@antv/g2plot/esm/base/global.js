/** 所有统计图形 */
var GLOBAL_PLOT_MAP = {};
export function registerPlotType(name, ctr) {
    GLOBAL_PLOT_MAP[name.toLowerCase()] = ctr;
}
export function getPlotType(name) {
    return GLOBAL_PLOT_MAP[name.toLowerCase()];
}
//# sourceMappingURL=global.js.map