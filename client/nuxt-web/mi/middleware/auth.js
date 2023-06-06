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
export default function ({route, redirect, store, req, env}) {
  const stores = require('store')
  function getcookiesInServer(req) {
    let service_cookie = {};
    req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
      let parts = val.split('=');
      service_cookie[parts[0].trim()] = (parts[1] || '').trim();
    });
    return service_cookie;
  }
  let token = null
  if(process.server){ //服务端获取header头的cookie
    token = getcookiesInServer(req)[env.CACHE_PR + 'token']
  }else{
    token = getToken('token')
  }
  if (!token) {
    stores.set('route', { path:route.path, query:route.query })
    // 删除本地缓存
    store.commit('logout')
    return redirect('/pass/login')
  }else{
    store.commit('login',token)
  }
}
