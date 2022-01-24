"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../theme");
var PIE_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { fillOpacity: opacity * 0.8 };
};
var PIE_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { fillOpacity: opacity * 0.5 };
};
theme_1.registerTheme('pie', {
    columnStyle: {
        normal: {},
        active: PIE_ACTIVE_STYLE,
        disable: PIE_DISABLE_STYLE,
        selected: { lineWidth: 1, stroke: 'black' },
    },
});
//# sourceMappingURL=theme.js.map