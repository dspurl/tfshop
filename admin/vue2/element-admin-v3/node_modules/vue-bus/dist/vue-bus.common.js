/*!
 * vue-bus v1.2.1
 * https://github.com/yangmingshan/vue-bus
 * @license MIT
 */
'use strict';

function VueBus(Vue) {
  var bus = new Vue();

  Object.defineProperties(bus, {
    on: {
      get: function get() {
        return this.$on.bind(this)
      }
    },
    once: {
      get: function get() {
        return this.$once.bind(this)
      }
    },
    off: {
      get: function get() {
        return this.$off.bind(this)
      }
    },
    emit: {
      get: function get() {
        return this.$emit.bind(this)
      }
    }
  });

  Object.defineProperty(Vue, 'bus', {
    get: function get() {
      return bus
    }
  });

  Object.defineProperty(Vue.prototype, '$bus', {
    get: function get() {
      return bus
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueBus);
}

module.exports = VueBus;
