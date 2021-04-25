/**
 * 如果是移动端访问，直接跳到h5地址
 * @param context
 * @returns {undefined|*|RawLocation|Response}
 */
export default function (context) {
  context.userAgent = process.server
    ? context.req.headers["user-agent"]
    : navigator.userAgent;
  let flag = context.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  if(flag){
    return context.redirect(context.env.H5_URL)
  }
}
