/*!
 * vue-bus v1.2.1
 * https://github.com/yangmingshan/vue-bus
 * @license MIT
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).VueBus=t()}(this,function(){"use strict";function e(e){var t=new e;Object.defineProperties(t,{on:{get:function(){return this.$on.bind(this)}},once:{get:function(){return this.$once.bind(this)}},off:{get:function(){return this.$off.bind(this)}},emit:{get:function(){return this.$emit.bind(this)}}}),Object.defineProperty(e,"bus",{get:function(){return t}}),Object.defineProperty(e.prototype,"$bus",{get:function(){return t}})}return"undefined"!=typeof window&&window.Vue&&window.Vue.use(e),e});