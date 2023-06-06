/*!
 * vue-no-ssr v1.1.1
 * (c) 2018-present egoist <0x142857@gmail.com>
 * Released under the MIT License.
 */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):e.NoSSR=o()}(this,function(){"use strict";return{name:"NoSsr",functional:!0,props:{placeholder:String,placeholderTag:{type:String,default:"div"}},render:function(e,o){var n=o.parent,t=o.slots,r=o.props,d=t(),l=d.default;void 0===l&&(l=[]);var a=d.placeholder;return n._isMounted?l:(n.$once("hook:mounted",function(){n.$forceUpdate()}),r.placeholderTag&&(r.placeholder||a)?e(r.placeholderTag,{class:["no-ssr-placeholder"]},r.placeholder||a):l.length>0?l.map(function(){return e(!1)}):e(!1))}}});
//# sourceMappingURL=vue-no-ssr.min.js.map
