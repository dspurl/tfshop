import request from '@/plugins/request'
export function quantity() {
  return request({
    url: 'goodIndent/quantity',
    method: 'GET'
  })
}
