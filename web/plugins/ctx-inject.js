// 为context注册全局的错误处理事件
import { Message } from 'element-ui'
export default (ctx, inject) => {
  ctx.$errorHandler = err => {
    try {
      const res = err.response.data
      if (res) {
        // 由于nuxt的错误页面只能识别http的状态码，因此statusCode统一传500，表示服务器异常。
        ctx.error({ statusCode: 500, message: res.message })
        if (process.env.APP_DEBUG) {
          console.log('服务器错误信息：',res)
        }
      } else {
        if (process.env.APP_DEBUG) {
          console.log('context信息：',err)
        }
        ctx.error({ statusCode: 500, message: '服务器开小差了~' })
      }
    } catch {
      ctx.error({ statusCode: 500, message: '服务器开小差了~' })
    }
  }
}
