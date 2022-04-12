import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'integralDrawLog',
    method: 'GET',
    params: query
  })
}
export function good(id) {
  return request({
    url: 'integralDrawLogGood/' + id,
    method: 'GET'
  })
}
