/*!
 * vue-client-only v0.0.0-semantic-release
 * (c) 2021-present egoist <0x142857@gmail.com>
 * Released under the MIT License.
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):e.ClientOnly=n()}(this,function(){"use strict";return{name:"ClientOnly",functional:!0,props:{placeholder:String,placeholderTag:{type:String,default:"div"}},render:function(e,n){var o=n.parent,t=n.slots,l=n.props,r=t(),d=r.default;void 0===d&&(d=[]);var a=r.placeholder;return o._isMounted?d:(o.$once("hook:mounted",function(){o.$forceUpdate()}),l.placeholderTag&&(l.placeholder||a)?e(l.placeholderTag,{class:["client-only-placeholder"]},l.placeholder||a):d.length>0?d.map(function(){return e(!1)}):e(!1))}}});
//# sourceMappingURL=vue-client-only.min.js.map
