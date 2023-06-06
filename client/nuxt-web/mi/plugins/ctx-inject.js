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
        ctx.error({ statusCode: 500, message: `The server went astray~` })
      }
    } catch {
      ctx.error({ statusCode: 500, message: `The server went astray~` })
    }
  }
}
