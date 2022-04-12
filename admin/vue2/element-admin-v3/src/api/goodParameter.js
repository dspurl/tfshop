import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'goodParameter',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameter',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameter/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'goodParameter/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameter/destroy/' + id,
    method: 'POST',
    data
  })
}
