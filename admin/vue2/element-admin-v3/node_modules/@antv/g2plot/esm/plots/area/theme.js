import { registerTheme } from '../../theme';
var AREA_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity };
};
var AREA_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
var LINE_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity };
};
var LINE_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
var LINE_SELECTED_STYLE = function (style) {
    var lineWidth = style.lineWidth || 1;
    return { lineWidth: lineWidth + 2 };
};
var POINT_ACTIVE_STYLE = function (style) {
    var color = style.fill || style.fillStyle;
    var radius = style.size || style.radius;
    return {
        radius: radius + 1,
        shadowBlur: radius,
        shadowColor: color,
        stroke: color,
        strokeOpacity: 1,
        lineWidth: 1,
    };
};
var POINT_SELECTED_STYLE = function (style) {
    var color = style.fill || style.fillStyle;
    var radius = style.size || style.radius;
    return {
        radius: radius + 2,
        shadowBlur: radius,
        shadowColor: color,
        stroke: color,
        strokeOpacity: 1,
        lineWidth: 2,
    };
};
var POINT_DISABLED_STYLE = function (style) {
    var opacity = style.opacity || style.fillOpacity || 1;
    return { opacity: opacity * 0.5 };
};
export var DEFAULT_AREA_THEME = {
    areaStyle: {
        normal: {},
        active: AREA_ACTIVE_STYLE,
        disable: AREA_DISABLE_STYLE,
        selected: { lineWidth: 1, stroke: '#333333' },
    },
    lineStyle: {
        normal: {},
        active: LINE_ACTIVE_STYLE,
        disable: LINE_DISABLE_STYLE,
        selected: LINE_SELECTED_STYLE,
    },
    pointStyle: {
        normal: {},
        active: POINT_ACTIVE_STYLE,
        disable: POINT_DISABLED_STYLE,
        selected: POINT_SELECTED_STYLE,
    },
    label: {
        darkStyle: {
            fill: '#2c3542',
            stroke: '#ffffff',
            fillOpacity: 0.85,
        },
        lightStyle: {
            fill: '#ffffff',
            fillOpacity: 1,
            stroke: '#2c3542',
        },
    },
};
registerTheme('area', DEFAULT_AREA_THEME);
//# sourceMappingURL=theme.js.map