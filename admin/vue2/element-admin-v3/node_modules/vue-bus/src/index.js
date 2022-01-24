function VueBus(Vue) {
  const bus = new Vue()

  Object.defineProperties(bus, {
    on: {
      get() {
        return this.$on.bind(this)
      }
    },
    once: {
      get() {
        return this.$once.bind(this)
      }
    },
    off: {
      get() {
        return this.$off.bind(this)
      }
    },
    emit: {
      get() {
        return this.$emit.bind(this)
      }
    }
  })

  Object.defineProperty(Vue, 'bus', {
    get() {
      return bus
    }
  })

  Object.defineProperty(Vue.prototype, '$bus', {
    get() {
      return bus
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueBus)
}

export default VueBus
