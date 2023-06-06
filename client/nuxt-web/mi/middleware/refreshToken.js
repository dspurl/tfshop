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
export default function ({ route, store, req, env }) {
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
    if (token) {
        store.commit('login',token)
    }
    // 排除登录页，不然登录无法重定向到原操作页
    const excludePath = ['/pass/login']
    if(excludePath.indexOf(route.path) === -1){
        stores.remove('route')
    }
}
