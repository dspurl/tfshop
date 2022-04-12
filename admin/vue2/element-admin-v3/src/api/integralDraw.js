import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'integralDraw',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralDraw',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralDraw/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'integralDraw/' + id,
    method: 'GET'
  })
}
export function good(query) {
  return request({
    url: 'integralDrawGood',
    method: 'GET',
    params: query
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'integralDraw/destroy/' + id,
    method: 'POST',
    data
  })
}
