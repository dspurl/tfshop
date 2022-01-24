import HeatmapBackground from './background';
import HeatmapLegend from './legend';
var ComponentsInfo = {
    background: { Ctr: HeatmapBackground },
    legend: { Ctr: HeatmapLegend, padding: 'outer' },
};
export function getPlotComponents(plot, type, cfg) {
    if (plot.options[type] && plot.options[type].visible) {
        var componentInfo = ComponentsInfo[type];
        var component = new componentInfo.Ctr(cfg);
        if (componentInfo.padding) {
            plot.paddingController.registerPadding(component, componentInfo.padding);
        }
        return component;
    }
}
//# sourceMappingURL=index.js.map