import responsiveAxis from './axis';
import responsiveLabel from './label';
var preRenderResponsive = [];
var afterRenderResponsive = [
    { name: 'responsiveAxis', method: responsiveAxis },
    { name: 'responsiveLabel', method: responsiveLabel },
];
export default {
    preRender: preRenderResponsive,
    afterRender: afterRenderResponsive,
};
//# sourceMappingURL=index.js.map