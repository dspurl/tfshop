import AreaLineLabel from './label/line-label';
import AreaLabel from './label/area-label';
var ComponentsInfo = {
    lineLabel: { Ctr: AreaLineLabel },
    areaLabel: { Ctr: AreaLabel },
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