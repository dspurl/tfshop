import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'moneyLog',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'moneyLog/' + id,
    method: 'GET'
  })
}
