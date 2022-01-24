import { registerTheme } from '../../theme';
var BAR_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
var BAR_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
export var DEFAULT_BAR_THEME = {
    label: {
        darkStyle: {
            fill: '#2c3542',
            stroke: '#ffffff',
            fillOpacity: 0.85,
        },
        lightStyle: {
            fill: '#ffffff',
            stroke: '#ffffff',
            fillOpacity: 1,
        },
    },
    columnStyle: {
        normal: {},
        active: BAR_ACTIVE_STYLE,
        disable: BAR_DISABLE_STYLE,
        selected: { lineWidth: 1, stroke: 'black' },
    },
};
registerTheme('bar', DEFAULT_BAR_THEME);
//# sourceMappingURL=theme.js.map