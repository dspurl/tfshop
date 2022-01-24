export default function textAbbreviate(shape, option) {
    var abbreviateBy = option.abbreviateBy ? option.abbreviateBy : 'end';
    var text = shape.attr('text');
    var abbravateText;
    if (abbreviateBy === 'end') {
        abbravateText = text[0] + "...";
    }
    if (abbreviateBy === 'start') {
        abbravateText = "..." + text[text.length - 1];
    }
    if (abbreviateBy === 'middle') {
        abbravateText = text[0] + "..." + text[text.length - 1];
    }
    shape.resetMatrix();
    shape.attr({
        text: abbravateText,
        textAlign: 'center',
        textBaseline: 'top',
    });
}
//# sourceMappingURL=text-abbreviate.js.map