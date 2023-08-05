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
export default function ({store, route, redirect, req, env}) {
  function getcookiesInServer(req) {
    let service_cookie = {};
    req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
      let parts = val.split('=');
      service_cookie[parts[0].trim()] = (parts[1] || '').trim();
    });
    return service_cookie;
  }
  let lang = null
  if(process.server){ //服务端获取header头的cookie
    lang = getcookiesInServer(req)[env.CACHE_PR + 'lang']
  }else{
    lang = getToken('lang')
  }
  if (lang) {
    store.commit('setLang', lang)
  }
  const routePath = route.path
  if (store.state.lang !== 'zh' && routePath.indexOf(`/${store.state.lang}`) === -1) {
    return redirect({path: `/${store.state.lang}${routePath}`, query: route.query})
  }
}
