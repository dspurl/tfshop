import responsiveAxis from './axis';
import responsivePointLabel from './label';
var preRenderResponsive = [];
var afterRenderResponsive = [
    { name: 'responsiveAxis', method: responsiveAxis },
    { name: 'responsivePointLabel', method: responsivePointLabel },
];
export default {
    preRender: preRenderResponsive,
    afterRender: afterRenderResponsive,
};
//# sourceMappingURL=index.js.map