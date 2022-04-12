import request from '@/plugins/request'
import Qs from 'qs'
export function detail(id) {
  return request({
    url: 'comment/detail/' + id,
    method: 'GET'
  })
}
export function good(query) {
  return request({
    url: 'comment/good',
    method: 'GET',
    params: query
  })
}
export function create(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'comment/' + id,
    method: 'POST',
    data
  })
}
