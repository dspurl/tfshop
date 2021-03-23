import request from '@/plugins/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'collect',
    method: 'GET',
    params: query
  })
}
export function destroy(id) {
  return request({
    url: 'collect/destroy/' + id,
    method: 'POST'
  })
}
