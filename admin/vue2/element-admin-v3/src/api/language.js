/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import request from '@/utils/request'
import Qs from 'qs'
export function lang(query) {
  return request({
    url: 'lang',
    method: 'GET',
    params: query
  })
}

export function getList(query) {
  return request({
    url: 'language',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'language',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'language/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'language/destroy/' + id,
    method: 'POST',
    data
  })
}
