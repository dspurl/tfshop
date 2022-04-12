import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'column',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'column',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'column/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'column/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'column/destroy/' + id,
    method: 'POST',
    data
  })
}
