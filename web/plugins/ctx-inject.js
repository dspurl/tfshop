// 为context注册全局的错误处理事件
export default (ctx, inject) => {
  ctx.$errorHandler = err => {
    try {
      const res = err.data
      if (res) {
        // 由于nuxt的错误页面只能识别http的状态码，因此statusCode统一传500，表示服务器异常。
        ctx.error({ statusCode: 500, message: res.resultInfo })
      } else {
        ctx.error({ statusCode: 500, message: '服务器开小差了~' })
      }
    } catch {
      ctx.error({ statusCode: 500, message: '服务器开小差了~' })
    }
  }
}
