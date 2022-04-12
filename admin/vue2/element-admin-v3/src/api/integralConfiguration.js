import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'integralConfiguration',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralConfiguration',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralConfiguration/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'integralConfiguration/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'integralConfiguration/destroy/' + id,
    method: 'POST',
    data
  })
}
