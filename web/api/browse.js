import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'browse',
    method: 'GET',
    params: query
  })
}
