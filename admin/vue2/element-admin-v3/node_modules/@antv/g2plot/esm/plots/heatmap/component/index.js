import MatrixLabel from './label';
import MatrixLegend from './legend';
var ComponentsInfo = {
    label: { Ctr: MatrixLabel },
    legend: { Ctr: MatrixLegend, padding: 'outer' },
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