import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'article',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'article',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'article/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'article/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'article/destroy/' + id,
    method: 'POST',
    data
  })
}
