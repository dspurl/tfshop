"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function textRotation(shape, option) {
    shape.resetMatrix();
    shape.attr({
        rotate: 360 - option.degree,
        textAlign: 'right',
        textBaseline: 'middle',
    });
}
exports.default = textRotation;
//# sourceMappingURL=text-rotation.js.map