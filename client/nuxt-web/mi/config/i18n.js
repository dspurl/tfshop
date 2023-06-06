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
import en from './lang/en.json'
import zh from './lang/zh.json'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
export default {
  //   locale: getToken('lang') || 'zh',
  defaultLocale: 'zh',
  // 根据项目情况，酌情配置
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English'
    },
    {
      code: 'zh',
      iso: 'zh-CN',
      name: '中文'
    }
  ],
  detectBrowserLanguage: {
    useCookie: true,
    alwaysRedirect: true,
    cookieKey: process.env.CACHE_PR + 'lang'
  },
  vueI18n: {
    fallbackLocale: 'zh',
    messages: {
      zh: Object.assign(zh, elementZhLocale),
      en: Object.assign(en, elementEnLocale)
    }
  }
}
