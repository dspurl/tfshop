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
export function getList(query) {
  return request({
    url: 'notification',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'notification/detail/' + id,
    method: 'GET'
  })
}
export function unread(query) {
  return request({
    url: 'notification/unread',
    method: 'GET',
    params: query
  })
}
export function read(data) {
  data = Qs.parse(data)
  return request({
    url: 'notification/read/0',
    method: 'POST',
    data
  })
}
export function destroy(data) {
  data = Qs.parse(data)
  return request({
    url: 'notification/destroy/0',
    method: 'POST',
    data
  })
}
