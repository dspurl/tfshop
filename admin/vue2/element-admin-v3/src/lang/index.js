import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getToken, setToken } from '@/utils/auth'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en.json'
import zhLocale from './zh.json'

Vue.use(VueI18n)

const messages = {
  zh: Object.assign(zhLocale, elementZhLocale),
  en: Object.assign(enLocale, elementEnLocale)
}
const navLang = navigator.language || navigator.userLanguage
let locale = 'zh'
if (getToken('language')) {
  locale = getToken('language')
} else if (typeof (messages[navLang]) === 'object') { // 是否在设置的语言包中
  locale = navLang
  setToken('language', locale, 31536000)
} else {
  setToken('language', locale, 31536000)
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: locale,
  // set locale messages
  messages
})

export default i18n
