import PieInnerLabel from './inner-label';
import PieOuterLabel from './outer-label';
import PieOuterCenterLabel from './outer-center-label';
var PieLabels = {
    inner: PieInnerLabel,
    outer: PieOuterLabel,
    'outer-center': PieOuterCenterLabel,
};
export function getPieLabel(type) {
    if (!PieLabels[type]) {
        console.warn("this label " + type + " is not registered");
        return;
    }
    return PieLabels[type];
}
//# sourceMappingURL=index.js.map