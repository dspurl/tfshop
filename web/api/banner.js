import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'banner',
    method: 'GET',
    params: query
  })
}
