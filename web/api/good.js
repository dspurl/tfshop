import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'good',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'good/' + id,
    method: 'GET'
  })
}
export function goodCategory(query) {
  return request({
    url: 'goodCategory',
    method: 'GET',
    params: query
  })
}
