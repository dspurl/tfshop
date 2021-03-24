import request from '@/plugins/request'
import Qs from 'qs'
export function quantity() {
  return request({
    url: 'goodIndent/quantity',
    method: 'GET'
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
