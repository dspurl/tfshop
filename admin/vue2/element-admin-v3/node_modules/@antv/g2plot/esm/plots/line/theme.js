import { registerTheme } from '../../theme';
var LINE_ACTIVE_STYLE = function (_a) {
    var shape = _a.shape;
    var lineWidth = shape.attr('lineWidth') || 1;
    return { lineWidth: lineWidth + 1 };
};
var LINE_DISABLE_STYLE = function (_a) {
    var shape = _a.shape;
    var opacity = shape.attr('opacity') || 1;
    return { opacity: opacity * 0.2 };
};
var LINE_SELECTED_STYLE = function (_a) {
    var shape = _a.shape;
    var lineWidth = shape.attr('lineWidth') || 1;
    return { lineWidth: lineWidth + 2 };
};
registerTheme('line', {
    lineStyle: {
        normal: {},
        active: LINE_ACTIVE_STYLE,
        disable: LINE_DISABLE_STYLE,
        selected: LINE_SELECTED_STYLE,
    },
    pointStyle: {
        normal: {},
        active: {},
        disable: {},
        selected: {},
    },
});
//# sourceMappingURL=theme.js.map