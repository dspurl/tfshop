import request from '@/plugins/request'
import Qs from 'qs'
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
