const store = require('store');
import { setToken, removeToken } from '@/plugins/auth'
export const state = () => ({
  hasLogin: false,
  cartTitle: '',
  shoppingCartNumber: 0,
  searchKeyword: ''
})

export const mutations = {
  login(state, provider) {
    if(provider){
      state.hasLogin = true;
      // 登录时才需要保存数据
      if(provider.api_token){
        setToken('token',provider.api_token);
        store.set(process.env.CACHE_PR + 'UserInfo', provider)
      }
    }
  },
  setShoppingCartNumber(state, provider) {
    state.shoppingCartNumber = provider
  },
  setSearchKeyword(state, provider) {
    state.searchKeyword = provider
  },
  logout(state) {
    store.remove(process.env.CACHE_PR + 'ApplyToken');
    store.remove(process.env.CACHE_PR + 'SessionKey');
    store.remove(process.env.CACHE_PR + 'Openid');
    store.remove(process.env.CACHE_PR + 'UserInfo');
    store.remove(process.env.CACHE_PR + 'CartList');
    removeToken('token');
    state.hasLogin = false;
    state.userInfo = {};
  },
  loginCheck(state){
    if(!state.hasLogin){
      store.set('route', { path: $nuxt.$route.path, query: $nuxt.$route.query });
      $nuxt.$router.replace('/pass/login');
      $nuxt.$message.warning('请先登录')
    }
  },
  setCartTitle(state, provider){
    state.cartTitle = provider
  }
}
