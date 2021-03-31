import request from '@/plugins/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'shipping',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'shipping',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'shipping/' + data.id,
    method: 'POST',
    data
  })
}
export function destroy(id) {
  return request({
    url: 'shipping/destroy/' + id,
    method: 'POST'
  })
}
export function freight(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'shipping/freight/'+id,
    method: 'POST',
    data
  })
}
export function defaultSet(data) {
  data = Qs.parse(data)
  return request({
    url: 'shipping/default/set',
    method: 'POST',
    data
  })
}
