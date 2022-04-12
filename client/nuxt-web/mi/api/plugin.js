import request from '@/plugins/request'
export function verifyPlugin(id) {
  return request({
    url: 'verifyPlugin/' + id,
    method: 'POST'
  })
}
