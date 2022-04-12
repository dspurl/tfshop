import request from '@/utils/request'
export function getList(query) {
  return request({
    url: 'integralLog',
    method: 'GET',
    params: query
  })
}
