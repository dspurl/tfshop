const store = require('store')
import { getToken, setToken, removeToken } from '@/plugins/auth'
export const state = () => ({
  hasLogin: false
})

export const mutations = {
  login(state, provider) {
    if(provider){
      state.hasLogin = true
      // 登录时才需要保存数据
      if(provider.api_token){
        setToken('token',provider.api_token)
        store.set(process.env.CACHE_PR + 'UserInfo', provider)
      }
    }
  },
  logout(state) {
    store.remove(process.env.CACHE_PR + 'ApplyToken')
    store.remove(process.env.CACHE_PR + 'SessionKey')
    store.remove(process.env.CACHE_PR + 'Openid')
    store.remove(process.env.CACHE_PR + 'UserInfo')
    store.remove(process.env.CACHE_PR + 'CartList')
    removeToken('token')
    state.hasLogin = false;
    state.userInfo = {};
  },
  loginCheck(state, t){
    if(!state.hasLogin){
      store.set('route', { path: t.$route.path, query: t.$route.query })
      t.$router.replace('/pass/login')
    }
  }
}
