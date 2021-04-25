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