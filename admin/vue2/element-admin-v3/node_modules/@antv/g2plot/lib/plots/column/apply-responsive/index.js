"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axis_1 = tslib_1.__importDefault(require("./axis"));
var label_1 = tslib_1.__importDefault(require("./label"));
var preRenderResponsive = [];
var afterRenderResponsive = [
    { name: 'responsiveAxis', method: axis_1.default },
    { name: 'responsiveLabel', method: label_1.default },
];
exports.default = {
    preRender: preRenderResponsive,
    afterRender: afterRenderResponsive,
};
//# sourceMappingURL=index.js.map