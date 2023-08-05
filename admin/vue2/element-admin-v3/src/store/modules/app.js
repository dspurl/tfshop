import { getToken, setToken } from '@/utils/auth'

const app = {
  state: {
    sidebar: {
      opened: getToken('sidebarStatus') ? !!+getToken('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    language: getToken('language') || 'zh',
    size: getToken('size') || 'medium',
    lang_list: getToken('lang_list') ? JSON.parse(getToken('lang_list')) : []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        setToken('sidebarStatus', 1)
      } else {
        setToken('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      setToken('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setToken('language', language, 31536000)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      setToken('size', size)
    },
    SET_LANG_LIST(state, lang_list) {
      setToken('lang_list', JSON.stringify(lang_list), 31536000)
      state.lang_list = lang_list
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    setLangList({ commit }, lang) {
      commit('SET_LANG_LIST', lang)
    }
  }
}

export default app
