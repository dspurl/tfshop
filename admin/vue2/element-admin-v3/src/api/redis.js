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
import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'redis',
    method: 'GET',
    params: query
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'redis/destroy/' + id,
    method: 'POST',
    data
  })
}
export function detail(id, data) {
  return request({
    url: 'redis/' + id,
    method: 'GET',
    params: data
  })
}
export function panel() {
  return request({
    url: 'redisPanel',
    method: 'GET'
  })
}
