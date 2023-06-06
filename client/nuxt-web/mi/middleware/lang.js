/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import { getToken } from '@/plugins/auth'
export default function ({store, route, redirect}) {
  const lang = getToken('lang')
  if (lang) {
    store.commit('setLang', lang)
  }
  const routePath = route.path
  if (store.state.lang !== 'zh' && routePath.indexOf(`/${store.state.lang}`) === -1) {
    return redirect({path: `/${store.state.lang}${routePath}`, query: route.query})
  }
}
