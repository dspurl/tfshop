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
