import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'groupPurchase',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'groupPurchase',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'groupPurchase/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'groupPurchase/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'groupPurchase/destroy/' + id,
    method: 'POST',
    data
  })
}
export function info(id) {
  return request({
    url: 'groupPurchaseInfo/' + id,
    method: 'GET'
  })
}
