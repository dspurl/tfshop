export const state = () => ({
  hasLogin: false,
  userInfo: {}
})

export const mutations = {
  login(state, provider) {
    state.hasLogin = true
    state.userInfo = provider;
    localStorage.setItem('dsshopUserInfo', provider)
  },
  logout(state) {
    localStorage.removeItem('dsshopApplytoken')
    localStorage.removeItem('applyDsshopSession_key')
    localStorage.removeItem('applyDsshopOpenid')
    localStorage.removeItem('dsshopUserInfo')
    localStorage.removeItem('dsshopCartList')
    state.hasLogin = false;
    state.userInfo = {};
  }
}
