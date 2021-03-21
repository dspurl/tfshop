import request from '@/plugins/request'
export function detail() {
  return request({
    url: 'user',
    method: 'GET'
  })
}
