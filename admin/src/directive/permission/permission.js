
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    var { value } = binding
    const roles = store.getters && store.getters.roles
    // 当前无该权限时，用空数组代替为无权限
    if (!value || value.length === 0) {
      value = ['']
    }
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
