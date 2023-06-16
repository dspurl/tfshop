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
const store = require('store');
import { setToken, removeToken } from '@/plugins/auth'
export const state = () => ({
  hasLogin: false,
  cartTitle: '',
  shoppingCartNumber: 0,
  lang: 'zh'
})

export const mutations = {
  login(state, provider) {
    if(provider){
      state.hasLogin = true;
      // 登录时才需要保存数据
      let refresh_expires_in = 0
      if (provider.remember) {
        refresh_expires_in = provider.refresh_expires_in ? provider.refresh_expires_in : 0
      }
      if(provider.access_token){
        setToken('token',provider.access_token, refresh_expires_in);
        setToken('expires_in', (new Date()).getTime() + provider.expires_in * 1000, refresh_expires_in)
        setToken('refresh_token',provider.refresh_token, refresh_expires_in);
        setToken('token_type',provider.token_type, refresh_expires_in);
        if (provider.cellphone) {
          store.set(process.env.CACHE_PR + 'UserInfo', provider)
        }
      }
    }
  },
  setShoppingCartNumber(state, provider) {
    state.shoppingCartNumber = provider
  },
  logout(state) {
    store.remove(process.env.CACHE_PR + 'ApplyToken');
    store.remove(process.env.CACHE_PR + 'SessionKey');
    store.remove(process.env.CACHE_PR + 'Openid');
    store.remove(process.env.CACHE_PR + 'UserInfo');
    store.remove(process.env.CACHE_PR + 'CartList');
    removeToken('token');
    removeToken('expires_in');
    removeToken('refresh_token');
    removeToken('token_type');
    state.hasLogin = false;
    state.userInfo = {};
  },
  loginCheck(state){
    if(!state.hasLogin){
      store.set('route', { path: $nuxt.$route.path, query: $nuxt.$route.query });
      $nuxt.$router.replace('/pass/login');
      $nuxt.$message.warning($nuxt.$t('login.please_login_first'))
    }
  },
  setCartTitle(state, provider){
    state.cartTitle = provider
  },
  setLang(state, lang) {
    state.lang = lang
  }
}
