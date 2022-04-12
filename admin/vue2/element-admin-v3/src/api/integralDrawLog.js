import request from '@/utils/request'
export function getList(query) {
  return request({
    url: 'integralDrawLog',
    method: 'GET',
    params: query
  })
}
