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
import { refreshToken } from '@/api/login'
export default ({ app }) => {
  app.router.afterEach(async(to, from) => {
    if (getToken('expires_in')) {
      if ((new Date()).getTime() >= getToken('expires_in') - 300 * 1000) { // token失效前5分钟会自动刷新token
        await refreshToken({
          refresh_token: getToken('refresh_token')
        }).then(response => {
          $nuxt.$store.commit('login',response)
        })
      }
    }
  })
}
