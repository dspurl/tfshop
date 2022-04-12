import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'integralCommodity',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralCommodity',
    method: 'POST',
    data
  })
}
export function edit(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'integralCommodity/' + id,
    method: 'POST',
    data
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'integralCommodity/destroy/' + id,
    method: 'POST',
    data
  })
}
