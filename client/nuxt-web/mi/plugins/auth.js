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
import Cookies from 'js-cookie'
const TokenPr = process.env.CACHE_PR

export function getToken(key) {
  return Cookies.get(TokenPr + key)
}

export function setToken(key, token, time = 0) {
  let expires = {}
  if (time) {
    expires = { expires: time }
  }
  if (key) {
    return Cookies.set(TokenPr + key, token, expires)
  } else {
    return Cookies.set(TokenPr, token, expires)
  }
}

export function removeToken(key) {
  return Cookies.remove(TokenPr + key)
}
