export default {
  staticKeys: ['staticI18n'],

  preTransformNode (el, options) {
    console.log('preTransformNode', el.tag)
  },

  transformNode (el, options) {
    console.log('transformNode', el.tag)
  },

  postTransformNode (el, options) {
    console.log('postTransformNode', el.tag, el.parent ? el.parent.children : '')
  },

  genData (el) {
    console.log('genData', el.tag)
    return ''
  },

  transformCode (el, code) {
    debugger
    console.log('transformCode', el.tag, code)
    return code
  }
}
