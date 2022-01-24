import { registerTheme } from '../../theme';
var COLUMN_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
var COLUMN_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5, fillOpacity: opacity * 0.5 };
};
export var DEFAULT_COLUMN_THEME = {
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
        active: COLUMN_ACTIVE_STYLE,
        disable: COLUMN_DISABLE_STYLE,
        selected: { lineWidth: 1, stroke: 'black' },
    },
};
registerTheme('column', DEFAULT_COLUMN_THEME);
//# sourceMappingURL=theme.js.map