import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'comment',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'comment',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'comment/' + data.id,
    method: 'POST',
    data
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'comment/destroy/' + id,
    method: 'POST',
    data
  })
}
