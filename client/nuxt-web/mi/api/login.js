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
import request from '@/plugins/request'
import Qs from 'qs'
export function login(data) {
  data = Qs.parse(data)
  return request({
    url: 'login',
    method: 'POST',
    data
  })
}
export function refreshToken(data) {
  data = Qs.parse(data)
  return request({
    url: 'refreshToken',
    method: 'POST',
    data
  })
}
export function cellphoneCode(data) {
  data = Qs.parse(data)
  return request({
    url: 'cellphoneCode',
    method: 'POST',
    data
  })
}
export function emailCode(data) {
  data = Qs.parse(data)
  return request({
    url: 'emailCode',
    method: 'POST',
    data
  })
}
export function verifyEmail(data) {
  data = Qs.parse(data)
  return request({
    url: 'verifyEmail',
    method: 'POST',
    data
  })
}
export function changeCellphone(data) {
  data = Qs.parse(data)
  return request({
    url: 'changeCellphone',
    method: 'POST',
    data
  })
}
export function register(data) {
  data = Qs.parse(data)
  return request({
    url: 'register',
    method: 'POST',
    data
  })
}
