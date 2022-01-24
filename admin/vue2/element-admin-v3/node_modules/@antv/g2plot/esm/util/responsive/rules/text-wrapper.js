export default function textWrapper(shape, option) {
    var text = shape.attr('text');
    var step = Math.ceil(text.length / option.lineNumber);
    var wrapperText = '';
    for (var i = 1; i < option.lineNumber; i++) {
        var index = step * i;
        wrapperText = text.slice(0, index) + "\n" + text.slice(index);
    }
    var fontSize = shape.attr('fontSize');
    shape.attr({
        text: wrapperText,
        lineHeight: fontSize,
        textAlign: 'center',
        textBaseline: 'top',
    });
}
//# sourceMappingURL=text-wrapper.js.map