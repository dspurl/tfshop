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
export function getList(query) {
  return request({
    url: 'good',
    method: 'GET',
    params: query
  })
}
export function count() {
  return request({
    url: 'goodCount',
    method: 'GET'
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'good',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'good/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'good/destroy/' + id,
    method: 'POST',
    data
  })
}

export function detail(id) {
  return request({
    url: 'good/' + id,
    method: 'GET'
  })
}

export function state(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'good/state/' + id,
    method: 'POST',
    data
  })
}

export function specification(id) {
  return request({
    url: 'good/specification/' + id,
    method: 'GET'
  })
}

export function exports(data) {
  data = Qs.parse(data)
  return request({
    url: 'good/export/all',
    method: 'POST',
    data
  })
}
