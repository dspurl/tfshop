import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'good',
    method: 'GET',
    params: query
  })
}
