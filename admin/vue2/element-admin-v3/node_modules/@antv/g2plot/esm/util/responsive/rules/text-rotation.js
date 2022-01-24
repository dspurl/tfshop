export default function textRotation(shape, option) {
    shape.resetMatrix();
    shape.attr({
        rotate: 360 - option.degree,
        textAlign: 'right',
        textBaseline: 'middle',
    });
}
//# sourceMappingURL=text-rotation.js.map