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
