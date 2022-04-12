import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'integralDraw',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'integralDraw/' + id,
    method: 'GET'
  })
}
export function winning(id) {
  return request({
    url: 'integralWinning/' + id,
    method: 'GET'
  })
}
