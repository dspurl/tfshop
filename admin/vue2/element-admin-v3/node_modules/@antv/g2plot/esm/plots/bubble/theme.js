import { registerTheme } from '../../theme';
var POINT_ACTIVE_STYLE = function (style) {
    var stroke = style.stroke || '#000';
    var fillOpacity = style.fillOpacity || style.opacity || 0.95;
    return {
        stroke: stroke,
        fillOpacity: fillOpacity,
    };
};
var POINT_SELECTED_STYLE = function (style) {
    var stroke = style.stroke || '#000';
    var lineWidth = style.lineWidth || 2;
    return {
        stroke: stroke,
        lineWidth: lineWidth,
    };
};
var POINT_INACTIVE_STYLE = function (style) {
    var fillOpacity = style.fillOpacity || style.opacity || 0.3;
    return {
        fillOpacity: fillOpacity,
    };
};
registerTheme('bubble', {
    pointStyle: {
        normal: {},
        active: POINT_ACTIVE_STYLE,
        selected: POINT_SELECTED_STYLE,
        inactive: POINT_INACTIVE_STYLE,
    },
});
//# sourceMappingURL=theme.js.map