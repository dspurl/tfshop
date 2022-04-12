import request from '@/utils/request'
export function getList(query) {
  return request({
    url: 'integral',
    method: 'GET',
    params: query
  })
}
