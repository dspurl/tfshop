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
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en.json'
import zhLocale from './zh.json'

Vue.use(VueI18n)

const messages = {
  zh: zhLocale,
  en: enLocale
}
const navLang = uni.getLocale()
let locale = 'zh'
if (uni.getStorageSync('language')) {
  locale = uni.getStorageSync('language')
} else if (typeof (messages[navLang]) === 'object') { // 是否在设置的语言包中
  locale = navLang
  uni.setStorageSync('language', locale, 31536000)
} else {
  uni.setStorageSync('language', locale, 31536000)
}
const i18n = new VueI18n({
  locale: locale,
  messages
})

export default i18n
