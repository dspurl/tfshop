import ApplyResponsiveAxis from '../../../util/responsive/apply/axis';
export default function responsiveAxis(layer) {
    var responsiveTheme = layer.getResponsiveTheme();
    var canvas = layer.canvas;
    // x-axis
    new ApplyResponsiveAxis({
        plot: layer,
        responsiveTheme: responsiveTheme,
        dim: 'x',
    });
    // y-axis
    new ApplyResponsiveAxis({
        plot: layer,
        responsiveTheme: responsiveTheme,
        dim: 'y',
    });
    canvas.draw();
}
//# sourceMappingURL=axis.js.map