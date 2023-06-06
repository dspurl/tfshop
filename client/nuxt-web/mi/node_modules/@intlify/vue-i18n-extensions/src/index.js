const {
  warn,
  isPlainObject,
  addProp,
  getAttr,
  removeAttr,
  evaluateValue
} = require('./util')

function directive (vnode, dir) {
  const value = dir.value

  const { path, locale, args } = parseValue(value)
  if (!path && !locale && !args) {
    warn('not support value type')
    return
  }

  const vm = vnode.context
  if (!path) {
    warn('required `path` in v-t directive')
    return
  }

  if (!vm) {
    warn('Vue instance does not exists in VNode context')
    return
  }

  if (!vm.$i18n) {
    warn('VueI18n instance does not exists in Vue instance')
    return
  }

  const params = makeParams(locale, args)
  vnode.children = [vm._v(vm.$i18n.t(path, ...params))]
}

function compilerModule (i18n) {
  return {
    transformNode: function (el) {
      const exp = getAttr(el, 'v-t')
      if (!exp) { return }

      const { status, value } = evaluateValue(exp)
      if (status === 'ng') {
        warn('not support params in pre-localization')
        return
      }

      const { path, locale, args } = parseValue(value)
      if (!path && !locale && !args) {
        warn('not support value type')
        return
      }

      const params = makeParams(locale, args)
      el.i18n = i18n.t(path, ...params)

      removeAttr(el, 'v-t')
    },

    genData: function (el) {
      if (el.i18n) {
        addProp(el, 'textContent', `_s(${JSON.stringify(el.i18n)})`) // generate via 'domProps'
        el.children = [] // clear children, due to be inserted with textContet
      }
      return ''
    }
  }
}

function parseValue (value) {
  let path, locale, args

  if (typeof value === 'string') {
    path = value
  } else if (isPlainObject(value)) {
    path = value.path
    locale = value.locale
    args = value.args
  }

  return { path, locale, args }
}

function makeParams (locale, args) {
  const params = []

  locale && params.push(locale)
  if (args && (Array.isArray(args) || isPlainObject(args))) {
    params.push(args)
  }

  return params
}

module.exports = {
  directive,
  module: compilerModule
}
