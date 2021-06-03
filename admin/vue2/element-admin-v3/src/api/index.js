import request from '@/utils/request'
export function indexList() {
  return request({
    url: 'index',
    method: 'GET'
  })
}
