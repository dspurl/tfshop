// components parser
import AxisParser from './axis/parser';
import GuideLine from './guide-line';
import LabelParser from './label/parser';
// components state methods
import axisState from './axis/state';
import labelState from './label/state';
import tooltipState from './tooltip/state';
var COMPONENT_MAPPER = {
    axis: AxisParser,
    label: LabelParser,
    guideLine: GuideLine,
};
var STATE_MAPPER = {
    tooltip: tooltipState,
    label: labelState,
    axis: axisState,
};
export function getComponent(name, cfg) {
    var Components = COMPONENT_MAPPER[name];
    return new Components(cfg).config;
}
export function getComponentStateMethod(name, type) {
    return STATE_MAPPER[name][type];
}
//# sourceMappingURL=factory.js.map