"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_1 = require("../../theme");
var POINT_ACTIVE_STYLE = function (style) {
    var stroke = style.stroke || '#000';
    return {
        stroke: stroke,
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
theme_1.registerTheme('scatter', {
    pointStyle: {
        normal: {},
        active: POINT_ACTIVE_STYLE,
        selected: POINT_SELECTED_STYLE,
        inactive: POINT_INACTIVE_STYLE,
    },
});
//# sourceMappingURL=theme.js.map