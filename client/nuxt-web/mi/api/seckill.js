import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'seckill',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'seckill/' + id,
    method: 'GET'
  })
}
