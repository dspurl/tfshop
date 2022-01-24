"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axis_1 = tslib_1.__importDefault(require("../../../util/responsive/apply/axis"));
function responsiveAxis(layer) {
    var responsiveTheme = layer.getResponsiveTheme();
    var canvas = layer.canvas;
    // x-axis
    new axis_1.default({
        plot: layer,
        responsiveTheme: responsiveTheme,
        dim: 'x',
    });
    // y-axis
    new axis_1.default({
        plot: layer,
        responsiveTheme: responsiveTheme,
        dim: 'y',
    });
    canvas.draw();
}
exports.default = responsiveAxis;
//# sourceMappingURL=axis.js.map