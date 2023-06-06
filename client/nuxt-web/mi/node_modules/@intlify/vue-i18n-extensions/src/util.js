const parser = require('@babel/parser')

function warn (msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-i18n-extensions] ' + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}

const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name, value })
}

function getAttr (el, name) {
  return el.attrsMap[name]
}

function removeAttr (el, name) {
  if ((el.attrsMap[name]) !== null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
}

function evaluateValue (expression) {
  const ret = { status: 'ng', value: undefined }

  try {
    const ast = parser.parse(`const a = ${expression.trim()}`)
    const node = ast.program.body[0].declarations[0].init
    if (node.type === 'StringLiteral' || node.type === 'ObjectExpression') {
      const val = (new Function(`return ${expression.trim()}`))()
      ret.status = 'ok'
      ret.value = val
    }
  } catch (e) { }

  return ret
}

module.exports = {
  warn,
  isPlainObject,
  addProp,
  getAttr,
  removeAttr,
  evaluateValue
}
