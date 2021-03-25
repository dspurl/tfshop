import request from '@/plugins/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'collect',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'collect/' + id,
    method: 'GET'
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'collect',
    method: 'POST',
    data
  })
}
export function destroy(id) {
  return request({
    url: 'collect/destroy/' + id,
    method: 'POST'
  })
}
