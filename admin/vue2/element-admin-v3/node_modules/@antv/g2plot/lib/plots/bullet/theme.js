"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../theme");
var BULLET_ACTIVE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5, lineWidth: 0 };
};
var BULLET_DISABLE_STYLE = function (style) {
    var opacity = style.opacity || 1;
    return { opacity: opacity * 0.5 };
};
theme_1.registerTheme('bullet', {
    columnStyle: {
        normal: {},
        active: BULLET_ACTIVE_STYLE,
        disable: BULLET_DISABLE_STYLE,
        selected: {},
    },
});
//# sourceMappingURL=theme.js.map