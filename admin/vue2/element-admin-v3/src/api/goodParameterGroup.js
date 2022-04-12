import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'goodParameterGroup',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameterGroup',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameterGroup/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'goodParameterGroup/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'goodParameterGroup/destroy/' + id,
    method: 'POST',
    data
  })
}
