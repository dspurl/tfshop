"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../theme");
var BAR_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
var BAR_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
theme_1.registerTheme('funnel', {
    columnStyle: {
        normal: {},
        active: BAR_ACTIVE_STYLE,
        disable: BAR_DISABLE_STYLE,
        selected: { lineWidth: 1, stroke: 'black' },
    },
});
//# sourceMappingURL=theme.js.map