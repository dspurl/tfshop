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
    url: 'goodIndent',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'goodIndent/detail/' + id,
    method: 'GET'
  })
}
export function quantity() {
  return request({
    url: 'goodIndent/quantity',
    method: 'GET'
  })
}
export function pay(id) {
  return request({
    url: 'goodIndent/pay/' + id,
    method: 'GET'
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodIndent',
    method: 'POST',
    data
  })
}
export function addShoppingCart(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodIndent/addShoppingCart',
    method: 'POST',
    data
  })
}
export function synchronizationInventory() {
  return request({
    url: 'goodIndent/synchronizationInventory',
    method: 'POST'
  })
}
export function cancel(id) {
  return request({
    url: 'goodIndent/cancel/' + id,
    method: 'POST'
  })
}
export function destroy(id) {
  return request({
    url: 'goodIndent/destroy/' + id,
    method: 'POST'
  })
}
export function receipt(id) {
  return request({
    url: 'goodIndent/receipt/' + id,
    method: 'POST'
  })
}
export function download(id) {
  return request({
    url: 'goodIndent/download/' + id,
    method: 'POST'
  })
}
